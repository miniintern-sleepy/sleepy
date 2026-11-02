// 회사 소개 화면 문구 — 피그마 "디자인 초안 > 02 회사 소개", 기능 명세 F-02
// 줄바꿈(\n)은 화면에서 whitespace-pre-line으로 살린다.
export const companyCopy = {
  intro: {
    title: "슬리피를 소개합니다",
    description:
      "마취통증의학 연구에서 출발해, 약 없이 편안한 잠을 돕는 기술을 만듭니다.",
  },
  ceo: {
    name: "서정화",
    role: "대표이사(CEO) · 마취통증의학과 교수",
    // 사진이 없으면 사진 칸을 숨긴다(F-02). photo를 빈 문자열로 두면 된다.
    photo: "/images/company/ceo.png",
    photoAlt: "슬리피 대표 서정화",
    paragraphs: [
      "네 아이의 아빠이자 마취통증의학과 교수인 슬리피 대표의 작은 질문에서 시작된 디지털 귀마개, 슬리비.",
      "“우리 아이들이 잠들기 전, 간편하게 사용할 수 있는 귀마개를 만들 수 없을까?”",
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
};
