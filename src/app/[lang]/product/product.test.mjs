import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, beforeEach, test } from "node:test";
import ts from "typescript";
import { productCopy } from "../../../content/ko/product.ts";

const stubs = {
  "@/lib/content":
    "export async function getProductCopy(){return globalThis.__product79.copy} export async function getProductSpecs(){return globalThis.__product79.specs} export async function getPurchaseUrl(){return globalThis.__product79.url}",
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
            "export function useState(){return [globalThis.__product79.active,n=>globalThis.__product79.active=n]} export function useRef(){return {current:globalThis.__product79.track??null}} export function useEffect(effect){globalThis.__product79.effect=effect}",
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
    active: 0,
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
    renderToStaticMarkup(createElement(SpecsSection, { specs: [] })),
    "",
  );
  const specs = Array.from({ length: 11 }, (_, i) => ({
    id: i,
    label: `사양 ${i}`,
    value: `첫 줄 ${i}\n둘째 줄`,
  }));
  const html = renderToStaticMarkup(createElement(SpecsSection, { specs }));
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
test("PRD-004 갤러리 미리보기를 선택하면 큰 사진과 선택 버튼·위치 점이 함께 바뀐다", () => {
  const render = () => ProductGallery({ photos: productCopy.features.photos });
  const initial = render();
  const buttons = elements(initial).filter((e) => e.type === "button");
  assert.equal(buttons.length, 4);
  assert.equal(buttons[0].props["aria-pressed"], true);
  assert.ok(
    buttons.every((e, i) =>
      e.props["aria-label"].startsWith(`사진 ${i + 1} 보기:`),
    ),
  );
  buttons[2].props.onClick();
  const selected = render();
  const selectedButtons = elements(selected).filter((e) => e.type === "button");
  assert.deepEqual(
    selectedButtons.map((e) => e.props["aria-pressed"]),
    [false, false, true, false],
  );
  const html = renderToStaticMarkup(selected);
  assert.match(html, /data-index="2" data-active="true"/);
  assert.match(
    html,
    /product-gallery-dots" aria-hidden="true"><span data-active="false"><\/span><span data-active="false"><\/span><span data-active="true"/,
  );
  assert.equal((html.match(/sizes="120px"/g) ?? []).length, 4);
  assert.ok(!html.includes("priority"));
});

test("PRD-005 모바일 위치 점은 사진이 60% 이상 보일 때 바뀌고 관찰을 정리한다", () => {
  const previous = globalThis.IntersectionObserver;
  const previousWindow = globalThis.window;
  let listener;
  const mobile = {
    matches: true,
    addEventListener(_, callback) {
      listener = callback;
    },
    removeEventListener(_, callback) {
      assert.equal(callback, listener);
    },
  };
  globalThis.window = { matchMedia: () => mobile };
  const track = {
    children: Array.from({ length: 4 }, (_, i) => ({
      dataset: { index: String(i) },
    })),
  };
  globalThis.__product79.track = track;
  let callback,
    options,
    disconnected = false;
  const observed = [];
  globalThis.IntersectionObserver = class {
    constructor(cb, opts) {
      callback = cb;
      options = opts;
    }
    observe(node) {
      observed.push(node);
    }
    disconnect() {
      disconnected = true;
    }
  };
  try {
    ProductGallery({ photos: productCopy.features.photos });
    const cleanup = globalThis.__product79.effect();
    assert.equal(options.root, track);
    assert.equal(options.threshold, 0.6);
    assert.equal(observed.length, 4);
    callback([
      {
        isIntersecting: true,
        intersectionRatio: 0.1,
        target: track.children[1],
      },
    ]);
    assert.equal(globalThis.__product79.active, 0);
    callback([
      {
        isIntersecting: true,
        intersectionRatio: 0.9,
        target: track.children[1],
      },
    ]);
    assert.equal(globalThis.__product79.active, 1);
    mobile.matches = false;
    listener();
    callback([
      { isIntersecting: true, intersectionRatio: 1, target: track.children[3] },
    ]);
    assert.equal(globalThis.__product79.active, 1);
    callback([
      {
        isIntersecting: false,
        intersectionRatio: 0,
        target: track.children[2],
      },
    ]);
    assert.equal(globalThis.__product79.active, 1);
    disconnected = false;
    cleanup();
    assert.equal(disconnected, true);
  } finally {
    if (previous === undefined) delete globalThis.IntersectionObserver;
    else globalThis.IntersectionObserver = previous;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
