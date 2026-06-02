"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const FILL_PERCENT = 62;

export default function ComingSoonRow({ index, name, accent = "#E8001C" }) {
  const rowRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    const fill = fillRef.current;
    if (!row || !fill) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      gsap.set(fill, { width: `${FILL_PERCENT}%` });
      return;
    }

    gsap.set(fill, { width: 0 });
    let played = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !played) {
            played = true;
            gsap.to(fill, {
              width: `${FILL_PERCENT}%`,
              duration: 2.2,
              ease: "power3.out",
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="archive-row archive-row--soon"
      style={{ "--accent": accent }}
      aria-label={`${name} — coming soon`}
    >
      <span ref={fillRef} className="soon-progress" aria-hidden="true" />
      <div className="archive-row__n archive-row__n--soon">
        {String(index).padStart(2, "0")}
      </div>
      <div className="archive-row__name archive-row__name--soon">{name}</div>
      <div className="archive-row__cta archive-row__cta--soon">
        <span className="soon-dot" aria-hidden="true" />
        LOADING…
      </div>
    </div>
  );
}
