import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";

import "@/styles/globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "관리자 | 슬리피",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="min-h-dvh bg-surface-muted">
        <header className="border-b border-line bg-surface px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <span className="text-title">슬리피 관리자</span>
            <Link
              href="/ko"
              className="rounded text-body-sm text-brand-deep underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              홈페이지 보기
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
