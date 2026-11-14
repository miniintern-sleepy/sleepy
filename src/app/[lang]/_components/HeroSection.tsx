import Link from "next/link";
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
          {copy.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="home-hero-description text-copy-large">
          {copy.description}
        </p>
        <Link href={`/${lang}/product`} className="home-hero-button">
          {copy.link}
        </Link>
      </div>
    </section>
  );
}
