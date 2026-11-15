import assert from "node:assert/strict";
import test from "node:test";
import { newsPage } from "./news-view.ts";
const articles = Object.freeze(
  Array.from({ length: 16 }, (_, i) =>
    Object.freeze({ id: 16 - i, isFeatured: i === 3 }),
  ),
);
test("NEWS-015 큰 기사는 최신 주요 기사 우선이며 없으면 최신 기사다", () => {
  assert.equal(newsPage(articles).featured.id, 13);
  assert.equal(
    newsPage(articles.map((x) => ({ ...x, isFeatured: false }))).featured.id,
    16,
  );
  assert.equal(newsPage([]).featured, null);
});
test("NEWS-016 16건을 첫 페이지 큰 기사와 카드9개·다음 페이지6개로 중복 없이 나눈다", () => {
  const first = newsPage(articles);
  const second = newsPage(articles, "2");
  assert.equal(first.cards.length, 9);
  assert.equal(second.cards.length, 6);
  assert.equal(second.featured, null);
  assert.equal(first.pages, 2);
  assert.equal(
    new Set([first.featured, ...first.cards, ...second.cards].map((x) => x.id))
      .size,
    16,
  );
  for (let n = 0; n <= 10; n++)
    assert.equal(newsPage(articles.slice(0, n)).pages, 1);
  assert.equal(articles[0].id, 16);
});
test("NEWS-017 잘못된 페이지와 범위 밖 페이지는 첫 페이지다", () => {
  for (const value of [
    "abc",
    "99",
    "0",
    "-1",
    "1.5",
    "1e1",
    "",
    ["2"],
    "99999999999999999999",
  ])
    assert.equal(newsPage(articles, value).page, 1);
  assert.equal(newsPage(articles, "2").page, 2);
});
