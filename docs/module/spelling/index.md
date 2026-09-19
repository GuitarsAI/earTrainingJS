---
title: Spelling
kind: module
longname: module:Spelling
description: "Interval-based enharmonic spelling engine. Converts pitch-class and MIDI data into correctly spelled note names and VexFlow key strings, using the interval distance from the chord or scale root to determine the letter name rather than the raw pitch class. Fundamental rule: the INTERVAL from the root determines the letter name. A major 3rd above D♯ must be F## — not G — because it occupies the 3rd degree. A diminished 7th above B must be A♭ — not G♯ — because it is the 7th degree. When a double accidental results, the enharmonic equivalent is appended in parentheses (e.g. &quot;F##\\u00a0(G)&quot;) so the user sees both the theoretically correct spelling and the practical sounding pitch. Public API: spelledNote(intervalSemitones, rootPc, symbol) → display string, e.g. &quot;F##\\u00a0(G)&quot; | &quot;B♭&quot; | &quot;E&quot; spelledRoot(rootPc) → display string for the root note itself midiToVexKeySpelled(midi, intervalSemitones, rootPc, symbol) → VexFlow key string, e.g. &quot;fbb/4&quot; | &quot;g##/3&quot; vexAccidental(vexKey) → VexFlow accidental token string or null pcInterval(targetPc, rootPc) → semitone distance from rootPc to targetPc (0–11) Dependencies: pinnedRootSpelling (state.js) — controls flat/sharp preference when the root is not a natural note and no key signature context is available."
---

# Spelling

<SourceLink href="/source/data/spelling-js/#L36" label="spelling.js:36" />

Interval-based enharmonic spelling engine. Converts pitch-class and MIDI data into correctly spelled note names and VexFlow key strings, using the interval distance from the chord or scale root to determine the letter name rather than the raw pitch class.

Fundamental rule: the INTERVAL from the root determines the letter name. A major 3rd above D♯ must be F## — not G — because it occupies the 3rd degree. A diminished 7th above B must be A♭ — not G♯ — because it is the 7th degree. When a double accidental results, the enharmonic equivalent is appended in parentheses (e.g. "F##\u00a0(G)") so the user sees both the theoretically correct spelling and the practical sounding pitch.

Public API: spelledNote(intervalSemitones, rootPc, symbol) → display string, e.g. "F##\u00a0(G)" | "B♭" | "E" spelledRoot(rootPc) → display string for the root note itself midiToVexKeySpelled(midi, intervalSemitones, rootPc, symbol) → VexFlow key string, e.g. "fbb/4" | "g##/3" vexAccidental(vexKey) → VexFlow accidental token string or null pcInterval(targetPc, rootPc) → semitone distance from rootPc to targetPc (0–11)

Dependencies: pinnedRootSpelling (state.js) — controls flat/sharp preference when the root is not a natural note and no key signature context is available.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="tritoneisdim5" depth="3" name="tritoneIsDim5" sig="tritoneIsDim5(symbol: string): boolean" />

<MemberMeta sourceHref="/source/data/spelling-js/#L114" sourceLabel="spelling.js:114" />

Returns true if the given chord/scale symbol spells a 6-semitone interval as a diminished 5th (d5) rather than an augmented 4th (A4).

**Parameters**

- `symbol` (string) — Chord or scale symbol key (e.g. 'dim', 'o7', 'locrian').

**Returns**

- `boolean` — True if the tritone should be treated as d5 for this symbol.

<MemberHeading
  id="spellednote"
  depth="3"
  name="spelledNote"
  sig="spelledNote(
	intervalSemitones: number,
	rootPc: number,
	symbol?: string,
): string"
/>

<MemberMeta sourceHref="/source/data/spelling-js/#L169" sourceLabel="spelling.js:169" />

Computes the correctly spelled note name for a pitch that lies `intervalSemitones` above the given root pitch class.

The letter name is determined by the interval's generic size (2nd, 3rd, 4th…), not by the raw pitch class. The accidental is the difference between that letter's natural pitch class and the actual target pitch class, expressed as ♭/♯/♭♭/♯♯. When a double accidental results, the enharmonic equivalent is appended in parentheses (e.g. "F##\u00a0(G)") for readability.

Extended interval semitone counts (> 11) are normalised mod 12 before processing — octave displacement does not affect the letter or accidental.

**Parameters**

