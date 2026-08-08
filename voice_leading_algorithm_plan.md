# Voice Leading & Resolution Algorithm — Design Plan

> **App context:** This algorithm is being built for **Sound Travels**, a professional ear
> training app. See `ear_trainer_app_plan.md` for the full app plan and status. This algorithm
> implements **Point 37 (Option B)** of that plan.

---

## Changelog

- **Session Aug 2026** — Initial plan written. Option B chosen over Option A.
- **Session Aug 2026 (Pass 1 design)** — Full scope discussion completed. Decisions recorded
  in §3, §4, §8. `voiceLeading.js` confirmed complete as a pure engine (all 7 steps
  implemented, no stubs). Pass 1 and Pass 2 scope locked. Poly/UST/slash handling decided.
- **Session Aug 2026 (Pass 1 implementation)** — Pass 1 complete. All three files delivered.
  `state.js`, `chords-mode.js`, and `breakdown.js` updated. See §8 for full status.
  Two improvements added beyond the original Pass 1 spec: `targetQuality` added as a
  first-class field on `getResolutionInfo()` return value (eliminates fragile string parsing);
  harmonic field pills redesigned with proper musical notation throughout.

---

## 1. Overview & Goals

Build an **intelligent, rule-based algorithm** that takes any chord as input and outputs:
- All harmonic contexts (keys and scale degrees) the chord can function in
- Tension level per context
- Resolution targets per context
- Per-note voice leading with reason codes

**Core principle:** Encode the *rules* of tonal harmony, not the results. No hardcoded lookup
tables or dictionaries for chords or resolutions. Everything is derived from interval arithmetic
and a minimal set of scale/chord primitives.

**Option B** was chosen over a targeted fix (Option A) because:
- The app already has `SCALES` and `CHORD_TYPES` in `chords.js` — exactly the primitives needed
- `getChordScales()` is already doing partial context discovery (scale membership) — Option B
  extends it rather than replaces it
- The richer output (all contexts, all resolutions, reason codes) fits the educational mission
  of the app and feeds naturally into the multi-resolution pill UI already specced in Point 37

---

## 2. Foundational Primitives (Minimal Encoded Knowledge)

These are the only "hardcoded" structures — small, principled, and universal.

### 2.1 Scale Interval Patterns — ALREADY EXISTS in `js/data/chords.js`

The `SCALES` array in `chords.js` is the exact primitive needed. 25 scales, each with
`intervals` array and `parentKey` offset. **No changes needed.** The algorithm reads directly
from `SCALES`.

### 2.2 Chord Type Interval Signatures — ALREADY EXISTS in `js/data/chords.js`

The `CHORD_TYPES` object in `chords.js` covers every family including slash, poly, UST, and
all extensions to 13ths. **No changes needed.** The algorithm reads directly from `CHORD_TYPES`.

Everything else — contexts, tensions, resolutions, voice leading — is **computed from these**.

---

## 3. What Already Exists in the App (Audit) — Updated Aug 2026

