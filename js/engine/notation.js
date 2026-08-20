/**
 * @file notation.js
 * @description VexFlow-based notation renderer for all app modes. Handles enharmonic
 * spelling, key signature accidental filtering, automatic grand staff layout, sequential
 * (scale) and block (chord/interval) rendering, polychord rendering, and label
 * generation for all chord families (slash, poly, UST, inversion).
 *
 * Depends on (must load before this file):
 *   - VexFlow (js/vendor/vexflow.min.js)
 *   - js/data/spelling.js   — spelledNote, midiToVexKeySpelled, respellForKeySig,
 *                              isCoveredByKeySig, vexAccidental, spelledRoot
 *   - js/data/keysig.js     — keySigCoveredLetters, keySigAccidentalCount
 *   - js/engine/state.js    — currentMode, currentMidiNotes, currentChord,
 *                              currentChordRootMidi, currentPolyUpperMidi,
 *                              currentPolyLowerMidi, currentPolyUpperRootMidi,
 *                              currentPolyLowerRootMidi, currentSlashBassMidi,
 *                              currentUpperRootMidi, currentUSTRootMidi,
 *                              currentIntervalMidi, currentInterval,
 *                              currentIntervalStyle, currentScale, currentScaleRootMidi,
 *                              currentScaleDir, intervalKeySigMode, scaleKeySigMode,
 *                              chordKeySigMode, currentChordPlayStyle, answered
 *   - js/engine/helpers.js  — pcInterval, tritoneLabel, getBestFitKeyStr,
 *                              getChordKeyStr, getIntervalKeyStr, getScaleParentKeyStr
 *   - js/breakdown/breakdown.js — showBreakdown
 *   - js/modes/chords-mode.js  — renderInversionChips
 *
 * @module notation
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */


// ─── Low-level MIDI → VexFlow conversion ──────────────────────────────────────

/**
 * Converts a MIDI note number to a VexFlow key string using a fixed chromatic
 * mapping (always sharps, no enharmonic awareness). Used only for simple
 * single-note cases where spelling context is unavailable or irrelevant.
 *
 * @param {number} midi - MIDI note number (0–127).
 * @returns {string} VexFlow key string, e.g. `'c#/4'`, `'a/5'`.
 */
function midiToVexKeyExact(midi) {
  const VEX_NOTES = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];
  return VEX_NOTES[midi % 12] + '/' + (Math.floor(midi / 12) - 1);
}


// ─── Accidental helpers ────────────────────────────────────────────────────────

/**
 * Adds VexFlow accidental modifiers to a StaveNote for every key in `keys`
 * that carries an accidental. Does not filter for key signature coverage —
 * use `addAccidentalsFiltered` when a key signature is active.
 *
 * @param {VF.StaveNote} staveNote - The VexFlow StaveNote to annotate.
 * @param {string[]} keys - Array of VexFlow key strings, e.g. `['f#/4', 'a/4', 'c/5']`.
 * @param {object} VF - VexFlow namespace object.
 * @returns {void}
 */
function addAccidentals(staveNote, keys, VF) {
  keys.forEach((key, i) => {
    const acc = vexAccidental(key);
    if (acc) staveNote.addModifier(new VF.Accidental(acc), i);
  });
}


// ─── Main notation renderer ────────────────────────────────────────────────────

