# Session Notes — June 16, 2026
**Project:** Buff Daddy's Website
**Branch:** phase-01
**Phases completed:** 1 through 15 (Phase 16 — Vercel deployment pending)

---

## What We Built

Full Next.js 16 website for Buff Daddy's — a high-protein dessert brand based in Dallas, TX. Built from scratch across 15 sequential plan phases.

---

## Tech Stack

- **Framework:** Next.js 16.2.9 with Turbopack, App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (no config file — all tokens in `globals.css` via `@theme`)
- **Fonts:** `next/font/google` — Bebas Neue (display), Inter (body)
- **Email:** Resend
- **Database:** Airtable (order logging)
- **Analytics:** @vercel/analytics

### Key discovery: Tailwind v4 has no `tailwind.config.ts`
All theme tokens (colors, fonts, easing) go in `globals.css` via `@theme` and `@theme inline` directives. Plan assumed v3 — adapted every phase accordingly.

---

## Phases Completed

### Phase 1 — Design Tokens & Global Styles
- Tailwind v4 `@theme` block with brand colors: `--navy`, `--pink`, `--cyan`, `--cyan-deep`, `--blush`, `--lavender`
- `:root` CSS custom properties for arbitrary Tailwind value use
- `pageFadeIn` keyframe animation on `main`
- Global `*` transition defaults
- `html { scroll-behavior: smooth }`
- Bebas Neue + Inter loaded via `next/font/google` as CSS variables on `<html>`

### Phase 2 — TypeScript Types & Data Layer
- `src/types/index.ts` — `Macro`, `Product`, `OrderItem`, `Order` interfaces
- `src/config/site.ts` — single source of truth for brand config (name, URLs, social handles, nav links)
- `src/content/index.ts` — single source of truth for all on-page copy (announcement bar, hero, stats, products, whyUs, story, order, contact, social sections)
- `src/data/products.ts` — 4 products: Peanut Butter Cookie, Buff Granny's Apple Pie, Galactic Brownie, Coming Soon muffin

### Phase 3 — Component Scaffold & Error Boundaries
- All component files created as placeholders
- `src/app/error.tsx` — full-height navy error page with "Try Again" reset button
- `src/app/not-found.tsx` — pink 404, "Looks like this page skipped leg day."
- `src/app/loading.tsx` — pulsing 💪, blush background
- `public/products/.gitkeep` and `public/favicon/.gitkeep` placeholder dirs
- Layout wired up: AnnouncementBar → Navbar → {children} → SocialStrip → Footer
- Page wired up: Hero → StatsStrip → Products → WhyUs → OurStory → OrderForm → Contact

### Phase 4 — Layout Components
- **AnnouncementBar** — navy bar, cyan link, server component
- **Navbar** — sticky, backdrop blur, scroll-reactive bg (useScrolled hook), active section tracking (useActiveSection hook), mobile hamburger drawer with open/close state
- **Footer** — dark `#060714` bg, 3-column grid, footer nav with `hover:translate-x-0.5` nudge
- **SocialStrip** — pink bg, Instagram + TikTok pill links

### Phase 5 — Hooks & Hero & StatsStrip
- `useScrolled` — passive scroll listener, returns true when scrollY > 80
- `useActiveSection` — single IntersectionObserver across all section IDs, threshold 0.4
- `useScrollReveal` — shared observer per threshold via `Map<number, IntersectionObserver>`, element callbacks via `WeakMap<Element, () => void>`, staggered delay via inline `transitionDelay`
- `useParallax` — passive scroll listener, returns `scrollY * speed` for badge cluster float
- **Hero** — full viewport, synthwave grid overlay, scroll reveal on copy, parallax badge cluster, three staggered bouncing badges
- **StatsStrip** — navy bg, staggered scroll reveal, Bebas Neue stat values in pink

### Phase 6 — UI Primitives
- **SectionEyebrow** — 11px bold uppercase, pink or cyan variants
- **MacroPill** — default (blush/pink) and protein (cyan) variants
- **AllergenTag** — navy bg, 10px caps
- **ProductCard** — hover lift + pink border glow, synthwave grid overlay, next/image or emoji fallback, ingredients accordion toggle, "Get Notified" link for coming soon

