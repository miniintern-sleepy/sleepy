# 슬리피 브랜드 홈페이지

## 1. 프로젝트 개요

**슬리피 브랜드 홈페이지**는 (주)슬리피의 회사와 첫 제품 **슬리비**(디지털 귀마개)를 소개하고, 방문자를 구매와 문의로 이어 주는 공식 홈페이지입니다.

배포 주소: <https://sleepy-v1.vercel.app/ko>

슬리피에는 제품과 기업 정보를 한곳에서 보고 구매까지 이어지는 공식 사이트가 없었습니다. 이 사이트는 다음 사용자를 위해 만듭니다.

- **잠재 고객:** 잠이 잘 오지 않아 제품을 찾아보는 사람
- **바이어·유통사:** 제품 도입이나 협업을 문의하는 사람
- **회사 담당자:** 들어온 문의를 확인하는 사람

### 화면 목록

상태는 `main` 브랜치 기준입니다. 기능별 상세 내용은 [기능 명세](./docs/features.md)에 있습니다.

| 화면      | 주소                | 내용                          | 상태      |
| --------- | ------------------- | ----------------------------- | --------- |
| 메인      | `/ko`               | 브랜드 첫인상, 제품·구매 연결 | 준비 중   |
| 회사 소개 | `/ko/company`       | 대표 이야기, 기술 소개, 연혁  | 준비 중   |
| 기술      | `/ko/technology`    | 원리, 임상 연구, 지식재산권   | 초안 완료 |
| 제품      | `/ko/product`       | 제품 소개, 사양, 구매 버튼    | 준비 중   |
| 뉴스룸    | `/ko/newsroom`      | 기사·보도자료 목록            | 준비 중   |
| 뉴스 상세 | `/ko/newsroom/{id}` | 기사 상세                     | 준비 중   |
| FAQ       | `/ko/faq`           | 자주 묻는 질문                | 준비 중   |
| 문의      | `/ko/contact`       | 문의 폼                       | 준비 중   |

공통 헤더와 푸터는 구현되어 있습니다.

### 기술 스택

| 구분          | 기술                                         |
| ------------- | -------------------------------------------- |
| 웹 프레임워크 | Next.js 16 (App Router)                      |
| UI            | React 19                                     |
| 언어          | TypeScript                                   |
| 스타일        | Tailwind CSS v4                              |
| 데이터        | Supabase                                     |
| 스팸 방어     | Cloudflare Turnstile, 허니팟                 |
| 코드 품질     | Prettier, ESLint, secretlint, GitHub Actions |
| 배포          | Vercel                                       |

### 아키텍처

별도 백엔드 서버는 두지 않습니다.

- **읽기:** `src/lib/content.ts`의 서버 함수가 Supabase와 `src/content/ko/`의 문구를 읽습니다.
- **쓰기:** 브라우저에서 Supabase에 직접 쓰지 않고 Next.js Server Action을 거칩니다.
- **문구 위치:** 긴 소개 문구는 `src/content/ko/`, FAQ·제품 사양·구매 주소·뉴스는 Supabase에 둡니다.

---

## 2. 사용 라이브러리

### Dependencies

| 패키지                  | 버전     | 용도                           |
| ----------------------- | -------- | ------------------------------ |
| `next`                  | 16.4.3   | 웹 프레임워크                  |
| `react`, `react-dom`    | 19.3.0   | UI 라이브러리                  |
| `@supabase/supabase-js` | ^2.118.0 | Supabase 연결                  |
| `server-only`           | ^0.0.1   | 서버 코드의 브라우저 유입 방지 |

### DevDependencies

| 패키지                                  | 버전    | 용도                        |
| --------------------------------------- | ------- | --------------------------- |
| `typescript`                            | ^5      | 타입 검사                   |
| `tailwindcss`, `@tailwindcss/turbopack` | ^4      | CSS 프레임워크              |
| `eslint`                                | ^9      | 코드 린트                   |
| `eslint-config-next`                    | 16.4.3  | Next.js ESLint 규칙         |
| `eslint-config-prettier`                | ^10.1.8 | ESLint ↔ Prettier 충돌 방지 |
| `prettier`                              | ^3.9.10 | 코드 포맷터                 |
| `prettier-plugin-tailwindcss`           | ^0.8.1  | Tailwind 클래스 정렬        |
| `lint-staged`                           | ^17.6.0 | 커밋할 파일만 검사          |
| `secretlint` 및 규칙 패키지             | ^13.0.7 | 비밀 키 검사                |

---

## 3. 프로젝트 세팅

### 사전 요구사항

- Node.js 26 (`.nvmrc` 참고)
- npm

Docker는 필요 없습니다. 윈도우에서도 그대로 작업할 수 있고, WSL2는 선택입니다.

### 설치 및 실행

```bash
git clone https://github.com/miniintern-sleepy/sleepy.git
cd sleepy
git switch dev

# Node 버전 맞추기
nvm use

# 의존성 설치 (잠금 파일 그대로, 커밋 훅도 함께 연결)
npm ci

# 환경 변수 파일 만들기 (윈도우 cmd는 copy)
cp .env.example .env.local

# 개발 서버 실행 (http://localhost:3000 → /ko 로 이동)
npm run dev
```

라이브러리를 새로 추가할 때만 `npm install <패키지>`를 씁니다.

### 환경 변수

`.env.example`을 복사한 `.env.local`에 값을 채웁니다. 값은 팀 내부 채널로 공유하고, `.env.local`은 커밋하지 않습니다.

