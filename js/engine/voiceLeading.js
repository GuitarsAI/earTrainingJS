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

// Core tones that must fit the scale in a fuzzy match (root + major 3rd + minor 7th).
// Used for altered dominant chords whose extensions (♭9, ♯11, ♭13) are chromatic
// by design and would prevent any exact scale match.
// Intervals are relative to chord root (semitones).
const DOMINANT_CORE_INTERVALS = [0, 4, 10]; // root, M3, m7


// ─── 1b. CHORD_SYMBOL_INTERVALS — startup index ──────────────────────────────
//
// Flat symbol → intervals lookup built entirely from CHORD_TYPES.
// Built once at startup. No manual table. Auto-updates when CHORD_TYPES gains entries.
// Intervals are normalised mod 12, deduplicated, sorted ascending.
//
// Used by resolveTargetIntervals() to map a targetSymbol (e.g. 'Maj7', 'm7', '7')
// to the pitch-class interval array needed by generateCandidates().
const CHORD_SYMBOL_INTERVALS = (() => {
  const map = {};
  for (const family of Object.values(CHORD_TYPES)) {
    for (const entry of family) {
      if (entry.symbol && entry.intervals) {
        map[entry.symbol] = [...new Set(entry.intervals.map(i => i % 12))].sort((a, b) => a - b);
      }
    }
  }
  return map;
})();


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

// Build the set of core pitch classes for a dominant chord (root + M3 + m7).
// These are the defining tones of a dominant 7th; alterations (♭9, ♯11, ♭13)
// are intentionally excluded so that fuzzy matching can find a tonal home
// even when the full chord is chromatic.
// chordRootPc: 0–11
function buildDominantCorePcs(chordRootPc) {
  return new Set(DOMINANT_CORE_INTERVALS.map(i => (chordRootPc + i) % 12));
}


// ─── 3. STEP 3 — DIATONIC CONTEXT DISCOVERY ──────────────────────────────────

