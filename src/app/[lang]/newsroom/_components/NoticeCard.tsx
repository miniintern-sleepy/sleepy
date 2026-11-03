import Image from "next/image";

export default function NoticeCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-100 w-full cursor-pointer flex-col items-start overflow-hidden rounded-2xl bg-brand-pale p-6 text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <Image
        src="/images/newsroom/megaphone.webp"
        alt=""
        aria-hidden="true"
        width={320}
        height={320}
        className="pointer-events-none absolute -right-10 bottom-0 size-80 object-contain opacity-60 transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
      />
      <span className="relative mt-10 rounded bg-brand-lavender px-2 py-1 text-label text-brand">
        공지사항
      </span>
      <span className="relative mt-4 text-title text-brand-deep">공지사항</span>
      <span className="relative mt-3 text-body-sm text-fg-muted">
        슬리피의 공식 안내를 확인하세요.
      </span>
    </button>
  );
}
