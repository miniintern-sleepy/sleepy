import type { Metadata } from "next";
import { Suspense } from "react";

import { newsCategories } from "@/types/content";

import { loadNewsroom } from "./_components/load-news";
import Newsroom from "./_components/Newsroom";
import PreviewNotice from "./_components/PreviewNotice";

export const metadata: Metadata = {
  title: "뉴스룸",
  description: "슬리피의 기업 소식, 보도자료와 공지사항을 만나보세요.",
};

async function NewsList({
  lang,
  searchParams,
}: {
  lang: string;
  searchParams: PageProps<"/[lang]/newsroom">["searchParams"];
}) {
  const query = await searchParams;
  const initialCategory =
    newsCategories.find((category) => category === query.category) ?? "all";
  const { articles, isPreview } = await loadNewsroom();
  return (
    <>
      {isPreview && <PreviewNotice />}
      <Newsroom
        key={initialCategory}
        articles={articles}
        lang={lang}
        initialCategory={initialCategory}
      />
    </>
  );
}

export default async function NewsroomPage({
  params,
  searchParams,
}: PageProps<"/[lang]/newsroom">) {
  const { lang } = await params;
  return (
    <main className="mx-auto max-w-7xl px-6 pt-16 pb-20 sm:px-10 sm:pt-24">
      <header className="mb-9 text-center">
        <h1 className="text-h1 text-brand-deep sm:text-display">뉴스룸</h1>
        <p className="mt-3 text-body-lg font-normal text-brand sm:text-title">
          새로운 소식과 이야기를 전합니다.
        </p>
      </header>
      <Suspense
        fallback={
          <p role="status" className="py-20 text-center text-fg-muted">
            뉴스를 불러오는 중입니다.
          </p>
        }
      >
        <NewsList lang={lang} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
