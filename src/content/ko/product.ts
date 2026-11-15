// 제품 · B 정적 시안 원문(#54).
// 숫자 4칸은 이 파일, 전체 사양표는 DB에서 읽는다.
// 사양표 문장은 짧은 숫자 칸에 맞지 않아 분리한다(#79, 2026-11-15 운영 표시 오류).
export const productCopy = {
  intro: {
    title: "편한 잠듦을 위한\n디지털 귀마개, 슬리비",
    purchaseButton: "구매하러 가기",
    comingSoon: "출시 예정",
    guideButton: "사용 방법",
  },
  features: {
    title: "앱도, 블루투스도 없이\n귀에 꽂는 것만으로 시작하는 디지털 귀마개",
    photos: [
      {
        src: "/images/product/gallery-01.jpg",
        alt: "열린 충전 케이스와 슬리비 본체",
      },
      {
        src: "/images/product/gallery-02.jpg",
        alt: "슬리비 본체를 넣은 충전 케이스",
      },
      {
        src: "/images/product/gallery-03.jpg",
        alt: "슬리비 구성품과 제품 상자",
      },
      {
        src: "/images/product/gallery-04.jpg",
        alt: "슬리비 케이스, 본체, 충전 케이블과 이어팁",
      },
    ],
  },
  moments: {
    title: "밤부터 낮,\n잠깐의 휴식까지",
    description:
      "슬리비는 밤의 잠자리 뿐 아니라\n일상 속에서도 잠깐씩 쉬고 싶을 때 사용할 수 있습니다",
    labels: [
      "잠들기 전, 침실에서",
      "낮잠이 필요한 순간",
      "잠깐 쉬고 싶은 일상 속",
    ],
  },
  algorithm: {
    title: "작은 기기 안에 담은\n정밀한 음향 알고리즘",
    description:
      "슬리비에는 마취 분야의\n양이성 음향 연구를 바탕으로 설계된\n알고리즘이 탑재되어 있습니다",
    link: "원리 보기",
  },
  howToUse: {
    title: "꺼내서, 꽂으면 끝",
    steps: ["1. 케이스를 열고", "2. 슬리비를 꺼내", "3. 귀에 착용하세요"],
    notes: [
      {
        title: "슬리비 본체가 귀 뒤쪽을\n향하도록 착용하세요",
        description:
          "본체가 귓바퀴 안쪽의 오목한 공간에 쏙 자리 잡아\n자연스럽게 밀착되고, 옆으로 누웠을 때도 이물감을\n덜 느낄 수 있습니다",
      },
      {
        title: "꺼내면 ON, 넣으면 OFF",
        description:
          "케이스에서 꺼내면 자동으로 켜지고,\n다시 넣으면 자동으로 꺼집니다",
      },
      {
        title: "30분 후 자동 OFF",
        description:
          "케이스에서 꺼낸 후 30분이 지나면 자동으로 꺼집니다\n다시 사용하려면 케이스에 넣고 1-2초 후 다시 꺼내주세요",
      },
    ],
  },
  kit: {
    title: "제품 구성",
    items: ["케이스", "본체", "충전 케이블", "이어팁(S / M / L)", "사용설명서"],
    metrics: [
      { label: "귀마개 무게", value: "3 g" },
      { label: "충전 케이스 무게", value: "26 g" },
      { label: "소비전력", value: "5V" },
      { label: "무상 A/S", value: "1년" },
    ],
  },
};
