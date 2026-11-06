import "server-only";

/** 관리자 세션에 필요한 공개 키와 서버 전용 쿠키 설정을 가져온다. */
export function getAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase 인증 환경 변수가 없습니다.");

  return {
    url,
    key,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}
