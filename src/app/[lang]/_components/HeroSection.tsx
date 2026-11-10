import TextLink from "@/components/ui/TextLink";
import type { getHomeCopy } from "@/lib/content";
import Image from "next/image";
import heroWindow from "../../../../public/images/home/hero-window.webp";
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
        src={heroWindow}
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
              {index > 0 && (
                <>
                  <br />{" "}
                </>
              )}
              {line}
            </span>
          ))}
        </h1>
        <TextLink href={`/${lang}/technology`}>{copy.link}</TextLink>
      </div>
    </section>
  );
}
