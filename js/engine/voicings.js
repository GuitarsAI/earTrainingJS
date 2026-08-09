// ─── POINT 41/46: Voicing system ─────────────────────────────────────────────
//
// This file owns all voicing logic for Chords mode:
//   VOICING_MODES     — data table for all 21 voicings across 4 groups
//   applyVoicing()    — main dispatcher, returns MIDI note array
//   resolveVoicingMode() — picks one concrete mode from selectedVoicings or activeVoicingMode
//
// Rendering of voicing chips lives in js/ui/pool.js (renderChordPoolPanel).
// Per-question resolved state (currentVoicingMode) lives in js/engine/helpers.js.
// User selection state (activeVoicingMode, selectedVoicings) lives in js/engine/state.js.
//
// Load order: after helpers.js, before audio.js.

// ─── Voicing data table ───────────────────────────────────────────────────────

const VOICING_MODES = [
  // Group 1 — Structural
  { group: 'structural', name: 'Close',         symbol: 'close',       desc: 'All notes stacked within one octave from the root' },
  { group: 'structural', name: 'Open',          symbol: 'open',        desc: 'Alternate notes raised an octave — wider, more spacious' },
  { group: 'structural', name: 'Spread',        symbol: 'spread',      desc: 'Root in bass, upper notes spread across oct 4–5' },
  { group: 'structural', name: 'Shell',         symbol: 'shell',       desc: 'Root + 3rd + 7th only; falls back to close for triads' },
  { group: 'structural', name: 'Rootless',      symbol: 'rootless',    desc: '3rd + 7th only, no root; falls back to close for triads' },
  { group: 'structural', name: 'Drop-2',        symbol: 'drop2',       desc: 'Second-highest note of close voicing dropped one octave' },
  { group: 'structural', name: 'Drop-3',        symbol: 'drop3',       desc: 'Third-highest note of close voicing dropped one octave' },
  { group: 'structural', name: 'Drop-2&4',      symbol: 'drop24',      desc: 'Second and fourth voices dropped one octave; falls back to Drop-2 for triads' },
  { group: 'structural', name: 'Piano',         symbol: 'piano',       desc: 'LH: root in bass. RH: remaining notes close in oct 4–5' },
  // Group 2 — Intervallic
  { group: 'intervallic', name: 'Quartal',      symbol: 'quartal',     desc: 'Stacked perfect fourths from root' },
  { group: 'intervallic', name: 'Quintal',      symbol: 'quintal',     desc: 'Stacked perfect fifths from root' },
  { group: 'intervallic', name: 'Secundal',     symbol: 'secundal',    desc: 'Stacked major seconds from root' },
  { group: 'intervallic', name: 'Cluster',      symbol: 'cluster',     desc: 'Stacked semitones from root — maximum density' },
  // Group 3 — Style
  { group: 'style', name: 'So What',            symbol: 'so_what',     desc: 'Fixed shape: P4 + P4 + P4 + M3 — Miles Davis / Bill Evans' },
  { group: 'style', name: 'Bill Evans',         symbol: 'bill_evans',  desc: '3rd + 7th + 9th + 13th, no root — The Jazz Piano Book' },
  { group: 'style', name: 'Kenny Barron',       symbol: 'kenny_barron',desc: 'LH: root + 7th. RH: 3rd + 5th + 9th' },
  { group: 'style', name: 'McCoy Tyner',        symbol: 'mccoy_tyner', desc: 'LH: stacked quartal. RH: upper quartal cluster' },
  { group: 'style', name: 'Pop Piano',          symbol: 'pop_piano',   desc: 'LH: root octave in bass. RH: 3rd + 5th + 9th' },
  { group: 'style', name: 'Gospel',             symbol: 'gospel',      desc: 'Close voicing with added 9th; extensions stacked tightly' },
  // Group 4 — Texture
  { group: 'texture', name: 'Oct. Double',      symbol: 'oct_double',  desc: 'Root position + root doubled one octave above' },
  { group: 'texture', name: 'Dense Ext.',       symbol: 'dense_ext',   desc: 'All chord tones across two octaves; falls back to close for triads' },
];

// Concrete symbols (excludes 'random') — used by resolveVoicingMode random pick
const CONCRETE_VOICING_SYMBOLS = VOICING_MODES.map(v => v.symbol);

// ─── Helper: classify interval roles ─────────────────────────────────────────

