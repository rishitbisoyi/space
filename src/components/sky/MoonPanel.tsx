"use client";

import { MoonData } from "@/types/sky";

interface MoonPanelProps { moon: MoonData; }

export default function MoonPanel({ moon }: MoonPanelProps) {
  const illumClass = moon.illumination > 70 ? "bright" : moon.illumination > 30 ? "mid" : "dim";

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led amber" />
        LUNAR DATA
        <span className="mc-panel-sub">PHASE COMPUTATION ACTIVE</span>
      </div>
      <div className="mc-panel-body">
        <div className="moon-wrap">
          <div className="moon-emoji-wrap">
            <span className="moon-emoji">{moon.emoji}</span>
          </div>
          <div className="moon-phase-name">{moon.phase}</div>
          <div className="moon-stats">
            <div className="moon-stat">
              <div className="moon-stat-label">ILLUMINATION</div>
              <div className={`moon-stat-value moon-stat-value--${illumClass}`}>
                {moon.illumination}%
              </div>
            </div>
            <div className="moon-stat">
              <div className="moon-stat-label">PHASE ANGLE</div>
              <div className="moon-stat-value moon-stat-value--mid">
                {moon.phaseAngle.toFixed(1)}°
              </div>
            </div>
          </div>
          <div className="moon-illum-bar-wrap">
            <div className="moon-illum-bar" style={{ width: `${moon.illumination}%` }} />
          </div>
          <div className="moon-illum-labels">
            <span>NEW</span><span>FULL</span>
          </div>
        </div>
      </div>
    </div>
  );
}