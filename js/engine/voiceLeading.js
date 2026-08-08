// js/engine/voiceLeading.js
// Voice leading & resolution engine — Point 37 (Option B)
// See voice_leading_algorithm_plan.md for full design rationale.
//
// Dependencies (globals expected from other files):
//   SCALES       — from js/data/chords.js
//   CHORD_TYPES  — from js/data/chords.js
//   semitoneToDegree() — from js/breakdown/breakdown.js
//
// All functions are pure and stateless — same input always returns same output.
// No DOM access. No app state. Consumed by breakdown.js for rendering.

'use strict';

// ─── 1. CONSTANTS ────────────────────────────────────────────────────────────

// Harmonic function derived from scale degree (semitones from scale root).
// Used in Step 3 (context discovery) and Step 4 (tension scoring).
const FUNCTION_MAP = {
  0:  'tonic',          // I
  1:  'tonic',          // ♭II  (Neapolitan — tonic substitute in context)
  2:  'predominant',    // II
  3:  'tonic',          // ♭III (mediant)
  4:  'tonic',          // III  (mediant)
  5:  'subdominant',    // IV
  6:  'dominant',       // ♯IV / ♭V (tritone — context-dependent, default dominant)
  7:  'dominant',       // V
  8:  'subdominant',    // ♭VI (submediant substitute)
  9:  'tonic',          // VI  (submediant — tonic substitute)
  10: 'subdominant',    // ♭VII (subtonic — subdominant in modal contexts)
  11: 'dominant',       // VII (leading tone)
};

// Base tension per scale degree (semitones from scale root, 0–11).
// Modified by chord content in scoreTension().
const BASE_TENSION = {
  0:  0.0,   // I   — tonic, at rest
  1:  0.5,   // ♭II — Neapolitan, unusual, moderate tension
  2:  0.5,   // II  — supertonic / predominant
  3:  0.1,   // ♭III — mediant, stable
  4:  0.15,  // III  — mediant, slightly less stable than I
  5:  0.4,   // IV  — subdominant
  6:  0.7,   // ♯IV/♭V — tritone degree, high tension
  7:  0.8,   // V   — dominant
  8:  0.3,   // ♭VI — submediant substitute, fairly stable
  9:  0.2,   // VI  — submediant / tonic substitute
  10: 0.45,  // ♭VII — subtonic, modal subdominant
  11: 0.9,   // VII — leading tone, very high tension
};

// Chord qualities that get lowercase Roman numerals (minor/diminished).
const LOWERCASE_QUALITIES = new Set(['minor', 'diminished']);

// Exception whitelist — chord families where the algorithm cannot reliably
// derive a single resolution target. These fall back to existing app logic.
// See algorithm plan § 6 Edge Cases.
const AMBIGUOUS_FAMILIES = new Set(['aug', 'augmented', 'sus', 'suspended', 'poly', 'ust']);


// ─── 2. HELPERS ──────────────────────────────────────────────────────────────

// Build a Set of pitch classes for a scale given its root and interval array.
// intervals: e.g. [0,2,4,5,7,9,11,12] — the raw SCALES entry intervals field.
// rootPc: 0–11
function buildScalePcs(rootPc, intervals) {
  const pcs = new Set();
  for (const interval of intervals) {
    pcs.add((rootPc + interval) % 12);
  }
  return pcs;
}

// Given a scale's pitch classes and the chord root pc, find the scale degree
// (semitones from scale root to chord root, 0–11).
// Returns -1 if chordRootPc is not in the scale (shouldn't happen after set-intersection).
function chordDegreeInScale(scaleRootPc, chordRootPc) {
  return ((chordRootPc - scaleRootPc) + 12) % 12;
}

// Detect if a set of pitch classes contains a tritone (interval of 6 semitones).
// Returns true if any two pitch classes are 6 semitones apart.
function hasTritone(pitchClasses) {
  const pcs = [...pitchClasses];
  for (let i = 0; i < pcs.length; i++) {
    for (let j = i + 1; j < pcs.length; j++) {
      if (((pcs[j] - pcs[i] + 12) % 12) === 6) return true;
    }
  }
  return false;
}

