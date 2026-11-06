import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "./auth")
      return {
        url: "data:text/javascript,export async function requireAdmin(){const s=globalThis.__adminReadTest;s.events.push('auth');return s.access??{ok:true,client:s.client}}",
        shortCircuit: true,
      };
    return nextResolve(specifier, context);
  },
});
const { readAdminFaqs, readAdminProduct, readAdminNews } =
  await import("./content.ts");
const readers = [readAdminFaqs, readAdminProduct, readAdminNews];
let scenario;
beforeEach(() => {
  scenario = { events: [], error: null, access: null };
  const rows = {
    faqs: [
      {
        id: 1,
        question: "비공개 질문",
        answer: "답변",
        sort_order: 2,
        is_published: false,
      },
    ],
    product_specs: [
      {
        id: 2,
        label: "비공개 사양",
        value: "값",
        sort_order: 3,
        is_published: false,
      },
    ],
    site_settings: { value: "https://example.test/shop" },
    news_articles: [
      {
        id: 3,
        title: "비공개 기사",
        category: "notice",
        summary: "요약",
        source_name: null,
        source_url: null,
        thumbnail_url: null,
        published_at: "2026-11-06",
        is_published: false,
        is_featured: true,
      },
    ],
  };
  scenario.client = {
    from(table) {
      scenario.events.push(`read:${table}`);
      return {
        select() {
          return this;
        },
        eq(key, value) {
          assert.equal(table, "site_settings");
          assert.equal(key, "key");
          assert.equal(value, "purchase_url");
          return this;
        },
        order(key, options) {
          scenario.events.push(
            `order:${table}:${key}:${options?.ascending ?? true}`,
          );
          return this;
        },
        async returns() {
          return { data: rows[table], error: scenario.error };
        },
        async maybeSingle() {
          return { data: rows[table], error: scenario.error };
        },
      };
    },
  };
  globalThis.__adminReadTest = scenario;
});
after(() => {
  delete globalThis.__adminReadTest;
  hooks.deregister();
});

test("ACM-021 관리용 읽기는 관리자 확인에 실패하면 DB에 접근하지 않는다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    scenario.access = { ok: false, reason };
    for (const read of readers) {
      scenario.events = [];
      assert.deepEqual(await read(), { ok: false, reason });
      assert.deepEqual(scenario.events, ["auth"]);
    }
  }
});
test("ACM-022 관리용 읽기는 비공개 항목과 구매 주소를 포함하고 정렬 조건을 적용한다", async () => {
  const faqs = await readAdminFaqs();
  const product = await readAdminProduct();
  const news = await readAdminNews();
  assert.equal(faqs.data[0].isPublished, false);
  assert.equal(faqs.data[0].sortOrder, 2);
  assert.equal(product.data.specs[0].isPublished, false);
  assert.equal(product.data.purchaseUrl, "https://example.test/shop");
  assert.equal(news.data[0].isPublished, false);
  assert.equal(news.data[0].summary, "요약");
  assert.equal(news.data[0].isFeatured, true);
  assert.ok(scenario.events.includes("order:faqs:sort_order:true"));
  assert.ok(scenario.events.includes("order:product_specs:id:true"));
  assert.ok(scenario.events.includes("order:news_articles:published_at:false"));
});
test("ACM-023 관리용 조회 오류는 빈 목록으로 숨기지 않고 실패를 반환한다", async () => {
  scenario.error = { message: "DB 오류" };
  for (const read of readers)
    assert.deepEqual(await read(), { ok: false, reason: "server" });
});
