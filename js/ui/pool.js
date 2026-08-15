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
  _renderChordSubGroups(body);
}

// Shared by renderChordPoolPanel (quiz) and renderDictPoolPanel (dict).
// Builds the two collapsible sub-groups — Chord quality and Voicing — and
// delegates to the mode-aware section renderers.
function _renderChordSubGroups(body) {
  // ── Sub-group 1: Chord quality ─────────────────────────────────────────────
  const qualityGroup = _makeSubGroup(body, 'Chord quality');
  _renderChordQualitySection(qualityGroup);

  // ── Sub-group 2: Voicing ───────────────────────────────────────────────────
  const voicingGroup = _makeSubGroup(body, 'Voicing');
  _renderVoicingSection(voicingGroup);
}

// Build a collapsible sub-group container inside `body`.
// Returns the inner body div that section renderers should append into.
// Starts collapsed by default.
function _makeSubGroup(body, title) {
  const wrap = document.createElement('div');
  wrap.className = 'pool-subgroup';
  wrap.style.cssText = 'margin-top:0.5rem;border:1px solid var(--border);border-radius:10px;overflow:hidden;';

  const hdr = document.createElement('div');
  hdr.className = 'pool-subgroup-header';
  hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0.45rem 0.75rem;cursor:pointer;background:var(--panel-bg);user-select:none;';

  const titleEl = document.createElement('span');
  titleEl.style.cssText = 'font-weight:600;font-size:0.82rem;letter-spacing:0.04em;text-transform:uppercase;color:var(--text-secondary);';
  titleEl.textContent = title;

  const arrow = document.createElement('span');
  arrow.className = 'pool-panel-arrow';
  arrow.textContent = '▸';

  hdr.appendChild(titleEl);
  hdr.appendChild(arrow);

  const innerBody = document.createElement('div');
  innerBody.className = 'pool-subgroup-body';
  innerBody.style.cssText = 'display:none;padding:0.5rem 0.5rem 0.25rem;';

  hdr.addEventListener('click', () => {
    const open = innerBody.style.display === 'none';
    innerBody.style.display = open ? '' : 'none';
    arrow.textContent = open ? '▾' : '▸';
  });

  wrap.appendChild(hdr);
  wrap.appendChild(innerBody);
  body.appendChild(wrap);
  return innerBody;
}

// Display titles for known CHORD_TYPES family keys.
// Any key not listed here gets a capitalised fallback (e.g. 'classical' -> 'Classical').
const CHORD_FAMILY_TITLES = {
  major:      'Major',
  minor:      'Minor',
  dominant:   'Dominant',
  diminished: 'Diminished',
  augmented:  'Augmented',
  suspended:  'Suspended / Other',
  classical:  'Classical (Neapolitan + Aug 6ths)',
  slash:      'Slash chords',
  poly:       'Polychords',
  quartal:    'Quartal / Quintal',
  cluster:    'Cluster / Secundal',
};

// Display titles for UST subFamily values.
const UST_SUBFAMILY_TITLES = {
  dom7: 'UST \u2014 Dom7 shell (3 + \u266d7)',
  min:  'UST \u2014 m7 shell (\u266d3 + \u266d7)',
  maj7: 'UST \u2014 Maj7 shell (3 + 7)',
};

function _familyTitle(key) {
  return CHORD_FAMILY_TITLES[key] || (key.charAt(0).toUpperCase() + key.slice(1));
}

