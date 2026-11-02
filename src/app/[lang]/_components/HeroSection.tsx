import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["hero"];

const buttonClassName =
  "inline-flex min-h-13 min-w-30 items-center justify-center rounded-full border px-7.5 text-button focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-safe:transition-colors motion-safe:duration-200";

// 구매 주소가 없거나 https가 아니면 "출시 예정"으로 두고 눌러도 이동하지 않는다(F-06).
function PurchaseButton({ url, copy }: { url: string | null; copy: Copy }) {
  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonClassName} border-line-image bg-surface text-fg hover:border-brand hover:text-brand`}
    >
      {copy.purchaseButton}
      <span className="sr-only">(새 창에서 열림)</span>
    </a>
  ) : (
    <button
      type="button"
      disabled
      className={`${buttonClassName} cursor-default border-line-image bg-surface text-fg-muted`}
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
    <section
      aria-labelledby="home-title"
      className="bg-linear-to-b from-brand-pale to-surface pt-16 pb-12 text-center md:pt-24 md:pb-20"
    >
      <Reveal className="mx-auto max-w-360 px-6 md:px-10 lg:px-20">
        <h1
          id="home-title"
          className="text-h2 whitespace-pre-line text-fg md:text-h1 lg:text-display"
        >
          {copy.title}
        </h1>
        <p className="mt-5 text-body text-fg-muted md:mt-6 md:text-title">
          {copy.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-9">
          <Link
            href={`/${lang}/product`}
            className={`${buttonClassName} border-brand bg-brand text-surface hover:border-brand-deep hover:bg-brand-deep`}
          >
            {copy.productButton}
          </Link>
          <PurchaseButton url={purchaseUrl} copy={copy} />
        </div>
      </Reveal>
      <Reveal className="mx-auto mt-10 max-w-280 px-6 md:mt-14 md:px-10">
        <Image
          src="/images/home/hero.jpg"
          alt={copy.imageAlt}
          width={2400}
          height={1600}
          sizes="(min-width: 1280px) 1120px, 100vw"
          loading="eager"
          className="aspect-4/3 w-full rounded-3xl object-cover shadow-xl md:aspect-1120/440"
        />
      </Reveal>
    </section>
  );
}
