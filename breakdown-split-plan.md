# `breakdown.js` Split Plan

## Status

| File | Status | Notes |
|---|---|---|
| `breakdown-intervals.js` | ✅ Done | `INTERVAL_CONSONANCE`, `INTERVAL_CONTEXT`, `INTERVAL_INVERSION_SEMITONES`, `INTERVAL_INVERSION_NAME`, `tritoneLabel()`, `showBreakdownIntervals()` moved here |
| `breakdown-scales.js` | ✅ Done | `SCALE_CHARACTER`, `SCALE_MODAL_PARENT`, `computeDegreeNumerals()`, `computeTriadMap()`, `harmonicFieldSymbolSuffix()`, `harmonicFieldQuality()`, `harmonicFieldSeventh()`, `buildHarmonicField()`, `makeHarmonicFieldRow()`, `showBreakdownScales()` moved here |
| `breakdown-progressions.js` | ✅ Done | `HARMONIC_FUNCTION`, `progFunctionNote()`, `showBreakdownProgressions()` moved here |
| `breakdown-chords.js` | ⏳ Next | — |
| `breakdown.js` (trimmed) | ⬜ Pending | Remove moved code; replace `showBreakdown()` body with dispatcher |
| `index.html` | ⬜ Pending | Add 4 `<script>` lines |

**Resolved decision:** `INTERVAL_CONSONANCE`, `INTERVAL_CONTEXT`, `INTERVAL_INVERSION_SEMITONES`, `INTERVAL_INVERSION_NAME` moved to `breakdown-intervals.js` (not kept in `breakdown.js`) — they are exclusively used by the intervals branch.

---

## Ground rules

- **Zero changes** to `app.js`, `chords-mode.js`, or any mode/UI file.
- **Zero changes** to any public function name that is called from outside `breakdown.js`.
- **Zero changes** to `_buildVoiceLeadingAnalysis()` — it stays in `chords-mode.js`.
- All files are plain `<script>` tags, all functions stay global. No modules, no imports.
- The only edits outside `breakdown.js` are **4 new `<script>` lines in `index.html`**.
- We move code; we do not rewrite it. Every line lands exactly as-is.

---

## Public API of `breakdown.js` — must not change

These are called from outside and must remain in `breakdown.js` with identical signatures:

| Function | Called from |
|---|---|
| `showBreakdown()` | `app.js` |
| `hideBreakdown()` | `app.js` |
| `playResolution()` | `app.js` |
| `updateResolveBtn()` | `app.js`, `chords-mode.js` (indirectly via state) |
| `showCurrentView()` | `app.js` |
| `renderResolutionNotation()` | `app.js` |

These globals are declared in `breakdown.js` and read/written from outside — they also stay:

| Global | Used by |
|---|---|
| `resolutionActive` | `app.js` |
| `resolutionRootMidi` | `breakdown.js` internally, `app.js` resets it |
| `selectedResolution` | `breakdown.js` internally |

---

## Result: 5 files total

```
js/breakdown/
  breakdown.js               ← keeps shared foundation + dispatcher + VL engine
  breakdown-intervals.js     ← new: showBreakdownIntervals(panel)
  breakdown-chords.js        ← new: showBreakdownChords(panel)
  breakdown-scales.js        ← new: showBreakdownScales(panel)
  breakdown-progressions.js  ← new: showBreakdownProgressions(panel)
```

---

## `index.html` change — the only HTML edit

Replace:
```html
<script src="js/breakdown/breakdown.js"></script>
```

With:
```html
<script src="js/breakdown/breakdown.js"></script>
<script src="js/breakdown/breakdown-intervals.js"></script>
<script src="js/breakdown/breakdown-chords.js"></script>
<script src="js/breakdown/breakdown-scales.js"></script>
<script src="js/breakdown/breakdown-progressions.js"></script>
```

Load order is safe: all four sub-files load after `breakdown.js`, so all shared
helpers and tables they rely on are already defined.

---

## `showBreakdown()` dispatcher — the only logic change inside `breakdown.js`

The existing body of `showBreakdown()` becomes:

```javascript
function showBreakdown() {
  if (!currentVoiceLeadingAnalysis && typeof _buildVoiceLeadingAnalysis === 'function') {
    currentVoiceLeadingAnalysis = _buildVoiceLeadingAnalysis();
  }

  const panel = document.getElementById('breakdownPanel');
  panel.innerHTML = '';

  function addDivider() {
    const hr = document.createElement('hr');
    hr.className = 'breakdown-divider';
    panel.appendChild(hr);
  }

  if (currentMode === 'intervals')    return showBreakdownIntervals(panel);
  if (currentMode === 'scales')       return showBreakdownScales(panel);
  if (currentMode === 'progressions') return showBreakdownProgressions(panel);
  showBreakdownChords(panel);
}
```

