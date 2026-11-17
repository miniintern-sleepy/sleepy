import { Suspense } from "react";
import { getUiCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import HeaderClient, { HeaderShell } from "./HeaderClient";
import "./layout.css";

export default function Header({ lang }: { lang: Locale }) {
  const copy = getUiCopy(lang).header;
  return (
    <Suspense fallback={<HeaderShell lang={lang} copy={copy} />}>
      <HeaderClient lang={lang} copy={copy} />
    </Suspense>
  );
}
