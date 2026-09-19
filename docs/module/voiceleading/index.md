---
title: voiceLeading
kind: module
longname: module:voiceLeading
description: "Voice leading and harmonic resolution engine for The Sound Travels Ear Training. Implements a five-stage analysis pipeline that, given any chord, discovers every diatonic context it fits, scores harmonic tension, derives resolution targets, and computes globally optimal voice leading to each target via backtracking search. Pipeline stages: Constants &amp; startup index — FUNCTION_MAP , BASE_TENSION , CHORD_SYMBOL_INTERVALS Pure helpers — pitch-class arithmetic, quality detection, alteration counting Context discovery — findDiatonicContexts() (exact + fuzzy passes) Tension scoring — scoreTension() Resolution derivation — deriveResolutionTargets() Voice leading computation — computeVoiceLeadingRules() and its sub-functions Public API — analyseChord() All functions are pure and stateless — same input always returns the same output. No DOM access. No app state mutations. Load order: after helpers.js , chords.js , scales.js , and breakdown.js ."
---

# voiceLeading

<SourceLink href="/source/engine/voiceleading-js/#L29" label="voiceLeading.js:29" />

Voice leading and harmonic resolution engine for The Sound Travels Ear Training. Implements a five-stage analysis pipeline that, given any chord, discovers every diatonic context it fits, scores harmonic tension, derives resolution targets, and computes globally optimal voice leading to each target via backtracking search.

Pipeline stages:

1. Constants & startup index — `FUNCTION_MAP`, `BASE_TENSION`, `CHORD_SYMBOL_INTERVALS`
1. Pure helpers — pitch-class arithmetic, quality detection, alteration counting
1. Context discovery — `findDiatonicContexts()` (exact + fuzzy passes)
1. Tension scoring — `scoreTension()`
1. Resolution derivation — `deriveResolutionTargets()`
1. Voice leading computation — `computeVoiceLeadingRules()` and its sub-functions
1. Public API — `analyseChord()`

All functions are pure and stateless — same input always returns the same output. No DOM access. No app state mutations.

Load order: after `helpers.js`, `chords.js`, `scales.js`, and `breakdown.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading
  id="buildscalepcs"
  depth="3"
  name="buildScalePcs"
  sig="buildScalePcs(
	rootPc: number,
	intervals: Array.<number>,
): Set.<number>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L136" sourceLabel="voiceLeading.js:136" />

Builds a Set of pitch classes for a scale given its root and interval array.

**Parameters**

- `rootPc` (number) — Scale root as a pitch class (0–11).
- `intervals` (Array.\<number>) — Raw interval array from a `SCALES` entry (e.g. `[0,2,4,5,7,9,11,12]`).

**Returns**

- `Set.<number>` — Pitch classes contained in the scale.

<MemberHeading
  id="chorddegreeinscale"
  depth="3"
  name="chordDegreeInScale"
  sig="chordDegreeInScale(
	scaleRootPc: number,
	chordRootPc: number,
): number"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L151" sourceLabel="voiceLeading.js:151" />

Returns the scale degree of a chord root within a scale as semitones from the scale root.

**Parameters**

- `scaleRootPc` (number) — Scale root pitch class (0–11).
- `chordRootPc` (number) — Chord root pitch class (0–11).

**Returns**

- `number` — Semitones from scale root to chord root (0–11).

<MemberHeading id="hastritone" depth="3" name="hasTritone" sig="hasTritone(pitchClasses: Iterable.<number>): boolean" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L161" sourceLabel="voiceLeading.js:161" />

Returns `true` if any two pitch classes in the set are a tritone (6 semitones) apart.

**Parameters**

- `pitchClasses` (Iterable.\<number>) — Collection of pitch class integers (0–11).

**Returns**

- `boolean` — Whether a tritone interval exists between any pair.

<MemberHeading
  id="countalterations"
  depth="3"
  name="countAlterations"
  sig="countAlterations(
	chordRootPc: number,
	chordPitchClasses: Iterable.<number>,
): number"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L180" sourceLabel="voiceLeading.js:180" />

Counts chromatic alterations in a chord — pitch classes not present in the natural major scale built on the chord root. Used as a tension modifier in `scoreTension()` and to detect altered dominants for the fuzzy matching pass.

**Parameters**

- `chordRootPc` (number) — Chord root pitch class (0–11).
- `chordPitchClasses` (Iterable.\<number>) — Pitch classes in the chord.

**Returns**

- `number` — Number of non-diatonic pitch classes.

<MemberHeading
  id="derivechordquality"
  depth="3"
  name="deriveChordQuality"
  sig="deriveChordQuality(
	intervals: Array.<number>,
): 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'suspended'"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L196" sourceLabel="voiceLeading.js:196" />

Derives a chord quality label from its interval pattern. Used to determine Roman numeral case and functional description.

**Parameters**

- `intervals` (Array.\<number>) — Semitone intervals from root (e.g. `[0,4,7,10]`).

**Returns**

- `'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'suspended'` — Quality string.

