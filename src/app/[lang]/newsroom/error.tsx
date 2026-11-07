"use client";

export default function NewsroomError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-detail-heading text-ink">
        소식을 불러오지 못했습니다.
      </h1>
      <p className="mt-4 text-copy text-muted">잠시 후 다시 시도해 주세요.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 min-h-11 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
      >
        다시 시도
      </button>
    </main>
  );
}
