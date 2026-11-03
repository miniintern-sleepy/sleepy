import assert from "node:assert/strict";
import { test } from "node:test";

import { renewalNotice, withRenewalNotice } from "./announcement.ts";
import { previewArticles } from "./preview-articles.ts";

test("DB에 기사가 없어도 확정한 새단장 공지는 표시한다", () => {
  assert.deepEqual(withRenewalNotice([]), [renewalNotice]);
  assert.match(renewalNotice.summary, /2026년 11월 19일/);
});

test("DB 기사는 유지하고 새 공지를 최신순에 배치한다", () => {
  const articles = [
    { ...renewalNotice, id: 1, title: "기존 공지", publishedAt: "2026-10-01" },
  ];
  const result = withRenewalNotice(articles);
  assert.equal(result.length, 2);
  assert.equal(result[0].title, renewalNotice.title);
  assert.equal(result[1].title, "기존 공지");
  assert.equal(articles.length, 1);
});

test("DB에 같은 공지가 있으면 DB 내용과 번호를 우선 사용한다", () => {
  const stored = {
    ...renewalNotice,
    id: 42,
    summary: "DB에서 수정한 공지 본문",
  };
  assert.deepEqual(withRenewalNotice([stored]), [stored]);
});

test("참고 기사 16건은 유지하고 예시 점검 공지는 제거한다", () => {
  assert.equal(previewArticles.length, 16);
  assert.ok(previewArticles.every((article) => article.category !== "notice"));
  const combined = withRenewalNotice(previewArticles);
  assert.equal(
    combined.filter((article) => article.category !== "notice").length,
    16,
  );
  assert.equal(
    combined.filter((article) => article.category === "notice").length,
    1,
  );
});