### Phase 7 — Products & WhyUs Sections
- **Products** — filter tabs (All/Cookies/Bars/Muffins), CSS grid `auto-fit minmax(280px, 1fr)`, RevealCard wrapper pattern (hooks can't be called inside .map())
- **WhyUs** — navy bg with synthwave grid, 2×2 card grid, hover lift + icon pop

### Phase 8 — OurStory Section
- Two-column layout: left navy card with pull quote (Bebas Neue, pink accent), right text with lavender tag pills
- Both columns use staggered useScrollReveal

### Phase 9 — API Routes
- `src/lib/sanitize.ts` — strips HTML tags before data touches Resend/Airtable
- `src/lib/rateLimit.ts` — in-memory Map, per-IP windowed counter
- `src/app/api/orders/route.ts` — POST only, rate limit 5/min, validates all fields, sanitizes, sends Resend email + writes Airtable record
- `src/app/api/contact/route.ts` — POST only, rate limit 3/min, Resend only

### Phase 10 — OrderForm Section
- Dynamic item rows with add/remove
- Product select options from data layer
- Field-level validation (no alerts — inline pink error messages)
- Loading / success / error states
- Success replaces form with confirmation copy

### Phase 11 — Contact Section
- Split into server wrapper (`Contact.tsx`) + client form (`ContactForm.tsx`)
- Dark-themed inputs with focus ring
- Subject select from content layer
- Success state: button permanently becomes "✓ Message Sent!" in cyan

### Phase 12 — Polish Pass
- `active:scale-95` audit across all buttons and links
- `hover:-translate-y-1.5` on all cards
- Section id audit: `products`, `why`, `story`, `order`, `contact`
- Focus-visible ring audit on all form inputs
- Confirmed smooth scroll in globals

### Phase 13 — SEO, Metadata & Structured Data
- Full `Metadata` export in layout: title template, description, OG, Twitter card
- `src/app/opengraph-image.tsx` — 1200×630 OG image via `next/og` (built-in, no @vercel/og needed)
- JSON-LD `FoodEstablishment` schema in page.tsx
- `src/app/sitemap.ts` and `src/app/robots.ts`

### Phase 14 — Mobile Audit & Accessibility
- **StatsStrip** — changed `flex flex-wrap divide-x` → `grid grid-cols-2 sm:grid-cols-4 divide-x divide-y` for correct 2×2 mobile layout
- Focus-visible rings added to: AnnouncementBar link, Hero CTAs, SocialStrip links, Footer links, ProductCard "Get Notified" link, Navbar logo
- Navbar: `useRef` + `useEffect` focus trap for mobile drawer, `aria-expanded` on hamburger

### Phase 15 — Analytics & Final Checks
- Installed `@vercel/analytics`, added `<Analytics />` to layout
- Created `CHANGELOG.md`
- Created `public/manifest.json` (name, theme_color, background_color, display: standalone)
- Final build: clean, zero errors, zero type errors

---

## Key Technical Decisions & Gotchas

| Issue | Resolution |
|---|---|
| Tailwind v4 has no config file | All tokens in `globals.css` via `@theme` / `@theme inline` |
| `@vercel/og` not in plan | Next.js 16 has `ImageResponse` built into `next/og` — no install needed |
| `resend` + `airtable` not pre-installed | Installed at Phase 9 start |
| WeakMap can't key on primitives | Used `Map<number, IntersectionObserver>` for threshold-keyed observer cache |
| Hooks can't be called in `.map()` | Created `RevealCard` wrapper sub-component pattern in Products and WhyUs |
| `divide-x` doesn't work in `flex-wrap` | Switched StatsStrip to CSS grid |
| OG image: no Tailwind support | Inline styles only inside `ImageResponse` JSX |

---

## Post-Session Additions (outside plan phases)

### WhyUs Carousel (mobile only)
Converted the 2×2 tile grid to a CSS scroll-snap carousel on mobile:
- Mobile (`< md`): `snap-x snap-mandatory` flex container, 82vw cards, native swipe — no JS dragging
- Dot indicators track active card via scroll handler + `Math.round(scrollLeft / cardWidth)`
- Desktop (`md+`): original 2×2 grid unchanged
- Zero dependencies added

### Brand Asset Import
Created `public/assets/` folder and imported designer product sleeve images:
- `sleeve-galactic-brownie.png` (image 1)
- `sleeve-blueberry-buffins.png` (image 2)
- `sleeve-buff-granny.png` (image 3)
- `sleeve-misc.png` (image 4 — designer test sheet, ignore)

---

## Font Analysis (designer assets)
Identified from product sleeve designs for upcoming typography update:

| Usage | Likely Font |
|---|---|
| Logo "BUFF DADDY'S" | Luckiest Guy (Google Fonts) |
| Product titles (tall condensed) | Bebas Neue or Anton |
| Product subtitles (pink italic) | Bangers or Boogaloo |
| "BUILT FOR THE GAINS" bold italic | Barlow Condensed Black Italic or Changa One |
| Supporting caps labels | Oswald Bold or Montserrat Bold |
| Body copy | Montserrat or Open Sans |

Designer to confirm exact font names. If paid/custom, use `next/font/local`.

---

## What's Left

- **Phase 16** — Vercel deployment (push to GitHub, import repo, add env vars, go live)
- Add real product photography (WebP, set `imageSrc` in `src/data/products.ts`)
- Typography update using confirmed brand fonts from designer
- Site visual refresh based on sleeve design language (neon glows, synthwave grid, product imagery)
- See `plan.md` backlog for full post-launch feature list
