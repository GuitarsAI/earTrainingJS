// ─── Shared quiz helpers ──────────────────────────────────────────────────────

// ─── POINT 38: Progression playback ──────────────────────────────────────────

// Build block chord MIDI notes for one progression chord
function progChordMidi(rootMidi, qualSym) {
  // Find the chord type from CHORD_TYPES by matching symbol
  const allChords = [
    ...CHORD_TYPES.major, ...CHORD_TYPES.minor, ...CHORD_TYPES.dominant,
    ...CHORD_TYPES.diminished, ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended
  ];
  const ct = allChords.find(c => c.symbol === qualSym);
  const intervals = ct ? ct.intervals : [0, 4, 7]; // fallback: major triad
  return intervals.map(i => rootMidi + i);
}

// Play the current progression — ~0.5s gap between chords
function playProgression() {
  if (!piano || !currentProgression) return;
  const btn = document.getElementById('playBtn');
  btn.disabled = true;

  const gapMs  = 500;   // gap between chord onsets
  const durSec = 1.2;   // how long each chord sustains

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

// Play slowly (double gaps)
function playProgressionSlowly() {
  if (!piano || !currentProgression) return;
  const btn = document.getElementById('playBtn');
  btn.disabled = true;
  const gapMs = 1000;
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

// ─── POINT 38: Progression question generation ───────────────────────────────

function generateProgressionQuestion() {
  const pool = PROGRESSIONS.filter(p => selectedProgressions.has(p.symbol));
  if (!pool.length) {
    document.getElementById('chordHint').textContent = 'No progressions selected — pick some below.';
    document.getElementById('playBtn').disabled = true;
    return;
  }

  currentProgression = pool[Math.floor(Math.random() * pool.length)];
  progKeySigMode = 'C'; // reset key sig chip each new question

  // Tonic root — use pinnedRoot if set
  const pc = pinnedRoot !== null ? pinnedRoot : Math.floor(Math.random() * 12);
  currentProgRootPc   = pc;
  currentProgRootMidi = 12 + pc + 4 * 12; // octave 4 — comfortable range

  progSlotAnswers = currentProgression.degrees.map(() => ({ degreeIdx: null, qualityIdx: null }));
  progAnswered = false;

  resetQuizUI();
  document.getElementById('playLabel').textContent = 'Play progression';
  document.getElementById('playBtn').disabled = false;
  document.getElementById('chordHint').textContent = '';
  updateRootBadge(showRoot ? NOTE_NAMES[pc] : null);

  renderProgressionAnswerUI();
}

// ─── POINT 38: Progression answer UI ─────────────────────────────────────────

function renderProgressionAnswerUI() {
  const statusEl = document.getElementById('statusMsg');
  statusEl.textContent = '';

  // Hide irrelevant panels
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
      chip.dataset.slot  = slotIdx;
      chip.dataset.di    = di;
      chip.addEventListener('click', () => {
        if (progAnswered) return;
        progSlotAnswers[slotIdx].degreeIdx = di;
        // Deactivate siblings in this row
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

  // Submit button
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

  // Slow button
  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.style.marginTop = '0.5rem';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playProgressionSlowly);
  ctrl.appendChild(sb);
}

function updateSubmitBtn() {
  const allFilled = progSlotAnswers.every(s => s.degreeIdx !== null && s.qualityIdx !== null);
  const btn = document.getElementById('progSubmitBtn');
  if (btn) btn.disabled = !allFilled;
}

// ─── POINT 38: Grade answer ───────────────────────────────────────────────────

function submitProgressionAnswer() {
  progAnswered = true;

  let allCorrect = true;

  currentProgression.degrees.forEach((degSemis, i) => {
    const correctDegIdx  = PROG_DEGREES.findIndex(d => d.semi === degSemis);
    const correctQualSym = currentProgression.qualities[i];
    const correctQualIdx = PROG_QUALITIES.findIndex(q => q.sym === correctQualSym);

    const ans = progSlotAnswers[i];
    const degOk  = ans.degreeIdx  === correctDegIdx;
    const qualOk = ans.qualityIdx === correctQualIdx;
    const slotOk = degOk && qualOk;

    if (!slotOk) allCorrect = false;

    const slotEl = document.getElementById(`prog-slot-${i}`);
    slotEl.classList.add(slotOk ? 'correct' : 'wrong');

    // Disable all chips in this slot
    slotEl.querySelectorAll('.prog-chip').forEach(c => c.classList.add('disabled'));

    // Reveal correct answer in red slots
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

  // Score — all-or-nothing
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

  // Hide submit, show Next
  const submitBtnEl = document.getElementById('progSubmitBtn');
  if (submitBtnEl) submitBtnEl.style.display = 'none';

  showProgressionNotation();
  showBreakdown();

  // Add Next progression button
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

// ─── POINT 38: Post-answer notation ──────────────────────────────────────────

function showProgressionNotation() {
  // Show the notation panel with a label per chord
  const panel  = document.getElementById('notationPanel');
  const nameEl = document.getElementById('notationChordName');

  panel.style.display = 'block';
  nameEl.textContent  = currentProgression.symbol + ' — ' + currentProgression.name;

  // Show keysig chips (C = no key sig, Key = tonic major key sig); hide inversion chips
  const keysigRow = document.getElementById('keysigChipRow');
  keysigRow.style.display = 'flex';
  document.getElementById('keysigChipC').classList.toggle('active',   progKeySigMode === 'C');
  document.getElementById('keysigChipKey').classList.toggle('active', progKeySigMode === 'key');
  document.getElementById('inversionChipRow').style.display = 'none';

  // Resolve key signature string: tonic major key when mode='key', null for 'C'
  const keySigStr = progKeySigMode === 'key' ? vexKeyMajor(currentProgRootPc) : null;
  const coveredLetters = keySigStr ? keySigCoveredLetters(keySigStr) : new Set();

  // Render each chord's mini notation into the notation area
  const notationArea = document.getElementById('notationArea');
  notationArea.style.display = 'block';

  // Clear existing SVG (standard single-chord canvas — not used in prog mode)
  document.getElementById('notation-svg').innerHTML = '';

  // Remove any previous prog notation row, then build a fresh one
  const scrollEl = notationArea.querySelector('.notation-scroll');
  notationArea.querySelectorAll('.prog-notation-row').forEach(el => el.remove());

  const row = document.createElement('div');
  row.className = 'prog-notation-row';

  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  currentProgression.degrees.forEach((degSemis, i) => {
    const chordRootMidi = currentProgRootMidi + degSemis;
    const chordRootPc   = ((chordRootMidi % 12) + 12) % 12;
    const qualSym       = currentProgression.qualities[i];

    // Find chord intervals from library
    const allChords = [
      ...CHORD_TYPES.major, ...CHORD_TYPES.minor, ...CHORD_TYPES.dominant,
      ...CHORD_TYPES.diminished, ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended
    ];
    const ct        = allChords.find(c => c.symbol === qualSym);
    const intervals = ct ? ct.intervals : [0, 4, 7];
    const midiNotes = intervals.map(iv => chordRootMidi + iv);

    // Chord label above stave: degree + quality
    const degObj  = PROG_DEGREES.find(d => d.semi === degSemis) || { label: '?' };
    const qualObj = PROG_QUALITIES.find(q => q.sym === qualSym) || { label: qualSym };
    const chordLabel = degObj.label + ' ' + qualObj.label;

    // Cell container
    const cell = document.createElement('div');
    cell.className = 'prog-notation-cell';

    const labelEl = document.createElement('div');
    labelEl.className = 'prog-notation-cell-label';
    labelEl.textContent = chordLabel;
    cell.appendChild(labelEl);

    const svgWrap = document.createElement('div');
    svgWrap.style.width  = '90px';
    svgWrap.style.height = '100px';
    cell.appendChild(svgWrap);
    row.appendChild(cell);

    try {
      const renderer = new Renderer(svgWrap, Renderer.Backends.SVG);
      renderer.resize(90, 100);
      const vexCtx = renderer.getContext();
      vexCtx.setFont('Arial', 10);

      // Stave width: wider when there's a key signature (needs room for accidentals)
      const staveW = keySigStr ? 78 : 80;
      const stave  = new Stave(2, 10, staveW);
      if (keySigStr) stave.addKeySignature(keySigStr);
      stave.setContext(vexCtx).draw();

      // Spell each note using the same pipeline as all other modes:
      // midiToVexKeySpelled → respellForKeySig → forcedAcc for same-letter simplification
      const spelled = midiNotes.map(m => {
        const intervalSemi = pcInterval(m % 12, chordRootPc);
        const raw = midiToVexKeySpelled(m, intervalSemi, chordRootPc, qualSym);
        if (!keySigStr) return { key: raw, forcedAcc: false };
        const respelled = respellForKeySig(m, raw, coveredLetters, keySigStr);
        const rawLetter       = raw.split('/')[0];
        const respelledLetter = respelled.split('/')[0];
        const wasDouble   = rawLetter.endsWith('##') || (rawLetter.endsWith('bb') && rawLetter.length > 2);
        const isSameLetter = rawLetter[0] === respelledLetter[0];
        const forcedAcc   = wasDouble && isSameLetter && respelled !== raw;
        return { key: respelled, forcedAcc };
      });
      const keys = spelled.map(s => s.key);

      const staveNote = new StaveNote({ keys, duration: 'w', clef: 'treble' });

      // Add accidentals — forcedAcc overrides key sig coverage for same-letter simplifications
      spelled.forEach(({ key, forcedAcc }, ki) => {
        if (!forcedAcc && keySigStr && isCoveredByKeySig(key, coveredLetters)) return;
        const acc = vexAccidental(key);
        if (acc) staveNote.addModifier(new Accidental(acc), ki);
      });

      const voice = new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
      voice.addTickables([staveNote]);
      new Formatter().joinVoices([voice]).format([voice], staveW - 20);
      voice.draw(vexCtx, stave);
    } catch(e) {
      console.warn('Progression stave render error (chord ' + i + '):', e);
    }
  });

  // Insert row before the standard scroll div (which we hide)
  if (scrollEl) notationArea.insertBefore(row, scrollEl);
  else notationArea.appendChild(row);

  // Hide the standard single-chord SVG scroll area
  if (scrollEl) scrollEl.style.display = 'none';
}

// ─── POINT 38: Pool panels ────────────────────────────────────────────────────

function renderProgressionPoolPanel(panel) {
  const { body, updateMeta } = makePoolPanelShell(panel, 'Training pool — Progressions',
    () => `${PROGRESSIONS.filter(p => selectedProgressions.has(p.symbol)).length} / ${PROGRESSIONS.length}`);

  const onChangeFn = () => { updateMeta(); };

  PROG_GROUPS.forEach(group => {
    const items = PROGRESSIONS.filter(p => p.group === group);
    const collapsed = PROG_GROUP_COLLAPSED[group] ?? false;
    makeProgSection(body, group, items, collapsed, onChangeFn);
  });

  updateMeta();
}

// Two-line chip section for progressions quiz pool (symbol + name, multi-select + All/None)
function makeProgSection(body, title, items, collapsed = false, onChangeFn = () => {}) {
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

  const right = document.createElement('span');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  const countEl = document.createElement('span');
  countEl.className = 'pool-section-count';

  const allBtn = document.createElement('button');
  allBtn.className = 'pool-all-btn';
  allBtn.textContent = 'All';

  const noneBtn = document.createElement('button');
  noneBtn.className = 'pool-all-btn';
  noneBtn.textContent = 'None';

  right.appendChild(countEl);
  right.appendChild(allBtn);
  right.appendChild(noneBtn);
  hdr.appendChild(titleEl);
  hdr.appendChild(right);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'pool-section-body' + (collapsed ? ' collapsed' : '');

  const chipsEl = document.createElement('div');
  chipsEl.className = 'pool-chips';
  chipsEl.style.marginBottom = '0.4rem';

  hdr.addEventListener('click', (e) => {
    if (e.target === allBtn || e.target === noneBtn) return;
    const isCollapsed = sectionBody.classList.toggle('collapsed');
    chevron.textContent = isCollapsed ? '▸' : '▾';
  });

  const chips = [];

  function updateCount() {
    const active = items.filter(it => selectedProgressions.has(it.symbol)).length;
    countEl.textContent = active + ' / ' + items.length;
  }

  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedProgressions.add(it.symbol));
    chips.forEach(c => c.classList.add('active'));
    updateCount();
    onChangeFn();
  });

  noneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(it => selectedProgressions.delete(it.symbol));
    chips.forEach(c => c.classList.remove('active'));
    updateCount();
    onChangeFn();
  });

  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'pool-chip prog-pool-chip' + (selectedProgressions.has(item.symbol) ? ' active' : '');
    chip.innerHTML = `<span class="prog-chip-sym">${item.symbol}</span><span class="prog-chip-name">${item.name}</span>`;
    chip.addEventListener('click', () => {
      if (selectedProgressions.has(item.symbol)) selectedProgressions.delete(item.symbol);
      else selectedProgressions.add(item.symbol);
      chip.classList.toggle('active', selectedProgressions.has(item.symbol));
      updateCount();
      onChangeFn();
    });
    chips.push(chip);
    chipsEl.appendChild(chip);
  });

  updateCount();
  sectionBody.appendChild(chipsEl);
  sec.appendChild(hdr);
  sec.appendChild(sectionBody);
  body.appendChild(sec);
}

function renderDictProgressionPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';
  const { body } = makePoolPanelShell(panel, 'Dictionary — Progressions', null);

  PROG_GROUPS.forEach(group => {
    const items = PROGRESSIONS.filter(p => p.group === group);
    const collapsed = PROG_GROUP_COLLAPSED[group] ?? false;
    makeDictProgSection(body, group, items, collapsed);
  });
}

function makeDictProgSection(body, title, items, collapsed = false) {
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

// ─── POINT 38: Dictionary mode for progressions ───────────────────────────────

let dictProgSymbol = null;

function dictShowProgression(prog) {
  currentProgression = prog;
  const pc = pinnedRoot !== null ? pinnedRoot : 0;
  currentProgRootPc   = pc;
  currentProgRootMidi = 12 + pc + 4 * 12;
  progAnswered = true; // allows notation to show

  updateRootBadge(NOTE_NAMES[pc]);

  // Reset UI
  document.getElementById('statusMsg').textContent = '';
  document.getElementById('answerDropdownWrap').style.display = 'none';
  document.getElementById('breakdownWrapper').style.display   = 'none';

  const ctrl = document.getElementById('controls');
  ctrl.innerHTML = '';

  // Show notation immediately
  showProgressionNotation();
  showBreakdown();

  // Hear slowly + play buttons
  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', playProgressionSlowly);
  ctrl.appendChild(sb);
}

// ─── POINT 38: setAppMode / switchMode / generateQuestion patches ─────────────

function generateProgressionQuestion_entry() {
  if (appMode === 'dict') {
    // Dict: show first item by default
    if (!dictProgSymbol) dictProgSymbol = PROGRESSIONS[0].symbol;
    const prog = PROGRESSIONS.find(p => p.symbol === dictProgSymbol) || PROGRESSIONS[0];
    renderDictProgressionPoolPanel();
    dictShowProgression(prog);
  } else {
    generateProgressionQuestion();
  }
}

function generateQuestion() {
  if (currentMode === 'intervals') generateIntervalQuestion();
  else if (currentMode === 'scales') generateScaleQuestion();
  else if (currentMode === 'progressions') generateProgressionQuestion_entry();
  else generateChordQuestion();
}

// ─── Reapply settings to current item (no new item picked, same pitch class) ──
// Called when any setting changes (voicing, root, octave, style, direction).
// Recomputes midi notes from the current item + current pinned root/octave,
// then refreshes notation+breakdown if currently visible.
function recomputeCurrentNotes() {
  // ── Helpers ──────────────────────────────────────────────────────────────────

  // Resolve pitch class to use:
  // If user has pinned a root, always use that.
  // Otherwise keep the existing pitch class from the current notes.
  function resolvePc(existingPc) {
    return pinnedRoot !== null ? pinnedRoot : existingPc;
  }

  // Build root midi from a pitch class, respecting current octave band.
  // Prefers to keep the existing octave if it still falls within the band.
  function rootMidiForPc(pc, existingRootMidi, lo, hi) {
    const existingOct = Math.floor(existingRootMidi / 12) - 1;
    const oct = (existingOct >= lo && existingOct <= hi)
      ? existingOct
      : Math.floor((lo + hi) / 2);
    return 12 + pc + oct * 12;
  }

  // ── Chords ───────────────────────────────────────────────────────────────────
  if (currentMode === 'chords') {
    if (!currentChord) return;

    if (currentChord.family === 'slash') {
      const existingPc = currentUpperRootMidi !== null ? currentUpperRootMidi % 12 : 0;
      const pc = resolvePc(existingPc);
      const rootMidi = 12 + pc + 4 * 12;
      currentUpperRootMidi = rootMidi;
      currentChordRootMidi = rootMidi;
      const belowSemitones = 12 - currentChord.bassInterval;
      currentSlashBassMidi = rootMidi - belowSemitones;
      while (currentSlashBassMidi > 48) currentSlashBassMidi -= 12;
      while (currentSlashBassMidi < 28) currentSlashBassMidi += 12;
      currentMidiNotes = currentChord.upperIntervals.map(i => rootMidi + i);
    } else if (currentChord.family === 'poly') {
      const existingPc = currentPolyLowerRootMidi !== null
        ? ((currentPolyLowerRootMidi % 12) + 12) % 12 : 0;
      const pc = resolvePc(existingPc);
      let lowerRootMidi = 12 + pc + 3 * 12;
      while (lowerRootMidi > 48) lowerRootMidi -= 12;
      while (lowerRootMidi < 36) lowerRootMidi += 12;
      currentPolyLowerRootMidi = lowerRootMidi;
      currentPolyUpperRootMidi = lowerRootMidi + currentChord.lowerOffset;
      currentPolyLowerMidi = currentChord.lowerIntervals.map(i => currentPolyLowerRootMidi + i);
      currentPolyUpperMidi = currentChord.upperIntervals.map(i => currentPolyUpperRootMidi + i);
      currentMidiNotes = [...currentPolyLowerMidi, ...currentPolyUpperMidi];
      currentChordRootMidi = currentPolyLowerRootMidi;

    } else if (currentChord.family === 'ust') {
      const existingPc = currentUSTRootMidi !== null ? currentUSTRootMidi % 12 : 0;
      const pc = resolvePc(existingPc);
      const rootMidi = 12 + pc + 4 * 12;
      currentUSTRootMidi = rootMidi;
      currentChordRootMidi = rootMidi;
      currentUSTShellMidi = currentChord.shellIntervals.map(i => rootMidi + i);
      const upperTriadRootMidi = rootMidi + currentChord.upperTriadRoot;
      currentUSTUpperMidi = currentChord.upperTriadIntervals.map(i => upperTriadRootMidi + i);
      currentUSTShellMidi = currentUSTShellMidi.map(m => m < 48 ? m + 12 : m);
      currentMidiNotes = [...currentUSTShellMidi, ...currentUSTUpperMidi];

    } else {
      // Normal chord (root position or inversion)
      const baseIntervals = currentChord.invIndex !== undefined
        ? currentChord.baseChord.intervals : currentChord.intervals;
      const span = baseIntervals[baseIntervals.length - 1];
      const absMin = Math.ceil((28 - 12) / 12);
      const absMax = Math.floor((96 - 12 - span) / 12);
      const defaultLo = span > 14 ? Math.max(3, absMin) : Math.max(2, absMin);
      const defaultHi = Math.min(5, absMax);
      const [lo, hi] = resolveOctaveBand(pinnedOctave, defaultLo, defaultHi);
      const safeLo = Math.max(Math.min(lo, absMax), absMin);
      const safeHi = Math.max(Math.min(hi, absMax), safeLo);

      // Existing root midi: for inverted chords, back-compute from bass note
      const existingRootMidi = (() => {
        if (!currentMidiNotes.length) return 12 + (pinnedRoot ?? 0) + safeLo * 12;
        if (currentChord.invIndex !== undefined) {
          const bassInterval = currentChord.baseChord.intervals[currentChord.invIndex];
          return currentMidiNotes[0] - bassInterval;
        }
        return currentMidiNotes[0];
      })();

      const existingPc = ((existingRootMidi % 12) + 12) % 12;
      const pc = resolvePc(existingPc);
      const rootMidi = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
      currentChordRootMidi = rootMidi;

      currentVoicingMode = resolveVoicingMode();
      const voicedIntervals = applyVoicingMode(baseIntervals, currentVoicingMode);
      if (currentChord.invIndex !== undefined) {
        currentMidiNotes = applyInversion(voicedIntervals, rootMidi,
          Math.min(currentChord.invIndex, voicedIntervals.length - 1));
      } else {
        currentMidiNotes = voicedIntervals.map(i => rootMidi + i);
      }
    }

  // ── Intervals ────────────────────────────────────────────────────────────────
  } else if (currentMode === 'intervals') {
    if (!currentInterval) return;
    const existingPc = currentIntervalMidi.length ? currentIntervalMidi[0] % 12 : 0;
    const pc = resolvePc(existingPc);
    const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
    const safeHi = Math.min(hi, Math.floor((96 - currentInterval.semitones) / 12) - 1);
    const safeLo = Math.min(lo, safeHi);
    const existingRootMidi = currentIntervalMidi.length ? currentIntervalMidi[0] : 12 + pc + safeLo * 12;
    const rootMidi = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
    currentIntervalMidi = [rootMidi, rootMidi + currentInterval.semitones];

  // ── Scales ───────────────────────────────────────────────────────────────────
  } else {
    if (!currentScale) return;
    const existingPc = currentScaleRootMidi !== undefined ? currentScaleRootMidi % 12 : 0;
    const pc = resolvePc(existingPc);
    const span = currentScale.intervals[currentScale.intervals.length - 1];
    const [lo, hi] = resolveOctaveBand(pinnedOctave, 3, 5);
    const safeHi = Math.min(hi, Math.floor((96 - span) / 12) - 1);
    const safeLo = Math.min(lo, safeHi);
    const existingRootMidi = currentScaleRootMidi ?? (12 + pc + safeLo * 12);
    currentScaleRootMidi = rootMidiForPc(pc, existingRootMidi, safeLo, safeHi);
  }

  // ── Always refresh UI ────────────────────────────────────────────────────────
  // In dict mode: always. In quiz mode: only after answering.
  // showCurrentView() dispatches to chord or resolution view as appropriate.
  if (appMode === 'dict' || answered) showCurrentView();
  // Always update the root badge to reflect the new pitch
  if (currentMode === 'chords' && currentChord) {
    updateRootBadge(appMode === 'dict' || answered ? getChordRootName() : (showRoot ? getChordRootName() : null));
  } else if (currentMode === 'intervals' && currentInterval) {
    const label = spelledNote(0, currentIntervalMidi[0] % 12, currentInterval.symbol);
    updateRootBadge(appMode === 'dict' || answered ? label : (showRoot ? label : null));
  } else if (currentMode === 'scales' && currentScale) {
    const label = spelledNote(0, currentScaleRootMidi % 12, currentScale.symbol);
    updateRootBadge(appMode === 'dict' || answered ? label : (showRoot ? label : null));
  }
}

// ─── POINT 38: Progression DOM teardown ──────────────────────────────────────
// Restores every DOM element that showProgressionNotation() mutates.
// Must be called on any mode switch or new question so other modes
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