| 변수                             | 설명                       | 브라우저 노출 |
| -------------------------------- | -------------------------- | ------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase 주소              | O             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase 공개 키           | O             |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase 서버 키           | X             |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 사이트 키        | O             |
| `TURNSTILE_SECRET_KEY`           | Turnstile 비밀 키          | X             |
| `MAIL_API_KEY`                   | 문의 알림 메일 (도전 과제) | X             |

`NEXT_PUBLIC_`이 붙은 값은 브라우저로 전달되므로 비밀 키에 붙이지 않습니다.

### 스크립트

| 명령어                 | 설명               |
| ---------------------- | ------------------ |
| `npm run dev`          | 개발 서버 실행     |
| `npm run build`        | 프로덕션 빌드      |
| `npm run start`        | 빌드 결과 실행     |
| `npm run lint`         | ESLint 검사        |
| `npm run format`       | Prettier 포맷 적용 |
| `npm run format:check` | Prettier 포맷 검사 |
| `npm run secretlint`   | 비밀 키 검사       |

`npm run secretlint`는 Git 무시 파일까지 검사하므로, 로컬에 실제 값이 든 `.env.local`이 있으면 실패할 수 있습니다.

### Git Hooks

`npm ci`를 실행하면 `.githooks`가 자동으로 연결됩니다. 아래 명령의 결과가 `.githooks`이면 정상입니다.

```bash
git config core.hooksPath
```

| 시점       | 대상 파일                  | 실행 내용                           |
| ---------- | -------------------------- | ----------------------------------- |
| pre-commit | `*.{js,jsx,ts,tsx,mjs}`    | `eslint --fix` → `prettier --write` |
| pre-commit | `*.{json,md,css,yml,yaml}` | `prettier --write`                  |
| pre-commit | 모든 파일                  | `secretlint`                        |
| commit-msg | 커밋 메시지                | 이슈 번호와 서명 줄 검사            |

### 협업 규칙

작업 흐름은 다음과 같습니다. 자세한 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)에 있습니다.

| 순서 | 단계    | 규칙                                          |
| ---- | ------- | --------------------------------------------- |
| 1    | 이슈    | 작업 전에 먼저 등록                           |
| 2    | 브랜치  | `dev`에서 `타입/이슈번호-설명`으로 생성       |
| 3    | 커밋    | `타입: 내용 #이슈번호`                        |
| 4    | PR      | `dev` 대상, 본문에 `Closes #이슈번호`         |
| 5    | 배포 PR | `dev` → `main`, 제목은 `release: vX.Y.Z 내용` |

```text
feat: 문의 폼 서버 검증 추가 #12
```

### CI (GitHub Actions)

`dev`와 `main`을 대상으로 하는 PR에서 [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)이 실행됩니다.

| 순서 | 검사                   | 설명                    |
| ---- | ---------------------- | ----------------------- |
| 1    | PR 규칙                | 브랜치, 제목, 본문 규칙 |
| 2    | `npm run format:check` | Prettier 포맷 검사      |
| 3    | `npm run lint`         | ESLint 검사             |
| 4    | `npm run secretlint`   | 비밀 키 검사            |
| 5    | `npm run build`        | 프로덕션 빌드           |

### 배포 (Vercel)

GitHub Actions에서는 배포하지 않고, Vercel이 저장소 변경을 받아 자동으로 배포합니다.

| Git       | Vercel 환경 |
| --------- | ----------- |
| `main`    | 실제 사이트 |
| `dev`, PR | 미리보기    |

미리보기 주소는 배포 보호가 켜져 있어 Vercel 로그인이 필요합니다.

---

## 4. 프로젝트 구조

```text
sleepy/
├── .githooks/                 # 커밋 훅 (pre-commit, commit-msg)
├── .github/                   # CI, 이슈·PR 템플릿
├── docs/                      # 설계 문서 (원본)
├── public/images/             # 이미지
├── scripts/                   # 커밋 훅·CI 스크립트
├── src/
│   ├── app/[lang]/
│   │   ├── layout.tsx         # 공통 레이아웃
│   │   ├── page.tsx           # 메인
│   │   └── <화면>/
│   │       ├── page.tsx       # 화면 본체
│   │       └── _components/   # 그 화면에서만 쓰는 섹션
│   ├── components/
│   │   ├── layout/            # 헤더, 푸터
│   │   └── ui/                # 여러 화면이 같이 쓰는 UI
│   ├── content/ko/            # 메인·회사·기술·제품 소개 문구
│   ├── lib/                   # 콘텐츠 읽기, Supabase 연결, 언어 설정
│   ├── styles/                # 전역 스타일, 색·글자 토큰
│   └── types/                 # 공통 타입
├── supabase/migrations/       # 테이블·RLS 변경 SQL
├── .env.example
├── AGENTS.md                  # AI 에이전트 작업 지침
└── CONTRIBUTING.md            # 협업 규칙
```

### 문서

| 문서                                     | 내용                  |
| ---------------------------------------- | --------------------- |
| [CONTRIBUTING.md](./CONTRIBUTING.md)     | 협업 규칙             |
| [AGENTS.md](./AGENTS.md)                 | AI 에이전트 작업 지침 |
| [docs/features.md](./docs/features.md)   | 기능 명세             |
| [docs/api.md](./docs/api.md)             | API 명세              |
| [docs/database.md](./docs/database.md)   | 테이블 설계           |
| [docs/decisions.md](./docs/decisions.md) | 결정 기록             |
