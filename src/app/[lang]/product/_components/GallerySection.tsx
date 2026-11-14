import Reveal from "@/components/ui/Reveal";
import ProductGallery from "./ProductGallery";
import type { ProductCopy } from "./types";

export default function GallerySection({
  copy,
}: {
  copy: ProductCopy["features"];
}) {
  return (
    <section
      className="product-gallery public-wrap"
      aria-labelledby="product-gallery-title"
    >
      <Reveal>
        <h2
          id="product-gallery-title"
          className="text-detail-heading whitespace-pre-line"
        >
          {copy.title}
        </h2>
      </Reveal>
      <ProductGallery photos={copy.photos} />
    </section>
  );
}
