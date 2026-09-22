---
title: voicings
kind: module
longname: module:voicings
description: "Voicing system for Chords mode. Owns the complete voicing data table ( VOICING_MODES ) and all voicing algorithms. applyVoicing() is the main dispatcher that transforms a chord's base intervals into a concrete MIDI note array for a given voicing style. resolveVoicingMode() picks one concrete mode for a question from the user's selection or active setting. Groups and counts (post-cleanup): Group 1 — Position (3): close, open, spread Group 2 — Doubling (4): dbl_root_oct, dbl_root_above5, dbl_fifth, dbl_root_wrap Group 3 — Shell (12): shell, shell_alt, shell_rootless, tn_maj_135, tn_maj_357, tn_maj_137, tn_dom_13b7, tn_dom_35b7, tn_dom_3b79, tn_min_1b3b7, tn_min_b35b7, tn_min_b3b79 Group 4 — Drop (4): drop2, drop3, drop24, drop23 Group 5 — Intervallic (0): removed — all 7 members fabricated non-chord tones by design Group 6 — Style (13): oct_bass_triad, oct_bass_7th, open5_triad, block_close, block_locked, four_way_close, block_drop2, oct_melody_inner, pedal_point, spread_2h, evans_a, evans_b, kenny_barron Total: 36 entries Responsibilities: VOICING_MODES — data table for all voicings VOICING_REQUIREMENTS — per-symbol required harmonic roles for UI gating applyVoicing() — main dispatcher; returns a sorted MIDI note array resolveVoicingMode() — picks one concrete mode from selectedVoicings or activeVoicingMode voicingAppliesToChord() — UI-gating helper; returns false if required roles are absent Key design patterns: Rule: a voicing may only output notes derivable from baseIntervals . No fabricated tones, no ?? fallback that invents a note the chord doesn't contain. Every Group 3/6 voicing that requires a role (seventh, third, fifth) checks for its presence first and falls back to applyVoicing(…, 'close') when it is absent. VOICING_REQUIREMENTS mirrors those role checks as a lookup table for the UI, so voicingAppliesToChord() can grey out inapplicable chips without running applyVoicing() . Keep this table in sync whenever cases are added, removed, or their role checks are changed. For fifth -requiring voicings ( oct_bass_triad , open5_triad , spread_2h ), altfifth (dim/aug 5th) satisfies the requirement — both voicingAppliesToChord() and the corresponding applyVoicing() cases accept either role. Group 4 drop voicings are intentionally absent from VOICING_REQUIREMENTS : they degrade gracefully to a wide triad spacing, which is a legitimate texture. Group 5 Intervallic has been removed entirely — those voicings stacked free intervals and intentionally produced non-chord tones. Their chord identities have been promoted to chords.js entries instead. Out of scope for this file: Voicing chip rendering → js/ui/pool-chords.js Per-question resolved state ( currentVoicingMode ) → js/engine/helpers.js User selection state ( activeVoicingMode , selectedVoicings ) → js/engine/state.js UI gating (greying chips) → js/ui/pool-chords.js (uses voicingAppliesToChord() ) Voicing reset on chord change → js/app.js Load order: after helpers.js , before audio.js ."
---

# voicings

<SourceLink href="/source/engine/voicings-js/#L63" label="voicings.js:63" />

Voicing system for Chords mode. Owns the complete voicing data table (`VOICING_MODES`) and all voicing algorithms. `applyVoicing()` is the main dispatcher that transforms a chord's base intervals into a concrete MIDI note array for a given voicing style. `resolveVoicingMode()` picks one concrete mode for a question from the user's selection or active setting.

Groups and counts (post-cleanup): Group 1 — Position (3): close, open, spread Group 2 — Doubling (4): dbl\_root\_oct, dbl\_root\_above5, dbl\_fifth, dbl\_root\_wrap Group 3 — Shell (12): shell, shell\_alt, shell\_rootless, tn\_maj\_135, tn\_maj\_357, tn\_maj\_137, tn\_dom\_13b7, tn\_dom\_35b7, tn\_dom\_3b79, tn\_min\_1b3b7, tn\_min\_b35b7, tn\_min\_b3b79 Group 4 — Drop (4): drop2, drop3, drop24, drop23 Group 5 — Intervallic (0): removed — all 7 members fabricated non-chord tones by design Group 6 — Style (13): oct\_bass\_triad, oct\_bass\_7th, open5\_triad, block\_close, block\_locked, four\_way\_close, block\_drop2, oct\_melody\_inner, pedal\_point, spread\_2h, evans\_a, evans\_b, kenny\_barron Total: 36 entries

Responsibilities:

