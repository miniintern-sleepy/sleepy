# 디자인 시스템

> 원본: `src/styles/tokens.css`와 이 문서. #54 사용자 승인(2026-11-07).

## 기준과 적용 범위

- A는 이 저장소의 `ff04e9235ce1c6d90f9b2a4dda4927b589f51cf9` 화면이다.
- B는 [정적 시안 670d9a3](https://github.com/kohyunseok518/sleepy/tree/670d9a3cc0ece144dcae6ece24d9be83a7b7a4a5)의 `docs/DESIGN.md`, `public/*.html`, `public/styles/`, `public/scripts/waves.js`, 실제 참조 자산이다. archive는 기준에서 제외한다.
- B CSS는 HTML의 import 순서·선택자 우선순위·반응형 최종 규칙으로 판단한다. foundation의 초기 값보다 theme·dimension·페이지 선택자의 최종 활성 값이 우선한다.
- 메인은 B 본문 배치·문구를 따르되 첫 히어로는 #68의 전면 사진·메인 주소 전용 투명 헤더를 쓴다(D-50). 회사·기술·제품·뉴스룸·FAQ·문의의 히어로는 #60·#61의 PageHero를 따른다. 그 아래 회사 본문은 A 구간 순서·배치, 나머지 공개 본문은 B 배치·문구를 유지한다.
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

| 새 이름                  | 값                                                                                 | B의 근거 / 용도       |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------- |
| `--gradient-science`     | `linear-gradient(90deg, panel, color-mix(in srgb, violet 42%, panel) 45%, violet)` | B 기술 상태 스펙트럼  |
| `--color-wave-back`      | `color-mix(in srgb, violet 18%, panel)`                                            | B 기술 막대의 옅은 층 |
| `--color-algorithm-glow` | `color-mix(in srgb, violet 20%, transparent)`                                      | B 제품 알고리즘 장식  |

기술 gradient-science는 B components.css, wave-back·algorithm-glow는 details.css에서 온다. 표의 panel/violet는 같은 이름의 색 변수를 뜻한다. #61에서 회사 사진 덮개·제품 히어로 전용 색과 그림자는 사용처가 없어 제거했다.

### 폭·간격

| 새 이름                                     | 값               | 근거                   |
| ------------------------------------------- | ---------------- | ---------------------- |
| `--container-hero`                          | `1160px`         | B 메인 첫 화면 내부 폭 |
| `--space-founder` / `--space-founder-small` | `125px` / `80px` | B 메인 대표 소개 구간  |

### 활자

| 새 이름            | 값·반응형                                                              | B 근거 / 대상                              |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| `landing-title`    | `clamp(52px,5.6vw,80px) / 420 / 1.22 / -.065em`; S 45px·1.25, XXS 41px | 메인 hero (`home.css`, `dimension.css`)    |
| `story-heading`    | `43px / 450 / 1.5 / -.045em`; S 38px, XS 34px                          | 메인 생활 이야기                           |
| `day-heading`      | `33px / 450 / 1.6 / -.045em`; S 35px                                   | 메인 세 장면 제목 (`dimension.css`)        |
| `founder-quote`    | `clamp(28px,3.5vw,50px) / 400 / 1.7 / -.052em`; XS 27px·1.75           | 메인 대표 인용문                           |
| `founder-name`     | `28px / 450 / 1.5 / -.045em`; S 25px, XS 23px                          | 메인 대표 이름                             |
| `context-heading`  | `22px / 450 / 1.65 / -.045em`                                          | 메인 연구 소개                             |
| `stage-heading`    | `38px / 450 / 1.5 / -.045em`; S 34px, XS 32px                          | 메인 제품 소개                             |
| `latest-heading`   | `38px / 450 / 1.5 / -.045em`; S 31px                                   | 메인 소식 구간                             |
| `latest-title`     | `20px / 500 / 1.55 / -.045em`; S 17px                                  | 메인 뉴스 항목                             |
| `science-subtitle` | `24px / 400 / 1.9`; S 20px, XS 18px                                    | 회사 본문 보조 활자                        |
| `science-intro`    | `20px / 400 / 1.9`; L 18px, S 16px, XS 15px                            | 회사 본문 설명                             |
| `device-word`      | `18px / 400 / 1.9`; S 16px                                             | 기술 Sleeby                                |
| `science-note`     | `13px / 400 / 1.8`; S 12px                                             | 기술 각주                                  |
| `metric-label`     | `18px / 500 / 1.5`; S 14px                                             | 기술 임상 지표 이름                        |
| `research-heading` | `30px / 450 / 1.65 / -.045em`; L 26px, S 26px, XS 24px                 | 기술 연구 제목                             |
| `metric-number`    | `64px / 450 / 1.3 / -.04em`; L 54px, S 50px, XS 45px                   | 기술 임상 수치                             |
| `study-title`      | `17px / 400 / 1.7`; S 15px, XS 14px                                    | 연구 목록                                  |
| `study-state`      | `15px / 400 / normal`; S 13px                                          | 연구·등록 상태                             |
| `patent-heading`   | `44px / 450 / 1.4 / -.045em`; L 40px, S 34px, XS 29px                  | 지식재산 제목                              |
| `patent-number`    | `62px / 450 / 1.3 / -.04em`; S 48px, XS 51px                           | 지식재산 수치. B의 비단조 반응형 값도 유지 |
| `patent-item`      | `21px / 400 / 1.65`; S 18px, XS 16px                                   | 특허 목록                                  |
| `patent-key`       | `15px / 400 / normal`; S 13px, XS 14px                                 | 지식재산 항목명                            |
| `patent-note`      | `12px / 400 / 1.8`; S 11px, XS 12px                                    | 지식재산 각주                              |
| `feature-heading`  | `32px / 450 / 1.4 / -.045em`; L 27px, M 25px, S 24px, XS 25px          | 제품 특징 소제목                           |
| `scene-caption`    | `18px / 400 / 1.6`; S 15px, XS 16px                                    | 제품 생활 장면                             |
| `guide-caption`    | `25px / 400 / 1.55`; M 20px, XS 22px                                   | 제품 사용 순서                             |
| `guide-heading`    | `22px / 450 / 1.65 / -.045em`; M 19px, S 18px, XS 19px                 | 제품 사용 안내                             |
| `kit-heading`      | `40px / 450 / 1.35 / -.045em`; M 34px, S 31px                          | 제품 구성 제목                             |
| `kit-item`         | `20px / 400 / 1.6`; M 17px, XS 18px                                    | 제품 구성품                                |
| `news-title`       | `21px / 500 / 1.55 / -.045em`; S 16px                                  | 뉴스룸 행 제목                             |
| `news-meta`        | `12px / 400 / normal / .02em`; XS 11px                                 | 뉴스 날짜·언론사                           |
| `faq-question`     | `18px / 500 / 1.7`; S 16px                                             | FAQ summary                                |
| `faq-answer`       | `16px / 400 / 1.9`; S 15px                                             | FAQ 답변                                   |
| `filter`           | `16px / 400 / normal`; XS 14px                                         | B 뉴스 분류. 선택 시 동일 크기·600 굵기    |

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

| 화면 | 기준·예외                                                                                                                                                                                                                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 메인 | 전면 사진 hero → 생활 이야기 → 세 장면 → 대표 소개·연구 이야기 → 제품 소개 → DB 최신 소식 2건 → 문의 배너. 공개 기사 0건이면 소식 구간 전체를 숨긴다. 제품 소개의 구매하러 가기/출시 예정은 F-06 유지에 따른 B와의 차이다.                     |
| 회사 | 공통 PageHero → 대표 → 믿는 것 → 쉬운 기술 → 연혁 → 문의의 순서·배치를 유지한다. B의 추가 사진 쌍 구간은 넣지 않는다.                                                                                                                          |
| 기술 | 공통 PageHero → 중추신경계·상태 스펙트럼 → B 세 원리·임상연구·지식재산. 승인된 본문·자료·수치는 유지한다.                                                                                                                                      |
| 제품 | 공통 PageHero → B 특징·생활 장면·알고리즘·사용 방법·구성. 구매 버튼·사용 방법 링크는 후속 제품 구성에서 재배치한다. 기존 사양 조건부 표시만 유지하고 값이 없으면 숨긴다. 테이블 구조·사양 값·새 사양 구간을 추가하지 않는다.                   |
| 뉴스 | DB 기사만 검색·분류해 B 행 목록으로 표시한다. 주요 기사 특별 배치·예시 기사·고정 공지는 제거한다. 원문은 새 탭으로 직접 연결하고 /newsroom/[id]는 삭제한다. 날짜는 전부 YYYY.MM.DD이며 임시 1일 값도 그대로 표시한다. 날짜 정밀도 컬럼은 없다. |
| FAQ  | B 문의 안내·검색·native details·하단 문의 배너. 질문·답변은 DB에서만 읽으며 여러 개 동시 펼침을 허용한다.                                                                                                                                      |
| 문의 | B 배치 안에 실제 제출·Turnstile·동의·대기·성공/오류를 유지한다. 처리 순서·중복 방지·담당자 알림은 바꾸지 않는다. 지도 저작자 표시는 A/B 공통으로 유지한다.                                                                                     |

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

관리자의 ‘주요 기사’ 체크 기능은 유지한다. **현재 공개 배치에 영향 없음.** KECI 출처 표기는 DB 데이터이므로 사용자가 직접 수정한다.

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

header 전체 폭에 장식 CSS 배경을 놓고 public-wrap 안의 h1·p는 가운데 정렬한다. 개행을 보존하며 children이 있을 때만 추가 자리를 만든다. 위 여백 80px/32px, 제목-설명 24px/14px다. 회사 설명의 개행은 PC에서는 공백으로, 760px 이하에서만 줄바꿈으로 표시한다. 나머지 제목·설명 개행은 모든 폭에서 보존한다. 사용처가 없어진 page-title과 기존 회사·제품 히어로 전용 활자는 제거했다.

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

중추신경계 억제는 h2/detail-heading, 영문 부제와 설명은 copy-large다. 배경 그라데이션·최소 높이를 제거하고 public-wrap으로 아래 원리와 좌우를 맞춘다. PC 위 여백은 space-section-small, 설명 위22px, 스펙트럼 위64px(760px 이하40px, 520px 이하32px)다. 라벨20/18/16px, 제품명18/16px로 줄이며 사진 묶음도 기존의 0.7배(PC 본체154px·케이스210px, 모바일133px·182px)다. 스펙트럼 등장·막대 확장 모션은 유지한다. 회사·제품 히어로의 사진·숫자·오브젝트·구매/구간 링크와 등장 모션은 제거한다. 회사 facts와 제품 버튼 문구는 후속 페이지 구성에서 다시 쓸 데이터로 보존한다.

대비 검증의 한계: #61 회사 PC 설명 뒤 파동은 1·2배 밀도 SVG 합성에서 최저 5.36·4.58:1, 3배 밀도에서 일부 픽셀 4.47:1이다. 2026-11-09 사용자 확인으로 옅은 배경 보완을 넣지 않고 시안을 유지한다. 4.5:1을 모든 밀도에서 충족했다고 간주하지 않는다.

## 넓은 화면 비례 확대 (#62, D-49)

1440px 이하는 기존 배율1이다. 1441px부터 공개 레이아웃의 public-body 직계 자식에 `zoom: min(1.7778, tan(atan2(var(--public-vw), 1440px)))`를 적용한다. 2560px에서 약1.7778이고 그 위에서는 고정한다. body 자체는 확대하지 않아 min-h-dvh와 짧은 본문 푸터가 이중 확대되지 않는다. 헤더는 일반 문서 흐름을 유지한다. 관리자에는 식별자와 확대를 적용하지 않는다.

Safari 대응: WebKit 26.6은 zoom 식 안의 100vw를 계산하지 못해 배율이 1이 되지만 CSS.supports는 true를 돌려준다. 그래서 `@property --public-vw`(`<length>`)를 등록하고 public-body에서 100vw로 확정한 길이를 zoom 식에 넘긴다. WebKit의 zoom은 rem으로 지정한 grid 칸과 gap에 배율을 곱하지 않으므로, 넓은 화면 분기에서 `--spacing: 4px`로 두고 공개 화면의 grid 칸 임의값은 px로 쓴다. 메인 캔버스는 zoom만 바뀌면 CSS 폭이 그대로라 ResizeObserver가 울리지 않으므로 창 resize에서도 버퍼를 다시 맞춘다.

zoom 선언 전체를 검사하는 @supports 안에서만 확대와 토큰 고정을 함께 적용한다. 지원하지 않으면 두 규칙 모두 적용하지 않아 기존 레이아웃을 유지한다. tokens.css의 같은 분기에서 public-body에 gutter79.92px, page-side147.5px, page-width1145px, detail-heading2.97rem을 둔다. :root 공통값을 덮지 않는다.

1440px에서 page-hero-title은56px(4.2vw=60.48px), landing-title은80px(5.6vw=80.64px), founder-quote는50px(3.5vw=50.4px)으로 이미 clamp 최댓값이다. 추가 고정을 하지 않는다. 제품의1700px 전용 궤도 확대는 제거한다. 메인 캔버스와 선 두께 보정은 #68에서 제거했다. 확대 규칙은 전면 사진 히어로에도 적용한다.

고정 이미지 sizes에는1441px 이상 vw 분기를 추가한다. 대표37.78vw, 특허38.89vw, 메인 대표15.97vw, 뉴스10.42vw, 기술 본체10.7vw·케이스14.6vw다. 제품 구성은768px 이상50vw/나머지100vw로 둔다. 원본 교체·업스케일은 하지 않는다.

2026-11-09 사용자 확인: 배율 상한 1.7778을 유지하고, 3440px에서 일부 히어로 파동 끝이 드러나는 것을 허용된 한계로 기록한다. 파동만 별도로 확대하거나 반복하지 않는다.

## 뉴스룸·문의·FAQ 화면 개선 (#66)

- 뉴스룸 목록: 썸네일이 없는 기사는 썸네일 칸(150px, 모바일 110·82px, panel 배경)에 머리글 로고를 폭 48%·불투명도 .35로 흐리게 놓아 모든 행의 칸을 맞춘다. 공통 NewsItem의 logoFallback 옵션으로 켜며 뉴스룸에서만 쓴다. 메인 최신 소식은 기존처럼 썸네일이 없으면 칸을 비우지 않고 글만 둔다. 로고는 꾸밈 이미지라 alt=""다.
- FAQ: 검색 위 문의 안내는 F-04 순서대로 두되 테두리 없는 한 줄(문구와 문의하기 링크)로 줄인다. 데스크톱·태블릿은 오른쪽 정렬, 520px 이하는 왼쪽 정렬이며 링크 높이 44px는 유지한다. 하단 문의 배너는 그대로다.
- 문의 완료: 성공 화면의 링크를 "FAQ로 돌아가기"에서 "홈으로"(/{lang})로 바꾼다. 새 문의 작성 버튼과 접수 불가 안내(키 누락 시)는 유지한다.
- 문의 접수 불가 안내(키 누락 시): 오류 안내(contact-notice, error-panel·error-ink)와 구분해 contact-unavailable로 표시한다. 두 상자는 같은 틀(여백 14px 18px, 왼쪽 3px 선)을 쓰고 색만 다르다. 오류 상자의 선은 error-ink다. panel 배경·왼쪽 3px violet 선·ink 글씨이며 첫 문장은 굵게, 메일 링크는 violet-strong 밑줄·높이 44px다. 문구는 바꾸지 않는다.

## 메인 전면 사진과 투명 헤더 (#68, D-50)

메인 주소가 언어 루트와 정확히 일치할 때만 site-header에 data-overlay를 붙인다. usePathname은 HeaderClient 한곳에서 읽어 껍데기와 Navigation에 전달한다. Suspense fallback은 일반 헤더다. Cache Components가 이전 페이지를 display:none으로 보존하므로 body:has(.home-hero)를 쓰지 않는다. 헤더는 기존 relative다.

사진은 로컬 hero-window.webp 정적 import·fill·장식 alt·sizes100vw·eager/high로 표시한다. 제목은 PC에서도 두 줄이며 글자와 링크는 paper다. 사진 위치는 PC center58%, 모바일42% center다. 왼쪽 덮개는 ink76%(20%까지)→투명62%, 상단은 ink86%→투명30%다. 모바일 왼쪽 덮개는 아래 방향 ink78%(30%까지)→투명72%로 바꾼다. 대비 미달이 있으면 농도만 보완한다.

PC 높이는 clamp(640px,100svh,900px), 모바일은 clamp(560px,100dvh,640px+header-height-small)이며 헤더+테두리1px만큼 음수 여백을 준다. 1441px 이상에서는 body에서 길이로 확정한 --public-vh를 public.css와 같은 배율 식으로 나눠 창 높이를 채운다. --public-vh는100svh이며 WebKit의 zoom 안 화면 단위 계산 문제(D-49)를 피하도록 상속하는 <length>로 등록한다. zoom 식을 바꾸면 높이의 나누는 식도 함께 바꾼다. 640px 최소·900px 상한으로 낮거나 세로가 긴 창의 구성을 보호하고 모바일 상한은 유지한다(2026-11-10 PL 결정). 사진 영역과 투명 헤더의 focus outline은 paper다. 모바일 밝은 메뉴판 링크는 ink다. 메인 자동 파동은 제거하며 카테고리 SVG와 생성 스크립트는 유지한다.

#68 대비 확인에서 문의하기 버튼 뒤 밝은 배경이1920·2560px에서4.5:1에 못 미쳐 상단 덮개78%→86%로 보완했다. 큰 제목의 최저 대비 여유도 확보하도록 PC 왼쪽 덮개72%→76%로 보완했다. 위치·그라데이션 범위는 그대로다. 사진 위 초점은 paper이며 밝은 모바일 메뉴판 안 링크만 기존 violet-strong 초점을 유지한다.

PC 확대 구간의 실제 높이 식은 `clamp(640px, calc(var(--public-vh) / min(1.7778, tan(atan2(var(--public-vw), 1440px)))), 900px)`다.
