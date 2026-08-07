// ─── Scale quiz (POINT 7) ────────────────────────────────────────────────────

function generateScaleQuestion() {
  const pool = getActiveScalePool();
  currentScale = pickRandom(pool); // POINT 10: uniform random
  currentScaleRootMidi = chooseSimpleRootMidi(currentScale.intervals[currentScale.intervals.length - 1]); // POINT 12
  scaleKeySigMode = 'key';   // reset key sig chip each new question

  resetQuizUI();
  updateRootBadge(spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol)); // POINT 13
  renderAnswers(pool, submitScaleAnswer); // POINT 10: full pool as answer options
  renderControls(generateScaleQuestion, playScale);
}

function submitScaleAnswer(chosen, _el) {
  if (answered) return;
  answered = true;
  total++;

  const isCorrect = chosen.symbol === currentScale.symbol;
  revealDropdownAnswer(chosen.symbol, currentScale.symbol); // POINT 11
  const scaleLabel = currentScale.displayName || currentScale.name; // POINT 27: dual label
  recordAnswer(currentScale.symbol, scaleLabel, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent = streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
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
