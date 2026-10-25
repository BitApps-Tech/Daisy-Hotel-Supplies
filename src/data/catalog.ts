import raw from "./maples-manifest.json";
import ownRaw from "./own-photography.json";

export type CatalogSpec = {
  label: string;
  value: string;
};

type ManifestCategory = {
  id: number;
  slug: string;
  title: string;
  description: string;
  parentId: number;
  parentSlug: string | null;
  count: number;
  sourceUrl: string;
  image: string | null;
  remoteImage: string | null;
  group: string | null;
};

type ManifestProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  sourceUrl: string;
  categorySlugs: string[];
  primaryCategorySlug: string | null;
  departmentSlug: string | null;
  subcategorySlug: string | null;
  specs: CatalogSpec[];
  badge: string | null;
  image: string | null;
  images: string[];
  remoteImages: string[];
};

type Manifest = {
  source: string;
  syncedAt: string;
  categories: ManifestCategory[];
  products: ManifestProduct[];
};

const manifest = raw as unknown as Manifest;

export type FeaturedCollection = {
  id: string;
  label: string;
  images: string[];
};

type OwnCollection = FeaturedCollection & {
  departmentSlug: string;
  subcategorySlug: string;
};

const ownCollections = (ownRaw as { collections: OwnCollection[] }).collections;

const HIDDEN_DEPARTMENTS = new Set(["hide-price", "contact-only", "uncategorized"]);

const INCLUDED_DEPARTMENTS = new Set([
  "bed-and-bath-linen",
  "luxury-hotel-leather-accessories",
  "guest-comfort-and-amenities",
  "banquet-supplies-and-decors",
  "dining-and-kitchen-essentials",
  "cleaning-machine-and-equipment",
  "disposables-products",
  "bins-series",
  "lightings",
]);

function asset(local?: string | null, remote?: string | null) {
  return local || remote || "";
}

export type CatalogProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  specs: CatalogSpec[];
  badge: string | null;
  categorySlug: string;
  subcategorySlug: string;
  categorySlugs: string[];
  departmentSlug: string;
  sourceUrl: string;
};

function leafCategorySlug(product: ManifestProduct) {
  // Prefer the most specific category (e.g. duvet-covers) over group parents (bed-linen).
  if (product.primaryCategorySlug) return product.primaryCategorySlug;
  const leaf = (product.categorySlugs ?? []).find(
    (slug) => slug && slug !== product.departmentSlug && slug !== product.subcategorySlug,
  );
  return leaf || product.subcategorySlug || product.departmentSlug || "";
}

export const products: CatalogProduct[] = (manifest.products ?? [])
  .map((product) => {
    const gallery = product.images?.length ? product.images : product.remoteImages ?? [];
    const image = asset(product.image, gallery[0]);
    const leaf = leafCategorySlug(product);
    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      description: product.description,
      image,
      images: gallery.length ? gallery : image ? [image] : [],
      specs: product.specs ?? [],
      badge: product.badge,
      categorySlug: leaf,
      subcategorySlug: leaf,
      categorySlugs: product.categorySlugs ?? [],
      departmentSlug: product.departmentSlug || "",
      sourceUrl: product.sourceUrl,
    };
  })
  .filter((product) => product.image);

const categories = (manifest.categories ?? []).filter(
  (category) => !HIDDEN_DEPARTMENTS.has(category.slug),
);

export type CatalogSubcategory = {
  slug: string;
  title: string;
  description: string;
  image: string;
  departmentSlug: string;
  parentSlug: string | null;
  featuredCollections: FeaturedCollection[];
  products: CatalogProduct[];
};

export type CatalogDepartment = {
  slug: string;
  title: string;
  description: string;
  image: string;
  group: string;
  include: boolean;
  featuredCollections: FeaturedCollection[];
  sourceUrl: string;
  subcategories: CatalogSubcategory[];
  products: CatalogProduct[];
};

function featuredFor(slug: string): FeaturedCollection[] {
  const slugs = new Set([slug]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const category of categories) {
      if (category.parentSlug && slugs.has(category.parentSlug) && !slugs.has(category.slug)) {
        slugs.add(category.slug);
        grew = true;
      }
    }
  }
  return ownCollections
    .filter((collection) => slugs.has(collection.subcategorySlug))
    .map(({ id, label, images }) => ({ id, label, images }));
}

