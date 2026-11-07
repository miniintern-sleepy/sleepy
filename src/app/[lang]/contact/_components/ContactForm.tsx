"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";

import { submitInquiry } from "../actions";
import { validateInquiry, type FieldErrors, type InquiryValues } from "./form";
import Turnstile from "./Turnstile";

export default function ContactForm({
  initialType,
  siteKey,
  enabled,
  lang,
}: {
  initialType: "product" | "general";
  siteKey: string;
  enabled: boolean;
  lang: string;
}) {
  const initialValues: InquiryValues = {
    name: "",
    email: "",
    type: initialType,
    message: "",
    consent: false,
  };
  const [values, setValues] = useState(initialValues);
  const [state, action, pending] = useActionState(submitInquiry, {
    ok: false,
    attempt: 0,
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [token, setToken] = useState("");
  const [captchaMessage, setCaptchaMessage] = useState("");
  const [dismissed, setDismissed] = useState(-1);
  const errors = { ...state.fieldErrors, ...clientErrors };
  const inputClass =
    "min-h-13 w-full rounded-lg border border-rule bg-paper px-4 py-3 text-copy text-ink placeholder:text-muted    aria-invalid:border-violet-strong";

  function change<K extends keyof InquiryValues>(
    field: K,
    value: InquiryValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setClientErrors((current) => ({ ...current, [field]: undefined }));
  }

  function check(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validateInquiry(values);
    setClientErrors(nextErrors);
    setCaptchaMessage("");
    if (Object.keys(nextErrors).length) {
      event.preventDefault();
      const first = Object.keys(nextErrors)[0];
      const element = event.currentTarget.elements.namedItem(first);
      if (element instanceof HTMLElement) element.focus();
    } else if (!token) {
      event.preventDefault();
      setCaptchaMessage("보안 확인을 완료한 후 다시 보내주세요.");
    }
  }

  if (state.ok && state.attempt !== dismissed) {
    return (
      <section
        aria-labelledby="contact-success"
        className="flex flex-col items-center rounded-xl border border-rule px-6 py-16 text-center sm:px-8"
      >
        <Image src="/images/contact/check.svg" alt="" width={80} height={80} />
        <h2
          id="contact-success"
          tabIndex={-1}
          ref={(node) => {
            node?.focus();
          }}
          className="mt-7 text-detail-heading text-ink"
        >
          문의가 접수되었습니다.
        </h2>
        <p role="status" className="mt-5 text-copy-large text-muted">
          남겨주신 내용을 확인한 뒤 이메일로 답변드리겠습니다.
          <br />
          슬리피에 관심을 가져주셔서 감사합니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${lang}/faq`}
            className="inline-flex min-h-12 items-center rounded-xl border border-rule px-6 py-3 text-ui-button text-violet"
          >
            FAQ로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => {
              setValues(initialValues);
              setClientErrors({});
              setToken("");
              setDismissed(state.attempt);
            }}
            className="min-h-12 cursor-pointer rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
          >
            새 문의 작성
          </button>
        </div>
      </section>
    );
  }

  const serverMessage =
    state.reason === "captcha"
      ? "보안 확인을 다시 완료한 후 보내주세요."
      : state.reason === "server"
        ? "문의를 접수하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요."
        : "";

  return (
    <form
      action={action}
      onSubmit={check}
      noValidate
      aria-labelledby="contact-form-title"
      className="rounded-xl border border-rule bg-paper p-6 sm:p-8"
    >
      <h2 id="contact-form-title" className="text-form-aside text-ink">
        문의 내용 작성
      </h2>
      <p className="mt-4 text-helper text-muted">
        필수 항목을 입력해 문의를 남겨주세요.
      </p>
      {!enabled && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-panel p-4 text-helper text-ink"
        >
          온라인 문의 접수를 준비하고 있습니다.{" "}
          <a
            href="mailto:sleeby00@gmail.com"
            className="underline underline-offset-4"
          >
            sleeby00@gmail.com
          </a>
          으로 문의해 주세요.
        </p>
      )}
      <fieldset disabled={pending} className="mt-6 min-w-0 space-y-6">
        <legend className="sr-only">문의 정보</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-ui-label">
              이름 <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => change("name", e.target.value)}
              autoComplete="name"
              maxLength={50}
              required
              placeholder="이름을 입력해 주세요"
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-helper text-ink">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-ui-label">
              이메일 <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => change("email", e.target.value)}
              autoComplete="email"
              maxLength={254}
              required
              placeholder="이메일을 입력해 주세요"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-helper text-ink">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="type" className="mb-2 block text-ui-label">
            문의 유형 <span aria-hidden="true">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={values.type}
            onChange={(e) => change("type", e.target.value)}
            required
            className={inputClass}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? "type-error" : undefined}
          >
            <option value="general">일반 문의</option>
            <option value="product">제품 문의</option>
          </select>
          {errors.type && (
            <p id="type-error" className="mt-2 text-helper text-ink">
              {errors.type}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-ui-label">
            문의 내용 <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={(e) => change("message", e.target.value)}
            maxLength={2000}
            required
            rows={6}
            placeholder="문의하실 내용을 입력해 주세요"
            className={`${inputClass} resize-y`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          <p className="mt-1 text-right text-micro text-muted">
            {values.message.length}/2,000자
          </p>
          {errors.message && (
            <p id="message-error" className="mt-2 text-helper text-ink">
              {errors.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="consent"
            className="flex cursor-pointer items-start gap-3 text-helper text-muted"
          >
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => change("consent", e.target.checked)}
              required
              className="mt-0.5 size-5 shrink-0 accent-violet"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={
                errors.consent ? "consent-error" : "consent-description"
              }
            />
            <span>
              개인정보 수집 및 이용에 동의합니다. (필수)
              <span
                id="consent-description"
                className="mt-1.5 block text-micro"
              >
                이름·이메일·문의 내용은 답변을 위해 수집하며, 답변 후 1년간
                보관됩니다.
              </span>
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="mt-2 text-helper text-ink">
              {errors.consent}
            </p>
          )}
        </div>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company_website">회사 웹사이트</label>
          <input
            id="company_website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {enabled && (
          <Turnstile key={state.attempt} siteKey={siteKey} onToken={setToken} />
        )}
        <input type="hidden" name="cf-turnstile-response" value={token} />
        {(captchaMessage || serverMessage) && (
          <p
            role="alert"
            className="rounded-lg bg-panel p-4 text-helper text-ink"
          >
            {captchaMessage || serverMessage}
          </p>
        )}
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="text-helper text-ink">
            입력 항목의 안내를 확인해 주세요.
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !enabled}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-violet px-8 py-3 text-ui-button text-white transition-colors hover:bg-violet-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "보내는 중…" : "문의 보내기"}
        </button>
      </fieldset>
    </form>
  );
}
