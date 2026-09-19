---
title: Globals
kind: global
longname: Globals
---

# Globals

---

## Instance Methods

<MemberHeading id="switchmode" depth="3" name="switchMode" sig="switchMode(mode: string, targetSymbol: string | null)" />

<MemberMeta sourceHref="/source/app-js/#L45" sourceLabel="app.js:45" />

Switches the active training mode, rebuilds the pool panel for the new mode, updates the mode tab UI, resets the streak, and either starts a new question or re-enters dictionary mode (preserving any target symbol passed in).

Always calls teardownProgressionUI() first to clean up any progression DOM residue before the new mode's UI is built.

**Parameters**

- `mode` (string) — Target mode: 'chords' | 'intervals' | 'scales' | 'progressions'.
- `targetSymbol` (string | null, default: null) — Optional symbol to load directly in dict mode (e.g. navigating here from a chord-scales breakdown link).

<MemberHeading id="setappdifficulty" depth="3" name="setAppDifficulty" sig="setAppDifficulty(difficulty: 'basic' | 'advanced')" />

<MemberMeta sourceHref="/source/app-js/#L105" sourceLabel="app.js:105" />

Switches between Basic and Advanced difficulty modes. Resets all four pool selections (intervals, chords, scales, progressions) and voicing state to mode-appropriate defaults — no cross-difficulty memory. Rebuilds the pool panel and generates a fresh question for the current mode.

Basic boundaries per mode: Intervals — 12 simple (m2–P8); Advanced adds 7 compound (m9–M13) Chords — 12 core families (BASIC\_CHORD\_SYMBOLS); Advanced shows all Scales — Major, Natural Minor, Major/Minor Pentatonic; Advanced shows all Progressions — 9 core progressions (basic: true in progressions.js); Advanced shows all Voicings — Position + Doubling groups only (Groups 1–2); Advanced shows all 6

**Parameters**

- `difficulty` ('basic' | 'advanced') — Target difficulty level.

<MemberHeading id="renderregisterpanel" depth="3" name="renderRegisterPanel" sig="renderRegisterPanel()" />

<MemberMeta sourceHref="/source/app-js/#L169" sourceLabel="app.js:169" />

Renders the root note and octave register chip rows into #rootChips and #octaveChips. Both rows call recomputeCurrentNotes() on chip click so the current item is re-voiced in place without picking a new question.

Root chips include both enharmonic spellings for each accidental pitch class (e.g. C♯ and D♭ are separate chips sharing pitch class 1). Selecting one sets both pinnedRoot (pitch class) and pinnedRootSpelling ('sharp' | 'flat' | null), which the enharmonic spelling engine uses to choose the correct letter name.

<MemberHeading id="dictfullcatalog" depth="3" name="dictFullCatalog" sig="dictFullCatalog(): Array.<object>" />

<MemberMeta sourceHref="/source/app-js/#L262" sourceLabel="app.js:262" />

Returns the full item catalog for the current mode, ignoring quiz pool filters. Used by dictionary mode to show every available item.

**Returns**

- `Array.<object>` — Full array of interval, chord, or scale descriptors.

<MemberHeading id="dictdefaultsymbol" depth="3" name="dictDefaultSymbol" sig="dictDefaultSymbol(): string | null" />

<MemberMeta sourceHref="/source/app-js/#L280" sourceLabel="app.js:280" />

Returns the symbol of the first item in the full catalog for the current mode. Used as the initial selection when entering dict mode with no prior symbol.

**Returns**

- `string | null` — Symbol string, or null if the catalog is empty.

<MemberHeading id="dictloadsymbol" depth="3" name="dictLoadSymbol" sig="dictLoadSymbol(symbol: string)" />

<MemberMeta sourceHref="/source/app-js/#L295" sourceLabel="app.js:295" />

Loads a dictionary item by symbol and sets all relevant state variables so dictShow() / showNotation() / showBreakdown() can render it immediately. Mirrors the four chord-family paths in generateChordQuestion() exactly — any logic change there must be reflected here.

The special symbol '\_random' picks a random item from the full catalog.

**Parameters**

- `symbol` (string) — Item symbol to load, or '\_random' for a random pick.

<MemberHeading id="renderdictpoolpanel" depth="3" name="renderDictPoolPanel" sig="renderDictPoolPanel()" />

<MemberMeta sourceHref="/source/app-js/#L384" sourceLabel="app.js:384" />

Renders the pool panel in dictionary mode. Structure mirrors the quiz pool (same groups and sections) but uses single-select chips with no All/None buttons. Chords reuse the shared \_renderChordSubGroups() from pool-chords.js, which reads appMode internally to switch between multi and single select.

<MemberHeading
  id="makedictsection"
  depth="3"
  name="makeDictSection"
  sig="makeDictSection(
	body: HTMLElement,
	title: string,
	items: Array.<object>,
	useDisplayName: boolean,
	collapsed: boolean,
)"
/>

<MemberMeta sourceHref="/source/app-js/#L424" sourceLabel="app.js:424" />

Builds one collapsible section of single-select chips for the dictionary pool panel. Clicking a chip loads the item immediately via dictLoadSymbol + dictShow. No All/None buttons, no count display — dict mode is browse-only.

**Parameters**

- `body` (HTMLElement) — Parent element to append the section into.
- `title` (string) — Section heading text.
- `items` (Array.\<object>) — Array of item descriptors ({ name, symbol, displayName? }).
- `useDisplayName` (boolean, default: false) — When true, chips show item.displayName over item.name.
- `collapsed` (boolean, default: false) — Whether the section starts collapsed.

<MemberHeading id="deactivatealldictchips" depth="3" name="_deactivateAllDictChips" sig="_deactivateAllDictChips()" />

<MemberMeta sourceHref="/source/app-js/#L475" sourceLabel="app.js:475" />

Removes the active class from every pool chip in #poolPanel. Called before activating a newly selected dict chip to ensure single-select.

<MemberHeading id="dictapplyinversion" depth="3" name="dictApplyInversion" sig="dictApplyInversion(invIdx: number)" />

<MemberMeta sourceHref="/source/app-js/#L489" sourceLabel="app.js:489" />

