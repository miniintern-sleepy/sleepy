import type { NewsArticle } from "@/types/content";

// 운영 DB 등록 전까지 확정 공지를 함께 표시한다. 사용자 승인(2026-11-03, #37).
export const renewalNotice: NewsArticle = {
  id: 900100001,
  category: "notice",
  title: "11월 19일, 슬리피 홈페이지가 새롭게 단장합니다",
  summary:
    "슬리피 홈페이지가 2026년 11월 19일 새로운 모습으로 찾아옵니다.\n\n새단장한 홈페이지에서 슬리피의 소식과 이야기를 전해드리겠습니다. 앞으로도 많은 관심 부탁드립니다.\n\n감사합니다.\n주식회사 슬리피 드림",
  publishedAt: "2026-11-03",
  thumbnailUrl: null,
  isFeatured: false,
  sourceName: null,
  sourceUrl: null,
};

export function withRenewalNotice(articles: NewsArticle[]): NewsArticle[] {
  const hasStoredNotice = articles.some(
    (article) =>
      article.category === "notice" && article.title === renewalNotice.title,
  );
  return (hasStoredNotice ? articles : [...articles, renewalNotice]).toSorted(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id,
  );
}
