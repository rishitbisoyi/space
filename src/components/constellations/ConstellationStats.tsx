import { ConstellationStats as StatsType } from "@/lib/constants/constellations";

interface ConstellationStatsProps {
  stats: StatsType;
}

export default function ConstellationStats({ stats }: ConstellationStatsProps) {
  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.75rem;
        }

        .stat-cell {
          background: var(--panel2);
          border: 1px solid var(--border-dim);
          padding: 0.75rem 0.9rem;
          position: relative;
          overflow: hidden;
        }

        /* top-left corner bracket accent */
        .stat-cell::before {
          content: "";
          position: absolute;
          top: 5px; left: 5px;
          width: 8px; height: 8px;
          border-top: 1px solid rgba(0,255,136,0.25);
          border-left: 1px solid rgba(0,255,136,0.25);
          pointer-events: none;
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.57rem;
          letter-spacing: 3px;
          color: rgba(0,255,136,0.35);
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 2px;
          color: var(--green);
          text-shadow: var(--glow-green);
          line-height: 1;
          margin-bottom: 0.1rem;
        }

        .stat-value.amber {
          color: var(--amber);
          text-shadow: var(--glow-amber);
        }

        .stat-value.cyan {
          color: var(--cyan);
          text-shadow: var(--glow-cyan);
        }

        /* name-type stats (largest/smallest) — smaller display value */
        .stat-value-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          letter-spacing: 2px;
          color: var(--cyan);
          text-shadow: var(--glow-cyan);
          line-height: 1.1;
          margin-bottom: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-unit {
          font-family: var(--font-mono);
          font-size: 0.57rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.28);
          text-transform: uppercase;
        }
      `}</style>

      <div className="stats-grid">

        {/* Numeric stats */}
        <div className="stat-cell">
          <div className="stat-label">CATALOGUE TOTAL</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-unit">OBJECTS ON FILE</div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">NORTHERN HEMI</div>
          <div className="stat-value">{stats.northern}</div>
          <div className="stat-unit">CONSTELLATIONS</div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">SOUTHERN HEMI</div>
          <div className="stat-value">{stats.southern}</div>
          <div className="stat-unit">CONSTELLATIONS</div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">ZODIAC BAND</div>
          <div className="stat-value amber">{stats.zodiac}</div>
          <div className="stat-unit">ECLIPTIC OBJECTS</div>
        </div>

        {/* Name-type stats */}
        <div className="stat-cell">
          <div className="stat-label">LARGEST OBJECT</div>
          <div className="stat-value-name">{stats.largestConstellation?.toUpperCase()}</div>
          <div className="stat-unit">BY AREA · SQ DEG</div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">SMALLEST OBJECT</div>
          <div className="stat-value-name">{stats.smallestConstellation?.toUpperCase()}</div>
          <div className="stat-unit">BY AREA · SQ DEG</div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">MEAN STAR COUNT</div>
          <div className="stat-value cyan">{stats.averageStars}</div>
          <div className="stat-unit">STARS / OBJECT</div>
        </div>

      </div>
    </>
  );
}