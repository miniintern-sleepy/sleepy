# AGENTS.md

이 파일은 이 저장소에서 일하는 AI 에이전트(Claude Code, Codex)와 팀원이 함께 따르는 작업 지침이다.
답변, 주석, 커밋 메시지, PR, 문서는 모두 **한국어**로 쓴다.

## 프로젝트

(주)슬리피의 브랜드 홈페이지. 회사와 제품(디지털 귀마개 슬리비)을 소개하고 구매·문의로 연결한다.

- 스택: Next.js(App Router) + React + TypeScript + Tailwind CSS, 데이터는 Supabase, 배포는 Vercel
- 별도 백엔드 서버는 없다. 서버 일은 Server Action이 맡는다.
- 화면 작업을 요청할 때는 피그마 캡처나 링크를 함께 준다. 받은 자료를 기준으로 만들고, 자료에 없거나 애매한 부분은 추측하지 말고 묻는다. 링크를 열 수 없으면 캡처를 요청한다.
- 설계 문서는 `docs/`에 있다. 작업 전에 관련 문서를 먼저 읽는다. 작업 지시에 함께 준 이슈나 피그마 자료가 `docs/`보다 최신이면 그것을 따르고, 서로 다른 부분은 알린다.
  - `docs/decisions.md` 결정 기록 · `docs/features.md` 기능 명세 · `docs/api.md` API 명세 · `docs/database.md` 테이블 설계

## 명령어

```bash
nvm use              # .nvmrc의 Node 버전으로 맞춤
npm ci               # 잠금 파일 그대로 설치 (라이브러리를 추가할 때만 npm install)
npm run dev          # 개발 서버
npm run lint         # ESLint
npm run format       # Prettier로 형식 맞춤
npm run build        # 배포용 빌드
```

검사는 직접 돌리지 않아도 된다. 커밋할 때 훅이 바뀐 파일의 형식(Prettier), 린트(ESLint), 비밀 키(secretlint), 커밋 메시지 규칙을 자동으로 검사한다. 훅이 실패하면 원인을 고친 뒤 다시 커밋한다. `--no-verify`로 건너뛰지 않는다. 빌드 검사는 PR에서 CI가 한다(CI는 설정 예정).

## 폴더 구조와 작업 범위

```
src/app/[lang]/<화면>/page.tsx        화면 본체 (메인, company, technology, product, newsroom, faq, contact)
src/app/[lang]/<화면>/_components/    그 화면에서만 쓰는 섹션
src/components/layout/                헤더, 푸터
src/components/ui/                    여러 화면이 같이 쓰는 UI (피그마 공통 컴포넌트)
src/lib/                              콘텐츠 읽기, Supabase, 메타데이터, 지표 같은 공통 기능
src/content/ko/                       페이지 문구, FAQ, 뉴스룸 기사
src/styles/tokens.css                 색·글자 스타일 토큰
supabase/migrations/                  테이블·RLS 변경 SQL
```

- 요청받은 화면의 폴더 안에서 작업한다. 다른 화면 폴더, `src/components/`, `src/lib/`, `src/styles/tokens.css`를 바꿔야 하면 먼저 사람에게 묻는다.
- 한 화면에서만 쓰는 것은 그 화면의 `_components/`에 둔다. 여러 화면에서 실제로 쓰일 때 `src/components/`로 옮긴다.

## React·Next.js 작성 원칙

공식 문서가 권하는 방식을 따른다. 설치된 버전의 Next.js 문서가 `node_modules/next/dist/docs/`에 있다. 버전마다 달라지는 내용(캐시, 설정 등)은 이 문서로 확인하고, 추측해서 쓰지 않는다.

- 이 프로젝트는 Cache Components(`cacheComponents: true`)를 켠 상태다. 캐시는 `"use cache"`와 `cacheLife`로 다룬다.

