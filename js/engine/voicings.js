/**
 * @file voicings.js
 * @description Voicing system for Chords mode. Owns the complete voicing data table
 * (`VOICING_MODES`, 62 voicings across 6 groups) and all voicing algorithms.
 * `applyVoicing()` is the main dispatcher that transforms a chord's base intervals
 * into a concrete MIDI note array for a given voicing style. `resolveVoicingMode()`
 * picks one concrete mode for a question from the user's selection or active setting.
 *
 * Responsibilities:
 *   - `VOICING_MODES`        — data table for all 62 voicings across 6 groups
 *   - `applyVoicing()`       — main dispatcher; returns a sorted MIDI note array
 *   - `resolveVoicingMode()` — picks one concrete mode from selectedVoicings or activeVoicingMode
 *
 * Out of scope for this file:
 *   - Voicing chip rendering → `js/ui/pool.js` (`renderChordPoolPanel`)
 *   - Per-question resolved state (`currentVoicingMode`) → `js/engine/helpers.js`
 *   - User selection state (`activeVoicingMode`, `selectedVoicings`) → `js/engine/state.js`
 *
 * Load order: after `helpers.js`, before `audio.js`.
 *
 * @module voicings
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */


// ─── Voicing data table ───────────────────────────────────────────────────────

/**
 * Complete catalogue of all voicing modes available in the app.
 * 62 entries across 6 groups.
 *
 * Each entry:
 * @typedef  {Object} VoicingMode
 * @property {string} group  - Group key: `'position'` | `'doubling'` | `'shell'` |
 *                             `'drop'` | `'intervallic'` | `'style'`
 * @property {string} name   - Human-readable display name shown in UI chips.
 * @property {string} symbol - Unique identifier used as the key throughout the app.
 *                             Never `'random'` — that is a UI meta-value only.
 * @property {string} desc   - One-line description shown in chip tooltips.
 */
