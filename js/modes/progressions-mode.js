/**
 * @file
 * @author    Renato Fera P. — https://www.linkedin.com/in/renato-profeta/
 * @copyright © 2026 The Sound Travels — MIT License
 */

/**
 * @file progressions-mode.js
 * @description Progression quiz and dictionary mode: playback, question generation,
 *   answer UI, grading, post-answer notation, dict panel, and DOM teardown.
 *   Pool panel rendering (quiz) lives in pool-progressions.js.
 *   Pool panel rendering (dict) lives here — tightly coupled to dictProgSymbol state.
 * @layer modes
 * @requires state.js, defaults.js, progressions.js, chords.js, spelling.js,
 *           keysig.js, notation.js, audio.js, breakdown.js, pool.js,
 *           pool-progressions.js
 */

// ─── Playback ─────────────────────────────────────────────────────────────────

/**
 * Builds block-chord MIDI notes for one chord in a progression.
 * Looks up the chord type by symbol in the standard CHORD_TYPES families;
 * falls back to a plain major triad if the symbol is not found.
 *
 * @param {number} rootMidi - MIDI number of the chord root.
 * @param {string} qualSym  - Chord quality symbol (e.g. 'maj', 'm7', 'dom7').
 * @returns {number[]} MIDI note numbers for the chord.
 */
function progChordMidi(rootMidi, qualSym) {
  const allChords = [
    ...CHORD_TYPES.major, ...CHORD_TYPES.minor, ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished, ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended
  ];
  const ct = allChords.find(c => c.symbol === qualSym);
  const intervals = ct ? ct.intervals : [0, 4, 7]; // fallback: major triad
  return intervals.map(i => rootMidi + i);
}

/**
 * Plays the current progression at normal speed (~0.5 s gap between chord onsets).
 * Disables the play button for the duration of playback.
 */
function playProgression() {
  if (!piano || !currentProgression) return;
  const btn = document.getElementById('playBtn');
  btn.disabled = true;

  const gapMs  = 500;  // gap between chord onsets
  const durSec = 1.2;  // how long each chord sustains

  currentProgression.degrees.forEach((degSemis, i) => {
    setTimeout(() => {
      const rootMidi = currentProgRootMidi + degSemis;
      const midiNotes = progChordMidi(rootMidi, currentProgression.qualities[i]);
      midiNotes.forEach(m => {
        const noteName = NOTE_NAMES[m % 12] + Math.floor(m / 12 - 1);
        piano.play(noteName, audioCtx.currentTime, { duration: durSec, gain: 0.7 });
      });
    }, i * (gapMs + durSec * 200)); // stagger onsets
  });

  const totalMs = currentProgression.degrees.length * (gapMs + durSec * 200) + durSec * 1000;
  setTimeout(() => { btn.disabled = false; }, totalMs);
}

/**
 * Plays the current progression slowly (double gaps, longer sustain).
 * Used by the 🐢 Hear slowly button in both quiz and dict modes.
 */
function playProgressionSlowly() {
  if (!piano || !currentProgression) return;
  const btn = document.getElementById('playBtn');
  btn.disabled = true;
  const gapMs  = 1000;
  const durSec = 2.0;

  currentProgression.degrees.forEach((degSemis, i) => {
    setTimeout(() => {
      const rootMidi = currentProgRootMidi + degSemis;
      const midiNotes = progChordMidi(rootMidi, currentProgression.qualities[i]);
      midiNotes.forEach(m => {
        const noteName = NOTE_NAMES[m % 12] + Math.floor(m / 12 - 1);
        piano.play(noteName, audioCtx.currentTime, { duration: durSec, gain: 0.65 });
      });
    }, i * (gapMs + durSec * 200));
  });

  const totalMs = currentProgression.degrees.length * (gapMs + durSec * 200) + durSec * 1000;
  setTimeout(() => { btn.disabled = false; }, totalMs);
}

// ─── Question generation ──────────────────────────────────────────────────────

/**
 * Picks a random progression from the selected pool, sets up all state,
 * and renders the answer UI. Resets key sig chip to C on each new question.
 */
