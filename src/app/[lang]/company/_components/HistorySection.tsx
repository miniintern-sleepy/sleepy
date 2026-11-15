import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["history"];
export default function HistorySection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="company-history"
      className="public-wrap company-history"
    >
      <Reveal>
        <h2
          id="company-history"
          className="text-center text-form-aside text-ink md:text-detail-heading"
        >
          {copy.title}
        </h2>
      </Reveal>
      {/* 세로선이 위에서 아래로 그려지고 항목은 위에서부터 차례로 나타난다. */}
      <Reveal className="company-history-list relative mx-auto max-w-190">
        <div
          aria-hidden="true"
          className="company-history-line absolute top-0 bottom-0 origin-top bg-rule transition-transform duration-1000 ease-out motion-safe:scale-y-0 motion-safe:group-data-[visible=true]:scale-y-100 print:scale-y-100"
        />
        <ol>
          {copy.items.map(({ date, text }, index) => (
            <li
              key={`${date}-${text}`}
              data-last={index === copy.items.length - 1 ? "true" : undefined}
              style={{ transitionDelay: `${300 + index * 220}ms` }}
              className="company-history-row motion-safe:translate-y-4 motion-safe:opacity-0 motion-safe:transition motion-safe:duration-700 motion-safe:group-data-[visible=true]:translate-y-0 motion-safe:group-data-[visible=true]:opacity-100 print:translate-y-0 print:opacity-100"
            >
              <span aria-hidden="true" className="company-history-dot" />
              <span className="company-history-date text-copy font-ui-medium text-muted tabular-nums">
                {date}
              </span>
              <span className="company-history-text text-copy-large text-ink">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
