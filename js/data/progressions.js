/**
 * @file progressions.js
 * @description Chord progression library, answer UI lookup tables, pool panel
 * configuration, and progression-specific runtime state for The Sound Travels
 * Ear Training. Organised into 13 stylistic groups ranging from cadences and
 * classical sequences to jazz, blues, rock, reggae, and extended forms.
 *
 * @module progressions
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// =============================================================================
// PROGRESSIONS — Schema
//
// Each entry in PROGRESSIONS is an object with the following fields:
//
//   symbol    {string}   — Unique identifier used in state, stats, and pool logic.
//                          Uses Roman numeral notation with ASCII-safe characters
//                          (e.g. 'ii-V-I', 'I-vi-IV-V'). Suffixes like '-reg',
//                          '-met', '-bossa' disambiguate entries that share the
//                          same Roman numeral sequence across different groups.
//   name      {string}   — Display label shown in the pool panel and breakdown.
//   group     {string}   — Stylistic group. Must match a value in PROG_GROUPS.
//   basic     {boolean}  — Optional. When true, the progression appears in Basic
//                          difficulty mode. Omitted (falsy) for Advanced-only entries.
//   degrees   {number[]} — Semitone offset of each chord's root above the tonic
//                          (0–11). Length equals the number of chords in the
//                          progression. Degree 0 = tonic, 7 = dominant, etc.
//   qualities {string[]} — Quality symbol for each chord, parallel to degrees[].
//                          Values match symbols in PROG_QUALITIES: 'maj', 'm', '7',
//                          'maj7', 'm7', 'dim', 'm7b5', 'o7', 'aug', 'sus4'.
// =============================================================================

/**
 * Master list of all chord progressions available in the app.
 * Grouped by style: Cadences, Diminished, Classical, Short, Pop & Rock, Jazz,
 * Blues, Minor, Rock, Reggae, Samba & Bossa, Metal, Extended.
 *
 * @type {Array<{
 *   symbol: string,
 *   name: string,
 *   group: string,
 *   basic?: boolean,
 *   degrees: number[],
 *   qualities: string[]
 * }>}
 */
