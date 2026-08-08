const PROGRESSIONS = [
  // ── Cadences (2 chords) ──────────────────────────────────────────────────
  { symbol: 'V-I',         name: 'Perfect Authentic',          group: 'Cadences',
    degrees: [7, 0],     qualities: ['maj', 'maj'] },
  { symbol: 'V7-I',        name: 'Perfect Authentic (dom7)',    group: 'Cadences',
    degrees: [7, 0],     qualities: ['7', 'maj'] },
  { symbol: 'IV-I',        name: 'Plagal',                      group: 'Cadences',
    degrees: [5, 0],     qualities: ['maj', 'maj'] },
  { symbol: 'I-V',         name: 'Half Cadence',                group: 'Cadences',
    degrees: [0, 7],     qualities: ['maj', 'maj'] },
  { symbol: 'ii-V',        name: 'Half Cadence (jazz)',         group: 'Cadences',
    degrees: [2, 7],     qualities: ['m', 'maj'] },
  { symbol: 'IV-V',        name: 'Half Cadence (rock/pop)',     group: 'Cadences',
    degrees: [5, 7],     qualities: ['maj', 'maj'] },
  { symbol: 'vi-V',        name: 'Half Cadence (minor)',        group: 'Cadences',
    degrees: [9, 7],     qualities: ['m', 'maj'] },
  { symbol: 'V-vi',        name: 'Deceptive',                   group: 'Cadences',
    degrees: [7, 9],     qualities: ['maj', 'm'] },
  { symbol: 'V7-vi',       name: 'Deceptive (dom7)',            group: 'Cadences',
    degrees: [7, 9],     qualities: ['7', 'm'] },
  { symbol: 'iv-V',        name: 'Phrygian Half Cadence',       group: 'Cadences',
    degrees: [5, 7],     qualities: ['m', 'maj'] },

  // ── Diminished & half-dim resolutions (2 chords) ─────────────────────────
  { symbol: 'vii°-I',      name: 'Leading tone resolution',     group: 'Diminished',
    degrees: [11, 0],    qualities: ['dim', 'maj'] },
  { symbol: 'vii°7-I',     name: 'Fully dim → major tonic',    group: 'Diminished',
    degrees: [11, 0],    qualities: ['o7', 'maj'] },
  { symbol: 'vii°7-i',     name: 'Fully dim → minor tonic',    group: 'Diminished',
    degrees: [11, 0],    qualities: ['o7', 'm'] },
  { symbol: 'iiø7-V',      name: 'Half-dim → dominant',        group: 'Diminished',
    degrees: [2, 7],     qualities: ['m7b5', 'maj'] },
  { symbol: 'iiø7-V7',     name: 'Jazz minor ii–V',            group: 'Diminished',
    degrees: [2, 7],     qualities: ['m7b5', '7'] },
  { symbol: 'iiø7-i',      name: 'Half-dim direct resolution',  group: 'Diminished',
    degrees: [2, 0],     qualities: ['m7b5', 'm'] },
  { symbol: '#iv°-V',      name: 'Chromatic dim approach',      group: 'Diminished',
    degrees: [6, 7],     qualities: ['dim', 'maj'] },

  // ── Classical (3–6 chords) ────────────────────────────────────────────────
  { symbol: 'I-V-I',       name: 'Basic tonic–dominant',        group: 'Classical',
    degrees: [0, 7, 0],  qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-IV-V-I',    name: 'Four-chord cadence',          group: 'Classical',
    degrees: [0, 5, 7, 0],   qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-ii-V-I',    name: 'Supertonic cadence',          group: 'Classical',
    degrees: [0, 2, 7, 0],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-vi-ii-V-I', name: 'Circle of fifths (5 chords)', group: 'Classical',
    degrees: [0, 9, 2, 7, 0],    qualities: ['maj', 'm', 'm', 'maj', 'maj'] },
  { symbol: 'iii-vi-ii-V-I', name: 'Circle of fifths (extended)', group: 'Classical',
    degrees: [4, 9, 2, 7, 0],    qualities: ['m', 'm', 'm', 'maj', 'maj'] },
  { symbol: 'vi-ii-V-I',   name: 'Circle of fifths (short)',    group: 'Classical',
    degrees: [9, 2, 7, 0],   qualities: ['m', 'm', 'maj', 'maj'] },
  { symbol: 'I-IV-I-V-I',  name: 'Baroque cadence',             group: 'Classical',
    degrees: [0, 5, 0, 7, 0],    qualities: ['maj', 'maj', 'maj', 'maj', 'maj'] },

  // ── Short (3 chords) ─────────────────────────────────────────────────────
  { symbol: 'I-IV-V',      name: 'Rock / folk / blues',         group: 'Short',
    degrees: [0, 5, 7],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-V-IV',      name: 'Reverse rock',                group: 'Short',
    degrees: [0, 7, 5],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-V-vi',      name: 'Partial axis',                group: 'Short',
    degrees: [0, 7, 9],   qualities: ['maj', 'maj', 'm'] },
  { symbol: 'I-vi-V',      name: 'Classical descending',        group: 'Short',
    degrees: [0, 9, 7],   qualities: ['maj', 'm', 'maj'] },
  { symbol: 'I-IV-I',      name: 'Blues fragment',              group: 'Short',
    degrees: [0, 5, 0],   qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'IV-V-vi',     name: 'Ascending cadence',           group: 'Short',
    degrees: [5, 7, 9],   qualities: ['maj', 'maj', 'm'] },
  { symbol: 'i-VII-VI',    name: 'Minor descending',            group: 'Short',
    degrees: [0, 10, 8],  qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVII-i',    name: 'Modal minor',                 group: 'Short',
    degrees: [0, 10, 0],  qualities: ['m', 'maj', 'm'] },
  { symbol: 'i-iv-VII',    name: 'Minor pre-dominant',          group: 'Short',
    degrees: [0, 5, 10],  qualities: ['m', 'm', 'maj'] },

  // ── Pop & Rock (4 chords) ─────────────────────────────────────────────────
  { symbol: 'I-V-vi-IV',   name: 'Axis progression',           group: 'Pop & Rock',
    degrees: [0, 7, 9, 5],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'vi-IV-I-V',   name: 'Axis (vi start)',            group: 'Pop & Rock',
    degrees: [9, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'I-IV-vi-V',   name: 'Pop variant',                group: 'Pop & Rock',
    degrees: [0, 5, 9, 7],   qualities: ['maj', 'maj', 'm', 'maj'] },
  { symbol: 'I-vi-IV-V',   name: 'Doo-wop / 50s',             group: 'Pop & Rock',
    degrees: [0, 9, 5, 7],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-iii-IV-V',  name: 'Ascending bright',           group: 'Pop & Rock',
    degrees: [0, 4, 5, 7],   qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'I-iii-vi-IV', name: 'Emotional pop',              group: 'Pop & Rock',
    degrees: [0, 4, 9, 5],   qualities: ['maj', 'm', 'm', 'maj'] },
  { symbol: 'I-IV-I-V',    name: 'Blues-adjacent / country',   group: 'Pop & Rock',
    degrees: [0, 5, 0, 7],   qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-VII-IV-I',  name: 'Mixolydian feel',            group: 'Pop & Rock',
    degrees: [0, 10, 5, 0],  qualities: ['maj', 'maj', 'maj', 'maj'] },
  { symbol: 'I-bIII-IV',   name: 'Rock borrowed bIII',         group: 'Pop & Rock',
    degrees: [0, 3, 5],      qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'I-bIII-bVII', name: 'Power rock',                 group: 'Pop & Rock',
    degrees: [0, 3, 10],     qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'vi-I-V-IV',   name: 'Minor-start pop',            group: 'Pop & Rock',
    degrees: [9, 0, 7, 5],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'IV-I-V-vi',   name: 'IV-start axis',              group: 'Pop & Rock',
    degrees: [5, 0, 7, 9],   qualities: ['maj', 'maj', 'maj', 'm'] },
  { symbol: 'ii-IV-I-V',   name: 'Gospel',                     group: 'Pop & Rock',
    degrees: [2, 5, 0, 7],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'I-vi-ii-V',   name: 'Pop / jazz ballad',          group: 'Pop & Rock',
    degrees: [0, 9, 2, 7],   qualities: ['maj', 'm', 'm', 'maj'] },

  // ── Jazz (4–6 chords) ────────────────────────────────────────────────────
  { symbol: 'ii-V-I',      name: 'Jazz ii–V–I (major)',        group: 'Jazz',
    degrees: [2, 7, 0],   qualities: ['m7', '7', 'maj7'] },
  { symbol: 'ii-V-i',      name: 'Jazz ii–V–i (minor)',        group: 'Jazz',
    degrees: [2, 7, 0],   qualities: ['m7b5', '7', 'm'] },
  { symbol: 'ii-V-I-VI',   name: 'Jazz turnaround',            group: 'Jazz',
    degrees: [2, 7, 0, 9],   qualities: ['m7', '7', 'maj7', '7'] },
  { symbol: 'I-VI-ii-V',   name: 'Rhythm changes A',           group: 'Jazz',
    degrees: [0, 9, 2, 7],   qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'iii-VI-ii-V', name: 'Cycle of 5ths (jazz)',       group: 'Jazz',
    degrees: [4, 9, 2, 7],   qualities: ['m7', '7', 'm7', '7'] },
  { symbol: 'vi-ii-V-I',   name: 'Extended turnaround',        group: 'Jazz',
    degrees: [9, 2, 7, 0],   qualities: ['m7', 'm7', '7', 'maj7'] },
  { symbol: 'I-VI7-ii-V',  name: 'Turnaround (sec. dom)',      group: 'Jazz',
    degrees: [0, 9, 2, 7],   qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'ii-bVII7-I',  name: 'Backdoor dominant',          group: 'Jazz',
    degrees: [2, 10, 0],  qualities: ['m7', '7', 'maj7'] },
  { symbol: 'i-iv-VII-III',name: 'Minor jazz cycle',           group: 'Jazz',
    degrees: [0, 5, 10, 3],  qualities: ['m7', 'm7', '7', 'maj7'] },
  { symbol: 'i-iiø7-V7-i', name: 'Minor ii–V–I',              group: 'Jazz',
    degrees: [0, 2, 7, 0],   qualities: ['m', 'm7b5', '7', 'm'] },
  { symbol: 'ii-V-I-vi-ii-V', name: 'Jazz loop (6 chords)',   group: 'Jazz',
    degrees: [2, 7, 0, 9, 2, 7],  qualities: ['m7', '7', 'maj7', 'm7', 'm7', '7'] },

  // ── Blues (4–8 chords) ────────────────────────────────────────────────────
  { symbol: 'I7-IV7-I7-V7',     name: 'Jazz blues turnaround',      group: 'Blues',
    degrees: [0, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'I7-VI7-ii7-V7',    name: 'Jazz blues (4 chords)',      group: 'Blues',
    degrees: [0, 9, 2, 7],        qualities: ['7', '7', 'm7', '7'] },
  { symbol: 'I-V-IV-IV',        name: 'Eight-bar blues (short)',    group: 'Blues',
    degrees: [0, 7, 5, 5],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'I-IV-I-V',         name: 'Quick change (4 chords)',    group: 'Blues',
    degrees: [0, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  { symbol: 'V-IV-I-V',         name: 'Blues ending',               group: 'Blues',
    degrees: [7, 5, 0, 7],        qualities: ['7', '7', '7', '7'] },
  // 12-bar blues (8 chords — two bars each)
  { symbol: '12-bar',            name: '12-bar blues (standard)',    group: 'Blues',
    degrees: [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7],
    qualities: ['7','7','7','7','7','7','7','7','7','7','7','7'] },
  { symbol: '12-bar-qc',         name: '12-bar blues (quick change)', group: 'Blues',
    degrees: [0, 5, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7],
    qualities: ['7','7','7','7','7','7','7','7','7','7','7','7'] },
  { symbol: '12-bar-jazz',       name: '12-bar blues (jazz)',        group: 'Blues',
    degrees: [0, 5, 0, 9, 5, 5, 0, 3, 2, 10, 0, 7],
    qualities: ['7','7','7','7','7','7','maj7','7','m7','7','7','7'] },

  // ── Minor (4–6 chords) ────────────────────────────────────────────────────
  { symbol: 'i-VII-VI-VII', name: 'Natural minor loop',          group: 'Minor',
    degrees: [0, 10, 8, 10],  qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-VI-III-VII', name: 'Aeolian cycle',               group: 'Minor',
    degrees: [0, 8, 3, 10],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-v-i',     name: 'Pure minor / classical',      group: 'Minor',
    degrees: [0, 5, 7, 0],    qualities: ['m', 'm', 'm', 'm'] },
  { symbol: 'i-VI-VII-i',   name: 'Minor with return',           group: 'Minor',
    degrees: [0, 8, 10, 0],   qualities: ['m', 'maj', 'maj', 'm'] },
  { symbol: 'i-III-VII-VI', name: 'Epic / cinematic',            group: 'Minor',
    degrees: [0, 3, 10, 8],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-v-VI-VII',   name: 'Dramatic minor',              group: 'Minor',
    degrees: [0, 7, 8, 10],   qualities: ['m', 'm', 'maj', 'maj'] },
  { symbol: 'i-bVI-bIII-bVII', name: 'Aeolian (all borrowed)',   group: 'Minor',
    degrees: [0, 8, 3, 10],   qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-VII-III-VI-ii°-V-i', name: 'Harmonic minor circle', group: 'Minor',
    degrees: [0, 5, 10, 3, 8, 2, 7, 0],
    qualities: ['m', 'm', 'maj', 'maj', 'maj', 'dim', 'maj', 'm'] },

  // ── Rock (3–4 chords) ────────────────────────────────────────────────────
  { symbol: 'I-bVII-IV',    name: 'Mixolydian rock',             group: 'Rock',
    degrees: [0, 10, 5],    qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'i-bVII-bVI',   name: 'Aeolian rock',               group: 'Rock',
    degrees: [0, 10, 8],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVI-bVII',   name: 'Minor anthem',               group: 'Rock',
    degrees: [0, 8, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVII-IV-i',  name: 'Minor rock loop',            group: 'Rock',
    degrees: [0, 10, 5, 0], qualities: ['m', 'maj', 'maj', 'm'] },
  { symbol: 'i-iv-V-i',     name: 'Harmonic minor rock',        group: 'Rock',
    degrees: [0, 5, 7, 0],  qualities: ['m', 'm', 'maj', 'm'] },
  { symbol: 'I-bIII-bVII-IV', name: 'Classic rock borrowed',   group: 'Rock',
    degrees: [0, 3, 10, 5], qualities: ['maj', 'maj', 'maj', 'maj'] },

  // ── Reggae (3–4 chords) ──────────────────────────────────────────────────
  { symbol: 'I-IV-V-reg',   name: 'Roots reggae',               group: 'Reggae',
    degrees: [0, 5, 7],     qualities: ['maj', 'maj', 'maj'] },
  { symbol: 'i-bVII-reg',   name: 'Roots minor',                group: 'Reggae',
    degrees: [0, 10],       qualities: ['m', 'maj'] },
  { symbol: 'i-bVI-bVII-reg', name: 'Minor roots',              group: 'Reggae',
    degrees: [0, 8, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'I-vi-IV-V-reg', name: 'Lovers rock',              group: 'Reggae',
    degrees: [0, 9, 5, 7],  qualities: ['maj', 'm', 'maj', 'maj'] },
  { symbol: 'vi-IV-I-V-reg', name: 'Lovers rock (vi start)',   group: 'Reggae',
    degrees: [9, 5, 0, 7],  qualities: ['m', 'maj', 'maj', 'maj'] },

  // ── Samba & Bossa Nova (3–5 chords) ──────────────────────────────────────
  { symbol: 'I-VI7-ii-V7',  name: 'Samba turnaround',          group: 'Samba & Bossa',
    degrees: [0, 9, 2, 7],  qualities: ['maj7', '7', 'm7', '7'] },
  { symbol: 'iii-VI7-ii-V7', name: 'Samba cycle',              group: 'Samba & Bossa',
    degrees: [4, 9, 2, 7],  qualities: ['m7', '7', 'm7', '7'] },
  { symbol: 'I-III7-vi',    name: 'Passing secondary dom',      group: 'Samba & Bossa',
    degrees: [0, 4, 9],     qualities: ['maj7', '7', 'm7'] },
  { symbol: 'iiø7-V7-i-bossa', name: 'Bossa minor ii–V–i',    group: 'Samba & Bossa',
    degrees: [2, 7, 0],     qualities: ['m7b5', '7', 'm7'] },
  { symbol: 'i-VI7-iiø7-V7', name: 'Bossa minor turnaround',  group: 'Samba & Bossa',
    degrees: [0, 9, 2, 7],  qualities: ['m7', '7', 'm7b5', '7'] },
  { symbol: 'iv-bVII7-III', name: 'Minor bossa cadence',       group: 'Samba & Bossa',
    degrees: [5, 10, 3],    qualities: ['m7', '7', 'maj7'] },

  // ── Metal (2–4 chords) ───────────────────────────────────────────────────
  { symbol: 'i-bII',        name: 'Phrygian power',             group: 'Metal',
    degrees: [0, 1],        qualities: ['m', 'maj'] },
  { symbol: 'i-bII-bVII',   name: 'Phrygian loop',             group: 'Metal',
    degrees: [0, 1, 10],    qualities: ['m', 'maj', 'maj'] },
  { symbol: 'i-bVI-bIII-bVII', name: 'Neoclassical / Aeolian', group: 'Metal',
    degrees: [0, 8, 3, 10], qualities: ['m', 'maj', 'maj', 'maj'] },
  { symbol: 'i-iv-V-i-met', name: 'Harmonic minor metal',      group: 'Metal',
    degrees: [0, 5, 7, 0],  qualities: ['m', 'm', 'maj', 'm'] },
  { symbol: 'iii-vi-ii-V-i-neo', name: 'Neoclassical descending', group: 'Metal',
    degrees: [4, 9, 2, 7, 0],  qualities: ['m', 'm', 'm7b5', '7', 'm'] },

  // ── Extended (5–8 chords) ─────────────────────────────────────────────────
  { symbol: 'I-IV-V-IV-I',       name: 'Rock/blues return',          group: 'Extended',
    degrees: [0, 5, 7, 5, 0],          qualities: ['maj', 'maj', 'maj', 'maj', 'maj'] },
  { symbol: 'ii-V-I-IV-V',       name: 'Extended jazz cadence',      group: 'Extended',
    degrees: [2, 7, 0, 5, 7],          qualities: ['m7', '7', 'maj7', 'maj7', '7'] },
  { symbol: 'i-VII-VI-VII-i',    name: 'Minor with return',          group: 'Extended',
    degrees: [0, 10, 8, 10, 0],        qualities: ['m', 'maj', 'maj', 'maj', 'm'] },
  { symbol: 'I-iii-IV-iv-I-V',   name: 'Borrowed iv (Beatles)',      group: 'Extended',
    degrees: [0, 4, 5, 5, 0, 7],       qualities: ['maj', 'm', 'maj', 'm', 'maj', 'maj'] },
  { symbol: 'i-VII-VI-V-i-V',    name: 'Flamenco / classical minor', group: 'Extended',
    degrees: [0, 10, 8, 7, 0, 7],      qualities: ['m', 'maj', 'maj', 'maj', 'm', 'maj'] },
  // Romanesca / Pachelbel canon (8 chords)
  { symbol: 'Romanesca',          name: 'Romanesca / Pachelbel',      group: 'Extended',
    degrees: [0, 7, 9, 4, 5, 0, 5, 7],
    qualities: ['maj', 'maj', 'm', 'm', 'maj', 'maj', 'maj', 'maj'] },
  // Descending fifths sequence (8 chords)
  { symbol: 'desc-5ths',          name: 'Descending fifths sequence', group: 'Extended',
    degrees: [0, 5, 11, 4, 9, 2, 7, 0],
    qualities: ['maj', 'maj', 'dim', 'm', 'm', 'm', 'maj', 'maj'] },
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
const PROG_GROUPS = ['Cadences', 'Diminished', 'Classical', 'Short', 'Pop & Rock', 'Jazz', 'Blues', 'Minor', 'Rock', 'Reggae', 'Samba & Bossa', 'Metal', 'Extended'];

// Which groups start collapsed in the pool panel
const PROG_GROUP_COLLAPSED = {
  Diminished: true, Classical: true, Short: true,
  'Pop & Rock': true, Jazz: true, Blues: true,
  Minor: true, Rock: true, Reggae: true,
  'Samba & Bossa': true, Metal: true, Extended: true,
};

// ─── Progression state ────────────────────────────────────────────────────────
const selectedProgressions = new Set(
  PROGRESSIONS.filter(p => ['I-V-vi-IV', 'I-IV-V-I', 'ii-V-I', 'I-vi-IV-V'].includes(p.symbol)).map(p => p.symbol)
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
