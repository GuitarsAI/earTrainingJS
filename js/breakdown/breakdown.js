/**
 * @file breakdown.js
 * @description Shared foundation for the post-answer breakdown panel in The Sound Travels
 * Ear Training. Provides lookup tables, pure theory helpers, reusable DOM builders,
 * chord-scales analysis, resolution state management, and the main `showBreakdown()` /
 * `hideBreakdown()` entry points.
 *
 * Responsibilities:
 *   - Lookup tables: `SEMITONE_TO_NUMERAL`, `SEMITONE_TO_ROMAN`, `INTERVAL_ABBR`, `SCALE_REF`
 *   - Theory helpers: `semitonesToNumeral()`, `semitoneToDegree()`, `intervalAbbr()`, `ordinal()`
 *   - DOM builders:  `makePill()`, `makeBDRow()`, `makeCSGroup()`, `makeNameHeader()`, `joinSep()`
 *   - Chord scales:  `getChordScales()`, `makeChordScalesRow()`
 *   - Resolution UI: `resolutionActive`, `resolutionRootMidi`, `selectedResolution` state;
 *                    `playResolution()`, `renderResolutionNotation()`, `updateResolveBtn()`,
 *                    `getSourceMidi()`, `showCurrentView()`
 *   - Breakdown dispatcher: `showBreakdown()`, `hideBreakdown()`
 *
 * Out of scope for this file:
 *   - Per-mode breakdown rendering → `breakdown-intervals.js`, `breakdown-chords.js`,
 *     `breakdown-scales.js`, `breakdown-progressions.js`
 *   - Voice leading table, `getResolutionInfo()`, `makeVoiceLeadingRow()` → `breakdown-chords.js`
 *   - `_buildVoiceLeadingAnalysis()` → `chords-mode.js`
 *
 * Load order: after `voiceLeading.js`, before `breakdown-intervals.js`.
 *
 * @module breakdown
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */


// ─── Lookup tables ────────────────────────────────────────────────────────────

/**
 * Semitone offset → Roman numeral string. Covers simple (0–11) and compound (12–21)
 * intervals. Used by `semitonesToNumeral()` for interval degree and chord interval labels.
 *
 * @type {Object.<number, string>}
 */
const SEMITONE_TO_NUMERAL = {
  0:'I', 1:'♭II', 2:'II', 3:'♭III', 4:'III', 5:'IV',
  6:'♯IV', 7:'V', 8:'♭VI', 9:'VI', 10:'♭VII', 11:'VII',
  12:'I', 13:'♭IX', 14:'IX', 15:'♯IX', 17:'XI', 18:'♯XI', 20:'♭XIII', 21:'XIII',
};
/**
 * Context-aware Roman numeral lookup. Resolves ambiguous semitone counts
 * (tritone, augmented fifth, diminished seventh) to the correct degree label
 * for the chord or scale in question using the symbol-keyed exception sets.
 *
 * @param {number} semitones - Semitone interval from root (mod 12 applied internally).
 * @param {string} [symbol] - Optional chord/interval symbol for context-aware overrides.
 * @returns {string} Roman numeral string (e.g. `'V'`, `'♭VII'`, `'♭V'`), or `'—'` if unmapped.
 */
function semitonesToNumeral(semitones, symbol) {
  const s = ((semitones % 12) + 12) % 12;
  if (symbol) {
    if (s === 6 && TRITONE_AS_D5.has(symbol)) return '♭V';
    if (s === 8 && EIGHT_AS_A5.has(symbol))   return '♯V';
    if (s === 9 && NINE_AS_D7.has(symbol))    return '°VII';
  }
  return SEMITONE_TO_NUMERAL[s] || '—';
}

/**
 * Returns the ordinal string for a positive integer (e.g. `1 → '1st'`, `4 → '4th'`).
 * Used for inversion labels in the breakdown panel.
 *
 * @param {number} n - Positive integer.
 * @returns {string} Ordinal string.
 */
function ordinal(n) {
  if (n === 1) return '1st'; if (n === 2) return '2nd'; if (n === 3) return '3rd';
  return n + 'th';
}

/**
 * Maps semitones-from-root (0–11) to a qualified Roman numeral descriptor.
 * Each entry carries the base numeral and an accidental prefix.
 * Reference: major scale degrees 0=I, 2=II, 4=III, 5=IV, 7=V, 9=VI, 11=VII.
 * Chromatic deviations receive a ♭ or ♯ prefix; the numeral reflects the
 * closest diatonic position. Case (upper/lower) is applied by `semitoneToDegree()`.
 *
 * @type {Object.<number, { roman: string, prefix: string }>}
 */
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

