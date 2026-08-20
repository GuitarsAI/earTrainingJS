# The Sound Travels Ear Training — Architecture

> **Working reference document — production pass only. Delete after v1.0.0.**  
> Sections are filled in file by file as the production pass progresses.  
> Last updated: js/engine/notation.js ✅

---

## Repository Structure

```
earTrainingJS/
│
├── .devcontainer/
│   └── devcontainer.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── assets/
│   ├── badges/                        ✅ self-hosted SVGs (no CDN)
│   │   ├── badge-youtube.svg
│   │   ├── badge-linkedin-renato.svg
│   │   ├── badge-linkedin-tst.svg
│   │   └── badge-linkedin-brics.svg
│   ├── fonts/
│   │   ├── inter/                     inter-latin-400/500/600-normal.woff2
│   │   └── playfair-display/          playfair-display-latin-600/700-normal.woff2
│   ├── soundfonts/
│   │   └── FluidR3_GM/
│   │       └── acoustic_grand_piano/  per-note .mp3 files (~4MB)
│   ├── logo.png
│   └── og-image.png                   1200×630px social share image
│
├── css/
│   ├── base.css                       [ ] production pass pending
│   ├── components.css                 ✅ production pass complete
│   └── mobile.css                     [ ] production pass pending
│
├── js/
│   ├── vendor/
│   │   ├── soundfont-player.min.js    self-hosted MIT
│   │   └── vexflow.min.js             self-hosted MIT (v5.0.0)
│   ├── data/
│   │   ├── spelling.js                ✅ production pass complete
│   │   ├── keysig.js                  ✅ production pass complete
│   │   ├── chords.js                  ✅ production pass complete
│   │   ├── intervals.js               ✅ production pass complete
│   │   ├── scales.js                  ✅ production pass complete
│   │   ├── progressions.js            ✅ production pass complete
│   │   └── help-content.js            ✅ production pass complete
│   ├── engine/
│   │   ├── state.js                   ✅ production pass complete
│   │   ├── defaults.js                ✅ production pass complete
│   │   ├── helpers.js                 ✅ production pass complete
│   │   ├── audio.js                   ✅ production pass complete
│   │   ├── notation.js                ✅ production pass complete
│   │   ├── voicings.js                [ ] pending
│   │   └── voiceLeading.js            [ ] pending
│   ├── breakdown/
│   │   ├── breakdown.js               [ ] pending
│   │   ├── breakdown-intervals.js     [ ] pending
│   │   ├── breakdown-chords.js        [ ] pending
│   │   ├── breakdown-scales.js        [ ] pending
│   │   └── breakdown-progressions.js  [ ] pending
│   ├── ui/
│   │   ├── stats.js                   [ ] pending
│   │   ├── controls.js                [ ] pending
│   │   └── pool.js                    [ ] pending
│   ├── modes/
│   │   ├── chords-mode.js             [ ] pending
│   │   ├── intervals-mode.js          [ ] pending
│   │   ├── scales-mode.js             [ ] pending
│   │   ├── progressions-mode.js       [ ] pending
│   │   ├── help-mode.js               [ ] pending
│   │   └── about-mode.js              [ ] pending
│   └── app.js                         [ ] pending
│
├── tests/
│   ├── spelling.test.js
│   ├── keysig.test.js
│   ├── voicings.test.js
│   ├── voiceLeading.test.js
│   ├── helpers.test.js
│   └── notation.test.js
│
├── index.html                         ✅ production pass complete
├── package.json
├── build.sh
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## 7-Layer Architecture

The app is a zero-framework vanilla JS single-page application. All behaviour is in JS files loaded at the bottom of `<body>` in strict dependency order. There is no bundler at runtime — the layers are a logical convention enforced by load order.

```
Layer 0 — Vendor        soundfont-player, VexFlow
Layer 1 — Data          spelling, keysig, chords, intervals, scales, progressions, help-content
Layer 2 — State         state, defaults
Layer 3 — Engine        helpers, voicings, audio, notation, voiceLeading
Layer 4 — Breakdown     breakdown, breakdown-intervals, breakdown-chords, breakdown-scales, breakdown-progressions
Layer 5 — UI            stats, controls, pool
Layer 6 — Modes         chords-mode, intervals-mode, scales-mode, progressions-mode, help-mode, about-mode
Layer 7 — Boot          app.js
```

**Rule:** each layer may only reference symbols defined in layers above it. No layer reaches down.

---

## Load Order & Dependency Graph

```
soundfont-player.min.js ──────────────────────────────┐
vexflow.min.js ───────────────────────────────────────┤
                                                       ▼
spelling.js → keysig.js → chords.js → intervals.js   audio.js (needs soundfont-player)
→ scales.js → progressions.js → help-content.js       notation.js (needs VexFlow)
       │
       ▼
state.js → defaults.js
       │
       ▼
helpers.js → voicings.js → audio.js → notation.js → voiceLeading.js
       │
       ▼
breakdown.js → breakdown-intervals.js → breakdown-chords.js
→ breakdown-scales.js → breakdown-progressions.js
       │
       ▼
stats.js → controls.js → pool.js
       │
       ▼
chords-mode.js → intervals-mode.js → scales-mode.js
→ progressions-mode.js → help-mode.js → about-mode.js
       │
       ▼
app.js  ◀── must load last; orchestrates everything
```

---

## DOM Structure (from index.html)

```
<body>
  #stickyShell / #stickyInner          fixed top bar
    .header                            Row 1: logo, title, About, Help, theme toggle
    .score-bar                         Row 2: streak, score, New Session, QD toggle
    .mode-tabs                         Row 3: Intervals | Chords | Scales | Progressions

  #app
    #settingsPanel                     collapsible settings / pool panel
    #playArea                          play button, status message
    #notationPanel                     VexFlow SVG output (#notation-svg)
    #breakdownPanel                    post-answer analysis rows
    #answerArea                        dropdown + Submit / Next buttons
    #statsPanel                        session accuracy table by type
    #helpView                          full-screen Help overlay
    #aboutView                         full-screen About overlay
    <footer>                           badges + copyright
```

---

## External Dependencies (all self-hosted)

| Dependency | Version | Path | License |
|---|---|---|---|
| VexFlow | 5.0.0 | `js/vendor/vexflow.min.js` | MIT |
| soundfont-player | latest | `js/vendor/soundfont-player.min.js` | MIT |
| FluidR3_GM piano samples | — | `assets/soundfonts/FluidR3_GM/acoustic_grand_piano/` | MIT |
| Inter | 400, 500, 600 | `assets/fonts/inter/` | OFL |
| Playfair Display | 600, 700 | `assets/fonts/playfair-display/` | OFL |

No runtime CDN calls. No frameworks. No build-time transpilation required.

---

## File Notes

### ✅ index.html

- Root HTML document and application shell
- Defines complete DOM structure — no inline scripts, no inline styles beyond `display:none` toggles
- All SEO, OG, Twitter meta tags complete
- Canonical and OG URLs: `https://guitarsai.github.io/earTrainingJS/`
- Self-hosted badge SVGs in `assets/badges/` (no shields.io CDN calls)
- `assets/og-image.png` — 1200×630px social share image (to be created in Canva/Figma)
- Accessibility: `aria-label` on all icon buttons, `aria-live="polite"` on `#statusMsg`, `role="group"` on chip groups, `role="listbox"` on `#ansDropdownList`

---

### css/base.css
[ ] — pending production pass

---

### ✅ css/components.css

**Role:** All component-level styles for the application. Consumed after `base.css` (which defines the CSS custom property tokens) and before `mobile.css` (which applies narrow-viewport overrides). Contains zero design tokens — all colour, spacing, and shadow values are referenced via `var(--...)` from `base.css`, with two deliberate exceptions noted below.

**Size:** 1,128 lines across 20 sections.

**Structure — 20 sections in render order:**

