import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import Reveal from "@/components/ui/Reveal";
import { getFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "슬리피 제품과 서비스에 관한 자주 묻는 질문을 확인하세요.",
};

async function Questions() {
  const faqs = await getFaqs();

  if (faqs.length === 0) {
    return (
      <p className="border-y border-line px-6 py-16 text-center text-body text-fg-muted">
        자주 묻는 질문을 곧 준비하겠습니다.
      </p>
    );
  }

  return (
    <div className="border-t border-line">
      {faqs.map((faq, index) => (
        <Reveal key={faq.id}>
          <details open={index === 1} className="group border-b border-line">
            <summary className="flex min-h-19 cursor-pointer list-none items-center gap-4 px-4 py-5 text-body-lg text-fg transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:px-6 [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="shrink-0 text-label text-brand"
              >
                Q
              </span>
              <span className="flex-1 break-keep">{faq.question}</span>
              <span aria-hidden="true" className="shrink-0 text-h3 text-brand">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="bg-brand-pale px-6 py-5 text-body whitespace-pre-line text-fg-muted sm:pr-12 sm:pl-16">
              {faq.answer}
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 pt-16 pb-20 sm:px-10 sm:pt-24">
      <header className="mb-9 text-center">
        <h1 className="text-h1 text-brand-deep sm:text-display">FAQ</h1>
        <p className="mt-3 text-body-lg font-normal text-brand sm:text-title">
          궁금한 내용을 확인하고, 필요한 문의를 남겨주세요.
        </p>
      </header>
      <aside
        aria-labelledby="faq-contact-title"
        className="mb-16 flex flex-col gap-6 rounded-xl bg-surface-muted px-7 py-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="faq-contact-title" className="text-h3 text-brand-deep">
            문의하기
          </h2>
          <p className="mt-1.5 text-body text-fg-muted">
            원하시는 답변을 찾지 못하셨나요? 슬리피에 직접 문의해 주세요.
          </p>
        </div>
        <Link
          href={`/${lang}/contact?type=general`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-xl bg-brand px-8 py-3 text-button text-surface transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          문의하기
        </Link>
      </aside>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-h2 text-brand-deep">
          자주 묻는 질문
        </h2>
        <p className="mt-4 mb-4 text-body text-fg-muted">
          슬리피 제품 및 서비스 이용에 관한 질문을 모았습니다.
        </p>
        <Suspense
          fallback={
            <p
              role="status"
              className="border-y border-line py-16 text-center text-body text-fg-muted"
            >
              질문을 불러오는 중입니다.
            </p>
          }
        >
          <Questions />
        </Suspense>
      </section>
    </main>
  );
}
