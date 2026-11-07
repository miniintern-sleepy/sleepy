import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["contact"];

export default function ContactSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  return (
    <section
      aria-labelledby="company-contact"
      className="company-contact bg-panel"
    >
      <Reveal className="mx-auto max-w-190 text-center">
        <h2
          id="company-contact"
          className="text-form-aside text-ink md:text-research-heading"
        >
          {copy.title}
        </h2>
        <p className="mt-3 text-copy-large text-muted md:text-science-intro">
          {copy.description}
        </p>
        {/* 문의 폼은 들어온 화면에 따라 유형을 미리 고른다. 회사 소개에서는 "일반"이다(F-02). */}
        <Link
          href={`/${lang}/contact?type=general`}
          className="mt-7 inline-flex min-h-13 min-w-30 items-center justify-center rounded-full border border-violet bg-violet-strong px-7.5 text-ui-button text-white hover:border-violet-strong hover:bg-violet motion-safe:transition-colors motion-safe:duration-200"
        >
          {copy.button}
        </Link>
      </Reveal>
    </section>
  );
}
