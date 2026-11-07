"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";

const menuItems = [
  { path: "company", label: "회사 소개" },
  { path: "technology", label: "기술" },
  { path: "product", label: "제품" },
  { path: "newsroom", label: "뉴스룸" },
  { path: "faq", label: "FAQ" },
] as const;

export default function HeaderNavigation({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  return <Navigation key={pathname} lang={lang} pathname={pathname} />;
}

export function Navigation({
  lang,
  pathname,
}: {
  lang: Locale;
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
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        메뉴
      </button>
      <nav
        id="site-navigation"
        aria-label="주 메뉴"
        className="site-navigation"
        data-open={isOpen}
      >
        {menuItems.map(({ path, label }) => {
          const href = `/${lang}/${path}`;
          const current = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={path}
              href={href}
              aria-current={current ? "page" : undefined}
              onClick={closeMenu}
            >
              {label}
            </Link>
          );
        })}
        <Link
          href={contactHref}
          className="mobile-contact"
          aria-current={pathname === contactHref ? "page" : undefined}
          onClick={closeMenu}
        >
          문의하기
        </Link>
      </nav>
      <Link href={contactHref} className="header-contact">
        문의하기 <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
