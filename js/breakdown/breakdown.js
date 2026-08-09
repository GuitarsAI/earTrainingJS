// ─── POINT 22: Breakdown enrichment — lookup tables & helpers ────────────────

// Semitone → Roman numeral (used in interval degree + chord interval numerals)
const SEMITONE_TO_NUMERAL = {
  0:'I', 1:'♭II', 2:'II', 3:'♭III', 4:'III', 5:'IV',
  6:'♯IV', 7:'V', 8:'♭VI', 9:'VI', 10:'♭VII', 11:'VII',
  12:'I', 13:'♭IX', 14:'IX', 15:'♯IX', 17:'XI', 18:'♯XI', 20:'♭XIII', 21:'XIII',
};
// Context-aware numeral lookup. Pass symbol so ambiguous semitone counts
// resolve to the correct degree name for the chord/scale in question.
function semitonesToNumeral(semitones, symbol) {
  const s = ((semitones % 12) + 12) % 12;
  if (symbol) {
    if (s === 6 && TRITONE_AS_D5.has(symbol)) return '♭V';
    if (s === 8 && EIGHT_AS_A5.has(symbol))   return '♯V';
    if (s === 9 && NINE_AS_D7.has(symbol))    return '°VII';
  }
  return SEMITONE_TO_NUMERAL[s] || '—';
}

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

// Scale modal character (mood / brightness one-liner)
const SCALE_CHARACTER = {
  major:      'Bright, stable — the default "happy" Western sound',
  nat_minor:  'Dark, introspective — the natural "sad" counterpart to major',
  harm_minor: 'Exotic, tense — raised 7th creates a dramatic leading tone',
  mel_minor:  'Fluid, bittersweet — ascending brightness, descending shadow',
  dorian:     'Minor with a bright 6th — soulful, funky, used heavily in jazz & blues',
  phrygian:   'Dark, Spanish/Flamenco flavour — distinctive ♭2 gives it edge',
  lydian:     'Dreamy, ethereal — raised 4th lifts it above standard major',
  mixolydian: 'Major with a bluesy ♭7 — the backbone of rock, blues & funk',
  locrian:    'Unstable, dissonant — diminished tonic triad makes resolution elusive',
  phryg_dom:  'Intense, Middle-Eastern/Spanish — the V chord of harmonic minor',
  lyd_dom:    'Sophisticated tension — dominant 7th with a Lydian lift; Bartók sound',
  altered:    'Maximum tension — all alterations on a dominant; resolves dramatically',
  whole_tone: 'Ambiguous, floating — no leading tone, no tonic pull; Debussy territory',
  dim_wh:     'Symmetrical, angular — repeats every minor 3rd; diminished chord scale',
  dim_hw:     'Symmetrical, dense — dominant 7th(♭9) scale; bebop / jazz tension',
  pent_maj:      'Open, folk/country — removes the two "tension" notes of major',
  pent_min:      'Raw, bluesy — the pentatonic workhorse of rock guitar',
  blues:         'Expressive, gritty — minor pentatonic plus the chromatic ♭5 "blue note"',
  // POINT 27
  augmented_scale: 'Symmetrical, ambiguous — alternates m3 and semitone; three embedded augmented triads',
  prometheus:      'Mystic, impressionistic — Scriabin\'s "mystic chord" scale; bright and otherworldly',
  pent_dorian:   'Minor-flavoured with a bright 6th — jazz/fusion pentatonic',
  pent_phrygian: 'Dark, Spanish edge — ♭2 gives it an exotic, tense quality',
  pent_lydian:   'Bright and floating — ♯4 lifts it above the standard major pentatonic',
  pent_mixo:     'Bluesy and open — sus flavour with a dominant ♭7',
  pent_locrian:  'Unstable, chromatic — the darkest pentatonic, rarely used melodically',
};

// Modal parent scale info (for modes derived from a parent)
// { parentName, degree } — not shown for "home" scales
const SCALE_MODAL_PARENT = {
  dorian:     { parent: 'Major', degree: 2 },
  phrygian:   { parent: 'Major', degree: 3 },
  lydian:     { parent: 'Major', degree: 4 },
  mixolydian: { parent: 'Major', degree: 5 },
  locrian:    { parent: 'Major', degree: 7 },
  phryg_dom:  { parent: 'Harmonic Minor', degree: 5 },
  lyd_dom:    { parent: 'Melodic Minor', degree: 4 },
  altered:    { parent: 'Melodic Minor', degree: 7 },
};

// Ordinal suffix helper
function ordinal(n) {
  if (n === 1) return '1st'; if (n === 2) return '2nd'; if (n === 3) return '3rd';
  return n + 'th';
}

// Map semitones-from-root (0–11) to a qualified Roman numeral degree label.
// Reference: major scale degrees 0=I 2=II 4=III 5=IV 7=V 9=VI 11=VII.
// Deviations get ♭ or ♯ prefix; the numeral itself always reflects the
// diatonic position (closest major-scale degree), case is set by the caller.
const SEMITONE_TO_ROMAN = {
   0: { roman: 'I',   prefix: ''  },  // P1
   1: { roman: 'II',  prefix: '\u266d' }, // ♭II
   2: { roman: 'II',  prefix: ''  },  // M2
   3: { roman: 'III', prefix: '\u266d' }, // ♭III
   4: { roman: 'III', prefix: ''  },  // M3
   5: { roman: 'IV',  prefix: ''  },  // P4
   6: { roman: 'IV',  prefix: '\u266f' }, // ♯IV / ♭V
   7: { roman: 'V',   prefix: ''  },  // P5
   8: { roman: 'VI',  prefix: '\u266d' }, // ♭VI
   9: { roman: 'VI',  prefix: ''  },  // M6
  10: { roman: 'VII', prefix: '\u266d' }, // ♭VII
  11: { roman: 'VII', prefix: ''  },  // M7
};

// Return the qualified Roman numeral for a given semitone interval from root.
// quality controls case: 'major'|'augmented' → uppercase, 'minor'|'diminished' → lowercase.
function semitoneToDegree(semi, quality) {
  const entry = SEMITONE_TO_ROMAN[((semi % 12) + 12) % 12];
  if (!entry) return '?';
  const roman = (quality === 'minor' || quality === 'diminished')
    ? entry.roman.toLowerCase()
    : entry.roman;
  return entry.prefix + roman;
}

// Build the degree-numeral row for a scale (all note counts).
// Returns array of qualified Roman numeral strings, e.g. ['I','II','♭III','IV','V','♯V','♭VII','I']
// symbol is passed through so ambiguous semitone counts resolve correctly (e.g. 8→♯V in whole-tone).
function computeDegreeNumerals(intervals, symbol) {
  return intervals.map((semi, i) => {
    if (i === intervals.length - 1) return 'I'; // octave always = I
    const s = semi % 12;
    // Context-aware overrides for ambiguous semitone counts
    if (symbol) {
      if (s === 8 && EIGHT_AS_A5.has(symbol))   return '♯V';
      if (s === 9 && NINE_AS_D7.has(symbol))    return '°VII';
      if (s === 6 && TRITONE_AS_D5.has(symbol)) return '♭V';
    }
    const entry = SEMITONE_TO_ROMAN[s];
    return entry ? entry.prefix + entry.roman : '?';
  });
}

// Build the triad map for a 7-note scale (intervals array, 8 entries including octave).
// Roman numerals now show scale-degree quality relative to the major scale (♭III, ♭VI, etc.)
function computeTriadMap(intervals, sym, rootPc) {
  if (intervals.length !== 8) return null;
  const degrees = intervals.slice(0, 7);
  const map = [];
  const QUALITY_LABEL = { major: '\u25b3', minor: 'm', diminished: '\u00b0', augmented: '+' };

  for (let d = 0; d < 7; d++) {
    const r  = degrees[d];
    const t  = degrees[(d + 2) % 7];
    const fi = degrees[(d + 4) % 7];
    const third = ((t  - r) + 12) % 12;
    const fifth = ((fi - r) + 12) % 12;

    let quality;
    if      (third === 4 && fifth === 7) quality = 'major';
    else if (third === 3 && fifth === 7) quality = 'minor';
    else if (third === 3 && fifth === 6) quality = 'diminished';
    else if (third === 4 && fifth === 8) quality = 'augmented';
    else quality = null;

    const roman    = semitoneToDegree(r, quality || 'major');
    const suffix   = quality ? QUALITY_LABEL[quality] : '?';
    const noteName = spelledNote(r, rootPc, sym);
    map.push(`<span title="${noteName}">${roman}${suffix}</span>`);
  }
  return map;
}

// Riemannian neo-tonal relations for a major or minor triad
// Returns { R, L, P, N } — each an object { name, chord } where chord is e.g. "Am"
function computeRiemannRelations(rootPc, quality, sym) {
  // quality: 'major' | 'minor'
  const rel   = quality === 'major' ? (rootPc + 9) % 12 : (rootPc + 3) % 12;
  const par   = rootPc; // same root, flipped quality
  const lRoot = quality === 'major' ? (rootPc + 4) % 12 : (rootPc + 8) % 12;
  const parQ  = quality === 'major' ? 'minor' : 'major';
  const relQ  = parQ;
  const lQ    = parQ;

  // N (Nebenverwandt) = Relative of the Parallel = P then R
  // For major: P gives minor on same root, R of that minor goes up m3 → same root+3 = rel of original
  // Correct formula: N of major = (root+5) minor; N of minor = (root+7) major
  const nRoot = quality === 'major' ? (rootPc + 5) % 12 : (rootPc + 7) % 12;
  const nQ    = parQ;

  function chordName(pc, q) {
    const n = spelledRoot(pc);
    return n + (q === 'minor' ? 'm' : '');
  }

  return {
    R: { letter: 'R', full: 'Relative',        desc: 'Shares all notes; root shifts by a minor 3rd, quality flips.',         chord: chordName(rel,   relQ) },
    L: { letter: 'L', full: 'Leittonwechsel',  desc: 'One note moves by a semitone (leading-tone exchange); root shifts by a major 3rd, quality flips.', chord: chordName(lRoot, lQ)   },
    P: { letter: 'P', full: 'Parallel',        desc: 'Same root note, opposite quality (major↔minor).',                      chord: chordName(par,   parQ) },
    N: { letter: 'N', full: 'Nebenverwandt',   desc: 'Leading-tone exchange of the Relative — combines R and L transforms.',  chord: chordName(nRoot, nQ)   },
  };
}

// Tritone-sub info for a dominant 7th
function computeTritoneSubInfo(rootPc, sym) {
  const subName = spelledNote(6,  rootPc, sym) + '7';
  const iiName  = spelledNote(10, rootPc, sym) + 'm7';
  const resMaj  = spelledNote(5,  rootPc, sym);
  return { subName, iiName, resMaj, resMin: resMaj + 'm' };
}

// Diminished 7th enharmonic roots (4 enharmonic names, every m3)
function computeDimEnharmonics(rootPc, sym) {
  const roots = [0,3,6,9].map(offset => spelledNote(offset, rootPc, sym));
  return roots.map(n => n + 'dim7');
}

// Dom7♭9 substitutes implied by a dim7 chord
function computeDimDomSubs(rootPc, sym) {
  // Each root of the dim7 implies a dom7♭9 whose root is a M3 below that dim note
  // i.e. for Cdim7 (C Eb Gb A) → G7♭9 Bb7♭9 Db7♭9 E7♭9
  return [0,3,6,9].map(offset => {
    // Each dim7 note implies a dom7b9 whose root is a M3 below (= m6 above = +9 semitones from dim note)
    const domRootInterval = (offset + 9) % 12;
    return spelledNote(domRootInterval, rootPc, sym) + '7♭9';
  });
}

// Augmented enharmonic roots (3 enharmonic names, every M3)
function computeAugEnharmonics(rootPc, sym) {
  return [0,4,8].map(offset => spelledNote(offset, rootPc, sym) + 'aug');
}

// Half-dim (m7♭5) context: ii° chord of what minor key?
function computeHalfDimContext(rootPc, sym) {
  // m7b5 is the ii° of the minor key whose root is a M2 above
  const minKeyName = spelledNote(2, rootPc, sym);
  const v7Name     = spelledNote(5, rootPc, sym) + '7';
  return { minKeyName, v7Name };
}

// Sus resolution: sus2 → maj, sus4 → maj (same root implied resolution)
function computeSusResolution(rootPc, sym, susSymbol) {
  const rootName = spelledRoot(rootPc);
  if (susSymbol === 'sus2') return `${rootName} or ${rootName}m (adds major or minor 3rd)`;
  if (susSymbol === 'sus4') return `${rootName} or ${rootName}m`;
  return null;
}

// Build an HTML pill element
function makePill(label, value) {
  const pill = document.createElement('div');
  pill.className = 'breakdown-pill';
  if (label) {
    const lEl = document.createElement('span');
    lEl.className = 'breakdown-pill-label';
    lEl.textContent = label;
    pill.appendChild(lEl);
  }
  const vEl = document.createElement('span');
  vEl.className = 'breakdown-pill-value';
  vEl.textContent = value;
  pill.appendChild(vEl);
  return pill;
}

