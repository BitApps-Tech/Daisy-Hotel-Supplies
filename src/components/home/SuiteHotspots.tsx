"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { luxuryEase } from "@/lib/motion";

export type HotspotProduct = {
  id: string;
  label: string;
  x: string;
  y: string;
  slug: string;
  title: string;
  image: string;
  badge: string | null;
};

export function SuiteHotspots({ hotspots }: { hotspots: HotspotProduct[] }) {
  const [active, setActive] = useState(hotspots[0]?.id ?? "");
  const current = hotspots.find((item) => item.id === active) ?? hotspots[0];

  if (!current) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="relative min-w-0 overflow-hidden rounded-[24px] lg:col-span-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/daisy/comforter/01.webp"
          alt="Inside a five-star suite"
          className="aspect-[16/11] w-full object-cover"
        />
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => setActive(hotspot.id)}
            style={{ left: hotspot.x, top: hotspot.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
              active === hotspot.id
                ? "h-5 w-5 border-[#D4AF37] bg-[#D4AF37]"
                : "h-4 w-4 border-[#D4AF37]/70 bg-[#0A0A0A]/60"
            }`}
            aria-label={hotspot.label}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#D4AF37]/30" />
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-col justify-center lg:col-span-5 lg:sticky lg:top-32 lg:h-fit">
        <p className="eyebrow-gold">Inside the Five-Star Suite</p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em] text-[#FAF8F5]">
          Every surface is specified
        </h2>
        <p className="mt-5 max-w-[42ch] text-base leading-[1.75] text-zinc-400">
          Open a hotspot to reveal a real catalog piece from Bed & Bath or Guest
          Comfort — the same specifications hotels procure through Daisy.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: luxuryEase }}
            className="mt-8 rounded-[16px] border border-[#D4AF37]/25 bg-[#121212] p-5"
          >
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.title}
                className="h-28 w-24 rounded-[12px] object-cover"
              />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  {current.label}
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-snug">
                  {current.title}
                </h3>
                {current.badge ? (
                  <p className="mt-2 font-mono text-[11px] text-zinc-500">
                    {current.badge}
                  </p>
                ) : null}
                <Link
                  href={`/products/${current.slug}`}
                  className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  View Specs →
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
