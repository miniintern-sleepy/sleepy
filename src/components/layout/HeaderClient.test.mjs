import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ts from "typescript";

import { uiCopy } from "../../content/ko/ui.ts";
const react = JSON.stringify(import.meta.resolve("react"));
const stub = (code) => ({
  url: `data:text/javascript,${encodeURIComponent(code)}`,
  shortCircuit: true,
});
const hook = registerHooks({
  resolve(s, c, next) {
    if (s === "next/navigation")
      return stub("export const usePathname=()=>'/ko';");
    if (s === "next/image")
      return stub(
        `import{createElement as h}from ${react};export default function Image(p){return h('img',p)}`,
      );
    if (s === "next/link")
      return stub(
        `import{createElement as h}from ${react};export default function Link(p){return h('a',p)}`,
      );
    // 스크롤 감지는 브라우저에서만 동작하고 서버 마크업에는 아무것도 그리지 않는다.
    if (s === "./HeaderAutoHide")
      return stub("export default function HeaderAutoHide(){return null}");
    if (s === "./HeaderNavigation")
      return stub(
        `import{createElement as h}from ${react};export function Navigation({pathname}){return h('nav',{'data-path':pathname})}`,
      );
    return next(s, c);
  },
  load(url, c, next) {
    if (url.endsWith("/HeaderClient.tsx"))
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
          },
        }).outputText,
      };
    return next(url, c);
  },
});
const { HeaderShell } = await import("./HeaderClient.tsx");
hook.deregister();

test("HOME-001 메인·카테고리·대기 머리말은 투명하지 않고 현재 경로를 메뉴에 전달한다", () => {
  for (const pathname of [undefined, "/ko", "/ko/technology", "/ko/faq"]) {
    const html = renderToStaticMarkup(
      createElement(HeaderShell, {
        lang: "ko",
        pathname,
        copy: uiCopy.header,
      }),
    );
    assert.match(html, /<header class="site-header">/);
    assert.doesNotMatch(html, /data-overlay/);
    if (pathname) assert.ok(html.includes(`data-path="${pathname}"`));
  }
});
