/**
 * @file audio.js
 * @description Web Audio API lifecycle and soundfont playback for all four
 *   practice modes. Owns AudioContext initialisation, instrument loading,
 *   play-state UI feedback, and every mode's playback function. Contains no
 *   music theory logic — it consumes MIDI note arrays produced by mode files
 *   and schedules them via soundfont-player.
 *
 *   Production note: initAudio() must be updated before the v1.0.0 build to
 *   point at the self-hosted soundfont path per §4.3 of the production plan.
 *
 * @module Audio
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// ── Initialisation ────────────────────────────────────────────────────────────

/**
 * Creates the AudioContext and loads the acoustic grand piano soundfont.
 * Races the Soundfont.instrument() call against a 12-second timeout so the
 * app degrades gracefully on slow or offline connections. On success, assigns
 * the instrument to `piano`, re-enables #playBtn, and updates the hint text.
 * On failure, shows an error message in #chordHint.
 *
 * @returns {void}
 */
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 12000)
  );

  Promise.race([
    Soundfont.instrument(audioCtx, 'acoustic_grand_piano', { soundfont: 'MusyngKite' }),
    timeout
  ])
    .then(inst => {
      piano = inst;
      document.getElementById('chordHint').textContent = 'Press play to hear';
      const btn = document.getElementById('playBtn');
      btn.disabled = false;
      btn.textContent = '\u25B6';
    })
    .catch(() => {
      document.getElementById('chordHint').textContent = 'Audio unavailable — check your connection.';
    });
}

// ── Play state ────────────────────────────────────────────────────────────────

/**
 * Toggles the visual playing state of #playBtn. When on, applies the
 * 'playing' CSS class and shows the music note icon (♩). When off, removes
 * the class and restores the play icon (▶).
 *
 * @param {boolean} on - True to enter playing state; false to exit.
 * @returns {void}
 */
function setPlayingState(on) {
  const btn = document.getElementById('playBtn');
  btn.classList.toggle('playing', on);
  btn.textContent = on ? '\u266A' : '\u25B6';
}

// ── General MIDI playback ─────────────────────────────────────────────────────

/**
 * Plays a list of MIDI notes in the requested style. Used by playInterval().
 * Resumes a suspended AudioContext before scheduling notes.
 *
 * Styles:
 * - 'harmonic'   — all notes simultaneously; playing state clears after 2.2s.
 * - 'ascending'  — notes from lowest to highest, 0.55s apart.
 * - 'descending' — notes from highest to lowest, 0.55s apart.
 *
 * @param {number[]} midiNotes - MIDI note numbers to play, in any order.
 * @param {string} style - Playback style: 'harmonic' | 'ascending' | 'descending'.
 * @returns {void}
 */
function playMidiNotes(midiNotes, style) {
  if (!piano) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;

  if (style === 'harmonic') {
    midiNotes.forEach(midi => {
      piano.play(midiToSoundFontName(midi), now, { duration: 2, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), 2200);
  } else {
    const ordered = style === 'descending' ? [...midiNotes].reverse() : [...midiNotes];
    const gap = 0.55;
    ordered.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.6, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), (ordered.length * gap + 1.2) * 1000);
  }
}

// ── Chord playback ────────────────────────────────────────────────────────────

/**
 * Resolves chordPlayStyle to a concrete playback style for the current
 * question. If chordPlayStyle is 'random', picks uniformly from the four
 * concrete options. Otherwise returns chordPlayStyle unchanged.
 *
 * @returns {string} Concrete style: 'block' | 'ascending' | 'descending' | 'broken'.
 */
