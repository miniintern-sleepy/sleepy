import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

import FlipCard from "./FlipCard";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["beliefs"];

export default function BeliefsSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="company-beliefs"
      className="mx-auto max-w-360 px-6 pb-16 md:px-10 md:pb-24 lg:px-20 lg:pb-28"
    >
      <Reveal>
        <h2
          id="company-beliefs"
          className="text-h3 text-brand-deep md:text-tech-heading"
        >
          {copy.title}
        </h2>
      </Reveal>
      <ul className="mt-9 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {copy.items.map(({ title, description }, index) => (
          <li key={title}>
            <Reveal>
              <FlipCard
                index={index}
                title={title}
                description={description}
                hint={copy.hint}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
