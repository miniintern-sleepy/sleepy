import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { NewsArticle } from "@/types/content";

import { formatDate } from "./news";

export default function NoticeList({
  articles,
  lang,
}: {
  articles: NewsArticle[];
  lang: string;
}) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {articles.map((article) => (
        <li key={article.id}>
          <Reveal>
            <article>
              <Link
                href={`/${lang}/newsroom/${article.id}`}
                className="group block px-4 py-8 transition-colors hover:bg-brand-pale focus-visible:bg-brand-pale focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:px-6 sm:py-10"
              >
                <time
                  dateTime={article.publishedAt}
                  className="text-label text-fg-muted"
                >
                  {formatDate(article.publishedAt)}
                </time>
                <h2 className="mt-3 text-title break-keep group-hover:text-brand-deep sm:text-h3">
                  {article.title}
                </h2>
                {article.summary && (
                  <p className="mt-3 text-body text-fg-muted">
                    {article.summary}
                  </p>
                )}
              </Link>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
