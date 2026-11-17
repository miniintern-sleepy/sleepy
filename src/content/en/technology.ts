// 기술 화면 영어 문구. 한국어 원문(ko/technology.ts)을 옮겼다(#96).
// 주의: 효능·안전성 문구는 한국어 원문의 뜻을 넘지 않게 옮겼다(F-10).
import type { technologyCopy as ko } from "../ko/technology";

export const technologyCopy: typeof ko = {
  hero: {
    title: "Helping you sleep well\nwith non-drug technology.",
    description: "We research binaural beats, sounds delivered to both ears.",
  },
  intro: {
    title: "CNS depression",
    subtitle: "Central nervous system depression",
    description:
      "In the field of anesthesiology and pain medicine, the Sleepy team is developing digital technology that can bring about central nervous system depression, such as sleep, anesthesia, and sedation, without medication.",
    spectrum: [
      { label: "Awake", english: "" },
      { label: "Sleep", english: "" },
      { label: "Sedation", english: "" },
      { label: "General anesthesia", english: "" },
    ],
    productName: "Sleeby",
  },
  principles: {
    binaural: {
      title: "Binaural beats",
      paragraphs: [
        "When two sounds with the same physical properties but slightly different frequencies are played separately to each ear, a virtual stimulus called a binaural beat arises in the brain's auditory pathway.",
        "The frequency of a binaural beat equals the difference between the frequencies of the two sounds played to each ear.",
        "Binaural beats are an auditory stimulus that can cause brainwave entrainment.",
      ],
      note: "*This example is meant to explain how binaural beats work. The values shown differ from the actual product settings.",
    },
    entrainment: {
      title: "Brainwave entrainment",
      paragraphs: [
        "The body produces brainwaves of various forms depending on its physiological activity.",
        "A specific external stimulus can synchronize brainwave frequency with the frequency of that stimulus.",
        "Through brainwave entrainment, the physiological state that matches that frequency can be induced.",
      ],
    },
    sleep: {
      title: "Sleep induction",
      paragraphs: [
        "When a binaural beat is set within the brainwave frequency range that occurs during sleep, brainwave entrainment takes place.",
        "This can lead to central nervous system depression, such as sleep induction and sedation.",
        "Several clinical studies show that it shortens the time it takes to fall asleep and improves sleep quality.",
      ],
    },
  },
  clinical: {
    title: "Clinical research on the effect of binaural beats on anesthesia",
    publishedStatus: "Published",
    metric: {
      label: "Propofol needed for induction",
      value: "About 20%↓",
    },
    studies: [
      { title: "Propofol dose for anesthesia induction", status: "Published" },
      { title: "Propofol dose for anesthesia maintenance", status: "Ongoing" },
      { title: "Inhaled anesthetic concentration", status: "Ongoing" },
      {
        title: "Remimazolam dose for loss of consciousness",
        status: "Published",
      },
      {
        title: "Delirium after pediatric strabismus surgery",
        status: "Published",
      },
      { title: "Pediatric anesthesia induction dose", status: "IRB" },
    ],
    moreHref:
      "https://www.ncbi.nlm.nih.gov/sites/myncbi/1JEcj2X0fdP/collections/68016625/public/",
    moreLabel: "See all 10 clinical studies on binaural beats",
  },
  video: {
    title: "Technology videos",
    items: [
      {
        label: "IR video",
        title:
          "Digital sleeping pills & anesthetics that deliver sleep and anesthetic effects without medication",
        href: "https://www.youtube.com/watch?v=hVidH-v1SwM",
        image: "/images/technology/video-ir.jpg",
      },
      {
        label: "Lecture",
        title:
          "Non-Pharmacological CNS Depression and Digital Anesthetics by Sensory and Brainwave Entrainment",
        href: "https://www.youtube.com/watch?v=iuWn5CnKjQ0&t=1094s",
        image: "/images/technology/video-lecture.jpg",
      },
    ],
  },
  patents: {
    title: "From idea to design,\nprotected by intellectual property.",
    stats: [
      {
        label: "Patents granted",
        count: "3",
        unit: "",
        note: "Including sleep-inducing earplugs",
      },
      {
        label: "Patents pending",
        count: "4",
        unit: "",
        note: "Including a PCT application",
      },
      {
        label: "Trademarks",
        count: "2",
        unit: "",
        note: "Sleeby (Korean) · SLEEBY logos",
      },
      {
        label: "Designs",
        count: "3",
        unit: "",
        note: "Device · Case · Package",
      },
    ],
    items: [
      { title: "Sleep-inducing earplugs (10-2974218)", status: "Granted" },
      {
        title: "Method of providing sound for sleep (10-2974219)",
        status: "Granted",
      },
      {
        title:
          "Sleep induction device and method based on binaural beats with a 1 Hz frequency difference (10-2972157)",
        status: "Granted",
      },
    ],
  },
};
