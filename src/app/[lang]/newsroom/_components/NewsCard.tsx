import { newsroomThumbnail } from "./newsroom-thumbnail";
import NewsroomImage from "./NewsroomImage";
import TextLinkBody from "@/components/ui/TextLinkBody";
import type { UiCopy } from "@/content/ko/ui";
import { formatDate, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";

export default function NewsCard({
  article,
  featured = false,
  ui,
  newWindow,
}: {
  article: NewsArticle;
  featured?: boolean;
  ui: UiCopy["newsroom"];
  newWindow: string;
}) {
  const href = sourceUrl(article.sourceUrl);
  const thumbnail = newsroomThumbnail(article);
  const body = (
    <>
      <NewsroomImage key={thumbnail} src={thumbnail} featured={featured} />
      <div className="newsroom-card-copy">
        <div className="newsroom-source-line">
          <span className="text-newsroom-source text-violet-strong">
            {article.sourceName || ui.categories[article.category]}
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
          // 상자 전체가 이미 원문 링크라 링크를 겹치지 않고 글자 링크 모양만 쓴다(#88).
          <span className="public-text-link newsroom-original">
            <TextLinkBody>{ui.readOriginal}</TextLinkBody>
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
      <span className="sr-only">{newWindow}</span>
    </a>
  ) : (
    <article className={className}>{body}</article>
  );
}
