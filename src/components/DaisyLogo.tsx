import Link from "next/link";

type DaisyLogoProps = {
  href?: string | null;
  className?: string;
  /** Transparent crest — gold pillow + white flower, no plate. */
  markClassName?: string;
  onClick?: () => void;
};

/**
 * Crest mark with transparent ground. Safe on obsidian; do not place on
 * alabaster without a dark plate behind it.
 */
export function DaisyLogo({
  href = "/",
  className = "",
  markClassName = "h-11 w-auto md:h-12",
  onClick,
}: DaisyLogoProps) {
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/crest.png"
      alt="Daisy Hotel Supplies"
      className={`${markClassName} bg-transparent object-contain`}
    />
  );

  if (!href) {
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center ${className}`}
    >
      {mark}
    </Link>
  );
}
