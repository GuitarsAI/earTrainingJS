/**
 * @file state.js
 * @description Global runtime state for The Sound Travels Ear Training.
 * Declares all shared mutable variables consumed across the engine, UI, and mode
 * layers. Variables are declared with `var` (not `let`) so they are globally
 * accessible across all script tags without ES module imports.
 *
 * Progression-specific state (`currentProgression`, `progSlotAnswers`, etc.)
 * is declared in js/data/progressions.js because it is tightly coupled to the
 * progressions data schema. Selection state (`selectedChords`, `selectedIntervals`,
 * `selectedScales`, `selectedProgressions`) is initialised in js/engine/defaults.js
 * after the data files are loaded.
 *
 * @module state
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// ── Audio ─────────────────────────────────────────────────────────────────────

/** @type {Object|null} soundfont-player instrument instance. Null until audio initialises. */
var piano = null;

/** @type {AudioContext|null} Web Audio API context. Null until first user interaction. */
var audioCtx = null;

// ── Session ───────────────────────────────────────────────────────────────────

/** @type {boolean} Whether the current question has been answered. Resets on each new question. */
var answered = false;

/** @type {'quiz'|'dict'} Active app mode. 'quiz' = training mode; 'dict' = dictionary/reference mode. */
var appMode = 'dict';

/** @type {'basic'|'advanced'} Active difficulty level. Controls which items appear in the pool. */
var appDifficulty = 'basic';

/** @type {number} Correct answers in the current session. Resets on New Session. */
var correct = 0;

/** @type {number} Total attempts in the current session. Resets on New Session. */
var total = 0;

/** @type {number} Consecutive correct answers. Resets to 0 on any wrong answer or New Session. */
var streak = 0;

// ── Chord mode ────────────────────────────────────────────────────────────────

/** @type {Object|null} The CHORDS entry for the current question. */
var currentChord = null;

/** @type {number[]} MIDI note numbers of all sounding notes in the current chord. */
var currentMidiNotes = [];

/**
 * MIDI note number of the harmonic root of the current chord.
 * Always the theoretical root regardless of voicing or inversion —
 * e.g. for a C major chord in first inversion, this is still C.
 *
 * @type {number|null}
 */
var currentChordRootMidi = null;

// Slash chord state — active when currentChord.family === 'slash'
/** @type {number|null} MIDI note of the bass note (below the upper chord). */
var currentSlashBassMidi = null;

/** @type {number|null} MIDI note of the upper chord's root. */
var currentUpperRootMidi = null;

// Polychord state — active when currentChord.family === 'poly'
/** @type {number[]} MIDI notes of the upper triad. */
var currentPolyUpperMidi = [];

/** @type {number[]} MIDI notes of the lower triad. */
var currentPolyLowerMidi = [];

/** @type {number|null} MIDI root of the upper triad. */
var currentPolyUpperRootMidi = null;

/** @type {number|null} MIDI root of the lower triad. */
var currentPolyLowerRootMidi = null;

// UST (Upper Structure Triad) state — active when currentChord.family === 'ust'
/** @type {number[]} MIDI notes of the two-note shell (3rd + 7th). */
var currentUSTShellMidi = [];

/** @type {number[]} MIDI notes of the upper triad. */
var currentUSTUpperMidi = [];

/**
 * MIDI note of the chord root.
 * Not played in the audio — UST voicings are rootless by design,
 * as the root is assumed to be held by the bass player.
 *
 * @type {number|null}
 */
var currentUSTRootMidi = null;

// ── Chord pool selection ──────────────────────────────────────────────────────

/**
 * Whether inversion questions are enabled. When true, chords may be presented
 * with a note other than the root in the bass.
 *
 * @type {boolean}
 */
var includeInversions = false;

// ── Mode ──────────────────────────────────────────────────────────────────────

/**
 * The currently active practice mode.
 *
 * @type {'chords'|'intervals'|'scales'|'progressions'}
 */
var currentMode = 'intervals';

// ── Interval mode ─────────────────────────────────────────────────────────────

/** @type {Object|null} The INTERVALS entry for the current question. Shape: { name, symbol, semitones }. */
var currentInterval = null;

/** @type {number[]} MIDI note numbers [noteA, noteB] for the current interval question. */
var currentIntervalMidi = [];

/**
 * User-selected interval playback style.
 * 'random' resolves to one of the concrete styles at question time.
 *
 * @type {'harmonic'|'ascending'|'descending'|'random'}
 */
var intervalStyle = 'harmonic';

/**
 * Resolved playback style for the current interval question.
 * When `intervalStyle` is 'random', this holds the style actually used.
 * Always a concrete value ('harmonic' | 'ascending' | 'descending').
 *
 * @type {'harmonic'|'ascending'|'descending'}
 */
var currentIntervalStyle = 'harmonic';

/**
 * User-selected chord playback style.
 * 'random' resolves to one of the concrete styles at question time.
 *
 * @type {'block'|'ascending'|'descending'|'broken'|'random'}
 */