- `intervalSemitones` (number) — Semitone distance from root to target note. May exceed 12 for compound/extended intervals; normalised internally.
- `rootPc` (number) — Pitch class of the root note (0–11).
- `symbol` (string, optional, default: "''") — Chord or scale symbol key used to resolve ambiguous interval spellings (tritone A4 vs d5, 8st A5 vs m6, 9st d7 vs M6).

**Returns**

- `string` — Display string, e.g. "F##\u00a0(G)" | "B♭" | "E" | "C♯".

<MemberHeading id="spelledroot" depth="3" name="spelledRoot" sig="spelledRoot(rootPc: number): string" />

<MemberMeta sourceHref="/source/data/spelling-js/#L274" sourceLabel="spelling.js:274" />

Returns the display name of the root note itself (interval = unison).

Natural pitch classes (0,2,4,5,7,9,11) always return the natural name. Enharmonic pitch classes (1,3,6,8,10) respect `pinnedRootSpelling` when set; otherwise the conventional flat-side preference applies (D♭ E♭ G♭ A♭ B♭).

**Parameters**

- `rootPc` (number) — Pitch class of the root note (0–11).

**Returns**

- `string` — Display name, e.g. "C♯" | "D♭" | "F" | "B♭".

<MemberHeading
  id="miditovexkeyspelled"
  depth="3"
  name="midiToVexKeySpelled"
  sig="midiToVexKeySpelled(
	midi: number,
	intervalSemitones: number,
	rootPc: number,
	symbol?: string,
): string"
/>

<MemberMeta sourceHref="/source/data/spelling-js/#L299" sourceLabel="spelling.js:299" />

Converts a MIDI note number to a VexFlow-compatible key string with correct enharmonic spelling for the given harmonic context.

Spelling is derived from spelledNote() using the interval from the root, then translated to VexFlow's letter+accidental+octave format (e.g. "fbb/4"). Octave is corrected for letters that cross the C/B boundary relative to the raw MIDI pitch class (e.g. Cb sounds like B but VexFlow places it one octave higher on the staff; B## sounds like C# but belongs one octave lower).

**Parameters**

- `midi` (number) — MIDI note number (0–127).
- `intervalSemitones` (number) — Semitone distance from root to this note.
- `rootPc` (number) — Pitch class of the root note (0–11).
- `symbol` (string, optional, default: "''") — Chord or scale symbol for tritone/A5/d7 context.

**Returns**

- `string` — VexFlow key string, e.g. "fbb/4" | "g##/3" | "bb/3" | "c#/5".

<MemberHeading id="vexaccidental" depth="3" name="vexAccidental" sig="vexAccidental(vexKey: string): string | null" />

<MemberMeta sourceHref="/source/data/spelling-js/#L345" sourceLabel="spelling.js:345" />

Extracts the VexFlow accidental token from a key string for use with `StaveNote.addModifier(new Accidental(...))`.

VexFlow requires explicit accidental objects even for notes covered by the key signature when the notation engine has been told to force them. This function parses the letter+accidental portion of the key string and returns the token VexFlow expects, or null if the note is natural.

The 'bb' (double flat) check requires length > 2 to distinguish the token "bb" (B-flat) from "bbb/4" (B double-flat) — the leading letter 'b' is part of the note name, not the accidental.

**Parameters**

- `vexKey` (string) — VexFlow key string, e.g. "f#/4" | "eb/3" | "c##/5".

**Returns**

- `string | null` — Accidental token ('##' | 'bb' | '#' | 'b') or null if natural.

<MemberHeading id="pcinterval" depth="3" name="pcInterval" sig="pcInterval(targetPc: number, rootPc: number): number" />

<MemberMeta sourceHref="/source/data/spelling-js/#L367" sourceLabel="spelling.js:367" />

Computes the ascending semitone interval from `rootPc` to `targetPc`, always returning a value in the range 0–11.

Used at call sites to convert a pair of pitch classes into the `intervalSemitones` argument required by spelledNote() and midiToVexKeySpelled(). The double-modulo pattern handles negative differences (e.g. root=9, target=2 → (2-9+12)%12 = 5 semitones ascending).

**Parameters**

- `targetPc` (number) — Pitch class of the target note (0–11).
- `rootPc` (number) — Pitch class of the root note (0–11).

**Returns**

- `number` — Ascending semitone distance (0–11).

## Other

<MemberHeading id="notenames" depth="3" name="NOTE_NAMES" sig="NOTE_NAMES" />

<MemberMeta sourceHref="/source/data/spelling-js/#L37" sourceLabel="spelling.js:37" />

