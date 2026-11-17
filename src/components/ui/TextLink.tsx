import Link from "next/link";
import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink";
import TextLinkBody from "./TextLinkBody";

/** 사이트 공통 글자 링크(#88). 페이지에서 간격·폭·색을 덮어쓰지 않는다. */
export default function TextLink({
  href,
  children,
  className = "",
  external = false,
  size = "default",
  newWindow,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** 새 창으로 열고 화면 읽기용 "(새 창)"을 붙인다. */
  external?: boolean;
  size?: "default" | "compact";
  newWindow?: string;
}) {
  const classes = [
    "public-text-link",
    size === "compact" && "public-text-link-compact",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const body = <TextLinkBody>{children}</TextLinkBody>;

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
