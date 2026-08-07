# Sound Travels Ear Trainer — File Split Plan v2

## Goal

Move from a single monolithic HTML file (~6,500 lines) to a professional,
maintainable multi-file structure. The app stays **serverless and static** —
no build step, no bundler, no Node.js required. Everything is plain HTML, CSS,
and vanilla JS loaded via `<script>` and `<link>` tags. GitHub Pages hosts it
as-is.

The split is also a **refactor**: duplication between quiz and dictionary mode
is eliminated during the migration, not after. The monolith is not patched
first — each file is written clean.

---

## Guiding principles

1. **No bundler** — files load in order via `<script src="...">` tags. Later
   files can reference anything declared in earlier ones.
2. **One responsibility per file** — data, engine, UI, and mode logic are
   separated. A bug in progression playback lives in one place.
3. **Dependency order is explicit** — the load order in `index.html` is the
   dependency graph. Nothing is implicit.
4. **No duplication between quiz and dictionary** — quiz and dict are two
   interaction modes over the same data and render functions. State setup,
   pool rendering, notation, breakdown, and controls are written once.
5. **GitHub Pages compatible** — flat directory or simple folder structure,
   no server-side routing needed.

---

## Quiz vs Dictionary — the core model

This distinction governs every architectural decision in the split.

**Quiz mode**: play → user answers → reveal  
**Dictionary mode**: user selects → reveal immediately

The *reveal* (notation, breakdown, controls) is **identical** in both modes.
The only difference is what triggers it and whether an answer UI is shown.

This means:
- `showCurrentView()` is the single render entry point for both modes
- `renderControls()` renders the same buttons in both modes (slow, resolve),
  adding Next only in quiz after answering
- `playSlowly()` is available in both modes
- Pool panels use the same structure and components in both modes
- State setup logic is written once and called from both paths

---

## Quiz vs Dictionary — pool panels

The pool panel shows the same data in both modes. The interaction differs:

| | Quiz | Dictionary |
|---|---|---|
| Selection | Multi-select (Set) | Single-select (one symbol) |
| On click | Toggle in/out of training pool | Load item immediately |
| All / None buttons | Yes | No |
| Panel title | "Training pool — Chords" | "Dictionary — Chords" |

A single `makeSection(body, title, items, options)` function handles both.
The `options.mode` parameter (`'multi'` or `'single'`) controls chip behavior.
Everything else — chevron collapse, chip layout, count label — is shared code.

---

## Quiz vs Dictionary — MODE_HANDLERS interface

Each mode file exposes exactly this interface. `app.js` routes all calls
through it. No direct cross-mode function calls anywhere.

```js
const MODE_HANDLERS = {
  chords: {
    generateQuestion,  // pick random item, setupState, play, render answer UI
    loadItem(symbol),  // find item, setupState only — no play, no answer UI
    submitAnswer,      // score, update streak, call showCurrentView()
    showCurrentView,   // render notation + breakdown + controls
    recomputeNotes,    // called when register/voicing chip changes
    playChord,         // main play button
    playSlowly,        // 🐢 button — post-answer in quiz, always in dict
    teardown,          // clean up mode-specific DOM before mode switch
  },
  intervals:    { generateQuestion, loadItem, submitAnswer, showCurrentView,
                  recomputeNotes, playChord, playSlowly, teardown },
  scales:       { generateQuestion, loadItem, submitAnswer, showCurrentView,
                  recomputeNotes, playChord, playSlowly, teardown },
  progressions: { generateQuestion, loadItem, submitAnswer, showCurrentView,
                  recomputeNotes, playChord, playSlowly, teardown },
};
```

`switchMode(mode)` calls `MODE_HANDLERS[mode].generateQuestion()` or
`MODE_HANDLERS[mode].loadItem(dictSymbol)` depending on `appMode`.

`setAppMode(mode)` calls `renderPoolPanel()` (which reads `appMode` and passes
the correct options to `makeSection`) then calls the appropriate entry point.

---

## State setup — eliminating generateQuestion / loadItem duplication

`generateChordQuestion` and `dictLoadSymbol` currently duplicate the full
slash / poly / UST / normal chord branching logic. The fix is internal
`_setup` helpers in each mode file, shared between both paths.

