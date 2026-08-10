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
- **37** Voice leading panel — Pass 1 complete ✓ (Aug 2026). Pass 2 complete ✓ (Aug 2026). See Point 37 TODO section and `voice_leading_algorithm_plan.md`.
  - Pass 2: `makeVoiceLeadingRow()` renders one collapsible cs-section per harmonic context; each context expands to show per-resolution sub-sections with voice leading tables; tension dots, cadence name, strength %, harmonic function label all shown
  - `spelledRootAuto()` added to `breakdown.js` — scale/context root names now use conventional flat/sharp spelling regardless of `pinnedRootSpelling` (which reflects chord root only)
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
- **41/46** Voicing system — UI and infrastructure complete ✓ (Session: Aug 2026)
  - `pool.js` updated — `VOICING_GROUPS` corrected to 6 groups / 63 symbols matching `VOICING_MODES` exactly (was stale 4-group / 21-symbol schema with wrong symbol names); all comments updated
  - `breakdown.js` updated — stale 21-entry `voicingLabels` object replaced with single `VOICING_MODES.find()` lookup; DRY, zero maintenance burden going forward
  - `recomputeCurrentNotes()` confirmed already correct in `app.js` — the old bug note in the plan was stale; fix had already been applied
  - `progressions-mode.js` — no changes needed; `recomputeCurrentNotes` lives in `app.js`
  - `index.html` load order confirmed correct — `voicings.js` in place after `helpers.js`
  - **Known algorithmic bug** — Group 5 (Intervallic) and some Group 6 (Style) voicings generate pitch classes not present in the chord (e.g. quartal stacking on a C major triad produces F and B♭ which are not chord tones). Decision: fix with Option A (see Point 41 TODO — Intervallic algorithm redesign). All other groups unaffected.
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
- **40** Clickable chord scales: scale names in chord scales breakdown are clickable — opens that scale in Dictionary mode. `cs-name-link` class + click handler in `makeChordScalesRow()`. CSS: pointer cursor + teal underline on hover.
- **47** Harmonic field in scale breakdown — implemented and improved (Session: Aug 2026)
  - `buildHarmonicField()` and `makeHarmonicFieldRow()` implemented in `breakdown.js`
  - Collapsible "N degrees ▸" sub-section within scale breakdown
  - `harmonicFieldSymbolSuffix()` added as single source of truth for all chord symbol → display suffix mappings (consistent with app notation: `Maj7` not `Δ`, `m7♭5` not `ø`, `°7` not `dim7`, etc.)
  - Each pill shows three lines: Roman numeral with quality suffix (`viiø7` → corrected in this session to `viim7♭5`), root + quality shorthand (`Bm7♭5`), full quality name (`half-diminished`)
  - Interval fallback (degrees with no clean triad) stores `null` for `chordSym`; pill omits quality name line gracefully rather than showing raw interval abbreviation
  - Status: complete ✓

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
| Voicing data, algorithms (`VOICING_MODES`, `applyVoicing`, `resolveVoicingMode`) | `js/engine/voicings.js` |
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

#### Status: Complete ✓ — Pass 1 and Pass 2 both done (Aug 2026)

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

#### Pass 1 — Data layer ✅ COMPLETE

Files changed: `js/engine/state.js`, `js/modes/chords-mode.js`, `js/breakdown/breakdown.js`

- ✅ `currentVoiceLeadingAnalysis = null` in `state.js`; reset in `generateChordQuestion()` for all four chord family paths
- ✅ `_buildVoiceLeadingAnalysis()` called at answer-reveal time in `submitChordAnswer()`; handles all four families (normal, slash, UST, poly)
- ✅ `getResolutionInfo()` reads from `currentVoiceLeadingAnalysis` when populated; falls back to `RESOLUTION_TARGETS` when cache is null
- ✅ `targetQuality` is now a first-class field on the `getResolutionInfo()` return object — no fragile string parsing anywhere
- ✅ UST label corrected from `'→ IVΔ7'` to `'→ IVMaj7'` (app uses `Maj7` not `Δ` consistently)
- ✅ `computeVoiceLeading()` calls `computeVoiceLeadingRules()` when engine + context available; proximity loop retained as fallback
- ⚠️ `RESOLUTION_TARGETS` retained as live fallback — not deleted yet. Will be removed in a future cleanup pass once engine is confirmed stable.

#### Pass 2 — Multi-resolution pills UI ✅ COMPLETE (Aug 2026)

**What was implemented:**
- `makeVoiceLeadingRow()` renders one collapsible `cs-section` per harmonic context
- Context header: roman numeral (teal, bold) · scale root + scale name · harmonic function label · tension dots (●●●○○)
- First context expanded by default; others collapsed
- Each context body: one nested `cs-section` per resolution target
- Resolution header: target chord name · cadence type label · strength % · expand arrow
- Resolution body: voice leading table (from → to, direction, interval name, role)
- Stable tonic contexts show "departure paths" note instead of resolution sub-sections
- `spelledRootAuto()` added — context/target root names use conventional spelling independent of `pinnedRootSpelling`
- Fallback (ambiguous families / cache null): single-resolution display unchanged
- Safety-net comment added to dead-code on-demand fallback inside Pass 2

**Files changed:** `js/breakdown/breakdown.js`

#### What the algorithm replaces
- `RESOLUTION_TARGETS` — hardcoded lookup table → superseded by `deriveResolutionTargets()` in `voiceLeading.js` (retained as fallback for now)
- Proximity loop in `computeVoiceLeading()` → superseded by 7-rule constraint satisfaction engine in `computeVoiceLeadingRules()` (proximity loop retained as fallback)
- `getResolutionInfo()` normal chord path → reads cached `analyseChord()` result instead of lookup table

