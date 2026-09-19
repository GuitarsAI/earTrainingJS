---
title: state
kind: module
longname: module:state
description: Global runtime state for The Sound Travels Ear Training. Declares all shared mutable variables consumed across the engine, UI, and mode layers. Variables are declared with var (not let ) so they are globally accessible across all script tags without ES module imports. Progression-specific state ( currentProgression , progSlotAnswers , etc.) is declared in js/data/progressions.js because it is tightly coupled to the progressions data schema. Selection state ( selectedChords , selectedIntervals , selectedScales , selectedProgressions ) is initialised in js/engine/defaults.js after the data files are loaded.
---

# state

<SourceLink href="/source/engine/state-js/#L20" label="state.js:20" />

Global runtime state for The Sound Travels Ear Training. Declares all shared mutable variables consumed across the engine, UI, and mode layers. Variables are declared with `var` (not `let`) so they are globally accessible across all script tags without ES module imports.

Progression-specific state (`currentProgression`, `progSlotAnswers`, etc.) is declared in js/data/progressions.js because it is tightly coupled to the progressions data schema. Selection state (`selectedChords`, `selectedIntervals`, `selectedScales`, `selectedProgressions`) is initialised in js/engine/defaults.js after the data files are loaded.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Fields

<MemberHeading id="piano" depth="3" name="piano" sig="piano: Object | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L23" sourceLabel="state.js:23" />

soundfont-player instrument instance. Null until audio initialises.

<MemberHeading id="audioctx" depth="3" name="audioCtx" sig="audioCtx: AudioContext | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L26" sourceLabel="state.js:26" />

Web Audio API context. Null until first user interaction.

<MemberHeading id="answered" depth="3" name="answered" sig="answered: boolean" />

<MemberMeta sourceHref="/source/engine/state-js/#L31" sourceLabel="state.js:31" />

Whether the current question has been answered. Resets on each new question.

<MemberHeading id="appmode" depth="3" name="appMode" sig="appMode: 'quiz' | 'dict'" />

<MemberMeta sourceHref="/source/engine/state-js/#L34" sourceLabel="state.js:34" />

Active app mode. 'quiz' = training mode; 'dict' = dictionary/reference mode.

<MemberHeading id="appdifficulty" depth="3" name="appDifficulty" sig="appDifficulty: 'basic' | 'advanced'" />

<MemberMeta sourceHref="/source/engine/state-js/#L37" sourceLabel="state.js:37" />

Active difficulty level. Controls which items appear in the pool.

<MemberHeading id="correct" depth="3" name="correct" sig="correct: number" />

<MemberMeta sourceHref="/source/engine/state-js/#L40" sourceLabel="state.js:40" />

Correct answers in the current session. Resets on New Session.

<MemberHeading id="total" depth="3" name="total" sig="total: number" />

<MemberMeta sourceHref="/source/engine/state-js/#L43" sourceLabel="state.js:43" />

Total attempts in the current session. Resets on New Session.

<MemberHeading id="streak" depth="3" name="streak" sig="streak: number" />

<MemberMeta sourceHref="/source/engine/state-js/#L46" sourceLabel="state.js:46" />

Consecutive correct answers. Resets to 0 on any wrong answer or New Session.

<MemberHeading id="currentchord" depth="3" name="currentChord" sig="currentChord: Object | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L51" sourceLabel="state.js:51" />

The CHORDS entry for the current question.

<MemberHeading id="currentmidinotes" depth="3" name="currentMidiNotes" sig="currentMidiNotes: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L54" sourceLabel="state.js:54" />

MIDI note numbers of all sounding notes in the current chord.

<MemberHeading id="currentchordrootmidi" depth="3" name="currentChordRootMidi" sig="currentChordRootMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L63" sourceLabel="state.js:63" />

MIDI note number of the harmonic root of the current chord. Always the theoretical root regardless of voicing or inversion — e.g. for a C major chord in first inversion, this is still C.

<MemberHeading id="currentslashbassmidi" depth="3" name="currentSlashBassMidi" sig="currentSlashBassMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L67" sourceLabel="state.js:67" />

MIDI note of the bass note (below the upper chord).

<MemberHeading id="currentupperrootmidi" depth="3" name="currentUpperRootMidi" sig="currentUpperRootMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L70" sourceLabel="state.js:70" />

MIDI note of the upper chord's root.

<MemberHeading id="currentpolyuppermidi" depth="3" name="currentPolyUpperMidi" sig="currentPolyUpperMidi: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L74" sourceLabel="state.js:74" />

MIDI notes of the upper triad.

<MemberHeading id="currentpolylowermidi" depth="3" name="currentPolyLowerMidi" sig="currentPolyLowerMidi: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L77" sourceLabel="state.js:77" />

MIDI notes of the lower triad.

