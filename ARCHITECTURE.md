# The Sound Travels Ear Training — Architecture

> **Working reference document — production pass only. Delete after v1.0.0.**  
> Sections are filled in file by file as the production pass progresses.  
> Last updated: js/modes/chords-mode.js ✅

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
│   │   ├── voicings.js                ✅ production pass complete
│   │   └── voiceLeading.js            ✅ production pass complete
│   ├── breakdown/
│   │   ├── breakdown.js               ✅ production pass complete
│   │   ├── breakdown-intervals.js     ✅ production pass complete
│   │   ├── breakdown-chords.js        ✅ production pass complete
│   │   ├── breakdown-scales.js        ✅ production pass complete
│   │   └── breakdown-progressions.js  ✅ production pass complete
│   ├── ui/
│   │   ├── stats.js                   ✅ production pass complete
│   │   ├── controls.js                ✅ production pass complete
│   │   ├── pool.js                    ✅ production pass complete
│   │   ├── pool-chords.js             ✅ production pass complete
│   │   ├── pool-intervals.js          ✅ production pass complete
│   │   ├── pool-scales.js             ✅ production pass complete
│   │   └── pool-progressions.js       ✅ production pass complete
│   ├── modes/
│   │   ├── chords-mode.js             ✅ production pass complete
│   │   ├── intervals-mode.js          [ ] pending
│   │   ├── scales-mode.js             [ ] pending
│   │   ├── progressions-mode.js       ✅ production pass complete
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
Layer 5 — UI            stats, controls, pool, pool-chords, pool-intervals, pool-scales, pool-progressions
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
stats.js → controls.js → pool.js → pool-chords.js → pool-intervals.js → pool-scales.js → pool-progressions.js
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

### ✅ js/engine/voicings.js

**Role:** Voicing system for Chords mode. Owns the complete voicing data table (`VOICING_MODES`, 62 voicings across 6 groups) and all voicing transformation algorithms. `applyVoicing()` is the single entry point that transforms a chord's root and base intervals into a concrete MIDI note array for a given voicing style. `resolveVoicingMode()` picks one concrete mode per question from the user's selection or active setting.

**Size:** ~1,130 lines across 10 functions (6 internal helpers, 1 main dispatcher, 1 resolver, 2 constants).

**Public functions:**

| Function | Signature | Description |
|---|---|---|
| `applyVoicing(rootMidi, baseIntervals, mode)` | `(number, number[], string) → number[]` | Main dispatcher. Routes to the correct voicing algorithm for the given mode symbol and returns a sorted MIDI note array. Every voicing mode in `VOICING_MODES` has a corresponding case. Falls back to `'close'` on any error or unrecognised mode. Called recursively by some cases that fall back to simpler modes (e.g. shell voicings fall back to `'close'` for triads with no 7th). |
| `resolveVoicingMode()` | `() → string` | Picks one concrete voicing symbol for the current question. In quiz mode: picks randomly from `selectedVoicings`, filtering out `'random'` and (in Basic mode) any advanced symbols. In dictionary mode with `activeVoicingMode === 'random'`: picks randomly from all concrete symbols scoped to difficulty. In dictionary mode with a concrete `activeVoicingMode`: returns it directly. Never returns `'random'`. |

**Internal helpers:**

| Function | Signature | Description |
|---|---|---|
| `_voicingRoles(baseIntervals)` | `(number[]) → string[]` | Classifies each interval by harmonic role (`'root'`, `'third'`, `'fifth'`, `'altfifth'`, `'seventh'`, `'extension'`). Used throughout `applyVoicing()` to select notes by function rather than raw semitone value. |
| `_notesByRole(rootMidi, baseIntervals, roles)` | `(number, number[], string[]) → number[]` | Extracts MIDI notes matching specific harmonic roles from a chord's base intervals. |
| `_pc(midi, rootMidi)` | `(number, number) → number` | Returns the pitch class of a MIDI note as a semitone interval from root (0–11). |
| `_clampToRange(midi, loMidi, hiMidi)` | `(number, number, number) → number` | Clamps a MIDI note into a target range by transposing by octaves. |
| `_noteFromInterval(rootMidi, semitones, targetLoMidi)` | `(number, number, number) → number` | Builds a MIDI note from a semitone offset, clamped to a 2-octave window from `targetLoMidi`. |
| `_stackFourths(startMidi, n)` | `(number, number) → number[]` | Builds `n` notes stacked in perfect fourths from a starting MIDI note. Used by `quartal` and `mccoy_tyner` voicings. |
| `_stackFifths(startMidi, n)` | `(number, number) → number[]` | Builds `n` notes stacked in perfect fifths. Used by `quintal` voicing. |

**Key design patterns:**

- **62 voicings across 6 groups:** Group 1 Position (3), Group 2 Doubling (4), Group 3 Shell/Rootless (27), Group 4 Drop (4), Group 5 Intervallic (7), Group 6 Style (17). All symbols are in `VOICING_MODES`; `CONCRETE_VOICING_SYMBOLS` is derived from it at startup.
- **Role-based note selection:** `_voicingRoles()` maps semitone intervals to functional labels so algorithms like `shell`, `drop2`, and `evans_a` work correctly across all chord qualities without hard-coding interval numbers.
- **Intervallic voicing design (Group 5):** Notes are stacked freely — non-chord tones are intentional; the ambiguity is the sound. Note count: triads → 4 notes; all other chords → 5 notes. Bass clamped to MIDI 36–59; all notes clamped within 2 octaves above bass. `cluster_modal` removed (not distinct from `cluster_diaton` per Persichetti). `secundal` = diatonic-step stacking (m2/M2 mix); `cluster_wt` = pure whole-tone stacking (always M2).
- **Basic mode scoping:** `resolveVoicingMode()` restricts the pool to position and doubling groups (Groups 1–2) when `appDifficulty === 'basic'`. Advanced voicings (shell, drop, intervallic, style) are only available in Advanced mode.
- **Graceful fallback:** `applyVoicing()` wraps all cases in try/catch and returns a close-position array on any error. Individual cases fall back to `'close'` when the chord lacks a required tone (e.g. no 7th for shell voicings on triads).

**Dependencies:** `state.js` (`appMode`, `appDifficulty`, `selectedVoicings`, `activeVoicingMode`), `helpers.js` (implicit globals).

**Consumed by:** `helpers.js` (`recomputeCurrentNotes`), `app.js` (`recomputeCurrentNotes`).

---

### ✅ js/engine/voiceLeading.js

**Role:** Voice leading and harmonic resolution engine (Point 37, Option B). Given any chord, discovers every diatonic context it fits across all 46 scales × 12 roots, scores harmonic tension per context, derives resolution targets (resolutions, departures, substitutions), and computes globally optimal voice leading to each target via backtracking search. All functions are pure and stateless — no DOM access, no app state mutations.

**Size:** ~919 lines across 14 functions plus 2 startup constants.

**Public API:**

