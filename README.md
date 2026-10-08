# Arcanum site

Marketing site for Arcanum. Vite, React and TypeScript, with WebGPU effects from [`shaders`](https://github.com/shader-effects-inc/shaders).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

The effects need WebGPU (current Chrome, Edge and Safari). Browsers without it get a static CSS glow in the same colors.

## Where things live

| What | Where |
| --- | --- |
| Contact email and the tagline | `src/config.ts` |
| Archived case-study section (not bundled) | `src/archive/results/` |
| Hero shader (red and purple grain) | `src/components/HeroShader.tsx` |
| Other hero effects explored (not bundled) | `src/components/hero-archive/HeroVariants.tsx` |
| Light/dark mode | `src/theme.ts`, `src/components/ThemeToggle.tsx`, light tokens in `src/styles.css` |
| Colors, type scale, layout | `src/styles.css` (tokens at the top) |
| Logo mark | `src/components/Logo.tsx` and `public/favicon.svg` |

## Before launch

- Set the real inbox in `src/config.ts` (`CONTACT_EMAIL` is a placeholder).
- The `shaders` package is pinned to an exact version so the effect parameters render the same way every time.
