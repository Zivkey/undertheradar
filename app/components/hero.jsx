"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import RadarSweep from "./radar-sweep";

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Belgrade",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CornerMeta({ corner, align = "left", k, v, sub, dot, accent }) {
  const cls = `hero-corner-meta hero-corner-meta--${corner}${
    align === "right" ? " hero-corner-meta--right" : ""
  }`;
  return (
    <div className={cls}>
      <div className="hero-corner-meta__key">{k}</div>
      <div className="hero-corner-meta__value">
        {dot && (
          <span className="hero-corner-meta__dot" style={{ background: accent }} />
        )}
        <span suppressHydrationWarning>{v}</span>
      </div>
      {sub && <div className="hero-corner-meta__sub">{sub}</div>}
    </div>
  );
}

export default function Hero({ accent = "#E8001C", videoSrc }) {
  const localTime = useClock();
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const attemptPlay = () => {
      if (!v.isConnected) return;
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    const ensure = () => {
      if (v.paused) {
        if (v.readyState >= 2) {
          attemptPlay();
        } else {
          const onReady = () => {
            v.removeEventListener("loadeddata", onReady);
            v.removeEventListener("canplay", onReady);
            attemptPlay();
          };
          v.addEventListener("loadeddata", onReady);
          v.addEventListener("canplay", onReady);
          try { v.load(); } catch {}
        }
      }
    };

    ensure();

    const onVis = () => { if (!document.hidden) ensure(); };
    const onShow = (e) => { if (e.persisted) ensure(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onShow);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onShow);
    };
  }, [videoSrc]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const corners = root.querySelectorAll(".hero-corner-meta");
    const nav = root.querySelector(".hero-nav");
    const strap = root.querySelector(".hero-strap");

    const ctx = gsap.context(() => {
      gsap.from(nav, { y: -16, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from(strap, { y: 16, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.25 });
      gsap.from(corners, {
        opacity: 0,
        y: 12,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.35,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      {!videoSrc && (
        <div className="hero-radar">
          <RadarSweep speed={1} accent={accent} />
        </div>
      )}

      {videoSrc && (
        <div className="hero-video-wrap">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
      )}

      <div className="hero-vignette" />
      <div className="hero-letterbox" style={{ top: 0 }} />
      <div className="hero-letterbox" style={{ bottom: 0 }} />

      <nav className="hero-nav">
        <div className="hero-nav-brand">UNDER THE RADAR</div>
        <div className="hero-nav-links">
          <a href="#work" style={{ color: "#fff" }}>WORK</a>
          <a href="#work">STUDIO</a>
          <a href="#process">PROCESS</a>
          <a href="#contact">CONTACT</a>
        </div>
      </nav>

      <div className="hero-corner-crop" style={{ top: 74, left: 32, borderWidth: "1px 0 0 1px" }} />
      <div className="hero-corner-crop" style={{ top: 74, right: 32, borderWidth: "1px 1px 0 0" }} />
      <div className="hero-corner-crop" style={{ bottom: 60, left: 32, borderWidth: "0 0 1px 1px" }} />
      <div className="hero-corner-crop" style={{ bottom: 60, right: 32, borderWidth: "0 1px 1px 0" }} />

      <CornerMeta corner="tl" k="LOCATION" v="CLASSIFIED" sub="34.5920° N / 106.3652° W" />
      <CornerMeta corner="tr" align="right" k="STATUS" v="AVAILABLE — Q3" sub="2 SLOTS REMAINING" dot accent={accent} />
      <CornerMeta corner="bl" k="DISCIPLINE" v="CREATIVE STUDIO" sub="DIRECTION · EDITORIAL · DEV" />
      <CornerMeta corner="br" align="right" k="LOCAL TIME" v={localTime} sub="INDEX · UTR — 001" />

      <div className="hero-strap">
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: accent,
              animation: "pulse 2.4s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          ON AIR — PRESENTLY
        </span>
        <a href="#work">SCROLL — WORK ↓</a>
      </div>
    </section>
  );
}
