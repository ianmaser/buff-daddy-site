# Buff Daddy's — Claude Code Build Plan

## How to use this file

- Start each Claude Code session by saying: **"Read plan.md and execute the next unchecked phase. Check it off when done."**
- Claude Code will read this file, find the next `[ ]`, execute the prompt, then update it to `[x]`
- Only one phase per session. Commit after each phase passes a visual check.
- If something goes wrong, `git checkout` to revert and re-run the phase.
- Do not skip phases. Each one assumes the previous is complete.

---

## Pre-flight (do this manually before opening Claude Code)

```bash
npx create-next-app@latest buffdaddys \
  --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*"
cd buffdaddys
npm install resend airtable
npm install -D @vercel/og
git add -A && git commit -m "init: bootstrapped Next.js project"
```

Create `.env.local` in the project root:

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=orders@buffdaddytreats.com
RESEND_TO_EMAIL=your@email.com
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=Orders
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add `.env.local` to `.gitignore` if not already there. Then open Claude Code.

---

## Phases

- [ ] **Phase 1 — Design Tokens & Global Styles**

> Read this plan.md to understand the project context: Buff Daddy's is a high-protein dessert brand based in Dallas. The full palette and design system is already decided.
>
> Do the following and nothing else:
>
> 1. Update `tailwind.config.ts` to extend the theme with these exact color tokens:
>    - `navy: '#0D0E2B'`
>    - `pink: '#FF3EA5'`
>    - `cyan: '#00D4C8'`
>    - `cyan-deep: '#008F8A'`
>    - `blush: '#FFF0F7'`
>    - `lavender: '#EDE0FF'`
>      Also extend `fontFamily` with `display: ['var(--font-display)', 'sans-serif']` and `body: ['var(--font-body)', 'sans-serif']`.
>      Also extend `transitionTimingFunction` with `spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'` for use on interactive elements.
> 2. In `src/app/globals.css`, add CSS custom properties to `:root`:
>    - All color tokens: `--navy`, `--pink`, `--cyan`, `--cyan-deep`, `--blush`, `--lavender`
>    - `--text-dark: #0D0E2B`, `--text-light: #6B7280`
>    - Add a global page fade-in: `@keyframes pageFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }` and apply it to `main { animation: pageFadeIn 0.4s ease forwards; }`
>    - Add a global `* { transition-property: color, background-color, border-color, box-shadow, transform, opacity; transition-duration: 200ms; transition-timing-function: ease; }` so all interactive elements inherit smooth transitions by default. Exclude elements with `transition-none` class.
>    - Keep Tailwind's base/components/utilities directives.
> 3. In `src/app/layout.tsx`, configure `next/font/google` to load `Bebas_Neue` (weight 400, `display: 'swap'`) and `Inter` (weights 400 500 600 700 900, `display: 'swap'`). Apply them as CSS variables (`--font-display`, `--font-body`) on the `<html>` element. The `display: 'swap'` is required to prevent invisible text during font load.
> 4. Run `npm run build` to confirm no errors.
>
> When done, mark this phase complete in plan.md by changing `[ ]` to `[x]`.

---

- [ ] **Phase 2 — TypeScript Types & Data Layer**