`addDivider` stays here because it closes over `panel` — keeping it in the
dispatcher avoids passing it as a parameter to every sub-function.

---

## What stays in `breakdown.js`

Everything that is shared across two or more branches, or that is part of the
public API (voice leading engine, resolution playback, etc.).

### Lookup tables — STAYS

| Name | Lines | Why it stays |
|---|---|---|
| `SEMITONE_TO_NUMERAL` | 4–8 | Used by intervals, chords, scales, progressions |
| `INTERVAL_CONSONANCE` | 22–30 | Intervals branch only — **candidate to move**, but small enough to leave |
| `INTERVAL_CONTEXT` | 33–54 | Intervals branch only — **candidate to move**, but small enough to leave |
| `INTERVAL_INVERSION_SEMITONES` | 58–60 | Intervals branch only — same reasoning |
| `INTERVAL_INVERSION_NAME` | 61–65 | Intervals branch only — same reasoning |
| `SCALE_CHARACTER` | 68–120 | Scales branch only — moves to `breakdown-scales.js` |
| `SCALE_MODAL_PARENT` | 124–133 | Scales branch only — moves to `breakdown-scales.js` |
| `SEMITONE_TO_ROMAN` | 145–158 | Used by scales + chords |
| `INTERVAL_ABBR` | 372–376 | Used by intervals, scales, chords, progressions |
| `RESOLUTION_TARGETS` | 716–784 | Voice leading engine — stays |
| `VL_INTERVAL_NAMES` | 787–790 | Voice leading engine — stays |
| `HARMONIC_FUNCTION` | 1949–2013 | Progressions branch only — moves to `breakdown-progressions.js` |

### Helper functions — STAYS

| Function | Lines | Why it stays |
|---|---|---|
| `semitonesToNumeral()` | 11–19 | Used by chords + progressions + scales |
| `ordinal()` | 136–139 | Used by scales only — small, leave it |
| `semitoneToDegree()` | 162–169 | Used by scales only — small, leave it |
| `computeDegreeNumerals()` | 174–187 | Scales branch — moves to `breakdown-scales.js` |
| `computeTriadMap()` | 191–217 | Scales branch — moves to `breakdown-scales.js` |
| `computeRiemannRelations()` | 221–247 | Chords branch only — moves to `breakdown-chords.js` |
| `computeTritoneSubInfo()` | 250–255 | Chords branch only — moves to `breakdown-chords.js` |
| `computeDimEnharmonics()` | 258–261 | Chords branch only — moves to `breakdown-chords.js` |
| `computeDimDomSubs()` | 264–272 | Chords branch only — moves to `breakdown-chords.js` |
| `computeAugEnharmonics()` | 275–277 | Chords branch only — moves to `breakdown-chords.js` |
| `computeHalfDimContext()` | 280–285 | Chords branch only — moves to `breakdown-chords.js` |
| `computeSusResolution()` | 288–293 | Chords branch only — moves to `breakdown-chords.js` |
| `makePill()` | 296–310 | Used by scales (Riemann) + chord scales — stays |
| `makeRiemannRow()` | 313–367 | Chords branch only — moves to `breakdown-chords.js` |
| `intervalAbbr()` | 379–387 | Used by intervals, scales, chords, progressions |
| `tritoneLabel()` | 390–394 | Intervals branch only — moves to `breakdown-intervals.js` |
| `figuredBass()` | 397–408 | Chords branch only — moves to `breakdown-chords.js` |
| `makeBDRow()` | 410–422 | Used by all branches |
| `makeCSGroup()` | 427–457 | Used by all branches |
| `makeNameHeader()` | 462–498 | Used by all branches |
| `joinSep()` | 500–504 | Used by all branches |
| `isMobile()` | 575 | Used by chords + progressions (via `makeChordScalesRow`) |
| `makeChordScalesRow()` | 577–680 | Used by chords + progressions — stays |
| `vlRoleLabel()` | 794–802 | Voice leading engine — stays |
| `buildResolutionMidi()` | 805–814 | Voice leading engine — stays |
| `getResolutionInfo()` | 819–935 | Voice leading engine — stays |
| `computeVoiceLeading()` | 942–1012 | Voice leading engine — stays |
| `makeVoiceLeadingRow()` | 1024–1512 | Used by chords (all variants) — stays |
| `resolutionActive` (let) | 1517 | Public state — stays |
| `resolutionRootMidi` (let) | 1519 | Public state — stays |
| `selectedResolution` (let) | 1523 | Public state — stays |
| `playResolution()` | 1528–1568 | Public API — stays |
| `getSourceMidi()` | 1571–1576 | Used by playResolution — stays |
| `updateResolveBtn()` | 1579–1582 | Public API — stays |
| `showCurrentView()` | 1585–1588 | Public API — stays |
| `renderResolutionNotation()` | 1593–1789 | Public API — stays |
| `nameChordFromIntervals()` | 1795–1945 | Chords branch only — moves to `breakdown-chords.js` |
| `harmonicFieldSymbolSuffix()` | 2026–2042 | Scales branch (harmonic field) — moves to `breakdown-scales.js` |
| `harmonicFieldQuality()` | 2045–2051 | Scales branch — moves to `breakdown-scales.js` |
| `harmonicFieldSeventh()` | 2054–2064 | Scales branch — moves to `breakdown-scales.js` |
| `buildHarmonicField()` | 2071–2157 | Scales branch — moves to `breakdown-scales.js` |
| `makeHarmonicFieldRow()` | 2160–2262 | Scales branch — moves to `breakdown-scales.js` |
| `qualityFullName()` | 2264–2278 | Chords + progressions — stays |
| `progFunctionNote()` | 2016–2020 | Progressions branch — moves to `breakdown-progressions.js` |
| `showBreakdown()` | 2280–2943 | Becomes dispatcher — stays, body shrinks |
| `hideBreakdown()` | 2945–2951 | Public API — stays |

