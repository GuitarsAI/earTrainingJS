# Sound Travels Ear Trainer — File Split Plan

## Goal

Move from a single monolithic HTML file (~6,500 lines) to a professional,
maintainable multi-file structure. The app stays **serverless and static** —
no build step, no bundler, no Node.js required. Everything is plain HTML, CSS,
and vanilla JS loaded via `<script>` and `<link>` tags. GitHub Pages hosts it
as-is.

---

## Guiding principles

1. **No bundler** — files load in order via `<script src="...">` tags. Later
   files can reference anything declared in earlier ones.
2. **One responsibility per file** — data, engine, UI, and mode logic are
   separated. A bug in progression playback lives in one place.
3. **Dependency order is explicit** — the load order in `index.html` is the
   dependency graph. Nothing is implicit.
4. **Patch files become obsolete** — each module is small enough to edit
   directly. No more surgical patches on a 6,500-line file.
5. **GitHub Pages compatible** — flat directory or simple folder structure,
   no server-side routing needed.

---

## Proposed directory structure

```
/
├── index.html                  ← shell only: loads all CSS + JS in order
│
├── css/
│   ├── base.css                ← CSS variables, reset, typography
│   ├── layout.css              ← sticky header, mode tabs, panels, grid
│   ├── components.css          ← chips, buttons, score bar, breakdown rows
│   ├── notation.css            ← notation card, stave wrapper, VexFlow overrides
│   └── theme.css               ← dark/light mode vars, toggle button
│
├── js/
│   ├── data/
│   │   ├── spelling.js         ← enharmonic engine: spelledNote, spelledRoot,
│   │   │                         midiToVexKeySpelled, vexAccidental, pcInterval,
│   │   │                         LETTER_PCS, LETTER_NAMES, SEMITONES_TO_LETTER_STEPS,
│   │   │                         TRITONE_AS_D5, EIGHT_AS_A5, NINE_AS_D7
│   │   │
│   │   ├── keysig.js           ← key signature helpers: vexKeyMajor, vexKeyMinor,
│   │   │                         keySigCoveredLetters, isCoveredByKeySig,
│   │   │                         respellForKeySig, keySigCoveredPcs,
│   │   │                         keySigAccidentalCount, VEX_KEY_MAJOR_*, etc.
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── chords.js           ← CHORD_TYPES, CHORD_PLAYBACK_STYLES,
│   │   │                         VOICING_MODES, applyVoicingMode,
│   │   │                         resolveVoicingMode, INV_LABELS,
│   │   │                         applyInversion, buildInversionPool, getAllChords
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── intervals.js        ← INTERVALS, INTERVAL_STYLES,
│   │   │                         INTERVAL_CONSONANCE, INTERVAL_CONTEXT,
│   │   │                         INTERVAL_INVERSION_NAME, INTERVAL_INVERSION_SEMITONES,
│   │   │                         SEMITONE_TO_NUMERAL, SEMITONE_TO_ROMAN,
│   │   │                         intervalAbbr, semitoneToDegree, tritoneLabel
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── scales.js           ← SCALES, SCALE_DIRECTIONS, SCALE_REF,
│   │   │                         getChordScales, getScaleParentKeyStr,
│   │   │                         computeDegreeNumerals, buildTriadMap,
│   │   │                         getModalCharacter
│   │   │                         Depends on: spelling.js, intervals.js
│   │   │
│   │   └── progressions.js     ← PROGRESSIONS, PROG_DEGREES, PROG_QUALITIES,
│   │                             PROG_GROUPS, PROG_GROUP_COLLAPSED,
│   │                             selectedProgressions, progChordMidi,
│   │                             HARMONIC_FUNCTION, progFunctionNote,
│   │                             qualityFullName
│   │                             Depends on: chords.js
│   │
│   ├── engine/
│   │   ├── state.js            ← all global let/const state variables:
│   │   │                         piano, audioCtx, answered, appMode,
│   │   │                         correct/total/streak, currentChord,
│   │   │                         currentMidiNotes, currentMode,
│   │   │                         currentInterval, currentScale,
│   │   │                         currentProgression, all keySigMode vars,
│   │   │                         selectedChords, selectedIntervals,
│   │   │                         selectedScales, sessionStats,
│   │   │                         pinnedRoot, pinnedOctave, etc.
│   │   │                         Depends on: chords.js, intervals.js, scales.js
│   │   │
│   │   ├── audio.js            ← piano init, playChord, playInterval,
│   │   │                         playScale, playProgression,
│   │   │                         playProgressionSlowly, midiToSoundFontName,
│   │   │                         resolveVoicingMode (audio side)
│   │   │                         Depends on: state.js, chords.js, progressions.js
│   │   │
│   │   └── notation.js         ← all VexFlow rendering:
│   │                             showNotation, hideNotation,
│   │                             renderPolyNotation, showProgressionNotation,
│   │                             nameChordFromIntervals,
│   │                             all respell/keySig wiring per mode
│   │                             Depends on: state.js, spelling.js, keysig.js,
│   │                                         chords.js, scales.js
│   │
│   ├── breakdown/
│   │   ├── breakdown.js        ← showBreakdown, hideBreakdown, makeBDRow,
│   │   │                         joinSep, addDivider, makeChordScalesRow,
│   │   │                         makeVoiceLeadingRow
│   │   │                         Depends on: state.js, spelling.js, intervals.js,
│   │   │                                     scales.js, chords.js
│   │   │
│   │   ├── breakdown-chords.js ← chord breakdown branch (slash, poly, UST,
│   │   │                         normal chords, inversions, theory rows)
│   │   │                         Depends on: breakdown.js, chords.js, state.js
│   │   │
│   │   ├── breakdown-intervals.js ← interval breakdown branch
│   │   │                         Depends on: breakdown.js, intervals.js, state.js
│   │   │
│   │   ├── breakdown-scales.js ← scale breakdown branch
│   │   │                         Depends on: breakdown.js, scales.js, state.js
│   │   │
│   │   └── breakdown-progressions.js ← progressions breakdown branch (BUG-6 fix)
│   │                         Depends on: breakdown.js, progressions.js, state.js
│   │
│   ├── ui/
│   │   ├── pool.js             ← renderPoolPanel, makePoolPanelShell,
│   │   │                         makeSection, makeSectionWithDisplayName,
│   │   │                         renderChordPoolPanel, renderIntervalPoolPanel,
│   │   │                         renderScalePoolPanel, renderProgressionPoolPanel,
│   │   │                         renderDictProgressionPoolPanel, makeProgSection,
│   │   │                         makeDictProgSection, makeCollapsible
│   │   │                         Depends on: state.js, chords.js, intervals.js,
│   │   │                                     scales.js, progressions.js
│   │   │
│   │   ├── chips.js            ← renderVoicingChips, renderChordStyleChips,
│   │   │                         renderIntervalStyleChips, renderScaleDirChips,
│   │   │                         renderRegisterPanel, renderInversionChips
│   │   │                         Depends on: state.js, pool.js
│   │   │
│   │   ├── stats.js            ← renderStats, updateRootBadge, updateScore,
│   │   │                         recordAnswer, updateStatsTable, resetSession
│   │   │                         Depends on: state.js
│   │   │
│   │   └── controls.js         ← renderAnswers, renderControls,
│   │                             revealDropdownAnswer, renderProgressionAnswerUI,
│   │                             updateSubmitBtn, setKeySig
│   │                             Depends on: state.js, chords.js
│   │
│   ├── modes/
│   │   ├── chords-mode.js      ← generateChordQuestion, submitChordAnswer,
│   │   │                         recomputeCurrentNotes (chords branch),
│   │   │                         chooseRootMidi, chooseSimpleRootMidi,
│   │   │                         pickRandom, resolveOctaveBand
│   │   │                         Depends on: state.js, audio.js, notation.js,
│   │   │                                     breakdown.js, chords.js
│   │   │
│   │   ├── intervals-mode.js   ← generateIntervalQuestion, submitIntervalAnswer,
│   │   │                         recomputeCurrentNotes (intervals branch)
│   │   │                         Depends on: state.js, audio.js, notation.js,
│   │   │                                     breakdown.js, intervals.js
│   │   │
│   │   ├── scales-mode.js      ← generateScaleQuestion, submitScaleAnswer,
│   │   │                         recomputeCurrentNotes (scales branch)
│   │   │                         Depends on: state.js, audio.js, notation.js,
│   │   │                                     breakdown.js, scales.js
│   │   │
│   │   └── progressions-mode.js ← generateProgressionQuestion,
│   │                              generateProgressionQuestion_entry,
│   │                              submitProgressionAnswer,
│   │                              renderProgressionAnswerUI,
│   │                              showProgressionNotation,
│   │                              teardownProgressionUI,
│   │                              dictShowProgression
│   │                              Depends on: state.js, audio.js, notation.js,
│   │                                          breakdown-progressions.js,
│   │                                          progressions.js
│   │
│   ├── dict/
│   │   └── dictionary.js       ← dictFullCatalog, dictDefaultSymbol,
│   │                             dictLoadSymbol, dictShow,
│   │                             getAllChords, getAllIntervals, getAllScales,
│   │                             renderDictPoolPanel, makeDictSection,
│   │                             panel_deactivateAllDictChips,
│   │                             dictApplyInversion
│   │                             Depends on: state.js, all mode files,
│   │                                         pool.js, breakdown.js
│   │
│   └── app.js                  ← boot, switchMode, setAppMode,
│                                 generateQuestion, recomputeCurrentNotes (router),
│                                 resetQuizUI, theme toggle,
│                                 makeCollapsible, event listeners,
│                                 DOMContentLoaded init
│                                 Depends on: everything
│
└── assets/
    └── logo.svg                ← extracted from base64 inline in current file
```

