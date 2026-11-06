import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/server")
      return {
        url: "data:text/javascript,export async function connection(){}",
        shortCircuit: true,
      };
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "./supabase" || specifier === "./_lib/supabase")
      return {
        url: "data:text/javascript,export async function createAdminClient(){return globalThis.__adminAuthTest.client}",
        shortCircuit: true,
      };
    if (specifier === "next/navigation")
      return {
        url: "data:text/javascript,export function redirect(url){throw new Error('REDIRECT:'+url)}",
        shortCircuit: true,
      };
    if (specifier === "./_lib/auth")
      return nextResolve(
        new URL("./_lib/auth.ts", context.parentURL).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});

const { requireAdmin } = await import("./_lib/auth.ts");
const { login, logout } = await import("./actions.ts");
let scenario;

beforeEach(() => {
  scenario = {
    events: [],
    user: { id: "synthetic-user", email: "admin@example.test" },
    userError: null,
    isAdmin: true,
    adminError: null,
    loginError: null,
    logoutError: null,
  };
  globalThis.__adminAuthTest = {
    client: {
      auth: {
        async getUser() {
          scenario.events.push("user");
          return { data: { user: scenario.user }, error: scenario.userError };
        },
        async signInWithPassword() {
          scenario.events.push("login");
          return { error: scenario.loginError };
        },
        async signOut(options) {
          assert.deepEqual(options, { scope: "local" });
          scenario.events.push("logout");
          return { error: scenario.logoutError };
        },
      },
      async rpc(name) {
        assert.equal(name, "is_admin");
        scenario.events.push("admin");
        return { data: scenario.isAdmin, error: scenario.adminError };
      },
    },
  };
});

after(() => {
  delete globalThis.__adminAuthTest;
  hooks.deregister();
});

function credentials() {
  const form = new FormData();
  form.set("email", "admin@example.test");
  form.set("password", "테스트용 가상 입력값");
  return form;
}

test("비로그인·만료된 인증은 관리자 조회 전에 거부한다", async () => {
  scenario.user = null;
  assert.deepEqual(await requireAdmin(), {
    ok: false,
    reason: "unauthenticated",
  });
  assert.deepEqual(scenario.events, ["user"]);
  scenario.userError = { name: "AuthApiError", status: 401 };
  assert.equal((await requireAdmin()).reason, "unauthenticated");
  assert.deepEqual(scenario.events, ["user", "user"]);
});

test("로그인했어도 is_admin이 true인 계정만 허용한다", async () => {
  for (const value of [false, null, "true"]) {
    scenario.isAdmin = value;
    assert.deepEqual(await requireAdmin(), { ok: false, reason: "forbidden" });
  }
  scenario.isAdmin = true;
  const access = await requireAdmin();
  assert.equal(access.ok, true);
  assert.equal(access.client, globalThis.__adminAuthTest.client);
  assert.deepEqual(access.user, scenario.user);
});

test("Auth·RPC 장애는 관리자 접근을 허용하지 않는다", async () => {
  scenario.userError = { name: "AuthRetryableFetchError", status: 503 };
  assert.equal((await requireAdmin()).reason, "server");
  assert.deepEqual(scenario.events, ["user"]);
  scenario.userError = null;
  scenario.adminError = { message: "가상 RPC 오류" };
  assert.equal((await requireAdmin()).reason, "server");
});

test("관리자 등록이 제거되면 다음 호출부터 거부한다", async () => {
  assert.equal((await requireAdmin()).ok, true);
  scenario.isAdmin = false;
  assert.equal((await requireAdmin()).reason, "forbidden");
  assert.deepEqual(scenario.events, ["user", "admin", "user", "admin"]);
});

test("없는 계정과 틀린 비밀번호는 같은 결과로 반환하고 상세 오류를 노출하지 않는다", async () => {
  for (const message of [
    "없는 계정에 대한 가상 오류",
    "틀린 비밀번호에 대한 가상 오류",
  ]) {
    scenario.loginError = { message };
    assert.deepEqual(await login({ ok: false }, credentials()), {
      ok: false,
      reason: "credentials",
    });
  }
  assert.deepEqual(scenario.events, ["login", "login"]);
});

test("비관리자 로그인은 세션을 정리하고 거부한다", async () => {
  scenario.isAdmin = false;
  assert.deepEqual(await login({ ok: false }, credentials()), {
    ok: false,
    reason: "forbidden",
  });
  assert.deepEqual(scenario.events, ["login", "user", "admin", "logout"]);
});

test("로그인 후 관리자 조회 실패도 세션을 정리하고 실패로 반환한다", async () => {
  scenario.adminError = { message: "가상 RPC 오류" };
  assert.equal((await login({ ok: false }, credentials())).reason, "server");
  assert.deepEqual(scenario.events, ["login", "user", "admin", "logout"]);
});

test("관리자 확인을 마친 로그인만 /admin으로 이동한다", async () => {
  await assert.rejects(login({ ok: false }, credentials()), /REDIRECT:\/admin/);
  assert.deepEqual(scenario.events, ["login", "user", "admin"]);
});

test("비어 있거나 파일인 입력은 Auth 호출 없이 거부한다", async () => {
  const form = credentials();
  form.set("password", "");
  assert.equal((await login({ ok: false }, form)).reason, "credentials");
  form.set("password", new File(["가상 입력"], "input.txt"));
  assert.equal((await login({ ok: false }, form)).reason, "credentials");
  assert.deepEqual(scenario.events, []);
});

test("로그아웃은 관리자 권한 없이 가능하고 실패를 성공으로 표시하지 않는다", async () => {
  await assert.rejects(logout({ ok: false }), /REDIRECT:\/admin/);
  assert.deepEqual(scenario.events, ["logout"]);
  scenario.logoutError = { message: "가상 로그아웃 오류" };
  assert.deepEqual(await logout({ ok: false }), {
    ok: false,
    reason: "server",
  });
});
