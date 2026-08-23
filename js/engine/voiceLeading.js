/**
 * @file voiceLeading.js
 * @description Voice leading and harmonic resolution engine for The Sound Travels Ear Training.
 * Implements a five-stage analysis pipeline that, given any chord, discovers every diatonic
 * context it fits, scores harmonic tension, derives resolution targets, and computes globally
 * optimal voice leading to each target via backtracking search.
 *
 * Pipeline stages:
 *   1. Constants & startup index  — `FUNCTION_MAP`, `BASE_TENSION`, `CHORD_SYMBOL_INTERVALS`
 *   2. Pure helpers               — pitch-class arithmetic, quality detection, alteration counting
 *   3. Context discovery          — `findDiatonicContexts()` (exact + fuzzy passes)
 *   4. Tension scoring            — `scoreTension()`
 *   5. Resolution derivation      — `deriveResolutionTargets()`
 *   6. Voice leading computation  — `computeVoiceLeadingRules()` and its sub-functions
 *   7. Public API                 — `analyseChord()`
 *
 * All functions are pure and stateless — same input always returns the same output.
 * No DOM access. No app state mutations.
 *
 * Load order: after `helpers.js`, `chords.js`, `scales.js`, and `breakdown.js`.
 *
 * @module voiceLeading
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */


// ─── 1. CONSTANTS ────────────────────────────────────────────────────────────

/**
 * Harmonic function derived from scale degree (semitones from scale root, 0–11).
 * Used in context discovery (Step 3) and tension scoring (Step 4).
 *
 * @type {Object.<number, string>}
 */
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

/**
 * Base tension value per scale degree (semitones from scale root, 0–11).
 * Modified by chord content in `scoreTension()`.
 * Range: 0.0 (completely at rest) to 0.9 (maximum pre-resolution tension).
 *
 * @type {Object.<number, number>}
 */
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

/**
 * Chord qualities whose Roman numerals are lowercased (minor and diminished chords).
 *
 * @type {Set.<string>}
 */
const LOWERCASE_QUALITIES = new Set(['minor', 'diminished']);

/**
 * Chord families where the algorithm cannot reliably derive a single resolution target.
 * These fall back to existing app logic rather than the voice leading engine.
 * See algorithm plan § 6 Edge Cases.
 *
 * @type {Set.<string>}
 */
const AMBIGUOUS_FAMILIES = new Set(['aug', 'augmented', 'sus', 'suspended', 'poly', 'ust']);

/**
 * Core tones used for fuzzy scale matching of altered dominant chords.
 * Altered dominants (e.g. 7(♭9)(♯11)(♭13)) have extensions that are chromatic by design
 * and would prevent any exact scale match. Matching on root + M3 + m7 only identifies
 * the dominant context without requiring the altered tensions to be diatonic.
 * Intervals are semitones above the chord root.
 *
 * @type {number[]}
 */
const DOMINANT_CORE_INTERVALS = [0, 4, 10]; // root, M3, m7


// ─── 1b. CHORD_SYMBOL_INTERVALS — startup index ──────────────────────────────

/**
 * Flat symbol-to-intervals lookup built from `CHORD_TYPES` at startup.
 * Intervals are normalised mod 12, deduplicated, and sorted ascending.
 * Auto-updates when `CHORD_TYPES` gains new entries — no manual maintenance needed.
 *
 * Used by `resolveTargetIntervals()` to map a target symbol (e.g. `'Maj7'`, `'m7'`)
 * to the pitch-class interval array required by `generateCandidates()`.
 *
 * @type {Object.<string, number[]>}
 */
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

/**
 * Builds a Set of pitch classes for a scale given its root and interval array.
 *
 * @param {number} rootPc - Scale root as a pitch class (0–11).
 * @param {number[]} intervals - Raw interval array from a `SCALES` entry (e.g. `[0,2,4,5,7,9,11,12]`).
 * @returns {Set.<number>} Pitch classes contained in the scale.
 */