// Core function. Given a chord root (pitch class) and its pitch classes,
// find every scale (across all 25 SCALES × 12 roots) that contains all
// chord pitch classes. For each match, compute the scale degree, Roman
// numeral, harmonic function, and tension score.
//
// For altered dominant chords (dominant quality with 2+ chromatic alterations),
// a second fuzzy pass is performed using only the core tones (root, M3, m7).
// Fuzzy matches are tagged with matchQuality: 0.8 and de-duplicated against
// exact matches so the same context is never listed twice.
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

  // Key used to de-duplicate contexts across exact and fuzzy passes.
  // Two contexts are the same if they share scale symbol + scale root.
  const seen = new Set();

  // ── Pass 1: Exact match — all chord pitch classes must fit the scale ──────
  for (const scale of SCALES) {
    for (let scaleRootPc = 0; scaleRootPc < 12; scaleRootPc++) {

      // Build scale pitch class set for this root
      const scalePcs = buildScalePcs(scaleRootPc, scale.intervals);

      // Check if ALL chord pitch classes are in this scale
      let fits = true;
      for (const pc of chordPcs) {
        if (!scalePcs.has(pc)) { fits = false; break; }
      }
      if (!fits) continue;

      // Check chord root is actually in the scale
      if (!scalePcs.has(chordRootPc)) continue;

      const degSemitones    = chordDegreeInScale(scaleRootPc, chordRootPc);
      const roman           = (typeof semitoneToDegree === 'function')
        ? semitoneToDegree(degSemitones, chordQuality)
        : degSemitones.toString();
      const harmonicFunction = FUNCTION_MAP[degSemitones] || 'tonic';
      const tension          = scoreTension(degSemitones, chordPcs, chordRootPc);

      const key = `${scale.symbol}:${scaleRootPc}`;
      seen.add(key);

      contexts.push({
        scaleSymbol:      scale.symbol,
        scaleName:        scale.name,
        scaleGroup:       scale.group || 'diatonic',
        scaleRootPc,
        degSemitones,
        roman,
        harmonicFunction,
        tension,
        matchQuality: 1.0,   // exact match
      });
    }
  }

  // ── Pass 2: Fuzzy match for altered dominant chords ───────────────────────
  // An altered dominant has dominant quality (M3 + m7) plus 2 or more
  // chromatic alterations (♭9, ♯9, ♯11, ♭13, etc.). Its extensions are
  // deliberately non-diatonic, so no single scale contains all its notes —
  // exact matching returns nothing, leaving the chord without a resolution.
  //
  // Fix: match scales against core tones only (root + M3 + m7). If the scale
  // accepts those three tones AND the chord root sits at scale degree 7
  // (dominant degree), we have a valid dominant context in that key.
  // The chord still resolves to that key's tonic; the alterations are
  // understood as chromatic colour, not scale membership violations.
  //
  // matchQuality is set to 0.8 to distinguish fuzzy entries from exact ones.
  // Contexts already found in Pass 1 are skipped (de-duplication via `seen`).

  const alterationCount = countAlterations(chordRootPc, chordPcs);
  const isDominantQualityForFuzzy = chordQuality === 'dominant';

  if (isDominantQualityForFuzzy && alterationCount >= 2) {
    const corePcs = buildDominantCorePcs(chordRootPc);

    for (const scale of SCALES) {
      for (let scaleRootPc = 0; scaleRootPc < 12; scaleRootPc++) {

        const key = `${scale.symbol}:${scaleRootPc}`;
        if (seen.has(key)) continue; // already have an exact match for this context

        const scalePcs = buildScalePcs(scaleRootPc, scale.intervals);

        // Core tones (root + M3 + m7) must all fit the scale
        let coreFits = true;
        for (const pc of corePcs) {
          if (!scalePcs.has(pc)) { coreFits = false; break; }
        }
        if (!coreFits) continue;

        // Chord root must be in the scale
        if (!scalePcs.has(chordRootPc)) continue;

        const degSemitones     = chordDegreeInScale(scaleRootPc, chordRootPc);
        const harmonicFunction = FUNCTION_MAP[degSemitones] || 'tonic';

        // Only keep dominant-function contexts from the fuzzy pass.
        // A dominant chord with altered extensions sitting on, say, degree I
        // of a mixolydian scale would be misleading — we want the resolution
        // context (V → I), not a tonic reading.
        if (harmonicFunction !== 'dominant') continue;

        const roman   = (typeof semitoneToDegree === 'function')
          ? semitoneToDegree(degSemitones, chordQuality)
          : degSemitones.toString();

        // Tension: use full chord pcs for scoring (alterations still count)
        const tension = scoreTension(degSemitones, chordPcs, chordRootPc);

        seen.add(key);

        contexts.push({
          scaleSymbol:      scale.symbol,
          scaleName:        scale.name,
          scaleGroup:       scale.group || 'diatonic',
          scaleRootPc,
          degSemitones,
          roman,
          harmonicFunction,
          tension,
          matchQuality: 0.8,   // fuzzy — core tones only
        });
      }
    }
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  // Sort priority (Berklee functional harmony — most musically relevant first):
  //
  //   1. Dominant function first — for dominant-quality chords, a context where
  //      the chord functions as V must always surface before any other reading,
  //      regardless of how well the chord fits that scale. An altered dominant
  //      in a diatonic V context is more musically meaningful than a perfect
  //      fit in an exotic symmetric scale that implies no functional resolution.
  //
  //   2. Diatonic group before all others — only diatonic scales imply a tonic
  //      to resolve to. Octatonic, hexatonic, and pentatonic scales can contain
  //      a dominant chord by coincidence (e.g. Messiaen Mode 4 swallows 7-note
  //      chords easily due to its 8-note density) but carry no harmonic function.
  //      Diatonic contexts are always more meaningful than exotic exact matches.
  //
  //   3. Match quality — within the same group, exact matches before fuzzy.
  //
  //   4. Scale commonality — more common scales (major > nat_minor > ...)
  //      surface before rare ones within the same group.
  //
  //   5. Tension — within same commonality band, higher tension listed first.

  const isDominantQuality = chordIntervals
    ? (deriveChordQuality(chordIntervals) === 'dominant')
    : false;

  // Group priority: diatonic beats everything; pentatonic/hexatonic/octatonic are equal.
  function groupPriority(group) {
    return group === 'diatonic' ? 1 : 0;
  }

  contexts.sort((a, b) => {
    // Tier 1: dominant-function contexts always first for dominant-quality chords
    if (isDominantQuality) {
      const aIsDom = a.harmonicFunction === 'dominant' ? 1 : 0;
      const bIsDom = b.harmonicFunction === 'dominant' ? 1 : 0;
      if (bIsDom !== aIsDom) return bIsDom - aIsDom;
    }

    // Tier 2: diatonic group beats non-diatonic (pentatonic / hexatonic / octatonic)
    const gDiff = groupPriority(b.scaleGroup) - groupPriority(a.scaleGroup);
    if (gDiff !== 0) return gDiff;

    // Tier 3: exact matches before fuzzy matches (within same group)
    const mDiff = b.matchQuality - a.matchQuality;
    if (mDiff !== 0) return mDiff;

    // Tier 4: scale commonality
    const cDiff = scaleCommonality(b.scaleSymbol) - scaleCommonality(a.scaleSymbol);
    if (cDiff !== 0) return cDiff;

    // Tier 5: tension
    return b.tension - a.tension;
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

// For a given context, compute resolutions, departures, and substitutions.
//
// Returns an object with three arrays, each entry ranked by strength:
//   resolutions   — true harmonic resolutions (tension → rest)
//   departures    — motion away from a stable tonic chord
//   substitutions — reharmonisation alternatives (not resolutions)
//
// Each entry: { targetRootPc, targetQuality, resolutionType, cadenceName, strength }
//
// resolutionType values:
//   resolutions:   'authentic' | 'authentic_minor' | 'deceptive' | 'plagal' |
//                  'to_dominant' | 'half_cadence' | 'leading_tone'
//   departures:    'departure'
//   substitutions: 'tritone_sub' | 'related_ii'
//
// context: one entry from findDiatonicContexts()
function deriveResolutionTargets(context, chordRootPc) {
  const { degSemitones, scaleRootPc, harmonicFunction } = context;

  const resolutions   = [];
  const departures    = [];
  const substitutions = [];

  // ── TONIC — stable chord, no tension to resolve ──────────────────────────────
  // Provide departure paths only. No resolutions, no substitutions.
  if (harmonicFunction === 'tonic') {

    // Most common departure: I → IV (subdominant motion)
    departures.push({
      targetRootPc:   (scaleRootPc + 5) % 12,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'departure',
      cadenceName:    'I → IV',
      strength:       0.7,
    });

    // I → V (move toward dominant)
    departures.push({
      targetRootPc:   (scaleRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'departure',
      cadenceName:    'I → V',
      strength:       0.6,
    });

    // I → ii (predominant departure)
    departures.push({
      targetRootPc:   (scaleRootPc + 2) % 12,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'departure',
      cadenceName:    'I → ii',
      strength:       0.5,
    });

    // I → vi (tonic prolongation / relative minor departure)
    departures.push({
      targetRootPc:   (scaleRootPc + 9) % 12,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'departure',
      cadenceName:    'I → vi',
      strength:       0.4,
    });

    return { resolutions, departures, substitutions };
  }

  // ── DOMINANT — V7, VII°, ♭V (tritone degree) → resolves to tonic ─────────────
  // Standard order per tonal harmony (Berklee, Aldwell & Schachter):
  //   1. Authentic cadence V → I  (strongest — both chords in root position = perfect authentic)
  //   2. Authentic cadence V → i  (to minor tonic — applies when scale is minor)
  //   3. Deceptive cadence V → vi (interrupted resolution — vi substitutes for I)
  // Substitutions are separate (not resolutions):
  //   - Tritone sub: D♭7 substitutes FOR G7; both still resolve TO C, not to each other
  //   - Related ii:  Dm7 precedes G7 in the ii–V–I; it is not a resolution target of G7
  if (harmonicFunction === 'dominant') {
    const tonicRootPc = scaleRootPc;

    // 1. Authentic cadence — V7 → I (major tonic)
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'authentic',
      cadenceName:    'V → I',
      strength:       1.0,
    });

    // 2. Authentic cadence — V7 → i (minor tonic)
    // Always listed; the UI can filter by scale type if desired.
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'authentic_minor',
      cadenceName:    'V → i',
      strength:       0.9,
    });

    // 3. Deceptive cadence — V → vi
    resolutions.push({
      targetRootPc:   (tonicRootPc + 9) % 12,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'deceptive',
      cadenceName:    'V → vi',
      strength:       0.6,
    });

    // Substitutions (separate array — not resolutions)
    // Tritone sub: 6 semitones away from the dominant chord's own root.
    // e.g. G7 (chordRootPc=7) → D♭7 (7+6=1). D♭7 also resolves to C, same tonic.
    // chordRootPc is passed in from analyseChord(); fallback: scaleRootPc+7 (V of tonic).
    const ttSubRootPc = ((chordRootPc !== undefined ? chordRootPc : (scaleRootPc + 7)) + 6) % 12;
    substitutions.push({
      targetRootPc:   ttSubRootPc,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'tritone_sub',
      cadenceName:    'Tritone sub',
      strength:       0.8,
    });

    // Related ii: the minor seventh chord whose root is a P4 below the dominant root.
    // e.g. for G7 → Dm7 (ii of C major). This is a predecessor, not a resolution target.
    const relatedIiRootPc = (context.scaleRootPc + 2) % 12; // ii of the tonic scale
    substitutions.push({
      targetRootPc:   relatedIiRootPc,
      targetSymbol:   'm7',
      targetQuality:  'm7',
      resolutionType: 'related_ii',
      cadenceName:    'Related ii7',
      strength:       0.7,
    });
  }

  // ── SUBDOMINANT — IV, ♭VI, ♭VII → typically moves to dominant, then resolves ──
  // Standard order:
  //   1. IV → V  (subdominant to dominant — most common motion)
  //   2. IV → I  (plagal cadence — weaker, "amen" cadence)
  if (harmonicFunction === 'subdominant') {
    const tonicRootPc = scaleRootPc;

    // 1. To dominant (IV → V) — prepares authentic cadence
    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'IV → V',
      strength:       0.8,
    });

    // 2. Plagal cadence (IV → I)
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'plagal',
      cadenceName:    'IV → I',
      strength:       0.5,
    });
  }

  // ── PREDOMINANT — II, ii → moves to V, then to I ─────────────────────────────
  // Standard order:
  //   1. ii → V  (the ii–V motion — backbone of jazz and tonal harmony)
  //   2. ii → I  (direct resolution — weak, but possible; avoid in strict voice leading)
  if (harmonicFunction === 'predominant') {
    const tonicRootPc = scaleRootPc;

    // 1. ii → V (move to dominant — by far the strongest predominant motion)
    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'ii → V',
      strength:       0.9,
    });

    // 2. ii → I (direct — weak, used in some cadential contexts)
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'direct',
      cadenceName:    'ii → I',
      strength:       0.3,
    });
  }

  return { resolutions, departures, substitutions };
}


