# Working on From Soup to Cell

The plan is in `docs/build-plan.md` and it is the source of truth.

## Rules from the plan
- Build in milestone order, one milestone per branch.
- Sim rules are pure functions in `src/sim/chapters/`. Write and test them before wiring visuals.
- Every row of the cause–effect table gets a Vitest test.
- All learn-card copy goes in `src/content/cards/*.json`, never in code. Sentences stay under 20 words (a test enforces this). Every card has a `status`.
- Ask before adding dependencies beyond the stack table.
- Colours come from `src/scene/palette.ts` only. Shape is always the second cue.

## Working style (borrowed from Ryan Sael's one-run builds)
- Give each chapter a tight creative brief before building it: the single idea it teaches, the one interaction that proves it, and the look.
- Reuse what already works. Before a new chapter, read the finished ones (chapter 4 sets the look) and match their patterns.
- Explanatory text sits next to the control it explains, so every slider tells you what it just did.
- Check the result on a phone viewport with screenshots, not only with tests.

## Before pushing
`npm test && npm run build && npm run test:e2e`
