export interface ScoreBreakdown {
  total: number;
  label: string;
  cloudPenalty: number;
  visibilityPenalty: number;
  moonPenalty: number;
}

export function computeObservationScore(
  cloudCover: number,
  visibilityPercent: number,
  moonIllumination: number
): ScoreBreakdown {
  const cloudPenalty = Math.round(cloudCover * 0.55);
  const visibilityPenalty = Math.round((100 - visibilityPercent) * 0.25);
  const moonPenalty = Math.round(moonIllumination * 0.2);

  const total = Math.max(
    0,
    Math.min(100, 100 - cloudPenalty - visibilityPenalty - moonPenalty)
  );

  let label: string;
  if (total >= 85) label = "EXCELLENT CONDITIONS";
  else if (total >= 65) label = "GOOD CONDITIONS";
  else if (total >= 45) label = "FAIR CONDITIONS";
  else if (total >= 25) label = "POOR CONDITIONS";
  else label = "UNFAVORABLE CONDITIONS";

  return { total, label, cloudPenalty, visibilityPenalty, moonPenalty };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "var(--green)";
  if (score >= 65) return "var(--cyan)";
  if (score >= 45) return "var(--amber)";
  return "var(--red)";
}

export function getScoreClass(score: number): string {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "poor";
}