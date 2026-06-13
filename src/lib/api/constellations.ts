import { Constellation } from "@/types/constellation";

interface ConstellationApiResponse {
  success: boolean;
  count: number;
  data: Constellation[];
}

export async function getConstellations(): Promise<Constellation[]> {
  const response = await fetch("/api/constellations");

  if (!response.ok) {
    throw new Error("Failed to fetch constellations");
  }

  const result: ConstellationApiResponse =
    await response.json();

  return result.data;
}