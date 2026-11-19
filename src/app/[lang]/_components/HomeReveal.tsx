"use client";

import { useEffect } from "react";

import "@/components/ui/Reveal.css";

/**
 * 메인 구간 안쪽(data-reveal)을 화면에 처음 들어올 때 한 번 떠오르게 한다(#98, PL 요청 2026-11-18).
 *
 * 이유: Reveal로 감싸면 div가 하나 더 생겨 `.home-product-grid > div` 같은 자식 선택자가 깨진다.
 * 그래서 기존 요소에 속성만 달고, 관찰은 이 한 곳에서 한다.
 * 주의: 소식 구간은 Suspense로 늦게 들어오므로 main의 변화를 보고 새 요소도 관찰한다.
 */
export default function HomeReveal() {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute("data-visible", "true");
    const pending = () =>
      document.querySelectorAll(
        'main [data-reveal]:not([data-visible="true"])',
      );
    if (!("IntersectionObserver" in window)) {
      pending().forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    const watch = () => pending().forEach((el) => io.observe(el));
    watch();
    const main = document.querySelector("main");
    const mo = new MutationObserver(watch);
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
