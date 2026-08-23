# Pool Panel Split Plan

> **Pattern:** mirrors the `js/breakdown/` split exactly.  
> **Result:** `pool.js` (shared primitives + dispatcher) + 4 mode-specific files.  
> **Risk:** low — pure reorganisation, zero logic changes except the `makeSection` merge.

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

## Sequencing rules

- **Create all four split files first.** Do not touch `index.html` or `pool.js` until all four files exist.
- **Wire `index.html` only when all four files are ready.** Add all five script tags at once.
- **Smoke test immediately after wiring.** At this point `pool.js` still has all the original code — duplication is intentional and temporary.
- **Delete from `pool.js` last**, after smoke test passes. This is the only moment `pool.js` shrinks.
- **JSDoc pass on `pool.js` happens during the delete step**, not before.

---

## Step 1 — Merge `makeSection` and `makeSectionWithDisplayName` in `pool.js`

> The only logic change in the entire split. Do it first, in isolation, and verify before
> creating any new files.

- [x] In `pool.js`, add an optional `useDisplayName = false` parameter to `makeSection`
- [x] Inside `makeSection`, change the chip label line to:
  `chip.textContent = useDisplayName ? (item.displayName || item.name) : item.name;`
- [x] Delete `makeSectionWithDisplayName` entirely from `pool.js`
- [x] In `renderScalePoolPanel` (still in `pool.js`), change the `makeSectionWithDisplayName` call to:
  `makeSection(body, title, items, selectedScales, onChange, true, true)`
- [x] Verify in the browser: Pentatonic chips still show `displayName` (e.g. "Major Pentatonic / Ionian Pentatonic"); all other scale chips unchanged
- [x] Verify chord, interval, and progression pool panels unaffected

---

## Step 2 — Create `pool-chords.js`

> Copy from `pool.js` — do not delete from `pool.js` yet.

**Functions and constants to copy:**

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

- [x] Create `js/ui/pool-chords.js`
- [x] Copy all symbols above into `pool-chords.js` in logical order: constants first, private helpers, public renderers last
- [x] Remove the duplicate `// POINT 41: Voicing section` comment block — keep only one description
- [x] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [x] Add JSDoc to all public functions (`renderChordPoolPanel`, `renderChordStyleChips`)
- [x] Add JSDoc to all private helpers
- [x] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [x] Add `@file-end` footer with copyright line

---

## Step 3 — Create `pool-intervals.js`

> Copy from `pool.js` — do not delete from `pool.js` yet.

**Functions and constants to copy:**

| Symbol | Type |
|---|---|
| `renderIntervalPoolPanel()` | function |
| `renderIntervalStyleChips()` | function |

- [x] Create `js/ui/pool-intervals.js`
- [x] Copy both functions into `pool-intervals.js`
- [x] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [x] Add JSDoc to both functions
- [x] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [x] Add `@file-end` footer with copyright line

---

## Step 4 — Create `pool-scales.js`

> Copy from `pool.js` — do not delete from `pool.js` yet.  
> Note: `makeSectionWithDisplayName` does not appear here — it was merged into `makeSection` in Step 1.

**Functions and constants to copy:**

| Symbol | Type |
|---|---|
| `SCALE_GROUP_CONFIG` | `const Object` |
| `iterateScaleGroups()` | function |
| `renderScalePoolPanel()` | function |
| `renderScaleDirChips()` | function |

- [x] Create `js/ui/pool-scales.js`
- [x] Copy all symbols above into `pool-scales.js`
- [x] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [x] Add JSDoc to all functions and the `SCALE_GROUP_CONFIG` constant
- [x] Document `iterateScaleGroups` carefully — single source of truth for scale group structure, consumed by both quiz and dict renderers
- [x] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [x] Add `@file-end` footer with copyright line

---

## Step 5 — Create `pool-progressions.js`

> Copy from `progressions-mode.js` — do not delete from `progressions-mode.js` yet.  
> Note: both functions come from `progressions-mode.js`, not from `pool.js` — the pool dispatcher
> already calls `renderProgressionPoolPanel(panel)` by name; it was never in `pool.js`.  
> Note: `PROG_GROUPS` and `PROG_GROUP_COLLAPSED` live in `progressions.js` (data layer) — nothing to copy from there.

**Functions to copy:**

| Symbol | Source | Type |
|---|---|---|
| `renderProgressionPoolPanel()` | `progressions-mode.js` | function |
| `makeProgSection()` → rename `_makeProgSection()` | `progressions-mode.js` | private helper function |

