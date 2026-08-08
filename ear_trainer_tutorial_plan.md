# The Sound Travels Ear Trainer — App Plan & Status

---

## Changelog

- **1** Notation: exact octaves, auto bass/grand clef, accidentals
- **2** Inversion system: procedural, all chord types, labelled correctly
- **3** Octave range: root oct 2–5, top note < C7, extended chords oct 3+
- **4** Extended chord set — superseded by 9b
- **5** Interval training mode: 12 intervals, 3 playback styles + notation
- **6** Chord playback modes: Block / Ascending / Descending / Broken / Random
- **7** Scale training mode: 18 scales, asc / desc / both
- **8** UX: root badge, Hear Slowly, session stats; Space + Enter shortcuts
- **9** Scale library expansion — reorganised in 28
- **9b** Full chord library rebuild: six families, Berklee symbols
- **10** Granular pool panel: collapsible, per-mode chips, All/None, inversions toggle
- **11** Answer dropdown: auto-submit, green/red feedback, correct answer revealed
- **12** Root note + octave register chips (Rnd | C–B | Low/Mid/High)
- **13** Enharmonic spelling engine: spelledNote(), SYMBOL_SPELLING, VexFlow keys
- **14** Breakdown panel: figured bass header, Notes / From root / Between notes
- **15** Bug fixes: showNotation wrapper, showBreakdown call, outsideClick dedup
- **16** Visual redesign: teal accent, CSS vars, dark/light toggle + localStorage
- **17** Typography: Playfair Display + Inter via Google Fonts
- **18** Logo: base64 inline, dark-mode invert filter
- **19** Layout: sticky header + mode tabs, enlarged play button, collapsible Settings
- **20a** Dark mode contrast lifted for WCAG AA
- **20b** Random direction chip for intervals and scales
- **20c** Notation card fixed to #fff in both themes
- **20.5** New Session button; resetSession() shared with stats Reset
- **21** Responsive pass: rem units, 44px touch targets, < 480px breakpoint
- **21b** Header layout: two-line sticky, title always visible
- **22** Breakdown enrichment (all three modes): intervals, scales, chords
  - Intervals: semitones, degree numeral, inversion, consonance, common context
  - Scales: degree numerals, triad map, modal character, parent scale
  - Chords: interval numerals, Riemannian relations, tritone sub, dim/aug/sus theory
