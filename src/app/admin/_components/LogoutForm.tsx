"use client";

import { useActionState } from "react";

import { logout } from "../actions";

export default function LogoutForm() {
  const [state, action, pending] = useActionState(logout, { ok: false });

  return (
    <form action={action} className="space-y-3" aria-busy={pending}>
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-lg border border-brand-deep bg-surface px-4 py-3 text-button text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
      >
        {pending ? "로그아웃 중…" : "로그아웃"}
      </button>
      <p aria-live="polite" className="text-body-sm text-brand-deep">
        {state.reason
          ? "로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요."
          : ""}
      </p>
    </form>
  );
}
