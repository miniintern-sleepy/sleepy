import type { faqCopy as ko } from "../ko/faq";

// 질문과 답은 DB 한국어 그대로다(영어 칸 없음).
export const faqCopy: typeof ko = {
  title: "FAQ",
  description: "From how to use it to charging and care.",
  contact: "Couldn't find the answer you need?\nContact Sleepy directly.",
  searchLabel: "Search questions",
  placeholder: "Search for what you'd like to know",
};
