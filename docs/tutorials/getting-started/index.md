---
title: getting-started
kind: guide
---

# The Sound Travels Ear Training — Developer Reference

**Author:** Renato Fera P. — [LinkedIn](https://www.linkedin.com/in/renato-profeta/) **Copyright:** © 2026 The Sound Travels — MIT License **Live app:** [guitarsai.github.io/earTrainingJS](https://guitarsai.github.io/earTrainingJS/)

---

## What this is

A zero-framework, zero-build-step vanilla JavaScript single-page application for ear training. Users practise recognising musical intervals, chords, scales, and chord progressions by ear. The app plays audio via WebAudio + FluidR3\_GM piano samples and renders music notation via VexFlow.

No React. No Vue. No webpack. No TypeScript. Pure HTML + CSS + JS loaded in strict dependency order.

---

## 7-Layer Architecture

| Layer         | Files                                                                                                            | Role                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 0 — Vendor    | `soundfont-player.min.js`, `vexflow.min.js`                                                                      | Third-party libraries (self-hosted, no CDN)            |
| 1 — Data      | `spelling.js`, `keysig.js`, `chords.js`, `intervals.js`, `scales.js`, `progressions.js`, `help-content.js`       | Pure data objects — no DOM, no state                   |
| 2 — State     | `state.js`, `defaults.js`                                                                                        | All mutable application state                          |
| 3 — Engine    | `helpers.js`, `voicings.js`, `audio.js`, `notation.js`, `voiceLeading.js`                                        | Audio, notation, and musical logic                     |
| 4 — Breakdown | `breakdown.js` + 4 mode files                                                                                    | Post-answer analysis panels                            |
| 5 — UI        | `stats.js`, `controls.js`, `pool.js` + 4 pool files                                                              | Shared DOM rendering helpers                           |
| 6 — Modes     | `chords-mode.js`, `intervals-mode.js`, `scales-mode.js`, `progressions-mode.js`, `help-mode.js`, `about-mode.js` | Per-mode quiz loops and UI                             |
| 7 — Boot      | `app.js`                                                                                                         | Orchestrator — loads last; depends on all layers above |

**Rule:** each layer may only reference symbols defined in layers above it. No layer reaches down.

---

## Load order

```
soundfont-player.min.js  vexflow.min.js          (vendor)
spelling.js -> keysig.js -> chords.js -> ...     (data)
state.js -> defaults.js                           (state)
helpers.js -> voicings.js -> audio.js -> ...     (engine)
breakdown.js -> breakdown-*.js                    (breakdown)
stats.js -> controls.js -> pool.js -> pool-*.js  (UI)
chords-mode.js -> ... -> about-mode.js           (modes)
app.js                                            (boot)
```

---

## External dependencies (all self-hosted — no runtime CDN calls)

| Dependency                  | Version | License |
| --------------------------- | ------- | ------- |
| VexFlow                     | 5.0.0   | MIT     |
| soundfont-player            | latest  | MIT     |
| FluidR3\_GM piano samples   | —       | MIT     |
| Inter (400, 500, 600)       | —       | OFL     |
| Playfair Display (600, 700) | —       | OFL     |

---

## See also

- {@tutorial html-structure} — full DOM structure and element reference
- {@tutorial css-architecture} — CSS layers, design tokens, and component map