const VOICING_MODES = [

  // ── Group 1 — Position / Spacing ────────────────────────────────────────────
  { group: 'position',   name: 'Close',                symbol: 'close',           desc: 'All notes stacked within one octave from the root — the default baseline' },
  { group: 'position',   name: 'Open',                 symbol: 'open',            desc: 'Alternate voices raised one octave — wider, more spacious sound' },
  { group: 'position',   name: 'Spread',               symbol: 'spread',          desc: 'Root in bass (oct 2–3), upper notes spread across oct 4–5' },

  // ── Group 2 — Doubling ───────────────────────────────────────────────────────
  { group: 'doubling',   name: 'Root Octave Double',   symbol: 'dbl_root_oct',    desc: 'Root doubled one octave lower in bass: 1–1–3–5 (classical/arranging)' },
  { group: 'doubling',   name: 'Root Above Fifth',     symbol: 'dbl_root_above5', desc: 'Root doubled above the fifth: 1–5–1–3 (classical/arranging)' },
  { group: 'doubling',   name: 'Fifth Double',         symbol: 'dbl_fifth',       desc: 'Fifth doubled at the top: 1–5–3–5 (classical/arranging)' },
  { group: 'doubling',   name: 'Root Top and Bottom',  symbol: 'dbl_root_wrap',   desc: 'Root doubled at top and bottom, chord tones inside: 1–3–5–1 (classical/arranging)' },

  // ── Group 3 — Shell / Rootless ───────────────────────────────────────────────
  { group: 'shell',      name: 'Shell',                symbol: 'shell',           desc: 'Root + 3rd + 7th — the essential identifying tones (Berklee / Levine)' },
  { group: 'shell',      name: 'Shell Alt',            symbol: 'shell_alt',       desc: 'Root + 7th + 3rd — shell with 7th voiced below the 3rd' },
  { group: 'shell',      name: 'Rootless Shell',       symbol: 'shell_rootless',  desc: '3rd + 7th only — the guide tones without root; works over bass player' },
  { group: 'shell',      name: 'Three-note Maj 1–3–5', symbol: 'tn_maj_135',      desc: 'Major triad in three-note close position (Levine three-note voicings)' },
  { group: 'shell',      name: 'Three-note Maj 3–5–7', symbol: 'tn_maj_357',      desc: 'Major: 3rd + 5th + 7th — upper three voices of close maj7' },
  { group: 'shell',      name: 'Three-note Maj 1–3–7', symbol: 'tn_maj_137',      desc: 'Major: root + 3rd + 7th — omits 5th (Levine three-note voicings)' },
  { group: 'shell',      name: 'Three-note Dom 1–3–b7',symbol: 'tn_dom_13b7',     desc: 'Dominant: root + 3rd + b7 — the defining dominant tritone with root' },
  { group: 'shell',      name: 'Three-note Dom 3–5–b7',symbol: 'tn_dom_35b7',     desc: 'Dominant: 3rd + 5th + b7 — upper three voices' },
  { group: 'shell',      name: 'Three-note Dom 3–b7–9',symbol: 'tn_dom_3b79',     desc: 'Dominant rootless: 3rd + b7 + 9th — adds 9th colour without root' },
  { group: 'shell',      name: 'Three-note Min 1–b3–b7',symbol:'tn_min_1b3b7',    desc: 'Minor: root + b3rd + b7th — the essential minor 7 tones' },
  { group: 'shell',      name: 'Three-note Min b3–5–b7',symbol:'tn_min_b35b7',    desc: 'Minor: b3rd + 5th + b7 — upper three voices of min7' },
  { group: 'shell',      name: 'Three-note Min b3–b7–9',symbol:'tn_min_b3b79',    desc: 'Minor rootless: b3rd + b7 + 9th — adds 9th without root' },
  { group: 'shell',      name: 'Rootless Maj7',        symbol: 'rl_maj7',         desc: '3–5–7–9: Bill Evans Form A — the canonical jazz rootless maj7 (Levine)' },
  { group: 'shell',      name: 'Rootless Maj7 Ext.',   symbol: 'rl_maj7_ext',     desc: '3–5–7–9–13: rootless maj7 with 13th added for colour' },
  { group: 'shell',      name: 'Rootless Min7',        symbol: 'rl_min7',         desc: 'b3–5–b7–9: rootless minor 9th — standard jazz left-hand voicing' },
  { group: 'shell',      name: 'Rootless Dom7',        symbol: 'rl_dom7',         desc: '3–b7–9–13: rootless dominant 13th — V chord comp voicing (Levine)' },
  { group: 'shell',      name: 'Rootless Altered A',   symbol: 'rl_alt_a',        desc: '3–b7–b9–#9: both altered 9ths — maximum tension altered dominant' },
  { group: 'shell',      name: 'Rootless Altered B',   symbol: 'rl_alt_b',        desc: '3–b7–#9–b13: #9 + b13 — common altered dominant colour' },
  { group: 'shell',      name: 'Rootless Altered C',   symbol: 'rl_alt_c',        desc: '3–b7–b5–b9: tritone sub flavour — b5 + b9 altered dominant' },
  { group: 'shell',      name: 'Rootless Altered D',   symbol: 'rl_alt_d',        desc: '3–b7–b9–Ab spelling: concrete altered dominant (Levine)' },
  { group: 'shell',      name: 'Rootless #9',          symbol: 'rl_sharp9',       desc: '3–b7–#9: Hendrix voicing — just the #9 on a dominant' },
  { group: 'shell',      name: 'Sus Voicing',          symbol: 'sus_voicing',     desc: '1–4–b7–9: the full sus voicing including 9th (Levine)' },
  { group: 'shell',      name: 'Phrygian Voicing',     symbol: 'phrygian',        desc: '1–b2–5–b7: Phrygian dominant — dark, Spanish flavour (Levine)' },
  { group: 'shell',      name: 'Major 6',              symbol: 'sixth_maj',       desc: '1–3–5–6: major sixth chord voicing' },
  { group: 'shell',      name: 'Minor 6',              symbol: 'sixth_min',       desc: '1–b3–5–6: minor sixth chord voicing' },
  { group: 'shell',      name: '6/9',                  symbol: 'sixth_nine',      desc: '1–3–5–6–9: the 6/9 chord — no 7th; lush, open sound' },
  { group: 'shell',      name: 'Rootless 6/9',         symbol: 'rl_sixth_nine',   desc: '3–5–6–9: rootless 6/9 upper structure' },

  // ── Group 4 — Drop Voicings ──────────────────────────────────────────────────
  { group: 'drop',       name: 'Drop-2',               symbol: 'drop2',           desc: 'Second-highest voice of close position dropped one octave (arranging standard)' },
  { group: 'drop',       name: 'Drop-3',               symbol: 'drop3',           desc: 'Third-highest voice dropped one octave' },
  { group: 'drop',       name: 'Drop-2&4',             symbol: 'drop24',          desc: 'Second and fourth voices from top dropped one octave; falls back to Drop-2 for triads' },
  { group: 'drop',       name: 'Drop-2&3',             symbol: 'drop23',          desc: 'Second and third voices from top dropped one octave' },

  // ── Group 5 — Intervallic ────────────────────────────────────────────────────
  //
  // Design principles (Levine / Persichetti / jazz practice):
  // - Intervallic voicings stack a single interval type freely — non-chord tones
  //   are intentional. The ambiguity IS the sound; do not constrain to chord tones.
  // - Note count: triads (3 notes) → 4 stacked notes; all other chords → 5 notes.
  //   (Standard quartal voicing is 5 notes; matching the chord's own note count is wrong.)
  // - Register: start in bass register (MIDI 36–59); clamp within 2 octaves (bass + 24).
  // - `cluster_modal` removed — not a distinct category from `cluster_diaton` (Persichetti).
  // - `secundal` redefined as diatonic-step stacking (m2/M2 mix);
  //   `cluster_wt` is pure M2 (whole-tone). The two are acoustically distinct.
  { group: 'intervallic',name: 'Quartal',              symbol: 'quartal',         desc: 'Stacked perfect fourths from bass — 5 notes (4 for triads); modal jazz staple (Levine)' },
  { group: 'intervallic',name: 'Quintal',              symbol: 'quintal',         desc: 'Stacked perfect fifths from bass — 5 notes (4 for triads); clamped to 2-octave range' },
  { group: 'intervallic',name: 'Secundal',             symbol: 'secundal',        desc: 'Diatonic-step stacking (m2/M2 mix) — softer secundal cluster (Persichetti)' },
  { group: 'intervallic',name: 'Cluster Chromatic',    symbol: 'cluster_chrom',   desc: 'Stacked semitones — maximum chromatic density (Persichetti/Hindemith)' },
  { group: 'intervallic',name: 'Cluster Diatonic',     symbol: 'cluster_diaton',  desc: 'Adjacent diatonic scale steps — less abrasive cluster texture' },
  { group: 'intervallic',name: 'Cluster Pentatonic',   symbol: 'cluster_pent',    desc: 'Stacked pentatonic steps — open, percussive cluster (McCoy Tyner influence)' },
  { group: 'intervallic',name: 'Cluster Whole-tone',   symbol: 'cluster_wt',      desc: 'Stacked whole tones (pure M2) — whole-tone collection; Debussy/impressionist flavour' },

  // ── Group 6 — Style ──────────────────────────────────────────────────────────
  { group: 'style',      name: 'So What',              symbol: 'so_what',         desc: 'Fixed shape P4+P4+P4+M3 — Miles Davis / Kind of Blue (Levine)' },
  { group: 'style',      name: 'Bill Evans A',         symbol: 'evans_a',         desc: '3–5–7–9 in LH register — rootless form A (The Jazz Piano Book)' },
  { group: 'style',      name: 'Bill Evans B',         symbol: 'evans_b',         desc: '7–9–3–5 — rootless form B, inversion of form A (The Jazz Piano Book)' },
  { group: 'style',      name: 'Kenny Barron',         symbol: 'kenny_barron',    desc: 'LH: root + 7th. RH: 3rd + 5th + 9th — signature two-hand spread' },
  { group: 'style',      name: 'McCoy Tyner',          symbol: 'mccoy_tyner',     desc: 'LH: stacked quartal. RH: upper quartal cluster — pentatonic quartal texture' },
  { group: 'style',      name: 'Pop Piano',            symbol: 'pop_piano',       desc: 'LH: root octave (oct 2–3). RH: 3rd + 5th + 9th close (oct 4–5)' },
  { group: 'style',      name: 'Gospel',               symbol: 'gospel',          desc: 'Close voicing with added 9th; extensions stacked tightly in upper register' },
  { group: 'style',      name: 'Octave Bass + Triad',  symbol: 'oct_bass_triad',  desc: 'LH: root octave. RH: triad only — pop/R&B keyboard staple' },
  { group: 'style',      name: 'Octave Bass + 7th',    symbol: 'oct_bass_7th',    desc: 'LH: root octave. RH: full seventh chord close' },
  { group: 'style',      name: 'Open Fifth + Triad',   symbol: 'open5_triad',     desc: 'LH: root + 5th (power chord). RH: triad — open, contemporary sound' },
  { group: 'style',      name: 'Block Chord Close',    symbol: 'block_close',     desc: 'Melody on top, close-position chord tones harmonised below (jazz arranging)' },
  { group: 'style',      name: 'Locked Hands',         symbol: 'block_locked',    desc: 'Melody doubled one octave lower, inner chord tones between — Milt Buckner style' },
  { group: 'style',      name: 'Four-way Close',       symbol: 'four_way_close',  desc: 'Four voices in close position, melody on top, inner voices fill chord tones' },
  { group: 'style',      name: 'Block Drop-2',         symbol: 'block_drop2',     desc: 'Drop-2 applied to harmonised melody — second voice dropped one octave' },
  { group: 'style',      name: 'Octave Melody + Inner',symbol: 'oct_melody_inner',desc: 'Melody doubled at the octave; chord tones fill the space between' },
  { group: 'style',      name: 'Pedal Point',          symbol: 'pedal_point',     desc: 'Root held as bass pedal; upper voices voiced close above' },
  { group: 'style',      name: 'Two-handed Spread',    symbol: 'spread_2h',       desc: 'LH: root + 5th wide apart. RH: upper extensions close — broader than Spread' },
];

