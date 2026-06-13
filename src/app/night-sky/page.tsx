"use client";


import CitySearch from "@/components/sky/CitySearch";
import SkyTelemetry from "@/components/sky/SkyTelemetry";
import ObservationScore from "@/components/sky/ObservationScore";
import MoonPanel from "@/components/sky/MoonPanel";
import VisiblePlanets from "@/components/sky/VisiblePlanets";
import ConstellationPanel from "@/components/sky/ConstellationPanel";
import ObservationLog from "@/components/sky/ObservationLog";
import BootLoader from "@/components/sky/BootLoader";
import { useSky } from "@/hooks/useSky";

export default function NightSkyPage() {
  const { data, loading, booting, error, bootMessages, fetchSky } = useSky();

  return (
    <main className="sky-page">


      <div className="sky-content">
        {/* CITY SEARCH */}
        <CitySearch onSearch={fetchSky} loading={loading} />

        {/* ERROR */}
        {error && (
          <div className="mc-panel sky-error-panel">
            <div className="mc-panel-header">
              <span className="status-led red blink-led" />
              <span className="mc-panel-title">UPLINK ERROR</span>
            </div>
            <div className="mc-panel-body">
              <p className="sky-error-msg">!! {error}</p>
            </div>
          </div>
        )}

        {/* BOOT LOADER */}
        {booting && <BootLoader messages={bootMessages} />}

        {/* MAIN DATA */}
        {data && !booting && (
          <>
            {/* TELEMETRY — FULL WIDTH */}
            <SkyTelemetry conditions={data.conditions} location={data.location} />

            {/* TWO-COLUMN LAYOUT */}
            <div className="sky-two-col">
              {/* LEFT COLUMN */}
              <div className="sky-col sky-col--left">
                <ObservationScore
                  score={data.observationScore}
                  label={data.scoreLabel}
                />
                <MoonPanel moon={data.moon} />
              </div>

              {/* RIGHT COLUMN */}
              <div className="sky-col sky-col--right">
                <ConstellationPanel constellations={data.constellations} />
              </div>
            </div>

            {/* PLANETS — FULL WIDTH */}
            <VisiblePlanets planets={data.planets} />

            {/* OBSERVATION LOG — FULL WIDTH */}
            <ObservationLog entries={data.log} />
          </>
        )}
      </div>
    </main>
  );
}