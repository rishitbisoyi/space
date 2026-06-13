"use client";

import { useState, KeyboardEvent } from "react";

interface CitySearchProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

const QUICK_CITIES = ["CHENNAI", "TOKYO", "SYDNEY", "LONDON", "LOS ANGELES"];

export default function CitySearch({ onSearch, loading }: CitySearchProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed && !loading) onSearch(trimmed.toUpperCase());
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led cyan" />
        CITY TERMINAL
        <span className="mc-panel-sub">GEOCODING UPLINK ACTIVE</span>
      </div>
      <div className="mc-panel-body">
        <div className="city-search-row">
          <span className="city-prompt">LOCATION:</span>
          <input
            className="city-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            onKeyDown={handleKey}
            placeholder="ENTER CITY NAME..."
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="city-btn"
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
          >
            {loading ? "ACQUIRING..." : "[ ACQUIRE ]"}
          </button>
        </div>

        <div className="quick-cities">
          <span className="quick-label">QUICK SELECT:</span>
          <div className="quick-cities-list">
            {QUICK_CITIES.map((city) => (
              <button
                key={city}
                className="quick-btn"
                onClick={() => { setValue(city); onSearch(city); }}
                disabled={loading}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}