### chords-mode.js internal helpers

```js
// Internal — called by both generateQuestion and loadItem
function _resetChordState() {
  currentSlashBassMidi = null; currentUpperRootMidi = null;
  currentPolyUpperMidi = []; currentPolyLowerMidi = [];
  currentPolyUpperRootMidi = null; currentPolyLowerRootMidi = null;
  currentUSTShellMidi = []; currentUSTUpperMidi = []; currentUSTRootMidi = null;
}
function _setupSlashChord(item)  { ... } // sets currentSlashBassMidi, etc.
function _setupPolyChord(item)   { ... } // sets currentPolyUpperMidi, etc.
function _setupUSTChord(item)    { ... } // sets currentUSTShellMidi, etc.
function _setupNormalChord(item) { ... } // sets currentMidiNotes, currentChordRootMidi

function setupChordState(item) {
  _resetChordState();
  currentChord = item;
  chordKeySigMode = 'C';
  if (item.family === 'slash')     _setupSlashChord(item);
  else if (item.family === 'poly') _setupPolyChord(item);
  else if (item.family === 'ust')  _setupUSTChord(item);
  else                             _setupNormalChord(item);
}

// Public interface
function generateQuestion() {
  const item = pickRandom(getActivePool());
  setupChordState(item);
  playChord();
  renderAnswers(getActivePool(), submitAnswer);
  renderControls();
  updateRootBadge(...);
}

function loadItem(symbol) {
  const item = symbol === '_random'
    ? pickRandom(getAllChords())
    : getAllChords().find(c => c.symbol === symbol);
  if (!item) return;
  dictInversionIndex = 0;
  setupChordState(item);
  // no play, no answer UI — caller handles showCurrentView
}
```

### intervals-mode.js and scales-mode.js

Same pattern — `setupIntervalState(item)` and `setupScaleState(item)` are
internal helpers called by both `generateQuestion` and `loadItem`.

### progressions-mode.js

Progressions don't have a dict equivalent of `loadItem` for state setup —
`dictShowProgression(prog)` sets state directly and is simple enough that
no deduplication is needed. It stays as-is but is renamed `loadItem(symbol)`.

---

## showCurrentView — single render entry point

Currently post-reveal rendering is scattered: `submitAnswer` calls
`showNotation()`, `dictShow()` calls it directly, chip changes call it
conditionally. The fix is one function per mode that is the only external
render call.

```js
// In each mode file — example for chords
function showCurrentView() {
  showNotation();          // notation.js — renders SVG, calls showBreakdown()
  renderInversionChips();  // ui/controls.js
  renderControls();        // ui/controls.js — slow + resolve + next(quiz only)
}
```

Every call site in `app.js`, `dictionary.js`, and chip handlers calls
`MODE_HANDLERS[currentMode].showCurrentView()`. Nothing calls `showNotation()`
or `showBreakdown()` directly from outside the mode file.

---

## renderControls — unified, no quiz/dict branching

```js
// ui/controls.js
function renderControls() {
  const c = document.getElementById('controls');
  c.innerHTML = '';

  // Slow button — always, both modes
  const sb = document.createElement('button');
  sb.className = 'ctrl-btn slow';
  sb.textContent = '🐢 Hear slowly';
  sb.addEventListener('click', () => MODE_HANDLERS[currentMode].playSlowly());
  c.appendChild(sb);

  // Resolve button — chords only, both modes
  if (currentMode === 'chords') {
    const rb = document.createElement('button');
    rb.className = 'ctrl-btn resolve';
    rb.textContent = resolutionActive ? '← Chord' : 'Resolve →';
    rb.addEventListener('click', playResolution);
    c.appendChild(rb);
  }

  // Next button — quiz only, after answering
  if (appMode === 'quiz' && answered) {
    const nb = document.createElement('button');
    nb.className = 'ctrl-btn primary';
    nb.textContent = currentMode === 'progressions' ? 'Next progression' : 'Next';
    nb.addEventListener('click', () => MODE_HANDLERS[currentMode].generateQuestion());
    c.appendChild(nb);
  }
}
```

---

## renderPoolPanel — unified, no quiz/dict branching

