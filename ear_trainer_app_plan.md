# The Sound Travels Ear Trainer — App Plan & Status

> **Algorithm plan:** The voice leading & resolution algorithm (Point 37, Option B) is fully
> specced in a separate document: `voice_leading_algorithm_plan.md`. Read that document before
> implementing any part of Point 37. This app plan covers the UI spec and integration points;
> the algorithm document covers the data layer, build order, and all logic decisions.

---

## Changelog

- **1** Notation: exact octaves, auto bass/grand clef, accidentals
- **2** Inversion system: procedural, all chord types, labelled correctly
- **3** Octave range: root oct 2–5, top note < C7, extended chords oct 3+
- **5** Interval training mode: 12 intervals, 3 playback styles + notation
- **6** Chord playback modes: Block / Ascending / Descending / Broken / Random
- **7** Scale training mode: 18 scales, asc / desc / both
- **8** UX: root badge, Hear Slowly, session stats; Space + Enter shortcuts
- **9b** Full chord library rebuild: six families, Berklee symbols
- **10** Granular pool panel: collapsible, per-mode chips, All/None, inversions toggle
- **11** Answer dropdown: auto-submit, green/red feedback, correct answer revealed
- **12** Root note + octave register chips (Rnd | C–B | Low/Mid/High)
- **13** Enharmonic spelling engine: spelledNote(), SYMBOL_SPELLING, VexFlow keys
- **14** Breakdown panel: figured bass header, Notes / From root / Between notes
- **16** Visual redesign: teal accent, CSS vars, dark/light toggle + localStorage
- **17** Typography: Playfair Display + Inter via Google Fonts
- **19** Layout: sticky header + mode tabs, enlarged play button, collapsible Settings
- **20a** Dark mode contrast lifted for WCAG AA
- **20b** Random direction chip for intervals and scales
- **20.5** New Session button; resetSession() shared with stats Reset
- **21** Responsive pass: rem units, 44px touch targets
- **21b** Header layout: two-line sticky, title always visible
- **22** Breakdown enrichment (all three modes): intervals, scales, chords
- **24** Tritone label: A4/d5 context-aware, replaces "TT" everywhere
- **25** Slash chords: root-agnostic, 18 types (9 maj + 9 min upper), grand staff
- **26** Polychords: 8 types, two stacked triads, grand staff, full breakdown. UST: 7 types (I–VII), rootless dom7 shell + upper triad, breakdown with tensions
- **27** Pentatonic section: 7 scales, dual labels for Major/Minor Pentatonic
- **28** Scale library by note count: Pentatonic / Hexatonic / Diatonic / Octatonic. Added Augmented scale and Prometheus
- **29** Qualified Roman numerals throughout: ♭III, ♯IV, ♭VI, ♭VII etc.
- **29b** Context-aware enharmonic labels throughout
- **29c** Interval pool relabelled for enharmonic clarity
- **30** Scale direction bug fix: notation synced with playback on direction chip change
- **31** Dictionary mode: Quiz / Dictionary toggle inline in score bar
- **32** Chord notation mirrors playback style
- **33** Dictionary mode settings re-render wiring complete
- **34** More polychord types: 16 new entries covering Aug/Dom7 upper/lower
- **35** More UST types — Minor shell and Maj7 shell contexts
- **36** Chord scales breakdown row (all chord families)
- **37** Voice leading panel — Pass 1 and Pass 2 complete ✓ (Aug 2026)
- **38** Chord progression mode — complete ✓ (Aug 2026)
- **39** Extended / compound intervals: 7 new entries (m9, M9, A9/♯9, P11, A11/♯11, m13, M13)
- **Tab order** Tabs reordered to Intervals | Chords | Scales | Progressions
- **Mobile** Full mobile responsive pass; root chips flex-wrap grid; dynamic header padding
- **40** Clickable chord scales → Dictionary mode ✓ (Aug 2026)
- **41/46** Voicing system — UI and infrastructure complete ✓ (Aug 2026). Group 5 algorithmic bug pending.
- **42** Pool panel UX overhaul — all sections collapsed by default, global All/None buttons ✓ (Aug 2026)
- **43** Breakdown default state + full chip sync ✓ (Aug 2026)
- **44** Complete chord library ✓ (Aug 2026) — all families complete; `chords_reference.md` fully updated
- **45** Complete scale library — reference file exists; implementation not yet started
- **47** Harmonic field in scale breakdown ✓ (Aug 2026)
- **48** Collapsible breakdown sub-sections ✓ (Aug 2026)
- **About** About view + ⓘ header button ✓ (Aug 2026)
- **49** In-app Help system ✓ (Aug 2026) — see current session notes below
- **Mobile-2** Small-phone header overhaul ✓ (Aug 2026) — see current session notes below