#### Family-by-family handling (decided Aug 2026)
| Family | Approach |
|---|---|
| Normal chords | `analyseChord()` directly — full context discovery + voice leading |
| Slash chords | `analyseChord()` on upper chord pitch classes; upper root as harmonic root; bass note is label modifier only |
| UST | Construct implied pitch classes from `shellIntervals + upperTriadIntervals offset by upperTriadRoot` (all fields present in every UST entry in `CHORD_TYPES`); run `analyseChord()` |
| Polychords | Merge upper + lower pitch class sets; use lower root; skip diatonic context discovery (polychords are polytonal by design — forcing into one scale gives misleading results); run voice leading computation only |
| Aug / sus / power | Stay in `AMBIGUOUS_FAMILIES` whitelist; existing simple resolution logic unchanged |

#### Caching
`analyseChord()` result stored in `currentVoiceLeadingAnalysis` state variable. Computed once
when the answer is revealed. Not re-run on every `getResolutionInfo()` call. Reset to null on
each new question.

#### Resolution timing fix (simple)
Tighten to **1.2s source + 0.3s pause** in `playResolution()`. Two constant changes. Not yet done.

---

### Point 40 — Clickable chord scales → Dictionary mode

#### Status: Complete ✓ (Aug 2026)

Each scale name in the chord scales breakdown is clickable and opens that scale in Dictionary mode.

#### What was implemented
- `nameEl` in `makeChordScalesRow()` gets class `cs-name-link`, a `title="Open in Dictionary"` tooltip, and a click handler:
  - Sets `dictSymbol = sc.symbol`
  - Calls `switchMode('scales')` if not already in scales tab
  - Calls `setAppMode('dict')` to load the symbol and trigger `dictShow()`
- Works from both quiz post-answer and dictionary mode
- `cs-name-link` CSS added to `components.css`: `cursor: pointer` + teal underline on hover

#### Files changed
| Change | File |
|---|---|
| Click handler + `cs-name-link` class on scale name elements | `js/breakdown/breakdown.js` |
| `.cs-name-link` hover styles | `css/components.css` |

---

### Point 41 — Expanded voicing system (Chords mode)

#### Status: UI and infrastructure complete — algorithmic bug in Group 5 pending (Aug 2026)

**What is done ✓**
- `voicings.js` created — `VOICING_MODES` (all 63), `applyVoicing()` (all groups implemented), `resolveVoicingMode()`
- `helpers.js` updated — voicing section removed, pointer comment added; `currentVoicingMode` / `currentChordPlayStyle` retained as per-question state
- `index.html` updated — `voicingModeSection` div removed from Settings; `voicings.js` script tag added; load order confirmed correct
- `pool.js` updated — `VOICING_GROUPS` corrected to 6 groups / 63 symbols matching `VOICING_MODES`; chord pool panel restructured into two collapsible sub-groups ("Chord quality" and "Voicing"); all chip render functions correct
- `breakdown.js` updated — voicing label row now reads from `VOICING_MODES.find()` instead of stale hardcoded map; suppressed for `close`
- `app.js` updated — `recomputeCurrentNotes()` fully implemented with correct `applyVoicing(rootMidi, baseIntervals, mode)` signature; all chord families handled (slash, poly, UST, normal + inversions)
- `chords-mode.js` — correct `applyVoicing()` call site confirmed

**What is broken 🔴 — Group 5 (Intervallic) algorithmic bug**
- Intervallic voicings (`quartal`, `quintal`, `secundal`, `cluster_*`) generate pitch classes not present in the chord. Example: quartal stacking on C major triad {C, E, G} produces {C, F, B♭} — F and B♭ are not chord tones. This is musically wrong; it changes the chord identity, not just the voicing.
- Same issue applies to some Style voicings with fixed shapes (`so_what`, `mccoy_tyner`) that ignore chord tones entirely.
- **Decision: Option A** — constrain all intervallic voicings to only use pitch classes present in `baseIntervals`, arranged to best approximate the target interval stack. See Intervallic algorithm redesign section below.
- Groups 1–4 and most of Group 6 are unaffected (they select/rearrange existing chord tones).

**What is not yet done**
- Voicing confirmation checklist — testing not yet started
- Group 5 Intervallic algorithm redesign (see below)
- Group 6 Style voicings with fixed shapes need same chord-tone constraint applied

Replaces and greatly expands the current Point 23 voicing chips (Full / Real / Shell / Guide + Random).
Applies to **Chords mode only** — not progressions or other modes.

Points 41 and 46 are implemented together as one system. Point 41 is the architectural
foundation; Point 46 completes the voicing library on top of it. They share the same
files, the same dispatcher, and the same chip panel structure.

---

#### Architecture decisions (Aug 2026 — full codebase audit + design session)

**Algorithm: `applyVoicing(rootMidi, baseIntervals, mode)`**

Previous design `applyVoicingMode(baseIntervals, mode)` was wrong — takes intervals, returns
filtered intervals. Drop-2, Quartal, two-hand voicings etc. require register and octave
awareness and cannot work on interval arrays alone.

New design takes MIDI root and intervals, returns a MIDI note array directly. Each voicing
is a self-contained algorithm. The function is a dispatcher; each mode is a named case inside it.

`notation.js` requires NO changes — renders whatever MIDI notes it receives; grand staff is
automatic based on pitch range. Two-hand voicings work automatically as long as
`currentMidiNotes` spans the right registers. `audio.js` requires NO changes.

---

**New file: `js/engine/voicings.js`**

All voicing logic lives in one dedicated file rather than being split across `helpers.js`.
This keeps `helpers.js` focused on note picking, pool building, stats, and root badge.

`voicings.js` owns:
- `VOICING_MODES` — data table for all 63 voicings
- `applyVoicing(rootMidi, baseIntervals, mode)` — main dispatcher
- `resolveVoicingMode()` — moved from `helpers.js`

Rendering of voicing chips moves to `pool.js` (see UI section below).