<MemberHeading id="builddominantcorepcs" depth="3" name="buildDominantCorePcs" sig="buildDominantCorePcs(chordRootPc: number): Set.<number>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L223" sourceLabel="voiceLeading.js:223" />

Builds the set of core pitch classes for a dominant chord (root + M3 + m7). Used in the fuzzy matching pass to locate altered dominant chords in a tonal context without requiring their chromatic extensions to be diatonic.

**Parameters**

- `chordRootPc` (number) — Chord root pitch class (0–11).

**Returns**

- `Set.<number>` — Pitch classes for the three core dominant tones.

<MemberHeading id="scalecommonality" depth="3" name="scaleCommonality" sig="scaleCommonality(symbol: string): number" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L237" sourceLabel="voiceLeading.js:237" />

Assigns a commonality weight to a scale symbol so that more common scales surface before rare ones when tension is equal. Higher value = more common.

**Parameters**

- `symbol` (string) — Scale symbol from `SCALES`.

**Returns**

- `number` — Commonality weight (default 2 for unknown scales).

<MemberHeading
  id="finddiatoniccontexts"
  depth="3"
  name="findDiatonicContexts"
  sig="findDiatonicContexts(
	chordRootPc: number,
	chordPitchClasses: Iterable.<number>,
	chordIntervals: Array.<number>,
): Array.<{scaleSymbol: string, scaleName: string, scaleGroup: string, scaleRootPc: number, degSemitones: number, roman: string, harmonicFunction: string, tension: number, matchQuality: number}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L274" sourceLabel="voiceLeading.js:274" />

Finds every diatonic context in which a chord can function — the core of the voice leading engine. Tests all 46 scales × 12 roots (552 combinations) and collects every context where all chord pitch classes are contained in the scale.

For altered dominant chords (dominant quality with 2+ chromatic alterations), a second fuzzy pass matches against core tones only (root + M3 + m7), since their extensions are chromatic by design and would prevent any exact match. Fuzzy matches are tagged `matchQuality: 0.8` and de-duplicated against exact matches.

Results are sorted by musical relevance (dominant function → diatonic group → match quality → scale commonality → tension).

**Parameters**

- `chordRootPc` (number) — Chord root pitch class (0–11).
- `chordPitchClasses` (Iterable.\<number>) — All pitch classes in the chord.
- `chordIntervals` (Array.\<number>) — Raw intervals from the `CHORD_TYPES` entry (for quality detection).

**Returns**

- `Array.<{scaleSymbol: string, scaleName: string, scaleGroup: string, scaleRootPc: number, degSemitones: number, roman: string, harmonicFunction: string, tension: number, matchQuality: number}>` — Context objects sorted by musical relevance, highest first.

<MemberHeading
  id="scoretension"
  depth="3"
  name="scoreTension"
  sig="scoreTension(
	degSemitones: number,
	chordPcs: Set.<number>,
	chordRootPc: number,
): number"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L431" sourceLabel="voiceLeading.js:431" />

Computes a tension score for a chord in a given diatonic context. Combines the base tension of the chord's scale degree with modifiers for tritone presence and chromatic alterations. Capped at 1.0.

**Parameters**

- `degSemitones` (number) — Semitones from scale root to chord root (0–11).
- `chordPcs` (Set.\<number>) — Pitch classes in the chord.
- `chordRootPc` (number) — Chord root pitch class (0–11).

