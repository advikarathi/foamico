# Foamico Shopify theme — handoff notes

This folder is a complete custom Shopify Online Store 2.0 theme built to match the
existing static site's design, with real Shopify variants/cart/checkout wired in.
I have no Shopify API/CLI credentials, so I could not push this to your store myself —
here's what's needed on your end to get it live, in order.

## 1. Push the theme to your store

Install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) if you haven't,
then from this repo's root:

```
shopify theme dev --store your-store.myshopify.com   # live local preview
shopify theme push                                    # publish to the store
```

(Or: zip the `shopify-theme/` folder's *contents* — not the folder itself — and upload
via Admin → Online Store → Themes → Add theme → Upload zip file.)

## 2. Import products

Import `foamico-shopify-products.csv` (repo root) via Admin → Products → Import.
It defines all 15 mattress products (5 lines × 3 tiers × 4 sizes), the Sofa Cum Bed,
and the 7 pillows, with real prices/compare-at-prices pulled from the original site.

**Before importing**, note two things I flagged when I built that CSV:
- No image URLs are set (Shopify's importer needs public HTTPS URLs, and the product
  photos were only sitting as local files) — the theme instead references product
  photos as **theme assets** (already flattened into `shopify-theme/assets/`), so the
  storefront will look correct without this step. Uploading real Shopify Product Images
  is a nice-to-have follow-up for the admin/Google Shopping side, not required to launch.
- Sofa Cum Bed's ₹14,999 price is a placeholder (the original site had no fixed price —
  it was quote-only). Adjust it after import if you have a real number.

## 3. Create 5 collections for the tier-tabs (Classic/Premium/Luxury switcher)

Each mattress product page shows links to its sibling tiers (e.g. Sova Classic /
Premium / Luxury). That comes from a Shopify collection per line — create these 5,
each containing exactly that line's 3 products, **manually sorted in tier order**:

| Collection handle | Products (in this order) |
|---|---|
| `sova` | Sova Classic, Sova Premium, Sova Luxury |
| `resto` | Resto Classic, Resto Premium, Resto Luxury |
| `luma` | Luma Classic, Luma Premium, Luma Luxury |
| `ultima` | Ultima Classic, Ultima Premium, Ultima Luxury |
| `riva` | Riva 1000, Riva 2000, Riva 3000 |

Use manual collections (not "automated by tag") so you control the sort order — set
sort to "Manually" and drag into Classic→Premium→Luxury order.

## 4. Create a "Pillows" collection

Handle: `pillows`. Add all 7 pillow products. This one can be automated (e.g. by
product type = Pillow) — the theme uses `templates/collection.pillows.json`
automatically for any collection with that handle.

## 5. Add the pillow metafields (badge / feel / rating / review count)

The pillow grid cards show a badge ("Bestseller"), a feel tag ("Soft & Fluffy"), and a
star rating — these aren't standard Shopify fields. Go to **Settings → Custom data →
Products → Add definition** and create these 4, all under namespace `foamico`:

| Key | Type |
|---|---|
| `foamico.badge` | Single line text |
| `foamico.feel_tag` | Single line text |
| `foamico.rating` | Decimal |
| `foamico.review_count` | Integer |

Then fill in these values per pillow product (from the original site):

| Product | Badge | Feel tag | Rating | Reviews |
|---|---|---|---|---|
| Cloud Microfibre Pillow | Bestseller | Soft & Fluffy | 4.7 | 612 |
| CloudPro Microfibre Pillow | *(none)* | Medium Support | 4.6 | 398 |
| MemoTouch | Memory Foam | Firm & Low-Profile | 4.5 | 247 |
| ZeroGravity Natural | *(none)* | Low-Profile | 4.5 | 203 |
| Memorest Contour | Memory Foam | Orthopedic Contour | 4.8 | 881 |
| ZeroGravity | Cooling | Cooling Contour | 4.6 | 356 |
| ZeroGravity Contour | Cooling | Cooling Contour | 4.7 | 429 |

The pillow-grid filter buttons (Memory Foam / Microfibre / Contour / Cooling /
Cervical Support) read from product tags — these are already set correctly in
`foamico-shopify-products.csv`'s `Tags` column, so importing that CSV (step 2) is
enough; no manual tagging needed.

## 6. Create 3 Pages and assign templates

In Admin → Online Store → Pages, create:

| Page title | Handle | Template (in the page editor's "Theme template" dropdown) |
|---|---|---|
| About | `about` | `page.about` |
| Contact | `contact` | `page.contact` |
| Mattresses (shop-all) | `mattresses` | `page.products` |

The body content field can stay empty for all three — the actual layout is hardcoded
in the theme's `main-page-about.liquid` / `main-page-contact.liquid` /
`main-page-products.liquid` sections, not the page's rich-text body. Editing the page
body in Admin won't change what's shown.

## 7. Create the blog

Create a blog named "The Sleepy Times" (handle `the-sleepy-times` — or update the
fallback URL in `sections/header-group.liquid` if you use a different handle). The
theme's `blog.json`/`article.json` templates are built and ready, but **migrating the
13 existing articles' body content is a manual follow-up** — I don't have API access to
create blog posts programmatically. Copy each `blog-*.html` file's article body into a
new article in Admin; the theme will render it inside the matching visual chrome
(hero, category badge, "more articles" section) automatically. Tag each article with
its category (e.g. "Buying Guide", "Sleep Lab") so the category badge shows correctly.

## 8. Known limitations / follow-ups

- **`assets/price-bot.js`** (the chat widget's mattress price-quote calculator) still
  has its own hardcoded price table, copied as-is from the original site. It is not
  wired to your real Shopify variant prices, so if you change a price in Shopify, the
  chatbot's quote won't automatically match. Low priority, but worth knowing.
- **Product photos are theme assets, not Shopify Product Images** (see step 2) — fine
  for launch, but means no native image zoom/variant-image-swap from Shopify's own
  media system, and Google Shopping feed integration won't have images unless you
  separately upload them as Product Images later.
- **Two team-photo files were dropped**: `kunal-mukin.png`/`rahul-mukin.png` (typo'd
  filenames, not referenced by any page) — only the correctly-named `.jpg` versions
  were ported. Let me know if those PNGs were meant for something else.