var chordPlayStyle = 'block';

// ── Voicing ───────────────────────────────────────────────────────────────────

/**
 * The voicing symbol currently active in Dictionary mode and post-answer display.
 * Single-select: only one voicing is shown at a time in these contexts.
 *
 * @type {string}
 */
var activeVoicingMode = 'close';

/**
 * The set of voicing symbols included in the quiz training pool.
 * Multi-select: the quiz draws randomly from all voicings in this set.
 * Defaults to `{ 'close' }`.
 *
 * @type {Set<string>}
 */
var selectedVoicings = new Set(['close']);

// ── Scale mode ────────────────────────────────────────────────────────────────

/** @type {Object|null} The SCALES entry for the current question. Shape: { name, symbol, intervals, group, parentKey }. */
var currentScale = null;

/** @type {number} MIDI root note for the current scale question. Default 60 (middle C). */
var currentScaleRootMidi = 60;

/**
 * User-selected scale playback direction.
 * 'random' resolves to 'asc' or 'desc' at question time.
 *
 * @type {'asc'|'desc'|'both'|'random'}
 */
var scaleDirection = 'asc';

/**
 * Resolved playback direction for the current scale question.
 * When `scaleDirection` is 'random', this holds the direction actually used.
 * Always a concrete value ('asc' | 'desc' | 'both').
 *
 * @type {'asc'|'desc'|'both'}
 */
var currentScaleDir = 'asc';

// ── Notation key signature mode ───────────────────────────────────────────────
// Controls whether the staff shows a key signature (key) or explicit accidentals (C).
// Each mode has an independent default: scales default to 'key'; others default to 'C'.

/** @type {'C'|'key'} Notation mode for scales. Resets to 'key' on each new question. */
var scaleKeySigMode = 'key';

/** @type {'C'|'key'} Notation mode for chords. Defaults to 'C' (accidentals shown inline). */
var chordKeySigMode = 'C';

/** @type {'C'|'key'} Notation mode for intervals. Defaults to 'C' (accidentals shown inline). */
var intervalKeySigMode = 'C';

/** @type {'C'|'key'} Notation mode for progressions. Defaults to 'C' (accidentals shown inline). */
var progKeySigMode = 'C';

// ── UX ────────────────────────────────────────────────────────────────────────

/** @type {boolean} Whether the root note badge is shown before the answer is revealed. */
var showRoot = true;

/**
 * Per-item accuracy tracking for the current session.
 * Keyed by item symbol; each entry holds the display name, correct count, and total attempts.
 *
 * @type {Object.<string, { name: string, correct: number, total: number }>}
 */
var sessionStats = {};

// ── Root note & octave register ───────────────────────────────────────────────

/**
 * Pitch class of the pinned root note (0 = C, 1 = C♯/D♭, …, 11 = B).
 * When `pinnedRoot` is set and `pinnedRootSpelling` is null, the random root
 * feature is disabled and every question uses this pitch class.
 * Default is 0 (C). Set to null to enable random root selection.
 *
 * @type {number|null}
 */
var pinnedRoot = 0;

/**
 * Enharmonic spelling override for the pinned root.
 * null = auto-select spelling based on context.
 * 'sharp' | 'flat' = user explicitly chose an enharmonic form.
 *
 * @type {null|'sharp'|'flat'}
 */
var pinnedRootSpelling = null;

/**
 * Octave register constraint for question generation.
 * null = random octave within a sensible range.
 * 'low' = root in octave 2–3 (bass register).
 * 'mid' = root in octave 3–4 (middle register, default).
 * 'high' = root in octave 4–5 (upper register).
 *
 * @type {null|'low'|'mid'|'high'}
 */
var pinnedOctave = null;

// ── Voice leading analysis cache ──────────────────────────────────────────────

/**
 * Cached result of the voice leading analysis for the current chord question.
 * Set once when the answer is revealed by `submitChordAnswer()` via `analyseChord()`
 * in js/engine/voiceLeading.js. Reset to null on each new question.
 *
 * Shape: `{ contexts: Array, isAmbiguous: boolean }`
 * — `contexts`: one entry per harmonic context the chord can appear in,
 *   each with resolution target, cadence type, strength, and voice movement table.
 * — `isAmbiguous`: true when the chord can function in multiple harmonic contexts
 *   (e.g. a fully diminished 7th with four enharmonic roots).
 *
 * @type {{ contexts: Array, isAmbiguous: boolean }|null}
 */
var currentVoiceLeadingAnalysis = null;

// ── Progression mode ──────────────────────────────────────────────────────────
// Progression-specific state (currentProgression, currentProgRootMidi,
// currentProgRootPc, progSlotAnswers, progAnswered) is declared in
// js/data/progressions.js. Selection state (selectedProgressions) is
// initialised in js/engine/defaults.js.

// =============================================================================
// The Sound Travels Ear Training — state.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
