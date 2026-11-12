import type { NewsArticle, NewsCategory } from "@/types/content";

/** 기사가 있는 연도를 최신 연도부터 중복 없이 고른다. 연도 드롭다운의 선택지가 된다. */
export function newsYears(articles: readonly NewsArticle[]) {
  const years = new Set(
    articles.map((article) => article.publishedAt.slice(0, 4)),
  );
  return [...years].sort((a, b) => b.localeCompare(a));
}

/** 연도 선택이 "all"이면 그대로, 아니면 그 해에 발행된 기사만 남긴다. */
export function filterByYear(
  articles: readonly NewsArticle[],
  year: string | "all",
) {
  return year === "all"
    ? [...articles]
    : articles.filter((article) => article.publishedAt.startsWith(`${year}-`));
}

// 조사(이/가)가 분류마다 달라 문장 전체를 둔다.
const emptyCategoryMessages: Record<NewsCategory | "all", string> = {
  all: "아직 등록된 소식이 없습니다.",
  company: "아직 등록된 기업 소식이 없습니다.",
  press: "아직 등록된 보도자료가 없습니다.",
  notice: "아직 등록된 공지사항이 없습니다.",
};

/** 검색어나 연도로 좁혔으면 검색 결과 없음, 아니면 그 분류에 글이 없다는 문구. */
export function emptyMessage(
  query: string,
  category: NewsCategory | "all",
  year: string | "all",
) {
  return query.trim() || year !== "all"
    ? "검색 결과가 없습니다."
    : emptyCategoryMessages[category];
}
