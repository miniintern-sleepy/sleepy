import Link from "next/link";
import { Suspense } from "react";

import AccessNotice from "../_components/AccessNotice";
import AdminNav from "../_components/AdminNav";
import { panelClass } from "../_components/form-ui";
import InquiryTable from "./_components/InquiryTable";
import { inquiryPageSize, readInquiries } from "./_lib/queries";

export default function InquiriesPage(props: PageProps<"/admin/inquiries">) {
  return (
    <Suspense fallback={<p role="status">문의를 불러오고 있습니다…</p>}>
      <InquiriesContent {...props} />
    </Suspense>
  );
}

async function InquiriesContent({
  searchParams,
}: PageProps<"/admin/inquiries">) {
  const params = await searchParams;
  const status = params.status === "answered" ? "answered" : "new";
  const page =
    typeof params.page === "string" &&
    /^\d+$/.test(params.page) &&
    Number(params.page) >= 1 &&
    Number(params.page) <= 100000
      ? Number(params.page)
      : 1;
  const result = await readInquiries(status, page);
  if (!result.ok) return <AccessNotice reason={result.reason} />;
  const pages = Math.max(1, Math.ceil(result.data.total / inquiryPageSize));
  const path = (target: number) =>
    `/admin/inquiries?status=${status}&page=${target}`;
  return (
    <>
      <AdminNav active="/admin/inquiries" />
      <h1 className="mb-5 text-h3">문의 관리</h1>
      <nav aria-label="문의 상태" className="mb-5 flex flex-wrap gap-4">
        <Link
          href="/admin/inquiries"
          aria-current={status === "new" ? "page" : undefined}
          className="inline-flex min-h-11 items-center text-brand-deep underline"
        >
          새 문의
        </Link>
        <Link
          href="/admin/inquiries?status=answered"
          aria-current={status === "answered" ? "page" : undefined}
          className="inline-flex min-h-11 items-center text-brand-deep underline"
        >
          답변 완료
        </Link>
      </nav>
      <section
        className={panelClass}
        aria-label={status === "new" ? "새 문의 목록" : "답변 완료 목록"}
      >
        <p className="mb-4 text-body-sm text-fg-muted">
          {status === "new" ? "새 문의" : "답변 완료"} {result.data.total}건
        </p>
        <InquiryTable items={result.data.items} />
        <nav
          aria-label="문의 페이지"
          className="mt-5 flex flex-wrap items-center gap-5"
        >
          {page > 1 && (
            <Link
              href={path(page - 1)}
              className="inline-flex min-h-11 items-center text-brand-deep underline"
            >
              이전
            </Link>
          )}
          <span>
            {page} / {pages} 페이지
          </span>
          {page < pages && (
            <Link
              href={path(page + 1)}
              className="inline-flex min-h-11 items-center text-brand-deep underline"
            >
              다음
            </Link>
          )}
        </nav>
      </section>
    </>
  );
}
