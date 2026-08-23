# Pool Panel Split Plan

> **Pattern:** mirrors the `js/breakdown/` split exactly.  
> **Result:** `pool.js` (shared primitives + dispatcher) + 4 mode-specific files.  
> **Risk:** low — pure reorganisation, zero logic changes except the `makeSection` merge.  
> **Complete this plan before touching `ARCHITECTURE.md` or `index.html`.**

---

## Target file structure

```
js/ui/
├── pool.js               shared primitives + renderPoolPanel() dispatcher
├── pool-chords.js        all chord and voicing pool rendering
├── pool-intervals.js     interval pool + interval style chips
├── pool-scales.js        scale pool + scale direction chips
└── pool-progressions.js  progression pool
```

---

## Load order in `index.html`

```
stats.js → pool.js → pool-chords.js → pool-intervals.js → pool-scales.js → pool-progressions.js
```

No split file depends on another split file. All four depend on `pool.js` for shared primitives.

---

## Step 1 — Merge `makeSection` and `makeSectionWithDisplayName`

> Do this first, in the original `pool.js`, before the split. Confirms the merge works before
> adding the complexity of moving files.

- [ ] In `pool.js`, add an optional `useDisplayName = false` parameter to `makeSection`
- [ ] Inside `makeSection`, change the chip label line to:
  `chip.textContent = useDisplayName ? (item.displayName || item.name) : item.name;`
- [ ] Delete `makeSectionWithDisplayName` entirely
- [ ] In `renderScalePoolPanel`, change the `makeSectionWithDisplayName` call to:
  `makeSection(body, title, items, selectedScales, onChange, true, true)`
- [ ] Verify in the browser: Pentatonic chips still show `displayName` (e.g. "Major Pentatonic / Ionian Pentatonic"); all other scale chips unchanged
- [ ] Verify chord, interval, and progression pool panels unaffected

---

## Step 2 — Create `pool.js` (shared primitives + dispatcher)

> Strip everything mode-specific out of the current `pool.js`. What remains is the shared
> primitive layer and the top-level dispatcher.

**Functions that stay in `pool.js`:**

| Function | Notes |
|---|---|
| `renderPoolPanel()` | Top-level dispatcher — routes to the four mode renderers |
| `makePoolPanelShell()` | Used by all four mode renderers |
| `makeGlobalAllNone()` | Used by chords, intervals, scales, progressions |
| `makeSection()` | Used by chords, intervals, scales, progressions (now merged) |
| `_makeSubGroup()` | Used by `pool-chords.js` only, but is a primitive builder — stays here |
| `_makeAllNoneBtn()` | Used by `pool-chords.js` voicing section |

- [ ] Confirm the list above against the current file — nothing else belongs in `pool.js`
- [ ] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires`)
- [ ] Add JSDoc to every function in `pool.js`
- [ ] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [ ] Add `@file-end` footer with copyright line
- [ ] Verify `pool.js` has no references to `currentMode`, `appDifficulty`, or any mode-specific state beyond what `renderPoolPanel()` needs to dispatch

---

## Step 3 — Create `pool-chords.js`

**Functions to move from `pool.js`:**

| Symbol | Type |
|---|---|
| `CHORD_FAMILY_TITLES` | `const Object` |
| `UST_SUBFAMILY_TITLES` | `const Object` |
| `VOICING_GROUPS` | `const Array` |
| `ALL_VOICING_SYMBOLS` | `const Array` |
| `_familyTitle()` | function |
| `_buildChordFamilies()` | function |
| `_renderChordSubGroups()` | function |
| `_renderChordQualitySection()` | function |
| `_renderVoicingSection()` | function |
| `_renderVoicingMulti()` | function |
| `_renderVoicingSingle()` | function |
| `_makeVoicingGroupMulti()` | function |
| `_makeVoicingGroupSingle()` | function |
| `_syncVoicingChipActive()` | function |
| `_updateAllSectionCounts()` | function |
| `_updateSectionCount()` | function |
| `renderChordPoolPanel()` | function |
| `renderChordStyleChips()` | function |

- [ ] Create `js/ui/pool-chords.js`
- [ ] Move all symbols listed above from `pool.js` into `pool-chords.js`, in a logical order (constants first, then private helpers, then public renderers)
- [ ] Remove the duplicate `// POINT 41: Voicing section` comment block (lines ~352–370 in the original) — keep only one description
- [ ] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [ ] Add JSDoc to all public functions (`renderChordPoolPanel`, `renderChordStyleChips`)
- [ ] Add JSDoc to all private helpers (describe what each builds, not how)
- [ ] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [ ] Add `@file-end` footer with copyright line
- [ ] Verify `pool-chords.js` references only: shared primitives from `pool.js`, and globals from `state.js`, `defaults.js`, `chords.js`, `voicings.js`, `audio.js`, `notation.js`

---

## Step 4 — Create `pool-intervals.js`

**Functions to move from `pool.js`:**

