import type { ReactNode } from "react";

/**
 * 글자 + ↗ + 밑줄 묶음. TextLink 안에서 쓰고, 상자 전체가 이미 링크라 링크를 겹칠 수 없는 곳(뉴스룸 큰 기사)에서는 모양만 빌려 쓴다.
 *
 * 주의: 밑줄은 링크 상자가 아니라 이 묶음에 긋는다. 링크 상자는 44px 누르는 높이를 지켜야 해서,
 * 상자 바닥에 그으면 밑줄이 글자에서 14px가량 떨어진다(2026-11-15 FAQ 측정, #88).
 */
export default function TextLinkBody({ children }: { children: ReactNode }) {
  return (
    <span className="public-text-link-body">
      {children}
      <span aria-hidden="true">↗</span>
    </span>
  );
}
