import { Suspense } from "react";

import AccessNotice from "../_components/AccessNotice";
import AdminNav from "../_components/AdminNav";
import ContentTable from "../_components/ContentTable";
import FaqForm from "../_components/FaqForm";
import { panelClass } from "../_components/form-ui";
import { readAdminFaqs } from "../_lib/content";
import { parseId } from "../_lib/validation";
import { deleteFaq } from "../content-actions";

export default function FaqPage(props: PageProps<"/admin/faq">) {
  return (
    <Suspense fallback={<p role="status">FAQ를 불러오고 있습니다…</p>}>
      <FaqContent {...props} />
    </Suspense>
  );
}

async function FaqContent({ searchParams }: PageProps<"/admin/faq">) {
  const result = await readAdminFaqs();
  if (!result.ok) return <AccessNotice reason={result.reason} />;
  const { edit } = await searchParams;
  const id = typeof edit === "string" ? parseId(edit) : null;
  const item = result.data.find((row) => row.id === id);
  return (
    <>
      <AdminNav active="/admin/faq" />
      <h1 className="mb-5 text-form-aside">FAQ 관리</h1>
      <div className="space-y-6">
        <section className={panelClass} aria-label="FAQ 목록">
          <ContentTable
            items={result.data.map((row) => ({
              id: row.id,
              title: row.question,
              isPublished: row.isPublished,
              extra: [String(row.sortOrder)],
            }))}
            path="/admin/faq"
            extraHeadings={["순서"]}
            deleteAction={deleteFaq}
          />
        </section>
        {edit !== undefined && !item ? (
          <p role="alert">
            수정할 항목이 없습니다. 목록에서 다시 선택해 주세요.
          </p>
        ) : (
          <FaqForm key={item?.id ?? "new"} item={item} />
        )}
      </div>
    </>
  );
}
