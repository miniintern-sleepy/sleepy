import { Suspense } from "react";

import AdminLoading from "./_components/AdminLoading";
import Dashboard from "./_components/Dashboard";
import LoginForm from "./_components/LoginForm";
import LogoutForm from "./_components/LogoutForm";
import { readAdminDashboard } from "./_lib/dashboard";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading variant="dashboard" />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const result = await readAdminDashboard();
  if (!result.ok) {
    if (result.reason === "unauthenticated") return <LoginForm />;
    return (
      <section
        data-admin-access-denied={result.reason === "forbidden" || undefined}
        className="space-y-5 rounded-control border border-rule bg-paper p-6 sm:p-8"
      >
        <h1 className="text-form-aside">
          {result.reason === "forbidden"
            ? "접근 권한이 없습니다"
            : "인증 상태를 확인하지 못했습니다"}
        </h1>
        <p role="alert" className="admin-error text-helper">
          {result.reason === "forbidden"
            ? "관리자 계정으로 다시 로그인해 주세요."
            : "잠시 후 페이지를 새로 고쳐 주세요. 문제가 계속되면 담당자에게 문의해 주세요."}
        </p>
        <LogoutForm />
      </section>
    );
  }
  return <Dashboard data={result.data} />;
}
