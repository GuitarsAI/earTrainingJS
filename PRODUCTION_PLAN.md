# The Sound Travels Ear Training — Production Plan

> **Created by:** Renato Fera P. — The Sound Travels — 2026  
> **Status:** Pre-production  
> **Version target:** v1.0.0  
> **Repo:** GitHub (provisional → final migration after production pass)  
> **Deployment target:** GitHub Pages via `gh-pages` branch  

---

## Table of Contents

1. [Overview & Goals](#1-overview--goals)
2. [Repository Structure](#2-repository-structure)
3. [GitHub Codespaces Setup](#3-github-codespaces-setup)
4. [Dependency Self-Hosting](#4-dependency-self-hosting)
5. [Build Pipeline](#5-build-pipeline)
6. [Documentation Standard](#6-documentation-standard)
7. [File-by-File Production Pass](#7-file-by-file-production-pass)
8. [Help System Audit](#8-help-system-audit)
9. [Accessibility Pass](#9-accessibility-pass)
10. [Testing Strategy](#10-testing-strategy)
11. [Performance Checklist](#11-performance-checklist)
12. [SEO & Meta Tags](#12-seo--meta-tags)
13. [Versioning & Changelog](#13-versioning--changelog)
14. [Deployment Workflow](#14-deployment-workflow)
15. [Legal & Licensing](#15-legal--licensing)
16. [Production Checklist](#16-production-checklist)

---

## 1. Overview & Goals

This document is the complete production plan for **The Sound Travels Ear Training** app. It covers every step required to take the codebase from its current development state to a professional, maintainable, publicly deployed v1.0.0.

### Goals

- Remove all development/research comments; replace with professional JSDoc documentation on every function, class, and file
- Self-host all third-party dependencies — no runtime CDN dependencies
- Establish a reproducible build pipeline using GitHub Codespaces
- Produce companion documents: `ARCHITECTURE.md`, `FUNCTIONS.md` (JSDoc-generated), `CHANGELOG.md`
- Achieve WCAG AA accessibility compliance
- Establish a unit testing baseline for all pure logic functions
- Deploy to GitHub Pages from a clean `gh-pages` branch

### Scope — files in production pass

| Layer | Files |
|---|---|
| HTML | `index.html` |
| CSS | `css/base.css`, `css/components.css`, `css/mobile.css` |
| Data | `js/data/spelling.js`, `js/data/keysig.js`, `js/data/chords.js`, `js/data/intervals.js`, `js/data/scales.js`, `js/data/progressions.js`, `js/data/help-content.js` |
| Engine | `js/engine/state.js`, `js/engine/defaults.js`, `js/engine/helpers.js`, `js/engine/audio.js`, `js/engine/notation.js`, `js/engine/voicings.js`, `js/engine/voiceLeading.js` |
| Breakdown | `js/breakdown/breakdown.js`, `js/breakdown/breakdown-intervals.js`, `js/breakdown/breakdown-chords.js`, `js/breakdown/breakdown-scales.js`, `js/breakdown/breakdown-progressions.js` |
| UI | `js/ui/stats.js`, `js/ui/controls.js`, `js/ui/pool.js` |
| Modes | `js/modes/chords-mode.js`, `js/modes/intervals-mode.js`, `js/modes/scales-mode.js`, `js/modes/progressions-mode.js`, `js/modes/help-mode.js`, `js/modes/about-mode.js` |
| App | `js/app.js` |

**Total: 1 HTML + 3 CSS + 27 JS = 31 files**

---

## 2. Repository Structure

### Source tree (what lives in `main` branch)

```
sound-travels-ear-training/
│
├── .devcontainer/
│   └── devcontainer.json          # Codespaces environment config
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # Optional: auto-deploy on push to main
│
├── assets/
│   ├── fonts/
│   │   ├── inter/                 # Self-hosted Inter WOFF2 files + OFL license
│   │   └── playfair-display/      # Self-hosted Playfair Display WOFF2 files + OFL license
│   ├── soundfonts/
│   │   └── FluidR3_GM/
│   │       └── acoustic_grand_piano/   # Per-note .mp3 files (~4MB)
│   └── logo.png
│
├── css/
│   ├── base.css
│   ├── components.css
│   └── mobile.css
│
├── js/
│   ├── vendor/
│   │   ├── soundfont-player.min.js     # MIT — self-hosted
│   │   └── vexflow.min.js              # MIT — self-hosted
│   ├── data/
│   ├── engine/
│   ├── breakdown/
│   ├── ui/
│   └── modes/
│   └── app.js
│
├── tests/
│   ├── spelling.test.js
│   ├── keysig.test.js
│   ├── voicings.test.js
│   ├── voiceLeading.test.js
│   ├── helpers.test.js
│   └── notation.test.js
│
├── docs/                          # JSDoc-generated output (gitignored or on docs branch)
│
├── dist/                          # Build output (gitignored on main; deployed to gh-pages)
│
├── index.html
├── package.json
├── build.sh
├── .gitignore
├── ARCHITECTURE.md
├── CHANGELOG.md
├── LICENSE
└── README.md
```

### `.gitignore`

```
node_modules/
dist/
docs/
```

> `dist/` is never committed to `main`. It is pushed to the `gh-pages` branch by the deploy script.  
> `docs/` (JSDoc output) lives on a `docs` branch or GitHub Pages `/docs` subdirectory — decision in §14.

---

## 3. GitHub Codespaces Setup

### Step 1 — Create the `.devcontainer/devcontainer.json` file

In the root of your repository, create the folder `.devcontainer/` and inside it create `devcontainer.json` with the following content:

```json
{
  "name": "Sound Travels Ear Training",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "forwardPorts": [8080],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ritwickdey.LiveServer",
        "lllllllqw.jsdoc-comment-toggler",
        "christian-kohler.path-intellisense"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "liveServer.settings.port": 8080
      }
    }
  }
}
```

**What this does:**
- Uses the official Microsoft Node.js 20 dev container image — Node, npm, and git are pre-installed
- Forwards port 8080 so Live Server previews the app in your browser tab
- Runs `npm install` automatically when the Codespace is created
- Installs ESLint, Prettier, Live Server, JSDoc helper, and path intellisense into VS Code automatically

### Step 2 — Create `package.json`

```json
{
  "name": "sound-travels-ear-training",
  "version": "1.0.0",
  "description": "The Sound Travels Ear Training — by Renato Fera P.",
  "private": true,
  "scripts": {
    "build": "bash build.sh",
    "deploy": "npm run build && gh-pages -d dist",
    "docs": "jsdoc -c jsdoc.json",
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "lint": "eslint js/**/*.js"
  },
  "devDependencies": {
    "terser": "^5.31.0",
    "clean-css-cli": "^5.6.3",
    "gh-pages": "^6.1.1",
    "jsdoc": "^4.0.3",
    "jest": "^29.7.0",
    "eslint": "^9.5.0"
  }
}
```

### Step 3 — Open the repository in Codespaces

1. Go to your GitHub repository page
2. Click the green **Code** button
3. Click the **Codespaces** tab
4. Click **Create codespace on main**
5. Wait for the container to build (~2 minutes on first launch)
6. When the VS Code interface opens in your browser, open the terminal (`Ctrl+\``)
7. Confirm Node is available: `node --version` — should print `v20.x.x`
8. Confirm npm packages installed: `ls node_modules/.bin/terser` — should resolve
9. Click **Go Live** in the VS Code status bar to launch Live Server on port 8080
10. A browser tab will open with your app running — this updates live as you edit files

### Step 4 — Configure git identity in Codespaces (first time only)

In the Codespaces terminal:

```bash
git config --global user.name "Renato Fera P."
git config --global user.email "your@email.com"
```

### Step 5 — Configure GitHub Pages

1. Go to your GitHub repository → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `gh-pages`, folder: `/ (root)`
4. Click **Save**
5. After your first deploy, the app will be live at `https://yourusername.github.io/sound-travels-ear-training/`

### Step 6 — Verify the build pipeline works

In the Codespaces terminal:

```bash
npm run build
```

Check that `dist/` folder was created with all files. Then:

```bash
npm run deploy
```

Check that GitHub Pages updated (takes ~60 seconds).

---

## 4. Dependency Self-Hosting

### 4.1 — VexFlow

**License:** MIT — safe to commit to git.

**Steps:**
1. Go to https://github.com/0xfe/vexflow/releases
2. Download `vexflow.min.js` from the latest 4.x release (currently 4.2.2 — match your current version)
3. Place it at `js/vendor/vexflow.min.js`
4. In `index.html`, replace:
   ```html
   <script src="https://unpkg.com/vexflow@4.2.2/build/cjs/vexflow.js"></script>
   ```
   with:
   ```html
   <script src="js/vendor/vexflow.min.js"></script>
   ```
5. Include the MIT license notice at the top of the file (it is already included in the built file)

### 4.2 — soundfont-player (JS library)

**License:** MIT — safe to commit to git.

**Steps:**
1. Go to https://github.com/danigb/soundfont-player/tree/master/dist
2. Download `soundfont-player.js`
3. Place it at `js/vendor/soundfont-player.min.js`
4. In `index.html`, replace:
   ```html
   <script src="https://unpkg.com/soundfont-player@0.12.0/dist/soundfont-player.js"></script>
   ```
   with:
   ```html
   <script src="js/vendor/soundfont-player.min.js"></script>
   ```

### 4.3 — Piano audio samples (FluidR3_GM)

**License:** MIT — safe to commit to git.

**Steps:**
1. Go to https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages/FluidR3_GM
2. Download the folder `acoustic_grand_piano-mp3/` (this is the only instrument your app uses)
3. Place the contents at `assets/soundfonts/FluidR3_GM/acoustic_grand_piano/`
4. In `js/engine/audio.js`, find the `Soundfont.instrument()` call and update the URL base:

   **Before (pointing to gleitz CDN):**
   ```javascript
   Soundfont.instrument(audioCtx, 'acoustic_grand_piano', {
     soundfont: 'FluidR3_GM'
     // resolves to https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/
   })
   ```

   **After (pointing to your self-hosted path):**
   ```javascript
   Soundfont.instrument(audioCtx, 'acoustic_grand_piano', {
     nameToUrl: (name, sf, format) =>
       `assets/soundfonts/FluidR3_GM/${name}-${format}/${name}-${format}.js`
   })
   ```

   > The exact `nameToUrl` signature depends on how your current `audio.js` calls `soundfont-player`. Review the file and match the pattern. The principle is the same: point the URL base at your `assets/soundfonts/` folder.

5. Commit the `assets/soundfonts/` folder to git. At ~4MB it is well within GitHub's limits.

### 4.4 — Google Fonts (Inter + Playfair Display)

**License:** SIL Open Font License (OFL) — safe to commit to git.

**Steps:**
1. Go to https://gwfh.makkox.com/fonts (Google Webfonts Helper)
2. Search for **Inter** — select weights 400, 500, 600 — select **Modern Browsers** (WOFF2 only) — download ZIP
3. Search for **Playfair Display** — select weights 600, 700 — download ZIP
4. Place files:
   - `assets/fonts/inter/inter-400.woff2`, `inter-500.woff2`, `inter-600.woff2`
   - `assets/fonts/playfair-display/playfair-display-600.woff2`, `playfair-display-700.woff2`
5. Copy the OFL license text into `assets/fonts/OFL-LICENSE.txt`
6. In `css/base.css`, remove the Google Fonts `<link>` tags from `index.html` and replace with `@font-face` blocks:

   ```css
   /* Inter */
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 400;
     font-display: swap;
     src: url('../assets/fonts/inter/inter-400.woff2') format('woff2');
   }
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 500;
     font-display: swap;
     src: url('../assets/fonts/inter/inter-500.woff2') format('woff2');
   }
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url('../assets/fonts/inter/inter-600.woff2') format('woff2');
   }

   /* Playfair Display */
   @font-face {
     font-family: 'Playfair Display';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url('../assets/fonts/playfair-display/playfair-display-600.woff2') format('woff2');
   }
   @font-face {
     font-family: 'Playfair Display';
     font-style: normal;
     font-weight: 700;
     font-display: swap;
     src: url('../assets/fonts/playfair-display/playfair-display-700.woff2') format('woff2');
   }
   ```

7. In `index.html`, remove these three lines from `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
   ```

---

## 5. Build Pipeline

### `build.sh`

Create this file in the repository root:

```bash
#!/usr/bin/env bash
# =============================================================================
# build.sh — The Sound Travels Ear Training
# Minifies JS and CSS source files into dist/ for production deployment.
# Created by Renato Fera P. — The Sound Travels — 2026
# =============================================================================

set -e  # Exit immediately on any error

SRC="."
DIST="dist"

echo "🎵 The Sound Travels — Building v$(node -p "require('./package.json').version")..."

# Clean dist
rm -rf "$DIST"
mkdir -p "$DIST"

# ── CSS ──────────────────────────────────────────────────────────────────────
echo "  → Minifying CSS..."
mkdir -p "$DIST/css"
npx clean-css-cli -o "$DIST/css/base.css"         css/base.css
npx clean-css-cli -o "$DIST/css/components.css"   css/components.css
npx clean-css-cli -o "$DIST/css/mobile.css"       css/mobile.css

# ── JS vendor (already minified — copy as-is) ────────────────────────────────
echo "  → Copying vendor JS..."
mkdir -p "$DIST/js/vendor"
cp js/vendor/vexflow.min.js          "$DIST/js/vendor/"
cp js/vendor/soundfont-player.min.js "$DIST/js/vendor/"

# ── JS source files (minify each) ────────────────────────────────────────────
echo "  → Minifying JS..."

JS_FILES=(
  js/data/spelling.js
  js/data/keysig.js
  js/data/chords.js
  js/data/intervals.js
  js/data/scales.js
  js/data/progressions.js
  js/data/help-content.js
  js/engine/state.js
  js/engine/defaults.js
  js/engine/helpers.js
  js/engine/audio.js
  js/engine/notation.js
  js/engine/voicings.js
  js/engine/voiceLeading.js
  js/breakdown/breakdown.js
  js/breakdown/breakdown-intervals.js
  js/breakdown/breakdown-chords.js
  js/breakdown/breakdown-scales.js
  js/breakdown/breakdown-progressions.js
  js/ui/stats.js
  js/ui/controls.js
  js/ui/pool.js
  js/modes/chords-mode.js
  js/modes/intervals-mode.js
  js/modes/scales-mode.js
  js/modes/progressions-mode.js
  js/modes/help-mode.js
  js/modes/about-mode.js
  js/app.js
)

for f in "${JS_FILES[@]}"; do
  dir="$DIST/$(dirname $f)"
  mkdir -p "$dir"
  npx terser "$f" \
    --compress \
    --mangle \
    --output "$DIST/$f"
  echo "    ✓ $f"
done

# ── Assets (copy unchanged) ──────────────────────────────────────────────────
echo "  → Copying assets..."
cp -r assets "$DIST/assets"

# ── index.html — copy and inject version cache-bust query strings ────────────
echo "  → Processing index.html..."
VERSION=$(node -p "require('./package.json').version")

# Replace all .js src and .css href with versioned equivalents
sed \
  -e "s|\.js\"|\.js?v=${VERSION}\"|g" \
  -e "s|\.css\"|\.css?v=${VERSION}\"|g" \
  index.html > "$DIST/index.html"

echo ""
echo "✅ Build complete → dist/"
echo "   Run 'npm run deploy' to push to GitHub Pages."
```

Make it executable:
```bash
chmod +x build.sh
```

### JSDoc config (`jsdoc.json`)

```json
{
  "source": {
    "include": ["js/"],
    "includePattern": ".+\\.js$",
    "excludePattern": "js/vendor/"
  },
  "opts": {
    "destination": "docs/",
    "recurse": true,
    "readme": "README.md"
  },
  "plugins": ["plugins/markdown"],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  },
  "tags": {
    "allowUnknownTags": false
  }
}
```

Generate docs at any time with:
```bash
npm run docs
```

---

## 6. Documentation Standard

### 6.1 — File header and footer (required on every JS file)

Every JS file must open and close with this pattern:

```javascript
/**
 * @file filename.js
 * @description One-sentence description of what this file contains and its role in the app.
 *
 * @module ModuleName
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// ... file contents ...

// =============================================================================
// The Sound Travels Ear Training — filename.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
```

### 6.2 — Function JSDoc (required on every function)

```javascript
/**
 * Converts a MIDI note number to a VexFlow-compatible key string with correct
 * enharmonic spelling for the given musical context.
 *
 * @param {number} midi - MIDI note number (0–127).
 * @param {string} context - Enharmonic context: 'sharp' | 'flat' | 'key'.
 * @param {string} [keySig='C'] - Active key signature, e.g. 'G', 'Bb'. Defaults to C major.
 * @returns {{ key: string, forcedAcc: boolean }} VexFlow key string and whether
 *   an accidental must be forced regardless of key signature coverage.
 *
 * @example
 * midiToVexKeySpelled(61, 'sharp');  // → { key: 'c#/4', forcedAcc: false }
 * midiToVexKeySpelled(61, 'flat');   // → { key: 'db/4', forcedAcc: false }
 */
function midiToVexKeySpelled(midi, context, keySig = 'C') { ... }
```

### 6.3 — CSS file header (required on every CSS file)

```css
/**
 * base.css
 * CSS custom properties (design tokens), resets, typography, and layout
 * foundations for The Sound Travels Ear Training.
 *
 * The Sound Travels Ear Training — Created by Renato Fera P. — The Sound Travels — 2026
 */
```

### 6.4 — CSS block comments (required per logical section)

```css
/* ── Typography ─────────────────────────────────────────────────────────── */

/* ── Score bar ──────────────────────────────────────────────────────────── */

/* ── Dark mode overrides ─────────────────────────────────────────────────── */
```

### 6.5 — Comment rules

| Rule | Detail |
|---|---|
| No development comments | Remove all `// POINT X`, `// TODO`, `// POINT 5 / POINT 7` style comments |
| No research notes | Remove all comments that document decisions, alternatives considered, or implementation history |
| No commented-out code | Delete it — git history preserves it if needed |
| Keep algorithmic comments | Complex logic (enharmonic resolution, voicing algorithms) must have inline comments explaining *why*, not *what* |
| No obvious comments | `// increment counter` above `count++` is noise — remove it |

---

## 7. File-by-File Production Pass

For each file, complete all six steps in order:

1. **Header/footer** — Add JSDoc file header and footer comment block
2. **Remove dev comments** — Strip all `POINT X`, `TODO`, research, and decision comments
3. **JSDoc all functions** — Every function gets `@param`, `@returns`, `@description`
4. **Algorithmic comments** — Add or retain inline comments on complex logic blocks
5. **Help audit** — Check whether any behaviour in this file is missing from `help-content.js`
6. **Architecture entry** — Add the file's entry to `ARCHITECTURE.md`

### Pass order (follows `index.html` load order)

#### Phase 1 — Data layer

| # | File | Priority notes |
|---|---|---|
| 1 | `js/data/spelling.js` | Core enharmonic engine — most complex data file; algorithmic comments critical |
| 2 | `js/data/keysig.js` | Key signature helpers; document all key/accidental lookup tables |
| 3 | `js/data/chords.js` | Large data file; document the data schema (fields: `symbol`, `name`, `intervals`, `basic`, `family`, etc.) |
| 4 | `js/data/intervals.js` | Document schema (`label`, `semitones`, `compound`, etc.) |
| 5 | `js/data/scales.js` | Document schema (`group`, `basic`, `degrees`, `directions`) |
| 6 | `js/data/progressions.js` | Document schema (`symbol`, `chords`, `basic`, `group`) |
| 7 | `js/data/help-content.js` | Document structure; this file IS the Help content — audit against all other files |

#### Phase 2 — Engine layer

| # | File | Priority notes |
|---|---|---|
| 8 | `js/engine/state.js` | Document every state variable — type, purpose, valid values |
| 9 | `js/engine/defaults.js` | Document default selection logic and dependency on data files |
| 10 | `js/engine/helpers.js` | Pure utility functions — full JSDoc on every helper |
| 11 | `js/engine/audio.js` | Document soundfont loading, AudioContext init, self-hosted URL change (§4.3) |
| 12 | `js/engine/notation.js` | Most complex file — `addAccidentalsFiltered`, `renderPolyNotation`, key sig conflict logic all need thorough inline comments |
| 13 | `js/engine/voicings.js` | Document all 6 groups and 62 voicing symbols; `applyVoicing()` switch cases need per-case comments |
| 14 | `js/engine/voiceLeading.js` | Document Pass 1 / Pass 2 algorithm; `RESOLUTION_TARGETS` fallback note |

#### Phase 3 — Breakdown layer

| # | File | Priority notes |
|---|---|---|
| 15 | `js/breakdown/breakdown.js` | Document `isMobile()`, `showBreakdown()`, mobile path logic |
| 16 | `js/breakdown/breakdown-intervals.js` | Document interval breakdown row structure |
| 17 | `js/breakdown/breakdown-chords.js` | Document chord breakdown row structure; figured bass, chord scales |
| 18 | `js/breakdown/breakdown-scales.js` | Document scale breakdown row structure |
| 19 | `js/breakdown/breakdown-progressions.js` | Document progression breakdown rows |

#### Phase 4 — UI layer

| # | File | Priority notes |
|---|---|---|
| 20 | `js/ui/stats.js` | Document stats table update logic |
| 21 | `js/ui/controls.js` | Document answer dropdown, auto-submit, green/red feedback |
| 22 | `js/ui/pool.js` | Document `iterateScaleGroups()`, all pool renderers, Basic/Advanced filter logic |

#### Phase 5 — Modes layer

| # | File | Priority notes |
|---|---|---|
| 23 | `js/modes/intervals-mode.js` | Document quiz flow, playback styles, direction handling |
| 24 | `js/modes/chords-mode.js` | Document quiz flow, voicing integration |
| 25 | `js/modes/scales-mode.js` | Document quiz flow, direction chip behaviour |
| 26 | `js/modes/progressions-mode.js` | Largest mode file — document `teardownProgressionUI()`, `recomputeCurrentNotes()`, notation rendering |
| 27 | `js/modes/help-mode.js` | Document search logic, panel open/close |
| 28 | `js/modes/about-mode.js` | Document panel open/close |

#### Phase 6 — App & HTML

| # | File | Priority notes |
|---|---|---|
| 29 | `js/app.js` | Central orchestrator — document `switchMode()`, `setAppDifficulty()`, `setAppMode()`, boot sequence, theme init |
| 30 | `index.html` | Professional HTML comments only; document load order in a comment block |
| 31–33 | `css/base.css`, `css/components.css`, `css/mobile.css` | Section headers, token documentation |

---

## 8. Help System Audit

The Help system (`js/data/help-content.js`, rendered by `js/modes/help-mode.js`) must be audited against every file in the production pass. The following gaps are **known at the time of writing**:

| Gap | Status | File to check |
|---|---|---|
| Basic / Advanced mode — no Help entry exists | ❌ Missing | `js/engine/state.js`, `js/ui/pool.js` |
| Compound intervals (m9–M13) — not described in Help | ❌ Missing | `js/data/intervals.js` |
| Voice leading panel — behaviour not documented in Help | ❌ Missing | `js/engine/voiceLeading.js` |
| Chord Scales breakdown — not documented in Help | ❌ Missing | `js/breakdown/breakdown-chords.js` |
| Progressions mode — quiz flow not documented | ❌ Missing | `js/modes/progressions-mode.js` |
| Voicing system — Group 5 fix already done | ✅ Done | `help-content.js` Aug 2026 update |
| Scale direction Random chip | ✅ Done | `help-content.js` Aug 2026 update |
| 7 new glossary entries | ✅ Done | `help-content.js` Aug 2026 update |

**During each file's production pass**, check: does this file contain any user-facing behaviour, setting, or concept that is not explained in Help? If yes, add a Help entry before marking the file done.

---

## 9. Accessibility Pass

Target: **WCAG 2.1 AA compliance** throughout.

### Checklist

#### Keyboard navigation
- [ ] All interactive elements reachable by `Tab`
- [ ] All chip buttons (`<button class="style-chip">`) have visible focus rings
- [ ] Answer dropdown navigable with `ArrowUp` / `ArrowDown` / `Enter` / `Escape`
- [ ] Collapsible panels togglable with `Enter` / `Space`
- [ ] Modal/overlay views (Help, About) trap focus while open and restore on close

#### ARIA
- [ ] All icon-only buttons have `aria-label` (audit: `aboutBtn`, `helpBtn`, `themeToggle`, `playBtn`)
- [ ] Chip button groups have `role="group"` with `aria-label` on the wrapper
- [ ] Answer dropdown has `role="listbox"` and options have `role="option"` with `aria-selected`
- [ ] Status messages (`#statusMsg`) have `aria-live="polite"`
- [ ] Score pills (`#streakPill`, `#scorePill`) have `aria-label` descriptions

#### Colour contrast
- [ ] All text against background meets 4.5:1 ratio (normal text) and 3:1 (large text)
- [ ] Teal accent colour verified in both light and dark mode
- [ ] Correct/incorrect feedback colours (green/red) meet contrast minimums
- [ ] Run Lighthouse accessibility audit — target score 90+

#### Touch targets
- [ ] All interactive elements minimum 44×44px (already targeted in current CSS — verify in audit)

#### Reduced motion
- [ ] All CSS transitions/animations wrapped in `@media (prefers-reduced-motion: reduce)`

---

## 10. Testing Strategy

### Framework: Jest (via Node.js, no browser required for pure logic)

Only pure logic functions are unit tested — DOM rendering functions are integration-tested manually. The goal is a regression safety net for the engine and data layers.

### Test files and coverage targets

#### `tests/spelling.test.js`
Tests for `spelling.js` — the enharmonic spelling engine.

Key cases to cover:
- `spelledNote()` — all 12 pitch classes in sharp context, flat context
- `midiToVexKeySpelled()` — edge cases: B#, Cb, E#, Fb
- `respellForKeySig()` — verify correct respelling for all 15 key signatures (7 sharps, 7 flats, C)
- `isCoveredByKeySig()` — notes inside vs. outside key signature
- Enharmonic equivalents returning correct context-aware result

#### `tests/keysig.test.js`
Tests for `keysig.js`.

Key cases:
- All 15 key signatures return correct accidental arrays
- Key signature string generation matches VexFlow format

#### `tests/helpers.test.js`
Tests for `helpers.js` — all pure utility functions.

Key cases:
- `pickRandom()` — returns item within array; handles single-item array; never out of bounds
- `chooseRootMidi()` — returns value within registered octave range
- MIDI arithmetic helpers — semitone wrapping, octave calculation

#### `tests/voicings.test.js`
Tests for `voicings.js` — the voicing algorithm engine.

Key cases:
- `applyVoicing('close', ...)` — output note count matches input chord
- `applyVoicing('drop2', ...)` — drop-2 algorithm verified against known chord examples
- Group 5 (intervallic) voicings — note count cap (4 for triads, 5 for others) enforced
- Group 5 — range clamping within 2-octave window enforced
- `resolveVoicingMode()` — returns valid voicing for every symbol in `VOICING_MODES`

#### `tests/voiceLeading.test.js`
Tests for `voiceLeading.js` — Pass 1 and Pass 2 of the voice leading engine.

Key cases:
- Known resolutions (V7→I in C major) produce expected target notes
- `RESOLUTION_TARGETS` fallback path triggers when primary engine has no result
- Output MIDI values are valid (0–127)

#### `tests/notation.test.js`
Tests for pure helper functions within `notation.js` (not the VexFlow rendering calls).

Key cases:
- `addAccidentalsFiltered()` conflict detection — same letter, different accidental triggers forced accidental
- Key sig conflict across all 540 chord/root combinations (the simulation from BUG-9 fix)

### Running tests

```bash
npm test
```

All tests must pass before any `npm run deploy`.

---

## 11. Performance Checklist

### Target: Lighthouse Performance score 85+ on mobile

- [ ] **Fonts** — `font-display: swap` on all `@font-face` declarations (included in §4.4 template)
- [ ] **VexFlow** — notation SVG is only rendered when the notation panel is open or post-answer; verify no redundant re-renders on every state change
- [ ] **Soundfont loading** — samples load once on first play; verify `AudioContext` is not re-created on session reset
- [ ] **JS minification** — all source JS minified via terser in build (§5)
- [ ] **CSS minification** — all CSS minified via clean-css in build (§5)
- [ ] **No render-blocking resources** — all `<script>` tags at bottom of `<body>` (already correct in current `index.html`)
- [ ] **Image optimisation** — `assets/logo.png` compressed (use `squoosh.app` or `imagemin`)
- [ ] **Apple touch icon** — add `<link rel="apple-touch-icon" href="assets/logo.png">` to `<head>`
- [ ] Run Lighthouse in Codespaces via Chrome DevTools against the `dist/` version

---

## 12. SEO & Meta Tags

Add the following to `index.html` `<head>` before the CSS links:

```html
<!-- Primary meta -->
<meta name="description" content="Free ear training app for musicians — intervals, chords, scales, and progressions. By The Sound Travels.">
<meta name="author" content="Renato Fera P. — The Sound Travels">
<meta name="keywords" content="ear training, music theory, intervals, chords, scales, progressions, solfege">
<meta name="theme-color" content="#1a9e8f">

<!-- Open Graph (controls how links preview on LinkedIn, WhatsApp, etc.) -->
<meta property="og:type" content="website">
<meta property="og:title" content="The Sound Travels Ear Training">
<meta property="og:description" content="Free ear training for musicians — intervals, chords, scales, and progressions.">
<meta property="og:image" content="https://yourusername.github.io/sound-travels-ear-training/assets/og-image.png">
<meta property="og:url" content="https://yourusername.github.io/sound-travels-ear-training/">

<!-- Twitter / X card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The Sound Travels Ear Training">
<meta name="twitter:description" content="Free ear training for musicians.">
<meta name="twitter:image" content="https://yourusername.github.io/sound-travels-ear-training/assets/og-image.png">

<!-- Canonical -->
<link rel="canonical" href="https://yourusername.github.io/sound-travels-ear-training/">

<!-- Apple touch icon -->
<link rel="apple-touch-icon" href="assets/logo.png">
```

> **Create `assets/og-image.png`** — a 1200×630px image (the standard OG size) with the app name and logo. This is what appears when you share the link on LinkedIn or WhatsApp. You can create it in Canva or Figma.

---

## 13. Versioning & Changelog

### Semantic versioning

This project uses [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- `MAJOR` — breaking change or full redesign
- `MINOR` — new feature (new mode, new chord family, new voicing group)
- `PATCH` — bug fix, copy change, accessibility fix

**Starting version: `v1.0.0`** — the production release.

### `CHANGELOG.md`

Create `CHANGELOG.md` in the repository root. The format follows [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

All notable changes to The Sound Travels Ear Training are documented here.

## [1.0.0] — 2026

### Added
- Intervals mode: 12 simple + 7 compound intervals, 3 playback styles
- Chords mode: 12 families, 62 voicings across 6 groups
- Scales mode: 46 scales across 4 cardinality groups (pentatonic / hexatonic / diatonic / octatonic)
- Progressions mode: full chord progression quiz and dictionary
- Basic / Advanced difficulty toggle across all four modes
- Voice leading panel with Pass 1 and Pass 2 resolution engine
- Chord Scales breakdown with harmonic field analysis
- In-app Help system with glossary
- About page with credits
- Dark / light mode with localStorage persistence
- Full mobile responsive layout
- Notation via VexFlow with key signature support and inversion chips
- Session stats panel with per-type accuracy tracking
```

---

## 14. Deployment Workflow

### Standard release process (run from Codespaces terminal)

```bash
# 1. Make sure all tests pass
npm test

# 2. Build
npm run build

# 3. Deploy to GitHub Pages
npm run deploy

# 4. Tag the release in git
git tag v1.0.0
git push origin v1.0.0
```

### Branch structure

| Branch | Purpose |
|---|---|
| `main` | Source code — this is what you edit |
| `gh-pages` | Built `dist/` output — managed by `gh-pages` npm package, never edited manually |
| `docs` | Optional: JSDoc generated output if you want it hosted |

### Optional: GitHub Actions auto-deploy

Create `.github/workflows/deploy.yml` to auto-build and deploy whenever you push to `main`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

With this in place, every `git push` to `main` automatically tests, builds, and deploys. No manual deploy step needed.

---

## 15. Legal & Licensing

### `LICENSE`

Create `LICENSE` in the repository root with the MIT License text:

```
MIT License

Copyright (c) 2026 Renato Fera P. — The Sound Travels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Third-party license notices

Create `THIRD_PARTY_LICENSES.md`:

```markdown
# Third-Party Licenses

## VexFlow
- License: MIT
- Source: https://github.com/0xfe/vexflow

## soundfont-player
- License: MIT
- Source: https://github.com/danigb/soundfont-player

## FluidR3_GM audio samples
- License: MIT
- Source: https://github.com/gleitz/midi-js-soundfonts

## Inter typeface
- License: SIL Open Font License 1.1
- Source: https://github.com/rsms/inter

## Playfair Display typeface
- License: SIL Open Font License 1.1
- Source: https://github.com/clauseggers/Playfair
```

---

## 16. Production Checklist

Use this as the final gate before tagging `v1.0.0`.

### Documentation
- [ ] JSDoc file header on every JS file (27 files)
- [ ] JSDoc footer on every JS file (27 files)
- [ ] JSDoc `@param` / `@returns` on every function
- [ ] CSS section headers on all three CSS files
- [ ] All development/research comments removed
- [ ] `ARCHITECTURE.md` complete
- [ ] `CHANGELOG.md` complete
- [ ] `README.md` complete with setup instructions
- [ ] JSDoc HTML docs generated (`npm run docs`)

### Dependencies
- [ ] VexFlow self-hosted in `js/vendor/`
- [ ] soundfont-player self-hosted in `js/vendor/`
- [ ] Piano samples self-hosted in `assets/soundfonts/`
- [ ] Google Fonts self-hosted in `assets/fonts/`
- [ ] All unpkg CDN `<script>` tags removed from `index.html`
- [ ] All Google Fonts `<link>` tags removed from `index.html`
- [ ] `audio.js` updated to use local soundfont path
- [ ] `css/base.css` updated with `@font-face` blocks

### Build & deployment
- [ ] `package.json` created
- [ ] `build.sh` created and executable
- [ ] `jsdoc.json` created
- [ ] `.devcontainer/devcontainer.json` created
- [ ] `.gitignore` includes `node_modules/`, `dist/`, `docs/`
- [ ] `npm run build` completes without errors
- [ ] `dist/` contains all expected files
- [ ] Cache-bust version strings appended to all asset URLs in `dist/index.html`
- [ ] `npm run deploy` pushes to `gh-pages` branch
- [ ] App loads correctly at GitHub Pages URL

### Testing
- [ ] All 6 test files created
- [ ] `npm test` passes with 0 failures
- [ ] BUG-9 regression test (540 chord/root combinations) passes

### Accessibility
- [ ] Lighthouse accessibility score 90+
- [ ] All interactive elements keyboard-navigable
- [ ] All icon-only buttons have `aria-label`
- [ ] Answer dropdown has `role="listbox"` / `role="option"`
- [ ] `#statusMsg` has `aria-live="polite"`
- [ ] `@media (prefers-reduced-motion)` applied to all transitions

### Performance
- [ ] Lighthouse performance score 85+ on mobile
- [ ] All fonts use `font-display: swap`
- [ ] `assets/logo.png` compressed
- [ ] `og-image.png` created (1200×630px)

### SEO & meta
- [ ] `<meta name="description">` added
- [ ] Open Graph tags added
- [ ] Twitter card tags added
- [ ] `<link rel="canonical">` added
- [ ] `<link rel="apple-touch-icon">` added
- [ ] `<meta name="theme-color">` added

### Help system
- [ ] Basic / Advanced mode documented in Help
- [ ] Compound intervals documented in Help
- [ ] Voice leading panel documented in Help
- [ ] Chord Scales breakdown documented in Help
- [ ] Progressions mode quiz flow documented in Help

### Legal
- [ ] `LICENSE` (MIT) in repository root
- [ ] `THIRD_PARTY_LICENSES.md` in repository root
- [ ] OFL font license in `assets/fonts/OFL-LICENSE.txt`
- [ ] Copyright year correct (2026) in all file footers

---

*The Sound Travels Ear Training — Production Plan*  
*Created by Renato Fera P. — The Sound Travels — 2026*
