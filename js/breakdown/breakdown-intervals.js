// ─── breakdown-intervals.js ───────────────────────────────────────────────────
// Intervals branch of the breakdown panel.
// Depends on shared helpers/globals defined in breakdown.js:
//   makeNameHeader, makeBDRow, joinSep, SEMITONE_TO_NUMERAL,
//   INTERVAL_ABBR, intervalAbbr, semitonesToNumeral,
//   spelledRoot, spelledNote, TRITONE_AS_D5, EIGHT_AS_A5, NINE_AS_D7,
//   currentMode, currentInterval, currentIntervalMidi, currentIntervalStyle
// Called from showBreakdown() in breakdown.js.
// ─────────────────────────────────────────────────────────────────────────────

// Interval consonance classification
const INTERVAL_CONSONANCE = {
  0:'Perfect consonance', 1:'Sharp dissonance', 2:'Mild dissonance',
  3:'Imperfect consonance', 4:'Imperfect consonance', 5:'Perfect consonance',
  6:'Sharp dissonance', 7:'Perfect consonance', 8:'Imperfect consonance',
  9:'Imperfect consonance', 10:'Mild dissonance', 11:'Sharp dissonance', 12:'Perfect consonance',
  // POINT 39: compound intervals inherit simple-interval quality
  13:'Sharp dissonance', 14:'Mild dissonance', 15:'Sharp dissonance',
  17:'Perfect consonance', 18:'Sharp dissonance', 20:'Imperfect consonance', 21:'Imperfect consonance',
};

// Interval common musical contexts (keyed by semitone count)
const INTERVAL_CONTEXT = {
  1: 'chromatic neighbour tone; top of major 7th chord',
  2: 'melodic step; root→9th of any chord',
  3: 'root→♭3rd of any minor chord',
  4: 'root→3rd of any major chord',
  5: 'root→4th (sus4); V→I bass motion inverted',
  6: '3rd→♭7th of any dominant 7th chord; the "devil\'s interval"',
  7: 'root→5th of any chord; open, stable, harmonically neutral',
  8: 'root→♭6th; enharmonic ♯5 in augmented chords',
  9: 'root→6th; maj6 chord colour; relative minor relationship',
  10:'root→♭7th of any dominant or minor 7th chord',
  11:'root→Maj7; leading tone a half-step below the octave',
  12:'perfect octave; same pitch class, doubled register',
  // POINT 39: compound intervals — jazz chord extension context
  13:'m9 tension; adds colour to dom7(♭9) and min7 chords; very tense',
  14:'the classic 9th extension; adds colour to Maj7(9), m7(9), dom7(9)',
  15:'♯9 — the "Hendrix chord" tension; enharmonic m3 displaced an octave',
  17:'P11 over root; sus4 quality displaced an octave; open, hollow sound',
  18:'♯11 — Lydian sound; enharmonic ♭5 an octave higher; adds Lydian colour',
  20:'m13 — Phrygian/Aeolian colour; ♭6 displaced up an octave; dark',
  21:'M13 — bright jazz extension; 6th an octave higher; adds Dorian/Ionian brightness',
};

// Complementary interval (both sum to 12 semitones = P8)
// m2↔M7, M2↔m7, m3↔M6, M3↔m6, P4↔P5, TT↔TT
const INTERVAL_INVERSION_SEMITONES = {
  1:11, 2:10, 3:9, 4:8, 5:7, 6:6, 7:5, 8:4, 9:3, 10:2, 11:1, 12:0,
};
const INTERVAL_INVERSION_NAME = {
  1:'Major 7th', 2:'Minor 7th', 3:'Major 6th', 4:'Aug 5th / Minor 6th',
  5:'Perfect 5th', 6:'Tritone (A4 / ♭5)', 7:'Perfect 4th', 8:'Major 3rd',
  9:'Minor 3rd', 10:'Major 2nd', 11:'Minor 2nd', 12:'Unison',
};

// POINT 24: context-aware tritone label
function tritoneLabel(style) {
  if (style === 'descending') return 'd5';
  if (style === 'harmonic')   return 'A4 / d5';
  return 'A4'; // ascending or default
}

function showBreakdownIntervals(panel) {
  const semi   = currentInterval.semitones;
  const rootPc = currentIntervalMidi[0] % 12;
  const sym    = currentInterval.symbol;
  const n0 = spelledRoot(rootPc);
  const n1 = spelledNote(semi, rootPc, sym);

  const iName = semi === 6 ? tritoneLabel(currentIntervalStyle) : currentInterval.name;
  const { body: intBody } = makeNameHeader(panel, iName + ': ' + n0 + ' \u2192 ' + n1);

  // Semitones
  makeBDRow(intBody, 'Semitones', semi + ' semitone' + (semi === 1 ? '' : 's'));

  // Degree numeral
  const numeral = SEMITONE_TO_NUMERAL[semi] || '—';
  makeBDRow(intBody, 'Degree', numeral);

  // Inversion (complement to P8) — only meaningful for simple intervals
  if (currentInterval.compound) {
    const simpleSemi = semi - 12;
    const simpleName = INTERVAL_INVERSION_NAME[12 - simpleSemi] !== undefined
      ? ({ 1:'Minor 2nd', 2:'Major 2nd', 3:'Minor 3rd', 4:'Major 3rd', 5:'Perfect 4th',
           6:'Tritone (A4 / ♭5)', 7:'Perfect 5th', 8:'Aug 5th / Minor 6th',
           9:'Major 6th', 10:'Minor 7th', 11:'Major 7th', 12:'Octave' })[simpleSemi] || '—'
      : '—';
    const simpleNumeral = SEMITONE_TO_NUMERAL[simpleSemi] || '—';
    makeBDRow(intBody, 'Simple equivalent', simpleName + ' (' + simpleNumeral + ', ' + simpleSemi + ' semitones)');
  } else {
    const invSemi = INTERVAL_INVERSION_SEMITONES[semi];
    if (invSemi !== undefined) {
      const invName    = INTERVAL_INVERSION_NAME[semi] || '—';
      const invNumeral = SEMITONE_TO_NUMERAL[invSemi] || '—';
      makeBDRow(intBody, 'Inverts to', invName + ' (' + invNumeral + ') — ' + invSemi + ' semitone' + (invSemi === 1 ? '' : 's'));
    }
  }

  // Consonance
  const cons = INTERVAL_CONSONANCE[semi];
  if (cons) makeBDRow(intBody, 'Consonance', cons);

  // Common context
  let ctx = INTERVAL_CONTEXT[semi];
  if (semi === 8 && EIGHT_AS_A5.has(sym)) ctx = 'root→A5 (augmented 5th); enharmonic ♭6th';
  if (semi === 9 && NINE_AS_D7.has(sym))  ctx = 'root→°7 (diminished 7th); enharmonic M6';
  if (semi === 6 && TRITONE_AS_D5.has(sym)) ctx = 'root→d5 (diminished 5th); the "devil\'s interval"';
  if (ctx) makeBDRow(intBody, 'Context', ctx);

  panel.style.display = 'block';
  document.getElementById('breakdownWrapper').style.display = 'block';
}
