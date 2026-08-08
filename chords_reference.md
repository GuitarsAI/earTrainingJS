# Chord Reference — Complete Library
_Master checklist for The Sound Travels Ear Trainer_
_Status column: ✓ = in app · ✗ = missing · ⚠ = partial_

---

## How to read this file

- **Formula** uses scale degrees: 1 = root, ♭3 = minor third, ♯5 = augmented fifth, etc.
- **Intervals** = semitones from root (what goes in the `intervals` array in `chords.js`)
- **Status** = current state in the app
- **Family** = which `CHORD_TYPES` family it belongs to (or should belong to)

---

## 1. Triads

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Major | maj | 1–3–5 | [0,4,7] | major | ✓ |
| Minor | m | 1–♭3–5 | [0,3,7] | minor | ✓ |
| Diminished | dim | 1–♭3–♭5 | [0,3,6] | diminished | ✓ |
| Augmented | aug | 1–3–♯5 | [0,4,8] | augmented | ✓ |

---

## 2. Sixth Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Major 6 | maj6 | 1–3–5–6 | [0,4,7,9] | major | ✓ |
| Major 6/9 | maj6/9 | 1–3–5–6–9 | [0,4,7,9,14] | major | ✓ |
| Minor 6 | m6 | 1–♭3–5–6 | [0,3,7,9] | minor | ✓ |
| Minor 6/9 | m6/9 | 1–♭3–5–6–9 | [0,3,7,9,14] | minor | ✓ |

---

## 3. Added-Tone Chords

_Note: add9 = adds the 9th above the octave (compound). add2 = adds the 2nd in the same octave as the 3rd — a genuinely different voicing. Both are musically meaningful as distinct chords._

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Add 9 (major) | maj(add9) | 1–3–5–9 | [0,4,7,14] | major | ✓ (listed as maj(9)) |
| Add 2 (major) | maj(add2) | 1–2–3–5 | [0,2,4,7] | major | ✗ |
| Add 4 (major) | maj(add4) | 1–3–4–5 | [0,4,5,7] | major | ✗ |
| Add 9 (minor) | m(add9) | 1–♭3–5–9 | [0,3,7,14] | minor | ✓ (listed as m(9)) |
| Add 2 (minor) | m(add2) | 1–2–♭3–5 | [0,2,3,7] | minor | ✗ |
| Add 4 (minor) | m(add4) | 1–♭3–4–5 | [0,3,5,7] | minor | ✗ |
| Add 9 + Add 11 | add9(add11) | 1–3–5–9–11 | [0,4,7,14,17] | major | ✗ |

---

## 4. Seventh Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Major 7 | Maj7 | 1–3–5–7 | [0,4,7,11] | major | ✓ |
| Dominant 7 | 7 | 1–3–5–♭7 | [0,4,7,10] | dominant | ✓ |
| Minor 7 | m7 | 1–♭3–5–♭7 | [0,3,7,10] | minor | ✓ |
| Minor-Major 7 | m(Maj7) | 1–♭3–5–7 | [0,3,7,11] | minor | ✓ |
| Half-Diminished 7 | m7(♭5) | 1–♭3–♭5–♭7 | [0,3,6,10] | diminished | ✓ |
| Diminished 7 | o7 | 1–♭3–♭5–♭♭7 | [0,3,6,9] | diminished | ✓ |
| Augmented Major 7 | Maj7(♯5) | 1–3–♯5–7 | [0,4,8,11] | augmented | ✓ |
| Augmented 7 | 7(♯5) | 1–3–♯5–♭7 | [0,4,8,10] | augmented | ✗ |

---