---

## `breakdown-intervals.js` — what moves here

**One new function:** `showBreakdownIntervals(panel)`

**Lookup tables that move with it** (only used by the intervals branch):

| Name | Current lines |
|---|---|
| `INTERVAL_CONSONANCE` | 22–30 |
| `INTERVAL_CONTEXT` | 33–54 |
| `INTERVAL_INVERSION_SEMITONES` | 58–60 |
| `INTERVAL_INVERSION_NAME` | 61–65 |

**Helper that moves with it:**

| Function | Current lines |
|---|---|
| `tritoneLabel()` | 390–394 |

**Content:** the `if (currentMode === 'intervals')` block from `showBreakdown()`
(currently lines ~2299–2349), wrapped in `function showBreakdownIntervals(panel) { ... }`.

**Shared things it calls** (remain in `breakdown.js` — no change needed):
`makeNameHeader`, `makeBDRow`, `joinSep`, `SEMITONE_TO_NUMERAL`, `INTERVAL_ABBR`,
`intervalAbbr`, `semitonesToNumeral`, `spelledRoot`, `spelledNote`,
`TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`,
`currentMode`, `currentInterval`, `currentIntervalMidi`, `currentIntervalStyle`.

---

## `breakdown-scales.js` — what moves here

**One new function:** `showBreakdownScales(panel)`

**Lookup tables that move with it:**

| Name | Current lines |
|---|---|
| `SCALE_CHARACTER` | 68–120 |
| `SCALE_MODAL_PARENT` | 124–133 |

**Helper functions that move with it:**

| Function | Current lines |
|---|---|
| `computeDegreeNumerals()` | 174–187 |
| `computeTriadMap()` | 191–217 |
| `harmonicFieldSymbolSuffix()` | 2026–2042 |
| `harmonicFieldQuality()` | 2045–2051 |
| `harmonicFieldSeventh()` | 2054–2064 |
| `buildHarmonicField()` | 2071–2157 |
| `makeHarmonicFieldRow()` | 2160–2262 |

**Content:** the `if (currentMode === 'scales')` block from `showBreakdown()`
(currently lines ~2352–2456), wrapped in `function showBreakdownScales(panel) { ... }`.

**Shared things it calls** (remain in `breakdown.js`):
`makeNameHeader`, `makeBDRow`, `makeCSGroup`, `joinSep`, `intervalAbbr`,
`semitoneToDegree`, `SEMITONE_TO_ROMAN`, `spelledRoot`, `spelledNote`, `pcInterval`,
`ordinal`, `currentMode`, `currentScale`, `currentScaleRootMidi`, `currentScaleDir`.

---

## `breakdown-progressions.js` — what moves here

**One new function:** `showBreakdownProgressions(panel)`

**Lookup table that moves with it:**

| Name | Current lines |
|---|---|
| `HARMONIC_FUNCTION` | 1949–2013 |

**Helper function that moves with it:**

| Function | Current lines |
|---|---|
| `progFunctionNote()` | 2016–2020 |

**Content:** the `if (currentMode === 'progressions')` block from `showBreakdown()`
(currently lines ~2458–2546), wrapped in `function showBreakdownProgressions(panel) { ... }`.