> Do the following and nothing else:
>
> 1. Create `src/types/index.ts` with these interfaces:
>
>    ```ts
>    export interface Macro {
>      calories: number | string;
>      protein: string;
>      sugar: string;
>    }
>
>    export interface Product {
>      id: string;
>      name: string;
>      slug: string;
>      category: "cookies" | "bars" | "muffins";
>      tagline: string;
>      emoji: string; // placeholder — shown when imageSrc is not set
>      imageSrc?: string; // optional real photo, e.g. '/products/peanut-butter.jpg'
>      imageAlt?: string; // alt text for the real photo
>      cardBg: string; // tailwind gradient classes used as fallback bg behind emoji
>      macros: Macro;
>      allergens: string[];
>      ingredients: string;
>      comingSoon?: boolean;
>    }
>
>    export interface OrderItem {
>      itemName: string;
>      qty: number;
>    }
>
>    export interface Order {
>      name: string;
>      contact: string;
>      pickupWindow: string;
>      items: OrderItem[];
>      notes?: string;
>    }
>    ```
>
> 2. Create `src/config/site.ts` — single source of truth for all brand-level config. Any time a component needs a handle, URL, address, or nav label it imports from here, never hardcodes it.
>    ```ts
>    export const siteConfig = {
>      name: "Buff Daddy's",
>      tagline: "Desserts · Snacks & Treats",
>      description:
>        "High protein desserts that taste like a cheat day. Calorie conscious. Naturally sweetened. Small-batch in Dallas, TX.",
>      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
>      location: "Dallas, TX",
>      instagram: "@buffdaddytreats",
>      instagramUrl: "https://instagram.com/buffdaddytreats",
>      tiktok: "@buffdaddytreats",
>      tiktokUrl: "https://tiktok.com/@buffdaddytreats",
>      websiteDisplay: "buffdaddytreats.com",
>      nav: [
>        { label: "Menu", href: "#products" },
>        { label: "Why Us", href: "#why" },
>        { label: "Our Story", href: "#story" },
>        { label: "Contact", href: "#contact" },
>      ],
>      footerNav: [
>        { label: "Menu", href: "#products" },
>        { label: "Order", href: "#order" },
>        { label: "Story", href: "#story" },
>        { label: "Contact", href: "#contact" },
>      ],
>    };
>    ```
> 3. Create `src/content/index.ts` — single source of truth for all on-page copy. Components import copy from here; they never contain hardcoded strings. Copy updates require touching only this file.
>    ```ts
>    export const content = {
>      announcement: {
>        text: "🏋️ Dallas-area orders only for now —",
>        linkLabel: "place your order here",
>        linkHref: "#order",
>      },
>      hero: {
>        eyebrow: "Dallas · High Protein · Clean Ingredients",
>        headline: "HIGH PROTEIN DESSERTS THAT TASTE LIKE A",
>        headlineAccent: "CHEAT DAY",
>        subtext:
>          "Calorie conscious. Naturally sweetened. Made for people who lift heavy and still want something sweet.",
>        primaryCta: { label: "See the Menu", href: "#products" },
>        secondaryCta: { label: "Place an Order", href: "#order" },
>        floatingBadges: [
>          { label: "Less Calories 🔥", variant: "pink" },
>          { label: "More Protein 💪", variant: "cyan" },
>          { label: "Clean Ingredients 🌿", variant: "lavender" },
>        ],
>      },
>      stats: [
>        { value: "16G+", label: "Protein Per Serving" },
>        { value: "2G", label: "Sugar (Some Items)" },
>        { value: "190", label: "Calories From" },
>        { value: "0", label: "Artificial Flavors" },
>      ],
>      products: {
>        eyebrow: "The Menu",
>        headline: "FLEX YOUR FLAVOR",
>        subtext:
>          "Every item is engineered to hit your macros without sacrificing the taste you actually want.",
>      },
>      whyUs: {
>        eyebrow: "Follow Your Gut",
>        headline: "WHY BUFF DADDY'S HITS DIFFERENT",
>        subtext:
>          "We're not a supplement company that figured out baking. We're dessert people who got obsessed with macros.",
>        cards: [
>          {
>            icon: "🏋️",
>            title: "Made for Lifters",
>            body: "Every recipe is designed around a lifter's macros. High protein targets, controlled sugar, clean calorie counts.",
>          },
>          {
>            icon: "🌿",
>            title: "Clean Ingredients",
>            body: "No artificial flavors, no weird fillers. Naturally sweetened with monkfruit and honey. You can read everything on the label.",
>          },
>          {
>            icon: "🍪",
>            title: "Actually Tastes Good",
>            body: "We obsess over taste. If it doesn't taste almost as good as the real thing, it doesn't make the menu.",
>          },
>          {
>            icon: "📍",
>            title: "Small Batch, Dallas-Made",
>            body: "Made locally in small batches. No mass production shortcuts. Fresh, real, and made with attention to every item.",
>          },
>        ],
>      },
>      story: {
>        eyebrow: "Our Story",
>        headline: "THE OG BUFF DADDY",
>        pullQuote: {
>          prefix: "WE WANTED TO ",
>          accent: "EAT DESSERT",
>          suffix: " AND STILL HIT OUR MACROS. SO WE BUILT IT.",
>        },
>        paragraphs: [
>          "It started the same way most gym problems do — standing in the kitchen after a workout, craving something sweet, and staring down a protein bar that tasted like cardboard.",
>          "We're lifters first. But we've got a serious sweet tooth. So we started experimenting: swapping out ingredients, dialing in macros, taste-testing with anyone who'd let us. What started as a kitchen experiment turned into something people kept asking for.",
>          "Buff Daddy's is the answer to a question every gym person has asked: why can't healthy food just taste good?",
>        ],
>        tags: [
>          "🏠 Dallas-based",
>          "🤸 Lifters first",
>          "🍪 No compromises on taste",
>        ],
>      },
>      order: {
>        eyebrow: "Place an Order",
>        headline: "READY TO EAT?",
>        subtext:
>          "We're local (Dallas, TX) and taking orders now. Fill out the form and we'll reach out to confirm pickup details and availability.",
>        note: "We'll reach out within 24hrs to confirm your order and schedule pickup. Minimum 48hr notice appreciated for larger orders.",
>        successTitle: "ORDER RECEIVED!",
>        successBody:
>          "We'll text or email you within 24 hours to confirm everything and sort out pickup. Get ready to eat good.",
>      },
>      contact: {
>        eyebrow: "Get in Touch",
>        headline: "HIT US UP",
>        subtext:
>          "Questions about ingredients, bulk orders, or just want to hype up your macros? We're real people — reach out.",
>        subjectOptions: [
>          "General question",
>          "Bulk / event order",
>          "Ingredient / allergy question",
>          "Collab or partnership",
>          "Just saying hi 👋",
>        ],
>      },
>      social: {
>        prompt: "Follow the gains 👊",
>      },
>    };
>    ```
> 4. Create `src/data/products.ts` that exports a `products` array typed as `Product[]` with these four entries. `imageSrc` is intentionally omitted — add it per product when real photography is ready. The `emoji` field is the active placeholder.
>    - **Peanut Butter Cookie** — id: 'peanut-butter', slug: 'peanut-butter', category: cookies, tagline: "Our peanut cookies will make you nut 👀", emoji: 🥜, macros: { calories: 190, protein: '16g', sugar: '3g' }, allergens: ['Contains Milk', 'Contains Eggs'], ingredients: "Peanut butter, egg, whey protein (milk), sugar, chocolate, vanilla, baking soda, salt.", cardBg: 'from-cyan to-cyan/50'
>    - **Buff Granny's Apple Pie** — id: 'apple-pie', slug: 'apple-pie', category: cookies, tagline: "Granny's recipe. Buff Daddy's macros.", emoji: 🍎, macros: { calories: '~220', protein: '30g', sugar: '2g' }, allergens: ['Contains Milk', 'Gluten from oats'], ingredients: "Apples, whey protein (milk), oats, oat flour, Greek yogurt (milk), honey, monkfruit maple syrup, lemon, cinnamon, salt.", cardBg: 'from-pink to-pink/50'
>    - **Galactic Brownie** — id: 'galactic-brownie', slug: 'galactic-brownie', category: bars, tagline: "To infinity and beyond your macros 🚀", emoji: 🍫, macros: { calories: '~280', protein: '90g', sugar: '2g' }, allergens: ['Milk', 'Eggs', 'Tree Nuts'], ingredients: "Eggs, Greek yogurt (milk), all purpose flour, whey protein (milk), butter (milk), blueberries, monkfruit sweetener, vanilla, lemon zest, baking powder.", cardBg: 'from-navy to-navy/80'
>    - **Coming Soon** — id: 'coming-soon', slug: 'coming-soon', category: muffins, name: "??? Drop", tagline: "We're cooking something. Sign up to find out first.", emoji: 🧁, macros: { calories: 'TBD', protein: 'High', sugar: 'Low' }, allergens: [], ingredients: '', comingSoon: true, cardBg: 'from-lavender to-lavender/60'
>      Add this comment above the array: `// To add real photos: set imageSrc: '/products/filename.webp' and imageAlt on any product. ProductCard renders next/image when imageSrc is present, emoji otherwise.`
> 5. Run `npx tsc --noEmit` to confirm no type errors.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 3 — Component Scaffold & Error Boundaries**