function _voicingRoles(baseIntervals) {
  return baseIntervals.map(i => {
    const s = ((i % 12) + 12) % 12;
    if (s === 0)              return 'root';
    if (s === 3 || s === 4)  return 'third';
    if (s === 7)             return 'fifth';
    if (s === 6 || s === 8)  return 'altfifth'; // b5 or #5 — keep always
    if (s === 10 || s === 11) return 'seventh';
    return 'extension'; // 9, 11, 13 etc.
  });
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────
//
// applyVoicing(rootMidi, baseIntervals, mode)
//   rootMidi      — MIDI number of the chord root (used for register decisions)
//   baseIntervals — semitone intervals from root (root = 0 always first)
//   mode          — voicing symbol string (already resolved, never 'random')
//
// Returns: sorted MIDI note array (ascending pitch)
// Never returns empty — falls back to close on any error.

function applyVoicing(rootMidi, baseIntervals, mode) {
  // Safety
  if (!baseIntervals || !baseIntervals.length) return [rootMidi];

  try {
    switch (mode) {

      // ── Group 1: Structural ────────────────────────────────────────────────

      case 'close': {
        // All notes stacked from root, no octave adjustment
        return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
      }

      case 'open': {
        // Alternate notes (index 1, 3, 5…) raised one octave
        const notes = baseIntervals.map((interval, idx) =>
          idx % 2 === 1 ? rootMidi + interval + 12 : rootMidi + interval
        );
        return notes.sort((a, b) => a - b);
      }

      case 'spread': {
        // Root in bass (keep rootMidi as-is, pull down if needed to oct 2–3),
        // remaining notes spread across oct 4–5
        let bass = rootMidi;
        // Target bass in MIDI oct 2–3 (MIDI 36–59)
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const upper = baseIntervals.slice(1); // everything above root
        const upperBase = 60; // start of oct 4 (C4)
        const upperNotes = upper.map((interval, idx) => {
          const pc = (rootMidi + interval) % 12;
          // Distribute across oct 4–5, spacing them out
          let note = upperBase + pc + (idx >= upper.length / 2 ? 12 : 0);
          if (note < upperBase) note += 12;
          if (note > 83) note -= 12; // keep below C6
          return note;
        });

        return [bass, ...upperNotes].sort((a, b) => a - b);
      }

      case 'shell': {
        // Root + 3rd + 7th only; fall back to close if no 7th
        const roles = _voicingRoles(baseIntervals);
        const hasSeventh = roles.includes('seventh');
        if (!hasSeventh) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          roles[i] === 'root' || roles[i] === 'third' || roles[i] === 'seventh'
        );
        return kept.length ? kept.map(i => rootMidi + i).sort((a, b) => a - b)
                           : applyVoicing(rootMidi, baseIntervals, 'close');
      }

      case 'rootless': {
        // 3rd + 7th only, no root; fall back to close if no 7th
        const roles = _voicingRoles(baseIntervals);
        const hasSeventh = roles.includes('seventh');
        if (!hasSeventh) return applyVoicing(rootMidi, baseIntervals, 'close');
        const kept = baseIntervals.filter((_, i) =>
          roles[i] === 'third' || roles[i] === 'seventh' || roles[i] === 'extension'
        );
        return kept.length ? kept.map(i => rootMidi + i).sort((a, b) => a - b)
                           : applyVoicing(rootMidi, baseIntervals, 'close');
      }

      case 'drop2': {
        // Start from close voicing (sorted ascending), then drop the second-highest
        // note down one octave
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 2) return close;
        const result = [...close];
        result[result.length - 2] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop3': {
        // Close voicing, third-highest note dropped one octave
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 3) return close;
        const result = [...close];
        result[result.length - 3] -= 12;
        return result.sort((a, b) => a - b);
      }

      case 'drop24': {
        // Close voicing, second AND fourth voices from top dropped one octave
        // For triads (< 4 notes) fall back to drop2
        const close = baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
        if (close.length < 4) return applyVoicing(rootMidi, baseIntervals, 'drop2');
        const result = [...close];
        result[result.length - 2] -= 12; // second from top
        result[result.length - 4] -= 12; // fourth from top
        return result.sort((a, b) => a - b);
      }

      case 'piano': {
        // LH: root alone in bass (oct 2–3)
        // RH: remaining notes close-voiced in oct 4–5
        let bass = rootMidi;
        while (bass > 59) bass -= 12;
        while (bass < 36) bass += 12;

        const rhBase = 60; // C4
        const rhNotes = baseIntervals.slice(1).map(interval => {
          const pc = (rootMidi + interval) % 12;
          let note = rhBase + pc;
          if (note < rhBase) note += 12;
          if (note > 83) note -= 12;
          return note;
        });

        return [bass, ...rhNotes].sort((a, b) => a - b);
      }

      // ── Groups 2–4: Not yet implemented — fall back to close ──────────────
      // These will be filled in during Phases 2, 3, and 4.

      case 'quartal':
      case 'quintal':
      case 'secundal':
      case 'cluster':
      case 'so_what':
      case 'bill_evans':
      case 'kenny_barron':
      case 'mccoy_tyner':
      case 'pop_piano':
      case 'gospel':
      case 'oct_double':
      case 'dense_ext':
        // Stub — falls through to close until implemented
        return applyVoicing(rootMidi, baseIntervals, 'close');

      default:
        return applyVoicing(rootMidi, baseIntervals, 'close');
    }
  } catch (e) {
    // Safety net — never crash on a voicing error
    console.warn('applyVoicing error for mode', mode, e);
    return baseIntervals.map(i => rootMidi + i).sort((a, b) => a - b);
  }
}

// ─── Resolve voicing mode for a question ─────────────────────────────────────
//
// In quiz mode:  picks from selectedVoicings (the user's pool), or falls back
//               to 'close' if the set is empty.
// In dict mode:  uses activeVoicingMode directly (single-select, already concrete).
// 'random':      picks uniformly from selectedVoicings in quiz, from all 21 in dict.

function resolveVoicingMode() {
  if (appMode === 'quiz') {
    // Multi-select pool — pick from what the user has selected
    const pool = [...selectedVoicings].filter(s => s !== 'random');
    if (!pool.length) return 'close'; // safety fallback
    return pool[Math.floor(Math.random() * pool.length)];
  }
  // Dict / post-answer — single-select
  if (activeVoicingMode === 'random') {
    return CONCRETE_VOICING_SYMBOLS[Math.floor(Math.random() * CONCRETE_VOICING_SYMBOLS.length)];
  }
  return activeVoicingMode;
}
