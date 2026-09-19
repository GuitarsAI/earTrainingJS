/**
 * @file about-mode.js
 * @description About view: show/hide the About panel, mutual exclusion with
 *   Help (handled from help-mode.js, which loads after this file), and
 *   mode-tab wiring. No dynamic rendering — the About view is static HTML.
 * @layer modes
 * @requires state.js (currentMode, switchMode)
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Training-UI element IDs to hide while About (or Help) is open. */
const ABOUT_TRAINING_ELS = [
  'rootPanel', 'poolPanel', 'settingsPanel', 'playArea',
  'notationPanel', 'breakdownWrapper', 'statusMsg',
  'answerDropdownWrap', 'controls', 'statsToggle', 'statsPanel'
];

// ─── State ────────────────────────────────────────────────────────────────────

/** Whether the About view is currently open. */
let aboutOpen = false;

// ─── Show / hide ──────────────────────────────────────────────────────────────

/**
 * Opens the About view. Hides all training-UI elements, deactivates mode tabs,
 * and marks the About button active. Mutual exclusion with Help is handled by
 * help-mode.js, which patches the About button after this file loads.
 */
function showAbout() {
  aboutOpen = true;
  document.getElementById('aboutBtn').classList.add('active');
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  ABOUT_TRAINING_ELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // .kbd-hint is class-based, not an id — handled separately from ABOUT_TRAINING_ELS
  const kbdHint = document.querySelector('.kbd-hint');
  if (kbdHint) kbdHint.style.display = 'none';
  document.getElementById('aboutView').style.display = '';
}

/**
 * Closes the About view and restores all training-UI elements to their default
 * display state. Callers should follow up with switchMode(currentMode) when
 * returning to training.
 */
function hideAbout() {
  aboutOpen = false;
  document.getElementById('aboutBtn').classList.remove('active');
  document.getElementById('aboutView').style.display = 'none';
  ABOUT_TRAINING_ELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  const kbdHint = document.querySelector('.kbd-hint');
  if (kbdHint) kbdHint.style.display = '';
}

// ─── Event wiring ─────────────────────────────────────────────────────────────

// ⓘ button — toggle About open/closed; restore quiz on close
document.getElementById('aboutBtn').addEventListener('click', () => {
  if (aboutOpen) { hideAbout(); switchMode(currentMode); }
  else showAbout();
});

// Clicking any mode tab closes About first
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (aboutOpen) hideAbout();
  });
});

// @file-end — The Sound Travels Ear Training © 2026
