# Voice Leading Algorithm — Plan v4

> **Scope:** This document fully replaces the v3 plan. It covers the same three bugs
> and the same two files (`js/engine/voiceLeading.js` and `js/breakdown/breakdown.js`),
> but replaces the greedy proximity assignment in section 4 with a globally optimal,
> cost-function-driven assignment grounded in Berklee harmony theory and classical
> voice-leading pedagogy.
>
> **Core principle:** No hardcoded note names, no hardcoded tendency-tone rules, no
> named-note detection. Every decision derives from `CHORD_TYPES`, `SCALES`, and
> interval arithmetic. The algorithm encodes *principles* (minimum motion, cost
> hierarchy, voice independence), not *rules* (leading tone rises, seventh falls).
> Correct behaviour emerges from the cost function — it is not instructed.

---

## 0. Theoretical Foundation

Three authoritative sources were studied before writing this plan:

- **Berklee (Russell/Kirby, Harmony 2):** Voice leading is smooth transition between
  chords using minimum movement. Rules: keep common tones, move remaining voices by step
  if possible, move no single voice more than a 3rd. Guide tones (3rd and 7th) are the
  primary voice-leading skeleton. The 3→7 / 7→3 swap in ii–V–I is a *must*, not a
  preference. The bass moves independently and more freely than inner voices.

- **Puget Sound (Hutchinson, Music Theory for the 21st-Century Classroom):** Four types
  of motion — contrary, oblique, similar, parallel. Contrary motion between outer voices
  is preferred in the classical tradition because it preserves voice independence.
  Parallel 5ths and octaves are prohibited.

- **MyMusicTheory (ABRSM Grade 6–8):** Soprano and melody move mostly by step with
  occasional leaps. Bass moves by 4ths, 5ths, and octaves freely. Inner voices (alto,
  tenor) move the least — repeated notes and stepwise motion dominate.

**The insight these sources share:** All named voice-leading rules are consequences of
one principle — *minimum total motion, weighted by voice role*. An algorithm that
minimises a properly-weighted cost function globally, across all voices simultaneously,
will produce correct behaviour without detecting any specific note or chord tone by name.

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
bonus (+0.08) and three alteration bonuses (+0.12). On a tonic-function degree with
`BASE_TENSION` of 0.15 or 0.2, the total crosses 0.2 and the gate never fires. All
three arrays stay empty. The context header renders but the body is blank.

The same gate is mirrored in `breakdown.js`:

```js
const isDeparture = ctx.harmonicFunction === 'tonic' && ctx.tension < 0.2;
```

**Fix:** Remove `< 0.2` everywhere. `harmonicFunction === 'tonic'` alone is sufficient.
Tension is already visible to the user as dot indicators (●●○○). It must not gate
content.

---

### 1.2 Bug — F major missing as first resolution context for C7(♯9)(♭13)

**Symptom:** Gb Messiaen Mode 4 appears at or near the top. F major — the correct
authentic resolution of C7alt as V7 of F — is absent or buried.

**Cause:** Empty tonic contexts (bug 1.1) are consuming visible space with blank bodies,
pushing F major below the fold. The sort logic is already correct.

**Fix:** Fix bug 1.1 first. No sort logic change needed.

---

### 1.3 Algorithm bug — Voice leading computation is wrong

**Symptom:** Voice moves are incorrect for altered dominant chords and complex voicings.

**Root causes:**

1. `computeVoiceLeadingRules()` hardcodes leading-tone and chordal-seventh detection
   by checking `pc === leadingTonePc` and `pc === chordalSeventhPc` — named-note
   detection, the opposite of formula-driven.

2. The fallthrough proximity search has a math error in its octave-offset loop that
   produces wrong candidate MIDI notes.

3. `qualityToIntervals()` returns bare triads (`[0,4,7]`) as targets. A 6-voice source
   chord resolving to 3 pitch classes causes forced doubling and large leaps.

4. Greedy left-to-right assignment is order-dependent. Early voices consume "good"
   landing spots and later voices get forced into avoidable leaps — not because the
   voice leading is inherently bad, but because of processing order.

5. `qualityToIntervals()` is a hardcoded table with no connection to `CHORD_TYPES`.
   Two sources of truth that can silently diverge.

