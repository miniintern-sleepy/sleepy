"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function FaqError({ reset }: { reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-detail-heading text-ink">
        질문을 불러오지 못했습니다.
      </h1>
      <p className="mt-4 text-copy text-muted">
        잠시 후 다시 시도하거나 문의를 남겨주세요.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
        >
          다시 시도
        </button>
        <Link
          href={`/${lang}/contact?type=general`}
          className="inline-flex min-h-12 items-center rounded-xl border border-rule px-6 py-3 text-ui-button text-violet"
        >
          문의하기
        </Link>
      </div>
    </main>
  );
}
