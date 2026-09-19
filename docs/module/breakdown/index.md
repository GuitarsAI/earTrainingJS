---
title: breakdown
kind: module
longname: module:breakdown
description: "Shared foundation for the post-answer breakdown panel in The Sound Travels Ear Training. Provides lookup tables, pure theory helpers, reusable DOM builders, chord-scales analysis, resolution state management, and the main showBreakdown() / hideBreakdown() entry points. Responsibilities: Lookup tables: SEMITONE_TO_NUMERAL , SEMITONE_TO_ROMAN , INTERVAL_ABBR , SCALE_REF Theory helpers: semitonesToNumeral() , semitoneToDegree() , intervalAbbr() , ordinal() DOM builders: makePill() , makeBDRow() , makeCSGroup() , makeNameHeader() , joinSep() Chord scales: getChordScales() , makeChordScalesRow() Resolution UI: resolutionActive , resolutionRootMidi , selectedResolution state; playResolution() , renderResolutionNotation() , updateResolveBtn() , getSourceMidi() , showCurrentView() Breakdown dispatcher: showBreakdown() , hideBreakdown() Out of scope for this file: Per-mode breakdown rendering → breakdown-intervals.js , breakdown-chords.js , breakdown-scales.js , breakdown-progressions.js Voice leading table, getResolutionInfo() , makeVoiceLeadingRow() → breakdown-chords.js _buildVoiceLeadingAnalysis() → chords-mode.js Load order: after voiceLeading.js , before breakdown-intervals.js ."
---

# breakdown

<SourceLink href="/source/breakdown/breakdown-js/#L33" label="breakdown.js:33" />

Shared foundation for the post-answer breakdown panel in The Sound Travels Ear Training. Provides lookup tables, pure theory helpers, reusable DOM builders, chord-scales analysis, resolution state management, and the main `showBreakdown()` / `hideBreakdown()` entry points.

Responsibilities:

- Lookup tables: `SEMITONE_TO_NUMERAL`, `SEMITONE_TO_ROMAN`, `INTERVAL_ABBR`, `SCALE_REF`
- Theory helpers: `semitonesToNumeral()`, `semitoneToDegree()`, `intervalAbbr()`, `ordinal()`
- DOM builders: `makePill()`, `makeBDRow()`, `makeCSGroup()`, `makeNameHeader()`, `joinSep()`
- Chord scales: `getChordScales()`, `makeChordScalesRow()`
- Resolution UI: `resolutionActive`, `resolutionRootMidi`, `selectedResolution` state; `playResolution()`, `renderResolutionNotation()`, `updateResolveBtn()`, `getSourceMidi()`, `showCurrentView()`
- Breakdown dispatcher: `showBreakdown()`, `hideBreakdown()`

Out of scope for this file:

- Per-mode breakdown rendering → `breakdown-intervals.js`, `breakdown-chords.js`, `breakdown-scales.js`, `breakdown-progressions.js`
- Voice leading table, `getResolutionInfo()`, `makeVoiceLeadingRow()` → `breakdown-chords.js`
- `_buildVoiceLeadingAnalysis()` → `chords-mode.js`

