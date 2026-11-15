import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["beliefs"];

// 기관 사용자가 바로 읽도록 설명을 처음부터 펼쳐 둔다. 뒤집기 카드는 없앴다(#77).
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
            <Reveal className="flex h-full flex-col gap-10 border border-rule bg-paper p-6 md:gap-14 md:p-7">
              <span className="text-kicker text-violet">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-form-aside text-ink">{title}</h3>
                <p className="mt-3 text-copy-large text-muted">{description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