| § | Section | Key elements |
|---|---|---|
| 1 | Sticky header shell | `#stickyShell` (fixed, z-index 200), `#stickyInner` (max-width 580px centred column) |
| 2 | Header row | `.header`, `.header-left`, `.header-actions`, `.site-logo`, `.title` (Playfair Display serif) |
| 3 | Score bar & Quiz/Dictionary toggle | `.score-bar`, `.score-pill`, `.qd-toggle`, `.qd-btn` / `.qd-btn.active` |
| 4 | Theme toggle & About/Help buttons | `.theme-toggle`, `#themeToggleMobile` (hidden at desktop), `.about-btn` / `.about-btn.active` |
| 5 | Mode tabs | `.mode-tabs`, `.mode-tab` / `.mode-tab.active` (teal underline; `flex:1` fills full width) |
| 6 | Training pool panel | `.pool-panel`, `.pool-panel-header`, `.pool-panel-body` / `.open`, `.pool-section`, `.pool-section-header`, `.pool-section-body` / `.collapsed`, `.pool-section-chevron`, `.pool-chips`, `.pool-chip` / `.active`, `.pool-inv-row` |
| 7 | Chip system | `.option-chip` base + four aliases: `.chord-style-chip`, `.voicing-chip`, `.style-chip`, `.scale-dir-chip` — all share one ruleset; row wrappers: `.chord-style-row`, `.voicing-mode-row`, `.interval-style-row`, `.scale-dir-row` |
| 8 | Play area | `.play-area`, `.play-label`, `.play-btn` / `.playing` / `:disabled`, `.chord-hint` |
| 9 | Notation panel | `.notation-area` (hardcoded `#ffffff` — see design decisions), `.notation-scroll` (`-webkit-overflow-scrolling: touch`), `#notation-svg`, `.notation-label`, `.notation-chord-name`, `.keysig-chip-row`, `.keysig-chip` / `.active` (hardcoded light-palette — see design decisions) |
| 10 | Quiz status | `.status-msg` / `.good` (`--correct`) / `.bad` (`--wrong`); `min-height` preserves layout when empty |
| 11 | Answer dropdown | `.answer-dropdown-wrap`, `.ans-dropdown-trigger` / `.open` / `.correct` / `.wrong` / `.disabled`, CSS `::after` chevron, `.ans-dropdown-list` / `.open`, `.ans-dropdown-item` / `.correct` / `.wrong` |
| 12 | Controls | `.controls`, `.ctrl-btn` / `.primary` / `.slow` / `.resolve` |
| 13 | Settings panel | `.settings-panel`, `.settings-panel-header`, `.settings-panel-body` / `.open`, `.settings-section`, `.settings-section-label`, `.settings-chips` |
| 14 | Root note & register chips | `.register-row`, `.register-label`, `.register-chips`, `.reg-chip` / `.active` |
| 15 | Breakdown panel | `.breakdown-panel`, `.breakdown-header`, `.breakdown-figured` (superscript figured bass), `.breakdown-row`, `.breakdown-key`, `.breakdown-val`, `.breakdown-sep`, `.breakdown-divider`, `.breakdown-pills`, `.breakdown-pill`, `.breakdown-pill-label`, `.breakdown-pill-value`; Riemannian tooltip: `.bd-riemann-wrap`, `.bd-riemann-icon`, `.bd-riemann-tooltip` (CSS-only hover/focus; `@media (max-width: 479px)` flips anchor to right); Chord scales sub-section: `.cs-section`, `.cs-header`, `.cs-body` / `.open`, `.cs-row` / `.cs-row-link` (CSS `::after` arrow on hover), `.cs-name`, `.cs-name-link`, `.cs-tag`, `.cs-note` |
| 16 | Root toggle & stats panel | `.root-toggle-row`, `.root-badge`; `.stats-panel`, `.stats-title`, `.stats-table`, `.stat-bar-wrap`, `.stat-bar` (width set inline by `js/ui/stats.js`), `.stats-toggle`, `.kbd-hint`, `.new-session-btn` |
| 17 | Voice leading | `.vl-selected` (`!important` border + background override on `.cs-section` card), `.vl-table` with four `td:nth-child()` column rules (voice name / target note teal / interval / annotation italic) |
| 18 | Progression mode | `.prog-slots-wrap` (horizontal scroll; custom scrollbar), `.prog-slot` / `.correct` / `.wrong`, `.prog-slot-label`, `.prog-slot-revealed`, `.prog-slot-row`, `.prog-chip` / `.active` / `.disabled`, `.prog-submit-row`, `.prog-submit-btn`, `.prog-notation-row`, `.prog-notation-cell`, `.prog-notation-cell-label`; pool chip variant: `.pool-chip.prog-pool-chip`, `.prog-chip-sym`, `.prog-chip-name` |
| 19 | About view | `.about-section`, `.about-card`, `.about-card-title` (Playfair Display), `.about-card-text`, `.about-badges` (flex row; `translateY(-1px)` hover lift), `.about-youtube-placeholder`, `.about-sponsor-btn`, `.about-qr-placeholder` |
| 20 | Help view | `.help-section`, `.help-search-wrap` (`position:sticky`), `.help-search`, `.help-card`, `.help-card-title` (Playfair Display), `.help-entries`, `.help-entry` (`<details>`), `.help-entry-term` (`<summary>`; `::-webkit-details-marker` suppressed; CSS `::after` ▸ arrow rotates 90° on `[open]`), `.help-entry[open]` (teal term colour — pure CSS, no JS), `.help-entry-body` (`br + br` paragraph spacing) |

**JS drivers — which layer writes to which component:**

| Component | Written by |
|---|---|
| `.mode-tab.active` | `js/app.js` → `switchMode()` |
| `.pool-panel-body.open`, `.pool-section-body.collapsed`, `.pool-chip.active` | `js/ui/pool.js` |
| `.qd-btn.active` | `js/app.js` |
| `.style-chip.active`, `.chord-style-chip.active`, `.voicing-chip.active`, `.scale-dir-chip.active` | `js/modes/*-mode.js` (each mode manages its own chips) |
| `.play-btn.playing`, `.play-btn:disabled` | `js/engine/audio.js` |
| `.notation-area` (display toggle), `.keysig-chip.active` | `js/engine/notation.js` |
| `.status-msg.good` / `.bad` | `js/ui/controls.js` |
| `.ans-dropdown-trigger`, `.ans-dropdown-list`, `.ans-dropdown-item` (all states) | `js/ui/controls.js` |
| `.settings-panel-body.open` | `js/app.js` |
| `.reg-chip.active` | `js/modes/chords-mode.js`, `js/modes/intervals-mode.js` |
| `.breakdown-*`, `.cs-*`, `.vl-*`, `.bd-riemann-*` | `js/breakdown/breakdown-chords.js`, `breakdown-intervals.js`, `breakdown-scales.js`, `breakdown-progressions.js` |
| `.stat-bar` width (inline style) | `js/ui/stats.js` |
| `.stats-panel` (display toggle), `.stats-toggle` | `js/app.js` |
| `.prog-slot.correct` / `.wrong`, `.prog-chip.active` / `.disabled`, `.prog-submit-btn:disabled` | `js/modes/progressions-mode.js` |
| `.about-btn.active`, `#aboutView` (display toggle) | `js/modes/about-mode.js` |
| `#helpView` (display toggle), `.help-entry` search filter | `js/modes/help-mode.js` |
| `#themeToggleMobile` (display managed by `mobile.css`, not JS) | `js/app.js` writes `data-theme` to `<html>` |

**Design decisions recorded:**

