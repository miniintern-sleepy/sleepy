"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import "./Reveal.css";

/** 내용은 기본으로 보이며, 화면에 처음 들어올 때만 살짝 떠오른다. */
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-visible={isVisible}
      className={`group ${className}`}
    >
      {children}
    </div>
  );
}