function generateProgressionQuestion() {
  const pool = PROGRESSIONS.filter(p => selectedProgressions.has(p.symbol));
  if (!pool.length) {
    document.getElementById('chordHint').textContent = 'No progressions selected — pick some below.';
    document.getElementById('playBtn').disabled = true;
    return;
  }

  currentProgression = pool[Math.floor(Math.random() * pool.length)];
  progKeySigMode = 'C'; // reset key sig chip each new question

  // Tonic root — use pinnedRoot if set, otherwise random
  const pc = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
  currentProgRootPc   = pc;
  currentProgRootMidi = 12 + pc + 4 * 12; // octave 4 — comfortable range

  progSlotAnswers = currentProgression.degrees.map(() => ({ degreeIdx: null, qualityIdx: null }));
  progAnswered = false;

  resetQuizUI();
  document.getElementById('playLabel').textContent = 'Play progression';
  document.getElementById('playBtn').disabled = false;
  document.getElementById('chordHint').textContent = '';
  updateRootBadge(showRoot ? spelledRoot(pc) : null);

  renderProgressionAnswerUI();
}

// ─── Answer UI ────────────────────────────────────────────────────────────────

/**
 * Builds the slot-based answer UI: one column per chord in the progression,
 * each with a degree row (I–VII) and a quality row (maj / min / dom7 / dim).
 * Appends Submit and Hear Slowly buttons below the slots.
 */
