import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AddToQuotePanel } from "@/components/catalog/AddToQuotePanel";
import {
  getDepartment,
  getProduct,
  includedDepartments,
  products,
} from "@/data/catalog";
import { formatSpecs } from "@/lib/buyers-guide";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products
    .filter((product) =>
      includedDepartments.some(
        (department) => department.slug === product.departmentSlug,
      ),
    )
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description || `${product.title} — Daisy Hotel Supplies`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const department = getDepartment(product.departmentSlug);
  if (!department?.include) notFound();

  const specs = formatSpecs(product.specs);
  const related = department.products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] text-[#111111]">
      <div className="container-site pb-20 pt-36">
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          <Link href="/collections" className="hover:text-[#B58E24]">
            Collections
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${department.slug}`}
            className="hover:text-[#B58E24]"
          >
            {department.title}
          </Link>
          <span>/</span>
          <span className="text-zinc-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-12 gap-10 lg:gap-14">
          <div className="col-span-12 lg:col-span-6">
            <ProductGallery product={product} />
          </div>
          <div className="col-span-12 lg:col-span-6 lg:sticky lg:top-32 lg:h-fit">
            <p className="eyebrow-bronze">
              {product.subcategorySlug.replace(/-/g, " ")}
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em]">
              {product.title}
            </h1>
            {product.description ? (
              <p className="mt-6 max-w-[58ch] text-base leading-[1.75] text-zinc-600 sm:text-lg">
                {product.description}
              </p>
            ) : (
              <p className="mt-6 max-w-[58ch] text-base leading-[1.75] text-zinc-600 sm:text-lg">
                Commercial hospitality piece available for wholesale quotation
                through Daisy Hotel Supplies.
              </p>
            )}

            {specs.length ? (
              <div className="mt-10 overflow-hidden rounded-[16px] border border-black/[0.08] bg-white/50">
                <div className="border-b border-zinc-200 px-5 py-4">
                  <p className="eyebrow-bronze">Specifications</p>
                </div>
                <dl className="divide-y divide-zinc-200">
                  {specs.map((spec) => (
                    <div
                      key={`${spec.label}-${spec.value}`}
                      className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-2"
                    >
                      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {spec.label}
                      </dt>
                      <dd className="font-mono text-sm text-zinc-800 sm:text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                  {product.badge ? (
                    <div className="grid grid-cols-1 gap-1 bg-[#F2EFE9] px-5 py-4 sm:grid-cols-2">
                      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Commercial note
                      </dt>
                      <dd className="font-mono text-sm text-zinc-800 sm:text-right">
                        {product.badge}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            <AddToQuotePanel product={product} />
          </div>
        </div>

        {related.length ? (
          <section className="mt-24 border-t border-black/[0.08] pt-16">
            <p className="eyebrow-bronze">Related</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              From {department.title}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
