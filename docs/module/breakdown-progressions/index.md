---
title: breakdown-progressions
kind: module
longname: module:breakdown-progressions
description: "Progressions branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders per-chord theory information for each step in the current progression — degree label, chord name, notes, intervals from root, harmonic function, and chord scales — as a series of collapsible sections inside the shared breakdown panel. Responsibilities: Lookup table: HARMONIC_FUNCTION Theory helper: progFunctionNote() Renderer: showBreakdownProgressions() Dependencies (globals from earlier layers): makeNameHeader , makeBDRow , makeChordScalesRow , joinSep , intervalAbbr , qualityFullName , spelledRoot , spelledNote , currentProgression , currentProgRootPc , currentProgRootMidi , PROG_DEGREES , PROG_QUALITIES , progChordMidi , CHORD_TYPES Load order: after breakdown-scales.js , before stats.js ."
---

# breakdown-progressions

<SourceLink href="/source/breakdown/breakdown-progressions-js/#L28" label="breakdown-progressions.js:28" />

Progressions branch of the post-answer breakdown panel for The Sound Travels Ear Training. Renders per-chord theory information for each step in the current progression — degree label, chord name, notes, intervals from root, harmonic function, and chord scales — as a series of collapsible sections inside the shared breakdown panel.

Responsibilities:

- Lookup table: `HARMONIC_FUNCTION`
- Theory helper: `progFunctionNote()`
- Renderer: `showBreakdownProgressions()`

Dependencies (globals from earlier layers): `makeNameHeader`, `makeBDRow`, `makeChordScalesRow`, `joinSep`, `intervalAbbr`, `qualityFullName`, `spelledRoot`, `spelledNote`, `currentProgression`, `currentProgRootPc`, `currentProgRootMidi`, `PROG_DEGREES`, `PROG_QUALITIES`, `progChordMidi`, `CHORD_TYPES`

Load order: after `breakdown-scales.js`, before `stats.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading
  id="progfunctionnote"
  depth="3"
  name="progFunctionNote"
  sig="progFunctionNote(
	degSemis: number,
	qualSym: string,
): string | null"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-progressions-js/#L127" sourceLabel="breakdown-progressions.js:127" />

Returns the harmonic function description string for a chord within a progression. Looks up the degree semitone offset in `HARMONIC_FUNCTION`, then tries the quality-specific override before falling back to `'default'`.

**Parameters**

- `degSemis` (number) — Semitone offset of the scale degree from the tonic (0–11).
- `qualSym` (string) — Internal chord quality symbol (e.g. `'m'`, `'7'`, `'maj7'`).

**Returns**

- `string | null` — Harmonic function description, or `null` if the degree has no entry in `HARMONIC_FUNCTION`.

<MemberHeading id="showbreakdownprogressions" depth="3" name="showBreakdownProgressions" sig="showBreakdownProgressions(panel: HTMLElement): void" />

<MemberMeta sourceHref="/source/breakdown/breakdown-progressions-js/#L154" sourceLabel="breakdown-progressions.js:154" />

Renders the complete progressions breakdown into the given panel element. Called by `showBreakdown()` in `breakdown.js` whenever the current mode is `'progressions'`.

Renders a name header (progression symbol + name), then one collapsible `cs-section` per chord in the progression. Each chord section contains:

- Notes (spelled note names)
- From root (interval abbreviations from the chord root)
- Function (harmonic function description from `HARMONIC_FUNCTION`)
- Chord scales (via `makeChordScalesRow()`, already mobile-aware)

The renderer uses `cs-section` collapsibles directly inside `progBody` with no outer `breakdown-row` wrapper, so all content is full-width on every viewport size. No mobile-specific path is required.

**Parameters**

- `panel` (HTMLElement) — The breakdown panel element to render into.

**Returns**

- `void`

## Other

<MemberHeading id="harmonicfunction" depth="3" name="HARMONIC_FUNCTION" sig="HARMONIC_FUNCTION" />

<MemberMeta sourceHref="/source/breakdown/breakdown-progressions-js/#L48" sourceLabel="breakdown-progressions.js:48" />

Harmonic function descriptions keyed first by semitone offset from the tonic (0–11), then by chord quality symbol. Each bucket must contain a `'default'` entry used as the fallback when no quality-specific override exists.

Entry shape per degree:

```
{
  default: string,          // shown when no quality match is found
  [qualSym: string]: string // override for a specific quality (e.g. 'm', '7', 'maj7')
}
```

Quality symbol keys match the internal chord symbol strings used throughout the app (e.g. `'m'`, `'7'`, `'maj7'`, `'m7'`, `'m7b5'`, `'dim'`, `'o7'`).
