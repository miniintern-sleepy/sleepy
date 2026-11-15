import { imageUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

// #86 후속 요청: DB 경로 입력 전에도 세 자사 기사의 원문 대표 사진을 뉴스룸에서 표시한다.
const originalPhotos: Record<string, string> = {
  "https://kr.aving.net/news/articleView.html?idxno=1812193":
    "/images/newsroom/aving-1812193.jpg",
  "https://kr.aving.net/news/articleView.html?idxno=1809345":
    "/images/newsroom/aving-1809345.jpg",
  "https://medigatenews.com/news/976305745":
    "/images/newsroom/medigate-976305745.jpg",
};

export function newsroomThumbnail(article: NewsArticle) {
  return (
    originalPhotos[
      (article.sourceUrl ?? "").replace("https://www.", "https://")
    ] ?? imageUrl(article.thumbnailUrl)
  );
}
