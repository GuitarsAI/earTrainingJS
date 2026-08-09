// ─── UI rendering ─────────────────────────────────────────────────────────────

// POINT 10: Build the granular pool panel for the current mode
function renderPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';

  if (currentMode === 'chords') renderChordPoolPanel(panel);
  else if (currentMode === 'intervals') renderIntervalPoolPanel(panel);
  else if (currentMode === 'progressions') renderProgressionPoolPanel(panel);
  else renderScalePoolPanel(panel);
}

function makePoolPanelShell(panel, title, metaFn) {
  const header = document.createElement('div');
  header.className = 'pool-panel-header';
  const left = document.createElement('span');
  left.className = 'pool-panel-title';
  left.textContent = title;
  const right = document.createElement('span');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '4px';
  const meta = document.createElement('span');
  meta.className = 'pool-panel-meta';
  const arrow = document.createElement('span');
  arrow.className = 'pool-panel-arrow';
  arrow.textContent = '▸';
  right.appendChild(meta);
  right.appendChild(arrow);
  header.appendChild(left);
  header.appendChild(right);

  const body = document.createElement('div');
  body.className = 'pool-panel-body';

  header.addEventListener('click', () => {
    const open = body.classList.toggle('open');
    arrow.textContent = open ? '▾' : '▸';
  });

  panel.appendChild(header);
  panel.appendChild(body);
  return { body, meta, updateMeta: metaFn ? () => { meta.textContent = metaFn(); } : () => {} };
}

// Add a global All / None row at the top of a pool panel body.
// allItems: flat array of all items across all sections for this mode.
// selectedSet: the shared Set for this mode.
// getAllChips: function returning all chip elements currently in the body.
// onChangeFn: called after every toggle.
function makeGlobalAllNone(body, allItems, selectedSet, getAllChips, onChangeFn) {
  const row = document.createElement('div');
  row.className = 'pool-global-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.padding = '4px 0 8px 0';

  const allBtn = document.createElement('button');
  allBtn.className = 'pool-all-btn';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    allItems.forEach(it => selectedSet.add(it.symbol));
    getAllChips().forEach(c => c.classList.add('active'));
    // Also update per-section counts by re-rendering — simplest: trigger onChangeFn
    // then re-render counts by querying count elements
    body.querySelectorAll('.pool-section-count').forEach(countEl => {
      const sec = countEl.closest('.pool-section');
      if (!sec) return;
      const chips = sec.querySelectorAll('.pool-chip');
      countEl.textContent = chips.length + ' / ' + chips.length;
    });
    onChangeFn();
  });

  const noneBtn = document.createElement('button');
  noneBtn.className = 'pool-all-btn';
  noneBtn.textContent = 'None';
  noneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    allItems.forEach(it => selectedSet.delete(it.symbol));
    getAllChips().forEach(c => c.classList.remove('active'));
    body.querySelectorAll('.pool-section-count').forEach(countEl => {
      const sec = countEl.closest('.pool-section');
      if (!sec) return;
      const chips = sec.querySelectorAll('.pool-chip');
      countEl.textContent = '0 / ' + chips.length;
    });
    onChangeFn();
  });

  row.appendChild(allBtn);
  row.appendChild(noneBtn);
  body.appendChild(row);
}

function makeSection(body, title, items, selectedSet, onChangeFn, collapsed = true) {
  const hasSelected = items.some(it => selectedSet.has(it.symbol));
  const startCollapsed = hasSelected ? false : collapsed;

  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';

  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = startCollapsed ? '▸' : '▾';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));

  const right = document.createElement('span');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  const countEl = document.createElement('span');
  countEl.className = 'pool-section-count';

  const allBtn = document.createElement('button');
  allBtn.className = 'pool-all-btn';
  allBtn.textContent = 'All';

  const noneBtn = document.createElement('button');
  noneBtn.className = 'pool-all-btn';
  noneBtn.textContent = 'None';

  right.appendChild(countEl);
  right.appendChild(allBtn);
  right.appendChild(noneBtn);
  hdr.appendChild(titleEl);
  hdr.appendChild(right);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (startCollapsed ? ' collapsed' : '');

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  // Toggle collapse on header click; stop propagation from buttons inside right
  hdr.addEventListener('click', (e) => {
    if (e.target === allBtn || e.target === noneBtn) return;
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedSet.add(it.symbol));
    chips.forEach(c => c.classList.add('active'));
    updateCount();
    onChangeFn();
  });

  noneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedSet.delete(it.symbol));
    chips.forEach(c => c.classList.remove('active'));
    updateCount();
    onChangeFn();
  });

  const chips = [];

  function updateCount() {
    const active = items.filter(it => selectedSet.has(it.symbol)).length;
    countEl.textContent = active + ' / ' + items.length;
  }

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip' + (selectedSet.has(item.symbol) ? ' active' : '');
    chip.textContent = item.name;
    chip.addEventListener('click', () => {
      if (selectedSet.has(item.symbol)) selectedSet.delete(item.symbol);
      else selectedSet.add(item.symbol);
      chip.classList.toggle('active', selectedSet.has(item.symbol));
      updateCount();
      onChangeFn();
    });
    chips.push(chip);
    chipsEl.appendChild(chip);
  });

  updateCount();
  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