// Count chromatic alterations — pitch classes in chord not present in
// the natural major scale built on the chord root. Used as tension modifier.
function countAlterations(chordRootPc, chordPitchClasses) {
  const majorIntervals = new Set([0, 2, 4, 5, 7, 9, 11].map(i => (i + chordRootPc) % 12));
  let count = 0;
  for (const pc of chordPitchClasses) {
    if (!majorIntervals.has(pc)) count++;
  }
  return count;
}

// Derive a short chord quality label from the chord's interval pattern.
// Used to determine Roman numeral case and functional description.
// Returns: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'suspended'
function deriveChordQuality(intervals) {
  const pcs = intervals.map(i => i % 12).filter((v, i, a) => a.indexOf(v) === i).sort((a,b) => a-b);
  // Check third
  const hasMinorThird = pcs.includes(3);
  const hasMajorThird = pcs.includes(4);
  const hasDimFifth   = pcs.includes(6);
  const hasPerfFifth  = pcs.includes(7);
  const hasAugFifth   = pcs.includes(8);
  const hasMinorSev   = pcs.includes(10);
  const hasMajorSev   = pcs.includes(11);
  const hasFourth     = pcs.includes(5);
  const hasSecond     = pcs.includes(2);

  if (!hasMajorThird && !hasMinorThird && (hasFourth || hasSecond)) return 'suspended';
  if (hasMinorThird && hasDimFifth) return 'diminished';
  if (hasMajorThird && hasAugFifth) return 'augmented';
  if (hasMinorThird) return 'minor';
  if (hasMajorThird && hasMinorSev) return 'dominant';
  if (hasMajorThird) return 'major';
  return 'major'; // fallback
}


// ─── 3. STEP 3 — DIATONIC CONTEXT DISCOVERY ──────────────────────────────────

// Core function. Given a chord root (pitch class) and its pitch classes,
// find every scale (across all 25 SCALES × 12 roots) that contains all
// chord pitch classes. For each match, compute the scale degree, Roman
// numeral, harmonic function, and tension score.
//
// chordRootPc:      integer 0–11
// chordPitchClasses: iterable of pitch class integers 0–11
// chordIntervals:   raw intervals array from CHORD_TYPES entry (for quality detection)
//
// Returns: array of context objects, sorted by tension descending.
function findDiatonicContexts(chordRootPc, chordPitchClasses, chordIntervals) {
  const chordPcs = new Set([...chordPitchClasses].map(p => ((p % 12) + 12) % 12));
  const chordQuality = chordIntervals ? deriveChordQuality(chordIntervals) : 'major';
  const contexts = [];

  for (const scale of SCALES) {
    for (let scaleRootPc = 0; scaleRootPc < 12; scaleRootPc++) {

      // Build scale pitch class set for this root
      const scalePcs = buildScalePcs(scaleRootPc, scale.intervals);

      // Check if ALL chord pitch classes are in this scale (exact match)
      let fits = true;
      for (const pc of chordPcs) {
        if (!scalePcs.has(pc)) { fits = false; break; }
      }
      if (!fits) continue;

      // Check chord root is actually in the scale
      if (!scalePcs.has(chordRootPc)) continue;

      // Compute scale degree (semitones from scale root to chord root)
      const degSemitones = chordDegreeInScale(scaleRootPc, chordRootPc);

      // Roman numeral — reuse existing semitoneToDegree() from breakdown.js
      const roman = (typeof semitoneToDegree === 'function')
        ? semitoneToDegree(degSemitones, chordQuality)
        : degSemitones.toString(); // fallback if not yet available

      // Harmonic function from degree
      const harmonicFunction = FUNCTION_MAP[degSemitones] || 'tonic';

      // Tension score
      const tension = scoreTension(degSemitones, chordPcs, chordRootPc);

      contexts.push({
        scaleSymbol:      scale.symbol,         // e.g. 'major', 'harm_minor'
        scaleName:        scale.name,            // e.g. 'Major', 'Harmonic Minor'
        scaleRootPc,                             // 0–11
        degSemitones,                            // semitones from scale root to chord root
        roman,                                   // e.g. 'ii', 'V', '♭VII'
        harmonicFunction,                        // 'tonic' | 'predominant' | 'subdominant' | 'dominant'
        tension,                                 // 0.0 – 1.0
        matchQuality: 1.0,                       // 1.0 = exact; 0.8 = fuzzy (future)
      });
    }
  }

  // Sort: highest tension first, then by scale commonality
  contexts.sort((a, b) => {
    if (Math.abs(b.tension - a.tension) > 0.05) return b.tension - a.tension;
    return scaleCommonality(b.scaleSymbol) - scaleCommonality(a.scaleSymbol);
  });

  return contexts;
}