---

## Current Session — Aug 2026

### Point 49 — In-app Help system ✓ COMPLETE

All five sections of the Help panel are implemented and working.

**What was delivered:**
- `js/data/help-content.js` — full content file (5 sections, 80+ entries): Getting Started, Modes, Controls & Settings, The Breakdown Panel, Music Theory Glossary
- `js/modes/help-mode.js` — rendering logic: open/close, Escape key, mutual exclusion with About, live search/filter, collapsible `<details>` entries
- `index.html` — `?` button in sticky header; script tags wired in correct load order
- Mutual exclusion: opening Help closes About and vice versa; mode tabs dismiss Help

**Bug fixes applied during this session:**
- `help-content.js` had two multi-line strings using single quotes (lines 48 and 111) — JavaScript syntax error. Both converted to template literals (backticks).
- `HELP_SECTIONS is not defined` error in `help-mode.js` was a cascading failure from the syntax error above — resolved by fixing the syntax.

**File location change:**
- `help-content.js` moved from `js/modes/` to `js/data/` — content-only files with no DOM belong in the data layer, consistent with `chords.js`, `progressions.js`, etc.
- Old `js/modes/help-content.js` must be deleted from the server.

**Files changed:**

| File | Change |
|---|---|
| `js/data/help-content.js` | New location (was `js/modes/`). Two template literal bug fixes. |
| `js/modes/help-mode.js` | No logic changes. |
| `index.html` | Script tag updated to `js/data/help-content.js`. `?` button and load order confirmed. |

---

### Mobile-2 — Small-phone header overhaul ✓ COMPLETE

On small phones (Samsung S5, iPhone SE, ~360px wide), the header was overcrowded: the long title pushed ℹ and ? off-screen, and the Quiz/Dictionary toggle occupied a full-width row unnecessarily.

**New layout on mobile (≤ 600px):**
- **Header row:** logo + title (truncates with ellipsis if needed) + ☀️ only. Clean, no crowding.
- **Score bar row 1:** Streak · Score · New Session
- **Score bar row 2:** ℹ · ? · Quiz/Dict (compact, auto-width — not full-width)

**Implementation approach (Option B — small HTML change):**
- `aboutBtn` and `helpBtn` consolidated into the right-side header flex div (desktop appearance unchanged)
- `aboutBtnMobile` and `helpBtnMobile` added inside `.score-bar` just before `.qd-toggle`
- Mobile CSS hides the header versions and shows the score-bar versions on small screens
- A forwarding script at the bottom of `index.html` delegates mobile button clicks to the real buttons, so `about-mode.js` and `help-mode.js` require zero changes

**Files changed:**

| File | Change |
|---|---|
| `index.html` | Header restructured; mobile duplicate buttons added to score bar; forwarding script at bottom |
| `css/mobile.css` | Header ℹ/? hidden; score-bar ℹ/? shown; Quiz/Dict shrunk from `width:100%` to `width:auto`; title gets `text-overflow:ellipsis` |

---

### Point 44 — Complete chord library ✓ COMPLETE

**Previous session delivered:** classical (N6, It⁺⁶, Fr⁺⁶, Ger⁺⁶), quartal (qrt3/4/5/TT, qnt3/4), cluster (4 types), aug7, aug9 — plus full breakdown paths, pool panel wiring, and helpers/app guards.

**This session delivered:**
- Cross-checked all "missing" chords from `chords_reference.md` against `chords.js` — found 13 of 14 were already present (reference status was stale)
- Added the one genuinely missing chord: `add9(add11)` [0,4,7,14,17] to the major family in `chords.js`
- Updated `chords_reference.md` throughout: all ✗ entries flipped to ✓, stale summary section replaced with "Complete ✓"
- Confirmed `Maj7(9)(11)` and `Maj7(9)(11)(13)` are the correct Berklee symbols for "Major 11" / "Major 13" (verified against Berklee sources)

**Files changed:**

| File | Change |
|---|---|
| `js/data/chords.js` | `add9(add11)` added to major family |
| `chords_reference.md` | All status columns updated to ✓; summary rewritten as complete |

---

## Bug Tracker

### Fixed ✓