> Do the following and nothing else — create empty placeholder components with just a named default export returning `null`. Do not write any real UI yet.
>
> Create these component files:
>
> - `src/components/layout/AnnouncementBar.tsx`
> - `src/components/layout/Navbar.tsx`
> - `src/components/layout/Footer.tsx`
> - `src/components/layout/SocialStrip.tsx`
> - `src/components/sections/Hero.tsx`
> - `src/components/sections/StatsStrip.tsx`
> - `src/components/sections/Products.tsx`
> - `src/components/sections/WhyUs.tsx`
> - `src/components/sections/OurStory.tsx`
> - `src/components/sections/OrderForm.tsx`
> - `src/components/sections/Contact.tsx`
> - `src/components/ui/ProductCard.tsx`
> - `src/components/ui/MacroPill.tsx`
> - `src/components/ui/AllergenTag.tsx`
> - `src/components/ui/SectionEyebrow.tsx`
>
> Create these app-level route files (these are not placeholder nulls — write real content as specified):
>
> **`src/app/error.tsx`** — must be a Client Component (`'use client'`). Receives `error: Error` and `reset: () => void` props. Render a full-height centered section with navy background, the Buff Daddy's brand name in Bebas Neue, a friendly error message ("Something went sideways. Our bad."), and a "Try Again" button that calls `reset()`. Style with brand tokens. This is the catch-all for any unhandled runtime errors.
>
> **`src/app/not-found.tsx`** — render a full-height centered section with navy background, large "404" in Bebas Neue pink, "Page Not Found" in white, a short on-brand message ("Looks like this page skipped leg day."), and a link back to `/` styled as the primary pink button. No `'use client'` needed.
>
> **`src/app/loading.tsx`** — a full-height centered div with blush background, a pulsing 💪 emoji (using Tailwind `animate-pulse`), and "Loading..." text in navy Bebas Neue. This shows during any route-level suspense.
>
> Create the placeholder directory for future product photography:
>
> - `public/products/.gitkeep`
> - `public/favicon/.gitkeep` (placeholder for favicon assets to be added later)
>
> Confirm `src/config/site.ts` and `src/content/index.ts` exist from Phase 2 — do not recreate them.
>
> Update `src/app/layout.tsx` to import and render `AnnouncementBar` and `Navbar` above `{children}`, `SocialStrip` and `Footer` below.
>
> Update `src/app/page.tsx` to import and render all section components in this order: Hero, StatsStrip, Products, WhyUs, OurStory, OrderForm, Contact.
>
> Run `npm run dev` and confirm the app loads at localhost:3000 with no errors (blank page is fine). Navigate to `/anything-invalid` and confirm the not-found page renders.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 4 — Layout Components**

