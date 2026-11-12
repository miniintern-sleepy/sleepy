export default function AdminLoading({
  variant = "content",
}: {
  variant?: "auth" | "dashboard" | "content";
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="관리자 화면을 불러오는 중"
      className={`admin-loading admin-loading-${variant}`}
    >
      <span className="sr-only">관리자 화면을 불러오는 중입니다.</span>
      <div aria-hidden="true">
        <div className="admin-placeholder admin-placeholder-heading" />
        {variant === "auth" ? (
          <div className="admin-placeholder admin-placeholder-login" />
        ) : variant === "dashboard" ? (
          <>
            <div className="admin-dashboard-metrics admin-placeholder-metrics">
              {[0, 1, 2, 3].map((key) => (
                <div key={key} className="admin-placeholder" />
              ))}
            </div>
            <div className="admin-dashboard-columns">
              <div className="admin-placeholder admin-placeholder-list" />
              <div className="admin-placeholder admin-placeholder-list" />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="admin-placeholder admin-placeholder-list" />
            <div className="admin-placeholder admin-placeholder-form" />
          </div>
        )}
      </div>
    </div>
  );
}
