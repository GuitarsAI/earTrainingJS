/**
 * @file
 * @author    Renato Fera P. — https://www.linkedin.com/in/renato-profeta/
 * @copyright © 2026 The Sound Travels — MIT License
 */

/**
 * @file app.js
 * @description Boot file and application coordinator. Owns mode switching,
 *   quiz/dictionary toggle, dictionary mode functions (dictLoadSymbol, dictShow,
 *   renderDictPoolPanel, renderInversionChips), the recomputeCurrentNotes engine,
 *   Basic/Advanced difficulty switching, register panel rendering, theme init,
 *   keyboard shortcuts, and all top-level DOM event wiring.
 *
 *   Module-level state declared here (not in state.js) because it is tightly
 *   coupled to dictionary UI logic and has no cross-file consumers:
 *     - dictSymbol         — currently loaded dictionary item symbol
 *     - dictInversionIndex — inversion position shown in dict / post-answer view
 *
 *   Must load last — depends on every other layer being defined.
 * @layer boot
 * @requires state.js, defaults.js, helpers.js, spelling.js, keysig.js,
 *           audio.js, notation.js, voicings.js, voiceLeading.js,
 *           breakdown.js, breakdown-chords.js,
 *           stats.js, controls.js, pool.js, pool-chords.js,
 *           pool-intervals.js, pool-scales.js, pool-progressions.js,
 *           chords-mode.js, intervals-mode.js, scales-mode.js,
 *           progressions-mode.js, help-mode.js, about-mode.js
 */

// ─── Mode switching ───────────────────────────────────────────────────────────

/**
 * Switches the active training mode, rebuilds the pool panel for the new mode,
 * updates the mode tab UI, resets the streak, and either starts a new question
 * or re-enters dictionary mode (preserving any target symbol passed in).
 *
 * Always calls teardownProgressionUI() first to clean up any progression DOM
 * residue before the new mode's UI is built.
 *
 * @param {string}      mode         - Target mode: 'chords' | 'intervals' | 'scales' | 'progressions'.
 * @param {string|null} targetSymbol - Optional symbol to load directly in dict mode
 *                                     (e.g. navigating here from a chord-scales breakdown link).
 */
