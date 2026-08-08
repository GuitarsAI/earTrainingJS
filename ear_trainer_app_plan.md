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
- **38** Chord progression mode — complete ✓ (all fixes confirmed in source Aug 2026)
- **39** Extended / compound intervals: 7 new entries: m9, M9, A9/♯9, P11, A11/♯11, m13, M13. Pool panel split into "Simple intervals" and "Extended / Compound" sections (compound collapsed and unselected by default). Breakdown: "Simple equivalent" row replaces inversion row for compound intervals. INTERVAL_CONSONANCE and INTERVAL_CONTEXT extended to cover all new semitone values
- **Tab order** Tabs reordered to Intervals | Chords | Scales (was Chords | Intervals | Scales); Intervals is now the default landing mode
- **Mobile** Full mobile responsive pass: fixed bottom play bar removed; dark mode toggle moved to score bar on mobile (duplicate button, CSS show/hide per breakpoint, JS syncs both); root panel open on desktop / collapsed on mobile via JS boot; all root chips visible via flex-wrap grid (was hidden horizontal scroll); dynamic body padding-top driven by actual sticky header height; default root set to C
- **44** Complete chord library — decision & reference file (Session: Aug 2026)
  - `chords_reference.md` created as master checklist for all chord types across all theory traditions
  - Decision: implement every chord in practical music theory; if `chords.js` grows too large, split by family into separate files all feeding into `CHORD_TYPES`
  - Status: reference complete, implementation not yet started — see Point 44 TODO section
- **About** About view + ⓘ header button (Session: Aug 2026)
  - ⓘ info-circle button added to sticky header, inline between title and dark/light toggle
  - Always visible on all screen sizes including mobile; dark/light toggle fixed to stay in header on mobile (duplicate score-bar toggle hidden)
  - About view replaces main content area when ⓘ is clicked — same switchMode infrastructure; mode tabs remain visible and clickable to return to training
  - About view cards: Credits + badges, YouTube embed placeholder, Sponsor/donate button + QR placeholder
  - New file: `js/modes/about-mode.js` — `showAbout()`, `hideAbout()`, ⓘ button listener, tab intercept
  - Files changed: `index.html`, `js/modes/about-mode.js` (new), `js/app.js`, `css/components.css`, `css/mobile.css`
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
| Voice leading engine | `js/engine/voiceLeading.js` |
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

### Point 38 — Chord progression mode

#### Status: Complete ✓ (verified by reading source — Aug 2026)

All items confirmed done by reading `js/modes/progressions-mode.js`:

- ✓ Single continuous score notation (`showProgressionNotation()` fully rewritten — BUG-7 fixed)
- ✓ Key/C chip support for progression notation
- ✓ Grand staff decision based on union of all MIDI notes across whole progression
- ✓ Chord labels above stave: Roman numeral + quality on top (bold, prominent); full chord name below in teal (e.g. `G7` not bare `G`) — FIX-1 and FIX-2 confirmed in code at lines 468–496
- ✓ Root badge uses `spelledRoot(pc)` in quiz mode — FIX-3 confirmed at line 89
- ✓ Horizontal scroll for 5+ chord progressions
- ✓ Full progression collection: all genres implemented
- ✓ `progFunctionNote()` with full `HARMONIC_FUNCTION` table
- ✓ Breakdown panel in quiz (post-answer) and dictionary mode
- ✓ Audio playback, slow playback, root chip retransposition, pool panel, answer grading
- ✓ `teardownProgressionUI()` — idempotent cleanup on mode switch (BUG-1 fix)

---

### Point 37 — Voice leading panel (redesign)

#### Status: Engine complete — wiring not yet started

> ⚠️ **See `voice_leading_algorithm_plan.md` for the full algorithm spec before implementing.**
> That document covers: what exists and can be reused, what must be replaced, the 7-step
> pipeline, the constraint satisfaction voice leading model, the build order, and all
> data structures. This section covers the UI spec and integration points only.

**Option B chosen** (full algorithmic context discovery) over Option A (targeted fix), because:
- `SCALES` and `CHORD_TYPES` in `chords.js` are already the exact primitives needed
- `getChordScales()` already does partial context discovery — Option B extends it
- Richer output (all contexts, all resolutions, reason codes) fits the educational mission