const PROGRESSIONS = [
  // ── Cadences (2 chords) ──────────────────────────────────────────────────
  { symbol: 'V-I',         name: 'Perfect Authentic',          group: 'Cadences', basic: true,
    degrees: [7, 0],     qualities: ['maj', 'maj'] },
  { symbol: 'V7-I',        name: 'Perfect Authentic (dom7)',    group: 'Cadences', basic: true,
    degrees: [7, 0],     qualities: ['7', 'maj'] },
  { symbol: 'IV-I',        name: 'Plagal',                      group: 'Cadences', basic: true,
    degrees: [5, 0],     qualities: ['maj', 'maj'] },
  { symbol: 'I-V',         name: 'Half Cadence',                group: 'Cadences', basic: true,
    degrees: [0, 7],     qualities: ['maj', 'maj'] },
  { symbol: 'ii-V',        name: 'Half Cadence (jazz)',          group: 'Cadences',
    degrees: [2, 7],     qualities: ['m', 'maj'] },
  { symbol: 'IV-V',        name: 'Half Cadence (rock/pop)',      group: 'Cadences',
    degrees: [5, 7],     qualities: ['maj', 'maj'] },
  { symbol: 'vi-V',        name: 'Half Cadence (minor)',         group: 'Cadences',
    degrees: [9, 7],     qualities: ['m', 'maj'] },
  { symbol: 'V-vi',        name: 'Deceptive',                    group: 'Cadences',
    degrees: [7, 9],     qualities: ['maj', 'm'] },
  { symbol: 'V7-vi',       name: 'Deceptive (dom7)',             group: 'Cadences',
    degrees: [7, 9],     qualities: ['7', 'm'] },
  { symbol: 'iv-V',        name: 'Phrygian Half Cadence',        group: 'Cadences',
    degrees: [5, 7],     qualities: ['m', 'maj'] },

  // ── Diminished & half-dim resolutions (2 chords) ─────────────────────────
  { symbol: 'vii°-I',      name: 'Leading tone resolution',      group: 'Diminished',
    degrees: [11, 0],    qualities: ['dim', 'maj'] },
  { symbol: 'vii°7-I',     name: 'Fully dim → major tonic',      group: 'Diminished',
    degrees: [11, 0],    qualities: ['o7', 'maj'] },
  { symbol: 'vii°7-i',     name: 'Fully dim → minor tonic',      group: 'Diminished',
    degrees: [11, 0],    qualities: ['o7', 'm'] },
  { symbol: 'iiø7-V',      name: 'Half-dim → dominant',          group: 'Diminished',
    degrees: [2, 7],     qualities: ['m7b5', 'maj'] },
  { symbol: 'iiø7-V7',     name: 'Jazz minor ii–V',              group: 'Diminished',
    degrees: [2, 7],     qualities: ['m7b5', '7'] },
  { symbol: 'iiø7-i',      name: 'Half-dim direct resolution',   group: 'Diminished',
    degrees: [2, 0],     qualities: ['m7b5', 'm'] },
  { symbol: '#iv°-V',      name: 'Chromatic dim approach',        group: 'Diminished',
    degrees: [6, 7],     qualities: ['dim', 'maj'] },

  // ── Classical (3–6 chords) ────────────────────────────────────────────────
  { symbol: 'I-V-I',       name: 'Basic tonic–dominant',         group: 'Classical',
    degrees: [0, 7, 0],  qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-IV-V-I',    name: 'Four-chord cadence',           group: 'Classical', basic: true,
    degrees: [0, 5, 7, 0],   qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-ii-V-I',    name: 'Supertonic cadence',           group: 'Classical',
    degrees: [0, 2, 7, 0],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-vi-ii-V-I', name: 'Circle of fifths (5 chords)',  group: 'Classical',
    degrees: [0, 9, 2, 7, 0],    qualities: ['maj', 'm', 'm', 'maj', 'maj'] },
  { symbol: 'iii-vi-ii-V-I', name: 'Circle of fifths (extended)', group: 'Classical',
    degrees: [4, 9, 2, 7, 0],    qualities: ['m', 'm', 'm', 'maj', 'maj'] },
  { symbol: 'vi-ii-V-I',   name: 'Circle of fifths (short)',     group: 'Classical',
    degrees: [9, 2, 7, 0],   qualities: ['m', 'm', 'maj', 'maj'] },
  { symbol: 'I-IV-I-V-I',  name: 'Baroque cadence',              group: 'Classical',
    degrees: [0, 5, 0, 7, 0],    qualities: ['maj', 'maj', 'maj', 'maj', 'maj'] },

  // ── Short (3 chords) ─────────────────────────────────────────────────────
  { symbol: 'I-IV-V',      name: 'Rock / folk / blues',          group: 'Short', basic: true,
    degrees: [0, 5, 7],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-V-IV',      name: 'Reverse rock',                 group: 'Short',
    degrees: [0, 7, 5],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-V-vi',      name: 'Partial axis',                 group: 'Short',
    degrees: [0, 7, 9],   qualities: ['maj', 'maj', 'm'] },
  { symbol: 'I-vi-V',      name: 'Classical descending',         group: 'Short',
    degrees: [0, 9, 7],   qualities: ['maj', 'm', 'maj'] },
  { symbol: 'I-IV-I',      name: 'Blues fragment',               group: 'Short',
    degrees: [0, 5, 0],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'IV-V-vi',     name: 'Ascending cadence',            group: 'Short',
    degrees: [5, 7, 9],   qualities: ['maj', 'maj', 'm'] },
  { symbol: 'i-VII-VI',    name: 'Minor descending',             group: 'Short',
    degrees: [0, 10, 8],  qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVII-i',    name: 'Modal minor',                  group: 'Short',
    degrees: [0, 10, 0],  qualities: ['m', 'maj', 'm'] },
  { symbol: 'i-iv-VII',    name: 'Minor pre-dominant',           group: 'Short',
    degrees: [0, 5, 10],  qualities: ['m', 'm', 'maj'] },

  // ── Pop & Rock (4 chords) ─────────────────────────────────────────────────
  { symbol: 'I-V-vi-IV',   name: 'Axis progression',            group: 'Pop & Rock', basic: true,
    degrees: [0, 7, 9, 5],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'vi-IV-I-V',   name: 'Axis (vi start)',             group: 'Pop & Rock',
    degrees: [9, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'I-IV-vi-V',   name: 'Pop variant',                 group: 'Pop & Rock',
    degrees: [0, 5, 9, 7],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'I-vi-IV-V',   name: 'Doo-wop / 50s',              group: 'Pop & Rock', basic: true,
    degrees: [0, 9, 5, 7],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-iii-IV-V',  name: 'Ascending bright',            group: 'Pop & Rock',
    degrees: [0, 4, 5, 7],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-iii-vi-IV', name: 'Emotional pop',               group: 'Pop & Rock',
    degrees: [0, 4, 9, 5],   qualities: ['maj', 'm', 'm', 'maj'] },
  { symbol: 'I-IV-I-V',    name: 'Blues-adjacent / country',    group: 'Pop & Rock',
    degrees: [0, 5, 0, 7],   qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-VII-IV-I',  name: 'Mixolydian feel',             group: 'Pop & Rock',
    degrees: [0, 10, 5, 0],  qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-bIII-IV',   name: 'Rock borrowed bIII',          group: 'Pop & Rock',
    degrees: [0, 3, 5],      qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-bIII-bVII', name: 'Power rock',                  group: 'Pop & Rock',
    degrees: [0, 3, 10],     qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'vi-I-V-IV',   name: 'Minor-start pop',             group: 'Pop & Rock',
    degrees: [9, 0, 7, 5],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'IV-I-V-vi',   name: 'IV-start axis',               group: 'Pop & Rock',
    degrees: [5, 0, 7, 9],   qualities: ['maj', 'maj', 'maj', 'm'] },
  { symbol: 'ii-IV-I-V',   name: 'Gospel',                      group: 'Pop & Rock',
    degrees: [2, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'I-vi-ii-V',   name: 'Pop / jazz ballad',           group: 'Pop & Rock',
    degrees: [0, 9, 2, 7],   qualities: ['maj', 'm', 'm', 'maj'] },

  // ── Jazz (4–6 chords) ────────────────────────────────────────────────────
  { symbol: 'ii-V-I',      name: 'Jazz ii–V–I (major)',         group: 'Jazz', basic: true,
    degrees: [2, 7, 0],   qualities: ['m7', '7', 'maj7'] },
  { symbol: 'ii-V-i',      name: 'Jazz ii–V–i (minor)',         group: 'Jazz',
    degrees: [2, 7, 0],   qualities: ['m7b5', '7', 'm'] },
  { symbol: 'ii-V-I-VI',   name: 'Jazz turnaround',             group: 'Jazz',
    degrees: [2, 7, 0, 9],   qualities: ['m7', '7', 'maj7', '7'] },
  { symbol: 'I-VI-ii-V',   name: 'Rhythm changes A',            group: 'Jazz',
    degrees: [0, 9, 2, 7],   qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'iii-VI-ii-V', name: 'Cycle of 5ths (jazz)',        group: 'Jazz',
    degrees: [4, 9, 2, 7],   qualities: ['m7', '7', 'm7', '7'] },
  { symbol: 'vi-ii-V-I',   name: 'Extended turnaround',         group: 'Jazz',
    degrees: [9, 2, 7, 0],   qualities: ['m7', 'm7', '7', 'maj7'] },
  { symbol: 'I-VI7-ii-V',  name: 'Turnaround (sec. dom)',       group: 'Jazz',
    degrees: [0, 9, 2, 7],   qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'ii-bVII7-I',  name: 'Backdoor dominant',           group: 'Jazz',
    degrees: [2, 10, 0],  qualities: ['m7', '7', 'maj7'] },
  { symbol: 'i-iv-VII-III', name: 'Minor jazz cycle',           group: 'Jazz',
    degrees: [0, 5, 10, 3],  qualities: ['m7', 'm7', '7', 'maj7'] },
  { symbol: 'i-iiø7-V7-i', name: 'Minor ii–V–I',               group: 'Jazz',
    degrees: [0, 2, 7, 0],   qualities: ['m', 'm7b5', '7', 'm'] },
  { symbol: 'ii-V-I-vi-ii-V', name: 'Jazz loop (6 chords)',     group: 'Jazz',
    degrees: [2, 7, 0, 9, 2, 7],  qualities: ['m7', '7', 'maj7', 'm7', 'm7', '7'] },

  // ── Blues (4–12 chords) ───────────────────────────────────────────────────
  { symbol: 'I7-IV7-I7-V7',   name: 'Jazz blues turnaround',      group: 'Blues',
    degrees: [0, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'I7-VI7-ii7-V7',  name: 'Jazz blues (4 chords)',      group: 'Blues',
    degrees: [0, 9, 2, 7],        qualities: ['7', '7', 'm7', '7'] },
  { symbol: 'I-V-IV-IV',      name: 'Eight-bar blues (short)',    group: 'Blues',
    degrees: [0, 7, 5, 5],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'I-IV-I-V',       name: 'Quick change (4 chords)',    group: 'Blues',
    degrees: [0, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'V-IV-I-V',       name: 'Blues ending',               group: 'Blues',
    degrees: [7, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  // 12-bar entries store each two-bar block as a single chord slot (12 slots total)
  { symbol: '12-bar',          name: '12-bar blues (standard)',    group: 'Blues',
    degrees: [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7],
    qualities: ['7','7','7','7','7','7','7','7','7','7','7','7'] },
  { symbol: '12-bar-qc',       name: '12-bar blues (quick change)', group: 'Blues',
    degrees: [0, 5, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7],
    qualities: ['7','7','7','7','7','7','7','7','7','7','7','7'] },
  { symbol: '12-bar-jazz',     name: '12-bar blues (jazz)',        group: 'Blues',
    degrees: [0, 5, 0, 9, 5, 5, 0, 3, 2, 10, 0, 7],
    qualities: ['7','7','7','7','7','7','maj7','7','m7','7','7','7'] },

  // ── Minor (4–8 chords) ────────────────────────────────────────────────────
  { symbol: 'i-VII-VI-VII',    name: 'Natural minor loop',          group: 'Minor',
    degrees: [0, 10, 8, 10],  qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-VI-III-VII',    name: 'Aeolian cycle',               group: 'Minor',
    degrees: [0, 8, 3, 10],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-v-i',        name: 'Pure minor / classical',      group: 'Minor',
    degrees: [0, 5, 7, 0],    qualities: ['m', 'm', 'm', 'm'] },
  { symbol: 'i-VI-VII-i',      name: 'Minor with return',           group: 'Minor',
    degrees: [0, 8, 10, 0],   qualities: ['m', 'maj', 'maj', 'm'] },
  { symbol: 'i-III-VII-VI',    name: 'Epic / cinematic',            group: 'Minor',
    degrees: [0, 3, 10, 8],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-v-VI-VII',      name: 'Dramatic minor',              group: 'Minor',
    degrees: [0, 7, 8, 10],   qualities: ['m', 'm', 'maj', 'maj'] },
  { symbol: 'i-bVI-bIII-bVII', name: 'Aeolian (all borrowed)',      group: 'Minor',
    degrees: [0, 8, 3, 10],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-VII-III-VI-ii°-V-i', name: 'Harmonic minor circle', group: 'Minor',
    degrees: [0, 5, 10, 3, 8, 2, 7, 0],
    qualities: ['m', 'm', 'maj', 'maj', 'maj', 'dim', 'maj', 'm'] },

  // ── Rock (3–4 chords) ────────────────────────────────────────────────────
  { symbol: 'I-bVII-IV',      name: 'Mixolydian rock',             group: 'Rock',
    degrees: [0, 10, 5],    qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'i-bVII-bVI',     name: 'Aeolian rock',               group: 'Rock',
    degrees: [0, 10, 8],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVI-bVII',     name: 'Minor anthem',               group: 'Rock',
    degrees: [0, 8, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVII-IV-i',    name: 'Minor rock loop',            group: 'Rock',
    degrees: [0, 10, 5, 0], qualities: ['m', 'maj', 'maj', 'm'] },
  { symbol: 'i-iv-V-i',       name: 'Harmonic minor rock',        group: 'Rock',
    degrees: [0, 5, 7, 0],  qualities: ['m', 'm', 'maj', 'm'] },
  { symbol: 'I-bIII-bVII-IV', name: 'Classic rock borrowed',      group: 'Rock',
    degrees: [0, 3, 10, 5], qualities: ['maj', 'maj', 'maj', 'maj'] },

  // ── Reggae (2–4 chords) ──────────────────────────────────────────────────
  { symbol: 'I-IV-V-reg',     name: 'Roots reggae',               group: 'Reggae',
    degrees: [0, 5, 7],     qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'i-bVII-reg',     name: 'Roots minor',                group: 'Reggae',
    degrees: [0, 10],       qualities: ['m', 'maj'] },
  { symbol: 'i-bVI-bVII-reg', name: 'Minor roots',                group: 'Reggae',
    degrees: [0, 8, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'I-vi-IV-V-reg',  name: 'Lovers rock',                group: 'Reggae',
    degrees: [0, 9, 5, 7],  qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'vi-IV-I-V-reg',  name: 'Lovers rock (vi start)',     group: 'Reggae',
    degrees: [9, 5, 0, 7],  qualities: ['m', 'maj', 'maj', 'maj'] },

  // ── Samba & Bossa Nova (3–5 chords) ──────────────────────────────────────
  { symbol: 'I-VI7-ii-V7',    name: 'Samba turnaround',           group: 'Samba & Bossa',
    degrees: [0, 9, 2, 7],  qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'iii-VI7-ii-V7',  name: 'Samba cycle',                group: 'Samba & Bossa',
    degrees: [4, 9, 2, 7],  qualities: ['m7', '7', 'm7', '7'] },
  { symbol: 'I-III7-vi',      name: 'Passing secondary dom',       group: 'Samba & Bossa',
    degrees: [0, 4, 9],     qualities: ['maj7', '7', 'm7'] },
  { symbol: 'iiø7-V7-i-bossa', name: 'Bossa minor ii–V–i',        group: 'Samba & Bossa',
    degrees: [2, 7, 0],     qualities: ['m7b5', '7', 'm7'] },
  { symbol: 'i-VI7-iiø7-V7',  name: 'Bossa minor turnaround',     group: 'Samba & Bossa',
    degrees: [0, 9, 2, 7],  qualities: ['m7', '7', 'm7b5', '7'] },
  { symbol: 'iv-bVII7-III',   name: 'Minor bossa cadence',        group: 'Samba & Bossa',
    degrees: [5, 10, 3],    qualities: ['m7', '7', 'maj7'] },

  // ── Metal (2–5 chords) ───────────────────────────────────────────────────
  { symbol: 'i-bII',          name: 'Phrygian power',             group: 'Metal',
    degrees: [0, 1],        qualities: ['m', 'maj'] },
  { symbol: 'i-bII-bVII',     name: 'Phrygian loop',             group: 'Metal',
    degrees: [0, 1, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVI-bIII-bVII', name: 'Neoclassical / Aeolian',   group: 'Metal',
    degrees: [0, 8, 3, 10], qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-V-i-met',   name: 'Harmonic minor metal',      group: 'Metal',
    degrees: [0, 5, 7, 0],  qualities: ['m', 'm', 'maj', 'm'] },
  { symbol: 'iii-vi-ii-V-i-neo', name: 'Neoclassical descending', group: 'Metal',
    degrees: [4, 9, 2, 7, 0],  qualities: ['m', 'm', 'm7b5', '7', 'm'] },

  // ── Extended (5–8 chords) ─────────────────────────────────────────────────
  { symbol: 'I-IV-V-IV-I',     name: 'Rock/blues return',          group: 'Extended',
    degrees: [0, 5, 7, 5, 0],          qualities: ['maj', 'maj', 'maj', 'maj', 'maj'] },
  { symbol: 'ii-V-I-IV-V',     name: 'Extended jazz cadence',      group: 'Extended',
    degrees: [2, 7, 0, 5, 7],          qualities: ['m7', '7', 'maj7', 'maj7', '7'] },
  { symbol: 'i-VII-VI-VII-i',  name: 'Minor with return',          group: 'Extended',
    degrees: [0, 10, 8, 10, 0],        qualities: ['m', 'maj', 'maj', 'maj', 'm'] },
  { symbol: 'I-iii-IV-iv-I-V', name: 'Borrowed iv (Beatles)',      group: 'Extended',
    degrees: [0, 4, 5, 5, 0, 7],       qualities: ['maj', 'm', 'maj', 'm', 'maj', 'maj'] },
  { symbol: 'i-VII-VI-V-i-V',  name: 'Flamenco / classical minor', group: 'Extended',
    degrees: [0, 10, 8, 7, 0, 7],      qualities: ['m', 'maj', 'maj', 'maj', 'm', 'maj'] },
  // Romanesca / Pachelbel canon — 8-chord ground bass sequence
  { symbol: 'Romanesca',        name: 'Romanesca / Pachelbel',      group: 'Extended',
    degrees: [0, 7, 9, 4, 5, 0, 5, 7],
    qualities: ['maj', 'maj', 'm', 'm', 'maj', 'maj', 'maj', 'maj'] },
  // Descending fifths sequence — each chord root falls a fifth from the previous
  { symbol: 'desc-5ths',        name: 'Descending fifths sequence', group: 'Extended',
    degrees: [0, 5, 11, 4, 9, 2, 7, 0],
    qualities: ['maj', 'maj', 'dim', 'm', 'm', 'm', 'maj', 'maj'] },
];

/**
 * Scale degree labels for the progression answer UI.
 * Covers all diatonic degrees plus common chromatic borrows (♭II, ♭III, ♭VI, ♭VII, ♯IV).
 * Each entry maps a Roman numeral label to its semitone offset above the tonic.
 *
 * @type {Array<{ label: string, semi: number }>}
 */
const PROG_DEGREES = [
  { label: 'I',    semi: 0  },
  { label: 'ii',   semi: 2  },
  { label: 'iii',  semi: 4  },
  { label: 'IV',   semi: 5  },
  { label: 'V',    semi: 7  },
  { label: 'vi',   semi: 9  },
  { label: 'vii°', semi: 11 },
  { label: '♭II',  semi: 1  },
  { label: '♭III', semi: 3  },
  { label: '♭VI',  semi: 8  },
  { label: '♭VII', semi: 10 },
  { label: '♯IV',  semi: 6  },
];

/**
 * Chord quality options for the progression answer UI.
 * Covers triads and basic 7th chords used across all progression groups.
 * `label` is the display string; `sym` matches the `qualities` values in PROGRESSIONS.
 *
 * @type {Array<{ label: string, sym: string }>}
 */
const PROG_QUALITIES = [
  { label: 'maj',  sym: 'maj'   },
  { label: 'm',    sym: 'm'     },
  { label: '7',    sym: '7'     },
  { label: 'maj7', sym: 'maj7'  },
  { label: 'm7',   sym: 'm7'    },
  { label: 'dim',  sym: 'dim'   },
  { label: 'ø7',   sym: 'm7b5'  },
  { label: 'dim7', sym: 'o7'    },
  { label: 'aug',  sym: 'aug'   },
  { label: 'sus4', sym: 'sus4'  },
];

/**
 * Canonical display order of progression groups in the pool panel.
 *
 * @type {string[]}
 */
const PROG_GROUPS = [
  'Cadences', 'Diminished', 'Classical', 'Short', 'Pop & Rock',
  'Jazz', 'Blues', 'Minor', 'Rock', 'Reggae', 'Samba & Bossa', 'Metal', 'Extended',
];

/**
 * Default collapsed state for each group in the pool panel.
 * Only Cadences is expanded on load; all other groups start collapsed.
 *
 * @type {Object.<string, boolean>}
 */
const PROG_GROUP_COLLAPSED = {
  Cadences:        false,
  Diminished:      true,
  Classical:       true,
  Short:           true,
  'Pop & Rock':    true,
  Jazz:            true,
  Blues:           true,
  Minor:           true,
  Rock:            true,
  Reggae:          true,
  'Samba & Bossa': true,
  Metal:           true,
  Extended:        true,
};

// ── Progression runtime state ─────────────────────────────────────────────────
// These variables hold per-question state for the active progressions quiz session.
// `selectedProgressions` is initialised in defaults.js (after PROGRESSIONS is defined).

/** @type {Object|null} The PROGRESSIONS entry for the current question. */
let currentProgression = null;

/** @type {number} MIDI note number of the tonic for the current question (default middle C = 60). */
let currentProgRootMidi = 60;

/** @type {number} Pitch class of the tonic for the current question (0–11). */
let currentProgRootPc = 0;

/**
 * Per-slot answer state for the current question.
 * One entry per chord in the progression; each tracks the user's selected
 * degree and quality indices into PROG_DEGREES and PROG_QUALITIES.
 *
 * @type {Array<{ degreeIdx: number|null, qualityIdx: number|null }>}
 */
let progSlotAnswers = [];

/** @type {boolean} Whether the current progression question has been submitted. */
let progAnswered = false;

// =============================================================================
// The Sound Travels Ear Training — progressions.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
