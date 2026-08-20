/**
 * @file helpers.js
 * @description Shared utility functions and pool-building logic consumed across
 *   all mode files. Covers session reset, random selection, MIDI conversion,
 *   chord inversion construction, active pool filtering, octave band resolution,
 *   root MIDI selection, per-session stats recording and rendering, and root
 *   badge display. Also declares two per-question resolved-state variables
 *   (currentVoicingMode, currentChordPlayStyle) that are set and consumed
 *   entirely within the chord question flow.
 *
 * @module Helpers
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// ── Session reset ─────────────────────────────────────────────────────────────

/**
 * Performs a full session reset. Zeroes all score counters and clears
 * sessionStats, resets all chord sub-state variables (slash, poly, UST),
 * clears every UI panel to its blank state, then calls generateQuestion() to
 * immediately begin a fresh question.
 *
 * @returns {void}
 */
function resetSession() {
  correct = 0; total = 0; streak = 0;
  document.getElementById('correct').textContent = 0;
  document.getElementById('total').textContent   = 0;
  document.getElementById('streak').textContent  = 0;

  sessionStats = {};
  document.getElementById('statsBody').innerHTML = '';

  answered = false;
  currentSlashBassMidi = null;
  currentUpperRootMidi = null;
  currentPolyUpperMidi = []; currentPolyLowerMidi = [];
  currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
  currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;

  document.getElementById('statusMsg').textContent = '';
  document.getElementById('breakdownPanel').style.display = 'none';
  document.getElementById('breakdownPanel').innerHTML = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';
  document.getElementById('controls').innerHTML = '';
  document.getElementById('notationChordName').textContent = '';
  document.getElementById('notation-svg').innerHTML = '';

  generateQuestion();
}

// ── Core utilities ────────────────────────────────────────────────────────────

/**
 * Returns a uniformly random element from an array.
 *
 * @param {Array} arr - The array to sample from.
 * @returns {*} A randomly selected element.
 */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/**
 * Converts a MIDI note number to a soundfont-player filename string.
 * For example, MIDI 60 → 'C4', MIDI 69 → 'A4'.
 * Uses NOTE_NAMES from spelling.js for pitch-class-to-letter mapping.
 *
 * @param {number} midi - MIDI note number (0–127).
 * @returns {string} Soundfont filename key, e.g. 'C4', 'F#3'.
 */
function midiToSoundFontName(midi) { return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1); }

// ── Inversion helpers ─────────────────────────────────────────────────────────

/**
 * Human-readable inversion labels indexed by inversion number.
 * Index 0 is empty because root position is not labelled as an inversion.
 *
 * @type {string[]}
 */
const INV_LABELS = ['', '1st inv', '2nd inv', '3rd inv', '4th inv'];

/**
 * Builds the MIDI note array for a chord at a given inversion.
 * Rotates the note set by shifting the lowest note up one octave, repeated
 * invIndex times. Root position (invIndex 0) returns notes unchanged.
 *
 * @param {number[]} baseIntervals - Semitone offsets from the root (root position).
 * @param {number} rootMidi - MIDI note number of the chord root.
 * @param {number} invIndex - Inversion number: 1 = first inversion, 2 = second, etc.
 * @returns {number[]} MIDI note numbers for the chord at the requested inversion.
 */
function applyInversion(baseIntervals, rootMidi, invIndex) {
  let notes = baseIntervals.map(i => rootMidi + i);
  for (let i = 0; i < invIndex; i++) {
    const lowest = notes.shift();
    notes.push(lowest + 12);
  }
  return notes;
}

/**
 * Generates all inversion entries for every chord in basePool.
 * Each entry extends the source chord descriptor with inversion metadata:
 * a display name (e.g. 'Major — 1st inv'), a disambiguated symbol
 * (e.g. 'maj_inv1'), and references back to the base chord for interval
 * lookup. Root position (index 0) is excluded — it already exists in the
 * base pool.
 *
 * @param {Object[]} basePool - Array of chord descriptors from CHORD_TYPES.
 * @returns {Object[]} Array of inversion entry objects, one per valid inversion
 *   of each chord in basePool.
 */
function buildInversionPool(basePool) {
  const inv = [];
  basePool.forEach(chord => {
    const maxInv = chord.intervals.length - 1;
    for (let i = 1; i <= maxInv; i++) {
      inv.push({
        name:       chord.name + ' \u2014 ' + INV_LABELS[i],
        symbol:     chord.symbol + '_inv' + i,
        baseSymbol: chord.symbol,
        baseChord:  chord,
        invIndex:   i,
      });
    }
  });
  return inv;
}

// ── Pool builders ─────────────────────────────────────────────────────────────