> Build the three layout components and the SocialStrip. Use Tailwind classes only — no inline styles. Use CSS variables where Tailwind tokens aren't enough.
>
> **Important:** All text content and config values must be imported from `src/config/site.ts` and `src/content/index.ts`. Do not hardcode any strings directly in these components.
>
> **AnnouncementBar.tsx**
>
> - Import `content` from `@/content`
> - Full-width bar, `bg-[var(--navy)]`, white text, centered, text-xs tracking-widest
> - Renders `content.announcement.text` followed by a `<a>` link in `text-[var(--cyan)]` font-semibold
>
> **Navbar.tsx**
>
> - Import `siteConfig` from `@/config/site`
> - Sticky top-0, z-50, `backdrop-blur-md`, subtle bottom border
> - **Scroll behavior:** implement a `useScrolled` hook inline (or in `src/hooks/useScrolled.ts`) that listens to `window.scroll` and returns `true` when `scrollY > 80`. When scrolled: `bg-[rgba(255,245,250,0.97)] shadow-sm`. When at top: `bg-[rgba(255,245,250,0.80)]`. Transition between these with `transition-all duration-300`.
> - **Active section tracking:** implement a `useActiveSection` hook in `src/hooks/useActiveSection.ts`. It takes an array of section ids and uses a single `IntersectionObserver` (one observer, not one per section) with `threshold: 0.4` to track which section is currently in view. Returns the active section id string. Use it in Navbar to highlight the matching nav link with `text-[var(--pink)]`.
> - Left: logo mark (small navy circle with 💪, then "BUFF" navy + "DADDY'S" pink in Bebas Neue tracking-widest)
> - Center/Right: nav links mapped from `siteConfig.nav`. Active link gets `text-[var(--pink)]`, others `text-navy hover:text-[var(--pink)]`
> - Far right: "Order Now" pill `bg-[var(--pink)] text-white` — on hover: `hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,62,165,0.4)]`. On active/press: `active:translate-y-0 active:shadow-none`.
> - Mobile: hide nav links at < 768px, show hamburger ☰ button. Clicking opens a full-width navy drawer with stacked links and Order Now button. Manage with useState. Close drawer when a link is clicked.
>
> **Footer.tsx**
>
> - Import `siteConfig` from `@/config/site`
> - `bg-[#060714]`, three columns: brand + tagline, nav links mapped from `siteConfig.footerNav` (hover `text-[var(--cyan)]`), copyright using `siteConfig.name` and `siteConfig.location`
> - Footer links: `hover:text-[var(--cyan)] hover:translate-x-0.5 transition-transform` for a subtle nudge effect
>
> **SocialStrip.tsx**
>
> - Import `siteConfig` from `@/config/site` and `content` from `@/content`
> - `bg-[var(--pink)]`, flex row centered, `content.social.prompt` in white bold uppercase
> - Two pill links from `siteConfig.instagramUrl` / `siteConfig.tiktokUrl`: `bg-white/20 text-white border border-white/40`, hover: `bg-white text-[var(--pink)] -translate-y-0.5`
>
> Run `npm run dev` and visually confirm all four render correctly. Scroll the page and confirm the nav background transitions at 80px.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 5 — Hooks & Hero & StatsStrip**

> First, implement the shared hooks. Then build the sections.
>
> **`src/hooks/useScrollReveal.ts`**
> Create a hook that accepts an optional `options` object (`threshold?: number`, `delay?: number`). Internally it creates a **single shared IntersectionObserver** (use a module-level WeakMap to cache observers by options signature — do not create one observer per element). The hook returns a `ref` to attach to any element and an `isVisible` boolean. When the element enters the viewport, set `isVisible = true` and unobserve. Apply `delay` as a CSS `transitionDelay` via an inline style on the element.
>
> **`src/hooks/useScrolled.ts`**
> Returns `true` when `window.scrollY > 80`. Uses a passive scroll event listener. Cleans up on unmount.
>
> **`src/hooks/useActiveSection.ts`**
> Accepts `sectionIds: string[]`. Creates one `IntersectionObserver` with `threshold: 0.4` that watches all sections. Returns the id of the currently intersecting section. Cleans up on unmount.
>
> **`src/hooks/useParallax.ts`**
> Accepts a `speed` multiplier (e.g. `0.3`). Returns a `y` value (`scrollY * speed`) updated on scroll via a passive listener. Used to apply a subtle parallax offset to the hero badge cluster.
>
> ---
>
> **Hero.tsx**
>
> - Import `content` from `@/content`, use `content.hero.*` for all text
> - Full viewport height min, `bg-gradient-to-br from-blush via-lavender to-cyan/30`
> - Synthwave grid overlay: `before:` pseudo via a wrapper div — horizontal lines `rgba(0,212,200,0.1)`, vertical lines `rgba(255,62,165,0.06)`, 60px grid, perspective transform downward
> - Left side (max-w-xl), apply `useScrollReveal`:
>   - Eyebrow pill: navy bg, cyan text, rounded-full, text-xs tracking-widest uppercase
>   - H1 in Bebas Neue, `text-[clamp(52px,7vw,88px)]`, headline + headlineAccent in pink
>   - Subtext paragraph
>   - Button row: primary `bg-[var(--pink)] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98]`, secondary navy outline same hover lift
> - Right side: badge cluster with `useParallax(0.25)` applied as `transform: translateY({y}px)` — gives the cluster a slight float as you scroll, making the hero feel alive. Central circle `bg-gradient-to-br from-cyan to-pink` 200px with alternating cyan/pink pulsing glow animation. Three floating badges from `content.hero.floatingBadges` with staggered `animation-delay`.
>
> **StatsStrip.tsx**
>
> - Import `content` from `@/content`, map over `content.stats`
> - `bg-[var(--navy)]`, flex row centered
> - Apply `useScrollReveal` to each stat item with `delay: index * 100`
> - Stat values: Bebas Neue 42px `text-[var(--pink)]`
> - Stat labels: 12px uppercase tracking-widest `text-[var(--cyan)]`
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 6 — UI Primitives**

