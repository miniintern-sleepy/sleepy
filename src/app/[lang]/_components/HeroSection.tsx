import TextLink from "@/components/ui/TextLink";
import type { getHomeCopy } from "@/lib/content";
import AutoWave from "./AutoWave";
export default function HeroSection({
  copy,
  lang,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["hero"];
  lang: string;
}) {
  return (
    <section className="home-hero">
      <div>
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
      <AutoWave />
    </section>
  );
}
