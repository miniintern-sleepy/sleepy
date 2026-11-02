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

const linkClassName =
  "inline-flex min-h-11 items-center gap-1 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-h-8";

export default function Footer({ lang }: { lang: Locale }) {
  const contactHref = `/${lang}/contact?type=general`;

  return (
    <footer className="shrink-0 bg-surface-muted text-fg">
      <div className="mx-auto max-w-7xl px-6 pt-9 pb-7 sm:px-10">
        <div className="flex min-h-8 items-center justify-between gap-6 border-b border-line pb-7">
          <Link
            href={`/${lang}`}
            aria-label="슬리피 홈"
            className="inline-flex min-h-8 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <Image
              src="/images/layout/footer-logo.svg"
              alt="SLEEPY"
              width={76}
              height={17}
            />
          </Link>
          {/* SNS 계정이 생기기 전에는 링크 없는 장식으로 둔다(D-33). */}
          <Image
            src="/images/layout/social-icons.svg"
            alt=""
            width={112}
            height={32}
          />
        </div>
        <div className="flex flex-col gap-6 pt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div>
            <div className="flex min-h-11 flex-wrap items-center gap-x-9 gap-y-2">
              <span className="text-label">개인정보처리방침</span>
              <span className="text-body-sm text-fg-muted">이용약관</span>
            </div>
            <address className="overflow-hidden text-caption text-fg-muted not-italic">
              {/* 각 줄 첫 항목의 구분점은 바깥으로 잘라 줄 앞에 점만 남지 않게 한다. */}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  company.name,
                  `대표 ${company.representative}`,
                  company.address,
                  `고객센터 ${company.phone}`,
                ].map((detail) => (
                  <span key={detail} className="relative max-w-full">
                    <span aria-hidden="true" className="absolute -left-2.5">
                      ·
                    </span>
                    {detail}
                  </span>
                ))}
              </div>
            </address>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-6 items-center text-caption text-fg-muted hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {company.email}
            </a>
            <p className="text-caption text-fg-muted">
              © Sleepy Inc. All rights reserved.
            </p>
          </div>
          <div className="text-body-sm lg:text-right">
            <div className="flex flex-wrap items-center gap-x-4 lg:justify-end">
              <span className="text-label">일반 문의</span>
              <div className="flex items-center gap-2 text-fg-muted">
                <Link href={`/${lang}/faq`} className={linkClassName}>
                  FAQ
                </Link>
                <span aria-hidden="true">·</span>
                <Link href={contactHref} className={linkClassName}>
                  <span>문의하기</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 lg:justify-end">
              <span className="text-label">제휴 문의</span>
              <span className="text-fg-muted">병의원·항공사 등</span>
              <Link
                href={contactHref}
                className={`${linkClassName} text-fg-muted`}
              >
                <span>제휴 문의하기</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
