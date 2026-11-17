import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, test } from "node:test";
import ts from "typescript";
import { companyCopy } from "../../../content/ko/company.ts";
import { uiCopy } from "../../../content/ko/ui.ts";
const stubs = {
  "next/link":
    'import{createElement as h}from"react";export default function Link({children,...p}){return h("a",p,children)}',
  "@/components/ui/Reveal":
    "import{createElement as h}from'react';export default function Reveal({children,className}){return h('div',{className},children)}",
  "next/image":
    "import{createElement as h}from'react';export default function Image({fill,...p}){return h('img',p)}",
};
const hook = registerHooks({
  resolve(s, c, n) {
    if (stubs[s])
      return {
        url: "data:text/javascript," + encodeURIComponent(stubs[s]),
        shortCircuit: true,
      };
    if (s === "react" && c.parentURL?.startsWith("data:"))
      return n(s, { ...c, parentURL: import.meta.url });
    if (s.startsWith("@/"))
      return n(new URL(`../../../${s.slice(2)}.tsx`, import.meta.url).href, c);
    if (s.startsWith("./") && !/\.[a-z]+$/.test(s))
      return n(new URL(`${s}.tsx`, c.parentURL).href, c);
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
const { default: About } = await import("./_components/AboutSection.tsx");
const { default: Beliefs } = await import("./_components/BeliefsSection.tsx");
const { default: History } = await import("./_components/HistorySection.tsx");
const { default: Ceo } = await import("./_components/CeoSection.tsx");
const { default: Contact } = await import("./_components/ContactSection.tsx");
after(() => hook.deregister());
const render = (C, copy) =>
  renderToStaticMarkup(createElement(C, { copy, ui: uiCopy }));
test("CMP-001 회사 소개는 h2와 dl8행·확정 라벨 순서로 회사 기본 정보를 보여 준다", () => {
  const html = render(About, companyCopy.about);
  assert.match(html, /<h2 id="company-about-title"/);
  assert.match(html, /<dl/);
  assert.equal((html.match(/<dt/g) || []).length, 8);
  assert.deepEqual(
    [...html.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => m[1]),
    ["회사", "설립", "대표", "분야", "핵심 기술", "첫 제품", "거점", "무대"],
  );
  assert.match(html, /aria-labelledby="company-about-title"/);
});
test("CMP-002 지향하는 것 세 제목은 순서대로 있고 순번은 없다", () => {
  const html = render(Beliefs, companyCopy.beliefs);
  assert.deepEqual(
    [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map((m) => m[1]),
    ["약에 기대지 않는 잠", "마취의학에서 출발한 과학", "뇌 상태를 하나로"],
  );
  assert.doesNotMatch(html, />0[123]</);
});
test("CMP-003 연혁은8줄이며 배열 마지막 줄만 강조한다", () => {
  const html = render(History, companyCopy.history);
  assert.equal((html.match(/<li /g) || []).length, 8);
  assert.equal((html.match(/data-last="true"/g) || []).length, 1);
  assert.match(html, /<li[^>]*data-last="true"[^>]*>[\s\S]*슬리비 공식 론칭/);
  const changed = render(History, {
    ...companyCopy.history,
    items: [{ date: "2026", text: "다른 마지막 문구" }],
  });
  assert.match(changed, /data-last="true"/);
});
test("CMP-004 CEO 표지는 이름과 같은 부모에서 이름 뒤에 나온다", () => {
  const html = render(Ceo, companyCopy.ceo);
  assert.match(
    html,
    /<div class="flex items-baseline gap-3"><h2[^>]*>서정화<\/h2><p[^>]*>CEO<\/p><\/div>/,
  );
  assert.equal("facts" in companyCopy, false);
});
test("CMP-005 문의는 FAQ와 같은 문의 배너(글자 링크)이고 유형 일반을 미리 고른다", () => {
  const html = renderToStaticMarkup(
    createElement(Contact, { copy: companyCopy.contact, lang: "ko" }),
  );
  assert.match(html, /class="public-contact-banner company-contact"/);
  assert.match(html, /href="\/ko\/contact\?type=general"/);
  assert.match(html, /public-text-link/);
  assert.doesNotMatch(html, /rounded-full|bg-violet-strong/);
});
