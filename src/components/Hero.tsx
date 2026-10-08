import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { TAGLINE_LINES } from "../config";
import { useTheme } from "../theme";

const HeroShader = lazy(() => import("./HeroShader"));

/**
 * Headline style. By default it is white with a red dithered patch that follows the pointer.
 * ?title=red makes it dithered red throughout; ?title=white keeps it plain white.
 */
const TITLE_MODE = new URLSearchParams(window.location.search).get("title");
const TITLE_RED = TITLE_MODE === "red";
const TITLE_HOVER = TITLE_MODE !== "red" && TITLE_MODE !== "white";

/** How long the red lingers behind the pointer, in ms. */
const LINGER_MS = 2000;
const SPOT = "circle 55px";

/**
 * Drives the hover headline: a red spot follows the pointer and leaves a trail that
 * fades out slowly, so sweeping across the word keeps it red for a moment. The result is
 * written to --mask on the headline as a stack of radial gradients.
 */
function useTitleSpot(ref: React.RefObject<HTMLHeadingElement>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !window.matchMedia("(hover: hover)").matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let o = 0;
    let target = 0;
    let raf = 0;
    let trail: { x: number; y: number; t: number }[] = [];
    const gradient = (px: number, py: number, a: number) =>
      `radial-gradient(${SPOT} at ${px.toFixed(1)}px ${py.toFixed(1)}px, rgba(0,0,0,${a.toFixed(3)}) 0%, rgba(0,0,0,${a.toFixed(3)}) 40%, transparent 100%)`;
    const tick = (now: number) => {
      // The spot sits right on the pointer; the trail behind it is what gives the softness.
      x = tx;
      y = ty;
      o += (target - o) * (target > o ? 0.35 : 0.03);
      const last = trail[trail.length - 1];
      if (o > 0.05 && (!last || Math.hypot(last.x - x, last.y - y) > 5)) {
        trail.push({ x, y, t: now });
      }
      trail = trail.filter((p) => now - p.t < LINGER_MS).slice(-60);
      const layers = trail.map((p) => gradient(p.x, p.y, (1 - (now - p.t) / LINGER_MS) ** 1.5));
      if (o > 0.005) layers.unshift(gradient(x, y, o));
      if (layers.length) el.style.setProperty("--mask", layers.join(","));
      else el.style.removeProperty("--mask");
      const settled =
        !layers.length || (!trail.length && Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5 && Math.abs(target - o) < 0.005);
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const place = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const enter = (e: PointerEvent) => {
      place(e);
      x = tx;
      y = ty;
      target = 1;
      kick();
    };
    const move = (e: PointerEvent) => {
      place(e);
      kick();
    };
    const leave = () => {
      target = 0;
      kick();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, enabled]);
}

export default function Hero() {
  // "loading": plain background while the shader starts (no placeholder shape that would
  // then change). "fallback": the static CSS glow, only when WebGPU is unavailable.
  const [art, setArt] = useState<"loading" | "live" | "fallback">(() =>
    "gpu" in navigator ? "loading" : "fallback",
  );
  const theme = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  useTitleSpot(titleRef, TITLE_HOVER);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className={`hero-art ${art}`} aria-hidden="true">
        <Suspense fallback={null}>
          <HeroShader theme={theme} onLive={(ok) => setArt(ok ? "live" : "fallback")} />
        </Suspense>
      </div>
      <div className="wrap hero-inner">
        <h1
          id="hero-title"
          ref={titleRef}
          className={TITLE_RED ? "title-red" : TITLE_HOVER ? "title-hover" : undefined}
          data-text="Arcanum"
        >
          <span className="title-base">Arcanum</span>
        </h1>
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
