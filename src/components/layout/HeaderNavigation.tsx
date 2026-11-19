"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import type { UiCopy } from "@/content/ko/ui";
import type { Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

const menuGroups = [
  ["company", "technology"],
  ["product"],
  ["newsroom", "faq"],
] as const;

export function Navigation({
  lang,
  copy,
  pathname,
}: {
  lang: Locale;
  copy: UiCopy["header"];
  pathname?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const contactHref = `/${lang}/contact`;

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      className="header-navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          closeMenu();
          toggleRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? copy.menuClose : copy.menuOpen}
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* #96 글자 "메뉴" 상자 대신 아이콘. 이름은 aria-label이 맡는다. */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-icon">
          {isOpen ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <nav
        id="site-navigation"
        aria-label={copy.mainMenu}
        className="site-navigation"
        data-open={isOpen}
      >
        {/* #98 제품을 화면 가운데에 두려고 앞 2개·제품·뒤 2개로 나눈다. 휴대폰에서는 묶음을 풀어(display: contents) 한 줄씩 쌓는다. */}
        {menuGroups.map((group) => (
          <span key={group.join()} className="site-navigation-group">
            {group.map((path) => {
              const href = `/${lang}/${path}`;
              const current =
                pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <Link
                  key={path}
                  href={href}
                  aria-current={current ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {copy.nav[path]}
                </Link>
              );
            })}
          </span>
        ))}
        <Link
          href={contactHref}
          className="mobile-contact"
          aria-current={pathname === contactHref ? "page" : undefined}
          onClick={closeMenu}
        >
          {copy.contact} <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <div className="header-actions">
        <LanguageSwitcher
          lang={lang}
          pathname={pathname}
          label={copy.language}
        />
        <Link href={contactHref} className="header-contact">
          {copy.contact} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
