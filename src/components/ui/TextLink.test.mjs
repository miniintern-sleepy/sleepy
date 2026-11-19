import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ts from "typescript";
const react = JSON.stringify(import.meta.resolve("react"));
const hook = registerHooks({
  resolve(s, c, n) {
    // next/link 대신 data-next-link를 단 a로 그려 내부 링크가 next/link를 거쳤는지 확인한다.
    if (s === "next/link")
      return {
        url: `data:text/javascript,${encodeURIComponent(
          `import {createElement} from ${react};export default function Link(p){return createElement('a',{...p,'data-next-link':''})}`,
        )}`,
        shortCircuit: true,
      };
    if (s.startsWith("./") && !/\.[a-z]+$/.test(s))
      return { url: new URL(`${s}.tsx`, c.parentURL).href, shortCircuit: true };
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
const { default: TextLink } = await import("./TextLink.tsx");
const { default: ExternalLinks } = await import("./ExternalLinks.tsx");
const { default: ButtonLink } = await import("./ButtonLink.tsx");
hook.deregister();
const render = (props) =>
  renderToStaticMarkup(createElement(TextLink, props, "문의하기"));
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("LINK-001 기본 글자 링크는 next/link이고 안쪽 묶음에 글자와 숨긴 화살표가 있다", () => {
  const html = render({ href: "/ko/contact" });
  assert.match(html, /^<a [^>]*data-next-link/);
  assert.match(html, /class="public-text-link"/);
  assert.match(
    html,
    /<span class="public-text-link-body">문의하기<span aria-hidden="true">↗<\/span><\/span>/,
  );
  assert.doesNotMatch(html, /target=|새 창/);
});

test("LINK-002 external은 새 창·noopener noreferrer·숨긴 (새 창) 안내를 붙인다", () => {
  const html = render({ href: "https://example.com", external: true });
  assert.doesNotMatch(html, /data-next-link/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /<span class="sr-only"> \(새 창\)<\/span><\/a>$/);
  assert.match(html, /public-text-link-body/);
});

test("LINK-003 size=compact는 작은 글자 클래스를 붙이고 바깥 className은 유지한다", () => {
  const html = render({
    href: "/ko/company",
    size: "compact",
    className: "mt-4",
  });
  assert.match(html, /class="public-text-link public-text-link-compact mt-4"/);
});

test("LINK-004 외부 링크 목록은 https 주소만 보조 버튼(ButtonLink external)으로 그린다", () => {
  const html = renderToStaticMarkup(
    createElement(ExternalLinks, {
      links: [
        { label: "논문", href: "https://example.com/a" },
        { label: "빈 주소", href: "" },
      ],
    }),
  );
  assert.equal(html.match(/<a /g).length, 1);
  assert.match(html, /target="_blank"/);
  assert.match(html, /class="public-button public-button-secondary">논문/);
});

test("LINK-005 글자 링크 모양은 공통 CSS 한 곳에서만 정하고 직접 클래스를 쓰지 않는다", () => {
  const css = read("../../styles/public.css");
  const base = css.match(/\.public-text-link \{[^}]*\}/)[0];
  assert.match(base, /width: fit-content/);
  assert.match(base, /min-height: var\(--size-touch\)/);
  assert.match(base, /color: var\(--color-violet-strong\)/);
  assert.doesNotMatch(base, /border|space-between/);
  const body = css.match(/\.public-text-link-body \{[^}]*\}/)[0];
  assert.match(body, /gap: 4px/);
  assert.match(body, /padding-bottom: 4px/);
  assert.match(body, /border-bottom: 1px solid currentColor/);
  assert.match(
    css,
    /\.public-text-link:hover \{\s*color: var\(--color-violet\);/,
  );
  assert.doesNotMatch(css, /external-text-link/);
  // 페이지 CSS는 바깥 배치(margin·flex-shrink)만 덮어쓴다.
  for (const path of [
    "../../app/[lang]/home.css",
    "../../app/[lang]/faq/faq.css",
  ])
    for (const rule of read(path).matchAll(/\.public-text-link \{([^}]*)\}/g))
      assert.doesNotMatch(
        rule[1],
        /gap|width|justify-content|border|color|font-size/,
      );
});

const button = (props) =>
  renderToStaticMarkup(createElement(ButtonLink, props, "기술 원리"));

test("LINK-006 버튼 링크(#98)는 기본이 보조(테두리)이고 primary는 보라 채움 클래스를 쓴다", () => {
  const html = button({ href: "/ko/technology" });
  assert.match(html, /^<a [^>]*data-next-link/);
  assert.match(
    html,
    /class="public-button public-button-secondary"[^>]*>기술 원리<span aria-hidden="true">↗<\/span><\/a>$/,
  );
  assert.match(
    button({ href: "/ko/product", variant: "primary", className: "mt-8" }),
    /class="public-button public-button-primary mt-8"/,
  );
  assert.doesNotMatch(button({ href: "/ko/product", arrow: false }), /↗/);
  const external = button({ href: "https://example.com", external: true });
  assert.match(external, /target="_blank"/);
  assert.match(external, /<span class="sr-only"> \(새 창\)<\/span><\/a>$/);
});

test("LINK-007 버튼 모양은 공통 CSS 한 곳에서 정하고, 이동 링크는 글자 링크 대신 버튼을 쓴다", () => {
  const css = read("../../styles/public.css");
  const base = css.match(/\.public-button \{[^}]*\}/)[0];
  assert.match(base, /min-height: var\(--size-touch\)/);
  assert.match(base, /border-radius: var\(--radius-pill\)/);
  assert.match(
    css.match(/\.public-button-primary \{[^}]*\}/)[0],
    /background: var\(--color-violet\)/,
  );
  assert.match(
    css.match(/\.public-button-secondary \{[^}]*\}/)[0],
    /border-color: var\(--color-rule\)/,
  );
  for (const path of [
    "../../app/[lang]/_components/ProductStageSection.tsx",
    "../../app/[lang]/_components/DayTriptychSection.tsx",
    "../../app/[lang]/_components/FounderStorySection.tsx",
    "../../app/[lang]/_components/HomeFaqSection.tsx",
    "../../app/[lang]/_components/LatestNewsSection.tsx",
    "../../app/[lang]/company/_components/EasyTechSection.tsx",
    "../../app/[lang]/contact/_components/ContactForm.tsx",
    "../../app/[lang]/faq/page.tsx",
    "./ExternalLinks.tsx",
    "./ContactBanner.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /<ButtonLink/);
    assert.doesNotMatch(
      source,
      /<TextLink|className="public-(text-link|button)/,
    );
  }
  // 주 버튼은 제품·문의 두 곳에만 둔다.
  assert.match(
    read("../../app/[lang]/_components/ProductStageSection.tsx"),
    /variant="primary"/,
  );
  assert.match(read("./ContactBanner.tsx"), /variant="primary"/);
});