// Build the flat list of { title, items } sections from CHORD_TYPES.
// Families whose entries carry a subFamily field are split into one section per subFamily
// value, preserving the order in which subFamily values first appear in the array.
function _buildChordFamilies() {
  const sections = [];
  const isBasic = appDifficulty === 'basic';
  for (const [key, entries] of Object.entries(CHORD_TYPES)) {
    // POINT 50: in Basic mode filter to basic:true entries only; skip empty families entirely
    const filtered = isBasic ? entries.filter(e => e.basic) : entries;
    if (filtered.length === 0) continue;

    const hasSubFamilies = filtered.some(e => e.subFamily);
    if (hasSubFamilies) {
      const seen = new Map();
      filtered.forEach(e => {
        if (!e.subFamily) return;
        if (!seen.has(e.subFamily)) seen.set(e.subFamily, []);
        seen.get(e.subFamily).push(e);
      });
      seen.forEach((items, sf) => {
        sections.push({ title: UST_SUBFAMILY_TITLES[sf] || sf, items });
      });
    } else {
      sections.push({ title: _familyTitle(key), items: filtered });
    }
  }
  return sections;
}

function _renderChordQualitySection(body) {
  const isQuiz = appMode === 'quiz';
  const FAMILIES = _buildChordFamilies();

  if (isQuiz) {
    // ── Quiz: multi-select, All/None, inversions checkbox ─────────────────
    const onChange = () => generateChordQuestion();

    const allChordItems = FAMILIES.flatMap(f => f.items);
    makeGlobalAllNone(body, allChordItems, selectedChords,
      () => body.querySelectorAll('.pool-chip'), onChange);

    FAMILIES.forEach(f => makeSection(body, f.title, f.items, selectedChords, onChange, true));

    // Inversions toggle — quiz only
    const invRow = document.createElement('div');
    invRow.className = 'pool-inv-row';
    const invLabel = document.createElement('label');
    const invChk = document.createElement('input');
    invChk.type = 'checkbox';
    invChk.checked = includeInversions;
    invChk.addEventListener('change', () => {
      includeInversions = invChk.checked;
      generateChordQuestion();
    });
    invLabel.appendChild(invChk);
    invLabel.appendChild(document.createTextNode(' Include inversions'));
    invRow.appendChild(invLabel);
    body.appendChild(invRow);

  } else {
    // ── Dict: single-select, no All/None, clicking loads chord immediately ─
    FAMILIES.forEach(f => {
      // Expand the section if it contains the currently selected chord
      const hasActive = f.items.some(item => item.symbol === dictSymbol);
      makeDictSection(body, f.title, f.items, false, !hasActive);
    });
  }
}

// ─── POINT 41: Voicing section in the chord pool panel ───────────────────────
//
// Quiz mode:        multi-select — user builds a voicing training pool (selectedVoicings Set)
// Dict/post-answer: single-select — selecting immediately re-voices and re-renders
//
// Random chip sits above the 6 groups, always visible.
// All 63 algorithms are implemented in voicings.js.

// ─── POINT 41: Voicing section ────────────────────────────────────────────────
//
// Quiz before answering — multi-select:
//   Global All/None (covers all 63 voicings + Random)
//   All/None per sub-section (Position, Doubling, Shell/Rootless, Drop, Intervallic, Style)
//   Random is a regular chip in the pool, toggled like any other
//   No immediate re-render — selectedVoicings Set is updated; engine picks at next question
//
// Quiz post-answer + Dict — single-select:
//   Clicking any chip (including Random) immediately re-voices and re-renders
//   No All/None buttons
//   Random picks from all 63 instantly via recomputeCurrentNotes()