---

## Script load order in index.html

The order below is the dependency graph made explicit.
Each file may only reference names defined in files above it.

```html
<!-- Data layer — no DOM, no state dependencies -->
<script src="js/data/spelling.js"></script>
<script src="js/data/keysig.js"></script>
<script src="js/data/intervals.js"></script>
<script src="js/data/chords.js"></script>
<script src="js/data/scales.js"></script>
<script src="js/data/progressions.js"></script>

<!-- Engine — depends on data -->
<script src="js/engine/state.js"></script>
<script src="js/engine/audio.js"></script>
<script src="js/engine/notation.js"></script>

<!-- Breakdown — depends on engine + data -->
<script src="js/breakdown/breakdown.js"></script>
<script src="js/breakdown/breakdown-intervals.js"></script>
<script src="js/breakdown/breakdown-scales.js"></script>
<script src="js/breakdown/breakdown-chords.js"></script>
<script src="js/breakdown/breakdown-progressions.js"></script>

<!-- UI components — depends on engine -->
<script src="js/ui/stats.js"></script>
<script src="js/ui/controls.js"></script>
<script src="js/ui/chips.js"></script>
<script src="js/ui/pool.js"></script>

<!-- Mode logic — depends on everything above -->
<script src="js/modes/chords-mode.js"></script>
<script src="js/modes/intervals-mode.js"></script>
<script src="js/modes/scales-mode.js"></script>
<script src="js/modes/progressions-mode.js"></script>

<!-- Dictionary — depends on modes -->
<script src="js/dict/dictionary.js"></script>

<!-- App boot — last, depends on everything -->
<script src="js/app.js"></script>
```

