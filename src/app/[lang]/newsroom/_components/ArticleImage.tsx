"use client";

import Image from "next/image";
import { useState } from "react";

export default function ArticleImage({
  src,
  title,
  priority = false,
}: {
  src: string;
  title: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const imageFit =
    src === "/images/newsroom/startup-center.webp"
      ? "bg-surface object-contain"
      : "object-cover";
  const imagePosition =
    src === "/images/newsroom/article-07-interview.webp"
      ? "object-[50%_4%]"
      : src === "/images/newsroom/article-14-prototype.webp"
        ? "object-[50%_20%]"
        : "";
  if (failed)
    return <span aria-hidden="true" className="block h-full bg-brand-pale" />;
  return (
    <Image
      src={src}
      alt={title}
      fill
      unoptimized
      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
      className={`${imageFit} ${imagePosition} transition-transform duration-300 ease-out motion-reduce:transition-none ${src === "/images/newsroom/proposal.webp" ? "scale-110 object-left motion-safe:group-focus-within:scale-115 motion-safe:group-hover:scale-115" : "motion-safe:group-focus-within:scale-105 motion-safe:group-hover:scale-105"}`}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
