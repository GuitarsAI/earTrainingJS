/**
 * @file chords-mode.js
 * @description Chord quiz mode: question generation, answer grading, and voice leading
 *   analysis cache. Handles all four chord families (normal, slash, polychord, UST)
 *   through dedicated paths in generateChordQuestion().
 *   Playback lives in controls.js. Notation lives in notation.js.
 *   Dictionary functions (dict pool panel, dictShowChord) live in app.js.
 * @layer modes
 * @requires state.js, defaults.js, helpers.js, spelling.js, voicings.js,
 *           audio.js, notation.js, controls.js, pool.js, voiceLeading.js
 */

// ─── Question generation ──────────────────────────────────────────────────────

/**
 * Picks a random chord from the active pool and sets up all playback state,
 * then renders the answer dropdown and controls. Handles four families via
 * early-return paths before falling through to the normal chord path.
 *
 * Resets chordKeySigMode to 'C' and clears currentVoiceLeadingAnalysis on
 * every new question.
 */
function generateChordQuestion() {
  const pool = getActivePool();
  currentChord = pickRandom(pool); // uniform random — no adaptive weighting
  chordKeySigMode = 'C'; // reset to C (accidentals inline) each new question
  currentVoiceLeadingAnalysis = null; // reset voice leading cache each new question

  // ── Slash chord path ─────────────────────────────────────────────────────────
  // Bass note placed below the upper chord; upper root anchored to octave 4.
  // currentSlashBassMidi is clamped to MIDI 28–48 so it sits convincingly below.
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

  // ── Polychord path ───────────────────────────────────────────────────────────
  // Upper triad anchored to octave 5; lower triad offset by lowerOffset semitones.
  // Lower root clamped to MIDI 36–48 to keep the two triads clearly separated.
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

  // ── UST path ─────────────────────────────────────────────────────────────────
  // Shell voiced in octave 4; shell notes bumped up an octave if below MIDI 48
  // so the upper triad sits clearly above. Root badge reflects shell quality
  // (dom7 → '7', minor shell → 'min', Maj7 shell → 'maj').
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
    const ustBadgeSym = currentChord.shellQuality === 'min' ? 'min'
      : currentChord.shellQuality === 'maj7' ? 'maj'
      : '7';
    updateRootBadge(spelledNote(0, rootPc, ustBadgeSym));
    renderAnswers(pool, submitChordAnswer);
    renderControls(generateChordQuestion, playChord);
    return;
  }

  // ── Normal chord path (including inversions) ─────────────────────────────────
  // Root chosen by chooseRootMidi(); voicing resolved by resolveVoicingMode().
  // For inversions, voiced MIDI notes are sorted and rotated so the correct
  // bass note (invIndex) is the lowest pitch.
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
    // Rotate voiced notes so the inversion bass note is the lowest pitch
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

// ─── Answer grading ───────────────────────────────────────────────────────────

/**
 * Grades the user's chosen answer against the current chord. Updates score,
 * streak, and status message; reveals the correct answer in the dropdown;
 * computes and caches the voice leading analysis; then shows notation and
 * re-renders controls with the Next button.
 *
 * @param {object} chosen - The chord descriptor the user selected.
 * @param {Element} _el   - The dropdown element (unused; kept for call-site consistency).
 */
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
    document.getElementById('statusMsg').textContent =
      streak >= 3 ? `${streak} in a row! \uD83C\uDFB9` : 'Correct!';
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

  // Compute and cache voice leading analysis once at answer-reveal time,
  // before showBreakdown() consumes it. Reset each new question above.
  currentVoiceLeadingAnalysis = _buildVoiceLeadingAnalysis();

  showNotation();
  renderControls(generateChordQuestion, playChord);
}

// ─── Voice leading analysis ───────────────────────────────────────────────────

/**
 * Builds the voice leading analysis for the current chord state and returns it.
 * Called once at answer-reveal time; result cached in currentVoiceLeadingAnalysis
 * and consumed by showBreakdown(). Returns null if the engine is unavailable or
 * state is incomplete.
 *
 * Each family uses a different input strategy:
 * - Slash: upper chord only — bass note is a label modifier, not harmonic identity.
 * - Poly: upper + lower merged; lower root used; context discovery skipped (polytonal).
 * - UST: implied intervals reconstructed from shell + upper triad data.
 * - Normal/inversion: pitch classes derived from canonical intervals, not voiced MIDI
 *   notes — voicing can omit or alter notes and cause wrong scale matches.
 *
 * @returns {object|null} Voice leading analysis object from analyseChord(), or null.
 */
function _buildVoiceLeadingAnalysis() {
  if (typeof analyseChord !== 'function') return null;
  if (!currentChord || !currentChordRootMidi) return null;

  const toPc = m => ((m % 12) + 12) % 12;

  // ── Slash chord ──────────────────────────────────────────────────────────────
  if (currentChord.family === 'slash' && currentUpperRootMidi !== null) {
    const rootPc = toPc(currentUpperRootMidi);
    const pitchClasses = currentMidiNotes.map(toPc);
    return analyseChord(rootPc, pitchClasses, currentChord.upperIntervals, currentMidiNotes, 'slash');
  }

  // ── Polychord ────────────────────────────────────────────────────────────────
  if (currentChord.family === 'poly' && currentPolyLowerRootMidi !== null) {
    const rootPc = toPc(currentPolyLowerRootMidi);
    const allMidi = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
    const pitchClasses = allMidi.map(toPc);
    return analyseChord(rootPc, pitchClasses, null, allMidi, 'poly');
  }

  // ── UST ──────────────────────────────────────────────────────────────────────
  // Reconstruct implied intervals from shell + upper triad — all from chord data,
  // no lookup needed.
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
  // Use canonical intervals rather than voiced MIDI notes to avoid scale mismatches
  // (e.g. a voiced G7 missing the fifth could match F major instead of C major).
  const rootPc = toPc(currentChordRootMidi);
  const baseChord = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  const pitchClasses = baseChord.intervals.map(i => (rootPc + i) % 12);
  return analyseChord(rootPc, pitchClasses, baseChord.intervals, currentMidiNotes, baseChord.family);
}

// @file-end — The Sound Travels Ear Training © 2026
