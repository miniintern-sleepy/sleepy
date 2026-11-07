import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["hero"];

const buttonClassName =
  "inline-flex min-h-13 min-w-30 items-center justify-center rounded-full border px-7.5 text-ui-button    motion-safe:transition-colors motion-safe:duration-200";

// 구매 주소가 없거나 https가 아니면 "출시 예정"으로 두고 눌러도 이동하지 않는다(F-06).
function PurchaseButton({ url, copy }: { url: string | null; copy: Copy }) {
  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonClassName} border-rule bg-paper text-ink hover:border-violet hover:text-violet`}
    >
      {copy.purchaseButton}
      <span className="sr-only">(새 창에서 열림)</span>
    </a>
  ) : (
    <button
      type="button"
      disabled
      className={`${buttonClassName} cursor-default border-rule bg-paper text-muted`}
    >
      {copy.comingSoon}
    </button>
  );
}

export default function HeroSection({
  copy,
  lang,
  purchaseUrl,
}: {
  copy: Copy;
  lang: Locale;
  purchaseUrl: string | null;
}) {
  return (
    <section aria-labelledby="home-title" className="text-center">
      <Reveal className="mx-auto max-w-360 bg-linear-to-b from-panel to-paper px-6 pt-16 pb-10 md:px-10 md:pt-24 md:pb-14 lg:px-20">
        <h1
          id="home-title"
          className="text-detail-heading whitespace-pre-line text-ink md:text-detail-heading lg:text-science-title"
        >
          {copy.title}
        </h1>
        <p className="mt-5 text-copy text-muted md:mt-6 md:text-science-intro">
          {copy.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-9">
          <Link
            href={`/${lang}/product`}
            className={`${buttonClassName} border-violet bg-violet text-white hover:border-violet-strong hover:bg-violet-strong`}
          >
            {copy.productButton}
          </Link>
          <PurchaseButton url={purchaseUrl} copy={copy} />
        </div>
      </Reveal>
      {/* 사진의 위아래 끝을 흰 배경으로 흐리게 해서 앞뒤 구간과 자연스럽게 이어 준다. */}
      <Reveal className="relative mx-auto max-w-360">
        <Image
          src="/images/home/hero.webp"
          alt={copy.imageAlt}
          width={2000}
          height={1333}
          sizes="(min-width: 1440px) 1440px, 100vw"
          loading="eager"
          className="aspect-4/3 w-full object-cover md:aspect-9/4"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-paper to-paper/0 md:h-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-paper to-paper/0 md:h-24"
        />
      </Reveal>
    </section>
  );
}