Applies a specific inversion index to the current chord in dict or post-answer quiz mode, re-voices in place, and refreshes notation and breakdown without triggering a full showNotation() header rebuild.

No-ops for chord families that do not support rotation-based inversions: slash, poly, UST, classical, quartal, cluster.

**Parameters**

- `invIdx` (number) — Target inversion index (0 = root position).

<MemberHeading id="renderinversionchips" depth="3" name="renderInversionChips" sig="renderInversionChips()" />

<MemberMeta sourceHref="/source/app-js/#L542" sourceLabel="app.js:542" />

Renders inversion chips into #inversionChipRow for normal chords in dict mode and post-answer quiz mode. Each chip calls dictApplyInversion() on click.

The row is hidden entirely for chord families that do not support rotation-based inversions (slash, poly, UST, classical, quartal, cluster), for non-chord modes, and for chords with only one note.

In quiz mode the active chip starts at the inversion that was actually quizzed (currentChord.invIndex). In dict mode it persists from the last chip click (dictInversionIndex).

Called by showNotation() after every chord question and by dictShow().

<MemberHeading id="dictshow" depth="3" name="dictShow" sig="dictShow()" />

<MemberMeta sourceHref="/source/app-js/#L591" sourceLabel="app.js:591" />

Reveals notation and breakdown for the currently loaded dictionary item. Sets answered = true so showNotation() and showBreakdown() render without restriction, resets resolution state, and rebuilds the Hear Slowly + Resolve control buttons. No-ops if the required current-item state is missing.

<MemberHeading id="recomputecurrentnotes" depth="3" name="recomputeCurrentNotes" sig="recomputeCurrentNotes()" />

<MemberMeta sourceHref="/source/app-js/#L651" sourceLabel="app.js:651" />

Reapplies current settings (root pin, octave band, voicing) to the active item without picking a new question. Called whenever a setting changes: root chip, octave chip, voicing chip, style/direction chip.

Re-voices the same pitch class in place, preserving the current octave where possible (prefers to keep the existing octave if it still falls within the resolved band). Refreshes notation and breakdown if in dict mode or after answering in quiz mode.

All four chord families (slash, poly, UST, normal) are handled identically to dictLoadSymbol() and generateChordQuestion() — any change to those paths must be reflected here.

<MemberHeading id="setappmode" depth="3" name="setAppMode" sig="setAppMode(mode: 'quiz' | 'dict')" />

<MemberMeta sourceHref="/source/app-js/#L824" sourceLabel="app.js:824" />

Switches between quiz and dictionary application modes. Updates the Q/D toggle button states, shows/hides score and session UI, and initialises the appropriate pool panel and view for the current training mode.

Always calls teardownProgressionUI() first to clean up any progression DOM residue before rebuilding.

**Parameters**

- `mode` ('quiz' | 'dict') — Target application mode.

<MemberHeading
  id="makecollapsible"
  depth="3"
  name="makeCollapsible"
  sig="makeCollapsible(
	headerId: string,
	bodyId: string,
	arrowId: string,
)"
/>

<MemberMeta sourceHref="/source/app-js/#L869" sourceLabel="app.js:869" />

Wires a collapsible toggle for a header/body/arrow element triple. Clicking the header toggles the `open` class on the body and updates the arrow glyph. No-ops silently if any element is missing.

**Parameters**

- `headerId` (string) — ID of the clickable header element.
- `bodyId` (string) — ID of the collapsible body element.
- `arrowId` (string) — ID of the ▸/▾ arrow indicator element.

<MemberHeading id="showabout" depth="3" name="showAbout" sig="showAbout()" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L37" sourceLabel="about-mode.js:37" />

Opens the About view. Hides all training-UI elements, deactivates mode tabs, and marks the About button active. Mutual exclusion with Help is handled by help-mode.js, which patches the About button after this file loads.

<MemberHeading id="hideabout" depth="3" name="hideAbout" sig="hideAbout()" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L56" sourceLabel="about-mode.js:56" />

Closes the About view and restores all training-UI elements to their default display state. Callers should follow up with switchMode(currentMode) when returning to training.

<MemberHeading id="generatechordquestion" depth="3" name="generateChordQuestion" sig="generateChordQuestion()" />

<MemberMeta sourceHref="/source/modes/chords-mode-js/#L29" sourceLabel="chords-mode.js:29" />

Picks a random chord from the active pool and sets up all playback state, then renders the answer dropdown and controls. Handles four families via early-return paths before falling through to the normal chord path.

Resets chordKeySigMode to 'C' and clears currentVoiceLeadingAnalysis on every new question.

<MemberHeading id="submitchordanswer" depth="3" name="submitChordAnswer" sig="submitChordAnswer(chosen: object, _el: Element)" />

<MemberMeta sourceHref="/source/modes/chords-mode-js/#L158" sourceLabel="chords-mode.js:158" />

Grades the user's chosen answer against the current chord. Updates score, streak, and status message; reveals the correct answer in the dropdown; computes and caches the voice leading analysis; then shows notation and re-renders controls with the Next button.

**Parameters**

- `chosen` (object) — The chord descriptor the user selected.
- `_el` (Element) — The dropdown element (unused; kept for call-site consistency).

<MemberHeading id="buildvoiceleadinganalysis" depth="3" name="_buildVoiceLeadingAnalysis" sig="_buildVoiceLeadingAnalysis(): object | null" />

<MemberMeta sourceHref="/source/modes/chords-mode-js/#L214" sourceLabel="chords-mode.js:214" />

Builds the voice leading analysis for the current chord state and returns it. Called once at answer-reveal time; result cached in currentVoiceLeadingAnalysis and consumed by showBreakdown(). Returns null if the engine is unavailable or state is incomplete.

Each family uses a different input strategy:

- Slash: upper chord only — bass note is a label modifier, not harmonic identity.
- Poly: upper + lower merged; lower root used; context discovery skipped (polytonal).
- UST: implied intervals reconstructed from shell + upper triad data.
- Normal/inversion: pitch classes derived from canonical intervals, not voiced MIDI notes — voicing can omit or alter notes and cause wrong scale matches.

**Returns**

- `object | null` — Voice leading analysis object from analyseChord(), or null.

