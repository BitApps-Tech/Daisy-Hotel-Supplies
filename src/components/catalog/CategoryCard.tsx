import Link from "next/link";
import { LuxuryProductImage } from "@/components/ui/LuxuryProductImage";

type CategoryCardProps = {
  href: string;
  title: string;
  image: string;
  spec?: string | null;
  description?: string;
};

export function CategoryCard({
  href,
  title,
  image,
  spec,
  description,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block text-zinc-900">
      <LuxuryProductImage
        src={image}
        alt={title}
        variant="banner"
        badges={spec ? [spec] : []}
      />
      <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-normal leading-snug tracking-tight text-[#111111] transition-colors duration-300 group-hover:text-[#B58E24]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">{description}</p>
      ) : null}
    </Link>
  );
}
