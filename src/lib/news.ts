import type { NewsCategory } from "@/types/content";

export const categoryLabels: Record<NewsCategory, string> = {
  company: "기업 소식",
  press: "보도자료",
  notice: "공지사항",
};

/** 저장된 YYYY-MM-DD를 임시 1일 값까지 모두 같은 형식으로 표시한다. */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

/** 원문에는 HTTPS 주소만 사용한다. */
export function sourceUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** 기존 로컬 이미지와 공개 HTTPS 썸네일을 허용한다. */
export function imageUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return value;
  return sourceUrl(value);
}
