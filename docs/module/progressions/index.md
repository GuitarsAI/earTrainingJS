---
title: progressions
kind: module
longname: module:progressions
description: Chord progression library, answer UI lookup tables, pool panel configuration, and progression-specific runtime state for The Sound Travels Ear Training. Organised into 13 stylistic groups ranging from cadences and classical sequences to jazz, blues, rock, reggae, and extended forms.
---

# progressions

<SourceLink href="/source/data/progressions-js/#L14" label="progressions.js:14" />

Chord progression library, answer UI lookup tables, pool panel configuration, and progression-specific runtime state for The Sound Travels Ear Training. Organised into 13 stylistic groups ranging from cadences and classical sequences to jazz, blues, rock, reggae, and extended forms.

- **License:** MIT
- **Copyright:** The Sound Travels 2026
- **Author:** Renato Fera P.

---

## Instance Fields

<MemberHeading id="currentprogression" depth="3" name="currentProgression" sig="currentProgression: Object | null" />

<MemberMeta sourceHref="/source/data/progressions-js/#L372" sourceLabel="progressions.js:372" />

The PROGRESSIONS entry for the current question.

<MemberHeading id="currentprogrootmidi" depth="3" name="currentProgRootMidi" sig="currentProgRootMidi: number" />

<MemberMeta sourceHref="/source/data/progressions-js/#L375" sourceLabel="progressions.js:375" />

MIDI note number of the tonic for the current question (default middle C = 60).

<MemberHeading id="currentprogrootpc" depth="3" name="currentProgRootPc" sig="currentProgRootPc: number" />

<MemberMeta sourceHref="/source/data/progressions-js/#L378" sourceLabel="progressions.js:378" />

Pitch class of the tonic for the current question (0–11).

<MemberHeading id="progslotanswers" depth="3" name="progSlotAnswers" sig="progSlotAnswers: Array.<{degreeIdx: (number|null), qualityIdx: (number|null)}>" />

<MemberMeta sourceHref="/source/data/progressions-js/#L387" sourceLabel="progressions.js:387" />

Per-slot answer state for the current question. One entry per chord in the progression; each tracks the user's selected degree and quality indices into PROG\_DEGREES and PROG\_QUALITIES.

<MemberHeading id="proganswered" depth="3" name="progAnswered" sig="progAnswered: boolean" />

<MemberMeta sourceHref="/source/data/progressions-js/#L390" sourceLabel="progressions.js:390" />

Whether the current progression question has been submitted.

## Other

<MemberHeading id="progressions" depth="3" name="PROGRESSIONS" sig="PROGRESSIONS" />

<MemberMeta sourceHref="/source/data/progressions-js/#L50" sourceLabel="progressions.js:50" />

Master list of all chord progressions available in the app. Grouped by style: Cadences, Diminished, Classical, Short, Pop & Rock, Jazz, Blues, Minor, Rock, Reggae, Samba & Bossa, Metal, Extended.

<MemberHeading id="progdegrees" depth="3" name="PROG_DEGREES" sig="PROG_DEGREES: Array.<{label: string, semi: number}>" />

<MemberMeta sourceHref="/source/data/progressions-js/#L300" sourceLabel="progressions.js:300" />

Scale degree labels for the progression answer UI. Covers all diatonic degrees plus common chromatic borrows (♭II, ♭III, ♭VI, ♭VII, ♯IV). Each entry maps a Roman numeral label to its semitone offset above the tonic.

<MemberHeading id="progqualities" depth="3" name="PROG_QUALITIES" sig="PROG_QUALITIES: Array.<{label: string, sym: string}>" />

<MemberMeta sourceHref="/source/data/progressions-js/#L322" sourceLabel="progressions.js:322" />

Chord quality options for the progression answer UI. Covers triads and basic 7th chords used across all progression groups. `label` is the display string; `sym` matches the `qualities` values in PROGRESSIONS.

<MemberHeading id="proggroups" depth="3" name="PROG_GROUPS" sig="PROG_GROUPS: Array.<string>" />

<MemberMeta sourceHref="/source/data/progressions-js/#L340" sourceLabel="progressions.js:340" />

Canonical display order of progression groups in the pool panel.

<MemberHeading id="proggroupcollapsed" depth="3" name="PROG_GROUP_COLLAPSED" sig="PROG_GROUP_COLLAPSED: Object.<string, boolean>" />

<MemberMeta sourceHref="/source/data/progressions-js/#L351" sourceLabel="progressions.js:351" />

Default collapsed state for each group in the pool panel. Only Cadences is expanded on load; all other groups start collapsed.
