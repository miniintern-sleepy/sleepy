import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import { Suspense } from "react";

import AdminFrame from "./_components/AdminFrame";
import AdminLoading from "./_components/AdminLoading";

import "@/styles/globals.css";
import "./admin.css";

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
      <body className="admin-shell min-h-dvh bg-panel">
        <Suspense
          fallback={
            <main className="admin-main admin-anonymous">
              <AdminLoading variant="auth" />
            </main>
          }
        >
          <AdminFrame>{children}</AdminFrame>
        </Suspense>
      </body>
    </html>
  );
}
