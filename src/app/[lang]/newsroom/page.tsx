import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getNewsroomCopy } from "@/lib/content";
import Newsroom from "./_components/Newsroom";
import { loadNewsroom } from "./_components/load-news";
import "./newsroom.css";

export const metadata: Metadata = {
  title: "뉴스룸",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 뉴스룸",
};
type SearchParams = Promise<{ page?: string | string[] }>;
async function Articles({ searchParams }: { searchParams: SearchParams }) {
  const [articles, query] = await Promise.all([loadNewsroom(), searchParams]);
  return <Newsroom articles={articles} requestedPage={query.page} />;
}
export default async function NewsroomPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const copy = await getNewsroomCopy();
  return (
    <main className="public-page" id="main">
      <PageHero
        title={copy.title}
        description={copy.description}
        wave="newsroom"
      />
      <section className="public-wrap public-list-section">
        <Suspense fallback={<p role="status">소식을 불러오고 있습니다.</p>}>
          <Articles searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
