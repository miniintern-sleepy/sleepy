import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["companyBanner"];

export default function CompanyBannerSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  return (
    <section
      aria-label="회사 소개"
      className="bg-tech-ip px-6 py-14 md:px-10 md:py-20"
    >
      <Reveal className="mx-auto max-w-190 text-center">
        <p className="text-tech-body whitespace-pre-line text-fg md:text-tech-intro">
          {copy.title}
        </p>
        <Link
          href={`/${lang}/company`}
          className="mt-6 inline-flex min-h-13 min-w-30 items-center justify-center rounded-full border border-line-image bg-surface px-7.5 text-button text-fg hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-safe:transition-colors motion-safe:duration-200"
        >
          {copy.button}
        </Link>
      </Reveal>
    </section>
  );
}