function renderChordPoolPanel(panel) {
  const totalSelected = () => getActivePool().length + ' items';
  const { body } = makePoolPanelShell(panel, 'Training pool — Chords', totalSelected);

  // ── Section 1: Chord quality ───────────────────────────────────────────────
  _renderChordQualitySection(body);

  // ── Section 2: Voicing ────────────────────────────────────────────────────
  _renderVoicingSection(body);
}

function _renderChordQualitySection(body) {
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateChordQuestion();

  // Top-level label
  const groupHdr = document.createElement('div');
  groupHdr.className = 'pool-group-header';
  groupHdr.textContent = 'Chord quality';
  body.appendChild(groupHdr);

  // Global All / None for chord quality only
  const allChordItems = [
    ...CHORD_TYPES.major, ...CHORD_TYPES.minor, ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished, ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended,
    ...CHORD_TYPES.slash, ...CHORD_TYPES.poly, ...CHORD_TYPES.ust,
  ];
  makeGlobalAllNone(body, allChordItems, selectedChords,
    () => body.querySelectorAll('.chord-quality-chip'), onChange);

  // POINT 9b / 25 / 26 / 35: all family sections, all collapsed by default
  const makeQSection = (title, items) =>
    makeSection(body, title, items, selectedChords, onChange, true);

  makeQSection('Major',                   CHORD_TYPES.major);
  makeQSection('Minor',                   CHORD_TYPES.minor);
  makeQSection('Dominant',               CHORD_TYPES.dominant);
  makeQSection('Diminished',             CHORD_TYPES.diminished);
  makeQSection('Augmented',              CHORD_TYPES.augmented);
  makeQSection('Suspended / Other',      CHORD_TYPES.suspended);
  makeQSection('Slash chords',           CHORD_TYPES.slash);
  makeQSection('Polychords',             CHORD_TYPES.poly);
  makeQSection('UST — Dom7 shell (3 + ♭7)',  CHORD_TYPES.ust.filter(u => !u.shellQuality));
  makeQSection('UST — m7 shell (♭3 + ♭7)',   CHORD_TYPES.ust.filter(u => u.shellQuality === 'min'));
  makeQSection('UST — Maj7 shell (3 + 7)',    CHORD_TYPES.ust.filter(u => u.shellQuality === 'maj7'));

  // Inversions toggle
  const invRow = document.createElement('div');
  invRow.className = 'pool-inv-row';
  const invLabel = document.createElement('label');
  const invChk = document.createElement('input');
  invChk.type = 'checkbox';
  invChk.checked = includeInversions;
  invChk.addEventListener('change', () => {
    includeInversions = invChk.checked;
    appMode === 'dict' ? setAppMode('dict') : generateChordQuestion();
  });
  invLabel.appendChild(invChk);
  invLabel.appendChild(document.createTextNode(' Include inversions'));
  invRow.appendChild(invLabel);
  body.appendChild(invRow);
}

// ─── POINT 41: Voicing section in the chord pool panel ───────────────────────
//
// Quiz mode:        multi-select — user builds a voicing training pool (selectedVoicings Set)
// Dict/post-answer: single-select — selecting immediately re-voices and re-renders
//
// Random chip sits above the 4 groups, always visible.
// Groups 2–4 chips are wired but their algorithms stub to 'close' until Phases 2–4.

