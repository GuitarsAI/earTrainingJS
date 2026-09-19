---
title: notation
kind: module
longname: module:notation
description: "VexFlow-based notation renderer for all app modes. Handles enharmonic spelling, key signature accidental filtering, automatic grand staff layout, sequential (scale) and block (chord/interval) rendering, polychord rendering, and label generation for all chord families (slash, poly, UST, inversion). Depends on (must load before this file): VexFlow (js/vendor/vexflow.min.js) js/data/spelling.js — spelledNote, midiToVexKeySpelled, respellForKeySig, isCoveredByKeySig, vexAccidental, spelledRoot js/data/keysig.js — keySigCoveredLetters, keySigAccidentalCount js/engine/state.js — currentMode, currentMidiNotes, currentChord, currentChordRootMidi, currentPolyUpperMidi, currentPolyLowerMidi, currentPolyUpperRootMidi, currentPolyLowerRootMidi, currentSlashBassMidi, currentUpperRootMidi, currentUSTRootMidi, currentIntervalMidi, currentInterval, currentIntervalStyle, currentScale, currentScaleRootMidi, currentScaleDir, intervalKeySigMode, scaleKeySigMode, chordKeySigMode, currentChordPlayStyle, answered js/engine/helpers.js — pcInterval, tritoneLabel, getBestFitKeyStr, getChordKeyStr, getIntervalKeyStr, getScaleParentKeyStr js/breakdown/breakdown.js — showBreakdown js/modes/chords-mode.js — renderInversionChips"
---

# notation

<SourceLink href="/source/engine/notation-js/#L34" label="notation.js:34" />

VexFlow-based notation renderer for all app modes. Handles enharmonic spelling, key signature accidental filtering, automatic grand staff layout, sequential (scale) and block (chord/interval) rendering, polychord rendering, and label generation for all chord families (slash, poly, UST, inversion).

Depends on (must load before this file):

- VexFlow (js/vendor/vexflow\.min.js)
- js/data/spelling.js — spelledNote, midiToVexKeySpelled, respellForKeySig, isCoveredByKeySig, vexAccidental, spelledRoot
- js/data/keysig.js — keySigCoveredLetters, keySigAccidentalCount
- js/engine/state.js — currentMode, currentMidiNotes, currentChord, currentChordRootMidi, currentPolyUpperMidi, currentPolyLowerMidi, currentPolyUpperRootMidi, currentPolyLowerRootMidi, currentSlashBassMidi, currentUpperRootMidi, currentUSTRootMidi, currentIntervalMidi, currentInterval, currentIntervalStyle, currentScale, currentScaleRootMidi, currentScaleDir, intervalKeySigMode, scaleKeySigMode, chordKeySigMode, currentChordPlayStyle, answered
- js/engine/helpers.js — pcInterval, tritoneLabel, getBestFitKeyStr, getChordKeyStr, getIntervalKeyStr, getScaleParentKeyStr
- js/breakdown/breakdown.js — showBreakdown
- js/modes/chords-mode.js — renderInversionChips

* **License:** MIT
* **Copyright:** The Sound Travels 2026
* **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="miditovexkeyexact" depth="3" name="midiToVexKeyExact" sig="midiToVexKeyExact(midi: number): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L44" sourceLabel="notation.js:44" />

Converts a MIDI note number to a VexFlow key string using a fixed chromatic mapping (always sharps, no enharmonic awareness). Used only for simple single-note cases where spelling context is unavailable or irrelevant.

**Parameters**

- `midi` (number) — MIDI note number (0–127).

**Returns**

- `string` — VexFlow key string, e.g. `'c#/4'`, `'a/5'`.

<MemberHeading
  id="addaccidentals"
  depth="3"
  name="addAccidentals"
  sig="addAccidentals(
	staveNote: VF.StaveNote,
	keys: Array.<string>,
	VF: object,
): void"
/>

