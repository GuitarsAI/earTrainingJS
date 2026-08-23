/**
 * @file pool.js
 * @description Shared pool panel primitives and top-level mode dispatcher.
 *   Provides the building blocks consumed by all four mode-specific pool files.
 *   Exports: renderPoolPanel, makePoolPanelShell, makeGlobalAllNone, makeSection,
 *            _makeSubGroup, _makeAllNoneBtn
 * @layer ui
 * @requires state.js, defaults.js
 */

// ─── Dispatcher ───────────────────────────────────────────────────────────────

/**
 * Clears #poolPanel and renders the pool panel for the current mode.
 * Routes to the appropriate mode renderer defined in the pool-*.js files.
 */
function renderPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';

  if (currentMode === 'chords') renderChordPoolPanel(panel);
  else if (currentMode === 'intervals') renderIntervalPoolPanel(panel);
  else if (currentMode === 'progressions') renderProgressionPoolPanel(panel);
  else renderScalePoolPanel(panel);
}

// ─── Shared primitives ────────────────────────────────────────────────────────

/**
 * Builds and appends the collapsible shell (header + body) for a pool panel.
 * Returns the inner body element and a meta span updater for the count display.
 *
 * @param {HTMLElement} panel   - The #poolPanel container to append into.
 * @param {string}      title   - Panel heading text.
 * @param {function|null} metaFn - Called to compute the meta string (e.g. "4 items");
 *                                 pass null to omit the meta display.
 * @returns {{ body: HTMLElement, meta: HTMLElement, updateMeta: function }}
 */
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

/**
 * Appends a global All / None row at the top of a pool panel body.
 * All/None operate across every item in `allItems`, syncing both the Set
 * and the active class on every chip in the panel.
 *
 * @param {HTMLElement}  body         - The pool panel body to prepend into.
 * @param {object[]}     allItems     - Flat array of all items for this mode ({ symbol, ... }).
 * @param {Set<string>}  selectedSet  - The shared selection Set for this mode.
 * @param {function}     getAllChips  - Returns all .pool-chip elements currently in body.
 * @param {function}     onChangeFn  - Called after every All/None toggle.
 */
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

/**
 * Appends a collapsible chip section into a pool panel body.
 * Includes a header with title, count display, and per-section All/None buttons.
 * Starts collapsed unless the section contains at least one selected item.
 *
 * @param {HTMLElement}  body           - The pool panel body to append into.
 * @param {string}       title          - Section heading text.
 * @param {object[]}     items          - Items for this section ({ symbol, name, displayName? }).
 * @param {Set<string>}  selectedSet    - The shared selection Set for this mode.
 * @param {function}     onChangeFn     - Called after every chip toggle or All/None click.
 * @param {boolean}      [collapsed]    - Default collapsed state (default: true).
 *                                        Overridden to false if any item is selected.
 * @param {boolean}      [useDisplayName] - When true, chip label uses item.displayName
 *                                          if present, falling back to item.name.
 *                                          Used by the Pentatonic scale section for dual labels.
 */
function makeSection(body, title, items, selectedSet, onChangeFn, collapsed = true, useDisplayName = false) {
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

  // Toggle collapse on header click; ignore clicks that land on the All/None buttons
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
    chip.textContent = useDisplayName ? (item.displayName || item.name) : item.name;
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

/**
 * Builds a collapsible sub-group container inside `body` and returns its inner body.
 * Used by pool-chords.js to wrap the Chord quality and Voicing sections.
 * Starts collapsed by default.
 *
 * @param {HTMLElement} body  - The parent pool panel body.
 * @param {string}      title - Sub-group heading text.
 * @returns {HTMLElement} The inner body div that section renderers append into.
 */
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

/**
 * Creates a styled All or None button for use inside pool sections.
 * Used by pool-chords.js voicing group headers.
 *
 * @param {string} label - Button text ('All' or 'None').
 * @returns {HTMLButtonElement}
 */
function _makeAllNoneBtn(label) {
  const btn = document.createElement('button');
  btn.className = 'pool-all-btn';
  btn.textContent = label;
  return btn;
}

// @file-end — The Sound Travels Ear Training © 2026