<MemberHeading id="showhelp" depth="3" name="showHelp" sig="showHelp()" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L38" sourceLabel="help-mode.js:38" />

Opens the Help view. Hides all training-UI elements, deactivates mode tabs, marks the Help button active, and closes About if it is currently open.

<MemberHeading id="hidehelp" depth="3" name="hideHelp" sig="hideHelp()" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L59" sourceLabel="help-mode.js:59" />

Closes the Help view and restores all training-UI elements to their default display state. Does not re-render the quiz — callers should follow up with switchMode(currentMode) when returning to training.

<MemberHeading id="renderhelpview" depth="3" name="renderHelpView" sig="renderHelpView()" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L123" sourceLabel="help-mode.js:123" />

Builds and inserts the Help panel into `#helpView` from the HELP\_SECTIONS data (defined in help-content.js). Idempotent — bails immediately if the view has already been rendered (guarded by `data-rendered`).

Structure per section:

← collapsible section header

← collapsible per-term entry

← rendered body text

Body text rendering rules (applied line by line):

- Empty line → `<br><br>` (paragraph break)
- Bullet line (•) after a non-empty line → `<br>` prefix (stays in block)
- All other text → HTML-escaped inline text

The search box filters entries in real time against term and body text. Matching sections auto-expand; non-matching entries are hidden.

<MemberHeading id="escapehtml" depth="3" name="escapeHtml" sig="escapeHtml(str: string): string" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L236" sourceLabel="help-mode.js:236" />

Escapes a plain-text string for safe insertion into innerHTML. Converts &, \<, >, and " to their HTML entity equivalents.

**Parameters**

- `str` (string) — The raw string to escape.

**Returns**

- `string` — HTML-safe string.

<MemberHeading id="generateintervalquestion" depth="3" name="generateIntervalQuestion" sig="generateIntervalQuestion()" />

<MemberMeta sourceHref="/source/modes/intervals-mode-js/#L27" sourceLabel="intervals-mode.js:27" />

Picks a random interval from the active pool, sets up playback state, and renders the answer dropdown and controls.

Root is chosen by chooseSimpleRootMidi() so the top note stays within a comfortable range. The full pool is always offered as answer options — the user identifies from every interval they have selected, not just a filtered subset. Resets intervalKeySigMode to 'C' on every new question.

<MemberHeading id="submitintervalanswer" depth="3" name="submitIntervalAnswer" sig="submitIntervalAnswer(chosen: object, _el: Element)" />

<MemberMeta sourceHref="/source/modes/intervals-mode-js/#L50" sourceLabel="intervals-mode.js:50" />

Grades the user's chosen answer against the current interval. Updates score, streak, and status message; reveals the correct answer in the dropdown; then shows notation and re-renders controls with the Next button.

**Parameters**

- `chosen` (object) — The interval descriptor the user selected.
- `_el` (Element) — The dropdown element (unused; kept for call-site consistency).

<MemberHeading id="progchordmidi" depth="3" name="progChordMidi" sig="progChordMidi(rootMidi: number, qualSym: string): Array.<number>" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L30" sourceLabel="progressions-mode.js:30" />

Builds block-chord MIDI notes for one chord in a progression. Looks up the chord type by symbol in the standard CHORD\_TYPES families; falls back to a plain major triad if the symbol is not found.

**Parameters**

- `rootMidi` (number) — MIDI number of the chord root.
- `qualSym` (string) — Chord quality symbol (e.g. 'maj', 'm7', 'dom7').

**Returns**

- `Array.<number>` — MIDI note numbers for the chord.

<MemberHeading id="playprogression" depth="3" name="playProgression" sig="playProgression()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L44" sourceLabel="progressions-mode.js:44" />

Plays the current progression at normal speed (\~0.5 s gap between chord onsets). Disables the play button for the duration of playback.

<MemberHeading id="playprogressionslowly" depth="3" name="playProgressionSlowly" sig="playProgressionSlowly()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L71" sourceLabel="progressions-mode.js:71" />

Plays the current progression slowly (double gaps, longer sustain). Used by the 🐢 Hear slowly button in both quiz and dict modes.

<MemberHeading id="generateprogressionquestion" depth="3" name="generateProgressionQuestion" sig="generateProgressionQuestion()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L99" sourceLabel="progressions-mode.js:99" />

Picks a random progression from the selected pool, sets up all state, and renders the answer UI. Resets key sig chip to C on each new question.

<MemberHeading id="renderprogressionanswerui" depth="3" name="renderProgressionAnswerUI" sig="renderProgressionAnswerUI()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L134" sourceLabel="progressions-mode.js:134" />

Builds the slot-based answer UI: one column per chord in the progression, each with a degree row (I–VII) and a quality row (maj / min / dom7 / dim). Appends Submit and Hear Slowly buttons below the slots.

<MemberHeading id="updatesubmitbtn" depth="3" name="updateSubmitBtn" sig="updateSubmitBtn()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L225" sourceLabel="progressions-mode.js:225" />

Enables the Submit button only when every slot has both a degree and quality selected.

<MemberHeading id="submitprogressionanswer" depth="3" name="submitProgressionAnswer" sig="submitProgressionAnswer()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L238" sourceLabel="progressions-mode.js:238" />

Grades the submitted answer slot by slot. Marks each slot correct/wrong, reveals the correct answer in wrong slots, updates score/streak, shows post-answer notation and breakdown, and appends a Next progression button.

<MemberHeading id="showprogressionnotation" depth="3" name="showProgressionNotation" sig="showProgressionNotation()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L320" sourceLabel="progressions-mode.js:320" />

Renders the full progression as a continuous VexFlow score after the answer is submitted or in dict mode. Supports treble, bass, or grand staff depending on the MIDI range of the progression. Shows Roman numeral + quality labels above the stave, and teal chord name labels below them.

<MemberHeading id="renderdictprogressionpoolpanel" depth="3" name="renderDictProgressionPoolPanel" sig="renderDictProgressionPoolPanel()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L531" sourceLabel="progressions-mode.js:531" />

