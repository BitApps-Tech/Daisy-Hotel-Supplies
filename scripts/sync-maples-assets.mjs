/**
 * Pulls public Maples Hotel Supplies category and product photography into
 * public/images/maples and writes src/data/maples-manifest.json.
 *
 * maplesme.com sits behind a Cloudflare check that rejects bare fetch.
 * A real Chrome window clears that check; image bytes are then saved locally.
 */
import { load } from "cheerio";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connect } from "puppeteer-real-browser";

const ORIGIN = "https://maplesme.com";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const CATEGORY_DIR = path.join(PUBLIC_DIR, "images", "maples", "categories");
const PRODUCT_DIR = path.join(PUBLIC_DIR, "images", "maples", "products");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "maples-manifest.json");

const PAGE_SIZE = 50;
const IMAGE_CONCURRENCY = 5;
const MAX_GALLERY = 8;
const SKIP_PRIMARY = new Set(["hide-price", "contact-only"]);
const WP_DIMENSIONS = new Set([
  "100", "150", "200", "300", "400", "500", "600", "640", "768",
  "800", "1024", "1080", "1200", "1280", "1536", "1920", "2048",
]);

const GROUP_BY_SLUG = {
  "bed-and-bath-linen": "Bed & Bath Linen",
  "guest-comfort-and-amenities": "Guest Room & Bath",
  "in-room-accessories": "Guest Room & Bath",
  "electronics-and-appliances": "Guest Room & Bath",
  "dining-and-kitchen-essentials": "Dining & Banquet",
  "banquet-supplies-and-decors": "Dining & Banquet",
  "hotel-trolleys-and-equipment": "Housekeeping & Operations",
  "cleaning-machine-and-equipment": "Housekeeping & Operations",
  "bins-series": "Housekeeping & Operations",
  "hospital-linen-and-equipment": "Housekeeping & Operations",
  "disposables-products": "Housekeeping & Operations",
  "furnishing-solutions": "Furniture & Fit-Out",
  "baby-products": "Family & Guest",
};

let userAgent = "";
let cookieHeader = "";
let browserPage = null;

function plainText(html) {
  if (!html) return "";
  const $ = load(html);
  $("script, style, noscript").remove();
  return $.root().text().replace(/\s+/g, " ").trim();
}