## 5. Suspended Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Sus2 | sus2 | 1–2–5 | [0,2,7] | suspended | ✓ |
| Sus4 | sus4 | 1–4–5 | [0,5,7] | suspended | ✓ |
| 7sus4 | 7sus4 | 1–4–5–♭7 | [0,5,7,10] | dominant | ✓ |
| 7(9)sus4 | 7(9)sus4 | 1–4–5–♭7–9 | [0,5,7,10,14] | dominant | ✓ |
| 9sus4 | 9sus4 | 1–4–5–♭7–9 | [0,5,7,10,14] | dominant | ✓ (same as above) |
| 13sus4 | 13sus4 | 1–4–5–♭7–9–13 | [0,5,7,10,14,21] | dominant | ✗ |
| sus2(add7) | sus2(Maj7) | 1–2–5–7 | [0,2,7,11] | suspended | ✗ |
| sus4(add9) | sus4(add9) | 1–4–5–9 | [0,5,7,14] | suspended | ✗ |

---

## 6. Power Chord

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Power chord | 5 | 1–5 | [0,7] | suspended | ✓ |

---

## 7. Extended Dominant Chords

_Note: The app already has an extensive set. This table confirms coverage and flags gaps._

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Dominant 9 | 9 | 1–3–5–♭7–9 | [0,4,7,10,14] | dominant | ✓ (7(9)) |
| Dominant ♭9 | 7(♭9) | 1–3–5–♭7–♭9 | [0,4,7,10,13] | dominant | ✓ |
| Dominant ♯9 | 7(♯9) | 1–3–5–♭7–♯9 | [0,4,7,10,15] | dominant | ✓ |
| Dominant ♯11 | 7(♯11) | 1–3–5–♭7–♯11 | [0,4,7,10,18] | dominant | ✓ |
| Dominant ♭13 | 7(♭13) | 1–3–5–♭7–♭13 | [0,4,7,10,20] | dominant | ✓ |
| Dominant 13 | 13 | 1–3–5–♭7–9–13 | [0,4,7,10,14,21] | dominant | ✓ (7(13)) |
| Dominant 7♭5 | 7(♭5) | 1–3–♭5–♭7 | [0,4,6,10] | dominant | ✓ |
| Dominant 7♯5 | 7(♯5) | 1–3–♯5–♭7 | [0,4,8,10] | dominant | ✓ |
| Dominant 7(9,13) | 7(9)(13) | 1–3–5–♭7–9–13 | [0,4,7,10,14,21] | dominant | ✓ |
| Dominant 7(♭9)(♭13) | 7(♭9)(♭13) | 1–3–5–♭7–♭9–♭13 | [0,4,7,10,13,20] | dominant | ✓ |
| Dominant 7(♯9)(♯11) | 7(♯9)(♯11) | 1–3–5–♭7–♯9–♯11 | [0,4,7,10,15,18] | dominant | ✓ |
| Dominant 7(♯9)(♭13) | 7(♯9)(♭13) | 1–3–5–♭7–♯9–♭13 | [0,4,7,10,15,20] | dominant | ✓ |
| Dominant 7(9)(♯11) | 7(9)(♯11) | 1–3–5–♭7–9–♯11 | [0,4,7,10,14,18] | dominant | ✓ |
| Dominant 7(9)(♯11)(13) | 7(9)(♯11)(13) | 1–3–5–♭7–9–♯11–13 | [0,4,7,10,14,18,21] | dominant | ✓ |
| Dominant 7(♭9)(♯11) | 7(♭9)(♯11) | 1–3–5–♭7–♭9–♯11 | [0,4,7,10,13,18] | dominant | ✓ |
| Dominant 7(♭9)(♯11)(♭13) | 7(♭9)(♯11)(♭13) | 1–3–5–♭7–♭9–♯11–♭13 | [0,4,7,10,13,18,20] | dominant | ✓ |
| Dominant 11 | 11 | 1–3–5–♭7–9–11 | [0,4,7,10,14,17] | dominant | ✗ |
| Dominant ♭9,♯9 combined | 7(♭9,♯9) | 1–3–5–♭7–♭9–♯9 | [0,4,7,10,13,15] | dominant | ✗ |