function _renderVoicingSection(body) {
  // Top-level label
  const groupHdr = document.createElement('div');
  groupHdr.className = 'pool-group-header';
  groupHdr.style.marginTop = '0.75rem';
  groupHdr.textContent = 'Voicing';
  body.appendChild(groupHdr);

  const isQuiz = appMode === 'quiz' && !answered;

  // ── Random chip — above all groups ──────────────────────────────────────
  const randomRow = document.createElement('div');
  randomRow.style.padding = '0 0 0.4rem 0';
  const randomChip = document.createElement('button');

  if (isQuiz) {
    // Quiz: Random means "pick from my selected pool each question"
    randomChip.className = 'pool-chip' + (selectedVoicings.has('random') ? ' active' : '');
    randomChip.textContent = 'Random';
    randomChip.title = 'Pick randomly from your selected voicings each question';
    randomChip.addEventListener('click', () => {
      if (selectedVoicings.has('random')) selectedVoicings.delete('random');
      else selectedVoicings.add('random');
      randomChip.classList.toggle('active', selectedVoicings.has('random'));
    });
  } else {
    // Dict/post-answer: Random means "pick from all 21 right now"
    randomChip.className = 'pool-chip' + (activeVoicingMode === 'random' ? ' active' : '');
    randomChip.textContent = 'Random';
    randomChip.title = 'Pick a random voicing from all options';
    randomChip.addEventListener('click', () => {
      activeVoicingMode = 'random';
      _syncVoicingChipActive(body);
      recomputeCurrentNotes();
    });
  }

  randomRow.appendChild(randomChip);
  body.appendChild(randomRow);

  // ── 4 collapsible groups ─────────────────────────────────────────────────
  const groups = [
    {
      label: 'Structural',
      symbols: ['close','open','spread','shell','rootless','drop2','drop3','drop24','piano'],
    },
    {
      label: 'Intervallic',
      symbols: ['quartal','quintal','secundal','cluster'],
    },
    {
      label: 'Style',
      symbols: ['so_what','bill_evans','kenny_barron','mccoy_tyner','pop_piano','gospel'],
    },
    {
      label: 'Texture',
      symbols: ['oct_double','dense_ext'],
    },
  ];

  groups.forEach(group => {
    const items = group.symbols.map(sym => VOICING_MODES.find(v => v.symbol === sym)).filter(Boolean);
    if (isQuiz) {
      _makeVoicingGroupQuiz(body, group.label, items);
    } else {
      _makeVoicingGroupDict(body, group.label, items);
    }
  });
}

// Quiz mode group — multi-select into selectedVoicings Set
function _makeVoicingGroupQuiz(body, title, items) {
  const hasSelected = items.some(v => selectedVoicings.has(v.symbol));

  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';
  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = hasSelected ? '▾' : '▸';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));

  const right = document.createElement('span');
  right.style.cssText = 'display:flex;align-items:center;gap:8px';
  const countEl = document.createElement('span');
  countEl.className = 'pool-section-count';

  const allBtn = document.createElement('button');
  allBtn.className = 'pool-all-btn';
  allBtn.textContent = 'All';
  const noneBtn = document.createElement('button');
  noneBtn.className = 'pool-all-btn';
  noneBtn.textContent = 'None';

  right.appendChild(countEl);
  right.appendChild(allBtn);
  right.appendChild(noneBtn);
  hdr.appendChild(titleEl);
  hdr.appendChild(right);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (hasSelected ? '' : ' collapsed');

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  hdr.addEventListener('click', e => {
    if (e.target === allBtn || e.target === noneBtn) return;
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  const chips = [];

  function updateCount() {
    const active = items.filter(v => selectedVoicings.has(v.symbol)).length;
    countEl.textContent = active + ' / ' + items.length;
  }

  allBtn.addEventListener('click', e => {
    e.stopPropagation();
    items.forEach(v => selectedVoicings.add(v.symbol));
    chips.forEach(c => c.classList.add('active'));
    updateCount();
  });
  noneBtn.addEventListener('click', e => {
    e.stopPropagation();
    items.forEach(v => selectedVoicings.delete(v.symbol));
    chips.forEach(c => c.classList.remove('active'));
    updateCount();
  });

  items.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip' + (selectedVoicings.has(v.symbol) ? ' active' : '');
    chip.textContent = v.name;
    chip.title = v.desc;
    chip.addEventListener('click', () => {
      if (selectedVoicings.has(v.symbol)) selectedVoicings.delete(v.symbol);
      else selectedVoicings.add(v.symbol);
      chip.classList.toggle('active', selectedVoicings.has(v.symbol));
      updateCount();
    });
    chips.push(chip);
    chipsEl.appendChild(chip);
  });

  updateCount();
  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

