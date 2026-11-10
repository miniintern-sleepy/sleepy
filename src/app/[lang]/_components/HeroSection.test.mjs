import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ts from "typescript";
const react = JSON.stringify(import.meta.resolve("react"));
const moduleUrl = (code) => `data:text/javascript,${encodeURIComponent(code)}`;
const hook = registerHooks({
  resolve(s, c, n) {
    if (s === "next/image")
      return {
        url: moduleUrl(
          `import {createElement} from ${react};export default function Image({src,fill,...props}){return createElement('img',{...props,src:src.src})}`,
        ),
        shortCircuit: true,
      };
    if (s === "next/link")
      return {
        url: moduleUrl(
          `import {createElement} from ${react};export default function Link(props){return createElement('a',props)}`,
        ),
        shortCircuit: true,
      };
    if (s === "@/components/ui/TextLink")
      return {
        url: new URL("../../../components/ui/TextLink.tsx", import.meta.url)
          .href,
        shortCircuit: true,
      };
    if (s.endsWith(".webp"))
      return {
        url: moduleUrl(
          'export default {src:"/images/home/hero-window.webp",width:2560,height:1710}',
        ),
        shortCircuit: true,
      };
    return n(s, c);
  },
  load(u, c, n) {
    if (u.endsWith("/HeroSection.tsx") || u.endsWith("/TextLink.tsx"))
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
const { default: HeroSection } = await import("./HeroSection.tsx");
hook.deregister();
test("HOME-002 메인 히어로는 두 줄 h1·기술 링크·장식 사진을 출력하고 canvas는 없다", () => {
  const html = renderToStaticMarkup(
    createElement(HeroSection, {
      lang: "ko",
      copy: {
        title: "잠의 과학을,\n생활의 언어로.",
        link: "연구 원리 알아보기",
      },
    }),
  );
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<br\s*\/>/);
  assert.match(html, /alt=""/);
  assert.match(html, /src="\/images\/home\/hero-window.webp"/);
  assert.match(html, /sizes="100vw"/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(html, /href="\/ko\/technology"/);
  assert.match(html, /연구 원리 알아보기/);
  assert.doesNotMatch(html, /<canvas\b/);
});
