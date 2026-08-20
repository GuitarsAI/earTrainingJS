/**
 * @file chords.js
 * @description Chord type library for The Sound Travels Ear Training — defines all
 * playable chord families, their interval structures, and playback style options.
 *
 * @module chords
 * @author Renato Fera P.
 * @copyright The Sound Travels 2026
 * @license MIT
 */

// =============================================================================
// CHORD_TYPES — complete chord library organised by family.
//
// Standard families (major, minor, dominant, diminished, augmented, suspended)
// share a common schema:
//
//   name      {string}   Display label shown to the user — uses Unicode ♭/♯ symbols.
//   symbol    {string}   Internal key — ASCII only (b/#), unique across all families.
//   intervals {number[]} Semitone offsets from the root (0 = root). Values above 11
//                        represent compound intervals (e.g. 14 = major 9th).
//   family    {string}   Groups the chord into a pool panel chip category.
//   basic     {boolean}  Optional. true = included in Basic difficulty mode.
//
// Specialised families extend this schema with additional fields documented
// at the head of each section below.
// =============================================================================

/**
 * Complete chord type library, keyed by family name.
 * Each family is an array of chord descriptor objects.
 *
 * @type {Object.<string, Array.<Object>>}
 */
const CHORD_TYPES = {
  major: [
    { name: 'maj',              symbol: 'maj',           intervals: [0,4,7],             family: 'major', basic: true },
    { name: 'maj(add9)',        symbol: 'maj_add9',      intervals: [0,4,7,14],          family: 'major' },
    { name: 'add9(add11)',      symbol: 'add9_add11',    intervals: [0,4,7,14,17],       family: 'major' },
    { name: 'maj(add2)',        symbol: 'maj_add2',      intervals: [0,2,4,7],           family: 'major' },
    { name: 'maj(add4)',        symbol: 'maj_add4',      intervals: [0,4,5,7],           family: 'major' },
    { name: 'maj6',             symbol: 'maj6',          intervals: [0,4,7,9],           family: 'major' },
    { name: 'maj6(9)',          symbol: 'maj69',         intervals: [0,4,7,9,14],        family: 'major' },
    { name: 'Maj7',             symbol: 'Maj7',          intervals: [0,4,7,11],          family: 'major', basic: true },
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
    { name: 'm',                symbol: 'm',             intervals: [0,3,7],             family: 'minor', basic: true },
    { name: 'm(add9)',          symbol: 'm_add9',        intervals: [0,3,7,14],          family: 'minor' },
    { name: 'm(add2)',          symbol: 'm_add2',        intervals: [0,2,3,7],           family: 'minor' },
    { name: 'm(add4)',          symbol: 'm_add4',        intervals: [0,3,5,7],           family: 'minor' },
    { name: 'm6',               symbol: 'm6',            intervals: [0,3,7,9],           family: 'minor' },
    { name: 'm6(9)',            symbol: 'm69',           intervals: [0,3,7,9,14],        family: 'minor' },
    { name: 'm7',               symbol: 'm7',            intervals: [0,3,7,10],          family: 'minor', basic: true },
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
    { name: '7',                symbol: '7',             intervals: [0,4,7,10],          family: 'dominant', basic: true },
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
    { name: 'dim',              symbol: 'dim',           intervals: [0,3,6],             family: 'diminished', basic: true },
    { name: 'm7(\u266d5)',      symbol: 'm7b5',          intervals: [0,3,6,10],          family: 'diminished', basic: true },
    { name: 'o7',               symbol: 'o7',            intervals: [0,3,6,9],           family: 'diminished', basic: true },
    { name: 'o7(Maj7)',         symbol: 'o7_Maj7',       intervals: [0,3,6,9,11],        family: 'diminished' },
  ],
  augmented: [
    { name: 'aug',              symbol: 'aug',           intervals: [0,4,8],             family: 'augmented', basic: true },
    { name: 'Maj7(\u266f5)',    symbol: 'Maj7_s5',       intervals: [0,4,8,11],          family: 'augmented' },
    { name: 'aug7',             symbol: 'aug7',          intervals: [0,4,8,10],          family: 'augmented' },
    { name: 'aug9',             symbol: 'aug9',          intervals: [0,4,8,10,14],       family: 'augmented' },
  ],
  suspended: [
    { name: 'sus2',             symbol: 'sus2',          intervals: [0,2,7],             family: 'suspended', basic: true },
    { name: 'sus4',             symbol: 'sus4',          intervals: [0,5,7],             family: 'suspended', basic: true },
    { name: '5',                symbol: 'power',         intervals: [0,7],               family: 'suspended', basic: true },
    { name: 'sus2(Maj7)',       symbol: 'sus2_Maj7',     intervals: [0,2,7,11],          family: 'suspended' },
    { name: 'sus4(add9)',       symbol: 'sus4_add9',     intervals: [0,5,7,14],          family: 'suspended' },
  ],

  // ── Classical ──────────────────────────────────────────────────────────────
  // Chromatic pre-dominant chords from common-practice harmony.
  // All are built from the bass note (♭6 / le for augmented sixths; ♭2 for Neapolitan).
  // The app root = the bass reference note as described above.
  //
  // Additional field:
  //   classicalNote {string} Explanatory text shown in the 'Classical function'
  //                          breakdown sub-section.
  classical: [
    // Neapolitan — major triad on ♭II; typically appears in first inversion (N6)
    { name: 'N6 (Neapolitan)',    symbol: 'N6',      intervals: [0,4,7],    family: 'classical',
      classicalNote: '\u266dII major triad — pre-dominant chord in classical harmony. Typically appears in first inversion (N\u2076). Resolves to V or V\u2077.' },
    // Italian augmented sixth — built from ♭6: ♭6–1–♯4 (aug 6th between outer voices)
    { name: 'It\u207a\u2076 (Italian +6)', symbol: 'It6',  intervals: [0,4,9],    family: 'classical',
      classicalNote: 'Italian augmented sixth — \u266d6, 1, \u266f4 from the bass. The augmented sixth interval (\u266d6\u2013\u266f4) expands outward to the octave V. Resolves to V.' },
    // French augmented sixth — ♭6–1–2–♯4
    { name: 'Fr\u207a\u2076 (French +6)',  symbol: 'Fr6',  intervals: [0,4,6,9],  family: 'classical',
      classicalNote: 'French augmented sixth — \u266d6, 1, 2, \u266f4 from the bass. Contains a whole-tone tetrachord; the most dissonant of the three. Resolves to V.' },
    // German augmented sixth — ♭6–1–♭3–♯4 (enharmonic = dom7)
    { name: 'Ger\u207a\u2076 (German +6)', symbol: 'Ger6', intervals: [0,4,7,9],  family: 'classical',
      classicalNote: 'German augmented sixth — \u266d6, 1, \u266d3, \u266f4 from the bass. Enharmonically identical to a dominant 7th chord. Resolves to V (often via I\u2076\u2084 to avoid parallel 5ths).' },
  ],

  // ── Quartal / Quintal ──────────────────────────────────────────────────────
  // Built by stacking perfect fourths (quartal) or perfect fifths (quintal)
  // instead of thirds. Quintal is the inversion of quartal — same pitch content,
  // different stacking order. Common in jazz (McCoy Tyner, Bill Evans, Herbie
  // Hancock) and 20th-century classical (Hindemith, Bartók, Schoenberg).
  //
  // Additional fields:
  //   quartal   {boolean} Always true. Triggers the custom breakdown path:
  //                       modal contexts instead of chord scales; adjacent interval
  //                       analysis in the 'Quartal construction' sub-section.
  //   quartNote {string}  Detailed note shown in the 'Quartal construction'
  //                       breakdown sub-section.
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

  // ── Cluster / Secundal ─────────────────────────────────────────────────────
  // Built by stacking major or minor seconds instead of thirds or fourths.
  // More timbral than harmonic: dense dissonant sound masses used in contemporary
  // classical, avant-garde, film scoring, and ambient music.
  //
  // Additional fields:
  //   cluster   {boolean} Always true. Triggers the custom breakdown path:
  //                       no chord scales — a "timbral chord" note is shown instead;
  //                       adjacent interval analysis in the 'Cluster construction'
  //                       sub-section.
  //   clustNote {string}  Detailed note shown in the 'Cluster construction'
  //                       breakdown sub-section.
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

  // ── Slash chords ───────────────────────────────────────────────────────────
  // Root-agnostic upper triads over an independent bass note. The upper root is
  // randomised per question exactly like every other chord family; the bass note
  // is derived from it via bassInterval.
  //
  // Additional fields:
  //   upperIntervals {number[]} Semitone offsets within the upper triad from its
  //                             own root (always root-position).
  //   bassInterval   {number}   Pitch-class offset from the upper root UP to the
  //                             bass note (1–11, always positive). The bass pitch
  //                             class = (upperRootPc + bassInterval) mod 12.
  //                             At question time the bass is placed the complementary
  //                             distance BELOW the upper root:
  //                             soundingSemitonesBelow = 12 − bassInterval.
  //   belowLabel     {string}   Plain interval name for the sounding-below distance
  //                             (m2 / M2 / … / M7 / TT). Used in the chord name.
  //   upperQuality   {string}   'maj' or 'min' — quality of the upper triad.
  //   alsoKnownAs    {string}   Optional. Equivalent standard chord symbol where
  //                             the slash voicing has a common tertian reading.
  slash: [
    // Major upper triad (excludes bass offsets 0, 4, 7 — those are the triad's own tones)
    { name: 'maj / M7 below',  symbol: 'slashMaj_M7below',  upperIntervals: [0,4,7], bassInterval: 1,  belowLabel: 'M7', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / m7 below',  symbol: 'slashMaj_m7below',  upperIntervals: [0,4,7], bassInterval: 2,  belowLabel: 'm7', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / M6 below',  symbol: 'slashMaj_M6below',  upperIntervals: [0,4,7], bassInterval: 3,  belowLabel: 'M6', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / P5 below',  symbol: 'slashMaj_P5below',  upperIntervals: [0,4,7], bassInterval: 5,  belowLabel: 'P5', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / TT below',  symbol: 'slashMaj_TTbelow',  upperIntervals: [0,4,7], bassInterval: 6,  belowLabel: 'TT', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / M3 below',  symbol: 'slashMaj_M3below',  upperIntervals: [0,4,7], bassInterval: 8,  belowLabel: 'M3', family: 'slash', upperQuality: 'maj', alsoKnownAs: 'Maj7(\u266f5)' },
    { name: 'maj / m3 below',  symbol: 'slashMaj_m3below',  upperIntervals: [0,4,7], bassInterval: 9,  belowLabel: 'm3', family: 'slash', upperQuality: 'maj', alsoKnownAs: 'm7' },
    { name: 'maj / M2 below',  symbol: 'slashMaj_M2below',  upperIntervals: [0,4,7], bassInterval: 10, belowLabel: 'M2', family: 'slash', upperQuality: 'maj' },
    { name: 'maj / m2 below',  symbol: 'slashMaj_m2below',  upperIntervals: [0,4,7], bassInterval: 11, belowLabel: 'm2', family: 'slash', upperQuality: 'maj' },
    // Minor upper triad (excludes bass offsets 0, 3, 7 — those are the triad's own tones)
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

  // ── Polychords ─────────────────────────────────────────────────────────────
  // Two independent triads sounding simultaneously, each root-agnostic. The upper
  // root is chosen freely at question time; the lower root is derived from it.
  // Lower chord rendered in the bass staff, upper chord in the treble staff.
  //
  // Additional fields:
  //   upperIntervals {number[]} Intervals within the upper triad from its own root.
  //   lowerIntervals {number[]} Intervals within the lower triad from its own root.
  //   lowerOffset    {number}   Semitones from the upper root DOWN to the lower root
  //                             (always positive, 1–11).
  //   upperSymbol    {string}   Short quality label for the upper triad ('maj'|'min'|'aug').
  //   lowerSymbol    {string}   Short quality label for the lower triad ('maj'|'min'|'aug'|'7').
  poly: [
    { name: 'Maj / Maj (P5 below)',  symbol: 'poly_MM_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'maj', family:'poly' },
    { name: 'Maj / Maj (TT below)',  symbol: 'poly_MM_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'maj', family:'poly' },
    { name: 'Maj / Min (P5 below)',  symbol: 'poly_Mm_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'min', family:'poly' },
    { name: 'Maj / Min (TT below)',  symbol: 'poly_Mm_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'min', family:'poly' },
    { name: 'Min / Maj (P5 below)',  symbol: 'poly_mM_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'maj', family:'poly' },
    { name: 'Min / Maj (TT below)',  symbol: 'poly_mM_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'maj', family:'poly' },
    { name: 'Min / Min (P5 below)',  symbol: 'poly_mm_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'min', family:'poly' },
    { name: 'Min / Min (TT below)',  symbol: 'poly_mm_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'min', family:'poly' },
    // Aug upper triad (symmetrical — 3 enharmonic roots)
    { name: 'Aug / Maj (P5 below)',  symbol: 'poly_aM_P5',  upperIntervals:[0,4,8], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'aug', lowerSymbol:'maj', family:'poly' },
    { name: 'Aug / Maj (TT below)',  symbol: 'poly_aM_TT',  upperIntervals:[0,4,8], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'aug', lowerSymbol:'maj', family:'poly' },
    { name: 'Aug / Min (P5 below)',  symbol: 'poly_am_P5',  upperIntervals:[0,4,8], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'aug', lowerSymbol:'min', family:'poly' },
    { name: 'Aug / Min (TT below)',  symbol: 'poly_am_TT',  upperIntervals:[0,4,8], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'aug', lowerSymbol:'min', family:'poly' },
    // Maj / Aug lower
    { name: 'Maj / Aug (P5 below)',  symbol: 'poly_Ma_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,8], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'aug', family:'poly' },
    { name: 'Maj / Aug (TT below)',  symbol: 'poly_Ma_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,8], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'aug', family:'poly' },
    { name: 'Min / Aug (P5 below)',  symbol: 'poly_ma_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,8], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'aug', family:'poly' },
    { name: 'Min / Aug (TT below)',  symbol: 'poly_ma_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,8], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'aug', family:'poly' },
    // Dom7 upper structure
    { name: 'Dom7 / Maj (P5 below)', symbol: 'poly_7M_P5',  upperIntervals:[0,4,7,10], lowerIntervals:[0,4,7], lowerOffset:7,  upperSymbol:'7', lowerSymbol:'maj', family:'poly' },
    { name: 'Dom7 / Maj (TT below)', symbol: 'poly_7M_TT',  upperIntervals:[0,4,7,10], lowerIntervals:[0,4,7], lowerOffset:6,  upperSymbol:'7', lowerSymbol:'maj', family:'poly' },
    { name: 'Dom7 / Min (P5 below)', symbol: 'poly_7m_P5',  upperIntervals:[0,4,7,10], lowerIntervals:[0,3,7], lowerOffset:7,  upperSymbol:'7', lowerSymbol:'min', family:'poly' },
    { name: 'Dom7 / Min (TT below)', symbol: 'poly_7m_TT',  upperIntervals:[0,4,7,10], lowerIntervals:[0,3,7], lowerOffset:6,  upperSymbol:'7', lowerSymbol:'min', family:'poly' },
    // Maj / Dom7 lower
    { name: 'Maj / Dom7 (P5 below)', symbol: 'poly_M7_P5',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7,10], lowerOffset:7,  upperSymbol:'maj', lowerSymbol:'7', family:'poly' },
    { name: 'Maj / Dom7 (TT below)', symbol: 'poly_M7_TT',  upperIntervals:[0,4,7], lowerIntervals:[0,4,7,10], lowerOffset:6,  upperSymbol:'maj', lowerSymbol:'7', family:'poly' },
    { name: 'Min / Dom7 (P5 below)', symbol: 'poly_m7_P5',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7,10], lowerOffset:7,  upperSymbol:'min', lowerSymbol:'7', family:'poly' },
    { name: 'Min / Dom7 (TT below)', symbol: 'poly_m7_TT',  upperIntervals:[0,3,7], lowerIntervals:[0,4,7,10], lowerOffset:6,  upperSymbol:'min', lowerSymbol:'7', family:'poly' },
  ],

  // ── Upper Structure Triads (UST) ───────────────────────────────────────────
  // Jazz rootless voicings: a two-note shell defines the chord quality; an upper
  // triad voiced above it supplies the tensions. The root is not played.
  //
  // Additional fields:
  //   shellIntervals     {number[]} Two-note shell intervals from the chord root
  //                                 (e.g. [4,10] = M3 + m7 for a dominant 7th shell).
  //   upperTriadRoot     {number}   Semitones above the chord root where the upper
  //                                 triad root sits.
  //   upperTriadIntervals{number[]} Intervals within the upper triad from its own root
  //                                 ([0,4,7] = major, [0,3,7] = minor).
  //   upperQuality       {string}   'maj' or 'min' — quality of the upper triad.
  //   ustNumber          {string}   Scale-degree label (e.g. '♭II', 'IIm', 'V').
  //   tensions           {string}   Comma-separated tensions implied by shell + upper triad.
  //   resultingChord     {string}   Full chord symbol implied by the combined voicing.
  //   subFamily          {string}   Shell context: 'dom7' | 'min' | 'maj7'.
  //   shellQuality       {string}   Optional. Explicit shell label for non-dominant contexts:
  //                                 'min' or 'maj7'. Absent on dom7 entries (implied by default).
  ust: [
    // Dom7 shell UST — shell = [M3, m7] = [4, 10]
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

    // Minor shell UST — shell = [m3, m7] = [3, 10] — implies m7 chord context
    // IIm over m7 → m7(9)(11) — Dorian flavour
    { name: 'UST IIm (II min over m7)',    symbol: 'ust_m_IIm',  shellIntervals:[3,10], upperTriadRoot:2,  upperTriadIntervals:[0,3,7], upperQuality:'min', ustNumber:'IIm',  tensions:'9, 11',    resultingChord:'m7(9)(11)',    family:'ust', shellQuality:'min', subFamily:'min' },
    // IV over m7 → m7(11)(13) — Dorian brightness
    { name: 'UST IV (IV maj over m7)',     symbol: 'ust_m_IV',   shellIntervals:[3,10], upperTriadRoot:5,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'IV',   tensions:'11, 13',   resultingChord:'m7(11)(13)',   family:'ust', shellQuality:'min', subFamily:'min' },
    // ♭VII over m7 → m7(9) — warm, open Dorian voicing
    { name: 'UST ♭VII (♭VII maj over m7)', symbol: 'ust_m_bVII', shellIntervals:[3,10], upperTriadRoot:10, upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭VII', tensions:'9',        resultingChord:'m7(9)',        family:'ust', shellQuality:'min', subFamily:'min' },
    // ♭VI over m7 → m9(♭13) — Phrygian / Aeolian colour
    { name: 'UST ♭VI (♭VI maj over m7)',   symbol: 'ust_m_bVI',  shellIntervals:[3,10], upperTriadRoot:8,  upperTriadIntervals:[0,4,7], upperQuality:'maj', ustNumber:'♭VI',  tensions:'♭13',      resultingChord:'m7(♭13)',      family:'ust', shellQuality:'min', subFamily:'min' },

    // Maj7 shell UST — shell = [M3, M7] = [4, 11] — implies Maj7 chord context
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

// ── Chord playback styles ───────────────────────────────────────────────────

/**
 * Available playback styles for chord questions.
 * Controls the order in which notes are sounded during playback.
 *
 * @type {Array.<{name: string, symbol: string}>}
 * @property {string} name   Display label shown in the UI.
 * @property {string} symbol Internal key used in state and mode logic.
 */
const CHORD_PLAYBACK_STYLES = [
  { name: 'Block',       symbol: 'block'      },
  { name: 'Ascending',   symbol: 'ascending'  },
  { name: 'Descending',  symbol: 'descending' },
  { name: 'Broken',      symbol: 'broken'     },
  { name: 'Random',      symbol: 'random'     },
];

// =============================================================================
// The Sound Travels Ear Training — chords.js
// Created by Renato Fera P. — The Sound Travels — 2026
// =============================================================================
