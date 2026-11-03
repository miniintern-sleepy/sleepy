export type InquiryValues = {
  name: string;
  email: string;
  type: string;
  message: string;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof InquiryValues, string>>;

export type InquiryState = {
  ok: boolean;
  attempt: number;
  reason?: "invalid" | "captcha" | "server";
  fieldErrors?: FieldErrors;
};

export function validateInquiry(values: InquiryValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim() || values.name.trim().length > 50)
    errors.name = "이름을 1~50자로 입력해 주세요.";
  if (
    values.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  )
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  if (values.type !== "product" && values.type !== "general")
    errors.type = "문의 유형을 선택해 주세요.";
  if (!values.message.trim() || values.message.trim().length > 2000)
    errors.message = "문의 내용을 1~2,000자로 입력해 주세요.";
  if (!values.consent)
    errors.consent = "개인정보 수집 및 이용에 동의해 주세요.";
  return errors;
}
