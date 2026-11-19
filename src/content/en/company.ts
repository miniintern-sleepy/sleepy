// 회사 소개 영어 문구. 한국어 원문(ko/company.ts)을 옮겼다(#96).
// 대표 영문 이름은 서울대 연구자 페이지(snu.elsevierpure.com) 표기를 따른다.
import type { companyCopy as ko } from "../ko/company";

export const companyCopy: typeof ko = {
  intro: {
    title: "We think about the day\nthat follows sleep",
    description:
      "Rooted in anesthesiology research, we build technology that helps you sleep well without medication",
  },
  ceo: {
    name: "Jeong-Hwa Seo",
    role: "Professor of Anesthesiology and Pain Medicine, Seoul National University Hospital",
    photo: "/images/company/ceo-portrait-suit.webp",
    photoAlt: "Jeong-Hwa Seo, CEO of Sleepy",
    paragraphs: [
      "It began with a small question from Sleepy's founder, a father of four and a professor of anesthesiology and pain medicine",
    ],
    quote:
      "“Could we make earplugs that our children can use easily before they fall asleep?”",
    links: [
      {
        label:
          "Professor, Department of Anesthesiology and Pain Medicine, Seoul National University Hospital",
        href: "https://www.snuh.org/blog/65626/philosophy.do",
      },
      {
        label:
          "Professor, Department of Anesthesiology and Pain Medicine, Seoul National University College of Medicine",
        href: "https://snu.elsevierpure.com/en/persons/y-seo-7/",
      },
    ],
  },
  about: {
    kicker: "Sleepy is",
    title:
      "a sleep tech company researching sleep\nwith non-drug neuromodulation",
    paragraphs: [
      "A faculty startup founded in 2024 by Professor Jeong-Hwa Seo of the Department of Anesthesiology and Pain Medicine at Seoul National University Hospital",
      "Building on non-drug neuromodulation and brainwave entrainment technologies derived from anesthesiology research, we develop sleep induction solutions that do not rely on medication, and are expanding our research into sedation, anesthesia support, and arousal",
    ],
    rows: [
      { label: "Company", value: "Sleepy Inc." },
      { label: "Founded", value: "April 2024" },
      {
        label: "CEO",
        value:
          "Jeong-Hwa Seo · Professor of Anesthesiology and Pain Medicine, SNUH",
      },
      { label: "Field", value: "Sleep tech · Digital healthcare" },
      {
        label: "Core technology",
        value: "Non-drug neuromodulation based on binaural beats",
      },
      { label: "First product", value: "Sleeby digital earplug" },
      { label: "Locations", value: "Seoul · US entity (2025)" },
      {
        label: "Exhibitions",
        value: "MWC 2026 · Interop Tokyo 2026 · KDS 2026",
      },
    ],
  },
  beliefs: {
    title: "What Sleepy stands for",
    items: [
      {
        title: "Sleep without medication",
        description:
          "We help you fall asleep on your own, without the tolerance or side effects of sleeping pills",
      },
      {
        title: "Science rooted in anesthesiology",
        description:
          "We apply neuromodulation principles from anesthesiology research at Seoul National University Hospital to sleep technology",
      },
      {
        title: "One approach to brain states",
        description:
          "Starting with sleep, we are expanding into sedation, anesthesia support, and digital arousal",
      },
    ],
  },
  easyTech: {
    title: "Our technology, simply put",
    left: "Left ear",
    right: "Right ear",
    caption: "Different sounds",
    center: "A new sound\nin your head",
    description:
      "When each ear hears a sound at a slightly different frequency, the brain perceives the difference between them as a beat.",
    link: "Learn more about the technology",
    diagramLabel:
      "Different sounds reach the left and right ears, and a new sound is created in the head",
  },
  history: {
    title: "Our journey",
    items: [
      { date: "2024.04", text: "Sleepy founded" },
      { date: "2025.07", text: "US entity established" },
      { date: "2026.01", text: "Selected for Samsung C-Lab Outside" },
      { date: "2026.02", text: "Kickstarter crowdfunding" },
      { date: "2026.03", text: "Exhibited at MWC 2026" },
      { date: "2026.06", text: "Exhibited at Interop Tokyo 2026" },
      { date: "2026.10", text: "Makuake crowdfunding" },
      { date: "2026.12", text: "Official Sleeby launch (planned)" },
    ],
  },
  contact: {
    title: "Have a question for Sleepy?",
    description: "Feel free to ask us about our product or company",
    button: "Contact us",
  },
};
