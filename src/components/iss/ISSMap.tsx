"use client";

import dynamic from "next/dynamic";

const MapContent = dynamic(
  () => import("./MapContent"),
  {
    ssr: false,
  }
);

export default function ISSMap() {
  return <MapContent />;
}