- `VOICING_MODES` — data table for all voicings
- `VOICING_REQUIREMENTS` — per-symbol required harmonic roles for UI gating
- `applyVoicing()` — main dispatcher; returns a sorted MIDI note array
- `resolveVoicingMode()` — picks one concrete mode from selectedVoicings or activeVoicingMode
- `voicingAppliesToChord()` — UI-gating helper; returns false if required roles are absent

Key design patterns:

- Rule: a voicing may only output notes derivable from `baseIntervals`. No fabricated tones, no `?? fallback` that invents a note the chord doesn't contain.
- Every Group 3/6 voicing that requires a role (seventh, third, fifth) checks for its presence first and falls back to `applyVoicing(…, 'close')` when it is absent.
- `VOICING_REQUIREMENTS` mirrors those role checks as a lookup table for the UI, so `voicingAppliesToChord()` can grey out inapplicable chips without running `applyVoicing()`. Keep this table in sync whenever cases are added, removed, or their role checks are changed.
- For `fifth`-requiring voicings (`oct_bass_triad`, `open5_triad`, `spread_2h`), `altfifth` (dim/aug 5th) satisfies the requirement — both `voicingAppliesToChord()` and the corresponding `applyVoicing()` cases accept either role.
- Group 4 drop voicings are intentionally absent from `VOICING_REQUIREMENTS`: they degrade gracefully to a wide triad spacing, which is a legitimate texture.
- Group 5 Intervallic has been removed entirely — those voicings stacked free intervals and intentionally produced non-chord tones. Their chord identities have been promoted to `chords.js` entries instead.

Out of scope for this file:

- Voicing chip rendering → `js/ui/pool-chords.js`
- Per-question resolved state (`currentVoicingMode`) → `js/engine/helpers.js`
- User selection state (`activeVoicingMode`, `selectedVoicings`) → `js/engine/state.js`
- UI gating (greying chips) → `js/ui/pool-chords.js` (uses `voicingAppliesToChord()`)
- Voicing reset on chord change → `js/app.js`