/**
 * Returns the qualified Roman numeral for a semitone interval from the root.
 * Used by `voiceLeading.js` to label chord degrees within a diatonic context.
 *
 * @param {number} semi - Semitone interval from root (mod 12 applied internally).
 * @param {string} quality - Chord quality: `'major'`|`'augmented'` → uppercase numeral;
 *                           `'minor'`|`'diminished'` → lowercase numeral.
 * @returns {string} Qualified Roman numeral (e.g. `'♭VII'`, `'iv'`, `'III'`), or `'?'` if unmapped.
 */
function semitoneToDegree(semi, quality) {
  const entry = SEMITONE_TO_ROMAN[((semi % 12) + 12) % 12];
  if (!entry) return '?';
  const roman = (quality === 'minor' || quality === 'diminished')
    ? entry.roman.toLowerCase()
    : entry.roman;
  return entry.prefix + roman;
}

/**
 * Builds a labelled pill element for use in the breakdown panel.
 *
 * @param {string|null} label - Left-side label text, or `null` to omit the label span.
 * @param {string} value - Right-side value text.
 * @returns {HTMLElement} A `div.breakdown-pill` element.
 */
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


// ─── Interval helpers ─────────────────────────────────────────────────────────

/**
 * Semitone count → interval abbreviation string, always ascending.
 * Covers simple (0–12) and compound (13–21) intervals.
 * Used by `intervalAbbr()` as its primary lookup table.
 *
 * @type {Object.<number, string>}
 */
const INTERVAL_ABBR = {
  0:'P1', 1:'m2', 2:'M2', 3:'m3', 4:'M3', 5:'P4',
  6:'A4', 7:'P5', 8:'m6', 9:'M6', 10:'m7', 11:'M7', 12:'P8',
  13:'m9', 14:'M9', 15:'A9', 17:'P11', 18:'A11', 20:'m13', 21:'M13',
};
/**
 * Returns the interval abbreviation for a semitone count, with optional context-aware
 * overrides for ambiguous intervals (tritone, augmented fifth, diminished seventh).
 *
 * @param {number} semitones - Semitone distance (sign ignored; absolute value used).
 * @param {string} [symbol] - Optional chord symbol for context-aware overrides.
 * @returns {string} Abbreviation string (e.g. `'M3'`, `'d5'`, `'A5'`).
 */
function intervalAbbr(semitones, symbol) {
  const s = Math.abs(semitones);
  if (symbol) {
    if (s === 6 && TRITONE_AS_D5.has(symbol)) return 'd5';
    if (s === 8 && EIGHT_AS_A5.has(symbol))   return 'A5';
    if (s === 9 && NINE_AS_D7.has(symbol))    return 'd7';
  }
  return INTERVAL_ABBR[s] || (s + 'st');
}

/**
 * Appends a key–value row to a breakdown panel element.
 *
 * @param {HTMLElement} panel - The panel to append the row into.
 * @param {string} label - Row label text (rendered as `span.breakdown-key`).
 * @param {string} content - Row value HTML (rendered as `span.breakdown-val` via `innerHTML`).
 */
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

/**
 * Builds a collapsible group section using the existing `cs-section` / `cs-header` /
 * `cs-body` / `cs-arrow` CSS classes. No new styles are required.
 *
 * @param {string} label - Text shown on the toggle header.
 * @param {boolean} [open=false] - Whether the group starts expanded.
 * @returns {{ section: HTMLElement, body: HTMLElement }} Append `section` to the panel;
 *   insert content rows into `body`.
 */
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

/**
 * Builds and appends a Level-1 collapsible name header to the panel.
 * The header element is appended to `panel` immediately; all breakdown content
 * should be inserted into the returned `body`.
 *
 * @param {HTMLElement} panel - The panel to append the header and body into.
 * @param {string|HTMLElement} labelEl_or_text - Either a plain string or a pre-built
 *   element to use as the header label.
 * @returns {{ body: HTMLElement }} The collapsible body element for content insertion.
 */
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

/**
 * Joins an array of HTML strings with an en-dash separator span between each element.
 *
 * @param {string[]} arr - Array of HTML strings to join.
 * @returns {string} Combined HTML string with `span.breakdown-sep` separators.
 */
function joinSep(arr) {
  return arr.map((n, i) =>
    i === 0 ? n : '<span class="breakdown-sep">\u2013</span>' + n
  ).join('');
}

// ─── Chord scales ─────────────────────────────────────────────────────────────

/**
 * Reference list of every scale tested by `getChordScales()`. Built once at load
 * time from the `SCALES` array (octave note stripped). Each entry stores the scale's
 * pitch classes as a `Set` of mod-12 intervals from root, plus display metadata.
 *
 * @type {Array<{ name: string, symbol: string, pcs: Set<number>, tag: string, note: string }>}
 */
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

/**
 * Returns all scales from `SCALE_REF` that contain every pitch class in the chord.
 *
 * @param {number} rootPc - Root pitch class of the chord (0–11).
 * @param {Set<number>} chordPcs - Set of pitch classes present in the chord.
 * @returns {Array<{ name: string, symbol: string, tag: string, note: string }>}
 *   Matching scale entries in `SCALE_REF` order.
 */
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

