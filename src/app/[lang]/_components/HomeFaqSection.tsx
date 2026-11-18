import ButtonLink from "@/components/ui/ButtonLink";
import { getFaqs, type getHomeCopy } from "@/lib/content";

/** 메인 소식 아래에 FAQ 앞 질문 최대 4개를 접힌 채 보여 준다. 질문이 없으면 구간을 숨긴다(#81). */
export default async function HomeFaqSection({
  copy,
  lang,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["faq"];
  lang: string;
}) {
  const faqs = (await getFaqs()).slice(0, 4);
  if (!faqs.length) return null;
  return (
    <section className="home-faq home-section">
      <div className="public-wide" data-reveal>
        <div className="home-section-top">
          <h2 className="text-latest-heading">{copy.title}</h2>
          <ButtonLink href={`/${lang}/faq`}>{copy.link}</ButtonLink>
        </div>
        <div className="public-faq-list">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary className="text-faq-question">{item.question}</summary>
              <p className="text-faq-answer whitespace-pre-line text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
