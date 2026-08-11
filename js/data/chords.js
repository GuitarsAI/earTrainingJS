// POINT 9b: Six-family chord library — Berklee/Real Book professional symbols
// Each entry: { name, symbol, intervals, family }
// name   = display label shown to user (unicode ♭/♯)
// symbol = internal key (b/# ASCII, unique)
// family = groups chips in the pool panel
const CHORD_TYPES = {
  major: [
    { name: 'maj',              symbol: 'maj',           intervals: [0,4,7],             family: 'major' },
    { name: 'maj(add9)',        symbol: 'maj_add9',      intervals: [0,4,7,14],          family: 'major' },
    { name: 'add9(add11)',      symbol: 'add9_add11',    intervals: [0,4,7,14,17],       family: 'major' },
    { name: 'maj(add2)',        symbol: 'maj_add2',      intervals: [0,2,4,7],           family: 'major' },
    { name: 'maj(add4)',        symbol: 'maj_add4',      intervals: [0,4,5,7],           family: 'major' },
    { name: 'maj6',             symbol: 'maj6',          intervals: [0,4,7,9],           family: 'major' },
    { name: 'maj6(9)',          symbol: 'maj69',         intervals: [0,4,7,9,14],        family: 'major' },
    { name: 'Maj7',             symbol: 'Maj7',          intervals: [0,4,7,11],          family: 'major' },
    { name: 'Maj7(9)',          symbol: 'Maj7_9',        intervals: [0,4,7,11,14],       family: 'major' },
    { name: 'Maj7(\u266f11)',   symbol: 'Maj7_s11',      intervals: [0,4,7,11,18],       family: 'major' },
    { name: 'Maj7(13)',         symbol: 'Maj7_13',       intervals: [0,4,7,11,21],       family: 'major' },
    { name: 'Maj7(9)(\u266f11)',symbol: 'Maj7_9_s11',    intervals: [0,4,7,11,14,18],    family: 'major' },
    { name: 'Maj7(9)(13)',      symbol: 'Maj7_9_13',     intervals: [0,4,7,11,14,21],    family: 'major' },
    { name: 'Maj7(\u266f11)(13)',symbol:'Maj7_s11_13',   intervals: [0,4,7,11,18,21],    family: 'major' },
    { name: 'Maj7(9)(\u266f11)(13)',symbol:'Maj7_9_s11_13',intervals:[0,4,7,11,14,18,21],family: 'major' },
    { name: 'Maj7(9)(11)',        symbol: 'Maj7_9_11',     intervals: [0,4,7,11,14,17],    family: 'major' },
    { name: 'Maj7(9)(11)(13)',    symbol: 'Maj7_9_11_13',  intervals: [0,4,7,11,14,17,21], family: 'major' },
  ],
  minor: [
    { name: 'm',                symbol: 'm',             intervals: [0,3,7],             family: 'minor' },
    { name: 'm(add9)',          symbol: 'm_add9',        intervals: [0,3,7,14],          family: 'minor' },
    { name: 'm(add2)',          symbol: 'm_add2',        intervals: [0,2,3,7],           family: 'minor' },
    { name: 'm(add4)',          symbol: 'm_add4',        intervals: [0,3,5,7],           family: 'minor' },
    { name: 'm6',               symbol: 'm6',            intervals: [0,3,7,9],           family: 'minor' },
    { name: 'm6(9)',            symbol: 'm69',           intervals: [0,3,7,9,14],        family: 'minor' },
    { name: 'm7',               symbol: 'm7',            intervals: [0,3,7,10],          family: 'minor' },
    { name: 'm7(9)',            symbol: 'm7_9',          intervals: [0,3,7,10,14],       family: 'minor' },
    { name: 'm7(\u266d9)',      symbol: 'm7_b9',         intervals: [0,3,7,10,13],       family: 'minor' },
    { name: 'm7(11)',           symbol: 'm7_11',         intervals: [0,3,7,10,17],       family: 'minor' },
    { name: 'm7(13)',           symbol: 'm7_13',         intervals: [0,3,7,10,21],       family: 'minor' },
    { name: 'm7(9)(11)',        symbol: 'm7_9_11',       intervals: [0,3,7,10,14,17],    family: 'minor' },
    { name: 'm7(9)(13)',        symbol: 'm7_9_13',       intervals: [0,3,7,10,14,21],    family: 'minor' },
    { name: 'm7(11)(13)',       symbol: 'm7_11_13',      intervals: [0,3,7,10,17,21],    family: 'minor' },
    { name: 'm7(9)(11)(13)',    symbol: 'm7_9_11_13',    intervals: [0,3,7,10,14,17,21], family: 'minor' },
    { name: 'm(Maj7)',          symbol: 'mMaj7',         intervals: [0,3,7,11],          family: 'minor' },
    { name: 'm(Maj7)(9)',       symbol: 'mMaj7_9',       intervals: [0,3,7,11,14],       family: 'minor' },
    { name: 'm(Maj7)(9)(11)',   symbol: 'mMaj7_9_11',    intervals: [0,3,7,11,14,17],    family: 'minor' },
    { name: 'm(Maj7)(9)(11)(13)', symbol: 'mMaj7_9_11_13', intervals: [0,3,7,11,14,17,21], family: 'minor' },
  ],
  dominant: [
    { name: '7',                symbol: '7',             intervals: [0,4,7,10],          family: 'dominant' },
    { name: '7(9)',             symbol: '7_9',           intervals: [0,4,7,10,14],       family: 'dominant' },
    { name: '7(\u266d9)',       symbol: '7_b9',          intervals: [0,4,7,10,13],       family: 'dominant' },
    { name: '7(\u266f9)',       symbol: '7_s9',          intervals: [0,4,7,10,15],       family: 'dominant' },
    { name: '7(\u266f11)',      symbol: '7_s11',         intervals: [0,4,7,10,18],       family: 'dominant' },
    { name: '7(\u266d13)',      symbol: '7_b13',         intervals: [0,4,7,10,20],       family: 'dominant' },
    { name: '7(13)',            symbol: '7_13',          intervals: [0,4,7,10,21],       family: 'dominant' },
    { name: '7(9)(13)',         symbol: '7_9_13',        intervals: [0,4,7,10,14,21],    family: 'dominant' },
    { name: '7(\u266d9)(\u266d13)',symbol:'7_b9_b13',   intervals: [0,4,7,10,13,20],    family: 'dominant' },
    { name: '7(\u266f9)(\u266f11)',symbol:'7_s9_s11',   intervals: [0,4,7,10,15,18],    family: 'dominant' },
    { name: '7(\u266f9)(\u266d13)',symbol:'7_s9_b13',   intervals: [0,4,7,10,15,20],    family: 'dominant' },
    { name: '7(9)(\u266f11)',   symbol: '7_9_s11',      intervals: [0,4,7,10,14,18],    family: 'dominant' },
    { name: '7(9)(\u266f11)(13)',symbol:'7_9_s11_13',   intervals: [0,4,7,10,14,18,21], family: 'dominant' },
    { name: '7(\u266d9)(\u266f11)',symbol:'7_b9_s11',   intervals: [0,4,7,10,13,18],    family: 'dominant' },
    { name: '7(\u266d9)(\u266f11)(\u266d13)',symbol:'7_b9_s11_b13',intervals:[0,4,7,10,13,18,20],family:'dominant'},
    { name: '7sus4',            symbol: '7sus4',         intervals: [0,5,7,10],          family: 'dominant' },
    { name: '7(9)sus4',         symbol: '7_9sus4',       intervals: [0,5,7,10,14],       family: 'dominant' },
    { name: '7(\u266d5)',       symbol: '7_b5',          intervals: [0,4,6,10],          family: 'dominant' },
    { name: '7(\u266f5)',       symbol: '7_s5',          intervals: [0,4,8,10],          family: 'dominant' },
    { name: '7(\u266f5)(9)',    symbol: '7_s5_9',        intervals: [0,4,8,10,14],       family: 'dominant' },
    { name: '11',               symbol: '11',            intervals: [0,4,7,10,14,17],    family: 'dominant' },
    { name: '7(\u266d9,\u266f9)', symbol: '7_b9_s9',    intervals: [0,4,7,10,13,15],    family: 'dominant' },
    { name: '13sus4',           symbol: '13sus4',        intervals: [0,5,7,10,14,21],    family: 'dominant' },
  ],
  diminished: [
    { name: 'dim',              symbol: 'dim',           intervals: [0,3,6],             family: 'diminished' },
    { name: 'm7(\u266d5)',      symbol: 'm7b5',          intervals: [0,3,6,10],          family: 'diminished' },
    { name: 'o7',               symbol: 'o7',            intervals: [0,3,6,9],           family: 'diminished' },
    { name: 'o7(Maj7)',         symbol: 'o7_Maj7',       intervals: [0,3,6,9,11],        family: 'diminished' },
  ],
  augmented: [
    { name: 'aug',              symbol: 'aug',           intervals: [0,4,8],             family: 'augmented' },
    { name: 'Maj7(\u266f5)',    symbol: 'Maj7_s5',       intervals: [0,4,8,11],          family: 'augmented' },
    { name: 'aug7',             symbol: 'aug7',          intervals: [0,4,8,10],          family: 'augmented' },
    { name: 'aug9',             symbol: 'aug9',          intervals: [0,4,8,10,14],       family: 'augmented' },
  ],
  suspended: [
    { name: 'sus2',             symbol: 'sus2',          intervals: [0,2,7],             family: 'suspended' },
    { name: 'sus4',             symbol: 'sus4',          intervals: [0,5,7],             family: 'suspended' },
    { name: '5',                symbol: 'power',         intervals: [0,7],               family: 'suspended' },
    { name: 'sus2(Maj7)',       symbol: 'sus2_Maj7',     intervals: [0,2,7,11],          family: 'suspended' },
    { name: 'sus4(add9)',       symbol: 'sus4_add9',     intervals: [0,5,7,14],          family: 'suspended' },
  ],

  // Classical chords — chromatic pre-dominant chords from common-practice harmony.
  // All are built from the bass note (♭6 / le for aug sixths; ♭2 for Neapolitan).
  // Root in the app = the bass reference note as described above.
  // classicalNote: shown in the breakdown as a 'Classical function' sub-section.
  classical: [
    // Neapolitan — major triad on ♭II; typically appears in first inversion (N6)
    { name: 'N6 (Neapolitan)',    symbol: 'N6',      intervals: [0,4,7],    family: 'classical',
      classicalNote: '\u266dII major triad — pre-dominant chord in classical harmony. Typically appears in first inversion (N\u2076). Resolves to V or V\u2077.' },
    // Italian augmented sixth — built from \u266d6: \u266d6\u20131\u2013\u266f4 (aug 6th between outer voices)
    { name: 'It\u207a\u2076 (Italian +6)', symbol: 'It6',  intervals: [0,4,9],    family: 'classical',
      classicalNote: 'Italian augmented sixth — \u266d6, 1, \u266f4 from the bass. The augmented sixth interval (\u266d6\u2013\u266f4) expands outward to the octave V. Resolves to V.' },
    // French augmented sixth — \u266d6\u20131\u20132\u2013\u266f4
    { name: 'Fr\u207a\u2076 (French +6)',  symbol: 'Fr6',  intervals: [0,4,6,9],  family: 'classical',
      classicalNote: 'French augmented sixth — \u266d6, 1, 2, \u266f4 from the bass. Contains a whole-tone tetrachord; the most dissonant of the three. Resolves to V.' },
    // German augmented sixth — \u266d6\u20131\u2013\u266d3\u2013\u266f4 (enharmonic = dom7)
    { name: 'Ger\u207a\u2076 (German +6)', symbol: 'Ger6', intervals: [0,4,7,9],  family: 'classical',
      classicalNote: 'German augmented sixth — \u266d6, 1, \u266d3, \u266f4 from the bass. Enharmonically identical to a dominant 7th chord. Resolves to V (often via I\u2076\u2084 to avoid parallel 5ths).' },
  ],

  // Quartal / Quintal chords — built by stacking perfect fourths (quartal) or perfect fifths
  // (quintal) instead of thirds. Quintal is the inversion of quartal — same pitch content,
  // different stacking order. Common in jazz (McCoy Tyner, Bill Evans, Herbie Hancock) and
  // 20th-century classical (Hindemith, Bartók, Schoenberg).
  // quartal: true — triggers custom breakdown path (modal contexts instead of chord scales,
  //                  adjacent interval analysis in 'Quartal construction' sub-section).
  // quartNote: detailed note shown in the 'Quartal construction' breakdown sub-section.
  quartal: [
    // 3-note quartal: two stacked perfect fourths
    { name: 'qrt3 (Quartal, 3-note)',   symbol: 'qrt3',  intervals: [0,5,10],     family: 'quartal', quartal: true,
      quartNote: 'Three-note quartal chord — two stacked perfect fourths (P4 + P4). The most compact quartal voicing: rootless and tonally ambiguous, any of the three notes can function as the root depending on context. Pioneered in jazz by McCoy Tyner and used throughout modal jazz. Fits naturally over Dorian, Mixolydian, Lydian, Phrygian, and Aeolian — the absence of a third means it floats freely across major and minor contexts. Sound character: open, suspended, modern.' },
    // 4-note quartal: three stacked perfect fourths
    { name: 'qrt4 (Quartal, 4-note)',   symbol: 'qrt4',  intervals: [0,5,10,15],  family: 'quartal', quartal: true,
      quartNote: 'Four-note quartal chord — three stacked perfect fourths (P4 + P4 + P4). The workhorse quartal voicing in jazz piano and guitar comping. Completely symmetrical stack — all adjacent intervals are equal, making root ambiguity total. Used extensively by McCoy Tyner on John Coltrane recordings (A Love Supreme, My Favorite Things) to create a dense, modal wash. Fits Dorian, Mixolydian, Lydian, and Aeolian contexts. Sound character: full, angular, harmonically suspended.' },
    // 5-note "So What" chord: three P4s + one M3 on top
    { name: 'qrt5 (So What)',           symbol: 'qrt5',  intervals: [0,5,10,15,19], family: 'quartal', quartal: true,
      quartNote: 'Five-note "So What" chord — three stacked perfect fourths plus a major third on top (P4 + P4 + P4 + M3). Named for its use by Bill Evans on Miles Davis\u2019 "So What" (Kind of Blue, 1959) — one of the most iconic voicings in jazz history. The major third at the top gives it a subtle warmth compared to a pure quartal stack. Specifically a Dorian voicing: the two shapes Evans played move diatonically up the D Dorian scale. Sound character: lush, modern, modal — the definitive sound of late-1950s jazz impressionism.' },
    // Mixed quartal with tritone
    { name: 'qrtTT (Quartal + TT)',     symbol: 'qrtTT', intervals: [0,5,10,16],  family: 'quartal', quartal: true,
      quartNote: 'Mixed quartal chord — two perfect fourths plus an augmented fourth / tritone on top (P4 + P4 + A4). The tritone replaces the third perfect fourth, injecting tension into the otherwise stable quartal stack. This variant appears in diatonic quartal harmonisations wherever the tritone falls naturally (e.g. B\u2013E\u2013A\u2013E\u266f in C major). Creates a more dissonant, unstable sound than a pure quartal stack. Fits Lydian (the tritone is the characteristic \u266f4) and Lydian Dominant contexts. Sound character: tense, searching, unresolved.' },
    // 3-note quintal: two stacked perfect fifths
    { name: 'qnt3 (Quintal, 3-note)',   symbol: 'qnt3',  intervals: [0,7,14],     family: 'quartal', quartal: true,
      quartNote: 'Three-note quintal chord — two stacked perfect fifths (P5 + P5). The inversional equivalent of the three-note quartal chord: same three pitch classes, wider spacing. Where quartal sounds compact and interlocked, quintal sounds open and spacious — like a power chord expanded upward. Common in Hindemith\u2019s 20th-century counterpoint and in orchestral writing as a "neutral" sonority with no major/minor identity. Fits Dorian, Mixolydian, and Lydian. Sound character: open, hollow, vast — medieval and modern at once.' },
    // 4-note quintal: three stacked perfect fifths
    { name: 'qnt4 (Quintal, 4-note)',   symbol: 'qnt4',  intervals: [0,7,14,21],  family: 'quartal', quartal: true,
      quartNote: 'Four-note quintal chord — three stacked perfect fifths (P5 + P5 + P5). The widest-spanning standard quintal voicing, spanning three octaves minus a whole tone. Inversionally equivalent to the four-note quartal chord but voiced with maximum registral spread. Creates an enormous, cathedral-like sonority when played in the lower register; translucent and ringing in the upper register. Used in Hindemith, Bart\u00f3k, and contemporary orchestral writing for its tonal neutrality and resonance. Sound character: expansive, resonant, harmonically open.' },
  ],

  // Cluster / Secundal chords — built by stacking major or minor seconds instead of thirds
  // or fourths. More timbral than harmonic: dense dissonant sound masses used in contemporary
  // classical, avant-garde, film scoring, and ambient music.
  // cluster: true — triggers custom breakdown path (no chord scales — "timbral chord" note,
  //                  adjacent interval analysis in 'Cluster construction' sub-section).
  // clustNote: detailed note shown in the 'Cluster construction' breakdown sub-section.
  cluster: [
    // 3-note major-second cluster
    { name: 'clust M2 (3-note)',        symbol: 'clust_M2_3',  intervals: [0,2,4],     family: 'cluster', cluster: true,
      clustNote: 'Three-note major-second cluster — two stacked whole tones (M2 + M2). The mildest cluster voicing: the three notes form the first three degrees of the whole-tone scale, giving it a floating, Impressionist quality rather than a purely percussive noise mass. Debussy and Ravel used this spacing frequently in their piano music. All three pitches can be found in a dominant 7th(♯11) context (e.g. C\u2013D\u2013E over a G7 chord). Sound character: bright, slightly tense, Impressionistic — more colouristic than dissonant.' },
    // 3-note minor-second cluster
    { name: 'clust m2 (3-note)',        symbol: 'clust_m2_3',  intervals: [0,1,2],     family: 'cluster', cluster: true,
      clustNote: 'Three-note minor-second cluster — two stacked semitones (m2 + m2). The most intensely dissonant three-note voicing possible. Three adjacent chromatic pitches played simultaneously create a dense sound mass with no tonal centre — the ear cannot extract a chord quality, only a percussive noise event. Used by Bartók in his piano works (Mikrokosmos, piano concertos) for dramatic effect, and in avant-garde and film music to suggest tension, violence, or chaos. Sound character: extremely dissonant, percussive, avant-garde.' },
    // 4-note mixed cluster: m2 + M2 + m2
    { name: 'clust mix (4-note)',       symbol: 'clust_mix_4', intervals: [0,1,3,4],   family: 'cluster', cluster: true,
      clustNote: 'Four-note mixed cluster — alternating semitone and whole tone (m2 + M2 + m2). The combination of minor and major seconds creates a slightly less uniform, more "organic" cluster than a pure chromatic stack. The outer notes span a major third, which gives the voicing a distant tertian shadow while remaining thoroughly dissonant. Found in Messiaen\u2019s "modes of limited transposition" contexts and in jazz as a dense interior voicing. The interval pattern [0,1,3,4] is the first four notes of a chromatic scale with one gap. Sound character: dense, complex, dissonant but with subtle internal structure.' },
    // 4-note chromatic cluster
    { name: 'clust chr (4-note)',       symbol: 'clust_chr_4', intervals: [0,1,2,3],   family: 'cluster', cluster: true,
      clustNote: 'Four-note chromatic cluster — three consecutive semitones (m2 + m2 + m2). Four adjacent chromatic pitches: the densest, most dissonant standard cluster voicing. No interval larger than a semitone appears between any adjacent pair, making it a pure noise mass with no implied harmony. Henry Cowell coined the term "tone cluster" in the 1920s for this technique, which he notated as solid black rectangles on the staff. Later adopted by Bartók, Ligeti, Penderecki, and film composers. In jazz, compressed chromatic clusters appear in stride piano and as percussive colour in avant-garde playing. Sound character: maximally dissonant, percussive, noise-mass — the most extreme timbral effect available on a standard keyboard.' },
  ],

  // POINT 25 (redesigned): Slash chords — root-agnostic types, like every other family.
  // upperIntervals: semitones of the upper triad from its own root (always root-position)
  // bassInterval:   PITCH CLASS offset from the upper root UP to the bass note (1-11,
  //                  always positive — the bass note's pc is (upperRootPc + bassInterval) mod 12).
  //                  At question time the bass is placed the complementary distance BELOW the
  //                  upper root: soundingSemitonesBelow = 12 - bassInterval.
  // belowLabel:      plain interval name for that sounding-below distance (m2/M2/.../M7/TT),
  //                  used in the type name — matches how bass notes are actually described in
  //                  standard chord-symbol practice (as an interval/scale-degree of the chord
  //                  itself), not a fixed major-scale Roman numeral independent of chord quality.
  // The upper root is randomised per question exactly like every other chord family.
  // The quiz plays bass note first, then upper chord; notation splits across grand staff.
  slash: [
    // Major upper triad (excludes offsets 0, 4, 7 — those are the triad's own tones)
    { name: 'maj / M7 below',  symbol: 'slashMaj_M7below',  upperIntervals: [0,4,7], bassInterval: 1,  belowLabel: 'M7', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / m7 below',  symbol: 'slashMaj_m7below',  upperIntervals: [0,4,7], bassInterval: 2,  belowLabel: 'm7', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / M6 below',  symbol: 'slashMaj_M6below',  upperIntervals: [0,4,7], bassInterval: 3,  belowLabel: 'M6', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / P5 below',  symbol: 'slashMaj_P5below',  upperIntervals: [0,4,7], bassInterval: 5,  belowLabel: 'P5', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / TT below',  symbol: 'slashMaj_TTbelow',  upperIntervals: [0,4,7], bassInterval: 6,  belowLabel: 'TT', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / M3 below',  symbol: 'slashMaj_M3below',  upperIntervals: [0,4,7], bassInterval: 8,  belowLabel: 'M3', family: 'slash', upperQuality: 'maj', alsoKnownAs: 'Maj7(\u266f5)' },
    { name: 'maj / m3 below',  symbol: 'slashMaj_m3below',  upperIntervals: [0,4,7], bassInterval: 9,  belowLabel: 'm3', family: 'slash', upperQuality: 'maj', alsoKnownAs: 'm7' },
    { name: 'maj / M2 below',  symbol: 'slashMaj_M2below',  upperIntervals: [0,4,7], bassInterval: 10, belowLabel: 'M2', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / m2 below',  symbol: 'slashMaj_m2below',  upperIntervals: [0,4,7], bassInterval: 11, belowLabel: 'm2', family: 'slash', upperQuality: 'maj' },
    // Minor upper triad (excludes offsets 0, 3, 7 — those are the triad's own tones)
    { name: 'm / M7 below',    symbol: 'slashMin_M7below',  upperIntervals: [0,3,7], bassInterval: 1,  belowLabel: 'M7', family: 'slash', upperQuality: 'min' },
    { name: 'm / m7 below',    symbol: 'slashMin_m7below',  upperIntervals: [0,3,7], bassInterval: 2,  belowLabel: 'm7', family: 'slash', upperQuality: 'min' },
    { name: 'm / m6 below',    symbol: 'slashMin_m6below',  upperIntervals: [0,3,7], bassInterval: 4,  belowLabel: 'm6', family: 'slash', upperQuality: 'min' },
    { name: 'm / P5 below',    symbol: 'slashMin_P5below',  upperIntervals: [0,3,7], bassInterval: 5,  belowLabel: 'P5', family: 'slash', upperQuality: 'min' },
    { name: 'm / TT below',    symbol: 'slashMin_TTbelow',  upperIntervals: [0,3,7], bassInterval: 6,  belowLabel: 'TT', family: 'slash', upperQuality: 'min' },
    { name: 'm / M3 below',    symbol: 'slashMin_M3below',  upperIntervals: [0,3,7], bassInterval: 8,  belowLabel: 'M3', family: 'slash', upperQuality: 'min', alsoKnownAs: 'Maj7' },
    { name: 'm / m3 below',    symbol: 'slashMin_m3below',  upperIntervals: [0,3,7], bassInterval: 9,  belowLabel: 'm3', family: 'slash', upperQuality: 'min', alsoKnownAs: 'm7(\u266d5)' },
    { name: 'm / M2 below',    symbol: 'slashMin_M2below',  upperIntervals: [0,3,7], bassInterval: 10, belowLabel: 'M2', family: 'slash', upperQuality: 'min' },
    { name: 'm / m2 below',    symbol: 'slashMin_m2below',  upperIntervals: [0,3,7], bassInterval: 11, belowLabel: 'm2', family: 'slash', upperQuality: 'min' },
  ],
  // POINT 26: Polychords — two independent triads, each root-agnostic.
  // lowerOffset: semitones from upper root DOWN to lower root (always positive, 1–11).
  // upperIntervals / lowerIntervals: intervals within each triad from its own root.
  // At question time: upperRootMidi is chosen freely; lowerRootMidi = upperRootMidi - lowerOffset.
  // Lower chord rendered in bass staff, upper in treble.
  poly: [
    { name: 'Maj / Maj (P5 below)',  symbol: 'poly_MM_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'maj', family:'poly' },
    { name: 'Maj / Maj (TT below)',  symbol: 'poly_MM_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'maj', family:'poly' },
    { name: 'Maj / Min (P5 below)',  symbol: 'poly_Mm_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'min', family:'poly' },
    { name: 'Maj / Min (TT below)',  symbol: 'poly_Mm_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'min', family:'poly' },
    { name: 'Min / Maj (P5 below)',  symbol: 'poly_mM_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'maj', family:'poly' },
    { name: 'Min / Maj (TT below)',  symbol: 'poly_mM_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'maj', family:'poly' },
    { name: 'Min / Min (P5 below)',  symbol: 'poly_mm_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'min', family:'poly' },
    { name: 'Min / Min (TT below)',  symbol: 'poly_mm_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'min', family:'poly' },
    // POINT 34: Aug upper triad (symmetrical — 3 enharmonic roots)
    { name: 'Aug / Maj (P5 below)',  symbol: 'poly_aM_P5',  upperIntervals:[0,4,8], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'aug', lowerSymbol:'maj', family:'poly' },
    { name: 'Aug / Maj (TT below)',  symbol: 'poly_aM_TT',  upperIntervals:[0,4,8], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'aug', lowerSymbol:'maj', family:'poly' },
    { name: 'Aug / Min (P5 below)',  symbol: 'poly_am_P5',  upperIntervals:[0,4,8], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'aug', lowerSymbol:'min', family:'poly' },
    { name: 'Aug / Min (TT below)',  symbol: 'poly_am_TT',  upperIntervals:[0,4,8], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'aug', lowerSymbol:'min', family:'poly' },
    // POINT 34: Maj / Aug lower
    { name: 'Maj / Aug (P5 below)',  symbol: 'poly_Ma_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,8], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'aug', family:'poly' },
    { name: 'Maj / Aug (TT below)',  symbol: 'poly_Ma_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,8], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'aug', family:'poly' },
    { name: 'Min / Aug (P5 below)',  symbol: 'poly_ma_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,8], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'aug', family:'poly' },
    { name: 'Min / Aug (TT below)',  symbol: 'poly_ma_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,8], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'aug', family:'poly' },
    // POINT 34: Dom7 upper structure
    { name: 'Dom7 / Maj (P5 below)', symbol: 'poly_7M_P5',  upperIntervals:[0,4,7,10], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'7', lowerSymbol:'maj', family:'poly' },
    { name: 'Dom7 / Maj (TT below)', symbol: 'poly_7M_TT',  upperIntervals:[0,4,7,10], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'7', lowerSymbol:'maj', family:'poly' },
    { name: 'Dom7 / Min (P5 below)', symbol: 'poly_7m_P5',  upperIntervals:[0,4,7,10], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'7', lowerSymbol:'min', family:'poly' },
    { name: 'Dom7 / Min (TT below)', symbol: 'poly_7m_TT',  upperIntervals:[0,4,7,10], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'7', lowerSymbol:'min', family:'poly' },
    // POINT 34: Maj / Dom7 lower
    { name: 'Maj / Dom7 (P5 below)', symbol: 'poly_M7_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7,10], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'7', family:'poly' },
    { name: 'Maj / Dom7 (TT below)', symbol: 'poly_M7_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7,10], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'7', family:'poly' },
    { name: 'Min / Dom7 (P5 below)', symbol: 'poly_m7_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7,10], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'7', family:'poly' },
    { name: 'Min / Dom7 (TT below)', symbol: 'poly_m7_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7,10], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'7', family:'poly' },
  ],

  // POINT 26: Upper Structure Triads (UST) — jazz rootless dominant 7th voicings.
  // Shell = [M3, m7] = intervals [4, 10] from the chord root.
  // upperTriadRoot: semitones ABOVE the chord root where the upper triad root sits.
  // upperTriadIntervals: [0,4,7] (major) or [0,3,7] (minor) from upperTriadRoot.
  // tensions / resultingChord: the full chord symbol implied by shell + upper triad.
  // ustNumber: scale-degree label (e.g. ♭II = major triad on ♭2 above root).
  ust: [
    // UST ♭II — major triad on ♭II above root → 7(♭9)(♯11)(♭13) — "the Bartók UST"
    { name: 'UST ♭II (♭II maj over dom7)',  symbol: 'ust_I',   shellIntervals:[4,10], upperTriadRoot:1,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭II',   tensions:'♭9, ♯11, ♭13', resultingChord:'7(♭9)(♯11)(♭13)', family:'ust', subFamily:'dom7' },
    // UST II — major triad on II above root → 7(9)(♯11)(13)
    { name: 'UST II (II maj over dom7)',    symbol: 'ust_II',  shellIntervals:[4,10], upperTriadRoot:2,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'II',    tensions:'9, ♯11, 13',   resultingChord:'7(9)(♯11)(13)',  family:'ust', subFamily:'dom7' },
    // UST ♭III — major triad on ♭III → 7(♯9)(♯11)
    { name: 'UST ♭III (♭III maj over dom7)', symbol: 'ust_III', shellIntervals:[4,10], upperTriadRoot:3, upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭III',  tensions:'♯9, ♯11',     resultingChord:'7(♯9)(♯11)',    family:'ust', subFamily:'dom7' },
    // UST ♭V — major triad on ♭V/♯IV → 7(♯9)(♭13) — tritone sub colour
    { name: 'UST ♭V (♭V maj over dom7)',    symbol: 'ust_IV',  shellIntervals:[4,10], upperTriadRoot:6, upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭V',    tensions:'♯9, ♭13',     resultingChord:'7(♯9)(♭13)',    family:'ust', subFamily:'dom7' },
    // UST V — major triad on V → 7(9)(13) — "bright" UST
    { name: 'UST V (V maj over dom7)',      symbol: 'ust_V',   shellIntervals:[4,10], upperTriadRoot:7,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'V',     tensions:'9, 13',        resultingChord:'7(9)(13)',       family:'ust', subFamily:'dom7' },
    // UST VI — major triad on VI → 7(13) — common in jazz
    { name: 'UST VI (VI maj over dom7)',    symbol: 'ust_VI',  shellIntervals:[4,10], upperTriadRoot:9,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'VI',    tensions:'13',           resultingChord:'7(13)',          family:'ust', subFamily:'dom7' },
    // UST IIm — minor triad on II → 7(9)(11) — "McCoy Tyner" sound
    { name: 'UST IIm (II min over dom7)',   symbol: 'ust_VII', shellIntervals:[4,10], upperTriadRoot:2,  upperTriadIntervals:[0,3,7], upperQuality:'min', ustNumber:'IIm',   tensions:'9, 11',        resultingChord:'7(9)(11)',       family:'ust', subFamily:'dom7' },

    // POINT 35: Minor shell UST — shell = [m3, m7] = [3, 10] — implies m7 chord context
    // Upper triads voiced over a minor 7th shell (root not played)
    // IIm over m7 → m7(9)(11) — Dorian flavour
    { name: 'UST IIm (II min over m7)',    symbol: 'ust_m_IIm',  shellIntervals:[3,10], upperTriadRoot:2,  upperTriadIntervals:[0,3,7], upperQuality:'min', ustNumber:'IIm',  tensions:'9, 11',    resultingChord:'m7(9)(11)',    family:'ust', shellQuality:'min', subFamily:'min' },
    // IV over m7 → m7(11)(13) — Dorian brightness
    { name: 'UST IV (IV maj over m7)',     symbol: 'ust_m_IV',   shellIntervals:[3,10], upperTriadRoot:5,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'IV',   tensions:'11, 13',   resultingChord:'m7(11)(13)',   family:'ust', shellQuality:'min', subFamily:'min' },
    // ♭VII over m7 → m7(9) — warm, open Dorian voicing
    { name: 'UST ♭VII (♭VII maj over m7)', symbol: 'ust_m_bVII', shellIntervals:[3,10], upperTriadRoot:10, upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭VII', tensions:'9',        resultingChord:'m7(9)',        family:'ust', shellQuality:'min', subFamily:'min' },
    // ♭VI over m7 → m9(♭13) — Phrygian / Aeolian colour
    { name: 'UST ♭VI (♭VI maj over m7)',   symbol: 'ust_m_bVI',  shellIntervals:[3,10], upperTriadRoot:8,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭VI',  tensions:'♭13',      resultingChord:'m7(♭13)',      family:'ust', shellQuality:'min', subFamily:'min' },

    // POINT 35: Maj7 shell UST — shell = [M3, M7] = [4, 11] — implies Maj7 chord context
    // Upper triads voiced over a major 7th shell (root not played)
    // II over Maj7 → Maj7(9)(♯11) — Lydian sound
    { name: 'UST II (II maj over Maj7)',   symbol: 'ust_M7_II',  shellIntervals:[4,11], upperTriadRoot:2,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'II',   tensions:'9, ♯11',   resultingChord:'Maj7(9)(♯11)',  family:'ust', shellQuality:'maj7', subFamily:'maj7' },
    // IIm over Maj7 → Maj7(9) — warm, lush
    { name: 'UST IIm (II min over Maj7)',  symbol: 'ust_M7_IIm', shellIntervals:[4,11], upperTriadRoot:2,  upperTriadIntervals:[0,3,7], upperQuality:'min', ustNumber:'IIm',  tensions:'9',        resultingChord:'Maj7(9)',       family:'ust', shellQuality:'maj7', subFamily:'maj7' },
    // V over Maj7 → Maj7(9)(13) — bright, full Ionian
    { name: 'UST V (V maj over Maj7)',     symbol: 'ust_M7_V',   shellIntervals:[4,11], upperTriadRoot:7,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'V',    tensions:'9, 13',    resultingChord:'Maj7(9)(13)',   family:'ust', shellQuality:'maj7', subFamily:'maj7' },
    // VIm over Maj7 → Maj7(13) — sophisticated, modal
    { name: 'UST VIm (VI min over Maj7)',  symbol: 'ust_M7_VIm', shellIntervals:[4,11], upperTriadRoot:9,  upperTriadIntervals:[0,3,7], upperQuality:'min', ustNumber:'VIm',  tensions:'13',       resultingChord:'Maj7(13)',      family:'ust', shellQuality:'maj7', subFamily:'maj7' },
  ],
};

// POINT 5: All 13 intervals (unison excluded — not quizzable by ear alone)
const INTERVALS = [
  { name: 'Minor 2nd',  symbol: 'm2',  semitones: 1  },
  { name: 'Major 2nd',  symbol: 'M2',  semitones: 2  },
  { name: 'Minor 3rd',  symbol: 'm3',  semitones: 3  },
  { name: 'Major 3rd',  symbol: 'M3',  semitones: 4  },
  { name: 'Perfect 4th',symbol: 'P4',  semitones: 5  },
  { name: 'Tritone (A4 / ♭5)',        symbol: 'TT',  semitones: 6  },
  { name: 'Perfect 5th',              symbol: 'P5',  semitones: 7  },
  { name: 'Aug 5th / Minor 6th',      symbol: 'm6',  semitones: 8  },
  { name: 'Major 6th',                symbol: 'M6',  semitones: 9  },
  { name: 'Minor 7th',  symbol: 'm7',  semitones: 10 },
  { name: 'Major 7th',  symbol: 'M7',  semitones: 11 },
  { name: 'Octave',     symbol: 'P8',  semitones: 12 },
  // POINT 39: Compound / extended intervals (> one octave)
  { name: 'Minor 9th',              symbol: 'm9',  semitones: 13, compound: true },
  { name: 'Major 9th',              symbol: 'M9',  semitones: 14, compound: true },
  { name: 'Aug 9th / ♯9th',         symbol: 'A9',  semitones: 15, compound: true },
  { name: 'Perfect 11th',           symbol: 'P11', semitones: 17, compound: true },
  { name: 'Aug 11th / ♯11th',       symbol: 'A11', semitones: 18, compound: true },
  { name: 'Minor 13th',             symbol: 'm13', semitones: 20, compound: true },
  { name: 'Major 13th',             symbol: 'M13', semitones: 21, compound: true },
];

// POINT 5: Playback styles for intervals
const INTERVAL_STYLES = [
  { name: 'Harmonic',   symbol: 'harmonic'   },
  { name: 'Ascending',  symbol: 'ascending'  },
  { name: 'Descending', symbol: 'descending' },
  { name: 'Random',     symbol: 'random'     }, // POINT 20b
];

// POINT 6: Playback modes for chords
const CHORD_PLAYBACK_STYLES = [
  { name: 'Block',       symbol: 'block'      },
  { name: 'Ascending',   symbol: 'ascending'  },
  { name: 'Descending',  symbol: 'descending' },
  { name: 'Broken',      symbol: 'broken'     },
  { name: 'Random',      symbol: 'random'     },
];

// POINT 7: Scale definitions — semitone intervals from root, one octave
// POINT 28: Scales reorganised by note count into four groups.
// Group boundaries: pentatonic [0,7), hexatonic [7,11), diatonic [11,23), octatonic [23,25)
// parentKey: { offset, quality } — offset in semitones from scale root to parent key root
// quality: 'major' | 'minor' | null (null = no standard key sig, fall back to C)
const SCALES = [
  // ── Pentatonic (5 notes) ──────────────────────────────────────────────────
  { name: 'Major Pentatonic', displayName: 'Major Pentatonic (Ionian Pentatonic)', symbol: 'pent_maj',     intervals: [0,2,4,7,9,12],       parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Minor Pentatonic', displayName: 'Minor Pentatonic (Aeolian Pentatonic)', symbol: 'pent_min',    intervals: [0,3,5,7,10,12],      parentKey: { offset: 0,  quality: 'minor' }, group: 'pentatonic' },
  { name: 'Dorian Pentatonic',     symbol: 'pent_dorian',   intervals: [0,2,3,7,9,12],   parentKey: { offset: -2, quality: 'major' }, group: 'pentatonic' },
  { name: 'Phrygian Pentatonic',   symbol: 'pent_phrygian', intervals: [0,1,3,5,7,12],   parentKey: { offset: -4, quality: 'major' }, group: 'pentatonic' },
  { name: 'Lydian Pentatonic',     symbol: 'pent_lydian',   intervals: [0,2,4,6,9,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'pentatonic' },
  { name: 'Mixolydian Pentatonic', symbol: 'pent_mixo',     intervals: [0,2,5,7,10,12],  parentKey: { offset: -7, quality: 'major' }, group: 'pentatonic' },
  { name: 'Locrian Pentatonic',    symbol: 'pent_locrian',  intervals: [0,1,3,6,8,12],   parentKey: { offset: -5, quality: 'major' }, group: 'pentatonic' },
  // ── Hexatonic (6 notes) ──────────────────────────────────────────────────
  { name: 'Blues',       symbol: 'blues',      intervals: [0,3,5,6,7,10,12],    parentKey: { offset: 0,  quality: 'minor' }, group: 'hexatonic' },
  { name: 'Whole Tone',  symbol: 'whole_tone', intervals: [0,2,4,6,8,10,12],    parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  { name: 'Augmented',   symbol: 'augmented_scale', intervals: [0,3,4,7,8,11,12], parentKey: { offset: 0, quality: 'major' }, group: 'hexatonic' },
  { name: 'Prometheus',  symbol: 'prometheus', intervals: [0,2,4,6,9,10,12],    parentKey: { offset: 0,  quality: 'major' }, group: 'hexatonic' },
  // ── Diatonic / Modal (7 notes) ───────────────────────────────────────────
  { name: 'Major',              symbol: 'major',      intervals: [0,2,4,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Natural Minor',      symbol: 'nat_minor',  intervals: [0,2,3,5,7,8,10,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Harmonic Minor',     symbol: 'harm_minor', intervals: [0,2,3,5,7,8,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Melodic Minor',      symbol: 'mel_minor',  intervals: [0,2,3,5,7,9,11,12],   parentKey: { offset: 0,  quality: 'minor' }, group: 'diatonic' },
  { name: 'Dorian',             symbol: 'dorian',     intervals: [0,2,3,5,7,9,10,12],   parentKey: { offset: -2, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian',           symbol: 'phrygian',   intervals: [0,1,3,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian',             symbol: 'lydian',     intervals: [0,2,4,6,7,9,11,12],   parentKey: { offset: 0,  quality: 'major' }, group: 'diatonic' },
  { name: 'Mixolydian',         symbol: 'mixolydian', intervals: [0,2,4,5,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Locrian',            symbol: 'locrian',    intervals: [0,1,3,5,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  { name: 'Phrygian Dominant',  symbol: 'phryg_dom',  intervals: [0,1,4,5,7,8,10,12],   parentKey: { offset: -4, quality: 'major' }, group: 'diatonic' },
  { name: 'Lydian Dominant',    symbol: 'lyd_dom',    intervals: [0,2,4,6,7,9,10,12],   parentKey: { offset: -7, quality: 'major' }, group: 'diatonic' },
  { name: 'Altered',            symbol: 'altered',    intervals: [0,1,3,4,6,8,10,12],   parentKey: { offset: -5, quality: 'major' }, group: 'diatonic' },
  // ── Octatonic (8 notes) ──────────────────────────────────────────────────
  { name: 'Diminished (W-H)',   symbol: 'dim_wh',     intervals: [0,2,3,5,6,8,9,11,12], parentKey: { offset: 0, quality: 'major' }, group: 'octatonic' },
  { name: 'Diminished (H-W)',   symbol: 'dim_hw',     intervals: [0,1,3,4,6,7,9,10,12], parentKey: { offset: 0, quality: 'major' }, group: 'octatonic' },
];

// POINT 7 / 20b: Scale playback direction options
const SCALE_DIRECTIONS = [
  { name: 'Ascending',  symbol: 'asc'    },
  { name: 'Descending', symbol: 'desc'   },
  { name: 'Both',       symbol: 'both'   },
  { name: 'Random',     symbol: 'random' }, // POINT 20b
];