const VOICING_GROUPS = [
  {
    label: 'Position',
    basic: true,
    symbols: ['close','open','spread'],
  },
  {
    label: 'Doubling',
    basic: true,
    symbols: ['dbl_root_oct','dbl_root_above5','dbl_fifth','dbl_root_wrap'],
  },
  {
    label: 'Shell / Rootless',
    symbols: [
      'shell','shell_alt','shell_rootless',
      'tn_maj_135','tn_maj_357','tn_maj_137',
      'tn_dom_13b7','tn_dom_35b7','tn_dom_3b79',
      'tn_min_1b3b7','tn_min_b35b7','tn_min_b3b79',
      'rl_maj7','rl_maj7_ext','rl_min7','rl_dom7',
      'rl_alt_a','rl_alt_b','rl_alt_c','rl_alt_d','rl_sharp9',
      'sus_voicing','phrygian',
      'sixth_maj','sixth_min','sixth_nine','rl_sixth_nine',
    ],
  },
  {
    label: 'Drop',
    symbols: ['drop2','drop3','drop24','drop23'],
  },
  {
    label: 'Intervallic',
    symbols: ['quartal','quintal','secundal','cluster_chrom','cluster_diaton','cluster_pent','cluster_wt','cluster_modal'],
  },
  {
    label: 'Style',
    symbols: [
      'so_what','evans_a','evans_b','kenny_barron','mccoy_tyner',
      'pop_piano','gospel','oct_bass_triad','oct_bass_7th','open5_triad',
      'block_close','block_locked','four_way_close','block_drop2',
      'oct_melody_inner','pedal_point','spread_2h',
    ],
  },
];

// All voicing symbols including Random — used for global All/None
const ALL_VOICING_SYMBOLS = ['random', ...VOICING_GROUPS.flatMap(g => g.symbols)];

function _renderVoicingSection(body) {
  const isMulti = appMode === 'quiz' && !answered; // true = multi-select; false = single-select

  if (isMulti) {
    _renderVoicingMulti(body);
  } else {
    _renderVoicingSingle(body);
  }
}

// ── Multi-select (quiz before answering) ──────────────────────────────────────

function _renderVoicingMulti(body) {
  // Global All / None — covers Random + all 63 concrete voicings
  const globalRow = document.createElement('div');
  globalRow.style.cssText = 'display:flex;gap:8px;padding:4px 0 8px 0;';

  const globalAllBtn  = _makeAllNoneBtn('All');
  const globalNoneBtn = _makeAllNoneBtn('None');

  // Keep refs to all chip elements so global buttons can sync them
  const allChipRefs = []; // { symbol, chipEl }

  // POINT 50: in Basic mode All/None only covers basic voicing symbols
  const visibleVoicingSymbols = appDifficulty === 'basic'
    ? VOICING_GROUPS.filter(g => g.basic).flatMap(g => g.symbols)
    : ALL_VOICING_SYMBOLS;

  globalAllBtn.addEventListener('click', e => {
    e.stopPropagation();
    visibleVoicingSymbols.forEach(sym => selectedVoicings.add(sym));
    allChipRefs.forEach(({ chipEl }) => chipEl.classList.add('active'));
    _updateAllSectionCounts(body);
  });
  globalNoneBtn.addEventListener('click', e => {
    e.stopPropagation();
    visibleVoicingSymbols.forEach(sym => selectedVoicings.delete(sym));
    allChipRefs.forEach(({ chipEl }) => chipEl.classList.remove('active'));
    _updateAllSectionCounts(body);
  });

  globalRow.appendChild(globalAllBtn);
  globalRow.appendChild(globalNoneBtn);
  body.appendChild(globalRow);

  // ── Random chip — treated as a regular pool member ───────────────────────
  const randomSec = document.createElement('div');
  randomSec.className = 'pool-section voicing-section';
  randomSec.dataset.voicingSection = 'random';

  const randomChipsEl = document.createElement('div');
  randomChipsEl.className = 'pool-chips';
  randomChipsEl.style.marginBottom = '0.4rem';

  const randomChip = document.createElement('button');
  randomChip.className = 'pool-chip voicing-multi-chip' + (selectedVoicings.has('random') ? ' active' : '');
  randomChip.textContent = 'Random';
  randomChip.title = 'Pick randomly from your selected voicings each question';
  randomChip.dataset.voicingSymbol = 'random';
  randomChip.addEventListener('click', () => {
    if (selectedVoicings.has('random')) selectedVoicings.delete('random');
    else selectedVoicings.add('random');
    randomChip.classList.toggle('active', selectedVoicings.has('random'));
    _updateSectionCount(randomSec, ['random']);
  });
  allChipRefs.push({ symbol: 'random', chipEl: randomChip });
  randomChipsEl.appendChild(randomChip);
  randomSec.appendChild(randomChipsEl);
  body.appendChild(randomSec);

  // ── 6 collapsible groups ─────────────────────────────────────────────────
  const visibleGroups = appDifficulty === 'basic'
    ? VOICING_GROUPS.filter(g => g.basic)
    : VOICING_GROUPS;

  visibleGroups.forEach(group => {
    const items = group.symbols
      .map(sym => VOICING_MODES.find(v => v.symbol === sym))
      .filter(Boolean);

    const groupChipRefs = _makeVoicingGroupMulti(body, group.label, items, allChipRefs);
    // groupChipRefs already pushed into allChipRefs inside the function
    void groupChipRefs;
  });
}

