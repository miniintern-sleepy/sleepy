"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { uiCopy as en } from "@/content/en/ui";
import { uiCopy as ko } from "@/content/ko/ui";

export default function FaqError({ reset }: { reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const ui = lang === "en" ? en : ko;

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-detail-heading text-ink">{ui.faq.errorTitle}</h1>
      <p className="mt-4 text-copy text-muted">{ui.faq.errorBody}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
        >
          {ui.retry}
        </button>
        <Link
          href={`/${lang}/contact?type=general`}
          className="inline-flex min-h-12 items-center rounded-xl border border-rule px-6 py-3 text-ui-button text-violet"
        >
          {ui.header.contact}
        </Link>
      </div>
    </main>
  );
}
