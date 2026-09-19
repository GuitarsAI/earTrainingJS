/**
 * @file scales-mode.js
 * @description Scale quiz mode: question generation and answer grading.
 *   Playback lives in audio.js. Notation lives in notation.js.
 * @layer modes
 * @requires state.js, defaults.js, helpers.js, spelling.js, scales.js,
 *           audio.js, notation.js, controls.js
 */

// ─── Question generation ──────────────────────────────────────────────────────

/**
 * Picks a random scale from the active pool, sets up playback state,
 * and renders the answer dropdown and controls.
 *
 * Root is chosen by chooseSimpleRootMidi() using the scale's octave span
 * (last interval value) so the top note stays within a comfortable range.
 * The full pool is always offered as answer options. Resets scaleKeySigMode
 * to 'key' on every new question — scales have a natural parent key, so Key
 * mode is the correct default (unlike chords and intervals which default to 'C').
 */
function generateScaleQuestion() {
  const pool = getActiveScalePool();
  currentScale = pickRandom(pool); // uniform random — no adaptive weighting
  currentScaleRootMidi = chooseSimpleRootMidi(currentScale.intervals[currentScale.intervals.length - 1]);
  scaleKeySigMode = 'key'; // reset to Key mode each new question (scales have a natural parent key)

  resetQuizUI();
  updateRootBadge(spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol));
  renderAnswers(pool, submitScaleAnswer); // full pool as answer options
  renderControls(generateScaleQuestion, playScale);
}

// ─── Answer grading ───────────────────────────────────────────────────────────

/**
 * Grades the user's chosen answer against the current scale. Updates score,
 * streak, and status message; reveals the correct answer in the dropdown;
 * then shows notation and re-renders controls with the Next button.
 *
 * Uses displayName over name where available — Pentatonic scales carry a dual
 * label (e.g. "Major Pentatonic / Ionian Pentatonic") in displayName that is
 * more informative than the bare name. The wrong-answer label includes the
 * spelled root name so the user sees the full answer (e.g. "It was D Dorian").
 *
 * @param {object} chosen - The scale descriptor the user selected.
 * @param {Element} _el   - The dropdown element (unused; kept for call-site consistency).
 */
function submitScaleAnswer(chosen, _el) {
  if (answered) return;
  answered = true;
  total++;

  const isCorrect = chosen.symbol === currentScale.symbol;
  revealDropdownAnswer(chosen.symbol, currentScale.symbol);
  const scaleLabel = currentScale.displayName || currentScale.name; // prefer dual label for Pentatonics
  recordAnswer(currentScale.symbol, scaleLabel, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent =
      streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
    document.getElementById('statusMsg').className = 'status-msg good';
  } else {
    streak = 0;
    const rootName = spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol);
    document.getElementById('statusMsg').textContent = `It was ${rootName} ${scaleLabel}`;
    document.getElementById('statusMsg').className = 'status-msg bad';
  }

  updateScore();
  showNotation();
  renderControls(generateScaleQuestion, playScale);
}

// @file-end — The Sound Travels Ear Training © 2026
