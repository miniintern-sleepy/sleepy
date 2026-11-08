"use client";

import type { ReactNode } from "react";

function scrollToForm(node: HTMLHeadingElement | null) {
  // 본문 스트리밍 뒤에 나타난 폼도 바로 가기의 목적지가 되게 한다(#57).
  if (node && node.ownerDocument.location.hash === `#${node.id}`)
    node.scrollIntoView({ block: "start", behavior: "instant" });
}

export default function FormHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      ref={scrollToForm}
      className="admin-form-heading text-form-title"
    >
      {children}
    </h2>
  );
}
