import assert from "node:assert/strict";
import test from "node:test";
import { emptyMessage, filterByYear, newsYears } from "./news-view.ts";

test("NEWS-012 기사가 있는 연도를 최신순으로 고르고 고른 연도의 기사만 남긴다", () => {
  const articles = Object.freeze([
    { id: 3, publishedAt: "2026-07-03" },
    { id: 2, publishedAt: "2024-11-01" },
    { id: 1, publishedAt: "2026-01-15" },
    { id: 0, publishedAt: "2025-08-11" },
  ]);
  assert.deepEqual(newsYears(articles), ["2026", "2025", "2024"]);
  assert.deepEqual(newsYears([]), []);
  assert.deepEqual(
    filterByYear(articles, "2026").map((x) => x.id),
    [3, 1],
  );
  assert.deepEqual(
    filterByYear(articles, "all").map((x) => x.id),
    [3, 2, 1, 0],
  );
  assert.deepEqual(filterByYear(articles, "2023"), []);
});

test("NEWS-013 검색어나 연도로 좁혔으면 검색 결과 없음, 아니면 분류별 글 없음 문구를 고른다", () => {
  assert.equal(emptyMessage("특허", "all", "all"), "검색 결과가 없습니다.");
  assert.equal(emptyMessage("특허", "notice", "all"), "검색 결과가 없습니다.");
  assert.equal(emptyMessage("", "notice", "2024"), "검색 결과가 없습니다.");
  assert.equal(
    emptyMessage("  ", "notice", "all"),
    "아직 등록된 공지사항이 없습니다.",
  );
  assert.equal(
    emptyMessage("", "press", "all"),
    "아직 등록된 보도자료가 없습니다.",
  );
  assert.equal(
    emptyMessage("", "company", "all"),
    "아직 등록된 기업 소식이 없습니다.",
  );
  assert.equal(emptyMessage("", "all", "all"), "아직 등록된 소식이 없습니다.");
});
