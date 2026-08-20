/**
 * @file spelling.js
 * @description Interval-based enharmonic spelling engine. Converts pitch-class
 *   and MIDI data into correctly spelled note names and VexFlow key strings,
 *   using the interval distance from the chord or scale root to determine the
 *   letter name rather than the raw pitch class.
 *
 * Fundamental rule: the INTERVAL from the root determines the letter name.
 *   A major 3rd above D♯ must be F## — not G — because it occupies the 3rd
 *   degree. A diminished 7th above B must be A♭ — not G♯ — because it is the
 *   7th degree. When a double accidental results, the enharmonic equivalent is
 *   appended in parentheses (e.g. "F##\u00a0(G)") so the user sees both the
 *   theoretically correct spelling and the practical sounding pitch.
 *
 * Public API:
 *   spelledNote(intervalSemitones, rootPc, symbol)
 *     → display string, e.g. "F##\u00a0(G)" | "B♭" | "E"
 *   spelledRoot(rootPc)
 *     → display string for the root note itself
 *   midiToVexKeySpelled(midi, intervalSemitones, rootPc, symbol)
 *     → VexFlow key string, e.g. "fbb/4" | "g##/3"
 *   vexAccidental(vexKey)
 *     → VexFlow accidental token string or null
 *   pcInterval(targetPc, rootPc)
 *     → semitone distance from rootPc to targetPc (0–11)
 *
 * Dependencies: pinnedRootSpelling (state.js) — controls flat/sharp preference
 *   when the root is not a natural note and no key signature context is available.
 *
 * @module Spelling
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

/** Chromatic pitch-class names using sharps (index = pitch class 0–11). */
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

/**
 * Pitch class of each natural letter name, indexed C=0 … B=6.
 * Used to convert a letter index into its natural (no-accidental) pitch class,
 * and to find the letter index of a natural root note.
 * @type {number[]}
 */
const LETTER_PCS = [0, 2, 4, 5, 7, 9, 11];

/**
 * The seven diatonic letter names in ascending order, indexed C=0 … B=6.
 * Parallel to LETTER_PCS — LETTER_NAMES[i] is the name for LETTER_PCS[i].
 * @type {string[]}
 */
const LETTER_NAMES = ['C','D','E','F','G','A','B'];

/**
 * Maps a semitone count (0–11, normalised mod 12) to the number of diatonic
 * letter steps above the root that interval represents.
 *
 * Letter steps are 0-based and mod 7 (unison=0, 2nd=1, 3rd=2 … 7th=6).
 * This encodes the "generic" interval size — which letter name to land on —
 * before any accidental adjustment. The accidental is then computed from the
 * difference between that letter's natural pitch class and the actual target
 * pitch class.
 *
 * Entries for ambiguous semitone counts (6, 8, 9) give the most common
 * interpretation; context-sensitive overrides are applied in spelledNote()
 * via TRITONE_AS_D5, EIGHT_AS_A5, and NINE_AS_D7.
 *
 * Extended intervals (m9=13, M9=14, P11=17, A11=18, m13=20, M13=21) are
 * handled by spelledNote() normalising the semitone count mod 12 before
 * lookup, so the octave displacement is managed separately.
 *
 * @type {Object.<number, number>}
 */
const SEMITONES_TO_LETTER_STEPS = {
  0: 0,   // unison / P8 / P15
  1: 1,   // m2 / A1
  2: 1,   // M2
  3: 2,   // m3
  4: 2,   // M3
  5: 3,   // P4
  6: 3,   // A4 (default; d5 = 4 handled by context — see below)
  7: 4,   // P5
  8: 5,   // m6
  9: 5,   // M6
  10: 6,  // m7
  11: 6,  // M7
};

/**
 * Chord and scale symbols in which a 6-semitone interval (tritone) should be
 * spelled as a diminished 5th (d5, letter steps = 4) rather than the default
 * augmented 4th (A4, letter steps = 3).
 *
 * The tritone is the only interval whose generic size is ambiguous without
 * harmonic context: in a diminished chord or a scale with a flattened 5th
 * degree, 6 semitones occupies the 5th position (d5); everywhere else it
 * occupies the 4th position (A4, e.g. the ♯4 in Lydian mode).
 *
 * @type {Set<string>}
 */
const TRITONE_AS_D5 = new Set([
  'dim','m7b5','o7',           // diminished family — d5 in the chord
  'nat_minor','harm_minor','mel_minor', // minor scales — b5 degree is d5 context
  'locrian','phrygian','altered',       // modes with b5
]);

