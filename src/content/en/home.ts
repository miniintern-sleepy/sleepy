// 메인 화면 영어 문구. 한국어 원문(ko/home.ts)을 옮겼다(#96). 모양은 한국어와 같아야 한다.
import type { homeCopy as ko } from "../ko/home";

export const homeCopy: typeof ko = {
  hero: {
    title:
      "Regulating the central nervous system without drugs,\nwe build digital solutions that help from sleep to anesthesia",
    description:
      "Sleeby, a digital earplug that helps\nyou sleep with binaural beats",
    link: "Product",
  },
  everyday: {
    title: "Because sleep is\npart of your day",
    paragraphs: [
      "When you lie down at the end of the day,\nor close your eyes during a busy day,\nwe all hope to rest in comfort",
      "Sleepy thinks about the time before sleep\nWe build non-drug sleep technology\nthat is simple to prepare and close to daily life",
    ],
  },
  day: {
    title: "Redefining the essence\nof sleep with technology",
    day: "A break in the day",
    night: "The end of the day",
    link: "How it works",
  },
  founder: {
    title: "Answering everyday\nquestions with research",
    role: "Professor of Anesthesiology and Pain Medicine, Seoul National University Hospital",
    paragraphs: [
      "Sleeby, a digital earplug that began with a small question from Sleepy's founder, a father of four and a professor of anesthesiology and pain medicine",
    ],
    description:
      "Rooted in anesthesiology research, we build technology that helps you sleep well without medication",
    link: "About us",
  },
  product: {
    title: "Making the time before sleep\na little simpler",
    description: "Sleeby, a digital earplug that works without a smartphone",
    link: "Product",
  },
  faq: {
    title: "FAQ",
    link: "See all FAQs",
  },
};
