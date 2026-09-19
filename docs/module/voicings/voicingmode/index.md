---
title: VoicingMode
kind: typedef
longname: module:voicings~VoicingMode
description: Complete catalogue of all voicing modes available in the app. 62 entries across 6 groups. Each entry:
---

# VoicingMode

<SourceLink href="/source/engine/voicings-js/#L43" label="voicings.js:43" />

Complete catalogue of all voicing modes available in the app. 62 entries across 6 groups.

Each entry:

**Properties**

- `group` (string) — Group key: `'position'` | `'doubling'` | `'shell'` | `'drop'` | `'intervallic'` | `'style'`
- `name` (string) — Human-readable display name shown in UI chips.
- `symbol` (string) — Unique identifier used as the key throughout the app. Never `'random'` — that is a UI meta-value only.
- `desc` (string) — One-line description shown in chip tooltips.

**Type**

`Object`
