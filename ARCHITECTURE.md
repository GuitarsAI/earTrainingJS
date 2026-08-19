# The Sound Travels Ear Training — Architecture

> **Working reference document — production pass only. Delete after v1.0.0.**  
> Sections are filled in file by file as the production pass progresses.  
> Last updated: index.html ✅

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
│   ├── components.css                 [ ] production pass pending
│   └── mobile.css                     [ ] production pass pending
│
├── js/
│   ├── vendor/
│   │   ├── soundfont-player.min.js    self-hosted MIT
│   │   └── vexflow.min.js             self-hosted MIT (v5.0.0)
│   ├── data/
│   │   ├── spelling.js                [ ] pending
│   │   ├── keysig.js                  [ ] pending
│   │   ├── chords.js                  [ ] pending
│   │   ├── intervals.js               [ ] pending
│   │   ├── scales.js                  [ ] pending
│   │   ├── progressions.js            [ ] pending
│   │   └── help-content.js            [ ] pending
│   ├── engine/
│   │   ├── state.js                   [ ] pending
│   │   ├── defaults.js                [ ] pending
│   │   ├── helpers.js                 [ ] pending
│   │   ├── audio.js                   [ ] pending
│   │   ├── notation.js                [ ] pending
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

### css/components.css
[ ] — pending production pass

---

### css/mobile.css
[ ] — pending production pass

---

### js/data/spelling.js
[ ] — pending production pass

---

### js/data/keysig.js
[ ] — pending production pass

---

### js/data/chords.js
[ ] — pending production pass

---

### js/data/intervals.js
[ ] — pending production pass

---

### js/data/scales.js
[ ] — pending production pass

---

### js/data/progressions.js
[ ] — pending production pass

---

### js/data/help-content.js
[ ] — pending production pass

---

### js/engine/state.js
[ ] — pending production pass

---

### js/engine/defaults.js
[ ] — pending production pass

---

### js/engine/helpers.js
[ ] — pending production pass

---

### js/engine/audio.js
[ ] — pending production pass

---

### js/engine/notation.js
[ ] — pending production pass

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
