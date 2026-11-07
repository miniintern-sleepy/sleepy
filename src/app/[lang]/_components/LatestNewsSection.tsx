import NewsItem from "@/components/ui/NewsItem";
import TextLink from "@/components/ui/TextLink";
import { getNewsList } from "@/lib/content";

export default async function LatestNewsSection({ lang }: { lang: string }) {
  const articles = (await getNewsList()).slice(0, 2);
  if (!articles.length) return null;
  return (
    <section className="home-latest home-section">
      <div className="public-wide">
        <div className="home-section-top">
          <h2 className="text-latest-heading">슬리피의 소식</h2>
          <TextLink href={`/${lang}/newsroom`}>뉴스룸 보기</TextLink>
        </div>
        <div>
          {articles.map((article) => (
            <NewsItem key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
