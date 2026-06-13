import { NextResponse } from "next/server";

import {
  fetchISSLocation,
} from "@/lib/api/iss";

export async function GET() {
  try {
    const data =
      await fetchISSLocation();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "ISS API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "ISS data unavailable",
      },
      {
        status: 500,
      }
    );
  }
}