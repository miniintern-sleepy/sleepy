import type { ReactNode } from "react";

import type { ContentState } from "../_lib/validation";

export const inputClass = "admin-input mt-2";
export const buttonClass = "admin-button";
export const panelClass =
  "rounded-control border border-rule bg-paper p-4 sm:p-6";

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
      <label htmlFor={name} className="text-ui-label">
        {label}
      </label>
      {children}
      <p id={`${name}-error`} className="mt-1 text-helper text-error-ink">
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
      className="space-y-1 text-helper text-ink"
    >
      <p
        className={
          state.ok ? "admin-success" : state.reason ? "admin-error" : undefined
        }
      >
        {state.ok
          ? "저장했습니다."
          : state.reason
            ? messages[state.reason]
            : ""}
      </p>
      {state.fieldErrors?.id && (
        <p className="admin-error">{state.fieldErrors.id}</p>
      )}
      {state.warning && <p className="admin-error">{state.warning}</p>}
    </div>
  );
}
