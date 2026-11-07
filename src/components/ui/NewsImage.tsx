"use client";

import Image from "next/image";
import { useState } from "react";

export default function NewsImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="public-news-thumb">
      {!failed && (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 520px) 82px, (max-width: 760px) 110px, 150px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
