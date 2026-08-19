# Voice Leading Algorithm — Redesign Plan (v3)

> **Scope:** This document fully replaces the v2 plan. It covers three bugs and one
> full algorithm rewrite across two files: `js/engine/voiceLeading.js` and
> `js/breakdown/breakdown.js`. Read this entire document before touching either file.
>
> **Core principle:** No hardcoded tables, no hardcoded note names, no hardcoded
> tendency-tone rules. Every decision the engine makes must be derivable from
> `CHORD_TYPES`, `SCALES`, and interval arithmetic. If a fix requires adding a new
> lookup table or a named constant for a specific note or chord tone, that fix is wrong.

---

## 1. Problems Being Solved

### 1.1 Bug — Empty tonic contexts

**Symptom:** Ab Harmonic Major (III) and Eb Prometheus Liszt (VI) show no content in
the voice leading panel when the source chord is C7(♯9)(♭13).

**Cause:** `deriveResolutionTargets()` gates the tonic branch on `context.tension < 0.2`:

```js
if (harmonicFunction === 'tonic' && context.tension < 0.2) {
```

C7(♯9)(♭13) has pitch classes {0, 3, 4, 7, 8, 10}. `scoreTension()` adds a tritone
bonus (+0.08) and three alteration bonuses (Bb, D♯, Ab are outside C major × 0.04 =
+0.12). On a tonic-function degree with `BASE_TENSION` of 0.15 or 0.2, the total
crosses 0.2 and the gate never fires. All three arrays stay empty. The context header
renders but the body is blank.

The same gate is mirrored in `breakdown.js`:

```js
const isDeparture = ctx.harmonicFunction === 'tonic' && ctx.tension < 0.2;
```

**Fix:** Remove `< 0.2` everywhere. `harmonicFunction === 'tonic'` alone is sufficient.
Tension is already visible to the user as dot indicators (●●○○). It must not gate
content. A tonic context with high tension (e.g. an altered chord landing on degree III)
still has meaningful departure paths — hiding them is wrong.

---

### 1.2 Bug — F major missing as first resolution context for C7(♯9)(♭13)

**Symptom:** The dominant context shows ♯IV Gb Messiaen Mode 4 at or near the top.
F major — the correct authentic resolution of C7alt as V7 of F — is either absent or
buried.

**Cause diagnosis:**

C7(♯9)(♭13) pitch classes: {0, 3, 4, 7, 8, 10}. Exact-match pass: no single diatonic
scale contains all six pcs (the alterations D♯ and Ab are intentionally chromatic).
Fuzzy pass: fires when `chordQuality === 'dominant'` and `alterationCount >= 2`. Both
true (quality = dominant; alterations vs C major = Bb, D♯, Ab → 3). Core pcs tested:
{0, 4, 10} (root C, M3 E, m7 Bb). F major scale {5,7,9,10,0,2,4} contains all three.
C is at degree V (7 semitones from F). `FUNCTION_MAP[7] = 'dominant'`. F major qualifies
and is added to contexts with `matchQuality: 0.8`.

Sort order for a dominant-quality source chord:
- Tier 1: dominant-function contexts first → F major ✓, Gb Messiaen ✓
- Tier 2: `group: 'diatonic'` beats non-diatonic → F major (`'diatonic'`) beats Gb
  Messiaen (`'octatonic'`)
- Tier 3: match quality → only applies within same group; F major already won tier 2

F major **should be context #1**. If it is not visible, the most likely cause is that
the empty tonic contexts (bug 1.1) are taking up visible space with blank bodies,
pushing F major below the fold. Fix bug 1.1 first and re-verify.

**No sort logic change needed.** The sort is correct. Bug 1.1 is masking this.

---

### 1.3 Algorithm bug — Voice leading computation is wrong

**Symptom:** Voice moves shown in the panel are incorrect for altered dominant chords
and other complex voicings.

**Root causes:**

1. `computeVoiceLeadingRules()` hardcodes leading-tone and chordal-seventh detection
   as named rules (Rules 1 and 2). These fire by checking `pc === leadingTonePc` and
   `pc === chordalSeventhPc` — explicit note detection, the opposite of formula-driven.

2. The fallthrough proximity search (Rule 5) has a math error in its octave-offset loop
   that can produce the wrong candidate MIDI note.

