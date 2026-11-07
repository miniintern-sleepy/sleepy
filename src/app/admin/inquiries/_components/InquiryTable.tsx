import Link from "next/link";

import { formatReceivedAt } from "@/lib/mail/template";

import type { InquiryItem } from "../_lib/queries";

export default function InquiryTable({ items }: { items: InquiryItem[] }) {
  if (!items.length) return <p>해당하는 문의가 없습니다.</p>;
  return (
    <table className="w-full table-fixed text-left text-helper">
      <caption className="sr-only">문의 목록</caption>
      <thead className="border-b border-rule">
        <tr>
          <th scope="col" className="w-1/2 px-2 py-3 sm:w-auto">
            문의자·요약
          </th>
          <th scope="col" className="hidden px-2 py-3 md:table-cell">
            이메일·유형
          </th>
          <th scope="col" className="hidden px-2 py-3 lg:table-cell">
            접수 시각
          </th>
          <th scope="col" className="px-2 py-3">
            답변 상태
          </th>
          <th scope="col" className="px-2 py-3">
            상세
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-rule align-top">
            <th scope="row" className="px-2 py-4 font-ui-regular break-words">
              <p className="text-ui-label">{item.name}</p>
              <p className="mt-1 line-clamp-2 text-muted">{item.message}</p>
            </th>
            <td className="hidden px-2 py-4 break-all md:table-cell">
              {item.email}
              <br />
              {item.type === "product" ? "제품" : "일반"}
            </td>
            <td className="hidden px-2 py-4 lg:table-cell">
              {formatReceivedAt(item.createdAt)}
            </td>
            <td className="px-2 py-4 break-words">
              <span
                className={
                  item.status === "answered"
                    ? "text-success-ink"
                    : item.replyStatus === "failed"
                      ? "text-error-ink"
                      : "text-violet-strong"
                }
              >
                {item.status === "answered"
                  ? "답변 완료"
                  : item.replyStatus === "sending"
                    ? "발송 중"
                    : item.replyStatus === "failed"
                      ? "실패"
                      : "새 문의"}
              </span>
            </td>
            <td className="px-2 py-4">
              <Link
                href={`/admin/inquiries/${item.id}`}
                className="inline-flex min-h-11 items-center text-ink underline"
                aria-label={`${item.name}님의 문의 상세`}
              >
                보기
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
