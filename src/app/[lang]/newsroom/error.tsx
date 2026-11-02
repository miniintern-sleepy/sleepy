"use client";

export default function NewsroomError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-h2 text-brand-deep">소식을 불러오지 못했습니다.</h1>
      <p className="mt-4 text-body text-fg-muted">
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 min-h-11 cursor-pointer rounded-xl bg-brand px-6 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        다시 시도
      </button>
    </main>
  );
}
