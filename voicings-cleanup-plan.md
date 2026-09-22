# Voicings Cleanup — Implementation Plan
**Project:** The Sound Travels Ear Training
**Rule:** A voicing may only output notes derivable from `baseIntervals`. No fabricated tones, no `?? fallback` that invents a note the chord doesn't contain.
**Outcome:** Two outcomes only — delete the voicing; if its pitch structure has no home in `chords.js`, promote it there first as a new chord entry.

**Scope note (added):** This revision folds in **Option A** from the note-count discussion — the voicing pool should visibly reflect which voicings apply to the chord actually on screen, rather than silently degrading to `'close'`. This is implemented **only** where a single "current chord" is unambiguous: dictionary mode and the post-answer single-select voicing panel. The quiz pre-answer multi-select panel (where voicing selections are chosen before any specific chord is rolled, against a whole chord-quality pool) is **explicitly deferred** — see "Deferred: Option 2" at the end of this document. The Prompt 3 fallback-to-close safety net is therefore still required and still verified in the checklist; gating is an additional honesty layer on top of it, not a replacement for it.

---

## Status tracker

| Prompt | File(s) | Status |
|---|---|---|
| 1 — New chord entries + `alsoKnownAs` | `chords.js` | ✅ Done |
| 2 — Delete illegal voicings + orphaned cases | `voicings.js` | ✅ Done |
| 3 — Fix existence-check bugs (7 voicings) | `voicings.js` | ✅ Done (was already applied in the handed-off file) |
| 4 — Add `VOICING_REQUIREMENTS` + `voicingAppliesToChord()` | `voicings.js` | ✅ Done (was already applied in the handed-off file) |
| 5 — Gate single-select voicing chips per chord | `pool-chords.js`, `app.js`, `components.css` | ✅ Done |
| 6 — Update JSDoc / group counts | `voicings.js` | ✅ Done (already applied in the handed-off file — see session note below) |
| 7 — Render `alsoKnownAs` in breakdown panel | `breakdown-chords.js`, `components.css` | ✅ Done |
| 8 — Update `ARCHITECTURE.md` | `ARCHITECTURE.md` | ⬜ Todo — blocked on one open question, see below |
| 9 — Update `help-content.js` | `help-content.js` | ✅ Done |

**Note on ordering:** Prompt 8 (ARCHITECTURE.md) should remain last among the code-touching prompts so it can be updated once with accurate final counts. Prompt 9 (help-content.js) is pure content — no logic dependencies — and can be done at any point after Prompt 2, but doing it after Prompt 6 ensures the group counts it references are final.

---

## Session notes (current pass)

Files reviewed this pass: `voicings.js`, `breakdown-chords.js`, `components.css`, `ARCHITECTURE.md`, `help-content.js`, `pool-chords.js`.

- **Prompt 6 — confirmed complete, not just claimed.** Traced every guarded `case` in `applyVoicing()` against `VOICING_REQUIREMENTS` by hand: `shell`, `shell_alt`, `shell_rootless`, `tn_maj_357`, `tn_maj_137`, `tn_dom_13b7`, `tn_dom_35b7`, `tn_dom_3b79`, `tn_min_1b3b7`, `tn_min_b35b7`, `tn_min_b3b79`, `evans_a`, `evans_b`, `kenny_barron`, `oct_bass_triad`, `open5_triad`, `spread_2h`, `dbl_root_above5`, `dbl_fifth` — all present in the table, none missing. File-level JSDoc, group counts, and the Group 5 removal note are all accurate. Nothing left to do here.
- **Prompt 7 — implemented, with one correction to the plan's own snippet.** The plan's snippet read `currentChord.alsoKnownAs`, but in `showBreakdownChords()` the regular-chord path dereferences `currentChord.invIndex !== undefined ? currentChord.baseChord : currentChord` into `baseChord` — for an inverted chord, `currentChord` is just a wrapper and does not carry `alsoKnownAs` itself. Implemented as `baseChord.alsoKnownAs` instead, so the alias still renders on inversions. Also added the `Array.isArray` guard to the *slash* family's existing `alsoKnownAs` render (previously assumed a plain string only), per the plan's 9a schema note. `.breakdown-aka` CSS rule added to `components.css` section 15 (Breakdown panel), after `.breakdown-figured`.
- **Prompt 9 — done exactly per the plan's provided text**, no improvisation: Group 3, Group 5, Group 6 voicing-chip entries and the Cluster chords glossary entry all rewritten verbatim from the plan. Confirmed the separate `'Quartal / quintal chords'` glossary entry (chord types, not voicings) was correctly left untouched.
- **Checklist item pre-resolved:** confirmed directly in `pool-chords.js` that `VOICING_GROUPS` has no Group 5 entry at all ("no Intervallic group is rendered") — so the empty group is fully removed from the UI, not just hidden. This answers the checklist line "confirm the empty group is either hidden or removed."

### Open item blocking Prompt 8