/**
 * All concrete voicing symbols derived from `VOICING_MODES`.
 * Excludes the UI meta-value `'random'`, which is never passed to `applyVoicing()`.
 * Used by `resolveVoicingMode()` when picking randomly in Dictionary mode.
 *
 * @type {string[]}
 */
const CONCRETE_VOICING_SYMBOLS = VOICING_MODES.map(v => v.symbol);


// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Classifies each interval in a chord's base interval array by its harmonic role.
 * Used internally to select notes by function (root, third, fifth, etc.) rather
 * than by raw semitone value, so voicing algorithms work correctly across
 * different chord qualities without hard-coding interval numbers.
 *
 * Role assignments:
 * - `'root'`      — 0 semitones
 * - `'third'`     — 3 or 4 semitones (minor or major 3rd)
 * - `'fifth'`     — 7 semitones (perfect 5th)
 * - `'altfifth'`  — 6 or 8 semitones (diminished or augmented 5th)
 * - `'seventh'`   — 10 or 11 semitones (minor or major 7th)
 * - `'extension'` — everything else (9ths, 11ths, 13ths, etc.)
 *
 * @param {number[]} baseIntervals - Semitone intervals from root (root = 0 always present).
 * @returns {string[]} Role label for each interval, in the same order as the input.
 */
function _voicingRoles(baseIntervals) {
  return baseIntervals.map(i => {
    const s = ((i % 12) + 12) % 12;
    if (s === 0)               return 'root';
    if (s === 3 || s === 4)   return 'third';
    if (s === 7)              return 'fifth';
    if (s === 6 || s === 8)  return 'altfifth'; // diminished or augmented 5th
    if (s === 10 || s === 11) return 'seventh';
    return 'extension'; // 9ths, 11ths, 13ths
  });
}

/**
 * Extracts MIDI notes matching specific harmonic roles from a chord's base intervals.
 *
 * @param {number} rootMidi - MIDI number of the chord root.
 * @param {number[]} baseIntervals - Semitone intervals from root.
 * @param {string[]} roles - Role labels to include, e.g. `['root', 'third', 'seventh']`.
 * @returns {number[]} MIDI notes for the matching intervals (unsorted).
 */
function _notesByRole(rootMidi, baseIntervals, roles) {
  const r = _voicingRoles(baseIntervals);
  return baseIntervals
    .filter((_, i) => roles.includes(r[i]))
    .map(i => rootMidi + i);
}

/**
 * Returns the pitch class of a MIDI note as a semitone interval from a root.
 *
 * @param {number} midi - MIDI note number.
 * @param {number} rootMidi - MIDI number of the root.
 * @returns {number} Interval in semitones (0–11).
 */
