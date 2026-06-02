export default function RadarSweep({ speed = 1, accent = "#E8001C" }) {
  const dur = 6 / speed;
  return (
    <svg
      viewBox="-100 -100 200 200"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <radialGradient id="sweep-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="sweep-wedge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="80%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80, 100, 120].map((r, i) => (
        <circle
          key={r}
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="0.25"
          opacity={0.18 - i * 0.015}
        />
      ))}
      <line x1="-200" y1="0" x2="200" y2="0" stroke={accent} strokeWidth="0.15" opacity="0.18" />
      <line x1="0" y1="-200" x2="0" y2="200" stroke={accent} strokeWidth="0.15" opacity="0.18" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x1 = Math.cos(a) * 118, y1 = Math.sin(a) * 118;
        const x2 = Math.cos(a) * 124, y2 = Math.sin(a) * 124;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accent} strokeWidth="0.4" opacity="0.5"
          />
        );
      })}
      <g style={{ transformOrigin: "0 0", animation: `radar-spin ${dur}s linear infinite` }}>
        <path d="M0,0 L150,0 A150,150 0 0,0 116,-95 Z" fill="url(#sweep-wedge)" opacity="0.85" />
        <line x1="0" y1="0" x2="150" y2="0" stroke={accent} strokeWidth="0.5" opacity="0.9" />
      </g>
      <circle cx="0" cy="0" r="1.2" fill={accent} />
      <circle cx="0" cy="0" r="3" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.5" />
      <rect x="-100" y="-100" width="200" height="200" fill="url(#sweep-fade)" />
    </svg>
  );
}
