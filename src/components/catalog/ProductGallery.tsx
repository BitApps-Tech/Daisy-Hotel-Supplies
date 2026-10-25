"use client";

import { useState } from "react";
import type { CatalogProduct } from "@/data/catalog";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const images = product.images.length ? product.images : [product.image];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <LuxuryProductImage
        src={images[active] || product.image}
        alt={product.title}
        variant="product"
        badges={product.badge ? [product.badge] : []}
        className="lg:aspect-[4/5]"
      />
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 8).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-[12px] ring-1 transition-all duration-300 ${
                active === index
                  ? "ring-[#B58E24]"
                  : "ring-black/10 hover:ring-[#B58E24]/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${product.title} ${index + 1}`}
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