- **Notation card hardcoded white** — `.notation-area` uses `background: #ffffff` (not `var(--bg-card)`) because VexFlow renders black ink; the card must remain white regardless of active theme. `.notation-label`, `.notation-chord-name`, and all `.keysig-chip` colours are also hardcoded to light-palette hex values for the same reason — they sit on a white surface, not the themed background.
- **`#themeToggleMobile` hidden here** — `display:none` is set in this file; `mobile.css` overrides to `display:inline-flex` at the narrow breakpoint. The desktop instance `#themeToggle` is always visible via `.header-actions`.
- **Chip alias pattern** — `.option-chip`, `.chord-style-chip`, `.voicing-chip`, `.style-chip`, `.scale-dir-chip` all share one ruleset via a grouped selector. This allows JS in each mode file to use semantically meaningful class names without any style duplication.
- **Riemannian tooltip is CSS-only** — shown via `:hover` and `:focus-within` on `.bd-riemann-wrap`. The only `@media` query in this file (`max-width: 479px`) exists solely to prevent this tooltip clipping off the left edge on the smallest viewports.
- **`.vl-selected` uses `!important`** — overrides the `.cs-section` border and background to create the visual link between the voice leading engine output and the harmonic field panel. Intentional; no other `!important` in the file.
- **`min-height: 2.75rem`** — applied consistently to every interactive element (chips, buttons, triggers, table rows) to meet the 44×44px touch target floor required by the accessibility pass.

---

### css/mobile.css
[ ] — pending production pass

---

### ✅ js/data/spelling.js

**Role:** Interval-based enharmonic spelling engine. Single source of truth for converting pitch-class and MIDI data into correctly spelled note names and VexFlow key strings. Loaded first in the data layer because every other file that touches notation depends on it.

**Fundamental design decision — interval over pitch class:**
The letter name of any note is determined by its interval from the root, not by its raw pitch class. A major 3rd above D♯ must be F## (the 3rd degree) — not G (which is the correct pitch but the wrong letter). This is the only approach that produces theoretically correct enharmonic spelling for all chord and scale types, including diminished, augmented, and altered chords where double accidentals are musically necessary. A pitch-class lookup table cannot make this distinction.

**Public API:**

| Function | Description |
|---|---|
| `spelledNote(intervalSemitones, rootPc, symbol)` | Core engine. Returns display string (e.g. `"F##\u00a0(G)"`, `"B♭"`, `"E"`). Double accidentals include enharmonic parenthetical. |
| `spelledRoot(rootPc)` | Convenience wrapper for the root note itself (interval = 0). Respects `pinnedRootSpelling`. |
| `midiToVexKeySpelled(midi, intervalSemitones, rootPc, symbol)` | Returns VexFlow key string (e.g. `"fbb/4"`, `"g##/3"`). Handles octave boundary corrections for Cb/B## edge cases. |
| `vexAccidental(vexKey)` | Extracts VexFlow accidental token (`'##'` \| `'bb'` \| `'#'` \| `'b'` \| `null`) from a key string. |
| `pcInterval(targetPc, rootPc)` | Utility: ascending semitone distance (0–11) between two pitch classes. |

**Key data tables:**

| Constant | Purpose |
|---|---|
| `LETTER_PCS` / `LETTER_NAMES` | Natural pitch class and name for each of the 7 diatonic letters (C=0 … B=6) |
| `SEMITONES_TO_LETTER_STEPS` | Maps semitone count (0–11) to diatonic letter steps above root |
| `TRITONE_AS_D5` | Symbols where 6 semitones spells as d5 rather than A4 (diminished family, Locrian, Altered) |
| `EIGHT_AS_A5` | Symbols where 8 semitones spells as A5 rather than m6 (augmented family, whole-tone) |
| `NINE_AS_D7` | Symbols where 9 semitones spells as d7 rather than M6 (fully diminished °7) |
| `SHARP_NAMES_BASIC` / `FLAT_NAMES_BASIC` | Simple pitch-class name arrays used only for enharmonic parentheticals |

**Dependencies:** `pinnedRootSpelling` (state.js) — controls flat/sharp preference for non-natural roots when no key context is available.

**Consumed by:** `keysig.js`, `notation.js`, all breakdown files.

---

### ✅ js/data/keysig.js

**Role:** Key signature helpers. Resolves which VexFlow key signature string to display for any chord, scale, interval, or polychord; tracks which notes that key signature covers; and handles the Key/C chip UI toggle. Sits directly above `spelling.js` in the data layer — it translates root pitch classes into key contexts that the notation engine consumes.

**Fundamental design decision — letter-based coverage, not pitch-class:**
A key signature covers specific letter+accidental combinations, not pitch classes. E♭ major covers the letter E with a flat — it does NOT cover D♯ even though D♯ and E♭ share pitch class 3. Coverage is therefore tracked as a `Set` of VexFlow letter strings (e.g. `{'bb','eb','ab','db','gb'}`) and matched by letter identity. The older `keySigCoveredPcs()` function uses pitch classes and is marked `@deprecated` — it remains only for legacy callers.

**Function groups:**

| Group | Functions | Purpose |
|---|---|---|
| UI | `setKeySig(mode)` | Handles Key/C chip tap; updates per-mode state; re-renders notation and breakdown |
| Key string resolution | `vexKeyMajor(pc)`, `vexKeyMinor(pc)` | Converts a root pitch class to a VexFlow key string, respecting `pinnedRootSpelling` |
| Key string inference | `getScaleParentKeyStr(scale, rootPc)`, `getChordKeyStr(sym, rootPc)`, `getBestFitKeyStr(midiNotes)`, `getIntervalKeyStr(rootPc)` | Returns the appropriate key signature string for each item type |
| Coverage helpers | `keySigCoveredLetters(vexKeyStr)`, `isCoveredByKeySig(vexKey, coveredLetters)`, `respellForKeySig(midi, vexKey, coveredLetters, keySigStr)` | Letter-based coverage tracking used by `notation.js` to suppress or force accidentals |
| Legacy / utility | `keySigCoveredPcs(vexKeyStr)` *(deprecated)*, `keySigAccidentalCount(vexKeyStr)` | Pitch-class coverage (legacy); accidental count for canvas width padding |

**Notable: `respellForKeySig` priority order:**
When the interval engine produces a double accidental, this function attempts to find a simpler spelling. Priority: (1) cross-letter candidate covered by the key sig; (2) same-letter one-step strip (preserves staff position — takes priority over cross-letter natural to avoid staff collisions); (3) cross-letter natural as last resort.

**Notable: `getBestFitKeyStr`:**
Used for polychords, USTs, and slash chords where no single root key is obvious. Scores all 24 major/minor keys by pitch-class overlap with the chord, breaking ties by fewest accidentals (proximity to C major).

**Dependencies:** `pinnedRootSpelling` (state.js); `spelling.js` (LETTER_PCS, LETTER_NAMES via shared scope); rendering functions `showProgressionNotation()`, `showCurrentView()`, `showNotation()`, `showBreakdown()`.

**Consumed by:** `notation.js`, all breakdown files.

---

### ✅ js/data/chords.js

**Role:** Complete chord type library. Single source of truth for all playable chord families, their interval structures, extended schema fields, and playback style options. Loaded in the data layer; consumed by every file that needs to construct, voice, spell, or display a chord.

**Exports:**

| Constant | Type | Description |
|---|---|---|
| `CHORD_TYPES` | `Object.<string, Array>` | All chord families keyed by family name. Each entry is an array of chord descriptor objects. |
| `CHORD_PLAYBACK_STYLES` | `Array` | Available playback styles for chord questions (`block`, `ascending`, `descending`, `broken`, `random`). |

**Family overview — 12 families, two schema tiers:**

Standard families share a common schema (`name`, `symbol`, `intervals`, `family`, `basic?`):

| Family | Count | Notes |
|---|---|---|
| `major` | 17 | Triads, added-note, sixth, Maj7 extensions |
| `minor` | 19 | Minor triads, m6, m7, mMaj7 extensions |
| `dominant` | 23 | Dom7 and all altered / suspended / extended variants |
| `diminished` | 4 | dim, m7♭5, °7, °7(Maj7) |
| `augmented` | 4 | aug, Maj7♯5, aug7, aug9 |
| `suspended` | 5 | sus2, sus4, power, and extensions |

