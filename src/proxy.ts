import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getAuthConfig } from "@/app/admin/_lib/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    const { url, key, cookieOptions } = getAuthConfig();
    const client = createServerClient(url, key, {
      cookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values, headers) {
          for (const { name, value } of values)
            request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of values)
            response.cookies.set(name, value, options);
          for (const [name, value] of Object.entries(headers))
            response.headers.set(name, value);
        },
      },
    });
    await client.auth.getClaims();
  } catch {
    // 갱신 실패도 페이지·Action의 서버 인증에서 다시 확인해 접근을 거부한다(#43).
  }

  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