3. `qualityToIntervals()` returns bare triads (`[0,4,7]`) as resolution targets. A
   6-voice source chord resolving to 3 pitch classes causes uncontrolled doubling and
   large leaps.

4. The quality-to-intervals map is a hardcoded table with no connection to `CHORD_TYPES`.
   These two sources of truth can silently diverge.

**Fix:** Full replacement of `computeVoiceLeadingRules()` and `qualityToIntervals()` with
a proximity-first algorithm that derives everything from `CHORD_TYPES` and arithmetic.
Details in section 3.

---

### 1.4 Design bug — `deriveResolutionTargets()` emits quality strings

**Current behaviour:** `deriveResolutionTargets()` emits `targetQuality: 'major'`,
`'minor'`, `'dominant'`, `'m7'` etc. These strings have no direct connection to
`CHORD_TYPES`. The VL engine then maps them back to interval arrays via a separate
hardcoded table (`qualityToIntervals()`). Two disconnected tables, neither authoritative.

**Fix:** `deriveResolutionTargets()` emits `targetSymbol` — the actual `CHORD_TYPES`
symbol string (e.g. `'Maj7'`, `'m7'`, `'7'`). The VL engine looks the symbol up
directly in a flattened view of `CHORD_TYPES` built once at startup. One source of
truth. The quality string is kept alongside as a display hint only.

This is a small change to `deriveResolutionTargets()` and the `analyseChord()` call
site, but it eliminates an entire class of potential bugs.

---

## 2. Bug Fixes — One-Line Changes

Apply these first, independently of the algorithm rewrite.

### 2.1 `voiceLeading.js` — Tonic gate in `deriveResolutionTargets()`

```js
// BEFORE (line 402)
if (harmonicFunction === 'tonic' && context.tension < 0.2) {

// AFTER
if (harmonicFunction === 'tonic') {
```

### 2.2 `breakdown.js` — Tonic gate in `makeVoiceLeadingRow()`

```js
// BEFORE (desktop path, line 976; mobile path, line 816 — both)
const isDeparture = ctx.harmonicFunction === 'tonic' && ctx.tension < 0.2;

// AFTER
const isDeparture = ctx.harmonicFunction === 'tonic';
```

Both occurrences must be updated — the desktop rendering path and the mobile rendering
path each have their own copy of this line.

---

## 3. Data Layer Change — Symbol-Based Resolution Targets

### 3.1 Build a flat CHORD_TYPES index at startup

Add this once, near the top of `voiceLeading.js`, after `CHORD_TYPES` is available:

```js
// Flat symbol → intervals lookup derived entirely from CHORD_TYPES.
// Built once at startup. No manual table. Every entry comes from the chord library.
// Intervals are normalised to one octave (mod 12, deduplicated, sorted ascending).
const CHORD_SYMBOL_INTERVALS = (() => {
  const map = {};
  for (const family of Object.values(CHORD_TYPES)) {
    for (const entry of family) {
      if (entry.symbol && entry.intervals) {
        map[entry.symbol] = [...new Set(entry.intervals.map(i => i % 12))].sort((a, b) => a - b);
      }
    }
  }
  return map;
})();
```

This is a pure data operation. If `CHORD_TYPES` gains new entries, `CHORD_SYMBOL_INTERVALS`
picks them up automatically with no code change.

### 3.2 Resolution target symbols — musical rationale

`deriveResolutionTargets()` currently uses quality strings. These are replaced with the
richer 7th-chord symbols from `CHORD_TYPES`. The choice of 7th chord over triad is
deliberate: a richer target means more pitch classes for the proximity algorithm to land
on, which reduces forced doubling for 5–6 voice source chords.

The mapping from functional role to symbol is:

| Functional role | Old `targetQuality` | New `targetSymbol` | Rationale |
|---|---|---|---|
| Major tonic | `'major'` | `'Maj7'` | 4 pcs vs 3; standard jazz resolution target |
| Minor tonic | `'minor'` | `'m7'` | 4 pcs vs 3; standard for minor key resolution |
| Dominant | `'dominant'` | `'7'` | Already 4 pcs; no change in richness |
| Predominant → dominant | `'dominant'` | `'7'` | Same |
| Deceptive (vi) | `'minor'` | `'m7'` | Richer target for deceptive cadence |
| Subdominant → dominant | `'dominant'` | `'7'` | Same |
| Tritone sub | `'dominant'` | `'7'` | Same |
| Related ii | `'m7'` | `'m7'` | No change; already a symbol |
| Departure → IV | `'major'` | `'Maj7'` | Richer target |
| Departure → V | `'dominant'` | `'7'` | Same |
| Departure → ii | `'minor'` | `'m7'` | Richer |
| Departure → vi | `'minor'` | `'m7'` | Richer |