```js
// ui/pool.js
function renderPoolPanel() {
  const panel = document.getElementById('poolPanel');
  panel.innerHTML = '';
  const isDict = appMode === 'dict';

  if (currentMode === 'chords')      _renderChordPool(panel, isDict);
  else if (currentMode === 'intervals') _renderIntervalPool(panel, isDict);
  else if (currentMode === 'scales') _renderScalePool(panel, isDict);
  else if (currentMode === 'progressions') _renderProgressionPool(panel, isDict);
}

// makeSection handles both modes via options.mode
function makeSection(body, title, items, options) {
  // options: { mode, selected, onSelect, collapsed, useDisplayName }
  // mode === 'multi': toggle Set, show All/None
  // mode === 'single': radio behavior, call onSelect(symbol) immediately
  // All/None buttons only rendered when mode === 'multi'
  // Everything else identical
}

function makeProgSection(body, title, items, options) {
  // Same pattern — two-line chips, mode parameter controls behavior
}
```

`_renderChordPool(panel, isDict)` passes:
- `mode: isDict ? 'single' : 'multi'`
- `selected: isDict ? dictSymbol : selectedChords`
- `onSelect: isDict ? (sym) => { dictLoadAndShow(sym); } : () => {}`
- title: `isDict ? 'Dictionary — Chords' : 'Training pool — Chords'`

Same groups, same items, same structure. No separate dict render functions.

---

## dictionary.js — thin coordinator only

With the above in place, `dictionary.js` shrinks to ~80 lines:

```js
// dict-specific state
let dictSymbol = null;
let dictInversionIndex = 0;
let dictProgSymbol = null;

function dictLoadAndShow(symbol) {
  dictSymbol = symbol;
  MODE_HANDLERS[currentMode].loadItem(symbol);
  MODE_HANDLERS[currentMode].showCurrentView();
}

function setAppMode(mode) {
  teardownProgressionUI();
  appMode = mode;
  // update header UI (quiz/dict toggle, score pills visibility)
  _syncAppModeUI();

  if (mode === 'dict') {
    answered = true; // allow notation/breakdown to render
    if (!dictSymbol) dictSymbol = dictDefaultSymbol();
    renderPoolPanel(); // unified — reads appMode internally
    dictLoadAndShow(dictSymbol);
  } else {
    answered = false;
    renderPoolPanel();
    MODE_HANDLERS[currentMode].generateQuestion();
  }
}

function dictDefaultSymbol() {
  // returns first symbol in current mode's full catalog
}

function dictApplyInversion(invIdx) { ... } // ~20 lines, unchanged logic
```

No pool panel rendering. No state setup. No notation calls. All of that
goes through MODE_HANDLERS.

---

## Proposed directory structure

