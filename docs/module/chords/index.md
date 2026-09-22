---
title: chords
kind: module
longname: module:chords
description: Chord type library for The Sound Travels Ear Training — defines all playable chord families, their interval structures, and playback style options.
---

# chords

<SourceLink href="/source/data/chords-js/#L12" label="chords.js:12" />

Chord type library for The Sound Travels Ear Training — defines all playable chord families, their interval structures, and playback style options.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Other

<MemberHeading id="chordtypes" depth="3" name="CHORD_TYPES" sig="CHORD_TYPES: Object.<string, Array.<Object>>" />

<MemberMeta sourceHref="/source/data/chords-js/#L35" sourceLabel="chords.js:35" />

Complete chord type library, keyed by family name. Each family is an array of chord descriptor objects.

<MemberHeading id="chordplaybackstyles" depth="3" name="CHORD_PLAYBACK_STYLES" sig="CHORD_PLAYBACK_STYLES: Array.<{name: string, symbol: string}>" />

<MemberMeta sourceHref="/source/data/chords-js/#L372" sourceLabel="chords.js:372" />

Available playback styles for chord questions. Controls the order in which notes are sounded during playback.

**Properties**

- `name` (string) — Display label shown in the UI.
- `symbol` (string) — Internal key used in state and mode logic.
