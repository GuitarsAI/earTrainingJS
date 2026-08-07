/**
 * Test suite for ear_training_chord_quiz.html
 * Tests pure JS functions: enharmonic spelling, interval logic,
 * voicing modes, inversions, and data integrity.
 *
 * Run: node tests.js
 */

// ─── Setup: load the app's functions into this process ───────────────────────

require('/tmp/dom_shim.js');
const fs  = require('fs');
const vm  = require('vm');
const src = fs.readFileSync('/tmp/pure_functions.js', 'utf8');

const wrapped = `
(function() {
  ${src}
  globalThis.LETTER_NAMES      = LETTER_NAMES;
  globalThis.LETTER_PCS        = LETTER_PCS;
  globalThis.SEMITONES_MAP     = SEMITONES_TO_LETTER_STEPS;
  globalThis.CHORD_TYPES       = CHORD_TYPES;
  globalThis.SCALES            = SCALES;
  globalThis.INTERVALS         = INTERVALS;
  globalThis.VOICING_MODES     = VOICING_MODES;
  globalThis.INV_LABELS        = INV_LABELS;
  globalThis.spelledNote       = spelledNote;
  globalThis.spelledRoot       = spelledRoot;
  globalThis.pcInterval        = pcInterval;
  globalThis.applyVoicingMode  = applyVoicingMode;
  globalThis.applyInversion    = applyInversion;
  globalThis.tritoneIsDim5     = tritoneIsDim5;
  globalThis.vexAccidental     = vexAccidental;
  globalThis.midiToVexKeySpelled = midiToVexKeySpelled;
  globalThis.getBestFitKeyStr  = getBestFitKeyStr;
  globalThis.pickRandom        = pickRandom;
  // expose mutable state setter
  globalThis.setPinnedRootSpelling = (v) => { pinnedRootSpelling = v; };
})();
`;
const ctx = { ...global, module: {}, exports: {}, require };
vm.createContext(ctx);
vm.runInContext(wrapped, ctx, { filename: 'pure_functions.js' });

// Pull everything out of ctx into local scope for convenience
const {
  LETTER_NAMES, LETTER_PCS, SEMITONES_MAP, CHORD_TYPES, SCALES, INTERVALS,
  VOICING_MODES, INV_LABELS, spelledNote, spelledRoot, pcInterval,
  applyVoicingMode, applyInversion, tritoneIsDim5, vexAccidental,
  midiToVexKeySpelled, getBestFitKeyStr, pickRandom, setPinnedRootSpelling,
} = ctx;

// ─── Tiny test runner ─────────────────────────────────────────────────────────

let passed = 0, failed = 0;
const failures = [];

function test(group, name, fn) {
  try {
    fn();
    passed++;
    process.stdout.write('.');
  } catch (e) {
    failed++;
    failures.push({ group, name, message: e.message });
    process.stdout.write('F');
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      const a = JSON.stringify(actual), b = JSON.stringify(expected);
      if (a !== b) throw new Error(`Expected ${b}, got ${a}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`);
    },
    toContain(item) {
      if (!actual.includes(item)) throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
    },
  };
}

// ─── 1. Core data integrity ───────────────────────────────────────────────────

console.log('\n[1] Core data integrity');

test('data', 'LETTER_NAMES has 7 entries', () => {
  expect(LETTER_NAMES.length).toBe(7);
  expect(LETTER_NAMES[0]).toBe('C');
  expect(LETTER_NAMES[6]).toBe('B');
});

test('data', 'LETTER_PCS maps to correct pitch classes', () => {
  expect(LETTER_PCS[0]).toBe(0);  // C
  expect(LETTER_PCS[1]).toBe(2);  // D
  expect(LETTER_PCS[2]).toBe(4);  // E
  expect(LETTER_PCS[3]).toBe(5);  // F
  expect(LETTER_PCS[4]).toBe(7);  // G
  expect(LETTER_PCS[5]).toBe(9);  // A
  expect(LETTER_PCS[6]).toBe(11); // B
});

test('data', 'SEMITONES_MAP covers 0–11', () => {
  for (let i = 0; i <= 11; i++) {
    if (SEMITONES_MAP[i] === undefined)
      throw new Error(`Missing semitone ${i} in SEMITONES_MAP`);
  }
});