**Fix:** Full replacement with a globally optimal, cost-function-driven assignment.
Details in section 4.

---

### 1.4 Design bug — `deriveResolutionTargets()` emits quality strings

**Current behaviour:** Emits `targetQuality: 'major'`, `'minor'`, `'dominant'` etc.
These have no direct connection to `CHORD_TYPES`. The VL engine maps them back via a
separate hardcoded table — two disconnected sources of truth.

**Fix:** Emit `targetSymbol` — the actual `CHORD_TYPES` symbol string (e.g. `'Maj7'`,
`'m7'`, `'7'`). Keep `targetQuality` alongside as a display-only field. One source of
truth. Details in section 3.

---

## 2. Bug Fixes — One-Line Changes

Apply these first, before any algorithm work.

### 2.1 `voiceLeading.js` — Tonic gate in `deriveResolutionTargets()`

```js
// BEFORE (line ~402)
if (harmonicFunction === 'tonic' && context.tension < 0.2) {

// AFTER
if (harmonicFunction === 'tonic') {
```

### 2.2 `breakdown.js` — Tonic gate in `makeVoiceLeadingRow()`

```js
// BEFORE (desktop path line ~976; mobile path line ~816 — both occurrences)
const isDeparture = ctx.harmonicFunction === 'tonic' && ctx.tension < 0.2;

// AFTER
const isDeparture = ctx.harmonicFunction === 'tonic';
```

Both occurrences must be updated.

---

## 3. Data Layer — Symbol-Based Resolution Targets

### 3.1 `CHORD_SYMBOL_INTERVALS` startup index

Add once near the top of `voiceLeading.js`, after `CHORD_TYPES` is available:

```js
// Flat symbol → intervals lookup built entirely from CHORD_TYPES.
// Built once at startup. No manual table. Auto-updates when CHORD_TYPES gains entries.
// Intervals are normalised mod 12, deduplicated, sorted ascending.
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

### 3.2 Resolution target symbols

Replace quality strings with `CHORD_TYPES` symbols in every `push` call inside
`deriveResolutionTargets()`. Keep `targetQuality` as a secondary field for display
compatibility.

| Functional role        | Old `targetQuality` | New `targetSymbol` | Rationale |
|------------------------|---------------------|--------------------|-----------|
| Major tonic            | `'major'`           | `'Maj7'`           | 4 pcs vs 3; richer target reduces forced doubling |
| Minor tonic            | `'minor'`           | `'m7'`             | 4 pcs vs 3 |
| Dominant               | `'dominant'`        | `'7'`              | Already 4 pcs |
| Predominant → dominant | `'dominant'`        | `'7'`              | Same |
| Deceptive (vi)         | `'minor'`           | `'m7'`             | Richer target |
| Subdominant → dominant | `'dominant'`        | `'7'`              | Same |
| Tritone sub            | `'dominant'`        | `'7'`              | Same |
| Related ii             | `'m7'`              | `'m7'`             | Already a symbol |
| Departure → IV         | `'major'`           | `'Maj7'`           | Richer |
| Departure → V          | `'dominant'`        | `'7'`              | Same |
| Departure → ii         | `'minor'`           | `'m7'`             | Richer |
| Departure → vi         | `'minor'`           | `'m7'`             | Richer |

### 3.3 Push call pattern

Every `resolutions.push()`, `departures.push()`, and `substitutions.push()` call adds
`targetSymbol` and retains `targetQuality`:

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
  targetSymbol:   'Maj7',       // primary: VL engine uses this for interval lookup
  targetQuality:  'major',      // secondary: display and UI compatibility only
  resolutionType: 'authentic',
  cadenceName:    'V → I',
  strength:       1.0,
});
```

### 3.4 `analyseChord()` call sites

Pass `targetSymbol` instead of `targetQuality` to `computeVoiceLeadingRules()`:

```js
// Resolutions
for (const res of ctx.resolutions) {
  res.voiceLeading = computeVoiceLeadingRules(
    sourceMidi, res.targetRootPc, res.targetSymbol, ctx
  );
}

// Departures
for (const dep of ctx.departures) {
  dep.voiceLeading = computeVoiceLeadingRules(
    sourceMidi, dep.targetRootPc, dep.targetSymbol, ctx
  );
}
```

