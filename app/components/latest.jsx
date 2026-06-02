"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CtaButton from "./cta-button";

function LatestCard({
  accent,
  channel,
  icon,
  channelLabel,
  channelSub,
  title,
  meta,
  line,
  src,
  poster,
  link,
  ctaLabel,
  variant,
}) {
  const isStudio = variant === "studio";
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [iconOk, setIconOk] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    setPaused(v.paused);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [src]);

  return (
    <article className={`latest-card latest-card--${variant}`}>
      <div className="latest-card__video">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster || undefined}
            loop
            muted
            playsInline
            preload="metadata"
            data-latest="1"
          />
        ) : poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={title} loading="lazy" />
        ) : (
          <div className="latest-card__placeholder">// AWAITING SIGNAL</div>
        )}
        {src && poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            style={{
              opacity: paused ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
            }}
          />
        )}
        <div className="latest-card__gradient" />
        <div className="latest-card__badge">
          <span
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: accent,
              animation: "pulse 1.4s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          {src ? (paused ? "STAND BY" : "PLAYING — LIVE LOOP") : "AWAITING SIGNAL"}
        </div>
      </div>

      <div className="latest-card__meta">
        {isStudio && <div className="latest-card__scanlines" />}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            {icon && iconOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                onError={() => setIconOk(false)}
                style={{
                  height: 42, width: 42,
                  objectFit: "contain", display: "block", flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 900, fontSize: 48, lineHeight: 0.9,
                  color: accent, letterSpacing: "-0.04em",
                }}
              >
                {channel}
              </div>
            )}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10, color: "#fff",
                  letterSpacing: "0.24em", fontWeight: 700,
                }}
              >
                {channelLabel}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {channelSub}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 20 }} />

          <div className="latest-card__title">{title}</div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase", marginBottom: 18, lineHeight: 1.6,
            }}
          >
            {meta}
          </div>
          <div
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: 14, lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {line}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, marginTop: 24 }}>
          <CtaButton
            href={link || "#"}
            target={link ? "_blank" : undefined}
            rel="noopener noreferrer"
            accent={accent}
            dot
          >
            {ctaLabel}
          </CtaButton>
        </div>
      </div>
    </article>
  );
}

export default function Latest({ accent = "#E8001C", latest }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll("video[data-latest]"));
    if (!videos.length) return;

    const ratios = new Map(videos.map((v) => [v, 0]));
    const pendingReady = new WeakMap();
    let active = null;

    const cancelPending = (v) => {
      const off = pendingReady.get(v);
      if (off) {
        off();
        pendingReady.delete(v);
      }
    };

    const playSafely = (v) => {
      v.muted = true;
      if (v.readyState >= 2) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
        return;
      }
      cancelPending(v);
      const onReady = () => {
        cancelPending(v);
        if (active !== v) return;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };
      v.addEventListener("loadeddata", onReady);
      v.addEventListener("canplay", onReady);
      pendingReady.set(v, () => {
        v.removeEventListener("loadeddata", onReady);
        v.removeEventListener("canplay", onReady);
      });
      try { v.load(); } catch {}
    };

    const update = () => {
      let best = null;
      let bestRatio = 0.25;
      ratios.forEach((r, v) => {
        if (r > bestRatio) {
          bestRatio = r;
          best = v;
        }
      });
      if (best === active) {
        if (best && best.paused) playSafely(best);
        return;
      }
      videos.forEach((v) => {
        if (v !== best) {
          cancelPending(v);
          if (!v.paused) v.pause();
        }
      });
      active = best;
      if (best) playSafely(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        update();
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    videos.forEach((v) => {
      try { v.pause(); } catch {}
      observer.observe(v);
    });

    const onVis = () => { if (!document.hidden) update(); };
    const onShow = () => update();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onShow);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onShow);
      videos.forEach((v) => {
        cancelPending(v);
        try { v.pause(); } catch {}
      });
    };
  }, [latest.client.src, latest.studio.src]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll(".latest-card"), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: undefined,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="latest-section">
      <div className="latest-inner">
        <div className="latest-header">
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11, letterSpacing: "0.32em",
                color: accent, textTransform: "uppercase",
                marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: accent,
                  animation: "pulse 2.4s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              // NOW BROADCASTING
            </div>
            <div className="latest-title">
              The <span style={{ fontWeight: 300, fontStyle: "italic" }}>latest.</span>
            </div>
          </div>
          <div
            className="latest-header__sub"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              maxWidth: 340, lineHeight: 1.7,
            }}
          >
            Two signals, one studio.
            <br />
            Outbound for clients · inbound from us.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          <LatestCard
            accent={accent}
            channel="01"
            icon="/uploads/coin.png"
            channelLabel="COMMISSIONED"
            channelSub="Outbound · Client Work"
            title={latest.client.title}
            meta={latest.client.meta}
            line={latest.client.line}
            src={latest.client.src}
            poster={latest.client.poster}
            link={latest.client.link}
            ctaLabel="WATCH ON YT ↗"
            variant="client"
          />
          <LatestCard
            accent={accent}
            channel="02"
            icon="/uploads/hand.png"
            channelLabel="BROADCAST"
            channelSub="Inbound · Studio Channel"
            title={latest.studio.title}
            meta={latest.studio.meta}
            line={latest.studio.line}
            src={latest.studio.src}
            poster={latest.studio.poster}
            link={latest.studio.link}
            ctaLabel="WATCH ON YT ↗"
            variant="studio"
          />
        </div>

        <div
          style={{
            marginTop: 80, padding: "48px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11, letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase", marginBottom: 18,
            }}
          >
            // EVERY TITLE, EVERY YEAR
          </div>
          <CtaButton href="/archive" size="lg" accent={accent}>
            ENTER THE FULL ARCHIVE →
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