### 3.3 Changes to `deriveResolutionTargets()`

Every `resolutions.push({...})`, `departures.push({...})`, and `substitutions.push({...})`
call gets `targetSymbol` added and `targetQuality` kept as a secondary display field:

```js
// BEFORE
resolutions.push({
  targetRootPc:   tonicRootPc,
  targetQuality:  'major',
  resolutionType: 'authentic',
  cadenceName:    'V → I',
  strength:       1.0,
});

// AFTER
resolutions.push({
  targetRootPc:   tonicRootPc,
  targetSymbol:   'Maj7',       // primary: used by VL engine for interval lookup
  targetQuality:  'major',      // secondary: kept for display and UI compatibility
  resolutionType: 'authentic',
  cadenceName:    'V → I',
  strength:       1.0,
});
```

All push calls in `deriveResolutionTargets()` are updated this way. The `targetQuality`
field is retained so rendering code in `breakdown.js` that uses it for chord name display
(`engineQualToSuffix()`, `engineQualToBuildKey()`) continues to work without change.

### 3.4 Changes to `analyseChord()` call site

The pre-computation loop passes `targetSymbol` instead of `targetQuality`:

```js
// BEFORE
res.voiceLeading = computeVoiceLeadingRules(
  sourceMidi, res.targetRootPc, res.targetQuality, ctx
);

// AFTER
res.voiceLeading = computeVoiceLeadingRules(
  sourceMidi, res.targetRootPc, res.targetSymbol, ctx
);
```

Same change for departure pre-computation. The function signature of
`computeVoiceLeadingRules()` is unchanged at the outer level — the third argument is
now a symbol string instead of a quality string, but the parameter name `targetQuality`
can be renamed `targetSymbol` for clarity.

---

## 4. Algorithm Redesign — Formula-Driven Voice Leading

### 4.1 Design philosophy

All classical voice leading rules — leading tone rises, chordal seventh falls, altered
tones resolve by step — are **consequences of one principle**: each voice moves to the
nearest available pitch class in the target chord. The engine derives correct behaviour
from interval arithmetic and the data in `CHORD_TYPES`. It does not detect note names,
tendency tones, or chord members by name.

Proof by example for C7(♯9)(♭13) → FMaj7:

- Source pcs: C=0, E=4, G=7, Bb=10, D♯=3, Ab=8
- Target pcs (FMaj7 from CHORD_TYPES `'Maj7'`): F=5, A=9, C=0, E=4
- E (leading tone, pc 4): common tone in FMaj7 → stays. But if E is "used", nearest
  remaining target from E=4 is F=5 (dist 1 up). The leading tone rises — not because a
  rule says so, but because F is 1 semitone away.
- Bb (chordal 7th, pc 10): nearest target pc is A=9 (dist 1 down). Falls by step.
  Not because a rule says "seventh falls" — because A is 1 semitone below.
- D♯ (♯9, pc 3): nearest target pc is E=4 (dist 1 up) or C=0 (dist 3 down). E wins.
  Resolves up by step.
- Ab (♭13, pc 8): nearest target pcs are A=9 (dist 1 up) and G (not in FMaj7).
  Next: F=5 (dist 3 down). A wins — resolves up by step.
- G (fifth, pc 7): nearest target pcs are A=9 (dist 2 up) or F=5 (dist 2 down). Tie
  → broken by chord tone priority derived from interval position in `CHORD_TYPES` entry.
- C (root, pc 0): common tone → stays on C.

Every move is correct. No rules were consulted. No note names were checked.

### 4.2 `resolveTargetIntervals()` — replaces `qualityToIntervals()`

