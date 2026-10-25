"use client";

import Link from "next/link";
import type { CatalogProduct } from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";
import { cardBadges } from "@/lib/buyers-guide";

function subcategoryLabel(product: CatalogProduct) {
  return product.subcategorySlug.replace(/-/g, " ");
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { addToQuote } = useQuote();
  const badges = cardBadges(product);

  return (
    <article className="group flex flex-col text-zinc-900">
      <Link href={`/products/${product.slug}`} className="block">
        <LuxuryProductImage
          src={product.image}
          alt={product.title}
          variant="product"
          badges={badges}
        />
      </Link>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
        {subcategoryLabel(product)}
      </p>
      <Link href={`/products/${product.slug}`}>
        <h3 className="mt-1 font-serif text-xl font-medium leading-snug text-[#111111] transition-colors duration-300 group-hover:text-[#B58E24]">
          {product.title}
        </h3>
      </Link>
      {product.description ? (
        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{product.description}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 transition-colors duration-300 hover:text-[#B58E24]"
        >
          Specifications →
        </Link>
        <button
          type="button"
          onClick={() => addToQuote(product)}
          className="rounded-full border border-[#B58E24]/30 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-300 hover:satin-gold hover:border-transparent hover:text-[#0A0A0A]"
        >
          Add to Quote +
        </button>
      </div>
    </article>
  );
}
