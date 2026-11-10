import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";

const company = {
  name: "주식회사 슬리피",
  representative: "서정화",
  address: "서울특별시 성북구 화랑로 211, 105호",
  phone: "010-5502-0551",
  email: "sleeby00@gmail.com",
};

export default function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="footer-top">
          <Link href={`/${lang}`} aria-label="슬리피 홈" className="site-brand">
            <Image
              src="/images/layout/footer-logo.svg"
              alt="SLEEPY"
              width={76}
              height={17}
              className="site-logo"
            />
          </Link>
          <nav aria-label="하단 메뉴" className="footer-navigation">
            <Link href={`/${lang}/faq`}>FAQ</Link>
            <Link href={`/${lang}/contact`}>
              일반 문의 <span aria-hidden="true">↗</span>
            </Link>
            <Link href={`/${lang}/contact`}>
              제휴 문의 <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <address>
            {company.name} · 대표 {company.representative}
            <br />
            {company.address} · 고객센터 {company.phone}
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </address>
          <small>
            이 사이트는 쿠키 없이 방문 통계를 수집합니다.
            <br />© Sleepy Inc. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
