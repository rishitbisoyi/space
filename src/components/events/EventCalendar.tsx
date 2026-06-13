"use client";

import { useState } from "react";
import eventsData from "../../data/events.json";

function getStatus(dateStr: string): "UPCOMING" | "ACTIVE" | "COMPLETED" {
  const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "COMPLETED";
  if (diff <= 1) return "ACTIVE";
  return "UPCOMING";
}

const statusLed: Record<string, string> = {
  UPCOMING:  "green",
  ACTIVE:    "amber",
  COMPLETED: "red",
};

const statusColor: Record<string, string> = {
  UPCOMING:  "var(--green)",
  ACTIVE:    "var(--amber)",
  COMPLETED: "rgba(255,77,77,0.5)",
};

const EventCalendar = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sorted = [...eventsData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        MISSION TIMELINE
        <span style={{ marginLeft: "auto", color: "rgba(0,255,136,0.4)", fontSize: "0.7rem", letterSpacing: "2px" }}>
          {new Date().toISOString().slice(0, 10)} UTC · CHRONOLOGICAL
        </span>
      </div>
      <div className="mc-panel-body" style={{ padding: "0" }}>
        {/* Column labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2rem 5.5rem 7rem 1fr 6rem",
            padding: "0.4rem 1rem",
            borderBottom: "1px solid var(--border-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "3px",
            color: "rgba(0,255,136,0.3)",
          }}
        >
          <span>#</span>
          <span>STATUS</span>
          <span>DATE</span>
          <span>MISSION</span>
          <span style={{ textAlign: "right" }}>TYPE</span>
        </div>

        {sorted.map((event, index) => {
          const status = getStatus(event.date);
          const isHovered = hoveredId === event.id;
          const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
          });

          return (
            <div
              key={event.id}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                borderBottom: "1px solid var(--border-dim)",
                background: isHovered ? "rgba(0,255,136,0.04)" : "transparent",
                transition: "background 0.15s",
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 5.5rem 7rem 1fr 6rem",
                  alignItems: "center",
                  padding: "0.6rem 1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                <span style={{ color: "rgba(0,255,136,0.25)" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className={`status-led ${statusLed[status]}`} style={{ width: "7px", height: "7px" }} />
                  <span style={{ fontSize: "0.6rem", letterSpacing: "2px", color: statusColor[status] }}>
                    {status}
                  </span>
                </span>
                <span style={{ color: isHovered ? "var(--green)" : "rgba(0,255,136,0.45)" }}>
                  {formattedDate}
                </span>
                <span style={{
                  color: isHovered ? "var(--green)" : "rgba(0,255,136,0.75)",
                  textShadow: isHovered ? "var(--glow-green)" : "none",
                  letterSpacing: "2px",
                  fontSize: "0.72rem",
                  transition: "color 0.15s",
                }}>
                  {event.title.toUpperCase()}
                </span>
                <span style={{
                  textAlign: "right",
                  color: "rgba(0,217,255,0.5)",
                  fontSize: "0.6rem",
                  letterSpacing: "2px",
                }}>
                  {event.type.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              {/* Expandable row */}
              <div style={{
                overflow: "hidden",
                maxHeight: isHovered ? "3rem" : "0",
                opacity: isHovered ? 1 : 0,
                transition: "max-height 0.2s ease, opacity 0.2s ease",
                padding: isHovered ? "0 1rem 0.6rem 4.5rem" : "0 1rem 0 4.5rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "rgba(0,255,136,0.45)",
                  letterSpacing: "1px",
                  margin: 0,
                  borderTop: "1px solid var(--border-dim)",
                  paddingTop: "0.4rem",
                }}>
                  › {event.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Footer row */}
        <div style={{
          padding: "0.5rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "2px",
          color: "rgba(0,255,136,0.25)",
          borderTop: "1px solid var(--border-dim)",
        }}>
          <span>RECORDS: {sorted.length} / {sorted.length}</span>
          <span>SORT: CHRONOLOGICAL ASC</span>
          <span>SOURCE: STELLAR-DB v4.1</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;