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
- **44** Complete chord library — decision & reference file (Session: Aug 2026)
  - `chords_reference.md` created as master checklist for all chord types across all theory traditions
  - Decision: implement every chord in practical music theory; if `chords.js` grows too large, split by family into separate files all feeding into `CHORD_TYPES`
  - Status: reference complete, implementation not yet started — see Point 44 TODO section

- **43** Breakdown default state + full chip sync (Session: Aug 2026)
  - Breakdown panel now starts collapsed by default (removed `open` from `breakdownPanelBody` in `index.html`)
  - All chip selections in dictionary mode and quiz post-answer now trigger full notation + breakdown refresh: chord style chips, interval style chips, scale direction chips (`js/ui/pool.js`), Key/C chip (`js/data/keysig.js`), root/octave chips via `recomputeCurrentNotes()` (`js/modes/progressions-mode.js`). Voicing chips already routed through `recomputeCurrentNotes()` — no extra change needed
  - Files changed: `index.html`, `js/ui/pool.js`, `js/data/keysig.js`, `js/modes/progressions-mode.js`

- **42** Pool panel UX overhaul (Session: Aug 2026)
  - All collapsible sections collapsed by default; sections with any selected items auto-expand on load
  - Global All / None buttons added at the top of every training pool panel (Chords, Intervals, Scales, Progressions), toggling all items across all subcategories at once
  - Root panel now starts collapsed (removed `open` class from `rootPanelBody` in `index.html`)
  - Progression quiz default pool reduced from 8 to 4 most common progressions: I–V–vi–IV, I–IV–V–I, ii–V–I, I–vi–IV–V
  - Files changed: `index.html`, `js/ui/pool.js`, `js/data/progressions.js`, `js/modes/progressions-mode.js`

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

## Where to make changes

The codebase is split into multiple files. When implementing any TODO item below, use this
table to find the right file.

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

1. **Point 38 — 3 remaining fixes** (`js/modes/progressions-mode.js` only, ~10 lines total)
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

4. **Point 41 — Expanded voicing system** (largest scope; resolve "Full/Real" question first; superseded in scope by Point 46 — implement 41 first as a foundation, then extend with 46)

5. **Point 44 — Complete chord library** (work through `chords_reference.md` row by row; split `chords.js` if needed)
   - Add all missing entries to `chords.js` by family
   - Add new pool panel sections for classical / quartal families in `pool.js`
   - Verify breakdown and chord scales logic handles new interval patterns

6. **Point 45 — Complete scale library** (work through `complete_12_TET_piano_scales.md` named-index rows; expand `js/data/scales.js`)
   - Prioritise named/literature scales; mathematical unnamed collections are out of scope for quiz
   - Add new pool panel sections by cardinality group in `pool.js`
   - Verify chord-scales intersection logic still works for new entries

7. **Point 46 — Complete voicing system** (supersedes and extends Point 41; work through `complete_literature_based_piano_chord_voicings.md` section by section)
   - Implement voicing formulas in `js/engine/audio.js` and `js/engine/notation.js`
   - Add voicing chip panel groups in `js/ui/pool.js`
   - Add breakdown voicing explanation row in `js/breakdown/breakdown.js`

8. **BUG-5** — Fix fragile two-chord VexFlow layout in resolution notation (defer until BUG-5
   causes confirmed visible problems in practice)

---

## Parking Lot

- Spaced repetition — weight pool toward weak spots rather than uniform random
- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV

---

## Point 44 — Complete chord library

### Status: Reference complete — implementation not yet started

A comprehensive chord reference file `chords_reference.md` has been created (Aug 2026 session) as the master checklist for every chord type that should be in the app. It was built by cross-referencing the taxonomy document provided, Berklee harmony materials, and other authoritative jazz and classical theory sources.

### Reference file
`chords_reference.md` — lives alongside the plan. Contains every chord family with name, formula, semitone intervals, and an "in app / missing" status column. This is the source of truth for what needs to be implemented.

