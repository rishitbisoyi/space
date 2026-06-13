import { NextResponse } from "next/server";
import { fetchISSLocation } from "@/lib/api/iss";

export async function GET() {
  try {
    const data = await fetchISSLocation();

    return NextResponse.json(data);
  } catch (error) {
    console.error("ISS API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch ISS location",
        details: String(error),
      },
      { status: 500 }
    );
  }
}