"use client";

interface ObservationScoreProps {
  score: number;
  label: string;
}

function getScoreClass(score: number): string {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "poor";
}

export default function ObservationScore({ score, label }: ObservationScoreProps) {
  const cls = getScoreClass(score);

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className={`status-led ${cls === "excellent" || cls === "good" ? "green" : cls === "fair" ? "amber" : "red"}`} />
        <span className="mc-panel-title">OBSERVATION SCORE</span>
      </div>
      <div className="mc-panel-body">
        <div className="score-wrap">
          <div className={`score-number score-number--${cls}`}>{score}</div>
          <div className={`score-label score-label--${cls}`}>{label}</div>
          <div className="score-bar-wrap">
            <div
              className={`score-bar score-bar--${cls}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="score-scale">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}