function switchMode(mode, targetSymbol = null) {
  if (typeof teardownProgressionUI === 'function') teardownProgressionUI();
  currentMode = mode;

  streak = 0;
  document.getElementById('streak').textContent = 0;

  document.querySelectorAll('.mode-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });

  // Rebuild pool panel and show/hide the per-mode playback style rows
  renderPoolPanel();
  document.getElementById('chordStyleSection').style.display    = mode === 'chords'       ? '' : 'none';
  document.getElementById('intervalStyleSection').style.display = mode === 'intervals'    ? '' : 'none';
  document.getElementById('scaleDirSection').style.display      = mode === 'scales'       ? '' : 'none';

  document.getElementById('playLabel').textContent =
    mode === 'intervals'    ? 'Play interval (together)'
    : mode === 'scales'     ? 'Play scale (ascending)'
    : mode === 'progressions' ? 'Play progression'
    : 'Play chord';

  updateRootBadge(null);

  if (appMode === 'dict') {
    // If a specific symbol was requested (e.g. navigating from a chord scales
    // breakdown link), load it directly. Otherwise reset so the new mode's
    // default is picked.
    dictSymbol = targetSymbol ?? null;
    setAppMode('dict');
  } else {
    generateQuestion();
  }
}

// ─── Basic / Advanced difficulty ──────────────────────────────────────────────

/**
 * Hard-coded Basic chord symbol list. Matches the `basic: true` entries in
 * chords.js but kept here as a constant so setAppDifficulty() can reset
 * selectedChords without re-filtering the full CHORD_TYPES catalog.
 */
const BASIC_CHORD_SYMBOLS = ['maj','Maj7','m','m7','7','dim','m7b5','o7','aug','sus2','sus4','power'];

/**
 * Switches between Basic and Advanced difficulty modes. Resets all four pool
 * selections (intervals, chords, scales, progressions) and voicing state to
 * mode-appropriate defaults — no cross-difficulty memory. Rebuilds the pool
 * panel and generates a fresh question for the current mode.
 *
 * Basic boundaries per mode:
 *   Intervals   — 12 simple (m2–P8); Advanced adds 7 compound (m9–M13)
 *   Chords      — 12 core families (BASIC_CHORD_SYMBOLS); Advanced shows all
 *   Scales      — Major, Natural Minor, Major/Minor Pentatonic; Advanced shows all
 *   Progressions — 9 core progressions (basic: true in progressions.js); Advanced shows all
 *   Voicings     — Position + Doubling groups only (Groups 1–2); Advanced shows all 6
 *
 * @param {'basic'|'advanced'} difficulty - Target difficulty level.
 */
function setAppDifficulty(difficulty) {
  appDifficulty = difficulty;

  // Reset selectedIntervals — fresh start, no cross-difficulty memory
  selectedIntervals.clear();
  if (difficulty === 'basic') {
    INTERVALS.filter(i => !i.compound).forEach(i => selectedIntervals.add(i.symbol));
  } else {
    INTERVALS.forEach(i => selectedIntervals.add(i.symbol));
  }

  // Reset selectedChords — fresh start, no cross-difficulty memory
  selectedChords.clear();
  if (difficulty === 'basic') {
    BASIC_CHORD_SYMBOLS.forEach(s => selectedChords.add(s));
  } else {
    getAllChords().forEach(c => selectedChords.add(c.symbol));
  }

  // Sync difficulty chip UI
  document.getElementById('diffChipBasic').classList.toggle('active',    difficulty === 'basic');
  document.getElementById('diffChipAdvanced').classList.toggle('active', difficulty === 'advanced');

  // Reset selectedScales — fresh start, no cross-difficulty memory
  selectedScales.clear();
  if (difficulty === 'basic') {
    SCALES.filter(s => s.basic).forEach(s => selectedScales.add(s.symbol));
  } else {
    SCALES.forEach(s => selectedScales.add(s.symbol));
  }

  // Reset selectedProgressions — fresh start, no cross-difficulty memory
  selectedProgressions.clear();
  if (difficulty === 'basic') {
    PROGRESSIONS.filter(p => p.basic).forEach(p => selectedProgressions.add(p.symbol));
  } else {
    PROGRESSIONS.forEach(p => selectedProgressions.add(p.symbol));
  }

  // Reset voicings to close position — Groups 1–2 only in Basic, all 6 in Advanced
  selectedVoicings.clear();
  selectedVoicings.add('close');
  activeVoicingMode = 'close';

  // Rebuild pool and generate a fresh question for the current mode
  if (currentMode === 'intervals' || currentMode === 'chords' || currentMode === 'scales' || currentMode === 'progressions') {
    renderPoolPanel();
    if (appMode === 'dict') setAppMode('dict');
    else generateQuestion();
  }
}

// ─── Register panel ───────────────────────────────────────────────────────────

/**
 * Renders the root note and octave register chip rows into #rootChips and
 * #octaveChips. Both rows call recomputeCurrentNotes() on chip click so the
 * current item is re-voiced in place without picking a new question.
 *
 * Root chips include both enharmonic spellings for each accidental pitch class
 * (e.g. C♯ and D♭ are separate chips sharing pitch class 1). Selecting one sets
 * both pinnedRoot (pitch class) and pinnedRootSpelling ('sharp' | 'flat' | null),
 * which the enharmonic spelling engine uses to choose the correct letter name.
 */
function renderRegisterPanel() {
  // Full chromatic root list. Each accidental pitch class has two entries —
  // one sharp spelling, one flat — so the user can pin the preferred enharmonic.
  // { label, value: pitch class 0–11 or null (= random), spelling: 'sharp'|'flat'|null }
  const ROOT_OPTIONS = [
    { label: 'Rnd',       value: null, spelling: null   },
    { label: 'C',         value: 0,    spelling: null   },
    { label: 'C\u266f',  value: 1,    spelling: 'sharp' },
    { label: 'D\u266d',  value: 1,    spelling: 'flat'  },
    { label: 'D',         value: 2,    spelling: null   },
    { label: 'D\u266f',  value: 3,    spelling: 'sharp' },
    { label: 'E\u266d',  value: 3,    spelling: 'flat'  },
    { label: 'E',         value: 4,    spelling: null   },
    { label: 'F',         value: 5,    spelling: null   },
    { label: 'F\u266f',  value: 6,    spelling: 'sharp' },
    { label: 'G\u266d',  value: 6,    spelling: 'flat'  },
    { label: 'G',         value: 7,    spelling: null   },
    { label: 'G\u266f',  value: 8,    spelling: 'sharp' },
    { label: 'A\u266d',  value: 8,    spelling: 'flat'  },
    { label: 'A',         value: 9,    spelling: null   },
    { label: 'A\u266f',  value: 10,   spelling: 'sharp' },
    { label: 'B\u266d',  value: 10,   spelling: 'flat'  },
    { label: 'B',         value: 11,   spelling: null   },
  ];
  const OCTAVE_OPTIONS = [
    { label: 'Rnd',  value: null   },
    { label: 'Low',  value: 'low'  },
    { label: 'Mid',  value: 'mid'  },
    { label: 'High', value: 'high' },
  ];

  // Root chips — also sets pinnedRootSpelling to select the correct enharmonic
  const rootRow = document.getElementById('rootChips');
  rootRow.innerHTML = '';
  ROOT_OPTIONS.forEach(opt => {
    const isActive = pinnedRoot === opt.value && pinnedRootSpelling === opt.spelling;
    const chip = document.createElement('button');
    chip.className = 'reg-chip' + (isActive ? ' active' : '');
    chip.textContent = opt.label;
    chip.addEventListener('click', () => {
      pinnedRoot         = opt.value;
      pinnedRootSpelling = opt.spelling;
      rootRow.querySelectorAll('.reg-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      recomputeCurrentNotes();
    });
    rootRow.appendChild(chip);
  });

  // Octave chips
  const octaveRow = document.getElementById('octaveChips');
  octaveRow.innerHTML = '';
  OCTAVE_OPTIONS.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'reg-chip' + (pinnedOctave === opt.value ? ' active' : '');
    chip.textContent = opt.label;
    chip.addEventListener('click', () => {
      pinnedOctave = opt.value;
      octaveRow.querySelectorAll('.reg-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      recomputeCurrentNotes();
    });
    octaveRow.appendChild(chip);
  });
}

// ─── Settings panel ───────────────────────────────────────────────────────────

// Settings panel collapsible toggle — wired immediately at load time via IIFE
// so the header click works before any question is generated.
(function() {
  const header = document.getElementById('settingsPanelHeader');
  const body   = document.getElementById('settingsPanelBody');
  const arrow  = document.getElementById('settingsPanelArrow');
  header.addEventListener('click', () => {
    const open = body.classList.toggle('open');
    arrow.textContent = open ? '▾' : '▸';
  });
})();

// ─── Dictionary mode ──────────────────────────────────────────────────────────

// Full catalog getters — mirror getAllChords() in helpers.js for the other two modes.
// Return a fresh array so callers cannot mutate the source data arrays.
function getAllIntervals() { return [...INTERVALS]; }
function getAllScales()    { return [...SCALES]; }

/**
 * Returns the full item catalog for the current mode, ignoring quiz pool filters.
 * Used by dictionary mode to show every available item.
 *
 * @returns {object[]} Full array of interval, chord, or scale descriptors.
 */
function dictFullCatalog() {
  if (currentMode === 'chords')    return getAllChords();
  if (currentMode === 'intervals') return getAllIntervals();
  return getAllScales();
}

/** Currently loaded dictionary item symbol, or null before first load. */
let dictSymbol = null;

/** Inversion position shown in dict mode and post-answer quiz view (0 = root position). */
let dictInversionIndex = 0;

/**
 * Returns the symbol of the first item in the full catalog for the current mode.
 * Used as the initial selection when entering dict mode with no prior symbol.
 *
 * @returns {string|null} Symbol string, or null if the catalog is empty.
 */
function dictDefaultSymbol() {
  const catalog = dictFullCatalog();
  return catalog.length ? catalog[0].symbol : null;
}

/**
 * Loads a dictionary item by symbol and sets all relevant state variables so
 * dictShow() / showNotation() / showBreakdown() can render it immediately.
 * Mirrors the four chord-family paths in generateChordQuestion() exactly —
 * any logic change there must be reflected here.
 *
 * The special symbol '_random' picks a random item from the full catalog.
 *
 * @param {string} symbol - Item symbol to load, or '_random' for a random pick.
 */
function dictLoadSymbol(symbol) {
  if (!symbol) return;
  dictSymbol = symbol;
  const catalog = dictFullCatalog();

  if (currentMode === 'chords') {
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(c => c.symbol === symbol);
    if (!item) return;
    currentChord = item;

    // Reset all special-chord state before branching
    currentSlashBassMidi = null; currentUpperRootMidi = null;
    currentPolyUpperMidi = []; currentPolyLowerMidi = [];
    currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
    currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;

    dictInversionIndex = 0; // reset to root position on every new chord selection

    if (item.family === 'slash') {
      // Mirror generateChordQuestion slash path exactly
      const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
      currentUpperRootMidi = 12 + pitchClass + 4 * 12;
      currentChordRootMidi = currentUpperRootMidi;
      const belowSemitones = 12 - item.bassInterval;
      currentSlashBassMidi = currentUpperRootMidi - belowSemitones;
      while (currentSlashBassMidi > 48) currentSlashBassMidi -= 12;
      while (currentSlashBassMidi < 28) currentSlashBassMidi += 12;
      currentMidiNotes = item.upperIntervals.map(i => currentUpperRootMidi + i);
      currentVoicingMode = 'full';
    } else if (item.family === 'poly') {
      // Mirror generateChordQuestion poly path exactly
      const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
      currentPolyUpperRootMidi = 12 + pitchClass + 5 * 12;
      currentPolyLowerRootMidi = currentPolyUpperRootMidi - item.lowerOffset;
      while (currentPolyLowerRootMidi > 48) currentPolyLowerRootMidi -= 12;
      while (currentPolyLowerRootMidi < 36) currentPolyLowerRootMidi += 12;
      currentPolyUpperMidi = item.upperIntervals.map(i => currentPolyUpperRootMidi + i);
      currentPolyLowerMidi = item.lowerIntervals.map(i => currentPolyLowerRootMidi + i);
      currentMidiNotes = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
      currentChordRootMidi = currentPolyLowerRootMidi;
      currentVoicingMode = 'full';
    } else if (item.family === 'ust') {
      // Mirror generateChordQuestion ust path exactly
      const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
      currentUSTRootMidi = 12 + pitchClass + 4 * 12;
      currentChordRootMidi = currentUSTRootMidi;
      currentUSTShellMidi = item.shellIntervals.map(i => currentUSTRootMidi + i);
      const upperTriadRootMidi = currentUSTRootMidi + item.upperTriadRoot;
      currentUSTUpperMidi = item.upperTriadIntervals.map(i => upperTriadRootMidi + i);
      currentUSTShellMidi = currentUSTShellMidi.map(m => m < 48 ? m + 12 : m);
      currentMidiNotes = [...currentUSTShellMidi, ...currentUSTUpperMidi];
      currentVoicingMode = 'full';
    } else {
      // Normal chord path (including inversions)
      const rootMidi = chooseSimpleRootMidi(Math.max(...item.intervals.map(Math.abs)));
      currentChordRootMidi = rootMidi;
      currentVoicingMode = resolveVoicingMode();
      const voicedMidi = applyVoicing(rootMidi, item.intervals, currentVoicingMode);
      const sorted = [...voicedMidi].sort((a, b) => a - b);
      const invIdx = Math.min(dictInversionIndex, sorted.length - 1);
      for (let i = 0; i < invIdx; i++) { const lo = sorted.shift(); sorted.push(lo + 12); }
      currentMidiNotes = sorted;
    }

  } else if (currentMode === 'intervals') {
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(i => i.symbol === symbol);
    if (!item) return;
    currentInterval = item;
    currentIntervalStyle = resolveIntervalStyle();
    const rootMidi = chooseSimpleRootMidi(item.semitones);
    currentIntervalMidi = [rootMidi, rootMidi + item.semitones];

  } else {
    // Scales
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(s => s.symbol === symbol);
    if (!item) return;
    currentScale = item;
    currentScaleRootMidi = chooseSimpleRootMidi(item.intervals[item.intervals.length - 1]);
    currentScaleDir = resolveScaleDir();
    scaleKeySigMode = 'key';
  }
}

/**
 * Renders the pool panel in dictionary mode. Structure mirrors the quiz pool
 * (same groups and sections) but uses single-select chips with no All/None
 * buttons. Chords reuse the shared _renderChordSubGroups() from pool-chords.js,
 * which reads appMode internally to switch between multi and single select.
 */
function renderDictPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';

  const title = currentMode === 'chords'    ? 'Dictionary — Chords'
              : currentMode === 'intervals' ? 'Dictionary — Intervals'
              : 'Dictionary — Scales';
  const { body } = makePoolPanelShell(panel, title, null);

  if (currentMode === 'chords') {
    // Shared two-subgroup structure (Chord quality + Voicing) — reads appMode
    // internally to render single-select in dict mode.
    _renderChordSubGroups(body);
  } else if (currentMode === 'intervals') {
    // Compound section hidden in Basic mode
    makeDictSection(body, 'Simple intervals', INTERVALS.filter(i => !i.compound), false, false);
    if (appDifficulty === 'advanced') {
      makeDictSection(body, 'Extended / Compound', INTERVALS.filter(i => i.compound), false, true);
    }
  } else {
    // Scales — groups auto-discovered via iterateScaleGroups (pool-scales.js),
    // same source of truth used by the quiz pool panel.
    iterateScaleGroups((key, title, items, cfg) => {
      const useDisplayName = !!(cfg && cfg.sectionFn === 'withDisplayName');
      makeDictSection(body, title, items, useDisplayName, false);
    });
  }
}

