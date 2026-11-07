import assert from "node:assert/strict";
import test from "node:test";
import { filterNews, formatDate, imageUrl, sourceUrl } from "./news.ts";

const articles = Object.freeze([
  Object.freeze({
    id: 3,
    category: "press",
    title: "슬리비 Alpha 발표",
    summary: "요약 전용 단어",
    sourceName: "AVING",
    publishedAt: "2026-07-01",
  }),
  Object.freeze({
    id: 2,
    category: "company",
    title: "회사의 소식",
    sourceName: "특허 공보",
    publishedAt: "2026-06-01",
  }),
  Object.freeze({
    id: 1,
    category: "notice",
    title: "공지",
    sourceName: null,
    publishedAt: "2026-05-13",
  }),
]);

test("NEWS-005 DB 제목·분류·전체 날짜·언론사를 공백과 대소문자를 정규화해 검색한다", () => {
  for (const query of [" ALPHA ", "보도자료", "2026.07.01", "aving"])
    assert.equal(filterNews(articles, query, "all")[0].id, 3);
  assert.equal(filterNews(articles, "기업 소식", "all")[0].id, 2);
  assert.equal(formatDate("2026-06-01"), "2026.06.01");
  assert.equal(filterNews(articles, "요약 전용 단어", "all").length, 0);
});
test("NEWS-006 검색과 분류를 동시에 적용하고 빈 결과·DB 순서·원본을 보존한다", () => {
  assert.deepEqual(filterNews(articles, "  ", "all"), articles);
  assert.deepEqual(
    filterNews(articles, "소식", "company").map((x) => x.id),
    [2],
  );
  assert.deepEqual(filterNews(articles, "Alpha", "company"), []);
  assert.deepEqual(filterNews(articles, "없는 단어", "all"), []);
  assert.deepEqual(
    articles.map((x) => x.id),
    [3, 2, 1],
  );
});
test("NEWS-008 HTTPS 원문과 안전한 썸네일 주소를 허용하고 주소 누락에는 링크를 만들지 않는다", () => {
  const credentialUrl = new URL("https://example.com");
  credentialUrl.username = "test-user";
  credentialUrl.password = "test-password";
  assert.equal(
    sourceUrl("https://example.com/news"),
    "https://example.com/news",
  );
  for (const value of [
    null,
    "",
    "http://example.com",
    "javascript:alert(1)",
    "//example.com",
    credentialUrl.href,
  ])
    assert.equal(sourceUrl(value), null);
  assert.equal(
    imageUrl("/images/newsroom/proposal.webp"),
    "/images/newsroom/proposal.webp",
  );
  assert.equal(
    imageUrl("https://example.com/storage/news.png"),
    "https://example.com/storage/news.png",
  );
  for (const value of [
    "//example.com/a.png",
    "/\\example.com/a.png",
    "data:image/png;base64,a",
  ])
    assert.equal(imageUrl(value), null);
});
