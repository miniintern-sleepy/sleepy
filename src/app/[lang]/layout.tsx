import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import { notFound } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getUiCopy } from "@/lib/content";
import { isLocale, locales, toLocale } from "@/lib/i18n";

import "@/styles/globals.css";
import "@/styles/public.css";

// 화면마다 metadata.title만 정하면 "제목 | 슬리피"가 된다. 공유 이미지와 도메인(metadataBase)은 C-02에서 정한다.
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { meta } = getUiCopy(toLocale((await params).lang));
  return {
    title: { default: meta.siteName, template: `%s | ${meta.siteName}` },
    description: meta.description,
    openGraph: {
      siteName: meta.siteName,
      locale: meta.ogLocale,
      type: "website",
    },
  };
}

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
    <html lang={lang} className={pretendard.variable}>
      <body className="public-body flex min-h-dvh flex-col">
        <a href="#main" className="public-skip">
          {getUiCopy(lang).skipLink}
        </a>
        <Header lang={lang} />
        <div className="flex-1">{children}</div>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