```
/
├── index.html                  ← shell only: loads all CSS + JS in order
│
├── css/
│   ├── base.css                ← CSS variables (both themes), reset, typography
│   ├── layout.css              ← sticky header, tabs, panels, play area,
│   │                             notation card, breakdown, answer UI, controls
│   └── mobile.css              ← all @media (max-width: 600px) overrides
│
├── js/
│   ├── data/
│   │   ├── spelling.js         ← spelledNote, spelledRoot, midiToVexKeySpelled,
│   │   │                         vexAccidental, pcInterval,
│   │   │                         LETTER_PCS, LETTER_NAMES,
│   │   │                         TRITONE_AS_D5, EIGHT_AS_A5, NINE_AS_D7
│   │   │                         Depends on: nothing
│   │   │
│   │   ├── keysig.js           ← vexKeyMajor, vexKeyMinor,
│   │   │                         keySigCoveredLetters, isCoveredByKeySig,
│   │   │                         respellForKeySig, keySigCoveredPcs,
│   │   │                         keySigAccidentalCount,
│   │   │                         MAJOR_SHARPS_COUNT, MAJOR_FLATS_COUNT,
│   │   │                         MINOR_TO_REL_MAJOR
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── intervals.js        ← INTERVALS, INTERVAL_STYLES,
│   │   │                         INTERVAL_CONSONANCE, INTERVAL_CONTEXT,
│   │   │                         INTERVAL_INVERSION_NAME, INTERVAL_INVERSION_SEMITONES,
│   │   │                         INTERVAL_ABBR, intervalAbbr,
│   │   │                         SEMITONE_TO_NUMERAL, SEMITONE_TO_ROMAN,
│   │   │                         semitonesToNumeral, semitoneToDegree,
│   │   │                         tritoneLabel
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── chords.js           ← CHORD_TYPES, CHORD_PLAYBACK_STYLES,
│   │   │                         VOICING_MODES, applyVoicingMode,
│   │   │                         resolveVoicingMode, INV_LABELS,
│   │   │                         applyInversion, buildInversionPool,
│   │   │                         getAllChords
│   │   │                         Depends on: spelling.js
│   │   │
│   │   ├── scales.js           ← SCALES, SCALE_DIRECTIONS, SCALE_REF,
│   │   │                         SCALE_CHARACTER, SCALE_MODAL_PARENT,
│   │   │                         getChordScales, getScaleParentKeyStr,
│   │   │                         computeDegreeNumerals, computeTriadMap,
│   │   │                         getModalCharacter
│   │   │                         Depends on: spelling.js, intervals.js
│   │   │
│   │   └── progressions.js     ← PROGRESSIONS, PROG_DEGREES, PROG_QUALITIES,
│   │                             PROG_GROUPS, PROG_GROUP_COLLAPSED,
│   │                             selectedProgressions, progChordMidi,
│   │                             HARMONIC_FUNCTION, qualityFullName
│   │                             Depends on: chords.js
│   │
│   ├── engine/
│   │   ├── state.js            ← all state with zero data-layer dependencies:
│   │   │                         piano, audioCtx, answered, appMode,
│   │   │                         correct, total, streak,
│   │   │                         currentChord, currentMidiNotes,
│   │   │                         currentChordRootMidi,
│   │   │                         currentSlashBassMidi, currentUpperRootMidi,
│   │   │                         currentPolyUpperMidi, currentPolyLowerMidi,
│   │   │                         currentPolyUpperRootMidi, currentPolyLowerRootMidi,
│   │   │                         currentUSTShellMidi, currentUSTUpperMidi,
│   │   │                         currentUSTRootMidi,
│   │   │                         currentMode, currentInterval, currentIntervalMidi,
│   │   │                         intervalStyle, currentIntervalStyle,
│   │   │                         chordPlayStyle, currentChordPlayStyle,
│   │   │                         activeVoicingMode, currentVoicingMode,
│   │   │                         currentScale, currentScaleRootMidi,
│   │   │                         scaleDirection, currentScaleDir,
│   │   │                         currentProgression, currentProgRootPc,
│   │   │                         currentProgRootMidi, progAnswered, progSlotAnswers,
│   │   │                         chordKeySigMode, intervalKeySigMode,
│   │   │                         scaleKeySigMode, progKeySigMode,
│   │   │                         resolutionActive, resolutionRootMidi,
│   │   │                         showRoot, sessionStats,
│   │   │                         pinnedRoot, pinnedRootSpelling, pinnedOctave
│   │   │                         Depends on: nothing
│   │   │
│   │   ├── defaults.js         ← state that references data constants at init:
│   │   │                         selectedChords = new Set(['maj','m','dim','aug'])
│   │   │                         selectedIntervals = new Set(INTERVALS.filter(...))
│   │   │                         selectedScales = new Set(['major','nat_minor'])
│   │   │                         Depends on: intervals.js, chords.js, scales.js
│   │   │
│   │   ├── audio.js            ← initAudio, playChord, playInterval,
│   │   │                         playScale, playProgression,
│   │   │                         playProgressionSlowly, playSlowly,
│   │   │                         midiToSoundFontName, setPlayingState
│   │   │                         Depends on: state.js, chords.js, progressions.js
│   │   │
│   │   └── notation.js         ← renderNotation, renderPolyNotation,
│   │                             showNotation (router: intervals/scales/poly/
│   │                               UST/slash/normal — calls showBreakdown at end),
│   │                             hideNotation,
│   │                             getChordKeyStr, getIntervalKeyStr,
│   │                             getScaleParentKeyStr (notation side),
│   │                             getBestFitKeyStr, setKeySig
│   │                             NOTE: showProgressionNotation lives in
│   │                             progressions-mode.js, not here
│   │                             Depends on: state.js, spelling.js, keysig.js,
│   │                                         chords.js, scales.js, intervals.js
│   │
│   ├── breakdown/
│   │   ├── breakdown.js        ← showBreakdown (router — calls per-mode branch),
│   │   │                         hideBreakdown, makeBDRow, joinSep,
│   │   │                         addDivider, makePill, makeRiemannRow,
│   │   │                         makeChordScalesRow, makeVoiceLeadingRow,
│   │   │                         figuredBass, ordinal
│   │   │                         Depends on: state.js, spelling.js, intervals.js,
│   │   │                                     scales.js, chords.js
│   │   │
│   │   ├── breakdown-chords.js ← chord breakdown branch:
│   │   │                         slash, poly, UST, inversions,
│   │   │                         normal chord theory rows,
│   │   │                         computeRiemannRelations,
│   │   │                         computeTritoneSubInfo,
│   │   │                         computeDimEnharmonics, computeDimDomSubs,
│   │   │                         computeAugEnharmonics,
│   │   │                         computeHalfDimContext, computeSusResolution
│   │   │                         Depends on: breakdown.js, chords.js, state.js
│   │   │
│   │   ├── breakdown-intervals.js ← interval breakdown branch
│   │   │                         Depends on: breakdown.js, intervals.js, state.js
│   │   │
│   │   ├── breakdown-scales.js ← scale breakdown branch,
│   │   │                         computeTriadMap (breakdown side)
│   │   │                         Depends on: breakdown.js, scales.js, state.js
│   │   │
│   │   └── breakdown-progressions.js ← progressions breakdown branch
│   │                         Depends on: breakdown.js, progressions.js, state.js
│   │
│   ├── ui/
│   │   ├── pool.js             ← renderPoolPanel (reads appMode, routes to
│   │   │                           _renderChordPool, _renderIntervalPool, etc.)
│   │   │                         makeSection(body, title, items, options)
│   │   │                           options.mode 'multi'|'single' controls behavior
│   │   │                           All/None only rendered in multi mode
│   │   │                         makeProgSection(body, title, items, options)
│   │   │                         makePoolPanelShell
│   │   │                         makeCollapsible
│   │   │                         NOTE: no separate dict render functions —
│   │   │                         all rendering goes through makeSection with
│   │   │                         the appropriate mode option
│   │   │                         Depends on: state.js, chords.js, intervals.js,
│   │   │                                     scales.js, progressions.js
│   │   │
│   │   ├── chips.js            ← renderVoicingChips, renderChordStyleChips,
│   │   │                         renderIntervalStyleChips, renderScaleDirChips,
│   │   │                         renderRegisterPanel, renderInversionChips,
│   │   │                         dictApplyInversion
│   │   │                         Depends on: state.js, pool.js
│   │   │
│   │   ├── stats.js            ← renderStats, updateRootBadge, recordAnswer,
│   │   │                         updateStatsTable, resetSession
│   │   │                         Depends on: state.js
│   │   │
│   │   └── controls.js         ← renderControls (unified — slow + resolve always,
│   │   │                           Next only in quiz after answering),
│   │   │                         renderAnswers (quiz answer dropdown),
│   │   │                         updateSubmitBtn, revealDropdownAnswer
│   │   │                         NOTE: renderControls calls
│   │   │                         MODE_HANDLERS[currentMode].playSlowly()
│   │   │                         and MODE_HANDLERS[currentMode].generateQuestion()
│   │   │                         so it depends on app.js for MODE_HANDLERS —
│   │   │                         MODE_HANDLERS must be declared in state.js
│   │   │                         or as a global in app.js before controls runs
│   │   │                         Depends on: state.js, chords.js
│   │   │
│   ├── modes/
│   │   ├── chords-mode.js      ← generateQuestion, loadItem(symbol),
│   │   │                         submitAnswer, showCurrentView,
│   │   │                         recomputeNotes, playChord, playSlowly, teardown,
│   │   │                         setupChordState (internal shared helper),
│   │   │                         _resetChordState, _setupSlashChord,
│   │   │                         _setupPolyChord, _setupUSTChord,
│   │   │                         _setupNormalChord,
│   │   │                         getActivePool, chooseRootMidi,
│   │   │                         chooseSimpleRootMidi, pickRandom,
│   │   │                         resolveOctaveBand, resolveVoicingMode,
│   │   │                         getChordRootName, getSlashResolvedName,
│   │   │                         getPolyChordLabel, getUSTLabel,
│   │   │                         playResolution, getResolutionInfo
│   │   │                         Depends on: state.js, defaults.js, audio.js,
│   │   │                                     notation.js, breakdown.js,
│   │   │                                     chords.js, controls.js, chips.js
│   │   │
│   │   ├── intervals-mode.js   ← generateQuestion, loadItem(symbol),
│   │   │                         submitAnswer, showCurrentView,
│   │   │                         recomputeNotes, playChord, playSlowly, teardown,
│   │   │                         setupIntervalState (internal shared helper),
│   │   │                         getActiveIntervalPool, resolveIntervalStyle
│   │   │                         Depends on: state.js, defaults.js, audio.js,
│   │   │                                     notation.js, breakdown.js,
│   │   │                                     intervals.js, controls.js
│   │   │
│   │   ├── scales-mode.js      ← generateQuestion, loadItem(symbol),
│   │   │                         submitAnswer, showCurrentView,
│   │   │                         recomputeNotes, playChord, playSlowly, teardown,
│   │   │                         setupScaleState (internal shared helper),
│   │   │                         getActiveScalePool, resolveScaleDir
│   │   │                         Depends on: state.js, defaults.js, audio.js,
│   │   │                                     notation.js, breakdown.js,
│   │   │                                     scales.js, controls.js
│   │   │
│   │   └── progressions-mode.js ← generateQuestion, loadItem(symbol),
│   │                              submitAnswer, showCurrentView,
│   │                              recomputeNotes, playChord, playSlowly, teardown,
│   │                              showProgressionNotation (lives here, not notation.js),
│   │                              renderProgressionAnswerUI,
│   │                              teardownProgressionUI,
│   │                              getActiveProgressionPool
│   │                              Depends on: state.js, defaults.js, audio.js,
│   │                                          notation.js, breakdown.js,
│   │                                          breakdown-progressions.js,
│   │                                          progressions.js, controls.js
│   │
│   ├── dict/
│   │   └── dictionary.js       ← thin coordinator only (~80 lines):
│   │                             dictSymbol, dictInversionIndex, dictProgSymbol
│   │                               (dict-specific state only),
│   │                             setAppMode(mode),
│   │                             dictLoadAndShow(symbol),
│   │                             dictDefaultSymbol(),
│   │                             dictApplyInversion (if not moved to chips.js),
│   │                             _syncAppModeUI()
│   │                             NOTE: no pool rendering, no state setup,
│   │                             no notation calls — all through MODE_HANDLERS
│   │                             Depends on: state.js, all mode files
│   │
│   └── app.js                  ← MODE_HANDLERS map (declared here so all files
│                                   can reference it),
│                                 switchMode(mode),
│                                 generateQuestion() router,
│                                 recomputeCurrentNotes() router,
│                                 resetSession,
│                                 theme toggle,
│                                 boot: initAudio, renderPoolPanel,
│                                       renderChordStyleChips, renderVoicingChips,
│                                       renderIntervalStyleChips, renderScaleDirChips,
│                                       renderRegisterPanel,
│                                       makeCollapsible wiring,
│                                       event listeners (play btn, tabs, keyboard,
│                                       showRoot, stats toggle, new session)
│                                 Depends on: everything
│
└── assets/
    └── logo.svg                ← extracted from base64 inline in current file
```