/**
 * Builds one collapsible section of single-select chips for the dictionary pool
 * panel. Clicking a chip loads the item immediately via dictLoadSymbol + dictShow.
 * No All/None buttons, no count display — dict mode is browse-only.
 *
 * @param {HTMLElement} body           - Parent element to append the section into.
 * @param {string}      title          - Section heading text.
 * @param {object[]}    items          - Array of item descriptors ({ name, symbol, displayName? }).
 * @param {boolean}     useDisplayName - When true, chips show item.displayName over item.name.
 * @param {boolean}     collapsed      - Whether the section starts collapsed.
 */
function makeDictSection(body, title, items, useDisplayName = false, collapsed = false) {
  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';
  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = collapsed ? '▸' : '▾';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));
  hdr.appendChild(titleEl);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (collapsed ? ' collapsed' : '');

  hdr.addEventListener('click', () => {
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip' + (dictSymbol === item.symbol ? ' active' : '');
    chip.textContent = useDisplayName ? (item.displayName || item.name) : item.name;
    chip.addEventListener('click', () => {
      _deactivateAllDictChips();
      chip.classList.add('active');
      dictLoadSymbol(item.symbol);
      dictShow();
    });
    chipsEl.appendChild(chip);
  });

  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

/**
 * Removes the active class from every pool chip in #poolPanel.
 * Called before activating a newly selected dict chip to ensure single-select.
 */
