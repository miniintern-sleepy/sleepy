import { Suspense } from "react";

import AccessNotice from "../_components/AccessNotice";
import AdminNav from "../_components/AdminNav";
import ContentTable from "../_components/ContentTable";
import NewsArticleForm from "../_components/NewsArticleForm";
import { panelClass } from "../_components/form-ui";
import { readAdminNews } from "../_lib/content";
import { parseId } from "../_lib/validation";
import { deleteNewsArticle } from "../content-actions";

const categories: Record<string, string> = {
  company: "기업 소식",
  press: "보도자료",
  notice: "공지사항",
};

export default function NewsroomPage(props: PageProps<"/admin/newsroom">) {
  return (
    <Suspense fallback={<p role="status">기사를 불러오고 있습니다…</p>}>
      <NewsroomContent {...props} />
    </Suspense>
  );
}

async function NewsroomContent({ searchParams }: PageProps<"/admin/newsroom">) {
  const result = await readAdminNews();
  if (!result.ok) return <AccessNotice reason={result.reason} />;
  const { edit } = await searchParams;
  const id = typeof edit === "string" ? parseId(edit) : null;
  const item = result.data.find((row) => row.id === id);
  return (
    <>
      <AdminNav active="/admin/newsroom" />
      <h1 className="mb-5 text-h3">뉴스룸 관리</h1>
      <div className="space-y-6">
        <section className={panelClass} aria-label="기사 목록">
          <ContentTable
            items={result.data.map((row) => ({
              id: row.id,
              title: row.title,
              isPublished: row.isPublished,
              extra: [
                categories[row.category] ?? row.category,
                row.publishedAt,
                row.isFeatured ? "주요 기사" : "일반",
              ],
            }))}
            path="/admin/newsroom"
            extraHeadings={["분류", "날짜", "주요 기사"]}
            deleteAction={deleteNewsArticle}
          />
        </section>
        {edit !== undefined && !item ? (
          <p role="alert">
            수정할 항목이 없습니다. 목록에서 다시 선택해 주세요.
          </p>
        ) : (
          <NewsArticleForm key={item?.id ?? "new"} item={item} />
        )}
      </div>
    </>
  );
}