function _pc(midi, rootMidi) { return ((midi - rootMidi) % 12 + 12) % 12; }

/**
 * Clamps a MIDI note into a target octave range by transposing up or down by
 * octaves until the note falls within `[loMidi, hiMidi]`.
 *
 * @param {number} midi - MIDI note number to clamp.
 * @param {number} loMidi - Lower bound (inclusive).
 * @param {number} hiMidi - Upper bound (inclusive).
 * @returns {number} Clamped MIDI note number.
 */
function _clampToRange(midi, loMidi, hiMidi) {
  while (midi < loMidi)  midi += 12;
  while (midi > hiMidi)  midi -= 12;
  return midi;
}

/**
 * Builds a MIDI note from a semitone offset relative to `rootMidi`, clamped
 * to a 2-octave window starting at `targetLoMidi`.
 *
 * @param {number} rootMidi - MIDI number of the chord root.
 * @param {number} semitones - Interval in semitones above the root.
 * @param {number} targetLoMidi - Lower bound of the target register.
 * @returns {number} MIDI note number within `[targetLoMidi, targetLoMidi + 23]`.
 */
function _noteFromInterval(rootMidi, semitones, targetLoMidi) {
  const base = rootMidi + semitones;
  return _clampToRange(base, targetLoMidi, targetLoMidi + 23);
}

/**
 * Builds an array of `n` notes stacked in perfect fourths (5 semitones each)
 * from a starting MIDI note. Used by `quartal` and `mccoy_tyner` voicings.
 *
 * @param {number} startMidi - Lowest note of the stack.
 * @param {number} n - Number of notes to stack.
 * @returns {number[]} MIDI note array (ascending).
 */
function _stackFourths(startMidi, n) {
  const notes = [];
  for (let i = 0; i < n; i++) notes.push(startMidi + i * 5);
  return notes;
}

/**
 * Builds an array of `n` notes stacked in perfect fifths (7 semitones each)
 * from a starting MIDI note. Used by `quintal` voicing.
 *
 * @param {number} startMidi - Lowest note of the stack.
 * @param {number} n - Number of notes to stack.
 * @returns {number[]} MIDI note array (ascending).
 */
function _stackFifths(startMidi, n) {
  const notes = [];
  for (let i = 0; i < n; i++) notes.push(startMidi + i * 7);
  return notes;
}

/**
 * Diatonic major scale steps in semitones, used by `secundal` and `cluster_diaton`
 * voicings to produce diatonic-step stacking patterns.
 * @type {number[]}
 */
const DIATONIC_STEPS = [0, 2, 4, 5, 7, 9, 11];

/**
 * Major pentatonic steps in semitones, used by `cluster_pent` voicing.
 * @type {number[]}
 */
const PENTATONIC_STEPS = [0, 2, 4, 7, 9];


// ─── Main dispatcher ──────────────────────────────────────────────────────────

/**
 * Transforms a chord's root and base intervals into a concrete MIDI note array
 * using the specified voicing algorithm.
 *
 * This is the single entry point for all voicing computation. Every voicing mode
 * in `VOICING_MODES` has a corresponding case here. The function is also called
 * recursively by some cases that fall back to simpler modes (e.g. shell voicings
 * fall back to `'close'` for triads that have no 7th).
 *
 * @param {number} rootMidi - MIDI number of the chord root.
 * @param {number[]} baseIntervals - Semitone intervals from root (root = 0 always present).
 * @param {string} mode - Voicing symbol string (already resolved; never `'random'`).
 * @returns {number[]} Sorted MIDI note array (ascending pitch). Never empty —
 *   falls back to close position on any error or unrecognised mode.
 */