function _deactivateAllDictChips() {
  document.querySelectorAll('#poolPanel .pool-chip').forEach(c => c.classList.remove('active'));
}

/**
 * Applies a specific inversion index to the current chord in dict or post-answer
 * quiz mode, re-voices in place, and refreshes notation and breakdown without
 * triggering a full showNotation() header rebuild.
 *
 * No-ops for chord families that do not support rotation-based inversions:
 * slash, poly, UST, classical, quartal, cluster.
 *
 * @param {number} invIdx - Target inversion index (0 = root position).
 */
function dictApplyInversion(invIdx) {
  if (!currentChord || currentChord.family === 'slash' || currentChord.family === 'poly'
    || currentChord.family === 'ust' || currentChord.family === 'classical'
    || currentChord.family === 'quartal' || currentChord.family === 'cluster') return;

  dictInversionIndex = invIdx;
  const baseChord     = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const baseIntervals = baseChord.intervals;
  const voicedMidi    = applyVoicing(currentChordRootMidi, baseIntervals, currentVoicingMode);
  const sortedVoiced  = [...voicedMidi].sort((a, b) => a - b);
  const safeInvIdx    = Math.min(invIdx, sortedVoiced.length - 1);
  for (let i = 0; i < safeInvIdx; i++) { const lo = sortedVoiced.shift(); sortedVoiced.push(lo + 12); }
  currentMidiNotes = sortedVoiced;
  answered = true;

  // Update the notation chord name label to reflect the selected inversion
  const INV_LABELS = ['', ' — 1st inv', ' — 2nd inv', ' — 3rd inv', ' — 4th inv'];
  const invLabel = INV_LABELS[invIdx] || '';
  document.getElementById('notationChordName').textContent =
    getChordRootName() + ' ' + baseChord.name + invLabel;

  // Re-render notation and breakdown without rebuilding the full showNotation() header
  const sym    = baseChord.symbol;
  const rootPc = ((currentChordRootMidi % 12) + 12) % 12;
  const keySigStr = chordKeySigMode === 'key' ? getChordKeyStr(sym, rootPc) : null;
  const sorted = [...currentMidiNotes].sort((a, b) => a - b);
  if (currentChordPlayStyle === 'ascending') {
    renderNotation(sorted, true, sym, rootPc, keySigStr);
  } else if (currentChordPlayStyle === 'descending') {
    renderNotation([...sorted].reverse(), true, sym, rootPc, keySigStr);
  } else if (currentChordPlayStyle === 'broken') {
    const root = sorted[0], top = sorted[sorted.length - 1], mid = sorted.length > 2 ? sorted[1] : sorted[0];
    renderNotation([root, top, mid, top], true, sym, rootPc, keySigStr);
  } else {
    renderNotation(currentMidiNotes, false, sym, rootPc, keySigStr);
  }
  showBreakdown();
}

