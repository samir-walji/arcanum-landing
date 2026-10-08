# Archived: unused sections

Not imported anywhere, so not bundled. `Definition.tsx` was a standalone dictionary section (now part of the footer). `Contact.tsx` was the "Start with your hardest agent" section.

`TitleMorph.tsx` scrolled the hero headline up into the header (used when the headline read "Arcanum"). Restore by rendering it in App.tsx after <Nav />; its CSS was removed from styles.css.

- `ThemeToggle.tsx`: the light/dark switch. The site is now dark-only, with the
  "Evals and model systems" section set to light via `data-theme="light"`. To
  bring the switch back, move this to `src/components/`, render it in the footer,
  and restore the pre-paint script in `index.html` that reads `arcanum-theme`.
