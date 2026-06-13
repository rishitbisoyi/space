import { Constellation } from "@/types/constellation";

interface ConstellationDetailsProps {
  constellation: Constellation | null;
}

export default function ConstellationDetails({
  constellation,
}: ConstellationDetailsProps) {
  if (!constellation) {
    return (
      <>
        <style>{`
          .details-empty {
            padding: 2rem 1rem;
            text-align: center;
          }
          .details-empty-icon {
            font-family: var(--font-display);
            font-size: 2.5rem;
            color: rgba(0,255,136,0.12);
            letter-spacing: 4px;
            margin-bottom: 0.75rem;
          }
          .details-empty-label {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            letter-spacing: 3px;
            color: rgba(0,255,136,0.25);
            line-height: 1.8;
          }
        `}</style>
        <div className="details-empty">
          <div className="details-empty-icon">◎</div>
          <div className="details-empty-label">
            NO OBJECT SELECTED<br />
            SELECT A CONSTELLATION<br />
            FROM THE REGISTRY
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .details-name {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 4px;
          color: var(--green);
          text-shadow: var(--glow-green);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .details-zodiac-badge {
          display: inline-block;
          border: 1px solid rgba(0,217,255,0.4);
          padding: 0.1rem 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 3px;
          color: var(--cyan);
          margin-bottom: 0.75rem;
        }

        .details-divider {
          height: 1px;
          background: var(--border-dim);
          margin: 0.75rem 0;
        }

        .details-section-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 3px;
          color: rgba(0,255,136,0.35);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        /* Telemetry rows */
        .details-telem-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .details-telem-cell {
          background: var(--panel2);
          border: 1px solid var(--border-dim);
          padding: 0.5rem 0.65rem;
        }
        .details-telem-label {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: rgba(0,255,136,0.35);
          margin-bottom: 0.2rem;
          text-transform: uppercase;
        }
        .details-telem-value {
          font-family: var(--font-display);
          font-size: 1.05rem;
          letter-spacing: 2px;
          color: var(--green);
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .details-telem-value.amber {
          color: var(--amber);
        }
        .details-telem-value.cyan {
          color: var(--cyan);
        }

        /* Text blocks */
        .details-text-block {
          background: var(--panel2);
          border: 1px solid var(--border-dim);
          border-left: 2px solid var(--border);
          padding: 0.65rem 0.75rem;
          margin-bottom: 0.5rem;
        }
        .details-text-body {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          color: rgba(0,255,136,0.65);
          line-height: 1.8;
        }

        /* Fun fact */
        .details-fact {
          background: var(--panel2);
          border: 1px solid rgba(0,217,255,0.15);
          border-left: 2px solid var(--cyan);
          padding: 0.65rem 0.75rem;
        }
        .details-fact-body {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          color: rgba(0,217,255,0.7);
          line-height: 1.8;
        }
      `}</style>

      {/* Name */}
      <div className="details-name">{constellation.name.toUpperCase()}</div>
      {constellation.zodiac && (
        <div className="details-zodiac-badge">◈ ZODIAC CONSTELLATION</div>
      )}

      <div className="details-divider" />

      {/* Telemetry grid */}
      <div className="details-section-label">OBJECT PARAMETERS</div>
      <div className="details-telem-grid">
        <div className="details-telem-cell">
          <div className="details-telem-label">α STAR</div>
          <div className="details-telem-value cyan">{constellation.brightestStar}</div>
        </div>
        <div className="details-telem-cell">
          <div className="details-telem-label">HEMISPHERE</div>
          <div className="details-telem-value">{constellation.hemisphere}</div>
        </div>
        <div className="details-telem-cell">
          <div className="details-telem-label">SEASON</div>
          <div className="details-telem-value amber">{constellation.season}</div>
        </div>
        <div className="details-telem-cell">
          <div className="details-telem-label">BEST VIEWING</div>
          <div className="details-telem-value amber">{constellation.bestViewingMonth}</div>
        </div>
        <div className="details-telem-cell">
          <div className="details-telem-label">AREA</div>
          <div className="details-telem-value">
            {constellation.area}
            <span style={{ fontSize: "0.65rem", letterSpacing: "1px", color: "rgba(0,255,136,0.45)", marginLeft: "3px" }}>SQ·DEG</span>
          </div>
        </div>
        <div className="details-telem-cell">
          <div className="details-telem-label">STARS</div>
          <div className="details-telem-value">{constellation.stars}</div>
        </div>
      </div>

      <div className="details-divider" />

      {/* Mythology */}
      <div className="details-section-label">MYTHOLOGY ARCHIVE</div>
      <div className="details-text-block">
        <p className="details-text-body">{constellation.mythology}</p>
      </div>

      {/* Description */}
      <div className="details-section-label">OBSERVATION NOTES</div>
      <div className="details-text-block">
        <p className="details-text-body">{constellation.description}</p>
      </div>

      {/* Fun fact */}
      <div className="details-section-label">TRANSMISSION</div>
      <div className="details-fact">
        <p className="details-fact-body">
          <span style={{ color: "var(--cyan)", marginRight: "0.4rem" }}>◈</span>
          {constellation.funFact}
        </p>
      </div>
    </>
  );
}