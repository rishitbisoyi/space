'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const typeColors: Record<string, { led: string; color: string; glow: string }> = {
  solar:               { led: "amber", color: "var(--amber)", glow: "var(--glow-amber)" },
  lunar:               { led: "cyan",  color: "var(--cyan)",  glow: "var(--glow-cyan)"  },
  meteor_shower:       { led: "red",   color: "var(--red)",   glow: "var(--glow-red)"   },
  planet_conjunction:  { led: "cyan",  color: "var(--cyan)",  glow: "var(--glow-cyan)"  },
};

const defaultType = { led: "green", color: "var(--green)", glow: "var(--glow-green)" };

export default function EventCard({ event }: EventCardProps) {
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'active' | 'completed'>('upcoming');

  useEffect(() => {
    const update = () => {
      const diff = new Date(event.date).getTime() - Date.now();
      if (diff < 0) {
        setEventStatus('completed');
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setEventStatus(diff < 86400000 ? 'active' : 'upcoming');
        setCountdown({
          days:    Math.floor(diff / 86400000),
          hours:   Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [event.date]);

  const tc = typeColors[event.type] ?? defaultType;

  const statusLed = eventStatus === 'active' ? 'amber' : eventStatus === 'completed' ? 'red' : 'green';
  const statusText = eventStatus === 'active' ? 'ACTIVE' : eventStatus === 'completed' ? 'COMPLETED' : 'UPCOMING';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div
      className="mc-panel"
      style={{
        borderColor: tc.color.replace('var(', '').replace(')', '') === '--amber'
          ? 'rgba(255,176,0,0.25)'
          : tc.color === 'var(--cyan)'
          ? 'rgba(0,217,255,0.25)'
          : tc.color === 'var(--red)'
          ? 'rgba(255,77,77,0.25)'
          : 'var(--border)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = tc.glow;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Panel header */}
      <div className="mc-panel-header" style={{ fontSize: "0.85rem", letterSpacing: "2px" }}>
        <span className={`status-led ${statusLed}`} />
        <span style={{ color: tc.color, textShadow: tc.glow, flex: 1 }}>
          {event.title.toUpperCase()}
        </span>
        <span style={{
          fontSize: "0.6rem",
          letterSpacing: "2px",
          color: tc.color,
          opacity: 0.7,
          border: `1px solid ${tc.color}`,
          padding: "1px 6px",
        }}>
          {statusText}
        </span>
      </div>

      <div className="mc-panel-body">
        {/* Type + date row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.6rem",
          fontSize: "0.65rem",
          letterSpacing: "2px",
        }}>
          <span style={{ color: tc.color, opacity: 0.65 }}>
            [{event.type.replace(/_/g, ' ').toUpperCase()}]
          </span>
          <span style={{ color: "var(--amber)", opacity: 0.8 }}>
            {formatDate(event.date)}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "rgba(0,255,136,0.6)",
          lineHeight: 1.7,
          letterSpacing: "0.5px",
          marginBottom: "0.75rem",
          minHeight: "2.8rem",
        }}>
          {event.description}
        </p>

        {/* Countdown */}
        {eventStatus !== 'completed' && (
          <>
            <div style={{
              fontSize: "0.6rem",
              letterSpacing: "3px",
              color: "rgba(0,255,136,0.35)",
              marginBottom: "0.4rem",
            }}>
              T-MINUS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.4rem" }}>
              {[
                { val: countdown.days,    unit: "DAYS" },
                { val: countdown.hours,   unit: "HRS"  },
                { val: countdown.minutes, unit: "MIN"  },
                { val: countdown.seconds, unit: "SEC"  },
              ].map(({ val, unit }) => (
                <div
                  key={unit}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${tc.color}33`,
                    padding: "0.4rem 0",
                    textAlign: "center",
                  }}
                >
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    color: tc.color,
                    textShadow: tc.glow,
                    lineHeight: 1,
                  }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontSize: "0.55rem",
                    letterSpacing: "2px",
                    color: `${tc.color}80`,
                    marginTop: "2px",
                  }}>
                    {unit}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "0.75rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border-dim)",
          fontSize: "0.6rem",
          letterSpacing: "2px",
          color: "rgba(0,255,136,0.2)",
        }}>
          ID: {event.id}
        </div>
      </div>
    </div>
  );
}