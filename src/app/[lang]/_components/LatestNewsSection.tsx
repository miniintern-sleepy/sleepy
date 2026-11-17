import NewsItem from "@/components/ui/NewsItem";
import TextLink from "@/components/ui/TextLink";
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
      <div className="public-wide">
        <div className="home-section-top">
          <h2 className="text-latest-heading">{ui.home.latestTitle}</h2>
          <TextLink href={`/${lang}/newsroom`}>{ui.home.latestLink}</TextLink>
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