// ─── Mobile layout helper ────────────────────────────────────────────────────

/**
 * Returns `true` when the viewport is at or below the mobile breakpoint (≤ 600 px).
 * Used to switch between the desktop `breakdown-row` layout and the full-width
 * mobile stack layout for Chord Scales and Voice Leading rows.
 *
 * @returns {boolean}
 */
function isMobile() { return window.innerWidth <= 600; }

/**
 * Renders a collapsible Chord Scales sub-section into the breakdown panel.
 * On mobile (≤ 600 px) renders a full-width stack; on desktop renders as a
 * `breakdown-row` with the label on the left and the collapsible on the right.
 * Each scale row is clickable and navigates to that scale in Dictionary mode.
 *
 * @param {HTMLElement} panel - The breakdown panel to append into.
 * @param {number} rootPc - Tonal centre pitch class (0–11).
 * @param {Iterable<number>} chordPcs - Pitch classes of the chord to match.
 */
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

// ─── Resolution state & playback ─────────────────────────────────────────────
//
// Voice leading helpers consumed exclusively by the chords breakdown path —
// `getResolutionInfo()`, `makeVoiceLeadingRow()`, and related utilities — live
// in `breakdown-chords.js`. Progression data and state live in `progressions.js`.


/** @type {boolean} Whether the resolution view is currently active for the displayed chord. */
let resolutionActive = false;

/**
 * MIDI note number of the resolution target root. Stored once when the user first
 * triggers resolution — derived from the full chord at answer time and never
 * re-derived mid-session so that voicing changes do not shift the target root.
 *
 * @type {number|null}
 */
let resolutionRootMidi = null;

/**
 * User-selected resolution from the Voice Leading panel. `null` means use the
 * default (first context / first resolution). Set when the user taps a resolution
 * card; cleared on every new chord.
 *
 * @type {Object|null}
 */
let selectedResolution = null;

/**
 * Toggles between the chord view and the resolution view. On the first entry into
 * resolution view, stores the resolution target root and plays audio (source chord →
 * pause → resolution chord). Subsequent toggles silently swap notation only; audio
 * plays exclusively when entering resolution view.
 */
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

/**
 * Returns the source MIDI note array for the currently displayed chord, handling
 * all chord families (polychord, UST, slash, standard).
 *
 * @returns {number[]} Array of MIDI note numbers for the source chord.
 */
function getSourceMidi() {
  if (currentChord?.family === 'poly')  return [...currentPolyLowerMidi, ...currentPolyUpperMidi];
  if (currentChord?.family === 'ust')   return [...currentMidiNotes];
  if (currentChord?.family === 'slash') return [currentSlashBassMidi, ...currentMidiNotes];
  return [...currentMidiNotes];
}

/**
 * Syncs the Resolve button label with the current `resolutionActive` state:
 * `'Resolve →'` when in chord view; `'← Chord'` when in resolution view.
 */
function updateResolveBtn() {
  const btn = document.getElementById('resolveBtn');
  if (btn) btn.textContent = resolutionActive ? '← Chord' : 'Resolve →';
}

/**
 * Dispatches to the correct notation view based on `resolutionActive`:
 * renders resolution notation when active, chord notation otherwise.
 */
function showCurrentView() {
  if (resolutionActive) renderResolutionNotation();
  else showNotation();
}

/**
 * Renders a two-chord grand-staff layout (source chord | barline | resolution chord)
 * into `#notation-svg`. Fully derived from current app state on every call — no cached
 * arguments — so voicing changes are always reflected. Honours `chordKeySigMode`
 * (Key / C chip) for accidental rendering on both staves.
 */
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

/**
 * Maps a chord symbol to its full English quality name for use in breakdown labels.
 * Falls back to the symbol itself for any unrecognised entry.
 *
 * @param {string} sym - Chord symbol (e.g. `'maj7'`, `'m7b5'`).
 * @returns {string} Full quality name (e.g. `'major 7th'`, `'half-diminished (ø7)'`).
 */
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

/**
 * Main breakdown dispatcher. Lazily builds the voice leading analysis if not yet
 * computed, clears the panel, then delegates to the correct per-mode renderer:
 * `showBreakdownIntervals`, `showBreakdownScales`, `showBreakdownProgressions`,
 * or `showBreakdownChords`.
 */
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

/**
 * Hides and clears the breakdown panel and its wrapper element.
 * Called when the user dismisses the breakdown or a new question is generated.
 */
function hideBreakdown() {
  const panel = document.getElementById('breakdownPanel');
  panel.style.display = 'none';
  panel.innerHTML = '';
  document.getElementById('breakdownWrapper').style.display = 'none';
}

// ─── End of breakdown.js ──────────────────────────────────────────────────────
/**
 * @file breakdown.js — End of file.
 * @copyright The Sound Travels 2026
 * @license MIT
 */