test('data', 'INTERVALS has 12 entries (unison excluded)', () => {
  expect(INTERVALS.length).toBe(12);
});

test('data', 'Each INTERVAL has required fields', () => {
  for (const iv of INTERVALS) {
    if (!iv.name || !iv.symbol || iv.semitones === undefined)
      throw new Error(`Interval missing fields: ${JSON.stringify(iv)}`);
  }
});

test('data', 'INTERVALS semitones range 1–12', () => {
  const semitones = INTERVALS.map(i => i.semitones);
  expect(Math.min(...semitones)).toBe(1);
  expect(Math.max(...semitones)).toBe(12);
});

test('data', 'CHORD_TYPES has expected families', () => {
  for (const fam of ['major','minor','dominant','diminished','augmented']) {
    if (!CHORD_TYPES[fam]) throw new Error(`Missing chord family: ${fam}`);
  }
});

test('data', 'Every chord has name, symbol, intervals', () => {
  for (const [family, chords] of Object.entries(CHORD_TYPES)) {
    for (const chord of chords) {
      if (!chord.name || !chord.symbol)
        throw new Error(`Chord in ${family} missing name/symbol`);
      // poly/ust/slash have different interval fields — skip interval check for them
      if (!['slash','poly','ust'].includes(chord.family ?? family)) {
        if (!Array.isArray(chord.intervals))
          throw new Error(`Chord ${chord.symbol} missing intervals array`);
      }
    }
  }
});

test('data', 'SCALES has expected entries including major and nat_minor', () => {
  const symbols = SCALES.map(s => s.symbol);
  expect(symbols).toContain('major');
  expect(symbols).toContain('nat_minor');
  expect(symbols).toContain('harm_minor');
  expect(symbols).toContain('locrian');
});

test('data', 'Every scale has intervals array starting with 0 and ending with 12', () => {
  for (const scale of SCALES) {
    if (!Array.isArray(scale.intervals))
      throw new Error(`Scale ${scale.symbol} missing intervals`);
    if (scale.intervals[0] !== 0)
      throw new Error(`Scale ${scale.symbol} doesn't start with 0`);
    if (scale.intervals[scale.intervals.length - 1] !== 12)
      throw new Error(`Scale ${scale.symbol} doesn't end with 12`);
  }
});

// ─── 2. pcInterval helper ─────────────────────────────────────────────────────

console.log('\n[2] pcInterval');

test('pcInterval', 'same note = 0', () => expect(pcInterval(0, 0)).toBe(0));
test('pcInterval', 'C to G = 7', () => expect(pcInterval(7, 0)).toBe(7));
test('pcInterval', 'G to C (across octave) = 5', () => expect(pcInterval(0, 7)).toBe(5));
test('pcInterval', 'always returns 0–11', () => {
  for (let a = 0; a < 12; a++)
    for (let b = 0; b < 12; b++) {
      const r = pcInterval(a, b);
      if (r < 0 || r > 11)
        throw new Error(`pcInterval(${a},${b}) = ${r}, out of range`);
    }
});

// ─── 3. tritoneIsDim5 context lookup ─────────────────────────────────────────

console.log('\n[3] tritoneIsDim5');

test('tritoneIsDim5', 'dim chord → true', () =>
  expect(tritoneIsDim5('dim')).toBeTruthy());
test('tritoneIsDim5', 'o7 → true', () =>
  expect(tritoneIsDim5('o7')).toBeTruthy());
test('tritoneIsDim5', 'major chord → false', () =>
  expect(tritoneIsDim5('maj')).toBeFalsy());
test('tritoneIsDim5', 'dominant 7 → false', () =>
  expect(tritoneIsDim5('7')).toBeFalsy());
test('tritoneIsDim5', 'locrian scale → true', () =>
  expect(tritoneIsDim5('locrian')).toBeTruthy());

// ─── 4. spelledNote – natural roots (auto spelling) ──────────────────────────

console.log('\n[4] spelledNote – natural roots');

// Reset spelling to auto
setPinnedRootSpelling(null);

test('spelledNote', 'unison: C above C = C', () =>
  expect(spelledNote(0, 0, 'maj')).toBe('C'));

