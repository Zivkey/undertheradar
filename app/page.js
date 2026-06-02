import Hero from "./components/hero";
import Latest from "./components/latest";
import Process from "./components/process";
import Contact from "./components/contact";
import Footer from "./components/footer";

const ACCENT = "#E8001C";

const LATEST = {
  client: {
    src: "/uploads/latest-client.mp4",
    poster: "/uploads/client.png",
    title: "Still Walking",
    meta: "FEATURED · 2026 · NSIMA INYANG",
    line:
      "At 100 years old, his grandmother still walked every day — no cane, no complaints. Strength athlete Nsima Inyang traces a lifetime of quiet movement to uncover the blueprint modern fitness forgot.",
    link: "https://youtu.be/Cl-ZxESkEEA",
  },
  studio: {
    src: "/uploads/latest-studio.mp4",
    poster: "/uploads/studio.png",
    title: "Irreplaceable",
    meta: "STUDIO ORIGINAL · 2025 · UTR",
    line:
      "As AI swallows the creative industry whole, one breed of video editors refuse to disappear. Some cuts can only be made by a human hand.",
    link: "https://youtu.be/ttdBbHyK7yE",
  },
};

export default function Home() {
  return (
    <>
      <Hero accent={ACCENT} videoSrc="/uploads/hero.mp4" />
      <Latest accent={ACCENT} latest={LATEST} />
      <Process accent={ACCENT} />
      <Contact accent={ACCENT} />
      <Footer accent={ACCENT} />
    </>
  );
}