// ─── 6. STEP 6 — VOICE LEADING COMPUTATION ───────────────────────────────────
//
// Globally optimal, cost-function-driven voice leading assignment.
// Replaces the greedy named-note engine with a backtracking search that
// minimises total semitone cost across all voices simultaneously.
//
// Design: the cost function IS the theory. Leading tone rises and seventh
// falls not because rules say so, but because those moves have cost 1 —
// the minimum possible. No note names are detected anywhere in this section.

// LEAP_PENALTY: added to raw semitone distance for any move larger than M3 (4 st).
// A P5 leap (7 st) costs 7 + 8 = 15 — more than five stepwise moves.
// Bass leap penalty is halved to allow natural bass motion by 4th/5th.
const LEAP_PENALTY = 8;

// ── 6.1 resolveTargetIntervals() ─────────────────────────────────────────────
//
// Look up interval array for a CHORD_TYPES symbol string.
// Falls back to [0,4,7] only for unknown symbols (programming error upstream).
//
// targetSymbol: a CHORD_TYPES symbol string, e.g. 'Maj7', 'm7', '7'
// Returns: array of pitch-class intervals mod 12, sorted ascending, deduplicated.
function resolveTargetIntervals(targetSymbol) {
  return CHORD_SYMBOL_INTERVALS[targetSymbol] || [0, 4, 7];
}

