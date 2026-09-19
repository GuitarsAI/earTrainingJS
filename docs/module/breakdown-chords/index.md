---
title: breakdown-chords
kind: module
longname: module:breakdown-chords
description: "Chords branch of the post-answer breakdown panel for The Sound Travels Ear Training. Handles all four chord families — polychords, UST, slash, and regular chords — and owns the complete voice leading and resolution rendering pipeline. Responsibilities: Lookup tables: RESOLUTION_TARGETS , VL_INTERVAL_NAMES VL helpers: vlRoleLabel() , buildResolutionMidi() , getResolutionInfo() , computeVoiceLeading() , makeVoiceLeadingRow() Theory helpers: computeRiemannRelations() , computeTritoneSubInfo() , computeDimEnharmonics() , computeDimDomSubs() , computeAugEnharmonics() , computeHalfDimContext() , computeSusResolution() DOM builders: makeRiemannRow() , figuredBass() , nameChordFromIntervals() Renderer: showBreakdownChords() Cross-cutting resolution state ( resolutionActive , selectedResolution , playResolution , etc.) lives in breakdown.js — those symbols are shared with the audio and notation paths. Dependencies (globals from earlier layers): makeNameHeader , makeBDRow , makeCSGroup , makeChordScalesRow , joinSep , intervalAbbr , semitonesToNumeral , qualityFullName , makePill , SEMITONE_TO_ROMAN , INTERVAL_ABBR , spelledRoot , spelledNote , pcInterval , VOICING_MODES , TRITONE_AS_D5 , EIGHT_AS_A5 , NINE_AS_D7 , currentChord , currentChordRootMidi , currentMidiNotes , currentVoicingMode , currentPolyUpperRootMidi , currentPolyLowerRootMidi , currentPolyUpperMidi , currentPolyLowerMidi , currentUSTRootMidi , currentUSTShellMidi , currentUSTUpperMidi , currentSlashBassMidi , currentUpperRootMidi , dictInversionIndex , getPolyChordLabel , getUSTLabel , getSlashResolvedName , getChordRootName , polyQualitySuffix , polyQualityFull , switchMode , dictSymbol , setAppMode Load order: after breakdown-intervals.js , before breakdown-scales.js ."
---

# breakdown-chords

<SourceLink href="/source/breakdown/breakdown-chords-js/#L44" label="breakdown-chords.js:44" />

Chords branch of the post-answer breakdown panel for The Sound Travels Ear Training. Handles all four chord families — polychords, UST, slash, and regular chords — and owns the complete voice leading and resolution rendering pipeline.

Responsibilities:

- Lookup tables: `RESOLUTION_TARGETS`, `VL_INTERVAL_NAMES`
- VL helpers: `vlRoleLabel()`, `buildResolutionMidi()`, `getResolutionInfo()`, `computeVoiceLeading()`, `makeVoiceLeadingRow()`
- Theory helpers: `computeRiemannRelations()`, `computeTritoneSubInfo()`, `computeDimEnharmonics()`, `computeDimDomSubs()`, `computeAugEnharmonics()`, `computeHalfDimContext()`, `computeSusResolution()`
- DOM builders: `makeRiemannRow()`, `figuredBass()`, `nameChordFromIntervals()`
- Renderer: `showBreakdownChords()`

Cross-cutting resolution state (`resolutionActive`, `selectedResolution`, `playResolution`, etc.) lives in `breakdown.js` — those symbols are shared with the audio and notation paths.

Dependencies (globals from earlier layers): `makeNameHeader`, `makeBDRow`, `makeCSGroup`, `makeChordScalesRow`, `joinSep`, `intervalAbbr`, `semitonesToNumeral`, `qualityFullName`, `makePill`, `SEMITONE_TO_ROMAN`, `INTERVAL_ABBR`, `spelledRoot`, `spelledNote`, `pcInterval`, `VOICING_MODES`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`, `currentChord`, `currentChordRootMidi`, `currentMidiNotes`, `currentVoicingMode`, `currentPolyUpperRootMidi`, `currentPolyLowerRootMidi`, `currentPolyUpperMidi`, `currentPolyLowerMidi`, `currentUSTRootMidi`, `currentUSTShellMidi`, `currentUSTUpperMidi`, `currentSlashBassMidi`, `currentUpperRootMidi`, `dictInversionIndex`, `getPolyChordLabel`, `getUSTLabel`, `getSlashResolvedName`, `getChordRootName`, `polyQualitySuffix`, `polyQualityFull`, `switchMode`, `dictSymbol`, `setAppMode`

Load order: after `breakdown-intervals.js`, before `breakdown-scales.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="vlrolelabel" depth="3" name="vlRoleLabel" sig="vlRoleLabel(semiFromRoot: number): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L167" sourceLabel="breakdown-chords.js:167" />

