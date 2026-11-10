"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { Navigation } from "./HeaderNavigation";
import { isHomePath } from "./is-home-path";

export default function HeaderClient({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  // Cache Components는 이전 페이지를 숨겨 보존하므로 :has(.home-hero) 대신 주소로 판단한다(#68, 2026-11-10 확인).
  return <HeaderShell lang={lang} pathname={pathname} />;
}

export function HeaderShell({
  lang,
  pathname,
}: {
  lang: Locale;
  pathname?: string;
}) {
  return (
    <header
      className="site-header"
      data-overlay={isHomePath(pathname ?? null, lang) || undefined}
    >
      <div className="site-wrap header-inner">
        <Link href={`/${lang}`} aria-label="슬리피 홈" className="site-brand">
          <Image
            src="/images/layout/header-logo.svg"
            alt="SLEEPY"
            width={83}
            height={19}
            className="site-logo"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
        <Navigation key={pathname} lang={lang} pathname={pathname} />
      </div>
    </header>
  );
}
