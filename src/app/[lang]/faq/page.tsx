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
      <p className="border-y border-rule px-6 py-16 text-center text-copy text-muted">
        자주 묻는 질문을 곧 준비하겠습니다.
      </p>
    );
  }

  return (
    <div className="border-t border-rule">
      {faqs.map((faq, index) => (
        <Reveal key={faq.id}>
          <details open={index === 1} className="group border-b border-rule">
            <summary className="flex min-h-19 cursor-pointer list-none items-center gap-4 px-4 py-5 text-copy-large text-ink transition-colors hover:bg-panel sm:px-6 [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="shrink-0 text-ui-label text-violet"
              >
                Q
              </span>
              <span className="flex-1 break-keep">{faq.question}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-form-aside text-violet"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="bg-panel px-6 py-5 text-copy whitespace-pre-line text-muted sm:pr-12 sm:pl-16">
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
        <h1 className="text-page-title text-ink sm:text-page-title">FAQ</h1>
        <p className="mt-3 text-copy-large font-ui-regular text-violet sm:text-copy-intro">
          궁금한 내용을 확인하고, 필요한 문의를 남겨주세요.
        </p>
      </header>
      <aside
        aria-labelledby="faq-contact-title"
        className="mb-16 flex flex-col gap-6 rounded-xl bg-panel px-7 py-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="faq-contact-title" className="text-form-aside text-ink">
            문의하기
          </h2>
          <p className="mt-1.5 text-copy text-muted">
            원하시는 답변을 찾지 못하셨나요? 슬리피에 직접 문의해 주세요.
          </p>
        </div>
        <Link
          href={`/${lang}/contact?type=general`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-xl bg-violet px-8 py-3 text-ui-button text-white transition-colors hover:bg-violet-strong"
        >
          문의하기
        </Link>
      </aside>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-detail-heading text-ink">
          자주 묻는 질문
        </h2>
        <p className="mt-4 mb-4 text-copy text-muted">
          슬리피 제품 및 서비스 이용에 관한 질문을 모았습니다.
        </p>
        <Suspense
          fallback={
            <p
              role="status"
              className="border-y border-rule py-16 text-center text-copy text-muted"
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