Specialised families extend the schema with additional fields:

| Family | Extra fields | Notes |
|---|---|---|
| `classical` | `classicalNote` | N6, It⁺⁶, Fr⁺⁶, Ger⁺⁶. Root badge = bass note (♭6 for aug sixths; ♭2 for N6 in first inversion) |
| `quartal` | `quartal: true`, `quartNote` | 6 voicings: qrt3/4/5, qrtTT, qnt3/4. Triggers modal-context breakdown path |
| `cluster` | `cluster: true`, `clustNote` | 4 voicings: M2/m2 3-note, mixed 4-note, chromatic 4-note. Triggers timbral breakdown path |
| `slash` | `upperIntervals`, `bassInterval`, `belowLabel`, `upperQuality`, `alsoKnownAs?` | 18 entries: 9 maj + 9 min upper triads. Bass placed below upper root by `12 − bassInterval` semitones |
| `poly` | `upperIntervals`, `lowerIntervals`, `lowerOffset`, `upperSymbol`, `lowerSymbol` | 24 entries: Maj/Min/Aug/Dom7 combinations at P5 and TT offsets |
| `ust` | `shellIntervals`, `upperTriadRoot`, `upperTriadIntervals`, `upperQuality`, `ustNumber`, `tensions`, `resultingChord`, `subFamily`, `shellQuality?` | 15 entries across 3 shell contexts: dom7 [4,10], min [3,10], maj7 [4,11]. Root not played |

**Schema field reference:**

| Field | Type | Present on | Description |
|---|---|---|---|
| `name` | string | all | Display label (Unicode ♭/♯) |
| `symbol` | string | all | Internal key — ASCII only, globally unique |
| `intervals` | number[] | standard families | Semitone offsets from root; values >11 = compound intervals |
| `family` | string | all | Pool panel chip category |
| `basic` | boolean | selected | `true` = included in Basic difficulty |
| `classicalNote` | string | classical | Explanatory text for Classical function breakdown sub-section |
| `quartal` | boolean | quartal | Triggers quartal breakdown path |
| `quartNote` | string | quartal | Text for Quartal construction breakdown sub-section |
| `cluster` | boolean | cluster | Triggers timbral/cluster breakdown path |
| `clustNote` | string | cluster | Text for Cluster construction breakdown sub-section |
| `upperIntervals` | number[] | slash, poly, ust | Intervals within the upper triad from its own root |
| `bassInterval` | number | slash | PC offset from upper root UP to bass note (1–11); sounding distance below = 12 − bassInterval |
| `belowLabel` | string | slash | Plain interval name for the sounding-below distance (m2/M2/…/M7/TT) |
| `upperQuality` | string | slash, ust | Quality of the upper triad: `'maj'` or `'min'` |
| `alsoKnownAs` | string | slash (some) | Equivalent standard chord symbol where the voicing has a common tertian reading |
| `lowerIntervals` | number[] | poly | Intervals within the lower triad from its own root |
| `lowerOffset` | number | poly | Semitones from upper root DOWN to lower root (1–11) |
| `upperSymbol` | string | poly | Short quality label for upper triad (`'maj'`\|`'min'`\|`'aug'`\|`'7'`) |
| `lowerSymbol` | string | poly | Short quality label for lower triad |
| `shellIntervals` | number[] | ust | Two-note shell from chord root (e.g. [4,10] = M3+m7 for dom7) |
| `upperTriadRoot` | number | ust | Semitones above chord root where the upper triad root sits |
| `upperTriadIntervals` | number[] | ust | Intervals within the upper triad ([0,4,7] maj / [0,3,7] min) |
| `ustNumber` | string | ust | Scale-degree label (e.g. `'♭II'`, `'IIm'`, `'V'`) |
| `tensions` | string | ust | Comma-separated tensions implied by shell + upper triad |
| `resultingChord` | string | ust | Full chord symbol implied by the combined voicing |
| `subFamily` | string | ust | Shell context: `'dom7'` \| `'min'` \| `'maj7'` |
| `shellQuality` | string | ust (non-dom7) | Explicit shell label for non-dominant contexts: `'min'` or `'maj7'` |

**Dependencies:** none — pure data, no imports.

**Consumed by:** `voicings.js`, `notation.js`, `breakdown-chords.js`, `chords-mode.js`, `pool.js`, `defaults.js`.

---

### ✅ js/data/intervals.js

**Role:** Interval type library. Single source of truth for all quizzable intervals and playback style options. Loaded in the data layer; consumed by every file that needs to construct, play, spell, or display an interval.

**Exports:**

| Constant | Type | Description |
|---|---|---|
| `INTERVALS` | `Array` | 19 interval descriptors: 12 simple (m2–P8) + 7 compound (m9–M13). |
| `INTERVAL_STYLES` | `Array` | 4 playback styles: `harmonic`, `ascending`, `descending`, `random`. |

**Schema:**

| Field | Type | Present on | Description |
|---|---|---|---|
| `name` | string | all | Display label shown to the user. |
| `symbol` | string | all | Internal key — ASCII only, unique. |
| `semitones` | number | all | Interval size in semitones. |
| `compound` | boolean | compound only | `true` = spans more than one octave. Advanced mode only; collapsed and unselected by default. |

**Notable:** Unison (0 semitones) is excluded — it cannot be identified by ear alone. The 19 semitone gap between P11 (17) and A11 (18) and between A11 (18) and m13 (20) is intentional — semitone 16 (m10) and 19 (M12) are not included as named compound intervals in the app's scope.

**Dependencies:** none — pure data.

**Consumed by:** `state.js`, `defaults.js`, `pool.js`, `intervals-mode.js`, `breakdown-intervals.js`.

---

### ✅ js/data/scales.js

**Role:** Scale library and playback direction options. Single source of truth for all quizzable scales. Loaded in the data layer; consumed by every file that needs to construct, play, spell, or display a scale.

**Exports:**

| Constant | Type | Description |
|---|---|---|
| `SCALES` | `Array` | 46 scale descriptors organised into four cardinality groups: pentatonic (13), hexatonic (8), diatonic (22), octatonic (4). |
| `SCALE_DIRECTIONS` | `Array` | 4 playback direction options: `asc`, `desc`, `both`, `random`. |

**Schema:**

| Field | Type | Present on | Description |
|---|---|---|---|
| `name` | string | all | Canonical scale name used internally and in the answer pool. |
| `displayName` | string | some | Extended display name shown in the breakdown panel. Omitted when `name` is sufficient. |
| `symbol` | string | all | Internal key — ASCII only, globally unique. |
| `intervals` | number[] | all | Semitone offsets from the root, including the octave as the final value (e.g. `[0,2,4,5,7,9,11,12]` for Major). |
| `parentKey.offset` | number | all | Semitone offset from the scale root to the parent key's root. Used to resolve a standard key signature for notation. e.g. Dorian on D → parent key C major → offset −2. |
| `parentKey.quality` | string\|null | all | `'major'` \| `'minor'` \| `null`. `null` = no standard key signature applies; notation falls back to C. Used for Japanese pentatonics and Messiaen modes. |
| `group` | string | all | Cardinality group: `'pentatonic'` \| `'hexatonic'` \| `'diatonic'` \| `'octatonic'`. |
| `basic` | boolean | some | `true` = included in Basic difficulty mode. Omitted (falsy) for Advanced-only scales. |

**Notable:** `messiaen_3` (9 notes, octatonic group) appears in the octatonic section despite its note count matching the diatonic section count — it is correctly grouped by `group: 'octatonic'`. `SCALE_DIRECTIONS` includes `random`, which selects ascending or descending at runtime for each new question.

