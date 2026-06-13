'use client';

import { useEffect, useState } from 'react';
import StarField from '@/components/retro/StarField';
import EventCalendar from '@/components/events/EventCalendar';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import { Event } from '@/types/event';
import eventsData from '@/data/events.json';
import BackToDashboard
from "@/components/common/BackToDashboard";

export default function CelestialEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setEvents(eventsData as Event[]);
    setCurrentTime(new Date().toUTCString().slice(0, 25) + ' UTC');
    const interval = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(0, 25) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isHydrated) return null;

  const upcomingCount = events.filter((e) => new Date(e.date) > new Date()).length;

  return (
    <>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* STICKY HEADER */}
        <header className="events-header">
          <div className="events-header-inner">
            <div className="events-header-left">
              <svg className="spin-radar" width="20" height="20" viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="9" fill="none" stroke="var(--green)" strokeWidth="1" opacity="0.4" />
                <circle cx="11" cy="11" r="5" fill="none" stroke="var(--green)" strokeWidth="1" opacity="0.6" />
                <line x1="11" y1="11" x2="11" y2="2" stroke="var(--green)" strokeWidth="1.5" />
                <circle cx="11" cy="11" r="2" fill="var(--green)" />
              </svg>
              <span className="events-header-title">CELESTIAL EVENTS DATABASE</span>
            </div>
            <div className="events-header-right">
              <span className="status-led green" />
              <span className="events-header-badge">DSN ONLINE</span>
              <span className="status-led amber" />
              <span className="events-header-badge" style={{ color: 'var(--amber)' }}>STELLAR FEED</span>
            </div>
          </div>
        </header>

<div
  style={{
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1.25rem 1.25rem 1.25rem",
  }}
>
  <BackToDashboard />
</div>

<main
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          
          {/* TELEMETRY STRIP */}
          <div className="mc-panel">
            <div className="mc-panel-header">
              <span className="status-led green" />
              MISSION STATUS
              <span style={{ marginLeft: 'auto', color: 'rgba(0,255,136,0.4)', fontSize: '0.7rem', letterSpacing: '2px' }}>
                {currentTime}
              </span>
            </div>
            <div className="mc-panel-body">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                <div className="telem-card">
                  <div className="telem-label">TOTAL EVENTS</div>
                  <div className="telem-value">{events.length}</div>
                  <div className="telem-unit">RECORDS</div>
                </div>
                <div className="telem-card">
                  <div className="telem-label">UPCOMING</div>
                  <div className="telem-value" style={{ color: 'var(--cyan)', textShadow: 'var(--glow-cyan)' }}>
                    {upcomingCount}
                  </div>
                  <div className="telem-unit">SCHEDULED</div>
                </div>
                <div className="telem-card">
                  <div className="telem-label">COMPLETED</div>
                  <div className="telem-value" style={{ color: 'var(--amber)', textShadow: 'var(--glow-amber)' }}>
                    {events.length - upcomingCount}
                  </div>
                  <div className="telem-unit">LOGGED</div>
                </div>
                <div className="telem-card">
                  <div className="telem-label">UPLINK</div>
                  <div className="telem-value">OK</div>
                  <div className="telem-unit">SYSTEMS NOMINAL</div>
                </div>
              </div>
            </div>
          </div>

          {/* CALENDAR */}
          <EventCalendar />

          {/* EVENT CARDS */}
          <UpcomingEvents />
        </main>
      </div>

      <style>{`
        .events-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(5, 8, 22, 0.85);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--border);
        }
        .events-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.6rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .events-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .events-header-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          letter-spacing: 3px;
          color: var(--green);
          text-shadow: var(--glow-green);
        }
        .events-header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .events-header-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: var(--green);
          margin-right: 0.5rem;
        }
        @media (max-width: 640px) {
          .events-header-badge { display: none; }
          .events-header-title { font-size: 1.1rem; }
        }
      `}</style>
    </>
  );
}