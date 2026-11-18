import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ts from "typescript";
import { homeCopy } from "../../../content/ko/home.ts";
import { companyCopy } from "../../../content/ko/company.ts";
import { uiCopy } from "../../../content/ko/ui.ts";
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
    if (s === "@/components/ui/ButtonLink")
      return {
        url: new URL("../../../components/ui/ButtonLink.tsx", import.meta.url)
          .href,
        shortCircuit: true,
      };
    // ButtonLink가 같은 폴더의 ExternalLink를 확장자 없이 불러온다(#88).
    if (
      s.startsWith("./") &&
      c.parentURL?.endsWith("/components/ui/ButtonLink.tsx")
    )
      return { url: new URL(`${s}.tsx`, c.parentURL).href, shortCircuit: true };
    if (s.endsWith(".webp"))
      return {
        url: moduleUrl(
          'export default {src:"/images/home/hero-box.webp",width:2880,height:1624}',
        ),
        shortCircuit: true,
      };
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
const { default: HeroSection } = await import("./HeroSection.tsx");
const { default: FounderStorySection } =
  await import("./FounderStorySection.tsx");
const { default: DayTriptychSection } =
  await import("./DayTriptychSection.tsx");
hook.deregister();
test("HOME-002 메인 히어로는 두 줄 제목·제품 설명·제품 소개 버튼·상자 사진을 표시하고 문의 배너는 없다(#98)", () => {
  const html = renderToStaticMarkup(
    createElement(HeroSection, {
      lang: "ko",
      copy: homeCopy.hero,
    }),
  );
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const [index, line] of homeCopy.hero.title.split("\n").entries())
    assert.ok(html.includes(`<span>${index > 0 ? " " : ""}${line}</span>`));
  const titleText = html
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]
    .replace(/<[^>]+>/g, "");
  assert.equal(titleText, homeCopy.hero.title.replaceAll("\n", " "));
  assert.equal(homeCopy.hero.title.split("\n").length, 2);
  assert.match(html, /alt=""/);
  assert.match(html, /src="\/images\/home\/hero-box.webp"/);
  assert.match(html, /sizes="100vw"/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(
    html,
    /<div class="home-hero-product"><p[^>]*>[^<]+<\/p><a href="\/ko\/product" class="public-button public-button-primary home-hero-cta">제품 소개<\/a>/,
  );
  assert.ok(html.includes(homeCopy.hero.description));
  assert.doesNotMatch(html, /<canvas\b/);
  const page = readFileSync(new URL("../page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /ContactBanner/);
  assert.match(page, /title: \{ absolute: "Sleepy" \}/);
});

test("HOME-004 메인 대표 소개는 전용 문구를 쓰고 기술 원리 링크는 기술로 이동한다", () => {
  const html = renderToStaticMarkup(
    createElement(FounderStorySection, {
      lang: "ko",
      copy: homeCopy.founder,
      company: {
        ...companyCopy,
        ceo: {
          ...companyCopy.ceo,
          role: "회사 전용 직함",
          paragraphs: ["회사 전용 소개"],
        },
        intro: { ...companyCopy.intro, description: "회사 전용 설명" },
      },
    }),
  );
  assert.ok(html.includes(homeCopy.founder.role));
  assert.ok(html.includes(homeCopy.founder.paragraphs[0]));
  assert.ok(html.includes(homeCopy.founder.description));
  assert.match(html, /text-meta text-muted">CEO<\/span>/);
  assert.ok(html.includes(`${companyCopy.ceo.name}<span class="ml-2`));
  assert.doesNotMatch(html, /회사 전용/);
  const day = renderToStaticMarkup(
    createElement(DayTriptychSection, {
      lang: "ko",
      copy: homeCopy.day,
      ui: uiCopy.home,
    }),
  );
  assert.match(day, /href="\/ko\/technology"/);
  assert.ok(day.includes("기술 원리"));
});
