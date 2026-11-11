export type AdminIconName =
  | "dashboard"
  | "inquiries"
  | "faq"
  | "product"
  | "news"
  | "home"
  | "logout"
  | "failed"
  | "menu"
  | "arrow"
  | "plus"
  | "external";

const shapes = {
  dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
  inquiries: <path d="M4 4h16l2 10v6H2v-6L4 4ZM2 14h6l2 3h4l2-3h6" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01" />
    </>
  ),
  product: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="5" />
      <path d="M3 11h18M10 15h4" />
    </>
  ),
  news: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h6" />
    </>
  ),
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z" />,
  logout: <path d="M9 3H3v18h6M9 12h12m-5-5 5 5-5 5" />,
  failed: <path d="m12 3 10 18H2L12 3ZM12 9v5M12 17h.01" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  plus: <path d="M12 4v16M4 12h16" />,
  external: <path d="M6 18 18 6M6 6h12v12" />,
};

export default function AdminIcon({
  name,
  className = "",
}: {
  name: AdminIconName;
  className?: string;
}) {
  return (
    <svg
      className={`admin-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[name]}
    </svg>
  );
}