function applyVoicing(rootMidi, baseIntervals, mode) {
  if (!baseIntervals || !baseIntervals.length) return [rootMidi];

  try {
    switch (mode) {

      // ── Group 1: Position / Spacing ───────────────────────────────────────

      case 'close': {
        // All notes stacked within one octave from the root — the baseline voicing.
        return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'open': {
        // Every other voice (index 1, 3, 5…) raised one octave, creating a wider spread.
        const notes = baseIntervals.map((interval, idx) =>
          idx % 2 === 1 ? rootMidi + interval + 12 : rootMidi + interval
        );
        return notes.sort((a, b) => a - b);
      }

      case 'spread': {
        // Root stays in bass (oct 2–3 = MIDI 36–59).
        // Upper notes spread across oct 4–5 (MIDI 60–83), distributed in two tiers.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const upper = baseIntervals.slice(1);
        const upperNotes = upper.map((interval, idx) => {
          const pc = ((rootMidi + interval) % 12 + 12) % 12;
          // Lower half of upper voices at oct 4; upper half at oct 5
          let note = 60 + pc + (idx >= Math.ceil(upper.length / 2) ? 12 : 0);
          if (note > 83) note -= 12;
          return note;
        });

        return [bass, ...upperNotes].sort((a, b) => a - b);
      }

      // ── Group 2: Doubling ─────────────────────────────────────────────────

      case 'dbl_root_oct': {
        // 1–1–3–5: root doubled one octave below the close voicing.
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const rootBelow = close[0] - 12;
        return [rootBelow, ...close].sort((a, b) => a - b);
      }

      case 'dbl_root_above5': {
        // 1–5–1–3: root, fifth, root one octave up, third on top.
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        return [
          rootMidi + rootI,
          rootMidi + fifthI,
          rootMidi + rootI + 12,
          rootMidi + thirdI + 12,
        ].sort((a, b) => a - b);
      }

      case 'dbl_fifth': {
        // 1–5–3–5: root, fifth, third, fifth doubled one octave higher.
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        return [
          rootMidi + rootI,
          rootMidi + fifthI,
          rootMidi + thirdI + 12,
          rootMidi + fifthI + 12,
        ].sort((a, b) => a - b);
      }

      case 'dbl_root_wrap': {
        // 1–3–5–1: root at bottom and top, chord tones inside.
        // The root-above calculation finds the next root above the highest note.
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const rootTop = close[close.length - 1];
        const rootAbove = rootTop + (12 - (rootTop - close[0]) % 12) % 12;
        return [...close, rootAbove === rootTop ? rootTop + 12 : rootAbove]
          .sort((a, b) => a - b);
      }

      // ── Group 3: Shell / Rootless ─────────────────────────────────────────

      case 'shell': {
        // Root + 3rd + 7th — the essential guide-tone subset (Berklee / Levine).
        // Falls back to close for triads, which have no 7th.
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'seventh'].includes(roles[i])
        );
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'shell_alt': {
        // Root + 7th + 3rd — 7th voiced below the 3rd.
        // If the 7th interval is lower than the 3rd, the 3rd is raised an octave
        // to ensure 7th sits below 3rd in the voicing.
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        const seventhMidi = rootMidi + sevI;
        const thirdMidi = seventhMidi < rootMidi + thirdI
          ? rootMidi + thirdI
          : rootMidi + thirdI + 12;
        return [rootMidi + rootI, seventhMidi, thirdMidi].sort((a, b) => a - b);
      }

      case 'shell_rootless': {
        // 3rd + 7th only — the guide tones without the root.
        // Falls back to close for triads (no 7th).
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'seventh'].includes(roles[i])
        );
        return kept.length >= 2
          ? kept.map(i => rootMidi + i).sort((a, b) => a - b)
          : applyVoicing(rootMidi, baseIntervals, 'close');
      }

      case 'tn_maj_135': {
        // Three-note: 1–3–5. Uses the chord's actual root/third/fifth intervals.
        const roles = _voicingRoles(baseIntervals);
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'fifth', 'altfifth'].includes(roles[i])
        ).slice(0, 3);
        return (kept.length ? kept : baseIntervals.slice(0, 3))
          .map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_maj_357': {
        // Three-note: 3–5–7. Upper three voices of close maj7.
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_maj_137': {
        // Three-note: 1–3–7. Omits the 5th (Levine three-note voicings).
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_dom_13b7': {
        // Three-note dominant: 1–3–b7. The defining dominant tritone with root.
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + sevI]
          .sort((a, b) => a - b);
      }

      case 'tn_dom_35b7': {
        // Three-note dominant: 3–5–b7. Upper three voices.
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_dom_3b79': {
        // Three-note dominant rootless: 3–b7–9. Adds 9th colour without the root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const extI   = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + extI]
          .sort((a, b) => a - b);
      }

      case 'tn_min_1b3b7': {
        // Three-note minor: 1–b3–b7. The essential minor 7 tones with root.
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 3;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + sevI]
          .sort((a, b) => a - b);
      }

      case 'tn_min_b35b7': {
        // Three-note minor: b3–5–b7. Upper three voices of min7.
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_min_b3b79': {
        // Three-note minor rootless: b3–b7–9. Adds 9th colour without the root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 3;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const extI   = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + extI]
          .sort((a, b) => a - b);
      }

      case 'rl_maj7': {
        // Rootless maj7: 3–5–7–9 (Bill Evans Form A).
        // Uses the chord's actual intervals where available; defaults to canonical
        // maj7 intervals (4, 7, 11, 14) when the chord doesn't have extensions.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 11;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + sevI, rootMidi + ninthI]
          .sort((a, b) => a - b);
      }

      case 'rl_maj7_ext': {
        // Rootless maj7 extended: 3–5–7–9–13.
        // 9th = 14 semitones, 13th = 21 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')   ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 11;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        const exts   = baseIntervals.filter((_, i) => roles[i] === 'extension');
        const ninthI  = exts[0] ?? 14;
        const thirthI = exts[1] ?? 21;
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + sevI,
                rootMidi + ninthI, rootMidi + thirthI]
          .sort((a, b) => a - b);
      }

      case 'rl_min7': {
        // Rootless min7: b3–5–b7–9 (standard jazz left-hand minor voicing).
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 3;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + sevI, rootMidi + ninthI]
          .sort((a, b) => a - b);
      }

      case 'rl_dom7': {
        // Rootless dominant: 3–b7–9–13 (V chord comp voicing, Levine).
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        const exts    = baseIntervals.filter((_, i) => roles[i] === 'extension');
        const ninthI  = exts[0] ?? 14;
        const thirthI = exts[1] ?? 21;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + ninthI, rootMidi + thirthI]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_a': {
        // Rootless altered A: 3–b7–b9–#9. Both altered 9ths — maximum tension.
        // b9 = 13 semitones, #9 = 15 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 13, rootMidi + 15]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_b': {
        // Rootless altered B: 3–b7–#9–b13.
        // #9 = 15 semitones, b13 = 20 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 15, rootMidi + 20]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_c': {
        // Rootless altered C: 3–b7–b5–b9. Tritone sub flavour.
        // b5 = 6 semitones, b9 = 13 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 6, rootMidi + 13]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_d': {
        // Rootless altered D: 3–b7–b9–b13 (Levine concrete spelling: E–Bb–Db–Ab for C7alt).
        // b9 = 13 semitones, b13 = 20 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 13, rootMidi + 20]
          .sort((a, b) => a - b);
      }

      case 'rl_sharp9': {
        // Rootless #9: 3–b7–#9. The "Hendrix voicing" — just the #9 on a dominant.
        // #9 = 15 semitones above root.
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 15]
          .sort((a, b) => a - b);
      }

      case 'sus_voicing': {
        // Sus voicing: 1–4–b7–9. Full suspended voicing including 9th (Levine).
        // 4th = 5 semitones, b7 = 10, 9th = 14.
        // Uses the actual fourth from the chord if present (sus4); forces 5 semitones otherwise.
        const roles   = _voicingRoles(baseIntervals);
        const rootI   = baseIntervals.find((_, i) => roles[i] === 'root') ?? 0;
        const fourthI = baseIntervals.find(i => ((i % 12 + 12) % 12) === 5) ?? 5;
        const sevI    = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        const ninthI  = 14;
        return [rootMidi + rootI, rootMidi + fourthI, rootMidi + sevI, rootMidi + ninthI]
          .sort((a, b) => a - b);
      }

      case 'phrygian': {
        // Phrygian dominant voicing: 1–b2–5–b7 (1, 1 st, 7 st, 10 st).
        // Dark, Spanish flavour — characteristic of Phrygian dominant mode.
        return [rootMidi, rootMidi + 1, rootMidi + 7, rootMidi + 10]
          .sort((a, b) => a - b);
      }

      case 'sixth_maj': {
        // Major 6: 1–3–5–6. 6th = 9 semitones above root.
        const roles  = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9]
          .sort((a, b) => a - b);
      }

      case 'sixth_min': {
        // Minor 6: 1–b3–5–6. 6th = 9 semitones above root.
        const roles  = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 3;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9]
          .sort((a, b) => a - b);
      }

      case 'sixth_nine': {
        // 6/9 chord: 1–3–5–6–9. No 7th — lush, open sound.
        // 6th = 9 semitones, 9th = 14 semitones above root.
        const roles  = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI,
                rootMidi + 9, rootMidi + 14]
          .sort((a, b) => a - b);
      }

      case 'rl_sixth_nine': {
        // Rootless 6/9: 3–5–6–9. Upper structure of the 6/9 chord.
        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9, rootMidi + 14]
          .sort((a, b) => a - b);
      }

      // ── Group 4: Drop Voicings ────────────────────────────────────────────
      //
      // All drop voicings start from a sorted close-position array and lower
      // specific voices by one octave. Voice numbering is from the top: voice 1
      // is the highest note, voice 2 is the second-highest, and so on.

      case 'drop2': {
        // Drop-2: second-highest voice lowered one octave.
        // The most common arranging voicing — balanced, idiomatic for jazz piano and guitar.
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 2) return close;
        const result = [...close];
        result[result.length - 2] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop3': {
        // Drop-3: third-highest voice lowered one octave.
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 3) return close;
        const result = [...close];
        result[result.length - 3] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop24': {
        // Drop-2&4: second and fourth voices from the top lowered one octave.
        // Falls back to Drop-2 for triads (fewer than 4 voices).
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 4) return applyVoicing(rootMidi, baseIntervals, 'drop2');
        const result = [...close];
        result[result.length - 2] -= 12;
        result[result.length - 4] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop23': {
        // Drop-2&3: second and third voices from the top lowered one octave.
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 3) return close;
        const result = [...close];
        result[result.length - 2] -= 12;
        result[result.length - 3] -= 12;
        return result.sort((a, b) => a - b);
      }

      // ── Group 5: Intervallic ──────────────────────────────────────────────
      //
      // All intervallic voicings share these design principles:
      // - Notes are stacked freely — non-chord tones are intentional; the
      //   ambiguity IS the sound. Chord tones are not filtered.
      // - Note count: triads (3 base intervals) → 4 stacked notes;
      //   all other chords → 5 notes (standard jazz quartal/quintal practice).
      // - Register: bass note clamped to MIDI 36–59 (oct 2–3);
      //   all notes clamped within 2 octaves above bass (bass + 24).

      case 'quartal': {
        // Stacked perfect fourths (5 semitones each) — modal jazz staple.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) notes.push(bass + i * 5);
        return notes.filter(n => n <= bass + 24).sort((a, b) => a - b);
      }

      case 'quintal': {
        // Stacked perfect fifths (7 semitones each).
        // Fifths spread rapidly — the 2-octave clamp is enforced note-by-note;
        // if we get fewer notes than target due to clamping, the stack wraps down.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) {
          const note = bass + i * 7;
          if (note > bass + 24) break;
          notes.push(note);
        }
        // Ensure minimum 3 notes if clamping cut the stack short
        while (notes.length < Math.min(n, 3)) notes.push(notes[notes.length - 1] - 12);
        return notes.sort((a, b) => a - b);
      }

      case 'secundal': {
        // Diatonic-step stacking (m2/M2 mix from major scale) — softer secundal cluster.
        // Distinct from cluster_wt which uses pure whole tones (always M2).
        // Steps cycle through DIATONIC_STEPS with octave wrapping.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) {
          notes.push(bass + DIATONIC_STEPS[i % DIATONIC_STEPS.length]
            + Math.floor(i / DIATONIC_STEPS.length) * 12);
        }
        return notes.filter(note => note <= bass + 24).sort((a, b) => a - b);
      }

      case 'cluster_chrom': {
        // Stacked semitones (1 semitone each) — maximum chromatic density.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) notes.push(bass + i);
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_diaton': {
        // Adjacent diatonic major scale steps — less abrasive than chromatic cluster.
        // Steps cycle through DIATONIC_STEPS with octave wrapping.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) {
          notes.push(bass + DIATONIC_STEPS[i % DIATONIC_STEPS.length]
            + Math.floor(i / DIATONIC_STEPS.length) * 12);
        }
        return notes.filter(note => note <= bass + 24).sort((a, b) => a - b);
      }

      case 'cluster_pent': {
        // Stacked pentatonic steps — open, percussive cluster texture.
        // Steps cycle through PENTATONIC_STEPS with octave wrapping.
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) {
          notes.push(bass + PENTATONIC_STEPS[i % PENTATONIC_STEPS.length]
            + Math.floor(i / PENTATONIC_STEPS.length) * 12);
        }
        return notes.filter(note => note <= bass + 24).sort((a, b) => a - b);
      }

      case 'cluster_wt': {
        // Pure whole-tone stacking (always M2 = 2 semitones) — whole-tone scale character.
        // Distinct from secundal which uses diatonic steps (m2/M2 mix).
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;
        const n = baseIntervals.length <= 3 ? 4 : 5;
        const notes = [];
        for (let i = 0; i < n; i++) notes.push(bass + i * 2);
        return notes.filter(note => note <= bass + 24).sort((a, b) => a - b);
      }

      // ── Group 6: Style ────────────────────────────────────────────────────

      case 'so_what': {
        // Fixed interval shape: P4 + P4 + P4 + M3 from root — always 5 notes.
        // C–F–Bb–Eb–G (transposed to rootMidi). Named after the Miles Davis recording.
        return [0, 5, 10, 15, 19].map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'evans_a': {
        // Bill Evans Form A: 3–5–7–9, voiced in left-hand register (oct 3, C3 = MIDI 48).
        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 11;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        let base = rootMidi;
        while (base > 59) base -= 12;
        while (base < 48) base += 12; // target oct 3
        return [base + thirdI, base + fifthI, base + sevI, base + ninthI]
          .sort((a, b) => a - b);
      }

      case 'evans_b': {
        // Bill Evans Form B: 7–9–3–5 — inversion of Form A, 7th on the bottom.
        // The 3rd and 5th are raised above the 9th by successive octave shifts
        // to ensure the correct top-to-bottom ordering: 7–9–3–5.
        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 11;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        let base = rootMidi;
        while (base > 59) base -= 12;
        while (base < 48) base += 12;
        const sevMidi   = base + sevI;
        const ninthMidi = base + ninthI;
        let thirdMidi = base + thirdI;
        let fifthMidi = base + fifthI;
        while (thirdMidi <= ninthMidi) thirdMidi += 12;
        while (fifthMidi <= thirdMidi)  fifthMidi += 12;
        return [sevMidi, ninthMidi, thirdMidi, fifthMidi].sort((a, b) => a - b);
      }

      case 'kenny_barron': {
        // Kenny Barron voicing: LH root + 7th (oct 2–3), RH 3rd + 5th + 9th (oct 4–5).
        // Two-hand spread — LH and RH are placed in separate octave regions.
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;

        const lhSev   = _clampToRange(lhBase + sevI, lhBase, lhBase + 11);
        const rhBase  = 60; // C4
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);
        const rhNinth = _clampToRange(lhBase + ninthI, rhBase, rhBase + 23);

        return [lhBase, lhSev, rhThird, rhFifth, rhNinth].sort((a, b) => a - b);
      }

      case 'mccoy_tyner': {
        // McCoy Tyner voicing: LH = stacked quartal (3 fourths from bass register),
        // RH = upper quartal cluster (starting a P5+P4 above the bass).
        // RH note count scales with chord size (minimum 2 notes).
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const lhNotes = _stackFourths(lhBase, 3);
        // RH starts a compound fourth (P5 + P4 = 19 semitones) above the bass
        const rhStart = lhBase + 19;
        const rhNotes = _stackFourths(rhStart, Math.max(2, baseIntervals.length - 3));

        return [...lhNotes, ...rhNotes].sort((a, b) => a - b);
      }

      case 'pop_piano': {
        // Pop piano voicing: LH root octave (oct 2–3), RH 3rd + 5th + 9th (oct 4–5).
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        const ninthI = 14; // always add 9th regardless of chord type

        const rhBase  = 60;
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);
        const rhNinth = _clampToRange(lhBase + ninthI, rhBase, rhBase + 23);

        return [lhBase, lhBase + 12, rhThird, rhFifth, rhNinth].sort((a, b) => a - b);
      }

      case 'gospel': {
        // Close voicing with added 9th pushed into the upper register.
        // If the chord already has an extension, it is used; otherwise a 9th is appended.
        const roles  = _voicingRoles(baseIntervals);
        const hasExt = roles.includes('extension');
        let notes = baseIntervals.map(i => rootMidi + i);
        if (!hasExt) notes.push(rootMidi + 14); // add 9th
        return notes.sort((a, b) => a - b);
      }

      case 'oct_bass_triad': {
        // Octave bass + triad: LH root octave (oct 2–3), RH root/3rd/5th (oct 4–5).
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) =>
          roles[i] === 'fifth' || roles[i] === 'altfifth') ?? 7;

        const rhBase  = 60;
        const rhRoot  = _clampToRange(lhBase,          rhBase, rhBase + 23);
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);

        return [lhBase, lhBase + 12, rhRoot, rhThird, rhFifth].sort((a, b) => a - b);
      }

      case 'oct_bass_7th': {
        // Octave bass + 7th chord: LH root octave (oct 2–3), RH full chord close (oct 4–5).
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const rhBase  = 60;
        const rhNotes = baseIntervals.map(i =>
          _clampToRange(lhBase + i, rhBase, rhBase + 23)
        );

        return [lhBase, lhBase + 12, ...rhNotes].sort((a, b) => a - b);
      }

      case 'open5_triad': {
        // Open fifth + triad: LH root + 5th (power chord, oct 2–3), RH triad (oct 4–5).
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) =>
          roles[i] === 'fifth' || roles[i] === 'altfifth') ?? 7;

        const lhFifth = lhBase + fifthI;
        const rhBase  = 60;
        const rhRoot  = _clampToRange(lhBase,          rhBase, rhBase + 23);
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);

        return [lhBase, lhFifth, rhRoot, rhThird, rhFifth].sort((a, b) => a - b);
      }

      case 'block_close': {
        // Block chord close: melody (highest note) harmonised with close-position tones below.
        // Functionally equivalent to close position — melody is whichever note falls on top.
        return applyVoicing(rootMidi, baseIntervals, 'close');
      }

      case 'block_locked': {
        // Locked hands (Milt Buckner style): close voicing + melody doubled one octave lower.
        const close   = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const melody  = close[close.length - 1]; // highest note
        const doubled = melody - 12;
        return [...close, doubled].sort((a, b) => a - b);
      }

      case 'four_way_close': {
        // Four-way close: exactly 4 voices in close position, melody on top.
        // Takes the top 4 notes of the close voicing (or all if fewer than 4).
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const four  = close.length > 4 ? close.slice(close.length - 4) : close;
        return four.sort((a, b) => a - b);
      }

      case 'block_drop2': {
        // Block Drop-2: Drop-2 applied to a harmonised melody. Same algorithm as drop2.
        return applyVoicing(rootMidi, baseIntervals, 'drop2');
      }

      case 'oct_melody_inner': {
        // Octave melody + inner voices: melody doubled at the octave above;
        // all other notes shifted to fill the space between the two melody octaves.
        const close    = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const melody   = close[close.length - 1];
        const melodyUp = melody + 12;
        // Inner voices: everything below the melody, clamped between melody and melodyUp
        const inner = close.slice(0, -1).map(n => {
          while (n < melody)   n += 12;
          while (n > melodyUp) n -= 12;
          return n;
        });
        return [melody, ...inner, melodyUp].sort((a, b) => a - b);
      }

      case 'pedal_point': {
        // Pedal point: root sustained as bass (oct 2–3); upper voices close-voiced
        // one octave above in a 2-octave window starting at C4 (MIDI 60).
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const rhBase  = 60;
        const rhNotes = baseIntervals.map(i =>
          _clampToRange(bass + i, rhBase, rhBase + 23)
        );

        return [bass, ...rhNotes].sort((a, b) => a - b);
      }

      case 'spread_2h': {
        // Two-handed spread: LH root + 5th (wide, oct 2–3), RH upper colour tones (oct 4–5).
        // Broader than the basic 'spread' voicing — LH is wider, RH carries extensions.
        // RH falls back to all non-root intervals if no colour tones are found.
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const fifthI = baseIntervals.find((_, i) =>
          roles[i] === 'fifth' || roles[i] === 'altfifth') ?? 7;

        const lhFifth = lhBase + fifthI;
        const rhBase  = 60;
        // RH: extensions and colour tones — everything that isn't root or fifth
        const rhIntervals = baseIntervals.filter((_, i) =>
          !['root', 'fifth', 'altfifth'].includes(roles[i])
        );
        const rhNotes = rhIntervals.length
          ? rhIntervals.map(i => _clampToRange(lhBase + i, rhBase, rhBase + 23))
          : baseIntervals.slice(1).map(i => _clampToRange(lhBase + i, rhBase, rhBase + 23));

        return [lhBase, lhFifth, ...rhNotes].sort((a, b) => a - b);
      }

      default:
        // Unrecognised mode — fall back to close position.
        return applyVoicing(rootMidi, baseIntervals, 'close');
    }
  } catch (e) {
    console.warn('applyVoicing error for mode', mode, e);
    return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
  }
}


