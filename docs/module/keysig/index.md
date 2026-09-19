---
title: KeySig
kind: module
longname: module:KeySig
description: "Key signature helpers: chip toggling, VexFlow key string resolution, best-fit key inference for complex chords, and key-signature coverage tracking used by the notation engine to suppress redundant accidentals on notes already covered by the active key signature. Coverage model: a key signature covers specific LETTER+ACCIDENTAL combinations, not raw pitch classes. E♭ major covers the letter E with a flat — it does NOT cover D♯ even though D♯ and E♭ share pitch class 3. Coverage is therefore tracked as a Set of VexFlow letter strings (e.g. {'bb','eb','ab','db','gb'}) and matched by letter identity, not pitch class. Dependencies: pinnedRootSpelling (state.js) — resolves enharmonic key ambiguity. currentMode, currentProgression, progAnswered, answered, appMode (state.js) showProgressionNotation(), showCurrentView(), showNotation(), showBreakdown() — rendering functions called after chip state changes."
---

# KeySig

<SourceLink href="/source/data/keysig-js/#L27" label="keysig.js:27" />

Key signature helpers: chip toggling, VexFlow key string resolution, best-fit key inference for complex chords, and key-signature coverage tracking used by the notation engine to suppress redundant accidentals on notes already covered by the active key signature.

Coverage model: a key signature covers specific LETTER+ACCIDENTAL combinations, not raw pitch classes. E♭ major covers the letter E with a flat — it does NOT cover D♯ even though D♯ and E♭ share pitch class 3. Coverage is therefore tracked as a Set of VexFlow letter strings (e.g. {'bb','eb','ab','db','gb'}) and matched by letter identity, not pitch class.

Dependencies: pinnedRootSpelling (state.js) — resolves enharmonic key ambiguity. currentMode, currentProgression, progAnswered, answered, appMode (state.js) showProgressionNotation(), showCurrentView(), showNotation(), showBreakdown() — rendering functions called after chip state changes.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="setkeysig" depth="3" name="setKeySig" sig="setKeySig(mode: 'C' | 'key')" />

<MemberMeta sourceHref="/source/data/keysig-js/#L39" sourceLabel="keysig.js:39" />

Handles a Key/C chip tap: updates the per-mode key-signature display preference in state and re-renders the current notation and breakdown.

Each mode stores its keySigMode independently so switching modes does not reset the chip selection. Progressions mode re-renders mini staves directly; chords mode uses the view dispatcher to correctly handle both the main chord view and the resolution view.

**Parameters**

- `mode` ('C' | 'key') — 'key' renders the staff with a key signature; 'C' shows all accidentals explicitly with no key signature.

<MemberHeading id="vexkeymajor" depth="3" name="vexKeyMajor" sig="vexKeyMajor(pc: number): string" />

<MemberMeta sourceHref="/source/data/keysig-js/#L95" sourceLabel="keysig.js:95" />

Returns the VexFlow major key signature string for the given pitch class, respecting pinnedRootSpelling. Defaults to the flat side for enharmonic pcs.

**Parameters**

- `pc` (number) — Pitch class (0–11).

**Returns**

- `string` — VexFlow key string, e.g. 'Eb' | 'D#' | 'G'.

<MemberHeading id="vexkeyminor" depth="3" name="vexKeyMinor" sig="vexKeyMinor(pc: number): string" />

<MemberMeta sourceHref="/source/data/keysig-js/#L108" sourceLabel="keysig.js:108" />

Returns the VexFlow minor key signature string for the given pitch class, respecting pinnedRootSpelling. Defaults to the flat side for enharmonic pcs.

**Parameters**

- `pc` (number) — Pitch class (0–11).

**Returns**

- `string` — VexFlow key string, e.g. 'Ebm' | 'D#m' | 'Gm'.

<MemberHeading id="getscaleparentkeystr" depth="3" name="getScaleParentKeyStr" sig="getScaleParentKeyStr(scale, rootPc: number): string | null" />

<MemberMeta sourceHref="/source/data/keysig-js/#L128" sourceLabel="keysig.js:128" />

Returns the VexFlow key signature string implied by a scale's parent key at the given root pitch class, or null if the scale has no parent key.

Modal scales are notated in their parent key's key signature rather than the mode root's "key", because the parent key defines the actual accidentals in use. For example, D Dorian is notated with C major's key signature (no sharps or flats), not D major's (two sharps).

**Parameters**

- `scale`
- `rootPc` (number) — Pitch class of the mode's root note (0–11).

**Returns**

- `string | null` — VexFlow key string (e.g. 'C', 'Bb', 'F#m') or null.

<MemberHeading id="getchordkeystr" depth="3" name="getChordKeyStr" sig="getChordKeyStr(sym: string, rootPc: number): string" />

<MemberMeta sourceHref="/source/data/keysig-js/#L148" sourceLabel="keysig.js:148" />

Returns the VexFlow key signature string implied by a chord symbol and root pitch class. Minor-quality chords use a minor key signature; all others use a major key signature rooted on the chord's root.

