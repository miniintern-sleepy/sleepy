export const mailVariableLimit = 2000;

/** 브라우저와 서버가 같은 기준으로 답변 줄바꿈과 앞뒤 공백을 정리한다. */
export function normalizeReply(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim();
}

/** 사용자 입력을 HTML 본문에 넣는 값으로 바꾸고 줄바꿈을 보존한다. */
export function escapeMailHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value
    .replace(/[&<>"']/g, (character) => entities[character])
    .replace(/\r\n?|\n/g, "<br>");
}

/** 문의 전문 대신 앞부분 300자만 알림과 답변 템플릿에 전달한다. */
export function inquiryPreviewHtml(message: string): string {
  return escapeMailHtml(
    Array.from(message.replace(/\r\n?/g, "\n")).slice(0, 300).join(""),
  );
}

/** 답변 원문과 Resend 문자열 변수 한도를 함께 검증한다. */
export function replyError(body: string): string | undefined {
  if (!body || body.length > 2000) return "답변은 1~2,000자로 입력해 주세요.";
  if (escapeMailHtml(body).length > mailVariableLimit)
    return "특수문자·줄바꿈 변환 후 메일 길이가 2,000자를 넘습니다. 답변을 줄여 주세요.";
}

/** 수신 시각을 서버 실행 지역과 무관하게 한국 시간으로 표시한다. */
export function formatReceivedAt(value: string): string {
  return (
    new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date(value)) + " (한국 시간)"
  );
}