<MemberHeading id="currentpolyupperrootmidi" depth="3" name="currentPolyUpperRootMidi" sig="currentPolyUpperRootMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L80" sourceLabel="state.js:80" />

MIDI root of the upper triad.

<MemberHeading id="currentpolylowerrootmidi" depth="3" name="currentPolyLowerRootMidi" sig="currentPolyLowerRootMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L83" sourceLabel="state.js:83" />

MIDI root of the lower triad.

<MemberHeading id="currentustshellmidi" depth="3" name="currentUSTShellMidi" sig="currentUSTShellMidi: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L87" sourceLabel="state.js:87" />

MIDI notes of the two-note shell (3rd + 7th).

<MemberHeading id="currentustuppermidi" depth="3" name="currentUSTUpperMidi" sig="currentUSTUpperMidi: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L90" sourceLabel="state.js:90" />

MIDI notes of the upper triad.

<MemberHeading id="currentustrootmidi" depth="3" name="currentUSTRootMidi" sig="currentUSTRootMidi: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L99" sourceLabel="state.js:99" />

MIDI note of the chord root. Not played in the audio — UST voicings are rootless by design, as the root is assumed to be held by the bass player.

<MemberHeading id="includeinversions" depth="3" name="includeInversions" sig="includeInversions: boolean" />

<MemberMeta sourceHref="/source/engine/state-js/#L109" sourceLabel="state.js:109" />

Whether inversion questions are enabled. When true, chords may be presented with a note other than the root in the bass.

<MemberHeading id="currentmode" depth="3" name="currentMode" sig="currentMode: 'chords' | 'intervals' | 'scales' | 'progressions'" />

<MemberMeta sourceHref="/source/engine/state-js/#L118" sourceLabel="state.js:118" />

The currently active practice mode.

<MemberHeading id="currentinterval" depth="3" name="currentInterval" sig="currentInterval: Object | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L123" sourceLabel="state.js:123" />

The INTERVALS entry for the current question. Shape: { name, symbol, semitones }.

<MemberHeading id="currentintervalmidi" depth="3" name="currentIntervalMidi" sig="currentIntervalMidi: Array.<number>" />

<MemberMeta sourceHref="/source/engine/state-js/#L126" sourceLabel="state.js:126" />

MIDI note numbers \[noteA, noteB] for the current interval question.

<MemberHeading id="intervalstyle" depth="3" name="intervalStyle" sig="intervalStyle: 'harmonic' | 'ascending' | 'descending' | 'random'" />

<MemberMeta sourceHref="/source/engine/state-js/#L134" sourceLabel="state.js:134" />

User-selected interval playback style. 'random' resolves to one of the concrete styles at question time.

<MemberHeading id="currentintervalstyle" depth="3" name="currentIntervalStyle" sig="currentIntervalStyle: 'harmonic' | 'ascending' | 'descending'" />

<MemberMeta sourceHref="/source/engine/state-js/#L143" sourceLabel="state.js:143" />

Resolved playback style for the current interval question. When `intervalStyle` is 'random', this holds the style actually used. Always a concrete value ('harmonic' | 'ascending' | 'descending').

<MemberHeading id="chordplaystyle" depth="3" name="chordPlayStyle" sig="chordPlayStyle: 'block' | 'ascending' | 'descending' | 'broken' | 'random'" />

<MemberMeta sourceHref="/source/engine/state-js/#L151" sourceLabel="state.js:151" />

User-selected chord playback style. 'random' resolves to one of the concrete styles at question time.

<MemberHeading id="activevoicingmode" depth="3" name="activeVoicingMode" sig="activeVoicingMode: string" />

<MemberMeta sourceHref="/source/engine/state-js/#L161" sourceLabel="state.js:161" />

The voicing symbol currently active in Dictionary mode and post-answer display. Single-select: only one voicing is shown at a time in these contexts.

<MemberHeading id="selectedvoicings" depth="3" name="selectedVoicings" sig="selectedVoicings: Set.<string>" />

<MemberMeta sourceHref="/source/engine/state-js/#L170" sourceLabel="state.js:170" />

The set of voicing symbols included in the quiz training pool. Multi-select: the quiz draws randomly from all voicings in this set. Defaults to `{ 'close' }`.

<MemberHeading id="currentscale" depth="3" name="currentScale" sig="currentScale: Object | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L175" sourceLabel="state.js:175" />

The SCALES entry for the current question. Shape: { name, symbol, intervals, group, parentKey }.

<MemberHeading id="currentscalerootmidi" depth="3" name="currentScaleRootMidi" sig="currentScaleRootMidi: number" />

<MemberMeta sourceHref="/source/engine/state-js/#L178" sourceLabel="state.js:178" />

MIDI root note for the current scale question. Default 60 (middle C).

