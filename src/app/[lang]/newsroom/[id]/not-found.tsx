import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-detail-heading text-ink">기사를 찾을 수 없습니다.</h1>
      <p className="mt-4 text-copy text-muted">
        삭제되었거나 공개되지 않은 소식입니다.
      </p>
      <Link
        href="/ko/newsroom"
        className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-violet px-6 py-3 text-ui-button text-white"
      >
        뉴스룸으로 돌아가기
      </Link>
    </div>
  );
}