---

## Script load order in index.html

```html
<!-- Data layer — no DOM, no state dependencies -->
<script src="js/data/spelling.js"></script>
<script src="js/data/keysig.js"></script>
<script src="js/data/intervals.js"></script>
<script src="js/data/chords.js"></script>
<script src="js/data/scales.js"></script>
<script src="js/data/progressions.js"></script>

<!-- Engine — depends on data -->
<script src="js/engine/state.js"></script>
<script src="js/engine/defaults.js"></script>
<script src="js/engine/audio.js"></script>
<script src="js/engine/notation.js"></script>

<!-- Breakdown — depends on engine + data -->
<script src="js/breakdown/breakdown.js"></script>
<script src="js/breakdown/breakdown-intervals.js"></script>
<script src="js/breakdown/breakdown-scales.js"></script>
<script src="js/breakdown/breakdown-chords.js"></script>
<script src="js/breakdown/breakdown-progressions.js"></script>

<!-- UI components — depends on engine -->
<script src="js/ui/stats.js"></script>
<script src="js/ui/controls.js"></script>
<script src="js/ui/chips.js"></script>
<script src="js/ui/pool.js"></script>

<!-- Mode logic — depends on everything above -->
<script src="js/modes/chords-mode.js"></script>
<script src="js/modes/intervals-mode.js"></script>
<script src="js/modes/scales-mode.js"></script>
<script src="js/modes/progressions-mode.js"></script>

<!-- Dictionary — depends on modes -->
<script src="js/dict/dictionary.js"></script>

<!-- App boot — last, depends on everything -->
<script src="js/app.js"></script>
```

