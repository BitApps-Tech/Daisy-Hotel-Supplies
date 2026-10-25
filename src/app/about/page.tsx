import Link from "next/link";
import { includedDepartments } from "@/data/catalog";

export const metadata = {
  title: "About Us",
  description:
    "Daisy Hotel Supplies — international hospitality procurement for five-star property standards.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] text-[#FAF8F5]">
      <section className="container-site pb-20 pt-36">
        <p className="eyebrow-gold">About Daisy Hotel Supplies</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          The supply standard behind five-star comfort
        </h1>
        <p className="mt-8 max-w-[62ch] text-base leading-[1.75] text-zinc-400 sm:text-lg">
          Daisy Hotel Supplies is a hospitality procurement partner for hotels,
          resorts, and operators who specify linens, guest amenities, banquet
          floors, and operational systems with the same rigor they bring to the
          guest journey.
        </p>
      </section>

      <section className="border-y border-[#D4AF37]/20 bg-[#121212] py-16 sm:py-28">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow-gold">How hotels procure</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.08]">
              From property standard to staged delivery
            </h2>
          </div>
          <div className="min-w-0 space-y-8 lg:col-span-6 lg:col-start-7">
            {[
              {
                step: "01",
                title: "Specify the suite",
                body: "Browse included departments, compare published thread counts, GSM, materials, and commercial notes, then assemble a quote bag by piece and quantity.",
              },
              {
                step: "02",
                title: "Submit a wholesale RFQ",
                body: "Share property name and procurement contact. Daisy responds with availability, lead times, and a tailored quotation — never a retail cart.",
              },
              {
                step: "03",
                title: "Open or refresh with confidence",
                body: "Coordinate hotel opening packages and bulk import logistics so bed programs, guest amenities, and banquet floors arrive as one coherent standard.",
              },
            ].map((item) => (
              <article key={item.step} className="border-t border-white/10 pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  {item.step}
                </p>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-zinc-400">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF8F5] py-16 sm:py-28 text-[#111111]">
        <div className="container-site">
          <p className="eyebrow-bronze">Included departments</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            What we outfit
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includedDepartments.map((department) => (
              <li key={department.slug}>
                <Link
                  href={`/collections/${department.slug}`}
                  className="block rounded-[16px] border border-black/[0.08] bg-white/40 px-5 py-6 transition-colors duration-300 hover:border-[#B58E24]/40"
                >
                  <h3 className="font-serif text-2xl">{department.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-site py-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[24px] border border-[#D4AF37]/25 bg-[#121212] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <p className="eyebrow-gold">Next step</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Speak with procurement
            </h2>
          </div>
          <Link
            href="/contact"
            className="rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]"
          >
            Contact Daisy
          </Link>
        </div>
      </section>
    </div>
  );
}
