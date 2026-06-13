import ISSDashboard    from "@/components/iss/ISSDashboard";
import ISSMap          from "@/components/iss/ISSMap";
import CrewCard        from "@/components/iss/CrewCard";
import OrbitStats      from "@/components/iss/OrbitStats";
import MissionTimeline from "@/components/iss/MissionTimeline";
import SystemStatus    from "@/components/iss/SystemStatus";
import ISSFacts        from "@/components/iss/ISSFacts";
import StarField       from "@/components/retro/StarField";
import MissionHeader   from "@/components/iss/MissionHeader";
import BackToDashboard from "@/components/common/BackToDashboard";

export default function ISSTrackerPage() {
  return (
    <>
      <StarField />

      {/* Root layout — sits above star layer */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER ────────────────────────────────────── */}
        <MissionHeader />

        <div
  style={{
    maxWidth: "1700px",
    margin: "0 auto 1.25rem auto",
    padding: "1.25rem 1.25rem 0",
  }}
>
  <BackToDashboard />
</div>

        <main
          style={{
            padding:   "0 1.25rem 2rem",
            maxWidth:  "1700px",
            margin:    "0 auto",
            display:   "flex",
            flexDirection: "column",
            gap:       "1rem",
          }}
        >

          {/* ── ROW 1 — Telemetry grid ─────────────────── */}
          <ISSDashboard />

          {/* ── ROW 2 — System status strip ───────────── */}
          <SystemStatus />

          {/* ── ROW 3 — Main content area ─────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "1rem",
              alignItems: "start",
            }}
            className="main-content-grid"
          >
            {/* Centre column — map + bottom panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* ── LIVE MAP (centrepiece) ─────────────── */}
              <ISSMap />

              {/* ── Bottom row ────────────────────────── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <OrbitStats />
                <MissionTimeline />
              </div>

              <ISSFacts />
            </div>

            {/* Right sidebar — crew */}
            <CrewCard />
          </div>

        </main>
      </div>

      {/* Responsive: stack right sidebar below on smaller screens */}
      <style>{`
        @media (max-width: 1100px) {
          .main-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}