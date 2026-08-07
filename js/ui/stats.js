function resetQuizUI() {
  answered = false;
  resolutionActive = false; // POINT 37: reset resolution state
  resolutionRootMidi = null; // reset stored resolution root for new question
  dictInversionIndex = 0; // reset; will be set to quizzed inversion after answering
  teardownProgressionUI(); // POINT 38: clean up any progression DOM residue first
  document.getElementById('notationArea').style.display = 'none';
  document.getElementById('notationPanel').style.display = 'none';
  document.getElementById('inversionChipRow').style.display = 'none';
  document.getElementById('statusMsg').textContent = '';
  document.getElementById('statusMsg').className = 'status-msg';
  // POINT 11: Hide dropdown until renderAnswers populates it
  document.getElementById('answerDropdownWrap').style.display = 'none';
  hideBreakdown();
}

function updateScore() {
  document.getElementById('correct').textContent = correct;
  document.getElementById('total').textContent = total;
  document.getElementById('streak').textContent = streak;
}