---

## 8. Extended Major Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Major 9 | Maj7(9) | 1–3–5–7–9 | [0,4,7,11,14] | major | ✓ |
| Major 7(♯11) | Maj7(♯11) | 1–3–5–7–♯11 | [0,4,7,11,18] | major | ✓ |
| Major 7(13) | Maj7(13) | 1–3–5–7–13 | [0,4,7,11,21] | major | ✓ |
| Major 7(9)(♯11) | Maj7(9)(♯11) | 1–3–5–7–9–♯11 | [0,4,7,11,14,18] | major | ✓ |
| Major 7(9)(13) | Maj7(9)(13) | 1–3–5–7–9–13 | [0,4,7,11,14,21] | major | ✓ |
| Major 7(♯11)(13) | Maj7(♯11)(13) | 1–3–5–7–♯11–13 | [0,4,7,11,18,21] | major | ✓ |
| Major 7(9)(♯11)(13) | Maj7(9)(♯11)(13) | 1–3–5–7–9–♯11–13 | [0,4,7,11,14,18,21] | major | ✓ |
| Major 11 | Maj7(9)(11) | 1–3–5–7–9–11 | [0,4,7,11,14,17] | major | ✗ |
| Major 13 | Maj7(9)(11)(13) | 1–3–5–7–9–11–13 | [0,4,7,11,14,17,21] | major | ✗ |

---

## 9. Extended Minor Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Minor 9 | m7(9) | 1–♭3–5–♭7–9 | [0,3,7,10,14] | minor | ✓ |
| Minor 7(♭9) | m7(♭9) | 1–♭3–5–♭7–♭9 | [0,3,7,10,13] | minor | ✓ |
| Minor 11 | m7(11) | 1–♭3–5–♭7–11 | [0,3,7,10,17] | minor | ✓ |
| Minor 7(13) | m7(13) | 1–♭3–5–♭7–13 | [0,3,7,10,21] | minor | ✓ |
| Minor 7(9)(11) | m7(9)(11) | 1–♭3–5–♭7–9–11 | [0,3,7,10,14,17] | minor | ✓ |
| Minor 7(9)(13) | m7(9)(13) | 1–♭3–5–♭7–9–13 | [0,3,7,10,14,21] | minor | ✓ |
| Minor 7(11)(13) | m7(11)(13) | 1–♭3–5–♭7–11–13 | [0,3,7,10,17,21] | minor | ✓ |
| Minor 13 | m7(9)(11)(13) | 1–♭3–5–♭7–9–11–13 | [0,3,7,10,14,17,21] | minor | ✓ |
| Minor-Major 9 | m(Maj7)(9) | 1–♭3–5–7–9 | [0,3,7,11,14] | minor | ✓ |
| Minor-Major 11 | m(Maj7)(9)(11) | 1–♭3–5–7–9–11 | [0,3,7,11,14,17] | minor | ✓ |
| Minor-Major 13 | m(Maj7)(9)(11)(13) | 1–♭3–5–7–9–11–13 | [0,3,7,11,14,17,21] | minor | ✗ |

---

## 10. Diminished Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Diminished triad | dim | 1–♭3–♭5 | [0,3,6] | diminished | ✓ |
| Half-diminished 7 | m7(♭5) | 1–♭3–♭5–♭7 | [0,3,6,10] | diminished | ✓ |
| Diminished 7 | o7 | 1–♭3–♭5–♭♭7 | [0,3,6,9] | diminished | ✓ |
| Dim 7 add Maj7 | o7(Maj7) | 1–♭3–♭5–♭♭7–7 | [0,3,6,9,11] | diminished | ✗ |

---

## 11. Augmented Chords

