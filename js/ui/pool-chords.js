/**
 * @file
 * @author    Renato Fera P. — https://www.linkedin.com/in/renato-profeta/
 * @copyright © 2026 The Sound Travels — MIT License
 */

/**
 * @file pool-chords.js
 * @description Chord quality and voicing pool panel rendering.
 *   Handles both quiz multi-select and dict/post-answer single-select modes.
 *   Exports: renderChordPoolPanel, renderChordStyleChips
 * @layer ui
 * @requires pool.js  (makePoolPanelShell, makeGlobalAllNone, makeSection,
 *                     _makeSubGroup, _makeAllNoneBtn)
 * @requires state.js, defaults.js, chords.js, voicings.js, audio.js, notation.js
 */

// ─── Constants ────────────────────────────────────────────────────────────────

// Display titles for known CHORD_TYPES family keys.
// Any key not listed here gets a capitalised fallback (e.g. 'classical' → 'Classical').
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

// Voicing groups in display order, aligned with the post-cleanup 36-entry
// VOICING_MODES. Each group carries a `basic` flag that limits visibility
// when appDifficulty === 'basic'.
//
// Group 5 Intervallic has been removed entirely (all 7 members fabricated
// non-chord tones). Their pitch structures are now dedicated chord entries
// in chords.js. No Intervallic group is rendered.
const VOICING_GROUPS = [
  {
    label: 'Position',
    basic: true,
    symbols: ['close', 'open', 'spread'],
  },
  {
    label: 'Doubling',
    basic: true,
    symbols: ['dbl_root_oct', 'dbl_root_above5', 'dbl_fifth', 'dbl_root_wrap'],
  },
  {
    label: 'Shell / Rootless',
    symbols: [
      'shell', 'shell_alt', 'shell_rootless',
      'tn_maj_135', 'tn_maj_357', 'tn_maj_137',
      'tn_dom_13b7', 'tn_dom_35b7', 'tn_dom_3b79',
      'tn_min_1b3b7', 'tn_min_b35b7', 'tn_min_b3b79',
    ],
  },
  {
    label: 'Drop',
    symbols: ['drop2', 'drop3', 'drop24', 'drop23'],
  },
  {
    label: 'Style',
    symbols: [
      'evans_a', 'evans_b', 'kenny_barron',
      'oct_bass_triad', 'oct_bass_7th', 'open5_triad',
      'block_close', 'block_locked', 'four_way_close', 'block_drop2',
      'oct_melody_inner', 'pedal_point', 'spread_2h',
    ],
  },
];

// All voicing symbols including Random — used for global All/None coverage.
const ALL_VOICING_SYMBOLS = ['random', ...VOICING_GROUPS.flatMap(g => g.symbols)];

// ─── Private helpers ──────────────────────────────────────────────────────────

/** Returns a human-readable title for a CHORD_TYPES family key. */
function _familyTitle(key) {
  return CHORD_FAMILY_TITLES[key] || (key.charAt(0).toUpperCase() + key.slice(1));
}

/**
 * Builds the flat list of { title, items } sections from CHORD_TYPES.
 * Families whose entries carry a subFamily field are split into one section
 * per subFamily value, preserving the order subFamily values first appear.
 */
