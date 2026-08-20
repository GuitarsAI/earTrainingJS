/**
 * @file keysig.js
 * @description Key signature helpers: chip toggling, VexFlow key string
 *   resolution, best-fit key inference for complex chords, and key-signature
 *   coverage tracking used by the notation engine to suppress redundant
 *   accidentals on notes already covered by the active key signature.
 *
 * Coverage model: a key signature covers specific LETTER+ACCIDENTAL
 *   combinations, not raw pitch classes. E♭ major covers the letter E with a
 *   flat — it does NOT cover D♯ even though D♯ and E♭ share pitch class 3.
 *   Coverage is therefore tracked as a Set of VexFlow letter strings
 *   (e.g. {'bb','eb','ab','db','gb'}) and matched by letter identity, not
 *   pitch class.
 *
 * Dependencies:
 *   pinnedRootSpelling (state.js) — resolves enharmonic key ambiguity.
 *   currentMode, currentProgression, progAnswered, answered, appMode (state.js)
 *   showProgressionNotation(), showCurrentView(), showNotation(),
 *   showBreakdown() — rendering functions called after chip state changes.
 *
 * @module KeySig
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

/**
 * Handles a Key/C chip tap: updates the per-mode key-signature display
 * preference in state and re-renders the current notation and breakdown.
 *
 * Each mode stores its keySigMode independently so switching modes does not
 * reset the chip selection. Progressions mode re-renders mini staves directly;
 * chords mode uses the view dispatcher to correctly handle both the main chord
 * view and the resolution view.
 *
 * @param {'C'|'key'} mode - 'key' renders the staff with a key signature;
 *   'C' shows all accidentals explicitly with no key signature.
 */
function setKeySig(mode) {
  if (currentMode === 'scales')          scaleKeySigMode    = mode;
  else if (currentMode === 'chords')     chordKeySigMode    = mode;
  else if (currentMode === 'intervals')  intervalKeySigMode = mode;
  else if (currentMode === 'progressions') progKeySigMode   = mode;
  document.getElementById('keysigChipC').classList.toggle('active', mode === 'C');
  document.getElementById('keysigChipKey').classList.toggle('active', mode === 'key');
  // For progressions, re-render the mini staves directly
  if (currentMode === 'progressions' && currentProgression && progAnswered) {
    showProgressionNotation();
    if (appMode === 'dict' || answered) showBreakdown();
  } else if (currentMode === 'chords') {
    // BUG-4: use dispatcher so Key/C chip works in both chord and resolution views
    showCurrentView();
    if (appMode === 'dict' || answered) showBreakdown();
  } else {
    showNotation();
    if (appMode === 'dict' || answered) showBreakdown();
  }
}

/**
 * VexFlow major key signature strings indexed by pitch class (0–11), flat side.
 * Enharmonic pitch classes (1,3,6,8,10) use the flat-preferred spelling:
 * Db, Eb, Gb, Ab, Bb. Used when pinnedRootSpelling is 'flat' or unset.
 * @type {string[]}
 */
const VEX_KEY_MAJOR_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

/**
 * VexFlow major key signature strings indexed by pitch class (0–11), sharp side.
 * Enharmonic pitch classes use the sharp-preferred spelling: C#, D#, F#, G#, A#.
 * Used when pinnedRootSpelling is 'sharp'.
 * @type {string[]}
 */
const VEX_KEY_MAJOR_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

/**
 * VexFlow minor key signature strings indexed by pitch class (0–11), flat side.
 * @type {string[]}
 */
const VEX_KEY_MINOR_FLAT  = ['Am','Bbm','Bm','Cm','C#m','Dm','Ebm','Em','Fm','F#m','Gm','G#m'];

/**
 * VexFlow minor key signature strings indexed by pitch class (0–11), sharp side.
 * @type {string[]}
 */
const VEX_KEY_MINOR_SHARP = ['Am','A#m','Bm','Cm','C#m','Dm','D#m','Em','Fm','F#m','Gm','G#m'];

/**
 * Returns the VexFlow major key signature string for the given pitch class,
 * respecting pinnedRootSpelling. Defaults to the flat side for enharmonic pcs.
 *
 * @param {number} pc - Pitch class (0–11).
 * @returns {string} VexFlow key string, e.g. 'Eb' | 'D#' | 'G'.
 */
