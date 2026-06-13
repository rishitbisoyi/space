"use client";

import { ObservationLogEntry } from "@/types/sky";

interface ObservationLogProps { entries: ObservationLogEntry[]; }

function statusPrefix(status: ObservationLogEntry["status"]): string {
  switch (status) {
    case "success": return "[  OK  ]";
    case "warning": return "[ WARN ]";
    case "error":   return "[ ERR  ]";
    default:        return "[ INFO ]";
  }
}

export default function ObservationLog({ entries }: ObservationLogProps) {
  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led green" />
        OBSERVATION LOG
        <span className="mc-panel-sub">{entries.length} ENTRIES</span>
      </div>
      <div className="mc-panel-body">
        <div className="obs-log">
          {entries.map((entry, i) => (
            <div key={i} className={`obs-line obs-line--${entry.status}`}>
              <span className="obs-prefix">{statusPrefix(entry.status)}</span>
              <span className="obs-arrow">›</span>
              <span className="obs-msg">{entry.message}</span>
              {i === entries.length - 1 && (
                <span className="obs-cursor cursor" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}