"use client";

import { useEffect, useState } from "react";
import { ISSData } from "@/types/iss";

export function useISS() {
  const [data, setData] = useState<ISSData | null>(null);

  const [history, setHistory] = useState<
    [number, number][]
  >([]);

  useEffect(() => {
    async function getISS() {
      try {
        const res = await fetch("/api/iss");

        if (!res.ok) {
          throw new Error(
            "ISS API unavailable"
          );
        }

        const json = await res.json();

        // Only update if valid ISS data exists
        if (
          json?.latitude !== undefined &&
          json?.longitude !== undefined
        ) {
          setData(json);

          const lat = Number(
            json.latitude
          );

          const lon = Number(
            json.longitude
          );

          setHistory((prev) => {
            const updated = [
              ...prev,
              [lat, lon] as [
                number,
                number
              ],
            ];

            return updated.slice(-200);
          });
        }
      } catch (error) {
        console.error(
          "ISS fetch error:",
          error
        );

        // IMPORTANT:
        // Do NOT clear data.
        // Keep last valid telemetry visible.
      }
    }

    getISS();

    const interval = setInterval(
      getISS,
      15000 // 15 seconds instead of 5
    );

    return () =>
      clearInterval(interval);
  }, []);

  return {
    data,
    history,
  };
}