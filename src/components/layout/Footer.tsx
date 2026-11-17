import Image from "next/image";
import Link from "next/link";

import { getUiCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const company = {
  phone: "010-5502-0551",
  email: "sleeby00@gmail.com",
};

/**
 * 꼬리말(#96, PL이 준 참고 사진 배치).
 * 위: 로고 · 큰 문구 두 줄 | 오른쪽 링크. 구분선 아래: "이름 : 값" 회사 정보 두 줄, 맨 아래 저작권.
 * 참고 사진의 SNS 아이콘·사업자 등록번호 자리는 정보가 없어 링크로 대신했다.
 */
export default function Footer({ lang }: { lang: Locale }) {
  const ui = getUiCopy(lang);
  const t = ui.footer;
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="footer-top">
          <div className="footer-intro">
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
            <p className="footer-tagline">{t.tagline}</p>
            <p className="footer-tagline-sub">{t.taglineSub}</p>
          </div>
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
        <address className="footer-info">
          <p>
            <strong>{t.company}</strong>
            <span>
              {t.representativeLabel} : {t.representative}
            </span>
            <span>
              {t.addressLabel} : {t.address}
            </span>
          </p>
          <p>
            <span>
              {t.phoneLabel} : {company.phone}
            </span>
            <span>
              {t.emailLabel} :{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </span>
          </p>
        </address>
        <small className="footer-legal">
          © Sleepy Inc. All rights reserved. {t.analytics}
        </small>
      </div>
    </footer>
  );
}
