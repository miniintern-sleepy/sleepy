import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["intro"];

export default function IntroSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="company-title"
      className="bg-linear-to-b from-brand-pale to-surface px-6 pt-16 pb-14 text-center md:px-10 md:pt-24 md:pb-24"
    >
      <Reveal className="mx-auto max-w-360">
        <h1 id="company-title" className="text-h2 text-fg md:text-h1">
          {copy.title}
        </h1>
        <p className="mx-auto mt-6 max-w-190 text-body text-fg-muted md:mt-8 md:text-title">
          {copy.description}
        </p>
      </Reveal>
    </section>
  );
}
