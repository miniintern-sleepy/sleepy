import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "../../_lib/auth")
      return {
        url: "data:text/javascript,export async function requireAdmin(){const s=globalThis.__inquiryReadTest;s.events.push(['auth']);return s.access??{ok:true,client:s.client}}",
        shortCircuit: true,
      };
    return nextResolve(specifier, context);
  },
});
const { readNewInquiryCount, readInquiries, readInquiry } =
  await import("./queries.ts");
let scenario;
const id = "11111111-1111-4111-8111-111111111111";
const readers = [
  () => readNewInquiryCount(),
  () => readInquiries("new", 1),
  () => readInquiry(id),
];
beforeEach(() => {
  scenario = {
    events: [],
    count: 3,
    row: {
      id,
      name: "이름",
      email: "customer@example.test",
      type: "general",
      message: "비공개 문의",
      status: "new",
      created_at: "2026-11-07T00:00:00Z",
      answered_at: null,
      reply_body: "저장된 답변",
      reply_status: "failed",
      reply_attempt: 1,
      reply_email_id: null,
    },
  };
  scenario.client = {
    from(table) {
      assert.equal(table, "inquiries");
      scenario.events.push(["from", table]);
      const result = () => ({
        data: scenario.missing ? null : scenario.row,
        count: scenario.count,
        error: scenario.error,
      });
      return {
        select(columns, options) {
          scenario.events.push(["select", columns, options]);
          return this;
        },
        eq(...args) {
          scenario.events.push(["eq", ...args]);
          return this;
        },
        order(...args) {
          scenario.events.push(["order", ...args]);
          return this;
        },
        range(...args) {
          scenario.events.push(["range", ...args]);
          return this;
        },
        async returns() {
          return {
            ...result(),
            data: scenario.missing ? null : [scenario.row],
          };
        },
        async maybeSingle() {
          return result();
        },
        then(resolve, reject) {
          return Promise.resolve(result()).then(resolve, reject);
        },
      };
    },
  };
  globalThis.__inquiryReadTest = scenario;
});
after(() => {
  delete globalThis.__inquiryReadTest;
  hooks.deregister();
});
test("QRY-001 문의 목록·상세·새 문의 개수는 관리자 확인 실패 시 DB에 접근하지 않는다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    scenario.access = { ok: false, reason };
    for (const read of readers) {
      scenario.events = [];
      assert.deepEqual(await read(), { ok: false, reason });
      assert.deepEqual(scenario.events, [["auth"]]);
    }
  }
});
test("QRY-002 상태별 최신순 페이지·상세·새 문의 개수를 세션으로 조회한다", async () => {
  assert.equal((await readNewInquiryCount()).data, 3);
  const result = await readInquiries("answered", 2);
  assert.equal(result.data.total, 3);
  assert.equal(result.data.items[0].replyBody, "저장된 답변");
  assert.equal(result.data.items[0].replyAttempt, 1);
  assert.equal((await readInquiry(id)).data.message, "비공개 문의");
  assert.ok(
    scenario.events.some(
      (event) =>
        JSON.stringify(event) === JSON.stringify(["eq", "status", "new"]),
    ),
  );
  assert.ok(
    scenario.events.some(
      (event) =>
        JSON.stringify(event) === JSON.stringify(["eq", "status", "answered"]),
    ),
  );
  assert.ok(
    scenario.events.some(
      (event) => JSON.stringify(event) === JSON.stringify(["range", 20, 39]),
    ),
  );
  assert.ok(
    scenario.events.some(
      (event) =>
        JSON.stringify(event) ===
        JSON.stringify(["order", "created_at", { ascending: false }]),
    ),
  );
  assert.equal((await readInquiry("invalid")).data, null);
});
test("QRY-003 조회 장애·집계 누락은 빈 목록이나 0건으로 숨기지 않는다", async () => {
  scenario.error = { message: "비공개 DB 오류" };
  for (const read of readers)
    assert.deepEqual(await read(), { ok: false, reason: "server" });
  scenario.error = null;
  scenario.count = null;
  assert.equal((await readNewInquiryCount()).reason, "server");
  assert.equal((await readInquiries("new", 1)).reason, "server");
  scenario.missing = true;
  assert.equal((await readInquiry(id)).data, null);
});
