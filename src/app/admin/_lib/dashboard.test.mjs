import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { setImmediate } from "node:timers/promises";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "react")
      return {
        url: "data:text/javascript,export function cache(fn){return (...args)=>{const map=globalThis.__dashboard57.renderCache;if(!map)return fn(...args);if(!map.has(fn))map.set(fn,fn(...args));return map.get(fn)}}",
        shortCircuit: true,
      };
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "./auth" || specifier === "../../_lib/auth")
      return {
        url: "data:text/javascript,export async function requireAdmin(){const s=globalThis.__dashboard57;s.authCalls++;return s.access??{ok:true,client:s.client}}",
        shortCircuit: true,
      };
    if (specifier === "../inquiries/_lib/queries")
      return next(
        new URL("../inquiries/_lib/queries.ts", context.parentURL).href,
        context,
      );
    return next(specifier, context);
  },
});
const { readAdminDashboard } = await import("./dashboard.ts");
const { readNewInquiryCount } = await import("../inquiries/_lib/queries.ts");
let scenario;
function inquiry(id, day, reply_status = null, status = "new") {
  return {
    id: String(id),
    name: "전체 이름 " + id,
    type: "general",
    message: "가상 문의",
    created_at: `2026-11-${String(day).padStart(2, "0")}T00:00:00Z`,
    reply_status,
    status,
  };
}
beforeEach(() => {
  scenario = {
    authCalls: 0,
    started: [],
    queries: [],
    errors: new Set(),
    throws: new Set(),
    nullCounts: new Set(),
    data: {
      inquiries: [
        inquiry(1, 1, "failed"),
        inquiry(2, 8),
        inquiry(3, 7, "failed"),
        inquiry(4, 6, "sending"),
        inquiry(5, 5),
        inquiry(6, 4),
        inquiry(7, 8, "failed", "answered"),
      ],
      faqs: [{ is_published: true }, { is_published: false }],
      news_articles: [
        { is_published: false },
        { is_published: true },
        { is_published: true },
      ],
      site_settings: [
        { key: "purchase_url", value: "https://example.test/shop" },
      ],
    },
  };
  scenario.client = {
    from(table) {
      const q = {
        table,
        filters: [],
        orders: [],
        columns: null,
        options: null,
        max: null,
        other: false,
        single: false,
        select(columns, options) {
          this.columns = columns;
          this.options = options;
          return this;
        },
        eq(key, value) {
          this.filters.push([key, value]);
          return this;
        },
        or(value) {
          assert.equal(value, "reply_status.is.null,reply_status.neq.failed");
          this.other = true;
          return this;
        },
        order(key, options) {
          this.orders.push([key, options]);
          return this;
        },
        limit(max) {
          this.max = max;
          return this;
        },
        returns() {
          return this;
        },
        maybeSingle() {
          this.single = true;
          return this;
        },
        async then(resolve, reject) {
          try {
            const kind = this.options?.head ? "count" : "rows";
            const key =
              table +
              ":" +
              kind +
              (table === "inquiries"
                ? this.other
                  ? ":other"
                  : this.filters.some(
                        ([k, v]) => k === "reply_status" && v === "failed",
                      )
                    ? ":failed"
                    : ":new"
                : "");
            scenario.started.push(key);
            scenario.queries.push(this);
            if (scenario.gate) await scenario.gate;
            if (scenario.throws.has(key)) throw Error("비공개 외부 오류");
            let rows = scenario.data[table].filter(
              (row) =>
                this.filters.every(([k, v]) => row[k] === v) &&
                (!this.other || row.reply_status !== "failed"),
            );
            const total = rows.length;
            rows.sort((a, b) => {
              for (const [k, o] of this.orders) {
                if (a[k] !== b[k])
                  return (a[k] < b[k] ? -1 : 1) * (o.ascending ? 1 : -1);
              }
              return 0;
            });
            if (this.max !== null) rows = rows.slice(0, this.max);
            resolve({
              data: this.single ? (rows[0] ?? null) : rows,
              count: scenario.nullCounts.has(key) ? null : total,
              error: scenario.errors.has(key)
                ? { message: "비공개 DB 오류" }
                : null,
            });
          } catch (error) {
            reject(error);
          }
        },
      };
      return q;
    },
  };
  globalThis.__dashboard57 = scenario;
});
after(() => {
  hooks.deregister();
  delete globalThis.__dashboard57;
});

