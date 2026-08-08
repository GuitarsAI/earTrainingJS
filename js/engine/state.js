// ─── State ────────────────────────────────────────────────────────────────────

let piano = null;
let audioCtx = null;
let answered = false;
let appMode = 'dict'; // 'quiz' | 'dict'
let correct = 0, total = 0, streak = 0;

// Chord mode state
let currentChord = null;
let currentMidiNotes = [];
let currentChordRootMidi = null;  // always the harmonic root, regardless of voicing/inversion
// POINT 25: Slash chord extra state
let currentSlashBassMidi = null;  // bass note midi (separate from upper chord)
let currentUpperRootMidi = null;  // upper chord root midi

// POINT 26: Polychord extra state
let currentPolyUpperMidi = [];    // upper triad midi notes
let currentPolyLowerMidi = [];    // lower triad midi notes
let currentPolyUpperRootMidi = null;
let currentPolyLowerRootMidi = null;

// POINT 26: UST extra state
let currentUSTShellMidi = [];     // shell (3rd + ♭7th) midi notes
let currentUSTUpperMidi = [];     // upper triad midi notes
let currentUSTRootMidi  = null;   // chord root midi (not played — rootless voicing)

// POINT 10: Granular selection state — sets of enabled symbols per mode
// NOTE: selectedChords, selectedIntervals, selectedScales are declared in defaults.js (load after chords.js)
let includeInversions = false;

// POINT 5: Interval mode state
let currentMode = 'intervals';       // 'chords' | 'intervals' | 'scales'
let currentInterval = null;          // { name, symbol, semitones }
let currentIntervalMidi = [];        // [noteA, noteB]
let intervalStyle = 'harmonic';      // 'harmonic' | 'ascending' | 'descending' | 'random' (POINT 20b)
let currentIntervalStyle = 'harmonic'; // POINT 20b: resolved style for the current question
let chordPlayStyle = 'block';          // POINT 6: 'block'|'ascending'|'descending'|'broken'|'random'

// POINT 23: Voicing mode state — which mode is active
let activeVoicingMode = 'full'; // 'full' | 'real' | 'shell' | 'guide' | 'random'

// POINT 7: Scale mode state
let currentScale = null;             // { name, symbol, intervals }
let currentScaleRootMidi = 60;       // MIDI root note
let scaleDirection = 'asc';          // 'asc' | 'desc' | 'both' | 'random' (POINT 20b)
let currentScaleDir = 'asc';         // POINT 20b: resolved direction for the current question
let scaleKeySigMode    = 'key';  // 'C' | 'key' — resets to 'key' each new question
let chordKeySigMode    = 'C';   // POINT 32b: chords default to C (accidentals inline)
let intervalKeySigMode = 'C';   // POINT 32b: intervals default to C (accidentals inline)
let progKeySigMode     = 'C';   // POINT 38: progressions default to C (accidentals inline)

// POINT 8: UX state
let showRoot = true;                 // show/hide root badge before answering
let sessionStats = {};               // { symbol: { name, correct, total } }

// POINT 12: Root note & octave register state
let pinnedRoot         = 0;      // 0 = C by default; null = random
let pinnedRootSpelling = null;   // null = auto, 'sharp' | 'flat' = user chose an enharmonic spelling
let pinnedOctave       = null;   // null = random, 'low'|'mid'|'high' = band

// POINT 37: Voice leading analysis cache.
// Set once when answer is revealed (submitChordAnswer); reset to null on each new question.
// Populated by analyseChord() from js/engine/voiceLeading.js.
// Shape: { contexts: [...], isAmbiguous: bool } — see voice_leading_algorithm_plan.md.
let currentVoiceLeadingAnalysis = null;

// POINT 38: Progression mode state — declared in js/data/progressions.js
