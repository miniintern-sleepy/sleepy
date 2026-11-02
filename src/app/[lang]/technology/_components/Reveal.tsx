"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** 화면에 처음 들어올 때 한 번만 살짝 떠오르며 나타난다. 동작 줄이기 설정에서는 움직이지 않는다. */
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
    if (!element) return;

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
      className={`group transition duration-700 ease-out motion-safe:translate-y-4 motion-safe:opacity-0 motion-safe:data-[visible=true]:translate-y-0 motion-safe:data-[visible=true]:opacity-100 print:translate-y-0 print:opacity-100 ${className}`}
    >
      {children}
    </div>
  );
}
