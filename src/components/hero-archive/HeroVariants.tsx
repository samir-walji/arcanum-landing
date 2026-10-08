/**
 * ARCHIVE: hero effects explored during the redesign, kept for later reference.
 *
 * Nothing imports this file, so it is not part of the bundle and costs nothing at runtime.
 * To bring one back, copy its component into ../HeroShader.tsx, or temporarily render
 * <HeroVariantsArchive variant="..." onLive={...} /> from Hero.tsx in place of <HeroShader />.
 * Variant ids are listed in HERO_VARIANTS below. The live hero is "dense-purple".
 */
import { useEffect, useState, type ReactNode } from "react";
import {
  CursorTrail,
  Dither,
  FlowField,
  InkFlow,
  Pixelate,
  RadialGradient,
  Shader,
  SimplexNoise,
  Twirl,
  isWebGPUSupported,
} from "shaders/react";

export const HERO_VARIANTS = [
  { id: "flow", label: "Flow" },
  { id: "flow-purple-haze", label: "Flow, purple haze" },
  { id: "noise-dither-moving", label: "Dithered, moving" },
  { id: "dense-churn", label: "Dense, churn" },
  { id: "dense-spin", label: "Dense, spin" },
  { id: "dense-tide", label: "Dense, tide" },
  { id: "dense-zoom", label: "Dense, zoom" },
  { id: "dense-purple", label: "Dense, red + purple" },
  { id: "pixels-moving", label: "Pixels, moving" },
  { id: "pixels", label: "Pixels" },
] as const;

export type HeroVariant = (typeof HERO_VARIANTS)[number]["id"];

const RED = "#e02a3f";
const RED_DEEP = "#8e1b2f";
const PURPLE = "#3a1366";
const PURPLE_DEEP = "#2a0d4a";

// A narrow dark band on white. Dithered, the band becomes a ring of red pixel ink.
const RING_STOPS = [
  { color: "#ffffff", position: 0 },
  { color: "#ffffff", position: 0.46 },
  { color: "#000000", position: 0.62 },
  { color: "#ffffff", position: 0.8 },
  { color: "#ffffff", position: 1 },
];

// Noise blobs: mostly empty, rising to bright red at the peaks.
const BLOB_STOPS = [
  { color: "#060506", position: 0 },
  { color: "#060506", position: 0.36 },
  { color: "#2b0b12", position: 0.5 },
  { color: "#8e1b2f", position: 0.82 },
  { color: "#e02a3f", position: 1 },
];

const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

/** Cursor-driven point that eases toward the pointer. Rests at (originX, originY). */
const follow = (originX: number, originY: number, reach: number) =>
  ({ type: "mouse-position", smoothing: 0.9, reach, originX, originY }) as never;

interface InkProps {
  color: string;
  pixel?: number;
  pattern?: string;
  children: ReactNode;
}

/** Turns whatever is dark in its children into red pixel ink (white becomes transparent). */
function Ink({ color, pixel = 2, pattern = "blueNoise", children }: InkProps) {
  return (
    <Dither pattern={pattern} pixelSize={pixel} threshold={0.5} colorMode="custom" colorA={color} colorB="transparent">
      {children}
    </Dither>
  );
}

interface SwirlProps {
  aspect: number;
  pixel?: number;
  pattern?: string;
  /** Outer and inner ring colors. */
  colors?: readonly [string, string];
}

/** Two stippled rings stretched across the hero, twisted toward the cursor. */
function Swirl({ aspect, pixel, pattern, colors = [RED_DEEP, RED] }: SwirlProps) {
  const rings = [
    { color: colors[0], x: 0.5, radius: 0.85, twist: 1.8, reach: 0.3, seed: 9 },
    { color: colors[1], x: 0.58, radius: 0.6, twist: -2.2, reach: 0.2, seed: 3 },
  ];
  return (
    <>
      {rings.map((r) => (
        <Ink key={r.seed} color={r.color} pixel={pixel} pattern={pattern}>
          <Twirl center={follow(r.x, 0.5, r.reach)} intensity={r.twist}>
            <FlowField strength={0.06} detail={0.9} evolutionSpeed={0.08 * motion} seed={r.seed}>
              <RadialGradient center={{ x: r.x, y: 0.5 }} radius={r.radius} aspect={aspect} stops={RING_STOPS} />
            </FlowField>
          </Twirl>
        </Ink>
      ))}
    </>
  );
}