**Returns**

- `number` — Tension score in the range 0.0–1.0.

<MemberHeading
  id="deriveresolutiontargets"
  depth="3"
  name="deriveResolutionTargets"
  sig="deriveResolutionTargets(
	context: Object,
	chordRootPc: number,
): Object"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L471" sourceLabel="voiceLeading.js:471" />

Derives all resolution targets, departure paths, and reharmonisation substitutions for a chord in a given diatonic context.

Returns three arrays ranked by strength:

- `resolutions` — true harmonic resolutions (tension → rest); get voice leading pre-computed.
- `departures` — motion away from a stable tonic chord; get voice leading pre-computed.
- `substitutions` — reharmonisation alternatives (e.g. tritone sub, related ii); no voice leading computed (they are not resolution targets).

Resolution types:

- Tonic: departures only (I → IV, I → V, I → ii, I → vi)
- Dominant: authentic (V → I), authentic minor (V → i), deceptive (V → vi); substitutions: tritone sub, related ii
- Subdominant: to dominant (IV → V), plagal (IV → I)
- Predominant: to dominant (ii → V), direct (ii → I)

**Parameters**

- `context` (Object) — One context object from `findDiatonicContexts()`.
- `chordRootPc` (number) — Chord root pitch class (0–11); used for tritone sub calculation.

**Returns**

- `Object`

<MemberHeading id="resolvetargetintervals" depth="3" name="resolveTargetIntervals" sig="resolveTargetIntervals(targetSymbol: string): Array.<number>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L647" sourceLabel="voiceLeading.js:647" />

Looks up the pitch-class interval array for a `CHORD_TYPES` symbol string. Falls back to `[0,4,7]` (major triad) for unrecognised symbols — indicates a programming error upstream if triggered.

**Parameters**

- `targetSymbol` (string) — A `CHORD_TYPES` symbol string (e.g. `'Maj7'`, `'m7'`, `'7'`).

**Returns**

- `Array.<number>` — Pitch-class intervals mod 12, sorted ascending, deduplicated.

<MemberHeading
  id="generatecandidates"
  depth="3"
  name="generateCandidates"
  sig="generateCandidates(
	targetRootPc: number,
	targetIntervals: Array.<number>,
	sourceMidi: Array.<number>,
): Array.<{midi: number, pc: number, intervalIndex: number}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L661" sourceLabel="voiceLeading.js:661" />

Enumerates every reachable MIDI note for each target pitch class within ±12 semitones of the source range. Guarantees the nearest instance of every target PC is always available to every source voice.

**Parameters**

- `targetRootPc` (number) — Pitch class of the resolution target root (0–11).
- `targetIntervals` (Array.\<number>) — Interval array from `resolveTargetIntervals()`.
- `sourceMidi` (Array.\<number>) — MIDI note numbers of the sounding chord.

**Returns**

- `Array.<{midi: number, pc: number, intervalIndex: number}>` — Candidate notes.

<MemberHeading id="movecost" depth="3" name="moveCost" sig="moveCost(delta: number, isBass: boolean): number" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L687" sourceLabel="voiceLeading.js:687" />

Cost of moving a single voice by `delta` semitones. Common tones are free; steps and thirds cost their distance; leaps incur a penalty. Bass voice leap penalty is halved to permit natural bass motion by fourth or fifth.

**Parameters**

- `delta` (number) — Absolute semitone distance of the move (0 = common tone).
- `isBass` (boolean) — Whether this is the lowest source voice.

**Returns**

- `number` — Non-negative cost value.

<MemberHeading
  id="assignbymincost"
  depth="3"
  name="assignByMinCost"
  sig="assignByMinCost(
	sourceMidi: Array.<number>,
	candidates: Array.<{midi: number, pc: number, intervalIndex: number}>,
): Array.<{fromMidi: number, toMidi: number}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L708" sourceLabel="voiceLeading.js:708" />

Finds the globally optimal voice leading assignment from source notes to candidate target notes via backtracking search with branch pruning.

Constraints:

