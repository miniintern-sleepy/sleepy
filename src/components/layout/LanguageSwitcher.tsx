"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { localeLabels, locales, type Locale } from "@/lib/i18n";

/**
 * 머리말 언어 선택. 지구본 + 현재 언어를 누르면 아래로 언어 목록이 펼쳐진다(#96).
 *
 * 주의: 바깥 클릭은 blur 대신 pointerdown으로 닫는다. macOS Safari는 버튼을 눌러도 초점을 주지 않아
 *       blur만으로는 다른 곳을 눌러도 목록이 닫히지 않는다.
 */
export default function LanguageSwitcher({
  lang,
  pathname,
  label,
}: {
  lang: Locale;
  pathname?: string;
  /** 버튼의 화면 읽기 이름 ("언어 선택") */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  // 지금 보는 화면을 그대로 두고 주소 맨 앞 언어만 바꾼다. /ko/product → /en/product
  const rest = pathname?.replace(/^\/[^/]+/, "") ?? "";

  return (
    <div
      ref={rootRef}
      className="language-switcher"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="language-toggle"
        aria-label={`${label}, ${localeLabels[lang].name}`}
        aria-expanded={open}
        aria-controls="language-menu"
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="language-icon">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span>{localeLabels[lang].short}</span>
      </button>
      <ul id="language-menu" className="language-menu" hidden={!open}>
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={`/${locale}${rest}`}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === lang ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {localeLabels[locale].name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
