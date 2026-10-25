"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DaisyLogo } from "@/components/DaisyLogo";
import { fadeUp, luxuryEase, stagger } from "@/lib/motion";

const TICKER = [
  "300–400 TC Sateen",
  "500–700 GSM Bath",
  "Hotel Opening Packages",
  "Bulk Import Logistics",
  "Commercial Wash Rated",
  "Guest Room Turnkey",
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0A0A0A]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(212,175,55,0.12),transparent_45%),radial-gradient(ellipse_at_20%_80%,rgba(250,248,245,0.05),transparent_40%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url('/images/daisy/duvet-covers/01.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85))",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85))",
        }}
      />

      <div className="container-site relative flex min-h-[100svh] flex-col items-center justify-center pb-28 pt-36 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-4xl flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-10 flex justify-center">
            <DaisyLogo
              href={null}
              markClassName="h-36 w-auto sm:h-44 md:h-56 lg:h-64"
            />
          </motion.div>
          <motion.p variants={fadeUp} className="eyebrow-gold mb-6">
            Shop the Five-Star Suite
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl font-light leading-[1.02] tracking-[-0.02em] text-[#FAF8F5] sm:text-7xl lg:text-[5.5rem]"
          >
            The Architecture of{" "}
            <em className="italic text-[#E6C786]">Five-Star</em> Comfort
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[52ch] font-sans text-base leading-[1.75] text-zinc-400 sm:text-lg"
          >
            Direct international hospitality procurement for linens, guest
            amenities, banquet essentials, and the operational systems behind a
            polished arrival.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/collections"
              className="rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
            >
              Explore the Catalog
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#D4AF37]/40 px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Request a Wholesale Quote
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-[#D4AF37]/25 bg-[#0A0A0A]/80 py-4 backdrop-blur-md">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[...TICKER, ...TICKER].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-8 font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]"
            >
              {item}
            </span>
          ))}
        </motion.div>
        <span className="sr-only" style={{ transitionTimingFunction: String(luxuryEase) }} />
      </div>
    </section>
  );
}
