// ─── Interval data ────────────────────────────────────────────────────────────
// Extracted from chords.js (Point 45-style refactor — data file per domain).
// Must load before: state.js, defaults.js, pool.js, intervals-mode.js

// POINT 5: All 13 intervals (unison excluded — not quizzable by ear alone)
const INTERVALS = [
  { name: 'Minor 2nd',  symbol: 'm2',  semitones: 1  },
  { name: 'Major 2nd',  symbol: 'M2',  semitones: 2  },
  { name: 'Minor 3rd',  symbol: 'm3',  semitones: 3  },
  { name: 'Major 3rd',  symbol: 'M3',  semitones: 4  },
  { name: 'Perfect 4th',symbol: 'P4',  semitones: 5  },
  { name: 'Tritone (A4 / ♭5)',        symbol: 'TT',  semitones: 6  },
  { name: 'Perfect 5th',              symbol: 'P5',  semitones: 7  },
  { name: 'Aug 5th / Minor 6th',      symbol: 'm6',  semitones: 8  },
  { name: 'Major 6th',                symbol: 'M6',  semitones: 9  },
  { name: 'Minor 7th',  symbol: 'm7',  semitones: 10 },
  { name: 'Major 7th',  symbol: 'M7',  semitones: 11 },
  { name: 'Octave',     symbol: 'P8',  semitones: 12 },
  // POINT 39: Compound / extended intervals (> one octave)
  { name: 'Minor 9th',              symbol: 'm9',  semitones: 13, compound: true },
  { name: 'Major 9th',              symbol: 'M9',  semitones: 14, compound: true },
  { name: 'Aug 9th / ♯9th',         symbol: 'A9',  semitones: 15, compound: true },
  { name: 'Perfect 11th',           symbol: 'P11', semitones: 17, compound: true },
  { name: 'Aug 11th / ♯11th',       symbol: 'A11', semitones: 18, compound: true },
  { name: 'Minor 13th',             symbol: 'm13', semitones: 20, compound: true },
  { name: 'Major 13th',             symbol: 'M13', semitones: 21, compound: true },
];

// POINT 5: Playback styles for intervals
const INTERVAL_STYLES = [
  { name: 'Harmonic',   symbol: 'harmonic'   },
  { name: 'Ascending',  symbol: 'ascending'  },
  { name: 'Descending', symbol: 'descending' },
  { name: 'Random',     symbol: 'random'     }, // POINT 20b
];
