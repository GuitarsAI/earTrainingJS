// ─── Notation ─────────────────────────────────────────────────────────────────
// POINT 1: Exact-octave notation, auto grand staff.

function midiToVexKeyExact(midi) {
  const VEX_NOTES = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];
  return VEX_NOTES[midi % 12] + '/' + (Math.floor(midi / 12) - 1);
}

// POINT 13: Updated to handle flat spellings properly (b note vs b accidental)
function addAccidentals(staveNote, keys, VF) {
  keys.forEach((key, i) => {
    const acc = vexAccidental(key);
    if (acc) staveNote.addModifier(new VF.Accidental(acc), i);
  });
}

// sequential=false → whole-note chord (chords/intervals)
// sequential=true  → row of quarter notes in order (scales)
// POINT 13: symbol + rootPc drive enharmonic spelling
// keySigStr: optional VexFlow key sig string e.g. 'Db', 'Bbm' — suppresses covered accidentals
function renderNotation(midiNotes, sequential, symbol, rootPc, keySigStr) {
  symbol = symbol || '';
  rootPc = rootPc ?? 0;
  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter } = VF;

  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  // For chords: sort & dedupe. For scales: keep order as given.
  const notes = sequential ? [...midiNotes] : [...new Set(midiNotes)].sort((a, b) => a - b);
  const lowestMidi  = Math.min(...notes);
  const highestMidi = Math.max(...notes);
  const needsBass   = lowestMidi < 55;
  const needsTreble = highestMidi >= 55;
  const grandStaff  = needsBass && needsTreble;

  // Sequential (scale) mode: canvas is always as wide as needed — scrolling handles the rest.
  // Fixed per-beat width of 46px. Header space accounts for clef (~30px) + time sig (~20px)
  // + key sig (~14px per accidental). Formatter budget subtracts the same header so notes
  // are only distributed across the actual note-space, not the header area.
  const keySigCount = keySigStr ? keySigAccidentalCount(keySigStr) : 0;
  const headerPx = 30 + 20 + keySigCount * 14; // clef + timesig + keysig
  const barCount = sequential ? Math.ceil(notes.length / 4) : 1;
  const W = sequential ? barCount * 4 * 46 + headerPx + 40 : 260;
  let H, trebleY, bassY;
  if (grandStaff) { H = 240; trebleY = 20; bassY = 120; }
  else if (needsBass) { H = 140; bassY = 30; }
  else { H = 140; trebleY = 30; }

  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  try {
    const STAVE_X = 20, STAVE_W = W - 30;
    let trebleStave, bassStave;

    // Letter-based key sig coverage (correct — not pitch-class based)
    const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

    // Spell a midi note and, when a key sig is active, re-spell any double
    // accidentals to their enharmonic equivalent that fits the key.
    // Returns { key, forcedAcc } where forcedAcc is true when a same-letter
    // respell happened (e.g. ebb → eb) and an explicit accidental must always
    // be drawn regardless of key sig coverage — because the key sig accounts
    // for one flat on that letter but the note needs one more.
    function spellMidi(midi) {
      const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, rootPc), rootPc, symbol);
      if (!keySigStr) return { key: raw, forcedAcc: false };
      const respelled = respellForKeySig(midi, raw, coveredLetters, keySigStr);
      // Detect same-letter simplification: double acc → single acc, same letter
      const rawLetter    = raw.split('/')[0];
      const respelledLetter = respelled.split('/')[0];
      const wasDouble    = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
      const isSameLetter = rawLetter[0] === respelledLetter[0];
      const forcedAcc    = wasDouble && isSameLetter && respelled !== raw;
      return { key: respelled, forcedAcc };
    }

    // Add accidentals for a StaveNote, skipping any already in the key sig.
    // keys: array of { key, forcedAcc } objects (already respelled).
    // forcedAcc=true means draw the accidental even if covered by key sig
    // (same-letter double→single respell: key sig has one flat, note needs two).
    function addAccidentalsFiltered(sn, keys) {
      keys.forEach(({ key, forcedAcc }, i) => {
        if (!forcedAcc && isCoveredByKeySig(key, coveredLetters)) return;
        const acc = vexAccidental(key);
        if (acc) sn.addModifier(new VF.Accidental(acc), i);
      });
    }

    if (needsTreble || grandStaff) {
      trebleStave = new Stave(STAVE_X, trebleY, STAVE_W);
      trebleStave.addClef('treble');
      if (keySigStr) trebleStave.addKeySignature(keySigStr);
      trebleStave.setContext(ctx).draw();
    }
    if (needsBass || grandStaff) {
      bassStave = new Stave(STAVE_X, bassY, STAVE_W);
      bassStave.addClef('bass');
      if (keySigStr) bassStave.addKeySignature(keySigStr);
      bassStave.setContext(ctx).draw();
    }
    if (grandStaff && trebleStave && bassStave) {
      try {
        new StaveConnector(trebleStave, bassStave).setType('brace').setContext(ctx).draw();
        new StaveConnector(trebleStave, bassStave).setType('singleLeft').setContext(ctx).draw();
      } catch(e) {}
    }

    if (sequential) {
      // ── Sequential: 4/4, quarter notes, bar lines, correct rests to fill last bar ──
      const clef  = needsBass && !needsTreble ? 'bass' : 'treble';
      const stave = needsBass && !needsTreble ? bassStave : trebleStave;

      stave.addTimeSignature('4/4');
      stave.setContext(ctx).draw();

      const noteTicks = notes.map(midi => {
        const spelled = spellMidi(midi);
        const sn = new StaveNote({ keys: [spelled.key], duration: 'q', clef });
        addAccidentalsFiltered(sn, [spelled]);
        return sn;
      });

      const remainder = notes.length % 4;
      const restTicks = [];
      if (remainder !== 0) {
        const fill = 4 - remainder;
        const restKey = clef === 'bass' ? 'a/2' : 'b/4';
        if (fill === 3) {
          restTicks.push(new StaveNote({ keys: [restKey], duration: 'hdr', clef }));
        } else if (fill === 2) {
          restTicks.push(new StaveNote({ keys: [restKey], duration: 'hr', clef }));
        } else {
          restTicks.push(new StaveNote({ keys: [restKey], duration: 'qr', clef }));
        }
      }

      const allTicks = [...noteTicks, ...restTicks];
      const tickables = [];
      for (let i = 0; i < allTicks.length; i++) {
        if (i > 0 && i % 4 === 0) tickables.push(new VF.BarNote());
        tickables.push(allTicks[i]);
      }

      const totalBeats = Math.ceil(notes.length / 4) * 4;
      const voice = new Voice({ num_beats: totalBeats, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables(tickables);
      const formatterBudget = STAVE_W - headerPx - 20;
      new Formatter().joinVoices([voice]).format([voice], formatterBudget);
      voice.draw(ctx, stave);

    } else {
      // ── Block chord: all notes as a single whole-note chord, grand staff if needed ──
      const sorted = notes;
      let trebleArr = [], bassArr = [];
      if (grandStaff) { sorted.forEach(m => (m >= 60 ? trebleArr : bassArr).push(m)); }
      else if (needsBass) { bassArr = sorted; }
      else { trebleArr = sorted; }

      function drawChordNotes(midiArr, clef, stave) {
        if (!midiArr.length || !stave) return;
        const spelled = midiArr.map(m => spellMidi(m));
        const keys = spelled.map(s => s.key);
        const sn = new StaveNote({ keys, duration: 'w', clef });
        addAccidentalsFiltered(sn, spelled);
        const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
        voice.addTickables([sn]);
        new Formatter().joinVoices([voice]).format([voice], STAVE_W - 60);
        voice.draw(ctx, stave);
      }

      function drawRest(key, clef, stave) {
        if (!stave) return;
        const rest = new StaveNote({ keys: [key], duration: 'wr', clef });
        const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
        voice.addTickables([rest]);
        new Formatter().joinVoices([voice]).format([voice], STAVE_W - 60);
        voice.draw(ctx, stave);
      }

      if (grandStaff) {
        trebleArr.length ? drawChordNotes(trebleArr, 'treble', trebleStave) : drawRest('b/4', 'treble', trebleStave);
        bassArr.length   ? drawChordNotes(bassArr,   'bass',   bassStave)   : drawRest('d/3', 'bass',   bassStave);
      } else if (needsBass) {
        drawChordNotes(bassArr, 'bass', bassStave);
      } else {
        drawChordNotes(trebleArr, 'treble', trebleStave);
      }
    }
  } catch(e) { console.error('VexFlow render error:', e); }
}

