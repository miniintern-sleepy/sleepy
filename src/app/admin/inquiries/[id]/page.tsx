import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { formatReceivedAt } from "@/lib/mail/template";

import AccessNotice from "../../_components/AccessNotice";
import AdminNav from "../../_components/AdminNav";
import { panelClass } from "../../_components/form-ui";
import ReplyForm from "../_components/ReplyForm";
import { readInquiry } from "../_lib/queries";

export default function InquiryPage(props: PageProps<"/admin/inquiries/[id]">) {
  return (
    <Suspense fallback={<p role="status">문의를 불러오고 있습니다…</p>}>
      <InquiryContent {...props} />
    </Suspense>
  );
}

async function InquiryContent({ params }: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await params;
  const result = await readInquiry(id);
  if (!result.ok) return <AccessNotice reason={result.reason} />;
  if (!result.data) notFound();
  const inquiry = result.data;
  return (
    <>
      <AdminNav active="/admin/inquiries" />
      <h1 className="mb-5 text-h3">문의 상세</h1>
      <div className="space-y-6">
        <section className={`${panelClass} space-y-4`} aria-label="접수한 문의">
          <dl className="space-y-3 text-body break-words">
            <div>
              <dt className="text-label">문의자</dt>
              <dd>{inquiry.name}</dd>
            </div>
            <div>
              <dt className="text-label">답변 받을 주소</dt>
              <dd className="break-all">{inquiry.email}</dd>
            </div>
            <div>
              <dt className="text-label">유형</dt>
              <dd>{inquiry.type === "product" ? "제품" : "일반"}</dd>
            </div>
            <div>
              <dt className="text-label">접수 시각</dt>
              <dd>{formatReceivedAt(inquiry.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-label">처리 상태</dt>
              <dd>{inquiry.status === "answered" ? "답변 완료" : "새 문의"}</dd>
            </div>
          </dl>
          <h2 className="text-title">문의 내용</h2>
          <p className="break-words whitespace-pre-wrap">{inquiry.message}</p>
        </section>
        <section
          className={`${panelClass} space-y-5`}
          aria-labelledby="reply-title"
        >
          <h2 id="reply-title" className="text-title">
            답변
          </h2>
          {inquiry.replyBody && (
            <div>
              <p className="text-label">저장된 답변</p>
              <p className="mt-2 break-words whitespace-pre-wrap">
                {inquiry.replyBody}
              </p>
            </div>
          )}
          {inquiry.answeredAt && (
            <p className="text-body-sm text-fg-muted">
              발송 접수: {formatReceivedAt(inquiry.answeredAt)}
            </p>
          )}
          {inquiry.replyEmailId && (
            <p className="text-body-sm break-all text-fg-muted">
              Resend 발송 ID: {inquiry.replyEmailId}
            </p>
          )}
          <ReplyForm
            key={`${inquiry.replyAttempt}-${inquiry.replyStatus}`}
            inquiry={inquiry}
          />
        </section>
        <Link
          href={
            inquiry.status === "answered"
              ? "/admin/inquiries?status=answered"
              : "/admin/inquiries"
          }
          className="inline-flex min-h-11 items-center text-brand-deep underline"
        >
          문의 목록으로
        </Link>
      </div>
    </>
  );
}
