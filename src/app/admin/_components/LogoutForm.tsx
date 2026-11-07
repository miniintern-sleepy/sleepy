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
        className="min-h-12 rounded-lg border border-violet-strong bg-paper px-4 py-3 text-ui-button text-ink disabled:opacity-60"
      >
        {pending ? "로그아웃 중…" : "로그아웃"}
      </button>
      <p aria-live="polite" className="text-helper text-ink">
        {state.reason
          ? "로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요."
          : ""}
      </p>
    </form>
  );
}
