// ─── POINT 20.5: Full session reset ───────────────────────────────────────────
function resetSession() {
  // Reset counters
  correct = 0; total = 0; streak = 0;
  document.getElementById('correct').textContent = 0;
  document.getElementById('total').textContent   = 0;
  document.getElementById('streak').textContent  = 0;
  // Reset per-type stats
  sessionStats = {};
  document.getElementById('statsBody').innerHTML = '';
  // Clear UI state
  answered = false;
  currentSlashBassMidi = null; // POINT 25
  currentUpperRootMidi = null; // POINT 25
  currentPolyUpperMidi = []; currentPolyLowerMidi = []; // POINT 26
  currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
  currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;
  document.getElementById('statusMsg').textContent = '';
  document.getElementById('breakdownPanel').style.display = 'none';
  document.getElementById('breakdownPanel').innerHTML = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';
  document.getElementById('controls').innerHTML = '';
  document.getElementById('notationChordName').textContent = '';
  document.getElementById('notation-svg').innerHTML = '';
  // Start fresh
  generateQuestion();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function midiToSoundFontName(midi) { return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1); }

// POINT 2: Inversion helpers
const INV_LABELS = ['', '1st inv', '2nd inv', '3rd inv', '4th inv'];

function applyInversion(baseIntervals, rootMidi, invIndex) {
  let notes = baseIntervals.map(i => rootMidi + i);
  for (let i = 0; i < invIndex; i++) {
    const lowest = notes.shift();
    notes.push(lowest + 12);
  }
  return notes;
}

function buildInversionPool(basePool) {
  const inv = [];
  basePool.forEach(chord => {
    const maxInv = chord.intervals.length - 1;
    for (let i = 1; i <= maxInv; i++) {
      inv.push({
        name: chord.name + ' \u2014 ' + INV_LABELS[i],
        symbol: chord.symbol + '_inv' + i,
        baseSymbol: chord.symbol,
        baseChord: chord,
        invIndex: i,
      });
    }
  });
  return inv;
}

// POINT 10 / 9b: Build chord pool from granular selection across all families
function getAllChords() {
  return [
    ...CHORD_TYPES.major,
    ...CHORD_TYPES.minor,
    ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished,
    ...CHORD_TYPES.augmented,
    ...CHORD_TYPES.suspended,
    ...CHORD_TYPES.slash, // POINT 25
    ...CHORD_TYPES.poly,  // POINT 26
    ...CHORD_TYPES.ust,   // POINT 26
  ];
}

function getActivePool() {
  let basePool = getAllChords().filter(c => selectedChords.has(c.symbol));
  if (!basePool.length) basePool = CHORD_TYPES.major.slice(0,1).concat(CHORD_TYPES.minor.slice(0,1), CHORD_TYPES.diminished.slice(0,1), CHORD_TYPES.augmented.slice(0,1)); // safety fallback
  let pool = [...basePool];
  // POINT 25/26: slash, poly, UST don't support inversions
  if (includeInversions) pool = pool.concat(buildInversionPool(basePool.filter(c => c.family !== 'slash' && c.family !== 'poly' && c.family !== 'ust')));
  return pool;
}

// POINT 10: Build interval pool from granular selection
function getActiveIntervalPool() {
  const pool = INTERVALS.filter(i => selectedIntervals.has(i.symbol));
  return pool.length ? pool : INTERVALS;
}

// POINT 10: Build scale pool from granular selection
function getActiveScalePool() {
  const pool = SCALES.filter(s => selectedScales.has(s.symbol));
  return pool.length ? pool : [SCALES[0]];
}

// POINT 12: Resolve octave band to [lo, hi] inclusive
function resolveOctaveBand(band, loDefault, hiDefault) {
  if (band === 'low')  return [2, 3];
  if (band === 'mid')  return [3, 4];
  if (band === 'high') return [4, 5];
  return [loDefault, hiDefault];
}

// POINT 3 / 12: Smart root picker for chords (respects pinnedRoot + pinnedOctave)
function chooseRootMidi(chord) {
  const intervals = chord.invIndex !== undefined ? chord.baseChord.intervals : chord.intervals;
  const span = intervals[intervals.length - 1];
  const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);

  // Compute safe octave range for this chord's span
  const absMin = Math.ceil((28 - 12) / 12);
  const absMax = Math.floor((96 - 12 - span) / 12);
  const defaultLo = span > 14 ? Math.max(3, absMin) : Math.max(2, absMin);
  const defaultHi = Math.min(5, absMax);

  const [lo, hi] = resolveOctaveBand(pinnedOctave, defaultLo, defaultHi);
  const clampedLo = Math.max(lo, absMin);
  const clampedHi = Math.min(hi, absMax);
  const safeLo = Math.min(clampedLo, clampedHi);
  const safeHi = Math.max(clampedLo, clampedHi);

  const octave = safeLo + Math.floor(Math.random() * (safeHi - safeLo + 1));
  return 12 + pitchClass + octave * 12;
}

