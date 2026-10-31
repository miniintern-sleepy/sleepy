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

// 화면마다 metadata.title만 정하면 "제목 | 슬리피"가 된다. 공유 이미지와 도메인(metadataBase)은 C-02에서 정한다.
export const metadata: Metadata = {
  title: { default: "슬리피", template: "%s | 슬리피" },
  description: "약물 없이 잠들도록 돕는 디지털 귀마개, 슬리비",
  openGraph: { siteName: "슬리피", locale: "ko_KR", type: "website" },
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