function buildScalePcs(rootPc, intervals) {
  const pcs = new Set();
  for (const interval of intervals) {
    pcs.add((rootPc + interval) % 12);
  }
  return pcs;
}

/**
 * Returns the scale degree of a chord root within a scale as semitones from the scale root.
 *
 * @param {number} scaleRootPc - Scale root pitch class (0–11).
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @returns {number} Semitones from scale root to chord root (0–11).
 */
function chordDegreeInScale(scaleRootPc, chordRootPc) {
  return ((chordRootPc - scaleRootPc) + 12) % 12;
}

/**
 * Returns `true` if any two pitch classes in the set are a tritone (6 semitones) apart.
 *
 * @param {Iterable.<number>} pitchClasses - Collection of pitch class integers (0–11).
 * @returns {boolean} Whether a tritone interval exists between any pair.
 */
function hasTritone(pitchClasses) {
  const pcs = [...pitchClasses];
  for (let i = 0; i < pcs.length; i++) {
    for (let j = i + 1; j < pcs.length; j++) {
      if (((pcs[j] - pcs[i] + 12) % 12) === 6) return true;
    }
  }
  return false;
}

/**
 * Counts chromatic alterations in a chord — pitch classes not present in the
 * natural major scale built on the chord root. Used as a tension modifier in
 * `scoreTension()` and to detect altered dominants for the fuzzy matching pass.
 *
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @param {Iterable.<number>} chordPitchClasses - Pitch classes in the chord.
 * @returns {number} Number of non-diatonic pitch classes.
 */
function countAlterations(chordRootPc, chordPitchClasses) {
  const majorIntervals = new Set([0, 2, 4, 5, 7, 9, 11].map(i => (i + chordRootPc) % 12));
  let count = 0;
  for (const pc of chordPitchClasses) {
    if (!majorIntervals.has(pc)) count++;
  }
  return count;
}

/**
 * Derives a chord quality label from its interval pattern.
 * Used to determine Roman numeral case and functional description.
 *
 * @param {number[]} intervals - Semitone intervals from root (e.g. `[0,4,7,10]`).
 * @returns {'major'|'minor'|'diminished'|'augmented'|'dominant'|'suspended'} Quality string.
 */
