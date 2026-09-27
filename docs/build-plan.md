# From Soup to Cell — Interactive 3D Build Plan

Sep 27, 2026 · @Laurens van Schijndel

## Concept and goals

Build a mobile-first, browser-based 3D experience that takes the viewer from a warm chemical soup to a living minimal cell in eight chapters. Every object on screen can be tapped to learn what it is and how it works, and most can be added, removed or altered to see what breaks and what survives.

The core promise: **nothing is abstract**. Each concept (RNA, folding, membranes, the genetic code) appears first as a physical thing you can poke, then as a part inside the next, bigger thing.

**Goals**

- Make the chain *molecule → machine → bag of machines → living cell* graspable in about 15 minutes.
- Teach by cause and effect: remove the ribosomes and watch the cell starve, heat the soup and watch RNA unfold.
- Look beautiful enough to share: cinematic lighting, smooth scale transitions, a consistent visual language.
- Stay honest: label simplifications, and mark the parts of the story science hasn't solved yet.

**Audience**: curious adults with no biology background, on a phone first, desktop second. Plain language, no jargon without a tap-to-explain.

**Out of scope for v1**: accounts, saving, multiplayer, VR, real molecular dynamics, multicellular life.

## The journey: eight chapters

The experience is one continuous camera move from small to big. Each chapter ends when the viewer has built its key object, and that object shrinks into the next scene as a part. A chapter menu lets returning viewers jump anywhere; the last chapter is an open sandbox.

### 0. The soup

- **On screen**: a warm shallow pool near a volcanic vent. Zoom in until water molecules, dissolved salts and a scattering of building blocks drift in Brownian motion.
- **Tap**: water, a nucleotide, an amino acid, a fatty acid. Each card explains what it is and that these form on their own under early-Earth conditions.
- **Edit**: temperature, UV and mineral surfaces sliders. More energy produces more building blocks, but too much breaks them apart again.

### 1. Links: building an RNA strand

- **On screen**: four nucleotide types (A, U, G, C), each a distinct colour and shape, snapping onto a clay surface into a chain.
- **Tap**: the backbone, a base, the bond between them.
- **Edit**: drag nucleotides onto the chain to write your own sequence, up to about 40 letters.

### 2. Folding

- **On screen**: the strand from chapter 1 bends and zips into a hairpin as matching letters pair up (A with U, G with C).
- **Tap**: stem, loop, a base pair.
- **Edit**: change letters and watch the fold update live. Mismatched sequences flop around; complementary stretches snap together. Heat makes the fold melt.

### 3. RNA that works

- **On screen**: a hammerhead ribozyme folds, grabs a target strand and cuts it. Then a crude replicator copies a short strand letter by letter, occasionally making a mistake.
- **Tap**: the cutting site, the template, a copying error.
- **Edit**: raise or lower the error rate. Too low and nothing new appears; too high and the copies become junk. This is the first taste of evolution.

### 4. The bubble

- **On screen**: fatty acids drift together and self-assemble into a membrane sheet, then close into a vesicle.
- **Tap**: a fatty acid head and tail, the double layer, a pore.
- **Edit**: add lipids and the bubble grows; shake it and it splits into two. Add salt or remove lipids and it bursts.

### 5. The protocell

- **On screen**: several bubbles, each with RNA trapped inside. Bubbles whose RNA copies faster grow and divide faster, and slowly take over the pool.
- **Tap**: any protocell to see its RNA and growth rate.
- **Edit**: drop a mutant RNA into one bubble and watch whether its lineage wins or dies out. A small population chart shows the race.

### 6. The code

- **On screen**: a ribosome assembles from RNA pieces. An mRNA threads through; tRNAs carrying amino acids dock on matching codons; a protein chain grows and folds.
- **Tap**: ribosome, mRNA, tRNA, codon, amino acid, the finished protein.
- **Edit**: change a codon and see the wrong amino acid inserted, or add a stop codon early and get a stub that can't fold.

