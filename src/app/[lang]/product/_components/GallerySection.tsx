import ProductGallery from "./ProductGallery";
import type { UiCopy } from "@/content/ko/ui";
import type { ProductCopy } from "./types";

export default function GallerySection({
  copy,
  ui,
}: {
  copy: ProductCopy["features"];
  ui: UiCopy["product"];
}) {
  return (
    <section
      className="product-gallery"
      aria-labelledby="product-gallery-title"
    >
      <h2 id="product-gallery-title" className="sr-only">
        {copy.title}
      </h2>
      <ProductGallery photos={copy.photos} ui={ui} />
    </section>
  );
}