function safeSlug(slug) {
  const cleaned = String(slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
  return cleaned || "item";
}

function toPublicPath(absolutePath) {
  const relative = path.relative(PUBLIC_DIR, absolutePath).split(path.sep).join("/");
  return `/${relative}`;
}

function normalizeAssetUrl(value) {
  if (!value || value.startsWith("data:")) return null;
  let url;
  try {
    url = new URL(value, ORIGIN);
  } catch {
    return null;
  }
  if (url.hostname === "i0.wp.com") {
    const stripped = url.pathname.replace(/^\//, "");
    url = new URL(`https://${stripped}`);
  }
  if (url.hostname !== "maplesme.com" && url.hostname !== "www.maplesme.com") return null;
  url.search = "";
  url.hash = "";
  return url.href;
}

function stripResizeSuffix(assetUrl) {
  return assetUrl
    .replace(/-scaled(?=\.(jpe?g|png|webp|gif)$)/i, "")
    .replace(/-(\d+)x(\d+)(?=\.(jpe?g|png|webp|gif)$)/i, (match, width, height) => {
      if (WP_DIMENSIONS.has(width) && WP_DIMENSIONS.has(height)) return "";
      return match;
    });
}

function isUsefulImage(assetUrl) {
  const lower = assetUrl.toLowerCase();
  if (lower.includes("logo") || lower.includes("placeholder") || lower.includes("sprite")) return false;
  return /\.(jpe?g|png|webp|gif)$/i.test(lower);
}

function candidateUrls(image) {
  if (!image?.src && !image?.srcset) return [];
  const ranked = [];
  const push = (value, score) => {
    const normalized = normalizeAssetUrl(value);
    if (!normalized || !isUsefulImage(normalized)) return;
    const original = stripResizeSuffix(normalized);
    ranked.push({ url: original, score: original === normalized ? score + 1_000_000 : score });
    if (original !== normalized) ranked.push({ url: normalized, score });
  };

  if (image.srcset) {
    for (const part of image.srcset.split(",")) {
      const [rawUrl, descriptor] = part.trim().split(/\s+/);
      const width = descriptor?.endsWith("w") ? Number.parseInt(descriptor, 10) : 0;
      push(rawUrl, width || 1);
    }
  }
  push(image.src, 500_000);
  if (image.thumbnail) push(image.thumbnail, 10);

  const seen = new Set();
  return ranked
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.url)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

function extensionFor(buffer, assetUrl) {
  if (buffer.length > 12 && buffer[0] === 0xff && buffer[1] === 0xd8) return "jpg";
  if (buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  if (buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buffer.length > 6 && buffer.toString("ascii", 0, 4) === "GIF8") return "gif";
  const match = assetUrl.match(/\.(jpe?g|png|webp|gif)$/i);
  if (!match) return null;
  return match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
}

function extractSpecs(descriptionHtml, attributes) {
  const specs = [];
  const seen = new Set();
  const push = (label, value) => {
    const cleanLabel = plainText(label).replace(/:$/, "").trim();
    const cleanValue = plainText(value).trim();
    if (!cleanLabel || !cleanValue || cleanLabel.length > 48 || cleanValue.length > 240) return;
    const key = cleanLabel.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    specs.push({ label: cleanLabel, value: cleanValue });
  };

  for (const attribute of attributes || []) {
    const values = (attribute.terms || []).map((term) => term.name).filter(Boolean);
    if (values.length) push(attribute.name, values.join(", "));
  }

  const $ = load(descriptionHtml || "");
  $("li").each((_, element) => {
    const strong = $(element).find("strong").first().text();
    const full = $(element).text().replace(/\s+/g, " ").trim();
    if (strong) {
      const value = full.replace(strong, "").replace(/^[:\s-]+/, "").trim();
      push(strong, value || full);
      return;
    }
    const match = full.match(/^([^:]{2,48}):\s+(.+)$/);
    if (match) push(match[1], match[2]);
  });

  $("tr").each((_, element) => {
    const cells = $(element).find("th, td");
    if (cells.length >= 2) push($(cells[0]).text(), $(cells[1]).text());
  });

  return specs.slice(0, 16);
}

function badgeFor(specs, description) {
  const blob = `${specs.map((spec) => `${spec.label} ${spec.value}`).join(" ")} ${description}`;
  const threadCount = blob.match(/\b(\d{3})\s*(?:TC|TCS|thread counts?)\b/i);
  if (threadCount) return `${threadCount[1]} TC`;
  const gsm = blob.match(/\b(\d{3,4})\s*GSM\b/i);
  if (gsm) return `${gsm[1]} GSM`;
  const material = specs.find((spec) => /material|composition|weave/i.test(spec.label));
  if (material) return material.value.split(",")[0].trim().slice(0, 32);
  return null;
}

async function apiGet(pathname) {
  const result = await browserPage.evaluate(async (pathname) => {
    const response = await fetch(pathname, { credentials: "include" });
    return {
      status: response.status,
      total: response.headers.get("X-WP-Total"),
      pages: response.headers.get("X-WP-TotalPages"),
      text: await response.text(),
    };
  }, pathname);
  if (result.status !== 200) {
    throw new Error(`Maples API ${result.status} for ${pathname}`);
  }
  return {
    total: Number(result.total || 0),
    pages: Number(result.pages || 1),
    json: JSON.parse(result.text),
  };
}

async function collectPages(pathname) {
  const first = await apiGet(`${pathname}${pathname.includes("?") ? "&" : "?"}per_page=${PAGE_SIZE}&page=1`);
  const rows = [...first.json];
  const pageCount = Math.max(first.pages, 1);
  for (let page = 2; page <= pageCount; page += 1) {
    const next = await apiGet(`${pathname}${pathname.includes("?") ? "&" : "?"}per_page=${PAGE_SIZE}&page=${page}`);
    rows.push(...next.json);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  return rows;
}

async function refreshCookies() {
  userAgent = await browserPage.evaluate(() => navigator.userAgent);
  const cookies = await browserPage.cookies("https://maplesme.com/");
  cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

async function fetchImage(assetUrl) {
  const response = await fetch(assetUrl, {
    headers: {
      "User-Agent": userAgent,
      Cookie: cookieHeader,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: `${ORIGIN}/`,
    },
    signal: AbortSignal.timeout(45000),
  });
  const type = response.headers.get("content-type") || "";
  if (!response.ok || type.includes("text/html")) {
    throw new Error(`image ${response.status} ${type}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!extensionFor(buffer, assetUrl)) throw new Error("not an image");
  if (buffer.length < 500) throw new Error("image too small");
  return buffer;
}

async function existingFile(destWithoutExt) {
  for (const extension of ["webp", "jpg", "jpeg", "png", "gif"]) {
    const dest = `${destWithoutExt}.${extension}`;
    try {
      const info = await stat(dest);
      if (info.size > 500) return dest;
    } catch {
      // try the next extension
    }
  }
  return null;
}

const downloadedUrls = new Map();

async function saveImage(candidates, destWithoutExt) {
  const existing = await existingFile(destWithoutExt);
  if (existing) return existing;

  let lastError = null;
  for (const assetUrl of candidates) {
    try {
      if (downloadedUrls.has(assetUrl)) {
        const cached = downloadedUrls.get(assetUrl);
        const extension = path.extname(cached);
        const dest = `${destWithoutExt}${extension}`;
        await mkdir(path.dirname(dest), { recursive: true });
        if (cached !== dest) await writeFile(dest, await readFile(cached));
        return dest;
      }
      const buffer = await fetchImage(assetUrl);
      const extension = extensionFor(buffer, assetUrl);
      const dest = `${destWithoutExt}.${extension}`;
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, buffer);
      downloadedUrls.set(assetUrl, dest);
      return dest;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("no image candidates");
}

async function pool(items, worker) {
  const queue = [...items];
  const workers = Array.from({ length: IMAGE_CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(workers);
}

function discoverHomepage(html) {
  const $ = load(html);
  const links = new Set();
  const labels = [];
  const remember = (href, label) => {
    if (!href) return;
    let absolute;
    try {
      absolute = new URL(href, ORIGIN).href.split("?")[0];
    } catch {
      return;
    }
    if (!absolute.startsWith(ORIGIN)) return;
    if (!/\/product\/|\/product-category\/|\/shop\/?$/i.test(absolute)) return;
    links.add(absolute);
    if (label && label.length < 80) labels.push(label);
  };

  $("a[href]").each((_, element) => {
    remember($(element).attr("href"), $(element).text().replace(/\s+/g, " ").trim());
  });
  for (const match of html.match(/https:\/\/maplesme\.com\/(?:product-category|product)\/[a-z0-9\-/%]+/gi) || []) {
    remember(match, "");
  }
  return {
    homepageLinks: [...links],
    navigationLabels: [...new Set(labels)].slice(0, 80),
  };
}

async function discoverSitemap() {
  const urls = [];
  const visit = async (sitemapUrl, depth) => {
    if (depth > 2 || urls.length > 5000) return;
    let xml;
    try {
      const response = await fetch(sitemapUrl, {
        headers: { "User-Agent": userAgent, Cookie: cookieHeader, Accept: "application/xml,text/xml" },
        signal: AbortSignal.timeout(45000),
      });
      if (!response.ok) return;
      xml = await response.text();
    } catch {
      return;
    }
    const $ = load(xml, { xmlMode: true });
    const locs = $("loc").map((_, element) => $(element).text().trim()).get();
    const childMaps = locs.filter((loc) => loc.endsWith(".xml"));
    const pages = locs.filter((loc) => /\/product\/|\/product-category\//.test(loc));
    urls.push(...pages);
    for (const child of childMaps) {
      if (/product|category|page/i.test(child)) await visit(child, depth + 1);
    }
  };
  await visit(`${ORIGIN}/sitemap_index.xml`, 0);
  if (urls.length === 0) await visit(`${ORIGIN}/sitemap.xml`, 0);
  return [...new Set(urls)];
}

function ancestorsOf(slug, bySlug) {
  const chain = [];
  const seen = new Set();
  let current = bySlug.get(slug);
  while (current && !seen.has(current.slug)) {
    seen.add(current.slug);
    chain.push(current);
    if (!current.parentSlug) break;
    current = bySlug.get(current.parentSlug);
  }
  return chain;
}

async function main() {
  console.log("Opening Maples in Chrome to clear the site check…");
  const { browser, page } = await connect({
    headless: false,
    turnstile: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  browserPage = page;

  try {
    await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const started = Date.now();
    while (Date.now() - started < 60000) {
      const title = await page.title();
      if (!title.includes("Just a moment")) break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const title = await page.title();
    if (title.includes("Just a moment")) {
      throw new Error("Cloudflare did not clear. Re-run the script so Chrome can finish the check.");
    }
    console.log(`Clearance ok: ${title}`);
    await refreshCookies();

    const discovery = discoverHomepage(await page.content());
    console.log(`Homepage navigation links: ${discovery.homepageLinks.length}`);
    const sitemapUrls = await discoverSitemap();
    console.log(`Sitemap product and category URLs: ${sitemapUrls.length}`);

    console.log("Reading categories…");
    const rawCategories = await collectPages("/wp-json/wc/store/v1/products/categories");
    console.log(`Categories: ${rawCategories.length}`);
    console.log("Reading products…");
    const rawProducts = await collectPages("/wp-json/wc/store/v1/products");
    console.log(`Products: ${rawProducts.length}`);
    await refreshCookies();

    const categories = rawCategories.map((category) => ({
      id: category.id,
      slug: safeSlug(category.slug),
      title: plainText(category.name),
      description: plainText(category.description).slice(0, 1200),
      parentId: category.parent || 0,
      parentSlug: null,
      count: category.count || 0,
      sourceUrl: category.permalink,
      image: null,
      remoteImage: null,
      candidates: candidateUrls(category.image),
      group: null,
    }));
    const byId = new Map(categories.map((category) => [category.id, category]));
    for (const category of categories) {
      category.parentSlug = category.parentId ? byId.get(category.parentId)?.slug || null : null;
      if (!category.parentId) {
        category.group = GROUP_BY_SLUG[category.slug] || "Hospitality Collection";
      }
    }
    const bySlug = new Map(categories.map((category) => [category.slug, category]));

    const products = rawProducts.filter((product) => {
      const title = plainText(product.name);
      return !/^test[\s-]*product/i.test(title) && product.slug !== "test-product-1-aed";
    }).map((product) => {
      const categorySlugs = (product.categories || []).map((category) => safeSlug(category.slug));
      const ranked = categorySlugs
        .map((slug) => bySlug.get(slug))
        .filter(Boolean)
        .filter((category) => !SKIP_PRIMARY.has(category.slug));
      const pool = ranked.length ? ranked : categorySlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
      pool.sort((a, b) => ancestorsOf(b.slug, bySlug).length - ancestorsOf(a.slug, bySlug).length);
      const primary = pool[0] || null;
      const chain = primary ? ancestorsOf(primary.slug, bySlug) : [];
      const department = chain.at(-1) || null;
      const subcategory = chain.find((category) => category.parentSlug === department?.slug) || department;
      const description = plainText(product.short_description || product.description).slice(0, 2500);
      const specs = extractSpecs(product.description || product.short_description, product.attributes);
      const imageSets = [];
      const seen = new Set();
      for (const image of product.images || []) {
        const candidates = candidateUrls(image);
        if (!candidates.length || seen.has(candidates[0])) continue;
        seen.add(candidates[0]);
        imageSets.push(candidates);
        if (imageSets.length >= MAX_GALLERY) break;
      }
      return {
        id: product.id,
        slug: safeSlug(product.slug),
        title: plainText(product.name),
        description,
        sourceUrl: product.permalink,
        sourceSlug: product.slug,
        categorySlugs,
        primaryCategorySlug: primary?.slug || null,
        departmentSlug: department?.slug || null,
        subcategorySlug: subcategory?.slug || null,
        specs,
        badge: badgeFor(specs, description),
        image: null,
        images: [],
        remoteImages: imageSets.map((candidates) => candidates[0]),
        imageSets,
      };
    });

    const slugGroups = new Map();
    for (const product of products) {
      const base = safeSlug(product.sourceSlug || product.slug);
      const group = slugGroups.get(base) || [];
      group.push(product);
      slugGroups.set(base, group);
    }
    for (const [base, group] of slugGroups) {
      if (group.length === 1) {
        group[0].slug = base;
      } else {
        for (const product of group) {
          product.slug = `${base.slice(0, 62)}-${product.id}`;
        }
      }
    }

    const errors = [];
    let categorySaved = 0;
    console.log("Downloading category images…");
    await pool(categories.filter((category) => category.candidates.length), async (category) => {
      try {
        const dest = await saveImage(
          category.candidates,
          path.join(CATEGORY_DIR, category.slug, "hero"),
        );
        category.image = toPublicPath(dest);
        category.remoteImage = category.candidates[0];
        categorySaved += 1;
      } catch (error) {
        errors.push({ type: "category", slug: category.slug, message: error.message });
      }
    });
    console.log(`Category images saved: ${categorySaved}`);

    let productSaved = 0;
    console.log("Downloading product images…");
    await pool(products, async (product) => {
      if (!product.imageSets.length) return;
      const localImages = [];
      for (let index = 0; index < product.imageSets.length; index += 1) {
        const destBase = index === 0
          ? path.join(PRODUCT_DIR, product.slug)
          : path.join(PRODUCT_DIR, product.slug, String(index + 1));
        try {
          const dest = await saveImage(product.imageSets[index], destBase);
          localImages.push(toPublicPath(dest));
        } catch (error) {
          errors.push({ type: "product-image", slug: product.slug, message: error.message });
        }
      }
      product.image = localImages[0] || null;
      product.images = localImages;
      if (product.image) productSaved += 1;
      if (productSaved > 0 && productSaved % 40 === 0) {
        console.log(`Product images saved: ${productSaved}/${products.length}`);
      }
    });
    console.log(`Product images saved: ${productSaved}/${products.length}`);

    for (const category of categories) {
      if (category.image) continue;
      const donor = products.find((product) => product.image && (
        product.primaryCategorySlug === category.slug
        || product.subcategorySlug === category.slug
        || product.departmentSlug === category.slug
      ));
      if (!donor) continue;
      try {
        const sourceAbs = path.join(PUBLIC_DIR, donor.image.replace(/^\//, ""));
        const extension = path.extname(sourceAbs);
        const dest = path.join(CATEGORY_DIR, category.slug, `hero${extension}`);
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, await readFile(sourceAbs));
        category.image = toPublicPath(dest);
        category.remoteImage = donor.remoteImages[0] || null;
      } catch (error) {
        errors.push({ type: "category-fallback", slug: category.slug, message: error.message });
      }
    }

    for (const product of products) {
      if (product.image) continue;
      const owner = bySlug.get(product.subcategorySlug) || bySlug.get(product.departmentSlug);
      if (!owner?.image) continue;
      try {
        const sourceAbs = path.join(PUBLIC_DIR, owner.image.replace(/^\//, ""));
        const extension = path.extname(sourceAbs) || ".jpg";
        const dest = path.join(PRODUCT_DIR, `${product.slug}${extension}`);
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, await readFile(sourceAbs));
        product.image = toPublicPath(dest);
        product.images = [product.image];
        productSaved += 1;
      } catch (error) {
        errors.push({ type: "product-fallback", slug: product.slug, message: error.message });
      }
      if (!product.image) {
        errors.push({ type: "product", slug: product.slug, message: "no image on source page" });
      }
    }

    const manifest = {
      source: ORIGIN,
      syncedAt: new Date().toISOString(),
      discovery: {
        homepageLinks: discovery.homepageLinks,
        navigationLabels: discovery.navigationLabels,
        sitemapUrls,
      },
      counts: {
        categories: categories.length,
        products: products.length,
        categoryImages: categories.filter((category) => category.image).length,
        productImages: products.filter((product) => product.image).length,
        galleryImages: products.reduce((sum, product) => sum + product.images.length, 0),
        errors: errors.length,
      },
      categories: categories.map(({ candidates, ...category }) => category),
      products: products.map(({ imageSets, sourceSlug, ...product }) => product),
      errors,
    };

    await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`Manifest written: ${MANIFEST_PATH}`);
    console.log(JSON.stringify(manifest.counts));
    console.log("Sync complete");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
