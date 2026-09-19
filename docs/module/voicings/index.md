---
title: voicings
kind: module
longname: module:voicings
description: "Voicing system for Chords mode. Owns the complete voicing data table ( VOICING_MODES , 62 voicings across 6 groups) and all voicing algorithms. applyVoicing() is the main dispatcher that transforms a chord's base intervals into a concrete MIDI note array for a given voicing style. resolveVoicingMode() picks one concrete mode for a question from the user's selection or active setting. Responsibilities: VOICING_MODES — data table for all 62 voicings across 6 groups applyVoicing() — main dispatcher; returns a sorted MIDI note array resolveVoicingMode() — picks one concrete mode from selectedVoicings or activeVoicingMode Out of scope for this file: Voicing chip rendering → js/ui/pool.js ( renderChordPoolPanel ) Per-question resolved state ( currentVoicingMode ) → js/engine/helpers.js User selection state ( activeVoicingMode , selectedVoicings ) → js/engine/state.js Load order: after helpers.js , before audio.js ."
---

# voicings

<SourceLink href="/source/engine/voicings-js/#L28" label="voicings.js:28" />

Voicing system for Chords mode. Owns the complete voicing data table (`VOICING_MODES`, 62 voicings across 6 groups) and all voicing algorithms. `applyVoicing()` is the main dispatcher that transforms a chord's base intervals into a concrete MIDI note array for a given voicing style. `resolveVoicingMode()` picks one concrete mode for a question from the user's selection or active setting.

Responsibilities:

- `VOICING_MODES` — data table for all 62 voicings across 6 groups
- `applyVoicing()` — main dispatcher; returns a sorted MIDI note array
- `resolveVoicingMode()` — picks one concrete mode from selectedVoicings or activeVoicingMode

Out of scope for this file:

- Voicing chip rendering → `js/ui/pool.js` (`renderChordPoolPanel`)
- Per-question resolved state (`currentVoicingMode`) → `js/engine/helpers.js`
- User selection state (`activeVoicingMode`, `selectedVoicings`) → `js/engine/state.js`

