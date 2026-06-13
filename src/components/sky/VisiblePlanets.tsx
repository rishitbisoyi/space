"use client";

import { Planet } from "@/types/sky";

interface VisiblePlanetsProps {
  planets: Planet[];
}

function brightnessLed(brightness: Planet["brightness"]): string {
  if (brightness === "BRIGHT") return "green";
  if (brightness === "MODERATE") return "cyan";
  if (brightness === "DIM") return "amber";
  return "red";
}

function brightnessColor(brightness: Planet["brightness"]): string {
  if (brightness === "BRIGHT") return "green";
  if (brightness === "MODERATE") return "cyan";
  if (brightness === "DIM") return "amber";
  return "dim";
}

export default function VisiblePlanets({ planets }: VisiblePlanetsProps) {
  const visibleCount = planets.filter((p) => p.visible).length;

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        <span className="mc-panel-title">VISIBLE PLANETS</span>
        <span className="mc-panel-sub">
          {visibleCount}/{planets.length} IN VIEW
        </span>
      </div>
      <div className="mc-panel-body">
        <div className="planet-grid">
          {planets.map((planet) => (
            <div
              className={`planet-card ${!planet.visible ? "planet-card--hidden" : ""}`}
              key={planet.name}
            >
              <div className="planet-icon">{planet.icon}</div>
              <div className={`planet-name planet-name--${brightnessColor(planet.brightness)}`}>
                {planet.name}
              </div>
              <div className="planet-led-row">
                <span className={`status-led ${brightnessLed(planet.brightness)}`} />
                <span className="planet-status">{planet.brightness}</span>
              </div>
              {planet.visible && (
                <div className="planet-rise">RISES {planet.riseTime}</div>
              )}
              <div className="planet-mag">
                MAG {planet.magnitude > 0 ? "+" : ""}{planet.magnitude}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}