/**
 * Renders inversion chips into #inversionChipRow for normal chords in dict mode
 * and post-answer quiz mode. Each chip calls dictApplyInversion() on click.
 *
 * The row is hidden entirely for chord families that do not support rotation-based
 * inversions (slash, poly, UST, classical, quartal, cluster), for non-chord modes,
 * and for chords with only one note.
 *
 * In quiz mode the active chip starts at the inversion that was actually quizzed
 * (currentChord.invIndex). In dict mode it persists from the last chip click
 * (dictInversionIndex).
 *
 * Called by showNotation() after every chord question and by dictShow().
 */
function renderInversionChips() {
  const row = document.getElementById('inversionChipRow');
  row.innerHTML = '';

  const hide = currentMode !== 'chords'
    || !currentChord
    || currentChord.family === 'slash'
    || currentChord.family === 'poly'
    || currentChord.family === 'ust'
    || currentChord.family === 'classical'
    || currentChord.family === 'quartal'
    || currentChord.family === 'cluster';

  if (hide) { row.style.display = 'none'; return; }

  const baseChord = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const noteCount = baseChord.intervals.length;
  const maxInv    = noteCount - 1;

  if (maxInv < 1) { row.style.display = 'none'; return; }

  // In quiz mode: sync to the inversion that was actually quizzed.
  // In dict mode: dictInversionIndex persists between chip clicks.
  if (appMode === 'quiz') {
    dictInversionIndex = currentChord.invIndex ?? 0;
  }

  row.style.display = 'flex';
  const INV_CHIP_LABELS = ['Root', '1st inv', '2nd inv', '3rd inv', '4th inv'];
  for (let i = 0; i <= maxInv; i++) {
    const chip = document.createElement('button');
    chip.className = 'keysig-chip' + (i === dictInversionIndex ? ' active' : '');
    chip.textContent = INV_CHIP_LABELS[i] || (i + 'th inv');
    const idx = i;
    chip.addEventListener('click', () => {
      row.querySelectorAll('.keysig-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      dictApplyInversion(idx);
    });
    row.appendChild(chip);
  }
}

/**
 * Reveals notation and breakdown for the currently loaded dictionary item.
 * Sets answered = true so showNotation() and showBreakdown() render without
 * restriction, resets resolution state, and rebuilds the Hear Slowly + Resolve
 * control buttons. No-ops if the required current-item state is missing.
 */
function dictShow() {
  if (currentMode === 'scales'    && !currentScale)    return;
  if (currentMode === 'chords'    && !currentChord)    return;
  if (currentMode === 'intervals' && !currentInterval) return;

  document.getElementById('statusMsg').textContent = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';

  if (currentMode === 'chords') {
    updateRootBadge(getChordRootName());
  } else if (currentMode === 'intervals') {
    updateRootBadge(spelledNote(0, currentIntervalMidi[0] % 12, currentInterval.symbol));
  } else {
    updateRootBadge(spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol));
  }

  answered = true;              // allow showNotation + showBreakdown to render fully
  resolutionActive = false;     // reset so notation shows current item, not resolution view
  resolutionRootMidi = null;    // force fresh derivation for the new item
  selectedResolution = null;    // clear any user-selected resolution target
  currentVoiceLeadingAnalysis = null; // force rebuild for the current chord/root

  showNotation();
  renderInversionChips();
  showBreakdown();

  // Rebuild controls: Hear Slowly always present; Resolve toggle in chords mode only
  const c = document.getElementById('controls');
  c.innerHTML = '';
  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playSlowly);
  c.appendChild(sb);
  if (currentMode === 'chords') {
    const rb = document.createElement('button');
    rb.className = 'ctrl-btn resolve';
    rb.id = 'resolveBtn';
    rb.textContent = resolutionActive ? '← Chord' : 'Resolve →';
    rb.addEventListener('click', playResolution);
    c.appendChild(rb);
  }
}

// ─── Recompute current notes ──────────────────────────────────────────────────

/**
 * Reapplies current settings (root pin, octave band, voicing) to the active
 * item without picking a new question. Called whenever a setting changes:
 * root chip, octave chip, voicing chip, style/direction chip.
 *
 * Re-voices the same pitch class in place, preserving the current octave
 * where possible (prefers to keep the existing octave if it still falls within
 * the resolved band). Refreshes notation and breakdown if in dict mode or
 * after answering in quiz mode.
 *
 * All four chord families (slash, poly, UST, normal) are handled identically
 * to dictLoadSymbol() and generateChordQuestion() — any change to those paths
 * must be reflected here.
 */