function deriveChordQuality(intervals) {
  const pcs = intervals.map(i => i % 12).filter((v, i, a) => a.indexOf(v) === i).sort((a,b) => a-b);
  const hasMinorThird = pcs.includes(3);
  const hasMajorThird = pcs.includes(4);
  const hasDimFifth   = pcs.includes(6);
  const hasAugFifth   = pcs.includes(8);
  const hasMinorSev   = pcs.includes(10);
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

/**
 * Builds the set of core pitch classes for a dominant chord (root + M3 + m7).
 * Used in the fuzzy matching pass to locate altered dominant chords in a tonal context
 * without requiring their chromatic extensions to be diatonic.
 *
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @returns {Set.<number>} Pitch classes for the three core dominant tones.
 */
function buildDominantCorePcs(chordRootPc) {
  return new Set(DOMINANT_CORE_INTERVALS.map(i => (chordRootPc + i) % 12));
}


// ─── 3. STEP 3 — DIATONIC CONTEXT DISCOVERY ──────────────────────────────────

/**
 * Assigns a commonality weight to a scale symbol so that more common scales
 * surface before rare ones when tension is equal. Higher value = more common.
 *
 * @param {string} symbol - Scale symbol from `SCALES`.
 * @returns {number} Commonality weight (default 2 for unknown scales).
 */
function scaleCommonality(symbol) {
  const weights = {
    major: 10, nat_minor: 9, harm_minor: 8, mel_minor: 7,
    dorian: 6, mixolydian: 6, phrygian: 5, lydian: 5,
    locrian: 3, pent_maj: 4, pent_min: 4, blues: 4,
  };
  return weights[symbol] || 2;
}

/**
 * Finds every diatonic context in which a chord can function — the core of the
 * voice leading engine. Tests all 46 scales × 12 roots (552 combinations) and
 * collects every context where all chord pitch classes are contained in the scale.
 *
 * For altered dominant chords (dominant quality with 2+ chromatic alterations), a
 * second fuzzy pass matches against core tones only (root + M3 + m7), since their
 * extensions are chromatic by design and would prevent any exact match. Fuzzy
 * matches are tagged `matchQuality: 0.8` and de-duplicated against exact matches.
 *
 * Results are sorted by musical relevance (dominant function → diatonic group →
 * match quality → scale commonality → tension).
 *
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @param {Iterable.<number>} chordPitchClasses - All pitch classes in the chord.
 * @param {number[]} chordIntervals - Raw intervals from the `CHORD_TYPES` entry (for quality detection).
 * @returns {Array.<{
 *   scaleSymbol: string,
 *   scaleName: string,
 *   scaleGroup: string,
 *   scaleRootPc: number,
 *   degSemitones: number,
 *   roman: string,
 *   harmonicFunction: string,
 *   tension: number,
 *   matchQuality: number
 * }>} Context objects sorted by musical relevance, highest first.
 */
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

      const scalePcs = buildScalePcs(scaleRootPc, scale.intervals);

      let fits = true;
      for (const pc of chordPcs) {
        if (!scalePcs.has(pc)) { fits = false; break; }
      }
      if (!fits) continue;

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
        matchQuality: 1.0,
      });
    }
  }

  // ── Pass 2: Fuzzy match for altered dominant chords ───────────────────────
  // An altered dominant has dominant quality (M3 + m7) plus 2 or more
  // chromatic alterations (♭9, ♯9, ♯11, ♭13, etc.). Its extensions are
  // deliberately non-diatonic, so no single scale contains all its notes.
  // Fix: match scales against core tones only (root + M3 + m7). If the scale
  // accepts those three tones AND the chord root sits at a dominant scale degree,
  // the chord still resolves to that key's tonic.
  // matchQuality is set to 0.8 to distinguish fuzzy entries from exact ones.
  // Contexts already found in Pass 1 are skipped via the `seen` set.
  const alterationCount = countAlterations(chordRootPc, chordPcs);
  const isDominantQualityForFuzzy = chordQuality === 'dominant';

  if (isDominantQualityForFuzzy && alterationCount >= 2) {
    const corePcs = buildDominantCorePcs(chordRootPc);

    for (const scale of SCALES) {
      for (let scaleRootPc = 0; scaleRootPc < 12; scaleRootPc++) {

        const key = `${scale.symbol}:${scaleRootPc}`;
        if (seen.has(key)) continue;

        const scalePcs = buildScalePcs(scaleRootPc, scale.intervals);

        let coreFits = true;
        for (const pc of corePcs) {
          if (!scalePcs.has(pc)) { coreFits = false; break; }
        }
        if (!coreFits) continue;

        if (!scalePcs.has(chordRootPc)) continue;

        const degSemitones     = chordDegreeInScale(scaleRootPc, chordRootPc);
        const harmonicFunction = FUNCTION_MAP[degSemitones] || 'tonic';

        // Only keep dominant-function contexts from the fuzzy pass.
        // A dominant chord with altered extensions at, say, degree I of a Mixolydian
        // scale carries no functional resolution — the V → I reading is what matters.
        if (harmonicFunction !== 'dominant') continue;

        const roman   = (typeof semitoneToDegree === 'function')
          ? semitoneToDegree(degSemitones, chordQuality)
          : degSemitones.toString();

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
          matchQuality: 0.8,
        });
      }
    }
  }

  // ── Sort by musical relevance ─────────────────────────────────────────────
  // Priority order (Berklee functional harmony — most musically relevant first):
  //   1. Dominant function first — for dominant-quality chords, V contexts always
  //      surface before any other reading, regardless of scale fit quality.
  //   2. Diatonic group before all others — only diatonic scales imply a functional
  //      tonic to resolve to. Non-diatonic exact matches are less meaningful.
  //   3. Match quality — exact before fuzzy within the same group.
  //   4. Scale commonality — more common scales surface before rare ones.
  //   5. Tension — higher tension listed first within the same commonality band.
  const isDominantQuality = chordIntervals
    ? (deriveChordQuality(chordIntervals) === 'dominant')
    : false;

  function groupPriority(group) {
    return group === 'diatonic' ? 1 : 0;
  }

  contexts.sort((a, b) => {
    if (isDominantQuality) {
      const aIsDom = a.harmonicFunction === 'dominant' ? 1 : 0;
      const bIsDom = b.harmonicFunction === 'dominant' ? 1 : 0;
      if (bIsDom !== aIsDom) return bIsDom - aIsDom;
    }
    const gDiff = groupPriority(b.scaleGroup) - groupPriority(a.scaleGroup);
    if (gDiff !== 0) return gDiff;
    const mDiff = b.matchQuality - a.matchQuality;
    if (mDiff !== 0) return mDiff;
    const cDiff = scaleCommonality(b.scaleSymbol) - scaleCommonality(a.scaleSymbol);
    if (cDiff !== 0) return cDiff;
    return b.tension - a.tension;
  });

  return contexts;
}


