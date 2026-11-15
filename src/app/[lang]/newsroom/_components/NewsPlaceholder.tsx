import type { ReactNode } from "react";
import type { NewsCategory } from "@/types/content";

const icons: Record<NewsCategory, ReactNode> = {
  company: (
    <>
      <path d="M4 21V5l8-3v19M12 21V9l8 3v9M2 21h20" />
      <path d="M7 8h2M7 12h2M7 16h2M15 14h2M15 17h2" />
    </>
  ),
  press: (
    <>
      <path d="M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2h-1" />
      <path d="M7 8h7M7 12h7M7 16h4" />
    </>
  ),
  notice: (
    <>
      <path d="M3 10v4h4l7 5V5L7 10z" />
      <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
};

// 썸네일이 없는 기사 자리에 두는 분류별 아이콘. 분류는 카드 글자로 이미 읽히므로 화면 읽기 프로그램에서는 숨긴다(#77).
export default function NewsPlaceholder({
  category,
}: {
  category: NewsCategory;
}) {
  return (
    <span
      className={`news-placeholder news-placeholder-${category}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[category]}
      </svg>
    </span>
  );
}
