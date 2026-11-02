import Image from "next/image";
import Link from "next/link";

import type { NewsArticle } from "@/types/content";

import { formatDate } from "./news";

export default function NoticeCard({
  article,
  lang,
}: {
  article: NewsArticle;
  lang: string;
}) {
  return (
    <article>
      <Link
        href={`/${lang}/newsroom/${article.id}`}
        className="group relative flex aspect-video min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-brand-pale bg-linear-to-b from-brand-lavender via-brand-pale to-surface p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <Image
          src="/images/newsroom/megaphone.webp"
          alt=""
          aria-hidden="true"
          width={224}
          height={224}
          className="pointer-events-none absolute top-2 right-6 size-44 object-contain transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:-rotate-6"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-surface via-surface/90 to-surface/0"
        />
        <div className="relative z-1 pt-20">
          <h2 className="max-w-72 text-title break-keep text-fg group-hover:text-brand-deep">
            {article.title}
          </h2>
          <time
            dateTime={article.publishedAt}
            className="mt-2 block text-body text-fg-muted"
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
}