### Keep and integrate directly
| Existing code | Location | Role in new algorithm |
|---|---|---|
| `SCALES` | `js/data/chords.js` | Step 3 primitive — iterate all 25 scales × 12 roots |
| `CHORD_TYPES` | `js/data/chords.js` | Step 1 primitive — interval signature matching |
| `getChordScales()` | `js/breakdown/breakdown.js` | Foundation of Step 3 — extend, not replace |
| `computeRiemannRelations()` | `js/breakdown/breakdown.js` | Feeds into Step 7 output |
| `computeTritoneSubInfo()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `computeDimDomSubs()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `computeHalfDimContext()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `spelledNote()` / `spelledRoot()` | `js/data/spelling.js` | Output layer — untouched |
| `buildResolutionMidi()` | `js/breakdown/breakdown.js` | Builds target MIDI notes for audio — keep |
| `VL_INTERVAL_NAMES` | `js/breakdown/breakdown.js` | Display helper — keep |
| `vlRoleLabel()` | `js/breakdown/breakdown.js` | Display helper — keep |

### Replace entirely
| Existing code | Problem | Replacement |
|---|---|---|
| `RESOLUTION_TARGETS` | Hardcoded lookup table, one resolution per chord symbol | `analyseChord()` — algorithmic derivation for all normal chords, slash, UST. **Kept as fallback in current implementation until `analyseChord()` cache is populated.** |
| Proximity loop in `computeVoiceLeading()` | Nearest-note only, no tendency-tone awareness | `computeVoiceLeadingRules()` — 7-rule priority engine in `voiceLeading.js`. **Wired in Pass 1; proximity loop kept as fallback when engine unavailable.** |
| `getResolutionInfo()` normal chord path | Reads from `RESOLUTION_TARGETS` | Now reads from `currentVoiceLeadingAnalysis` cache when populated; falls back to `RESOLUTION_TARGETS` when cache is null. **RESOLUTION_TARGETS not yet deleted — serves as live fallback.** |
| Poly/UST/slash hardcoded offsets in `getResolutionInfo()` | Small hardcoded tables | Each family now has a clean path in `getResolutionInfo()`. `targetQuality` is a first-class return field — no string parsing. |

### `voiceLeading.js` status — COMPLETE ✓
All 7 steps fully implemented as of Aug 2026. No stubs. Pure functions, no DOM access.
- `findDiatonicContexts()` — Step 3, iterates SCALES × 12 roots (~300 checks per chord)
- `scoreTension()` — Step 4, BASE_TENSION + tritone + alteration modifiers
- `deriveResolutionTargets()` — Step 5, tonic/dominant/subdominant/predominant rules
- `computeVoiceLeadingRules()` — Step 6, 7-rule constraint engine
- `analyseChord()` — public entry point, ties all steps together

---

## 4. Family-by-Family Handling — Decided Aug 2026

### Normal chords
Run `analyseChord(chordRootPc, chordPitchClasses, chordIntervals, sourceMidi, family)` directly.
`RESOLUTION_TARGETS` retained as fallback but superseded by cache when populated.

### Slash chords
Pass upper chord root as `chordRootPc`, full pitch class set (upper notes only — bass is a
label modifier, not part of the harmonic identity) as `chordPitchClasses`, upper triad
intervals as `chordIntervals`. Run `analyseChord()` once. Bass note appears in the label but
does not affect context discovery. `currentUpperRootMidi` and `currentChord.upperIntervals`
provide everything needed.

### Polychords
Merge upper and lower pitch class sets into one combined set. Use lower root
(`currentPolyLowerRootMidi`) as `chordRootPc`. Skip diatonic context discovery — polychords
are inherently polytonal and forcing them into a single scale would give misleading results.
Run voice leading computation directly against the resolution target derived from the lower
root's function. If no context is found, show voice leading only (no key context label).

This matches the educational intent: the user explores each triad individually, then the
polychord is presented as its own entity with voice leading showing where the combined notes go.

### UST (Upper Structure Triads)
Construct the full implied chord pitch classes from the chord data directly — no lookup needed:
```
impliedPcs = shellIntervals + upperTriadIntervals.map(i => i + upperTriadRoot)
```
All three values (`shellIntervals`, `upperTriadIntervals`, `upperTriadRoot`) are already in
every UST entry in `CHORD_TYPES`. Use `currentUSTRootMidi` as the chord root. Run
`analyseChord()` on the implied chord. `shellQuality` (dom7 / min / maj7) is available for
context but the algorithm derives function from the pitch classes, not from this label.

### Ambiguous families (aug, sus, power)
These remain in `AMBIGUOUS_FAMILIES` — flagged in `analyseChord()`, fall back to existing
simple resolution logic. No change from original plan.

---

## 5. Algorithm Pipeline

```
INPUT: any chord (root + set of pitch classes)

  │
  ▼
STEP 1: Chord Identification
  │
  ▼
STEP 2: Multi-Root Interpretation
  │
  ▼
STEP 3: Diatonic Context Discovery        ← extends getChordScales()
  │                                           iterates all 12 roots × all SCALES (~300 checks)
  ▼
STEP 4: Tension Scoring per Context
  │
  ▼
STEP 5: Resolution Target Derivation      ← supersedes RESOLUTION_TARGETS
  │
  ▼
STEP 6: Voice Leading Computation         ← supersedes proximity loop
  │        (constraint satisfaction, 7-rule priority engine)
  ▼
STEP 7: Ranking & Final Output

