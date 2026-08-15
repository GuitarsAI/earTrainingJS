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
- **41/46** Voicing system — complete ✓ (Aug 2026). 62 voicings across 6 groups. Group 5 redesigned: `cluster_modal` removed, `secundal` and `cluster_wt` differentiated.
- **42** Pool panel UX overhaul — all sections collapsed by default, global All/None buttons ✓ (Aug 2026)
- **43** Breakdown default state + full chip sync ✓ (Aug 2026)
- **44** Complete chord library ✓ (Aug 2026) — all families complete; `chords_reference.md` fully updated
- **45** Complete scale library ✓ (Aug 2026) — all named entries added to `scales.js`; pool panel auto-discovers groups via `group` field
- **47** Harmonic field in scale breakdown ✓ (Aug 2026)
- **48** Collapsible breakdown sub-sections ✓ (Aug 2026)
- **About** About view + ⓘ header button ✓ (Aug 2026)
- **49** In-app Help system ✓ (Aug 2026) — see current session notes below
- **Mobile-2** Small-phone header overhaul ✓ (Aug 2026) — see current session notes below
- **41/46 — Group 5 fix** Intervallic voicings redesigned ✓ (Aug 2026) — `cluster_modal` removed, `secundal` redefined as diatonic-step stacking, `cluster_wt` added as distinct pure-whole-tone voicing; range clamping and note-count cap applied across all Group 5 entries
- **Help update** `help-content.js` updated (Aug 2026) — chords mode description corrected to 12 families; voicing Group 5 entry fixed; scale direction Random chip added; 7 new glossary entries added
- **50** Basic / Advanced mode — complete ✓ (Aug 2026) — Intervals, Chords, Scales, Progressions all done
- **Mobile-3** Mobile breakdown fixes ✓ (Aug 2026) — Settings panel open bug fixed; dark mode now default for new users; Chord Scales and Voice Leading rebuilt as full-width collapsibles on mobile

---

## Current Session — Aug 2026

### Mobile-3 — Mobile breakdown fixes ✓ COMPLETE

Three bugs fixed; two files changed.

**Bug 1 — Settings panel would not open on mobile**
`mobile.css` hid `#settingsPanelBody` but had no `.open` override (unlike pool panels which had one). JS toggles `.open` on the element — CSS never re-showed it.
Fix: added `#settingsPanelBody.open { display: block; }` to `mobile.css`.

**Bug 2 — Dark mode defaulted to light for new users**
Theme init in `app.js`: `let theme = stored || LIGHT`. Users with no `localStorage` entry always got light mode.
Fix: changed to `stored || DARK`. Existing users with a saved preference are unaffected.

**Bug 3 — Chord Scales and Voice Leading clipped on the right on mobile**
Root cause: both sections were rendered as `breakdown-row` (flex, side-by-side) with a `breakdown-key` label on the left and the collapsible content on the right. The label consumed ~90px, leaving the collapsible too narrow — content overflowed and was clipped by `overflow: hidden` on `.cs-section`.

CSS-only fix (wrapping rows) was insufficient because the inner `vl-table` columns all have `white-space: nowrap` for layout reasons, and the nested collapsibles (context → resolution → vl-table) cannot be constrained purely via CSS without breaking the desktop layout.

**Decision: JS restructure on mobile, desktop untouched.**
- `isMobile()` helper: `window.innerWidth <= 600`
- `makeChordScalesRow` on mobile: skip the `breakdown-row` wrapper entirely; render a standalone full-width `cs-section` with header "CHORD SCALES — N SCALES FIT". Each scale row: name on line 1, tag + note on line 2 (via `cs-row-mobile` class in `mobile.css`)
- `makeVoiceLeadingRow` on mobile: skip the `breakdown-row` wrapper; "RESOLVES TO" becomes a plain full-width label above the context collapsibles, which stack full-width
- Desktop: zero change — both paths guarded by `isMobile()`

**Files changed:**

| File | Change |
|---|---|
| `app.js` | `stored \|\| DARK` (line 789) |
| `mobile.css` | `#settingsPanelBody.open`, `.cs-row-mobile` layout rules |
| `breakdown.js` | `isMobile()` helper; `makeChordScalesRow` and `makeVoiceLeadingRow` mobile path |

---

### Point 50 — Basic / Advanced mode ✓ COMPLETE (all four modes)