Load order in `index.html` (one line added):
```
js/engine/helpers.js
js/engine/voicings.js   ← new
js/engine/audio.js
```

`helpers.js` loses its entire voicing section; replaced by a comment pointing to `voicings.js`.
`currentVoicingMode` and `currentChordPlayStyle` stay in `helpers.js` — they are
per-question resolved state, not voicing logic.

---

**UI: Chord pool panel restructured into two collapsible sub-groups**

The old `voicingModeSection` in the Settings panel is removed. The chord pool panel now
contains two clearly labelled, collapsible sub-groups sitting inside the main panel body.
Both start **collapsed by default**.

```
Training pool — Chords  [▸]
  ├── Chord quality  [▸]   collapsed by default — All/None at group level
  │     Major, Minor, Dominant, Diminished, Augmented,
  │     Suspended, Slash, Polychords, UST ×3
  │     [ ] Include inversions  (quiz mode only)
  └── Voicing  [▸]         collapsed by default — All/None at group level (quiz only)
        Random chip
        Position (3), Doubling (4), Shell/Rootless (27), Drop (4), Intervallic (8), Style (17)
```

**Chord quality and voicing are kept completely separate** — they are different axes
(what you train vs. how it sounds) and must never be mixed in the same section.

**Single render path for both quiz and dict modes**

`renderDictPoolPanel()` previously duplicated the chord quality section independently of
`renderChordPoolPanel()`. This duplication is eliminated. Both quiz and dict now call the
same two internal functions — `_renderChordQualitySection(body)` and
`_renderVoicingSection(body)` — into the same two collapsible sub-group containers.

The only behavioural differences between quiz and dict are handled inside those functions
by reading `appMode`:

**Chord quality chips:**
- Quiz: multi-select, All/None per family section, All/None at group level, inversions checkbox
- Dict: single-select, no All/None buttons, no inversions checkbox, clicking a chip immediately
  calls `dictLoadSymbol()` + `dictShow()`

**Voicing chips:**
- Quiz: multi-select into `selectedVoicings` Set, Random adds to pool
- Dict/post-answer: single-select, clicking immediately calls `recomputeCurrentNotes()`,
  Random re-voices instantly
- Already handled by the existing `isQuiz` check inside `_renderVoicingSection()` — no change needed

`renderDictPoolPanel()` chords branch is reduced to: build the two sub-group containers,
call `_renderChordQualitySection(body)` and `_renderVoicingSection(body)`. Intervals and
scales branches of `renderDictPoolPanel()` are unchanged.

**Changes to `app.js`:** Remove `voicingModeSection` show/hide from `switchMode()`.
Remove `renderVoicingChips()` from boot. Collapse `renderDictPoolPanel()` chords branch
to call the shared section renderers. No other changes.

**Changes to `index.html`:** Remove `voicingModeSection` div from Settings panel.
No other HTML changes needed.

---

#### Complete touch-point map (final — Aug 2026)

| File | What changes | Why |
|---|---|---|
| `js/engine/voicings.js` | **New file** — `VOICING_MODES`, `applyVoicing()`, `resolveVoicingMode()` | All voicing logic in one place |
| `js/engine/helpers.js` | Delete voicing section, replace with comment pointing to `voicings.js` | Cleanup |
| `js/engine/state.js` | `activeVoicingMode` default `'full'` → `'close'`; add `selectedVoicings` Set | Symbol rename + new quiz pool state |
| `js/modes/chords-mode.js` | Call site: `applyVoicingMode(baseIntervals, mode)` → `applyVoicing(rootMidi, baseIntervals, mode)`; resolve from `selectedVoicings` in quiz | New signature + pool selection |
| `js/breakdown/breakdown.js` | Voicing label row — reads from `VOICING_MODES.find()` ✓ | Display label |
| `js/ui/pool.js` | `VOICING_GROUPS` corrected to 6 groups / 63 symbols; chord pool panel in two collapsible sub-groups; all chip render functions correct ✓ | UI |
| `js/app.js` | Remove `voicingModeSection` show/hide from `switchMode()`; remove `renderVoicingChips()` from boot; collapse `renderDictPoolPanel()` chords branch to call shared `_renderChordQualitySection()` + `_renderVoicingSection()` — eliminating the duplicated chord section | Cleanup + dedup |
| `index.html` | Remove `voicingModeSection` div from Settings panel; add `voicings.js` script tag | Cleanup + new file |
| `js/engine/notation.js` | **No changes needed** | Confirmed in audit |
| `js/engine/audio.js` | **No changes needed** | Confirmed in audit |

---

#### Voicing chip panel — 6 collapsible groups (63 voicings total)

**Random** chip (`random`) — sits above all groups, always visible. In quiz mode: picks
uniformly from `selectedVoicings` each question. In dict/post-answer: picks uniformly
from all 63 concrete modes.

---

**Group 1 — Position / Spacing** (how notes are distributed in register)
| # | Voicing | Symbol | Algorithm | Fallback |
|---|---|---|---|---|
| 1 | Close | `close` | All notes stacked from root within one octave | — |
| 2 | Open | `open` | Alternate notes raised one octave to spread the voicing | — |
| 3 | Spread | `spread` | Root in bass (oct 2–3), remaining notes voiced in oct 4–5 with wide spacing | — |

---

**Group 2 — Doubling** (reinforcing a chord tone at another octave)
| # | Voicing | Symbol | Algorithm | Source |
|---|---|---|---|---|
| 4 | Root Octave Double | `dbl_root_oct` | Root + root one octave lower in bass: `1–1–3–5` | Classical/arranging |
| 5 | Root Above Fifth | `dbl_root_above5` | Root doubled above fifth: `1–5–1–3` | Classical/arranging |
| 6 | Fifth Double | `dbl_fifth` | Fifth doubled: `1–5–3–5` | Classical/arranging |
| 7 | Root Top and Bottom | `dbl_root_wrap` | Root doubled at top and bottom: `1–3–5–1` | Classical/arranging |

