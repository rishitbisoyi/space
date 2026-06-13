import { Constellation } from "@/types/constellation";

interface ConstellationCardProps {
  constellation: Constellation;
  isSelected?: boolean;
  onSelect: (constellation: Constellation) => void;
}

export default function ConstellationCard({
  constellation,
  isSelected = false,
  onSelect,
}: ConstellationCardProps) {
  return (
    <>
      <style>{`
        .const-card {
          cursor: pointer;
          background: var(--panel);
          border: 1px solid var(--border-dim);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .const-card:hover {
          border-color: rgba(0, 255, 136, 0.45);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.08);
        }
        .const-card.selected {
          border-color: var(--green);
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.15), inset 0 0 24px rgba(0, 255, 136, 0.03);
        }

        /* Corner bracket — top-left */
        .const-card::before {
          content: "";
          position: absolute;
          top: 6px;
          left: 6px;
          width: 10px;
          height: 10px;
          border-top: 1px solid var(--green);
          border-left: 1px solid var(--green);
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
          pointer-events: none;
        }
        /* Corner bracket — bottom-right */
        .const-card::after {
          content: "";
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 10px;
          height: 10px;
          border-bottom: 1px solid var(--green);
          border-right: 1px solid var(--green);
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
          pointer-events: none;
        }
        .const-card:hover::before,
        .const-card:hover::after,
        .const-card.selected::before,
        .const-card.selected::after {
          opacity: 1;
        }

        .const-card-img-wrap {
          width: 100%;
          height: 140px;
          background: #04060f;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .const-card-img {
          width: 100%;
          height: 140px;
          object-fit: contain;
          display: block;
          padding: 0.5rem;
          filter: saturate(0.5) brightness(0.8);
          transition: filter 0.3s;
        }
        .const-card:hover .const-card-img,
        .const-card.selected .const-card-img {
          filter: saturate(0.9) brightness(1);
        }

        .const-card-img-overlay {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, transparent 60%, var(--panel) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .const-card-body {
          padding: 0.65rem 0.75rem 0.75rem;
        }

        .const-card-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          letter-spacing: 3px;
          color: var(--green);
          line-height: 1.1;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .const-card.selected .const-card-name {
          text-shadow: var(--glow-green);
        }

        .const-card-divider {
          height: 1px;
          background: var(--border-dim);
          margin-bottom: 0.5rem;
        }

        .const-card-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.28rem;
        }
        .const-card-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 2px;
          color: rgba(0, 255, 136, 0.35);
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .const-card-value {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          color: rgba(0, 255, 136, 0.75);
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 58%;
        }

        .const-card-zodiac {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.15rem 0.5rem;
          border: 1px solid rgba(0, 217, 255, 0.4);
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 3px;
          color: var(--cyan);
          text-transform: uppercase;
        }

        .const-card-selected-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 3;
          background: rgba(5, 8, 22, 0.8);
          border: 1px solid var(--green);
          padding: 0.1rem 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.5rem;
          letter-spacing: 2px;
          color: var(--green);
          text-shadow: var(--glow-green);
        }
      `}</style>

      <div
        onClick={() => onSelect(constellation)}
        className={`const-card${isSelected ? " selected" : ""}`}
      >
        {/* Image */}
        <div style={{ position: "relative" }}>
          <div className="const-card-img-wrap">
            <img
              src={constellation.image}
              alt={constellation.name}
              className="const-card-img"
            />
          </div>
          <div className="const-card-img-overlay" />

          {/* Selected badge */}
          {isSelected && (
            <div className="const-card-selected-badge">
              ◉ ACTIVE
            </div>
          )}
        </div>

        {/* Body */}
        <div className="const-card-body">
          <div className="const-card-name">
            {constellation.name.toUpperCase()}
          </div>

          <div className="const-card-divider" />

          <div className="const-card-row">
            <span className="const-card-label">VIEWING</span>
            <span className="const-card-value">{constellation.bestViewingMonth}</span>
          </div>

          <div className="const-card-row">
            <span className="const-card-label">HEMI</span>
            <span className="const-card-value">{constellation.hemisphere}</span>
          </div>

          <div className="const-card-row">
            <span className="const-card-label">α STAR</span>
            <span className="const-card-value">{constellation.brightestStar}</span>
          </div>

          {constellation.zodiac && (
            <div>
              <span className="const-card-zodiac">◈ ZODIAC</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}