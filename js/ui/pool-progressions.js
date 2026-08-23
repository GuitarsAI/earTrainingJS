/**
 * @file pool-progressions.js
 * @description Progression training pool panel rendering.
 *   Groups progressions by PROG_GROUPS order; respects Basic mode filtering.
 *   Note: PROG_GROUPS and PROG_GROUP_COLLAPSED live in progressions.js (data layer).
 *   Exports: renderProgressionPoolPanel
 * @layer ui
 * @requires pool.js  (makePoolPanelShell, makeGlobalAllNone, makeSection)
 * @requires state.js, defaults.js, progressions.js
 */

// ─── Public renderers ─────────────────────────────────────────────────────────

/**
 * Renders the progression training pool panel into `panel`.
 * Groups follow PROG_GROUPS order; collapse state is driven by PROG_GROUP_COLLAPSED.
 * Called by renderPoolPanel() when currentMode === 'progressions'.
 *
 * @param {HTMLElement} panel - The #poolPanel container element.
 */
function renderProgressionPoolPanel(panel) {
  const { body } = makePoolPanelShell(panel, 'Training pool — Progressions', null);
  const onChange = () => appMode === 'dict' ? setAppMode('dict') : generateProgressionQuestion();

  const visibleProgressions = appDifficulty === 'basic'
    ? PROGRESSIONS.filter(p => p.basic)
    : [...PROGRESSIONS];

  makeGlobalAllNone(body, visibleProgressions, selectedProgressions,
    () => body.querySelectorAll('.pool-chip'), onChange);

  PROG_GROUPS.forEach(groupName => {
    const items = visibleProgressions.filter(p => p.group === groupName);
    if (items.length === 0) return;
    const collapsed = PROG_GROUP_COLLAPSED[groupName] !== false;
    makeSection(body, groupName, items, selectedProgressions, onChange, collapsed);
  });
}

// @file-end — The Sound Travels Ear Training © 2026
