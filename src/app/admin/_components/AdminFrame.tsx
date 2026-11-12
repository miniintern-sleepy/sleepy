import { Suspense, type ReactNode } from "react";

import { requireAdmin } from "../_lib/auth";
import { readNewInquiryCount } from "../inquiries/_lib/queries";
import AdminNav from "./AdminNav";

async function InquiryCount({
  result,
}: {
  result: ReturnType<typeof readNewInquiryCount>;
}) {
  const count = await result;
  return count.ok ? (
    <span
      className="admin-nav-count text-micro"
      aria-label={`새 문의 ${count.data}건`}
    >
      {count.data}
    </span>
  ) : (
    <span className="admin-nav-count text-meta">집계 실패</span>
  );
}

export default async function AdminFrame({
  children,
}: {
  children: ReactNode;
}) {
  const access = await requireAdmin();
  if (!access.ok)
    return (
      <main id="admin-main" className="admin-main admin-anonymous">
        {children}
      </main>
    );

  const count = readNewInquiryCount();
  return (
    <div className="admin-dashboard-shell">
      <a className="admin-skip-link text-helper" href="#admin-main">
        본문 바로가기
      </a>
      <AdminNav
        email={access.user.email}
        count={
          <Suspense
            fallback={
              <span
                className="admin-nav-count admin-placeholder text-micro"
                aria-label="새 문의 수를 불러오는 중"
              >
                …
              </span>
            }
          >
            <InquiryCount result={count} />
          </Suspense>
        }
      />
      <main id="admin-main" className="admin-main">
        <div className="admin-main-wrap">{children}</div>
      </main>
    </div>
  );
}