**Dependencies:** none — pure data.

**Consumed by:** `state.js`, `defaults.js`, `pool.js`, `scales-mode.js`, `breakdown-scales.js`.

---

### ✅ js/data/progressions.js

**Role:** Chord progression library, answer UI lookup tables, pool panel configuration, and progression-specific runtime state. Single source of truth for all quizzable progressions. Loaded in the data layer; consumed by every file that needs to construct, play, display, or score a progression.

**Exports:**

| Constant / Variable | Type | Description |
|---|---|---|
| `PROGRESSIONS` | `Array` | 100+ progression descriptors across 13 stylistic groups. |
| `PROG_DEGREES` | `Array` | 12 degree labels (diatonic + chromatic borrows) for the answer UI. |
| `PROG_QUALITIES` | `Array` | 10 chord quality options for the answer UI. |
| `PROG_GROUPS` | `string[]` | Canonical display order of groups in the pool panel. |
| `PROG_GROUP_COLLAPSED` | `Object` | Default collapsed state per group; only Cadences is open on load. |
| `currentProgression` | `Object\|null` | The active PROGRESSIONS entry for the current question. |
| `currentProgRootMidi` | `number` | MIDI note of the tonic for the current question. |
| `currentProgRootPc` | `number` | Pitch class of the tonic (0–11). |
| `progSlotAnswers` | `Array` | Per-slot answer state: `{ degreeIdx, qualityIdx }` for each chord. |
| `progAnswered` | `boolean` | Whether the current question has been submitted. |

**Schema — `PROGRESSIONS`:**

| Field | Type | Description |
|---|---|---|
| `symbol` | string | Unique identifier in Roman numeral notation (ASCII-safe). Suffixes like `-reg`, `-met`, `-bossa` disambiguate entries that share the same numeral sequence across groups. |
| `name` | string | Display label shown in the pool panel and breakdown. |
| `group` | string | Stylistic group. Must match a value in `PROG_GROUPS`. |
| `basic` | boolean | Optional. `true` = included in Basic difficulty. Omitted (falsy) for Advanced-only entries. |
| `degrees` | number[] | Semitone offset of each chord's root above the tonic (0–11), one value per chord. |
| `qualities` | string[] | Quality symbol for each chord, parallel to `degrees[]`. Values match `sym` in `PROG_QUALITIES`. |

**Groups (13):** Cadences, Diminished, Classical, Short, Pop & Rock, Jazz, Blues, Minor, Rock, Reggae, Samba & Bossa, Metal, Extended.

**Notable:** The three 12-bar blues entries store 12 chord slots (one per bar). The `symbol` suffix convention (`-reg`, `-met`, `-bossa`, `-qc`, `-neo`) is the only mechanism preventing symbol collisions between groups. Runtime state variables (`currentProgression` etc.) live here rather than in `state.js` because they are tightly coupled to the progressions data schema; `selectedProgressions` is initialised in `defaults.js` after `PROGRESSIONS` is defined.

**Dependencies:** none — pure data plus runtime state.

**Consumed by:** `state.js`, `defaults.js`, `pool.js`, `progressions-mode.js`, `breakdown-progressions.js`.

---

### ✅ js/data/help-content.js

**Role:** Single source of truth for all in-app Help text. Contains no DOM references or rendering logic — content only. Consumed exclusively by `help-mode.js`, which handles search, rendering, and panel open/close.

**Export:**

| Constant | Type | Description |
|---|---|---|
| `HELP_SECTIONS` | `Array` | Ordered array of section objects, each with `id`, `title`, and `entries[]`. Each entry: `{ term: string, body: string }`. Body uses `\n` for paragraph breaks. |

**Structure — 5 sections:**

| § | id | Title | Entry count |
|---|---|---|---|
| 1 | `getting-started` | Getting Started | 8 |
| 2 | `modes` | Modes | 4 |
| 3 | `controls` | Controls & Settings | 14 |
| 4 | `breakdown` | The Breakdown Panel | 22 |
| 5 | `glossary` | Music Theory Glossary | 32 |

**Notable design decisions:**

- Body text is plain prose only — no HTML tags. `\n` is the sole formatting primitive; `help-mode.js` converts it to `<br><br>` at render time.
- All bullet lists in body text use `•` character + space, written inline as part of the prose string.
- The file is append-only during the production pass — entries are never removed, only added or amended. The help system is the canonical record of every user-facing behaviour in the app.

**Dependencies:** none — pure data.

**Consumed by:** `help-mode.js`.

---

### ✅ js/engine/state.js

**Role:** Global runtime state for the application. Declares all shared mutable variables consumed across the engine, UI, and mode layers. Variables are declared with `var` (not `let`) so they are globally accessible across all `<script>` tags without ES module imports. Contains no logic — assignment only.

**Size:** ~190 lines of declarations and JSDoc.

**Design note — split state ownership:** Two categories of state live outside this file by design:
- Progression runtime state (`currentProgression`, `currentProgRootMidi`, `currentProgRootPc`, `progSlotAnswers`, `progAnswered`) is declared in `js/data/progressions.js` because it is tightly coupled to the progressions data schema.
- Selection state (`selectedChords`, `selectedIntervals`, `selectedScales`, `selectedProgressions`) is initialised in `js/engine/defaults.js` after the data files are loaded.

**Variable groups — 12 sections:**

| § | Section | Variables | Description |
|---|---|---|---|
| 1 | Audio | `piano`, `audioCtx` | soundfont-player instrument instance; Web Audio API context. Both null until first user interaction. |
| 2 | Session | `answered`, `appMode`, `appDifficulty`, `correct`, `total`, `streak` | Cross-mode session tracking. `appMode`: `'quiz'`\|`'dict'`. `appDifficulty`: `'basic'`\|`'advanced'`. |
| 3 | Chord mode | `currentChord`, `currentMidiNotes`, `currentChordRootMidi` | Core chord question state. `currentChordRootMidi` is always the theoretical root regardless of voicing or inversion. |
| 4 | Slash chord | `currentSlashBassMidi`, `currentUpperRootMidi` | Active when `currentChord.family === 'slash'`. |
| 5 | Polychord | `currentPolyUpperMidi`, `currentPolyLowerMidi`, `currentPolyUpperRootMidi`, `currentPolyLowerRootMidi` | Active when `currentChord.family === 'poly'`. Upper and lower triad MIDI notes and roots. |
| 6 | UST (Upper Structure Triad) | `currentUSTShellMidi`, `currentUSTUpperMidi`, `currentUSTRootMidi` | Active when `currentChord.family === 'ust'`. Shell = 3rd + 7th only; root is rootless by design (held by bass player). |
| 7 | Chord pool | `includeInversions` | Boolean flag; when true, chords may be presented with a non-root bass note. |
| 8 | Mode | `currentMode` | Active practice mode: `'chords'`\|`'intervals'`\|`'scales'`\|`'progressions'`. |
| 9 | Interval mode | `currentInterval`, `currentIntervalMidi`, `intervalStyle`, `currentIntervalStyle`, `chordPlayStyle` | `intervalStyle` and `chordPlayStyle` are user-selected (may be `'random'`); `currentIntervalStyle` is the resolved concrete value for the current question. |
| 10 | Voicing | `activeVoicingMode`, `selectedVoicings` | `activeVoicingMode` is single-select (Dictionary / post-answer display). `selectedVoicings` is a `Set<string>` — multi-select quiz pool. Defaults to `{ 'close' }`. |
| 11 | Scale mode | `currentScale`, `currentScaleRootMidi`, `scaleDirection`, `currentScaleDir` | `scaleDirection` may be `'random'`; `currentScaleDir` is the resolved concrete value (`'asc'`\|`'desc'`\|`'both'`). |
| 12 | Notation key signature | `scaleKeySigMode`, `chordKeySigMode`, `intervalKeySigMode`, `progKeySigMode` | `'C'`\|`'key'` per mode. Scales default to `'key'`; all others default to `'C'` (accidentals shown inline). |
| 13 | UX | `showRoot`, `sessionStats` | `showRoot`: root badge visibility before answer reveal. `sessionStats`: `Object.<symbol, { name, correct, total }>` — per-item accuracy for the current session. |
| 14 | Root & octave | `pinnedRoot`, `pinnedRootSpelling`, `pinnedOctave` | `pinnedRoot`: pitch class 0–11, or `null` for random. `pinnedRootSpelling`: `null`\|`'sharp'`\|`'flat'`. `pinnedOctave`: `null`\|`'low'`\|`'mid'`\|`'high'`. |
| 15 | Voice leading cache | `currentVoiceLeadingAnalysis` | Cached result of `analyseChord()` from `voiceLeading.js`. Set on answer reveal; reset to `null` on each new question. Shape: `{ contexts: Array, isAmbiguous: boolean }`. |