### 7. DNA: the archive

- **On screen**: the RNA message is stored in a double-stranded DNA loop. A polymerase copies a gene into mRNA, which feeds the ribosomes from chapter 6.
- **Tap**: double helix, gene, promoter (on/off switch), polymerase.
- **Edit**: switch genes on and off, or mutate one, and see which proteins stop appearing.

### 8. The minimal cell (sandbox)

- **On screen**: a complete minimal cell modelled on JCVI-syn3.0: membrane, DNA loop, a few hundred ribosomes, crowded proteins, nutrient gates and an energy system. It runs the loop eat, grow, copy, split.
- **Tap**: everything, at every zoom level.
- **Edit**: add or remove any component class, change the environment, knock out genes, and watch the cell thrive, stall or die. A vital-signs panel shows energy, protein count, size and time to division.

## Interaction model

One consistent grammar across all chapters: **tap to learn, drag to build, slide to change the world, scrub to change time**. Everything must work one-thumbed on a phone.

| Control | Gesture | What it does |
| --- | --- | --- |
| Inspect | Tap an object | Highlights it (others dim), camera eases toward it, opens a learn card |
| Learn card | Swipe up on card | Three depths: one line, how it works (short paragraph + mini animation), go deeper (numbers, history, open questions) |
| Orbit / zoom | Drag / pinch | Free camera within chapter bounds; double-tap resets |
| Toolbox | Tray at bottom | Components available in this chapter; drag in to add, drag out to the bin to remove |
| Alter | Long-press an object | Contextual edits: change a letter, mutate a gene, resize, toggle on/off |
| Environment | Slider drawer | Temperature, energy/UV, nutrients, salt; only the sliders a chapter needs |
| Time | Play, pause, speed (0.25× to 8×) | Simulation clock; slow motion for key moments like a cut or a division |
| Scale | Always-on ruler | Shows real size of what's on screen (nanometres to micrometres) with a familiar comparison |
| Undo / reset | Buttons top right | Undo the last edit; reset the chapter to its default state |

**Guided vs free**: each chapter opens guided (a short prompt such as "Drag four letters onto the clay") and unlocks free editing once the key object is built. Viewers can skip guidance at any time.

**Consequence feedback**: every edit produces a visible result within 2 seconds, plus a one-line caption explaining it ("No ribosomes: no new proteins. The cell will run down.").

## Simulation rules

The simulation is a rule-based model, not molecular dynamics. Visuals are driven by a small state model per chapter, updated on a fixed tick (10 per second), with animation interpolated between ticks. The rules must be simple enough to explain on a learn card, and every edit must map to one or more rules below.

**Core state (chapter 8)**: counts of lipids, ribosomes, tRNAs, mRNAs, enzymes, transport gates; an energy pool (ATP); membrane area; DNA (list of genes, each on/off and intact/mutated); environment (temperature, nutrients, salt).

**Core loop per tick**

1. Gates import nutrients in proportion to gate count and outside nutrients.
2. Enzymes turn nutrients into energy.
3. Genes that are on and intact produce mRNA; ribosomes plus tRNAs turn mRNA into proteins, spending energy.
4. New proteins add to the matching component class; new lipids add membrane area.
5. When membrane area and DNA copy are both complete, the cell divides.
6. Components decay slowly, so a cell that stops producing runs down.

| Edit | Immediate effect | Outcome |
| --- | --- | --- |
| Remove the membrane | Contents drift apart | Death: nothing concentrates, all reactions stop |
| Remove ribosomes | No new proteins | Slow run-down as existing proteins decay |
| Remove tRNAs | Ribosomes stall on mRNA | Same as above, visibly jammed ribosomes |
| Switch off a gene | Its protein stops appearing | Depends on gene: energy gene is fatal, others slow growth |
| Mutate a gene | Misfolded protein appears | Loss of that function; rare lucky mutation improves it |
| Cut nutrients | Energy pool drains | Growth stops; cell survives a while, then dies |
| Raise temperature | Faster reactions | Above a threshold, RNA and proteins unfold and the cell fails |
| Add salt | Water leaves the cell | Cell shrinks; high salt collapses it |
| Double ribosomes | Faster protein output | Faster growth until energy becomes the limit |

