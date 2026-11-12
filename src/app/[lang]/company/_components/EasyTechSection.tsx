import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

import ExternalLinks from "./ExternalLinks";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["easyTech"];

export default function EasyTechSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  const center = copy.center.split("\n");
  return (
    <section
      aria-labelledby="company-tech"
      className="company-content company-section text-center"
    >
      <Reveal>
        <h2
          id="company-tech"
          className="text-form-aside md:text-detail-heading"
        >
          {copy.title}
        </h2>
        <div
          className="company-tech-diagram"
          role="img"
          aria-label={`${copy.left}와 ${copy.right}에 ${copy.caption}가 전달되어 ${copy.center.replace("\n", " ")}가 만들어집니다`}
        >
          <svg
            viewBox="0 0 780 210"
            className="company-tech-desktop"
            aria-hidden="true"
          >
            <g className="company-tech-ear">
              <circle cx="60" cy="60" r="60" className="fill-panel" />
              <text
                x="60"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink text-ui-label"
              >
                {copy.left}
              </text>
              <text
                x="60"
                y="145"
                textAnchor="middle"
                className="fill-muted text-micro"
              >
                {copy.caption}
              </text>
            </g>
            <g className="company-tech-ear">
              <circle cx="720" cy="60" r="60" className="fill-panel" />
              <text
                x="720"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink text-ui-label"
              >
                {copy.right}
              </text>
              <text
                x="720"
                y="145"
                textAnchor="middle"
                className="fill-muted text-micro"
              >
                {copy.caption}
              </text>
            </g>
            <g transform="translate(120 60)">
              <path
                className="company-tech-line company-tech-line-left stroke-rule"
                d="M0.358979 0.933346L195.359 75.9333"
                strokeWidth="2"
              />
            </g>
            <g transform="translate(465 60)">
              <path
                className="company-tech-line company-tech-line-right stroke-rule"
                d="M0.358979 75.9333L195.359 0.933346"
                strokeWidth="2"
              />
            </g>
            <g className="company-tech-center">
              <circle
                cx="390"
                cy="135"
                r="75"
                className="company-tech-pulse fill-violet"
              />
              <circle
                cx="390"
                cy="135"
                r="75"
                className="fill-paper stroke-rule"
              />
              <text
                x="390"
                y="128"
                textAnchor="middle"
                className="fill-ink text-ui-label"
              >
                {center.map((line, index) => (
                  <tspan key={line} x="390" dy={index === 0 ? 0 : "1.2em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          </svg>
          <div className="company-tech-mobile" aria-hidden="true">
            {[copy.left, copy.right].map((label) => (
              <div key={label} className="company-tech-ear">
                <span className="company-tech-ear-circle text-ui-label">
                  {label}
                </span>
                <span className="mt-3 block text-micro text-muted">
                  {copy.caption}
                </span>
              </div>
            ))}
            <div className="company-tech-center company-tech-center-circle text-ui-label whitespace-pre-line">
              <span className="company-tech-pulse" />
              {copy.center}
            </div>
          </div>
        </div>
        <p className="mt-8 text-copy whitespace-pre-line text-muted md:mt-10">
          {copy.description}
        </p>
        <Link href={`/${lang}/technology`} className="public-text-link mt-4">
          {copy.link}
        </Link>
        <ExternalLinks links={copy.videos} className="mt-2 justify-center" />
      </Reveal>
    </section>
  );
}
