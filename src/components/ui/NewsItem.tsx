import { categoryLabels, formatDate, imageUrl, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

import NewsImage from "./NewsImage";

export default function NewsItem({ article }: { article: NewsArticle }) {
  const image = imageUrl(article.thumbnailUrl);
  const href = sourceUrl(article.sourceUrl);
  const body = (
    <>
      {image && <NewsImage key={image} src={image} title={article.title} />}
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
  const className = `public-news-item ${image ? "" : "no-photo"}`;
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
