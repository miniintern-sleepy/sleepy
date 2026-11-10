import { Suspense } from "react";
import type { Locale } from "@/lib/i18n";
import HeaderClient, { HeaderShell } from "./HeaderClient";
import "./layout.css";

export default function Header({ lang }: { lang: Locale }) {
  return (
    <Suspense fallback={<HeaderShell lang={lang} />}>
      <HeaderClient lang={lang} />
    </Suspense>
  );
}
