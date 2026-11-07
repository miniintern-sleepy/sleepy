import { Suspense } from "react";

import AccessNotice from "../_components/AccessNotice";
import AdminNav from "../_components/AdminNav";
import ContentTable from "../_components/ContentTable";
import ProductSpecForm from "../_components/ProductSpecForm";
import PurchaseUrlForm from "../_components/PurchaseUrlForm";
import { panelClass } from "../_components/form-ui";
import { readAdminProduct } from "../_lib/content";
import { parseId } from "../_lib/validation";
import { deleteProductSpec } from "../content-actions";

export default function ProductPage(props: PageProps<"/admin/product">) {
  return (
    <Suspense fallback={<p role="status">제품 정보를 불러오고 있습니다…</p>}>
      <ProductContent {...props} />
    </Suspense>
  );
}

async function ProductContent({ searchParams }: PageProps<"/admin/product">) {
  const result = await readAdminProduct();
  if (!result.ok) return <AccessNotice reason={result.reason} />;
  const { edit } = await searchParams;
  const id = typeof edit === "string" ? parseId(edit) : null;
  const item = result.data.specs.find((row) => row.id === id);
  return (
    <>
      <AdminNav active="/admin/product" />
      <h1 className="mb-5 text-form-aside">제품 관리</h1>
      <div className="space-y-6">
        <PurchaseUrlForm url={result.data.purchaseUrl} />
        <section className={panelClass} aria-label="제품 사양 목록">
          <ContentTable
            items={result.data.specs.map((row) => ({
              id: row.id,
              title: row.label,
              isPublished: row.isPublished,
              extra: [row.value, String(row.sortOrder)],
            }))}
            path="/admin/product"
            extraHeadings={["값", "순서"]}
            deleteAction={deleteProductSpec}
          />
        </section>
        {edit !== undefined && !item ? (
          <p role="alert">
            수정할 항목이 없습니다. 목록에서 다시 선택해 주세요.
          </p>
        ) : (
          <ProductSpecForm key={item?.id ?? "new"} item={item} />
        )}
      </div>
    </>
  );
}
