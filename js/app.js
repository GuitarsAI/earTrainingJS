function switchMode(mode) {
  if (typeof teardownProgressionUI === 'function') teardownProgressionUI(); // POINT 38: always clean up progression DOM before switching
  currentMode = mode;

  // Reset streak on mode switch
  streak = 0;
  document.getElementById('streak').textContent = 0;

  // Tab UI
  document.querySelectorAll('.mode-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });

  // POINT 10: Rebuild pool panel for new mode; show/hide playback style rows
  renderPoolPanel();
  document.getElementById('chordStyleSection').style.display    = mode === 'chords'       ? '' : 'none';
  document.getElementById('voicingModeSection').style.display   = mode === 'chords'       ? '' : 'none'; // POINT 23
  document.getElementById('intervalStyleSection').style.display = mode === 'intervals'    ? '' : 'none';
  document.getElementById('scaleDirSection').style.display      = mode === 'scales'       ? '' : 'none';

  // Play label
  document.getElementById('playLabel').textContent =
    mode === 'intervals'   ? 'Play interval (together)'
    : mode === 'scales'    ? 'Play scale (ascending)'
    : mode === 'progressions' ? 'Play progression'
    : 'Play chord';

  updateRootBadge(null);  // clear badge until new question sets it
  if (appMode === 'dict') {
    dictSymbol = null; // reset so default for new mode is picked
    setAppMode('dict');
  } else {
    generateQuestion();
  }
}

// POINT 12: Render root note and octave register chip rows
function renderRegisterPanel() {
  // Full chromatic list with both enharmonic spellings for each accidental pitch class.
  // Each entry: { label, value (pitch class 0-11 or null), spelling ('sharp'|'flat'|null) }
  const ROOT_OPTIONS = [
    { label: 'Rnd',        value: null, spelling: null    },
    { label: 'C',          value: 0,   spelling: null     },
    { label: 'C\u266f',   value: 1,   spelling: 'sharp'  },
    { label: 'D\u266d',   value: 1,   spelling: 'flat'   },
    { label: 'D',          value: 2,   spelling: null     },
    { label: 'D\u266f',   value: 3,   spelling: 'sharp'  },
    { label: 'E\u266d',   value: 3,   spelling: 'flat'   },
    { label: 'E',          value: 4,   spelling: null     },
    { label: 'F',          value: 5,   spelling: null     },
    { label: 'F\u266f',   value: 6,   spelling: 'sharp'  },
    { label: 'G\u266d',   value: 6,   spelling: 'flat'   },
    { label: 'G',          value: 7,   spelling: null     },
    { label: 'G\u266f',   value: 8,   spelling: 'sharp'  },
    { label: 'A\u266d',   value: 8,   spelling: 'flat'   },
    { label: 'A',          value: 9,   spelling: null     },
    { label: 'A\u266f',   value: 10,  spelling: 'sharp'  },
    { label: 'B\u266d',   value: 10,  spelling: 'flat'   },
    { label: 'B',          value: 11,  spelling: null     },
  ];
  const OCTAVE_OPTIONS = [
    { label: 'Rnd',  value: null   },
    { label: 'Low',  value: 'low'  },
    { label: 'Mid',  value: 'mid'  },
    { label: 'High', value: 'high' },
  ];

  // Root chips — custom handler to also set pinnedRootSpelling
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

  // Octave chips — unchanged
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

// ─── POINT 19: Settings panel toggle ────────────────────────────────────────────
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

// Full catalogs — all items regardless of quiz pool selection
// NOTE: getAllChords() is defined in helpers.js
function getAllIntervals() { return [...INTERVALS]; }
function getAllScales()    { return [...SCALES]; }

function dictFullCatalog() {
  if (currentMode === 'chords')    return getAllChords();
  if (currentMode === 'intervals') return getAllIntervals();
  return getAllScales();
}

// dictSymbol: currently selected symbol ('_random' or an item symbol)
let dictSymbol = null;
// dictInversionIndex: inversion shown in dict mode (0 = root position)
let dictInversionIndex = 0;

function dictDefaultSymbol() {
  const catalog = dictFullCatalog();
  return catalog.length ? catalog[0].symbol : null;
}

// Load state for a given symbol from the full catalog
function dictLoadSymbol(symbol) {
  if (!symbol) return;
  dictSymbol = symbol;
  const catalog = dictFullCatalog();

  if (currentMode === 'chords') {
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(c => c.symbol === symbol);
    if (!item) return;
    currentChord = item;
    // Reset all special-chord state
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
      // Normal chord path
      const rootMidi = chooseSimpleRootMidi(Math.max(...item.intervals.map(Math.abs)));
      currentChordRootMidi = rootMidi;
      currentVoicingMode = resolveVoicingMode();
      const voicedIntervals = applyVoicingMode(item.intervals, currentVoicingMode);
      currentMidiNotes = applyInversion(voicedIntervals, rootMidi, Math.min(dictInversionIndex, voicedIntervals.length - 1));
    }

  } else if (currentMode === 'intervals') {
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(i => i.symbol === symbol);
    if (!item) return;
    currentInterval = item;
    currentIntervalStyle = resolveIntervalStyle();
    const rootMidi = chooseSimpleRootMidi(item.semitones);
    currentIntervalMidi = [rootMidi, rootMidi + item.semitones];

  } else {
    const item = symbol === '_random' ? pickRandom(catalog) : catalog.find(s => s.symbol === symbol);
    if (!item) return;
    currentScale = item;
    currentScaleRootMidi = chooseSimpleRootMidi(item.intervals[item.intervals.length - 1]);
    currentScaleDir = resolveScaleDir();
    scaleKeySigMode = 'key';
  }
}

// Render the pool panel in dictionary mode — same groups as quiz, single-select, no All/None
function renderDictPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';

  // Reuse makePoolPanelShell with a dict title; open by default
  let title = currentMode === 'chords' ? 'Dictionary — Chords'
            : currentMode === 'intervals' ? 'Dictionary — Intervals'
            : 'Dictionary — Scales';
  const { body } = makePoolPanelShell(panel, title, null);
  // Dict pool panel starts collapsed like everything else (Point 33b)

  if (currentMode === 'chords') {
    // Open by default: Major, Minor, Diminished, Augmented — matches quiz mode
    makeDictSection(body, 'Major',                  CHORD_TYPES.major,      false, false);
    makeDictSection(body, 'Minor',                  CHORD_TYPES.minor,      false, false);
    makeDictSection(body, 'Dominant',               CHORD_TYPES.dominant,   false, true);
    makeDictSection(body, 'Diminished',             CHORD_TYPES.diminished, false, false);
    makeDictSection(body, 'Augmented',              CHORD_TYPES.augmented,  false, false);
    makeDictSection(body, 'Suspended / Other',      CHORD_TYPES.suspended,  false, true);
    makeDictSection(body, 'Slash chords',           CHORD_TYPES.slash,      false, true);
    makeDictSection(body, 'Polychords',             CHORD_TYPES.poly,       false, true);
    // POINT 35: UST split by shell family
    makeDictSection(body, 'UST — Dom7 shell (3 + ♭7)',  CHORD_TYPES.ust.filter(u => !u.shellQuality),        false, true);
    makeDictSection(body, 'UST — m7 shell (♭3 + ♭7)',   CHORD_TYPES.ust.filter(u => u.shellQuality === 'min'),  false, true);
    makeDictSection(body, 'UST — Maj7 shell (3 + 7)',    CHORD_TYPES.ust.filter(u => u.shellQuality === 'maj7'), false, true);
  } else if (currentMode === 'intervals') {
    // POINT 39: split into simple and compound
    makeDictSection(body, 'Simple intervals',    INTERVALS.filter(i => !i.compound), false, false);
    makeDictSection(body, 'Extended / Compound', INTERVALS.filter(i =>  i.compound), false, true);
  } else {
    makeDictSection(body, 'Pentatonic (5 notes)',       SCALES.slice(0, 7),  true);
    makeDictSection(body, 'Hexatonic (6 notes)',        SCALES.slice(7, 11));
    makeDictSection(body, 'Diatonic / Modal (7 notes)', SCALES.slice(11, 23));
    makeDictSection(body, 'Octatonic (8 notes)',        SCALES.slice(23));
  }
}