#### BUG-1 — Mode switch after Progressions corrupts notation in all other modes
**Fix:** `teardownProgressionUI()` in `js/modes/progressions-mode.js` — idempotent cleanup called at the top of `switchMode()` and `setAppMode()` in `js/app.js`. (Aug 2026)

#### BUG-2 — Progression notation: wrong spelling, always sharps
**Fix:** Replaced raw sharp-name array with `midiToVexKeySpelled()` + `respellForKeySig()` + `isCoveredByKeySig()` pipeline. Added `progKeySigMode` state variable and Key/C chip support. (Aug 2026)

#### BUG-3 — Interval notation: two notes render on same staff position in Key mode
**Fix:** Reordered `respellForKeySig()` priorities. `spellMidi()` now returns `{ key, forcedAcc }`. `addAccidentalsFiltered()` bypasses key sig coverage when `forcedAcc=true`. (Aug 2026)

#### BUG-4 — Resolution notation: Key/C chip selection has no effect
**Fix:** `renderResolutionNotation()` now fully wires `chordKeySigMode` — computes `keySigStr`, calls `respellForKeySig()`, calls `stave.addKeySignature()`. (Aug 2026)

#### BUG-6 — Progression: breakdown panel not shown post-answer
**Fix:** Added `progressions` branch to `showBreakdown()`; fixed `updateStatsTable()` → `updateScore()`; added `answered = true`; wired `showBreakdown()` in both quiz and dict paths. (Aug 2026)

#### BUG-7 — Progression notation: staves missing clef, misaligned, cut off
**Fix:** `showProgressionNotation()` fully rewritten as a single continuous score with one grand staff decision, proper chord labels, horizontal scroll. (Aug 2026)

---

### Open Bugs 🔴

#### BUG-5 — Resolution notation: VexFlow two-chord layout is fragile
**Symptom:** Source and resolution chords sometimes render in wrong positions or overlap.
**Root cause:** Uses a single stave with `[srcNote, BarNote, tgtNote]` as half-notes in one voice. `BarNote` inside a single voice is fragile in VexFlow.
**Fix approach:** Use two separate stave segments or two independent voices.
**Status:** Deferred — needs more testing to confirm visible impact before prioritising.

---

## Where to make changes

| Area | File |
|---|---|
| All state variables | `js/engine/state.js` |
| Selected pool defaults | `js/engine/defaults.js` |
| Shared helpers (`pickRandom`, `chooseRootMidi`, etc.) | `js/engine/helpers.js` |
| Audio playback | `js/engine/audio.js` |
| Notation rendering (VexFlow, `showNotation`) | `js/engine/notation.js` |
| Voice leading engine | `js/engine/voiceLeading.js` |
| Voicing data, algorithms (`VOICING_MODES`, `applyVoicing`, `resolveVoicingMode`) | `js/engine/voicings.js` |
| Breakdown panel (`showBreakdown`) | `js/breakdown/breakdown.js` |
| Chord data (`CHORD_TYPES`, `INTERVALS`, `SCALES`) | `js/data/chords.js` |
| Enharmonic spelling engine | `js/data/spelling.js` |
| Key signature helpers | `js/data/keysig.js` |
| Progression data (`PROGRESSIONS`) | `js/data/progressions.js` |
| Help content (all Help text, no DOM) | `js/data/help-content.js` |
| Chord quiz + answer logic | `js/modes/chords-mode.js` |
| Interval quiz + answer logic | `js/modes/intervals-mode.js` |
| Scale quiz + answer logic | `js/modes/scales-mode.js` |
| Progression playback, notation, quiz, dict, `recomputeCurrentNotes`, `teardownProgressionUI` | `js/modes/progressions-mode.js` |
| Help panel open/close, rendering, search | `js/modes/help-mode.js` |
| About panel open/close | `js/modes/about-mode.js` |
| Answer dropdown, controls rendering | `js/ui/controls.js` |
| Pool panel rendering | `js/ui/pool.js` |
| Score, stats | `js/ui/stats.js` |
| Mode switching, dictionary functions, boot, theme, register panel | `js/app.js` |

---

## TODO

### Next steps (priority order)

1. **Point 41 — Fix Group 5 Intervallic voicings** 🔴
   Fix range clamping, cap note count at 5, and resolve the duplicate implementations (`cluster_diaton` = `cluster_modal`, `secundal` = `cluster_wt`). `so_what` and `mccoy_tyner` are correct as-is — do not change them. **Only `voicings.js` changes.**

