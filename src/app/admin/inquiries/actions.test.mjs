import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier.endsWith("/_lib/auth"))
      return {
        url: "data:text/javascript,export async function requireAdmin(){const s=globalThis.__replyTest;s.events.push('auth');return s.access??{ok:true,client:s.client}}",
        shortCircuit: true,
      };
    if (specifier === "next/cache")
      return {
        url: "data:text/javascript,export function refresh(){globalThis.__replyTest.events.push('refresh')}",
        shortCircuit: true,
      };
    if (specifier === "@/lib/mail/send")
      return {
        url: "data:text/javascript,export async function sendInquiryReply(inquiry,body,attempt){const s=globalThis.__replyTest;s.events.push('mail');s.mails.push({inquiry,body,attempt,saved:structuredClone(s.row)});s.onMail?.();if(s.mailThrows)throw Error('비공개 오류');return s.mailResult}",
        shortCircuit: true,
      };
    if (specifier === "@/lib/mail/template")
      return nextResolve(
        new URL("../../../lib/mail/template.ts", import.meta.url).href,
        context,
      );
    if (["./_lib/form", "./_lib/queries"].includes(specifier))
      return nextResolve(
        new URL(`${specifier}.ts`, context.parentURL).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});
const { replyToInquiry, resetInquiryReply } = await import("./actions.ts");
let scenario;
const id = "11111111-1111-4111-8111-111111111111";
beforeEach(() => {
  scenario = {
    events: [],
    writes: [],
    mails: [],
    mailResult: { ok: true, emailId: "email-id" },
    row: {
      id,
      name: "시험 이름",
      email: "customer@example.test",
      type: "general",
      message: "문의",
      status: "new",
      created_at: "2026-11-07T00:00:00Z",
      answered_at: null,
      reply_body: null,
      reply_status: null,
      reply_attempt: 0,
      reply_email_id: null,
    },
  };
  scenario.client = {
    from(table) {
      assert.equal(table, "inquiries");
      const filters = [];
      let values;
      let claim = false;
      const execute = async () => {
        if (!values) {
          scenario.events.push("read");
          return {
            data: scenario.missing ? null : structuredClone(scenario.row),
            error: scenario.readError,
          };
        }
        scenario.events.push("write:" + values.reply_status);
        scenario.writes.push({ values, filters, claim });
        if (values.reply_status === "sent" && scenario.finishError)
          return { data: null, error: { message: "비공개 DB 오류" } };
        if (values.reply_status === "sending" && scenario.claimError)
          return { data: null, error: { message: "선점 실패" } };
        if (values.reply_status === "failed" && scenario.failUpdateError)
          return { data: null, error: { message: "실패 기록 장애" } };
        const match =
          filters.every(([key, value]) => scenario.row[key] === value) &&
          (!claim || scenario.row.reply_status !== "sending");
        if (!match || scenario.missing) return { data: null, error: null };
        Object.assign(scenario.row, values);
        return { data: { id }, error: null };
      };
      return {
        select() {
          return this;
        },
        update(value) {
          values = value;
          return this;
        },
        eq(key, value) {
          filters.push([key, value]);
          return this;
        },
        or(value) {
          assert.equal(value, "reply_status.is.null,reply_status.neq.sending");
          claim = true;
          return this;
        },
        maybeSingle: execute,
        then(resolve, reject) {
          return execute().then(resolve, reject);
        },
      };
    },
  };
  globalThis.__replyTest = scenario;
});
after(() => {
  delete globalThis.__replyTest;
  hooks.deregister();
});
function form(values = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    id,
    attempt: "0",
    body: " 답변\r\n둘째 줄 ",
    ...values,
  }))
    data.set(key, value);
  return data;
}
const initial = { ok: false };

