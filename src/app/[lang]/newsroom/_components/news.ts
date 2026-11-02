import type { NewsCategory } from "@/types/content";

export const categoryLabels: Record<NewsCategory, string> = {
  company: "기업소식",
  press: "보도자료",
  notice: "공지사항",
};

export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export function imageUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return value;
  return sourceUrl(value);
}

export function sourceUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
