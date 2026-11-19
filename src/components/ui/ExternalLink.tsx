import type { ReactNode } from "react";

export default function ExternalLink({
  href,
  className,
  children,
  newWindow = " (새 창)",
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** 화면 읽기용 새 창 안내. 언어에 맞게 넘긴다. */
  newWindow?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only">{newWindow}</span>
    </a>
  );
}
