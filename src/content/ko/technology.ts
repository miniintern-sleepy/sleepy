// 기술 · 시안 01(224:7736)의 원문. 브라우저에서 문구를 읽어 옮겼다(2026-11-02).
// 주의: 효능·안전성 문구는 대표님이 확인한 것만 배포한다(F-10).
export const technologyCopy = {
  hero: {
    title: "비약물적 기술로\n편안한 수면을 돕습니다.",
    description: "양쪽 귀에 전하는 소리, 양이성 음향을 연구합니다.",
  },
  intro: {
    title: "중추신경계 억제",
    subtitle: "CNS depression",
    description:
      "슬리피 팀은 마취통증의학 영역에서 비약물적 방법으로 수면, 마취, 진정 등 중추신경계 억제 작용을 발현할 수 있는 디지털 기술을 개발하고 있습니다.",
    spectrum: [
      { label: "각성", english: "awake" },
      { label: "잠", english: "sleep" },
      { label: "진정", english: "sedation" },
      { label: "전신마취", english: "general anesthesia" },
    ],
    productName: "Sleeby",
  },
  principles: {
    binaural: {
      title: "양이성 음향",
      paragraphs: [
        "물리적 성질이 같고 주파수만 조금 다른 두 소리를 양쪽 귀에 독립적으로 들려주면, 뇌 내부 청각신경 전달체계에서 양이성 음향이라는 가상의 자극이 발생합니다.",
        "양이성 음향의 주파수는 양쪽 귀에 들려주는 두 소리의 주파수 차이와 일치합니다.",
        "양이성 음향은 뇌파동조화를 일으킬 수 있는 청각 자극입니다.",
      ],
      note: "*양이성 음향 원리에 대한 이해를 돕기 위한 예시이며, 표시된 수치는 실제 제품 설정과 다릅니다.",
    },
    entrainment: {
      title: "뇌파동조화",
      paragraphs: [
        "인체의 생리 활동에 따라 다양한 형태의 뇌파가 발생합니다.",
        "특수한 외부 자극을 통해 뇌파 주파수를 그 외부 자극의 주파수와 동기화시킬 수 있습니다.",
        "뇌파동조화를 통해 그 주파수에 해당하는 생리 상태를 유도할 수 있습니다.",
      ],
    },
    sleep: {
      title: "수면 유도",
      paragraphs: [
        "수면 중에 발생하는 뇌파 주파수 범위로 양이성 음향의 주파수를 구현하면 뇌파동조화가 일어납니다.",
        "이를 통해 수면 유도 및 진정 효과 등 중추신경계 억제 작용이 나타날 수 있습니다.",
        "수면 유도 시간을 단축하고 수면의 질을 개선한다는 것을 보여 주는 여러 임상연구 결과가 있습니다.",
      ],
    },
  },
  clinical: {
    title: "양이성 음향이 마취에 미치는 영향에 관한 임상연구",
    metric: {
      label: "전신마취 유도 시\n프로포폴 요구량",
      value: "약 20%↓",
    },
    studies: [
      { title: "프로포폴 마취 유도 용량", status: "발표" },
      { title: "프로포폴 마취 유지 용량", status: "진행 중" },
      { title: "흡입 마취제 농도", status: "진행 중" },
      { title: "레미마졸람 의식 소실 용량", status: "발표" },
      { title: "소아 사시 수술 후 섬망", status: "발표" },
      { title: "소아 마취 유도 용량", status: "IRB" },
    ],
    moreLabel: "양이성 음향 임상연구 전체 10건 보기",
  },
  patents: {
    title: "아이디어부터 디자인까지,\n지식재산권으로 보호합니다.",
    stats: [
      {
        label: "특허 등록",
        count: "3",
        unit: "건",
        note: "수면 유도 귀마개 외",
      },
      { label: "특허 출원", count: "4", unit: "건", note: "PCT 국제출원 포함" },
      {
        label: "상표 등록",
        count: "2",
        unit: "건",
        note: "슬리비 · SLEEBY 로고",
      },
      {
        label: "디자인 등록",
        count: "3",
        unit: "건",
        note: "본체 · 케이스 · 패키지",
      },
    ],
    items: [
      { title: "수면 유도 귀마개 (10-2974218)", status: "등록" },
      { title: "수면을 위한 음향 제공 방법 (10-2974219)", status: "등록" },
      {
        title:
          "1Hz 주파수 차이 양이성 음향 기반\n수면 유도 장치 및 방법 (10-2972157)",
        status: "등록",
      },
    ],
  },
};
