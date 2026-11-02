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

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      className="md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2"
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
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 right-6 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:right-10 md:hidden"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {isOpen ? (
            <path d="m6 6 12 12M6 18 18 6" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <nav
        id="site-navigation"
        aria-label="주 메뉴"
        className={`${isOpen ? "block" : "hidden"} absolute inset-x-0 top-full border-y border-line bg-surface px-6 py-3 sm:px-10 md:static md:block md:h-full md:border-0 md:bg-transparent md:p-0`}
      >
        <ul className="flex flex-col md:h-full md:flex-row md:items-stretch md:gap-8 lg:gap-12">
          {menuItems.map(({ path, label }) => {
            const href = `/${lang}/${path}`;
            const isCurrent =
              pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <li key={path} className="md:flex">
                <Link
                  href={href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeMenu}
                  className={`relative flex min-h-12 items-center text-button whitespace-nowrap hover:text-brand focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand md:min-h-0 ${isCurrent ? "text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand" : "text-fg"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