function vexKeyMajor(pc) {
  if (pinnedRootSpelling === 'sharp') return VEX_KEY_MAJOR_SHARP[pc];
  if (pinnedRootSpelling === 'flat')  return VEX_KEY_MAJOR_FLAT[pc];
  return VEX_KEY_MAJOR_FLAT[pc]; // conventional default = flat side
}

/**
 * Returns the VexFlow minor key signature string for the given pitch class,
 * respecting pinnedRootSpelling. Defaults to the flat side for enharmonic pcs.
 *
 * @param {number} pc - Pitch class (0–11).
 * @returns {string} VexFlow key string, e.g. 'Ebm' | 'D#m' | 'Gm'.
 */
function vexKeyMinor(pc) {
  if (pinnedRootSpelling === 'sharp') return VEX_KEY_MINOR_SHARP[pc];
  if (pinnedRootSpelling === 'flat')  return VEX_KEY_MINOR_FLAT[pc];
  return VEX_KEY_MINOR_FLAT[pc]; // conventional default
}

/**
 * Returns the VexFlow key signature string implied by a scale's parent key at
 * the given root pitch class, or null if the scale has no parent key.
 *
 * Modal scales are notated in their parent key's key signature rather than the
 * mode root's "key", because the parent key defines the actual accidentals in
 * use. For example, D Dorian is notated with C major's key signature (no sharps
 * or flats), not D major's (two sharps).
 *
 * @param {{ parentKey?: { offset: number, quality: 'major'|'minor' } }} scale
 *   - Scale data object; parentKey.offset is semitones from mode root to parent root.
 * @param {number} rootPc - Pitch class of the mode's root note (0–11).
 * @returns {string|null} VexFlow key string (e.g. 'C', 'Bb', 'F#m') or null.
 */
function getScaleParentKeyStr(scale, rootPc) {
  if (!scale.parentKey) return null;
  const { offset, quality } = scale.parentKey;
  const parentPc = ((rootPc + offset) % 12 + 12) % 12;
  return quality === 'minor' ? vexKeyMinor(parentPc) : vexKeyMajor(parentPc);
}

/**
 * Returns the VexFlow key signature string implied by a chord symbol and root
 * pitch class. Minor-quality chords use a minor key signature; all others use
 * a major key signature rooted on the chord's root.
 *
 * Used by the notation engine to place an appropriate key signature behind a
 * chord so that chord tones covered by the key are displayed without individual
 * accidentals.
 *
 * @param {string} sym - Chord symbol key (e.g. 'm7', 'Maj7', 'dim').
 * @param {number} rootPc - Pitch class of the chord root (0–11).
 * @returns {string} VexFlow key string, e.g. 'Am' | 'C' | 'Bb'.
 */
function getChordKeyStr(sym, rootPc) {
  const minorFamilies = ['m', 'm7', 'mM7', 'm6', 'm9', 'm11', 'm13', 'hdim', 'hdim7', 'dim', 'dim7'];
  const quality = minorFamilies.includes(sym) ? 'minor' : 'major';
  return quality === 'minor' ? vexKeyMinor(rootPc) : vexKeyMajor(rootPc);
}

/**
 * Infers the best-fit VexFlow key signature string for a set of MIDI notes by
 * finding the major or minor key whose scale shares the most pitch classes with
 * the chord. Ties are broken by fewest accidentals (proximity to C major /
 * A minor), minimising clutter on the staff.
 *
 * Used for polychords, Upper Structure Triads, and slash chords, where there is
 * no single unambiguous root key — the notation engine needs a key signature
 * that reduces accidentals without imposing an incorrect harmonic reading.
 *
 * @param {number[]} midiNotes - Array of MIDI note numbers in the chord.
 * @returns {string} VexFlow key string for the best-fitting key, e.g. 'Bb' | 'F#m'.
 */