// POINT 25: Label for slash chord root badge (shows upper root)
function getSlashChordRootLabel() {
  if (!currentUpperRootMidi) return '';
  const pc = currentUpperRootMidi % 12;
  return spelledRoot(pc);
}

// POINT 25 (redesigned): Resolved slash chord name for the current question, e.g. "B/C" or
// "Bm/C" — built from the randomised root each question, since the type itself is root-agnostic.
function getSlashResolvedName() {
  if (currentUpperRootMidi === null || currentSlashBassMidi === null) return '';
  const upperPc = currentUpperRootMidi % 12;
  const bassPc  = currentSlashBassMidi % 12;
  const upperName = spelledRoot(upperPc);
  const bassName  = spelledNote(currentChord.bassInterval, upperPc, currentChord.symbol);
  const qualSuffix = currentChord.upperQuality === 'min' ? 'm' : '';
  return upperName + qualSuffix + '/' + bassName;
}

// POINT 34: Quality suffix/full-name helpers — support aug and dom7 upper/lower
function polyQualitySuffix(sym) {
  if (sym === 'min') return 'm';
  if (sym === 'aug') return 'aug';
  if (sym === '7')   return '7';
  return ''; // maj
}
function polyQualityFull(sym) {
  if (sym === 'min') return 'minor';
  if (sym === 'aug') return 'augmented';
  if (sym === '7')   return 'dominant 7th';
  return 'major';
}