// POINT 12: Simple root picker for intervals and scales
function chooseSimpleRootMidi(semitoneRange) {
  // semitoneRange: how many semitones above root (e.g. 12 for octave, 0 for just root)
  const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
  const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
  // clamp so top note stays below midi 97
  const clampedHi = Math.min(hi, Math.floor((96 - semitoneRange) / 12) - 1);
  const safeLo = Math.min(lo, clampedHi);
  const octave = safeLo + Math.floor(Math.random() * (clampedHi - safeLo + 1));
  return 12 + pitchClass + octave * 12;
}

// ─── POINT 8: Stats (adaptive difficulty removed in POINT 10) ────────────────

function recordAnswer(symbol, name, isCorrect) {
  if (!sessionStats[symbol]) sessionStats[symbol] = { name, correct: 0, total: 0 };
  sessionStats[symbol].total++;
  if (isCorrect) sessionStats[symbol].correct++;
  renderStats();
}

function renderStats() {
  const tbody = document.getElementById('statsBody');
  const entries = Object.values(sessionStats).sort((a, b) => {
    const pA = a.total ? a.correct / a.total : 1;
    const pB = b.total ? b.correct / b.total : 1;
    return pA - pB; // worst first
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

// POINT 8: Root badge — shows root note when showRoot is true, hides after answering
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

// ─── POINT 23: Voicing modes ─────────────────────────────────────────────────

const VOICING_MODES = [
  { name: 'Full',  symbol: 'full',   desc: 'All notes as written' },
  { name: 'Real',  symbol: 'real',   desc: 'Omit P5 (unless altered)' },
  { name: 'Shell', symbol: 'shell',  desc: 'Root + 3rd + 7th only' },
  { name: 'Guide', symbol: 'guide',  desc: '3rd + 7th only (no root)' },
  { name: 'Rnd',   symbol: 'random', desc: 'Random voicing each question' },
];

// Given base intervals (semitones from root) and a voicing mode,
// return the filtered subset of interval indices to keep.
// "From root" / "Numerals" always show the full set — this only affects
// what actually sounds and what appears in Notes / Between notes.
function applyVoicingMode(baseIntervals, mode) {
  // Resolve random
  const resolved = mode === 'random'
    ? ['full','real','shell','guide'][Math.floor(Math.random() * 4)]
    : mode;

  // Identify interval roles by semitone value (mod 12)
  const roles = baseIntervals.map(i => {
    const s = i % 12;
    if (s === 0)  return 'root';
    if (s === 3 || s === 4)  return 'third';   // m3 or M3
    if (s === 7)  return 'fifth';              // P5
    if (s === 6 || s === 8)  return 'altfifth'; // b5 or #5 — keep always
    if (s === 10 || s === 11) return 'seventh'; // m7 or M7
    return 'extension'; // 9, 11, 13 etc.
  });

  const hasAltFifth = roles.includes('altfifth');

  let keep;
  if (resolved === 'real') {
    // Omit P5 unless it's altered (b5 / #5)
    keep = baseIntervals.filter((_, i) => roles[i] !== 'fifth');
  } else if (resolved === 'shell') {
    // Root + 3rd + 7th — drop 5th and extensions
    // If no 7th exists (triads), fall back to full
    const hasSeventh = roles.includes('seventh');
    if (!hasSeventh) {
      keep = [...baseIntervals];
    } else {
      keep = baseIntervals.filter((_, i) =>
        roles[i] === 'root' || roles[i] === 'third' || roles[i] === 'seventh'
      );
    }
  } else if (resolved === 'guide') {
    // 3rd + 7th only — no root, no 5th, no extensions
    // If no 7th (triads), fall back to full
    const hasSeventh = roles.includes('seventh');
    if (!hasSeventh) {
      keep = [...baseIntervals];
    } else {
      keep = baseIntervals.filter((_, i) =>
        roles[i] === 'third' || roles[i] === 'seventh'
      );
    }
  } else {
    // full: all notes
    keep = [...baseIntervals];
  }

  // Safety: never return empty
  return keep.length ? keep : [...baseIntervals];
}

// Resolve the current voicing mode for a question (stores resolved random)
let currentVoicingMode = 'full';    // resolved per-question
let currentChordPlayStyle = 'block'; // POINT 32: resolved at play time, read by showNotation

function resolveVoicingMode() {
  if (activeVoicingMode === 'random') {
    const opts = ['full','real','shell','guide'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return activeVoicingMode;
}

function renderVoicingChips() {
  const row = document.getElementById('voicingModeRow');
  row.innerHTML = '';
  VOICING_MODES.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'voicing-chip' + (activeVoicingMode === v.symbol ? ' active' : '');
    chip.textContent = v.name;
    chip.title = v.desc;
    chip.addEventListener('click', () => {
      activeVoicingMode = v.symbol;
      row.querySelectorAll('.voicing-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      recomputeCurrentNotes(); // POINT 33: reapply to current item, never discard it
    });
    row.appendChild(chip);
  });
}
