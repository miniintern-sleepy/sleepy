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
  if (failed)
    return (
      <span className="flex h-full items-center justify-center px-6 text-center text-body-sm text-fg-muted">
        {title} 이미지가 준비되지 않았습니다.
      </span>
    );
  return (
    <Image
      src={src}
      alt={title}
      fill
      unoptimized
      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 66vw"
      className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
