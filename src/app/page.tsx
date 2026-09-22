import type { ReactNode } from "react";
import { ChipGroup } from "@/components/ChipGroup";
import { ChevronRightIcon, CloudSunIcon, PinIcon, SparkIcon, TagIcon } from "@/components/icons";

const OCCASIONS = ["Casual", "Work", "Date Night", "Workout", "Formal", "Travel"];

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-background">
      <main className="flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">Plan your outfit</p>
        <h1 className="mt-2.5 font-serif text-3xl font-semibold leading-tight text-foreground">
          What should I wear today?
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Tell us who, where, and when — we&#39;ll match the weather and the occasion.
        </p>

        <form
          id="outfit-form"
          method="GET"
          action="/results"
          className="mt-7 flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 shadow-sm"
        >
          <div className="flex gap-3">
            <div className="w-20">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                defaultValue={28}
                className="w-full rounded-xl border border-line bg-background px-3 py-3 text-base text-foreground"
              />
            </div>
            <div className="flex-1">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-muted">Sex</span>
              <ChipGroup options={["Male", "Female"]} defaultValue="Female" name="sex" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue="2026-09-26"
              className="w-full rounded-xl border border-line bg-background px-3 py-3 text-[15px] text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor="location">
              Location
            </label>
            <div className="relative">
              <PinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
              <input
                id="location"
                name="location"
                type="text"
                defaultValue="San Francisco, CA"
                className="w-full rounded-xl border border-line bg-background py-3 pl-10 pr-3.5 text-[15px] text-foreground"
              />
            </div>
          </div>

          <div>
            <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-wide text-muted">Occasion</span>
            <ChipGroup options={OCCASIONS} defaultValue="Date Night" name="occasion" />
          </div>
        </form>

        <button
          type="submit"
          form="outfit-form"
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-base font-semibold text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
        >
          Find My Outfit
          <ChevronRightIcon className="h-[18px] w-[18px]" />
        </button>
        <p className="mt-3.5 text-center text-xs text-muted">Free · No sign-up required</p>

        <div className="mt-auto flex justify-between gap-3 pt-7">
          <TrustItem icon={<CloudSunIcon className="h-5 w-5" />} label="Live weather" />
          <TrustItem icon={<SparkIcon className="h-[18px] w-[18px]" />} label="AI-matched" />
          <TrustItem icon={<TagIcon className="h-[19px] w-[19px]" />} label="Real products" />
        </div>
      </main>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-line-soft text-foreground">
        {icon}
      </div>
      <p className="text-center text-[11px] font-medium leading-tight text-muted">{label}</p>
    </div>
  );
}