// ── 6.2 generateCandidates() ─────────────────────────────────────────────────
//
// For each target pitch class, enumerate every reachable MIDI note within
// ±12 semitones of the source range. This guarantees the nearest instance
// of every target PC is always available to every source voice.
//
// targetRootPc:    pitch class 0–11
// targetIntervals: array from resolveTargetIntervals()
// sourceMidi:      array of source MIDI note numbers
//
// Returns: array of { midi, pc, intervalIndex }
function generateCandidates(targetRootPc, targetIntervals, sourceMidi) {
  const lo = Math.min(...sourceMidi) - 12;
  const hi = Math.max(...sourceMidi) + 12;
  const candidates = [];

  targetIntervals.forEach((interval, intervalIndex) => {
    const pc        = (targetRootPc + interval) % 12;
    const remainder = ((pc - lo) % 12 + 12) % 12;
    const first     = lo + remainder;
    for (let midi = first; midi <= hi; midi += 12) {
      candidates.push({ midi, pc, intervalIndex });
    }
  });

  return candidates;
}

// ── 6.3 moveCost() ───────────────────────────────────────────────────────────
//
// Cost of moving a voice by `delta` semitones.
// delta:  absolute semitone distance (0 = common tone, 1 = m2, …)
// isBass: true for the lowest source voice — halves the leap penalty
//
// Returns a non-negative cost integer.
function moveCost(delta, isBass) {
  if (delta === 0) return 0;                         // common tone — free
  if (delta <= 4)  return delta;                     // step or third — cost = distance
  return delta + (isBass ? LEAP_PENALTY / 2 : LEAP_PENALTY);  // leap — add penalty
}

