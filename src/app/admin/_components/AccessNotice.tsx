import Link from "next/link";

import LogoutForm from "./LogoutForm";

export default function AccessNotice({
  reason,
}: {
  reason: "unauthenticated" | "forbidden" | "server";
}) {
  return (
    <section className="space-y-4 rounded-xl border border-rule bg-paper p-6">
      <h1 className="text-form-aside">
        {reason === "server"
          ? "데이터를 불러오지 못했습니다"
          : "관리자 로그인이 필요합니다"}
      </h1>
      <p role="alert">
        {reason === "server"
          ? "잠시 후 새로고침해 주세요. 문제가 계속되면 담당자에게 문의해 주세요."
          : reason === "forbidden"
            ? "관리자 권한이 없는 계정입니다."
            : "로그인한 뒤 다시 이용해 주세요."}
      </p>
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center text-ink underline"
      >
        관리자 로그인으로 이동
      </Link>
      {reason === "forbidden" && <LogoutForm />}
    </section>
  );
}
