# 디자인 시스템

> 원본: `src/styles/tokens.css`와 이 문서. #54 사용자 승인(2026-11-07).

## 기준과 적용 범위

- A는 이 저장소의 `ff04e9235ce1c6d90f9b2a4dda4927b589f51cf9` 화면이다.
- B는 [정적 시안 670d9a3](https://github.com/kohyunseok518/sleepy/tree/670d9a3cc0ece144dcae6ece24d9be83a7b7a4a5)의 `docs/DESIGN.md`, `public/*.html`, `public/styles/`, `public/scripts/waves.js`, 실제 참조 자산이다. archive는 기준에서 제외한다.
- B CSS는 HTML의 import 순서·선택자 우선순위·반응형 최종 규칙으로 판단한다. foundation의 초기 값보다 theme·dimension·페이지 선택자의 최종 활성 값이 우선한다.
- 메인은 B 본문 배치·문구를 따르되 첫 히어로는 #81의 상자 사진·일반 머리말 아래 배치를 쓴다. #68의 투명 헤더(D-50)는 더 사용하지 않는다. 회사·기술·제품·뉴스룸·FAQ·문의의 히어로는 #60·#61의 PageHero를 따른다. 그 아래 회사 본문은 A 구간 순서·배치, 나머지 공개 본문은 B 배치·문구를 유지한다.
- 공개 헤더·푸터는 B이며 모션 끄기 버튼과 A의 SNS 장식은 넣지 않는다. 모바일 현재 메뉴는 진한 보라·선택 굵기로 구분하고, 푸터 일반/제휴 문의는 유형 쿼리 없이 해당 언어의 contact로 연결한다. 관리자에는 공개 헤더·푸터를 넣지 않는다.
- 기존 A 색·글자 토큰·하위 변수·별칭은 모두 제거한다. 화면에서는 새 토큰을 사용하며 색 리터럴·임의 글자 값을 쓰지 않는다. 기본 Tailwind 색·글자 크기는 계속 비활성화한다.
- 피그마는 이번 작업 범위가 아니다. 디자인을 바꿀 때 코드와 이 문서를 함께 고친다.

## 공통 토큰

### 색

| 새 이름                 | 값        | B의 근거 / 용도                                          |
| ----------------------- | --------- | -------------------------------------------------------- |
| `--color-paper`         | `#fcfbff` | `theme.css :root[data-design="24"] --paper`, 기본 배경   |
| `--color-panel`         | `#eeebf8` | 같은 곳 `--soft`, `--hero`. 같은 값이므로 하나로 통합    |
| `--color-ink`           | `#2b263a` | 같은 곳 `--ink`, 본문·제목                               |
| `--color-muted`         | `#6b607a` | 같은 곳 `--muted`, 설명·메타                             |
| `--color-violet`        | `#7754ab` | 같은 곳 `--accent`, 강조·파동                            |
| `--color-violet-strong` | `#543779` | 같은 곳 `--accent-deep`, 포커스·주요 버튼                |
| `--color-rule`          | `#ddd5eb` | 같은 곳 `--line`, 구분선·입력 테두리                     |
| `--color-white`         | `#ffffff` | `theme.css .button.primary`, 주요 버튼·사진 위 글자      |
| `--color-error-ink`     | `#9b1c31` | B에 없음. 로그인 오류·삭제 오류·문의 발송 실패용 승인 값 |
| `--color-error-panel`   | `#fff1f3` | 위 오류 설명의 배경. 글자와 대비 7.35:1                  |
| `--color-success-ink`   | `#216344` | B에 없음. 저장 완료·접수 성공·답변 완료용 승인 값        |
| `--color-success-panel` | `#edf7f0` | 위 성공 설명의 배경. 글자와 대비 6.53:1                  |

오류·성공 네 값은 B에 없는 기능 상태를 위해 승인한 추가 색이다. 관리자뿐 아니라 실제 공개 문의 안내에도 공유한다. 발송 중·새 문의·비공개 등은 보라·보조색과 기존 상태 문구를 쓴다. 흐린 장식색·구분선색은 본문색으로 쓰지 않는다.

본문 대비: ink/paper 14.14:1, muted/paper 5.69:1, muted/panel 4.99:1, violet/panel 4.91:1, white/violet-strong 9.55:1. 오류/오류 배경은 7.35:1, 성공/성공 배경은 6.53:1이다. 사진·투명도 조합은 별도 화면 검증 대상이다.

### 폭·간격·모양·포커스

| 새 이름                                                | 값                                                       | 근거                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `--container-site`                                     | `1280px`                                                 | B `theme.css --content`, 헤더·푸터·메인                                     |
| `--layout-gutter`                                      | `clamp(22px, 5.55vw, 80px)`                              | B `theme.css --gutter`                                                      |
| `--layout-page-side`                                   | `max(22px, calc((100vw - 850px) / 4))`                   | B `theme.css --page-side`                                                   |
| `--layout-page-width`                                  | `min(1280px, calc(100vw - var(--layout-page-side) * 2))` | B `theme.css --page-width`, 하위 공개 페이지                                |
| `--header-height` / `--header-height-small`            | `88px` / `72px`                                          | B `theme.css .header-inner`, `<=760px`                                      |
| `--size-logo`                                          | `106px`                                                  | B `theme.css .brand img`, 푸터 로고 포함                                    |
| `--size-touch`                                         | `44px`                                                   | B 내비게이션·링크 + 이번 접근성 기준                                        |
| `--size-field` / `--size-button`                       | `50px` / `49px`                                          | B `foundation.css .field`, `.button`                                        |
| `--radius-control` / `--radius-pill`                   | `3px` / `28px`                                           | B 입력·버튼 / 헤더 문의 버튼                                                |
| `--radius-media` / `--radius-photo` / `--radius-stage` | `10px` / `12px` / `16px`                                 | B 활성 이미지·사진·제품 무대 규칙. 페이지별 실제 대응 요소에만 사용         |
| `--radius-research-photo`                              | `13px`                                                   | B 연구 이미지의 최종 1.3배 반경                                             |
| `--focus-width` / `--focus-offset`                     | `2px` / `5px`                                            | B `theme.css :focus-visible`, 색은 violet-strong                            |
| `--scroll-target-gap`                                  | `28px`                                                   | B `theme.css main [id]`                                                     |
| `--space-section` / `--space-section-small`            | `112px` / `75px`                                         | B 기본 구간 간격. 페이지별 큰 여백은 B 대응 규칙을 따름                     |
| `--container-admin`                                    | `72rem` (1152px)                                         | #57 관리자 대시보드 시안의 본문 최대 폭                                     |
| `--size-admin-sidebar`                                 | `300px`                                                  | #74 시안의 왼쪽 메뉴 폭                                                     |
| `--font-weight-ui-selected`                            | `600`                                                    | B `foundation.css .filter[aria-pressed=true]`. 같은 역할의 선택 상태에 사용 |

추가 굵기 토큰 `--font-weight-ui-regular: 400`, `--font-weight-ui-medium: 500`은 B의 본문·메뉴 굵기다. `--tracking-heading: -.045em`은 B의 공통 제목 자간이다. 페이지의 고유 그리드·이미지 비율은 그 화면 CSS에 둔다. 일반 간격에는 Tailwind 간격 유틸리티를 사용할 수 있다.

### 글꼴

Pretendard 1.3.9 공식 축소판(woff2-subset, 한글 2,350자·영문)의 Regular(400)·Medium(500)·SemiBold(600)·Bold(700)·Black(900) WOFF2를 `src/assets/fonts/pretendard/`에 OFL LICENSE와 함께 둔다. [공식 정적 face 정의](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/dist/web/static/pretendard.css)와 같은 글꼴 선택 방식을 사용한다.

공개·관리자의 별도 최상위 레이아웃이 `src/lib/fonts.ts`의 next/font/local 설정을 공유한다. `display: swap`, `preload: false`로 사용한 face만 자체 호스트에서 불러온다. 새 라이브러리·런타임 CDN은 없다. `--font-ui`는 next/font가 생성한 `--font-pretendard-local`과 시스템 대체 글꼴을 연결한다.

축소판에 없는 글자는 시스템 대체 글꼴로 표시된다. 임의 재가공 없이 [공식 1.3.9 배포 ZIP](https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip)의 `web/static/woff2-subset/` 파일과 공식 태그의 개별 다운로드 파일을 SHA-256으로 대조했다. LICENSE는 그대로 유지한다. Regular+Medium 파일 합계는 535,420바이트다.

| 파일                               | 바이트  | 공식 배포판과 일치한 SHA-256                                       |
| ---------------------------------- | ------- | ------------------------------------------------------------------ |
| `Pretendard-Regular.subset.woff2`  | 267,096 | `01dd73155fdfab7ce9b25224523e85a96927e21aef97f21957d41f1bfa7e3878` |
| `Pretendard-Medium.subset.woff2`   | 268,324 | `6f4e897a59138903ae64e814df059790cf0e0ff73b8595810145aee23204469f` |
| `Pretendard-SemiBold.subset.woff2` | 268,752 | `4247dc5e260b92640c2cbd0e75091154647b71e1d5884116655e2903468c54cc` |
| `Pretendard-Bold.subset.woff2`     | 270,784 | `78eb71c33101ee7d4f8d1b777d193a12d00f8a296e712a8c417cf27abe946397` |
| `Pretendard-Black.subset.woff2`    | 273,460 | `439823f6076b12390af89a9d8883d79530f60539319e4b244633057d5a0cff6f` |

### 공통 활자

아래 이름에는 `--text-`가 붙는다. 크기/굵기/행간/자간 순서다. 반응형은 L=1200px, M=1023px, S=760px, XS=520px, XXS=400px 이하이며 더 작은 화면 규칙이 우선한다. 표에 자간이 없으면 0이다. B의 420·450·650·850 CSS 굵기도 보존하며 정적 face 매칭은 브라우저가 처리한다.

| 새 이름          | 값·반응형                                                        | B 근거 / 대상                                              |
| ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| `detail-heading` | `clamp(30px,3.3vw,48px) / 450 / 1.35 / -.045em`; S 34px, XS 30px | B 기술·제품 큰 구간 제목 (`details.css`, `dimension.css`)  |
| `cta-heading`    | `32px / 450 / 1.5 / -.045em`; S 29px, XS 26px                    | 공통 문의 배너                                             |
| `form-aside`     | `28px / 450 / 1.5 / -.045em`                                     | B 문의 안내 제목. 관리자 주 제목에도 사용                  |
| `form-title`     | `25px / 450 / 1.5 / -.045em`                                     | B 문의 폼 제목. 관리자 구간 제목에도 사용                  |
| `copy`           | `16px / 400 / 1.9`                                               | B 기본 본문·관리자 표/폼 본문                              |
| `copy-large`     | `18px / 400 / 1.9`; S 16px, XS 15px                              | B 기술·제품 설명                                           |
| `copy-intro`     | `17px / 400 / 1.9`; S 16px                                       | B 페이지 도입·메인 이야기                                  |
| `helper`         | `14px / 400 / 1.9`                                               | B 안내 문구·관리자 오류/도움말                             |
| `meta`           | `13px / 400 / 1.9`                                               | B 주소·회사 정보·메타                                      |
| `micro`          | `12px / 400 / 1.9`                                               | B 검색 결과 수·작은 보조 정보                              |
| `fine`           | `11px / 400 / 1.9`                                               | B 작은 보조 표시. 주요 본문에는 쓰지 않음                  |
| `nav`            | `14px / 500 / normal`; S 16px                                    | B 헤더 메뉴. 관리자 메뉴는 기존 크기 흐름에 맞춰 14px 유지 |
| `ui-label`       | `14px / 400 / normal`                                            | B 폼 라벨                                                  |
| `ui-button`      | `14px / 400 / 1.3`                                               | B 버튼                                                     |
| `ui-input`       | `16px / 400 / normal`                                            | B 입력칸. textarea는 copy 행간 사용                        |
| `text-link`      | `15px / 400 / 1.5`                                               | B 밑줄 링크                                                |
| `compact-link`   | `13px / 400 / 1.5`                                               | B 메인 연구 원리 링크                                      |
| `kicker`         | `12px / 550 / 1.4 / .06em`                                       | B eyebrow. 남는 A 회사 소개 보조 제목에 대응               |

공개 nav의 모바일 크기는 ui-input의 16px를 사용한다. 관리자 메뉴의 기존 14px 흐름은 유지한다. 공통 외곽의 다음 네 역할은 foundation/theme의 실제 규칙을 사용한다.

| 이름         | 크기 / 굵기 / 행간               | 출처                                    |
| ------------ | -------------------------------- | --------------------------------------- |
| header-cta   | 13px / 400 / normal              | foundation .contact-link                |
| footer-nav   | 13px / 400 / normal, 모바일 12px | foundation .footer-nav, theme 모바일    |
| footer-info  | 13px / 400 / 2                   | theme .footer address + foundation 행간 |
| footer-legal | 11px / 400 / normal              | foundation .footer small                |

## 페이지 전용 토큰

### 색·효과

| 새 이름                         | 값                                                                                 | B의 근거 / 용도                                  |
| ------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| `--gradient-science`            | `linear-gradient(90deg, panel, color-mix(in srgb, violet 42%, panel) 45%, violet)` | B 기술 상태 스펙트럼                             |
| `--color-wave-back`             | `color-mix(in srgb, violet 18%, panel)`                                            | B 기술 막대의 옅은 층                            |
| `--color-algorithm-glow`        | `color-mix(in srgb, violet 20%, transparent)`                                      | B 제품 알고리즘 장식                             |
| `--color-home-hero-description` | `#3f3850`                                                                          | #81 회색 사진 벽 위 설명, muted보다 진한 승인 색 |

기술 gradient-science는 B components.css, wave-back·algorithm-glow는 details.css에서 온다. 표의 panel/violet는 같은 이름의 색 변수를 뜻한다. #61에서 회사 사진 덮개·제품 히어로 전용 색과 그림자는 사용처가 없어 제거했다.

### 폭·간격

| 새 이름                                     | 값               | 근거                   |
| ------------------------------------------- | ---------------- | ---------------------- |
| `--container-hero`                          | `1160px`         | B 메인 첫 화면 내부 폭 |
| `--space-founder` / `--space-founder-small` | `125px` / `80px` | B 메인 대표 소개 구간  |

### 활자

| 새 이름            | 값·반응형                                                        | B 근거 / 대상                                    |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| `landing-title`    | `52px / 500 / 1.28 / -.045em`; S 45px·420·1.25·-.065em, XXS 41px | #81 PC 시안·모바일 기존 값 유지(2026-11-15 승인) |
| `story-heading`    | `43px / 450 / 1.5 / -.045em`; S 38px, XS 34px                    | 메인 생활 이야기                                 |
| `day-heading`      | `33px / 450 / 1.6 / -.045em`; S 35px                             | 메인 세 장면 제목 (`dimension.css`)              |
| `founder-quote`    | `clamp(28px,3.5vw,50px) / 400 / 1.7 / -.052em`; XS 27px·1.75     | 메인 대표 인용문                                 |
| `founder-name`     | `28px / 450 / 1.5 / -.045em`; S 25px, XS 23px                    | 메인 대표 이름                                   |
| `context-heading`  | `22px / 450 / 1.65 / -.045em`                                    | 메인 연구 소개                                   |
| `stage-heading`    | `38px / 450 / 1.5 / -.045em`; S 34px, XS 32px                    | 메인 제품 소개                                   |
| `latest-heading`   | `38px / 450 / 1.5 / -.045em`; S 31px                             | 메인 소식 구간                                   |
| `latest-title`     | `20px / 500 / 1.55 / -.045em`; S 17px                            | 메인 뉴스 항목                                   |
| `science-subtitle` | `24px / 400 / 1.9`; S 20px, XS 18px                              | 회사 본문 보조 활자                              |
| `science-intro`    | `20px / 400 / 1.9`; L 18px, S 16px, XS 15px                      | 회사 본문 설명                                   |
| `device-word`      | `18px / 400 / 1.9`; S 16px                                       | 기술 Sleeby                                      |
| `science-note`     | `13px / 400 / 1.8`; S 12px                                       | 기술 각주                                        |
| `metric-label`     | `18px / 500 / 1.5`; S 14px                                       | 기술 임상 지표 이름                              |
| `research-heading` | `30px / 450 / 1.65 / -.045em`; L 26px, S 26px, XS 24px           | 기술 연구 제목                                   |
| `metric-number`    | `64px / 450 / 1.3 / -.04em`; L 54px, S 50px, XS 45px             | 기술 임상 수치                                   |
| `study-title`      | `17px / 400 / 1.7`; S 15px, XS 14px                              | 연구 목록                                        |
| `study-state`      | `15px / 400 / normal`; S 13px                                    | 연구·등록 상태                                   |
| `patent-heading`   | `44px / 450 / 1.4 / -.045em`; L 40px, S 34px, XS 29px            | 지식재산 제목                                    |
| `patent-number`    | `62px / 450 / 1.3 / -.04em`; S 48px, XS 51px                     | 지식재산 수치. B의 비단조 반응형 값도 유지       |
| `patent-item`      | `21px / 400 / 1.65`; S 18px, XS 16px                             | 특허 목록                                        |
| `patent-key`       | `15px / 400 / normal`; S 13px, XS 14px                           | 지식재산 항목명                                  |
| `patent-note`      | `12px / 400 / 1.8`; S 11px, XS 12px                              | 지식재산 각주                                    |
| `feature-heading`  | `32px / 450 / 1.4 / -.045em`; L 27px, M 25px, S 24px, XS 25px    | 제품 특징 소제목                                 |
| `scene-caption`    | `18px / 400 / 1.6`; S 15px, XS 16px                              | 제품 생활 장면                                   |
| `guide-caption`    | `25px / 400 / 1.55`; M 20px, XS 22px                             | 제품 사용 순서                                   |
| `guide-heading`    | `22px / 450 / 1.65 / -.045em`; M 19px, S 18px, XS 19px           | 제품 사용 안내                                   |
| `kit-heading`      | `40px / 450 / 1.35 / -.045em`; M 34px, S 31px                    | 제품 구성 제목                                   |
| `kit-item`         | `20px / 400 / 1.6`; M 17px, XS 18px                              | 제품 구성품                                      |
| `news-title`       | `21px / 500 / 1.55 / -.045em`; S 16px                            | 뉴스룸 행 제목                                   |
| `news-meta`        | `12px / 400 / normal / .02em`; XS 11px                           | 뉴스 날짜·언론사                                 |
| `faq-question`     | `18px / 500 / 1.7`; S 16px                                       | FAQ summary                                      |
| `faq-answer`       | `16px / 400 / 1.9`; S 15px                                       | FAQ 답변                                         |
| `filter`           | `16px / 400 / normal`; XS 14px                                   | B 뉴스 분류. 선택 시 동일 크기·600 굵기          |

제품 히어로는 공통 page-hero 활자를 쓴다. 이전 히어로 전용 활자와 점무늬 마스크는 제거했다(#61).

추가한 실제 대응 활자도 페이지 전용 토큰으로 관리한다. 원본과 해상도별 화면 대조에서 역할이 다른 값을 공통 본문에 합치지 않는다.

| 새 이름            | 값·반응형                                   | B 근거 / 대상                                       |
| ------------------ | ------------------------------------------- | --------------------------------------------------- |
| `spectrum-label`   | `20px / 400 / normal`; S 18px, XS 16px      | `details.css` 스펙트럼 상태 이름                    |
| `spectrum-english` | `13px / 400 / 1.5`; S 10px·1.6, XS 9px      | 같은 곳 영문 상태 이름                              |
| `spec-value`       | `27px / 400 / 1.55`                         | `details.css` 사양 숫자. 기존 DB 조건부 표시만 유지 |
| `day-caption`      | `14px / 400 / normal`; XS 12px              | `structure.css` 낮·밤 사진 설명                     |
| `guide-copy`       | `16px / 400 / 1.9`; M 15px, S 14px, XS 15px | `details.css` 사용 안내 본문                        |
| `patent-unit`      | `17px / 400 / normal`; S 14px               | B 실행 화면의 특허 수치 단위(1440·375px 실측)       |
| `algorithm-link`   | `16px / 400 / normal`; S 15px               | B 실행 화면의 제품 기술 링크(1440·375px 실측)       |
| `research-more`    | `16px / 400 / 1.9`; S 14px                  | `details.css` 임상연구 하단 문구                    |

공통 `ui-glyph`는 `22px / 400 / normal`로 B 검색 기호·뉴스 화살표(`foundation.css`)에 대응한다.

남는 A 회사 FlipCard·연혁, 기존 조건부 제품 사양은 공통/페이지 전용의 대응 역할을 재사용한다. 옛 스타일을 보존하기 위한 A 전용 토큰을 남기지 않는다.

## 페이지별 기준과 운영 기능

| 화면 | 기준·예외                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 메인 | 상자 사진 hero(일반 헤더 아래) → 생활 이야기 → 세 장면 → 메인 전용 대표 소개·연구 이야기 → paper 제품 소개 → DB 최신 소식 최대 4건 → FAQ 앞 질문 최대 4개(제목 "자주 묻는 질문", 모두 접힘, 아래 "FAQ 전체 보기" 링크, 소식과 같은 1000px 폭). FAQ 목록 모양(+/− 표시·줄 여백)은 FAQ 화면과 같은 public.css의 public-faq-list 규칙을 쓴다. 메인 문의 배너는 #81에서 제거한다. 공개 기사 0건이면 소식 구간, 공개 FAQ 0개면 FAQ 구간 전체를 숨긴다. 제품 소개의 구매하러 가기/출시 예정은 F-06 유지에 따른 B와의 차이다. |
| 회사 | 공통 PageHero → 대표 → 믿는 것 → 쉬운 기술 → 연혁 → 문의의 순서·배치를 유지한다. B의 추가 사진 쌍 구간은 넣지 않는다.                                                                                                                                                                                                                                                                                                                                                                                                  |
| 기술 | 공통 PageHero → 중추신경계·상태 스펙트럼 → B 세 원리·임상연구·지식재산. 승인된 본문·자료·수치는 유지한다.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 제품 | 공통 PageHero → B 특징·생활 장면·알고리즘·사용 방법·구성. 구매 버튼·사용 방법 링크는 후속 제품 구성에서 재배치한다. 기존 사양 조건부 표시만 유지하고 값이 없으면 숨긴다. 테이블 구조·사양 값·새 사양 구간을 추가하지 않는다.                                                                                                                                                                                                                                                                                           |
| 뉴스 | DB 기사만 검색·분류해 B 행 목록으로 표시한다. 주요 기사 특별 배치·예시 기사·고정 공지는 제거한다. 원문은 새 탭으로 직접 연결하고 /newsroom/[id]는 삭제한다. 날짜는 전부 YYYY.MM.DD이며 임시 1일 값도 그대로 표시한다. 날짜 정밀도 컬럼은 없다.                                                                                                                                                                                                                                                                         |
| FAQ  | B 문의 안내·검색·native details·하단 문의 배너. 질문·답변은 DB에서만 읽으며 여러 개 동시 펼침을 허용한다.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 문의 | B 배치 안에 실제 제출·Turnstile·동의·대기·성공/오류를 유지한다. 처리 순서·중복 방지·담당자 알림은 바꾸지 않는다. 지도 저작자 표시는 A/B 공통으로 유지한다.                                                                                                                                                                                                                                                                                                                                                             |

FAQ·뉴스·구매 주소·사양의 기존 cacheTag/updateTag 연결과 /[lang]·Metadata API는 유지한다. 원문 URL이 없는 뉴스 행은 가짜 링크를 만들지 않는다. 공개 정적 고정 문구는 src/content/ko와 get*Copy 함수로 읽는다. FAQ·기사 본문은 DB에만 둔다. 사용 중인 기존 이미지를 우선 재사용하고 낮·밤 생활 사진 두 개만 추가한다. B 활성 HTML에서 쓰지 않는 영상은 복사하지 않는다.

## 관리자 적용 기준

- #57의 왼쪽 공통 메뉴·대시보드를 #74의 보라 메뉴·계정 머리줄·카드 구성으로 갱신한다. 독립 최상위 레이아웃·noindex를 유지하며 본문 최대 폭은 72rem, 메뉴 폭은 300px다. 기존 목록·폼 배치와 수정 폼의 목록 아래 위치를 유지한다.
- 로그인·FAQ·제품 사양/구매·뉴스 목록/폼·문의 목록/상세/답변에 같은 새 글꼴·색·글자·선·포커스를 적용한다. 버튼·입력은 control 모서리와 B 높이 규칙을 따른다.
- 모바일 핵심 칸만 보이는 기존 동작을 유지한다. 표의 가로 스크롤을 추가하지 않는다.
- requireAdmin·사용자 세션 DB/Storage·기본 1MB Action 한도·900KB 파일 한도·메일 실패/중복 발송 정책은 그대로다. 새 모션은 넣지 않는다.
- 화면 주 제목은 form-aside, 구간 제목은 form-title을 사용한다. 현재 AdminNav 메뉴는 panel 배경·violet-strong 글자색과 font-ui-selected 굵기로 표시한다.
- 성공·오류는 위 공통 상태 토큰과 문구로 구별한다. 문구·기능을 디자인 작업 때문에 바꾸지 않는다.

## 모션

| 새 이름              | 값            | 근거                           |
| -------------------- | ------------- | ------------------------------ |
| `--motion-state`     | `160ms`       | B 링크·버튼 상태 변화          |
| `--motion-reveal`    | `700ms`       | A Reveal·도식·FlipCard 유지    |
| `--motion-image`     | `500ms`       | A 기술 이미지 hover 유지       |
| `--motion-card`      | `200ms`       | A 제품 카드 hover 유지         |
| `--motion-line`      | `1000ms`      | A 연혁·스펙트럼 선 그리기 유지 |
| `--motion-ping-once` | `1000ms`, 1회 | A 무한 ping을 단발로 변경      |

- 회사·제품·기술 본문에만 A Reveal과 대응 모션을 유지한다. 회사·제품 히어로의 등장 모션은 #61에서 제거한다. 회사 귀 원→선→중앙 원·연혁 선/순차 등장·FlipCard, 기술 스펙트럼/원리 막대·이미지 hover, 제품 생활/사용 순서 카드 hover가 대상이다.
- 회사 중앙 점은 첫 진입에 1회만 깜빡인다. 대응하지 않는 A 메인 구간의 모션은 제거한다.
- 메인·뉴스·FAQ·문의에는 Reveal을 포함한 등장 모션을 넣지 않는다. 색·포커스 상태 표시는 유지한다.
- 모든 CSS 모션은 reduced-motion에서 멈춘다. FlipCard 등의 조작은 전환 없이 즉시 반영한다. 내용은 JS/관찰 API 미지원·인쇄에서도 읽을 수 있어야 한다.

## 접근성과 검증

조작 영역 44px 이상, 2px 보라 포커스/5px offset, 본문 AA 대비를 적용한다. 푸터·문의 안내의 이메일과 지도 출처 링크도 44px 조작 영역을 확보하므로 B보다 해당 줄이 높아질 수 있다. 문의 폼은 B 시안용 버튼 대신 실제 문의 보내기와 Turnstile·동의·처리 안내 영역을 유지한다. 공개 화면은 1440·768·375px 넘침을 확인하고, 760/761px 메뉴 분기도 검사한다. 화면 비교와 테스트 ID는 docs/testing.md에 기록한다. 실제 관리자 캡처는 로컬에서만 보관한다.

## 단계별 적용

단계 1은 시스템·글꼴·공개 헤더/푸터와 전체 기존 토큰 사용처 전환이다. 페이지별 B 배치·문구·데이터/모션 전환은 단계 2, 관리자 모양·상태 마무리는 단계 3에서 수행한다. 단계 1·2·3 완료마다 변경 파일·확인 결과·캡처를 보고하고 승인 후 다음 단계로 간다. PR은 한 개이며 단계마다 커밋을 나눈다.

단계 1 수정은 3a1f3f8에서 별도 커밋했다. 단계 2에서 일곱 공개 화면과 정적 문구·DB 검색·파동을 적용했다. 단계 3에서 관리자 입력/버튼 모양과 상태 표시를 마무리한다.

## 단계 2 수정: 브라우저 계산 값 대조

B의 CSS 파일 추정 대신 실행 중 DOM의 getComputedStyle을 1440px·375px에서 수집해 공통 제목 영역·뉴스 목록·FAQ·문의 폼·배너·푸터를 대조했다. B의 실제 스타일시트 순서도 DOM에서 확인했다. 색·활자·패딩·간격·선·모서리·실제 폭/높이를 수정 전/후 JSON과 로컬 비교 보고서에 보존한다.

| 대상                      | 이전 구현                          | B 실측과 수정 후             |
| ------------------------- | ---------------------------------- | ---------------------------- |
| 메인/뉴스룸 목록 위 선    | 0px                                | ink 1px 실선                 |
| FAQ·뉴스룸·문의 제목 영역 | 80px 60px / 모바일 58px 45px       | 85px 70px / 모바일 55px 45px |
| 제목 아래 설명 최대 폭    | 제한 없음                          | 660px, 가운데 배치           |
| 문의 아래 여백            | 112px / 모바일 75px                | 100px / 모바일 70px          |
| FAQ 문의 안내 링크        | 모바일 13px                        | 15px                         |
| 문의 textarea             | 1.9 행간·rows로 기본 높이 약 210px | normal 행간·최소 200px       |
| 문의 동의 글자색          | muted                              | ink                          |
| 모바일 문의 버튼 패딩     | 14px 25px                          | 13px 20px                    |
| 모바일 문의 안내 최대 폭  | 제한 없음                          | 600px                        |

FAQ 하단 배너의 내부 폭도 메인의 1280px 규칙과 분리해, B 실측의 하위 페이지 폭(1440px에서 1145px)에 맞춘다.

문의 라벨은 B의 바깥 label(16px)이 아니라 실제 문구가 들어 있는 안쪽 span의 14px/normal과 비교해 ui-label을 유지한다. 필드 제목과 입력 사이 12px·필드 아래 28px는 B 실측을 유지한다. 폼 제목 뒤 기본 간격은 B의 20px에 맞추고, 시안의 접수 준비 문구는 실제 보안·전송 안내로 대체한다. 뉴스 썸네일은 옆 제목과 중복되므로 alt를 빈 문자열로 둔다.

합의한 차이는 별도로 유지한다: 44px 이메일·동의/메뉴 조작 영역, 메인 구매 상태, 실제 문의·Turnstile·글자 수/검증/성공 안내, 회사 A 배치·모션, 자체 호스트 축소 폰트, 푸터 모션 버튼 없음. B의 label 안 input과 구현의 연결된 label/input, 동의 여백을 감싼 div 등 동등한 DOM 구조 차이도 보고서에 표시한다. Tailwind 초기화의 0px solid/원본 none처럼 선이 그려지지 않는 차이와 자식 활자가 명시된 컨테이너의 상속 행간은 시각적 불일치와 구분한다.

관리자의 ‘주요 기사’ 체크 기능은 유지한다. **#86부터 뉴스룸 첫 페이지의 큰 기사 선택에 사용한다.** KECI 출처 표기는 DB 데이터이므로 사용자가 직접 수정한다.

최종 비교 캡처에서는 설치된 Next.js devIndicators 문서에 따라 devIndicators: false를 사용한다. 컴파일·실행 오류 표시는 계속 유지된다.

## 단계 3 관리자 공통 UI

관리자 CSS는 독립 레이아웃에서만 불러오고 admin-shell 안에 적용한다. 기존 상단·AdminNav·1024px 최대 폭·목록/폼 순서·모바일 숨김 열·문의 탭·삭제 확인·동작은 유지한다.

- 입력은 ui-input, 50px 최소 높이, 13px 안쪽 여백, control 3px 모서리·rule 선·paper 배경을 쓴다. 긴 textarea는 기존 읽기 행간(copy 1.9)과 rows를 유지한다.
- 주요 버튼은 ui-button, 49px 최소 높이·control 모서리·violet-strong/white다. 보조 버튼은 paper/violet-strong이며 목록 조작·메뉴·링크는 44px 이상을 유지한다.
- 패널·로그인·삭제 대화상자·메뉴의 모서리는 control, 뉴스 미리보기 사진은 media를 쓴다. 표 구조는 유지하고 위쪽 ink 선으로 목록 경계를 구분한다.
- 오류·발송 실패는 error-ink/error-panel, 저장·답변 완료는 success-ink/success-panel, 발송 중은 violet-strong/panel로 표시한다. 상태 문구·라이브 안내도 그대로 유지해 색만으로 구분하지 않는다.
- 모든 폼 라벨·입력·오류 연결, aria-current, 보라색 2px 포커스·5px offset을 유지한다. 새 모션·새 상태색·새 라이브러리는 추가하지 않는다.
- Auth·requireAdmin·관리 Action·DB/Storage·cacheTag/updateTag·문의/메일 정책·개인 데이터는 바꾸지 않는다. 실제 시험 문의나 메일을 새로 발송하지 않고 기존 상태를 읽어 화면을 검증한다.

## 관리자 대시보드 시안 적용 (#57·#74)

- #74 확정 시안: [PC·모바일 구역](https://www.figma.com/design/H1FmGx20Ufmk5N50f0IopS/Sleepy?node-id=453-3439). PC 프레임 453:3442는 1440×900px다. 메뉴 300px·머리줄 78px, 지표 카드 x324/604/884/1164·y124·253×126px, 문의 카드 x324/y300/698×434px, 바로 가기 x1048/y300/368×434px를 속성 패널에서 읽었다. 원본·개인정보 캡처는 저장소 밖에만 보관한다.
- 토큰 변경은 `--size-admin-sidebar` 248→300px 하나다. 기존 색·활자를 유지하며 분기 폭은 1280/1100/900/760/520px를 쓴다. 두 열은 1281px 이상, 1280px 이하는 한 열, 지표는 1100px 이하에서 두 열이다. 새 색·라이브러리·모션은 없다. 카드 그림자는 기존 rule 색을 사용한다.
- 메뉴는 violet 배경에 완전한 white 글자/아이콘/그룹명이며 반투명 흰 글자는 쓰지 않는다. 선택 탭은 왼쪽 28px 둥글기·오른쪽 0으로 panel 본문과 이어지고 violet 글자를 쓴다. 문의 배지는 흰 바탕/violet이다. 비선택 메뉴 초점은 흰색 2px, panel 탭 초점은 violet-strong 2px로 안쪽에 표시한다.
- AdminIcon은 24 viewBox/currentColor/1.8 stroke/round 선의 장식 SVG 한 컴포넌트다. 메뉴 22px·지표 42px를 쓴다. 기존 로고의 경로를 복사한 흰색 admin-logo.svg를 추가했다. 공개 로고를 바꾸지 않고 같은 형태를 확실한 흰색으로 표시하기 위해 별도 파일을 쓴다.
- PC 머리줄은 form-title의 부모 메뉴 제목·“관”으로 고정한 원·관리자·로그인 이메일을 표시한다. 900px 이하는 머리줄을 숨기고 보라 상단 바의 로고/관리자/≡ 버튼과 펼친 메뉴 아래 계정을 쓴다. 로그인 전·권한 없음에는 메뉴·머리줄이 없고 세션 만료 후 접근 거부 표식도 둘 다 숨긴다. 키보드·Escape·초점 복귀·이동 닫기·기본 requireAdmin/RLS는 유지한다.
- PC 본문 h1은 sr-only, 900px 이하는 표시한다. 첫 지표만 violet/white, 실패 숫자·아이콘은 양수일 때만 error-ink다. 지표 숫자는 줄바꿈하지 않는다. 문의 행은 helper 크기로 통일하고 이름만 ui-medium 굵기로 구분한다. 유형·날짜·상태·열 머리글은 줄바꿈하지 않고 이름만 허용한다. 문의는 이름/유형/한국 날짜/상태 표이고 이름 링크의 가상 요소를 행 전체로 확장해 키보드 링크 하나와 표 의미를 유지한다. 760px 이하는 같은 행을 카드로 표시한다. 44px 조작 영역과 토큰 활자를 우선하므로 9건 카드 높이는 정적 시안 434px보다 커질 수 있다.
- 바로 가기는 구매 링크 수정(상태 보조 문구)·FAQ 추가·기사 추가·문의 전체 보기·홈페이지 보기 순서다. 해시/scroll-margin과 같은 창 이동을 유지한다. 다른 관리 화면의 목록·폼·모바일 핵심 칸은 바꾸지 않으며 머리줄/본문 제목 중복은 후속 검토로 남긴다.

| 요소                     | 기존 활자 토큰           |
| ------------------------ | ------------------------ |
| 본문 h1                  | form-aside               |
| 머리줄 제목              | form-title / ui-selected |
| 메뉴/지표 이름           | nav                      |
| 그룹명                   | kicker                   |
| 큰 숫자                  | metric-number            |
| 구간 제목                | form-title               |
| 문의 이름                | helper / ui-medium       |
| 바로 가기 제목           | study-title              |
| 유형·날짜·상태·안내·버튼 | helper                   |
| 이메일·구매 상태         | meta                     |

## 카테고리 PageHero (#60·#61)

회사 소개·기술·제품·뉴스룸·FAQ·문의의 머리말은 서버 컴포넌트 PageHero로 통일한다. #54의 히어로 기준보다 이 절이 우선한다. 1440px 초과 확대·헤더는 #62 범위다. 실제 글꼴은 Pretendard다.

| 토큰                              | 값                                                 |
| --------------------------------- | -------------------------------------------------- |
| text-page-hero-title              | clamp(2.75rem,4.2vw,3.5rem) / 450 / 1.25 / -.045em |
| text-page-hero-title (760px 이하) | clamp(1.75rem,8.5vw,2rem) / 1.3                    |
| text-page-hero-description        | 1.0625rem / 400 / 1.65, 모바일 1rem, ink           |
| size-page-hero                    | 최소 높이 472px, 모바일 367px(헤더 제외)           |

header 전체 폭에 장식 CSS 배경을 놓고 public-wrap 안의 h1·p는 가운데 정렬한다. 개행을 보존하며 description이 있을 때만 설명 문단, children이 있을 때만 추가 자리를 만든다. 위 여백 80px/32px, 제목-설명 24px/14px다. 회사 설명의 개행은 PC에서는 공백으로, 760px 이하에서만 줄바꿈으로 표시한다. 나머지 제목·설명 개행은 모든 폭에서 보존한다. 사용처가 없어진 page-title과 기존 회사·제품 히어로 전용 활자는 제거했다.

scripts/generate-hero-waves.mjs는 메인 point의 amount=0·고정 phase로 2그룹×(가로32+세로22) 선을 생성한다. 색 violet, 좌표 소수1자리·불투명도3자리다. PC 폭1960px·화면별 높이, 모바일900×300. PageHero.css 한곳에서 다음 배치를 관리한다.

| 화면      | phase | PC SVG 높이 / 가로·세로 이동 | 모바일 가로·세로 이동 / 최소 높이 |
| --------- | ----- | ---------------------------- | --------------------------------- |
| 회사 소개 | 0     | 470px / +9px·5px             | 0px·124px / 437px                 |
| 기술      | 2.1   | 490px / -117px·0px           | -30px·99px / 410px                |
| 제품      | 2.8   | 480px / -18px·0px            | +10px·126px / 443px               |
| 뉴스룸    | 1     | 480px / +121px·0px           | +39.5px·55px / 367px              |
| FAQ       | 3.2   | 480px / -145px·0px           | -50.5px·59px / 367px              |
| 문의      | 5.3   | 480px / +22px·0px            | +14.5px·62px / 367px              |

배경은 no-repeat이며 화면 중앙 기준 이동이다. 760px 미디어 쿼리에서 파일을 교체해 해당 폭의 이미지 하나만 선택한다. 장식 DOM·대체 텍스트·모션은 없으며 나머지 본문·metadata·DB 기능은 유지한다.

### 히어로 아래 기술 도입 (#61)

중추신경계 억제는 h2/detail-heading, 영문 부제와 설명은 copy-large다. 배경 그라데이션·최소 높이를 제거하고 public-wrap으로 아래 원리와 좌우를 맞춘다. PC 위 여백은 space-section-small, 설명 위22px, 스펙트럼 위64px(760px 이하40px, 520px 이하32px)다. 라벨20/18/16px, 제품명18/16px로 줄이며 사진 묶음도 기존의 0.7배(PC 본체154px·케이스210px, 모바일133px·182px)다. 스펙트럼 등장·막대 확장 모션은 유지한다. 회사·제품 히어로의 사진·숫자·오브젝트·구매/구간 링크와 등장 모션은 제거한다. 제품 버튼 문구는 후속 구성용으로 보존하며 회사 facts는 #90 정보 표로 대체해 제거한다.

대비 검증의 한계: #61 회사 PC 설명 뒤 파동은 1·2배 밀도 SVG 합성에서 최저 5.36·4.58:1, 3배 밀도에서 일부 픽셀 4.47:1이다. 2026-11-09 사용자 확인으로 옅은 배경 보완을 넣지 않고 시안을 유지한다. 4.5:1을 모든 밀도에서 충족했다고 간주하지 않는다.

## 넓은 화면 비례 확대 (#62, D-49)

1440px 이하는 기존 배율1이다. 1441px부터 공개 레이아웃의 public-body 직계 자식에 `zoom: min(1.7778, tan(atan2(var(--public-vw), 1440px)))`를 적용한다. 2560px에서 약1.7778이고 그 위에서는 고정한다. body 자체는 확대하지 않아 min-h-dvh와 짧은 본문 푸터가 이중 확대되지 않는다. 헤더는 일반 문서 흐름을 유지한다. 관리자에는 식별자와 확대를 적용하지 않는다.

Safari 대응: WebKit 26.6은 zoom 식 안의 100vw를 계산하지 못해 배율이 1이 되지만 CSS.supports는 true를 돌려준다. 그래서 `@property --public-vw`(`<length>`)를 등록하고 public-body에서 100vw로 확정한 길이를 zoom 식에 넘긴다. WebKit의 zoom은 rem으로 지정한 grid 칸과 gap에 배율을 곱하지 않으므로, 넓은 화면 분기에서 `--spacing: 4px`로 두고 공개 화면의 grid 칸 임의값은 px로 쓴다. 메인 캔버스는 zoom만 바뀌면 CSS 폭이 그대로라 ResizeObserver가 울리지 않으므로 창 resize에서도 버퍼를 다시 맞춘다.

zoom 선언 전체를 검사하는 @supports 안에서만 확대와 토큰 고정을 함께 적용한다. 지원하지 않으면 두 규칙 모두 적용하지 않아 기존 레이아웃을 유지한다. tokens.css의 같은 분기에서 public-body에 gutter79.92px, page-side147.5px, page-width1145px, detail-heading2.97rem을 둔다. :root 공통값을 덮지 않는다.

1440px에서 page-hero-title은56px(4.2vw=60.48px), founder-quote는50px(3.5vw=50.4px)으로 이미 clamp 최댓값이다. landing-title은 #81에서 PC 52px 고정으로 변경했다. 추가 고정을 하지 않는다. 제품의1700px 전용 궤도 확대는 제거한다. 메인 캔버스와 선 두께 보정은 #68에서 제거했다. 확대 규칙은 전면 사진 히어로에도 적용한다.

고정 이미지 sizes에는1441px 이상 vw 분기를 추가한다. 대표37.78vw, 특허38.89vw, 메인 대표15.97vw, 뉴스10.42vw, 기술 본체10.7vw·케이스14.6vw다. 제품 구성은768px 이상50vw/나머지100vw로 둔다. 원본 교체·업스케일은 하지 않는다.

2026-11-09 사용자 확인: 배율 상한 1.7778을 유지하고, 3440px에서 일부 히어로 파동 끝이 드러나는 것을 허용된 한계로 기록한다. 파동만 별도로 확대하거나 반복하지 않는다.

## 뉴스룸·문의·FAQ 화면 개선 (#66)

- 뉴스룸 목록: #77(D-53)에서 카드 격자로 바뀌었다. 아래 #77 절을 따른다. 메인 최신 소식은 기존처럼 썸네일이 없으면 칸을 비우지 않고 글만 둔다.
- FAQ: 검색 위 문의 안내는 F-04 순서대로 두되 테두리 없는 한 줄(문구와 문의하기 링크)로 줄인다. 데스크톱·태블릿은 오른쪽 정렬, 520px 이하는 왼쪽 정렬이며 링크 높이 44px는 유지한다. 하단 문의 배너는 그대로다.
- 문의 완료: 성공 화면의 링크를 "FAQ로 돌아가기"에서 "홈으로"(/{lang})로 바꾼다. 새 문의 작성 버튼과 접수 불가 안내(키 누락 시)는 유지한다.
- 문의 접수 불가 안내(키 누락 시): 오류 안내(contact-notice, error-panel·error-ink)와 구분해 contact-unavailable로 표시한다. 두 상자는 같은 틀(여백 14px 18px, 왼쪽 3px 선)을 쓰고 색만 다르다. 오류 상자의 선은 error-ink다. panel 배경·왼쪽 3px violet 선·ink 글씨이며 첫 문장은 굵게, 메일 링크는 violet-strong 밑줄·높이 44px다. 문구는 바꾸지 않는다.

## 메인 상자 사진 히어로 (#81)

#81의 PL 결정이 #68의 투명 헤더·흰 제목·어두운 덮개보다 우선한다. 모든 공개 화면은 paper 바탕의 일반 머리말을 쓰며 메인 사진도 그 아래에서 시작한다. HeaderClient의 usePathname·메뉴 현재 위치·이동 시 닫기는 유지하고, data-overlay·전용 CSS와 사용처가 없어진 isHomePath는 제거한다. 푸터·FAQ의 ContactBanner는 유지하고 메인의 ContactBanner만 제거한다.

제공된 hero-box.webp(2880×1624, 61,166바이트)를 정적 import·fill·장식 alt·sizes100vw·eager/high로 표시한다. 원본 SHA-256은 `0a8d10a698f78d3dc07948a6f30f29deca0021dba8356a796b5e382f3b51aac4`다. PC는 cover/center, 400px 이하는 PR #82 검토 후 케이스가 보이도록 right center로 바꾸고, 그보다 넓은 모바일은 글자 뒤 로고 겹침을 피하도록 기존42% center를 유지한다. 덮개는 없으며 hero-window.webp는 전체 사용처 확인 후 삭제했다.

제목은 “일상생활부터 / 편안한 수면까지 / 슬리피가 함께합니다”의 세 줄이며 모두 ink다. PC landing-title은52px·500·1.28·-.045em이고 줄 사이8px를 둔다. 모바일은 기존45px(400px 이하41px)·420·1.25·-.065em을 유지하고 줄 사이 추가 간격은 없다. 설명은 copy-large와 기존 페이지 설명 행간1.65를 사용한다. `--color-home-hero-description: #3f3850`은 회색 사진 벽에서 muted보다 진한 설명을 위한 승인된 페이지 전용 색이다. 제품 보기 링크는 violet/white·radius-pill·ui-input(16px)·ui-medium·52px 높이로 표시하고 해당 언어의 product로 이동한다. 공통 버튼 컴포넌트에는 일반 내부 이동용 pill이 없어 메인에만 둔다. 초점은 기존 violet-strong이다.

PC 사진 높이는 `calc(clamp(640px, 100svh, 900px) - var(--header-height))`다. 1440×900에서 사진 높이는812px이며 기존 머리말의 아래 테두리1px는 일반 문서 흐름에 남는다. 1441px 이상은 `calc(clamp(640px, var(--public-vh) / min(1.7778, tan(atan2(var(--public-vw), 1440px))), 900px) - var(--header-height))`로 #68의 배율 보정을 유지하면서 머리말 높이를 뺀다. public.css zoom 식을 바꾸면 이 나누는 식도 함께 바꾼다. 모바일 높이 clamp(560px,100dvh,640px+header-height-small)와 문구 여백은 유지하되 사진이 일반 머리말 아래에 오도록 음수 여백을 제거한다. 모바일의 나머지 본문 배치는 바꾸지 않는다.

1440px 제목 시작은 x120/y255 부근으로 맞춘다. PC 일상 제목만 오른쪽51px로 옮기고 오른쪽 본문은 유지한다. 하루 사진 설명은 PC만 각 사진 가운데로 정렬한다. 대표의 직함·소개·연구 설명은 home.ts에 분리하고 이름 옆 CEO는 meta(13px)/muted다. 회사의 데이터·CeoSection은 바꾸지 않는다. 대표 아래 설명/링크 묶음만 PC에서18px 내린다. 제품 무대는 paper로 바꾸고 기존 문구 위치·간격은 유지한다. 최신 소식은 시안에 없지만 2026-11-15 추가 지시로 기존 구간·데이터·배치를 유지하고 배경만 paper로 바꾼다. 문구·색·링크·배경은 PL 결정이 캡처보다 우선하며, 캡처의 문의 배너와 제품 무대 위치 변경은 구현하지 않는다.

## 회사 소개·FAQ·뉴스룸 개선 (#77)

- 회사 "믿는 것": 뒤집기 카드를 없애고 번호(kicker)·제목(form-aside)·설명(copy-large, muted)을 처음부터 보이는 rule 테두리 카드로 둔다. 연혁 행은 월 단위 날짜(tabular-nums)가 들어가도록 최소 높이만 둔다. 대표 이력·영상 링크는 public-text-link에 ↗와 화면 읽기용 "(새 창)"을 붙인다.
- FAQ: 1024px 이상은 왼쪽 280px 칸(검색·문의 안내, 위에서 40px에 고정, 검색 밑줄 외 구분선 없음)과 오른쪽 목록 사이를 80px 띄운다. 좁은 화면은 한 칸이다. 질문 줄은 위아래 24px(760px 이하 20px), 펼침 표시는 오른쪽 끝 ui-glyph 크기 +/−이며 열린 질문은 violet이다. 기호는 화면 읽기 프로그램에 읽히지 않는다. 목록 위에 "질문 N개"를 micro로 둔다.
- 뉴스룸: 위 줄은 분류·연도 드롭다운(ink 1px 테두리, pill 둥글기, 최소 폭 160px)과 panel 배경 pill 검색창이며 아래에 ink 1px 선을 둔다. 520px 이하는 드롭다운 두 개가 한 줄, 검색창이 그 아래 한 줄이다. 카드는 panel 배경·stage 둥글기이며 위에 날짜(kicker, violet)·제목(news-title)·분류·출처(news-meta), 아래에 4:3 사진을 둔다. 링크가 있는 카드는 제목이 violet-strong으로 바뀐다. 사진이 없으면 분류별 아이콘(48px)을 둔다: 기업 소식은 rule 배경·violet-strong, 보도자료는 wave-back 배경·violet-strong, 공지사항은 paper 배경·rule 안쪽 선·ink다. 아이콘은 꾸밈이라 화면 읽기 프로그램에서 숨긴다.
- 문의하기: 문의 유형은 폼 맨 위의 둥근 버튼(라디오, rule 테두리·pill 둥글기, 선택 시 violet-strong 배경·white 글자)이며 520px 이하는 두 버튼이 한 줄을 나눠 쓴다. 칸 이름은 copy-large·600 굵기이고 필수 표시 `*`(violet)를 앞에 둔다. 입력칸은 높이 56px·안쪽 여백 15px 18px, 칸 사이 36px(520px 이하 28px)다. Turnstile은 가로형(flexible, 높이 약 65px)으로 바꿔 동의와 보내기 버튼 사이 빈 공간을 줄인다.
- 문의하기 카드: 왼쪽 안내는 panel 배경·stage 둥글기 카드에 이메일·주소를 아이콘(violet 선)과 함께 두고 지도는 media 둥글기다. 오른쪽 폼은 white 배경·rule 테두리·stage 둥글기 카드(여백 40px, 760px 이하 28px 20px)이며 입력칸은 media 둥글기, 보내기 버튼은 pill 둥글기·높이 56px(760px 이하 전체 폭)이다. 성공 상자도 같은 둥글기이고 답변 받을 이메일을 굵게 다시 보여 준다. 접수·보안 확인 실패 안내에는 회사 메일 링크를 둔다.

## 제품 페이지 갤러리 (#79)

2026-11-15 PL 사진 띠 명세가 앞선 큰 사진·미리보기 시안보다 우선한다. GallerySection은 서버 섹션과 aria-labelledby를 유지하고 h2#product-gallery-title은 sr-only다. 문구·features.photos는 그대로 두며 ProductGallery 하나만 클라이언트 컴포넌트다.

사진 네 장을 목록 순서대로 같은 높이의 한 줄에 배치한다. 앞 두 장은1:1, 뒤 두 장은3:2이며 contain으로 원본 전체를 보여 준다. 잘림·모서리·panel 바탕은 없다. 기존5:4 cover 액자에서 첫 사진이 잘리던 한계도 함께 제거한다.

| 폭          | 사진 높이               | 1:1 폭 / 3:2 폭 | 사진 간격 | 사진 아래 조작부 간격 |
| ----------- | ----------------------- | --------------- | --------- | --------------------- |
| 1440px 이상 | 520px                   | 520 / 780px     | 24px      | 32px                  |
| 768~1439px  | clamp(300px,36vw,520px) | 높이 / 높이×1.5 | 24px      | 32px                  |
| 767px 이하  | 260px                   | 260 / 390px     | 12px      | 20px                  |

PC 위아래 여백은120px, 모바일은 기존50/55px다. 섹션은 전체 폭이며 띠 안쪽 좌우 여백은 public-wrap 바깥 여백과 같다. 첫 사진은 콘텐츠 왼쪽 선, 마지막 사진은 끝에서 콘텐츠 오른쪽 선에 맞춘다. 같은 값을 양쪽 scroll-padding-inline에 써 마지막 가로 사진도 콘텐츠 오른쪽 선에 맞추고 각 사진에 scroll-snap-align:start를 적용한다. 띠만 overflow-x:auto이며 스크롤바를 숨기고 바깥 섹션이 페이지 가로 넘침을 막는다.

조작부는 public-wrap 안에 둔다. 진행 선은 rule1px·ink2px다. 진한 선의 길이는 보이는 폭/전체 스크롤 폭, 위치는 스크롤 비율×남은 선 길이로 계산한다. scroll 이벤트는 requestAnimationFrame으로 묶고 창 resize에서도 다시 계산하며 리스너와 예약 프레임을 정리한다. 진행 선은 aria-hidden 표시용이다.

PC 화살표는 진행 선 오른쪽24px 간격에44×44px 버튼 두 개로 배치한다. 바탕·테두리 없이 ink 꺾쇠24px·선1.5·둥근 끝을 쓴다. 이전 M15 5l-7 7 7 7, 다음 M9 5l7 7-7 7이며 버튼 이름은 이전 사진/다음 사진이다. 한 장 시작점씩 scrollTo하고 양 끝은 aria-disabled/rule이며 누르면 아무 일도 하지 않는다. disabled를 쓰면 그 버튼의 키보드 초점이 BODY로 빠지므로 쓰지 않는다. 비활성이 아닌 버튼의 hover·focus는 violet-strong이다. 포커스 테두리는 공통 규칙이다. 모바일은 화살표를 숨기고 선만 콘텐츠 폭 전체에 둔다.

띠는 모든 폭에서 tabindex0·role group·“제품 사진 4장, 좌우로 넘겨 볼 수 있습니다” 안내를 갖는다. 브라우저 기본 방향키·가로 스크롤·터치와 PC 화살표를 사용하며 마우스 드래그는 구현하지 않는다. CSS scroll-behavior:smooth를 사용하고 reduced-motion에서는 auto다. 화살표는 behavior를 강제하지 않아 CSS 설정을 따른다.

네 사진은 모두 eager이며 priority는 없다. 사진별 sizes는 모바일260/390px, 중간 폭300~520/450~780px, PC520/780px에 맞춘다. 미리보기·점·active/data-active·사진 숨김·모바일 matchMedia·IntersectionObserver는 사진 띠와 스크롤 기반 조작으로 교체해 제거했다.

- PC 생활 장면은 설명과 제목 아래끝을 맞추고 사진 설명을 가운데 정렬한다. 구성 제목과 숫자 네 칸도 PC에서 가운데 정렬하며 모바일은 기존 두 열/왼쪽 정렬을 유지한다. 구성 사진의 PC 위 여백은 제목 높이 +9px로 계산해 제목 위끝보다 43px 아래에 둔다. 숫자 간격은 시안 값의 y4131과 마지막 구성품 글자 아래끝 y4072.5에 맞춰 목록 아래 45px다. 상대 이동 지시의 “55px 올림”보다 이 원본 좌표를 따른다. 좌표는 product-page 내부 기준이다.
- 구성 숫자는 product.ts의 kit.metrics에 3 g·26 g·5V·1년으로 고정한다. 사양표의 긴 문장을 큰 숫자로 쓰면 운영 표시가 깨지므로 전체 사양표와 분리한다(D-54). 값이 바뀌면 문구 파일과 관리자 사양표를 함께 확인해야 한다. 전체 사양표의 읽기·구조·0건 숨김은 유지한다.

### #79 추가 검토 반영 (2026-11-15)

- 제품 히어로의 구매/출시 예정과 원리 보기 링크는 violet/white·pill 모양으로 표시한다. ui-button 활자·ui-selected 굵기·기존 size-button 높이를 쓰고 출시 예정의 disabled 동작은 유지한다. 제품 화면 안의 규칙이라 메인 구매 버튼은 바뀌지 않는다.
- PC 축약 사양 묶음은 제품 구성 제목과 같은 오른쪽 칸 폭을 쓰고 네 등분한다. 가로 gap을 없애 네 칸 중심 사이 간격을 동일하게 하며 각 칸의 값과 이름을 같은 중심축에 맞춘다. 값은 위쪽에서 같은 높이에 시작하고 모바일 두 열·왼쪽 정렬은 유지한다.

## 기술·회사 소개 외부 링크와 영상 (#83)

- ExternalLinks를 공통 UI로 옮기고 ExternalLink로 새 창·noopener noreferrer·숨긴 “(새 창)” 안내를 통일한다. 목록은 세로 배치·8px 간격, 교수 소개 링크는 글 끝에서28px 아래다. 링크 모양은 #88 공통 글자 링크(TextLink external)를 따른다.
- 연구·수면 사진은 직사각형 칸에서4.5% 확대한다. 원본 PNG 자체의 투명한 둥근 모서리(research 대각선19px·sleep14px)를 가리는 PL 결정이며, 직사각형 원본을 구하면 교체한다. 연구 사진은 제목 위 여백36px+반행간에 맞추고1023px 이하 적층에서는 이 여백을 없앤다. radius-research-photo는 사용처가 없어졌으며 삭제 여부 확인 전 보존한다.
- 임상연구 다음·지식재산권 이전 영상 구역: 위아래120px(760px 이하60px), 두 열·32px 간격·16:9 썸네일·직사각형(모서리 둥글림 없음, #93). 모바일은 한 열이다. 기존 patent-heading(44px), latest-title(20px), meta(13px) 토큰을 재사용한다. 종류는 ui-medium 굵기를 더한다. 카드 전체가 외부 링크이며 iframe은 없다.
- YouTube 대표 이미지(sddefault.jpg, 640×480)를 로컬에 저장한다. 강의 링크의1094초 시작 시각을 유지한다. 회사 쉬운 기술의 중복 영상 링크는 삭제한다.

#83 검토 반영: 영상 재생 장식은72px 원형 paper 배경(90% 불투명)과 ink색 SVG 삼각형이며 aria-hidden이다. 두 영상 모두 maxresdefault가404여서 sddefault를 사용한다.

## 뉴스룸 목록 (#86, 이전 #54·#77 목록 규칙보다 우선)

히어로·홈 뉴스는 유지한다. 검색·분류·연도 줄을 삭제하고 전체 개수 다음40px에 큰 기사, 그 아래96px에 카드 격자, 마지막 줄 아래72px에 페이지 번호를 둔다. 최신 주요 기사를 큰 기사로 고르고 없으면 최신 기사를 쓴다. 첫 페이지는 큰 기사1+카드9, 이후 카드9개씩이다. ?page=N#news 링크로 요청마다 계산하며 getNewsList 캐시를 유지한다.

큰 기사: PC 사진607×379(16:10), 글자 칸 사이56px·글자 위32px. 출처·날짜 간격10px, 제목 위16px, 요약 위18px(최대3줄·없으면 생략), "기사 원문 보기"는 위28px에 공통 글자 링크 모양(#88)으로 둔다. 카드3열·가로28px/세로56px, 사진16:9·출처 위24px·제목 위10px(최대2줄). 전체 원문 링크 하나이며 원문 없으면 article과 버튼 생략이다.

사진과 대체 그림은 직사각형이다. 이미지 cover·center, 실패/누락에는 panel 배경과 header-logo.svg 마스크(폭28%, violet·불투명도.45)를 쓴다. 홈 NewsImage는 변경하지 않는다. 원문 대표 사진3장은 원본 그대로 저장하며 DB 썸네일을 우선한다. 값이 비어 있을 때만 세 자사 기사 원문 주소에 뉴스룸 전용 대표 사진을 연결한다(#86 검토 반영). 홈은 유지한다.

페이지 번호는44×44px 조작 영역·6px 간격, 현재 panel/violet-strong·aria-current, 나머지 muted, hover/focus ink, 양끝 비활성 rule이다. 768~1100px 큰 기사는 두 칸(사진50%, 간격을 뺀 동등 두 칸), 카드2열. 767px 이하는 큰 기사 세로·24px 제목, 카드1열·세로40px다.

### 뉴스룸 전용 활자

| 토큰                   | 크기 / 굵기 / 행간 / 자간                  |
| ---------------------- | ------------------------------------------ |
| newsroom-feature-title | 30px / 600 / 1.4 / -.035em, 767px 이하24px |
| newsroom-card-title    | 18.5px / 600 / 1.45 / -.02em               |
| newsroom-source        | 13px / 600 / 1.6 / 0                       |
| newsroom-date          | 13px / 400 / 1.6 / 0                       |
| newsroom-summary       | 16px / 400 / 1.8 / 0                       |
| newsroom-pagination    | 14px / 600 / 1.4 / 0                       |

기존 news-title·news-meta·kicker 값은 유지한다. 요약과 일치하는 기존 토큰이 없어 전용으로 추가했다. 큰 기사 "기사 원문 보기"는 #88부터 공통 글자 링크 모양이라 newsroom-button 토큰을 지웠다.

## 글자 링크 공통 모양 (#88, 이전 글자 링크 규칙보다 우선)

밑줄과 ↗가 붙은 글자 링크는 모두 `TextLink`로 그린다. 페이지마다 간격·폭·색을 덮어쓰지 않고, margin·flex-shrink 같은 바깥 배치만 덮어쓴다(이전 홈 761px 이상 규칙·FAQ 8px 간격·external-text-link 삭제).

- 색: 글자·화살표·밑줄 모두 violet-strong, 마우스를 올리면 violet. 전환은 동작 줄이기 설정을 따른다.
- 화살표: 글자 바로 옆 4px, `aria-hidden`.
- 밑줄: 글자+화살표 묶음(`public-text-link-body`) 폭만큼, 아래 4px 틈 뒤 1px currentColor. 묶음 줄 높이는 leading-text-link-body(1.2)로 줄여 반행간이 틈에 더해지지 않게 한다. 링크 상자는 내용 폭(fit-content)이고 `min-height: size-touch`(44px)를 지키며 묶음을 세로 가운데에 둔다. 포커스 표시는 링크 상자 전체를 감싼다.
- 글자: text-link(15px/400/1.5). `size="compact"`는 compact-link(13px)로 메인 대표 이야기에 쓴다.
- `external`: 새 창·noopener noreferrer·숨긴 "(새 창)" 안내(ExternalLink 동작). 회사 소개 대표·기술 임상 외부 링크가 쓴다.
- 쓰는 곳: 메인(하루 장면·대표 이야기·제품·최근 소식·FAQ 더 보기), 회사 소개(쉬운 기술·대표 외부 링크), 기술 임상, FAQ 문의하기, 문의 배너, 문의 완료 "홈으로". 쉬운 기술 링크와 "홈으로"에도 ↗를 붙였다.
- 뉴스룸 큰 기사의 "기사 원문 보기"는 상자 전체가 원문 링크라 링크를 겹치지 않고 `TextLinkBody`로 모양만 쓴다. 큰 기사에 마우스를 올리면 violet으로 바뀐다.
- 범위 밖: 머리말 문의하기 버튼, 꼬리말 문의 링크, 뉴스 카드·최근 소식의 ↗, 기술 영상 YouTube 링크.

## 회사 소개 정리 (#90, 이전 회사 본문 배치보다 우선)

검색 사용자가 회사 기본 정보를 바로 확인하도록 대표 아래 회사 소개 문장과 dl 정보표8행을 추가했다. 순서는 히어로→대표→회사 소개→지향하는 것→쉬운 기술→걸음→문의다. 회사 문구는 company.ts에만 둔다. 대표 사진·교수 링크·연혁 항목·히어로 파동은 유지한다. CEO는 이름 오른쪽 baseline·12px 간격이다.

1024px 이상 본문 구간 사이200px, 대표 끝→구분선112px·선 아래→회사 표지160px다. 768~1023px은 space-section, 767px 이하는 space-section-small을 쓴다. 회사 소개는 public-wrap12칸 중 글1~5·표7~12,24px gap이고 표는 라벨140px·행60px·ink 첫 선/rule 아래 선이다. 1023px 이하는48px 간격으로 적층,767px 이하는 라벨96px·행 안쪽 위아래16px로 길이에 맞게 늘어난다.

새 토큰 없이 기존 활자를 쓴다. 회사 문장 제목은 stage-heading38px/450/1.5(시안38px Regular/1.4와 굵기·행간 차이), 모바일 form-aside다. 다른 구간 제목은 md:detail-heading으로1440px 약47.52px(시안36px와 차이)다.17px 본문은 study-title(1.7행간),15px 표지·표 라벨은 study-state+ui-medium, 지향 카드 제목은 form-aside28px(시안26px)다. 연혁 날짜 copy16px+ui-medium, 내용 copy-large18px(시안19px)이며 토큰의 반응형 값도 유지한다. 이 차이는 새 토큰 금지·기존 토큰 유지 원칙에 따른다.

지향하는 것:3열·48px gap, 제목 아래56px에 ink선,선 아래32px에 카드제목·12px 아래 설명. 모바일1열·40px gap. 쉬운 기술은 글5/도식7 비율·도식 위27px,귀88px paper/violet선·중앙180px panel·가로 rule2px·중앙 아래40px 설명이다.1023px 이하는 글→도식48px,767px 이하는 기존 세로 도식이다. 원·선 등장과 중앙1회 신호, 동작 줄이기 규칙을 유지한다.

걸음은768px 이상 중앙1px선·15px점·양옆48px·80px 행 간격으로 날짜와 내용을 교차 배치한다. 마지막 배열 항목만 violet-strong 점과 글자로 강조한다. 모바일은 왼쪽선, 오른쪽 날짜→내용 순서다. 선 그리기·순차 등장과 noscript 처리를 유지한다. 문의 배치는 유지한다. 대표님 확인 필요: 회사 소개 제목·설명, 표8행, 지향하는 것3칸 문구.

## 모바일 반응형 정리 (#96, 520px 이하에서 이전 값보다 우선)

375px 운영 화면(2026-11-16)에서 제목이 31~41px라 한 화면이 제목으로 찼고, PC 배치를 세로로 쌓기만 한 곳이 어색했다. 768px 이상 화면은 바꾸지 않았다(PC 1440 일곱 화면 높이가 수정 전과 같음).

| 단계                  | 크기    | 토큰                                                                                                   |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| 첫 화면 제목          | 32px    | `landing-title`                                                                                        |
| 하위 화면 첫머리 제목 | 28px    | `page-hero-title`                                                                                      |
| 섹션 제목             | 26px    | `story`·`day`·`stage`·`latest`·`detail`·`kit`·`patent-heading`                                         |
| 작은 제목             | 22px    | `research-heading`·`cta-heading`·`form-aside`·`feature-heading`·`spec-value`                           |
| 인용·이름·카드 제목   | 18~21px | `founder-quote`·`founder-name`·`form-title`·`newsroom-feature-title`·`context-heading`·`guide-caption` |
| 큰 숫자               | 36px    | `metric-number`·`patent-number`                                                                        |

- 하위 화면 첫머리: 물결을 0.6배(540×180)로 줄여 높이를 약 110px 줄였다(`PageHero.css`).
- 꼬리말: 메뉴를 로고 아래 줄로 내리고 13px로 키웠다.
- 메인: 사진 2장을 같은 4:5 칸에 맞춰 엇갈림을 없앴고, 대표 인용문을 왼쪽 정렬했다.
- 회사 소개: 대표 사진 최대 240px, 정보 표 이름 칸 72px, 원리 그림을 한 줄 배치, 걸음 제목 왼쪽 정렬.
- 기술: 중추신경계 억제 소개를 왼쪽 정렬, 눈금 영어 보조 글자 9px → 10px.
- 제품: 상세 정보 표 이름 칸 112px → 96px(640px 미만).
- 뉴스룸: 사진 없는 소식의 빈 "SLEEPY" 상자를 숨긴다.
- FAQ: 목록 위 문의 안내를 숨긴다. 같은 안내가 맨 아래 문의 배너에 있다.
- 문의하기: 작성 칸을 안내 카드보다 먼저 보이고(`order`), 작성 칸 테두리 카드를 걷어 냈다. Tab 순서는 DOM 그대로라 안내 카드의 링크 2개가 먼저다.

### 모바일 구조 정리 (#96 2차, 2026-11-17)

- 머리말: 520px 이하에서 높이 56px, "메뉴" 글자 상자 대신 ☰/✕ 아이콘. 메뉴를 열면 머리말 아래 화면 전체 판에 메뉴 5개(19px)와 문의하기 알약 버튼을 놓는다.
- 옆으로 넘기는 카드(`mobile-swipe`, `public.css`): 제품 쓰임새 4장·사용법 3단계, 기술 영상 2개. 카드 폭 82%라 다음 카드가 보인다.
- 뉴스룸: 주요 소식 아래 목록을 짧은 줄(왼쪽 글, 오른쪽 104px 4:3 사진)로 바꿨다.
- 제품 전체 사양: 처음 380px만 보이고 "전체 사양 보기"로 펼친다(`SpecsToggle`). PC는 그대로 다 보인다.
- 정렬: 문의 배너는 왼쪽 정렬. 하위 화면 첫머리는 가운데 정렬로 둔다(아래 3차).
- 1440 일곱 화면 높이는 이번에도 수정 전과 같다.

### 첫머리 가운데 정렬과 물결 겹침 (#96 3차, 2026-11-17 PL 요청)

- 휴대폰 첫머리 제목·설명은 가운데 정렬. 문장이 두 개 이상이면 문장마다 줄을 나눈다(`PageHero`의 `Sentences`, 마침표·물음표·느낌표 기준).
- 물결은 PC처럼 글자 뒤에 겹친다. 720×240, 세로 위치 16px, 첫머리 최소 높이 264px.

### 제품 아래 사진 띠와 출시 예정 버튼 (#96 4차, 2026-11-17 PL 요청)

- 쓰임새 4장·사용법 3단계도 휴대폰에서 갤러리와 같은 진행 선(사진 아래 20px)을 단다(`ProductPhotoStrip`). PC는 3칸 격자 그대로.
- 휴대폰 히어로 "출시 예정"·알고리즘 "원리 보기" 버튼: 높이 49px → 44px, 글자 14px → 13px, 좌우 여백 22px.
- 휴대폰 사진 띠는 `overflow-y: hidden`. 화면 밖 카드가 등장 효과로 16px 아래에 대기해 띠가 세로로 넘쳤고, 사진을 잡고 위아래로 밀면 페이지 대신 띠만 흔들렸다.

### 데스크톱 머리말과 영어 화면 (#96, 2026-11-17 PL 요청)

- 메뉴 사이: 1101px 이상 30px → 48px, 901~1100px 20px → 28px, 761~900px 20px 유지(761px 영어 메뉴가 들어가는 최대값).
- "문의하기" 왼쪽에 언어 선택: 지구본(18px, muted) + KOR/ENG(13px, 600). 누르면 흰 목록(테두리 rule, 6px 둥글기, 그림자)에 한국어·English, 현재 언어는 violet-strong 굵게. 휴대폰(760px 이하)에는 아직 없다.
- 언어는 주소 맨 앞(`/ko`, `/en`)으로 나눈다. 고르면 보던 화면의 다른 언어 주소로 간다.
- 문구는 `src/content/{ko,en}/`에 같은 모양으로 둔다. 화면 틀·공통 안내는 `ui.ts`. 영어 파일은 한국어 파일의 타입을 따라 빠진 항목이 있으면 빌드가 실패한다.
- FAQ·제품 사양·뉴스 기사는 DB에 영어 칸이 없어 영어 화면에서도 한국어로 보인다.
- 영어가 길어져 바꾼 곳: 회사 정보 표 이름 칸 휴대폰 72px → 108px(`:lang(en)`), 기술 스펙트럼의 보조 영어 표기 숨김, 한국어용 강제 줄바꿈을 뺀 문장(기술 설명·특허·사용법 안내), 짧게 줄인 이름(Designs, Warranty, Propofol needed for induction).
