/**
 * @file defaults.js
 * @description Initialises the four pool-selection Sets that define which items
 *   are active in the quiz at startup. Separated from state.js because these
 *   constants depend on data-layer globals (INTERVALS, PROGRESSIONS) that are
 *   not available until the data layer has fully loaded.
 *
 *   Load order: must follow intervals.js and progressions.js; must precede any
 *   file that reads selectedChords, selectedIntervals, selectedScales, or
 *   selectedProgressions.
 *
 * @module Defaults
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

/**
 * The set of chord symbols active in the quiz pool at startup.
 * Hard-coded to the Basic mode curated selection: major and minor triads and
 * 7ths, dominant 7th, diminished family, augmented triad, sus2, sus4, and
 * power chord. Modified at runtime by the pool panel chip toggles and the
 * Basic / Advanced difficulty switch.
 *
 * @type {Set<string>}
 */
const selectedChords = new Set([
  'maj', 'Maj7',
  'm', 'm7',
  '7',
  'dim', 'm7b5', 'o7',
  'aug',
  'sus2', 'sus4', 'power',
]);

/**
 * The set of interval symbols active in the quiz pool at startup.
 * Derived from INTERVALS by filtering out compound intervals, so the default
 * pool contains all 12 simple intervals (m2–P8). Modified at runtime by the
 * pool panel chip toggles and the Basic / Advanced difficulty switch.
 *
 * @type {Set<string>}
 */
const selectedIntervals = new Set(
  INTERVALS.filter(i => !i.compound).map(i => i.symbol)
);

/**
 * The set of scale symbols active in the quiz pool at startup.
 * Hard-coded to the Basic mode curated selection: Major Pentatonic, Minor
 * Pentatonic, Major, and Natural Minor. Modified at runtime by the pool panel
 * chip toggles and the Basic / Advanced difficulty switch.
 *
 * @type {Set<string>}
 */
const selectedScales = new Set([
  'pent_maj', 'pent_min',
  'major', 'nat_minor',
]);

/**
 * The set of progression symbols active in the quiz pool at startup.
 * Derived from PROGRESSIONS by filtering to entries flagged basic: true, so
 * the default pool always reflects the canonical Basic set without manual
 * maintenance. Modified at runtime by the pool panel chip toggles and the
 * Basic / Advanced difficulty switch.
 *
 * @type {Set<string>}
 */
const selectedProgressions = new Set(
  PROGRESSIONS.filter(p => p.basic).map(p => p.symbol)
);

// =============================================================================
// The Sound Travels Ear Training — defaults.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