<MemberMeta sourceHref="/source/engine/notation-js/#L62" sourceLabel="notation.js:62" />

Adds VexFlow accidental modifiers to a StaveNote for every key in `keys` that carries an accidental. Does not filter for key signature coverage — use `addAccidentalsFiltered` when a key signature is active.

**Parameters**

- `staveNote` (VF.StaveNote) — The VexFlow StaveNote to annotate.
- `keys` (Array.\<string>) — Array of VexFlow key strings, e.g. `['f#/4', 'a/4', 'c/5']`.
- `VF` (object) — VexFlow namespace object.

**Returns**

- `void`

<MemberHeading
  id="rendernotation"
  depth="3"
  name="renderNotation"
  sig="renderNotation(
	midiNotes: Array.<number>,
	sequential: boolean,
	symbol?: string,
	rootPc?: number,
	keySigStr?: string | null,
): void"
/>

<MemberMeta sourceHref="/source/engine/notation-js/#L96" sourceLabel="notation.js:96" />

Renders a set of MIDI notes into the `#notation-svg` element using VexFlow.

Supports two layout modes:

- **Block** (`sequential = false`): all notes as a single stacked whole-note chord. Used for chords and intervals. Automatically uses a grand staff when the note range spans both treble and bass registers.
- **Sequential** (`sequential = true`): one quarter note per pitch in the given order, padded with rests to complete the final 4/4 bar, with bar lines inserted every 4 beats. Used for scales.

Enharmonic spelling is driven by `symbol` and `rootPc` via `midiToVexKeySpelled`. When `keySigStr` is supplied, accidentals already covered by the key signature are suppressed, and conflicting accidentals (e.g. F♮ in a G major context) receive explicit cancellation marks.

**Parameters**

- `midiNotes` (Array.\<number>) — MIDI note numbers to render.
- `sequential` (boolean) — `false` = block chord; `true` = sequential scale.
- `symbol` (string, optional, default: "''") — Chord/interval symbol used to drive enharmonic spelling.
- `rootPc` (number, optional, default: 0) — Root pitch class (0–11) for spelling context.
- `keySigStr` (string | null, optional, default: null) — VexFlow key signature string, e.g. `'G'`, `'Db'`, `'Bbm'`. `null` = no key signature (C major / no accidentals suppressed).

**Returns**

- `void`

<MemberHeading id="getslashchordrootlabel" depth="3" name="getSlashChordRootLabel" sig="getSlashChordRootLabel(): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L368" sourceLabel="notation.js:368" />

Returns the spelled note name of the upper chord's root in a slash chord, used as the root badge label in the UI (shows the upper chord root, not the bass).

**Returns**

- `string` — Spelled root name, e.g. `'B'`, `'Eb'`. Empty string if not set.

<MemberHeading id="getslashresolvedname" depth="3" name="getSlashResolvedName" sig="getSlashResolvedName(): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L381" sourceLabel="notation.js:381" />

Builds the fully resolved slash chord name for the current question, e.g. `'B/C'` or `'Bm/C'`. The slash chord type is root-agnostic in the data layer, so this is computed from the randomised root each question.

**Returns**

- `string` — Resolved slash chord name, e.g. `'Bm/C'`. Empty string if state is unset.

<MemberHeading id="polyqualitysuffix" depth="3" name="polyQualitySuffix" sig="polyQualitySuffix(sym: string): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L397" sourceLabel="notation.js:397" />

Returns the short quality suffix for a polychord triad symbol, used when building the polychord display label.

**Parameters**

- `sym` (string) — Chord symbol: `'maj'`, `'min'`, `'aug'`, or `'7'`.

**Returns**

- `string` — Short suffix: `''` (major), `'m'`, `'aug'`, or `'7'`.

<MemberHeading id="polyqualityfull" depth="3" name="polyQualityFull" sig="polyQualityFull(sym: string): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L411" sourceLabel="notation.js:411" />