function resolveChordStyle() {
  if (chordPlayStyle === 'random') {
    const opts = ['block', 'ascending', 'descending', 'broken'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return chordPlayStyle;
}

/**
 * Plays the current chord question. Resolves and stores the playback style in
 * currentChordPlayStyle so showNotation() can mirror exactly what was heard.
 * For slash chords, prepends currentSlashBassMidi to the note set before
 * sorting — poly and UST notes are already fully assembled in currentMidiNotes.
 *
 * Styles:
 * - 'block'      — all notes simultaneously.
 * - 'ascending'  — notes low to high, 0.18s apart.
 * - 'descending' — notes high to low, 0.18s apart.
 * - 'broken'     — root → top → 2nd → top pattern, 0.28s apart (classical
 *                  broken chord feel; falls back to root when only two notes).
 *
 * @returns {void}
 */
function playChord() {
  if (!piano) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;

  // Resolve and store so showNotation() mirrors the playback order actually heard
  currentChordPlayStyle = resolveChordStyle();
  const style = currentChordPlayStyle;

  // Slash chords carry their bass note separately; poly and UST are pre-merged
  const allNotes = currentChord?.family === 'slash' && currentSlashBassMidi !== null
    ? [currentSlashBassMidi, ...currentMidiNotes]
    : [...currentMidiNotes];
  const notes = allNotes.sort((a, b) => a - b);

  if (style === 'block') {
    notes.forEach(midi => piano.play(midiToSoundFontName(midi), now, { duration: 2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), 2400);

  } else if (style === 'ascending') {
    const gap = 0.18;
    notes.forEach((midi, i) => piano.play(midiToSoundFontName(midi), now + i * gap, { duration: 2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), (notes.length * gap + 2) * 1000);

  } else if (style === 'descending') {
    const gap = 0.18;
    [...notes].reverse().forEach((midi, i) => piano.play(midiToSoundFontName(midi), now + i * gap, { duration: 2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), (notes.length * gap + 2) * 1000);

  } else if (style === 'broken') {
    // Root – top – 2nd – top: a four-note pattern giving a classical broken chord feel
    const root = notes[0];
    const top  = notes[notes.length - 1];
    const mid  = notes.length > 2 ? notes[1] : notes[0];
    const pattern = [root, top, mid, top];
    const gap = 0.28;
    pattern.forEach((midi, i) => piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 2.2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), (pattern.length * gap + 1.2) * 1000);
  }
}

// ── Interval playback ─────────────────────────────────────────────────────────

/**
 * Resolves intervalStyle to a concrete playback style for the current question.
 * If intervalStyle is 'random', picks uniformly from the three concrete options.
 *
 * @returns {string} Concrete style: 'harmonic' | 'ascending' | 'descending'.
 */
function resolveIntervalStyle() {
  if (intervalStyle === 'random') {
    const opts = ['harmonic', 'ascending', 'descending'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return intervalStyle;
}

/**
 * Plays the current interval question. Resolves and stores the style in
 * currentIntervalStyle so the breakdown and notation display what was heard,
 * then delegates to playMidiNotes().
 *
 * @returns {void}
 */
function playInterval() {
  currentIntervalStyle = resolveIntervalStyle();
  playMidiNotes(currentIntervalMidi, currentIntervalStyle);
}

// ── Scale playback ────────────────────────────────────────────────────────────

/**
 * Resolves scaleDirection to a concrete direction for the current question.
 * If scaleDirection is 'random', picks uniformly from the three concrete options.
 *
 * @returns {string} Concrete direction: 'asc' | 'desc' | 'both'.
 */
function resolveScaleDir() {
  if (scaleDirection === 'random') {
    const opts = ['asc', 'desc', 'both'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return scaleDirection;
}

/**
 * Plays the current scale question. Resolves and stores the direction in
 * currentScaleDir, then builds the note sequence and schedules playback at
 * 0.38s per note. If the question has already been answered, calls
 * showNotation() to sync the notation display before playing.
 *
 * For 'both', the ascending and descending sequences share the top note
 * (descNotes starts at index 1) to avoid repeating the octave.
 *
 * @returns {void}
 */
function playScale() {
  if (!piano || !currentScale) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;
  const gap = 0.38;

  const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
  const descNotes = [...ascNotes].reverse();

  currentScaleDir = resolveScaleDir();
  if (answered) showNotation();

  let sequence;
  if (currentScaleDir === 'asc')       sequence = ascNotes;
  else if (currentScaleDir === 'desc') sequence = descNotes;
  else                                 sequence = [...ascNotes, ...descNotes.slice(1)];

  sequence.forEach((midi, i) => {
    piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.5, gain: 1.3 });
  });
  setTimeout(() => setPlayingState(false), (sequence.length * gap + 1.0) * 1000);
}

// ── Slow playback ─────────────────────────────────────────────────────────────

/**
 * Replays the current question at half speed. Uses the stored resolved style
 * and direction (currentIntervalStyle, currentScaleDir, currentChordPlayStyle)
 * rather than re-resolving, so slow replay always matches what was originally
 * heard. Dispatches to playProgressionSlowly() for progressions mode.
 *
 * Mode-specific behaviour:
 * - Scales      — same direction as original playback, note gap doubled to 0.76s.
 * - Intervals   — same style as original; harmonic stays simultaneous, melodic
 *                 gap extended to 1.1s.
 * - Chords (resolution view) — slow ascending arpeggio of source chord, 0.5s
 *                 pause, then slow ascending arpeggio of resolution target.
 * - Chords      — always slow ascending arpeggio at 0.5s gap, regardless of
 *                 the original playback style.
 *
 * @returns {void}
 */
function playSlowly() {
  if (!piano || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;

  if (currentMode === 'progressions') {
    playProgressionSlowly();
    return;
  }

  if (currentMode === 'scales') {
    const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
    const descNotes = [...ascNotes].reverse();
    const seq = currentScaleDir === 'desc' ? descNotes
              : currentScaleDir === 'both' ? [...ascNotes, ...descNotes.slice(1)]
              : ascNotes;
    const gap = 0.76;
    seq.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.5, gain: 1.3 });
    });
    setTimeout(() => setPlayingState(false), (seq.length * gap + 1.0) * 1000);

  } else if (currentMode === 'intervals') {
    const notes = currentIntervalStyle === 'descending'
      ? [...currentIntervalMidi].reverse()
      : [...currentIntervalMidi];
    const gap = currentIntervalStyle === 'harmonic' ? 0 : 1.1;
    notes.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: 2.5, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), (notes.length * gap + 2.5) * 1000);

  } else if (currentMode === 'chords' && resolutionActive) {
    // Resolution view: slow arpeggio of source → 0.5s pause → slow arpeggio of target
    const info = getResolutionInfo();
    if (!info) { setPlayingState(false); return; }
    const sourceMidi = getSourceMidi().sort((a, b) => a - b);
    const tgtMidi    = info.targetMidi.sort((a, b) => a - b);
    const gap = 0.5;
    const srcDur = sourceMidi.length * gap + 2.5;
    sourceMidi.forEach((m, i) => piano.play(midiToSoundFontName(m), now + i * gap, { duration: 2.5, gain: 1.4 }));
    const tgtStart = now + srcDur + 0.5;
    tgtMidi.forEach((m, i) => piano.play(midiToSoundFontName(m), tgtStart + i * gap, { duration: 2.5, gain: 1.4 }));
    const totalMs = (tgtStart - now + tgtMidi.length * gap + 2.5) * 1000;
    setTimeout(() => setPlayingState(false), totalMs);

  } else {
    // Chords: always slow ascending arpeggio regardless of original playback style
    const allNotes = currentChord?.family === 'slash' && currentSlashBassMidi !== null
      ? [currentSlashBassMidi, ...currentMidiNotes]
      : [...currentMidiNotes];
    const notes = allNotes.sort((a, b) => a - b);
    const gap = 0.5;
    notes.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: 2.5, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), (notes.length * gap + 2.5) * 1000);
  }
}

// =============================================================================
// The Sound Travels Ear Training — audio.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