// ─── Resolve voicing mode for a question ─────────────────────────────────────

/**
 * Picks one concrete voicing symbol for the current question.
 *
 * Resolution rules:
 * - **Quiz mode:** picks randomly from `selectedVoicings` (the user's chip selection),
 *   filtering out `'random'` and, in Basic mode, any advanced voicing symbols.
 *   Falls back to `'close'` if the filtered pool is empty.
 * - **Dictionary mode with `activeVoicingMode === 'random'`:** picks randomly from
 *   all concrete symbols (Basic mode: position + doubling groups only;
 *   Advanced mode: all 62 symbols).
 * - **Dictionary mode with a concrete `activeVoicingMode`:** returns it directly
 *   (single-select chip; already concrete).
 *
 * Basic mode voicing symbols are limited to position and doubling groups.
 * Advanced voicings (shell, drop, intervallic, style) are only available when
 * `appDifficulty === 'advanced'`.
 *
 * @returns {string} A concrete voicing symbol, never `'random'`.
 */
function resolveVoicingMode() {
  // Position + Doubling groups only — the Basic mode voicing set.
  const basicVoicingSymbols = ['close','open','spread','dbl_root_oct','dbl_root_above5','dbl_fifth','dbl_root_wrap'];

  if (appMode === 'quiz') {
    let pool = [...selectedVoicings].filter(s => s !== 'random');
    // In Basic mode, strip any advanced voicings that may linger in the selection set
    if (appDifficulty === 'basic') pool = pool.filter(s => basicVoicingSymbols.includes(s));
    if (!pool.length) return 'close';
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (activeVoicingMode === 'random') {
    const concretePool = appDifficulty === 'basic'
      ? basicVoicingSymbols
      : CONCRETE_VOICING_SYMBOLS;
    return concretePool[Math.floor(Math.random() * concretePool.length)];
  }
  return activeVoicingMode;
}

// =============================================================================
// The Sound Travels Ear Training — js/engine/voicings.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
