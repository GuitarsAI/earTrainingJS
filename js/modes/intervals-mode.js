// ─── Interval quiz (POINT 5) ─────────────────────────────────────────────────

function generateIntervalQuestion() {
  const pool = getActiveIntervalPool();
  currentInterval = pickRandom(pool); // POINT 10: uniform random
  intervalKeySigMode = 'C'; // POINT 32b: reset to C (accidentals inline) each new question
  const rootMidi = chooseSimpleRootMidi(currentInterval.semitones); // POINT 12
  currentIntervalMidi = [rootMidi, rootMidi + currentInterval.semitones];

  resetQuizUI();
  updateRootBadge(spelledNote(0, rootMidi % 12, currentInterval.symbol)); // POINT 13
  renderAnswers(pool, submitIntervalAnswer); // POINT 10: full pool as answer options
  renderControls(generateIntervalQuestion, playInterval);
}

function submitIntervalAnswer(chosen, _el) {
  if (answered) return;
  answered = true;
  total++;

  const isCorrect = chosen.symbol === currentInterval.symbol;
  revealDropdownAnswer(chosen.symbol, currentInterval.symbol); // POINT 11
  recordAnswer(currentInterval.symbol, currentInterval.name, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent = streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
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