Earlier chapters use the same pattern with fewer variables: fold stability vs temperature (chapter 2), copying error rate vs survival (chapters 3 and 5), lipid supply vs vesicle growth (chapter 4).

## Visual, motion and sound direction

The look is **scientific illustration lit like cinema**: shapes are faithful to real molecular structures, but simplified, softly lit and colour-coded, in the tradition of David Goodsell's cell paintings rather than photoreal renders or cartoon icons.

**Colour language (fixed across all chapters)**

| Class | Colour | Why |
| --- | --- | --- |
| RNA | Warm coral | The protagonist; the eye should find it first |
| DNA | Deep indigo | Archive; calmer and more stable than RNA |
| Proteins | Teal to green range | Workers; varied tints per protein type |
| Lipids / membrane | Translucent amber, iridescent edge | Soap-bubble quality sells self-assembly |
| Energy (ATP) | Small bright gold sparks | Visible currency moving through the system |
| Water, salts | Near-invisible grey-blue haze | Present but never competing |

**Rendering**: dark, deep backgrounds with volumetric haze and depth of field to convey crowding; subsurface-like softness on molecules; a fresnel rim on membranes; bloom only on energy sparks and selected objects.

**Motion**: everything jitters slightly (Brownian motion) so nothing looks mechanical. Machines move with purpose against that noise. Scale transitions are continuous zooms of about 2 seconds with the scale ruler ticking over; no hard cuts.

**Selection**: tapped objects gain a thin light outline and the rest of the scene desaturates to about 40%.

**Typography and UI**: minimal glass panels over the scene, one sans-serif family, large touch targets (at least 44 px), captions near the action rather than in a fixed box.

**Sound (optional, off by default on mobile)**: an ambient drone that thickens as complexity grows; soft clicks for bonds, a low thump for division; one musical motif when life first "works" in chapter 5.

## Content model and honesty rules

All learn-card text lives in content files separate from code, so copy can be edited and reviewed without touching the 3D scene. Each tappable object type has one entry:

```json
{
  "id": "ribosome",
  "name": "Ribosome",
  "oneLine": "The machine that reads a gene's message and builds a protein.",
  "howItWorks": "Short paragraph, under 60 words.",
  "deeper": "Numbers, history, where the idea comes from.",
  "realSize": "about 25 nm",
  "sizeComparison": "a 4,000th the width of a hair",
  "status": "established",
  "simplification": "Real ribosomes have about 50 proteins; we show a few.",
  "miniAnimation": "ribosome-translate",
  "relatedIds": ["mrna", "trna", "codon"]
}
```

**Honesty rules**

- Every card carries a `status`: **established** (textbook fact), **likely** (leading hypothesis, such as the RNA world), or **open question** (not known). The status shows as a small badge on the card.
- Chapters 0 to 5 get a persistent, subtle note: "This part of the story is a best current hypothesis." Chapter 8 is based on a real synthetic cell and says so.
- Every visible simplification is named on its card (fewer molecules, sped-up time, colours are not real).
- Time is compressed: a caption shows real duration versus shown duration ("real division: about 3 hours").
- Card copy is plain language, sentences under 20 words, no term used before it has its own tappable card.

Content needs a subject-matter review pass before launch. Flag it as a dependency, not a task for the build.

## Tech architecture

A static, client-only web app: React plus react-three-fiber for the 3D scene, with a single simulation store as the source of truth. The scene and the UI both read from the store and write edits back to it; neither talks to the other directly.

&#91;embedded content: app architecture · 5 modules\]

The chapter director loads a chapter's content and initial state into the store; taps in the scene set the selection, which the UI turns into a learn card.

**Stack**