/**
 * Renders a set of MIDI notes into the `#notation-svg` element using VexFlow.
 *
 * Supports two layout modes:
 * - **Block** (`sequential = false`): all notes as a single stacked whole-note chord.
 *   Used for chords and intervals. Automatically uses a grand staff when the
 *   note range spans both treble and bass registers.
 * - **Sequential** (`sequential = true`): one quarter note per pitch in the given
 *   order, padded with rests to complete the final 4/4 bar, with bar lines
 *   inserted every 4 beats. Used for scales.
 *
 * Enharmonic spelling is driven by `symbol` and `rootPc` via `midiToVexKeySpelled`.
 * When `keySigStr` is supplied, accidentals already covered by the key signature
 * are suppressed, and conflicting accidentals (e.g. F♮ in a G major context)
 * receive explicit cancellation marks.
 *
 * @param {number[]} midiNotes - MIDI note numbers to render.
 * @param {boolean} sequential - `false` = block chord; `true` = sequential scale.
 * @param {string} [symbol=''] - Chord/interval symbol used to drive enharmonic spelling.
 * @param {number} [rootPc=0] - Root pitch class (0–11) for spelling context.
 * @param {string|null} [keySigStr=null] - VexFlow key signature string, e.g. `'G'`,
 *   `'Db'`, `'Bbm'`. `null` = no key signature (C major / no accidentals suppressed).
 * @returns {void}
 */