### Scope
Every chord type in practical music theory, including:
- All triads, seventh chords, extended chords (9th, 11th, 13th) — mostly done
- Added-tone chords (add2, add4, add9, 6/9 variants)
- Sixth chords (maj6, m6, 6/9, m6/9) — partially done
- Augmented 7th (aug7 = 1–3–♯5–♭7) — missing from augmented family
- All altered dominant combinations
- Suspended chord extensions (9sus4, 13sus4, sus2 with 7th)
- Classical chords: Neapolitan (♭II), Italian/French/German augmented sixths
- Quartal, quintal, and cluster chords — require architectural consideration (don't follow standard interval-from-root model; may need a separate rendering path or a dedicated family with a custom note in the breakdown)

### File splitting
If `js/data/chords.js` grows too large, split by family into separate files loaded in `index.html` in order:
- `js/data/chords-basic.js` — triads, seventh chords, sixth chords, added-tone
- `js/data/chords-dominant.js` — dominant, altered dominant, suspended dominant
- `js/data/chords-extended.js` — major extended, minor extended
- `js/data/chords-special.js` — slash, poly, UST
- `js/data/chords-classical.js` — Neapolitan, augmented sixths, quartal/quintal/cluster

All files must expose their entries into the shared `CHORD_TYPES` object so the rest of the codebase requires no changes.

### Implementation steps
1. Work through `chords_reference.md` row by row — every "missing" row becomes a new entry in `chords.js` (or the appropriate split file)
2. Verify breakdown logic in `breakdown.js` handles any new interval patterns correctly
3. Add new families (classical, quartal) to the pool panel in `pool.js` with their own collapsible sections
4. Confirm chord scales logic in `breakdown.js` still works for the new entries
5. Update `chords_reference.md` status column to "in app" as each chord is added

---

## Point 45 — Complete scale library

### Status: Reference complete — implementation not yet started

A comprehensive scale reference file `complete_12_TET_piano_scales.md` exists as the master catalogue for every named pitch collection that should be in the app. It was built from an exhaustive mathematical enumeration of all 2,048 C-rooted subsets of the 12-tone chromatic piano, cross-referenced against established literature (Ian Ring, Aaron Freed, Slonimsky).

### Reference file
`complete_12_TET_piano_scales.md` — lives alongside the plan. Contains a named/literature index of every scale with an established name, including notes, interval pattern, and PC set. The full mathematical table of 2,048 collections is also present but the vast majority are unnamed and out of scope for quiz training.

### Scope
The **named/literature index** (approximately 50 named entries) is the implementation target. This covers:

- Japanese pentatonics: Iwato, In-sen, Hirajoshi, Yo, Ritsu
- Pentatonics: Major, Minor, Dominant, Suspended/Egyptian
- Hexatonics: Tritone Hexatonic, Prometheus Liszt, Major Blues, Minor Blues, Whole Tone, Prometheus/Mystic, Augmented Hexatonic, Messiaen Mode 5
- Heptatonics (diatonic and non-diatonic): all 7 modes (Ionian through Locrian), Harmonic Minor, Melodic Minor, Harmonic Major, Neapolitan Minor, Double Harmonic Major/Byzantine, Spanish/Flamenco/Phrygian-Dominant, Hungarian Minor, Hungarian/Byzantine, Romanian Minor/Ukrainian Dorian, Dorian ♯4, Enigmatic-type, Phrygian ♮6
- Octatonics: Half-Whole Diminished, Messiaen Mode 2, Messiaen Mode 3, Messiaen Mode 4, Messiaen Mode 6
- Any additional named entries already in the app (Augmented scale, Prometheus from Point 28) should be audited against the reference to confirm their interval patterns are correct

**Unnamed mathematical collections** (the bulk of the 2,048 entries) are explicitly out of scope for quiz training — the app teaches music, not combinatorics.

### Relationship to existing scale library
The app currently has 25 scales organised into four cardinality groups (Pentatonic / Hexatonic / Diatonic / Octatonic — Point 28). Point 45 audits and expands that set to match the named-index rows in the reference file, adding missing entries and correcting any interval pattern discrepancies.

### Pool panel structure
New entries follow the existing cardinality-group structure in `pool.js`. Add within the appropriate group (Pentatonic, Hexatonic, Diatonic, Octatonic). If a named scale has an unusual note count (e.g. a 6-note Japanese scale), it goes in the group that matches its note count.

### File splitting
If `js/data/chords.js` already contains `SCALES` alongside chord data, consider splitting scales into `js/data/scales.js` as a standalone file if the data grows large. All entries must feed into the shared `SCALES` object the rest of the codebase reads.

### Implementation steps
1. Audit the current 25 scales against the reference file named index — correct any wrong interval patterns
2. Work through each named-index row that is not yet in the app and add it as a new entry
3. For each new entry verify: interval pattern matches the reference, enharmonic spelling engine handles it correctly, breakdown degree numerals compute correctly
4. Add new pool panel chips in `pool.js` within the appropriate cardinality group
5. Confirm chord-scales intersection logic in `breakdown.js` (`makeChordScalesRow()`) still works for all new entries — the set-intersection algorithm is cardinality-agnostic so this should require no changes
6. Update the reference file status column to "in app" as each scale is added

---

## Point 46 — Complete voicing system

### Status: Reference complete — implementation not yet started

A comprehensive voicing reference file `complete_literature_based_piano_chord_voicings.md` exists as the master catalogue for every documented piano voicing concept. It is literature-grounded (Levine, Felts/Berklee, Ted Greene, Bill Dobbins, Persichetti, Hindemith) rather than a mathematical enumeration, covering 33 sections of voicing types with C examples throughout.

This point supersedes and greatly extends Point 41 (Expanded voicing system). Point 41 should be implemented first as the architectural foundation; Point 46 then completes the system by filling in all remaining voicing categories from the reference.

### Reference file
`complete_literature_based_piano_chord_voicings.md` — lives alongside the plan. Organised into 33 sections with appendices. Key sections for implementation:

| Section | Content |
|---|---|
| 2–5 | Basic triadic voicings, inversions, closed/open position, doubling and spacing |
| 6 | Seventh-chord voicings — all families in close, open, drop, rootless, shell, extended forms |
| 7 | Shell voicings (root+3+7, root+7+3, rootless 3+7) |
| 8 | Three-note voicings (all quality families) |
| 9 | Rootless voicings (maj7, min7, dom7, altered dom) |
| 10–11 | Left-hand and right-hand/melody voicings |
| 12 | Drop voicings: Drop-2, Drop-3, Drop-2&4, Drop-2&3 |
| 13–14 | Extended and altered-dominant voicings |
| 15 | Sus and Phrygian voicings |
| 16 | 6th and 6/9 voicings |
| 17–18 | Quartal and quintal voicings |
| 19 | Upper-structure triads (cross-reference: already a chord family) |
| 20 | Polychords and slash structures (cross-reference: already a chord family) |
| 21 | Pentatonic voicings |
| 22 | So What / modal voicings |
| 23 | Block chords (locked-hands, four-way close, drop-2 block) |
| 24 | Stride and Bud Powell traditions |
| 25 | Classical/chorale-derived voicing (SATB, figured bass, 6/4 chords) |
| 26 | Impressionist / planed / added-tone structures |
| 27 | Clusters and secundal structures |
| 28 | Symmetrical and synthetic structures |
| 29 | Contemporary / pop / gospel / R&B approaches |
| 30 | Voice-leading systems (common-tone, guide-tone, planing, chromatic, constant-structure) |

### Scope decision
Not every section maps to a quiz-mode voicing chip. The scope breaks into three tiers:

**Tier 1 — Voicing chips (implement in pool panel, apply to playback and notation)**
Close, Open, Spread, Shell, Rootless, Drop-2, Drop-3, Drop-2&4, Quartal, Quintal, Secundal/Cluster, So What, Upper Structure (cross-reference only), Pentatonic, Three-note

**Tier 2 — Breakdown explanation only (show description row, no separate chip)**
Left-hand voicings, Right-hand/melody voicings, Block chords, Classical/SATB, Impressionist/planed, Symmetrical structures, Pop/Gospel approaches. These are performance contexts rather than discrete algorithmic voicings; describe them in the breakdown when the closest Tier 1 chip is active.

**Tier 3 — Out of scope for app (rhythmic/performance styles, not static voicing)**
Stride, Bud Powell, Locked-hands, Pedal point (requires multi-chord context). Note in documentation but do not implement as chips.

### Terminology note
The reference file (Appendix B) explicitly warns that terms like "open voicing", "spread voicing", "rootless", "shell", "drop-2", and "quartal" have overlapping and sometimes conflicting meanings across sources. The implementation must choose one consistent definition per chip, document it in the breakdown explanation row, and cite the primary source (Levine for jazz voicings, Felts/Berklee for basic structures).

### Relationship to Point 41
Point 41 defined four chip groups (Structural, Intervallic, Style-specific, Texture-based) and raised the open "Full/Real" naming question. Point 46 resolves this:
- **Full** → rename to **Close** (all notes within one octave, classical default; Appendix A, Section 4)
- **Real** → rename to **Open** (notes spread over more than one octave; Section 4)
- **Guide** → rename to **Rootless** (already noted in Point 41)
- All other Point 41 chip names are confirmed by the reference and kept as-is

### Voicing chip panel — final group structure (resolves Point 41)

**Group 1 — Structural** (from Point 41 + Section 4, 12 of reference)
Close, Open, Shell, Rootless, Drop-2, Drop-3, Drop-2&4, Spread, Three-note

**Group 2 — Intervallic** (from Point 41 + Sections 17–18, 27–28 of reference)
Quartal, Quintal, Secundal, Cluster, So What

**Group 3 — Style-specific** (from Point 41 + Sections 22–24, 29 of reference)
So What (modal), Bill Evans, Kenny Barron, Herbie Hancock, McCoy Tyner, Gospel, Pop Piano

**Group 4 — Texture-based** (from Point 41 — cross-reference existing chord families)
Triad over Bass (→ Slash chords), Upper Structure Triads (→ UST), Octave Doubling, Dense Extended

### Files to change
| Change | File |
|---|---|
| Voicing formulas, note generation per voicing type | `js/engine/audio.js` |
| Notation rendering for non-standard voicings | `js/engine/notation.js` |
| Voicing chip panel groups (collapsible, All/None, Random) | `js/ui/pool.js` |
| Voicing explanation row in breakdown | `js/breakdown/breakdown.js` |
| Voicing state variable | `js/engine/state.js` |

### Implementation steps
1. Resolve Full/Real → Close/Open rename (update chip labels in `pool.js`, update state variable in `state.js`)
2. Implement Tier 1 voicings one group at a time — start with Structural (Drop-2, Drop-3, Drop-2&4, Spread, Three-note), as these are purely algorithmic transformations of the existing note array
3. Add Intervallic voicings (Quartal, Quintal, Secundal, Cluster) — these require generating notes from intervals rather than from the chord's standard formula; may need a separate note-generation path in `audio.js`
4. Add Style-specific voicings (So What, Bill Evans, Kenny Barron, etc.) — implement as fixed interval formulas applied above the chord root or shell; cross-check formulas against the reference
5. Add voicing explanation row to breakdown for all Tier 1 voicings (name, structural rule, musical context, source citation)
6. Add Tier 2 breakdown descriptions for Block, Classical, Impressionist, Pop/Gospel — displayed when the nearest Tier 1 chip is active, not as separate chips
7. Update `chords_reference.md` and this plan as each voicing is confirmed working
