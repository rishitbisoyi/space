"use client";

import Link from "next/link";

const modules = [
  {
    title: "ISS TRACKER",
    href: "/iss-tracker",
    status: "ONLINE",
    description: "Live orbital telemetry and crew monitoring",
  },
  {
    title: "CONSTELLATIONS",
    href: "/constellations",
    status: "ONLINE",
    description: "Interactive constellation database",
  },
  {
    title: "NIGHT SKY",
    href: "/night-sky",
    status: "ONLINE",
    description: "Observation and sky visibility system",
  },
  {
    title: "CELESTIAL EVENTS",
    href: "/celestial-events",
    status: "ONLINE",
    description: "Upcoming astronomical events",
  },
  {
    title: "PLANETS",
    href: "/planets",
    status: "DEVELOPING",
    description: "Solar system exploration module",
  },
];

export default function MissionModules() {
  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        MISSION MODULES
      </div>

      <div
        className="mc-panel-body"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              className="telem-card"
              style={{
                height: "100%",
                minHeight: "150px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div className="telem-label">
                  MODULE
                </div>

                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "2px",
                    color:
                      module.status === "ONLINE"
                        ? "var(--green)"
                        : "var(--amber)",
                  }}
                >
                  {module.status}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  color: "var(--green)",
                  textShadow: "var(--glow-green)",
                  marginBottom: "0.75rem",
                }}
              >
                {module.title}
              </div>

              <div
                style={{
                  color: "rgba(0,255,136,0.65)",
                  fontSize: "0.85rem",
                }}
              >
                {module.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}