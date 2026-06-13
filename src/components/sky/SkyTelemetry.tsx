"use client";

import { SkyConditions, GeoLocation } from "@/types/sky";

interface SkyTelemetryProps {
  conditions: SkyConditions;
  location: GeoLocation;
}

export default function SkyTelemetry({ conditions, location }: SkyTelemetryProps) {
  const cards = [
    {
      label: "SUNRISE",
      value: conditions.sunrise,
      color: "amber",
      led: "amber",
    },
    {
      label: "SUNSET",
      value: conditions.sunset,
      color: "amber",
      led: "amber",
    },
    {
      label: "CLOUD COVER",
      value: `${conditions.cloudCover}%`,
      color: conditions.cloudCover > 70 ? "red" : conditions.cloudCover > 40 ? "amber" : "green",
      led: conditions.cloudCover > 70 ? "red" : "green",
    },
    {
      label: "VISIBILITY",
      value: `${conditions.visibilityPercent}%`,
      color: conditions.visibilityPercent < 40 ? "red" : "cyan",
      led: "cyan",
    },
    {
      label: "LATITUDE",
      value: `${location.latitude.toFixed(2)}°N`,
      color: "green",
      led: "green",
    },
    {
      label: "LONGITUDE",
      value: `${location.longitude.toFixed(2)}°E`,
      color: "green",
      led: "green",
    },
  ];

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led amber" />
        <span className="mc-panel-title">SKY TELEMETRY</span>
        <span className="mc-panel-sub">
          {location.name} · {location.country}
        </span>
      </div>
      <div className="mc-panel-body">
        <div className="telem-grid">
          {cards.map((card) => (
            <div className="telem-card" key={card.label}>
              <div className="telem-card-header">
                <span className={`status-led ${card.led}`} />
                <span className="telem-label">{card.label}</span>
              </div>
              <div className={`telem-value telem-value--${card.color}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}