Everything else in `analyseChord()` is unchanged.

---

## 4. Algorithm — Globally Optimal Cost-Function Assignment

### 4.1 Design philosophy

Voice leading is minimum motion. The Berklee, Puget Sound, and MyMusicTheory sources
all converge on the same hierarchy:

1. **Common tones stay** — cost 0. This is always the best move.
2. **Step (m2 or M2)** — cost 1 or 2. Cheap and always preferred over leaps.
3. **Minor third (m3)** — cost 3. Allowed for inner voices.
4. **Major third (M3)** — cost 4. Borderline; acceptable only when nothing cheaper exists.
5. **Anything larger** — cost = semitones + large penalty. Strongly discouraged,
   especially in inner voices. The bass is exempt from this penalty (see 4.2).

The cost function *is* the theory. Named rules (leading tone rises, seventh falls,
3→7 swap) are consequences of it, not inputs to it. When E (leading tone of G7) is 1
semitone from F (root of FMaj7), it moves up — not because a rule says "leading tone
rises" but because cost 1 is cheaper than any alternative. When Bb (chordal 7th) is 1
semitone from A (major 7th of FMaj7), it falls — same reason.

The old plan used a greedy left-to-right proximity pass. This plan replaces it with a
**global minimum-cost assignment** that considers all voices simultaneously. For N ≤ 7
voices this is computed by exhaustive permutation search (7! = 5040 operations —
trivially fast). The result is the globally optimal assignment, not a locally optimal
greedy one.

### 4.2 Voice role detection — bass vs. inner voices

The Berklee source and MyMusicTheory both distinguish the bass from inner voices: the
bass moves more freely (4ths, 5ths, octaves are normal), while inner voices should
barely move. The algorithm implements this with a **bass leap exemption**: the lowest
source voice has its leap penalty halved, allowing the algorithm to naturally prefer
bass motion by 4th or 5th without penalising it unfairly.

This is derived purely from voice index (lowest = 0 after sorting by MIDI pitch). No
note names. No hardcoded bass pitch range.

### 4.3 `resolveTargetIntervals()` — replaces `qualityToIntervals()`

```js
// Derives target interval array directly from CHORD_SYMBOL_INTERVALS.
// targetSymbol: a CHORD_TYPES symbol string, e.g. 'Maj7', 'm7', '7'.
// Returns: array of pitch-class intervals mod 12, sorted ascending, deduplicated.
// Fallback [0,4,7] fires only for unknown symbols (programming error upstream).
function resolveTargetIntervals(targetSymbol) {
  return CHORD_SYMBOL_INTERVALS[targetSymbol] || [0, 4, 7];
}
```

### 4.4 Stage 1 — Generate candidates

For each target pitch class, enumerate every reachable MIDI note within ±12 semitones
of the source range. This guarantees the nearest instance of every target PC is always
available to every source voice.

```js
// targetRootPc:    pitch class 0–11
// targetIntervals: array from resolveTargetIntervals()
// sourceMidi:      array of source MIDI note numbers
//
// Returns: array of { midi, pc, intervalIndex }
//   midi:          candidate MIDI note number
//   pc:            pitch class (midi % 12)
//   intervalIndex: position in targetIntervals (0 = root, 1 = next tone, …)
//                  Used only for display; not used in cost computation.
function generateCandidates(targetRootPc, targetIntervals, sourceMidi) {
  const lo = Math.min(...sourceMidi) - 12;
  const hi = Math.max(...sourceMidi) + 12;
  const candidates = [];

  targetIntervals.forEach((interval, intervalIndex) => {
    const pc = (targetRootPc + interval) % 12;
    const remainder = ((pc - lo) % 12 + 12) % 12;
    const first = lo + remainder;
    for (let midi = first; midi <= hi; midi += 12) {
      candidates.push({ midi, pc, intervalIndex });
    }
  });

  return candidates;
}
```

### 4.5 Stage 2 — Cost matrix

Compute the cost of moving each source voice to each candidate. Cost is derived entirely
from the semitone distance and the voice role (bass vs. inner).