- [x] Create `js/ui/pool-progressions.js`
- [x] Copy `renderProgressionPoolPanel` from `progressions-mode.js` into `pool-progressions.js`
- [x] Copy `makeProgSection` from `progressions-mode.js` into `pool-progressions.js`; rename to `_makeProgSection`
- [ ] Fix `renderProgressionPoolPanel`: restore `metaFn` lambda and `updateMeta()` call; replace `makeSection` with `_makeProgSection`
- [x] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires pool.js`)
- [x] Add JSDoc to `renderProgressionPoolPanel`
- [ ] Add JSDoc to `_makeProgSection`
- [x] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [x] Add `@file-end` footer with copyright line

---

## Step 6 — Update `index.html`

> All four split files must exist before this step.

- [x] Locate the current `<script src="js/ui/pool.js">` tag
- [x] Replace it with the five new script tags in load order:
  ```html
  <script src="js/ui/pool.js"></script>
  <script src="js/ui/pool-chords.js"></script>
  <script src="js/ui/pool-intervals.js"></script>
  <script src="js/ui/pool-scales.js"></script>
  <script src="js/ui/pool-progressions.js"></script>
  ```
- [x] Confirm these five tags appear after `stats.js` and before the `js/modes/` tags

---

## Step 7 — Smoke test

> At this point `pool.js` still has all original code. Duplication is intentional and temporary.

- [x] Open the app in the browser — no console errors on load
- [x] **Intervals tab:** pool panel opens; Simple intervals section visible; chips toggle correctly; Global All / None works; style chips (Harmonic / Ascending / Descending / Random) render and update play label
- [x] **Chords tab:** pool panel opens; all 12 families visible; Voicing sub-group opens; multi-select chips toggle; Global All / None works; chord style chips render; inversions checkbox present
- [x] **Scales tab:** pool panel opens; four cardinality groups visible; Pentatonic chips show display names; Global All / None works; direction chips render
- [ ] **Progressions tab:** pool panel opens; meta count (e.g. `9 / 9`) visible in panel header; three groups visible (Cadences, Classical, Short); two-line chips render correctly (bold Roman numeral symbol + lighter name on one pill); per-section counts update on toggle; per-section All / None buttons work; Global All / None works
- [x] **Basic / Advanced toggle:** switching modes correctly filters pool chips in all four tabs
- [x] **Dict mode:** chord pool panel switches to single-select; clicking a chord loads it immediately; voicing single-select works
- [x] **Post-answer voicing single-select:** after answering a chord question, voicing panel switches to single-select and re-voices on chip click

---

## Step 8 — Delete moved code from `pool.js` + JSDoc pass

> Only after smoke test passes. This is the only step that shrinks `pool.js`.

**What stays in `pool.js` after the delete:**

| Symbol | Notes |
|---|---|
| `renderPoolPanel()` | Top-level dispatcher |
| `makePoolPanelShell()` | Used by all four mode renderers |
| `makeGlobalAllNone()` | Used by all four mode renderers |
| `makeSection()` | Used by all four mode renderers (merged) |
| `_makeSubGroup()` | Primitive builder — stays in shared layer |
| `_makeAllNoneBtn()` | Primitive builder — stays in shared layer |

- [x] Delete all symbols that moved to `pool-chords.js`
- [x] Delete all symbols that moved to `pool-intervals.js`
- [x] Delete all symbols that moved to `pool-scales.js`
- [ ] Delete `renderProgressionPoolPanel` and `makeProgSection` from `progressions-mode.js` (they moved to `pool-progressions.js`; note these were never in `pool.js`)
- [x] Add JSDoc file header (`@file`, `@description`, `@layer`, `@requires`)
- [x] Add JSDoc to every remaining function
- [x] Remove all `// POINT X:` dev comments; replace any worth keeping with plain inline comments
- [x] Add `@file-end` footer with copyright line
- [x] Reload the app — no console errors; repeat smoke test spot-checks

---

## Step 9 — Update `ARCHITECTURE.md`

- [x] In the repository structure tree, update the `js/ui/` block to show all five pool files with ✅
- [x] Replace `pool.js [ ] pending` placeholder with full `pool.js` ARCHITECTURE entry
- [x] Add full `pool-chords.js` ARCHITECTURE entry after `pool.js`
- [x] Add full `pool-intervals.js` ARCHITECTURE entry
- [x] Add full `pool-scales.js` ARCHITECTURE entry
- [ ] Update the `pool-progressions.js` ARCHITECTURE entry: add `_makeProgSection` to private helpers; correct source-of-move note (from `progressions-mode.js`); update size estimate; fix Dependencies to remove `makeSection` and add `_makeProgSection` note
- [x] Update "Last updated" line to `js/ui/pool-progressions.js ✅`

---

*The Sound Travels Ear Training — Pool Split Plan*  
*Created: Aug 2026*