// ── 6.4 assignByMinCost() ────────────────────────────────────────────────────
//
// Global minimum-cost assignment via backtracking search.
// Assigns each source voice to a candidate such that:
//   - No two voices share the same MIDI note (no exact unison doubling)
//   - Total cost across all voices is minimised globally
//
// For N ≤ 7 voices, exhaustive search with branch pruning is trivially fast.
//
// sourceMidi:  array of MIDI note numbers, sorted ascending (bass first)
// candidates:  array from generateCandidates()
//
// Returns: array of { fromMidi, toMidi } in the same order as sourceMidi (sorted)
function assignByMinCost(sourceMidi, candidates) {
  const sorted = [...sourceMidi].sort((a, b) => a - b);
  const n      = sorted.length;

  let bestAssignment = null;
  let bestTotalCost  = Infinity;

  function search(voiceIdx, assignment, usedMidi, currentCost) {
    // Prune: abandon branch if already at or above best known cost
    if (currentCost >= bestTotalCost) return;

    if (voiceIdx === n) {
      bestTotalCost  = currentCost;
      bestAssignment = assignment.slice();
      return;
    }

    const src    = sorted[voiceIdx];
    const isBass = voiceIdx === 0;

    // Sort candidates cheapest-first for this voice — maximises pruning efficiency
    const sortedCands = candidates
      .filter(c => !usedMidi.has(c.midi))
      .sort((a, b) =>
        moveCost(Math.abs(a.midi - src), isBass) -
        moveCost(Math.abs(b.midi - src), isBass)
      );

    for (const cand of sortedCands) {
      const cost = moveCost(Math.abs(cand.midi - src), isBass);
      usedMidi.add(cand.midi);
      assignment.push({ fromMidi: src, toMidi: cand.midi });
      search(voiceIdx + 1, assignment, usedMidi, currentCost + cost);
      assignment.pop();
      usedMidi.delete(cand.midi);
    }
  }

  search(0, [], new Set(), 0);

  // Fallback: if no assignment found (shouldn't happen with a ±12 window),
  // each voice stays on its current pitch. Indicates a candidate generation error.
  if (!bestAssignment) {
    return sorted.map(midi => ({ fromMidi: midi, toMidi: midi }));
  }

  return bestAssignment;
}

// ── 6.5 repairVoiceCrossing() ────────────────────────────────────────────────
//
// Post-processing: swap target notes of adjacent voice pairs when a crossing
// exists AND the swap strictly reduces total cost.
//
// Uses strict < (not <=) in the swap guard to guarantee termination:
// each accepted swap strictly reduces total cost, so the loop converges
// in at most O(N²) passes with no risk of cycling.
//
// assignments: array of { fromMidi, toMidi } sorted by fromMidi ascending
// Returns the same array with crossings resolved in-place.
function repairVoiceCrossing(assignments) {
  assignments.sort((a, b) => a.fromMidi - b.fromMidi);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < assignments.length - 1; i++) {
      const a = assignments[i];
      const b = assignments[i + 1];
      if (a.toMidi > b.toMidi) {
        const isBassA = i === 0;
        const isBassB = false; // i+1 is never the bass
        const costBefore = moveCost(Math.abs(a.toMidi - a.fromMidi), isBassA)
                         + moveCost(Math.abs(b.toMidi - b.fromMidi), isBassB);
        const costAfter  = moveCost(Math.abs(b.toMidi - a.fromMidi), isBassA)
                         + moveCost(Math.abs(a.toMidi - b.fromMidi), isBassB);
        if (costAfter < costBefore) {
          [assignments[i].toMidi, assignments[i + 1].toMidi] =
            [assignments[i + 1].toMidi, assignments[i].toMidi];
          changed = true;
        }
      }
    }
  }
  return assignments;
}

