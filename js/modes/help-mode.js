/**
 * @file help-mode.js
 * @description In-app Help system: show/hide the Help view, mutual exclusion
 *   with About, keyboard and tab-click wiring, and lazy rendering of the
 *   searchable help panel from HELP_SECTIONS (defined in help-content.js).
 *   Rendering is deferred to first open — the DOM is only built once.
 * @layer modes
 * @requires state.js (currentMode), help-content.js (HELP_SECTIONS),
 *           about-mode.js (aboutOpen, hideAbout)
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Training-UI element IDs to hide while Help (or About) is open. */
const HELP_TRAINING_ELS = [
  'rootPanel', 'poolPanel', 'settingsPanel', 'playArea',
  'notationPanel', 'breakdownWrapper', 'statusMsg',
  'answerDropdownWrap', 'controls', 'statsToggle', 'statsPanel'
];

// ─── State ────────────────────────────────────────────────────────────────────

/** Whether the Help view is currently open. */
let helpOpen = false;

// ─── Show / hide ──────────────────────────────────────────────────────────────

/**
 * Opens the Help view. Hides all training-UI elements, deactivates mode tabs,
 * marks the Help button active, and closes About if it is currently open.
 */
function showHelp() {
  helpOpen = true;
  document.getElementById('helpBtn').classList.add('active');
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  HELP_TRAINING_ELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const kbdHint = document.querySelector('.kbd-hint');
  if (kbdHint) kbdHint.style.display = 'none';
  document.getElementById('helpView').style.display = '';

  // Mutual exclusion — close About if open
  if (typeof aboutOpen !== 'undefined' && aboutOpen) hideAbout();
}

/**
 * Closes the Help view and restores all training-UI elements to their default
 * display state. Does not re-render the quiz — callers should follow up with
 * switchMode(currentMode) when returning to training.
 */
function hideHelp() {
  helpOpen = false;
  document.getElementById('helpBtn').classList.remove('active');
  document.getElementById('helpView').style.display = 'none';
  HELP_TRAINING_ELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  const kbdHint = document.querySelector('.kbd-hint');
  if (kbdHint) kbdHint.style.display = '';
}

// ─── Event wiring ─────────────────────────────────────────────────────────────

// ? button — toggle Help open/closed; restore quiz on close
document.getElementById('helpBtn').addEventListener('click', () => {
  if (helpOpen) { hideHelp(); switchMode(currentMode); }
  else showHelp();
});

// Clicking any mode tab closes Help first
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (helpOpen) hideHelp();
  });
});

// Escape key closes Help and returns to the current quiz mode
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && helpOpen) { hideHelp(); switchMode(currentMode); }
});

// Patch the About button to close Help when About is opened.
// Runs after about-mode.js is already loaded; uses an IIFE to avoid
// polluting the global scope with a one-off setup variable.
(function patchAboutMutualExclusion() {
  const aboutBtn = document.getElementById('aboutBtn');
  if (!aboutBtn) return;
  aboutBtn.addEventListener('click', () => {
    if (helpOpen) hideHelp();
  });
})();

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Builds and inserts the Help panel into `#helpView` from the HELP_SECTIONS
 * data (defined in help-content.js). Idempotent — bails immediately if the
 * view has already been rendered (guarded by `data-rendered`).
 *
 * Structure per section:
 *   <details class="help-section-details">   ← collapsible section header
 *     <div class="help-entries">
 *       <details class="help-entry">          ← collapsible per-term entry
 *         <div class="help-entry-body">       ← rendered body text
 *
 * Body text rendering rules (applied line by line):
 *   - Empty line            → `<br><br>` (paragraph break)
 *   - Bullet line (•) after a non-empty line → `<br>` prefix (stays in block)
 *   - All other text        → HTML-escaped inline text
 *
 * The search box filters entries in real time against term and body text.
 * Matching sections auto-expand; non-matching entries are hidden.
 */
function renderHelpView() {
  const view = document.getElementById('helpView');
  if (!view || view.dataset.rendered) return;
  view.dataset.rendered = 'true';

  const wrapper = document.createElement('div');
  wrapper.className = 'help-section';

  // ── Search box ──────────────────────────────────────────────────────────────
  const searchWrap = document.createElement('div');
  searchWrap.className = 'help-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'help-search';
  searchInput.placeholder = 'Search help…';
  searchInput.setAttribute('aria-label', 'Search help topics');
  searchWrap.appendChild(searchInput);
  wrapper.appendChild(searchWrap);

  // ── Sections ────────────────────────────────────────────────────────────────
  const sectionEls = [];

  HELP_SECTIONS.forEach(section => {
    const card = document.createElement('div');
    card.className = 'help-card';
    card.dataset.sectionId = section.id;

    // Section header is a collapsible <details> — closed by default
    const sectionDetails = document.createElement('details');
    sectionDetails.className = 'help-section-details';

    const sectionSummary = document.createElement('summary');
    sectionSummary.className = 'help-card-title';
    sectionSummary.textContent = section.title;
    sectionDetails.appendChild(sectionSummary);

    const entriesWrap = document.createElement('div');
    entriesWrap.className = 'help-entries';

    section.entries.forEach(entry => {
      const details = document.createElement('details');
      details.className = 'help-entry';

      const summary = document.createElement('summary');
      summary.className = 'help-entry-term';
      summary.textContent = entry.term;
      details.appendChild(summary);

      const body = document.createElement('div');
      body.className = 'help-entry-body';
      const lines = entry.body.split('\n');
      body.innerHTML = lines.map((line, i) => {
        if (line === '') return '<br><br>';
        const escaped = escapeHtml(line);
        if (line.startsWith('\u2022') && i > 0 && lines[i - 1] !== '') {
          return '<br>' + escaped;
        }
        return escaped;
      }).join('');
      details.appendChild(body);

      entriesWrap.appendChild(details);
    });

    sectionDetails.appendChild(entriesWrap);
    card.appendChild(sectionDetails);
    wrapper.appendChild(card);
    sectionEls.push({ card, sectionDetails, section });
  });

  view.appendChild(wrapper);

  // ── Search / filter logic ───────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();

    sectionEls.forEach(({ card, sectionDetails, section }) => {
      const entries = card.querySelectorAll('.help-entry');
      let sectionHasMatch = false;

      entries.forEach((details, i) => {
        const entry = section.entries[i];
        const matches = !q ||
          entry.term.toLowerCase().includes(q) ||
          entry.body.toLowerCase().includes(q);

        details.style.display = matches ? '' : 'none';
        if (matches) {
          sectionHasMatch = true;
          if (q) details.open = true;
        } else {
          details.open = false;
        }
      });

      card.style.display = sectionHasMatch ? '' : 'none';
      // Auto-expand section when search has matches; collapse when query is cleared
      if (q) {
        sectionDetails.open = sectionHasMatch;
      } else {
        sectionDetails.open = false;
      }
    });
  });
}

/**
 * Escapes a plain-text string for safe insertion into innerHTML.
 * Converts &, <, >, and " to their HTML entity equivalents.
 *
 * @param {string} str - The raw string to escape.
 * @returns {string} HTML-safe string.
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Trigger a one-time lazy render on first Help open.
// Registered separately from the toggle listener above so the render
// fires before showHelp() makes #helpView visible.
document.getElementById('helpBtn').addEventListener('click', () => {
  renderHelpView();
}, { once: true });

// @file-end — The Sound Travels Ear Training © 2026
