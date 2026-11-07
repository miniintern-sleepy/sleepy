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
    <ul className="divide-y divide-rule border-y border-rule">
      {articles.map((article) => (
        <li key={article.id}>
          <Reveal>
            <article>
              <Link
                href={`/${lang}/newsroom/${article.id}`}
                className="group block px-4 py-8 transition-colors hover:bg-panel focus-visible:bg-panel sm:px-6 sm:py-10"
              >
                <time
                  dateTime={article.publishedAt}
                  className="text-ui-label text-muted"
                >
                  {formatDate(article.publishedAt)}
                </time>
                <h2 className="mt-3 text-copy-intro break-keep group-hover:text-ink sm:text-form-aside">
                  {article.title}
                </h2>
                {article.summary && (
                  <p className="mt-3 text-copy text-muted">
                    {article.summary.split("\n\n")[0]}
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
