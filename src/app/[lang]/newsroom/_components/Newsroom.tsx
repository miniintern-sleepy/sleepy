import type { UiCopy } from "@/content/ko/ui";
import type { NewsArticle } from "@/types/content";
import NewsCard from "./NewsCard";
import { newsPage } from "./news-view";

export default function Newsroom({
  articles,
  requestedPage,
  ui,
  newWindow,
}: {
  articles: NewsArticle[];
  requestedPage?: string | string[];
  ui: UiCopy["newsroom"];
  newWindow: string;
}) {
  const { featured, cards, page, pages } = newsPage(articles, requestedPage);
  if (!articles.length)
    return <p className="public-empty text-copy text-muted">{ui.empty}</p>;
  return (
    <>
      <p id="news" className="public-results text-micro text-muted">
        {ui.total.replace("{count}", String(articles.length))}
      </p>
      {featured && (
        <NewsCard article={featured} featured ui={ui} newWindow={newWindow} />
      )}
      <ul
        className={`newsroom-grid ${featured ? "newsroom-grid-after-feature" : ""}`}
      >
        {cards.map((article) => (
          <li key={article.id}>
            <NewsCard article={article} ui={ui} newWindow={newWindow} />
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav
          className="newsroom-pagination text-newsroom-pagination"
          aria-label={ui.pagination}
        >
          {page > 1 ? (
            <a href={`?page=${page - 1}#news`} aria-label={ui.previousPage}>
              ‹
            </a>
          ) : (
            <span role="link" aria-label={ui.previousPage} aria-disabled="true">
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
            <a href={`?page=${page + 1}#news`} aria-label={ui.nextPage}>
              ›
            </a>
          ) : (
            <span role="link" aria-label={ui.nextPage} aria-disabled="true">
              ›
            </span>
          )}
        </nav>
      )}
    </>
  );
}
