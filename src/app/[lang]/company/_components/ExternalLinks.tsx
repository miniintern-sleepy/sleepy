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
    <ul className={`flex flex-wrap gap-x-8 ${className}`}>
      {ready.map(({ label, href }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="public-text-link"
          >
            {label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
