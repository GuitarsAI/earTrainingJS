---
title: VoicingMode
kind: typedef
longname: module:voicings~VoicingMode
description: Complete catalogue of all voicing modes available in the app. 36 entries across 5 active groups (Group 5 Intervallic removed). Each entry:
---

# VoicingMode

<SourceLink href="/source/engine/voicings-js/#L78" label="voicings.js:78" />

Complete catalogue of all voicing modes available in the app. 36 entries across 5 active groups (Group 5 Intervallic removed).

Each entry:

**Properties**

- `group` (string) — Group key: `'position'` | `'doubling'` | `'shell'` | `'drop'` | `'style'`
- `name` (string) — Human-readable display name shown in UI chips.
- `symbol` (string) — Unique identifier used as the key throughout the app. Never `'random'` — that is a UI meta-value only.
- `desc` (string) — One-line description shown in chip tooltips.

**Type**

`Object`
