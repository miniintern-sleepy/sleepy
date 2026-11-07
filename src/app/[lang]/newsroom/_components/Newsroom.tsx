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
import PreviewNotice from "./PreviewNotice";

export default function Newsroom({
  articles,
  lang,
  initialCategory = "all",
  isPreview = false,
}: {
  articles: NewsArticle[];
  lang: string;
  initialCategory?: NewsCategory | "all";
  isPreview?: boolean;
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
      {isPreview && category !== "notice" && <PreviewNotice />}
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
            className={`min-h-11 min-w-20 cursor-pointer rounded-xl px-5 py-2 text-ui-label transition-colors ${category === value ? "bg-violet text-white" : "bg-panel text-ink hover:bg-panel"}`}
          >
            {value === "all" ? "전체" : categoryLabels[value]}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-col-reverse gap-4 border-b border-rule pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-copy-intro"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {category === "all" ? "전체" : categoryLabels[category]}{" "}
          <span className="text-violet">{filtered.length}</span>건
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
            className="min-h-12 w-full rounded-xl border border-rule bg-paper py-3 pr-12 pl-4 text-copy placeholder:text-muted"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-4 size-6 text-ink"
          >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <path d="m16 16 6 6" />
          </svg>
        </form>
      </div>

      <section id="news-results" aria-label="뉴스 기사 목록">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-panel px-6 py-24 text-center">
            <h2 className="text-form-aside text-ink">
              {articles.length === 0
                ? "곧 새로운 소식으로 찾아뵙겠습니다."
                : "검색 결과가 없습니다."}
            </h2>
            <p className="mt-3 text-copy text-muted">
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
                className="mt-6 min-h-11 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
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
                  <div className="relative h-60 shrink-0 overflow-hidden bg-panel">
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
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-helper">
                      <span className="rounded bg-panel px-2 py-1 text-ui-label text-violet">
                        {categoryLabels[article.category]}
                      </span>
                      <time
                        dateTime={article.publishedAt}
                        className="text-muted"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                      {article.sourceName && (
                        <span className="text-muted">{article.sourceName}</span>
                      )}
                    </div>
                    <h2 className="line-clamp-3 text-copy-large font-ui-selected break-keep group-hover:text-ink">
                      {article.title}
                    </h2>
                    {source && (
                      <span className="sr-only"> (새 창에서 원문 보기)</span>
                    )}
                  </div>
                </>
              );
              const className =
                "group flex h-100 flex-col overflow-hidden rounded-2xl border border-rule bg-paper transition-shadow hover:shadow-md   ";
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
                    className="group relative flex h-100 flex-col justify-center overflow-hidden rounded-2xl bg-panel p-6"
                  >
                    <Image
                      src="/images/product/main1.png"
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 ease-out motion-safe:group-focus-within:scale-105 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="relative text-copy-intro text-ink">
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
            className="inline-flex size-11 cursor-pointer items-center justify-center text-copy text-muted transition-colors hover:text-violet disabled:cursor-default disabled:opacity-30"
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
                className={`inline-flex size-11 cursor-pointer items-center justify-center text-copy transition-colors hover:text-violet ${currentPage === number ? "font-ui-selected text-violet" : "text-muted"}`}
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
            className="inline-flex size-11 cursor-pointer items-center justify-center text-copy text-muted transition-colors hover:text-violet disabled:cursor-default disabled:opacity-30"
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