#### `js/engine/voiceLeading.js` — COMPLETE ✓
All 7 steps of the algorithm are fully implemented as pure functions. No stubs. No DOM access.
Ready to be wired into `breakdown.js`.

#### What the algorithm replaces
- `RESOLUTION_TARGETS` — hardcoded lookup table → deleted entirely; replaced by `deriveResolutionTargets()` in `voiceLeading.js`
- Proximity loop in `computeVoiceLeading()` → replaced by 7-rule constraint satisfaction engine in `computeVoiceLeadingRules()`
- `getResolutionInfo()` normal chord path → reads cached `analyseChord()` result instead of lookup table

#### Family-by-family handling (decided Aug 2026)
| Family | Approach |
|---|---|
| Normal chords | `analyseChord()` directly — full context discovery + voice leading |
| Slash chords | `analyseChord()` on upper chord pitch classes; upper root as harmonic root; bass note is label modifier only |
| UST | Construct implied pitch classes from `shellIntervals + upperTriadIntervals offset by upperTriadRoot` (all fields present in every UST entry in `CHORD_TYPES`); run `analyseChord()` |
| Polychords | Merge upper + lower pitch class sets; use lower root; skip diatonic context discovery (polychords are polytonal by design — forcing into one scale gives misleading results); run voice leading computation only |
| Aug / sus / power | Stay in `AMBIGUOUS_FAMILIES` whitelist; existing simple resolution logic unchanged |

**Why polychords skip context discovery:** polychords intentionally span two tonal centres.
The educational model is that the user investigates each triad individually, then the polychord
is heard as its own entity — voice leading shows where the notes go without claiming the chord
belongs to one key.

#### Caching
`analyseChord()` result stored in `currentVoiceLeadingAnalysis` state variable. Computed once
when the answer is revealed. Not re-run on every `getResolutionInfo()` call. Reset to null on
each new question.

#### Pass 1 — Data layer (no visual change)
**Goal:** Wire the engine. Existing UI continues to work identically.

1. Add `currentVoiceLeadingAnalysis = null` to state variables; reset on each new chord
2. Call `analyseChord()` when answer is revealed; store in `currentVoiceLeadingAnalysis`
3. Update `getResolutionInfo()` normal chord path — read from cache, pick primary resolution
   (highest tension context + highest strength resolution), map to existing flat shape
   `{ targetRootMidi, targetMidi, targetName, label }` so all callers are unchanged
4. Update `getResolutionInfo()` slash path — same, using upper chord data
5. Update `getResolutionInfo()` UST path — construct implied pitch classes, run `analyseChord()`
6. Update `getResolutionInfo()` poly path — merge pitch classes, use lower root, skip context
   discovery, go straight to voice leading
7. Replace `computeVoiceLeading()` proximity loop — call `computeVoiceLeadingRules()` from
   `voiceLeading.js`, passing the context from `currentVoiceLeadingAnalysis`
8. Delete `RESOLUTION_TARGETS`

**Files changed:** `js/breakdown/breakdown.js` only.
**Visual output:** identical to current.

#### Pass 2 — Multi-resolution pills UI
**Goal:** Surface the full richness of `analyseChord()` output in the breakdown panel.

- `makeVoiceLeadingRow()` renders one pill per resolution context
- Each pill: roman numeral · scale name · cadence name · strength indicator
- Expanding a pill shows the voice leading table for that resolution
- Visual model: follow `makeRiemannRow()` pill pattern already in `breakdown.js`
- `playResolution()` continues to play the single primary resolution — no change to audio

**Files changed:** `js/breakdown/breakdown.js`, `css/components.css`

#### Resolution timing fix (simple)
Tighten to **1.2s source + 0.3s pause** in `playResolution()`. Two constant changes.

#### What exists now (untouched until Pass 1)
- `RESOLUTION_TARGETS` — static lookup: chord symbol → `{ offset, quality, label }`
- `computeVoiceLeading(sourceMidi, targetMidi)` — nearest-note only; no tendency-tone awareness
- `makeVoiceLeadingRow(panel)` — renders a voice leading table in the breakdown panel
- `playResolution()` — plays source chord then resolution chord; "Resolve →" / "← Chord" toggle
- `renderResolutionNotation()` — two-chord notation side by side (BUG-5 affects this)

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