A mode toggle in Settings that controls which pool items are visible and selectable. Not a filter — a full mode switch. The quiz only draws from items valid for the current mode. Switching either way resets selections to mode-appropriate defaults — no cross-mode memory. Each mode's Basic/Advanced boundary is self-contained; difficulty in one mode has no bearing on another.

**Final boundary definitions:**

| Area | Basic | Advanced adds |
|---|---|---|
| Intervals | All 12 simple (m2 – P8) | 7 compound (m9, M9, ♯9, P11, ♯11, m13, M13) |
| Chords | maj, Maj7, m, m7, 7, dim, m7b5, o7, aug, sus2, sus4, power | All extensions, classical, quartal, cluster, slash, poly, UST |
| Scales | Major, Natural Minor, Major Pentatonic, Minor Pentatonic | All other scales |
| Progressions | 9 core progressions (see below) | All progressions |

**Basic progressions (9 total):**

| Symbol | Name | Group |
|---|---|---|
| V-I | Perfect Authentic | Cadences |
| V7-I | Perfect Authentic (dom7) | Cadences |
| IV-I | Plagal | Cadences |
| I-V | Half Cadence | Cadences |
| I-IV-V-I | Four-chord cadence | Classical |
| I-IV-V | Rock / folk / blues | Short |
| I-V-vi-IV | Axis progression | Pop & Rock |
| I-vi-IV-V | Doo-wop / 50s | Pop & Rock |
| ii-V-I | Jazz ii–V–I (major) | Jazz |

---

### Point 50 — Basic / Advanced mode: Progressions ✓ COMPLETE

**What was delivered:**
- `basic: true` flag added to the 9 qualifying entries in `progressions.js`
- `selectedProgressions` initialised in `defaults.js` using `PROGRESSIONS.filter(p => p.basic)`
- `setAppDifficulty` in `app.js` resets `selectedProgressions` on every difficulty switch
- **Bug fixed:** `renderProgressionPoolPanel` in `progressions-mode.js` was overriding the pool.js version and ignoring `appDifficulty` — always showing all progressions. Fixed by adding `visibleProgressions` filter (identical pattern to scales/intervals).
- **Bug fixed:** `renderDictProgressionPoolPanel` in `progressions-mode.js` had the same issue — fixed with the same pattern. Also added `if (items.length === 0) return` guard to skip empty groups.
- Both quiz and dict pool panels now scope their Global All/None and section rendering to `visibleProgressions` in Basic mode.

**Files changed:**

| File | Change |
|---|---|
| `js/data/progressions.js` | `basic: true` on 9 qualifying entries |
| `js/engine/defaults.js` | `selectedProgressions` default: `PROGRESSIONS.filter(p => p.basic)` |
| `js/app.js` | `setAppDifficulty` resets `selectedProgressions`; `progressions` already in re-render condition |
| `js/modes/progressions-mode.js` | `renderProgressionPoolPanel` and `renderDictProgressionPoolPanel` both fixed to filter by `appDifficulty` |

---

### Point 50 — Basic / Advanced mode: Scales ✓ COMPLETE

Basic scales defined as 4 entries: `pent_maj`, `pent_min`, `major`, `nat_minor`. Melodic Minor was explicitly excluded after review.

**What was delivered:**
- `basic: true` flag added to `pent_maj`, `pent_min`, `major`, `nat_minor` in `scales.js`
- `iterateScaleGroups` in `pool.js` filters `SCALES` to `basic: true` entries when `appDifficulty === 'basic'` — covers both quiz (`renderScalePoolPanel`) and dict (`renderDictPoolPanel`) in one place
- Global All/None in `renderScalePoolPanel` updated to operate only on visible (basic-flagged) scales in Basic mode
- `setAppDifficulty` in `app.js` resets `selectedScales` on every mode switch and triggers scales re-render
- `defaults.js` initial `selectedScales` updated to the 4 Basic scales

**Basic mode visible scales:**
- Pentatonic: Major Pentatonic, Minor Pentatonic
- Diatonic: Major, Natural Minor
- Hexatonic and Octatonic sections hidden entirely in Basic mode

**Files changed:**

| File | Change |
|---|---|
| `js/data/scales.js` | `basic: true` on `pent_maj`, `pent_min`, `major`, `nat_minor` |
| `js/ui/pool.js` | `iterateScaleGroups` filters on `basic` flag in Basic mode; global All/None scoped to visible scales |
| `js/app.js` | `setAppDifficulty` resets `selectedScales`; `scales` added to mode re-render condition |
| `js/engine/defaults.js` | `selectedScales` default updated to 4 Basic scales |

