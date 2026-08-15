// ─── Chord quiz ───────────────────────────────────────────────────────────────

function generateChordQuestion() {
  const pool = getActivePool();
  currentChord = pickRandom(pool); // POINT 10: uniform random, no adaptive weighting
  chordKeySigMode = 'C'; // POINT 32b: reset to C (accidentals inline) each new question
  currentVoiceLeadingAnalysis = null; // POINT 37: reset cache for each new question

  // POINT 25: Slash chord path
  if (currentChord.family === 'slash') {
    currentSlashBassMidi = null;
    currentUpperRootMidi = null;
    const pitchClass = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
    const octave = 4;
    currentUpperRootMidi = 12 + pitchClass + octave * 12;
    const belowSemitones = 12 - currentChord.bassInterval;
    currentSlashBassMidi = currentUpperRootMidi - belowSemitones;
    while (currentSlashBassMidi > 48) currentSlashBassMidi -= 12;
    while (currentSlashBassMidi < 28) currentSlashBassMidi += 12;
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
    currentPolyUpperRootMidi = 12 + pitchClass + 5 * 12;
    currentPolyLowerRootMidi = currentPolyUpperRootMidi - currentChord.lowerOffset;
    while (currentPolyLowerRootMidi > 48) currentPolyLowerRootMidi -= 12;
    while (currentPolyLowerRootMidi < 36) currentPolyLowerRootMidi += 12;
    currentPolyUpperMidi = currentChord.upperIntervals.map(i => currentPolyUpperRootMidi + i);
    currentPolyLowerMidi = currentChord.lowerIntervals.map(i => currentPolyLowerRootMidi + i);
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
    currentUSTRootMidi = 12 + pitchClass + 4 * 12;
    currentUSTShellMidi = currentChord.shellIntervals.map(i => currentUSTRootMidi + i);
    const upperTriadRootMidi = currentUSTRootMidi + currentChord.upperTriadRoot;
    currentUSTUpperMidi = currentChord.upperTriadIntervals.map(i => upperTriadRootMidi + i);
    currentUSTShellMidi = currentUSTShellMidi.map(m => m < 48 ? m + 12 : m);
    currentMidiNotes = [...currentUSTShellMidi, ...currentUSTUpperMidi];
    currentChordRootMidi = currentUSTRootMidi;
    currentVoicingMode = 'full';
    resetQuizUI();
    const rootPc = currentUSTRootMidi % 12;
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
  currentVoicingMode = resolveVoicingMode();

  const baseIntervals = currentChord.invIndex !== undefined
    ? currentChord.baseChord.intervals
    : currentChord.intervals;

  const voicedMidi = applyVoicing(rootMidi, baseIntervals, currentVoicingMode);
  if (currentChord.invIndex !== undefined) {
    // Inversion: rotate the voiced MIDI notes so the correct bass note is lowest
    const invIdx = Math.min(currentChord.invIndex, voicedMidi.length - 1);
    const sorted = [...voicedMidi].sort((a, b) => a - b);
    for (let i = 0; i < invIdx; i++) {
      const lowest = sorted.shift();
      sorted.push(lowest + 12);
    }
    currentMidiNotes = sorted;
  } else {
    currentMidiNotes = voicedMidi;
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
  revealDropdownAnswer(chosen.symbol, currentChord.symbol);
  recordAnswer(currentChord.symbol, currentChord.name, isCorrect);
  updateRootBadge(null);

  if (isCorrect) {
    correct++; streak++;
    document.getElementById('statusMsg').textContent = streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
    document.getElementById('statusMsg').className = 'status-msg good';
  } else {
    streak = 0;
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
  dictInversionIndex = currentChord.invIndex ?? 0;

  // POINT 37: compute and cache voice leading analysis now, once, before showBreakdown()
  // uses it. Reset on each new question in generateChordQuestion().
  currentVoiceLeadingAnalysis = _buildVoiceLeadingAnalysis();

  showNotation();
  renderControls(generateChordQuestion, playChord);
}

// POINT 37: Build the voice leading analysis for the current chord state.
// Called once at answer-reveal time; result cached in currentVoiceLeadingAnalysis.
// Returns the result of analyseChord() or null if the engine is unavailable.
function _buildVoiceLeadingAnalysis() {
  if (typeof analyseChord !== 'function') return null;
  if (!currentChord || !currentChordRootMidi) return null;

  const toPc = m => ((m % 12) + 12) % 12;

  // ── Slash chord ──────────────────────────────────────────────────────────────
  // Analyse the upper chord only; bass note is a label modifier, not harmonic identity.
  if (currentChord.family === 'slash' && currentUpperRootMidi !== null) {
    const rootPc = toPc(currentUpperRootMidi);
    const pitchClasses = currentMidiNotes.map(toPc);
    return analyseChord(rootPc, pitchClasses, currentChord.upperIntervals, currentMidiNotes, 'slash');
  }

  // ── Polychord ────────────────────────────────────────────────────────────────
  // Merge upper + lower; use lower root; skip context discovery (polytonal by design).
  if (currentChord.family === 'poly' && currentPolyLowerRootMidi !== null) {
    const rootPc = toPc(currentPolyLowerRootMidi);
    const allMidi = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
    const pitchClasses = allMidi.map(toPc);
    return analyseChord(rootPc, pitchClasses, null, allMidi, 'poly');
  }

  // ── UST ──────────────────────────────────────────────────────────────────────
  // Construct implied chord pitch classes from shell + upper triad intervals.
  // All values come directly from the chord data entry — no lookup needed.
  if (currentChord.family === 'ust' && currentUSTRootMidi !== null) {
    const rootPc = toPc(currentUSTRootMidi);
    const impliedIntervals = [
      ...currentChord.shellIntervals,
      ...currentChord.upperTriadIntervals.map(i => i + currentChord.upperTriadRoot),
    ];
    const pitchClasses = impliedIntervals.map(i => (i % 12 + 12) % 12);
    const allMidi = [...currentUSTShellMidi, ...currentUSTUpperMidi];
    return analyseChord(rootPc, pitchClasses, impliedIntervals, allMidi, 'ust');
  }

  // ── Normal chord (including inversions) ──────────────────────────────────────
  // Derive pitch classes from the chord's canonical intervals, not from voiced
  // MIDI notes — voicing can omit or alter notes depending on mode/register,
  // which causes wrong scale matches (e.g. G7 matching F major instead of C major).
  const rootPc = toPc(currentChordRootMidi);
  const baseChord = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const pitchClasses = baseChord.intervals.map(i => (rootPc + i) % 12);
  return analyseChord(rootPc, pitchClasses, baseChord.intervals, currentMidiNotes, baseChord.family);
}
