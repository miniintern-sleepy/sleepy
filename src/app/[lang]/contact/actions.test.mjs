import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/mail/send")
      return {
        url: "data:text/javascript,export async function sendInquiryNotification(value){const s=globalThis.__inquiryTest;s.scenario.notifications.push(value);if(s.scenario.mailThrows)throw Error('비공개 오류');return s.scenario.mailResult}",
        shortCircuit: true,
      };
    if (specifier === "next/server")
      return {
        url: "data:text/javascript,export function after(callback){const s=globalThis.__inquiryTest.scenario;if(s.scheduleThrows)throw Error('등록 실패');s.callbacks.push(callback)}",
        shortCircuit: true,
      };
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
    callbacks: [],
    notifications: [],
    logs: [],
    mailResult: { ok: true, emailId: "notification-id" },
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
    insert(value) {
      scenario.events.push("insert");
      scenario.saved = value;
      return this;
    },
    async single() {
      return {
        data: {
          id: "11111111-1111-4111-8111-111111111111",
          created_at: "2026-11-07T00:00:00.000Z",
        },
        error: scenario.insertError,
      };
    },
  };
  globalThis.__inquiryTest = {
    scenario,
    client: {
      from(table) {
        assert.equal(table, "inquiries");
        return query;
      },
    },
  };
  console.error = (...values) => scenario.logs.push(values);
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
  console.error = originalConsoleError;
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

test("INQ-010 새 문의 저장 성공 뒤에만 응답 후 알림을 등록한다", async () => {
  assert.equal((await submitInquiry(initial, form())).ok, true);
  assert.equal(scenario.callbacks.length, 1);
  assert.deepEqual(scenario.notifications, []);
  await scenario.callbacks[0]();
  assert.deepEqual(scenario.notifications, [
    {
      id: "11111111-1111-4111-8111-111111111111",
      created_at: "2026-11-07T00:00:00.000Z",
      name: "김민지",
      type: "general",
      message: "제품 사용 방법을 문의합니다.",
    },
  ]);
});
test("INQ-011 허니팟·보안·입력·중복·저장 실패에는 알림을 등록하지 않는다", async () => {
  await submitInquiry(initial, form({ company_website: "bot" }));
  await submitInquiry(initial, form({ "cf-turnstile-response": "" }));
  scenario.verification.success = false;
  await submitInquiry(initial, form());
  scenario.verification.success = true;
  await submitInquiry(initial, form({ name: "" }));
  scenario.rows = [{ id: "duplicate" }];
  await submitInquiry(initial, form());
  scenario.rows = [];
  scenario.insertError = { message: "비공개 저장 오류" };
  await submitInquiry(initial, form());
  assert.deepEqual(scenario.callbacks, []);
});
test("INQ-012 알림 실패와 예외는 접수 성공을 바꾸거나 개인정보를 로그에 남기지 않는다", async () => {
  const result = await submitInquiry(initial, form());
  scenario.mailResult = { ok: false, reason: "provider" };
  await scenario.callbacks[0]();
  scenario.mailThrows = true;
  await scenario.callbacks[0]();
  assert.equal(result.ok, true);
  assert.deepEqual(
    scenario.logs.map((row) => row[2]),
    ["provider", "unexpected"],
  );
  assert.ok(!JSON.stringify(scenario.logs).includes("김민지"));
  assert.ok(!JSON.stringify(scenario.logs).includes("비공개"));
});
test("INQ-013 응답 후 작업 등록 실패도 이미 저장된 문의는 성공으로 반환한다", async () => {
  scenario.scheduleThrows = true;
  assert.equal((await submitInquiry(initial, form())).ok, true);
  assert.equal(scenario.logs[0][2], "schedule");
});
test("INQ-014 메일 설정 누락은 문의 저장 성공과 분리한다", async () => {
  scenario.mailResult = { ok: false, reason: "config" };
  const result = await submitInquiry(initial, form());
  await scenario.callbacks[0]();
  assert.equal(result.ok, true);
  assert.equal(scenario.logs[0][2], "config");
});
