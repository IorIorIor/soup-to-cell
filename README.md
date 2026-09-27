# From Soup to Cell

A mobile-first 3D journey from a warm chemical soup to a living minimal cell, in nine chapters (0–8).
Full plan: [`docs/build-plan.md`](docs/build-plan.md).

## Status

**Milestone 1: Foundation.** Placeholder geometry only.

- Chapter director: 9 chapters from JSON, chapter menu, prev/next, `#/n` deep links, guided prompts.
- One sim store (zustand) with a fixed 10 Hz tick, play/pause and 0.25×–8× speed.
- Undo (a slider drag counts as one step) and reset.
- Learn cards from `src/content/cards/*.json`, validated with zod. Each has three depths and a status badge. The build fails on bad content.
- Always-on scale ruler that ticks over in log space during the 2 s chapter zoom.
- Consequence captions, environment sliders, and an "Objects in this scene" list for keyboard and screen readers.
- Chapter 0 has a real rule model (energy makes building blocks, too much breaks them). The other chapters use static placeholders.

## Develop

```sh
npm install
npm run dev          # local dev server
npm test             # vitest: sim rules + content validation
npm run build        # content check, typecheck, production build
npm run test:e2e     # Playwright smoke tests on a phone viewport (needs a build)
```

If Playwright can't download its own browser, point it at an installed one with `PW_CHROMIUM_PATH=/path/to/chromium`.

## Layout

```
src/
  app/        shell, styles
  director/   chapter menu, routing, guidance
  sim/        clock, store, pure chapter rules (sim/chapters/*)
  scene/      R3F stage, placeholder clusters, palette
  ui/         learn card, time bar, ruler, sliders, captions
  content/    cards/*.json, chapters/*.json, zod schemas
tests/        unit/ (sim), content/ (schema), e2e/ (Playwright)
```

Card copy still needs a subject-matter review before launch.