- 컴포넌트는 순수하게 작성한다. 렌더링 중에 바깥 값을 바꾸지 않는다.
- 다른 값에서 계산할 수 있는 값은 state로 두지 않는다.
- `useEffect`는 브라우저 API, 외부 위젯 같은 React 바깥 시스템과 맞출 때만 쓴다. 화면용 데이터 변환과 사용자 이벤트 처리에는 쓰지 않는다.
- `useMemo`, `useCallback`, `memo`는 느리다는 근거가 있을 때만 쓴다.
- 컴포넌트는 기본이 서버 컴포넌트다. `"use client"`는 입력·클릭·브라우저 API가 필요한 가장 작은 컴포넌트에만 붙인다.
- 데이터는 서버 컴포넌트에서 읽고, 저장·수정은 Server Action으로 한다.
- 페이지 제목·설명·공유 이미지는 Metadata API(`metadata`, `generateMetadata`)로 정한다.
- 이미지는 `next/image`, 내부 링크는 `next/link`를 쓴다.
- 콘텐츠는 화면에서 직접 파일을 읽지 않고 `src/lib/content.ts`의 함수로만 읽는다.

## 코드 원칙

- **KISS**: 가장 단순한 방법으로 만든다.
- **YAGNI**: 지금 요구되지 않은 기능, 옵션, 추상화를 미리 만들지 않는다.
- **DRY**: 같은 정보(색·크기 값, 콘텐츠, 상태)는 한 곳에만 둔다. 화면 마크업과 Tailwind 클래스는 여러 파일에서 실제로 반복될 때 컴포넌트로 뺀다. 비슷해 보인다고 미리 묶지 않는다.
- 이름으로 역할이 드러나게 짓는다. 함수와 컴포넌트는 한 가지 일만 한다.

## 스타일

- 색과 글자 스타일은 `tokens.css`에 정의된 토큰 이름으로 쓴다. 간격·둥글기는 아직 토큰이 없어 Tailwind 기본값(`p-4`, `rounded-xl` 등)을 쓴다. `#6B4FA0`, `text-[15px]` 같은 값을 직접 쓰지 않는다. 필요한 토큰이 없으면 사람에게 묻는다.
- 토큰 이름은 영어다(Tailwind 클래스에 한글을 못 쓴다). 피그마 변수·글자 스타일 이름과의 대응은 `tokens.css`의 각 줄 주석에 있다. 예: `bg-brand-deep` = 브랜드/진보라, `text-h2` = Sleepy/Heading 2.
- Tailwind 기본 색(`bg-red-500` 등)과 기본 글자 크기(`text-xl` 등)는 꺼져 있다. 디자인 토큰만 쓸 수 있다.
- 형식(들여쓰기, 따옴표, 클래스 순서)은 Prettier에 맡긴다. 손으로 맞추지 않는다.
- 모든 화면은 모바일·태블릿·PC에서 깨지지 않게 만든다.

## 데이터와 보안

- Supabase 서버 키(service_role)는 `src/lib/supabase/server.ts`처럼 맨 위에 `import "server-only";`가 있는 파일에서만 쓴다.
- 비밀 키 환경 변수에는 `NEXT_PUBLIC_`을 붙이지 않는다. 이 접두사가 붙은 값은 브라우저로 간다.
- `.env` 파일과 비밀 키는 커밋하지 않는다. 새 환경 변수는 `.env.example`에 이름만 추가한다. 비밀 키가 커밋에 들어가면 커밋 훅과 CI가 막는다. 막히면 키를 지우고 환경 변수로 옮긴다.
- 막아야 하는 비밀 키: Supabase 서버 키(service_role), Turnstile 비밀 키, 메일 서비스 키. Supabase 공개 키(anon)와 Turnstile 사이트 키는 브라우저용이라 공개돼도 된다.
- 테이블·컬럼·RLS를 바꾸면 `supabase/migrations/`에 SQL 파일을 추가한다. 새 테이블은 RLS를 켠다.
- 브라우저에서 Supabase에 직접 쓰기(insert·update·delete)를 하지 않는다. 쓰기는 Server Action을 거친다.
- 문의 처리 순서: 허니팟 확인 → Turnstile 토큰 서버 확인 → 입력 검증 → 저장. 순서를 바꾸지 않는다.

