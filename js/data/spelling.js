// ─── Data ─────────────────────────────────────────────────────────────────────

const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// ─── POINT 13: Enharmonic spelling engine (interval-based rewrite) ───────────
//
// The fundamental rule: the INTERVAL from the root determines the letter name.
// A major 3rd above D# must be F## — not G — because it is the 3rd degree.
// A diminished 7th above B must be Ab — not G# — because it is the 7th degree.
// When a double sharp (##) or double flat (bb) results, we append the enharmonic
// equivalent in parentheses, e.g. "F## (G)", so students see both the theoretically
// correct spelling and the practical reading pitch.
//
// Architecture:
//   spelledNote(intervalSemitones, rootPc)
//     → returns display string, e.g. "F##\u00a0(G)" or "B♭" or "E"
//   midiToVexKeySpelled(midi, intervalSemitones, rootPc)
//     → returns VexFlow key string, e.g. "fbb/4" or "g##/3"
//   vexAccidental(vexKey)
//     → returns VexFlow accidental token or null
//
// The old spelledNote(pitchClass, symbol, rootPc) API is replaced everywhere
// by spelledNote(intervalSemitones, rootPc). All call sites updated below.

// The 7 letter names in chromatic order from C (pitch class 0)
// Letter index: C=0, D=1, E=2, F=3, G=4, A=5, B=6
const LETTER_PCS = [0, 2, 4, 5, 7, 9, 11]; // pitch class of each natural letter (C D E F G A B)
const LETTER_NAMES = ['C','D','E','F','G','A','B'];

// Interval number → letter steps above root (0-based, mod 7)
// Unison=0, 2nd=1, 3rd=2, 4th=3, 5th=4, 6th=5, 7th=6, 8th/9th/etc wrap
// We derive letter steps from the interval semitone count using standard diatonic mapping.
// semitones → diatonic interval number (0-based letter steps):
// 0=unison(0), 1=m2(1), 2=M2(1), 3=m3(2), 4=M3(2), 5=P4(3), 6=A4/d5(3or4),
// 7=P5(4), 8=m6(5), 9=M6(5), 10=m7(6), 11=M7(6), 12=P8(0+octave)
// Extended: 13=m9(1+oct), 14=M9(1+oct), 17=P11(3+oct), 18=A11(3+oct), 20=m13(5+oct), 21=M13(5+oct)
//
// We use the interval's "generic" size (2nd, 3rd, 4th…) to pick the letter,
// then compute the accidental from the difference between that letter's natural
// pitch class and the actual target pitch class.

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

// For tritone (6 semitones): context determines A4 vs d5.
// We expose a separate lookup for chord/scale symbols that use d5.
// Everything else defaults to A4 (augmented 4th = letter steps 3).
// Symbols that spell the tritone as a diminished 5th (letter steps 4):
const TRITONE_AS_D5 = new Set([
  'dim','m7b5','o7',           // diminished family — d5 in the chord
  'nat_minor','harm_minor','mel_minor', // minor scales — b5 degree is d5 context
  'locrian','phrygian','altered',       // modes with b5
]);

// Per-symbol: does the tritone interval (6 semitones) spell as d5 (letter steps 4)?
function tritoneIsDim5(symbol) {
  return TRITONE_AS_D5.has(symbol);
}

// For 8 semitones: context determines m6 (letter steps 5) vs A5 (letter steps 4).
// Default is m6. Symbols where 8 semitones IS an augmented 5th:
const EIGHT_AS_A5 = new Set([
  'aug', 'Maj7_s5',   // augmented chord family — the fifth IS augmented
  '7_s5',             // dominant 7 sharp 5
  'whole_tone',       // whole-tone scale: C D E F# G# A# — 8 semitones = G# = A5
]);

// For 9 semitones: context determines M6 (letter steps 5) vs d7 (letter steps 6).
// Default is M6. Symbols where 9 semitones IS a diminished 7th:
const NINE_AS_D7 = new Set([
  'o7',               // fully diminished 7th chord — the 7th IS diminished
]);

