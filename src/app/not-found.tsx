import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0A0A0A] px-6 pt-28 text-center text-[#FAF8F5]">
      <p className="eyebrow-gold">404</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-zinc-400">
        That route is outside the Daisy hospitality catalog.
      </p>
      <Link
        href="/collections"
        className="mt-8 rounded-full satin-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]"
      >
        Browse collections
      </Link>
    </div>
  );
}
