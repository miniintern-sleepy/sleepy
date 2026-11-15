import { imageUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

// #86: 관리자 썸네일을 우선하고, DB 값이 비어 있을 때만 원문 사진으로 보완한다.
const originalPhotos: Record<string, string> = {
  "https://kr.aving.net/news/articleView.html?idxno=1812193":
    "/images/newsroom/aving-1812193.jpg",
  "https://kr.aving.net/news/articleView.html?idxno=1809345":
    "/images/newsroom/aving-1809345.jpg",
  "https://medigatenews.com/news/976305745":
    "/images/newsroom/medigate-976305745.jpg",
};

export function newsroomThumbnail(article: NewsArticle) {
  if (article.thumbnailUrl?.trim()) return imageUrl(article.thumbnailUrl);
  return (
    originalPhotos[
      (article.sourceUrl ?? "").replace("https://www.", "https://")
    ] ?? null
  );
}