```js
// Derives target interval array from CHORD_SYMBOL_INTERVALS (built from CHORD_TYPES).
// targetSymbol: a CHORD_TYPES symbol string, e.g. 'Maj7', 'm7', '7'.
// Returns: array of pitch-class intervals mod 12, sorted ascending, deduplicated.
// No fallback table. If the symbol is not in CHORD_TYPES, returns the triad [0,4,7]
// as a last-resort default — this should only happen for unknown symbols.
function resolveTargetIntervals(targetSymbol) {
  return CHORD_SYMBOL_INTERVALS[targetSymbol] || [0, 4, 7];
}
```

The only "hardcoded" value here is the `[0, 4, 7]` last-resort fallback. This is
acceptable because it only fires for unknown symbols, which indicates a programming
error upstream. It is not a musical decision — it is a null-safe default.

### 4.3 Stage 1 — Generate candidates

For each pitch class in the target chord, generate every MIDI pitch within a window
that covers the full range of source notes plus one octave either side. This ensures
the nearest instance of every target pc is always reachable from every source note.

```js
// targetRootPc:    pitch class 0–11
// targetIntervals: array from resolveTargetIntervals() — mod-12 intervals, sorted
// sourceMidi:      array of source MIDI note numbers
//
// Returns: array of { midi, pc, priority }
//   midi:     candidate MIDI note number
//   pc:       pitch class (midi % 12)
//   priority: index of this interval in targetIntervals (0 = root = highest priority)
function generateCandidates(targetRootPc, targetIntervals, sourceMidi) {
  const lo = Math.min(...sourceMidi) - 12;
  const hi = Math.max(...sourceMidi) + 12;

  const candidates = [];

  targetIntervals.forEach((interval, priority) => {
    const pc = (targetRootPc + interval) % 12;
    // Find the lowest MIDI note >= lo with this pitch class
    const remainder = ((pc - lo) % 12 + 12) % 12;
    const first = lo + remainder;
    for (let midi = first; midi <= hi; midi += 12) {
      candidates.push({ midi, pc, priority });
    }
  });

  return candidates;
}
```

**Priority** is the index position of the interval in the `CHORD_TYPES` entry. Since
`CHORD_SYMBOL_INTERVALS` normalises and sorts intervals ascending, index 0 is always
the root (interval 0), index 1 is the next chord tone (e.g. M3 = 4), and so on.
Lower index = structurally more important = preferred when two candidates are equidistant.
This is derived from the data structure, not from a table.

The `± 12` window (one octave beyond the source range) guarantees that for any source
note, the nearest instance of every target pc is included. Widening to `± 24` is safe
but unnecessary — the proximity algorithm already handles the octave-choice problem by
picking the closest MIDI note, not the closest pitch class.

### 4.4 Stage 2 — Proximity assignment

Process source notes from lowest to highest. For each, find the unused candidate MIDI
note with the smallest absolute distance. Mark it used so no two source voices share an
exact MIDI note (unison doubling). Pitch-class doubling across octaves is allowed.

Tie-breaking when two candidates are equidistant:
1. **Lower priority index wins** (root before third before fifth before extensions).
   This is derived from the position in `CHORD_TYPES`'s interval array — no table.
2. **Contrary motion to bass wins** (if bass is already assigned and moving up, prefer
   a candidate below the source note, and vice versa). This is derived by comparing
   `(candidate.midi - source.midi)` sign against `(bass.toMidi - bass.fromMidi)` sign.
   Pure arithmetic, no lookup.
3. If still tied, take the lower MIDI note (deterministic).

```js
// sourceMidi:  array of MIDI note numbers (any order)
// candidates:  array from generateCandidates()
//
// Returns: array of { fromMidi, toMidi } in the same order as sorted sourceMidi
function assignByProximity(sourceMidi, candidates) {
  const sorted    = [...sourceMidi].sort((a, b) => a - b);
  const usedMidi  = new Set();
  const result    = [];

  for (let voiceIdx = 0; voiceIdx < sorted.length; voiceIdx++) {
    const src = sorted[voiceIdx];

    // Bass direction: direction the lowest voice (index 0) is moving.
    // Used for contrary-motion tie-breaking on all upper voices.
    const bassDir = result.length > 0
      ? Math.sign(result[0].toMidi - result[0].fromMidi)
      : 0;

    let best         = null;
    let bestDist     = Infinity;
    let bestPriority = Infinity;
    let bestContrary = false;

    for (const cand of candidates) {
      if (usedMidi.has(cand.midi)) continue;

      const dist     = Math.abs(cand.midi - src);
      const candDir  = Math.sign(cand.midi - src);
      const contrary = bassDir !== 0 && voiceIdx > 0 && candDir !== bassDir;

      // Is this candidate better than current best?
      let better = false;
      if (dist < bestDist) {
        better = true;
      } else if (dist === bestDist) {
        if (cand.priority < bestPriority) {
          better = true;
        } else if (cand.priority === bestPriority) {
          // Prefer contrary motion to bass
          if (contrary && !bestContrary) better = true;
          // Last resort: lower MIDI note is deterministic
          else if (contrary === bestContrary && cand.midi < best.midi) better = true;
        }
      }

      if (better) {
        best         = cand;
        bestDist     = dist;
        bestPriority = cand.priority;
        bestContrary = contrary;
      }
    }

    if (best) {
      usedMidi.add(best.midi);
      result.push({ fromMidi: src, toMidi: best.midi });
    }
  }

  return result;
}
```

