import { ChevronRightIcon } from "@/components/icons";
import { ProductTile } from "@/components/ProductTile";
import type { DisplayOutfit } from "@/lib/displayOutfit";

export function OutfitCard({ outfit }: { outfit: DisplayOutfit }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-white">
            {outfit.rank}
          </span>
          <span className="font-serif text-base font-semibold text-foreground">{outfit.name}</span>
        </div>
        <span className="whitespace-nowrap rounded-full bg-line-soft px-2.5 py-1 text-[11px] font-semibold text-muted">
          {outfit.matchScore}% match
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        {outfit.items.map((item) => (
          <ProductTile key={item.category} item={item} />
        ))}
      </div>

      <div className="border-t border-line-soft px-5 py-3.5">
        {outfit.totalPrice !== undefined ? (
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground">Total look: ${outfit.totalPrice}</span>
            <a href="#" className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent">
              Shop all
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          outfit.description && <p className="text-[13px] leading-relaxed text-muted">{outfit.description}</p>
        )}
      </div>
    </div>
  );
}