Load order: after `voiceLeading.js`, before `breakdown-intervals.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="semitonestonumeral" depth="3" name="semitonesToNumeral" sig="semitonesToNumeral(semitones: number, symbol?: string): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L55" sourceLabel="breakdown.js:55" />

Context-aware Roman numeral lookup. Resolves ambiguous semitone counts (tritone, augmented fifth, diminished seventh) to the correct degree label for the chord or scale in question using the symbol-keyed exception sets.

**Parameters**

- `semitones` (number) — Semitone interval from root (mod 12 applied internally).
- `symbol` (string, optional) — Optional chord/interval symbol for context-aware overrides.

**Returns**

- `string` — Roman numeral string (e.g. `'V'`, `'♭VII'`, `'♭V'`), or `'—'` if unmapped.

<MemberHeading id="ordinal" depth="3" name="ordinal" sig="ordinal(n: number): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L72" sourceLabel="breakdown.js:72" />

Returns the ordinal string for a positive integer (e.g. `1 → '1st'`, `4 → '4th'`). Used for inversion labels in the breakdown panel.

**Parameters**

- `n` (number) — Positive integer.

**Returns**

- `string` — Ordinal string.

<MemberHeading id="semitonetodegree" depth="3" name="semitoneToDegree" sig="semitoneToDegree(semi: number, quality: string): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L110" sourceLabel="breakdown.js:110" />

Returns the qualified Roman numeral for a semitone interval from the root. Used by `voiceLeading.js` to label chord degrees within a diatonic context.

**Parameters**

- `semi` (number) — Semitone interval from root (mod 12 applied internally).
- `quality` (string) — Chord quality: `'major'`|`'augmented'` → uppercase numeral; `'minor'`|`'diminished'` → lowercase numeral.

**Returns**

- `string` — Qualified Roman numeral (e.g. `'♭VII'`, `'iv'`, `'III'`), or `'?'` if unmapped.

<MemberHeading id="makepill" depth="3" name="makePill" sig="makePill(label: string | null, value: string): HTMLElement" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L126" sourceLabel="breakdown.js:126" />

Builds a labelled pill element for use in the breakdown panel.

**Parameters**

- `label` (string | null) — Left-side label text, or `null` to omit the label span.
- `value` (string) — Right-side value text.

**Returns**

- `HTMLElement` — A `div.breakdown-pill` element.

<MemberHeading id="intervalabbr" depth="3" name="intervalAbbr" sig="intervalAbbr(semitones: number, symbol?: string): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L165" sourceLabel="breakdown.js:165" />

Returns the interval abbreviation for a semitone count, with optional context-aware overrides for ambiguous intervals (tritone, augmented fifth, diminished seventh).

**Parameters**

- `semitones` (number) — Semitone distance (sign ignored; absolute value used).
- `symbol` (string, optional) — Optional chord symbol for context-aware overrides.

**Returns**

- `string` — Abbreviation string (e.g. `'M3'`, `'d5'`, `'A5'`).

<MemberHeading id="makebdrow" depth="3" name="makeBDRow" sig="makeBDRow(panel: HTMLElement, label: string, content: string)" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L182" sourceLabel="breakdown.js:182" />

Appends a key–value row to a breakdown panel element.

**Parameters**

- `panel` (HTMLElement) — The panel to append the row into.
- `label` (string) — Row label text (rendered as `span.breakdown-key`).
- `content` (string) — Row value HTML (rendered as `span.breakdown-val` via `innerHTML`).

<MemberHeading id="makecsgroup" depth="3" name="makeCSGroup" sig="makeCSGroup(label: string, open?: boolean): Object" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L205" sourceLabel="breakdown.js:205" />

Builds a collapsible group section using the existing `cs-section` / `cs-header` / `cs-body` / `cs-arrow` CSS classes. No new styles are required.

**Parameters**

- `label` (string) — Text shown on the toggle header.
- `open` (boolean, optional, default: false) — Whether the group starts expanded.

**Returns**

- `Object` — Append `section` to the panel; insert content rows into `body`.

<MemberHeading
  id="makenameheader"
  depth="3"
  name="makeNameHeader"
  sig="makeNameHeader(
	panel: HTMLElement,
	labelEl_or_text: string | HTMLElement,
): Object"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L247" sourceLabel="breakdown.js:247" />

Builds and appends a Level-1 collapsible name header to the panel. The header element is appended to `panel` immediately; all breakdown content should be inserted into the returned `body`.

**Parameters**

- `panel` (HTMLElement) — The panel to append the header and body into.
- `labelEl_or_text` (string | HTMLElement) — Either a plain string or a pre-built element to use as the header label.

**Returns**

- `Object` — The collapsible body element for content insertion.

<MemberHeading id="joinsep" depth="3" name="joinSep" sig="joinSep(arr: Array.<string>): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L291" sourceLabel="breakdown.js:291" />

Joins an array of HTML strings with an en-dash separator span between each element.

**Parameters**

- `arr` (Array.\<string>) — Array of HTML strings to join.

**Returns**

- `string` — Combined HTML string with `span.breakdown-sep` separators.

<MemberHeading
  id="getchordscales"
  depth="3"
  name="getChordScales"
  sig="getChordScales(
	rootPc: number,
	chordPcs: Set.<number>,
): Array.<{name: string, symbol: string, tag: string, note: string}>"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L355" sourceLabel="breakdown.js:355" />

Returns all scales from `SCALE_REF` that contain every pitch class in the chord.

**Parameters**

- `rootPc` (number) — Root pitch class of the chord (0–11).
- `chordPcs` (Set.\<number>) — Set of pitch classes present in the chord.

**Returns**

- `Array.<{name: string, symbol: string, tag: string, note: string}>` — Matching scale entries in `SCALE_REF` order.

<MemberHeading id="ismobile" depth="3" name="isMobile" sig="isMobile(): boolean" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L381" sourceLabel="breakdown.js:381" />

Returns `true` when the viewport is at or below the mobile breakpoint (≤ 600 px). Used to switch between the desktop `breakdown-row` layout and the full-width mobile stack layout for Chord Scales and Voice Leading rows.

**Returns**

- `boolean`

<MemberHeading
  id="makechordscalesrow"
  depth="3"
  name="makeChordScalesRow"
  sig="makeChordScalesRow(
	panel: HTMLElement,
	rootPc: number,
	chordPcs: Iterable.<number>,
)"
/>

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L393" sourceLabel="breakdown.js:393" />

Renders a collapsible Chord Scales sub-section into the breakdown panel. On mobile (≤ 600 px) renders a full-width stack; on desktop renders as a `breakdown-row` with the label on the left and the collapsible on the right. Each scale row is clickable and navigates to that scale in Dictionary mode.

**Parameters**

- `panel` (HTMLElement) — The breakdown panel to append into.
- `rootPc` (number) — Tonal centre pitch class (0–11).
- `chordPcs` (Iterable.\<number>) — Pitch classes of the chord to match.

<MemberHeading id="playresolution" depth="3" name="playResolution" sig="playResolution()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L532" sourceLabel="breakdown.js:532" />

Toggles between the chord view and the resolution view. On the first entry into resolution view, stores the resolution target root and plays audio (source chord → pause → resolution chord). Subsequent toggles silently swap notation only; audio plays exclusively when entering resolution view.

<MemberHeading id="getsourcemidi" depth="3" name="getSourceMidi" sig="getSourceMidi(): Array.<number>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L580" sourceLabel="breakdown.js:580" />

Returns the source MIDI note array for the currently displayed chord, handling all chord families (polychord, UST, slash, standard).

**Returns**

- `Array.<number>` — Array of MIDI note numbers for the source chord.

<MemberHeading id="updateresolvebtn" depth="3" name="updateResolveBtn" sig="updateResolveBtn()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L591" sourceLabel="breakdown.js:591" />

Syncs the Resolve button label with the current `resolutionActive` state: `'Resolve →'` when in chord view; `'← Chord'` when in resolution view.

<MemberHeading id="showcurrentview" depth="3" name="showCurrentView" sig="showCurrentView()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L600" sourceLabel="breakdown.js:600" />

Dispatches to the correct notation view based on `resolutionActive`: renders resolution notation when active, chord notation otherwise.

<MemberHeading id="renderresolutionnotation" depth="3" name="renderResolutionNotation" sig="renderResolutionNotation()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L611" sourceLabel="breakdown.js:611" />

Renders a two-chord grand-staff layout (source chord | barline | resolution chord) into `#notation-svg`. Fully derived from current app state on every call — no cached arguments — so voicing changes are always reflected. Honours `chordKeySigMode` (Key / C chip) for accidental rendering on both staves.

