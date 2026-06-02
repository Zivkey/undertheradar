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
  });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = `[UTR] ${form.project || "New transmission"} — ${
      form.name || "Anonymous"
    }`;
    const body = [
      `Name: ${form.name}`,
      `Org: ${form.org}`,
      `Email: ${form.email}`,
      `Project: ${form.project}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:hello@undertheradar.agency?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
          <CtaButton as="button" type="submit" variant="solid" accent={accent}>
            {sent ? "SENT — CHECK YOUR MAIL CLIENT ✓" : "TRANSMIT →"}
          </CtaButton>
        </form>
        <div className="contact-channels">
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>CONTENT</div>
            nikola@undertheradar.agency
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>SALES</div>
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