Used by the notation engine to place an appropriate key signature behind a chord so that chord tones covered by the key are displayed without individual accidentals.

**Parameters**

- `sym` (string) — Chord symbol key (e.g. 'm7', 'Maj7', 'dim').
- `rootPc` (number) — Pitch class of the chord root (0–11).

**Returns**

- `string` — VexFlow key string, e.g. 'Am' | 'C' | 'Bb'.

<MemberHeading id="getbestfitkeystr" depth="3" name="getBestFitKeyStr" sig="getBestFitKeyStr(midiNotes: Array.<number>): string" />

<MemberMeta sourceHref="/source/data/keysig-js/#L167" sourceLabel="keysig.js:167" />

Infers the best-fit VexFlow key signature string for a set of MIDI notes by finding the major or minor key whose scale shares the most pitch classes with the chord. Ties are broken by fewest accidentals (proximity to C major / A minor), minimising clutter on the staff.

Used for polychords, Upper Structure Triads, and slash chords, where there is no single unambiguous root key — the notation engine needs a key signature that reduces accidentals without imposing an incorrect harmonic reading.

**Parameters**

- `midiNotes` (Array.\<number>) — Array of MIDI note numbers in the chord.

**Returns**

- `string` — VexFlow key string for the best-fitting key, e.g. 'Bb' | 'F#m'.

<MemberHeading id="getintervalkeystr" depth="3" name="getIntervalKeyStr" sig="getIntervalKeyStr(rootPc: number): string" />

<MemberMeta sourceHref="/source/data/keysig-js/#L199" sourceLabel="keysig.js:199" />

Returns the VexFlow key signature string for an interval question, using the lower note's pitch class as the root. Intervals are always contextualised as major keys — there is no minor-quality distinction at the interval level.

**Parameters**

- `rootPc` (number) — Pitch class of the lower (root) note (0–11).

**Returns**

- `string` — VexFlow major key string, e.g. 'G' | 'Bb' | 'F#'.

<MemberHeading id="keysigcoveredletters" depth="3" name="keySigCoveredLetters" sig="keySigCoveredLetters(vexKeyStr: string | null): Set.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L272" sourceLabel="keysig.js:272" />

Returns the set of VexFlow letter strings covered by the given key signature.

Each string in the returned Set is a letter+accidental combination that the key signature makes implicit — e.g. {'bb','eb','ab','db','gb'} for D♭ major. The notation engine uses this set to decide whether to suppress an accidental (if covered) or force it to appear (if not).

Coverage is letter-based, not pitch-class based: 'eb' in the set means the letter E with a flat is covered, but 'D#' (same pitch class) is not.

**Parameters**

- `vexKeyStr` (string | null) — VexFlow key string (e.g. 'Eb' | 'F#m' | null).

**Returns**

- `Set.<string>` — Set of covered VexFlow letter strings, e.g. {'bb','eb'}.

<MemberHeading
  id="iscoveredbykeysig"
  depth="3"
  name="isCoveredByKeySig"
  sig="isCoveredByKeySig(
	vexKey: string,
	coveredLetters: Set.<string>,
): boolean"
/>

<MemberMeta sourceHref="/source/data/keysig-js/#L295" sourceLabel="keysig.js:295" />

Returns true if the given VexFlow key string is covered by the provided coverage set, meaning the key signature already implies this accidental and it should not be drawn explicitly on the note.

**Parameters**

- `vexKey` (string) — VexFlow key string including octave, e.g. 'eb/4' | 'f#/5'.
- `coveredLetters` (Set.\<string>) — Set returned by keySigCoveredLetters().

**Returns**

- `boolean` — True if the note's accidental is covered by the key signature.

<MemberHeading
  id="respellforkeysig"
  depth="3"
  name="respellForKeySig"
  sig="respellForKeySig(
	midi: number,
	vexKey: string,
	coveredLetters: Set.<string>,
	keySigStr: string,
): string"
/>

<MemberMeta sourceHref="/source/data/keysig-js/#L326" sourceLabel="keysig.js:326" />

Re-spells a VexFlow key string enharmonically when the interval engine has produced a double accidental and a simpler spelling exists within the context of the active key signature.

