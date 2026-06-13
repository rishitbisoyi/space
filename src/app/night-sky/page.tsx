"use client";

import StarField from "@/components/retro/StarField";
import CitySearch from "@/components/sky/CitySearch";
import SkyTelemetry from "@/components/sky/SkyTelemetry";
import ObservationScore from "@/components/sky/ObservationScore";
import MoonPanel from "@/components/sky/MoonPanel";
import VisiblePlanets from "@/components/sky/VisiblePlanets";
import ConstellationPanel from "@/components/sky/ConstellationPanel";
import ObservationLog from "@/components/sky/ObservationLog";
import BootLoader from "@/components/sky/BootLoader";
import { useSky } from "@/hooks/useSky";
import "./sky.css";
import BackToDashboard from "@/components/common/BackToDashboard";

export default function NightSkyPage() {
  const { data, loading, booting, error, bootMessages, fetchSky } = useSky();

  return (
    <>
      <StarField />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── STICKY HEADER ── */}
        <header className="sky-header">
          <div className="sky-header-inner">
            <div className="sky-header-left">
              <svg
                className="spin-radar"
                width="20" height="20" viewBox="0 0 22 22"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="9" fill="none" stroke="var(--green)" strokeWidth="1" opacity="0.4" />
                <circle cx="11" cy="11" r="5" fill="none" stroke="var(--green)" strokeWidth="1" opacity="0.6" />
                <line x1="11" y1="11" x2="11" y2="2" stroke="var(--green)" strokeWidth="1.5" />
                <circle cx="11" cy="11" r="2" fill="var(--green)" />
              </svg>
              <span className="sky-header-title">NIGHT SKY COMMAND CENTER</span>
            </div>
            <div className="sky-header-badges">
              <span className="status-led green" />
              <span className="sky-badge">OBS ONLINE</span>
              <span className="status-led amber" />
              <span className="sky-badge sky-badge--amber">ATMOS FEED</span>
            </div>
          </div>
        </header>

<div
  style={{
    maxWidth: "1700px",
    margin: "0 auto",
    padding: "1.25rem 1.25rem 1.25rem",
  }}
>
  <BackToDashboard />
</div>

{/* ── MAIN ── */}
<main className="sky-main">

          {/* CITY SEARCH */}
          <CitySearch onSearch={fetchSky} loading={loading} />

          {/* ERROR */}
          {error && (
            <div className="mc-panel" style={{ borderColor: "rgba(255,77,77,0.35)" }}>
              <div className="mc-panel-header">
                <span className="status-led red" />
                UPLINK ERROR
              </div>
              <div className="mc-panel-body">
                <p style={{
                  color: "var(--red)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  margin: 0,
                  textShadow: "var(--glow-red)",
                }}>
                  !! {error}
                </p>
              </div>
            </div>
          )}

          {/* BOOT LOADER */}
          {booting && <BootLoader messages={bootMessages} />}

          {/* DATA */}
          {data && !booting && (
            <>
              {/* TELEMETRY — full width */}
              <SkyTelemetry conditions={data.conditions} location={data.location} />

              {/* TWO-COL: score+moon | constellations */}
              <div className="sky-two-col">
                <div className="sky-col">
                  <ObservationScore score={data.observationScore} label={data.scoreLabel} />
                  <MoonPanel moon={data.moon} />
                </div>
                <div className="sky-col">
                  <ConstellationPanel constellations={data.constellations} />
                </div>
              </div>

              {/* PLANETS — full width */}
              <VisiblePlanets planets={data.planets} />

              {/* LOG — full width */}
              <ObservationLog entries={data.log} />
            </>
          )}
        </main>
      </div>
    </>
  );
}