/** A wide, slow ring of deep purple stipple sitting behind the red swirl. */
function PurpleHaze({ aspect }: { aspect: number }) {
  return (
    <Ink color={PURPLE_DEEP}>
      <Twirl center={follow(0.4, 0.55, 0.15)} intensity={1.2}>
        <FlowField strength={0.08} detail={0.8} evolutionSpeed={0.05 * motion} seed={21}>
          <RadialGradient
            center={{ x: 0.4, y: 0.55 }}
            radius={1.1}
            aspect={aspect}
            stops={[
              { color: "#ffffff", position: 0 },
              { color: "#ffffff", position: 0.3 },
              { color: "#202020", position: 0.62 },
              { color: "#ffffff", position: 0.95 },
              { color: "#ffffff", position: 1 },
            ]}
          />
        </FlowField>
      </Twirl>
    </Ink>
  );
}

/** Ink poured by the cursor: it curls, spreads and fades, drawn as stipple. */
function InkTrail({ pixel = 2, color = RED }: { pixel?: number; color?: string }) {
  return (
    <Dither pattern="blueNoise" pixelSize={pixel} threshold={0.5} colorMode="custom" colorA="transparent" colorB={color}>
      <InkFlow colorMode="solid" color="#ffffff" radius={0.22} force={2} curl={1.2} decay={0.25} momentum={0.9} />
    </Dither>
  );
}

/** Bright square cells scattering along the cursor's path. */
function CellTrail({ cells }: { cells: number }) {
  return (
    <Pixelate scale={cells} gap={0.18} roundness={0}>
      <CursorTrail colorA="#ff5a6a" colorB="#8e1b2f" radius={0.5} length={1.2} shrink={0.3} softness={1} />
    </Pixelate>
  );
}

// The same blobs in greyscale, for dithering: brightness becomes stipple density.
const BLOB_GREY_STOPS = [
  { color: "#000000", position: 0 },
  { color: "#000000", position: 0.4 },
  { color: "#5a5a5a", position: 0.62 },
  { color: "#ffffff", position: 1 },
];

/**
 * Noise blobs, in red or in greyscale for dithering. With `moving`, the field is churned by a
 * flow field and drifts quickly, and the blobs swirl gently around the cursor.
 */
function Blobs({ grey = false, moving = false }: { grey?: boolean; moving?: boolean }) {
  const noise = (
    <SimplexNoise
      scale={1.1}
      contrast={0.9}
      balance={0.5}
      seed={12}
      speed={(moving ? 0.4 : 0.03) * motion}
      stops={grey ? BLOB_GREY_STOPS : BLOB_STOPS}
    />
  );
  if (!moving) return noise;
  return (
    <Twirl center={follow(0.6, 0.5, 0.6)} intensity={0.8}>
      <FlowField strength={0.18} detail={0.7} evolutionSpeed={0.6 * motion} seed={4}>
        {noise}
      </FlowField>
    </Twirl>
  );
}

// Denser greyscale ramp: more of the field turns to grain, like the Flow rings.
const DENSE_STOPS = [
  { color: "#000000", position: 0 },
  { color: "#000000", position: 0.22 },
  { color: "#6a6a6a", position: 0.48 },
  { color: "#d0d0d0", position: 0.72 },
  { color: "#ffffff", position: 1 },
];

const anim = (outputMin: number, outputMax: number, speed: number) =>
  ({ type: "auto-animate", mode: "ping-pong", outputMin, outputMax, speed: speed * motion, easing: "sine" }) as never;

type Movement = "churn" | "spin" | "tide" | "zoom";

interface DenseGrainProps {
  movement: Movement;
  color?: string;
  seed?: number;
}

/**
 * Dense red grain over drifting noise. Each movement type moves the field differently:
 * churn boils it in place, spin winds and unwinds it around the cursor, tide makes the
 * distortion swell and ebb, zoom breathes the blobs larger and smaller.
 */
