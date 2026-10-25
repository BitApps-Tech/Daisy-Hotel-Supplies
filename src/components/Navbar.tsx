"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { DaisyLogo } from "@/components/DaisyLogo";
import { useQuote } from "@/context/QuoteContext";
import type { MegaColumn } from "@/lib/nav";
import { luxuryEase } from "@/lib/motion";

export function Navbar({ columns }: { columns: MegaColumn[] }) {
  const { itemCount, openQuote } = useQuote();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const insetClass = scrolled ? "px-0 pt-0" : "px-4 pt-4 md:px-8";
  const contentPadClass = scrolled
    ? "max-w-site px-6 sm:px-10 lg:px-16"
    : "px-6 md:px-10";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`pointer-events-none w-full transition-[padding] duration-500 ease-luxury ${insetClass}`}
      >
        {/* Black bar only — panels sit outside so they never inherit the pill / gold stroke */}
        <motion.div
          className="pointer-events-auto overflow-hidden border bg-[#0A0A0A]/95 text-white shadow-2xl backdrop-blur-xl"
          initial={false}
          animate={
            scrolled
              ? {
                  borderRadius: 0,
                  borderColor: "rgba(212, 175, 55, 0.38)",
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 1,
                }
              : {
                  borderRadius: 9999,
                  borderColor: "rgba(212, 175, 55, 0.25)",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                }
          }
          transition={{ duration: 0.55, ease: luxuryEase }}
        >
          <div
            className={`mx-auto w-full transition-[padding] duration-500 ease-luxury ${contentPadClass}`}
          >
            <nav className="flex items-center justify-between py-3.5">
              <DaisyLogo
                className="shrink-0"
                markClassName="h-11 w-auto md:h-12"
                onClick={() => setMenuOpen(false)}
              />

              <div className="flex items-center gap-4 md:gap-7">
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setMenuOpen((open) => !open);
                  }}
                  className="hidden items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37] sm:inline-flex"
                >
                  Categories
                  <ChevronDown
                    aria-hidden
                    strokeWidth={2.25}
                    className={`h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-300 ease-luxury ${
                      menuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <Link
                  href="/collections"
                  className="hidden font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37] md:inline-flex"
                >
                  All Collections
                </Link>
                <Link
                  href="/about"
                  className="hidden font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37] lg:inline-flex"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="hidden font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37] lg:inline-flex"
                >
                  Contact
                </Link>
                <button
                  type="button"
                  aria-label="Search catalog"
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen((open) => !open);
                  }}
                  className="text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
                <button
                  type="button"
                  onClick={openQuote}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  Quote Bag ({itemCount})
                </button>
                <button
                  type="button"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] sm:hidden"
                  onClick={() => {
                    setSearchOpen(false);
                    setMenuOpen((open) => !open);
                  }}
                >
                  {menuOpen ? "Close" : "Menu"}
                </button>
              </div>
            </nav>
          </div>
        </motion.div>

        <div
          className={`pointer-events-auto mx-auto w-full transition-[padding] duration-500 ease-luxury ${contentPadClass}`}
        >
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: luxuryEase }}
                className="mt-3 rounded-[28px] border border-[#B58E24]/20 bg-[#FAF8F5] p-4 text-zinc-900 shadow-[0_35px_90px_rgba(0,0,0,0.55)] md:p-6"
              >
                <form action="/collections" method="get" className="flex gap-3">
                  <input
                    name="q"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search linens, amenities, banquet…"
                    className="w-full rounded-full border border-black/[0.08] bg-white px-5 py-3 font-sans text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-[#B58E24]/50"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full satin-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: luxuryEase }}
                className="mt-3 max-h-[78vh] overflow-y-auto rounded-[28px] border border-[#B58E24]/20 bg-[#FAF8F5] p-8 text-zinc-900 shadow-[0_35px_90px_rgba(0,0,0,0.55)] md:p-12"
              >
                <nav className="mb-8 border-b border-[#B58E24]/25 pb-6 lg:hidden">
                  <p className="mb-4 font-sans text-sm font-semibold tracking-wide text-[#B58E24]">
                    Navigate
                  </p>
                  <ul className="space-y-1">
                    {(
                      [
                        ["/collections", "All Collections"],
                        ["/about", "About Us"],
                        ["/contact", "Contact"],
                      ] as const
                    ).map(([href, label]) => (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-zinc-800 transition-colors duration-300 hover:text-[#B58E24]"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="grid gap-10 lg:grid-cols-12">
                  {columns.map((column, index) => (
                    <div
                      key={column.id}
                      className={`${
                        column.wide
                          ? "lg:col-span-5"
                          : column.id === "guest"
                            ? "lg:col-span-3"
                            : "lg:col-span-4"
                      } ${
                        index < columns.length - 1
                          ? "lg:border-r lg:border-[#B58E24]/25 lg:pr-8"
                          : ""
                      }`}
                    >
                      <h3 className="mb-5 font-sans text-sm font-semibold tracking-wide text-[#B58E24]">
                        {column.title}
                      </h3>
                      {column.wide ? (
                        <div className="grid gap-8 sm:grid-cols-2">
                          {column.groups.map((group) => (
                            <div key={group.label || "group"}>
                              {group.label ? (
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                  {group.label}
                                </p>
                              ) : null}
                              <ul>
                                {group.links.map((link) => (
                                  <li key={link.href + link.title}>
                                    <Link
                                      href={link.href}
                                      onClick={() => setMenuOpen(false)}
                                      className="block py-1.5 text-[14px] text-zinc-700 transition-all duration-200 hover:translate-x-1 hover:text-[#B58E24]"
                                    >
                                      {link.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {column.groups.map((group) => (
                            <div key={group.label || "group"}>
                              {group.label ? (
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                  {group.label}
                                </p>
                              ) : null}
                              <ul>
                                {group.links.slice(0, 12).map((link) => (
                                  <li key={link.href + link.title}>
                                    <Link
                                      href={link.href}
                                      onClick={() => setMenuOpen(false)}
                                      className="block py-1.5 text-[14px] text-zinc-700 transition-all duration-200 hover:translate-x-1 hover:text-[#B58E24]"
                                    >
                                      {link.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      <Link
                        href={column.footer.href}
                        onClick={() => setMenuOpen(false)}
                        className="mt-6 inline-flex font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E24] transition-colors duration-300 hover:text-[#9E7B1C]"
                      >
                        {column.footer.title} →
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
