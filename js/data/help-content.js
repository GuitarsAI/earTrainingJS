// ── Help content ─────────────────────────────────────────────────────────────
//
// Single source of truth for all Help text.
// No DOM, no rendering logic — content only.
//
// Structure:
//   HELP_SECTIONS — array of section objects
//   Each section: { id, title, entries[] }
//   Each entry:   { term, body }   (body is plain text; \n = paragraph break)

const HELP_SECTIONS = [

  // ── 1. Getting Started ────────────────────────────────────────────────────
  {
    id: 'getting-started',
    title: 'Getting Started',
    entries: [
      {
        term: 'What is this app?',
        body: 'The Sound Travels Ear Trainer is a free tool for developing your musical ear. You hear a sound — an interval, chord, scale, or progression — and train yourself to identify it by name. The more you practise, the faster and more reliably you recognise what you hear.',
      },
      {
        term: 'Quiz mode vs Dictionary mode',
        body: 'Quiz mode is the training mode. The app plays a random item from your pool, you identify it, and the app tells you if you were right. Your score and streak are tracked.\n\nDictionary mode is a reference browser. Select any item in the pool and the app immediately shows its notation and full breakdown — no guessing required. Use it to study a specific chord or scale before drilling it in Quiz mode.',
      },
      {
        term: 'How a session works',
        body: 'Select the items you want to practise in the pool panel, then press the Play button (♩). The app plays the sound. Use the dropdown to select your answer and press Submit (or press Enter). The app reveals whether you were right and shows the full Breakdown panel with theory details. Press Next (or Space) to move to the next question.',
      },
      {
        term: 'Play button',
        body: 'The large circular button (♩) plays the current question. You can press it as many times as you like before answering. Keyboard shortcut: Space.',
      },
      {
        term: 'Hear Slowly',
        body: 'Replays the sound with a longer gap between notes. Useful when a chord or scale is hard to follow at normal speed.',
      },
      {
        term: 'New Session',
        body: 'Resets the score counter and streak to zero and picks a fresh question. Your pool selection and settings are preserved.',
      },
      {
        term: 'Score bar',
        body: 'Shows your current streak (consecutive correct answers) and your overall correct/total count for the session. These reset when you press New Session.',
      },
      {
        term: 'Keyboard shortcuts',
        body: `Two keyboard shortcuts work throughout the app:

• Space — play the current question (same as clicking the Play button). Press it as many times as you like before answering.
• Enter — advance to the next question after the answer is revealed (same as clicking Next).`,
      },
    ],
  },

  // ── 2. Modes ──────────────────────────────────────────────────────────────
  {
    id: 'modes',
    title: 'Modes',
    entries: [
      {
        term: 'Intervals mode',
        body: 'Trains you to identify the distance between two notes. The app plays two notes (together or in sequence depending on your style setting) and you name the interval.\n\nThe pool is split into Simple intervals (within one octave, 0–12 semitones) and Extended / Compound intervals (beyond one octave: m9, M9, ♯9, P11, ♯11, m13, M13). Compound intervals are collapsed and unselected by default.',
      },
      {
        term: 'Chords mode',
        body: 'Trains you to identify chords by ear. The app plays a chord built on a random root (or a pinned root if you set one) and you name it.\n\nChords are organised into six families:\n• Triads — three-note chords: major, minor, diminished, augmented, suspended, power\n• Seventh chords — four-note chords adding a seventh above the triad\n• Extended chords — 9th, 11th, and 13th chords\n• Slash chords — a chord with a specific bass note that isn\'t its root (e.g. C/E)\n• Polychords — two triads stacked on top of each other\n• Upper Structure Triads (UST) — a triad played over a shell voicing; a jazz reharmonisation technique',
      },
      {
        term: 'Scales mode',
        body: 'Trains you to identify scales by ear. The app plays a scale ascending, descending, or both, depending on your direction setting.\n\nScales are grouped by note count:\n• Pentatonic — 5 notes\n• Hexatonic — 6 notes\n• Diatonic — 7 notes (modes, harmonic/melodic minor, and related scales)\n• Octatonic — 8 notes (diminished and Messiaen modes)',
      },
      {
        term: 'Progressions mode',
        body: 'Trains you to identify common chord progressions by ear. The app plays a sequence of chords and you identify the progression from the list.\n\nProgressions are shown in Roman numeral notation (e.g. I–V–vi–IV) so they work in any key. The breakdown shows each chord in the progression with its degree, name, notes, and harmonic function.',
      },
    ],
  },

  // ── 3. Controls & Settings ────────────────────────────────────────────────
  {
    id: 'controls',
    title: 'Controls & Settings',
    entries: [
      {
        term: 'The Pool panel',
        body: 'The pool is the set of items the Quiz mode draws from. Tap any chip to toggle it in or out of the pool. Only selected (highlighted) items will appear as questions.\n\nSections with selected items expand automatically when you open the panel. Sections without any selected items start collapsed.',
      },
      {
        term: 'All / None buttons',
        body: 'Each mode has All and None buttons at the top of the pool panel. All selects every item across all sub-sections at once. None deselects everything. Useful for quickly switching between full-library practice and a focused subset.',
      },
      {
        term: 'Root note chips',
        body: 'Rnd plays each question in a randomly chosen root. The 12 note chips (C through B) pin the root to that note so every question uses the same starting pitch. Use a pinned root when you want to focus on recognising the sound of an item rather than its transposition.',
      },
      {
        term: 'Show root note',
        body: 'When checked, the root note badge is shown beneath the play button so you always know what root the question is in. Uncheck it to make the quiz harder — you have to identify both the item and (mentally) the root.',
      },
      {
        term: 'Octave register chips',
        body: 'Controls the pitch range used for questions:\n• Low — root in octave 2–3 (bass register)\n• Mid — root in octave 3–4 (middle register, default)\n• High — root in octave 4–5 (upper register)',
      },
      {
        term: 'Resolve',
        body: 'Appears in Chords mode after you play a question. Plays the resolution of the current chord — the chord it naturally wants to move to (typically the tonic a perfect 5th below). Useful for hearing the chord in a harmonic context rather than in isolation.',
      },
      {
        term: 'Session stats',
        body: `Tracks your accuracy broken down by item type for the current session. Click "Session stats" below the keyboard hint to expand the table. Each row shows the item name, number of correct answers, total attempts, and accuracy percentage.

Click Reset to clear the stats without starting a new session.`,
      },
      {
        term: 'Key / C chip (notation)',
        body: 'These appear above the notation once a question is revealed.\n\n• Key — adds a key signature to the staff. Notes that are covered by the key signature are shown without individual accidentals.\n• C — no key signature; every accidental is shown explicitly on the note.',
      },
      {
        term: 'Playback style chips (Chords & Intervals)',
        body: '• Block — all notes played simultaneously\n• Ascending — notes played from lowest to highest in sequence\n• Descending — notes played from highest to lowest\n• Broken — root, then top note, then inner notes, then top again (arpeggio-like)\n• Random — the app picks one of the above randomly for each question',
      },
      {
        term: 'Scale direction chips',
        body: '• Ascending — scale played from root up to octave\n• Descending — scale played from octave down to root\n• Both — ascending then descending in one phrase',
      },
      {
        term: 'Inversions toggle (Chords)',
        body: 'When enabled, the quiz may present chords in inversion — meaning a note other than the root is in the bass. The breakdown shows the inversion using slash notation (e.g. Cmaj / E for first inversion C major). Inversions are selected randomly from all possible inversions of the chord.',
      },

      // Voicing chips — one entry per group
      {
        term: 'Voicing chips — Group 1: Position / Spacing',
        body: 'Controls how the notes of a chord are distributed across the register.\n\n• Close — all notes stacked within one octave from the root. The default baseline voicing.\n• Open — alternate voices raised one octave, creating a wider, more spacious sound.\n• Spread — root in bass (octave 2–3), upper notes spread across octaves 4–5.',
      },
      {
        term: 'Voicing chips — Group 2: Doubling',
        body: 'Classical and arranging techniques where one note of the chord is duplicated at a different octave.\n\n• Root Octave Double — root doubled one octave lower in bass: 1–1–3–5\n• Root Above Fifth — root doubled above the fifth: 1–5–1–3\n• Fifth Double — fifth doubled at the top: 1–5–3–5\n• Root Top and Bottom — root at top and bottom, chord tones inside: 1–3–5–1',
      },
      {
        term: 'Voicing chips — Group 3: Shell / Rootless',
        body: 'Economical jazz voicings that use a subset of chord tones — typically the most harmonically defining ones.\n\n• Shell — root + 3rd + 7th. The 3rd defines major/minor quality; the 7th defines dominant/major/minor character. These two tones together are called guide tones.\n• Shell Alt — root + 7th + 3rd. Same tones as Shell, 7th voiced below the 3rd.\n• Rootless Shell — 3rd + 7th only. Works when a bass player holds the root.\n\nThree-note voicings (Levine):\n• Three-note Maj 1–3–5, 3–5–7, 1–3–7 — major chord subsets\n• Three-note Dom 1–3–♭7, 3–5–♭7, 3–♭7–9 — dominant chord subsets\n• Three-note Min 1–♭3–♭7, ♭3–5–♭7, ♭3–♭7–9 — minor chord subsets\n\nRootless voicings (Bill Evans / Levine):\n• Rootless Maj7 — 3–5–7–9: Form A, the canonical jazz rootless maj7\n• Rootless Maj7 Ext. — 3–5–7–9–13: adds 13th colour\n• Rootless Min7 — ♭3–5–♭7–9: standard jazz left-hand minor voicing\n• Rootless Dom7 — 3–♭7–9–13: V chord comp voicing\n\nAltered dominant rootless voicings:\n• Rootless Altered A — 3–♭7–♭9–♯9: both altered 9ths, maximum tension\n• Rootless Altered B — 3–♭7–♯9–♭13: ♯9 + ♭13 colour\n• Rootless Altered C — 3–♭7–♭5–♭9: tritone sub flavour\n• Rootless Altered D — 3–♭7–♭9 (Levine spelling)\n• Rootless ♯9 — 3–♭7–♯9: the "Hendrix voicing"\n\nSpecialty:\n• Sus Voicing — 1–4–♭7–9: full sus voicing including 9th\n• Phrygian Voicing — 1–♭2–5–♭7: dark, Spanish flavour\n• Major 6 — 1–3–5–6\n• Minor 6 — 1–♭3–5–6\n• 6/9 — 1–3–5–6–9: no 7th; lush, open sound\n• Rootless 6/9 — 3–5–6–9: upper structure of the 6/9',
      },
      {
        term: 'Voicing chips — Group 4: Drop Voicings',
        body: 'Drop voicings take a close-position chord and drop one or more voices down by an octave, creating a more spread, idiomatic piano or guitar sound.\n\n• Drop-2 — the second-highest voice of close position dropped one octave. The most common arranging voicing.\n• Drop-3 — the third-highest voice dropped one octave.\n• Drop-2&4 — second and fourth voices from the top dropped one octave. Falls back to Drop-2 for triads.\n• Drop-2&3 — second and third voices from the top dropped one octave.',
      },
      {
        term: 'Voicing chips — Group 5: Intervallic',
        body: 'Voicings built by stacking a single interval type rather than chord tones. The resulting sound may include notes outside the chord — the character comes from the interval pattern, not the harmony.\n\n• Quartal — stacked perfect fourths (5 semitones). The modal jazz staple; associated with McCoy Tyner, Herbie Hancock, and Miles Davis\'s Kind of Blue era.\n• Quintal — stacked perfect fifths (7 semitones). Open, hollow sound.\n• Secundal — stacked major seconds (2 semitones). Whole-tone cluster character.\n• Cluster Chromatic — stacked semitones. Maximum chromatic density.\n• Cluster Diatonic — stacked diatonic seconds within the chord\'s scale. Softer cluster.\n• Cluster Pentatonic — stacked pentatonic steps. Open, percussive; McCoy Tyner influence.\n• Cluster Whole-tone — stacked whole tones. Impressionist / Debussy flavour.\n• Cluster Modal — stacked modal scale steps in the current tonal context.',
      },
      {
        term: 'Voicing chips — Group 6: Style',
        body: 'Named voicing styles associated with specific pianists or arranging traditions.\n\n• So What — fixed shape P4+P4+P4+M3. From Miles Davis\'s "So What" (Kind of Blue). Five notes, always the same interval pattern regardless of chord.\n• Bill Evans A — 3–5–7–9 in left-hand register. Rootless Form A (The Jazz Piano Book).\n• Bill Evans B — 7–9–3–5. Rootless Form B, inversion of Form A.\n• Kenny Barron — LH: root + 7th. RH: 3rd + 5th + 9th. Signature two-hand spread.\n• McCoy Tyner — LH: stacked quartal. RH: upper quartal cluster. Pentatonic quartal texture.\n• Pop Piano — LH: root octave (oct 2–3). RH: 3rd + 5th + 9th close (oct 4–5).\n• Gospel — close voicing with added 9th; extensions stacked tightly in upper register.\n• Octave Bass + Triad — LH: root octave. RH: triad only. Pop/R&B keyboard staple.\n• Octave Bass + 7th — LH: root octave. RH: full seventh chord close.\n• Open Fifth + Triad — LH: root + 5th (power chord). RH: triad. Open, contemporary sound.\n• Block Chord Close — melody on top, close-position chord tones harmonised below.\n• Locked Hands — melody doubled one octave lower, inner chord tones between (Milt Buckner style).\n• Four-way Close — four voices in close position, melody on top.\n• Block Drop-2 — Drop-2 applied to a harmonised melody.\n• Octave Melody + Inner — melody doubled at the octave; chord tones fill the space between.\n• Pedal Point — root held as a sustained bass note; upper voices voiced close above.\n• Two-handed Spread — LH: root + 5th wide apart. RH: upper extensions close. Broader than Spread.',
      },
    ],
  },

  // ── 4. The Breakdown Panel ────────────────────────────────────────────────
  {
    id: 'breakdown',
    title: 'The Breakdown Panel',
    entries: [
      {
        term: 'What is the Breakdown?',
        body: 'After you answer a question (or when browsing in Dictionary mode), the Breakdown panel appears below the notation. It shows detailed theory information about the item you just heard — note names, interval relationships, scale structure, voice leading, and more.\n\nMost sub-sections are collapsed by default. Click any section header to expand it.',
      },

      // Intervals
      {
        term: 'Breakdown: Intervals — Semitones',
        body: 'The raw number of half-steps between the two notes. A semitone is the smallest interval in Western music — one piano key apart. All intervals are defined by their semitone count: a minor 3rd is always 3 semitones, a perfect 5th is always 7 semitones.',
      },
      {
        term: 'Breakdown: Intervals — Name',
        body: 'The standard name of the interval (e.g. "Major 3rd", "Perfect 5th", "Minor 7th"). Interval names combine a quality (perfect / major / minor / augmented / diminished) with a number (2nd, 3rd, 4th…) that reflects the number of letter names spanned.',
      },
      {
        term: 'Breakdown: Intervals — Degree',
        body: 'The qualified Roman numeral for the interval measured from the root (e.g. III for a major 3rd, ♭VII for a minor 7th). This connects the interval to its position in a scale or chord. The same notation is used in the Numerals row of the chord breakdown.',
      },
      {
        term: 'Breakdown: Intervals — Inversion',
        body: 'Every simple interval (within one octave) has a complement interval that adds up to a perfect octave (12 semitones). That complement is called the inversion. For example: a Major 3rd (4 semitones) inverts to a minor 6th (8 semitones), because 4 + 8 = 12.\n\nInversions are shown for simple intervals only. Compound intervals show a Simple equivalent row instead.',
      },
      {
        term: 'Breakdown: Intervals — Simple equivalent',
        body: 'Shown for compound (extended) intervals only — replaces the Inversion row. A compound interval is one that spans more than one octave. The simple equivalent is the same interval reduced to within one octave: a Major 9th (14 semitones) has a simple equivalent of Major 2nd (2 semitones).',
      },
      {
        term: 'Breakdown: Intervals — Consonance',
        body: 'How stable or tense the interval sounds, using four categories:\n\n• Perfect consonance — sounds fully stable; no tension (Unison, Perfect 4th, Perfect 5th, Octave)\n• Imperfect consonance — pleasant but with a mild sense of colour (Major/Minor 3rd and 6th)\n• Mild dissonance — noticeable tension that typically wants to resolve (Major 2nd, Minor 7th)\n• Sharp dissonance — strong tension; unstable and active (Minor 2nd, Major 7th, Tritone)',
      },
      {
        term: 'Breakdown: Intervals — Common context',
        body: 'Where this interval most commonly appears in music — for example, which chord tone it typically represents, which melodic motion it suggests, or which historical association it carries (e.g. the Tritone is the "devil\'s interval").',
      },

      // Scales
      {
        term: 'Breakdown: Scales — Notes',
        body: 'The note names of every note in the scale, spelled from the root. The spelling uses conventional enharmonic conventions for the scale in question (e.g. F♯ rather than G♭ in D major).',
      },
      {
        term: 'Breakdown: Scales — Degrees',
        body: 'The qualified Roman numeral label for each note: I, II, ♭III, IV, V, ♭VI, ♭VII, etc. Degree labels show exactly how each note relates to the root and allow you to compare scale structures across different roots.',
      },
      {
        term: 'Breakdown: Scales — Character',
        body: 'A one-line description of the scale\'s mood and sound. Examples: "Bright, stable — the default happy Western sound" (major), "Dark, Spanish/Flamenco flavour — distinctive ♭2 gives it edge" (Phrygian).\n\nThe character tags (bright / neutral / dark / exotic / symmetric / ambiguous) summarise the overall quality:\n• Bright — raised notes relative to major; more tension upward\n• Dark — lowered notes relative to major; heavier, minor character\n• Exotic — unusual intervals that give a non-Western or modal colour\n• Symmetric — the scale divides the octave into equal segments\n• Ambiguous — the scale lacks a strong tonal centre or leading tone',
      },
      {
        term: 'Breakdown: Scales — Parent',
        body: 'Some scales are modes of a parent scale — that is, they use the same notes as another scale but start on a different degree. This row shows which parent scale it comes from and which degree it starts on.\n\nFor example, Dorian is the 2nd mode of the Major scale: it uses the same notes as a major scale starting two steps higher. Phrygian Dominant is the 5th mode of Harmonic Minor.\n\nScales that are not derived from a parent (like Major, Harmonic Minor, Melodic Minor, or symmetric scales) do not show this row.',
      },
      {
        term: 'Breakdown: Scales — Triad map',
        body: 'A table showing the triad built on each degree of the scale. Each row shows:\n• Degree — the Roman numeral of the scale degree (I, ii, iii, IV…). Uppercase = major triad. Lowercase = minor. ° = diminished. + = augmented.\n• Root — the note name of that degree in the current key\n• Quality — the chord quality (major, minor, diminished, augmented)\n\nThe triad map tells you which chords naturally belong to a key and what quality each one has. This is the starting point for harmonising a melody or choosing chord progressions in a given mode.',
      },
      {
        term: 'Breakdown: Scales — Harmonic field',
        body: 'The diatonic seventh chords built on each degree of the scale — an extension of the triad map to four-note chords. Each pill shows three lines:\n• Roman numeral with quality suffix (e.g. IIm7, V7, Imaj7)\n• Root name + chord shorthand (e.g. Dm7, G7, Cmaj7)\n• Full quality name (e.g. minor 7th, dominant 7th, major 7th)\n\nThe harmonic field is the full vocabulary of chords naturally available in a key. In jazz and pop harmony, chord progressions are usually built by moving between chords in the harmonic field of the home key.',
      },
      {
        term: 'Breakdown: Scales — Chord scales',
        body: 'Scales whose notes contain all the pitch classes of the current chord. Shown in the chord breakdown as well. A chord scale is a scale you can use for improvisation or harmonisation over that chord without clashing.\n\nEach result shows the scale name and a character tag (neutral / bright / tense / dark / etc.) describing its mood. Clicking a scale name in chord mode opens that scale in Dictionary mode.',
      },

      // Chords
      {
        term: 'Breakdown: Chords — Notes',
        body: 'The note names of every sounding note, ordered from lowest to highest as voiced. The spelling uses conventional enharmonic conventions for the chord symbol (e.g. E♭ rather than D♯ in a C minor chord).',
      },
      {
        term: 'Breakdown: Chords — From root',
        body: 'The interval abbreviation of each note measured from the root — for example, m3, P5, m7. This tells you exactly which intervals make up the chord regardless of voicing or register.',
      },
      {
        term: 'Breakdown: Chords — Numerals',
        body: 'The qualified Roman numeral of each note measured from the root (♭III, V, ♭VII etc.). The same notation is used in scale degree labels, so this row connects the chord\'s internal structure to how it would be described in a scale context.',
      },
      {
        term: 'Breakdown: Chords — Between notes',
        body: 'The interval between each adjacent pair of sounding notes, measured bottom to top. Where From root measures everything against the root, Between notes shows the local distance between consecutive voices — useful for understanding the spacing and recognising voicings by ear.',
      },
      {
        term: 'Breakdown: Chords — Slash',
        body: 'Shown when a chord is in inversion. Written as ChordName / BassNote (e.g. Cmaj / E for C major with E in the bass — first inversion). The "From [bass note]" row below it re-analyses the chord as if the bass note were the root, showing what the inverted voicing looks like from that perspective.',
      },
      {
        term: 'Breakdown: Chords — Neo-tonal (Riemannian)',
        body: 'Shown for major and minor triads. Neo-tonal (or Riemannian) theory describes relationships between chords by transforming one into another with minimal voice movement. Each relation is named:\n\n• Parallel (P) — switches major/minor quality while keeping root and fifth the same (C major ↔ C minor)\n• Relative (R) — moves one voice by a whole step to reach the relative major/minor (C major ↔ A minor)\n• Leading-tone exchange (L) — moves the root by a semitone in the opposite direction (C major ↔ E minor)\n• Subdominant parallel (S) — moves to the chord a perfect fifth away\n\nThese relations describe chord progressions that sound smooth and logical even when they cross key boundaries — common in film music and Romantic-era harmony.',
      },
      {
        term: 'Breakdown: Chords — Dominant: Tritone sub',
        body: 'The tritone substitution is a jazz reharmonisation technique. Any dominant 7th chord can be replaced by another dominant 7th chord whose root is a tritone (6 semitones) away. The substitute chord shares the same guide tones (3rd and 7th) as the original, just swapped — so it functions similarly but with a chromatic bass movement.\n\nFor example: G7 can be substituted by D♭7. G7 has B (3rd) and F (7th). D♭7 has F (3rd) and C♭/B (7th) — the same two pitches, reversed.',
      },
      {
        term: 'Breakdown: Chords — Dominant: Related ii',
        body: 'Every dominant 7th chord has a naturally paired ii chord — the minor 7th built a perfect 5th above the dominant\'s resolution target. Together they form the ii–V–I progression, the most common cadential formula in jazz. For G7, the related ii is Dm7 (because D is a 5th above G, and the resolution target is C).',
      },
      {
        term: 'Breakdown: Chords — Dominant: Resolves to',
        body: 'The chord(s) this dominant wants to resolve to — typically the chord a perfect 5th below the root. A G7 resolves to C (major or minor). This strong pull toward resolution is caused by the tritone between the 3rd and 7th of the dominant chord, which wants to collapse inward (if resolving to major) or expand outward (if resolving to minor).',
      },
      {
        term: 'Breakdown: Chords — Diminished: Enharmonic roots',
        body: 'A fully diminished 7th chord (°7) is symmetrical — it divides the octave into four equal minor 3rds. This means the same four notes can be named as four different diminished 7th chords, one rooted on each of its notes. All four are enharmonically equivalent (they sound identical). The Enharmonic row lists all four root names.',
      },
      {
        term: 'Breakdown: Chords — Diminished: Dom7♭9 subs',
        body: 'A fully diminished 7th chord is enharmonically equivalent to the upper four notes of a dominant 7♭9 chord (without the root). This means a °7 chord can substitute for — or imply — multiple dominant 7♭9 chords. The Dom7♭9 subs row lists which dominant chords the diminished chord can substitute for.',
      },
      {
        term: 'Breakdown: Chords — Half-dim',
        body: 'The half-diminished chord (m7♭5, also written ø7) is most commonly used as the ii chord in a minor key ii–V–i progression. The breakdown shows which minor key it functions in and what its paired V7 chord is.\n\nHalf-diminished differs from fully diminished (°7) in one note: the 7th is a minor 7th (10 semitones) rather than a diminished 7th (9 semitones).',
      },
      {
        term: 'Breakdown: Chords — Augmented',
        body: 'The augmented triad (+) is symmetrical — it divides the octave into three equal major 3rds. Like the diminished 7th, the same three notes can be named as three different augmented triads (one rooted on each note). The Enharmonic row lists all three root names.\n\nAugmented triads appear naturally as the III chord in harmonic minor and are often used as passing chords or to harmonise a rising bass line.',
      },
      {
        term: 'Breakdown: Chords — Suspended',
        body: 'Suspended chords (sus2 and sus4) replace the 3rd of a chord with a 2nd or 4th, leaving the chord\'s major/minor quality ambiguous. The Resolution row shows the chord this suspended chord typically wants to move to — usually the same root with the 3rd restored.\n\n• sus2 — root + major 2nd + perfect 5th\n• sus4 — root + perfect 4th + perfect 5th',
      },
      {
        term: 'Breakdown: Chords — Power',
        body: 'A power chord contains only root and perfect 5th — no 3rd, no 7th. Without a 3rd, the chord has no major or minor quality; the context (melody, other instruments) determines whether it sounds major or minor. Power chords are the foundation of rock and metal guitar; on piano they sound open and hollow.',
      },
      {
        term: 'Breakdown: Chords — Chord scales',
        body: 'Scales whose notes contain all the pitch classes of the current chord. Useful for improvisation: any note from a matching chord scale will fit over the chord without clashing.\n\nThe teal character tags show the mood of each scale (neutral / bright / tense / dark / exotic / symmetric / ambiguous). The faint note next to each scale name gives a brief stylistic description. Clicking a scale name opens that scale in Dictionary mode.',
      },
      {
        term: 'Breakdown: Chords — Voice leading',
        body: 'Voice leading is the practice of moving individual voices (notes) from one chord to the next as smoothly as possible — ideally by step (small intervals), with contrary or oblique motion where possible. Smooth voice leading keeps the progression feeling connected rather than lurching.\n\nThe Voice leading section shows all the harmonic contexts in which the current chord can appear. Each context expands to show:\n\n• Harmonic context — e.g. "diatonic dominant in major". Describes the role this chord plays in a key\n• Resolution target — the chord this one resolves to in this context\n• Cadence type — the name of the cadential motion (see the Glossary for definitions)\n• Strength % — how strong the pull toward resolution is. A perfect authentic cadence has the highest strength. Half cadences have lower strength.\n• Tension dots — a visual indicator of tension level: more dots = more tension\n• Voice leading table — shows each voice movement from this chord to its resolution:\n  — From → To: the specific note in this chord and where it moves in the resolution chord\n  — Direction: up, down, or static\n  — Interval: how far the voice moves (e.g. semitone, whole tone, minor 3rd)\n  — Role: the harmonic function of that voice movement (e.g. leading tone resolves up, guide tone resolves down)',
      },

      // Progressions
      {
        term: 'Breakdown: Progressions — Per-chord rows',
        body: 'After identifying a progression, the breakdown shows a row for each chord containing:\n• Degree — Roman numeral (e.g. I, V, vi, IV)\n• Chord name — the full name in the current key (e.g. C major, G major, A minor)\n• Notes — the note names of the chord\n• Intervals from root — the interval structure of the chord\n• Harmonic function — Tonic, Subdominant, Dominant, or Predominant (see Glossary)',
      },
      {
        term: 'Breakdown: Progressions — Chord scales',
        body: 'Each chord in the progression shows which scales fit it. This is the same chord scales logic as in Chord mode applied to every chord in the sequence.',
      },
    ],
  },

  // ── 5. Music Theory Glossary ──────────────────────────────────────────────
  {
    id: 'glossary',
    title: 'Music Theory Glossary',
    entries: [
      {
        term: 'Accidental',
        body: 'A symbol that raises or lowers a note by a semitone. ♯ (sharp) raises by one semitone. ♭ (flat) lowers by one semitone. ♮ (natural) cancels a previous sharp or flat. Double-sharp (𝄪) raises by two semitones. Double-flat (𝄫) lowers by two semitones.',
      },
      {
        term: 'Cadence',
        body: 'A harmonic motion that creates a sense of resolution or pause — the musical equivalent of a punctuation mark. Types used in this app:\n\n• Perfect authentic cadence — V → I, both in root position, tonic in the top voice. The strongest possible resolution; full stop in music.\n• Imperfect authentic cadence — V → I, but either chord is inverted, or the tonic is not in the top voice. Weaker than perfect authentic.\n• Half cadence — any progression that ends on V. Feels unresolved; like a comma or question mark.\n• Deceptive cadence — V → vi (or another unexpected chord instead of I). Creates surprise by avoiding the expected resolution.\n• Plagal cadence — IV → I. The "Amen" cadence; softer and more final-sounding than authentic.',
      },
      {
        term: 'Cadence strength %',
        body: 'A numerical measure of how strong the pull toward resolution is in a given harmonic context. Perfect authentic cadences score highest. Half cadences score lowest. The percentage reflects the combination of the cadence type and the specific voice movements involved.',
      },
      {
        term: 'Chord inversion',
        body: 'A chord is in inversion when a note other than the root is in the bass. The inversions are:\n• Root position — root in the bass (default)\n• First inversion — 3rd in the bass (figured bass: 6)\n• Second inversion — 5th in the bass (figured bass: 6/4)\n• Third inversion — 7th in the bass (figured bass: 4/2 or 2)\n\nInversions are shown in the breakdown as superscript numbers (figured bass notation) after the chord name.',
      },
      {
        term: 'Chord quality',
        body: 'The character of a chord determined by its interval structure:\n• Major — root, major 3rd, perfect 5th. Bright, stable.\n• Minor — root, minor 3rd, perfect 5th. Dark, introspective.\n• Diminished — root, minor 3rd, diminished 5th. Tense, unstable.\n• Augmented — root, major 3rd, augmented 5th. Ambiguous, expansive.\n• Dominant — root, major 3rd, perfect 5th, minor 7th. Tense; pulls toward resolution.',
      },
      {
        term: 'Chord scales',
        body: 'A scale that fits over a chord — meaning all the chord\'s notes are contained within the scale. Used in jazz and contemporary harmony to choose which notes are available for improvisation or harmonisation over a given chord without creating unwanted clashes.',
      },
      {
        term: 'Compound interval',
        body: 'An interval that spans more than one octave. A Major 9th is a compound interval (14 semitones = one octave + a Major 2nd). The simple equivalent is the same interval reduced to within one octave. Extended intervals in jazz chords (9ths, 11ths, 13ths) are all compound intervals.',
      },
      {
        term: 'Consonance and dissonance',
        body: 'Consonance describes intervals or chords that sound stable and at rest. Dissonance describes intervals or chords that sound tense and active — they create a sense of wanting to move somewhere.\n\nConsonance and dissonance are not good/bad — dissonance is what creates tension and forward motion in music. The four categories used in this app are: perfect consonance, imperfect consonance, mild dissonance, and sharp dissonance.',
      },
      {
        term: 'Degree / scale degree',
        body: 'The position of a note within a scale, counted from the root (the first note). The root is degree I (or 1). The second note is II, and so on. In minor keys or modes, degrees may be qualified: ♭III means the third degree is lowered by one semitone compared to major.',
      },
      {
        term: 'Diatonic',
        body: 'Belonging to the key or scale in use. A diatonic note is one that appears in the current scale without alteration. A diatonic chord is built entirely from notes of the scale. The opposite is chromatic (outside the scale).',
      },
      {
        term: 'Drop voicings (Drop-2, Drop-3, Drop-2&4)',
        body: 'Arranging techniques that take a close-position chord and drop one or more voices down one octave to create a more spread, open sound. Drop-2 drops the second-highest voice — the most common variant, widely used in jazz piano and guitar arranging.',
      },
      {
        term: 'Enharmonic equivalence',
        body: 'Two notes are enharmonically equivalent if they sound the same pitch but are written differently — for example, F♯ and G♭ are the same key on a piano but have different names depending on context. The app uses context-aware enharmonic spelling: it picks the name that makes most theoretical sense for the chord or scale in question.',
      },
      {
        term: 'Extended chord',
        body: 'A chord that adds one or more notes beyond the 7th: the 9th, 11th, or 13th. These are compound intervals stacked on top of a seventh chord. Extended chords are staples of jazz and R&B harmony — they add colour and complexity without fundamentally changing the chord\'s function.',
      },
      {
        term: 'Harmonic field',
        body: 'The complete set of diatonic chords available in a key — one chord built on each degree of the scale. For a major key: Imaj7, IIm7, IIIm7, IVmaj7, V7, VIm7, VIIm7♭5. The harmonic field defines the natural chord vocabulary of a key.',
      },
      {
        term: 'Harmonic function',
        body: 'The role a chord plays in the progression relative to the tonic (home chord):\n• Tonic (T) — stable; the home. I, IIIm, VIm.\n• Subdominant / Predominant (SD/PD) — moves away from home, sets up the dominant. IIm, IV.\n• Dominant (D) — creates tension that pulls toward the tonic. V, VII°.\n\nA typical cadence moves T → SD → D → T.',
      },
      {
        term: 'Interval',
        body: 'The distance between two notes, measured in semitones and given a name. Intervals are the building blocks of chords and scales. An interval has two properties: a number (2nd, 3rd, 4th…) reflecting how many letter names apart the notes are, and a quality (perfect, major, minor, augmented, diminished) reflecting the exact size.',
      },
      {
        term: 'Inversion of an interval',
        body: 'When you flip an interval by placing the lower note above the upper note (or vice versa), you get the inversion. A major 3rd (4 semitones) inverts to a minor 6th (8 semitones). The two always add up to 12 semitones (one octave). Quality inverts too: major ↔ minor, augmented ↔ diminished, perfect stays perfect.',
      },
      {
        term: 'Mode / modal degree',
        body: 'A mode is a scale derived from another scale by starting on a different degree and using the same notes. The seven modes of the major scale are Ionian (major), Dorian, Phrygian, Lydian, Mixolydian, Aeolian (natural minor), and Locrian. Each has a distinct character because the pattern of whole and half steps is different.\n\nThe modal degree is which degree of the parent scale the mode starts on. Dorian starts on degree 2 of major; Mixolydian on degree 5.',
      },
      {
        term: 'Modal character tags',
        body: 'Tags that summarise the overall sound of a scale:\n• Bright — raised intervals relative to major; more tension, lifted quality (e.g. Lydian)\n• Neutral — similar brightness to major; everyday Western sound (e.g. Major, Mixolydian)\n• Dark — lowered intervals relative to major; heavier, minor-influenced (e.g. Dorian, Phrygian)\n• Exotic — unusual interval combinations giving a non-Western or dramatic flavour\n• Symmetric — the scale divides the octave into equal segments (whole-tone, diminished, augmented)\n• Ambiguous — lacks a strong tonal pull or leading tone (e.g. whole-tone, some pentatonics)',
      },
      {
        term: 'Parent scale',
        body: 'The scale from which a mode is derived. For example, Dorian\'s parent scale is Major — Dorian uses the same notes as a major scale but starts on the 2nd degree. The parent relationship explains why modes with the same parent share the same harmonic field (just rotated).',
      },
      {
        term: 'Polychord',
        body: 'A chord built by stacking two separate triads on top of each other. Written with one chord over the other (e.g. C/G means a C triad over a G triad). Polychords create dense, complex sounds used in contemporary classical, film music, and jazz.\n\nNote: in this app, polychords are distinct from slash chords. A slash chord has a single chord over a single bass note; a polychord stacks two complete triads.',
      },
      {
        term: 'Power chord',
        body: 'A two-note or three-note structure containing only root and perfect 5th (and optionally the octave). With no 3rd, it has no major or minor quality — it is harmonically neutral. Power chords are the backbone of rock and metal guitar.',
      },
      {
        term: 'Qualified Roman numeral',
        body: 'A Roman numeral with a flat or sharp prefix indicating how the degree differs from the major scale. ♭III means the note three semitones above the root (one semitone lower than the major 3rd). ♯IV means the note six semitones above (one semitone higher than the perfect 4th). Used throughout the breakdown to label scale degrees and chord tones.',
      },
      {
        term: 'Quartal / quintal voicing',
        body: 'Voicings built by stacking fourths (quartal) or fifths (quintal) instead of thirds. The resulting sound is open, ambiguous, and modern — associated with mid-century jazz (McCoy Tyner, Herbie Hancock, Bill Evans). Quartal voicings avoid the major/minor polarity of tertian harmony.',
      },
      {
        term: 'Riemannian / Neo-tonal relations',
        body: 'A system of chord relationships developed by Hugo Riemann describing how triads connect through minimal voice movement. The three primary operations are Parallel (P), Relative (R), and Leading-tone exchange (L). These transformations allow smooth voice leading between chords that may be in different keys — a technique common in Romantic music and film scores.',
      },
      {
        term: 'Roman numeral notation',
        body: 'A system for labelling chords by their scale degree rather than their note name, so the same label works in any key. I always means the chord built on the first degree (tonic), V always means the fifth degree (dominant), etc. Uppercase = major, lowercase = minor. Symbols like ° (diminished), + or aug (augmented), 7 (seventh) are appended as needed.',
      },
      {
        term: 'Rootless voicing',
        body: 'A chord voicing that omits the root note. In jazz piano, the bass player holds the root, so the pianist can leave it out and voice only the harmonically interesting tones — the 3rd, 7th, and extensions. Rootless voicings sound more colourful and less cluttered than full-root voicings.',
      },
      {
        term: 'Semitone / whole tone',
        body: 'A semitone (also called a half step) is the smallest interval in Western music — the distance between any two adjacent piano keys. A whole tone (whole step) is two semitones. All intervals and scales are built from combinations of these two units.',
      },
      {
        term: 'Shell voicing',
        body: 'A minimal jazz voicing containing just the root, 3rd, and 7th — the three notes that define a chord\'s quality and colour most clearly. The 5th is omitted because it adds little harmonic information. Shell voicings are a starting point for jazz piano comping and left-hand voicings.',
      },
      {
        term: 'Simple equivalent',
        body: 'The within-one-octave version of a compound interval. A Major 9th reduced by one octave becomes a Major 2nd. The simple equivalent shows the fundamental interval relationship without the octave displacement.',
      },
      {
        term: 'Slash chord',
        body: 'A chord written as ChordName/BassNote indicating a specific bass note that differs from the chord\'s root. C/E means a C major chord with E in the bass (first inversion). Slash chords are used to create smooth bass lines or to specify a particular voicing.',
      },
      {
        term: 'Tension dots',
        body: 'A visual indicator in the voice leading breakdown showing the level of harmonic tension. More dots = more tension = stronger pull toward resolution. The number of dots reflects the consonance/dissonance of the chord in its harmonic context.',
      },
      {
        term: 'Triad',
        body: 'The most fundamental chord type: three notes built by stacking two thirds. The four triad qualities are major (M3 + m3), minor (m3 + M3), diminished (m3 + m3), and augmented (M3 + M3). All other chords are extensions of triads.',
      },
      {
        term: 'Triad map',
        body: 'A table in the scale breakdown showing which triad is built on each degree of the scale. Reading it tells you the natural chord quality at every degree — for example, in a major scale: I major, II minor, III minor, IV major, V major, VI minor, VII diminished. The triad map is a practical tool for harmonising melodies and understanding which chords belong to a key.',
      },
      {
        term: 'Tritone',
        body: 'The interval of 6 semitones — exactly half an octave. Also called an augmented 4th (A4) or diminished 5th (d5/♭5) depending on context. The tritone is the most dissonant interval in common-practice harmony; it was historically called "diabolus in musica" (the devil in music). In a dominant 7th chord, the tritone between the 3rd and 7th is what creates the strong pull toward resolution.',
      },
      {
        term: 'Tritone substitution',
        body: 'A jazz reharmonisation technique where a dominant 7th chord is replaced by another dominant 7th chord whose root is a tritone (6 semitones) away. The two chords share the same guide tones (3rd and 7th, just swapped). The substitute chord creates a chromatic bass movement (e.g. D♭ → C instead of G → C) that is smooth and distinctive. Common in bebop and post-bop jazz.',
      },
      {
        term: 'Upper Structure Triad (UST)',
        body: 'A jazz voicing technique where a complete triad is played in the right hand above a shell voicing (3rd + 7th) in the left hand. The upper triad adds extensions and alterations to the chord without spelling them out individually. For example, a D triad over a C dominant shell (E + B♭) creates a C dominant chord with a 9th and a 13th. USTs are labelled by the Roman numeral of the upper triad relative to the chord root.',
      },
      {
        term: 'Voice leading',
        body: 'The practice of connecting chords so that individual notes (voices) move as smoothly as possible from one chord to the next — ideally by step (a half step or whole step), with contrary or oblique motion between voices. Good voice leading makes harmonic progressions feel fluid and inevitable rather than abrupt. It is a fundamental discipline in counterpoint, classical harmony, and jazz piano comping.',
      },
    ],
  },
];