function DenseGrain({ movement, color = RED, seed = 12 }: DenseGrainProps) {
  const noise = (
    <SimplexNoise
      scale={movement === "zoom" ? anim(0.7, 1.7, 0.05) : 1.2}
      contrast={0.9}
      balance={0.5}
      seed={seed}
      speed={(movement === "churn" ? 0.45 : 0.18) * motion}
      stops={DENSE_STOPS}
    />
  );
  const flow = (
    <FlowField
      strength={movement === "tide" ? anim(0.04, 0.4, 0.06) : 0.16}
      detail={0.7}
      evolutionSpeed={(movement === "churn" ? 0.7 : 0.25) * motion}
      seed={seed + 1}
    >
      {noise}
    </FlowField>
  );
  return (
    <Dither pattern="blueNoise" pixelSize={2} threshold={0.5} colorMode="custom" colorA="transparent" colorB={color}>
      <Twirl
        center={follow(0.6, 0.5, 0.6)}
        intensity={movement === "spin" ? anim(-2.4, 2.4, 0.04) : 0.8}
      >
        {flow}
      </Twirl>
    </Dither>
  );
}

interface HeroShaderProps {
  variant: HeroVariant;
  onLive: (live: boolean) => void;
}

/** Loaded lazily from Hero so the page shell paints before the shader engine arrives. */
export default function HeroVariantsArchive({ variant, onLive }: HeroShaderProps) {
  const [aspect, setAspect] = useState(1.8);
  // Pixelate counts cells across the canvas, so derive it from the width to keep cells ~10px.
  const [cells, setCells] = useState(120);

  useEffect(() => {
    const art = document.querySelector(".hero-art");
    if (!art) return;
    const measure = () => {
      const r = art.getBoundingClientRect();
      if (r.width && r.height) {
        setAspect(r.width / r.height);
        setCells(Math.max(40, Math.round(r.width / 10)));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(art);
    return () => ro.disconnect();
  }, []);

  // The cursor drivers have no position until the first mouse move, so seed one
  // where the swirl should rest.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const art = document.querySelector(".hero-art")?.getBoundingClientRect();
      if (!art) return;
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: art.left + art.width * 0.6,
          clientY: art.top + art.height * 0.5,
        }),
      );
    }, 300);
    return () => window.clearTimeout(t);
  }, [variant]);

  if (!isWebGPUSupported()) return null;

  return (
    <Shader
      key={variant}
      className="hero-canvas"
      disableTelemetry
      onReady={() => onLive(true)}
      onUnavailable={() => onLive(false)}
    >
      {variant === "flow" && (
        <>
          <Swirl aspect={aspect} />
          <InkTrail />
        </>
      )}
      {variant === "flow-purple-haze" && (
        <>
          <PurpleHaze aspect={aspect} />
          <Swirl aspect={aspect} />
          <InkTrail />
        </>
      )}
      {variant === "noise-dither-moving" && (
        <>
          <Dither pattern="blueNoise" pixelSize={2} threshold={0.5} colorMode="custom" colorA="transparent" colorB={RED}>
            <Blobs grey moving />
          </Dither>
          <InkTrail />
        </>
      )}
      {variant === "dense-churn" && <DenseGrain movement="churn" />}
      {variant === "dense-spin" && <DenseGrain movement="spin" />}
      {variant === "dense-tide" && <DenseGrain movement="tide" />}
      {variant === "dense-zoom" && <DenseGrain movement="zoom" />}
      {variant === "dense-purple" && (
        <>
          <DenseGrain movement="churn" color={PURPLE} seed={31} />
          <DenseGrain movement="spin" />
        </>
      )}
      {variant.startsWith("dense") && <InkTrail />}
      {variant === "pixels-moving" && (
        <>
          <Pixelate scale={cells} gap={0.18} roundness={0}>
            <Blobs moving />
          </Pixelate>
          <CellTrail cells={cells} />
        </>
      )}
      {variant === "pixels" && (
        <>
          <Pixelate scale={cells} gap={0.18} roundness={0}>
            <Blobs />
          </Pixelate>
          <CellTrail cells={cells} />
        </>
      )}
    </Shader>
  );
}
