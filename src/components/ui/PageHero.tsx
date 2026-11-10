import type { ReactNode } from "react";
import "./PageHero.css";

export default function PageHero({
  title,
  description,
  wave,
  children,
}: {
  title: string;
  description: string;
  wave: "newsroom" | "faq" | "contact" | "company" | "technology" | "product";
  children?: ReactNode;
}) {
  return (
    <header className={`page-hero page-hero-${wave}`}>
      <div className="public-wrap">
        <h1 className="text-page-hero-title whitespace-pre-line">{title}</h1>
        <p className="page-hero-description text-page-hero-description whitespace-pre-line text-ink">
          {description}
        </p>
        {children ? <div className="page-hero-actions">{children}</div> : null}
      </div>
    </header>
  );
}
