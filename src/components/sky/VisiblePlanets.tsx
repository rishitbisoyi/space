"use client";

import { Planet } from "@/types/sky";

interface VisiblePlanetsProps { planets: Planet[]; }

function ledColor(b: Planet["brightness"]) {
  if (b === "BRIGHT")   return "green";
  if (b === "MODERATE") return "cyan";
  if (b === "DIM")      return "amber";
  return "red";
}

function nameColor(b: Planet["brightness"]) {
  if (b === "BRIGHT")   return "green";
  if (b === "MODERATE") return "cyan";
  if (b === "DIM")      return "amber";
  return "dim";
}

export default function VisiblePlanets({ planets }: VisiblePlanetsProps) {
  const visibleCount = planets.filter((p) => p.visible).length;

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        VISIBLE PLANETS
        <span className="mc-panel-sub">{visibleCount}/{planets.length} IN VIEW</span>
      </div>
      <div className="mc-panel-body">
        <div className="planet-grid">
          {planets.map((planet) => (
            <div
              className={`planet-card${!planet.visible ? " planet-card--hidden" : ""}`}
              key={planet.name}
            >
              <span className="planet-icon">{planet.icon}</span>
              <div className={`planet-name planet-name--${nameColor(planet.brightness)}`}>
                {planet.name}
              </div>
              <div className="planet-led-row">
                <span className={`status-led ${ledColor(planet.brightness)}`} />
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