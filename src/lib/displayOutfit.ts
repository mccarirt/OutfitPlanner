import { outfitTotal, outfits as mockOutfits, type OutfitItemIcon } from "@/lib/outfits";
import type { OutfitRecommendation } from "@/lib/outfitRecommendations";

export type DisplayOutfitItem = {
  category: string;
  icon: OutfitItemIcon;
  label: string;
  /** Present when a real product (brand + price) is already known. */
  product?: { brand: string; price: number };
  /** Present when there's no product yet, just a query to search for one. */
  searchQuery?: string;
};

export type DisplayOutfit = {
  rank: number;
  name: string;
  matchScore: number;
  /** Stylist rationale, shown when there's no total price to display instead. */
  description?: string;
  totalPrice?: number;
  items: DisplayOutfitItem[];
};

const CATEGORY_ICONS: Record<string, OutfitItemIcon> = {
  Outerwear: "shirt",
  Top: "shirt",
  Bottoms: "pants",
  Footwear: "shoe",
  Accessory: "bag",
};

export function categoryToIcon(category: string): OutfitItemIcon {
  return CATEGORY_ICONS[category] ?? "shirt";
}

export function shopSearchUrl(query: string): string {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}

export function mockOutfitsToDisplay(): DisplayOutfit[] {
  return mockOutfits.map((outfit) => ({
    rank: outfit.rank,
    name: outfit.name,
    matchScore: outfit.match,
    totalPrice: outfitTotal(outfit),
    items: outfit.items.map((item) => ({
      category: item.category,
      icon: item.icon,
      label: item.name,
      product: { brand: item.brand, price: item.price },
    })),
  }));
}

export function aiOutfitsToDisplay(recommendations: OutfitRecommendation[]): DisplayOutfit[] {
  return recommendations.map((outfit, index) => ({
    rank: index + 1,
    name: outfit.name,
    matchScore: outfit.matchScore,
    description: outfit.description,
    items: outfit.items.map((item) => ({
      category: item.category,
      icon: categoryToIcon(item.category),
      label: item.description,
      searchQuery: item.searchQuery,
    })),
  }));
}
