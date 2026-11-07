"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      size: "compact";
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
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
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
      size: "compact",
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
      <div
        ref={ref}
        className="min-h-16"
        aria-label="스팸 방지를 위한 보안 확인"
      />
      {failed && (
        <p role="alert" className="text-helper text-ink">
          보안 확인을 불러오지 못했습니다. 새로고침 후 다시 시도하거나 이메일로
          문의해 주세요.
        </p>
      )}
    </>
  );
}
