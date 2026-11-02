"use client";

import Link from "next/link";
import { useState } from "react";

import {
  newsCategories,
  type NewsArticle,
  type NewsCategory,
} from "@/types/content";

import ArticleImage from "./ArticleImage";
import NoticeCard from "./NoticeCard";
import { categoryLabels, formatDate, imageUrl } from "./news";
import NoticeList from "./NoticeList";

export default function Newsroom({
  articles,
  lang,
}: {
  articles: NewsArticle[];
  lang: string;
}) {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("ko");
  const filtered = articles.filter(
    (article) =>
      (category === "all" || article.category === category) &&
      `${article.title} ${article.summary ?? ""} ${article.sourceName ?? ""}`
        .toLocaleLowerCase("ko")
        .includes(query),
  );
  const featured = filtered.find((article) => article.isFeatured);
  const ordered = featured
    ? [featured, ...filtered.filter((article) => article.id !== featured.id)]
    : filtered;

  return (
    <>
      <div
        className="mb-4 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="뉴스 분류"
      >
        {(["all", ...newsCategories] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            aria-controls="news-results"
            onClick={() => setCategory(value)}
            className={`min-h-11 min-w-20 cursor-pointer rounded-xl px-5 py-2 text-label transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${category === value ? "bg-brand text-surface" : "bg-brand-pale text-brand-deep hover:bg-brand-lavender"}`}
          >
            {value === "all" ? "전체" : categoryLabels[value]}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-col-reverse gap-4 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-title"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {category === "all" ? "전체" : categoryLabels[category]}{" "}
          <span className="text-brand">{filtered.length}</span>건
        </p>
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="relative w-full sm:w-72"
        >
          <label htmlFor="news-search" className="sr-only">
            뉴스룸 검색
          </label>
          <input
            id="news-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="뉴스룸 검색"
            aria-controls="news-results"
            className="min-h-12 w-full rounded-xl border border-line bg-surface py-3 pr-12 pl-4 text-body placeholder:text-fg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-4 size-6 text-brand-deep"
          >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <path d="m16 16 6 6" />
          </svg>
        </form>
      </div>
      <section id="news-results" aria-label="뉴스 기사 목록">
        {ordered.length === 0 ? (
          <div className="rounded-2xl bg-surface-muted px-6 py-24 text-center">
            <h2 className="text-h3 text-brand-deep">
              {articles.length === 0
                ? "곧 새로운 소식으로 찾아뵙겠습니다."
                : "검색 결과가 없습니다."}
            </h2>
            <p className="mt-3 text-body text-fg-muted">
              {articles.length === 0
                ? "슬리피의 소식을 준비하고 있습니다."
                : "다른 분류나 검색어로 다시 찾아보세요."}
            </p>
            {articles.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setSearch("");
                }}
                className="mt-6 min-h-11 cursor-pointer rounded-xl bg-brand px-6 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                전체 소식 보기
              </button>
            )}
          </div>
        ) : category === "notice" ? (
          <NoticeList articles={filtered} lang={lang} />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((article, index) => {
              const src = imageUrl(article.thumbnailUrl);
              if (article.category === "notice") {
                return (
                  <li key={article.id} className="self-start">
                    <NoticeCard article={article} lang={lang} />
                  </li>
                );
              }
              return (
                <li
                  key={article.id}
                  className={index === 0 ? "sm:col-span-2" : undefined}
                >
                  <article className="h-full">
                    <Link
                      href={`/${lang}/newsroom/${article.id}`}
                      className={`group relative flex h-full min-h-96 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand`}
                    >
                      {src ? (
                        <div
                          className={`relative shrink-0 overflow-hidden rounded-2xl bg-surface-image ${index < 2 ? "h-60 lg:h-72" : "h-60"}`}
                        >
                          <ArticleImage
                            key={src}
                            src={src}
                            title={article.title}
                            priority={index === 0}
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex shrink-0 items-center justify-center rounded-2xl bg-surface-image text-body-sm text-fg-muted ${index < 2 ? "h-60 lg:h-72" : "h-60"}`}
                        >
                          이미지 준비 중
                        </div>
                      )}
                      <div className="relative z-1 flex flex-1 flex-col px-5 pt-3 pb-6">
                        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm">
                          <span className="rounded bg-brand-pale px-3 text-label text-brand">
                            {categoryLabels[article.category]}
                          </span>
                          <time
                            dateTime={article.publishedAt}
                            className="text-fg-muted"
                          >
                            {formatDate(article.publishedAt)}
                          </time>
                        </div>
                        <h2
                          className={`${index === 0 ? "text-title sm:text-h3" : "text-title"} break-keep group-hover:text-brand-deep`}
                        >
                          {article.title}
                        </h2>
                        {index === 0 && article.summary && (
                          <p className="mt-4 line-clamp-2 text-body-sm text-fg-muted">
                            {article.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
