import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// 토큰이 없으면(로컬·Preview) 아무것도 보내지 않아 테스트 방문이 지표에 섞이지 않는다(#71).
if (token) {
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // 쿠키·저장소 없이 방문자를 서버에서 구분한다. PostHog 설정의 "Enable cookieless tracking"도 켜져 있어야 한다(D-36).
    cookieless_mode: "always",
    // 화면 이동마다 조회를 기록한다. 직접 보내는 이벤트는 src/lib/analytics.ts에서만 정한다.
    capture_pageview: "history_change",
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    // 기능 플래그는 쓰지 않아서 화면마다 보내는 불필요한 요청을 끈다.
    advanced_disable_flags: true,
    // 공개 화면과 관리자 화면의 루트 레이아웃이 따로라 이 파일은 /admin에서도 실행된다. 관리자 방문은 지표에서 뺀다.
    before_send: (event) =>
      window.location.pathname.startsWith("/admin") ? null : event,
  });
}