<MemberHeading id="scaledirection" depth="3" name="scaleDirection" sig="scaleDirection: 'asc' | 'desc' | 'both' | 'random'" />

<MemberMeta sourceHref="/source/engine/state-js/#L186" sourceLabel="state.js:186" />

User-selected scale playback direction. 'random' resolves to 'asc' or 'desc' at question time.

<MemberHeading id="currentscaledir" depth="3" name="currentScaleDir" sig="currentScaleDir: 'asc' | 'desc' | 'both'" />

<MemberMeta sourceHref="/source/engine/state-js/#L195" sourceLabel="state.js:195" />

Resolved playback direction for the current scale question. When `scaleDirection` is 'random', this holds the direction actually used. Always a concrete value ('asc' | 'desc' | 'both').

<MemberHeading id="scalekeysigmode" depth="3" name="scaleKeySigMode" sig="scaleKeySigMode: 'C' | 'key'" />

<MemberMeta sourceHref="/source/engine/state-js/#L202" sourceLabel="state.js:202" />

Notation mode for scales. Resets to 'key' on each new question.

<MemberHeading id="chordkeysigmode" depth="3" name="chordKeySigMode" sig="chordKeySigMode: 'C' | 'key'" />

<MemberMeta sourceHref="/source/engine/state-js/#L205" sourceLabel="state.js:205" />

Notation mode for chords. Defaults to 'C' (accidentals shown inline).

<MemberHeading id="intervalkeysigmode" depth="3" name="intervalKeySigMode" sig="intervalKeySigMode: 'C' | 'key'" />

<MemberMeta sourceHref="/source/engine/state-js/#L208" sourceLabel="state.js:208" />

Notation mode for intervals. Defaults to 'C' (accidentals shown inline).

<MemberHeading id="progkeysigmode" depth="3" name="progKeySigMode" sig="progKeySigMode: 'C' | 'key'" />

<MemberMeta sourceHref="/source/engine/state-js/#L211" sourceLabel="state.js:211" />

Notation mode for progressions. Defaults to 'C' (accidentals shown inline).

<MemberHeading id="showroot" depth="3" name="showRoot" sig="showRoot: boolean" />

<MemberMeta sourceHref="/source/engine/state-js/#L216" sourceLabel="state.js:216" />

Whether the root note badge is shown before the answer is revealed.

<MemberHeading id="sessionstats" depth="3" name="sessionStats" sig="sessionStats: Object.<string, {name: string, correct: number, total: number}>" />

<MemberMeta sourceHref="/source/engine/state-js/#L224" sourceLabel="state.js:224" />

Per-item accuracy tracking for the current session. Keyed by item symbol; each entry holds the display name, correct count, and total attempts.

<MemberHeading id="pinnedroot" depth="3" name="pinnedRoot" sig="pinnedRoot: number | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L236" sourceLabel="state.js:236" />

Pitch class of the pinned root note (0 = C, 1 = C♯/D♭, …, 11 = B). When `pinnedRoot` is set and `pinnedRootSpelling` is null, the random root feature is disabled and every question uses this pitch class. Default is 0 (C). Set to null to enable random root selection.

<MemberHeading id="pinnedrootspelling" depth="3" name="pinnedRootSpelling" sig="pinnedRootSpelling: null | 'sharp' | 'flat'" />

<MemberMeta sourceHref="/source/engine/state-js/#L245" sourceLabel="state.js:245" />

Enharmonic spelling override for the pinned root. null = auto-select spelling based on context. 'sharp' | 'flat' = user explicitly chose an enharmonic form.

<MemberHeading id="pinnedoctave" depth="3" name="pinnedOctave" sig="pinnedOctave: null | 'low' | 'mid' | 'high'" />

<MemberMeta sourceHref="/source/engine/state-js/#L256" sourceLabel="state.js:256" />

Octave register constraint for question generation. null = random octave within a sensible range. 'low' = root in octave 2–3 (bass register). 'mid' = root in octave 3–4 (middle register, default). 'high' = root in octave 4–5 (upper register).

<MemberHeading id="currentvoiceleadinganalysis" depth="3" name="currentVoiceLeadingAnalysis" sig="currentVoiceLeadingAnalysis: Object | null" />

<MemberMeta sourceHref="/source/engine/state-js/#L273" sourceLabel="state.js:273" />

Cached result of the voice leading analysis for the current chord question. Set once when the answer is revealed by `submitChordAnswer()` via `analyseChord()` in js/engine/voiceLeading.js. Reset to null on each new question.

Shape: `{ contexts: Array, isAmbiguous: boolean }` — `contexts`: one entry per harmonic context the chord can appear in, each with resolution target, cadence type, strength, and voice movement table. — `isAmbiguous`: true when the chord can function in multiple harmonic contexts (e.g. a fully diminished 7th with four enharmonic roots).
