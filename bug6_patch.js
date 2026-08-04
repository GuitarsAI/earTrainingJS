// =============================================================================
// BUG-6 PATCH — Progression breakdown panel
// =============================================================================
//
// WHAT THIS FIXES:
//   After submitting an answer in Progressions quiz mode, the breakdown panel
//   never appeared. showBreakdown() had no 'progressions' branch and fell
//   through to the chord branch, which crashed silently because currentChord
//   is null during progressions.
//
// HOW TO APPLY:
//   This file contains two blocks. Insert each one at the marked location
//   in ear_training_chord_quiz_v4.html (or whatever the current version is).
//
//   BLOCK 1 → paste immediately ABOVE the line:
//               function showBreakdown() {
//             (currently around line 3663)
//
//   BLOCK 2 → paste INSIDE showBreakdown(), immediately ABOVE the line:
//               // ── POINT 25: SLASH CHORDS ──
//             (currently around line 3975)
//
// =============================================================================


// =============================================================================
// BLOCK 1 OF 2
// Insert immediately ABOVE:  function showBreakdown() {
// =============================================================================

// ─── BUG-6 FIX: Progression breakdown helpers ─────────────────────────────────

// Harmonic function note per degree semitone + quality symbol.
// Returns a short sentence describing the chord's role in the progression.
// Keys are semitones from the tonic (0–11). Each bucket has a 'default' entry
// plus optional overrides keyed by quality symbol (e.g. '7', 'm7', 'o7').
const HARMONIC_FUNCTION = {

  // ── Tonic function (I, i, iii, vi) — stability and rest ──────────────────
  0: {
    default: 'Tonic. Home chord — the point of rest and resolution.',
    m:       'Tonic minor. Home chord in a minor key — dark, stable.',
    maj7:    'Tonic major seventh. Stable home with a warm, floating colour.',
    m7:      'Tonic minor seventh. Home chord with added colour — common in jazz.',
    7:       'Dominant seventh on the tonic. Treats I as a dominant — the defining sound of the blues.',
  },
  4: {
    default: 'Mediant. Bridges tonic and subdominant; softens and colours major progressions.',
    m:       'Mediant minor. Tonic substitute — shares two notes with I major; gentle, introspective.',
    m7:      'Mediant minor seventh. Tonic-function colour chord, common in jazz and neo-soul.',
  },
  9: {
    default: 'Submediant. Relative minor of the tonic — tonic substitute, often follows V in a deceptive cadence.',
    m:       'Submediant minor. Relative minor of the tonic — pulls toward subdominant or back to tonic.',
    m7:      'Submediant minor seventh. Tonic substitute with jazz colour; common in turnarounds.',
  },

  // ── Subdominant function (IV, ii, ♭VII) — movement away from tonic ───────
  5: {
    default: 'Subdominant. Moves away from the tonic, typically toward the dominant.',
    m:       'Subdominant minor. Borrowed from the parallel minor — darker colour than IV major.',
    maj7:    'Subdominant major seventh. Soft pre-dominant colour; common in jazz and pop ballads.',
    7:       'Dominant seventh on IV. Treats IV as a secondary dominant — the defining sound of the blues.',
  },
  2: {
    default: 'Supertonic. Subdominant substitute — pre-dominant function, typically followed by V.',
    m:       'Supertonic minor. Pre-dominant — prepares the dominant in a ii–V–I.',
    m7:      'Supertonic minor seventh. Classic pre-dominant in jazz; the ii chord in ii–V–I.',
    m7b5:    'Half-diminished supertonic. Pre-dominant in minor ii–V–I — tense and unstable.',
    dim:     'Diminished supertonic. Strong pre-dominant pull toward V.',
  },
  10: {
    default: '♭VII major. Borrowed from the Mixolydian or Aeolian mode — ubiquitous in rock, pop, and film music.',
    7:       '♭VII dominant seventh. Backdoor dominant — resolves up by a whole step to I instead of the usual P4.',
  },

  // ── Dominant function (V, vii°) — tension seeking resolution ─────────────
  7: {
    default: 'Dominant. Creates tension that resolves to the tonic — the strongest harmonic pull in tonal music.',
    maj:     'Dominant major. Creates tension that resolves to the tonic — the strongest harmonic pull in tonal music.',
    7:       'Dominant seventh. The tritone between 3rd and ♭7th intensifies the pull to tonic — the engine of tonal harmony.',
    m:       'Dominant minor. Modal dominant — used in Dorian, Aeolian, and Mixolydian contexts; avoids the leading tone.',
  },
  11: {
    default: 'Leading tone. Dominant substitute — all tones pull strongly toward the tonic.',
    dim:     'Leading tone diminished triad. Dominant substitute — the upper three notes of a rootless V7.',
    o7:      'Fully diminished seventh. Symmetric dominant substitute; can resolve to tonic, relative major, or any of three enharmonic targets.',
    m7b5:    'Half-diminished seventh on the leading tone. Pre-dominant or dominant substitute in minor keys.',
  },

  // ── Chromatic / modal degrees ─────────────────────────────────────────────
  1: {
    default: '♭II (Neapolitan). Chromatic substitute for the subdominant — dramatic colour, common in classical and flamenco.',
  },
  3: {
    default: '♭III major. Borrowed from the parallel minor. Bright yet modal — common in rock and pop.',
  },
  6: {
    default: '♯IV diminished. Chromatic passing chord — approaches V from below with strong voice-leading.',
  },
  8: {
    default: '♭VI major. Borrowed from the parallel minor — one of the most common borrowed chords in rock and pop.',
    7:       '♭VI dominant seventh. Tritone substitute for II7 — slides chromatically into V or I.',
  },
};