```js
// LEAP_PENALTY: added to the raw semitone count for any move larger than a M3.
// This strongly discourages leaps in inner voices while keeping them reachable
// as a last resort. Value 8 means a leap of a P5 (7 semitones) costs 15 —
// more than five stepwise moves. Derived from the "no more than a 3rd" guideline.
const LEAP_PENALTY = 8;

// moveCost(delta, isBass):
//   delta:  absolute semitone distance (0 = common tone, 1 = m2, …)
//   isBass: true for the lowest source voice
//
// Returns a non-negative cost integer.
function moveCost(delta, isBass) {
  if (delta === 0) return 0;                        // common tone — free
  if (delta <= 4)  return delta;                    // step or third — cost = distance
  // Leap: add penalty. Bass penalty is halved to reflect its freer movement.
  return delta + (isBass ? LEAP_PENALTY / 2 : LEAP_PENALTY);
}
```

No note names. No chord-tone identity checks. Pure arithmetic.

### 4.6 Stage 3 — Global minimum-cost assignment

Assign each source voice to a candidate such that:
- No two voices share the same MIDI note (no exact unison doubling).
- The total cost across all voices is minimised globally.

For N ≤ 7 voices, exhaustive permutation search over candidates is fast enough
(milliseconds). The algorithm tries every valid assignment and keeps the one with
the lowest total cost.

```js
// sourceMidi:  array of MIDI note numbers, sorted ascending (bass first)
// candidates:  array from generateCandidates()
//
// Returns: array of { fromMidi, toMidi } in the same order as sourceMidi
function assignByMinCost(sourceMidi, candidates) {
  const sorted = [...sourceMidi].sort((a, b) => a - b);
  const n = sorted.length;

  let bestAssignment = null;
  let bestTotalCost  = Infinity;

  // Recursive backtracking search over candidate assignments.
  // usedMidi: Set of already-assigned MIDI notes (prevents unison doubling).
  // assignment: growing array of { fromMidi, toMidi } for voices processed so far.
  // currentCost: running total cost so far (used for branch pruning).
  function search(voiceIdx, assignment, usedMidi, currentCost) {
    // Prune: if current cost already exceeds best, abandon this branch.
    if (currentCost >= bestTotalCost) return;

    if (voiceIdx === n) {
      // All voices assigned — record if best so far.
      bestTotalCost  = currentCost;
      bestAssignment = assignment.slice();
      return;
    }

    const src    = sorted[voiceIdx];
    const isBass = voiceIdx === 0;

    // Sort candidates by cost for this voice, cheapest first.
    // This is an optimisation: trying cheap candidates first makes pruning more effective.
    const sortedCands = candidates
      .filter(c => !usedMidi.has(c.midi))
      .sort((a, b) => moveCost(Math.abs(a.midi - src), isBass)
                    - moveCost(Math.abs(b.midi - src), isBass));

    for (const cand of sortedCands) {
      const cost = moveCost(Math.abs(cand.midi - src), isBass);
      usedMidi.add(cand.midi);
      assignment.push({ fromMidi: src, toMidi: cand.midi });
      search(voiceIdx + 1, assignment, usedMidi, currentCost + cost);
      assignment.pop();
      usedMidi.delete(cand.midi);
    }
  }

  search(0, [], new Set(), 0);

  // Fallback: if no assignment found (shouldn't happen with a ±12 window), return
  // each voice staying on its current pitch. Indicates a candidate generation error.
  if (!bestAssignment) {
    return sorted.map(midi => ({ fromMidi: midi, toMidi: midi }));
  }

  return bestAssignment;
}
```

**Why backtracking rather than Hungarian algorithm:**
The Hungarian algorithm is O(N³) and optimal, but requires a square cost matrix
(equal number of voices and candidates). With 4–6 voices and ~30–50 candidates,
the backtracking search with branch-pruning is faster in practice, requires no
external library, and handles the non-square case naturally.

**Why not greedy (old plan):**
Greedy assignment is order-dependent. A voice processed early may consume a low-cost
candidate that would have been better for a later voice, forcing that later voice into
an unnecessary leap. The global search considers all voices simultaneously and finds the
assignment that minimises *total* cost, not local cost per voice.

### 4.7 Stage 4 — Voice crossing repair

