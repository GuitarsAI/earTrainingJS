// ─── Chord quiz ───────────────────────────────────────────────────────────────

function generateChordQuestion() {
  const pool = getActivePool();
  currentChord = pickRandom(pool); // POINT 10: uniform random, no adaptive weighting
  chordKeySigMode = 'C'; // POINT 32b: reset to C (accidentals inline) each new question

  // POINT 25: Slash chord path
  if (currentChord.family === 'slash') {
    currentSlashBassMidi = null;
    currentUpperRootMidi = null;
    // Choose upper root in a comfortable mid register — randomised like every other chord type
    const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
    const octave = 4; // Upper chord in oct 4
    currentUpperRootMidi = 12 + pitchClass + octave * 12;
    // bassInterval is the pitch-class offset UP from the upper root to the bass note;
    // the bass actually sounds BELOW the upper root, at the complementary distance.
    const belowSemitones = 12 - currentChord.bassInterval;
    currentSlashBassMidi = currentUpperRootMidi - belowSemitones;
    // Keep bass in a reasonable range (oct 2-3)
    while (currentSlashBassMidi > 48) currentSlashBassMidi -= 12;
    while (currentSlashBassMidi < 28) currentSlashBassMidi += 12;
    // Upper chord notes
    currentMidiNotes = currentChord.upperIntervals.map(i => currentUpperRootMidi + i);
    currentChordRootMidi = currentUpperRootMidi;
    currentVoicingMode = 'full';
    resetQuizUI();
    updateRootBadge(getSlashChordRootLabel());
    renderAnswers(pool, submitChordAnswer);
    renderControls(generateChordQuestion, playChord);
    return;
  }

  // POINT 26: Polychord path
  if (currentChord.family === 'poly') {
    currentSlashBassMidi = null; currentUpperRootMidi = null;
    currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;
    const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
    currentPolyUpperRootMidi = 12 + pitchClass + 5 * 12; // upper root oct 5
    currentPolyLowerRootMidi = currentPolyUpperRootMidi - currentChord.lowerOffset;
    // Keep lower root in oct 3
    while (currentPolyLowerRootMidi > 48) currentPolyLowerRootMidi -= 12;
    while (currentPolyLowerRootMidi < 36) currentPolyLowerRootMidi += 12;
    currentPolyUpperMidi = currentChord.upperIntervals.map(i => currentPolyUpperRootMidi + i);
    currentPolyLowerMidi = currentChord.lowerIntervals.map(i => currentPolyLowerRootMidi + i);
    // currentMidiNotes holds all notes for shared pipeline
    currentMidiNotes = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
    currentChordRootMidi = currentPolyLowerRootMidi;
    currentVoicingMode = 'full';
    resetQuizUI();
    const upPc = currentPolyUpperRootMidi % 12;
    updateRootBadge(spelledNote(0, upPc, currentChord.upperSymbol));
    renderAnswers(pool, submitChordAnswer);
    renderControls(generateChordQuestion, playChord);
    return;
  }

  // POINT 26: UST path
  if (currentChord.family === 'ust') {
    currentSlashBassMidi = null; currentUpperRootMidi = null;
    currentPolyUpperMidi = []; currentPolyLowerMidi = [];
    currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
    const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
    currentUSTRootMidi = 12 + pitchClass + 4 * 12; // chord root (not played)
    currentUSTShellMidi = currentChord.shellIntervals.map(i => currentUSTRootMidi + i);
    const upperTriadRootMidi = currentUSTRootMidi + currentChord.upperTriadRoot;
    currentUSTUpperMidi = currentChord.upperTriadIntervals.map(i => upperTriadRootMidi + i);
    // Ensure shell stays below upper triad
    currentUSTShellMidi = currentUSTShellMidi.map(m => m < 48 ? m + 12 : m);
    currentMidiNotes = [...currentUSTShellMidi, ...currentUSTUpperMidi];
    currentChordRootMidi = currentUSTRootMidi;
    currentVoicingMode = 'full';
    resetQuizUI();
    const rootPc = currentUSTRootMidi % 12;
    // show root with correct quality spelling per shell type (POINT 35)
    const _ustBadgeSym = currentChord.shellQuality === 'min' ? 'min' : currentChord.shellQuality === 'maj7' ? 'maj' : '7';
    updateRootBadge(spelledNote(0, rootPc, _ustBadgeSym));
    renderAnswers(pool, submitChordAnswer);
    renderControls(generateChordQuestion, playChord);
    return;
  }

  // Normal chord path
  currentSlashBassMidi = null;
  currentUpperRootMidi = null;
  currentPolyUpperMidi = []; currentPolyLowerMidi = [];
  currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
  currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;
  const rootMidi = chooseRootMidi(currentChord);
  currentChordRootMidi = rootMidi;

  // POINT 23: resolve voicing mode per question
  currentVoicingMode = resolveVoicingMode();

  // Build full note list first
  const baseIntervals = currentChord.invIndex !== undefined
    ? currentChord.baseChord.intervals
    : currentChord.intervals;

  // Apply voicing to full (root-position) intervals, then re-apply inversion bass if needed
  const voicedIntervals = applyVoicingMode(baseIntervals, currentVoicingMode);
  if (currentChord.invIndex !== undefined) {
    // Re-apply inversion on the voiced subset
    currentMidiNotes = applyInversion(voicedIntervals, rootMidi, Math.min(currentChord.invIndex, voicedIntervals.length - 1));
  } else {
    currentMidiNotes = voicedIntervals.map(i => rootMidi + i);
  }

  resetQuizUI();
  updateRootBadge(getChordRootName());
  renderAnswers(pool, submitChordAnswer);
  renderControls(generateChordQuestion, playChord);
}

function submitChordAnswer(chosen, _el) {
  if (answered) return;
  answered = true;
  total++;

  const isCorrect = chosen.symbol === currentChord.symbol;
  revealDropdownAnswer(chosen.symbol, currentChord.symbol); // POINT 11
  recordAnswer(currentChord.symbol, currentChord.name, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent = streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
    document.getElementById('statusMsg').className = 'status-msg good';
  } else {
    streak = 0;
    // POINT 25/26: family-specific wrong label
    const wrongLabel = currentChord.family === 'slash'
      ? getSlashResolvedName()
      : currentChord.family === 'poly'
      ? getPolyChordLabel()
      : currentChord.family === 'ust'
      ? getUSTLabel()
      : `${getChordRootName()} ${currentChord.name}`;
    document.getElementById('statusMsg').textContent = `It was ${wrongLabel}`;
    document.getElementById('statusMsg').className = 'status-msg bad';
  }
  updateScore();
  // Set dictInversionIndex to match what was actually quizzed, so breakdown + chips are in sync
  dictInversionIndex = currentChord.invIndex ?? 0;
  showNotation();
  renderControls(generateChordQuestion, playChord);
}