// ── 6.6 buildMoves() ─────────────────────────────────────────────────────────
//
// Convert final assignments to the UI move objects expected by breakdown.js.
//
// assignments: array of { fromMidi, toMidi }
// Returns: array of { fromMidi, toMidi, fromPc, toPc, semitones, direction, reason }
function buildMoves(assignments) {
  return assignments.map(({ fromMidi, toMidi }) => {
    const delta = toMidi - fromMidi;
    return {
      fromMidi,
      toMidi,
      fromPc:    ((fromMidi % 12) + 12) % 12,
      toPc:      ((toMidi   % 12) + 12) % 12,
      semitones: Math.abs(delta),
      direction: delta === 0 ? 'none' : delta > 0 ? 'up' : 'down',
      reason:    delta === 0 ? 'common_tone' : 'stepwise',
    };
  });
}

// ── 6.7 computeVoiceLeadingRules() — public API ───────────────────────────────
//
// Orchestrates the five-stage pipeline:
//   1. Resolve target intervals from CHORD_SYMBOL_INTERVALS
//   2. Generate all reachable candidate MIDI notes
//   3. Global minimum-cost assignment (backtracking search)
//   4. Voice crossing repair
//   5. Build UI move objects
//
// sourceMidi:   array of MIDI note numbers (the sounding chord)
// targetRootPc: pitch class 0–11 of the resolution target root
// targetSymbol: CHORD_TYPES symbol string (e.g. 'Maj7', 'm7', '7')
// context:      context object — accepted for signature compatibility, not used
//
// Returns: array of { fromMidi, toMidi, fromPc, toPc, semitones, direction, reason }
function computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, context) {
  const targetIntervals = resolveTargetIntervals(targetSymbol);
  const candidates      = generateCandidates(targetRootPc, targetIntervals, sourceMidi);
  const raw             = assignByMinCost(sourceMidi, candidates);
  const repaired        = repairVoiceCrossing(raw);
  return buildMoves(repaired);
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
// Each context now carries three arrays:
//   ctx.resolutions   — true harmonic resolutions, ordered strongest first
//   ctx.departures    — departure paths (tonic chords only)
//   ctx.substitutions — reharmonisation alternatives (e.g. tritone sub, related ii)
//
// Voice leading is pre-computed for every entry in resolutions and departures.
// Substitutions carry no voice leading (they are chord substitutes, not targets).
function analyseChord(chordRootPc, chordPitchClasses, chordIntervals, sourceMidi, chordFamily) {
  // Flag families where algorithm can't reliably resolve
  const isAmbiguous = AMBIGUOUS_FAMILIES.has(chordFamily);

  // Find all diatonic contexts
  const contexts = findDiatonicContexts(chordRootPc, chordPitchClasses, chordIntervals);

  // For each context, derive resolution targets and voice leading
  for (const ctx of contexts) {
    const derived = deriveResolutionTargets(ctx, chordRootPc);

    ctx.resolutions   = derived.resolutions;
    ctx.departures    = derived.departures;
    ctx.substitutions = derived.substitutions;

    // Pre-compute voice leading for every true resolution
    if (sourceMidi && sourceMidi.length) {
      for (const res of ctx.resolutions) {
        res.voiceLeading = computeVoiceLeadingRules(
          sourceMidi, res.targetRootPc, res.targetSymbol, ctx
        );
      }

      // Pre-compute voice leading for departure paths too
      for (const dep of ctx.departures) {
        dep.voiceLeading = computeVoiceLeadingRules(
          sourceMidi, dep.targetRootPc, dep.targetSymbol, ctx
        );
      }

      // Substitutions do not get voice leading — they are not resolution targets
    }
  }

  return { contexts, isAmbiguous };
}
