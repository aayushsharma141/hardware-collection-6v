# 19 — Website CMS / Structure Reference
Summary of the already-decided website architecture. Full PRD/Technical Spec/Design System live in the separate website build-doc pack — this is the quick-reference index.

## Stack
Next.js 14 + Tailwind CSS + Vercel · Domain: hardwarecollection.co

## Design System Quick Reference
| Token | Value |
|---|---|
| Primary color | Crimson #8B1A4A |
| Accent color | Gold #C8A96E |
| Background | Near-black #0E0C0C |
| Display font | Cormorant Garamond |
| Body font | DM Sans |

## Site Structure (content collections, no e-commerce cart)
- Home
- Brands (from 02_BRANDS.md)
- Product Categories (from 03_PRODUCT_CATEGORIES.md — card grid, no SKU checkout)
- Catalogs (downloadable PDFs, from 04_CATALOG_LIBRARY.md)
- About / Showroom
- Contact (address, map embed, WhatsApp CTA — no contact form required, WhatsApp is the primary conversion point)
- Guides/Blog (from 16_KNOWLEDGE_BASE.md) — optional Phase 2

## WhatsApp CTA Rule
Every page must include a WhatsApp CTA using +91 98351 90738 with a section-specific pre-filled, URL-encoded message (e.g., kitchen page pre-fills "Hi, I'm interested in modular kitchen hardware").

## Coming Soon Page
Built with countdown timer; launch date in code is adjustable (currently set placeholder — confirm final go-live date with Mukesh before launch).

## Out of Scope (explicitly, per proportionality rule)
- Shopping cart / checkout
- User accounts/login
- Live inventory sync
- Multi-language site (unless requested)
