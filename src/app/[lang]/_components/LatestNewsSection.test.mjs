import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { uiCopy } from "../../../content/ko/ui.ts";
import test from "node:test";

const stubs = {
  "@/lib/content":
    "export async function getNewsList(){return globalThis.__sleepyLatest54;}",
  "@/components/ui/NewsItem":
    "export default function Item({article}){return article.title;}",
  "@/components/ui/TextLink":
    "export default function Link({children}){return children;}",
};
const hook = registerHooks({
  resolve(specifier, context, next) {
    if (stubs[specifier])
      return {
        url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}`,
        shortCircuit: true,
      };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith("/LatestNewsSection.tsx"))
      return {
        format: "module",
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
          },
        }).outputText,
        shortCircuit: true,
      };
    return next(url, context);
  },
});
const { default: Latest } = await import("./LatestNewsSection.tsx");
hook.deregister();
test("NEWS-011 공개 기사 0건이면 메인 소식 구간 전체를 숨기고 최신 네 건까지 표시한다", async (t) => {
  t.after(() => delete globalThis.__sleepyLatest54);
  const articles = [
    { id: 5, title: "첫 기사" },
    { id: 4, title: "둘째 기사" },
    { id: 3, title: "셋째 기사" },
    { id: 2, title: "넷째 기사" },
    { id: 1, title: "다섯째 기사" },
  ];
  for (const count of [2, 5]) {
    globalThis.__sleepyLatest54 = articles.slice(0, count);
    const html = renderToStaticMarkup(await Latest({ lang: "ko", ui: uiCopy }));
    assert.ok(html.includes("슬리피의 소식"));
    for (const [index, article] of articles.entries())
      assert.equal(html.includes(article.title), index < Math.min(count, 4));
  }
});
