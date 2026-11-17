"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UiCopy } from "@/content/ko/ui";
import type { Locale } from "@/lib/i18n";
import { Navigation } from "./HeaderNavigation";

type Copy = UiCopy["header"];

export default function HeaderClient({
  lang,
  copy,
}: {
  lang: Locale;
  copy: Copy;
}) {
  const pathname = usePathname();
  return <HeaderShell lang={lang} copy={copy} pathname={pathname} />;
}

export function HeaderShell({
  lang,
  copy,
  pathname,
}: {
  lang: Locale;
  copy: Copy;
  pathname?: string;
}) {
  return (
    <header className="site-header">
      <div className="site-wrap header-inner">
        <Link href={`/${lang}`} aria-label={copy.home} className="site-brand">
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
        <Navigation
          key={pathname}
          lang={lang}
          copy={copy}
          pathname={pathname}
        />
      </div>
    </header>
  );
}