// Build one section of chips for dict mode — single-select, no All/None buttons
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
      panel_deactivateAllDictChips();
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

function panel_deactivateAllDictChips() {
  document.querySelectorAll('#poolPanel .pool-chip').forEach(c => c.classList.remove('active'));
}

// Apply a specific inversion index in dict or post-answer quiz mode and refresh the display
function dictApplyInversion(invIdx) {
  if (!currentChord || currentChord.family === 'slash' || currentChord.family === 'poly' || currentChord.family === 'ust') return;
  dictInversionIndex = invIdx;
  const baseChord      = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const baseIntervals  = baseChord.intervals;
  const voicedIntervals = applyVoicingMode(baseIntervals, currentVoicingMode);
  currentMidiNotes = applyInversion(voicedIntervals, currentChordRootMidi, Math.min(invIdx, voicedIntervals.length - 1));
  answered = true;
  // Update notation chord name label to reflect the selected inversion
  const INV_LABELS = ['', ' — 1st inv', ' — 2nd inv', ' — 3rd inv', ' — 4th inv'];
  const invLabel = INV_LABELS[invIdx] || '';
  document.getElementById('notationChordName').textContent =
    getChordRootName() + ' ' + baseChord.name + invLabel;
  // Re-render notation SVG and breakdown without rebuilding the whole showNotation header logic
  const sym = baseChord.symbol;
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

// Render inversion chips in the notation area (after answering in quiz, always in dict)
function renderInversionChips() {
  const row = document.getElementById('inversionChipRow');
  row.innerHTML = '';

  // Only show for normal chords, not slash/poly/UST, not intervals/scales
  const hide = currentMode !== 'chords'
    || !currentChord
    || currentChord.family === 'slash'
    || currentChord.family === 'poly'
    || currentChord.family === 'ust';

  if (hide) { row.style.display = 'none'; return; }

  const baseChord  = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const noteCount  = baseChord.intervals.length;
  const maxInv     = noteCount - 1;

  if (maxInv < 1) { row.style.display = 'none'; return; }

  // In quiz mode: start at the inversion that was actually quizzed.
  // In dict mode: use dictInversionIndex (persists between chip clicks).
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

// Reveal notation + breakdown immediately; play area moves below breakdown in dict mode
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

  answered = true; // so showNotation + showBreakdown render without restriction
  resolutionActive = false; // POINT 37: reset so notation shows current chord, not resolution
  resolutionRootMidi = null; // reset stored root so new chord computes fresh
  showNotation();
  renderInversionChips();
  showBreakdown();

  // Play area stays in its fixed HTML position — no DOM move needed

  // Hear Slowly button in controls area
  const c = document.getElementById('controls');
  c.innerHTML = '';
  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playSlowly);
  c.appendChild(sb);
  // POINT 37: Resolve ↔ Chord toggle in dict mode (chord mode only)
  if (currentMode === 'chords') {
    const rb = document.createElement('button');
    rb.className = 'ctrl-btn resolve';
    rb.id = 'resolveBtn';
    rb.textContent = resolutionActive ? '← Chord' : 'Resolve →';
    rb.addEventListener('click', playResolution);
    c.appendChild(rb);
  }
}