// Compute the spelled note name for a note that is `intervalSemitones` above rootPc.
// Returns a display string. Double accidentals get parenthetical enharmonic.
// intervalSemitones: the raw semitone distance (can be > 12 for extensions)
// rootPc: pitch class of the root (0–11)
// symbol: chord/scale/interval symbol (for tritone context only)
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

  // Root letter index (0=C … 6=B)
  const rootLetterIdx = LETTER_PCS.findIndex(pc => pc === rootPcN);
  // If root is not a natural note (e.g. root is C# = pc 1), find the correct letter
  // by consulting the user's spelling preference (pinnedRootSpelling), or falling back
  // to conventional key-signature rules when no root is pinned (Rnd mode).
  const rootLetterIdxResolved = (() => {
    if (rootLetterIdx !== -1) return rootLetterIdx; // natural root — no ambiguity
    // flat map:  pc 1→D(1), 3→E(2), 6→G(4), 8→A(5), 10→B(6)
    // sharp map: pc 1→C(0), 3→D(1), 6→F(3), 8→G(4), 10→A(5)
    const flatMap  = {1:1, 3:2, 6:4, 8:5, 10:6};
    const sharpMap = {1:0, 3:1, 6:3, 8:4, 10:5};
    if (pinnedRootSpelling === 'flat')  return flatMap[rootPcN]  ?? 0;
    if (pinnedRootSpelling === 'sharp') return sharpMap[rootPcN] ?? 0;
    // Auto: conventional key-signature preference (Db Eb Gb Ab Bb = flat)
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

  // Difference: how many semitones to adjust from the natural letter
  // We take the shortest path in range –2…+2 (double flat to double sharp)
  let diff = targetPc - naturalPc;
  // Wrap into –6…+6 to handle crossing the octave boundary
  if (diff > 6)  diff -= 12;
  if (diff < -6) diff += 12;

  // Build accidental string
  const ACC = ['𝄫','♭♭','♭','','♯','♯♯','𝄪'];
  //           diff: -3   -2   -1   0   +1   +2   +3  (we only support –2…+2)
  const accIndex = diff + 3; // shift so diff=0 → index 3
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

// Simple sharp/flat name arrays for enharmonic parentheticals only
// (used only when a double accidental occurs)
const SHARP_NAMES_BASIC = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const FLAT_NAMES_BASIC  = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

// Convenience: spell the ROOT note itself (interval = 0 from itself)
// rootPc: pitch class. Respects pinnedRootSpelling when set; otherwise uses
// conventional key-signature preference (flat keys: Db Eb Gb Ab Bb).
function spelledRoot(rootPc) {
  const pc = ((rootPc % 12) + 12) % 12;
  if (pinnedRootSpelling === 'flat')  return FLAT_NAMES_BASIC[pc];
  if (pinnedRootSpelling === 'sharp') return SHARP_NAMES_BASIC[pc];
  // Auto: conventional key-signature preference
  const FLAT_ROOT_PCS = new Set([1,3,6,8,10]);
  return FLAT_ROOT_PCS.has(pc) ? FLAT_NAMES_BASIC[pc] : SHARP_NAMES_BASIC[pc];
}

// Context-aware VexFlow key string (e.g. "fbb/4", "g##/3", "bb/3")
// midi: MIDI note number
// intervalSemitones: semitone distance from root to this note
// rootPc: root pitch class
// symbol: chord/scale symbol (for tritone context)
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

// Accidental token for VexFlow StaveNote from a vex key string
function vexAccidental(vexKey) {
  const n = vexKey.split('/')[0];
  if (n.endsWith('##')) return '##';
  if (n.endsWith('bb') && n.length > 2) return 'bb';
  if (n.endsWith('#'))  return '#';
  if (n.endsWith('b') && n.length > 1) return 'b';
  return null;
}

// ─── Interval-semitone helpers for call sites ─────────────────────────────────
// All old spelledNote(pitchClass, symbol, rootPc) calls are replaced with
// spelledNote(intervalSemitones, rootPc, symbol) where intervalSemitones is
// computed as (targetPc - rootPc + 12) % 12 at each call site.
// Helper to compute semitone interval from rootPc to a pitch class:
function pcInterval(targetPc, rootPc) {
  return ((targetPc - rootPc) % 12 + 12) % 12;
}
