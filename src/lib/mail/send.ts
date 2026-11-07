import "server-only";

import { Resend } from "resend";

import { isMailAddress, readMailConfig } from "./config";
import {
  escapeMailHtml,
  formatReceivedAt,
  inquiryPreviewHtml,
  mailVariableLimit,
  replyError,
} from "./template";

type InquiryMail = { id: string; name: string; message: string };
type MailResult =
  | { ok: true; emailId: string }
  | { ok: false; reason: "config" | "invalid" | "provider" };

/** 새 문의 한 건에 대한 알림을 보낸다. 실패해도 문의 저장 상태는 바꾸지 않는다. */
export async function sendInquiryNotification(
  inquiry: InquiryMail & { type: "product" | "general"; created_at: string },
): Promise<MailResult> {
  try {
    const config = readMailConfig("notify");
    if (!config) return { ok: false, reason: "config" };
    return await sendTemplate(
      config,
      config.notifyTo!,
      "슬리피에 새 문의가 접수되었습니다",
      {
        CUSTOMER_NAME: escapeMailHtml(inquiry.name),
        INQUIRY_TYPE: inquiry.type === "product" ? "제품" : "일반",
        RECEIVED_AT: formatReceivedAt(inquiry.created_at),
        INQUIRY_PREVIEW_HTML: inquiryPreviewHtml(inquiry.message),
        ADMIN_URL: escapeMailHtml(
          `${config.siteOrigin}/admin/inquiries/${inquiry.id}`,
        ),
      },
      `inquiry-notify-${inquiry.id}`,
    );
  } catch {
    return { ok: false, reason: "provider" };
  }
}

/** DB에서 읽은 문의자에게 같은 시도 번호의 중복 방지 키로 답변을 보낸다. */
export async function sendInquiryReply(
  inquiry: InquiryMail & { email: string },
  body: string,
  attempt: number,
): Promise<MailResult> {
  try {
    if (
      replyError(body) ||
      !isMailAddress(inquiry.email) ||
      !Number.isSafeInteger(attempt) ||
      attempt < 1
    )
      return { ok: false, reason: "invalid" };
    const config = readMailConfig("reply");
    if (!config) return { ok: false, reason: "config" };
    return await sendTemplate(
      config,
      inquiry.email,
      "슬리피 문의에 답변드립니다",
      {
        CUSTOMER_NAME: escapeMailHtml(inquiry.name),
        INQUIRY_PREVIEW_HTML: inquiryPreviewHtml(inquiry.message),
        REPLY_HTML: escapeMailHtml(body),
      },
      `${inquiry.id}-${attempt}`,
    );
  } catch {
    return { ok: false, reason: "provider" };
  }
}

async function sendTemplate(
  config: NonNullable<ReturnType<typeof readMailConfig>>,
  to: string,
  subject: string,
  variables: Record<string, string>,
  idempotencyKey: string,
): Promise<MailResult> {
  if (
    Object.values(variables).some((value) => value.length > mailVariableLimit)
  )
    return { ok: false, reason: "invalid" };
  const { data, error } = await new Resend(config.apiKey).emails.send(
    {
      from: config.from,
      to,
      replyTo: config.replyTo,
      subject,
      template: { id: config.templateId, variables },
    },
    { idempotencyKey },
  );
  if (error || !data?.id) return { ok: false, reason: "provider" };
  return { ok: true, emailId: data.id };
}
