# The Sound Travels Ear Trainer — App Plan & Status

---

## Changelog

- **1** Notation: exact octaves, auto bass/grand clef, accidentals
- **2** Inversion system: procedural, all chord types, labelled correctly
- **3** Octave range: root oct 2–5, top note < C7, extended chords oct 3+
- **4** Extended chord set — superseded by 9b
- **5** Interval training mode: 12 intervals, 3 playback styles + notation
- **6** Chord playback modes: Block / Ascending / Descending / Broken / Random
- **7** Scale training mode: 18 scales, asc / desc / both
- **8** UX: root badge, Hear Slowly, session stats; Space + Enter shortcuts
- **9** Scale library expansion — reorganised in 28
- **9b** Full chord library rebuild: six families, Berklee symbols
- **10** Granular pool panel: collapsible, per-mode chips, All/None, inversions toggle
- **11** Answer dropdown: auto-submit, green/red feedback, correct answer revealed
- **12** Root note + octave register chips (Rnd | C–B | Low/Mid/High)
- **13** Enharmonic spelling engine: spelledNote(), SYMBOL_SPELLING, VexFlow keys
- **14** Breakdown panel: figured bass header, Notes / From root / Between notes
- **15** Bug fixes: showNotation wrapper, showBreakdown call, outsideClick dedup
- **16** Visual redesign: teal accent, CSS vars, dark/light toggle + localStorage
- **17** Typography: Playfair Display + Inter via Google Fonts
- **18** Logo: base64 inline, dark-mode invert filter
- **19** Layout: sticky header + mode tabs, enlarged play button, collapsible Settings
- **20a** Dark mode contrast lifted for WCAG AA
- **20b** Random direction chip for intervals and scales
- **20c** Notation card fixed to #fff in both themes
- **20.5** New Session button; resetSession() shared with stats Reset
- **21** Responsive pass: rem units, 44px touch targets, < 480px breakpoint
- **21b** Header layout: two-line sticky, title always visible
- **22** Breakdown enrichment (all three modes): intervals, scales, chords
  - Intervals: semitones, degree numeral, inversion, consonance, common context
  - Scales: degree numerals, triad map, modal character, parent scale
  - Chords: interval numerals, Riemannian relations, tritone sub, dim/aug/sus theory