| Function | Signature | Description |
|---|---|---|
| `analyseChord(chordRootPc, chordPitchClasses, chordIntervals, sourceMidi, chordFamily)` | `(number, number[]|Set, number[], number[], string) → { contexts, isAmbiguous }` | Main entry point. Runs the full five-stage pipeline and returns all diatonic contexts, each enriched with pre-computed resolution targets and voice leading moves. Substitutions carry no voice leading. Families in `AMBIGUOUS_FAMILIES` (aug, suspended, poly, UST) return `isAmbiguous: true` and fall back to existing app logic. |

**Pipeline functions:**

| Function | Signature | Description |
|---|---|---|
| `findDiatonicContexts(chordRootPc, chordPitchClasses, chordIntervals)` | `(number, Iterable, number[]) → Object[]` | Step 3. Tests all 552 scale/root combinations. Pass 1: exact match (all chord PCs in scale). Pass 2: fuzzy match for altered dominants (core tones only: root + M3 + m7). Sorts results by musical relevance: dominant function → diatonic group → match quality → scale commonality → tension. |
| `scoreTension(degSemitones, chordPcs, chordRootPc)` | `(number, Set, number) → number` | Step 4. Combines `BASE_TENSION` for the scale degree with modifiers for tritone presence (+0.08) and chromatic alterations (+0.04 each). Capped at 1.0. |
| `deriveResolutionTargets(context, chordRootPc)` | `(Object, number) → { resolutions, departures, substitutions }` | Step 5. Returns harmonic motion targets per function: tonic → departures (I→IV/V/ii/vi); dominant → resolutions (V→I/i/vi) + substitutions (tritone sub, related ii); subdominant → resolutions (IV→V/I); predominant → resolutions (ii→V/I). |
| `computeVoiceLeadingRules(sourceMidi, targetRootPc, targetSymbol, context)` | `(number[], number, string, Object) → Object[]` | Step 6 orchestrator. Runs: `resolveTargetIntervals` → `generateCandidates` → `assignByMinCost` → `repairVoiceCrossing` → `buildMoves`. |

**Voice leading sub-functions:**

| Function | Signature | Description |
|---|---|---|
| `resolveTargetIntervals(targetSymbol)` | `(string) → number[]` | Looks up pitch-class intervals for a `CHORD_TYPES` symbol from `CHORD_SYMBOL_INTERVALS`. Falls back to `[0,4,7]` for unknown symbols. |
| `generateCandidates(targetRootPc, targetIntervals, sourceMidi)` | `(number, number[], number[]) → Object[]` | Enumerates every reachable MIDI note for each target PC within ±12 semitones of the source range, guaranteeing the nearest instance of every target PC is available to every voice. |
| `moveCost(delta, isBass)` | `(number, boolean) → number` | Cost function: common tones = 0; steps/thirds = distance; leaps = distance + `LEAP_PENALTY` (8). Bass leap penalty halved to allow natural bass motion by 4th/5th. |
| `assignByMinCost(sourceMidi, candidates)` | `(number[], Object[]) → Object[]` | Globally optimal assignment via backtracking search with branch pruning. No two voices share the same MIDI note. For N ≤ 7 voices, exhaustive search with pruning is trivially fast. |
| `repairVoiceCrossing(assignments)` | `(Object[]) → Object[]` | Post-processing: swaps adjacent voice pairs when a crossing exists and the swap strictly reduces total cost. Uses strict `<` to guarantee convergence with no cycling risk. |
| `buildMoves(assignments)` | `(Object[]) → Object[]` | Converts assignments to UI move objects: `{ fromMidi, toMidi, fromPc, toPc, semitones, direction, reason }`. |

**Key design patterns:**

- **Cost function as theory:** The voice leading rules (leading tone rises, seventh falls) emerge from the cost function — not from named-note detection. Those moves have cost 1, the minimum possible for a non-common-tone. No note names are detected anywhere in the voice leading computation.
- **Fuzzy match for altered dominants:** Chords like `7(♭9)(♯11)(♭13)` have no exact scale match because their extensions are chromatic by design. The fuzzy pass matches on root + M3 + m7 only, then filters to dominant-function contexts, correctly finding the V → I resolution.
- **`CHORD_SYMBOL_INTERVALS` startup index:** Built once from `CHORD_TYPES` at load time — auto-updates when new chord entries are added, no manual maintenance.
- **Five-sort context ranking:** Dominant-quality chords always surface their V context first, regardless of how many other exotic scale contexts also contain the chord tones.
- **Substitutions excluded from voice leading:** Tritone sub and related ii are reharmonisation alternatives, not resolution targets. They appear in `ctx.substitutions` with no `voiceLeading` property.

**Dependencies:** `chords.js` (`CHORD_TYPES`), `scales.js` (`SCALES`), `breakdown.js` (`semitoneToDegree`).

**Consumed by:** `breakdown.js` (`_buildVoiceLeadingAnalysis`), `breakdown-chords.js`.

---

### ✅ js/breakdown/breakdown.js

**Role:** Shared foundation for the post-answer breakdown panel. Provides all lookup tables, pure theory helpers, reusable DOM builders, chord-scales analysis, resolution state and playback, and the main `showBreakdown()` / `hideBreakdown()` dispatcher. All per-mode rendering is delegated to the four sibling files.