// POINT 26: Polychord display label e.g. "E / A", "Eaug / A", "E7 / Am"
function getPolyChordLabel() {
  if (!currentPolyUpperRootMidi || !currentPolyLowerRootMidi) return currentChord.name;
  const upPc  = currentPolyUpperRootMidi % 12;
  const loPC  = currentPolyLowerRootMidi % 12;
  const upName = spelledRoot(upPc);
  const loName = spelledRoot(loPC);
  return upName + polyQualitySuffix(currentChord.upperSymbol) + ' / ' + loName + polyQualitySuffix(currentChord.lowerSymbol);
}

// POINT 26 / 35: UST display label — adapts to shell quality
// Dom7 shell: "UST ♭II over G7 → G7(♭9)(♯11)(♭13)"
// m7 shell:   "UST IIm over Gm7 → Gm7(9)(11)"
// Maj7 shell: "UST II over GMaj7 → GMaj7(9)(♯11)"
function getUSTLabel() {
  if (!currentUSTRootMidi) return currentChord.name;
  const rootPc   = currentUSTRootMidi % 12;
  const rootName = spelledRoot(rootPc);
  const shellSuffix = currentChord.shellQuality === 'min'  ? 'm7'
                    : currentChord.shellQuality === 'maj7' ? 'Maj7'
                    : '7';
  return 'UST ' + currentChord.ustNumber + ' over ' + rootName + shellSuffix + ' → ' + rootName + currentChord.resultingChord;
}