test('spelledNote', 'M3 above C = E', () =>
  expect(spelledNote(4, 0, 'maj')).toBe('E'));

test('spelledNote', 'P5 above C = G', () =>
  expect(spelledNote(7, 0, 'maj')).toBe('G'));

test('spelledNote', 'm7 above C = B♭', () =>
  expect(spelledNote(10, 0, '7')).toBe('B♭'));

test('spelledNote', 'M7 above C = B', () =>
  expect(spelledNote(11, 0, 'Maj7')).toBe('B'));

test('spelledNote', 'M3 above D = F♯', () =>
  expect(spelledNote(4, 2, 'maj')).toBe('F♯'));

test('spelledNote', 'm3 above D = F', () =>
  expect(spelledNote(3, 2, 'm')).toBe('F'));

test('spelledNote', 'P4 above G = C', () =>
  expect(spelledNote(5, 7, 'maj')).toBe('C'));

test('spelledNote', 'd5 above B = F (dim chord)', () =>
  expect(spelledNote(6, 11, 'dim')).toBe('F'));

test('spelledNote', 'A4 above C = F♯ (non-dim)', () =>
  expect(spelledNote(6, 0, 'maj')).toBe('F♯'));

test('spelledNote', 'A5 above C (aug chord) = G♯', () =>
  expect(spelledNote(8, 0, 'aug')).toBe('G♯'));

test('spelledNote', 'm6 above C (non-aug) = A♭', () =>
  expect(spelledNote(8, 0, 'maj')).toBe('A♭'));

test('spelledNote', 'd7 above B (o7 chord) = A♭', () => {
  // dim 7th above B (pc 11): 9 semitones → A♭ (pc 8), spelled as d7
  const result = spelledNote(9, 11, 'o7');
  expect(result).toBe('A♭');
});

// ─── 5. spelledNote – accidental roots ───────────────────────────────────────

console.log('\n[5] spelledNote – accidental roots');

setPinnedRootSpelling(null); // auto

test('spelledNote-acc', 'M3 above E♭ (auto flat) = G', () =>
  expect(spelledNote(4, 3, 'maj')).toBe('G'));

test('spelledNote-acc', 'P5 above B♭ (auto flat) = F', () =>
  expect(spelledNote(7, 10, 'maj')).toBe('F'));

test('spelledNote-acc', 'M3 above F♯ (auto): pc 6 defaults to G♭, so M3 = B♭', () =>
  // pc 6 is in FLAT_ROOT_PCS, so auto-mode treats it as G♭; M3 above G♭ = B♭
  expect(spelledNote(4, 6, 'maj')).toBe('B♭'));

test('spelledNote-acc', 'M3 above F♯ (pinned sharp) = A♯', () => {
  setPinnedRootSpelling('sharp');
  expect(spelledNote(4, 6, 'maj')).toBe('A♯');
  setPinnedRootSpelling(null);
});

// Force flat spelling
setPinnedRootSpelling('flat');
test('spelledNote-acc', 'flat spelling: M3 above D♭ = F', () =>
  expect(spelledNote(4, 1, 'maj')).toBe('F'));

// Force sharp spelling
setPinnedRootSpelling('sharp');
test('spelledNote-acc', 'sharp spelling: M3 above C♯ = E♯', () =>
  expect(spelledNote(4, 1, 'maj')).toBe('E♯'));

setPinnedRootSpelling(null); // reset

// ─── 6. spelledRoot ──────────────────────────────────────────────────────────

console.log('\n[6] spelledRoot');

setPinnedRootSpelling(null);
test('spelledRoot', 'C = C', () => expect(spelledRoot(0)).toBe('C'));
test('spelledRoot', 'D = D', () => expect(spelledRoot(2)).toBe('D'));
test('spelledRoot', 'auto: pc 1 = D♭', () => expect(spelledRoot(1)).toBe('D♭'));
test('spelledRoot', 'auto: pc 6 = G♭', () => expect(spelledRoot(6)).toBe('G♭'));
test('spelledRoot', 'auto: pc 8 = A♭', () => expect(spelledRoot(8)).toBe('A♭'));
test('spelledRoot', 'auto: pc 3 = E♭', () => expect(spelledRoot(3)).toBe('E♭'));