---

**Group 3 — Shell / Rootless** (selective chord tone subsets)
| # | Voicing | Symbol | Algorithm | Fallback |
|---|---|---|---|---|
| 8 | Shell | `shell` | `1–3–7` | Close for triads |
| 9 | Shell Alt | `shell_alt` | `1–7–3` | Close for triads |
| 10 | Rootless Shell | `shell_rootless` | `3–7` only | Close for triads |
| 11 | Three-note Maj 1–3–5 | `tn_maj_135` | `1–3–5` | — |
| 12 | Three-note Maj 3–5–7 | `tn_maj_357` | `3–5–7` | Close if no 7th |
| 13 | Three-note Maj 1–3–7 | `tn_maj_137` | `1–3–7` | Close if no 7th |
| 14 | Three-note Dom 1–3–b7 | `tn_dom_13b7` | `1–3–b7` | Close if no b7 |
| 15 | Three-note Dom 3–5–b7 | `tn_dom_35b7` | `3–5–b7` | Close if no b7 |
| 16 | Three-note Dom 3–b7–9 | `tn_dom_3b79` | `3–b7–9` | Close if no 9 |
| 17 | Three-note Min 1–b3–b7 | `tn_min_1b3b7` | `1–b3–b7` | Close if no b7 |
| 18 | Three-note Min b3–5–b7 | `tn_min_b35b7` | `b3–5–b7` | Close if no b7 |
| 19 | Three-note Min b3–b7–9 | `tn_min_b3b79` | `b3–b7–9` | Close if no 9 |
| 20 | Rootless Maj7 | `rl_maj7` | `3–5–7–9` | Close if no 9 |
| 21 | Rootless Maj7 Extended | `rl_maj7_ext` | `3–5–7–9–13` | Falls back to `rl_maj7` if no 13 |
| 22 | Rootless Min7 | `rl_min7` | `b3–5–b7–9` | Close if no 9 |
| 23 | Rootless Dom7 | `rl_dom7` | `3–b7–9–13` | Close if no 9/13 |
| 24 | Rootless Altered A | `rl_alt_a` | `3–b7–b9–#9` | Close if no alterations |
| 25 | Rootless Altered B | `rl_alt_b` | `3–b7–#9–b13` | Close if no alterations |
| 26 | Rootless Altered C | `rl_alt_c` | `3–b7–b5–b9` | Close if no alterations |
| 27 | Rootless Altered D | `rl_alt_d` | `3–b7–b9–Ab` (concrete spelling) | Close if no alterations |
| 28 | Rootless #9 | `rl_sharp9` | `3–b7–#9` | Close if no #9 |
| 29 | Sus Voicing | `sus_voicing` | `1–4–b7–9` | Close for non-sus chords |
| 30 | Phrygian Voicing | `phrygian` | `1–b2–5–b7` | Close for non-Phrygian chords |
| 31 | Major 6 | `sixth_maj` | `1–3–5–6` | Close if no 6 |
| 32 | Minor 6 | `sixth_min` | `1–b3–5–6` | Close if no 6 |
| 33 | 6/9 | `sixth_nine` | `1–3–5–6–9` | Close if no 6/9 |
| 34 | Rootless 6/9 | `rl_sixth_nine` | `3–5–6–9` | Close if no 6/9 |

---

**Group 4 — Drop Voicings** (octave displacement of specific voices from close position)
| # | Voicing | Symbol | Algorithm | Fallback |
|---|---|---|---|---|
| 35 | Drop-2 | `drop2` | Second-highest voice dropped one octave | — |
| 36 | Drop-3 | `drop3` | Third-highest voice dropped one octave | — |
| 37 | Drop-2&4 | `drop24` | Second and fourth voices dropped one octave | Drop-2 for triads |
| 38 | Drop-2&3 | `drop23` | Second and third voices dropped one octave | — |

---

**Group 5 — Intervallic** (structures built from a single repeated interval)

⚠️ **Algorithm redesign required** — see Intervallic algorithm redesign section below.
Current implementation stacks intervals freely and generates non-chord pitch classes.
All 8 voicings must be rewritten to constrain output to chord tones only.

| # | Voicing | Symbol | Target interval | Fallback |
|---|---|---|---|---|
| 39 | Quartal | `quartal` | Perfect fourth (5 semitones) | Close |
| 40 | Quintal | `quintal` | Perfect fifth (7 semitones) | Close |
| 41 | Secundal | `secundal` | Major second (2 semitones) | Close |
| 42 | Cluster Chromatic | `cluster_chrom` | Semitone (1 semitone) | Close |
| 43 | Cluster Diatonic | `cluster_diaton` | Diatonic second | Close |
| 44 | Cluster Pentatonic | `cluster_pent` | Pentatonic step | Close |
| 45 | Cluster Whole-tone | `cluster_wt` | Whole tone (2 semitones) | Close |
| 46 | Cluster Modal | `cluster_modal` | Modal scale step | Close |

---

