---
title: stats
kind: module
longname: module:stats
description: "UI reset and score display helpers for The Sound Travels Ear Training. Handles between-question UI teardown and the score bar update. Note that the heavier session tracking logic — resetSession() , recordAnswer() , renderStats() , and updateRootBadge() — lives in helpers.js (Layer 3), where it was built alongside the pool and session state it depends on. Responsibilities: resetQuizUI() — clears all per-question UI state before a new question updateScore() — writes correct / total / streak counters to the DOM Dependencies (globals from earlier layers): answered , resolutionActive , resolutionRootMidi , dictInversionIndex , teardownProgressionUI , hideBreakdown Load order: after pool.js , before chords-mode.js ."
---

# stats

<SourceLink href="/source/ui/stats-js/#L25" label="stats.js:25" />

UI reset and score display helpers for The Sound Travels Ear Training. Handles between-question UI teardown and the score bar update. Note that the heavier session tracking logic — `resetSession()`, `recordAnswer()`, `renderStats()`, and `updateRootBadge()` — lives in `helpers.js` (Layer 3), where it was built alongside the pool and session state it depends on.

Responsibilities:

- `resetQuizUI()` — clears all per-question UI state before a new question
- `updateScore()` — writes correct / total / streak counters to the DOM

Dependencies (globals from earlier layers): `answered`, `resolutionActive`, `resolutionRootMidi`, `dictInversionIndex`, `teardownProgressionUI`, `hideBreakdown`

Load order: after `pool.js`, before `chords-mode.js`.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Methods

<MemberHeading id="resetquizui" depth="3" name="resetQuizUI" sig="resetQuizUI(): void" />

<MemberMeta sourceHref="/source/ui/stats-js/#L37" sourceLabel="stats.js:37" />

Resets all per-question UI state in preparation for a new question. Called at the start of every `generateQuestion()` cycle and on session reset.

Clears: the `answered` flag, resolution state, inversion index, notation panels, status message, answer dropdown, and the breakdown panel. Also calls `teardownProgressionUI()` to remove any progression-specific DOM residue.

**Returns**

- `void`

<MemberHeading id="updatescore" depth="3" name="updateScore" sig="updateScore(): void" />

<MemberMeta sourceHref="/source/ui/stats-js/#L63" sourceLabel="stats.js:63" />

Writes the current session counters to the score bar DOM elements. Called after every answer is recorded.

Reads the global variables `correct`, `total`, and `streak` from `state.js` and pushes them to `#correct`, `#total`, and `#streak` respectively.

**Returns**

- `void`