### 4.5 Stage 3 — Voice crossing repair

After assignment, check every adjacent pair of voices for crossing. A crossing occurs
when voice i ends up higher than voice i+1 after the move, even though it started lower.
If swapping the two target MIDI notes reduces or maintains total semitone motion, apply
the swap. Repeat until no beneficial swap exists (converges in 1–2 passes for typical
chord sizes).

```js
// assignments: array of { fromMidi, toMidi } sorted by fromMidi ascending
// Returns the same array with crossings resolved in-place.
function repairVoiceCrossing(assignments) {
  // Ensure input is sorted by source note
  assignments.sort((a, b) => a.fromMidi - b.fromMidi);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < assignments.length - 1; i++) {
      const a = assignments[i];
      const b = assignments[i + 1];
      if (a.toMidi > b.toMidi) {
        // Voice crossing detected — evaluate swap
        const costBefore = Math.abs(a.toMidi - a.fromMidi) + Math.abs(b.toMidi - b.fromMidi);
        const costAfter  = Math.abs(b.toMidi - a.fromMidi) + Math.abs(a.toMidi - b.fromMidi);
        if (costAfter <= costBefore) {
          [assignments[i].toMidi, assignments[i + 1].toMidi] =
            [assignments[i + 1].toMidi, assignments[i].toMidi];
          changed = true;
        }
      }
    }
  }
  return assignments;
}
```

### 4.6 Stage 4 — Build output moves

Convert assignments to the move object shape consumed by `buildVLTable()` in
`breakdown.js`. The `reason` field is simplified: `'common_tone'` when a voice does not
move, `'proximity'` for all other moves.

```js
// assignments: array of { fromMidi, toMidi }
// Returns: array of move objects for the UI
function buildMoves(assignments) {
  return assignments.map(({ fromMidi, toMidi }) => {
    const delta = toMidi - fromMidi;
    return {
      fromMidi,
      toMidi,
      fromPc:    ((fromMidi % 12) + 12) % 12,
      toPc:      ((toMidi   % 12) + 12) % 12,
      semitones: Math.abs(delta),
      direction: delta === 0 ? 'none' : delta > 0 ? 'up' : 'down',
      reason:    delta === 0 ? 'common_tone' : 'proximity',
    };
  });
}
```

### 4.7 Public API — new `computeVoiceLeadingRules()`

Replaces the existing function entirely. Signature is compatible with all call sites
after the `targetSymbol` change in section 3.4.

```js
// sourceMidi:    array of MIDI note numbers (the sounding chord)
// targetRootPc:  pitch class 0–11 of the resolution target root
// targetSymbol:  CHORD_TYPES symbol string (e.g. 'Maj7', 'm7', '7')
// context:       context object from findDiatonicContexts() — accepted for
//                signature compatibility, not used internally
//
// Returns: array of move objects { fromMidi, toMidi, fromPc, toPc,
//          semitones, direction, reason }
function computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, context) {
  const targetIntervals = resolveTargetIntervals(targetSymbol);
  const candidates      = generateCandidates(targetRootPc, targetIntervals, sourceMidi);
  const raw             = assignByProximity(sourceMidi, candidates);
  const repaired        = repairVoiceCrossing(raw);
  return buildMoves(repaired);
}
```

