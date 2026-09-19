# HTML Structure — index.html

**Author:** Renato Fera P. — [LinkedIn](https://www.linkedin.com/in/renato-profeta/)
**Copyright:** © 2026 The Sound Travels — MIT License

---

## Overview

`index.html` is the single HTML file for the entire application. It defines the
complete DOM structure. It contains no inline scripts and no inline styles beyond
`display:none` toggles that JavaScript controls at runtime.

---

## Top-level DOM tree

```
<body>
  #stickyShell / #stickyInner       Fixed top bar (z-index 200)
    .header                          Row 1: logo, title, About (i), Help (?), theme toggle
    .score-bar                       Row 2: streak, score pill, New Session, QD toggle
    .mode-tabs                       Row 3: Intervals | Chords | Scales | Progressions

  #app
    #settingsPanel                   Collapsible settings and pool panel
      #settingsPanelBody
        .settings-section            Basic / Advanced difficulty chips
        .settings-section            Root note chips (#rootChips)
        .settings-section            Octave register chips (#octaveChips)
        #poolPanel                   Training pool (rendered by js/ui/pool.js)
    #playArea                        Play button + status message
    #notationPanel                   VexFlow SVG output (#notation-svg)
    #breakdownPanel                  Post-answer analysis rows
    #answerArea                      Answer dropdown + Submit / Next buttons
    #statsPanel                      Session accuracy table by type
    #helpView                        Full-screen Help overlay
    #aboutView                       Full-screen About overlay
    <footer>                         Social badges + copyright line
```

---

## Key IDs and their JS owners

| Element | Owned / written by |
|---|---|
| `#stickyShell` | Layout IIFE in `app.js` (syncs `body.paddingTop`) |
| `#streakPill`, `#scorePill` | `js/ui/stats.js` |
| `#qdToggle`, `#qdQuiz`, `#qdDict` | `app.js` -> `setAppMode()` |
| `.mode-tab` | `app.js` -> `switchMode()` |
| `#settingsPanelBody` | `app.js` collapsible IIFE |
| `#rootChips`, `#octaveChips` | `app.js` -> `renderRegisterPanel()` |
| `#poolPanel` | `js/ui/pool.js` -> `renderPoolPanel()` |
| `#playBtn` | `app.js` play listener; `js/engine/audio.js` `.playing` class |
| `#statusMsg` | `js/ui/controls.js` (aria-live="polite") |
| `#notation-svg` | `js/engine/notation.js` -> VexFlow |
| `#breakdownPanel` | `js/breakdown/breakdown.js` -> `showBreakdown()` |
| `#ansDropdownList` | `js/ui/controls.js` (role="listbox") |
| `#statsPanel` | `js/ui/stats.js` -> `updateScore()` |
| `#helpView` | `js/modes/help-mode.js` |
| `#aboutView` | `js/modes/about-mode.js` |

---

## Accessibility

| Feature | Implementation |
|---|---|
| All icon-only buttons | `aria-label` attribute |
| Score pills | `aria-label` descriptions |
| Chip groups | `role="group"` + `aria-label` |
| Status message | `aria-live="polite"` on `#statusMsg` |
| Answer dropdown | `role="listbox"` on `#ansDropdownList`; `role="option"` + `aria-selected` set dynamically by `controls.js` |

---

## Load order rationale

Scripts load at the bottom of `<body>` in strict dependency order (Layers 0-7).
See {@tutorial getting-started} for the full layer table.
