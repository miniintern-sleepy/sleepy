import NewsImage from "@/components/ui/NewsImage";
import { categoryLabels, formatDate, imageUrl, sourceUrl } from "@/lib/news";
import type { NewsArticle } from "@/types/content";
import NewsPlaceholder from "./NewsPlaceholder";

// 위에 날짜·제목·출처, 아래에 사진을 두는 뉴스룸 카드(#77). 사진이 없으면 분류별 아이콘을 둔다.
export default function NewsCard({ article }: { article: NewsArticle }) {
  const image = imageUrl(article.thumbnailUrl);
  const href = sourceUrl(article.sourceUrl);
  const body = (
    <>
      <span className="newsroom-card-text">
        <span className="text-kicker text-violet">
          {formatDate(article.publishedAt)}
        </span>
        <h3 className="newsroom-card-title text-news-title text-ink">
          {article.title}
        </h3>
        <span className="newsroom-card-meta text-news-meta text-muted">
          {categoryLabels[article.category]}
          {article.sourceName && ` · ${article.sourceName}`}
          {href && <span aria-hidden="true"> ↗</span>}
        </span>
      </span>
      <span className="newsroom-card-media">
        {image ? (
          <NewsImage key={image} src={image} />
        ) : (
          <NewsPlaceholder category={article.category} />
        )}
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="newsroom-card"
        >
          {body}
          <span className="sr-only"> (새 창)</span>
        </a>
      ) : (
        <article className="newsroom-card">{body}</article>
      )}
    </li>
  );
}
