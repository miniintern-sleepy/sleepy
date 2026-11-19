import Link from "next/link";
import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink";

/**
 * 사이트 공통 알약 버튼 링크(#98). 밑줄 글자 링크(TextLink)를 대신한다.
 *
 * 이유: 메인 방문자 절반만 제품으로 넘어갔고, 제품 섹션 링크가 작은 밑줄 글씨라 잘 안 보였다(2026-11-17 동선 점검).
 * 주의: primary는 제품·문의처럼 가장 눌러야 할 곳에만 쓴다. 전부 primary면 제품 버튼이 다시 묻힌다.
 */
export default function ButtonLink({
  href,
  children,
  variant = "secondary",
  className = "",
  external = false,
  arrow = true,
  size = "default",
  newWindow,
}: {
  href: string;
  children: ReactNode;
  /** primary: 보라 채움(주 버튼). secondary: 테두리(보조 버튼). */
  variant?: "primary" | "secondary";
  className?: string;
  /** 새 창으로 열고 화면 읽기용 "(새 창)"을 붙인다. */
  external?: boolean;
  /** false면 끝의 ↗를 뺀다(메인 첫 화면 제품 소개, #98). */
  arrow?: boolean;
  /** small: 한 단계 작은 버튼(40px·14px). 첫 화면 제품 소개·메인 회사 소개(#98). */
  size?: "default" | "small";
  newWindow?: string;
}) {
  const classes = [
    "public-button",
    `public-button-${variant}`,
    size === "small" && "public-button-small",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      {children}
      {arrow && <span aria-hidden="true">↗</span>}
    </>
  );

  return external ? (
    <ExternalLink href={href} className={classes} newWindow={newWindow}>
      {body}
    </ExternalLink>
  ) : (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}