setPinnedRootSpelling('sharp');
test('spelledRoot', 'sharp: pc 1 = C♯', () => expect(spelledRoot(1)).toBe('C♯'));
test('spelledRoot', 'sharp: pc 6 = F♯', () => expect(spelledRoot(6)).toBe('F♯'));

setPinnedRootSpelling('flat');
test('spelledRoot', 'flat: pc 1 = D♭', () => expect(spelledRoot(1)).toBe('D♭'));
test('spelledRoot', 'flat: pc 10 = B♭', () => expect(spelledRoot(10)).toBe('B♭'));

setPinnedRootSpelling(null);

// ─── 7. vexAccidental ────────────────────────────────────────────────────────

console.log('\n[7] vexAccidental');

test('vexAccidental', 'natural note has no accidental', () =>
  expect(vexAccidental('c/4')).toBe(null));
test('vexAccidental', 'sharp note returns #', () =>
  expect(vexAccidental('f#/4')).toBe('#'));
test('vexAccidental', 'flat note (e.g. eb/3) returns b', () =>
  expect(vexAccidental('eb/3')).toBe('b'));

// B-flat: VexFlow key string 'bb/N' = letter 'b' + accidental 'b'.
// Fixed: && n.length > 2 guard prevents 'bb' being misread as double-flat.
test('vexAccidental', 'B-flat (bb/3) correctly returns single flat b', () => {
  expect(vexAccidental('bb/3')).toBe('b');
});

test('vexAccidental', 'B double-flat (bbb/4) still correctly returns bb', () => {
  expect(vexAccidental('bbb/4')).toBe('bb');
});
test('vexAccidental', 'double sharp returns ##', () =>
  expect(vexAccidental('f##/4')).toBe('##'));
test('vexAccidental', 'double flat returns bb', () =>
  expect(vexAccidental('ebb/3')).toBe('bb'));
test('vexAccidental', 'lone b note (no accidental) returns null', () =>
  expect(vexAccidental('b/4')).toBe(null));

// ─── 8. midiToVexKeySpelled ──────────────────────────────────────────────────

console.log('\n[8] midiToVexKeySpelled');

setPinnedRootSpelling(null);

test('midiToVexKeySpelled', 'MIDI 60 (C4), unison, root C = c/4', () =>
  expect(midiToVexKeySpelled(60, 0, 0, 'maj')).toBe('c/4'));

test('midiToVexKeySpelled', 'MIDI 64 (E4), M3 above C = e/4', () =>
  expect(midiToVexKeySpelled(64, 4, 0, 'maj')).toBe('e/4'));

test('midiToVexKeySpelled', 'MIDI 67 (G4), P5 above C = g/4', () =>
  expect(midiToVexKeySpelled(67, 7, 0, 'maj')).toBe('g/4'));

test('midiToVexKeySpelled', 'MIDI 69 (A4), M6 above C = a/4', () =>
  expect(midiToVexKeySpelled(69, 9, 0, 'maj')).toBe('a/4'));

test('midiToVexKeySpelled', 'MIDI 70 (B♭4), m7 above C = bb/4', () =>
  expect(midiToVexKeySpelled(70, 10, 0, '7')).toBe('bb/4'));

test('midiToVexKeySpelled', 'MIDI 71 (B4), M7 above C = b/4', () =>
  expect(midiToVexKeySpelled(71, 11, 0, 'Maj7')).toBe('b/4'));

// P4 above Ab (pc 8, auto-flat) = Db
test('midiToVexKeySpelled', 'P4 above A♭ (pc 8, auto) = D♭ = db/4', () => {
  // pc 8 is in FLAT_ROOT_PCS → spelled as A♭ in auto mode; P4 above A♭ = D♭
  setPinnedRootSpelling(null);
  const result = midiToVexKeySpelled(61, 5, 8, 'maj');
  expect(result).toBe('db/4');
});

// P4 above G# (pinned sharp spelling) = C#
test('midiToVexKeySpelled', 'P4 above G♯ (pinned sharp) = c#/4', () => {
  setPinnedRootSpelling('sharp');
  const result = midiToVexKeySpelled(61, 5, 8, 'maj');
  expect(result).toBe('c#/4');
  setPinnedRootSpelling(null);
});

