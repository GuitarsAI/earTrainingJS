---
title: HelpContent
kind: module
longname: module:HelpContent
description: "Single source of truth for all in-app Help text. Contains no DOM references or rendering logic — content only. Consumed by help-mode.js. Data structure: HELP_SECTIONS — top-level array of section objects Each section: { id: string, title: string, entries: Entry[] } Each entry: { term: string, body: string } body is plain text; \\n renders as a paragraph break."
---

# HelpContent

<SourceLink href="/source/data/help-content-js/#L18" label="help-content.js:18" />

Single source of truth for all in-app Help text. Contains no DOM references or rendering logic — content only. Consumed by help-mode.js.

Data structure: HELP\_SECTIONS — top-level array of section objects Each section: { id: string, title: string, entries: Entry\[] } Each entry: { term: string, body: string } body is plain text; \n renders as a paragraph break.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.
