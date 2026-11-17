import Image from "next/image";
import Link from "next/link";

import { getUiCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const company = {
  phone: "010-5502-0551",
  email: "sleeby00@gmail.com",
};

export default function Footer({ lang }: { lang: Locale }) {
  const ui = getUiCopy(lang);
  const t = ui.footer;
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="footer-top">
          <Link
            href={`/${lang}`}
            aria-label={ui.header.home}
            className="site-brand"
          >
            <Image
              src="/images/layout/footer-logo.svg"
              alt="SLEEPY"
              width={76}
              height={17}
              className="site-logo"
            />
          </Link>
          <nav aria-label={t.menu} className="footer-navigation">
            <Link href={`/${lang}/faq`}>FAQ</Link>
            <Link href={`/${lang}/contact`}>
              {t.general} <span aria-hidden="true">↗</span>
            </Link>
            <Link href={`/${lang}/contact`}>
              {t.partnership} <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <address>
            {t.company} · {t.representativeLabel} {t.representative}
            <br />
            {t.address} · {t.phoneLabel} {company.phone}
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </address>
          <small>
            {t.analytics}
            <br />© Sleepy Inc. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