/**
 * Returns a flat array of every chord descriptor across all 12 families
 * from CHORD_TYPES. This is the canonical complete chord list from which
 * all filtered pools are derived.
 *
 * @returns {Object[]} All chord descriptors in family order.
 */
function getAllChords() {
  return [
    ...CHORD_TYPES.major,
    ...CHORD_TYPES.minor,
    ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished,
    ...CHORD_TYPES.augmented,
    ...CHORD_TYPES.suspended,
    ...CHORD_TYPES.classical,
    ...CHORD_TYPES.quartal,
    ...CHORD_TYPES.cluster,
    ...CHORD_TYPES.slash,
    ...CHORD_TYPES.poly,
    ...CHORD_TYPES.ust,
  ];
}

/**
 * Builds the active chord quiz pool from selectedChords. When includeInversions
 * is true, appends inversion entries for all eligible families via
 * buildInversionPool(). Slash, poly, UST, classical, quartal, and cluster
 * families are excluded from inversion generation: slash and poly have their
 * own bass-note structure incompatible with rotation-based inversions; UST
 * voicings are rootless by design; classical, quartal, and cluster have fixed
 * voicings where inversion would distort their identity.
 *
 * Falls back to one chord from each of the four basic families (major, minor,
 * diminished, augmented) if selectedChords is empty, so the app never crashes
 * on an empty pool.
 *
 * @returns {Object[]} Active chord pool including any requested inversion entries.
 */
function getActivePool() {
  let basePool = getAllChords().filter(c => selectedChords.has(c.symbol));
  if (!basePool.length) {
    basePool = [
      ...CHORD_TYPES.major.slice(0, 1),
      ...CHORD_TYPES.minor.slice(0, 1),
      ...CHORD_TYPES.diminished.slice(0, 1),
      ...CHORD_TYPES.augmented.slice(0, 1),
    ];
  }
  let pool = [...basePool];
  if (includeInversions) {
    const invertible = basePool.filter(c =>
      c.family !== 'slash' &&
      c.family !== 'poly' &&
      c.family !== 'ust' &&
      c.family !== 'classical' &&
      c.family !== 'quartal' &&
      c.family !== 'cluster'
    );
    pool = pool.concat(buildInversionPool(invertible));
  }
  return pool;
}

/**
 * Filters INTERVALS to those present in selectedIntervals.
 * Falls back to the full INTERVALS array if the selection is empty, preserving
 * meaningful quiz variety even when the user has deselected everything.
 *
 * @returns {Object[]} Active interval pool.
 */
function getActiveIntervalPool() {
  const pool = INTERVALS.filter(i => selectedIntervals.has(i.symbol));
  return pool.length ? pool : INTERVALS;
}

/**
 * Filters SCALES to those present in selectedScales.
 * Falls back to [SCALES[0]] (the first scale in the library) if the selection
 * is empty, so the app always has at least one item to quiz.
 *
 * @returns {Object[]} Active scale pool.
 */
function getActiveScalePool() {
  const pool = SCALES.filter(s => selectedScales.has(s.symbol));
  return pool.length ? pool : [SCALES[0]];
}

// ── Root and octave selection ─────────────────────────────────────────────────

/**
 * Maps a pinnedOctave string value to a [lo, hi] octave range (inclusive).
 * Returns [loDefault, hiDefault] when band is null (random octave mode).
 *
 * @param {string|null} band - Octave band: 'low' | 'mid' | 'high' | null.
 * @param {number} loDefault - Lower bound to use when band is null.
 * @param {number} hiDefault - Upper bound to use when band is null.
 * @returns {[number, number]} Octave range [lo, hi], inclusive.
 */
function resolveOctaveBand(band, loDefault, hiDefault) {
  if (band === 'low')  return [2, 3];
  if (band === 'mid')  return [3, 4];
  if (band === 'high') return [4, 5];
  return [loDefault, hiDefault];
}

/**
 * Chooses a MIDI root note for a chord question, respecting pinnedRoot and
 * pinnedOctave. Computes the safe octave range for the chord's interval span
 * to keep all notes within MIDI 28–96, then clamps and guards against
 * degenerate ranges before picking a random octave within the safe window.
 * For inverted chords, reads intervals from baseChord to get the correct span.
 *
 * @param {Object} chord - Chord descriptor or inversion entry from the active pool.
 * @returns {number} MIDI note number of the chosen root.
 */
