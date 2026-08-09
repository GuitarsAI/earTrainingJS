// ─── POINT 41/46: Voicing system ─────────────────────────────────────────────
//
// This file owns all voicing logic for Chords mode:
//   VOICING_MODES        — data table for all 63 voicings across 6 groups
//   applyVoicing()       — main dispatcher, returns MIDI note array
//   resolveVoicingMode() — picks one concrete mode from selectedVoicings or activeVoicingMode
//
// Rendering of voicing chips lives in js/ui/pool.js (renderChordPoolPanel).
// Per-question resolved state (currentVoicingMode) lives in js/engine/helpers.js.
// User selection state (activeVoicingMode, selectedVoicings) lives in js/engine/state.js.
//
// Load order: after helpers.js, before audio.js.

// ─── Voicing data table ───────────────────────────────────────────────────────

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
  { group: 'intervallic',name: 'Quartal',              symbol: 'quartal',         desc: 'Stacked perfect fourths (5 semitones) from root — modal jazz staple (Levine)' },
  { group: 'intervallic',name: 'Quintal',              symbol: 'quintal',         desc: 'Stacked perfect fifths (7 semitones) from root' },
  { group: 'intervallic',name: 'Secundal',             symbol: 'secundal',        desc: 'Stacked major seconds (2 semitones) — whole-tone cluster character (Persichetti)' },
  { group: 'intervallic',name: 'Cluster Chromatic',    symbol: 'cluster_chrom',   desc: 'Stacked semitones — maximum chromatic density (Persichetti/Hindemith)' },
  { group: 'intervallic',name: 'Cluster Diatonic',     symbol: 'cluster_diaton',  desc: 'Stacked diatonic seconds within the chord\'s scale — softer cluster sound' },
  { group: 'intervallic',name: 'Cluster Pentatonic',   symbol: 'cluster_pent',    desc: 'Stacked pentatonic steps — open, percussive cluster (McCoy Tyner influence)' },
  { group: 'intervallic',name: 'Cluster Whole-tone',   symbol: 'cluster_wt',      desc: 'Stacked whole tones — whole-tone collection; Debussy/impressionist flavour' },
  { group: 'intervallic',name: 'Cluster Modal',        symbol: 'cluster_modal',   desc: 'Stacked modal scale steps from root in current tonal context' },

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

// Concrete symbols (excludes 'random') — used by resolveVoicingMode random pick
const CONCRETE_VOICING_SYMBOLS = VOICING_MODES.map(v => v.symbol);

// ─── Internal helpers ─────────────────────────────────────────────────────────

// Classify each interval in baseIntervals by harmonic role
function _voicingRoles(baseIntervals) {
  return baseIntervals.map(i => {
    const s = ((i % 12) + 12) % 12;
    if (s === 0)               return 'root';
    if (s === 3 || s === 4)   return 'third';
    if (s === 7)              return 'fifth';
    if (s === 6 || s === 8)  return 'altfifth'; // b5 or #5
    if (s === 10 || s === 11) return 'seventh';
    return 'extension'; // 9, 11, 13 etc.
  });
}

// Pull notes of specific roles from baseIntervals, return as MIDI notes
function _notesByRole(rootMidi, baseIntervals, roles) {
  const r = _voicingRoles(baseIntervals);
  return baseIntervals
    .filter((_, i) => roles.includes(r[i]))
    .map(i => rootMidi + i);
}

// Get the pitch class of a MIDI note as an interval from rootMidi
function _pc(midi, rootMidi) { return ((midi - rootMidi) % 12 + 12) % 12; }

// Force a MIDI note into a target octave range [loMidi, hiMidi]
function _clampToRange(midi, loMidi, hiMidi) {
  while (midi < loMidi)  midi += 12;
  while (midi > hiMidi)  midi -= 12;
  return midi;
}

// Build a note from a pitch class offset from rootMidi, placed in a register
function _noteFromInterval(rootMidi, semitones, targetLoMidi) {
  const base = rootMidi + semitones;
  return _clampToRange(base, targetLoMidi, targetLoMidi + 23);
}

// Stack n notes in fourths (5 semitones each) from a starting MIDI note
function _stackFourths(startMidi, n) {
  const notes = [];
  for (let i = 0; i < n; i++) notes.push(startMidi + i * 5);
  return notes;
}

