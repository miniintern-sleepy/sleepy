"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "./_lib/auth";
import { createAdminClient } from "./_lib/supabase";

export type AuthActionState = {
  ok: false;
  reason?: "credentials" | "forbidden" | "server";
};

/** 이메일·비밀번호로 로그인하고 admins에 등록된 계정만 관리 화면으로 보낸다. */
export async function login(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawEmail = formData.get("email");
  const password = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== "string" ||
    !password ||
    password.length > 4096
  )
    return { ok: false, reason: "credentials" };

  try {
    const client = await createAdminClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, reason: "credentials" };

    const access = await requireAdmin(client);
    if (!access.ok) {
      const { error: signOutError } = await client.auth.signOut({
        scope: "local",
      });
      if (signOutError) return { ok: false, reason: "server" };
      return {
        ok: false,
        reason: access.reason === "forbidden" ? "forbidden" : "server",
      };
    }
  } catch {
    return { ok: false, reason: "server" };
  }

  redirect("/admin");
}

/** 권한이 없거나 만료된 계정도 현재 브라우저의 세션을 종료할 수 있게 한다. */
export async function logout(
  _previous: AuthActionState,
): Promise<AuthActionState> {
  try {
    const client = await createAdminClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "server" };
  }

  redirect("/admin");
}