function getBestFitKeyStr(midiNotes) {
  const chordPcs = new Set(midiNotes.map(m => ((m % 12) + 12) % 12));
  const MAJOR_SCALE = [0,2,4,5,7,9,11];
  const MINOR_SCALE = [0,2,3,5,7,8,10];
  // Accidental counts per root pc for major and minor (used as tiebreaker — fewer = closer to C)
  const MAJOR_ACC = [0,5,2,3,4,1,6,1,4,3,2,5]; // C Db D Eb E F Gb G Ab A Bb B
  const MINOR_ACC = [0,4,2,3,1,3,2,1,4,3,2,5]; // Am Bbm Bm Cm C#m Dm D#m Em Fm F#m Gm G#m
  let bestKey = null, bestScore = -1, bestAcc = 99, bestMinor = false;
  for (let pc = 0; pc < 12; pc++) {
    for (const [scale, acc, isMinor] of [
      [MAJOR_SCALE, MAJOR_ACC[pc], false],
      [MINOR_SCALE, MINOR_ACC[pc], true],
    ]) {
      const scalePcs = new Set(scale.map(i => (i + pc) % 12));
      let score = 0;
      for (const cp of chordPcs) if (scalePcs.has(cp)) score++;
      if (score > bestScore || (score === bestScore && acc < bestAcc)) {
        bestScore = score; bestAcc = acc; bestKey = pc; bestMinor = isMinor;
      }
    }
  }
  return bestMinor ? vexKeyMinor(bestKey) : vexKeyMajor(bestKey);
}

/**
 * Returns the VexFlow key signature string for an interval question, using the
 * lower note's pitch class as the root. Intervals are always contextualised as
 * major keys — there is no minor-quality distinction at the interval level.
 *
 * @param {number} rootPc - Pitch class of the lower (root) note (0–11).
 * @returns {string} VexFlow major key string, e.g. 'G' | 'Bb' | 'F#'.
 */
function getIntervalKeyStr(rootPc) {
  return vexKeyMajor(rootPc);
}

// ── Key-signature coverage helpers ───────────────────────────────────────────

/**
 * Number of sharps in each major key's key signature.
 * Keys not present here are flat keys (see MAJOR_FLATS_COUNT).
 * @type {Object.<string, number>}
 */
const MAJOR_SHARPS_COUNT = { C:0, G:1, D:2, A:3, E:4, B:5, 'F#':6, 'C#':7 };

/**
 * Number of flats in each major key's key signature.
 * C appears in both tables with count 0 — it is the neutral key.
 * @type {Object.<string, number>}
 */
const MAJOR_FLATS_COUNT  = { C:0, F:1, Bb:2, Eb:3, Ab:4, Db:5, Gb:6, Cb:7 };

/**
 * Maps VexFlow minor key strings to their relative major key string.
 * Used to look up accidental counts for minor keys via their relative major.
 * @type {Object.<string, string>}
 */
const MINOR_TO_REL_MAJOR = {
  Am:'C', Bm:'D', Cm:'Eb', 'C#m':'E', Dm:'F', 'D#m':'F#', Em:'G',
  Fm:'Ab', 'F#m':'A', Gm:'Bb', 'G#m':'B', Bbm:'Db', Ebm:'Gb',
};

/**
 * The order in which sharps appear in key signatures, as VexFlow letter strings.
 * F♯ is always first (one-sharp keys); B♯ is last (seven-sharp keys).
 * @type {string[]}
 */
const SHARP_ORDER_LETTERS = ['f#','c#','g#','d#','a#','e#','b#'];

/**
 * The order in which flats appear in key signatures, as VexFlow letter strings.
 * B♭ is always first (one-flat keys); F♭ is last (seven-flat keys).
 * @type {string[]}
 */
const FLAT_ORDER_LETTERS  = ['bb','eb','ab','db','gb','cb','fb'];

/**
 * Resolves a VexFlow key string (major or minor) to its major key equivalent
 * for accidental-count lookups. Minor keys are converted to their relative
 * major; major keys are returned unchanged; null/undefined returns 'C'.
 *
 * @param {string|null} vexKeyStr - VexFlow key string, e.g. 'Bb' | 'F#m' | null.
 * @returns {string} Major key string, e.g. 'Bb' | 'A' | 'C'.
 * @private
 */
function _getMajorKey(vexKeyStr) {
  if (!vexKeyStr) return 'C';
  if (vexKeyStr.endsWith('m')) return MINOR_TO_REL_MAJOR[vexKeyStr] ?? 'C';
  return vexKeyStr;
}

