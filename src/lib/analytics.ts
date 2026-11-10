import posthog from "posthog-js";

/** 직접 보내는 방문 지표 이벤트. 화면 조회($pageview)는 instrumentation-client.ts가 자동으로 보낸다. */
export type AnalyticsEvent = "purchase_click" | "inquiry_submit" | "faq_open";

/**
 * 이벤트를 PostHog로 보낸다. 서버이거나 PostHog가 시작되지 않았으면(토큰 없음) 아무것도 하지 않는다.
 * 이름·이메일·문의 내용 같은 개인정보는 속성에 넣지 않는다.
 */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(event, properties);
}
