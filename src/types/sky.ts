export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export interface SkyConditions {
  sunrise: string;
  sunset: string;
  cloudCover: number;
  visibilityMeters: number;
  visibilityPercent: number;
}

export interface MoonData {
  phase: string;
  emoji: string;
  illumination: number;
  phaseAngle: number;
}

export interface Planet {
  name: string;
  icon: string;
  visible: boolean;
  brightness: "BRIGHT" | "MODERATE" | "DIM" | "BELOW HORIZON";
  riseTime: string;
  magnitude: number;
}

export interface Constellation {
  name: string;
  abbreviation: string;
  viewingWindow: string;
  description: string;
  bestMonths: number[];
}

export interface ObservationLogEntry {
  timestamp: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
}

export interface SkyData {
  location: GeoLocation;
  conditions: SkyConditions;
  moon: MoonData;
  planets: Planet[];
  constellations: Constellation[];
  observationScore: number;
  scoreLabel: string;
  log: ObservationLogEntry[];
}

export interface UseSkyReturn {
  data: SkyData | null;
  loading: boolean;
  booting: boolean;
  error: string | null;
  bootMessages: BootMessage[];
  fetchSky: (city: string) => Promise<void>;
}

export interface BootMessage {
  text: string;
  status: "pending" | "active" | "done" | "error";
}