import { Suspense } from "react";

import LoginForm from "./_components/LoginForm";
import LogoutForm from "./_components/LogoutForm";
import AdminNav from "./_components/AdminNav";
import { requireAdmin } from "./_lib/auth";

export default function AdminPage() {
  return (
    <Suspense fallback={<p role="status">로그인 상태를 확인하고 있습니다…</p>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const access = await requireAdmin();
  if (!access.ok) {
    if (access.reason === "unauthenticated") return <LoginForm />;

    return (
      <section className="space-y-5 rounded-control border border-rule bg-paper p-6 sm:p-8">
        <h1 className="text-form-aside">
          {access.reason === "forbidden"
            ? "접근 권한이 없습니다"
            : "인증 상태를 확인하지 못했습니다"}
        </h1>
        <p role="alert" className="admin-error text-helper">
          {access.reason === "forbidden"
            ? "관리자 계정으로 다시 로그인해 주세요."
            : "잠시 후 페이지를 새로 고쳐 주세요. 문제가 계속되면 담당자에게 문의해 주세요."}
        </p>
        <LogoutForm />
      </section>
    );
  }

  return (
    <section
      className="space-y-6 rounded-control border border-rule bg-paper p-6 sm:p-8"
      aria-labelledby="admin-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <h1 id="admin-title" className="text-form-aside">
            관리자 홈
          </h1>
          <p className="mt-3 text-helper break-all text-muted">
            {access.user.email}
          </p>
        </div>
        <LogoutForm />
      </div>
      <div className="border-t border-rule pt-6">
        <h2 className="text-form-title">콘텐츠 관리</h2>
        <div className="mt-4">
          <AdminNav active="/admin" />
        </div>
        <p className="mt-3 text-copy text-muted">
          FAQ, 제품 사양·구매 주소, 뉴스 기사와 문의 답변을 관리할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
