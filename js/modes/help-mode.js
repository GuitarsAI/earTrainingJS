// ── Help mode ─────────────────────────────────────────────────────────────────

// Elements to hide while Help is open (same list as About)
const HELP_TRAINING_ELS = [
  'rootPanel', 'poolPanel', 'settingsPanel', 'playArea',
  'notationPanel', 'breakdownWrapper', 'statusMsg',
  'answerDropdownWrap', 'controls', 'statsToggle', 'statsPanel'
];

let helpOpen = false;

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

// ? button — toggle Help open/closed
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

// Escape key closes Help
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && helpOpen) { hideHelp(); switchMode(currentMode); }
});

// ── Patch About's button to close Help when opening ───────────────────────────
// (runs after about-mode.js is already loaded)
(function patchAboutMutualExclusion() {
  const aboutBtn = document.getElementById('aboutBtn');
  if (!aboutBtn) return;
  aboutBtn.addEventListener('click', () => {
    if (helpOpen) hideHelp();
  });
})();

// ── Render Help panel from HELP_SECTIONS ──────────────────────────────────────

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

    const title = document.createElement('div');
    title.className = 'help-card-title';
    title.textContent = section.title;
    card.appendChild(title);

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
      // Render body text:
      //   empty line   → paragraph break
      //   bullet line  → line break before it (within a block)
      //   other lines  → escaped inline text
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

    card.appendChild(entriesWrap);
    wrapper.appendChild(card);
    sectionEls.push({ card, section });
  });

  view.appendChild(wrapper);

  // ── Search / filter logic ───────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();

    sectionEls.forEach(({ card, section }) => {
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
    });
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Render on first open
document.getElementById('helpBtn').addEventListener('click', () => {
  renderHelpView();
}, { once: true });