| Layer | Choice | Notes |
| --- | --- | --- |
| Build | Vite, React, TypeScript | Static output, deploy to Vercel or Netlify |
| 3D | three.js via react-three-fiber, @react-three/drei | Instancing, camera controls, adaptive resolution |
| Effects | @react-three/postprocessing | Depth of field, bloom, selective outline |
| State | zustand | One store per chapter; sim rules as pure TypeScript functions |
| Sim thread | Web Worker (chapter 8 only) | Keeps the main thread free for rendering |
| UI motion | Framer Motion | Cards, trays, drawers |
| Content | JSON validated with zod | Build fails on a missing or malformed card |
| Tests | Vitest for sim rules, Playwright smoke test per chapter | Every row of the cause-effect table gets a test |

**Performance targets**

- 60 fps on a 2021-era mid-range phone (iPhone 12, Pixel 6); never below 30 fps.
- Initial load under 3 MB; chapters lazy-loaded as the viewer approaches them.
- Instanced meshes for anything that repeats; level of detail swaps far molecules for simple sprites.
- Geometry generated procedurally where possible (strands, membranes, helices) instead of heavy models.
- Adaptive pixel ratio; respect `prefers-reduced-motion` by slowing jitter and replacing zooms with fades.

**Accessibility**: every tappable object also appears in an "Objects in this scene" list for keyboard and screen-reader users; all captions are real text; colours checked for colour-blind contrast, with shape as a second cue.

**Project structure**

```
src/
  app/            routing, chapter menu, shell
  director/       chapter steps, prompts, camera paths
  sim/            pure rule functions + store per chapter
  scene/          R3F components: molecules, membrane, cell
    shaders/      membrane fresnel, haze, selection outline
  ui/             learn card, toolbox, sliders, time bar, ruler
  content/        cards/*.json, chapters/*.json, schemas
  workers/        sim worker for chapter 8
tests/            vitest sim tests, playwright smoke tests
```

## Build order, acceptance and open questions

Build a vertical slice first, then widen. Each milestone ends with a deployable preview and a short demo video or GIF.

1. **Foundation**: project scaffold, store pattern, chapter director, learn-card system reading from JSON, time bar, scale ruler, undo/reset. Placeholder geometry only.
2. **Vertical slice (chapter 4, the bubble)**: full visual quality for one chapter: membrane shader, self-assembly, grow and split, tap-to-learn, lipid and salt edits. This chapter sets the look for everything else.
3. **RNA chapters (1 to 3)**: nucleotide snapping, live folding from an edited sequence (a simple base-pairing fold is enough), ribozyme cut, replicator with error-rate slider.
4. **Protocell and code (5 and 6)**: population race with chart; ribosome, tRNA and mRNA translation with codon edits.
5. **DNA and the minimal cell (7 and 8)**: gene switches, sim worker, full sandbox with the cause-effect table implemented and tested.
6. **Soup, polish and launch (0 and all)**: opening scene, transitions between every chapter, sound, accessibility pass, performance pass on real phones, content review.

**Acceptance criteria**

- [ ] A first-time viewer can go from chapter 0 to a dividing cell in about 15 minutes without help.
- [ ] Every visible object is tappable and has a learn card with a status badge.
- [ ] Every row in the cause-effect table is reproducible in chapter 8 and covered by a test.
- [ ] Every edit shows a visible result and a caption within 2 seconds.
- [ ] Performance targets met on the two reference phones.
- [ ] Works with no sound, with reduced motion, and by keyboard.

**Handoff note for Claude Code**: build strictly in milestone order, one milestone per branch. Keep simulation rules as pure functions with tests before wiring them to visuals. Ask before adding dependencies beyond the stack table.

**Open questions**

- [ ] Name and brand: working title "From Soup to Cell", or something else?
- [ ] Language: English only, or also Dutch at launch?
- [ ] Is there a narrator voice, or text captions only?
- [ ] Who does the scientific review of card content?
- [ ] Where will it be hosted, and is it a personal project or a Monks showcase piece?
