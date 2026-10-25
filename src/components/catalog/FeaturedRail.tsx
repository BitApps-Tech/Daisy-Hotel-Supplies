"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";

export type FeaturedRailItem = {
  id: string;
  label: string;
  image: string;
  href: string;
};

export function FeaturedRail({ items }: { items: FeaturedRailItem[] }) {
  const router = useRouter();

  if (!items.length) return null;

  return (
    <aside className="rounded-[24px] border border-black/[0.08] bg-[#F2EFE9] p-5 lg:p-6">
      <p className="eyebrow-bronze">Daisy photography</p>
      <h2 className="mt-2 font-serif text-2xl sm:text-3xl leading-snug">
        Featured collections
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600">
        Always on view — jump into a photographed collection anytime.
      </p>
      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              scroll={false}
              onClick={(event) => {
                event.preventDefault();
                router.push(item.href, { scroll: false });
              }}
              className="group block"
            >
              <LuxuryProductImage
                src={item.image}
                alt={item.label}
                variant="banner"
                className="aspect-[16/11] rounded-[16px]"
              />
              <h3 className="mt-3 font-serif text-xl transition-colors duration-300 group-hover:text-[#B58E24]">
                {item.label}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