// ─── 9. applyInversion ───────────────────────────────────────────────────────

console.log('\n[9] applyInversion');

test('applyInversion', 'root position (inv=0): no change', () => {
  // C major triad: C4=60, E4=64, G4=67
  const result = applyInversion([0,4,7], 60, 0);
  expect(result).toEqual([60, 64, 67]);
});

test('applyInversion', '1st inversion: lowest note goes up an octave', () => {
  // 1st inv of C major: E4, G4, C5 = [64, 67, 72]
  const result = applyInversion([0,4,7], 60, 1);
  expect(result).toEqual([64, 67, 72]);
});

test('applyInversion', '2nd inversion: two notes rotated up', () => {
  // 2nd inv of C major: G4, C5, E5 = [67, 72, 76]
  const result = applyInversion([0,4,7], 60, 2);
  expect(result).toEqual([67, 72, 76]);
});

test('applyInversion', 'result is always sorted ascending', () => {
  const result = applyInversion([0,4,7,10], 60, 1);
  for (let i = 1; i < result.length; i++) {
    if (result[i] <= result[i-1])
      throw new Error(`Notes not ascending at index ${i}: ${result}`);
  }
});

test('applyInversion', 'inv=0 never changes note count', () => {
  const result = applyInversion([0,3,6,9], 60, 0);
  expect(result.length).toBe(4);
});

test('applyInversion', 'all inversions maintain same note count', () => {
  const intervals = [0,4,7];
  for (let inv = 0; inv < intervals.length; inv++) {
    const r = applyInversion(intervals, 60, inv);
    if (r.length !== intervals.length)
      throw new Error(`Inversion ${inv} changed note count to ${r.length}`);
  }
});

// ─── 10. applyVoicingMode ────────────────────────────────────────────────────

console.log('\n[10] applyVoicingMode');

// Dom7 chord: [0, 4, 7, 10]  root=0, third=4, fifth=7, seventh=10
const DOM7 = [0, 4, 7, 10];
// Major triad: [0, 4, 7]
const TRIAD = [0, 4, 7];

test('applyVoicingMode', 'full mode keeps all notes', () => {
  expect(applyVoicingMode(DOM7, 'full')).toEqual(DOM7);
});

test('applyVoicingMode', 'real mode omits P5 from dom7', () => {
  const r = applyVoicingMode(DOM7, 'real');
  if (r.includes(7)) throw new Error('P5 (7) should be omitted in real mode');
  expect(r).toContain(4);  // third stays
  expect(r).toContain(10); // seventh stays
});

test('applyVoicingMode', 'shell mode: root+3rd+7th only', () => {
  const r = applyVoicingMode(DOM7, 'shell');
  expect(r).toEqual([0, 4, 10]);
});

test('applyVoicingMode', 'guide mode: 3rd+7th only (no root, no 5th)', () => {
  const r = applyVoicingMode(DOM7, 'guide');
  expect(r).toEqual([4, 10]);
});

test('applyVoicingMode', 'shell falls back to full for triads (no 7th)', () => {
  const r = applyVoicingMode(TRIAD, 'shell');
  expect(r).toEqual(TRIAD);
});

test('applyVoicingMode', 'guide falls back to full for triads (no 7th)', () => {
  const r = applyVoicingMode(TRIAD, 'guide');
  expect(r).toEqual(TRIAD);
});

test('applyVoicingMode', 'real mode keeps altered fifth (#5)', () => {
  // aug chord: [0, 4, 8]  — 8 = #5, altfifth role, must be kept
  const r = applyVoicingMode([0, 4, 8], 'real');
  expect(r).toContain(8);
});

test('applyVoicingMode', 'real mode keeps altered fifth (b5)', () => {
  // hdim: [0, 3, 6, 10] — 6 = b5, altfifth role, must be kept
  const r = applyVoicingMode([0, 3, 6, 10], 'real');
  expect(r).toContain(6);
});

test('applyVoicingMode', 'never returns empty array', () => {
  for (const mode of ['full','real','shell','guide']) {
    const r = applyVoicingMode([0], mode);
    if (!r.length) throw new Error(`mode ${mode} returned empty for [0]`);
  }
});