---

## CSS load order in index.html

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/mobile.css">
```

Three files instead of five. The current monolith already has all mobile
overrides grouped at the bottom in one `@media` block — `mobile.css` is a
direct cut-and-paste of that block. `base.css` takes CSS variables and reset.
`layout.css` takes everything else.

---

## Migration strategy — Option B (outside-in, recommended)

Split in layers, testing after each layer.

### Layer 1 — CSS
Extract `<style>` into three files. Extract base64 logo to `assets/logo.svg`.
No logic changes.

**Verify:**
- All four modes render correctly
- Dark mode toggle works
- Mobile layout intact at 375px viewport
- Notation card is white in dark mode
- Logo renders

### Layer 2 — Data layer
Extract in order: `spelling.js` → `keysig.js` → `intervals.js` → `chords.js`
→ `scales.js` → `progressions.js`. Pure data and pure functions, no DOM, no
state. Each file can be verified by checking the browser console for undefined
reference errors after load.

**Verify:**
- App boots without console errors
- Each mode generates a question and plays audio
- No undefined errors on any mode switch

### Layer 3 — State
Extract `state.js` (zero deps), then `defaults.js` (depends on data layer).
No logic changes — pure relocation.

**Verify:**
- Scores reset correctly on New Session
- Selected pool persists through mode switch
- pinnedRoot / pinnedOctave affect playback register

### Layer 4 — Audio
Extract `audio.js`. Wire `initAudio` call in `app.js`.

**Verify:**
- All four play buttons work
- Block / ascending / descending / broken chord styles all work
- Replay button works post-answer
- Progression plays in sequence

### Layer 5 — Notation
Extract `notation.js` (renderNotation, renderPolyNotation, showNotation router,
hideNotation, setKeySig, key string helpers).
`showProgressionNotation` stays in the monolith for now — it moves in Layer 7.

**Verify:**
- Chord notation renders after answering (all families: normal, slash, poly, UST)
- Key sig chip changes notation correctly
- Interval notation shows correct direction
- Scale notation shows ascending / descending / both
- VexFlow accidentals correct in all key sigs

### Layer 6 — Breakdown
Extract one file at a time. `breakdown.js` first (shared helpers + router),
then each branch. After each file, test that mode's breakdown panel.

**Verify after each file:**
- Breakdown panel expands after answering
- All rows render with correct content
- Progression breakdown shows all chords (BUG-6 regression check)
- Chord scales section works
- Voice leading row works

### Layer 7 — UI components + Mode files + Dictionary + App
This is the largest layer. Extract in order:
`stats.js` → `controls.js` → `chips.js` → `pool.js` →
`chords-mode.js` → `intervals-mode.js` → `scales-mode.js` →
`progressions-mode.js` → `dictionary.js` → `app.js`

**This layer is where the refactoring happens:**
- Write `makeSection` with `mode` option (replaces makeSection + makeDictSection)
- Write `setupChordState` / `setupIntervalState` / `setupScaleState`
- Write unified `renderControls`
- Write `showCurrentView` on each mode handler
- Wire `MODE_HANDLERS` map in `app.js`

**Verify after each mode file:**
- Quiz: question generates, plays, answer scores correctly
- Dict: item loads immediately, notation and breakdown show without answering
- Pool panel shows same groups in both modes
- Slow button works in both modes
- Resolve button works in both modes (chords)
- Next button only appears in quiz after answering
- Inversion chips work in both modes (chords)
- Key sig chips update notation in both modes
- Register panel affects both quiz and dict playback

**Full regression after app.js:**
- All four modes × quiz + dict = 8 combinations work end to end
- Keyboard shortcuts work (Space, Enter)
- Theme toggle works
- Stats panel works
- New Session resets correctly
- Mode switch cleans up previous mode DOM

---

## Known couplings to watch

**`dictLoadAndShow` mirrors `generateQuestion` state setup**
Even after extracting `setupChordState`, both paths call the same helper.
Any new chord family (e.g. Point 42) must add a branch to `setupChordState`
once — both quiz and dict get it automatically. Do not add family-specific
logic anywhere else.

**`renderControls` depends on `MODE_HANDLERS`**
`MODE_HANDLERS` is declared in `app.js` but `controls.js` loads before `app.js`.
Resolve by declaring `let MODE_HANDLERS = {}` in `state.js` and populating it
in `app.js` at boot. Then `controls.js` can reference it safely.

**`showNotation` calls `showBreakdown` at its end**
This is intentional coupling — notation and breakdown always appear together
post-reveal. If you ever need notation without breakdown (unlikely), extract
the `showBreakdown()` call to `showCurrentView()` instead.

**VexFlow global**
VexFlow is loaded via CDN and attaches to `window.Vex`. All notation files
reference `Vex` directly — no import needed.

**SoundFont / piano global**
`piano` is declared in `state.js`, assigned in `audio.js` on boot.
All files reference `piano` directly.

**No ES modules**
We deliberately avoid `import`/`export`. Plain `<script>` tags in load order
is simpler, universally compatible, and sufficient for this codebase size.
`file://` local testing works without a server.

