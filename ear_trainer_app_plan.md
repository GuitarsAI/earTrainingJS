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
- **37** Voice leading panel — *partially implemented, being redesigned* (see TODO below)
- **38** Chord progression mode — *partially implemented* (see TODO below)
- **39** Extended / compound intervals: 7 new entries: m9, M9, A9/♯9, P11, A11/♯11, m13, M13. Pool panel split into "Simple intervals" and "Extended / Compound" sections (compound collapsed and unselected by default). Breakdown: "Simple equivalent" row replaces inversion row for compound intervals. INTERVAL_CONSONANCE and INTERVAL_CONTEXT extended to cover all new semitone values
- **Tab order** Tabs reordered to Intervals | Chords | Scales (was Chords | Intervals | Scales); Intervals is now the default landing mode
- **Mobile** Full mobile responsive pass: fixed bottom play bar removed; dark mode toggle moved to score bar on mobile (duplicate button, CSS show/hide per breakpoint, JS syncs both); root panel open on desktop / collapsed on mobile via JS boot; all root chips visible via flex-wrap grid (was hidden horizontal scroll); dynamic body padding-top driven by actual sticky header height; default root set to C

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

#### BUG-2 — Progression mini-stave notation: wrong spelling, always sharps, flat detection broken
**Symptom:** Progression notation showed notes spelled as sharps even in flat keys (Bb → A#,
Eb → D#, etc.). VexFlow errors were silently swallowed, leaving blank stave cells.
**Root cause:** `showProgressionNotation()` used a raw sharp-name array
(`['c','c#','d','d#',...]`) instead of the proper `midiToVexKeySpelled()` pipeline.
Accidental detection used a broken `k.includes('b') && !k.startsWith('b')` guard that
misfired on the note B natural. No key signature support at all.
**Fix:** Replaced the raw array with `midiToVexKeySpelled()` + `respellForKeySig()` +
`isCoveredByKeySig()` — identical pipeline to all other modes. Added `progKeySigMode`
state variable in `js/engine/state.js`, wired Key/C chips for progressions, added `stave.addKeySignature()`.
Changed `catch(e) {}` to `console.warn(...)` to surface errors during testing. (Session: Aug 2026)

#### BUG-3 — Interval notation: two notes render on same staff position in Key mode
**Symptom:** When Key mode is active for intervals, certain enharmonic spellings (e.g. Db → Ebb
for a minor 2nd) caused both notes to render on the exact same D line. The note on the E space
also showed a double-flat glyph instead of a single flat (or no accidental at all).
**Root cause:** `respellForKeySig()` tried to simplify double accidentals by finding a
single-accidental enharmonic at the same pitch class. For Ebb (pc 2), the only candidate was
D natural (pc 2) — which is on a different staff position and collides with Db. The cross-letter
natural fallback was running before the same-letter strip, so Ebb → D rather than Ebb → Eb.
Additionally, `spellMidi()` was not tracking whether a same-letter simplification had occurred,
so `addAccidentalsFiltered()` had no way to know it needed to force-draw the remaining single
accidental on top of what the key sig already provides.
**Fix (Aug 2026):**
- `respellForKeySig()`: reordered priorities — cross-letter covered candidate first, then
  same-letter one-step strip (ebb → eb, x## → x#), then cross-letter natural last resort.
  This ensures staff position is always preserved when a same-letter simplification exists.
- `spellMidi()` (and equivalents in poly notation and progression mini-staves): now returns
  `{ key, forcedAcc }` instead of a plain string. `forcedAcc=true` when a same-letter
  double→single simplification occurred.
- `addAccidentalsFiltered()`: when `forcedAcc=true`, bypasses `isCoveredByKeySig()` and
  draws the accidental unconditionally — key sig provides one flat on E, the drawn flat
  signals the second, correctly communicating Ebb to the reader.
**Status:** Fixed. ✓

#### BUG-4 — Resolution notation: Key/C chip selection has no effect
**Symptom:** Clicking Key or C while the resolution notation is showing (after clicking
"Resolve →") doesn't change the notation. Accidentals are always shown inline regardless
of key sig mode.
**Root cause:** `renderResolutionNotation()` called `midiToVexKeySpelled()` directly but
never called `respellForKeySig()`. `stave.addKeySignature()` was never called. The
`chordKeySigMode` state was completely ignored in this code path.
**Fix (Aug 2026):** `renderResolutionNotation()` in `js/modes/progressions-mode.js` now fully wires `chordKeySigMode`:
computes `keySigStr` and `coveredLetters` from it, calls `respellForKeySig()` on every
note, calls `stave.addKeySignature()` on both treble and bass staves when Key mode is
active. Verified by `// BUG-4 fix` comment in code.
**Status:** Fixed. ✓

---

### Open Bugs 🔴

#### BUG-5 — Resolution notation: VexFlow two-chord layout is fragile
**Symptom:** Source and resolution chords sometimes render in wrong positions or overlap.
**Root cause:** Uses a single stave with `[srcNote, BarNote, tgtNote]` as half-notes in
one voice. `BarNote` inside a single voice is fragile in VexFlow and the Formatter
misbehaves with it.
**Fix approach:** Use two separate stave segments or two independent voices.
**Status:** Not yet fixed. Deferred — needs more testing to confirm whether it causes
visible problems in practice before prioritising the fix.

#### BUG-6 — Progression: breakdown panel not shown post-answer
**Symptom:** After submitting an answer in Progressions quiz mode, the breakdown panel
never appeared. Dictionary mode also showed no breakdown for progressions.
**Root cause (multi-part):**
- `showBreakdown()` had no `progressions` branch — fell through to chord branches which
  read `currentChord.family` without null guards, crashing silently
- The progressions branch was initially inserted after the chord family branches (POLYCHORDS,
  UST, SLASH) — crash happened before the branch was ever reached
- `submitProgressionAnswer()` never called `showBreakdown()` — only `showProgressionNotation()`
- `dictShowProgression()` also never called `showBreakdown()`
- `submitProgressionAnswer()` set `progAnswered = true` but never set global `answered = true`
- `updateStatsTable()` called at line 255 does not exist — correct call is `updateScore()`;
  this crashed the submit handler before notation or breakdown were ever reached
**Fix (Aug 2026):**
- `js/modes/progressions-mode.js`: replaced `updateStatsTable()` with `updateScore()`;
  added `answered = true` after scoring; added `showBreakdown()` after
  `showProgressionNotation()` in both `submitProgressionAnswer()` and `dictShowProgression()`
- `js/breakdown/breakdown.js`: added `progressions` branch to `showBreakdown()` with
  per-chord rows (degree label, chord name, notes, intervals from root, harmonic function,
  chord scales). Added `HARMONIC_FUNCTION` table, `progFunctionNote()`, `qualityFullName()`
  helpers above `showBreakdown()`. Moved progressions branch above all chord family
  branches so it fires before any `currentChord.family` access.
**Status:** Fixed. ✓

#### BUG-7 — Progression notation: staves missing clef, misaligned, cut off, treble only
**Symptom:** Mini staves in progression notation render without a clef symbol. Cells are
inconsistently sized and notes are clipped at the bottom. Only treble clef is used
regardless of the register of the notes.
**Root cause:** `showProgressionNotation()` never calls `addClef()`. Container height is
fixed at 100px which is too small for low-register notes or grand staff. No logic to
detect whether bass or grand staff is needed based on MIDI range.
**Also:** `notationPanel` and `notationArea` were being set to `display: ''` (empty string)
instead of `'block'`, causing the notation to stay hidden entirely. Fixed in the split codebase (Aug 2026).
**Fix approach:** Rewrite `showProgressionNotation()` as a single continuous score:
- One clef decision for the whole progression based on the union of all MIDI notes
  across all chords (treble / bass / grand staff — same threshold logic as `showNotation()`)
- One wide SVG with a single stave (or grand staff pair), clef at the left, key sig
  after it, then chord 1 — barline — chord 2 — barline — etc.
- Chord label drawn as SVG text above each chord's x-position on the staff showing both
  numeral + quality AND the actual chord name with root, e.g. "V maj — G" or two lines:
  "V maj" / "G major" — so the user sees both harmonic function and absolute pitch identity
- Width scales with number of chords; existing horizontal scroll handles overflow
- Height: single staff for treble/bass only; grand staff height when needed
- No more separate per-chord cell divs
**Status:** Partially fixed (display bug fixed Aug 2026). Notation redesign not yet done.

---

## Where to make changes

The codebase is now split into multiple files. When implementing any TODO item below,
use this table to find the right file.

| Area | File |
|---|---|
| All state variables | `js/engine/state.js` |
| Selected pool defaults | `js/engine/defaults.js` |
| Shared helpers (`pickRandom`, `chooseRootMidi`, etc.) | `js/engine/helpers.js` |
| Audio playback | `js/engine/audio.js` |
| Notation rendering (VexFlow, `showNotation`) | `js/engine/notation.js` |
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

### Point 37 — Voice leading panel (redesign)

The current implementation uses a lookup table (`RESOLUTION_TARGETS`) for resolution
targets and a nearest-note algorithm for voice leading. Both are being replaced with
a smarter hybrid system based on the following decisions:

#### Resolution timing
- The current pause (0.7s after 1.8s source chord = ~2.5s total) is too long and
  breaks the sense of harmonic motion
- Tighten to approximately **1.2s source + 0.3s pause**, or allow overlap
  (source chord gives way directly to resolution without silence)

#### Resolution targets — hybrid algorithm
Replace the static `RESOLUTION_TARGETS` lookup table with an algorithmic approach,
falling back to a lookup table only for exotic/ambiguous cases:

**Algorithm (runs first):**
1. Detect the **tritone** in the chord — its two notes have unambiguous tendencies
   (augmented 4th expands, diminished 5th contracts) and directly imply the
   resolution root
2. If no tritone, find the **strongest dissonance** present and resolve accordingly
3. Fall back to conventional harmonic motion (P4 up for dominant function) if no
   clear tension is found

**Lookup table (exception whitelist only):**
- Augmented chords (three enharmonically equal resolutions — algorithm can't pick one)
- Polychords and USTs (no single clear resolution target)
- Sus chords (tension ambiguous by design)
- Power chords (no harmonic information)
- Any case where the algorithm produces a musically wrong result

New chord types added to the quiz will automatically receive reasonable voice leading
without touching the exception table.

#### Voice leading — hybrid algorithm + lookup table

Same hybrid principle as resolution targets: the algorithm runs first, the lookup
table catches cases it gets wrong. New chord types are handled automatically; the
table grows only when the algorithm produces a musically wrong result.

Replace the current nearest-note-only approach with a **constraint satisfaction** model:

**Hard constraints (must satisfy):**
- Tendency tones resolve in their natural direction:
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

Show **all plausible resolution options** ranked by commonality. The most common
one plays automatically. Clicking another plays it instead and updates the notation
and voice leading arrows.

**Ranking order (universal, no style selector needed):**
1. Functional resolution (tritone-driven, e.g. V→I) — always first, plays on load
2. Deceptive cadence (e.g. V→vi)
3. Modal / jazz alternatives (tritone sub, backdoor dominant, etc.)
4. Exotic resolutions

**UI — resolution pills (chips):**
- Rendered as clickable chips consistent with the existing chip/pill design system
- First pill pre-selected and highlighted with the active chip style
- Label format: **chord name + cadence type**, e.g.:
  - `C  (V→I)`
  - `Am  (deceptive)`
  - `D♭  (tritone sub)`
- This passively teaches cadence names while the user explores
- Voice leading arrows update to reflect the selected resolution only (not all simultaneously)

**Notation:**
- Clicking a pill immediately updates notation to show source → selected resolution
  side by side (existing two-chord notation layout)
- The "Resolve →" play button plays whichever pill is currently selected

---

### Point 38 — Chord progression mode

#### Status: Partially implemented
The following is already working:
- `PROGRESSIONS` data (original collection — cadences through extended)
- `playProgression()` / `playProgressionSlowly()` — audio playback
- `generateProgressionQuestion()` — random progression, random root, slot state
- `renderProgressionAnswerUI()` — per-slot degree + quality chip grid, Submit, Hear Slowly
- `submitProgressionAnswer()` — grading, green/red per slot, revealed correct answer, scoring, Next
- `showProgressionNotation()` — notation display (display bug fixed Aug 2026; redesign pending per BUG-7)
- Key/C chip support for progression notation
- Dictionary mode (`dictShowProgression`, `renderDictProgressionPoolPanel`) — wired
- Pool panel: collapsible sections, two-line chips (symbol + name) unified across quiz and dict modes (fixed Aug 2026)

#### Still to do:
- **BUG-7 notation redesign**: rewrite `showProgressionNotation()` as a single continuous
  score (see BUG-7 above for full spec)
- **`recomputeCurrentNotes()` progressions branch**: changing the root chip in
  progressions mode does not retranspose and re-render. Add a progressions case
  that mirrors the other modes.
- **Root badge spelling**: `dictShowProgression` uses raw `NOTE_NAMES[pc]` (always
  sharps). Should use `spelledRoot(pc)`.
- **Expanded progression collection**: add all progressions from the genre reference
  (see full list below)

#### Completed (Aug 2026):
- ✓ `showProgressionNotation()` display bug fixed (was `display: ''` instead of `'block'`)
- ✓ Key/C chip support for progression notation
- ✓ Dictionary mode wired (`dictShowProgression`, `renderDictProgressionPoolPanel`)
- ✓ Pool panel: collapsible sections, two-line chips, unified quiz + dict appearance
- ✓ **BUG-6 fixed**: breakdown panel now appears in both quiz and dictionary mode
  (see BUG-6 above for full details)

#### Overview
New **Progressions** tab added to the mode tab bar: Intervals | Chords | Scales | **Progressions**.
Fixed collection of common progressions, granularly selectable via the pool panel (same
chip pattern as all other modes). Available in both **Quiz** and **Dictionary** modes.

#### Playback
- Play button plays the **whole progression** once, with a short gap between chords
- **No loop** — user re-listens by pressing the main play button again
- Root is **randomised per question** (same as chord/interval/scale modes)
- Chord vocabulary: **triads and 7th chords only** (no extensions beyond 7th)

#### What the user identifies
- **Degree in Roman numerals + chord quality** for each chord in the progression
- e.g. `V 7`, `ii m7`, `I maj` — not absolute roots

#### Answer UI — two-step chip selection per chord slot
Each chord slot gets a two-step selection:
1. **Degree chip**: `I  ii  iii  IV  V  vi  vii°  ♭VII` etc.
2. **Quality chip**: `maj  m  7  maj7  m7  dim  aug  sus4` etc.

#### Scoring & feedback
- Correct only if **all chord slots are right** — partial answers do not score
- Each slot turns green (correct) or red (wrong) independently
- Correct answer revealed in red slots

#### Notation
- Single continuous score (after BUG-7 redesign): one stave or grand staff, clef at left,
  key sig, chords separated by barlines, chord labels above each bar
- Each chord label shows **both** Roman numeral + quality AND chord name with root,
  e.g. "V maj / G major" — harmonic function and absolute pitch identity together
- Key/C chips control key signature (tonic major key when Key is active)
- Clef chosen once for the whole progression based on overall MIDI range

#### Pool panel
- Same collapsible chip panel as other modes
- Two-line chips: Roman numeral symbol on top, style/cadence name below
- Unified appearance in both quiz mode (multi-select + All/None) and dictionary mode (single-select)
- Progressions grouped by style (see collection below)

#### Open questions
- Scoring: partial credit per chord slot, or all-or-nothing per progression? (currently all-or-nothing)

---

#### Full progression collection (2–6 chords)

Chord vocabulary: triads and 7th chords only. Complex extensions (9ths, altered dominants,
augmented sixths) represented as their simpler triad/7th equivalents.
8-chord progressions (12-bar blues, 16-bar blues, full rhythm changes) deferred to Parking Lot.

---

**Cadences (2 chords):**
- `V–I` (Perfect Authentic)
- `V7–I` (Perfect Authentic, dom7)
- `IV–I` (Plagal)
- `I–V` (Half)
- `ii–V` (Half, jazz)
- `IV–V` (Half, rock/pop)
- `vi–V` (Half, minor)
- `V–vi` (Deceptive)
- `V7–vi` (Deceptive, dom7)
- `iv–V` (Phrygian half)

**Diminished & half-diminished (2 chords):**
- `vii°–I`
- `vii°7–I`
- `vii°7–i`
- `iiø7–V`
- `iiø7–V7`
- `iiø7–i`
- `♯iv°–V`

**Classical (3–6 chords):**
- `I–V–I`
- `I–IV–V–I`
- `I–ii–V–I`
- `I–vi–ii–V–I`
- `I–IV–I–V–I`
- `viio–I` (leading-tone dim)
- `iii–vi–ii–V–I` (circle of fifths)
- `vi–ii–V–I` (circle of fifths short)
- `I–V–vi–iii–IV–I–IV–V` (Romanesca / Pachelbel — 8 chords, defer)

**Short progressions (3 chords):**
- `I–IV–V`
- `I–V–vi`
- `i–VII–VI`
- `I–vi–V`
- `I–IV–I`
- `I–V–IV`
- `IV–V–vi`
- `i–♭VII–i` (modal)

**Pop (4 chords):**
- `I–V–vi–IV` (axis / four chords)
- `vi–IV–I–V`
- `I–vi–IV–V`
- `I–IV–vi–V`
- `I–iii–IV–V`
- `I–iii–vi–IV`
- `I–IV–I–V`
- `vi–IV–I–V`
- `I–iii–vi–IV`
- `vi–I–V–IV`
- `IV–I–V–vi`
- `I–vi–ii–V` (pop/jazz ballad)
- `vi–ii–V–I`
- `IV–I–ii–V`

**Rock (4 chords):**
- `I–♭VII–IV` (mixolydian rock)
- `I–IV–V` — already in Short
- `I–♭III–IV`
- `i–♭VII–♭VI`
- `I–V–vi–IV` — shared with Pop
- `I–♭III–♭VII`
- `i–♭VI–♭VII`
- `i–♭VII–IV`
- `ii–IV–I–V` (gospel)
- `I–VII–IV–I` (mixolydian)

**Jazz (4–6 chords):**
- `ii–V–I` — already in Cadences
- `ii–V–i` (minor ii–V–I)
- `iii–vi–ii–V–I` (cycle)
- `I–vi–ii–V` (rhythm changes A)
- `vi–ii–V–I`
- `I–VI7–ii–V` (turnaround with secondary dom)
- `iii–VI–ii–V` (cycle short)
- `i–iv–VII–III` (minor jazz)
- `i–iiø7–V7–i` (minor ii–V–I)
- `ii–♭VII7–I` (backdoor dominant)
- `iiø7–V7–i` — already in Diminished
- `i–VI–iiø7–V` (minor jazz)
- `ii–V–I–vi–ii–V` (jazz loop — 6 chords)

**Blues (4–6 chords):**
- `I7–IV7–I7–V7` (jazz blues turnaround)
- `I7–VI7–ii7–V7` (jazz blues)
- `I–V–IV–IV` (eight-bar blues short)
- `I–V–I–V` (eight-bar turnaround)
- `I–IV–I–V` (quick change — 4 chords)
- `IV–IV–I–I` (blues middle)
- `V–IV–I–V` (blues ending)

**Minor (4 chords):**
- `i–VII–VI–VII`
- `i–VI–III–VII`
- `i–iv–v–i`
- `i–VI–VII–i`
- `i–III–VII–VI`
- `i–v–VI–VII`
- `i–iv–VII` — already in Short
- `i–VI–III–VII` (Aeolian)
- `i–IV` (Dorian)
- `i–VII–IV` (Dorian)

**Reggae (3–4 chords):**
- `I–V` — already in Cadences
- `I–IV–V`
- `I–vi–IV–V`
- `I–IV–I–V`
- `I–vi–ii–V` (lovers rock)
- `vi–IV–I–V` (lovers rock)
- `i–♭VII` (roots reggae)
- `i–♭VI–♭VII` (roots reggae)
- `I–♭VII–IV` — shared with Rock

**Metal (2–4 chords):**
- `i–♭VII–♭VI`
- `i–♭VI–♭VII`
- `i–iv–♭VII`
- `i–♭II` (Phrygian)
- `i–♭II–♭VII` (Phrygian)
- `i–VI–III–VII` (Aeolian / neoclassical)
- `i–iv–V–i` (harmonic minor)
- `iii–vi–ii–V–i` (neoclassical)
- `i–♭VI` (power)
- `i–V` (harmonic minor cadence)

**Samba (3–5 chords):**
- `I–VI7–ii–V7`
- `I–vi–ii–V`
- `iii–VI7–ii–V`
- `iii–VI–ii–V–I` (circle)
- `vi–ii–V–I` — shared with Jazz
- `I–III7–vi` (passing dominant)
- `ii–V–I` — already in Cadences
- `IV–V–I`

**Bossa Nova (3–5 chords):**
- `ii–V–I` — already in Cadences
- `iii–VI7–ii–V7`
- `I–vi–ii–V`
- `vi–ii–V–I`
- `iiø7–V7–i` — already in Diminished
- `iv–♭VII7–III` (minor bossa)
- `i–VI7–iiø7–V7`

**Extended (5–6 chords):**
- `I–IV–V–IV–I`
- `ii–V–I–IV–V`
- `i–VII–VI–VII–i`
- `I–iii–IV–iv–I–V` (borrowed iv)
- `i–VII–VI–V–i–V` (flamenco — 6 chords)
- `I–IV–viio–iii–vi–ii–V–I` (descending fifths sequence — 8 chords, defer)

---

### Point 40 — Clickable chord scales → Dictionary mode

When the breakdown panel shows the chord scales section (post-answer in quiz, or in
dictionary mode), each scale name is **clickable** and opens that scale in Dictionary
mode for immediate exploration.

#### Behaviour
- Clicking a scale name switches to **Dictionary mode, Scales tab**, loading that scale
  instantly with notation and full breakdown
- Scale opens at the **currently active root** — not the original quiz question root
- **All current settings inherited** — key signature, notation style, direction, etc.
- To return to quiz, user presses the **Quiz toggle** — no extra back button needed
- Quiz session (score, streak, current question) **fully preserved** in memory while
  exploring in Dictionary mode, restored immediately on switching back

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
| Voicing | Description | Already implemented? |
|---|---|---|
| Close | All notes within one octave. Dense, clear, classical | Possibly "Full" — TBC |
| Open | Notes spread over more than one octave. Bigger, less muddy | Possibly "Real" — TBC |
| Shell | Root + 3rd + 7th only | ✓ (existing chip) |
| Rootless | Root omitted; bass player supplies it. Very common in jazz/bossa | ✓ (rename from "Guide") |
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
When any specific voicing is active (not Random), the breakdown panel gains a new row
showing the voicing name, its defining structural rule, and its typical musical context.

Examples:
- **Drop-2**: "Second-highest note dropped an octave. Produces open sound with excellent
  voice leading. Common in jazz and big band arranging."
- **So What**: "Stack of three perfect fourths + major third + perfect fourth (P4–P4–P4–M3–P4).
  Named after Miles Davis's 'So What'. Essential for modal jazz."
- **Bill Evans**: "Highly voice-led; typically 3rd, 7th, 9th, 13th — no root.
  Root supplied by bass. Produces a floating, transparent, harmonically rich texture."
- **Quartal**: "Built from stacked perfect fourths. Avoids the major/minor polarity
  of tertian harmony. Open, modern, modal sound. Associated with McCoy Tyner and Herbie Hancock."

#### Voicings that overlap with existing chord families
- **Rootless** → rename existing "Guide" chip to "Rootless"
- **Upper Structure Triads** → already implemented as a chord family; note in breakdown
  that UST is itself a texture-based voicing technique
- **Slash chords / Triad over Bass** → already implemented as a chord family; cross-reference
  in breakdown
- **Power Chord** → already exists as a chord type; the Power Chord voicing chip would
  apply power-chord spacing to any chord (root + fifth only, drop all other tones)

#### Chord library dependency
The existing chord library already covers extensions to 9ths and 13ths, which is sufficient
for most voicings. Additional chord types may be added incrementally if specific voicings
expose gaps (e.g. very dense extended voicings needing 11ths on non-dominant chords).

---

## Parking Lot

- Spaced repetition — weight pool toward weak spots rather than uniform random
- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV
- 8-chord progressions: 12-bar blues (I–I–I–I / IV–IV–I–I / V–IV–I–I), quick-change
  12-bar, jazz blues 12-bar, 16-bar blues, full rhythm changes (A+bridge)
- Romanesca / Pachelbel (8 chords: I–V–vi–iii–IV–I–IV–V)
- Descending fifths sequence (8 chords: I–IV–viio–iii–vi–ii–V–I)
