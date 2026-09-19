---
title: breakdown-scales
kind: module
longname: module:breakdown-scales
description: "Scales branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders all scale theory information — note names, degree numerals, interval rows, step pattern, triad map, modal character, parent scale, and the harmonic field analysis — into the shared breakdown panel. Responsibilities: Lookup tables: SCALE_CHARACTER , SCALE_MODAL_PARENT Theory helpers: computeDegreeNumerals() , computeTriadMap() , harmonicFieldSymbolSuffix() , harmonicFieldQuality() , harmonicFieldSeventh() , buildHarmonicField() DOM builder: makeHarmonicFieldRow() Renderer: showBreakdownScales() Dependencies (globals from earlier layers): makeNameHeader , makeBDRow , makeCSGroup , joinSep , intervalAbbr , semitoneToDegree , SEMITONE_TO_ROMAN , spelledRoot , spelledNote , pcInterval , ordinal , TRITONE_AS_D5 , EIGHT_AS_A5 , NINE_AS_D7 , currentScale , currentScaleRootMidi , currentScaleDir Load order: after breakdown-chords.js , before breakdown-progressions.js ."
---

# breakdown-scales

<SourceLink href="/source/breakdown/breakdown-scales-js/#L30" label="breakdown-scales.js:30" />

Scales branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders all scale theory information — note names, degree numerals, interval rows, step pattern, triad map, modal character, parent scale, and the harmonic field analysis — into the shared breakdown panel.

Responsibilities:

- Lookup tables: `SCALE_CHARACTER`, `SCALE_MODAL_PARENT`
- Theory helpers: `computeDegreeNumerals()`, `computeTriadMap()`, `harmonicFieldSymbolSuffix()`, `harmonicFieldQuality()`, `harmonicFieldSeventh()`, `buildHarmonicField()`
- DOM builder: `makeHarmonicFieldRow()`
- Renderer: `showBreakdownScales()`

Dependencies (globals from earlier layers): `makeNameHeader`, `makeBDRow`, `makeCSGroup`, `joinSep`, `intervalAbbr`, `semitoneToDegree`, `SEMITONE_TO_ROMAN`, `spelledRoot`, `spelledNote`, `pcInterval`, `ordinal`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`, `currentScale`, `currentScaleRootMidi`, `currentScaleDir`

Load order: after `breakdown-chords.js`, before `breakdown-progressions.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading
  id="computedegreenumerals"
  depth="3"
  name="computeDegreeNumerals"
  sig="computeDegreeNumerals(
	intervals: Array.<number>,
	symbol: string,
): Array.<string>"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L121" sourceLabel="breakdown-scales.js:121" />

Builds the degree-numeral array for a scale across all note counts. The final entry (the octave) always returns `'I'`. Enharmonically ambiguous semitone counts (6, 8, 9) are resolved via the scale symbol using the same exception sets used throughout the app (`TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`).

**Parameters**

- `intervals` (Array.\<number>) — Scale intervals array including the octave as the last entry (e.g. `[0, 2, 4, 5, 7, 9, 11, 12]`).
- `symbol` (string) — Scale symbol key (e.g. `'major'`, `'whole_tone'`), used for enharmonic context overrides.

**Returns**

- `Array.<string>` — Qualified Roman numeral strings, one per interval entry (e.g. `['I', 'II', '♭III', 'IV', 'V', '♯V', '♭VII', 'I']`).

<MemberHeading
  id="computetriadmap"
  depth="3"
  name="computeTriadMap"
  sig="computeTriadMap(
	intervals: Array.<number>,
	sym: string,
	rootPc: number,
): Array.<string> | null"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L149" sourceLabel="breakdown-scales.js:149" />

Builds a triad map for a 7-note scale. Stacks diatonic thirds from each scale degree and classifies the resulting triad quality. Each entry is an HTML `<span>` with a `title` attribute showing the note name, used by `joinSep()` to render the Triad map row in the breakdown.

Returns `null` for non-heptatonic scales (i.e. when `intervals.length !== 8`).

**Parameters**

- `intervals` (Array.\<number>) — Scale intervals array (8 entries including octave).
- `sym` (string) — Scale symbol, passed to `spelledNote()` for enharmonic spelling.
- `rootPc` (number) — Root pitch class (0–11).

**Returns**

- `Array.<string> | null` — Array of HTML span strings (7 entries), or `null` if the scale is not heptatonic.

<MemberHeading id="harmonicfieldsymbolsuffix" depth="3" name="harmonicFieldSymbolSuffix" sig="harmonicFieldSymbolSuffix(sym: string): string | null" />

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L188" sourceLabel="breakdown-scales.js:188" />

Maps an internal chord symbol to its display suffix string, consistent with the notation used throughout the app. Used for both the Roman numeral suffix and the root-plus-quality label inside harmonic field pills.

Returns `null` for unrecognised symbols, signalling the pill renderer to fall back to an interval-only display.

**Parameters**

- `sym` (string) — Internal chord symbol (e.g. `'maj'`, `'m7b5'`, `'o7'`).

**Returns**

- `string | null` — Display suffix string, or `null` if unrecognised.

<MemberHeading
  id="harmonicfieldquality"
  depth="3"
  name="harmonicFieldQuality"
  sig="harmonicFieldQuality(
	third: number,
	fifth: number,
): Object | null"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L216" sourceLabel="breakdown-scales.js:216" />

