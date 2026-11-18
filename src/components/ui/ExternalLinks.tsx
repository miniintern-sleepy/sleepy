import ButtonLink from "./ButtonLink";
/**
 * 새 창으로 여는 외부 링크 목록. 주소가 빈 항목은 빼고, 모두 비면 아무것도 그리지 않는다.
 */
export default function ExternalLinks({
  links,
  className = "",
  newWindow,
}: {
  links: { label: string; href: string }[];
  className?: string;
  newWindow?: string;
}) {
  const ready = links.filter((link) => link.href.startsWith("https://"));
  if (ready.length === 0) return null;

  return (
    <ul className={`flex flex-col items-start gap-2 ${className}`}>
      {ready.map(({ label, href }) => (
        <li key={href}>
          <ButtonLink href={href} external newWindow={newWindow}>
            {label}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
