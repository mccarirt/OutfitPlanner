export type OutfitItemIcon = "shirt" | "pants" | "shoe" | "bag";

export type OutfitItem = {
  category: string;
  icon: OutfitItemIcon;
  name: string;
  brand: string;
  price: number;
};

export type Outfit = {
  rank: number;
  name: string;
  match: number;
  items: OutfitItem[];
};

export const outfits: Outfit[] = [
  {
    rank: 1,
    name: "Effortless & Warm",
    match: 96,
    items: [
      { category: "Outerwear", icon: "shirt", name: "Wool Overcoat", brand: "Everlane", price: 198 },
      { category: "Bottoms", icon: "pants", name: "Straight Leg Jeans", brand: "Levi's", price: 88 },
      { category: "Footwear", icon: "shoe", name: "Chelsea Boots", brand: "Thursday", price: 145 },
      { category: "Accessory", icon: "bag", name: "Leather Tote", brand: "Madewell", price: 120 },
    ],
  },
  {
    rank: 2,
    name: "Refined Layers",
    match: 91,
    items: [
      { category: "Top", icon: "shirt", name: "Merino Sweater", brand: "Uniqlo", price: 59 },
      { category: "Bottoms", icon: "pants", name: "Tailored Trousers", brand: "COS", price: 110 },
      { category: "Footwear", icon: "shoe", name: "Leather Loafers", brand: "Sezane", price: 165 },
      { category: "Accessory", icon: "bag", name: "Silk Scarf", brand: "Anthropologie", price: 58 },
    ],
  },
  {
    rank: 3,
    name: "Cozy Neutral",
    match: 88,
    items: [
      { category: "Top", icon: "shirt", name: "Cotton Turtleneck", brand: "J.Crew", price: 65 },
      { category: "Outerwear", icon: "shirt", name: "Puffer Vest", brand: "Patagonia", price: 129 },
      { category: "Bottoms", icon: "pants", name: "Corduroy Pants", brand: "Madewell", price: 98 },
      { category: "Footwear", icon: "shoe", name: "Suede Sneakers", brand: "Common Projects", price: 210 },
    ],
  },
];

export function outfitTotal(outfit: Outfit): number {
  return outfit.items.reduce((sum, item) => sum + item.price, 0);
}
