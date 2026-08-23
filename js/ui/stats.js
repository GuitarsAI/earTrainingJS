/**
 * @file stats.js
 * @description UI reset and score display helpers for The Sound Travels Ear Training.
 * Handles between-question UI teardown and the score bar update. Note that the
 * heavier session tracking logic — `resetSession()`, `recordAnswer()`,
 * `renderStats()`, and `updateRootBadge()` — lives in `helpers.js` (Layer 3),
 * where it was built alongside the pool and session state it depends on.
 *
 * Responsibilities:
 *   - `resetQuizUI()`  — clears all per-question UI state before a new question
 *   - `updateScore()`  — writes correct / total / streak counters to the DOM
 *
 * Dependencies (globals from earlier layers):
 *   `answered`, `resolutionActive`, `resolutionRootMidi`, `dictInversionIndex`,
 *   `teardownProgressionUI`, `hideBreakdown`
 *
 * Load order: after `pool.js`, before `chords-mode.js`.
 *
 * @module stats
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// ─── UI reset ─────────────────────────────────────────────────────────────────

/**
 * Resets all per-question UI state in preparation for a new question. Called at
 * the start of every `generateQuestion()` cycle and on session reset.
 *
 * Clears: the `answered` flag, resolution state, inversion index, notation
 * panels, status message, answer dropdown, and the breakdown panel. Also calls
 * `teardownProgressionUI()` to remove any progression-specific DOM residue.
 *
 * @returns {void}
 */
function resetQuizUI() {
  answered = false;
  resolutionActive  = false;
  resolutionRootMidi = null;
  dictInversionIndex = 0;
  teardownProgressionUI();
  document.getElementById('notationArea').style.display        = 'none';
  document.getElementById('notationPanel').style.display       = 'none';
  document.getElementById('inversionChipRow').style.display    = 'none';
  document.getElementById('statusMsg').textContent             = '';
  document.getElementById('statusMsg').className               = 'status-msg';
  document.getElementById('answerDropdownWrap').style.display  = 'none';
  hideBreakdown();
}

// ─── Score display ────────────────────────────────────────────────────────────

/**
 * Writes the current session counters to the score bar DOM elements.
 * Called after every answer is recorded.
 *
 * Reads the global variables `correct`, `total`, and `streak` from `state.js`
 * and pushes them to `#correct`, `#total`, and `#streak` respectively.
 *
 * @returns {void}
 */
function updateScore() {
  document.getElementById('correct').textContent = correct;
  document.getElementById('total').textContent   = total;
  document.getElementById('streak').textContent  = streak;
}

// ─────────────────────────────────────────────────────────────────────────────
// stats.js — The Sound Travels Ear Training
// © 2026 Renato Fera P. — The Sound Travels — MIT License
// ─────────────────────────────────────────────────────────────────────────────