| Name | Symbol | Formula | Intervals | Family | Status |
|---|---|---|---|---|---|
| Augmented triad | aug | 1–3–♯5 | [0,4,8] | augmented | ✓ |
| Augmented Major 7 | Maj7(♯5) | 1–3–♯5–7 | [0,4,8,11] | augmented | ✓ |
| Augmented 7 | aug7 | 1–3–♯5–♭7 | [0,4,8,10] | augmented | ✗ |
| Augmented 9 | aug9 | 1–3–♯5–♭7–9 | [0,4,8,10,14] | augmented | ✗ |

---

## 12. Classical Chords

_These chords are context-dependent in classical harmony — they function as chromatic pre-dominant chords and resolve to V. They have no conventional "root" in the traditional sense, but can be represented from a bass-note reference._

### Neapolitan Chord (♭II)

| Name | Symbol | Formula (from tonic) | Intervals (from ♭2) | Family | Status |
|---|---|---|---|---|---|
| Neapolitan (♭II) | N6 | ♭2–4–♭6 (major triad on ♭II) | [0,4,7] (from ♭2) | classical | ✗ |

_Implementation note: The Neapolitan is a major triad whose root is ♭2 above the tonic. In the app it can be represented as a major triad with a special label/breakdown explaining its classical function._

### Augmented Sixth Chords

_All are built from the bass note ♭6 (le) and contain the interval of an augmented sixth (♭6 up to ♯4). The intervals below are from the bass note (♭6)._

| Name | Symbol | Notes (in C minor) | Intervals from bass | Family | Status |
|---|---|---|---|---|---|
| Italian +6 | It+6 | A♭–C–F♯ | [0,4,9] | classical | ✗ |
| French +6 | Fr+6 | A♭–C–D–F♯ | [0,4,6,9] | classical | ✗ |
| German +6 | Ger+6 | A♭–C–E♭–F♯ | [0,4,7,9] | classical | ✗ |

_Implementation note: Augmented sixth chords are enharmonically interesting — the German +6 is enharmonically equivalent to a dominant 7th chord. The breakdown panel should explain this relationship and their classical function (→ V)._

---

## 13. Quartal / Quintal Chords

_Built by stacking fourths (quartal) or fifths (quintal) instead of thirds. Quintal is the inversion of quartal — they share the same pitch content in different order. Common in jazz (McCoy Tyner, Herbie Hancock, Chick Corea) and modern classical (Hindemith, Bartók, Schoenberg)._

| Name | Symbol | Description | Intervals (typical) | Family | Status |
|---|---|---|---|---|---|
| Quartal (3-note) | qrt3 | Stack of 2 perfect fourths | [0,5,10] | quartal | ✗ |
| Quartal (4-note) | qrt4 | Stack of 3 perfect fourths | [0,5,10,15] | quartal | ✗ |
| Quartal (5-note / "So What") | qrt5 | Stack of 4 fourths (P4+P4+P4+M3) | [0,5,10,15,19] | quartal | ✗ |
| Mixed quartal (with tritone) | qrtTT | P4 + P4 + TT | [0,5,10,16] | quartal | ✗ |
| Quintal (3-note) | qnt3 | Stack of 2 perfect fifths | [0,7,14] | quartal | ✗ |
| Quintal (4-note) | qnt4 | Stack of 3 perfect fifths | [0,7,14,21] | quartal | ✗ |

_Implementation note: Quartal chords are rootless by nature — any note can function as the root depending on context. The app should present them from the lowest note as the reference. The breakdown should explain the stacked-fourths construction and list the intervals between adjacent notes rather than "from root". This requires a flag in the chord data (e.g. `quartal: true`) and a custom breakdown rendering path._

---

## 14. Cluster / Secundal Chords

_Built by stacking major or minor seconds. More timbral than harmonic — they create dense dissonant sound masses. Common in contemporary classical, avant-garde, film scoring, ambient._