- **23** Voicing modes: Full / Real / Shell / Guide + Random chip — *to be expanded and reorganised in Point 41*
- **24** Tritone label: A4/d5 context-aware, replaces "TT" everywhere
- **25** Slash chords: root-agnostic, 18 types (9 maj + 9 min upper), grand staff
- **25b** Slash playback fix: bass merged into shared pipeline
- **26** Polychords: 8 types, two stacked triads, grand staff, full breakdown. UST: 7 types (I–VII), rootless dom7 shell + upper triad, breakdown with tensions
- **27** Pentatonic section: 7 scales, dual labels for Major/Minor Pentatonic
- **28** Scale library by note count: Pentatonic / Hexatonic / Diatonic / Octatonic. Added Augmented scale and Prometheus
- **29** Qualified Roman numerals throughout: ♭III, ♯IV, ♭VI, ♭VII etc. SEMITONE_TO_ROMAN table; semitoneToDegree(); computeDegreeNumerals(). Degrees row now shown for all scale lengths
- **29b** Context-aware enharmonic labels throughout: intervalAbbr(), semitonesToNumeral(), computeDegreeNumerals() all take symbol param. EIGHT_AS_A5 / NINE_AS_D7 / TRITONE_AS_D5 sets drive context switching. Fixes A5/m6, °VII/M6, d5/A4 across chord From root, Numerals, scale Degrees, UST and polychord breakdowns
- **29c** Interval pool relabelled for enharmonic clarity: "Tritone" → "Tritone (A4 / ♭5)"; "Minor 6th" → "Aug 5th / Minor 6th". INTERVAL_INVERSION_NAME updated to match
- **30** Scale direction bug fix: notation now updates in sync with playback when direction chip changes after answer is revealed
- **31** Dictionary mode: Quiz / Dictionary toggle inline in score bar. Pool panel switches to single-select; selecting a chip immediately shows notation + breakdown. Switching mode tabs resets selection to first item in first group
- **32** Chord notation mirrors playback style: Block → stacked chord; Ascending/Descending → melodic left-to-right sequence; Broken → exact broken pattern (root–top–mid–top)
- **33** Dictionary mode settings re-render wiring complete: voicing chips, chord playback style chips, interval style chips, and scale direction chips all trigger immediate notation + breakdown refresh in dictionary mode
- **34** More polychord types: 16 new entries covering Aug upper/lower and Dom7 upper/lower (both P5 and TT positions). polyQualitySuffix() and polyQualityFull() helpers replace all hardcoded quality checks throughout label generation and breakdown. Contextual notes added: aug symmetry (3 enharmonic roots), dom7 tritone tension
- **35** More UST types — Minor shell [♭3 + ♭7]: IIm, IV, ♭VII, ♭VI upper triads → m7 contexts. Maj7 shell [3 + 7]: II, IIm, V, VIm upper triads → Maj7 contexts. Pool panel split into three UST sections (Dom7 / m7 / Maj7 shell). Breakdown, labels, notation and root badge all adapt per shell quality
- **36** Chord scales breakdown row (all chord families): algorithmic set-intersection against all 25 scales in SCALE_REF. Scale root = chord root (upper root for slash, lower root for poly, implied root for UST); all sounding pitch classes must be contained in the scale. Collapsible "N scales fit ▸" sub-section within breakdown; each row shows scale name + teal tag (neutral/bright/tense/dark/etc.) + faint descriptive note. Applies in quiz (post-answer) and dictionary mode across normal chords, inversions, slash, polychords, and UST
- **37** Voice leading panel — *partially implemented, redesign specced in TODO below*
- **38** Chord progression mode — *substantially complete; 3 small fixes remain (see TODO)*
- **39** Extended / compound intervals: 7 new entries: m9, M9, A9/♯9, P11, A11/♯11, m13, M13. Pool panel split into "Simple intervals" and "Extended / Compound" sections (compound collapsed and unselected by default). Breakdown: "Simple equivalent" row replaces inversion row for compound intervals. INTERVAL_CONSONANCE and INTERVAL_CONTEXT extended to cover all new semitone values
- **Tab order** Tabs reordered to Intervals | Chords | Scales (was Chords | Intervals | Scales); Intervals is now the default landing mode
- **Mobile** Full mobile responsive pass: fixed bottom play bar removed; dark mode toggle moved to score bar on mobile (duplicate button, CSS show/hide per breakpoint, JS syncs both); root panel open on desktop / collapsed on mobile via JS boot; all root chips visible via flex-wrap grid (was hidden horizontal scroll); dynamic body padding-top driven by actual sticky header height; default root set to C
- **42** Pool panel UX overhaul (Session: Aug 2026)
  - All collapsible sections collapsed by default; sections with any selected items auto-expand on load
  - Global All / None buttons added at the top of every training pool panel (Chords, Intervals, Scales, Progressions), toggling all items across all subcategories at once
  - Root panel now starts collapsed (removed `open` class from `rootPanelBody` in `index.html`)
  - Progression quiz default pool reduced from 8 to 4 most common progressions: I–V–vi–IV, I–IV–V–I, ii–V–I, I–vi–IV–V
  - Files changed: `index.html`, `js/ui/pool.js`, `js/data/progressions.js`, `js/modes/progressions-mode.js`
- **43** Dictionary mode full sync — *in progress (Session: Aug 2026)*
  - Breakdown panel starts collapsed; collapses again each time a new dict chip is selected
  - All chips (pool, voicing, playback style, interval style, scale direction, key sig C/Key, inversion) trigger notation + breakdown refresh in both dictionary mode and quiz post-answer
  - `setKeySig()` not yet located — pending share of `js/modes/intervals-mode.js` and `js/modes/scales-mode.js`
  - Files to change: `index.html`, `js/ui/pool.js`, `js/app.js`, and whichever file contains `setKeySig()`

---

## Bug Tracker

### Fixed ✓

#### BUG-1 — Mode switch after Progressions corrupts notation in all other modes
**Symptom:** After visiting the Progressions tab and switching back to Chords/Intervals/Scales,
notation rendered as garbage or was completely blank.
**Root cause:** `showProgressionNotation()` mutated shared DOM without restoring it on exit:
- hid `.notation-scroll` (never re-shown)
- injected `.prog-notation-row` into `#notationArea` (never removed)
- hid `#keysigChipRow` (never re-shown)
- left progression buttons in `#controls` (Submit / Next / Hear Slowly persisted)
**Fix:** Added `teardownProgressionUI()` in `js/modes/progressions-mode.js` — a single idempotent cleanup function that restores all five elements to their baseline state. Called (with `typeof` guard) at the top of `switchMode()` and `setAppMode()` in `js/app.js`. (Session: Aug 2026)

