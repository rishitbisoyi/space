"use client";

import { useISS } from "@/hooks/useISS";

export default function ISSStats() {
  const data = useISS();

  if (!data) {
    return <p>Loading ISS Data...</p>;
  }

  if (!data.iss_position) {
    return (
      <div>
        <h2>ISS Tracker</h2>
        <p>ISS Data Unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Live ISS Position</h2>

      <p>
        Latitude: {data.iss_position.latitude}
      </p>

      <p>
        Longitude: {data.iss_position.longitude}
      </p>

      <p>
        Last Updated:{" "}
        {new Date(
          data.timestamp * 1000
        ).toLocaleTimeString()}
      </p>
    </div>
  );
}