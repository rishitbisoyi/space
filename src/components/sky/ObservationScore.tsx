"use client";

interface ObservationScoreProps {
  score: number;
  label: string;
}

function getScoreClass(score: number) {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "poor";
}

export default function ObservationScore({ score, label }: ObservationScoreProps) {
  const cls = getScoreClass(score);
  const led = cls === "excellent" || cls === "good" ? "green" : cls === "fair" ? "amber" : "red";

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className={`status-led ${led}`} />
        OBSERVATION SCORE
      </div>
      <div className="mc-panel-body">
        <div className="score-wrap">
          <div className={`score-number score-number--${cls}`}>{score}</div>
          <div className={`score-label score-label--${cls}`}>{label}</div>
          <div className="score-bar-wrap">
            <div className={`score-bar score-bar--${cls}`} style={{ width: `${score}%` }} />
          </div>
          <div className="score-scale">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}