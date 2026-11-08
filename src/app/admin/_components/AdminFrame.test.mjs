import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, beforeEach, test } from "node:test";
import ts from "typescript";

const stubs = {
  "../_lib/auth":
    "export async function requireAdmin(){return globalThis.__frame57.access}",
  "../inquiries/_lib/queries":
    "export function readNewInquiryCount(){const s=globalThis.__frame57;s.countReads++;return s.countPromise??Promise.resolve({ok:true,data:2})}",
  "./AdminNav":
    "import{createElement as h}from'react';export default function Nav(){return h('nav',{'aria-label':'관리 메뉴'},'대시보드')}",
  "next/link":
    "import{createElement as h}from'react';export default function Link({children,...props}){return h('a',props,children)}",
};
const hook = registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "react" && context.parentURL?.startsWith("data:"))
      return next(specifier, { ...context, parentURL: import.meta.url });
    if (stubs[specifier])
      return {
        url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}`,
        shortCircuit: true,
      };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith("/AdminFrame.tsx") || url.endsWith("/Dashboard.tsx"))
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
const { default: AdminFrame } = await import("./AdminFrame.tsx");
const { default: Dashboard } = await import("./Dashboard.tsx");
beforeEach(() => {
  globalThis.__frame57 = {
    access: {
      ok: true,
      user: { id: "fake-admin", email: "admin@example.test" },
    },
    countReads: 0,
  };
});
after(() => {
  hook.deregister();
  delete globalThis.__frame57;
});
function data() {
  return {
    newInquiries: { ok: true, data: 0 },
    failedReplies: { ok: true, data: 0 },
    publishedFaqs: { ok: true, data: 21 },
    publishedNews: { ok: true, data: 16 },
    inquiries: { ok: true, data: [] },
    purchaseUrl: { ok: true, data: null },
  };
}
test("DSH-007 로그인 전·권한 없음·인증 장애에는 메뉴와 계정을 표시하거나 집계하지 않는다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    globalThis.__frame57.access = { ok: false, reason };
    const html = renderToStaticMarkup(
      await AdminFrame({ children: createElement("p", null, "인증 안내") }),
    );
    assert.ok(html.includes("인증 안내"));
    assert.ok(
      !html.includes("관리 메뉴") && !html.includes("admin@example.test"),
    );
    assert.equal(globalThis.__frame57.countReads, 0);
  }
});
test(
  "DSH-008 관리자 틀은 메뉴 수 집계를 시작하고 완료를 기다리지 않고 본문을 배치한다",
  { timeout: 1000 },
  async () => {
    globalThis.__frame57.countPromise = new Promise(() => {});
    const html = renderToStaticMarkup(
      await AdminFrame({ children: createElement("h1", null, "관리 본문") }),
    );
    assert.equal(globalThis.__frame57.countReads, 1);
    assert.ok(
      html.includes("관리 메뉴") &&
        html.includes("관리 본문") &&
        html.includes("admin-main"),
    );
  },
);
test("DSH-009 실패 문의가 있을 때만 강조하고 전체 이름·유형·한국 날짜·요약·바로 가기를 표시한다", () => {
  const d = data();
  d.newInquiries.data = 1;
  d.failedReplies.data = 1;
  d.inquiries.data = [
    {
      id: "test-id",
      name: "<전체 이름 & 특수문자>",
      type: "product",
      created_at: "2026-11-07T23:00:00Z",
      reply_status: "failed",
      message: "<한 줄 요약>",
    },
  ];
  const html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.equal((html.match(/data-alert="true"/g) ?? []).length, 1);
  for (const text of [
    "&lt;전체 이름 &amp; 특수문자&gt;",
    "제품 문의",
    "2026.11.08",
    "&lt;한 줄 요약&gt;",
    "/admin/inquiries/test-id",
    "/admin/faq",
    "/admin/newsroom",
  ])
    assert.ok(html.includes(text), text);
  assert.ok(!html.includes("animate-"));
});
test("DSH-010 실패 0건은 강조하지 않고 빈 문의·개별 집계 실패·구매 상태를 구분한다", () => {
  const d = data();
  let html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.ok(!html.includes('data-alert="true"'));
  assert.ok(
    html.includes("처리할 문의가 없습니다.") && html.includes("출시 예정"),
  );
  d.failedReplies = { ok: false };
  d.purchaseUrl = { ok: false };
  html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.ok(
    html.includes("집계 실패") &&
      html.includes("21") &&
      html.includes("16") &&
      html.includes("처리할 문의가 없습니다."),
  );
  assert.ok(html.includes("구매 상태를 불러오지 못했습니다."));
  d.purchaseUrl = { ok: true, data: "https://example.test/shop" };
  assert.ok(
    renderToStaticMarkup(createElement(Dashboard, { data: d })).includes(
      "구매 링크 표시 중",
    ),
  );
});