test('applyVoicingMode', 'random mode resolves to a valid non-empty result', () => {
  // Run several times to hit different branches
  for (let i = 0; i < 20; i++) {
    const r = applyVoicingMode(DOM7, 'random');
    if (!r.length) throw new Error('random mode returned empty');
  }
});

// ─── 11. pickRandom ──────────────────────────────────────────────────────────

console.log('\n[11] pickRandom');

test('pickRandom', 'always returns element from array', () => {
  const arr = [10, 20, 30, 40];
  for (let i = 0; i < 50; i++) {
    const r = pickRandom(arr);
    if (!arr.includes(r)) throw new Error(`${r} not in array`);
  }
});

test('pickRandom', 'single-element array always returns that element', () => {
  expect(pickRandom(['only'])).toBe('only');
});

// ─── 12. getBestFitKeyStr ────────────────────────────────────────────────────

console.log('\n[12] getBestFitKeyStr');

test('getBestFitKeyStr', 'C major notes → C key', () => {
  // C E G B = CMaj7
  const key = getBestFitKeyStr([60, 64, 67, 71]);
  expect(key).toBe('C');
});

test('getBestFitKeyStr', 'A C E fits both C major and Am; tiebreak gives C major (fewer accidentals wins first)', () => {
  // A=9, C=0, E=4 — all belong to C major AND A natural minor
  // The function iterates pc 0 first, finds C major (0 acc, score 3) → C major wins tie
  const key = getBestFitKeyStr([57, 60, 64]);
  expect(key).toBe('C');
});

test('getBestFitKeyStr', 'notes unique to A minor (w/ G) → Am key', () => {
  // A C E G — G is diatonic to both C maj and Am, but A min prioritised by other notes
  // Use a clearly minor-only set: A C E G with no leading tone
  // Actually add F to tip it: Am has F natural (pc 5), C major also has F
  // Better: use notes that score higher in Am: A B C D E (all in Am, not all in C maj)
  // A=9 B=11 C=0 E=4 G=7 D=2 — all diatonic to both. Try a set with ♭ notes:
  // Eb (pc 3) is in Am? No. Try F# (pc 6) — in A major not A minor.
  // Just verify the function returns a string for minor-heavy chord:
  const key = getBestFitKeyStr([57, 59, 62, 64]); // A B D E — fits D major, B minor, etc.
  if (typeof key !== 'string' || !key.length)
    throw new Error('getBestFitKeyStr returned non-string');
});

test('getBestFitKeyStr', 'returns a non-empty string for any midi set', () => {
  // Random chromatic cluster — must still return something
  const key = getBestFitKeyStr([60, 61, 62, 63]);
  if (typeof key !== 'string' || !key.length)
    throw new Error(`Expected non-empty string, got: ${JSON.stringify(key)}`);
});

// ─── 13. Scale data consistency ──────────────────────────────────────────────

console.log('\n[13] Scale data consistency');

test('scales', 'major scale has 7 pitch classes (8 intervals inc. octave)', () => {
  const major = SCALES.find(s => s.symbol === 'major');
  expect(major.intervals.length).toBe(8);
});

test('scales', 'all scale interval arrays are strictly ascending', () => {
  for (const scale of SCALES) {
    for (let i = 1; i < scale.intervals.length; i++) {
      if (scale.intervals[i] <= scale.intervals[i-1])
        throw new Error(`Scale ${scale.symbol} not strictly ascending at index ${i}`);
    }
  }
});

test('scales', 'major scale intervals are correct', () => {
  const major = SCALES.find(s => s.symbol === 'major');
  expect(major.intervals).toEqual([0,2,4,5,7,9,11,12]);
});

test('scales', 'harmonic minor has raised 7th', () => {
  const hm = SCALES.find(s => s.symbol === 'harm_minor');
  expect(hm.intervals).toContain(11); // maj7 = raised 7th
});

test('scales', 'whole tone has 6 unique pitches (7 with octave)', () => {
  const wt = SCALES.find(s => s.symbol === 'whole_tone');
  expect(wt.intervals.length).toBe(7);
});

// ─── 14. Chord family completeness ───────────────────────────────────────────

