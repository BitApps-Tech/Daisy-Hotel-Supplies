import type { CatalogDepartment, CatalogProduct } from "@/data/catalog";
import { productMatchesSub, subcategoryTree } from "@/data/catalog";
import type { FilterGroup } from "@/components/catalog/SubFilterBar";

type CuratedGroup = {
  slug: string;
  title: string;
  categorySlugs: string[];
};

/** Editorial groups for Bed & Bath — shoppable buckets, not raw taxonomy dumps. */
const BED_AND_BATH_GROUPS: CuratedGroup[] = [
  {
    slug: "sheets-and-bedding",
    title: "Sheets & Bedding",
    categorySlugs: ["bedsheets", "fitted-bed-sheets", "bed-skirtings", "bed-runners"],
  },
  {
    slug: "duvets-and-covers",
    title: "Duvets & Covers",
    categorySlugs: ["duvet-covers", "duvets"],
  },
  {
    slug: "pillows-and-protection",
    title: "Pillows & Protection",
    categorySlugs: [
      "pillows-pillow-covers",
      "pillow-protectors",
      "mattress-protectors",
      "mattress-toppers",
    ],
  },
  {
    slug: "blankets",
    title: "Blankets",
    categorySlugs: ["blankets"],
  },
  {
    slug: "baby-bed-linen",
    title: "Baby Bed Linen",
    categorySlugs: ["baby-bed-linen"],
  },
  {
    slug: "towels",
    title: "Towels",
    categorySlugs: [
      "bath-towels",
      "hand-towels",
      "face-towels",
      "bath-sheets",
      "pool-towels",
      "gym-towels",
      "wet-towels",
    ],
  },
  {
    slug: "bathrobes",
    title: "Bathrobes",
    categorySlugs: ["bathrobes"],
  },
  {
    slug: "slippers",
    title: "Slippers",
    categorySlugs: ["slippers"],
  },
  {
    slug: "bath-mats-and-curtains",
    title: "Mats & Curtains",
    categorySlugs: [
      "bath-rugs-bath-mats",
      "shower-curtains",
      "shower-curtain-rods",
    ],
  },
];

function groupHasProducts(department: CatalogDepartment, categorySlugs: string[]) {
  return department.products.some((product) =>
    categorySlugs.some((slug) => productMatchesSub(product, slug)),
  );
}

function leavesForCategories(
  department: CatalogDepartment,
  categorySlugs: string[],
) {
  return categorySlugs
    .map((slug) => {
      const row = department.subcategories.find((item) => item.slug === slug);
      const title =
        row?.title ||
        slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const has =
        (row && (row.products.length > 0 || row.featuredCollections.length > 0)) ||
        department.products.some((product) => productMatchesSub(product, slug));
      if (!has) return null;
      return { slug, title };
    })
    .filter(Boolean) as { slug: string; title: string }[];
}

export function buildFilterGroups(department: CatalogDepartment): FilterGroup[] {
  if (department.slug === "bed-and-bath-linen") {
    return BED_AND_BATH_GROUPS.filter((group) =>
      groupHasProducts(department, group.categorySlugs),
    ).map((group) => {
      const leaves = leavesForCategories(department, group.categorySlugs);
      // One leaf that is the whole group → no second row needed.
      const children =
        leaves.length <= 1 ? [] : leaves.filter((leaf) => leaf.slug !== group.slug);
      return {
        slug: group.slug,
        title: group.title,
        children,
      };
    });
  }

  const topGroups = department.subcategories.filter(
    (item) => item.parentSlug === department.slug,
  );

  if (topGroups.length) {
    return topGroups
      .map((group) => ({
        slug: group.slug,
        title: group.title,
        children: department.subcategories
          .filter((item) => {
            if (item.parentSlug !== group.slug) return false;
            return (
              item.products.length > 0 ||
              item.featuredCollections.length > 0 ||
              department.products.some((product) =>
                productMatchesSub(product, item.slug),
              )
            );
          })
          .map((item) => ({ slug: item.slug, title: item.title })),
      }))
      .filter(
        (group) =>
          group.children.length > 0 ||
          department.products.some((product) =>
            productMatchesSub(product, group.slug),
          ),
      );
  }

  return department.subcategories
    .filter((item) => {
      if (item.slug === department.slug) return false;
      return (
        item.products.length > 0 ||
        item.featuredCollections.length > 0 ||
        department.products.some((product) => productMatchesSub(product, item.slug))
      );
    })
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      children: [] as { slug: string; title: string }[],
    }));
}

export function productsForFilterSub(
  department: CatalogDepartment,
  sub: string | undefined,
): CatalogProduct[] {
  if (!sub) return department.products;

  if (department.slug === "bed-and-bath-linen") {
    const curated = BED_AND_BATH_GROUPS.find((group) => group.slug === sub);
    if (curated) {
      return department.products.filter((product) =>
        curated.categorySlugs.some((slug) => productMatchesSub(product, slug)),
      );
    }
  }

  return department.products.filter((product) => productMatchesSub(product, sub));
}

export function labelForFilterSub(
  department: CatalogDepartment,
  sub: string | undefined,
  groups: FilterGroup[],
) {
  if (!sub) return "All pieces";

  if (department.slug === "bed-and-bath-linen") {
    const curated = BED_AND_BATH_GROUPS.find((group) => group.slug === sub);
    if (curated) return curated.title;
  }

  for (const group of groups) {
    if (group.slug === sub) return group.title;
    const leaf = group.children.find((child) => child.slug === sub);
    if (leaf) return leaf.title;
  }

  return (
    department.subcategories.find((item) => item.slug === sub)?.title ||
    sub.replace(/-/g, " ")
  );
}

export function filterSubForCategorySlug(
  departmentSlug: string,
  categorySlug: string,
) {
  if (departmentSlug !== "bed-and-bath-linen") return categorySlug;

  const curated = BED_AND_BATH_GROUPS.find((group) => {
    const tree = new Set(
      group.categorySlugs.flatMap((slug) => [...subcategoryTree(slug)]),
    );
    return tree.has(categorySlug) || group.slug === categorySlug;
  });

  return curated?.slug || categorySlug;
}
