import Link from "next/link";

import type { ContentAction } from "../_lib/validation";
import DeleteForm from "./DeleteForm";

export default function ContentTable({
  items,
  path,
  extraHeadings,
  deleteAction,
}: {
  items: { id: number; title: string; isPublished: boolean; extra: string[] }[];
  path: string;
  extraHeadings: string[];
  deleteAction: ContentAction;
}) {
  if (!items.length)
    return <p className="py-4 text-fg-muted">등록된 항목이 없습니다.</p>;
  return (
    <table className="w-full table-fixed border-collapse text-body-sm">
      <caption className="sr-only">공개·비공개 전체 항목</caption>
      <thead>
        <tr className="border-b border-line text-left">
          <th scope="col" className="py-3 pr-2">
            제목
          </th>
          <th scope="col" className="w-12 py-3 sm:w-16">
            공개
          </th>
          {extraHeadings.map((label) => (
            <th
              key={label}
              scope="col"
              className="hidden w-24 py-3 md:table-cell"
            >
              {label}
            </th>
          ))}
          <th scope="col" className="w-12 py-3">
            수정
          </th>
          <th scope="col" className="w-12 py-3">
            삭제
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-line align-top">
            <th
              scope="row"
              className="py-3 pr-2 text-left font-normal wrap-anywhere"
            >
              {item.title}
            </th>
            <td className="py-3">{item.isPublished ? "공개" : "비공개"}</td>
            {item.extra.map((value, index) => (
              <td
                key={index}
                className="hidden py-3 wrap-anywhere md:table-cell"
              >
                {value}
              </td>
            ))}
            <td>
              <Link
                href={`${path}?edit=${item.id}`}
                aria-label={`${item.title} 수정`}
                className="inline-flex min-h-11 items-center px-1 text-label text-brand-deep underline focus-visible:outline-2 focus-visible:outline-brand"
              >
                수정
              </Link>
            </td>
            <td>
              <DeleteForm
                action={deleteAction}
                id={item.id}
                title={item.title}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
