import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const originalFetch = globalThis.fetch;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/supabase/server")
      return {
        url: "data:text/javascript,export function createServiceClient(){return globalThis.__inquiryTest.client}",
        shortCircuit: true,
      };
    if (specifier === "next/headers")
      return {
        url: "data:text/javascript,export async function headers(){return new Headers({host:'localhost:3054'})}",
        shortCircuit: true,
      };
    if (specifier === "./_components/form")
      return nextResolve(
        new URL("./_components/form.ts", context.parentURL).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});

const { submitInquiry } = await import("./actions.ts");
const { validateInquiry } = await import("./_components/form.ts");
let scenario;

beforeEach(() => {
  for (const name of ["TURNSTILE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"])
    process.env[name] = "local-test-value";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54329";
  scenario = {
    events: [],
    rows: [],
    lookupError: null,
    insertError: null,
    verification: { success: true, action: "contact", hostname: "localhost" },
  };
  const query = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    gte(column, value) {
      assert.equal(column, "created_at");
      assert.ok(Math.abs(Date.now() - Date.parse(value) - 60000) < 1000);
      return this;
    },
    async limit() {
      scenario.events.push("lookup");
      return { data: scenario.rows, error: scenario.lookupError };
    },
    async insert(value) {
      scenario.events.push("insert");
      scenario.saved = value;
      return { error: scenario.insertError };
    },
  };
  globalThis.__inquiryTest = {
    client: {
      from(table) {
        assert.equal(table, "inquiries");
        return query;
      },
    },
  };
  globalThis.fetch = async (url, options) => {
    assert.equal(
      url,
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    assert.equal(options.method, "POST");
    scenario.events.push("captcha");
    return new Response(JSON.stringify(scenario.verification), { status: 200 });
  };
});

after(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.__inquiryTest;
  hooks.deregister();
});

function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "김민지",
    email: "Minji@Example.com",
    type: "general",
    message: "제품 사용 방법을 문의합니다.",
    consent: "on",
    "cf-turnstile-response": "local-test-token",
    ...overrides,
  }))
    data.set(key, value);
  return data;
}
const initial = { ok: false, attempt: 0 };

test("허니팟은 확인과 저장 없이 성공으로 처리한다", async () => {
  const result = await submitInquiry(initial, form({ company_website: "bot" }));
  assert.equal(result.ok, true);
  assert.deepEqual(scenario.events, []);
});

test("보안 확인 후에만 검증과 저장을 진행한다", async () => {
  const result = await submitInquiry(initial, form());
  assert.equal(result.ok, true);
  assert.deepEqual(scenario.events, ["captcha", "lookup", "insert"]);
  assert.equal(scenario.saved.email, "minji@example.com");
  assert.equal(scenario.saved.type, "general");
  assert.ok(Date.parse(scenario.saved.consented_at));
});

test("중복 문의는 저장하지 않고 성공을 반환한다", async () => {
  scenario.rows = [{ id: "existing-inquiry" }];
  assert.equal((await submitInquiry(initial, form())).ok, true);
  assert.deepEqual(scenario.events, ["captcha", "lookup"]);
});

test("입력 오류는 보안 확인 후 반환하고 저장하지 않는다", async () => {
  const result = await submitInquiry(
    initial,
    form({ name: "", email: "invalid", message: " ", consent: "" }),
  );
  assert.equal(result.reason, "invalid");
  assert.deepEqual(Object.keys(result.fieldErrors).sort(), [
    "consent",
    "email",
    "message",
    "name",
  ]);
  assert.deepEqual(scenario.events, ["captcha"]);
});

test("실패·다른 화면·다른 도메인의 보안 토큰은 거부한다", async () => {
  for (const verification of [
    { success: false },
    { success: true, action: "other", hostname: "localhost" },
    { success: true, action: "contact", hostname: "other.example" },
  ]) {
    scenario.events = [];
    scenario.verification = verification;
    assert.equal((await submitInquiry(initial, form())).reason, "captcha");
    assert.deepEqual(scenario.events, ["captcha"]);
  }
});

test("누락되거나 과도하게 긴 토큰은 외부 호출 전에 거부한다", async () => {
  for (const token of ["", "a".repeat(2049)])
    assert.equal(
      (await submitInquiry(initial, form({ "cf-turnstile-response": token })))
        .reason,
      "captcha",
    );
  assert.deepEqual(scenario.events, []);
});

test("조회·저장·외부 확인 실패는 접수 완료로 표시하지 않는다", async () => {
  scenario.lookupError = { message: "조회 실패" };
  assert.equal((await submitInquiry(initial, form())).reason, "server");
  assert.deepEqual(scenario.events, ["captcha", "lookup"]);
  scenario.lookupError = null;
  scenario.insertError = { message: "저장 실패" };
  assert.equal((await submitInquiry(initial, form())).reason, "server");
  globalThis.fetch = async () => {
    throw new Error("네트워크 오류");
  };
  assert.equal((await submitInquiry(initial, form())).reason, "server");
});

test("서버 설정이 없으면 검증이나 저장 없이 실패한다", async () => {
  delete process.env["TURNSTILE_SECRET_KEY"];
  assert.equal((await submitInquiry(initial, form())).reason, "server");
  assert.deepEqual(scenario.events, []);
});

test("필수 값·길이·유형·동의를 클라이언트와 서버에서 같은 기준으로 검사한다", () => {
  const values = {
    name: "김".repeat(50),
    email: "a+b@example.com",
    type: "product",
    message: "가".repeat(2000),
    consent: true,
  };
  assert.deepEqual(validateInquiry(values), {});
  assert.ok(validateInquiry({ ...values, name: "김".repeat(51) }).name);
  assert.ok(validateInquiry({ ...values, email: "a".repeat(255) }).email);
  assert.ok(validateInquiry({ ...values, message: "가".repeat(2001) }).message);
  assert.ok(validateInquiry({ ...values, type: "unknown" }).type);
  assert.ok(validateInquiry({ ...values, consent: false }).consent);
});