Chromatic pitch-class names using sharps (index = pitch class 0–11).

<MemberHeading id="letterpcs" depth="3" name="LETTER_PCS" sig="LETTER_PCS: Array.<number>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L45" sourceLabel="spelling.js:45" />

Pitch class of each natural letter name, indexed C=0 … B=6. Used to convert a letter index into its natural (no-accidental) pitch class, and to find the letter index of a natural root note.

<MemberHeading id="letternames" depth="3" name="LETTER_NAMES" sig="LETTER_NAMES: Array.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L52" sourceLabel="spelling.js:52" />

The seven diatonic letter names in ascending order, indexed C=0 … B=6. Parallel to LETTER\_PCS — LETTER\_NAMES\[i] is the name for LETTER\_PCS\[i].

<MemberHeading id="semitonestolettersteps" depth="3" name="SEMITONES_TO_LETTER_STEPS" sig="SEMITONES_TO_LETTER_STEPS: Object.<number, number>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L74" sourceLabel="spelling.js:74" />

Maps a semitone count (0–11, normalised mod 12) to the number of diatonic letter steps above the root that interval represents.

Letter steps are 0-based and mod 7 (unison=0, 2nd=1, 3rd=2 … 7th=6). This encodes the "generic" interval size — which letter name to land on — before any accidental adjustment. The accidental is then computed from the difference between that letter's natural pitch class and the actual target pitch class.

Entries for ambiguous semitone counts (6, 8, 9) give the most common interpretation; context-sensitive overrides are applied in spelledNote() via TRITONE\_AS\_D5, EIGHT\_AS\_A5, and NINE\_AS\_D7.

Extended intervals (m9=13, M9=14, P11=17, A11=18, m13=20, M13=21) are handled by spelledNote() normalising the semitone count mod 12 before lookup, so the octave displacement is managed separately.

<MemberHeading id="tritoneasd5" depth="3" name="TRITONE_AS_D5" sig="TRITONE_AS_D5: Set.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L101" sourceLabel="spelling.js:101" />

Chord and scale symbols in which a 6-semitone interval (tritone) should be spelled as a diminished 5th (d5, letter steps = 4) rather than the default augmented 4th (A4, letter steps = 3).

The tritone is the only interval whose generic size is ambiguous without harmonic context: in a diminished chord or a scale with a flattened 5th degree, 6 semitones occupies the 5th position (d5); everywhere else it occupies the 4th position (A4, e.g. the ♯4 in Lydian mode).

<MemberHeading id="eightasa5" depth="3" name="EIGHT_AS_A5" sig="EIGHT_AS_A5: Set.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L129" sourceLabel="spelling.js:129" />

Chord and scale symbols in which an 8-semitone interval should be spelled as an augmented 5th (A5, letter steps = 4) rather than the default minor 6th (m6, letter steps = 5).

In augmented chords and the whole-tone scale the raised fifth is a structural member of the chord/scale, not a colouristic 6th — so A5 is the correct generic interval and the letter must land on the 5th degree.

<MemberHeading id="nineasd7" depth="3" name="NINE_AS_D7" sig="NINE_AS_D7: Set.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L145" sourceLabel="spelling.js:145" />

Chord symbols in which a 9-semitone interval should be spelled as a diminished 7th (d7, letter steps = 6) rather than the default major 6th (M6, letter steps = 5).

The fully diminished 7th chord (°7) contains a diminished 7th as its defining interval — the note must land on the 7th letter degree, not the 6th.

<MemberHeading id="sharpnamesbasic" depth="3" name="SHARP_NAMES_BASIC" sig="SHARP_NAMES_BASIC: Array.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L253" sourceLabel="spelling.js:253" />

Simple sharp-spelling name for each pitch class (0–11). Used only to produce the enharmonic parenthetical when a double accidental occurs (e.g. "F##\u00a0(G)"). Not used for primary spelling — use spelledNote() for that.

<MemberHeading id="flatnamesbasic" depth="3" name="FLAT_NAMES_BASIC" sig="FLAT_NAMES_BASIC: Array.<string>" />

<MemberMeta sourceHref="/source/data/spelling-js/#L262" sourceLabel="spelling.js:262" />

Simple flat-spelling name for each pitch class (0–11). Used only to produce the enharmonic parenthetical when a double accidental occurs (e.g. "B♭♭\u00a0(A)"). Not used for primary spelling — use spelledNote() for that.
