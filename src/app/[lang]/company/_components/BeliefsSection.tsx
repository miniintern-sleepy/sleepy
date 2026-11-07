import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

import FlipCard from "./FlipCard";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["beliefs"];

export default function BeliefsSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="company-beliefs"
      className="company-content company-beliefs"
    >
      <Reveal>
        <h2
          id="company-beliefs"
          className="text-form-aside text-ink md:text-detail-heading"
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
