/**
 * Compress catalog photography under public/images:
 * - max edge 1600px
 * - rewrite to WebP (q≈78)
 * - update path references in data JSON + source files
 */
import sharp from "sharp";
import {
  readdirSync,
  statSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_ROOT = path.join(ROOT, "public", "images");
const MAX_EDGE = 1600;
const WEBP_QUALITY = 78;
const CONCURRENCY = 6;

const SOURCE_GLOBS = [
  path.join(ROOT, "src", "data", "maples-manifest.json"),
  path.join(ROOT, "src", "data", "own-photography.json"),
  path.join(ROOT, "src", "components", "home", "Hero.tsx"),
  path.join(ROOT, "src", "components", "home", "SuiteHotspots.tsx"),
];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (statSync(fp).isDirectory()) walk(fp, acc);
    else acc.push(fp);
  }
  return acc;
}

function isImage(fp) {
  return /\.(jpe?g|png|webp)$/i.test(fp);
}

async function compressOne(fp) {
  const ext = path.extname(fp).toLowerCase();
  const dir = path.dirname(fp);
  const base = path.basename(fp, ext);
  const outPath = path.join(dir, `${base}.webp`);
  const before = statSync(fp).size;

  const pipeline = sharp(fp, { failOn: "none" }).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  const { data, info } = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  // Skip rewrite if somehow larger and already webp at same path
  if (ext === ".webp" && data.length >= before && info.width <= MAX_EDGE) {
    return { fp, outPath: fp, before, after: before, skipped: true };
  }

  writeFileSync(outPath, data);
  if (outPath !== fp) unlinkSync(fp);

  return {
    fp,
    outPath,
    before,
    after: data.length,
    skipped: false,
    width: info.width,
    height: info.height,
  };
}

async function pool(items, limit, worker) {
  const results = [];
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function publicUrl(fp) {
  const rel = path.relative(path.join(ROOT, "public"), fp).split(path.sep).join("/");
  return `/${rel}`;
}

const files = walk(IMAGE_ROOT).filter(isImage);
console.log(`Compressing ${files.length} images → WebP (max ${MAX_EDGE}px, q=${WEBP_QUALITY})…`);

const started = Date.now();
let done = 0;
const results = await pool(files, CONCURRENCY, async (fp) => {
  try {
    const result = await compressOne(fp);
    done += 1;
    if (done % 100 === 0 || done === files.length) {
      const pct = ((done / files.length) * 100).toFixed(0);
      console.log(`  ${done}/${files.length} (${pct}%)`);
    }
    return result;
  } catch (error) {
    console.error(`FAIL ${fp}:`, error.message);
    return { fp, error: error.message, before: 0, after: 0 };
  }
});

const map = new Map();
let beforeTotal = 0;
let afterTotal = 0;
let converted = 0;
let failed = 0;

for (const result of results) {
  if (result.error) {
    failed += 1;
    continue;
  }
  beforeTotal += result.before;
  afterTotal += result.after;
  if (!result.skipped) converted += 1;
  const from = publicUrl(result.fp);
  const to = publicUrl(result.outPath);
  if (from !== to) map.set(from, to);
}

console.log(
  `\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s — converted ${converted}, failed ${failed}`,
);
console.log(
  `Size: ${(beforeTotal / 1024 / 1024).toFixed(1)}MB → ${(afterTotal / 1024 / 1024).toFixed(1)}MB (${(
    (1 - afterTotal / beforeTotal) *
    100
  ).toFixed(0)}% smaller)`,
);

if (map.size) {
  console.log(`Rewriting ${map.size} path references…`);
  const replacements = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const file of SOURCE_GLOBS) {
    let text = readFileSync(file, "utf8");
    let hits = 0;
    for (const [from, to] of replacements) {
      if (!text.includes(from)) continue;
      const next = text.split(from).join(to);
      hits += (text.length - next.length) / (from.length - to.length || 1);
      text = next;
    }
    writeFileSync(file, text);
    console.log(`  updated ${path.relative(ROOT, file)}`);
  }
}

console.log("Finished.");