function recomputeCurrentNotes() {

  // Returns the pitch class to use: pinned root wins, otherwise keep existing.
  function resolvePc(existingPc) {
    return pinnedRoot !== null ? pinnedRoot : existingPc;
  }

  // Builds a root MIDI note from a pitch class, preferring to keep the current
  // octave if it still falls within [lo, hi]; otherwise uses the midpoint.
  function rootMidiForPc(pc, existingRootMidi, lo, hi) {
    const existingOct = Math.floor(existingRootMidi / 12) - 1;
    const oct = (existingOct >= lo && existingOct <= hi)
      ? existingOct
      : Math.floor((lo + hi) / 2);
    return 12 + pc + oct * 12;
  }

  // ── Progressions ─────────────────────────────────────────────────────────────
  if (currentMode === 'progressions') {
    if (!currentProgression) return;
    const pc = pinnedRoot !== null ? pinnedRoot : currentProgRootPc ?? 0;
    currentProgRootPc   = pc;
    currentProgRootMidi = 12 + pc + 4 * 12;
    updateRootBadge(spelledRoot(pc));
    if (appMode === 'dict' || progAnswered) {
      showProgressionNotation();
      showBreakdown();
    }
    return;
  }

  // ── Chords ───────────────────────────────────────────────────────────────────
  if (currentMode === 'chords') {
    if (!currentChord) return;

    if (currentChord.family === 'slash') {
      const existingPc = currentUpperRootMidi !== null ? currentUpperRootMidi % 12 : 0;
      const pc = resolvePc(existingPc);
      const rootMidi = 12 + pc + 4 * 12;
      currentUpperRootMidi = rootMidi;
      currentChordRootMidi = rootMidi;
      const belowSemitones = 12 - currentChord.bassInterval;
      currentSlashBassMidi = rootMidi - belowSemitones;
      while (currentSlashBassMidi > 48) currentSlashBassMidi -= 12;
      while (currentSlashBassMidi < 28) currentSlashBassMidi += 12;
      currentMidiNotes = currentChord.upperIntervals.map(i => rootMidi + i);

    } else if (currentChord.family === 'poly') {
      const existingPc = currentPolyLowerRootMidi !== null
        ? ((currentPolyLowerRootMidi % 12) + 12) % 12 : 0;
      const pc = resolvePc(existingPc);
      let lowerRootMidi = 12 + pc + 3 * 12;
      while (lowerRootMidi > 48) lowerRootMidi -= 12;
      while (lowerRootMidi < 36) lowerRootMidi += 12;
      currentPolyLowerRootMidi = lowerRootMidi;
      currentPolyUpperRootMidi = lowerRootMidi + currentChord.lowerOffset;
      currentPolyLowerMidi = currentChord.lowerIntervals.map(i => currentPolyLowerRootMidi + i);
      currentPolyUpperMidi = currentChord.upperIntervals.map(i => currentPolyUpperRootMidi + i);
      currentMidiNotes = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
      currentChordRootMidi = currentPolyLowerRootMidi;

    } else if (currentChord.family === 'ust') {
      const existingPc = currentUSTRootMidi !== null ? currentUSTRootMidi % 12 : 0;
      const pc = resolvePc(existingPc);
      const rootMidi = 12 + pc + 4 * 12;
      currentUSTRootMidi = rootMidi;
      currentChordRootMidi = rootMidi;
      currentUSTShellMidi = currentChord.shellIntervals.map(i => rootMidi + i);
      const upperTriadRootMidi = rootMidi + currentChord.upperTriadRoot;
      currentUSTUpperMidi = currentChord.upperTriadIntervals.map(i => upperTriadRootMidi + i);
      currentUSTShellMidi = currentUSTShellMidi.map(m => m < 48 ? m + 12 : m);
      currentMidiNotes = [...currentUSTShellMidi, ...currentUSTUpperMidi];

    } else {
      // Normal chord (root position or inversion).
      // Back-compute root MIDI from the current bass note for inverted chords
      // so the pitch class is preserved correctly when the octave band changes.
      const baseIntervals = currentChord.invIndex !== undefined
        ? currentChord.baseChord.intervals : currentChord.intervals;
      const span    = baseIntervals[baseIntervals.length - 1];
      const absMin  = Math.ceil((28 - 12) / 12);
      const absMax  = Math.floor((96 - 12 - span) / 12);
      const defaultLo = span > 14 ? Math.max(3, absMin) : Math.max(2, absMin);
      const defaultHi = Math.min(5, absMax);
      const [lo, hi]  = resolveOctaveBand(pinnedOctave, defaultLo, defaultHi);
      const safeLo = Math.max(Math.min(lo, absMax), absMin);
      const safeHi = Math.max(Math.min(hi, absMax), safeLo);

      const existingRootMidi = (() => {
        if (!currentMidiNotes.length) return 12 + (pinnedRoot ?? 0) + safeLo * 12;
        if (currentChord.invIndex !== undefined) {
          const bassInterval = currentChord.baseChord.intervals[currentChord.invIndex];
          return currentMidiNotes[0] - bassInterval;
        }
        return currentMidiNotes[0];
      })();

      const existingPc = ((existingRootMidi % 12) + 12) % 12;
      const pc         = resolvePc(existingPc);
      const rootMidi   = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
      currentChordRootMidi = rootMidi;

      currentVoicingMode = resolveVoicingMode();
      const voicedMidi = applyVoicing(rootMidi, baseIntervals, currentVoicingMode);
      if (currentChord.invIndex !== undefined) {
        const sorted = [...voicedMidi].sort((a, b) => a - b);
        const invIdx = Math.min(currentChord.invIndex, sorted.length - 1);
        for (let i = 0; i < invIdx; i++) { const lo = sorted.shift(); sorted.push(lo + 12); }
        currentMidiNotes = sorted;
      } else {
        currentMidiNotes = voicedMidi;
      }
    }

  // ── Intervals ────────────────────────────────────────────────────────────────
  } else if (currentMode === 'intervals') {
    if (!currentInterval) return;
    const existingPc = currentIntervalMidi.length ? currentIntervalMidi[0] % 12 : 0;
    const pc = resolvePc(existingPc);
    const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
    const safeHi = Math.min(hi, Math.floor((96 - currentInterval.semitones) / 12) - 1);
    const safeLo = Math.min(lo, safeHi);
    const existingRootMidi = currentIntervalMidi.length ? currentIntervalMidi[0] : 12 + pc + safeLo * 12;
    const rootMidi = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
    currentIntervalMidi = [rootMidi, rootMidi + currentInterval.semitones];

  // ── Scales ───────────────────────────────────────────────────────────────────
  } else {
    if (!currentScale) return;
    const existingPc = currentScaleRootMidi !== undefined ? currentScaleRootMidi % 12 : 0;
    const pc   = resolvePc(existingPc);
    const span = currentScale.intervals[currentScale.intervals.length - 1];
    const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
    const safeHi = Math.min(hi, Math.floor((96 - span) / 12) - 1);
    const safeLo = Math.min(lo, safeHi);
    const existingRootMidi = currentScaleRootMidi ?? (12 + pc + safeLo * 12);
    currentScaleRootMidi = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
  }

  // ── Refresh UI ───────────────────────────────────────────────────────────────
  // In dict mode: always refresh. In quiz mode: only after answering.
  // showCurrentView() dispatches to chord or resolution view as appropriate.
  if (appMode === 'dict' || answered) {
    currentVoiceLeadingAnalysis = null; // root/voicing changed — force rebuild
    resolutionRootMidi = null;          // force re-derivation of resolution target
    showCurrentView();
    showBreakdown();
  }

  // Always update the root badge to reflect the new pitch class
  if (currentMode === 'chords' && currentChord) {
    updateRootBadge(appMode === 'dict' || answered ? getChordRootName() : (showRoot ? getChordRootName() : null));
  } else if (currentMode === 'intervals' && currentInterval) {
    const label = spelledNote(0, currentIntervalMidi[0] % 12, currentInterval.symbol);
    updateRootBadge(appMode === 'dict' || answered ? label : (showRoot ? label : null));
  } else if (currentMode === 'scales' && currentScale) {
    const label = spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol);
    updateRootBadge(appMode === 'dict' || answered ? label : (showRoot ? label : null));
  }
}

