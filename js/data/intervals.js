/**
 * @file intervals.js
 * @description Interval type library for The Sound Travels Ear Training — defines all
 * quizzable intervals (simple and compound) and playback style options.
 *
 * @module intervals
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// =============================================================================
// INTERVALS — all quizzable intervals from minor 2nd to major 13th.
//
// Unison (0 semitones) is excluded — it cannot be identified by ear alone.
//
// Schema:
//   name      {string}  Display label shown to the user.
//   symbol    {string}  Internal key — ASCII only, unique across all intervals.
//   semitones {number}  Size of the interval in semitones.
//   compound  {boolean} Optional. true = interval spans more than one octave
//                       (Advanced mode only; collapsed and unselected by default).
// =============================================================================

/**
 * Complete interval library — 12 simple intervals and 7 compound (extended) intervals.
 *
 * @type {Array.<{name: string, symbol: string, semitones: number, compound?: boolean}>}
 */
const INTERVALS = [
  { name: 'Minor 2nd',              symbol: 'm2',  semitones: 1  },
  { name: 'Major 2nd',              symbol: 'M2',  semitones: 2  },
  { name: 'Minor 3rd',              symbol: 'm3',  semitones: 3  },
  { name: 'Major 3rd',              symbol: 'M3',  semitones: 4  },
  { name: 'Perfect 4th',            symbol: 'P4',  semitones: 5  },
  { name: 'Tritone (A4 / ♭5)',      symbol: 'TT',  semitones: 6  },
  { name: 'Perfect 5th',            symbol: 'P5',  semitones: 7  },
  { name: 'Aug 5th / Minor 6th',    symbol: 'm6',  semitones: 8  },
  { name: 'Major 6th',              symbol: 'M6',  semitones: 9  },
  { name: 'Minor 7th',              symbol: 'm7',  semitones: 10 },
  { name: 'Major 7th',              symbol: 'M7',  semitones: 11 },
  { name: 'Octave',                 symbol: 'P8',  semitones: 12 },
  // Compound / extended intervals — beyond one octave
  { name: 'Minor 9th',              symbol: 'm9',  semitones: 13, compound: true },
  { name: 'Major 9th',              symbol: 'M9',  semitones: 14, compound: true },
  { name: 'Aug 9th / ♯9th',         symbol: 'A9',  semitones: 15, compound: true },
  { name: 'Perfect 11th',           symbol: 'P11', semitones: 17, compound: true },
  { name: 'Aug 11th / ♯11th',       symbol: 'A11', semitones: 18, compound: true },
  { name: 'Minor 13th',             symbol: 'm13', semitones: 20, compound: true },
  { name: 'Major 13th',             symbol: 'M13', semitones: 21, compound: true },
];

// ── Interval playback styles ────────────────────────────────────────────────

/**
 * Available playback styles for interval questions.
 * Controls whether the two notes are sounded together or in sequence.
 *
 * @type {Array.<{name: string, symbol: string}>}
 * @property {string} name   Display label shown in the UI.
 * @property {string} symbol Internal key used in state and mode logic.
 */
const INTERVAL_STYLES = [
  { name: 'Harmonic',   symbol: 'harmonic'   },
  { name: 'Ascending',  symbol: 'ascending'  },
  { name: 'Descending', symbol: 'descending' },
  { name: 'Random',     symbol: 'random'     },
];

// =============================================================================
// The Sound Travels Ear Training — intervals.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
