// Primary: wheretheiss.at
// Secondary: open-notify.org

let lastKnownISSData: any = null;

export async function fetchISSLocation() {
  // ─────────────────────────────────────────────
  // PRIMARY SOURCE
  // ─────────────────────────────────────────────

  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (response.ok) {
      const data = await response.json();

      lastKnownISSData = data;

      return data;
    }
  } catch {
    // silent fail
  }

  // ─────────────────────────────────────────────
  // SECONDARY SOURCE
  // ─────────────────────────────────────────────

  try {
    const response = await fetch(
      "http://api.open-notify.org/iss-now.json",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (response.ok) {
      const data = await response.json();

      const transformed = {
        name: "iss",
        id: 25544,
        latitude: Number(
          data.iss_position.latitude
        ),
        longitude: Number(
          data.iss_position.longitude
        ),
        altitude: 408,
        velocity: 27600,
        visibility: "daylight",
        footprint: 4500,
        timestamp: data.timestamp,
        solar_lat: 23.4,
        solar_lon: 42.0,
        units: "kilometers",
      };

      lastKnownISSData = transformed;

      return transformed;
    }
  } catch {
    // silent fail
  }

  // ─────────────────────────────────────────────
  // RETURN LAST KNOWN POSITION
  // ─────────────────────────────────────────────

  if (lastKnownISSData) {
    return lastKnownISSData;
  }

  // First startup only fallback
  return {
    name: "iss",
    id: 25544,
    latitude: 0,
    longitude: 0,
    altitude: 408,
    velocity: 27600,
    visibility: "unknown",
    footprint: 4500,
    timestamp: Math.floor(Date.now() / 1000),
    solar_lat: 0,
    solar_lon: 0,
    units: "kilometers",
  };
}