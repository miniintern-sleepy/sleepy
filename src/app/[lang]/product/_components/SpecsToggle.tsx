"use client";

import { useState, type ReactNode } from "react";

/**
 * 휴대폰에서 전체 사양 표를 처음 다섯 줄 높이만 보여 주고 버튼으로 펼친다(#96).
 *
 * 이유: 11줄 표가 휴대폰에서 1100px를 넘어 제품 화면 끝이 늘어졌다(2026-11-16 운영 375px 캡처).
 * 주의: 접힘은 520px 이하 CSS에서만 걸린다. PC는 버튼이 숨겨지고 표가 그대로 다 보인다.
 *       내용은 접혀도 DOM에 남아 화면 읽기 프로그램은 전부 읽는다.
 */
export default function SpecsToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div id="product-specs-body" className="product-specs" data-open={open}>
        {children}
      </div>
      <button
        type="button"
        className="product-specs-more text-text-link"
        aria-controls="product-specs-body"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "사양 접기" : "전체 사양 보기"}
      </button>
    </>
  );
}
