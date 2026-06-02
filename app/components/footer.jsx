"use client";

import { useEffect, useState } from "react";

export default function Footer({ accent = "#E8001C" }) {
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="site-footer">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: accent,
            animation: "pulse 2.4s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        UNDER THE RADAR · UTR — 001 · EST. 2023
      </div>
      <div suppressHydrationWarning>© {year} · ALL FREQUENCIES RESERVED</div>
    </footer>
  );
}
