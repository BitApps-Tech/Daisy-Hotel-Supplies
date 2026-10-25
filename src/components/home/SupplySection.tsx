import Link from "next/link";

export function SupplySection() {
  return (
    <div className="grid grid-cols-12 gap-10 items-end">
      <div className="col-span-12 lg:col-span-5">
        <p className="eyebrow-gold">Hotel opening packages</p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em] text-[#FAF8F5]">
          End-to-end supply for the property standard
        </h2>
      </div>
      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <p className="max-w-[52ch] text-base leading-[1.75] text-zinc-400 sm:text-lg">
          From bed and bath programs to banquet floors and housekeeping systems,
          Daisy coordinates bulk import logistics and staged deliveries so
          openings and renovations land with one coherent specification.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
        >
          Request a Wholesale Quote
        </Link>
      </div>
    </div>
  );
}