// ─── 4. STEP 4 — TENSION SCORING ─────────────────────────────────────────────

/**
 * Computes a tension score for a chord in a given diatonic context.
 * Combines the base tension of the chord's scale degree with modifiers
 * for tritone presence and chromatic alterations. Capped at 1.0.
 *
 * @param {number} degSemitones - Semitones from scale root to chord root (0–11).
 * @param {Set.<number>} chordPcs - Pitch classes in the chord.
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @returns {number} Tension score in the range 0.0–1.0.
 */
function scoreTension(degSemitones, chordPcs, chordRootPc) {
  let tension = BASE_TENSION[degSemitones] ?? 0.3;
  if (hasTritone(chordPcs)) tension += 0.08;
  const alterations = countAlterations(chordRootPc, chordPcs);
  tension += alterations * 0.04;
  return Math.min(tension, 1.0);
}


// ─── 5. STEP 5 — RESOLUTION TARGET DERIVATION ────────────────────────────────

/**
 * Derives all resolution targets, departure paths, and reharmonisation
 * substitutions for a chord in a given diatonic context.
 *
 * Returns three arrays ranked by strength:
 * - `resolutions`   — true harmonic resolutions (tension → rest); get voice leading pre-computed.
 * - `departures`    — motion away from a stable tonic chord; get voice leading pre-computed.
 * - `substitutions` — reharmonisation alternatives (e.g. tritone sub, related ii);
 *                     no voice leading computed (they are not resolution targets).
 *
 * Resolution types:
 * - Tonic:       departures only (I → IV, I → V, I → ii, I → vi)
 * - Dominant:    authentic (V → I), authentic minor (V → i), deceptive (V → vi);
 *                substitutions: tritone sub, related ii
 * - Subdominant: to dominant (IV → V), plagal (IV → I)
 * - Predominant: to dominant (ii → V), direct (ii → I)
 *
 * @param {{
 *   degSemitones: number,
 *   scaleRootPc: number,
 *   harmonicFunction: string
 * }} context - One context object from `findDiatonicContexts()`.
 * @param {number} chordRootPc - Chord root pitch class (0–11); used for tritone sub calculation.
 * @returns {{
 *   resolutions: Array.<Object>,
 *   departures: Array.<Object>,
 *   substitutions: Array.<Object>
 * }}
 */