---

### Point 50 — Basic / Advanced mode: Intervals ✓ COMPLETE

**What was delivered:**
- `appDifficulty: 'basic' | 'advanced'` added to `state.js`
- `compound` flag already present on all 7 compound intervals in `chords.js` — no new data change needed
- `pool.js` interval renderer hides compound intervals when `appDifficulty === 'basic'`
- `setAppDifficulty` in `app.js` resets `selectedIntervals`, stripping compound entries when switching to Basic
- `defaults.js` default `selectedIntervals` confirmed correct (already filtered to `!i.compound`)
- Basic / Advanced toggle chips added to Settings section in `index.html`

**Basic mode: all 12 simple intervals (m2 – P8). Advanced adds: m9, M9, ♯9, P11, ♯11, m13, M13.**

**Files changed:**

| File | Change |
|---|---|
| `js/engine/state.js` | `appDifficulty: 'basic'` added |
| `js/ui/pool.js` | Interval renderer filters out compound intervals in Basic mode |
| `js/app.js` | `setAppDifficulty()` implemented; resets `selectedIntervals` on switch |
| `index.html` | Basic / Advanced toggle chips added to Settings |

---

### Point 50 — Basic / Advanced mode: Chords ✓ COMPLETE

**What was delivered:**
- `basic: true` flag added to 12 qualifying entries in `chords.js`: `maj`, `Maj7`, `m`, `m7`, `7`, `dim`, `m7b5`, `o7`, `aug`, `sus2`, `sus4`, `power`
- `pool.js` chord pool renderer filters to `basic: true` entries in Basic mode; Advanced shows all families
- `setAppDifficulty` in `app.js` resets `selectedChords` using `BASIC_CHORD_SYMBOLS` constant on switch to Basic, or all chords on switch to Advanced
- Voicing pool in Basic mode limited to Position and Doubling groups only (Groups 1 & 2); all 6 groups visible in Advanced

**Files changed:**

| File | Change |
|---|---|
| `js/data/chords.js` | `basic: true` on 12 qualifying entries |
| `js/ui/pool.js` | Chord pool renderer filters on `appDifficulty`; voicing single-select shows Groups 1–2 only in Basic |
| `js/app.js` | `setAppDifficulty` resets `selectedChords` and `selectedVoicings` on switch |

---

### Point 41/46 — Group 5 Intervallic voicings fix ✓ COMPLETE

The Group 5 voicings in `voicings.js` have been redesigned to fix range clamping, note count, and duplicate implementations. The chord-tone constraint was explicitly rejected — non-chord tones are intentional in intervallic voicings.

**What was delivered:**
- `cluster_modal` removed entirely (was identical to `cluster_diaton`; not a distinct category per Persichetti)
- `secundal` redefined as diatonic-step stacking (m2/M2 mix from major scale) — distinct from `cluster_wt`
- `cluster_wt` added as a new distinct voicing — pure whole-tone stacking (always M2); Debussy/Impressionist flavour
- All Group 5 voicings now cap output at 4 notes for triads, 5 notes for all other chords
- All Group 5 voicings clamp within a 2-octave window from the bass note
- Bass note anchored to MIDI 36–59 range before stacking begins

**Files changed:**

| File | Change |
|---|---|
| `js/engine/voicings.js` | `cluster_modal` case removed; `secundal` case rewritten; `cluster_wt` case added; note-count cap and range clamping applied across all Group 5 entries |

---

### Help content update ✓ COMPLETE

`help-content.js` brought fully in sync with the current state of `chords.js`, `scales.js`, and `voicings.js`.

**What was fixed:**
- Chords mode description: rewritten from "six families" (stale) to all twelve, with correct descriptions for each family
- Voicing Group 5 entry: `Cluster Modal` bullet removed; `Secundal` description corrected from "stacked major seconds" to "diatonic-step stacking"; `Cluster Whole-tone` bullet added with distinction from Secundal clarified
- Scale direction chips entry: `Random` bullet added to match `SCALE_DIRECTIONS` in `scales.js`

**New glossary entries added (7):**
- Augmented sixth chords — It⁺⁶, Fr⁺⁶, Ger⁺⁶ with interval structures and resolution behaviour
- Cluster chords (secundal harmony) — the three pool types; Cowell attribution; distinction from cluster voicings
- Japanese pentatonic scales — Hirajoshi, Iwato, In-sen, Yo each characterised
- Modes of limited transposition — Messiaen concept; all four pool modes listed with note counts and transposition numbers
- Neapolitan chord (N6) — full explanation with example in C minor
- Pentatonic / Hexatonic / Octatonic — all four scale group labels defined
- Quartal / quintal chords — all six pool chord types listed; distinction from quartal voicings made explicit

