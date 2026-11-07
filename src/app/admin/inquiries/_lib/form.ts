export type ReplyState = {
  ok: boolean;
  reason?:
    | "unauthenticated"
    | "forbidden"
    | "invalid"
    | "notFound"
    | "conflict"
    | "answered"
    | "mail"
    | "server";
  message?: string;
  fieldErrors?: { body?: string; id?: string; attempt?: string };
};
export const failedReplyMessage =
  "Resend 대시보드에서 발송 여부를 확인한 뒤 다시 보내세요";