Renders the dictionary progression pool panel directly into #poolPanel. Single-select: clicking a chip immediately loads that progression via dictShowProgression(). Stays in progressions-mode.js because it is tightly coupled to dictProgSymbol state and dictShowProgression().

<MemberHeading
  id="makedictprogsection"
  depth="3"
  name="_makeDictProgSection"
  sig="_makeDictProgSection(
	body: HTMLElement,
	title: string,
	items: Array.<object>,
	collapsed?: boolean,
)"
/>

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L558" sourceLabel="progressions-mode.js:558" />

Builds one collapsible group section for the dict progression pool panel. Chips are single-select: clicking immediately loads the progression. No count display or All/None buttons — dict panels are browse-only.

**Parameters**

- `body` (HTMLElement) — The pool panel body to append into.
- `title` (string) — Section heading text (group name).
- `items` (Array.\<object>) — Progressions for this section ({ symbol, name, ... }).
- `collapsed` (boolean, optional, default: false) — Default collapsed state.

<MemberHeading id="dictshowprogression" depth="3" name="dictShowProgression" sig="dictShowProgression(prog: object)" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L616" sourceLabel="progressions-mode.js:616" />

Loads a progression in dict mode: sets state, resets UI, shows notation and breakdown immediately, and renders a Hear Slowly button.

**Parameters**

- `prog` (object) — A progression descriptor from PROGRESSIONS.

<MemberHeading id="generateprogressionquestionentry" depth="3" name="generateProgressionQuestion_entry" sig="generateProgressionQuestion_entry()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L648" sourceLabel="progressions-mode.js:648" />

Entry point called by generateQuestion() when currentMode === 'progressions'. Routes to dict or quiz flow depending on appMode.

<MemberHeading id="generatequestion" depth="3" name="generateQuestion" sig="generateQuestion()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L663" sourceLabel="progressions-mode.js:663" />

Top-level question dispatcher — routes to the appropriate mode handler. Overrides the stub defined in app.js (if any); must load after it.

<MemberHeading id="teardownprogressionui" depth="3" name="teardownProgressionUI" sig="teardownProgressionUI()" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L677" sourceLabel="progressions-mode.js:677" />

Restores every DOM element that showProgressionNotation() mutates. Must be called on any mode switch or new question so other modes get a clean slate.

<MemberHeading id="generatescalequestion" depth="3" name="generateScaleQuestion" sig="generateScaleQuestion()" />

<MemberMeta sourceHref="/source/modes/scales-mode-js/#L28" sourceLabel="scales-mode.js:28" />

Picks a random scale from the active pool, sets up playback state, and renders the answer dropdown and controls.

Root is chosen by chooseSimpleRootMidi() using the scale's octave span (last interval value) so the top note stays within a comfortable range. The full pool is always offered as answer options. Resets scaleKeySigMode to 'key' on every new question — scales have a natural parent key, so Key mode is the correct default (unlike chords and intervals which default to 'C').

<MemberHeading id="submitscaleanswer" depth="3" name="submitScaleAnswer" sig="submitScaleAnswer(chosen: object, _el: Element)" />

<MemberMeta sourceHref="/source/modes/scales-mode-js/#L55" sourceLabel="scales-mode.js:55" />

Grades the user's chosen answer against the current scale. Updates score, streak, and status message; reveals the correct answer in the dropdown; then shows notation and re-renders controls with the Next button.

Uses displayName over name where available — Pentatonic scales carry a dual label (e.g. "Major Pentatonic / Ionian Pentatonic") in displayName that is more informative than the bare name. The wrong-answer label includes the spelled root name so the user sees the full answer (e.g. "It was D Dorian").

**Parameters**

- `chosen` (object) — The scale descriptor the user selected.
- `_el` (Element) — The dropdown element (unused; kept for call-site consistency).

<MemberHeading id="renderanswers" depth="3" name="renderAnswers" sig="renderAnswers(options, submitFn: function): void" />

<MemberMeta sourceHref="/source/ui/controls-js/#L37" sourceLabel="controls.js:37" />

Builds and displays the answer dropdown for a new question.

Populates `#ansDropdownList` with one item per option, sorted alphabetically. Wires the trigger button to open/close the list and attaches a single outside-click listener that auto-removes itself after firing. Any listener left over from the previous question is removed first to prevent stacking.

**Parameters**

- `options`
- `submitFn` (function) — Callback invoked with the chosen option object and its list item element when the user selects an answer.

**Returns**

- `void`

<MemberHeading
  id="revealdropdownanswer"
  depth="3"
  name="revealDropdownAnswer"
  sig="revealDropdownAnswer(
	chosenSymbol: string,
	correctSymbol: string,
): void"
/>

<MemberMeta sourceHref="/source/ui/controls-js/#L102" sourceLabel="controls.js:102" />

Reveals correct/wrong feedback in the dropdown after the user has answered.

Disables the trigger, closes the list, applies `.correct` or `.wrong` classes to the appropriate list items, and updates the trigger label to show the chosen answer name.

**Parameters**

- `chosenSymbol` (string) — Internal symbol of the answer the user chose.
- `correctSymbol` (string) — Internal symbol of the correct answer.

**Returns**

- `void`

<MemberHeading id="rendercontrols" depth="3" name="renderControls" sig="renderControls(nextFn: function, playFn: function): void" />

<MemberMeta sourceHref="/source/ui/controls-js/#L144" sourceLabel="controls.js:144" />

Renders the post-answer control buttons into `#controls`.

Clears and rebuilds the control area on every call. Before answering the area is empty. After answering, up to three buttons appear:

- **Next** — always shown after answering; label adapts to the active mode.
- **Hear Slowly** — always shown after answering.
- **Resolve ↔ Chord** — shown after answering in Chords mode only; label reflects the current resolution toggle state.

**Parameters**

- `nextFn` (function) — Callback for the Next button.
- `playFn` (function) — Reserved parameter (playback is currently handled via the module-level `playSlowly` and `playResolution` globals; kept for API symmetry with future callers).

**Returns**

- `void`

<MemberHeading id="familytitle" depth="3" name="_familyTitle" sig="_familyTitle()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L94" sourceLabel="pool-chords.js:94" />

Returns a human-readable title for a CHORD\_TYPES family key.

