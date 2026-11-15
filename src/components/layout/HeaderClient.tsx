"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { Navigation } from "./HeaderNavigation";

export default function HeaderClient({ lang }: { lang: Locale }) {
  const pathname = usePathname();
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
    <header className="site-header">
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
