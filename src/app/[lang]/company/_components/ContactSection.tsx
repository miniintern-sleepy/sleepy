import ContactBanner from "@/components/ui/ContactBanner";
import type { getCompanyCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["contact"];

// FAQ 아래 문의 배너와 같은 모양(글자 링크)으로 맞춘다. 보라 둥근 버튼은 쓰지 않는다(#90).
// 문의 폼은 들어온 화면에 따라 유형을 미리 고른다. 회사 소개에서는 "일반"이다(F-02).
export default function ContactSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  return (
    <ContactBanner
      lang={lang}
      copy={copy}
      href={`/${lang}/contact?type=general`}
      className="company-contact"
    />
  );
}
