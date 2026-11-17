"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import type { UiCopy } from "@/content/ko/ui";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      size: "flexible";
      theme: "light";
      callback: (token: string) => void;
      "response-field": boolean;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function Turnstile({
  siteKey,
  email,
  onToken,
  text,
}: {
  siteKey: string;
  email: string;
  onToken: (token: string) => void;
  text: Pick<
    UiCopy["contact"]["form"],
    "security" | "securityFailed" | "mailAfter"
  >;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onToken("");
    if (!ready || !ref.current || !window.turnstile) return;
    const api = window.turnstile;
    const id = api.render(ref.current, {
      sitekey: siteKey,
      action: "contact",
      // 가로형(높이 65px)으로 두어 동의 체크와 보내기 버튼 사이가 비어 보이지 않게 한다(#77).
      size: "flexible",
      theme: "light",
      "response-field": false,
      callback: (token) => {
        setFailed(false);
        onToken(token);
      },
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        setFailed(true);
        onToken("");
      },
    });
    return () => api.remove(id);
  }, [ready, siteKey, onToken]);

  return (
    <>
      <Script
        id="contact-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      <div ref={ref} className="min-h-16" aria-label={text.security} />
      {failed && (
        <p role="alert" className="contact-notice text-helper">
          {text.securityFailed}
          <a href={`mailto:${email}`}>{email}</a>
          {text.mailAfter}
        </p>
      )}
    </>
  );
}
