import type { ReactNode } from "react";

import type { ContentState } from "../_lib/validation";

export const inputClass =
  "mt-2 min-h-12 w-full rounded-lg border border-line bg-surface px-3 py-2 text-body text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
export const buttonClass =
  "min-h-11 rounded-lg bg-brand-deep px-4 py-3 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";
export const panelClass = "rounded-xl border border-line bg-surface p-4 sm:p-6";

export function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-label">
        {label}
      </label>
      {children}
      <p id={`${name}-error`} className="mt-1 text-body-sm text-brand-deep">
        {error}
      </p>
    </div>
  );
}

export function Feedback({ state }: { state: ContentState }) {
  const messages = {
    unauthenticated: "로그인이 만료됐습니다. 다시 로그인해 주세요.",
    forbidden: "관리자 권한이 없습니다.",
    invalid: "입력한 내용을 확인해 주세요.",
    notFound: "항목을 찾지 못했습니다. 목록을 새로고침해 주세요.",
    server: "처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  };
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="space-y-1 text-body-sm text-brand-deep"
    >
      <p>
        {state.ok
          ? "저장했습니다."
          : state.reason
            ? messages[state.reason]
            : ""}
      </p>
      {state.fieldErrors?.id && <p>{state.fieldErrors.id}</p>}
      {state.warning && <p>{state.warning}</p>}
    </div>
  );
}