**Group 6 — Style** (named voicing recipes from specific traditions)
| # | Voicing | Symbol | Algorithm | Source |
|---|---|---|---|---|
| 47 | So What | `so_what` | Fixed shape: P4+P4+P4+M3 from root, regardless of chord | Miles Davis / Levine |
| 48 | Bill Evans A | `evans_a` | `3–5–7–9`, no root, specific register (LH) | The Jazz Piano Book |
| 49 | Bill Evans B | `evans_b` | `7–9–3–5`, inverted register ordering | The Jazz Piano Book |
| 50 | Kenny Barron | `kenny_barron` | LH: `1–b7`. RH: `3–5–9` | Jazz tradition |
| 51 | McCoy Tyner | `mccoy_tyner` | LH: stacked quartal. RH: upper quartal cluster | Jazz tradition |
| 52 | Pop Piano | `pop_piano` | LH: root octave (oct 2–3). RH: `3–5–9` close (oct 4–5) | Contemporary |
| 53 | Gospel | `gospel` | Close voicing + 9th; extensions stacked tightly in upper register | Gospel/R&B |
| 54 | Octave Bass + Triad | `oct_bass_triad` | LH: root octave (oct 2–3). RH: triad close (oct 4–5) | Pop/R&B |
| 55 | Octave Bass + 7th | `oct_bass_7th` | LH: root octave (oct 2–3). RH: seventh chord close (oct 4–5) | Pop/R&B |
| 56 | Open Fifth + Triad | `open5_triad` | LH: root + fifth (oct 2–3). RH: triad (oct 4–5) | Pop/Contemporary |
| 57 | Block Chord Close | `block_close` | Melody harmonised with close-position chord tones below | Jazz arranging |
| 58 | Block Chord Locked Hands | `block_locked` | Melody doubled one octave lower, inner chord tones between hands | Jazz arranging / Milt Buckner |
| 59 | Four-way Close | `four_way_close` | Four-voice close position with melody on top; inner voices fill in | Jazz arranging |
| 60 | Block Drop-2 | `block_drop2` | Drop-2 applied to harmonised melody — second voice dropped one octave | Jazz arranging |
| 61 | Octave Melody + Inner | `oct_melody_inner` | Melody doubled at octave; inner chord tones fill between the two melody octaves | Jazz tradition |
| 62 | Pedal Point | `pedal_point` | Root held/repeated in bass across changing upper voices | All traditions |
| 63 | Two-handed Spread | `spread_2h` | LH: root + fifth (wide). RH: upper extensions voiced close — broader than Spread | Contemporary |

---

#### Intervallic algorithm redesign (Option A — chord-tone constrained)

**The problem**
The current implementation stacks intervals freely from the root regardless of whether the
generated pitches exist in the chord. This changes the chord's identity rather than voicing it.
A quartal stack on C major triad {C, E, G} produces {C, F, B♭} — two non-chord tones.

**The decision: Option A — constrain to chord tones only**
All intervallic voicings must only use pitch classes present in `baseIntervals`.
The algorithm arranges those existing chord tones into the register layout that best
approximates the target interval stack. The chord label stays correct; only the spacing changes.

**The algorithm (same pattern for all 8 voicings)**

```
function _intervallicVoicing(rootMidi, baseIntervals, targetSemitones) {
  // 1. Get the chord's pitch classes (0–11)
  const pcs = baseIntervals.map(i => ((rootMidi + i) % 12 + 12) % 12);

  // 2. Start from a sensible bass register
  let current = rootMidi;
  while (current > 59) current -= 12;
  while (current < 36) current += 12;

  // 3. For each subsequent note, find the chord tone whose pitch class
  //    lands closest to (current + targetSemitones), searching up
  const result = [current];
  for (let i = 1; i < baseIntervals.length; i++) {
    const target = current + targetSemitones;
    // Find the pc in pcs that minimises distance to target
    let best = null, bestDist = Infinity;
    pcs.forEach(pc => {
      // Find nearest octave of this pc above current
      let candidate = current + ((pc - current % 12 + 12) % 12);
      if (candidate <= current) candidate += 12;
      const dist = Math.abs(candidate - target);
      if (dist < bestDist) { bestDist = dist; best = candidate; }
    });
    result.push(best);
    current = best;
  }
  return result.sort((a, b) => a - b);
}
```

