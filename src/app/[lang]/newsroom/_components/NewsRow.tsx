import Image from "next/image";
import NewsImage from "@/components/ui/NewsImage";
import { categoryLabels, formatDate, imageUrl, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

// 공통 NewsItem과 같은 행이지만, 썸네일이 없으면 로고를 넣어 모든 행의 칸을 맞춘다(#66).
// 메인 "최신 소식"은 공통 NewsItem을 그대로 쓴다.
export default function NewsRow({ article }: { article: NewsArticle }) {
  const image = imageUrl(article.thumbnailUrl);
  const href = sourceUrl(article.sourceUrl);
  const body = (
    <>
      {image ? (
        <NewsImage key={image} src={image} />
      ) : (
        <span className="public-news-thumb newsroom-logo-thumb">
          <Image
            src="/images/layout/header-logo.svg"
            alt=""
            width={83}
            height={19}
          />
        </span>
      )}
      <div>
        <span className="public-news-meta text-news-meta text-muted">
          {categoryLabels[article.category]} · {formatDate(article.publishedAt)}
          {article.sourceName && ` · ${article.sourceName}`}
        </span>
        <h3 className="text-news-title">{article.title}</h3>
      </div>
      {href && (
        <span className="public-news-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="public-news-item"
    >
      {body}
      <span className="sr-only"> (새 창)</span>
    </a>
  ) : (
    <article className="public-news-item">{body}</article>
  );
}