2. **Point 45 — Complete scale library**
   Work through `complete_12_TET_piano_scales.md` named-index rows (~50 entries).

3. **Point 44 — File split** (optional, do when `chords.js` feels unwieldy)
   Split into `chords-tertian.js`, `chords-special.js`, `chords-classical.js`, `chords-quartal.js`.

4. **BUG-5** — Fix fragile two-chord VexFlow layout (defer until confirmed causing visible problems)

---

### Point 41 — Complete voicing system

#### Status: UI and infrastructure complete — Group 5 algorithmic bug pending (Aug 2026)

**What is done ✓**
- `voicings.js` created — `VOICING_MODES` (all 63), `applyVoicing()` (all groups implemented), `resolveVoicingMode()`
- Groups 1–4 and most of Group 6 correct and unaffected by the bug
- `pool.js` — `VOICING_GROUPS` corrected to 6 groups / 63 symbols
- `breakdown.js` — voicing label row reads from `VOICING_MODES.find()`
- `app.js` — `recomputeCurrentNotes()` fully implemented
- `index.html` — load order confirmed correct

**What is broken 🔴 — Group 5 (Intervallic) algorithmic bug**
Intervallic voicings (`quartal`, `quintal`, `secundal`, `cluster_*`) generate pitch classes not present in the chord. Example: quartal stacking on C major triad {C, E, G} produces {C, F, B♭} — non-chord tones. Same issue: `so_what`, `mccoy_tyner` in Group 6 ignore chord tones entirely.

**Decision: revised after research** — chord-tone constraint (Option A) is wrong for intervallic voicings. Research confirms:
- Quartal voicings are intentionally ambiguous — Berklee notes that a quartal triad "doesn't sound major, minor, augmented, or diminished." The non-chord tones are not a bug; the ambiguity is the point.
- Clusters/secundal are timbral by definition — constraining them to chord tones destroys their character.
- `so_what` and `mccoy_tyner` are fixed-shape style voicings — they are correct as-is and should not be changed.

**Actual problems to fix in Group 5:**
1. `quintal` — range clamping is insufficient; can produce notes far outside playable range
2. `cluster_diaton` and `cluster_modal` — currently identical implementations; one should be removed or differentiated
3. `secundal` and `cluster_wt` — currently identical (both stack 2 semitones); one should be removed or differentiated
4. Note count — all 8 use `baseIntervals.length`, so a 7-note chord gets 7 stacked fourths; cap at 4–5 notes max

**Fix approach:** range clamping and note count cap — not chord-tone constraint. Keep all notes within a 2-octave window from the bass note; cap output at 5 notes regardless of chord size.

**What is not yet done**
- Group 5 range/count fixes (see above)
- `cluster_diaton` vs `cluster_modal` differentiation decision
- `secundal` vs `cluster_wt` differentiation decision
- Full voicing confirmation checklist not yet run

**File to change:** `js/engine/voicings.js` only.

---

#### Voicing groups reference

**Group 1 — Position / Spacing** (3 voicings: `close`, `open`, `spread`) ✓

**Group 2 — Doubling** (4 voicings: `dbl_root_oct`, `dbl_root_above5`, `dbl_fifth`, `dbl_root_wrap`) ✓

**Group 3 — Shell / Rootless** (27 voicings) ✓

**Group 4 — Drop Voicings** (4 voicings: `drop2`, `drop3`, `drop24`, `drop23`) ✓

**Group 5 — Intervallic** (8 voicings) 🔴 NEEDS REDESIGN

| # | Voicing | Symbol | Target interval |
|---|---|---|---|
| 39 | Quartal | `quartal` | Perfect fourth (5 st) |
| 40 | Quintal | `quintal` | Perfect fifth (7 st) |
| 41 | Secundal | `secundal` | Major second (2 st) |
| 42 | Cluster Chromatic | `cluster_chrom` | Semitone (1 st) |
| 43 | Cluster Diatonic | `cluster_diaton` | Diatonic second |
| 44 | Cluster Pentatonic | `cluster_pent` | Pentatonic step |
| 45 | Cluster Whole-tone | `cluster_wt` | Whole tone (2 st) |
| 46 | Cluster Modal | `cluster_modal` | Modal scale step |

**Group 6 — Style** (17 voicings) — mostly ✓, two need chord-tone constraint: `so_what`, `mccoy_tyner`

---

#### Voicing confirmation checklist

**Group 1 — Position**
- [ ] Close
- [ ] Open
- [ ] Spread

