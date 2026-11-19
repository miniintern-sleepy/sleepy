import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getNewsroomCopy, getUiCopy, pageMetadata } from "@/lib/content";
import { toLocale } from "@/lib/i18n";
import Newsroom from "./_components/Newsroom";
import { loadNewsroom } from "./_components/load-news";
import "./newsroom.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/newsroom">): Promise<Metadata> {
  return pageMetadata((await params).lang, "newsroom");
}
type SearchParams = Promise<{ page?: string | string[] }>;
type Ui = ReturnType<typeof getUiCopy>;
async function Articles({
  searchParams,
  ui,
}: {
  searchParams: SearchParams;
  ui: Ui;
}) {
  const [articles, query] = await Promise.all([loadNewsroom(), searchParams]);
  return (
    <Newsroom
      articles={articles}
      requestedPage={query.page}
      ui={ui.newsroom}
      newWindow={ui.newWindow}
    />
  );
}
export default async function NewsroomPage({
  params,
  searchParams,
}: PageProps<"/[lang]/newsroom">) {
  const lang = toLocale((await params).lang);
  const ui = getUiCopy(lang);
  const copy = await getNewsroomCopy(lang);
  return (
    <main className="public-page" id="main">
      <PageHero
        title={copy.title}
        description={copy.description}
        wave="newsroom"
      />
      <section className="public-wrap public-list-section">
        <Suspense fallback={<p role="status">{ui.newsroom.loading}</p>}>
          <Articles searchParams={searchParams} ui={ui} />
        </Suspense>
      </section>
    </main>
  );
}