**Notable design decisions:**

- `var` is used throughout (not `let` or `const`) to make all variables properties of the global `window` object, accessible across all script tags without imports. This is intentional in a no-bundler, multi-file vanilla JS architecture.
- The `'random'` style values (`intervalStyle`, `chordPlayStyle`, `scaleDirection`) are preserved as user-selected state; the concrete resolved values (`currentIntervalStyle`, `currentScaleDir`) are separate variables, making it possible to display "you heard: ascending" in the breakdown without overwriting the user's preference.
- The three chord family sub-state groups (slash, polychord, UST) are mutually exclusive at runtime. Only the group matching `currentChord.family` holds meaningful values; the others are inert.
- `currentVoiceLeadingAnalysis` is the only variable in this file that is written by a non-trivial engine function (`analyseChord` in `voiceLeading.js`). All other variables are assigned by mode files or reset helpers.

**Dependencies:** none — pure declarations.

**Consumed by:** All engine, breakdown, UI, and mode files.

---

### ✅ js/engine/defaults.js

**Role:** Initialises the four selection-state `Set` constants that define which items are active in the quiz pool at startup. These are the only state variables that cannot live in `state.js` because they depend on data constants (`INTERVALS`, `PROGRESSIONS`) that are not available until the data layer has loaded.

**Size:** 4 declarations.

**Exports:**

| Constant | Type | Default contents | Rule |
|---|---|---|---|
| `selectedChords` | `Set<string>` | `maj`, `Maj7`, `m`, `m7`, `7`, `dim`, `m7b5`, `o7`, `aug`, `sus2`, `sus4`, `power` | Hard-coded: Basic mode chord symbols |
| `selectedIntervals` | `Set<string>` | All non-compound intervals from `INTERVALS` | Derived: `INTERVALS.filter(i => !i.compound)` |
| `selectedScales` | `Set<string>` | `pent_maj`, `pent_min`, `major`, `nat_minor` | Hard-coded: Basic mode scale symbols |
| `selectedProgressions` | `Set<string>` | All entries where `p.basic === true` | Derived: `PROGRESSIONS.filter(p => p.basic)` |

**Design note — why this file exists:** `state.js` declares all shared mutable variables using `var` (no data dependencies). `defaults.js` is a thin second initialisation step that runs immediately after the data layer, populating the four pool-selection Sets from the data constants. Keeping them separate preserves the clean boundary: `state.js` has zero dependencies; `defaults.js` has exactly two (`INTERVALS` from `intervals.js`, `PROGRESSIONS` from `progressions.js`).

**Design note — hard-coded vs derived defaults:** `selectedChords` and `selectedScales` are hard-coded symbol lists because the Basic set is a curated editorial choice, not a mechanical filter (not every chord or scale flagged `basic` in the data is necessarily in the default pool). `selectedIntervals` and `selectedProgressions` are derived via `.filter()` because their Basic sets are defined exhaustively by the `compound` and `basic` flags in the data, so deriving them is both correct and self-maintaining as the data grows.

**Load order constraints:**
- Must load after: `intervals.js`, `progressions.js` (needs `INTERVALS`, `PROGRESSIONS`)
- Must load before: any file that reads `selectedChords`, `selectedIntervals`, `selectedScales`, or `selectedProgressions`

**Dependencies:** `intervals.js` (`INTERVALS`), `progressions.js` (`PROGRESSIONS`).

**Consumed by:** `pool.js`, `chords-mode.js`, `intervals-mode.js`, `scales-mode.js`, `progressions-mode.js`.

---

### ✅ js/engine/helpers.js

**Role:** Pure utility functions and pool-building logic shared across all mode files. Contains no rendering logic beyond `renderStats()` (which writes to `#statsBody`) and `updateRootBadge()`. Also declares two per-question resolved-state variables that sit outside `state.js` for proximity reasons (see design note below).

**Size:** ~190 lines across 5 logical sections.

**Functions — 15 total:**

| Function | Signature | Description |
|---|---|---|
| `resetSession()` | `() → void` | Full session reset: zeroes counters, clears `sessionStats`, resets all chord sub-state variables (slash, poly, UST), clears all UI panels, then calls `generateQuestion()`. |
| `pickRandom(arr)` | `(Array) → any` | Returns a uniformly random element from an array. |
| `midiToSoundFontName(midi)` | `(number) → string` | Converts a MIDI note number to a soundfont filename string (e.g. `60` → `'C4'`). Uses `NOTE_NAMES` from `spelling.js`. |
| `applyInversion(baseIntervals, rootMidi, invIndex)` | `(number[], number, number) → number[]` | Builds the MIDI note array for a chord inversion. Rotates notes upward one octave per inversion step: the lowest note is shifted to the top `invIndex` times. |
| `buildInversionPool(basePool)` | `(Object[]) → Object[]` | Generates inversion entries for every chord in `basePool`. Each entry adds `name`, `symbol` (e.g. `'maj_inv1'`), `baseSymbol`, `baseChord`, and `invIndex`. Returns only inversions (index 1+); root position is already in the base pool. |
| `getAllChords()` | `() → Object[]` | Returns a flat array of every chord descriptor across all 12 families from `CHORD_TYPES`. The canonical full chord list. |
| `getActivePool()` | `() → Object[]` | Builds the active chord quiz pool from `selectedChords`. Appends inversion entries via `buildInversionPool()` when `includeInversions` is true, excluding families that do not support inversions (slash, poly, UST, classical, quartal, cluster). Falls back to one chord per basic family if `selectedChords` is empty. |
| `getActiveIntervalPool()` | `() → Object[]` | Filters `INTERVALS` to those in `selectedIntervals`. Falls back to the full `INTERVALS` array if the selection is empty. |
| `getActiveScalePool()` | `() → Object[]` | Filters `SCALES` to those in `selectedScales`. Falls back to `[SCALES[0]]` if the selection is empty. |
| `resolveOctaveBand(band, loDefault, hiDefault)` | `(string\|null, number, number) → [number, number]` | Maps `pinnedOctave` string values (`'low'`/`'mid'`/`'high'`) to `[lo, hi]` octave pairs. Returns `[loDefault, hiDefault]` when `band` is null. |
| `chooseRootMidi(chord)` | `(Object) → number` | Smart root picker for chord questions. Computes the safe octave range for the chord's interval span (keeping all notes within MIDI 28–96), applies the user's `pinnedRoot` and `pinnedOctave` constraints, clamps and guards against degenerate ranges, then returns a random MIDI root. Handles inverted chords by reading from `baseChord.intervals`. |
| `chooseSimpleRootMidi(semitoneRange)` | `(number) → number` | Simpler root picker for intervals and scales. Applies `pinnedRoot` and `pinnedOctave`, clamps the upper bound so the top note stays below MIDI 97, and returns a random MIDI root. |
| `recordAnswer(symbol, name, isCorrect)` | `(string, string, boolean) → void` | Writes one answer event into `sessionStats` (creating the entry if absent), then calls `renderStats()`. |
| `renderStats()` | `() → void` | Re-renders the `#statsBody` table from `sessionStats`, sorted worst-accuracy-first. Each row shows name, correct count, total attempts, percentage, and a visual bar. |
| `updateRootBadge(rootName)` | `(string) → void` | Shows or hides the `#rootBadge` element based on the `showRoot` flag and whether a `rootName` was provided. Called after each new question is generated. |

