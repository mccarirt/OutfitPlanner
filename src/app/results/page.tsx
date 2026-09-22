import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, CloudSunIcon, PencilIcon, PinIcon } from "@/components/icons";
import { OutfitCard } from "@/components/OutfitCard";
import { aiOutfitsToDisplay, mockOutfitsToDisplay, type DisplayOutfit } from "@/lib/displayOutfit";
import { generateOutfitRecommendations, type OutfitRequest } from "@/lib/outfitRecommendations";
import { getWeatherForCity, type DailyWeather, type WeatherSummary } from "@/lib/weather";

type ResultsSearchParams = {
  age?: string;
  sex?: string;
  location?: string;
  date?: string;
  occasion?: string;
};

type WeatherResult =
  | { ok: true; location: WeatherSummary["location"]; day: DailyWeather }
  | { ok: false };

function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

async function loadWeather(location: string, date: string): Promise<WeatherResult> {
  try {
    const summary = await getWeatherForCity(location, date);
    return { ok: true, location: summary.location, day: summary.days[0] };
  } catch {
    return { ok: false };
  }
}

async function loadOutfits(
  weather: WeatherResult,
  request: Omit<OutfitRequest, "weather">,
): Promise<{ source: "ai" | "mock"; outfits: DisplayOutfit[] }> {
  if (!weather.ok) {
    return { source: "mock", outfits: mockOutfitsToDisplay() };
  }

  const result = await generateOutfitRecommendations({
    ...request,
    weather: {
      temperatureMaxF: weather.day.temperatureMaxF,
      temperatureMinF: weather.day.temperatureMinF,
      condition: weather.day.condition,
    },
  });

  if (!result.ok) {
    console.error("Outfit generation failed:", result.error, result.details);
    return { source: "mock", outfits: mockOutfitsToDisplay() };
  }

  return { source: "ai", outfits: aiOutfitsToDisplay(result.data.outfits) };
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<ResultsSearchParams>;
}) {
  const params = await searchParams;
  const age = Number(params.age) || 28;
  const sex = params.sex === "Male" ? "Male" : "Female";
  const location = params.location?.trim() || "San Francisco, CA";
  const date = params.date || new Date().toISOString().slice(0, 10);
  const occasion = params.occasion || "Date Night";

  const weather = await loadWeather(location, date);
  const { source, outfits } = await loadOutfits(weather, { age, sex, location, date, occasion });

  const locationLabel = weather.ok
    ? `${weather.location.name}, ${weather.location.admin1 ?? weather.location.country}`
    : location;

  return (
    <div className="flex flex-1 justify-center bg-background">
      <main className="flex w-full max-w-md flex-col pb-8">
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <Link
            href="/"
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-line-soft text-foreground"
          >
            <ArrowLeftIcon className="h-[18px] w-[18px]" />
          </Link>
          <h1 className="font-serif text-xl font-semibold text-foreground">Your Outfits</h1>
          <Link
            href="/"
            aria-label="Edit search"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-line-soft text-foreground"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-5 rounded-[20px] border border-line bg-card px-5 py-[18px]">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-[15px] w-[15px] text-muted" />
              {locationLabel}
            </span>
            <span className="text-line">·</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-normal text-muted">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDateLabel(date)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {weather.ok ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-bg px-3.5 py-2 text-[13px] font-semibold text-sage-text">
                <CloudSunIcon className="h-[15px] w-[15px]" />
                {weather.day.temperatureMaxF}°F · {weather.day.condition}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-line-soft px-3.5 py-2 text-[13px] font-semibold text-muted">
                Weather unavailable
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-clay-bg px-3.5 py-2 text-[13px] font-semibold text-clay-text">
              {occasion}
            </span>
          </div>
        </div>

        <div className="px-5 pt-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            {outfits.length} outfits picked for you
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {source === "ai"
              ? "Ranked by weather fit and style match"
              : "Example outfits — live recommendations unavailable right now"}
          </p>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-4">
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.rank} outfit={outfit} />
          ))}
        </div>
      </main>
    </div>
  );
}
