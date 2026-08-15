// POINT 7: Scale definitions — semitone intervals from root, one octave
// POINT 28: Scales reorganised by note count into four groups.
// Group boundaries: pentatonic [0,7), hexatonic [7,11), diatonic [11,23), octatonic [23,25)
// parentKey: { offset, quality } — offset in semitones from scale root to parent key root
// quality: 'major' | 'minor' | null (null = no standard key sig, fall back to C)
const SCALES = [
  // ── Pentatonic (5 notes) ──────────────────────────────────────────────────
  { name: 'Major Pentatonic', displayName: 'Major Pentatonic (Ionian Pentatonic)', symbol: 'pent_maj',     intervals: [0,2,4,7,9,12],       parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Minor Pentatonic', displayName: 'Minor Pentatonic (Aeolian Pentatonic)', symbol: 'pent_min',    intervals: [0,3,5,7,10,12],      parentKey: { offset: 0,  quality: 'minor' }, group: 'pentatonic' },
  { name: 'Dorian Pentatonic',     symbol: 'pent_dorian',   intervals: [0,2,3,7,9,12],   parentKey: { offset: -2, quality: 'major' }, group: 'pentatonic' },
  { name: 'Phrygian Pentatonic',   symbol: 'pent_phrygian', intervals: [0,1,3,5,7,12],   parentKey: { offset: -4, quality: 'major' }, group: 'pentatonic' },
  { name: 'Lydian Pentatonic',     symbol: 'pent_lydian',   intervals: [0,2,4,6,9,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Mixolydian Pentatonic', symbol: 'pent_mixo',     intervals: [0,2,5,7,10,12],  parentKey: { offset: -7, quality: 'major' }, group: 'pentatonic' },
  { name: 'Locrian Pentatonic',    symbol: 'pent_locrian',  intervals: [0,1,3,6,8,12],   parentKey: { offset: -5, quality: 'major' }, group: 'pentatonic' },
  // ── Hexatonic (6 notes) ──────────────────────────────────────────────────
  { name: 'Blues',       symbol: 'blues',      intervals: [0,3,5,6,7,10,12],    parentKey: { offset: 0,  quality: 'minor' }, group: 'hexatonic' },
  { name: 'Whole Tone',  symbol: 'whole_tone', intervals: [0,2,4,6,8,10,12],    parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Augmented',   symbol: 'augmented_scale', intervals: [0,3,4,7,8,11,12], parentKey: { offset: 0, quality: 'major' }, group: 'hexatonic' },
  { name: 'Prometheus',  symbol: 'prometheus', intervals: [0,2,4,6,9,10,12],    parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  // ── Diatonic / Modal (7 notes) ───────────────────────────────────────────
  { name: 'Major',              symbol: 'major',      intervals: [0,2,4,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Natural Minor',      symbol: 'nat_minor',  intervals: [0,2,3,5,7,8,10,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Harmonic Minor',     symbol: 'harm_minor', intervals: [0,2,3,5,7,8,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Melodic Minor',      symbol: 'mel_minor',  intervals: [0,2,3,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Dorian',             symbol: 'dorian',     intervals: [0,2,3,5,7,9,10,12],   parentKey: { offset: -2, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian',           symbol: 'phrygian',   intervals: [0,1,3,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian',             symbol: 'lydian',     intervals: [0,2,4,6,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Mixolydian',         symbol: 'mixolydian', intervals: [0,2,4,5,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Locrian',            symbol: 'locrian',    intervals: [0,1,3,5,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian Dominant',  symbol: 'phryg_dom',  intervals: [0,1,4,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian Dominant',    symbol: 'lyd_dom',    intervals: [0,2,4,6,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Altered',            symbol: 'altered',    intervals: [0,1,3,4,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  // ── Octatonic (8 notes) ──────────────────────────────────────────────────
  { name: 'Diminished (W-H)',   symbol: 'dim_wh',     intervals: [0,2,3,5,6,8,9,11,12], parentKey: { offset: 0, quality: 'major' }, group: 'octatonic' },
  { name: 'Diminished (H-W)',   symbol: 'dim_hw',     intervals: [0,1,3,4,6,7,9,10,12], parentKey: { offset: 0, quality: 'major' }, group: 'octatonic' },
];

// POINT 7 / 20b: Scale playback direction options
const SCALE_DIRECTIONS = [
  { name: 'Ascending',  symbol: 'asc'    },
  { name: 'Descending', symbol: 'desc'   },
  { name: 'Both',       symbol: 'both'   },
  { name: 'Random',     symbol: 'random' }, // POINT 20b
];