**Constants:**

| Constant | Type | Value | Description |
|---|---|---|---|
| `INV_LABELS` | `string[]` | `['', '1st inv', '2nd inv', '3rd inv', '4th inv']` | Human-readable inversion labels. Index 0 is empty (root position is not labelled). |

**Per-question resolved state (declared here, not in state.js):**

| Variable | Type | Default | Description |
|---|---|---|---|
| `currentVoicingMode` | `string` | `'close'` | The resolved voicing symbol for the current question. Set by `generateChordQuestion()` and `dictLoadSymbol()`. |
| `currentChordPlayStyle` | `string` | `'block'` | The resolved playback style for the current chord question. Set at play time; read by `showNotation()`. |

**Design note — two variables declared here instead of state.js:** `currentVoicingMode` and `currentChordPlayStyle` are per-question resolved values (parallel to `currentIntervalStyle` and `currentScaleDir` in `state.js`). They live here rather than in `state.js` because they are set and consumed entirely within the chord question flow, and proximity to `getActivePool()` and the voicing comment block makes their context clear. This is a minor pragmatic exception to the `state.js` centralisation rule, noted here for clarity.

**Design note — inversion exclusions:** `getActivePool()` excludes slash, poly, UST, classical, quartal, and cluster families from inversion generation. Slash and poly chords have their own structural bass-note logic that is incompatible with the rotation-based inversion model. UST voicings are rootless by design. Classical, quartal, and cluster chords have fixed voicings where inversion would distort their identity.

**Design note — fallback safety:** Both `getActivePool()` and `getActiveScalePool()` include non-empty fallbacks so the app never crashes if the user deselects everything. `getActiveIntervalPool()` falls back to the full interval list rather than a single item to preserve meaningful quiz variety.

**Dependencies:** `spelling.js` (`NOTE_NAMES`), `chords.js` (`CHORD_TYPES`), `intervals.js` (`INTERVALS`), `scales.js` (`SCALES`), `state.js` (all session and chord state variables), `defaults.js` (`selectedChords`, `selectedIntervals`, `selectedScales`).

**Consumed by:** `audio.js`, `notation.js`, `chords-mode.js`, `intervals-mode.js`, `scales-mode.js`, `progressions-mode.js`, `app.js`.

---

### ✅ js/engine/audio.js

**Role:** All Web Audio API interaction and soundfont playback. Owns the AudioContext lifecycle, instrument loading, play-state UI feedback, and every mode's playback function. Contains no music theory logic — it consumes MIDI note arrays produced by mode files and plays them.

**Size:** ~210 lines across 10 functions.

**⚠️ Production blocker — soundfont source:** `initAudio()` currently loads via the `MusyngKite` soundfont from the soundfont-player CDN. Before v1.0.0 build, this must be updated to point at the self-hosted path per §4.3 of the production plan. See the `nameToUrl` pattern documented there.

**Functions — 10 total:**

| Function | Signature | Description |
|---|---|---|
| `initAudio()` | `() → void` | Creates the `AudioContext` (with webkit fallback), then races `Soundfont.instrument()` against a 12-second timeout. On success: assigns `piano`, re-enables `#playBtn`, sets hint text. On timeout/failure: shows an error message in `#chordHint`. |
| `setPlayingState(on)` | `(boolean) → void` | Toggles the `playing` CSS class on `#playBtn` and swaps its icon between ▶ (idle) and ♩ (playing). Called at the start and end of every playback function. |
| `playMidiNotes(midiNotes, style)` | `(number[], string) → void` | General-purpose MIDI playback. Handles three styles: `'harmonic'` (all notes simultaneously), `'ascending'` (low to high, 0.55s gap), `'descending'` (high to low, 0.55s gap). Used by `playInterval()`. |
| `resolveChordStyle()` | `() → string` | Resolves `chordPlayStyle` to a concrete value. If `'random'`, picks uniformly from `['block', 'ascending', 'descending', 'broken']`. Otherwise returns `chordPlayStyle` unchanged. |
| `playChord()` | `() → void` | Plays the current chord. Calls `resolveChordStyle()` and stores the result in `currentChordPlayStyle` so `showNotation()` can mirror it. Merges `currentSlashBassMidi` into the note set for slash chords before sorting. Implements four styles: `block` (simultaneous, 2.4s), `ascending` (0.18s gap), `descending` (0.18s gap), `broken` (root–top–2nd–top pattern, 0.28s gap). |
| `resolveIntervalStyle()` | `() → string` | Resolves `intervalStyle` to a concrete value. If `'random'`, picks from `['harmonic', 'ascending', 'descending']`. |
| `resolveScaleDir()` | `() → string` | Resolves `scaleDirection` to a concrete value. If `'random'`, picks from `['asc', 'desc', 'both']`. |
| `playInterval()` | `() → void` | Resolves and stores `currentIntervalStyle`, then delegates to `playMidiNotes()` with `currentIntervalMidi`. |
| `playScale()` | `() → void` | Resolves and stores `currentScaleDir`. Builds ascending and descending note sequences from `currentScale.intervals`. If already answered, calls `showNotation()` to sync the notation display before playing. `'both'` shares the top note (descending starts from `descNotes[1]` to avoid repeating the octave). Note gap: 0.38s. |
| `playSlowly()` | `() → void` | Mode-aware slow playback dispatcher. Delegates to `playProgressionSlowly()` for progressions. For each other mode uses the stored resolved style/direction (not re-resolving random) so slow replay matches what was originally heard. Specific behaviours: scales at 0.76s gap (double normal); intervals at 1.1s gap (harmonic stays simultaneous); chords always ascending arpeggio at 0.5s gap regardless of original style; resolution view plays source → 0.5s pause → target, both as slow arpeggios. |

**Key design patterns:**

- **Resolve-then-store:** `resolveChordStyle()`, `resolveIntervalStyle()`, and `resolveScaleDir()` are called at play time (not question-generation time) and their results written to `currentChordPlayStyle`, `currentIntervalStyle`, and `currentScaleDir`. This means the breakdown and notation always reflect what was actually heard, not what the user's chip setting says.
- **Slow playback uses stored state:** `playSlowly()` reads `currentIntervalStyle`, `currentScaleDir`, and `currentChordPlayStyle` — the resolved values — rather than re-resolving. This guarantees slow replay is always the same direction/style as the original.
- **Slash chord bass merge:** Both `playChord()` and `playSlowly()` prepend `currentSlashBassMidi` to the note set for slash chords before sorting. Poly and UST notes are already fully assembled in `currentMidiNotes` by their question generators and need no merging.
- **AudioContext resume:** Every playback function checks `audioCtx.state === 'suspended'` and resumes before scheduling notes. Required by browsers that suspend the context after inactivity or before a user gesture.
- **play-state cleanup via setTimeout:** The playing state is cleared after a calculated duration rather than via an audio event. The duration is computed from note count × gap + a tail buffer to account for note release.

**Dependencies:** `helpers.js` (`midiToSoundFontName`, `currentChordPlayStyle`), `state.js` (`piano`, `audioCtx`, `currentMode`, `currentChord`, `currentMidiNotes`, `currentSlashBassMidi`, `currentIntervalMidi`, `currentIntervalStyle`, `intervalStyle`, `currentScale`, `currentScaleRootMidi`, `currentScaleDir`, `scaleDirection`, `chordPlayStyle`, `answered`), `voiceLeading.js` (`getResolutionInfo`, `getSourceMidi`, `resolutionActive`), `notation.js` (`showNotation`), `progressions-mode.js` (`playProgressionSlowly`).

