"use client";

import { useEffect } from "react";

/**
 * 아래로 스크롤하면 머리말을 숨기고, 위로 스크롤하면 다시 보인다(#96, PL 요청 2026-11-17).
 *
 * 머리말 마크업은 그대로 두고 <html data-header-hidden>만 바꾼다. 실제 숨김은 layout.css가 맡는다.
 * 주의: 맨 위 근처(머리말 높이 안)와 휴대폰 메뉴 판이 열린 동안에는 숨기지 않는다.
 *       판은 머리말 안에 있어서 머리말과 함께 화면 밖으로 밀려난다.
 */
export default function HeaderAutoHide() {
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const header = document.querySelector<HTMLElement>(".site-header");
      const menuOpen = Boolean(
        document.querySelector('.site-navigation[data-open="true"]'),
      );
      // 작은 흔들림(관성 스크롤 끝 등)은 무시한다.
      if (Math.abs(y - last) < 6) return;
      const hide = y > last && y > (header?.offsetHeight ?? 0) && !menuOpen;
      root.dataset.headerHidden = String(hide);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.headerHidden;
    };
  }, []);
  return null;
}
