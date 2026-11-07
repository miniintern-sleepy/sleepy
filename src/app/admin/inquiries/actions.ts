"use server";

import { refresh } from "next/cache";

import { sendInquiryReply } from "@/lib/mail/send";
import { normalizeReply, replyError } from "@/lib/mail/template";

import { requireAdmin } from "../_lib/auth";
import { failedReplyMessage, type ReplyState } from "./_lib/form";
import { inquiryColumns, isInquiryId, type InquiryRow } from "./_lib/queries";

function reference(form: FormData) {
  const id = form.get("id");
  const attemptValue = form.get("attempt");
  if (
    typeof id !== "string" ||
    !isInquiryId(id) ||
    typeof attemptValue !== "string" ||
    !/^\d+$/.test(attemptValue)
  )
    return null;
  const attempt = Number(attemptValue);
  return Number.isSafeInteger(attempt) && attempt >= 0 && attempt < 2147483647
    ? { id, attempt }
    : null;
}

/** 답변을 저장·선점한 뒤 보내며, 같은 답변 재시도는 기존 중복 방지 키를 유지한다. */
export async function replyToInquiry(
  _previous: ReplyState,
  form: FormData,
): Promise<ReplyState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const ref = reference(form);
  const raw = form.get("body");
  const body = normalizeReply(typeof raw === "string" ? raw : "");
  const bodyError = replyError(body);
  if (!ref || bodyError)
    return {
      ok: false,
      reason: "invalid",
      fieldErrors: {
        ...(!ref
          ? {
              id: "문의 번호와 시도를 확인해 주세요. 새로고침 후 다시 시도해 주세요.",
            }
          : {}),
        body: bodyError,
      },
    };

  const client = access.client;
  let claimedAttempt: number | undefined;
  try {
    const { data: inquiry, error } = await client
      .from("inquiries")
      .select(inquiryColumns)
      .eq("id", ref.id)
      .maybeSingle<InquiryRow>();
    if (error) return { ok: false, reason: "server" };
    if (!inquiry) return { ok: false, reason: "notFound" };
    if (inquiry.status !== "new") return { ok: false, reason: "answered" };
    if (
      inquiry.reply_status === "sending" ||
      inquiry.reply_attempt !== ref.attempt
    )
      return { ok: false, reason: "conflict" };
    if (
      inquiry.reply_status === "failed" &&
      form.get("checkedDelivery") !== "on"
    )
      return { ok: false, reason: "invalid", message: failedReplyMessage };
    const attempt =
      inquiry.reply_body === body && inquiry.reply_attempt > 0
        ? inquiry.reply_attempt
        : inquiry.reply_attempt + 1;
    const { data: claimed, error: claimError } = await client
      .from("inquiries")
      .update({
        reply_body: body,
        reply_status: "sending",
        reply_attempt: attempt,
        reply_email_id: null,
      })
      .eq("id", ref.id)
      .eq("status", "new")
      .eq("reply_attempt", inquiry.reply_attempt)
      .or("reply_status.is.null,reply_status.neq.sending")
      .select("id")
      .maybeSingle();
    if (claimError) return { ok: false, reason: "server" };
    if (!claimed) return { ok: false, reason: "conflict" };
    claimedAttempt = attempt;

    const result = await sendInquiryReply(inquiry, body, attempt);
    if (!result.ok) {
      await client
        .from("inquiries")
        .update({ reply_status: "failed" })
        .eq("id", ref.id)
        .eq("status", "new")
        .eq("reply_status", "sending")
        .eq("reply_attempt", attempt);
      refresh();
      return { ok: false, reason: "mail", message: failedReplyMessage };
    }
    const { data: finished, error: finishError } = await client
      .from("inquiries")
      .update({
        status: "answered",
        answered_at: new Date().toISOString(),
        reply_status: "sent",
        reply_email_id: result.emailId,
      })
      .eq("id", ref.id)
      .eq("status", "new")
      .eq("reply_status", "sending")
      .eq("reply_attempt", attempt)
      .select("id")
      .maybeSingle();
    if (finishError || !finished) {
      // 발송 후 저장 응답이 유실될 수 있어 같은 시도 번호를 유지한다(#45).
      await client
        .from("inquiries")
        .update({ reply_status: "failed" })
        .eq("id", ref.id)
        .eq("status", "new")
        .eq("reply_status", "sending")
        .eq("reply_attempt", attempt);
      refresh();
      return { ok: false, reason: "mail", message: failedReplyMessage };
    }
    refresh();
    return { ok: true, message: "답변 메일 발송을 접수했습니다." };
  } catch {
    if (claimedAttempt !== undefined) {
      try {
        await client
          .from("inquiries")
          .update({ reply_status: "failed" })
          .eq("id", ref.id)
          .eq("status", "new")
          .eq("reply_status", "sending")
          .eq("reply_attempt", claimedAttempt);
      } catch {
        /* DB 장애로 sending이 남으면 관리자 수동 해제로 복구한다(#45). */
      }
      refresh();
      return { ok: false, reason: "mail", message: failedReplyMessage };
    }
    return { ok: false, reason: "server" };
  }
}

/** 대시보드 확인 후 멈춘 발송만 해제한다. 메일과 시도 번호는 그대로 둔다. */
export async function resetInquiryReply(
  _previous: ReplyState,
  form: FormData,
): Promise<ReplyState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const ref = reference(form);
  if (!ref || form.get("checkedDelivery") !== "on")
    return {
      ok: false,
      reason: "invalid",
      message: "기존 요청 종료와 Resend 대시보드 확인을 체크해 주세요.",
    };
  try {
    const { data, error } = await access.client
      .from("inquiries")
      .update({ reply_status: "failed" })
      .eq("id", ref.id)
      .eq("status", "new")
      .eq("reply_status", "sending")
      .eq("reply_attempt", ref.attempt)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "conflict" };
    refresh();
    return {
      ok: true,
      message:
        "발송 잠금을 해제했습니다. 대시보드 확인 결과에 따라 재시도해 주세요.",
    };
  } catch {
    return { ok: false, reason: "server" };
  }
}
