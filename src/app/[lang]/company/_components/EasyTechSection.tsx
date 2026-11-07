import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["easyTech"];

// 먼저 귀가 나타나고, 선이 이어진 뒤, 가운데 "머릿속"이 나타난다. 모션을 줄인 환경에서는 처음부터 보인다.
const earClassName =
  "flex w-30 flex-col items-center md:absolute md:top-0 motion-safe:scale-80 motion-safe:opacity-0 motion-safe:transition motion-safe:duration-700 motion-safe:group-data-[visible=true]:scale-100 motion-safe:group-data-[visible=true]:opacity-100 print:scale-100 print:opacity-100";

function Ear({
  label,
  caption,
  position,
}: {
  label: string;
  caption: string;
  position: string;
}) {
  return (
    <div className={`${earClassName} ${position}`}>
      <span className="grid size-30 place-items-center rounded-full bg-panel text-ui-label text-ink">
        {label}
      </span>
      <span className="mt-3 text-center text-micro text-muted">{caption}</span>
    </div>
  );
}

export default function EasyTechSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  return (
    <section
      aria-labelledby="company-tech"
      className="px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal className="mx-auto max-w-360 text-center">
        <h2
          id="company-tech"
          className="text-form-aside text-ink md:text-detail-heading"
        >
          {copy.title}
        </h2>

        <div
          role="img"
          aria-label={`${copy.left}와 ${copy.right}에 ${copy.caption}가 전달되어 ${copy.center.replace("\n", " ")}가 만들어집니다`}
          className="relative mx-auto mt-12 flex flex-col items-center gap-6 md:mt-14 md:block md:h-52.5 md:w-195"
        >
          <Ear label={copy.left} caption={copy.caption} position="md:left-0" />
          <Ear
            label={copy.right}
            caption={copy.caption}
            position="md:right-0"
          />
          <div
            aria-hidden="true"
            className="hidden w-49 origin-left transition-transform delay-500 duration-700 ease-out motion-safe:scale-x-0 motion-safe:group-data-[visible=true]:scale-x-100 md:absolute md:top-15 md:left-30 md:block print:scale-x-100"
          >
            <Image
              src="/images/company/line-left.svg"
              alt=""
              width={196}
              height={77}
              className="h-auto w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="hidden w-49 origin-right transition-transform delay-500 duration-700 ease-out motion-safe:scale-x-0 motion-safe:group-data-[visible=true]:scale-x-100 md:absolute md:top-15 md:left-116.25 md:block print:scale-x-100"
          >
            <Image
              src="/images/company/line-right.svg"
              alt=""
              width={196}
              height={77}
              className="h-auto w-full"
            />
          </div>
          <div className="relative isolate grid size-37.5 place-items-center rounded-full border border-rule bg-paper text-center text-ui-label whitespace-pre-line text-ink delay-1000 motion-safe:scale-60 motion-safe:opacity-0 motion-safe:transition motion-safe:duration-700 motion-safe:group-data-[visible=true]:scale-100 motion-safe:group-data-[visible=true]:opacity-100 md:absolute md:top-15 md:left-78.75 print:scale-100 print:opacity-100">
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full bg-violet/20 motion-safe:group-data-[visible=true]:animate-ping"
            />
            {copy.center}
          </div>
        </div>

        <p className="mt-8 text-copy whitespace-pre-line text-muted md:mt-10">
          {copy.description}
        </p>
        <Link
          href={`/${lang}/technology`}
          className="mt-4 inline-flex min-h-11 items-center text-text-link underline underline-offset-4 hover:text-violet motion-safe:transition-colors"
        >
          {copy.link}
        </Link>
      </Reveal>
    </section>
  );
}