Classifies a triad built on a scale degree from its third and fifth intervals. Returns a descriptor object used by `buildHarmonicField()` to determine the chord symbol, Roman numeral case, and quality suffix; returns `null` when the interval pair does not form a standard triad.

**Parameters**

- `third` (number) — Semitones from the degree root to the third (mod 12).
- `fifth` (number) — Semitones from the degree root to the fifth (mod 12).

**Returns**

- `Object | null`

<MemberHeading
  id="harmonicfieldseventh"
  depth="3"
  name="harmonicFieldSeventh"
  sig="harmonicFieldSeventh(
	third: number,
	fifth: number,
	seventh: number,
): string | null"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L235" sourceLabel="breakdown-scales.js:235" />

Classifies the seventh chord built on a scale degree from its third, fifth, and seventh intervals. Returns an internal chord symbol string when the combination matches a known seventh-chord type; returns `null` otherwise.

**Parameters**

- `third` (number) — Semitones from degree root to third (mod 12).
- `fifth` (number) — Semitones from degree root to fifth (mod 12).
- `seventh` (number) — Semitones from degree root to seventh (mod 12).

**Returns**

- `string | null` — Internal chord symbol (e.g. `'Maj7'`, `'m7b5'`, `'o7'`), or `null` if no match.

<MemberHeading
  id="buildharmonicfield"
  depth="3"
  name="buildHarmonicField"
  sig="buildHarmonicField(
	intervals: Array.<number>,
	rootMidi: number,
	sym: string,
): Array.<{roman: string, rootName: string, chordSym: (string|null)}>"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L261" sourceLabel="breakdown-scales.js:261" />

Builds the harmonic field for a scale — the set of chords obtained by stacking diatonic thirds on each scale degree. For heptatonic and larger scales, seventh chords are attempted first; triads are used as fallback. For pentatonic and hexatonic scales, only triads are attempted. Degrees that yield no standard chord structure are included with `chordSym: null` so the pill renders gracefully.

**Parameters**

- `intervals` (Array.\<number>) — Scale intervals array including the octave as the last entry (e.g. `[0, 2, 4, 5, 7, 9, 11, 12]`).
- `rootMidi` (number) — MIDI note number of the scale root.
- `sym` (string) — Scale symbol, used for enharmonic spelling of degree names.

**Returns**

- `Array.<{roman: string, rootName: string, chordSym: (string|null)}>` — One entry per scale degree (excluding the octave).

<MemberHeading
  id="makeharmonicfieldrow"
  depth="3"
  name="makeHarmonicFieldRow"
  sig="makeHarmonicFieldRow(
	panel: HTMLElement,
	intervals: Array.<number>,
	rootMidi: number,
	sym: string,
): void"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L357" sourceLabel="breakdown-scales.js:357" />

Renders the Harmonic Field collapsible row into the given panel element. Builds the field via `buildHarmonicField()`, then renders one pill per scale degree inside a collapsed `cs-section`. Each pill shows three lines: Roman numeral with quality suffix, root name with chord shorthand, and full quality name. Degrees with no recognisable chord (`chordSym: null`) render with just the Roman numeral and root name.

Rendered as a standard `breakdown-row` (label left, collapsible right) on all viewport sizes. Pills use `flex-wrap: wrap` and reflow naturally on narrow screens — no mobile-specific path is required.

**Parameters**

- `panel` (HTMLElement) — The element to render the row into.
- `intervals` (Array.\<number>) — Scale intervals array (includes octave as last entry).
- `rootMidi` (number) — MIDI note number of the scale root.
- `sym` (string) — Scale symbol, used for enharmonic spelling.

**Returns**

- `void`

<MemberHeading id="showbreakdownscales" depth="3" name="showBreakdownScales" sig="showBreakdownScales(panel: HTMLElement): void" />

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L475" sourceLabel="breakdown-scales.js:475" />

Renders the complete scales breakdown into the given panel element. Called by `showBreakdown()` in `breakdown.js` whenever the current mode is `'scales'`.

Renders the following rows and sub-collapsibles, in order:

- Name header (root + scale name)
- Notes (spelled note names in playback direction)
- Degrees (qualified Roman numerals)
- From root (interval abbreviations from root, direction-aware)
- Between notes (step intervals in playback direction)
- Steps (W/H/W+H step pattern — only when all steps reduce to W, H, or W+H)
- Triad map collapsible (heptatonic scales only)
- Character collapsible (when a `SCALE_CHARACTER` entry exists)
- Parent collapsible (when a `SCALE_MODAL_PARENT` entry exists)
- Harmonic field collapsible (all scales)

**Parameters**

- `panel` (HTMLElement) — The breakdown panel element to render into.

**Returns**

- `void`

## Other

<MemberHeading id="scalecharacter" depth="3" name="SCALE_CHARACTER" sig="SCALE_CHARACTER: Object.<string, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L38" sourceLabel="breakdown-scales.js:38" />

Modal character string for each scale symbol — a single-line mood and brightness description shown in the Character collapsible of the breakdown.

<MemberHeading id="scalemodalparent" depth="3" name="SCALE_MODAL_PARENT" sig="SCALE_MODAL_PARENT: Object.<string, {parent: string, degree: number}>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-scales-js/#L95" sourceLabel="breakdown-scales.js:95" />

Modal parent data for scales that are modes of a parent scale. Each entry provides the parent scale name and the scale degree at which this mode starts. Scales not listed here are treated as root / non-derived scales and receive no Parent collapsible in the breakdown.