After assignment, check every adjacent pair of voices for crossing. A crossing occurs
when voice i ends up higher than voice i+1 after moving, even though it started lower.
Swap their target notes if the swap reduces (or does not increase) total cost. Repeat
until stable.

```js
// assignments: array of { fromMidi, toMidi } sorted by fromMidi ascending
// Returns the same array with crossings resolved in-place.
function repairVoiceCrossing(assignments) {
  assignments.sort((a, b) => a.fromMidi - b.fromMidi);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < assignments.length - 1; i++) {
      const a = assignments[i];
      const b = assignments[i + 1];
      if (a.toMidi > b.toMidi) {
        // Crossing: evaluate swap by strict cost reduction only (< not <=).
        // Using < prevents equal-cost swap cycles that could loop indefinitely.
        const isBassA = i === 0;
        const isBassB = i + 1 === 0; // false; kept for symmetry
        const costBefore = moveCost(Math.abs(a.toMidi - a.fromMidi), isBassA)
                         + moveCost(Math.abs(b.toMidi - b.fromMidi), isBassB);
        const costAfter  = moveCost(Math.abs(b.toMidi - a.fromMidi), isBassA)
                         + moveCost(Math.abs(a.toMidi - b.fromMidi), isBassB);
        if (costAfter < costBefore) {
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

**Note on convergence:** The old plan used `<=` in the swap condition, which can
cycle between two equal-cost configurations indefinitely. This plan uses strict `<`,
which guarantees termination: each accepted swap strictly reduces total cost, so the
loop converges in at most O(N²) passes.

### 4.8 Stage 5 — Build output moves

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
      reason:    delta === 0 ? 'common_tone' : 'stepwise',
    };
  });
}
```

**On `reason`:** The old plan emitted `'proximity'` for all non-common-tone moves.
This plan emits `'stepwise'` — a more accurate description of what the cost function
optimises for. The value displayed in `buildVLTable()` is derived from `move.direction`
and `move.semitones` via `intervalAbbr()`, so the `reason` field is internal only.

### 4.9 Public API — new `computeVoiceLeadingRules()`

```js
// sourceMidi:    array of MIDI note numbers (the sounding chord)
// targetRootPc:  pitch class 0–11 of the resolution target root
// targetSymbol:  CHORD_TYPES symbol string (e.g. 'Maj7', 'm7', '7')
// context:       context object — accepted for signature compatibility, not used
//
// Returns: array of move objects { fromMidi, toMidi, fromPc, toPc,
//          semitones, direction, reason }
function computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, context) {
  const targetIntervals = resolveTargetIntervals(targetSymbol);
  const candidates      = generateCandidates(targetRootPc, targetIntervals, sourceMidi);
  const raw             = assignByMinCost(sourceMidi, candidates);
  const repaired        = repairVoiceCrossing(raw);
  return buildMoves(repaired);
}
```

---

## 5. Functions Changed

### Removed from `voiceLeading.js`

| Function | Reason |
|---|---|
| `computeVoiceLeadingRules()` | Replaced with new version above |
| `resolveNote()` | Absorbed into `assignByMinCost()` |
| `makeMove()` | Absorbed into `buildMoves()` |
| `nearestTargetNote()` | Buggy octave-offset loop — no longer needed |
| `qualityToIntervals()` | Replaced by `resolveTargetIntervals()` |
| `assignByProximity()` | Never existed in current code; from v3 plan only |

### Added to `voiceLeading.js`

| Function | Purpose |
|---|---|
| `CHORD_SYMBOL_INTERVALS` | Startup index built from `CHORD_TYPES` |
| `resolveTargetIntervals()` | Looks up target intervals from `CHORD_SYMBOL_INTERVALS` |
| `generateCandidates()` | Enumerates all reachable MIDI notes for target PCs |
| `moveCost()` | Cost function — converts semitone distance + voice role to cost |
| `assignByMinCost()` | Global minimum-cost assignment via backtracking search |
| `repairVoiceCrossing()` | Post-processing crossing repair |
| `buildMoves()` | Converts assignments to UI move objects |

---

## 6. `breakdown.js` — Display Changes

### 6.1 Tonic gate (section 2.2)

Two occurrences, both updated as specified.

### 6.2 `buildVLTable()` — move column

