import type { NewsArticle, NewsCategory } from "@/types/content";

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

/** B에서 보이는 제목·분류·날짜·언론사를 함께 검색한다. */
export function filterNews(
  articles: NewsArticle[],
  query: string,
  category: NewsCategory | "all",
) {
  const search = query.trim().toLocaleLowerCase("ko");
  return articles.filter((article) => {
    const text = [
      article.title,
      categoryLabels[article.category],
      formatDate(article.publishedAt),
      article.sourceName ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase("ko");
    return (
      (category === "all" || article.category === category) &&
      text.includes(search)
    );
  });
}