<MemberHeading id="buildchordfamilies" depth="3" name="_buildChordFamilies" sig="_buildChordFamilies()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L103" sourceLabel="pool-chords.js:103" />

Builds the flat list of { title, items } sections from CHORD\_TYPES. Families whose entries carry a subFamily field are split into one section per subFamily value, preserving the order subFamily values first appear.

<MemberHeading id="renderchordsubgroups" depth="3" name="_renderChordSubGroups" sig="_renderChordSubGroups()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L133" sourceLabel="pool-chords.js:133" />

Builds the two top-level sub-groups (Chord quality, Voicing) inside `body` and delegates to the mode-aware section renderers. Shared by renderChordPoolPanel (quiz) and renderDictPoolPanel (dict).

<MemberHeading id="renderchordqualitysection" depth="3" name="_renderChordQualitySection" sig="_renderChordQualitySection()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L146" sourceLabel="pool-chords.js:146" />

Renders the chord quality section. Quiz mode: multi-select chips, Global All/None, inversions checkbox. Dict mode: single-select chips that load the chord immediately on click.

<MemberHeading id="rendervoicingsection" depth="3" name="_renderVoicingSection" sig="_renderVoicingSection()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L188" sourceLabel="pool-chords.js:188" />

Routes to multi-select (quiz before answering) or single-select (dict + quiz post-answer) voicing rendering.

<MemberHeading id="rendervoicingmulti" depth="3" name="_renderVoicingMulti" sig="_renderVoicingMulti()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L200" sourceLabel="pool-chords.js:200" />

Renders the full multi-select voicing panel: global All/None, Random chip, six collapsible groups.

<MemberHeading id="makevoicinggroupmulti" depth="3" name="_makeVoicingGroupMulti" sig="_makeVoicingGroupMulti()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L273" sourceLabel="pool-chords.js:273" />

Builds one collapsible multi-select voicing group section. Pushes chip refs into `allChipRefs` for global All/None sync.

<MemberHeading id="rendervoicingsingle" depth="3" name="_renderVoicingSingle" sig="_renderVoicingSingle()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L368" sourceLabel="pool-chords.js:368" />

Renders single-select voicing panel: Random chip + collapsible groups; each chip re-voices immediately on click.

<MemberHeading id="makevoicinggroupsingle" depth="3" name="_makeVoicingGroupSingle" sig="_makeVoicingGroupSingle()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L398" sourceLabel="pool-chords.js:398" />

Builds one collapsible single-select voicing group; each chip re-voices immediately on click.

<MemberHeading id="syncvoicingchipactive" depth="3" name="_syncVoicingChipActive" sig="_syncVoicingChipActive()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L451" sourceLabel="pool-chords.js:451" />

Syncs the active class across all single-select voicing chips after a selection.

<MemberHeading id="updateallsectioncounts" depth="3" name="_updateAllSectionCounts" sig="_updateAllSectionCounts()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L458" sourceLabel="pool-chords.js:458" />

Updates the count display for all voicing group sections in multi-select mode.

<MemberHeading id="updatesectioncount" depth="3" name="_updateSectionCount" sig="_updateSectionCount()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L470" sourceLabel="pool-chords.js:470" />

Updates the count display for a single voicing section given its symbol list.

<MemberHeading id="renderchordpoolpanel" depth="3" name="renderChordPoolPanel" sig="renderChordPoolPanel(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L486" sourceLabel="pool-chords.js:486" />

Renders the chord training pool panel into `panel`. Builds the panel shell and delegates sub-group rendering to \_renderChordSubGroups. Called by renderPoolPanel() when currentMode === 'chords'.

**Parameters**

- `panel` (HTMLElement) — The #poolPanel container element.

<MemberHeading id="renderchordstylechips" depth="3" name="renderChordStyleChips" sig="renderChordStyleChips()" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L497" sourceLabel="pool-chords.js:497" />

Renders the chord playback style chips into #chordStyleRow. Updates chordPlayStyle, the play button label, and notation on selection. Called on mode switch and after answering.

<MemberHeading id="renderintervalpoolpanel" depth="3" name="renderIntervalPoolPanel" sig="renderIntervalPoolPanel(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/ui/pool-intervals-js/#L27" sourceLabel="pool-intervals.js:27" />

Renders the interval training pool panel into `panel`. Shows Simple intervals always; Extended/Compound section only in Advanced mode. Called by renderPoolPanel() when currentMode === 'intervals'.

**Parameters**

- `panel` (HTMLElement) — The #poolPanel container element.

<MemberHeading id="renderintervalstylechips" depth="3" name="renderIntervalStyleChips" sig="renderIntervalStyleChips()" />

<MemberMeta sourceHref="/source/ui/pool-intervals-js/#L50" sourceLabel="pool-intervals.js:50" />

Renders the interval playback style chips into #intervalStyleRow. Updates intervalStyle, the play button label, and notation on selection. Called on mode switch and after answering.

<MemberHeading
  id="makeprogsection"
  depth="3"
  name="_makeProgSection"
  sig="_makeProgSection(
	body: HTMLElement,
	title: string,
	items: Array.<object>,
	collapsed?: boolean,
	onChangeFn?: function,
)"
/>

<MemberMeta sourceHref="/source/ui/pool-progressions-js/#L35" sourceLabel="pool-progressions.js:35" />

Builds one collapsible group section with two-line progression pool chips. Each chip shows a bold Roman numeral symbol (.prog-chip-sym) and a lighter name (.prog-chip-name) stacked inside a single pill. Includes a per-section count display and All / None buttons. Reads/writes selectedProgressions directly.

**Parameters**

- `body` (HTMLElement) — The pool panel body to append into.
- `title` (string) — Section heading text (group name).
- `items` (Array.\<object>) — Progressions for this section ({ symbol, name, ... }).
- `collapsed` (boolean, optional, default: true) — Default collapsed state; overridden to false if any item in the section is selected.
- `onChangeFn` (function, optional) — Called after every chip toggle or All/None click.

<MemberHeading id="renderprogressionpoolpanel" depth="3" name="renderProgressionPoolPanel" sig="renderProgressionPoolPanel(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/ui/pool-progressions-js/#L145" sourceLabel="pool-progressions.js:145" />