test("DSH-001 권한 확인에 실패하면 대시보드 집계와 개인정보를 읽지 않는다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    scenario.access = { ok: false, reason };
    assert.deepEqual(await readAdminDashboard(), { ok: false, reason });
    assert.deepEqual(scenario.started, []);
  }
});
test("DSH-002 새 문의·새 문의의 실패·공개 FAQ·공개 뉴스만 정확히 집계한다", async () => {
  const { data } = await readAdminDashboard();
  assert.equal(data.newInquiries.data, 6);
  assert.equal(data.failedReplies.data, 2);
  assert.equal(data.publishedFaqs.data, 1);
  assert.equal(data.publishedNews.data, 2);
  const counts = scenario.queries.filter((q) => q.options?.head);
  assert.equal(counts.length, 4);
  assert.ok(
    counts.every((q) => q.options.count === "exact" && q.columns === "id"),
  );
});
test("DSH-003 처리할 문의는 실패 먼저·각 최신순 최대 다섯 건이며 필요한 열만 읽는다", async () => {
  const { data } = await readAdminDashboard();
  assert.deepEqual(
    data.inquiries.data.map((x) => x.id),
    ["3", "1", "2", "4", "5"],
  );
  const lists = scenario.queries.filter(
    (q) => q.table === "inquiries" && !q.options?.head,
  );
  assert.equal(lists.length, 2);
  assert.ok(
    lists.every(
      (q) =>
        q.max === 5 &&
        q.filters.some(([k, v]) => k === "status" && v === "new"),
    ),
  );
  assert.ok(
    lists.every(
      (q) => !q.columns.includes("email") && !q.columns.includes("reply_body"),
    ),
  );
  assert.ok(
    lists.every(
      (q) =>
        JSON.stringify(q.orders) ===
        JSON.stringify([
          ["created_at", { ascending: false }],
          ["id", { ascending: false }],
        ]),
    ),
  );
  scenario.data.inquiries = [
    ...Array.from({ length: 6 }, (_, i) => inquiry(i + 10, i + 1, "failed")),
    inquiry(30, 8),
  ];
  assert.deepEqual(
    (await readAdminDashboard()).data.inquiries.data.map((row) => row.id),
    ["15", "14", "13", "12", "11"],
  );
});
test("DSH-004 빈 문의는 빈 목록이며 HTTPS 구매 주소만 활성 상태로 읽는다", async () => {
  scenario.data.inquiries = [];
  assert.deepEqual((await readAdminDashboard()).data.inquiries, {
    ok: true,
    data: [],
  });
  assert.equal(
    (await readAdminDashboard()).data.purchaseUrl.data,
    "https://example.test/shop",
  );
  for (const value of [null, "", "http://example.test/shop"]) {
    scenario.data.site_settings[0].value = value;
    assert.deepEqual((await readAdminDashboard()).data.purchaseUrl, {
      ok: true,
      data: null,
    });
  }
  scenario.data.site_settings = [];
  assert.deepEqual((await readAdminDashboard()).data.purchaseUrl, {
    ok: true,
    data: null,
  });
});
test("DSH-005 오류·예외·누락 집계는 해당 영역만 실패하고 다른 영역은 유지한다", async () => {
  for (const mode of ["errors", "throws"]) {
    scenario[mode] = new Set([
      "faqs:count",
      "inquiries:rows:failed",
      "site_settings:rows",
    ]);
    const result = await readAdminDashboard();
    assert.equal(result.ok, true);
    assert.deepEqual(result.data.publishedFaqs, { ok: false });
    assert.deepEqual(result.data.inquiries, { ok: false });
    assert.deepEqual(result.data.purchaseUrl, { ok: false });
    assert.equal(result.data.publishedNews.data, 2);
    assert.equal(result.data.newInquiries.data, 6);
    scenario[mode].clear();
  }
  scenario.nullCounts.add("inquiries:count:failed");
  assert.deepEqual((await readAdminDashboard()).data.failedReplies, {
    ok: false,
  });
});
test("DSH-006 메뉴와 공유하는 새 문의 수를 포함한 조회를 앞선 조회 완료 전에 시작한다", async () => {
  let release;
  scenario.gate = new Promise((resolve) => {
    release = resolve;
  });
  const pending = readAdminDashboard();
  await setImmediate();
  assert.equal(scenario.started.length, 7);
  assert.equal(
    scenario.started.filter((x) => x === "inquiries:count:new").length,
    1,
  );
  release();
  assert.equal((await pending).ok, true);
});

test("DSH-011 같은 렌더 요청의 메뉴·본문은 새 문의 집계 한 번을 공유하고 다음 요청은 갱신한다", async () => {
  scenario.renderCache = new Map();
  const [menu, dashboard] = await Promise.all([
    readNewInquiryCount(),
    readAdminDashboard(),
  ]);
  assert.equal(menu, dashboard.data.newInquiries);
  assert.equal(
    scenario.started.filter((key) => key === "inquiries:count:new").length,
    1,
  );
  scenario.data.inquiries = [];
  scenario.renderCache = new Map();
  assert.equal((await readNewInquiryCount()).data, 0);
  assert.equal(
    scenario.started.filter((key) => key === "inquiries:count:new").length,
    2,
  );
});
