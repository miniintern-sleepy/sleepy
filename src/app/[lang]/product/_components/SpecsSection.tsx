import Reveal from "@/components/ui/Reveal";
import type { ProductSpec } from "@/types/content";

export default function SpecsSection({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;

  const middle = Math.ceil(specs.length / 2);
  return (
    <section
      aria-label="전체 사양"
      className="mx-auto max-w-360 px-6 pt-12 pb-20 md:px-10 lg:px-20"
    >
      <Reveal className="grid gap-x-20 md:grid-cols-2">
        {[specs.slice(0, middle), specs.slice(middle)].map((column, index) => (
          <dl key={index}>
            {column.map((spec) => (
              <div
                key={spec.id}
                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-t border-line py-6 text-tech-detail"
              >
                <dt className="text-tech-label">{spec.label}</dt>
                <dd className="wrap-anywhere whitespace-pre-line text-fg-muted">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </Reveal>
    </section>
  );
}