function chooseRootMidi(chord) {
  const intervals = chord.invIndex !== undefined ? chord.baseChord.intervals : chord.intervals;
  const span = intervals[intervals.length - 1];
  const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);

  // Safe absolute octave bounds: keep all notes within MIDI 28–96
  const absMin = Math.ceil((28 - 12) / 12);
  const absMax = Math.floor((96 - 12 - span) / 12);
  const defaultLo = span > 14 ? Math.max(3, absMin) : Math.max(2, absMin);
  const defaultHi = Math.min(5, absMax);

  const [lo, hi] = resolveOctaveBand(pinnedOctave, defaultLo, defaultHi);
  const clampedLo = Math.max(lo, absMin);
  const clampedHi = Math.min(hi, absMax);
  // Guard against degenerate range when pinnedOctave pushes outside the safe window
  const safeLo = Math.min(clampedLo, clampedHi);
  const safeHi = Math.max(clampedLo, clampedHi);

  const octave = safeLo + Math.floor(Math.random() * (safeHi - safeLo + 1));
  return 12 + pitchClass + octave * 12;
}

/**
 * Chooses a MIDI root note for an interval or scale question, respecting
 * pinnedRoot and pinnedOctave. Clamps the upper octave bound so the top note
 * of the interval or scale stays below MIDI 97.
 *
 * @param {number} semitoneRange - Semitones above the root to the highest note
 *   (e.g. 12 for an octave interval, the scale's last interval value for scales).
 * @returns {number} MIDI note number of the chosen root.
 */
function chooseSimpleRootMidi(semitoneRange) {
  const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
  const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
  // Clamp upper bound so the highest note stays below MIDI 97
  const clampedHi = Math.min(hi, Math.floor((96 - semitoneRange) / 12) - 1);
  const safeLo = Math.min(lo, clampedHi);
  const octave = safeLo + Math.floor(Math.random() * (clampedHi - safeLo + 1));
  return 12 + pitchClass + octave * 12;
}

// ── Session stats ─────────────────────────────────────────────────────────────

/**
 * Records one answer event into sessionStats and re-renders the stats table.
 * Creates the entry for the item if it does not already exist.
 *
 * @param {string} symbol - Unique item symbol used as the sessionStats key.
 * @param {string} name - Display name shown in the stats table.
 * @param {boolean} isCorrect - Whether the answer was correct.
 * @returns {void}
 */
function recordAnswer(symbol, name, isCorrect) {
  if (!sessionStats[symbol]) sessionStats[symbol] = { name, correct: 0, total: 0 };
  sessionStats[symbol].total++;
  if (isCorrect) sessionStats[symbol].correct++;
  renderStats();
}

/**
 * Re-renders the #statsBody table from the current sessionStats object.
 * Rows are sorted worst-accuracy-first so the items most needing practice
 * appear at the top. Each row shows the item name, correct count, total
 * attempts, percentage, and a proportional visual bar.
 *
 * @returns {void}
 */
function renderStats() {
  const tbody = document.getElementById('statsBody');
  const entries = Object.values(sessionStats).sort((a, b) => {
    const pA = a.total ? a.correct / a.total : 1;
    const pB = b.total ? b.correct / b.total : 1;
    return pA - pB;
  });
  tbody.innerHTML = '';
  entries.forEach(e => {
    const pct = e.total ? Math.round(e.correct / e.total * 100) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.name}</td>
      <td>${e.correct}</td>
      <td>${e.total}</td>
      <td>${pct}%<span class="stat-bar-wrap"><span class="stat-bar" style="width:${pct}%"></span></span></td>`;
    tbody.appendChild(tr);
  });
}

// ── Root badge ────────────────────────────────────────────────────────────────

/**
 * Shows or hides the #rootBadge element based on the showRoot flag and whether
 * a root name is available. Called after each new question is generated.
 *
 * @param {string|null} rootName - The root note name to display, or null/empty
 *   to hide the badge.
 * @returns {void}
 */
function updateRootBadge(rootName) {
  const badge = document.getElementById('rootBadge');
  if (showRoot && rootName) {
    badge.textContent = rootName;
    badge.style.display = '';
  } else {
    badge.textContent = '';
    badge.style.display = 'none';
  }
}

// ── Voicing system ────────────────────────────────────────────────────────────
// VOICING_MODES, applyVoicing(), and resolveVoicingMode() live in voicings.js.
// Voicing chip rendering lives in pool.js (renderChordPoolPanel → voicing section).

/**
 * The resolved voicing symbol for the current chord question.
 * Set by generateChordQuestion() and dictLoadSymbol() at question time.
 * Read by applyVoicing() in voicings.js to determine how to space the notes.
 *
 * @type {string}
 */
let currentVoicingMode = 'close';

/**
 * The resolved playback style for the current chord question.
 * Set by resolveChordStyle() in audio.js at play time, before notes are
 * scheduled. Read by showNotation() in notation.js so the notation display
 * mirrors the playback order actually heard.
 *
 * @type {string}
 */
let currentChordPlayStyle = 'block';

// =============================================================================
// The Sound Travels Ear Training — helpers.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
