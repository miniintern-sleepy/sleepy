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
  "next/navigation":
    "export function usePathname(){return globalThis.__frame57.path??'/admin'}",
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
        "./AdminNav",
        "./LogoutForm",
        "./AdminIcon",
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
      !html.includes("관리 메뉴") &&
        !html.includes("admin-topbar") &&
        !html.includes("admin@example.test"),
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
test("DSH-009 실패 문의가 있을 때만 강조하고 전체 이름·유형·한국 날짜·상태·바로 가기를 표시한다", () => {
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
    "/admin/inquiries/test-id",
    "/admin/faq#faq-form-title",
    "/admin/newsroom#news-form-title",
  ])
    assert.ok(html.includes(text), text);
  assert.ok(!html.includes("animate-") && !html.includes("한 줄 요약"));
});
test("DSH-010 실패 0건은 강조하지 않고 빈 문의·개별 집계 실패·구매 상태를 구분한다", () => {
  const d = data();
  let html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.ok(!html.includes('data-alert="true"'));
  assert.ok(!html.includes("처리할 새 문의가 없습니다."));
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
  assert.ok(html.includes("상태 확인 실패"));
  d.purchaseUrl = { ok: true, data: "https://example.test/shop" };
  assert.ok(
    renderToStaticMarkup(createElement(Dashboard, { data: d })).includes(
      "링크 표시 중",
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

test("DSH-018 새 문의가 열 건이면 외 한 건, 아홉 건 이하면 생략하고 집계 실패는 전체 보기만 표시한다", () => {
  const d = data();
  d.newInquiries = { ok: true, data: 10 };
  let html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.match(html, /외 1건 더 있음 · 전체 보기/);
  assert.match(html, /href="\/admin\/inquiries\?status=new"/);
  for (const n of [0, 1, 9]) {
    d.newInquiries = { ok: true, data: n };
    html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
    assert.ok(!html.includes("더 있음") && !html.includes("?status=new"));
  }
  d.newInquiries = { ok: false };
  html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  assert.match(html, /<a href="\/admin\/inquiries\?status=new">전체 보기<\/a>/);
  assert.ok(!html.includes("더 있음"));
});

test("DSH-019 발송 중 문의도 새 문의로 표시하며 문의 본문 미리보기 없이 아홉 행을 렌더링한다", () => {
  const d = data();
  d.newInquiries = { ok: true, data: 9 };
  d.inquiries = {
    ok: true,
    data: Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1),
      name: "시험 이름 " + i,
      type: "general",
      created_at: "2026-11-10T16:00:00Z",
      reply_status: "sending",
      message: "보이면 안 되는 본문",
    })),
  };
  const html = renderToStaticMarkup(createElement(Dashboard, { data: d }));
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)[1];
  assert.equal((tbody.match(/data-inquiry-row/g) || []).length, 9);
  assert.equal((tbody.match(/data-state="new"/g) || []).length, 9);
  assert.ok(tbody.includes("새 문의") && tbody.includes("2026.11.11"));
  assert.ok(
    !html.includes("보이면 안 되는 본문") && !tbody.includes("발송 중"),
  );
  assert.match(html, /<th[^>]*scope="col"[^>]*>이름<\/th>/);
  assert.match(html, /<caption[^>]*>처리할 문의/);
  assert.match(tbody, /admin-inquiry-link text-helper font-ui-medium/);
  assert.match(tbody, /admin-inquiry-date text-helper/);
  assert.match(tbody, /admin-inquiry-state text-helper/);
  assert.ok(
    !tbody.includes("text-meta") && !tbody.includes("text-study-title"),
  );
});

test("DSH-020 머리줄은 부모 메뉴 제목과 로그인 이메일을 표시하고 인증 실패에서는 메뉴와 함께 없다", async () => {
  globalThis.__frame57.path = "/admin/inquiries/9";
  let html = renderToStaticMarkup(
    await AdminFrame({ children: createElement("p", null, "본문") }),
  );
  const header = html.match(
    /<header class="admin-topbar">([\s\S]*?)<\/header>/,
  )[1];
  assert.ok(
    header.includes("문의") &&
      header.includes("관리자") &&
      header.includes("admin@example.test"),
  );
  assert.match(html, /aria-current="page"/);
  assert.match(header, /class="text-form-title font-ui-selected">문의<\/p>/);
  assert.match(header, /class="admin-account-avatar[^\"]*"[^>]*>관<\/span>/);
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    globalThis.__frame57.access = { ok: false, reason };
    html = renderToStaticMarkup(
      await AdminFrame({ children: createElement("p", null, "접근 거부") }),
    );
    assert.ok(
      !html.includes("admin-topbar") &&
        !html.includes("admin-sidebar") &&
        !html.includes("admin@example.test"),
    );
  }
});

test("DSH-021 접근 거부로 전환하면 남아 있는 메뉴와 머리줄을 모두 숨기는 규칙을 유지한다", () => {
  const css = readFileSync(new URL("../admin.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.admin-dashboard-shell:has\(\[data-admin-access-denied\]\) \.admin-sidebar,\s*\.admin-dashboard-shell:has\(\[data-admin-access-denied\]\) \.admin-topbar\s*\{\s*display:\s*none;/,
  );
});

test("DSH-022 숫자는 줄바꿈하지 않고 중간 폭에서는 문의 한 열과 지표 두 열을 사용한다", () => {
  const css = readFileSync(new URL("../admin.css", import.meta.url), "utf8");
  const number = css.match(/\.admin-metric-number\s*\{([^}]*)\}/)[1];
  assert.match(number, /white-space:\s*nowrap/);
  assert.ok(!number.includes("overflow-wrap"));
  assert.match(
    css,
    /@media \(max-width: 1280px\)\s*\{\s*\.admin-dashboard-columns\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  assert.match(
    css,
    /@media \(max-width: 1100px\)\s*\{\s*\.admin-dashboard-metrics\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    css,
    /\.admin-dashboard-table td:not\(:first-child\)\s*\{\s*white-space:\s*nowrap/,
  );
});