The `reason` field now carries `'common_tone'` or `'stepwise'`. Replace the existing
reason label column with a compact direction + interval abbreviation:

- Common tone (`semitones === 0`): render `—`
- All other moves: render `↑ m2`, `↓ M3`, `↑ P4`, etc.

The interval abbreviation is already derivable from `move.semitones` via the existing
`intervalAbbr()` function in `breakdown.js`. No new data needed.

### 6.3 `engineQualToBuildKey()` and `engineQualToSuffix()` — unchanged

These functions use `targetQuality` for display. Since `targetQuality` is retained
alongside `targetSymbol` in every resolution/departure object, they continue to work
with zero changes.

---

## 7. What Is Not Changed

| Component | Status |
|---|---|
| `findDiatonicContexts()` | Unchanged |
| `scoreTension()` | Unchanged |
| `FUNCTION_MAP` | Unchanged |
| `BASE_TENSION` | Unchanged |
| Sort logic in `findDiatonicContexts()` | Unchanged |
| `deriveResolutionTargets()` | One-line gate fix + `targetSymbol` added to push calls |
| `analyseChord()` | One-argument change in two loops |
| All rendering code in `breakdown.js` | Unchanged except two gate lines + move column |
| `CHORD_TYPES` | Read-only data source, not modified |
| `SCALES` | Read-only data source, not modified |

---

## 8. Build Order

Follow this order strictly. Each step is independently testable before proceeding.

1. **Apply bug fix 2.1** — remove tension gate in `deriveResolutionTargets()`.
2. **Apply bug fix 2.2** — remove tension gate in `breakdown.js` (both paths).
3. **Test bug fixes** — verify Ab Harmonic Major and Eb Prometheus Liszt now show
   departure paths. Verify F major appears as top context for C7(♯9)(♭13).
4. **Build `CHORD_SYMBOL_INTERVALS`** — add startup index to `voiceLeading.js`.
   Verify it contains entries for `'Maj7'`, `'m7'`, `'7'`, `'dim'`, `'m7b5'`, `'o7'`.
5. **Add `targetSymbol` to `deriveResolutionTargets()`** — add field to every push
   call per the table in section 3.2. Do not remove `targetQuality`.
6. **Update `analyseChord()` call sites** — pass `res.targetSymbol` and
   `dep.targetSymbol` to `computeVoiceLeadingRules()`.
7. **Add `resolveTargetIntervals()`** — verify it returns `[0,4,7,11]` for `'Maj7'`,
   `[0,3,7,10]` for `'m7'`, `[0,4,7,10]` for `'7'`.
8. **Add `generateCandidates()`** — verify candidate count for a 4-note target in a
   typical 4-voice voicing is approximately 30–50 entries.
9. **Add `moveCost()`** — verify: `moveCost(0,false)=0`, `moveCost(1,false)=1`,
   `moveCost(7,false)=15`, `moveCost(7,true)=11`.
10. **Add `assignByMinCost()`** — new function.
11. **Add `repairVoiceCrossing()`** — new function.
12. **Add `buildMoves()`** — new function.
13. **Replace `computeVoiceLeadingRules()`** — swap the old implementation for the
    new orchestrating function (section 4.9).
14. **Remove dead code** — delete `resolveNote()`, `makeMove()`,
    `nearestTargetNote()`, `qualityToIntervals()`.
15. **Update `buildVLTable()` move column** — replace reason label with direction +
    interval abbreviation display.
16. **Full regression test** — run all test cases in section 9.

---

## 9. Test Cases

All must pass with no hardcoded note detection.

### TC-1 — Clean dominant resolution, guide-tone swap
**Input:** C7 (pcs {0,4,7,10}), target FMaj7 (`'Maj7'`)
**Expected:** E→F (↑m2, cost 1), Bb→A (↓m2, cost 1), G→A or G→F (step or common),
C→C (common tone, cost 0). Total cost ≤ 5.
**Verifies:** Leading tone rises and seventh falls — by cost minimisation, not by rule.

### TC-2 — Altered dominant, all voices stepwise or stationary
**Input:** C7(♯9)(♭13) (pcs {0,3,4,7,8,10}), target FMaj7
**Expected:** All six voices move by ≤ 4 semitones. No voice leaps by more than M3.
**Verifies:** Global assignment outperforms greedy when multiple voices compete for the
same low-cost candidate.

