import ISSStats from "@/components/iss/ISSStats";
import ISSMap from "@/components/iss/ISSMap";

export default function ISSTrackerPage() {
  return (
    <main className="p-6">
      <h1>ISS Tracker</h1>

      <ISSStats />

      <ISSMap />
    </main>
  );
}