// Stack n notes in fifths (7 semitones each) from a starting MIDI note
function _stackFifths(startMidi, n) {
  const notes = [];
  for (let i = 0; i < n; i++) notes.push(startMidi + i * 7);
  return notes;
}

// Diatonic major scale steps in semitones (for diatonic cluster)
const DIATONIC_STEPS = [0, 2, 4, 5, 7, 9, 11];
// Pentatonic steps in semitones (for pentatonic cluster)
const PENTATONIC_STEPS = [0, 2, 4, 7, 9];

// ─── Main dispatcher ──────────────────────────────────────────────────────────
//
// applyVoicing(rootMidi, baseIntervals, mode)
//   rootMidi      — MIDI number of the chord root
//   baseIntervals — semitone intervals from root (root = 0 always present)
//   mode          — voicing symbol string (already resolved, never 'random')
//
// Returns: sorted MIDI note array (ascending pitch)
// Never returns empty — falls back to close on any error.

function applyVoicing(rootMidi, baseIntervals, mode) {
  if (!baseIntervals || !baseIntervals.length) return [rootMidi];

  try {
    switch (mode) {

      // ── Group 1: Position / Spacing ───────────────────────────────────────

      case 'close': {
        return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'open': {
        // Every other note (index 1, 3, 5…) raised one octave
        const notes = baseIntervals.map((interval, idx) =>
          idx % 2 === 1 ? rootMidi + interval + 12 : rootMidi + interval
        );
        return notes.sort((a, b) => a - b);
      }

      case 'spread': {
        // Root stays in bass (oct 2–3 = MIDI 36–59)
        // Upper notes spread across oct 4–5 (MIDI 60–83)
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const upper = baseIntervals.slice(1);
        const upperNotes = upper.map((interval, idx) => {
          const pc = ((rootMidi + interval) % 12 + 12) % 12;
          let note = 60 + pc + (idx >= Math.ceil(upper.length / 2) ? 12 : 0);
          if (note > 83) note -= 12;
          return note;
        });

        return [bass, ...upperNotes].sort((a, b) => a - b);
      }

      // ── Group 2: Doubling ─────────────────────────────────────────────────

      case 'dbl_root_oct': {
        // 1–1–3–5: root doubled one octave below
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const rootBelow = close[0] - 12;
        return [rootBelow, ...close].sort((a, b) => a - b);
      }

      case 'dbl_root_above5': {
        // 1–5–1–3: root, fifth, root an octave up, third on top
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root') ?? 0;
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
        // 1–5–3–5: root, fifth, third, fifth again an octave up
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root') ?? 0;
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
        // 1–3–5–1: root at bottom and top, chord tones inside
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const rootTop = close[close.length - 1];
        // Find the highest note and add the root above it
        const rootAbove = rootTop + (12 - (rootTop - close[0]) % 12) % 12;
        return [...close, rootAbove === rootTop ? rootTop + 12 : rootAbove]
          .sort((a, b) => a - b);
      }

      // ── Group 3: Shell / Rootless ─────────────────────────────────────────

      case 'shell': {
        // Root + 3rd + 7th; fallback to close for triads (no 7th)
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'seventh'].includes(roles[i])
        );
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'shell_alt': {
        // Root + 7th + 3rd — 7th voiced below the 3rd
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        // Place 7th below 3rd: if 7th interval > third interval, raise third by octave
        const sevMidi   = rootMidi + rootI;
        const seventhMidi = rootMidi + sevI;
        const thirdMidi = seventhMidi < rootMidi + thirdI
          ? rootMidi + thirdI
          : rootMidi + thirdI + 12;
        return [rootMidi + rootI, seventhMidi, thirdMidi].sort((a, b) => a - b);
      }

      case 'shell_rootless': {
        // 3rd + 7th only
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
        // Three-note: 1–3–5 (uses actual intervals from chord, keeps only root/third/fifth)
        const roles = _voicingRoles(baseIntervals);
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'fifth', 'altfifth'].includes(roles[i])
        ).slice(0, 3);
        return (kept.length ? kept : baseIntervals.slice(0, 3))
          .map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_maj_357': {
        // Three-note: 3–5–7
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_maj_137': {
        // Three-note: 1–3–7 (omits 5th)
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['root', 'third', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_dom_13b7': {
        // Three-note dominant: 1–3–b7 (b7 = interval 10)
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + sevI]
          .sort((a, b) => a - b);
      }

      case 'tn_dom_35b7': {
        // Three-note dominant: 3–5–b7
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_dom_3b79': {
        // Three-note dominant rootless: 3–b7–9
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const extI   = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        const notes = [rootMidi + thirdI, rootMidi + sevI, rootMidi + extI];
        return notes.sort((a, b) => a - b);
      }

      case 'tn_min_1b3b7': {
        // Three-note minor: 1–b3–b7
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')    ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 3;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + sevI]
          .sort((a, b) => a - b);
      }

      case 'tn_min_b35b7': {
        // Three-note minor: b3–5–b7
        const roles = _voicingRoles(baseIntervals);
        if (!roles.includes('seventh')) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          ['third', 'fifth', 'altfifth', 'seventh'].includes(roles[i])
        ).slice(0, 3);
        return kept.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'tn_min_b3b79': {
        // Three-note minor rootless: b3–b7–9
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 3;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const extI   = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + extI]
          .sort((a, b) => a - b);
      }

      case 'rl_maj7': {
        // Rootless maj7: 3–5–7–9 (Bill Evans Form A)
        // Use actual chord intervals where available, build from scratch otherwise
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
        // Rootless maj7 extended: 3–5–7–9–13
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 11;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        // 9th = 14 semitones, 13th = 21 semitones
        const exts = baseIntervals.filter((_, i) => roles[i] === 'extension');
        const ninthI = exts[0] ?? 14;
        const thirthI = exts[1] ?? 21;
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + sevI,
                rootMidi + ninthI, rootMidi + thirthI]
          .sort((a, b) => a - b);
      }

      case 'rl_min7': {
        // Rootless min7: b3–5–b7–9
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
        // Rootless dominant: 3–b7–9–13
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        const exts = baseIntervals.filter((_, i) => roles[i] === 'extension');
        const ninthI  = exts[0] ?? 14;
        const thirthI = exts[1] ?? 21;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + ninthI, rootMidi + thirthI]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_a': {
        // Rootless altered A: 3–b7–b9–#9
        // Build from chord's actual third and seventh, force b9(13) and #9(15)
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 13, rootMidi + 15]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_b': {
        // Rootless altered B: 3–b7–#9–b13
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 15, rootMidi + 20]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_c': {
        // Rootless altered C: 3–b7–b5–b9
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 6, rootMidi + 13]
          .sort((a, b) => a - b);
      }

      case 'rl_alt_d': {
        // Rootless altered D: 3–b7–b9–Ab (Levine concrete spelling: E–Bb–Db–Ab for C7alt)
        // Ab = b13 = 20 semitones above root; Db = b9 = 13 semitones above root
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 13, rootMidi + 20]
          .sort((a, b) => a - b);
      }

      case 'rl_sharp9': {
        // Rootless #9: 3–b7–#9 (Hendrix voicing)
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        return [rootMidi + thirdI, rootMidi + sevI, rootMidi + 15]
          .sort((a, b) => a - b);
      }

      case 'sus_voicing': {
        // Sus voicing: 1–4–b7–9
        // 4th = 5 semitones, b7 = 10, 9th = 14
        const roles = _voicingRoles(baseIntervals);
        const rootI = baseIntervals.find((_, i) => roles[i] === 'root') ?? 0;
        // Use actual fourth from chord if present (sus4 chord), else force 5 semitones
        const fourthI = baseIntervals.find(i => ((i % 12 + 12) % 12) === 5) ?? 5;
        const sevI    = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 10;
        const ninthI  = 14;
        return [rootMidi + rootI, rootMidi + fourthI, rootMidi + sevI, rootMidi + ninthI]
          .sort((a, b) => a - b);
      }

      case 'phrygian': {
        // Phrygian voicing: 1–b2–5–b7 (1, 1 semitone, 7 semitones, 10 semitones)
        return [rootMidi, rootMidi + 1, rootMidi + 7, rootMidi + 10]
          .sort((a, b) => a - b);
      }

      case 'sixth_maj': {
        // Major 6: 1–3–5–6 (6th = 9 semitones)
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9]
          .sort((a, b) => a - b);
      }

      case 'sixth_min': {
        // Minor 6: 1–b3–5–6
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 3;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9]
          .sort((a, b) => a - b);
      }

      case 'sixth_nine': {
        // 6/9: 1–3–5–6–9
        const roles = _voicingRoles(baseIntervals);
        const rootI  = baseIntervals.find((_, i) => roles[i] === 'root')  ?? 0;
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + rootI, rootMidi + thirdI, rootMidi + fifthI,
                rootMidi + 9, rootMidi + 14]
          .sort((a, b) => a - b);
      }

      case 'rl_sixth_nine': {
        // Rootless 6/9: 3–5–6–9
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        return [rootMidi + thirdI, rootMidi + fifthI, rootMidi + 9, rootMidi + 14]
          .sort((a, b) => a - b);
      }

      // ── Group 4: Drop Voicings ────────────────────────────────────────────

      case 'drop2': {
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 2) return close;
        const result = [...close];
        result[result.length - 2] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop3': {
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 3) return close;
        const result = [...close];
        result[result.length - 3] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop24': {
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 4) return applyVoicing(rootMidi, baseIntervals, 'drop2');
        const result = [...close];
        result[result.length - 2] -= 12;
        result[result.length - 4] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop23': {
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 3) return close;
        const result = [...close];
        result[result.length - 2] -= 12;
        result[result.length - 3] -= 12;
        return result.sort((a, b) => a - b);
      }

      // ── Group 5: Intervallic ──────────────────────────────────────────────

      case 'quartal': {
        // Stack perfect fourths (5 semitones), note count = chord note count
        return _stackFourths(rootMidi, baseIntervals.length).sort((a, b) => a - b);
      }

      case 'quintal': {
        // Stack perfect fifths (7 semitones), note count = chord note count
        // Clamp to reasonable range
        const notes = _stackFifths(rootMidi, baseIntervals.length);
        return notes.map(n => _clampToRange(n, rootMidi - 12, rootMidi + 36))
          .sort((a, b) => a - b);
      }

      case 'secundal': {
        // Stack major seconds (2 semitones)
        const notes = [];
        for (let i = 0; i < baseIntervals.length; i++) notes.push(rootMidi + i * 2);
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_chrom': {
        // Stack semitones (1 semitone) — maximum density
        const notes = [];
        for (let i = 0; i < baseIntervals.length; i++) notes.push(rootMidi + i);
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_diaton': {
        // Stack diatonic scale steps — use major scale steps as default
        const notes = [];
        const n = baseIntervals.length;
        for (let i = 0; i < n; i++) {
          notes.push(rootMidi + DIATONIC_STEPS[i % DIATONIC_STEPS.length]
            + Math.floor(i / DIATONIC_STEPS.length) * 12);
        }
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_pent': {
        // Stack pentatonic steps
        const notes = [];
        const n = baseIntervals.length;
        for (let i = 0; i < n; i++) {
          notes.push(rootMidi + PENTATONIC_STEPS[i % PENTATONIC_STEPS.length]
            + Math.floor(i / PENTATONIC_STEPS.length) * 12);
        }
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_wt': {
        // Stack whole tones (2 semitones) — identical interval to secundal but
        // named separately for conceptual distinction (whole-tone scale context)
        const notes = [];
        for (let i = 0; i < baseIntervals.length; i++) notes.push(rootMidi + i * 2);
        return notes.sort((a, b) => a - b);
      }

      case 'cluster_modal': {
        // Stack modal steps — use diatonic steps starting from the chord's root
        // (same as diatonic cluster; modal context comes from the chord family)
        const notes = [];
        const n = baseIntervals.length;
        for (let i = 0; i < n; i++) {
          notes.push(rootMidi + DIATONIC_STEPS[i % DIATONIC_STEPS.length]
            + Math.floor(i / DIATONIC_STEPS.length) * 12);
        }
        return notes.sort((a, b) => a - b);
      }

      // ── Group 6: Style ────────────────────────────────────────────────────

      case 'so_what': {
        // Fixed shape: P4 + P4 + P4 + M3 from root — 5 notes always
        // C–F–Bb–Eb–G (transposed to rootMidi)
        return [0, 5, 10, 15, 19].map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'evans_a': {
        // Bill Evans Form A: 3–5–7–9, voiced in LH register (oct 3–4)
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')   ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')   ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 11;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        // Voice in register: bass in oct 3 range
        let base = rootMidi;
        while (base > 59) base -= 12;
        while (base < 48) base += 12; // target oct 3 (C3=48)
        return [base + thirdI, base + fifthI, base + sevI, base + ninthI]
          .sort((a, b) => a - b);
      }

      case 'evans_b': {
        // Bill Evans Form B: 7–9–3–5 (inversion of Form A — 7th on bottom)
        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 11;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;
        if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
        let base = rootMidi;
        while (base > 59) base -= 12;
        while (base < 48) base += 12;
        // 7th at bottom, 9th, then 3rd and 5th raised to sit above
        const sevMidi   = base + sevI;
        const ninthMidi = base + ninthI;
        let thirdMidi = base + thirdI;
        let fifthMidi = base + fifthI;
        while (thirdMidi <= ninthMidi) thirdMidi += 12;
        while (fifthMidi <= thirdMidi)  fifthMidi += 12;
        return [sevMidi, ninthMidi, thirdMidi, fifthMidi].sort((a, b) => a - b);
      }

      case 'kenny_barron': {
        // LH: root + 7th (oct 2–3). RH: 3rd + 5th + 9th (oct 4–5)
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third')     ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth')     ?? 7;
        const sevI   = baseIntervals.find((_, i) => roles[i] === 'seventh')   ?? 10;
        const ninthI = baseIntervals.find((_, i) => roles[i] === 'extension') ?? 14;

        const lhRoot  = lhBase;
        const lhSev   = _clampToRange(lhBase + sevI, lhBase, lhBase + 11);

        const rhBase  = 60; // C4
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);
        const rhNinth = _clampToRange(lhBase + ninthI, rhBase, rhBase + 23);

        return [lhRoot, lhSev, rhThird, rhFifth, rhNinth].sort((a, b) => a - b);
      }

      case 'mccoy_tyner': {
        // LH: stacked quartal (3 fourths from root in bass register)
        // RH: upper quartal cluster (3 fourths starting a fifth above)
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const lhNotes = _stackFourths(lhBase, 3);            // root, P4, P4+P4
        const rhStart = lhBase + 19;                          // a P5 + P4 above bass
        const rhNotes = _stackFourths(rhStart, Math.max(2, baseIntervals.length - 3));

        return [...lhNotes, ...rhNotes].sort((a, b) => a - b);
      }

      case 'pop_piano': {
        // LH: root octave (oct 2–3). RH: 3rd + 5th + 9th close (oct 4–5)
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) => roles[i] === 'fifth') ?? 7;
        const ninthI = 14;

        const rhBase  = 60;
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);
        const rhNinth = _clampToRange(lhBase + ninthI, rhBase, rhBase + 23);

        return [lhBase, lhBase + 12, rhThird, rhFifth, rhNinth].sort((a, b) => a - b);
      }

      case 'gospel': {
        // Close voicing + added 9th; push into upper register (oct 4–5)
        const roles  = _voicingRoles(baseIntervals);
        const hasExt = roles.includes('extension');
        // Build close voicing, add 9th if not already present
        let notes = baseIntervals.map(i => rootMidi + i);
        if (!hasExt) notes.push(rootMidi + 14); // add 9th
        // Stack everything close from rootMidi
        return notes.sort((a, b) => a - b);
      }

      case 'oct_bass_triad': {
        // LH: root octave (oct 2–3). RH: triad only (root/third/fifth)
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const thirdI = baseIntervals.find((_, i) => roles[i] === 'third') ?? 4;
        const fifthI = baseIntervals.find((_, i) =>
          roles[i] === 'fifth' || roles[i] === 'altfifth') ?? 7;

        const rhBase  = 60;
        const rhRoot  = _clampToRange(lhBase,         rhBase, rhBase + 23);
        const rhThird = _clampToRange(lhBase + thirdI, rhBase, rhBase + 23);
        const rhFifth = _clampToRange(lhBase + fifthI, rhBase, rhBase + 23);

        return [lhBase, lhBase + 12, rhRoot, rhThird, rhFifth].sort((a, b) => a - b);
      }

      case 'oct_bass_7th': {
        // LH: root octave (oct 2–3). RH: full seventh chord close (oct 4–5)
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const rhBase = 60;
        const rhNotes = baseIntervals.map(i => {
          return _clampToRange(lhBase + i, rhBase, rhBase + 23);
        });

        return [lhBase, lhBase + 12, ...rhNotes].sort((a, b) => a - b);
      }

      case 'open5_triad': {
        // LH: root + 5th (power chord, oct 2–3). RH: triad (oct 4–5)
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
        // Melody (highest note) harmonised with close-position chord tones below
        // Equivalent to close voicing — melody is whatever falls on top
        return applyVoicing(rootMidi, baseIntervals, 'close');
      }

      case 'block_locked': {
        // Locked hands: close voicing + melody doubled one octave lower
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const melody = close[close.length - 1]; // highest note
        const doubled = melody - 12;
        return [...close, doubled].sort((a, b) => a - b);
      }

      case 'four_way_close': {
        // Four-voice close position — exactly 4 notes, melody on top
        // Take the top 4 notes of the close voicing (or all if fewer)
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const four  = close.length > 4 ? close.slice(close.length - 4) : close;
        return four.sort((a, b) => a - b);
      }

      case 'block_drop2': {
        // Drop-2 applied to harmonised melody — same as drop2
        return applyVoicing(rootMidi, baseIntervals, 'drop2');
      }

      case 'oct_melody_inner': {
        // Melody doubled at the octave; chord tones fill between the two melody octaves
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        const melody = close[close.length - 1];
        const melodyUp = melody + 12;
        // Inner voices: everything except the melody itself, kept between the two octaves
        const inner = close.slice(0, -1).map(n => {
          while (n < melody) n += 12;
          while (n > melodyUp) n -= 12;
          return n;
        });
        return [melody, ...inner, melodyUp].sort((a, b) => a - b);
      }

      case 'pedal_point': {
        // Root held as bass pedal; upper voices close-voiced one octave above
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const rhBase  = 60;
        const rhNotes = baseIntervals.map(i => {
          return _clampToRange(bass + i, rhBase, rhBase + 23);
        });

        return [bass, ...rhNotes].sort((a, b) => a - b);
      }

      case 'spread_2h': {
        // LH: root + 5th wide apart (oct 2–3). RH: upper extensions close
        // Broader than spread — LH is wider, RH is the colour tones
        let lhBase = rootMidi;
        while (lhBase > 59) lhBase -= 12;
        while (lhBase < 36) lhBase += 12;

        const roles  = _voicingRoles(baseIntervals);
        const fifthI = baseIntervals.find((_, i) =>
          roles[i] === 'fifth' || roles[i] === 'altfifth') ?? 7;

        const lhFifth = lhBase + fifthI;
        const rhBase  = 60;
        // RH: everything that isn't root or fifth
        const rhIntervals = baseIntervals.filter((_, i) =>
          !['root', 'fifth', 'altfifth'].includes(roles[i])
        );
        const rhNotes = rhIntervals.length
          ? rhIntervals.map(i => _clampToRange(lhBase + i, rhBase, rhBase + 23))
          : baseIntervals.slice(1).map(i => _clampToRange(lhBase + i, rhBase, rhBase + 23));

        return [lhBase, lhFifth, ...rhNotes].sort((a, b) => a - b);
      }

      default:
        return applyVoicing(rootMidi, baseIntervals, 'close');
    }
  } catch (e) {
    console.warn('applyVoicing error for mode', mode, e);
    return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
  }
}

// ─── Resolve voicing mode for a question ─────────────────────────────────────
//
// In quiz mode:  picks randomly from selectedVoicings pool; falls back to 'close'
// In dict mode:  uses activeVoicingMode directly (single-select, already concrete)
// 'random':      picks from selectedVoicings in quiz, from all 63 in dict

function resolveVoicingMode() {
  if (appMode === 'quiz') {
    const pool = [...selectedVoicings].filter(s => s !== 'random');
    if (!pool.length) return 'close';
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (activeVoicingMode === 'random') {
    return CONCRETE_VOICING_SYMBOLS[Math.floor(Math.random() * CONCRETE_VOICING_SYMBOLS.length)];
  }
  return activeVoicingMode;
}