test("REP-001 발송·재시도·수동 해제는 입력보다 먼저 관리자 권한을 확인한다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    scenario.access = { ok: false, reason };
    for (const action of [replyToInquiry, resetInquiryReply]) {
      scenario.events = [];
      assert.deepEqual(
        await action(initial, {
          get() {
            throw Error("입력 접근 금지");
          },
        }),
        { ok: false, reason },
      );
      assert.deepEqual(scenario.events, ["auth"]);
    }
  }
});
test("REP-002 문의 ID·attempt·원문·메일 길이가 잘못되면 DB와 메일을 호출하지 않는다", async () => {
  for (const values of [
    { id: "invalid" },
    { attempt: "-1" },
    { attempt: "2147483647" },
    { body: " " },
    { body: "가".repeat(2001) },
    { body: "&".repeat(401) },
    { body: new File(["답변"], "reply.txt") },
  ]) {
    scenario.events = [];
    assert.equal(
      (await replyToInquiry(initial, form(values))).reason,
      "invalid",
    );
    assert.deepEqual(scenario.events, ["auth"]);
  }
});
test("REP-003 DB 수신자를 사용하고 답변을 정규화해 저장·선점한 뒤 발송한다", async () => {
  await replyToInquiry(initial, form({ email: "forged@example.test" }));
  assert.deepEqual(scenario.events, [
    "auth",
    "read",
    "write:sending",
    "mail",
    "write:sent",
    "refresh",
  ]);
  const mail = scenario.mails[0];
  assert.equal(mail.inquiry.email, "customer@example.test");
  assert.equal(mail.body, "답변\n둘째 줄");
  assert.equal(mail.saved.reply_status, "sending");
  assert.equal(mail.saved.reply_body, mail.body);
  assert.equal(mail.saved.reply_attempt, 1);
});
test("REP-004 동시 요청과 sending·오래된 attempt는 한 번만 선점한다", async () => {
  const results = await Promise.all([
    replyToInquiry(initial, form()),
    replyToInquiry(initial, form()),
  ]);
  assert.equal(results.filter((result) => result.ok).length, 1);
  assert.equal(scenario.mails.length, 1);
  assert.equal(results.find((result) => !result.ok).reason, "conflict");
  scenario.row.status = "new";
  scenario.row.reply_status = "sending";
  assert.equal(
    (await replyToInquiry(initial, form({ attempt: "1" }))).reason,
    "conflict",
  );
  scenario.row.reply_status = "failed";
  assert.equal((await replyToInquiry(initial, form())).reason, "conflict");
  assert.equal(scenario.mails.length, 1);
  assert.ok(
    scenario.writes.find((write) => write.values.reply_status === "sending")
      .claim,
  );
});
test("REP-005 발송 접수 성공은 답변 완료·시각·발송 ID를 같은 시도 조건으로 저장한다", async () => {
  assert.equal((await replyToInquiry(initial, form())).ok, true);
  assert.equal(scenario.row.status, "answered");
  assert.equal(scenario.row.reply_status, "sent");
  assert.equal(scenario.row.reply_email_id, "email-id");
  assert.ok(Math.abs(Date.now() - Date.parse(scenario.row.answered_at)) < 1000);
  assert.deepEqual(scenario.writes.at(-1).filters, [
    ["id", id],
    ["status", "new"],
    ["reply_status", "sending"],
    ["reply_attempt", 1],
  ]);
});
test("REP-006 오류와 결과 불확실은 실패로 합치고 답변 원문과 새 문의 상태를 보존한다", async () => {
  for (const reason of ["config", "invalid", "provider", "throw"]) {
    Object.assign(scenario.row, {
      status: "new",
      reply_status: null,
      reply_body: null,
      reply_attempt: 0,
    });
    scenario.mailResult = { ok: false, reason };
    scenario.mailThrows = reason === "throw";
    const result = await replyToInquiry(initial, form());
    assert.equal(result.reason, "mail");
    assert.equal(
      result.message,
      "Resend 대시보드에서 발송 여부를 확인한 뒤 다시 보내세요",
    );
    assert.equal(scenario.row.status, "new");
    assert.equal(scenario.row.reply_status, "failed");
    assert.equal(scenario.row.reply_body, "답변\n둘째 줄");
    assert.equal(scenario.row.reply_attempt, 1);
  }
  scenario.mailThrows = false;
  scenario.failUpdateError = true;
  Object.assign(scenario.row, {
    status: "new",
    reply_status: null,
    reply_body: null,
    reply_attempt: 0,
  });
  assert.equal((await replyToInquiry(initial, form())).reason, "mail");
  assert.equal(scenario.row.reply_status, "sending");
  scenario.failUpdateError = false;
  assert.equal(
    (
      await resetInquiryReply(
        initial,
        form({ attempt: "1", checkedDelivery: "on" }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.row.reply_status, "failed");
});
test("REP-007 같은 답변 재시도는 대시보드 확인 후 같은 attempt를 유지한다", async () => {
  Object.assign(scenario.row, {
    reply_status: "failed",
    reply_body: "답변\n둘째 줄",
    reply_attempt: 2,
  });
  assert.equal(
    (await replyToInquiry(initial, form({ attempt: "2" }))).reason,
    "invalid",
  );
  assert.equal(scenario.mails.length, 0);
  assert.equal(
    (
      await replyToInquiry(
        initial,
        form({ attempt: "2", checkedDelivery: "on" }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.mails[0].attempt, 2);
});
test("REP-008 수정한 답변 재시도는 attempt를 올려 새 발송 키를 사용한다", async () => {
  Object.assign(scenario.row, {
    reply_status: "failed",
    reply_body: "이전 답변",
    reply_attempt: 2,
  });
  await replyToInquiry(initial, form({ attempt: "2", checkedDelivery: "on" }));
  assert.equal(scenario.row.reply_attempt, 3);
  assert.equal(scenario.mails[0].attempt, 3);
});
test("REP-009 발송 성공 후 DB 실패도 같은 attempt로 재시도하고 이전 시도가 새 결과를 덮지 않는다", async () => {
  scenario.finishError = true;
  assert.equal((await replyToInquiry(initial, form())).reason, "mail");
  assert.equal(scenario.row.reply_status, "failed");
  assert.equal(scenario.row.status, "new");
  scenario.finishError = false;
  await replyToInquiry(initial, form({ attempt: "1", checkedDelivery: "on" }));
  assert.deepEqual(
    scenario.mails.map((mail) => mail.attempt),
    [1, 1],
  );
  assert.equal(scenario.row.status, "answered");
  assert.ok(
    scenario.writes.every(
      (write) =>
        write.values.reply_status === "sending" ||
        write.filters.some(([key]) => key === "reply_attempt"),
    ),
  );
  Object.assign(scenario.row, {
    status: "new",
    reply_status: null,
    reply_body: null,
    reply_attempt: 0,
    answered_at: null,
    reply_email_id: null,
  });
  scenario.onMail = () =>
    Object.assign(scenario.row, {
      reply_attempt: 2,
      reply_body: "새 시도의 답변",
      reply_status: "sending",
    });
  assert.equal((await replyToInquiry(initial, form())).reason, "mail");
  assert.equal(scenario.row.reply_attempt, 2);
  assert.equal(scenario.row.reply_body, "새 시도의 답변");
  assert.equal(scenario.row.reply_status, "sending");
  assert.equal(scenario.row.status, "new");
});
test("REP-010 답변 완료·없는 문의·조회나 선점 오류에는 메일을 보내지 않는다", async () => {
  scenario.row.status = "answered";
  assert.equal((await replyToInquiry(initial, form())).reason, "answered");
  scenario.row.status = "new";
  scenario.missing = true;
  assert.equal((await replyToInquiry(initial, form())).reason, "notFound");
  scenario.missing = false;
  scenario.readError = { message: "조회 실패" };
  assert.equal((await replyToInquiry(initial, form())).reason, "server");
  scenario.readError = null;
  scenario.claimError = true;
  assert.equal((await replyToInquiry(initial, form())).reason, "server");
  assert.equal(scenario.mails.length, 0);
});
test("REP-011 수동 해제는 확인한 새 문의의 sending만 실패로 바꾸며 발송·attempt 변경을 하지 않는다", async () => {
  Object.assign(scenario.row, {
    reply_status: "sending",
    reply_body: "보존할 답변",
    reply_attempt: 1,
  });
  assert.equal(
    (await resetInquiryReply(initial, form({ attempt: "1" }))).reason,
    "invalid",
  );
  assert.equal(
    (
      await resetInquiryReply(
        initial,
        form({ attempt: "0", checkedDelivery: "on" }),
      )
    ).reason,
    "conflict",
  );
  assert.equal(
    (
      await resetInquiryReply(
        initial,
        form({ attempt: "1", checkedDelivery: "on" }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.row.reply_status, "failed");
  assert.equal(scenario.row.reply_attempt, 1);
  assert.equal(scenario.row.reply_body, "보존할 답변");
  assert.equal(scenario.mails.length, 0);
  assert.equal(
    (
      await resetInquiryReply(
        initial,
        form({ attempt: "1", checkedDelivery: "on" }),
      )
    ).reason,
    "conflict",
  );
  Object.assign(scenario.row, { status: "answered", reply_status: "sending" });
  assert.equal(
    (
      await resetInquiryReply(
        initial,
        form({ attempt: "1", checkedDelivery: "on" }),
      )
    ).reason,
    "conflict",
  );
});
