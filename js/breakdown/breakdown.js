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

// Figured bass superscripts for triads and 7th chords

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
// ─── Mobile layout helper ────────────────────────────────────────────────────
function isMobile() { return window.innerWidth <= 600; }

function makeChordScalesRow(panel, rootPc, chordPcs) {
  const matches = getChordScales(rootPc, new Set([...chordPcs].map(p => ((p % 12) + 12) % 12)));
  if (!matches.length) return;

  const countLabel = matches.length + ' scale' + (matches.length === 1 ? '' : 's') + ' fit';

  function buildScaleRows(body, mobile) {
    matches.forEach(sc => {
      const row = document.createElement('div');
      row.className = mobile ? 'cs-row cs-row-link cs-row-mobile' : 'cs-row cs-row-link';
      row.title = 'Open in Dictionary';
      row.addEventListener('click', () => {
        if (currentMode !== 'scales') {
          switchMode('scales', sc.symbol);
        } else {
          dictSymbol = sc.symbol;
          setAppMode('dict');
        }
      });
      const nameEl = document.createElement('span');
      nameEl.className = 'cs-name';
      nameEl.textContent = sc.name;
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
  }

  if (isMobile()) {
    const wrap = document.createElement('div');
    wrap.className = 'cs-mobile-wrap';
    const sec = document.createElement('div');
    sec.className = 'cs-section';
    const hdr = document.createElement('div');
    hdr.className = 'cs-header';
    const hdrLabel = document.createElement('span');
    hdrLabel.style.cssText = 'font-size:0.7rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-right:0.4rem;';
    hdrLabel.textContent = 'Chord Scales';
    const hdrCount = document.createElement('span');
    hdrCount.style.cssText = 'flex:1;font-size:0.75rem;color:var(--text-faint);';
    hdrCount.textContent = '— ' + countLabel;
    const arrow = document.createElement('span');
    arrow.className = 'cs-arrow';
    arrow.textContent = '▸';
    hdr.appendChild(hdrLabel);
    hdr.appendChild(hdrCount);
    hdr.appendChild(arrow);
    const body = document.createElement('div');
    body.className = 'cs-body';
    hdr.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      arrow.textContent = open ? '▾' : '▸';
    });
    buildScaleRows(body, true);
    sec.appendChild(hdr);
    sec.appendChild(body);
    wrap.appendChild(sec);
    panel.appendChild(wrap);
  } else {
    const rowWrap = document.createElement('div');
    rowWrap.className = 'breakdown-row';
    const keyEl = document.createElement('span');
    keyEl.className = 'breakdown-key';
    keyEl.textContent = 'Chord scales';
    rowWrap.appendChild(keyEl);
    const valEl = document.createElement('span');
    valEl.className = 'breakdown-val';
    valEl.style.flex = '1';
    const sec = document.createElement('div');
    sec.className = 'cs-section';
    const hdr = document.createElement('div');
    hdr.className = 'cs-header';
    const hdrText = document.createElement('span');
    hdrText.textContent = countLabel;
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
    buildScaleRows(body, false);
    sec.appendChild(hdr);
    sec.appendChild(body);
    valEl.appendChild(sec);
    rowWrap.appendChild(valEl);
    panel.appendChild(rowWrap);
  }
}

// ─── POINT 37: Voice leading resolution ──────────────────────────────────────

// Resolution target table.
// Each entry: { offset: semitones from chord root to resolution root, quality: 'maj'|'min'|'dom7'|'maj7'|'m7' }
// offset is measured upward (mod 12).
// For chord types not listed, the nearest sensible resolution is used.
// NOTE: PROGRESSIONS, PROG_DEGREES, PROG_QUALITIES, PROG_GROUPS, PROG_GROUP_COLLAPSED,
// selectedProgressions, and progression state vars all live in js/data/progressions.js

