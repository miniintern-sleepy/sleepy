"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 제품 화면 아래쪽 사진 묶음(쓰임새 4장, 사용법 3단계)을 휴대폰에서 갤러리와 같은 사진 띠로 보여 준다(#96).
 *
 * 이유: 히어로 아래 갤러리는 진행 선이 있는데 아래 사진 묶음은 없어, 같은 화면 안에서 넘기는 모양이 달랐다(2026-11-17 PL 요청).
 * 구성: 갤러리(`ProductGallery`)와 같은 진행 선 계산과 같은 클래스(`product-gallery-progress`)를 쓴다.
 * 주의: 띠·진행 선은 520px 이하 CSS에서만 보인다. PC는 기존 3칸 격자 그대로이고 진행 선은 숨긴다.
 *       갤러리 코드는 테스트가 react를 대체해 검사하므로 이 컴포넌트와 합치지 않았다.
 */
export default function ProductPhotoStrip({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ visible: 1, progress: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      const left = Math.max(0, Math.min(max, track.scrollLeft));
      setPosition({
        visible: track.scrollWidth
          ? Math.min(1, track.clientWidth / track.scrollWidth)
          : 1,
        progress: max ? left / max : 0,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div
        ref={trackRef}
        className={`${className} mobile-swipe`}
        role="group"
        aria-label={label}
      >
        {children}
      </div>
      <div
        className="product-strip-progress product-gallery-progress"
        aria-hidden="true"
      >
        <span
          style={{
            width: `${position.visible * 100}%`,
            left: `${position.progress * (1 - position.visible) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
