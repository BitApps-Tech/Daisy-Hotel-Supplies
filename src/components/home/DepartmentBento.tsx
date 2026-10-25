"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";
import { fadeUp, stagger } from "@/lib/motion";

export type BentoItem = {
  slug: string;
  title: string;
  image: string;
};

export function DepartmentBento({ items }: { items: BentoItem[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-16"
    >
      {items.map((department) => (
        <motion.div key={department.slug} variants={fadeUp} className="h-full">
          <Link
            href={`/collections/${department.slug}`}
            className="group flex h-full flex-col text-[#FAF8F5]"
          >
            <LuxuryProductImage
              src={department.image}
              alt={department.title}
              variant="banner"
              className="aspect-[16/11] w-full rounded-[24px]"
            />
            <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-normal leading-snug tracking-tight transition-colors duration-300 group-hover:text-[#D4AF37]">
              {department.title}
            </h3>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