### TC-3 — Minor tonic resolution
**Input:** C7 (pcs {0,4,7,10}), target Fm7 (symbol `'m7'`, pcs {5,8,0,3})
**Expected:** E→F (↑m2), Bb→Ab (↓M2 or ↑m2 to nearest Ab), G→Ab (↑m2), C→C (common).
**Verifies:** Minor target PCs derived correctly from `CHORD_TYPES`, not from quality string.

### TC-4 — Tonic departure (bug fix 2.1 verification)
**Input:** FMaj7 (pcs {5,9,0,4}), tonic context in F major
**Expected:** `resolutions` empty. `departures` contains I→IV, I→V, I→ii, I→vi.
**Verifies:** Bug 1.1 fix — tonic branch fires regardless of tension score.

### TC-5 — Subdominant motion
**Input:** Fm7 as IV in C major, target C7 (symbol `'7'`)
**Expected:** IV→V motion; all voices move to C7 pcs by step.
**Verifies:** Subdominant branch produces correct dominant target symbol.

### TC-6 — Bass moves freely, inner voices barely move
**Input:** GMaj7 (pcs {7,11,2,6}), target CMaj7 (symbol `'Maj7'`)
**Expected:** Bass (G) moves by P4 or P5 (cost ≈ 7+4=11, acceptable for bass).
Inner voices move by step or stay. Total cost for inner voices ≤ 6.
**Verifies:** Bass leap exemption (halved penalty) allows natural bass motion.

### TC-7 — No unison doubling
**Input:** Any 4-voice chord resolving to a 3-PC target.
**Expected:** All four output MIDI notes are distinct integers.
**Verifies:** `usedMidi` set in `assignByMinCost()`.

### TC-8 — Voice crossing prevention
**Input:** A voicing where naive cost minimisation would cross voices.
**Expected:** After `repairVoiceCrossing()`, `assignments[i].toMidi ≤ assignments[i+1].toMidi`
for all i.
**Verifies:** Repair loop terminates and eliminates all crossings.

### TC-9 — Convergence guarantee
**Input:** Any chord. Run `repairVoiceCrossing()` 100 times on the same input.
**Expected:** Output is identical on every run. No infinite loop.
**Verifies:** Strict `<` condition in swap guard prevents cycling.

### TC-10 — `CHORD_SYMBOL_INTERVALS` completeness
**Input:** All `targetSymbol` values emitted by `deriveResolutionTargets()`.
**Expected:** Every symbol resolves to a non-empty interval array in
`CHORD_SYMBOL_INTERVALS`. At minimum: `'Maj7'→[0,4,7,11]`, `'m7'→[0,3,7,10]`,
`'7'→[0,4,7,10]`.
**Verifies:** Startup index is built correctly and covers all resolution targets.

### TC-11 — Global vs. greedy comparison (regression)
**Input:** C7(♯9)(♭13) resolving to FMaj7. Compare total semitone cost of
`assignByMinCost()` output vs. a greedy left-to-right proximity pass.
**Expected:** `assignByMinCost()` total cost ≤ greedy total cost.
**Verifies:** Global assignment is at least as good as greedy in all cases.

---

## 10. Files Changed — Summary

| File | Changes |
|---|---|
| `js/engine/voiceLeading.js` | Add `CHORD_SYMBOL_INTERVALS`; add `targetSymbol` to all `deriveResolutionTargets()` push calls; update two `analyseChord()` call sites; add `resolveTargetIntervals()`, `generateCandidates()`, `moveCost()`, `assignByMinCost()`, `repairVoiceCrossing()`, `buildMoves()`; replace `computeVoiceLeadingRules()`; delete `resolveNote()`, `makeMove()`, `nearestTargetNote()`, `qualityToIntervals()` |
| `js/breakdown/breakdown.js` | Two one-line gate fixes; `buildVLTable()` move column → direction + interval abbreviation |

**No other files are changed.**

`CHORD_TYPES`, `SCALES`, and all rendering code outside `buildVLTable()` and the two
gate lines are read-only dependencies of this work.
