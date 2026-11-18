import ButtonLink from "@/components/ui/ButtonLink";
import type { getHomeCopy } from "@/lib/content";
import Image from "next/image";
import heroBox from "../../../../public/images/home/hero-box.webp";
export default function HeroSection({
  copy,
  lang,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["hero"];
  lang: string;
}) {
  return (
    <section className="home-hero">
      <Image
        src={heroBox}
        fill
        alt=""
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />
      <div className="home-hero-copy">
        <h1 className="text-landing-title">
          {copy.title.split("\n").map((line, index) => (
            <span key={line}>
              {index > 0 ? " " : ""}
              {line}
            </span>
          ))}
        </h1>
        {/* #98 제품 설명과 제품 소개 버튼을 제목 아래에 세로로 쌓는다. */}
        <div className="home-hero-product">
          <p className="home-hero-description text-copy-large">
            {copy.description}
          </p>
          <ButtonLink href={`/${lang}/product`} variant="primary">
            {copy.link}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
