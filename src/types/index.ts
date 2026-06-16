export interface Macro {
  calories: number | string;
  protein: string;
  sugar: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "cookies" | "bars" | "muffins";
  tagline: string;
  emoji: string; // placeholder — shown when imageSrc is not set
  imageSrc?: string; // optional real photo, e.g. '/products/peanut-butter.jpg'
  imageAlt?: string; // alt text for the real photo
  cardBg: string; // tailwind gradient classes used as fallback bg behind emoji
  macros: Macro;
  allergens: string[];
  ingredients: string;
  comingSoon?: boolean;
}

export interface OrderItem {
  itemName: string;
  qty: number;
}

export interface Order {
  name: string;
  contact: string;
  pickupWindow: string;
  items: OrderItem[];
  notes?: string;
}
