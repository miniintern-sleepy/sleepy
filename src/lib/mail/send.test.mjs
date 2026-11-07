import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "resend")
      return {
        url: "data:text/javascript,export class Resend{constructor(key){globalThis.__mailTest.key=key;this.emails={send:async(payload,options)=>{const s=globalThis.__mailTest;s.calls.push({payload,options});if(s.throws)throw Error('비공개 오류');return s.result}}}}",
        shortCircuit: true,
      };
    if (["./config", "./template"].includes(specifier))
      return nextResolve(
        new URL(`${specifier}.ts`, context.parentURL).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});
const { sendInquiryNotification, sendInquiryReply } = await import("./send.ts");
const { readMailConfig, siteOrigin } = await import("./config.ts");
const inquiry = {
  id: "11111111-1111-4111-8111-111111111111",
  name: '<이름 & "따옴표">',
  email: "customer@example.test",
  type: "product",
  message: "첫 줄 & <문의>\n둘째 줄 '확인'",
  created_at: "2026-11-06T16:05:00Z",
};
let scenario;
beforeEach(() => {
  Object.assign(process.env, {
    MAIL_API_KEY: "local-test-value",
    MAIL_FROM: "sender@example.test",
    MAIL_REPLY_TO: "reply@example.test",
    MAIL_NOTIFY_TO: "staff@example.test",
    MAIL_NOTIFY_TEMPLATE_ID: "notify-template",
    MAIL_REPLY_TEMPLATE_ID: "reply-template",
    MAIL_SITE_URL: "https://example.test",
  });
  scenario = { calls: [], result: { data: { id: "email-id" }, error: null } };
  globalThis.__mailTest = scenario;
});
after(() => {
  delete globalThis.__mailTest;
  hooks.deregister();
});