<MemberHeading id="qualityfullname" depth="3" name="qualityFullName" sig="qualityFullName(sym: string): string" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L816" sourceLabel="breakdown.js:816" />

Maps a chord symbol to its full English quality name for use in breakdown labels. Falls back to the symbol itself for any unrecognised entry.

**Parameters**

- `sym` (string) — Chord symbol (e.g. `'maj7'`, `'m7b5'`).

**Returns**

- `string` — Full quality name (e.g. `'major 7th'`, `'half-diminished (ø7)'`).

<MemberHeading id="showbreakdown" depth="3" name="showBreakdown" sig="showBreakdown()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L838" sourceLabel="breakdown.js:838" />

Main breakdown dispatcher. Lazily builds the voice leading analysis if not yet computed, clears the panel, then delegates to the correct per-mode renderer: `showBreakdownIntervals`, `showBreakdownScales`, `showBreakdownProgressions`, or `showBreakdownChords`.

<MemberHeading id="hidebreakdown" depth="3" name="hideBreakdown" sig="hideBreakdown()" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L862" sourceLabel="breakdown.js:862" />

Hides and clears the breakdown panel and its wrapper element. Called when the user dismisses the breakdown or a new question is generated.

## Instance Fields

<MemberHeading id="resolutionactive" depth="3" name="resolutionActive" sig="resolutionActive: boolean" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L506" sourceLabel="breakdown.js:506" />

