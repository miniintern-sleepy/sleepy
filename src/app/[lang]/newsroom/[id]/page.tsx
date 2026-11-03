import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ArticleImage from "../_components/ArticleImage";
import { loadNewsroom } from "../_components/load-news";
import PreviewNotice from "../_components/PreviewNotice";
import {
  categoryLabels,
  formatDate,
  imageUrl,
  sourceUrl,
} from "../_components/news";

export const metadata: Metadata = { title: "뉴스 상세" };

async function Article({ params }: PageProps<"/[lang]/newsroom/[id]">) {
  const { id, lang } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const { articles, isPreview } = await loadNewsroom();
  const article = articles.find((item) => item.id === Number(id));
  if (!article) notFound();
  const image = imageUrl(article.thumbnailUrl);
  const source = sourceUrl(article.sourceUrl);

  return (
    <article>
      {isPreview && article.category !== "notice" && <PreviewNotice />}
      {article.category === "notice" && (
        <header className="mb-12 bg-surface-muted px-6 py-16 text-center">
          <h1 className="text-h1 text-brand-deep sm:text-display">공지사항</h1>
          <p className="mt-3 text-body-lg text-fg-muted">
            슬리피의 공식 안내를 확인하세요.
          </p>
        </header>
      )}
      <Link
        href={`/${lang}/newsroom${article.category === "notice" ? "?category=notice" : ""}`}
        className="inline-flex min-h-11 items-center text-label text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {article.category === "notice" ? "← 공지사항 목록" : "← 뉴스룸 목록"}
      </Link>
      <header className="mt-8 border-b border-line pb-8">
        <p className="mb-4 flex flex-wrap items-center gap-4 text-body-sm text-fg-muted">
          <span className="rounded bg-brand-pale px-3 py-1 text-label text-brand">
            {categoryLabels[article.category]}
          </span>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {article.sourceName && <span>{article.sourceName}</span>}
        </p>
        {article.category === "notice" ? (
          <h2 className="text-h3 break-keep text-brand-deep sm:text-h2">
            {article.title}
          </h2>
        ) : (
          <h1 className="text-h3 break-keep text-brand-deep sm:text-h2">
            {article.title}
          </h1>
        )}
      </header>
      {image && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-surface-image">
          <ArticleImage src={image} title={article.title} priority />
        </div>
      )}
      {article.summary && (
        <p className="mt-8 text-body-lg whitespace-pre-line text-fg">
          {article.summary}
        </p>
      )}
      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex min-h-12 items-center rounded-xl bg-brand px-6 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          원문 보기<span className="sr-only"> (새 창)</span>
          <span aria-hidden="true" className="ml-3">
            ↗
          </span>
        </a>
      )}
    </article>
  );
}

export default function NewsDetailPage(
  props: PageProps<"/[lang]/newsroom/[id]">,
) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
      <Suspense
        fallback={
          <p role="status" className="py-20 text-center text-fg-muted">
            기사를 불러오는 중입니다.
          </p>
        }
      >
        <Article {...props} />
      </Suspense>
    </main>
  );
}
