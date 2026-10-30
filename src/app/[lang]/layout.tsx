import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { notFound } from "next/navigation";

import { isLocale, locales } from "@/lib/i18n";

import "@/styles/globals.css";

// 한글 글리프는 필요한 범위만 나눠 받아지므로 미리 불러오기(preload)는 라틴 부분만 한다.
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "슬리피",
  description: "약물 없이 잠들도록 돕는 디지털 귀마개, 슬리비",
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={notoSansKr.variable}>
      <body>
        {/* TODO: 헤더 (src/components/layout/Header.tsx) */}
        {children}
        {/* TODO: 푸터 (src/components/layout/Footer.tsx) */}
      </body>
    </html>
  );
}
