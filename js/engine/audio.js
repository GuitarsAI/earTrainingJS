// ─── Audio ────────────────────────────────────────────────────────────────────

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

function setPlayingState(on) {
  const btn = document.getElementById('playBtn');
  btn.classList.toggle('playing', on);
  btn.textContent = on ? '\u266A' : '\u25B6';
}

// Play a list of midi notes with optional melodic delay between them
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
    // Melodic: ascending or descending
    const ordered = style === 'descending' ? [...midiNotes].reverse() : [...midiNotes];
    const gap = 0.55; // seconds between notes
    ordered.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.6, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), (ordered.length * gap + 1.2) * 1000);
  }
}

// POINT 6: Chord playback with all modes
function resolveChordStyle() {
  if (chordPlayStyle === 'random') {
    const opts = ['block', 'ascending', 'descending', 'broken'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return chordPlayStyle;
}

function playChord() {
  if (!piano) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;

  currentChordPlayStyle = resolveChordStyle(); // POINT 32: store so showNotation mirrors playback
  const style = currentChordPlayStyle;
  // POINT 25: merge bass note for slash; POINT 26: poly/UST already have all notes in currentMidiNotes
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
    // Root – top – 2nd – top pattern (classical broken chord feel)
    const root = notes[0];
    const top  = notes[notes.length - 1];
    const mid  = notes.length > 2 ? notes[1] : notes[0];
    const pattern = [root, top, mid, top];
    const gap = 0.28;
    pattern.forEach((midi, i) => piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 2.2, gain: 1.4 }));
    setTimeout(() => setPlayingState(false), (pattern.length * gap + 1.2) * 1000);
  }
}

// POINT 20b: Resolve interval style — if random, pick from the three concrete options
function resolveIntervalStyle() {
  if (intervalStyle === 'random') {
    const opts = ['harmonic', 'ascending', 'descending'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return intervalStyle;
}

// POINT 20b: Resolve scale direction — if random, pick from the three concrete options
function resolveScaleDir() {
  if (scaleDirection === 'random') {
    const opts = ['asc', 'desc', 'both'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return scaleDirection;
}

// POINT 5: Play the current interval in the chosen style
function playInterval() {
  currentIntervalStyle = resolveIntervalStyle(); // POINT 20b: resolve + store for notation/breakdown
  playMidiNotes(currentIntervalMidi, currentIntervalStyle);
}

// POINT 7: Play the current scale in chosen direction
function playScale() {
  if (!piano || !currentScale) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;
  const gap = 0.38; // seconds per note

  const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
  const descNotes = [...ascNotes].reverse();

  currentScaleDir = resolveScaleDir(); // POINT 20b: resolve random and store for notation/breakdown
  if (answered) showNotation();        // sync notation to what's about to play
  let sequence;
  if (currentScaleDir === 'asc')  sequence = ascNotes;
  else if (currentScaleDir === 'desc') sequence = descNotes;
  else sequence = [...ascNotes, ...descNotes.slice(1)]; // both: up then down, share top note

  sequence.forEach((midi, i) => {
    piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.5, gain: 1.3 });
  });
  setTimeout(() => setPlayingState(false), (sequence.length * gap + 1.0) * 1000);
}

// POINT 8: "Hear slowly" — plays current sound at half speed
function playSlowly() {
  if (!piano || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  setPlayingState(true);
  const now = audioCtx.currentTime;

  if (currentMode === 'scales') {
    const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
    const descNotes = [...ascNotes].reverse();
    const seq = currentScaleDir === 'desc' ? descNotes          // POINT 20b: use stored resolved dir
              : currentScaleDir === 'both' ? [...ascNotes, ...descNotes.slice(1)]
              : ascNotes;
    const gap = 0.76; // double the normal 0.38
    seq.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: gap * 1.5, gain: 1.3 });
    });
    setTimeout(() => setPlayingState(false), (seq.length * gap + 1.0) * 1000);
  } else if (currentMode === 'intervals') {
    const notes = currentIntervalStyle === 'descending' ? [...currentIntervalMidi].reverse() : [...currentIntervalMidi]; // POINT 20b: use stored style
    const gap = currentIntervalStyle === 'harmonic' ? 0 : 1.1;
    notes.forEach((midi, i) => {
      piano.play(midiToSoundFontName(midi), now + i * gap, { duration: 2.5, gain: 1.4 });
    });
    setTimeout(() => setPlayingState(false), (notes.length * gap + 2.5) * 1000);
  } else if (currentMode === 'chords' && resolutionActive) {
    // In resolution view: slow arpeggio source → pause → slow arpeggio resolution
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
    // Chords: always slow arpeggio ascending regardless of playback style
    // POINT 25: merge bass note into full set for slash chords; POINT 26: poly/UST already merged
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

