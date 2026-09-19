/**
 * @file intervals-mode.js
 * @description Interval quiz mode: question generation and answer grading.
 *   Playback lives in audio.js. Notation lives in notation.js.
 * @layer modes
 * @requires state.js, defaults.js, helpers.js, spelling.js, intervals.js,
 *           audio.js, notation.js, controls.js
 */

// ─── Question generation ──────────────────────────────────────────────────────

/**
 * Picks a random interval from the active pool, sets up playback state,
 * and renders the answer dropdown and controls.
 *
 * Root is chosen by chooseSimpleRootMidi() so the top note stays within
 * a comfortable range. The full pool is always offered as answer options —
 * the user identifies from every interval they have selected, not just a
 * filtered subset. Resets intervalKeySigMode to 'C' on every new question.
 */
function generateIntervalQuestion() {
  const pool = getActiveIntervalPool();
  currentInterval = pickRandom(pool); // uniform random — no adaptive weighting
  intervalKeySigMode = 'C'; // reset to C (accidentals inline) each new question
  const rootMidi = chooseSimpleRootMidi(currentInterval.semitones);
  currentIntervalMidi = [rootMidi, rootMidi + currentInterval.semitones];

  resetQuizUI();
  updateRootBadge(spelledNote(0, rootMidi % 12, currentInterval.symbol));
  renderAnswers(pool, submitIntervalAnswer); // full pool as answer options
  renderControls(generateIntervalQuestion, playInterval);
}

// ─── Answer grading ───────────────────────────────────────────────────────────

/**
 * Grades the user's chosen answer against the current interval. Updates
 * score, streak, and status message; reveals the correct answer in the
 * dropdown; then shows notation and re-renders controls with the Next button.
 *
 * @param {object} chosen - The interval descriptor the user selected.
 * @param {Element} _el   - The dropdown element (unused; kept for call-site consistency).
 */
function submitIntervalAnswer(chosen, _el) {
  if (answered) return;
  answered = true;
  total++;

  const isCorrect = chosen.symbol === currentInterval.symbol;
  revealDropdownAnswer(chosen.symbol, currentInterval.symbol);
  recordAnswer(currentInterval.symbol, currentInterval.name, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent =
      streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
    document.getElementById('statusMsg').className = 'status-msg good';
  } else {
    streak = 0;
    document.getElementById('statusMsg').textContent = `It was ${currentInterval.name}`;
    document.getElementById('statusMsg').className = 'status-msg bad';
  }

  updateScore();
  showNotation();
  renderControls(generateIntervalQuestion, playInterval);
}

// @file-end — The Sound Travels Ear Training © 2026