- No two voices may share the same MIDI note (no exact unison doubling).
- Total cost across all voices is minimised globally (not greedily per voice).

Pruning: any branch whose partial cost meets or exceeds the current best is abandoned. For N ≤ 7 voices, exhaustive search with pruning is trivially fast.

**Parameters**

- `sourceMidi` (Array.\<number>) — MIDI note numbers of the sounding chord (sorted ascending).
- `candidates` (Array.\<{midi: number, pc: number, intervalIndex: number}>) — From `generateCandidates()`.

**Returns**

- `Array.<{fromMidi: number, toMidi: number}>` — Optimal assignment, one entry per source voice.

<MemberHeading
  id="repairvoicecrossing"
  depth="3"
  name="repairVoiceCrossing"
  sig="repairVoiceCrossing(
	assignments: Array.<{fromMidi: number, toMidi: number}>,
): Array.<{fromMidi: number, toMidi: number}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L764" sourceLabel="voiceLeading.js:764" />

Post-processes a voice leading assignment to eliminate voice crossings where doing so strictly reduces total cost. Uses strict `<` in the swap guard to guarantee termination — each accepted swap strictly reduces total cost, so the loop converges in at most O(N²) passes with no risk of cycling.

**Parameters**

- `assignments` (Array.\<{fromMidi: number, toMidi: number}>) — Sorted by `fromMidi` ascending.

**Returns**

- `Array.<{fromMidi: number, toMidi: number}>` — The same array with crossings resolved in-place.

<MemberHeading
  id="buildmoves"
  depth="3"
  name="buildMoves"
  sig="buildMoves(
	assignments: Array.<{fromMidi: number, toMidi: number}>,
): Array.<{fromMidi: number, toMidi: number, fromPc: number, toPc: number, semitones: number, direction: ('up'|'down'|'none'), reason: ('common_tone'|'stepwise')}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L805" sourceLabel="voiceLeading.js:805" />

Converts final voice leading assignments into the UI move objects consumed by `breakdown.js`.

**Parameters**

- `assignments` (Array.\<{fromMidi: number, toMidi: number}>) — Final optimised assignments.

**Returns**

- `Array.<{fromMidi: number, toMidi: number, fromPc: number, toPc: number, semitones: number, direction: ('up'|'down'|'none'), reason: ('common_tone'|'stepwise')}>` — Move objects ready for UI rendering.

<MemberHeading
  id="computevoiceleadingrules"
  depth="3"
  name="computeVoiceLeadingRules"
  sig="computeVoiceLeadingRules(
	sourceMidi: Array.<number>,
	targetRootPc: number,
	targetSymbol: string,
	context: Object,
): Array.<{fromMidi: number, toMidi: number, fromPc: number, toPc: number, semitones: number, direction: ('up'|'down'|'none'), reason: ('common_tone'|'stepwise')}>"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L844" sourceLabel="voiceLeading.js:844" />

Orchestrates the five-stage voice leading pipeline for a single resolution target.

Stages:

1. Resolve target intervals from `CHORD_SYMBOL_INTERVALS`
1. Generate all reachable candidate MIDI notes within ±12 of the source range
1. Global minimum-cost assignment via backtracking search
1. Voice crossing repair
1. Build UI move objects

**Parameters**

- `sourceMidi` (Array.\<number>) — MIDI note numbers of the sounding chord.
- `targetRootPc` (number) — Pitch class of the resolution target root (0–11).
- `targetSymbol` (string) — `CHORD_TYPES` symbol string (e.g. `'Maj7'`, `'m7'`, `'7'`).
- `context` (Object) — Context object (accepted for signature compatibility; not used internally).

**Returns**

- `Array.<{fromMidi: number, toMidi: number, fromPc: number, toPc: number, semitones: number, direction: ('up'|'down'|'none'), reason: ('common_tone'|'stepwise')}>` — Voice leading move objects.

<MemberHeading
  id="analysechord"
  depth="3"
  name="analyseChord"
  sig="analyseChord(
	chordRootPc: number,
	chordPitchClasses: Array.<number> | Set.<number>,
	chordIntervals: Array.<number>,
	sourceMidi: Array.<number>,
	chordFamily: string,
): Object"
/>

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L886" sourceLabel="voiceLeading.js:886" />

