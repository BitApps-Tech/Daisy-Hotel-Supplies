"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export type FilterLeaf = {
  slug: string;
  title: string;
};

export type FilterGroup = {
  slug: string;
  title: string;
  children: FilterLeaf[];
};

type SubFilterBarProps = {
  departmentSlug: string;
  activeSub?: string;
  groups: FilterGroup[];
};

export function SubFilterBar({
  departmentSlug,
  activeSub,
  groups,
}: SubFilterBarProps) {
  const router = useRouter();
  const base = `/collections/${departmentSlug}`;

  const activeMeta = useMemo(() => {
    if (!activeSub) return null;
    for (const group of groups) {
      if (group.slug === activeSub) {
        return { group, leaf: null as FilterLeaf | null };
      }
      const leaf = group.children.find((child) => child.slug === activeSub);
      if (leaf) return { group, leaf };
    }
    return null;
  }, [activeSub, groups]);

  const isFlat = groups.every((group) => group.children.length === 0);

  const [browsing, setBrowsing] = useState(false);

  useEffect(() => {
    setBrowsing(false);
  }, [activeSub]);

  const compressed = Boolean(activeMeta?.leaf) && !browsing && !isFlat;

  const openGroup = useMemo(() => {
    if (isFlat) return null;
    if (compressed) return null;
    if (!activeMeta?.group?.children.length) return null;
    // Group selected, or Change opened the leaf’s parent
    if (!activeMeta.leaf || browsing) return activeMeta.group;
    return null;
  }, [isFlat, compressed, activeMeta, browsing]);

  function go(href: string) {
    router.push(href, { scroll: false });
  }

  return (
    <div className="sticky top-24 z-30 border-b border-black/[0.08] bg-[#FAF8F5]/95 pb-5 pt-1 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          label="Show All"
          active={!activeSub}
          href={base}
          onClick={() => {
            setBrowsing(false);
            go(base);
          }}
        />

        {compressed && activeMeta?.leaf ? (
          <>
            <FilterPill
              label={activeMeta.group.title}
              active={false}
              href={`${base}?sub=${activeMeta.group.slug}`}
              onClick={() => {
                setBrowsing(true);
                go(`${base}?sub=${activeMeta.group.slug}`);
              }}
            />
            <span
              aria-hidden
              className="text-[10px] uppercase tracking-[0.18em] text-zinc-400"
            >
              /
            </span>
            <FilterPill
              label={activeMeta.leaf.title}
              active
              href={`${base}?sub=${activeMeta.leaf.slug}`}
              onClick={() => go(`${base}?sub=${activeMeta.leaf!.slug}`)}
            />
            <button
              type="button"
              onClick={() => setBrowsing(true)}
              className="rounded-full border border-[#B58E24]/30 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B58E24] transition-colors duration-300 hover:bg-[#B58E24]/10"
            >
              Change
            </button>
          </>
        ) : (
          groups.map((group) => (
            <FilterPill
              key={group.slug}
              label={group.title}
              active={
                activeSub === group.slug ||
                activeMeta?.group.slug === group.slug
              }
              href={`${base}?sub=${group.slug}`}
              onClick={() => {
                setBrowsing(Boolean(group.children.length));
                go(`${base}?sub=${group.slug}`);
              }}
            />
          ))
        )}
      </div>

      {openGroup ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
          <button
            type="button"
            onClick={() => {
              setBrowsing(false);
              if (!activeMeta?.leaf) go(base);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 transition-colors duration-300 hover:text-[#B58E24]"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
            Back
          </button>
          <FilterPill
            label={`All ${openGroup.title}`}
            active={activeSub === openGroup.slug}
            href={`${base}?sub=${openGroup.slug}`}
            onClick={() => go(`${base}?sub=${openGroup.slug}`)}
          />
          {openGroup.children.map((leaf) => (
            <FilterPill
              key={leaf.slug}
              label={leaf.title}
              active={activeSub === leaf.slug}
              href={`${base}?sub=${leaf.slug}`}
              onClick={() => {
                setBrowsing(false);
                go(`${base}?sub=${leaf.slug}`);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FilterPill({
  label,
  active,
  href,
  onClick,
}: {
  label: string;
  active: boolean;
  href: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`rounded-full px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
        active
          ? "satin-gold text-[#0A0A0A]"
          : "border border-black/[0.08] bg-white/70 text-zinc-600 hover:border-[#B58E24]/40 hover:text-[#B58E24]"
      }`}
    >
      {label}
    </Link>
  );
}