Whether the resolution view is currently active for the displayed chord.

<MemberHeading id="resolutionrootmidi" depth="3" name="resolutionRootMidi" sig="resolutionRootMidi: number | null" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L515" sourceLabel="breakdown.js:515" />

MIDI note number of the resolution target root. Stored once when the user first triggers resolution — derived from the full chord at answer time and never re-derived mid-session so that voicing changes do not shift the target root.

<MemberHeading id="selectedresolution" depth="3" name="selectedResolution" sig="selectedResolution: Object | null" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L524" sourceLabel="breakdown.js:524" />

User-selected resolution from the Voice Leading panel. `null` means use the default (first context / first resolution). Set when the user taps a resolution card; cleared on every new chord.

## Other

<MemberHeading id="breakdownbreakdownjs" depth="3" name="breakdown/breakdown.js" sig="breakdown/breakdown.js" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L870" sourceLabel="breakdown.js:870" />

breakdown.js — End of file.

- **License:** MIT
- **Copyright:** The Sound Travels 2026

<MemberHeading id="semitonetonumeral" depth="3" name="SEMITONE_TO_NUMERAL" sig="SEMITONE_TO_NUMERAL: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L41" sourceLabel="breakdown.js:41" />

Semitone offset → Roman numeral string. Covers simple (0–11) and compound (12–21) intervals. Used by `semitonesToNumeral()` for interval degree and chord interval labels.

<MemberHeading id="semitonetoroman" depth="3" name="SEMITONE_TO_ROMAN" sig="SEMITONE_TO_ROMAN: Object.<number, {roman: string, prefix: string}>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L86" sourceLabel="breakdown.js:86" />

Maps semitones-from-root (0–11) to a qualified Roman numeral descriptor. Each entry carries the base numeral and an accidental prefix. Reference: major scale degrees 0=I, 2=II, 4=III, 5=IV, 7=V, 9=VI, 11=VII. Chromatic deviations receive a ♭ or ♯ prefix; the numeral reflects the closest diatonic position. Case (upper/lower) is applied by `semitoneToDegree()`.

<MemberHeading id="intervalabbr" depth="3" name="INTERVAL_ABBR" sig="INTERVAL_ABBR: Object.<number, string>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L152" sourceLabel="breakdown.js:152" />

Semitone count → interval abbreviation string, always ascending. Covers simple (0–12) and compound (13–21) intervals. Used by `intervalAbbr()` as its primary lookup table.

<MemberHeading id="scaleref" depth="3" name="SCALE_REF" sig="SCALE_REF: Array.<{name: string, symbol: string, pcs: Set.<number>, tag: string, note: string}>" />

<MemberMeta sourceHref="/source/breakdown/breakdown-js/#L306" sourceLabel="breakdown.js:306" />

Reference list of every scale tested by `getChordScales()`. Built once at load time from the `SCALES` array (octave note stripped). Each entry stores the scale's pitch classes as a `Set` of mod-12 intervals from root, plus display metadata.
