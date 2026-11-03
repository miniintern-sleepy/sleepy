"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import {
  newsCategories,
  type NewsArticle,
  type NewsCategory,
} from "@/types/content";

import ArticleImage from "./ArticleImage";
import NoticeCard from "./NoticeCard";
import { categoryLabels, formatDate, imageUrl, sourceUrl } from "./news";
import NoticeList from "./NoticeList";

export default function Newsroom({
  articles,
  lang,
  initialCategory = "all",
}: {
  articles: NewsArticle[];
  lang: string;
  initialCategory?: NewsCategory | "all";
}) {
  const [category, setCategory] = useState<NewsCategory | "all">(
    initialCategory,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = search.trim().toLocaleLowerCase("ko");
  const filtered = articles.filter(
    (article) =>
      (category === "all"
        ? article.category !== "notice"
        : article.category === category) &&
      `${article.title} ${article.summary ?? ""} ${article.sourceName ?? ""}`
        .toLocaleLowerCase("ko")
        .includes(query),
  );
  const pageSize = 8;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function selectCategory(value: NewsCategory | "all") {
    setCategory(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function changePage(value: number) {
    if (value === currentPage) return;
    setPage(value);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

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
            onClick={() => selectCategory(value)}
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
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
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
        {filtered.length === 0 ? (
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
                  selectCategory("all");
                  setSearch("");
                }}
                className="mt-6 min-h-11 cursor-pointer rounded-xl bg-brand px-6 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                전체 소식 보기
              </button>
            )}
          </div>
        ) : category === "notice" ? (
          <NoticeList articles={visible} lang={lang} />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article, index) => {
              const src = imageUrl(article.thumbnailUrl);
              const source = sourceUrl(article.sourceUrl);
              const content = (
                <>
                  <div className="relative h-60 shrink-0 overflow-hidden bg-brand-pale">
                    {src && (
                      <ArticleImage
                        key={src}
                        src={src}
                        title={article.title}
                        priority={index === 0}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-4 pt-4 pb-6">
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm">
                      <span className="rounded bg-brand-pale px-2 py-1 text-label text-brand">
                        {categoryLabels[article.category]}
                      </span>
                      <time
                        dateTime={article.publishedAt}
                        className="text-fg-muted"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                      {article.sourceName && (
                        <span className="text-fg-muted">
                          {article.sourceName}
                        </span>
                      )}
                    </div>
                    <h2 className="line-clamp-3 text-body-lg font-bold break-keep group-hover:text-brand-deep">
                      {article.title}
                    </h2>
                    {source && (
                      <span className="sr-only"> (새 창에서 원문 보기)</span>
                    )}
                  </div>
                </>
              );
              const className =
                "group flex h-100 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand";
              return (
                <li key={article.id}>
                  <Reveal>
                    <article>
                      {source ? (
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={`/${lang}/newsroom/${article.id}`}
                          className={className}
                        >
                          {content}
                        </Link>
                      )}
                    </article>
                  </Reveal>
                </li>
              );
            })}
            <li>
              <Reveal key={`${category}-${currentPage}`}>
                {category === "all" ? (
                  <NoticeCard onClick={() => selectCategory("notice")} />
                ) : (
                  <Link
                    href={`/${lang}/product`}
                    className="group relative flex h-100 flex-col justify-center overflow-hidden rounded-2xl bg-brand-pale p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    <Image
                      src="/images/product/main1.png"
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="relative text-title text-brand-deep">
                      당신의 편안한 수면
                    </span>
                  </Link>
                )}
              </Reveal>
            </li>
          </ul>
        )}
      </section>
      {pageCount > 1 && (
        <nav
          aria-label="뉴스 목록 페이지"
          className="mt-12 flex flex-wrap items-center justify-center gap-1 sm:mt-16"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            aria-label="이전 페이지"
            className="inline-flex size-11 cursor-pointer items-center justify-center text-body text-fg-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:opacity-30"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                onClick={() => changePage(number)}
                aria-label={`${number}페이지`}
                aria-current={currentPage === number ? "page" : undefined}
                aria-controls="news-results"
                className={`inline-flex size-11 cursor-pointer items-center justify-center text-body transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${currentPage === number ? "font-bold text-brand" : "text-fg-muted"}`}
              >
                {number}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => changePage(currentPage + 1)}
            aria-label="다음 페이지"
            className="inline-flex size-11 cursor-pointer items-center justify-center text-body text-fg-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:opacity-30"
          >
            ›
          </button>
          <p role="status" aria-live="polite" className="sr-only">
            {pageCount}페이지 중 {currentPage}페이지
          </p>
        </nav>
      )}
    </>
  );
}
