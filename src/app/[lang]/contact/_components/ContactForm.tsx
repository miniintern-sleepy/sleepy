"use client";

import Image from "next/image";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import TextLink from "@/components/ui/TextLink";
import type { UiCopy } from "@/content/ko/ui";
import { track } from "@/lib/analytics";
import { submitInquiry } from "../actions";
import { validateInquiry, type FieldErrors, type InquiryValues } from "./form";
import Turnstile from "./Turnstile";

const inquiryTypes = ["general", "product"] as const;

export default function ContactForm({
  initialType,
  siteKey,
  enabled,
  lang,
  email,
  t,
}: {
  initialType: "product" | "general";
  siteKey: string;
  enabled: boolean;
  lang: string;
  /** 접수가 안 될 때 대신 안내하는 회사 이메일 */
  email: string;
  /** 폼 문구. 오류 문장도 여기서 언어에 맞게 고른다. */
  t: UiCopy["contact"]["form"];
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
  // 검증은 서버와 같은 함수(한국어 문장)를 쓰고, 화면에는 항목별로 언어에 맞는 문장을 보여 준다.
  const found = { ...state.fieldErrors, ...clientErrors };
  const errors: FieldErrors = Object.fromEntries(
    Object.entries(found)
      .filter(([, message]) => message)
      .map(([field]) => [field, t.errors[field as keyof FieldErrors]]),
  );
  const inputClass = "contact-input";

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
      setCaptchaMessage(t.captchaRequired);
    }
  }

  // 제출 성공 때만 한 번 보낸다. 이름·이메일·내용은 보내지 않고 문의 유형만 보낸다(#71).
  const trackedAttempt = useRef(-1);
  useEffect(() => {
    if (!state.ok || trackedAttempt.current === state.attempt) return;
    trackedAttempt.current = state.attempt;
    track("inquiry_submit", { type: values.type });
  }, [state.ok, state.attempt, values.type]);

  if (state.ok && state.attempt !== dismissed) {
    return (
      <section aria-labelledby="contact-success" className="contact-success">
        <Image src="/images/contact/check.svg" alt="" width={80} height={80} />
        <h2
          id="contact-success"
          tabIndex={-1}
          ref={(node) => {
            node?.focus();
          }}
          className="text-form-title"
        >
          {t.successTitle}
        </h2>
        <p role="status" className="text-copy text-muted">
          {t.successBody}
          <br />
          {t.successThanks}
        </p>
        {/* 이메일을 잘못 적었으면 바로 알아차리도록 받을 주소를 다시 보여 준다(#77). */}
        <p className="contact-success-email text-copy">
          {t.successEmail} <strong>{values.email}</strong>
        </p>
        <div className="contact-success-links">
          <TextLink href={`/${lang}`}>{t.home}</TextLink>
          <button
            type="button"
            className="contact-button"
            onClick={() => {
              setValues(initialValues);
              setClientErrors({});
              setToken("");
              setDismissed(state.attempt);
            }}
          >
            {t.again}
          </button>
        </div>
      </section>
    );
  }
  const mailLink = <a href={`mailto:${email}`}>{email}</a>;
  const serverMessage =
    state.reason === "captcha" ? (
      t.captchaRetry
    ) : state.reason === "server" ? (
      <>
        {t.serverBefore}
        {mailLink}
        {t.mailAfter}
      </>
    ) : null;
  return (
    <form
      action={action}
      onSubmit={check}
      noValidate
      aria-labelledby="contact-form-title"
      className="contact-form"
    >
      <h2 id="contact-form-title" className="text-form-title">
        {t.title}
      </h2>
      {!enabled && (
        <p role="status" className="contact-unavailable text-helper">
          <strong>{t.unavailable}</strong> {t.mailBefore}
          {mailLink}
          {t.mailAfter}
        </p>
      )}
      <fieldset disabled={pending} className="contact-fields">
        <legend className="sr-only">{t.fields}</legend>
        <fieldset
          className="contact-field contact-type"
          aria-describedby={errors.type ? "type-error" : undefined}
        >
          <legend className="contact-label">
            <span className="contact-required" aria-hidden="true">
              *
            </span>
            {t.type}
            <span className="sr-only">{t.required}</span>
          </legend>
          <div className="contact-type-options">
            {inquiryTypes.map((value) => (
              <label key={value} className="contact-type-option">
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={values.type === value}
                  onChange={() => change("type", value)}
                  className="sr-only"
                />
                {t.types[value]}
              </label>
            ))}
          </div>
          {errors.type && (
            <p id="type-error" className="contact-field-error text-helper">
              {errors.type}
            </p>
          )}
        </fieldset>
        <div className="contact-form-row">
          <div className="contact-field">
            <label htmlFor="name" className="contact-label">
              <span className="contact-required" aria-hidden="true">
                *
              </span>
              {t.name}
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => change("name", e.target.value)}
              autoComplete="name"
              maxLength={50}
              required
              placeholder={t.namePlaceholder}
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="contact-field-error text-helper">
                {errors.name}
              </p>
            )}
          </div>
          <div className="contact-field">
            <label htmlFor="email" className="contact-label">
              <span className="contact-required" aria-hidden="true">
                *
              </span>
              {t.email}
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
              placeholder={t.emailPlaceholder}
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="contact-field-error text-helper">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="contact-field">
          <label htmlFor="message" className="contact-label">
            <span className="contact-required" aria-hidden="true">
              *
            </span>
            {t.message}
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={(e) => change("message", e.target.value)}
            maxLength={2000}
            required
            placeholder={t.messagePlaceholder}
            className={`${inputClass} resize-y`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          <p className="mt-1 text-right text-micro text-muted">
            {t.count.replace("{count}", String(values.message.length))}
          </p>
          {errors.message && (
            <p id="message-error" className="contact-field-error text-helper">
              {errors.message}
            </p>
          )}
        </div>
        <div className="contact-consent">
          <label htmlFor="consent">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => change("consent", e.target.checked)}
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={
                errors.consent ? "consent-error" : "consent-description"
              }
            />
            <span id="consent-description">{t.consent}</span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="contact-field-error text-helper">
              {errors.consent}
            </p>
          )}
        </div>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company_website">{t.honeypot}</label>
          <input
            id="company_website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {enabled && (
          <div className="contact-security">
            <Turnstile
              key={state.attempt}
              siteKey={siteKey}
              email={email}
              onToken={setToken}
              text={t}
            />
          </div>
        )}
        <input type="hidden" name="cf-turnstile-response" value={token} />
        {(captchaMessage || serverMessage) && (
          <p role="alert" className="contact-notice text-helper">
            {captchaMessage || serverMessage}
          </p>
        )}
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="contact-field-error text-helper">
            {t.checkFields}
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !enabled}
          className="contact-button"
        >
          {pending ? t.sending : t.submit}
        </button>
      </fieldset>
    </form>
  );
}
