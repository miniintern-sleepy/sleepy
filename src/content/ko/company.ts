// 회사 소개 화면 문구 — A의 구간 배치·B의 확정 문구(#54), 기능 명세 F-02
// 줄바꿈(\n)은 화면에서 whitespace-pre-line으로 살린다.
export const companyCopy = {
  intro: {
    title: "우리는 잠든 다음의\n하루까지 생각합니다",
    description:
      "마취통증의학 연구에서 출발해, 약 없이 편안한 잠을 돕는 기술을 만듭니다",
  },
  ceo: {
    name: "서정화",
    role: "서울대학교병원 마취통증의학과 교수",
    // 사진이 없으면 사진 칸을 숨긴다(F-02). photo를 빈 문자열로 두면 된다.
    photo: "/images/company/ceo-portrait.webp",
    photoAlt: "슬리피 대표 서정화",
    paragraphs: [
      "네 아이의 아빠이자 마취통증의학과 교수인 슬리피 대표의 작은 질문에서 시작된 디지털 귀마개, 슬리비",
    ],
    quote:
      "“우리 아이들이 잠들기 전, 간편하게 사용할 수 있는 귀마개를 만들 수 없을까?”",
    // 대표 이력을 확인할 수 있는 외부 페이지(2026-11-12 대표님 메일). href가 비면 링크를 숨긴다.
    links: [
      {
        label: "서울대학교병원 마취통증의학과 교수",
        href: "https://www.snuh.org/blog/65626/philosophy.do",
      },
      {
        label: "서울대학교 의과대학 마취통증의학교실 교수",
        href: "https://snu.elsevierpure.com/en/persons/y-seo-7/",
      },
    ],
  },
  // 공개 기사 기반 초안이며 회사 소개 제목·설명과 표는 대표님 확인 전이다(2026-11-15, #90).
  about: {
    kicker: "슬리피는",
    title: "비약물적 신경 조절 기술로 수면을\n연구하는 슬립테크 기업입니다",
    paragraphs: [
      "2024년 서울대학교병원 마취통증의학과 서정화 교수가 창업한 교원 창업 기업입니다",
      "마취통증의학 연구에서 도출한 비약물적 신경 조절 및 뇌파 동조화 기술을 기반으로, 약물에 의존하지 않는 수면 유도 솔루션을 개발하며 진정·마취 보조 및 각성 영역으로 연구를 확장하고 있습니다",
    ],
    rows: [
      { label: "회사", value: "(주)슬리피 · Sleepy Inc." },
      { label: "설립", value: "2024년 4월" },
      { label: "대표", value: "서정화 · 서울대학교병원 마취통증의학과 교수" },
      { label: "분야", value: "슬립테크 · 디지털 헬스케어" },
      { label: "핵심 기술", value: "양이성 음향 기반 비약물 신경 조절" },
      { label: "첫 제품", value: "디지털 귀마개 슬리비(Sleeby)" },
      { label: "거점", value: "서울 · 미국 법인(2025)" },
      { label: "무대", value: "MWC 2026 · Interop Tokyo 2026 · KDS 2026" },
    ],
  },
  beliefs: {
    title: "슬리피가 지향하는 것",
    items: [
      {
        title: "약에 기대지 않는 잠",
        description: "수면제의 내성·부작용 없이 스스로 잠들 수 있도록 돕습니다",
      },
      {
        title: "마취의학에서 출발한 과학",
        description:
          "서울대학교병원 마취통증의학 연구의 신경 조절 원리를 수면 기술에 적용합니다",
      },
      {
        title: "뇌 상태를 하나로",
        description:
          "수면에서 시작해 진정·마취 보조, 디지털 각성까지 넓혀 갑니다",
      },
    ],
  },
  easyTech: {
    title: "기술을 쉬운 말로",
    left: "왼쪽 귀",
    right: "오른쪽 귀",
    caption: "서로 다른 소리",
    center: "머릿속에서\n새로운 소리",
    description:
      "양쪽 귀에 서로 다른 주파수의 음향을 전달하면,\n뇌가 두 주파수 차이를 박동감으로 인지하게 됩니다.",
    link: "기술 자세히 보기",
  },
  history: {
    title: "슬리피의 걸음",
    // 오래된 것부터 날짜순으로 둔다(2026-11-12 대표님 메일).
    items: [
      { date: "2024.04", text: "슬리피 창업" },
      { date: "2025.07", text: "미국 법인 설립" },
      { date: "2026.01", text: "삼성 C-Lab Outside 선정" },
      { date: "2026.02", text: "킥스타터 크라우드 펀딩" },
      { date: "2026.03", text: "MWC 2026 출전" },
      { date: "2026.06", text: "Interop Tokyo 2026 출전" },
      { date: "2026.10", text: "마쿠아케 크라우드 펀딩" },
      { date: "2026.12", text: "슬리비 공식 론칭(예정)" },
    ],
  },
  contact: {
    title: "슬리피에 궁금한 점이 있으신가요?",
    description: "제품과 회사에 대해 편하게 문의해 주세요",
    button: "문의하기",
  },
};
