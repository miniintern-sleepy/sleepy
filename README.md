# 슬리피 브랜드 홈페이지

(주)슬리피의 회사와 제품(디지털 귀마개 슬리비)을 소개하고 구매·문의로 연결하는 홈페이지.

- 스택: Next.js(App Router) + TypeScript + Tailwind CSS, Supabase, Vercel
- 협업 규칙: [CONTRIBUTING.md](./CONTRIBUTING.md)
- AI 작업 지침: [AGENTS.md](./AGENTS.md)
- 설계 문서: [docs/](./docs)

## 실행

```bash
nvm use        # Node 26 (.nvmrc)
npm ci         # 잠금 파일 그대로 설치
npm run dev    # http://localhost:3000 → /ko 로 이동
```

윈도우는 그대로 작업해도 된다. 훅과 스크립트는 Node로 작성해 맥·윈도우에서 똑같이 동작한다. WSL2(Ubuntu)는 선택이다.

## 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 값을 채운다. 값은 팀 내부 채널로 공유한다.