// Build one collapsible multi-select group; pushes chip refs into allChipRefs
function _makeVoicingGroupMulti(body, title, items, allChipRefs) {
  const hasSelected = items.some(v => selectedVoicings.has(v.symbol));

  const sec = document.createElement('div');
  sec.className = 'pool-section voicing-section';
  sec.dataset.voicingSection = title;

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
  countEl.dataset.voicingCount = title;

  const allBtn  = _makeAllNoneBtn('All');
  const noneBtn = _makeAllNoneBtn('None');

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
    const collapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = collapsed ? '▸' : '▾';
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
    chip.className = 'pool-chip voicing-multi-chip' + (selectedVoicings.has(v.symbol) ? ' active' : '');
    chip.textContent = v.name;
    chip.title = v.desc;
    chip.dataset.voicingSymbol = v.symbol;
    chip.addEventListener('click', () => {
      if (selectedVoicings.has(v.symbol)) selectedVoicings.delete(v.symbol);
      else selectedVoicings.add(v.symbol);
      chip.classList.toggle('active', selectedVoicings.has(v.symbol));
      updateCount();
    });
    chips.push(chip);
    allChipRefs.push({ symbol: v.symbol, chipEl: chip });
    chipsEl.appendChild(chip);
  });

  updateCount();
  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
  return chips;
}

// ── Single-select (dict + quiz post-answer) ───────────────────────────────────

function _renderVoicingSingle(body) {
  // Random chip — immediate re-voice
  const randomRow = document.createElement('div');
  randomRow.style.padding = '0 0 0.4rem 0';

  const randomChip = document.createElement('button');
  randomChip.className = 'pool-chip voicing-single-chip' + (activeVoicingMode === 'random' ? ' active' : '');
  randomChip.textContent = 'Random';
  randomChip.title = 'Pick a random voicing from all options';
  randomChip.dataset.voicingSymbol = 'random';
  randomChip.addEventListener('click', () => {
    activeVoicingMode = 'random';
    _syncVoicingChipActive(body);
    recomputeCurrentNotes();
  });
  randomRow.appendChild(randomChip);
  body.appendChild(randomRow);

  // 6 collapsible groups — single-select; POINT 50: basic mode shows Position + Doubling only
  const visibleGroups = appDifficulty === 'basic'
    ? VOICING_GROUPS.filter(g => g.basic)
    : VOICING_GROUPS;

  visibleGroups.forEach(group => {
    const items = group.symbols
      .map(sym => VOICING_MODES.find(v => v.symbol === sym))
      .filter(Boolean);
    _makeVoicingGroupSingle(body, group.label, items);
  });
}

function _makeVoicingGroupSingle(body, title, items) {
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
    const collapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = collapsed ? '▸' : '▾';
  });

  items.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip voicing-single-chip' + (activeVoicingMode === v.symbol ? ' active' : '');
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

// ── Shared helpers ────────────────────────────────────────────────────────────

function _makeAllNoneBtn(label) {
  const btn = document.createElement('button');
  btn.className = 'pool-all-btn';
  btn.textContent = label;
  return btn;
}