> Build the small reusable UI components. These will be used by ProductCard and other sections.
>
> **SectionEyebrow.tsx** — props: `children`, `color?: 'pink' | 'cyan'` (default pink)
>
> - 11px, font-bold, tracking-widest, uppercase
> - Pink: `text-[var(--pink)]`, Cyan: `text-[var(--cyan)]`
>
> **MacroPill.tsx** — props: `label`, `value`, `variant?: 'default' | 'protein'`
>
> - Default: `bg-blush border border-pink/20 text-navy`, rounded-full, text-xs font-bold, px-3 py-1
> - Protein: `bg-cyan/10 border border-cyan text-cyan-deep`
> - Renders: "{value} {label}"
>
> **AllergenTag.tsx** — props: `label`
>
> - Navy bg, white text, rounded, text-[10px] font-semibold uppercase tracking-wide, px-2 py-0.5
>
> **ProductCard.tsx** — props: `product: Product`
>
> - White card, rounded-2xl, `border-2 border-transparent`
> - Hover: `hover:border-pink hover:shadow-[0_20px_48px_rgba(255,62,165,0.18)] hover:-translate-y-1.5`
> - Press: `active:translate-y-0 active:shadow-md` — gives a satisfying push-down feel
> - `transition-all duration-300 cursor-pointer`
> - **Top image area (h-48):** always render `bg-gradient-to-br {product.cardBg}` as the base. Then:
>   - If `product.imageSrc` is set: render `next/image` with `fill`, `object-cover`, `alt={product.imageAlt ?? product.name}`, `sizes="(max-width: 768px) 100vw, 33vw"`, `priority={false}`. The gradient shows while loading.
>   - If `product.imageSrc` is NOT set: render `product.emoji` centered at 72px.
>   - Always render the synthwave grid overlay div on top (consistent aesthetic pre/post photo swap).
> - **Body:** SectionEyebrow (category), name in Bebas Neue 26px navy, tagline text-sm text-light, MacroPill row, AllergenTag row
> - **Ingredients toggle:** `'use client'` — button "↓ Ingredients" in cyan-deep text-xs uppercase, toggles ingredients text with useState. Button text flips to "↑ Hide" when open.
> - If `comingSoon`: replace toggle with `<a href="#contact">Get Notified →</a>` in cyan-deep
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 7 — Products & WhyUs Sections**

> **Products.tsx**
>
> - Import `content` from `@/content` and `products` from `@/data/products`
> - `bg-[var(--blush)]`
> - Header centered: SectionEyebrow, h2, subtext from `content.products`
> - Filter tabs: All, Cookies, Bars, Muffins — useState for active tab
>   - Active: `bg-[var(--pink)] text-white border-pink`
>   - Hover inactive: `hover:bg-[var(--cyan)] hover:text-navy hover:border-cyan`
>   - Default: navy border + text, transparent bg
>   - Tabs get `active:scale-95` for press feedback
> - CSS grid `grid-cols-[repeat(auto-fit,minmax(280px,1fr))]`, gap-7
> - `<ProductCard>` per filtered product, each with `useScrollReveal({ delay: index * 100 })`
>
> **WhyUs.tsx**
>
> - Import `content` from `@/content`
> - `bg-[var(--navy)]` with synthwave grid overlay
> - SectionEyebrow color="cyan", h2 in white, subtext white/60 — all from `content.whyUs`
> - 2x2 grid on desktop, 1 col mobile
> - Cards: `bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8`
>   - Hover: `hover:border-cyan hover:bg-cyan/[0.06]`
>   - Icon div gets `group-hover:scale-110 transition-transform` for subtle icon pop on card hover (add `group` class to card)
> - Map over `content.whyUs.cards`, apply `useScrollReveal({ delay: index * 100 })` to each
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 8 — OurStory Section**

