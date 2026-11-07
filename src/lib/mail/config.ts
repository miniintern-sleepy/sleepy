import "server-only";

export type MailConfig = {
  apiKey: string;
  from: string;
  replyTo: string;
  templateId: string;
  notifyTo?: string;
  siteOrigin?: string;
};

/** 표시 이름이나 여러 수신자 없이 이메일 주소 하나만 허용한다. */
export function isMailAddress(value: string): boolean {
  return (
    value.length <= 254 && /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value)
  );
}

/** 메일 링크는 요청 Host 대신 명시적으로 설정한 사이트 원점에서만 만든다. */
export function siteOrigin(value: string): string | null {
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    const local =
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      (!local && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      value.length > 1500
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** 누락·잘못된 설정 값은 외부에 노출하지 않고 발송만 중단한다. */
export function readMailConfig(kind: "notify" | "reply"): MailConfig | null {
  const apiKey = process.env.MAIL_API_KEY;
  const from = process.env.MAIL_FROM ?? "";
  const replyTo = process.env.MAIL_REPLY_TO ?? "";
  const templateId =
    process.env[
      kind === "notify" ? "MAIL_NOTIFY_TEMPLATE_ID" : "MAIL_REPLY_TEMPLATE_ID"
    ] ?? "";
  if (
    !apiKey ||
    /[\r\n]/.test(apiKey) ||
    !isMailAddress(from) ||
    !isMailAddress(replyTo) ||
    !/^[A-Za-z0-9_-]{1,200}$/.test(templateId)
  )
    return null;
  if (kind === "reply") return { apiKey, from, replyTo, templateId };
  const notifyTo = process.env.MAIL_NOTIFY_TO ?? "";
  const origin = siteOrigin(process.env.MAIL_SITE_URL ?? "");
  if (!isMailAddress(notifyTo) || !origin) return null;
  return { apiKey, from, replyTo, templateId, notifyTo, siteOrigin: origin };
}