/**
 * Returns true if the given chord/scale symbol spells a 6-semitone interval
 * as a diminished 5th (d5) rather than an augmented 4th (A4).
 *
 * @param {string} symbol - Chord or scale symbol key (e.g. 'dim', 'o7', 'locrian').
 * @returns {boolean} True if the tritone should be treated as d5 for this symbol.
 */
function tritoneIsDim5(symbol) {
  return TRITONE_AS_D5.has(symbol);
}

/**
 * Chord and scale symbols in which an 8-semitone interval should be spelled as
 * an augmented 5th (A5, letter steps = 4) rather than the default minor 6th
 * (m6, letter steps = 5).
 *
 * In augmented chords and the whole-tone scale the raised fifth is a structural
 * member of the chord/scale, not a colouristic 6th — so A5 is the correct
 * generic interval and the letter must land on the 5th degree.
 *
 * @type {Set<string>}
 */
const EIGHT_AS_A5 = new Set([
  'aug', 'Maj7_s5',   // augmented chord family — the fifth IS augmented
  '7_s5',             // dominant 7 sharp 5
  'whole_tone',       // whole-tone scale: C D E F# G# A# — 8 semitones = G# = A5
]);

/**
 * Chord symbols in which a 9-semitone interval should be spelled as a
 * diminished 7th (d7, letter steps = 6) rather than the default major 6th
 * (M6, letter steps = 5).
 *
 * The fully diminished 7th chord (°7) contains a diminished 7th as its
 * defining interval — the note must land on the 7th letter degree, not the 6th.
 *
 * @type {Set<string>}
 */
const NINE_AS_D7 = new Set([
  'o7',               // fully diminished 7th chord — the 7th IS diminished
]);

/**
 * Computes the correctly spelled note name for a pitch that lies
 * `intervalSemitones` above the given root pitch class.
 *
 * The letter name is determined by the interval's generic size (2nd, 3rd, 4th…),
 * not by the raw pitch class. The accidental is the difference between that
 * letter's natural pitch class and the actual target pitch class, expressed as
 * ♭/♯/♭♭/♯♯. When a double accidental results, the enharmonic equivalent is
 * appended in parentheses (e.g. "F##\u00a0(G)") for readability.
 *
 * Extended interval semitone counts (> 11) are normalised mod 12 before
 * processing — octave displacement does not affect the letter or accidental.
 *
 * @param {number} intervalSemitones - Semitone distance from root to target
 *   note. May exceed 12 for compound/extended intervals; normalised internally.
 * @param {number} rootPc - Pitch class of the root note (0–11).
 * @param {string} [symbol=''] - Chord or scale symbol key used to resolve
 *   ambiguous interval spellings (tritone A4 vs d5, 8st A5 vs m6, 9st d7 vs M6).
 * @returns {string} Display string, e.g. "F##\u00a0(G)" | "B♭" | "E" | "C♯".
 */
