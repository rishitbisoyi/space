"use client";

import Link from "next/link";

export default function BackToDashboard() {
  return (
    <Link
      href="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",

        padding: "0.6rem 1rem",

        border: "1px solid var(--border)",
        borderRadius: "4px",

        background: "rgba(0,255,136,0.05)",

        color: "var(--green)",

        textDecoration: "none",

        fontFamily: "var(--font-display)",
        letterSpacing: "2px",

        transition: "all 0.2s ease",
      }}
    >
      ← DASHBOARD
    </Link>
  );
}