import Link from "next/link";

import type { DashboardData, DashboardResult } from "../_lib/dashboard";

function Metric({
  label,
  result,
  unit,
  href,
  alert = false,
}: {
  label: string;
  result: DashboardResult<number>;
  unit: string;
  href: string;
  alert?: boolean;
}) {
  return (
    <Link href={href} className="admin-metric" data-alert={alert}>
      <span className="admin-metric-label text-nav">{label}</span>
      {result.ok ? (
        <span className="admin-metric-number text-metric-number">
          {result.data}
          <small className="text-copy-intro">{unit}</small>
        </span>
      ) : (
        <span className="admin-metric-error text-helper text-error-ink">
          집계 실패
        </span>
      )}
    </Link>
  );
}

function Summary({ data }: { data: DashboardData }) {
  if (!data.newInquiries.ok || !data.failedReplies.ok)
    return (
      <p className="text-copy-intro text-muted">
        운영 현황과 처리할 문의를 확인해 주세요.
      </p>
    );
  return (
    <p className="text-copy-intro text-muted">
      새 문의{" "}
      <b className="font-ui-medium text-violet-strong">
        {data.newInquiries.data}건
      </b>
      {data.failedReplies.data > 0 ? (
        <>
          {" "}
          중 답변 발송 실패{" "}
          <b className="font-ui-medium text-error-ink">
            {data.failedReplies.data}건
          </b>
          을 먼저 확인해 주세요.
        </>
      ) : (
        "을 확인해 주세요."
      )}
    </p>
  );
}

const dateFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function Dashboard({ data }: { data: DashboardData }) {
  return (
    <>
      <header className="admin-dashboard-heading">
        <div>
          <h1 className="text-form-aside">대시보드</h1>
          <Summary data={data} />
        </div>
      </header>
      <section className="admin-dashboard-metrics" aria-label="운영 현황">
        <Metric
          label="새 문의"
          result={data.newInquiries}
          unit="건"
          href="/admin/inquiries"
        />
        <Metric
          label="답변 발송 실패"
          result={data.failedReplies}
          unit="건"
          href="/admin/inquiries"
          alert={data.failedReplies.ok && data.failedReplies.data > 0}
        />
        <Metric
          label="공개 FAQ"
          result={data.publishedFaqs}
          unit="개"
          href="/admin/faq"
        />
        <Metric
          label="공개 뉴스"
          result={data.publishedNews}
          unit="개"
          href="/admin/newsroom"
        />
      </section>
      <div className="admin-dashboard-columns">
        <section aria-labelledby="admin-todo-title">
          <div className="admin-dashboard-section-heading">
            <h2 id="admin-todo-title" className="text-form-title">
              처리할 문의
            </h2>
            <Link
              className="admin-dashboard-more text-text-link"
              href="/admin/inquiries"
            >
              전체 보기 ↗
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
            <ul className="admin-dashboard-list">
              {data.inquiries.data.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    className="admin-dashboard-row"
                    href={`/admin/inquiries/${inquiry.id}`}
                    data-failed={inquiry.reply_status === "failed"}
                  >
                    <span className="admin-inquiry-state text-meta">
                      {inquiry.reply_status === "failed"
                        ? "발송 실패"
                        : "새 문의"}
                    </span>
                    <span className="admin-inquiry-name text-study-title">
                      {inquiry.name}
                      <span className="text-helper text-muted">
                        {inquiry.type === "product" ? "제품 문의" : "일반 문의"}
                      </span>
                    </span>
                    <time
                      dateTime={inquiry.created_at}
                      className="admin-inquiry-date text-meta text-muted"
                    >
                      {dateFormat
                        .format(new Date(inquiry.created_at))
                        .replaceAll("-", ".")}
                    </time>
                    <span className="admin-inquiry-preview text-helper text-muted">
                      {inquiry.message}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="admin-dashboard-aside">
          <section className="admin-purchase-state" aria-label="구매 버튼 상태">
            <p className="text-nav font-ui-regular text-muted">구매 버튼</p>
            {data.purchaseUrl.ok ? (
              <>
                <p className="admin-purchase-value text-form-title">
                  {data.purchaseUrl.data ? "구매 링크 표시 중" : "출시 예정"}
                </p>
                <p className="text-helper text-muted">
                  {data.purchaseUrl.data
                    ? "공개 화면의 구매 버튼이 설정한 주소로 연결됩니다."
                    : "구매 주소를 넣으면 공개 화면에 구매 링크가 표시됩니다."}
                </p>
              </>
            ) : (
              <p role="alert" className="text-helper text-error-ink">
                구매 상태를 불러오지 못했습니다.
              </p>
            )}
            <Link
              href="/admin/product"
              className="admin-dashboard-more text-text-link"
            >
              구매 주소 관리 ↗
            </Link>
          </section>
          <section aria-label="바로 가기">
            <p className="admin-dashboard-caption text-kicker text-muted">
              바로 가기
            </p>
            <div className="admin-dashboard-actions">
              <Link href="/admin/faq" className="text-study-title">
                FAQ 추가
                <span
                  aria-hidden="true"
                  className="text-ui-glyph text-violet-strong"
                >
                  +
                </span>
              </Link>
              <Link href="/admin/newsroom" className="text-study-title">
                기사 추가
                <span
                  aria-hidden="true"
                  className="text-ui-glyph text-violet-strong"
                >
                  +
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
