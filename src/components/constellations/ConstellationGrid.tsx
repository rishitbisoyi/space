import ConstellationCard from "./ConstellationCard";
import { Constellation } from "@/types/constellation";

interface ConstellationGridProps {
  constellations: Constellation[];
  selectedConstellation?: Constellation | null;
  onSelect: (constellation: Constellation) => void;
}

export default function ConstellationGrid({
  constellations,
  selectedConstellation,
  onSelect,
}: ConstellationGridProps) {
  if (constellations.length === 0) {
    return (
      <>
        <style>{`
          .grid-empty {
            padding: 3rem 1rem;
            text-align: center;
            border: 1px dashed rgba(0, 255, 136, 0.15);
            background: var(--panel2);
          }
          .grid-empty-label {
            font-family: var(--font-display);
            font-size: 1.2rem;
            letter-spacing: 4px;
            color: rgba(0, 255, 136, 0.3);
            margin-bottom: 0.4rem;
          }
          .grid-empty-sub {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            letter-spacing: 2px;
            color: rgba(0, 255, 136, 0.2);
          }
        `}</style>
        <div className="grid-empty">
          <div className="grid-empty-label">— NO OBJECTS IN VIEW —</div>
          <div className="grid-empty-sub">ADJUST QUERY PARAMETERS TO ACQUIRE TARGETS</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .const-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        @media (max-width: 600px) {
          .const-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
      `}</style>

      <div className="const-grid">
        {constellations.map((constellation) => (
          <ConstellationCard
            key={constellation.id}
            constellation={constellation}
            isSelected={selectedConstellation?.id === constellation.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}