"use client";

import { useRouter } from "next/navigation";
import { useActionState, useRef } from "react";

import type { ContentAction } from "../_lib/validation";

export default function DeleteForm({
  action,
  id,
  title,
}: {
  action: ContentAction;
  id: number;
  title: string;
}) {
  const [state, submit, pending] = useActionState(action, { ok: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  return (
    <div>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        disabled={pending}
        className="min-h-11 px-1 text-label text-brand-deep underline focus-visible:outline-2 focus-visible:outline-brand"
        aria-label={`${title} 삭제`}
      >
        삭제
      </button>
      <dialog
        ref={dialog}
        aria-label="삭제 확인"
        className="fixed inset-0 m-auto w-full max-w-md space-y-4 rounded-xl border border-line bg-surface p-6 text-fg shadow-lg backdrop:bg-surface-dark/60"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        onClose={() => {
          if (state.ok) router.refresh();
        }}
      >
        <h2 className="text-title">
          {state.ok ? "삭제했습니다" : "정말 삭제할까요?"}
        </h2>
        <p className="text-body wrap-anywhere">{title}</p>
        {!state.ok && (
          <p className="text-body-sm text-fg-muted">
            삭제한 항목은 되돌릴 수 없습니다.
          </p>
        )}
        <form action={submit} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={id} />
          <button
            type="button"
            disabled={pending}
            onClick={() => dialog.current?.close()}
            className="min-h-11 rounded-lg border border-line px-4 text-button text-fg"
          >
            {state.ok ? "닫기" : "취소"}
          </button>
          {!state.ok && (
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-lg bg-brand-deep px-4 text-button text-surface"
            >
              {pending ? "삭제 중…" : "삭제 확인"}
            </button>
          )}
        </form>
        {state.reason && (
          <p role="alert" className="text-body-sm text-brand-deep">
            {state.reason === "notFound"
              ? "이미 없어진 항목입니다. 새로고침해 주세요."
              : "삭제하지 못했습니다. 로그인 상태와 항목을 확인한 뒤 다시 시도해 주세요."}
          </p>
        )}
        {state.warning && (
          <p role="status" className="text-body-sm text-brand-deep">
            {state.warning}
          </p>
        )}
      </dialog>
    </div>
  );
}
