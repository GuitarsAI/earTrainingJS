// ─── breakdown-scales.js ──────────────────────────────────────────────────────
// Scales branch of the breakdown panel.
// Depends on shared helpers/globals defined in breakdown.js:
//   makeNameHeader, makeBDRow, makeCSGroup, joinSep, intervalAbbr,
//   semitoneToDegree, SEMITONE_TO_ROMAN, spelledRoot, spelledNote, pcInterval,
//   ordinal, TRITONE_AS_D5, EIGHT_AS_A5, NINE_AS_D7,
//   currentMode, currentScale, currentScaleRootMidi, currentScaleDir
// Called from showBreakdown() in breakdown.js.
// ─────────────────────────────────────────────────────────────────────────────

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
  // POINT 45 — new pentatonics
  pent_dom:      'Bright, dominant-flavoured — major 3rd and ♭7 give it a funky, bluesy confidence; favoured by John McLaughlin',
  pent_sus:      'Open, floating — built on a sus4 chord with no 3rd; ancient Egyptian/Chinese character, works over major or minor',
  pent_hirajoshi:'Melancholic, contemplative — traditional koto tuning; minor 3rd and ♭6 create a wistful Japanese character',
  pent_iwato:    'Ominous, ceremonial — the darkest Japanese pentatonic; Locrian-like tension from ♭2 and ♭5, no resolution',
  pent_insen:    'Mysterious, somber — koto scale with a half-step above the root; deep and introspective Japanese colour',
  pent_yo:       'Bright, folk-like — traditional Japanese major pentatonic with no semitones; festive and accessible to Western ears',
  // POINT 45 — new hexatonics
  blues_maj:     'Warm, gospel-inflected — major pentatonic with a chromatic ♭3 passing tone; brighter and more resolved than minor blues',
  prometheus_liszt: 'Dense, chromatic — Liszt\'s variant of the Prometheus/mystic sound; darker and more dissonant than Scriabin\'s version',
  tritone_hex:   'Symmetrical, bitonal — two major triads a tritone apart; angular and unstable, used in jazz for dominant substitution',
  messiaen_5:    'Sparse, otherworldly — only 6 transpositions; Messiaen\'s most severe mode, stark and ritualistic',
  // POINT 45 — new diatonics
  harm_major:    'Lush, bittersweet — major scale with a ♭6; combines major brightness with a haunting chromatic pull, common in jazz',
  neap_minor:    'Dramatic, Romantic — Neapolitan minor with ♭2 and raised 7th; operatic tension, rich in leading-tone drive',
  dbl_harmonic:  'Intense, exotic — two augmented 2nds create a striking Middle Eastern/Byzantine colour; also called Arabic or Hijaz Kar',
  spanish:       'Passionate, Flamenco — Phrygian Dominant family with raised 7th; the sound of cante jondo and classical guitar',
  hung_minor:    'Dramatic, Gypsy — harmonic minor with ♯4; two augmented 2nds give it a fiery Eastern European intensity',
  romanian_minor:'Exotic, Eastern — Dorian with ♯4 (tritone); used in Jewish, Greek, and Romanian folk music; also called Ukrainian Dorian or Mi Shebeirach',
  dorian_s4:     'Mysterious, fusion — Dorian with a ♯4 tritone substitution; adds Lydian brightness to a minor context',
  phrygian_n6:   'Dark with a lift — Phrygian\'s ♭2 tension softened by a natural 6th; second mode of melodic minor, also called Dorian ♭2',
  messiaen_6:    'Shimmering, colouristic — Messiaen\'s mode 6, a whole-tone scale with added chromatic neighbour tones; luminous and ambiguous',
  // POINT 45 — new octatonics
  messiaen_3:    'Joyful, exuberant — Messiaen\'s most colourful mode; 9 notes, 4 transpositions; evokes birdsong and natural vitality',
  messiaen_4:    'Dense, angular — 8 notes, 6 transpositions; Messiaen\'s most chromatic mode; unsettled and mysterious',
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

function showBreakdownScales(panel) {
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
}
