import "server-only";

import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value)
    throw new Error(`환경 변수 ${name}가 없다. .env.example을 확인한다.`);
  return value;
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };

/**
 * 방문자 권한(anon 키)으로 읽는 클라이언트.
 *
 * RLS가 공개된 행만 돌려준다. 공개 화면의 읽기 함수(`src/lib/content.ts`)가 쓴다.
 */
export function createReadClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    options,
  );
}

/**
 * 서버 전용 키(service_role)로 RLS를 건너뛰는 클라이언트.
 *
 * 방문자에게 쓰기 권한을 주지 않으려고 문의 저장에만 쓴다(D-13). 관리 화면에는 쓰지 않는다.
 */
export function createServiceClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    options,
  );
}