Load order: after `helpers.js`, before `audio.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading
  id="voicingappliestochord"
  depth="3"
  name="voicingAppliesToChord"
  sig="voicingAppliesToChord(
	symbol: string,
	baseIntervals: Array.<number>,
): boolean"
/>

<MemberMeta sourceHref="/source/engine/voicings-js/#L233" sourceLabel="voicings.js:233" />

Returns `true` if `symbol` is structurally meaningful for a chord with the given `baseIntervals` — i.e. every role it requires (per `VOICING_REQUIREMENTS`) is present in the chord.

Symbols with no entry in `VOICING_REQUIREMENTS` are always applicable.

Used by `pool-chords.js` to grey out chips in dictionary mode and the post-answer single-select voicing panel. This is a UI-honesty layer on top of, not a replacement for, the `applyVoicing()` fallback-to-close safety net.

For `oct_bass_triad`, `open5_triad`, and `spread_2h`, a `'fifth'` requirement is satisfied by either `'fifth'` or `'altfifth'` in the chord's roles — matching the behaviour of those voicings' `applyVoicing()` cases.

**Parameters**

- `symbol` (string) — Voicing symbol to test.
- `baseIntervals` (Array.\<number>) — Semitone intervals from root for the active chord.

**Returns**

- `boolean` — `true` if the voicing applies; `false` if a required role is absent.

<MemberHeading id="voicingroles" depth="3" name="_voicingRoles" sig="_voicingRoles(baseIntervals: Array.<number>): Array.<string>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L269" sourceLabel="voicings.js:269" />

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

<MemberMeta sourceHref="/source/engine/voicings-js/#L289" sourceLabel="voicings.js:289" />

Extracts MIDI notes matching specific harmonic roles from a chord's base intervals.

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `baseIntervals` (Array.\<number>) — Semitone intervals from root.
- `roles` (Array.\<string>) — Role labels to include, e.g. `['root', 'third', 'seventh']`.

**Returns**

- `Array.<number>` — MIDI notes for the matching intervals (unsorted).

<MemberHeading id="pc" depth="3" name="_pc" sig="_pc(midi: number, rootMidi: number): number" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L303" sourceLabel="voicings.js:303" />

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

<MemberMeta sourceHref="/source/engine/voicings-js/#L314" sourceLabel="voicings.js:314" />

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

<MemberMeta sourceHref="/source/engine/voicings-js/#L329" sourceLabel="voicings.js:329" />

Builds a MIDI note from a semitone offset relative to `rootMidi`, clamped to a 2-octave window starting at `targetLoMidi`.

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `semitones` (number) — Interval in semitones above the root.
- `targetLoMidi` (number) — Lower bound of the target register.

**Returns**

- `number` — MIDI note number within `[targetLoMidi, targetLoMidi + 23]`.

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

<MemberMeta sourceHref="/source/engine/voicings-js/#L356" sourceLabel="voicings.js:356" />

Transforms a chord's root and base intervals into a concrete MIDI note array using the specified voicing algorithm.

This is the single entry point for all voicing computation. Every voicing mode in `VOICING_MODES` has a corresponding case here. The function is also called recursively by some cases that fall back to simpler modes (e.g. shell voicings fall back to `'close'` for triads that have no 7th).

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `baseIntervals` (Array.\<number>) — Semitone intervals from root (root = 0 always present).
- `mode` (string) — Voicing symbol string (already resolved; never `'random'`).

**Returns**

- `Array.<number>` — Sorted MIDI note array (ascending pitch). Never empty — falls back to close position on any error or unrecognised mode.

<MemberHeading id="resolvevoicingmode" depth="3" name="resolveVoicingMode" sig="resolveVoicingMode(): string" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L937" sourceLabel="voicings.js:937" />

Picks one concrete voicing symbol for the current question.

Resolution rules:

- **Quiz mode:** picks randomly from `selectedVoicings` (the user's chip selection), filtering out `'random'` and, in Basic mode, any advanced voicing symbols. Falls back to `'close'` if the filtered pool is empty.
- **Dictionary mode with `activeVoicingMode === 'random'`:** picks randomly from all concrete symbols (Basic mode: position + doubling groups only; Advanced mode: all concrete symbols).
- **Dictionary mode with a concrete `activeVoicingMode`:** returns it directly (single-select chip; already concrete).

Basic mode voicing symbols are limited to position and doubling groups. Advanced voicings (shell, drop, style) are only available when `appDifficulty === 'advanced'`.

**Returns**

- `string` — A concrete voicing symbol, never `'random'`.

## Other

<MemberHeading id="voicingmode" depth="3" name="VoicingMode" sig="VoicingMode: Object" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L78" sourceLabel="voicings.js:78" />

Complete catalogue of all voicing modes available in the app. 36 entries across 5 active groups (Group 5 Intervallic removed).

Each entry:

**Properties**

- `group` (string) — Group key: `'position'` | `'doubling'` | `'shell'` | `'drop'` | `'style'`
- `name` (string) — Human-readable display name shown in UI chips.
- `symbol` (string) — Unique identifier used as the key throughout the app. Never `'random'` — that is a UI meta-value only.
- `desc` (string) — One-line description shown in chip tooltips.

<MemberHeading id="concretevoicingsymbols" depth="3" name="CONCRETE_VOICING_SYMBOLS" sig="CONCRETE_VOICING_SYMBOLS: Array.<string>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L143" sourceLabel="voicings.js:143" />

All concrete voicing symbols derived from `VOICING_MODES`. Excludes the UI meta-value `'random'`, which is never passed to `applyVoicing()`. Used by `resolveVoicingMode()` when picking randomly in Dictionary mode.

<MemberHeading id="voicingrequirements" depth="3" name="VOICING_REQUIREMENTS" sig="VOICING_REQUIREMENTS: Object.<string, Array.<string>>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L170" sourceLabel="voicings.js:170" />

Maps each voicing symbol that has a structural role requirement to the harmonic roles it needs present in `baseIntervals` to be meaningful.

Symbols absent from this table are universally applicable — they work on any chord (Groups 1–2 position/doubling voicings, Group 4 drop voicings).

Role values match the output of `_voicingRoles()`: 'root' | 'third' | 'fifth' | 'altfifth' | 'seventh' | 'extension'

Special case — 'fifth' entries: three voicings (`oct_bass_triad`, `open5_triad`, `spread_2h`) accept either `'fifth'` or `'altfifth'` in their `applyVoicing()` cases. `voicingAppliesToChord()` handles this with a dedicated check rather than a plain `includes()`. Do not add `'altfifth'` to these arrays — the function already accounts for it.

This table is the authoritative source for UI gating. Keep it in sync with the role guards inside the corresponding `applyVoicing()` cases: every `-1` guard that triggers a fallback to `'close'` must have an entry here, and vice versa.

<MemberHeading id="altfifthok" depth="3" name="_ALTFIFTH_OK" sig="_ALTFIFTH_OK: Set.<string>" />

<MemberMeta sourceHref="/source/engine/voicings-js/#L209" sourceLabel="voicings.js:209" />

Symbols whose `'fifth'` requirement also accepts `'altfifth'` (diminished or augmented 5th). Listed separately so `voicingAppliesToChord()` can apply the correct check without string-matching role names.
