import ExternalLink from "./ExternalLink";
/**
 * 새 창으로 여는 외부 링크 목록. 주소가 빈 항목은 빼고, 모두 비면 아무것도 그리지 않는다.
 */
export default function ExternalLinks({
  links,
  className = "",
}: {
  links: { label: string; href: string }[];
  className?: string;
}) {
  const ready = links.filter((link) => link.href.startsWith("https://"));
  if (ready.length === 0) return null;

  return (
    <ul className={`flex flex-col items-start gap-2 ${className}`}>
      {ready.map(({ label, href }) => (
        <li key={href}>
          <ExternalLink
            href={href}
            className="public-text-link external-text-link"
          >
            {label}
            <span aria-hidden="true">↗</span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