**Size:** ~875 lines across 14 functions plus 4 constants and 3 state variables.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `SEMITONE_TO_NUMERAL` | `Object.<number,string>` | Semitone offset → Roman numeral string. Covers simple (0–11) and compound (12–21) intervals. |
| `SEMITONE_TO_ROMAN` | `Object.<number,{roman,prefix}>` | Semitone → qualified Roman numeral descriptor used by `semitoneToDegree()`. |
| `INTERVAL_ABBR` | `Object.<number,string>` | Semitone count → interval abbreviation (e.g. `'M3'`, `'P5'`). Covers simple and compound intervals. |
| `SCALE_REF` | `Array<Object>` | Reference list of all scales built once from `SCALES` at load time. Each entry: `{ name, symbol, pcs: Set, tag, note }`. |
| `resolutionActive` | `boolean` | Whether the resolution view is currently active. |
| `resolutionRootMidi` | `number\|null` | MIDI root of the resolution target; stored once at answer time. |
| `selectedResolution` | `Object\|null` | User-selected resolution card; `null` = use default. |
| `semitonesToNumeral(semitones, symbol)` | `(number, string?) → string` | Context-aware semitone → Roman numeral lookup; resolves tritone / A5 / d7 ambiguity via symbol-keyed exception sets. |
| `semitoneToDegree(semi, quality)` | `(number, string) → string` | Qualified Roman numeral for a semitone interval; case-folded by chord quality. Consumed by `voiceLeading.js`. |
| `ordinal(n)` | `(number) → string` | Returns ordinal string (`'1st'`, `'2nd'`, …). Used for inversion labels. |
| `intervalAbbr(semitones, symbol)` | `(number, string?) → string` | Context-aware interval abbreviation; overrides for d5 / A5 / d7 spellings. |
| `makePill(label, value)` | `(string\|null, string) → HTMLElement` | Builds a `div.breakdown-pill` element. |
| `makeBDRow(panel, label, content)` | `(HTMLElement, string, string) → void` | Appends a `breakdown-row` key–value row to a panel. |
| `makeCSGroup(label, open)` | `(string, boolean?) → {section, body}` | Builds a collapsible `cs-section` group; returns `{ section, body }`. |
| `makeNameHeader(panel, labelEl_or_text)` | `(HTMLElement, string\|HTMLElement) → {body}` | Builds and appends a Level-1 collapsible name header; returns `{ body }`. |
| `joinSep(arr)` | `(string[]) → string` | Joins HTML strings with `span.breakdown-sep` en-dash separators. |
| `isMobile()` | `() → boolean` | Returns `true` when viewport ≤ 600 px. |
| `getChordScales(rootPc, chordPcs)` | `(number, Set) → Array` | Returns all `SCALE_REF` entries whose pitch classes contain every chord pitch class. |
| `makeChordScalesRow(panel, rootPc, chordPcs)` | `(HTMLElement, number, Iterable) → void` | Renders a collapsible Chord Scales sub-section. Full-width stack on mobile; `breakdown-row` layout on desktop. Each scale row navigates to Dictionary mode on click. |
| `playResolution()` | `() → void` | Toggles chord / resolution view. On first entry into resolution view: stores root, plays audio (source → pause → target). |
| `getSourceMidi()` | `() → number[]` | Returns source MIDI notes for the current chord, handling all family types. |
| `updateResolveBtn()` | `() → void` | Syncs the Resolve button label with `resolutionActive`. |
| `showCurrentView()` | `() → void` | Dispatches to `renderResolutionNotation()` or `showNotation()` based on `resolutionActive`. |
| `renderResolutionNotation()` | `() → void` | Renders source → resolution two-chord grand-staff layout into `#notation-svg`. Fully stateless — re-derived from app state on every call. Honours `chordKeySigMode`. |
| `qualityFullName(sym)` | `(string) → string` | Maps a chord symbol to its full English quality name; falls back to the symbol itself. |
| `showBreakdown()` | `() → void` | Main dispatcher: lazily builds voice leading analysis, clears panel, delegates to per-mode renderer. |
| `hideBreakdown()` | `() → void` | Hides and clears the breakdown panel and wrapper. |

**Key design patterns:**

- **Dispatcher pattern:** `showBreakdown()` is the single entry point; it reads `currentMode` and delegates to one of four sibling renderers. No mode logic lives here.
- **Mobile / desktop split:** `isMobile()` gates two completely separate DOM structures in `makeChordScalesRow()` and `makeVoiceLeadingRow()` (the latter in `breakdown-chords.js`). Desktop layout is untouched by the mobile path.
- **Lazy voice leading:** `currentVoiceLeadingAnalysis` is built on first `showBreakdown()` call, not at answer time — avoids paying the analysis cost unless the panel is opened.
- **Stateless resolution render:** `renderResolutionNotation()` accepts no arguments; all inputs are re-read from global state on every call so voicing changes are always reflected without cache invalidation.

**Dependencies:** `voiceLeading.js` (`analyseChord` via `_buildVoiceLeadingAnalysis`), `helpers.js` (`spelledRoot`, `spelledNote`, `midiToSoundFontName`, `midiToVexKeySpelled`, etc.), `state.js`, `notation.js` (VexFlow globals), `audio.js` (`piano`, `audioCtx`).

**Consumed by:** `breakdown-intervals.js`, `breakdown-chords.js`, `breakdown-scales.js`, `breakdown-progressions.js` (all shared helpers); `app.js` (`showBreakdown`, `hideBreakdown`, `resolutionActive`, `selectedResolution`).

---

### ✅ js/breakdown/breakdown-intervals.js

**Role:** Intervals branch of the post-answer breakdown panel. Renders interval name, semitone count, scale degree numeral, consonance classification, inversion / simple-equivalent (compound intervals only), and common musical context. Enharmonically ambiguous intervals (semitones 6, 8, 9) receive context-aware overrides based on the active chord symbol.

**Size:** ~174 lines across 2 functions plus 4 constants.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `INTERVAL_CONSONANCE` | `Object.<number,string>` | Consonance classification keyed by semitone count (0–21). Compound intervals inherit their simple-interval quality. |
| `INTERVAL_CONTEXT` | `Object.<number,string>` | Common musical context string keyed by semitone count (1–21). Overridden at render time for enharmonic ambiguities. |
| `INTERVAL_INVERSION_SEMITONES` | `Object.<number,number>` | Maps a simple interval (1–12) to the semitone count of its complementary inversion (sums to P8). |
| `INTERVAL_INVERSION_NAME` | `Object.<number,string>` | Display name of the complementary inversion interval, keyed by source semitone count (1–12). |
| `tritoneLabel(style)` | `(string) → string` | Returns context-aware tritone label: `'A4'` (ascending), `'d5'` (descending), or `'A4 / d5'` (harmonic). |
| `showBreakdownIntervals(panel)` | `(HTMLElement) → void` | Renders the full intervals breakdown into the panel. Called by `showBreakdown()` in `breakdown.js`. |

**Key design patterns:**

- **Compound interval handling:** `currentInterval.compound` flag branches the inversion row — compound intervals show their simple equivalent instead of the standard inversion, using an inline name map.
- **Enharmonic context overrides:** After the base `INTERVAL_CONTEXT` lookup, three symbol-set checks (`TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`) replace the context string for correctly spelled augmented/diminished intervals.
- **Tritone label:** `tritoneLabel()` resolves the A4 / d5 ambiguity from playback style rather than from a chord symbol, since tritone is its own inversion.

