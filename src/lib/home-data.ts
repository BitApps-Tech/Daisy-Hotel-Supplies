import { includedDepartments, products } from "@/data/catalog";
import type { BentoItem } from "@/components/home/DepartmentBento";
import type { HotspotProduct } from "@/components/home/SuiteHotspots";
import type { SpecPanel } from "@/components/home/SpecGuide";

/** Keep ops/housekeeping off the landing bento — suite atmosphere only. */
const LANDING_BENTO_EXCLUDE = new Set([
  "cleaning-machine-and-equipment",
  "disposables-products",
  "bins-series",
]);

export function getBentoItems(): BentoItem[] {
  return includedDepartments
    .filter(
      (department) =>
        department.image && !LANDING_BENTO_EXCLUDE.has(department.slug),
    )
    .map((department) => ({
      slug: department.slug,
      title: department.title,
      image: department.featuredCollections[0]?.images[0] || department.image,
    }));
}

function findProduct(department: string, hint: RegExp) {
  return (
    products.find(
      (product) =>
        product.departmentSlug === department &&
        hint.test(`${product.slug} ${product.title}`),
    ) || products.find((product) => product.departmentSlug === department)
  );
}

export function getHotspots(): HotspotProduct[] {
  const defs = [
    {
      id: "linen",
      x: "28%",
      y: "42%",
      hint: /duvet|sheet|bed/i,
      department: "bed-and-bath-linen",
      label: "Bed Linen",
    },
    {
      id: "bath",
      x: "68%",
      y: "58%",
      hint: /towel|robe|bath/i,
      department: "bed-and-bath-linen",
      label: "Bath Ritual",
    },
    {
      id: "amenity",
      x: "52%",
      y: "28%",
      hint: /amenit|dispenser|soap|tray/i,
      department: "guest-comfort-and-amenities",
      label: "Guest Amenities",
    },
  ] as const;

  return defs.flatMap((def) => {
    const product = findProduct(def.department, def.hint);
    if (!product) return [];
    return [
      {
        id: def.id,
        label: def.label,
        x: def.x,
        y: def.y,
        slug: product.slug,
        title: product.title,
        image: product.image,
        badge: product.badge,
      },
    ];
  });
}

function collectSpecs(labelMatch: RegExp) {
  const values = new Map<string, string>();
  for (const product of products) {
    if (product.departmentSlug !== "bed-and-bath-linen") continue;
    for (const spec of product.specs) {
      if (labelMatch.test(spec.label) && spec.value) {
        values.set(spec.value, product.title);
      }
    }
    if (product.badge && labelMatch.test(product.badge)) {
      values.set(product.badge, product.title);
    }
  }
  return [...values.entries()].slice(0, 6) as [string, string][];
}

export function getSpecPanels(): SpecPanel[] {
  const threadCounts = collectSpecs(/thread|tc|count/i);
  const gsm = collectSpecs(/gsm|weight|gram/i);
  const materials = collectSpecs(/material|cotton|composition|fabric|weave/i);

  return [
    {
      title: "Thread Count",
      eyebrow: "Bed linen",
      body: "Commercial hotel sheets are specified by thread count and weave. These values appear on Daisy catalog pieces — not invented ranges.",
      rows: threadCounts.length
        ? threadCounts
        : products
            .filter((p) => p.departmentSlug === "bed-and-bath-linen" && p.badge)
            .slice(0, 4)
            .map((p) => [p.badge!, p.title] as [string, string]),
    },
    {
      title: "GSM Weight",
      eyebrow: "Bath linen",
      body: "Towel hand-feel and absorbency track GSM. Use the weights already listed on bath products when writing a property standard.",
      rows: gsm.length
        ? gsm
        : products
            .filter(
              (p) =>
                p.departmentSlug === "bed-and-bath-linen" &&
                /towel|bath|robe/i.test(p.slug),
            )
            .slice(0, 4)
            .map(
              (p) =>
                [
                  p.specs[0]
                    ? `${p.specs[0].label}: ${p.specs[0].value}`
                    : p.badge || "Commercial bath linen",
                  p.title,
                ] as [string, string],
            ),
    },
    {
      title: "Composition",
      eyebrow: "Material truth",
      body: "Only published material and weave language from the catalog appears here — ready for procurement comparison.",
      rows: materials.slice(0, 6),
    },
  ];
}
