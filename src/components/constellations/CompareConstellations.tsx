import { Constellation } from "@/types/constellation";

interface CompareConstellationsProps {
  constellations: Constellation[];
  firstId: number | null;
  secondId: number | null;
  onFirstChange: (id: number) => void;
  onSecondChange: (id: number) => void;
}

export default function CompareConstellations({
  constellations,
  firstId,
  secondId,
  onFirstChange,
  onSecondChange,
}: CompareConstellationsProps) {
  const first = constellations.find((c) => c.id === firstId) || null;
  const second = constellations.find((c) => c.id === secondId) || null;

  const winnerOf = (a: number, b: number): "first" | "second" | "tie" => {
    if (a > b) return "first";
    if (b > a) return "second";
    return "tie";
  };

  const rows: {
    label: string;
    unit?: string;
    firstVal: string | number;
    secondVal: string | number;
    compare?: boolean;
  }[] = first && second
    ? [
        { label: "AREA", unit: "SQ·DEG", firstVal: first.area, secondVal: second.area, compare: true },
        { label: "STAR COUNT", unit: "STARS", firstVal: first.stars, secondVal: second.stars, compare: true },
        { label: "HEMISPHERE", firstVal: first.hemisphere, secondVal: second.hemisphere },
        { label: "α STAR", firstVal: first.brightestStar, secondVal: second.brightestStar },
        { label: "SEASON", firstVal: first.season, secondVal: second.season },
        { label: "ZODIAC", firstVal: first.zodiac ? "YES" : "NO", secondVal: second.zodiac ? "YES" : "NO" },
      ]
    : [];

  return (
    <>
      <style>{`
        .compare-select-wrap {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) {
          .compare-select-wrap {
            grid-template-columns: 1fr;
          }
          .compare-vs { display: none; }
        }

        .obs-select {
          background: var(--panel2);
          border: 1px solid var(--border);
          color: var(--green);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 2px;
          padding: 0.6rem 0.9rem;
          outline: none;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(0,255,136,0.4)'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2rem;
        }
        .obs-select:focus {
          border-color: var(--green);
          box-shadow: var(--glow-green);
        }
        .obs-select option {
          background: var(--panel);
          color: var(--green);
        }

        .compare-vs {
          font-family: var(--font-display);
          font-size: 1.4rem;
          letter-spacing: 4px;
          color: rgba(0,255,136,0.25);
          text-align: center;
        }

        .compare-select-label {
          font-family: var(--font-mono);
          font-size: 0.57rem;
          letter-spacing: 3px;
          color: rgba(0,255,136,0.35);
          margin-bottom: 0.35rem;
          text-transform: uppercase;
        }

        /* Awaiting selection state */
        .compare-idle {
          text-align: center;
          padding: 2rem 1rem;
          border: 1px dashed rgba(0,255,136,0.12);
          background: var(--panel2);
        }
        .compare-idle-icon {
          font-family: var(--font-display);
          font-size: 2rem;
          color: rgba(0,255,136,0.15);
          letter-spacing: 4px;
          margin-bottom: 0.5rem;
        }
        .compare-idle-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 3px;
          color: rgba(0,255,136,0.22);
          line-height: 1.8;
        }

        /* Comparison table */
        .compare-table {
          width: 100%;
          border-collapse: collapse;
        }

        .compare-table-header {
          display: grid;
          grid-template-columns: 140px 1fr 1fr;
          gap: 0;
          margin-bottom: 0.5rem;
        }
        .compare-col-label {
          font-family: var(--font-display);
          font-size: 1.1rem;
          letter-spacing: 3px;
          color: var(--green);
          text-shadow: var(--glow-green);
          text-align: center;
          padding: 0.4rem 0;
        }
        .compare-col-label.second {
          color: var(--cyan);
          text-shadow: var(--glow-cyan);
        }
        .compare-col-label.prop {
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.3);
          font-family: var(--font-mono);
          text-align: left;
          padding-left: 0;
          align-self: flex-end;
        }

        .compare-divider {
          height: 1px;
          background: var(--border-dim);
          margin-bottom: 0.5rem;
        }

        .compare-row {
          display: grid;
          grid-template-columns: 140px 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid var(--border-dim);
          align-items: center;
          min-height: 44px;
        }
        .compare-row:last-child {
          border-bottom: none;
        }

        .compare-row-prop {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.35);
          text-transform: uppercase;
          padding: 0.5rem 0;
        }
        .compare-row-unit {
          display: block;
          font-size: 0.5rem;
          letter-spacing: 1px;
          color: rgba(0,255,136,0.2);
          margin-top: 0.1rem;
        }

        .compare-cell {
          font-family: var(--font-display);
          font-size: 1.35rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.45);
          text-align: center;
          padding: 0.4rem 0.5rem;
          transition: color 0.2s;
        }
        .compare-cell.text-val {
          font-size: 0.85rem;
          letter-spacing: 2px;
          font-family: var(--font-mono);
        }
        .compare-cell.winner {
          color: var(--green);
          text-shadow: var(--glow-green);
        }
        .compare-cell.winner-cyan {
          color: var(--cyan);
          text-shadow: var(--glow-cyan);
        }
        .compare-cell.tie {
          color: rgba(0,255,136,0.55);
        }
      `}</style>

      {/* Selectors */}
      <div className="compare-select-wrap">
        <div>
          <div className="compare-select-label">OBJECT ALPHA</div>
          <select
            className="obs-select"
            value={firstId ?? ""}
            onChange={(e) => onFirstChange(Number(e.target.value))}
          >
            <option value="">— SELECT TARGET —</option>
            {constellations.map((c) => (
              <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="compare-vs">VS</div>

        <div>
          <div className="compare-select-label">OBJECT BETA</div>
          <select
            className="obs-select"
            value={secondId ?? ""}
            onChange={(e) => onSecondChange(Number(e.target.value))}
          >
            <option value="">— SELECT TARGET —</option>
            {constellations.map((c) => (
              <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Idle state */}
      {!(first && second) && (
        <div className="compare-idle">
          <div className="compare-idle-icon">⟷</div>
          <div className="compare-idle-label">
            SELECT TWO OBJECTS TO BEGIN<br />
            COMPARATIVE ANALYSIS
          </div>
        </div>
      )}

      {/* Comparison table */}
      {first && second && (
        <>
          {/* Column headers */}
          <div className="compare-table-header">
            <div className="compare-col-label prop">PARAMETER</div>
            <div className="compare-col-label">{first.name.toUpperCase()}</div>
            <div className="compare-col-label second">{second.name.toUpperCase()}</div>
          </div>
          <div className="compare-divider" />

          {rows.map((row) => {
            const isNumeric = row.compare;
            const winner = isNumeric
              ? winnerOf(Number(row.firstVal), Number(row.secondVal))
              : "tie";

            return (
              <div key={row.label} className="compare-row">
                <div className="compare-row-prop">
                  {row.label}
                  {row.unit && <span className="compare-row-unit">{row.unit}</span>}
                </div>

                <div
                  className={[
                    "compare-cell",
                    !isNumeric ? "text-val" : "",
                    isNumeric && winner === "first" ? "winner" : "",
                    isNumeric && winner === "tie" ? "tie" : "",
                  ].join(" ")}
                >
                  {String(row.firstVal).toUpperCase()}
                </div>

                <div
                  className={[
                    "compare-cell",
                    !isNumeric ? "text-val" : "",
                    isNumeric && winner === "second" ? "winner-cyan" : "",
                    isNumeric && winner === "tie" ? "tie" : "",
                  ].join(" ")}
                >
                  {String(row.secondVal).toUpperCase()}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}