**Key properties of this approach**
- Only chord pitch classes appear in the output — identity preserved
- The arrangement *approximates* the target interval, getting as close as the chord allows
- A C major triad quartal voicing produces G3–C4–E4 (P4 + M3) — the closest approximation
- A dom7 chord quartal voicing may produce exact P4s where they coincide with chord tones
- Richer chords (7th, 9th, 13th) will naturally produce cleaner interval stacks
- Falls back to `close` only if `baseIntervals` is empty (shouldn't happen)

**Cluster variants**
`cluster_diaton`, `cluster_pent`, `cluster_wt`, `cluster_modal` use the same algorithm
with different `targetSemitones` values (or a small set of candidate values to try in order).
For diatonic/modal clusters the target is 2 semitones (diatonic step); for pentatonic it's
2 or 3 (pentatonic steps). The algorithm picks the chord tone that lands closest regardless.

**Style voicings with fixed shapes** (`so_what`, `mccoy_tyner`)
Same constraint applies: the fixed interval shapes must be approximated using only chord tones.
`so_what` (P4+P4+P4+M3) on a triad will naturally compress to fit 3 notes in that shape.

**File to change:** `js/engine/voicings.js` only — rewrite the 8 intervallic cases in
`applyVoicing()` and update the fixed-shape style cases. No other files change.

---

#### Breakdown voicing row

All voicings show a "Voicing" row in the breakdown with:
- Name (e.g. "Drop-2")
- One-line description of what it is
- Source/tradition where relevant (e.g. "arranging literature", "Mark Levine")

The `close` voicing does **not** show a voicing row — it is the default, unremarkable baseline.

---

#### Implementation phases

**Phase 1 — Groups 1 + 2: Position + Doubling (7 voicings) ✓ COMPLETE**
All infrastructure built. Files changed: `voicings.js`, `helpers.js`, `state.js`,
`chords-mode.js`, `breakdown.js`, `pool.js`, `app.js`, `index.html`.

**Phase 2 — Group 3: Shell / Rootless (27 voicings) ✓ COMPLETE**
All cases implemented in `voicings.js`. Sub-batches: Shell (3), Three-note (8),
Rootless four-note (9), Sus/Phrygian/6th (7).

**Phase 3 — Group 4: Drop Voicings (4 voicings) ✓ COMPLETE**
All cases implemented in `voicings.js`.

**Phase 4 — Group 5: Intervallic (8 voicings) 🔴 NEEDS REDESIGN**
Current implementation generates non-chord pitch classes — see Intervallic algorithm
redesign section above. Must rewrite all 8 cases in `applyVoicing()` using the
chord-tone-constrained algorithm before these voicings can be tested.
Only `voicings.js` changes.

**Phase 5 — Group 6: Style (17 voicings) — PARTIALLY COMPLETE**
Two-hand voicings that select from chord tones are correct (Pop Piano, Gospel,
Octave Bass + Triad, Octave Bass + 7th, Open Fifth + Triad, Block Chord Close,
Locked Hands, Four-way Close, Block Drop-2, Octave Melody + Inner, Pedal Point,
Two-handed Spread, Bill Evans A, Bill Evans B, Kenny Barron).
Fixed-shape voicings that ignore chord tones need the same constraint as Group 5:
`so_what`, `mccoy_tyner`. Only `voicings.js` changes.

---

#### Next implementation steps
1. Rewrite Group 5 intervallic cases in `voicings.js` using chord-tone-constrained algorithm
2. Rewrite `so_what` and `mccoy_tyner` in `voicings.js` using same constraint
3. Test all 63 voicings against a variety of chord types; mark checklist below

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

**Group 5 — Intervallic**
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

## Recommended implementation order

1. ~~**Point 37 Pass 2 — Multi-resolution pills UI**~~ ✓ Complete (Aug 2026)

2. ~~**Point 48 — Collapsible breakdown sub-sections**~~ ✓ Complete (Aug 2026 — already done)

3. ~~**Point 40 — Clickable chord scales**~~ ✓ Complete (Aug 2026)

4. **Points 41 + 46 — Complete voicing system** — UI and infrastructure complete. One algorithmic bug remaining in Group 5.

   **Immediate next step — rewrite Group 5 (Intervallic) + fix `so_what` / `mccoy_tyner` in `voicings.js`:**
   Use the chord-tone-constrained algorithm specified in the Intervallic algorithm redesign
   section of Point 41. Only `voicings.js` changes. Then test the full confirmation checklist.

   **Files delivered this session (ready to deploy):**
   - `pool.js` — 6 groups / 63 symbols corrected
   - `breakdown.js` — voicing label from `VOICING_MODES.find()`

5. **Point 44 — Complete chord library** (work through `chords_reference.md` row by row; split `chords.js` if needed)

6. **Point 45 — Complete scale library** (work through `complete_12_TET_piano_scales.md` named-index rows)

8. **BUG-5** — Fix fragile two-chord VexFlow layout (defer until confirmed causing visible problems)

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

### Status: Merged into Point 41 (Aug 2026)

Points 41 and 46 are now a single implementation effort. The full voicing library —
including all chips, algorithms, breakdown rows, and chip panel structure — is specified
in Point 41 above. Point 46 is retained here for reference only.

### Reference file
`complete_literature_based_piano_chord_voicings.md` — 33 sections, literature-grounded
(Levine, Felts/Berklee, Ted Greene, Bill Dobbins, Persichetti, Hindemith).

### Original scope tiers (now folded into Point 41 groups)

**Tier 1 — Voicing chips (implemented as Point 41 Groups 1–4):**
Close, Open, Spread, Shell, Rootless, Drop-2, Drop-3, Drop-2&4, Piano, Quartal, Quintal,
Secundal, Cluster, So What, Bill Evans, Kenny Barron, McCoy Tyner, Pop Piano, Gospel,
Octave Doubling, Dense Extended

**Tier 2 — Breakdown description only** (shown in voicing row, no chip):
Left-hand voicings, Right-hand/melody voicings, Block chords, Classical/SATB,
Impressionist/planed, Symmetrical structures

**Tier 3 — Out of scope:**
Stride, Bud Powell, Locked-hands, Pedal point (rhythmic/performance styles)

### Key decisions recorded (Aug 2026)
- `notation.js` requires NO changes — grand staff is automatic from MIDI pitch range
- `audio.js` requires NO changes — plays whatever is in `currentMidiNotes`
- Two-hand voicings (Piano, Kenny Barron, McCoy Tyner, Pop Piano) work automatically
  because notes spanning both registers trigger grand staff in `notation.js`
- "Triad over Bass" and "Upper Structure Triads" removed from voicing chips — these
  already exist as dedicated chord families (Slash and UST respectively)

---

## Point 47 — Harmonic field in scale breakdown

### Status: Complete ✓ (Session: Aug 2026)

Show the diatonic chords built on every degree of the scale in the breakdown panel.

### What was implemented
- `buildHarmonicField(intervals, rootMidi, sym)` — returns array of `{ roman, rootName, chordSym }` per scale degree
- `harmonicFieldSymbolSuffix(sym)` — single source of truth mapping all internal chord symbols to display suffixes consistent with app notation
- `makeHarmonicFieldRow(panel, intervals, rootMidi, sym)` — renders collapsible "N degrees ▸" sub-section
- Each pill: Roman numeral with quality suffix (line 1), root + quality shorthand e.g. `Dm7`, `G7`, `B°` (line 2), full quality name e.g. `minor 7th`, `dominant 7th`, `diminished` (line 3)
- Degrees with no clean triad (`chordSym = null`) suppress the quality name line gracefully
- Covers all scale types: 7-note scales get seventh chords; pentatonic/hexatonic show triads where possible; very sparse scales show degree only

### Files changed
| Change | File |
|---|---|
| `harmonicFieldSymbolSuffix()`, `buildHarmonicField()`, `makeHarmonicFieldRow()` | `js/breakdown/breakdown.js` |

---

## Point 48 — Collapsible breakdown sub-sections

### Status: Complete ✓ (Aug 2026 — already implemented as part of earlier sessions)

All targeted groups were already wrapped in `makeCSGroup()` and collapsed by default by the time this point was reviewed. No additional work was needed.

**Chords breakdown — all collapsible via `makeCSGroup(label, false)`:**
- Neo-tonal (Riemannian) — `makeCSGroup('Neo-tonal', false)`
- Dominant — `makeCSGroup('Dominant', false)`
- Diminished / Half-dim / Augmented / Suspended / Power — each in their own `makeCSGroup`
- Voice leading — `makeCSGroup('Voice leading', false)`

**Scales breakdown — all collapsible via `makeCSGroup(label, false)`:**
- Triad map — `makeCSGroup('Triad map', false)`
- Character — `makeCSGroup('Character', false)`
- Parent — `makeCSGroup('Parent', false)`
- Harmonic field — collapsible from birth (Point 47)

State resets on every new question via `hideBreakdown()` clearing `panel.innerHTML`.

---

## Point 49 — In-app Help system

### Status: Not started

### Intent

A comprehensive in-app reference for musicians who know the basics but may not know the terminology or how to use the app's more advanced features. Not a tutorial — a permanent reference that explains every concept, label, control, and piece of information the app can display. Pitched at players who know major/minor, maybe some chords, but may not know what "Lydian Dominant", "tritone substitution", or "voice leading" means.

### Architecture

**New files:**

| File | Purpose |
|---|---|
| `js/modes/help-content.js` | All Help text — sections, entries, explanations. No DOM, no rendering logic. Structured as a JS array/object of sections, each with a title, optional intro, and entries (term + explanation). Single source of truth for all Help text; maintained independently of rendering. |
| `js/modes/help-mode.js` | Rendering only. Reads from `help-content.js`, builds the Help panel DOM, handles open/close. Mirrors the pattern of `about-mode.js`. |

**Existing files changed:**

| File | Change |
|---|---|
| `index.html` | Add Help `?` button to sticky header (next to dark/light toggle, mirroring the ⓘ About button); add `<script>` tags for both new files in correct load order |
| `css/components.css` | Help panel styles — reuse existing card/panel patterns |

### Help icon & behaviour

- A `?` inside a circle — visual equivalent of the ⓘ About button; same size and position style
- Placed in the sticky header next to the dark/light toggle
- Clicking opens the Help panel; clicking again or pressing Escape closes it
- Help and About cannot be open simultaneously — opening one closes the other
- Panel replaces main content area when open; mode tabs remain visible and clickable to dismiss

### Panel UX

- Collapsible sections (same `<details>`/`<summary>` pattern used elsewhere or equivalent)
- Live search/filter box at the top: typing narrows visible entries across all sections by term name and content
- No other interactive elements

### Content structure (`help-content.js`)

#### Section 1 — Getting Started
- What this app is for
- Quiz mode vs Dictionary mode — what each does, when to use which
- How a session works: pick items in the pool → press Play → hear it → answer → see the breakdown
- The Play button, Hear Slowly, New Session — what each does
- The score bar — what the counters mean

#### Section 2 — Modes
- **Intervals** — what an interval is; how the quiz works; simple vs compound; the pool split (Simple / Extended & Compound)
- **Chords** — what a chord is; the six families (triads, 7ths, extended, slash, polychords, USTs); how inversions work; what Dictionary mode shows
- **Scales** — what a scale is; the four cardinality categories (Pentatonic / Hexatonic / Diatonic / Octatonic); ascending/descending/both
- **Progressions** — what a chord progression is; Roman numeral notation explained; how the quiz works (hear the whole progression, identify it); what the breakdown shows per chord

#### Section 3 — Controls & Settings

**The Pool panel**
- What it is and what selecting/deselecting items does
- All / None buttons
- How auto-expand on load works (sections with selected items open automatically)

**Root & Register chips**
- Root note chips: Rnd vs pinned root — what "Rnd" means and when to use it
- Octave register chips: Low / Mid / High — what register range each covers

**Notation chips**
- Key / C chip — what Key mode does (adds key signature to notation), what C mode does (no key sig, all accidentals shown)

**Playback style chips (Chords & Intervals)**
- Block — all notes sounded simultaneously
- Ascending — notes played low to high in sequence
- Descending — notes played high to low in sequence
- Broken — root, then top note, then middle notes, then top again
- Random — randomly selects one of the above per play

**Scale direction chips**
- Ascending / Descending / Both — controls which direction(s) the scale is played and notated

**Voicing chips (Chords)**
Every group explained — what the voicing type is, what it sounds like, and which chord families it applies to:
- *Group 1 — Spacing:* Close, Open, Spread
- *Group 2 — Shell:* Shell (3+7), Shell (3+♭7), Rootless A, Rootless B
- *Group 3 — Drop:* Drop-2, Drop-3, Drop-2&4
- *Group 4 — Structured:* Piano (2-hand), Quartal, Quintal, Secundal, Cluster
- *Group 5 — Intervallic:* So What, Quartal Stack, Quintal Stack (etc. — each named chip explained)
- *Group 6 — Style:* Bill Evans, Kenny Barron, McCoy Tyner, Pop Piano, Gospel, Octave Doubling, Dense Extended

**Inversions toggle**
- What a chord inversion is
- What the toggle does (adds inversions to the quiz pool)

#### Section 4 — The Breakdown Panel

Every row label defined precisely. Organised by mode:

**Intervals breakdown**
- Semitones — the raw number of half-steps
- Name — the interval's standard name
- Degree — the Roman numeral qualifier (e.g. M3, m7, P5)
- Inversion — the complement interval (adds to 12); shown only for simple intervals
- Simple equivalent — the within-one-octave version; shown instead of Inversion for compound intervals
- Consonance — the consonance/dissonance classification (perfect consonance / imperfect consonance / mild dissonance / sharp dissonance) and what those categories mean
- Common context — where this interval typically appears in music

**Scales breakdown**
- Notes — the note names of the scale from the root
- Degrees — Roman numeral degree labels (I, ♭III, ♯IV, etc.)
- Character — the modal character tag (bright / neutral / dark / exotic / symmetric / ambiguous) and what each means
- Parent — which parent scale this scale is a mode of, and what modal degree it occupies
- Triad map — a table of triads built on each scale degree: columns are degree (Roman numeral), root name, and chord quality. Explained: how to read it, what it tells you about harmonising the scale
- Harmonic field — the diatonic seventh chords built on each scale degree, shown as pills. Each pill: Roman numeral + quality suffix (top), root + chord shorthand (middle), full quality name (bottom). Explained: what the harmonic field is and how to use it for chord selection
- Chord scales — scales that contain all the notes of the current chord. Explained as part of scale breakdown context

**Chords breakdown**
- Notes — the sounding note names
- From root — interval name of each note measured from the root
- Numerals — qualified Roman numeral for each note (♭3, 5, ♭7, etc.)
- Between notes — intervals between each adjacent pair of notes (bottom-up)
- Slash notation — the slash chord label; explains what a slash chord is (upper chord / bass note)
- Neo-tonal (Riemannian) section — what Riemannian theory is and what each relation label means (Parallel, Relative, Leading-tone exchange, etc.); how to use this information
- Dominant section:
  - Tritone sub — what a tritone substitution is, which chord it points to, why it works
  - Related ii — the ii chord that pairs with this dominant
  - Resolves to — the chord this dominant wants to resolve to, and why
- Diminished section:
  - Enharmonic roots — why a diminished seventh chord has 4 equivalent roots
  - Dom7♭9 subs — which dominant 7♭9 chords this diminished chord can substitute for
- Half-diminished section — what m7♭5 is, how it differs from full diminished, typical use
- Augmented section — what the augmented triad is, its symmetry, enharmonic equivalents
- Suspended section — what sus2 and sus4 are and how they differ from tertian chords
- Power chord section — what a power chord is (root + 5th), why it has no third
- Chord scales — scales whose notes contain all the chord tones. How to use this for improvisation and reharmonisation. The teal character tags (neutral/bright/tense/dark/etc.) explained
- Voice leading section:
  - What voice leading is and why it matters
  - Harmonic contexts — what each context label means (e.g. "diatonic dominant in major")
  - Resolution targets — the chord this one resolves to in this context
  - Cadence type — the cadence name (perfect authentic, imperfect authentic, deceptive, plagal, half) and what each means
  - Strength % — how strong the pull toward resolution is, and how it's calculated
  - Tension dots — what the dot indicators represent
  - The voice leading table columns: From → To (the specific note movements), Direction (up/down/static), Interval (how far each voice moves), Role (what function that voice movement serves)

**Progressions breakdown**
- Per-chord rows — degree label, chord name, notes, intervals from root
- Harmonic function label — what Tonic / Subdominant / Dominant / etc. means for each chord in the progression
- Chord scales per chord — same as chord breakdown, applied to each chord in the progression

#### Section 5 — Music Theory Glossary

All terms that appear anywhere in the app, defined clearly. Target reader knows what a note is and can read basic notation, but may not know theory terminology.

Terms to define (alphabetical or grouped):

- Accidental (sharp, flat, natural, double-sharp, double-flat)
- Augmented interval / chord
- Cadence types (perfect authentic, imperfect authentic, deceptive, plagal, half cadence)
- Cadence strength %
- Chord inversion / figured bass notation (6, 6/4, 6/5, 4/3, 2)
- Chord quality (major, minor, diminished, augmented, dominant, half-diminished)
- Chord scales
- Cluster voicing
- Compound interval / simple equivalent
- Consonance and dissonance (perfect consonance, imperfect consonance, mild dissonance, sharp dissonance)
- Degree / scale degree
- Diatonic
- Drop-2, Drop-3, Drop-2&4 voicings
- Enharmonic equivalence
- Extended chord (9th, 11th, 13th)
- Harmonic field
- Harmonic function (Tonic, Subdominant, Dominant, Predominant)
- Interval
- Inversion of an interval
- Modal character (bright, dark, exotic, symmetric, ambiguous)
- Mode / modal degree
- Parent scale
- Polychord
- Power chord
- Qualifed Roman numeral (♭III, ♯IV, ♭VII, etc.)
- Quartal / quintal voicing
- Riemannian / Neo-tonal relations (Parallel, Relative, Leading-tone exchange, Subdominant parallel, etc.)
- Roman numeral notation
- Rootless voicing
- Secondary dominant
- Semitone / whole tone
- Shell voicing (3+7, 3+♭7)
- Slash chord
- Spread voicing
- Tension (in voice leading context)
- Tension dots
- Triad (major, minor, diminished, augmented)
- Triad map
- Tritone
- Tritone substitution
- Upper Structure Triad (UST)
- Voice leading

### What Help does NOT do
- It does not replace the breakdown — it explains it
- It does not teach music theory from scratch (assumes the reader knows what a note is and can read basic notation)
- It has no interactive elements beyond collapsible sections and search

### Implementation steps
1. Read `about-mode.js` and the About section in `index.html` and `components.css` to understand the exact pattern (button, panel, open/close behaviour, CSS classes)
2. Write `js/modes/help-content.js` — content only, no DOM. One pass per mode, cross-checking every visible label in the app source
3. Write `js/modes/help-mode.js` — rendering logic only, mirroring `about-mode.js` structure
4. Add `?` button to `index.html` header; add script tags for both new files
5. Add Help panel styles to `css/components.css` — reuse existing panel/card CSS variables; add search input style
6. Wire mutual exclusion: opening Help closes About and vice versa
7. Test: open/close, Escape key, Help + About mutual exclusion, search/filter, all collapsible sections, mobile layout