**Dependencies:** `breakdown.js` (`makeNameHeader`, `makeBDRow`, `SEMITONE_TO_NUMERAL`), `helpers.js` (`spelledRoot`, `spelledNote`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`), `state.js` (`currentInterval`, `currentIntervalMidi`, `currentIntervalStyle`).

**Consumed by:** `breakdown.js` (`showBreakdown()` dispatcher).

---

### ✅ js/breakdown/breakdown-chords.js

**Role:** Chords branch of the post-answer breakdown panel. Handles all four chord families — polychords, UST, slash, and regular chords — and owns the complete voice leading and resolution rendering pipeline.

**Size:** ~1,624 lines across 15 functions plus 2 constants and 1 IIFE-style section.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `RESOLUTION_TARGETS` | `Object.<string, { offset, quality, label }>` | Fallback resolution table keyed by chord symbol. Used when `analyseChord()` has not run or returns no result. |
| `VL_INTERVAL_NAMES` | `Object.<number, string>` | Semitone count → interval name string for voice leading move labels (ascending). |
| `vlRoleLabel(semiFromRoot)` | `(number) → string` | Harmonic role label for a source note (e.g. `'root'`, `'3rd'`, `'♭7th'`). |
| `buildResolutionMidi(targetRootMidi, quality)` | `(number, string) → number[]` | Builds a close-position MIDI array for a resolution target chord. |
| `getResolutionInfo()` | `() → Object\|null` | Returns the resolution target for the current chord, consulting user selection, family-specific logic, Pass 1 engine, and `RESOLUTION_TARGETS` in priority order. |
| `computeVoiceLeading(sourceMidi, targetMidi)` | `(number[], number[]) → Array` | Computes voice leading moves from source to target; uses rule-based engine when available, proximity fallback otherwise. |
| `makeVoiceLeadingRow(panel)` | `(HTMLElement) → void` | Renders the Voice Leading sub-section. Full-width stack on mobile; `breakdown-row` layout on desktop. |
| `computeRiemannRelations(rootPc, quality, sym)` | `(number, string, string) → Object` | Computes parallel, relative, leading-tone, and subdominant relations for major/minor triads. |
| `computeTritoneSubInfo(rootPc, sym)` | `(number, string) → Object` | Returns tritone sub name, related ii name, and resolution tonic names for a dominant chord. |
| `computeDimEnharmonics(rootPc, sym)` | `(number, string) → string[]` | Returns the three enharmonic re-rootings of a dim7 chord. |
| `computeDimDomSubs(rootPc, sym)` | `(number, string) → string[]` | Returns the four dom7♭9 chords for which a dim7 can substitute. |
| `computeAugEnharmonics(rootPc, sym)` | `(number, string) → string[]` | Returns the two enharmonic re-rootings of an augmented triad. |
| `computeHalfDimContext(rootPc, sym)` | `(number, string) → Object` | Returns the minor key name and related V7 name for a half-diminished chord. |
| `computeSusResolution(rootPc, sym, chordSym)` | `(number, string, string) → string\|null` | Returns a resolution description string for sus2 and sus4 chords. |
| `makeRiemannRow(panel, relations)` | `(HTMLElement, Object) → void` | Renders the Neo-tonal / Riemannian relations sub-section. |
| `figuredBass(chord, invIndex)` | `(Object, number) → string` | Returns the figured bass string for a chord inversion. |
| `nameChordFromIntervals(rootPc, allPcs)` | `(number, Set) → string` | Names a chord from a set of pitch classes by matching against `CHORD_TYPES`. |
| `showBreakdownChords(panel)` | `(HTMLElement) → void` | Main renderer. Delegates to family-specific paths (poly / UST / slash / regular) and appends all sub-collapsibles. |

**Key design patterns:**

- **Family dispatch:** `showBreakdownChords()` branches on `currentChord.family` (`'poly'`, `'ust'`, `'slash'`, or regular) before any shared rendering. Each path builds its own name header and core rows independently.
- **Resolution priority chain:** `getResolutionInfo()` checks four sources in order — user selection, family-specific fixed logic, Pass 1 engine cache (`currentVoiceLeadingAnalysis`), `RESOLUTION_TARGETS` fallback — and returns the first valid result.
- **Mobile / desktop split:** `makeVoiceLeadingRow()` uses `isMobile()` to render two completely separate DOM structures. The mobile path stacks context collapsibles full-width; the desktop path uses the standard `breakdown-row` layout. Added in Mobile-3.
- **Chord scales skipped for quartal / cluster:** These families have no standard parent scale; the chord scales row is suppressed and a family-specific note is shown instead.

**Dependencies:** `breakdown.js` (`makeNameHeader`, `makeBDRow`, `makeCSGroup`, `makeChordScalesRow`, `joinSep`, `intervalAbbr`, `semitonesToNumeral`, `qualityFullName`, `makePill`, `SEMITONE_TO_ROMAN`, `INTERVAL_ABBR`, `resolutionActive`, `selectedResolution`, `resolutionRootMidi`, `playResolution`, `isMobile`), `helpers.js` (`spelledRoot`, `spelledNote`, `pcInterval`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`), `voicings.js` (`VOICING_MODES`), `state.js`, `voiceLeading.js` (`computeVoiceLeadingRules`).

**Consumed by:** `breakdown.js` (`showBreakdown()` dispatcher).

---

### ✅ js/breakdown/breakdown-scales.js

**Role:** Scales branch of the post-answer breakdown panel. Renders all scale theory information — note names, degree numerals, interval rows, step pattern, triad map, modal character, parent scale, and the harmonic field — into the shared breakdown panel.

**Size:** ~340 lines across 8 functions plus 2 constants.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `SCALE_CHARACTER` | `Object.<string, string>` | Modal character string per scale symbol — a single-line mood and brightness description shown in the Character collapsible. |
| `SCALE_MODAL_PARENT` | `Object.<string, { parent: string, degree: number }>` | Parent scale name and modal degree for scales derived from a parent. Scales absent from this table receive no Parent collapsible. |
| `computeDegreeNumerals(intervals, symbol)` | `(number[], string) → string[]` | Builds the degree-numeral array for a scale across all note counts. Enharmonically ambiguous semitone counts (6, 8, 9) are resolved via the scale symbol. |
| `computeTriadMap(intervals, sym, rootPc)` | `(number[], string, number) → string[]\|null` | Builds a diatonic triad map for a 7-note scale. Returns `null` for non-heptatonic scales. Each entry is an HTML `<span>` with a `title` attribute showing the note name. |
| `harmonicFieldSymbolSuffix(sym)` | `(string) → string\|null` | Maps an internal chord symbol to its display suffix. Returns `null` for unrecognised symbols. |
| `harmonicFieldQuality(third, fifth)` | `(number, number) → Object\|null` | Classifies a triad from its third and fifth intervals. Returns `null` for non-standard interval pairs. |
| `harmonicFieldSeventh(third, fifth, seventh)` | `(number, number, number) → string\|null` | Classifies the seventh chord from its third, fifth, and seventh intervals. Returns an internal chord symbol or `null`. |
| `buildHarmonicField(intervals, rootMidi, sym)` | `(number[], number, string) → Array` | Builds the harmonic field for a scale by stacking diatonic thirds on each degree. Seventh chords attempted first for heptatonic+ scales; triads for pentatonic/hexatonic; graceful fallback for unclassifiable degrees. |
| `makeHarmonicFieldRow(panel, intervals, rootMidi, sym)` | `(HTMLElement, number[], number, string) → void` | Renders the Harmonic Field collapsible row with one pill per scale degree. No mobile-specific path — pills use `flex-wrap: wrap` and reflow naturally on narrow screens. |
| `showBreakdownScales(panel)` | `(HTMLElement) → void` | Main renderer. Builds all rows and sub-collapsibles in order: Notes, Degrees, From root, Between notes, Steps, Triad map, Character, Parent, Harmonic field. |

**Key design patterns:**

- **Direction-aware interval rows:** The From root and Between notes rows branch on `currentScaleDir` (`'asc'` / `'desc'` / `'both'`), appending `↓` suffixes and reversing sequences as needed.
- **Conditional Steps row:** The W/H pattern row is only rendered when every step in the sequence reduces to W (whole), H (half), or W+H (augmented second). Scales with larger or irregular steps omit it silently.
- **No mobile path needed:** Unlike the voice leading and chord scales rows (which contain `white-space: nowrap` tables), the harmonic field renders pills with `flex-wrap: wrap`. Confirmed against `components.css` — no restructure required.

