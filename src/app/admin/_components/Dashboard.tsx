import Link from "next/link";
import type { DashboardData, DashboardResult } from "../_lib/dashboard";
import AdminIcon, { type AdminIconName } from "./AdminIcon";

function Metric({
  label,
  result,
  unit,
  href,
  icon,
  primary = false,
  alert = false,
}: {
  label: string;
  result: DashboardResult<number>;
  unit: string;
  href: string;
  icon: AdminIconName;
  primary?: boolean;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className="admin-metric"
      data-primary={primary}
      data-alert={alert}
    >
      <div className="admin-metric-copy">
        {result.ok ? (
          <span className="admin-metric-number text-metric-number">
            {result.data}
            <small className="sr-only">{unit}</small>
          </span>
        ) : (
          <span className="admin-metric-error text-helper">집계 실패</span>
        )}
        <span className="admin-metric-label text-nav">{label}</span>
      </div>
      <AdminIcon name={icon} className="admin-metric-icon" />
    </Link>
  );
}

const dateFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const quickLinks = [
  {
    href: "/admin/product",
    label: "구매 링크 수정",
    icon: "product",
    arrow: "arrow",
  },
  {
    href: "/admin/faq#faq-form-title",
    label: "FAQ 추가",
    icon: "faq",
    arrow: "plus",
  },
  {
    href: "/admin/newsroom#news-form-title",
    label: "기사 추가",
    icon: "news",
    arrow: "plus",
  },
  {
    href: "/admin/inquiries",
    label: "문의 전체 보기",
    icon: "inquiries",
    arrow: "arrow",
  },
  { href: "/ko", label: "홈페이지 보기", icon: "home", arrow: "external" },
] as const;

export default function Dashboard({ data }: { data: DashboardData }) {
  return (
    <>
      <header className="admin-dashboard-heading">
        <h1 className="admin-dashboard-title text-form-aside">대시보드</h1>
      </header>
      <section className="admin-dashboard-metrics" aria-label="운영 현황">
        <Metric
          label="새 문의"
          result={data.newInquiries}
          unit="건"
          href="/admin/inquiries"
          icon="inquiries"
          primary
        />
        <Metric
          label="답변 발송 실패"
          result={data.failedReplies}
          unit="건"
          href="/admin/inquiries"
          icon="failed"
          alert={data.failedReplies.ok && data.failedReplies.data > 0}
        />
        <Metric
          label="공개 FAQ"
          result={data.publishedFaqs}
          unit="개"
          href="/admin/faq"
          icon="faq"
        />
        <Metric
          label="공개 뉴스"
          result={data.publishedNews}
          unit="개"
          href="/admin/newsroom"
          icon="news"
        />
      </section>
      <div className="admin-dashboard-columns">
        <section
          className="admin-dashboard-card"
          aria-labelledby="admin-todo-title"
        >
          <div className="admin-dashboard-section-heading">
            <h2 id="admin-todo-title" className="text-form-title">
              처리할 문의
            </h2>
            <Link
              className="admin-dashboard-more text-helper"
              href="/admin/inquiries"
            >
              전체 보기
            </Link>
          </div>
          {!data.inquiries.ok ? (
            <p role="alert" className="admin-error text-helper">
              문의를 불러오지 못했습니다.
            </p>
          ) : data.inquiries.data.length === 0 ? (
            <p className="admin-dashboard-empty text-helper text-muted">
              처리할 문의가 없습니다.
            </p>
          ) : (
            <table className="admin-dashboard-table" role="table">
              <caption className="sr-only">
                처리할 문의, 실패 우선 최신순 최대 9건
              </caption>
              <thead role="rowgroup">
                <tr role="row">
                  {["이름", "문의 유형", "받은 날짜", "상태"].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      role="columnheader"
                      className="text-helper font-ui-medium"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup">
                {data.inquiries.data.map((inquiry) => (
                  <tr key={inquiry.id} role="row" data-inquiry-row>
                    <td role="cell">
                      <Link
                        className="admin-inquiry-link text-helper font-ui-medium"
                        href={`/admin/inquiries/${inquiry.id}`}
                      >
                        {inquiry.name}
                        <span className="sr-only"> 문의 상세 보기</span>
                      </Link>
                    </td>
                    <td role="cell" className="text-helper text-muted">
                      {inquiry.type === "product" ? "제품 문의" : "일반 문의"}
                    </td>
                    <td
                      role="cell"
                      className="admin-inquiry-date text-helper text-muted"
                    >
                      <time dateTime={inquiry.created_at}>
                        {dateFormat
                          .format(new Date(inquiry.created_at))
                          .replaceAll("-", ".")}
                      </time>
                    </td>
                    <td role="cell">
                      <span
                        className="admin-inquiry-state text-helper"
                        data-state={
                          inquiry.reply_status === "failed" ? "failed" : "new"
                        }
                      >
                        <span className="admin-state-dot" aria-hidden="true" />
                        {inquiry.reply_status === "failed"
                          ? "발송 실패"
                          : "새 문의"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!data.newInquiries.ok ? (
            <p className="admin-dashboard-remaining text-helper">
              <Link href="/admin/inquiries?status=new">전체 보기</Link>
            </p>
          ) : data.newInquiries.data > 9 ? (
            <p className="admin-dashboard-remaining text-helper">
              <Link href="/admin/inquiries?status=new">
                외 {data.newInquiries.data - 9}건 더 있음 · 전체 보기
              </Link>
            </p>
          ) : null}
        </section>
        <section
          className="admin-dashboard-card admin-shortcuts"
          aria-labelledby="admin-shortcuts-title"
        >
          <div className="admin-dashboard-section-heading">
            <h2 id="admin-shortcuts-title" className="text-form-title">
              바로 가기
            </h2>
          </div>
          <div className="admin-dashboard-actions">
            {quickLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-study-title"
              >
                <span className="admin-shortcut-icon">
                  <AdminIcon name={item.icon} />
                </span>
                <span className="admin-shortcut-copy">
                  {item.label}
                  {index === 0 && (
                    <small
                      className={`text-meta ${data.purchaseUrl.ok ? "text-muted" : "text-error-ink"}`}
                    >
                      {data.purchaseUrl.ok
                        ? data.purchaseUrl.data
                          ? "링크 표시 중"
                          : "출시 예정"
                        : "상태 확인 실패"}
                    </small>
                  )}
                </span>
                <AdminIcon name={item.arrow} className="admin-shortcut-arrow" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
