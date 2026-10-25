import {
  productMatchesSub,
  type CatalogDepartment,
  type CatalogProduct,
} from "@/data/catalog";

export function productsWithOwnPhotographyFirst(
  department: CatalogDepartment,
  list: CatalogProduct[],
) {
  const ownSlugs = new Set(
    department.featuredCollections.flatMap((collection) => {
      const matching = department.subcategories.find(
        (sub) =>
          sub.slug === collection.id ||
          sub.featuredCollections.some((item) => item.id === collection.id),
      );
      return matching ? [matching.slug] : [collection.id];
    }),
  );

  const ownSubcategorySlugs = new Set(
    department.subcategories
      .filter((sub) => sub.featuredCollections.length > 0)
      .map((sub) => sub.slug),
  );

  return [...list].sort((a, b) => {
    const aOwn =
      ownSubcategorySlugs.has(a.subcategorySlug) || ownSlugs.has(a.subcategorySlug)
        ? 0
        : 1;
    const bOwn =
      ownSubcategorySlugs.has(b.subcategorySlug) || ownSlugs.has(b.subcategorySlug)
        ? 0
        : 1;
    if (aOwn !== bOwn) return aOwn - bOwn;
    return a.title.localeCompare(b.title);
  });
}

export function filterProducts(
  products: CatalogProduct[],
  options: { q?: string; sub?: string; departmentSlug?: string },
) {
  let result = products;
  if (options.departmentSlug) {
    result = result.filter((product) => product.departmentSlug === options.departmentSlug);
  }
  if (options.sub) {
    result = result.filter((product) => productMatchesSub(product, options.sub!));
  }
  if (options.q?.trim()) {
    const query = options.q.trim().toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.badge?.toLowerCase().includes(query) ||
        product.specs.some(
          (spec) =>
            spec.label.toLowerCase().includes(query) ||
            spec.value.toLowerCase().includes(query),
        ),
    );
  }
  return result;
}
