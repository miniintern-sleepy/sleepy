import NewsItem from "@/components/ui/NewsItem";
import ButtonLink from "@/components/ui/ButtonLink";
import type { UiCopy } from "@/content/ko/ui";
import { getNewsList } from "@/lib/content";

export default async function LatestNewsSection({
  lang,
  ui,
}: {
  lang: string;
  ui: Pick<UiCopy, "home" | "newsroom" | "newWindow">;
}) {
  const articles = (await getNewsList()).slice(0, 4);
  if (!articles.length) return null;
  return (
    <section className="home-latest home-section">
      <div className="public-wide" data-reveal>
        <div className="home-section-top">
          <h2 className="text-latest-heading">{ui.home.latestTitle}</h2>
          <ButtonLink href={`/${lang}/newsroom`}>
            {ui.home.latestLink}
          </ButtonLink>
        </div>
        <div className="public-news-list">
          {articles.map((article) => (
            <NewsItem key={article.id} article={article} ui={ui} />
          ))}
        </div>
      </div>
    </section>
  );
}
