"use client";

import { useState } from "react";
import type { CatalogProduct } from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";

const PRESETS = [50, 100, 250, 500];

export function AddToQuotePanel({ product }: { product: CatalogProduct }) {
  const { addToQuote } = useQuote();
  const [quantity, setQuantity] = useState(50);

  return (
    <div className="mt-8 rounded-[16px] border border-black/[0.08] bg-[#F2EFE9] p-6">
      <p className="eyebrow-bronze">Wholesale quantity</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setQuantity(preset)}
            className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
              quantity === preset
                ? "border-transparent satin-gold text-[#0A0A0A]"
                : "border-black/[0.08] text-zinc-600 hover:border-[#B58E24]/40"
            }`}
          >
            {preset === 500 ? "500+" : preset}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value) || 1)}
          className="w-28 rounded-full border border-black/[0.08] bg-[#FAF8F5] px-4 py-3 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => addToQuote(product, quantity)}
          className="rounded-full satin-gold px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
        >
          Add to Wholesale Quote
        </button>
      </div>
    </div>
  );
}
