import { useEffect } from "react";
import { Dither, FlowField, InkFlow, Shader, SimplexNoise, Twirl, isWebGPUSupported } from "shaders/react";
import type { Theme } from "../theme";

// Other effects explored for this hero live in ./hero-archive/HeroVariants.tsx (not bundled).

/** Ink colors per theme. Deeper tones on white so the grain keeps its weight. */
const PALETTE: Record<Theme, { red: string; purple: string; purpleOpacity: number }> = {
  dark: { red: "#e02a3f", purple: "#6527b8", purpleOpacity: 1 },
  light: { red: "#b3172d", purple: "#8b2cf0", purpleOpacity: 0.5 },
};

// Greyscale ramp: brightness becomes grain density. Most of the field turns to grain.
const DENSE_STOPS = [
  { color: "#000000", position: 0 },
  { color: "#000000", position: 0.22 },
  { color: "#6a6a6a", position: 0.48 },
  { color: "#d0d0d0", position: 0.72 },
  { color: "#ffffff", position: 1 },
];


// Light mode uses a heavier ramp: on white, sparse grain reads as pastel, so more of the
// field is filled in to carry the full color.
const LIGHT_STOPS = [
  { color: "#000000", position: 0 },
  { color: "#000000", position: 0.14 },
  { color: "#909090", position: 0.36 },
  { color: "#ececec", position: 0.6 },
  { color: "#ffffff", position: 1 },
];

/**
 * How the cursor affects the hero.
 * - "subtle" (default): the grain field barely shifts toward the cursor, and a thin red wisp
 *   follows the pointer.
 * - "strong": the field winds around the cursor and the cursor pours ink. Open the page with
 *   ?hero=strong to compare.
 */
type CursorStyle = "subtle" | "strong";
const cursorStyle: CursorStyle = new URLSearchParams(window.location.search).get("hero") === "strong" ? "strong" : "subtle";

const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

/** Cursor-driven point that eases toward the pointer. Rests at (originX, originY). */
const follow = (originX: number, originY: number, reach: number) =>
  ({ type: "mouse-position", smoothing: 0.9, reach, originX, originY }) as never;

/** Oscillates a prop between two values on its own. */
const oscillate = (outputMin: number, outputMax: number, speed: number) =>
  ({ type: "auto-animate", mode: "ping-pong", outputMin, outputMax, speed: speed * motion, easing: "sine" }) as never;

interface GrainProps {
  /** How far the twist point travels toward the cursor (0 = fixed in place). */
  reach: number;
  color: string;
  /** How strongly this layer shows (0-1). The purple accent sits below full strength. */
  opacity?: number;
  /** Greyscale ramp that sets grain density. */
  stops: typeof DENSE_STOPS;
  movement: "churn" | "spin";
  seed: number;
}

/**
 * Drifting noise drawn as dense pixel grain. "churn" boils the field in place; "spin" winds
 * it into a swirl around the cursor and back out again.
 */
function Grain({ color, reach, opacity = 1, stops, movement, seed }: GrainProps) {
  const churn = movement === "churn";
  return (
    <Dither
      pattern="blueNoise"
      pixelSize={2}
      threshold={0.5}
      colorMode="custom"
      colorA="transparent"
      colorB={color}
      opacity={opacity}
    >
      <Twirl center={follow(0.6, 0.5, reach)} intensity={churn ? 0.8 : oscillate(-2.4, 2.4, 0.04)}>
        <FlowField strength={0.16} detail={0.7} evolutionSpeed={(churn ? 0.7 : 0.25) * motion} seed={seed + 1}>
          <SimplexNoise
            scale={1.2}
            contrast={0.9}
            balance={0.5}
            seed={seed}
            speed={(churn ? 0.45 : 0.18) * motion}
            stops={stops}
          />
        </FlowField>
      </Twirl>
    </Dither>
  );
}

/** A thin red wisp of grain that trails the pointer and fades quickly. */
function Wisp({ color }: { color: string }) {
  return (
    <Dither pattern="blueNoise" pixelSize={2} threshold={0.5} colorMode="custom" colorA="transparent" colorB={color}>
      <InkFlow colorMode="solid" color="#ffffff" radius={0.07} force={0.9} curl={0.6} decay={0.5} momentum={0.85} />
    </Dither>
  );
}

/** Ink poured by the cursor: it curls, spreads and fades, drawn as grain. */
function InkTrail({ color }: { color: string }) {
  return (
    <Dither pattern="blueNoise" pixelSize={2} threshold={0.5} colorMode="custom" colorA="transparent" colorB={color}>
      <InkFlow colorMode="solid" color="#ffffff" radius={0.22} force={2} curl={1.2} decay={0.25} momentum={0.9} />
    </Dither>
  );
}

/** How long the eased cursor drivers take to settle on the seeded position. */
const SETTLE_MS = 450;
let revealTimer = 0;

/** Pretend the pointer is resting just right of center in the hero. */
function seedCursor() {
  const art = document.querySelector(".hero-art")?.getBoundingClientRect();
  if (!art) return;
  window.dispatchEvent(
    new MouseEvent("mousemove", {
      clientX: art.left + art.width * 0.6,
      clientY: art.top + art.height * 0.5,
    }),
  );
}

interface HeroShaderProps {
  theme: Theme;
  onLive: (live: boolean) => void;
}

/**
 * Dark purple grain churning underneath red grain that winds around the cursor.
 * Loaded lazily from Hero so the page shell paints before the shader engine arrives.
 */
export default function HeroShader({ theme, onLive }: HeroShaderProps) {
  // The cursor-driven twist points have no position until the first mouse move, so the field
  // first renders around a default point and then eases over to where it should rest. Seed a
  // resting position as early as possible, and keep the canvas hidden until it has settled.
  useEffect(() => {
    seedCursor();
    return () => window.clearTimeout(revealTimer);
  }, [theme]);

  const handleReady = () => {
    seedCursor();
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => onLive(true), SETTLE_MS);
  };

  if (!isWebGPUSupported()) return null;

  const { red, purple, purpleOpacity } = PALETTE[theme];
  const stops = theme === "light" ? LIGHT_STOPS : DENSE_STOPS;
  const strong = cursorStyle === "strong";

  return (
    <Shader
      key={theme}
      className="hero-canvas"
      disableTelemetry
      onReady={handleReady}
      onUnavailable={() => onLive(false)}
    >
      <Grain
        color={purple}
        reach={strong ? 0.6 : 0}
        opacity={purpleOpacity}
        stops={stops}
        movement="churn"
        seed={31}
      />
      <Grain color={red} reach={strong ? 0.6 : 0.1} stops={stops} movement="spin" seed={12} />
      {strong ? <InkTrail color={red} /> : <Wisp color={red} />}
    </Shader>
  );
}