// POINT 2 / 13: Derive harmonic root name for inverted chords, spelled correctly
function getChordRootName() {
  // POINT 25: slash chords show upper chord root
  if (currentChord?.family === 'slash') return getSlashChordRootLabel();
  // POINT 26: poly shows upper triad root; UST shows chord root
  if (currentChord?.family === 'poly' && currentPolyUpperRootMidi) {
    return spelledRoot(currentPolyUpperRootMidi % 12);
  }
  if (currentChord?.family === 'ust' && currentUSTRootMidi) {
    return spelledRoot(currentUSTRootMidi % 12);
  }
  if (currentChord && currentChord.invIndex !== undefined) {
    const bassNote = currentMidiNotes[0];
    const bassInterval = currentChord.baseChord.intervals[currentChord.invIndex];
    const rootMidi = bassNote - bassInterval;
    return spelledRoot(((rootMidi % 12) + 12) % 12);
  }
  return spelledRoot(((currentChordRootMidi ?? currentMidiNotes[0]) % 12 + 12) % 12);
}
function renderPolyNotation(keySigStr) {
  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter } = VF;

  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  const W = 260, H = 240, trebleY = 20, bassY = 120;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  const STAVE_X = 20, STAVE_W = W - 30;
  const keySigCount = keySigStr ? keySigAccidentalCount(keySigStr) : 0;
  const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

  // Spell a midi note relative to a given root pc and symbol.
  // Returns { key, forcedAcc } — same contract as spellMidi in renderNotation.
  function spellMidiRelative(midi, rootPc, symbol) {
    const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, rootPc), rootPc, symbol);
    if (!keySigStr) return { key: raw, forcedAcc: false };
    const respelled = respellForKeySig(midi, raw, coveredLetters, keySigStr);
    const rawLetter      = raw.split('/')[0];
    const respelledLetter = respelled.split('/')[0];
    const wasDouble  = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
    const isSameLetter = rawLetter[0] === respelledLetter[0];
    const forcedAcc  = wasDouble && isSameLetter && respelled !== raw;
    return { key: respelled, forcedAcc };
  }

  function addAccidentalsFiltered(sn, keys) {
    keys.forEach(({ key, forcedAcc }, i) => {
      if (!forcedAcc && isCoveredByKeySig(key, coveredLetters)) return;
      const acc = vexAccidental(key);
      if (acc) sn.addModifier(new VF.Accidental(acc), i);
    });
  }

  try {
    const trebleStave = new Stave(STAVE_X, trebleY, STAVE_W);
    trebleStave.addClef('treble');
    if (keySigStr) trebleStave.addKeySignature(keySigStr);
    trebleStave.setContext(ctx).draw();

    const bassStave = new Stave(STAVE_X, bassY, STAVE_W);
    bassStave.addClef('bass');
    if (keySigStr) bassStave.addKeySignature(keySigStr);
    bassStave.setContext(ctx).draw();

    new StaveConnector(trebleStave, bassStave).setType('brace').setContext(ctx).draw();
    new StaveConnector(trebleStave, bassStave).setType('singleLeft').setContext(ctx).draw();

    function drawStaff(midiArr, rootPc, symbol, clef, stave) {
      const sorted = [...midiArr].sort((a, b) => a - b);
      if (!sorted.length || !stave) return;
      const spelled = sorted.map(m => spellMidiRelative(m, rootPc, symbol));
      const keys = spelled.map(s => s.key);
      const sn = new StaveNote({ keys, duration: 'w', clef });
      addAccidentalsFiltered(sn, spelled);
      const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables([sn]);
      new Formatter().joinVoices([voice]).format([voice], STAVE_W - 60);
      voice.draw(ctx, stave);
    }

    const upPc  = currentPolyUpperRootMidi % 12;
    const loPc  = currentPolyLowerRootMidi % 12;

    drawStaff(currentPolyUpperMidi, upPc, currentChord.upperSymbol, 'treble', trebleStave);
    drawStaff(currentPolyLowerMidi, loPc, currentChord.lowerSymbol, 'bass',   bassStave);

  } catch(e) { console.error('VexFlow poly render error:', e); }
}

