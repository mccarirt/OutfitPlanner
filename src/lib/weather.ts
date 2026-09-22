const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Dense Drizzle",
  56: "Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Rain Showers",
  81: "Rain Showers",
  82: "Violent Rain Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Thunderstorm with Heavy Hail",
};

export function describeWeatherCode(code: number): string {
  return WEATHER_CODE_DESCRIPTIONS[code] ?? "Unknown";
}

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  admin1?: string;
  timezone: string;
};

export type DailyWeather = {
  date: string;
  weatherCode: number;
  condition: string;
  temperatureMaxF: number;
  temperatureMinF: number;
  precipitationProbabilityMax: number | null;
  windSpeedMaxMph: number | null;
};

export type WeatherSummary = {
  location: {
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  days: DailyWeather[];
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type OpenMeteoGeocodingResponse = {
  results?: {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
    admin1?: string;
    timezone: string;
  }[];
};

type OpenMeteoForecastResponse = {
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
  };
};

async function geocodeCity(city: string): Promise<GeocodeResult> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) {
    throw new Error(`Geocoding request failed with status ${res.status}`);
  }

  const data = (await res.json()) as OpenMeteoGeocodingResponse;
  const result = data.results?.[0];
  if (!result) {
    throw new Error(`No location found for "${city}"`);
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    timezone: result.timezone,
  };
}

async function fetchDailyForecast(geo: GeocodeResult, startDate: string, endDate: string) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(geo.latitude));
  url.searchParams.set("longitude", String(geo.longitude));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", geo.timezone || "auto");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await fetch(url, { next: { revalidate: 60 * 30 } });
  if (!res.ok) {
    throw new Error(`Weather request failed with status ${res.status}`);
  }

  const data = (await res.json()) as OpenMeteoForecastResponse;
  if (!data.daily) {
    throw new Error("Weather response is missing daily data");
  }

  return data.daily;
}

/**
 * Geocodes a city name and returns a daily weather summary covering
 * startDate through endDate (inclusive). Pass the same value for both
 * to get a single day's summary.
 */
export async function getWeatherForCity(
  city: string,
  startDate: string,
  endDate: string = startDate,
): Promise<WeatherSummary> {
  if (!city.trim()) {
    throw new Error("City is required");
  }
  if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
    throw new Error("Dates must be in YYYY-MM-DD format");
  }

  const geo = await geocodeCity(city);
  const daily = await fetchDailyForecast(geo, startDate, endDate);

  const days: DailyWeather[] = daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    condition: describeWeatherCode(daily.weather_code[i]),
    temperatureMaxF: Math.round(daily.temperature_2m_max[i]),
    temperatureMinF: Math.round(daily.temperature_2m_min[i]),
    precipitationProbabilityMax: daily.precipitation_probability_max?.[i] ?? null,
    windSpeedMaxMph: daily.wind_speed_10m_max?.[i] ?? null,
  }));

  return {
    location: {
      name: geo.name,
      country: geo.country,
      admin1: geo.admin1,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
    },
    days,
  };
}