// RESOLUTION_TARGETS — fallback table used before analyseChord() (voiceLeading.js) is wired.
// Each entry: { offset: semitones UP from chord root to resolution root, quality, label }
//
// Theory notes:
//   Dominant chords (7, 9, 13, alt…) → resolve UP a P4 (= down a P5) to tonic (I).
//     G7 → C  : offset 5  ✓
//   Diminished triad / dim7 → leading-tone resolution: root rises m2 to tonic.
//     Bdim → C : offset 1  ✓  (B is the leading tone of C)
//   Half-dim (m7♭5) → ii∅ of minor: resolves to V7 of that minor key (P4 up).
//     Bm7♭5 → E7 : offset 5 → dom7  ✓
//   Minor 7th chords → function as ii7; strongest motion is to V7 (P4 up = ii→V).
//     Dm7 → G7 : offset 5 → dom7  ✓
//   Minor major 7th → tonic chord of harmonic/melodic minor; stable, departs to iv or bVII.
//     CmMaj7 → Fm : offset 5 → min  ✓
//   Major triads → stable tonic; most common next move is to IV (subdominant departure).
//     C → F : offset 5  (departure, not resolution — but this is the legacy fallback)
//   Minor triads → stable; common motion is to iv or to bVII (no single universal answer).
//     Cm → Fm : offset 5 → min  (subdominant departure)
//   Augmented (V+, V7+) → function as dominant; resolve P4 up to I.
//     Gaug → C : offset 5  ✓
//   Sus chords → resolve by dropping the 4th or 2nd to the 3rd — same root.
//     Gsus4 → G : offset 0  ✓
//   Maj7, maj9, maj11, maj13 → tonic or subdominant; depart to IV.
//     CΔ7 → FΔ7 : offset 5  (departure)

