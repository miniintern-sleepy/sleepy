import { Suspense } from "react";

import AccessNotice from "./_components/AccessNotice";
import AdminLoading from "./_components/AdminLoading";
import Dashboard from "./_components/Dashboard";
import LoginForm from "./_components/LoginForm";
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
  if (!result.ok)
    return result.reason === "unauthenticated" ? (
      <LoginForm />
    ) : (
      <AccessNotice reason={result.reason} />
    );
  return <Dashboard data={result.data} />;
}
