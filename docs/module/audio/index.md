---
title: Audio
kind: module
longname: module:Audio
description: "Web Audio API lifecycle and soundfont playback for all four practice modes. Owns AudioContext initialisation, instrument loading, play-state UI feedback, and every mode's playback function. Contains no music theory logic — it consumes MIDI note arrays produced by mode files and schedules them via soundfont-player. Production note: initAudio() must be updated before the v1.0.0 build to point at the self-hosted soundfont path per §4.3 of the production plan."
---

# Audio

<SourceLink href="/source/engine/audio-js/#L18" label="audio.js:18" />

Web Audio API lifecycle and soundfont playback for all four practice modes. Owns AudioContext initialisation, instrument loading, play-state UI feedback, and every mode's playback function. Contains no music theory logic — it consumes MIDI note arrays produced by mode files and schedules them via soundfont-player.

Production note: initAudio() must be updated before the v1.0.0 build to point at the self-hosted soundfont path per §4.3 of the production plan.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="initaudio" depth="3" name="initAudio" sig="initAudio(): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L29" sourceLabel="audio.js:29" />

Creates the AudioContext and loads the acoustic grand piano soundfont. Races the Soundfont.instrument() call against a 12-second timeout so the app degrades gracefully on slow or offline connections. On success, assigns the instrument to `piano`, re-enables #playBtn, and updates the hint text. On failure, shows an error message in #chordHint.

**Returns**

- `void`

<MemberHeading id="setplayingstate" depth="3" name="setPlayingState" sig="setPlayingState(on: boolean): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L62" sourceLabel="audio.js:62" />

Toggles the visual playing state of #playBtn. When on, applies the 'playing' CSS class and shows the music note icon (♩). When off, removes the class and restores the play icon (▶).

**Parameters**

- `on` (boolean) — True to enter playing state; false to exit.

**Returns**

- `void`

<MemberHeading id="playmidinotes" depth="3" name="playMidiNotes" sig="playMidiNotes(midiNotes: Array.<number>, style: string): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L83" sourceLabel="audio.js:83" />

Plays a list of MIDI notes in the requested style. Used by playInterval(). Resumes a suspended AudioContext before scheduling notes.

Styles:

- 'harmonic' — all notes simultaneously; playing state clears after 2.2s.
- 'ascending' — notes from lowest to highest, 0.55s apart.
- 'descending' — notes from highest to lowest, 0.55s apart.

**Parameters**

- `midiNotes` (Array.\<number>) — MIDI note numbers to play, in any order.
- `style` (string) — Playback style: 'harmonic' | 'ascending' | 'descending'.

**Returns**

- `void`

<MemberHeading id="resolvechordstyle" depth="3" name="resolveChordStyle" sig="resolveChordStyle(): string" />

<MemberMeta sourceHref="/source/engine/audio-js/#L113" sourceLabel="audio.js:113" />

Resolves chordPlayStyle to a concrete playback style for the current question. If chordPlayStyle is 'random', picks uniformly from the four concrete options. Otherwise returns chordPlayStyle unchanged.

**Returns**

- `string` — Concrete style: 'block' | 'ascending' | 'descending' | 'broken'.

<MemberHeading id="playchord" depth="3" name="playChord" sig="playChord(): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L136" sourceLabel="audio.js:136" />

Plays the current chord question. Resolves and stores the playback style in currentChordPlayStyle so showNotation() can mirror exactly what was heard. For slash chords, prepends currentSlashBassMidi to the note set before sorting — poly and UST notes are already fully assembled in currentMidiNotes.

Styles:

- 'block' — all notes simultaneously.
- 'ascending' — notes low to high, 0.18s apart.
- 'descending' — notes high to low, 0.18s apart.
- 'broken' — root → top → 2nd → top pattern, 0.28s apart (classical broken chord feel; falls back to root when only two notes).

**Returns**

- `void`

<MemberHeading id="resolveintervalstyle" depth="3" name="resolveIntervalStyle" sig="resolveIntervalStyle(): string" />

<MemberMeta sourceHref="/source/engine/audio-js/#L186" sourceLabel="audio.js:186" />

Resolves intervalStyle to a concrete playback style for the current question. If intervalStyle is 'random', picks uniformly from the three concrete options.

**Returns**

- `string` — Concrete style: 'harmonic' | 'ascending' | 'descending'.

<MemberHeading id="playinterval" depth="3" name="playInterval" sig="playInterval(): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L201" sourceLabel="audio.js:201" />

Plays the current interval question. Resolves and stores the style in currentIntervalStyle so the breakdown and notation display what was heard, then delegates to playMidiNotes().

**Returns**

- `void`

<MemberHeading id="resolvescaledir" depth="3" name="resolveScaleDir" sig="resolveScaleDir(): string" />

<MemberMeta sourceHref="/source/engine/audio-js/#L214" sourceLabel="audio.js:214" />

Resolves scaleDirection to a concrete direction for the current question. If scaleDirection is 'random', picks uniformly from the three concrete options.

**Returns**

- `string` — Concrete direction: 'asc' | 'desc' | 'both'.

<MemberHeading id="playscale" depth="3" name="playScale" sig="playScale(): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L233" sourceLabel="audio.js:233" />

Plays the current scale question. Resolves and stores the direction in currentScaleDir, then builds the note sequence and schedules playback at 0.38s per note. If the question has already been answered, calls showNotation() to sync the notation display before playing.

For 'both', the ascending and descending sequences share the top note (descNotes starts at index 1) to avoid repeating the octave.

**Returns**

- `void`

<MemberHeading id="playslowly" depth="3" name="playSlowly" sig="playSlowly(): void" />

<MemberMeta sourceHref="/source/engine/audio-js/#L276" sourceLabel="audio.js:276" />

Replays the current question at half speed. Uses the stored resolved style and direction (currentIntervalStyle, currentScaleDir, currentChordPlayStyle) rather than re-resolving, so slow replay always matches what was originally heard. Dispatches to playProgressionSlowly() for progressions mode.

Mode-specific behaviour:

- Scales — same direction as original playback, note gap doubled to 0.76s.
- Intervals — same style as original; harmonic stays simultaneous, melodic gap extended to 1.1s.
- Chords (resolution view) — slow ascending arpeggio of source chord, 0.5s pause, then slow ascending arpeggio of resolution target.
- Chords — always slow ascending arpeggio at 0.5s gap, regardless of the original playback style.

**Returns**

- `void`