**Files changed:**

| File | Change |
|---|---|
| `js/data/help-content.js` | Chords mode description rewritten; Group 5 voicing entry corrected; scale direction Random added; 7 glossary entries added |

---

### Previous Session — Aug 2026

### Point 45 — Complete scale library ✓ COMPLETE

All named entries from `complete_12_TET_piano_scales.md` have been added to `scales.js`. The `SCALES` array is now the single source of truth; the pool panel auto-discovers groups via the `group` field on each entry — no hardcoded indices or counts anywhere.

**What was delivered:**
- `scales.js` split out from `chords.js` as a standalone file
- 46 scales total across four cardinality groups: 13 pentatonic, 8 hexatonic, 21 diatonic/modal, 4 octatonic
- New entries: Iwato, In-sen, Hirajoshi, Yo, Dominant Pentatonic, Suspended Pentatonic, Dorian/Phrygian/Lydian/Mixolydian/Locrian pentatonics; Major Blues, Prometheus Liszt, Tritone Hexatonic, Messiaen Mode 5; Harmonic Major, Neapolitan Minor, Double Harmonic, Spanish/Flamenco, Hungarian Minor, Romanian Minor, Dorian ♯4, Phrygian ♮6, Messiaen Mode 6; Messiaen Modes 3 & 4
- Each entry carries `group: 'pentatonic' | 'hexatonic' | 'diatonic' | 'octatonic'`
- `SCALE_GROUP_CONFIG` in `pool.js` maps group keys to display titles and section renderer choice

**Bug found and fixed — dict mode pool used hardcoded `SCALES.slice()` indices:**
- `renderDictPoolPanel()` in `app.js` was slicing `SCALES` by hardcoded index boundaries written for the old 25-scale array
- After Point 45 expanded the array, every group boundary was wrong, causing scales to appear under the wrong section heading in Dictionary mode
- Fix: extracted `iterateScaleGroups(callback)` helper in `pool.js` — iterates `SCALES` by `group` field using a `Map` in insertion order, looks up title and config from `SCALE_GROUP_CONFIG`
- Both `renderScalePoolPanel` (quiz) and `renderDictPoolPanel` (dict) now call `iterateScaleGroups` — one source of truth, no hardcoded indices

**Files changed:**

| File | Change |
|---|---|
| `js/data/scales.js` | New file — `SCALES` array and `SCALE_DIRECTIONS` extracted from `chords.js`; full scale library added |
| `js/ui/pool.js` | `iterateScaleGroups()` helper added; `renderScalePoolPanel` refactored to use it |
| `js/app.js` | `renderDictPoolPanel` scales branch: hardcoded `SCALES.slice()` calls replaced with `iterateScaleGroups()` |

---

### Previous Session — Aug 2026

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

### Point 50 — Basic / Advanced mode

#### Status: Complete ✓ (Aug 2026)

A mode toggle in Settings that controls which pool items are visible and selectable. Not a filter — a full mode switch. The quiz only draws from items valid for the current mode.

**Behaviour on mode switch:**
- Switching either way resets selections to mode-appropriate defaults — no cross-mode memory
- Each mode's Basic/Advanced boundary is self-contained — difficulty is per-mode, not global
- Default for new users: **Basic**

**Toggle location:** Settings panel — a Basic / Advanced chip pair

**State:** Single `appDifficulty: 'basic' | 'advanced'` variable in `state.js`. All pool rendering and quiz draw logic gates on this.

**Basic flag:** A `basic: true` field on each qualifying entry in `chords.js`, `scales.js`, and `progressions.js`. The UI filters on this flag; Advanced shows everything.

**Progress:**

| Area | Status |
|---|---|
| Intervals | ✓ Complete |
| Chords | ✓ Complete |
| Scales | ✓ Complete |
| Progressions | ✓ Complete |
| Help content | Not started |

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

