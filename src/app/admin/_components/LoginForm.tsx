"use client";

import { useActionState } from "react";

import { login } from "../actions";
import { buttonClass, inputClass } from "./form-ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { ok: false });
  const message = state.reason
    ? {
        credentials: "이메일 또는 비밀번호를 확인해 주세요.",
        forbidden: "관리자 권한이 없는 계정입니다.",
        server: "로그인을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      }[state.reason]
    : "";

  return (
    <section
      data-admin-access-denied
      className="mx-auto w-full max-w-md rounded-control border border-rule bg-paper p-6 sm:p-8"
      aria-labelledby="login-title"
    >
      <h1 id="login-title" className="text-form-aside">
        관리자 로그인
      </h1>
      <p className="mt-3 text-helper text-muted">
        등록된 관리자 계정으로 로그인해 주세요.
      </p>
      <form action={action} className="mt-6 space-y-5" aria-busy={pending}>
        <div>
          <label htmlFor="email" className="text-ui-label">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            maxLength={254}
            required
            className={inputClass}
            aria-describedby={message ? "login-message" : undefined}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-ui-label">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={4096}
            required
            className={inputClass}
            aria-describedby={message ? "login-message" : undefined}
          />
        </div>
        <p
          id="login-message"
          aria-live="polite"
          aria-atomic="true"
          className={message ? "admin-error text-helper" : "text-helper"}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass} w-full`}
        >
          {pending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </section>
  );
}
