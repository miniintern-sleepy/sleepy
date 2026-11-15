"use client";
import Image from "next/image";
import { useState } from "react";

export default function NewsroomImage({
  src,
  featured = false,
}: {
  src: string | null;
  featured?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`newsroom-image ${featured ? "newsroom-image-featured" : ""}`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes={
            featured
              ? "(max-width: 767px) 100vw, 607px"
              : "(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 363px"
          }
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <span className="newsroom-logo" aria-hidden="true" />
      )}
    </span>
  );
}