// Commonality weight — more common scales surface first when tension is equal.
// Higher = more common.
function scaleCommonality(symbol) {
  const weights = {
    major: 10, nat_minor: 9, harm_minor: 8, mel_minor: 7,
    dorian: 6, mixolydian: 6, phrygian: 5, lydian: 5,
    locrian: 3, pent_maj: 4, pent_min: 4, blues: 4,
  };
  return weights[symbol] || 2;
}


// ─── 4. STEP 4 — TENSION SCORING ─────────────────────────────────────────────

// Compute tension for a chord in a given context.
// degSemitones: semitones from scale root to chord root (0–11)
// chordPcs:     Set of pitch classes in the chord
// chordRootPc:  pitch class of the chord root
//
// Returns: float 0.0 – 1.0
function scoreTension(degSemitones, chordPcs, chordRootPc) {
  let tension = BASE_TENSION[degSemitones] ?? 0.3;

  // Modifier: tritone presence increases tension
  if (hasTritone(chordPcs)) tension += 0.08;

  // Modifier: chromatic alterations increase tension
  const alterations = countAlterations(chordRootPc, chordPcs);
  tension += alterations * 0.04;

  return Math.min(tension, 1.0); // cap at 1.0
}


// ─── 5. STEP 5 — RESOLUTION TARGET DERIVATION ────────────────────────────────

// For a given context, compute all plausible resolution targets.
// Returns array of resolution objects ranked by strength, e.g.:
// [
//   { targetRootPc, targetQuality, resolutionType, cadenceName, strength },
//   ...
// ]
//
// context: one entry from findDiatonicContexts()
function deriveResolutionTargets(context) {
  const { degSemitones, scaleRootPc, harmonicFunction } = context;
  const resolutions = [];

  // Tonic — stable, no tension, suggest departure instead
  if (harmonicFunction === 'tonic' && context.tension < 0.2) {
    resolutions.push({
      targetRootPc:    (scaleRootPc + 5) % 12,   // IV
      targetQuality:   'major',
      resolutionType:  'departure',
      cadenceName:     'I → IV',
      strength:        0.3,
    });
    resolutions.push({
      targetRootPc:    (scaleRootPc + 2) % 12,   // ii
      targetQuality:   'minor',
      resolutionType:  'departure',
      cadenceName:     'I → ii',
      strength:        0.2,
    });
    return resolutions;
  }

  // Dominant function (V, VII, ♯IV/♭V) → resolves to tonic
  if (harmonicFunction === 'dominant') {
    const tonicRootPc = scaleRootPc; // tonic of the scale

    // Primary: V → I (authentic cadence)
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetQuality:  'major',
      resolutionType: 'authentic',
      cadenceName:    'V → I',
      strength:       1.0,
    });

    // Deceptive: V → vi
    resolutions.push({
      targetRootPc:   (tonicRootPc + 9) % 12,
      targetQuality:  'minor',
      resolutionType: 'deceptive',
      cadenceName:    'V → vi',
      strength:       0.6,
    });

    // Tritone substitution: resolve to chord a TT away from V
    resolutions.push({
      targetRootPc:   (tonicRootPc + 1) % 12,    // ♭II of the tonic
      targetQuality:  'major',
      resolutionType: 'tritone_sub',
      cadenceName:    'V → ♭II (tritone sub)',
      strength:       0.5,
    });
  }

  // Subdominant function (IV, ii, ♭VI, ♭VII) → resolves to V or I
  if (harmonicFunction === 'subdominant') {
    const tonicRootPc = scaleRootPc;

    // Primary: → V (move to dominant)
    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'IV → V',
      strength:       0.8,
    });

    // Plagal: IV → I
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetQuality:  'major',
      resolutionType: 'plagal',
      cadenceName:    'IV → I',
      strength:       0.5,
    });
  }

  // Predominant (ii, II) → V → I (or directly)
  if (harmonicFunction === 'predominant') {
    const tonicRootPc = scaleRootPc;

    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'ii → V',
      strength:       0.9,
    });

    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetQuality:  'major',
      resolutionType: 'direct',
      cadenceName:    'ii → I',
      strength:       0.4,
    });
  }

  return resolutions;
}


