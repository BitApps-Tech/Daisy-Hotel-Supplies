import {
  getChildSubcategories,
  getDepartment,
  type CatalogSubcategory,
} from "@/data/catalog";

export type MegaLink = {
  title: string;
  href: string;
};

export type MegaColumn = {
  id: string;
  title: string;
  wide?: boolean;
  groups: {
    label?: string;
    links: MegaLink[];
  }[];
  footer: MegaLink;
};

function linksFrom(
  departmentSlug: string,
  parentSlug: string,
  subcategories?: CatalogSubcategory[],
): MegaLink[] {
  const items =
    subcategories ?? getChildSubcategories(parentSlug, departmentSlug);
  return items.map((item) => ({
    title: item.title,
    href: `/collections/${departmentSlug}?sub=${item.slug}`,
  }));
}

function departmentLinks(slugs: string[]): MegaLink[] {
  return slugs.flatMap((slug) => {
    const department = getDepartment(slug);
    if (!department?.include) return [];
    return department.subcategories
      .filter(
        (sub) =>
          (sub.products.length > 0 || sub.featuredCollections.length > 0) &&
          sub.slug !== slug,
      )
      .map((sub) => ({
        title: sub.title,
        href: `/collections/${slug}?sub=${sub.slug}`,
      }));
  });
}

export function getMegaMenu(): MegaColumn[] {
  const bed = getDepartment("bed-and-bath-linen");
  const bedLinks = bed ? linksFrom("bed-and-bath-linen", "bed-linen") : [];
  const bathLinks = bed ? linksFrom("bed-and-bath-linen", "bath-linen") : [];

  return [
    {
      id: "linen",
      title: "Bed & Bath Linen",
      wide: true,
      groups: [
        { label: "Bed Linen", links: bedLinks },
        { label: "Bath Linen", links: bathLinks },
      ],
      footer: {
        title: "Show all Linen",
        href: "/collections/bed-and-bath-linen",
      },
    },
    {
      id: "guest",
      title: "Guest Room & Bath",
      groups: [
        {
          links: departmentLinks([
            "guest-comfort-and-amenities",
            "luxury-hotel-leather-accessories",
            "lightings",
          ]),
        },
      ],
      footer: {
        title: "Show all Guest Room",
        href: "/collections/guest-comfort-and-amenities",
      },
    },
    {
      id: "ops",
      title: "Operations",
      groups: [
        {
          label: "Dining & Banquet",
          links: departmentLinks([
            "dining-and-kitchen-essentials",
            "banquet-supplies-and-decors",
          ]),
        },
        {
          label: "Housekeeping & Operations",
          links: departmentLinks([
            "cleaning-machine-and-equipment",
            "disposables-products",
            "bins-series",
          ]),
        },
      ],
      footer: {
        title: "Show all Collections",
        href: "/collections",
      },
    },
  ];
}
