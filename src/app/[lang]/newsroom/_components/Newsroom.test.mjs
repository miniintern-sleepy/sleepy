import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, test } from "node:test";
import ts from "typescript";
import { uiCopy } from "../../../../content/ko/ui.ts";
const hook = registerHooks({
  resolve(s, c, n) {
    if (s === "next/image")
      return {
        url:
          "data:text/javascript," +
          encodeURIComponent(
            "import{createElement as h}from'react';export default function Image({fill,unoptimized,onError,...p}){return h('img',p)}",
          ),
        shortCircuit: true,
      };
    if (s === "react" && c.parentURL?.startsWith("data:"))
      return n(s, { ...c, parentURL: import.meta.url });
    if (s.startsWith("@/"))
      return n(
        new URL(
          `../../../../${s.slice(2)}.${s.includes("/lib/") ? "ts" : "tsx"}`,
          import.meta.url,
        ).href,
        c,
      );
    if (s.startsWith("./") && !/\.[a-z]+$/.test(s))
      return n(
        new URL(
          `${s}${["./news-view", "./newsroom-thumbnail"].includes(s) ? ".ts" : ".tsx"}`,
          c.parentURL,
        ).href,
        c,
      );
    return n(s, c);
  },
  load(u, c, n) {
    if (u.endsWith(".tsx"))
      return {
        format: "module",
        source: ts.transpileModule(readFileSync(new URL(u), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
          },
        }).outputText,
        shortCircuit: true,
      };
    return n(u, c);
  },
});
const { default: Newsroom } = await import("./Newsroom.tsx");
const { newsroomThumbnail } = await import("./newsroom-thumbnail.ts");
const { default: NewsCard } = await import("./NewsCard.tsx");
after(() => hook.deregister());
const article = {
  id: 1,
  category: "press",
  title: "기사 제목",
  summary: "요약",
  sourceName: null,
  sourceUrl: null,
  thumbnailUrl: null,
  publishedAt: "2026-07-01",
  isFeatured: false,
};
// #96 다국어: 문구는 화면이 받아 쓴다. 테스트는 한국어 문구를 넘긴다.
const render = (C, p) =>
  renderToStaticMarkup(
    createElement(C, {
      ui: uiCopy.newsroom,
      newWindow: uiCopy.newWindow,
      ...p,
    }),
  );
test("NEWS-018 사진·원문 없는 기사는 로고 대체 그림과 링크 없는 article이다", () => {
  for (const [sourceUrl, file] of [
    [
      "https://kr.aving.net/news/articleView.html?idxno=1812193",
      "aving-1812193.jpg",
    ],
    [
      "https://kr.aving.net/news/articleView.html?idxno=1809345",
      "aving-1809345.jpg",
    ],
    ["https://www.medigatenews.com/news/976305745", "medigate-976305745.jpg"],
  ])
    assert.equal(
      newsroomThumbnail({ ...article, sourceUrl }),
      `/images/newsroom/${file}`,
    );
  const known = {
    ...article,
    sourceUrl: "https://kr.aving.net/news/articleView.html?idxno=1812193",
  };
  assert.equal(
    newsroomThumbnail({ ...known, thumbnailUrl: "/images/admin-changed.jpg" }),
    "/images/admin-changed.jpg",
  );
  assert.equal(
    newsroomThumbnail({ ...known, thumbnailUrl: "javascript:alert(1)" }),
    null,
  );
  assert.equal(newsroomThumbnail({ ...article, thumbnailUrl: null }), null);
  const source = readFileSync(
    new URL("./NewsCard.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /key=\{thumbnail\}/);
  assert.match(source, /src=\{thumbnail\}/);
  const html = render(NewsCard, { article, featured: true });
  assert.match(html, /<article/);
  assert.doesNotMatch(html, /<a |newsroom-original/);
  assert.match(html, /newsroom-logo.*aria-hidden="true"/);
  assert.match(html, /보도자료/);
  assert.match(html, /2026.07.01/);
  const image = render(NewsCard, {
    article: {
      ...article,
      thumbnailUrl: "/images/test.jpg",
      sourceUrl: "https://example.com/news",
    },
  });
  assert.match(image, /alt=""/);
  assert.match(image, /target="_blank" rel="noopener noreferrer"/);
  assert.match(image, /새 창/);
  assert.match(
    readFileSync(new URL("./NewsroomImage.tsx", import.meta.url), "utf8"),
    /onError=\{\(\) => setFailed\(true\)\}/,
  );
});
test("NEWS-019 페이지 링크·현재 페이지·비활성 화살표와 0건을 서버 HTML에 출력한다", () => {
  const rows = Array.from({ length: 16 }, (_, i) => ({
    ...article,
    id: i,
    title: `기사${i}`,
  }));
  const html = render(Newsroom, { articles: rows });
  assert.match(html, /총 16개의 소식/);
  assert.equal((html.match(/<h3/g) || []).length, 10);
  assert.match(html, /href="\?page=2#news"/);
  assert.match(html, /aria-current="page"/);
  assert.match(
    html,
    /role="link" aria-label="이전 페이지" aria-disabled="true"/,
  );
  const second = render(Newsroom, { articles: rows, requestedPage: "2" });
  assert.equal((second.match(/<h3/g) || []).length, 6);
  assert.doesNotMatch(second, /class="newsroom-feature"/);
  assert.match(
    second,
    /role="link" aria-label="다음 페이지" aria-disabled="true"/,
  );
  assert.doesNotMatch(render(Newsroom, { articles: rows.slice(0, 9) }), /<nav/);
  assert.match(
    render(Newsroom, { articles: [] }),
    /아직 등록된 소식이 없습니다/,
  );
  assert.doesNotMatch(
    render(NewsCard, {
      article: { ...article, summary: null },
      featured: true,
    }),
    /newsroom-summary/,
  );
});
