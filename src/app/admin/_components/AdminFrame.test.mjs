import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { after, beforeEach, test } from "node:test";
import ts from "typescript";

const stubs = {
  "./_lib/dashboard":
    "export async function readAdminDashboard(){return globalThis.__frame57.dashboardResult}",
  "../_lib/content":
    "export async function readAdminFaqs(){return globalThis.__frame57.faqs} export async function readAdminNews(){return globalThis.__frame57.news}",
  "../actions":
    "export async function login(){return {ok:false}} export async function logout(){return {ok:false}}",
  "../content-actions":
    "export async function upsertFaq(){return {ok:true}} export async function upsertNewsArticle(){return {ok:true}} export async function deleteFaq(){} export async function deleteNewsArticle(){}",
  "../_components/ContentTable": "export default function Table(){return null}",
  "../_components/AccessNotice":
    "export default function Notice(){return null}",
  "next/image":
    "import{createElement as h}from'react';export default function Image(props){return h('img',props)}",
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
    if (
      [
        "./_components/AdminLoading",
        "./_components/LoginForm",
        "./_components/LogoutForm",
        "./_components/Dashboard",
        "../_components/AdminLoading",
        "../_components/FaqForm",
        "../_components/NewsArticleForm",
        "../_components/form-ui",
        "./form-ui",
        "./FormHeading",
      ].includes(specifier)
    )
      return next(new URL(`${specifier}.tsx`, context.parentURL).href, context);
    if (specifier === "../_lib/validation")
      return next(new URL(`${specifier}.ts`, context.parentURL).href, context);
    return next(specifier, context);
  },
  load(url, context, next) {
    if (
      url.startsWith(new URL("../", import.meta.url).href) &&
      url.endsWith(".tsx")
    )
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
const { default: AdminPage } = await import("../page.tsx");
const { default: FaqPage } = await import("../faq/page.tsx");
const { default: NewsroomPage } = await import("../newsroom/page.tsx");
const { default: FormHeading } = await import("./FormHeading.tsx");
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
    "/admin/faq#faq-form-title",
    "/admin/newsroom#news-form-title",
  ])
    assert.ok(html.includes(text), text);
  assert.ok(!html.includes("animate-"));
});
test("DSH-010 실패 0건은 강조하지 않고 빈 문의·개별 집계 실패·구매 상태를 구분한다", () => {
  const d = data();
  let html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.ok(!html.includes('data-alert="true"'));
  assert.ok(html.includes("처리할 새 문의가 없습니다."));
  assert.ok(!html.includes("0건을 확인해 주세요."));
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

async function renderPage(Page, props = {}) {
  const boundary = Page(props);
  const content = boundary.props.children;
  return renderToStaticMarkup(await content.type(content.props));
}

test("DSH-012 관리자 홈의 권한 없음은 기존 제목·안내·로그아웃을 표시하고 자기 링크를 만들지 않는다", async () => {
  globalThis.__frame57.dashboardResult = { ok: false, reason: "forbidden" };
  const html = await renderPage(AdminPage);
  assert.ok(html.includes("접근 권한이 없습니다"));
  assert.ok(html.includes("관리자 계정으로 다시 로그인해 주세요."));
  assert.ok(html.includes('role="alert"') && html.includes("로그아웃"));
  assert.ok(html.includes("data-admin-access-denied"));
  assert.ok(!html.includes("<a ") && !html.includes('href="/admin"'));
});

test("DSH-013 관리자 홈의 인증 장애도 기존 제목·안내·로그아웃을 표시하고 자기 링크를 만들지 않는다", async () => {
  globalThis.__frame57.dashboardResult = { ok: false, reason: "server" };
  const html = await renderPage(AdminPage);
  assert.ok(html.includes("인증 상태를 확인하지 못했습니다"));
  assert.ok(
    html.includes(
      "잠시 후 페이지를 새로 고쳐 주세요. 문제가 계속되면 담당자에게 문의해 주세요.",
    ),
  );
  assert.ok(html.includes('role="alert"') && html.includes("로그아웃"));
  assert.ok(!html.includes("<a ") && !html.includes('href="/admin"'));
});

test("DSH-014 관리자 홈의 비로그인은 기존 로그인 폼을 유지한다", async () => {
  globalThis.__frame57.dashboardResult = {
    ok: false,
    reason: "unauthenticated",
  };
  const html = await renderPage(AdminPage);
  assert.ok(html.includes("관리자 로그인") && html.includes('type="password"'));
  assert.ok(!html.includes("로그아웃"));
});

test("DSH-015 추가 바로 가기는 실제 폼 제목을 가리키고 추가·수정 페이지에 같은 ID가 중복되지 않는다", async () => {
  globalThis.__frame57.faqs = {
    ok: true,
    data: [
      {
        id: 1,
        question: "가짜 질문",
        answer: "가짜 답변",
        sortOrder: 0,
        isPublished: true,
      },
    ],
  };
  globalThis.__frame57.news = {
    ok: true,
    data: [
      {
        id: 2,
        title: "가짜 기사",
        category: "company",
        summary: "요약",
        publishedAt: "2026-11-08",
        thumbnailUrl: null,
        sourceName: null,
        sourceUrl: null,
        isPublished: true,
        isFeatured: false,
      },
    ],
  };
  const dashboard = renderToStaticMarkup(
    createElement(Dashboard, { data: data() }),
  );
  for (const [Page, path, id, itemId, addTitle, editTitle] of [
    [FaqPage, "/admin/faq", "faq-form-title", "1", "FAQ 추가", "FAQ 수정"],
    [
      NewsroomPage,
      "/admin/newsroom",
      "news-form-title",
      "2",
      "기사 추가",
      "기사 수정",
    ],
  ]) {
    assert.ok(dashboard.includes(`href="${path}#${id}"`));
    for (const edit of [undefined, itemId]) {
      const html = await renderPage(Page, {
        searchParams: Promise.resolve(edit ? { edit } : {}),
      });
      assert.equal((html.match(new RegExp(`id="${id}"`, "g")) ?? []).length, 1);
      assert.ok(html.includes(edit ? editTitle : addTitle));
    }
  }
});

test("DSH-016 늦게 나타난 폼 제목은 현재 해시가 일치할 때만 즉시 이동한다", () => {
  const heading = FormHeading({ id: "faq-form-title", children: "FAQ 추가" });
  const calls = [];
  const node = {
    id: "faq-form-title",
    ownerDocument: { location: { hash: "#faq-form-title" } },
    scrollIntoView: (options) => calls.push(options),
  };
  heading.props.ref(node);
  assert.deepEqual(calls, [{ block: "start", behavior: "instant" }]);
  node.ownerDocument.location.hash = "#다른-제목";
  heading.props.ref(node);
  heading.props.ref(null);
  assert.equal(calls.length, 1);
});
