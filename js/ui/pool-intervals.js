/**
 * @file
 * @author    Renato Fera P. — https://www.linkedin.com/in/renato-profeta/
 * @copyright © 2026 The Sound Travels — MIT License
 */

/**
 * @file pool-intervals.js
 * @description Interval training pool panel and playback style chip rendering.
 *   Splits the interval pool into Simple and Extended/Compound sections,
 *   hiding the compound section in Basic mode.
 *   Exports: renderIntervalPoolPanel, renderIntervalStyleChips
 * @layer ui
 * @requires pool.js  (makePoolPanelShell, makeGlobalAllNone, makeSection)
 * @requires state.js, defaults.js, intervals.js, notation.js
 */

// ─── Public renderers ─────────────────────────────────────────────────────────

/**
 * Renders the interval training pool panel into `panel`.
 * Shows Simple intervals always; Extended/Compound section only in Advanced mode.
 * Called by renderPoolPanel() when currentMode === 'intervals'.
 *
 * @param {HTMLElement} panel - The #poolPanel container element.
 */
function renderIntervalPoolPanel(panel) {
  const { body } = makePoolPanelShell(panel, 'Training pool — Intervals', null);
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateIntervalQuestion();

  const visibleIntervals = appDifficulty === 'basic'
    ? INTERVALS.filter(i => !i.compound)
    : [...INTERVALS];

  makeGlobalAllNone(body, visibleIntervals, selectedIntervals,
    () => body.querySelectorAll('.pool-chip'), onChange);

  makeSection(body, 'Simple intervals', INTERVALS.filter(i => !i.compound), selectedIntervals, onChange, true);

  if (appDifficulty === 'advanced') {
    makeSection(body, 'Extended / Compound', INTERVALS.filter(i => i.compound), selectedIntervals, onChange, true);
  }
}

/**
 * Renders the interval playback style chips into #intervalStyleRow.
 * Updates intervalStyle, the play button label, and notation on selection.
 * Called on mode switch and after answering.
 */
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
      document.getElementById('playLabel').textContent =
        s.symbol === 'harmonic'   ? 'Play interval (together)'   :
        s.symbol === 'ascending'  ? 'Play interval (ascending)'  :
        s.symbol === 'descending' ? 'Play interval (descending)' :
                                    'Play interval (random style)';
      // Update notation to mirror new style if currently visible;
      // for random, notation stays as last-played until Play is hit.
      if (s.symbol !== 'random') {
        currentIntervalStyle = s.symbol;
        if (appMode === 'dict' || answered) { showNotation(); showBreakdown(); }
      }
    });
    row.appendChild(chip);
  });
}

// @file-end — The Sound Travels Ear Training © 2026
