import type { ReactNode } from "react";
import "./PageHero.css";

/**
 * 문장이 두 개 이상이면 문장마다 줄을 나눠 가운데 정렬한다(#96, 2026-11-17 PL 요청).
 * 마침표·물음표·느낌표 뒤 공백에서 자른다. 문구 안의 \n 줄바꿈은 그대로 둔다(whitespace-pre-line).
 */
function Sentences({ text }: { text: string }) {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length < 2) return text;
  return parts.map((part, index) => (
    <span key={index} className="block">
      {part}
    </span>
  ));
}

export default function PageHero({
  title,
  description,
  wave,
  children,
}: {
  title: string;
  description?: string;
  wave: "newsroom" | "faq" | "contact" | "company" | "technology" | "product";
  children?: ReactNode;
}) {
  return (
    <header className={`page-hero page-hero-${wave}`}>
      <div className="public-wrap">
        <h1 className="text-page-hero-title whitespace-pre-line">
          <Sentences text={title} />
        </h1>
        {description ? (
          <p className="page-hero-description text-page-hero-description whitespace-pre-line text-ink">
            <Sentences text={description} />
          </p>
        ) : null}
        {children ? <div className="page-hero-actions">{children}</div> : null}
      </div>
    </header>
  );
}