Renders the progression training pool panel into `panel`. Shows a meta count (e.g. "9 / 9") in the panel header reflecting the current selection. Groups follow PROG\_GROUPS order; collapse state is driven by PROG\_GROUP\_COLLAPSED. Each group is rendered as a two-line chip section via \_makeProgSection. Called by renderPoolPanel() when currentMode === 'progressions'.

**Parameters**

- `panel` (HTMLElement) — The #poolPanel container element.

<MemberHeading id="iteratescalegroups" depth="3" name="iterateScaleGroups" sig="iterateScaleGroups(callback)" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L49" sourceLabel="pool-scales.js:49" />

Iterates SCALES grouped by the `group` field, in insertion order. Filters to basic scales only when appDifficulty === 'basic'.

This is the single source of truth for scale group structure. Both the quiz pool panel and the dict renderer consume it — any change to grouping or ordering belongs here.

**Parameters**

- `callback`

<MemberHeading id="renderscalepoolpanel" depth="3" name="renderScalePoolPanel" sig="renderScalePoolPanel(panel: HTMLElement)" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L76" sourceLabel="pool-scales.js:76" />

Renders the scale training pool panel into `panel`. Groups are auto-discovered via the `group` field on each SCALES entry. Pentatonic chips show displayName (dual label); all others show name. Called by renderPoolPanel() when currentMode === 'scales' (or default).

**Parameters**

- `panel` (HTMLElement) — The #poolPanel container element.

<MemberHeading id="renderscaledirchips" depth="3" name="renderScaleDirChips" sig="renderScaleDirChips()" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L95" sourceLabel="pool-scales.js:95" />

Renders the scale direction chips into #scaleDirRow. Updates scaleDirection, the play button label, and notation on selection. Called on mode switch and after answering.

<MemberHeading id="renderpoolpanel" depth="3" name="renderPoolPanel" sig="renderPoolPanel()" />

<MemberMeta sourceHref="/source/ui/pool-js/#L23" sourceLabel="pool.js:23" />

Clears #poolPanel and renders the pool panel for the current mode. Routes to the appropriate mode renderer defined in the pool-\*.js files.

<MemberHeading
  id="makepoolpanelshell"
  depth="3"
  name="makePoolPanelShell"
  sig="makePoolPanelShell(
	panel: HTMLElement,
	title: string,
	metaFn: function | null,
): Object"
/>

<MemberMeta sourceHref="/source/ui/pool-js/#L45" sourceLabel="pool.js:45" />

Builds and appends the collapsible shell (header + body) for a pool panel. Returns the inner body element and a meta span updater for the count display.

**Parameters**

- `panel` (HTMLElement) — The #poolPanel container to append into.
- `title` (string) — Panel heading text.
- `metaFn` (function | null) — Called to compute the meta string (e.g. "4 items"); pass null to omit the meta display.

**Returns**

- `Object`

<MemberHeading
  id="makeglobalallnone"
  depth="3"
  name="makeGlobalAllNone"
  sig="makeGlobalAllNone(
	body: HTMLElement,
	allItems: Array.<object>,
	selectedSet: Set.<string>,
	getAllChips: function,
	onChangeFn: function,
)"
/>

<MemberMeta sourceHref="/source/ui/pool-js/#L89" sourceLabel="pool.js:89" />

Appends a global All / None row at the top of a pool panel body. All/None operate across every item in `allItems`, syncing both the Set and the active class on every chip in the panel.

**Parameters**

- `body` (HTMLElement) — The pool panel body to prepend into.
- `allItems` (Array.\<object>) — Flat array of all items for this mode ({ symbol, ... }).
- `selectedSet` (Set.\<string>) — The shared selection Set for this mode.
- `getAllChips` (function) — Returns all .pool-chip elements currently in body.
- `onChangeFn` (function) — Called after every All/None toggle.

<MemberHeading
  id="makesection"
  depth="3"
  name="makeSection"
  sig="makeSection(
	body: HTMLElement,
	title: string,
	items: Array.<object>,
	selectedSet: Set.<string>,
	onChangeFn: function,
	collapsed?: boolean,
	useDisplayName?: boolean,
)"
/>

<MemberMeta sourceHref="/source/ui/pool-js/#L149" sourceLabel="pool.js:149" />

Appends a collapsible chip section into a pool panel body. Includes a header with title, count display, and per-section All/None buttons. Starts collapsed unless the section contains at least one selected item.

**Parameters**

- `body` (HTMLElement) — The pool panel body to append into.
- `title` (string) — Section heading text.
- `items` (Array.\<object>) — Items for this section ({ symbol, name, displayName? }).
- `selectedSet` (Set.\<string>) — The shared selection Set for this mode.
- `onChangeFn` (function) — Called after every chip toggle or All/None click.
- `collapsed` (boolean, optional, default: true) — Default collapsed state (default: true). Overridden to false if any item is selected.
- `useDisplayName` (boolean, optional, default: false) — When true, chip label uses item.displayName if present, falling back to item.name. Used by the Pentatonic scale section for dual labels.

<MemberHeading id="makesubgroup" depth="3" name="_makeSubGroup" sig="_makeSubGroup(body: HTMLElement, title: string): HTMLElement" />

<MemberMeta sourceHref="/source/ui/pool-js/#L258" sourceLabel="pool.js:258" />

Builds a collapsible sub-group container inside `body` and returns its inner body. Used by pool-chords.js to wrap the Chord quality and Voicing sections. Starts collapsed by default.

**Parameters**

- `body` (HTMLElement) — The parent pool panel body.
- `title` (string) — Sub-group heading text.

**Returns**

- `HTMLElement` — The inner body div that section renderers append into.

<MemberHeading id="makeallnonebtn" depth="3" name="_makeAllNoneBtn" sig="_makeAllNoneBtn(label: string): HTMLButtonElement" />

<MemberMeta sourceHref="/source/ui/pool-js/#L301" sourceLabel="pool.js:301" />

Creates a styled All or None button for use inside pool sections. Used by pool-chords.js voicing group headers.

**Parameters**

- `label` (string) — Button text ('All' or 'None').

**Returns**