// Sync active class across all single-select voicing chips after a selection
function _syncVoicingChipActive(body) {
  body.querySelectorAll('.voicing-single-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.voicingSymbol === activeVoicingMode);
  });
}

// Update count display for all voicing group sections in multi-select mode
function _updateAllSectionCounts(body) {
  VOICING_GROUPS.forEach(group => {
    const sec = body.querySelector(`.voicing-section[data-voicing-section="${group.label}"]`);
    if (!sec) return;
    const countEl = sec.querySelector('.pool-section-count');
    if (!countEl) return;
    const active = group.symbols.filter(sym => selectedVoicings.has(sym)).length;
    countEl.textContent = active + ' / ' + group.symbols.length;
  });
}

// Update count for a single section given its symbol list
function _updateSectionCount(sec, symbols) {
  const countEl = sec.querySelector('.pool-section-count');
  if (!countEl) return;
  const active = symbols.filter(sym => selectedVoicings.has(sym)).length;
  countEl.textContent = active + ' / ' + symbols.length;
}

function renderIntervalPoolPanel(panel) {
  const { body } = makePoolPanelShell(panel, 'Training pool — Intervals', null);
  // POINT 39: split into simple and compound sections — all collapsed by default
  // POINT 50: compound section hidden in basic mode
  const onChange39 = () => appMode === 'dict' ? setAppMode('dict') : generateIntervalQuestion();

  const visibleIntervals = appDifficulty === 'basic'
    ? INTERVALS.filter(i => !i.compound)
    : [...INTERVALS];

  makeGlobalAllNone(body, visibleIntervals, selectedIntervals,
    () => body.querySelectorAll('.pool-chip'), onChange39);

  makeSection(body, 'Simple intervals', INTERVALS.filter(i => !i.compound), selectedIntervals, onChange39, true);

  if (appDifficulty === 'advanced') {
    makeSection(body, 'Extended / Compound', INTERVALS.filter(i => i.compound), selectedIntervals, onChange39, true);
  }
}

// Display titles and section-renderer choice for scale group values.
// sectionFn: 'withDisplayName' uses makeSectionWithDisplayName; anything else uses makeSection.
const SCALE_GROUP_CONFIG = {
  pentatonic: { title: 'Pentatonic (5 notes)',      sectionFn: 'withDisplayName' },
  hexatonic:  { title: 'Hexatonic (6 notes)',        sectionFn: 'standard' },
  diatonic:   { title: 'Diatonic / Modal (7 notes)', sectionFn: 'standard' },
  octatonic:  { title: 'Octatonic (8 notes)',        sectionFn: 'standard' },
};

// Iterate SCALES grouped by the 'group' field, in insertion order.
// callback(key, title, items, cfg) — cfg is the SCALE_GROUP_CONFIG entry or undefined.
// Single source of truth for group structure; used by both quiz and dict renderers.
function iterateScaleGroups(callback) {
  const groupMap = new Map();
  SCALES.forEach(s => {
    const key = s.group || 'other';
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key).push(s);
  });
  groupMap.forEach((items, key) => {
    const cfg = SCALE_GROUP_CONFIG[key];
    const title = cfg ? cfg.title : (key.charAt(0).toUpperCase() + key.slice(1));
    callback(key, title, items, cfg);
  });
}

function renderScalePoolPanel(panel) {
  // POINT 28: Group by the 'group' field on each SCALES entry — auto-discovers new groups.
  const { body } = makePoolPanelShell(panel, 'Training pool — Scales', null);
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateScaleQuestion();

  makeGlobalAllNone(body, [...SCALES], selectedScales,
    () => body.querySelectorAll('.pool-chip'), onChange);

  iterateScaleGroups((key, title, items, cfg) => {
    if (cfg && cfg.sectionFn === 'withDisplayName') {
      makeSectionWithDisplayName(body, title, items, selectedScales, onChange, true);
    } else {
      makeSection(body, title, items, selectedScales, onChange, true);
    }
  });
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
