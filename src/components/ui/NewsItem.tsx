import Image from "next/image";
import { categoryLabels, formatDate, imageUrl, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

import NewsImage from "./NewsImage";

export default function NewsItem({
  article,
  logoFallback = false,
}: {
  article: NewsArticle;
  /** 썸네일이 없을 때 흐린 로고를 대신 보여 모든 행의 칸을 맞춘다. 뉴스룸 목록에서만 켠다(#66). */
  logoFallback?: boolean;
}) {
  const image = imageUrl(article.thumbnailUrl);
  const href = sourceUrl(article.sourceUrl);
  const thumb = image ? (
    <NewsImage key={image} src={image} />
  ) : logoFallback ? (
    <span className="public-news-thumb public-news-logo">
      <Image
        src="/images/layout/header-logo.svg"
        alt=""
        width={83}
        height={19}
      />
    </span>
  ) : null;
  const body = (
    <>
      {thumb}
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
  const className = `public-news-item ${thumb ? "" : "no-photo"}`;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
      <span className="sr-only"> (새 창)</span>
    </a>
  ) : (
    <article className={className}>{body}</article>
  );
}
