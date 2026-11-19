// 제품 화면 영어 문구. 한국어 원문(ko/product.ts)을 옮겼다(#96). 전체 사양표는 DB 한국어 그대로다.
import type { productCopy as ko } from "../ko/product";

export const productCopy: typeof ko = {
  intro: {
    title: "Sleeby, a digital earplug\nfor falling asleep easily",
    purchaseButton: "Buy now",
    comingSoon: "Coming soon",
    guideButton: "How to use",
  },
  features: {
    title:
      "No app, no Bluetooth.\nA digital earplug that starts the moment you put it in",
    photos: [
      {
        src: "/images/product/gallery-01.jpg",
        alt: "Open charging case with Sleeby earplugs",
      },
      {
        src: "/images/product/gallery-02.jpg",
        alt: "Charging case holding Sleeby earplugs",
      },
      {
        src: "/images/product/gallery-03.jpg",
        alt: "Sleeby components and product box",
      },
      {
        src: "/images/product/gallery-04.jpg",
        alt: "Sleeby case, earplugs, charging cable, and ear tips",
      },
    ],
  },
  moments: {
    title: "From night to day,\nand every short break",
    description:
      "Sleeby is not only for bedtime.\nUse it whenever you want a short rest during the day",
    labels: [
      "In the bedroom, before sleep",
      "When you need a nap",
      "A short break in your day",
    ],
  },
  algorithm: {
    title: "A precise sound algorithm\nin a tiny device",
    description:
      "Sleeby runs an algorithm\ndesigned from research on binaural beats\nin the field of anesthesiology",
    link: "How it works",
  },
  howToUse: {
    title: "Take it out, put it in. Done.",
    steps: ["1. Open the case", "2. Take out Sleeby", "3. Put it in your ears"],
    notes: [
      {
        title: "Wear Sleeby with the device\nfacing the back of your ear",
        description:
          "The device sits snugly in the hollow of your outer ear, so it fits naturally and feels less intrusive even when you lie on your side",
      },
      {
        title: "Take it out: ON. Put it back: OFF.",
        description:
          "It turns on automatically when you take it out of the case, and turns off when you put it back",
      },
      {
        title: "Auto OFF after 30 minutes",
        description:
          "It turns off automatically 30 minutes after you take it out of the case. To use it again, put it in the case and take it out after 1–2 seconds",
      },
    ],
  },
  kit: {
    title: "In the box",
    items: [
      "Case",
      "Earplugs",
      "Charging cable",
      "Ear tips (S / M / L)",
      "User manual",
    ],
    metrics: [
      { label: "Earplug weight", value: "3 g" },
      { label: "Charging case weight", value: "26 g" },
      { label: "Power", value: "5V" },
      { label: "Warranty", value: "1 year" },
    ],
  },
};