function deriveResolutionTargets(context, chordRootPc) {
  const { degSemitones, scaleRootPc, harmonicFunction } = context;

  const resolutions   = [];
  const departures    = [];
  const substitutions = [];

  // ── TONIC — stable chord; provide departure paths only ───────────────────
  if (harmonicFunction === 'tonic') {
    departures.push({
      targetRootPc:   (scaleRootPc + 5) % 12,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'departure',
      cadenceName:    'I → IV',
      strength:       0.7,
    });
    departures.push({
      targetRootPc:   (scaleRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'departure',
      cadenceName:    'I → V',
      strength:       0.6,
    });
    departures.push({
      targetRootPc:   (scaleRootPc + 2) % 12,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'departure',
      cadenceName:    'I → ii',
      strength:       0.5,
    });
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

  // ── DOMINANT — V7, VII°, ♭V (tritone degree) → resolves to tonic ─────────
  // Standard order per tonal harmony (Berklee, Aldwell & Schachter):
  //   1. Authentic cadence V → I  (strongest)
  //   2. Authentic cadence V → i  (to minor tonic)
  //   3. Deceptive cadence V → vi (interrupted resolution)
  // Substitutions (not resolutions):
  //   - Tritone sub: D♭7 substitutes FOR G7; both resolve TO C.
  //   - Related ii:  Dm7 precedes G7 in ii–V–I; not a resolution target of G7.
  if (harmonicFunction === 'dominant') {
    const tonicRootPc = scaleRootPc;

    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'authentic',
      cadenceName:    'V → I',
      strength:       1.0,
    });
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'authentic_minor',
      cadenceName:    'V → i',
      strength:       0.9,
    });
    resolutions.push({
      targetRootPc:   (tonicRootPc + 9) % 12,
      targetSymbol:   'm7',
      targetQuality:  'minor',
      resolutionType: 'deceptive',
      cadenceName:    'V → vi',
      strength:       0.6,
    });

    const ttSubRootPc = ((chordRootPc !== undefined ? chordRootPc : (scaleRootPc + 7)) + 6) % 12;
    substitutions.push({
      targetRootPc:   ttSubRootPc,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'tritone_sub',
      cadenceName:    'Tritone sub',
      strength:       0.8,
    });

    const relatedIiRootPc = (context.scaleRootPc + 2) % 12;
    substitutions.push({
      targetRootPc:   relatedIiRootPc,
      targetSymbol:   'm7',
      targetQuality:  'm7',
      resolutionType: 'related_ii',
      cadenceName:    'Related ii7',
      strength:       0.7,
    });
  }

  // ── SUBDOMINANT — IV, ♭VI, ♭VII → moves to dominant, then resolves ───────
  if (harmonicFunction === 'subdominant') {
    const tonicRootPc = scaleRootPc;

    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'IV → V',
      strength:       0.8,
    });
    resolutions.push({
      targetRootPc:   tonicRootPc,
      targetSymbol:   'Maj7',
      targetQuality:  'major',
      resolutionType: 'plagal',
      cadenceName:    'IV → I',
      strength:       0.5,
    });
  }

  // ── PREDOMINANT — II, ii → moves to V, then to I ─────────────────────────
  if (harmonicFunction === 'predominant') {
    const tonicRootPc = scaleRootPc;

    resolutions.push({
      targetRootPc:   (tonicRootPc + 7) % 12,
      targetSymbol:   '7',
      targetQuality:  'dominant',
      resolutionType: 'to_dominant',
      cadenceName:    'ii → V',
      strength:       0.9,
    });
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
// A backtracking search minimises total semitone cost across all voices simultaneously.
//
// Design: the cost function IS the theory. Leading tones rise and sevenths fall
// not because rules say so, but because those moves have cost 1 — the minimum
// possible. No note names are detected anywhere in this section.

/**
 * Leap penalty added to raw semitone distance for any move larger than a major third (4 st).
 * A perfect fifth leap (7 st) costs 7 + 8 = 15 — more than five stepwise moves.
 * Bass leap penalty is halved to allow natural bass motion by fourth or fifth.
 *
 * @type {number}
 */
const LEAP_PENALTY = 8;

/**
 * Looks up the pitch-class interval array for a `CHORD_TYPES` symbol string.
 * Falls back to `[0,4,7]` (major triad) for unrecognised symbols — indicates
 * a programming error upstream if triggered.
 *
 * @param {string} targetSymbol - A `CHORD_TYPES` symbol string (e.g. `'Maj7'`, `'m7'`, `'7'`).
 * @returns {number[]} Pitch-class intervals mod 12, sorted ascending, deduplicated.
 */
function resolveTargetIntervals(targetSymbol) {
  return CHORD_SYMBOL_INTERVALS[targetSymbol] || [0, 4, 7];
}

/**
 * Enumerates every reachable MIDI note for each target pitch class within ±12 semitones
 * of the source range. Guarantees the nearest instance of every target PC is always
 * available to every source voice.
 *
 * @param {number} targetRootPc - Pitch class of the resolution target root (0–11).
 * @param {number[]} targetIntervals - Interval array from `resolveTargetIntervals()`.
 * @param {number[]} sourceMidi - MIDI note numbers of the sounding chord.
 * @returns {Array.<{ midi: number, pc: number, intervalIndex: number }>} Candidate notes.
 */
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

/**
 * Cost of moving a single voice by `delta` semitones.
 * Common tones are free; steps and thirds cost their distance; leaps incur a penalty.
 * Bass voice leap penalty is halved to permit natural bass motion by fourth or fifth.
 *
 * @param {number} delta - Absolute semitone distance of the move (0 = common tone).
 * @param {boolean} isBass - Whether this is the lowest source voice.
 * @returns {number} Non-negative cost value.
 */
function moveCost(delta, isBass) {
  if (delta === 0) return 0;
  if (delta <= 4)  return delta;
  return delta + (isBass ? LEAP_PENALTY / 2 : LEAP_PENALTY);
}

/**
 * Finds the globally optimal voice leading assignment from source notes to candidate
 * target notes via backtracking search with branch pruning.
 *
 * Constraints:
 * - No two voices may share the same MIDI note (no exact unison doubling).
 * - Total cost across all voices is minimised globally (not greedily per voice).
 *
 * Pruning: any branch whose partial cost meets or exceeds the current best is abandoned.
 * For N ≤ 7 voices, exhaustive search with pruning is trivially fast.
 *
 * @param {number[]} sourceMidi - MIDI note numbers of the sounding chord (sorted ascending).
 * @param {Array.<{ midi: number, pc: number, intervalIndex: number }>} candidates - From `generateCandidates()`.
 * @returns {Array.<{ fromMidi: number, toMidi: number }>} Optimal assignment, one entry per source voice.
 */
function assignByMinCost(sourceMidi, candidates) {
  const sorted = [...sourceMidi].sort((a, b) => a - b);
  const n      = sorted.length;

  let bestAssignment = null;
  let bestTotalCost  = Infinity;

  function search(voiceIdx, assignment, usedMidi, currentCost) {
    if (currentCost >= bestTotalCost) return;

    if (voiceIdx === n) {
      bestTotalCost  = currentCost;
      bestAssignment = assignment.slice();
      return;
    }

    const src    = sorted[voiceIdx];
    const isBass = voiceIdx === 0;

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

/**
 * Post-processes a voice leading assignment to eliminate voice crossings where doing
 * so strictly reduces total cost. Uses strict `<` in the swap guard to guarantee
 * termination — each accepted swap strictly reduces total cost, so the loop converges
 * in at most O(N²) passes with no risk of cycling.
 *
 * @param {Array.<{ fromMidi: number, toMidi: number }>} assignments - Sorted by `fromMidi` ascending.
 * @returns {Array.<{ fromMidi: number, toMidi: number }>} The same array with crossings resolved in-place.
 */
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
        const isBassB = false;
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

/**
 * Converts final voice leading assignments into the UI move objects consumed by `breakdown.js`.
 *
 * @param {Array.<{ fromMidi: number, toMidi: number }>} assignments - Final optimised assignments.
 * @returns {Array.<{
 *   fromMidi: number,
 *   toMidi: number,
 *   fromPc: number,
 *   toPc: number,
 *   semitones: number,
 *   direction: 'up'|'down'|'none',
 *   reason: 'common_tone'|'stepwise'
 * }>} Move objects ready for UI rendering.
 */
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

/**
 * Orchestrates the five-stage voice leading pipeline for a single resolution target.
 *
 * Stages:
 *   1. Resolve target intervals from `CHORD_SYMBOL_INTERVALS`
 *   2. Generate all reachable candidate MIDI notes within ±12 of the source range
 *   3. Global minimum-cost assignment via backtracking search
 *   4. Voice crossing repair
 *   5. Build UI move objects
 *
 * @param {number[]} sourceMidi - MIDI note numbers of the sounding chord.
 * @param {number} targetRootPc - Pitch class of the resolution target root (0–11).
 * @param {string} targetSymbol - `CHORD_TYPES` symbol string (e.g. `'Maj7'`, `'m7'`, `'7'`).
 * @param {Object} context - Context object (accepted for signature compatibility; not used internally).
 * @returns {Array.<{
 *   fromMidi: number,
 *   toMidi: number,
 *   fromPc: number,
 *   toPc: number,
 *   semitones: number,
 *   direction: 'up'|'down'|'none',
 *   reason: 'common_tone'|'stepwise'
 * }>} Voice leading move objects.
 */
function computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, context) {
  const targetIntervals = resolveTargetIntervals(targetSymbol);
  const candidates      = generateCandidates(targetRootPc, targetIntervals, sourceMidi);
  const raw             = assignByMinCost(sourceMidi, candidates);
  const repaired        = repairVoiceCrossing(raw);
  return buildMoves(repaired);
}


// ─── 7. PUBLIC API ───────────────────────────────────────────────────────────

/**
 * Main entry point for the voice leading engine. Given a chord's root, pitch classes,
 * interval pattern, sounding MIDI notes, and family, returns the full harmonic analysis:
 * all diatonic contexts, resolution targets per context, and pre-computed voice leading.
 *
 * Voice leading is pre-computed for every entry in `ctx.resolutions` and `ctx.departures`.
 * Substitutions carry no voice leading — they are chord alternatives, not resolution targets.
 *
 * @param {number} chordRootPc - Chord root pitch class (0–11).
 * @param {number[]|Set.<number>} chordPitchClasses - All pitch classes in the chord.
 * @param {number[]} chordIntervals - Raw intervals from the `CHORD_TYPES` entry (e.g. `[0,4,7,10]`).
 * @param {number[]} sourceMidi - MIDI note numbers currently sounding.
 * @param {string} chordFamily - Family string from `CHORD_TYPES` (e.g. `'major'`, `'dominant'`).
 * @returns {{
 *   contexts: Array.<{
 *     scaleSymbol: string,
 *     scaleName: string,
 *     scaleGroup: string,
 *     scaleRootPc: number,
 *     degSemitones: number,
 *     roman: string,
 *     harmonicFunction: string,
 *     tension: number,
 *     matchQuality: number,
 *     resolutions: Array.<Object>,
 *     departures: Array.<Object>,
 *     substitutions: Array.<Object>
 *   }>,
 *   isAmbiguous: boolean
 * }}
 */
function analyseChord(chordRootPc, chordPitchClasses, chordIntervals, sourceMidi, chordFamily) {
  const isAmbiguous = AMBIGUOUS_FAMILIES.has(chordFamily);

  const contexts = findDiatonicContexts(chordRootPc, chordPitchClasses, chordIntervals);

  for (const ctx of contexts) {
    const derived = deriveResolutionTargets(ctx, chordRootPc);

    ctx.resolutions   = derived.resolutions;
    ctx.departures    = derived.departures;
    ctx.substitutions = derived.substitutions;

    if (sourceMidi && sourceMidi.length) {
      for (const res of ctx.resolutions) {
        res.voiceLeading = computeVoiceLeadingRules(
          sourceMidi, res.targetRootPc, res.targetSymbol, ctx
        );
      }
      for (const dep of ctx.departures) {
        dep.voiceLeading = computeVoiceLeadingRules(
          sourceMidi, dep.targetRootPc, dep.targetSymbol, ctx
        );
      }
      // Substitutions do not get voice leading — they are not resolution targets.
    }
  }

  return { contexts, isAmbiguous };
}

// =============================================================================
// The Sound Travels Ear Training — js/engine/voiceLeading.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