// Build Riemannian row: pills + hover-tooltip legend
function makeRiemannRow(panel, relations) {
  const row = document.createElement('div');
  row.className = 'breakdown-row';
  const key = document.createElement('span');
  key.className = 'breakdown-key';

  // Wrap label + ⓘ icon together
  const labelWrap = document.createElement('span');
  labelWrap.className = 'bd-riemann-wrap';
  labelWrap.style.display = 'inline-flex';
  labelWrap.style.alignItems = 'center';

  const labelText = document.createElement('span');
  labelText.textContent = 'Neo-tonal';

  const icon = document.createElement('span');
  icon.className = 'bd-riemann-icon';
  icon.setAttribute('tabindex', '0');
  icon.textContent = '?';

  const tooltip = document.createElement('div');
  tooltip.className = 'bd-riemann-tooltip';
  tooltip.innerHTML = Object.values(relations).map(r =>
    `<p><strong>${r.letter} — ${r.full}</strong>${r.desc}</p>`
  ).join('');

  labelWrap.appendChild(labelText);
  labelWrap.appendChild(icon);
  labelWrap.appendChild(tooltip);
  key.appendChild(labelWrap);

  const val = document.createElement('span');
  val.className = 'breakdown-val';
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'breakdown-pills';

  Object.values(relations).forEach(r => {
    const pill = document.createElement('div');
    pill.className = 'breakdown-pill';
    const lEl = document.createElement('span');
    lEl.className = 'breakdown-pill-label';
    lEl.textContent = r.letter + ' · ' + r.full;
    const vEl = document.createElement('span');
    vEl.className = 'breakdown-pill-value';
    vEl.textContent = r.chord;
    pill.appendChild(lEl);
    pill.appendChild(vEl);
    pillsWrap.appendChild(pill);
  });

  val.appendChild(pillsWrap);
  row.appendChild(key);
  row.appendChild(val);
  panel.appendChild(row);
}

// ─── POINT 14: Post-answer breakdown panel ───────────────────────────────────

// Semitone count → interval abbreviation (always ascending)
const INTERVAL_ABBR = {
  0:'P1', 1:'m2', 2:'M2', 3:'m3', 4:'M3', 5:'P4',
  6:'A4', 7:'P5', 8:'m6', 9:'M6', 10:'m7', 11:'M7', 12:'P8',
  13:'m9', 14:'M9', 15:'A9', 17:'P11', 18:'A11', 20:'m13', 21:'M13',
};
// Context-aware interval abbreviation. Pass symbol so ambiguous semitone counts
// resolve to the correct interval quality for the chord/scale/interval in question.
function intervalAbbr(semitones, symbol) {
  const s = Math.abs(semitones);
  if (symbol) {
    if (s === 6 && TRITONE_AS_D5.has(symbol)) return 'd5';
    if (s === 8 && EIGHT_AS_A5.has(symbol))   return 'A5';
    if (s === 9 && NINE_AS_D7.has(symbol))    return 'd7';
  }
  return INTERVAL_ABBR[s] || (s + 'st');
}

// POINT 24: context-aware tritone label
function tritoneLabel(style) {
  if (style === 'descending') return 'd5';
  if (style === 'harmonic')   return 'A4 / d5';
  return 'A4'; // ascending or default
}

// Figured bass superscripts for triads and 7th chords
function figuredBass(invIndex, noteCount) {
  if (noteCount === 3) { // triads
    if (invIndex === 1) return '\u2076';           // ⁶
    if (invIndex === 2) return '\u2076\u2084';     // ⁶₄
  } else if (noteCount === 4) { // 7th chords
    if (invIndex === 0) return '\u2077';           // ⁷
    if (invIndex === 1) return '\u2076\u2085';     // ⁶₅
    if (invIndex === 2) return '\u2074\u2083';     // ⁴₃
    if (invIndex === 3) return '\u2074\u2082';     // ⁴₂
  }
  return '';
}

function makeBDRow(panel, label, content) {
  const row = document.createElement('div');
  row.className = 'breakdown-row';
  const k = document.createElement('span');
  k.className = 'breakdown-key';
  k.textContent = label;
  const v = document.createElement('span');
  v.className = 'breakdown-val';
  v.innerHTML = content;
  row.appendChild(k);
  row.appendChild(v);
  panel.appendChild(row);
}

// Reuses existing cs-section/cs-header/cs-body/cs-arrow CSS — no new styles needed.
// label: text on the toggle header. open: start expanded.
// Returns { section, body } — append section to panel, rows go into body.
function makeCSGroup(label, open = false) {
  const section = document.createElement('div');
  section.className = 'cs-section';
  section.style.margin = '0.35rem 0';

  const hdr = document.createElement('div');
  hdr.className = 'cs-header';

  const hdrText = document.createElement('span');
  hdrText.textContent = label;

  const arrow = document.createElement('span');
  arrow.className = 'cs-arrow';
  arrow.textContent = open ? '▾' : '▸';

  hdr.appendChild(hdrText);
  hdr.appendChild(arrow);

  const body = document.createElement('div');
  body.className = open ? 'cs-body open' : 'cs-body';
  body.style.padding = '0.4rem 0.625rem';

  hdr.addEventListener('click', () => {
    const isOpen = body.classList.toggle('open');
    arrow.textContent = isOpen ? '▾' : '▸';
  });

  section.appendChild(hdr);
  section.appendChild(body);
  return { section, body };
}

// Build the Level-1 collapsible name header.
// Returns { body } — append body to panel; all content goes into body.
// The header itself is appended to panel immediately.
function makeNameHeader(panel, labelEl_or_text) {
  const hdr = document.createElement('div');
  hdr.className = 'breakdown-header';
  hdr.style.cursor = 'pointer';
  hdr.style.userSelect = 'none';
  hdr.style.display = 'flex';
  hdr.style.justifyContent = 'space-between';
  hdr.style.alignItems = 'center';

  if (typeof labelEl_or_text === 'string') {
    const span = document.createElement('span');
    span.textContent = labelEl_or_text;
    hdr.appendChild(span);
  } else {
    hdr.appendChild(labelEl_or_text);
  }

  const arrow = document.createElement('span');
  arrow.className = 'cs-arrow';
  arrow.textContent = '▸';
  arrow.style.fontSize = '0.75rem';
  hdr.appendChild(arrow);

  const body = document.createElement('div');
  body.className = 'cs-body'; // closed by default
  body.style.padding = '0.4rem 0 0';
  body.style.borderTop = 'none';

  hdr.addEventListener('click', () => {
    const isOpen = body.classList.toggle('open');
    arrow.textContent = isOpen ? '▾' : '▸';
  });

  panel.appendChild(hdr);
  panel.appendChild(body);
  return { body };
}

function joinSep(arr) {
  return arr.map((n, i) =>
    i === 0 ? n : '<span class="breakdown-sep">\u2013</span>' + n
  ).join('');
}

// ─── POINT 36: Chord scales ───────────────────────────────────────────────────

// Reference list: every scale we test against, with tag and short description.
// Built from SCALES array (strips octave note) + any supplementary entries not
// in the quiz pool. All intervals are mod-12 pitch classes from root.
const SCALE_REF = (() => {
  // Tag and note data keyed by symbol
  const META = {
    // Pentatonic
    pent_maj:     { tag: 'open',    note: 'no semitones, very consonant' },
    pent_min:     { tag: 'open',    note: 'blues-adjacent, no semitones' },
    pent_dorian:  { tag: 'modal',   note: 'dorian without 2nd and 6th' },
    pent_phrygian:{ tag: 'dark',    note: 'phrygian without 4th and 7th' },
    pent_lydian:  { tag: 'bright',  note: 'lydian without 3rd and 7th' },
    pent_mixo:    { tag: 'neutral', note: 'mixolydian without 3rd and 6th' },
    pent_locrian: { tag: 'tense',   note: 'locrian without 4th and 7th' },
    // Hexatonic
    blues:        { tag: 'bluesy',  note: '♭5 blue note adds grit' },
    whole_tone:   { tag: 'dreamy',  note: 'all whole steps, no leading tone' },
    augmented_scale:{ tag: 'sym',   note: 'symmetrical, augmented colour' },
    prometheus:   { tag: 'mystic',  note: 'Scriabin mystic chord scale' },
    // Diatonic / Modal
    major:        { tag: 'neutral', note: 'the home scale' },
    nat_minor:    { tag: 'dark',    note: 'natural minor / Aeolian' },
    harm_minor:   { tag: 'exotic',  note: 'raised 7th, classical minor feel' },
    mel_minor:    { tag: 'hybrid',  note: 'minor with major 6th and 7th' },
    dorian:       { tag: 'neutral', note: 'minor with major 6th' },
    phrygian:     { tag: 'dark',    note: 'minor with ♭2, Spanish flavour' },
    lydian:       { tag: 'bright',  note: '♯4 lifts the mood' },
    mixolydian:   { tag: 'neutral', note: 'major with ♭7' },
    locrian:      { tag: 'tense',   note: '♭2 and ♭5, very unstable' },
    phryg_dom:    { tag: 'exotic',  note: 'harmonic minor V, Spanish/Jewish feel' },
    lyd_dom:      { tag: 'bright',  note: 'Mixolydian ♯4, lydian-dominant tension' },
    altered:      { tag: 'tense',   note: '♭9 ♯9 ♭5/♯11 ♭13, maximum alteration' },
    // Octatonic
    dim_wh:       { tag: 'sym',     note: 'symmetrical, W-H pattern' },
    dim_hw:       { tag: 'dense',   note: 'H-W pattern, dom7♭9 colour' },
  };

  return SCALES.map(s => {
    const pcs = new Set(s.intervals.map(i => i % 12));
    const m   = META[s.symbol] || { tag: '', note: '' };
    return { name: s.name, symbol: s.symbol, pcs, tag: m.tag, note: m.note };
  });
})();

// Given a root pitch class and a Set of all pitch classes in the chord,
// return array of matching scale entries { name, symbol, tag, note }.
function getChordScales(rootPc, chordPcs) {
  const results = [];
  for (const sc of SCALE_REF) {
    // Build this scale's pitch classes transposed to rootPc
    const scalePcs = new Set(
      [...sc.pcs].map(i => (i + rootPc) % 12)
    );
    // Every chord pitch class must be in the scale
    let fits = true;
    for (const pc of chordPcs) {
      if (!scalePcs.has(pc)) { fits = false; break; }
    }
    if (fits) results.push(sc);
  }
  return results;
}

// Render a collapsible "Chord scales" sub-section into panel.
// rootPc: the tonal centre pitch class (integer 0-11)
// chordPcs: iterable of pitch classes to match
function makeChordScalesRow(panel, rootPc, chordPcs) {
  const matches = getChordScales(rootPc, new Set([...chordPcs].map(p => ((p % 12) + 12) % 12)));
  if (!matches.length) return;

  // Wrapper row so the label aligns with other breakdown rows
  const rowWrap = document.createElement('div');
  rowWrap.className = 'breakdown-row';

  const keyEl = document.createElement('span');
  keyEl.className = 'breakdown-key';
  keyEl.textContent = 'Chord scales';
  rowWrap.appendChild(keyEl);

  const valEl = document.createElement('span');
  valEl.className = 'breakdown-val';
  valEl.style.flex = '1';

  // Collapsible section
  const sec = document.createElement('div');
  sec.className = 'cs-section';

  const hdr = document.createElement('div');
  hdr.className = 'cs-header';
  const hdrText = document.createElement('span');
  hdrText.textContent = matches.length + ' scale' + (matches.length === 1 ? '' : 's') + ' fit';
  const arrow = document.createElement('span');
  arrow.className = 'cs-arrow';
  arrow.textContent = '▸';
  hdr.appendChild(hdrText);
  hdr.appendChild(arrow);

  const body = document.createElement('div');
  body.className = 'cs-body';

  hdr.addEventListener('click', () => {
    const open = body.classList.toggle('open');
    arrow.textContent = open ? '▾' : '▸';
  });

  matches.forEach(sc => {
    const row = document.createElement('div');
    row.className = 'cs-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'cs-name cs-name-link';
    nameEl.textContent = sc.name;
    nameEl.title = 'Open in Dictionary';
    nameEl.addEventListener('click', () => {
      dictSymbol = sc.symbol;
      if (currentMode !== 'scales') switchMode('scales');
      setAppMode('dict');
    });
    row.appendChild(nameEl);

    if (sc.tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'cs-tag';
      tagEl.textContent = sc.tag;
      row.appendChild(tagEl);
    }

    if (sc.note) {
      const noteEl = document.createElement('span');
      noteEl.className = 'cs-note';
      noteEl.textContent = sc.note;
      row.appendChild(noteEl);
    }

    body.appendChild(row);
  });

  sec.appendChild(hdr);
  sec.appendChild(body);
  valEl.appendChild(sec);
  rowWrap.appendChild(valEl);
  panel.appendChild(rowWrap);
}

// ─── POINT 37: Voice leading resolution ──────────────────────────────────────

// Resolution target table.
// Each entry: { offset: semitones from chord root to resolution root, quality: 'maj'|'min'|'dom7'|'maj7'|'m7' }
// offset is measured upward (mod 12).
// For chord types not listed, the nearest sensible resolution is used.
// NOTE: PROGRESSIONS, PROG_DEGREES, PROG_QUALITIES, PROG_GROUPS, PROG_GROUP_COLLAPSED,
// selectedProgressions, and progression state vars all live in js/data/progressions.js

