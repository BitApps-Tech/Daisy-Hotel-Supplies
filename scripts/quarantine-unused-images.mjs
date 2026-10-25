/**
 * Move catalog images not used by included departments into unused-images/,
 * plus the raw WhatsApp Images/ dump.
 */
import raw from "../src/data/maples-manifest.json" with { type: "json" };
import own from "../src/data/own-photography.json" with { type: "json" };
import {
  readdirSync,
  statSync,
  mkdirSync,
  renameSync,
  existsSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "unused-images");

const INCLUDED = new Set([
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

const used = new Set();
function add(p) {
  if (p && String(p).startsWith("/images/")) used.add(String(p));
}

for (const product of raw.products) {
  if (!INCLUDED.has(product.departmentSlug)) continue;
  add(product.image);
  for (const img of product.images || []) add(img);
}

function walkOwn(value) {
  if (!value) return;
  if (typeof value === "string") add(value);
  else if (Array.isArray(value)) value.forEach(walkOwn);
  else if (typeof value === "object") Object.values(value).forEach(walkOwn);
}
walkOwn(own);

const includedCatSlugs = new Set(INCLUDED);
let grew = true;
while (grew) {
  grew = false;
  for (const category of raw.categories || []) {
    if (
      category.parentSlug &&
      includedCatSlugs.has(category.parentSlug) &&
      !includedCatSlugs.has(category.slug)
    ) {
      includedCatSlugs.add(category.slug);
      grew = true;
    }
  }
}
for (const category of raw.categories || []) {
  if (includedCatSlugs.has(category.slug)) add(category.image);
}

function walkFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (statSync(fp).isDirectory()) walkFiles(fp, acc);
    else acc.push(fp);
  }
  return acc;
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function moveFile(from, to) {
  ensureDir(path.dirname(to));
  if (existsSync(to)) rmSync(to);
  renameSync(from, to);
}

function pruneEmpty(dir, stopAt) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (statSync(fp).isDirectory()) pruneEmpty(fp, stopAt);
  }
  if (dir !== stopAt && readdirSync(dir).length === 0) {
    rmSync(dir, { recursive: true });
  }
}

const imageRoot = path.join(ROOT, "public", "images");
let moved = 0;
let bytes = 0;

for (const fp of walkFiles(imageRoot)) {
  const url = "/" + path.relative(path.join(ROOT, "public"), fp).split(path.sep).join("/");
  if (used.has(url)) continue;
  const rel = path.relative(imageRoot, fp);
  bytes += statSync(fp).size;
  moveFile(fp, path.join(DEST, "catalog", rel));
  moved += 1;
}

pruneEmpty(imageRoot, imageRoot);

const whatsapp = path.join(ROOT, "Images");
if (existsSync(whatsapp)) {
  const dest = path.join(DEST, "source-whatsapp");
  if (!existsSync(dest)) {
    ensureDir(DEST);
    renameSync(whatsapp, dest);
  } else {
    for (const fp of walkFiles(whatsapp)) {
      moveFile(fp, path.join(dest, path.relative(whatsapp, fp)));
    }
    rmSync(whatsapp, { recursive: true });
  }
  console.log(`Moved Images/ → unused-images/source-whatsapp`);
}

console.log(
  `Moved ${moved} unused catalog images (${(bytes / 1024 / 1024).toFixed(1)} MB) → unused-images/catalog`,
);
console.log(`Kept ${used.size} referenced paths under public/images`);
