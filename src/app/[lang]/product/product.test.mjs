import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, beforeEach, test } from "node:test";
import ts from "typescript";
import { productCopy } from "../../../content/ko/product.ts";
import { uiCopy } from "../../../content/ko/ui.ts";

const uiUrl = new URL("../../../content/ko/ui.ts", import.meta.url).href;
const stubs = {
  "@/lib/content": `import{uiCopy}from${JSON.stringify(uiUrl)};export function getUiCopy(){return uiCopy} export function pageMetadata(){return {}} export async function getProductCopy(){return globalThis.__product79.copy} export async function getProductSpecs(){return globalThis.__product79.specs} export async function getPurchaseUrl(){return globalThis.__product79.url}`,
  "@/lib/analytics": "export function track(){}",
  "@/components/ui/Reveal":
    "import{createElement as h}from'react';export default function Reveal({children,className}){return h('div',{className},children)}",
  "next/image":
    "import{createElement as h}from'react';export default function Image({fill,...props}){return h('img',props)}",
  "next/link":
    "import{createElement as h}from'react';export default function Link({children,...props}){return h('a',props,children)}",
};
const hook = registerHooks({
  resolve(s, c, n) {
    if (s.endsWith(".css"))
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (s === "react" && c.parentURL?.endsWith("/ProductGallery.tsx"))
      return {
        url:
          "data:text/javascript," +
          encodeURIComponent(
            "export function useState(initial){return [globalThis.__product79.position??initial,n=>globalThis.__product79.position=n]} export function useRef(){return {current:globalThis.__product79.track??null}} export function useEffect(effect){globalThis.__product79.effect=effect}",
          ),
        shortCircuit: true,
      };
    if (s === "react" && c.parentURL?.startsWith("data:"))
      return n(s, { ...c, parentURL: import.meta.url });
    if (stubs[s])
      return {
        url: `data:text/javascript,${encodeURIComponent(stubs[s])}`,
        shortCircuit: true,
      };
    if (s.startsWith("@/"))
      return n(
        new URL(
          `../../../${s.slice(2)}.${s.startsWith("@/lib/") ? "ts" : "tsx"}`,
          import.meta.url,
        ).href,
        c,
      );
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
const { default: ProductPage } = await import("./page.tsx");
const { default: SpecsSection } =
  await import("./_components/SpecsSection.tsx");
const { default: ProductGallery } =
  await import("./_components/ProductGallery.tsx");
const { default: PurchaseButton } =
  await import("../../../components/ui/PurchaseButton.tsx");
beforeEach(() => {
  globalThis.__product79 = {
    copy: productCopy,
    specs: [],
    url: null,
  };
});
after(() => {
  hook.deregister();
  delete globalThis.__product79;
});
const page = () => ProductPage({ params: Promise.resolve({ lang: "ko" }) });
function elements(node) {
  if (!node || typeof node !== "object") return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(elements)];
}
test("PRD-001 DB 사양이 없거나 긴 소비전력 문장이 있어도 구성 숫자는 고정 네 칸이다", async () => {
  for (const specs of [
    [],
    [{ id: 1, label: "소비전력", value: "5V / 초저전력 아키텍처 적용" }],
  ]) {
    globalThis.__product79.specs = specs;
    const tree = await page();
    const html = renderToStaticMarkup(tree);
    const metrics = html.match(
      /<dl class="product-kit-metrics">([\s\S]*?)<\/dl>/,
    )[1];
    assert.equal((metrics.match(/<dt/g) ?? []).length, 4);
    for (const value of ["3 g", "26 g", "5V", "1년"])
      assert.ok(metrics.includes(value));
    assert.ok(!metrics.includes("초저전력"));
    const kit = elements(tree).find((e) => e.type?.name === "KitSection");
    assert.ok(!Object.hasOwn(kit.props, "specs"));
  }
});
test("PRD-002 사양이 0줄이면 표만 숨기고 입력된 전체 사양과 줄바꿈은 보존한다", () => {
  assert.equal(
    renderToStaticMarkup(
      createElement(SpecsSection, { specs: [], ui: uiCopy.product }),
    ),
    "",
  );
  const specs = Array.from({ length: 11 }, (_, i) => ({
    id: i,
    label: `사양 ${i}`,
    value: `첫 줄 ${i}\n둘째 줄`,
  }));
  const html = renderToStaticMarkup(
    createElement(SpecsSection, { specs, ui: uiCopy.product }),
  );
  assert.equal((html.match(/<dt/g) ?? []).length, 11);
  assert.ok(
    html.includes("첫 줄 0\n둘째 줄") && html.includes("첫 줄 10\n둘째 줄"),
  );
});
test("PRD-003 제품 히어로는 설명 대신 구매 버튼을 넣고 주소 유무에 따라 링크와 출시 예정을 표시한다", async () => {
  for (const url of [null, "http://example.test", "https://example.test/buy"]) {
    globalThis.__product79.url = url;
    const tree = await page();
    const button = elements(tree).find((e) => e.type === PurchaseButton);
    assert.equal(button.props.location, "product");
    const html = renderToStaticMarkup(tree);
    const hero = html.match(
      /<header class="page-hero page-hero-product">([\s\S]*?)<\/header>/,
    )[1];
    assert.ok(!hero.includes("<p") && !hero.includes("page-hero-description"));
    if (url?.startsWith("https://"))
      assert.match(
        hero,
        /<a href="https:\/\/example.test\/buy" target="_blank" rel="noopener noreferrer"/,
      );
    else
      assert.match(
        hero,
        /<button type="button" disabled="" class="public-purchase">출시 예정<\/button>/,
      );
  }
});
test("PRD-004 사진 띠는 네 사진을 순서대로 표시하고 제목·조작부 접근성을 유지한다", async () => {
  const tree = ProductGallery({
    photos: productCopy.features.photos,
    ui: uiCopy.product,
  });
  const nodes = elements(tree);
  const images = nodes.filter((e) => e.props?.loading === "eager");
  assert.deepEqual(
    images.map((e) => e.props.src),
    productCopy.features.photos.map((p) => p.src),
  );
  assert.deepEqual(
    images.map((e) => e.props.alt),
    productCopy.features.photos.map((p) => p.alt),
  );
  assert.ok(images.every((e) => e.props.alt && !e.props.priority));
  assert.ok(images[0].props.sizes.includes("260px"));
  assert.ok(images[2].props.sizes.includes("390px"));
  const buttons = nodes.filter((e) => e.type === "button");
  assert.deepEqual(
    buttons.map((e) => e.props["aria-label"]),
    ["이전 사진", "다음 사진"],
  );
  // 가설: 끝에 닿은 버튼을 disabled로 바꾸면 그 버튼에 있던 키보드 초점이 BODY로 빠진다.
  // 확인: 1024px에서 다음 사진에 초점을 두고 끝까지 이동 → activeElement BODY (2026-11-15, PR #80).
  // 그래서 비활성은 aria-disabled로만 알리고 버튼은 초점을 받을 수 있게 둔다.
  assert.deepEqual(
    buttons.map((e) => e.props["aria-disabled"]),
    [true, false],
  );
  assert.ok(buttons.every((e) => e.props.disabled === undefined));
  const track = nodes.find(
    (e) => e.props?.className === "product-gallery-track",
  );
  assert.equal(track.props.tabIndex, 0);
  assert.equal(track.props.role, "group");
  assert.equal(
    track.props["aria-label"],
    "제품 사진 4장, 좌우로 넘겨 볼 수 있습니다",
  );
  const html = renderToStaticMarkup(tree);
  assert.doesNotMatch(html, /thumbnails|dots|data-active/);
  const pageHtml = renderToStaticMarkup(await page());
  assert.match(pageHtml, /id="product-gallery-title" class="sr-only"/);
});

test("PRD-005 스크롤 갱신은 프레임으로 묶고 한 장씩 이동하며 끝과 진행 선을 계산한다", () => {
  const css = readFileSync(new URL("./product.css", import.meta.url), "utf8");
  assert.match(css, /scroll-padding-inline: var\(--gallery-inset\)/);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.product-gallery-track\s*\{\s*scroll-behavior: auto/,
  );
  const saved = Object.fromEntries(
    [
      "window",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "getComputedStyle",
    ].map((k) => [k, globalThis[k]]),
  );
  const frames = new Map();
  let serial = 0;
  let zoom = 1;
  const handlers = new Map();
  const track = {
    scrollLeft: 0,
    scrollWidth: 2967,
    clientWidth: 1440,
    getBoundingClientRect: () => ({ left: 10, width: 1440 * zoom }),
    addEventListener: (name, fn) => handlers.set(name, fn),
    removeEventListener: (name, fn) => {
      assert.equal(handlers.get(name), fn);
      handlers.delete(name);
    },
    scrollTo(options) {
      assert.equal(options.behavior, undefined);
      this.scrollLeft = Math.max(0, Math.min(1527, options.left));
    },
  };
  track.children = [0, 544, 1088, 1892].map((start) => ({
    getBoundingClientRect: () => ({
      left: 10 + (100 + start - track.scrollLeft) * zoom,
    }),
  }));
  globalThis.__product79.track = track;
  globalThis.window = {
    addEventListener: (n, f) => handlers.set(n, f),
    removeEventListener: (n, f) => {
      assert.equal(handlers.get(n), f);
      handlers.delete(n);
    },
  };
  globalThis.getComputedStyle = () => ({ paddingInlineStart: "100px" });
  globalThis.requestAnimationFrame = (fn) => {
    frames.set(++serial, fn);
    return serial;
  };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  const flush = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((fn) => fn());
  };
  const render = () =>
    ProductGallery({
      photos: productCopy.features.photos,
      ui: uiCopy.product,
    });
  const buttons = () => elements(render()).filter((e) => e.type === "button");
  try {
    render();
    const cleanup = globalThis.__product79.effect();
    handlers.get("scroll")();
    handlers.get("scroll")();
    assert.equal(frames.size, 1);
    flush();
    assert.equal(globalThis.__product79.position.visible, 1440 / 2967);
    assert.equal(globalThis.__product79.position.start, true);
    for (const expected of [544, 1088, 1527]) {
      buttons()[1].props.onClick();
      handlers.get("scroll")();
      flush();
      assert.equal(track.scrollLeft, expected);
    }
    assert.equal(buttons()[1].props["aria-disabled"], true);
    buttons()[1].props.onClick();
    assert.equal(track.scrollLeft, 1527);
    assert.equal(globalThis.__product79.position.progress, 1);
    for (const expected of [1088, 544, 0]) {
      buttons()[0].props.onClick();
      handlers.get("scroll")();
      flush();
      assert.equal(track.scrollLeft, expected);
    }
    assert.equal(buttons()[0].props["aria-disabled"], true);
    buttons()[0].props.onClick();
    assert.equal(track.scrollLeft, 0);
    zoom = 2;
    buttons()[1].props.onClick();
    assert.equal(track.scrollLeft, 544);
    handlers.get("resize")();
    assert.equal(frames.size, 1);
    cleanup();
    assert.equal(frames.size, 0);
    assert.equal(handlers.size, 0);
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete globalThis[k];
      else globalThis[k] = v;
    }
  }
});

test("PRD-006 사용 방법 안내 제목은 문구의 줄바꿈을 유지한다", async () => {
  const html = renderToStaticMarkup(await page());
  const title = productCopy.howToUse.notes[0].title;
  assert.ok(title.includes("\n"));
  assert.ok(
    html.includes(
      `<h3 class="text-guide-heading whitespace-pre-line">${title}</h3>`,
    ),
  );
});
