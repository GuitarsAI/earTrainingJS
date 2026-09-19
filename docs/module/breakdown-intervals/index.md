---
title: breakdown-intervals
kind: module
longname: module:breakdown-intervals
description: "Intervals branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders interval name, semitone count, scale degree, consonance classification, inversion / simple-equivalent, and common musical context. Responsibilities: Lookup tables: INTERVAL_CONSONANCE , INTERVAL_CONTEXT , INTERVAL_INVERSION_SEMITONES , INTERVAL_INVERSION_NAME Helper: tritoneLabel() Renderer: showBreakdownIntervals() Dependencies (globals from earlier layers): makeNameHeader , makeBDRow , joinSep , SEMITONE_TO_NUMERAL , INTERVAL_ABBR , intervalAbbr , semitonesToNumeral , spelledRoot , spelledNote , TRITONE_AS_D5 , EIGHT_AS_A5 , NINE_AS_D7 , currentMode , currentInterval , currentIntervalMidi , currentIntervalStyle Load order: after breakdown.js , before breakdown-chords.js ."
---

# breakdown-intervals

<SourceLink href="/source/breakdown/breakdown-intervals-js/#L27" label="breakdown-intervals.js:27" />

Intervals branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders interval name, semitone count, scale degree, consonance classification, inversion / simple-equivalent, and common musical context.

Responsibilities:

- Lookup tables: `INTERVAL_CONSONANCE`, `INTERVAL_CONTEXT`, `INTERVAL_INVERSION_SEMITONES`, `INTERVAL_INVERSION_NAME`
- Helper: `tritoneLabel()`
- Renderer: `showBreakdownIntervals()`

Dependencies (globals from earlier layers): `makeNameHeader`, `makeBDRow`, `joinSep`, `SEMITONE_TO_NUMERAL`, `INTERVAL_ABBR`, `intervalAbbr`, `semitonesToNumeral`, `spelledRoot`, `spelledNote`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`, `currentMode`, `currentInterval`, `currentIntervalMidi`, `currentIntervalStyle`

Load order: after `breakdown.js`, before `breakdown-chords.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="tritonelabel" depth="3" name="tritoneLabel" sig="tritoneLabel(style: string): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L102" sourceLabel="breakdown-intervals.js:102" />

Returns the context-aware tritone label for the breakdown name header. Descending playback resolves the ambiguity toward d5; harmonic (simultaneous) playback shows both spellings; ascending (default) shows A4.

**Parameters**

- `style` (string) — Playback style: `'ascending'` | `'descending'` | `'harmonic'`.

**Returns**

- `string` — Tritone label: `'A4'`, `'d5'`, or `'A4 / d5'`.

<MemberHeading id="showbreakdownintervals" depth="3" name="showBreakdownIntervals" sig="showBreakdownIntervals(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L117" sourceLabel="breakdown-intervals.js:117" />

Renders the intervals breakdown into the given panel element. Builds a collapsible section showing interval name, semitone count, scale degree numeral, consonance classification, inversion / simple-equivalent (for compound intervals), and common musical context. Context strings for enharmonically ambiguous intervals (semitones 6, 8, 9) are overridden based on the active chord symbol.

**Parameters**

- `panel` (HTMLElement) — The breakdown panel element to render into.

## Other

<MemberHeading id="breakdownbreakdown-intervalsjs" depth="3" name="breakdown/breakdown-intervals.js" sig="breakdown/breakdown-intervals.js" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L170" sourceLabel="breakdown-intervals.js:170" />

breakdown-intervals.js — End of file.

- **License:** MIT
- **Copyright:** The Sound Travels 2026

<MemberHeading id="intervalconsonance" depth="3" name="INTERVAL_CONSONANCE" sig="INTERVAL_CONSONANCE: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L33" sourceLabel="breakdown-intervals.js:33" />

Consonance classification keyed by semitone count. Covers simple (0–12) and compound (13–21) intervals; compound intervals inherit their simple-interval quality.

<MemberHeading id="intervalcontext" depth="3" name="INTERVAL_CONTEXT" sig="INTERVAL_CONTEXT: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L49" sourceLabel="breakdown-intervals.js:49" />

Common musical context string keyed by semitone count. Covers simple (1–12) and compound (13–21) intervals. Overridden at render time for enharmonically ambiguous intervals (semitones 6, 8, 9) when the chord symbol requires a specific spelling.

<MemberHeading id="intervalinversionsemitones" depth="3" name="INTERVAL_INVERSION_SEMITONES" sig="INTERVAL_INVERSION_SEMITONES: Object.<number, number>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L78" sourceLabel="breakdown-intervals.js:78" />

Maps a simple interval (semitones 1–12) to the semitone count of its complementary inversion — the interval that, combined with it, sums to P8 (12 st). Pairs: m2↔M7, M2↔m7, m3↔M6, M3↔m6, P4↔P5, TT↔TT.

<MemberHeading id="intervalinversionname" depth="3" name="INTERVAL_INVERSION_NAME" sig="INTERVAL_INVERSION_NAME: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-intervals-js/#L88" sourceLabel="breakdown-intervals.js:88" />

Display name of the complementary inversion interval, keyed by the source interval's semitone count (1–12). Used alongside `INTERVAL_INVERSION_SEMITONES`.
