import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getAuthConfig } from "./config";

/** 로그인한 사용자의 세션으로 RLS를 적용받는 관리자용 클라이언트를 만든다. */
export async function createAdminClient() {
  const { url, key, cookieOptions } = getAuthConfig();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          for (const { name, value, options } of values)
            cookieStore.set(name, value, options);
        } catch {
          // 서버 컴포넌트는 쿠키를 쓸 수 없어 갱신은 Proxy가 맡는다(#43, Supabase SSR 안내).
        }
      },
    },
  });
}