`ARCHITECTURE.md`'s `help-content.js` section (§8e in the plan) currently states `controls` has 14 entries and `glossary` has 32. Parsing the actual (now-updated) `help-content.js`, the real counts are **`controls`: 18 entries, `glossary`: 45 entries** — a mismatch that predates this session's edits (Prompt 9 only rewrote entry *bodies*, never added or removed an entry, so this isn't something the rewrite caused). Need to confirm before writing Prompt 8's entry-count table: either (a) `ARCHITECTURE.md`'s 14/32 was already stale before this cleanup and should be corrected to 18/45, or (b) those figures intentionally count a subset (e.g. one section split differently) and I'm comparing the wrong things. Also carrying forward from the last pass: the `pool-chords.js` ARCHITECTURE.md entry currently says `_renderVoicingMulti` renders "six collapsible groups" — now confirmed stale (see above) and should become "five" as part of Prompt 8.

---

## File Map (all files touched)

| File | Layer | What changes |
|---|---|---|
| `js/data/chords.js` | L1 Data | New chord entries promoted from deleted voicings; `alsoKnownAs` fields added to existing entries |
| `js/data/help-content.js` | L1 Data | Remove deleted voicings from Group 3/5/6 chip entries; rewrite Group 5 entry as a note about removal; update Group 6 to surviving 13 entries; update cluster glossary entry |
| `js/engine/voicings.js` | L3 Engine | Remove illegal voicings; fix existence-check bugs in 7 voicings; add `voicingAppliesToChord()` + `VOICING_REQUIREMENTS` table; update group counts in JSDoc/comments |
| `js/ui/pool-chords.js` | L5 UI | Grey out / disable single-select voicing chips that don't apply to the active chord in dict mode and post-answer view; re-sync when the active chord changes |
| `js/app.js` | L7 Boot | When the current dict-mode chord changes and the active single-select voicing is no longer applicable, reset it to `'close'` |
| `css/components.css` | Styling | Add `.voicing-chip-disabled` styling (Prompt 5); add `.breakdown-aka` styling (Prompt 7) |
| `js/breakdown/breakdown-chords.js` | L4 Breakdown | Render `alsoKnownAs` from chord descriptor in the name-header area of the chord breakdown panel |
| `ARCHITECTURE.md` | Docs | Update voicing count (62 → 36); update group tallies; remove deleted helpers; note new `alsoKnownAs` field; document the new per-chord voicing gating feature |

---

## ✅ Prompt 1 — Add new chord entries to `chords.js` — DONE

**File:** `js/data/chords.js`

All entries below have been added. Each was previously only reachable as a voicing and had no existing `chords.js` family entry.

### 1a. Promoted from `rl_alt_c` — ✅ Added to `dominant`

```js
{ name: '7(♭5)(♭9)', symbol: '7b5b9', intervals: [0, 4, 6, 10, 13], family: 'dominant', alsoKnownAs: ['Rootless Altered C'] }
```

### 1b. Promoted from `phrygian` — ✅ Added to `dominant`

```js
{ name: 'Phrygian Dom (1–♭2–5–♭7)', symbol: 'phryg_dom', intervals: [0, 1, 7, 10], family: 'dominant', alsoKnownAs: ['Phrygian Voicing'] }
```

### 1c. Promoted from `cluster_chrom` 5-note case — ✅ Added to `cluster`

```js
{ name: 'Chromatic Cluster (5-note)', symbol: 'clust_chr_5', intervals: [0, 1, 2, 3, 4], family: 'cluster', cluster: true, alsoKnownAs: ['Cluster Chromatic (5-note)'], clustNote: 'Five adjacent semitones — maximum chromatic density (Persichetti/Hindemith)' }
```

### 1d. Promoted from `secundal` / `cluster_diaton` — ✅ Added to `cluster`

```js
{ name: 'Diatonic Cluster (5-note)', symbol: 'clust_diaton_5', intervals: [0, 2, 4, 5, 7], family: 'cluster', cluster: true, alsoKnownAs: ['Secundal', 'Cluster Diatonic'], clustNote: 'Adjacent diatonic steps — softer secundal texture (Persichetti)' }
{ name: 'Diatonic Cluster (4-note)', symbol: 'clust_diaton_4', intervals: [0, 2, 4, 5], family: 'cluster', cluster: true, clustNote: 'Adjacent diatonic steps — softer secundal texture (Persichetti)' }
```

### 1e. Promoted from `cluster_pent` — ✅ Added to `cluster`

```js
{ name: 'Pentatonic Cluster (5-note)', symbol: 'clust_pent_5', intervals: [0, 2, 4, 7, 9], family: 'cluster', cluster: true, alsoKnownAs: ['Cluster Pentatonic'], clustNote: 'Stacked pentatonic steps — open, percussive cluster (McCoy Tyner influence)' }
{ name: 'Pentatonic Cluster (4-note)', symbol: 'clust_pent_4', intervals: [0, 2, 4, 7], family: 'cluster', cluster: true, clustNote: 'Stacked pentatonic steps — open, percussive cluster (McCoy Tyner influence)' }
```

### 1f. Promoted from `cluster_wt` — ✅ Added to `cluster`

```js
{ name: 'Whole-tone Cluster (5-note)', symbol: 'clust_wt_5', intervals: [0, 2, 4, 6, 8], family: 'cluster', cluster: true, alsoKnownAs: ['Cluster Whole-tone'], clustNote: 'Stacked whole tones — whole-tone collection; Debussy/impressionist flavour' }
{ name: 'Whole-tone Cluster (4-note)', symbol: 'clust_wt_4', intervals: [0, 2, 4, 6], family: 'cluster', cluster: true, clustNote: 'Stacked whole tones — whole-tone collection; Debussy/impressionist flavour' }
```

### 1g. `alsoKnownAs` added to existing entries — ✅ Done

| Existing symbol | Added to `alsoKnownAs` | Status |
|---|---|---|
| `qrt5` | `'So What'` | ✅ |
| `qrt4` | `'Quartal (4-note)'` | ✅ |
| `qnt4` | `'Quintal'` | ✅ |
| `7sus4` | `'McCoy Tyner'` | ✅ |
| `clust_chr_4` | `'Cluster Chromatic (4-note)'` | ✅ |
| `7b5b9` *(new, 1a)* | `'Rootless Altered C'` | ✅ |
| `phryg_dom` *(new, 1b)* | `'Phrygian Voicing'` | ✅ |
| `clust_chr_5` *(new, 1c)* | `'Cluster Chromatic (5-note)'` | ✅ |
| `clust_diaton_5` *(new, 1d)* | `'Secundal'`, `'Cluster Diatonic'` | ✅ |
| `clust_pent_5` *(new, 1e)* | `'Cluster Pentatonic'` | ✅ |
| `clust_wt_5` *(new, 1f)* | `'Cluster Whole-tone'` | ✅ |

**Schema note:** `alsoKnownAs` is `string[]` on all standard/quartal/cluster entries. The slash family's existing `alsoKnownAs: string` fields are untouched — the `Array.isArray` guard in `breakdown-chords.js` (Prompt 7) will handle both types.

---

## ✅ Prompt 2 — Delete illegal voicings from `voicings.js` — DONE

**File:** `js/engine/voicings.js`

### 2a. Deleted from `VOICING_MODES`

All of the following have been removed from the `VOICING_MODES` array:

**Group 3 — Shell:**
- `rl_maj7`, `rl_maj7_ext`, `rl_min7`, `rl_dom7`
- `rl_alt_a`, `rl_alt_b`, `rl_alt_c`, `rl_alt_d`, `rl_sharp9`
- `sus_voicing`, `phrygian`
- `sixth_maj`, `sixth_min`, `sixth_nine`, `rl_sixth_nine`
- `tn_dom_3b79`, `tn_min_b3b79`

**Group 5 — Intervallic (all seven, removed entirely):**
- `quartal`, `quintal`, `secundal`, `cluster_chrom`, `cluster_diaton`, `cluster_pent`, `cluster_wt`

**Group 6 — Style:**
- `so_what`, `mccoy_tyner`, `pop_piano`, `gospel`

### 2b. Orphaned `applyVoicing()` cases deleted — ✅ Done

`mccoy_tyner`, `pop_piano`, and `gospel` case blocks removed from the switch dispatcher. All other deleted-voicing cases were already absent.

### 2c. `_stackFourths` and `_stackFifths` deleted — ✅ Done (were already removed; removal notice comment in place)

**Note:** `VOICING_MODES` already reflected the post-cleanup 36-entry state when handed off. The primary work in this session was removing the three orphaned `applyVoicing()` cases and correcting the stale "62 symbols" reference in the `resolveVoicingMode` JSDoc.

---

## ✅ Prompt 3 — Fix existence-check bugs in 7 remaining voicings — DONE

**File:** `js/engine/voicings.js`

The following voicings have a dead `=== undefined` check caused by a `?? fallback` on the line above. This makes the "fall back to close" guard unreachable, meaning the voicing will fabricate a note on chords that legitimately lack that role. Fix each by changing the lookup pattern, not by deleting the voicing.

### Pattern to fix

**Current (broken) pattern:**
```js
const sevI = baseIntervals.find((_, i) => roles[i] === 'seventh') ?? 11;
if (sevI === undefined) return applyVoicing(rootMidi, baseIntervals, 'close');
```
The `?? 11` makes `sevI === undefined` permanently false. The guard never fires.

**Fixed pattern:**
```js
const sevIdx = roles.indexOf('seventh');
if (sevIdx === -1) return applyVoicing(rootMidi, baseIntervals, 'close');
const sevI = baseIntervals[sevIdx];
```

Apply this exact fix to these voicing cases:

1. **`tn_dom_13b7`** — fix the `seventh` existence check
2. **`tn_min_1b3b7`** — fix the `seventh` existence check

### Pattern to fix in doubling voicings

The same dead-check bug applies to `third` and `fifth` role lookups in these 5 cases:

3. **`dbl_root_above5`** — fix `thirdI` and `fifthI` lookups; fall back to `'close'` if either role is absent
4. **`dbl_fifth`** — fix `thirdI` and `fifthI`; fall back to `'close'` if either absent
5. **`oct_bass_triad`** — fix `thirdI` and `fifthI`; fall back to `'close'` if either absent
6. **`open5_triad`** — fix `fifthI`; fall back to `'close'` if absent
7. **`spread_2h`** — fix `fifthI`; fall back to `'close'` if absent

**Verification:** After the fix, every affected voicing must have zero reachable code paths that output a MIDI note whose pitch class is not derivable from `baseIntervals`. Confirm by tracing the case for: a power chord `[0, 7]` (no third), a dim chord `[0, 3, 6]` (altfifth, not fifth), and an augmented chord `[0, 4, 8]` (altfifth, not fifth).

---

## ✅ Prompt 4 — Add a voicing-applicability check (new, Option A foundation) — DONE

**File:** `js/engine/voicings.js`

**Why:** Prompt 3 makes every voicing *safe* on a chord that lacks a required role — it silently falls back to `'close'`. That's necessary but not sufficient for Option A: the UI also needs a way to ask, ahead of time, "does this voicing mean anything for this chord?" so it can grey out the chip instead of letting the user pick it and get a surprise close-position result.

### 4a. Add `VOICING_REQUIREMENTS`

Add a lookup table mapping each voicing symbol that has a real structural requirement to the roles it needs present in `baseIntervals`. Voicings with no entry are treated as universally applicable (Groups 1–2 position voicings, and Group 4 drop voicings — drop voicings degrade to a wide triad spacing, which is a legitimate texture, not a fabrication, so they are intentionally **not** gated).

```js
/**
 * Maps a voicing symbol to the harmonic roles (per _voicingRoles) it requires
 * to be structurally meaningful. Absent from this table = always applicable.
 * Used by voicingAppliesToChord() to drive UI gating (pool-chords.js). This
 * is a UI-honesty layer on top of, not a replacement for, the applyVoicing()
 * fallback-to-close safety net.
 */
const VOICING_REQUIREMENTS = {
  // Doubling group — fixed in Prompt 3, requirements now explicit
  dbl_root_above5: ['third', 'fifth'],
  dbl_fifth:        ['third', 'fifth'],
  oct_bass_triad:   ['third', 'fifth'],
  open5_triad:      ['fifth'],
  spread_2h:        ['fifth'],

  // Tension/shell survivors — fixed in Prompt 3
  tn_dom_13b7:      ['seventh'],
  tn_min_1b3b7:     ['seventh'],

  // Remaining Group 3 Shell/Rootless survivors — audit each surviving case
  // in applyVoicing() and add an entry here if it looks up a 'seventh' (or
  // other) role without a Prompt-3-style guard already covering it.
  // e.g. rl_XXXX: ['seventh'],

  // Remaining Group 6 Style survivors — audit the same way; any voicing
  // whose name/design presumes a 7th (tension-based comping shapes) should
  // list ['seventh'] here.
};
```

**Audit task:** Group 3 and Group 6 both lost several members in Prompt 2, but not all — grep the surviving `case` blocks in `applyVoicing()` for `roles.indexOf('seventh')`, `roles.indexOf('third')`, etc. and add every surviving symbol that has such a check to `VOICING_REQUIREMENTS`.

### 4b. Add `voicingAppliesToChord()`

```js
/**
 * Returns true if `symbol` is structurally meaningful for a chord with the
 * given baseIntervals — i.e. every role it requires (per VOICING_REQUIREMENTS)
 * is actually present. Symbols with no requirements entry are always
 * applicable. Used by pool-chords.js to grey out chips in dict mode and the
 * post-answer single-select voicing panel.
 */
export function voicingAppliesToChord(symbol, baseIntervals) {
  const required = VOICING_REQUIREMENTS[symbol];
  if (!required || required.length === 0) return true;
  const roles = _voicingRoles(baseIntervals);
  return required.every(role => roles.includes(role));
}
```

Export this alongside `applyVoicing` and `resolveVoicingMode`.

---

## ✅ Prompt 5 — Gate single-select voicing chips per current chord (new, Option A) — DONE

**Files:** `js/ui/pool-chords.js`, `js/app.js`, `css/components.css`

**Scope:** Applies only to the **single-select** voicing panel (`_renderVoicingSingle`), active in dictionary mode and in the post-answer quiz view. The multi-select pre-answer panel (`_renderVoicingMulti`) is untouched.

### 5a. Grey out inapplicable chips in `_renderVoicingSingle`

**File:** `js/ui/pool-chords.js`

In `_makeVoicingGroupSingle(body, title, items)`, after building each chip, check applicability against the currently active chord's `baseIntervals` via `voicingAppliesToChord(item.symbol, currentBaseIntervals)`:

```js
if (!voicingAppliesToChord(item.symbol, currentBaseIntervals)) {
  chip.classList.add('voicing-chip-disabled');
  chip.setAttribute('aria-disabled', 'true');
  chip.title = 'Not applicable to this chord';
  // Do not wire the click handler that calls recomputeCurrentNotes() for
  // this chip — or wire it to a no-op — so it cannot be selected.
} else {
  // existing click handler wiring, unchanged
}
```

Leave the chip visible (don't remove it from the DOM) — greying preserves the "this exists, but not here" information.

### 5b. Reset the active voicing when the chord changes and it's no longer applicable

**Files:** `js/app.js`, `js/ui/pool-chords.js`

Whenever the dict-mode chord changes (`dictLoadSymbol()`) or the underlying chord is re-rolled with a different `baseIntervals` while `activeVoicingMode` is a concrete (non-`'close'`) single-select voicing, check `voicingAppliesToChord(activeVoicingMode, newBaseIntervals)`. If it returns `false`:

1. Set `activeVoicingMode = 'close'`.
2. Re-voice via `applyVoicing(rootMidi, baseIntervals, 'close')` (happens naturally through `recomputeCurrentNotes()`).
3. Call `_syncVoicingChipActive(body)` so the `close` chip shows as active and the previously-active chip's active class is cleared.

### 5c. Styling

**File:** `css/components.css`

```css
.voicing-chip-disabled {
  opacity: 0.35;
  pointer-events: none;
  cursor: default;
}
```

Place alongside the existing voicing chip styles.

---

## ✅ Prompt 6 — Update `VOICING_MODES` JSDoc and group counts — DONE

**File:** `js/engine/voicings.js`

After Prompts 2 and 3, the voicing table has shrunk. Update all stale documentation inside this file:

1. **File-level JSDoc** (`@description` at top): remove the line `62 voicings across 6 groups`. Replace with the new accurate count and group breakdown.

2. **`VOICING_MODES` JSDoc block**: update the `62 entries across 6 groups` line to the new totals.

3. **`applyVoicing` JSDoc**: update any mention of the deleted voicing names or group memberships.

4. **Group comment headers** inside `VOICING_MODES` (the `// ── Group N …` lines): update Group 3, 5, and 6 counts to match the surviving entries.

5. **Key design patterns note** in the file's architecture comment block: update to reflect the new counts. Group 5 Intervallic is now empty — remove it from the group list entirely, or note it as removed.

6. **Delete the `_stackFourths` and `_stackFifths` JSDoc blocks** alongside the function deletions from Prompt 2c.

7. **Document `VOICING_REQUIREMENTS` and `voicingAppliesToChord()`** (added in Prompt 4) in the same design-patterns note.

**Status:** confirmed already applied in the handed-off file. Audited every guarded `case` against `VOICING_REQUIREMENTS` by hand (see Session notes above) — table is complete, no gaps.

---

## ✅ Prompt 7 — Render `alsoKnownAs` in the chord breakdown panel — DONE

**File:** `js/breakdown/breakdown-chords.js`

Inside `showBreakdownChords()`, in the regular chord path (not `poly`, `ust`, or `slash`), immediately after the `makeNameHeader(panel, ...)` call, add:

```js
// Render "also known as" aliases from deleted voicings
const aka = currentChord.alsoKnownAs;
if (Array.isArray(aka) && aka.length > 0) {
  const akaRow = document.createElement('div');
  akaRow.className = 'breakdown-aka';
  akaRow.textContent = 'Also known as: ' + aka.join(', ');
  panel.appendChild(akaRow);
}
```

Also check whether the `slash` family already renders `alsoKnownAs` (it currently uses the field as a `string`, not `string[]`) — the slash path may need updating to handle both types gracefully (`Array.isArray` guard).

### Styling

Add a CSS rule for `.breakdown-aka` in `components.css`:

```css
.breakdown-aka {
  font-size: 0.85em;
  color: var(--text-muted);
  padding: 2px 0 6px 0;
}
```

**Status:** implemented in both files, with one correction to the snippet above: read `baseChord.alsoKnownAs`, not `currentChord.alsoKnownAs` — `currentChord` is an inversion wrapper (`{ invIndex, baseChord, ... }`) when `invIndex !== undefined`, and only `baseChord` reliably carries the field. Also added the `Array.isArray` guard to the existing slash-family `alsoKnownAs` render, per the check called out above.

---

## ⬜ Prompt 8 — Update `ARCHITECTURE.md`

**File:** `ARCHITECTURE.md`

Do this last, once all code changes have shipped, so counts are accurate.

### 8a. `js/engine/voicings.js` section

- Update the role description: "62 voicings across 6 groups" → 36 voicings across 5 active groups
- Update the size estimate (line count has shrunk)
- Remove `_stackFourths` and `_stackFifths` from the internal helpers table — they no longer exist
- Update the key design patterns bullet: replace the old group-by-group count (Group 1: 3, Group 2: 4, Group 3: 27, Group 4: 4, Group 5: 7, Group 6: 17) with the new counts (Group 1: 3, Group 2: 4, Group 3: 12, Group 4: 4, Group 5: removed, Group 6: 13, Total: 36)
- Remove the "Intervallic voicing design (Group 5)" design pattern bullet entirely — the group is gone
- Add `VOICING_REQUIREMENTS` and `voicingAppliesToChord()` to the public API table (Prompt 4)
- Add a design pattern bullet explaining the `VOICING_REQUIREMENTS` / `voicingAppliesToChord()` UI-gating layer

### 8b. `js/data/chords.js` section

- Update the family count table:
  - `dominant`: 23 → 25 (added `7b5b9`, `phryg_dom`)
  - `cluster`: 4 → 10 (added `clust_chr_5`, `clust_diaton_5`, `clust_diaton_4`, `clust_pent_5`, `clust_pent_4`, `clust_wt_5`, `clust_wt_4`; note: `clust_chr_4` was already counted, only 6 are new)
  - `quartal`: entry count unchanged, but note `alsoKnownAs` is now present on `qrt4`, `qrt5`, `qnt4`
- Update the schema field reference table: the `alsoKnownAs` row currently reads `string | slash (some)`. Update to:

  | Field | Type | Present on | Description |
  |---|---|---|---|
  | `alsoKnownAs` | `string[]` | quartal (some), cluster (some), dominant (some) | Voicing or cultural names that collapse to this chord identity. Rendered in the breakdown panel beneath the chord name. |
  | `alsoKnownAs` | `string` | slash (some) | Equivalent standard chord symbol where the slash voicing has a common tertian reading. |

  If the table can't hold two rows for the same field name, add a note in the description: "Type is `string[]` on standard/quartal/cluster entries; legacy `string` on slash entries (handled by `Array.isArray` guard in `breakdown-chords.js`)."

### 8c. `js/breakdown/breakdown-chords.js` section

- Note that `showBreakdownChords()` now renders an `alsoKnownAs` row beneath the chord name when the chord descriptor carries the field.
- Note the `Array.isArray` guard that handles both `string` (slash legacy) and `string[]` (all other families).

### 8d. `js/ui/pool-chords.js` section

- Document the per-chord voicing gating added in Prompt 5: `_makeVoicingGroupSingle` now checks `voicingAppliesToChord()` and adds `.voicing-chip-disabled` to chips that don't apply to the active chord.
- Note this applies to dict mode and post-answer only; the pre-answer multi-select panel is explicitly out of scope.

### 8e. `js/app.js` section

- Note the new behaviour in `dictLoadSymbol()` and related chord-change paths: if `activeVoicingMode` is no longer applicable to the new chord (per `voicingAppliesToChord()`), it resets to `'close'` and re-syncs the chip UI.

---

## ✅ Prompt 9 — Update `help-content.js` — DONE

**File:** `js/data/help-content.js`

**Why:** The help file has three voicing-chip entries and one glossary entry that are out of sync with the cleaned-up voicing table. A user who opens Help after the cleanup would find references to voicing groups and chip names that no longer exist in the UI.

**Status:** all four rewrites (9a–9d) applied verbatim from the text below. `'Quartal / quintal chords'` confirmed untouched, as instructed. Deviation logged: the entry-count reconciliation in 9e is on hold — see "Open item blocking Prompt 8" in Session notes above.

**Do not touch:** the quartal/quintal chord types glossary entry (term: `'Quartal / quintal chords'`) — it describes chord family entries, which are unchanged or expanded. The distinction between quartal *chord types* and quartal *voicings* is now more correct, not less.

### 9a. Rewrite the Group 3: Shell / Rootless entry

**Current term:** `'Voicing chips — Group 3: Shell / Rootless'`

The current body lists 16 deleted voicings (all four Rootless forms, all four Altered variants, Rootless ♯9, Sus Voicing, Phrygian Voicing, Major 6, Minor 6, 6/9, Rootless 6/9) alongside the 12 surviving ones. Replace the body to list only the 12 survivors:

```
Economical jazz voicings that use a subset of chord tones — the most harmonically defining ones.

• Shell — root + 3rd + 7th. The 3rd defines major/minor quality; the 7th defines dominant/major/minor character. These two tones together are called guide tones.
• Shell Alt — root + 7th + 3rd. Same tones as Shell, 7th voiced below the 3rd.
• Rootless Shell — 3rd + 7th only. Works when a bass player holds the root.

Three-note voicings (Levine):
• Three-note Maj 1–3–5, 3–5–7, 1–3–7 — major chord subsets
• Three-note Dom 1–3–♭7, 3–5–♭7, 3–♭7–9 — dominant chord subsets
• Three-note Min 1–♭3–♭7, ♭3–5–♭7, ♭3–♭7–9 — minor chord subsets

All shell and three-note voicings fall back to Close position on chords that lack the required tones (e.g. a triad has no 7th, so Shell plays as Close).
```

### 9b. Rewrite the Group 5: Intervallic entry

**Current term:** `'Voicing chips — Group 5: Intervallic'`

Group 5 no longer exists as a voicing group. The chip panel section is gone. The entry should be replaced with a note that explains where the sounds went, so users who remember the old behaviour understand the change:

```
Group 5 (Intervallic) has been removed from the voicing pool.

The seven voicings in this group (Quartal, Quintal, Secundal, Cluster Chromatic, Cluster Diatonic, Cluster Pentatonic, Cluster Whole-tone) stacked intervals freely and produced notes outside the current chord by design. This violated the app's rule that all voiced notes must be derivable from the chord's interval structure.

The characteristic pitch structures of these voicings have been promoted to dedicated chord types in the Cluster and Quartal / Quintal families of the chord pool, where they can be practised properly. Look for them in the Chords mode pool under Cluster and Quartal / Quintal.
```

### 9c. Rewrite the Group 6: Style entry

**Current term:** `'Voicing chips — Group 6: Style'`

The current body lists 17 entries, 4 of which have been deleted (So What, McCoy Tyner, Pop Piano, Gospel). Replace the body to list only the 13 survivors, in their existing order:

```
Named voicing styles associated with specific pianists or arranging traditions.

• Bill Evans A — 3–5–7–9 in left-hand register. Rootless Form A (The Jazz Piano Book).
• Bill Evans B — 7–9–3–5. Rootless Form B, inversion of Form A.
• Kenny Barron — LH: root + 7th. RH: 3rd + 5th + 9th. Signature two-hand spread.
• Octave Bass + Triad — LH: root octave. RH: triad only. Pop/R&B keyboard staple.
• Octave Bass + 7th — LH: root octave. RH: full seventh chord close.
• Open Fifth + Triad — LH: root + 5th (power chord). RH: triad. Open, contemporary sound.
• Block Chord Close — melody on top, close-position chord tones harmonised below.
• Locked Hands — melody doubled one octave lower, inner chord tones between (Milt Buckner style).
• Four-way Close — four voices in close position, melody on top.
• Block Drop-2 — Drop-2 applied to a harmonised melody.
• Octave Melody + Inner — melody doubled at the octave; chord tones fill the space between.
• Pedal Point — root held as a sustained bass note; upper voices voiced close above.
• Two-handed Spread — LH: root + 5th wide apart. RH: upper extensions close. Broader than Spread.

Bill Evans A/B, Kenny Barron, and Two-handed Spread require a 7th — they fall back to Close position on triads and other chords without a 7th.
```

### 9d. Update the Cluster chords glossary entry

**Current term:** `'Cluster chords (secundal harmony)'`

The current body says the pool contains "Three types": M2/m2 3-note and mixed 4-note. The pool now has 10 cluster chord types. Update the "Three types appear in the chord pool" paragraph:

Replace:
```
Three types appear in the chord pool:
• Major-second cluster (M2 + M2) — mild, Impressionistic; suggests whole-tone scale
• Minor-second cluster (m2 + m2) — intensely dissonant; percussive noise mass
• Mixed cluster (m2 + M2 mix) — intermediate density; complex internal structure
```

With:
```
Ten types appear in the chord pool, across four interval flavours and multiple note counts:

• Major-second cluster, 3-note (M2 + M2) — mild, Impressionistic; suggests whole-tone scale
• Minor-second cluster, 3-note (m2 + m2) — intensely dissonant; percussive noise mass
• Mixed cluster, 4-note (m2 + M2 mix) — intermediate density; complex internal structure
• Chromatic cluster, 4-note and 5-note — stacked semitones; maximum chromatic density (Henry Cowell / Bartók)
• Diatonic cluster, 4-note and 5-note — adjacent diatonic scale steps; softer, more organic texture (Persichetti)
• Pentatonic cluster, 4-note and 5-note — stacked pentatonic steps; open, percussive; McCoy Tyner influence
• Whole-tone cluster, 4-note and 5-note — stacked whole tones; Impressionist / Debussy flavour
```

Also update the closing note at the end of the entry. Replace:
```
Note: Cluster chords in the pool are distinct from Cluster voicings — the voicings apply a cluster spacing to any chord; the cluster chord family uses clusters as the chord's fundamental structure.
```

With:
```
Note: Cluster chord types in the pool are distinct from what were formerly Cluster voicings. The old voicings (Cluster Chromatic, Cluster Diatonic, Cluster Pentatonic, Cluster Whole-tone) applied a cluster spacing to any chord and produced notes outside it. They have been removed from the voicing pool and promoted to dedicated chord types here, where the cluster structure is the chord itself.
```

### 9e. Update the ARCHITECTURE.md entry for help-content.js

*(Do this as part of Prompt 8, not separately — it is listed here for completeness.)*

In the ARCHITECTURE.md section for `js/data/help-content.js`, update the entry count table:

| § | id | Title | Entry count |
|---|---|---|---|
| 3 | `controls` | Controls & Settings | 14 (voicing Groups 3, 5, 6 rewritten; count unchanged) |
| 5 | `glossary` | Music Theory Glossary | 32 (cluster entry updated; count unchanged) |

Note that the entry count stays the same — entries are rewritten, not added or removed.

---

## Checklist (run after all prompts complete)

- [ ] `VOICING_MODES.length` matches the new count (verify in browser console or test)
- [ ] `CONCRETE_VOICING_SYMBOLS` (derived from `VOICING_MODES`) contains no deleted symbols
- [ ] `applyVoicing()` has no `case` for any deleted symbol
- [ ] `_stackFourths` and `_stackFifths` do not appear anywhere in `voicings.js`
- [ ] Every fixed voicing (`tn_dom_13b7`, `tn_min_1b3b7`, `dbl_root_above5`, `dbl_fifth`, `oct_bass_triad`, `open5_triad`, `spread_2h`) returns `applyVoicing(rootMidi, baseIntervals, 'close')` for chords missing the required role — trace with power `[0,7]`, dim `[0,3,6]`, aug `[0,4,8]`
- [ ] `chords.js` contains all 11+ new entries from Prompt 1
- [ ] Every new entry has a valid `symbol` (ASCII-only, globally unique — grep for duplicates)
- [ ] `alsoKnownAs` is present on all entries listed in step 1g
- [ ] Slash family's existing `alsoKnownAs` (string) still renders correctly with the new `Array.isArray` guard in `breakdown-chords.js`
- [ ] Breakdown panel renders "Also known as: So What" when `qrt5` is the active chord
- [ ] `ARCHITECTURE.md` voicing count matches `VOICING_MODES.length`
- [ ] `defaults.js` — if `selectedVoicings` or any default voicing list mentions a deleted symbol by name, update it
- [ ] `pool-chords.js` — if it renders voicing chips from `VOICING_MODES` groups by name (Group 5 Intervallic), confirm the empty group is either hidden or removed from the UI
- [ ] `tests/voicings.test.js` — remove any test cases for deleted voicing symbols; add tests for the 7 fixed voicings using the three edge-case chords above
- [ ] `VOICING_REQUIREMENTS` covers every surviving Group 3 and Group 6 symbol whose `applyVoicing()` case checks a role before using it (audit per Prompt 4) — no silent gaps
- [ ] `voicingAppliesToChord()` returns `false` for `dbl_root_above5` / `dbl_fifth` / `oct_bass_triad` on `[0, 7]` (no third), `false` for `open5_triad` / `spread_2h` on chords with only `altfifth` (dim/aug), and `true` for all of them on a plain major triad `[0, 4, 7]`
- [ ] Dict mode: selecting a triad greys out every chip whose symbol is in `VOICING_REQUIREMENTS` with an unmet role; selecting a dominant 7th un-greys the `seventh`-requiring chips
- [ ] Dict mode: with a `seventh`-requiring voicing active, switching to a triad resets `activeVoicingMode` to `'close'` and visually re-syncs the active chip (Prompt 5b)
- [ ] Post-answer quiz view: same gating and reset behavior as dict mode, confirmed for at least one chord-family switch across a Next click
- [ ] `.voicing-chip-disabled` chips are not clickable (verify `pointer-events: none` takes effect, not just the visual dimming)
- [ ] Quiz pre-answer multi-select panel is **unchanged** — no greying, no gating; confirm this is intentional, not a missed spot (cross-check against "Deferred: Option 2" below)
- [ ] Help: open the voicing panel in the UI and verify every chip name in Groups 3 and 6 has a matching entry in the help text; confirm Group 5 section explains the removal rather than listing non-existent chips
- [ ] Help: open the Cluster chords glossary entry and verify the type count matches what is actually in the chord pool

---

## Deferred: Option 2 — chord-aware voicing resolution in quiz pre-answer mode

Not part of this plan. Recorded here so it isn't lost and isn't accidentally conflated with Prompt 5's scope.

**The idea:** go beyond graying chips and make `resolveVoicingMode()` itself chord-aware — i.e. pick the question's chord first, then filter `selectedVoicings` down to the subset that's applicable via `voicingAppliesToChord()` before randomly resolving one, rather than picking a voicing blind and relying on `applyVoicing()`'s fallback.

**Why it's bigger than it looks:**
- `resolveVoicingMode()` currently has signature `() → string` and is called independently of chord selection in `generateChordQuestion()`. Making it chord-aware means reordering question generation (chord first, voicing second) and changing the function's signature to `resolveVoicingMode(baseIntervals)` — a call-site change in `chords-mode.js`.
- It changes what "a chip is selected" *means* in the multi-select pool panel: a voicing could be checked but structurally never fire for large parts of the active chord-quality pool. Chip-group count displays (`_updateSectionCount`) would need to either stay literal ("N selected") or become conditional ("N selected, M reachable") — a UX decision of its own.
- It touches Basic/Advanced scoping logic in `resolveVoicingMode()`, which currently reasons about groups, not individual chord compatibility.

**Recommendation:** treat as its own plan once Prompts 1–9 above have shipped and the `VOICING_REQUIREMENTS` table (Prompt 4) has been audited and stabilized — that table is exactly the input Option 2 would need, so this cleanup is a prerequisite rather than unrelated work.