**Functions removed from `voiceLeading.js`:**
- `computeVoiceLeadingRules()` (replaced above)
- `resolveNote()` (absorbed into `assignByProximity()`)
- `makeMove()` (absorbed into `buildMoves()`)
- `nearestTargetNote()` (the buggy octave-offset loop; no longer needed)
- `qualityToIntervals()` (replaced by `resolveTargetIntervals()`)

**Functions added to `voiceLeading.js`:**
- `CHORD_SYMBOL_INTERVALS` (startup index — section 3.1)
- `resolveTargetIntervals()` (section 4.2)
- `generateCandidates()` (section 4.3)
- `assignByProximity()` (section 4.4)
- `repairVoiceCrossing()` (section 4.5)
- `buildMoves()` (section 4.6)

Net line count: approximately −130 lines, +110 lines. Simpler and more correct.

---

## 5. `analyseChord()` — Pre-computation Integration

No structural change. Only the argument passed to `computeVoiceLeadingRules()` changes
from `res.targetQuality` to `res.targetSymbol`, in both the resolutions loop and the
departures loop:

```js
// Resolutions
for (const res of ctx.resolutions) {
  res.voiceLeading = computeVoiceLeadingRules(
    sourceMidi, res.targetRootPc, res.targetSymbol, ctx  // targetSymbol replaces targetQuality
  );
}

// Departures
for (const dep of ctx.departures) {
  dep.voiceLeading = computeVoiceLeadingRules(
    sourceMidi, dep.targetRootPc, dep.targetSymbol, ctx  // same
  );
}
```

Everything else in `analyseChord()` is unchanged.

---

## 6. `breakdown.js` — Display Changes

### 6.1 Tonic gate (section 2.2)

Already covered. Two occurrences, both updated.

### 6.2 `buildVLTable()` — reason column

The `reason` field now carries only `'common_tone'` or `'proximity'`. The existing
reason column in `buildVLTable()` displays labels like `'leading_tone_up'` or
`'chordal_seventh_down'` — these no longer exist. Replace the reason column with a
compact direction + interval display:

- Common tone: render `—` or `→` (no movement)
- All other moves: render `↑ m2`, `↓ M3`, etc. (direction + interval abbreviation)

The interval abbreviation is already derivable from `move.semitones` via the existing
`INTERVAL_ABBR` lookup in `breakdown.js`. No new data needed.

### 6.3 `engineQualToBuildKey()` and `engineQualToSuffix()` — unchanged

These functions in `breakdown.js` use `targetQuality` for display (chord name label,
fallback MIDI building). Since `targetQuality` is kept alongside `targetSymbol` in every
resolution/departure object (section 3.3), these functions continue to work with zero
changes.

---

## 7. What Is Not Changed

The following are explicitly out of scope for this rewrite:

| Component | Status |
|---|---|
| `findDiatonicContexts()` | Unchanged |
| `scoreTension()` | Unchanged |
| `FUNCTION_MAP` | Unchanged |
| `BASE_TENSION` | Unchanged |
| Sort logic in `findDiatonicContexts()` | Unchanged |
| `deriveResolutionTargets()` | One-line gate fix + `targetSymbol` added to push calls |
| `analyseChord()` | One-argument change in two loops |
| All rendering code in `breakdown.js` | Unchanged except two gate lines + reason column |
| `CHORD_TYPES` | Read-only data source, not modified |
| `SCALES` | Read-only data source, not modified |

---

## 8. Build Order

Follow this order strictly. Each step is independently testable.

1. **Apply bug fix 2.1** — remove tension gate in `deriveResolutionTargets()`.
2. **Apply bug fix 2.2** — remove tension gate in `breakdown.js` (both paths).
3. **Test bug fixes** — verify Ab Harmonic Major and Eb Prometheus Liszt now show
   departure paths. Verify F major appears as top context for C7(♯9)(♭13).
4. **Build `CHORD_SYMBOL_INTERVALS`** — add the startup index to `voiceLeading.js`.
   Verify it contains entries for `'Maj7'`, `'m7'`, `'7'`, `'dim'`, `'m7b5'`, `'o7'`.
5. **Add `targetSymbol` to `deriveResolutionTargets()`** — add the field to every push
   call per the table in section 3.2. Do not remove `targetQuality`.
6. **Update `analyseChord()` call sites** — pass `res.targetSymbol` and `dep.targetSymbol`
   to `computeVoiceLeadingRules()`.