The function is conservative: it only acts on double accidentals (♭♭ or ##). Single accidentals and naturals are always returned unchanged. When a simpler spelling is found, it is chosen in the following priority order:

1. Cross-letter candidate covered by the key signature (e.g. E♭♭ → D when D is in key — genuinely simpler and harmonically consistent).
1. Same-letter one-step strip, preserving staff position (e.g. E♭♭ → E♭). This takes priority over a cross-letter natural to avoid staff collisions when another note already occupies that letter's staff position.
1. Cross-letter natural (last resort — may create staff collisions).

The notation engine sets forcedAcc=true for the resulting note so the remaining single accidental is always drawn explicitly.

**Parameters**

- `midi` (number) — MIDI note number of the note being re-spelled.
- `vexKey` (string) — Current VexFlow key string, e.g. 'ebb/4'.
- `coveredLetters` (Set.\<string>) — Set returned by keySigCoveredLetters().
- `keySigStr` (string) — Active VexFlow key signature string (unused directly but kept for potential future context expansion).

**Returns**

- `string` — Re-spelled VexFlow key string, or the original if no change needed.

<MemberHeading id="keysigcoveredpcs" depth="3" name="keySigCoveredPcs" sig="keySigCoveredPcs(vexKeyStr: string | null): Set.<number>" />

<MemberMeta badges="deprecated" sourceHref="/source/data/keysig-js/#L393" sourceLabel="keysig.js:393" />

Returns the set of pitch classes covered by the given key signature.

<Callout type="error">
  &#x20;Prefer keySigCoveredLetters() for new code. This pitch-class based approach cannot distinguish enharmonic pairs (e.g. E♭ vs D♯) and may suppress or force accidentals incorrectly on enharmonically spelled notes. Retained for legacy callers only.
</Callout>

**Parameters**

- `vexKeyStr` (string | null) — VexFlow key string or null.

**Returns**

- `Set.<number>` — Set of covered pitch classes (0–11).

<MemberHeading id="keysigaccidentalcount" depth="3" name="keySigAccidentalCount" sig="keySigAccidentalCount(vexKeyStr: string | null): number" />

<MemberMeta sourceHref="/source/data/keysig-js/#L417" sourceLabel="keysig.js:417" />

Returns the total number of accidental symbols in the given key signature. Used by the notation engine to calculate extra canvas width needed to accommodate the key signature glyphs at the start of the staff.

**Parameters**

- `vexKeyStr` (string | null) — VexFlow key string, e.g. 'Eb' | 'F#m' | null.

**Returns**

- `number` — Number of accidentals in the key signature (0–7).

## Other

<MemberHeading id="vexkeymajorflat" depth="3" name="VEX_KEY_MAJOR_FLAT" sig="VEX_KEY_MAJOR_FLAT: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L66" sourceLabel="keysig.js:66" />

VexFlow major key signature strings indexed by pitch class (0–11), flat side. Enharmonic pitch classes (1,3,6,8,10) use the flat-preferred spelling: Db, Eb, Gb, Ab, Bb. Used when pinnedRootSpelling is 'flat' or unset.

<MemberHeading id="vexkeymajorsharp" depth="3" name="VEX_KEY_MAJOR_SHARP" sig="VEX_KEY_MAJOR_SHARP: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L74" sourceLabel="keysig.js:74" />

VexFlow major key signature strings indexed by pitch class (0–11), sharp side. Enharmonic pitch classes use the sharp-preferred spelling: C#, D#, F#, G#, A#. Used when pinnedRootSpelling is 'sharp'.

<MemberHeading id="vexkeyminorflat" depth="3" name="VEX_KEY_MINOR_FLAT" sig="VEX_KEY_MINOR_FLAT: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L80" sourceLabel="keysig.js:80" />

VexFlow minor key signature strings indexed by pitch class (0–11), flat side.

<MemberHeading id="vexkeyminorsharp" depth="3" name="VEX_KEY_MINOR_SHARP" sig="VEX_KEY_MINOR_SHARP: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L86" sourceLabel="keysig.js:86" />

VexFlow minor key signature strings indexed by pitch class (0–11), sharp side.

<MemberHeading id="majorsharpscount" depth="3" name="MAJOR_SHARPS_COUNT" sig="MAJOR_SHARPS_COUNT: Object.<string, number>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L210" sourceLabel="keysig.js:210" />

Number of sharps in each major key's key signature. Keys not present here are flat keys (see MAJOR\_FLATS\_COUNT).

<MemberHeading id="majorflatscount" depth="3" name="MAJOR_FLATS_COUNT" sig="MAJOR_FLATS_COUNT: Object.<string, number>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L217" sourceLabel="keysig.js:217" />

Number of flats in each major key's key signature. C appears in both tables with count 0 — it is the neutral key.

<MemberHeading id="minortorelmajor" depth="3" name="MINOR_TO_REL_MAJOR" sig="MINOR_TO_REL_MAJOR: Object.<string, string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L224" sourceLabel="keysig.js:224" />

Maps VexFlow minor key strings to their relative major key string. Used to look up accidental counts for minor keys via their relative major.

<MemberHeading id="sharporderletters" depth="3" name="SHARP_ORDER_LETTERS" sig="SHARP_ORDER_LETTERS: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L234" sourceLabel="keysig.js:234" />

The order in which sharps appear in key signatures, as VexFlow letter strings. F♯ is always first (one-sharp keys); B♯ is last (seven-sharp keys).

<MemberHeading id="flatorderletters" depth="3" name="FLAT_ORDER_LETTERS" sig="FLAT_ORDER_LETTERS: Array.<string>" />

<MemberMeta sourceHref="/source/data/keysig-js/#L241" sourceLabel="keysig.js:241" />

The order in which flats appear in key signatures, as VexFlow letter strings. B♭ is always first (one-flat keys); F♭ is last (seven-flat keys).
