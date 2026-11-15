import type { NewsArticle } from "@/types/content";
import NewsCard from "./NewsCard";
import { newsPage } from "./news-view";

export default function Newsroom({
  articles,
  requestedPage,
}: {
  articles: NewsArticle[];
  requestedPage?: string | string[];
}) {
  const { featured, cards, page, pages } = newsPage(articles, requestedPage);
  if (!articles.length)
    return (
      <p className="public-empty text-copy text-muted">
        아직 등록된 소식이 없습니다.
      </p>
    );
  return (
    <>
      <p id="news" className="public-results text-micro text-muted">
        총 {articles.length}개의 소식
      </p>
      {featured && <NewsCard article={featured} featured />}
      <ul
        className={`newsroom-grid ${featured ? "newsroom-grid-after-feature" : ""}`}
      >
        {cards.map((article) => (
          <li key={article.id}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav
          className="newsroom-pagination text-newsroom-pagination"
          aria-label="뉴스 페이지"
        >
          {page > 1 ? (
            <a href={`?page=${page - 1}#news`} aria-label="이전 페이지">
              ‹
            </a>
          ) : (
            <span aria-label="이전 페이지" aria-disabled="true">
              ‹
            </span>
          )}
          {Array.from({ length: pages }, (_, i) => (
            <a
              key={i}
              href={`?page=${i + 1}#news`}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </a>
          ))}
          {page < pages ? (
            <a href={`?page=${page + 1}#news`} aria-label="다음 페이지">
              ›
            </a>
          ) : (
            <span aria-label="다음 페이지" aria-disabled="true">
              ›
            </span>
          )}
        </nav>
      )}
    </>
  );
}