OUTPUT: structured data per context — feeds multi-resolution pill UI (Pass 2)
```

---

## 6. Step-by-Step Design

### Step 3: Diatonic Context Discovery

Iterates all 25 SCALES × 12 roots (~300 checks per chord). Pure integer arithmetic — fast.
Result is cached in `currentVoiceLeadingAnalysis` state variable after first computation
(when answer is revealed). Not re-run on every `getResolutionInfo()` call.

### Step 6: Voice Leading Computation — constraint engine

#### Hard Constraints (must satisfy)
1. **Leading tone must rise** — note exactly 1 semitone below target tonic → moves up by m2
2. **Chordal 7th must fall** — the 7th of a dominant chord → moves down by m2 to 3rd of target
3. **No unison collision** — two voices must not resolve to same pitch class
4. **Avoid doubling the 3rd** of the target chord; prefer doubling the root

#### Soft Constraints (scored)
5. **Tritone resolution** — tritone pair resolves inward by half step
6. **Common tones** — notes shared with target chord prefer to stay static
7. **Stepwise motion** — prefer motion by 1–2 semitones
8. **Contrary motion** — if one voice leaps, others prefer opposite direction

**Correct example — G7 → C major:**
```
B  → C   (m2 ↑  — leading tone, hard constraint #1)
F  → E   (m2 ↓  — chordal 7th, hard constraint #2)
G  → G   (common tone, soft constraint #6)
D  → E   (stepwise up, soft constraint #7 — NOT D→C which was the old wrong answer)
```

---

## 7. What Is NOT Hardcoded

- ❌ "C major resolves to F major" — derived from subdominant function rule
- ❌ "B is a leading tone" — derived from interval to tonic (1 semitone below)
- ❌ "G7 wants to go to C" — derived from dominant function + tritone detection
- ❌ "F# pulls upward" — derived from chromatic raise rule
- ❌ "Am is vi in C major" — derived by iterating all 12 roots × SCALES
- ❌ "UST dom7 resolves to I" — derived from implied chord's diatonic function

The **only** encoded knowledge is:
- ✅ Scale interval patterns — already in `SCALES` in `chords.js`
- ✅ Chord interval signatures — already in `CHORD_TYPES` in `chords.js`
- ✅ Functional tension weights per scale degree (`BASE_TENSION` in `voiceLeading.js`)
- ✅ Exception whitelist for aug/sus/power (small and principled)

---

## 8. Implementation Plan — Updated Aug 2026 (Pass 1 complete)

### Current status

| File | Status |
|---|---|
| `js/engine/voiceLeading.js` | ✅ Complete — all 7 steps, no stubs |
| `js/engine/state.js` | ✅ Updated — `currentVoiceLeadingAnalysis = null` added |
| `js/modes/chords-mode.js` | ✅ Updated — cache reset in `generateChordQuestion()`; `_buildVoiceLeadingAnalysis()` called at answer-reveal in `submitChordAnswer()` |
| `js/breakdown/breakdown.js` | ✅ Updated — `getResolutionInfo()` reads cache; `computeVoiceLeading()` uses `computeVoiceLeadingRules()`; `targetQuality` is a first-class return field; harmonic field pills redesigned |

### Pass 1 — Data layer ✅ COMPLETE

**Goal:** Wire `analyseChord()` into the app. Existing UI continues to work identically.

**Steps completed:**
1. ✅ `currentVoiceLeadingAnalysis = null` added to `state.js`; reset in `generateChordQuestion()` for all four chord family paths
2. ✅ `_buildVoiceLeadingAnalysis()` called in `submitChordAnswer()` after `answered = true`; result stored in `currentVoiceLeadingAnalysis`; handles all four families (normal, slash, UST, poly)
3. ✅ `getResolutionInfo()` normal chord path reads from `currentVoiceLeadingAnalysis` when populated; maps primary resolution to flat return shape; falls back to `RESOLUTION_TARGETS` when cache is null
4. ✅ Slash path: clean `targetQuality` return, no fragile suffix parsing
5. ✅ UST path: clean `targetQuality` return; label corrected from `'→ IVΔ7'` to `'→ IVMaj7'` (app uses `Maj7`, not `Δ`)
6. ✅ Poly path: clean `targetQuality` return; voice leading goes straight to proximity/rules engine
7. ✅ `computeVoiceLeading()` calls `computeVoiceLeadingRules()` when engine + context available; proximity fallback retained
8. ⚠️ `RESOLUTION_TARGETS` **retained as live fallback** — not yet deleted. Will be deleted in a future cleanup pass once the engine is confirmed stable in production.

**Improvements added beyond original Pass 1 spec:**
- `targetQuality` is now a first-class field on the `getResolutionInfo()` return object. `computeVoiceLeading()` reads it directly — no string parsing of `targetName`. `qualSuffix()` helper inside `getResolutionInfo()` ensures display labels (`'7'`, `'Maj7'`, `'m'`) are derived from `targetQuality` in one place.
- `harmonicFieldSymbolSuffix()` added to `breakdown.js` — single source of truth mapping all internal chord symbols to display suffixes consistent with app notation (no triangles, no `ø`). Harmonic field pills now show three lines: Roman numeral with quality suffix, root + quality shorthand (`Dm7`, `G7`, `B°`), full quality name (`minor 7th`, `dominant 7th`, `diminished`). Interval fallback cases (`chordSym = null`) suppress the quality name line gracefully.

### Pass 2 — Multi-resolution pills UI (not yet started)

**Goal:** Expose the full richness of `analyseChord()` output in the breakdown panel.

- `makeVoiceLeadingRow()` renders multiple resolution pills, one per context
- Each pill shows: roman numeral · scale name · cadence name · strength
- Expanding a pill shows the voice leading table for that resolution
- Pill pattern follows `makeRiemannRow()` as the model
- `playResolution()` continues to play the primary resolution (no change)

**Files to change:** `js/breakdown/breakdown.js`, `css/components.css`

### New file: `js/engine/voiceLeading.js` — COMPLETE ✓

```
js/engine/voiceLeading.js
  ├── identifyChord()            — Step 1
  ├── findDiatonicContexts()     — Step 3, extends getChordScales()
  ├── scoreTension()             — Step 4
  ├── deriveResolutionTargets()  — Step 5, supersedes RESOLUTION_TARGETS
  ├── computeVoiceLeadingRules() — Step 6, supersedes proximity loop
  └── analyseChord()             — public entry point
```

### Changes to existing files
| File | Change | Status |
|---|---|---|
| `js/engine/state.js` | Added `currentVoiceLeadingAnalysis = null` | ✅ Done |
| `js/modes/chords-mode.js` | Cache reset + `_buildVoiceLeadingAnalysis()` wiring | ✅ Done |
| `js/breakdown/breakdown.js` | Pass 1: `getResolutionInfo()` reads cache; `computeVoiceLeading()` uses rules engine; `targetQuality` field; harmonic field pills redesigned | ✅ Done |
| `js/breakdown/breakdown.js` | Pass 2: `makeVoiceLeadingRow()` — multi-resolution pills | Not yet started |
| `css/components.css` | Pass 2: pill styles for resolution cards | Not yet started |
| `js/data/chords.js` | No changes | — |
| `js/data/spelling.js` | No changes | — |

---

## 9. Edge Cases & Solutions

| Challenge | Solution |
|---|---|
| Multiple valid roots | Multi-root pass (Step 2), rank by confidence |
| Chord fits no scale exactly | Fuzzy matching — out of scope for Pass 1 and Pass 2; show "no diatonic context" if empty |
| Polychord fits no scale | Expected — skip context discovery, show voice leading only |
| Enharmonic ambiguity (F# vs G♭) | Try both spellings, delegate to `spelledNote()` |
| Tonic chord (no resolution needed) | tension=0, flag as stable, suggest departure paths |
| Very complex chords (13ths, 6 voices) | Voice priority ranking — leading tones and 7ths first |
| Augmented / sus / power chords | `AMBIGUOUS_FAMILIES` whitelist — fall back to existing logic |
| Too many contexts | Rank by tension + commonality, surface top 4–5 in Pass 2 UI |

---

## 10. Extensibility

- **More scales:** add entries to `SCALES` — Step 3 picks them up automatically
- **More chord types:** add entries to `CHORD_TYPES` — Step 1 picks them up automatically
- **Fuzzy matching:** add to Step 3 when needed — relaxes exact-fit requirement
- **Secondary dominants:** extend Step 3 to detect V/V, V/IV patterns after primary match
- **Point 47 (Harmonic Field):** Step 3's context data directly feeds the harmonic field row
