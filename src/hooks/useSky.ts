"use client";

import { useState, useCallback } from "react";
import { UseSkyReturn, SkyData, BootMessage, ObservationLogEntry } from "@/types/sky";
import { geocodeCity } from "@/lib/api/geocoding";
import { fetchWeatherData, computeMoonPhase, estimatePlanets } from "@/lib/api/astronomy";
import { computeObservationScore } from "@/lib/utils/observationScore";
import constellationsData from "@/data/constell.json";

const BOOT_SEQUENCE: string[] = [
  "INITIALIZING SKY OBSERVATION SYSTEM...",
  "CONNECTING TO OPEN-METEO UPLINK...",
  "ACQUIRING GEOLOCATION TELEMETRY...",
  "SCANNING CELESTIAL DATABASE...",
  "COMPUTING LUNAR PHASE VECTORS...",
  "ANALYZING ATMOSPHERIC CONDITIONS...",
  "ESTIMATING PLANETARY POSITIONS...",
  "UPLINK ESTABLISHED — DATA STREAM ACTIVE",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getConstellationsForDate(date: Date) {
  const month = date.getMonth();
  return constellationsData
    .filter((c) => c.bestMonths.includes(month))
    .slice(0, 5);
}

function formatTime(isoString: string): string {
  if (!isoString) return "--:--";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildLog(
  cityName: string,
  score: number,
  cloudCover: number,
  visibilityPercent: number
): ObservationLogEntry[] {
  const now = new Date().toISOString();
  return [
    { timestamp: now, message: `CITY LOCK ACQUIRED: ${cityName}`, status: "success" },
    { timestamp: now, message: "COORDINATES RESOLVED VIA GEOCODING API", status: "info" },
    { timestamp: now, message: "OPEN-METEO WEATHER UPLINK CONFIRMED", status: "success" },
    { timestamp: now, message: `CLOUD COVER ANALYZED: ${cloudCover}%`, status: cloudCover > 70 ? "warning" : "info" },
    { timestamp: now, message: `VISIBILITY COMPUTED: ${visibilityPercent}%`, status: visibilityPercent < 40 ? "warning" : "info" },
    { timestamp: now, message: "LUNAR PHASE VECTORS CALCULATED", status: "info" },
    { timestamp: now, message: "CONSTELLATION DATABASE LOADED (5 TARGETS)", status: "info" },
    { timestamp: now, message: "PLANETARY POSITIONS ESTIMATED", status: "info" },
    { timestamp: now, message: `OBSERVATION SCORE: ${score}/100`, status: score >= 65 ? "success" : score >= 45 ? "warning" : "error" },
    { timestamp: now, message: "ALL SYSTEMS NOMINAL — MISSION READY", status: "success" },
  ];
}

export function useSky(): UseSkyReturn {
  const [data, setData] = useState<SkyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bootMessages, setBootMessages] = useState<BootMessage[]>([]);

  const fetchSky = useCallback(async (city: string) => {
    setLoading(true);
    setBooting(true);
    setError(null);
    setData(null);
    setBootMessages([]);

    const initialMessages: BootMessage[] = BOOT_SEQUENCE.map((text) => ({
      text,
      status: "pending",
    }));
    setBootMessages(initialMessages);

    try {
      for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
        await sleep(350 + Math.random() * 200);
        setBootMessages((prev) =>
          prev.map((msg, idx) => {
            if (idx < i) return { ...msg, status: "done" };
            if (idx === i) return { ...msg, status: "active" };
            return msg;
          })
        );

        if (i === 2) {
          const location = await geocodeCity(city);
          await sleep(200);
          setBootMessages((prev) =>
            prev.map((msg, idx) => (idx === i ? { ...msg, status: "done" } : msg))
          );
          setBootMessages((prev) =>
            prev.map((msg, idx) => (idx === i + 1 ? { ...msg, status: "active" } : msg))
          );
          i++;

          await sleep(300);
          const conditions = await fetchWeatherData(
            location.latitude,
            location.longitude,
            location.timezone
          );

          const now = new Date();
          const moon = computeMoonPhase(now);
          const planets = estimatePlanets(location.latitude, location.longitude, now);
          const constellations = getConstellationsForDate(now);
          const scoreBreakdown = computeObservationScore(
            conditions.cloudCover,
            conditions.visibilityPercent,
            moon.illumination
          );

          const log = buildLog(
            location.name,
            scoreBreakdown.total,
            conditions.cloudCover,
            conditions.visibilityPercent
          );

          const formattedConditions = {
            ...conditions,
            sunrise: formatTime(conditions.sunrise),
            sunset: formatTime(conditions.sunset),
          };

          for (let j = i + 1; j < BOOT_SEQUENCE.length; j++) {
            await sleep(280 + Math.random() * 150);
            setBootMessages((prev) =>
              prev.map((msg, idx) => {
                if (idx <= j) return { ...msg, status: idx < j ? "done" : "active" };
                return msg;
              })
            );
          }

          await sleep(400);
          setBootMessages((prev) => prev.map((msg) => ({ ...msg, status: "done" })));

          setData({
            location,
            conditions: formattedConditions,
            moon,
            planets,
            constellations,
            observationScore: scoreBreakdown.total,
            scoreLabel: scoreBreakdown.label,
            log,
          });

          setBooting(false);
          setLoading(false);
          return;
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "UNKNOWN UPLINK ERROR";
      setError(message);
      setBootMessages((prev) =>
        prev.map((msg) =>
          msg.status === "active" ? { ...msg, status: "error" } : msg
        )
      );
      setBooting(false);
      setLoading(false);
    }
  }, []);

  return { data, loading, booting, error, bootMessages, fetchSky };
}