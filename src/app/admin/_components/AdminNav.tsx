"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import AdminIcon, { type AdminIconName } from "./AdminIcon";
import LogoutForm from "./LogoutForm";

const items = [
  { href: "/admin", label: "대시보드", icon: "dashboard" },
  { href: "/admin/inquiries", label: "문의", icon: "inquiries" },
  { href: "/admin/faq", label: "FAQ", icon: "faq" },
  { href: "/admin/product", label: "제품", icon: "product" },
  { href: "/admin/newsroom", label: "뉴스룸", icon: "news" },
] as const;

function Account({ email }: { email?: string }) {
  return (
    <div className="admin-account">
      <span
        className="admin-account-avatar text-study-title"
        aria-hidden="true"
      >
        관
      </span>
      <div className="admin-account-copy">
        <p className="text-helper font-ui-medium">관리자</p>
        <p className="admin-account-email text-meta" title={email}>
          {email}
        </p>
      </div>
    </div>
  );
}

export default function AdminNav({
  email,
  count,
}: {
  email?: string;
  count: ReactNode;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isOpen = openPath === pathname;
  const current = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
  const title = items.find((item) => current(item.href))?.label ?? "대시보드";
  function closeMenu() {
    setOpenPath(null);
    if (isOpen) toggleRef.current?.focus();
  }
  function menuLink(index: number, badge?: ReactNode) {
    const item = items[index];
    return (
      <Link
        href={item.href}
        className="admin-nav-link text-nav"
        aria-current={current(item.href) ? "page" : undefined}
        onClick={closeMenu}
      >
        <AdminIcon name={item.icon as AdminIconName} />
        <span>{item.label}</span>
        {badge}
      </Link>
    );
  }
  return (
    <>
      <aside
        className="admin-sidebar"
        data-open={isOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeMenu();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpenPath(null);
        }}
      >
        <div className="admin-brand">
          <Link href="/admin" aria-label="관리자 대시보드" onClick={closeMenu}>
            <Image
              src="/images/layout/admin-logo.svg"
              alt="슬리피"
              width={120}
              height={28}
            />
          </Link>
          <small className="text-micro">관리자</small>
          <button
            ref={toggleRef}
            type="button"
            className="admin-menu-toggle"
            aria-label={isOpen ? "닫기" : "메뉴"}
            aria-expanded={isOpen}
            aria-controls="admin-navigation"
            onClick={() => setOpenPath(isOpen ? null : pathname)}
          >
            <AdminIcon name="menu" />
          </button>
        </div>
        <nav
          id="admin-navigation"
          aria-label="관리 메뉴"
          className="admin-navigation"
        >
          {menuLink(0)}
          <div className="admin-nav-group">
            <p className="admin-nav-caption text-kicker">고객</p>
            {menuLink(1, count)}
          </div>
          <div className="admin-nav-group admin-nav-content">
            <p className="admin-nav-caption text-kicker">콘텐츠</p>
            {menuLink(2)}
            {menuLink(3)}
            {menuLink(4)}
          </div>
          <div className="admin-nav-footer">
            <Link
              href="/ko"
              className="admin-nav-link text-nav"
              onClick={closeMenu}
            >
              <AdminIcon name="home" />
              홈페이지 보기
            </Link>
            <LogoutForm menu />
            <div className="admin-account-mobile">
              <Account email={email} />
            </div>
          </div>
        </nav>
      </aside>
      <header className="admin-topbar">
        <p className="text-form-title font-ui-selected">{title}</p>
        <Account email={email} />
      </header>
    </>
  );
}
