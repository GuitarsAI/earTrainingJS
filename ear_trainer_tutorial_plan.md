# The Sound Travels Ear Trainer — Tutorial Series Plan

A complete, build-from-scratch tutorial series for music technology students.
Students have basic HTML knowledge. No prior JavaScript or advanced music theory assumed.
Every part ends with working, listenable, playable code.

---

## Overall Philosophy

Each section follows a consistent four-beat structure:

1. **Music theory** — explain the concept in plain language with real musical examples
2. **Why in code** — explain what we are about to build and why we structure it this way
3. **The code** — heavily commented, runnable cells, editable by the student
4. **Reflection** — what to notice, what to change, what to listen for

Parts may be split into Part A and Part B if the content is too large.
The split points are marked below where this is likely.

---

## Part 1 — The Language of Pitch

**Music theory covered:** The octave, the piano keyboard, white and black keys,
note names (A–G), sharps and flats, enharmonic equivalents (C# = Db),
the chromatic scale, what a semitone is.

**Code covered:** What JavaScript is and where it runs, the `<script>` tag,
`console.log`, variables (`const`, `let`), strings, numbers, arrays,
array indexing, the modulo operator `%` and why it models the octave perfectly,
the `NOTE_NAMES` array, writing a first `midiToName()` function.

**HTML/CSS covered:** Refresher on the HTML document structure, `<!DOCTYPE html>`,
`<head>` and `<body>`, linking Google Fonts, the `<style>` block vs external CSS,
`box-sizing: border-box`, the CSS reset pattern, `font-family` stack.

**Ends with:** A working cell that prints every note name with its pitch-class number,
and a function that converts any MIDI number to a human-readable note name like `C4` or `A#3`.

---

## Part 2 — Intervals: The Distance Between Notes

**Music theory covered:** What an interval is, why intervals matter more than
individual notes, all 12 intervals from minor 2nd to octave, consonance vs dissonance,
the difference between harmonic (simultaneous) and melodic (sequential) intervals,
how interval names work (quality + number: Major 3rd, Perfect 5th, etc.),
the tritone and why it is special, common musical contexts for each interval
(e.g. Perfect 4th in "Here Comes the Bride", Minor 2nd in the Jaws theme).

**Code covered:** Arrays of objects (the `INTERVALS` data structure), object properties
(`.name`, `.symbol`, `.semitones`), `forEach`, `find`, arrow functions, template literals,
writing a function that takes two MIDI notes and returns the interval name between them.

**HTML/CSS covered:** CSS custom properties (`--accent`, `--text`, etc.) — what they are,
why they exist, how `var()` works, scoping to `:root`. Introduction to the app's
colour palette and design token system.

**Ends with:** A runnable cell that, given any two MIDI numbers, names the interval,
describes its character, and prints its semitone distance. A styled interval reference
table rendered in HTML.

---

## Part 3 — Triads: The First Chords

**Music theory covered:** What a chord is, how chords are built by stacking intervals,
the four triad types (major, minor, diminished, augmented), why major sounds bright and
minor sounds dark (the role of the third), the root–third–fifth structure,
chord symbols (C, Cm, Cdim, Caug), how to build any triad from any root using semitone intervals.

**Code covered:** Nested data structures (arrays inside objects inside objects),
the `CHORD_TYPES` object and its `major`, `minor`, `diminished`, `augmented` arrays,
`map()` to transform interval arrays into MIDI note arrays, writing `buildChord(rootMidi, intervals)`,
destructuring, default parameters.

**HTML/CSS covered:** Flexbox in depth — `display: flex`, `flex-direction`, `justify-content`,
`align-items`, `gap`, `flex-wrap`, `flex: 1`. Building the chord chip row UI.
The `.pool-chip` component and its active/inactive states.

**Ends with:** A cell that builds and prints any triad given a root and chord type.
A styled chip row where clicking a chord type name prints its notes to the console.

---

## Part 4 — Seventh Chords

**Music theory covered:** Adding the seventh to a triad, the four seventh chord types
(major 7, dominant 7, minor 7, half-diminished / minor 7b5, fully diminished 7),
why the dominant seventh is the most harmonically tense chord,
Berklee chord symbols (Maj7, 7, m7, m7b5, dim7), the difference between Maj7 and dom7,
the tritone inside the dominant seventh and how it drives resolution.

**Code covered:** Extending the `CHORD_TYPES` data structure, the full `dominant` and
`diminished` family arrays, writing a `getChordBySymbol()` lookup function,
`Set` — what it is and why we use it for the selected chord pool (`selectedChords`),
`Set.has()`, `Set.add()`, `Set.delete()`.

**HTML/CSS covered:** CSS transitions — `transition: background 0.15s, border-color 0.15s`,
why transitions make UI feel polished, `cursor: pointer`, `:hover` pseudo-class,
building the full `.pool-panel` collapsible component.

**Ends with:** A cell that builds any seventh chord and prints its notes with interval names.
The pool panel now shows both triads and seventh chords as selectable chips.

---

## Part 5 — Extended Chords and the Full Chord Library

**Music theory covered:** What happens beyond the octave — ninths, elevenths, thirteenths,
why we number them 9/11/13 instead of 2/4/6, how extensions are added to a seventh chord base,
Berklee extended chord symbols (9, Maj9, m9, 11, 13, etc.), altered extensions (b9, #9, #11, b13),
suspended chords (sus2, sus4) and why they have no third, the six chord families
(major, minor, dominant, diminished, augmented, suspended) and their musical roles.

**Code covered:** Completing the full `CHORD_TYPES` object with all six families,
the `getAllChords()` function, `filter()`, `spread operator` (`...`) for merging arrays,
writing `getActivePool()` from the `selectedChords` Set, `Math.floor()`, `Math.random()`,
`pickRandom()` helper function.

**HTML/CSS covered:** `border-radius`, `box-shadow` with CSS variables (`var(--shadow)`),
`overflow: hidden` on rounded containers, the `.pool-panel-body` open/closed toggle,
`display: none` vs `display: block`, using JavaScript to toggle CSS classes.

**Ends with:** The complete chord library is in place. A cell that picks a random chord
from the active pool and prints its full description. The pool panel shows all six families.

---

## Part 6 — Web Audio API: Making Sound

**Music theory covered:** How digital audio works (sampling, sample rate, bit depth),
what a soundfont is and why we use sampled piano instead of oscillators,
MIDI velocity and dynamics, what audio latency is and why scheduling matters.

**Code covered:** `async` / `await` — what asynchronous code means and why audio loading
requires it, `fetch()` to load audio files from a server, `AudioContext`,
`decodeAudioData()`, storing decoded buffers in an object (`piano = {}`),
`createBufferSource()`, `connect()` to `destination`, `.start()` and `.stop()`,
`midiToSoundFontName()` — how MIDI numbers map to soundfont file names.
The full `initAudio()` function dissected line by line.

**HTML/CSS covered:** The play button — `border-radius: 50%` for circles, `width` + `height`
for square aspect ratio, `display: inline-flex` + `align-items: center` + `justify-content: center`
for centred icon, the teal glow `box-shadow` on hover, CSS `transition` for the press animation.

**Ends with:** Clicking the play button plays a single piano note. The student can change
the MIDI number in the cell and hear a different pitch.

---

## Part 7 — Playing Chords: Timing and Playback Styles

**Music theory covered:** Block chords vs arpeggios, ascending vs descending voicing,
broken chord patterns, why different playback styles reveal different aspects of a chord's sound,
how jazz pianists voice chords differently from classical pianists.

**Code covered:** `setTimeout` — scheduling events in time, why we can't use a simple loop
for audio timing, the playback pipeline for block/ascending/descending/broken/random styles,
the `chordPlayStyle` state variable, the full `playChord()` function, handling the `random`
style with `pickRandom()`, `currentMidiNotes` state.

**HTML/CSS covered:** The chord style chip row, `flex-wrap: wrap` for responsive chip rows,
`min-height: 2.75rem` for touch targets and why 44px is the accessibility standard,
the sticky header shell — `position: fixed`, `top: 0`, `left: 0`, `right: 0`, `z-index`,
why the `body` needs `padding-top` to compensate.

**Ends with:** Full chord playback with all five styles selectable via chips.
The sticky header is in place. Clicking any chip and pressing play produces the correct style.

---

## Part 8 — The Quiz Engine: Questions, Answers, Scoring

**Music theory covered:** What ear training is and why it matters, the difference between
recognising a chord by name and recognising it by sound, how professional musicians
use ear training in practice (transcription, session work, improvisation).

**Code covered:** `generateQuestion()` — picking a random chord and root, `chooseRootMidi()`
and how the octave band system works, `currentChord` and `currentMidiNotes` state variables,
building the answer dropdown dynamically with `document.createElement`, `appendChild`,
`addEventListener('change')`, the `answered` flag, `correct` / `total` / `streak` counters,
`recordAnswer()`, `renderStats()`, the `resetSession()` function.

**HTML/CSS covered:** The answer dropdown — `<select>` and `<option>` styling,
the feedback colours (`.correct-bg`, `.wrong-bg`) and their CSS variable definitions,
`border-left` for the callout style feedback panel, the score pill row,
`font-weight: 600` for numeric emphasis.

**Ends with:** A complete working chord quiz — triads and seventh chords, random roots,
block playback, dropdown answer, green/red feedback, score tracking, streak counter.
This is a real, usable ear training tool.

---

## Part 9 — The UI System: CSS Architecture and Dark Mode

**Music theory covered:** (No new music theory — this part is entirely CSS/JS architecture.)

**Code covered:** `localStorage` — storing and retrieving user preferences across sessions,
`localStorage.getItem()`, `localStorage.setItem()`, the theme toggle IIFE
(Immediately Invoked Function Expression) — what an IIFE is and why we use one here,
`document.documentElement.setAttribute('data-theme', 'dark')`, the `data-*` attribute pattern.

**HTML/CSS covered:** The full CSS custom property system in depth — light mode variables,
dark mode overrides with `[data-theme="dark"]` selector, how `var()` cascades,
WCAG AA contrast requirements (what they are and why they matter), `rem` units vs `px`
and browser accessibility settings, the complete dark mode colour palette and how
each variable was chosen, `transition: background 0.2s, color 0.2s` on `body`
for smooth theme switching, the theme toggle button as a 44px circular touch target.

**Ends with:** The app has a fully working dark/light mode toggle that persists across
page reloads. Every colour in the app responds correctly to the theme switch.

---

## Part 10 — Scales: Structure and Theory

**Music theory covered:** What a scale is, the major scale and its whole-step/half-step pattern,
the natural minor scale, the relationship between relative major and minor (same notes, different root),
the harmonic minor (raised 7th) and why it exists, the melodic minor and its classical use,
pentatonic scales — major and minor pentatonic and why they appear in every musical culture,
the blues scale and the blue note, the whole tone scale and its symmetry, the augmented scale,
the Prometheus scale.

**Code covered:** The `SCALES` array structure, the four group boundaries
(pentatonic / hexatonic / diatonic / octatonic), `filter()` to extract groups,
`getActiveScalePool()`, the `selectedScales` Set, `currentScale` and `currentScaleRootMidi` state.

**HTML/CSS covered:** The pool panel scale section — dynamically rendering scale chips by group,
`pool-section-title` uppercase label styling, the All/None buttons and their `pool-all-btn` style,
`text-transform: uppercase`, `letter-spacing`.

**Ends with:** The scale library is in place with all pentatonic and hexatonic scales.
The pool panel shows scale chips grouped by type. Selecting different scales updates the active pool.

---

## Part 11 — Greek Modes in Depth

**Music theory covered:** What a mode is — not just "starting on a different note"
but a genuinely different tonal colour, the seven Greek modes in full detail:

- **Ionian** — the major scale, bright and settled
- **Dorian** — minor with a raised 6th, the jazz minor sound (So What, Scarborough Fair)
- **Phrygian** — minor with a flattened 2nd, dark and Spanish (flamenco, metal)
- **Lydian** — major with a raised 4th, dreamy and floating (film scores, Simpsons theme)
- **Mixolydian** — major with a flattened 7th, bluesy and rock (Norwegian Wood, Sweet Home Chicago)
- **Aeolian** — the natural minor scale
- **Locrian** — diminished tonic, theoretically complete but rarely used as a tonal centre

For each mode: its interval pattern, its characteristic interval, its emotional character,
real-world examples from recorded music, and how it relates to its parent major scale.
Also covered: Phrygian Dominant (mode 5 of harmonic minor), Lydian Dominant (mode 4 of melodic minor),
the Altered scale (mode 7 of melodic minor) and its role in jazz.

**Code covered:** Adding all modal scales to the `SCALES` array, the `symbol` naming convention,
`scaleDirection` state ('asc' | 'desc' | 'both' | 'random'), `currentScaleDir` for resolved direction,
the `playScale()` function — how sequential note playback is timed with `setTimeout`,
`renderScaleDirChips()`.

**HTML/CSS covered:** The scale direction chip row, the `scale-dir-chip` active state,
`border-bottom: 2px solid var(--accent)` for the active mode tab underline,
the mode tab bar — `display: flex`, `border-top`, `flex: 1` for equal-width tabs.

**Ends with:** The full diatonic and modal scale library is playable. The quiz now includes
a working scales mode with direction chips and correct pool panel grouping.

---

## Part 12 — Octatonic Scales and Scale Playback

**Music theory covered:** The diminished scales — whole-half and half-whole (octatonic),
their symmetry (repeating at minor 3rd intervals), their use over diminished and dominant chords,
the difference between W-H and H-W and which chord type each fits.
A brief survey of all 28 scales in the library and how they are grouped.

**Code covered:** Completing the `SCALES` array with octatonic entries,
the `chooseSimpleRootMidi()` function and how it differs from `chooseRootMidi()`,
the full scale quiz question generation pipeline — `generateScaleQuestion()`,
`updateRootBadge()`, the `showRoot` toggle and how it hides/shows the root before answering.

**HTML/CSS covered:** The root badge — `position: relative` vs `absolute`, badge styling
with `border-radius`, `background: var(--bg-chip-active)`, the root note + octave register
chip rows (`#rootChips`, `#octaveChips`), `renderRegisterPanel()` dissected.

**Ends with:** The complete scale quiz is working — all 28 scales, all directions,
root badge, register control. The quiz now has two fully working modes: Chords and Scales.

---

## Part 13 — Intervals Mode and Playback

**Music theory covered:** Revisiting intervals in the context of ear training —
how to recognise intervals by their sound rather than by calculation,
harmonic vs melodic presentation, ascending vs descending recognition,
classic interval mnemonics and why they work, consonance categories
(perfect consonances, imperfect consonances, dissonances).

**Code covered:** The `INTERVALS` array, `INTERVAL_STYLES`, `intervalStyle` and
`currentIntervalStyle` state, `generateIntervalQuestion()`, `playInterval()` —
how harmonic playback differs from melodic (simultaneous vs sequential `setTimeout`),
`renderIntervalStyleChips()`, the `random` direction resolution.

**HTML/CSS covered:** The interval style chip row, `display` toggling for mode-specific
panels (`chordStyleSection`, `intervalStyleSection`, `scaleDirSection`) using
`style.display = mode === 'intervals' ? '' : 'none'`, the `switchMode()` function
and how the tab bar connects to mode state.

**Ends with:** All three quiz modes work — Chords, Intervals, Scales.
The mode tabs switch correctly, each showing its own playback controls.
This is now a three-mode ear training application.

---

## Part 14 — Music Notation: Reading the Staff

**Music theory covered:** How sheet music works — the staff (5 lines, 4 spaces),
treble clef and its mnemonic, bass clef and its mnemonic, the grand staff
(treble + bass joined by a brace), middle C and how it sits between the staves
on a ledger line, note heads and stems, accidentals (sharp, flat, natural),
key signatures vs accidentals, ledger lines above and below the staff,
how pitch is determined by line/space position + clef + accidentals.

**Code covered:** What VexFlow is — a JavaScript library for rendering music notation in SVG,
loading VexFlow via CDN, `Renderer`, `Stave`, `StaveNote`, `Voice`, `Formatter`,
how VexFlow key strings work (`"c/4"`, `"fn/4"`, `"bb/3"`), the `showNotation()` wrapper
function, the `notation-svg` container, `Beam` for grouped notes.

**HTML/CSS covered:** The notation card — `.play-area` styles, `border-radius: 14px`,
`background: var(--bg-card)`, why the notation card is fixed to `#fff` in both themes
(Point 20c) — the reasoning behind overriding a CSS variable for a specific component,
`overflow: hidden` to clip SVG to card boundaries.

**Ends with:** The app now displays sheet music for every chord played. A cell that
renders a user-defined list of notes on a grand staff. The student can change the
notes and see the staff update.

---

## Part 15 — Enharmonic Spelling and the Notation Engine

**Music theory covered:** Why enharmonic spelling matters — C# and Db are the same pitch
but different notes, how key context determines the correct spelling, the circle of fifths
and spelling conventions, why a Cmaj7 chord uses B not Cb, why an Eb minor chord
uses Gb not F#, how the app's `SYMBOL_SPELLING` table encodes these rules,
figured bass notation for inversions.

**Code covered:** The `SYMBOL_SPELLING` lookup table — its structure and design rationale,
`spelledNote(pitchClass, chordSymbol, rootPitchClass)` dissected in full,
how enharmonic VexFlow keys are chosen (`"bb/3"` vs `"as/3"`), the `showBreakdown()` function
and its three row types (Notes, From root, Between notes), the figured bass header
for inverted chords.

**HTML/CSS covered:** The breakdown panel — `.breakdown-panel` layout, definition list
(`<dl>`, `<dt>`, `<dd>`) vs table for the interval rows, `border-top` dividers,
`font-family: var(--mono)` for numeric/interval data, `color: var(--text-muted)` hierarchy.

**Ends with:** The notation now spells notes correctly for every chord type.
The breakdown panel shows full interval analysis below every answered question.

---

## Part 16 — Inversions

**Music theory covered:** What an inversion is — moving the lowest note up an octave,
first inversion (third in the bass), second inversion (fifth in the bass),
third inversion (seventh in the bass), figured bass labels (6, 6/4, 6/5, 4/3, 4/2),
why inversions matter — smoother voice leading, bass line variety, how to recognise
inversions by ear (the bass note is no longer the root).

**Code covered:** `applyInversion(baseIntervals, rootMidi, invIndex)` — the `shift()` / `push()`
pattern for rotating notes, `buildInversionPool()` — how inversion entries are generated
from base chords, `invIndex` and `baseChord` properties, the `INV_LABELS` array,
the `includeInversions` toggle and how it extends `getActivePool()`.

**HTML/CSS covered:** The inversions toggle row — `.pool-inv-row`, `<input type="checkbox">`,
`<label>` with `display: flex` + `align-items: center`, associating a label with an input
via `for` / `id` for accessibility, styling a custom checkbox.

**Ends with:** Inversions are enabled. The quiz can now play and ask about inverted chords.
The breakdown panel shows the correct figured bass label. Notation shows the inverted voicing.

---

## Part 17 — Voicing Modes

**Music theory covered:** What a voicing is vs what a chord is — same notes, different
arrangement, full voicing (all notes), real voicing (omitting the fifth in jazz),
shell voicing (root + third + seventh only), guide tones (third + seventh without root) —
why guide tones define the chord quality and are essential in jazz comping,
how different voicings suit different musical contexts.

**Code covered:** The `VOICING_MODES` array, `applyVoicingMode(baseIntervals, mode)` —
how interval roles are classified (`root`, `third`, `fifth`, `altfifth`, `seventh`, `extension`),
the filtering logic for each mode, how `altfifth` overrides the `real` mode omission,
`activeVoicingMode` state, `renderVoicingChips()`.

**HTML/CSS covered:** The voicing chip row — `.voicing-mode-row`, `.voicing-chip`,
`display` toggling for chord-only panels, how the Settings panel collapsible works —
`classList.toggle('open')`, the arrow character rotation (`▸` vs `▾`), `user-select: none`.

**Ends with:** All four voicing modes work — Full, Real, Shell, Guide. The student
can compare how the same chord sounds in shell vs full voicing and hear the difference.

---

## Part 18 — Slash Chords

**Music theory covered:** What a slash chord is — an upper chord over a non-root bass note,
why slash chords exist (pedal points, smooth bass lines, modal harmony), reading slash chord
notation (C/E means C major with E in the bass), the difference between a slash chord
and an inversion (slash chord bass can be completely outside the upper chord),
common slash chords in pop and jazz, how the grand staff represents slash chords
(bass note in bass clef, upper chord in treble).

**Code covered:** The `slash` family in `CHORD_TYPES` — `upperIntervals`, `bassInterval`,
`belowLabel`, `upperQuality` properties, `currentSlashBassMidi` and `currentUpperRootMidi`
state variables, how slash chord playback merges bass into the shared pipeline,
how the grand staff is built differently for slash chords vs regular chords in `showNotation()`.

**HTML/CSS covered:** The grand staff layout in VexFlow — `StaveConnector` for the brace,
positioning two staves vertically, sizing the SVG container dynamically based on
whether a grand staff or single staff is needed.

**Ends with:** Slash chords are fully playable and quizzable. The grand staff correctly
shows the bass note below and the upper chord above.

---

## Part 19 — Polychords and Upper Structure Triads

**Music theory covered:** What a polychord is — two independent chords sounding simultaneously,
written as a fraction (G major over C major = G/C in polychord notation),
why polychords appear in 20th century classical music (Stravinsky, Bartók) and in jazz,
the tritone and perfect fifth as the two most common distances between polychord roots.
Upper Structure Triads (UST) — the jazz approach to extended dominant chords,
the shell voicing ([M3, m7]) as the harmonic foundation, the seven UST types (I–VII),
what tensions each UST produces (b9, #9, #11, b13, 9, 13), famous UST contexts
(Bartók UST, McCoy Tyner sound), how to read and write UST notation.

**Code covered:** The `poly` family — `upperIntervals`, `lowerIntervals`, `lowerOffset`,
`currentPolyUpperMidi` / `currentPolyLowerMidi` state, how polychord playback combines
two independent triads. The `ust` family — `shellIntervals`, `upperTriadRoot`,
`upperTriadIntervals`, `currentUSTShellMidi` / `currentUSTUpperMidi` / `currentUSTRootMidi`,
the rootless voicing concept in code, UST breakdown — `tensions` and `resultingChord` properties.

**HTML/CSS covered:** Handling the three different grand staff layouts (regular chord,
slash chord, polychord/UST) inside `showNotation()` — conditional rendering based on
`chord.family`, sizing the SVG height dynamically.

**Ends with:** The complete chord library is quizzable — all six families plus slash,
polychords, and USTs. The breakdown panel shows tension analysis for USTs.

---

## Part 20 — The Breakdown Panel and Riemannian Analysis

**Music theory covered:** Riemannian function theory — Tonic (T), Subdominant (S),
Dominant (D), how chords relate to a key centre, the tritone substitution
(substituting a chord a tritone away from the dominant), why dim and aug chords
have special Riemannian ambiguity, Roman numeral analysis (I, ii, iii, IV, V, vi, vii°),
qualified Roman numerals (bIII, #IV, bVI, bVII) for chromatic chords.

**Code covered:** `SEMITONE_TO_ROMAN` lookup table, `semitoneToDegree()`,
`computeDegreeNumerals()`, the full `showBreakdown()` function for all three modes —
intervals (semitones, degree numeral, consonance, common context), scales (degree numerals,
triad map, modal character, parent scale), chords (interval numerals, Riemannian relations,
tritone sub, dim/aug/sus theory).

**HTML/CSS covered:** The breakdown panel layout in full detail — `<dl>` semantic structure,
`border-top` row dividers, `display: grid` for label/value alignment,
`font-size` hierarchy (`.75rem` for labels, `1rem` for values), `color: var(--text-muted)`
vs `color: var(--text)` for visual weight.

**Ends with:** The breakdown panel is fully implemented for all three modes with complete
harmonic analysis.

---

## Part 21 — Responsive Design and Accessibility

**Music theory covered:** (No new music theory.)

**Code covered:** Keyboard shortcuts — `document.addEventListener('keydown')`,
`e.code === 'Space'` for play, `e.key === 'Enter'` for next question,
`e.target.tagName === 'INPUT'` guard to prevent shortcuts firing while typing,
`e.preventDefault()` and when it is needed. The `New Session` button and `resetStats`
both calling `resetSession()` — the DRY principle (Don't Repeat Yourself).

**HTML/CSS covered:** Responsive design — `@media` queries, the `< 480px` breakpoint,
`rem` units and how they scale with browser font-size settings,
`min-height: 2.75rem` (44px) for every interactive element and why this is an
accessibility requirement, `max-width: 580px` + `margin: 0 auto` for centred layouts,
`padding: 0 1rem` for edge breathing room on small screens,
`white-space: nowrap` for labels that must not break, `flex-shrink: 0` to protect
fixed-size elements in flex rows, `object-fit: contain` for the logo image,
`filter: invert(1) brightness(1.8)` for the dark-mode logo,
the `[data-theme="dark"] .site-logo` scoped selector.

**Ends with:** The complete, fully responsive app. Every feature works on mobile and desktop.
All interactive elements meet accessibility touch target requirements.
The app is identical to `ear_training_chord_quiz_v3.html`.

---

## Appendix A — Reference Tables

- All 12 intervals with semitones, quality, consonance classification
- All chord families and symbols (Berklee notation)
- All 28 scales with interval arrays and group classification
- All 7 Greek modes with characteristic intervals and real-world examples
- All UST types with tensions and resulting chord symbols
- CSS custom properties reference (light and dark values)
- MIDI number chart (octaves 0–8)

---

## Appendix B — Exercises and Ear Training Challenges

- Interval recognition challenge list (hardest pairs to distinguish)
- Chord family discrimination exercises
- Modal recognition listening examples
- Suggested practice routines using the finished app

---

*This plan is a living document. Parts may be split into A/B as content develops.*
*Current estimate: 21 parts + 2 appendices.*
