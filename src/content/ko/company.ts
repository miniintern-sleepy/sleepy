// 회사 소개 화면 문구 — A의 구간 배치·B의 확정 문구(#54), 기능 명세 F-02
// 줄바꿈(\n)은 화면에서 whitespace-pre-line으로 살린다.
export const companyCopy = {
  intro: {
    title: "우리는 잠든 다음의\n하루까지 생각합니다.",
    description:
      "마취통증의학 연구에서 출발해, 약 없이 편안한 잠을 돕는 기술을 만듭니다.",
    // 문구 뒤에 깔리는 배경 사진이다. 문구만으로 뜻이 통하므로 꾸밈 이미지로 둔다.
    background: "/images/company/intro-photo.webp",
  },
  // 특허 등록 건수는 기술 화면 문구(technology.ts)를 그대로 가져와 보여 준다. 숫자를 두 곳에 적지 않는다.
  facts: [
    { value: "2024", label: "슬리피 창업" },
    { value: "2026", label: "MWC 2026 출전" },
  ],
  ceo: {
    name: "서정화",
    role: "대표이사(CEO) · 마취통증의학과 교수",
    // 사진이 없으면 사진 칸을 숨긴다(F-02). photo를 빈 문자열로 두면 된다.
    photo: "/images/company/ceo-portrait.webp",
    photoAlt: "슬리피 대표 서정화",
    paragraphs: [
      "네 아이의 아빠이자 마취통증의학과 교수인 슬리피 대표의 작은 질문에서 시작된 디지털 귀마개, 슬리비.",
    ],
    quote:
      "“우리 아이들이 잠들기 전, 간편하게 사용할 수 있는 귀마개를 만들 수 없을까?”",
  },
  beliefs: {
    title: "슬리피가 믿는 것",
    // 카드를 누르거나 마우스를 올리면 뒤집혀 설명이 나온다.
    hint: "눌러서 보기",
    items: [
      {
        title: "약 없이",
        description: "수면제의 부담을 줄일 수 있는 다른 선택지를 만듭니다.",
      },
      {
        title: "스마트폰 없이",
        description: "앱이나 블루투스 연결 없이, 귀에 꽂기만 하면 시작합니다.",
      },
      {
        title: "연구에서 출발",
        description: "마취통증의학 연구를 바탕으로 기술을 만듭니다.",
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
    items: [
      { date: "2026", text: "일본 크라우드펀딩 오픈" },
      { date: "2026", text: "MWC 2026 출전" },
      { date: "2026", text: "글로벌 크라우드펀딩 런칭" },
      { date: "20XX", text: "미국 법인 설립" },
      { date: "2024", text: "슬리피 창업" },
    ],
  },
  contact: {
    title: "슬리피에 궁금한 점이 있으신가요?",
    description: "제품과 회사에 대해 편하게 문의해 주세요.",
    button: "문의하기",
  },
};
