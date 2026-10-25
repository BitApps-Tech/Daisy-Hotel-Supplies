"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export type SpecPanel = {
  title: string;
  eyebrow: string;
  body: string;
  rows: [string, string][];
};

export function SpecGuide({ panels }: { panels: SpecPanel[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid gap-6 lg:grid-cols-3"
    >
      {panels.map((panel) => (
        <motion.article
          key={panel.title}
          variants={fadeUp}
          className="rounded-[24px] border border-black/[0.08] bg-[#F2EFE9] p-8"
        >
          <p className="eyebrow-bronze">{panel.eyebrow}</p>
          <h3 className="mt-3 font-serif text-3xl text-[#111111]">{panel.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">{panel.body}</p>
          <ul className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
            {panel.rows.map(([value, title]) => (
              <li key={`${value}-${title}`} className="flex flex-col gap-1 py-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#B58E24]">
                  {value}
                </span>
                <span className="line-clamp-1 text-sm text-zinc-700">{title}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </motion.div>
  );
}
