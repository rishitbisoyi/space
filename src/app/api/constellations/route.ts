import { NextResponse } from "next/server";
import constellations from "@/data/constellations.json";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: constellations.length,
      data: constellations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch constellations",
      },
      { status: 500 }
    );
  }
}