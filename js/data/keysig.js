// ─── Key signature helpers (scale mode) ───────────────────────────────────────

// Toggle the C / Key chip and re-render notation
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
  } else if (currentMode === 'chords') {
    // BUG-4: use dispatcher so Key/C chip works in both chord and resolution views
    showCurrentView();
  } else {
    showNotation();
  }
}

// VexFlow key signature strings for each pitch class + quality.
// Enharmonic pairs at pcs 1,3,6,8,10 — chosen by pinnedRootSpelling when set.
// Default (no pinned root): conventional preference (flat side for those 5 pcs).
const VEX_KEY_MAJOR_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const VEX_KEY_MAJOR_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const VEX_KEY_MINOR_FLAT  = ['Am','Bbm','Bm','Cm','C#m','Dm','Ebm','Em','Fm','F#m','Gm','G#m'];
const VEX_KEY_MINOR_SHARP = ['Am','A#m','Bm','Cm','C#m','Dm','D#m','Em','Fm','F#m','Gm','G#m'];

function vexKeyMajor(pc) {
  if (pinnedRootSpelling === 'sharp') return VEX_KEY_MAJOR_SHARP[pc];
  if (pinnedRootSpelling === 'flat')  return VEX_KEY_MAJOR_FLAT[pc];
  return VEX_KEY_MAJOR_FLAT[pc]; // conventional default = flat side
}
function vexKeyMinor(pc) {
  if (pinnedRootSpelling === 'sharp') return VEX_KEY_MINOR_SHARP[pc];
  if (pinnedRootSpelling === 'flat')  return VEX_KEY_MINOR_FLAT[pc];
  return VEX_KEY_MINOR_FLAT[pc]; // conventional default
}

function getScaleParentKeyStr(scale, rootPc) {
  if (!scale.parentKey) return null;
  const { offset, quality } = scale.parentKey;
  const parentPc = ((rootPc + offset) % 12 + 12) % 12;
  return quality === 'minor' ? vexKeyMinor(parentPc) : vexKeyMajor(parentPc);
}

// POINT 32b: Return a VexFlow key sig string implied by a chord symbol + root pitch class.
function getChordKeyStr(sym, rootPc) {
  const minorFamilies = ['m', 'm7', 'mM7', 'm6', 'm9', 'm11', 'm13', 'hdim', 'hdim7', 'dim', 'dim7'];
  const quality = minorFamilies.includes(sym) ? 'minor' : 'major';
  return quality === 'minor' ? vexKeyMinor(rootPc) : vexKeyMajor(rootPc);
}

// Best-fit key: find the major or minor key whose scale contains the most pitch classes
// from the given midi notes. Ties broken by fewest accidentals (proximity to C major).
// Used for polychords, UST, and slash chords where a single root key isn't obvious.
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

// POINT 32b: Return a VexFlow key sig string for an interval, based on the lower note's pitch class.
function getIntervalKeyStr(rootPc) {
  return vexKeyMajor(rootPc);
}

// ── Key-signature coverage helpers ───────────────────────────────────────────
//
// A key signature covers specific LETTER+ACCIDENTAL combinations, not pitch
// classes. E.g. Db major covers Bb Eb Ab Db Gb — meaning the letter B with a
// flat, the letter E with a flat, etc. It does NOT cover D# even though D# and
// Eb share pitch class 3. We therefore track coverage as a Set of vex letter
// strings (e.g. 'bb', 'eb', 'ab', 'db', 'gb').

const MAJOR_SHARPS_COUNT = { C:0, G:1, D:2, A:3, E:4, B:5, 'F#':6, 'C#':7 };
const MAJOR_FLATS_COUNT  = { C:0, F:1, Bb:2, Eb:3, Ab:4, Db:5, Gb:6, Cb:7 };
const MINOR_TO_REL_MAJOR = {
  Am:'C', Bm:'D', Cm:'Eb', 'C#m':'E', Dm:'F', 'D#m':'F#', Em:'G',
  Fm:'Ab', 'F#m':'A', Gm:'Bb', 'G#m':'B', Bbm:'Db', Ebm:'Gb',
};

// Order of sharps/flats as letter names (no octave)
const SHARP_ORDER_LETTERS = ['f#','c#','g#','d#','a#','e#','b#'];
const FLAT_ORDER_LETTERS  = ['bb','eb','ab','db','gb','cb','fb'];

function _getMajorKey(vexKeyStr) {
  if (!vexKeyStr) return 'C';
  if (vexKeyStr.endsWith('m')) return MINOR_TO_REL_MAJOR[vexKeyStr] ?? 'C';
  return vexKeyStr;
}

// Returns a Set of vex letter strings covered by the key sig, e.g. {'bb','eb','ab','db','gb'}
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

// Is this vex key string (e.g. 'eb/4', 'f#/5') covered by coveredLetters?
// We strip the octave and match the letter+acc part.
function isCoveredByKeySig(vexKey, coveredLetters) {
  const letterAcc = vexKey.split('/')[0]; // e.g. 'eb', 'f#', 'c'
  return coveredLetters.has(letterAcc);
}

// Re-spell a midi note enharmonically when the primary spelling is a double
// accidental AND the enharmonic alternative is covered (or simpler) in this key.
// Returns a new vex key string, or the original if no re-spell needed.
// This handles cases like Ebb → D when Eb is in the key sig (the Ebb would have
// been spelled from the interval engine but D is the correct practical reading).
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

// Legacy pitch-class based function (kept for callers that still use it)
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

// Count how many accidentals a key sig has (for canvas width padding)
function keySigAccidentalCount(vexKeyStr) {
  if (!vexKeyStr) return 0;
  const majorKey = _getMajorKey(vexKeyStr);
  if (MAJOR_SHARPS_COUNT[majorKey] !== undefined) return MAJOR_SHARPS_COUNT[majorKey];
  if (MAJOR_FLATS_COUNT[majorKey]  !== undefined) return MAJOR_FLATS_COUNT[majorKey];
  return 0;
}
