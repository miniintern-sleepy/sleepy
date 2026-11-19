"use client";

import { useParams } from "next/navigation";

import { uiCopy as en } from "@/content/en/ui";
import { uiCopy as ko } from "@/content/ko/ui";

export default function NewsroomError({ reset }: { reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const ui = lang === "en" ? en : ko;
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-detail-heading text-ink">{ui.newsroom.errorTitle}</h1>
      <p className="mt-4 text-copy text-muted">{ui.newsroom.errorBody}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 min-h-11 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
      >
        {ui.retry}
      </button>
    </main>
  );
}
