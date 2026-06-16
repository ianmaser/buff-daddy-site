import type { Product } from "@/types";

// To add real photos: set imageSrc: '/products/filename.webp' and imageAlt on any product. ProductCard renders next/image when imageSrc is present, emoji otherwise.
export const products: Product[] = [
  {
    id: "peanut-butter",
    name: "Peanut Butter Cookie",
    slug: "peanut-butter",
    category: "cookies",
    tagline: "Our peanut cookies will make you nut 👀",
    emoji: "🥜",
    cardBg: "from-cyan to-cyan/50",
    macros: { calories: 190, protein: "16g", sugar: "3g" },
    allergens: ["Contains Milk", "Contains Eggs"],
    ingredients:
      "Peanut butter, egg, whey protein (milk), sugar, chocolate, vanilla, baking soda, salt.",
  },
  {
    id: "apple-pie",
    name: "Buff Granny's Apple Pie",
    slug: "apple-pie",
    category: "cookies",
    tagline: "Granny's recipe. Buff Daddy's macros.",
    emoji: "🍎",
    cardBg: "from-pink to-pink/50",
    macros: { calories: "~220", protein: "30g", sugar: "2g" },
    allergens: ["Contains Milk", "Gluten from oats"],
    ingredients:
      "Apples, whey protein (milk), oats, oat flour, Greek yogurt (milk), honey, monkfruit maple syrup, lemon, cinnamon, salt.",
  },
  {
    id: "galactic-brownie",
    name: "Galactic Brownie",
    slug: "galactic-brownie",
    category: "bars",
    tagline: "To infinity and beyond your macros 🚀",
    emoji: "🍫",
    cardBg: "from-navy to-navy/80",
    macros: { calories: "~280", protein: "90g", sugar: "2g" },
    allergens: ["Milk", "Eggs", "Tree Nuts"],
    ingredients:
      "Eggs, Greek yogurt (milk), all purpose flour, whey protein (milk), butter (milk), blueberries, monkfruit sweetener, vanilla, lemon zest, baking powder.",
  },
  {
    id: "coming-soon",
    name: "??? Drop",
    slug: "coming-soon",
    category: "muffins",
    tagline: "We're cooking something. Sign up to find out first.",
    emoji: "🧁",
    cardBg: "from-lavender to-lavender/60",
    macros: { calories: "TBD", protein: "High", sugar: "Low" },
    allergens: [],
    ingredients: "",
    comingSoon: true,
  },
];
