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

// ─── POINT 37: Resolve → button logic ────────────────────────────────────────
//
// RESOLUTION_TARGETS, VL_INTERVAL_NAMES, vlRoleLabel(), buildResolutionMidi(),
// getResolutionInfo(), computeVoiceLeading(), and makeVoiceLeadingRow() all live
// in breakdown-chords.js — they are consumed exclusively by the chords breakdown path.
//
// NOTE: PROGRESSIONS, PROG_DEGREES, PROG_QUALITIES, PROG_GROUPS, PROG_GROUP_COLLAPSED,
// selectedProgressions, and progression state vars all live in js/data/progressions.js


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