---

## File size estimates

| File | Est. lines | Notes |
|---|---|---|
| spelling.js | ~180 | |
| keysig.js | ~130 | |
| intervals.js | ~130 | |
| chords.js | ~220 | CHORD_TYPES alone is ~180 lines |
| scales.js | ~160 | |
| progressions.js | ~260 | |
| state.js | ~60 | Zero deps — primitives only |
| defaults.js | ~20 | Group 3 state only |
| audio.js | ~120 | |
| notation.js | ~200 | showProgressionNotation moved out |
| breakdown.js | ~100 | Shared helpers + router |
| breakdown-chords.js | ~200 | |
| breakdown-intervals.js | ~80 | |
| breakdown-scales.js | ~130 | |
| breakdown-progressions.js | ~120 | |
| pool.js | ~180 | Unified makeSection replaces 6 functions |
| chips.js | ~150 | |
| stats.js | ~80 | |
| controls.js | ~100 | Unified renderControls |
| chords-mode.js | ~200 | Includes setupChordState + _setup helpers |
| intervals-mode.js | ~80 | |
| scales-mode.js | ~80 | |
| progressions-mode.js | ~220 | Includes showProgressionNotation |
| dictionary.js | ~80 | Thin coordinator only |
| app.js | ~150 | MODE_HANDLERS + boot + event listeners |
| **Total JS** | **~3,430** | vs ~5,800 JS lines in monolith |
| CSS (3 files) | ~720 | Same total, better organised |
| index.html (shell) | ~60 | |
| **Grand total** | **~4,210** | vs 6,520 currently |

---

## What this unlocks

- **Bug fixes are local** — `breakdown-progressions.js` is the only file
  that touches progression breakdown. No hunting through 6,500 lines.
- **New chord families** — add to `chords.js` + one branch in `setupChordState`.
  Quiz and dict get it automatically.
- **New modes** — add `js/modes/newmode-mode.js`, add to `MODE_HANDLERS`,
  add a pool render branch in `pool.js`.
- **Pool panel changes** — edit `makeSection` once, affects both quiz and dict.
- **Controls changes** — edit `renderControls` once, affects both modes.
