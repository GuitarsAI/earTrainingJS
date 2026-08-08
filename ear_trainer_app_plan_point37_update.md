# Point 37 — Voice Leading Panel: Status & Design Update
> **This is a focused update to `ear_trainer_app_plan.md` covering Point 37 only.**
> Read `voice_leading_algorithm_plan.md` for the full algorithm spec.
> All other points in the app plan are unchanged.

---

## Status as of Aug 2026

### `voiceLeading.js` — COMPLETE ✓
New file `js/engine/voiceLeading.js` is fully implemented. All 7 steps of the algorithm are
done. Pure functions, no stubs, no DOM access. Ready to be wired into `breakdown.js`.

### `breakdown.js` — NOT YET STARTED
All remaining Point 37 work is here. Split into two passes (see below).

---

## What was decided (Aug 2026 design session)

### Core principle confirmed
No hardcoded lookup tables for resolutions. `RESOLUTION_TARGETS` in `breakdown.js` will be
deleted entirely. Everything derived from `analyseChord()` in `voiceLeading.js`.

### Family handling
| Family | Approach |
|---|---|
| Normal chords | `analyseChord()` directly — full context discovery + voice leading |
| Slash chords | `analyseChord()` on upper chord pitch classes, upper root as harmonic root; bass note is label only |
| UST | Construct implied pitch classes from `shellIntervals + upperTriadIntervals offset by upperTriadRoot` (all in `CHORD_TYPES`); run `analyseChord()` |
| Polychords | Merge upper + lower pitch class sets; use lower root; skip context discovery (polychords are polytonal by design); voice leading only |
| Aug / sus / power | Stay in `AMBIGUOUS_FAMILIES` whitelist; existing simple resolution logic unchanged |

### Polychords — why no diatonic context
Polychords intentionally span two tonal centres. Forcing them into a single scale produces
misleading results. The educational model: user investigates each triad separately, then the
polychord is heard as its own entity — voice leading shows where the notes move, without
claiming it belongs to one key.

### Caching
`analyseChord()` result stored in `currentVoiceLeadingAnalysis` state variable. Computed once
when answer is revealed. Not re-run on every `getResolutionInfo()` call.

### Fuzzy matching
Out of scope for Pass 1 and Pass 2. If a chord fits no scale exactly, the panel shows voice
leading only (no key context label). This is honest — better than approximate or misleading context.

---

## Pass 1 — Data layer

**Goal:** Wire the new engine. No visible UI change.

**What changes:**
- `getResolutionInfo()` normal chord path → reads `currentVoiceLeadingAnalysis`, picks primary
  resolution (highest tension context + highest strength), maps to existing flat shape
- `getResolutionInfo()` slash path → same, using upper chord data
- `getResolutionInfo()` UST path → constructs implied chord, runs `analyseChord()`
- `getResolutionInfo()` poly path → merges pitch classes, skips context discovery
- `computeVoiceLeading()` → replaced by `computeVoiceLeadingRules()` from `voiceLeading.js`
- `RESOLUTION_TARGETS` → deleted

**What does NOT change:** all callers of `getResolutionInfo()` (`playResolution()`,
`renderResolutionNotation()`, `makeVoiceLeadingRow()`). They still receive the same flat shape.
Visual output is identical to current.

**Files changed:** `js/breakdown/breakdown.js` only.

---

## Pass 2 — UI upgrade (multi-resolution pills)

**Goal:** Surface the full richness of `analyseChord()` output.

**What changes:**
- `makeVoiceLeadingRow()` renders multiple pills, one per resolution context
- Each pill: roman numeral · scale name · cadence name · strength indicator
- Expanding a pill shows the voice leading table for that resolution
- Visual model: follow `makeRiemannRow()` pill pattern in `breakdown.js`
- `playResolution()` continues to play the single primary resolution (no change to audio)

**Files changed:** `js/breakdown/breakdown.js`, `css/components.css`

---

## Files to change (full list)
| Change | File |
|---|---|
| Wire `analyseChord()`, delete `RESOLUTION_TARGETS`, replace proximity loop | `js/breakdown/breakdown.js` |
| Multi-resolution pill styles (Pass 2) | `css/components.css` |
| No changes needed | `js/engine/voiceLeading.js`, `js/data/chords.js`, `js/data/spelling.js` |
