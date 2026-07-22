// Buff Daddy's — Figma Wireframe & Design System Generator
// Generates 3 pages: Design System, Desktop 1440, Mobile 390

async function main() {
  console.log('[BuffDaddys] plugin started');
  // ── Fonts ──────────────────────────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Extra Bold" }),
  ]);
  console.log('[BuffDaddys] fonts loaded');

  // ── Color tokens (matches globals.css) ────────────────────────────
  const C = {
    navy: { r: 13 / 255, g: 14 / 255, b: 43 / 255 }, // #0D0E2B
    pink: { r: 1, g: 62 / 255, b: 165 / 255 }, // #FF3EA5
    cyan: { r: 0, g: 212 / 255, b: 200 / 255 }, // #00D4C8
    cyanDeep: { r: 0, g: 143 / 255, b: 138 / 255 }, // #008F8A
    blush: { r: 1, g: 240 / 255, b: 247 / 255 }, // #FFF0F7
    lavender: { r: 237 / 255, g: 224 / 255, b: 1 }, // #EDE0FF
    white: { r: 1, g: 1, b: 1 },
    gray100: { r: 243 / 255, g: 244 / 255, b: 246 / 255 },
    gray200: { r: 229 / 255, g: 231 / 255, b: 235 / 255 },
    gray400: { r: 156 / 255, g: 163 / 255, b: 175 / 255 },
    gray500: { r: 107 / 255, g: 114 / 255, b: 128 / 255 },
    offwhite: { r: 249 / 255, g: 250 / 255, b: 251 / 255 },
  };

  // ── Core helpers ───────────────────────────────────────────────────
  const solid = (color) => [{ type: "SOLID", color }];

  function makeText(str, opts = {}) {
    const t = figma.createText();
    t.fontName = { family: "Inter", style: opts.weight || "Regular" };
    t.fontSize = opts.size || 14;
    t.fills = solid(opts.color || C.navy);
    t.characters = String(str);
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (opts.width) {
      t.textAutoResize = "HEIGHT";
      t.resize(opts.width, t.height);
    }
    return t;
  }

  function makeFrame(name, w, h, opts = {}) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = opts.bg ? solid(opts.bg) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.radius != null) f.cornerRadius = opts.radius;

    if (opts.layout) {
      f.layoutMode = opts.layout;
      f.primaryAxisSizingMode = opts.hug ? "AUTO" : "FIXED";
      f.counterAxisSizingMode = "FIXED";
      f.itemSpacing = opts.gap !== undefined ? opts.gap : 0;
      f.primaryAxisAlignItems = opts.align || "MIN";
      f.counterAxisAlignItems = opts.crossAlign || "MIN";

      const p = opts.pad !== undefined ? opts.pad : 0;
      if (Array.isArray(p)) {
        f.paddingTop = p[0];
        f.paddingRight = p[1];
        f.paddingBottom = p[2];
        f.paddingLeft = p[3];
      } else {
        f.paddingTop = f.paddingRight = f.paddingBottom = f.paddingLeft = p;
      }
    }
    return f;
  }

  function append(parent) {
    var args = Array.prototype.slice.call(arguments, 1);
    var flat = [].concat.apply([], args); // flat() not supported in plugin sandbox
    flat.filter(Boolean).forEach(function(c) { parent.appendChild(c); });
    return parent;
  }

  // Rounded pill — used for badges, eyebrows, macro tags, allergens, CTAs
  function pill(label, bg, textColor, w, h = 24, fontSize = 10) {
    const f = makeFrame(label, w, h, {
      layout: "HORIZONTAL",
      align: "CENTER",
      crossAlign: "CENTER",
      pad: [0, 10, 0, 10],
      bg,
      hug: false,
      radius: h / 2,
    });
    append(
      f,
      makeText(label, {
        size: fontSize,
        weight: "Semi Bold",
        color: textColor,
      }),
    );
    return f;
  }

  // Bordered input field
  function inputField(w, h, placeholder) {
    const f = makeFrame(placeholder, w, h, {
      layout: "HORIZONTAL",
      crossAlign: "CENTER",
      pad: [0, 16, 0, 16],
      bg: C.white,
      hug: false,
      radius: 8,
    });
    f.strokes = solid(C.gray200);
    f.strokeWeight = 1;
    append(f, makeText(placeholder, { size: 14, color: C.gray400 }));
    return f;
  }

  // Standard button
  function btn(label, w, h, bg, textColor) {
    const f = makeFrame(label, w, h, {
      layout: "HORIZONTAL",
      align: "CENTER",
      crossAlign: "CENTER",
      bg,
      hug: false,
      radius: h / 2,
    });
    if (bg === C.white) {
      f.strokes = solid(C.navy);
      f.strokeWeight = 2;
    }
    append(
      f,
      makeText(label, { size: 14, weight: "Semi Bold", color: textColor }),
    );
    return f;
  }

  // Textarea
  function textarea(w, h, placeholder) {
    const f = makeFrame(placeholder, w, h, {
      layout: "VERTICAL",
      pad: [12, 16, 12, 16],
      bg: C.white,
      hug: false,
      radius: 8,
    });
    f.strokes = solid(C.gray200);
    f.strokeWeight = 1;
    append(f, makeText(placeholder, { size: 14, color: C.gray400 }));
    return f;
  }

  // Navbar logo cluster
  function logoCluster(markSize, textSize) {
    const g = makeFrame("Logo", markSize * 6, markSize, {
      layout: "HORIZONTAL",
      gap: 6,
      crossAlign: "CENTER",
    });
    const mark = makeFrame("mark", markSize, markSize, {
      bg: C.navy,
      layout: "HORIZONTAL",
      align: "CENTER",
      crossAlign: "CENTER",
      hug: false,
      radius: markSize / 2,
    });
    append(mark, makeText("💪", { size: markSize * 0.5 }));
    append(
      g,
      mark,
      makeText("BUFF", { size: textSize, weight: "Bold", color: C.navy }),
      makeText("DADDY'S", { size: textSize, weight: "Bold", color: C.pink }),
    );
    return g;
  }

  // ── Create pages ───────────────────────────────────────────────────
  // Create pages — 2 total max to stay within Figma free tier (3 page limit)
  const dsPage = figma.createPage();
  dsPage.name = "🎨 Design System";

  // Delete original blank page now that we have at least 1 other page
  const originalPage = figma.root.children[0];
  if (originalPage && originalPage !== dsPage && originalPage.children.length === 0) {
    originalPage.remove();
  }

  const deskPage = figma.createPage();
  deskPage.name = "🖥 Desktop · 1440";
  console.log('[BuffDaddys] pages created, total:', figma.root.children.length);

  // ════════════════════════════════════════════════════════════════════
  // PAGE 1 — DESIGN SYSTEM
  // ════════════════════════════════════════════════════════════════════
  figma.currentPage = dsPage;

  const DS_M = 80; // margin
  const DS_G = 40; // gap between cards
  let dsX = DS_M;
  const DS_R1 = DS_M;
  const DS_R2 = DS_M + 420;
  const DS_R3 = DS_M + 840;

  // Labeled card that auto-sizes height to content
  function dsCard(title, w, children) {
    const card = makeFrame(title, w, 40, {
      layout: "VERTICAL",
      gap: 20,
      pad: 32,
      bg: C.white,
      hug: true,
      radius: 12,
    });
    card.strokes = solid(C.gray200);
    card.strokeWeight = 1;
    append(
      card,
      makeText(title.toUpperCase(), {
        size: 10,
        weight: "Bold",
        color: C.gray400,
      }),
    );
    append(card, ...children);
    return card;
  }

  console.log('[BuffDaddys] building design system...');
  // ── Row 1: Color Palette ──────────────────────────────────────────
  {
    const palette = [
      { name: "Navy", hex: "#0D0E2B", color: C.navy, text: C.white },
      { name: "Pink", hex: "#FF3EA5", color: C.pink, text: C.white },
      { name: "Cyan", hex: "#00D4C8", color: C.cyan, text: C.navy },
      { name: "Cyan Deep", hex: "#008F8A", color: C.cyanDeep, text: C.white },
      { name: "Blush", hex: "#FFF0F7", color: C.blush, text: C.navy },
      { name: "Lavender", hex: "#EDE0FF", color: C.lavender, text: C.navy },
    ];

    const swatchRow = makeFrame(
      "Swatches",
      palette.length * 100 + (palette.length - 1) * 12,
      152,
      {
        layout: "HORIZONTAL",
        gap: 12,
      },
    );

    palette.forEach(({ name, hex, color, text }) => {
      const swatch = makeFrame(name, 100, 152, { bg: color, radius: 10 });
      const top = makeFrame("top", 100, 108, { bg: color, hug: false });
      const bottom = makeFrame("labels", 100, 44, {
        layout: "VERTICAL",
        gap: 2,
        pad: [8, 8, 8, 8],
        bg: color,
        hug: false,
      });
      // Slightly darker overlay for label area
      append(
        bottom,
        makeText(name, { size: 11, weight: "Semi Bold", color: text }),
        makeText(hex, { size: 10, color: text }),
      );
      append(swatch, top, bottom);
      append(swatchRow, swatch);
    });

    const card = dsCard("Color Palette", swatchRow.width + 64, [swatchRow]);
    card.x = dsX;
    card.y = DS_R1;
    dsPage.appendChild(card);
    dsX += card.width + DS_G;
  }

  // ── Row 1: Typography ─────────────────────────────────────────────
  {
    const specs = [
      {
        label: "Hero / Display",
        size: 40,
        weight: "Extra Bold",
        sample: "HIGH PROTEIN DESSERTS",
      },
      {
        label: "Section H2",
        size: 32,
        weight: "Bold",
        sample: "FLEX YOUR FLAVOR",
      },
      {
        label: "Card H3",
        size: 22,
        weight: "Bold",
        sample: "Made for Lifters",
      },
      {
        label: "Body Large",
        size: 18,
        weight: "Regular",
        sample: "Clean. Real. Actually delicious.",
      },
      {
        label: "Body Base",
        size: 14,
        weight: "Regular",
        sample: "Every item is engineered to hit your macros.",
      },
      {
        label: "Eyebrow / Label",
        size: 10,
        weight: "Bold",
        sample: "THE MENU",
      },
      {
        label: "Caption / Small",
        size: 12,
        weight: "Medium",
        sample: "Contains Milk · 190 cal · 16g protein",
      },
    ];

    const rows = specs.map(({ label, size, weight, sample }) => {
      const row = makeFrame(label, 680, Math.max(size + 8, 24), {
        layout: "HORIZONTAL",
        gap: 16,
        crossAlign: "CENTER",
      });
      append(
        row,
        makeText(label, {
          size: 10,
          color: C.gray400,
          weight: "Medium",
          width: 148,
        }),
        makeText(sample, { size, weight, color: C.navy }),
      );
      return row;
    });

    const card = dsCard("Typography", 680 + 64, rows);
    card.x = dsX;
    card.y = DS_R1;
    dsPage.appendChild(card);
    // dsX not advanced — row 2 resets
  }

  // ── Row 2: Buttons ────────────────────────────────────────────────
  dsX = DS_M;
  {
    const row1 = makeFrame("filled", 360, 50, {
      layout: "HORIZONTAL",
      gap: 16,
      crossAlign: "CENTER",
    });
    append(
      row1,
      btn("See the Menu", 168, 50, C.pink, C.white),
      btn("Place an Order", 168, 50, C.white, C.navy),
    );

    const row2 = makeFrame("small-dark", 300, 38, {
      layout: "HORIZONTAL",
      gap: 16,
      crossAlign: "CENTER",
    });
    const smallCta = btn("Order Now", 120, 36, C.pink, C.white);
    smallCta.cornerRadius = 18;
    const darkCta = btn("Send Message", 168, 36, C.navy, C.white);
    darkCta.cornerRadius = 18;
    append(row2, smallCta, darkCta);

    const card = dsCard("Buttons", 360 + 64, [
      makeText("Primary · Secondary (full-width CTA)", {
        size: 10,
        color: C.gray400,
      }),
      row1,
      makeText("Small CTA · Dark CTA", { size: 10, color: C.gray400 }),
      row2,
    ]);
    card.x = dsX;
    card.y = DS_R2;
    dsPage.appendChild(card);
    dsX += card.width + DS_G;
  }

  // ── Row 2: Badges & Tags ──────────────────────────────────────────
  {
    const floating = makeFrame("Floating Badges", 446, 34, {
      layout: "HORIZONTAL",
      gap: 10,
    });
    append(
      floating,
      pill("Less Calories 🔥", C.pink, C.white, 144, 34, 12),
      pill("More Protein 💪", C.cyan, C.navy, 128, 34, 12),
      pill("Clean Ingredients 🌿", C.lavender, C.navy, 162, 34, 12),
    );

    const macros = makeFrame("Macro Pills", 258, 24, {
      layout: "HORIZONTAL",
      gap: 6,
    });
    append(
      macros,
      pill("16g protein", C.cyan, C.navy, 88, 24, 10),
      pill("190 cal", C.gray200, C.navy, 70, 24, 10),
      pill("3g sugar", C.gray200, C.navy, 70, 24, 10),
    );

    const allergens = makeFrame("Allergens", 222, 22, {
      layout: "HORIZONTAL",
      gap: 6,
    });
    append(
      allergens,
      pill("Contains Milk", C.lavender, C.navy, 106, 22, 10),
      pill("Contains Eggs", C.lavender, C.navy, 106, 22, 10),
    );

    const eyebrows = makeFrame("Eyebrows", 370, 26, {
      layout: "HORIZONTAL",
      gap: 8,
    });
    append(
      eyebrows,
      pill("The Menu", C.pink, C.white, 90, 26, 11),
      pill("Follow Your Gut", C.cyan, C.navy, 122, 26, 11),
      pill("Our Story", C.navy, C.cyan, 88, 26, 11),
      pill("Get in Touch", C.navy, C.cyan, 98, 26, 11),
    );

    const card = dsCard("Badges & Tags", 460, [
      makeText("Floating Badges", { size: 10, color: C.gray400 }),
      floating,
      makeText("Macro Pills", { size: 10, color: C.gray400 }),
      macros,
      makeText("Allergen Tags", { size: 10, color: C.gray400 }),
      allergens,
      makeText("Section Eyebrows", { size: 10, color: C.gray400 }),
      eyebrows,
    ]);
    card.x = dsX;
    card.y = DS_R2;
    dsPage.appendChild(card);
    dsX += card.width + DS_G;
  }

  // ── Row 2: Form Elements ──────────────────────────────────────────
  {
    const FIWD = 316;
    const card = dsCard("Form Elements", FIWD + 64, [
      makeText("Text Input", { size: 10, color: C.gray400 }),
      inputField(FIWD, 44, "Name"),
      makeText("Email Input", { size: 10, color: C.gray400 }),
      inputField(FIWD, 44, "Email address"),
      makeText("Select / Dropdown", { size: 10, color: C.gray400 }),
      inputField(FIWD, 44, "General question ▾"),
      makeText("Textarea", { size: 10, color: C.gray400 }),
      textarea(FIWD, 96, "Your message..."),
      makeText("Submit Button", { size: 10, color: C.gray400 }),
      btn("Submit Order", FIWD, 48, C.pink, C.white),
    ]);
    card.x = dsX;
    card.y = DS_R2;
    dsPage.appendChild(card);
  }

  // ── Row 3: Component Anatomy ──────────────────────────────────────
  dsX = DS_M;

  // Product Card Anatomy
  {
    const CW = 264;
    const pCard = makeFrame("Product Card", CW, 430, {
      bg: C.white,
      radius: 16,
    });
    pCard.strokes = solid(C.gray200);
    pCard.strokeWeight = 2;

    const imgA = makeFrame("Image Area", CW, 180, {
      bg: C.cyan,
      layout: "VERTICAL",
      align: "CENTER",
      crossAlign: "CENTER",
      hug: false,
    });
    append(imgA, makeText("🥜", { size: 64 }));

    const body = makeFrame("Card Body", CW, 250, {
      layout: "VERTICAL",
      gap: 10,
      pad: [18, 18, 18, 18],
      bg: C.white,
      hug: false,
    });
    const macroR = makeFrame("macros", CW - 36, 22, {
      layout: "HORIZONTAL",
      gap: 6,
    });
    append(
      macroR,
      pill("16g protein", C.cyan, C.navy, 86, 22, 9),
      pill("190 cal", C.gray200, C.navy, 64, 22, 9),
      pill("3g sugar", C.gray200, C.navy, 64, 22, 9),
    );
    const allergenR = makeFrame("allergens", CW - 36, 20, {
      layout: "HORIZONTAL",
      gap: 6,
    });
    append(
      allergenR,
      pill("Contains Milk", C.lavender, C.navy, 100, 20, 9),
      pill("Contains Eggs", C.lavender, C.navy, 100, 20, 9),
    );
    append(
      body,
      pill("cookies", C.cyan, C.navy, 60, 20, 9),
      makeText("Peanut Butter Cookie", {
        size: 20,
        weight: "Bold",
        color: C.navy,
        width: CW - 36,
      }),
      makeText("Our peanut cookies will make you nut 👀", {
        size: 12,
        color: C.gray500,
        width: CW - 36,
      }),
      macroR,
      allergenR,
      makeText("↓ Ingredients", {
        size: 11,
        weight: "Semi Bold",
        color: C.cyanDeep,
      }),
    );
    append(pCard, imgA, body);

    const card = dsCard("Product Card — Anatomy", CW + 64, [pCard]);
    card.x = dsX;
    card.y = DS_R3;
    dsPage.appendChild(card);
    dsX += card.width + DS_G;
  }

  // Why Us Card Anatomy
  {
    const WW = 280;
    const whyCard = makeFrame("Why Card", WW, 240, {
      bg: C.navy,
      layout: "VERTICAL",
      gap: 12,
      pad: 28,
      hug: false,
      radius: 16,
    });
    whyCard.strokes = [
      { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.08 },
    ];
    whyCard.strokeWeight = 1;
    append(
      whyCard,
      makeText("🏋️", { size: 32 }),
      makeText("Made for Lifters", {
        size: 20,
        weight: "Bold",
        color: C.white,
      }),
      makeText(
        "Every recipe is designed around a lifter's macros. High protein targets, controlled sugar, clean calorie counts.",
        { size: 13, color: C.gray400, width: WW - 56 },
      ),
    );

    const card = dsCard("Why Us Card — Anatomy", WW + 64, [whyCard]);
    card.x = dsX;
    card.y = DS_R3;
    dsPage.appendChild(card);
    dsX += card.width + DS_G;
  }

  // Navbar Anatomy
  {
    const NW = 640;
    const navF = makeFrame("Navbar", NW, 64, { bg: C.blush });

    const inner = makeFrame("inner", NW, 64, {
      layout: "HORIZONTAL",
      crossAlign: "CENTER",
      pad: [0, 24, 0, 24],
      hug: false,
    });
    inner.primaryAxisAlignItems = "SPACE_BETWEEN";

    const links = makeFrame("Links", 320, 40, {
      layout: "HORIZONTAL",
      gap: 24,
      crossAlign: "CENTER",
    });
    ["Menu", "Why Us", "Our Story", "Order", "Contact"].forEach((l) =>
      append(links, makeText(l, { size: 13, weight: "Medium", color: C.navy })),
    );

    const ctaN = pill("Order Now", C.pink, C.white, 108, 36, 13);
    ctaN.cornerRadius = 18;

    append(inner, logoCluster(32, 18), links, ctaN);
    append(navF, inner);

    const card = dsCard("Navbar — Anatomy", NW + 64, [navF]);
    card.x = dsX;
    card.y = DS_R3;
    dsPage.appendChild(card);
  }

  // ════════════════════════════════════════════════════════════════════
  // PAGE 2 — DESKTOP WIREFRAMES (1440px)
  // ════════════════════════════════════════════════════════════════════
  figma.currentPage = deskPage;

  const DW = 1440;
  const DX = 80;
  const DPAD = 96;
  let DY = 80;

  function deskSection(name, height, bg) {
    const f = makeFrame(name, DW, height, { bg: bg || C.white });
    f.x = DX;
    f.y = DY;
    DY += height + 4;
    deskPage.appendChild(f);
    return f;
  }

  // Centered section header: eyebrow + H2 + subtext
  // Returns the bottom Y of the subtext so callers can place cards below it
  function deskHeader(
    section,
    eyebrowLabel,
    eyebrowBg,
    eyebrowTextColor,
    headline,
    subtext,
    yStart = 56,
  ) {
    const ew = Math.max(eyebrowLabel.length * 7 + 28, 90);
    const eb = pill(eyebrowLabel, eyebrowBg, eyebrowTextColor, ew, 26, 11);
    eb.x = (DW - ew) / 2;
    eb.y = yStart;

    const h2 = makeText(headline, {
      size: 48,
      weight: "Extra Bold",
      color: C.navy,
      align: "CENTER",
      width: DW - 2 * DPAD,
    });
    h2.x = DPAD;
    h2.y = eb.y + 40;

    const sub = makeText(subtext, {
      size: 16,
      color: C.gray500,
      align: "CENTER",
      width: 560,
    });
    sub.x = (DW - 560) / 2;
    sub.y = h2.y + 64;

    append(section, eb, h2, sub);
    return sub.y + sub.height + 32;
  }

  // ── Announcement Bar ──────────────────────────────────────────────
  {
    const s = deskSection("Announcement Bar", 48, C.navy);
    const t = makeText("🏋️  Dallas-area orders only for now —", {
      size: 13,
      color: C.white,
    });
    const l = makeText("place your order here", {
      size: 13,
      color: C.cyan,
      weight: "Semi Bold",
    });
    t.x = (DW - 380) / 2;
    t.y = 15;
    l.x = t.x + t.width + 4;
    l.y = 15;
    append(s, t, l);
  }

  // ── Navbar ────────────────────────────────────────────────────────
  {
    const s = deskSection("Navbar", 64, C.blush);

    const logo = logoCluster(32, 20);
    logo.x = DPAD;
    logo.y = 12;

    const links = makeFrame("Nav Links", 420, 40, {
      layout: "HORIZONTAL",
      gap: 36,
      crossAlign: "CENTER",
    });
    ["Menu", "Why Us", "Our Story", "Order", "Contact"].forEach((l) =>
      append(links, makeText(l, { size: 14, weight: "Medium", color: C.navy })),
    );
    links.x = (DW - links.width) / 2;
    links.y = 12;

    const ctaD = pill("Order Now", C.pink, C.white, 120, 40, 13);
    ctaD.cornerRadius = 20;
    ctaD.x = DW - DPAD - 120;
    ctaD.y = 12;

    append(s, logo, links, ctaD);
  }

  // ── Hero ──────────────────────────────────────────────────────────
  {
    const s = deskSection("Hero", 860, C.blush);

    // Left copy
    const copy = makeFrame("Copy", 560, 520, { layout: "VERTICAL", gap: 24 });
    copy.x = DPAD;
    copy.y = 130;
    append(
      copy,
      pill(
        "Dallas · High Protein · Clean Ingredients",
        C.navy,
        C.cyan,
        318,
        32,
        11,
      ),
      makeText("HIGH PROTEIN DESSERTS THAT TASTE LIKE A", {
        size: 64,
        weight: "Extra Bold",
        color: C.navy,
        width: 560,
      }),
      makeText("CHEAT DAY", { size: 64, weight: "Extra Bold", color: C.pink }),
      makeText(
        "Calorie conscious. Naturally sweetened. Made for people who lift heavy and still want something sweet.",
        { size: 18, color: C.gray500, width: 520 },
      ),
    );
    const ctaRow = makeFrame("CTAs", 356, 52, {
      layout: "HORIZONTAL",
      gap: 16,
      crossAlign: "CENTER",
    });
    append(
      ctaRow,
      btn("See the Menu", 168, 52, C.pink, C.white),
      btn("Place an Order", 168, 52, C.white, C.navy),
    );
    append(copy, ctaRow);

    // Right badge cluster
    const cluster = makeFrame("Badge Cluster", 440, 440);
    cluster.fills = [];
    cluster.x = DW - DPAD - 440;
    cluster.y = 180;

    const circle = makeFrame("Central Circle", 200, 200, {
      bg: C.cyan,
      layout: "VERTICAL",
      align: "CENTER",
      crossAlign: "CENTER",
      hug: false,
      radius: 100,
    });
    circle.x = 120;
    circle.y = 120;
    append(circle, makeText("💪", { size: 80 }));

    const fb1 = pill("Less Calories 🔥", C.pink, C.white, 148, 34, 12);
    const fb2 = pill("More Protein 💪", C.cyan, C.navy, 132, 34, 12);
    const fb3 = pill("Clean Ingredients 🌿", C.lavender, C.navy, 162, 34, 12);
    fb1.x = 0;
    fb1.y = 70;
    fb2.x = 280;
    fb2.y = 190;
    fb3.x = 20;
    fb3.y = 330;

    append(cluster, circle, fb1, fb2, fb3);
    append(s, copy, cluster);
  }

  // ── Stats Strip ───────────────────────────────────────────────────
  {
    const s = deskSection("Stats Strip", 160, C.navy);
    [
      { value: "16G+", label: "Protein Per Serving" },
      { value: "2G", label: "Sugar (Some Items)" },
      { value: "190", label: "Calories From" },
      { value: "0", label: "Artificial Flavors" },
    ].forEach(({ value, label }, i) => {
      const colW = (DW - 2 * DPAD) / 4;
      const col = makeFrame(value, colW, 100, {
        layout: "VERTICAL",
        gap: 8,
        align: "CENTER",
        crossAlign: "CENTER",
      });
      append(
        col,
        makeText(value, { size: 52, weight: "Extra Bold", color: C.pink }),
        makeText(label, {
          size: 14,
          color: C.white,
          align: "CENTER",
          width: colW - 24,
        }),
      );
      col.x = DPAD + i * colW;
      col.y = 30;
      append(s, col);
    });
  }

  // ── Products ──────────────────────────────────────────────────────
  {
    const PRODUCTS = [
      { name: "Peanut Butter Cookie", cat: "cookies", emoji: "🥜", bg: C.cyan },
      {
        name: "Buff Granny's Apple Pie",
        cat: "cookies",
        emoji: "🍎",
        bg: C.pink,
      },
      { name: "Galactic Brownie", cat: "bars", emoji: "🍫", bg: C.navy },
      {
        name: "??? Drop",
        cat: "muffins",
        emoji: "🧁",
        bg: C.lavender,
        cs: true,
      },
    ];
    const CARD_GAP = 24;
    const CARD_W = Math.floor(
      (DW - 2 * DPAD - (PRODUCTS.length - 1) * CARD_GAP) / PRODUCTS.length,
    );
    const CARD_H = 450;

    const s = deskSection("Products", 680, C.offwhite);
    const cardsY = deskHeader(
      s,
      "The Menu",
      C.pink,
      C.white,
      "FLEX YOUR FLAVOR",
      "Every item is engineered to hit your macros without sacrificing the taste you actually want.",
    );

    PRODUCTS.forEach(({ name, cat, emoji, bg, cs }, i) => {
      const card = makeFrame(name, CARD_W, CARD_H, { bg: C.white, radius: 16 });
      card.x = DPAD + i * (CARD_W + CARD_GAP);
      card.y = cardsY;

      const img = makeFrame("img", CARD_W, 180, {
        bg,
        layout: "VERTICAL",
        align: "CENTER",
        crossAlign: "CENTER",
        hug: false,
      });
      append(img, makeText(emoji, { size: 72 }));

      const body = makeFrame("body", CARD_W, CARD_H - 180, {
        layout: "VERTICAL",
        gap: 10,
        pad: [18, 18, 18, 18],
        bg: C.white,
        hug: false,
      });
      const macroR = makeFrame("macros", CARD_W - 36, 22, {
        layout: "HORIZONTAL",
        gap: 6,
      });
      append(
        macroR,
        pill("16g protein", C.cyan, C.navy, 86, 22, 9),
        pill("190 cal", C.gray200, C.navy, 64, 22, 9),
        pill("3g sugar", C.gray200, C.navy, 64, 22, 9),
      );
      append(
        body,
        pill(cat, C.cyan, C.navy, cat.length * 7 + 20, 20, 9),
        makeText(name, {
          size: 20,
          weight: "Bold",
          color: C.navy,
          width: CARD_W - 36,
        }),
        macroR,
        cs
          ? makeText("Get Notified →", {
              size: 11,
              weight: "Semi Bold",
              color: C.cyanDeep,
            })
          : makeText("↓ Ingredients", {
              size: 11,
              weight: "Semi Bold",
              color: C.cyanDeep,
            }),
      );
      append(card, img, body);
      append(s, card);
    });
  }

  // ── Why Us ────────────────────────────────────────────────────────
  {
    const s = deskSection("Why Us", 680, C.navy);

    const eb = pill("Follow Your Gut", C.cyan, C.navy, 136, 26, 11);
    eb.x = (DW - 136) / 2;
    eb.y = 56;
    const h2 = makeText("WHY BUFF DADDY'S HITS DIFFERENT", {
      size: 48,
      weight: "Extra Bold",
      color: C.white,
      align: "CENTER",
      width: DW - 2 * DPAD,
    });
    h2.x = DPAD;
    h2.y = 96;
    const sub = makeText(
      "We're not a supplement company that figured out baking. We're dessert people who got obsessed with macros.",
      { size: 16, color: C.gray400, align: "CENTER", width: 560 },
    );
    sub.x = (DW - 560) / 2;
    sub.y = 158;
    append(s, eb, h2, sub);

    const WHY = [
      {
        icon: "🏋️",
        title: "Made for Lifters",
        body: "Every recipe is designed around a lifter's macros. High protein targets, controlled sugar, clean calorie counts.",
      },
      {
        icon: "🌿",
        title: "Clean Ingredients",
        body: "No artificial flavors, no weird fillers. Naturally sweetened with monkfruit and honey. You can read every label.",
      },
      {
        icon: "🍪",
        title: "Actually Tastes Good",
        body: "We obsess over taste. If it doesn't taste almost as good as the real thing, it doesn't make the menu.",
      },
      {
        icon: "📍",
        title: "Small Batch, Dallas-Made",
        body: "Made locally in small batches. No mass production shortcuts. Fresh, real, and made with attention to every item.",
      },
    ];
    const CW2 = (DW - 2 * DPAD - 24) / 2;
    WHY.forEach(({ icon, title, body }, i) => {
      const wc = makeFrame(title, CW2, 190, {
        layout: "VERTICAL",
        gap: 12,
        pad: [28, 28, 28, 28],
        hug: false,
        radius: 16,
      });
      wc.fills = [
        { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.04 },
      ];
      wc.strokes = [
        { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.08 },
      ];
      wc.strokeWeight = 1;
      append(
        wc,
        makeText(icon, { size: 32 }),
        makeText(title, { size: 20, weight: "Bold", color: C.white }),
        makeText(body, { size: 13, color: C.gray400, width: CW2 - 56 }),
      );
      wc.x = DPAD + (i % 2) * (CW2 + 24);
      wc.y = 268 + Math.floor(i / 2) * (190 + 20);
      append(s, wc);
    });
  }

  // ── Our Story ─────────────────────────────────────────────────────
  {
    const s = deskSection("Our Story", 620, C.lavender);

    // Left column
    const eb = pill("Our Story", C.pink, C.white, 90, 26, 11);
    eb.x = DPAD;
    eb.y = 60;

    const h2 = makeText("THE OG BUFF DADDY", {
      size: 52,
      weight: "Extra Bold",
      color: C.navy,
    });
    h2.x = DPAD;
    h2.y = 102;

    // Pull quote split across two lines
    const pq1 = makeText("WE WANTED TO ", {
      size: 26,
      weight: "Extra Bold",
      color: C.navy,
    });
    const pq2 = makeText("EAT DESSERT", {
      size: 26,
      weight: "Extra Bold",
      color: C.pink,
    });
    const pq3 = makeText(" AND STILL HIT OUR MACROS. SO WE BUILT IT.", {
      size: 26,
      weight: "Extra Bold",
      color: C.navy,
      width: DW / 2 - DPAD - 20,
    });
    pq1.x = DPAD;
    pq1.y = 210;
    pq2.x = DPAD + pq1.width;
    pq2.y = 210;
    pq3.x = DPAD;
    pq3.y = 246;

    // Tags
    const tags = makeFrame("tags", 520, 34, { layout: "HORIZONTAL", gap: 10 });
    [
      "🏠 Dallas-based",
      "🤸 Lifters first",
      "🍪 No compromises on taste",
    ].forEach((t) => {
      const tag = makeFrame(t, t.length * 8 + 24, 32, {
        bg: C.white,
        layout: "HORIZONTAL",
        crossAlign: "CENTER",
        pad: [0, 14, 0, 14],
        hug: false,
        radius: 16,
      });
      append(tag, makeText(t, { size: 13, weight: "Medium", color: C.navy }));
      append(tags, tag);
    });
    tags.x = DPAD;
    tags.y = 340;

    // Right column: body paragraphs
    const RX = DW / 2 + 40;
    const RW = DW / 2 - DPAD - 40;
    const p1 = makeText(
      "It started the same way most gym problems do — standing in the kitchen after a workout, craving something sweet, and staring down a protein bar that tasted like cardboard.",
      { size: 15, color: C.gray500, width: RW },
    );
    const p2 = makeText(
      "We're lifters first. But we've got a serious sweet tooth. So we started experimenting: swapping out ingredients, dialing in macros, taste-testing with anyone who'd let us.",
      { size: 15, color: C.gray500, width: RW },
    );
    const p3 = makeText(
      "Buff Daddy's is the answer to a question every gym person has asked: why can't healthy food just taste good?",
      { size: 15, color: C.gray500, width: RW },
    );
    p1.x = RX;
    p1.y = 100;
    p2.x = RX;
    p2.y = p1.y + p1.height + 20;
    p3.x = RX;
    p3.y = p2.y + p2.height + 20;

    append(s, eb, h2, pq1, pq2, pq3, tags, p1, p2, p3);
  }

  // ── Order Form ────────────────────────────────────────────────────
  {
    const s = deskSection("Order Form", 820, C.white);
    const formTop = deskHeader(
      s,
      "Place an Order",
      C.pink,
      C.white,
      "READY TO EAT?",
      "We're local (Dallas, TX) and taking orders now. Fill out the form and we'll reach out to confirm pickup details.",
    );

    const FW = 560;
    const FIW = FW - 64;
    const form = makeFrame("Order Form", FW, 600, {
      layout: "VERTICAL",
      gap: 14,
      pad: 32,
      bg: C.white,
      hug: false,
      radius: 16,
    });
    form.strokes = solid(C.gray200);
    form.strokeWeight = 1;
    form.x = (DW - FW) / 2;
    form.y = formTop;

    const twoCol = makeFrame("name-email", FIW, 44, {
      layout: "HORIZONTAL",
      gap: 14,
    });
    append(
      twoCol,
      inputField((FIW - 14) / 2, 44, "Name *"),
      inputField((FIW - 14) / 2, 44, "Email *"),
    );

    append(
      form,
      twoCol,
      inputField(FIW, 44, "Phone (optional)"),
      inputField(FIW, 44, "Product — select ▾"),
      inputField(FIW, 44, "Quantity *"),
      textarea(FIW, 96, "Special requests or notes..."),
      btn("Place Order", FIW, 50, C.pink, C.white),
      makeText(
        "We'll reach out within 24hrs to confirm your order and schedule pickup. 48hr notice appreciated for larger orders.",
        { size: 12, color: C.gray400, width: FIW },
      ),
    );
    append(s, form);
  }

  // ── Contact ───────────────────────────────────────────────────────
  {
    const s = deskSection("Contact", 700, C.offwhite);
    const formTop = deskHeader(
      s,
      "Get in Touch",
      C.cyan,
      C.navy,
      "HIT US UP",
      "Questions about ingredients, bulk orders, or just want to hype up your macros? We're real people — reach out.",
    );

    const FW2 = 560;
    const FIW2 = FW2 - 64;
    const form2 = makeFrame("Contact Form", FW2, 480, {
      layout: "VERTICAL",
      gap: 14,
      pad: 32,
      bg: C.white,
      hug: false,
      radius: 16,
    });
    form2.strokes = solid(C.gray200);
    form2.strokeWeight = 1;
    form2.x = (DW - FW2) / 2;
    form2.y = formTop;

    const twoCol2 = makeFrame("name-email", FIW2, 44, {
      layout: "HORIZONTAL",
      gap: 14,
    });
    append(
      twoCol2,
      inputField((FIW2 - 14) / 2, 44, "Name"),
      inputField((FIW2 - 14) / 2, 44, "Email"),
    );

    append(
      form2,
      twoCol2,
      inputField(FIW2, 44, "Subject — select ▾"),
      textarea(FIW2, 120, "Your message..."),
      btn("Send Message", FIW2, 50, C.navy, C.white),
    );
    append(s, form2);
  }

  // ── Social Strip ──────────────────────────────────────────────────
  {
    const s = deskSection("Social Strip", 80, C.navy);
    const row = makeFrame("row", 380, 40, {
      layout: "HORIZONTAL",
      gap: 20,
      crossAlign: "CENTER",
      align: "CENTER",
    });
    row.primaryAxisAlignItems = "CENTER";
    append(
      row,
      makeText("Follow the gains 👊", {
        size: 16,
        weight: "Semi Bold",
        color: C.white,
      }),
      makeText("Instagram", { size: 14, weight: "Semi Bold", color: C.pink }),
      makeText("TikTok", { size: 14, weight: "Semi Bold", color: C.cyan }),
    );
    row.x = (DW - 380) / 2;
    row.y = 20;
    append(s, row);
  }

  // ── Footer ────────────────────────────────────────────────────────
  {
    const s = deskSection("Footer", 200, C.navy);

    const logo = logoCluster(24, 15);
    logo.x = (DW - logo.width) / 2;
    logo.y = 48;

    const nav = makeFrame("nav", 460, 20, {
      layout: "HORIZONTAL",
      gap: 32,
      crossAlign: "CENTER",
    });
    nav.primaryAxisAlignItems = "CENTER";
    ["Menu", "Why Us", "Our Story", "Order", "Contact"].forEach((l) =>
      append(
        nav,
        makeText(l, { size: 13, weight: "Medium", color: C.gray400 }),
      ),
    );
    nav.x = (DW - 460) / 2;
    nav.y = 96;

    const copy = makeText(
      "© 2025 Buff Daddy's · Dallas, TX · Made for lifters",
      { size: 12, color: C.gray500, align: "CENTER", width: 400 },
    );
    copy.x = (DW - 400) / 2;
    copy.y = 142;

    append(s, logo, nav, copy);
  }

  // ── Done ────────────────────────────────────────────────────────────
  // (Mobile wireframes omitted — add a 3rd page manually or upgrade Figma plan)
  figma.currentPage = deskPage;
  figma.notify("Done! Design System + Desktop pages ready.", { timeout: 6000 });
  figma.closePlugin();
}

main().catch((err) => {
  console.error('[BuffDaddys] CRASHED:', err.message, err.stack);
  figma.notify("Error: " + err.message, { error: true, timeout: 10000 });
  figma.closePlugin();
});

