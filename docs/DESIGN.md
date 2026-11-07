# 디자인 시스템

> 원본: `src/styles/tokens.css`와 이 문서. #54 사용자 승인(2026-11-07).

## 기준과 적용 범위

- A는 이 저장소의 `ff04e9235ce1c6d90f9b2a4dda4927b589f51cf9` 화면이다.
- B는 [정적 시안 670d9a3](https://github.com/kohyunseok518/sleepy/tree/670d9a3cc0ece144dcae6ece24d9be83a7b7a4a5)의 `docs/DESIGN.md`, `public/*.html`, `public/styles/`, `public/scripts/waves.js`, 실제 참조 자산이다. archive는 기준에서 제외한다.
- B CSS는 HTML의 import 순서·선택자 우선순위·반응형 최종 규칙으로 판단한다. foundation의 초기 값보다 theme·dimension·페이지 선택자의 최종 활성 값이 우선한다.
- 메인·기술·제품·뉴스룸·FAQ·문의는 B 배치·문구를 따른다. 회사 소개는 A 구간 순서·배치를 유지하고 새 색·활자·간격을 적용한다.
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
| `--container-admin`                                    | `1024px`                                                 | B에 없음. A 관리자 `max-w-5xl` 폭 유지용                                    |
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
| `page-title`     | `clamp(36px,4.2vw,56px) / 450 / 1.4 / -.045em`                   | 공통 페이지 제목                                           |
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

| 새 이름                  | 값                                                                                 | B의 근거 / 용도                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `--color-halftone`       | `#a78acb`                                                                          | `heroes.css .sleeby-halftone`의 제품 보조색. 장식용이며 본문색으로 사용하지 않음     |
| `--color-wordmark-faint` | `#7754ab03`                                                                        | B 제품 배경의 흐린 워드마크. 장식만 해당                                             |
| `--shadow-object`        | `0 18px 15px #4d336a16`                                                            | B 제품 오브젝트 그림자. 색 리터럴은 이 토큰 안에만 둠                                |
| `--gradient-science`     | `linear-gradient(90deg, panel, color-mix(in srgb, violet 42%, panel) 45%, violet)` | B 기술 상태 스펙트럼                                                                 |
| `--color-wave-back`      | `color-mix(in srgb, violet 18%, panel)`                                            | B 기술 막대의 옅은 층                                                                |
| `--color-algorithm-glow` | `color-mix(in srgb, violet 20%, transparent)`                                      | B 제품 알고리즘 장식                                                                 |
| `--color-photo-scrim`    | `color-mix(in srgb, ink 70%, transparent)`                                         | A 회사 소개 사진 위 글자 유지용 파생 토큰. 최종 사진 대비 검증 후 필요하면 농도 조정 |

제품 halftone·워드마크·그림자는 heroes.css, 기술 gradient-science는 components.css, wave-back·algorithm-glow는 details.css에서 온다. photo-scrim은 A 회사 사진 위 AA 대비를 위한 파생 값이며 본문에는 흰색 전체 불투명도로 쓴다. 표의 panel/violet는 같은 이름의 색 변수를 뜻한다.

### 폭·간격

| 새 이름                                     | 값               | 근거                   |
| ------------------------------------------- | ---------------- | ---------------------- |
| `--container-hero`                          | `1160px`         | B 메인 첫 화면 내부 폭 |
| `--space-founder` / `--space-founder-small` | `125px` / `80px` | B 메인 대표 소개 구간  |

### 활자

| 새 이름               | 값·반응형                                                              | B 근거 / 대상                              |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| `landing-title`       | `clamp(52px,5.6vw,80px) / 420 / 1.22 / -.065em`; S 45px·1.25, XXS 41px | 메인 hero (`home.css`, `dimension.css`)    |
| `story-heading`       | `43px / 450 / 1.5 / -.045em`; S 38px, XS 34px                          | 메인 생활 이야기                           |
| `day-heading`         | `33px / 450 / 1.6 / -.045em`; S 35px                                   | 메인 세 장면 제목 (`dimension.css`)        |
| `founder-quote`       | `clamp(28px,3.5vw,50px) / 400 / 1.7 / -.052em`; XS 27px·1.75           | 메인 대표 인용문                           |
| `founder-name`        | `28px / 450 / 1.5 / -.045em`; S 25px, XS 23px                          | 메인 대표 이름                             |
| `context-heading`     | `22px / 450 / 1.65 / -.045em`                                          | 메인 연구 소개                             |
| `stage-heading`       | `38px / 450 / 1.5 / -.045em`; S 34px, XS 32px                          | 메인 제품 소개                             |
| `latest-heading`      | `38px / 450 / 1.5 / -.045em`; S 31px                                   | 메인 소식 구간                             |
| `latest-title`        | `20px / 500 / 1.55 / -.045em`; S 17px                                  | 메인 뉴스 항목                             |
| `science-title`       | `clamp(42px,5.5vw,80px) / 420 / 1.25 / -.045em`; S 46px, XS 36px       | 기술 첫 제목                               |
| `science-subtitle`    | `24px / 400 / 1.9`; S 20px, XS 18px                                    | 기술 영문 부제                             |
| `science-intro`       | `20px / 400 / 1.9`; L 18px, S 16px, XS 15px                            | 기술 도입 설명                             |
| `device-word`         | `26px / 400 / 1.9`; S 22px                                             | 기술 Sleeby                                |
| `science-note`        | `13px / 400 / 1.8`; S 12px                                             | 기술 각주                                  |
| `metric-label`        | `18px / 500 / 1.5`; S 14px                                             | 기술 임상 지표 이름                        |
| `research-heading`    | `30px / 450 / 1.65 / -.045em`; L 26px, S 26px, XS 24px                 | 기술 연구 제목                             |
| `metric-number`       | `64px / 450 / 1.3 / -.04em`; L 54px, S 50px, XS 45px                   | 기술 임상 수치                             |
| `study-title`         | `17px / 400 / 1.7`; S 15px, XS 14px                                    | 연구 목록                                  |
| `study-state`         | `15px / 400 / normal`; S 13px                                          | 연구·등록 상태                             |
| `patent-heading`      | `44px / 450 / 1.4 / -.045em`; L 40px, S 34px, XS 29px                  | 지식재산 제목                              |
| `patent-number`       | `62px / 450 / 1.3 / -.04em`; S 48px, XS 51px                           | 지식재산 수치. B의 비단조 반응형 값도 유지 |
| `patent-item`         | `21px / 400 / 1.65`; S 18px, XS 16px                                   | 특허 목록                                  |
| `patent-key`          | `15px / 400 / normal`; S 13px, XS 14px                                 | 지식재산 항목명                            |
| `patent-note`         | `12px / 400 / 1.8`; S 11px, XS 12px                                    | 지식재산 각주                              |
| `product-intro-title` | `24px / 650 / 1.6 / -.04em`; 761~1100px 20px, S 26px·1.45              | 제품 첫 설명                               |
| `product-wordmark`    | `clamp(150px,20vw,290px) / 850 / .95 / -.065em`; S `28vw`·자간 -.07em  | 제품 Sleeby 워드마크                       |
| `product-watermark`   | `clamp(200px,28vw,410px) / 850 / 1 / -.07em`; S `54vw`                 | 제품 흐린 배경 워드마크                    |
| `feature-heading`     | `32px / 450 / 1.4 / -.045em`; L 27px, M 25px, S 24px, XS 25px          | 제품 특징 소제목                           |
| `product-lead`        | `17px / 400 / 1.8`; S 16px                                             | 제품 도입 본문                             |
| `scene-caption`       | `18px / 400 / 1.6`; S 15px, XS 16px                                    | 제품 생활 장면                             |
| `guide-caption`       | `25px / 400 / 1.55`; M 20px, XS 22px                                   | 제품 사용 순서                             |
| `guide-heading`       | `22px / 450 / 1.65 / -.045em`; M 19px, S 18px, XS 19px                 | 제품 사용 안내                             |
| `kit-heading`         | `40px / 450 / 1.35 / -.045em`; M 34px, S 31px                          | 제품 구성 제목                             |
| `kit-item`            | `20px / 400 / 1.6`; M 17px, XS 18px                                    | 제품 구성품                                |
| `news-title`          | `21px / 500 / 1.55 / -.045em`; S 16px                                  | 뉴스룸 행 제목                             |
| `news-meta`           | `12px / 400 / normal / .02em`; XS 11px                                 | 뉴스 날짜·언론사                           |
| `faq-question`        | `18px / 500 / 1.7`; S 16px                                             | FAQ summary                                |
| `faq-answer`          | `16px / 400 / 1.9`; S 15px                                             | FAQ 답변                                   |
| `filter`              | `16px / 400 / normal`; XS 14px                                         | B 뉴스 분류. 선택 시 동일 크기·600 굵기    |

추가한 실제 대응 활자도 페이지 전용 토큰으로 관리한다. 원본과 해상도별 화면 대조에서 역할이 다른 값을 공통 본문에 합치지 않는다.

| 새 이름             | 값·반응형                                    | B 근거 / 대상                                       |
| ------------------- | -------------------------------------------- | --------------------------------------------------- |
| `spectrum-label`    | `28px / 400 / normal`; S 21px, XS 18px       | `details.css` 스펙트럼 상태 이름                    |
| `spectrum-english`  | `13px / 400 / 1.5`; S 10px·1.6, XS 9px       | 같은 곳 영문 상태 이름                              |
| `product-hero-copy` | `17px / 400 / 1.8`; 1100px 이하 15px, S 16px | `product-base.css` 제품 소개                        |
| `product-hero-link` | `17px / 650 / normal`                        | 같은 곳 사용 방법 링크                              |
| `product-nav`       | `19px / 400 / 1.5`; 1100px 이하 16px, S 14px | 같은 곳 세 구간 링크                                |
| `spec-value`        | `27px / 400 / 1.55`                          | `details.css` 사양 숫자. 기존 DB 조건부 표시만 유지 |
| `day-caption`       | `14px / 400 / normal`; XS 12px               | `structure.css` 낮·밤 사진 설명                     |
| `guide-copy`        | `16px / 400 / 1.9`; M 15px, S 14px, XS 15px  | `details.css` 사용 안내 본문                        |
| `research-more`     | `16px / 400 / 1.9`; S 14px                   | `details.css` 임상연구 하단 문구                    |

공통 `ui-glyph`는 `22px / 400 / normal`로 B 검색 기호·뉴스 화살표(`foundation.css`)에 대응한다. 제품 `--mask-product-halftone`은 B `product-base.css`의 타원형 점무늬 마스크(중앙 불투명 14%·60% 농도 40%·투명 70%)다. 색은 ink 토큰을 공유한다.

남는 A 회사 통계·FlipCard·연혁, 기존 조건부 제품 사양은 공통/페이지 전용의 대응 역할을 재사용한다. 옛 스타일을 보존하기 위한 A 전용 토큰을 남기지 않는다.

## 페이지별 기준과 운영 기능

| 화면 | 기준·예외                                                                                                                                                                                                                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 메인 | B 파동 hero → 생활 이야기 → 세 장면 → 대표 소개·연구 이야기 → 제품 소개 → DB 최신 소식 2건 → 문의 배너. 공개 기사 0건이면 소식 구간 전체를 숨긴다. 제품 소개의 구매하러 가기/출시 예정은 F-06 유지에 따른 B와의 차이다.                        |
| 회사 | A 소개·통계 → 대표 → 믿는 것 → 쉬운 기술 → 연혁 → 문의의 순서·배치를 유지한다. B의 추가 사진 쌍 구간은 넣지 않는다.                                                                                                                            |
| 기술 | B 도입·상태 스펙트럼·세 원리·임상연구·지식재산. 승인된 본문·자료·수치는 유지한다.                                                                                                                                                              |
| 제품 | B 워드마크·제품 crop·특징·생활 장면·알고리즘·사용 방법·구성. 기존 사양 조건부 표시만 유지하고 값이 없으면 숨긴다. 테이블 구조·사양 값·새 사양 구간을 추가하지 않는다.                                                                          |
| 뉴스 | DB 기사만 검색·분류해 B 행 목록으로 표시한다. 주요 기사 특별 배치·예시 기사·고정 공지는 제거한다. 원문은 새 탭으로 직접 연결하고 /newsroom/[id]는 삭제한다. 날짜는 전부 YYYY.MM.DD이며 임시 1일 값도 그대로 표시한다. 날짜 정밀도 컬럼은 없다. |
| FAQ  | B 문의 안내·검색·native details·하단 문의 배너. 질문·답변은 DB에서만 읽으며 여러 개 동시 펼침을 허용한다.                                                                                                                                      |
| 문의 | B 배치 안에 실제 제출·Turnstile·동의·대기·성공/오류를 유지한다. 처리 순서·중복 방지·담당자 알림은 바꾸지 않는다. 지도 저작자 표시는 A/B 공통으로 유지한다.                                                                                     |

FAQ·뉴스·구매 주소·사양의 기존 cacheTag/updateTag 연결과 /[lang]·Metadata API는 유지한다. 원문 URL이 없는 뉴스 행은 가짜 링크를 만들지 않는다. 공개 정적 고정 문구는 src/content/ko와 get*Copy 함수로 읽는다. FAQ·기사 본문은 DB에만 둔다. 사용 중인 기존 이미지를 우선 재사용하고 낮·밤 생활 사진 두 개만 추가한다. B 활성 HTML에서 쓰지 않는 영상은 복사하지 않는다.

## 관리자 적용 기준

- 기존 독립 최상위 레이아웃·noindex·AdminNav·메뉴 순서·표/폼 구조·1024px 최대 폭을 유지한다.
- 로그인·FAQ·제품 사양/구매·뉴스 목록/폼·문의 목록/상세/답변에 같은 새 글꼴·색·글자·선·포커스를 적용한다. 버튼·입력은 control 모서리와 B 높이 규칙을 따른다.
- 모바일 핵심 칸만 보이는 기존 동작을 유지한다. 표의 가로 스크롤을 추가하지 않는다.
- requireAdmin·사용자 세션 DB/Storage·기본 1MB Action 한도·900KB 파일 한도·메일 실패/중복 발송 정책은 그대로다. 새 모션은 넣지 않는다.
- 화면 주 제목은 form-aside, 구간 제목은 form-title을 사용한다. 현재 AdminNav 메뉴는 violet-strong 테두리·글자색과 font-ui-selected 굵기로 표시한다.
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

- 메인 파동은 B waves.js의 점 계산·선 수·투영·투명도·12초 합류량·30fps·최대 경과 100ms·DPR 2를 보존한다. 탭 숨김·화면 밖·시스템 reduced-motion에서 멈추며 관찰자·이벤트·RAF를 정리한다. body.motion-off와 preferences.js는 가져오지 않는다.
- 회사·제품·기술에만 A Reveal과 대응 모션을 유지한다. 회사 귀 원→선→중앙 원·연혁 선/순차 등장·FlipCard, 기술 스펙트럼/원리 막대·이미지 hover, 제품 생활/사용 순서 카드 hover가 대상이다.
- 회사 중앙 점은 첫 진입에 1회만 깜빡인다. 대응하지 않는 A 메인 구간의 모션은 제거한다.
- 메인 파동 외 나머지 메인·뉴스·FAQ·문의에는 Reveal을 포함한 등장 모션을 넣지 않는다. 색·포커스 상태 표시는 유지한다.
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