- `HTMLButtonElement`

## Instance Fields

<MemberHeading id="dictsymbol" depth="3" name="dictSymbol" sig="dictSymbol" />

<MemberMeta sourceHref="/source/app-js/#L269" sourceLabel="app.js:269" />

Currently loaded dictionary item symbol, or null before first load.

<MemberHeading id="dictinversionindex" depth="3" name="dictInversionIndex" sig="dictInversionIndex" />

<MemberMeta sourceHref="/source/app-js/#L272" sourceLabel="app.js:272" />

Inversion position shown in dict mode and post-answer quiz view (0 = root position).

<MemberHeading id="aboutopen" depth="3" name="aboutOpen" sig="aboutOpen" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L28" sourceLabel="about-mode.js:28" />

Whether the About view is currently open.

<MemberHeading id="helpopen" depth="3" name="helpOpen" sig="helpOpen" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L30" sourceLabel="help-mode.js:30" />

Whether the Help view is currently open.

<MemberHeading id="dictprogsymbol" depth="3" name="dictProgSymbol" sig="dictProgSymbol" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L608" sourceLabel="progressions-mode.js:608" />

Tracks the currently active progression symbol in dict mode.

## Other

<MemberHeading id="appjs" depth="3" name="app.js" sig="app.js" />

<MemberMeta sourceHref="/source/app-js/#L7" sourceLabel="app.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="appjs" depth="3" name="app.js" sig="app.js" />

<MemberMeta sourceHref="/source/app-js/#L31" sourceLabel="app.js:31" />

Boot file and application coordinator. Owns mode switching, quiz/dictionary toggle, dictionary mode functions (dictLoadSymbol, dictShow, renderDictPoolPanel, renderInversionChips), the recomputeCurrentNotes engine, Basic/Advanced difficulty switching, register panel rendering, theme init, keyboard shortcuts, and all top-level DOM event wiring.

Module-level state declared here (not in state.js) because it is tightly coupled to dictionary UI logic and has no cross-file consumers: - dictSymbol — currently loaded dictionary item symbol - dictInversionIndex — inversion position shown in dict / post-answer view

Must load last — depends on every other layer being defined.

- **Requires:** `module:state.js,`

<MemberHeading id="basicchordsymbols" depth="3" name="BASIC_CHORD_SYMBOLS" sig="BASIC_CHORD_SYMBOLS" />

<MemberMeta sourceHref="/source/app-js/#L88" sourceLabel="app.js:88" />

Hard-coded Basic chord symbol list. Matches the `basic: true` entries in chords.js but kept here as a constant so setAppDifficulty() can reset selectedChords without re-filtering the full CHORD\_TYPES catalog.

<MemberHeading id="modesabout-modejs" depth="3" name="modes/about-mode.js" sig="modes/about-mode.js" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L7" sourceLabel="about-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modesabout-modejs" depth="3" name="modes/about-mode.js" sig="modes/about-mode.js" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L16" sourceLabel="about-mode.js:16" />

About view: show/hide the About panel, mutual exclusion with Help (handled from help-mode.js, which loads after this file), and mode-tab wiring. No dynamic rendering — the About view is static HTML.

- **Requires:** `module:state.js`

<MemberHeading id="abouttrainingels" depth="3" name="ABOUT_TRAINING_ELS" sig="ABOUT_TRAINING_ELS" />

<MemberMeta sourceHref="/source/modes/about-mode-js/#L19" sourceLabel="about-mode.js:19" />

Training-UI element IDs to hide while About (or Help) is open.

<MemberHeading id="modeschords-modejs" depth="3" name="modes/chords-mode.js" sig="modes/chords-mode.js" />

<MemberMeta sourceHref="/source/modes/chords-mode-js/#L7" sourceLabel="chords-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modeschords-modejs" depth="3" name="modes/chords-mode.js" sig="modes/chords-mode.js" />

<MemberMeta sourceHref="/source/modes/chords-mode-js/#L19" sourceLabel="chords-mode.js:19" />

Chord quiz mode: question generation, answer grading, and voice leading analysis cache. Handles all four chord families (normal, slash, polychord, UST) through dedicated paths in generateChordQuestion(). Playback lives in controls.js. Notation lives in notation.js. Dictionary functions (dict pool panel, dictShowChord) live in app.js.

- **Requires:** `module:state.js,`

<MemberHeading id="modeshelp-modejs" depth="3" name="modes/help-mode.js" sig="modes/help-mode.js" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L7" sourceLabel="help-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modeshelp-modejs" depth="3" name="modes/help-mode.js" sig="modes/help-mode.js" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L18" sourceLabel="help-mode.js:18" />

In-app Help system: show/hide the Help view, mutual exclusion with About, keyboard and tab-click wiring, and lazy rendering of the searchable help panel from HELP\_SECTIONS (defined in help-content.js). Rendering is deferred to first open — the DOM is only built once.

- **Requires:** `module:state.js`

<MemberHeading id="helptrainingels" depth="3" name="HELP_TRAINING_ELS" sig="HELP_TRAINING_ELS" />

<MemberMeta sourceHref="/source/modes/help-mode-js/#L21" sourceLabel="help-mode.js:21" />

Training-UI element IDs to hide while Help (or About) is open.

<MemberHeading id="modesintervals-modejs" depth="3" name="modes/intervals-mode.js" sig="modes/intervals-mode.js" />

<MemberMeta sourceHref="/source/modes/intervals-mode-js/#L7" sourceLabel="intervals-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modesintervals-modejs" depth="3" name="modes/intervals-mode.js" sig="modes/intervals-mode.js" />

<MemberMeta sourceHref="/source/modes/intervals-mode-js/#L16" sourceLabel="intervals-mode.js:16" />

Interval quiz mode: question generation and answer grading. Playback lives in audio.js. Notation lives in notation.js.

- **Requires:** `module:state.js,`

<MemberHeading id="modesprogressions-modejs" depth="3" name="modes/progressions-mode.js" sig="modes/progressions-mode.js" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L7" sourceLabel="progressions-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modesprogressions-modejs" depth="3" name="modes/progressions-mode.js" sig="modes/progressions-mode.js" />