// ─── Quiz / Dictionary toggle ─────────────────────────────────────────────────

/**
 * Switches between quiz and dictionary application modes. Updates the Q/D toggle
 * button states, shows/hides score and session UI, and initialises the appropriate
 * pool panel and view for the current training mode.
 *
 * Always calls teardownProgressionUI() first to clean up any progression DOM
 * residue before rebuilding.
 *
 * @param {'quiz'|'dict'} mode - Target application mode.
 */
function setAppMode(mode) {
  if (typeof teardownProgressionUI === 'function') teardownProgressionUI();
  appMode = mode;

  document.getElementById('qdQuiz').classList.toggle('active', mode === 'quiz');
  document.getElementById('qdDict').classList.toggle('active', mode === 'dict');

  // Score pills and New Session are quiz-only UI
  const show = mode === 'quiz';
  document.getElementById('streakPill').style.display    = show ? '' : 'none';
  document.getElementById('scorePill').style.display     = show ? '' : 'none';
  document.getElementById('newSessionBtn').style.display = show ? '' : 'none';

  if (mode === 'dict') {
    if (currentMode === 'progressions') {
      // Progressions dict mode has its own pool panel and show function
      if (!dictProgSymbol) dictProgSymbol = PROGRESSIONS[0].symbol;
      const prog = PROGRESSIONS.find(p => p.symbol === dictProgSymbol) || PROGRESSIONS[0];
      renderDictProgressionPoolPanel();
      dictShowProgression(prog);
    } else {
      if (!dictSymbol) dictSymbol = dictDefaultSymbol();
      dictLoadSymbol(dictSymbol);
      renderDictPoolPanel();
      dictShow();
    }
  } else {
    document.getElementById('inversionChipRow').style.display = 'none';
    renderPoolPanel();
    answered = false;
    generateQuestion();
  }
}

// ─── Collapsible panel helper ─────────────────────────────────────────────────

/**
 * Wires a collapsible toggle for a header/body/arrow element triple.
 * Clicking the header toggles the `open` class on the body and updates
 * the arrow glyph. No-ops silently if any element is missing.
 *
 * @param {string} headerId - ID of the clickable header element.
 * @param {string} bodyId   - ID of the collapsible body element.
 * @param {string} arrowId  - ID of the ▸/▾ arrow indicator element.
 */
function makeCollapsible(headerId, bodyId, arrowId) {
  const header = document.getElementById(headerId);
  const body   = document.getElementById(bodyId);
  const arrow  = document.getElementById(arrowId);
  if (!header || !body || !arrow) return;
  header.addEventListener('click', () => {
    const open = body.classList.toggle('open');
    arrow.textContent = open ? '▾' : '▸';
  });
}

makeCollapsible('rootPanelHeader',      'rootPanelBody',      'rootPanelArrow');
makeCollapsible('notationPanelHeader',  'notationPanelBody',  'notationPanelArrow');
makeCollapsible('breakdownPanelHeader', 'breakdownPanelBody', 'breakdownPanelArrow');

// ─── Boot ─────────────────────────────────────────────────────────────────────

