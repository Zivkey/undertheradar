"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CtaButton({
  as = "a",
  href,
  type,
  onClick,
  variant = "outline",
  size = "md",
  accent = "#E8001C",
  fillColor,
  dot = false,
  disableHover = false,
  children,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const fillRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (disableHover) return;
    const el = ref.current;
    const fill = fillRef.current;
    if (!el || !fill) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    gsap.set(fill, { yPercent: 101 });

    const tl = gsap.timeline({ paused: true });
    tl.to(fill, {
      yPercent: 0,
      duration: reduced ? 0.01 : 0.55,
      ease: "power3.out",
    }).to(
      el,
      { y: reduced ? 0 : -2, duration: reduced ? 0.01 : 0.35, ease: "power2.out" },
      0
    );
    tlRef.current = tl;

    const onEnter = () => tl.timeScale(1).play();
    const onLeave = () => tl.timeScale(1.4).reverse();
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focus", onEnter);
    el.addEventListener("blur", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("focus", onEnter);
      el.removeEventListener("blur", onLeave);
      tl.kill();
    };
  }, [disableHover]);

  const cls = [
    "cta",
    variant === "solid" ? "cta--solid" : "",
    size === "lg" ? "cta--lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = { "--accent": accent };
  const fillStyle = fillColor ? { background: fillColor } : undefined;

  const inner = (
    <>
      <span ref={fillRef} className="cta__fill" style={fillStyle} aria-hidden="true" />
      <span className="cta__label">
        {dot && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
            }}
          />
        )}
        {children}
      </span>
    </>
  );

  if (as === "button") {
    return (
      <button
        ref={ref}
        type={type || "button"}
        onClick={onClick}
        className={cls}
        style={style}
        {...rest}
      >
        {inner}
      </button>
    );
  }

  return (
    <a ref={ref} href={href} onClick={onClick} className={cls} style={style} {...rest}>
      {inner}
    </a>
  );
}
