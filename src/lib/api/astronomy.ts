import { SkyConditions, MoonData, Planet } from "@/types/sky";

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

interface WeatherResponse {
  current: {
    cloud_cover: number;
    visibility?: number;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
    visibility_mean?: number[];
  };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string
): Promise<SkyConditions> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    forecast_days: "1",
    current: "cloud_cover,visibility",
    daily: "sunrise,sunset,visibility_mean",
  });

  const response = await fetch(`${WEATHER_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`WEATHER UPLINK FAILED: HTTP ${response.status}`);
  }

  const data: WeatherResponse = await response.json();

  const cloudCover = data.current?.cloud_cover ?? 30;
  const visibilityMeters =
    data.daily?.visibility_mean?.[0] ?? data.current?.visibility ?? 15000;
  const visibilityPercent = Math.round(Math.min(100, visibilityMeters / 250));

  return {
    sunrise: data.daily?.sunrise?.[0] ?? "",
    sunset: data.daily?.sunset?.[0] ?? "",
    cloudCover,
    visibilityMeters,
    visibilityPercent,
  };
}

export function computeMoonPhase(date: Date): MoonData {
  const knownNewMoon = new Date(2000, 0, 6).getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const CYCLE = 29.53058867;
  const phase = ((diffDays % CYCLE) + CYCLE) % CYCLE;
  const illumination = Math.round(
    50 * (1 - Math.cos((2 * Math.PI * phase) / CYCLE))
  );

  let phaseName: string;
  let emoji: string;

  if (phase < 1.85) {
    phaseName = "NEW MOON";
    emoji = "🌑";
  } else if (phase < 7.38) {
    phaseName = "WAXING CRESCENT";
    emoji = "🌒";
  } else if (phase < 9.22) {
    phaseName = "FIRST QUARTER";
    emoji = "🌓";
  } else if (phase < 14.77) {
    phaseName = "WAXING GIBBOUS";
    emoji = "🌔";
  } else if (phase < 16.61) {
    phaseName = "FULL MOON";
    emoji = "🌕";
  } else if (phase < 22.15) {
    phaseName = "WANING GIBBOUS";
    emoji = "🌖";
  } else if (phase < 23.99) {
    phaseName = "LAST QUARTER";
    emoji = "🌗";
  } else {
    phaseName = "WANING CRESCENT";
    emoji = "🌘";
  }

  return {
    phase: phaseName,
    emoji,
    illumination,
    phaseAngle: (phase / CYCLE) * 360,
  };
}

const PLANET_BASE_DATA = [
  { name: "MERCURY", icon: "☿", baseVisibility: 0.28 },
  { name: "VENUS",   icon: "♀", baseVisibility: 0.68 },
  { name: "MARS",    icon: "♂", baseVisibility: 0.52 },
  { name: "JUPITER", icon: "♃", baseVisibility: 0.76 },
  { name: "SATURN",  icon: "♄", baseVisibility: 0.61 },
];

export function estimatePlanets(
  latitude: number,
  longitude: number,
  date: Date
): Planet[] {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return PLANET_BASE_DATA.map((p) => {
    const seed =
      Math.sin(dayOfYear * 0.0172 + latitude * 0.01 + longitude * 0.007) *
      0.5 +
      0.5;
    const visScore = p.baseVisibility * 0.7 + seed * 0.3;

    let brightness: Planet["brightness"];
    let visible: boolean;

    if (visScore > 0.68) {
      brightness = "BRIGHT";
      visible = true;
    } else if (visScore > 0.5) {
      brightness = "MODERATE";
      visible = true;
    } else if (visScore > 0.38) {
      brightness = "DIM";
      visible = true;
    } else {
      brightness = "BELOW HORIZON";
      visible = false;
    }

    const riseHour = Math.floor(18 + seed * 6) % 24;
    const riseMin = Math.floor(seed * 60);
    const riseTime = `${String(riseHour).padStart(2, "0")}:${String(riseMin).padStart(2, "0")}`;

    const magnitude = parseFloat((-4 + seed * 6).toFixed(1));

    return {
      name: p.name,
      icon: p.icon,
      visible,
      brightness,
      riseTime,
      magnitude,
    };
  });
}