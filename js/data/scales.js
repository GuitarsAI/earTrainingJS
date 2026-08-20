/**
 * @file scales.js
 * @description Scale definitions and playback direction options for The Sound Travels Ear Training.
 * Organises all 46 scales into four cardinality groups: pentatonic, hexatonic, diatonic, and octatonic.
 *
 * @module scales
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// =============================================================================
// SCALES — Schema
//
// Each entry in SCALES is an object with the following fields:
//
//   name        {string}   — Canonical scale name used internally and in the answer pool.
//   displayName {string}   — Optional. Extended display name shown in the breakdown panel.
//                            Omitted when name is sufficient.
//   symbol      {string}   — Unique identifier used in state, stats, and pool logic.
//   intervals   {number[]} — Semitone offsets from the root, including the octave as the
//                            final value (e.g. [0,2,4,5,7,9,11,12] for Major).
//   parentKey   {object}   — Maps the scale root to a parent key signature for notation:
//     .offset   {number}   — Semitone offset from the scale root to the parent key's root.
//                            e.g. Dorian built on D → parent key is C major → offset is -2.
//     .quality  {string|null} — 'major' | 'minor' | null.
//                            null = no standard key signature applies; notation falls back to C.
//   group       {string}   — Cardinality group: 'pentatonic' | 'hexatonic' | 'diatonic' | 'octatonic'.
//   basic       {boolean}  — Optional. When true, the scale appears in Basic difficulty mode.
//                            Omitted (falsy) for Advanced-only scales.
// =============================================================================

/**
 * Master list of all scales available in the app.
 * Grouped by note count: pentatonic (5), hexatonic (6), diatonic (7), octatonic (8).
 *
 * @type {Array<{
 *   name: string,
 *   displayName?: string,
 *   symbol: string,
 *   intervals: number[],
 *   parentKey: { offset: number, quality: 'major'|'minor'|null },
 *   group: 'pentatonic'|'hexatonic'|'diatonic'|'octatonic',
 *   basic?: boolean
 * }>}
 */
