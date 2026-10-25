import type { CatalogDepartment, CatalogSpec } from "@/data/catalog";

const PRIORITY_LABELS = [
  "gsm",
  "thread count",
  "tc",
  "material",
  "composition",
  "fabric",
  "weave",
  "size",
  "dimension",
  "weight",
  "capacity",
  "color",
];

function normalizeLabel(label: string) {
  return label.trim().toLowerCase();
}

function isPriority(label: string) {
  const n = normalizeLabel(label);
  return PRIORITY_LABELS.some((key) => n.includes(key));
}

/** Keep only short, scannable values — drop marketing sentences. */
function cleanValue(value: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length > 48) return null;
  if (/[.!?]$/.test(trimmed) && trimmed.split(" ").length > 6) return null;
  return trimmed;
}

function uniqueShortValues(values: Iterable<string>, limit = 8) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = cleanValue(raw);
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= limit) break;
  }
  return out;
}

export function buyersGuideFor(department: CatalogDepartment) {
  const labels = new Map<string, Set<string>>();
  for (const product of department.products) {
    for (const spec of product.specs) {
      if (!spec.label || !spec.value) continue;
      if (!labels.has(spec.label)) labels.set(spec.label, new Set());
      labels.get(spec.label)!.add(spec.value);
    }
    if (product.badge) {
      const key = /gsm/i.test(product.badge)
        ? "GSM"
        : /thread|tc/i.test(product.badge)
          ? "Thread Count"
          : null;
      if (key) {
        if (!labels.has(key)) labels.set(key, new Set());
        labels.get(key)!.add(product.badge);
      }
    }
  }

  const top = [...labels.entries()]
    .map(([label, values]) => ({
      label,
      values: uniqueShortValues(values),
      priority: isPriority(label) ? 0 : 1,
    }))
    .filter((row) => row.values.length > 0)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.values.length - a.values.length;
    })
    .slice(0, 4)
    .map(({ label, values }) => ({ label, values }));

  const isLinen = department.slug === "bed-and-bath-linen";
  const title = isLinen
    ? "Hospitality Buyer’s Specification Guide"
    : `${department.title} Buyer’s Guide`;

  const intro = isLinen
    ? "Key GSM, thread count, and material notes published on Daisy Bed & Bath pieces — scan before you open a quote."
    : `Short commercial attributes from live ${department.title} listings.`;

  return { title, intro, rows: top };
}

export function formatSpecs(specs: CatalogSpec[]) {
  return specs.filter((spec) => spec.label && spec.value);
}

/** Short pills for product cards — never dump full color lists or sentences. */
export function cardBadges(product: {
  badge: string | null;
  specs: CatalogSpec[];
}): string[] {
  const pills: string[] = [];

  if (product.badge) {
    const badge = cleanValue(product.badge);
    if (badge) pills.push(badge);
  }

  for (const spec of product.specs) {
    if (pills.length >= 2) break;
    if (!isPriority(spec.label)) continue;
    const value = cleanValue(spec.value);
    if (!value) continue;
    const label = spec.label.trim();
    const short =
      value.toLowerCase().includes(normalizeLabel(label)) || value.length <= 18
        ? value
        : `${label}: ${value}`;
    if (short.length > 36) continue;
    if (pills.some((p) => p.toLowerCase() === short.toLowerCase())) continue;
    pills.push(short);
  }

  return pills.slice(0, 2);
}
