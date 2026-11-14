"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductCopy } from "./types";

export default function ProductGallery({
  photos,
}: {
  photos: ProductCopy["features"]["photos"];
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    const observer = new IntersectionObserver(
      (entries) => {
        // PC의 미리보기 선택을 늦게 도착한 관찰 응답이 되돌리지 않게 한다(#79).
        if (!mobile.matches) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6)
            setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    const observeMobile = () => {
      observer.disconnect();
      if (mobile.matches) {
        for (const slide of track.children) observer.observe(slide);
      }
    };
    observeMobile();
    mobile.addEventListener("change", observeMobile);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", observeMobile);
    };
  }, []);

  return (
    <div className="product-gallery-viewer">
      <div
        ref={trackRef}
        className="product-gallery-track"
        tabIndex={0}
        role="group"
        aria-label="제품 사진, 좌우로 넘겨 볼 수 있습니다"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className="product-gallery-slide"
            data-index={index}
            data-active={active === index}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width:767px) 100vw, 720px"
            />
          </div>
        ))}
      </div>
      <div className="product-gallery-thumbnails" aria-label="제품 사진 선택">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`사진 ${index + 1} 보기: ${photo.alt}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <Image src={photo.src} alt="" fill sizes="120px" />
          </button>
        ))}
      </div>
      <div className="product-gallery-dots" aria-hidden="true">
        {photos.map((photo, index) => (
          <span key={photo.src} data-active={active === index} />
        ))}
      </div>
    </div>
  );
}
