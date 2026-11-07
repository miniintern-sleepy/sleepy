import type { Metadata } from "next";
import { Suspense } from "react";
import { getNewsroomCopy } from "@/lib/content";
import Newsroom from "./_components/Newsroom";
import { loadNewsroom } from "./_components/load-news";

export const metadata: Metadata = {
  title: "뉴스룸",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 뉴스룸",
};
async function Articles() {
  const [articles, copy] = await Promise.all([
    loadNewsroom(),
    getNewsroomCopy(),
  ]);
  return <Newsroom articles={articles} copy={copy} />;
}
export default async function NewsroomPage() {
  const copy = await getNewsroomCopy();
  return (
    <main className="public-page" id="main">
      <header className="public-page-heading public-wrap">
        <h1 className="text-page-title">{copy.title}</h1>
      </header>
      <section className="public-wrap public-list-section">
        <Suspense fallback={<p role="status">소식을 불러오고 있습니다.</p>}>
          <Articles />
        </Suspense>
      </section>
    </main>
  );
}
