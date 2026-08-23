/**
 * @file js/ui/controls.js
 * @description Answer dropdown and quiz control button renderers. Handles all
 * interactive UI in the answer area: building the dropdown list, revealing
 * correct/wrong feedback after submission, and rendering the post-answer
 * control buttons (Next, Hear Slowly, Resolve).
 *
 * @layer 5 — UI
 * @requires state.js    answered, currentMode, resolutionActive
 * @requires audio.js    playSlowly, playResolution
 */

// Module-scoped reference to the active outside-click listener.
// Stored here rather than on the DOM node to keep state in JS, not the DOM.
let outsideClickHandler = null;

// ---------------------------------------------------------------------------
// Answer dropdown
// ---------------------------------------------------------------------------

/**
 * Builds and displays the answer dropdown for a new question.
 *
 * Populates `#ansDropdownList` with one item per option, sorted
 * alphabetically. Wires the trigger button to open/close the list and
 * attaches a single outside-click listener that auto-removes itself after
 * firing. Any listener left over from the previous question is removed first
 * to prevent stacking.
 *
 * @param {Array<{name: string, displayName?: string, symbol: string}>} options
 *   The answer choices to display.
 * @param {function(object, HTMLElement): void} submitFn
 *   Callback invoked with the chosen option object and its list item element
 *   when the user selects an answer.
 * @returns {void}
 */
function renderAnswers(options, submitFn) {
  const wrap    = document.getElementById('answerDropdownWrap');
  const trigger = document.getElementById('ansDropdownTrigger');
  const list    = document.getElementById('ansDropdownList');

  wrap.style.display = '';
  trigger.textContent = 'Select your answer…';
  trigger.className = 'ans-dropdown-trigger';
  list.innerHTML = '';
  list.classList.remove('open');

  const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'ans-dropdown-item';
    el.textContent = item.displayName || item.name;
    el.dataset.symbol = item.symbol;
    el.addEventListener('click', () => {
      closeDropdown();
      submitFn(item, el);
    });
    list.appendChild(el);
  });

  function openDropdown() {
    if (trigger.classList.contains('disabled')) return;
    list.classList.add('open');
    trigger.classList.add('open');
  }

  function closeDropdown() {
    list.classList.remove('open');
    trigger.classList.remove('open');
  }

  trigger.onclick   = () => list.classList.contains('open') ? closeDropdown() : openDropdown();
  trigger.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown(); }
  };

  // Remove any listener left over from the previous question before adding a
  // new one, then auto-remove after the first outside click.
  if (outsideClickHandler) document.removeEventListener('click', outsideClickHandler);
  outsideClickHandler = function(e) {
    if (!wrap.contains(e.target)) {
      closeDropdown();
      document.removeEventListener('click', outsideClickHandler);
      outsideClickHandler = null;
    }
  };
  document.addEventListener('click', outsideClickHandler);
}

/**
 * Reveals correct/wrong feedback in the dropdown after the user has answered.
 *
 * Disables the trigger, closes the list, applies `.correct` or `.wrong`
 * classes to the appropriate list items, and updates the trigger label to
 * show the chosen answer name.
 *
 * @param {string} chosenSymbol  Internal symbol of the answer the user chose.
 * @param {string} correctSymbol Internal symbol of the correct answer.
 * @returns {void}
 */
function revealDropdownAnswer(chosenSymbol, correctSymbol) {
  const trigger = document.getElementById('ansDropdownTrigger');
  const list    = document.getElementById('ansDropdownList');

  trigger.classList.add('disabled');
  trigger.classList.remove('open');
  list.classList.remove('open');

  list.querySelectorAll('.ans-dropdown-item').forEach(el => {
    if (el.dataset.symbol === correctSymbol) {
      el.classList.add('correct');
      if (el.dataset.symbol === chosenSymbol) trigger.classList.add('correct');
    } else if (el.dataset.symbol === chosenSymbol) {
      el.classList.add('wrong');
    }
  });

  const chosenEl = list.querySelector(`[data-symbol="${chosenSymbol}"]`);
  if (chosenEl) trigger.textContent = chosenEl.textContent;
  if (chosenSymbol !== correctSymbol) trigger.classList.add('wrong');
}

// ---------------------------------------------------------------------------
// Control buttons
// ---------------------------------------------------------------------------

/**
 * Renders the post-answer control buttons into `#controls`.
 *
 * Clears and rebuilds the control area on every call. Before answering the
 * area is empty. After answering, up to three buttons appear:
 * - **Next** — always shown after answering; label adapts to the active mode.
 * - **Hear Slowly** — always shown after answering.
 * - **Resolve ↔ Chord** — shown after answering in Chords mode only; label
 *   reflects the current resolution toggle state.
 *
 * @param {function(): void} nextFn Callback for the Next button.
 * @param {function(): void} playFn Reserved parameter (playback is currently
 *   handled via the module-level `playSlowly` and `playResolution` globals;
 *   kept for API symmetry with future callers).
 * @returns {void}
 */
function renderControls(nextFn, playFn) {
  const c = document.getElementById('controls');
  c.innerHTML = '';

  if (answered) {
    const nb = document.createElement('button');
    nb.className = 'ctrl-btn primary';
    nb.id = 'nextBtn';
    nb.textContent = currentMode === 'intervals'    ? 'Next interval'
                   : currentMode === 'scales'       ? 'Next scale'
                   : currentMode === 'progressions' ? 'Next progression'
                   : 'Next chord';
    nb.addEventListener('click', nextFn);
    c.appendChild(nb);
  }

  if (answered) {
    const sb = document.createElement('button');
    sb.className = 'ctrl-btn slow';
    sb.textContent = '🐢 Hear slowly';
    sb.addEventListener('click', playSlowly);
    c.appendChild(sb);
  }

  if (answered && currentMode === 'chords') {
    const rb = document.createElement('button');
    rb.className = 'ctrl-btn resolve';
    rb.id = 'resolveBtn';
    rb.textContent = resolutionActive ? '← Chord' : 'Resolve →';
    rb.addEventListener('click', playResolution);
    c.appendChild(rb);
  }
}

/**
 * @file-end js/ui/controls.js
 * @copyright 2026 Renato Fera P. — The Sound Travels
 * @license MIT
 */