const RESOLUTION_TARGETS = {
  // ── Major triads — tonic; depart to subdominant ───────────────────────────────
  'maj':        { offset: 5,  quality: 'maj',  label: '→ IV' },
  'maj6':       { offset: 5,  quality: 'maj',  label: '→ IV' },
  'maj6_9':     { offset: 5,  quality: 'maj',  label: '→ IV' },
  'add9':       { offset: 5,  quality: 'maj',  label: '→ IV' },
  '6':          { offset: 5,  quality: 'maj',  label: '→ IV' },

  // ── Major 7th / extensions — tonic; depart to IVΔ7 ──────────────────────────
  'maj7':       { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9':     { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9_s11': { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj9':       { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj11':      { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj13':      { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },

  // ── Minor triads — subdominant departure ─────────────────────────────────────
  'm':          { offset: 5,  quality: 'min',  label: '→ iv' },
  'madd9':      { offset: 5,  quality: 'min',  label: '→ iv' },

  // ── Minor 7th / extensions — ii7 function → V7 (P4 up) ──────────────────────
  'm7':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_9':       { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_11':      { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm6':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm9':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm11':        { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm13':        { offset: 5,  quality: 'dom7', label: '→ V7' },

  // ── Minor major 7th — tonic of harmonic/melodic minor; departs to iv ─────────
  'mMaj7':      { offset: 5,  quality: 'min',  label: '→ iv' },

  // ── Dominant 7th and all extensions — resolve UP P4 to I (authentic cadence) ─
  '7':          { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9':        { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_b9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_s9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_13':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9_13':     { offset: 5,  quality: 'maj',  label: '→ I' },
  '7sus4':      { offset: 5,  quality: 'maj',  label: '→ I' },
  '9':          { offset: 5,  quality: 'maj',  label: '→ I' },
  'b9':         { offset: 5,  quality: 'maj',  label: '→ I' },
  's9':         { offset: 5,  quality: 'maj',  label: '→ I' },
  '13':         { offset: 5,  quality: 'maj',  label: '→ I' },

  // ── Augmented — dominant function; resolve UP P4 to I ────────────────────────
  'aug':        { offset: 5,  quality: 'maj',  label: '→ I' },
  'augMaj7':    { offset: 5,  quality: 'maj',  label: '→ I' },
  'aug7':       { offset: 5,  quality: 'maj',  label: '→ I' },
  'aug9':       { offset: 5,  quality: 'maj',  label: '→ I' },

  // ── Diminished triad — leading-tone chord; root rises m2 to tonic ────────────
  'dim':        { offset: 1,  quality: 'maj',  label: '→ I (m2↑)' },

  // ── Diminished 7th — leading-tone chord; root rises m2 to tonic ──────────────
  // (each of the four enharmonic roots implies a different V7♭9, but the
  //  primary resolution from the notated root is m2 up to the implied tonic)
  'o7':         { offset: 1,  quality: 'maj',  label: '→ I (m2↑)' },

  // ── Half-diminished (m7♭5) — ii∅ of minor; resolves to V7 (P4 up) ────────────
  'm7b5':       { offset: 5,  quality: 'dom7', label: '→ V7' },

  // ── Suspended — resolve to same root major (4th drops to 3rd, or 2nd rises) ──
  'sus4':       { offset: 0,  quality: 'maj',  label: '→ I (sus resolves)' },
  'sus2':       { offset: 0,  quality: 'maj',  label: '→ I (sus resolves)' },

  // ── Power chord — no 3rd, no resolution implied; nearest move is I ────────────
  'power':      { offset: 0,  quality: 'maj',  label: '→ I' },
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

  // ── User-selected resolution override (from Voice Leading breakdown panel) ───
  // Only applies to normal chords — poly/ust/slash use their own fixed logic below.
  if (selectedResolution && currentChord?.family !== 'poly' &&
      currentChord?.family !== 'ust' && currentChord?.family !== 'slash') {
    const qualMap = { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7', dim: 'dim', aug: 'aug' };
    const targetQuality = qualMap[selectedResolution.targetQuality] || selectedResolution.targetQuality;
    const srcMidi = currentChordRootMidi || 60;
    let targetRootMidi = (Math.floor(srcMidi / 12) * 12) + selectedResolution.targetRootPc;
    if (targetRootMidi < srcMidi - 6) targetRootMidi += 12;
    if (targetRootMidi > srcMidi + 6) targetRootMidi -= 12;
    const targetMidi = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: selectedResolution.label || '→' };
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

      // Use first true resolution; fall back to first departure for tonic chords.
      const primaryRes = (primaryCtx.resolutions && primaryCtx.resolutions.length)
        ? primaryCtx.resolutions[0]
        : (primaryCtx.departures && primaryCtx.departures.length)
          ? primaryCtx.departures[0]
          : null;

      if (primaryRes) {
        const qualMap = { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7' };
        const targetQuality  = qualMap[primaryRes.targetQuality] || 'maj';
        const srcMidi        = currentChordRootMidi || 60;
        const targetRootPc   = primaryRes.targetRootPc;
        let targetRootMidi   = (Math.floor(srcMidi / 12) * 12) + targetRootPc;
        if (targetRootMidi < srcMidi - 6) targetRootMidi += 12;
        if (targetRootMidi > srcMidi + 6) targetRootMidi -= 12;
        // Use pre-computed voice leading moves (minimal motion, correct register)
        // rather than buildResolutionMidi which blindly stacks intervals from the root.
        const targetMidi = (primaryRes.voiceLeading && primaryRes.voiceLeading.length)
          ? primaryRes.voiceLeading.map(m => m.toMidi)
          : buildResolutionMidi(targetRootMidi, targetQuality);
        const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
        const label          = primaryRes.cadenceName || primaryRes.resolutionType || '→';
        const targetSymbol   = primaryRes.targetSymbol || null;
        return { targetRootMidi, targetMidi, targetName, targetQuality, targetSymbol, label };
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
    // Pass targetSymbol (e.g. 'Maj7', 'm7', '7') — computeVoiceLeadingRules() looks
    // this up in CHORD_SYMBOL_INTERVALS. Falls back to 'Maj7' if not present (e.g.
    // legacy RESOLUTION_TARGETS path where targetSymbol is not set).
    const targetSymbol = info.targetSymbol || 'Maj7';

    const moves   = computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, ctx);
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
      authentic:        'Authentic cadence',
      authentic_minor:  'Authentic cadence (minor)',
      deceptive:        'Deceptive cadence',
      plagal:           'Plagal cadence',
      to_dominant:      'Move to dominant',
      half_cadence:     'Half cadence',
      leading_tone:     'Leading-tone resolution',
      direct:           'Direct resolution',
      departure:        'Departure',
      tritone_sub:      'Tritone substitution',
      related_ii:       'Related ii7',
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

    if (isMobile()) {
      // ── Mobile: full-width — plain label above, contexts stack below ──────────
      const mobileWrap = document.createElement('div');
      mobileWrap.className = 'cs-mobile-wrap';
      const resLabel = document.createElement('span');
      resLabel.className = 'vl-resolves-label-mobile';
      resLabel.textContent = 'Resolves to';
      mobileWrap.appendChild(resLabel);
      cache.contexts.forEach((ctx, ctxIdx) => {
        const scaleRootName = spelledRoot(ctx.scaleRootPc);
        const isDeparture   = ctx.harmonicFunction === 'tonic';
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
        ctxHdr.appendChild(romanEl); ctxHdr.appendChild(scaleEl);
        ctxHdr.appendChild(fnEl); ctxHdr.appendChild(dotsEl); ctxHdr.appendChild(ctxArrow);
        const ctxBody = document.createElement('div');
        ctxBody.className = ctxIdx === 0 ? 'cs-body open' : 'cs-body';
        ctxBody.style.padding = '0.25rem 0.625rem 0.4rem';
        ctxHdr.addEventListener('click', () => {
          const isOpen = ctxBody.classList.toggle('open');
          ctxArrow.textContent = isOpen ? '▾' : '▸';
        });
        if (isDeparture) {
          const note = document.createElement('div');
          note.style.cssText = 'font-size:0.8rem;color:var(--accent-text);margin-bottom:0.3rem;padding:0.2rem 0;';
          note.textContent = 'Stable tonic — no resolution needed. Departure paths:';
          ctxBody.appendChild(note);
        }

        // Helper to render a list of entries (resolutions or departures) as
        // selectable collapsible sub-sections with a voice-leading table.
        function renderEntryList(entries, sectionLabel, firstOpen) {
          if (!entries || !entries.length) return;
          if (sectionLabel) {
            const lbl = document.createElement('div');
            lbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
            lbl.textContent = sectionLabel;
            ctxBody.appendChild(lbl);
          }
          entries.forEach((res, resIdx) => {
            const isFirst = firstOpen && resIdx === 0;
            const targetRootName = spelledRoot(res.targetRootPc);
            const targetLabel    = targetRootName + engineQualToSuffix(res.targetQuality);
            const resSec = document.createElement('div');
            resSec.className = 'cs-section';
            resSec.style.margin = '0.2rem 0';
            const resHdr = document.createElement('div');
            resHdr.className = 'cs-header';
            resHdr.style.paddingLeft = '0.5rem';
            resHdr.title = 'Select as resolution target';
            resHdr.style.cursor = 'pointer';
            const resNameEl = document.createElement('span');
            resNameEl.style.cssText = 'font-weight:600;margin-right:0.5rem;';
            resNameEl.textContent = '→ ' + targetLabel;
            const cadEl = document.createElement('span');
            cadEl.style.cssText = 'flex:1;font-size:0.78rem;color:var(--accent-text);';
            cadEl.textContent = resTypeLabel(res.resolutionType);
            const resArrow = document.createElement('span');
            resArrow.className = 'cs-arrow';
            resArrow.textContent = isFirst ? '▾' : '▸';
            resHdr.appendChild(resNameEl); resHdr.appendChild(cadEl);
            resHdr.appendChild(resArrow);
            const resBody = document.createElement('div');
            resBody.className = isFirst ? 'cs-body open' : 'cs-body';
            resBody.style.padding = '0.25rem 0.625rem';
            resHdr.addEventListener('click', () => {
              const isOpen = resBody.classList.toggle('open');
              resArrow.textContent = isOpen ? '▾' : '▸';
            });
            resHdr.addEventListener('click', () => {
              const p = resHdr.closest('#breakdownPanel, #breakdownPanelBody');
              if (p) p.querySelectorAll('.vl-selected').forEach(el => el.classList.remove('vl-selected'));
              resHdr.classList.add('vl-selected');
              selectedResolution = { targetRootPc: res.targetRootPc, targetQuality: res.targetQuality, label: resTypeLabel(res.resolutionType) };
              resolutionRootMidi = null;
              resolutionActive = false;
              updateResolveBtn();
            });
            if (res.voiceLeading && res.voiceLeading.length) {
              resBody.appendChild(buildVLTable(res.voiceLeading, rootMidi, rootPc, sym));
            } else {
              const buildKey = engineQualToBuildKey(res.targetQuality);
              let tgtRootMidi = (Math.floor(rootMidi / 12) * 12) + res.targetRootPc;
              if (tgtRootMidi < rootMidi - 6) tgtRootMidi += 12;
              if (tgtRootMidi > rootMidi + 6) tgtRootMidi -= 12;
              const targetMidi = buildResolutionMidi(tgtRootMidi, buildKey);
              const oldVl = computeVoiceLeading(sourceMidi, targetMidi);
              const sorted = [...sourceMidi].sort((a, b) => a - b);
              const moves = oldVl.map((v, i) => {
                const fMidi = sorted[i] ?? rootMidi;
                const semi = v.absSemi ?? 0;
                const dir = v.dir === '↑' ? 'up' : v.dir === '↓' ? 'down' : 'none';
                const toPc = targetMidi.reduce((best, t) => Math.abs(t - fMidi) < Math.abs(best - fMidi) ? t : best, targetMidi[0]);
                return { fromMidi: fMidi, toMidi: toPc, semitones: semi, direction: dir };
              });
              resBody.appendChild(buildVLTable(moves, rootMidi, rootPc, sym));
            }
            resSec.appendChild(resHdr); resSec.appendChild(resBody);
            ctxBody.appendChild(resSec);
          });
        } // end renderEntryList

        // ── Render resolutions (first entry auto-expanded in first context) ──────
        renderEntryList(ctx.resolutions, isDeparture ? null : null, ctxIdx === 0);

        // ── Render departures (tonic chords only) ────────────────────────────────
        renderEntryList(ctx.departures, ctx.departures && ctx.departures.length ? 'Departure paths' : null, ctxIdx === 0 && !(ctx.resolutions && ctx.resolutions.length));

        // ── Render substitutions (no voice-leading table — chord label only) ─────
        if (ctx.substitutions && ctx.substitutions.length) {
          const subLbl = document.createElement('div');
          subLbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
          subLbl.textContent = 'Substitutions';
          ctxBody.appendChild(subLbl);
          ctx.substitutions.forEach(sub => {
            const subRow = document.createElement('div');
            subRow.style.cssText = 'display:flex;align-items:center;padding:0.15rem 0.5rem;font-size:0.82rem;gap:0.5rem;';
            const nameEl = document.createElement('span');
            nameEl.style.fontWeight = '600';
            nameEl.textContent = spelledRoot(sub.targetRootPc) + engineQualToSuffix(sub.targetQuality);
            const descEl = document.createElement('span');
            descEl.style.cssText = 'flex:1;color:var(--accent-text);font-size:0.78rem;';
            descEl.textContent = resTypeLabel(sub.resolutionType);
            subRow.appendChild(nameEl); subRow.appendChild(descEl);
            ctxBody.appendChild(subRow);
          });
        }

        ctxSec.appendChild(ctxHdr); ctxSec.appendChild(ctxBody);
        mobileWrap.appendChild(ctxSec);
      });
      panel.appendChild(mobileWrap);
      return;
    }

    // ── Desktop: original layout — label | collapsible side by side ───────────
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
      const isDeparture   = ctx.harmonicFunction === 'tonic';

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

      // ── Helper: render one list of entries (resolutions or departures) ──────────
      // Each entry becomes a selectable collapsible sub-section with a VL table.
      function renderDesktopEntryList(entries, sectionLabel, firstOpen) {
        if (!entries || !entries.length) return;
        if (sectionLabel) {
          const lbl = document.createElement('div');
          lbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
          lbl.textContent = sectionLabel;
          ctxBody.appendChild(lbl);
        }
        entries.forEach((res, resIdx) => {
          const isFirst        = firstOpen && resIdx === 0;
          const targetRootName = spelledRoot(res.targetRootPc);
          const targetLabel    = targetRootName + engineQualToSuffix(res.targetQuality);

          const resSec = document.createElement('div');
          resSec.className = 'cs-section';
          resSec.style.margin = '0.2rem 0';

          const resHdr = document.createElement('div');
          resHdr.className = 'cs-header';
          resHdr.style.paddingLeft = '0.5rem';
          resHdr.title = 'Select as resolution target';
          resHdr.style.cursor = 'pointer';

          const resNameEl = document.createElement('span');
          resNameEl.style.cssText = 'font-weight:600;margin-right:0.5rem;';
          resNameEl.textContent = '→ ' + targetLabel;

          const cadEl = document.createElement('span');
          cadEl.style.cssText = 'flex:1;font-size:0.78rem;color:var(--accent-text);';
          cadEl.textContent = resTypeLabel(res.resolutionType);

          const resArrow = document.createElement('span');
          resArrow.className = 'cs-arrow';
          resArrow.textContent = isFirst ? '▾' : '▸';

          resHdr.appendChild(resNameEl);
          resHdr.appendChild(cadEl);
          resHdr.appendChild(resArrow);

          const resBody = document.createElement('div');
          resBody.className = isFirst ? 'cs-body open' : 'cs-body';
          resBody.style.padding = '0.25rem 0.625rem';

          resHdr.addEventListener('click', () => {
            const isOpen = resBody.classList.toggle('open');
            resArrow.textContent = isOpen ? '▾' : '▸';
          });

          resHdr.addEventListener('click', () => {
            const p = resHdr.closest('#breakdownPanel, #breakdownPanelBody');
            if (p) p.querySelectorAll('.vl-selected').forEach(el => el.classList.remove('vl-selected'));
            resHdr.classList.add('vl-selected');
            selectedResolution = {
              targetRootPc:  res.targetRootPc,
              targetQuality: res.targetQuality,
              label:         resTypeLabel(res.resolutionType),
            };
            resolutionRootMidi = null;
            resolutionActive = false;
            updateResolveBtn();
          });

          // Voice leading table — pre-computed by analyseChord()
          if (res.voiceLeading && res.voiceLeading.length) {
            resBody.appendChild(buildVLTable(res.voiceLeading, rootMidi, rootPc, sym));
          } else {
            // On-demand fallback — fires only if voiceLeading wasn't pre-computed
            const buildKey   = engineQualToBuildKey(res.targetQuality);
            let tgtRootMidi  = (Math.floor(rootMidi / 12) * 12) + res.targetRootPc;
            if (tgtRootMidi < rootMidi - 6) tgtRootMidi += 12;
            if (tgtRootMidi > rootMidi + 6) tgtRootMidi -= 12;
            const targetMidi = buildResolutionMidi(tgtRootMidi, buildKey);
            const oldVl      = computeVoiceLeading(sourceMidi, targetMidi);
            const sorted     = [...sourceMidi].sort((a, b) => a - b);
            const moves      = oldVl.map((v, i) => {
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
      } // end renderDesktopEntryList

      // ── Render true resolutions (V→I first, strongest first) ─────────────────
      renderDesktopEntryList(ctx.resolutions, null, ctxIdx === 0);

      // ── Render departure paths (tonic chords only) ────────────────────────────
      renderDesktopEntryList(
        ctx.departures,
        ctx.departures && ctx.departures.length ? 'Departure paths' : null,
        ctxIdx === 0 && !(ctx.resolutions && ctx.resolutions.length)
      );

      // ── Render substitutions (label only — no voice-leading table) ────────────
      if (ctx.substitutions && ctx.substitutions.length) {
        const subLbl = document.createElement('div');
        subLbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
        subLbl.textContent = 'Substitutions';
        ctxBody.appendChild(subLbl);
        ctx.substitutions.forEach(sub => {
          const subRow = document.createElement('div');
          subRow.style.cssText = 'display:flex;align-items:center;padding:0.15rem 0.5rem;font-size:0.82rem;gap:0.5rem;';
          const nameEl = document.createElement('span');
          nameEl.style.fontWeight = '600';
          nameEl.textContent = spelledRoot(sub.targetRootPc) + engineQualToSuffix(sub.targetQuality);
          const descEl = document.createElement('span');
          descEl.style.cssText = 'flex:1;color:var(--accent-text);font-size:0.78rem;';
          descEl.textContent = resTypeLabel(sub.resolutionType);
          subRow.appendChild(nameEl); subRow.appendChild(descEl);
          ctxBody.appendChild(subRow);
        });
      }

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
// User-selected resolution from the breakdown Voice Leading panel.
// null = use default (first context / first resolution).
// Set by tapping a resolution card; cleared on new chord.
let selectedResolution = null;

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
  if (!currentVoiceLeadingAnalysis && typeof _buildVoiceLeadingAnalysis === 'function') {
    currentVoiceLeadingAnalysis = _buildVoiceLeadingAnalysis();
  }

  const panel = document.getElementById('breakdownPanel');
  panel.innerHTML = '';

  function addDivider() {
    const hr = document.createElement('hr');
    hr.className = 'breakdown-divider';
    panel.appendChild(hr);
  }

  if (currentMode === 'intervals')    return showBreakdownIntervals(panel);
  if (currentMode === 'scales')       return showBreakdownScales(panel);
  if (currentMode === 'progressions') return showBreakdownProgressions(panel);
  showBreakdownChords(panel);
}

function hideBreakdown() {
  const panel = document.getElementById('breakdownPanel');
  panel.style.display = 'none';
  panel.innerHTML = '';
  document.getElementById('breakdownWrapper').style.display = 'none';
}