// Dict/post-answer mode group — single-select, immediate re-render
function _makeVoicingGroupDict(body, title, items) {
  const hasActive = items.some(v => v.symbol === activeVoicingMode);

  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';
  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = hasActive ? '▾' : '▸';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));
  hdr.appendChild(titleEl);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (hasActive ? '' : ' collapsed');

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  hdr.addEventListener('click', () => {
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  items.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip voicing-dict-chip' + (activeVoicingMode === v.symbol ? ' active' : '');
    chip.textContent = v.name;
    chip.title = v.desc;
    chip.dataset.voicingSymbol = v.symbol;
    chip.addEventListener('click', () => {
      activeVoicingMode = v.symbol;
      _syncVoicingChipActive(body);
      recomputeCurrentNotes();
    });
    chipsEl.appendChild(chip);
  });

  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

// Sync active state across all voicing chips in the panel after a selection
function _syncVoicingChipActive(body) {
  body.querySelectorAll('.voicing-dict-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.voicingSymbol === activeVoicingMode);
  });
  // Also sync the Random chip
  const randomChip = body.querySelector('.pool-chip:not(.voicing-dict-chip)');
  if (randomChip) randomChip.classList.toggle('active', activeVoicingMode === 'random');
}

function renderIntervalPoolPanel(panel) {
  const { body } = makePoolPanelShell(panel, 'Training pool — Intervals', null);
  // POINT 39: split into simple and compound sections — all collapsed by default
  const onChange39 = () => appMode === 'dict' ? setAppMode('dict') : generateIntervalQuestion();

  const allIntervalItems = [...INTERVALS];
  makeGlobalAllNone(body, allIntervalItems, selectedIntervals,
    () => body.querySelectorAll('.pool-chip'), onChange39);

  makeSection(body, 'Simple intervals',    INTERVALS.filter(i => !i.compound), selectedIntervals, onChange39, true);
  makeSection(body, 'Extended / Compound', INTERVALS.filter(i =>  i.compound), selectedIntervals, onChange39, true);
}

function renderScalePoolPanel(panel) {
  // POINT 28: Four groups by note count — all collapsed by default
  const pentatonic = SCALES.slice(0, 7);   // 5-note
  const hexatonic  = SCALES.slice(7, 11);  // 6-note
  const diatonic   = SCALES.slice(11, 23); // 7-note
  const octatonic  = SCALES.slice(23);     // 8-note
  const { body } = makePoolPanelShell(panel, 'Training pool — Scales', null);
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateScaleQuestion();

  const allScaleItems = [...SCALES];
  makeGlobalAllNone(body, allScaleItems, selectedScales,
    () => body.querySelectorAll('.pool-chip'), onChange);

  makeSectionWithDisplayName(body, 'Pentatonic (5 notes)',     pentatonic, selectedScales, onChange, true);
  makeSection(body, 'Hexatonic (6 notes)',                     hexatonic,  selectedScales, onChange, true);
  makeSection(body, 'Diatonic / Modal (7 notes)',              diatonic,   selectedScales, onChange, true);
  makeSection(body, 'Octatonic (8 notes)',                     octatonic,  selectedScales, onChange, true);
}

// Like makeSection but uses item.displayName for the chip label when present (POINT 27)
function makeSectionWithDisplayName(body, title, items, selectedSet, onChangeFn, collapsed = true) {
  const hasSelected = items.some(it => selectedSet.has(it.symbol));
  const startCollapsed = hasSelected ? false : collapsed;

  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';

  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = startCollapsed ? '▸' : '▾';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));

  const right = document.createElement('span');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  const countEl = document.createElement('span');
  countEl.className = 'pool-section-count';

  const allBtn = document.createElement('button');
  allBtn.className = 'pool-all-btn';
  allBtn.textContent = 'All';

  const noneBtn = document.createElement('button');
  noneBtn.className = 'pool-all-btn';
  noneBtn.textContent = 'None';

  right.appendChild(countEl);
  right.appendChild(allBtn);
  right.appendChild(noneBtn);
  hdr.appendChild(titleEl);
  hdr.appendChild(right);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (startCollapsed ? ' collapsed' : '');

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  hdr.addEventListener('click', (e) => {
    if (e.target === allBtn || e.target === noneBtn) return;
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedSet.add(it.symbol));
    chips.forEach(c => c.classList.add('active'));
    updateCount();
    onChangeFn();
  });

  noneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedSet.delete(it.symbol));
    chips.forEach(c => c.classList.remove('active'));
    updateCount();
    onChangeFn();
  });

  const chips = [];

  function updateCount() {
    const active = items.filter(it => selectedSet.has(it.symbol)).length;
    countEl.textContent = active + ' / ' + items.length;
  }

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip' + (selectedSet.has(item.symbol) ? ' active' : '');
    chip.textContent = item.displayName || item.name;
    chip.addEventListener('click', () => {
      if (selectedSet.has(item.symbol)) selectedSet.delete(item.symbol);
      else selectedSet.add(item.symbol);
      chip.classList.toggle('active', selectedSet.has(item.symbol));
      updateCount();
      onChangeFn();
    });
    chips.push(chip);
    chipsEl.appendChild(chip);
  });

  updateCount();
  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

