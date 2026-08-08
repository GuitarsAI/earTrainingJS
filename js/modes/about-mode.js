// ── About mode ────────────────────────────────────────────────────────────────

// Elements to hide while About is open
const ABOUT_TRAINING_ELS = [
  'rootPanel', 'poolPanel', 'settingsPanel', 'playArea',
  'notationPanel', 'breakdownWrapper', 'statusMsg',
  'answerDropdownWrap', 'controls', 'statsToggle', 'statsPanel'
];

let aboutOpen = false;

function showAbout() {
  aboutOpen = true;
  document.getElementById('aboutBtn').classList.add('active');
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  ABOUT_TRAINING_ELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Also hide the keyboard hint (class-based, not id)
  const kbdHint = document.querySelector('.kbd-hint');
  if (kbdHint) kbdHint.style.display = 'none';
  document.getElementById('aboutView').style.display = '';
}

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

// ⓘ button — toggle About open/closed
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