// Resolve the harmonic function note for a given degree (semitones from tonic)
// and quality symbol. Falls back to bucket default, then null if not found.
function progFunctionNote(degSemis, qualSym) {
  const bucket = HARMONIC_FUNCTION[((degSemis % 12) + 12) % 12];
  if (!bucket) return null;
  return bucket[qualSym] || bucket.default || null;
}

// Return a full English quality name for display in the breakdown header.
function qualityFullName(sym) {
  const map = {
    'maj':   'major',
    'm':     'minor',
    '7':     'dominant 7th',
    'maj7':  'major 7th',
    'm7':    'minor 7th',
    'dim':   'diminished',
    'm7b5':  'half-diminished (ø7)',
    'o7':    'diminished 7th',
    'aug':   'augmented',
    'sus4':  'suspended 4th',
  };
  return map[sym] || sym;
}


// =============================================================================
// BLOCK 2 OF 2
// Insert INSIDE showBreakdown(), immediately ABOVE the line:
//   // ── POINT 25: SLASH CHORDS ──────────────────────────────────────────────
// =============================================================================

  // ── BUG-6 FIX: PROGRESSIONS ───────────────────────────────────────────────
  if (currentMode === 'progressions') {
    if (!currentProgression) return;

    // ── Header: symbol — name ────────────────────────────────────────────────
    const hdr = document.createElement('div');
    hdr.className = 'breakdown-header';
    hdr.textContent = currentProgression.symbol + ' — ' + currentProgression.name;
    panel.appendChild(hdr);

    // ── Key and style context ────────────────────────────────────────────────
    const rootName = spelledRoot(currentProgRootPc);
    makeBDRow(panel, 'Key',   rootName + ' major');
    makeBDRow(panel, 'Style', currentProgression.group);

    addDivider();

    // ── Per-chord rows ───────────────────────────────────────────────────────
    currentProgression.degrees.forEach((degSemis, i) => {
      const qualSym = currentProgression.qualities[i];

      // Degree label (case encodes quality: uppercase = major, lowercase = minor/dim)
      const degObj  = PROG_DEGREES.find(d => d.semi === degSemis)   || { label: '?' };
      const qualObj = PROG_QUALITIES.find(q => q.sym === qualSym)   || { label: qualSym };

      // Chord root at current key
      const chordRootPc   = (currentProgRootPc + degSemis + 12) % 12;
      const chordRootName = spelledRoot(chordRootPc);

      // MIDI notes for this chord slot
      const chordRootMidi = currentProgRootMidi + degSemis;
      const midiNotes     = progChordMidi(chordRootMidi, qualSym);

      // Spelled note names from the chord root
      const noteNames = midiNotes.map(m => {
        const semi = ((m % 12) - chordRootPc + 12) % 12;
        return spelledNote(semi, chordRootPc, qualSym);
      });

      // ── Chord sub-header: degree label (teal) + full chord name ─────────
      const chordHdr = document.createElement('div');
      chordHdr.className = 'breakdown-row';
      chordHdr.style.cssText = 'font-weight:600; padding-top:0.5rem;';
      chordHdr.innerHTML =
        `<span class="breakdown-key" style="color:var(--accent)">${degObj.label}</span>` +
        `<span class="breakdown-val">${chordRootName} ${qualityFullName(qualSym)}</span>`;
      panel.appendChild(chordHdr);

      // ── Notes ────────────────────────────────────────────────────────────
      makeBDRow(panel, 'Notes', joinSep(noteNames));

      // ── Intervals from chord root ─────────────────────────────────────────
      // Look up the chord type to get its interval array
      const allChordTypes = [
        ...CHORD_TYPES.major,    ...CHORD_TYPES.minor,
        ...CHORD_TYPES.dominant, ...CHORD_TYPES.diminished,
        ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended,
      ];
      const ct = allChordTypes.find(c => c.symbol === qualSym);
      if (ct && ct.intervals.length > 1) {
        const fromRoot = ct.intervals.slice(1).map(semi => intervalAbbr(semi, qualSym));
        makeBDRow(panel, 'From root', joinSep(fromRoot));
      }

      // ── Harmonic function note ────────────────────────────────────────────
      const fnNote = progFunctionNote(degSemis, qualSym);
      if (fnNote) makeBDRow(panel, 'Function', fnNote);

      // ── Chord scales (collapsible — same component as chord mode) ─────────
      const chordPcs = new Set(midiNotes.map(m => ((m % 12) + 12) % 12));
      makeChordScalesRow(panel, chordRootPc, chordPcs);

      // Divider between chords (omit after the last chord)
      if (i < currentProgression.degrees.length - 1) addDivider();
    });

    panel.style.display = 'block';
    document.getElementById('breakdownWrapper').style.display = 'block';
    return;
  }

// =============================================================================
// END OF PATCH
// =============================================================================
