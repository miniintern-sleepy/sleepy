"use client";

import { useState } from "react";
import type { getFaqCopy } from "@/lib/content";
import type { Faq } from "@/types/content";
import { searchFaqs } from "./search";

export default function FaqSearch({
  items,
  copy,
}: {
  items: Faq[];
  copy: Awaited<ReturnType<typeof getFaqCopy>>;
}) {
  const [query, setQuery] = useState("");
  const matches = searchFaqs(items, query);
  const visible = new Set(matches.map((item) => item.id));
  return (
    <>
      <div className="public-search">
        <label htmlFor="faq-search" className="sr-only">
          {copy.searchLabel}
        </label>
        <input
          id="faq-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.placeholder}
        />
        <span aria-hidden="true">⌕</span>
      </div>
      <p
        className="public-results text-micro text-muted"
        aria-live="polite"
        hidden={!query.trim()}
      >
        {matches.length}개의 질문을 찾았습니다.
      </p>
      <div className="public-faq-list">
        {items.map((item, index) => (
          <details
            key={item.id}
            open={index === 0}
            hidden={!visible.has(item.id)}
          >
            <summary className="text-faq-question">{item.question}</summary>
            <p className="text-faq-answer whitespace-pre-line text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      {matches.length === 0 && (
        <p className="public-empty text-copy text-muted">
          {items.length === 0 && !query.trim()
            ? "자주 묻는 질문을 곧 준비하겠습니다."
            : "검색 결과가 없습니다."}
        </p>
      )}
    </>
  );
}
