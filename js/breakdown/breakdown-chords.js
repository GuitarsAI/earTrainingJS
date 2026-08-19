// ─── breakdown-chords.js ──────────────────────────────────────────────────────
// Chords branch of the breakdown panel (polychords, UST, slash, regular chords).
//
// Owns all voice leading rendering and resolution logic:
//   RESOLUTION_TARGETS, VL_INTERVAL_NAMES, vlRoleLabel(), buildResolutionMidi(),
//   getResolutionInfo(), computeVoiceLeading(), makeVoiceLeadingRow()
//
// Depends on shared helpers/globals defined in breakdown.js:
//   makeNameHeader, makeBDRow, makeCSGroup, makeChordScalesRow,
//   joinSep, intervalAbbr, semitonesToNumeral,
//   qualityFullName, makePill, SEMITONE_TO_ROMAN, INTERVAL_ABBR,
//   spelledRoot, spelledNote, pcInterval,
//   VOICING_MODES, TRITONE_AS_D5, EIGHT_AS_A5, NINE_AS_D7,
//   currentChord, currentChordRootMidi, currentMidiNotes, currentVoicingMode,
//   currentPolyUpperRootMidi, currentPolyLowerRootMidi, currentPolyUpperMidi,
//   currentPolyLowerMidi, currentUSTRootMidi, currentUSTShellMidi,
//   currentUSTUpperMidi, currentSlashBassMidi, currentUpperRootMidi,
//   dictInversionIndex, getPolyChordLabel, getUSTLabel, getSlashResolvedName,
//   getChordRootName, polyQualitySuffix, polyQualityFull, switchMode,
//   dictSymbol, setAppMode
// Cross-cutting resolve state (resolutionActive, selectedResolution, playResolution, etc.)
// lives in breakdown.js — those functions are used by audio and notation paths too.
// Called from showBreakdown() in breakdown.js.
// ─────────────────────────────────────────────────────────────────────────────

// RESOLUTION_TARGETS — fallback table used before analyseChord() (voiceLeading.js) is wired.
// Each entry: { offset: semitones UP from chord root to resolution root, quality, label }
//
// Theory notes:
//   Dominant chords (7, 9, 13, alt…) → resolve UP a P4 (= down a P5) to tonic (I).
//     G7 → C  : offset 5  ✓
//   Diminished triad / dim7 → leading-tone resolution: root rises m2 to tonic.
//     Bdim → C : offset 1  ✓  (B is the leading tone of C)
//   Half-dim (m7♭5) → ii∅ of minor: resolves to V7 of that minor key (P4 up).
//     Bm7♭5 → E7 : offset 5 → dom7  ✓
//   Minor 7th chords → function as ii7; strongest motion is to V7 (P4 up = ii→V).
//     Dm7 → G7 : offset 5 → dom7  ✓
//   Minor major 7th → tonic chord of harmonic/melodic minor; stable, departs to iv or bVII.
//     CmMaj7 → Fm : offset 5 → min  ✓
//   Major triads → stable tonic; most common next move is to IV (subdominant departure).
//     C → F : offset 5  (departure, not resolution — but this is the legacy fallback)
//   Minor triads → stable; common motion is to iv or to bVII (no single universal answer).
//     Cm → Fm : offset 5 → min  (subdominant departure)
//   Augmented (V+, V7+) → function as dominant; resolve P4 up to I.
//     Gaug → C : offset 5  ✓
//   Sus chords → resolve by dropping the 4th or 2nd to the 3rd — same root.
//     Gsus4 → G : offset 0  ✓
//   Maj7, maj9, maj11, maj13 → tonic or subdominant; depart to IV.
//     CΔ7 → FΔ7 : offset 5  (departure)

