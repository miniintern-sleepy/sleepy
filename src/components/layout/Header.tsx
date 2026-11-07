import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import type { Locale } from "@/lib/i18n";

import HeaderNavigation, { Navigation } from "./HeaderNavigation";

import "./layout.css";

export default function Header({ lang }: { lang: Locale }) {
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
        <Suspense fallback={<Navigation lang={lang} />}>
          <HeaderNavigation lang={lang} />
        </Suspense>
      </div>
    </header>
  );
}
