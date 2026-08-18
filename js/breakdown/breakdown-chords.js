// ─── breakdown-chords.js ──────────────────────────────────────────────────────
// Chords branch of the breakdown panel (polychords, UST, slash, regular chords).
// Depends on shared helpers/globals defined in breakdown.js:
//   makeNameHeader, makeBDRow, makeCSGroup, makeChordScalesRow,
//   makeVoiceLeadingRow, joinSep, intervalAbbr, semitonesToNumeral,
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
// Called from showBreakdown() in breakdown.js.
// ─────────────────────────────────────────────────────────────────────────────

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
  if (family === 'dominant' && (sym === '7' || sym === '7_9' || sym === '7_b9' || sym === '7_s9' || sym === '7_13' || sym === '7_9_13')) {
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