Returns the full quality name for a polychord triad symbol, used in descriptive UI text.

**Parameters**

- `sym` (string) — Chord symbol: `'maj'`, `'min'`, `'aug'`, or `'7'`.

**Returns**

- `string` — Full name: `'major'`, `'minor'`, `'augmented'`, or `'dominant 7th'`.

<MemberHeading id="getpolychordlabel" depth="3" name="getPolyChordLabel" sig="getPolyChordLabel(): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L424" sourceLabel="notation.js:424" />

Builds the polychord display label for the current question, e.g. `'E / A'`, `'Eaug / A'`, `'E7 / Am'`.

**Returns**

- `string` — Polychord label. Falls back to `currentChord.name` if roots are unset.

<MemberHeading id="getustlabel" depth="3" name="getUSTLabel" sig="getUSTLabel(): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L442" sourceLabel="notation.js:442" />

Builds the UST (Upper Structure Triad) display label for the current question. Adapts to the shell chord quality:

- Dom7 shell: `'UST ♭II over G7 → G7(♭9)(♯11)(♭13)'`
- m7 shell: `'UST IIm over Gm7 → Gm7(9)(11)'`
- Maj7 shell: `'UST II over GMaj7 → GMaj7(9)(♯11)'`

**Returns**

- `string` — UST label. Falls back to `currentChord.name` if root is unset.

<MemberHeading id="getchordrootname" depth="3" name="getChordRootName" sig="getChordRootName(): string" />

<MemberMeta sourceHref="/source/engine/notation-js/#L464" sourceLabel="notation.js:464" />

Derives the harmonic root name for the current chord, correctly spelled and adapted to the chord family. Used as the root prefix in the notation label.

- Slash chords: returns the upper chord root (not the bass note).
- Polychords: returns the upper triad root.
- UST: returns the shell chord root.
- Inverted chords: reconstructs the harmonic root from the bass interval.
- All others: uses `currentChordRootMidi` with a fallback to the lowest note.

**Returns**

- `string` — Spelled root name, e.g. `'G'`, `'Bb'`, `'F#'`.

<MemberHeading id="renderpolynotation" depth="3" name="renderPolyNotation" sig="renderPolyNotation(keySigStr: string | null): void" />

<MemberMeta sourceHref="/source/engine/notation-js/#L499" sourceLabel="notation.js:499" />

Renders a polychord into `#notation-svg` using a forced grand staff layout: upper triad always on the treble stave, lower triad always on the bass stave, each spelled relative to its own root and symbol independently.

This is a dedicated renderer (separate from `renderNotation`) because polychords require per-triad spelling contexts that a single-root renderer cannot provide. The two triads are spelled independently, then drawn on their respective staves with the shared key signature (if any) applied to both.

**Parameters**

- `keySigStr` (string | null) — VexFlow key signature string, e.g. `'G'`, `'Bbm'`. `null` = no key signature.

**Returns**

- `void`

<MemberHeading id="shownotation" depth="3" name="showNotation" sig="showNotation(): void" />

<MemberMeta sourceHref="/source/engine/notation-js/#L649" sourceLabel="notation.js:649" />

Entry point for showing notation after a question is answered or in dictionary mode. Determines the current mode and chord family, builds the correct label and key signature string, then calls the appropriate renderer (`renderNotation` or `renderPolyNotation`).

Handles all five notation paths:

1. **Intervals** — two-note block chord with interval name label.
1. **Scales** — sequential quarter notes (ascending, descending, or both).
1. **Polychords** — forced grand staff via `renderPolyNotation`.
1. **UST** — block chord spelled from the shell chord's root.
1. **Slash chords** — bass note merged with upper chord notes; grand staff auto-selected.
1. **Standard chords** — block or sequential depending on `currentChordPlayStyle`.

Also manages the key signature chip row visibility and active state, and triggers inversion chip rendering for standard chords after answering.

**Returns**

- `void`
