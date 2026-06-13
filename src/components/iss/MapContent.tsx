"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";

import { useISS } from "@/hooks/useISS";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

/* ── Custom ISS marker ─────────────────────────────────── */
const issIcon = new L.DivIcon({
  html: `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <!-- outer pulse ring -->
      <div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1px solid rgba(0,255,136,0.5);
        animation: radar-pulse 2s ease-out infinite;
      "></div>
      <!-- second pulse ring, offset -->
      <div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1px solid rgba(0,255,136,0.3);
        animation: radar-pulse 2s ease-out 1s infinite;
      "></div>
      <!-- icon -->
      <span style="font-size: 22px; filter: drop-shadow(0 0 6px #00ff88);">🛰️</span>
    </div>
  `,
  className: "",
  iconSize:    [36, 36],
  iconAnchor:  [18, 18],
  popupAnchor: [0, -22],
});

/* ── Auto-follow camera ────────────────────────────────── */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

/* ── Future path estimation ────────────────────────────── */
function generateFuturePath(
  history: [number, number][]
): [number, number][] {
  if (history.length < 2) {
    return [];
  }

  const last =
    history[history.length - 1];

  const prev =
    history[history.length - 2];

  const latStep =
    last[0] - prev[0];

  const lonStep =
    last[1] - prev[1];

  const future: [
    number,
    number
  ][] = [];

  for (
    let i = 1;
    i <= 25;
    i++
  ) {
    future.push([
      last[0] + latStep * i,
      last[1] + lonStep * i,
    ]);
  }

  return future;
}

/* ── Boot loader ───────────────────────────────────────── */
function MapLoader() {
  return (
    <div
      style={{
        height:     "65vh",
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050816",
        border:     "1px solid var(--border)",
        borderRadius: "4px",
        gap:        "1.5rem",
        color:      "var(--green)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Radar SVG */}
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="1"/>
        <circle cx="45" cy="45" r="28" fill="none" stroke="rgba(0,255,136,0.15)" strokeWidth="1"/>
        <circle cx="45" cy="45" r="14" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="1"/>
        <circle cx="45" cy="45" r="3"  fill="var(--green)" opacity="0.8"/>
        <line
          x1="45" y1="45" x2="45" y2="5"
          stroke="var(--green)" strokeWidth="1.5" opacity="0.7"
          style={{ transformOrigin:"45px 45px", animation:"spin-radar 2s linear infinite" }}
        />
        {/* sweep arc fill */}
        <path
          d="M45,45 L45,5 A40,40 0 0,1 80,70 Z"
          fill="rgba(0,255,136,0.05)"
          style={{ transformOrigin:"45px 45px", animation:"spin-radar 2s linear infinite" }}
        />
      </svg>

      <div style={{ textAlign: "center", lineHeight: 2 }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "4px", color: "rgba(0,255,136,0.4)" }}>
          ORBITAL TRACKING SYSTEM
        </div>
        <div
          style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "3px" }}
          className="flicker"
        >
          ESTABLISHING UPLINK
        </div>
        <div style={{ fontSize: "0.7rem", color: "rgba(0,255,136,0.45)", letterSpacing: "2px" }}>
          SYNCHRONIZING ORBITAL TELEMETRY<span className="cursor" />
        </div>
      </div>
    </div>
  );
}

/* ── Main map component ────────────────────────────────── */
export default function MapContent() {
  const { data, history } = useISS();

  if (!data) return <MapLoader />;

  const lat = data.latitude;
  const lng = data.longitude;
  const futurePath =
  generateFuturePath(
    history
  );

  return (
    <div style={{ position: "relative" }}>
      {/* Overlay label */}
      <div style={{
        position:   "absolute",
        top:        "0.75rem",
        left:       "0.75rem",
        zIndex:     500,
        background: "rgba(5,8,22,0.85)",
        border:     "1px solid var(--border)",
        borderRadius: "3px",
        padding:    "0.4rem 0.75rem",
        fontFamily: "var(--font-display)",
        fontSize:   "1rem",
        color:      "var(--green)",
        letterSpacing: "3px",
        display:    "flex",
        alignItems: "center",
        gap:        "0.5rem",
      }}>
        <span className="status-led green" />
        LIVE ISS POSITION
      </div>

      {/* Coord readout */}
      <div style={{
        position:   "absolute",
        top:        "0.75rem",
        right:      "0.75rem",
        zIndex:     500,
        background: "rgba(5,8,22,0.85)",
        border:     "1px solid var(--border)",
        borderRadius: "3px",
        padding:    "0.4rem 0.75rem",
        fontFamily: "var(--font-mono)",
        fontSize:   "0.7rem",
        color:      "var(--cyan)",
        letterSpacing: "2px",
        lineHeight:  1.6,
      }}>
        <div>LAT {lat.toFixed(4)}°</div>
        <div>LON {lng.toFixed(4)}°</div>
        <div style={{ color: "var(--amber)" }}>ALT {data.altitude.toFixed(1)} km</div>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={3}
        zoomControl={false}
        style={{
          height:       "65vh",
          width:        "100%",
          borderRadius: "4px",
          border:       "1px solid var(--border)",
        }}
      >
        {/* Dark space-themed tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <RecenterMap lat={lat} lng={lng} />

        {/* Orbit trail — red glow */}
        {history.length > 1 && (
          <Polyline
            positions={history}
            pathOptions={{
              color:   "#ff4d4d",
              weight:  2,
              opacity: 0.7,
            }}
          />
        )}

        {futurePath.length > 1 && (
  <Polyline
    positions={futurePath}
    pathOptions={{
      color: "#00ff88",
      weight: 2,
      opacity: 0.5,
      dashArray: "8 8",
    }}
  />
)}

        {/* Coverage footprint */}
        <Circle
          center={[lat, lng]}
          radius={data.footprint * 1000}
          pathOptions={{
            color:       "#00d9ff",
            fillColor:   "#00d9ff",
            fillOpacity: 0.04,
            weight:      1,
            dashArray:   "4 8",
          }}
        />

        {/* ISS marker */}
        <Marker position={[lat, lng]} icon={issIcon}>
          <Popup>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize:   "0.75rem",
              color:      "var(--green)",
              lineHeight: 1.8,
              minWidth:   "160px",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", marginBottom: "0.3rem" }}>
                🛰️ ISS
              </div>
              <div>LAT  {lat.toFixed(4)}°</div>
              <div>LON  {lng.toFixed(4)}°</div>
              <div style={{ color: "var(--cyan)" }}>
                ALT  {data.altitude.toFixed(2)} km
              </div>
              <div style={{ color: "var(--amber)" }}>
                VEL  {Math.round(data.velocity).toLocaleString()} km/h
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Legend */}
      <div style={{
        display:    "flex",
        gap:        "1.5rem",
        padding:    "0.5rem 0.75rem",
        background: "rgba(5,8,22,0.7)",
        borderTop:  "none",
        border:     "1px solid var(--border)",
        borderRadius: "0 0 4px 4px",
        fontSize:   "0.65rem",
        letterSpacing: "2px",
        flexWrap:   "wrap",
      }}>
        <span style={{ color: "#ff4d4d" }}>▬ ORBIT TRAIL</span>
        <span style={{ color: "#00ff88" }}>╌ PREDICTED PATH</span>
        <span style={{ color: "#00d9ff" }}>◯ COVERAGE RADIUS</span>
      </div>
    </div>
  );
}