<MemberMeta sourceHref="/source/modes/progressions-mode-js/#L19" sourceLabel="progressions-mode.js:19" />

Progression quiz and dictionary mode: playback, question generation, answer UI, grading, post-answer notation, dict panel, and DOM teardown. Pool panel rendering (quiz) lives in pool-progressions.js. Pool panel rendering (dict) lives here — tightly coupled to dictProgSymbol state.

- **Requires:** `module:state.js,`

<MemberHeading id="modesscales-modejs" depth="3" name="modes/scales-mode.js" sig="modes/scales-mode.js" />

<MemberMeta sourceHref="/source/modes/scales-mode-js/#L7" sourceLabel="scales-mode.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="modesscales-modejs" depth="3" name="modes/scales-mode.js" sig="modes/scales-mode.js" />

<MemberMeta sourceHref="/source/modes/scales-mode-js/#L16" sourceLabel="scales-mode.js:16" />

Scale quiz mode: question generation and answer grading. Playback lives in audio.js. Notation lives in notation.js.

- **Requires:** `module:state.js,`

<MemberHeading id="uicontrolsjs" depth="3" name="ui/controls.js" sig="ui/controls.js" />

<MemberMeta sourceHref="/source/ui/controls-js/#L13" sourceLabel="controls.js:13" />

Answer dropdown and quiz control button renderers. Handles all interactive UI in the answer area: building the dropdown list, revealing correct/wrong feedback after submission, and rendering the post-answer control buttons (Next, Hear Slowly, Resolve).

- **Requires:** `module:state.js`, `module:audio.js`

<MemberHeading id="uipool-chordsjs" depth="3" name="ui/pool-chords.js" sig="ui/pool-chords.js" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L7" sourceLabel="pool-chords.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="uipool-chordsjs" depth="3" name="ui/pool-chords.js" sig="ui/pool-chords.js" />

<MemberMeta sourceHref="/source/ui/pool-chords-js/#L18" sourceLabel="pool-chords.js:18" />

Chord quality and voicing pool panel rendering. Handles both quiz multi-select and dict/post-answer single-select modes. Exports: renderChordPoolPanel, renderChordStyleChips

- **Requires:** `module:pool.js`, `module:state.js,`

<MemberHeading id="uipool-intervalsjs" depth="3" name="ui/pool-intervals.js" sig="ui/pool-intervals.js" />

<MemberMeta sourceHref="/source/ui/pool-intervals-js/#L7" sourceLabel="pool-intervals.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="uipool-intervalsjs" depth="3" name="ui/pool-intervals.js" sig="ui/pool-intervals.js" />

<MemberMeta sourceHref="/source/ui/pool-intervals-js/#L18" sourceLabel="pool-intervals.js:18" />

Interval training pool panel and playback style chip rendering. Splits the interval pool into Simple and Extended/Compound sections, hiding the compound section in Basic mode. Exports: renderIntervalPoolPanel, renderIntervalStyleChips

- **Requires:** `module:pool.js`, `module:state.js,`

<MemberHeading id="uipool-progressionsjs" depth="3" name="ui/pool-progressions.js" sig="ui/pool-progressions.js" />

<MemberMeta sourceHref="/source/ui/pool-progressions-js/#L7" sourceLabel="pool-progressions.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="uipool-progressionsjs" depth="3" name="ui/pool-progressions.js" sig="ui/pool-progressions.js" />

<MemberMeta sourceHref="/source/ui/pool-progressions-js/#L20" sourceLabel="pool-progressions.js:20" />

Progression training pool panel rendering. Groups progressions by PROG\_GROUPS order; respects Basic mode filtering. Uses two-line chips (prog-pool-chip) unique to the progression pool — bold Roman numeral symbol (.prog-chip-sym) + lighter name (.prog-chip-name). Note: PROG\_GROUPS and PROG\_GROUP\_COLLAPSED live in progressions.js (data layer). Exports: renderProgressionPoolPanel

- **Requires:** `module:pool.js`, `module:state.js,`

<MemberHeading id="uipool-scalesjs" depth="3" name="ui/pool-scales.js" sig="ui/pool-scales.js" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L7" sourceLabel="pool-scales.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="uipool-scalesjs" depth="3" name="ui/pool-scales.js" sig="ui/pool-scales.js" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L17" sourceLabel="pool-scales.js:17" />

Scale training pool panel and direction chip rendering. Groups scales by cardinality (pentatonic, hexatonic, diatonic, octatonic). Exports: SCALE\_GROUP\_CONFIG, iterateScaleGroups, renderScalePoolPanel, renderScaleDirChips

- **Requires:** `module:pool.js`, `module:state.js,`

<MemberHeading id="scalegroupconfig" depth="3" name="SCALE_GROUP_CONFIG" sig="SCALE_GROUP_CONFIG: Object.<string, {title: string, sectionFn: string}>" />

<MemberMeta sourceHref="/source/ui/pool-scales-js/#L28" sourceLabel="pool-scales.js:28" />

Display titles and section-renderer config for each scale group key. `sectionFn: 'withDisplayName'` passes useDisplayName=true to makeSection, causing chips to show item.displayName when available (used by Pentatonic to surface dual names like "Major Pentatonic / Ionian Pentatonic"). Any key absent from this object gets a capitalised fallback title.

<MemberHeading id="uipooljs" depth="3" name="ui/pool.js" sig="ui/pool.js" />

<MemberMeta sourceHref="/source/ui/pool-js/#L7" sourceLabel="pool.js:7" />

- **Copyright:** © 2026 The Sound Travels — MIT License
- **Author:** Renato Fera P. — https\://www\.linkedin.com/in/renato-profeta/

<MemberHeading id="uipooljs" depth="3" name="ui/pool.js" sig="ui/pool.js" />

<MemberMeta sourceHref="/source/ui/pool-js/#L17" sourceLabel="pool.js:17" />

Shared pool panel primitives and top-level mode dispatcher. Provides the building blocks consumed by all four mode-specific pool files. Exports: renderPoolPanel, makePoolPanelShell, makeGlobalAllNone, makeSection, \_makeSubGroup, \_makeAllNoneBtn

- **Requires:** `module:state.js,`