**Shared things it calls** (remain in `breakdown.js`):
`makeNameHeader`, `makeBDRow`, `makeCSGroup`, `makeChordScalesRow`, `joinSep`,
`intervalAbbr`, `qualityFullName`, `spelledRoot`, `spelledNote`, `pcInterval`,
`currentMode`, `currentProgression`, `currentProgRootPc`, `currentProgRootMidi`,
`PROG_DEGREES`, `PROG_QUALITIES`, `progChordMidi`, `CHORD_TYPES`.

---

## `breakdown-chords.js` — what moves here

**One new function:** `showBreakdownChords(panel)`

**Helper functions that move with it:**

| Function | Current lines |
|---|---|
| `computeRiemannRelations()` | 221–247 |
| `computeTritoneSubInfo()` | 250–255 |
| `computeDimEnharmonics()` | 258–261 |
| `computeDimDomSubs()` | 264–272 |
| `computeAugEnharmonics()` | 275–277 |
| `computeHalfDimContext()` | 280–285 |
| `computeSusResolution()` | 288–293 |
| `makeRiemannRow()` | 313–367 |
| `figuredBass()` | 397–408 |
| `nameChordFromIntervals()` | 1795–1945 |

**Content:** everything after the progressions branch in `showBreakdown()` —
the polychord, UST, slash, and regular chord sections
(currently lines ~2548–2943), wrapped in `function showBreakdownChords(panel) { ... }`.

**Shared things it calls** (remain in `breakdown.js`):
`makeNameHeader`, `makeBDRow`, `makeCSGroup`, `makeChordScalesRow`,
`makeVoiceLeadingRow`, `joinSep`, `intervalAbbr`, `semitonesToNumeral`,
`qualityFullName`, `makePill`, `SEMITONE_TO_ROMAN`, `INTERVAL_ABBR`,
`spelledRoot`, `spelledNote`, `spelledRoot`, `pcInterval`,
`VOICING_MODES`, `TRITONE_AS_D5`, `EIGHT_AS_A5`, `NINE_AS_D7`,
`currentChord`, `currentChordRootMidi`, `currentMidiNotes`, `currentVoicingMode`,
`currentPolyUpperRootMidi`, `currentPolyLowerRootMidi`, `currentPolyUpperMidi`,
`currentPolyLowerMidi`, `currentUSTRootMidi`, `currentUSTShellMidi`,
`currentUSTUpperMidi`, `currentSlashBassMidi`, `currentUpperRootMidi`,
`dictInversionIndex`, `getPolyChordLabel`, `getUSTLabel`, `getSlashResolvedName`,
`getChordRootName`, `polyQualitySuffix`, `polyQualityFull`, `switchMode`,
`dictSymbol`, `setAppMode`.

---

## Decision log — things we explicitly chose NOT to move

| Item | Reason |
|---|---|
| `INTERVAL_CONSONANCE`, `INTERVAL_CONTEXT`, `INTERVAL_INVERSION_*` | Only used by intervals branch — listed as candidates to move above, but small enough (~30 lines total) that keeping them in `breakdown.js` is fine if you prefer fewer moves. **Your call.** |
| `ordinal()`, `semitoneToDegree()` | Tiny helpers, used only in scales — not worth the noise of moving 4-line functions |
| `makePill()` | Used by `makeRiemannRow` (moving) but also potentially by harmonic field pills — leave in `breakdown.js` to be safe |
| `qualityFullName()` | Used by both chords and progressions branches |
| `isMobile()` | Used inside `makeChordScalesRow` which stays in `breakdown.js` |
| `SCALE_REF` (IIFE) | Defined inline just above `getChordScales` — both stay in `breakdown.js` since `makeChordScalesRow` is shared |
| `makeVoiceLeadingRow()` | Very large (~490 lines), called from chords, polychords, slash, UST — stays in `breakdown.js` |
| `_buildVoiceLeadingAnalysis()` | Lives in `chords-mode.js` — **do not touch** |

---

## Approximate line counts after the split

| File | Est. lines | Change |
|---|---|---|
| `breakdown.js` | ~1 650 | down from 2 951 |
| `breakdown-intervals.js` | ~100 | new |
| `breakdown-scales.js` | ~370 | new |
| `breakdown-progressions.js` | ~120 | new |
| `breakdown-chords.js` | ~730 | new |
| **Total** | **~2 970** | +19 (wrapper boilerplate) |

---

## Implementation order (safe sequence)

1. Create `breakdown-intervals.js` — smallest, easiest to verify
2. Create `breakdown-scales.js`
3. Create `breakdown-progressions.js`
4. Create `breakdown-chords.js` — largest, do last
5. Edit `breakdown.js` — remove moved code, replace body of `showBreakdown()` with dispatcher
6. Edit `index.html` — add 4 `<script>` lines
7. Test each mode's breakdown panel before moving to the next file
