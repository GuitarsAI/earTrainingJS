---
title: Helpers
kind: module
longname: module:Helpers
description: Shared utility functions and pool-building logic consumed across all mode files. Covers session reset, random selection, MIDI conversion, chord inversion construction, active pool filtering, octave band resolution, root MIDI selection, per-session stats recording and rendering, and root badge display. Also declares two per-question resolved-state variables (currentVoicingMode, currentChordPlayStyle) that are set and consumed entirely within the chord question flow.
---

# Helpers

<SourceLink href="/source/engine/helpers-js/#L17" label="helpers.js:17" />

Shared utility functions and pool-building logic consumed across all mode files. Covers session reset, random selection, MIDI conversion, chord inversion construction, active pool filtering, octave band resolution, root MIDI selection, per-session stats recording and rendering, and root badge display. Also declares two per-question resolved-state variables (currentVoicingMode, currentChordPlayStyle) that are set and consumed entirely within the chord question flow.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="resetsession" depth="3" name="resetSession" sig="resetSession(): void" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L27" sourceLabel="helpers.js:27" />

Performs a full session reset. Zeroes all score counters and clears sessionStats, resets all chord sub-state variables (slash, poly, UST), clears every UI panel to its blank state, then calls generateQuestion() to immediately begin a fresh question.

**Returns**

- `void`

<MemberHeading id="pickrandom" depth="3" name="pickRandom" sig="pickRandom(arr: Array): *" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L62" sourceLabel="helpers.js:62" />

Returns a uniformly random element from an array.

**Parameters**

- `arr` (Array) — The array to sample from.

**Returns**

- `*` — A randomly selected element.

<MemberHeading id="miditosoundfontname" depth="3" name="midiToSoundFontName" sig="midiToSoundFontName(midi: number): string" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L72" sourceLabel="helpers.js:72" />

Converts a MIDI note number to a soundfont-player filename string. For example, MIDI 60 → 'C4', MIDI 69 → 'A4'. Uses NOTE\_NAMES from spelling.js for pitch-class-to-letter mapping.

**Parameters**

- `midi` (number) — MIDI note number (0–127).

**Returns**

- `string` — Soundfont filename key, e.g. 'C4', 'F#3'.

<MemberHeading
  id="applyinversion"
  depth="3"
  name="applyInversion"
  sig="applyInversion(
	baseIntervals: Array.<number>,
	rootMidi: number,
	invIndex: number,
): Array.<number>"
/>

<MemberMeta sourceHref="/source/engine/helpers-js/#L94" sourceLabel="helpers.js:94" />

Builds the MIDI note array for a chord at a given inversion. Rotates the note set by shifting the lowest note up one octave, repeated invIndex times. Root position (invIndex 0) returns notes unchanged.

**Parameters**

- `baseIntervals` (Array.\<number>) — Semitone offsets from the root (root position).
- `rootMidi` (number) — MIDI note number of the chord root.
- `invIndex` (number) — Inversion number: 1 = first inversion, 2 = second, etc.

**Returns**

- `Array.<number>` — MIDI note numbers for the chord at the requested inversion.

<MemberHeading id="buildinversionpool" depth="3" name="buildInversionPool" sig="buildInversionPool(basePool: Array.<Object>): Array.<Object>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L115" sourceLabel="helpers.js:115" />

Generates all inversion entries for every chord in basePool. Each entry extends the source chord descriptor with inversion metadata: a display name (e.g. 'Major — 1st inv'), a disambiguated symbol (e.g. 'maj\_inv1'), and references back to the base chord for interval lookup. Root position (index 0) is excluded — it already exists in the base pool.

**Parameters**

- `basePool` (Array.\<Object>) — Array of chord descriptors from CHORD\_TYPES.

**Returns**

- `Array.<Object>` — Array of inversion entry objects, one per valid inversion of each chord in basePool.

<MemberHeading id="getallchords" depth="3" name="getAllChords" sig="getAllChords(): Array.<Object>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L141" sourceLabel="helpers.js:141" />

Returns a flat array of every chord descriptor across all 12 families from CHORD\_TYPES. This is the canonical complete chord list from which all filtered pools are derived.

**Returns**

- `Array.<Object>` — All chord descriptors in family order.

<MemberHeading id="getactivepool" depth="3" name="getActivePool" sig="getActivePool(): Array.<Object>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L173" sourceLabel="helpers.js:173" />

Builds the active chord quiz pool from selectedChords. When includeInversions is true, appends inversion entries for all eligible families via buildInversionPool(). Slash, poly, UST, classical, quartal, and cluster families are excluded from inversion generation: slash and poly have their own bass-note structure incompatible with rotation-based inversions; UST voicings are rootless by design; classical, quartal, and cluster have fixed voicings where inversion would distort their identity.

Falls back to one chord from each of the four basic families (major, minor, diminished, augmented) if selectedChords is empty, so the app never crashes on an empty pool.

**Returns**

- `Array.<Object>` — Active chord pool including any requested inversion entries.

<MemberHeading id="getactiveintervalpool" depth="3" name="getActiveIntervalPool" sig="getActiveIntervalPool(): Array.<Object>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L205" sourceLabel="helpers.js:205" />