// POINT 6: Render chord playback style chips
function renderChordStyleChips() {
  const row = document.getElementById('chordStyleRow');
  row.innerHTML = '';
  CHORD_PLAYBACK_STYLES.forEach(s => {
    const chip = document.createElement('button');
    chip.className = 'chord-style-chip' + (chordPlayStyle === s.symbol ? ' active' : '');
    chip.textContent = s.name;
    if (s.symbol === 'random') chip.title = 'Randomly picks block, ascending, descending or broken each time';
    chip.addEventListener('click', () => {
      chordPlayStyle = s.symbol;
      row.querySelectorAll('.chord-style-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const label = s.symbol === 'block' ? 'Play chord'
        : s.symbol === 'ascending'  ? 'Play chord (ascending)'
        : s.symbol === 'descending' ? 'Play chord (descending)'
        : s.symbol === 'broken'     ? 'Play chord (broken)'
        : 'Play chord (random style)';
      document.getElementById('playLabel').textContent = label;
      // POINT 32/33: update notation to mirror new style if currently visible.
      // For a concrete style, update immediately. For random, notation stays as
      // last-played until Play is hit — nothing to show until resolved.
      if (s.symbol !== 'random') {
        currentChordPlayStyle = s.symbol;
        if (appMode === 'dict' || answered) { showCurrentView(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}

// POINT 5: Render interval style selector chips
function renderIntervalStyleChips() {
  const row = document.getElementById('intervalStyleRow');
  row.innerHTML = '';
  INTERVAL_STYLES.forEach(s => {
    const chip = document.createElement('button');
    chip.className = 'style-chip' + (intervalStyle === s.symbol ? ' active' : '');
    chip.textContent = s.name;
    chip.addEventListener('click', () => {
      intervalStyle = s.symbol;
      row.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      // Update play label hint
      document.getElementById('playLabel').textContent =
        s.symbol === 'harmonic'   ? 'Play interval (together)'  :
        s.symbol === 'ascending'  ? 'Play interval (ascending)' :
        s.symbol === 'descending' ? 'Play interval (descending)':
                                    'Play interval (random style)'; // POINT 20b
      // POINT 33: update notation to mirror new style if currently visible
      if (s.symbol !== 'random') {
        currentIntervalStyle = s.symbol;
        if (appMode === 'dict' || answered) { showNotation(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}

// POINT 7: Render scale direction chips
function renderScaleDirChips() {
  const row = document.getElementById('scaleDirRow');
  row.innerHTML = '';
  SCALE_DIRECTIONS.forEach(d => {
    const chip = document.createElement('button');
    chip.className = 'scale-dir-chip' + (scaleDirection === d.symbol ? ' active' : '');
    chip.textContent = d.name;
    chip.addEventListener('click', () => {
      scaleDirection = d.symbol;
      row.querySelectorAll('.scale-dir-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const label = d.symbol === 'asc'    ? 'Play scale (ascending)'
                  : d.symbol === 'desc'   ? 'Play scale (descending)'
                  : d.symbol === 'both'   ? 'Play scale (ascending + descending)'
                  : 'Play scale (random direction)'; // POINT 20b
      document.getElementById('playLabel').textContent = label;
      // POINT 33: update notation to mirror new direction if currently visible
      if (d.symbol !== 'random') {
        currentScaleDir = d.symbol;
        if (appMode === 'dict' || answered) { showNotation(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}
