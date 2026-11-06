import Link from "next/link";

import { readNewInquiryCount } from "../inquiries/_lib/queries";

export default async function AdminNav({ active }: { active?: string }) {
  const count = await readNewInquiryCount();
  return (
    <nav aria-label="관리 메뉴" className="mb-6 flex flex-wrap gap-2">
      {[
        ["/admin", "관리자 홈"],
        ["/admin/faq", "FAQ"],
        ["/admin/product", "제품"],
        ["/admin/newsroom", "뉴스룸"],
        [
          "/admin/inquiries",
          count.ok ? `문의 (새 문의 ${count.data}건)` : "문의 (집계 실패)",
        ],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={active === href ? "page" : undefined}
          className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 py-2 text-label text-brand-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-[current=page]:bg-brand-pale"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
