"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useISS } from "@/hooks/useISS";

export default function MapContent() {
  const data = useISS();

  if (!data?.iss_position) {
    return <p>Loading Map...</p>;
  }

  const latitude = Number(data.iss_position.latitude);
  const longitude = Number(data.iss_position.longitude);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={3}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]}>
        <Popup>
          ISS Current Position
          <br />
          Lat: {latitude}
          <br />
          Lon: {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
}