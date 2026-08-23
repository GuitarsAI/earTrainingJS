/**
 * @file pool-progressions.js
 * @description Progression training pool panel rendering.
 *   Groups progressions by PROG_GROUPS order; respects Basic mode filtering.
 *   Uses two-line chips (prog-pool-chip) unique to the progression pool —
 *   bold Roman numeral symbol (.prog-chip-sym) + lighter name (.prog-chip-name).
 *   Note: PROG_GROUPS and PROG_GROUP_COLLAPSED live in progressions.js (data layer).
 *   Exports: renderProgressionPoolPanel
 * @layer ui
 * @requires pool.js  (makePoolPanelShell, makeGlobalAllNone)
 * @requires state.js, defaults.js, progressions.js
 */

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Builds one collapsible group section with two-line progression pool chips.
 * Each chip shows a bold Roman numeral symbol (.prog-chip-sym) and a lighter
 * name (.prog-chip-name) stacked inside a single pill. Includes a per-section
 * count display and All / None buttons. Reads/writes selectedProgressions directly.
 *
 * @param {HTMLElement} body       - The pool panel body to append into.
 * @param {string}      title      - Section heading text (group name).
 * @param {object[]}    items      - Progressions for this section ({ symbol, name, ... }).
 * @param {boolean}     [collapsed=true]    - Default collapsed state; overridden to false
 *                                            if any item in the section is selected.
 * @param {function}    [onChangeFn]        - Called after every chip toggle or All/None click.
 */
function _makeProgSection(body, title, items, collapsed = true, onChangeFn = () => {}) {
  const hasSelected = items.some(it => selectedProgressions.has(it.symbol));
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

  // Toggle collapse on header click; ignore clicks that land on the All/None buttons
  hdr.addEventListener('click', (e) => {
    if (e.target === allBtn || e.target === noneBtn) return;
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  const chips = [];

  function updateCount() {
    const active = items.filter(it => selectedProgressions.has(it.symbol)).length;
    countEl.textContent = active + ' / ' + items.length;
  }

  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedProgressions.add(it.symbol));
    chips.forEach(c => c.classList.add('active'));
    updateCount();
    onChangeFn();
  });

  noneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedProgressions.delete(it.symbol));
    chips.forEach(c => c.classList.remove('active'));
    updateCount();
    onChangeFn();
  });

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip prog-pool-chip' + (selectedProgressions.has(item.symbol) ? ' active' : '');
    chip.innerHTML = `<span class="prog-chip-sym">${item.symbol}</span><span class="prog-chip-name">${item.name}</span>`;
    chip.addEventListener('click', () => {
      if (selectedProgressions.has(item.symbol)) selectedProgressions.delete(item.symbol);
      else selectedProgressions.add(item.symbol);
      chip.classList.toggle('active', selectedProgressions.has(item.symbol));
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

// ─── Public renderers ─────────────────────────────────────────────────────────

/**
 * Renders the progression training pool panel into `panel`.
 * Shows a meta count (e.g. "9 / 9") in the panel header reflecting the current
 * selection. Groups follow PROG_GROUPS order; collapse state is driven by
 * PROG_GROUP_COLLAPSED. Each group is rendered as a two-line chip section via
 * _makeProgSection. Called by renderPoolPanel() when currentMode === 'progressions'.
 *
 * @param {HTMLElement} panel - The #poolPanel container element.
 */
function renderProgressionPoolPanel(panel) {
  const visibleProgressions = appDifficulty === 'basic'
    ? PROGRESSIONS.filter(p => p.basic)
    : [...PROGRESSIONS];

  const { body, updateMeta } = makePoolPanelShell(panel, 'Training pool — Progressions',
    () => `${visibleProgressions.filter(p => selectedProgressions.has(p.symbol)).length} / ${visibleProgressions.length}`);

  const onChange = () => {
    updateMeta();
    appMode === 'dict' ? setAppMode('dict') : generateProgressionQuestion();
  };

  makeGlobalAllNone(body, visibleProgressions, selectedProgressions,
    () => body.querySelectorAll('.pool-chip'), onChange);

  PROG_GROUPS.forEach(group => {
    const items = visibleProgressions.filter(p => p.group === group);
    if (items.length === 0) return;
    const collapsed = PROG_GROUP_COLLAPSED[group] ?? true;
    _makeProgSection(body, group, items, collapsed, onChange);
  });

  updateMeta();
}

// @file-end — The Sound Travels Ear Training © 2026
