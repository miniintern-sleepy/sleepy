import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // 언어 선택이 생기면 브라우저 언어에 따라 보내도록 바꿀 수 있어 임시 이동(307)으로 둔다.
      // 설정 파일에서 src의 TypeScript를 불러오면 실행 위치에 따라 깨져서 기본 언어(ko)를 직접 적는다.
      { source: "/", destination: "/ko", permanent: false },
    ];
  },
};

export default nextConfig;