#### Terminology (resolved by Point 46 reference — Aug 2026)
- **Full** → rename to **Close** (all notes within one octave, classical default)
- **Real** → rename to **Open** (notes spread over more than one octave)
- **Guide** → rename to **Rootless** (root omitted; bass player supplies it)
- All other chip names confirmed by reference and kept as-is

#### Voicing chip panel — 4 collapsible groups

**Group 1 — Structural**
| Voicing | Description | Status |
|---|---|---|
| Close | All notes within one octave | ✓ rename from "Full" |
| Open | Notes spread over more than one octave | ✓ rename from "Real" |
| Shell | Root + 3rd + 7th only | ✓ existing chip |
| Rootless | Root omitted; bass player supplies it | ✓ rename from "Guide" |
| Drop-2 | Second-highest note dropped an octave | New |
| Drop-3 | Third-highest note dropped an octave | New |
| Drop-2&4 | Second and fourth voices dropped | New |
| Spread | Large intervals throughout | New |

**Group 2 — Intervallic**
| Voicing | Description |
|---|---|
| Quartal | Built from stacked fourths |
| Quintal | Built from stacked fifths |
| Secundal | Built from stacked seconds |
| Cluster | Adjacent semitones |
| Tenths | LH plays root + 10th |

**Group 3 — Style-specific**
| Voicing | Description |
|---|---|
| So What | P4 + P4 + P4 + M3 + P4 stack |
| Bill Evans | 3rd, 7th, 9th, 13th — no root |
| Kenny Barron | LH: root + 7. RH: 3–5–9 |
| Herbie Hancock | Quartal plus clusters |
| McCoy Tyner | Powerful quartal stacks in LH |
| Gospel | Added 2nds, added 6ths, quartal movement, passing diminished |
| Pop Piano | LH octave, RH: 3–5–9 |

**Group 4 — Texture-based**
| Voicing | Description | Notes |
|---|---|---|
| Triad over Bass | Simple triad in RH over a different bass note | Overlaps with Slash chords family |
| Upper Structure Triads | Major/minor triad over dominant chord shell | Already a chord family (UST) |
| Octave Doubling | Chord tones doubled in octaves | New |
| Dense Extended | Five to seven chord tones including 7th, 9th, 11th, 13th | New |

#### Files to change
| Change | File |
|---|---|
| Voicing formulas, note generation per voicing type | `js/engine/audio.js` |
| Notation rendering for non-standard voicings | `js/engine/notation.js` |
| Voicing chip panel groups (collapsible, All/None, Random) | `js/ui/pool.js` |
| Voicing explanation row in breakdown | `js/breakdown/breakdown.js` |
| Voicing state variable | `js/engine/state.js` |

#### Implementation steps
1. Rename Full/Real/Guide chips (update chip labels in `pool.js`, update state variable in `state.js`)
2. Implement Tier 1 voicings one group at a time — start with Structural (Drop-2, Drop-3, Drop-2&4, Spread, Three-note)
3. Add Intervallic voicings (Quartal, Quintal, Secundal, Cluster)
4. Add Style-specific voicings (So What, Bill Evans, Kenny Barron, etc.)
5. Add voicing explanation row to breakdown for all Tier 1 voicings
6. Add Tier 2 breakdown descriptions for Block, Classical, Impressionist, Pop/Gospel
7. Update `chords_reference.md` and this plan as each voicing is confirmed working

---

## Recommended implementation order

1. **Point 48 — Collapsible breakdown sub-sections** (self-contained, affects chords + scales only)
   - Do this first as it restructures the breakdown panel that Point 47 and 37 will add into

2. **Point 47 — Harmonic field in scale breakdown** (depends on Point 48 structure being in place)

3. **Point 40 — Clickable chord scales** (self-contained, moderate effort)
   - Add click handlers to scale name elements in `makeChordScalesRow()` in `breakdown.js`
   - Wire to mode/tab switching in `app.js`

