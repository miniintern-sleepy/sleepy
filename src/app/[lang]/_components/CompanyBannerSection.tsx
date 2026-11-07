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
      className="bg-panel px-6 py-14 md:px-10 md:py-20"
    >
      <Reveal className="mx-auto max-w-190 text-center">
        <p className="text-copy-large whitespace-pre-line text-ink md:text-science-intro">
          {copy.title}
        </p>
        <Link
          href={`/${lang}/company`}
          className="mt-6 inline-flex min-h-13 min-w-30 items-center justify-center rounded-full border border-rule bg-paper px-7.5 text-ui-button text-ink hover:border-violet hover:text-violet motion-safe:transition-colors motion-safe:duration-200"
        >
          {copy.button}
        </Link>
      </Reveal>
    </section>
  );
}
