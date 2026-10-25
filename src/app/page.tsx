import Link from "next/link";
import { DepartmentBento } from "@/components/home/DepartmentBento";
import { Hero } from "@/components/home/Hero";
import { SpecGuide } from "@/components/home/SpecGuide";
import { SuiteHotspots } from "@/components/home/SuiteHotspots";
import { SupplySection } from "@/components/home/SupplySection";
import { getBentoItems, getHotspots, getSpecPanels } from "@/lib/home-data";

export default function HomePage() {
  const bento = getBentoItems();
  const hotspots = getHotspots();
  const panels = getSpecPanels();

  return (
    <>
      <Hero />

      <section className="bg-[#0A0A0A] py-16 sm:py-28 lg:py-40">
        <div className="container-site">
          <div className="mb-14 max-w-3xl">
            <p className="eyebrow-gold">Departments</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em]">
              The five-star suite, catalogued
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-[1.75] text-zinc-400 sm:text-lg">
              Explore included hospitality departments — linen programs, guest
              room rituals, dining floors, and the operational backbone behind
              every stay.
            </p>
          </div>
          <DepartmentBento items={bento} />
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 sm:py-28 lg:py-40">
        <div className="container-site">
          <SuiteHotspots hotspots={hotspots} />
        </div>
      </section>

      <section className="bg-[#FAF8F5] py-16 sm:py-28 lg:py-40 text-[#111111]">
        <div className="container-site">
          <div className="mb-14 max-w-3xl">
            <p className="eyebrow-bronze">Hospitality specifications</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em]">
              Thread count & GSM, from the catalog
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-[1.75] text-zinc-600 sm:text-lg">
              Specification language drawn from real Bed & Bath products already
              in the Daisy catalog — ready for buyers writing a property
              standard.
            </p>
          </div>
          <SpecGuide panels={panels} />
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 sm:py-28 lg:py-40">
        <div className="container-site">
          <SupplySection />
        </div>
      </section>

      <section className="border-t border-[#D4AF37]/20 bg-[#121212] py-20">
        <div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow-gold">Concierge procurement</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#FAF8F5]">
              Build a wholesale quote for your property
            </h2>
          </div>
          <Link
            href="/contact"
            className="rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]"
          >
            Request a Wholesale Quote
          </Link>
        </div>
      </section>
    </>
  );
}