const SCALES = [
  // ── Pentatonic (5 notes) ──────────────────────────────────────────────────
  { name: 'Major Pentatonic',    displayName: 'Major Pentatonic (Ionian Pentatonic)',              symbol: 'pent_maj',        intervals: [0,2,4,7,9,12],        parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic', basic: true },
  { name: 'Minor Pentatonic',    displayName: 'Minor Pentatonic (Aeolian Pentatonic)',             symbol: 'pent_min',        intervals: [0,3,5,7,10,12],       parentKey: { offset: 0,  quality: 'minor' }, group: 'pentatonic', basic: true },
  { name: 'Dorian Pentatonic',                                                                     symbol: 'pent_dorian',     intervals: [0,2,3,7,9,12],        parentKey: { offset: -2, quality: 'major' }, group: 'pentatonic' },
  { name: 'Phrygian Pentatonic',                                                                   symbol: 'pent_phrygian',   intervals: [0,1,3,5,7,12],        parentKey: { offset: -4, quality: 'major' }, group: 'pentatonic' },
  { name: 'Lydian Pentatonic',                                                                     symbol: 'pent_lydian',     intervals: [0,2,4,6,9,12],        parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Mixolydian Pentatonic',                                                                 symbol: 'pent_mixo',       intervals: [0,2,5,7,10,12],       parentKey: { offset: -7, quality: 'major' }, group: 'pentatonic' },
  { name: 'Locrian Pentatonic',                                                                    symbol: 'pent_locrian',    intervals: [0,1,3,6,8,12],        parentKey: { offset: -5, quality: 'major' }, group: 'pentatonic' },
  { name: 'Dominant Pentatonic',                                                                   symbol: 'pent_dom',        intervals: [0,2,4,7,11,12],       parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Suspended Pentatonic', displayName: 'Suspended Pentatonic (Egyptian)',                  symbol: 'pent_sus',        intervals: [0,2,5,7,10,12],       parentKey: { offset: -7, quality: 'major' }, group: 'pentatonic' },
  // Japanese pentatonics: no standard Western key signature applies; notation defaults to C
  { name: 'Hirajoshi',                                                                             symbol: 'pent_hirajoshi',  intervals: [0,2,3,7,9,12],        parentKey: { offset: 0,  quality: null   }, group: 'pentatonic' },
  { name: 'Iwato',                                                                                 symbol: 'pent_iwato',      intervals: [0,1,5,6,10,12],       parentKey: { offset: 0,  quality: null   }, group: 'pentatonic' },
  { name: 'In-sen',                                                                                symbol: 'pent_insen',      intervals: [0,1,5,7,10,12],       parentKey: { offset: 0,  quality: null   }, group: 'pentatonic' },
  { name: 'Yo',                  displayName: 'Yo (Ritsu Pentatonic)',                             symbol: 'pent_yo',         intervals: [0,2,5,7,9,12],        parentKey: { offset: 0,  quality: null   }, group: 'pentatonic' },

  // ── Hexatonic (6 notes) ──────────────────────────────────────────────────
  { name: 'Blues',               displayName: 'Blues (Minor Blues)',                               symbol: 'blues',           intervals: [0,3,5,6,7,10,12],     parentKey: { offset: 0,  quality: 'minor' }, group: 'hexatonic' },
  { name: 'Major Blues',                                                                           symbol: 'blues_maj',       intervals: [0,2,3,4,7,9,12],      parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Whole Tone',                                                                            symbol: 'whole_tone',      intervals: [0,2,4,6,8,10,12],     parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Augmented',                                                                             symbol: 'augmented_scale', intervals: [0,3,4,7,8,11,12],     parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Prometheus',          displayName: 'Prometheus (Mystic)',                               symbol: 'prometheus',      intervals: [0,2,4,6,9,10,12],     parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Prometheus Liszt',                                                                      symbol: 'prometheus_liszt',intervals: [0,1,4,5,7,9,12],      parentKey: { offset: 0,  quality: null   }, group: 'hexatonic' },
  { name: 'Tritone Hexatonic',                                                                     symbol: 'tritone_hex',     intervals: [0,1,3,6,7,9,12],      parentKey: { offset: 0,  quality: null   }, group: 'hexatonic' },
  { name: 'Messiaen Mode 5',                                                                       symbol: 'messiaen_5',      intervals: [0,1,5,7,8,11,12],     parentKey: { offset: 0,  quality: null   }, group: 'hexatonic' },

  // ── Diatonic / Modal (7 notes) ───────────────────────────────────────────
  { name: 'Major',                                                                                 symbol: 'major',           intervals: [0,2,4,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic', basic: true },
  { name: 'Natural Minor',                                                                         symbol: 'nat_minor',       intervals: [0,2,3,5,7,8,10,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic', basic: true },
  { name: 'Harmonic Minor',                                                                        symbol: 'harm_minor',      intervals: [0,2,3,5,7,8,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Melodic Minor',                                                                         symbol: 'mel_minor',       intervals: [0,2,3,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Harmonic Major',                                                                        symbol: 'harm_major',      intervals: [0,2,4,5,7,8,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Dorian',                                                                                symbol: 'dorian',          intervals: [0,2,3,5,7,9,10,12],   parentKey: { offset: -2, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian',                                                                              symbol: 'phrygian',        intervals: [0,1,3,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian',                                                                                symbol: 'lydian',          intervals: [0,2,4,6,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Mixolydian',                                                                            symbol: 'mixolydian',      intervals: [0,2,4,5,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Locrian',                                                                               symbol: 'locrian',         intervals: [0,1,3,5,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian Dominant',   displayName: 'Phrygian Dominant (mode V of harm. minor)',        symbol: 'phryg_dom',       intervals: [0,1,4,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian Dominant',                                                                       symbol: 'lyd_dom',         intervals: [0,2,4,6,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Altered',             displayName: 'Altered (Super Locrian)',                          symbol: 'altered',         intervals: [0,1,3,4,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  { name: 'Neapolitan Minor',                                                                      symbol: 'neap_minor',      intervals: [0,1,3,5,7,8,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Double Harmonic',     displayName: 'Double Harmonic (Byzantine)',                      symbol: 'dbl_harmonic',    intervals: [0,1,4,5,7,8,10,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Spanish / Flamenco',  displayName: 'Spanish / Flamenco (Phrygian Dominant family)',   symbol: 'spanish',         intervals: [0,1,4,5,7,8,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Hungarian Minor',                                                                       symbol: 'hung_minor',      intervals: [0,2,3,6,7,8,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Romanian Minor',      displayName: 'Romanian Minor (Ukrainian Dorian)',                symbol: 'romanian_minor',  intervals: [0,2,3,6,7,9,10,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Dorian ♯4',                                                                            symbol: 'dorian_s4',       intervals: [0,2,3,6,7,9,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Phrygian ♮6',                                                                          symbol: 'phrygian_n6',     intervals: [0,1,3,5,7,9,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },
  { name: 'Messiaen Mode 6',                                                                       symbol: 'messiaen_6',      intervals: [0,2,4,6,8,9,11,12],   parentKey: { offset: 0,  quality: null   }, group: 'diatonic' },

  // ── Octatonic (8 notes) ──────────────────────────────────────────────────
  { name: 'Diminished (W-H)',                                                                      symbol: 'dim_wh',          intervals: [0,2,3,5,6,8,9,11,12], parentKey: { offset: 0,  quality: 'major' }, group: 'octatonic' },
  { name: 'Diminished (H-W)',                                                                      symbol: 'dim_hw',          intervals: [0,1,3,4,6,7,9,10,12], parentKey: { offset: 0,  quality: 'major' }, group: 'octatonic' },
  // Messiaen modes of limited transposition: no standard key signature applies
  { name: 'Messiaen Mode 3',                                                                       symbol: 'messiaen_3',      intervals: [0,2,3,4,6,8,9,10,12], parentKey: { offset: 0,  quality: null   }, group: 'octatonic' },
  { name: 'Messiaen Mode 4',                                                                       symbol: 'messiaen_4',      intervals: [0,1,2,4,6,7,9,10,12], parentKey: { offset: 0,  quality: null   }, group: 'octatonic' },
];

/**
 * Playback direction options for scale exercises.
 * Controls whether the scale is played ascending, descending, both, or randomly chosen.
 *
 * @type {Array<{ name: string, symbol: string }>}
 */
const SCALE_DIRECTIONS = [
  { name: 'Ascending',  symbol: 'asc'    },
  { name: 'Descending', symbol: 'desc'   },
  { name: 'Both',       symbol: 'both'   },
  // 'random' selects ascending or descending at runtime for each new question
  { name: 'Random',     symbol: 'random' },
];

// =============================================================================
// The Sound Travels Ear Training — scales.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