**Consumed by:** `chords-mode.js`, `intervals-mode.js`, `scales-mode.js`, `progressions-mode.js`, `app.js`.

---

### ✅ js/engine/notation.js

**Role:** VexFlow-based notation renderer for all app modes. Handles enharmonic spelling, key signature accidental filtering, automatic grand staff layout, sequential (scale) and block (chord/interval) rendering, polychord rendering, and label generation for all chord families (slash, poly, UST, inversion). Contains no music theory logic — it consumes MIDI note arrays and state variables produced by mode files and renders them.

**Size:** ~350 lines across 13 functions (4 top-level, 9 inner).

**Functions — 4 top-level:**

| Function | Signature | Description |
|---|---|---|
| `midiToVexKeyExact(midi)` | `(number) → string` | Converts a MIDI note number to a VexFlow key string using a fixed chromatic (always-sharps) mapping. No enharmonic awareness. Used for simple single-note cases where spelling context is unavailable. |
| `addAccidentals(staveNote, keys, VF)` | `(VF.StaveNote, string[], object) → void` | Adds VexFlow accidental modifiers to a StaveNote for every key that carries an accidental. Does not filter for key signature coverage — use `addAccidentalsFiltered` when a key signature is active. |
| `renderNotation(midiNotes, sequential, symbol, rootPc, keySigStr)` | `(number[], boolean, string, number, string\|null) → void` | Main notation renderer. `sequential=false` renders a stacked whole-note block chord (chords, intervals); `sequential=true` renders quarter notes in order with bar lines and rest padding (scales). Auto-selects treble, bass, or grand staff based on note range. When `keySigStr` is supplied, draws the key signature and filters accidentals via `addAccidentalsFiltered`. Contains two inner functions: `spellMidi()` and `addAccidentalsFiltered()`. |
| `renderPolyNotation(keySigStr)` | `(string\|null) → void` | Dedicated polychord renderer. Always forces a grand staff (upper triad → treble, lower triad → bass). Each triad is spelled independently using its own root and symbol via `spellMidiRelative()`. Necessary because a single-root renderer cannot handle the dual spelling contexts of a polychord. Contains two inner functions: `spellMidiRelative()` and `addAccidentalsFiltered()`. |
| `showNotation()` | `() → void` | Entry point for all notation display. Dispatches to the correct rendering path based on `currentMode` and `currentChord.family`: intervals, scales, polychords, UST, slash chords, and standard chords (including inversions). Manages key signature chip row visibility and active state. Mirrors `currentChordPlayStyle` in notation for ascending, descending, broken, and block playback. Triggers `renderInversionChips()` for standard chords after answering. Calls `showBreakdown()` at the end. |

**Label helpers — 5 total:**

| Function | Signature | Description |
|---|---|---|
| `getSlashChordRootLabel()` | `() → string` | Returns the spelled root name of the upper chord in a slash chord (not the bass note). Used as the root badge label. |
| `getSlashResolvedName()` | `() → string` | Builds the full slash chord name for the current question, e.g. `'Bm/C'`. Computed per-question because the type is root-agnostic in the data layer. |
| `polyQualitySuffix(sym)` | `(string) → string` | Maps a polychord triad symbol to its short suffix (`''`, `'m'`, `'aug'`, `'7'`). |
| `getPolyChordLabel()` | `() → string` | Builds the polychord display label, e.g. `'E / Am'`, `'Eaug / A'`. |
| `getUSTLabel()` | `() → string` | Builds the UST display label adapted to the shell quality, e.g. `'UST ♭II over G7 → G7(♭9)(♯11)(♭13)'`. |
| `getChordRootName()` | `() → string` | Derives the harmonic root name for the current chord, adapted to family: slash (upper root), poly (upper triad root), UST (shell root), inversion (reconstructed from bass interval), standard (from `currentChordRootMidi`). |

**Key design patterns:**

- **Three-case accidental filtering (`addAccidentalsFiltered`):** When a key signature is active, every note falls into one of three cases: (1) letter conflicts with key sig → draw cancellation accidental (♮ for naturals); (2) letter and accidental match key sig → skip, VexFlow renders the key sig glyph, unless `forcedAcc` is set; (3) not covered by key sig → draw the note's own accidental normally. This logic is duplicated inside both `renderNotation` and `renderPolyNotation` because each has its own `coveredLetters` closure.
- **`forcedAcc` flag:** Set by `spellMidi()` / `spellMidiRelative()` when a double accidental (e.g. E𝄫) is simplified to a single accidental on the same letter (E♭). In this case the key sig covers the letter but not the degree of deviation, so an explicit accidental must be forced even though the letter appears in the key sig.
- **Grand staff split at MIDI 55 / 60:** Staff selection uses MIDI 55 (G3) as the boundary for treble/bass need. Block chord notes are distributed between staves at MIDI 60 (middle C) — notes below 60 go to bass, at or above go to treble.
- **Sequential layout math:** Canvas width scales with note count (`barCount × 4 × 46px`) plus `headerPx` (clef ~30px + time sig ~20px + 14px per key sig accidental). The Formatter budget subtracts `headerPx` so notes are distributed only across the note-bearing portion of the stave.
- **Polychord renderer is separate:** `renderPolyNotation` cannot share `renderNotation`'s spelling context because each triad requires its own `rootPc` and `symbol`. The dedicated renderer receives both triads' MIDI arrays, roots, and symbols from module-level state variables and spells each independently.
- **Notation mirrors playback:** `showNotation()` reads `currentChordPlayStyle` (the resolved value stored at play time by `audio.js`) to render sequential notation for ascending/descending/broken styles, ensuring the visual matches exactly what the user heard.

**Dependencies:** `VexFlow` (vendor), `spelling.js` (`spelledNote`, `midiToVexKeySpelled`, `respellForKeySig`, `isCoveredByKeySig`, `vexAccidental`, `spelledRoot`), `keysig.js` (`keySigCoveredLetters`, `keySigAccidentalCount`), `helpers.js` (`pcInterval`, `tritoneLabel`, `getBestFitKeyStr`, `getChordKeyStr`, `getIntervalKeyStr`, `getScaleParentKeyStr`), `state.js` (all current-question state variables), `breakdown.js` (`showBreakdown`), `chords-mode.js` (`renderInversionChips`).

**Consumed by:** `audio.js` (`showNotation` called from `playScale()`), `chords-mode.js`, `intervals-mode.js`, `scales-mode.js`, `progressions-mode.js`.

---

### js/engine/voicings.js
[ ] — pending production pass

---

### js/engine/voiceLeading.js
[ ] — pending production pass

---

### js/breakdown/breakdown.js
[ ] — pending production pass

---

### js/breakdown/breakdown-intervals.js
[ ] — pending production pass

---

### js/breakdown/breakdown-chords.js
[ ] — pending production pass

---

### js/breakdown/breakdown-scales.js
[ ] — pending production pass

---

### js/breakdown/breakdown-progressions.js
[ ] — pending production pass

---

### js/ui/stats.js
[ ] — pending production pass

---

### js/ui/controls.js
[ ] — pending production pass

---

### js/ui/pool.js
[ ] — pending production pass

---

### js/modes/chords-mode.js
[ ] — pending production pass

---

### js/modes/intervals-mode.js
[ ] — pending production pass

---

### js/modes/scales-mode.js
[ ] — pending production pass

---

### js/modes/progressions-mode.js
[ ] — pending production pass

---

### js/modes/help-mode.js
[ ] — pending production pass

---

### js/modes/about-mode.js
[ ] — pending production pass

---

### js/app.js
[ ] — pending production pass
