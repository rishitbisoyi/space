"use client";

import { Constellation } from "@/types/sky";

interface ConstellationPanelProps { constellations: Constellation[]; }

const LED_COLORS = ["green", "cyan", "amber", "green", "cyan"] as const;

export default function ConstellationPanel({ constellations }: ConstellationPanelProps) {
  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        CONSTELLATIONS TONIGHT
        <span className="mc-panel-sub">{constellations.length} ACQUIRED</span>
      </div>
      <div className="mc-panel-body">
        <div className="const-list">
          {constellations.map((c, i) => (
            <div className="const-row" key={c.name}>
              <div className="const-row-top">
                <span className={`status-led ${LED_COLORS[i % LED_COLORS.length]}`} />
                <span className="const-abbr">{c.abbreviation}</span>
                <span className="const-name">{c.name}</span>
              </div>
              <div className="const-time">{c.viewingWindow}</div>
              <div className="const-desc">{c.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}