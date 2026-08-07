const PROGRESSIONS = [
  // ── Cadences (2 chords) ──────────────────────────────────────────────────
  { symbol: 'V-I',       name: 'Perfect Authentic',          group: 'Cadences',
    degrees: [7, 0],   qualities: ['maj', 'maj'] },
  { symbol: 'V7-I',      name: 'Perfect Authentic (dom7)',    group: 'Cadences',
    degrees: [7, 0],   qualities: ['7', 'maj'] },
  { symbol: 'IV-I',      name: 'Plagal',                     group: 'Cadences',
    degrees: [5, 0],   qualities: ['maj', 'maj'] },
  { symbol: 'I-V',       name: 'Half Cadence',               group: 'Cadences',
    degrees: [0, 7],   qualities: ['maj', 'maj'] },
  { symbol: 'ii-V',      name: 'Half Cadence (jazz)',        group: 'Cadences',
    degrees: [2, 7],   qualities: ['m', 'maj'] },
  { symbol: 'IV-V',      name: 'Half Cadence (rock/pop)',    group: 'Cadences',
    degrees: [5, 7],   qualities: ['maj', 'maj'] },
  { symbol: 'V-vi',      name: 'Deceptive',                  group: 'Cadences',
    degrees: [7, 9],   qualities: ['maj', 'm'] },
  { symbol: 'V7-vi',     name: 'Deceptive (dom7)',           group: 'Cadences',
    degrees: [7, 9],   qualities: ['7', 'm'] },
  { symbol: 'iv6-V',     name: 'Phrygian',                   group: 'Cadences',
    degrees: [5, 7],   qualities: ['m', 'maj'] },

  // ── Diminished & half-dim resolutions (2 chords) ─────────────────────────
  { symbol: 'vii°-I',    name: 'Leading tone resolution',    group: 'Diminished',
    degrees: [11, 0],  qualities: ['dim', 'maj'] },
  { symbol: 'vii°7-I',   name: 'Fully dim → major tonic',   group: 'Diminished',
    degrees: [11, 0],  qualities: ['o7', 'maj'] },
  { symbol: 'vii°7-i',   name: 'Fully dim → minor tonic',   group: 'Diminished',
    degrees: [11, 0],  qualities: ['o7', 'm'] },
  { symbol: 'iiø7-V',    name: 'Half-dim → dominant',       group: 'Diminished',
    degrees: [2, 7],   qualities: ['m7b5', 'maj'] },
  { symbol: 'iiø7-V7',   name: 'Jazz minor ii–V',           group: 'Diminished',
    degrees: [2, 7],   qualities: ['m7b5', '7'] },
  { symbol: 'iiø7-i',    name: 'Half-dim direct resolution', group: 'Diminished',
    degrees: [2, 0],   qualities: ['m7b5', 'm'] },
  { symbol: '#iv°-V',    name: 'Chromatic dim approach',    group: 'Diminished',
    degrees: [6, 7],   qualities: ['dim', 'maj'] },

  // ── Short progressions (3 chords) ────────────────────────────────────────
  { symbol: 'I-IV-V',    name: 'Rock / folk / blues',       group: 'Short',
    degrees: [0, 5, 7],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-V-vi',    name: 'Partial axis',              group: 'Short',
    degrees: [0, 7, 9],   qualities: ['maj', 'maj', 'm'] },
  { symbol: 'i-VII-VI',  name: 'Minor descending',          group: 'Short',
    degrees: [0, 10, 8],  qualities: ['m', 'maj', 'maj'] },
  { symbol: 'I-vi-V',    name: 'Classical descending',      group: 'Short',
    degrees: [0, 9, 7],   qualities: ['maj', 'm', 'maj'] },
  { symbol: 'I-IV-I',    name: 'Blues turnaround fragment', group: 'Short',
    degrees: [0, 5, 0],   qualities: ['maj', 'maj', 'maj'] },

  // ── Pop & Rock (4 chords) ─────────────────────────────────────────────────
  { symbol: 'I-V-vi-IV', name: 'Axis progression',         group: 'Pop & Rock',
    degrees: [0, 7, 9, 5],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'vi-IV-I-V', name: 'Axis (vi start)',          group: 'Pop & Rock',
    degrees: [9, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'I-IV-vi-V', name: 'Pop variant',              group: 'Pop & Rock',
    degrees: [0, 5, 9, 7],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'I-iii-IV-V',name: 'Ascending bright',         group: 'Pop & Rock',
    degrees: [0, 4, 5, 7],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-iii-vi-IV',name: 'Emotional pop',           group: 'Pop & Rock',
    degrees: [0, 4, 9, 5],   qualities: ['maj', 'm', 'm', 'maj'] },
  { symbol: 'I-IV-I-V',  name: 'Blues-adjacent / country', group: 'Pop & Rock',
    degrees: [0, 5, 0, 7],   qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-VII-IV-I',name: 'Mixolydian feel',          group: 'Pop & Rock',
    degrees: [0, 10, 5, 0],  qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'ii-IV-I-V', name: 'Gospel',                   group: 'Pop & Rock',
    degrees: [2, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },

  // ── Jazz (4 chords) ───────────────────────────────────────────────────────
  { symbol: 'ii-V-I-VI', name: 'Jazz turnaround',          group: 'Jazz',
    degrees: [2, 7, 0, 9],   qualities: ['m7', '7', 'maj7', '7'] },
  { symbol: 'iii-VI-ii-V',name: 'Cycle of 5ths',          group: 'Jazz',
    degrees: [4, 9, 2, 7],   qualities: ['m7', '7', 'm7', '7'] },
  { symbol: 'I-VI-ii-V', name: 'Rhythm changes A',        group: 'Jazz',
    degrees: [0, 9, 2, 7],   qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'i-iv-VII-III',name: 'Minor jazz',             group: 'Jazz',
    degrees: [0, 5, 10, 3],  qualities: ['m7', 'm7', '7', 'maj7'] },
  { symbol: 'i-iiø7-V7-i',name: 'Minor ii–V–I',           group: 'Jazz',
    degrees: [0, 2, 7, 0],   qualities: ['m', 'm7b5', '7', 'm'] },

  // ── Minor (4 chords) ──────────────────────────────────────────────────────
  { symbol: 'i-VII-VI-VII',name: 'Natural minor',          group: 'Minor',
    degrees: [0, 10, 8, 10], qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-VI-III-VII',name: 'Minor cycle',            group: 'Minor',
    degrees: [0, 8, 3, 10],  qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-v-i',   name: 'Pure minor / classical', group: 'Minor',
    degrees: [0, 5, 7, 0],   qualities: ['m', 'm', 'm', 'm'] },
  { symbol: 'i-VI-VII-i', name: 'Minor with return',      group: 'Minor',
    degrees: [0, 8, 10, 0],  qualities: ['m', 'maj', 'maj', 'm'] },
  { symbol: 'i-III-VII-VI',name: 'Epic / cinematic',       group: 'Minor',
    degrees: [0, 3, 10, 8],  qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-v-VI-VII', name: 'Dramatic minor',         group: 'Minor',
    degrees: [0, 7, 8, 10],  qualities: ['m', 'm', 'maj', 'maj'] },

  // ── Extended (5–6 chords) ─────────────────────────────────────────────────
  { symbol: 'I-IV-V-IV-I',      name: 'Rock/blues return',        group: 'Extended',
    degrees: [0, 5, 7, 5, 0],         qualities: ['maj', 'maj', 'maj', 'maj', 'maj'] },
  { symbol: 'ii-V-I-IV-V',      name: 'Extended jazz cadence',    group: 'Extended',
    degrees: [2, 7, 0, 5, 7],         qualities: ['m7', '7', 'maj7', 'maj7', '7'] },
  { symbol: 'i-VII-VI-VII-i',   name: 'Minor with return',        group: 'Extended',
    degrees: [0, 10, 8, 10, 0],       qualities: ['m', 'maj', 'maj', 'maj', 'm'] },
  { symbol: 'I-iii-IV-iv-I-V',  name: 'Borrowed iv (Beatles)',    group: 'Extended',
    degrees: [0, 4, 5, 5, 0, 7],      qualities: ['maj', 'm', 'maj', 'm', 'maj', 'maj'] },
  { symbol: 'ii-V-I-vi-ii-V',   name: 'Jazz loop (6 chords)',     group: 'Extended',
    degrees: [2, 7, 0, 9, 2, 7],      qualities: ['m7', '7', 'maj7', 'm7', 'm7', '7'] },
  { symbol: 'i-VII-VI-V-i-V',   name: 'Flamenco / classical minor', group: 'Extended',
    degrees: [0, 10, 8, 7, 0, 7],     qualities: ['m', 'maj', 'maj', 'maj', 'm', 'maj'] },
];

// Degree labels for the answer UI — covers common diatonic degrees + chromatic borrows
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

// Quality options for the answer UI — triads + basic 7ths
const PROG_QUALITIES = [
  { label: 'maj',   sym: 'maj'   },
  { label: 'm',     sym: 'm'     },
  { label: '7',     sym: '7'     },
  { label: 'maj7',  sym: 'maj7'  },
  { label: 'm7',    sym: 'm7'    },
  { label: 'dim',   sym: 'dim'   },
  { label: 'ø7',    sym: 'm7b5'  },
  { label: 'dim7',  sym: 'o7'    },
  { label: 'aug',   sym: 'aug'   },
  { label: 'sus4',  sym: 'sus4'  },
];

// Group order for pool panel
const PROG_GROUPS = ['Cadences', 'Diminished', 'Short', 'Pop & Rock', 'Jazz', 'Minor', 'Extended'];

// Which groups start collapsed in the pool panel
const PROG_GROUP_COLLAPSED = { Diminished: true, Short: false, 'Pop & Rock': false, Jazz: false, Minor: false, Extended: true };

// ─── Progression state ────────────────────────────────────────────────────────
const selectedProgressions = new Set(
  PROGRESSIONS.filter(p => ['I-V-I', 'I-V-vi-IV', 'ii-V-I-VI', 'V-I', 'V7-I', 'IV-I', 'I-IV-V', 'i-VII-VI-VII'].includes(p.symbol)).map(p => p.symbol)
);
// Default: a handful of common ones across cadences + short + pop
// If none match, fall back to first 8
if (selectedProgressions.size === 0) {
  PROGRESSIONS.slice(0, 8).forEach(p => selectedProgressions.add(p.symbol));
}

let currentProgression = null;    // the PROGRESSIONS entry for this question
let currentProgRootMidi = 60;     // MIDI of tonic for this question
let currentProgRootPc   = 0;      // pitch class of tonic
// Per-slot answer state: array of { degreeIdx: null|number, qualityIdx: null|number }
let progSlotAnswers = [];
let progAnswered = false;