| Symbol | Type |
|---|---|
| `renderIntervalPoolPanel()` | function |
| `renderIntervalStyleChips()` | function |

- [ ] Create `js/ui/pool-intervals.js`
- [ ] Move both functions from `pool.js` into `pool-intervals.js`
- [ ] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [ ] Add JSDoc to both functions
- [ ] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [ ] Add `@file-end` footer with copyright line
- [ ] Verify `pool-intervals.js` references only: shared primitives from `pool.js`, and globals from `state.js`, `defaults.js`, `intervals.js`, `notation.js`

---

## Step 5 — Create `pool-scales.js`

**Functions and constants to move from `pool.js`:**

| Symbol | Type |
|---|---|
| `SCALE_GROUP_CONFIG` | `const Object` |
| `iterateScaleGroups()` | function |
| `renderScalePoolPanel()` | function |
| `renderScaleDirChips()` | function |

Note: `makeSectionWithDisplayName` does not move — it was deleted in Step 1.

- [ ] Create `js/ui/pool-scales.js`
- [ ] Move all symbols listed above from `pool.js` into `pool-scales.js`
- [ ] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [ ] Add JSDoc to all functions and the `SCALE_GROUP_CONFIG` constant
- [ ] Document `iterateScaleGroups` carefully — it is the single source of truth for scale group structure and is consumed by both quiz and dict renderers
- [ ] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [ ] Add `@file-end` footer with copyright line
- [ ] Verify `pool-scales.js` references only: shared primitives from `pool.js`, and globals from `state.js`, `defaults.js`, `scales.js`, `notation.js`

---

## Step 6 — Create `pool-progressions.js`

**Functions to move from `pool.js`:**

| Symbol | Type |
|---|---|
| `renderProgressionPoolPanel()` | function |

Note: `PROG_GROUPS` and `PROG_GROUP_COLLAPSED` live in `progressions.js` (data layer) — nothing to move.

- [ ] Create `js/ui/pool-progressions.js`
- [ ] Move `renderProgressionPoolPanel` from `pool.js` into `pool-progressions.js`
- [ ] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [ ] Add JSDoc to `renderProgressionPoolPanel`
- [ ] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [ ] Add `@file-end` footer with copyright line
- [ ] Verify `pool-progressions.js` references only: shared primitives from `pool.js`, and globals from `state.js`, `defaults.js`, `progressions.js`

---

## Step 7 — Update `index.html`

- [ ] Locate the current `<script src="js/ui/pool.js">` tag
- [ ] Replace it with the five new script tags in load order:
  ```html
  <script src="js/ui/pool.js"></script>
  <script src="js/ui/pool-chords.js"></script>
  <script src="js/ui/pool-intervals.js"></script>
  <script src="js/ui/pool-scales.js"></script>
  <script src="js/ui/pool-progressions.js"></script>
  ```
- [ ] Confirm these five tags appear after `stats.js` and before the `js/modes/` tags
- [ ] Confirm no other script tag references the old `pool.js` content

---

## Step 8 — Smoke test

- [ ] Open the app in the browser — no console errors on load
- [ ] **Intervals tab:** pool panel opens; Simple intervals section visible; chips toggle correctly; Global All / None works; style chips (Harmonic / Ascending / Descending / Random) render and update play label
- [ ] **Chords tab:** pool panel opens; all 12 families visible; Voicing sub-group opens; multi-select chips toggle; Global All / None works; chord style chips render; inversions checkbox present
- [ ] **Scales tab:** pool panel opens; four cardinality groups visible; Pentatonic chips show display names (e.g. "Major Pentatonic / Ionian Pentatonic"); Global All / None works; direction chips render
- [ ] **Progressions tab:** pool panel opens; groups visible; Global All / None works
- [ ] **Basic / Advanced toggle:** switching modes correctly filters pool chips in all four tabs
- [ ] **Dict mode:** chord pool panel switches to single-select; clicking a chord loads it immediately; voicing single-select works
- [ ] **Post-answer voicing single-select:** after answering a chord question, voicing panel switches to single-select mode and re-voices on chip click
- [ ] **No ghost functions:** confirm `makeSectionWithDisplayName` is gone from `pool.js` and does not appear anywhere else in the codebase

---

## Step 9 — Update `ARCHITECTURE.md`

- [ ] In the repository structure tree, update the `js/ui/` block to show all five pool files with ✅
- [ ] Change `pool.js [ ] pending` to `✅ production pass complete`
- [ ] Add the full `pool.js` ARCHITECTURE entry (shared primitives + dispatcher)
- [ ] Add the full `pool-chords.js` ARCHITECTURE entry
- [ ] Add the full `pool-intervals.js` ARCHITECTURE entry
- [ ] Add the full `pool-scales.js` ARCHITECTURE entry
- [ ] Add the full `pool-progressions.js` ARCHITECTURE entry
- [ ] Update "Last updated" line to `js/ui/pool-progressions.js ✅`

---

*The Sound Travels Ear Training — Pool Split Plan*  
*Created: Aug 2026*
