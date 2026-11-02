import Image from "next/image";

import type { getTechnologyCopy } from "@/lib/content";

import Reveal from "./Reveal";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["patents"];

export default function PatentsSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-tech-ip">
      <div className="mx-auto max-w-360 px-6 py-14 md:px-10 xl:grid xl:grid-cols-[minmax(0,1fr)_35rem] xl:gap-x-20 xl:py-20 min-[90rem]:pr-30 min-[90rem]:pl-20">
        <Reveal className="xl:mt-2.5">
          <h2 className="text-h2 whitespace-pre-line text-brand-deep xl:text-tech-ip-title">
            {copy.title}
          </h2>

          <dl className="mt-10 grid grid-cols-2 gap-6 md:flex md:gap-0 xl:mt-15">
            {copy.stats.map(({ label, count, unit, note }, index) => (
              <div
                key={label}
                className={
                  index === 0
                    ? "md:w-34 md:shrink-0"
                    : "md:w-40 md:shrink-0 md:border-l md:border-tech-spectrum-start md:pl-6"
                }
              >
                <dt className="text-tech-label text-fg">{label}</dt>
                <dd className="mt-1.5">
                  <span className="text-tech-count text-brand">{count}</span>
                  <span className="ml-2 text-tech-body text-fg-muted">
                    {unit}
                  </span>
                  <span className="mt-3.25 block text-tech-detail whitespace-nowrap text-fg-muted">
                    {note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-10 max-w-150 xl:mt-15">
            {copy.items.map(({ title, status }) => (
              <li
                key={title}
                className="flex items-start justify-between gap-4 border-line not-first:pt-6 not-last:border-b not-last:pb-10.5"
              >
                <span className="text-tech-patent whitespace-pre-line text-fg">
                  {title}
                </span>
                <span className="shrink-0 text-tech-status text-brand">
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10 xl:mt-0">
          <Image
            src="/images/technology/certificates.png"
            alt="특허와 상표 등록증 5장. 개인정보는 흐리게 가려져 있다."
            width={560}
            height={640}
            sizes="(min-width: 1280px) 560px, 100vw"
            className="mx-auto h-auto w-full max-w-140"
          />
        </Reveal>
      </div>
    </section>
  );
}