Returns the harmonic role label for a source note, based on its semitone distance above the chord root. Used in the voice leading table to annotate each departing voice.

**Parameters**

- `semiFromRoot` (number) — Semitone interval from the chord root (mod 12 applied internally).

**Returns**

- `string` — Role label (e.g. `'root'`, `'3rd'`, `'♭7th'`), or `''` if unmapped.

<MemberHeading
  id="buildresolutionmidi"
  depth="3"
  name="buildResolutionMidi"
  sig="buildResolutionMidi(
	targetRootMidi: number,
	quality: string,
): Array.<number>"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L186" sourceLabel="breakdown-chords.js:186" />

Builds a close-position MIDI note array for a resolution target chord. Used by `getResolutionInfo()` and the voice leading fallback path when pre-computed voice leading moves are unavailable.

**Parameters**

- `targetRootMidi` (number) — MIDI note number of the target chord root.
- `quality` (string) — Target chord quality: `'maj'` | `'min'` | `'dom7'` | `'maj7'` | `'m7'`.

**Returns**

- `Array.<number>` — Sorted array of MIDI note numbers for the target chord.

<MemberHeading id="getresolutioninfo" depth="3" name="getResolutionInfo" sig="getResolutionInfo()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L207" sourceLabel="breakdown-chords.js:207" />

Returns the resolution target for the currently displayed chord. Consults sources in priority order: (1) user-selected resolution from the Voice Leading panel, (2) family-specific logic for poly / UST / slash chords, (3) the primary context from `currentVoiceLeadingAnalysis` (Pass 1 engine), (4) `RESOLUTION_TARGETS` fallback table. Returns `null` if no valid target can be determined.

**Returns**

-

<MemberHeading
  id="computevoiceleading"
  depth="3"
  name="computeVoiceLeading"
  sig="computeVoiceLeading(
	sourceMidi: Array.<number>,
	targetMidi: Array.<number>,
): Array.<{fromName: string, toName: string, dir: string, absSemi: number, intervalName: string, role: string, isCommonTone: boolean}>"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L337" sourceLabel="breakdown-chords.js:337" />

Computes voice leading moves from a source chord to a target chord. Uses the rule-based engine (`computeVoiceLeadingRules()` from `voiceLeading.js`) when a harmonic context is cached; falls back to a proximity search otherwise.

**Parameters**

- `sourceMidi` (Array.\<number>) — MIDI notes of the source chord.
- `targetMidi` (Array.\<number>) — MIDI notes of the target chord.

**Returns**

- `Array.<{fromName: string, toName: string, dir: string, absSemi: number, intervalName: string, role: string, isCommonTone: boolean}>`

<MemberHeading id="makevoiceleadingrow" depth="3" name="makeVoiceLeadingRow" sig="makeVoiceLeadingRow(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L425" sourceLabel="breakdown-chords.js:425" />

Renders the Voice Leading sub-section into the given panel element.

When `currentVoiceLeadingAnalysis` is populated and non-ambiguous, renders one collapsible `cs-section` per harmonic context, each containing:

- Header: Roman numeral · scale name · function label · tension dots
- Body: one selectable sub-section per resolution / departure target with a `vl-table`

Falls back to a single-resolution display for ambiguous chord families (aug, sus, poly, UST, slash) or when the analysis cache is unavailable.

Mobile and desktop paths are structurally separate: mobile renders a full-width stack; desktop renders a `breakdown-row` with the label on the left.

**Parameters**

- `panel` (HTMLElement) — The element to render the voice leading section into.

<MemberHeading
  id="computeriemannrelations"
  depth="3"
  name="computeRiemannRelations"
  sig="computeRiemannRelations(
	rootPc: number,
	quality: string,
	sym: string,
): Object"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L928" sourceLabel="breakdown-chords.js:928" />

Computes the four Riemannian neo-tonal transformations for a major or minor triad. Each transformation produces a related chord by moving one or two voices by a semitone while flipping the chord quality (major ↔ minor).

**Parameters**

- `rootPc` (number) — Root pitch class of the chord (0–11).
- `quality` (string) — Chord quality: `'major'` | `'minor'`.
- `sym` (string) — Chord symbol, used for enharmonic note spelling.

**Returns**

- `Object` — Each value is `{ letter, full, desc, chord }` where `chord` is the display name (e.g. `'Am'`).

## Other

<MemberHeading id="vlintervalnames" depth="3" name="VL_INTERVAL_NAMES" sig="VL_INTERVAL_NAMES: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-chords-js/#L155" sourceLabel="breakdown-chords.js:155" />

Semitone count → interval name string for voice leading move labels (ascending). Used by `computeVoiceLeading()` and `buildVLTable()` to label each voice's motion.
