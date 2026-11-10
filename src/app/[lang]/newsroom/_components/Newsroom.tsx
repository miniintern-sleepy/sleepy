"use client";
import { useState } from "react";
import NewsRow from "./NewsRow";
import { categoryLabels, filterNews } from "@/lib/news";
import type { getNewsroomCopy } from "@/lib/content";
import {
  newsCategories,
  type NewsArticle,
  type NewsCategory,
} from "@/types/content";

export default function Newsroom({
  articles,
  copy,
}: {
  articles: NewsArticle[];
  copy: Awaited<ReturnType<typeof getNewsroomCopy>>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const visible = filterNews(articles, query, category);
  return (
    <>
      <div className="public-search">
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
      <div className="public-filters" aria-label="뉴스 분류">
        {(["all", ...newsCategories] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
            className="text-filter"
          >
            {value === "all" ? "전체" : categoryLabels[value]}
          </button>
        ))}
      </div>
      <p className="public-results text-micro text-muted" aria-live="polite">
        총 {visible.length}개의 소식
      </p>
      <div className="public-news-list">
        {visible.map((article) => (
          <NewsRow key={article.id} article={article} />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="public-empty text-copy text-muted">
          검색 결과가 없습니다.
        </p>
      )}
    </>
  );
}
