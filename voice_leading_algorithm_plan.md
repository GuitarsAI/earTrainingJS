# Voice Leading & Resolution Algorithm — Design Plan

> **App context:** This algorithm is being built for **Sound Travels**, a professional ear
> training app. See `ear_trainer_app_plan.md` for the full app plan and status. This algorithm
> implements **Point 37 (Option B)** of that plan.

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

```
Major (Ionian):   [2, 2, 1, 2, 2, 2, 1]
Natural Minor:    [2, 1, 2, 2, 1, 2, 2]
Harmonic Minor:   [2, 1, 2, 2, 1, 3, 1]
Melodic Minor:    [2, 1, 2, 2, 2, 2, 1]
Modes: derived by rotating the major scale pattern
... (all 25 scales already in SCALES)
```

### 2.2 Chord Type Interval Signatures — ALREADY EXISTS in `js/data/chords.js`

The `CHORD_TYPES` object in `chords.js` covers every family including slash, poly, UST, and
all extensions to 13ths. **No changes needed.** The algorithm reads directly from `CHORD_TYPES`.

```
Major triad:         [4, 3]       → already in CHORD_TYPES.major
Minor triad:         [3, 4]       → already in CHORD_TYPES.minor
Dominant 7th:        [4, 3, 3]    → already in CHORD_TYPES.dominant
Half-diminished:     [3, 3, 4]    → already in CHORD_TYPES.diminished
Diminished 7th:      [3, 3, 3]    → already in CHORD_TYPES.diminished
... (all families already in CHORD_TYPES)
```

Everything else — contexts, tensions, resolutions, voice leading — is **computed from these**.

---

## 3. What Already Exists in the App (Audit)

Before building, what can be reused vs replaced:

### Keep and integrate directly
| Existing code | Location | Role in new algorithm |
|---|---|---|
| `SCALES` | `js/data/chords.js` | Step 3 primitive — iterate all 25 scales × 12 roots |
| `CHORD_TYPES` | `js/data/chords.js` | Step 1 primitive — interval signature matching |
| `getChordScales()` | `js/breakdown/breakdown.js` | **Foundation of Step 3** — extend, not replace |
| `computeRiemannRelations()` | `js/breakdown/breakdown.js` | Feeds into Step 7 output |
| `computeTritoneSubInfo()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `computeDimDomSubs()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `computeHalfDimContext()` | `js/breakdown/breakdown.js` | Feeds into Step 5 resolution targets |
| `spelledNote()` / `spelledRoot()` | `js/data/spelling.js` | Output layer — untouched |
| `computeVoiceLeading()` skeleton | `js/breakdown/breakdown.js` | Structure kept, rule engine replaces proximity loop |

### Replace entirely
| Existing code | Problem | Replacement |
|---|---|---|
| `RESOLUTION_TARGETS` | Hardcoded lookup table, one resolution per chord symbol | Step 5: algorithmic derivation from function rules |
| Proximity loop in `computeVoiceLeading()` | Nearest-note only, no tendency-tone awareness (e.g. D→C in G7→C is wrong; should be D→E or D→G) | Step 6: 7-rule priority engine with hard/soft constraints |
| `getResolutionInfo()` | Reads from lookup table, one context only | Replaced by new context engine output |

### Key insight: `getChordScales()` is Step 3, partially implemented
`getChordScales()` already does set-intersection of chord PCs against all scales. The
critical difference for Option B: it currently only checks the **chord's own root** against
scales, whereas Step 3 must iterate **all 12 roots** to find every context. For example, Am
(A, C, E) must be checked against C major (where it's vi), G major (where it's ii), E minor
(where it's iv), etc. — not just A minor (where it's i).

---

## 4. Algorithm Pipeline

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
  │                                           iterates all 12 roots × all SCALES
  ▼
STEP 4: Tension Scoring per Context
  │
  ▼