const RESOLUTION_TARGETS = {
  // ── Major triads — tonic; depart to subdominant ───────────────────────────────
  'maj':        { offset: 5,  quality: 'maj',  label: '→ IV' },
  'maj6':       { offset: 5,  quality: 'maj',  label: '→ IV' },
  'maj6_9':     { offset: 5,  quality: 'maj',  label: '→ IV' },
  'add9':       { offset: 5,  quality: 'maj',  label: '→ IV' },
  '6':          { offset: 5,  quality: 'maj',  label: '→ IV' },

  // ── Major 7th / extensions — tonic; depart to IVΔ7 ──────────────────────────
  'maj7':       { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9':     { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj7_9_s11': { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj9':       { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj11':      { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },
  'maj13':      { offset: 5,  quality: 'maj7', label: '→ IVΔ7' },

  // ── Minor triads — subdominant departure ─────────────────────────────────────
  'm':          { offset: 5,  quality: 'min',  label: '→ iv' },
  'madd9':      { offset: 5,  quality: 'min',  label: '→ iv' },

  // ── Minor 7th / extensions — ii7 function → V7 (P4 up) ──────────────────────
  'm7':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_9':       { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm7_11':      { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm6':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm9':         { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm11':        { offset: 5,  quality: 'dom7', label: '→ V7' },
  'm13':        { offset: 5,  quality: 'dom7', label: '→ V7' },

  // ── Minor major 7th — tonic of harmonic/melodic minor; departs to iv ─────────
  'mMaj7':      { offset: 5,  quality: 'min',  label: '→ iv' },

  // ── Dominant 7th and all extensions — resolve UP P4 to I (authentic cadence) ─
  '7':          { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9':        { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_b9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_s9':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_13':       { offset: 5,  quality: 'maj',  label: '→ I' },
  '7_9_13':     { offset: 5,  quality: 'maj',  label: '→ I' },
  '7sus4':      { offset: 5,  quality: 'maj',  label: '→ I' },
  '9':          { offset: 5,  quality: 'maj',  label: '→ I' },
  'b9':         { offset: 5,  quality: 'maj',  label: '→ I' },
  's9':         { offset: 5,  quality: 'maj',  label: '→ I' },
  '13':         { offset: 5,  quality: 'maj',  label: '→ I' },

  // ── Augmented — dominant function; resolve UP P4 to I ────────────────────────
  'aug':        { offset: 5,  quality: 'maj',  label: '→ I' },
  'augMaj7':    { offset: 5,  quality: 'maj',  label: '→ I' },
  'aug7':       { offset: 5,  quality: 'maj',  label: '→ I' },
  'aug9':       { offset: 5,  quality: 'maj',  label: '→ I' },

  // ── Diminished triad — leading-tone chord; root rises m2 to tonic ────────────
  'dim':        { offset: 1,  quality: 'maj',  label: '→ I (m2↑)' },

  // ── Diminished 7th — leading-tone chord; root rises m2 to tonic ──────────────
  // (each of the four enharmonic roots implies a different V7♭9, but the
  //  primary resolution from the notated root is m2 up to the implied tonic)
  'o7':         { offset: 1,  quality: 'maj',  label: '→ I (m2↑)' },

  // ── Half-diminished (m7♭5) — ii∅ of minor; resolves to V7 (P4 up) ────────────
  'm7b5':       { offset: 5,  quality: 'dom7', label: '→ V7' },

  // ── Suspended — resolve to same root major (4th drops to 3rd, or 2nd rises) ──
  'sus4':       { offset: 0,  quality: 'maj',  label: '→ I (sus resolves)' },
  'sus2':       { offset: 0,  quality: 'maj',  label: '→ I (sus resolves)' },

  // ── Power chord — no 3rd, no resolution implied; nearest move is I ────────────
  'power':      { offset: 0,  quality: 'maj',  label: '→ I' },
};

// Interval names for voice leading labels (ascending)
const VL_INTERVAL_NAMES = {
  0: 'common tone', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3',
  5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8',
};

// Role labels for voice leading: what is the role of the SOURCE note in the chord?
// Returns a short label based on how many semitones above the (harmonic) root the note is.
function vlRoleLabel(semiFromRoot) {
  const s = ((semiFromRoot % 12) + 12) % 12;
  const roles = {
    0: 'root', 1: '♭9', 2: '9th', 3: '♭3/♯9', 4: '3rd',
    5: '4th/11th', 6: '♯11/♭5', 7: '5th', 8: '♯5/♭13', 9: '6th/13th',
    10: '♭7th', 11: 'maj7th',
  };
  return roles[s] || '';
}

// Build resolution MIDI notes for a given target quality and root midi
function buildResolutionMidi(targetRootMidi, quality) {
  const intervals = {
    'maj':  [0, 4, 7],
    'min':  [0, 3, 7],
    'dom7': [0, 4, 7, 10],
    'maj7': [0, 4, 7, 11],
    'm7':   [0, 3, 7, 10],
  }[quality] || [0, 4, 7];
  return intervals.map(i => targetRootMidi + i);
}

// Get resolution info for current chord state.
// Returns { targetRootMidi, targetMidi[], targetName, targetQuality, label } or null.
// targetQuality is passed directly to computeVoiceLeading() — no string parsing needed.
function getResolutionInfo() {
  if (currentMode !== 'chords') return null;

  // Helper: build display suffix from quality string (consistent with app notation)
  function qualSuffix(q) {
    if (q === 'dom7') return '7';
    if (q === 'maj7') return 'Maj7';
    if (q === 'm7')   return 'm7';
    if (q === 'min')  return 'm';
    return '';
  }

  // ── User-selected resolution override (from Voice Leading breakdown panel) ───
  // Only applies to normal chords — poly/ust/slash use their own fixed logic below.
  if (selectedResolution && currentChord?.family !== 'poly' &&
      currentChord?.family !== 'ust' && currentChord?.family !== 'slash') {
    const qualMap = { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7', dim: 'dim', aug: 'aug' };
    const targetQuality = qualMap[selectedResolution.targetQuality] || selectedResolution.targetQuality;
    const srcMidi = currentChordRootMidi || 60;
    let targetRootMidi = (Math.floor(srcMidi / 12) * 12) + selectedResolution.targetRootPc;
    if (targetRootMidi < srcMidi - 6) targetRootMidi += 12;
    if (targetRootMidi > srcMidi + 6) targetRootMidi -= 12;
    const targetMidi = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: selectedResolution.label || '→' };
  }

  // ── POLYCHORD: resolve as lower root → IV (P4 up) ───────────────────────────
  if (currentChord?.family === 'poly' && currentPolyLowerRootMidi !== null) {
    const targetRootMidi  = currentPolyLowerRootMidi + 5;
    const targetQuality   = 'maj';
    const targetMidi      = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName      = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV of lower root' };
  }

  // ── UST: resolve as implied chord ────────────────────────────────────────────
  if (currentChord?.family === 'ust' && currentUSTRootMidi !== null) {
    const shellQ = currentChord.shellQuality || 'dom7';
    let offset, targetQuality, label;
    if      (shellQ === 'dom7') { offset = 5; targetQuality = 'maj';  label = '→ I'; }
    else if (shellQ === 'min')  { offset = 5; targetQuality = 'dom7'; label = '→ V7'; }
    else                        { offset = 5; targetQuality = 'maj7'; label = '→ IVMaj7'; }
    const targetRootMidi = currentUSTRootMidi + offset;
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label };
  }

  // ── SLASH CHORD: resolve upper chord → IV ────────────────────────────────────
  if (currentChord?.family === 'slash' && currentUpperRootMidi !== null) {
    const targetRootMidi = currentUpperRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV of upper root' };
  }

  // ── NORMAL CHORD ─────────────────────────────────────────────────────────────
  if (!currentChord || !currentChordRootMidi) return null;

  // Read from cache if available (Pass 1: analyseChord() wired in)
  if (currentVoiceLeadingAnalysis) {
    const { contexts, isAmbiguous } = currentVoiceLeadingAnalysis;

    if (!isAmbiguous && contexts && contexts.length) {
      const primaryCtx = contexts[0];

      // Use first true resolution; fall back to first departure for tonic chords.
      const primaryRes = (primaryCtx.resolutions && primaryCtx.resolutions.length)
        ? primaryCtx.resolutions[0]
        : (primaryCtx.departures && primaryCtx.departures.length)
          ? primaryCtx.departures[0]
          : null;

      if (primaryRes) {
        const qualMap = { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7' };
        const targetQuality  = qualMap[primaryRes.targetQuality] || 'maj';
        const srcMidi        = currentChordRootMidi || 60;
        const targetRootPc   = primaryRes.targetRootPc;
        let targetRootMidi   = (Math.floor(srcMidi / 12) * 12) + targetRootPc;
        if (targetRootMidi < srcMidi - 6) targetRootMidi += 12;
        if (targetRootMidi > srcMidi + 6) targetRootMidi -= 12;
        // Use pre-computed voice leading moves (minimal motion, correct register)
        // rather than buildResolutionMidi which blindly stacks intervals from the root.
        const targetMidi = (primaryRes.voiceLeading && primaryRes.voiceLeading.length)
          ? primaryRes.voiceLeading.map(m => m.toMidi)
          : buildResolutionMidi(targetRootMidi, targetQuality);
        const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
        const label          = primaryRes.cadenceName || primaryRes.resolutionType || '→';
        const targetSymbol   = primaryRes.targetSymbol || null;
        return { targetRootMidi, targetMidi, targetName, targetQuality, targetSymbol, label };
      }
    }

    // Ambiguous or no context found — P4 up fallback
    const targetRootMidi = currentChordRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV' };
  }

  // ── Fallback: RESOLUTION_TARGETS (used before analyseChord() is wired) ───────
  const sym = currentChord.invIndex !== undefined ? currentChord.baseChord.symbol : currentChord.symbol;
  const tgt = RESOLUTION_TARGETS[sym];
  if (!tgt) {
    const targetRootMidi = currentChordRootMidi + 5;
    const targetQuality  = 'maj';
    const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
    const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12);
    return { targetRootMidi, targetMidi, targetName, targetQuality, label: '→ IV' };
  }
  const targetRootMidi = currentChordRootMidi + tgt.offset;
  const targetQuality  = tgt.quality;
  const targetMidi     = buildResolutionMidi(targetRootMidi, targetQuality);
  const targetName     = spelledRoot((targetRootMidi % 12 + 12) % 12) + qualSuffix(targetQuality);
  return { targetRootMidi, targetMidi, targetName, targetQuality, label: tgt.label };
}

// Compute voice leading: for each source note, find its resolution target.
// Uses computeVoiceLeadingRules() from voiceLeading.js when a context is
// available; falls back to proximity loop otherwise.
// Returns array of { fromName, toName, dir, absSemi, intervalName, role, isCommonTone }
function computeVoiceLeading(sourceMidi, targetMidi) {
  // Shared root/symbol helpers
  function getVLRoot() {
    let rootMidi = currentChordRootMidi;
    if (currentChord?.family === 'poly'  && currentPolyLowerRootMidi) rootMidi = currentPolyLowerRootMidi;
    if (currentChord?.family === 'ust'   && currentUSTRootMidi)       rootMidi = currentUSTRootMidi;
    if (currentChord?.family === 'slash' && currentUpperRootMidi)     rootMidi = currentUpperRootMidi;
    return rootMidi;
  }
  function getVLSym() {
    return currentChord?.invIndex !== undefined
      ? currentChord.baseChord.symbol
      : (currentChord?.symbol || '');
  }

  // ── Rule-based engine (requires voiceLeading.js + cached analysis) ───────────
  const info = getResolutionInfo();
  const ctx  = currentVoiceLeadingAnalysis?.contexts?.[0] || null;

  if (typeof computeVoiceLeadingRules === 'function' && info && ctx) {
    const targetRootPc = (info.targetRootMidi % 12 + 12) % 12;
    // Pass targetSymbol (e.g. 'Maj7', 'm7', '7') — computeVoiceLeadingRules() looks
    // this up in CHORD_SYMBOL_INTERVALS. Falls back to 'Maj7' if not present (e.g.
    // legacy RESOLUTION_TARGETS path where targetSymbol is not set).
    const targetSymbol = info.targetSymbol || 'Maj7';

    const moves   = computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, ctx);
    const rootMidi = getVLRoot();
    const rootPc   = (rootMidi % 12 + 12) % 12;
    const sym      = getVLSym();

    return moves.map(m => {
      const semiFromRoot = ((m.fromMidi - rootMidi) % 12 + 12) % 12;
      const role         = vlRoleLabel(semiFromRoot);
      const fromName     = spelledNote(semiFromRoot, rootPc, sym);
      const toSemi       = ((m.toMidi - rootMidi) % 12 + 12) % 12;
      const toName       = spelledNote(toSemi, rootPc, sym);
      const dir          = m.direction === 'up' ? '↑' : m.direction === 'down' ? '↓' : '—';
      const intervalName = VL_INTERVAL_NAMES[m.semitones] || (m.semitones + 'st');
      return { fromName, toName, dir, absSemi: m.semitones, intervalName, role, isCommonTone: m.semitones === 0 };
    });
  }

  // ── Proximity fallback ────────────────────────────────────────────────────────
  const rootMidi = getVLRoot();
  const rootPc   = (rootMidi % 12 + 12) % 12;
  const sym      = getVLSym();
  const src      = [...sourceMidi].sort((a, b) => a - b);
  const tgt      = [...targetMidi].sort((a, b) => a - b);

  return src.map(s => {
    let best = null, bestDist = Infinity;
    for (const t of tgt) {
      for (const offset of [0, 12, -12, 24, -24]) {
        const cand = t + offset;
        const dist = Math.abs(cand - s);
        if (dist < bestDist) { bestDist = dist; best = cand; }
      }
    }
    const delta        = best - s;
    const dir          = delta === 0 ? '—' : delta > 0 ? '↑' : '↓';
    const absSemi      = Math.abs(delta);
    const intervalName = VL_INTERVAL_NAMES[absSemi] || (absSemi + 'st');
    const semiFromRoot = ((s - rootMidi) % 12 + 12) % 12;
    const role         = vlRoleLabel(semiFromRoot);
    const fromName     = spelledNote(semiFromRoot, rootPc, sym);
    const toSemi       = ((best - rootMidi) % 12 + 12) % 12;
    const toName       = spelledNote(toSemi, rootPc, sym);
    return { fromName, toName, dir, absSemi, intervalName, role, isCommonTone: delta === 0 };
  });
}

// ── POINT 37 Pass 2: Multi-context voice leading row ─────────────────────────
//
// When currentVoiceLeadingAnalysis is populated, renders one collapsible
// cs-section per harmonic context, each with:
//   Header: roman · scale name · function label · tension dots
//   Body:   one sub-section per resolution target with a vl-table
//
// Falls back to the original single-resolution display for ambiguous families
// (aug, sus, poly) where isAmbiguous=true or cache is null.
//
function makeVoiceLeadingRow(panel) {

  // ── Helper: build a vl-table from engine move objects ────────────────────────
  // moves: array of { fromMidi, toMidi, semitones, direction }
  function buildVLTable(moves, rootMidi, rootPc, sym) {
    const tbl = document.createElement('table');
    tbl.className = 'vl-table';
    moves.forEach(move => {
      const semiFromRoot   = ((move.fromMidi - rootMidi) % 12 + 12) % 12;
      const toSemiFromRoot = ((move.toMidi   - rootMidi) % 12 + 12) % 12;
      const fromName  = spelledNote(semiFromRoot,   rootPc, sym);
      const toName    = spelledNote(toSemiFromRoot, rootPc, sym);
      const role      = vlRoleLabel(semiFromRoot);
      const isCommon  = move.semitones === 0;
      const dir       = move.direction === 'up' ? '↑' : move.direction === 'down' ? '↓' : '—';
      const intName   = VL_INTERVAL_NAMES[move.semitones] || (move.semitones + 'st');
      const tr = document.createElement('tr');
      const tdFrom = document.createElement('td'); tdFrom.textContent = fromName + ' →';
      const tdTo   = document.createElement('td'); tdTo.textContent   = toName;
      const tdInt  = document.createElement('td'); tdInt.textContent  = isCommon ? '' : (dir + ' ' + intName);
      const tdRole = document.createElement('td'); tdRole.textContent = role;
      tr.appendChild(tdFrom); tr.appendChild(tdTo);
      tr.appendChild(tdInt);  tr.appendChild(tdRole);
      tbl.appendChild(tr);
    });
    return tbl;
  }

  // ── Helper: tension dots ●●●○○ (max 5) ───────────────────────────────────────
  function tensionDots(tension) {
    const filled = Math.round(tension * 5);
    return '●'.repeat(filled) + '○'.repeat(5 - filled);
  }

  // ── Helper: engine quality → display suffix ───────────────────────────────────
  function engineQualToSuffix(q) {
    return { major: '', minor: 'm', dominant: '7', maj7: 'Maj7', m7: 'm7', dim: '°', aug: '+' }[q] || '';
  }

  // ── Helper: engine quality → buildResolutionMidi key ─────────────────────────
  function engineQualToBuildKey(q) {
    return { major: 'maj', minor: 'min', dominant: 'dom7', maj7: 'maj7', m7: 'm7' }[q] || 'maj';
  }

  // ── Helper: human-readable function label ─────────────────────────────────────
  function fnLabel(fn) {
    return { tonic: 'tonic', predominant: 'predominant',
             subdominant: 'subdominant', dominant: 'dominant' }[fn] || fn;
  }

  // ── Helper: resolution type → display label ───────────────────────────────────
  function resTypeLabel(t) {
    return {
      authentic:        'Authentic cadence',
      authentic_minor:  'Authentic cadence (minor)',
      deceptive:        'Deceptive cadence',
      plagal:           'Plagal cadence',
      to_dominant:      'Move to dominant',
      half_cadence:     'Half cadence',
      leading_tone:     'Leading-tone resolution',
      direct:           'Direct resolution',
      departure:        'Departure',
      tritone_sub:      'Tritone substitution',
      related_ii:       'Related ii7',
    }[t] || t;
  }

  // Source midi for this chord family
  const sourceMidi = (() => {
    if (currentChord?.family === 'poly')  return [...currentPolyLowerMidi, ...currentPolyUpperMidi];
    if (currentChord?.family === 'ust')   return [...currentMidiNotes];
    if (currentChord?.family === 'slash') return [currentSlashBassMidi, ...currentMidiNotes];
    return [...currentMidiNotes];
  })();

  // Root midi / pc / sym for note spelling
  const rootMidi = (() => {
    if (currentChord?.family === 'poly'  && currentPolyLowerRootMidi) return currentPolyLowerRootMidi;
    if (currentChord?.family === 'ust'   && currentUSTRootMidi)       return currentUSTRootMidi;
    if (currentChord?.family === 'slash' && currentUpperRootMidi)     return currentUpperRootMidi;
    return currentChordRootMidi || 60;
  })();
  const rootPc = (rootMidi % 12 + 12) % 12;
  const sym    = currentChord?.invIndex !== undefined
    ? currentChord.baseChord.symbol
    : (currentChord?.symbol || 'maj');

  // ── PASS 2: rich multi-context display ───────────────────────────────────────
  const cache = currentVoiceLeadingAnalysis;

  if (cache && !cache.isAmbiguous && cache.contexts && cache.contexts.length) {

    if (isMobile()) {
      // ── Mobile: full-width — plain label above, contexts stack below ──────────
      const mobileWrap = document.createElement('div');
      mobileWrap.className = 'cs-mobile-wrap';
      const resLabel = document.createElement('span');
      resLabel.className = 'vl-resolves-label-mobile';
      resLabel.textContent = 'Resolves to';
      mobileWrap.appendChild(resLabel);
      cache.contexts.forEach((ctx, ctxIdx) => {
        const scaleRootName = spelledRoot(ctx.scaleRootPc);
        const isDeparture   = ctx.harmonicFunction === 'tonic';
        const ctxSec = document.createElement('div');
        ctxSec.className = 'cs-section';
        ctxSec.style.margin = '0.25rem 0';
        const ctxHdr = document.createElement('div');
        ctxHdr.className = 'cs-header';
        const romanEl = document.createElement('span');
        romanEl.style.cssText = 'color:var(--accent);font-weight:700;margin-right:0.4rem;min-width:2rem;display:inline-block;';
        romanEl.textContent = ctx.roman;
        const scaleEl = document.createElement('span');
        scaleEl.style.cssText = 'flex:1;font-size:0.85rem;';
        scaleEl.textContent = scaleRootName + ' ' + ctx.scaleName;
        const fnEl = document.createElement('span');
        fnEl.style.cssText = 'font-size:0.75rem;color:var(--accent-text);margin-right:0.4rem;';
        fnEl.textContent = fnLabel(ctx.harmonicFunction);
        const dotsEl = document.createElement('span');
        dotsEl.style.cssText = 'font-size:0.7rem;letter-spacing:-1px;color:var(--accent);margin-right:0.35rem;';
        dotsEl.textContent = tensionDots(ctx.tension);
        const ctxArrow = document.createElement('span');
        ctxArrow.className = 'cs-arrow';
        ctxArrow.textContent = ctxIdx === 0 ? '▾' : '▸';
        ctxHdr.appendChild(romanEl); ctxHdr.appendChild(scaleEl);
        ctxHdr.appendChild(fnEl); ctxHdr.appendChild(dotsEl); ctxHdr.appendChild(ctxArrow);
        const ctxBody = document.createElement('div');
        ctxBody.className = ctxIdx === 0 ? 'cs-body open' : 'cs-body';
        ctxBody.style.padding = '0.25rem 0.625rem 0.4rem';
        ctxHdr.addEventListener('click', () => {
          const isOpen = ctxBody.classList.toggle('open');
          ctxArrow.textContent = isOpen ? '▾' : '▸';
        });
        if (isDeparture) {
          const note = document.createElement('div');
          note.style.cssText = 'font-size:0.8rem;color:var(--accent-text);margin-bottom:0.3rem;padding:0.2rem 0;';
          note.textContent = 'Stable tonic — no resolution needed. Departure paths:';
          ctxBody.appendChild(note);
        }

        // Helper to render a list of entries (resolutions or departures) as
        // selectable collapsible sub-sections with a voice-leading table.
        function renderEntryList(entries, sectionLabel, firstOpen) {
          if (!entries || !entries.length) return;
          if (sectionLabel) {
            const lbl = document.createElement('div');
            lbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
            lbl.textContent = sectionLabel;
            ctxBody.appendChild(lbl);
          }
          entries.forEach((res, resIdx) => {
            const isFirst = firstOpen && resIdx === 0;
            const targetRootName = spelledRoot(res.targetRootPc);
            const targetLabel    = targetRootName + engineQualToSuffix(res.targetQuality);
            const resSec = document.createElement('div');
            resSec.className = 'cs-section';
            resSec.style.margin = '0.2rem 0';
            const resHdr = document.createElement('div');
            resHdr.className = 'cs-header';
            resHdr.style.paddingLeft = '0.5rem';
            resHdr.title = 'Select as resolution target';
            resHdr.style.cursor = 'pointer';
            const resNameEl = document.createElement('span');
            resNameEl.style.cssText = 'font-weight:600;margin-right:0.5rem;';
            resNameEl.textContent = '→ ' + targetLabel;
            const cadEl = document.createElement('span');
            cadEl.style.cssText = 'flex:1;font-size:0.78rem;color:var(--accent-text);';
            cadEl.textContent = resTypeLabel(res.resolutionType);
            const resArrow = document.createElement('span');
            resArrow.className = 'cs-arrow';
            resArrow.textContent = isFirst ? '▾' : '▸';
            resHdr.appendChild(resNameEl); resHdr.appendChild(cadEl);
            resHdr.appendChild(resArrow);
            const resBody = document.createElement('div');
            resBody.className = isFirst ? 'cs-body open' : 'cs-body';
            resBody.style.padding = '0.25rem 0.625rem';
            resHdr.addEventListener('click', () => {
              const isOpen = resBody.classList.toggle('open');
              resArrow.textContent = isOpen ? '▾' : '▸';
            });
            resHdr.addEventListener('click', () => {
              const p = resHdr.closest('#breakdownPanel, #breakdownPanelBody');
              if (p) p.querySelectorAll('.vl-selected').forEach(el => el.classList.remove('vl-selected'));
              resHdr.classList.add('vl-selected');
              selectedResolution = { targetRootPc: res.targetRootPc, targetQuality: res.targetQuality, label: resTypeLabel(res.resolutionType) };
              resolutionRootMidi = null;
              resolutionActive = false;
              updateResolveBtn();
            });
            if (res.voiceLeading && res.voiceLeading.length) {
              resBody.appendChild(buildVLTable(res.voiceLeading, rootMidi, rootPc, sym));
            } else {
              const buildKey = engineQualToBuildKey(res.targetQuality);
              let tgtRootMidi = (Math.floor(rootMidi / 12) * 12) + res.targetRootPc;
              if (tgtRootMidi < rootMidi - 6) tgtRootMidi += 12;
              if (tgtRootMidi > rootMidi + 6) tgtRootMidi -= 12;
              const targetMidi = buildResolutionMidi(tgtRootMidi, buildKey);
              const oldVl = computeVoiceLeading(sourceMidi, targetMidi);
              const sorted = [...sourceMidi].sort((a, b) => a - b);
              const moves = oldVl.map((v, i) => {
                const fMidi = sorted[i] ?? rootMidi;
                const semi = v.absSemi ?? 0;
                const dir = v.dir === '↑' ? 'up' : v.dir === '↓' ? 'down' : 'none';
                const toPc = targetMidi.reduce((best, t) => Math.abs(t - fMidi) < Math.abs(best - fMidi) ? t : best, targetMidi[0]);
                return { fromMidi: fMidi, toMidi: toPc, semitones: semi, direction: dir };
              });
              resBody.appendChild(buildVLTable(moves, rootMidi, rootPc, sym));
            }
            resSec.appendChild(resHdr); resSec.appendChild(resBody);
            ctxBody.appendChild(resSec);
          });
        } // end renderEntryList

        // ── Render resolutions (first entry auto-expanded in first context) ──────
        renderEntryList(ctx.resolutions, isDeparture ? null : null, ctxIdx === 0);

        // ── Render departures (tonic chords only) ────────────────────────────────
        renderEntryList(ctx.departures, ctx.departures && ctx.departures.length ? 'Departure paths' : null, ctxIdx === 0 && !(ctx.resolutions && ctx.resolutions.length));

        // ── Render substitutions (no voice-leading table — chord label only) ─────
        if (ctx.substitutions && ctx.substitutions.length) {
          const subLbl = document.createElement('div');
          subLbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
          subLbl.textContent = 'Substitutions';
          ctxBody.appendChild(subLbl);
          ctx.substitutions.forEach(sub => {
            const subRow = document.createElement('div');
            subRow.style.cssText = 'display:flex;align-items:center;padding:0.15rem 0.5rem;font-size:0.82rem;gap:0.5rem;';
            const nameEl = document.createElement('span');
            nameEl.style.fontWeight = '600';
            nameEl.textContent = spelledRoot(sub.targetRootPc) + engineQualToSuffix(sub.targetQuality);
            const descEl = document.createElement('span');
            descEl.style.cssText = 'flex:1;color:var(--accent-text);font-size:0.78rem;';
            descEl.textContent = resTypeLabel(sub.resolutionType);
            subRow.appendChild(nameEl); subRow.appendChild(descEl);
            ctxBody.appendChild(subRow);
          });
        }

        ctxSec.appendChild(ctxHdr); ctxSec.appendChild(ctxBody);
        mobileWrap.appendChild(ctxSec);
      });
      panel.appendChild(mobileWrap);
      return;
    }

    // ── Desktop: original layout — label | collapsible side by side ───────────
    const rowWrap = document.createElement('div');
    rowWrap.className = 'breakdown-row';
    rowWrap.style.alignItems = 'flex-start';

    const keyEl = document.createElement('span');
    keyEl.className = 'breakdown-key';
    keyEl.style.paddingTop = '0.25rem';
    keyEl.textContent = 'Resolves to';
    rowWrap.appendChild(keyEl);

    const valEl = document.createElement('span');
    valEl.className = 'breakdown-val';
    valEl.style.flex = '1';

    cache.contexts.forEach((ctx, ctxIdx) => {
      const scaleRootName = spelledRoot(ctx.scaleRootPc);
      const isDeparture   = ctx.harmonicFunction === 'tonic';

      // ── Context collapsible ─────────────────────────────────────────────────
      const ctxSec = document.createElement('div');
      ctxSec.className = 'cs-section';
      ctxSec.style.margin = '0.25rem 0';

      const ctxHdr = document.createElement('div');
      ctxHdr.className = 'cs-header';

      const romanEl = document.createElement('span');
      romanEl.style.cssText = 'color:var(--accent);font-weight:700;margin-right:0.4rem;min-width:2rem;display:inline-block;';
      romanEl.textContent = ctx.roman;

      const scaleEl = document.createElement('span');
      scaleEl.style.cssText = 'flex:1;font-size:0.85rem;';
      scaleEl.textContent = scaleRootName + ' ' + ctx.scaleName;

      const fnEl = document.createElement('span');
      fnEl.style.cssText = 'font-size:0.75rem;color:var(--accent-text);margin-right:0.4rem;';
      fnEl.textContent = fnLabel(ctx.harmonicFunction);

      const dotsEl = document.createElement('span');
      dotsEl.style.cssText = 'font-size:0.7rem;letter-spacing:-1px;color:var(--accent);margin-right:0.35rem;';
      dotsEl.textContent = tensionDots(ctx.tension);

      const ctxArrow = document.createElement('span');
      ctxArrow.className = 'cs-arrow';
      ctxArrow.textContent = ctxIdx === 0 ? '▾' : '▸';

      ctxHdr.appendChild(romanEl);
      ctxHdr.appendChild(scaleEl);
      ctxHdr.appendChild(fnEl);
      ctxHdr.appendChild(dotsEl);
      ctxHdr.appendChild(ctxArrow);

      const ctxBody = document.createElement('div');
      ctxBody.className = ctxIdx === 0 ? 'cs-body open' : 'cs-body';
      ctxBody.style.padding = '0.25rem 0.625rem 0.4rem';

      ctxHdr.addEventListener('click', () => {
        const isOpen = ctxBody.classList.toggle('open');
        ctxArrow.textContent = isOpen ? '▾' : '▸';
      });

      // Stable tonic note
      if (isDeparture) {
        const note = document.createElement('div');
        note.style.cssText = 'font-size:0.8rem;color:var(--accent-text);margin-bottom:0.3rem;padding:0.2rem 0;';
        note.textContent = 'Stable tonic — no resolution needed. Departure paths:';
        ctxBody.appendChild(note);
      }

      // ── Helper: render one list of entries (resolutions or departures) ──────────
      // Each entry becomes a selectable collapsible sub-section with a VL table.
      function renderDesktopEntryList(entries, sectionLabel, firstOpen) {
        if (!entries || !entries.length) return;
        if (sectionLabel) {
          const lbl = document.createElement('div');
          lbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
          lbl.textContent = sectionLabel;
          ctxBody.appendChild(lbl);
        }
        entries.forEach((res, resIdx) => {
          const isFirst        = firstOpen && resIdx === 0;
          const targetRootName = spelledRoot(res.targetRootPc);
          const targetLabel    = targetRootName + engineQualToSuffix(res.targetQuality);

          const resSec = document.createElement('div');
          resSec.className = 'cs-section';
          resSec.style.margin = '0.2rem 0';

          const resHdr = document.createElement('div');
          resHdr.className = 'cs-header';
          resHdr.style.paddingLeft = '0.5rem';
          resHdr.title = 'Select as resolution target';
          resHdr.style.cursor = 'pointer';

          const resNameEl = document.createElement('span');
          resNameEl.style.cssText = 'font-weight:600;margin-right:0.5rem;';
          resNameEl.textContent = '→ ' + targetLabel;

          const cadEl = document.createElement('span');
          cadEl.style.cssText = 'flex:1;font-size:0.78rem;color:var(--accent-text);';
          cadEl.textContent = resTypeLabel(res.resolutionType);

          const resArrow = document.createElement('span');
          resArrow.className = 'cs-arrow';
          resArrow.textContent = isFirst ? '▾' : '▸';

          resHdr.appendChild(resNameEl);
          resHdr.appendChild(cadEl);
          resHdr.appendChild(resArrow);

          const resBody = document.createElement('div');
          resBody.className = isFirst ? 'cs-body open' : 'cs-body';
          resBody.style.padding = '0.25rem 0.625rem';

          resHdr.addEventListener('click', () => {
            const isOpen = resBody.classList.toggle('open');
            resArrow.textContent = isOpen ? '▾' : '▸';
          });

          resHdr.addEventListener('click', () => {
            const p = resHdr.closest('#breakdownPanel, #breakdownPanelBody');
            if (p) p.querySelectorAll('.vl-selected').forEach(el => el.classList.remove('vl-selected'));
            resHdr.classList.add('vl-selected');
            selectedResolution = {
              targetRootPc:  res.targetRootPc,
              targetQuality: res.targetQuality,
              label:         resTypeLabel(res.resolutionType),
            };
            resolutionRootMidi = null;
            resolutionActive = false;
            updateResolveBtn();
          });

          // Voice leading table — pre-computed by analyseChord()
          if (res.voiceLeading && res.voiceLeading.length) {
            resBody.appendChild(buildVLTable(res.voiceLeading, rootMidi, rootPc, sym));
          } else {
            // On-demand fallback — fires only if voiceLeading wasn't pre-computed
            const buildKey   = engineQualToBuildKey(res.targetQuality);
            let tgtRootMidi  = (Math.floor(rootMidi / 12) * 12) + res.targetRootPc;
            if (tgtRootMidi < rootMidi - 6) tgtRootMidi += 12;
            if (tgtRootMidi > rootMidi + 6) tgtRootMidi -= 12;
            const targetMidi = buildResolutionMidi(tgtRootMidi, buildKey);
            const oldVl      = computeVoiceLeading(sourceMidi, targetMidi);
            const sorted     = [...sourceMidi].sort((a, b) => a - b);
            const moves      = oldVl.map((v, i) => {
              const fMidi = sorted[i] ?? rootMidi;
              const semi  = v.absSemi ?? 0;
              const dir   = v.dir === '↑' ? 'up' : v.dir === '↓' ? 'down' : 'none';
              const toPc  = targetMidi.reduce((best, t) =>
                Math.abs(t - fMidi) < Math.abs(best - fMidi) ? t : best, targetMidi[0]);
              return { fromMidi: fMidi, toMidi: toPc, semitones: semi, direction: dir };
            });
            resBody.appendChild(buildVLTable(moves, rootMidi, rootPc, sym));
          }

          resSec.appendChild(resHdr);
          resSec.appendChild(resBody);
          ctxBody.appendChild(resSec);
        });
      } // end renderDesktopEntryList

      // ── Render true resolutions (V→I first, strongest first) ─────────────────
      renderDesktopEntryList(ctx.resolutions, null, ctxIdx === 0);

      // ── Render departure paths (tonic chords only) ────────────────────────────
      renderDesktopEntryList(
        ctx.departures,
        ctx.departures && ctx.departures.length ? 'Departure paths' : null,
        ctxIdx === 0 && !(ctx.resolutions && ctx.resolutions.length)
      );

      // ── Render substitutions (label only — no voice-leading table) ────────────
      if (ctx.substitutions && ctx.substitutions.length) {
        const subLbl = document.createElement('div');
        subLbl.style.cssText = 'font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-text);padding:0.3rem 0 0.1rem;';
        subLbl.textContent = 'Substitutions';
        ctxBody.appendChild(subLbl);
        ctx.substitutions.forEach(sub => {
          const subRow = document.createElement('div');
          subRow.style.cssText = 'display:flex;align-items:center;padding:0.15rem 0.5rem;font-size:0.82rem;gap:0.5rem;';
          const nameEl = document.createElement('span');
          nameEl.style.fontWeight = '600';
          nameEl.textContent = spelledRoot(sub.targetRootPc) + engineQualToSuffix(sub.targetQuality);
          const descEl = document.createElement('span');
          descEl.style.cssText = 'flex:1;color:var(--accent-text);font-size:0.78rem;';
          descEl.textContent = resTypeLabel(sub.resolutionType);
          subRow.appendChild(nameEl); subRow.appendChild(descEl);
          ctxBody.appendChild(subRow);
        });
      }

      ctxSec.appendChild(ctxHdr);
      ctxSec.appendChild(ctxBody);
      valEl.appendChild(ctxSec);
    });

    rowWrap.appendChild(valEl);
    panel.appendChild(rowWrap);
    return;
  }

  // ── FALLBACK: single-resolution (ambiguous family / cache unavailable) ────────
  const info = getResolutionInfo();
  if (!info) return;

  const vl = computeVoiceLeading(sourceMidi, info.targetMidi);

  const rowWrap = document.createElement('div');
  rowWrap.className = 'breakdown-row';

  const keyEl = document.createElement('span');
  keyEl.className = 'breakdown-key';
  keyEl.textContent = 'Resolves to';
  rowWrap.appendChild(keyEl);

  const valEl = document.createElement('span');
  valEl.className = 'breakdown-val';
  valEl.style.flex = '1';

  const nameEl = document.createElement('div');
  nameEl.style.fontWeight = '600';
  nameEl.style.marginBottom = '0.3rem';
  nameEl.textContent = info.targetName + '  ' + info.label;
  valEl.appendChild(nameEl);

  const tbl = document.createElement('table');
  tbl.className = 'vl-table';
  vl.forEach(v => {
    const tr = document.createElement('tr');
    const tdFrom = document.createElement('td'); tdFrom.textContent = v.fromName + ' →';
    const tdTo   = document.createElement('td'); tdTo.textContent   = v.toName;
    const tdInt  = document.createElement('td'); tdInt.textContent  = v.isCommonTone ? '' : (v.dir + ' ' + v.intervalName);
    const tdRole = document.createElement('td'); tdRole.textContent = v.role;
    tr.appendChild(tdFrom); tr.appendChild(tdTo);
    tr.appendChild(tdInt);  tr.appendChild(tdRole);
    tbl.appendChild(tr);
  });
  valEl.appendChild(tbl);

  rowWrap.appendChild(valEl);
  panel.appendChild(rowWrap);
}



// Riemannian neo-tonal relations for a major or minor triad
// Returns { R, L, P, N } — each an object { name, chord } where chord is e.g. "Am"
function computeRiemannRelations(rootPc, quality, sym) {
  // quality: 'major' | 'minor'
  const rel   = quality === 'major' ? (rootPc + 9) % 12 : (rootPc + 3) % 12;
  const par   = rootPc; // same root, flipped quality
  const lRoot = quality === 'major' ? (rootPc + 4) % 12 : (rootPc + 8) % 12;
  const parQ  = quality === 'major' ? 'minor' : 'major';
  const relQ  = parQ;
  const lQ    = parQ;

  // N (Nebenverwandt) = Relative of the Parallel = P then R
  // For major: P gives minor on same root, R of that minor goes up m3 → same root+3 = rel of original
  // Correct formula: N of major = (root+5) minor; N of minor = (root+7) major
  const nRoot = quality === 'major' ? (rootPc + 5) % 12 : (rootPc + 7) % 12;
  const nQ    = parQ;

  function chordName(pc, q) {
    const n = spelledRoot(pc);
    return n + (q === 'minor' ? 'm' : '');
  }

  return {
    R: { letter: 'R', full: 'Relative',        desc: 'Shares all notes; root shifts by a minor 3rd, quality flips.',         chord: chordName(rel,   relQ) },
    L: { letter: 'L', full: 'Leittonwechsel',  desc: 'One note moves by a semitone (leading-tone exchange); root shifts by a major 3rd, quality flips.', chord: chordName(lRoot, lQ)   },
    P: { letter: 'P', full: 'Parallel',        desc: 'Same root note, opposite quality (major↔minor).',                      chord: chordName(par,   parQ) },
    N: { letter: 'N', full: 'Nebenverwandt',   desc: 'Leading-tone exchange of the Relative — combines R and L transforms.',  chord: chordName(nRoot, nQ)   },
  };
}

// Tritone-sub info for a dominant 7th
function computeTritoneSubInfo(rootPc, sym) {
  const subName = spelledNote(6,  rootPc, sym) + '7';
  const iiName  = spelledNote(10, rootPc, sym) + 'm7';
  const resMaj  = spelledNote(5,  rootPc, sym);
  return { subName, iiName, resMaj, resMin: resMaj + 'm' };
}

// Diminished 7th enharmonic roots (4 enharmonic names, every m3)
function computeDimEnharmonics(rootPc, sym) {
  const roots = [0,3,6,9].map(offset => spelledNote(offset, rootPc, sym));
  return roots.map(n => n + 'dim7');
}

// Dom7♭9 substitutes implied by a dim7 chord
function computeDimDomSubs(rootPc, sym) {
  // Each root of the dim7 implies a dom7♭9 whose root is a M3 below that dim note
  // i.e. for Cdim7 (C Eb Gb A) → G7♭9 Bb7♭9 Db7♭9 E7♭9
  return [0,3,6,9].map(offset => {
    // Each dim7 note implies a dom7b9 whose root is a M3 below (= m6 above = +9 semitones from dim note)
    const domRootInterval = (offset + 9) % 12;
    return spelledNote(domRootInterval, rootPc, sym) + '7♭9';
  });
}

// Augmented enharmonic roots (3 enharmonic names, every M3)
function computeAugEnharmonics(rootPc, sym) {
  return [0,4,8].map(offset => spelledNote(offset, rootPc, sym) + 'aug');
}

// Half-dim (m7♭5) context: ii° chord of what minor key?
function computeHalfDimContext(rootPc, sym) {
  // m7b5 is the ii° of the minor key whose root is a M2 above
  const minKeyName = spelledNote(2, rootPc, sym);
  const v7Name     = spelledNote(5, rootPc, sym) + '7';
  return { minKeyName, v7Name };
}

// Sus resolution: sus2 → maj, sus4 → maj (same root implied resolution)
function computeSusResolution(rootPc, sym, susSymbol) {
  const rootName = spelledRoot(rootPc);
  if (susSymbol === 'sus2') return `${rootName} or ${rootName}m (adds major or minor 3rd)`;
  if (susSymbol === 'sus4') return `${rootName} or ${rootName}m`;
  return null;
}

// Build Riemannian row: pills + hover-tooltip legend
function makeRiemannRow(panel, relations) {
  const row = document.createElement('div');
  row.className = 'breakdown-row';
  const key = document.createElement('span');
  key.className = 'breakdown-key';

  // Wrap label + ⓘ icon together
  const labelWrap = document.createElement('span');
  labelWrap.className = 'bd-riemann-wrap';
  labelWrap.style.display = 'inline-flex';
  labelWrap.style.alignItems = 'center';

  const labelText = document.createElement('span');
  labelText.textContent = 'Neo-tonal';

  const icon = document.createElement('span');
  icon.className = 'bd-riemann-icon';
  icon.setAttribute('tabindex', '0');
  icon.textContent = '?';

  const tooltip = document.createElement('div');
  tooltip.className = 'bd-riemann-tooltip';
  tooltip.innerHTML = Object.values(relations).map(r =>
    `<p><strong>${r.letter} — ${r.full}</strong>${r.desc}</p>`
  ).join('');

  labelWrap.appendChild(labelText);
  labelWrap.appendChild(icon);
  labelWrap.appendChild(tooltip);
  key.appendChild(labelWrap);

  const val = document.createElement('span');
  val.className = 'breakdown-val';
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'breakdown-pills';

  Object.values(relations).forEach(r => {
    const pill = document.createElement('div');
    pill.className = 'breakdown-pill';
    const lEl = document.createElement('span');
    lEl.className = 'breakdown-pill-label';
    lEl.textContent = r.letter + ' · ' + r.full;
    const vEl = document.createElement('span');
    vEl.className = 'breakdown-pill-value';
    vEl.textContent = r.chord;
    pill.appendChild(lEl);
    pill.appendChild(vEl);
    pillsWrap.appendChild(pill);
  });

  val.appendChild(pillsWrap);
  row.appendChild(key);
  row.appendChild(val);
  panel.appendChild(row);
}

// Figured bass superscripts for triads and 7th chords
function figuredBass(invIndex, noteCount) {
  if (noteCount === 3) { // triads
    if (invIndex === 1) return '\u2076';           // ⁶
    if (invIndex === 2) return '\u2076\u2084';     // ⁶₄
  } else if (noteCount === 4) { // 7th chords
    if (invIndex === 0) return '\u2077';           // ⁷
    if (invIndex === 1) return '\u2076\u2085';     // ⁶₅
    if (invIndex === 2) return '\u2074\u2083';     // ⁴₃
    if (invIndex === 3) return '\u2074\u2082';     // ⁴₂
  }
  return '';
}

function nameChordFromIntervals(rootPc, allPcs) {
  // Build interval set from root (semitones 0–11, excluding 0 itself)
  const ivs = new Set(
    [...allPcs]
      .map(pc => ((pc - rootPc) % 12 + 12) % 12)
      .filter(i => i !== 0)
  );

  const has = i => ivs.has(i);

  // ── Identify 3rd ──────────────────────────────────────────────────────────
  const hasM3  = has(4);   // major 3rd
  const hasm3  = has(3);   // minor 3rd
  const hasP4  = has(5);   // perfect 4th (sus4 or 11th)
  const hasM2  = has(2);   // major 2nd (sus2 or 9th)

  // ── Identify 5th ──────────────────────────────────────────────────────────
  const hasP5  = has(7);   // perfect 5th
  const hasd5  = has(6);   // diminished 5th / tritone
  // 8 semitones = A5 in major context (M3 present), m6 in minor context (m3 present)
  const hasA5  = has(8) && has(4);   // augmented 5th — only when major 3rd present
  const hasm6  = has(8) && !has(4);  // minor 6th — only when no major 3rd (minor/sus context)

  // ── Identify 7th ──────────────────────────────────────────────────────────
  const hasM7  = has(11);  // major 7th
  const hasm7  = has(10);  // minor 7th
  const hasd7  = has(9) && has(3) && has(6);  // diminished 7th — only in dim context (m3 + d5 present)

  // ── Identify upper extensions (mod-12 equivalents) ────────────────────────
  // 9th = 2 semitones (same pc as M2), 11th = 5 (same as P4), 13th = 9 (same as M6/d7)
  // We distinguish 9/11/13 from 2/4/6 by presence of a 7th (extensions imply a 7th chord)
  const has7th   = hasM7 || hasm7 || hasd7;
  const hasM6    = has(9) && !has7th;  // major 6th (no 7th → it's a 6th, not 13th)

  // Extensions only meaningful when a 7th is present
  const hasM9    = has(2)  && has7th;  // major 9th
  const hasm9    = has(1)  && has7th;  // minor 9th (♭9)
  const hasA9    = has(3)  && has7th && !hasm3; // augmented 9th (♯9) — only if no m3
  const hasP11   = has(5)  && has7th;  // perfect 11th
  const hasA11   = has(6)  && has7th;  // augmented 11th (♯11)
  const hasM13   = has(9)  && has7th;  // major 13th
  const hasm13   = has(8)  && has7th && has(4);  // minor 13th (♭13) — only in major/dom context

  // ── Determine base quality ────────────────────────────────────────────────
  let quality = '';
  let isSus   = false;
  let isDim   = false;
  let isAug   = false;

  if (hasM3) {
    if (hasA5 && !hasP5) { quality = 'aug'; isAug = true; }
    else                  { quality = ''; }           // major (no suffix)
  } else if (hasm3) {
    if (hasd5 && !hasP5)  { quality = 'dim'; isDim = true; }
    else                   { quality = 'm'; }
  } else if (hasP4 && !hasM2) {
    quality = 'sus4'; isSus = true;
  } else if (hasM2 && !hasP4) {
    quality = 'sus2'; isSus = true;
  } else if (hasP4 && hasM2) {
    quality = 'sus4'; isSus = true;   // both: sus4 takes priority
  } else {
    quality = '5';   // power chord / no 3rd no sus
  }

  // ── Determine 7th suffix ──────────────────────────────────────────────────
  let seventhStr = '';
  if (isDim) {
    if (hasd7)       seventhStr = 'o7';   // fully diminished
    else if (hasm7)  seventhStr = 'm7♭5'; // half-diminished
    // else: plain dim triad — no 7th suffix needed
  } else if (isAug) {
    if (hasM7)       seventhStr = 'Maj7';
    else if (hasm7)  seventhStr = '7';
  } else if (quality === 'm') {
    if (hasM7)       seventhStr = '(Maj7)';
    else if (hasm7)  seventhStr = '7';
    // minor 6th chord — handled below in alterations
  } else if (quality === '') {
    // major
    if (hasM7)       seventhStr = 'Maj7';
    else if (hasm7)  seventhStr = '7';
  } else if (isSus) {
    if (hasm7)       seventhStr = '7';
    else if (hasM7)  seventhStr = 'Maj7';
  }

  // ── Build root name ───────────────────────────────────────────────────────
  // Use a neutral symbol for spelledNote — we pass 'maj' for major context,
  // 'm' for minor, so accidentals spell correctly.
  const spellingCtx = (quality === 'm' || isDim) ? 'm' : 'maj';
  const rootName = spelledNote(0, rootPc, spellingCtx);

  // ── Assemble base name ────────────────────────────────────────────────────
  let name;
  if (isDim) {
    name = rootName + (seventhStr === 'o7' ? 'o7' : seventhStr === 'm7♭5' ? 'm7(♭5)' : 'dim');
  } else if (isAug) {
    name = rootName + 'aug' + (seventhStr ? seventhStr : '');
  } else if (isSus) {
    // Standard notation: root + 7th + 6th + sus — e.g. G6sus4, G7sus4, GMaj7sus2
    const sixStr = (hasM6 && !has7th) ? '6' : '';
    name = rootName + (seventhStr ? seventhStr : '') + sixStr + quality;
  } else if (quality === 'm') {
    name = rootName + 'm' + seventhStr;
  } else if (quality === '') {
    // major
    name = rootName + seventhStr;
  } else {
    name = rootName + quality + seventhStr;
  }

  // ── Collect alterations and extensions ───────────────────────────────────
  const extras = [];

  // 6th / 13th
  if (!isDim && !isAug) {
    if (hasM6 && !has7th && !isSus) extras.push('6');  // sus already has 6 in name
    if (hasm6 && !has7th)  extras.push('♭6');
    if (hasM13 && has7th)  extras.push('13');
    if (hasm13 && has7th)  extras.push('♭13');
  }

  // 9th
  if (hasM9)  extras.push('9');
  if (hasm9)  extras.push('♭9');
  if (hasA9)  extras.push('♯9');

  // 11th
  if (hasP11 && !isSus) extras.push('11');
  if (hasA11)           extras.push('♯11');

  // add9 / sus context: 9th without 7th
  if (has(2) && !has7th && !isSus && (hasM3 || hasm3)) {
    extras.push('add9');
  }

  // ── Omissions ─────────────────────────────────────────────────────────────
  const omissions = [];
  // Suppress "no 5th" for sus chords — omitting the 5th is standard and unremarkable
  if (!hasP5 && !hasd5 && !hasA5 && !isSus && quality !== '5') {
    omissions.push('no 5th');
  }

  // ── Final assembly ────────────────────────────────────────────────────────
  let result = name;
  if (extras.length) result += '(' + extras.join(')(') + ')';
  if (omissions.length) result += ' ' + omissions.join(', ');

  return result;
}

function showBreakdownChords(panel) {
  // ── POINT 26: POLYCHORDS ────────────────────────────────────────────────────
  if (currentChord.family === 'poly' && currentPolyUpperRootMidi !== null) {
    const upPc  = currentPolyUpperRootMidi % 12;
    const loPc  = currentPolyLowerRootMidi % 12;
    const upSym = currentChord.upperSymbol;
    const loSym = currentChord.lowerSymbol;
    const upName = spelledRoot(upPc);
    const loName = spelledRoot(loPc);
    const { body: polyBody } = makeNameHeader(panel, upName + polyQualitySuffix(upSym) + ' / ' + loName + polyQualitySuffix(loSym));

    makeBDRow(polyBody, 'Upper chord', upName + ' ' + polyQualityFull(upSym));
    makeBDRow(polyBody, 'Lower chord', loName + ' ' + polyQualityFull(loSym));

    if (upSym === 'aug') {
      makeBDRow(polyBody, 'Note', upName + 'aug is symmetrical — 3 enharmonic roots share the same notes');
    }
    if (loSym === 'aug') {
      makeBDRow(polyBody, 'Note', loName + 'aug is symmetrical — 3 enharmonic roots share the same notes');
    }
    if (upSym === '7') {
      makeBDRow(polyBody, 'Note', upName + '7 upper adds strong harmonic tension — the tritone in the upper chord clashes with the lower');
    }

    const upNoteNames = currentPolyUpperMidi.map(m => spelledNote(pcInterval(m % 12, upPc), upPc, upSym));
    makeBDRow(polyBody, 'Upper notes', joinSep(upNoteNames));

    const loNoteNames = currentPolyLowerMidi.map(m => spelledNote(pcInterval(m % 12, loPc), loPc, loSym));
    makeBDRow(polyBody, 'Lower notes', joinSep(loNoteNames));

    const allNames = [...currentPolyLowerMidi, ...currentPolyUpperMidi]
      .sort((a,b) => a-b).map(m => spelledNote(pcInterval(m % 12, upPc), upPc, upSym));
    makeBDRow(polyBody, 'Full voicing', joinSep(allNames));

    const sep = currentChord.lowerOffset;
    const sepAbbr = INTERVAL_ABBR[sep] || sep + 'st';
    makeBDRow(polyBody, 'Root interval', loName + ' is ' + sepAbbr + ' below ' + upName);

    makeBDRow(polyBody, 'What is it?',
      'A polychord stacks two independent triads. The slash separates upper from lower — ' +
      'unlike a slash chord, both triads are structurally equal and create rich polytonal colour.');
    const allPcs = new Set([...currentPolyLowerMidi, ...currentPolyUpperMidi].map(m => ((m - currentPolyLowerRootMidi) % 12 + 12) % 12));
    const numerals = [...allPcs].filter(s => s !== 0).sort((a,b)=>a-b)
      .map(s => semitonesToNumeral(s, loSym));
    if (numerals.length) makeBDRow(polyBody, 'Tensions over lower root', joinSep(numerals));

    // Chord scales sub-collapsible
    {
      const allMidiPcs = new Set([...currentPolyLowerMidi, ...currentPolyUpperMidi].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(polyBody, loPc, allMidiPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      polyBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── POINT 26 / 35: UST ──────────────────────────────────────────────────────
  if (currentChord.family === 'ust' && currentUSTRootMidi !== null) {
    const shellQ   = currentChord.shellQuality || 'dom7'; // 'dom7' | 'min' | 'maj7'
    const rootPc   = currentUSTRootMidi % 12;
    // Spell root name appropriately for the shell type
    const rootSpellSym = shellQ === 'min' ? 'min' : shellQ === 'maj7' ? 'maj' : '7';
    const rootName = spelledNote(0, rootPc, rootSpellSym);
    const shellSuffix = shellQ === 'min' ? 'm7' : shellQ === 'maj7' ? 'Maj7' : '7';
    const upperTriadRootMidi = currentUSTRootMidi + currentChord.upperTriadRoot;
    const upperRootPc = upperTriadRootMidi % 12;
    const upperRootName = spelledNote(pcInterval(upperRootPc, rootPc), rootPc, currentChord.upperQuality);
    const upQ = currentChord.upperQuality === 'min' ? 'm' : '';

    const { body: ustBody } = makeNameHeader(panel, 'UST ' + currentChord.ustNumber + ': ' + upperRootName + upQ + ' over ' + rootName + shellSuffix);

    makeBDRow(ustBody, 'Resulting chord', rootName + currentChord.resultingChord);
    makeBDRow(ustBody, 'Tensions', currentChord.tensions);
    makeBDRow(ustBody, 'UST number', 'UST ' + currentChord.ustNumber + ' — ' + upperRootName + upQ + ' triad');

    const shellLabel = shellQ === 'min'  ? 'Shell (♭3 + ♭7)'
                     : shellQ === 'maj7' ? 'Shell (3 + 7)'
                     : 'Shell (3 + ♭7)';
    const shellNames = currentUSTShellMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, rootSpellSym));
    makeBDRow(ustBody, shellLabel, joinSep(shellNames));

    const upperNames = currentUSTUpperMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, currentChord.upperQuality));
    makeBDRow(ustBody, 'Upper triad', joinSep(upperNames));

    const allSorted = [...currentUSTShellMidi, ...currentUSTUpperMidi].sort((a,b)=>a-b);
    const allNames  = allSorted.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, rootSpellSym));
    makeBDRow(ustBody, 'Full voicing', joinSep(allNames));

    const fromRootNums = allSorted
      .map(m => ((m - currentUSTRootMidi) % 12 + 12) % 12)
      .filter((s,i,arr) => arr.indexOf(s) === i && s !== 0)
      .sort((a,b) => a-b)
      .map(s => semitonesToNumeral(s, rootSpellSym));
    if (fromRootNums.length) makeBDRow(ustBody, 'Numerals from root', joinSep(fromRootNums));

    if (shellQ === 'dom7') {
      const ttSubName = spelledNote(6, rootPc, '7');
      makeBDRow(ustBody, 'Tritone sub', ttSubName + '7 (a TT away — shares 3rd and ♭7)');
      makeBDRow(ustBody, 'What is it?',
        'A UST is a rootless jazz voicing: the chord\'s guide tones (3rd + ♭7) sit in the left hand; ' +
        'an upper-structure triad in the right hand adds colour tones. The root is implied, not played.');
    } else if (shellQ === 'min') {
      makeBDRow(ustBody, 'What is it?',
        'A minor-shell UST: the chord\'s guide tones (♭3 + ♭7) anchor a minor 7th quality in the left hand; ' +
        'the upper triad adds extensions. The root is implied. Common in Dorian and Aeolian contexts.');
    } else {
      makeBDRow(ustBody, 'What is it?',
        'A Maj7-shell UST: the chord\'s guide tones (3 + 7) define a major 7th quality in the left hand; ' +
        'the upper triad adds lush extensions. Common in Ionian and Lydian contexts. The root is implied, not played.');
    }

    // Chord scales sub-collapsible
    {
      const allUstPcs = new Set([...currentUSTShellMidi, ...currentUSTUpperMidi].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(ustBody, rootPc, allUstPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      ustBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── POINT 25: SLASH CHORDS ──────────────────────────────────────────────────
  if (currentChord.family === 'slash' && currentSlashBassMidi !== null) {
    const upperPc  = currentUpperRootMidi % 12;
    const bassPc   = currentSlashBassMidi % 12;
    const sym      = currentChord.symbol;
    const upperName = spelledNote(0, upperPc, sym);
    const bassName  = spelledNote(pcInterval(bassPc, upperPc), upperPc, sym);
    // Quality label
    const qualLabel = currentChord.upperQuality === 'min' ? 'm' : '';

    const { body: slashBody } = makeNameHeader(panel, upperName + qualLabel + ' / ' + bassName);

    makeBDRow(slashBody, 'Upper chord', upperName + (currentChord.upperQuality === 'min' ? ' minor' : ' major'));
    makeBDRow(slashBody, 'Bass note',   bassName);

    const upperNoteNames = currentMidiNotes.map(m => spelledNote(pcInterval(m % 12, upperPc), upperPc, sym));
    makeBDRow(slashBody, 'Upper notes', joinSep(upperNoteNames));

    const allMidi = [currentSlashBassMidi, ...currentMidiNotes].sort((a,b)=>a-b);
    const allNames = allMidi.map(m => spelledNote(pcInterval(m % 12, upperPc), upperPc, sym));
    makeBDRow(slashBody, 'Full voicing', joinSep(allNames));

    const bassInt = currentUpperRootMidi - currentSlashBassMidi;
    makeBDRow(slashBody, 'Bass interval', intervalAbbr(((bassInt % 12) + 12) % 12) + ' below upper root');

    if (currentChord.alsoKnownAs) {
      makeBDRow(slashBody, 'Also known as', bassName + ' ' + currentChord.alsoKnownAs);
    }
    makeBDRow(slashBody, 'Type', currentChord.name);
    makeBDRow(slashBody, 'Note', 'Slash chords separate an upper triad from an independent bass note, creating richer harmonic colour');

    // Chord scales sub-collapsible
    {
      const allPcs = new Set([currentSlashBassMidi, ...currentMidiNotes].map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(slashBody, upperPc, allPcs);
    }

    // Voice leading sub-collapsible
    {
      const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
      slashBody.appendChild(vlSec);
      makeVoiceLeadingRow(vlBody);
    }

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

  // ── CHORDS ───────────────────────────────────────────────────────────────────
  const baseChord = currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord;
  // Use dictInversionIndex as the active inversion — updated by chip clicks in both
  // quiz (post-answer) and dict mode. Falls back to currentChord.invIndex for
  // quiz questions that were originally generated as inversions.
  const invIndex  = dictInversionIndex;
  const sym       = baseChord.symbol;
  const family    = baseChord.family;

  // Derive root pitch class always from currentChordRootMidi
  const rootPc = ((currentChordRootMidi % 12) + 12) % 12;
  const rootName = spelledNote(0, rootPc, sym);

  // ── Level 1: collapsible name header ─────────────────────────────────────
  const noteCount = baseChord.intervals.length;
  const fb = figuredBass(invIndex, noteCount);
  const invLabel = invIndex > 0 && noteCount > 4
    ? ' \u2014 ' + ['','1st inv','2nd inv','3rd inv','4th inv'][invIndex]
    : '';

  const hdrLabelEl = document.createElement('span');
  hdrLabelEl.textContent = rootName + '\u00a0' + baseChord.name + invLabel;
  if (fb) {
    const sup = document.createElement('span');
    sup.className = 'breakdown-figured';
    sup.textContent = fb;
    hdrLabelEl.appendChild(sup);
  }
  const { body: mainBody } = makeNameHeader(panel, hdrLabelEl);

  // POINT 41: Voicing mode label — shown for all voicings except 'close' (the default baseline)
  // Reads directly from VOICING_MODES so no parallel label table needs maintaining.
  if (currentVoicingMode && currentVoicingMode !== 'close') {
    const voicingEntry = VOICING_MODES.find(v => v.symbol === currentVoicingMode);
    const vLabel = voicingEntry ? `${voicingEntry.name} — ${voicingEntry.desc}` : currentVoicingMode;
    makeBDRow(mainBody, 'Voicing', vLabel);
  }

  // Notes as voiced, bass first
  const voicedMidi = [...currentMidiNotes].sort((a, b) => a - b);
  const noteNames  = voicedMidi.map(m => spelledNote(pcInterval(m % 12, rootPc), rootPc, sym));
  makeBDRow(mainBody, 'Notes', joinSep(noteNames));

  // From root (interval abbreviations)
  const rootMidi = currentChordRootMidi;
  const fromRootSemis = voicedMidi
    .map(m => ((m - rootMidi) % 12 + 12) % 12)
    .filter(s => s !== 0);
  if (fromRootSemis.length) {
    makeBDRow(mainBody, 'From root', joinSep(fromRootSemis.map(s => intervalAbbr(s, sym))));
  }

  // Interval numerals
  const fromRootNumerals = fromRootSemis.map(s => semitonesToNumeral(s, sym));
  if (fromRootNumerals.length) {
    makeBDRow(mainBody, 'Numerals', joinSep(fromRootNumerals));
  }

  // Between notes
  const between = [];
  for (let i = 1; i < voicedMidi.length; i++) {
    between.push(intervalAbbr(voicedMidi[i] - voicedMidi[i-1]));
  }
  if (between.length) makeBDRow(mainBody, 'Between notes', joinSep(between));

  // Inversion: slash notation + bass re-analysis
  if (invIndex > 0) {
    const sorted = [...currentMidiNotes].sort((a, b) => a - b);
    const bassMidi = sorted[0];
    const bassPc   = ((bassMidi % 12) + 12) % 12;
    const bassName = spelledNote(pcInterval(bassPc, rootPc), rootPc, sym);
    makeBDRow(mainBody, 'Slash', rootName + '\u00a0' + baseChord.name + '\u00a0/\u00a0' + bassName);
    const allPcs = new Set(sorted.map(m => ((m % 12) + 12) % 12));
    const reName = nameChordFromIntervals(bassPc, allPcs);
    makeBDRow(mainBody, 'From ' + bassName, reName);
  }

  // ── Level 2: family sub-collapsibles inside mainBody ─────────────────────

  // Neo-tonal (maj/min triads only)
  const isMajorTriad = sym === 'maj';
  const isMinorTriad = sym === 'm';
  if (isMajorTriad || isMinorTriad) {
    const quality   = isMajorTriad ? 'major' : 'minor';
    const relations = computeRiemannRelations(rootPc, quality, sym);
    const { section: ntSec, body: ntBody } = makeCSGroup('Neo-tonal', false);
    mainBody.appendChild(ntSec);
    makeRiemannRow(ntBody, relations);
  }

  // Dominant
  const hasMajorThird = baseChord.intervals.some(i => i % 12 === 4);
  const hasMinorSev   = baseChord.intervals.some(i => i % 12 === 10);
  if (family === 'dominant' && hasMajorThird && hasMinorSev) {
    const { subName, iiName, resMaj, resMin } = computeTritoneSubInfo(rootPc, sym);
    const { section: domSec, body: domBody } = makeCSGroup('Dominant', false);
    mainBody.appendChild(domSec);
    // Primary resolution: authentic cadence — P4 up to I (e.g. G7 → C).
    // resMin is the minor tonic (e.g. Cm) — deceptive cadence target is vi (resMaj + 'm' would be wrong here,
    // but we keep the existing spelledNote(5) logic which correctly gives the tonic root).
    makeBDRow(domBody, 'Resolves to', resMaj + '  or  ' + resMin + '  (authentic cadence)');
    // Deceptive cadence: V → vi
    const deceptiveName = spelledNote(9, rootPc, sym) + 'm'; // vi of the tonic = m6 above chord root... actually we need relative to tonic
    // Tritone sub and related ii are substitutions — clearly labelled as such
    makeBDRow(domBody, 'Tritone sub', subName + '  (substitutes for this chord — also resolves to ' + resMaj + ')');
    makeBDRow(domBody, 'Related ii', iiName + '  (precedes this chord in ii–V–I)');
  }

  // Diminished
  if (sym === 'o7') {
    const { section: dimSec, body: dimBody } = makeCSGroup('Diminished', false);
    mainBody.appendChild(dimSec);
    makeBDRow(dimBody, 'Enharmonic', joinSep(computeDimEnharmonics(rootPc, sym)));
    makeBDRow(dimBody, 'Dom7♭9 subs', joinSep(computeDimDomSubs(rootPc, sym)));
  }
  if (sym === 'm7b5') {
    const { minKeyName, v7Name } = computeHalfDimContext(rootPc, sym);
    const { section: hdSec, body: hdBody } = makeCSGroup('Half-dim', false);
    mainBody.appendChild(hdSec);
    makeBDRow(hdBody, 'Function', 'ii\u00f8 in ' + minKeyName + ' minor');
    makeBDRow(hdBody, 'Related V7', v7Name);
  }
  if (sym === 'dim') {
    const { section: dSec, body: dBody } = makeCSGroup('Diminished', false);
    mainBody.appendChild(dSec);
    makeBDRow(dBody, 'Note', 'Diminished triad — often functions as rootless dom7♭9');
  }

  // Augmented
  if (sym === 'aug') {
    const { section: augSec, body: augBody } = makeCSGroup('Augmented', false);
    mainBody.appendChild(augSec);
    makeBDRow(augBody, 'Enharmonic', joinSep(computeAugEnharmonics(rootPc, sym)));
    makeBDRow(augBody, 'Note', 'Symmetrical — divides the octave into three equal M3rds');
  }
  if (sym === 'aug7') {
    const { section: augSec, body: augBody } = makeCSGroup('Augmented', false);
    mainBody.appendChild(augSec);
    makeBDRow(augBody, 'Also known as', '7(\u266f5) — augmented dominant 7th');
    makeBDRow(augBody, 'Chord scale', 'Whole tone scale — all six notes of the whole-tone scale are available tensions');
    makeBDRow(augBody, 'Note', 'Altered dominant chord — the \u266f5 acts as a voice-leading tone to the 3rd of the tonic. Functions as V7 in both major and minor. Enharmonically, the \u266f5 and \u266d13 are the same pitch; context determines the spelling.');
  }
  if (sym === 'aug9') {
    const { section: augSec, body: augBody } = makeCSGroup('Augmented', false);
    mainBody.appendChild(augSec);
    makeBDRow(augBody, 'Also known as', '7(\u266f5)(9) — augmented dominant 9th');
    makeBDRow(augBody, 'Chord scale', 'Whole tone scale — the added 9th is the natural 2nd degree of the whole-tone scale above the root');
    makeBDRow(augBody, 'Note', 'Extension of aug7 with a natural 9th added. The whole-tone scale contains root, M3, \u266f5, \u266d7, and 9 — making aug9 a five-note subset of the whole-tone collection. Used as a colourful V chord with smooth voice leading: \u266f5\u2192III and 9\u2192I.');
  }

  // Classical
  if (family === 'classical' && baseChord.classicalNote) {
    const { section: clSec, body: clBody } = makeCSGroup('Classical function', false);
    mainBody.appendChild(clSec);
    makeBDRow(clBody, 'Note', baseChord.classicalNote);
  }

  // Quartal / Quintal
  if (baseChord.quartal && baseChord.quartNote) {
    const QUARTAL_MODAL_CONTEXTS = {
      qrt3:  'Dorian, Mixolydian, Lydian, Phrygian, Aeolian — fits most modal contexts due to total third-ambiguity',
      qrt4:  'Dorian, Mixolydian, Lydian, Aeolian — dense enough to imply a modal centre without defining major or minor',
      qrt5:  'Dorian — specifically the Bill Evans / Miles Davis "So What" Dorian voicing; also fits Aeolian',
      qrtTT: 'Lydian, Lydian Dominant — the tritone is the characteristic \u266f4 of Lydian; also fits altered dominant contexts',
      qnt3:  'Dorian, Mixolydian, Lydian — wide open spacing suits any modal context without committing to a quality',
      qnt4:  'Dorian, Mixolydian, Lydian, Aeolian — maximum registral spread; suits orchestral and wide-voiced modal writing',
    };
    const { section: qrtSec, body: qrtBody } = makeCSGroup('Quartal construction', false);
    mainBody.appendChild(qrtSec);
    makeBDRow(qrtBody, 'Structure', 'Non-tertian — built by stacking fourths or fifths, not thirds');
    makeBDRow(qrtBody, 'Modal contexts', QUARTAL_MODAL_CONTEXTS[sym] || 'Context-dependent — any mode lacking a strong tonic pull');
    makeBDRow(qrtBody, 'Note', baseChord.quartNote);
  }

  // Cluster / Secundal
  if (baseChord.cluster && baseChord.clustNote) {
    const { section: clustSec, body: clustBody } = makeCSGroup('Cluster construction', false);
    mainBody.appendChild(clustSec);
    makeBDRow(clustBody, 'Structure', 'Secundal — built by stacking minor or major seconds');
    makeBDRow(clustBody, 'Chord scales', 'None — cluster chords are timbral sonorities without a standard parent scale or harmonic function');
    makeBDRow(clustBody, 'Note', baseChord.clustNote);
  }

  // Suspended / Power
  if (sym === 'sus2' || sym === 'sus4') {
    const { section: susSec, body: susBody } = makeCSGroup('Suspended', false);
    mainBody.appendChild(susSec);
    const res = computeSusResolution(rootPc, sym, sym);
    if (res) makeBDRow(susBody, 'Resolution', res);
    makeBDRow(susBody, 'Note', 'No 3rd — quality (major/minor) is ambiguous until resolved');
  }
  if (sym === 'power') {
    const { section: pwrSec, body: pwrBody } = makeCSGroup('Power', false);
    mainBody.appendChild(pwrSec);
    makeBDRow(pwrBody, 'Note', 'No 3rd or 7th — harmonically open; major or minor context depends on melody');
  }

  // Chord scales — skipped for quartal and cluster (handled in their own sub-sections above)
  if (!baseChord.quartal && !baseChord.cluster) {
    const allPcs = new Set(currentMidiNotes.map(m => ((m % 12) + 12) % 12));
    makeChordScalesRow(mainBody, rootPc, allPcs);
  }

  // Voice leading
  {
    const { section: vlSec, body: vlBody } = makeCSGroup('Voice leading', false);
    mainBody.appendChild(vlSec);
    makeVoiceLeadingRow(vlBody);
  }

  panel.style.display = 'block';
  document.getElementById('breakdownWrapper').style.display = 'block';
}