#### BUG-8 — Basic/Advanced switch has no effect in Progressions mode
**Symptom:** Switching between Basic and Advanced in Progressions mode changed nothing — all progressions remained visible in both quiz pool and dictionary.
**Root cause:** `progressions-mode.js` defined its own `renderProgressionPoolPanel` that silently overrode the correctly-filtering version in `pool.js`. Both `renderProgressionPoolPanel` and `renderDictProgressionPoolPanel` in `progressions-mode.js` passed the full unfiltered `PROGRESSIONS` array regardless of `appDifficulty`.
**Fix:** Added `visibleProgressions` filter (`appDifficulty === 'basic' ? PROGRESSIONS.filter(p => p.basic) : [...PROGRESSIONS]`) to both functions in `progressions-mode.js`. Added `if (items.length === 0) return` guard for empty groups. Scoped Global All/None and meta count to `visibleProgressions`. (Aug 2026)

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
| Chord data (`CHORD_TYPES`, `INTERVALS`) | `js/data/chords.js` |
| Scale data (`SCALES`, `SCALE_DIRECTIONS`) | `js/data/scales.js` |
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

1. **Interval data file split** — extract `INTERVALS` (and related constants) out of `chords.js` into a dedicated `js/data/intervals.js`, consistent with how `scales.js` was split out. `chords.js` should contain chord data only.

2. **BUG-5** — Fix fragile two-chord VexFlow layout (defer until confirmed causing visible problems)

3. **Mobile-3 testing** — verify Settings opens in all four modes; verify Chord Scales and Voice Leading render full-width on narrow screens; verify desktop layout unchanged

---

## Point 41 — Complete voicing system

#### Status: Complete ✓ (Aug 2026)

**What is done ✓**
- `voicings.js` created — `VOICING_MODES` (all 62), `applyVoicing()` (all groups implemented), `resolveVoicingMode()`
- All six groups correct and confirmed
- `pool.js` — `VOICING_GROUPS` corrected to 6 groups / 62 symbols
- `breakdown.js` — voicing label row reads from `VOICING_MODES.find()`
- `app.js` — `recomputeCurrentNotes()` fully implemented
- `index.html` — load order confirmed correct

**Group 5 resolution (Aug 2026):**
- Chord-tone constraint explicitly rejected — non-chord tones are intentional; ambiguity is the point for quartal/cluster voicings
- `cluster_modal` removed (was identical to `cluster_diaton`; not a distinct category per Persichetti)
- `secundal` redefined: diatonic-step stacking (m2/M2 mix), distinct from `cluster_wt`
- `cluster_wt` added: pure whole-tone stacking (always M2); Debussy/Impressionist flavour
- All Group 5 entries: note count capped at 4 (triads) / 5 (all other chords); range clamped to 2-octave window from bass

**File changed:** `js/engine/voicings.js`

---

#### Voicing groups reference

**Group 1 — Position / Spacing** (3 voicings: `close`, `open`, `spread`) ✓

**Group 2 — Doubling** (4 voicings: `dbl_root_oct`, `dbl_root_above5`, `dbl_fifth`, `dbl_root_wrap`) ✓

**Group 3 — Shell / Rootless** (27 voicings) ✓

**Group 4 — Drop Voicings** (4 voicings: `drop2`, `drop3`, `drop24`, `drop23`) ✓

**Group 5 — Intervallic** (7 voicings) ✓

| # | Voicing | Symbol | Target interval |
|---|---|---|---|
| 39 | Quartal | `quartal` | Perfect fourth (5 st) |
| 40 | Quintal | `quintal` | Perfect fifth (7 st) |
| 41 | Secundal | `secundal` | Diatonic step (m2/M2 mix) |
| 42 | Cluster Chromatic | `cluster_chrom` | Semitone (1 st) |
| 43 | Cluster Diatonic | `cluster_diaton` | Diatonic second |
| 44 | Cluster Pentatonic | `cluster_pent` | Pentatonic step |
| 45 | Cluster Whole-tone | `cluster_wt` | Whole tone, pure M2 |

**Group 6 — Style** (17 voicings) ✓

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

**Group 5 — Intervallic** ✓ (redesign complete — checklist pending full play-through)
- [ ] Quartal
- [ ] Quintal
- [ ] Secundal
- [ ] Cluster Chromatic
- [ ] Cluster Diatonic
- [ ] Cluster Pentatonic
- [ ] Cluster Whole-tone

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

#### Status: Complete ✓ (Aug 2026)

All named entries from `complete_12_TET_piano_scales.md` implemented. See Current Session notes above for full detail.

---

## Parking Lot

- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV
- `RESOLUTION_TARGETS` cleanup — retained as live fallback for voice leading; remove once engine is confirmed stable
- BUG-5 — Resolution notation VexFlow two-chord layout (defer until confirmed causing visible problems)
