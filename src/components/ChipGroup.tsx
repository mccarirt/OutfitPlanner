"use client";

import { useState } from "react";

export function ChipGroup({
  options,
  defaultValue,
  name,
}: {
  options: string[];
  defaultValue: string;
  name?: string;
}) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="flex flex-wrap gap-2">
      {name && <input type="hidden" name={name} value={selected} />}
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            aria-pressed={isSelected}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
              isSelected
                ? "border-accent bg-accent text-white"
                : "border-line bg-card text-foreground hover:border-accent/50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
