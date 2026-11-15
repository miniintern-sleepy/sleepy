// 회사 소개 화면 문구 — A의 구간 배치·B의 확정 문구(#54), 기능 명세 F-02
// 줄바꿈(\n)은 화면에서 whitespace-pre-line으로 살린다.
export const companyCopy = {
  intro: {
    title: "우리는 잠든 다음의\n하루까지 생각합니다.",
    description:
      "마취통증의학 연구에서 출발해,\n약 없이 편안한 잠을 돕는 기술을 만듭니다.",
  },
  // 한눈에 보기 값은 후속 회사 페이지 구성 작업에서 다시 배치하므로 보존한다(#61).
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
    // 대표 이력을 확인할 수 있는 외부 페이지(2026-11-12 대표님 메일). href가 비면 링크를 숨긴다.
    links: [
      { label: "서울대병원 교수 소개", href: "" },
      { label: "서울대 의대 연구자 정보", href: "" },
    ],
  },
  beliefs: {
    title: "슬리피가 믿는 것",
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
    // 유튜브 영상은 쿠키 때문에 화면 안에서 재생하지 않고 새 창으로 연다(#77). href가 비면 링크를 숨긴다.
    videos: [
      // 18분 14초부터 대표 발표가 시작되도록 메일의 시작 시각을 그대로 둔다.
      {
        label: "강의 영상 보기",
        href: "https://www.youtube.com/watch?v=iuWn5CnKjQ0&t=1094s",
      },
      {
        label: "IR 영상 보기",
        href: "https://www.youtube.com/watch?v=hVidH-v1SwM",
      },
    ],
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
    description: "제품과 회사에 대해 편하게 문의해 주세요.",
    button: "문의하기",
  },
};
