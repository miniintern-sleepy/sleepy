import type { newsroomCopy as ko } from "../ko/newsroom";

// 기사 제목·요약은 DB 한국어 그대로다(영어 칸 없음).
export const newsroomCopy: typeof ko = {
  title: "Newsroom",
  description: "Company news, press releases, and announcements.",
  searchLabel: "Search news",
  placeholder: "Search",
};
