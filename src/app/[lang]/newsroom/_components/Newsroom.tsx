"use client";
import { useState } from "react";
import { categoryLabels, filterNews } from "@/lib/news";
import type { getNewsroomCopy } from "@/lib/content";
import {
  newsCategories,
  type NewsArticle,
  type NewsCategory,
} from "@/types/content";
import NewsCard from "./NewsCard";
import { emptyMessage, filterByYear, newsYears } from "./news-view";

export default function Newsroom({
  articles,
  copy,
}: {
  articles: NewsArticle[];
  copy: Awaited<ReturnType<typeof getNewsroomCopy>>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [year, setYear] = useState<string | "all">("all");
  const visible = filterByYear(filterNews(articles, query, category), year);
  return (
    <>
      <div className="newsroom-toolbar">
        <div className="newsroom-selects">
          <label className="newsroom-select">
            <span className="sr-only">뉴스 분류</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as NewsCategory | "all")
              }
              className="text-filter"
            >
              <option value="all">전체 분류</option>
              {newsCategories.map((value) => (
                <option key={value} value={value}>
                  {categoryLabels[value]}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
          <label className="newsroom-select">
            <span className="sr-only">발행 연도</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="text-filter"
            >
              <option value="all">전체 연도</option>
              {newsYears(articles).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
        </div>
        <div className="public-search newsroom-search">
          <label htmlFor="news-search" className="sr-only">
            {copy.searchLabel}
          </label>
          <input
            id="news-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.placeholder}
          />
          <span aria-hidden="true">⌕</span>
        </div>
      </div>
      <p className="public-results text-micro text-muted" aria-live="polite">
        총 {visible.length}개의 소식
      </p>
      {visible.length > 0 ? (
        <ul className="newsroom-grid">
          {visible.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </ul>
      ) : (
        <p className="public-empty text-copy text-muted">
          {emptyMessage(query, category, year)}
        </p>
      )}
    </>
  );
}