const RESOLUTION_TARGETS = {
  // Major triads → subdominant (P4 up = IV)
  'maj':      { offset: 5,  quality: 'maj',  label: '→ IV' },
  // Minor triads → relative major (m3 up)
  'm':        { offset: 3,  quality: 'maj',  label: '→ ♭III' },
  // Dominant 7th → I (P4 up)
  '7':        { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9':      { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_b9':     { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_s9':     { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_13':     { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9_13':   { offset: 5,  quality: 'maj',  label: '→ I' },
  '7sus4':    { offset: 5,  quality: 'maj',  label: '→ I' },
  // Maj7 → IV (step down, common in jazz)
  'maj7':     { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9':   { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9_s11':{ offset: 5, quality: 'maj7', label: '→ IVΔ7' },
  'maj6':     { offset: 5,  quality: 'maj',  label: '→ IV' },
  'maj6_9':   { offset: 5,  quality: 'maj',  label: '→ IV' },
  // Minor 7th → IV (ii→V motion or ii→V in major)
  'm7':       { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_9':     { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_11':    { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm6':       { offset: 5,  quality: 'dom7', label: '→ V7' },
  // Minor major 7th → resolves down (leading tone to tonic)
  'mMaj7':    { offset: 0,  quality: 'min',  label: '→ im' },
  // Diminished triad → m2 above (leading tone resolution)
  'dim':      { offset: 1,  quality: 'maj',  label: '→ m2↑' },
  // Dim7 → dom7 a M3 below each note (pick lower root + m2 up)
  'o7':       { offset: 1,  quality: 'maj',  label: '→ m2↑' },
  // Half-dim → dom7 a P4 up (ii∅→V7 in minor)
  'm7b5':     { offset: 5,  quality: 'dom7', label: '→ V7' },
  // Augmented → P4 up to major (aug V resolves to I)
  'aug':      { offset: 5,  quality: 'maj',  label: '→ I' },
  'augMaj7':  { offset: 5,  quality: 'maj',  label: '→ I' },
  'aug7':     { offset: 5,  quality: 'maj',  label: '→ I' },
  // Sus → same root major
  'sus4':     { offset: 0,  quality: 'maj',  label: '→ I' },
  'sus2':     { offset: 0,  quality: 'maj',  label: '→ I' },
  // Power chord → same root major
  'power':    { offset: 0,  quality: 'maj',  label: '→ I' },
  // Add chords → IV
  'add9':     { offset: 5,  quality: 'maj',  label: '→ IV' },
  'madd9':    { offset: 3,  quality: 'maj',  label: '→ ♭III' },
  // Extended dominants → I (P4 up)
  '9':        { offset: 5,  quality: 'maj',  label: '→ I' },
  'b9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  's9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '13':       { offset: 5,  quality: 'maj',  label: '→ I' },
  // Major 9/11/13
  'maj9':     { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj11':    { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj13':    { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  // Minor 9/11/13
  'm9':       { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm11':      { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm13':      { offset: 5,  quality: 'dom7', label: '→ V7' },
  // Sixth chords
  '6':        { offset: 5,  quality: 'maj',  label: '→ IV' },
};

// Interval names for voice leading labels (ascending)
const VL_INTERVAL_NAMES = {
  0: 'common tone', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3',
  5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8',
};

// Role labels for voice leading: what is the role of the SOURCE note in the chord?
// Returns a short label based on how many semitones above the (harmonic) root the note is.
function vlRoleLabel(semiFromRoot) {
  const s = ((semiFromRoot % 12) + 12) % 12;
  const roles = {
    0: 'root', 1: '♭9', 2: '9th', 3: '♭3/♯9', 4: '3rd',
    5: '4th/11th', 6: '♯11/♭5', 7: '5th', 8: '♯5/♭13', 9: '6th/13th',
    10: '♭7th', 11: 'maj7th',
  };
  return roles[s] || '';
}

// Build resolution MIDI notes for a given target quality and root midi
function buildResolutionMidi(targetRootMidi, quality) {
  const intervals = {
    'maj':  [0, 4, 7],
    'min':  [0, 3, 7],
    'dom7': [0, 4, 7, 10],
    'maj7': [0, 4, 7, 11],
    'm7':   [0, 3, 7, 10],
  }[quality] || [0, 4, 7];
  return intervals.map(i => targetRootMidi + i);
}

// Get resolution info for current chord state.
// Returns { targetRootMidi, targetMidi[], targetName, targetQuality, label } or null.
// targetQuality is passed directly to computeVoiceLeading() — no string parsing needed.
function getResolutionInfo() {
  if (currentMode !== 'chords') return null;

  // Helper: build display suffix from quality string (consistent with app notation)
  function qualSuffix(q) {
    if (q === 'dom7') return '7';
    if (q === 'maj7') return 'Maj7';
    if (q === 'm7')   return 'm7';
    if (q === 'min')  return 'm';
    return '';
  }

  // ── POLYCHORD: resolve as lower root → IV (P4 up) ───────────────────────────
  if (currentChord?.family === 'poly' && currentPolyLowerRootMidi !== null) {
    const targetRootMidi  = currentPolyLowerRootMidi + 5;
    const targetQuality   = 'maj';
    const targetMidi      = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName      = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV of lower root' };
  }

  // ── UST: resolve as implied chord ────────────────────────────────────────────
  if (currentChord?.family === 'ust' && currentUSTRootMidi !== null) {
    const shellQ = currentChord.shellQuality || 'dom7';
    let offset, targetQuality, label;
    if      (shellQ === 'dom7') { offset = 5; targetQuality = 'maj';  label = '→ I'; }
    else if (shellQ === 'min')  { offset = 5; targetQuality = 'dom7'; label = '→ V7'; }
    else                        { offset = 5; targetQuality = 'maj7'; label = '→ IVMaj7'; }
    const targetRootMidi = currentUSTRootMidi + offset;
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label };
  }

  // ── SLASH CHORD: resolve upper chord → IV ────────────────────────────────────
  if (currentChord?.family === 'slash' && currentUpperRootMidi !== null) {
    const targetRootMidi = currentUpperRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV of upper root' };
  }

  // ── NORMAL CHORD ─────────────────────────────────────────────────────────────
  if (!currentChord || !currentChordRootMidi) return null;

  // Read from cache if available (Pass 1: analyseChord() wired in)
  if (currentVoiceLeadingAnalysis) {
    const { contexts, isAmbiguous } = currentVoiceLeadingAnalysis;

    if (!isAmbiguous && contexts && contexts.length) {
      const primaryCtx = contexts[0];
      const primaryRes = (primaryCtx.resolutions || [])[0];

      if (primaryRes) {
        const qualMap = { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7' };
        const targetQuality  = qualMap[primaryRes.targetQuality] || 'maj';
        const srcMidi        = currentChordRootMidi || 60;
        const targetRootPc   = primaryRes.targetRootPc;
        let targetRootMidi   = (Math.floor(srcMidi / 12) * 12) + targetRootPc;
        if (targetRootMidi < srcMidi - 6) targetRootMidi += 12;
        if (targetRootMidi > srcMidi + 6) targetRootMidi -= 12;
        const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
        const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
        const label          = primaryRes.cadenceName || primaryRes.resolutionType || '→';
        return { targetRootMidi, targetMidi, targetName, targetQuality, label };
      }
    }

    // Ambiguous or no context found — P4 up fallback
    const targetRootMidi = currentChordRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV' };
  }

  // ── Fallback: RESOLUTION_TARGETS (used before analyseChord() is wired) ───────
  const sym = currentChord.invIndex !== undefined ? currentChord.baseChord.symbol : currentChord.symbol;
  const tgt = RESOLUTION_TARGETS[sym];
  if (!tgt) {
    const targetRootMidi = currentChordRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV' };
  }
  const targetRootMidi = currentChordRootMidi + tgt.offset;
  const targetQuality  = tgt.quality;
  const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
  const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
  return { targetRootMidi, targetMidi, targetName, targetQuality, label: tgt.label };
}

// Compute voice leading: for each source note, find its resolution target.
// Uses computeVoiceLeadingRules() from voiceLeading.js when a context is
// available; falls back to proximity loop otherwise.
// Returns array of { fromName, toName, dir, absSemi, intervalName, role, isCommonTone }
function computeVoiceLeading(sourceMidi, targetMidi) {
  // Shared root/symbol helpers
  function getVLRoot() {
    let rootMidi = currentChordRootMidi;
    if (currentChord?.family === 'poly'  && currentPolyLowerRootMidi) rootMidi = currentPolyLowerRootMidi;
    if (currentChord?.family === 'ust'   && currentUSTRootMidi)       rootMidi = currentUSTRootMidi;
    if (currentChord?.family === 'slash' && currentUpperRootMidi)     rootMidi = currentUpperRootMidi;
    return rootMidi;
  }
  function getVLSym() {
    return currentChord?.invIndex !== undefined
      ? currentChord.baseChord.symbol
      : (currentChord?.symbol || '');
  }

  // ── Rule-based engine (requires voiceLeading.js + cached analysis) ───────────
  const info = getResolutionInfo();
  const ctx  = currentVoiceLeadingAnalysis?.contexts?.[0] || null;

  if (typeof computeVoiceLeadingRules === 'function' && info && ctx) {
    const targetRootPc = (info.targetRootMidi % 12 + 12) % 12;
    // info.targetQuality is already in the right format for computeVoiceLeadingRules
    // which expects 'major'|'minor'|'dominant'|'maj7'|'m7'
    const qualMap = { maj: 'major', min: 'minor', dom7: 'dominant', maj7: 'maj7', m7: 'm7' };
    const targetQuality = qualMap[info.targetQuality] || 'major';

    const moves   = computeVoiceLeadingRules(sourceMidi, targetRootPc, targetQuality, ctx);
    const rootMidi = getVLRoot();
    const rootPc   = (rootMidi % 12 + 12) % 12;
    const sym      = getVLSym();

    return moves.map(m => {
      const semiFromRoot = ((m.fromMidi - rootMidi) % 12 + 12) % 12;
      const role         = vlRoleLabel(semiFromRoot);
      const fromName     = spelledNote(semiFromRoot, rootPc, sym);
      const toSemi       = ((m.toMidi - rootMidi) % 12 + 12) % 12;
      const toName       = spelledNote(toSemi, rootPc, sym);
      const dir          = m.direction === 'up' ? '↑' : m.direction === 'down' ? '↓' : '—';
      const intervalName = VL_INTERVAL_NAMES[m.semitones] || (m.semitones + 'st');
      return { fromName, toName, dir, absSemi: m.semitones, intervalName, role, isCommonTone: m.semitones === 0 };
    });
  }

  // ── Proximity fallback ────────────────────────────────────────────────────────
  const rootMidi = getVLRoot();
  const rootPc   = (rootMidi % 12 + 12) % 12;
  const sym      = getVLSym();
  const src      = [...sourceMidi].sort((a, b) => a - b);
  const tgt      = [...targetMidi].sort((a, b) => a - b);

  return src.map(s => {
    let best = null, bestDist = Infinity;
    for (const t of tgt) {
      for (const offset of [0, 12, -12, 24, -24]) {
        const cand = t + offset;
        const dist = Math.abs(cand - s);
        if (dist < bestDist) { bestDist = dist; best = cand; }
      }
    }
    const delta        = best - s;
    const dir          = delta === 0 ? '—' : delta > 0 ? '↑' : '↓';
    const absSemi      = Math.abs(delta);
    const intervalName = VL_INTERVAL_NAMES[absSemi] || (absSemi + 'st');
    const semiFromRoot = ((s - rootMidi) % 12 + 12) % 12;
    const role         = vlRoleLabel(semiFromRoot);
    const fromName     = spelledNote(semiFromRoot, rootPc, sym);
    const toSemi       = ((best - rootMidi) % 12 + 12) % 12;
    const toName       = spelledNote(toSemi, rootPc, sym);
    return { fromName, toName, dir, absSemi, intervalName, role, isCommonTone: delta === 0 };
  });
}

// ── POINT 37 Pass 2: Multi-context voice leading row ─────────────────────────
//
// When currentVoiceLeadingAnalysis is populated, renders one collapsible
// cs-section per harmonic context, each with:
//   Header: roman · scale name · function label · tension dots
//   Body:   one sub-section per resolution target with a vl-table
//
// Falls back to the original single-resolution display for ambiguous families
// (aug, sus, poly) where isAmbiguous=true or cache is null.
//
function makeVoiceLeadingRow(panel) {

  // ── Helper: build a vl-table from engine move objects ────────────────────────
  // moves: array of { fromMidi, toMidi, semitones, direction }
  function buildVLTable(moves, rootMidi, rootPc, sym) {
    const tbl = document.createElement('table');
    tbl.className = 'vl-table';
    moves.forEach(move => {
      const semiFromRoot   = ((move.fromMidi - rootMidi) % 12 + 12) % 12;
      const toSemiFromRoot = ((move.toMidi   - rootMidi) % 12 + 12) % 12;
      const fromName  = spelledNote(semiFromRoot,   rootPc, sym);
      const toName    = spelledNote(toSemiFromRoot, rootPc, sym);
      const role      = vlRoleLabel(semiFromRoot);
      const isCommon  = move.semitones === 0;
      const dir       = move.direction === 'up' ? '↑' : move.direction === 'down' ? '↓' : '—';
      const intName   = VL_INTERVAL_NAMES[move.semitones] || (move.semitones + 'st');
      const tr = document.createElement('tr');
      const tdFrom = document.createElement('td'); tdFrom.textContent = fromName + ' →';
      const tdTo   = document.createElement('td'); tdTo.textContent   = toName;
      const tdInt  = document.createElement('td'); tdInt.textContent  = isCommon ? '' : (dir + ' ' + intName);
      const tdRole = document.createElement('td'); tdRole.textContent = role;
      tr.appendChild(tdFrom); tr.appendChild(tdTo);
      tr.appendChild(tdInt);  tr.appendChild(tdRole);
      tbl.appendChild(tr);
    });
    return tbl;
  }

  // ── Helper: tension dots ●●●○○ (max 5) ───────────────────────────────────────
  function tensionDots(tension) {
    const filled = Math.round(tension * 5);
    return '●'.repeat(filled) + '○'.repeat(5 - filled);
  }

  // ── Helper: engine quality → display suffix ───────────────────────────────────
  function engineQualToSuffix(q) {
    return { major: '', minor: 'm', dominant: '7', maj7: 'Maj7', m7: 'm7', dim: '°', aug: '+' }[q] || '';
  }

  // ── Helper: engine quality → buildResolutionMidi key ─────────────────────────
  function engineQualToBuildKey(q) {
    return { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7' }[q] || 'maj';
  }

  // ── Helper: human-readable function label ─────────────────────────────────────
  function fnLabel(fn) {
    return { tonic: 'tonic', predominant: 'predominant',
             subdominant: 'subdominant', dominant: 'dominant' }[fn] || fn;
  }

  // ── Helper: resolution type → display label ───────────────────────────────────
  function resTypeLabel(t) {
    return {
      authentic:   'Authentic cadence',
      deceptive:   'Deceptive cadence',
      plagal:      'Plagal cadence',
      to_dominant: 'Move to dominant',
      tritone_sub: 'Tritone substitution',
      departure:   'Departure path',
      direct:      'Direct',
    }[t] || t;
  }

  // Source midi for this chord family
  const sourceMidi = (() => {
    if (currentChord?.family === 'poly')  return [...currentPolyLowerMidi, ...currentPolyUpperMidi];
    if (currentChord?.family === 'ust')   return [...currentMidiNotes];
    if (currentChord?.family === 'slash') return [currentSlashBassMidi, ...currentMidiNotes];
    return [...currentMidiNotes];
  })();

  // Root midi / pc / sym for note spelling
  const rootMidi = (() => {
    if (currentChord?.family === 'poly'  && currentPolyLowerRootMidi) return currentPolyLowerRootMidi;
    if (currentChord?.family === 'ust'   && currentUSTRootMidi)       return currentUSTRootMidi;
    if (currentChord?.family === 'slash' && currentUpperRootMidi)     return currentUpperRootMidi;
    return currentChordRootMidi || 60;
  })();
  const rootPc = (rootMidi % 12 + 12) % 12;
  const sym    = currentChord?.invIndex !== undefined
    ? currentChord.baseChord.symbol
    : (currentChord?.symbol || 'maj');

  // ── PASS 2: rich multi-context display ───────────────────────────────────────
  const cache = currentVoiceLeadingAnalysis;

  if (cache && !cache.isAmbiguous && cache.contexts && cache.contexts.length) {

    const rowWrap = document.createElement('div');
    rowWrap.className = 'breakdown-row';
    rowWrap.style.alignItems = 'flex-start';

    const keyEl = document.createElement('span');
    keyEl.className = 'breakdown-key';
    keyEl.style.paddingTop = '0.25rem';
    keyEl.textContent = 'Resolves to';
    rowWrap.appendChild(keyEl);

    const valEl = document.createElement('span');
    valEl.className = 'breakdown-val';
    valEl.style.flex = '1';

    cache.contexts.forEach((ctx, ctxIdx) => {
      const scaleRootName = spelledRoot(ctx.scaleRootPc);
      const isDeparture   = ctx.harmonicFunction === 'tonic' && ctx.tension < 0.2;

      // ── Context collapsible ─────────────────────────────────────────────────
      const ctxSec = document.createElement('div');
      ctxSec.className = 'cs-section';
      ctxSec.style.margin = '0.25rem 0';

      const ctxHdr = document.createElement('div');
      ctxHdr.className = 'cs-header';

      const romanEl = document.createElement('span');
      romanEl.style.cssText = 'color:var(--accent);font-weight:700;margin-right:0.4rem;min-width:2rem;display:inline-block;';
      romanEl.textContent = ctx.roman;

      const scaleEl = document.createElement('span');
      scaleEl.style.cssText = 'flex:1;font-size:0.85rem;';
      scaleEl.textContent = scaleRootName + ' ' + ctx.scaleName;

      const fnEl = document.createElement('span');
      fnEl.style.cssText = 'font-size:0.75rem;color:var(--accent-text);margin-right:0.4rem;';
      fnEl.textContent = fnLabel(ctx.harmonicFunction);

      const dotsEl = document.createElement('span');
      dotsEl.style.cssText = 'font-size:0.7rem;letter-spacing:-1px;color:var(--accent);margin-right:0.35rem;';
      dotsEl.textContent = tensionDots(ctx.tension);

      const ctxArrow = document.createElement('span');
      ctxArrow.className = 'cs-arrow';
      ctxArrow.textContent = ctxIdx === 0 ? '▾' : '▸';

      ctxHdr.appendChild(romanEl);
      ctxHdr.appendChild(scaleEl);
      ctxHdr.appendChild(fnEl);
      ctxHdr.appendChild(dotsEl);
      ctxHdr.appendChild(ctxArrow);

      const ctxBody = document.createElement('div');
      ctxBody.className = ctxIdx === 0 ? 'cs-body open' : 'cs-body';
      ctxBody.style.padding = '0.25rem 0.625rem 0.4rem';

      ctxHdr.addEventListener('click', () => {
        const isOpen = ctxBody.classList.toggle('open');
        ctxArrow.textContent = isOpen ? '▾' : '▸';
      });

      // Stable tonic note
      if (isDeparture) {
        const note = document.createElement('div');
        note.style.cssText = 'font-size:0.8rem;color:var(--accent-text);margin-bottom:0.3rem;padding:0.2rem 0;';
        note.textContent = 'Stable tonic — no resolution needed. Departure paths:';
        ctxBody.appendChild(note);
      }

      // ── One sub-section per resolution ───────────────────────────────────────
      (ctx.resolutions || []).forEach((res, resIdx) => {
        const targetRootName = spelledRoot(res.targetRootPc);
        const targetLabel    = targetRootName + engineQualToSuffix(res.targetQuality);
        const strengthPct    = Math.round(res.strength * 100) + '%';

        const resSec = document.createElement('div');
        resSec.className = 'cs-section';
        resSec.style.margin = '0.2rem 0';

        const resHdr = document.createElement('div');
        resHdr.className = 'cs-header';
        resHdr.style.paddingLeft = '0.5rem';

        const resNameEl = document.createElement('span');
        resNameEl.style.cssText = 'font-weight:600;margin-right:0.5rem;';
        resNameEl.textContent = '→ ' + targetLabel;

        const cadEl = document.createElement('span');
        cadEl.style.cssText = 'flex:1;font-size:0.78rem;color:var(--accent-text);';
        cadEl.textContent = resTypeLabel(res.resolutionType);

        const strEl = document.createElement('span');
        strEl.style.cssText = 'font-size:0.72rem;color:var(--accent-text);margin-right:0.3rem;';
        strEl.textContent = strengthPct;

        const resArrow = document.createElement('span');
        resArrow.className = 'cs-arrow';
        resArrow.textContent = (ctxIdx === 0 && resIdx === 0) ? '▾' : '▸';

        resHdr.appendChild(resNameEl);
        resHdr.appendChild(cadEl);
        resHdr.appendChild(strEl);
        resHdr.appendChild(resArrow);

        const resBody = document.createElement('div');
        resBody.className = (ctxIdx === 0 && resIdx === 0) ? 'cs-body open' : 'cs-body';
        resBody.style.padding = '0.25rem 0.625rem';

        resHdr.addEventListener('click', () => {
          const isOpen = resBody.classList.toggle('open');
          resArrow.textContent = isOpen ? '▾' : '▸';
        });

        // Voice leading table — pre-computed by analyseChord()
        if (res.voiceLeading && res.voiceLeading.length) {
          resBody.appendChild(buildVLTable(res.voiceLeading, rootMidi, rootPc, sym));
        } else {
          // On-demand fallback — fires only if voiceLeading wasn't pre-computed
          const buildKey     = engineQualToBuildKey(res.targetQuality);
          let tgtRootMidi    = (Math.floor(rootMidi / 12) * 12) + res.targetRootPc;
          if (tgtRootMidi < rootMidi - 6) tgtRootMidi += 12;
          if (tgtRootMidi > rootMidi + 6) tgtRootMidi -= 12;
          const targetMidi   = buildResolutionMidi(tgtRootMidi, buildKey);
          const oldVl        = computeVoiceLeading(sourceMidi, targetMidi);
          const sorted       = [...sourceMidi].sort((a, b) => a - b);
          const moves        = oldVl.map((v, i) => {
            const fMidi = sorted[i] ?? rootMidi;
            const semi  = v.absSemi ?? 0;
            const dir   = v.dir === '↑' ? 'up' : v.dir === '↓' ? 'down' : 'none';
            const toPc  = targetMidi.reduce((best, t) =>
              Math.abs(t - fMidi) < Math.abs(best - fMidi) ? t : best, targetMidi[0]);
            return { fromMidi: fMidi, toMidi: toPc, semitones: semi, direction: dir };
          });
          resBody.appendChild(buildVLTable(moves, rootMidi, rootPc, sym));
        }

        resSec.appendChild(resHdr);
        resSec.appendChild(resBody);
        ctxBody.appendChild(resSec);
      });

      ctxSec.appendChild(ctxHdr);
      ctxSec.appendChild(ctxBody);
      valEl.appendChild(ctxSec);
    });

    rowWrap.appendChild(valEl);
    panel.appendChild(rowWrap);
    return;
  }

  // ── FALLBACK: single-resolution (ambiguous family / cache unavailable) ────────
  const info = getResolutionInfo();
  if (!info) return;

  const vl = computeVoiceLeading(sourceMidi, info.targetMidi);

  const rowWrap = document.createElement('div');
  rowWrap.className = 'breakdown-row';

  const keyEl = document.createElement('span');
  keyEl.className = 'breakdown-key';
  keyEl.textContent = 'Resolves to';
  rowWrap.appendChild(keyEl);

  const valEl = document.createElement('span');
  valEl.className = 'breakdown-val';
  valEl.style.flex = '1';

  const nameEl = document.createElement('div');
  nameEl.style.fontWeight = '600';
  nameEl.style.marginBottom = '0.3rem';
  nameEl.textContent = info.targetName + '  ' + info.label;
  valEl.appendChild(nameEl);

  const tbl = document.createElement('table');
  tbl.className = 'vl-table';
  vl.forEach(v => {
    const tr = document.createElement('tr');
    const tdFrom = document.createElement('td'); tdFrom.textContent = v.fromName + ' →';
    const tdTo   = document.createElement('td'); tdTo.textContent   = v.toName;
    const tdInt  = document.createElement('td'); tdInt.textContent  = v.isCommonTone ? '' : (v.dir + ' ' + v.intervalName);
    const tdRole = document.createElement('td'); tdRole.textContent = v.role;
    tr.appendChild(tdFrom); tr.appendChild(tdTo);
    tr.appendChild(tdInt);  tr.appendChild(tdRole);
    tbl.appendChild(tr);
  });
  valEl.appendChild(tbl);

  rowWrap.appendChild(valEl);
  panel.appendChild(rowWrap);
}

// ─── POINT 37: Resolve → button logic ────────────────────────────────────────

// State: has the resolution been triggered for the current chord?
let resolutionActive = false;
// Resolution root (midi) — stored once at answer time from full chord, never re-derived mid-session
let resolutionRootMidi = null;

// Toggle between chord view and resolution view.
// First call into resolution view: stores the resolution root and plays audio.
// Subsequent toggles: silently swap notation; audio only plays when entering resolution view.
function playResolution() {
  if (!piano) return;

  if (resolutionActive) {
    // ── Currently in resolution view → go back to chord view ──────────────────
    resolutionActive = false;
    updateResolveBtn();
    showNotation();
    return;
  }

  // ── Entering resolution view ──────────────────────────────────────────────
  // Store resolution root once from the full chord (never re-derived)
  if (resolutionRootMidi === null) {
    const info0 = getResolutionInfo();
    if (!info0) return;
    resolutionRootMidi = info0.targetRootMidi;
  }

  resolutionActive = true;
  updateResolveBtn();

  // Play audio: source chord → pause → resolution chord
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const sourceMidi = getSourceMidi().sort((a, b) => a - b);
  const info = getResolutionInfo();
  if (!info) return;

  setPlayingState(true);
  const now = audioCtx.currentTime;
  const srcDuration = 1.5, pause = 0.4;

  sourceMidi.forEach(m => piano.play(midiToSoundFontName(m), now, { duration: srcDuration, gain: 1.4 }));
  const tgtStart = now + srcDuration + pause;
  info.targetMidi.forEach(m => piano.play(midiToSoundFontName(m), tgtStart, { duration: 2.2, gain: 1.4 }));

  const totalMs = (srcDuration + pause + 2.2) * 1000;
  setTimeout(() => setPlayingState(false), totalMs);

  renderResolutionNotation();
}

// Helper: get source midi notes for current chord family
function getSourceMidi() {
  if (currentChord?.family === 'poly')  return [...currentPolyLowerMidi, ...currentPolyUpperMidi];
  if (currentChord?.family === 'ust')   return [...currentMidiNotes];
  if (currentChord?.family === 'slash') return [currentSlashBassMidi, ...currentMidiNotes];
  return [...currentMidiNotes];
}

// Update the Resolve button label to reflect current state
function updateResolveBtn() {
  const btn = document.getElementById('resolveBtn');
  if (btn) btn.textContent = resolutionActive ? '← Chord' : 'Resolve →';
}

// Dispatcher: show whichever view is currently active
function showCurrentView() {
  if (resolutionActive) renderResolutionNotation();
  else showNotation();
}

// Render two chords side by side on a grand staff (source | barline | resolution).
// Fully derived from current state every time — no cached arguments.
// BUG-4 fix: honours chordKeySigMode (Key/C chip) for both staves.
function renderResolutionNotation() {
  if (!resolutionRootMidi) return;

  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter, BarNote } = VF;

  // ── Recompute resolution info from stored root + current voicing ─────────────
  const info = getResolutionInfo();
  if (!info) return;

  // ── Recompute source midi from current state (voicing may have changed) ───────
  const sourceMidi = getSourceMidi().sort((a, b) => a - b);

  // ── BUG-4: Key sig — honour chordKeySigMode ──────────────────────────────────
  const sym = currentChord?.invIndex !== undefined ? currentChord.baseChord.symbol : (currentChord?.symbol || 'maj');
  let srcRootPc;
  if (currentChord?.family === 'poly')  srcRootPc = (currentPolyLowerRootMidi % 12 + 12) % 12;
  else if (currentChord?.family === 'ust') srcRootPc = (currentUSTRootMidi % 12 + 12) % 12;
  else if (currentChord?.family === 'slash') srcRootPc = (currentUpperRootMidi % 12 + 12) % 12;
  else srcRootPc = ((currentChordRootMidi || 0) % 12 + 12) % 12;

  const keySigStr = chordKeySigMode === 'key' ? getChordKeyStr(sym, srcRootPc) : null;
  const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

  // ── Update notation panel header ──────────────────────────────────────────────
  const nameEl = document.getElementById('notationChordName');
  if (nameEl) {
    let srcLabel = '';
    if (currentChord?.family === 'poly') srcLabel = getPolyChordLabel();
    else if (currentChord?.family === 'ust') srcLabel = getUSTLabel().split(' → ')[0];
    else if (currentChord?.family === 'slash') srcLabel = getSlashResolvedName();
    else srcLabel = getChordRootName() + ' ' + (currentChord?.name || '');
    nameEl.textContent = srcLabel + '  →  ' + info.targetName;
  }

  // ── Show Key/C chip row, sync active state ────────────────────────────────────
  const chipRow = document.getElementById('keysigChipRow');
  chipRow.style.display = 'flex';
  document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
  document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');

  // ── Spell helpers ──────────────────────────────────────────────────────────────
  function spellMidiWithKeySig(midi, rootPc, symbol) {
    const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, rootPc), rootPc, symbol);
    if (!keySigStr) return { key: raw, forcedAcc: false };
    const respelled = respellForKeySig(midi, raw, coveredLetters, keySigStr);
    const rawLetter       = raw.split('/')[0];
    const respelledLetter = respelled.split('/')[0];
    const wasDouble   = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
    const isSameLetter = rawLetter[0] === respelledLetter[0];
    const forcedAcc   = wasDouble && isSameLetter && respelled !== raw;
    return { key: respelled, forcedAcc };
  }

  function addAccFiltered(sn, spells) {
    spells.forEach(({ key, forcedAcc }, i) => {
      if (!forcedAcc && keySigStr && isCoveredByKeySig(key, coveredLetters)) return;
      const acc = vexAccidental(key);
      if (acc) sn.addModifier(new VF.Accidental(acc), i);
    });
  }

  // ── Layout ───────────────────────────────────────────────────────────────────
  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  const allMidi = [...sourceMidi, ...info.targetMidi];
  const lowestMidi  = Math.min(...allMidi);
  const highestMidi = Math.max(...allMidi);
  const needsBass   = lowestMidi < 55;
  const needsTreble = highestMidi >= 55;
  const grandStaff  = needsBass && needsTreble;

  const MEASURE_W = 150;
  const HEADER_W  = keySigStr ? 90 : 70;
  const W = HEADER_W + MEASURE_W * 2 + 30;
  let H, trebleY, bassY;
  if (grandStaff)     { H = 240; trebleY = 20; bassY = 120; }
  else if (needsBass) { H = 140; bassY = 30; trebleY = undefined; }
  else                { H = 140; trebleY = 30; bassY = undefined; }

  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  const STAVE_X = 15;
  const STAVE_W = W - 25;

  function splitTrebleBass(midiArr) {
    const sorted = [...midiArr].sort((a, b) => a - b);
    return {
      treble: sorted.filter(m => m >= 55 || (!needsBass && !grandStaff)),
      bass:   sorted.filter(m => m <  55 || (!needsTreble && !grandStaff)),
    };
  }

  function makeChordNote(midiArr, clef, rootPc, symbol, noteType) {
    if (!midiArr.length) {
      const restKey = clef === 'bass' ? 'd/3' : 'b/4';
      return new StaveNote({ keys: [restKey], duration: noteType + 'r', clef });
    }
    const spells = midiArr.map(m => spellMidiWithKeySig(m, rootPc, symbol));
    const keys = spells.map(s => s.key);
    const sn = new StaveNote({ keys, duration: noteType, clef });
    addAccFiltered(sn, spells);
    return sn;
  }

  try {
    let trebleStave, bassStave;
    if (needsTreble || grandStaff) {
      trebleStave = new Stave(STAVE_X, trebleY, STAVE_W);
      trebleStave.addClef('treble');
      if (keySigStr) trebleStave.addKeySignature(keySigStr);
      trebleStave.setContext(ctx).draw();
    }
    if (needsBass || grandStaff) {
      bassStave = new Stave(STAVE_X, bassY, STAVE_W);
      bassStave.addClef('bass');
      if (keySigStr) bassStave.addKeySignature(keySigStr);
      bassStave.setContext(ctx).draw();
    }
    if (grandStaff && trebleStave && bassStave) {
      try {
        new StaveConnector(trebleStave, bassStave).setType('brace').setContext(ctx).draw();
        new StaveConnector(trebleStave, bassStave).setType('singleLeft').setContext(ctx).draw();
      } catch(e) {}
    }

    const tgtRootPc = (resolutionRootMidi % 12 + 12) % 12;
    const srcSplit = splitTrebleBass(sourceMidi);
    const tgtSplit = splitTrebleBass(info.targetMidi);

    function drawClef(clef, stave, srcMidi, tgtMidi) {
      if (!stave) return;
      const srcNote = makeChordNote(srcMidi, clef, srcRootPc, sym, 'h');
      const bar     = new BarNote();
      const tgtNote = makeChordNote(tgtMidi, clef, tgtRootPc, 'maj', 'h');
      const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables([srcNote, bar, tgtNote]);
      new Formatter().joinVoices([voice]).format([voice], STAVE_W - HEADER_W);
      voice.draw(ctx, stave);
    }

    if (grandStaff) {
      drawClef('treble', trebleStave, srcSplit.treble, tgtSplit.treble);
      drawClef('bass',   bassStave,   srcSplit.bass,   tgtSplit.bass);
    } else if (needsBass) {
      drawClef('bass', bassStave, sourceMidi, info.targetMidi);
    } else {
      drawClef('treble', trebleStave, sourceMidi, info.targetMidi);
    }

    // ── Chord name labels above the stave ─────────────────────────────────────
    const svgNS = 'http://www.w3.org/2000/svg';
    const labelY = (trebleY !== undefined ? trebleY : bassY) - 4;

    let srcLabel = '';
    if (currentChord?.family === 'poly') srcLabel = getPolyChordLabel();
    else if (currentChord?.family === 'ust') srcLabel = getUSTLabel().split(' → ')[0];
    else if (currentChord?.family === 'slash') srcLabel = getSlashResolvedName();
    else srcLabel = getChordRootName() + ' ' + (currentChord?.name || '');

    const srcLabelX = STAVE_X + HEADER_W + MEASURE_W * 0.3;
    const srcLabelEl = document.createElementNS(svgNS, 'text');
    srcLabelEl.setAttribute('x', srcLabelX);
    srcLabelEl.setAttribute('y', labelY);
    srcLabelEl.setAttribute('text-anchor', 'middle');
    srcLabelEl.setAttribute('font-size', '11');
    srcLabelEl.setAttribute('fill', '#4a9e8e');
    srcLabelEl.setAttribute('font-family', 'Inter, sans-serif');
    srcLabelEl.setAttribute('font-weight', '600');
    srcLabelEl.textContent = srcLabel.length > 16 ? srcLabel.slice(0, 15) + '…' : srcLabel;
    svg.appendChild(srcLabelEl);

    const tgtLabelX = STAVE_X + HEADER_W + MEASURE_W + MEASURE_W * 0.5;
    const tgtLabelEl = document.createElementNS(svgNS, 'text');
    tgtLabelEl.setAttribute('x', tgtLabelX);
    tgtLabelEl.setAttribute('y', labelY);
    tgtLabelEl.setAttribute('text-anchor', 'middle');
    tgtLabelEl.setAttribute('font-size', '11');
    tgtLabelEl.setAttribute('fill', '#357a6c');
    tgtLabelEl.setAttribute('font-family', 'Inter, sans-serif');
    tgtLabelEl.setAttribute('font-weight', '600');
    tgtLabelEl.textContent = info.targetName;
    svg.appendChild(tgtLabelEl);

  } catch(e) { console.error('VexFlow resolution render error:', e); }

  // ── Show the notation panel ───────────────────────────────────────────────────
  document.getElementById('notationArea').style.display = 'block';
  document.getElementById('notationPanel').style.display = 'block';
}

// Compute a chord name purely from interval logic — no library lookup.
// rootPc: pitch class of the root (0–11).
// allPcs: Set of all pitch classes in the chord (including the root).
// Returns a display string like "Em♭6 (no 5th)" or "Gsus4 (no 5th)".
function nameChordFromIntervals(rootPc, allPcs) {
  // Build interval set from root (semitones 0–11, excluding 0 itself)
  const ivs = new Set(
    [...allPcs]
      .map(pc => ((pc - rootPc) % 12 + 12) % 12)
      .filter(i => i !== 0)
  );

  const has = i => ivs.has(i);

  // ── Identify 3rd ──────────────────────────────────────────────────────────
  const hasM3  = has(4);   // major 3rd
  const hasm3  = has(3);   // minor 3rd
  const hasP4  = has(5);   // perfect 4th (sus4 or 11th)
  const hasM2  = has(2);   // major 2nd (sus2 or 9th)

  // ── Identify 5th ──────────────────────────────────────────────────────────
  const hasP5  = has(7);   // perfect 5th
  const hasd5  = has(6);   // diminished 5th / tritone
  // 8 semitones = A5 in major context (M3 present), m6 in minor context (m3 present)
  const hasA5  = has(8) && has(4);   // augmented 5th — only when major 3rd present
  const hasm6  = has(8) && !has(4);  // minor 6th — only when no major 3rd (minor/sus context)

  // ── Identify 7th ──────────────────────────────────────────────────────────
  const hasM7  = has(11);  // major 7th
  const hasm7  = has(10);  // minor 7th
  const hasd7  = has(9) && has(3) && has(6);  // diminished 7th — only in dim context (m3 + d5 present)

  // ── Identify upper extensions (mod-12 equivalents) ────────────────────────
  // 9th = 2 semitones (same pc as M2), 11th = 5 (same as P4), 13th = 9 (same as M6/d7)
  // We distinguish 9/11/13 from 2/4/6 by presence of a 7th (extensions imply a 7th chord)
  const has7th   = hasM7 || hasm7 || hasd7;
  const hasM6    = has(9) && !has7th;  // major 6th (no 7th → it's a 6th, not 13th)

  // Extensions only meaningful when a 7th is present
  const hasM9    = has(2)  && has7th;  // major 9th
  const hasm9    = has(1)  && has7th;  // minor 9th (♭9)
  const hasA9    = has(3)  && has7th && !hasm3; // augmented 9th (♯9) — only if no m3
  const hasP11   = has(5)  && has7th;  // perfect 11th
  const hasA11   = has(6)  && has7th;  // augmented 11th (♯11)
  const hasM13   = has(9)  && has7th;  // major 13th
  const hasm13   = has(8)  && has7th && has(4);  // minor 13th (♭13) — only in major/dom context

  // ── Determine base quality ────────────────────────────────────────────────
  let quality = '';
  let isSus   = false;
  let isDim   = false;
  let isAug   = false;

  if (hasM3) {
    if (hasA5 && !hasP5) { quality = 'aug'; isAug = true; }
    else                  { quality = ''; }           // major (no suffix)
  } else if (hasm3) {
    if (hasd5 && !hasP5)  { quality = 'dim'; isDim = true; }
    else                   { quality = 'm'; }
  } else if (hasP4 && !hasM2) {
    quality = 'sus4'; isSus = true;
  } else if (hasM2 && !hasP4) {
    quality = 'sus2'; isSus = true;
  } else if (hasP4 && hasM2) {
    quality = 'sus4'; isSus = true;   // both: sus4 takes priority
  } else {
    quality = '5';   // power chord / no 3rd no sus
  }

  // ── Determine 7th suffix ──────────────────────────────────────────────────
  let seventhStr = '';
  if (isDim) {
    if (hasd7)       seventhStr = 'o7';   // fully diminished
    else if (hasm7)  seventhStr = 'm7♭5'; // half-diminished
    // else: plain dim triad — no 7th suffix needed
  } else if (isAug) {
    if (hasM7)       seventhStr = 'Maj7';
    else if (hasm7)  seventhStr = '7';
  } else if (quality === 'm') {
    if (hasM7)       seventhStr = '(Maj7)';
    else if (hasm7)  seventhStr = '7';
    // minor 6th chord — handled below in alterations
  } else if (quality === '') {
    // major
    if (hasM7)       seventhStr = 'Maj7';
    else if (hasm7)  seventhStr = '7';
  } else if (isSus) {
    if (hasm7)       seventhStr = '7';
    else if (hasM7)  seventhStr = 'Maj7';
  }

  // ── Build root name ───────────────────────────────────────────────────────
  // Use a neutral symbol for spelledNote — we pass 'maj' for major context,
  // 'm' for minor, so accidentals spell correctly.
  const spellingCtx = (quality === 'm' || isDim) ? 'm' : 'maj';
  const rootName = spelledNote(0, rootPc, spellingCtx);

  // ── Assemble base name ────────────────────────────────────────────────────
  let name;
  if (isDim) {
    name = rootName + (seventhStr === 'o7' ? 'o7' : seventhStr === 'm7♭5' ? 'm7(♭5)' : 'dim');
  } else if (isAug) {
    name = rootName + 'aug' + (seventhStr ? seventhStr : '');
  } else if (isSus) {
    // Standard notation: root + 7th + 6th + sus — e.g. G6sus4, G7sus4, GMaj7sus2
    const sixStr = (hasM6 && !has7th) ? '6' : '';
    name = rootName + (seventhStr ? seventhStr : '') + sixStr + quality;
  } else if (quality === 'm') {
    name = rootName + 'm' + seventhStr;
  } else if (quality === '') {
    // major
    name = rootName + seventhStr;
  } else {
    name = rootName + quality + seventhStr;
  }

  // ── Collect alterations and extensions ───────────────────────────────────
  const extras = [];

  // 6th / 13th
  if (!isDim && !isAug) {
    if (hasM6 && !has7th && !isSus) extras.push('6');  // sus already has 6 in name
    if (hasm6 && !has7th)  extras.push('♭6');
    if (hasM13 && has7th)  extras.push('13');
    if (hasm13 && has7th)  extras.push('♭13');
  }

  // 9th
  if (hasM9)  extras.push('9');
  if (hasm9)  extras.push('♭9');
  if (hasA9)  extras.push('♯9');

  // 11th
  if (hasP11 && !isSus) extras.push('11');
  if (hasA11)           extras.push('♯11');

  // add9 / sus context: 9th without 7th
  if (has(2) && !has7th && !isSus && (hasM3 || hasm3)) {
    extras.push('add9');
  }

  // ── Omissions ─────────────────────────────────────────────────────────────
  const omissions = [];
  // Suppress "no 5th" for sus chords — omitting the 5th is standard and unremarkable
  if (!hasP5 && !hasd5 && !hasA5 && !isSus && quality !== '5') {
    omissions.push('no 5th');
  }

  // ── Final assembly ────────────────────────────────────────────────────────
  let result = name;
  if (extras.length) result += '(' + extras.join(')(') + ')';
  if (omissions.length) result += ' ' + omissions.join(', ');

  return result;
}

// ─── BUG-6 FIX: Progression breakdown helpers ─────────────────────────────────

const HARMONIC_FUNCTION = {
  0: {
    default: 'Tonic. Home chord — the point of rest and resolution.',
    m:       'Tonic minor. Home chord in a minor key — dark, stable.',
    maj7:    'Tonic major seventh. Stable home with a warm, floating colour.',
    m7:      'Tonic minor seventh. Home chord with added colour — common in jazz.',
    7:       'Dominant seventh on the tonic. Treats I as a dominant — the defining sound of the blues.',
  },
  4: {
    default: 'Mediant. Bridges tonic and subdominant; softens and colours major progressions.',
    m:       'Mediant minor. Tonic substitute — shares two notes with I major; gentle, introspective.',
    m7:      'Mediant minor seventh. Tonic-function colour chord, common in jazz and neo-soul.',
    7:       'Secondary dominant (V7/vi). Dominant seventh on the mediant — pulls to the submediant (vi); ubiquitous in jazz turnarounds and circle-of-fifths sequences.',
  },
  9: {
    default: 'Submediant. Relative minor of the tonic — tonic substitute, often follows V in a deceptive cadence.',
    m:       'Submediant minor. Relative minor of the tonic — pulls toward subdominant or back to tonic.',
    m7:      'Submediant minor seventh. Tonic substitute with jazz colour; common in turnarounds.',
    7:       'Secondary dominant (V7/ii). Dominant seventh on the submediant — pulls strongly to the supertonic (ii), common in jazz turnarounds and circle-of-fifths sequences.',
  },
  5: {
    default: 'Subdominant. Moves away from the tonic, typically toward the dominant.',
    m:       'Subdominant minor. Borrowed from the parallel minor — darker colour than IV major.',
    maj7:    'Subdominant major seventh. Soft pre-dominant colour; common in jazz and pop ballads.',
    7:       'Dominant seventh on IV. Treats IV as a secondary dominant — the defining sound of the blues.',
  },
  2: {
    default: 'Supertonic. Subdominant substitute — pre-dominant function, typically followed by V.',
    m:       'Supertonic minor. Pre-dominant — prepares the dominant in a ii–V–I.',
    m7:      'Supertonic minor seventh. Classic pre-dominant in jazz; the ii chord in ii–V–I.',
    m7b5:    'Half-diminished supertonic. Pre-dominant in minor ii–V–I — tense and unstable.',
    dim:     'Diminished supertonic. Strong pre-dominant pull toward V.',
  },
  10: {
    default: '♭VII major. Borrowed from the Mixolydian or Aeolian mode — ubiquitous in rock, pop, and film music.',
    7:       '♭VII dominant seventh. Backdoor dominant — resolves up by a whole step to I instead of the usual P4.',
  },
  7: {
    default: 'Dominant. Creates tension that resolves to the tonic — the strongest harmonic pull in tonal music.',
    maj:     'Dominant major. Creates tension that resolves to the tonic — the strongest harmonic pull in tonal music.',
    7:       'Dominant seventh. The tritone between 3rd and ♭7th intensifies the pull to tonic — the engine of tonal harmony.',
    m:       'Dominant minor. Modal dominant — used in Dorian, Aeolian, and Mixolydian contexts; avoids the leading tone.',
  },
  11: {
    default: 'Leading tone. Dominant substitute — all tones pull strongly toward the tonic.',
    dim:     'Leading tone diminished triad. Dominant substitute — the upper three notes of a rootless V7.',
    o7:      'Fully diminished seventh. Symmetric dominant substitute; can resolve to tonic, relative major, or any of three enharmonic targets.',
    m7b5:    'Half-diminished seventh on the leading tone. Pre-dominant or dominant substitute in minor keys.',
  },
  1: {
    default: '♭II (Neapolitan). Chromatic substitute for the subdominant — dramatic colour, common in classical and flamenco.',
    7:       'Secondary dominant (V7/IV) or Neapolitan dominant. Tritone sub territory — resolves down a semitone to I or up to IV.',
  },
  3: {
    default: '♭III major. Borrowed from the parallel minor. Bright yet modal — common in rock and pop.',
    7:       'Secondary dominant (V7/♭VI). Dominant seventh on ♭III — pulls to the flattened submediant; common in rock and pop chromatic motion.',
  },
  6: {
    default: '♯IV diminished. Chromatic passing chord — approaches V from below with strong voice-leading.',
    7:       'Secondary dominant (V7/iii) or tritone substitute. Dominant seventh on ♯IV — resolves to the mediant or substitutes for V7.',
  },
  8: {
    default: '♭VI major. Borrowed from the parallel minor — one of the most common borrowed chords in rock and pop.',
    7:       'Secondary dominant (V7/ii) or tritone sub for V7/V. Slides chromatically into V or resolves down to the supertonic.',
  },
};

function progFunctionNote(degSemis, qualSym) {
  const bucket = HARMONIC_FUNCTION[((degSemis % 12) + 12) % 12];
  if (!bucket) return null;
  return bucket[qualSym] || bucket.default || null;
}

// ─── POINT 47: Harmonic field ─────────────────────────────────────────────────

// Map internal chord symbol to display suffix — consistent with app notation.
// Used for both the Roman numeral suffix and the root+quality label in harmonic field pills.
function harmonicFieldSymbolSuffix(sym) {
  const map = {
    'maj':     '',        // uppercase Roman numeral already signals major
    'm':       'm',
    'dim':     '°',
    'aug':     '+',
    '7':       '7',
    'Maj7':    'Maj7',
    'm7':      'm7',
    'mMaj7':   'mMaj7',
    'm7b5':    'm7♭5',
    'o7':      '°7',
    'aug7':    '+7',
    'Maj7s5':  'Maj7♯5',
  };
  return map[sym] ?? null; // null = not a recognised chord symbol (interval fallback)
}

// Map interval pair (third + fifth from degree root) to chord symbol and Roman suffix
function harmonicFieldQuality(third, fifth) {
  if (third === 4 && fifth === 7)  return { sym: 'maj',  suffix: '',  case: 'upper' };
  if (third === 3 && fifth === 7)  return { sym: 'm',    suffix: '',  case: 'lower' };
  if (third === 3 && fifth === 6)  return { sym: 'dim',  suffix: '°', case: 'lower' };
  if (third === 4 && fifth === 8)  return { sym: 'aug',  suffix: '+', case: 'upper' };
  return null;
}

// Map seventh interval (from degree root) to chord symbol suffix
function harmonicFieldSeventh(third, fifth, seventh) {
  if (third === 4 && fifth === 7  && seventh === 11) return 'Maj7';
  if (third === 4 && fifth === 7  && seventh === 10) return '7';
  if (third === 3 && fifth === 7  && seventh === 10) return 'm7';
  if (third === 3 && fifth === 7  && seventh === 11) return 'mMaj7';
  if (third === 3 && fifth === 6  && seventh === 10) return 'm7b5';
  if (third === 3 && fifth === 6  && seventh === 9)  return 'o7';
  if (third === 4 && fifth === 8  && seventh === 10) return 'aug7';
  if (third === 4 && fifth === 8  && seventh === 11) return 'Maj7s5';
  return null;
}

// Build harmonic field for a scale.
// intervals: scale intervals array (includes octave as last entry, e.g. [0,2,4,5,7,9,11,12])
// rootMidi: MIDI note of scale root
// sym: scale symbol (for enharmonic spelling)
// Returns array of { roman, rootName, chordSym } per scale degree (excluding octave)
function buildHarmonicField(intervals, rootMidi, sym) {
  const rootPc = rootMidi % 12;
  // Scale pitch classes (mod 12, no octave duplicate)
  const pcs = intervals.slice(0, -1).map(i => (rootPc + i) % 12);
  const n = pcs.length;
  const result = [];

  for (let d = 0; d < n; d++) {
    const degPc   = pcs[d];
    const degSemi = intervals[d]; // semitones from scale root to this degree

    // Degree root name — spell relative to scale root
    const rootName = spelledNote(degSemi % 12, rootPc, sym);

    // Stack thirds: find next two scale tones that are approximately a 3rd apart
    const pc1 = pcs[(d + 2) % n]; // skip one scale tone
    const pc2 = pcs[(d + 4) % n]; // skip two scale tones

    const third  = ((pc1 - degPc) + 12) % 12;
    const fifth  = ((pc2 - degPc) + 12) % 12;

    // Try to find seventh (one more scale tone)
    let chordSym, roman;

    if (n >= 7) {
      // Enough tones for a seventh chord attempt
      const pc3    = pcs[(d + 6) % n];
      const seventh = ((pc3 - degPc) + 12) % 12;
      const sevSym  = harmonicFieldSeventh(third, fifth, seventh);
      const triQ    = harmonicFieldQuality(third, fifth);

      if (sevSym) {
        chordSym = sevSym;
        // Roman numeral: base on triad quality, add seventh suffix from display map
        const romanBase = triQ
          ? (triQ.case === 'lower'
              ? SEMITONE_TO_ROMAN[degSemi % 12].roman.toLowerCase()
              : SEMITONE_TO_ROMAN[degSemi % 12].roman)
          : SEMITONE_TO_ROMAN[degSemi % 12].roman;
        const prefix      = SEMITONE_TO_ROMAN[degSemi % 12]?.prefix || '';
        const triadSuffix = triQ ? triQ.suffix : '';
        const sevSuffix   = harmonicFieldSymbolSuffix(sevSym) ?? '';
        // Remove triad suffix when seventh suffix already encodes it (e.g. '°7' already implies dim)
        const combinedSuffix = (sevSym === 'o7' || sevSym === 'm7b5') ? sevSuffix : triadSuffix + sevSuffix.replace(/^m/, '').replace(/^°/, '');
        roman = prefix + romanBase + combinedSuffix;
      } else if (triQ) {
        // Seventh didn't match but triad does — show triad
        chordSym = triQ.sym;
        const romanBase = triQ.case === 'lower'
          ? SEMITONE_TO_ROMAN[degSemi % 12].roman.toLowerCase()
          : SEMITONE_TO_ROMAN[degSemi % 12].roman;
        const prefix = SEMITONE_TO_ROMAN[degSemi % 12]?.prefix || '';
        roman = prefix + romanBase + triQ.suffix;
      } else {
        // No clean triad — mark as null so pill renders gracefully
        chordSym = null;
        const entry = SEMITONE_TO_ROMAN[degSemi % 12];
        roman = entry ? entry.prefix + entry.roman : '?';
      }
    } else if (n >= 5) {
      // Pentatonic / hexatonic — try triad first
      const triQ = harmonicFieldQuality(third, fifth);
      if (triQ) {
        chordSym = triQ.sym;
        const romanBase = triQ.case === 'lower'
          ? SEMITONE_TO_ROMAN[degSemi % 12].roman.toLowerCase()
          : SEMITONE_TO_ROMAN[degSemi % 12].roman;
        const prefix = SEMITONE_TO_ROMAN[degSemi % 12]?.prefix || '';
        roman = prefix + romanBase + triQ.suffix;
      } else {
        // No clean triad
        chordSym = null;
        const entry = SEMITONE_TO_ROMAN[degSemi % 12];
        roman = entry ? entry.prefix + entry.roman : '?';
      }
    } else {
      // Very sparse scale — no triad possible
      chordSym = null;
      const entry = SEMITONE_TO_ROMAN[degSemi % 12];
      roman = entry ? entry.prefix + entry.roman : '?';
    }

    result.push({ roman, rootName, chordSym });
  }

  return result;
}

// Render the harmonic field as a collapsible row with pills
function makeHarmonicFieldRow(panel, intervals, rootMidi, sym) {
  const field = buildHarmonicField(intervals, rootMidi, sym);
  if (!field.length) return;

  // Outer breakdown row wrapper
  const rowWrap = document.createElement('div');
  rowWrap.className = 'breakdown-row';
  rowWrap.style.alignItems = 'flex-start';

  const keyEl = document.createElement('span');
  keyEl.className = 'breakdown-key';
  keyEl.style.paddingTop = '0.25rem';
  keyEl.textContent = 'Harmonic field';
  rowWrap.appendChild(keyEl);

  const valEl = document.createElement('span');
  valEl.className = 'breakdown-val';
  valEl.style.flex = '1';

  // Collapsible section — same cs-section pattern as chord scales
  const sec = document.createElement('div');
  sec.className = 'cs-section';

  const hdr = document.createElement('div');
  hdr.className = 'cs-header';
  const hdrText = document.createElement('span');
  hdrText.textContent = field.length + ' degree' + (field.length === 1 ? '' : 's');
  const arrow = document.createElement('span');
  arrow.className = 'cs-arrow';
  arrow.textContent = '▸';
  hdr.appendChild(hdrText);
  hdr.appendChild(arrow);

  const body = document.createElement('div');
  body.className = 'cs-body';

  hdr.addEventListener('click', () => {
    const open = body.classList.toggle('open');
    arrow.textContent = open ? '▾' : '▸';
  });

  // Full quality name for the bottom line of each pill
  const QUALITY_FULL_NAMES = {
    'maj':    'major',
    'm':      'minor',
    'dim':    'diminished',
    'aug':    'augmented',
    '7':      'dominant 7th',
    'Maj7':   'major 7th',
    'm7':     'minor 7th',
    'mMaj7':  'minor major 7th',
    'm7b5':   'half-diminished',
    'o7':     'diminished 7th',
    'aug7':   'augmented 7th',
    'Maj7s5': 'augmented major 7th',
  };

  // Pills row
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'breakdown-pills';
  pillsWrap.style.padding = '0.5rem 0.625rem';

  field.forEach(({ roman, rootName, chordSym }) => {
    const pill = document.createElement('div');
    pill.className = 'breakdown-pill';

    // Line 1: Roman numeral (already includes quality suffix from buildHarmonicField)
    const romanEl = document.createElement('span');
    romanEl.className = 'breakdown-pill-label';
    romanEl.textContent = roman;

    // Line 2: Root name + quality shorthand (e.g. "Dm7", "G7", "B°")
    const displaySuffix = chordSym !== null ? (harmonicFieldSymbolSuffix(chordSym) ?? '') : '';
    const rootEl = document.createElement('span');
    rootEl.className = 'breakdown-pill-value';
    rootEl.textContent = rootName + displaySuffix;

    pill.appendChild(romanEl);
    pill.appendChild(rootEl);

    // Line 3: Full quality name — only when a clean chord was found
    if (chordSym !== null) {
      const fullName = QUALITY_FULL_NAMES[chordSym];
      if (fullName) {
        const nameEl = document.createElement('span');
        nameEl.className = 'breakdown-pill-label';
        nameEl.style.color = 'var(--accent-text)';
        nameEl.style.marginTop = '1px';
        nameEl.textContent = fullName;
        pill.appendChild(nameEl);
      }
    }

    pillsWrap.appendChild(pill);
  });

  body.appendChild(pillsWrap);
  sec.appendChild(hdr);
  sec.appendChild(body);
  valEl.appendChild(sec);
  rowWrap.appendChild(valEl);
  panel.appendChild(rowWrap);
}

function qualityFullName(sym) {
  const map = {
    'maj':   'major',
    'm':     'minor',
    '7':     'dominant 7th',
    'maj7':  'major 7th',
    'm7':    'minor 7th',
    'dim':   'diminished',
    'm7b5':  'half-diminished (ø7)',
    'o7':    'diminished 7th',
    'aug':   'augmented',
    'sus4':  'suspended 4th',
  };
  return map[sym] || sym;
}

function showBreakdown() {
  // POINT 37: ensure voice leading cache is populated for both quiz and dict mode.
  // In quiz mode this is already set by submitChordAnswer(); in dict mode it's null
  // until here. Building it now covers both paths with no duplication.
  if (!currentVoiceLeadingAnalysis && typeof _buildVoiceLeadingAnalysis === 'function') {
    currentVoiceLeadingAnalysis = _buildVoiceLeadingAnalysis();
  }

  const panel = document.getElementById('breakdownPanel');
  panel.innerHTML = '';

  // ── Helper: horizontal rule divider ──────────────────────────────────────────
  function addDivider() {
    const hr = document.createElement('hr');
    hr.className = 'breakdown-divider';
    panel.appendChild(hr);
  }

  // ── INTERVALS ────────────────────────────────────────────────────────────────
  if (currentMode === 'intervals') {
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
    return;
  }

  // ── SCALES ───────────────────────────────────────────────────────────────────
  if (currentMode === 'scales') {
    const rootPc   = currentScaleRootMidi % 12;
    const sym      = currentScale.symbol;
    const rootName = spelledRoot(rootPc);

    // Build note sequences
    const ascMidi  = currentScale.intervals.map(i => currentScaleRootMidi + i);
    const descMidi = [...ascMidi].reverse();
    const seqMidi  =
      currentScaleDir === 'desc' ? descMidi :
      currentScaleDir === 'both' ? [...ascMidi, ...descMidi.slice(1)] :
      ascMidi;

    const { body: scaleBody } = makeNameHeader(panel, rootName + ' ' + (currentScale.displayName || currentScale.name));

    // Notes in direction played
    const noteNames = seqMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, sym));
    makeBDRow(scaleBody, 'Notes', joinSep(noteNames));

    // Degree numerals
    const is7Note = currentScale.intervals.length === 8;
    {
      const degRomans = computeDegreeNumerals(currentScale.intervals, sym);
      makeBDRow(scaleBody, 'Degrees', joinSep(degRomans));
    }

    // From root
    if (currentScaleDir === 'asc') {
      const fr = ascMidi.slice(1).map(m => {
        const semi = m - currentScaleRootMidi;
        return intervalAbbr(semi <= 12 ? semi : semi % 12 || 12, sym);
      });
      makeBDRow(scaleBody, 'From root', joinSep(fr));
    } else if (currentScaleDir === 'desc') {
      const fr = descMidi.slice(1).map(m => {
        const semi = currentScaleRootMidi - m;
        return intervalAbbr(semi <= 12 ? semi : semi % 12 || 12, sym) + '\u2193';
      });
      makeBDRow(scaleBody, 'From root', joinSep(fr));
    } else {
      const frAsc  = ascMidi.slice(1).map(m => {
        const semi = m - currentScaleRootMidi;
        return intervalAbbr(semi <= 12 ? semi : semi % 12 || 12, sym);
      });
      const frDesc = descMidi.slice(1).map(m => {
        const semi = currentScaleRootMidi - m;
        return intervalAbbr(semi <= 12 ? semi : semi % 12 || 12, sym) + '\u2193';
      });
      makeBDRow(scaleBody, 'From root', joinSep([...frAsc, ...frDesc]));
    }

    // Between notes
    const steps = [];
    for (let i = 1; i < seqMidi.length; i++) {
      steps.push(intervalAbbr(Math.abs(seqMidi[i] - seqMidi[i-1])));
    }
    makeBDRow(scaleBody, 'Between notes', joinSep(steps));

    // W/H pattern
    const wh = [];
    let allWH = true;
    for (let i = 1; i < seqMidi.length; i++) {
      const diff = Math.abs(seqMidi[i] - seqMidi[i-1]);
      if      (diff === 2) wh.push('W');
      else if (diff === 1) wh.push('H');
      else if (diff === 3) wh.push('W+H');
      else { allWH = false; break; }
    }
    if (allWH) makeBDRow(scaleBody, 'Steps', joinSep(wh));

    // ── Sub-collapsibles inside scaleBody ─────────────────────────────────────

    // Triad map (closed)
    if (is7Note) {
      const triadMap = computeTriadMap(currentScale.intervals, sym, rootPc);
      if (triadMap) {
        const { section: tmSec, body: tmBody } = makeCSGroup('Triad map', false);
        scaleBody.appendChild(tmSec);
        makeBDRow(tmBody, 'Triad map', joinSep(triadMap));
      }
    }

    // Character (closed)
    const char = SCALE_CHARACTER[sym];
    if (char) {
      const { section: charSec, body: charBody } = makeCSGroup('Character', false);
      scaleBody.appendChild(charSec);
      makeBDRow(charBody, 'Character', char);
    }

    // Parent (closed)
    const modalInfo = SCALE_MODAL_PARENT[sym];
    if (modalInfo) {
      const { section: parSec, body: parBody } = makeCSGroup('Parent', false);
      scaleBody.appendChild(parSec);
      makeBDRow(parBody, 'Parent', ordinal(modalInfo.degree) + ' mode of ' + modalInfo.parent);
    }

    // POINT 47: Harmonic field (closed, inside scaleBody)
    makeHarmonicFieldRow(scaleBody, currentScale.intervals, currentScaleRootMidi, sym);

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── BUG-6 FIX: PROGRESSIONS ───────────────────────────────────────────────
  if (currentMode === 'progressions') {
    if (!currentProgression) return;

    const { body: progBody } = makeNameHeader(panel, currentProgression.symbol + ' — ' + currentProgression.name);

    const rootName = spelledRoot(currentProgRootPc);
    makeBDRow(progBody, 'Key',   rootName + ' major');
    makeBDRow(progBody, 'Style', currentProgression.group);

    currentProgression.degrees.forEach((degSemis, i) => {
      const qualSym = currentProgression.qualities[i];

      const degObj  = PROG_DEGREES.find(d => d.semi === degSemis)   || { label: '?' };
      const qualObj = PROG_QUALITIES.find(q => q.sym === qualSym)   || { label: qualSym };

      const chordRootPc   = (currentProgRootPc + degSemis + 12) % 12;
      const chordRootName = spelledRoot(chordRootPc);

      const chordRootMidi = currentProgRootMidi + degSemis;
      const midiNotes     = progChordMidi(chordRootMidi, qualSym);

      const noteNames = midiNotes.map(m => {
        const semi = ((m % 12) - chordRootPc + 12) % 12;
        return spelledNote(semi, chordRootPc, qualSym);
      });

      // Build cs-section with custom header showing degree + chord name
      const section = document.createElement('div');
      section.className = 'cs-section';
      section.style.margin = '0.35rem 0';

      const chordHdr = document.createElement('div');
      chordHdr.className = 'cs-header';
      chordHdr.style.cursor = 'pointer';

      const degLabel = document.createElement('span');
      degLabel.style.cssText = 'color:var(--accent); margin-right:0.5rem; font-weight:700;';
      degLabel.textContent = degObj.label;

      const nameLabel = document.createElement('span');
      nameLabel.style.flex = '1';
      nameLabel.textContent = chordRootName + ' ' + qualityFullName(qualSym);

      const arrow = document.createElement('span');
      arrow.className = 'cs-arrow';
      arrow.textContent = '▸';

      chordHdr.appendChild(degLabel);
      chordHdr.appendChild(nameLabel);
      chordHdr.appendChild(arrow);

      const chordBody = document.createElement('div');
      chordBody.className = 'cs-body';
      chordBody.style.padding = '0.4rem 0.625rem';

      chordHdr.addEventListener('click', () => {
        const isOpen = chordBody.classList.toggle('open');
        arrow.textContent = isOpen ? '▾' : '▸';
      });

      section.appendChild(chordHdr);
      section.appendChild(chordBody);
      progBody.appendChild(section);

      makeBDRow(chordBody, 'Notes', joinSep(noteNames));

      const allChordTypes = [
        ...CHORD_TYPES.major,    ...CHORD_TYPES.minor,
        ...CHORD_TYPES.dominant, ...CHORD_TYPES.diminished,
        ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended,
      ];
      const ct = allChordTypes.find(c => c.symbol === qualSym);
      if (ct && ct.intervals.length > 1) {
        const fromRoot = ct.intervals.slice(1).map(semi => intervalAbbr(semi, qualSym));
        makeBDRow(chordBody, 'From root', joinSep(fromRoot));
      }

      const fnNote = progFunctionNote(degSemis, qualSym);
      if (fnNote) makeBDRow(chordBody, 'Function', fnNote);

      const chordPcs = new Set(midiNotes.map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(chordBody, chordRootPc, chordPcs);
    });

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── POINT 26: POLYCHORDS ────────────────────────────────────────────────────
  if (currentChord.family === 'poly' && currentPolyUpperRootMidi !== null) {
    const upPc  = currentPolyUpperRootMidi % 12;
    const loPc  = currentPolyLowerRootMidi % 12;
    const upSym = currentChord.upperSymbol;
    const loSym = currentChord.lowerSymbol;
    const upName = spelledRoot(upPc);
    const loName = spelledRoot(loPc);
    const { body: polyBody } = makeNameHeader(panel, upName + polyQualitySuffix(upSym) + ' / ' + loName + polyQualitySuffix(loSym));

    makeBDRow(polyBody, 'Upper chord', upName + ' ' + polyQualityFull(upSym));
    makeBDRow(polyBody, 'Lower chord', loName + ' ' + polyQualityFull(loSym));

    if (upSym === 'aug') {
      makeBDRow(polyBody, 'Note', upName + 'aug is symmetrical — 3 enharmonic roots share the same notes');
    }
    if (loSym === 'aug') {
      makeBDRow(polyBody, 'Note', loName + 'aug is symmetrical — 3 enharmonic roots share the same notes');
    }
    if (upSym === '7') {
      makeBDRow(polyBody, 'Note', upName + '7 upper adds strong harmonic tension — the tritone in the upper chord clashes with the lower');
    }

    const upNoteNames = currentPolyUpperMidi.map(m => spelledNote(pcInterval(m % 12, upPc), upPc, upSym));
    makeBDRow(polyBody, 'Upper notes', joinSep(upNoteNames));

    const loNoteNames = currentPolyLowerMidi.map(m => spelledNote(pcInterval(m % 12, loPc), loPc, loSym));
    makeBDRow(polyBody, 'Lower notes', joinSep(loNoteNames));

    const allNames = [...currentPolyLowerMidi, ...currentPolyUpperMidi]
      .sort((a,b) => a-b).map(m => spelledNote(pcInterval(m % 12, upPc), upPc, upSym));
    makeBDRow(polyBody, 'Full voicing', joinSep(allNames));

    const sep = currentChord.lowerOffset;
    const sepAbbr = INTERVAL_ABBR[sep] || sep + 'st';
    makeBDRow(polyBody, 'Root interval', loName + ' is ' + sepAbbr + ' below ' + upName);

    makeBDRow(polyBody, 'What is it?',
      'A polychord stacks two independent triads. The slash separates upper from lower — ' +
      'unlike a slash chord, both triads are structurally equal and create rich polytonal colour.');
    const allPcs = new Set([...currentPolyLowerMidi, ...currentPolyUpperMidi].map(m => ((m - currentPolyLowerRootMidi) % 12 + 12) % 12));
    const numerals = [...allPcs].filter(s => s !== 0).sort((a,b)=>a-b)
      .map(s => semitonesToNumeral(s, loSym));
    if (numerals.length) makeBDRow(polyBody, 'Tensions over lower root', joinSep(numerals));

    // Chord scales sub-collapsible
    {
      const allMidiPcs = new Set([...currentPolyLowerMidi, ...currentPolyUpperMidi].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(polyBody, loPc, allMidiPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      polyBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── POINT 26 / 35: UST ──────────────────────────────────────────────────────
  if (currentChord.family === 'ust' && currentUSTRootMidi !== null) {
    const shellQ   = currentChord.shellQuality || 'dom7'; // 'dom7' | 'min' | 'maj7'
    const rootPc   = currentUSTRootMidi % 12;
    // Spell root name appropriately for the shell type
    const rootSpellSym = shellQ === 'min' ? 'min' : shellQ === 'maj7' ? 'maj' : '7';
    const rootName = spelledNote(0, rootPc, rootSpellSym);
    const shellSuffix = shellQ === 'min' ? 'm7' : shellQ === 'maj7' ? 'Maj7' : '7';
    const upperTriadRootMidi = currentUSTRootMidi + currentChord.upperTriadRoot;
    const upperRootPc = upperTriadRootMidi % 12;
    const upperRootName = spelledNote(pcInterval(upperRootPc, rootPc), rootPc, currentChord.upperQuality);
    const upQ = currentChord.upperQuality === 'min' ? 'm' : '';

    const { body: ustBody } = makeNameHeader(panel, 'UST ' + currentChord.ustNumber + ': ' + upperRootName + upQ + ' over ' + rootName + shellSuffix);

    makeBDRow(ustBody, 'Resulting chord', rootName + currentChord.resultingChord);
    makeBDRow(ustBody, 'Tensions', currentChord.tensions);
    makeBDRow(ustBody, 'UST number', 'UST ' + currentChord.ustNumber + ' — ' + upperRootName + upQ + ' triad');

    const shellLabel = shellQ === 'min'  ? 'Shell (♭3 + ♭7)'
                     : shellQ === 'maj7' ? 'Shell (3 + 7)'
                     : 'Shell (3 + ♭7)';
    const shellNames = currentUSTShellMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, rootSpellSym));
    makeBDRow(ustBody, shellLabel, joinSep(shellNames));

    const upperNames = currentUSTUpperMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, currentChord.upperQuality));
    makeBDRow(ustBody, 'Upper triad', joinSep(upperNames));

    const allSorted = [...currentUSTShellMidi, ...currentUSTUpperMidi].sort((a,b)=>a-b);
    const allNames  = allSorted.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, rootSpellSym));
    makeBDRow(ustBody, 'Full voicing', joinSep(allNames));

    const fromRootNums = allSorted
      .map(m => ((m - currentUSTRootMidi) % 12 + 12) % 12)
      .filter((s,i,arr) => arr.indexOf(s) === i && s !== 0)
      .sort((a,b) => a-b)
      .map(s => semitonesToNumeral(s, rootSpellSym));
    if (fromRootNums.length) makeBDRow(ustBody, 'Numerals from root', joinSep(fromRootNums));

    if (shellQ === 'dom7') {
      const ttSubName = spelledNote(6, rootPc, '7');
      makeBDRow(ustBody, 'Tritone sub', ttSubName + '7 (a TT away — shares 3rd and ♭7)');
      makeBDRow(ustBody, 'What is it?',
        'A UST is a rootless jazz voicing: the chord\'s guide tones (3rd + ♭7) sit in the left hand; ' +
        'an upper-structure triad in the right hand adds colour tones. The root is implied, not played.');
    } else if (shellQ === 'min') {
      makeBDRow(ustBody, 'What is it?',
        'A minor-shell UST: the chord\'s guide tones (♭3 + ♭7) anchor a minor 7th quality in the left hand; ' +
        'the upper triad adds extensions. The root is implied. Common in Dorian and Aeolian contexts.');
    } else {
      makeBDRow(ustBody, 'What is it?',
        'A Maj7-shell UST: the chord\'s guide tones (3 + 7) define a major 7th quality in the left hand; ' +
        'the upper triad adds lush extensions. Common in Ionian and Lydian contexts. The root is implied, not played.');
    }

    // Chord scales sub-collapsible
    {
      const allUstPcs = new Set([...currentUSTShellMidi, ...currentUSTUpperMidi].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(ustBody, rootPc, allUstPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      ustBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── POINT 25: SLASH CHORDS ──────────────────────────────────────────────────
  if (currentChord.family === 'slash' && currentSlashBassMidi !== null) {
    const upperPc  = currentUpperRootMidi % 12;
    const bassPc   = currentSlashBassMidi % 12;
    const sym      = currentChord.symbol;
    const upperName = spelledNote(0, upperPc, sym);
    const bassName  = spelledNote(pcInterval(bassPc, upperPc), upperPc, sym);
    // Quality label
    const qualLabel = currentChord.upperQuality === 'min' ? 'm' : '';

    const { body: slashBody } = makeNameHeader(panel, upperName + qualLabel + ' / ' + bassName);

    makeBDRow(slashBody, 'Upper chord', upperName + (currentChord.upperQuality === 'min' ? ' minor' : ' major'));
    makeBDRow(slashBody, 'Bass note',   bassName);

    const upperNoteNames = currentMidiNotes.map(m => spelledNote(pcInterval(m % 12, upperPc), upperPc, sym));
    makeBDRow(slashBody, 'Upper notes', joinSep(upperNoteNames));

    const allMidi = [currentSlashBassMidi, ...currentMidiNotes].sort((a,b)=>a-b);
    const allNames = allMidi.map(m => spelledNote(pcInterval(m % 12, upperPc), upperPc, sym));
    makeBDRow(slashBody, 'Full voicing', joinSep(allNames));

    const bassInt = currentUpperRootMidi - currentSlashBassMidi;
    makeBDRow(slashBody, 'Bass interval', intervalAbbr(((bassInt % 12) + 12) % 12) + ' below upper root');

    if (currentChord.alsoKnownAs) {
      makeBDRow(slashBody, 'Also known as', bassName + ' ' + currentChord.alsoKnownAs);
    }
    makeBDRow(slashBody, 'Type', currentChord.name);
    makeBDRow(slashBody, 'Note', 'Slash chords separate an upper triad from an independent bass note, creating richer harmonic colour');

    // Chord scales sub-collapsible
    {
      const allPcs = new Set([currentSlashBassMidi, ...currentMidiNotes].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(slashBody, upperPc, allPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      slashBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── CHORDS ───────────────────────────────────────────────────────────────────
  const baseChord = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  // Use dictInversionIndex as the active inversion — updated by chip clicks in both
  // quiz (post-answer) and dict mode. Falls back to currentChord.invIndex for
  // quiz questions that were originally generated as inversions.
  const invIndex  = dictInversionIndex;
  const sym       = baseChord.symbol;
  const family    = baseChord.family;

  // Derive root pitch class always from currentChordRootMidi
  const rootPc = ((currentChordRootMidi % 12) + 12) % 12;
  const rootName = spelledNote(0, rootPc, sym);

  // ── Level 1: collapsible name header ─────────────────────────────────────
  const noteCount = baseChord.intervals.length;
  const fb = figuredBass(invIndex, noteCount);
  const invLabel = invIndex > 0 && noteCount > 4
    ? ' \u2014 ' + ['','1st inv','2nd inv','3rd inv','4th inv'][invIndex]
    : '';

  const hdrLabelEl = document.createElement('span');
  hdrLabelEl.textContent = rootName + '\u00a0' + baseChord.name + invLabel;
  if (fb) {
    const sup = document.createElement('span');
    sup.className = 'breakdown-figured';
    sup.textContent = fb;
    hdrLabelEl.appendChild(sup);
  }
  const { body: mainBody } = makeNameHeader(panel, hdrLabelEl);

  // POINT 23: Voicing mode label (only shown when not Full)
  if (currentVoicingMode && currentVoicingMode !== 'full') {
    const voicingLabels = { real:'Real (no P5)', shell:'Shell (R+3+7)', guide:'Guide tones (3+7)' };
    const vLabel = voicingLabels[currentVoicingMode] || currentVoicingMode;
    makeBDRow(mainBody, 'Voicing', vLabel);
  }

  // Notes as voiced, bass first
  const voicedMidi = [...currentMidiNotes].sort((a, b) => a - b);
  const noteNames  = voicedMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, sym));
  makeBDRow(mainBody, 'Notes', joinSep(noteNames));

  // From root (interval abbreviations)
  const rootMidi = currentChordRootMidi;
  const fromRootSemis = voicedMidi
    .map(m => ((m - rootMidi) % 12 + 12) % 12)
    .filter(s => s !== 0);
  if (fromRootSemis.length) {
    makeBDRow(mainBody, 'From root', joinSep(fromRootSemis.map(s => intervalAbbr(s, sym))));
  }

  // Interval numerals
  const fromRootNumerals = fromRootSemis.map(s => semitonesToNumeral(s, sym));
  if (fromRootNumerals.length) {
    makeBDRow(mainBody, 'Numerals', joinSep(fromRootNumerals));
  }

  // Between notes
  const between = [];
  for (let i = 1; i < voicedMidi.length; i++) {
    between.push(intervalAbbr(voicedMidi[i] - voicedMidi[i-1]));
  }
  if (between.length) makeBDRow(mainBody, 'Between notes', joinSep(between));

  // Inversion: slash notation + bass re-analysis
  if (invIndex > 0) {
    const sorted = [...currentMidiNotes].sort((a, b) => a - b);
    const bassMidi = sorted[0];
    const bassPc   = ((bassMidi % 12) + 12) % 12;
    const bassName = spelledNote(pcInterval(bassPc, rootPc), rootPc, sym);
    makeBDRow(mainBody, 'Slash', rootName + '\u00a0' + baseChord.name + '\u00a0/\u00a0' + bassName);
    const allPcs = new Set(sorted.map(m => ((m % 12) + 12) % 12));
    const reName = nameChordFromIntervals(bassPc, allPcs);
    makeBDRow(mainBody, 'From ' + bassName, reName);
  }

  // ── Level 2: family sub-collapsibles inside mainBody ─────────────────────

  // Neo-tonal (maj/min triads only)
  const isMajorTriad = sym === 'maj';
  const isMinorTriad = sym === 'm';
  if (isMajorTriad || isMinorTriad) {
    const quality   = isMajorTriad ? 'major' : 'minor';
    const relations = computeRiemannRelations(rootPc, quality, sym);
    const { section: ntSec, body: ntBody } = makeCSGroup('Neo-tonal', false);
    mainBody.appendChild(ntSec);
    makeRiemannRow(ntBody, relations);
  }

  // Dominant
  if (family === 'dominant' && (sym === '7' || sym === '7_9' || sym === '7_b9' || sym === '7_s9' || sym === '7_13' || sym === '7_9_13')) {
    const { subName, iiName, resMaj, resMin } = computeTritoneSubInfo(rootPc, sym);
    const { section: domSec, body: domBody } = makeCSGroup('Dominant', false);
    mainBody.appendChild(domSec);
    makeBDRow(domBody, 'Tritone sub', subName);
    makeBDRow(domBody, 'Related ii', iiName);
    makeBDRow(domBody, 'Resolves to', resMaj + ' or ' + resMin);
  }

  // Diminished
  if (sym === 'o7') {
    const { section: dimSec, body: dimBody } = makeCSGroup('Diminished', false);
    mainBody.appendChild(dimSec);
    makeBDRow(dimBody, 'Enharmonic', joinSep(computeDimEnharmonics(rootPc, sym)));
    makeBDRow(dimBody, 'Dom7♭9 subs', joinSep(computeDimDomSubs(rootPc, sym)));
  }
  if (sym === 'm7b5') {
    const { minKeyName, v7Name } = computeHalfDimContext(rootPc, sym);
    const { section: hdSec, body: hdBody } = makeCSGroup('Half-dim', false);
    mainBody.appendChild(hdSec);
    makeBDRow(hdBody, 'Function', 'ii\u00f8 in ' + minKeyName + ' minor');
    makeBDRow(hdBody, 'Related V7', v7Name);
  }
  if (sym === 'dim') {
    const { section: dSec, body: dBody } = makeCSGroup('Diminished', false);
    mainBody.appendChild(dSec);
    makeBDRow(dBody, 'Note', 'Diminished triad — often functions as rootless dom7♭9');
  }

  // Augmented
  if (sym === 'aug') {
    const { section: augSec, body: augBody } = makeCSGroup('Augmented', false);
    mainBody.appendChild(augSec);
    makeBDRow(augBody, 'Enharmonic', joinSep(computeAugEnharmonics(rootPc, sym)));
    makeBDRow(augBody, 'Note', 'Symmetrical — divides the octave into three equal M3rds');
  }

  // Suspended / Power
  if (sym === 'sus2' || sym === 'sus4') {
    const { section: susSec, body: susBody } = makeCSGroup('Suspended', false);
    mainBody.appendChild(susSec);
    const res = computeSusResolution(rootPc, sym, sym);
    if (res) makeBDRow(susBody, 'Resolution', res);
    makeBDRow(susBody, 'Note', 'No 3rd — quality (major/minor) is ambiguous until resolved');
  }
  if (sym === 'power') {
    const { section: pwrSec, body: pwrBody } = makeCSGroup('Power', false);
    mainBody.appendChild(pwrSec);
    makeBDRow(pwrBody, 'Note', 'No 3rd or 7th — harmonically open; major or minor context depends on melody');
  }

  // Chord scales
  {
    const allPcs = new Set(currentMidiNotes.map(m => ((m % 12) + 12) % 12));
    makeChordScalesRow(mainBody, rootPc, allPcs);
  }

  // Voice leading
  {
    const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
    mainBody.appendChild(vlSec);
    makeVoiceLeadingRow(vlBody);
  }

  panel.style.display = 'block';
  document.getElementById('breakdownWrapper').style.display = 'block';
}

function hideBreakdown() {
  const panel = document.getElementById('breakdownPanel');
  panel.style.display = 'none';
  panel.innerHTML = '';
  document.getElementById('breakdownWrapper').style.display = 'none';
}