test("MAIL-001 필요한 메일 설정이 없거나 잘못되면 값 노출과 SDK 호출 없이 실패한다", async () => {
  for (const key of [
    "MAIL_API_KEY",
    "MAIL_FROM",
    "MAIL_REPLY_TO",
    "MAIL_NOTIFY_TO",
    "MAIL_NOTIFY_TEMPLATE_ID",
    "MAIL_SITE_URL",
  ]) {
    const saved = process.env[key];
    delete process.env[key];
    assert.deepEqual(await sendInquiryNotification(inquiry), {
      ok: false,
      reason: "config",
    });
    process.env[key] = saved;
  }
  delete process.env.MAIL_REPLY_TEMPLATE_ID;
  assert.deepEqual(await sendInquiryReply(inquiry, "답변", 1), {
    ok: false,
    reason: "config",
  });
  assert.deepEqual(scenario.calls, []);
});
test("MAIL-002 두 템플릿에 지정된 변수만 전달하고 이름·유형·한국 시간·Reply-To를 맞춘다", async () => {
  await sendInquiryNotification(inquiry);
  await sendInquiryReply(inquiry, "답변 <&>\n두 줄", 1);
  const [notify, reply] = scenario.calls.map((call) => call.payload);
  assert.equal(notify.from, "sender@example.test");
  assert.equal(notify.to, "staff@example.test");
  assert.equal(reply.to, inquiry.email);
  for (const payload of [notify, reply]) {
    assert.equal(payload.replyTo, "reply@example.test");
    assert.equal(
      payload.template.variables.CUSTOMER_NAME,
      "&lt;이름 &amp; &quot;따옴표&quot;&gt;",
    );
    assert.equal(
      payload.template.variables.INQUIRY_PREVIEW_HTML,
      "첫 줄 &amp; &lt;문의&gt;<br>둘째 줄 &#39;확인&#39;",
    );
    assert.equal(payload.html, undefined);
    assert.equal(payload.text, undefined);
    assert.equal(payload.react, undefined);
  }
  assert.deepEqual(Object.keys(notify.template.variables).sort(), [
    "ADMIN_URL",
    "CUSTOMER_NAME",
    "INQUIRY_PREVIEW_HTML",
    "INQUIRY_TYPE",
    "RECEIVED_AT",
  ]);
  assert.equal(notify.template.id, "notify-template");
  assert.equal(notify.template.variables.INQUIRY_TYPE, "제품");
  assert.equal(
    notify.template.variables.RECEIVED_AT,
    "2026. 11. 07. 01:05 (한국 시간)",
  );
  assert.equal(
    notify.template.variables.ADMIN_URL,
    `https://example.test/admin/inquiries/${inquiry.id}`,
  );
  assert.equal(reply.template.id, "reply-template");
  assert.deepEqual(Object.keys(reply.template.variables).sort(), [
    "CUSTOMER_NAME",
    "INQUIRY_PREVIEW_HTML",
    "REPLY_HTML",
  ]);
  assert.equal(
    reply.template.variables.REPLY_HTML,
    "답변 &lt;&amp;&gt;<br>두 줄",
  );
  await sendInquiryNotification({ ...inquiry, type: "general" });
  assert.equal(
    scenario.calls[2].payload.template.variables.INQUIRY_TYPE,
    "일반",
  );
});
test("MAIL-005 헤더 줄바꿈과 복수 주소는 거부하고 제목에는 사용자 입력을 넣지 않는다", async () => {
  for (const key of ["MAIL_FROM", "MAIL_REPLY_TO", "MAIL_NOTIFY_TO"]) {
    const saved = process.env[key];
    for (const bad of [
      "a@example.test\r\nBcc:x@example.test",
      "a@example.test,b@example.test",
      "이름 <a@example.test>",
    ]) {
      process.env[key] = bad;
      assert.equal(readMailConfig("notify"), null);
    }
    process.env[key] = saved;
  }
  assert.equal(
    (
      await sendInquiryReply(
        { ...inquiry, email: "a@example.test\nBcc:x@example.test" },
        "답변",
        1,
      )
    ).reason,
    "invalid",
  );
  await sendInquiryNotification({ ...inquiry, name: "이름\r\nBcc: 다른 값" });
  assert.equal(
    scenario.calls[0].payload.subject,
    "슬리피에 새 문의가 접수되었습니다",
  );
});
test("MAIL-006 SDK 오류·빈 결과·예외는 상세 정보 없이 같은 발송 실패로 처리한다", async () => {
  for (const result of [
    { data: null, error: { name: "validation_error", message: "비공개 값" } },
    { data: null, error: null },
    { data: {}, error: null },
  ]) {
    scenario.result = result;
    assert.deepEqual(await sendInquiryReply(inquiry, "답변", 1), {
      ok: false,
      reason: "provider",
    });
  }
  scenario.throws = true;
  assert.deepEqual(await sendInquiryNotification(inquiry), {
    ok: false,
    reason: "provider",
  });
});
test("MAIL-007 알림 키와 문의ID-attempt 답변 키는 같은 시도에서 유지하고 새 시도에서 바뀐다", async () => {
  await sendInquiryNotification(inquiry);
  await sendInquiryReply(inquiry, "답변", 1);
  await sendInquiryReply(inquiry, "답변", 1);
  await sendInquiryReply(inquiry, "수정", 2);
  assert.deepEqual(
    scenario.calls.map((call) => call.options.idempotencyKey),
    [
      `inquiry-notify-${inquiry.id}`,
      `${inquiry.id}-1`,
      `${inquiry.id}-1`,
      `${inquiry.id}-2`,
    ],
  );
});
test("MAIL-008 관리자 링크 원점은 HTTPS 또는 로컬 HTTP만 허용하고 경로·인증정보를 거부한다", () => {
  assert.equal(siteOrigin("https://example.test/"), "https://example.test");
  assert.equal(siteOrigin("http://localhost:3045"), "http://localhost:3045");
  for (const value of [
    "http://example.test",
    "javascript:alert(1)",
    "https://example.test/path",
    "https://example.test/?x=1",
    "https://example.test/#hash",
    "invalid",
  ])
    assert.equal(siteOrigin(value), null);
  const authenticated = new URL("https://example.test");
  authenticated.username = "가상 사용자";
  assert.equal(siteOrigin(authenticated.href), null);
});
