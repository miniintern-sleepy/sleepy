"use client";

import { useState } from "react";

/**
 * 앞면에 제목, 뒷면에 설명이 있는 카드. 마우스를 올리면 뒤집히고, 누르거나 키보드로 눌러도 뒤집힌다.
 *
 * @param index 카드 번호(0부터). 앞면에 01, 02처럼 보인다.
 * @param hint 앞면 아래의 안내 문구
 */
export default function FlipCard({
  index,
  title,
  description,
  hint,
}: {
  index: number;
  title: string;
  description: string;
  hint: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
      className="group/card block h-56 w-full cursor-pointer text-left perspective-distant focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:h-64"
    >
      <span
        className={`relative block size-full transition-transform duration-700 transform-3d motion-reduce:transition-none ${
          flipped ? "rotate-y-180" : "group-hover/card:rotate-y-180"
        }`}
      >
        <span className="absolute inset-0 flex flex-col justify-between border border-line bg-surface p-6 backface-hidden md:p-7">
          <span className="text-eyebrow text-brand">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="block text-h3 text-brand-deep">{title}</span>
            <span className="mt-2 block text-caption text-fg-subtle">
              {hint}
            </span>
          </span>
        </span>
        <span className="absolute inset-0 flex rotate-y-180 flex-col justify-end bg-brand-lavender p-6 backface-hidden md:p-7">
          <span className="block text-tech-body text-brand-deep">
            {description}
          </span>
        </span>
      </span>
    </button>
  );
}
