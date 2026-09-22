import { BagIcon, ChevronRightIcon, PantsIcon, ShirtIcon, ShoeIcon } from "@/components/icons";
import { shopSearchUrl, type DisplayOutfitItem } from "@/lib/displayOutfit";
import type { OutfitItemIcon } from "@/lib/outfits";

const ICONS: Record<OutfitItemIcon, typeof ShirtIcon> = {
  shirt: ShirtIcon,
  pants: PantsIcon,
  shoe: ShoeIcon,
  bag: BagIcon,
};

export function ProductTile({ item }: { item: DisplayOutfitItem }) {
  const Icon = ICONS[item.icon];

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-stone p-3">
      <div className="flex h-16 items-center justify-center rounded-xl bg-card">
        <Icon className="h-7 w-7 text-accent" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{item.category}</p>
        <p className="mt-0.5 text-[13px] font-semibold leading-tight text-foreground">{item.label}</p>
        {item.product ? (
          <div className="mt-0.5 flex justify-between text-xs text-muted">
            <span>{item.product.brand}</span>
            <span>${item.product.price}</span>
          </div>
        ) : item.searchQuery ? (
          <a
            href={shopSearchUrl(item.searchQuery)}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 inline-flex items-center gap-0.5 text-xs font-semibold text-accent"
          >
            Search
            <ChevronRightIcon className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