Main entry point for the voice leading engine. Given a chord's root, pitch classes, interval pattern, sounding MIDI notes, and family, returns the full harmonic analysis: all diatonic contexts, resolution targets per context, and pre-computed voice leading.

Voice leading is pre-computed for every entry in `ctx.resolutions` and `ctx.departures`. Substitutions carry no voice leading — they are chord alternatives, not resolution targets.

**Parameters**

- `chordRootPc` (number) — Chord root pitch class (0–11).
- `chordPitchClasses` (Array.\<number> | Set.\<number>) — All pitch classes in the chord.
- `chordIntervals` (Array.\<number>) — Raw intervals from the `CHORD_TYPES` entry (e.g. `[0,4,7,10]`).
- `sourceMidi` (Array.\<number>) — MIDI note numbers currently sounding.
- `chordFamily` (string) — Family string from `CHORD_TYPES` (e.g. `'major'`, `'dominant'`).

**Returns**

- `Object`

## Other

<MemberHeading id="functionmap" depth="3" name="FUNCTION_MAP" sig="FUNCTION_MAP: Object.<number, string>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L37" sourceLabel="voiceLeading.js:37" />

Harmonic function derived from scale degree (semitones from scale root, 0–11). Used in context discovery (Step 3) and tension scoring (Step 4).

<MemberHeading id="basetension" depth="3" name="BASE_TENSION" sig="BASE_TENSION: Object.<number, number>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L59" sourceLabel="voiceLeading.js:59" />

Base tension value per scale degree (semitones from scale root, 0–11). Modified by chord content in `scoreTension()`. Range: 0.0 (completely at rest) to 0.9 (maximum pre-resolution tension).

<MemberHeading id="lowercasequalities" depth="3" name="LOWERCASE_QUALITIES" sig="LOWERCASE_QUALITIES: Set.<string>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L79" sourceLabel="voiceLeading.js:79" />

Chord qualities whose Roman numerals are lowercased (minor and diminished chords).

<MemberHeading id="ambiguousfamilies" depth="3" name="AMBIGUOUS_FAMILIES" sig="AMBIGUOUS_FAMILIES: Set.<string>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L88" sourceLabel="voiceLeading.js:88" />

Chord families where the algorithm cannot reliably derive a single resolution target. These fall back to existing app logic rather than the voice leading engine. See algorithm plan § 6 Edge Cases.

<MemberHeading id="dominantcoreintervals" depth="3" name="DOMINANT_CORE_INTERVALS" sig="DOMINANT_CORE_INTERVALS: Array.<number>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L99" sourceLabel="voiceLeading.js:99" />

Core tones used for fuzzy scale matching of altered dominant chords. Altered dominants (e.g. 7(♭9)(♯11)(♭13)) have extensions that are chromatic by design and would prevent any exact scale match. Matching on root + M3 + m7 only identifies the dominant context without requiring the altered tensions to be diatonic. Intervals are semitones above the chord root.

<MemberHeading id="chordsymbolintervals" depth="3" name="CHORD_SYMBOL_INTERVALS" sig="CHORD_SYMBOL_INTERVALS: Object.<string, Array.<number>>" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L114" sourceLabel="voiceLeading.js:114" />

Flat symbol-to-intervals lookup built from `CHORD_TYPES` at startup. Intervals are normalised mod 12, deduplicated, and sorted ascending. Auto-updates when `CHORD_TYPES` gains new entries — no manual maintenance needed.

Used by `resolveTargetIntervals()` to map a target symbol (e.g. `'Maj7'`, `'m7'`) to the pitch-class interval array required by `generateCandidates()`.

<MemberHeading id="leappenalty" depth="3" name="LEAP_PENALTY" sig="LEAP_PENALTY: number" />

<MemberMeta sourceHref="/source/engine/voiceleading-js/#L637" sourceLabel="voiceLeading.js:637" />

Leap penalty added to raw semitone distance for any move larger than a major third (4 st). A perfect fifth leap (7 st) costs 7 + 8 = 15 — more than five stepwise moves. Bass leap penalty is halved to allow natural bass motion by fourth or fifth.
