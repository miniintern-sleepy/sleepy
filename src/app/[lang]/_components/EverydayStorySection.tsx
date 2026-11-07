import type { getHomeCopy } from "@/lib/content";
export default function EverydayStorySection({
  copy,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["everyday"];
}) {
  return (
    <section className="home-everyday home-section">
      <div className="public-wide">
        <h2 className="text-story-heading whitespace-pre-line">{copy.title}</h2>
        <div className="home-story-columns">
          {copy.paragraphs.map((p) => (
            <p
              key={p}
              className="text-copy-intro whitespace-pre-line text-muted"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
