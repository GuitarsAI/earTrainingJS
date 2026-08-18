// ─── breakdown-progressions.js ────────────────────────────────────────────────
// Progressions branch of the breakdown panel.
// Depends on shared helpers/globals defined in breakdown.js:
//   makeNameHeader, makeBDRow, makeCSGroup, makeChordScalesRow, joinSep,
//   intervalAbbr, qualityFullName, spelledRoot, spelledNote, pcInterval,
//   currentMode, currentProgression, currentProgRootPc, currentProgRootMidi,
//   PROG_DEGREES, PROG_QUALITIES, progChordMidi, CHORD_TYPES
// Called from showBreakdown() in breakdown.js.
// ─────────────────────────────────────────────────────────────────────────────

const HARMONIC_FUNCTION = {
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
    7:       'Secondary dominant (V7/vi). Dominant seventh on the mediant — pulls to the submediant (vi); ubiquitous in jazz turnarounds and circle-of-fifths sequences.',
  },
  9: {
    default: 'Submediant. Relative minor of the tonic — tonic substitute, often follows V in a deceptive cadence.',
    m:       'Submediant minor. Relative minor of the tonic — pulls toward subdominant or back to tonic.',
    m7:      'Submediant minor seventh. Tonic substitute with jazz colour; common in turnarounds.',
    7:       'Secondary dominant (V7/ii). Dominant seventh on the submediant — pulls strongly to the supertonic (ii), common in jazz turnarounds and circle-of-fifths sequences.',
  },
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
  1: {
    default: '♭II (Neapolitan). Chromatic substitute for the subdominant — dramatic colour, common in classical and flamenco.',
    7:       'Secondary dominant (V7/IV) or Neapolitan dominant. Tritone sub territory — resolves down a semitone to I or up to IV.',
  },
  3: {
    default: '♭III major. Borrowed from the parallel minor. Bright yet modal — common in rock and pop.',
    7:       'Secondary dominant (V7/♭VI). Dominant seventh on ♭III — pulls to the flattened submediant; common in rock and pop chromatic motion.',
  },
  6: {
    default: '♯IV diminished. Chromatic passing chord — approaches V from below with strong voice-leading.',
    7:       'Secondary dominant (V7/iii) or tritone substitute. Dominant seventh on ♯IV — resolves to the mediant or substitutes for V7.',
  },
  8: {
    default: '♭VI major. Borrowed from the parallel minor — one of the most common borrowed chords in rock and pop.',
    7:       'Secondary dominant (V7/ii) or tritone sub for V7/V. Slides chromatically into V or resolves down to the supertonic.',
  },
};

function progFunctionNote(degSemis, qualSym) {
  const bucket = HARMONIC_FUNCTION[((degSemis % 12) + 12) % 12];
  if (!bucket) return null;
  return bucket[qualSym] || bucket.default || null;
}

function showBreakdownProgressions(panel) {
  if (!currentProgression) return;

  const { body: progBody } = makeNameHeader(panel, currentProgression.symbol + ' — ' + currentProgression.name);

  const rootName = spelledRoot(currentProgRootPc);
  makeBDRow(progBody, 'Key',   rootName + ' major');
  makeBDRow(progBody, 'Style', currentProgression.group);

  currentProgression.degrees.forEach((degSemis, i) => {
    const qualSym = currentProgression.qualities[i];

    const degObj  = PROG_DEGREES.find(d => d.semi === degSemis)   || { label: '?' };
    const qualObj = PROG_QUALITIES.find(q => q.sym === qualSym)   || { label: qualSym };

    const chordRootPc   = (currentProgRootPc + degSemis + 12) % 12;
    const chordRootName = spelledRoot(chordRootPc);

    const chordRootMidi = currentProgRootMidi + degSemis;
    const midiNotes     = progChordMidi(chordRootMidi, qualSym);

    const noteNames = midiNotes.map(m => {
      const semi = ((m % 12) - chordRootPc + 12) % 12;
      return spelledNote(semi, chordRootPc, qualSym);
    });

    // Build cs-section with custom header showing degree + chord name
    const section = document.createElement('div');
    section.className = 'cs-section';
    section.style.margin = '0.35rem 0';

    const chordHdr = document.createElement('div');
    chordHdr.className = 'cs-header';
    chordHdr.style.cursor = 'pointer';

    const degLabel = document.createElement('span');
    degLabel.style.cssText = 'color:var(--accent); margin-right:0.5rem; font-weight:700;';
    degLabel.textContent = degObj.label;

    const nameLabel = document.createElement('span');
    nameLabel.style.flex = '1';
    nameLabel.textContent = chordRootName + ' ' + qualityFullName(qualSym);

    const arrow = document.createElement('span');
    arrow.className = 'cs-arrow';
    arrow.textContent = '▸';

    chordHdr.appendChild(degLabel);
    chordHdr.appendChild(nameLabel);
    chordHdr.appendChild(arrow);

    const chordBody = document.createElement('div');
    chordBody.className = 'cs-body';
    chordBody.style.padding = '0.4rem 0.625rem';

    chordHdr.addEventListener('click', () => {
      const isOpen = chordBody.classList.toggle('open');
      arrow.textContent = isOpen ? '▾' : '▸';
    });

    section.appendChild(chordHdr);
    section.appendChild(chordBody);
    progBody.appendChild(section);

    makeBDRow(chordBody, 'Notes', joinSep(noteNames));

    const allChordTypes = [
      ...CHORD_TYPES.major,    ...CHORD_TYPES.minor,
      ...CHORD_TYPES.dominant, ...CHORD_TYPES.diminished,
      ...CHORD_TYPES.augmented, ...CHORD_TYPES.suspended,
    ];
    const ct = allChordTypes.find(c => c.symbol === qualSym);
    if (ct && ct.intervals.length > 1) {
      const fromRoot = ct.intervals.slice(1).map(semi => intervalAbbr(semi, qualSym));
      makeBDRow(chordBody, 'From root', joinSep(fromRoot));
    }

    const fnNote = progFunctionNote(degSemis, qualSym);
    if (fnNote) makeBDRow(chordBody, 'Function', fnNote);

    const chordPcs = new Set(midiNotes.map(m => ((m % 12) + 12) % 12));
    makeChordScalesRow(chordBody, chordRootPc, chordPcs);
  });

  panel.style.display = 'block';
  document.getElementById('breakdownWrapper').style.display = 'block';
}