function _buildChordFamilies() {
  const sections = [];
  const isBasic = appDifficulty === 'basic';
  for (const [key, entries] of Object.entries(CHORD_TYPES)) {
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

/**
 * Builds the two top-level sub-groups (Chord quality, Voicing) inside `body`
 * and delegates to the mode-aware section renderers.
 * Shared by renderChordPoolPanel (quiz) and renderDictPoolPanel (dict).
 */
function _renderChordSubGroups(body) {
  const qualityGroup = _makeSubGroup(body, 'Chord quality');
  _renderChordQualitySection(qualityGroup);

  const voicingGroup = _makeSubGroup(body, 'Voicing');
  _renderVoicingSection(voicingGroup);
}

/**
 * Renders the chord quality section.
 * Quiz mode: multi-select chips, Global All/None, inversions checkbox.
 * Dict mode: single-select chips that load the chord immediately on click.
 */
function _renderChordQualitySection(body) {
  const isQuiz = appMode === 'quiz';
  const FAMILIES = _buildChordFamilies();

  if (isQuiz) {
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
    // Dict: single-select, clicking loads chord immediately
    FAMILIES.forEach(f => {
      const hasActive = f.items.some(item => item.symbol === dictSymbol);
      makeDictSection(body, f.title, f.items, false, !hasActive);
    });
  }
}

/**
 * Routes to multi-select (quiz before answering) or single-select
 * (dict + quiz post-answer) voicing rendering.
 */
function _renderVoicingSection(body) {
  const isMulti = appMode === 'quiz' && !answered;
  if (isMulti) {
    _renderVoicingMulti(body);
  } else {
    _renderVoicingSingle(body, currentBaseIntervals);
  }
}

// ── Multi-select (quiz before answering) ──────────────────────────────────────

/** Renders the full multi-select voicing panel: global All/None, Random chip, collapsible groups. */
function _renderVoicingMulti(body) {
  const globalRow = document.createElement('div');
  globalRow.style.cssText = 'display:flex;gap:8px;padding:4px 0 8px 0;';

  const globalAllBtn  = _makeAllNoneBtn('All');
  const globalNoneBtn = _makeAllNoneBtn('None');

  // Refs to all chip elements so global buttons can sync them
  const allChipRefs = []; // { symbol, chipEl }

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

  // Random chip — treated as a regular pool member
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

  // Collapsible voicing groups — no gating in multi-select (pre-answer quiz pool)
  const visibleGroups = appDifficulty === 'basic'
    ? VOICING_GROUPS.filter(g => g.basic)
    : VOICING_GROUPS;

  visibleGroups.forEach(group => {
    const items = group.symbols
      .map(sym => VOICING_MODES.find(v => v.symbol === sym))
      .filter(Boolean);
    _makeVoicingGroupMulti(body, group.label, items, allChipRefs);
  });
}

/**
 * Builds one collapsible multi-select voicing group section.
 * Pushes chip refs into `allChipRefs` for global All/None sync.
 */
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

/**
 * Renders single-select voicing panel: Random chip + collapsible groups.
 * Each applicable chip re-voices immediately on click.
 * Chips for voicings that don't apply to the current chord are greyed out
 * and non-interactive (voicing-chip-disabled). The active voicing is reset
 * to 'close' first if it no longer applies to the current chord — callers
 * (dictLoadSymbol, post-answer re-render) should call
 * syncVoicingModeToChord() before rendering the panel.
 *
 * @param {HTMLElement} body              - Container to render into.
 * @param {number[]}    currentBaseIntervals - baseIntervals of the chord on screen.
 */
function _renderVoicingSingle(body, currentBaseIntervals) {
  const randomRow = document.createElement('div');
  randomRow.style.padding = '0 0 0.4rem 0';

  const randomChip = document.createElement('button');
  randomChip.className = 'pool-chip voicing-single-chip' + (activeVoicingMode === 'random' ? ' active' : '');
  randomChip.textContent = 'Random';
  randomChip.title = 'Pick a random voicing from all applicable options';
  randomChip.dataset.voicingSymbol = 'random';
  randomChip.addEventListener('click', () => {
    activeVoicingMode = 'random';
    _syncVoicingChipActive(body);
    recomputeCurrentNotes();
  });
  randomRow.appendChild(randomChip);
  body.appendChild(randomRow);

  const visibleGroups = appDifficulty === 'basic'
    ? VOICING_GROUPS.filter(g => g.basic)
    : VOICING_GROUPS;

  visibleGroups.forEach(group => {
    const items = group.symbols
      .map(sym => VOICING_MODES.find(v => v.symbol === sym))
      .filter(Boolean);
    _makeVoicingGroupSingle(body, group.label, items, currentBaseIntervals);
  });
}

/**
 * Builds one collapsible single-select voicing group.
 * Applicable chips re-voice immediately on click.
 * Inapplicable chips are rendered with the 'voicing-chip-disabled' class,
 * aria-disabled, and no click handler — they are visible but inert.
 *
 * @param {HTMLElement} body              - Container to render into.
 * @param {string}      title             - Section label.
 * @param {VoicingMode[]} items           - Voicing entries for this group.
 * @param {number[]}    currentBaseIntervals - baseIntervals of the chord on screen.
 */
function _makeVoicingGroupSingle(body, title, items, currentBaseIntervals) {
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
    const isActive = activeVoicingMode === v.symbol;

    // Gate: check applicability against the chord currently on screen.
    // currentBaseIntervals may be undefined in edge cases (panel rendered before
    // any chord is loaded); treat as applicable when we can't check.
    const applies = !currentBaseIntervals || voicingAppliesToChord(v.symbol, currentBaseIntervals);

    if (applies) {
      chip.className = 'pool-chip voicing-single-chip' + (isActive ? ' active' : '');
      chip.textContent = v.name;
      chip.title = v.desc;
      chip.dataset.voicingSymbol = v.symbol;
      chip.addEventListener('click', () => {
        activeVoicingMode = v.symbol;
        _syncVoicingChipActive(body);
        recomputeCurrentNotes();
      });
    } else {
      chip.className = 'pool-chip voicing-single-chip voicing-chip-disabled';
      chip.textContent = v.name;
      chip.title = 'Not applicable to this chord';
      chip.dataset.voicingSymbol = v.symbol;
      chip.setAttribute('aria-disabled', 'true');
      // No click handler — pointer-events: none in CSS makes this belt-and-suspenders,
      // but omitting the handler is the authoritative guard.
    }

    chipsEl.appendChild(chip);
  });

  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

// ── Shared voicing helpers ────────────────────────────────────────────────────

/** Syncs the active class across all single-select voicing chips after a selection. */
function _syncVoicingChipActive(body) {
  body.querySelectorAll('.voicing-single-chip').forEach(c => {
    // Disabled chips can never be the active chip — skip them.
    if (c.classList.contains('voicing-chip-disabled')) return;
    c.classList.toggle('active', c.dataset.voicingSymbol === activeVoicingMode);
  });
}

/** Updates the count display for all voicing group sections in multi-select mode. */
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

/** Updates the count display for a single voicing section given its symbol list. */
function _updateSectionCount(sec, symbols) {
  const countEl = sec.querySelector('.pool-section-count');
  if (!countEl) return;
  const active = symbols.filter(sym => selectedVoicings.has(sym)).length;
  countEl.textContent = active + ' / ' + symbols.length;
}

/**
 * Checks whether the currently active single-select voicing is still applicable
 * to a new chord's baseIntervals, and resets to 'close' if not.
 *
 * Call this whenever the chord on screen changes in dict mode or post-answer view,
 * before (re-)rendering the voicing panel. The reset ensures the panel always
 * opens with a consistent active chip — no chip marked active while disabled.
 *
 * @param {number[]} baseIntervals - baseIntervals of the incoming chord.
 * @returns {boolean} true if a reset occurred (caller may want to log or animate).
 */
function syncVoicingModeToChord(baseIntervals) {
  if (
    activeVoicingMode !== 'random' &&
    activeVoicingMode !== 'close' &&
    !voicingAppliesToChord(activeVoicingMode, baseIntervals)
  ) {
    activeVoicingMode = 'close';
    return true;
  }
  return false;
}

// ─── Public renderers ─────────────────────────────────────────────────────────

/**
 * Renders the chord training pool panel into `panel`.
 * Builds the panel shell and delegates sub-group rendering to _renderChordSubGroups.
 * Called by renderPoolPanel() when currentMode === 'chords'.
 *
 * @param {HTMLElement} panel - The #poolPanel container element.
 */
function renderChordPoolPanel(panel) {
  const totalSelected = () => getActivePool().length + ' items';
  const { body } = makePoolPanelShell(panel, 'Training pool — Chords', totalSelected);
  _renderChordSubGroups(body);
}

/**
 * Renders the chord playback style chips into #chordStyleRow.
 * Updates chordPlayStyle, the play button label, and notation on selection.
 * Called on mode switch and after answering.
 */
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
      const label = s.symbol === 'block'      ? 'Play chord'
        : s.symbol === 'ascending'  ? 'Play chord (ascending)'
        : s.symbol === 'descending' ? 'Play chord (descending)'
        : s.symbol === 'broken'     ? 'Play chord (broken)'
        : 'Play chord (random style)';
      document.getElementById('playLabel').textContent = label;
      // For a concrete style, update notation immediately. For random, notation
      // stays as last-played until Play is hit.
      if (s.symbol !== 'random') {
        currentChordPlayStyle = s.symbol;
        if (appMode === 'dict' || answered) { showCurrentView(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}

// @file-end — The Sound Travels Ear Training © 2026
