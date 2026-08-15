// ─── State ────────────────────────────────────────────────────────────────────

var piano = null;
var audioCtx = null;
var answered = false;
var appMode = 'dict'; // 'quiz' | 'dict'
var appDifficulty = 'basic'; // 'basic' | 'advanced'
var correct = 0, total = 0, streak = 0;

// Chord mode state
var currentChord = null;
var currentMidiNotes = [];
var currentChordRootMidi = null;  // always the harmonic root, regardless of voicing/inversion
// POINT 25: Slash chord extra state
var currentSlashBassMidi = null;  // bass note midi (separate from upper chord)
var currentUpperRootMidi = null;  // upper chord root midi

// POINT 26: Polychord extra state
var currentPolyUpperMidi = [];    // upper triad midi notes
var currentPolyLowerMidi = [];    // lower triad midi notes
var currentPolyUpperRootMidi = null;
var currentPolyLowerRootMidi = null;

// POINT 26: UST extra state
var currentUSTShellMidi = [];     // shell (3rd + ♭7th) midi notes
var currentUSTUpperMidi = [];     // upper triad midi notes
var currentUSTRootMidi  = null;   // chord root midi (not played — rootless voicing)

// POINT 10: Granular selection state — sets of enabled symbols per mode
// NOTE: selectedChords, selectedIntervals, selectedScales are declared in defaults.js (load after chords.js)
var includeInversions = false;

// POINT 5: Interval mode state
var currentMode = 'intervals';       // 'chords' | 'intervals' | 'scales'
var currentInterval = null;          // { name, symbol, semitones }
var currentIntervalMidi = [];        // [noteA, noteB]
var intervalStyle = 'harmonic';      // 'harmonic' | 'ascending' | 'descending' | 'random' (POINT 20b)
var currentIntervalStyle = 'harmonic'; // POINT 20b: resolved style for the current question
var chordPlayStyle = 'block';          // POINT 6: 'block'|'ascending'|'descending'|'broken'|'random'

// POINT 41: Voicing mode state
// activeVoicingMode — the currently selected chip in dict/post-answer (single-select)
// selectedVoicings  — the quiz training pool (multi-select Set); 'close' on by default
var activeVoicingMode = 'close'; // symbol of active voicing in dict/post-answer mode
var selectedVoicings  = new Set(['close']); // quiz pool — user picks which voicings to train

// POINT 7: Scale mode state
var currentScale = null;             // { name, symbol, intervals }
var currentScaleRootMidi = 60;       // MIDI root note
var scaleDirection = 'asc';          // 'asc' | 'desc' | 'both' | 'random' (POINT 20b)
var currentScaleDir = 'asc';         // POINT 20b: resolved direction for the current question
var scaleKeySigMode    = 'key';  // 'C' | 'key' — resets to 'key' each new question
var chordKeySigMode    = 'C';   // POINT 32b: chords default to C (accidentals inline)
var intervalKeySigMode = 'C';   // POINT 32b: intervals default to C (accidentals inline)
var progKeySigMode     = 'C';   // POINT 38: progressions default to C (accidentals inline)

// POINT 8: UX state
var showRoot = true;                 // show/hide root badge before answering
var sessionStats = {};               // { symbol: { name, correct, total } }

// POINT 12: Root note & octave register state
var pinnedRoot         = 0;      // 0 = C by default; null = random
var pinnedRootSpelling = null;   // null = auto, 'sharp' | 'flat' = user chose an enharmonic spelling
var pinnedOctave       = null;   // null = random, 'low'|'mid'|'high' = band

// POINT 37: Voice leading analysis cache.
// Set once when answer is revealed (submitChordAnswer); reset to null on each new question.
// Populated by analyseChord() from js/engine/voiceLeading.js.
// Shape: { contexts: [...], isAmbiguous: bool } — see voice_leading_algorithm_plan.md.
var currentVoiceLeadingAnalysis = null;

// POINT 38: Progression mode state — declared in js/data/progressions.js
