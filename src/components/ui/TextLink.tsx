import Link from "next/link";
import type { ReactNode } from "react";

export default function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`public-text-link ${className}`}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