- **23** Voicing modes: Full / Real / Shell / Guide + Random chip
- **24** Tritone label: A4/d5 context-aware, replaces "TT" everywhere
- **25** Slash chords: root-agnostic, 18 types (9 maj + 9 min upper), grand staff
- **25b** Slash playback fix: bass merged into shared pipeline
- **26** Polychords: 8 types, two stacked triads, grand staff, full breakdown. UST: 7 types (I–VII), rootless dom7 shell + upper triad, breakdown with tensions
- **27** Pentatonic section: 7 scales, dual labels for Major/Minor Pentatonic
- **28** Scale library by note count: Pentatonic / Hexatonic / Diatonic / Octatonic. Added Augmented scale and Prometheus
- **29** Qualified Roman numerals throughout: ♭III, ♯IV, ♭VI, ♭VII etc. SEMITONE_TO_ROMAN table; semitoneToDegree(); computeDegreeNumerals(). Degrees row now shown for all scale lengths
- **29b** Context-aware enharmonic labels throughout: intervalAbbr(), semitonesToNumeral(), computeDegreeNumerals() all take symbol param. EIGHT_AS_A5 / NINE_AS_D7 / TRITONE_AS_D5 sets drive context switching. Fixes A5/m6, °VII/M6, d5/A4 across chord From root, Numerals, scale Degrees, UST and polychord breakdowns
- **29c** Interval pool relabelled for enharmonic clarity: "Tritone" → "Tritone (A4 / ♭5)"; "Minor 6th" → "Aug 5th / Minor 6th". INTERVAL_INVERSION_NAME updated to match
- **30** Scale direction bug fix: notation now updates in sync with playback when direction chip changes after answer is revealed
- **31** Dictionary mode: Quiz / Dictionary toggle inline in score bar. Pool panel switches to single-select; selecting a chip immediately shows notation + breakdown. Switching mode tabs resets selection to first item in first group
- **32** Chord notation mirrors playback style: Block → stacked chord; Ascending/Descending → melodic left-to-right sequence; Broken → exact broken pattern (root–top–mid–top)
- **33** Dictionary mode settings re-render wiring complete: voicing chips, chord playback style chips, interval style chips, and scale direction chips all trigger immediate notation + breakdown refresh in dictionary mode
- **34** More polychord types: 16 new entries covering Aug upper/lower and Dom7 upper/lower (both P5 and TT positions). polyQualitySuffix() and polyQualityFull() helpers replace all hardcoded quality checks throughout label generation and breakdown. Contextual notes added: aug symmetry (3 enharmonic roots), dom7 tritone tension
- **35** More UST types — Minor shell [♭3 + ♭7]: IIm, IV, ♭VII, ♭VI upper triads → m7 contexts. Maj7 shell [3 + 7]: II, IIm, V, VIm upper triads → Maj7 contexts. Pool panel split into three UST sections (Dom7 / m7 / Maj7 shell). Breakdown, labels, notation and root badge all adapt per shell quality
- **36** Chord scales breakdown row (all chord families): algorithmic set-intersection against all 25 scales in SCALE_REF. Scale root = chord root (upper root for slash, lower root for poly, implied root for UST); all sounding pitch classes must be contained in the scale. Collapsible "N scales fit ▸" sub-section within breakdown; each row shows scale name + teal tag (neutral/bright/tense/dark/etc.) + faint descriptive note. Applies in quiz (post-answer) and dictionary mode across normal chords, inversions, slash, polychords, and UST
- **37** Voice leading panel — *partially implemented, being redesigned* (see TODO below)
- **39** Extended / compound intervals: 7 new entries: m9, M9, A9/♯9, P11, A11/♯11, m13, M13. Pool panel split into "Simple intervals" and "Extended / Compound" sections (compound collapsed and unselected by default). Breakdown: "Simple equivalent" row replaces inversion row for compound intervals. INTERVAL_CONSONANCE and INTERVAL_CONTEXT extended to cover all new semitone values
- **Tab order** Tabs reordered to Intervals | Chords | Scales (was Chords | Intervals | Scales); Intervals is now the default landing mode
- **Mobile** Full mobile responsive pass: fixed bottom play bar removed; dark mode toggle moved to score bar on mobile (duplicate button, CSS show/hide per breakpoint, JS syncs both); root panel open on desktop / collapsed on mobile via JS boot; all root chips visible via flex-wrap grid (was hidden horizontal scroll); dynamic body padding-top driven by actual sticky header height; default root set to C

---

## TODO

### Point 37 — Voice leading panel (redesign)

The current implementation uses a lookup table (`RESOLUTION_TARGETS`) for resolution
targets and a nearest-note algorithm for voice leading. Both are being replaced with
a smarter hybrid system based on the following decisions:

#### Resolution timing
- The current pause (0.7s after 1.8s source chord = ~2.5s total) is too long and
  breaks the sense of harmonic motion
- Tighten to approximately **1.2s source + 0.3s pause**, or allow overlap
  (source chord gives way directly to resolution without silence)

#### Resolution targets — hybrid algorithm
Replace the static `RESOLUTION_TARGETS` lookup table with an algorithmic approach,
falling back to a lookup table only for exotic/ambiguous cases:

**Algorithm (runs first):**
1. Detect the **tritone** in the chord — its two notes have unambiguous tendencies
   (augmented 4th expands, diminished 5th contracts) and directly imply the
   resolution root