**Dependencies:** `breakdown.js` (`makeNameHeader`, `makeBDRow`, `makeCSGroup`, `joinSep`, `intervalAbbr`, `semitoneToDegree`, `SEMITONE_TO_ROMAN`, `ordinal`), `helpers.js` (`spelledRoot`, `spelledNote`, `pcInterval`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`), `state.js` (`currentScale`, `currentScaleRootMidi`, `currentScaleDir`).

**Consumed by:** `breakdown.js` (`showBreakdown()` dispatcher).

---

### ✅ js/breakdown/breakdown-progressions.js

**Role:** Progressions branch of the post-answer breakdown panel. Renders per-chord theory information for each step in the current progression — degree label, chord name, notes, intervals from root, harmonic function, and chord scales — as a series of collapsible sections inside the shared breakdown panel.

**Size:** ~130 lines across 2 functions plus 1 constant.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `HARMONIC_FUNCTION` | `Object.<number, { default: string, [qualSym: string]: string }>` | Harmonic function descriptions keyed by semitone offset (0–11), then by chord quality symbol. Each bucket has a `'default'` fallback plus optional quality-specific overrides (e.g. `'m'`, `'7'`, `'maj7'`). |
| `progFunctionNote(degSemis, qualSym)` | `(number, string) → string\|null` | Returns the harmonic function description for a chord at a given degree. Tries the quality-specific override first, then `'default'`. Returns `null` if the degree has no entry. |
| `showBreakdownProgressions(panel)` | `(HTMLElement) → void` | Main renderer. Builds a name header then one collapsible `cs-section` per chord in the progression, each containing Notes, From root, Function, and Chord scales rows. |

**Key design patterns:**

- **Full-width collapsibles, no label column:** Each chord section is a `cs-section` appended directly into `progBody` with no outer `breakdown-row` wrapper. All content is inherently full-width on every viewport — no mobile-specific path required.
- **Quality-keyed function overrides:** `HARMONIC_FUNCTION` buckets use the internal chord symbol as the key (e.g. `'m'`, `'7'`, `'o7'`), matching the same symbol strings used throughout `CHORD_TYPES`. The `'default'` key covers all unmatched qualities within a bucket.
- **Chord scales delegation:** `makeChordScalesRow()` (from `breakdown.js`) handles chord scales rendering, including the mobile/desktop split introduced in Mobile-3.

**Dependencies:** `breakdown.js` (`makeNameHeader`, `makeBDRow`, `makeChordScalesRow`, `joinSep`, `intervalAbbr`, `qualityFullName`, `spelledRoot`, `spelledNote`), `state.js` (`currentProgression`, `currentProgRootPc`, `currentProgRootMidi`, `PROG_DEGREES`, `PROG_QUALITIES`, `progChordMidi`), `chords.js` (`CHORD_TYPES`).

**Consumed by:** `breakdown.js` (`showBreakdown()` dispatcher).

---

### ✅ js/ui/stats.js

**Role:** UI reset and score display helpers. Handles between-question UI teardown and the score bar update. Note that the heavier session tracking logic — `resetSession()`, `recordAnswer()`, `renderStats()`, and `updateRootBadge()` — lives in `helpers.js` (Layer 3), where it was built alongside the pool and session state it depends on. The naming of this file is a mild misnomer; its actual scope is narrow by design.

**Size:** ~20 lines across 2 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `resetQuizUI()` | `() → void` | Resets all per-question UI state before a new question. Clears `answered`, resolution state, inversion index, notation panels, status message, answer dropdown, and the breakdown panel. Also calls `teardownProgressionUI()` to remove progression-specific DOM residue. |
| `updateScore()` | `() → void` | Writes the current `correct`, `total`, and `streak` globals to their respective score bar DOM elements (`#correct`, `#total`, `#streak`). |

**Key design patterns:**

- **Narrow scope by proximity:** Stats tracking functions (`resetSession`, `recordAnswer`, `renderStats`) live in `helpers.js` because they were built alongside `getActivePool()` and session state. Moving them to this file would violate the layer rule — `recordAnswer()` is called from Layer 6 mode files, but `resetSession()` calls `generateQuestion()` (Layer 7) and touches engine-layer state, making it impractical to extract without broader refactoring.

**Dependencies:** `state.js` (`answered`, `resolutionActive`, `resolutionRootMidi`, `dictInversionIndex`, `correct`, `total`, `streak`), `breakdown.js` (`hideBreakdown`), `progressions-mode.js` (`teardownProgressionUI`).

**Consumed by:** `app.js`, all four mode files (via `resetQuizUI()` at question generation time).

---

### ✅ js/ui/controls.js

**Role:** Answer dropdown and quiz control button renderers. Owns all interactive UI in the answer area — building the alphabetically sorted dropdown list, revealing correct/wrong feedback after the user submits, and rendering the Next / Hear Slowly / Resolve control buttons. Has no opinion about quiz logic; it only reads `answered`, `currentMode`, and `resolutionActive` from global state and delegates all callbacks to its callers.

**Size:** ~100 lines across 3 functions plus 1 module-scoped variable.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `renderAnswers(options, submitFn)` | `(Array, function) → void` | Builds and displays the answer dropdown for a new question. Sorts options alphabetically, wires the trigger and outside-click listener, and removes any listener left over from the previous question before adding a new one. |
| `revealDropdownAnswer(chosenSymbol, correctSymbol)` | `(string, string) → void` | Reveals correct/wrong feedback after the user has answered. Disables the trigger, applies `.correct` / `.wrong` classes to the appropriate list items, and updates the trigger label to the chosen answer name. |
| `renderControls(nextFn, playFn)` | `(function, function) → void` | Clears and rebuilds `#controls` on every call. After answering: always renders Next (mode-labelled) and Hear Slowly; renders Resolve ↔ Chord in Chords mode only. Empty before answering. |

**Key design patterns:**

- **Module-scoped outside-click handler:** The outside-click listener reference is stored in a module-level variable (`outsideClickHandler`) rather than on the DOM node (`wrap._outsideClick`). This keeps JS state in JS. On each `renderAnswers` call the previous listener is removed before a new one is added (anti-stacking), and the listener removes itself after firing once (auto-cleanup).
- **Stateless renderer:** `renderControls` tears down and rebuilds `#controls` on every call rather than patching existing buttons. This avoids stale event listener accumulation and keeps the function easy to reason about.
- **Mode-aware Next label:** The Next button label is derived directly from `currentMode` at render time — no mapping table, no state beyond the global.

**Dependencies:** `state.js` (`answered`, `currentMode`, `resolutionActive`), `audio.js` (`playSlowly`, `playResolution`).

**Consumed by:** all four mode files (via `renderAnswers` and `renderControls` at question generation and answer submission time), `app.js`.

---

### ✅ js/ui/pool.js

**Role:** Shared pool panel primitives and top-level mode dispatcher. Provides the six building-block functions consumed by all four mode-specific pool files. Contains no mode-specific logic — the dispatcher (`renderPoolPanel`) routes to the appropriate mode renderer and nothing else.

**Size:** ~300 lines across 6 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `renderPoolPanel()` | `() → void` | Clears `#poolPanel` and delegates to the appropriate mode renderer (`renderChordPoolPanel`, `renderIntervalPoolPanel`, `renderScalePoolPanel`, `renderProgressionPoolPanel`) based on `currentMode`. |
| `makePoolPanelShell(panel, title, metaFn)` | `(HTMLElement, string, function\|null) → { body, meta, updateMeta }` | Builds the collapsible header + body shell for any pool panel. Returns the inner body, the meta span, and an `updateMeta()` helper. |
| `makeGlobalAllNone(body, allItems, selectedSet, getAllChips, onChangeFn)` | `(HTMLElement, object[], Set, function, function) → void` | Appends a global All / None row. All/None operate across every item in `allItems`, syncing both the Set and the active class on every chip. |
| `makeSection(body, title, items, selectedSet, onChangeFn, collapsed?, useDisplayName?)` | `(HTMLElement, string, object[], Set, function, boolean, boolean) → void` | Appends a collapsible chip section with per-section All/None and a count display. Starts collapsed unless a selected item is present. `useDisplayName` causes chips to prefer `item.displayName` over `item.name` (used by Pentatonic scales for dual labels). |
| `_makeSubGroup(body, title)` | `(HTMLElement, string) → HTMLElement` | Builds a collapsible sub-group container (used by `pool-chords.js` to wrap Chord quality and Voicing). Returns the inner body. |
| `_makeAllNoneBtn(label)` | `(string) → HTMLButtonElement` | Creates a styled All or None button (used by `pool-chords.js` voicing group headers). |

**Key design patterns:**

- **Pure primitive layer:** `pool.js` owns no data constants and no mode-specific logic. Every symbol it defines is a generic DOM builder. Mode-specific constants (`CHORD_FAMILY_TITLES`, `VOICING_GROUPS`, `SCALE_GROUP_CONFIG`, etc.) live in the mode split files.
- **`makeSection` / `useDisplayName` merge:** The former `makeSectionWithDisplayName` was merged into `makeSection` via an optional `useDisplayName = false` parameter. The Pentatonic section in `pool-scales.js` passes `true`, surfacing `item.displayName` (e.g. "Major Pentatonic / Ionian Pentatonic"). All other callers use the default.
- **`_makeSubGroup` placement:** Although only `pool-chords.js` calls `_makeSubGroup`, it lives in the shared layer because it is a generic DOM primitive (collapsible container with header + arrow), not chord-specific logic.

**Dependencies:** `state.js` (`currentMode`), plus the four mode renderers defined in `pool-chords.js`, `pool-intervals.js`, `pool-scales.js`, `pool-progressions.js` (called by `renderPoolPanel` at dispatch time).

**Consumed by:** `app.js` and all four mode files (via `renderPoolPanel()`). Primitives consumed by all four `pool-*.js` files.

---

### ✅ js/ui/pool-chords.js

**Role:** Chord quality and voicing pool panel rendering. Handles the full complexity of the chord pool — 12 chord families (with UST sub-family splitting), the inversions toggle, and the two-mode voicing panel (multi-select before answering; single-select in dict and post-answer). Delegates to shared primitives in `pool.js`.

**Size:** ~330 lines across 4 constants and 14 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `CHORD_FAMILY_TITLES` | `Object.<string, string>` | Display titles for known `CHORD_TYPES` family keys. Keys absent from this map get a capitalised fallback. |
| `UST_SUBFAMILY_TITLES` | `Object.<string, string>` | Display titles for UST `subFamily` values (`dom7`, `min`, `maj7`). |
| `VOICING_GROUPS` | `Array.<{label, basic, symbols[]}>` | Voicing groups in display order. Each group carries a `basic` flag that limits visibility in Basic mode. |
| `ALL_VOICING_SYMBOLS` | `string[]` | Flat array of all voicing symbols including `'random'` — used for global All/None coverage. |
| `renderChordPoolPanel(panel)` | `(HTMLElement) → void` | Builds the chord pool shell and delegates sub-group rendering. Called by `renderPoolPanel()`. |
| `renderChordStyleChips()` | `() → void` | Renders chord playback style chips into `#chordStyleRow`. Updates `chordPlayStyle`, the play label, and notation on selection. |

**Private helpers (not exported, documented for maintainers):**

| Symbol | Description |
|---|---|
| `_familyTitle(key)` | Returns the display title for a `CHORD_TYPES` family key. |
| `_buildChordFamilies()` | Builds the flat `{ title, items }` section list from `CHORD_TYPES`, splitting families with `subFamily` into one section per sub-family. Respects Basic mode filter. |
| `_renderChordSubGroups(body)` | Builds the Chord quality and Voicing collapsible sub-groups. Shared by quiz and dict renderers. |
| `_renderChordQualitySection(body)` | Renders chord quality: multi-select + inversions toggle in quiz; single-select via `makeDictSection` in dict. |
| `_renderVoicingSection(body)` | Routes to multi or single-select voicing rendering based on `appMode` and `answered`. |
| `_renderVoicingMulti(body)` | Full multi-select voicing panel: global All/None, Random chip, six collapsible groups. |
| `_makeVoicingGroupMulti(body, title, items, allChipRefs)` | Builds one collapsible multi-select voicing group; pushes chip refs into `allChipRefs` for global sync. |
| `_renderVoicingSingle(body)` | Single-select voicing panel: Random chip + collapsible groups; each chip re-voices immediately. |
| `_makeVoicingGroupSingle(body, title, items)` | Builds one collapsible single-select voicing group. |
| `_syncVoicingChipActive(body)` | Syncs the active class across all single-select voicing chips after a selection. |
| `_updateAllSectionCounts(body)` | Updates count displays for all voicing group sections in multi-select mode. |
| `_updateSectionCount(sec, symbols)` | Updates the count display for a single voicing section. |

**Key design patterns:**

- **Two voicing modes:** The voicing panel has two distinct rendering paths. Before answering in quiz mode it is multi-select (selectedVoicings Set, no immediate re-render). Post-answer and in dict mode it switches to single-select (activeVoicingMode string, immediate re-voice on chip click via `recomputeCurrentNotes()`).
- **External dependency — `makeDictSection`:** `_renderChordQualitySection` calls `makeDictSection` in dict mode. This function is defined in the dict/dictionary UI layer, not in `pool.js`. It must be loaded before `pool-chords.js`.

**Dependencies:** `pool.js` (`makePoolPanelShell`, `makeGlobalAllNone`, `makeSection`, `_makeSubGroup`, `_makeAllNoneBtn`), `state.js`, `defaults.js`, `chords.js` (`CHORD_TYPES`), `voicings.js` (`VOICING_MODES`), `audio.js` (`recomputeCurrentNotes`), `notation.js`.

**Consumed by:** `pool.js` (`renderPoolPanel` dispatcher).

---

### ✅ js/ui/pool-intervals.js

**Role:** Interval training pool panel and playback style chip rendering. Splits the interval pool into Simple and Extended/Compound sections, hiding the compound section in Basic mode.

**Size:** ~65 lines across 2 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `renderIntervalPoolPanel(panel)` | `(HTMLElement) → void` | Builds the interval pool panel. Shows Simple intervals always; Extended/Compound section in Advanced mode only. Called by `renderPoolPanel()`. |
| `renderIntervalStyleChips()` | `() → void` | Renders interval playback style chips into `#intervalStyleRow` (Harmonic, Ascending, Descending, Random). Updates `intervalStyle`, the play label, and notation on selection. |

**Dependencies:** `pool.js` (`makePoolPanelShell`, `makeGlobalAllNone`, `makeSection`), `state.js`, `defaults.js`, `intervals.js` (`INTERVALS`, `INTERVAL_STYLES`), `notation.js`.

**Consumed by:** `pool.js` (`renderPoolPanel` dispatcher).

---

### ✅ js/ui/pool-scales.js

**Role:** Scale training pool panel and direction chip rendering. Groups scales by cardinality using `iterateScaleGroups`, which is the single source of truth for scale group structure and is consumed by both quiz and dict renderers.

**Size:** ~110 lines across 1 constant and 4 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `SCALE_GROUP_CONFIG` | `Object.<string, {title: string, sectionFn: string}>` | Display titles and section-renderer config per group key. `sectionFn: 'withDisplayName'` triggers dual-label chip rendering (used by Pentatonic). Keys absent from this object get a capitalised fallback title. |
| `iterateScaleGroups(callback)` | `(function) → void` | Iterates SCALES grouped by the `group` field in insertion order, filtered to basic scales in Basic mode. Calls `callback(key, title, items, cfg)` once per group. **Single source of truth for scale group structure** — both quiz pool and dict renderer consume this. |
| `renderScalePoolPanel(panel)` | `(HTMLElement) → void` | Builds the scale pool panel. Groups auto-discovered via `iterateScaleGroups`; Pentatonic chips show `displayName`. Called by `renderPoolPanel()`. |
| `renderScaleDirChips()` | `() → void` | Renders scale direction chips into `#scaleDirRow` (Ascending, Descending, Both, Random). Updates `scaleDirection`, the play label, and notation on selection. |

**Dependencies:** `pool.js` (`makePoolPanelShell`, `makeGlobalAllNone`, `makeSection`), `state.js`, `defaults.js`, `scales.js` (`SCALES`, `SCALE_DIRECTIONS`), `notation.js`.

**Consumed by:** `pool.js` (`renderPoolPanel` dispatcher), dict renderer (via `iterateScaleGroups`).

---

### ✅ js/ui/pool-progressions.js

**Role:** Progression training pool panel rendering. Groups progressions by `PROG_GROUPS` order; respects Basic mode filtering. Uses two-line chips (`prog-pool-chip` with `.prog-chip-sym` + `.prog-chip-name` spans) — a progression-specific design not shared with other pool files.

**Size:** ~110 lines across 2 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `renderProgressionPoolPanel(panel)` | `(HTMLElement) → void` | Builds the progression training pool panel with meta count (e.g. `9 / 9`), global All / None, and per-group sections via `_makeProgSection`. Groups follow `PROG_GROUPS` order; collapse state driven by `PROG_GROUP_COLLAPSED`. Called by `renderPoolPanel()`. |

**Private helpers (not exported, documented for maintainers):**

| Symbol | Description |
|---|---|
| `_makeProgSection(body, title, items, collapsed, onChangeFn)` | Builds one collapsible group section with two-line pool chips (`prog-pool-chip`): bold Roman numeral symbol (`.prog-chip-sym`) + lighter name (`.prog-chip-name`) on a single pill. Includes per-section count display and All / None buttons. Reads/writes `selectedProgressions` directly. |

**Note:** `PROG_GROUPS` and `PROG_GROUP_COLLAPSED` live in `progressions.js` (data layer) — no constants defined here.

**Note on provenance:** Both functions migrated from `progressions-mode.js` during the progressions-mode production pass — they were never in `pool.js`. The dict-mode equivalents (`renderDictProgressionPoolPanel`, `makeDictProgSection`) remain in `progressions-mode.js` because they are tightly coupled to dict state (`dictProgSymbol`, `dictShowProgression`).

**Dependencies:** `pool.js` (`makePoolPanelShell`, `makeGlobalAllNone`), `state.js` (`appDifficulty`, `selectedProgressions`), `defaults.js`, `progressions.js` (`PROGRESSIONS`, `PROG_GROUPS`, `PROG_GROUP_COLLAPSED`).

**Consumed by:** `pool.js` (`renderPoolPanel` dispatcher).

---

### ✅ js/modes/chords-mode.js

**Role:** Chord quiz mode: question generation, answer grading, and voice leading analysis cache. Handles all four chord families (normal, slash, polychord, UST) through dedicated early-return paths in `generateChordQuestion()`. Playback lives in `audio.js`; notation in `notation.js`; dictionary functions and the `generateQuestion` dispatcher live in `progressions-mode.js` (which loads last among mode files and overrides the stub).

**Size:** ~195 lines across 3 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `generateChordQuestion()` | `() → void` | Picks a random chord from the active pool and sets up all playback state. Routes through four paths — slash, polychord, UST, and normal (including inversions) — before rendering the answer dropdown and controls. Resets `chordKeySigMode` to `'C'` and clears `currentVoiceLeadingAnalysis` on every call. |
| `submitChordAnswer(chosen, _el)` | `(Object, Element) → void` | Grades the user's answer, updates score/streak/status, reveals the correct answer in the dropdown, computes and caches the voice leading analysis, then shows notation and re-renders controls with the Next button. |

**Private helpers (not exported, documented for maintainers):**

| Symbol | Description |
|---|---|
| `_buildVoiceLeadingAnalysis()` | Builds the voice leading analysis for the current chord state. Called once at answer-reveal time; result cached in `currentVoiceLeadingAnalysis` and consumed by `showBreakdown()`. Each family uses a distinct input strategy: slash analyses the upper chord only; poly merges both triads using the lower root; UST reconstructs implied intervals from shell + upper triad data; normal/inversion uses canonical intervals (not voiced MIDI notes) to avoid scale mismatches from omitted voices. Returns `null` if `analyseChord` is unavailable or state is incomplete. |

**Key design patterns:**

- **Four-path question generation:** `generateChordQuestion()` uses early-return branches for slash, polychord, and UST families before falling through to the normal chord path. Each path clears all state variables belonging to the other families, making the mutual exclusion explicit.
- **Inversion rotation:** For inverted chords, the normal path sorts the voiced MIDI notes and rotates them so the correct bass note (at `invIndex`) becomes the lowest pitch — it does not re-apply intervals from scratch.
- **UST badge symbol:** The root badge for UST chords reflects shell quality: `shellQuality === 'min'` → `'min'`; `shellQuality === 'maj7'` → `'maj'`; absent (dom7 default) → `'7'`. Derived inline at question time, not stored separately.
- **Voice leading from canonical intervals:** `_buildVoiceLeadingAnalysis()` passes `baseChord.intervals` (not `currentMidiNotes`) to `analyseChord()` for normal chords. Voicings can omit or double notes; using voiced notes causes incorrect scale matches (e.g. a rootless G7 voicing matching F major instead of C major).

**Dependencies:** `state.js` (`currentChord`, `currentMidiNotes`, `currentChordRootMidi`, `currentVoiceLeadingAnalysis`, `currentSlashBassMidi`, `currentUpperRootMidi`, `currentPolyUpperMidi`, `currentPolyLowerMidi`, `currentPolyUpperRootMidi`, `currentPolyLowerRootMidi`, `currentUSTShellMidi`, `currentUSTUpperMidi`, `currentUSTRootMidi`, `currentVoicingMode`, `answered`, `correct`, `total`, `streak`, `dictInversionIndex`), `helpers.js` (`getActivePool`, `pickRandom`, `chooseRootMidi`), `voicings.js` (`resolveVoicingMode`, `applyVoicing`), `spelling.js` (`spelledNote`), `notation.js` (`showNotation`, `resetQuizUI`, `updateRootBadge`, `getSlashChordRootLabel`, `getSlashResolvedName`, `getPolyChordLabel`, `getUSTLabel`, `getChordRootName`), `controls.js` (`renderAnswers`, `renderControls`, `revealDropdownAnswer`), `audio.js` (`playChord`), `voiceLeading.js` (`analyseChord`), `helpers.js` (`recordAnswer`, `updateScore`).

**Consumed by:** `progressions-mode.js` (`generateQuestion` dispatcher calls `generateChordQuestion()`), `app.js`.

---

### js/modes/intervals-mode.js
[ ] — pending production pass

---

### js/modes/scales-mode.js
[ ] — pending production pass

---

### ✅ js/modes/progressions-mode.js

**Role:** Progression quiz and dictionary mode. Handles playback, question generation, the slot-based answer UI, grading, post-answer VexFlow notation, the dictionary pool panel, and DOM teardown. Pool panel rendering for quiz mode lives in `pool-progressions.js`; the dict pool panel stays here because it is tightly coupled to `dictProgSymbol` state and `dictShowProgression()`.

**Size:** ~370 lines across 12 functions.

**Public API:**

| Symbol | Type | Description |
|---|---|---|
| `playProgression()` | `() → void` | Plays the current progression at normal speed (~0.5 s gap between chord onsets). |
| `playProgressionSlowly()` | `() → void` | Plays the current progression slowly (double gaps, longer sustain). Used by the 🐢 Hear slowly button in both quiz and dict modes. |
| `generateProgressionQuestion()` | `() → void` | Picks a random progression from the selected pool, sets all state, and renders the answer UI. |
| `renderProgressionAnswerUI()` | `() → void` | Builds the slot-based answer UI: one column per chord with degree row (I–VII) and quality row. |
| `updateSubmitBtn()` | `() → void` | Enables the Submit button only when every slot has both degree and quality selected. |
| `submitProgressionAnswer()` | `() → void` | Grades the submission slot by slot, updates score/streak, shows notation and breakdown, appends Next button. |
| `showProgressionNotation()` | `() → void` | Renders the full progression as a continuous VexFlow score. Supports treble, bass, or grand staff. Shows Roman numeral + quality labels (bold) and teal chord name labels above the stave. |
| `renderDictProgressionPoolPanel()` | `() → void` | Renders the dict pool panel into `#poolPanel`. Single-select — clicking a chip loads the progression immediately. |
| `dictShowProgression(prog)` | `(object) → void` | Loads a progression in dict mode: sets state, resets UI, shows notation and breakdown immediately. |
| `generateProgressionQuestion_entry()` | `() → void` | Entry point from `generateQuestion()`. Routes to dict or quiz flow based on `appMode`. |
| `generateQuestion()` | `() → void` | Top-level question dispatcher — routes to the mode handler for the current mode. Overrides any earlier stub. |
| `teardownProgressionUI()` | `() → void` | Restores all DOM elements mutated by `showProgressionNotation()`. Must be called on mode switch or new question. |

**Private helpers (not exported, documented for maintainers):**

| Symbol | Description |
|---|---|
| `progChordMidi(rootMidi, qualSym)` | Builds block-chord MIDI notes for one chord slot. Falls back to major triad if symbol not found in `CHORD_TYPES`. |
| `_makeDictProgSection(body, title, items, collapsed)` | Builds one collapsible group section for the dict pool panel. Single-select chips with no count or All/None buttons. Renamed from `makeDictProgSection` during production pass. |

**Key design patterns:**

- **Pool panel split:** Quiz pool panel (`renderProgressionPoolPanel` + `_makeProgSection`) lives in `pool-progressions.js`. Dict panel (`renderDictProgressionPoolPanel` + `_makeDictProgSection`) stays here because it reads/writes `dictProgSymbol` and calls `dictShowProgression` — both local to this file.
- **Slot-based answer UI:** Unlike other modes (single dropdown), progressions use a custom multi-slot UI where each chord gets its own degree and quality chip rows. The Submit button is gated until all slots are filled.
- **All-or-nothing scoring:** A progression answer is correct only if every slot (degree + quality) is correct. Partial credit is not awarded.
- **Grand staff decision:** `showProgressionNotation` unions all MIDI notes across the whole progression to decide treble / bass / grand staff — not per-chord.
- **`generateQuestion` override:** This file defines `generateQuestion()`, the top-level dispatcher used by `app.js`. It must load after any earlier stub that defines the same name.

**Dependencies:** `state.js`, `defaults.js`, `progressions.js` (`PROGRESSIONS`, `PROG_GROUPS`, `PROG_GROUP_COLLAPSED`, `PROG_DEGREES`, `PROG_QUALITIES`), `chords.js` (`CHORD_TYPES`), `spelling.js` (`spelledRoot`, `midiToVexKeySpelled`, `pcInterval`, `vexAccidental`), `keysig.js` (`vexKeyMajor`, `keySigCoveredLetters`, `isCoveredByKeySig`, `respellForKeySig`, `keySigAccidentalCount`), `audio.js` (`piano`, `audioCtx`, `NOTE_NAMES`), `notation.js` (`showBreakdown`, `resetQuizUI`, `updateRootBadge`, `updateScore`), `pool.js` (`makePoolPanelShell`), `pool-progressions.js` (`renderProgressionPoolPanel`).

**Consumed by:** `app.js` (calls `generateQuestion`, `teardownProgressionUI`, `generateProgressionQuestion_entry`).

---

### js/modes/help-mode.js
[ ] — pending production pass

---

### js/modes/about-mode.js
[ ] — pending production pass

---

### js/app.js
[ ] — pending production pass
