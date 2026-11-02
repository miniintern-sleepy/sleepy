import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import type { Locale } from "@/lib/i18n";

import HeaderNavigation, { Navigation } from "./HeaderNavigation";

type HeaderProps = {
  lang: Locale;
};

export default function Header({ lang }: HeaderProps) {
  return (
    <header className="relative z-10 h-22 shrink-0 border-b border-line bg-surface text-fg">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-6 sm:px-10">
        <Link
          href={`/${lang}`}
          aria-label="슬리피 홈"
          className="inline-flex min-h-11 shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Image
            src="/images/layout/header-logo.svg"
            alt="SLEEPY"
            width={83}
            height={19}
          />
        </Link>
        <Suspense fallback={<Navigation lang={lang} />}>
          <HeaderNavigation lang={lang} />
        </Suspense>
        <Image
          src="/images/layout/locale-ko.svg"
          alt="현재 언어: 한국어"
          width={68}
          height={44}
          className="mr-14 shrink-0 md:mr-0"
        />
      </div>
    </header>
  );
}