function showNotation() {
  const area = document.getElementById('notationArea');
  const nameEl = document.getElementById('notationChordName');

  if (currentMode === 'intervals') {
    const rootPc = currentIntervalMidi[0] % 12;
    const sym = currentInterval.symbol;
    const n0 = spelledNote(0, rootPc, sym);
    const n1 = spelledNote(pcInterval(currentIntervalMidi[1] % 12, rootPc), rootPc, sym);
    const iLabel = currentInterval.semitones === 6
      ? tritoneLabel(currentIntervalStyle) : currentInterval.name;
    nameEl.textContent = iLabel + '  (' + n0 + ' \u2192 ' + n1 + ')';
    // POINT 32b: key sig chip row for intervals
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', intervalKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', intervalKeySigMode === 'key');
    const keySigStr = intervalKeySigMode === 'key' ? getIntervalKeyStr(rootPc) : null;
    renderNotation(currentIntervalMidi, false, sym, rootPc, keySigStr);
  } else if (currentMode === 'scales') {
    const rootPc = currentScaleRootMidi % 12;
    const sym = currentScale.symbol;
    const rootName = spelledNote(0, rootPc, sym);
    nameEl.textContent = rootName + ' ' + (currentScale.displayName || currentScale.name); // POINT 27
    const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
    const descNotes = [...ascNotes].reverse();
    const seqNotes  = currentScaleDir === 'desc' ? descNotes        // POINT 20b: use stored resolved dir
                    : currentScaleDir === 'both' ? [...ascNotes, ...descNotes.slice(1)]
                    : ascNotes;
    // Key sig chip: show row, sync chip active state, resolve key sig string
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', scaleKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', scaleKeySigMode === 'key');
    const keySigStr = scaleKeySigMode === 'key' ? getScaleParentKeyStr(currentScale, rootPc) : null;
    renderNotation(seqNotes, true, sym, rootPc, keySigStr);
  } else if (currentChord?.family === 'poly' && currentPolyUpperRootMidi !== null) {
    // POINT 26: Polychord — dedicated renderer: forced grand staff, per-triad spelling
    nameEl.textContent = getPolyChordLabel() + '  (' + currentChord.name + ')';
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrPoly = chordKeySigMode === 'key' ? getBestFitKeyStr(currentMidiNotes) : null;
    renderPolyNotation(keySigStrPoly);
  } else if (currentChord?.family === 'ust' && currentUSTRootMidi !== null) {
    // POINT 26: UST — show resulting chord name label
    nameEl.textContent = getUSTLabel();
    const rootPc = currentUSTRootMidi % 12;
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrUST = chordKeySigMode === 'key' ? getBestFitKeyStr(currentMidiNotes) : null;
    // POINT 35: use correct spelling symbol per shell quality
    const _ustNoteSym = currentChord.shellQuality === 'min' ? 'min' : currentChord.shellQuality === 'maj7' ? 'maj' : '7';
    renderNotation(currentMidiNotes, false, _ustNoteSym, rootPc, keySigStrUST);
  } else if (currentChord?.family === 'slash' && currentSlashBassMidi !== null) {
    // POINT 25: Slash chord notation — show full name, render bass + upper
    const upperPc = currentUpperRootMidi % 12;
    const bassPc  = currentSlashBassMidi % 12;
    nameEl.textContent = getSlashResolvedName() + '  (' + currentChord.upperQuality + ' / ' + currentChord.belowLabel + ' below)';
    const allSlashNotes = [currentSlashBassMidi, ...currentMidiNotes];
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrSlash = chordKeySigMode === 'key' ? getBestFitKeyStr(allSlashNotes) : null;
    // Pass bass + upper notes together; renderNotation handles grand staff split
    renderNotation(allSlashNotes, false, currentChord.symbol, upperPc, keySigStrSlash);
  } else {
    const sym = currentChord?.invIndex !== undefined ? currentChord.baseChord.symbol : currentChord.symbol;
    // Use currentChordRootMidi (always the harmonic root) so rootPc is correct
    // regardless of voicing mode (shell/guide may omit the root from currentMidiNotes).
    const rootPc = currentChordRootMidi !== null
      ? ((currentChordRootMidi % 12) + 12) % 12
      : currentMidiNotes[0] % 12; // fallback for safety
    nameEl.textContent = getChordRootName() + ' ' + currentChord.name;

    // POINT 32b: key sig chip row for normal chords
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStr = chordKeySigMode === 'key' ? getChordKeyStr(sym, rootPc) : null;

    // POINT 32: notation mirrors playback style — show exactly what was heard
    const sorted = [...currentMidiNotes].sort((a, b) => a - b);
    if (currentChordPlayStyle === 'ascending') {
      renderNotation(sorted, true, sym, rootPc, keySigStr);
    } else if (currentChordPlayStyle === 'descending') {
      renderNotation([...sorted].reverse(), true, sym, rootPc, keySigStr);
    } else if (currentChordPlayStyle === 'broken') {
      // Exact broken pattern: root – top – mid – top
      const root = sorted[0];
      const top  = sorted[sorted.length - 1];
      const mid  = sorted.length > 2 ? sorted[1] : sorted[0];
      renderNotation([root, top, mid, top], true, sym, rootPc, keySigStr);
    } else {
      // block: stacked whole-note chord (original behaviour)
      renderNotation(currentMidiNotes, false, sym, rootPc, keySigStr);
    }
    // Show inversion chips after answering (quiz) or always (dict)
    if (answered) renderInversionChips();
  }
  area.style.display = 'block';
  document.getElementById('notationPanel').style.display = 'block';
  showBreakdown();
}