// ─── 6. STEP 6 — VOICE LEADING COMPUTATION ───────────────────────────────────

// Constraint satisfaction voice leading engine.
// Replaces the proximity-only loop in the existing computeVoiceLeading().
//
// sourceMidi:    array of MIDI note numbers (the chord being resolved)
// targetRootPc:  pitch class of the resolution target root (0–11)
// targetQuality: 'major' | 'minor' | 'dominant' | 'maj7' | 'm7'
// context:       context object from findDiatonicContexts() (for leading tone detection)
//
// Returns: array of voice leading moves, one per source note:
// { fromMidi, toMidi, fromPc, toPc, semitones, direction, reason }
function computeVoiceLeadingRules(sourceMidi, targetRootPc, targetQuality, context) {
  // Build target chord MIDI notes
  const targetIntervals = qualityToIntervals(targetQuality);
  const targetPcs = new Set(targetIntervals.map(i => (targetRootPc + i) % 12));

  // Tonic pitch class for this context (scale root)
  const tonicPc = context ? context.scaleRootPc : targetRootPc;

  // Leading tone pc = 1 semitone below tonic
  const leadingTonePc = (tonicPc - 1 + 12) % 12;

  // Chordal 7th pc = 10 semitones above chord root (dominant 7th)
  // Only meaningful when the source chord is a dominant 7th type
  const chordalSeventhPc = (context
    ? ((context.scaleRootPc + 7 + 10) % 12)  // 7th of V = scale root + P5 + m7
    : null);

  const assignments = [];
  const usedTargetPcs = new Set();

  // Sort source notes low to high for consistent processing
  const sorted = [...sourceMidi].sort((a, b) => a - b);

  for (const midi of sorted) {
    const pc = ((midi % 12) + 12) % 12;
    const move = resolveNote(
      midi, pc, targetRootPc, targetPcs, targetIntervals,
      tonicPc, leadingTonePc, chordalSeventhPc, usedTargetPcs
    );
    assignments.push(move);
    if (move.toPc !== null) usedTargetPcs.add(move.toPc);
  }

  return assignments;
}

// Resolve a single note using the rule priority engine.
function resolveNote(
  midi, pc, targetRootPc, targetPcs, targetIntervals,
  tonicPc, leadingTonePc, chordalSeventhPc, usedTargetPcs
) {
  // ── Rule 1: Leading tone — must rise to tonic ──────────────────────────────
  if (pc === leadingTonePc) {
    const toMidi = midi + 1; // up by m2
    return makeMove(midi, toMidi, 'leading_tone_up');
  }

  // ── Rule 2: Chordal 7th — must fall by m2 ─────────────────────────────────
  if (chordalSeventhPc !== null && pc === chordalSeventhPc) {
    const toMidi = midi - 1; // down by m2
    return makeMove(midi, toMidi, 'chordal_seventh_down');
  }

  // ── Rule 3: Tritone partner — resolve inward ───────────────────────────────
  // (handled implicitly: leading tone + chordal 7th ARE the tritone pair in V7)

  // ── Rule 4: Common tone — stay if pc exists in target ──────────────────────
  if (targetPcs.has(pc) && !usedTargetPcs.has(pc)) {
    return makeMove(midi, midi, 'common_tone');
  }

  // ── Rule 5: Stepwise — find nearest target pc by half steps ───────────────
  // Prefer motion that completes the target chord without doubling the 3rd.
  const thirdPc = (targetRootPc + targetIntervals[1]) % 12;
  let bestMidi = null, bestDist = Infinity, bestReason = 'stepwise_preference';

  for (const interval of targetIntervals) {
    const candidatePc = (targetRootPc + interval) % 12;

    // Soft constraint: avoid doubling the 3rd if it's already used
    if (candidatePc === thirdPc && usedTargetPcs.has(thirdPc)) continue;

    // Try nearest octave of this candidate
    for (const octaveOffset of [0, 12, -12]) {
      // Find the MIDI pitch for this pc nearest to our source midi
      let candidateMidi = midi + octaveOffset + ((candidatePc - pc + 12) % 12);
      // Also try the semitone below (so we get both up and down)
      const altMidi = candidateMidi - 12;

      for (const cand of [candidateMidi, altMidi]) {
        const dist = Math.abs(cand - midi);
        if (dist < bestDist && dist <= 7) { // max leap of a P5
          bestDist = dist;
          bestMidi = cand;
        }
      }
    }
  }

  if (bestMidi === null) {
    // Absolute fallback — nearest note in target by raw distance
    bestMidi = nearestTargetNote(midi, targetRootPc, targetIntervals);
    bestReason = 'nearest_fallback';
  }

  return makeMove(midi, bestMidi, bestReason);
}