// Switch between quiz and dictionary app modes
function setAppMode(mode) {
  if (typeof teardownProgressionUI === 'function') teardownProgressionUI(); // POINT 38: always clean up progression DOM before switching
  appMode = mode;

  document.getElementById('qdQuiz').classList.toggle('active', mode === 'quiz');
  document.getElementById('qdDict').classList.toggle('active', mode === 'dict');

  const show = mode === 'quiz';
  document.getElementById('streakPill').style.display    = show ? '' : 'none';
  document.getElementById('scorePill').style.display     = show ? '' : 'none';
  document.getElementById('newSessionBtn').style.display = show ? '' : 'none';

  if (mode === 'dict') {
    if (currentMode === 'progressions') {
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

// ─── Collapsible panel toggle helper ─────────────────────────────────────────
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

document.getElementById('playBtn').addEventListener('click', () => {
  if (currentMode === 'intervals')    playInterval();
  else if (currentMode === 'scales')  playScale();
  else if (currentMode === 'progressions') playProgression();
  else if (currentMode === 'chords' && resolutionActive) {
    // In resolution view: play source → pause → resolution (same as entering resolution)
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

document.getElementById('qdQuiz').addEventListener('click', () => setAppMode('quiz'));
document.getElementById('qdDict').addEventListener('click', () => setAppMode('dict'));

document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

renderPoolPanel(); // POINT 10
renderChordStyleChips();
renderVoicingChips();  // POINT 23
renderIntervalStyleChips();
renderScaleDirChips();
renderRegisterPanel(); // POINT 12

// POINT 37 / Mobile: boot into dictionary mode immediately — does not depend on audio
setAppMode('dict');

// POINT 8: Root toggle
document.getElementById('showRootChk').addEventListener('change', e => {
  showRoot = e.target.checked;
  // Re-show or hide badge based on current question (only before answering)
  if (!answered) {
    if (currentMode === 'chords' && currentMidiNotes.length)
      updateRootBadge(showRoot ? getChordRootName() : null);
    else if (currentMode === 'intervals' && currentIntervalMidi.length)
      updateRootBadge(showRoot ? spelledNote(0, currentIntervalMidi[0] % 12, currentInterval.symbol) : null);
    else if (currentMode === 'scales' && currentScale)
      updateRootBadge(showRoot ? spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol) : null);
  }
});

// POINT 8: Stats panel toggle
document.getElementById('statsToggle').addEventListener('click', () => {
  const panel = document.getElementById('statsPanel');
  const btn = document.getElementById('statsToggle');
  const open = panel.style.display === 'block';
  panel.style.display = open ? 'none' : 'block';
  btn.textContent = open ? '▸ Session stats' : '▾ Session stats';
});

// POINT 20.5: New Session button + reset stats button both call full reset
document.getElementById('newSessionBtn').addEventListener('click', resetSession);
document.getElementById('resetStatsBtn').addEventListener('click', resetSession);

// POINT 8: Keyboard shortcuts — Space=play, 1–4=answer, Enter=next
document.addEventListener('keydown', e => {
  // Ignore when typing in an input
  if (e.target.tagName === 'INPUT') return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (currentMode === 'intervals')        playInterval();
    else if (currentMode === 'scales')      playScale();
    else if (currentMode === 'progressions') playProgression();
    else playChord();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const nb = document.getElementById('nextBtn');
    if (nb) nb.click();
  }
  // POINT 11: 1-4 shortcut removed; answer via dropdown
});

// ─── POINT 16: Theme toggle ───────────────────────────────────────────────────
(function() {
  const root   = document.documentElement;
  const btns   = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile'),
  ].filter(Boolean); // guard against missing elements
  const DARK   = 'dark';
  const LIGHT  = 'light';
  const stored = localStorage.getItem('earTrainerTheme');
  let theme = stored || LIGHT;
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

initAudio();

// ── Dynamic header offset — keeps body clear of sticky shell regardless of height ──
(function() {
  const shell = document.getElementById('stickyShell');
  function syncPadding() {
    document.body.style.paddingTop = shell.offsetHeight + 'px';
  }
  syncPadding();
  window.addEventListener('resize', syncPadding);
})();

// ── Root panel: open on desktop, collapsed on mobile ──
(function() {
  if (window.matchMedia('(max-width: 600px)').matches) {
    const body  = document.getElementById('rootPanelBody');
    const arrow = document.getElementById('rootPanelArrow');
    body.classList.remove('open');
    arrow.textContent = '▸';
  }
})();


