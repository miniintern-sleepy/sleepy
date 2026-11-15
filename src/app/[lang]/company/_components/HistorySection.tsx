import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["history"];

export default function HistorySection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="company-history"
      className="company-content company-section"
    >
      <Reveal>
        <h2
          id="company-history"
          className="text-center text-form-aside text-ink md:text-detail-heading"
        >
          {copy.title}
        </h2>
      </Reveal>

      {/* 세로선이 위에서 아래로 그려지고, 항목은 위에서부터 차례로 나타난다. */}
      <Reveal className="relative mx-auto mt-10 max-w-190 md:mt-12">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-2.5 w-0.5 origin-top bg-rule transition-transform duration-1000 ease-out motion-safe:scale-y-0 motion-safe:group-data-[visible=true]:scale-y-100 md:left-1/2 md:-ml-px print:scale-y-100"
        />
        <ol>
          {copy.items.map(({ date, text }, index) => {
            const isRight = index % 2 === 0;
            return (
              <li
                key={`${date}-${text}`}
                style={{ transitionDelay: `${300 + index * 220}ms` }}
                className="grid min-h-16.5 grid-cols-[auto_1fr] items-start gap-x-4 pt-2 motion-safe:translate-y-4 motion-safe:opacity-0 motion-safe:transition motion-safe:duration-700 motion-safe:group-data-[visible=true]:translate-y-0 motion-safe:group-data-[visible=true]:opacity-100 md:grid-cols-[1fr_auto_1fr] md:gap-x-7 print:translate-y-0 print:opacity-100"
              >
                <span
                  aria-hidden="true"
                  className="relative col-start-1 row-start-1 mt-0.5 size-5.5 rounded-full border-2 border-violet bg-paper md:col-start-2"
                />
                <p
                  className={`col-start-2 row-start-1 flex items-baseline gap-x-5 ${
                    isRight
                      ? "md:col-start-3"
                      : "md:col-start-1 md:flex-row-reverse"
                  }`}
                >
                  <span className="shrink-0 text-form-aside text-violet tabular-nums">
                    {date}
                  </span>
                  <span className="text-study-title text-ink">{text}</span>
                </p>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
