"use client";

import eventsData from "../../data/events.json";
import EventCard from "./EventCard";
import { Event } from "@/types/event";

const UpcomingEvents = () => {
  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led green" />
        UPCOMING CELESTIAL EVENTS
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "2px", color: "rgba(0,255,136,0.4)" }}>
            {eventsData.length} RECORDS
          </span>
          <span className="status-led red" style={{ width: "6px", height: "6px" }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "2px", color: "var(--red)" }}>LIVE</span>
        </span>
      </div>
      <div className="mc-panel-body">
        {eventsData.length === 0 ? (
          <p style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(0,255,136,0.4)",
            fontSize: "0.8rem",
            letterSpacing: "3px",
          }}>
            › NO EVENTS FOUND IN STELLAR DATABASE_
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.75rem",
          }}>
            {(eventsData as Event[]).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;