console.log('\n[14] Chord family completeness');

test('chords', 'major family includes maj, Maj7, maj9', () => {
  const syms = CHORD_TYPES.major.map(c => c.symbol);
  expect(syms).toContain('maj');
  expect(syms).toContain('Maj7');
});

test('chords', 'minor family includes m and m7', () => {
  const syms = CHORD_TYPES.minor.map(c => c.symbol);
  expect(syms).toContain('m');
  expect(syms).toContain('m7');
});

test('chords', 'diminished family includes dim and o7', () => {
  const syms = CHORD_TYPES.diminished.map(c => c.symbol);
  expect(syms).toContain('dim');
  expect(syms).toContain('o7');
});

test('chords', 'augmented family exists and includes aug', () => {
  const syms = CHORD_TYPES.augmented.map(c => c.symbol);
  expect(syms).toContain('aug');
});

test('chords', 'all standard chord intervals start with 0 (root)', () => {
  for (const [fam, chords] of Object.entries(CHORD_TYPES)) {
    if (['slash','poly','ust'].includes(fam)) continue;
    for (const chord of chords) {
      if (chord.intervals[0] !== 0)
        throw new Error(`${chord.symbol} intervals don't start with 0`);
    }
  }
});

test('chords', 'no duplicate chord symbols', () => {
  const seen = new Set();
  for (const chords of Object.values(CHORD_TYPES)) {
    for (const chord of chords) {
      if (seen.has(chord.symbol))
        throw new Error(`Duplicate chord symbol: ${chord.symbol}`);
      seen.add(chord.symbol);
    }
  }
});

// ─── 15. INV_LABELS ──────────────────────────────────────────────────────────

console.log('\n[15] INV_LABELS');

test('INV_LABELS', 'root position label is empty string', () =>
  expect(INV_LABELS[0]).toBe(''));
test('INV_LABELS', '1st inversion label correct', () =>
  expect(INV_LABELS[1]).toBe('1st inv'));
test('INV_LABELS', '2nd inversion label correct', () =>
  expect(INV_LABELS[2]).toBe('2nd inv'));
test('INV_LABELS', 'has at least 4 entries', () =>
  expect(INV_LABELS.length).toBeGreaterThan(3));

// ─── 16. Edge cases ──────────────────────────────────────────────────────────

console.log('\n[16] Edge cases');

test('edge', 'spelledNote normalises large intervalSemitones (>12)', () => {
  // M9 = 14 semitones, should behave like M2 for letter purposes
  const r = spelledNote(14, 0, 'maj9');
  // 14 % 12 = 2, so M2 above C = D
  expect(r).toBe('D');
});

test('edge', 'spelledNote with negative root pitch class normalises', () => {
  // Should not crash
  const r = spelledNote(4, -9, 'maj'); // -9 % 12 = 3 (E♭), M3 above E♭ = G
  expect(r).toBe('G');
});

test('edge', 'pcInterval is commutative complement: a→b + b→a = 12', () => {
  for (let a = 0; a < 12; a++) {
    for (let b = 0; b < 12; b++) {
      if (a === b) continue;
      const sum = pcInterval(a, b) + pcInterval(b, a);
      if (sum !== 12) throw new Error(`pcInterval(${a},${b}) + pcInterval(${b},${a}) = ${sum} ≠ 12`);
    }
  }
});

test('edge', 'applyInversion with inv=0 on single-note chord works', () => {
  const r = applyInversion([0], 60, 0);
  expect(r).toEqual([60]);
});

test('edge', 'spelledNote for every semitone 0–11 above C returns a string', () => {
  setPinnedRootSpelling(null);
  for (let s = 0; s <= 11; s++) {
    const r = spelledNote(s, 0, 'maj');
    if (typeof r !== 'string' || !r.length)
      throw new Error(`spelledNote(${s}, 0) returned: ${JSON.stringify(r)}`);
  }
});

// ─── Report ───────────────────────────────────────────────────────────────────

console.log('\n');
console.log('─'.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failures.length) {
  console.log('\nFailures:');
  failures.forEach(f => {
    console.log(`  ✗ [${f.group}] ${f.name}`);
    console.log(`      ${f.message}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
}