function subcategoryFrom(
  category: ManifestCategory,
  departmentSlug: string,
  scopedProducts: CatalogProduct[],
): CatalogSubcategory {
  const featuredCollections = featuredFor(category.slug);
  return {
    slug: category.slug,
    title: category.title,
    description: category.description,
    image:
      featuredCollections[0]?.images[0] ||
      asset(category.image, category.remoteImage) ||
      scopedProducts[0]?.image ||
      "",
    departmentSlug,
    parentSlug: category.parentSlug,
    featuredCollections,
    products: scopedProducts,
  };
}

function descendantsOf(rootSlug: string): ManifestCategory[] {
  const result: ManifestCategory[] = [];
  const queue = [rootSlug];
  while (queue.length) {
    const parent = queue.shift()!;
    for (const category of categories) {
      if (category.parentSlug === parent) {
        result.push(category);
        queue.push(category.slug);
      }
    }
  }
  return result;
}

function childrenOf(parentSlug: string): ManifestCategory[] {
  return categories.filter((category) => category.parentSlug === parentSlug);
}

/** All category slugs under a parent, including the parent itself. */
export function subcategoryTree(rootSlug: string): Set<string> {
  const slugs = new Set([rootSlug]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const category of categories) {
      if (category.parentSlug && slugs.has(category.parentSlug) && !slugs.has(category.slug)) {
        slugs.add(category.slug);
        grew = true;
      }
    }
  }
  return slugs;
}

/** Match a product to a sub filter, including parent groups like bed-linen. */
export function productMatchesSub(product: CatalogProduct, subSlug: string) {
  const tree = subcategoryTree(subSlug);
  if (tree.has(product.subcategorySlug) || tree.has(product.categorySlug)) {
    return true;
  }
  return product.categorySlugs.some((slug) => tree.has(slug));
}

export const departments: CatalogDepartment[] = categories
  .filter((category) => category.parentId === 0)
  .map((department) => {
    const departmentProducts = products.filter(
      (product) => product.departmentSlug === department.slug,
    );
    const descendants = descendantsOf(department.slug);
    const childSubs = descendants
      .map((category) =>
        subcategoryFrom(
          category,
          department.slug,
          departmentProducts.filter((product) =>
            productMatchesSub(product, category.slug),
          ),
        ),
      )
      .filter(
        (subcategory) =>
          subcategory.image ||
          subcategory.products.length ||
          subcategory.featuredCollections.length,
      );

    const loose = departmentProducts.filter(
      (product) => product.subcategorySlug === department.slug,
    );
    const subcategories = descendants.length
      ? [
          ...(loose.length
            ? [subcategoryFrom(department, department.slug, loose)]
            : []),
          ...childSubs,
        ]
      : [subcategoryFrom(department, department.slug, departmentProducts)];

    const featuredCollections = featuredFor(department.slug);
    const heroImage =
      department.slug === "bed-and-bath-linen"
        ? featuredCollections.find((collection) => collection.id === "duvet-covers")?.images[0] ||
          featuredCollections[0]?.images[0]
        : featuredCollections[0]?.images[0];

    return {
      slug: department.slug,
      title: department.title,
      description: department.description,
      image:
        heroImage ||
        asset(department.image, department.remoteImage) ||
        departmentProducts[0]?.image ||
        subcategories[0]?.image ||
        "",
      group: department.group || "Hospitality Collection",
      include: INCLUDED_DEPARTMENTS.has(department.slug),
      featuredCollections,
      sourceUrl: department.sourceUrl,
      subcategories,
      products: departmentProducts,
    };
  })
  .filter((department) => department.image || department.products.length);

export const includedDepartments = departments.filter((department) => department.include);

export function getChildSubcategories(parentSlug: string, departmentSlug: string) {
  return childrenOf(parentSlug)
    .map((category) =>
      subcategoryFrom(
        category,
        departmentSlug,
        products.filter((product) => productMatchesSub(product, category.slug)),
      ),
    )
    .filter(
      (subcategory) =>
        subcategory.products.length ||
        subcategory.featuredCollections.length ||
        subcategory.image,
    );
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getDepartment(slug: string) {
  return departments.find((department) => department.slug === slug) ?? null;
}

export function getSubcategory(slug: string) {
  for (const department of departments) {
    const subcategory = department.subcategories.find((item) => item.slug === slug);
    if (subcategory) return subcategory;
  }
  return null;
}

export const catalogSource = manifest.source;
export const catalogSyncedAt = manifest.syncedAt;
export { ownCollections };