4. **Point 37 — Voice leading redesign** (Option B — full algorithmic context discovery)
   > **Read `voice_leading_algorithm_plan.md` before starting any of these steps.**
   - **Pass 1:** Wire engine to `breakdown.js` — data layer only, no visual change
   - **Pass 2:** Multi-resolution pills UI in `makeVoiceLeadingRow()`
   - **Timing fix:** 1.2s source + 0.3s pause — trivial, do in Pass 1
   - **BUG-5:** Defer unless confirmed causing visible problems

5. **Point 41 — Expanded voicing system** (largest scope; superseded in scope by Point 46 — implement 41 first as foundation, then extend with 46)

6. **Point 44 — Complete chord library** (work through `chords_reference.md` row by row; split `chords.js` if needed)

7. **Point 45 — Complete scale library** (work through `complete_12_TET_piano_scales.md` named-index rows)

8. **Point 46 — Complete voicing system** (supersedes and extends Point 41; work through `complete_literature_based_piano_chord_voicings.md`)

9. **BUG-5** — Fix fragile two-chord VexFlow layout (defer until confirmed causing visible problems)

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

A comprehensive chord reference file `chords_reference.md` has been created (Aug 2026 session)
as the master checklist for every chord type that should be in the app.

### Reference file
`chords_reference.md` — lives alongside the plan. Contains every chord family with name,
formula, semitone intervals, and an "in app / missing" status column.

### Scope
Every chord type in practical music theory, including:
- All triads, seventh chords, extended chords (9th, 11th, 13th) — mostly done
- Added-tone chords (add2, add4, add9, 6/9 variants)
- Sixth chords (maj6, m6, 6/9, m6/9) — partially done
- Augmented 7th (aug7 = 1–3–♯5–♭7) — missing from augmented family
- All altered dominant combinations
- Suspended chord extensions (9sus4, 13sus4, sus2 with 7th)
- Classical chords: Neapolitan (♭II), Italian/French/German augmented sixths
- Quartal, quintal, and cluster chords

### File splitting (if chords.js grows too large)
- `js/data/chords-basic.js` — triads, seventh chords, sixth chords, added-tone
- `js/data/chords-dominant.js` — dominant, altered dominant, suspended dominant
- `js/data/chords-extended.js` — major extended, minor extended
- `js/data/chords-special.js` — slash, poly, UST
- `js/data/chords-classical.js` — Neapolitan, augmented sixths, quartal/quintal/cluster

All files must expose their entries into the shared `CHORD_TYPES` object.

### Implementation steps
1. Work through `chords_reference.md` row by row
2. Verify breakdown logic in `breakdown.js` handles any new interval patterns correctly
3. Add new families (classical, quartal) to the pool panel in `pool.js`
4. Confirm chord scales logic in `breakdown.js` still works for the new entries
5. Update `chords_reference.md` status column to "in app" as each chord is added

---

## Point 45 — Complete scale library

### Status: Reference complete — implementation not yet started

A comprehensive scale reference file `complete_12_TET_piano_scales.md` exists as the master
catalogue for every named pitch collection that should be in the app.

### Scope
The **named/literature index** (approximately 50 named entries) is the implementation target:
- Japanese pentatonics: Iwato, In-sen, Hirajoshi, Yo, Ritsu
- Pentatonics: Major, Minor, Dominant, Suspended/Egyptian
- Hexatonics: Tritone Hexatonic, Prometheus Liszt, Major Blues, Minor Blues, Whole Tone, Augmented Hexatonic, Messiaen Mode 5
- Heptatonics: all 7 modes, Harmonic Minor, Melodic Minor, Harmonic Major, Neapolitan Minor, Double Harmonic Major/Byzantine, Spanish/Flamenco/Phrygian-Dominant, Hungarian Minor, Romanian Minor/Ukrainian Dorian, Dorian ♯4, Phrygian ♮6
- Octatonics: Half-Whole Diminished, Messiaen Mode 2, Messiaen Mode 3, Messiaen Mode 4, Messiaen Mode 6

Unnamed mathematical collections are explicitly out of scope.

