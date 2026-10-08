import { Suspense, lazy, useState } from "react";
import { TAGLINE_LINES } from "../config";
import { useTheme } from "../theme";

const HeroShader = lazy(() => import("./HeroShader"));

/** Add ?title=red to the URL to get the dithered red headline instead of plain white. */
const TITLE_RED = new URLSearchParams(window.location.search).get("title") === "red";

export default function Hero() {
  // "loading": plain background while the shader starts (no placeholder shape that would
  // then change). "fallback": the static CSS glow, only when WebGPU is unavailable.
  const [art, setArt] = useState<"loading" | "live" | "fallback">(() =>
    "gpu" in navigator ? "loading" : "fallback",
  );
  const theme = useTheme();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className={`hero-art ${art}`} aria-hidden="true">
        <Suspense fallback={null}>
          <HeroShader theme={theme} onLive={(ok) => setArt(ok ? "live" : "fallback")} />
        </Suspense>
      </div>
      <div className="wrap hero-inner">
        <h1 id="hero-title" className={TITLE_RED ? "title-red" : undefined}>Arcanum</h1>
        <p className="lead">
          {TAGLINE_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div className="cta-row">
          <a className="btn" href="#approach">
            Learn more
          </a>
        </div>
      </div>
      <div className="wrap hero-def-wrap">
        <aside className="hero-def" aria-label="Definition of arcanum">
          <p className="hero-def-head">
            <span className="hero-def-word" lang="la">
              arcanum<sup aria-hidden="true">1</sup>
            </span>
            <span className="hero-def-pron">/är-ˈkā-nəm/ &nbsp;<i>pl.</i> arcana</span>
          </p>
          <p className="hero-def-sense">
            <em>n.</em> Hidden knowledge: specialized information known only to a few.
          </p>
        </aside>
      </div>
    </section>
  );
}
