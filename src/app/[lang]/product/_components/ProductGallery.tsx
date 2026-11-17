"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { UiCopy } from "@/content/ko/ui";
import type { ProductCopy } from "./types";

export default function ProductGallery({
  photos,
  ui,
}: {
  photos: ProductCopy["features"]["photos"];
  ui: UiCopy["product"];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    start: true,
    end: false,
    visible: 0,
    progress: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      const left = Math.max(0, Math.min(max, track.scrollLeft));
      setPosition({
        start: left <= 1,
        end: left >= max - 1,
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

  function move(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    const inset =
      Number.parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    const bounds = track.getBoundingClientRect();
    // 공개 화면의 zoom 적용 좌표를 스크롤용 CSS 좌표로 되돌린다(D-49).
    const scale = bounds.width / track.clientWidth || 1;
    const starts = Array.from(
      track.children,
      (slide) =>
        (slide.getBoundingClientRect().left - bounds.left) / scale +
        track.scrollLeft -
        inset,
    );
    const target =
      direction > 0
        ? starts.find((left) => left > track.scrollLeft + 1)
        : starts.findLast((left) => left < track.scrollLeft - 1);
    if (target !== undefined) track.scrollTo({ left: target });
  }

  // 끝에 닿은 버튼은 disabled 대신 aria-disabled로 알린다.
  // 이유: disabled로 바꾸면 그 버튼을 누르던 키보드 초점이 BODY로 빠진다(2026-11-15 확인, PR #80).
  return (
    <div className="product-gallery-viewer">
      <div
        ref={trackRef}
        className="product-gallery-track"
        tabIndex={0}
        role="group"
        aria-label={ui.galleryLabel}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className="product-gallery-slide"
            data-landscape={index >= 2}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="eager"
              sizes={
                index < 2
                  ? "(max-width:767px) 260px, (max-width:833px) 300px, (max-width:1439px) 36vw, 520px"
                  : "(max-width:767px) 390px, (max-width:833px) 450px, (max-width:1439px) 54vw, 780px"
              }
            />
          </div>
        ))}
      </div>
      <div className="product-gallery-controls public-wrap">
        <div className="product-gallery-progress" aria-hidden="true">
          <span
            style={{
              width: `${position.visible * 100}%`,
              left: `${position.progress * (1 - position.visible) * 100}%`,
            }}
          />
        </div>
        <div className="product-gallery-arrows">
          <button
            type="button"
            aria-label={ui.previousPhoto}
            aria-disabled={position.start}
            onClick={() => {
              if (!position.start) move(-1);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={ui.nextPhoto}
            aria-disabled={position.end}
            onClick={() => {
              if (!position.end) move(1);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