Filters INTERVALS to those present in selectedIntervals. Falls back to the full INTERVALS array if the selection is empty, preserving meaningful quiz variety even when the user has deselected everything.

**Returns**

- `Array.<Object>` — Active interval pool.

<MemberHeading id="getactivescalepool" depth="3" name="getActiveScalePool" sig="getActiveScalePool(): Array.<Object>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L217" sourceLabel="helpers.js:217" />

Filters SCALES to those present in selectedScales. Falls back to \[SCALES\[0]] (the first scale in the library) if the selection is empty, so the app always has at least one item to quiz.

**Returns**

- `Array.<Object>` — Active scale pool.

<MemberHeading
  id="resolveoctaveband"
  depth="3"
  name="resolveOctaveBand"
  sig="resolveOctaveBand(
	band: string | null,
	loDefault: number,
	hiDefault: number,
)"
/>

<MemberMeta sourceHref="/source/engine/helpers-js/#L233" sourceLabel="helpers.js:233" />

Maps a pinnedOctave string value to a \[lo, hi] octave range (inclusive). Returns \[loDefault, hiDefault] when band is null (random octave mode).

**Parameters**

- `band` (string | null) — Octave band: 'low' | 'mid' | 'high' | null.
- `loDefault` (number) — Lower bound to use when band is null.
- `hiDefault` (number) — Upper bound to use when band is null.

**Returns**

-

<MemberHeading id="chooserootmidi" depth="3" name="chooseRootMidi" sig="chooseRootMidi(chord: Object): number" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L250" sourceLabel="helpers.js:250" />

Chooses a MIDI root note for a chord question, respecting pinnedRoot and pinnedOctave. Computes the safe octave range for the chord's interval span to keep all notes within MIDI 28–96, then clamps and guards against degenerate ranges before picking a random octave within the safe window. For inverted chords, reads intervals from baseChord to get the correct span.

**Parameters**

- `chord` (Object) — Chord descriptor or inversion entry from the active pool.

**Returns**

- `number` — MIDI note number of the chosen root.

<MemberHeading id="choosesimplerootmidi" depth="3" name="chooseSimpleRootMidi" sig="chooseSimpleRootMidi(semitoneRange: number): number" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L281" sourceLabel="helpers.js:281" />

Chooses a MIDI root note for an interval or scale question, respecting pinnedRoot and pinnedOctave. Clamps the upper octave bound so the top note of the interval or scale stays below MIDI 97.

**Parameters**

- `semitoneRange` (number) — Semitones above the root to the highest note (e.g. 12 for an octave interval, the scale's last interval value for scales).

**Returns**

- `number` — MIDI note number of the chosen root.

<MemberHeading
  id="recordanswer"
  depth="3"
  name="recordAnswer"
  sig="recordAnswer(
	symbol: string,
	name: string,
	isCorrect: boolean,
): void"
/>

<MemberMeta sourceHref="/source/engine/helpers-js/#L302" sourceLabel="helpers.js:302" />

Records one answer event into sessionStats and re-renders the stats table. Creates the entry for the item if it does not already exist.

**Parameters**

- `symbol` (string) — Unique item symbol used as the sessionStats key.
- `name` (string) — Display name shown in the stats table.
- `isCorrect` (boolean) — Whether the answer was correct.

**Returns**

- `void`

<MemberHeading id="renderstats" depth="3" name="renderStats" sig="renderStats(): void" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L317" sourceLabel="helpers.js:317" />

Re-renders the #statsBody table from the current sessionStats object. Rows are sorted worst-accuracy-first so the items most needing practice appear at the top. Each row shows the item name, correct count, total attempts, percentage, and a proportional visual bar.

**Returns**

- `void`

<MemberHeading id="updaterootbadge" depth="3" name="updateRootBadge" sig="updateRootBadge(rootName: string | null): void" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L347" sourceLabel="helpers.js:347" />

Shows or hides the #rootBadge element based on the showRoot flag and whether a root name is available. Called after each new question is generated.

**Parameters**

- `rootName` (string | null) — The root note name to display, or null/empty to hide the badge.

**Returns**

- `void`

## Instance Fields

<MemberHeading id="currentvoicingmode" depth="3" name="currentVoicingMode" sig="currentVoicingMode: string" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L369" sourceLabel="helpers.js:369" />

The resolved voicing symbol for the current chord question. Set by generateChordQuestion() and dictLoadSymbol() at question time. Read by applyVoicing() in voicings.js to determine how to space the notes.

<MemberHeading id="currentchordplaystyle" depth="3" name="currentChordPlayStyle" sig="currentChordPlayStyle: string" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L379" sourceLabel="helpers.js:379" />

The resolved playback style for the current chord question. Set by resolveChordStyle() in audio.js at play time, before notes are scheduled. Read by showNotation() in notation.js so the notation display mirrors the playback order actually heard.

## Other

<MemberHeading id="invlabels" depth="3" name="INV_LABELS" sig="INV_LABELS: Array.<string>" />

<MemberMeta sourceHref="/source/engine/helpers-js/#L82" sourceLabel="helpers.js:82" />

Human-readable inversion labels indexed by inversion number. Index 0 is empty because root position is not labelled as an inversion.
