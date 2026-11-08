import "server-only";

import { cache } from "react";
import { connection } from "next/server";

import { createAdminClient } from "./supabase";

type AdminClient = Awaited<ReturnType<typeof createAdminClient>>;
type AdminAccess =
  | { ok: true; client: AdminClient; user: { id: string; email?: string } }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "server" };

/**
 * Auth 서버의 계정과 admins 등록 여부를 확인한다. 관리 Action은 데이터 접근 전에 호출한다.
 *
 * 렌더 요청 안에서 중복 확인을 묶는다. 로그인 직후의 명시적 클라이언트는 매번 검증한다.
 * @returns 허용 시 같은 사용자 권한의 클라이언트. 실패 시 데이터에 접근하지 않는다.
 */
export function requireAdmin(
  existingClient?: AdminClient,
): Promise<AdminAccess> {
  return existingClient ? checkAdmin(existingClient) : requestAdmin();
}

const requestAdmin = cache(() => checkAdmin());

async function checkAdmin(existingClient?: AdminClient): Promise<AdminAccess> {
  // Auth SDK는 토큰 만료 확인에 현재 시각을 쓰므로 실제 요청에서만 실행한다(#44).
  await connection();
  try {
    const client = existingClient ?? (await createAdminClient());
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error) {
      const unauthenticated =
        error.name === "AuthSessionMissingError" ||
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403;
      return {
        ok: false,
        reason: unauthenticated ? "unauthenticated" : "server",
      };
    }
    if (!user) return { ok: false, reason: "unauthenticated" };

    const { data: isAdmin, error: adminError } = await client.rpc("is_admin");
    if (adminError) return { ok: false, reason: "server" };
    if (isAdmin !== true) return { ok: false, reason: "forbidden" };

    return { ok: true, client, user: { id: user.id, email: user.email } };
  } catch {
    return { ok: false, reason: "server" };
  }
}
