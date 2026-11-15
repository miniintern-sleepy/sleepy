import type { NewsArticle } from "@/types/content";

/** DB 최신순을 유지하며 주요 기사 우선으로 큰 기사와 요청 페이지의 카드를 고른다. */
export function newsPage(
  articles: readonly NewsArticle[],
  value?: string | string[],
) {
  const featured =
    articles.find((article) => article.isFeatured) ?? articles[0] ?? null;
  const rest = articles.filter((article) => article !== featured);
  const pages = Math.max(1, Math.ceil(rest.length / 9));
  const requested =
    typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
  const page =
    Number.isSafeInteger(requested) && requested <= pages ? requested : 1;
  return {
    featured: page === 1 ? featured : null,
    cards: rest.slice((page - 1) * 9, page * 9),
    page,
    pages,
  };
}
