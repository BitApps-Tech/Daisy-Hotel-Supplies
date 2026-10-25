Act as an elite, Awwwards-winning frontend architect and digital art director. Build the complete multi-page luxury B2B site for Daisy Hotel Supplies in Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

Follow `.cursor/rules/daisy-design-system.mdc` for every visual decision: color, type, logo, navbar, mega-menu, image frames, motion, and catalog cards. Do not invent a second palette or restyle outside that guide.

This is Daisy Hotel Supplies' own 5-star hospitality procurement portal. No retail prices, no "Buy Now", no Unsplash placeholders, no thin landing page, and no // TODO comments.

Do not replace the catalog
The product database already exists. Read it and build on it.

src/data/catalog.ts is the typed catalog. Departments already have include: boolean, featuredCollections, images, subcategories, and products.
The JSON manifest imported by catalog.ts is already the product source. Do not re-scrape it and do not overwrite it with invented products.
src/data/own-photography.json is Daisy's own photography: 11 client-labeled clusters, 94 images, already filed in public/images/daisy/.
The rest of the product and category photography is already stored locally and linked from each catalog record. Use those paths.
Use `src/components/ui/LuxuryProductImage.tsx` for department cards, category banners, product cards, and galleries, styled exactly as the design system specifies.
There are no prices in the data. Do not add any.
Every public surface shows only departments where include === true:

Include	Slug
Bed & Bath Linen
bed-and-bath-linen
Luxury Hotel Leather Accessories
luxury-hotel-leather-accessories
Guest Comfort & Amenities
guest-comfort-and-amenities
Banquet Supplies & Decors
banquet-supplies-and-decors
Dining & Kitchen Essentials
dining-and-kitchen-essentials
Cleaning Machines & Equipment
cleaning-machine-and-equipment
Disposables Products
disposables-products
Bin Collection
bins-series
Lightings
lightings
Keep include: false departments in the data, and do not link them in navigation, the bento, or the master catalog: Furnishing Solutions, Electronics & Appliances, Hotel Trolleys & Equipment, In-Room Accessories, Hospital Linen & Equipment, Baby Products.

Use the existing product fields (title, description, specs, badge, image, images, categorySlug, subcategorySlug, departmentSlug). Do not rename the dataset to a parallel name / editorialDescription / Unsplash model. You may add a display field such as starRating only when a real spec supports it. Do not invent thread counts, GSM, or materials that are not already on the product.

Photography priority
On any category that has featuredCollections, Daisy's own photos lead. The existing catalog photography fills the rest of the grid.

Own clusters, already mapped:

Duvet covers, Comforter, Comforter 7pcs, Bedsheets, Pillows, Blankets, Throw blanket, and Kids comforter roll up under Bed Linen inside bed-and-bath-linen.
Towels, Towel, and Bathrobe for hotels roll up under Bath Linen inside bed-and-bath-linen.
The Bed & Bath department hero is the duvet-cover photograph.
Kids comforter stays inside Bed Linen. It is not the excluded Baby Products department.

Copy the logo SVGs from `Daisy Hotel Supplies SVG/` into `public/logo/` and use the black-background primary mark as the design system describes.

Navbar and mega-menu
Build `src/components/Navbar.tsx` to the design system: floating obsidian pill and detached ivory 3-column card. This menu is an editorial grouping of the included catalog, not a second taxonomy. Fill the columns with real subcategories:

Bed & Bath Linen (double-wide). Left: real children of bed-linen (sheets, duvet covers, duvets, pillows, blankets, and the other bed-linen subs that have products). Right: real children of bath-linen (towels, bathrobes, slippers, bath mats, pool towels, and the other bath-linen subs that have products). Footer: Show all Linen > to /collections/bed-and-bath-linen.
Guest Room & Bath. Real subcategories from guest-comfort-and-amenities, luxury-hotel-leather-accessories, and lightings only. Footer: Show all Guest Room >.
Dining & Banquet, then Housekeeping & Operations. Dining uses dining-and-kitchen-essentials and banquet-supplies-and-decors. Housekeeping uses cleaning-machine-and-equipment, disposables-products, and bins-series. Do not add the excluded trolley, electronics, in-room, hospital, furnishing, or baby departments.
A subcategory link goes to /collections/[departmentSlug]?sub=[subcategorySlug] and closes the menu.

Pages
Home (src/app/page.tsx). Cinematic obsidian hero with the Daisy crest, the headline "The Architecture of Five-Star Comfort", a subheadline about direct international hospitality procurement, and two actions: Explore the Catalog, Request a Wholesale Quote. Gold spec ticker. Bento of the included departments, using featuredCollections[0] or the department image through LuxuryProductImage. An "Inside the Five-Star Suite" hotspot section whose hotspots open real products from Bed & Bath and Guest Comfort. A specification section that explains thread count and GSM using real specs already in the catalog, not invented ranges. A supply section on end-to-end hotel opening packages and bulk import logistics, then a quote CTA.

Master catalog (src/app/collections/page.tsx). Search, department tabs, and a grid of real products from included departments only. Own-photo collections appear first inside their category.

Category (src/app/collections/[category]/page.tsx). Hero, subcategory pills driven by ?sub=, a buyer's guide written from that department's real spec language, then product cards. Each card shows the local image, subcategory, title, spec pills from badge and specs, View Specs, and Add to Quote. No prices.

Product (src/app/products/[slug]/page.tsx). Breadcrumb, LuxuryProductImage gallery from product.images, editorial description, specification table, quantity, Add to Wholesale Quote, and related products from the same included department.

Quote. src/context/QuoteContext.tsx persisted in localStorage, and src/components/QuoteDrawer.tsx. Procurement managers add real catalog products, set bulk quantities, and submit an RFQ with property name, contact, email, and phone. No payment and no unit price.

About and Contact. /about covers Daisy Hotel Supplies, the supply standard, and how hotels procure through Daisy. /contact is a real inquiry page. Every navbar link resolves.

Leave the existing catalog data files and image folders in place. Do not mention a supply partner anywhere in the interface or the copy.