function spelledNote(intervalSemitones, rootPc, symbol) {
  const semitones = ((intervalSemitones % 12) + 12) % 12; // normalise to 0–11
  const rootPcN   = ((rootPc % 12) + 12) % 12;

  // Letter steps above root
  let letterSteps;
  if (semitones === 6) {
    letterSteps = tritoneIsDim5(symbol) ? 4 : 3;      // A4 vs d5
  } else if (semitones === 8 && EIGHT_AS_A5.has(symbol)) {
    letterSteps = 4;                                    // augmented 5th (not minor 6th)
  } else if (semitones === 9 && NINE_AS_D7.has(symbol)) {
    letterSteps = 6;                                    // diminished 7th (not major 6th)
  } else {
    letterSteps = SEMITONES_TO_LETTER_STEPS[semitones];
  }

  // Resolve the root's letter index (0=C … 6=B).
  // Natural roots (C D E F G A B) map directly via LETTER_PCS.
  // Non-natural roots (C♯, D♭, …) are enharmonically ambiguous — the letter
  // choice (e.g. C♯ vs D♭ as root) cascades into every downstream spelling,
  // so we resolve it once here using pinnedRootSpelling when available, or the
  // conventional key-signature preference (flat side) as a fallback.
  const rootLetterIdx = LETTER_PCS.findIndex(pc => pc === rootPcN);
  const rootLetterIdxResolved = (() => {
    if (rootLetterIdx !== -1) return rootLetterIdx; // natural root — no ambiguity

    // flat map:  pc 1→D(1), 3→E(2), 6→G(4), 8→A(5), 10→B(6)  (Db Eb Gb Ab Bb)
    // sharp map: pc 1→C(0), 3→D(1), 6→F(3), 8→G(4), 10→A(5)  (C# D# F# G# A#)
    const flatMap  = {1:1, 3:2, 6:4, 8:5, 10:6};
    const sharpMap = {1:0, 3:1, 6:3, 8:4, 10:5};
    if (pinnedRootSpelling === 'flat')  return flatMap[rootPcN]  ?? 0;
    if (pinnedRootSpelling === 'sharp') return sharpMap[rootPcN] ?? 0;
    // Auto (Rnd mode): Db Eb Gb Ab Bb are the conventional flat-side roots
    const FLAT_ROOT_PCS = new Set([1,3,6,8,10]);
    return FLAT_ROOT_PCS.has(rootPcN) ? (flatMap[rootPcN] ?? 0) : (sharpMap[rootPcN] ?? 0);
  })();

  // Target letter index (mod 7)
  const targetLetterIdx = (rootLetterIdxResolved + letterSteps) % 7;
  const targetLetterName = LETTER_NAMES[targetLetterIdx];

  // Natural pitch class of the target letter
  const naturalPc = LETTER_PCS[targetLetterIdx];

  // Actual target pitch class
  const targetPc = (rootPcN + semitones) % 12;

  // Compute the accidental: how many semitones the target pitch class deviates
  // from the natural pitch class of the chosen letter.
  // Negative = flat direction; positive = sharp direction.
  // We clamp to ±2 (double flat / double sharp) — the outer bound of practical
  // enharmonic spelling. Differences beyond ±2 produce '?' and signal a bug.
  let diff = targetPc - naturalPc;
  // Wrap into –6…+6 to correctly handle the octave seam (e.g. B natural = pc 11,
  // target Cb = pc 0: raw diff = –11, wraps to +1 → correct sharp direction).
  if (diff > 6)  diff -= 12;
  if (diff < -6) diff += 12;

  // ACC is indexed by (diff + 3) so that diff=0 lands on index 3 (no accidental).
  // Unicode symbols: 𝄫 = double flat glyph, 𝄪 = double sharp glyph.
  const ACC = ['𝄫','♭♭','♭','','♯','♯♯','𝄪'];
  const accIndex = diff + 3;
  const accStr = (diff >= -2 && diff <= 2) ? ACC[accIndex] : '?';

  const displayName = targetLetterName + accStr;

  // Enharmonic equivalent in parentheses for double accidentals
  let enharmonicStr = '';
  if (diff === 2 || diff === -2) {
    // Double sharp or double flat — show enharmonic equivalent
    const enh = SHARP_NAMES_BASIC[targetPc] ?? FLAT_NAMES_BASIC[targetPc];
    enharmonicStr = '\u00a0(' + enh + ')'; // non-breaking space before paren
  }

  return displayName + enharmonicStr;
}

/**
 * Simple sharp-spelling name for each pitch class (0–11).
 * Used only to produce the enharmonic parenthetical when a double accidental
 * occurs (e.g. "F##\u00a0(G)"). Not used for primary spelling — use
 * spelledNote() for that.
 * @type {string[]}
 */
const SHARP_NAMES_BASIC = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];

/**
 * Simple flat-spelling name for each pitch class (0–11).
 * Used only to produce the enharmonic parenthetical when a double accidental
 * occurs (e.g. "B♭♭\u00a0(A)"). Not used for primary spelling — use
 * spelledNote() for that.
 * @type {string[]}
 */
const FLAT_NAMES_BASIC  = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

/**
 * Returns the display name of the root note itself (interval = unison).
 *
 * Natural pitch classes (0,2,4,5,7,9,11) always return the natural name.
 * Enharmonic pitch classes (1,3,6,8,10) respect `pinnedRootSpelling` when set;
 * otherwise the conventional flat-side preference applies (D♭ E♭ G♭ A♭ B♭).
 *
 * @param {number} rootPc - Pitch class of the root note (0–11).
 * @returns {string} Display name, e.g. "C♯" | "D♭" | "F" | "B♭".
 */
function spelledRoot(rootPc) {
  const pc = ((rootPc % 12) + 12) % 12;
  if (pinnedRootSpelling === 'flat')  return FLAT_NAMES_BASIC[pc];
  if (pinnedRootSpelling === 'sharp') return SHARP_NAMES_BASIC[pc];
  // Auto: conventional key-signature preference
  const FLAT_ROOT_PCS = new Set([1,3,6,8,10]);
  return FLAT_ROOT_PCS.has(pc) ? FLAT_NAMES_BASIC[pc] : SHARP_NAMES_BASIC[pc];
}