## 접근성

- 폼 입력칸마다 `<label>`을 연결한다. 오류는 색만이 아니라 글자로도 알린다.
- 의미 있는 이미지에는 대체 텍스트를 쓰고, 꾸밈 이미지는 `alt=""`로 둔다.
- 모든 기능은 키보드만으로 쓸 수 있어야 한다. 버튼은 `<button>`, 이동은 `<a>`(`next/link`)로 만든다.
- 글자와 배경의 색 대비를 충분히 둔다.

## 주석

- 기본은 주석 없이 읽히는 코드다.
- 한 줄 주석은 "왜"와 "주의"만 쓴다. 순서가 중요하거나 변칙적인 코드에는 이유와 근거(이슈 번호, 날짜)를 남긴다.
- JSDoc은 다른 파일에서 가져다 쓰는 것에만 쓴다: `src/lib/` 함수, Server Action, 공통 컴포넌트에서 이름만으로 뜻이 안 보이는 props.
- JSDoc에는 설명만 쓴다. `{string}` 같은 타입 표기와 `@typedef`는 쓰지 않는다. 필요하면 `@returns`(설명만), `@example`, `@deprecated`, `@see`를 쓴다.
- 코드가 하는 일을 그대로 다시 말하는 주석은 만들지 않는다. 그런 주석이 생기면 지운다.
- 코드를 바꾸면 주변 주석이 여전히 맞는지 확인한다.
- 할 일은 `// TODO(#이슈번호): 내용` 형식으로 남긴다.

```ts
/**
 * 공개된 FAQ를 노출 순서대로 가져온다.
 *
 * 지금은 content/ko 파일을 읽고, 관리 화면이 생기면 Supabase 조회로 바뀐다.
 */
export async function getFaqs(): Promise<Faq[]> {}
```

## Git

브랜치, 커밋, 이슈, PR 규칙은 `CONTRIBUTING.md`를 따른다. 요약하면 다음 순서다.

1. **이슈**: 모든 작업에는 이슈가 있어야 한다. 이슈가 없으면 이슈 템플릿으로 초안을 만들어 보여 주고, 확인받은 뒤 `gh issue create`로 만든다. 먼저 작업했다면 커밋하기 전에 이슈를 만든다.
2. **브랜치**: `dev`에서 `타입/이슈번호-설명`으로 만든다. 예: `feat/12-contact-form`. 이슈를 나중에 만들었다면 푸시 전에 `git branch -m`으로 이름을 바꾼다.
3. **커밋**: `타입: 작업 내용 #이슈번호`. 예: `feat: 문의 폼 서버 검증 추가 #12`. 이슈 번호가 없으면 커밋 훅이 막는다(머지 커밋은 예외).
4. **PR**: 대상은 `dev`. 본문에 `Closes #이슈번호`를 적는다. 없으면 CI가 막는다.

- 타입: feat, fix, docs, style, refactor, test, chore
- 커밋 메시지와 PR 본문에 `Co-Authored-By:` 줄과 AI 도구의 자동 서명("Generated with ..." 등)을 **절대 넣지 않는다**. 훅과 PR 검사에서 막힌다.
- `main`, `dev`에 직접 커밋하거나 푸시하지 않는다.
- 이슈 생성은 위 1번처럼 확인받은 뒤 한다. 커밋, 푸시, PR 생성은 사람이 요청할 때만 한다.

## 하지 말 것

- 요청 범위 밖의 파일을 고치거나 리팩토링하지 않는다.
- 새 라이브러리를 사람에게 묻지 않고 추가하지 않는다.
- `docs/` 문서를 사람에게 묻지 않고 바꾸지 않는다. 코드가 문서와 다르면 알린다.
- 확인하지 않은 동작을 됐다고 보고하지 않는다. 실행해 본 것과 실행하지 못한 것을 나눠 말한다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
