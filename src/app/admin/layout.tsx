import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import Link from "next/link";

import "@/styles/globals.css";

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
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-dvh bg-panel">
        <header className="border-b border-rule bg-paper px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-admin flex-wrap items-center justify-between gap-4">
            <span className="text-copy-intro">슬리피 관리자</span>
            <Link
              href="/ko"
              className="rounded text-helper text-ink underline underline-offset-4"
            >
              홈페이지 보기
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-admin px-4 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
