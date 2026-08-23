/**
 * @file pool-scales.js
 * @description Scale training pool panel and direction chip rendering.
 *   Groups scales by cardinality (pentatonic, hexatonic, diatonic, octatonic).
 *   Exports: SCALE_GROUP_CONFIG, iterateScaleGroups, renderScalePoolPanel, renderScaleDirChips
 * @layer ui
 * @requires pool.js  (makePoolPanelShell, makeGlobalAllNone, makeSection)
 * @requires state.js, defaults.js, scales.js, notation.js
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Display titles and section-renderer config for each scale group key.
 * `sectionFn: 'withDisplayName'` passes useDisplayName=true to makeSection,
 * causing chips to show item.displayName when available (used by Pentatonic
 * to surface dual names like "Major Pentatonic / Ionian Pentatonic").
 * Any key absent from this object gets a capitalised fallback title.
 *
 * @type {Object.<string, {title: string, sectionFn: string}>}
 */
const SCALE_GROUP_CONFIG = {
  pentatonic: { title: 'Pentatonic (5 notes)',      sectionFn: 'withDisplayName' },
  hexatonic:  { title: 'Hexatonic (6 notes)',        sectionFn: 'standard' },
  diatonic:   { title: 'Diatonic / Modal (7 notes)', sectionFn: 'standard' },
  octatonic:  { title: 'Octatonic (8 notes)',        sectionFn: 'standard' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Iterates SCALES grouped by the `group` field, in insertion order.
 * Filters to basic scales only when appDifficulty === 'basic'.
 *
 * This is the single source of truth for scale group structure.
 * Both the quiz pool panel and the dict renderer consume it — any change
 * to grouping or ordering belongs here.
 *
 * @param {function(key: string, title: string, items: object[], cfg: object|undefined): void} callback
 *   Called once per group with the group key, display title, member scales, and
 *   the SCALE_GROUP_CONFIG entry (or undefined for unknown keys).
 */
function iterateScaleGroups(callback) {
  const groupMap = new Map();
  const visibleScales = appDifficulty === 'basic'
    ? SCALES.filter(s => s.basic)
    : SCALES;
  visibleScales.forEach(s => {
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

// ─── Public renderers ─────────────────────────────────────────────────────────

/**
 * Renders the scale training pool panel into `panel`.
 * Groups are auto-discovered via the `group` field on each SCALES entry.
 * Pentatonic chips show displayName (dual label); all others show name.
 * Called by renderPoolPanel() when currentMode === 'scales' (or default).
 *
 * @param {HTMLElement} panel - The #poolPanel container element.
 */
function renderScalePoolPanel(panel) {
  const { body } = makePoolPanelShell(panel, 'Training pool — Scales', null);
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateScaleQuestion();

  const visibleScales = appDifficulty === 'basic' ? SCALES.filter(s => s.basic) : [...SCALES];
  makeGlobalAllNone(body, visibleScales, selectedScales,
    () => body.querySelectorAll('.pool-chip'), onChange);

  iterateScaleGroups((key, title, items, cfg) => {
    const useDisplayName = cfg && cfg.sectionFn === 'withDisplayName';
    makeSection(body, title, items, selectedScales, onChange, true, useDisplayName);
  });
}

/**
 * Renders the scale direction chips into #scaleDirRow.
 * Updates scaleDirection, the play button label, and notation on selection.
 * Called on mode switch and after answering.
 */
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
                  : 'Play scale (random direction)';
      document.getElementById('playLabel').textContent = label;
      // Update notation to mirror new direction if currently visible;
      // for random, notation stays as last-played until Play is hit.
      if (d.symbol !== 'random') {
        currentScaleDir = d.symbol;
        if (appMode === 'dict' || answered) { showNotation(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}

// @file-end — The Sound Travels Ear Training © 2026
