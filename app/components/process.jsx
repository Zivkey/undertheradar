"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const STEPS = [
  { n: "01", name: "TUNE IN",      sub: "discovery / brief / what are we trying to say" },
  { n: "02", name: "TRIANGULATE",  sub: "concept / treatment / scope / who, where, when" },
  { n: "03", name: "CAPTURE",      sub: "production / direction / on the ground" },
  { n: "04", name: "MIX DOWN",     sub: "edit / color / sound / picture lock" },
  { n: "05", name: "BROADCAST",    sub: "release / press / placement / archive" },
];

export default function Process({ accent = "#E8001C" }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const rows = root.querySelectorAll(".process-row");
    if (!rows.length) return;

    gsap.set(rows, { opacity: 0, y: 32 });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(e.target, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: Number(e.target.dataset.idx) * 0.08,
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    rows.forEach((r, i) => {
      r.dataset.idx = i;
      io.observe(r);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="process-section">
      <div className="process-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div className="process-title">
            Process
            <span style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
              {" "}/ signal path.
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              maxWidth: 280,
              lineHeight: 1.6,
            }}
          >
            how a faint signal becomes a finished film.
          </div>
        </div>
        <div>
          {STEPS.map((s, i) => (
            <div key={s.n} className="process-row">
              <div className="process-row__n" style={{ color: accent }}>{s.n}</div>
              <div className="process-row__name">{s.name}</div>
              <div className="process-row__sub">{s.sub}</div>
              <div className="process-row__wk">WK 0{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
