import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import Reveal from "@/components/ui/Reveal";

import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "슬리피 제품과 서비스, 기업 제휴에 관한 문의를 남겨주세요.",
};

async function Form({
  lang,
  searchParams,
}: {
  lang: string;
  searchParams: PageProps<"/[lang]/contact">["searchParams"];
}) {
  const query = await searchParams;
  const initialType = query.type === "product" ? "product" : "general";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const enabled = Boolean(
    siteKey &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  return (
    <ContactForm
      initialType={initialType}
      key={initialType}
      lang={lang}
      siteKey={siteKey}
      enabled={enabled}
    />
  );
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  return (
    <main className="mx-auto max-w-7xl px-6 pt-16 pb-32 sm:px-10 sm:pt-24 lg:pb-64">
      <header className="text-center">
        <h1 className="text-h1 break-keep text-brand-deep sm:text-display">
          함께 이야기해요
        </h1>
        <p className="mt-3 text-body-lg font-normal break-keep text-brand sm:text-title">
          좋은 아이디어는 대화에서 시작됩니다.
        </p>
      </header>
      <div className="mt-16 grid items-start gap-12 lg:mt-40 lg:grid-cols-[400fr_736fr] lg:gap-16">
        <Reveal>
          <aside aria-labelledby="contact-guide-title">
            <h2 id="contact-guide-title" className="text-h2 text-brand-deep">
              문의 안내
            </h2>
            <p className="mt-6 text-body text-fg-muted">
              궁금한 사항을 남겨주시면 확인 후 답변드리겠습니다.
            </p>
            <dl className="mt-6">
              <div className="border-t border-line py-6">
                <dt className="text-label text-brand">이메일</dt>
                <dd className="mt-4 text-body-lg text-fg">
                  <a
                    href="mailto:sleeby00@gmail.com"
                    className="break-all hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    sleeby00@gmail.com
                  </a>
                </dd>
              </div>
              <div className="border-t border-line pt-6">
                <dt className="text-label text-brand">주소</dt>
                <dd className="mt-4 text-body-lg text-fg">
                  서울 성북구 화랑로 211, 105호
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-body-sm text-fg-muted">
              방문 전 이메일로 문의해 주세요.
            </p>
            <div className="relative mt-6 aspect-10/7 overflow-hidden rounded-xl bg-surface-image">
              <Image
                src="/images/contact/map.jpg"
                alt="서울 성북구 화랑로 211 주변 지도"
                fill
                sizes="(max-width: 1023px) 100vw, 400px"
                className="object-cover"
              />
              <Image
                src="/images/contact/pin.svg"
                alt=""
                width={32}
                height={40}
                className="absolute bottom-1/2 left-1/2 -translate-x-1/2"
              />
              <span className="absolute bottom-1/2 left-[56%] rounded-md bg-surface px-2.5 py-1 text-caption text-brand-deep">
                슬리피
              </span>
            </div>
            <p className="mt-2 text-caption text-fg-muted">
              ©{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                OpenStreetMap contributors
                <span className="sr-only"> (새 창)</span>
              </a>
            </p>
            <a
              href="https://map.kakao.com/link/map/슬리피,37.609348,127.053045"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center text-label text-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              지도 크게 보기 ↗<span className="sr-only"> (새 창)</span>
            </a>
          </aside>
        </Reveal>
        <Reveal className="min-w-0">
          <Suspense
            fallback={
              <p
                role="status"
                className="rounded-xl border border-line p-8 text-body text-fg-muted"
              >
                문의 화면을 준비하고 있습니다.
              </p>
            }
          >
            <Form lang={lang} searchParams={searchParams} />
          </Suspense>
        </Reveal>
      </div>
    </main>
  );
}