| Name | Symbol | Description | Intervals | Family | Status |
|---|---|---|---|---|---|
| Major 2nd cluster (3-note) | clust_M2_3 | Root + M2 + M2 | [0,2,4] | cluster | ✗ |
| Minor 2nd cluster (3-note) | clust_m2_3 | Root + m2 + m2 | [0,1,2] | cluster | ✗ |
| Mixed cluster (4-note) | clust_mix_4 | m2 + M2 + m2 | [0,1,3,4] | cluster | ✗ |
| Tone cluster (chromatic, 4-note) | clust_chr_4 | 4 chromatic semitones | [0,1,2,3] | cluster | ✗ |

_Implementation note: Like quartal chords, clusters don't have a meaningful "from root" interval analysis. The breakdown should show adjacent intervals (m2/M2) and describe the timbral effect. A `cluster: true` flag in the chord data would trigger a custom breakdown path._

---

## 15. Slash Chords

See existing implementation — well covered. Pool includes 9 major-upper + 9 minor-upper types covering all non-triad-tone bass positions.

| Status | ✓ fully implemented |
|---|---|

---

## 16. Polychords

See existing implementation — covers Maj/Maj, Maj/Min, Min/Maj, Min/Min, Aug variants, Dom7 variants at P5 and TT positions.

| Status | ✓ well covered — may expand later |
|---|---|

---

## 17. Upper Structure Triads (UST)

See existing implementation — covers Dom7 shell, m7 shell, Maj7 shell with 4–7 upper triads each.

| Status | ✓ well covered |
|---|---|

---

## Summary of what's missing

### High priority — standard chords missing from families

| Chord | Intervals | Where to add |
|---|---|---|
| Augmented 7 (aug7) | [0,4,8,10] | augmented family |
| Augmented 9 (aug9) | [0,4,8,10,14] | augmented family |
| Add2 / major | [0,2,4,7] | major family |
| Add2 / minor | [0,2,3,7] | minor family |
| Add4 / major | [0,4,5,7] | major family |
| Add4 / minor | [0,3,5,7] | minor family |
| 13sus4 | [0,5,7,10,14,21] | dominant family |
| sus2(Maj7) | [0,2,7,11] | suspended family |
| sus4(add9) | [0,5,7,14] | suspended family |
| Major 11 | [0,4,7,11,14,17] | major family |
| Major 13 | [0,4,7,11,14,17,21] | major family |
| Dominant 11 | [0,4,7,10,14,17] | dominant family |
| m(Maj7)(9)(11)(13) | [0,3,7,11,14,17,21] | minor family |
| 7(♭9,♯9) | [0,4,7,10,13,15] | dominant family |

### Medium priority — classical chords (need special breakdown handling)

| Chord | Notes |
|---|---|
| Neapolitan (♭II / N6) | Major triad on ♭II — explain classical function |
| Italian +6 | [0,4,9] from ♭6 — explain augmented sixth resolution |
| French +6 | [0,4,6,9] from ♭6 |
| German +6 | [0,4,7,9] from ♭6 — note enharmonic = dom7 |

### Lower priority — non-tertian chords (need architectural work)

| Chord family | Architecture needed |
|---|---|
| Quartal (3–5 note stacks) | `quartal: true` flag + custom breakdown path — no "from root" analysis |
| Quintal (3–4 note stacks) | Same as quartal — inversionally equivalent |
| Cluster / Secundal | `cluster: true` flag + custom breakdown — adjacent interval analysis |

---

## File splitting recommendation

When the chord library grows, split `chords.js` by family. All files must contribute to the shared `CHORD_TYPES` object. Suggested split:

| File | Contents |
|---|---|
| `js/data/chords-tertian.js` | major, minor, dominant, diminished, augmented, suspended |
| `js/data/chords-special.js` | slash, poly, UST (unchanged) |
| `js/data/chords-classical.js` | Neapolitan, Italian/French/German +6 |
| `js/data/chords-quartal.js` | quartal, quintal, cluster |

Load order in `index.html`: tertian → special → classical → quartal, all before `state.js`.