Load order: after `helpers.js`, before `audio.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="voicingroles" depth="3" name="_voicingRoles" sig="_voicingRoles(baseIntervals: Array.<number>): Array.<string>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L159" sourceLabel="voicings.js:159" />

Classifies each interval in a chord's base interval array by its harmonic role. Used internally to select notes by function (root, third, fifth, etc.) rather than by raw semitone value, so voicing algorithms work correctly across different chord qualities without hard-coding interval numbers.

Role assignments:

- `'root'` — 0 semitones
- `'third'` — 3 or 4 semitones (minor or major 3rd)
- `'fifth'` — 7 semitones (perfect 5th)
- `'altfifth'` — 6 or 8 semitones (diminished or augmented 5th)
- `'seventh'` — 10 or 11 semitones (minor or major 7th)
- `'extension'` — everything else (9ths, 11ths, 13ths, etc.)

**Parameters**

- `baseIntervals` (Array.\<number>) — Semitone intervals from root (root = 0 always present).

**Returns**

- `Array.<string>` — Role label for each interval, in the same order as the input.

<MemberHeading
  id="notesbyrole"
  depth="3"
  name="_notesByRole"
  sig="_notesByRole(
	rootMidi: number,
	baseIntervals: Array.<number>,
	roles: Array.<string>,
): Array.<number>"
/>

<MemberMeta sourceHref="/source/engine/voicings-js/#L179" sourceLabel="voicings.js:179" />

Extracts MIDI notes matching specific harmonic roles from a chord's base intervals.

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `baseIntervals` (Array.\<number>) — Semitone intervals from root.
- `roles` (Array.\<string>) — Role labels to include, e.g. `['root', 'third', 'seventh']`.

**Returns**

- `Array.<number>` — MIDI notes for the matching intervals (unsorted).

<MemberHeading id="pc" depth="3" name="_pc" sig="_pc(midi: number, rootMidi: number): number" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L193" sourceLabel="voicings.js:193" />

Returns the pitch class of a MIDI note as a semitone interval from a root.

**Parameters**

- `midi` (number) — MIDI note number.
- `rootMidi` (number) — MIDI number of the root.

**Returns**

- `number` — Interval in semitones (0–11).

<MemberHeading
  id="clamptorange"
  depth="3"
  name="_clampToRange"
  sig="_clampToRange(
	midi: number,
	loMidi: number,
	hiMidi: number,
): number"
/>

<MemberMeta sourceHref="/source/engine/voicings-js/#L204" sourceLabel="voicings.js:204" />

Clamps a MIDI note into a target octave range by transposing up or down by octaves until the note falls within `[loMidi, hiMidi]`.

**Parameters**

- `midi` (number) — MIDI note number to clamp.
- `loMidi` (number) — Lower bound (inclusive).
- `hiMidi` (number) — Upper bound (inclusive).

**Returns**

- `number` — Clamped MIDI note number.

<MemberHeading
  id="notefrominterval"
  depth="3"
  name="_noteFromInterval"
  sig="_noteFromInterval(
	rootMidi: number,
	semitones: number,
	targetLoMidi: number,
): number"
/>

<MemberMeta sourceHref="/source/engine/voicings-js/#L219" sourceLabel="voicings.js:219" />

Builds a MIDI note from a semitone offset relative to `rootMidi`, clamped to a 2-octave window starting at `targetLoMidi`.

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `semitones` (number) — Interval in semitones above the root.
- `targetLoMidi` (number) — Lower bound of the target register.

**Returns**

- `number` — MIDI note number within `[targetLoMidi, targetLoMidi + 23]`.

<MemberHeading id="stackfourths" depth="3" name="_stackFourths" sig="_stackFourths(startMidi: number, n: number): Array.<number>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L232" sourceLabel="voicings.js:232" />

Builds an array of `n` notes stacked in perfect fourths (5 semitones each) from a starting MIDI note. Used by `quartal` and `mccoy_tyner` voicings.

**Parameters**

- `startMidi` (number) — Lowest note of the stack.
- `n` (number) — Number of notes to stack.

**Returns**

- `Array.<number>` — MIDI note array (ascending).

<MemberHeading id="stackfifths" depth="3" name="_stackFifths" sig="_stackFifths(startMidi: number, n: number): Array.<number>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L246" sourceLabel="voicings.js:246" />

Builds an array of `n` notes stacked in perfect fifths (7 semitones each) from a starting MIDI note. Used by `quintal` voicing.

**Parameters**

- `startMidi` (number) — Lowest note of the stack.
- `n` (number) — Number of notes to stack.

**Returns**

- `Array.<number>` — MIDI note array (ascending).

<MemberHeading
  id="applyvoicing"
  depth="3"
  name="applyVoicing"
  sig="applyVoicing(
	rootMidi: number,
	baseIntervals: Array.<number>,
	mode: string,
): Array.<number>"
/>

<MemberMeta sourceHref="/source/engine/voicings-js/#L283" sourceLabel="voicings.js:283" />

Transforms a chord's root and base intervals into a concrete MIDI note array using the specified voicing algorithm.

This is the single entry point for all voicing computation. Every voicing mode in `VOICING_MODES` has a corresponding case here. The function is also called recursively by some cases that fall back to simpler modes (e.g. shell voicings fall back to `'close'` for triads that have no 7th).

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `baseIntervals` (Array.\<number>) — Semitone intervals from root (root = 0 always present).
- `mode` (string) — Voicing symbol string (already resolved; never `'random'`).

**Returns**

- `Array.<number>` — Sorted MIDI note array (ascending pitch). Never empty — falls back to close position on any error or unrecognised mode.

<MemberHeading id="resolvevoicingmode" depth="3" name="resolveVoicingMode" sig="resolveVoicingMode(): string" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L1106" sourceLabel="voicings.js:1106" />

Picks one concrete voicing symbol for the current question.

Resolution rules:

- **Quiz mode:** picks randomly from `selectedVoicings` (the user's chip selection), filtering out `'random'` and, in Basic mode, any advanced voicing symbols. Falls back to `'close'` if the filtered pool is empty.
- **Dictionary mode with `activeVoicingMode === 'random'`:** picks randomly from all concrete symbols (Basic mode: position + doubling groups only; Advanced mode: all 62 symbols).
- **Dictionary mode with a concrete `activeVoicingMode`:** returns it directly (single-select chip; already concrete).

Basic mode voicing symbols are limited to position and doubling groups. Advanced voicings (shell, drop, intervallic, style) are only available when `appDifficulty === 'advanced'`.

**Returns**

- `string` — A concrete voicing symbol, never `'random'`.

## Other

<MemberHeading id="voicingmode" depth="3" name="VoicingMode" sig="VoicingMode: Object" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L43" sourceLabel="voicings.js:43" />

Complete catalogue of all voicing modes available in the app. 62 entries across 6 groups.

Each entry:

**Properties**

- `group` (string) — Group key: `'position'` | `'doubling'` | `'shell'` | `'drop'` | `'intervallic'` | `'style'`
- `name` (string) — Human-readable display name shown in UI chips.
- `symbol` (string) — Unique identifier used as the key throughout the app. Never `'random'` — that is a UI meta-value only.
- `desc` (string) — One-line description shown in chip tooltips.

<MemberHeading id="concretevoicingsymbols" depth="3" name="CONCRETE_VOICING_SYMBOLS" sig="CONCRETE_VOICING_SYMBOLS: Array.<string>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L137" sourceLabel="voicings.js:137" />

All concrete voicing symbols derived from `VOICING_MODES`. Excludes the UI meta-value `'random'`, which is never passed to `applyVoicing()`. Used by `resolveVoicingMode()` when picking randomly in Dictionary mode.

<MemberHeading id="diatonicsteps" depth="3" name="DIATONIC_STEPS" sig="DIATONIC_STEPS: Array.<number>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L257" sourceLabel="voicings.js:257" />

Diatonic major scale steps in semitones, used by `secundal` and `cluster_diaton` voicings to produce diatonic-step stacking patterns.

<MemberHeading id="pentatonicsteps" depth="3" name="PENTATONIC_STEPS" sig="PENTATONIC_STEPS: Array.<number>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L263" sourceLabel="voicings.js:263" />

Major pentatonic steps in semitones, used by `cluster_pent` voicing.
