// ─── Defaults — state that references data constants at init ──────────────────
// Depends on: chords.js (CHORD_TYPES, INTERVALS), scales.js (SCALES)
// Must load after: chords.js
// Must load before: anything that reads selectedChords / selectedIntervals / selectedScales

const selectedChords    = new Set(['maj','Maj7','m','m7','7','dim','m7b5','o7','aug','sus2','sus4','power']); // default: Basic mode chords
const selectedIntervals = new Set(INTERVALS.filter(i => !i.compound).map(i => i.symbol)); // default: simple intervals only
const selectedScales    = new Set(['major','nat_minor']); // default: major + natural minor
