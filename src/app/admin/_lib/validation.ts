export const thumbnailLimit = 900 * 1024;
export const thumbnailTypes = ["image/jpeg", "image/png", "image/webp"];

export type ContentState = {
  ok: boolean;
  reason?: "unauthenticated" | "forbidden" | "invalid" | "notFound" | "server";
  fieldErrors?: Record<string, string>;
  warning?: string;
};
export type ContentAction = (
  previous: ContentState,
  form: FormData,
) => Promise<ContentState>;

export function text(form: FormData, name: string) {
  const value = form.get(name);
  // multipart 전송의 CRLF 때문에 화면과 서버의 글자 수가 달라지지 않게 한다(#44).
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
}

export function parseId(value: string) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

export function validateId(
  form: FormData,
  optional = false,
): { id: number | null; errors: Record<string, string> } {
  const raw = form.get("id");
  if (optional && (raw === null || raw === "")) return { id: null, errors: {} };
  const id = typeof raw === "string" ? parseId(raw) : null;
  return { id, errors: id ? {} : { id: "항목 번호가 올바르지 않습니다." } };
}

function limitedText(
  form: FormData,
  name: string,
  label: string,
  max: number,
  errors: Record<string, string>,
  required = true,
) {
  const raw = form.get(name);
  const value = text(form, name);
  if (
    (raw !== null && typeof raw !== "string") ||
    (required && !value) ||
    value.length > max
  )
    errors[name] =
      `${label}${required ? `은(는) 1~${max}자` : `은(는) ${max}자 이하`}로 입력해 주세요.`;
  return value;
}

function flag(form: FormData, name: string, errors: Record<string, string>) {
  const value = form.get(name);
  if (value !== null && value !== "on")
    errors[name] = "선택 값이 올바르지 않습니다.";
  return value === "on";
}

function order(form: FormData, errors: Record<string, string>) {
  const value = text(form, "sortOrder");
  const number = Number(value);
  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(number) ||
    number > 2147483647
  )
    errors.sortOrder = "순서는 0~2,147,483,647 사이의 정수로 입력해 주세요.";
  return number;
}

function httpsUrl(value: string) {
  if (!value.startsWith("https://")) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function validateFaq(form: FormData) {
  const { id, errors: idErrors } = validateId(form, true);
  const errors: Record<string, string> = { ...idErrors };
  const question = limitedText(form, "question", "질문", 200, errors);
  const answer = limitedText(form, "answer", "답변", 5000, errors);
  const sort_order = order(form, errors);
  const is_published = flag(form, "isPublished", errors);
  return { id, errors, values: { question, answer, sort_order, is_published } };
}

export function validateSpec(form: FormData) {
  const { id, errors: idErrors } = validateId(form, true);
  const errors: Record<string, string> = { ...idErrors };
  const label = limitedText(form, "label", "항목명", 100, errors);
  const value = limitedText(form, "value", "값", 500, errors);
  const sort_order = order(form, errors);
  const is_published = flag(form, "isPublished", errors);
  return { id, errors, values: { label, value, sort_order, is_published } };
}

export function validatePurchaseUrl(form: FormData) {
  const errors: Record<string, string> = {};
  const url = limitedText(form, "url", "구매 주소", 2048, errors, false);
  if (url && !httpsUrl(url))
    errors.url = "https://로 시작하는 올바른 주소를 입력해 주세요.";
  return { errors, value: url || null };
}

export function validateNews(form: FormData) {
  const { id, errors: idErrors } = validateId(form, true);
  const errors: Record<string, string> = { ...idErrors };
  const category = text(form, "category");
  if (!["company", "press", "notice"].includes(category))
    errors.category = "분류를 선택해 주세요.";
  const title = limitedText(form, "title", "제목", 200, errors);
  const summary =
    limitedText(form, "summary", "요약", 10000, errors, false) || null;
  const source_name =
    limitedText(form, "sourceName", "언론사명", 100, errors, false) || null;
  const source_url =
    limitedText(form, "sourceUrl", "원문 주소", 2048, errors, false) || null;
  if (source_url && !httpsUrl(source_url))
    errors.sourceUrl = "https://로 시작하는 올바른 주소를 입력해 주세요.";
  const published_at = text(form, "publishedAt");
  const date = new Date(`${published_at}T00:00:00Z`);
  if (
    !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(published_at) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== published_at
  )
    errors.publishedAt = "실제로 존재하는 날짜를 입력해 주세요.";
  const is_featured = flag(form, "isFeatured", errors);
  const is_published = flag(form, "isPublished", errors);
  const removeThumbnail = flag(form, "removeThumbnail", errors);
  const rawFile = form.get("thumbnail");
  const file =
    rawFile instanceof File && !(rawFile.name === "" && rawFile.size === 0)
      ? rawFile
      : null;
  if (
    (rawFile !== null && !(rawFile instanceof File)) ||
    (file &&
      (!thumbnailTypes.includes(file.type) ||
        file.size < 1 ||
        file.size > thumbnailLimit))
  )
    errors.thumbnail =
      "JPEG·PNG·WebP 이미지 파일을 900KB 이하로 선택해 주세요.";
  if (removeThumbnail && file)
    errors.thumbnail =
      "새 이미지 업로드와 이미지 제거 중 하나만 선택해 주세요.";
  return {
    id,
    errors,
    file,
    removeThumbnail,
    values: {
      category,
      title,
      summary,
      source_name,
      source_url,
      published_at,
      is_featured,
      is_published,
    },
  };
}