// Play button — dispatches to the correct playback function for the current mode.
// In chords mode while resolution view is active: plays source → pause → resolution.
document.getElementById('playBtn').addEventListener('click', () => {
  if (currentMode === 'intervals')         playInterval();
  else if (currentMode === 'scales')       playScale();
  else if (currentMode === 'progressions') playProgression();
  else if (currentMode === 'chords' && resolutionActive) {
    // Resolution view: play source → pause → resolution (same arc as entering resolution)
    const info = getResolutionInfo();
    if (!info || !piano) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const sourceMidi = getSourceMidi().sort((a, b) => a - b);
    setPlayingState(true);
    const now = audioCtx.currentTime;
    const srcDuration = 1.8, pause = 0.7;
    sourceMidi.forEach(m => piano.play(midiToSoundFontName(m), now, { duration: srcDuration, gain: 1.4 }));
    info.targetMidi.forEach(m => piano.play(midiToSoundFontName(m), now + srcDuration + pause, { duration: 2.2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), (srcDuration + pause + 2.2) * 1000);
  }
  else playChord();
});

// Quiz / Dict toggle buttons
document.getElementById('qdQuiz').addEventListener('click', () => setAppMode('quiz'));
document.getElementById('qdDict').addEventListener('click', () => setAppMode('dict'));

// Mode tabs
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

// Initial renders — pool panel, style chips, register panel
renderPoolPanel();
renderChordStyleChips();
renderIntervalStyleChips();
renderScaleDirChips();
renderRegisterPanel();

// Boot into dictionary mode — does not depend on audio being ready
setAppMode('dict');

// Root visibility toggle (Show Root checkbox)
document.getElementById('showRootChk').addEventListener('change', e => {
  showRoot = e.target.checked;
  // Re-show or hide badge based on current question state (only before answering)
  if (!answered) {
    if (currentMode === 'chords' && currentMidiNotes.length)
      updateRootBadge(showRoot ? getChordRootName() : null);
    else if (currentMode === 'intervals' && currentIntervalMidi.length)
      updateRootBadge(showRoot ? spelledNote(0, currentIntervalMidi[0] % 12, currentInterval.symbol) : null);
    else if (currentMode === 'scales' && currentScale)
      updateRootBadge(showRoot ? spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol) : null);
  }
});

// Session stats panel toggle
document.getElementById('statsToggle').addEventListener('click', () => {
  const panel = document.getElementById('statsPanel');
  const btn   = document.getElementById('statsToggle');
  const open  = panel.style.display === 'block';
  panel.style.display = open ? 'none' : 'block';
  btn.textContent     = open ? '▸ Session stats' : '▾ Session stats';
});

// New Session and Reset Stats both trigger a full session reset
document.getElementById('newSessionBtn').addEventListener('click', resetSession);
document.getElementById('resetStatsBtn').addEventListener('click', resetSession);

// Keyboard shortcuts — Space = play, Enter = Next button
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return; // ignore when typing in a search / input field

  if (e.code === 'Space') {
    e.preventDefault();
    if (currentMode === 'intervals')         playInterval();
    else if (currentMode === 'scales')       playScale();
    else if (currentMode === 'progressions') playProgression();
    else playChord();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const nb = document.getElementById('nextBtn');
    if (nb) nb.click();
  }
});

// ─── Theme ────────────────────────────────────────────────────────────────────

// Theme toggle — persisted to localStorage; defaults to dark for new users.
// Handles both desktop (#themeToggle) and mobile (#themeToggleMobile) buttons.
(function() {
  const root  = document.documentElement;
  const btns  = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile'),
  ].filter(Boolean);
  const DARK  = 'dark';
  const LIGHT = 'light';
  const stored = localStorage.getItem('earTrainerTheme');
  let theme = stored || DARK;
  if (theme === DARK) root.setAttribute('data-theme', DARK);

  function syncEmoji() {
    const emoji = theme === DARK ? '☀️' : '🌙';
    btns.forEach(b => { b.textContent = emoji; });
  }
  syncEmoji();

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      theme = theme === DARK ? LIGHT : DARK;
      root.setAttribute('data-theme', theme);
      syncEmoji();
      localStorage.setItem('earTrainerTheme', theme);
    });
  });
})();

// About mode — see js/modes/about-mode.js

// Initialise audio — races Soundfont.instrument() against a 12-second timeout
initAudio();

// ─── Layout ───────────────────────────────────────────────────────────────────

// Dynamic header offset — keeps body content clear of the sticky shell
// regardless of how tall the header grows (e.g. on text resize or mobile reflow).
(function() {
  const shell = document.getElementById('stickyShell');
  function syncPadding() {
    document.body.style.paddingTop = shell.offsetHeight + 'px';
  }
  syncPadding();
  window.addEventListener('resize', syncPadding);
})();

// Root panel — open by default on desktop, collapsed on mobile (≤ 600px).
(function() {
  if (window.matchMedia('(max-width: 600px)').matches) {
    const body  = document.getElementById('rootPanelBody');
    const arrow = document.getElementById('rootPanelArrow');
    body.classList.remove('open');
    arrow.textContent = '▸';
  }
})();

// Mobile button relocation — moves ℹ (About) and ? (Help) buttons from the
// desktop header into the score bar on narrow viewports, and restores them on
// resize back to desktop width. Debounced at 100ms to avoid thrashing on drag.
(function() {
  const aboutBtn       = document.getElementById('aboutBtn');
  const helpBtn        = document.getElementById('helpBtn');
  const headerBtnGroup = aboutBtn.parentElement; // the header flex div on desktop
  const scoreBar       = document.querySelector('.score-bar');
  const qdToggle       = document.getElementById('qdToggle');
  const mq             = window.matchMedia('(max-width: 600px)');

  function applyLayout(isMobile) {
    if (isMobile) {
      // Move into score bar, before the Quiz/Dict toggle
      scoreBar.insertBefore(aboutBtn, qdToggle);
      scoreBar.insertBefore(helpBtn,  qdToggle);
    } else {
      // Restore to header button group, before the theme toggle
      const themeToggle = document.getElementById('themeToggle');
      headerBtnGroup.insertBefore(aboutBtn, themeToggle);
      headerBtnGroup.insertBefore(helpBtn,  themeToggle);
    }
  }

  applyLayout(mq.matches);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => applyLayout(mq.matches), 100);
  });
})();

// @file-end — The Sound Travels Ear Training © 2026
