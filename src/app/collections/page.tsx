import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { includedDepartments, products } from "@/data/catalog";
import { filterProducts } from "@/lib/catalog-sort";

type PageProps = {
  searchParams: Promise<{ q?: string; department?: string }>;
};

export const metadata = {
  title: "Collections",
  description: "Master hospitality catalog for Daisy Hotel Supplies.",
};

export default async function CollectionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeDepartment = params.department || "all";
  const includedProducts = products.filter((product) =>
    includedDepartments.some((department) => department.slug === product.departmentSlug),
  );

  const filtered = filterProducts(includedProducts, {
    q: params.q,
    departmentSlug: activeDepartment === "all" ? undefined : activeDepartment,
  });

  const sorted = [...filtered].sort((a, b) => {
    const aDept = includedDepartments.find((d) => d.slug === a.departmentSlug);
    const bDept = includedDepartments.find((d) => d.slug === b.departmentSlug);
    const aOwn = aDept?.subcategories.some(
      (sub) => sub.slug === a.subcategorySlug && sub.featuredCollections.length,
    )
      ? 0
      : 1;
    const bOwn = bDept?.subcategories.some(
      (sub) => sub.slug === b.subcategorySlug && sub.featuredCollections.length,
    )
      ? 0
      : 1;
    if (aOwn !== bOwn) return aOwn - bOwn;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="bg-[#FAF8F5] text-[#111111]">
      <section className="border-b border-black/[0.08] bg-[#0A0A0A] pb-20 pt-36 text-[#FAF8F5]">
        <div className="container-site">
          <p className="eyebrow-gold">Master catalog</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            All collections
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-[1.75] text-zinc-400 sm:text-lg">
            Search and filter included hospitality departments. Daisy’s own
            photography leads within each category.
          </p>
          <form className="mt-10 max-w-xl">
            <input
              name="q"
              defaultValue={params.q || ""}
              placeholder="Search products, specs, materials…"
              className="w-full rounded-full border border-white/15 bg-[#FAF8F5] px-5 py-3.5 text-sm text-[#0A0A0A] outline-none placeholder:text-zinc-500"
            />
            {activeDepartment !== "all" ? (
              <input type="hidden" name="department" value={activeDepartment} />
            ) : null}
          </form>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="flex flex-wrap gap-2 border-b border-black/[0.08] pb-6">
          <Tab
            href={params.q ? `/collections?q=${encodeURIComponent(params.q)}` : "/collections"}
            active={activeDepartment === "all"}
            label="All"
          />
          {includedDepartments.map((department) => (
            <Tab
              key={department.slug}
              href={`/collections?department=${department.slug}${
                params.q ? `&q=${encodeURIComponent(params.q)}` : ""
              }`}
              active={activeDepartment === department.slug}
              label={department.title}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Tab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
        active
          ? "satin-gold text-[#0A0A0A]"
          : "border border-black/[0.08] text-zinc-600 hover:border-[#B58E24]/40 hover:text-[#B58E24]"
      }`}
    >
      {label}
    </Link>
  );
}