> **OurStory.tsx**
>
> - Import `content` from `@/content`
> - `bg-[#FAF6FF]`
> - Two columns (stacks mobile): visual card left, text right
> - Left (apply `useScrollReveal`): navy card `bg-gradient-to-br from-navy to-[#1A1B4B]` with synthwave grid overlay, large 💪🍰 emoji, pull quote from `content.story.pullQuote` in Bebas Neue — prefix white, accent pink, suffix white
> - Right (apply `useScrollReveal({ delay: 150 })`):
>   - SectionEyebrow from `content.story.eyebrow`
>   - h2 from `content.story.headline` in Bebas Neue navy
>   - Map over `content.story.paragraphs` → `<p>` elements
>   - Tag pills mapped from `content.story.tags`: lavender bg, navy text, `hover:-translate-y-0.5 hover:shadow-sm` for subtle lift
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 9 — API Routes**

> Create two API routes. These run server-side only. Use env vars from .env.local.
>
> **`src/lib/sanitize.ts`** — create this utility first:
>
> ```ts
> // Strips HTML tags from user input before it touches any downstream system
> export function sanitize(str: string): string {
>   return str.replace(/<[^>]*>/g, "").trim();
> }
> ```
>
> **`src/lib/rateLimit.ts`** — simple in-memory rate limiter:
>
> ```ts
> const requests = new Map<string, { count: number; resetAt: number }>();
>
> export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
>   const now = Date.now();
>   const entry = requests.get(ip);
>   if (!entry || now > entry.resetAt) {
>     requests.set(ip, { count: 1, resetAt: now + windowMs });
>     return true;
>   }
>   if (entry.count >= limit) return false;
>   entry.count++;
>   return true;
> }
> ```
>
> **`src/app/api/orders/route.ts`**
>
> - Export `POST` only — return 405 for other methods
> - Extract IP from `request.headers.get('x-forwarded-for') ?? '127.0.0.1'`. Call `rateLimit(ip, 5, 60_000)` — return 429 `{ error: 'Too many requests. Please wait a minute.' }` if it returns false.
> - Parse body, validate: `name`, `contact`, `pickupWindow` required strings; `items` required array min length 1, each item has `itemName` (string) and `qty` (number > 0). Return 400 with `{ error: string }` on failure.
> - Sanitize all string fields with `sanitize()` before use.
> - Send email via Resend: from `RESEND_FROM_EMAIL`, to `RESEND_TO_EMAIL`, subject `New Order from {name}`, HTML body with a clean formatted table of all order fields and items.
> - Log to Airtable: fields Name, Contact, PickupWindow, Items (JSON.stringify), Notes, Status ("New"), CreatedAt (ISO timestamp).
> - Return `{ success: true }` 200 on success. On any error: `console.error` server-side, return `{ error: 'Something went wrong. Please try again.' }` 500. Never expose raw error details to client.
> - Wrap everything in try/catch.
>
> **`src/app/api/contact/route.ts`**
>
> - Same rate limit check (3 per minute per IP)
> - Validate: `name`, `email` (must contain @), `subject`, `message`. Sanitize all.
> - Send one Resend email with contact details. No Airtable.
> - Same error handling pattern.
>
> Run `npm run build` — both routes must compile without errors.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 10 — OrderForm Section**

> **OrderForm.tsx** (`'use client'`)
>
> - Import `content` from `@/content` and `products` from `@/data/products`
> - `bg-gradient-to-br from-lavender to-[#F8F0FF]`
> - Two columns, stacks mobile
> - Left: SectionEyebrow, h2, subtext, navy note box — all from `content.order`. Note box has pink left border, cyan strong text.
> - Right — white card rounded-2xl shadow:
>   - Fields: name, contact, pickupWindow (all useState)
>   - Dynamic item rows: useState array. Each row: select (options from non-comingSoon `products` mapped to names, plus "Mixed Box (6 items)", "Mixed Box (12 items)") + qty number input. Start with one row. "+ Add another item" dashed button appends row. Each row has a "✕" remove button (hidden if only one row remains).
>   - Notes textarea (optional)
>   - Client-side validation before submit: name and contact required, at least one item selected with qty > 0. Show inline field-level error messages (not an alert()) in pink text below each invalid field.
>   - Submit button: pink, rounded-full, w-full. States: default "Send My Order 💪", loading "Sending..." (disabled, reduced opacity), success hidden (form replaced), error re-enabled.
>   - On success: replace form with success state from `content.order.successTitle` / `content.order.successBody`
>   - On error: show inline error below button, do not clear form
>   - POST to `/api/orders`, check `response.ok` before parsing JSON
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 11 — Contact Section**

> **Contact.tsx** (`'use client'` for form only — consider splitting into a server wrapper + client form child component for best practice)
>
> - Import `content` from `@/content` and `siteConfig` from `@/config/site`
> - `bg-[var(--navy)]` with synthwave grid overlay
> - Two columns, stacks mobile
> - Left:
>   - SectionEyebrow color="cyan" from `content.contact.eyebrow`
>   - h2 from `content.contact.headline` in white Bebas Neue
>   - Subtext from `content.contact.subtext` in white/60
>   - Three detail rows from `siteConfig` (location, instagram, websiteDisplay) with icon boxes `bg-white/[0.06] border border-white/10 rounded-xl`. Labels in cyan, values in white/70.
> - Right — dark-themed form (`bg-white/[0.06] border border-white/10 text-white focus:border-cyan` inputs):
>   - Fields: name, email, subject select (options from `content.contact.subjectOptions`), message textarea
>   - Same field-level validation pattern as OrderForm
>   - Submit button: same pink pill style. On success: button becomes "✓ Message Sent!" with cyan bg, permanently disabled.
>   - POST to `/api/contact`, same error handling
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 12 — Polish Pass: Micro-interactions & Page Feel**