#### BUG-2 — Progression notation: wrong spelling, always sharps, flat detection broken
**Symptom:** Progression notation showed notes spelled as sharps even in flat keys (Bb → A#,
Eb → D#, etc.). VexFlow errors were silently swallowed, leaving blank stave cells.
**Root cause:** `showProgressionNotation()` used a raw sharp-name array instead of the proper
`midiToVexKeySpelled()` pipeline. Accidental detection misfired on the note B natural. No key
signature support at all.
**Fix:** Replaced the raw array with `midiToVexKeySpelled()` + `respellForKeySig()` +
`isCoveredByKeySig()` — identical pipeline to all other modes. Added `progKeySigMode` state
variable, wired Key/C chips for progressions, added `stave.addKeySignature()`. (Session: Aug 2026)

#### BUG-3 — Interval notation: two notes render on same staff position in Key mode
**Symptom:** Certain enharmonic spellings (e.g. Db → Ebb for a minor 2nd) caused both notes to
render on the exact same D line in Key mode.
**Root cause:** `respellForKeySig()` reordered priorities incorrectly — cross-letter natural
fallback ran before same-letter strip, so Ebb → D rather than Ebb → Eb. `spellMidi()` also
wasn't tracking same-letter simplification so `addAccidentalsFiltered()` couldn't force-draw
the remaining accidental.
**Fix (Aug 2026):** Reordered respell priorities. `spellMidi()` now returns `{ key, forcedAcc }`.
`addAccidentalsFiltered()` bypasses key sig coverage when `forcedAcc=true`.

#### BUG-4 — Resolution notation: Key/C chip selection has no effect
**Symptom:** Clicking Key or C while resolution notation is showing doesn't change the notation.
**Root cause:** `renderResolutionNotation()` ignored `chordKeySigMode` entirely — never called
`respellForKeySig()` or `stave.addKeySignature()`.
**Fix (Aug 2026):** `renderResolutionNotation()` now fully wires `chordKeySigMode`: computes
`keySigStr` and `coveredLetters`, calls `respellForKeySig()` on every note, calls
`stave.addKeySignature()` on both staves when Key mode is active.

#### BUG-6 — Progression: breakdown panel not shown post-answer
**Symptom:** After submitting an answer in Progressions quiz mode, the breakdown panel never
appeared. Dictionary mode also showed no breakdown for progressions.
**Root cause (multi-part):** `showBreakdown()` had no `progressions` branch; it was inserted
after chord family branches so it crashed before being reached; `submitProgressionAnswer()`
never called `showBreakdown()`; `updateStatsTable()` (non-existent) was called instead of
`updateScore()`, crashing the handler before notation or breakdown were reached; `answered`
was never set to `true`.
**Fix (Aug 2026):** Replaced `updateStatsTable()` with `updateScore()`; added `answered = true`;
added `showBreakdown()` calls in both `submitProgressionAnswer()` and `dictShowProgression()`;
added `progressions` branch to `showBreakdown()` with per-chord rows (degree label, chord name,
notes, intervals from root, harmonic function, chord scales); moved progressions branch above
all chord family branches.

#### BUG-7 — Progression notation: staves missing clef, misaligned, cut off, treble only
**Symptom:** Mini staves in progression notation rendered without a clef. Cells were
inconsistently sized and notes were clipped. Only treble clef was used regardless of register.
`notationPanel` and `notationArea` were set to `display: ''` instead of `'block'`, keeping
notation hidden.
**Fix (Aug 2026):** `showProgressionNotation()` fully rewritten as a single continuous score:
- One clef decision for the whole progression based on the union of all MIDI notes across
  all chords (treble / bass / grand staff — same threshold logic as `showNotation()`)
- One wide SVG with a single stave or grand staff pair; clef at left, key sig, then
  chord 1 — barline — chord 2 — barline — etc.
- Width scales with number of chords; horizontal scroll handles overflow
- Chord labels rendered as SVG text above each chord slot: Roman numeral + quality (bold,
  larger) on the upper line; absolute root name in teal on the lower line
- `display: ''` bugs corrected to `display: 'block'`
**Status:** Fixed. ✓

---

### Open Bugs 🔴

#### BUG-5 — Resolution notation: VexFlow two-chord layout is fragile
**Symptom:** Source and resolution chords sometimes render in wrong positions or overlap.
**Root cause:** Uses a single stave with `[srcNote, BarNote, tgtNote]` as half-notes in one
voice. `BarNote` inside a single voice is fragile in VexFlow and the Formatter misbehaves.
**Fix approach:** Use two separate stave segments or two independent voices.
**Status:** Deferred — needs more testing to confirm whether it causes visible problems in
practice before prioritising the fix.

---

## Project structure

```
index.html                        — Single HTML page; all script/style tags; DOM skeleton
assets/
  logo.png                        — Site logo (dark-mode inverted via CSS filter)
css/
  base.css                        — CSS variables, resets, typography, theme (light/dark)
  components.css                  — All component styles: panels, chips, notation, breakdown
  mobile.css                      — Breakpoint overrides for < 480px / < 600px
js/
  data/
    chords.js                     — CHORD_TYPES (6 families), INTERVALS, SCALES, CHORD_PLAYBACK_STYLES, INTERVAL_STYLES, SCALE_DIRECTIONS, VOICING_MODES
    spelling.js                   — Enharmonic spelling engine: spelledNote(), spelledRoot(), SYMBOL_SPELLING, midiToVexKeySpelled()
    keysig.js                     — Key signature helpers: vexKeyMajor(), keySigCoveredLetters(), isCoveredByKeySig(), respellForKeySig()
    progressions.js               — PROGRESSIONS array, PROG_DEGREES, PROG_QUALITIES, PROG_GROUPS, PROG_GROUP_COLLAPSED, selectedProgressions Set
  engine/
    state.js                      — All mutable state variables (currentChord, currentMode, appMode, answered, etc.)
    defaults.js                   — Initial values for selectedChords, selectedIntervals, selectedScales (depends on chords.js)
    helpers.js                    — Shared utilities: pickRandom(), chooseRootMidi(), getActivePool(), applyVoicingMode(), resolveVoicingMode(), renderVoicingChips(), resetSession(), updateRootBadge(), stats helpers
    audio.js                      — Audio context init, piano sampler (SoundFont), playChord(), playInterval(), playScale(), playSlowly()
    notation.js                   — VexFlow rendering: showNotation(), renderNotation(), showCurrentView(), setKeySig() (suspected)
  breakdown/
    breakdown.js                  — showBreakdown() dispatcher + per-mode builders: interval, scale, chord (including chord scales row)
  modes/
    chords-mode.js                — generateChordQuestion(), submitChordAnswer(), getChordRootName(), slash/poly/UST label helpers
    intervals-mode.js             — generateIntervalQuestion(), submitIntervalAnswer(), resolveIntervalStyle(), setKeySig() (possibly here)
    scales-mode.js                — generateScaleQuestion(), submitScaleAnswer(), resolveScaleDir(), setKeySig() (possibly here)
    progressions-mode.js          — playProgression(), generateProgressionQuestion(), renderProgressionAnswerUI(), submitProgressionAnswer(), showProgressionNotation(), renderProgressionPoolPanel(), makeProgSection(), renderDictProgressionPoolPanel(), dictShowProgression(), recomputeCurrentNotes(), teardownProgressionUI()
  ui/
    controls.js                   — renderAnswers(), revealDropdownAnswer(), renderControls()
    pool.js                       — renderPoolPanel(), makePoolPanelShell(), makeGlobalAllNone(), makeSection(), makeSectionWithDisplayName(), renderChordPoolPanel(), renderIntervalPoolPanel(), renderScalePoolPanel(), renderChordStyleChips(), renderIntervalStyleChips(), renderScaleDirChips()
    stats.js                      — updateScore(), renderStats()
  app.js                          — switchMode(), setAppMode(), dictLoadSymbol(), dictShow(), renderDictPoolPanel(), makeDictSection(), dictApplyInversion(), renderInversionChips(), renderRegisterPanel(), makeCollapsible(), boot sequence, theme toggle, keyboard shortcuts
```

---

## Where to make changes

The codebase is split into multiple files. When implementing any TODO item below, use this
table to find the right file.

| Area | File |
|---|---|
| All state variables | `js/engine/state.js` |
| Selected pool defaults | `js/engine/defaults.js` |
| Shared helpers (`pickRandom`, `chooseRootMidi`, etc.) | `js/engine/helpers.js` |
| Audio playback | `js/engine/audio.js` |
| Notation rendering (VexFlow, `showNotation`, `setKeySig` — location TBC) | `js/engine/notation.js` |
| Breakdown panel (`showBreakdown`) | `js/breakdown/breakdown.js` |
| Chord data (`CHORD_TYPES`, `INTERVALS`, `SCALES`) | `js/data/chords.js` |
| Enharmonic spelling engine | `js/data/spelling.js` |
| Key signature helpers | `js/data/keysig.js` |
| Progression data (`PROGRESSIONS`) | `js/data/progressions.js` |
| Chord quiz + answer logic | `js/modes/chords-mode.js` |
| Interval quiz + answer logic | `js/modes/intervals-mode.js` |
| Scale quiz + answer logic | `js/modes/scales-mode.js` |
| Progression playback, notation, quiz, dict, `recomputeCurrentNotes`, `teardownProgressionUI` | `js/modes/progressions-mode.js` |
| Answer dropdown, controls rendering | `js/ui/controls.js` |
| Pool panel rendering | `js/ui/pool.js` |
| Score, stats | `js/ui/stats.js` |
| Mode switching, dictionary functions, boot, theme, register panel | `js/app.js` |

---

## TODO

### Point 38 — Chord progression mode (3 fixes remaining)

#### Status: Substantially complete — 3 small targeted fixes outstanding

Everything listed below has been verified by reading the actual source files (Aug 2026 session).
All previously listed "still to do" items are now confirmed done except the three below.

#### Confirmed complete ✓
- ✓ Single continuous score notation (`showProgressionNotation()` fully rewritten — BUG-7 fixed)
- ✓ Key/C chip support for progression notation
- ✓ Grand staff decision based on union of all MIDI notes across whole progression
- ✓ Chord labels above stave: Roman numeral + quality + root name (two SVG text lines per slot)
- ✓ Horizontal scroll for 5+ chord progressions (CSS: `overflow-x: auto` + `flex: 0 0 auto` on `.prog-slot`)
- ✓ Full progression collection: all genres implemented — Cadences, Diminished, Classical, Short, Pop & Rock, Jazz, Blues (including 12-bar, quick-change, jazz 12-bar), Minor, Rock, Reggae, Samba & Bossa, Metal, Extended (including Romanesca/Pachelbel 8-chord and Descending fifths 8-chord)
- ✓ `progFunctionNote()` implemented with full `HARMONIC_FUNCTION` table: covers all 12 semitone degrees with quality-specific overrides (secondary dominants, blues, backdoor dominant, tritone sub context)
- ✓ `dictShowProgression` uses `spelledRoot(pc)` for root badge — already correct
- ✓ Breakdown panel in quiz (post-answer) and dictionary mode: per-chord rows with degree label, chord name, notes, intervals from root, harmonic function, chord scales
- ✓ Audio playback, slow playback, root chip retransposition, pool panel, answer grading

#### Remaining fixes (3 items) — all in `js/modes/progressions-mode.js`

**Fix 1 — Notation label order** (2-line swap in `showProgressionNotation()`)

Currently the two SVG text lines above each chord are ordered with the root name (e.g. `G`) on
top in teal and the Roman numeral + quality (e.g. `V 7`) below in bold. This is pedagogically
inverted — the Roman numeral is what the mode is teaching and should be the most prominent element.

Fix: swap the vertical order so Roman numeral + quality is on top (larger, bold, `--text` colour)
and root name is below (smaller, teal `--accent`). Adjust `y` offsets accordingly.

**Fix 2 — Chord label shows bare root, not full chord name** (1-line change in `showProgressionNotation()`)

The lower label currently shows `chord.rootName` (e.g. `G`), which omits the quality. A musician
expects to see `G7`, `Dm7`, `Cmaj7` etc. — root name plus quality suffix.

Fix: compute `chordDisplayName = rootName + (ct && ct.name !== 'maj' ? ct.name : '')` using the
already-looked-up `ct` object (`ct.name` is the display-ready quality string from `CHORD_TYPES`,
e.g. `'7'`, `'m7'`, `'Maj7'`). Major triads conventionally omit the quality suffix so `'maj'`
maps to `''`. No lookup table needed — reuses existing chord data.

**Fix 3 — Root badge uses sharp-only spelling in quiz mode** (1-word change in `generateProgressionQuestion()`)

`generateProgressionQuestion()` calls `updateRootBadge(showRoot ? NOTE_NAMES[pc] : null)` at
line 89. `NOTE_NAMES` always produces sharps (C#, D#, etc.) instead of the contextually correct
spelling (Db, Eb, etc.).

Fix: replace `NOTE_NAMES[pc]` with `spelledRoot(pc)`, which already handles flat/sharp preference
via `pinnedRootSpelling`. `dictShowProgression()` already does this correctly — quiz mode should match.

---

### Point 37 — Voice leading panel (redesign)

#### Status: Partially implemented — current code works but uses naive nearest-note algorithm

The current implementation has `RESOLUTION_TARGETS` (lookup table), `computeVoiceLeading()`
(nearest-note algorithm), `makeVoiceLeadingRow()`, and `playResolution()` all working. The
redesign below replaces the resolution algorithm and adds an interactive multi-resolution UI.

#### What exists now
- `RESOLUTION_TARGETS` — static lookup: chord symbol → `{ offset, quality, label }`
- `computeVoiceLeading(sourceMidi, targetMidi)` — nearest-note only; no tendency-tone awareness
- `makeVoiceLeadingRow(panel)` — renders a voice leading table in the breakdown panel
- `playResolution()` — plays source chord then resolution chord; "Resolve →" / "← Chord" toggle
- `renderResolutionNotation()` — two-chord notation side by side (BUG-5 affects this)
- Current timing: 1.8s source + 0.7s pause — confirmed too long

#### Resolution timing fix
Tighten to **1.2s source + 0.3s pause** in `playResolution()`. Simple constant change.

#### Resolution targets — hybrid algorithm
Replace `RESOLUTION_TARGETS` with an algorithmic approach, keeping the table only for
exotic/ambiguous cases:

**Algorithm (runs first):**
1. Detect the **tritone** in the chord — its two notes have unambiguous tendencies
   (augmented 4th expands outward, diminished 5th contracts inward) and directly imply the
   resolution root
2. If no tritone, find the **strongest dissonance** present and resolve accordingly
3. Fall back to conventional harmonic motion (P4 up for dominant function) if no clear
   tension is found

**Lookup table (exception whitelist only):**
- Augmented chords (three enharmonically equal resolutions — algorithm can't pick one)
- Polychords and USTs (no single clear resolution target)
- Sus chords (tension ambiguous by design)
- Power chords (no harmonic information)
- Any case where the algorithm produces a musically wrong result

New chord types get reasonable voice leading automatically without touching the table.

#### Voice leading — constraint satisfaction model
Replace nearest-note-only with a **constraint satisfaction** approach:

**Hard constraints (must satisfy):**
- Leading tone (e.g. B in G7) **must rise** by m2 to the tonic
- Chordal 7th (e.g. F in G7) **must fall** by m2
- No two voices resolve to the same pitch class unless doubling rules permit it
- Avoid doubling the 3rd of the target chord; prefer doubling the root

**Soft constraints (scored and minimised):**
- Total semitone motion across all voices (prefer minimal movement)
- Parallel 5ths and octaves (penalise)
- Poor doublings (penalise)

The assignment with the best score after satisfying hard constraints is chosen.

**Example — G7 → C major (correct voice leading):**
```
B  → C   (m2 ↑  — leading tone, hard constraint)
F  → E   (m2 ↓  — chordal 7th, hard constraint)
G  → G   (common tone)
D  → E or G  (flexible — complete the chord, avoid doubling 3rd)
```
The current code incorrectly moves D → C (nearest note) rather than D → E or G.

#### Multiple resolutions — interactive UI
Show **all plausible resolution options** ranked by commonality. The most common one plays
automatically. Clicking another plays it instead and updates the notation and voice leading table.

**Ranking order:**
1. Functional resolution (tritone-driven, e.g. V→I) — always first, plays on load
2. Deceptive cadence (e.g. V→vi)
3. Modal / jazz alternatives (tritone sub, backdoor dominant, etc.)
4. Exotic resolutions

**UI — resolution pills (chips):**
- Clickable chips consistent with the existing chip/pill design system
- First pill pre-selected and highlighted with the active chip style
- Label format: **chord name + cadence type**, e.g. `C (V→I)`, `Am (deceptive)`, `D♭ (tritone sub)`
- Passively teaches cadence names while the user explores
- Voice leading table and notation update to reflect the selected resolution only

**Notation:**
- Clicking a pill immediately updates notation to show source → selected resolution side by side
- The "Resolve →" play button plays whichever pill is currently selected

---

### Point 40 — Clickable chord scales → Dictionary mode

#### Status: Not yet implemented

When the breakdown panel shows the chord scales section (post-answer in quiz, or in dictionary
mode), each scale name is **clickable** and opens that scale in Dictionary mode for immediate
exploration.

#### Behaviour
- Clicking a scale name switches to **Dictionary mode, Scales tab**, loading that scale
  instantly with notation and full breakdown
- Scale opens at the **currently active root** — not the original quiz question root
- **All current settings inherited** — key signature, notation style, direction, etc.
- To return to quiz, user presses the **Quiz toggle** — no extra back button needed
- Quiz session (score, streak, current question) **fully preserved** in memory while
  exploring in Dictionary mode, restored immediately on switching back

#### Implementation notes
- `makeChordScalesRow()` in `js/breakdown/breakdown.js` renders the scale name elements —
  click handlers go here
- Mode switching lives in `js/app.js` (`switchMode()`, `setAppMode()`) — the click handler
  calls these with the target scale symbol and root already set
- No new state variables needed; the existing `currentScale`, `currentScaleRootMidi`, and
  `appMode` are sufficient

---

### Point 41 — Expanded voicing system (Chords mode)

#### Status: Not yet implemented

Replaces and greatly expands the current Point 23 voicing chips (Full / Real / Shell / Guide + Random).
Applies to **Chords mode only** — not progressions or other modes.

#### Open questions (to resolve before implementation)
- **"Full" voicing** — is this close position (all notes within one octave, classical default)?
  Or does it mean something else in the current implementation? Needs clarification before mapping.
- **"Real" voicing** — is this open position (notes spread over more than one octave)?
  Or something else? Needs clarification before mapping to the new system.
- Once clarified, Full and Real will either be renamed to match standard terminology
  (Close / Open) or retired if they duplicate other voicings.

#### Excluded voicings (rhythmic — not applicable to static chord playback)
- **Stride** — alternating bass + chord on beats; a performance style not a voicing
- **Block chords / Locked Hands** — requires a melody line to harmonise; not applicable

#### Voicing chip panel — 4 collapsible groups
Same UI pattern as chord pool panel: collapsible sections, All/None per group, Random chip.

**Group 1 — Structural**
| Voicing | Description | Status |
|---|---|---|
| Close | All notes within one octave. Dense, clear, classical | Possibly "Full" — TBC |
| Open | Notes spread over more than one octave. Bigger, less muddy | Possibly "Real" — TBC |
| Shell | Root + 3rd + 7th only | ✓ existing chip |
| Rootless | Root omitted; bass player supplies it. Very common in jazz/bossa | ✓ rename from "Guide" |
| Drop-2 | Second-highest note dropped an octave. Open sound, excellent voice leading | New |
| Drop-3 | Third-highest note dropped an octave. More guitar/big band, but usable on piano | New |
| Drop-2&4 | Second and fourth voices dropped. Wide, transparent, modern | New |
| Spread | Large intervals throughout. Huge, orchestral feeling | New |

**Group 2 — Intervallic**
| Voicing | Description |
|---|---|
| Quartal | Built from stacked fourths. Modern, modal, open. McCoy Tyner / Herbie Hancock |
| Quintal | Built from stacked fifths. Spacious, cinematic |
| Secundal | Built from stacked seconds. Cluster-like, tense |
| Cluster | Adjacent semitones. Impressionistic, modern jazz, film |
| Tenths | LH plays root + 10th (wide 3rd). Reduces muddiness; stride, jazz, contemporary |

**Group 3 — Style-specific**
| Voicing | Description |
|---|---|
| So What | P4 + P4 + P4 + M3 + P4 stack. Named after Miles Davis. Essential modal jazz |
| Bill Evans | Highly voice-led; typically 3–7–9–13, no root. Floating, rich, transparent |
| Kenny Barron | LH: root + 7. RH: 3–5–9. Warm and smooth |
| Herbie Hancock | Quartal plus clusters. Modern, angular, colorful |
| McCoy Tyner | Powerful quartal stacks in LH. e.g. C–F–Bb–Eb |
| Gospel | Added 2nds, added 6ths, quartal movement, passing diminished. Parallel motion |
| Pop Piano | LH octave, RH: 3–5–9. Standard modern worship/pop ballad voicing |

**Group 4 — Texture-based**
| Voicing | Description | Notes |
|---|---|---|
| Triad over Bass | Simple triad in RH over a different bass note | Overlaps with Slash chords family |
| Upper Structure Triads | Major/minor triad over dominant chord shell | Already a chord family (UST) |
| Pedal Point | Bass stays fixed while upper chords move | Requires multi-chord context |
| Octave Doubling | Chord tones doubled in octaves. Full, orchestral | New |
| Hybrid | Combines open voicing + rootless texture + added extensions | New |
| Dense Extended | Five to seven chord tones including 7th, 9th, 11th, 13th. Rich, jazz ensemble | New |
| Power Chord | Root + fifth only, sometimes doubled | Overlaps with existing power chord type |

#### Random chip
Kept as-is — picks randomly from all enabled voicings in the expanded pool.

#### Breakdown panel — voicing explanation row
When any specific voicing is active (not Random), the breakdown panel gains a new row showing
the voicing name, its defining structural rule, and its typical musical context.

Examples:
- **Drop-2**: "Second-highest note dropped an octave. Produces open sound with excellent voice leading. Common in jazz and big band arranging."
- **So What**: "Stack of three perfect fourths + major third + perfect fourth (P4–P4–P4–M3–P4). Named after Miles Davis's 'So What'. Essential for modal jazz."
- **Bill Evans**: "Highly voice-led; typically 3rd, 7th, 9th, 13th — no root. Root supplied by bass. Produces a floating, transparent, harmonically rich texture."
- **Quartal**: "Built from stacked perfect fourths. Avoids the major/minor polarity of tertian harmony. Open, modern, modal sound. Associated with McCoy Tyner and Herbie Hancock."

#### Voicings that overlap with existing chord families
- **Rootless** → rename existing "Guide" chip to "Rootless"
- **Upper Structure Triads** → already implemented as a chord family; note in breakdown that UST is itself a texture-based voicing technique
- **Slash chords / Triad over Bass** → already implemented as a chord family; cross-reference in breakdown
- **Power Chord** → already exists as a chord type; the Power Chord voicing chip would apply power-chord spacing to any chord (root + fifth only, drop all other tones)

#### Chord library dependency
The existing chord library already covers extensions to 9ths and 13ths, which is sufficient for
most voicings. Additional chord types may be added incrementally if specific voicings expose gaps
(e.g. very dense extended voicings needing 11ths on non-dominant chords).

---

## Recommended implementation order

1. **Point 43 — Dictionary mode full sync** (in progress — needs `intervals-mode.js` and `scales-mode.js` to locate `setKeySig()`)
   - Remove `open` from `breakdownPanelBody` in `index.html`
   - Collapse breakdown panel body after each `dictShow()` and `dictShowProgression()` call
   - Add `showBreakdown()` to chord style, interval style, and scale direction chip handlers in `pool.js`
   - Wire `setKeySig()` to also call `showBreakdown()` after notation update
   - Verify inversion chips and root chips already trigger breakdown (they do via `dictApplyInversion()` and `recomputeCurrentNotes()`)

2. **Point 38 — 3 remaining fixes** (`js/modes/progressions-mode.js` only, ~10 lines total)
   - Fix 1: swap label order in `showProgressionNotation()` SVG text elements
   - Fix 2: compute `chordDisplayName` using `ct.name` instead of bare `rootName`
   - Fix 3: replace `NOTE_NAMES[pc]` with `spelledRoot(pc)` in `generateProgressionQuestion()`

2. **Point 40 — Clickable chord scales** (self-contained, moderate effort)
   - Add click handlers to scale name elements in `makeChordScalesRow()` in `breakdown.js`
   - Wire to mode/tab switching in `app.js`

3. **Point 37 — Voice leading redesign** (largest remaining feature, well-specced)
   - Timing fix (trivial — two constant changes)
   - Constraint satisfaction voice leading algorithm
   - Multiple resolution UI with interactive chips

4. **Point 41 — Expanded voicing system** (largest scope; resolve "Full/Real" question first)

5. **BUG-5** — Fix fragile two-chord VexFlow layout in resolution notation (defer until BUG-5
   causes confirmed visible problems in practice)

---

## Parking Lot

- Spaced repetition — weight pool toward weak spots rather than uniform random
- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV
