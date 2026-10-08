import { useEffect, useRef } from "react";

/**
 * Makes the hero's "Arcanum" become the header's "Arcanum".
 *
 * A fixed copy of the headline sits exactly over the real one. As the page scrolls, it rises
 * with the page at full size, then over the last stretch scales down into the header's brand
 * slot while the header fades in around it. Scrolling back up plays it in reverse. The real
 * headline stays in the document (for screen readers and search) but is drawn transparent.
 * With reduced motion, the copy is not used and the header simply appears past the headline.
 */
/** Fraction of the journey after which the headline starts shrinking (0.8 = last 20%). */
const SHRINK_FROM = 0.8;

export default function TitleMorph() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const title = document.getElementById("hero-title");
    const nav = document.querySelector<HTMLElement>(".nav");
    const brand = nav?.querySelector<HTMLElement>(".brand");
    const copy = ref.current;
    if (!title || !nav || !brand || !copy) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) document.documentElement.classList.add("title-morph");

    let geo = { startLeft: 0, docTop: 0, scale: 1, endTop: 0, endLeft: 0 };

    const measure = () => {
      const r = title.getBoundingClientRect();
      const t = getComputedStyle(title);
      copy.style.fontSize = t.fontSize;
      copy.style.fontWeight = t.fontWeight;
      copy.style.letterSpacing = t.letterSpacing;
      copy.style.lineHeight = t.lineHeight;
      const scale = parseFloat(getComputedStyle(brand).fontSize) / parseFloat(t.fontSize);
      geo = {
        startLeft: r.left,
        docTop: r.top + window.scrollY,
        scale,
        endTop: nav.offsetHeight / 2 - (r.height * scale) / 2,
        endLeft: brand.getBoundingClientRect().left,
      };
    };

    const update = () => {
      const { startLeft, docTop, scale, endTop, endLeft } = geo;
      const travel = Math.max(1, docTop - endTop);
      const p = Math.min(1, Math.max(0, window.scrollY / travel));
      // Full size for most of the way; it only shrinks over the last stretch before landing.
      const q = Math.min(1, Math.max(0, (p - SHRINK_FROM) / (1 - SHRINK_FROM)));
      const ease = q * q * (3 - 2 * q);

      if (!reduce) {
        // Vertically it tracks the page exactly, so it reads as the headline itself moving.
        const y = Math.max(endTop, docTop - window.scrollY);
        const x = startLeft + (endLeft - startLeft) * ease;
        const s = 1 + (scale - 1) * ease;
        copy.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
        copy.style.opacity = "1";
      }

      // The header fades in over the last stretch of the journey.
      const navOpacity = reduce ? (p >= 1 ? 1 : 0) : Math.min(1, Math.max(0, (p - SHRINK_FROM) / (1 - SHRINK_FROM)));
      nav.style.opacity = String(navOpacity);
      const shown = p >= 1;
      nav.classList.toggle("shown", shown);
      nav.inert = !shown;
    };

    // Scroll events already arrive once per frame, so update directly; this keeps the headline
    // locked to the page with no one-frame lag.
    const onScroll = update;
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Fonts can change the headline's size once they load.
    document.fonts?.ready.then(onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("title-morph");
    };
  }, []);

  return (
    <span className="title-copy" aria-hidden="true" ref={ref}>
      Arcanum
    </span>
  );
}