2. If no tritone, find the **strongest dissonance** present and resolve accordingly
3. Fall back to conventional harmonic motion (P4 up for dominant function) if no
   clear tension is found

**Lookup table (exception whitelist only):**
- Augmented chords (three enharmonically equal resolutions — algorithm can't pick one)
- Polychords and USTs (no single clear resolution target)
- Sus chords (tension ambiguous by design)
- Power chords (no harmonic information)
- Any case where the algorithm produces a musically wrong result

New chord types added to the quiz will automatically receive reasonable voice leading
without touching the exception table.

#### Voice leading — hybrid algorithm + lookup table

Same hybrid principle as resolution targets: the algorithm runs first, the lookup
table catches cases it gets wrong. New chord types are handled automatically; the
table grows only when the algorithm produces a musically wrong result.

Replace the current nearest-note-only approach with a **constraint satisfaction** model:

**Hard constraints (must satisfy):**
- Tendency tones resolve in their natural direction:
  - Leading tone (e.g. B in G7) **must rise** by m2 to the tonic
  - Chordal 7th (e.g. F in G7) **must fall** by m2
- No two voices resolve to the same pitch class unless doubling rules permit it
- Avoid doubling the 3rd of the target chord; prefer doubling the root

**Soft constraints (scored and minimised):**
- Total semitone motion across all voices (prefer minimal movement)
- Parallel 5ths and octaves (penalise)
- Poor doublings (penalise)

The assignment with the best score after satisfying hard constraints is chosen.

**Example — G7 → C major (correct voice leading):**
```
B  → C   (m2 ↑  — leading tone, hard constraint)
F  → E   (m2 ↓  — chordal 7th, hard constraint)
G  → G   (common tone)
D  → E or G  (flexible — complete the chord, avoid doubling 3rd)
```
The current code incorrectly moves D → C (nearest note) rather than D → E or G.

#### Multiple resolutions — interactive UI

Show **all plausible resolution options** ranked by commonality. The most common
one plays automatically. Clicking another plays it instead and updates the notation
and voice leading arrows.

**Ranking order (universal, no style selector needed):**
1. Functional resolution (tritone-driven, e.g. V→I) — always first, plays on load
2. Deceptive cadence (e.g. V→vi)
3. Modal / jazz alternatives (tritone sub, backdoor dominant, etc.)
4. Exotic resolutions

**UI — resolution pills (chips):**
- Rendered as clickable chips consistent with the existing chip/pill design system
- First pill pre-selected and highlighted with the active chip style
- Label format: **chord name + cadence type**, e.g.:
  - `C  (V→I)`
  - `Am  (deceptive)`
  - `D♭  (tritone sub)`
- This passively teaches cadence names while the user explores
- Voice leading arrows update to reflect the selected resolution only (not all simultaneously)

**Notation:**
- Clicking a pill immediately updates notation to show source → selected resolution
  side by side (existing two-chord notation layout)
- The "Resolve →" play button plays whichever pill is currently selected

---

### Point 38 — Chord progression mode

#### Overview
New **Progressions** tab added to the mode tab bar: Intervals | Chords | Scales | **Progressions**.
Fixed collection of common progressions, granularly selectable via the pool panel (same
chip pattern as all other modes). Available in both **Quiz** and **Dictionary** modes.

#### Playback
- Play button plays the **whole progression** once, with a short gap between chords
- **No loop** — user re-listens by pressing the main play button again (no extra "Play Again" button needed)
- Root is **randomised per question** (same as chord/interval/scale modes)
- Chord vocabulary kept **simple** — triads and basic 7ths only, no heavy extensions
  (this is a harmonic relationship test, not an absolute ear test)

#### What the user identifies
- **Degree in Roman numerals + chord quality** for each chord in the progression
- e.g. `V 7`, `ii m7`, `I maj` — not absolute roots
- This tests understanding of harmonic relationships, not perfect pitch

#### Answer UI — two-step chip selection per chord slot
Each chord slot gets a two-step selection (more musical, reduces cognitive load,
teaches the two dimensions separately):
1. **Degree chip**: `I  ii  iii  IV  V  vi  vii°  ♭VII` etc.
2. **Quality chip**: `maj  m  7  maj7  m7  dim  aug  sus4` etc.

User listens to the whole progression first, then fills in all slots before submitting.
One degree+quality pair per chord slot, all slots visible upfront.

#### Scoring & feedback
- A progression is counted as **correct only if all chord slots are right** — partial
  answers do not increment the score or streak
- After submitting, each chord slot turns **green (correct) or red (wrong)** independently,
  consistent with the existing dropdown correct/wrong colour pattern
- **Correct answer is always revealed** in red slots — same behaviour as the existing
  dropdown, essential for learning; the student sees exactly what the chord should have
  been and where in the progression they went wrong
- Granular per-slot feedback is shown regardless of overall score outcome — getting
  3 out of 4 right shows three green and one red, so the student knows precisely
  which chord they missed and can re-listen to focus on that moment

#### Notation
- Notation panel shows **all chords in the progression** simultaneously, like a lead sheet
- Revealed after answering (same pattern as other modes)

#### Pool panel
- Same collapsible chip panel as other modes
- Progressions grouped by section (see below)
- Each progression chip shows **Roman numerals + cadence/style name**, e.g. `V–I  (Perfect Authentic)`
- Dictionary mode: select a progression chip → hear it + see notation immediately

#### Progression collection (2–6 chords)

**Cadences (2 chords) — named harmonic gestures that end a phrase:**

Cadences are the most fundamental harmonic relationships in tonal music. Each chip
shows both Roman numerals and the cadence name so students learn the terminology
passively while training their ear.

- `V–I` **(Perfect Authentic Cadence)** — strongest possible resolution; both chords
  root position, melody ends on tonic
- `V7–I` **(Perfect Authentic, with dom7)** — same but with added tension from the 7th
- `IV–I` **(Plagal Cadence)** — the "amen" cadence; softer, more final; common in hymns
  and gospel
- `I–V` **(Half Cadence)** — ends on dominant, feels unresolved; a musical question mark
- `ii–V` **(Half Cadence, jazz)** — the standard jazz setup; ear expects I to follow
- `IV–V` **(Half Cadence, rock/pop)** — common approach to the dominant
- `V–vi` **(Deceptive Cadence)** — ear expects I but gets vi; surprise resolution; very
  common in pop and classical
- `V7–vi` **(Deceptive Cadence, with dom7)** — same surprise but with added tension
- `iv6–V` **(Phrygian Cadence)** — iv in first inversion to V in minor; very dark and
  distinctive; common in baroque and flamenco

**Diminished & half-diminished resolutions (2 chords) — critical for jazz and classical:**

Often neglected in ear training but essential. The diminished and half-diminished
chords have strong tendency tones that make their resolutions very characteristic.

- `vii°–I` **(Leading tone resolution)** — diminished triad resolves to major tonic;
  classical voice leading; the 3-note version of V7→I
- `vii°7–I` **(Fully diminished resolution)** — fully diminished 7th to major tonic;
  very dramatic; common in classical and jazz; symmetrical chord (4 enharmonic roots)
- `vii°7–i` **(Fully diminished to minor tonic)** — same tension, darker arrival;
  extremely common in minor key classical music
- `iiø7–V` **(Half-diminished to dominant)** — the ii∅ in minor; sets up dominant
  without resolving; classic jazz minor ii–V setup
- `iiø7–V7` **(Half-diminished to dominant 7th)** — complete jazz minor ii–V; the most
  important 2-chord gesture in jazz minor harmony
- `iiø7–i` **(Half-diminished direct resolution)** — skips the dominant; less common
  but distinctive sound
- `#iv°–V` **(Chromatic diminished approach)** — augmented fourth diminished chord
  resolving to dominant; chromatic colour, common in romantic and jazz harmony

**Short progressions — 3 chords:**
- I–IV–V (rock / folk / blues foundation)
- I–V–vi (partial axis, very common in pop)
- i–VII–VI (minor descending, rock/metal)
- I–vi–V (classical descending)
- I–IV–I (blues turnaround fragment)

**Pop & Rock — 4 chords:**
- I–V–vi–IV (axis progression — dominant in modern pop)
- vi–IV–I–V (axis starting on vi — same chords, different feel)
- I–IV–vi–V
- I–iii–IV–V (ascending, bright)
- I–iii–vi–IV (emotional pop variant)
- I–IV–I–V (blues-adjacent, country)
- I–VII–IV–I (mixolydian feel, classic rock)
- ii–IV–I–V (gospel)

**Jazz — 4 chords:**
- ii–V–I–VI (jazz turnaround — the most important 4-chord pattern in jazz)
- iii–VI–ii–V (jazz cycle of 5ths)
- I–VI–ii–V (rhythm changes A section)
- i–iv–VII–III (minor jazz)
- i–iiø7–V7–i (minor ii–V–I — essential jazz minor cadence)

**Minor — 4 chords:**
- i–VII–VI–VII (natural minor, very common in rock/pop)
- i–VI–III–VII (natural minor cycle)
- i–iv–v–i (pure minor, classical)
- i–VI–VII–i
- i–III–VII–VI (epic/cinematic minor)
- i–v–VI–VII (dramatic minor)

**Extended — 5 & 6 chords:**
- I–IV–V–IV–I (rock/blues, symmetrical return)
- ii–V–I–IV–V (extended jazz cadence)
- i–VII–VI–VII–i (minor with return)
- I–iii–IV–iv–I–V (borrowed iv chord — emotional, Beatles-style)
- ii–V–I–vi–ii–V (jazz loop, 6 chords)
- i–VII–VI–V–i–V (flamenco/classical minor, 6 chords)

#### Open questions
- Scoring: partial credit per chord slot, or all-or-nothing per progression?
- 8-chord progressions (12-bar blues, rhythm changes) deferred to Parking Lot for now

---

### Point 40 — Clickable chord scales → Dictionary mode

When the breakdown panel shows the chord scales section (post-answer in quiz, or in
dictionary mode), each scale name is **clickable** and opens that scale in Dictionary
mode for immediate exploration.

#### Behaviour
- Clicking a scale name in the chord scales list switches the app to **Dictionary mode,
  Scales tab**, and loads that scale instantly with notation and full breakdown
- The scale opens at the **currently active root at the moment of clicking** — not the
  original quiz question root. If the user changed the root chip to explore a different
  voicing before clicking, that root is used. The user is always in control of the root.
- **All current settings are inherited** by Dictionary mode — key signature (C or Key),
  notation style, ascending/descending direction, and any other active state carries
  over exactly as-is. Nothing resets.
- To return to the quiz, the user simply presses the **Quiz toggle** in the existing
  Quiz/Dictionary switcher — no extra back button or navigation needed
- The quiz session (score, streak, current question) is **fully preserved** in memory
  while the user explores in Dictionary mode and is restored immediately on switching back

#### Why this is powerful
- The user can explore any matching scale in full — hear it, see the notation, read the
  breakdown — without losing their quiz context
- Root inheritance means the scale always shows in the musical context the user was
  already exploring, making the chord→scale relationship immediately audible
- Clicking multiple scales in sequence (switching back to quiz between each) lets the
  user compare all matching scales against the same chord root

---

## Parking Lot

- Spaced repetition — weight pool toward weak spots rather than uniform random
- Quiz history — prevent same chord/scale/interval repeating back-to-back
- Timed mode — answer before the clock runs out
- MIDI input — play answer on a connected keyboard instead of the dropdown
- Export session stats as CSV