/**
 * Returns the set of VexFlow letter strings covered by the given key signature.
 *
 * Each string in the returned Set is a letter+accidental combination that the
 * key signature makes implicit — e.g. {'bb','eb','ab','db','gb'} for D♭ major.
 * The notation engine uses this set to decide whether to suppress an accidental
 * (if covered) or force it to appear (if not).
 *
 * Coverage is letter-based, not pitch-class based: 'eb' in the set means the
 * letter E with a flat is covered, but 'D#' (same pitch class) is not.
 *
 * @param {string|null} vexKeyStr - VexFlow key string (e.g. 'Eb' | 'F#m' | null).
 * @returns {Set<string>} Set of covered VexFlow letter strings, e.g. {'bb','eb'}.
 */
function keySigCoveredLetters(vexKeyStr) {
  if (!vexKeyStr) return new Set();
  const majorKey = _getMajorKey(vexKeyStr);
  const covered = new Set();
  if (MAJOR_SHARPS_COUNT[majorKey] !== undefined) {
    const n = MAJOR_SHARPS_COUNT[majorKey];
    for (let i = 0; i < n; i++) covered.add(SHARP_ORDER_LETTERS[i]);
  } else if (MAJOR_FLATS_COUNT[majorKey] !== undefined) {
    const n = MAJOR_FLATS_COUNT[majorKey];
    for (let i = 0; i < n; i++) covered.add(FLAT_ORDER_LETTERS[i]);
  }
  return covered;
}

/**
 * Returns true if the given VexFlow key string is covered by the provided
 * coverage set, meaning the key signature already implies this accidental and
 * it should not be drawn explicitly on the note.
 *
 * @param {string} vexKey - VexFlow key string including octave, e.g. 'eb/4' | 'f#/5'.
 * @param {Set<string>} coveredLetters - Set returned by keySigCoveredLetters().
 * @returns {boolean} True if the note's accidental is covered by the key signature.
 */
function isCoveredByKeySig(vexKey, coveredLetters) {
  const letterAcc = vexKey.split('/')[0]; // e.g. 'eb', 'f#', 'c'
  return coveredLetters.has(letterAcc);
}

/**
 * Re-spells a VexFlow key string enharmonically when the interval engine has
 * produced a double accidental and a simpler spelling exists within the context
 * of the active key signature.
 *
 * The function is conservative: it only acts on double accidentals (♭♭ or ##).
 * Single accidentals and naturals are always returned unchanged. When a simpler
 * spelling is found, it is chosen in the following priority order:
 *
 *   1. Cross-letter candidate covered by the key signature (e.g. E♭♭ → D when
 *      D is in key — genuinely simpler and harmonically consistent).
 *   2. Same-letter one-step strip, preserving staff position (e.g. E♭♭ → E♭).
 *      This takes priority over a cross-letter natural to avoid staff collisions
 *      when another note already occupies that letter's staff position.
 *   3. Cross-letter natural (last resort — may create staff collisions).
 *
 * The notation engine sets forcedAcc=true for the resulting note so the
 * remaining single accidental is always drawn explicitly.
 *
 * @param {number} midi - MIDI note number of the note being re-spelled.
 * @param {string} vexKey - Current VexFlow key string, e.g. 'ebb/4'.
 * @param {Set<string>} coveredLetters - Set returned by keySigCoveredLetters().
 * @param {string} keySigStr - Active VexFlow key signature string (unused directly
 *   but kept for potential future context expansion).
 * @returns {string} Re-spelled VexFlow key string, or the original if no change needed.
 */
