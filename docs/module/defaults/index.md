---
title: Defaults
kind: module
longname: module:Defaults
description: "Initialises the four pool-selection Sets that define which items are active in the quiz at startup. Separated from state.js because these constants depend on data-layer globals (INTERVALS, PROGRESSIONS) that are not available until the data layer has fully loaded. Load order: must follow intervals.js and progressions.js; must precede any file that reads selectedChords, selectedIntervals, selectedScales, or selectedProgressions."
---

# Defaults

<SourceLink href="/source/engine/defaults-js/#L18" label="defaults.js:18" />

Initialises the four pool-selection Sets that define which items are active in the quiz at startup. Separated from state.js because these constants depend on data-layer globals (INTERVALS, PROGRESSIONS) that are not available until the data layer has fully loaded.

Load order: must follow intervals.js and progressions.js; must precede any file that reads selectedChords, selectedIntervals, selectedScales, or selectedProgressions.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Other

<MemberHeading id="selectedchords" depth="3" name="selectedChords" sig="selectedChords: Set.<string>" />

<MemberMeta sourceHref="/source/engine/defaults-js/#L27" sourceLabel="defaults.js:27" />

The set of chord symbols active in the quiz pool at startup. Hard-coded to the Basic mode curated selection: major and minor triads and 7ths, dominant 7th, diminished family, augmented triad, sus2, sus4, and power chord. Modified at runtime by the pool panel chip toggles and the Basic / Advanced difficulty switch.

<MemberHeading id="selectedintervals" depth="3" name="selectedIntervals" sig="selectedIntervals: Set.<string>" />

<MemberMeta sourceHref="/source/engine/defaults-js/#L44" sourceLabel="defaults.js:44" />

The set of interval symbols active in the quiz pool at startup. Derived from INTERVALS by filtering out compound intervals, so the default pool contains all 12 simple intervals (m2–P8). Modified at runtime by the pool panel chip toggles and the Basic / Advanced difficulty switch.

<MemberHeading id="selectedscales" depth="3" name="selectedScales" sig="selectedScales: Set.<string>" />

<MemberMeta sourceHref="/source/engine/defaults-js/#L56" sourceLabel="defaults.js:56" />

The set of scale symbols active in the quiz pool at startup. Hard-coded to the Basic mode curated selection: Major Pentatonic, Minor Pentatonic, Major, and Natural Minor. Modified at runtime by the pool panel chip toggles and the Basic / Advanced difficulty switch.

<MemberHeading id="selectedprogressions" depth="3" name="selectedProgressions" sig="selectedProgressions: Set.<string>" />

<MemberMeta sourceHref="/source/engine/defaults-js/#L70" sourceLabel="defaults.js:70" />

The set of progression symbols active in the quiz pool at startup. Derived from PROGRESSIONS by filtering to entries flagged basic: true, so the default pool always reflects the canonical Basic set without manual maintenance. Modified at runtime by the pool panel chip toggles and the Basic / Advanced difficulty switch.
