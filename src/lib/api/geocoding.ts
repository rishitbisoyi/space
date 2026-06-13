import { GeoLocation } from "@/types/sky";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export async function geocodeCity(cityName: string): Promise<GeoLocation> {
  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GEOCODING UPLINK FAILED: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`CITY NOT FOUND IN DATABASE: ${cityName.toUpperCase()}`);
  }

  const result = data.results[0];

  return {
    name: result.name.toUpperCase(),
    latitude: result.latitude,
    longitude: result.longitude,
    country: (result.country || "UNKNOWN").toUpperCase(),
    timezone: result.timezone || "UTC",
  };
}