function respellForKeySig(midi, vexKey, coveredLetters, keySigStr) {
  const letterAcc = vexKey.split('/')[0];
  const oct = vexKey.split('/')[1];

  // Only re-spell if current spelling has a double accidental
  const isDoubleSharp = letterAcc.endsWith('##');
  const isDoubleFlat  = letterAcc.endsWith('bb') && letterAcc.length > 2; // 'bb' alone = B-flat

  if (!isDoubleSharp && !isDoubleFlat) return vexKey; // single acc or natural — keep

  // Enharmonic pitch class
  const pc = midi % 12;

  // Step 1: try cross-letter enharmonic respell (existing logic).
  // e.g. c## → d, b## → c#, etc. — only when a simpler spelling at the same
  // pitch class exists and is covered by the key sig or is a natural note.
  // We allow letter changes here because in these cases the cross-letter spelling
  // is musically correct and there is no staff-position collision risk.
  const candidates = [];
  for (let li = 0; li < 7; li++) {
    const naturalPc = LETTER_PCS[li];
    const letter = LETTER_NAMES[li].toLowerCase();
    for (const [accSuffix, delta] of [['',0],['#',1],['b',-1]]) {
      const candidate_pc = ((naturalPc + delta) % 12 + 12) % 12;
      if (candidate_pc === pc) {
        const candidateKey = letter + accSuffix;
        let candOct = parseInt(oct);
        if (letter === 'c' && pc >= 9) candOct += 1;
        if (letter === 'b' && pc <= 2) candOct -= 1;
        candidates.push(candidateKey + '/' + candOct);
      }
    }
  }

  // Priority 1: cross-letter candidate covered by the key sig — genuinely simpler
  const covered = candidates.find(k => isCoveredByKeySig(k, coveredLetters));
  if (covered) return covered;

  // Priority 2: same-letter one-step strip — preserves staff position.
  // Must come BEFORE the cross-letter natural fallback, because a natural note
  // on a different letter (e.g. D natural for Ebb) causes a staff collision
  // with any other note already on that letter (e.g. Db).
  // E.g. ebb → eb (different pc, same letter E, correct staff position).
  // The forcedAcc flag in spellMidi ensures the single remaining accidental is
  // drawn explicitly, correctly communicating the double accidental to the reader.
  const originalLetter = letterAcc[0].toLowerCase();
  if (isDoubleFlat)  return originalLetter + 'b/' + oct;
  if (isDoubleSharp) return originalLetter + '#/' + oct;

  // Priority 3: cross-letter natural — last resort only
  const natural = candidates.find(k => !k.split('/')[0].match(/[#b]/));
  if (natural) return natural;

  return candidates[0] ?? vexKey; // absolute last resort
}

/**
 * Returns the set of pitch classes covered by the given key signature.
 *
 * @deprecated Prefer keySigCoveredLetters() for new code. This pitch-class
 *   based approach cannot distinguish enharmonic pairs (e.g. E♭ vs D♯) and
 *   may suppress or force accidentals incorrectly on enharmonically spelled
 *   notes. Retained for legacy callers only.
 *
 * @param {string|null} vexKeyStr - VexFlow key string or null.
 * @returns {Set<number>} Set of covered pitch classes (0–11).
 */
function keySigCoveredPcs(vexKeyStr) {
  if (!vexKeyStr) return new Set();
  const SHARP_ORDER_PCS = [6, 1, 8, 3, 10, 5, 0];
  const FLAT_ORDER_PCS  = [10, 3, 8, 1, 6, 11, 4];
  const majorKey = _getMajorKey(vexKeyStr);
  const covered = new Set();
  if (MAJOR_SHARPS_COUNT[majorKey] !== undefined) {
    const n = MAJOR_SHARPS_COUNT[majorKey];
    for (let i = 0; i < n; i++) covered.add(SHARP_ORDER_PCS[i]);
  } else if (MAJOR_FLATS_COUNT[majorKey] !== undefined) {
    const n = MAJOR_FLATS_COUNT[majorKey];
    for (let i = 0; i < n; i++) covered.add(FLAT_ORDER_PCS[i]);
  }
  return covered;
}

/**
 * Returns the total number of accidental symbols in the given key signature.
 * Used by the notation engine to calculate extra canvas width needed to
 * accommodate the key signature glyphs at the start of the staff.
 *
 * @param {string|null} vexKeyStr - VexFlow key string, e.g. 'Eb' | 'F#m' | null.
 * @returns {number} Number of accidentals in the key signature (0–7).
 */
function keySigAccidentalCount(vexKeyStr) {
  if (!vexKeyStr) return 0;
  const majorKey = _getMajorKey(vexKeyStr);
  if (MAJOR_SHARPS_COUNT[majorKey] !== undefined) return MAJOR_SHARPS_COUNT[majorKey];
  if (MAJOR_FLATS_COUNT[majorKey]  !== undefined) return MAJOR_FLATS_COUNT[majorKey];
  return 0;
}

// =============================================================================
// The Sound Travels Ear Training — keysig.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
