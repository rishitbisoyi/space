"use client";

import { useISS } from "@/hooks/useISS";
import { useEffect, useRef, useState } from "react";

function AnimatedValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    // brief glitch flash, then settle
    setDisplay("——.——");
    const t = setTimeout(() => { setDisplay(value); }, 120);
    prev.current = value;
    return () => clearTimeout(t);
  }, [value]);

  return <>{display}</>;
}

interface TelemCardProps {
  label:   string;
  value:   string;
  unit:    string;
  accent?: "green" | "amber" | "cyan" | "red";
  wide?:   boolean;
}

function TelemCard({ label, value, unit, accent = "green", wide = false }: TelemCardProps) {
  const colorMap = {
    green: "var(--green)",
    amber: "var(--amber)",
    cyan:  "var(--cyan)",
    red:   "var(--red)",
  };
  const glowMap = {
    green: "var(--glow-green)",
    amber: "var(--glow-amber)",
    cyan:  "var(--glow-cyan)",
    red:   "var(--glow-red)",
  };

  return (
    <div
      className="telem-card"
      style={{ gridColumn: wide ? "span 2" : undefined }}
    >
      <div className="telem-label">{label}</div>
      <div
        className="telem-value"
        style={{ color: colorMap[accent], textShadow: glowMap[accent] }}
      >
        <AnimatedValue value={value} />
      </div>
      <div className="telem-unit">{unit}</div>
    </div>
  );
}

function BootLoader() {
  const lines = [
    "INITIALIZING TELEMETRY SUBSYSTEM...",
    "ACQUIRING ORBITAL BEACON...",
    "SYNCHRONIZING ISS DATA FEED...",
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setShown((n) => Math.min(n + 1, lines.length)), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        padding:    "2rem 1rem",
        fontFamily: "var(--font-mono)",
        fontSize:   "0.8rem",
        color:      "var(--green)",
        letterSpacing: "2px",
      }}
    >
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} style={{ marginBottom: "0.4rem", opacity: 0.85 }}>
          <span style={{ color: "var(--amber)" }}>›</span> {l}
        </div>
      ))}
      <div style={{ marginTop: "0.5rem" }}>
        <span className="cursor" style={{ color: "var(--green)" }} />
      </div>
    </div>
  );
}

export default function ISSDashboard() {
  const { data } = useISS();

  if (!data) {
    return (
      <div className="mc-panel">
        <div className="mc-panel-header">
          <span className="status-led amber" />
          TELEMETRY GRID — ACQUIRING SIGNAL
        </div>
        <BootLoader />
      </div>
    );
  }

  const isDaylight = data.visibility === "daylight";

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led green" />
        LIVE TELEMETRY
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(0,255,136,0.4)" }}>
          FEED ACTIVE · 15s REFRESH
        </span>
      </div>

      <div
        className="mc-panel-body"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap:                 "0.75rem",
        }}
      >
        <TelemCard
          label="ALTITUDE"
          value={data.altitude.toFixed(2)}
          unit="KILOMETRES"
          accent="cyan"
        />

        <TelemCard
          label="VELOCITY"
          value={Math.round(data.velocity).toLocaleString()}
          unit="KM / HOUR"
          accent="amber"
        />

        <TelemCard
          label="LATITUDE"
          value={data.latitude.toFixed(4)}
          unit="DEGREES"
        />

        <TelemCard
          label="LONGITUDE"
          value={data.longitude.toFixed(4)}
          unit="DEGREES"
        />

        <TelemCard
          label="SOLAR LAT"
          value={data.solar_lat.toFixed(2)}
          unit="DEGREES"
          accent="amber"
        />

        <TelemCard
          label="SOLAR LON"
          value={data.solar_lon.toFixed(2)}
          unit="DEGREES"
          accent="amber"
        />

        <TelemCard
          label="COVERAGE RADIUS"
          value={Math.round(data.footprint).toLocaleString()}
          unit="KILOMETRES"
          accent="cyan"
        />

        {/* Day/Night — spans 2 cols on wide screens */}
        <div
          className="telem-card"
          style={{
            borderColor: isDaylight
              ? "rgba(255,176,0,0.4)"
              : "rgba(0,217,255,0.25)",
            background: isDaylight
              ? "rgba(255,176,0,0.06)"
              : "rgba(0,217,255,0.04)",
          }}
        >
          <div className="telem-label">VISIBILITY STATUS</div>
          <div
            className="telem-value"
            style={{
              color:      isDaylight ? "var(--amber)" : "var(--cyan)",
              textShadow: isDaylight ? "var(--glow-amber)" : "var(--glow-cyan)",
              fontSize:   "1.6rem",
            }}
          >
            {isDaylight ? "◐ DAYLIGHT" : "◑ ECLIPSE"}
          </div>
          <div className="telem-unit">
            {isDaylight ? "ISS IS IN SUNLIGHT" : "ISS IS IN EARTH SHADOW"}
          </div>
        </div>

        <div className="telem-card">
          <div className="telem-label">LAST UPDATED</div>
          <div
            className="telem-value"
            style={{ fontSize: "1.5rem" }}
          >
            {new Date(data.timestamp * 1000).toLocaleTimeString()}
          </div>
          <div className="telem-unit">LOCAL TIME</div>
        </div>
      </div>
    </div>
  );
}