/**
 * Converts a MIDI note number to a VexFlow-compatible key string with correct
 * enharmonic spelling for the given harmonic context.
 *
 * Spelling is derived from spelledNote() using the interval from the root, then
 * translated to VexFlow's letter+accidental+octave format (e.g. "fbb/4").
 * Octave is corrected for letters that cross the C/B boundary relative to the
 * raw MIDI pitch class (e.g. Cb sounds like B but VexFlow places it one octave
 * higher on the staff; B## sounds like C# but belongs one octave lower).
 *
 * @param {number} midi - MIDI note number (0–127).
 * @param {number} intervalSemitones - Semitone distance from root to this note.
 * @param {number} rootPc - Pitch class of the root note (0–11).
 * @param {string} [symbol=''] - Chord or scale symbol for tritone/A5/d7 context.
 * @returns {string} VexFlow key string, e.g. "fbb/4" | "g##/3" | "bb/3" | "c#/5".
 */
function midiToVexKeySpelled(midi, intervalSemitones, rootPc, symbol) {
  let oct = Math.floor(midi / 12) - 1;
  // Get the display name (without enharmonic parenthetical)
  const full = spelledNote(intervalSemitones, rootPc, symbol);
  const base = full.split('\u00a0')[0]; // strip parenthetical if present

  // Extract letter and accidental for VexFlow
  const letter = base[0].toLowerCase();
  const acc    = base.slice(1); // e.g. '♯♯', '♭', '', '♯'

  // Map unicode accidentals to VexFlow suffixes
  const VEX_ACC = {
    '': '', '♯': '#', '♭': 'b', '♯♯': '##', '♭♭': 'bb',
    '𝄪': '##', '𝄫': 'bb',
  };
  const vexAcc = VEX_ACC[acc] ?? '';

  // Fix octave boundary: the spelled letter may cross the C/B octave line
  // relative to the raw MIDI pitch class.
  // e.g. Cb (letter C) sounds like B — MIDI puts it in oct N but the letter C
  // belongs one octave higher visually, so decrement oct.
  // e.g. B## (letter B) sounds like C# — MIDI puts it in oct N but the letter B
  // belongs one octave lower visually, so increment oct.
  const midiPc = midi % 12;
  if (letter === 'c' && midiPc >= 9) oct += 1;  // Cb/Cbb: sounds like B-range, letter is C
  if (letter === 'b' && midiPc <= 2) oct -= 1;  // B##/B#: sounds like C-range, letter is B

  return letter + vexAcc + '/' + oct;
}

/**
 * Extracts the VexFlow accidental token from a key string for use with
 * `StaveNote.addModifier(new Accidental(...))`.
 *
 * VexFlow requires explicit accidental objects even for notes covered by the
 * key signature when the notation engine has been told to force them. This
 * function parses the letter+accidental portion of the key string and returns
 * the token VexFlow expects, or null if the note is natural.
 *
 * The 'bb' (double flat) check requires length > 2 to distinguish the token
 * "bb" (B-flat) from "bbb/4" (B double-flat) — the leading letter 'b' is
 * part of the note name, not the accidental.
 *
 * @param {string} vexKey - VexFlow key string, e.g. "f#/4" | "eb/3" | "c##/5".
 * @returns {string|null} Accidental token ('##' | 'bb' | '#' | 'b') or null if natural.
 */
function vexAccidental(vexKey) {
  const n = vexKey.split('/')[0];
  if (n.endsWith('##')) return '##';
  if (n.endsWith('bb') && n.length > 2) return 'bb';
  if (n.endsWith('#'))  return '#';
  if (n.endsWith('b') && n.length > 1) return 'b';
  return null;
}

/**
 * Computes the ascending semitone interval from `rootPc` to `targetPc`,
 * always returning a value in the range 0–11.
 *
 * Used at call sites to convert a pair of pitch classes into the
 * `intervalSemitones` argument required by spelledNote() and
 * midiToVexKeySpelled(). The double-modulo pattern handles negative differences
 * (e.g. root=9, target=2 → (2-9+12)%12 = 5 semitones ascending).
 *
 * @param {number} targetPc - Pitch class of the target note (0–11).
 * @param {number} rootPc - Pitch class of the root note (0–11).
 * @returns {number} Ascending semitone distance (0–11).
 */
function pcInterval(targetPc, rootPc) {
  return ((targetPc - rootPc) % 12 + 12) % 12;
}

// =============================================================================
// The Sound Travels Ear Training — spelling.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
