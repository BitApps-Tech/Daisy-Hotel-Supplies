import { notFound } from "next/navigation";
import { FeaturedRail } from "@/components/catalog/FeaturedRail";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SubFilterBar } from "@/components/catalog/SubFilterBar";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";
import { getDepartment, includedDepartments } from "@/data/catalog";
import { buyersGuideFor } from "@/lib/buyers-guide";
import { productsWithOwnPhotographyFirst } from "@/lib/catalog-sort";
import {
  buildFilterGroups,
  filterSubForCategorySlug,
  labelForFilterSub,
  productsForFilterSub,
} from "@/lib/filter-groups";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
};

export function generateStaticParams() {
  return includedDepartments.map((department) => ({
    category: department.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const department = getDepartment(category);
  if (!department?.include) return { title: "Collection" };
  return {
    title: department.title,
    description: department.description,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { sub } = await searchParams;
  const department = getDepartment(category);

  if (!department || !department.include) notFound();

  const groupsForFilter = buildFilterGroups(department);
  const filtered = productsForFilterSub(department, sub);
  const sorted = productsWithOwnPhotographyFirst(department, filtered);
  const catalogTitle = labelForFilterSub(department, sub, groupsForFilter);
  const guide = buyersGuideFor(department);
  const heroImage =
    department.featuredCollections[0]?.images[0] || department.image;

  const featuredItems = department.featuredCollections.map((collection) => {
    const match = department.subcategories.find((item) =>
      item.featuredCollections.some((featured) => featured.id === collection.id),
    );
    const categorySlug = match?.slug || collection.id;
    return {
      id: collection.id,
      label: collection.label,
      image: collection.images[0],
      href: `/collections/${department.slug}?sub=${filterSubForCategorySlug(
        department.slug,
        categorySlug,
      )}`,
    };
  });

  const hasFeatured = featuredItems.length > 0;

  return (
    <div className="bg-[#FAF8F5] text-[#111111]">
      <section className="bg-[#0A0A0A] pb-16 pt-36 text-[#FAF8F5]">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow-gold">{department.group}</p>
            <h1 className="mt-4 font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl">
              {department.title}
            </h1>
            {department.description ? (
              <p className="mt-5 max-w-[48ch] text-base leading-[1.75] text-zinc-400">
                {department.description}
              </p>
            ) : (
              <p className="mt-5 max-w-[48ch] text-base leading-[1.75] text-zinc-400">
                Commercial hospitality assortment curated for property standards
                and wholesale procurement.
              </p>
            )}
          </div>
          <div className="min-w-0 lg:col-span-7">
            <LuxuryProductImage
              src={heroImage}
              alt={department.title}
              variant="banner"
              className="rounded-[24px]"
            />
          </div>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16 lg:py-20">
        <div
          className={`grid grid-cols-1 gap-10 ${
            hasFeatured ? "lg:grid-cols-12 lg:gap-12" : ""
          }`}
        >
          <div className={hasFeatured ? "lg:col-span-8" : "col-span-full"}>
            <SubFilterBar
              departmentSlug={department.slug}
              activeSub={sub}
              groups={groupsForFilter}
            />

            <div className="mt-8" id="catalog-results">
              <p className="eyebrow-bronze">Catalog</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                {catalogTitle}
              </h2>

              {sorted.length ? (
                <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
                  {sorted.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 max-w-[42ch] text-sm leading-relaxed text-zinc-600">
                  No products in this subcategory yet. Try another filter or view
                  all.
                </p>
              )}
            </div>

            {guide.rows.length ? (
              <div className="mt-16 border-t border-black/[0.08] pt-12">
                <div className="max-w-2xl">
                  <p className="eyebrow-bronze">Buyer’s guide</p>
                  <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                    {guide.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    {guide.intro}
                  </p>
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {guide.rows.map((row) => (
                    <article
                      key={row.label}
                      className="rounded-[16px] border border-black/[0.08] bg-[#F2EFE9] p-6"
                    >
                      <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                        {row.label}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {row.values.map((value) => (
                          <span
                            key={value}
                            className="rounded-full border border-[#B58E24]/20 bg-[#FAF8F5] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-700"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {hasFeatured ? (
            <div className="order-last lg:order-none lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <FeaturedRail items={featuredItems} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
