"use client";

import { useState } from "react";
import CtaButton from "./cta-button";

function Field({ k, v, tall, value, onChange, type = "text" }) {
  return (
    <label
      style={{
        display: "block",
        borderBottom: "1px solid rgba(255,255,255,0.18)",
        paddingBottom: 10,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {k}
      </div>
      {tall ? (
        <textarea placeholder={v} value={value} onChange={onChange} />
      ) : (
        <input type={type} placeholder={v} value={value} onChange={onChange} />
      )}
    </label>
  );
}

export default function Contact({ accent = "#E8001C" }) {
  const [form, setForm] = useState({
    name: "",
    org: "",
    email: "",
    project: "",
    message: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send. Try again.");
        return;
      }
      setStatus("sent");
      setForm({ name: "", org: "", email: "", project: "", message: "", company: "" });
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.32em",
            color: accent,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          // TRANSMISSION OPEN
        </div>
        <div className="contact-title">
          Send <span style={{ fontWeight: 300, fontStyle: "italic" }}>a signal.</span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 560,
            margin: "0 auto 56px",
            lineHeight: 1.5,
          }}
        >
          Tell us what you&apos;re building. We&apos;ll listen, then we&apos;ll answer.
        </div>
        <form onSubmit={submit} className="contact-form">
          <div className="contact-form__namerow">
            <Field k="NAME" v="Your name" value={form.name} onChange={set("name")} />
            <Field k="ORG" v="Studio / company" value={form.org} onChange={set("org")} />
          </div>
          <Field k="EMAIL" v="hello@yours.com" value={form.email} onChange={set("email")} type="email" />
          <Field k="PROJECT" v="Working title or idea" value={form.project} onChange={set("project")} />
          <Field k="MESSAGE" v="Tell us a little about it…" value={form.message} onChange={set("message")} tall />
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={set("company")}
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <CtaButton
            as="button"
            type="submit"
            variant="solid"
            accent={accent}
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "TRANSMITTING…"
              : status === "sent"
              ? "SENT — WE'LL BE IN TOUCH ✓"
              : "TRANSMIT →"}
          </CtaButton>
          {status === "error" && (
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: accent,
                textTransform: "uppercase",
              }}
            >
              ✕ {error}
            </div>
          )}
        </form>
        <div className="contact-channels">
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>CONTACT US AT</div>
            ilija@undertheradar.agency
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>STUDIO</div>
            UNDISCLOSED · 34.59° N
          </div>
        </div>
      </div>
    </section>
  );
}
