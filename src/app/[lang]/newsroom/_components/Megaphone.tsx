export default function Megaphone() {
  return (
    <span
      aria-hidden="true"
      className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand-lavender text-brand"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-11 -rotate-12"
      >
        <path
          d="M9 19h8l18-9v28l-18-9H9a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Z"
          fill="var(--color-surface)"
        />
        <path d="m13 29 3 11h7l-4-10M17 19v10M40 17l4-3M41 24h5M40 31l4 3" />
      </svg>
    </span>
  );
}
