import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ts from "typescript";
const hook = registerHooks({
  resolve(s, c, n) {
    if (s.endsWith(".css"))
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    return n(s, c);
  },
  load(u, c, n) {
    if (u.endsWith("/PageHero.tsx"))
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
const { default: PageHero } = await import("./PageHero.tsx");
hook.deregister();
test("HERO-001 제목·설명·파동 종류를 출력하고 장식 DOM과 빈 버튼 자리를 만들지 않는다", () => {
  for (const wave of [
    "newsroom",
    "faq",
    "contact",
    "company",
    "technology",
    "product",
  ]) {
    const html = renderToStaticMarkup(
      createElement(PageHero, {
        title: "제목\n둘째 줄",
        description: "설명\n둘째 줄",
        wave,
      }),
    );
    assert.ok(
      html.includes("<h1") &&
        html.includes("제목\n둘째 줄") &&
        html.includes("설명\n둘째 줄"),
    );
    assert.ok(html.includes(`page-hero-${wave}`));
    assert.ok(
      !html.includes("page-hero-actions") &&
        !html.includes("<img") &&
        !html.includes("<svg"),
    );
  }
});
test("HERO-002 children이 있을 때만 추가 자리를 출력한다", () => {
  const html = renderToStaticMarkup(
    createElement(
      PageHero,
      { title: "제목", wave: "product" },
      createElement("a", { href: "/ko/contact" }, "문의"),
    ),
  );
  assert.ok(html.includes("page-hero-actions") && html.includes("문의"));
  assert.ok(!html.includes("<p") && !html.includes("page-hero-description"));
});
test("HERO-003 생성 SVG는 선 수·정밀도와 뉴스룸 좌표 검증값을 유지한다", () => {
  for (const [suffix, expected] of [
    ["", [-24.4, 1854.4, 69.1, 387.7]],
    ["-mobile", [-11.2, 851.5, 43.2, 242.3]],
  ]) {
    const svg = readFileSync(
      new URL(
        `../../../public/images/hero/wave-newsroom${suffix}.svg`,
        import.meta.url,
      ),
      "utf8",
    );
    assert.equal((svg.match(/<path /g) || []).length, 108);
    const coords = [...svg.matchAll(/[ML](-?\d+\.\d),(-?\d+\.\d)/g)].map(
      (m) => [+m[1], +m[2]],
    );
    assert.deepEqual(
      [
        Math.min(...coords.map((p) => p[0])),
        Math.max(...coords.map((p) => p[0])),
        Math.min(...coords.map((p) => p[1])),
        Math.max(...coords.map((p) => p[1])),
      ],
      expected,
    );
    assert.equal((svg.match(/opacity="\d\.\d{3}"/g) || []).length, 108);
  }
});

test("HERO-004 회사·기술·제품 SVG는 화면별 PC 크기와 모바일 900×300을 유지한다", () => {
  for (const [name, height] of [
    ["company", 470],
    ["technology", 490],
    ["product", 480],
  ]) {
    for (const [suffix, width, expectedHeight] of [
      ["", 1960, height],
      ["-mobile", 900, 300],
    ]) {
      const svg = readFileSync(
        new URL(
          `../../../public/images/hero/wave-${name}${suffix}.svg`,
          import.meta.url,
        ),
        "utf8",
      );
      assert.ok(
        svg.includes(
          `width="${width}" height="${expectedHeight}" viewBox="0 0 ${width} ${expectedHeight}"`,
        ),
      );
      assert.equal((svg.match(/<path /g) || []).length, 108);
    }
  }
});
test("HERO-005 회사·기술·제품은 콘텐츠 문구로 PageHero를 직접 쓰고 기술 본문은 h2를 쓴다", () => {
  for (const name of ["company", "technology", "product"]) {
    const page = readFileSync(
      new URL(`../../app/[lang]/${name}/page.tsx`, import.meta.url),
      "utf8",
    );
    const copy = name === "technology" ? "hero" : "intro";
    if (name === "product") {
      assert.match(
        page,
        /<PageHero title=\{copy\.intro\.title\} wave="product">/,
      );
      assert.match(page, /<PurchaseButton/);
      continue;
    }
    assert.match(
      page,
      new RegExp(
        `<PageHero\\s+title=\\{copy\\.${copy}\\.title\\}\\s+description=\\{copy\\.${copy}\\.description\\}\\s+wave="${name}"`,
      ),
    );
    assert.ok(!page.includes("getPurchaseUrl") && !page.includes("copy.facts"));
  }
  const intro = readFileSync(
    new URL(
      "../../app/[lang]/technology/_components/IntroSection.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(
    intro.includes('<h2 className="text-detail-heading') &&
      !intro.includes("<h1"),
  );
  assert.ok(intro.includes('<Reveal className="tech-spectrum">'));
});