> This phase is purely additive polish. Do not change any layout, copy, or data. Fix issues you find but don't refactor working code.
>
> **Micro-interactions to apply globally:**
>
> - All `<button>` and `<a>` elements acting as buttons must have `active:scale-95` unless they already have a more specific active transform
> - All card hover states must include `-translate-y-1.5` (already on ProductCard — audit WhyUs cards and story tags)
> - Nav Order Now button: confirm it has `hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]`
> - Footer links: confirm they have `hover:translate-x-0.5` nudge
> - Form submit buttons: confirm they have `hover:-translate-y-0.5 active:scale-[0.98]`
>
> **Hero parallax:**
>
> - Confirm `useParallax` is applied to the badge cluster. If the scroll feel is too aggressive, reduce the speed multiplier to 0.15.
>
> **Page transition:**
>
> - Confirm the `pageFadeIn` animation from Phase 1 globals.css is working. The main content should fade in softly on initial load.
>
> **Section id audit:**
>
> - Confirm every section that a nav link points to has the correct `id`: `id="products"`, `id="why"`, `id="story"`, `id="order"`, `id="contact"`.
>
> **Input focus states:**
>
> - All form inputs must show `focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2` and `focus:border-[var(--cyan)]`. Audit both OrderForm and Contact.
>
> **Scroll behavior:**
>
> - Confirm `html { scroll-behavior: smooth; }` is in globals.css. If not, add it.
>
> Run `npm run build` — must pass.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 13 — SEO, Metadata & Structured Data**

> **Metadata** — in `src/app/layout.tsx`, import `siteConfig` and export:
>
> ```ts
> export const metadata: Metadata = {
>   title: {
>     default: `${siteConfig.name} — High Protein Desserts That Taste Like a Cheat Day`,
>     template: `%s | ${siteConfig.name}`,
>   },
>   description: siteConfig.description,
>   metadataBase: new URL(siteConfig.url),
>   openGraph: {
>     title: siteConfig.name,
>     description: siteConfig.description,
>     url: siteConfig.url,
>     siteName: siteConfig.name,
>     type: "website",
>     images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
>   },
>   twitter: {
>     card: "summary_large_image",
>     title: siteConfig.name,
>     description: siteConfig.description,
>     images: ["/opengraph-image"],
>   },
> };
> ```
>
> **OG Image** — create `src/app/opengraph-image.tsx` using `@vercel/og`:
>
> - 1200x630, navy background, synthwave grid pattern
> - Buff Daddy's name in large Bebas Neue (use a system font fallback: 'Arial Black'), pink accent
> - Tagline in white
> - Three colored pills: "High Protein" (cyan), "Low Sugar" (pink), "Clean Ingredients" (lavender)
> - This image will appear whenever the URL is shared on social media or iMessage
>
> **Structured Data (JSON-LD)** — in `src/app/page.tsx`, add a `<script type="application/ld+json">` tag with `LocalBusiness` schema:
>
> ```json
> {
>   "@context": "https://schema.org",
>   "@type": "FoodEstablishment",
>   "name": "Buff Daddy's",
>   "description": "[siteConfig.description]",
>   "url": "[siteConfig.url]",
>   "address": {
>     "@type": "PostalAddress",
>     "addressLocality": "Dallas",
>     "addressRegion": "TX",
>     "addressCountry": "US"
>   },
>   "servesCuisine": "High Protein Desserts",
>   "sameAs": ["[siteConfig.instagramUrl]", "[siteConfig.tiktokUrl]"]
> }
> ```
>
> Use actual values from `siteConfig`, not the placeholder strings above. Render this as a Next.js `<Script>` with `type="application/ld+json"` or as a raw `dangerouslySetInnerHTML` script tag in the page.
>
> **Sitemap & Robots:**
>
> - `src/app/sitemap.ts` — returns one entry for the homepage with `siteConfig.url`
> - `src/app/robots.ts` — allows all crawlers, points to `/sitemap.xml`
>
> Run `npm run build` — confirm no errors.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 14 — Mobile Audit & Accessibility**

> Do a full responsive and accessibility pass. Fix issues — do not add new features.
>
> **Mobile (test at 375px and 768px)**
>
> - Navbar: confirm hamburger menu works, drawer closes on link click, all links and Order Now button are present in drawer
> - Hero: text column full width, badge cluster stacks below, font clamp works at small sizes
> - StatsStrip: 2x2 grid on mobile
> - All two-column layouts (OurStory, OrderForm, Contact): single column
> - Products grid: single column
> - Footer, SocialStrip: stacked, centered
> - OrderForm item rows: select and qty inputs must not overflow on mobile
>
> **Accessibility**
>
> - Every `<button>` and interactive `<a>` must have `focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2`
> - Every form `<input>` and `<textarea>` must have an associated `<label>` with correct `htmlFor` — not just placeholder text
> - Nav must be wrapped in `<nav aria-label="Main navigation">`
> - Mobile nav drawer must have `aria-expanded` on the hamburger button and trap focus when open
> - All emoji used as content must have `aria-label` or be inside a `<span role="img" aria-label="...">`. Decorative emoji get `aria-hidden="true"`.
> - `next/image` components must have meaningful `alt` text — not empty strings
> - Color contrast: audit any white text on cyan backgrounds — cyan #00D4C8 on white fails contrast, but white on cyan must be checked. Use a contrast checker; adjust text color to navy if needed.
> - `<html>` element must have `lang="en"`
>
> Run `npm run build` — must pass with zero errors.
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 15 — Analytics & Final Checks**

