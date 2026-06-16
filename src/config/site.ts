export const siteConfig = {
  name: "Buff Daddy's",
  tagline: "Desserts · Snacks & Treats",
  description:
    "High protein desserts that taste like a cheat day. Calorie conscious. Naturally sweetened. Small-batch in Dallas, TX.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  location: "Dallas, TX",
  instagram: "@buffdaddytreats",
  instagramUrl: "https://instagram.com/buffdaddytreats",
  tiktok: "@buffdaddytreats",
  tiktokUrl: "https://tiktok.com/@buffdaddytreats",
  websiteDisplay: "buffdaddytreats.com",
  nav: [
    { label: "Menu", href: "#products" },
    { label: "Why Us", href: "#why" },
    { label: "Our Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ],
  footerNav: [
    { label: "Menu", href: "#products" },
    { label: "Order", href: "#order" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ],
};
