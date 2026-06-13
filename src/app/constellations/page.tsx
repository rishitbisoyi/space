"use client";

import { useEffect, useMemo, useState } from "react";

import { Constellation } from "@/types/constellation";
import ConstellationGrid from "@/components/constellations/ConstellationGrid";
import ConstellationDetails from "@/components/constellations/ConstellationDetails";
import CompareConstellations from "@/components/constellations/CompareConstellations";
import ConstellationStats from "@/components/constellations/ConstellationStats";
import {
  filterConstellations,
  getConstellationStats,
  getFeaturedConstellation,
  getRandomAstronomyFact,
  groupBySeason,
  searchConstellations,
} from "@/lib/constants/constellations";
import { getConstellations } from "@/lib/api/constellations";
import StarField from "@/components/retro/StarField";

// ── Season icons (ASCII-safe, no emoji) ──────────────────────────────────────
const SEASON_SIGILS: Record<string, string> = {
  Spring: "◈",
  Summer: "◉",
  Autumn: "◆",
  Winter: "◇",
};

const SEASON_COLORS: Record<string, string> = {
  Spring: "var(--cyan)",
  Summer: "var(--amber)",
  Autumn: "var(--amber)",
  Winter: "var(--green)",
};

// ── Boot loader ───────────────────────────────────────────────────────────────
function BootLoader({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setShown((n) => Math.min(n + 1, lines.length)),
      600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ width: "480px" }}>
        <div
          style={{
            color: "var(--green)",
            textShadow: "var(--glow-green)",
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            letterSpacing: "4px",
            marginBottom: "2rem",
          }}
        >
          STELLAR OBSERVATORY SYS
        </div>
        {lines.slice(0, shown).map((l, i) => (
          <div
            key={i}
            style={{
              color: "rgba(0,255,136,0.85)",
              marginBottom: "0.4rem",
              fontSize: "0.8rem",
              letterSpacing: "2px",
            }}
          >
            <span style={{ color: "var(--amber)" }}>›</span> {l}
          </div>
        ))}
        <span className="cursor" />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ConstellationsPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [selected, setSelected] = useState<Constellation | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [featured, setFeatured] = useState<Constellation | null>(null);
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstCompare, setFirstCompare] = useState<number | null>(null);
  const [secondCompare, setSecondCompare] = useState<number | null>(null);

  useEffect(() => {
    const loadConstellations = async () => {
      try {
        setLoading(true);
        const data = await getConstellations();
        setConstellations(data);
        if (data.length > 0) {
          setSelected(data[0]);
          setFeatured(getFeaturedConstellation(data));
        }
        setFact(getRandomAstronomyFact());
      } catch {
        setError("UPLINK FAILURE — CONSTELLATION DATA UNAVAILABLE");
      } finally {
        setLoading(false);
      }
    };
    loadConstellations();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFact(getRandomAstronomyFact()), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredConstellations = useMemo(() => {
    const searched = searchConstellations(constellations, search);
    return filterConstellations(searched, filter);
  }, [constellations, search, filter]);

  const stats = getConstellationStats(constellations);
  const seasonal = groupBySeason(constellations);

  const FILTERS = [
    "All",
    "Northern",
    "Southern",
    "Zodiac",
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
  ];

  if (loading) {
    return (
      <BootLoader
        lines={[
          "INITIALIZING STELLAR OBSERVATORY SUBSYSTEM...",
          "ACQUIRING CONSTELLATION DATABASE...",
          "SYNCHRONIZING STAR CATALOGUE...",
          "CALIBRATING CELESTIAL COORDINATES...",
          "LOADING MYTHOLOGY ARCHIVES...",
          "RENDERING NIGHT SKY...",
        ]}
      />
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="mc-panel" style={{ maxWidth: "480px", width: "100%" }}>
          <div className="mc-panel-header">
            <span className="status-led red" />
            SYSTEM FAULT
          </div>
          <div className="mc-panel-body">
            <p
              style={{
                color: "var(--red)",
                textShadow: "var(--glow-red)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                letterSpacing: "2px",
              }}
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <StarField />

      {/* ── Inline styles ── */}
      <style>{`
        @media (max-width: 1100px) {
          .main-content-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .seasonal-grid { grid-template-columns: 1fr !important; }
          .learn-grid    { grid-template-columns: 1fr !important; }
          .filter-row    { flex-direction: column !important; }
        }

        /* ── Search input ── */
        .obs-search {
          background: var(--panel2);
          border: 1px solid var(--border);
          color: var(--green);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 2px;
          padding: 0.6rem 0.9rem;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .obs-search::placeholder { color: rgba(0,255,136,0.3); }
        .obs-search:focus {
          border-color: var(--green);
          box-shadow: var(--glow-green);
        }

        /* ── Filter chips ── */
        .filter-chip {
          background: transparent;
          border: 1px solid var(--border);
          color: rgba(0,255,136,0.55);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 2px;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-chip:hover {
          border-color: var(--green);
          color: var(--green);
        }
        .filter-chip.active {
          background: rgba(0,255,136,0.08);
          border-color: var(--green);
          color: var(--green);
          box-shadow: var(--glow-green);
        }

        /* ── Featured image ── */
        .featured-img {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border: 1px solid var(--border);
          display: block;
          filter: saturate(0.6) brightness(0.85);
          transition: filter 0.3s;
        }
        .featured-img:hover { filter: saturate(0.9) brightness(1); }

        /* ── Randomize button ── */
        .obs-btn {
          background: transparent;
          border: 1px solid var(--green);
          color: var(--green);
          font-family: var(--font-display);
          font-size: 1rem;
          letter-spacing: 3px;
          padding: 0.5rem 1.4rem;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
          text-shadow: var(--glow-green);
        }
        .obs-btn:hover {
          background: rgba(0,255,136,0.08);
          box-shadow: var(--glow-green);
        }

        /* ── Rotating fact ticker ── */
        .fact-ticker {
          border-left: 2px solid var(--amber);
          padding-left: 1rem;
          color: var(--amber);
          text-shadow: var(--glow-amber);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 2px;
          line-height: 1.7;
          animation: flicker 8s infinite;
        }

        /* ── Learn cards ── */
        .learn-card {
          background: var(--panel2);
          border: 1px solid var(--border-dim);
          padding: 1rem 1.2rem;
        }
        .learn-card-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          letter-spacing: 3px;
          color: var(--cyan);
          text-shadow: var(--glow-cyan);
          margin-bottom: 0.5rem;
        }
        .learn-card-body {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: rgba(0,255,136,0.65);
          line-height: 1.7;
        }

        /* ── Seasonal card ── */
        .season-card {
          background: var(--panel2);
          border: 1px solid var(--border-dim);
          padding: 1rem;
        }
        .season-item {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.6);
          padding: 0.2rem 0;
          border-bottom: 1px solid var(--border-dim);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .season-item:last-child { border-bottom: none; }
        .season-item::before {
          content: "–";
          color: rgba(0,255,136,0.25);
        }
      `}</style>

      {/* ── Page wrapper ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Sticky header ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(5,8,22,0.88)",
            backdropFilter: "blur(6px)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.65rem 1.5rem",
          }}
        >
          {/* Radar SVG */}
          <svg width="28" height="28" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="1" />
            <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="1" />
            <circle cx="20" cy="20" r="2" fill="var(--green)" />
            <line
              x1="20" y1="20" x2="20" y2="2"
              stroke="var(--green)" strokeWidth="1.5"
              style={{ transformOrigin: "20px 20px", animation: "spin-radar 4s linear infinite" }}
            />
          </svg>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              letterSpacing: "4px",
              color: "var(--green)",
              textShadow: "var(--glow-green)",
            }}
          >
            STELLAR OBSERVATORY
          </span>

          <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto", alignItems: "center" }}>
            <span className="status-led green" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(0,255,136,0.5)" }}>
              CATALOGUE ONLINE
            </span>
            <span className="status-led cyan" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(0,217,255,0.5)" }}>
              {filteredConstellations.length} OBJECTS TRACKED
            </span>
          </div>
        </header>

        {/* ── Main ── */}
        <main
          style={{
            maxWidth: "1700px",
            margin: "0 auto",
            padding: "0 1.25rem 3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >

          {/* ════════════════════════════════════════════════════════════
              TOP STRIP — Featured + Rotating Fact
          ════════════════════════════════════════════════════════════ */}
          {featured && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 340px",
                gap: "1rem",
                marginTop: "1rem",
              }}
              className="main-content-grid"
            >
              {/* Featured panel */}
              <div className="mc-panel">
                <div className="mc-panel-header">
                  <span className="status-led green" />
                  FEATURED OBJECT
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(0,255,136,0.4)" }}>
                    IAU CATALOGUE
                  </span>
                </div>
                <div className="mc-panel-body" style={{ padding: 0 }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="featured-img"
                    />
                    {/* Overlay badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.75rem",
                        left: "0.75rem",
                        background: "rgba(5,8,22,0.82)",
                        border: "1px solid var(--border)",
                        padding: "0.3rem 0.75rem",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.8rem",
                          letterSpacing: "4px",
                          color: "var(--green)",
                          textShadow: "var(--glow-green)",
                          lineHeight: 1,
                        }}
                      >
                        {featured.name.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        letterSpacing: "1.5px",
                        color: "rgba(0,255,136,0.7)",
                        lineHeight: 1.8,
                        marginBottom: "0.75rem",
                      }}
                    >
                      {featured.mythology}
                    </p>
                    <div className="mc-divider" style={{ marginBottom: "0.75rem" }} />
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        letterSpacing: "2px",
                        color: "rgba(0,217,255,0.7)",
                        lineHeight: 1.7,
                      }}
                    >
                      <span style={{ color: "var(--cyan)", textShadow: "var(--glow-cyan)" }}>◈ OBS NOTE —</span>{" "}
                      {featured.funFact}
                    </p>
                    <button
                      className="obs-btn"
                      style={{ marginTop: "1rem" }}
                      onClick={() => setFeatured(getFeaturedConstellation(constellations))}
                    >
                      ⟳ NEXT OBJECT
                    </button>
                  </div>
                </div>
              </div>

              {/* Rotating fact panel */}
              <div className="mc-panel" style={{ display: "flex", flexDirection: "column" }}>
                <div className="mc-panel-header">
                  <span className="status-led amber" />
                  TRANSMISSION
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(255,176,0,0.4)" }}>
                    LIVE FEED
                  </span>
                </div>
                <div className="mc-panel-body" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "3px",
                      color: "rgba(255,176,0,0.5)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    OBSERVATORY BROADCAST · AUTO-ROTATING
                  </div>
                  <p className="fact-ticker">{fact}</p>

                  <div className="mc-divider" style={{ margin: "1.5rem 0" }} />

                  {/* Mini seasonal counts */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "3px",
                      color: "rgba(0,255,136,0.4)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    SEASONAL DISTRIBUTION
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                    {Object.entries(seasonal).map(([season, items]) => (
                      <div
                        key={season}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "var(--panel)",
                          border: "1px solid var(--border-dim)",
                          padding: "0.35rem 0.6rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.62rem",
                            letterSpacing: "2px",
                            color: SEASON_COLORS[season] ?? "var(--green)",
                          }}
                        >
                          {SEASON_SIGILS[season]} {season.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            color: "var(--green)",
                            textShadow: "var(--glow-green)",
                          }}
                        >
                          {items.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              STATS PANEL
          ════════════════════════════════════════════════════════════ */}
          <div className="mc-panel">
            <div className="mc-panel-header">
              <span className="status-led green" />
              CATALOGUE METRICS
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(0,255,136,0.35)" }}>
                COMPUTED DYNAMICALLY
              </span>
            </div>
            <div className="mc-panel-body">
              <ConstellationStats stats={stats} />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              SEARCH & FILTER
          ════════════════════════════════════════════════════════════ */}
          <div className="mc-panel">
            <div className="mc-panel-header">
              <span className="status-led cyan" />
              OBJECT QUERY TERMINAL
            </div>
            <div className="mc-panel-body">
              <div className="filter-row" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Search */}
                <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "3px",
                      color: "rgba(0,255,136,0.4)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    DESIGNATION SEARCH
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(0,255,136,0.4)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        pointerEvents: "none",
                      }}
                    >
                      ›
                    </span>
                    <input
                      type="text"
                      placeholder="ORION, LEO, CASSIOPEIA..."
                      className="obs-search"
                      style={{ paddingLeft: "1.75rem" }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter chips */}
                <div style={{ flex: "1 1 auto" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "3px",
                      color: "rgba(0,255,136,0.4)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    ACTIVE FILTER
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        className={`filter-chip${filter === f ? " active" : ""}`}
                        onClick={() => setFilter(f)}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result count */}
              <div
                style={{
                  marginTop: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "2px",
                  color: "rgba(0,255,136,0.4)",
                }}
              >
                {filteredConstellations.length === 0
                  ? "— NO OBJECTS MATCHING QUERY —"
                  : `${filteredConstellations.length} OBJECT${filteredConstellations.length !== 1 ? "S" : ""} IN VIEW`}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              GRID + DETAILS (two-column)
          ════════════════════════════════════════════════════════════ */}
          <div
            className="main-content-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            {/* Left: Grid */}
            <div className="mc-panel">
              <div className="mc-panel-header">
                <span className="status-led green" />
                CONSTELLATION REGISTRY
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(0,255,136,0.35)" }}>
                  SELECT TO INSPECT
                </span>
              </div>
              <div className="mc-panel-body">
                <ConstellationGrid
                  constellations={filteredConstellations}
                  selectedConstellation={selected}
                  onSelect={setSelected}
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="mc-panel" style={{ position: "sticky", top: "60px" }}>
              <div className="mc-panel-header">
                <span className="status-led cyan" />
                OBJECT TELEMETRY
              </div>
              <div className="mc-panel-body">
                <ConstellationDetails constellation={selected} />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              COMPARE TOOL
          ════════════════════════════════════════════════════════════ */}
          <div className="mc-panel">
            <div className="mc-panel-header">
              <span className="status-led amber" />
              COMPARATIVE ANALYSIS MODULE
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(255,176,0,0.35)" }}>
                SELECT TWO OBJECTS
              </span>
            </div>
            <div className="mc-panel-body">
              <CompareConstellations
                constellations={constellations}
                firstId={firstCompare}
                secondId={secondCompare}
                onFirstChange={setFirstCompare}
                onSecondChange={setSecondCompare}
              />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              SEASONAL GUIDE + LEARN (two-column)
          ════════════════════════════════════════════════════════════ */}
          <div
            className="seasonal-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
          >
            {/* Seasonal guide */}
            <div className="mc-panel">
              <div className="mc-panel-header">
                <span className="status-led green" />
                SEASONAL VIEWING SCHEDULE
              </div>
              <div className="mc-panel-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
                  {Object.entries(seasonal).map(([season, items]) => (
                    <div key={season} className="season-card">
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.1rem",
                          letterSpacing: "3px",
                          color: SEASON_COLORS[season] ?? "var(--green)",
                          textShadow: `0 0 8px ${SEASON_COLORS[season] ?? "var(--green)"}`,
                          marginBottom: "0.6rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        {SEASON_SIGILS[season]} {season.toUpperCase()}
                        <span
                          style={{
                            marginLeft: "auto",
                            fontFamily: "var(--font-display)",
                            fontSize: "1.3rem",
                            color: "var(--green)",
                            textShadow: "var(--glow-green)",
                          }}
                        >
                          {items.length}
                        </span>
                      </div>
                      <div className="mc-divider" style={{ marginBottom: "0.5rem" }} />
                      {items.map((item) => (
                        <div key={item.id} className="season-item">
                          {item.name.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learn panel */}
            <div className="mc-panel">
              <div className="mc-panel-header">
                <span className="status-led cyan" />
                KNOWLEDGE BASE
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "rgba(0,217,255,0.35)" }}>
                  OBSERVATORY ARCHIVE
                </span>
              </div>
              <div className="mc-panel-body">
                <div className="learn-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                  <div className="learn-card">
                    <div className="learn-card-title">WHAT IS A CONSTELLATION?</div>
                    <p className="learn-card-body">
                      A constellation is a recognized pattern of stars in the night sky, used by astronomers
                      to map and navigate the celestial sphere. The IAU formally recognizes 88 constellations
                      covering the entire sky.
                    </p>
                  </div>
                  <div className="learn-card">
                    <div className="learn-card-title">STARS VS CONSTELLATIONS</div>
                    <p className="learn-card-body">
                      Stars are individual celestial bodies — nuclear furnaces burning millions of kilometres
                      away. Constellations are human-defined patterns formed by groups of stars that may be
                      separated by vast distances in three-dimensional space.
                    </p>
                  </div>
                  <div className="learn-card">
                    <div className="learn-card-title">WHY CONSTELLATIONS MATTER</div>
                    <p className="learn-card-body">
                      Beyond navigation and cultural heritage, constellations give astronomers a universal
                      coordinate system for locating objects. Deep-sky targets like nebulae and galaxies are
                      catalogued within constellation boundaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              FOOTER STRIP
          ════════════════════════════════════════════════════════════ */}
          <div
            style={{
              borderTop: "1px solid var(--border-dim)",
              paddingTop: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "3px",
                color: "rgba(0,255,136,0.25)",
              }}
            >
              STELLAR OBSERVATORY · IAU CATALOGUE · {constellations.length} OBJECTS ON FILE
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "3px",
                color: "rgba(0,255,136,0.25)",
              }}
            >
              SYS STATUS: <span style={{ color: "var(--green)" }}>NOMINAL</span>
            </span>
          </div>

        </main>
      </div>
    </>
  );
}