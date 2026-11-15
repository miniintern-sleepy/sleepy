import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import test from "node:test";

const stubs = {
  "@/lib/content":
    "export async function getFaqs(){return globalThis.__sleepyHomeFaq81;}",
  "@/components/ui/TextLink":
    "export default function Link({href,children}){return '[' + href + '|' + children + ']';}",
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
    if (url.endsWith("/HomeFaqSection.tsx"))
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
const { default: HomeFaq } = await import("./HomeFaqSection.tsx");
hook.deregister();
const copy = { title: "자주 묻는 질문", link: "FAQ 전체 보기" };

test("HOME-005 메인 FAQ는 질문 0개면 숨기고 앞 네 개를 접힌 채 보여 주며 FAQ 전체 보기로 잇는다", async (t) => {
  t.after(() => delete globalThis.__sleepyHomeFaq81);
  globalThis.__sleepyHomeFaq81 = [];
  assert.equal(await HomeFaq({ copy, lang: "ko" }), null);

  const faqs = [1, 2, 3, 4, 5].map((id) => ({
    id,
    question: `질문${id}`,
    answer: `답변${id}`,
  }));
  globalThis.__sleepyHomeFaq81 = faqs;
  const html = renderToStaticMarkup(await HomeFaq({ copy, lang: "ko" }));
  assert.ok(html.includes("자주 묻는 질문"));
  for (const item of faqs)
    assert.equal(html.includes(item.question), item.id <= 4);
  assert.equal((html.match(/<details/g) ?? []).length, 4);
  assert.ok(
    !/<details[^>]*\sopen/.test(html),
    "처음에는 모두 접혀 있어야 한다",
  );
  assert.ok(html.includes("[/ko/faq|FAQ 전체 보기]"));
});
