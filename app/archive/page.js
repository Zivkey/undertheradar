import Link from "next/link";
import Footer from "../components/footer";
import ComingSoonRow from "../components/coming-soon-row";

const COMING_SOON = [{ name: "Eddie Cumberbatch" }];

const ACCENT = "#E8001C";

const ARCHIVE = [
  { name: "Iman Gadzhi",     url: "https://www.youtube.com/watch?v=1-izXBhkiHw" },
  { name: "Flow Ninja",      url: "https://www.youtube.com/watch?v=qmybSF8KqBM&t=46s" },
  { name: "Nino Popovic",    url: "https://www.youtube.com/watch?v=NXP7H7vDO4M&t=228s" },
  { name: "Jordan Platten",  url: "https://www.youtube.com/watch?v=VvOMlhLwX2U" },
  { name: "Nsima Inyang",    url: "https://www.youtube.com/watch?v=Cl-ZxESkEEA&t=1s" },
  { name: "Under The Radar", url: "https://youtu.be/t7ozOgMESaE" },
  { name: "Sander Stage",    url: "https://www.youtube.com/@SanderStage" },
  { name: "Thomas Gonnet",   url: "https://www.youtube.com/@thomasgonnet" },
  { name: "Alex Beck",       url: "https://www.youtube.com/watch?v=TzzK1y7wVPQ" },
];

export const metadata = {
  title: "Archive — Under the Radar",
  description: "Every signal. Full archive of titles.",
};

export default function ArchivePage() {
  return (
    <div className="archive">
      <div className="archive-top">
        <div className="archive-top__brand">UNDER THE RADAR</div>
        <Link className="archive-back" href="/">← BACK TO STUDIO</Link>
      </div>
      <div className="archive-body">
        <div className="archive-eyebrow" style={{ color: ACCENT }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: ACCENT,
              animation: "pulse 2.4s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          // FULL ARCHIVE
        </div>
        <div className="archive-title">
          Every <span style={{ fontWeight: 300, fontStyle: "italic" }}>signal.</span>
        </div>
        <div className="archive-sub">
          {String(ARCHIVE.length + COMING_SOON.length).padStart(2, "0")} TITLES — SELECT TO WATCH ↗
        </div>
        <div>
          {COMING_SOON.map((c, i) => (
            <ComingSoonRow
              key={c.name}
              index={i + 1}
              name={c.name}
              accent={ACCENT}
            />
          ))}
          {ARCHIVE.map((c, i) => (
            <a
              key={c.name}
              className="archive-row"
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="archive-row__n" style={{ color: ACCENT }}>
                {String(i + 1 + COMING_SOON.length).padStart(2, "0")}
              </div>
              <div className="archive-row__name">{c.name}</div>
              <div className="archive-row__cta">WATCH ON YT ↗</div>
            </a>
          ))}
        </div>
      </div>
      <Footer accent={ACCENT} />
    </div>
  );
}
