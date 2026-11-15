import ProductGallery from "./ProductGallery";
import type { ProductCopy } from "./types";

export default function GallerySection({
  copy,
}: {
  copy: ProductCopy["features"];
}) {
  return (
    <section
      className="product-gallery"
      aria-labelledby="product-gallery-title"
    >
      <h2 id="product-gallery-title" className="sr-only">
        {copy.title}
      </h2>
      <ProductGallery photos={copy.photos} />
    </section>
  );
}
