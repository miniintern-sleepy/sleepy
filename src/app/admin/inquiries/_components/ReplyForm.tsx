"use client";

import { useActionState, useState } from "react";

import {
  escapeMailHtml,
  normalizeReply,
  replyError,
} from "@/lib/mail/template";

import { buttonClass, Field, inputClass } from "../../_components/form-ui";
import { replyToInquiry, resetInquiryReply } from "../actions";
import { failedReplyMessage, type ReplyState } from "../_lib/form";
import type { InquiryItem } from "../_lib/queries";

function ReplyFeedback({ state }: { state: ReplyState }) {
  const messages = {
    unauthenticated: "로그인이 만료됐습니다. 다시 로그인해 주세요.",
    forbidden: "관리자 권한이 없습니다.",
    invalid: "입력한 내용과 확인 항목을 확인해 주세요.",
    notFound: "문의가 없습니다. 목록으로 돌아가 주세요.",
    conflict:
      "다른 요청에서 처리 중이거나 상태가 바뀌었습니다. 새로고침해 주세요.",
    answered: "이미 답변을 완료한 문의입니다.",
    mail: failedReplyMessage,
    server: "처리하지 못했습니다. 새로고침해 상태를 확인해 주세요.",
  };
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="space-y-2 text-helper text-ink"
    >
      <p>{state.message ?? (state.reason ? messages[state.reason] : "")}</p>
      {state.fieldErrors?.id && <p>{state.fieldErrors.id}</p>}
    </div>
  );
}

export default function ReplyForm({ inquiry }: { inquiry: InquiryItem }) {
  const [body, setBody] = useState(inquiry.replyBody ?? "");
  const [state, action, pending] = useActionState(replyToInquiry, {
    ok: false,
  } as ReplyState);
  const normalized = normalizeReply(body);
  const error = replyError(normalized);
  const failed = inquiry.replyStatus === "failed";
  // 발송 성공 뒤 refresh()로 폼이 다시 만들어져 Action의 성공 안내가 사라지므로 여기서 안내한다(#45).
  if (inquiry.status === "answered")
    return (
      <p role="status">
        답변 메일 발송을 접수했습니다. 답변 완료된 문의는 다시 보낼 수 없습니다.
      </p>
    );
  if (inquiry.replyStatus === "sending") return <ResetForm inquiry={inquiry} />;
  return (
    <form action={action} className="space-y-4" aria-busy={pending}>
      <input type="hidden" name="id" value={inquiry.id} />
      <input type="hidden" name="attempt" value={inquiry.replyAttempt} />
      <Field
        name="body"
        label="답변 (1~2,000자)"
        error={state.fieldErrors?.body ?? (body ? error : undefined)}
      >
        <textarea
          id="body"
          name="body"
          className={inputClass}
          rows={10}
          required
          maxLength={2000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          readOnly={pending}
          aria-invalid={!!state.fieldErrors?.body || (!!body && !!error)}
          aria-describedby="body-error reply-length"
        />
      </Field>
      <p id="reply-length" className="text-helper text-muted">
        원문 {normalized.length}/2,000자 · 메일 변환 후{" "}
        {escapeMailHtml(normalized).length}/2,000자
      </p>
      {failed && (
        <div className="space-y-3">
          <p role="alert">{failedReplyMessage}</p>
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              name="checkedDelivery"
              required
              disabled={pending}
            />
            Resend 대시보드에서 발송 여부를 확인했습니다.
          </label>
          <p className="text-helper text-muted">
            같은 답변은 같은 발송 키를 사용합니다. 답변을 수정하면 새 발송 키가
            만들어집니다. 오래된 재시도는 같은 키여도 새 메일이 될 수 있습니다.
          </p>
        </div>
      )}
      <ReplyFeedback state={state} />
      <button className={buttonClass} disabled={pending || !!error}>
        {pending ? "발송 중…" : failed ? "답변 다시 보내기" : "답변 보내기"}
      </button>
    </form>
  );
}

function ResetForm({ inquiry }: { inquiry: InquiryItem }) {
  const [state, action, pending] = useActionState(resetInquiryReply, {
    ok: false,
  } as ReplyState);
  return (
    <form
      action={action}
      className="space-y-4"
      aria-busy={pending}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "기존 발송 요청이 끝났고 Resend 대시보드를 확인했습니까? 발송 잠금만 해제하며 메일은 보내지 않습니다.",
          )
        )
          event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={inquiry.id} />
      <input type="hidden" name="attempt" value={inquiry.replyAttempt} />
      <p role="status">
        답변을 발송 중입니다. 먼저 새로고침해서 처리 결과를 확인해 주세요.
      </p>
      <p>{failedReplyMessage}</p>
      <label className="flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          name="checkedDelivery"
          required
          disabled={pending}
        />
        기존 요청이 끝났고 Resend 대시보드에서 발송 여부를 확인했습니다.
      </label>
      <ReplyFeedback state={state} />
      <button className={buttonClass} disabled={pending}>
        {pending ? "해제 중…" : "멈춘 발송 잠금 해제"}
      </button>
    </form>
  );
}
