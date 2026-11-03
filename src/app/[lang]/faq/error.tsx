"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function FaqError({ reset }: { reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-h2 text-brand-deep">질문을 불러오지 못했습니다.</h1>
      <p className="mt-4 text-body text-fg-muted">
        잠시 후 다시 시도하거나 문의를 남겨주세요.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 cursor-pointer rounded-xl bg-brand px-6 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          다시 시도
        </button>
        <Link
          href={`/${lang}/contact?type=general`}
          className="inline-flex min-h-12 items-center rounded-xl border border-line px-6 py-3 text-button text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          문의하기
        </Link>
      </div>
    </main>
  );
}
