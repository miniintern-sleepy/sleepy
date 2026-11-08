"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import LogoutForm from "./LogoutForm";

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

  function closeMenu() {
    setOpenPath(null);
    if (isOpen) toggleRef.current?.focus();
  }

  function menuLink(href: string, label: string, badge?: ReactNode) {
    const current =
      pathname === href ||
      (href !== "/admin" && pathname.startsWith(`${href}/`));
    return (
      <Link
        href={href}
        className="admin-nav-link text-nav"
        aria-current={current ? "page" : undefined}
        onClick={closeMenu}
      >
        {label}
        {badge}
      </Link>
    );
  }

  return (
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
            src="/images/layout/header-logo.svg"
            alt="슬리피"
            width={92}
            height={22}
          />
        </Link>
        <small className="text-micro text-muted">관리자</small>
        <button
          ref={toggleRef}
          type="button"
          className="admin-menu-toggle text-nav"
          aria-expanded={isOpen}
          aria-controls="admin-navigation"
          onClick={() => setOpenPath(isOpen ? null : pathname)}
        >
          {isOpen ? "닫기" : "메뉴"}
        </button>
      </div>
      <nav
        id="admin-navigation"
        aria-label="관리 메뉴"
        className="admin-navigation"
      >
        {menuLink("/admin", "대시보드")}
        <div className="admin-nav-group">
          <p className="admin-nav-caption text-kicker text-muted">고객</p>
          {menuLink("/admin/inquiries", "문의", count)}
        </div>
        <div className="admin-nav-group admin-nav-content">
          <p className="admin-nav-caption text-kicker text-muted">콘텐츠</p>
          {menuLink("/admin/faq", "FAQ")}
          {menuLink("/admin/product", "제품")}
          {menuLink("/admin/newsroom", "뉴스룸")}
        </div>
        <div className="admin-nav-footer">
          <Link
            href="/ko"
            className="admin-nav-link text-nav"
            onClick={closeMenu}
          >
            홈페이지 보기
          </Link>
          <LogoutForm menu />
          <p className="admin-account text-meta text-muted">{email}</p>
        </div>
      </nav>
    </aside>
  );
}