---

## CSS load order in index.html

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/notation.css">
<link rel="stylesheet" href="css/theme.css">
```

---

## File size estimates (approximate)

| File | Est. lines | Notes |
|---|---|---|
| spelling.js | ~180 | Largest pure-data engine file |
| keysig.js | ~130 | |
| chords.js | ~220 | CHORD_TYPES alone is ~180 lines |
| intervals.js | ~120 | |
| scales.js | ~160 | SCALES + SCALE_REF + helpers |
| progressions.js | ~260 | PROGRESSIONS data is large |
| state.js | ~70 | All let/const state vars |
| audio.js | ~120 | |
| notation.js | ~320 | Largest engine file — VexFlow is verbose |
| breakdown.js | ~80 | Shared helpers only |
| breakdown-chords.js | ~200 | Slash + poly + UST + normal + theory rows |
| breakdown-intervals.js | ~80 | |
| breakdown-scales.js | ~130 | |
| breakdown-progressions.js | ~120 | BUG-6 fix lives here permanently |
| pool.js | ~250 | |
| chips.js | ~150 | |
| stats.js | ~80 | |
| controls.js | ~120 | |
| chords-mode.js | ~130 | |
| intervals-mode.js | ~60 | |
| scales-mode.js | ~60 | |
| progressions-mode.js | ~200 | |
| dictionary.js | ~200 | |
| app.js | ~180 | Boot + routing + event listeners |
| **Total JS** | **~3,570** | vs ~5,800 JS lines in current file |
| CSS (all files) | ~700 | vs ~720 CSS lines in current file |
| index.html (shell) | ~60 | Just HTML structure + script/link tags |
| **Grand total** | **~4,330** | vs 6,520 currently |

The reduction (~2,200 lines) comes from removing blank lines and comment
duplication that accumulates in a monolithic file, and from the structural
clarity making dead code easier to spot.

---

## Migration strategy

### Option A — Big bang (rewrite all at once)
Extract everything in one session. Takes longer up front but leaves no
intermediate broken state.

**Risk:** high. One missed dependency breaks the whole app.

### Option B — Outside-in (recommended)
Split in layers, testing after each layer:

1. **CSS first** — lowest risk; no logic changes.
   Extract all `<style>` into the five CSS files. Verify visually.

2. **Data layer** — `spelling.js` → `keysig.js` → `intervals.js` →
   `chords.js` → `scales.js` → `progressions.js`.
   Each file is pure data + pure functions; no DOM, no state.
   Easy to verify: if the app loads and plays, data is wired correctly.

3. **State** — move all `let`/`const` state to `state.js`.
   No logic changes; just relocation.

4. **Engine** — `audio.js`, then `notation.js`.
   Notation is the riskiest engine file — VexFlow has many call sites.

5. **Breakdown** — one branch per file. Each branch has a clear `return`
   so they are fully independent once `showBreakdown()` is the router.

6. **UI + modes + dictionary + app** — finish the split.

---

## Things to watch out for

**Circular references**
`state.js` declares variables but imports nothing. Every other file reads
from state but doesn't re-declare it. Keep this strict — no file in `data/`
should reference `state.js`.

**`showBreakdown()` becomes a router**
In the split, `showBreakdown()` (in `breakdown.js`) calls the per-mode
functions from the breakdown sub-files. The mode-specific branches move
out; the router stays.

**VexFlow global**
VexFlow is loaded via CDN and attaches to `window.Vex`. All notation files
can reference `Vex` directly — no import needed.

**SoundFont / piano global**
`piano` is declared in `state.js` and assigned in `audio.js` on boot.
All other files reference the `piano` variable directly.

**No ES modules**
We deliberately avoid `import`/`export` (ES modules require a server for
`file://` local testing and add CORS complexity for GitHub Pages with
certain CDN setups). Plain `<script>` tags in load order is simpler,
universally compatible, and sufficient for this codebase size.

---

## What this unlocks

- **Bug fixes are local** — `breakdown-progressions.js` is the only file
  that touches progression breakdown logic. No hunting through 6,500 lines.
- **Point 42 (chord library)** — add new entries to `chords.js` only.
- **Point 41 (voicing system)** — add to `audio.js` + `chips.js` only.
- **Point 37 (voice leading)** — `breakdown-chords.js` + `audio.js` only.
- **New modes** — add `js/modes/newmode-mode.js` and wire it in `app.js`.
- **Patch files** — every future fix is a direct edit to the right file,
  not a patch against a moving monolith.
