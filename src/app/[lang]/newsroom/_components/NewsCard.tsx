import { newsroomThumbnail } from "./newsroom-thumbnail";
import NewsroomImage from "./NewsroomImage";
import { categoryLabels, formatDate, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

export default function NewsCard({
  article,
  featured = false,
}: {
  article: NewsArticle;
  featured?: boolean;
}) {
  const href = sourceUrl(article.sourceUrl);
  const body = (
    <>
      <NewsroomImage
        key={article.thumbnailUrl}
        src={newsroomThumbnail(article)}
        featured={featured}
      />
      <div className="newsroom-card-copy">
        <div className="newsroom-source-line">
          <span className="text-newsroom-source text-violet-strong">
            {article.sourceName || categoryLabels[article.category]}
          </span>
          <time
            className="text-newsroom-date text-muted"
            dateTime={article.publishedAt}
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h3
          className={
            featured
              ? "newsroom-feature-title text-newsroom-feature-title"
              : "newsroom-card-title text-newsroom-card-title"
          }
        >
          {article.title}
        </h3>
        {featured && article.summary && (
          <p className="newsroom-summary text-newsroom-summary text-muted">
            {article.summary}
          </p>
        )}
        {featured && href && (
          <span className="newsroom-original text-newsroom-button">
            기사 원문 보기 <span aria-hidden="true">↗</span>
          </span>
        )}
      </div>
    </>
  );
  const className = featured ? "newsroom-feature" : "newsroom-card";
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
