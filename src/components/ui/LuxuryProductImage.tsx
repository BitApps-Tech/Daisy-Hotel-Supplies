type LuxuryProductImageProps = {
  src: string;
  alt: string;
  variant?: "product" | "banner" | "portrait";
  badges?: string[];
  spec?: string | null;
  className?: string;
  imgClassName?: string;
};

export function LuxuryProductImage({
  src,
  alt,
  variant = "product",
  badges = [],
  spec,
  className = "",
  imgClassName = "",
}: LuxuryProductImageProps) {
  const aspect =
    variant === "banner"
      ? "aspect-[16/11]"
      : variant === "portrait"
        ? "aspect-[4/5]"
        : "aspect-[4/5]";

  const pillBadges = [...badges, ...(spec ? [spec] : [])].filter(Boolean).slice(0, 2);

  return (
    <figure
      className={`group relative isolate w-full overflow-hidden rounded-[16px] bg-[#F5F3EF] ring-1 ring-inset ring-black/5 ${aspect} after:pointer-events-none after:absolute after:inset-0 after:z-10 after:bg-gradient-to-t after:from-black/30 after:via-transparent after:to-transparent after:opacity-60 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imgClassName}`}
      />
      {pillBadges.length ? (
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {pillBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[#D4AF37]/30 bg-[#0A0A0A]/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FAF8F5] backdrop-blur-md"
            >
              {badge}
            </span>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