function renderProgressionAnswerUI() {
  document.getElementById('statusMsg').textContent = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';
  document.getElementById('notationPanel').style.display = 'none';
  document.getElementById('breakdownWrapper').style.display = 'none';

  const ctrl = document.getElementById('controls');
  ctrl.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.id = 'progSlotsWrap';
  wrap.className = 'prog-slots-wrap';

  currentProgression.degrees.forEach((_, slotIdx) => {
    const slot = document.createElement('div');
    slot.className = 'prog-slot';
    slot.id = `prog-slot-${slotIdx}`;

    const lbl = document.createElement('div');
    lbl.className = 'prog-slot-label';
    lbl.textContent = `Chord ${slotIdx + 1}`;
    slot.appendChild(lbl);

    // Degree row
    const degRow = document.createElement('div');
    degRow.className = 'prog-slot-row';
    PROG_DEGREES.forEach((deg, di) => {
      const chip = document.createElement('button');
      chip.className = 'prog-chip';
      chip.textContent = deg.label;
      chip.dataset.slot = slotIdx;
      chip.dataset.di   = di;
      chip.addEventListener('click', () => {
        if (progAnswered) return;
        progSlotAnswers[slotIdx].degreeIdx = di;
        degRow.querySelectorAll('.prog-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        updateSubmitBtn();
      });
      degRow.appendChild(chip);
    });
    slot.appendChild(degRow);

    // Quality row
    const qualRow = document.createElement('div');
    qualRow.className = 'prog-slot-row';
    PROG_QUALITIES.forEach((q, qi) => {
      const chip = document.createElement('button');
      chip.className = 'prog-chip';
      chip.textContent = q.label;
      chip.dataset.slot = slotIdx;
      chip.dataset.qi   = qi;
      chip.addEventListener('click', () => {
        if (progAnswered) return;
        progSlotAnswers[slotIdx].qualityIdx = qi;
        qualRow.querySelectorAll('.prog-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        updateSubmitBtn();
      });
      qualRow.appendChild(chip);
    });
    slot.appendChild(qualRow);

    wrap.appendChild(slot);
  });

  ctrl.appendChild(wrap);

  // Submit button — disabled until every slot has both a degree and quality answer
  const submitRow = document.createElement('div');
  submitRow.className = 'prog-submit-row';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'prog-submit-btn';
  submitBtn.id = 'progSubmitBtn';
  submitBtn.textContent = 'Submit';
  submitBtn.disabled = true;
  submitBtn.addEventListener('click', submitProgressionAnswer);
  submitRow.appendChild(submitBtn);
  ctrl.appendChild(submitRow);

  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.style.marginTop = '0.5rem';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playProgressionSlowly);
  ctrl.appendChild(sb);
}

/**
 * Enables the Submit button only when every slot has both a degree and quality selected.
 */
function updateSubmitBtn() {
  const allFilled = progSlotAnswers.every(s => s.degreeIdx !== null && s.qualityIdx !== null);
  const btn = document.getElementById('progSubmitBtn');
  if (btn) btn.disabled = !allFilled;
}

// ─── Grading ──────────────────────────────────────────────────────────────────

/**
 * Grades the submitted answer slot by slot. Marks each slot correct/wrong,
 * reveals the correct answer in wrong slots, updates score/streak, shows
 * post-answer notation and breakdown, and appends a Next progression button.
 */
function submitProgressionAnswer() {
  progAnswered = true;
  let allCorrect = true;

  currentProgression.degrees.forEach((degSemis, i) => {
    const correctDegIdx  = PROG_DEGREES.findIndex(d => d.semi === degSemis);
    const correctQualSym = currentProgression.qualities[i];
    const correctQualIdx = PROG_QUALITIES.findIndex(q => q.sym === correctQualSym);

    const ans    = progSlotAnswers[i];
    const degOk  = ans.degreeIdx  === correctDegIdx;
    const qualOk = ans.qualityIdx === correctQualIdx;
    const slotOk = degOk && qualOk;

    if (!slotOk) allCorrect = false;

    const slotEl = document.getElementById(`prog-slot-${i}`);
    slotEl.classList.add(slotOk ? 'correct' : 'wrong');
    slotEl.querySelectorAll('.prog-chip').forEach(c => c.classList.add('disabled'));

    if (!slotOk) {
      const lbl = slotEl.querySelector('.prog-slot-label');
      const revealed = document.createElement('span');
      revealed.className = 'prog-slot-revealed';
      const correctDegLabel  = correctDegIdx  >= 0 ? PROG_DEGREES[correctDegIdx].label   : '?';
      const correctQualLabel = correctQualIdx >= 0 ? PROG_QUALITIES[correctQualIdx].label : correctQualSym;
      revealed.textContent = `→ ${correctDegLabel} ${correctQualLabel}`;
      lbl.appendChild(revealed);
    }
  });

  // Score — all-or-nothing per progression
  total++;
  document.getElementById('total').textContent = total;
  const statKey = currentProgression.symbol;
  if (!sessionStats[statKey]) sessionStats[statKey] = { name: currentProgression.name, correct: 0, total: 0 };
  sessionStats[statKey].total++;

  if (allCorrect) {
    correct++;
    streak++;
    sessionStats[statKey].correct++;
    document.getElementById('correct').textContent = correct;
    document.getElementById('streak').textContent  = streak;
    const statusEl = document.getElementById('statusMsg');
    statusEl.textContent = '✓ Correct!';
    statusEl.className   = 'status-msg correct';
  } else {
    streak = 0;
    document.getElementById('streak').textContent = 0;
    const statusEl = document.getElementById('statusMsg');
    statusEl.textContent = '✗ Not quite';
    statusEl.className   = 'status-msg wrong';
  }
  updateScore();
  answered = true;

  const submitBtnEl = document.getElementById('progSubmitBtn');
  if (submitBtnEl) submitBtnEl.style.display = 'none';

  showProgressionNotation();
  showBreakdown();

  const submitRowEl = document.querySelector('.prog-submit-row');
  if (submitRowEl) {
    const nb = document.createElement('button');
    nb.className = 'prog-submit-btn';
    nb.id = 'nextBtn';
    nb.textContent = 'Next progression';
    nb.addEventListener('click', generateProgressionQuestion);
    submitRowEl.appendChild(nb);
  }
}

// ─── Post-answer notation ─────────────────────────────────────────────────────

/**
 * Renders the full progression as a continuous VexFlow score after the answer
 * is submitted or in dict mode. Supports treble, bass, or grand staff depending
 * on the MIDI range of the progression. Shows Roman numeral + quality labels
 * above the stave, and teal chord name labels below them.
 */
function showProgressionNotation() {
  const panel  = document.getElementById('notationPanel');
  const nameEl = document.getElementById('notationChordName');
  panel.style.display = 'block';
  nameEl.textContent  = currentProgression.symbol + ' — ' + currentProgression.name;

  // Key/C chips
  const keysigRow = document.getElementById('keysigChipRow');
  keysigRow.style.display = 'flex';
  document.getElementById('keysigChipC').classList.toggle('active',   progKeySigMode === 'C');
  document.getElementById('keysigChipKey').classList.toggle('active', progKeySigMode === 'key');
  document.getElementById('inversionChipRow').style.display = 'none';

  const keySigStr      = progKeySigMode === 'key' ? vexKeyMajor(currentProgRootPc) : null;
  const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

  const notationArea = document.getElementById('notationArea');
  notationArea.style.display = 'block';
  notationArea.querySelectorAll('.prog-notation-row').forEach(el => el.remove());

  const scrollEl = notationArea.querySelector('.notation-scroll');
  if (scrollEl) scrollEl.style.display = '';

  const svg = document.getElementById('notation-svg');
  svg.innerHTML = '';

  const VF = (typeof Vex !== 'undefined' && Vex.Flow) ? Vex.Flow
           : (typeof VexFlow !== 'undefined') ? VexFlow : null;
  if (!VF) return;
  const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter } = VF;

  // Build per-chord data
  const allChordTypes = [
    ...CHORD_TYPES.major, ...CHORD_TYPES.minor, ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished, ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended,
  ];

  const chords = currentProgression.degrees.map((degSemis, i) => {
    const qualSym       = currentProgression.qualities[i];
    const chordRootMidi = currentProgRootMidi + degSemis;
    const chordRootPc   = ((chordRootMidi % 12) + 12) % 12;
    const ct            = allChordTypes.find(c => c.symbol === qualSym);
    const intervals     = ct ? ct.intervals : [0, 4, 7];
    const midiNotes     = intervals.map(iv => chordRootMidi + iv);
    const degObj        = PROG_DEGREES.find(d => d.semi === degSemis)  || { label: '?' };
    const qualObj       = PROG_QUALITIES.find(q => q.sym === qualSym)  || { label: qualSym };
    const rootName      = spelledRoot(chordRootPc);
    // Major triads conventionally omit the quality suffix (G not Gmaj)
    const chordDisplayName = rootName + (ct && ct.name !== 'maj' ? ct.name : '');
    return { degSemis, qualSym, chordRootMidi, chordRootPc, midiNotes,
             degLabel: degObj.label, qualLabel: qualObj.label, rootName, chordDisplayName };
  });

  // Clef decision: union of all MIDI notes across the whole progression
  const allMidi     = chords.flatMap(c => c.midiNotes);
  const lowestMidi  = Math.min(...allMidi);
  const highestMidi = Math.max(...allMidi);
  const needsBass   = lowestMidi  < 55;
  const needsTreble = highestMidi >= 55;
  const grandStaff  = needsBass && needsTreble;

  // Layout
  const keySigCount  = keySigStr ? keySigAccidentalCount(keySigStr) : 0;
  const headerPx     = 36 + keySigCount * 14; // clef + key sig
  const chordWidth   = 80;                     // px per chord slot
  const numChords    = chords.length;
  const W            = headerPx + chordWidth * numChords + 20;
  let H, trebleY, bassY;
  if (grandStaff) { H = 240; trebleY = 20; bassY = 120; }
  else            { H = 140; trebleY = 30; bassY = 30;  }

  svg.setAttribute('width',  W);
  svg.setAttribute('height', H);
  const renderer = new Renderer(svg, Renderer.Backends.SVG);
  renderer.resize(W, H);
  const ctx = renderer.getContext();

  // Spelling helpers
  function spellMidi(midi, chordRootPc, qualSym) {
    const raw = midiToVexKeySpelled(midi, pcInterval(midi % 12, chordRootPc), chordRootPc, qualSym);
    if (!keySigStr) return { key: raw, forcedAcc: false };
    const respelled       = respellForKeySig(midi, raw, coveredLetters, keySigStr);
    const rawLetter       = raw.split('/')[0];
    const respelledLetter = respelled.split('/')[0];
    const wasDouble       = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
    const isSameLetter    = rawLetter[0] === respelledLetter[0];
    const forcedAcc       = wasDouble && isSameLetter && respelled !== raw;
    return { key: respelled, forcedAcc };
  }

  function addAccidentalsFiltered(sn, spelledArr) {
    spelledArr.forEach(({ key, forcedAcc }, i) => {
      if (!forcedAcc && isCoveredByKeySig(key, coveredLetters)) return;
      const acc = vexAccidental(key);
      if (acc) sn.addModifier(new VF.Accidental(acc), i);
    });
  }

  try {
    const STAVE_X = 10;
    const STAVE_W = W - STAVE_X - 10;
    let trebleStave, bassStave;

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

    // Each chord becomes a whole note; BarNotes separate slots
    function buildTickables(clef) {
      const tickables = [];
      chords.forEach((chord, i) => {
        const { midiNotes, chordRootPc, qualSym } = chord;
        let notesForClef;
        if (grandStaff) {
          notesForClef = clef === 'treble'
            ? midiNotes.filter(m => m >= 55)
            : midiNotes.filter(m => m  < 55);
        } else {
          notesForClef = [...midiNotes];
        }
        notesForClef.sort((a, b) => a - b);

        let tickable;
        if (notesForClef.length === 0) {
          const restKey = clef === 'bass' ? 'd/3' : 'b/4';
          tickable = new StaveNote({ keys: [restKey], duration: 'wr', clef });
        } else {
          const spelled = notesForClef.map(m => spellMidi(m, chordRootPc, qualSym));
          const keys    = spelled.map(s => s.key);
          tickable = new StaveNote({ keys, duration: 'w', clef });
          addAccidentalsFiltered(tickable, spelled);
        }

        if (i > 0) tickables.push(new VF.BarNote());
        tickables.push(tickable);
      });
      return tickables;
    }

    const formatterBudget = STAVE_W - headerPx - 10;
    const totalBeats      = numChords * 4;

    if (needsTreble || grandStaff) {
      const tickables = buildTickables('treble');
      const voice = new Voice({ num_beats: totalBeats, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables(tickables);
      new Formatter().joinVoices([voice]).format([voice], formatterBudget);
      voice.draw(ctx, trebleStave);
    }
    if (needsBass || grandStaff) {
      const tickables = buildTickables('bass');
      const voice = new Voice({ num_beats: totalBeats, beat_value: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables(tickables);
      new Formatter().joinVoices([voice]).format([voice], formatterBudget);
      voice.draw(ctx, bassStave);
    }

    // Chord labels above the stave — two lines per slot:
    //   Upper (bold):  Roman numeral + quality, e.g. "V 7"
    //   Lower (teal):  Full chord name, e.g. "G7"
    const labelY = (needsTreble || grandStaff) ? trebleY - 4 : bassY - 4;
    const slotW  = formatterBudget / numChords;
    chords.forEach((chord, i) => {
      const x = STAVE_X + headerPx + i * slotW + slotW / 2;
      const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t1.setAttribute('x', x);
      t1.setAttribute('y', labelY - 13);
      t1.setAttribute('text-anchor', 'middle');
      t1.setAttribute('font-size', '11');
      t1.setAttribute('font-family', 'Inter, Arial, sans-serif');
      t1.setAttribute('font-weight', '600');
      t1.setAttribute('fill', 'currentColor');
      t1.textContent = chord.degLabel + ' ' + chord.qualLabel;
      svg.appendChild(t1);
      const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t2.setAttribute('x', x);
      t2.setAttribute('y', labelY);
      t2.setAttribute('text-anchor', 'middle');
      t2.setAttribute('font-size', '10');
      t2.setAttribute('font-family', 'Inter, Arial, sans-serif');
      t2.setAttribute('fill', 'var(--accent, #4a9e8e)');
      t2.textContent = chord.chordDisplayName;
      svg.appendChild(t2);
    });

  } catch(e) { console.error('Progression notation render error:', e); }
}

// ─── Dictionary pool panel ────────────────────────────────────────────────────

/**
 * Renders the dictionary progression pool panel directly into #poolPanel.
 * Single-select: clicking a chip immediately loads that progression via
 * dictShowProgression(). Stays in progressions-mode.js because it is tightly
 * coupled to dictProgSymbol state and dictShowProgression().
 */
function renderDictProgressionPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';
  const { body } = makePoolPanelShell(panel, 'Dictionary — Progressions', null);

  const visibleProgressions = appDifficulty === 'basic'
    ? PROGRESSIONS.filter(p => p.basic)
    : [...PROGRESSIONS];

  PROG_GROUPS.forEach(group => {
    const items = visibleProgressions.filter(p => p.group === group);
    if (items.length === 0) return;
    const collapsed = PROG_GROUP_COLLAPSED[group] ?? false;
    _makeDictProgSection(body, group, items, collapsed);
  });
}

/**
 * Builds one collapsible group section for the dict progression pool panel.
 * Chips are single-select: clicking immediately loads the progression.
 * No count display or All/None buttons — dict panels are browse-only.
 *
 * @param {HTMLElement} body           - The pool panel body to append into.
 * @param {string}      title          - Section heading text (group name).
 * @param {object[]}    items          - Progressions for this section ({ symbol, name, ... }).
 * @param {boolean}     [collapsed=false] - Default collapsed state.
 */
function _makeDictProgSection(body, title, items, collapsed = false) {
  const sec = document.createElement('div');
  sec.className = 'pool-section';

  const hdr = document.createElement('div');
  hdr.className = 'pool-section-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'pool-section-title';
  const chevron = document.createElement('span');
  chevron.className = 'pool-section-chevron';
  chevron.textContent = collapsed ? '▸' : '▾';
  titleEl.appendChild(chevron);
  titleEl.appendChild(document.createTextNode(title));
  hdr.appendChild(titleEl);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (collapsed ? ' collapsed' : '');

  hdr.addEventListener('click', () => {
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip prog-pool-chip' + (dictProgSymbol === item.symbol ? ' active' : '');
    chip.innerHTML = `<span class="prog-chip-sym">${item.symbol}</span><span class="prog-chip-name">${item.name}</span>`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('#poolPanel .pool-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      dictProgSymbol = item.symbol;
      dictShowProgression(item);
    });
    chipsEl.appendChild(chip);
  });

  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

// ─── Dictionary mode ──────────────────────────────────────────────────────────

/** Tracks the currently active progression symbol in dict mode. */
let dictProgSymbol = null;

/**
 * Loads a progression in dict mode: sets state, resets UI, shows notation
 * and breakdown immediately, and renders a Hear Slowly button.
 *
 * @param {object} prog - A progression descriptor from PROGRESSIONS.
 */
function dictShowProgression(prog) {
  currentProgression = prog;
  const pc = pinnedRoot !== null ? pinnedRoot : 0;
  currentProgRootPc   = pc;
  currentProgRootMidi = 12 + pc + 4 * 12;
  progAnswered = true; // allows notation to render

  updateRootBadge(spelledRoot(pc));

  document.getElementById('statusMsg').textContent = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';
  document.getElementById('breakdownWrapper').style.display   = 'none';

  const ctrl = document.getElementById('controls');
  ctrl.innerHTML = '';

  showProgressionNotation();
  showBreakdown();

  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playProgressionSlowly);
  ctrl.appendChild(sb);
}

// ─── Mode entry & routing ─────────────────────────────────────────────────────

/**
 * Entry point called by generateQuestion() when currentMode === 'progressions'.
 * Routes to dict or quiz flow depending on appMode.
 */
function generateProgressionQuestion_entry() {
  if (appMode === 'dict') {
    if (!dictProgSymbol) dictProgSymbol = PROGRESSIONS[0].symbol;
    const prog = PROGRESSIONS.find(p => p.symbol === dictProgSymbol) || PROGRESSIONS[0];
    renderDictProgressionPoolPanel();
    dictShowProgression(prog);
  } else {
    generateProgressionQuestion();
  }
}

/**
 * Top-level question dispatcher — routes to the appropriate mode handler.
 * Overrides the stub defined in app.js (if any); must load after it.
 */
function generateQuestion() {
  if (currentMode === 'intervals')    generateIntervalQuestion();
  else if (currentMode === 'scales')  generateScaleQuestion();
  else if (currentMode === 'progressions') generateProgressionQuestion_entry();
  else generateChordQuestion();
}

// ─── DOM teardown ─────────────────────────────────────────────────────────────

/**
 * Restores every DOM element that showProgressionNotation() mutates.
 * Must be called on any mode switch or new question so other modes
 * get a clean slate.
 */
function teardownProgressionUI() {
  // Restore .notation-scroll (hidden by showProgressionNotation)
  const scrollEl = document.querySelector('.notation-scroll');
  if (scrollEl) scrollEl.style.display = '';
  // Remove any injected .prog-notation-row
  document.querySelectorAll('.prog-notation-row').forEach(el => el.remove());
  // Restore keysig chip row (hidden by showProgressionNotation)
  const keysigRow = document.getElementById('keysigChipRow');
  if (keysigRow) keysigRow.style.display = '';
  // Clear SVG so stale progression mini-staves don't bleed through
  const svg = document.getElementById('notation-svg');
  if (svg) svg.innerHTML = '';
  // Clear controls area (progression injects Submit / Next / Hear Slowly buttons)
  const ctrl = document.getElementById('controls');
  if (ctrl) ctrl.innerHTML = '';
}

// @file-end — The Sound Travels Ear Training © 2026