7. **Add `resolveTargetIntervals()`** — new function, verify it returns `[0,4,7,11]`
   for `'Maj7'`, `[0,3,7,10]` for `'m7'`, `[0,4,7,10]` for `'7'`.
8. **Add `generateCandidates()`** — new function.
9. **Add `assignByProximity()`** — new function.
10. **Add `repairVoiceCrossing()`** — new function.
11. **Add `buildMoves()`** — new function.
12. **Replace `computeVoiceLeadingRules()`** — swap the old implementation for the new
    one that calls the four new functions in sequence.
13. **Remove dead code** — delete `resolveNote()`, `makeMove()`,
    `nearestTargetNote()`, `qualityToIntervals()`.
14. **Update `buildVLTable()` reason column** — replace reason label with direction +
    interval abbreviation.
15. **Full regression test** — run all test cases in section 9.

---

## 9. Test Cases

Run these after step 15. All must pass without any hardcoded note detection.

### TC-1 — Clean dominant resolution
**Input:** C7 (pcs {0,4,7,10}), target FMaj7  
**Expected moves:** E→F (+1), G→A or G (+2/0), Bb→A (−1), C→C (0)  
**Verifies:** Leading tone rises, seventh falls — by proximity, not by rule.

### TC-2 — Altered dominant resolution
**Input:** C7(♯9)(♭13) (pcs {0,3,4,7,8,10}), target FMaj7  
**Expected moves:** All voices move by step (≤2 semitones) or stay. No leaps.  
**Verifies:** All six altered and core tones find their nearest target pc.

### TC-3 — Minor resolution
**Input:** C7 (pcs {0,4,7,10}), target Fm7 (symbol `'m7'`)  
**Expected moves:** E→F (+1), G→G (0, common tone in Fm7? No — Fm7={5,8,0,3}.
Nearest to G=7 is Ab=8 (+1) or F=5 (−2). Ab wins.  
**Verifies:** Minor target pcs are correctly derived from CHORD_TYPES.

### TC-4 — Tonic departure (no resolution)
**Input:** FMaj7 (pcs {5,9,0,4}), tonic context in F major  
**Expected:** `resolutions` array empty. `departures` contains I→IV, I→V, I→ii, I→vi.  
**Verifies:** Bug fix 2.1 — tonic branch fires even for complex chords.

### TC-5 — Subdominant motion
**Input:** Fm7 as IV in C major, target C7  
**Expected:** IV→V motion; all voices move stepwise to C7 pcs.  
**Verifies:** Subdominant branch produces correct dominant target.

### TC-6 — Voice crossing prevention
**Input:** Any chord where naive proximity would cross voices.  
**Expected:** After `repairVoiceCrossing()`, no voice ends up above the next-higher
voice.  
**Verifies:** Stage 3 repair logic.

### TC-7 — No unison doubling
**Input:** Any 4-voice chord resolving to a 3-pc target.  
**Expected:** All four output MIDI notes are distinct. Pitch-class doubling is fine;
exact MIDI unison is not.  
**Verifies:** `usedMidi` tracking in `assignByProximity()`.

### TC-8 — CHORD_SYMBOL_INTERVALS completeness
**Input:** All symbols present in the `targetSymbol` values emitted by
`deriveResolutionTargets()` (at minimum: `'Maj7'`, `'m7'`, `'7'`).  
**Expected:** All resolve to non-empty interval arrays in `CHORD_SYMBOL_INTERVALS`.  
**Verifies:** The startup index is built correctly from `CHORD_TYPES`.

---

## 10. Files Changed — Summary

| File | Changes |
|---|---|
| `js/engine/voiceLeading.js` | Add `CHORD_SYMBOL_INTERVALS` startup index; add `targetSymbol` field to all `deriveResolutionTargets()` push calls; update two `analyseChord()` call sites; replace `computeVoiceLeadingRules()`, `resolveNote()`, `makeMove()`, `nearestTargetNote()`, `qualityToIntervals()` with `resolveTargetIntervals()`, `generateCandidates()`, `assignByProximity()`, `repairVoiceCrossing()`, `buildMoves()` |
| `js/breakdown/breakdown.js` | Two one-line gate fixes; `buildVLTable()` reason column → direction + interval display |

**No other files are changed.**

`CHORD_TYPES`, `SCALES`, and all rendering code outside `buildVLTable()` and the two
gate lines are read-only dependencies of this work.