function renderNotation(midiNotes, sequential, symbol, rootPc, keySigStr) {
  symbol = symbol || '';
  rootPc = rootPc ?? 0;
  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter } = VF;

  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  // For chords: sort and deduplicate so stacked notation is unambiguous.
  // For scales: preserve the caller's note order (ascending, descending, or both).
  const notes = sequential ? [...midiNotes] : [...new Set(midiNotes)].sort((a, b) => a - b);
  const lowestMidi  = Math.min(...notes);
  const highestMidi = Math.max(...notes);

  // MIDI 55 = G3, the conventional split point between treble and bass staves.
  // Notes below 55 always go to the bass clef; notes at or above go to treble.
  const needsBass   = lowestMidi < 55;
  const needsTreble = highestMidi >= 55;
  const grandStaff  = needsBass && needsTreble;

  // Sequential layout: canvas width scales with note count and key signature complexity.
  // Fixed 46px per beat; header space reserves room for clef, time signature, and
  // key signature glyphs so the Formatter distributes notes across note-space only.
  const keySigCount = keySigStr ? keySigAccidentalCount(keySigStr) : 0;
  const headerPx = 30 + 20 + keySigCount * 14; // clef ~30px + time sig ~20px + 14px per accidental
  const barCount = sequential ? Math.ceil(notes.length / 4) : 1;
  const W = sequential ? barCount * 4 * 46 + headerPx + 40 : 260;

  let H, trebleY, bassY;
  if (grandStaff)       { H = 240; trebleY = 20; bassY = 120; }
  else if (needsBass)   { H = 140; bassY = 30; }
  else                  { H = 140; trebleY = 30; }

  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  try {
    const STAVE_X = 20, STAVE_W = W - 30;
    let trebleStave, bassStave;

    // Key signature coverage is tracked by letter name (not pitch class) because
    // VexFlow applies key sig accidentals per letter across all octaves. A note
    // is "covered" only when both its letter and its accidental match the key sig
    // (e.g. F# in G major is covered; F♮ in G major is not — it conflicts).
    const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

    /**
     * Spells a MIDI note using the active root/symbol context and, when a key
     * signature is active, simplifies any double accidentals to their enharmonic
     * single-accidental equivalent that fits the key.
     *
     * Returns `forcedAcc = true` when the simplification was a same-letter
     * respelling (e.g. E𝄫 → E♭): in that case `addAccidentalsFiltered` must
     * draw an explicit accidental even though the letter appears in the key sig,
     * because the key sig only accounts for one flat on that letter, not two.
     *
     * @param {number} midi - MIDI note number.
     * @returns {{ key: string, forcedAcc: boolean }}
     */
    function spellMidi(midi) {
      const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, rootPc), rootPc, symbol);
      if (!keySigStr) return { key: raw, forcedAcc: false };
      const respelled = respellForKeySig(midi, raw, coveredLetters, keySigStr);

      // Detect a same-letter double→single simplification.
      // Only same-letter changes require forcedAcc; cross-letter enharmonic
      // respellings (e.g. D# → Eb) are handled normally by the key sig logic.
      const rawLetter       = raw.split('/')[0];
      const respelledLetter = respelled.split('/')[0];
      const wasDouble       = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
      const isSameLetter    = rawLetter[0] === respelledLetter[0];
      const forcedAcc       = wasDouble && isSameLetter && respelled !== raw;
      return { key: respelled, forcedAcc };
    }

    /**
     * Adds VexFlow accidental modifiers to a StaveNote, correctly handling three
     * cases when a key signature is active:
     *
     * 1. **Conflict** — the note's letter appears in the key sig but with a different
     *    accidental (e.g. F♮ when the key sig has F#, or B♮ when the key sig has B♭).
     *    An explicit accidental must be drawn to cancel the key sig; for a plain
     *    natural note this means adding a ♮ sign.
     *
     * 2. **Covered** — the note's letter and accidental exactly match the key sig.
     *    VexFlow already renders the key sig glyph, so no extra mark is needed —
     *    unless `forcedAcc` is set (double→single same-letter respell), in which
     *    case an accidental must be drawn to clarify the deviation from the key sig.
     *
     * 3. **Not covered** — the note has its own accidental that the key sig does not
     *    account for. Draw it normally.
     *
     * @param {VF.StaveNote} sn - The StaveNote to annotate.
     * @param {Array<{ key: string, forcedAcc: boolean }>} keys - Spelled note objects.
     * @returns {void}
     */
    function addAccidentalsFiltered(sn, keys) {
      keys.forEach(({ key, forcedAcc }, i) => {
        const letterAcc = key.split('/')[0]; // e.g. 'f', 'f#', 'bb'
        const letter    = letterAcc[0];      // e.g. 'f'

        // Case 1: same letter, different accidental → must cancel the key sig.
        const conflictsWithKeySig = [...coveredLetters].some(covered =>
          covered[0] === letter && covered !== letterAcc
        );
        if (conflictsWithKeySig) {
          const acc = vexAccidental(key);
          sn.addModifier(new VF.Accidental(acc ?? 'n'), i);
          return;
        }

        // Case 2: covered by key sig with same accidental — skip (unless forcedAcc).
        if (!forcedAcc && isCoveredByKeySig(key, coveredLetters)) return;

        // Case 3: not covered — add whatever accidental the note has (if any).
        const acc = vexAccidental(key);
        if (acc) sn.addModifier(new VF.Accidental(acc), i);
      });
    }

    // Draw staves (treble and/or bass depending on note range).
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
      // ── Sequential mode: 4/4, quarter notes, bar lines, rest-padded final bar ──

      // Sequential mode never uses a grand staff — always a single clef chosen
      // by the lowest note in the set (bass only when all notes are below MIDI 55).
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

      // Pad the final bar with rests so every bar is exactly 4 beats.
      // VexFlow requires a complete voice (or SOFT mode) to format correctly;
      // explicit rests are cleaner than relying on SOFT mode to ignore gaps.
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

      // Insert VexFlow BarNote markers at every 4-beat boundary so bar lines
      // are drawn between bars even within a single Voice.
      const allTicks = [...noteTicks, ...restTicks];
      const tickables = [];
      for (let i = 0; i < allTicks.length; i++) {
        if (i > 0 && i % 4 === 0) tickables.push(new VF.BarNote());
        tickables.push(allTicks[i]);
      }

      const totalBeats = Math.ceil(notes.length / 4) * 4;
      const voice = new Voice({ num_beats: totalBeats, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables(tickables);

      // Subtract header space from the formatter budget so notes are only
      // distributed across the actual note-bearing portion of the stave.
      const formatterBudget = STAVE_W - headerPx - 20;
      new Formatter().joinVoices([voice]).format([voice], formatterBudget);
      voice.draw(ctx, stave);

    } else {
      // ── Block mode: stacked whole-note chord, grand staff split at MIDI 60 ──

      // Split notes between staves at middle C (MIDI 60). Notes on the boundary
      // go to treble; this matches standard piano notation convention.
      const sorted = notes;
      let trebleArr = [], bassArr = [];
      if (grandStaff) { sorted.forEach(m => (m >= 60 ? trebleArr : bassArr).push(m)); }
      else if (needsBass) { bassArr = sorted; }
      else { trebleArr = sorted; }

      /**
       * Renders an array of MIDI notes as a single stacked whole-note chord
       * on the given stave and clef.
       *
       * @param {number[]} midiArr - MIDI notes to render.
       * @param {string} clef - `'treble'` or `'bass'`.
       * @param {VF.Stave} stave - Target stave.
       * @returns {void}
       */
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

      /**
       * Renders a whole-note rest on the given stave. Used on the empty stave of
       * a grand staff when all notes fall on the other stave.
       *
       * @param {string} key - VexFlow rest position key, e.g. `'b/4'`, `'d/3'`.
       * @param {string} clef - `'treble'` or `'bass'`.
       * @param {VF.Stave} stave - Target stave.
       * @returns {void}
       */
      function drawRest(key, clef, stave) {
        if (!stave) return;
        const rest = new StaveNote({ keys: [key], duration: 'wr', clef });
        const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
        voice.addTickables([rest]);
        new Formatter().joinVoices([voice]).format([voice], STAVE_W - 60);
        voice.draw(ctx, stave);
      }

      if (grandStaff) {
        // Draw notes on whichever stave has them; fill the empty stave with a rest.
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


// ─── Label helpers ─────────────────────────────────────────────────────────────

/**
 * Returns the spelled note name of the upper chord's root in a slash chord,
 * used as the root badge label in the UI (shows the upper chord root, not the bass).
 *
 * @returns {string} Spelled root name, e.g. `'B'`, `'Eb'`. Empty string if not set.
 */
function getSlashChordRootLabel() {
  if (!currentUpperRootMidi) return '';
  const pc = currentUpperRootMidi % 12;
  return spelledRoot(pc);
}

/**
 * Builds the fully resolved slash chord name for the current question,
 * e.g. `'B/C'` or `'Bm/C'`. The slash chord type is root-agnostic in the
 * data layer, so this is computed from the randomised root each question.
 *
 * @returns {string} Resolved slash chord name, e.g. `'Bm/C'`. Empty string if state is unset.
 */
function getSlashResolvedName() {
  if (currentUpperRootMidi === null || currentSlashBassMidi === null) return '';
  const upperPc    = currentUpperRootMidi % 12;
  const upperName  = spelledRoot(upperPc);
  const bassName   = spelledNote(currentChord.bassInterval, upperPc, currentChord.symbol);
  const qualSuffix = currentChord.upperQuality === 'min' ? 'm' : '';
  return upperName + qualSuffix + '/' + bassName;
}

/**
 * Returns the short quality suffix for a polychord triad symbol,
 * used when building the polychord display label.
 *
 * @param {string} sym - Chord symbol: `'maj'`, `'min'`, `'aug'`, or `'7'`.
 * @returns {string} Short suffix: `''` (major), `'m'`, `'aug'`, or `'7'`.
 */
function polyQualitySuffix(sym) {
  if (sym === 'min') return 'm';
  if (sym === 'aug') return 'aug';
  if (sym === '7')   return '7';
  return ''; // major
}

/**
 * Returns the full quality name for a polychord triad symbol,
 * used in descriptive UI text.
 *
 * @param {string} sym - Chord symbol: `'maj'`, `'min'`, `'aug'`, or `'7'`.
 * @returns {string} Full name: `'major'`, `'minor'`, `'augmented'`, or `'dominant 7th'`.
 */
function polyQualityFull(sym) {
  if (sym === 'min') return 'minor';
  if (sym === 'aug') return 'augmented';
  if (sym === '7')   return 'dominant 7th';
  return 'major';
}

/**
 * Builds the polychord display label for the current question,
 * e.g. `'E / A'`, `'Eaug / A'`, `'E7 / Am'`.
 *
 * @returns {string} Polychord label. Falls back to `currentChord.name` if roots are unset.
 */
function getPolyChordLabel() {
  if (!currentPolyUpperRootMidi || !currentPolyLowerRootMidi) return currentChord.name;
  const upPc   = currentPolyUpperRootMidi % 12;
  const loPC   = currentPolyLowerRootMidi % 12;
  const upName = spelledRoot(upPc);
  const loName = spelledRoot(loPC);
  return upName + polyQualitySuffix(currentChord.upperSymbol) + ' / ' + loName + polyQualitySuffix(currentChord.lowerSymbol);
}

/**
 * Builds the UST (Upper Structure Triad) display label for the current question.
 * Adapts to the shell chord quality:
 * - Dom7 shell:  `'UST ♭II over G7 → G7(♭9)(♯11)(♭13)'`
 * - m7 shell:    `'UST IIm over Gm7 → Gm7(9)(11)'`
 * - Maj7 shell:  `'UST II over GMaj7 → GMaj7(9)(♯11)'`
 *
 * @returns {string} UST label. Falls back to `currentChord.name` if root is unset.
 */
function getUSTLabel() {
  if (!currentUSTRootMidi) return currentChord.name;
  const rootPc     = currentUSTRootMidi % 12;
  const rootName   = spelledRoot(rootPc);
  const shellSuffix = currentChord.shellQuality === 'min'  ? 'm7'
                    : currentChord.shellQuality === 'maj7' ? 'Maj7'
                    : '7';
  return 'UST ' + currentChord.ustNumber + ' over ' + rootName + shellSuffix + ' → ' + rootName + currentChord.resultingChord;
}

/**
 * Derives the harmonic root name for the current chord, correctly spelled and
 * adapted to the chord family. Used as the root prefix in the notation label.
 *
 * - Slash chords: returns the upper chord root (not the bass note).
 * - Polychords: returns the upper triad root.
 * - UST: returns the shell chord root.
 * - Inverted chords: reconstructs the harmonic root from the bass interval.
 * - All others: uses `currentChordRootMidi` with a fallback to the lowest note.
 *
 * @returns {string} Spelled root name, e.g. `'G'`, `'Bb'`, `'F#'`.
 */
function getChordRootName() {
  if (currentChord?.family === 'slash') return getSlashChordRootLabel();
  if (currentChord?.family === 'poly' && currentPolyUpperRootMidi) {
    return spelledRoot(currentPolyUpperRootMidi % 12);
  }
  if (currentChord?.family === 'ust' && currentUSTRootMidi) {
    return spelledRoot(currentUSTRootMidi % 12);
  }
  if (currentChord && currentChord.invIndex !== undefined) {
    // Reconstruct the harmonic root from the bass note and the inversion interval.
    const bassNote    = currentMidiNotes[0];
    const bassInterval = currentChord.baseChord.intervals[currentChord.invIndex];
    const rootMidi    = bassNote - bassInterval;
    return spelledRoot(((rootMidi % 12) + 12) % 12);
  }
  return spelledRoot(((currentChordRootMidi ?? currentMidiNotes[0]) % 12 + 12) % 12);
}


// ─── Polychord renderer ────────────────────────────────────────────────────────

/**
 * Renders a polychord into `#notation-svg` using a forced grand staff layout:
 * upper triad always on the treble stave, lower triad always on the bass stave,
 * each spelled relative to its own root and symbol independently.
 *
 * This is a dedicated renderer (separate from `renderNotation`) because
 * polychords require per-triad spelling contexts that a single-root renderer
 * cannot provide. The two triads are spelled independently, then drawn on their
 * respective staves with the shared key signature (if any) applied to both.
 *
 * @param {string|null} keySigStr - VexFlow key signature string, e.g. `'G'`, `'Bbm'`.
 *   `null` = no key signature.
 * @returns {void}
 */
function renderPolyNotation(keySigStr) {
  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter } = VF;

  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  // Polychord layout is always a fixed-size grand staff — no dynamic sizing needed.
  const W = 260, H = 240, trebleY = 20, bassY = 120;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  const STAVE_X = 20, STAVE_W = W - 30;
  const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

  /**
   * Spells a MIDI note relative to a specific root pitch class and chord symbol.
   * Identical contract to `spellMidi` in `renderNotation` but accepts explicit
   * rootPc and symbol parameters so each polychord triad can be spelled
   * independently with its own harmonic context.
   *
   * @param {number} midi - MIDI note number.
   * @param {number} rootPc - Root pitch class of this triad (0–11).
   * @param {string} symbol - Chord symbol of this triad, e.g. `'maj'`, `'min'`.
   * @returns {{ key: string, forcedAcc: boolean }}
   */
  function spellMidiRelative(midi, rootPc, symbol) {
    const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, rootPc), rootPc, symbol);
    if (!keySigStr) return { key: raw, forcedAcc: false };
    const respelled = respellForKeySig(midi, raw, coveredLetters, keySigStr);

    // Same double→single same-letter detection as in renderNotation's spellMidi.
    const rawLetter       = raw.split('/')[0];
    const respelledLetter = respelled.split('/')[0];
    const wasDouble       = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
    const isSameLetter    = rawLetter[0] === respelledLetter[0];
    const forcedAcc       = wasDouble && isSameLetter && respelled !== raw;
    return { key: respelled, forcedAcc };
  }

  /**
   * Adds accidentals to a StaveNote, applying the same three-case key signature
   * conflict logic as `addAccidentalsFiltered` in `renderNotation`.
   * Duplicated here because `renderPolyNotation` has its own `coveredLetters`
   * closure and cannot share the inner function from `renderNotation`.
   *
   * @param {VF.StaveNote} sn - The StaveNote to annotate.
   * @param {Array<{ key: string, forcedAcc: boolean }>} keys - Spelled note objects.
   * @returns {void}
   */
  function addAccidentalsFiltered(sn, keys) {
    keys.forEach(({ key, forcedAcc }, i) => {
      const letterAcc = key.split('/')[0];
      const letter    = letterAcc[0];

      // Case 1: same letter, different accidental → cancel the key sig.
      const conflictsWithKeySig = [...coveredLetters].some(covered =>
        covered[0] === letter && covered !== letterAcc
      );
      if (conflictsWithKeySig) {
        const acc = vexAccidental(key);
        sn.addModifier(new VF.Accidental(acc ?? 'n'), i);
        return;
      }

      // Case 2: covered by key sig with same accidental — skip (unless forcedAcc).
      if (!forcedAcc && isCoveredByKeySig(key, coveredLetters)) return;

      // Case 3: not covered — add whatever accidental the note has (if any).
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

    /**
     * Spells and renders an array of MIDI notes as a single whole-note chord
     * on the given stave, using the supplied root and symbol for spelling.
     *
     * @param {number[]} midiArr - MIDI notes to render.
     * @param {number} rootPc - Root pitch class for this triad.
     * @param {string} symbol - Chord symbol for this triad.
     * @param {string} clef - `'treble'` or `'bass'`.
     * @param {VF.Stave} stave - Target stave.
     * @returns {void}
     */
    function drawStaff(midiArr, rootPc, symbol, clef, stave) {
      const sorted = [...midiArr].sort((a, b) => a - b);
      if (!sorted.length || !stave) return;
      const spelled = sorted.map(m => spellMidiRelative(m, rootPc, symbol));
      const keys    = spelled.map(s => s.key);
      const sn      = new StaveNote({ keys, duration: 'w', clef });
      addAccidentalsFiltered(sn, spelled);
      const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables([sn]);
      new Formatter().joinVoices([voice]).format([voice], STAVE_W - 60);
      voice.draw(ctx, stave);
    }

    const upPc = currentPolyUpperRootMidi % 12;
    const loPc = currentPolyLowerRootMidi % 12;

    // Upper triad → treble stave; lower triad → bass stave.
    // Each triad is spelled with its own root and symbol.
    drawStaff(currentPolyUpperMidi, upPc, currentChord.upperSymbol, 'treble', trebleStave);
    drawStaff(currentPolyLowerMidi, loPc, currentChord.lowerSymbol, 'bass',   bassStave);

  } catch(e) { console.error('VexFlow poly render error:', e); }
}


// ─── Notation display orchestrator ────────────────────────────────────────────

/**
 * Entry point for showing notation after a question is answered or in
 * dictionary mode. Determines the current mode and chord family, builds
 * the correct label and key signature string, then calls the appropriate
 * renderer (`renderNotation` or `renderPolyNotation`).
 *
 * Handles all five notation paths:
 * 1. **Intervals** — two-note block chord with interval name label.
 * 2. **Scales** — sequential quarter notes (ascending, descending, or both).
 * 3. **Polychords** — forced grand staff via `renderPolyNotation`.
 * 4. **UST** — block chord spelled from the shell chord's root.
 * 5. **Slash chords** — bass note merged with upper chord notes; grand staff auto-selected.
 * 6. **Standard chords** — block or sequential depending on `currentChordPlayStyle`.
 *
 * Also manages the key signature chip row visibility and active state, and
 * triggers inversion chip rendering for standard chords after answering.
 *
 * @returns {void}
 */
function showNotation() {
  const area   = document.getElementById('notationArea');
  const nameEl = document.getElementById('notationChordName');

  if (currentMode === 'intervals') {
    const rootPc = currentIntervalMidi[0] % 12;
    const sym    = currentInterval.symbol;
    const n0     = spelledNote(0, rootPc, sym);
    const n1     = spelledNote(pcInterval(currentIntervalMidi[1] % 12, rootPc), rootPc, sym);
    // Tritone gets a context-aware label (augmented 4th vs diminished 5th)
    // based on the active interval style; all other intervals use their fixed name.
    const iLabel = currentInterval.semitones === 6
      ? tritoneLabel(currentIntervalStyle) : currentInterval.name;
    nameEl.textContent = iLabel + '  (' + n0 + ' \u2192 ' + n1 + ')';
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', intervalKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', intervalKeySigMode === 'key');
    const keySigStr = intervalKeySigMode === 'key' ? getIntervalKeyStr(rootPc) : null;
    renderNotation(currentIntervalMidi, false, sym, rootPc, keySigStr);

  } else if (currentMode === 'scales') {
    const rootPc   = currentScaleRootMidi % 12;
    const sym      = currentScale.symbol;
    const rootName = spelledNote(0, rootPc, sym);
    nameEl.textContent = rootName + ' ' + (currentScale.displayName || currentScale.name);
    const ascNotes  = currentScale.intervals.map(i => currentScaleRootMidi + i);
    const descNotes = [...ascNotes].reverse();
    // Resolve the stored direction to the concrete note sequence to render.
    const seqNotes  = currentScaleDir === 'desc' ? descNotes
                    : currentScaleDir === 'both' ? [...ascNotes, ...descNotes.slice(1)]
                    : ascNotes;
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', scaleKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', scaleKeySigMode === 'key');
    const keySigStr = scaleKeySigMode === 'key' ? getScaleParentKeyStr(currentScale, rootPc) : null;
    renderNotation(seqNotes, true, sym, rootPc, keySigStr);

  } else if (currentChord?.family === 'poly' && currentPolyUpperRootMidi !== null) {
    // Polychord: dedicated renderer forces grand staff and spells each triad independently.
    nameEl.textContent = getPolyChordLabel() + '  (' + currentChord.name + ')';
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrPoly = chordKeySigMode === 'key' ? getBestFitKeyStr(currentMidiNotes) : null;
    renderPolyNotation(keySigStrPoly);

  } else if (currentChord?.family === 'ust' && currentUSTRootMidi !== null) {
    // UST: render the resulting chord; spelling is driven by the shell chord quality.
    nameEl.textContent = getUSTLabel();
    const rootPc = currentUSTRootMidi % 12;
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrUST = chordKeySigMode === 'key' ? getBestFitKeyStr(currentMidiNotes) : null;
    // Spelling symbol is derived from the shell quality rather than the UST symbol,
    // since the shell chord's tonal function governs the enharmonic context.
    const ustNoteSym = currentChord.shellQuality === 'min' ? 'min' : currentChord.shellQuality === 'maj7' ? 'maj' : '7';
    renderNotation(currentMidiNotes, false, ustNoteSym, rootPc, keySigStrUST);

  } else if (currentChord?.family === 'slash' && currentSlashBassMidi !== null) {
    // Slash chord: merge the bass note with the upper chord notes and pass the
    // full set to renderNotation, which auto-selects grand staff if needed.
    const upperPc = currentUpperRootMidi % 12;
    nameEl.textContent = getSlashResolvedName() + '  (' + currentChord.upperQuality + ' / ' + currentChord.belowLabel + ' below)';
    const allSlashNotes = [currentSlashBassMidi, ...currentMidiNotes];
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStrSlash = chordKeySigMode === 'key' ? getBestFitKeyStr(allSlashNotes) : null;
    renderNotation(allSlashNotes, false, currentChord.symbol, upperPc, keySigStrSlash);

  } else {
    // Standard chord (including inversions): notation mirrors the playback style
    // so the visual matches exactly what the user heard.
    const sym    = currentChord?.invIndex !== undefined ? currentChord.baseChord.symbol : currentChord.symbol;
    // Always use currentChordRootMidi (the harmonic root) for rootPc, regardless
    // of voicing mode — shell and guide tone voicings may omit the root from
    // currentMidiNotes, but the spelling context must still reference the true root.
    const rootPc = currentChordRootMidi !== null
      ? ((currentChordRootMidi % 12) + 12) % 12
      : currentMidiNotes[0] % 12; // fallback if root state is unexpectedly unset
    nameEl.textContent = getChordRootName() + ' ' + currentChord.name;
    const chipRow = document.getElementById('keysigChipRow');
    chipRow.style.display = 'flex';
    document.getElementById('keysigChipC').classList.toggle('active', chordKeySigMode === 'C');
    document.getElementById('keysigChipKey').classList.toggle('active', chordKeySigMode === 'key');
    const keySigStr = chordKeySigMode === 'key' ? getChordKeyStr(sym, rootPc) : null;

    const sorted = [...currentMidiNotes].sort((a, b) => a - b);
    if (currentChordPlayStyle === 'ascending') {
      renderNotation(sorted, true, sym, rootPc, keySigStr);
    } else if (currentChordPlayStyle === 'descending') {
      renderNotation([...sorted].reverse(), true, sym, rootPc, keySigStr);
    } else if (currentChordPlayStyle === 'broken') {
      // Broken pattern: root → top → middle → top, matching the audio playback order.
      const root = sorted[0];
      const top  = sorted[sorted.length - 1];
      const mid  = sorted.length > 2 ? sorted[1] : sorted[0];
      renderNotation([root, top, mid, top], true, sym, rootPc, keySigStr);
    } else {
      // Block: stacked whole-note chord.
      renderNotation(currentMidiNotes, false, sym, rootPc, keySigStr);
    }
    // Inversion chips are only relevant for standard chords (not slash/poly/UST).
    if (answered) renderInversionChips();
  }

  area.style.display = 'block';
  document.getElementById('notationPanel').style.display = 'block';
  showBreakdown();
}

// =============================================================================
// The Sound Travels Ear Training — js/engine/notation.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