// Build a voice leading move object.
function makeMove(fromMidi, toMidi, reason) {
  const fromPc = ((fromMidi % 12) + 12) % 12;
  const toPc   = ((toMidi  % 12) + 12) % 12;
  const delta  = toMidi - fromMidi;
  const direction = delta === 0 ? 'none' : delta > 0 ? 'up' : 'down';
  return { fromMidi, toMidi, fromPc, toPc, semitones: Math.abs(delta), direction, reason };
}

// Last-resort nearest note finder.
function nearestTargetNote(sourceMidi, targetRootPc, targetIntervals) {
  let best = null, bestDist = Infinity;
  for (const interval of targetIntervals) {
    for (const octave of [-1, 0, 1]) {
      const cand = targetRootPc + interval + (octave * 12) +
                   Math.floor(sourceMidi / 12) * 12 - 12;
      const dist = Math.abs(cand - sourceMidi);
      if (dist < bestDist) { bestDist = dist; best = cand; }
    }
  }
  return best;
}

// Map quality string to interval array (semitones from root).
function qualityToIntervals(quality) {
  const map = {
    major:    [0, 4, 7],
    minor:    [0, 3, 7],
    dominant: [0, 4, 7, 10],
    maj7:     [0, 4, 7, 11],
    m7:       [0, 3, 7, 10],
    dim:      [0, 3, 6],
    aug:      [0, 4, 8],
  };
  return map[quality] || [0, 4, 7];
}


// ─── 7. PUBLIC API ───────────────────────────────────────────────────────────

// Main entry point. Given a chord's root pc, pitch classes, and interval
// pattern, return the full analysis: all contexts, resolution targets per
// context, ready for the UI to render as pills and voice leading table.
//
// chordRootPc:       integer 0–11
// chordPitchClasses: array or Set of pitch class integers 0–11
// chordIntervals:    raw intervals from CHORD_TYPES entry (e.g. [0,4,7,10])
// sourceMidi:        array of MIDI note numbers currently sounding
// chordFamily:       string from CHORD_TYPES family field (for ambiguous check)
//
// Returns: { contexts, isAmbiguous }
function analyseChord(chordRootPc, chordPitchClasses, chordIntervals, sourceMidi, chordFamily) {
  // Flag families where algorithm can't reliably resolve
  const isAmbiguous = AMBIGUOUS_FAMILIES.has(chordFamily);

  // Find all diatonic contexts
  const contexts = findDiatonicContexts(chordRootPc, chordPitchClasses, chordIntervals);

  // For each context, derive resolution targets and voice leading
  for (const ctx of contexts) {
    ctx.resolutions = deriveResolutionTargets(ctx);

    // Compute voice leading for each resolution target
    for (const res of ctx.resolutions) {
      if (sourceMidi && sourceMidi.length) {
        res.voiceLeading = computeVoiceLeadingRules(
          sourceMidi, res.targetRootPc, res.targetQuality, ctx
        );
      }
    }
  }

  return { contexts, isAmbiguous };
}