**Group 2 — Doubling**
- [ ] Root Octave Double
- [ ] Root Above Fifth
- [ ] Fifth Double
- [ ] Root Top and Bottom

**Group 3 — Shell / Rootless**
- [ ] Shell
- [ ] Shell Alt
- [ ] Rootless Shell
- [ ] Three-note Maj 1–3–5
- [ ] Three-note Maj 3–5–7
- [ ] Three-note Maj 1–3–7
- [ ] Three-note Dom 1–3–b7
- [ ] Three-note Dom 3–5–b7
- [ ] Three-note Dom 3–b7–9
- [ ] Three-note Min 1–b3–b7
- [ ] Three-note Min b3–5–b7
- [ ] Three-note Min b3–b7–9
- [ ] Rootless Maj7
- [ ] Rootless Maj7 Extended
- [ ] Rootless Min7
- [ ] Rootless Dom7
- [ ] Rootless Altered A
- [ ] Rootless Altered B
- [ ] Rootless Altered C
- [ ] Rootless Altered D
- [ ] Rootless #9
- [ ] Sus Voicing
- [ ] Phrygian Voicing
- [ ] Major 6
- [ ] Minor 6
- [ ] 6/9
- [ ] Rootless 6/9

**Group 4 — Drop Voicings**
- [ ] Drop-2
- [ ] Drop-3
- [ ] Drop-2&4
- [ ] Drop-2&3

**Group 5 — Intervallic** (all blocked on redesign)
- [ ] Quartal
- [ ] Quintal
- [ ] Secundal
- [ ] Cluster Chromatic
- [ ] Cluster Diatonic
- [ ] Cluster Pentatonic
- [ ] Cluster Whole-tone
- [ ] Cluster Modal

**Group 6 — Style**
- [ ] So What
- [ ] Bill Evans A
- [ ] Bill Evans B
- [ ] Kenny Barron
- [ ] McCoy Tyner
- [ ] Pop Piano
- [ ] Gospel
- [ ] Octave Bass + Triad
- [ ] Octave Bass + 7th
- [ ] Open Fifth + Triad
- [ ] Block Chord Close
- [ ] Block Chord Locked Hands
- [ ] Four-way Close
- [ ] Block Drop-2
- [ ] Octave Melody + Inner
- [ ] Pedal Point
- [ ] Two-handed Spread

---

### Point 44 — Complete chord library

#### Status: Complete ✓ (Aug 2026)

All chord families are implemented. `chords_reference.md` is fully up to date with ✓ status throughout.

#### File split plan (optional future task)
Split `chords.js` into focused files when it becomes unwieldy. All expose entries into the shared `CHORD_TYPES` object. Load order in `index.html`: tertian → special → classical → quartal, all before `state.js`.

| File | Contents |
|---|---|
| `js/data/chords-tertian.js` | major, minor, dominant, diminished, augmented, suspended |
| `js/data/chords-special.js` | slash, poly, UST |
| `js/data/chords-classical.js` | classical (Neapolitan, aug sixths) |
| `js/data/chords-quartal.js` | quartal, quintal, cluster |

---

### Point 45 — Complete scale library

#### Status: Reference complete — implementation not yet started

`complete_12_TET_piano_scales.md` is the master catalogue. Target: the named/literature index (~50 named entries).

**Missing entries include:**
- Japanese pentatonics: Iwato, In-sen, Hirajoshi, Yo, Ritsu
- Hexatonics: Tritone Hexatonic, Prometheus Liszt, Major/Minor Blues, Messiaen Mode 5
- Heptatonics: Harmonic Major, Neapolitan Minor, Double Harmonic/Byzantine, Hungarian Minor, Romanian Minor, Dorian ♯4, Phrygian ♮6
- Octatonics: Messiaen Modes 3, 4, 6

#### Implementation steps
1. Audit current 25 scales against reference — correct any wrong interval patterns
2. Add each missing named entry to `chords.js` (`SCALES` array)
3. Verify: interval pattern, enharmonic spelling, degree numerals
4. Add new pool panel chips in `pool.js` within the correct cardinality group
5. Confirm chord-scales intersection logic still works for all new entries
6. Update reference file status column as each scale is added

---

## Parking Lot

- Spaced repetition — weight pool toward weak spots rather than uniform random
- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV
- `RESOLUTION_TARGETS` cleanup — retained as live fallback for voice leading; remove once engine is confirmed stable
- BUG-5 — Resolution notation VexFlow two-chord layout (defer until confirmed causing visible problems)