> 1. Install Vercel Analytics: `npm install @vercel/analytics`. Add `<Analytics />` from `@vercel/analytics/react` to `src/app/layout.tsx`. This is one component, zero configuration, and gives you page view + web vitals data in the Vercel dashboard for free.
> 2. Create `CHANGELOG.md` in the project root:
>
>    ```md
>    # Changelog
>
>    ## [0.1.0] — Initial Launch
>
>    - Full site build: Hero, StatsStrip, Products, WhyUs, OurStory, OrderForm, Contact
>    - Order form connected to Resend + Airtable
>    - Contact form connected to Resend
>    - SEO: metadata, OG image, JSON-LD structured data, sitemap, robots
>    - Vercel Analytics installed
>    ```
>
>    Keep this updated as you add features post-launch.
>
> 3. Add a minimal `public/manifest.json`:
>    ```json
>    {
>      "name": "Buff Daddy's",
>      "short_name": "Buff Daddy's",
>      "theme_color": "#0D0E2B",
>      "background_color": "#FFF0F7",
>      "display": "standalone",
>      "icons": []
>    }
>    ```
>    Reference it in `layout.tsx` metadata under `manifest: '/manifest.json'`. The icons array is empty for now — fill it in when real brand assets are ready.
> 4. Run a final `npm run build` locally. Must be completely clean — zero errors, zero type errors, zero lint warnings.
> 5. Do a manual smoke test in the browser at `localhost:3000`:
>    - [ ] All nav links scroll to correct sections
>    - [ ] Active nav link highlights correctly as you scroll
>    - [ ] Nav background solidifies on scroll
>    - [ ] Hero badge cluster has subtle parallax
>    - [ ] All cards lift on hover with press feedback
>    - [ ] Product filter tabs work
>    - [ ] Ingredients accordion opens/closes
>    - [ ] Order form validates, submits, shows success state
>    - [ ] Contact form validates, submits, shows success state
>    - [ ] `/anything` shows the 404 page
>    - [ ] Page fades in on initial load
>    - [ ] Mobile menu opens and closes at 375px
>
> When done, mark this phase complete in plan.md.

---

- [ ] **Phase 16 — Vercel Deployment**

> 1. Confirm `next.config.ts` has no local-only settings. Add image domain config if needed:
>    ```ts
>    const nextConfig = {
>      images: {
>        domains: [], // add external image domains here if needed later
>      },
>    };
>    ```
> 2. Run final `npm run build` locally — must be clean.
> 3. Push to GitHub:
>    ```bash
>    git add -A && git commit -m "feat: complete Buff Daddy's website v0.1.0"
>    git push origin main
>    ```
> 4. In the Vercel dashboard (vercel.com), import the GitHub repo. Framework: Next.js. Root directory: `./`.
> 5. Add all `.env.local` variables to Vercel → Settings → Environment Variables for Production, Preview, and Development.
> 6. Deploy. Once live, verify:
>    - [ ] All sections render and scroll anchors work
>    - [ ] OG image appears when URL is shared (test with opengraph.xyz)
>    - [ ] Order form submits → Resend email received + Airtable record created
>    - [ ] Contact form submits → Resend email received
>    - [ ] No console errors in production
>    - [ ] Mobile layout correct at 375px
>    - [ ] Vercel Analytics dashboard shows first page view
>    - [ ] Google Search Console: submit sitemap URL
>
> When done, mark this phase complete in plan.md.

---

## Backlog (post-launch)

These are features to add after the site is live and stable. Do not build these during the initial phases.

- [ ] Add real product photography — WebP format, two sizes (400px card, 800px detail), add `imageSrc` + `imageAlt` to `src/data/products.ts`
- [ ] Add favicon assets — 16px, 32px, 180px (apple-touch-icon), 512px PNG. Drop in `public/favicon/` and reference in layout metadata
- [ ] Add Stripe or Square for payment collection on the order form
- [ ] Build an `/admin` route behind Next-Auth for order management dashboard
- [ ] Add Instagram feed embed (Behold or similar)
- [ ] Email newsletter capture (Resend Audiences or Mailchimp)
- [ ] Swap Airtable for Supabase when order volume justifies it
- [ ] Add product detail pages at `/products/[slug]` with full nutrition panel and allergen info
- [ ] Cookie/privacy notice if analytics or ads are expanded
- [ ] Add `prefers-reduced-motion` media query to disable parallax and scroll animations for users who have requested it (accessibility best practice)