STEP 5: Resolution Target Derivation      ← replaces RESOLUTION_TARGETS
  │
  ▼
STEP 6: Voice Leading Computation         ← replaces proximity loop
  │        (constraint satisfaction, 7-rule priority engine)
  ▼
STEP 7: Ranking & Final Output

OUTPUT: structured data per context — feeds multi-resolution pill UI
```

---

## 5. Step-by-Step Design

### Step 1: Chord Identification

**Input:** a set of notes (pitch classes, 0–11) + known root (from app state)

**Process:**
- Normalize pitches to a single octave (mod 12)
- Try each note as a potential root
- Compute interval stack from that root
- Match interval stack against `CHORD_TYPES` interval signatures
- Score each match (exact = 1.0, fuzzy with 1 alteration = 0.8, etc.)

**Output:** list of `(root, chord_type, confidence)` tuples, ranked by confidence

**Example:** `[C, E, G, B, D, F#]`
- Root C → intervals [4, 7, 11, 14, 18] → matches Cmaj9#11 (confidence 1.0)
- Root E → intervals [3, 7, 10, 14, ...] → partial match (lower confidence)

---

### Step 2: Multi-Root Interpretation

**Why:** complex chords are often ambiguous (polychords, slash chords, enharmonic reinterpretation)

**Process:**
- Take the top N root interpretations from Step 1
- For each, compute enharmonic respellings (F# vs G♭, etc.)
- Flag slash chord possibilities (e.g. Em7 over C bass = Cmaj9 no root)
- Rank by: standard chord type familiarity, voice leading implications, spelling economy

**Special handling for existing chord families:**
- **Poly chords:** analyse each layer (upper/lower) separately, then combine contexts
- **UST chords:** resolve as the implied chord (already partially handled in `getResolutionInfo()`)
- **Slash chords:** treat upper triad as primary for context discovery, bass note as modifier

**Output:** primary interpretation + list of alternate interpretations

---

### Step 3: Diatonic Context Discovery

**Goal:** find every key and scale where this chord naturally appears

**Extends:** `getChordScales()` — same set-intersection logic, broader iteration scope

**Critical difference from current code:**
Current `getChordScales()` checks one root. Step 3 iterates **all 12 roots × all 25 SCALES**
(~300 checks per chord) to find every context. This is fast — pure integer arithmetic.

**Process:**
```
for each scaleType in SCALES:                          // 25 scale types
  for each scaleRootPc in 0..11:                       // 12 roots
    build scalePitchClasses from scaleRootPc + scaleType.intervals
    check if ALL chord pitch classes ⊆ scalePitchClasses  // set intersection
    if match:
      scaleDegree = position of chordRootPc in scale
      roman = semitoneToDegree(scaleDegree, chordQuality)  // reuse existing fn
      harmonicFunction = classifyFunction(scaleDegree, scaleType)
      record { scaleType, scaleRoot, scaleDegree, roman, harmonicFunction, matchQuality: 1.0 }
    else if fuzzyMatch (all but 1 PC match):
      record with matchQuality: 0.8, alteredNote flagged
```

**Reuses existing functions:**
- `semitoneToDegree()` — already in `breakdown.js`, computes qualified Roman numeral
- Set-intersection logic from `getChordScales()`

**Output:** list of contexts:
```javascript
[
  { scaleType: 'major', scaleRoot: 'G', scaleDegree: 4, roman: 'IV',
    function: 'subdominant', tension: 0.45, matchQuality: 1.0 },
  { scaleType: 'lydian', scaleRoot: 'C', scaleDegree: 1, roman: 'I',
    function: 'tonic', tension: 0.0, matchQuality: 1.0 },
  { scaleType: 'major', scaleRoot: 'D', scaleDegree: 7, roman: 'VII',
    function: 'subtonic', tension: 0.6, matchQuality: 0.9 },
  ...
]
```

---

### Step 4: Tension Scoring

**Goal:** for each context, compute how much harmonic tension the chord carries

**Rules (derived from scale degree, not hardcoded per chord):**

| Scale Degree | Function | Tension Score |
|---|---|---|
| I, i | Tonic | 0.0 — at rest |
| III, iii | Mediant/Tonic | 0.1 |
| VI, vi | Submediant/Tonic | 0.2 |
| IV, iv | Subdominant | 0.4 |
| II, ii | Supertonic/Pre-dominant | 0.5 |
| II° | Diminished Supertonic | 0.6 |
| VII (subtonic) | Weak dominant | 0.6 |
| V | Dominant | 0.8 |
| V7 | Dominant seventh | 0.9 |
| VII° | Leading tone diminished | 0.95 |

**Modifiers:**
- Add 0.1 if chord contains a tritone (detectable from interval stack)
- Add 0.05 per chromatic alteration
- Add 0.1 if chord is a secondary dominant (V/V, V/IV, etc.)

**Output:** tension score (0.0–1.0) attached to each context from Step 3

---

### Step 5: Resolution Target Derivation

**Goal:** compute where each context wants to resolve — purely from functional harmony rules

**Replaces:** `RESOLUTION_TARGETS` lookup table entirely

**Rules:**

```
Tonic function (I, i, III, VI):
  → stable, no strong resolution needed
  → suggest departure: can move to IV or ii to restart motion
  → tension = 0, resolution_strength = 0

Subdominant function (IV, ii):
  → primary: resolves to V (dominant) — root up P5, or down P4
  → secondary: resolves directly to I (plagal) — root up P4
  → feeds into: computeTritoneSubInfo() for enriched jazz options

Dominant function (V, V7, VII°):
  → primary: resolves to I or i (tonic)
  → tonic root = dominant root − 7 semitones (P5 down), or + 5 (P4 up)
  → deceptive: resolves to vi instead of I
  → tritone sub: resolves to chord a TT away (feeds computeTritoneSubInfo())
  → feeds into: computeDimDomSubs() for dim7 substitution contexts

Secondary dominant (V/X):
  → resolves to X (its own temporary tonic)
  → X root = secondary dominant root + 5 semitones
```

**All resolution targets computed from interval relationships, not tables.**

**Multiple resolutions per context** — ranked by strength:
1. Functional resolution (tritone-driven) — always first
2. Deceptive cadence (V→vi)
3. Modal / jazz alternatives (tritone sub, backdoor dominant)
4. Exotic / chromatic resolutions

**Exception whitelist (small, principled):**
Some cases genuinely can't be computed unambiguously and need a small override:
- **Augmented chords** — three enharmonically equal resolutions; algorithm can't pick one
- **Sus chords** — tension ambiguous by design; resolve to same-root major/minor
- **Power chords** — no harmonic information; resolve to same-root major
- **Polychords / UST** — no single clear root; handled per-layer then combined

**Output:** per context, list of `{ targetRoot, targetQuality, resolutionType, strength }`

---

### Step 6: Voice Leading Computation

**Goal:** for each note in the chord, given a resolution target, find where it wants to go

**Replaces:** the proximity loop in `computeVoiceLeading()`

**Model:** constraint satisfaction — hard constraints first, soft constraints scored

#### Hard Constraints (must satisfy)
1. **Leading tone must rise** — note exactly 1 semitone below target tonic → moves up by m2
2. **Chordal 7th must fall** — the 7th of a dominant chord → moves down by m2 to 3rd of target
3. **No unison collision** — two voices must not resolve to same pitch class (unless doubling rules permit)
4. **Avoid doubling the 3rd** of the target chord; prefer doubling the root

#### Soft Constraints (scored, minimise total penalty)
5. **Tritone resolution** — tritone pair resolves inward by half step (standard) or outward (♭9 contexts); strong preference, not absolute
6. **Common tones** — notes shared with target chord prefer to stay static
7. **Stepwise motion** — prefer motion by 1–2 semitones; score: `1 / (semitones_moved + 1)`
8. **Contrary motion** — if one voice leaps, others prefer opposite direction; soft preference

**Correct example — G7 → C major:**
```
B  → C   (m2 ↑  — leading tone, hard constraint #1)
F  → E   (m2 ↓  — chordal 7th, hard constraint #2)
G  → G   (common tone, soft constraint #6)
D  → E   (stepwise up, soft constraint #7 — NOT D→C which was the old wrong answer)
```
The old proximity loop incorrectly moved D→C (nearest note). The constraint engine moves
D→E (completes the target triad, avoids doubling the root that G already covers).

**Output per note:**
```javascript
{
  fromNote: 'F',
  toNote: 'E',
  semitones: 1,
  direction: 'down',
  reason: 'chordal_seventh_resolves_down'  // reason code for UI display
}
```

**Reason codes:** `leading_tone_up`, `chordal_seventh_down`, `tritone_inward`,
`chromatic_raise_pull`, `common_tone`, `stepwise_preference`, `contrary_motion`

---

### Step 7: Ranking & Final Output

**Rank contexts by:**
1. Tension score (higher tension = more interesting / musically active)
2. Match quality (exact diatonic fit before fuzzy)
3. Scale commonality (major/minor before exotic modes)
4. Resolution strength of best available resolution

**Final output structure:**
```javascript
{
  inputChord: 'Cmaj9#11',
  notes: ['C', 'E', 'G', 'B', 'D', 'F#'],
  primaryInterpretation: { root: 'C', type: 'Maj7_9_s11', confidence: 1.0 },
  alternateInterpretations: [...],
  contexts: [
    {
      scaleType: 'major',
      scaleRoot: 'G',
      scaleDegree: 4,
      romanNumeral: 'IVmaj9#11',
      harmonicFunction: 'subdominant',
      tension: 0.45,
      resolvesTo: [
        {
          chord: 'Gmaj',
          resolutionType: 'plagal',        // label shown on pill
          cadenceName: 'IV → I',           // shown on pill
          strength: 0.7,
          voiceLeading: [
            { fromNote: 'C', toNote: 'B', semitones: 1, direction: 'down',
              reason: 'seventh_resolves_down' },
            { fromNote: 'E', toNote: 'D', semitones: 2, direction: 'down',
              reason: 'stepwise_preference' },
            { fromNote: 'G', toNote: 'G', semitones: 0, direction: 'none',
              reason: 'common_tone' },
            { fromNote: 'B', toNote: 'B', semitones: 0, direction: 'none',
              reason: 'common_tone' },
            { fromNote: 'D', toNote: 'D', semitones: 0, direction: 'none',
              reason: 'common_tone' },
            { fromNote: 'F#', toNote: 'G', semitones: 1, direction: 'up',
              reason: 'chromatic_raise_pull' }
          ]
        },
        // ... more resolution options for this context
      ]
    },
    // ... more contexts
  ]
}
```

---

## 6. Edge Cases & Solutions

| Challenge | Solution |
|---|---|
| Multiple valid roots | Multi-root pass (Step 2), rank by confidence |
| Chord fits no scale exactly | Fuzzy matching — record with matchQuality 0.8, flag altered note |
| Enharmonic ambiguity (F# vs G♭) | Try both spellings, pick by voice leading economy; delegate to `spelledNote()` |
| Tonic chord (no resolution needed) | tension=0, flag as stable, suggest departure paths (→IV or →ii) |
| Very complex chords (13ths, 6 voices) | Voice priority ranking — leading tones and 7ths first, free voices last |
| Polychords | Analyse each layer separately, combine contexts; already partially handled in existing code |
| Modal ambiguity | All 25 SCALES included in Step 3 — Dorian, Lydian, etc. all found automatically |
| Augmented / sus / power chords | Exception whitelist in Step 5 (small, principled, not a full lookup table) |
| Too many contexts (exotic chords) | Rank by tension + commonality, surface top 4–5 in UI; full list available |

---

## 7. What Is NOT Hardcoded

To be explicit — none of the following are lookup tables:

- ❌ "C major resolves to F major" — derived from subdominant function rule
- ❌ "B is a leading tone" — derived from interval to tonic (1 semitone below)
- ❌ "G7 wants to go to C" — derived from dominant function + tritone detection
- ❌ "F# pulls upward" — derived from chromatic raise rule
- ❌ "Am is vi in C major" — derived by iterating all 12 roots × SCALES

The **only** encoded knowledge is:
- ✅ Scale interval patterns — already in `SCALES` in `chords.js`
- ✅ Chord interval signatures — already in `CHORD_TYPES` in `chords.js`
- ✅ Functional tension weights per scale degree (compact rule table, not chord outcomes)
- ✅ Exception whitelist for aug/sus/power/poly (small and principled)

---

## 8. Implementation Plan

### New file: `js/engine/voiceLeading.js`

All new logic lives here. Clean separation from breakdown rendering.

```
js/engine/voiceLeading.js
  ├── identifyChord(pitchClasses, knownRoot)
  ├── findDiatonicContexts(pitchClasses, chordRootPc)   ← extends getChordScales()
  ├── classifyFunction(scaleDegree, scaleType)
  ├── scoreTension(harmonicFunction, chordIntervals)
  ├── deriveResolutionTargets(context, chordRootPc)      ← replaces RESOLUTION_TARGETS
  └── computeVoiceLeadingRules(sourceMidi, targetMidi, context)  ← replaces proximity loop
```

### Changes to existing files (minimal)
| File | Change |
|---|---|
| `js/breakdown/breakdown.js` | `makeVoiceLeadingRow()` — consume new rich context data, render pills |
| `js/breakdown/breakdown.js` | `getResolutionInfo()` — call `voiceLeading.js` instead of `RESOLUTION_TARGETS` |
| `js/breakdown/breakdown.js` | `computeVoiceLeading()` — replace proximity loop with `computeVoiceLeadingRules()` |
| `js/data/chords.js` | No changes — `SCALES` and `CHORD_TYPES` are already correct |
| `js/data/spelling.js` | No changes — `spelledNote()` / `spelledRoot()` used as output layer |

### Build order
```
1. findDiatonicContexts()     — pure logic, no UI, testable in isolation
                                 iterates SCALES × 12 roots, adds degree/function/tension
2. deriveResolutionTargets()  — pure logic, no UI, replaces RESOLUTION_TARGETS
3. computeVoiceLeadingRules() — drop-in replacement for proximity loop
4. Wire to UI                 — makeVoiceLeadingRow() consumes new data, renders pills
```

Steps 1–3 are pure functions with no UI dependencies. They can be built and tested before
touching any rendering code.

### Relationship to Point 37 spec in app plan
The Point 37 spec describes a "hybrid algorithm" (tritone-driven with small exception
whitelist). This document is the full spec of that algorithm. The pill UI, timing fix,
and notation updates described in Point 37 remain as specced — this document only concerns
the data layer that feeds them.

---

## 9. Extensibility

The algorithm is designed to extend without restructuring:

- **More scales:** add entries to `SCALES` in `chords.js` — Step 3 picks them up automatically
- **More chord types:** add entries to `CHORD_TYPES` — Step 1 picks them up automatically
- **Jazz harmony:** tritone sub already derived in Step 5; altered scale already in SCALES
- **Style filters:** toggle which voice leading rules (Step 6) are active per style
- **Secondary dominants:** extend Step 3 to detect V/V, V/IV patterns after primary match
- **Point 47 (Harmonic Field):** Step 3's context data directly feeds the harmonic field
  breakdown row — the diatonic chords are a natural byproduct of the context discovery loop
