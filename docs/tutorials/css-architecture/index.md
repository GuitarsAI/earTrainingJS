---
title: css-architecture
kind: guide
---

# CSS Architecture

**Author:** Renato Fera P. — [LinkedIn](https://www.linkedin.com/in/renato-profeta/) **Copyright:** © 2026 The Sound Travels — MIT License

---

## Three-file system

| File                 | Role                                               | Size                       |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `css/base.css`       | Design tokens (CSS custom properties) + base reset | \~90 lines                 |
| `css/components.css` | All component styles                               | \~1,130 lines, 20 sections |
| `css/mobile.css`     | Narrow-viewport overrides                          | \~200 lines                |

**Rule:** `components.css` and `mobile.css` contain zero hard-coded colour or spacing values — every value is a `var(--...)` reference from `base.css`, with two documented exceptions: the notation card is hardcoded `#ffffff` (VexFlow renders black ink and needs a white surface regardless of theme), and key signature chips use hardcoded light-palette values for the same reason.

---

## Design tokens — base.css

| Token              | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `--bg`             | Page background                                   |
| `--bg-card`        | Card / panel surface                              |
| `--bg-chip`        | Unselected chip background                        |
| `--bg-chip-active` | Selected chip background (teal tint)              |
| `--bg-hover`       | Hover state for interactive surfaces              |
| `--border`         | Default border colour                             |
| `--border-active`  | Teal active/focus border                          |
| `--text`           | Primary text                                      |
| `--text-muted`     | Secondary / label text                            |
| `--text-faint`     | Tertiary / annotation text                        |
| `--accent`         | Primary teal `#4a9e8e` — identical in both themes |
| `--accent-dark`    | Darker teal for hover states                      |
| `--accent-text`    | Teal text on white surface                        |
| `--correct`        | Correct-answer feedback colour                    |
| `--correct-bg`     | Correct-answer feedback background                |
| `--correct-border` | Correct-answer feedback border                    |
| `--wrong`          | Wrong-answer feedback colour                      |
| `--wrong-bg`       | Wrong-answer feedback background                  |
| `--wrong-border`   | Wrong-answer feedback border                      |
| `--shadow`         | Subtle box shadow                                 |
| `--shadow-md`      | Medium box shadow (cards, panels)                 |

Dark mode is applied via `[data-theme="dark"]` on `<html>`, toggled by `app.js` and persisted in `localStorage`. `--accent` is the same teal in both themes.

---

## components.css — 20 sections

| Section                       | Key selectors                                                                |
| ----------------------------- | ---------------------------------------------------------------------------- |
| 1 — Sticky header shell       | `#stickyShell`, `#stickyInner`                                               |
| 2 — Header row                | `.header`, `.header-left`, `.header-actions`, `.site-logo`, `.title`         |
| 3 — Score bar & QD toggle     | `.score-bar`, `.score-pill`, `.qd-toggle`, `.qd-btn` / `.active`             |
| 4 — Theme toggle & About/Help | `.theme-toggle`, `.about-btn` / `.about-btn.active`                          |
| 5 — Mode tabs                 | `.mode-tabs`, `.mode-tab` / `.active` (teal underline)                       |
| 6 — Training pool panel       | `.pool-panel`, `.pool-chip` / `.active`, `.pool-section-body` / `.collapsed` |
| 7 — Chip system               | `.option-chip` base + 4 aliases sharing one ruleset                          |
| 8 — Play area                 | `.play-btn` / `.playing` / `:disabled`                                       |
| 9 — Notation panel            | `.notation-area` (hardcoded `#ffffff`), `#notation-svg`                      |
| 10 — Quiz status              | `.status-msg` / `.good` / `.bad`                                             |
| 11 — Answer dropdown          | `.ans-dropdown-trigger`, `.ans-dropdown-list`, `.ans-dropdown-item`          |
| 12 — Controls                 | `.ctrl-btn` / `.primary` / `.slow` / `.resolve`                              |
| 13 — Settings panel           | `.settings-panel-body` / `.open`                                             |
| 14 — Root & register chips    | `.reg-chip` / `.active`                                                      |
| 15 — Breakdown panel          | `.breakdown-row`, `.cs-section`, `.bd-riemann-wrap` (CSS-only tooltip)       |
| 16 — Root toggle & stats      | `.root-badge`, `.stats-table`, `.stat-bar`                                   |
| 17 — Voice leading            | `.vl-selected` (`!important` override), `.vl-table`                          |
| 18 — Progression mode         | `.prog-slots-wrap`, `.prog-slot` / `.correct` / `.wrong`                     |
| 19 — About view               | `.about-card`, `.about-badges`, `.about-sponsor-btn`                         |
| 20 — Help view                | `.help-card`, `.help-entry` (`<details>`), `.help-entry-term` (`<summary>`)  |

---

## mobile.css — key overrides

Applied at `max-width: 600px` unless noted.

- Sticky header: reduced padding, smaller title font with `text-overflow: ellipsis`
- Score bar: About/Help buttons hidden in header, shown in score bar instead
- Pool panel: full-width, sections stack vertically
- Notation panel: horizontal scroll container
- Breakdown: Chord Scales and Voice Leading render full-width (JS-gated via `isMobile()`)
- Settings panel: `#settingsPanelBody.open { display: block }` — required because mobile CSS hides the body and only the `.open` class re-shows it

---

## JS -> CSS interaction map

| CSS state                         | Set by                                             |
| --------------------------------- | -------------------------------------------------- |
| `.mode-tab.active`                | `app.js` -> `switchMode()`                         |
| `.pool-chip.active`               | `js/ui/pool.js`                                    |
| `.qd-btn.active`                  | `app.js` -> `setAppMode()`                         |
| `.play-btn.playing`               | `js/engine/audio.js`                               |
| `.status-msg.good` / `.bad`       | `js/ui/controls.js`                                |
| `.ans-dropdown-trigger.open`      | `js/ui/controls.js`                                |
| `[data-theme="dark"]` on `<html>` | `app.js` theme IIFE -> persisted in `localStorage` |
| `.about-btn.active`               | `js/modes/about-mode.js` / `js/modes/help-mode.js` |
| `.settings-panel-body.open`       | `app.js` collapsible IIFE                          |
| `.reg-chip.active`                | `app.js` -> `renderRegisterPanel()`                |
| `.breakdown-*`, `.cs-*`, `.vl-*`  | `js/breakdown/breakdown-chords.js` and siblings    |
| `.prog-slot.correct` / `.wrong`   | `js/modes/progressions-mode.js`                    |