### Implementation steps
1. Audit current 25 scales against the reference — correct any wrong interval patterns
2. Add each missing named entry
3. Verify: interval pattern, enharmonic spelling, degree numerals
4. Add new pool panel chips in `pool.js` within the appropriate cardinality group
5. Confirm chord-scales intersection logic still works for all new entries
6. Update reference file status column as each scale is added

---

## Point 46 — Complete voicing system

### Status: Reference complete — implementation not yet started

Supersedes and greatly extends Point 41. Point 41 should be implemented first as the
architectural foundation; Point 46 then completes the system.

### Reference file
`complete_literature_based_piano_chord_voicings.md` — 33 sections, literature-grounded
(Levine, Felts/Berklee, Ted Greene, Bill Dobbins, Persichetti, Hindemith).

### Scope tiers
**Tier 1 — Voicing chips:** Close, Open, Spread, Shell, Rootless, Drop-2, Drop-3, Drop-2&4, Quartal, Quintal, Secundal/Cluster, So What, Pentatonic, Three-note

**Tier 2 — Breakdown description only:** Left-hand voicings, Right-hand/melody voicings, Block chords, Classical/SATB, Impressionist/planed, Symmetrical structures, Pop/Gospel

**Tier 3 — Out of scope:** Stride, Bud Powell, Locked-hands, Pedal point (rhythmic/performance styles)

### Files to change
| Change | File |
|---|---|
| Voicing formulas and note generation | `js/engine/audio.js` |
| Notation rendering for non-standard voicings | `js/engine/notation.js` |
| Voicing chip panel groups | `js/ui/pool.js` |
| Voicing explanation row in breakdown | `js/breakdown/breakdown.js` |

---

## Point 47 — Harmonic field in scale breakdown

### Status: Not yet started

Show the diatonic seventh chords built on every degree of the scale in the breakdown panel.

### Algorithm
- For each scale degree, stack thirds using only pitch classes present in the scale
- Build as many thirds as possible: four scale tones → seventh chord; three → triad
- Handles all scale types automatically — pentatonics and hexatonics show whatever fits
- Respects the selected root; chord symbols use existing Berklee conventions from `CHORD_TYPES`

### Display
- One row per scale degree: Roman numeral · chord symbol · chord name
- Collapsible sub-section within breakdown (collapsed by default)
- Label: "Harmonic Field"
- Scales mode only — quiz post-answer and dictionary mode

### Files to change
| Change | File |
|---|---|
| `makeHarmonicFieldRow()` — build and render the row | `js/breakdown/breakdown.js` |
| Call from scale breakdown branch | `js/breakdown/breakdown.js` |

### Implementation steps
1. Write `buildHarmonicField(scalePitchClasses, rootMidi)` — returns array of `{ degree, roman, symbol, name }`
2. Write `makeHarmonicFieldRow()` — renders collapsible sub-section
3. Call from scales branch of `showBreakdown()` after existing rows
4. Verify for: Major, Harmonic Minor, Melodic Minor, Diminished, Whole Tone, pentatonics

---

## Point 48 — Collapsible breakdown sub-sections

### Status: Not yet started

Make specific row groups within the breakdown panel individually collapsible.

### Scope
**Chords breakdown — collapsible groups:**
- Resolutions (resolve row + target chord info)
- Neo-Riemannian relations (Riemannian pills row)

**Scales breakdown — collapsible groups:**
- Modal character (character/mood description row)
- Harmonic field (Point 47 — collapsible from birth)

### Behaviour
- Collapsed by default
- Toggle arrow (▸ / ▾) on the group header
- Group header uses existing `.pool-section-title` style
- State resets to collapsed on every new question or mode switch

### Files to change
| Change | File |
|---|---|
| Wrap target row groups in collapsible markup | `js/breakdown/breakdown.js` |
| Collapsible toggle JS (same pattern as pool sections) | `js/breakdown/breakdown.js` |
| Any new CSS for breakdown sub-section headers | `css/components.css` |

### Implementation steps
1. Identify exact DOM output for each target group in `breakdown.js`
2. Wrap each group in a collapsible container with header row + arrow + body div
3. Wire click handlers inline at render time (same pattern as `makeCollapsible()` in `app.js`)
4. Verify collapse/expand in both quiz post-answer and dictionary mode
5. Verify state resets on new question and mode switch
