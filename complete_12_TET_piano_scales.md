# Complete 12-TET Piano Scale & Pitch-Collection Catalogue
> **Scope:** exhaustive catalogue of every non-empty 12-tone-equal-temperament pitch collection with **C designated as the root**, i.e. every subset of the 12 chromatic piano pitch classes that contains C. This gives **2¹¹ = 2,048 rooted collections**. The catalogue includes collections that have no established traditional name.
> **Important distinction:** a piano can play all 2,048 collections below, but not every collection is traditionally called a “scale.” This file therefore uses *scale / pitch collection* deliberately. Named literature is indexed where a name is established; the remaining entries are mathematical 12-TET collections rather than invented claims of historical usage.

## How to read the catalogue
- **C-rooted:** C is pitch class 0 and is treated as the tonic/root.
- **Piano notes:** the exact ordinary 12-TET piano keys in one octave.
- **PC set:** pitch classes, with C=0, C♯=1, …, B=11.
- **Interval pattern:** successive semitone distances, including the final distance back to C.
- **Mask:** a 12-bit representation of the collection, useful for computer/database work.
- Enharmonic spellings are normalized to a chromatic-key representation; theoretical spellings such as B♭♭ are not required to play the collection on a piano.

## Cardinality counts
| Notes in collection | Number of C-rooted collections |
|---:|---:|
| 1 | 1 |
| 2 | 11 |
| 3 | 55 |
| 4 | 165 |
| 5 | 330 |
| 6 | 462 |
| 7 | 462 |
| 8 | 330 |
| 9 | 165 |
| 10 | 55 |
| 11 | 11 |
| 12 | 1 |
| **Total** | **2,048** |

## Named / literature index
The following index identifies well-known or documented names that correspond to collections in the exhaustive table. Names are not treated as globally standardized: different authors sometimes use the same name for different pitch collections, or different names for the same collection. For source-oriented study, compare the actual notes/intervals rather than relying on the name alone.

| Name | C notes | Interval pattern | PC set |
|---|---|---|---|
| Iwato | C C♯ F F♯ A♯ | 1-4-1-4-2 | {0,1,5,6,T} |
| In-sen / Japanese approximation | C C♯ F G A♯ | 1-4-2-3-2 | {0,1,5,7,T} |
| Hirajoshi / Japanese approximation | C D D♯ G A | 2-1-4-2-3 | {0,2,3,7,9} |
| Major Pentatonic | C D E G A | 2-2-3-2-3 | {0,2,4,7,9} |
| Dominant Pentatonic | C D E G B | 2-2-3-4-1 | {0,2,4,7,E} |
| Yo / Ritsu pentatonic | C D F G A | 2-3-2-2-3 | {0,2,5,7,9} |
| Suspended Pentatonic / Egyptian | C D F G A♯ | 2-3-2-3-2 | {0,2,5,7,T} |
| Minor Pentatonic / Blues-derived | C D♯ F G A♯ | 3-2-2-3-2 | {0,3,5,7,T} |
| Tritone Hexatonic | C C♯ D♯ F♯ G A | 1-2-3-1-2-3 | {0,1,3,6,7,9} |
| Prometheus Liszt / hexatonic collection | C C♯ E F G A | 1-3-1-2-2-3 | {0,1,4,5,7,9} |
| Messiaen Mode 5 (one common transposition) | C C♯ F G G♯ B | 1-4-2-1-3-1 | {0,1,5,7,8,E} |
| Major Blues | C D D♯ E G A | 2-1-1-3-2-3 | {0,2,3,4,7,9} |
| Whole Tone | C D E F♯ G♯ A♯ | 2-2-2-2-2-2 | {0,2,4,6,8,T} |
| Prometheus / Mystic | C D E F♯ A A♯ | 2-2-2-3-1-2 | {0,2,4,6,9,T} |
| Augmented Hexatonic | C D♯ E G G♯ B | 3-1-3-1-3-1 | {0,3,4,7,8,E} |
| Minor Blues | C D♯ F F♯ G A♯ | 3-2-1-1-3-2 | {0,3,5,6,7,T} |
| Half-Whole Diminished | C C♯ D♯ E F♯ G♯ A♯ | 1-2-1-2-2-2-2 | {0,1,3,4,6,8,T} |
| Locrian | C C♯ D♯ F F♯ G♯ A♯ | 1-2-2-1-2-2-2 | {0,1,3,5,6,8,T} |
| Phrygian | C C♯ D♯ F G G♯ A♯ | 1-2-2-2-1-2-2 | {0,1,3,5,7,8,T} |
| Neapolitan Minor | C C♯ D♯ F G G♯ B | 1-2-2-2-1-3-1 | {0,1,3,5,7,8,E} |
| Phrygian ♮6 / related modal collection | C C♯ D♯ F G A B | 1-2-2-2-2-2-1 | {0,1,3,5,7,9,E} |
| Double Harmonic Major / Byzantine | C C♯ E F G G♯ A♯ | 1-3-1-2-1-2-2 | {0,1,4,5,7,8,T} |
| Spanish / Flamenco / Phrygian-Dominant family | C C♯ E F G G♯ B | 1-3-1-2-1-3-1 | {0,1,4,5,7,8,E} |
| Enigmatic-type collection | C C♯ E F♯ G A A♯ | 1-3-2-1-2-1-2 | {0,1,4,6,7,9,T} |
| Hungarian / Byzantine-type collection | C C♯ E F♯ G A B | 1-3-2-1-2-2-1 | {0,1,4,6,7,9,E} |
| Messiaen Mode 3 (one common transposition) | C D D♯ E F♯ G♯ A | 2-1-1-2-2-1-3 | {0,2,3,4,6,8,9} |
| Aeolian / Natural Minor | C D D♯ F G G♯ A♯ | 2-1-2-2-1-2-2 | {0,2,3,5,7,8,T} |
| Harmonic Minor | C D D♯ F G G♯ B | 2-1-2-2-1-3-1 | {0,2,3,5,7,8,E} |
| Dorian | C D D♯ F G A A♯ | 2-1-2-2-2-1-2 | {0,2,3,5,7,9,T} |
| Melodic Minor / Jazz Minor | C D D♯ F G A B | 2-1-2-2-2-2-1 | {0,2,3,5,7,9,E} |
| Hungarian Minor | C D D♯ F♯ G G♯ B | 2-1-3-1-1-3-1 | {0,2,3,6,7,8,E} |
| Romanian Minor / Ukrainian Dorian | C D D♯ F♯ G A A♯ | 2-1-3-1-2-1-2 | {0,2,3,6,7,9,T} |
| Dorian ♯4 / Romanian-family collection | C D D♯ F♯ G A B | 2-1-3-1-2-2-1 | {0,2,3,6,7,9,E} |
| Harmonic Major | C D E F G G♯ B | 2-2-1-2-1-3-1 | {0,2,4,5,7,8,E} |
| Mixolydian | C D E F G A A♯ | 2-2-1-2-2-1-2 | {0,2,4,5,7,9,T} |
| Major / Ionian | C D E F G A B | 2-2-1-2-2-2-1 | {0,2,4,5,7,9,E} |
| Lydian Dominant | C D E F♯ G A A♯ | 2-2-2-1-2-1-2 | {0,2,4,6,7,9,T} |
| Lydian | C D E F♯ G A B | 2-2-2-1-2-2-1 | {0,2,4,6,7,9,E} |
| Messiaen Mode 6 (one common transposition) | C D E F♯ G♯ A B | 2-2-2-2-1-2-1 | {0,2,4,6,8,9,E} |
| Messiaen Mode 4 (one common transposition) | C C♯ D E F♯ G A A♯ | 1-1-2-2-1-2-1-2 | {0,1,2,4,6,7,9,T} |
| Messiaen Mode 2 | C C♯ D♯ E F♯ G A A♯ | 1-2-1-2-1-2-1-2 | {0,1,3,4,6,7,9,T} |
| Locrian Bebop | C C♯ D♯ F F♯ G♯ A♯ B | 1-2-2-1-2-2-1-1 | {0,1,3,5,6,8,T,E} |
| Whole-Half Diminished | C D D♯ F F♯ G♯ A B | 2-1-2-1-2-1-2-1 | {0,2,3,5,6,8,9,E} |
| Minor Bebop | C D D♯ F G G♯ A♯ B | 2-1-2-2-1-2-1-1 | {0,2,3,5,7,8,T,E} |
| Dominant Bebop | C D D♯ F G A A♯ B | 2-1-2-2-2-1-1-1 | {0,2,3,5,7,9,T,E} |
| Major Bebop | C D E F G A A♯ B | 2-2-1-2-2-1-1-1 | {0,2,4,5,7,9,T,E} |
| Messiaen Mode 7 (one common transposition) | C C♯ D♯ E F♯ G♯ A A♯ B | 1-2-1-2-2-1-1-1-1 | {0,1,3,4,6,8,9,T,E} |

## Exhaustive catalogue: all 2,048 C-rooted 12-TET collections
Entries are ordered first by number of notes and then by the binary mask. A traditional name is shown only when this catalogue assigns a documented/common name to that exact collection; **Unnamed / mathematical** means the collection is included because it is a valid playable 12-TET pitch collection, not because a historical source necessarily gave it a name.

| # | Degrees | Name / status | C piano notes | Interval pattern | PC set | 12-bit mask |
|---:|---:|---|---|---|---|---|
| 1 | 1 | Unnamed / mathematical 12-TET collection | C | — | {0} | `000000000001` |
| 2 | 2 | Unnamed / mathematical 12-TET collection | C C♯ | 1-11 | {0,1} | `000000000011` |
| 3 | 2 | Unnamed / mathematical 12-TET collection | C D | 2-10 | {0,2} | `000000000101` |
| 4 | 2 | Unnamed / mathematical 12-TET collection | C D♯ | 3-9 | {0,3} | `000000001001` |
| 5 | 2 | Unnamed / mathematical 12-TET collection | C E | 4-8 | {0,4} | `000000010001` |
| 6 | 2 | Unnamed / mathematical 12-TET collection | C F | 5-7 | {0,5} | `000000100001` |
| 7 | 2 | Unnamed / mathematical 12-TET collection | C F♯ | 6-6 | {0,6} | `000001000001` |
| 8 | 2 | Unnamed / mathematical 12-TET collection | C G | 7-5 | {0,7} | `000010000001` |
| 9 | 2 | Unnamed / mathematical 12-TET collection | C G♯ | 8-4 | {0,8} | `000100000001` |
| 10 | 2 | Unnamed / mathematical 12-TET collection | C A | 9-3 | {0,9} | `001000000001` |
| 11 | 2 | Unnamed / mathematical 12-TET collection | C A♯ | 10-2 | {0,T} | `010000000001` |
| 12 | 2 | Unnamed / mathematical 12-TET collection | C B | 11-1 | {0,E} | `100000000001` |
| 13 | 3 | Unnamed / mathematical 12-TET collection | C C♯ D | 1-1-10 | {0,1,2} | `000000000111` |
| 14 | 3 | Unnamed / mathematical 12-TET collection | C C♯ D♯ | 1-2-9 | {0,1,3} | `000000001011` |
| 15 | 3 | Unnamed / mathematical 12-TET collection | C D D♯ | 2-1-9 | {0,2,3} | `000000001101` |
| 16 | 3 | Unnamed / mathematical 12-TET collection | C C♯ E | 1-3-8 | {0,1,4} | `000000010011` |
| 17 | 3 | Unnamed / mathematical 12-TET collection | C D E | 2-2-8 | {0,2,4} | `000000010101` |
| 18 | 3 | Unnamed / mathematical 12-TET collection | C D♯ E | 3-1-8 | {0,3,4} | `000000011001` |
| 19 | 3 | Unnamed / mathematical 12-TET collection | C C♯ F | 1-4-7 | {0,1,5} | `000000100011` |
| 20 | 3 | Unnamed / mathematical 12-TET collection | C D F | 2-3-7 | {0,2,5} | `000000100101` |
| 21 | 3 | Unnamed / mathematical 12-TET collection | C D♯ F | 3-2-7 | {0,3,5} | `000000101001` |
| 22 | 3 | Unnamed / mathematical 12-TET collection | C E F | 4-1-7 | {0,4,5} | `000000110001` |
| 23 | 3 | Unnamed / mathematical 12-TET collection | C C♯ F♯ | 1-5-6 | {0,1,6} | `000001000011` |
| 24 | 3 | Unnamed / mathematical 12-TET collection | C D F♯ | 2-4-6 | {0,2,6} | `000001000101` |
| 25 | 3 | Unnamed / mathematical 12-TET collection | C D♯ F♯ | 3-3-6 | {0,3,6} | `000001001001` |
| 26 | 3 | Unnamed / mathematical 12-TET collection | C E F♯ | 4-2-6 | {0,4,6} | `000001010001` |
| 27 | 3 | Unnamed / mathematical 12-TET collection | C F F♯ | 5-1-6 | {0,5,6} | `000001100001` |
| 28 | 3 | Unnamed / mathematical 12-TET collection | C C♯ G | 1-6-5 | {0,1,7} | `000010000011` |
| 29 | 3 | Unnamed / mathematical 12-TET collection | C D G | 2-5-5 | {0,2,7} | `000010000101` |
| 30 | 3 | Unnamed / mathematical 12-TET collection | C D♯ G | 3-4-5 | {0,3,7} | `000010001001` |
| 31 | 3 | Unnamed / mathematical 12-TET collection | C E G | 4-3-5 | {0,4,7} | `000010010001` |
| 32 | 3 | Unnamed / mathematical 12-TET collection | C F G | 5-2-5 | {0,5,7} | `000010100001` |
| 33 | 3 | Unnamed / mathematical 12-TET collection | C F♯ G | 6-1-5 | {0,6,7} | `000011000001` |
| 34 | 3 | Unnamed / mathematical 12-TET collection | C C♯ G♯ | 1-7-4 | {0,1,8} | `000100000011` |
| 35 | 3 | Unnamed / mathematical 12-TET collection | C D G♯ | 2-6-4 | {0,2,8} | `000100000101` |
| 36 | 3 | Unnamed / mathematical 12-TET collection | C D♯ G♯ | 3-5-4 | {0,3,8} | `000100001001` |
| 37 | 3 | Unnamed / mathematical 12-TET collection | C E G♯ | 4-4-4 | {0,4,8} | `000100010001` |
| 38 | 3 | Unnamed / mathematical 12-TET collection | C F G♯ | 5-3-4 | {0,5,8} | `000100100001` |
| 39 | 3 | Unnamed / mathematical 12-TET collection | C F♯ G♯ | 6-2-4 | {0,6,8} | `000101000001` |
| 40 | 3 | Unnamed / mathematical 12-TET collection | C G G♯ | 7-1-4 | {0,7,8} | `000110000001` |
| 41 | 3 | Unnamed / mathematical 12-TET collection | C C♯ A | 1-8-3 | {0,1,9} | `001000000011` |
| 42 | 3 | Unnamed / mathematical 12-TET collection | C D A | 2-7-3 | {0,2,9} | `001000000101` |
| 43 | 3 | Unnamed / mathematical 12-TET collection | C D♯ A | 3-6-3 | {0,3,9} | `001000001001` |
| 44 | 3 | Unnamed / mathematical 12-TET collection | C E A | 4-5-3 | {0,4,9} | `001000010001` |
| 45 | 3 | Unnamed / mathematical 12-TET collection | C F A | 5-4-3 | {0,5,9} | `001000100001` |
| 46 | 3 | Unnamed / mathematical 12-TET collection | C F♯ A | 6-3-3 | {0,6,9} | `001001000001` |
| 47 | 3 | Unnamed / mathematical 12-TET collection | C G A | 7-2-3 | {0,7,9} | `001010000001` |
| 48 | 3 | Unnamed / mathematical 12-TET collection | C G♯ A | 8-1-3 | {0,8,9} | `001100000001` |
| 49 | 3 | Unnamed / mathematical 12-TET collection | C C♯ A♯ | 1-9-2 | {0,1,T} | `010000000011` |
| 50 | 3 | Unnamed / mathematical 12-TET collection | C D A♯ | 2-8-2 | {0,2,T} | `010000000101` |
| 51 | 3 | Unnamed / mathematical 12-TET collection | C D♯ A♯ | 3-7-2 | {0,3,T} | `010000001001` |
| 52 | 3 | Unnamed / mathematical 12-TET collection | C E A♯ | 4-6-2 | {0,4,T} | `010000010001` |
| 53 | 3 | Unnamed / mathematical 12-TET collection | C F A♯ | 5-5-2 | {0,5,T} | `010000100001` |
| 54 | 3 | Unnamed / mathematical 12-TET collection | C F♯ A♯ | 6-4-2 | {0,6,T} | `010001000001` |
| 55 | 3 | Unnamed / mathematical 12-TET collection | C G A♯ | 7-3-2 | {0,7,T} | `010010000001` |
| 56 | 3 | Unnamed / mathematical 12-TET collection | C G♯ A♯ | 8-2-2 | {0,8,T} | `010100000001` |
| 57 | 3 | Unnamed / mathematical 12-TET collection | C A A♯ | 9-1-2 | {0,9,T} | `011000000001` |
| 58 | 3 | Unnamed / mathematical 12-TET collection | C C♯ B | 1-10-1 | {0,1,E} | `100000000011` |
| 59 | 3 | Unnamed / mathematical 12-TET collection | C D B | 2-9-1 | {0,2,E} | `100000000101` |
| 60 | 3 | Unnamed / mathematical 12-TET collection | C D♯ B | 3-8-1 | {0,3,E} | `100000001001` |
| 61 | 3 | Unnamed / mathematical 12-TET collection | C E B | 4-7-1 | {0,4,E} | `100000010001` |
| 62 | 3 | Unnamed / mathematical 12-TET collection | C F B | 5-6-1 | {0,5,E} | `100000100001` |
| 63 | 3 | Unnamed / mathematical 12-TET collection | C F♯ B | 6-5-1 | {0,6,E} | `100001000001` |
| 64 | 3 | Unnamed / mathematical 12-TET collection | C G B | 7-4-1 | {0,7,E} | `100010000001` |
| 65 | 3 | Unnamed / mathematical 12-TET collection | C G♯ B | 8-3-1 | {0,8,E} | `100100000001` |
| 66 | 3 | Unnamed / mathematical 12-TET collection | C A B | 9-2-1 | {0,9,E} | `101000000001` |
| 67 | 3 | Unnamed / mathematical 12-TET collection | C A♯ B | 10-1-1 | {0,T,E} | `110000000001` |
| 68 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ | 1-1-1-9 | {0,1,2,3} | `000000001111` |
| 69 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D E | 1-1-2-8 | {0,1,2,4} | `000000010111` |
| 70 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E | 1-2-1-8 | {0,1,3,4} | `000000011011` |
| 71 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ E | 2-1-1-8 | {0,2,3,4} | `000000011101` |
| 72 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D F | 1-1-3-7 | {0,1,2,5} | `000000100111` |
| 73 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F | 1-2-2-7 | {0,1,3,5} | `000000101011` |
| 74 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ F | 2-1-2-7 | {0,2,3,5} | `000000101101` |
| 75 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E F | 1-3-1-7 | {0,1,4,5} | `000000110011` |
| 76 | 4 | Unnamed / mathematical 12-TET collection | C D E F | 2-2-1-7 | {0,2,4,5} | `000000110101` |
| 77 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E F | 3-1-1-7 | {0,3,4,5} | `000000111001` |
| 78 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ | 1-1-4-6 | {0,1,2,6} | `000001000111` |
| 79 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ | 1-2-3-6 | {0,1,3,6} | `000001001011` |
| 80 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ | 2-1-3-6 | {0,2,3,6} | `000001001101` |
| 81 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ | 1-3-2-6 | {0,1,4,6} | `000001010011` |
| 82 | 4 | Unnamed / mathematical 12-TET collection | C D E F♯ | 2-2-2-6 | {0,2,4,6} | `000001010101` |
| 83 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ | 3-1-2-6 | {0,3,4,6} | `000001011001` |
| 84 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ | 1-4-1-6 | {0,1,5,6} | `000001100011` |
| 85 | 4 | Unnamed / mathematical 12-TET collection | C D F F♯ | 2-3-1-6 | {0,2,5,6} | `000001100101` |
| 86 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ | 3-2-1-6 | {0,3,5,6} | `000001101001` |
| 87 | 4 | Unnamed / mathematical 12-TET collection | C E F F♯ | 4-1-1-6 | {0,4,5,6} | `000001110001` |
| 88 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D G | 1-1-5-5 | {0,1,2,7} | `000010000111` |
| 89 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G | 1-2-4-5 | {0,1,3,7} | `000010001011` |
| 90 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ G | 2-1-4-5 | {0,2,3,7} | `000010001101` |
| 91 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E G | 1-3-3-5 | {0,1,4,7} | `000010010011` |
| 92 | 4 | Unnamed / mathematical 12-TET collection | C D E G | 2-2-3-5 | {0,2,4,7} | `000010010101` |
| 93 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E G | 3-1-3-5 | {0,3,4,7} | `000010011001` |
| 94 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F G | 1-4-2-5 | {0,1,5,7} | `000010100011` |
| 95 | 4 | Unnamed / mathematical 12-TET collection | C D F G | 2-3-2-5 | {0,2,5,7} | `000010100101` |
| 96 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F G | 3-2-2-5 | {0,3,5,7} | `000010101001` |
| 97 | 4 | Unnamed / mathematical 12-TET collection | C E F G | 4-1-2-5 | {0,4,5,7} | `000010110001` |
| 98 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G | 1-5-1-5 | {0,1,6,7} | `000011000011` |
| 99 | 4 | Unnamed / mathematical 12-TET collection | C D F♯ G | 2-4-1-5 | {0,2,6,7} | `000011000101` |
| 100 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G | 3-3-1-5 | {0,3,6,7} | `000011001001` |
| 101 | 4 | Unnamed / mathematical 12-TET collection | C E F♯ G | 4-2-1-5 | {0,4,6,7} | `000011010001` |
| 102 | 4 | Unnamed / mathematical 12-TET collection | C F F♯ G | 5-1-1-5 | {0,5,6,7} | `000011100001` |
| 103 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ | 1-1-6-4 | {0,1,2,8} | `000100000111` |
| 104 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ | 1-2-5-4 | {0,1,3,8} | `000100001011` |
| 105 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ | 2-1-5-4 | {0,2,3,8} | `000100001101` |
| 106 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ | 1-3-4-4 | {0,1,4,8} | `000100010011` |
| 107 | 4 | Unnamed / mathematical 12-TET collection | C D E G♯ | 2-2-4-4 | {0,2,4,8} | `000100010101` |
| 108 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ | 3-1-4-4 | {0,3,4,8} | `000100011001` |
| 109 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ | 1-4-3-4 | {0,1,5,8} | `000100100011` |
| 110 | 4 | Unnamed / mathematical 12-TET collection | C D F G♯ | 2-3-3-4 | {0,2,5,8} | `000100100101` |
| 111 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ | 3-2-3-4 | {0,3,5,8} | `000100101001` |
| 112 | 4 | Unnamed / mathematical 12-TET collection | C E F G♯ | 4-1-3-4 | {0,4,5,8} | `000100110001` |
| 113 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ | 1-5-2-4 | {0,1,6,8} | `000101000011` |
| 114 | 4 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ | 2-4-2-4 | {0,2,6,8} | `000101000101` |
| 115 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ | 3-3-2-4 | {0,3,6,8} | `000101001001` |
| 116 | 4 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ | 4-2-2-4 | {0,4,6,8} | `000101010001` |
| 117 | 4 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ | 5-1-2-4 | {0,5,6,8} | `000101100001` |
| 118 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ | 1-6-1-4 | {0,1,7,8} | `000110000011` |
| 119 | 4 | Unnamed / mathematical 12-TET collection | C D G G♯ | 2-5-1-4 | {0,2,7,8} | `000110000101` |
| 120 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ | 3-4-1-4 | {0,3,7,8} | `000110001001` |
| 121 | 4 | Unnamed / mathematical 12-TET collection | C E G G♯ | 4-3-1-4 | {0,4,7,8} | `000110010001` |
| 122 | 4 | Unnamed / mathematical 12-TET collection | C F G G♯ | 5-2-1-4 | {0,5,7,8} | `000110100001` |
| 123 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ | 6-1-1-4 | {0,6,7,8} | `000111000001` |
| 124 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D A | 1-1-7-3 | {0,1,2,9} | `001000000111` |
| 125 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A | 1-2-6-3 | {0,1,3,9} | `001000001011` |
| 126 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ A | 2-1-6-3 | {0,2,3,9} | `001000001101` |
| 127 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E A | 1-3-5-3 | {0,1,4,9} | `001000010011` |
| 128 | 4 | Unnamed / mathematical 12-TET collection | C D E A | 2-2-5-3 | {0,2,4,9} | `001000010101` |
| 129 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E A | 3-1-5-3 | {0,3,4,9} | `001000011001` |
| 130 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F A | 1-4-4-3 | {0,1,5,9} | `001000100011` |
| 131 | 4 | Unnamed / mathematical 12-TET collection | C D F A | 2-3-4-3 | {0,2,5,9} | `001000100101` |
| 132 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F A | 3-2-4-3 | {0,3,5,9} | `001000101001` |
| 133 | 4 | Unnamed / mathematical 12-TET collection | C E F A | 4-1-4-3 | {0,4,5,9} | `001000110001` |
| 134 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A | 1-5-3-3 | {0,1,6,9} | `001001000011` |
| 135 | 4 | Unnamed / mathematical 12-TET collection | C D F♯ A | 2-4-3-3 | {0,2,6,9} | `001001000101` |
| 136 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A | 3-3-3-3 | {0,3,6,9} | `001001001001` |
| 137 | 4 | Unnamed / mathematical 12-TET collection | C E F♯ A | 4-2-3-3 | {0,4,6,9} | `001001010001` |
| 138 | 4 | Unnamed / mathematical 12-TET collection | C F F♯ A | 5-1-3-3 | {0,5,6,9} | `001001100001` |
| 139 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G A | 1-6-2-3 | {0,1,7,9} | `001010000011` |
| 140 | 4 | Unnamed / mathematical 12-TET collection | C D G A | 2-5-2-3 | {0,2,7,9} | `001010000101` |
| 141 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G A | 3-4-2-3 | {0,3,7,9} | `001010001001` |
| 142 | 4 | Unnamed / mathematical 12-TET collection | C E G A | 4-3-2-3 | {0,4,7,9} | `001010010001` |
| 143 | 4 | Unnamed / mathematical 12-TET collection | C F G A | 5-2-2-3 | {0,5,7,9} | `001010100001` |
| 144 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G A | 6-1-2-3 | {0,6,7,9} | `001011000001` |
| 145 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A | 1-7-1-3 | {0,1,8,9} | `001100000011` |
| 146 | 4 | Unnamed / mathematical 12-TET collection | C D G♯ A | 2-6-1-3 | {0,2,8,9} | `001100000101` |
| 147 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A | 3-5-1-3 | {0,3,8,9} | `001100001001` |
| 148 | 4 | Unnamed / mathematical 12-TET collection | C E G♯ A | 4-4-1-3 | {0,4,8,9} | `001100010001` |
| 149 | 4 | Unnamed / mathematical 12-TET collection | C F G♯ A | 5-3-1-3 | {0,5,8,9} | `001100100001` |
| 150 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A | 6-2-1-3 | {0,6,8,9} | `001101000001` |
| 151 | 4 | Unnamed / mathematical 12-TET collection | C G G♯ A | 7-1-1-3 | {0,7,8,9} | `001110000001` |
| 152 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D A♯ | 1-1-8-2 | {0,1,2,T} | `010000000111` |
| 153 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A♯ | 1-2-7-2 | {0,1,3,T} | `010000001011` |
| 154 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ A♯ | 2-1-7-2 | {0,2,3,T} | `010000001101` |
| 155 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E A♯ | 1-3-6-2 | {0,1,4,T} | `010000010011` |
| 156 | 4 | Unnamed / mathematical 12-TET collection | C D E A♯ | 2-2-6-2 | {0,2,4,T} | `010000010101` |
| 157 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E A♯ | 3-1-6-2 | {0,3,4,T} | `010000011001` |
| 158 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F A♯ | 1-4-5-2 | {0,1,5,T} | `010000100011` |
| 159 | 4 | Unnamed / mathematical 12-TET collection | C D F A♯ | 2-3-5-2 | {0,2,5,T} | `010000100101` |
| 160 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F A♯ | 3-2-5-2 | {0,3,5,T} | `010000101001` |
| 161 | 4 | Unnamed / mathematical 12-TET collection | C E F A♯ | 4-1-5-2 | {0,4,5,T} | `010000110001` |
| 162 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A♯ | 1-5-4-2 | {0,1,6,T} | `010001000011` |
| 163 | 4 | Unnamed / mathematical 12-TET collection | C D F♯ A♯ | 2-4-4-2 | {0,2,6,T} | `010001000101` |
| 164 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A♯ | 3-3-4-2 | {0,3,6,T} | `010001001001` |
| 165 | 4 | Unnamed / mathematical 12-TET collection | C E F♯ A♯ | 4-2-4-2 | {0,4,6,T} | `010001010001` |
| 166 | 4 | Unnamed / mathematical 12-TET collection | C F F♯ A♯ | 5-1-4-2 | {0,5,6,T} | `010001100001` |
| 167 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G A♯ | 1-6-3-2 | {0,1,7,T} | `010010000011` |
| 168 | 4 | Unnamed / mathematical 12-TET collection | C D G A♯ | 2-5-3-2 | {0,2,7,T} | `010010000101` |
| 169 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G A♯ | 3-4-3-2 | {0,3,7,T} | `010010001001` |
| 170 | 4 | Unnamed / mathematical 12-TET collection | C E G A♯ | 4-3-3-2 | {0,4,7,T} | `010010010001` |
| 171 | 4 | Unnamed / mathematical 12-TET collection | C F G A♯ | 5-2-3-2 | {0,5,7,T} | `010010100001` |
| 172 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G A♯ | 6-1-3-2 | {0,6,7,T} | `010011000001` |
| 173 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A♯ | 1-7-2-2 | {0,1,8,T} | `010100000011` |
| 174 | 4 | Unnamed / mathematical 12-TET collection | C D G♯ A♯ | 2-6-2-2 | {0,2,8,T} | `010100000101` |
| 175 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A♯ | 3-5-2-2 | {0,3,8,T} | `010100001001` |
| 176 | 4 | Unnamed / mathematical 12-TET collection | C E G♯ A♯ | 4-4-2-2 | {0,4,8,T} | `010100010001` |
| 177 | 4 | Unnamed / mathematical 12-TET collection | C F G♯ A♯ | 5-3-2-2 | {0,5,8,T} | `010100100001` |
| 178 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A♯ | 6-2-2-2 | {0,6,8,T} | `010101000001` |
| 179 | 4 | Unnamed / mathematical 12-TET collection | C G G♯ A♯ | 7-1-2-2 | {0,7,8,T} | `010110000001` |
| 180 | 4 | Unnamed / mathematical 12-TET collection | C C♯ A A♯ | 1-8-1-2 | {0,1,9,T} | `011000000011` |
| 181 | 4 | Unnamed / mathematical 12-TET collection | C D A A♯ | 2-7-1-2 | {0,2,9,T} | `011000000101` |
| 182 | 4 | Unnamed / mathematical 12-TET collection | C D♯ A A♯ | 3-6-1-2 | {0,3,9,T} | `011000001001` |
| 183 | 4 | Unnamed / mathematical 12-TET collection | C E A A♯ | 4-5-1-2 | {0,4,9,T} | `011000010001` |
| 184 | 4 | Unnamed / mathematical 12-TET collection | C F A A♯ | 5-4-1-2 | {0,5,9,T} | `011000100001` |
| 185 | 4 | Unnamed / mathematical 12-TET collection | C F♯ A A♯ | 6-3-1-2 | {0,6,9,T} | `011001000001` |
| 186 | 4 | Unnamed / mathematical 12-TET collection | C G A A♯ | 7-2-1-2 | {0,7,9,T} | `011010000001` |
| 187 | 4 | Unnamed / mathematical 12-TET collection | C G♯ A A♯ | 8-1-1-2 | {0,8,9,T} | `011100000001` |
| 188 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D B | 1-1-9-1 | {0,1,2,E} | `100000000111` |
| 189 | 4 | Unnamed / mathematical 12-TET collection | C C♯ D♯ B | 1-2-8-1 | {0,1,3,E} | `100000001011` |
| 190 | 4 | Unnamed / mathematical 12-TET collection | C D D♯ B | 2-1-8-1 | {0,2,3,E} | `100000001101` |
| 191 | 4 | Unnamed / mathematical 12-TET collection | C C♯ E B | 1-3-7-1 | {0,1,4,E} | `100000010011` |
| 192 | 4 | Unnamed / mathematical 12-TET collection | C D E B | 2-2-7-1 | {0,2,4,E} | `100000010101` |
| 193 | 4 | Unnamed / mathematical 12-TET collection | C D♯ E B | 3-1-7-1 | {0,3,4,E} | `100000011001` |
| 194 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F B | 1-4-6-1 | {0,1,5,E} | `100000100011` |
| 195 | 4 | Unnamed / mathematical 12-TET collection | C D F B | 2-3-6-1 | {0,2,5,E} | `100000100101` |
| 196 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F B | 3-2-6-1 | {0,3,5,E} | `100000101001` |
| 197 | 4 | Unnamed / mathematical 12-TET collection | C E F B | 4-1-6-1 | {0,4,5,E} | `100000110001` |
| 198 | 4 | Unnamed / mathematical 12-TET collection | C C♯ F♯ B | 1-5-5-1 | {0,1,6,E} | `100001000011` |
| 199 | 4 | Unnamed / mathematical 12-TET collection | C D F♯ B | 2-4-5-1 | {0,2,6,E} | `100001000101` |
| 200 | 4 | Unnamed / mathematical 12-TET collection | C D♯ F♯ B | 3-3-5-1 | {0,3,6,E} | `100001001001` |
| 201 | 4 | Unnamed / mathematical 12-TET collection | C E F♯ B | 4-2-5-1 | {0,4,6,E} | `100001010001` |
| 202 | 4 | Unnamed / mathematical 12-TET collection | C F F♯ B | 5-1-5-1 | {0,5,6,E} | `100001100001` |
| 203 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G B | 1-6-4-1 | {0,1,7,E} | `100010000011` |
| 204 | 4 | Unnamed / mathematical 12-TET collection | C D G B | 2-5-4-1 | {0,2,7,E} | `100010000101` |
| 205 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G B | 3-4-4-1 | {0,3,7,E} | `100010001001` |
| 206 | 4 | Unnamed / mathematical 12-TET collection | C E G B | 4-3-4-1 | {0,4,7,E} | `100010010001` |
| 207 | 4 | Unnamed / mathematical 12-TET collection | C F G B | 5-2-4-1 | {0,5,7,E} | `100010100001` |
| 208 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G B | 6-1-4-1 | {0,6,7,E} | `100011000001` |
| 209 | 4 | Unnamed / mathematical 12-TET collection | C C♯ G♯ B | 1-7-3-1 | {0,1,8,E} | `100100000011` |
| 210 | 4 | Unnamed / mathematical 12-TET collection | C D G♯ B | 2-6-3-1 | {0,2,8,E} | `100100000101` |
| 211 | 4 | Unnamed / mathematical 12-TET collection | C D♯ G♯ B | 3-5-3-1 | {0,3,8,E} | `100100001001` |
| 212 | 4 | Unnamed / mathematical 12-TET collection | C E G♯ B | 4-4-3-1 | {0,4,8,E} | `100100010001` |
| 213 | 4 | Unnamed / mathematical 12-TET collection | C F G♯ B | 5-3-3-1 | {0,5,8,E} | `100100100001` |
| 214 | 4 | Unnamed / mathematical 12-TET collection | C F♯ G♯ B | 6-2-3-1 | {0,6,8,E} | `100101000001` |
| 215 | 4 | Unnamed / mathematical 12-TET collection | C G G♯ B | 7-1-3-1 | {0,7,8,E} | `100110000001` |
| 216 | 4 | Unnamed / mathematical 12-TET collection | C C♯ A B | 1-8-2-1 | {0,1,9,E} | `101000000011` |
| 217 | 4 | Unnamed / mathematical 12-TET collection | C D A B | 2-7-2-1 | {0,2,9,E} | `101000000101` |
| 218 | 4 | Unnamed / mathematical 12-TET collection | C D♯ A B | 3-6-2-1 | {0,3,9,E} | `101000001001` |
| 219 | 4 | Unnamed / mathematical 12-TET collection | C E A B | 4-5-2-1 | {0,4,9,E} | `101000010001` |
| 220 | 4 | Unnamed / mathematical 12-TET collection | C F A B | 5-4-2-1 | {0,5,9,E} | `101000100001` |
| 221 | 4 | Unnamed / mathematical 12-TET collection | C F♯ A B | 6-3-2-1 | {0,6,9,E} | `101001000001` |
| 222 | 4 | Unnamed / mathematical 12-TET collection | C G A B | 7-2-2-1 | {0,7,9,E} | `101010000001` |
| 223 | 4 | Unnamed / mathematical 12-TET collection | C G♯ A B | 8-1-2-1 | {0,8,9,E} | `101100000001` |
| 224 | 4 | Unnamed / mathematical 12-TET collection | C C♯ A♯ B | 1-9-1-1 | {0,1,T,E} | `110000000011` |
| 225 | 4 | Unnamed / mathematical 12-TET collection | C D A♯ B | 2-8-1-1 | {0,2,T,E} | `110000000101` |
| 226 | 4 | Unnamed / mathematical 12-TET collection | C D♯ A♯ B | 3-7-1-1 | {0,3,T,E} | `110000001001` |
| 227 | 4 | Unnamed / mathematical 12-TET collection | C E A♯ B | 4-6-1-1 | {0,4,T,E} | `110000010001` |
| 228 | 4 | Unnamed / mathematical 12-TET collection | C F A♯ B | 5-5-1-1 | {0,5,T,E} | `110000100001` |
| 229 | 4 | Unnamed / mathematical 12-TET collection | C F♯ A♯ B | 6-4-1-1 | {0,6,T,E} | `110001000001` |
| 230 | 4 | Unnamed / mathematical 12-TET collection | C G A♯ B | 7-3-1-1 | {0,7,T,E} | `110010000001` |
| 231 | 4 | Unnamed / mathematical 12-TET collection | C G♯ A♯ B | 8-2-1-1 | {0,8,T,E} | `110100000001` |
| 232 | 4 | Unnamed / mathematical 12-TET collection | C A A♯ B | 9-1-1-1 | {0,9,T,E} | `111000000001` |
| 233 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E | 1-1-1-1-8 | {0,1,2,3,4} | `000000011111` |
| 234 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F | 1-1-1-2-7 | {0,1,2,3,5} | `000000101111` |
| 235 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E F | 1-1-2-1-7 | {0,1,2,4,5} | `000000110111` |
| 236 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F | 1-2-1-1-7 | {0,1,3,4,5} | `000000111011` |
| 237 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E F | 2-1-1-1-7 | {0,2,3,4,5} | `000000111101` |
| 238 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ | 1-1-1-3-6 | {0,1,2,3,6} | `000001001111` |
| 239 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ | 1-1-2-2-6 | {0,1,2,4,6} | `000001010111` |
| 240 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ | 1-2-1-2-6 | {0,1,3,4,6} | `000001011011` |
| 241 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ | 2-1-1-2-6 | {0,2,3,4,6} | `000001011101` |
| 242 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ | 1-1-3-1-6 | {0,1,2,5,6} | `000001100111` |
| 243 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ | 1-2-2-1-6 | {0,1,3,5,6} | `000001101011` |
| 244 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ | 2-1-2-1-6 | {0,2,3,5,6} | `000001101101` |
| 245 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ | 1-3-1-1-6 | {0,1,4,5,6} | `000001110011` |
| 246 | 5 | Unnamed / mathematical 12-TET collection | C D E F F♯ | 2-2-1-1-6 | {0,2,4,5,6} | `000001110101` |
| 247 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ | 3-1-1-1-6 | {0,3,4,5,6} | `000001111001` |
| 248 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G | 1-1-1-4-5 | {0,1,2,3,7} | `000010001111` |
| 249 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E G | 1-1-2-3-5 | {0,1,2,4,7} | `000010010111` |
| 250 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G | 1-2-1-3-5 | {0,1,3,4,7} | `000010011011` |
| 251 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E G | 2-1-1-3-5 | {0,2,3,4,7} | `000010011101` |
| 252 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F G | 1-1-3-2-5 | {0,1,2,5,7} | `000010100111` |
| 253 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G | 1-2-2-2-5 | {0,1,3,5,7} | `000010101011` |
| 254 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F G | 2-1-2-2-5 | {0,2,3,5,7} | `000010101101` |
| 255 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F G | 1-3-1-2-5 | {0,1,4,5,7} | `000010110011` |
| 256 | 5 | Unnamed / mathematical 12-TET collection | C D E F G | 2-2-1-2-5 | {0,2,4,5,7} | `000010110101` |
| 257 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F G | 3-1-1-2-5 | {0,3,4,5,7} | `000010111001` |
| 258 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G | 1-1-4-1-5 | {0,1,2,6,7} | `000011000111` |
| 259 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G | 1-2-3-1-5 | {0,1,3,6,7} | `000011001011` |
| 260 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G | 2-1-3-1-5 | {0,2,3,6,7} | `000011001101` |
| 261 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G | 1-3-2-1-5 | {0,1,4,6,7} | `000011010011` |
| 262 | 5 | Unnamed / mathematical 12-TET collection | C D E F♯ G | 2-2-2-1-5 | {0,2,4,6,7} | `000011010101` |
| 263 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G | 3-1-2-1-5 | {0,3,4,6,7} | `000011011001` |
| 264 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G | 1-4-1-1-5 | {0,1,5,6,7} | `000011100011` |
| 265 | 5 | Unnamed / mathematical 12-TET collection | C D F F♯ G | 2-3-1-1-5 | {0,2,5,6,7} | `000011100101` |
| 266 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G | 3-2-1-1-5 | {0,3,5,6,7} | `000011101001` |
| 267 | 5 | Unnamed / mathematical 12-TET collection | C E F F♯ G | 4-1-1-1-5 | {0,4,5,6,7} | `000011110001` |
| 268 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ | 1-1-1-5-4 | {0,1,2,3,8} | `000100001111` |
| 269 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ | 1-1-2-4-4 | {0,1,2,4,8} | `000100010111` |
| 270 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ | 1-2-1-4-4 | {0,1,3,4,8} | `000100011011` |
| 271 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ | 2-1-1-4-4 | {0,2,3,4,8} | `000100011101` |
| 272 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ | 1-1-3-3-4 | {0,1,2,5,8} | `000100100111` |
| 273 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ | 1-2-2-3-4 | {0,1,3,5,8} | `000100101011` |
| 274 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ | 2-1-2-3-4 | {0,2,3,5,8} | `000100101101` |
| 275 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ | 1-3-1-3-4 | {0,1,4,5,8} | `000100110011` |
| 276 | 5 | Unnamed / mathematical 12-TET collection | C D E F G♯ | 2-2-1-3-4 | {0,2,4,5,8} | `000100110101` |
| 277 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ | 3-1-1-3-4 | {0,3,4,5,8} | `000100111001` |
| 278 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ | 1-1-4-2-4 | {0,1,2,6,8} | `000101000111` |
| 279 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ | 1-2-3-2-4 | {0,1,3,6,8} | `000101001011` |
| 280 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ | 2-1-3-2-4 | {0,2,3,6,8} | `000101001101` |
| 281 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ | 1-3-2-2-4 | {0,1,4,6,8} | `000101010011` |
| 282 | 5 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ | 2-2-2-2-4 | {0,2,4,6,8} | `000101010101` |
| 283 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ | 3-1-2-2-4 | {0,3,4,6,8} | `000101011001` |
| 284 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ | 1-4-1-2-4 | {0,1,5,6,8} | `000101100011` |
| 285 | 5 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ | 2-3-1-2-4 | {0,2,5,6,8} | `000101100101` |
| 286 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ | 3-2-1-2-4 | {0,3,5,6,8} | `000101101001` |
| 287 | 5 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ | 4-1-1-2-4 | {0,4,5,6,8} | `000101110001` |
| 288 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ | 1-1-5-1-4 | {0,1,2,7,8} | `000110000111` |
| 289 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ | 1-2-4-1-4 | {0,1,3,7,8} | `000110001011` |
| 290 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ | 2-1-4-1-4 | {0,2,3,7,8} | `000110001101` |
| 291 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ | 1-3-3-1-4 | {0,1,4,7,8} | `000110010011` |
| 292 | 5 | Unnamed / mathematical 12-TET collection | C D E G G♯ | 2-2-3-1-4 | {0,2,4,7,8} | `000110010101` |
| 293 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ | 3-1-3-1-4 | {0,3,4,7,8} | `000110011001` |
| 294 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ | 1-4-2-1-4 | {0,1,5,7,8} | `000110100011` |
| 295 | 5 | Unnamed / mathematical 12-TET collection | C D F G G♯ | 2-3-2-1-4 | {0,2,5,7,8} | `000110100101` |
| 296 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ | 3-2-2-1-4 | {0,3,5,7,8} | `000110101001` |
| 297 | 5 | Unnamed / mathematical 12-TET collection | C E F G G♯ | 4-1-2-1-4 | {0,4,5,7,8} | `000110110001` |
| 298 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ | 1-5-1-1-4 | {0,1,6,7,8} | `000111000011` |
| 299 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ | 2-4-1-1-4 | {0,2,6,7,8} | `000111000101` |
| 300 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ | 3-3-1-1-4 | {0,3,6,7,8} | `000111001001` |
| 301 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ | 4-2-1-1-4 | {0,4,6,7,8} | `000111010001` |
| 302 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ | 5-1-1-1-4 | {0,5,6,7,8} | `000111100001` |
| 303 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A | 1-1-1-6-3 | {0,1,2,3,9} | `001000001111` |
| 304 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E A | 1-1-2-5-3 | {0,1,2,4,9} | `001000010111` |
| 305 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A | 1-2-1-5-3 | {0,1,3,4,9} | `001000011011` |
| 306 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E A | 2-1-1-5-3 | {0,2,3,4,9} | `001000011101` |
| 307 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F A | 1-1-3-4-3 | {0,1,2,5,9} | `001000100111` |
| 308 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A | 1-2-2-4-3 | {0,1,3,5,9} | `001000101011` |
| 309 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F A | 2-1-2-4-3 | {0,2,3,5,9} | `001000101101` |
| 310 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F A | 1-3-1-4-3 | {0,1,4,5,9} | `001000110011` |
| 311 | 5 | Unnamed / mathematical 12-TET collection | C D E F A | 2-2-1-4-3 | {0,2,4,5,9} | `001000110101` |
| 312 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F A | 3-1-1-4-3 | {0,3,4,5,9} | `001000111001` |
| 313 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A | 1-1-4-3-3 | {0,1,2,6,9} | `001001000111` |
| 314 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A | 1-2-3-3-3 | {0,1,3,6,9} | `001001001011` |
| 315 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A | 2-1-3-3-3 | {0,2,3,6,9} | `001001001101` |
| 316 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A | 1-3-2-3-3 | {0,1,4,6,9} | `001001010011` |
| 317 | 5 | Unnamed / mathematical 12-TET collection | C D E F♯ A | 2-2-2-3-3 | {0,2,4,6,9} | `001001010101` |
| 318 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A | 3-1-2-3-3 | {0,3,4,6,9} | `001001011001` |
| 319 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ A | 1-4-1-3-3 | {0,1,5,6,9} | `001001100011` |
| 320 | 5 | Unnamed / mathematical 12-TET collection | C D F F♯ A | 2-3-1-3-3 | {0,2,5,6,9} | `001001100101` |
| 321 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A | 3-2-1-3-3 | {0,3,5,6,9} | `001001101001` |
| 322 | 5 | Unnamed / mathematical 12-TET collection | C E F F♯ A | 4-1-1-3-3 | {0,4,5,6,9} | `001001110001` |
| 323 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G A | 1-1-5-2-3 | {0,1,2,7,9} | `001010000111` |
| 324 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A | 1-2-4-2-3 | {0,1,3,7,9} | `001010001011` |
| 325 | 5 | Hirajoshi / Japanese approximation | C D D♯ G A | 2-1-4-2-3 | {0,2,3,7,9} | `001010001101` |
| 326 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G A | 1-3-3-2-3 | {0,1,4,7,9} | `001010010011` |
| 327 | 5 | Major Pentatonic | C D E G A | 2-2-3-2-3 | {0,2,4,7,9} | `001010010101` |
| 328 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G A | 3-1-3-2-3 | {0,3,4,7,9} | `001010011001` |
| 329 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G A | 1-4-2-2-3 | {0,1,5,7,9} | `001010100011` |
| 330 | 5 | Yo / Ritsu pentatonic | C D F G A | 2-3-2-2-3 | {0,2,5,7,9} | `001010100101` |
| 331 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G A | 3-2-2-2-3 | {0,3,5,7,9} | `001010101001` |
| 332 | 5 | Unnamed / mathematical 12-TET collection | C E F G A | 4-1-2-2-3 | {0,4,5,7,9} | `001010110001` |
| 333 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A | 1-5-1-2-3 | {0,1,6,7,9} | `001011000011` |
| 334 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G A | 2-4-1-2-3 | {0,2,6,7,9} | `001011000101` |
| 335 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A | 3-3-1-2-3 | {0,3,6,7,9} | `001011001001` |
| 336 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G A | 4-2-1-2-3 | {0,4,6,7,9} | `001011010001` |
| 337 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G A | 5-1-1-2-3 | {0,5,6,7,9} | `001011100001` |
| 338 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A | 1-1-6-1-3 | {0,1,2,8,9} | `001100000111` |
| 339 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A | 1-2-5-1-3 | {0,1,3,8,9} | `001100001011` |
| 340 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A | 2-1-5-1-3 | {0,2,3,8,9} | `001100001101` |
| 341 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A | 1-3-4-1-3 | {0,1,4,8,9} | `001100010011` |
| 342 | 5 | Unnamed / mathematical 12-TET collection | C D E G♯ A | 2-2-4-1-3 | {0,2,4,8,9} | `001100010101` |
| 343 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A | 3-1-4-1-3 | {0,3,4,8,9} | `001100011001` |
| 344 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A | 1-4-3-1-3 | {0,1,5,8,9} | `001100100011` |
| 345 | 5 | Unnamed / mathematical 12-TET collection | C D F G♯ A | 2-3-3-1-3 | {0,2,5,8,9} | `001100100101` |
| 346 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A | 3-2-3-1-3 | {0,3,5,8,9} | `001100101001` |
| 347 | 5 | Unnamed / mathematical 12-TET collection | C E F G♯ A | 4-1-3-1-3 | {0,4,5,8,9} | `001100110001` |
| 348 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A | 1-5-2-1-3 | {0,1,6,8,9} | `001101000011` |
| 349 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A | 2-4-2-1-3 | {0,2,6,8,9} | `001101000101` |
| 350 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A | 3-3-2-1-3 | {0,3,6,8,9} | `001101001001` |
| 351 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A | 4-2-2-1-3 | {0,4,6,8,9} | `001101010001` |
| 352 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A | 5-1-2-1-3 | {0,5,6,8,9} | `001101100001` |
| 353 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A | 1-6-1-1-3 | {0,1,7,8,9} | `001110000011` |
| 354 | 5 | Unnamed / mathematical 12-TET collection | C D G G♯ A | 2-5-1-1-3 | {0,2,7,8,9} | `001110000101` |
| 355 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A | 3-4-1-1-3 | {0,3,7,8,9} | `001110001001` |
| 356 | 5 | Unnamed / mathematical 12-TET collection | C E G G♯ A | 4-3-1-1-3 | {0,4,7,8,9} | `001110010001` |
| 357 | 5 | Unnamed / mathematical 12-TET collection | C F G G♯ A | 5-2-1-1-3 | {0,5,7,8,9} | `001110100001` |
| 358 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A | 6-1-1-1-3 | {0,6,7,8,9} | `001111000001` |
| 359 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A♯ | 1-1-1-7-2 | {0,1,2,3,T} | `010000001111` |
| 360 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E A♯ | 1-1-2-6-2 | {0,1,2,4,T} | `010000010111` |
| 361 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A♯ | 1-2-1-6-2 | {0,1,3,4,T} | `010000011011` |
| 362 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E A♯ | 2-1-1-6-2 | {0,2,3,4,T} | `010000011101` |
| 363 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F A♯ | 1-1-3-5-2 | {0,1,2,5,T} | `010000100111` |
| 364 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A♯ | 1-2-2-5-2 | {0,1,3,5,T} | `010000101011` |
| 365 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F A♯ | 2-1-2-5-2 | {0,2,3,5,T} | `010000101101` |
| 366 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F A♯ | 1-3-1-5-2 | {0,1,4,5,T} | `010000110011` |
| 367 | 5 | Unnamed / mathematical 12-TET collection | C D E F A♯ | 2-2-1-5-2 | {0,2,4,5,T} | `010000110101` |
| 368 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F A♯ | 3-1-1-5-2 | {0,3,4,5,T} | `010000111001` |
| 369 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A♯ | 1-1-4-4-2 | {0,1,2,6,T} | `010001000111` |
| 370 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A♯ | 1-2-3-4-2 | {0,1,3,6,T} | `010001001011` |
| 371 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A♯ | 2-1-3-4-2 | {0,2,3,6,T} | `010001001101` |
| 372 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A♯ | 1-3-2-4-2 | {0,1,4,6,T} | `010001010011` |
| 373 | 5 | Unnamed / mathematical 12-TET collection | C D E F♯ A♯ | 2-2-2-4-2 | {0,2,4,6,T} | `010001010101` |
| 374 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A♯ | 3-1-2-4-2 | {0,3,4,6,T} | `010001011001` |
| 375 | 5 | Iwato | C C♯ F F♯ A♯ | 1-4-1-4-2 | {0,1,5,6,T} | `010001100011` |
| 376 | 5 | Unnamed / mathematical 12-TET collection | C D F F♯ A♯ | 2-3-1-4-2 | {0,2,5,6,T} | `010001100101` |
| 377 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A♯ | 3-2-1-4-2 | {0,3,5,6,T} | `010001101001` |
| 378 | 5 | Unnamed / mathematical 12-TET collection | C E F F♯ A♯ | 4-1-1-4-2 | {0,4,5,6,T} | `010001110001` |
| 379 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G A♯ | 1-1-5-3-2 | {0,1,2,7,T} | `010010000111` |
| 380 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A♯ | 1-2-4-3-2 | {0,1,3,7,T} | `010010001011` |
| 381 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G A♯ | 2-1-4-3-2 | {0,2,3,7,T} | `010010001101` |
| 382 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G A♯ | 1-3-3-3-2 | {0,1,4,7,T} | `010010010011` |
| 383 | 5 | Unnamed / mathematical 12-TET collection | C D E G A♯ | 2-2-3-3-2 | {0,2,4,7,T} | `010010010101` |
| 384 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G A♯ | 3-1-3-3-2 | {0,3,4,7,T} | `010010011001` |
| 385 | 5 | In-sen / Japanese approximation | C C♯ F G A♯ | 1-4-2-3-2 | {0,1,5,7,T} | `010010100011` |
| 386 | 5 | Suspended Pentatonic / Egyptian | C D F G A♯ | 2-3-2-3-2 | {0,2,5,7,T} | `010010100101` |
| 387 | 5 | Minor Pentatonic / Blues-derived | C D♯ F G A♯ | 3-2-2-3-2 | {0,3,5,7,T} | `010010101001` |
| 388 | 5 | Unnamed / mathematical 12-TET collection | C E F G A♯ | 4-1-2-3-2 | {0,4,5,7,T} | `010010110001` |
| 389 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A♯ | 1-5-1-3-2 | {0,1,6,7,T} | `010011000011` |
| 390 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G A♯ | 2-4-1-3-2 | {0,2,6,7,T} | `010011000101` |
| 391 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A♯ | 3-3-1-3-2 | {0,3,6,7,T} | `010011001001` |
| 392 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G A♯ | 4-2-1-3-2 | {0,4,6,7,T} | `010011010001` |
| 393 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G A♯ | 5-1-1-3-2 | {0,5,6,7,T} | `010011100001` |
| 394 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A♯ | 1-1-6-2-2 | {0,1,2,8,T} | `010100000111` |
| 395 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A♯ | 1-2-5-2-2 | {0,1,3,8,T} | `010100001011` |
| 396 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A♯ | 2-1-5-2-2 | {0,2,3,8,T} | `010100001101` |
| 397 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A♯ | 1-3-4-2-2 | {0,1,4,8,T} | `010100010011` |
| 398 | 5 | Unnamed / mathematical 12-TET collection | C D E G♯ A♯ | 2-2-4-2-2 | {0,2,4,8,T} | `010100010101` |
| 399 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A♯ | 3-1-4-2-2 | {0,3,4,8,T} | `010100011001` |
| 400 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A♯ | 1-4-3-2-2 | {0,1,5,8,T} | `010100100011` |
| 401 | 5 | Unnamed / mathematical 12-TET collection | C D F G♯ A♯ | 2-3-3-2-2 | {0,2,5,8,T} | `010100100101` |
| 402 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A♯ | 3-2-3-2-2 | {0,3,5,8,T} | `010100101001` |
| 403 | 5 | Unnamed / mathematical 12-TET collection | C E F G♯ A♯ | 4-1-3-2-2 | {0,4,5,8,T} | `010100110001` |
| 404 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A♯ | 1-5-2-2-2 | {0,1,6,8,T} | `010101000011` |
| 405 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A♯ | 2-4-2-2-2 | {0,2,6,8,T} | `010101000101` |
| 406 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A♯ | 3-3-2-2-2 | {0,3,6,8,T} | `010101001001` |
| 407 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A♯ | 4-2-2-2-2 | {0,4,6,8,T} | `010101010001` |
| 408 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A♯ | 5-1-2-2-2 | {0,5,6,8,T} | `010101100001` |
| 409 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A♯ | 1-6-1-2-2 | {0,1,7,8,T} | `010110000011` |
| 410 | 5 | Unnamed / mathematical 12-TET collection | C D G G♯ A♯ | 2-5-1-2-2 | {0,2,7,8,T} | `010110000101` |
| 411 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A♯ | 3-4-1-2-2 | {0,3,7,8,T} | `010110001001` |
| 412 | 5 | Unnamed / mathematical 12-TET collection | C E G G♯ A♯ | 4-3-1-2-2 | {0,4,7,8,T} | `010110010001` |
| 413 | 5 | Unnamed / mathematical 12-TET collection | C F G G♯ A♯ | 5-2-1-2-2 | {0,5,7,8,T} | `010110100001` |
| 414 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A♯ | 6-1-1-2-2 | {0,6,7,8,T} | `010111000001` |
| 415 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D A A♯ | 1-1-7-1-2 | {0,1,2,9,T} | `011000000111` |
| 416 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A A♯ | 1-2-6-1-2 | {0,1,3,9,T} | `011000001011` |
| 417 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ A A♯ | 2-1-6-1-2 | {0,2,3,9,T} | `011000001101` |
| 418 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E A A♯ | 1-3-5-1-2 | {0,1,4,9,T} | `011000010011` |
| 419 | 5 | Unnamed / mathematical 12-TET collection | C D E A A♯ | 2-2-5-1-2 | {0,2,4,9,T} | `011000010101` |
| 420 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E A A♯ | 3-1-5-1-2 | {0,3,4,9,T} | `011000011001` |
| 421 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F A A♯ | 1-4-4-1-2 | {0,1,5,9,T} | `011000100011` |
| 422 | 5 | Unnamed / mathematical 12-TET collection | C D F A A♯ | 2-3-4-1-2 | {0,2,5,9,T} | `011000100101` |
| 423 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F A A♯ | 3-2-4-1-2 | {0,3,5,9,T} | `011000101001` |
| 424 | 5 | Unnamed / mathematical 12-TET collection | C E F A A♯ | 4-1-4-1-2 | {0,4,5,9,T} | `011000110001` |
| 425 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A A♯ | 1-5-3-1-2 | {0,1,6,9,T} | `011001000011` |
| 426 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ A A♯ | 2-4-3-1-2 | {0,2,6,9,T} | `011001000101` |
| 427 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A A♯ | 3-3-3-1-2 | {0,3,6,9,T} | `011001001001` |
| 428 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ A A♯ | 4-2-3-1-2 | {0,4,6,9,T} | `011001010001` |
| 429 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ A A♯ | 5-1-3-1-2 | {0,5,6,9,T} | `011001100001` |
| 430 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G A A♯ | 1-6-2-1-2 | {0,1,7,9,T} | `011010000011` |
| 431 | 5 | Unnamed / mathematical 12-TET collection | C D G A A♯ | 2-5-2-1-2 | {0,2,7,9,T} | `011010000101` |
| 432 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G A A♯ | 3-4-2-1-2 | {0,3,7,9,T} | `011010001001` |
| 433 | 5 | Unnamed / mathematical 12-TET collection | C E G A A♯ | 4-3-2-1-2 | {0,4,7,9,T} | `011010010001` |
| 434 | 5 | Unnamed / mathematical 12-TET collection | C F G A A♯ | 5-2-2-1-2 | {0,5,7,9,T} | `011010100001` |
| 435 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G A A♯ | 6-1-2-1-2 | {0,6,7,9,T} | `011011000001` |
| 436 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A A♯ | 1-7-1-1-2 | {0,1,8,9,T} | `011100000011` |
| 437 | 5 | Unnamed / mathematical 12-TET collection | C D G♯ A A♯ | 2-6-1-1-2 | {0,2,8,9,T} | `011100000101` |
| 438 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A A♯ | 3-5-1-1-2 | {0,3,8,9,T} | `011100001001` |
| 439 | 5 | Unnamed / mathematical 12-TET collection | C E G♯ A A♯ | 4-4-1-1-2 | {0,4,8,9,T} | `011100010001` |
| 440 | 5 | Unnamed / mathematical 12-TET collection | C F G♯ A A♯ | 5-3-1-1-2 | {0,5,8,9,T} | `011100100001` |
| 441 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A A♯ | 6-2-1-1-2 | {0,6,8,9,T} | `011101000001` |
| 442 | 5 | Unnamed / mathematical 12-TET collection | C G G♯ A A♯ | 7-1-1-1-2 | {0,7,8,9,T} | `011110000001` |
| 443 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ B | 1-1-1-8-1 | {0,1,2,3,E} | `100000001111` |
| 444 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D E B | 1-1-2-7-1 | {0,1,2,4,E} | `100000010111` |
| 445 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E B | 1-2-1-7-1 | {0,1,3,4,E} | `100000011011` |
| 446 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ E B | 2-1-1-7-1 | {0,2,3,4,E} | `100000011101` |
| 447 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F B | 1-1-3-6-1 | {0,1,2,5,E} | `100000100111` |
| 448 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F B | 1-2-2-6-1 | {0,1,3,5,E} | `100000101011` |
| 449 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F B | 2-1-2-6-1 | {0,2,3,5,E} | `100000101101` |
| 450 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F B | 1-3-1-6-1 | {0,1,4,5,E} | `100000110011` |
| 451 | 5 | Unnamed / mathematical 12-TET collection | C D E F B | 2-2-1-6-1 | {0,2,4,5,E} | `100000110101` |
| 452 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F B | 3-1-1-6-1 | {0,3,4,5,E} | `100000111001` |
| 453 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ B | 1-1-4-5-1 | {0,1,2,6,E} | `100001000111` |
| 454 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ B | 1-2-3-5-1 | {0,1,3,6,E} | `100001001011` |
| 455 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ B | 2-1-3-5-1 | {0,2,3,6,E} | `100001001101` |
| 456 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ B | 1-3-2-5-1 | {0,1,4,6,E} | `100001010011` |
| 457 | 5 | Unnamed / mathematical 12-TET collection | C D E F♯ B | 2-2-2-5-1 | {0,2,4,6,E} | `100001010101` |
| 458 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ B | 3-1-2-5-1 | {0,3,4,6,E} | `100001011001` |
| 459 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ B | 1-4-1-5-1 | {0,1,5,6,E} | `100001100011` |
| 460 | 5 | Unnamed / mathematical 12-TET collection | C D F F♯ B | 2-3-1-5-1 | {0,2,5,6,E} | `100001100101` |
| 461 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ B | 3-2-1-5-1 | {0,3,5,6,E} | `100001101001` |
| 462 | 5 | Unnamed / mathematical 12-TET collection | C E F F♯ B | 4-1-1-5-1 | {0,4,5,6,E} | `100001110001` |
| 463 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G B | 1-1-5-4-1 | {0,1,2,7,E} | `100010000111` |
| 464 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G B | 1-2-4-4-1 | {0,1,3,7,E} | `100010001011` |
| 465 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G B | 2-1-4-4-1 | {0,2,3,7,E} | `100010001101` |
| 466 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G B | 1-3-3-4-1 | {0,1,4,7,E} | `100010010011` |
| 467 | 5 | Dominant Pentatonic | C D E G B | 2-2-3-4-1 | {0,2,4,7,E} | `100010010101` |
| 468 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G B | 3-1-3-4-1 | {0,3,4,7,E} | `100010011001` |
| 469 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G B | 1-4-2-4-1 | {0,1,5,7,E} | `100010100011` |
| 470 | 5 | Unnamed / mathematical 12-TET collection | C D F G B | 2-3-2-4-1 | {0,2,5,7,E} | `100010100101` |
| 471 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G B | 3-2-2-4-1 | {0,3,5,7,E} | `100010101001` |
| 472 | 5 | Unnamed / mathematical 12-TET collection | C E F G B | 4-1-2-4-1 | {0,4,5,7,E} | `100010110001` |
| 473 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G B | 1-5-1-4-1 | {0,1,6,7,E} | `100011000011` |
| 474 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G B | 2-4-1-4-1 | {0,2,6,7,E} | `100011000101` |
| 475 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G B | 3-3-1-4-1 | {0,3,6,7,E} | `100011001001` |
| 476 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G B | 4-2-1-4-1 | {0,4,6,7,E} | `100011010001` |
| 477 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G B | 5-1-1-4-1 | {0,5,6,7,E} | `100011100001` |
| 478 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ B | 1-1-6-3-1 | {0,1,2,8,E} | `100100000111` |
| 479 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ B | 1-2-5-3-1 | {0,1,3,8,E} | `100100001011` |
| 480 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ B | 2-1-5-3-1 | {0,2,3,8,E} | `100100001101` |
| 481 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ B | 1-3-4-3-1 | {0,1,4,8,E} | `100100010011` |
| 482 | 5 | Unnamed / mathematical 12-TET collection | C D E G♯ B | 2-2-4-3-1 | {0,2,4,8,E} | `100100010101` |
| 483 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ B | 3-1-4-3-1 | {0,3,4,8,E} | `100100011001` |
| 484 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ B | 1-4-3-3-1 | {0,1,5,8,E} | `100100100011` |
| 485 | 5 | Unnamed / mathematical 12-TET collection | C D F G♯ B | 2-3-3-3-1 | {0,2,5,8,E} | `100100100101` |
| 486 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ B | 3-2-3-3-1 | {0,3,5,8,E} | `100100101001` |
| 487 | 5 | Unnamed / mathematical 12-TET collection | C E F G♯ B | 4-1-3-3-1 | {0,4,5,8,E} | `100100110001` |
| 488 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ B | 1-5-2-3-1 | {0,1,6,8,E} | `100101000011` |
| 489 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ B | 2-4-2-3-1 | {0,2,6,8,E} | `100101000101` |
| 490 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ B | 3-3-2-3-1 | {0,3,6,8,E} | `100101001001` |
| 491 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ B | 4-2-2-3-1 | {0,4,6,8,E} | `100101010001` |
| 492 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ B | 5-1-2-3-1 | {0,5,6,8,E} | `100101100001` |
| 493 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ B | 1-6-1-3-1 | {0,1,7,8,E} | `100110000011` |
| 494 | 5 | Unnamed / mathematical 12-TET collection | C D G G♯ B | 2-5-1-3-1 | {0,2,7,8,E} | `100110000101` |
| 495 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ B | 3-4-1-3-1 | {0,3,7,8,E} | `100110001001` |
| 496 | 5 | Unnamed / mathematical 12-TET collection | C E G G♯ B | 4-3-1-3-1 | {0,4,7,8,E} | `100110010001` |
| 497 | 5 | Unnamed / mathematical 12-TET collection | C F G G♯ B | 5-2-1-3-1 | {0,5,7,8,E} | `100110100001` |
| 498 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ B | 6-1-1-3-1 | {0,6,7,8,E} | `100111000001` |
| 499 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D A B | 1-1-7-2-1 | {0,1,2,9,E} | `101000000111` |
| 500 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A B | 1-2-6-2-1 | {0,1,3,9,E} | `101000001011` |
| 501 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ A B | 2-1-6-2-1 | {0,2,3,9,E} | `101000001101` |
| 502 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E A B | 1-3-5-2-1 | {0,1,4,9,E} | `101000010011` |
| 503 | 5 | Unnamed / mathematical 12-TET collection | C D E A B | 2-2-5-2-1 | {0,2,4,9,E} | `101000010101` |
| 504 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E A B | 3-1-5-2-1 | {0,3,4,9,E} | `101000011001` |
| 505 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F A B | 1-4-4-2-1 | {0,1,5,9,E} | `101000100011` |
| 506 | 5 | Unnamed / mathematical 12-TET collection | C D F A B | 2-3-4-2-1 | {0,2,5,9,E} | `101000100101` |
| 507 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F A B | 3-2-4-2-1 | {0,3,5,9,E} | `101000101001` |
| 508 | 5 | Unnamed / mathematical 12-TET collection | C E F A B | 4-1-4-2-1 | {0,4,5,9,E} | `101000110001` |
| 509 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A B | 1-5-3-2-1 | {0,1,6,9,E} | `101001000011` |
| 510 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ A B | 2-4-3-2-1 | {0,2,6,9,E} | `101001000101` |
| 511 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A B | 3-3-3-2-1 | {0,3,6,9,E} | `101001001001` |
| 512 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ A B | 4-2-3-2-1 | {0,4,6,9,E} | `101001010001` |
| 513 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ A B | 5-1-3-2-1 | {0,5,6,9,E} | `101001100001` |
| 514 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G A B | 1-6-2-2-1 | {0,1,7,9,E} | `101010000011` |
| 515 | 5 | Unnamed / mathematical 12-TET collection | C D G A B | 2-5-2-2-1 | {0,2,7,9,E} | `101010000101` |
| 516 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G A B | 3-4-2-2-1 | {0,3,7,9,E} | `101010001001` |
| 517 | 5 | Unnamed / mathematical 12-TET collection | C E G A B | 4-3-2-2-1 | {0,4,7,9,E} | `101010010001` |
| 518 | 5 | Unnamed / mathematical 12-TET collection | C F G A B | 5-2-2-2-1 | {0,5,7,9,E} | `101010100001` |
| 519 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G A B | 6-1-2-2-1 | {0,6,7,9,E} | `101011000001` |
| 520 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A B | 1-7-1-2-1 | {0,1,8,9,E} | `101100000011` |
| 521 | 5 | Unnamed / mathematical 12-TET collection | C D G♯ A B | 2-6-1-2-1 | {0,2,8,9,E} | `101100000101` |
| 522 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A B | 3-5-1-2-1 | {0,3,8,9,E} | `101100001001` |
| 523 | 5 | Unnamed / mathematical 12-TET collection | C E G♯ A B | 4-4-1-2-1 | {0,4,8,9,E} | `101100010001` |
| 524 | 5 | Unnamed / mathematical 12-TET collection | C F G♯ A B | 5-3-1-2-1 | {0,5,8,9,E} | `101100100001` |
| 525 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A B | 6-2-1-2-1 | {0,6,8,9,E} | `101101000001` |
| 526 | 5 | Unnamed / mathematical 12-TET collection | C G G♯ A B | 7-1-1-2-1 | {0,7,8,9,E} | `101110000001` |
| 527 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D A♯ B | 1-1-8-1-1 | {0,1,2,T,E} | `110000000111` |
| 528 | 5 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A♯ B | 1-2-7-1-1 | {0,1,3,T,E} | `110000001011` |
| 529 | 5 | Unnamed / mathematical 12-TET collection | C D D♯ A♯ B | 2-1-7-1-1 | {0,2,3,T,E} | `110000001101` |
| 530 | 5 | Unnamed / mathematical 12-TET collection | C C♯ E A♯ B | 1-3-6-1-1 | {0,1,4,T,E} | `110000010011` |
| 531 | 5 | Unnamed / mathematical 12-TET collection | C D E A♯ B | 2-2-6-1-1 | {0,2,4,T,E} | `110000010101` |
| 532 | 5 | Unnamed / mathematical 12-TET collection | C D♯ E A♯ B | 3-1-6-1-1 | {0,3,4,T,E} | `110000011001` |
| 533 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F A♯ B | 1-4-5-1-1 | {0,1,5,T,E} | `110000100011` |
| 534 | 5 | Unnamed / mathematical 12-TET collection | C D F A♯ B | 2-3-5-1-1 | {0,2,5,T,E} | `110000100101` |
| 535 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F A♯ B | 3-2-5-1-1 | {0,3,5,T,E} | `110000101001` |
| 536 | 5 | Unnamed / mathematical 12-TET collection | C E F A♯ B | 4-1-5-1-1 | {0,4,5,T,E} | `110000110001` |
| 537 | 5 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A♯ B | 1-5-4-1-1 | {0,1,6,T,E} | `110001000011` |
| 538 | 5 | Unnamed / mathematical 12-TET collection | C D F♯ A♯ B | 2-4-4-1-1 | {0,2,6,T,E} | `110001000101` |
| 539 | 5 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A♯ B | 3-3-4-1-1 | {0,3,6,T,E} | `110001001001` |
| 540 | 5 | Unnamed / mathematical 12-TET collection | C E F♯ A♯ B | 4-2-4-1-1 | {0,4,6,T,E} | `110001010001` |
| 541 | 5 | Unnamed / mathematical 12-TET collection | C F F♯ A♯ B | 5-1-4-1-1 | {0,5,6,T,E} | `110001100001` |
| 542 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G A♯ B | 1-6-3-1-1 | {0,1,7,T,E} | `110010000011` |
| 543 | 5 | Unnamed / mathematical 12-TET collection | C D G A♯ B | 2-5-3-1-1 | {0,2,7,T,E} | `110010000101` |
| 544 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G A♯ B | 3-4-3-1-1 | {0,3,7,T,E} | `110010001001` |
| 545 | 5 | Unnamed / mathematical 12-TET collection | C E G A♯ B | 4-3-3-1-1 | {0,4,7,T,E} | `110010010001` |
| 546 | 5 | Unnamed / mathematical 12-TET collection | C F G A♯ B | 5-2-3-1-1 | {0,5,7,T,E} | `110010100001` |
| 547 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G A♯ B | 6-1-3-1-1 | {0,6,7,T,E} | `110011000001` |
| 548 | 5 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A♯ B | 1-7-2-1-1 | {0,1,8,T,E} | `110100000011` |
| 549 | 5 | Unnamed / mathematical 12-TET collection | C D G♯ A♯ B | 2-6-2-1-1 | {0,2,8,T,E} | `110100000101` |
| 550 | 5 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A♯ B | 3-5-2-1-1 | {0,3,8,T,E} | `110100001001` |
| 551 | 5 | Unnamed / mathematical 12-TET collection | C E G♯ A♯ B | 4-4-2-1-1 | {0,4,8,T,E} | `110100010001` |
| 552 | 5 | Unnamed / mathematical 12-TET collection | C F G♯ A♯ B | 5-3-2-1-1 | {0,5,8,T,E} | `110100100001` |
| 553 | 5 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A♯ B | 6-2-2-1-1 | {0,6,8,T,E} | `110101000001` |
| 554 | 5 | Unnamed / mathematical 12-TET collection | C G G♯ A♯ B | 7-1-2-1-1 | {0,7,8,T,E} | `110110000001` |
| 555 | 5 | Unnamed / mathematical 12-TET collection | C C♯ A A♯ B | 1-8-1-1-1 | {0,1,9,T,E} | `111000000011` |
| 556 | 5 | Unnamed / mathematical 12-TET collection | C D A A♯ B | 2-7-1-1-1 | {0,2,9,T,E} | `111000000101` |
| 557 | 5 | Unnamed / mathematical 12-TET collection | C D♯ A A♯ B | 3-6-1-1-1 | {0,3,9,T,E} | `111000001001` |
| 558 | 5 | Unnamed / mathematical 12-TET collection | C E A A♯ B | 4-5-1-1-1 | {0,4,9,T,E} | `111000010001` |
| 559 | 5 | Unnamed / mathematical 12-TET collection | C F A A♯ B | 5-4-1-1-1 | {0,5,9,T,E} | `111000100001` |
| 560 | 5 | Unnamed / mathematical 12-TET collection | C F♯ A A♯ B | 6-3-1-1-1 | {0,6,9,T,E} | `111001000001` |
| 561 | 5 | Unnamed / mathematical 12-TET collection | C G A A♯ B | 7-2-1-1-1 | {0,7,9,T,E} | `111010000001` |
| 562 | 5 | Unnamed / mathematical 12-TET collection | C G♯ A A♯ B | 8-1-1-1-1 | {0,8,9,T,E} | `111100000001` |
| 563 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F | 1-1-1-1-1-7 | {0,1,2,3,4,5} | `000000111111` |
| 564 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ | 1-1-1-1-2-6 | {0,1,2,3,4,6} | `000001011111` |
| 565 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ | 1-1-1-2-1-6 | {0,1,2,3,5,6} | `000001101111` |
| 566 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ | 1-1-2-1-1-6 | {0,1,2,4,5,6} | `000001110111` |
| 567 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ | 1-2-1-1-1-6 | {0,1,3,4,5,6} | `000001111011` |
| 568 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ | 2-1-1-1-1-6 | {0,2,3,4,5,6} | `000001111101` |
| 569 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G | 1-1-1-1-3-5 | {0,1,2,3,4,7} | `000010011111` |
| 570 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G | 1-1-1-2-2-5 | {0,1,2,3,5,7} | `000010101111` |
| 571 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F G | 1-1-2-1-2-5 | {0,1,2,4,5,7} | `000010110111` |
| 572 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G | 1-2-1-1-2-5 | {0,1,3,4,5,7} | `000010111011` |
| 573 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F G | 2-1-1-1-2-5 | {0,2,3,4,5,7} | `000010111101` |
| 574 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G | 1-1-1-3-1-5 | {0,1,2,3,6,7} | `000011001111` |
| 575 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G | 1-1-2-2-1-5 | {0,1,2,4,6,7} | `000011010111` |
| 576 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G | 1-2-1-2-1-5 | {0,1,3,4,6,7} | `000011011011` |
| 577 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G | 2-1-1-2-1-5 | {0,2,3,4,6,7} | `000011011101` |
| 578 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G | 1-1-3-1-1-5 | {0,1,2,5,6,7} | `000011100111` |
| 579 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G | 1-2-2-1-1-5 | {0,1,3,5,6,7} | `000011101011` |
| 580 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G | 2-1-2-1-1-5 | {0,2,3,5,6,7} | `000011101101` |
| 581 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G | 1-3-1-1-1-5 | {0,1,4,5,6,7} | `000011110011` |
| 582 | 6 | Unnamed / mathematical 12-TET collection | C D E F F♯ G | 2-2-1-1-1-5 | {0,2,4,5,6,7} | `000011110101` |
| 583 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G | 3-1-1-1-1-5 | {0,3,4,5,6,7} | `000011111001` |
| 584 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ | 1-1-1-1-4-4 | {0,1,2,3,4,8} | `000100011111` |
| 585 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ | 1-1-1-2-3-4 | {0,1,2,3,5,8} | `000100101111` |
| 586 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ | 1-1-2-1-3-4 | {0,1,2,4,5,8} | `000100110111` |
| 587 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ | 1-2-1-1-3-4 | {0,1,3,4,5,8} | `000100111011` |
| 588 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ | 2-1-1-1-3-4 | {0,2,3,4,5,8} | `000100111101` |
| 589 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ | 1-1-1-3-2-4 | {0,1,2,3,6,8} | `000101001111` |
| 590 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ | 1-1-2-2-2-4 | {0,1,2,4,6,8} | `000101010111` |
| 591 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ | 1-2-1-2-2-4 | {0,1,3,4,6,8} | `000101011011` |
| 592 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ | 2-1-1-2-2-4 | {0,2,3,4,6,8} | `000101011101` |
| 593 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ | 1-1-3-1-2-4 | {0,1,2,5,6,8} | `000101100111` |
| 594 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ | 1-2-2-1-2-4 | {0,1,3,5,6,8} | `000101101011` |
| 595 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ | 2-1-2-1-2-4 | {0,2,3,5,6,8} | `000101101101` |
| 596 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ | 1-3-1-1-2-4 | {0,1,4,5,6,8} | `000101110011` |
| 597 | 6 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ | 2-2-1-1-2-4 | {0,2,4,5,6,8} | `000101110101` |
| 598 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ | 3-1-1-1-2-4 | {0,3,4,5,6,8} | `000101111001` |
| 599 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ | 1-1-1-4-1-4 | {0,1,2,3,7,8} | `000110001111` |
| 600 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ | 1-1-2-3-1-4 | {0,1,2,4,7,8} | `000110010111` |
| 601 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ | 1-2-1-3-1-4 | {0,1,3,4,7,8} | `000110011011` |
| 602 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ | 2-1-1-3-1-4 | {0,2,3,4,7,8} | `000110011101` |
| 603 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ | 1-1-3-2-1-4 | {0,1,2,5,7,8} | `000110100111` |
| 604 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ | 1-2-2-2-1-4 | {0,1,3,5,7,8} | `000110101011` |
| 605 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G G♯ | 2-1-2-2-1-4 | {0,2,3,5,7,8} | `000110101101` |
| 606 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ | 1-3-1-2-1-4 | {0,1,4,5,7,8} | `000110110011` |
| 607 | 6 | Unnamed / mathematical 12-TET collection | C D E F G G♯ | 2-2-1-2-1-4 | {0,2,4,5,7,8} | `000110110101` |
| 608 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ | 3-1-1-2-1-4 | {0,3,4,5,7,8} | `000110111001` |
| 609 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ | 1-1-4-1-1-4 | {0,1,2,6,7,8} | `000111000111` |
| 610 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ | 1-2-3-1-1-4 | {0,1,3,6,7,8} | `000111001011` |
| 611 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ | 2-1-3-1-1-4 | {0,2,3,6,7,8} | `000111001101` |
| 612 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ | 1-3-2-1-1-4 | {0,1,4,6,7,8} | `000111010011` |
| 613 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ | 2-2-2-1-1-4 | {0,2,4,6,7,8} | `000111010101` |
| 614 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ | 3-1-2-1-1-4 | {0,3,4,6,7,8} | `000111011001` |
| 615 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ | 1-4-1-1-1-4 | {0,1,5,6,7,8} | `000111100011` |
| 616 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ | 2-3-1-1-1-4 | {0,2,5,6,7,8} | `000111100101` |
| 617 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ | 3-2-1-1-1-4 | {0,3,5,6,7,8} | `000111101001` |
| 618 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ | 4-1-1-1-1-4 | {0,4,5,6,7,8} | `000111110001` |
| 619 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A | 1-1-1-1-5-3 | {0,1,2,3,4,9} | `001000011111` |
| 620 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A | 1-1-1-2-4-3 | {0,1,2,3,5,9} | `001000101111` |
| 621 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F A | 1-1-2-1-4-3 | {0,1,2,4,5,9} | `001000110111` |
| 622 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A | 1-2-1-1-4-3 | {0,1,3,4,5,9} | `001000111011` |
| 623 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F A | 2-1-1-1-4-3 | {0,2,3,4,5,9} | `001000111101` |
| 624 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A | 1-1-1-3-3-3 | {0,1,2,3,6,9} | `001001001111` |
| 625 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A | 1-1-2-2-3-3 | {0,1,2,4,6,9} | `001001010111` |
| 626 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A | 1-2-1-2-3-3 | {0,1,3,4,6,9} | `001001011011` |
| 627 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A | 2-1-1-2-3-3 | {0,2,3,4,6,9} | `001001011101` |
| 628 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A | 1-1-3-1-3-3 | {0,1,2,5,6,9} | `001001100111` |
| 629 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A | 1-2-2-1-3-3 | {0,1,3,5,6,9} | `001001101011` |
| 630 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A | 2-1-2-1-3-3 | {0,2,3,5,6,9} | `001001101101` |
| 631 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A | 1-3-1-1-3-3 | {0,1,4,5,6,9} | `001001110011` |
| 632 | 6 | Unnamed / mathematical 12-TET collection | C D E F F♯ A | 2-2-1-1-3-3 | {0,2,4,5,6,9} | `001001110101` |
| 633 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A | 3-1-1-1-3-3 | {0,3,4,5,6,9} | `001001111001` |
| 634 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A | 1-1-1-4-2-3 | {0,1,2,3,7,9} | `001010001111` |
| 635 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G A | 1-1-2-3-2-3 | {0,1,2,4,7,9} | `001010010111` |
| 636 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A | 1-2-1-3-2-3 | {0,1,3,4,7,9} | `001010011011` |
| 637 | 6 | Major Blues | C D D♯ E G A | 2-1-1-3-2-3 | {0,2,3,4,7,9} | `001010011101` |
| 638 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G A | 1-1-3-2-2-3 | {0,1,2,5,7,9} | `001010100111` |
| 639 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G A | 1-2-2-2-2-3 | {0,1,3,5,7,9} | `001010101011` |
| 640 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G A | 2-1-2-2-2-3 | {0,2,3,5,7,9} | `001010101101` |
| 641 | 6 | Prometheus Liszt / hexatonic collection | C C♯ E F G A | 1-3-1-2-2-3 | {0,1,4,5,7,9} | `001010110011` |
| 642 | 6 | Unnamed / mathematical 12-TET collection | C D E F G A | 2-2-1-2-2-3 | {0,2,4,5,7,9} | `001010110101` |
| 643 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G A | 3-1-1-2-2-3 | {0,3,4,5,7,9} | `001010111001` |
| 644 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A | 1-1-4-1-2-3 | {0,1,2,6,7,9} | `001011000111` |
| 645 | 6 | Tritone Hexatonic | C C♯ D♯ F♯ G A | 1-2-3-1-2-3 | {0,1,3,6,7,9} | `001011001011` |
| 646 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G A | 2-1-3-1-2-3 | {0,2,3,6,7,9} | `001011001101` |
| 647 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G A | 1-3-2-1-2-3 | {0,1,4,6,7,9} | `001011010011` |
| 648 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G A | 2-2-2-1-2-3 | {0,2,4,6,7,9} | `001011010101` |
| 649 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A | 3-1-2-1-2-3 | {0,3,4,6,7,9} | `001011011001` |
| 650 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A | 1-4-1-1-2-3 | {0,1,5,6,7,9} | `001011100011` |
| 651 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G A | 2-3-1-1-2-3 | {0,2,5,6,7,9} | `001011100101` |
| 652 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G A | 3-2-1-1-2-3 | {0,3,5,6,7,9} | `001011101001` |
| 653 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G A | 4-1-1-1-2-3 | {0,4,5,6,7,9} | `001011110001` |
| 654 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A | 1-1-1-5-1-3 | {0,1,2,3,8,9} | `001100001111` |
| 655 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A | 1-1-2-4-1-3 | {0,1,2,4,8,9} | `001100010111` |
| 656 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A | 1-2-1-4-1-3 | {0,1,3,4,8,9} | `001100011011` |
| 657 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A | 2-1-1-4-1-3 | {0,2,3,4,8,9} | `001100011101` |
| 658 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A | 1-1-3-3-1-3 | {0,1,2,5,8,9} | `001100100111` |
| 659 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A | 1-2-2-3-1-3 | {0,1,3,5,8,9} | `001100101011` |
| 660 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A | 2-1-2-3-1-3 | {0,2,3,5,8,9} | `001100101101` |
| 661 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A | 1-3-1-3-1-3 | {0,1,4,5,8,9} | `001100110011` |
| 662 | 6 | Unnamed / mathematical 12-TET collection | C D E F G♯ A | 2-2-1-3-1-3 | {0,2,4,5,8,9} | `001100110101` |
| 663 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A | 3-1-1-3-1-3 | {0,3,4,5,8,9} | `001100111001` |
| 664 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A | 1-1-4-2-1-3 | {0,1,2,6,8,9} | `001101000111` |
| 665 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A | 1-2-3-2-1-3 | {0,1,3,6,8,9} | `001101001011` |
| 666 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A | 2-1-3-2-1-3 | {0,2,3,6,8,9} | `001101001101` |
| 667 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A | 1-3-2-2-1-3 | {0,1,4,6,8,9} | `001101010011` |
| 668 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ A | 2-2-2-2-1-3 | {0,2,4,6,8,9} | `001101010101` |
| 669 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A | 3-1-2-2-1-3 | {0,3,4,6,8,9} | `001101011001` |
| 670 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A | 1-4-1-2-1-3 | {0,1,5,6,8,9} | `001101100011` |
| 671 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A | 2-3-1-2-1-3 | {0,2,5,6,8,9} | `001101100101` |
| 672 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A | 3-2-1-2-1-3 | {0,3,5,6,8,9} | `001101101001` |
| 673 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A | 4-1-1-2-1-3 | {0,4,5,6,8,9} | `001101110001` |
| 674 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A | 1-1-5-1-1-3 | {0,1,2,7,8,9} | `001110000111` |
| 675 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A | 1-2-4-1-1-3 | {0,1,3,7,8,9} | `001110001011` |
| 676 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A | 2-1-4-1-1-3 | {0,2,3,7,8,9} | `001110001101` |
| 677 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A | 1-3-3-1-1-3 | {0,1,4,7,8,9} | `001110010011` |
| 678 | 6 | Unnamed / mathematical 12-TET collection | C D E G G♯ A | 2-2-3-1-1-3 | {0,2,4,7,8,9} | `001110010101` |
| 679 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A | 3-1-3-1-1-3 | {0,3,4,7,8,9} | `001110011001` |
| 680 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A | 1-4-2-1-1-3 | {0,1,5,7,8,9} | `001110100011` |
| 681 | 6 | Unnamed / mathematical 12-TET collection | C D F G G♯ A | 2-3-2-1-1-3 | {0,2,5,7,8,9} | `001110100101` |
| 682 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A | 3-2-2-1-1-3 | {0,3,5,7,8,9} | `001110101001` |
| 683 | 6 | Unnamed / mathematical 12-TET collection | C E F G G♯ A | 4-1-2-1-1-3 | {0,4,5,7,8,9} | `001110110001` |
| 684 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A | 1-5-1-1-1-3 | {0,1,6,7,8,9} | `001111000011` |
| 685 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A | 2-4-1-1-1-3 | {0,2,6,7,8,9} | `001111000101` |
| 686 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A | 3-3-1-1-1-3 | {0,3,6,7,8,9} | `001111001001` |
| 687 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A | 4-2-1-1-1-3 | {0,4,6,7,8,9} | `001111010001` |
| 688 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A | 5-1-1-1-1-3 | {0,5,6,7,8,9} | `001111100001` |
| 689 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A♯ | 1-1-1-1-6-2 | {0,1,2,3,4,T} | `010000011111` |
| 690 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A♯ | 1-1-1-2-5-2 | {0,1,2,3,5,T} | `010000101111` |
| 691 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F A♯ | 1-1-2-1-5-2 | {0,1,2,4,5,T} | `010000110111` |
| 692 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A♯ | 1-2-1-1-5-2 | {0,1,3,4,5,T} | `010000111011` |
| 693 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F A♯ | 2-1-1-1-5-2 | {0,2,3,4,5,T} | `010000111101` |
| 694 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A♯ | 1-1-1-3-4-2 | {0,1,2,3,6,T} | `010001001111` |
| 695 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A♯ | 1-1-2-2-4-2 | {0,1,2,4,6,T} | `010001010111` |
| 696 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A♯ | 1-2-1-2-4-2 | {0,1,3,4,6,T} | `010001011011` |
| 697 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A♯ | 2-1-1-2-4-2 | {0,2,3,4,6,T} | `010001011101` |
| 698 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A♯ | 1-1-3-1-4-2 | {0,1,2,5,6,T} | `010001100111` |
| 699 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A♯ | 1-2-2-1-4-2 | {0,1,3,5,6,T} | `010001101011` |
| 700 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A♯ | 2-1-2-1-4-2 | {0,2,3,5,6,T} | `010001101101` |
| 701 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A♯ | 1-3-1-1-4-2 | {0,1,4,5,6,T} | `010001110011` |
| 702 | 6 | Unnamed / mathematical 12-TET collection | C D E F F♯ A♯ | 2-2-1-1-4-2 | {0,2,4,5,6,T} | `010001110101` |
| 703 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A♯ | 3-1-1-1-4-2 | {0,3,4,5,6,T} | `010001111001` |
| 704 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A♯ | 1-1-1-4-3-2 | {0,1,2,3,7,T} | `010010001111` |
| 705 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G A♯ | 1-1-2-3-3-2 | {0,1,2,4,7,T} | `010010010111` |
| 706 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A♯ | 1-2-1-3-3-2 | {0,1,3,4,7,T} | `010010011011` |
| 707 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G A♯ | 2-1-1-3-3-2 | {0,2,3,4,7,T} | `010010011101` |
| 708 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G A♯ | 1-1-3-2-3-2 | {0,1,2,5,7,T} | `010010100111` |
| 709 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G A♯ | 1-2-2-2-3-2 | {0,1,3,5,7,T} | `010010101011` |
| 710 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G A♯ | 2-1-2-2-3-2 | {0,2,3,5,7,T} | `010010101101` |
| 711 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G A♯ | 1-3-1-2-3-2 | {0,1,4,5,7,T} | `010010110011` |
| 712 | 6 | Unnamed / mathematical 12-TET collection | C D E F G A♯ | 2-2-1-2-3-2 | {0,2,4,5,7,T} | `010010110101` |
| 713 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G A♯ | 3-1-1-2-3-2 | {0,3,4,5,7,T} | `010010111001` |
| 714 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A♯ | 1-1-4-1-3-2 | {0,1,2,6,7,T} | `010011000111` |
| 715 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G A♯ | 1-2-3-1-3-2 | {0,1,3,6,7,T} | `010011001011` |
| 716 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G A♯ | 2-1-3-1-3-2 | {0,2,3,6,7,T} | `010011001101` |
| 717 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G A♯ | 1-3-2-1-3-2 | {0,1,4,6,7,T} | `010011010011` |
| 718 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G A♯ | 2-2-2-1-3-2 | {0,2,4,6,7,T} | `010011010101` |
| 719 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A♯ | 3-1-2-1-3-2 | {0,3,4,6,7,T} | `010011011001` |
| 720 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A♯ | 1-4-1-1-3-2 | {0,1,5,6,7,T} | `010011100011` |
| 721 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G A♯ | 2-3-1-1-3-2 | {0,2,5,6,7,T} | `010011100101` |
| 722 | 6 | Minor Blues | C D♯ F F♯ G A♯ | 3-2-1-1-3-2 | {0,3,5,6,7,T} | `010011101001` |
| 723 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G A♯ | 4-1-1-1-3-2 | {0,4,5,6,7,T} | `010011110001` |
| 724 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A♯ | 1-1-1-5-2-2 | {0,1,2,3,8,T} | `010100001111` |
| 725 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A♯ | 1-1-2-4-2-2 | {0,1,2,4,8,T} | `010100010111` |
| 726 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A♯ | 1-2-1-4-2-2 | {0,1,3,4,8,T} | `010100011011` |
| 727 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A♯ | 2-1-1-4-2-2 | {0,2,3,4,8,T} | `010100011101` |
| 728 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A♯ | 1-1-3-3-2-2 | {0,1,2,5,8,T} | `010100100111` |
| 729 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A♯ | 1-2-2-3-2-2 | {0,1,3,5,8,T} | `010100101011` |
| 730 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A♯ | 2-1-2-3-2-2 | {0,2,3,5,8,T} | `010100101101` |
| 731 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A♯ | 1-3-1-3-2-2 | {0,1,4,5,8,T} | `010100110011` |
| 732 | 6 | Unnamed / mathematical 12-TET collection | C D E F G♯ A♯ | 2-2-1-3-2-2 | {0,2,4,5,8,T} | `010100110101` |
| 733 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A♯ | 3-1-1-3-2-2 | {0,3,4,5,8,T} | `010100111001` |
| 734 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A♯ | 1-1-4-2-2-2 | {0,1,2,6,8,T} | `010101000111` |
| 735 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A♯ | 1-2-3-2-2-2 | {0,1,3,6,8,T} | `010101001011` |
| 736 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A♯ | 2-1-3-2-2-2 | {0,2,3,6,8,T} | `010101001101` |
| 737 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A♯ | 1-3-2-2-2-2 | {0,1,4,6,8,T} | `010101010011` |
| 738 | 6 | Whole Tone | C D E F♯ G♯ A♯ | 2-2-2-2-2-2 | {0,2,4,6,8,T} | `010101010101` |
| 739 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A♯ | 3-1-2-2-2-2 | {0,3,4,6,8,T} | `010101011001` |
| 740 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A♯ | 1-4-1-2-2-2 | {0,1,5,6,8,T} | `010101100011` |
| 741 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A♯ | 2-3-1-2-2-2 | {0,2,5,6,8,T} | `010101100101` |
| 742 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A♯ | 3-2-1-2-2-2 | {0,3,5,6,8,T} | `010101101001` |
| 743 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A♯ | 4-1-1-2-2-2 | {0,4,5,6,8,T} | `010101110001` |
| 744 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A♯ | 1-1-5-1-2-2 | {0,1,2,7,8,T} | `010110000111` |
| 745 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A♯ | 1-2-4-1-2-2 | {0,1,3,7,8,T} | `010110001011` |
| 746 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A♯ | 2-1-4-1-2-2 | {0,2,3,7,8,T} | `010110001101` |
| 747 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A♯ | 1-3-3-1-2-2 | {0,1,4,7,8,T} | `010110010011` |
| 748 | 6 | Unnamed / mathematical 12-TET collection | C D E G G♯ A♯ | 2-2-3-1-2-2 | {0,2,4,7,8,T} | `010110010101` |
| 749 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A♯ | 3-1-3-1-2-2 | {0,3,4,7,8,T} | `010110011001` |
| 750 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A♯ | 1-4-2-1-2-2 | {0,1,5,7,8,T} | `010110100011` |
| 751 | 6 | Unnamed / mathematical 12-TET collection | C D F G G♯ A♯ | 2-3-2-1-2-2 | {0,2,5,7,8,T} | `010110100101` |
| 752 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A♯ | 3-2-2-1-2-2 | {0,3,5,7,8,T} | `010110101001` |
| 753 | 6 | Unnamed / mathematical 12-TET collection | C E F G G♯ A♯ | 4-1-2-1-2-2 | {0,4,5,7,8,T} | `010110110001` |
| 754 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A♯ | 1-5-1-1-2-2 | {0,1,6,7,8,T} | `010111000011` |
| 755 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A♯ | 2-4-1-1-2-2 | {0,2,6,7,8,T} | `010111000101` |
| 756 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A♯ | 3-3-1-1-2-2 | {0,3,6,7,8,T} | `010111001001` |
| 757 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A♯ | 4-2-1-1-2-2 | {0,4,6,7,8,T} | `010111010001` |
| 758 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A♯ | 5-1-1-1-2-2 | {0,5,6,7,8,T} | `010111100001` |
| 759 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A A♯ | 1-1-1-6-1-2 | {0,1,2,3,9,T} | `011000001111` |
| 760 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E A A♯ | 1-1-2-5-1-2 | {0,1,2,4,9,T} | `011000010111` |
| 761 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A A♯ | 1-2-1-5-1-2 | {0,1,3,4,9,T} | `011000011011` |
| 762 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E A A♯ | 2-1-1-5-1-2 | {0,2,3,4,9,T} | `011000011101` |
| 763 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F A A♯ | 1-1-3-4-1-2 | {0,1,2,5,9,T} | `011000100111` |
| 764 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A A♯ | 1-2-2-4-1-2 | {0,1,3,5,9,T} | `011000101011` |
| 765 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F A A♯ | 2-1-2-4-1-2 | {0,2,3,5,9,T} | `011000101101` |
| 766 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F A A♯ | 1-3-1-4-1-2 | {0,1,4,5,9,T} | `011000110011` |
| 767 | 6 | Unnamed / mathematical 12-TET collection | C D E F A A♯ | 2-2-1-4-1-2 | {0,2,4,5,9,T} | `011000110101` |
| 768 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F A A♯ | 3-1-1-4-1-2 | {0,3,4,5,9,T} | `011000111001` |
| 769 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A A♯ | 1-1-4-3-1-2 | {0,1,2,6,9,T} | `011001000111` |
| 770 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A A♯ | 1-2-3-3-1-2 | {0,1,3,6,9,T} | `011001001011` |
| 771 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A A♯ | 2-1-3-3-1-2 | {0,2,3,6,9,T} | `011001001101` |
| 772 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A A♯ | 1-3-2-3-1-2 | {0,1,4,6,9,T} | `011001010011` |
| 773 | 6 | Prometheus / Mystic | C D E F♯ A A♯ | 2-2-2-3-1-2 | {0,2,4,6,9,T} | `011001010101` |
| 774 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A A♯ | 3-1-2-3-1-2 | {0,3,4,6,9,T} | `011001011001` |
| 775 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ A A♯ | 1-4-1-3-1-2 | {0,1,5,6,9,T} | `011001100011` |
| 776 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ A A♯ | 2-3-1-3-1-2 | {0,2,5,6,9,T} | `011001100101` |
| 777 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A A♯ | 3-2-1-3-1-2 | {0,3,5,6,9,T} | `011001101001` |
| 778 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ A A♯ | 4-1-1-3-1-2 | {0,4,5,6,9,T} | `011001110001` |
| 779 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G A A♯ | 1-1-5-2-1-2 | {0,1,2,7,9,T} | `011010000111` |
| 780 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A A♯ | 1-2-4-2-1-2 | {0,1,3,7,9,T} | `011010001011` |
| 781 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G A A♯ | 2-1-4-2-1-2 | {0,2,3,7,9,T} | `011010001101` |
| 782 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G A A♯ | 1-3-3-2-1-2 | {0,1,4,7,9,T} | `011010010011` |
| 783 | 6 | Unnamed / mathematical 12-TET collection | C D E G A A♯ | 2-2-3-2-1-2 | {0,2,4,7,9,T} | `011010010101` |
| 784 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G A A♯ | 3-1-3-2-1-2 | {0,3,4,7,9,T} | `011010011001` |
| 785 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G A A♯ | 1-4-2-2-1-2 | {0,1,5,7,9,T} | `011010100011` |
| 786 | 6 | Unnamed / mathematical 12-TET collection | C D F G A A♯ | 2-3-2-2-1-2 | {0,2,5,7,9,T} | `011010100101` |
| 787 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G A A♯ | 3-2-2-2-1-2 | {0,3,5,7,9,T} | `011010101001` |
| 788 | 6 | Unnamed / mathematical 12-TET collection | C E F G A A♯ | 4-1-2-2-1-2 | {0,4,5,7,9,T} | `011010110001` |
| 789 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A A♯ | 1-5-1-2-1-2 | {0,1,6,7,9,T} | `011011000011` |
| 790 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G A A♯ | 2-4-1-2-1-2 | {0,2,6,7,9,T} | `011011000101` |
| 791 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A A♯ | 3-3-1-2-1-2 | {0,3,6,7,9,T} | `011011001001` |
| 792 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G A A♯ | 4-2-1-2-1-2 | {0,4,6,7,9,T} | `011011010001` |
| 793 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G A A♯ | 5-1-1-2-1-2 | {0,5,6,7,9,T} | `011011100001` |
| 794 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A A♯ | 1-1-6-1-1-2 | {0,1,2,8,9,T} | `011100000111` |
| 795 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A A♯ | 1-2-5-1-1-2 | {0,1,3,8,9,T} | `011100001011` |
| 796 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A A♯ | 2-1-5-1-1-2 | {0,2,3,8,9,T} | `011100001101` |
| 797 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A A♯ | 1-3-4-1-1-2 | {0,1,4,8,9,T} | `011100010011` |
| 798 | 6 | Unnamed / mathematical 12-TET collection | C D E G♯ A A♯ | 2-2-4-1-1-2 | {0,2,4,8,9,T} | `011100010101` |
| 799 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A A♯ | 3-1-4-1-1-2 | {0,3,4,8,9,T} | `011100011001` |
| 800 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A A♯ | 1-4-3-1-1-2 | {0,1,5,8,9,T} | `011100100011` |
| 801 | 6 | Unnamed / mathematical 12-TET collection | C D F G♯ A A♯ | 2-3-3-1-1-2 | {0,2,5,8,9,T} | `011100100101` |
| 802 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A A♯ | 3-2-3-1-1-2 | {0,3,5,8,9,T} | `011100101001` |
| 803 | 6 | Unnamed / mathematical 12-TET collection | C E F G♯ A A♯ | 4-1-3-1-1-2 | {0,4,5,8,9,T} | `011100110001` |
| 804 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A A♯ | 1-5-2-1-1-2 | {0,1,6,8,9,T} | `011101000011` |
| 805 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A A♯ | 2-4-2-1-1-2 | {0,2,6,8,9,T} | `011101000101` |
| 806 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A A♯ | 3-3-2-1-1-2 | {0,3,6,8,9,T} | `011101001001` |
| 807 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A A♯ | 4-2-2-1-1-2 | {0,4,6,8,9,T} | `011101010001` |
| 808 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A A♯ | 5-1-2-1-1-2 | {0,5,6,8,9,T} | `011101100001` |
| 809 | 6 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A A♯ | 1-6-1-1-1-2 | {0,1,7,8,9,T} | `011110000011` |
| 810 | 6 | Unnamed / mathematical 12-TET collection | C D G G♯ A A♯ | 2-5-1-1-1-2 | {0,2,7,8,9,T} | `011110000101` |
| 811 | 6 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A A♯ | 3-4-1-1-1-2 | {0,3,7,8,9,T} | `011110001001` |
| 812 | 6 | Unnamed / mathematical 12-TET collection | C E G G♯ A A♯ | 4-3-1-1-1-2 | {0,4,7,8,9,T} | `011110010001` |
| 813 | 6 | Unnamed / mathematical 12-TET collection | C F G G♯ A A♯ | 5-2-1-1-1-2 | {0,5,7,8,9,T} | `011110100001` |
| 814 | 6 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A A♯ | 6-1-1-1-1-2 | {0,6,7,8,9,T} | `011111000001` |
| 815 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E B | 1-1-1-1-7-1 | {0,1,2,3,4,E} | `100000011111` |
| 816 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F B | 1-1-1-2-6-1 | {0,1,2,3,5,E} | `100000101111` |
| 817 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F B | 1-1-2-1-6-1 | {0,1,2,4,5,E} | `100000110111` |
| 818 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F B | 1-2-1-1-6-1 | {0,1,3,4,5,E} | `100000111011` |
| 819 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F B | 2-1-1-1-6-1 | {0,2,3,4,5,E} | `100000111101` |
| 820 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ B | 1-1-1-3-5-1 | {0,1,2,3,6,E} | `100001001111` |
| 821 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ B | 1-1-2-2-5-1 | {0,1,2,4,6,E} | `100001010111` |
| 822 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ B | 1-2-1-2-5-1 | {0,1,3,4,6,E} | `100001011011` |
| 823 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ B | 2-1-1-2-5-1 | {0,2,3,4,6,E} | `100001011101` |
| 824 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ B | 1-1-3-1-5-1 | {0,1,2,5,6,E} | `100001100111` |
| 825 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ B | 1-2-2-1-5-1 | {0,1,3,5,6,E} | `100001101011` |
| 826 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ B | 2-1-2-1-5-1 | {0,2,3,5,6,E} | `100001101101` |
| 827 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ B | 1-3-1-1-5-1 | {0,1,4,5,6,E} | `100001110011` |
| 828 | 6 | Unnamed / mathematical 12-TET collection | C D E F F♯ B | 2-2-1-1-5-1 | {0,2,4,5,6,E} | `100001110101` |
| 829 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ B | 3-1-1-1-5-1 | {0,3,4,5,6,E} | `100001111001` |
| 830 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G B | 1-1-1-4-4-1 | {0,1,2,3,7,E} | `100010001111` |
| 831 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G B | 1-1-2-3-4-1 | {0,1,2,4,7,E} | `100010010111` |
| 832 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G B | 1-2-1-3-4-1 | {0,1,3,4,7,E} | `100010011011` |
| 833 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G B | 2-1-1-3-4-1 | {0,2,3,4,7,E} | `100010011101` |
| 834 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G B | 1-1-3-2-4-1 | {0,1,2,5,7,E} | `100010100111` |
| 835 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G B | 1-2-2-2-4-1 | {0,1,3,5,7,E} | `100010101011` |
| 836 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G B | 2-1-2-2-4-1 | {0,2,3,5,7,E} | `100010101101` |
| 837 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G B | 1-3-1-2-4-1 | {0,1,4,5,7,E} | `100010110011` |
| 838 | 6 | Unnamed / mathematical 12-TET collection | C D E F G B | 2-2-1-2-4-1 | {0,2,4,5,7,E} | `100010110101` |
| 839 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G B | 3-1-1-2-4-1 | {0,3,4,5,7,E} | `100010111001` |
| 840 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G B | 1-1-4-1-4-1 | {0,1,2,6,7,E} | `100011000111` |
| 841 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G B | 1-2-3-1-4-1 | {0,1,3,6,7,E} | `100011001011` |
| 842 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G B | 2-1-3-1-4-1 | {0,2,3,6,7,E} | `100011001101` |
| 843 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G B | 1-3-2-1-4-1 | {0,1,4,6,7,E} | `100011010011` |
| 844 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G B | 2-2-2-1-4-1 | {0,2,4,6,7,E} | `100011010101` |
| 845 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G B | 3-1-2-1-4-1 | {0,3,4,6,7,E} | `100011011001` |
| 846 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G B | 1-4-1-1-4-1 | {0,1,5,6,7,E} | `100011100011` |
| 847 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G B | 2-3-1-1-4-1 | {0,2,5,6,7,E} | `100011100101` |
| 848 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G B | 3-2-1-1-4-1 | {0,3,5,6,7,E} | `100011101001` |
| 849 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G B | 4-1-1-1-4-1 | {0,4,5,6,7,E} | `100011110001` |
| 850 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ B | 1-1-1-5-3-1 | {0,1,2,3,8,E} | `100100001111` |
| 851 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ B | 1-1-2-4-3-1 | {0,1,2,4,8,E} | `100100010111` |
| 852 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ B | 1-2-1-4-3-1 | {0,1,3,4,8,E} | `100100011011` |
| 853 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ B | 2-1-1-4-3-1 | {0,2,3,4,8,E} | `100100011101` |
| 854 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ B | 1-1-3-3-3-1 | {0,1,2,5,8,E} | `100100100111` |
| 855 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ B | 1-2-2-3-3-1 | {0,1,3,5,8,E} | `100100101011` |
| 856 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ B | 2-1-2-3-3-1 | {0,2,3,5,8,E} | `100100101101` |
| 857 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ B | 1-3-1-3-3-1 | {0,1,4,5,8,E} | `100100110011` |
| 858 | 6 | Unnamed / mathematical 12-TET collection | C D E F G♯ B | 2-2-1-3-3-1 | {0,2,4,5,8,E} | `100100110101` |
| 859 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ B | 3-1-1-3-3-1 | {0,3,4,5,8,E} | `100100111001` |
| 860 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ B | 1-1-4-2-3-1 | {0,1,2,6,8,E} | `100101000111` |
| 861 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ B | 1-2-3-2-3-1 | {0,1,3,6,8,E} | `100101001011` |
| 862 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ B | 2-1-3-2-3-1 | {0,2,3,6,8,E} | `100101001101` |
| 863 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ B | 1-3-2-2-3-1 | {0,1,4,6,8,E} | `100101010011` |
| 864 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ B | 2-2-2-2-3-1 | {0,2,4,6,8,E} | `100101010101` |
| 865 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ B | 3-1-2-2-3-1 | {0,3,4,6,8,E} | `100101011001` |
| 866 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ B | 1-4-1-2-3-1 | {0,1,5,6,8,E} | `100101100011` |
| 867 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ B | 2-3-1-2-3-1 | {0,2,5,6,8,E} | `100101100101` |
| 868 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ B | 3-2-1-2-3-1 | {0,3,5,6,8,E} | `100101101001` |
| 869 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ B | 4-1-1-2-3-1 | {0,4,5,6,8,E} | `100101110001` |
| 870 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ B | 1-1-5-1-3-1 | {0,1,2,7,8,E} | `100110000111` |
| 871 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ B | 1-2-4-1-3-1 | {0,1,3,7,8,E} | `100110001011` |
| 872 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ B | 2-1-4-1-3-1 | {0,2,3,7,8,E} | `100110001101` |
| 873 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ B | 1-3-3-1-3-1 | {0,1,4,7,8,E} | `100110010011` |
| 874 | 6 | Unnamed / mathematical 12-TET collection | C D E G G♯ B | 2-2-3-1-3-1 | {0,2,4,7,8,E} | `100110010101` |
| 875 | 6 | Augmented Hexatonic | C D♯ E G G♯ B | 3-1-3-1-3-1 | {0,3,4,7,8,E} | `100110011001` |
| 876 | 6 | Messiaen Mode 5 (one common transposition) | C C♯ F G G♯ B | 1-4-2-1-3-1 | {0,1,5,7,8,E} | `100110100011` |
| 877 | 6 | Unnamed / mathematical 12-TET collection | C D F G G♯ B | 2-3-2-1-3-1 | {0,2,5,7,8,E} | `100110100101` |
| 878 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ B | 3-2-2-1-3-1 | {0,3,5,7,8,E} | `100110101001` |
| 879 | 6 | Unnamed / mathematical 12-TET collection | C E F G G♯ B | 4-1-2-1-3-1 | {0,4,5,7,8,E} | `100110110001` |
| 880 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ B | 1-5-1-1-3-1 | {0,1,6,7,8,E} | `100111000011` |
| 881 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ B | 2-4-1-1-3-1 | {0,2,6,7,8,E} | `100111000101` |
| 882 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ B | 3-3-1-1-3-1 | {0,3,6,7,8,E} | `100111001001` |
| 883 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ B | 4-2-1-1-3-1 | {0,4,6,7,8,E} | `100111010001` |
| 884 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ B | 5-1-1-1-3-1 | {0,5,6,7,8,E} | `100111100001` |
| 885 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A B | 1-1-1-6-2-1 | {0,1,2,3,9,E} | `101000001111` |
| 886 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E A B | 1-1-2-5-2-1 | {0,1,2,4,9,E} | `101000010111` |
| 887 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A B | 1-2-1-5-2-1 | {0,1,3,4,9,E} | `101000011011` |
| 888 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E A B | 2-1-1-5-2-1 | {0,2,3,4,9,E} | `101000011101` |
| 889 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F A B | 1-1-3-4-2-1 | {0,1,2,5,9,E} | `101000100111` |
| 890 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A B | 1-2-2-4-2-1 | {0,1,3,5,9,E} | `101000101011` |
| 891 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F A B | 2-1-2-4-2-1 | {0,2,3,5,9,E} | `101000101101` |
| 892 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F A B | 1-3-1-4-2-1 | {0,1,4,5,9,E} | `101000110011` |
| 893 | 6 | Unnamed / mathematical 12-TET collection | C D E F A B | 2-2-1-4-2-1 | {0,2,4,5,9,E} | `101000110101` |
| 894 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F A B | 3-1-1-4-2-1 | {0,3,4,5,9,E} | `101000111001` |
| 895 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A B | 1-1-4-3-2-1 | {0,1,2,6,9,E} | `101001000111` |
| 896 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A B | 1-2-3-3-2-1 | {0,1,3,6,9,E} | `101001001011` |
| 897 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A B | 2-1-3-3-2-1 | {0,2,3,6,9,E} | `101001001101` |
| 898 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A B | 1-3-2-3-2-1 | {0,1,4,6,9,E} | `101001010011` |
| 899 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ A B | 2-2-2-3-2-1 | {0,2,4,6,9,E} | `101001010101` |
| 900 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A B | 3-1-2-3-2-1 | {0,3,4,6,9,E} | `101001011001` |
| 901 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ A B | 1-4-1-3-2-1 | {0,1,5,6,9,E} | `101001100011` |
| 902 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ A B | 2-3-1-3-2-1 | {0,2,5,6,9,E} | `101001100101` |
| 903 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A B | 3-2-1-3-2-1 | {0,3,5,6,9,E} | `101001101001` |
| 904 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ A B | 4-1-1-3-2-1 | {0,4,5,6,9,E} | `101001110001` |
| 905 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G A B | 1-1-5-2-2-1 | {0,1,2,7,9,E} | `101010000111` |
| 906 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A B | 1-2-4-2-2-1 | {0,1,3,7,9,E} | `101010001011` |
| 907 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G A B | 2-1-4-2-2-1 | {0,2,3,7,9,E} | `101010001101` |
| 908 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G A B | 1-3-3-2-2-1 | {0,1,4,7,9,E} | `101010010011` |
| 909 | 6 | Unnamed / mathematical 12-TET collection | C D E G A B | 2-2-3-2-2-1 | {0,2,4,7,9,E} | `101010010101` |
| 910 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G A B | 3-1-3-2-2-1 | {0,3,4,7,9,E} | `101010011001` |
| 911 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G A B | 1-4-2-2-2-1 | {0,1,5,7,9,E} | `101010100011` |
| 912 | 6 | Unnamed / mathematical 12-TET collection | C D F G A B | 2-3-2-2-2-1 | {0,2,5,7,9,E} | `101010100101` |
| 913 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G A B | 3-2-2-2-2-1 | {0,3,5,7,9,E} | `101010101001` |
| 914 | 6 | Unnamed / mathematical 12-TET collection | C E F G A B | 4-1-2-2-2-1 | {0,4,5,7,9,E} | `101010110001` |
| 915 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A B | 1-5-1-2-2-1 | {0,1,6,7,9,E} | `101011000011` |
| 916 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G A B | 2-4-1-2-2-1 | {0,2,6,7,9,E} | `101011000101` |
| 917 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A B | 3-3-1-2-2-1 | {0,3,6,7,9,E} | `101011001001` |
| 918 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G A B | 4-2-1-2-2-1 | {0,4,6,7,9,E} | `101011010001` |
| 919 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G A B | 5-1-1-2-2-1 | {0,5,6,7,9,E} | `101011100001` |
| 920 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A B | 1-1-6-1-2-1 | {0,1,2,8,9,E} | `101100000111` |
| 921 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A B | 1-2-5-1-2-1 | {0,1,3,8,9,E} | `101100001011` |
| 922 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A B | 2-1-5-1-2-1 | {0,2,3,8,9,E} | `101100001101` |
| 923 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A B | 1-3-4-1-2-1 | {0,1,4,8,9,E} | `101100010011` |
| 924 | 6 | Unnamed / mathematical 12-TET collection | C D E G♯ A B | 2-2-4-1-2-1 | {0,2,4,8,9,E} | `101100010101` |
| 925 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A B | 3-1-4-1-2-1 | {0,3,4,8,9,E} | `101100011001` |
| 926 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A B | 1-4-3-1-2-1 | {0,1,5,8,9,E} | `101100100011` |
| 927 | 6 | Unnamed / mathematical 12-TET collection | C D F G♯ A B | 2-3-3-1-2-1 | {0,2,5,8,9,E} | `101100100101` |
| 928 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A B | 3-2-3-1-2-1 | {0,3,5,8,9,E} | `101100101001` |
| 929 | 6 | Unnamed / mathematical 12-TET collection | C E F G♯ A B | 4-1-3-1-2-1 | {0,4,5,8,9,E} | `101100110001` |
| 930 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A B | 1-5-2-1-2-1 | {0,1,6,8,9,E} | `101101000011` |
| 931 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A B | 2-4-2-1-2-1 | {0,2,6,8,9,E} | `101101000101` |
| 932 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A B | 3-3-2-1-2-1 | {0,3,6,8,9,E} | `101101001001` |
| 933 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A B | 4-2-2-1-2-1 | {0,4,6,8,9,E} | `101101010001` |
| 934 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A B | 5-1-2-1-2-1 | {0,5,6,8,9,E} | `101101100001` |
| 935 | 6 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A B | 1-6-1-1-2-1 | {0,1,7,8,9,E} | `101110000011` |
| 936 | 6 | Unnamed / mathematical 12-TET collection | C D G G♯ A B | 2-5-1-1-2-1 | {0,2,7,8,9,E} | `101110000101` |
| 937 | 6 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A B | 3-4-1-1-2-1 | {0,3,7,8,9,E} | `101110001001` |
| 938 | 6 | Unnamed / mathematical 12-TET collection | C E G G♯ A B | 4-3-1-1-2-1 | {0,4,7,8,9,E} | `101110010001` |
| 939 | 6 | Unnamed / mathematical 12-TET collection | C F G G♯ A B | 5-2-1-1-2-1 | {0,5,7,8,9,E} | `101110100001` |
| 940 | 6 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A B | 6-1-1-1-2-1 | {0,6,7,8,9,E} | `101111000001` |
| 941 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A♯ B | 1-1-1-7-1-1 | {0,1,2,3,T,E} | `110000001111` |
| 942 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D E A♯ B | 1-1-2-6-1-1 | {0,1,2,4,T,E} | `110000010111` |
| 943 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A♯ B | 1-2-1-6-1-1 | {0,1,3,4,T,E} | `110000011011` |
| 944 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ E A♯ B | 2-1-1-6-1-1 | {0,2,3,4,T,E} | `110000011101` |
| 945 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F A♯ B | 1-1-3-5-1-1 | {0,1,2,5,T,E} | `110000100111` |
| 946 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A♯ B | 1-2-2-5-1-1 | {0,1,3,5,T,E} | `110000101011` |
| 947 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F A♯ B | 2-1-2-5-1-1 | {0,2,3,5,T,E} | `110000101101` |
| 948 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F A♯ B | 1-3-1-5-1-1 | {0,1,4,5,T,E} | `110000110011` |
| 949 | 6 | Unnamed / mathematical 12-TET collection | C D E F A♯ B | 2-2-1-5-1-1 | {0,2,4,5,T,E} | `110000110101` |
| 950 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F A♯ B | 3-1-1-5-1-1 | {0,3,4,5,T,E} | `110000111001` |
| 951 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A♯ B | 1-1-4-4-1-1 | {0,1,2,6,T,E} | `110001000111` |
| 952 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A♯ B | 1-2-3-4-1-1 | {0,1,3,6,T,E} | `110001001011` |
| 953 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A♯ B | 2-1-3-4-1-1 | {0,2,3,6,T,E} | `110001001101` |
| 954 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A♯ B | 1-3-2-4-1-1 | {0,1,4,6,T,E} | `110001010011` |
| 955 | 6 | Unnamed / mathematical 12-TET collection | C D E F♯ A♯ B | 2-2-2-4-1-1 | {0,2,4,6,T,E} | `110001010101` |
| 956 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A♯ B | 3-1-2-4-1-1 | {0,3,4,6,T,E} | `110001011001` |
| 957 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ A♯ B | 1-4-1-4-1-1 | {0,1,5,6,T,E} | `110001100011` |
| 958 | 6 | Unnamed / mathematical 12-TET collection | C D F F♯ A♯ B | 2-3-1-4-1-1 | {0,2,5,6,T,E} | `110001100101` |
| 959 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A♯ B | 3-2-1-4-1-1 | {0,3,5,6,T,E} | `110001101001` |
| 960 | 6 | Unnamed / mathematical 12-TET collection | C E F F♯ A♯ B | 4-1-1-4-1-1 | {0,4,5,6,T,E} | `110001110001` |
| 961 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G A♯ B | 1-1-5-3-1-1 | {0,1,2,7,T,E} | `110010000111` |
| 962 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A♯ B | 1-2-4-3-1-1 | {0,1,3,7,T,E} | `110010001011` |
| 963 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G A♯ B | 2-1-4-3-1-1 | {0,2,3,7,T,E} | `110010001101` |
| 964 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G A♯ B | 1-3-3-3-1-1 | {0,1,4,7,T,E} | `110010010011` |
| 965 | 6 | Unnamed / mathematical 12-TET collection | C D E G A♯ B | 2-2-3-3-1-1 | {0,2,4,7,T,E} | `110010010101` |
| 966 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G A♯ B | 3-1-3-3-1-1 | {0,3,4,7,T,E} | `110010011001` |
| 967 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G A♯ B | 1-4-2-3-1-1 | {0,1,5,7,T,E} | `110010100011` |
| 968 | 6 | Unnamed / mathematical 12-TET collection | C D F G A♯ B | 2-3-2-3-1-1 | {0,2,5,7,T,E} | `110010100101` |
| 969 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G A♯ B | 3-2-2-3-1-1 | {0,3,5,7,T,E} | `110010101001` |
| 970 | 6 | Unnamed / mathematical 12-TET collection | C E F G A♯ B | 4-1-2-3-1-1 | {0,4,5,7,T,E} | `110010110001` |
| 971 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A♯ B | 1-5-1-3-1-1 | {0,1,6,7,T,E} | `110011000011` |
| 972 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G A♯ B | 2-4-1-3-1-1 | {0,2,6,7,T,E} | `110011000101` |
| 973 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A♯ B | 3-3-1-3-1-1 | {0,3,6,7,T,E} | `110011001001` |
| 974 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G A♯ B | 4-2-1-3-1-1 | {0,4,6,7,T,E} | `110011010001` |
| 975 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G A♯ B | 5-1-1-3-1-1 | {0,5,6,7,T,E} | `110011100001` |
| 976 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A♯ B | 1-1-6-2-1-1 | {0,1,2,8,T,E} | `110100000111` |
| 977 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A♯ B | 1-2-5-2-1-1 | {0,1,3,8,T,E} | `110100001011` |
| 978 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A♯ B | 2-1-5-2-1-1 | {0,2,3,8,T,E} | `110100001101` |
| 979 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A♯ B | 1-3-4-2-1-1 | {0,1,4,8,T,E} | `110100010011` |
| 980 | 6 | Unnamed / mathematical 12-TET collection | C D E G♯ A♯ B | 2-2-4-2-1-1 | {0,2,4,8,T,E} | `110100010101` |
| 981 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A♯ B | 3-1-4-2-1-1 | {0,3,4,8,T,E} | `110100011001` |
| 982 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A♯ B | 1-4-3-2-1-1 | {0,1,5,8,T,E} | `110100100011` |
| 983 | 6 | Unnamed / mathematical 12-TET collection | C D F G♯ A♯ B | 2-3-3-2-1-1 | {0,2,5,8,T,E} | `110100100101` |
| 984 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A♯ B | 3-2-3-2-1-1 | {0,3,5,8,T,E} | `110100101001` |
| 985 | 6 | Unnamed / mathematical 12-TET collection | C E F G♯ A♯ B | 4-1-3-2-1-1 | {0,4,5,8,T,E} | `110100110001` |
| 986 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A♯ B | 1-5-2-2-1-1 | {0,1,6,8,T,E} | `110101000011` |
| 987 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A♯ B | 2-4-2-2-1-1 | {0,2,6,8,T,E} | `110101000101` |
| 988 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A♯ B | 3-3-2-2-1-1 | {0,3,6,8,T,E} | `110101001001` |
| 989 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A♯ B | 4-2-2-2-1-1 | {0,4,6,8,T,E} | `110101010001` |
| 990 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A♯ B | 5-1-2-2-1-1 | {0,5,6,8,T,E} | `110101100001` |
| 991 | 6 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A♯ B | 1-6-1-2-1-1 | {0,1,7,8,T,E} | `110110000011` |
| 992 | 6 | Unnamed / mathematical 12-TET collection | C D G G♯ A♯ B | 2-5-1-2-1-1 | {0,2,7,8,T,E} | `110110000101` |
| 993 | 6 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A♯ B | 3-4-1-2-1-1 | {0,3,7,8,T,E} | `110110001001` |
| 994 | 6 | Unnamed / mathematical 12-TET collection | C E G G♯ A♯ B | 4-3-1-2-1-1 | {0,4,7,8,T,E} | `110110010001` |
| 995 | 6 | Unnamed / mathematical 12-TET collection | C F G G♯ A♯ B | 5-2-1-2-1-1 | {0,5,7,8,T,E} | `110110100001` |
| 996 | 6 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A♯ B | 6-1-1-2-1-1 | {0,6,7,8,T,E} | `110111000001` |
| 997 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D A A♯ B | 1-1-7-1-1-1 | {0,1,2,9,T,E} | `111000000111` |
| 998 | 6 | Unnamed / mathematical 12-TET collection | C C♯ D♯ A A♯ B | 1-2-6-1-1-1 | {0,1,3,9,T,E} | `111000001011` |
| 999 | 6 | Unnamed / mathematical 12-TET collection | C D D♯ A A♯ B | 2-1-6-1-1-1 | {0,2,3,9,T,E} | `111000001101` |
| 1000 | 6 | Unnamed / mathematical 12-TET collection | C C♯ E A A♯ B | 1-3-5-1-1-1 | {0,1,4,9,T,E} | `111000010011` |
| 1001 | 6 | Unnamed / mathematical 12-TET collection | C D E A A♯ B | 2-2-5-1-1-1 | {0,2,4,9,T,E} | `111000010101` |
| 1002 | 6 | Unnamed / mathematical 12-TET collection | C D♯ E A A♯ B | 3-1-5-1-1-1 | {0,3,4,9,T,E} | `111000011001` |
| 1003 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F A A♯ B | 1-4-4-1-1-1 | {0,1,5,9,T,E} | `111000100011` |
| 1004 | 6 | Unnamed / mathematical 12-TET collection | C D F A A♯ B | 2-3-4-1-1-1 | {0,2,5,9,T,E} | `111000100101` |
| 1005 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F A A♯ B | 3-2-4-1-1-1 | {0,3,5,9,T,E} | `111000101001` |
| 1006 | 6 | Unnamed / mathematical 12-TET collection | C E F A A♯ B | 4-1-4-1-1-1 | {0,4,5,9,T,E} | `111000110001` |
| 1007 | 6 | Unnamed / mathematical 12-TET collection | C C♯ F♯ A A♯ B | 1-5-3-1-1-1 | {0,1,6,9,T,E} | `111001000011` |
| 1008 | 6 | Unnamed / mathematical 12-TET collection | C D F♯ A A♯ B | 2-4-3-1-1-1 | {0,2,6,9,T,E} | `111001000101` |
| 1009 | 6 | Unnamed / mathematical 12-TET collection | C D♯ F♯ A A♯ B | 3-3-3-1-1-1 | {0,3,6,9,T,E} | `111001001001` |
| 1010 | 6 | Unnamed / mathematical 12-TET collection | C E F♯ A A♯ B | 4-2-3-1-1-1 | {0,4,6,9,T,E} | `111001010001` |
| 1011 | 6 | Unnamed / mathematical 12-TET collection | C F F♯ A A♯ B | 5-1-3-1-1-1 | {0,5,6,9,T,E} | `111001100001` |
| 1012 | 6 | Unnamed / mathematical 12-TET collection | C C♯ G A A♯ B | 1-6-2-1-1-1 | {0,1,7,9,T,E} | `111010000011` |
| 1013 | 6 | Unnamed / mathematical 12-TET collection | C D G A A♯ B | 2-5-2-1-1-1 | {0,2,7,9,T,E} | `111010000101` |
| 1014 | 6 | Unnamed / mathematical 12-TET collection | C D♯ G A A♯ B | 3-4-2-1-1-1 | {0,3,7,9,T,E} | `111010001001` |
| 1015 | 6 | Unnamed / mathematical 12-TET collection | C E G A A♯ B | 4-3-2-1-1-1 | {0,4,7,9,T,E} | `111010010001` |
| 1016 | 6 | Unnamed / mathematical 12-TET collection | C F G A A♯ B | 5-2-2-1-1-1 | {0,5,7,9,T,E} | `111010100001` |
| 1017 | 6 | Unnamed / mathematical 12-TET collection | C F♯ G A A♯ B | 6-1-2-1-1-1 | {0,6,7,9,T,E} | `111011000001` |
| 1018 | 6 | Unnamed / mathematical 12-TET collection | C C♯ G♯ A A♯ B | 1-7-1-1-1-1 | {0,1,8,9,T,E} | `111100000011` |
| 1019 | 6 | Unnamed / mathematical 12-TET collection | C D G♯ A A♯ B | 2-6-1-1-1-1 | {0,2,8,9,T,E} | `111100000101` |
| 1020 | 6 | Unnamed / mathematical 12-TET collection | C D♯ G♯ A A♯ B | 3-5-1-1-1-1 | {0,3,8,9,T,E} | `111100001001` |
| 1021 | 6 | Unnamed / mathematical 12-TET collection | C E G♯ A A♯ B | 4-4-1-1-1-1 | {0,4,8,9,T,E} | `111100010001` |
| 1022 | 6 | Unnamed / mathematical 12-TET collection | C F G♯ A A♯ B | 5-3-1-1-1-1 | {0,5,8,9,T,E} | `111100100001` |
| 1023 | 6 | Unnamed / mathematical 12-TET collection | C F♯ G♯ A A♯ B | 6-2-1-1-1-1 | {0,6,8,9,T,E} | `111101000001` |
| 1024 | 6 | Unnamed / mathematical 12-TET collection | C G G♯ A A♯ B | 7-1-1-1-1-1 | {0,7,8,9,T,E} | `111110000001` |
| 1025 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ | 1-1-1-1-1-1-6 | {0,1,2,3,4,5,6} | `000001111111` |
| 1026 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G | 1-1-1-1-1-2-5 | {0,1,2,3,4,5,7} | `000010111111` |
| 1027 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G | 1-1-1-1-2-1-5 | {0,1,2,3,4,6,7} | `000011011111` |
| 1028 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G | 1-1-1-2-1-1-5 | {0,1,2,3,5,6,7} | `000011101111` |
| 1029 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G | 1-1-2-1-1-1-5 | {0,1,2,4,5,6,7} | `000011110111` |
| 1030 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G | 1-2-1-1-1-1-5 | {0,1,3,4,5,6,7} | `000011111011` |
| 1031 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G | 2-1-1-1-1-1-5 | {0,2,3,4,5,6,7} | `000011111101` |
| 1032 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ | 1-1-1-1-1-3-4 | {0,1,2,3,4,5,8} | `000100111111` |
| 1033 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ | 1-1-1-1-2-2-4 | {0,1,2,3,4,6,8} | `000101011111` |
| 1034 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ | 1-1-1-2-1-2-4 | {0,1,2,3,5,6,8} | `000101101111` |
| 1035 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ | 1-1-2-1-1-2-4 | {0,1,2,4,5,6,8} | `000101110111` |
| 1036 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ | 1-2-1-1-1-2-4 | {0,1,3,4,5,6,8} | `000101111011` |
| 1037 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ | 2-1-1-1-1-2-4 | {0,2,3,4,5,6,8} | `000101111101` |
| 1038 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ | 1-1-1-1-3-1-4 | {0,1,2,3,4,7,8} | `000110011111` |
| 1039 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ | 1-1-1-2-2-1-4 | {0,1,2,3,5,7,8} | `000110101111` |
| 1040 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ | 1-1-2-1-2-1-4 | {0,1,2,4,5,7,8} | `000110110111` |
| 1041 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ | 1-2-1-1-2-1-4 | {0,1,3,4,5,7,8} | `000110111011` |
| 1042 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ | 2-1-1-1-2-1-4 | {0,2,3,4,5,7,8} | `000110111101` |
| 1043 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ | 1-1-1-3-1-1-4 | {0,1,2,3,6,7,8} | `000111001111` |
| 1044 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ | 1-1-2-2-1-1-4 | {0,1,2,4,6,7,8} | `000111010111` |
| 1045 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ | 1-2-1-2-1-1-4 | {0,1,3,4,6,7,8} | `000111011011` |
| 1046 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ | 2-1-1-2-1-1-4 | {0,2,3,4,6,7,8} | `000111011101` |
| 1047 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ | 1-1-3-1-1-1-4 | {0,1,2,5,6,7,8} | `000111100111` |
| 1048 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ | 1-2-2-1-1-1-4 | {0,1,3,5,6,7,8} | `000111101011` |
| 1049 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ | 2-1-2-1-1-1-4 | {0,2,3,5,6,7,8} | `000111101101` |
| 1050 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ | 1-3-1-1-1-1-4 | {0,1,4,5,6,7,8} | `000111110011` |
| 1051 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ | 2-2-1-1-1-1-4 | {0,2,4,5,6,7,8} | `000111110101` |
| 1052 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ | 3-1-1-1-1-1-4 | {0,3,4,5,6,7,8} | `000111111001` |
| 1053 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A | 1-1-1-1-1-4-3 | {0,1,2,3,4,5,9} | `001000111111` |
| 1054 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A | 1-1-1-1-2-3-3 | {0,1,2,3,4,6,9} | `001001011111` |
| 1055 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A | 1-1-1-2-1-3-3 | {0,1,2,3,5,6,9} | `001001101111` |
| 1056 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A | 1-1-2-1-1-3-3 | {0,1,2,4,5,6,9} | `001001110111` |
| 1057 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A | 1-2-1-1-1-3-3 | {0,1,3,4,5,6,9} | `001001111011` |
| 1058 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A | 2-1-1-1-1-3-3 | {0,2,3,4,5,6,9} | `001001111101` |
| 1059 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A | 1-1-1-1-3-2-3 | {0,1,2,3,4,7,9} | `001010011111` |
| 1060 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A | 1-1-1-2-2-2-3 | {0,1,2,3,5,7,9} | `001010101111` |
| 1061 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A | 1-1-2-1-2-2-3 | {0,1,2,4,5,7,9} | `001010110111` |
| 1062 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A | 1-2-1-1-2-2-3 | {0,1,3,4,5,7,9} | `001010111011` |
| 1063 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A | 2-1-1-1-2-2-3 | {0,2,3,4,5,7,9} | `001010111101` |
| 1064 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A | 1-1-1-3-1-2-3 | {0,1,2,3,6,7,9} | `001011001111` |
| 1065 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G A | 1-1-2-2-1-2-3 | {0,1,2,4,6,7,9} | `001011010111` |
| 1066 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G A | 1-2-1-2-1-2-3 | {0,1,3,4,6,7,9} | `001011011011` |
| 1067 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A | 2-1-1-2-1-2-3 | {0,2,3,4,6,7,9} | `001011011101` |
| 1068 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A | 1-1-3-1-1-2-3 | {0,1,2,5,6,7,9} | `001011100111` |
| 1069 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A | 1-2-2-1-1-2-3 | {0,1,3,5,6,7,9} | `001011101011` |
| 1070 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A | 2-1-2-1-1-2-3 | {0,2,3,5,6,7,9} | `001011101101` |
| 1071 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A | 1-3-1-1-1-2-3 | {0,1,4,5,6,7,9} | `001011110011` |
| 1072 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A | 2-2-1-1-1-2-3 | {0,2,4,5,6,7,9} | `001011110101` |
| 1073 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A | 3-1-1-1-1-2-3 | {0,3,4,5,6,7,9} | `001011111001` |
| 1074 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A | 1-1-1-1-4-1-3 | {0,1,2,3,4,8,9} | `001100011111` |
| 1075 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A | 1-1-1-2-3-1-3 | {0,1,2,3,5,8,9} | `001100101111` |
| 1076 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A | 1-1-2-1-3-1-3 | {0,1,2,4,5,8,9} | `001100110111` |
| 1077 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A | 1-2-1-1-3-1-3 | {0,1,3,4,5,8,9} | `001100111011` |
| 1078 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A | 2-1-1-1-3-1-3 | {0,2,3,4,5,8,9} | `001100111101` |
| 1079 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A | 1-1-1-3-2-1-3 | {0,1,2,3,6,8,9} | `001101001111` |
| 1080 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A | 1-1-2-2-2-1-3 | {0,1,2,4,6,8,9} | `001101010111` |
| 1081 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ A | 1-2-1-2-2-1-3 | {0,1,3,4,6,8,9} | `001101011011` |
| 1082 | 7 | Messiaen Mode 3 (one common transposition) | C D D♯ E F♯ G♯ A | 2-1-1-2-2-1-3 | {0,2,3,4,6,8,9} | `001101011101` |
| 1083 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A | 1-1-3-1-2-1-3 | {0,1,2,5,6,8,9} | `001101100111` |
| 1084 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ A | 1-2-2-1-2-1-3 | {0,1,3,5,6,8,9} | `001101101011` |
| 1085 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ A | 2-1-2-1-2-1-3 | {0,2,3,5,6,8,9} | `001101101101` |
| 1086 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A | 1-3-1-1-2-1-3 | {0,1,4,5,6,8,9} | `001101110011` |
| 1087 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A | 2-2-1-1-2-1-3 | {0,2,4,5,6,8,9} | `001101110101` |
| 1088 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A | 3-1-1-1-2-1-3 | {0,3,4,5,6,8,9} | `001101111001` |
| 1089 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A | 1-1-1-4-1-1-3 | {0,1,2,3,7,8,9} | `001110001111` |
| 1090 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A | 1-1-2-3-1-1-3 | {0,1,2,4,7,8,9} | `001110010111` |
| 1091 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A | 1-2-1-3-1-1-3 | {0,1,3,4,7,8,9} | `001110011011` |
| 1092 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A | 2-1-1-3-1-1-3 | {0,2,3,4,7,8,9} | `001110011101` |
| 1093 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A | 1-1-3-2-1-1-3 | {0,1,2,5,7,8,9} | `001110100111` |
| 1094 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ A | 1-2-2-2-1-1-3 | {0,1,3,5,7,8,9} | `001110101011` |
| 1095 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F G G♯ A | 2-1-2-2-1-1-3 | {0,2,3,5,7,8,9} | `001110101101` |
| 1096 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ A | 1-3-1-2-1-1-3 | {0,1,4,5,7,8,9} | `001110110011` |
| 1097 | 7 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A | 2-2-1-2-1-1-3 | {0,2,4,5,7,8,9} | `001110110101` |
| 1098 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A | 3-1-1-2-1-1-3 | {0,3,4,5,7,8,9} | `001110111001` |
| 1099 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A | 1-1-4-1-1-1-3 | {0,1,2,6,7,8,9} | `001111000111` |
| 1100 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A | 1-2-3-1-1-1-3 | {0,1,3,6,7,8,9} | `001111001011` |
| 1101 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A | 2-1-3-1-1-1-3 | {0,2,3,6,7,8,9} | `001111001101` |
| 1102 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A | 1-3-2-1-1-1-3 | {0,1,4,6,7,8,9} | `001111010011` |
| 1103 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A | 2-2-2-1-1-1-3 | {0,2,4,6,7,8,9} | `001111010101` |
| 1104 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A | 3-1-2-1-1-1-3 | {0,3,4,6,7,8,9} | `001111011001` |
| 1105 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A | 1-4-1-1-1-1-3 | {0,1,5,6,7,8,9} | `001111100011` |
| 1106 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A | 2-3-1-1-1-1-3 | {0,2,5,6,7,8,9} | `001111100101` |
| 1107 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A | 3-2-1-1-1-1-3 | {0,3,5,6,7,8,9} | `001111101001` |
| 1108 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A | 4-1-1-1-1-1-3 | {0,4,5,6,7,8,9} | `001111110001` |
| 1109 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A♯ | 1-1-1-1-1-5-2 | {0,1,2,3,4,5,T} | `010000111111` |
| 1110 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A♯ | 1-1-1-1-2-4-2 | {0,1,2,3,4,6,T} | `010001011111` |
| 1111 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A♯ | 1-1-1-2-1-4-2 | {0,1,2,3,5,6,T} | `010001101111` |
| 1112 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A♯ | 1-1-2-1-1-4-2 | {0,1,2,4,5,6,T} | `010001110111` |
| 1113 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A♯ | 1-2-1-1-1-4-2 | {0,1,3,4,5,6,T} | `010001111011` |
| 1114 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A♯ | 2-1-1-1-1-4-2 | {0,2,3,4,5,6,T} | `010001111101` |
| 1115 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A♯ | 1-1-1-1-3-3-2 | {0,1,2,3,4,7,T} | `010010011111` |
| 1116 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A♯ | 1-1-1-2-2-3-2 | {0,1,2,3,5,7,T} | `010010101111` |
| 1117 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A♯ | 1-1-2-1-2-3-2 | {0,1,2,4,5,7,T} | `010010110111` |
| 1118 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A♯ | 1-2-1-1-2-3-2 | {0,1,3,4,5,7,T} | `010010111011` |
| 1119 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A♯ | 2-1-1-1-2-3-2 | {0,2,3,4,5,7,T} | `010010111101` |
| 1120 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A♯ | 1-1-1-3-1-3-2 | {0,1,2,3,6,7,T} | `010011001111` |
| 1121 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G A♯ | 1-1-2-2-1-3-2 | {0,1,2,4,6,7,T} | `010011010111` |
| 1122 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G A♯ | 1-2-1-2-1-3-2 | {0,1,3,4,6,7,T} | `010011011011` |
| 1123 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A♯ | 2-1-1-2-1-3-2 | {0,2,3,4,6,7,T} | `010011011101` |
| 1124 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A♯ | 1-1-3-1-1-3-2 | {0,1,2,5,6,7,T} | `010011100111` |
| 1125 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A♯ | 1-2-2-1-1-3-2 | {0,1,3,5,6,7,T} | `010011101011` |
| 1126 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A♯ | 2-1-2-1-1-3-2 | {0,2,3,5,6,7,T} | `010011101101` |
| 1127 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A♯ | 1-3-1-1-1-3-2 | {0,1,4,5,6,7,T} | `010011110011` |
| 1128 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A♯ | 2-2-1-1-1-3-2 | {0,2,4,5,6,7,T} | `010011110101` |
| 1129 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A♯ | 3-1-1-1-1-3-2 | {0,3,4,5,6,7,T} | `010011111001` |
| 1130 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A♯ | 1-1-1-1-4-2-2 | {0,1,2,3,4,8,T} | `010100011111` |
| 1131 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A♯ | 1-1-1-2-3-2-2 | {0,1,2,3,5,8,T} | `010100101111` |
| 1132 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A♯ | 1-1-2-1-3-2-2 | {0,1,2,4,5,8,T} | `010100110111` |
| 1133 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A♯ | 1-2-1-1-3-2-2 | {0,1,3,4,5,8,T} | `010100111011` |
| 1134 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A♯ | 2-1-1-1-3-2-2 | {0,2,3,4,5,8,T} | `010100111101` |
| 1135 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A♯ | 1-1-1-3-2-2-2 | {0,1,2,3,6,8,T} | `010101001111` |
| 1136 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A♯ | 1-1-2-2-2-2-2 | {0,1,2,4,6,8,T} | `010101010111` |
| 1137 | 7 | Half-Whole Diminished | C C♯ D♯ E F♯ G♯ A♯ | 1-2-1-2-2-2-2 | {0,1,3,4,6,8,T} | `010101011011` |
| 1138 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ A♯ | 2-1-1-2-2-2-2 | {0,2,3,4,6,8,T} | `010101011101` |
| 1139 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A♯ | 1-1-3-1-2-2-2 | {0,1,2,5,6,8,T} | `010101100111` |
| 1140 | 7 | Locrian | C C♯ D♯ F F♯ G♯ A♯ | 1-2-2-1-2-2-2 | {0,1,3,5,6,8,T} | `010101101011` |
| 1141 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ A♯ | 2-1-2-1-2-2-2 | {0,2,3,5,6,8,T} | `010101101101` |
| 1142 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A♯ | 1-3-1-1-2-2-2 | {0,1,4,5,6,8,T} | `010101110011` |
| 1143 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A♯ | 2-2-1-1-2-2-2 | {0,2,4,5,6,8,T} | `010101110101` |
| 1144 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A♯ | 3-1-1-1-2-2-2 | {0,3,4,5,6,8,T} | `010101111001` |
| 1145 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A♯ | 1-1-1-4-1-2-2 | {0,1,2,3,7,8,T} | `010110001111` |
| 1146 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A♯ | 1-1-2-3-1-2-2 | {0,1,2,4,7,8,T} | `010110010111` |
| 1147 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A♯ | 1-2-1-3-1-2-2 | {0,1,3,4,7,8,T} | `010110011011` |
| 1148 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A♯ | 2-1-1-3-1-2-2 | {0,2,3,4,7,8,T} | `010110011101` |
| 1149 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A♯ | 1-1-3-2-1-2-2 | {0,1,2,5,7,8,T} | `010110100111` |
| 1150 | 7 | Phrygian | C C♯ D♯ F G G♯ A♯ | 1-2-2-2-1-2-2 | {0,1,3,5,7,8,T} | `010110101011` |
| 1151 | 7 | Aeolian / Natural Minor | C D D♯ F G G♯ A♯ | 2-1-2-2-1-2-2 | {0,2,3,5,7,8,T} | `010110101101` |
| 1152 | 7 | Double Harmonic Major / Byzantine | C C♯ E F G G♯ A♯ | 1-3-1-2-1-2-2 | {0,1,4,5,7,8,T} | `010110110011` |
| 1153 | 7 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A♯ | 2-2-1-2-1-2-2 | {0,2,4,5,7,8,T} | `010110110101` |
| 1154 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A♯ | 3-1-1-2-1-2-2 | {0,3,4,5,7,8,T} | `010110111001` |
| 1155 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A♯ | 1-1-4-1-1-2-2 | {0,1,2,6,7,8,T} | `010111000111` |
| 1156 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A♯ | 1-2-3-1-1-2-2 | {0,1,3,6,7,8,T} | `010111001011` |
| 1157 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A♯ | 2-1-3-1-1-2-2 | {0,2,3,6,7,8,T} | `010111001101` |
| 1158 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A♯ | 1-3-2-1-1-2-2 | {0,1,4,6,7,8,T} | `010111010011` |
| 1159 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A♯ | 2-2-2-1-1-2-2 | {0,2,4,6,7,8,T} | `010111010101` |
| 1160 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A♯ | 3-1-2-1-1-2-2 | {0,3,4,6,7,8,T} | `010111011001` |
| 1161 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A♯ | 1-4-1-1-1-2-2 | {0,1,5,6,7,8,T} | `010111100011` |
| 1162 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A♯ | 2-3-1-1-1-2-2 | {0,2,5,6,7,8,T} | `010111100101` |
| 1163 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A♯ | 3-2-1-1-1-2-2 | {0,3,5,6,7,8,T} | `010111101001` |
| 1164 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A♯ | 4-1-1-1-1-2-2 | {0,4,5,6,7,8,T} | `010111110001` |
| 1165 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A A♯ | 1-1-1-1-5-1-2 | {0,1,2,3,4,9,T} | `011000011111` |
| 1166 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A A♯ | 1-1-1-2-4-1-2 | {0,1,2,3,5,9,T} | `011000101111` |
| 1167 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F A A♯ | 1-1-2-1-4-1-2 | {0,1,2,4,5,9,T} | `011000110111` |
| 1168 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A A♯ | 1-2-1-1-4-1-2 | {0,1,3,4,5,9,T} | `011000111011` |
| 1169 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F A A♯ | 2-1-1-1-4-1-2 | {0,2,3,4,5,9,T} | `011000111101` |
| 1170 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A A♯ | 1-1-1-3-3-1-2 | {0,1,2,3,6,9,T} | `011001001111` |
| 1171 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A A♯ | 1-1-2-2-3-1-2 | {0,1,2,4,6,9,T} | `011001010111` |
| 1172 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A A♯ | 1-2-1-2-3-1-2 | {0,1,3,4,6,9,T} | `011001011011` |
| 1173 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A A♯ | 2-1-1-2-3-1-2 | {0,2,3,4,6,9,T} | `011001011101` |
| 1174 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A A♯ | 1-1-3-1-3-1-2 | {0,1,2,5,6,9,T} | `011001100111` |
| 1175 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A A♯ | 1-2-2-1-3-1-2 | {0,1,3,5,6,9,T} | `011001101011` |
| 1176 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A A♯ | 2-1-2-1-3-1-2 | {0,2,3,5,6,9,T} | `011001101101` |
| 1177 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A A♯ | 1-3-1-1-3-1-2 | {0,1,4,5,6,9,T} | `011001110011` |
| 1178 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ A A♯ | 2-2-1-1-3-1-2 | {0,2,4,5,6,9,T} | `011001110101` |
| 1179 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A A♯ | 3-1-1-1-3-1-2 | {0,3,4,5,6,9,T} | `011001111001` |
| 1180 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A A♯ | 1-1-1-4-2-1-2 | {0,1,2,3,7,9,T} | `011010001111` |
| 1181 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G A A♯ | 1-1-2-3-2-1-2 | {0,1,2,4,7,9,T} | `011010010111` |
| 1182 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A A♯ | 1-2-1-3-2-1-2 | {0,1,3,4,7,9,T} | `011010011011` |
| 1183 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G A A♯ | 2-1-1-3-2-1-2 | {0,2,3,4,7,9,T} | `011010011101` |
| 1184 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G A A♯ | 1-1-3-2-2-1-2 | {0,1,2,5,7,9,T} | `011010100111` |
| 1185 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G A A♯ | 1-2-2-2-2-1-2 | {0,1,3,5,7,9,T} | `011010101011` |
| 1186 | 7 | Dorian | C D D♯ F G A A♯ | 2-1-2-2-2-1-2 | {0,2,3,5,7,9,T} | `011010101101` |
| 1187 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G A A♯ | 1-3-1-2-2-1-2 | {0,1,4,5,7,9,T} | `011010110011` |
| 1188 | 7 | Mixolydian | C D E F G A A♯ | 2-2-1-2-2-1-2 | {0,2,4,5,7,9,T} | `011010110101` |
| 1189 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G A A♯ | 3-1-1-2-2-1-2 | {0,3,4,5,7,9,T} | `011010111001` |
| 1190 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A A♯ | 1-1-4-1-2-1-2 | {0,1,2,6,7,9,T} | `011011000111` |
| 1191 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G A A♯ | 1-2-3-1-2-1-2 | {0,1,3,6,7,9,T} | `011011001011` |
| 1192 | 7 | Romanian Minor / Ukrainian Dorian | C D D♯ F♯ G A A♯ | 2-1-3-1-2-1-2 | {0,2,3,6,7,9,T} | `011011001101` |
| 1193 | 7 | Enigmatic-type collection | C C♯ E F♯ G A A♯ | 1-3-2-1-2-1-2 | {0,1,4,6,7,9,T} | `011011010011` |
| 1194 | 7 | Lydian Dominant | C D E F♯ G A A♯ | 2-2-2-1-2-1-2 | {0,2,4,6,7,9,T} | `011011010101` |
| 1195 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A A♯ | 3-1-2-1-2-1-2 | {0,3,4,6,7,9,T} | `011011011001` |
| 1196 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A A♯ | 1-4-1-1-2-1-2 | {0,1,5,6,7,9,T} | `011011100011` |
| 1197 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G A A♯ | 2-3-1-1-2-1-2 | {0,2,5,6,7,9,T} | `011011100101` |
| 1198 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G A A♯ | 3-2-1-1-2-1-2 | {0,3,5,6,7,9,T} | `011011101001` |
| 1199 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G A A♯ | 4-1-1-1-2-1-2 | {0,4,5,6,7,9,T} | `011011110001` |
| 1200 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A A♯ | 1-1-1-5-1-1-2 | {0,1,2,3,8,9,T} | `011100001111` |
| 1201 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A A♯ | 1-1-2-4-1-1-2 | {0,1,2,4,8,9,T} | `011100010111` |
| 1202 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A A♯ | 1-2-1-4-1-1-2 | {0,1,3,4,8,9,T} | `011100011011` |
| 1203 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A A♯ | 2-1-1-4-1-1-2 | {0,2,3,4,8,9,T} | `011100011101` |
| 1204 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A A♯ | 1-1-3-3-1-1-2 | {0,1,2,5,8,9,T} | `011100100111` |
| 1205 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A A♯ | 1-2-2-3-1-1-2 | {0,1,3,5,8,9,T} | `011100101011` |
| 1206 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A A♯ | 2-1-2-3-1-1-2 | {0,2,3,5,8,9,T} | `011100101101` |
| 1207 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A A♯ | 1-3-1-3-1-1-2 | {0,1,4,5,8,9,T} | `011100110011` |
| 1208 | 7 | Unnamed / mathematical 12-TET collection | C D E F G♯ A A♯ | 2-2-1-3-1-1-2 | {0,2,4,5,8,9,T} | `011100110101` |
| 1209 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A A♯ | 3-1-1-3-1-1-2 | {0,3,4,5,8,9,T} | `011100111001` |
| 1210 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A A♯ | 1-1-4-2-1-1-2 | {0,1,2,6,8,9,T} | `011101000111` |
| 1211 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A A♯ | 1-2-3-2-1-1-2 | {0,1,3,6,8,9,T} | `011101001011` |
| 1212 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A A♯ | 2-1-3-2-1-1-2 | {0,2,3,6,8,9,T} | `011101001101` |
| 1213 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A A♯ | 1-3-2-2-1-1-2 | {0,1,4,6,8,9,T} | `011101010011` |
| 1214 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ A A♯ | 2-2-2-2-1-1-2 | {0,2,4,6,8,9,T} | `011101010101` |
| 1215 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A A♯ | 3-1-2-2-1-1-2 | {0,3,4,6,8,9,T} | `011101011001` |
| 1216 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A A♯ | 1-4-1-2-1-1-2 | {0,1,5,6,8,9,T} | `011101100011` |
| 1217 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A A♯ | 2-3-1-2-1-1-2 | {0,2,5,6,8,9,T} | `011101100101` |
| 1218 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A A♯ | 3-2-1-2-1-1-2 | {0,3,5,6,8,9,T} | `011101101001` |
| 1219 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A A♯ | 4-1-1-2-1-1-2 | {0,4,5,6,8,9,T} | `011101110001` |
| 1220 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A A♯ | 1-1-5-1-1-1-2 | {0,1,2,7,8,9,T} | `011110000111` |
| 1221 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A A♯ | 1-2-4-1-1-1-2 | {0,1,3,7,8,9,T} | `011110001011` |
| 1222 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A A♯ | 2-1-4-1-1-1-2 | {0,2,3,7,8,9,T} | `011110001101` |
| 1223 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A A♯ | 1-3-3-1-1-1-2 | {0,1,4,7,8,9,T} | `011110010011` |
| 1224 | 7 | Unnamed / mathematical 12-TET collection | C D E G G♯ A A♯ | 2-2-3-1-1-1-2 | {0,2,4,7,8,9,T} | `011110010101` |
| 1225 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A A♯ | 3-1-3-1-1-1-2 | {0,3,4,7,8,9,T} | `011110011001` |
| 1226 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A A♯ | 1-4-2-1-1-1-2 | {0,1,5,7,8,9,T} | `011110100011` |
| 1227 | 7 | Unnamed / mathematical 12-TET collection | C D F G G♯ A A♯ | 2-3-2-1-1-1-2 | {0,2,5,7,8,9,T} | `011110100101` |
| 1228 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A A♯ | 3-2-2-1-1-1-2 | {0,3,5,7,8,9,T} | `011110101001` |
| 1229 | 7 | Unnamed / mathematical 12-TET collection | C E F G G♯ A A♯ | 4-1-2-1-1-1-2 | {0,4,5,7,8,9,T} | `011110110001` |
| 1230 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A A♯ | 1-5-1-1-1-1-2 | {0,1,6,7,8,9,T} | `011111000011` |
| 1231 | 7 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A A♯ | 2-4-1-1-1-1-2 | {0,2,6,7,8,9,T} | `011111000101` |
| 1232 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A A♯ | 3-3-1-1-1-1-2 | {0,3,6,7,8,9,T} | `011111001001` |
| 1233 | 7 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A A♯ | 4-2-1-1-1-1-2 | {0,4,6,7,8,9,T} | `011111010001` |
| 1234 | 7 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A A♯ | 5-1-1-1-1-1-2 | {0,5,6,7,8,9,T} | `011111100001` |
| 1235 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F B | 1-1-1-1-1-6-1 | {0,1,2,3,4,5,E} | `100000111111` |
| 1236 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ B | 1-1-1-1-2-5-1 | {0,1,2,3,4,6,E} | `100001011111` |
| 1237 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ B | 1-1-1-2-1-5-1 | {0,1,2,3,5,6,E} | `100001101111` |
| 1238 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ B | 1-1-2-1-1-5-1 | {0,1,2,4,5,6,E} | `100001110111` |
| 1239 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ B | 1-2-1-1-1-5-1 | {0,1,3,4,5,6,E} | `100001111011` |
| 1240 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ B | 2-1-1-1-1-5-1 | {0,2,3,4,5,6,E} | `100001111101` |
| 1241 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G B | 1-1-1-1-3-4-1 | {0,1,2,3,4,7,E} | `100010011111` |
| 1242 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G B | 1-1-1-2-2-4-1 | {0,1,2,3,5,7,E} | `100010101111` |
| 1243 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G B | 1-1-2-1-2-4-1 | {0,1,2,4,5,7,E} | `100010110111` |
| 1244 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G B | 1-2-1-1-2-4-1 | {0,1,3,4,5,7,E} | `100010111011` |
| 1245 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G B | 2-1-1-1-2-4-1 | {0,2,3,4,5,7,E} | `100010111101` |
| 1246 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G B | 1-1-1-3-1-4-1 | {0,1,2,3,6,7,E} | `100011001111` |
| 1247 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G B | 1-1-2-2-1-4-1 | {0,1,2,4,6,7,E} | `100011010111` |
| 1248 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G B | 1-2-1-2-1-4-1 | {0,1,3,4,6,7,E} | `100011011011` |
| 1249 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G B | 2-1-1-2-1-4-1 | {0,2,3,4,6,7,E} | `100011011101` |
| 1250 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G B | 1-1-3-1-1-4-1 | {0,1,2,5,6,7,E} | `100011100111` |
| 1251 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G B | 1-2-2-1-1-4-1 | {0,1,3,5,6,7,E} | `100011101011` |
| 1252 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G B | 2-1-2-1-1-4-1 | {0,2,3,5,6,7,E} | `100011101101` |
| 1253 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G B | 1-3-1-1-1-4-1 | {0,1,4,5,6,7,E} | `100011110011` |
| 1254 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G B | 2-2-1-1-1-4-1 | {0,2,4,5,6,7,E} | `100011110101` |
| 1255 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G B | 3-1-1-1-1-4-1 | {0,3,4,5,6,7,E} | `100011111001` |
| 1256 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ B | 1-1-1-1-4-3-1 | {0,1,2,3,4,8,E} | `100100011111` |
| 1257 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ B | 1-1-1-2-3-3-1 | {0,1,2,3,5,8,E} | `100100101111` |
| 1258 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ B | 1-1-2-1-3-3-1 | {0,1,2,4,5,8,E} | `100100110111` |
| 1259 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ B | 1-2-1-1-3-3-1 | {0,1,3,4,5,8,E} | `100100111011` |
| 1260 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ B | 2-1-1-1-3-3-1 | {0,2,3,4,5,8,E} | `100100111101` |
| 1261 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ B | 1-1-1-3-2-3-1 | {0,1,2,3,6,8,E} | `100101001111` |
| 1262 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ B | 1-1-2-2-2-3-1 | {0,1,2,4,6,8,E} | `100101010111` |
| 1263 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ B | 1-2-1-2-2-3-1 | {0,1,3,4,6,8,E} | `100101011011` |
| 1264 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ B | 2-1-1-2-2-3-1 | {0,2,3,4,6,8,E} | `100101011101` |
| 1265 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ B | 1-1-3-1-2-3-1 | {0,1,2,5,6,8,E} | `100101100111` |
| 1266 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ B | 1-2-2-1-2-3-1 | {0,1,3,5,6,8,E} | `100101101011` |
| 1267 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ B | 2-1-2-1-2-3-1 | {0,2,3,5,6,8,E} | `100101101101` |
| 1268 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ B | 1-3-1-1-2-3-1 | {0,1,4,5,6,8,E} | `100101110011` |
| 1269 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ B | 2-2-1-1-2-3-1 | {0,2,4,5,6,8,E} | `100101110101` |
| 1270 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ B | 3-1-1-1-2-3-1 | {0,3,4,5,6,8,E} | `100101111001` |
| 1271 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ B | 1-1-1-4-1-3-1 | {0,1,2,3,7,8,E} | `100110001111` |
| 1272 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ B | 1-1-2-3-1-3-1 | {0,1,2,4,7,8,E} | `100110010111` |
| 1273 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ B | 1-2-1-3-1-3-1 | {0,1,3,4,7,8,E} | `100110011011` |
| 1274 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ B | 2-1-1-3-1-3-1 | {0,2,3,4,7,8,E} | `100110011101` |
| 1275 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ B | 1-1-3-2-1-3-1 | {0,1,2,5,7,8,E} | `100110100111` |
| 1276 | 7 | Neapolitan Minor | C C♯ D♯ F G G♯ B | 1-2-2-2-1-3-1 | {0,1,3,5,7,8,E} | `100110101011` |
| 1277 | 7 | Harmonic Minor | C D D♯ F G G♯ B | 2-1-2-2-1-3-1 | {0,2,3,5,7,8,E} | `100110101101` |
| 1278 | 7 | Spanish / Flamenco / Phrygian-Dominant family | C C♯ E F G G♯ B | 1-3-1-2-1-3-1 | {0,1,4,5,7,8,E} | `100110110011` |
| 1279 | 7 | Harmonic Major | C D E F G G♯ B | 2-2-1-2-1-3-1 | {0,2,4,5,7,8,E} | `100110110101` |
| 1280 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ B | 3-1-1-2-1-3-1 | {0,3,4,5,7,8,E} | `100110111001` |
| 1281 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ B | 1-1-4-1-1-3-1 | {0,1,2,6,7,8,E} | `100111000111` |
| 1282 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ B | 1-2-3-1-1-3-1 | {0,1,3,6,7,8,E} | `100111001011` |
| 1283 | 7 | Hungarian Minor | C D D♯ F♯ G G♯ B | 2-1-3-1-1-3-1 | {0,2,3,6,7,8,E} | `100111001101` |
| 1284 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ B | 1-3-2-1-1-3-1 | {0,1,4,6,7,8,E} | `100111010011` |
| 1285 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ B | 2-2-2-1-1-3-1 | {0,2,4,6,7,8,E} | `100111010101` |
| 1286 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ B | 3-1-2-1-1-3-1 | {0,3,4,6,7,8,E} | `100111011001` |
| 1287 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ B | 1-4-1-1-1-3-1 | {0,1,5,6,7,8,E} | `100111100011` |
| 1288 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ B | 2-3-1-1-1-3-1 | {0,2,5,6,7,8,E} | `100111100101` |
| 1289 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ B | 3-2-1-1-1-3-1 | {0,3,5,6,7,8,E} | `100111101001` |
| 1290 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ B | 4-1-1-1-1-3-1 | {0,4,5,6,7,8,E} | `100111110001` |
| 1291 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A B | 1-1-1-1-5-2-1 | {0,1,2,3,4,9,E} | `101000011111` |
| 1292 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A B | 1-1-1-2-4-2-1 | {0,1,2,3,5,9,E} | `101000101111` |
| 1293 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F A B | 1-1-2-1-4-2-1 | {0,1,2,4,5,9,E} | `101000110111` |
| 1294 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A B | 1-2-1-1-4-2-1 | {0,1,3,4,5,9,E} | `101000111011` |
| 1295 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F A B | 2-1-1-1-4-2-1 | {0,2,3,4,5,9,E} | `101000111101` |
| 1296 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A B | 1-1-1-3-3-2-1 | {0,1,2,3,6,9,E} | `101001001111` |
| 1297 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A B | 1-1-2-2-3-2-1 | {0,1,2,4,6,9,E} | `101001010111` |
| 1298 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A B | 1-2-1-2-3-2-1 | {0,1,3,4,6,9,E} | `101001011011` |
| 1299 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A B | 2-1-1-2-3-2-1 | {0,2,3,4,6,9,E} | `101001011101` |
| 1300 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A B | 1-1-3-1-3-2-1 | {0,1,2,5,6,9,E} | `101001100111` |
| 1301 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A B | 1-2-2-1-3-2-1 | {0,1,3,5,6,9,E} | `101001101011` |
| 1302 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A B | 2-1-2-1-3-2-1 | {0,2,3,5,6,9,E} | `101001101101` |
| 1303 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A B | 1-3-1-1-3-2-1 | {0,1,4,5,6,9,E} | `101001110011` |
| 1304 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ A B | 2-2-1-1-3-2-1 | {0,2,4,5,6,9,E} | `101001110101` |
| 1305 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A B | 3-1-1-1-3-2-1 | {0,3,4,5,6,9,E} | `101001111001` |
| 1306 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A B | 1-1-1-4-2-2-1 | {0,1,2,3,7,9,E} | `101010001111` |
| 1307 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G A B | 1-1-2-3-2-2-1 | {0,1,2,4,7,9,E} | `101010010111` |
| 1308 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A B | 1-2-1-3-2-2-1 | {0,1,3,4,7,9,E} | `101010011011` |
| 1309 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G A B | 2-1-1-3-2-2-1 | {0,2,3,4,7,9,E} | `101010011101` |
| 1310 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G A B | 1-1-3-2-2-2-1 | {0,1,2,5,7,9,E} | `101010100111` |
| 1311 | 7 | Phrygian ♮6 / related modal collection | C C♯ D♯ F G A B | 1-2-2-2-2-2-1 | {0,1,3,5,7,9,E} | `101010101011` |
| 1312 | 7 | Melodic Minor / Jazz Minor | C D D♯ F G A B | 2-1-2-2-2-2-1 | {0,2,3,5,7,9,E} | `101010101101` |
| 1313 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G A B | 1-3-1-2-2-2-1 | {0,1,4,5,7,9,E} | `101010110011` |
| 1314 | 7 | Major / Ionian | C D E F G A B | 2-2-1-2-2-2-1 | {0,2,4,5,7,9,E} | `101010110101` |
| 1315 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G A B | 3-1-1-2-2-2-1 | {0,3,4,5,7,9,E} | `101010111001` |
| 1316 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A B | 1-1-4-1-2-2-1 | {0,1,2,6,7,9,E} | `101011000111` |
| 1317 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G A B | 1-2-3-1-2-2-1 | {0,1,3,6,7,9,E} | `101011001011` |
| 1318 | 7 | Dorian ♯4 / Romanian-family collection | C D D♯ F♯ G A B | 2-1-3-1-2-2-1 | {0,2,3,6,7,9,E} | `101011001101` |
| 1319 | 7 | Hungarian / Byzantine-type collection | C C♯ E F♯ G A B | 1-3-2-1-2-2-1 | {0,1,4,6,7,9,E} | `101011010011` |
| 1320 | 7 | Lydian | C D E F♯ G A B | 2-2-2-1-2-2-1 | {0,2,4,6,7,9,E} | `101011010101` |
| 1321 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A B | 3-1-2-1-2-2-1 | {0,3,4,6,7,9,E} | `101011011001` |
| 1322 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A B | 1-4-1-1-2-2-1 | {0,1,5,6,7,9,E} | `101011100011` |
| 1323 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G A B | 2-3-1-1-2-2-1 | {0,2,5,6,7,9,E} | `101011100101` |
| 1324 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G A B | 3-2-1-1-2-2-1 | {0,3,5,6,7,9,E} | `101011101001` |
| 1325 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G A B | 4-1-1-1-2-2-1 | {0,4,5,6,7,9,E} | `101011110001` |
| 1326 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A B | 1-1-1-5-1-2-1 | {0,1,2,3,8,9,E} | `101100001111` |
| 1327 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A B | 1-1-2-4-1-2-1 | {0,1,2,4,8,9,E} | `101100010111` |
| 1328 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A B | 1-2-1-4-1-2-1 | {0,1,3,4,8,9,E} | `101100011011` |
| 1329 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A B | 2-1-1-4-1-2-1 | {0,2,3,4,8,9,E} | `101100011101` |
| 1330 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A B | 1-1-3-3-1-2-1 | {0,1,2,5,8,9,E} | `101100100111` |
| 1331 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A B | 1-2-2-3-1-2-1 | {0,1,3,5,8,9,E} | `101100101011` |
| 1332 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A B | 2-1-2-3-1-2-1 | {0,2,3,5,8,9,E} | `101100101101` |
| 1333 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A B | 1-3-1-3-1-2-1 | {0,1,4,5,8,9,E} | `101100110011` |
| 1334 | 7 | Unnamed / mathematical 12-TET collection | C D E F G♯ A B | 2-2-1-3-1-2-1 | {0,2,4,5,8,9,E} | `101100110101` |
| 1335 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A B | 3-1-1-3-1-2-1 | {0,3,4,5,8,9,E} | `101100111001` |
| 1336 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A B | 1-1-4-2-1-2-1 | {0,1,2,6,8,9,E} | `101101000111` |
| 1337 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A B | 1-2-3-2-1-2-1 | {0,1,3,6,8,9,E} | `101101001011` |
| 1338 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A B | 2-1-3-2-1-2-1 | {0,2,3,6,8,9,E} | `101101001101` |
| 1339 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A B | 1-3-2-2-1-2-1 | {0,1,4,6,8,9,E} | `101101010011` |
| 1340 | 7 | Messiaen Mode 6 (one common transposition) | C D E F♯ G♯ A B | 2-2-2-2-1-2-1 | {0,2,4,6,8,9,E} | `101101010101` |
| 1341 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A B | 3-1-2-2-1-2-1 | {0,3,4,6,8,9,E} | `101101011001` |
| 1342 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A B | 1-4-1-2-1-2-1 | {0,1,5,6,8,9,E} | `101101100011` |
| 1343 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A B | 2-3-1-2-1-2-1 | {0,2,5,6,8,9,E} | `101101100101` |
| 1344 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A B | 3-2-1-2-1-2-1 | {0,3,5,6,8,9,E} | `101101101001` |
| 1345 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A B | 4-1-1-2-1-2-1 | {0,4,5,6,8,9,E} | `101101110001` |
| 1346 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A B | 1-1-5-1-1-2-1 | {0,1,2,7,8,9,E} | `101110000111` |
| 1347 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A B | 1-2-4-1-1-2-1 | {0,1,3,7,8,9,E} | `101110001011` |
| 1348 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A B | 2-1-4-1-1-2-1 | {0,2,3,7,8,9,E} | `101110001101` |
| 1349 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A B | 1-3-3-1-1-2-1 | {0,1,4,7,8,9,E} | `101110010011` |
| 1350 | 7 | Unnamed / mathematical 12-TET collection | C D E G G♯ A B | 2-2-3-1-1-2-1 | {0,2,4,7,8,9,E} | `101110010101` |
| 1351 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A B | 3-1-3-1-1-2-1 | {0,3,4,7,8,9,E} | `101110011001` |
| 1352 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A B | 1-4-2-1-1-2-1 | {0,1,5,7,8,9,E} | `101110100011` |
| 1353 | 7 | Unnamed / mathematical 12-TET collection | C D F G G♯ A B | 2-3-2-1-1-2-1 | {0,2,5,7,8,9,E} | `101110100101` |
| 1354 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A B | 3-2-2-1-1-2-1 | {0,3,5,7,8,9,E} | `101110101001` |
| 1355 | 7 | Unnamed / mathematical 12-TET collection | C E F G G♯ A B | 4-1-2-1-1-2-1 | {0,4,5,7,8,9,E} | `101110110001` |
| 1356 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A B | 1-5-1-1-1-2-1 | {0,1,6,7,8,9,E} | `101111000011` |
| 1357 | 7 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A B | 2-4-1-1-1-2-1 | {0,2,6,7,8,9,E} | `101111000101` |
| 1358 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A B | 3-3-1-1-1-2-1 | {0,3,6,7,8,9,E} | `101111001001` |
| 1359 | 7 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A B | 4-2-1-1-1-2-1 | {0,4,6,7,8,9,E} | `101111010001` |
| 1360 | 7 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A B | 5-1-1-1-1-2-1 | {0,5,6,7,8,9,E} | `101111100001` |
| 1361 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A♯ B | 1-1-1-1-6-1-1 | {0,1,2,3,4,T,E} | `110000011111` |
| 1362 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A♯ B | 1-1-1-2-5-1-1 | {0,1,2,3,5,T,E} | `110000101111` |
| 1363 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F A♯ B | 1-1-2-1-5-1-1 | {0,1,2,4,5,T,E} | `110000110111` |
| 1364 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A♯ B | 1-2-1-1-5-1-1 | {0,1,3,4,5,T,E} | `110000111011` |
| 1365 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F A♯ B | 2-1-1-1-5-1-1 | {0,2,3,4,5,T,E} | `110000111101` |
| 1366 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A♯ B | 1-1-1-3-4-1-1 | {0,1,2,3,6,T,E} | `110001001111` |
| 1367 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A♯ B | 1-1-2-2-4-1-1 | {0,1,2,4,6,T,E} | `110001010111` |
| 1368 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A♯ B | 1-2-1-2-4-1-1 | {0,1,3,4,6,T,E} | `110001011011` |
| 1369 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A♯ B | 2-1-1-2-4-1-1 | {0,2,3,4,6,T,E} | `110001011101` |
| 1370 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A♯ B | 1-1-3-1-4-1-1 | {0,1,2,5,6,T,E} | `110001100111` |
| 1371 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A♯ B | 1-2-2-1-4-1-1 | {0,1,3,5,6,T,E} | `110001101011` |
| 1372 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A♯ B | 2-1-2-1-4-1-1 | {0,2,3,5,6,T,E} | `110001101101` |
| 1373 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A♯ B | 1-3-1-1-4-1-1 | {0,1,4,5,6,T,E} | `110001110011` |
| 1374 | 7 | Unnamed / mathematical 12-TET collection | C D E F F♯ A♯ B | 2-2-1-1-4-1-1 | {0,2,4,5,6,T,E} | `110001110101` |
| 1375 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A♯ B | 3-1-1-1-4-1-1 | {0,3,4,5,6,T,E} | `110001111001` |
| 1376 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A♯ B | 1-1-1-4-3-1-1 | {0,1,2,3,7,T,E} | `110010001111` |
| 1377 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G A♯ B | 1-1-2-3-3-1-1 | {0,1,2,4,7,T,E} | `110010010111` |
| 1378 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A♯ B | 1-2-1-3-3-1-1 | {0,1,3,4,7,T,E} | `110010011011` |
| 1379 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G A♯ B | 2-1-1-3-3-1-1 | {0,2,3,4,7,T,E} | `110010011101` |
| 1380 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G A♯ B | 1-1-3-2-3-1-1 | {0,1,2,5,7,T,E} | `110010100111` |
| 1381 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G A♯ B | 1-2-2-2-3-1-1 | {0,1,3,5,7,T,E} | `110010101011` |
| 1382 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F G A♯ B | 2-1-2-2-3-1-1 | {0,2,3,5,7,T,E} | `110010101101` |
| 1383 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G A♯ B | 1-3-1-2-3-1-1 | {0,1,4,5,7,T,E} | `110010110011` |
| 1384 | 7 | Unnamed / mathematical 12-TET collection | C D E F G A♯ B | 2-2-1-2-3-1-1 | {0,2,4,5,7,T,E} | `110010110101` |
| 1385 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G A♯ B | 3-1-1-2-3-1-1 | {0,3,4,5,7,T,E} | `110010111001` |
| 1386 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A♯ B | 1-1-4-1-3-1-1 | {0,1,2,6,7,T,E} | `110011000111` |
| 1387 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G A♯ B | 1-2-3-1-3-1-1 | {0,1,3,6,7,T,E} | `110011001011` |
| 1388 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G A♯ B | 2-1-3-1-3-1-1 | {0,2,3,6,7,T,E} | `110011001101` |
| 1389 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G A♯ B | 1-3-2-1-3-1-1 | {0,1,4,6,7,T,E} | `110011010011` |
| 1390 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G A♯ B | 2-2-2-1-3-1-1 | {0,2,4,6,7,T,E} | `110011010101` |
| 1391 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A♯ B | 3-1-2-1-3-1-1 | {0,3,4,6,7,T,E} | `110011011001` |
| 1392 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A♯ B | 1-4-1-1-3-1-1 | {0,1,5,6,7,T,E} | `110011100011` |
| 1393 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G A♯ B | 2-3-1-1-3-1-1 | {0,2,5,6,7,T,E} | `110011100101` |
| 1394 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G A♯ B | 3-2-1-1-3-1-1 | {0,3,5,6,7,T,E} | `110011101001` |
| 1395 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G A♯ B | 4-1-1-1-3-1-1 | {0,4,5,6,7,T,E} | `110011110001` |
| 1396 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A♯ B | 1-1-1-5-2-1-1 | {0,1,2,3,8,T,E} | `110100001111` |
| 1397 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A♯ B | 1-1-2-4-2-1-1 | {0,1,2,4,8,T,E} | `110100010111` |
| 1398 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A♯ B | 1-2-1-4-2-1-1 | {0,1,3,4,8,T,E} | `110100011011` |
| 1399 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A♯ B | 2-1-1-4-2-1-1 | {0,2,3,4,8,T,E} | `110100011101` |
| 1400 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A♯ B | 1-1-3-3-2-1-1 | {0,1,2,5,8,T,E} | `110100100111` |
| 1401 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A♯ B | 1-2-2-3-2-1-1 | {0,1,3,5,8,T,E} | `110100101011` |
| 1402 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A♯ B | 2-1-2-3-2-1-1 | {0,2,3,5,8,T,E} | `110100101101` |
| 1403 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A♯ B | 1-3-1-3-2-1-1 | {0,1,4,5,8,T,E} | `110100110011` |
| 1404 | 7 | Unnamed / mathematical 12-TET collection | C D E F G♯ A♯ B | 2-2-1-3-2-1-1 | {0,2,4,5,8,T,E} | `110100110101` |
| 1405 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A♯ B | 3-1-1-3-2-1-1 | {0,3,4,5,8,T,E} | `110100111001` |
| 1406 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A♯ B | 1-1-4-2-2-1-1 | {0,1,2,6,8,T,E} | `110101000111` |
| 1407 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A♯ B | 1-2-3-2-2-1-1 | {0,1,3,6,8,T,E} | `110101001011` |
| 1408 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A♯ B | 2-1-3-2-2-1-1 | {0,2,3,6,8,T,E} | `110101001101` |
| 1409 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A♯ B | 1-3-2-2-2-1-1 | {0,1,4,6,8,T,E} | `110101010011` |
| 1410 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ A♯ B | 2-2-2-2-2-1-1 | {0,2,4,6,8,T,E} | `110101010101` |
| 1411 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A♯ B | 3-1-2-2-2-1-1 | {0,3,4,6,8,T,E} | `110101011001` |
| 1412 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A♯ B | 1-4-1-2-2-1-1 | {0,1,5,6,8,T,E} | `110101100011` |
| 1413 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A♯ B | 2-3-1-2-2-1-1 | {0,2,5,6,8,T,E} | `110101100101` |
| 1414 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A♯ B | 3-2-1-2-2-1-1 | {0,3,5,6,8,T,E} | `110101101001` |
| 1415 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A♯ B | 4-1-1-2-2-1-1 | {0,4,5,6,8,T,E} | `110101110001` |
| 1416 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A♯ B | 1-1-5-1-2-1-1 | {0,1,2,7,8,T,E} | `110110000111` |
| 1417 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A♯ B | 1-2-4-1-2-1-1 | {0,1,3,7,8,T,E} | `110110001011` |
| 1418 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A♯ B | 2-1-4-1-2-1-1 | {0,2,3,7,8,T,E} | `110110001101` |
| 1419 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A♯ B | 1-3-3-1-2-1-1 | {0,1,4,7,8,T,E} | `110110010011` |
| 1420 | 7 | Unnamed / mathematical 12-TET collection | C D E G G♯ A♯ B | 2-2-3-1-2-1-1 | {0,2,4,7,8,T,E} | `110110010101` |
| 1421 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A♯ B | 3-1-3-1-2-1-1 | {0,3,4,7,8,T,E} | `110110011001` |
| 1422 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A♯ B | 1-4-2-1-2-1-1 | {0,1,5,7,8,T,E} | `110110100011` |
| 1423 | 7 | Unnamed / mathematical 12-TET collection | C D F G G♯ A♯ B | 2-3-2-1-2-1-1 | {0,2,5,7,8,T,E} | `110110100101` |
| 1424 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A♯ B | 3-2-2-1-2-1-1 | {0,3,5,7,8,T,E} | `110110101001` |
| 1425 | 7 | Unnamed / mathematical 12-TET collection | C E F G G♯ A♯ B | 4-1-2-1-2-1-1 | {0,4,5,7,8,T,E} | `110110110001` |
| 1426 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A♯ B | 1-5-1-1-2-1-1 | {0,1,6,7,8,T,E} | `110111000011` |
| 1427 | 7 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A♯ B | 2-4-1-1-2-1-1 | {0,2,6,7,8,T,E} | `110111000101` |
| 1428 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A♯ B | 3-3-1-1-2-1-1 | {0,3,6,7,8,T,E} | `110111001001` |
| 1429 | 7 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A♯ B | 4-2-1-1-2-1-1 | {0,4,6,7,8,T,E} | `110111010001` |
| 1430 | 7 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A♯ B | 5-1-1-1-2-1-1 | {0,5,6,7,8,T,E} | `110111100001` |
| 1431 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ A A♯ B | 1-1-1-6-1-1-1 | {0,1,2,3,9,T,E} | `111000001111` |
| 1432 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D E A A♯ B | 1-1-2-5-1-1-1 | {0,1,2,4,9,T,E} | `111000010111` |
| 1433 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E A A♯ B | 1-2-1-5-1-1-1 | {0,1,3,4,9,T,E} | `111000011011` |
| 1434 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ E A A♯ B | 2-1-1-5-1-1-1 | {0,2,3,4,9,T,E} | `111000011101` |
| 1435 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F A A♯ B | 1-1-3-4-1-1-1 | {0,1,2,5,9,T,E} | `111000100111` |
| 1436 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F A A♯ B | 1-2-2-4-1-1-1 | {0,1,3,5,9,T,E} | `111000101011` |
| 1437 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F A A♯ B | 2-1-2-4-1-1-1 | {0,2,3,5,9,T,E} | `111000101101` |
| 1438 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F A A♯ B | 1-3-1-4-1-1-1 | {0,1,4,5,9,T,E} | `111000110011` |
| 1439 | 7 | Unnamed / mathematical 12-TET collection | C D E F A A♯ B | 2-2-1-4-1-1-1 | {0,2,4,5,9,T,E} | `111000110101` |
| 1440 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F A A♯ B | 3-1-1-4-1-1-1 | {0,3,4,5,9,T,E} | `111000111001` |
| 1441 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ A A♯ B | 1-1-4-3-1-1-1 | {0,1,2,6,9,T,E} | `111001000111` |
| 1442 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ A A♯ B | 1-2-3-3-1-1-1 | {0,1,3,6,9,T,E} | `111001001011` |
| 1443 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ A A♯ B | 2-1-3-3-1-1-1 | {0,2,3,6,9,T,E} | `111001001101` |
| 1444 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ A A♯ B | 1-3-2-3-1-1-1 | {0,1,4,6,9,T,E} | `111001010011` |
| 1445 | 7 | Unnamed / mathematical 12-TET collection | C D E F♯ A A♯ B | 2-2-2-3-1-1-1 | {0,2,4,6,9,T,E} | `111001010101` |
| 1446 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ A A♯ B | 3-1-2-3-1-1-1 | {0,3,4,6,9,T,E} | `111001011001` |
| 1447 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ A A♯ B | 1-4-1-3-1-1-1 | {0,1,5,6,9,T,E} | `111001100011` |
| 1448 | 7 | Unnamed / mathematical 12-TET collection | C D F F♯ A A♯ B | 2-3-1-3-1-1-1 | {0,2,5,6,9,T,E} | `111001100101` |
| 1449 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ A A♯ B | 3-2-1-3-1-1-1 | {0,3,5,6,9,T,E} | `111001101001` |
| 1450 | 7 | Unnamed / mathematical 12-TET collection | C E F F♯ A A♯ B | 4-1-1-3-1-1-1 | {0,4,5,6,9,T,E} | `111001110001` |
| 1451 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D G A A♯ B | 1-1-5-2-1-1-1 | {0,1,2,7,9,T,E} | `111010000111` |
| 1452 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G A A♯ B | 1-2-4-2-1-1-1 | {0,1,3,7,9,T,E} | `111010001011` |
| 1453 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ G A A♯ B | 2-1-4-2-1-1-1 | {0,2,3,7,9,T,E} | `111010001101` |
| 1454 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E G A A♯ B | 1-3-3-2-1-1-1 | {0,1,4,7,9,T,E} | `111010010011` |
| 1455 | 7 | Unnamed / mathematical 12-TET collection | C D E G A A♯ B | 2-2-3-2-1-1-1 | {0,2,4,7,9,T,E} | `111010010101` |
| 1456 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E G A A♯ B | 3-1-3-2-1-1-1 | {0,3,4,7,9,T,E} | `111010011001` |
| 1457 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F G A A♯ B | 1-4-2-2-1-1-1 | {0,1,5,7,9,T,E} | `111010100011` |
| 1458 | 7 | Unnamed / mathematical 12-TET collection | C D F G A A♯ B | 2-3-2-2-1-1-1 | {0,2,5,7,9,T,E} | `111010100101` |
| 1459 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F G A A♯ B | 3-2-2-2-1-1-1 | {0,3,5,7,9,T,E} | `111010101001` |
| 1460 | 7 | Unnamed / mathematical 12-TET collection | C E F G A A♯ B | 4-1-2-2-1-1-1 | {0,4,5,7,9,T,E} | `111010110001` |
| 1461 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G A A♯ B | 1-5-1-2-1-1-1 | {0,1,6,7,9,T,E} | `111011000011` |
| 1462 | 7 | Unnamed / mathematical 12-TET collection | C D F♯ G A A♯ B | 2-4-1-2-1-1-1 | {0,2,6,7,9,T,E} | `111011000101` |
| 1463 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G A A♯ B | 3-3-1-2-1-1-1 | {0,3,6,7,9,T,E} | `111011001001` |
| 1464 | 7 | Unnamed / mathematical 12-TET collection | C E F♯ G A A♯ B | 4-2-1-2-1-1-1 | {0,4,6,7,9,T,E} | `111011010001` |
| 1465 | 7 | Unnamed / mathematical 12-TET collection | C F F♯ G A A♯ B | 5-1-1-2-1-1-1 | {0,5,6,7,9,T,E} | `111011100001` |
| 1466 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D G♯ A A♯ B | 1-1-6-1-1-1-1 | {0,1,2,8,9,T,E} | `111100000111` |
| 1467 | 7 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G♯ A A♯ B | 1-2-5-1-1-1-1 | {0,1,3,8,9,T,E} | `111100001011` |
| 1468 | 7 | Unnamed / mathematical 12-TET collection | C D D♯ G♯ A A♯ B | 2-1-5-1-1-1-1 | {0,2,3,8,9,T,E} | `111100001101` |
| 1469 | 7 | Unnamed / mathematical 12-TET collection | C C♯ E G♯ A A♯ B | 1-3-4-1-1-1-1 | {0,1,4,8,9,T,E} | `111100010011` |
| 1470 | 7 | Unnamed / mathematical 12-TET collection | C D E G♯ A A♯ B | 2-2-4-1-1-1-1 | {0,2,4,8,9,T,E} | `111100010101` |
| 1471 | 7 | Unnamed / mathematical 12-TET collection | C D♯ E G♯ A A♯ B | 3-1-4-1-1-1-1 | {0,3,4,8,9,T,E} | `111100011001` |
| 1472 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F G♯ A A♯ B | 1-4-3-1-1-1-1 | {0,1,5,8,9,T,E} | `111100100011` |
| 1473 | 7 | Unnamed / mathematical 12-TET collection | C D F G♯ A A♯ B | 2-3-3-1-1-1-1 | {0,2,5,8,9,T,E} | `111100100101` |
| 1474 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F G♯ A A♯ B | 3-2-3-1-1-1-1 | {0,3,5,8,9,T,E} | `111100101001` |
| 1475 | 7 | Unnamed / mathematical 12-TET collection | C E F G♯ A A♯ B | 4-1-3-1-1-1-1 | {0,4,5,8,9,T,E} | `111100110001` |
| 1476 | 7 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G♯ A A♯ B | 1-5-2-1-1-1-1 | {0,1,6,8,9,T,E} | `111101000011` |
| 1477 | 7 | Unnamed / mathematical 12-TET collection | C D F♯ G♯ A A♯ B | 2-4-2-1-1-1-1 | {0,2,6,8,9,T,E} | `111101000101` |
| 1478 | 7 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G♯ A A♯ B | 3-3-2-1-1-1-1 | {0,3,6,8,9,T,E} | `111101001001` |
| 1479 | 7 | Unnamed / mathematical 12-TET collection | C E F♯ G♯ A A♯ B | 4-2-2-1-1-1-1 | {0,4,6,8,9,T,E} | `111101010001` |
| 1480 | 7 | Unnamed / mathematical 12-TET collection | C F F♯ G♯ A A♯ B | 5-1-2-1-1-1-1 | {0,5,6,8,9,T,E} | `111101100001` |
| 1481 | 7 | Unnamed / mathematical 12-TET collection | C C♯ G G♯ A A♯ B | 1-6-1-1-1-1-1 | {0,1,7,8,9,T,E} | `111110000011` |
| 1482 | 7 | Unnamed / mathematical 12-TET collection | C D G G♯ A A♯ B | 2-5-1-1-1-1-1 | {0,2,7,8,9,T,E} | `111110000101` |
| 1483 | 7 | Unnamed / mathematical 12-TET collection | C D♯ G G♯ A A♯ B | 3-4-1-1-1-1-1 | {0,3,7,8,9,T,E} | `111110001001` |
| 1484 | 7 | Unnamed / mathematical 12-TET collection | C E G G♯ A A♯ B | 4-3-1-1-1-1-1 | {0,4,7,8,9,T,E} | `111110010001` |
| 1485 | 7 | Unnamed / mathematical 12-TET collection | C F G G♯ A A♯ B | 5-2-1-1-1-1-1 | {0,5,7,8,9,T,E} | `111110100001` |
| 1486 | 7 | Unnamed / mathematical 12-TET collection | C F♯ G G♯ A A♯ B | 6-1-1-1-1-1-1 | {0,6,7,8,9,T,E} | `111111000001` |
| 1487 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G | 1-1-1-1-1-1-1-5 | {0,1,2,3,4,5,6,7} | `000011111111` |
| 1488 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ | 1-1-1-1-1-1-2-4 | {0,1,2,3,4,5,6,8} | `000101111111` |
| 1489 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ | 1-1-1-1-1-2-1-4 | {0,1,2,3,4,5,7,8} | `000110111111` |
| 1490 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ | 1-1-1-1-2-1-1-4 | {0,1,2,3,4,6,7,8} | `000111011111` |
| 1491 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ | 1-1-1-2-1-1-1-4 | {0,1,2,3,5,6,7,8} | `000111101111` |
| 1492 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ | 1-1-2-1-1-1-1-4 | {0,1,2,4,5,6,7,8} | `000111110111` |
| 1493 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ | 1-2-1-1-1-1-1-4 | {0,1,3,4,5,6,7,8} | `000111111011` |
| 1494 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ | 2-1-1-1-1-1-1-4 | {0,2,3,4,5,6,7,8} | `000111111101` |
| 1495 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A | 1-1-1-1-1-1-3-3 | {0,1,2,3,4,5,6,9} | `001001111111` |
| 1496 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A | 1-1-1-1-1-2-2-3 | {0,1,2,3,4,5,7,9} | `001010111111` |
| 1497 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A | 1-1-1-1-2-1-2-3 | {0,1,2,3,4,6,7,9} | `001011011111` |
| 1498 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A | 1-1-1-2-1-1-2-3 | {0,1,2,3,5,6,7,9} | `001011101111` |
| 1499 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A | 1-1-2-1-1-1-2-3 | {0,1,2,4,5,6,7,9} | `001011110111` |
| 1500 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A | 1-2-1-1-1-1-2-3 | {0,1,3,4,5,6,7,9} | `001011111011` |
| 1501 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A | 2-1-1-1-1-1-2-3 | {0,2,3,4,5,6,7,9} | `001011111101` |
| 1502 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A | 1-1-1-1-1-3-1-3 | {0,1,2,3,4,5,8,9} | `001100111111` |
| 1503 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A | 1-1-1-1-2-2-1-3 | {0,1,2,3,4,6,8,9} | `001101011111` |
| 1504 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A | 1-1-1-2-1-2-1-3 | {0,1,2,3,5,6,8,9} | `001101101111` |
| 1505 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A | 1-1-2-1-1-2-1-3 | {0,1,2,4,5,6,8,9} | `001101110111` |
| 1506 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A | 1-2-1-1-1-2-1-3 | {0,1,3,4,5,6,8,9} | `001101111011` |
| 1507 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A | 2-1-1-1-1-2-1-3 | {0,2,3,4,5,6,8,9} | `001101111101` |
| 1508 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A | 1-1-1-1-3-1-1-3 | {0,1,2,3,4,7,8,9} | `001110011111` |
| 1509 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A | 1-1-1-2-2-1-1-3 | {0,1,2,3,5,7,8,9} | `001110101111` |
| 1510 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A | 1-1-2-1-2-1-1-3 | {0,1,2,4,5,7,8,9} | `001110110111` |
| 1511 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A | 1-2-1-1-2-1-1-3 | {0,1,3,4,5,7,8,9} | `001110111011` |
| 1512 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A | 2-1-1-1-2-1-1-3 | {0,2,3,4,5,7,8,9} | `001110111101` |
| 1513 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A | 1-1-1-3-1-1-1-3 | {0,1,2,3,6,7,8,9} | `001111001111` |
| 1514 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A | 1-1-2-2-1-1-1-3 | {0,1,2,4,6,7,8,9} | `001111010111` |
| 1515 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A | 1-2-1-2-1-1-1-3 | {0,1,3,4,6,7,8,9} | `001111011011` |
| 1516 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A | 2-1-1-2-1-1-1-3 | {0,2,3,4,6,7,8,9} | `001111011101` |
| 1517 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A | 1-1-3-1-1-1-1-3 | {0,1,2,5,6,7,8,9} | `001111100111` |
| 1518 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A | 1-2-2-1-1-1-1-3 | {0,1,3,5,6,7,8,9} | `001111101011` |
| 1519 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A | 2-1-2-1-1-1-1-3 | {0,2,3,5,6,7,8,9} | `001111101101` |
| 1520 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A | 1-3-1-1-1-1-1-3 | {0,1,4,5,6,7,8,9} | `001111110011` |
| 1521 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A | 2-2-1-1-1-1-1-3 | {0,2,4,5,6,7,8,9} | `001111110101` |
| 1522 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A | 3-1-1-1-1-1-1-3 | {0,3,4,5,6,7,8,9} | `001111111001` |
| 1523 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A♯ | 1-1-1-1-1-1-4-2 | {0,1,2,3,4,5,6,T} | `010001111111` |
| 1524 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A♯ | 1-1-1-1-1-2-3-2 | {0,1,2,3,4,5,7,T} | `010010111111` |
| 1525 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A♯ | 1-1-1-1-2-1-3-2 | {0,1,2,3,4,6,7,T} | `010011011111` |
| 1526 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A♯ | 1-1-1-2-1-1-3-2 | {0,1,2,3,5,6,7,T} | `010011101111` |
| 1527 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A♯ | 1-1-2-1-1-1-3-2 | {0,1,2,4,5,6,7,T} | `010011110111` |
| 1528 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A♯ | 1-2-1-1-1-1-3-2 | {0,1,3,4,5,6,7,T} | `010011111011` |
| 1529 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A♯ | 2-1-1-1-1-1-3-2 | {0,2,3,4,5,6,7,T} | `010011111101` |
| 1530 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A♯ | 1-1-1-1-1-3-2-2 | {0,1,2,3,4,5,8,T} | `010100111111` |
| 1531 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A♯ | 1-1-1-1-2-2-2-2 | {0,1,2,3,4,6,8,T} | `010101011111` |
| 1532 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A♯ | 1-1-1-2-1-2-2-2 | {0,1,2,3,5,6,8,T} | `010101101111` |
| 1533 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A♯ | 1-1-2-1-1-2-2-2 | {0,1,2,4,5,6,8,T} | `010101110111` |
| 1534 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A♯ | 1-2-1-1-1-2-2-2 | {0,1,3,4,5,6,8,T} | `010101111011` |
| 1535 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A♯ | 2-1-1-1-1-2-2-2 | {0,2,3,4,5,6,8,T} | `010101111101` |
| 1536 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A♯ | 1-1-1-1-3-1-2-2 | {0,1,2,3,4,7,8,T} | `010110011111` |
| 1537 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A♯ | 1-1-1-2-2-1-2-2 | {0,1,2,3,5,7,8,T} | `010110101111` |
| 1538 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A♯ | 1-1-2-1-2-1-2-2 | {0,1,2,4,5,7,8,T} | `010110110111` |
| 1539 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A♯ | 1-2-1-1-2-1-2-2 | {0,1,3,4,5,7,8,T} | `010110111011` |
| 1540 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A♯ | 2-1-1-1-2-1-2-2 | {0,2,3,4,5,7,8,T} | `010110111101` |
| 1541 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A♯ | 1-1-1-3-1-1-2-2 | {0,1,2,3,6,7,8,T} | `010111001111` |
| 1542 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A♯ | 1-1-2-2-1-1-2-2 | {0,1,2,4,6,7,8,T} | `010111010111` |
| 1543 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A♯ | 1-2-1-2-1-1-2-2 | {0,1,3,4,6,7,8,T} | `010111011011` |
| 1544 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A♯ | 2-1-1-2-1-1-2-2 | {0,2,3,4,6,7,8,T} | `010111011101` |
| 1545 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A♯ | 1-1-3-1-1-1-2-2 | {0,1,2,5,6,7,8,T} | `010111100111` |
| 1546 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A♯ | 1-2-2-1-1-1-2-2 | {0,1,3,5,6,7,8,T} | `010111101011` |
| 1547 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A♯ | 2-1-2-1-1-1-2-2 | {0,2,3,5,6,7,8,T} | `010111101101` |
| 1548 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A♯ | 1-3-1-1-1-1-2-2 | {0,1,4,5,6,7,8,T} | `010111110011` |
| 1549 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A♯ | 2-2-1-1-1-1-2-2 | {0,2,4,5,6,7,8,T} | `010111110101` |
| 1550 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A♯ | 3-1-1-1-1-1-2-2 | {0,3,4,5,6,7,8,T} | `010111111001` |
| 1551 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A A♯ | 1-1-1-1-1-4-1-2 | {0,1,2,3,4,5,9,T} | `011000111111` |
| 1552 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A A♯ | 1-1-1-1-2-3-1-2 | {0,1,2,3,4,6,9,T} | `011001011111` |
| 1553 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A A♯ | 1-1-1-2-1-3-1-2 | {0,1,2,3,5,6,9,T} | `011001101111` |
| 1554 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A A♯ | 1-1-2-1-1-3-1-2 | {0,1,2,4,5,6,9,T} | `011001110111` |
| 1555 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A A♯ | 1-2-1-1-1-3-1-2 | {0,1,3,4,5,6,9,T} | `011001111011` |
| 1556 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A A♯ | 2-1-1-1-1-3-1-2 | {0,2,3,4,5,6,9,T} | `011001111101` |
| 1557 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A A♯ | 1-1-1-1-3-2-1-2 | {0,1,2,3,4,7,9,T} | `011010011111` |
| 1558 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A A♯ | 1-1-1-2-2-2-1-2 | {0,1,2,3,5,7,9,T} | `011010101111` |
| 1559 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A A♯ | 1-1-2-1-2-2-1-2 | {0,1,2,4,5,7,9,T} | `011010110111` |
| 1560 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A A♯ | 1-2-1-1-2-2-1-2 | {0,1,3,4,5,7,9,T} | `011010111011` |
| 1561 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A A♯ | 2-1-1-1-2-2-1-2 | {0,2,3,4,5,7,9,T} | `011010111101` |
| 1562 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A A♯ | 1-1-1-3-1-2-1-2 | {0,1,2,3,6,7,9,T} | `011011001111` |
| 1563 | 8 | Messiaen Mode 4 (one common transposition) | C C♯ D E F♯ G A A♯ | 1-1-2-2-1-2-1-2 | {0,1,2,4,6,7,9,T} | `011011010111` |
| 1564 | 8 | Messiaen Mode 2 | C C♯ D♯ E F♯ G A A♯ | 1-2-1-2-1-2-1-2 | {0,1,3,4,6,7,9,T} | `011011011011` |
| 1565 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A A♯ | 2-1-1-2-1-2-1-2 | {0,2,3,4,6,7,9,T} | `011011011101` |
| 1566 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A A♯ | 1-1-3-1-1-2-1-2 | {0,1,2,5,6,7,9,T} | `011011100111` |
| 1567 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A A♯ | 1-2-2-1-1-2-1-2 | {0,1,3,5,6,7,9,T} | `011011101011` |
| 1568 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A A♯ | 2-1-2-1-1-2-1-2 | {0,2,3,5,6,7,9,T} | `011011101101` |
| 1569 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A A♯ | 1-3-1-1-1-2-1-2 | {0,1,4,5,6,7,9,T} | `011011110011` |
| 1570 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A A♯ | 2-2-1-1-1-2-1-2 | {0,2,4,5,6,7,9,T} | `011011110101` |
| 1571 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A A♯ | 3-1-1-1-1-2-1-2 | {0,3,4,5,6,7,9,T} | `011011111001` |
| 1572 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A A♯ | 1-1-1-1-4-1-1-2 | {0,1,2,3,4,8,9,T} | `011100011111` |
| 1573 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A A♯ | 1-1-1-2-3-1-1-2 | {0,1,2,3,5,8,9,T} | `011100101111` |
| 1574 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A A♯ | 1-1-2-1-3-1-1-2 | {0,1,2,4,5,8,9,T} | `011100110111` |
| 1575 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A A♯ | 1-2-1-1-3-1-1-2 | {0,1,3,4,5,8,9,T} | `011100111011` |
| 1576 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A A♯ | 2-1-1-1-3-1-1-2 | {0,2,3,4,5,8,9,T} | `011100111101` |
| 1577 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A A♯ | 1-1-1-3-2-1-1-2 | {0,1,2,3,6,8,9,T} | `011101001111` |
| 1578 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A A♯ | 1-1-2-2-2-1-1-2 | {0,1,2,4,6,8,9,T} | `011101010111` |
| 1579 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ A A♯ | 1-2-1-2-2-1-1-2 | {0,1,3,4,6,8,9,T} | `011101011011` |
| 1580 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ A A♯ | 2-1-1-2-2-1-1-2 | {0,2,3,4,6,8,9,T} | `011101011101` |
| 1581 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A A♯ | 1-1-3-1-2-1-1-2 | {0,1,2,5,6,8,9,T} | `011101100111` |
| 1582 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ A A♯ | 1-2-2-1-2-1-1-2 | {0,1,3,5,6,8,9,T} | `011101101011` |
| 1583 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ A A♯ | 2-1-2-1-2-1-1-2 | {0,2,3,5,6,8,9,T} | `011101101101` |
| 1584 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A A♯ | 1-3-1-1-2-1-1-2 | {0,1,4,5,6,8,9,T} | `011101110011` |
| 1585 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A A♯ | 2-2-1-1-2-1-1-2 | {0,2,4,5,6,8,9,T} | `011101110101` |
| 1586 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A A♯ | 3-1-1-1-2-1-1-2 | {0,3,4,5,6,8,9,T} | `011101111001` |
| 1587 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A A♯ | 1-1-1-4-1-1-1-2 | {0,1,2,3,7,8,9,T} | `011110001111` |
| 1588 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A A♯ | 1-1-2-3-1-1-1-2 | {0,1,2,4,7,8,9,T} | `011110010111` |
| 1589 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A A♯ | 1-2-1-3-1-1-1-2 | {0,1,3,4,7,8,9,T} | `011110011011` |
| 1590 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A A♯ | 2-1-1-3-1-1-1-2 | {0,2,3,4,7,8,9,T} | `011110011101` |
| 1591 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A A♯ | 1-1-3-2-1-1-1-2 | {0,1,2,5,7,8,9,T} | `011110100111` |
| 1592 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ A A♯ | 1-2-2-2-1-1-1-2 | {0,1,3,5,7,8,9,T} | `011110101011` |
| 1593 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F G G♯ A A♯ | 2-1-2-2-1-1-1-2 | {0,2,3,5,7,8,9,T} | `011110101101` |
| 1594 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ A A♯ | 1-3-1-2-1-1-1-2 | {0,1,4,5,7,8,9,T} | `011110110011` |
| 1595 | 8 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A A♯ | 2-2-1-2-1-1-1-2 | {0,2,4,5,7,8,9,T} | `011110110101` |
| 1596 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A A♯ | 3-1-1-2-1-1-1-2 | {0,3,4,5,7,8,9,T} | `011110111001` |
| 1597 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A A♯ | 1-1-4-1-1-1-1-2 | {0,1,2,6,7,8,9,T} | `011111000111` |
| 1598 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A A♯ | 1-2-3-1-1-1-1-2 | {0,1,3,6,7,8,9,T} | `011111001011` |
| 1599 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A A♯ | 2-1-3-1-1-1-1-2 | {0,2,3,6,7,8,9,T} | `011111001101` |
| 1600 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A A♯ | 1-3-2-1-1-1-1-2 | {0,1,4,6,7,8,9,T} | `011111010011` |
| 1601 | 8 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A A♯ | 2-2-2-1-1-1-1-2 | {0,2,4,6,7,8,9,T} | `011111010101` |
| 1602 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A A♯ | 3-1-2-1-1-1-1-2 | {0,3,4,6,7,8,9,T} | `011111011001` |
| 1603 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A A♯ | 1-4-1-1-1-1-1-2 | {0,1,5,6,7,8,9,T} | `011111100011` |
| 1604 | 8 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A A♯ | 2-3-1-1-1-1-1-2 | {0,2,5,6,7,8,9,T} | `011111100101` |
| 1605 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A A♯ | 3-2-1-1-1-1-1-2 | {0,3,5,6,7,8,9,T} | `011111101001` |
| 1606 | 8 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A A♯ | 4-1-1-1-1-1-1-2 | {0,4,5,6,7,8,9,T} | `011111110001` |
| 1607 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ B | 1-1-1-1-1-1-5-1 | {0,1,2,3,4,5,6,E} | `100001111111` |
| 1608 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G B | 1-1-1-1-1-2-4-1 | {0,1,2,3,4,5,7,E} | `100010111111` |
| 1609 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G B | 1-1-1-1-2-1-4-1 | {0,1,2,3,4,6,7,E} | `100011011111` |
| 1610 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G B | 1-1-1-2-1-1-4-1 | {0,1,2,3,5,6,7,E} | `100011101111` |
| 1611 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G B | 1-1-2-1-1-1-4-1 | {0,1,2,4,5,6,7,E} | `100011110111` |
| 1612 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G B | 1-2-1-1-1-1-4-1 | {0,1,3,4,5,6,7,E} | `100011111011` |
| 1613 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G B | 2-1-1-1-1-1-4-1 | {0,2,3,4,5,6,7,E} | `100011111101` |
| 1614 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ B | 1-1-1-1-1-3-3-1 | {0,1,2,3,4,5,8,E} | `100100111111` |
| 1615 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ B | 1-1-1-1-2-2-3-1 | {0,1,2,3,4,6,8,E} | `100101011111` |
| 1616 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ B | 1-1-1-2-1-2-3-1 | {0,1,2,3,5,6,8,E} | `100101101111` |
| 1617 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ B | 1-1-2-1-1-2-3-1 | {0,1,2,4,5,6,8,E} | `100101110111` |
| 1618 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ B | 1-2-1-1-1-2-3-1 | {0,1,3,4,5,6,8,E} | `100101111011` |
| 1619 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ B | 2-1-1-1-1-2-3-1 | {0,2,3,4,5,6,8,E} | `100101111101` |
| 1620 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ B | 1-1-1-1-3-1-3-1 | {0,1,2,3,4,7,8,E} | `100110011111` |
| 1621 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ B | 1-1-1-2-2-1-3-1 | {0,1,2,3,5,7,8,E} | `100110101111` |
| 1622 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ B | 1-1-2-1-2-1-3-1 | {0,1,2,4,5,7,8,E} | `100110110111` |
| 1623 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ B | 1-2-1-1-2-1-3-1 | {0,1,3,4,5,7,8,E} | `100110111011` |
| 1624 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ B | 2-1-1-1-2-1-3-1 | {0,2,3,4,5,7,8,E} | `100110111101` |
| 1625 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ B | 1-1-1-3-1-1-3-1 | {0,1,2,3,6,7,8,E} | `100111001111` |
| 1626 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ B | 1-1-2-2-1-1-3-1 | {0,1,2,4,6,7,8,E} | `100111010111` |
| 1627 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ B | 1-2-1-2-1-1-3-1 | {0,1,3,4,6,7,8,E} | `100111011011` |
| 1628 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ B | 2-1-1-2-1-1-3-1 | {0,2,3,4,6,7,8,E} | `100111011101` |
| 1629 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ B | 1-1-3-1-1-1-3-1 | {0,1,2,5,6,7,8,E} | `100111100111` |
| 1630 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ B | 1-2-2-1-1-1-3-1 | {0,1,3,5,6,7,8,E} | `100111101011` |
| 1631 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ B | 2-1-2-1-1-1-3-1 | {0,2,3,5,6,7,8,E} | `100111101101` |
| 1632 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ B | 1-3-1-1-1-1-3-1 | {0,1,4,5,6,7,8,E} | `100111110011` |
| 1633 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ B | 2-2-1-1-1-1-3-1 | {0,2,4,5,6,7,8,E} | `100111110101` |
| 1634 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ B | 3-1-1-1-1-1-3-1 | {0,3,4,5,6,7,8,E} | `100111111001` |
| 1635 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A B | 1-1-1-1-1-4-2-1 | {0,1,2,3,4,5,9,E} | `101000111111` |
| 1636 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A B | 1-1-1-1-2-3-2-1 | {0,1,2,3,4,6,9,E} | `101001011111` |
| 1637 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A B | 1-1-1-2-1-3-2-1 | {0,1,2,3,5,6,9,E} | `101001101111` |
| 1638 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A B | 1-1-2-1-1-3-2-1 | {0,1,2,4,5,6,9,E} | `101001110111` |
| 1639 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A B | 1-2-1-1-1-3-2-1 | {0,1,3,4,5,6,9,E} | `101001111011` |
| 1640 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A B | 2-1-1-1-1-3-2-1 | {0,2,3,4,5,6,9,E} | `101001111101` |
| 1641 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A B | 1-1-1-1-3-2-2-1 | {0,1,2,3,4,7,9,E} | `101010011111` |
| 1642 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A B | 1-1-1-2-2-2-2-1 | {0,1,2,3,5,7,9,E} | `101010101111` |
| 1643 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A B | 1-1-2-1-2-2-2-1 | {0,1,2,4,5,7,9,E} | `101010110111` |
| 1644 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A B | 1-2-1-1-2-2-2-1 | {0,1,3,4,5,7,9,E} | `101010111011` |
| 1645 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A B | 2-1-1-1-2-2-2-1 | {0,2,3,4,5,7,9,E} | `101010111101` |
| 1646 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A B | 1-1-1-3-1-2-2-1 | {0,1,2,3,6,7,9,E} | `101011001111` |
| 1647 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G A B | 1-1-2-2-1-2-2-1 | {0,1,2,4,6,7,9,E} | `101011010111` |
| 1648 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G A B | 1-2-1-2-1-2-2-1 | {0,1,3,4,6,7,9,E} | `101011011011` |
| 1649 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A B | 2-1-1-2-1-2-2-1 | {0,2,3,4,6,7,9,E} | `101011011101` |
| 1650 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A B | 1-1-3-1-1-2-2-1 | {0,1,2,5,6,7,9,E} | `101011100111` |
| 1651 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A B | 1-2-2-1-1-2-2-1 | {0,1,3,5,6,7,9,E} | `101011101011` |
| 1652 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A B | 2-1-2-1-1-2-2-1 | {0,2,3,5,6,7,9,E} | `101011101101` |
| 1653 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A B | 1-3-1-1-1-2-2-1 | {0,1,4,5,6,7,9,E} | `101011110011` |
| 1654 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A B | 2-2-1-1-1-2-2-1 | {0,2,4,5,6,7,9,E} | `101011110101` |
| 1655 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A B | 3-1-1-1-1-2-2-1 | {0,3,4,5,6,7,9,E} | `101011111001` |
| 1656 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A B | 1-1-1-1-4-1-2-1 | {0,1,2,3,4,8,9,E} | `101100011111` |
| 1657 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A B | 1-1-1-2-3-1-2-1 | {0,1,2,3,5,8,9,E} | `101100101111` |
| 1658 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A B | 1-1-2-1-3-1-2-1 | {0,1,2,4,5,8,9,E} | `101100110111` |
| 1659 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A B | 1-2-1-1-3-1-2-1 | {0,1,3,4,5,8,9,E} | `101100111011` |
| 1660 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A B | 2-1-1-1-3-1-2-1 | {0,2,3,4,5,8,9,E} | `101100111101` |
| 1661 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A B | 1-1-1-3-2-1-2-1 | {0,1,2,3,6,8,9,E} | `101101001111` |
| 1662 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A B | 1-1-2-2-2-1-2-1 | {0,1,2,4,6,8,9,E} | `101101010111` |
| 1663 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ A B | 1-2-1-2-2-1-2-1 | {0,1,3,4,6,8,9,E} | `101101011011` |
| 1664 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ A B | 2-1-1-2-2-1-2-1 | {0,2,3,4,6,8,9,E} | `101101011101` |
| 1665 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A B | 1-1-3-1-2-1-2-1 | {0,1,2,5,6,8,9,E} | `101101100111` |
| 1666 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ A B | 1-2-2-1-2-1-2-1 | {0,1,3,5,6,8,9,E} | `101101101011` |
| 1667 | 8 | Whole-Half Diminished | C D D♯ F F♯ G♯ A B | 2-1-2-1-2-1-2-1 | {0,2,3,5,6,8,9,E} | `101101101101` |
| 1668 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A B | 1-3-1-1-2-1-2-1 | {0,1,4,5,6,8,9,E} | `101101110011` |
| 1669 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A B | 2-2-1-1-2-1-2-1 | {0,2,4,5,6,8,9,E} | `101101110101` |
| 1670 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A B | 3-1-1-1-2-1-2-1 | {0,3,4,5,6,8,9,E} | `101101111001` |
| 1671 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A B | 1-1-1-4-1-1-2-1 | {0,1,2,3,7,8,9,E} | `101110001111` |
| 1672 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A B | 1-1-2-3-1-1-2-1 | {0,1,2,4,7,8,9,E} | `101110010111` |
| 1673 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A B | 1-2-1-3-1-1-2-1 | {0,1,3,4,7,8,9,E} | `101110011011` |
| 1674 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A B | 2-1-1-3-1-1-2-1 | {0,2,3,4,7,8,9,E} | `101110011101` |
| 1675 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A B | 1-1-3-2-1-1-2-1 | {0,1,2,5,7,8,9,E} | `101110100111` |
| 1676 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ A B | 1-2-2-2-1-1-2-1 | {0,1,3,5,7,8,9,E} | `101110101011` |
| 1677 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F G G♯ A B | 2-1-2-2-1-1-2-1 | {0,2,3,5,7,8,9,E} | `101110101101` |
| 1678 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ A B | 1-3-1-2-1-1-2-1 | {0,1,4,5,7,8,9,E} | `101110110011` |
| 1679 | 8 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A B | 2-2-1-2-1-1-2-1 | {0,2,4,5,7,8,9,E} | `101110110101` |
| 1680 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A B | 3-1-1-2-1-1-2-1 | {0,3,4,5,7,8,9,E} | `101110111001` |
| 1681 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A B | 1-1-4-1-1-1-2-1 | {0,1,2,6,7,8,9,E} | `101111000111` |
| 1682 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A B | 1-2-3-1-1-1-2-1 | {0,1,3,6,7,8,9,E} | `101111001011` |
| 1683 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A B | 2-1-3-1-1-1-2-1 | {0,2,3,6,7,8,9,E} | `101111001101` |
| 1684 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A B | 1-3-2-1-1-1-2-1 | {0,1,4,6,7,8,9,E} | `101111010011` |
| 1685 | 8 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A B | 2-2-2-1-1-1-2-1 | {0,2,4,6,7,8,9,E} | `101111010101` |
| 1686 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A B | 3-1-2-1-1-1-2-1 | {0,3,4,6,7,8,9,E} | `101111011001` |
| 1687 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A B | 1-4-1-1-1-1-2-1 | {0,1,5,6,7,8,9,E} | `101111100011` |
| 1688 | 8 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A B | 2-3-1-1-1-1-2-1 | {0,2,5,6,7,8,9,E} | `101111100101` |
| 1689 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A B | 3-2-1-1-1-1-2-1 | {0,3,5,6,7,8,9,E} | `101111101001` |
| 1690 | 8 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A B | 4-1-1-1-1-1-2-1 | {0,4,5,6,7,8,9,E} | `101111110001` |
| 1691 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A♯ B | 1-1-1-1-1-5-1-1 | {0,1,2,3,4,5,T,E} | `110000111111` |
| 1692 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A♯ B | 1-1-1-1-2-4-1-1 | {0,1,2,3,4,6,T,E} | `110001011111` |
| 1693 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A♯ B | 1-1-1-2-1-4-1-1 | {0,1,2,3,5,6,T,E} | `110001101111` |
| 1694 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A♯ B | 1-1-2-1-1-4-1-1 | {0,1,2,4,5,6,T,E} | `110001110111` |
| 1695 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A♯ B | 1-2-1-1-1-4-1-1 | {0,1,3,4,5,6,T,E} | `110001111011` |
| 1696 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A♯ B | 2-1-1-1-1-4-1-1 | {0,2,3,4,5,6,T,E} | `110001111101` |
| 1697 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A♯ B | 1-1-1-1-3-3-1-1 | {0,1,2,3,4,7,T,E} | `110010011111` |
| 1698 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A♯ B | 1-1-1-2-2-3-1-1 | {0,1,2,3,5,7,T,E} | `110010101111` |
| 1699 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A♯ B | 1-1-2-1-2-3-1-1 | {0,1,2,4,5,7,T,E} | `110010110111` |
| 1700 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A♯ B | 1-2-1-1-2-3-1-1 | {0,1,3,4,5,7,T,E} | `110010111011` |
| 1701 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A♯ B | 2-1-1-1-2-3-1-1 | {0,2,3,4,5,7,T,E} | `110010111101` |
| 1702 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A♯ B | 1-1-1-3-1-3-1-1 | {0,1,2,3,6,7,T,E} | `110011001111` |
| 1703 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G A♯ B | 1-1-2-2-1-3-1-1 | {0,1,2,4,6,7,T,E} | `110011010111` |
| 1704 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G A♯ B | 1-2-1-2-1-3-1-1 | {0,1,3,4,6,7,T,E} | `110011011011` |
| 1705 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A♯ B | 2-1-1-2-1-3-1-1 | {0,2,3,4,6,7,T,E} | `110011011101` |
| 1706 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A♯ B | 1-1-3-1-1-3-1-1 | {0,1,2,5,6,7,T,E} | `110011100111` |
| 1707 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A♯ B | 1-2-2-1-1-3-1-1 | {0,1,3,5,6,7,T,E} | `110011101011` |
| 1708 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A♯ B | 2-1-2-1-1-3-1-1 | {0,2,3,5,6,7,T,E} | `110011101101` |
| 1709 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A♯ B | 1-3-1-1-1-3-1-1 | {0,1,4,5,6,7,T,E} | `110011110011` |
| 1710 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A♯ B | 2-2-1-1-1-3-1-1 | {0,2,4,5,6,7,T,E} | `110011110101` |
| 1711 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A♯ B | 3-1-1-1-1-3-1-1 | {0,3,4,5,6,7,T,E} | `110011111001` |
| 1712 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A♯ B | 1-1-1-1-4-2-1-1 | {0,1,2,3,4,8,T,E} | `110100011111` |
| 1713 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A♯ B | 1-1-1-2-3-2-1-1 | {0,1,2,3,5,8,T,E} | `110100101111` |
| 1714 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A♯ B | 1-1-2-1-3-2-1-1 | {0,1,2,4,5,8,T,E} | `110100110111` |
| 1715 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A♯ B | 1-2-1-1-3-2-1-1 | {0,1,3,4,5,8,T,E} | `110100111011` |
| 1716 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A♯ B | 2-1-1-1-3-2-1-1 | {0,2,3,4,5,8,T,E} | `110100111101` |
| 1717 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A♯ B | 1-1-1-3-2-2-1-1 | {0,1,2,3,6,8,T,E} | `110101001111` |
| 1718 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A♯ B | 1-1-2-2-2-2-1-1 | {0,1,2,4,6,8,T,E} | `110101010111` |
| 1719 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G♯ A♯ B | 1-2-1-2-2-2-1-1 | {0,1,3,4,6,8,T,E} | `110101011011` |
| 1720 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ A♯ B | 2-1-1-2-2-2-1-1 | {0,2,3,4,6,8,T,E} | `110101011101` |
| 1721 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A♯ B | 1-1-3-1-2-2-1-1 | {0,1,2,5,6,8,T,E} | `110101100111` |
| 1722 | 8 | Locrian Bebop | C C♯ D♯ F F♯ G♯ A♯ B | 1-2-2-1-2-2-1-1 | {0,1,3,5,6,8,T,E} | `110101101011` |
| 1723 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ A♯ B | 2-1-2-1-2-2-1-1 | {0,2,3,5,6,8,T,E} | `110101101101` |
| 1724 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A♯ B | 1-3-1-1-2-2-1-1 | {0,1,4,5,6,8,T,E} | `110101110011` |
| 1725 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A♯ B | 2-2-1-1-2-2-1-1 | {0,2,4,5,6,8,T,E} | `110101110101` |
| 1726 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A♯ B | 3-1-1-1-2-2-1-1 | {0,3,4,5,6,8,T,E} | `110101111001` |
| 1727 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A♯ B | 1-1-1-4-1-2-1-1 | {0,1,2,3,7,8,T,E} | `110110001111` |
| 1728 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A♯ B | 1-1-2-3-1-2-1-1 | {0,1,2,4,7,8,T,E} | `110110010111` |
| 1729 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A♯ B | 1-2-1-3-1-2-1-1 | {0,1,3,4,7,8,T,E} | `110110011011` |
| 1730 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A♯ B | 2-1-1-3-1-2-1-1 | {0,2,3,4,7,8,T,E} | `110110011101` |
| 1731 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A♯ B | 1-1-3-2-1-2-1-1 | {0,1,2,5,7,8,T,E} | `110110100111` |
| 1732 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ A♯ B | 1-2-2-2-1-2-1-1 | {0,1,3,5,7,8,T,E} | `110110101011` |
| 1733 | 8 | Minor Bebop | C D D♯ F G G♯ A♯ B | 2-1-2-2-1-2-1-1 | {0,2,3,5,7,8,T,E} | `110110101101` |
| 1734 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ A♯ B | 1-3-1-2-1-2-1-1 | {0,1,4,5,7,8,T,E} | `110110110011` |
| 1735 | 8 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A♯ B | 2-2-1-2-1-2-1-1 | {0,2,4,5,7,8,T,E} | `110110110101` |
| 1736 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A♯ B | 3-1-1-2-1-2-1-1 | {0,3,4,5,7,8,T,E} | `110110111001` |
| 1737 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A♯ B | 1-1-4-1-1-2-1-1 | {0,1,2,6,7,8,T,E} | `110111000111` |
| 1738 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A♯ B | 1-2-3-1-1-2-1-1 | {0,1,3,6,7,8,T,E} | `110111001011` |
| 1739 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A♯ B | 2-1-3-1-1-2-1-1 | {0,2,3,6,7,8,T,E} | `110111001101` |
| 1740 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A♯ B | 1-3-2-1-1-2-1-1 | {0,1,4,6,7,8,T,E} | `110111010011` |
| 1741 | 8 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A♯ B | 2-2-2-1-1-2-1-1 | {0,2,4,6,7,8,T,E} | `110111010101` |
| 1742 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A♯ B | 3-1-2-1-1-2-1-1 | {0,3,4,6,7,8,T,E} | `110111011001` |
| 1743 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A♯ B | 1-4-1-1-1-2-1-1 | {0,1,5,6,7,8,T,E} | `110111100011` |
| 1744 | 8 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A♯ B | 2-3-1-1-1-2-1-1 | {0,2,5,6,7,8,T,E} | `110111100101` |
| 1745 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A♯ B | 3-2-1-1-1-2-1-1 | {0,3,5,6,7,8,T,E} | `110111101001` |
| 1746 | 8 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A♯ B | 4-1-1-1-1-2-1-1 | {0,4,5,6,7,8,T,E} | `110111110001` |
| 1747 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E A A♯ B | 1-1-1-1-5-1-1-1 | {0,1,2,3,4,9,T,E} | `111000011111` |
| 1748 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F A A♯ B | 1-1-1-2-4-1-1-1 | {0,1,2,3,5,9,T,E} | `111000101111` |
| 1749 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F A A♯ B | 1-1-2-1-4-1-1-1 | {0,1,2,4,5,9,T,E} | `111000110111` |
| 1750 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F A A♯ B | 1-2-1-1-4-1-1-1 | {0,1,3,4,5,9,T,E} | `111000111011` |
| 1751 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F A A♯ B | 2-1-1-1-4-1-1-1 | {0,2,3,4,5,9,T,E} | `111000111101` |
| 1752 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ A A♯ B | 1-1-1-3-3-1-1-1 | {0,1,2,3,6,9,T,E} | `111001001111` |
| 1753 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ A A♯ B | 1-1-2-2-3-1-1-1 | {0,1,2,4,6,9,T,E} | `111001010111` |
| 1754 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ A A♯ B | 1-2-1-2-3-1-1-1 | {0,1,3,4,6,9,T,E} | `111001011011` |
| 1755 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ A A♯ B | 2-1-1-2-3-1-1-1 | {0,2,3,4,6,9,T,E} | `111001011101` |
| 1756 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ A A♯ B | 1-1-3-1-3-1-1-1 | {0,1,2,5,6,9,T,E} | `111001100111` |
| 1757 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ A A♯ B | 1-2-2-1-3-1-1-1 | {0,1,3,5,6,9,T,E} | `111001101011` |
| 1758 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ A A♯ B | 2-1-2-1-3-1-1-1 | {0,2,3,5,6,9,T,E} | `111001101101` |
| 1759 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ A A♯ B | 1-3-1-1-3-1-1-1 | {0,1,4,5,6,9,T,E} | `111001110011` |
| 1760 | 8 | Unnamed / mathematical 12-TET collection | C D E F F♯ A A♯ B | 2-2-1-1-3-1-1-1 | {0,2,4,5,6,9,T,E} | `111001110101` |
| 1761 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ A A♯ B | 3-1-1-1-3-1-1-1 | {0,3,4,5,6,9,T,E} | `111001111001` |
| 1762 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G A A♯ B | 1-1-1-4-2-1-1-1 | {0,1,2,3,7,9,T,E} | `111010001111` |
| 1763 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E G A A♯ B | 1-1-2-3-2-1-1-1 | {0,1,2,4,7,9,T,E} | `111010010111` |
| 1764 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G A A♯ B | 1-2-1-3-2-1-1-1 | {0,1,3,4,7,9,T,E} | `111010011011` |
| 1765 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E G A A♯ B | 2-1-1-3-2-1-1-1 | {0,2,3,4,7,9,T,E} | `111010011101` |
| 1766 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F G A A♯ B | 1-1-3-2-2-1-1-1 | {0,1,2,5,7,9,T,E} | `111010100111` |
| 1767 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G A A♯ B | 1-2-2-2-2-1-1-1 | {0,1,3,5,7,9,T,E} | `111010101011` |
| 1768 | 8 | Dominant Bebop | C D D♯ F G A A♯ B | 2-1-2-2-2-1-1-1 | {0,2,3,5,7,9,T,E} | `111010101101` |
| 1769 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F G A A♯ B | 1-3-1-2-2-1-1-1 | {0,1,4,5,7,9,T,E} | `111010110011` |
| 1770 | 8 | Major Bebop | C D E F G A A♯ B | 2-2-1-2-2-1-1-1 | {0,2,4,5,7,9,T,E} | `111010110101` |
| 1771 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F G A A♯ B | 3-1-1-2-2-1-1-1 | {0,3,4,5,7,9,T,E} | `111010111001` |
| 1772 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G A A♯ B | 1-1-4-1-2-1-1-1 | {0,1,2,6,7,9,T,E} | `111011000111` |
| 1773 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G A A♯ B | 1-2-3-1-2-1-1-1 | {0,1,3,6,7,9,T,E} | `111011001011` |
| 1774 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G A A♯ B | 2-1-3-1-2-1-1-1 | {0,2,3,6,7,9,T,E} | `111011001101` |
| 1775 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G A A♯ B | 1-3-2-1-2-1-1-1 | {0,1,4,6,7,9,T,E} | `111011010011` |
| 1776 | 8 | Unnamed / mathematical 12-TET collection | C D E F♯ G A A♯ B | 2-2-2-1-2-1-1-1 | {0,2,4,6,7,9,T,E} | `111011010101` |
| 1777 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G A A♯ B | 3-1-2-1-2-1-1-1 | {0,3,4,6,7,9,T,E} | `111011011001` |
| 1778 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G A A♯ B | 1-4-1-1-2-1-1-1 | {0,1,5,6,7,9,T,E} | `111011100011` |
| 1779 | 8 | Unnamed / mathematical 12-TET collection | C D F F♯ G A A♯ B | 2-3-1-1-2-1-1-1 | {0,2,5,6,7,9,T,E} | `111011100101` |
| 1780 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G A A♯ B | 3-2-1-1-2-1-1-1 | {0,3,5,6,7,9,T,E} | `111011101001` |
| 1781 | 8 | Unnamed / mathematical 12-TET collection | C E F F♯ G A A♯ B | 4-1-1-1-2-1-1-1 | {0,4,5,6,7,9,T,E} | `111011110001` |
| 1782 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G♯ A A♯ B | 1-1-1-5-1-1-1-1 | {0,1,2,3,8,9,T,E} | `111100001111` |
| 1783 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D E G♯ A A♯ B | 1-1-2-4-1-1-1-1 | {0,1,2,4,8,9,T,E} | `111100010111` |
| 1784 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G♯ A A♯ B | 1-2-1-4-1-1-1-1 | {0,1,3,4,8,9,T,E} | `111100011011` |
| 1785 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ E G♯ A A♯ B | 2-1-1-4-1-1-1-1 | {0,2,3,4,8,9,T,E} | `111100011101` |
| 1786 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F G♯ A A♯ B | 1-1-3-3-1-1-1-1 | {0,1,2,5,8,9,T,E} | `111100100111` |
| 1787 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G♯ A A♯ B | 1-2-2-3-1-1-1-1 | {0,1,3,5,8,9,T,E} | `111100101011` |
| 1788 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F G♯ A A♯ B | 2-1-2-3-1-1-1-1 | {0,2,3,5,8,9,T,E} | `111100101101` |
| 1789 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F G♯ A A♯ B | 1-3-1-3-1-1-1-1 | {0,1,4,5,8,9,T,E} | `111100110011` |
| 1790 | 8 | Unnamed / mathematical 12-TET collection | C D E F G♯ A A♯ B | 2-2-1-3-1-1-1-1 | {0,2,4,5,8,9,T,E} | `111100110101` |
| 1791 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F G♯ A A♯ B | 3-1-1-3-1-1-1-1 | {0,3,4,5,8,9,T,E} | `111100111001` |
| 1792 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G♯ A A♯ B | 1-1-4-2-1-1-1-1 | {0,1,2,6,8,9,T,E} | `111101000111` |
| 1793 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G♯ A A♯ B | 1-2-3-2-1-1-1-1 | {0,1,3,6,8,9,T,E} | `111101001011` |
| 1794 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G♯ A A♯ B | 2-1-3-2-1-1-1-1 | {0,2,3,6,8,9,T,E} | `111101001101` |
| 1795 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G♯ A A♯ B | 1-3-2-2-1-1-1-1 | {0,1,4,6,8,9,T,E} | `111101010011` |
| 1796 | 8 | Unnamed / mathematical 12-TET collection | C D E F♯ G♯ A A♯ B | 2-2-2-2-1-1-1-1 | {0,2,4,6,8,9,T,E} | `111101010101` |
| 1797 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G♯ A A♯ B | 3-1-2-2-1-1-1-1 | {0,3,4,6,8,9,T,E} | `111101011001` |
| 1798 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G♯ A A♯ B | 1-4-1-2-1-1-1-1 | {0,1,5,6,8,9,T,E} | `111101100011` |
| 1799 | 8 | Unnamed / mathematical 12-TET collection | C D F F♯ G♯ A A♯ B | 2-3-1-2-1-1-1-1 | {0,2,5,6,8,9,T,E} | `111101100101` |
| 1800 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G♯ A A♯ B | 3-2-1-2-1-1-1-1 | {0,3,5,6,8,9,T,E} | `111101101001` |
| 1801 | 8 | Unnamed / mathematical 12-TET collection | C E F F♯ G♯ A A♯ B | 4-1-1-2-1-1-1-1 | {0,4,5,6,8,9,T,E} | `111101110001` |
| 1802 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D G G♯ A A♯ B | 1-1-5-1-1-1-1-1 | {0,1,2,7,8,9,T,E} | `111110000111` |
| 1803 | 8 | Unnamed / mathematical 12-TET collection | C C♯ D♯ G G♯ A A♯ B | 1-2-4-1-1-1-1-1 | {0,1,3,7,8,9,T,E} | `111110001011` |
| 1804 | 8 | Unnamed / mathematical 12-TET collection | C D D♯ G G♯ A A♯ B | 2-1-4-1-1-1-1-1 | {0,2,3,7,8,9,T,E} | `111110001101` |
| 1805 | 8 | Unnamed / mathematical 12-TET collection | C C♯ E G G♯ A A♯ B | 1-3-3-1-1-1-1-1 | {0,1,4,7,8,9,T,E} | `111110010011` |
| 1806 | 8 | Unnamed / mathematical 12-TET collection | C D E G G♯ A A♯ B | 2-2-3-1-1-1-1-1 | {0,2,4,7,8,9,T,E} | `111110010101` |
| 1807 | 8 | Unnamed / mathematical 12-TET collection | C D♯ E G G♯ A A♯ B | 3-1-3-1-1-1-1-1 | {0,3,4,7,8,9,T,E} | `111110011001` |
| 1808 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F G G♯ A A♯ B | 1-4-2-1-1-1-1-1 | {0,1,5,7,8,9,T,E} | `111110100011` |
| 1809 | 8 | Unnamed / mathematical 12-TET collection | C D F G G♯ A A♯ B | 2-3-2-1-1-1-1-1 | {0,2,5,7,8,9,T,E} | `111110100101` |
| 1810 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F G G♯ A A♯ B | 3-2-2-1-1-1-1-1 | {0,3,5,7,8,9,T,E} | `111110101001` |
| 1811 | 8 | Unnamed / mathematical 12-TET collection | C E F G G♯ A A♯ B | 4-1-2-1-1-1-1-1 | {0,4,5,7,8,9,T,E} | `111110110001` |
| 1812 | 8 | Unnamed / mathematical 12-TET collection | C C♯ F♯ G G♯ A A♯ B | 1-5-1-1-1-1-1-1 | {0,1,6,7,8,9,T,E} | `111111000011` |
| 1813 | 8 | Unnamed / mathematical 12-TET collection | C D F♯ G G♯ A A♯ B | 2-4-1-1-1-1-1-1 | {0,2,6,7,8,9,T,E} | `111111000101` |
| 1814 | 8 | Unnamed / mathematical 12-TET collection | C D♯ F♯ G G♯ A A♯ B | 3-3-1-1-1-1-1-1 | {0,3,6,7,8,9,T,E} | `111111001001` |
| 1815 | 8 | Unnamed / mathematical 12-TET collection | C E F♯ G G♯ A A♯ B | 4-2-1-1-1-1-1-1 | {0,4,6,7,8,9,T,E} | `111111010001` |
| 1816 | 8 | Unnamed / mathematical 12-TET collection | C F F♯ G G♯ A A♯ B | 5-1-1-1-1-1-1-1 | {0,5,6,7,8,9,T,E} | `111111100001` |
| 1817 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ | 1-1-1-1-1-1-1-1-4 | {0,1,2,3,4,5,6,7,8} | `000111111111` |
| 1818 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A | 1-1-1-1-1-1-1-2-3 | {0,1,2,3,4,5,6,7,9} | `001011111111` |
| 1819 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A | 1-1-1-1-1-1-2-1-3 | {0,1,2,3,4,5,6,8,9} | `001101111111` |
| 1820 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A | 1-1-1-1-1-2-1-1-3 | {0,1,2,3,4,5,7,8,9} | `001110111111` |
| 1821 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A | 1-1-1-1-2-1-1-1-3 | {0,1,2,3,4,6,7,8,9} | `001111011111` |
| 1822 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A | 1-1-1-2-1-1-1-1-3 | {0,1,2,3,5,6,7,8,9} | `001111101111` |
| 1823 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A | 1-1-2-1-1-1-1-1-3 | {0,1,2,4,5,6,7,8,9} | `001111110111` |
| 1824 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A | 1-2-1-1-1-1-1-1-3 | {0,1,3,4,5,6,7,8,9} | `001111111011` |
| 1825 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A | 2-1-1-1-1-1-1-1-3 | {0,2,3,4,5,6,7,8,9} | `001111111101` |
| 1826 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A♯ | 1-1-1-1-1-1-1-3-2 | {0,1,2,3,4,5,6,7,T} | `010011111111` |
| 1827 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A♯ | 1-1-1-1-1-1-2-2-2 | {0,1,2,3,4,5,6,8,T} | `010101111111` |
| 1828 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A♯ | 1-1-1-1-1-2-1-2-2 | {0,1,2,3,4,5,7,8,T} | `010110111111` |
| 1829 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A♯ | 1-1-1-1-2-1-1-2-2 | {0,1,2,3,4,6,7,8,T} | `010111011111` |
| 1830 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A♯ | 1-1-1-2-1-1-1-2-2 | {0,1,2,3,5,6,7,8,T} | `010111101111` |
| 1831 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A♯ | 1-1-2-1-1-1-1-2-2 | {0,1,2,4,5,6,7,8,T} | `010111110111` |
| 1832 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A♯ | 1-2-1-1-1-1-1-2-2 | {0,1,3,4,5,6,7,8,T} | `010111111011` |
| 1833 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A♯ | 2-1-1-1-1-1-1-2-2 | {0,2,3,4,5,6,7,8,T} | `010111111101` |
| 1834 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A A♯ | 1-1-1-1-1-1-3-1-2 | {0,1,2,3,4,5,6,9,T} | `011001111111` |
| 1835 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A A♯ | 1-1-1-1-1-2-2-1-2 | {0,1,2,3,4,5,7,9,T} | `011010111111` |
| 1836 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A A♯ | 1-1-1-1-2-1-2-1-2 | {0,1,2,3,4,6,7,9,T} | `011011011111` |
| 1837 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A A♯ | 1-1-1-2-1-1-2-1-2 | {0,1,2,3,5,6,7,9,T} | `011011101111` |
| 1838 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A A♯ | 1-1-2-1-1-1-2-1-2 | {0,1,2,4,5,6,7,9,T} | `011011110111` |
| 1839 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A A♯ | 1-2-1-1-1-1-2-1-2 | {0,1,3,4,5,6,7,9,T} | `011011111011` |
| 1840 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A A♯ | 2-1-1-1-1-1-2-1-2 | {0,2,3,4,5,6,7,9,T} | `011011111101` |
| 1841 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A A♯ | 1-1-1-1-1-3-1-1-2 | {0,1,2,3,4,5,8,9,T} | `011100111111` |
| 1842 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A A♯ | 1-1-1-1-2-2-1-1-2 | {0,1,2,3,4,6,8,9,T} | `011101011111` |
| 1843 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A A♯ | 1-1-1-2-1-2-1-1-2 | {0,1,2,3,5,6,8,9,T} | `011101101111` |
| 1844 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A A♯ | 1-1-2-1-1-2-1-1-2 | {0,1,2,4,5,6,8,9,T} | `011101110111` |
| 1845 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A A♯ | 1-2-1-1-1-2-1-1-2 | {0,1,3,4,5,6,8,9,T} | `011101111011` |
| 1846 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A A♯ | 2-1-1-1-1-2-1-1-2 | {0,2,3,4,5,6,8,9,T} | `011101111101` |
| 1847 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A A♯ | 1-1-1-1-3-1-1-1-2 | {0,1,2,3,4,7,8,9,T} | `011110011111` |
| 1848 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A A♯ | 1-1-1-2-2-1-1-1-2 | {0,1,2,3,5,7,8,9,T} | `011110101111` |
| 1849 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A A♯ | 1-1-2-1-2-1-1-1-2 | {0,1,2,4,5,7,8,9,T} | `011110110111` |
| 1850 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A A♯ | 1-2-1-1-2-1-1-1-2 | {0,1,3,4,5,7,8,9,T} | `011110111011` |
| 1851 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A A♯ | 2-1-1-1-2-1-1-1-2 | {0,2,3,4,5,7,8,9,T} | `011110111101` |
| 1852 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A A♯ | 1-1-1-3-1-1-1-1-2 | {0,1,2,3,6,7,8,9,T} | `011111001111` |
| 1853 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A A♯ | 1-1-2-2-1-1-1-1-2 | {0,1,2,4,6,7,8,9,T} | `011111010111` |
| 1854 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A A♯ | 1-2-1-2-1-1-1-1-2 | {0,1,3,4,6,7,8,9,T} | `011111011011` |
| 1855 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A A♯ | 2-1-1-2-1-1-1-1-2 | {0,2,3,4,6,7,8,9,T} | `011111011101` |
| 1856 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A A♯ | 1-1-3-1-1-1-1-1-2 | {0,1,2,5,6,7,8,9,T} | `011111100111` |
| 1857 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A A♯ | 1-2-2-1-1-1-1-1-2 | {0,1,3,5,6,7,8,9,T} | `011111101011` |
| 1858 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A A♯ | 2-1-2-1-1-1-1-1-2 | {0,2,3,5,6,7,8,9,T} | `011111101101` |
| 1859 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A A♯ | 1-3-1-1-1-1-1-1-2 | {0,1,4,5,6,7,8,9,T} | `011111110011` |
| 1860 | 9 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A A♯ | 2-2-1-1-1-1-1-1-2 | {0,2,4,5,6,7,8,9,T} | `011111110101` |
| 1861 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A A♯ | 3-1-1-1-1-1-1-1-2 | {0,3,4,5,6,7,8,9,T} | `011111111001` |
| 1862 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G B | 1-1-1-1-1-1-1-4-1 | {0,1,2,3,4,5,6,7,E} | `100011111111` |
| 1863 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ B | 1-1-1-1-1-1-2-3-1 | {0,1,2,3,4,5,6,8,E} | `100101111111` |
| 1864 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ B | 1-1-1-1-1-2-1-3-1 | {0,1,2,3,4,5,7,8,E} | `100110111111` |
| 1865 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ B | 1-1-1-1-2-1-1-3-1 | {0,1,2,3,4,6,7,8,E} | `100111011111` |
| 1866 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ B | 1-1-1-2-1-1-1-3-1 | {0,1,2,3,5,6,7,8,E} | `100111101111` |
| 1867 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ B | 1-1-2-1-1-1-1-3-1 | {0,1,2,4,5,6,7,8,E} | `100111110111` |
| 1868 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ B | 1-2-1-1-1-1-1-3-1 | {0,1,3,4,5,6,7,8,E} | `100111111011` |
| 1869 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ B | 2-1-1-1-1-1-1-3-1 | {0,2,3,4,5,6,7,8,E} | `100111111101` |
| 1870 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A B | 1-1-1-1-1-1-3-2-1 | {0,1,2,3,4,5,6,9,E} | `101001111111` |
| 1871 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A B | 1-1-1-1-1-2-2-2-1 | {0,1,2,3,4,5,7,9,E} | `101010111111` |
| 1872 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A B | 1-1-1-1-2-1-2-2-1 | {0,1,2,3,4,6,7,9,E} | `101011011111` |
| 1873 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A B | 1-1-1-2-1-1-2-2-1 | {0,1,2,3,5,6,7,9,E} | `101011101111` |
| 1874 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A B | 1-1-2-1-1-1-2-2-1 | {0,1,2,4,5,6,7,9,E} | `101011110111` |
| 1875 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A B | 1-2-1-1-1-1-2-2-1 | {0,1,3,4,5,6,7,9,E} | `101011111011` |
| 1876 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A B | 2-1-1-1-1-1-2-2-1 | {0,2,3,4,5,6,7,9,E} | `101011111101` |
| 1877 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A B | 1-1-1-1-1-3-1-2-1 | {0,1,2,3,4,5,8,9,E} | `101100111111` |
| 1878 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A B | 1-1-1-1-2-2-1-2-1 | {0,1,2,3,4,6,8,9,E} | `101101011111` |
| 1879 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A B | 1-1-1-2-1-2-1-2-1 | {0,1,2,3,5,6,8,9,E} | `101101101111` |
| 1880 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A B | 1-1-2-1-1-2-1-2-1 | {0,1,2,4,5,6,8,9,E} | `101101110111` |
| 1881 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A B | 1-2-1-1-1-2-1-2-1 | {0,1,3,4,5,6,8,9,E} | `101101111011` |
| 1882 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A B | 2-1-1-1-1-2-1-2-1 | {0,2,3,4,5,6,8,9,E} | `101101111101` |
| 1883 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A B | 1-1-1-1-3-1-1-2-1 | {0,1,2,3,4,7,8,9,E} | `101110011111` |
| 1884 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A B | 1-1-1-2-2-1-1-2-1 | {0,1,2,3,5,7,8,9,E} | `101110101111` |
| 1885 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A B | 1-1-2-1-2-1-1-2-1 | {0,1,2,4,5,7,8,9,E} | `101110110111` |
| 1886 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A B | 1-2-1-1-2-1-1-2-1 | {0,1,3,4,5,7,8,9,E} | `101110111011` |
| 1887 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A B | 2-1-1-1-2-1-1-2-1 | {0,2,3,4,5,7,8,9,E} | `101110111101` |
| 1888 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A B | 1-1-1-3-1-1-1-2-1 | {0,1,2,3,6,7,8,9,E} | `101111001111` |
| 1889 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A B | 1-1-2-2-1-1-1-2-1 | {0,1,2,4,6,7,8,9,E} | `101111010111` |
| 1890 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A B | 1-2-1-2-1-1-1-2-1 | {0,1,3,4,6,7,8,9,E} | `101111011011` |
| 1891 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A B | 2-1-1-2-1-1-1-2-1 | {0,2,3,4,6,7,8,9,E} | `101111011101` |
| 1892 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A B | 1-1-3-1-1-1-1-2-1 | {0,1,2,5,6,7,8,9,E} | `101111100111` |
| 1893 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A B | 1-2-2-1-1-1-1-2-1 | {0,1,3,5,6,7,8,9,E} | `101111101011` |
| 1894 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A B | 2-1-2-1-1-1-1-2-1 | {0,2,3,5,6,7,8,9,E} | `101111101101` |
| 1895 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A B | 1-3-1-1-1-1-1-2-1 | {0,1,4,5,6,7,8,9,E} | `101111110011` |
| 1896 | 9 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A B | 2-2-1-1-1-1-1-2-1 | {0,2,4,5,6,7,8,9,E} | `101111110101` |
| 1897 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A B | 3-1-1-1-1-1-1-2-1 | {0,3,4,5,6,7,8,9,E} | `101111111001` |
| 1898 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A♯ B | 1-1-1-1-1-1-4-1-1 | {0,1,2,3,4,5,6,T,E} | `110001111111` |
| 1899 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A♯ B | 1-1-1-1-1-2-3-1-1 | {0,1,2,3,4,5,7,T,E} | `110010111111` |
| 1900 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A♯ B | 1-1-1-1-2-1-3-1-1 | {0,1,2,3,4,6,7,T,E} | `110011011111` |
| 1901 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A♯ B | 1-1-1-2-1-1-3-1-1 | {0,1,2,3,5,6,7,T,E} | `110011101111` |
| 1902 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A♯ B | 1-1-2-1-1-1-3-1-1 | {0,1,2,4,5,6,7,T,E} | `110011110111` |
| 1903 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A♯ B | 1-2-1-1-1-1-3-1-1 | {0,1,3,4,5,6,7,T,E} | `110011111011` |
| 1904 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A♯ B | 2-1-1-1-1-1-3-1-1 | {0,2,3,4,5,6,7,T,E} | `110011111101` |
| 1905 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A♯ B | 1-1-1-1-1-3-2-1-1 | {0,1,2,3,4,5,8,T,E} | `110100111111` |
| 1906 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A♯ B | 1-1-1-1-2-2-2-1-1 | {0,1,2,3,4,6,8,T,E} | `110101011111` |
| 1907 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A♯ B | 1-1-1-2-1-2-2-1-1 | {0,1,2,3,5,6,8,T,E} | `110101101111` |
| 1908 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A♯ B | 1-1-2-1-1-2-2-1-1 | {0,1,2,4,5,6,8,T,E} | `110101110111` |
| 1909 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A♯ B | 1-2-1-1-1-2-2-1-1 | {0,1,3,4,5,6,8,T,E} | `110101111011` |
| 1910 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A♯ B | 2-1-1-1-1-2-2-1-1 | {0,2,3,4,5,6,8,T,E} | `110101111101` |
| 1911 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A♯ B | 1-1-1-1-3-1-2-1-1 | {0,1,2,3,4,7,8,T,E} | `110110011111` |
| 1912 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A♯ B | 1-1-1-2-2-1-2-1-1 | {0,1,2,3,5,7,8,T,E} | `110110101111` |
| 1913 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A♯ B | 1-1-2-1-2-1-2-1-1 | {0,1,2,4,5,7,8,T,E} | `110110110111` |
| 1914 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A♯ B | 1-2-1-1-2-1-2-1-1 | {0,1,3,4,5,7,8,T,E} | `110110111011` |
| 1915 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A♯ B | 2-1-1-1-2-1-2-1-1 | {0,2,3,4,5,7,8,T,E} | `110110111101` |
| 1916 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A♯ B | 1-1-1-3-1-1-2-1-1 | {0,1,2,3,6,7,8,T,E} | `110111001111` |
| 1917 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A♯ B | 1-1-2-2-1-1-2-1-1 | {0,1,2,4,6,7,8,T,E} | `110111010111` |
| 1918 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A♯ B | 1-2-1-2-1-1-2-1-1 | {0,1,3,4,6,7,8,T,E} | `110111011011` |
| 1919 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A♯ B | 2-1-1-2-1-1-2-1-1 | {0,2,3,4,6,7,8,T,E} | `110111011101` |
| 1920 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A♯ B | 1-1-3-1-1-1-2-1-1 | {0,1,2,5,6,7,8,T,E} | `110111100111` |
| 1921 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A♯ B | 1-2-2-1-1-1-2-1-1 | {0,1,3,5,6,7,8,T,E} | `110111101011` |
| 1922 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A♯ B | 2-1-2-1-1-1-2-1-1 | {0,2,3,5,6,7,8,T,E} | `110111101101` |
| 1923 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A♯ B | 1-3-1-1-1-1-2-1-1 | {0,1,4,5,6,7,8,T,E} | `110111110011` |
| 1924 | 9 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A♯ B | 2-2-1-1-1-1-2-1-1 | {0,2,4,5,6,7,8,T,E} | `110111110101` |
| 1925 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A♯ B | 3-1-1-1-1-1-2-1-1 | {0,3,4,5,6,7,8,T,E} | `110111111001` |
| 1926 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F A A♯ B | 1-1-1-1-1-4-1-1-1 | {0,1,2,3,4,5,9,T,E} | `111000111111` |
| 1927 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ A A♯ B | 1-1-1-1-2-3-1-1-1 | {0,1,2,3,4,6,9,T,E} | `111001011111` |
| 1928 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ A A♯ B | 1-1-1-2-1-3-1-1-1 | {0,1,2,3,5,6,9,T,E} | `111001101111` |
| 1929 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ A A♯ B | 1-1-2-1-1-3-1-1-1 | {0,1,2,4,5,6,9,T,E} | `111001110111` |
| 1930 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ A A♯ B | 1-2-1-1-1-3-1-1-1 | {0,1,3,4,5,6,9,T,E} | `111001111011` |
| 1931 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ A A♯ B | 2-1-1-1-1-3-1-1-1 | {0,2,3,4,5,6,9,T,E} | `111001111101` |
| 1932 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G A A♯ B | 1-1-1-1-3-2-1-1-1 | {0,1,2,3,4,7,9,T,E} | `111010011111` |
| 1933 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G A A♯ B | 1-1-1-2-2-2-1-1-1 | {0,1,2,3,5,7,9,T,E} | `111010101111` |
| 1934 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F G A A♯ B | 1-1-2-1-2-2-1-1-1 | {0,1,2,4,5,7,9,T,E} | `111010110111` |
| 1935 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G A A♯ B | 1-2-1-1-2-2-1-1-1 | {0,1,3,4,5,7,9,T,E} | `111010111011` |
| 1936 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F G A A♯ B | 2-1-1-1-2-2-1-1-1 | {0,2,3,4,5,7,9,T,E} | `111010111101` |
| 1937 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G A A♯ B | 1-1-1-3-1-2-1-1-1 | {0,1,2,3,6,7,9,T,E} | `111011001111` |
| 1938 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G A A♯ B | 1-1-2-2-1-2-1-1-1 | {0,1,2,4,6,7,9,T,E} | `111011010111` |
| 1939 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G A A♯ B | 1-2-1-2-1-2-1-1-1 | {0,1,3,4,6,7,9,T,E} | `111011011011` |
| 1940 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G A A♯ B | 2-1-1-2-1-2-1-1-1 | {0,2,3,4,6,7,9,T,E} | `111011011101` |
| 1941 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G A A♯ B | 1-1-3-1-1-2-1-1-1 | {0,1,2,5,6,7,9,T,E} | `111011100111` |
| 1942 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G A A♯ B | 1-2-2-1-1-2-1-1-1 | {0,1,3,5,6,7,9,T,E} | `111011101011` |
| 1943 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G A A♯ B | 2-1-2-1-1-2-1-1-1 | {0,2,3,5,6,7,9,T,E} | `111011101101` |
| 1944 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G A A♯ B | 1-3-1-1-1-2-1-1-1 | {0,1,4,5,6,7,9,T,E} | `111011110011` |
| 1945 | 9 | Unnamed / mathematical 12-TET collection | C D E F F♯ G A A♯ B | 2-2-1-1-1-2-1-1-1 | {0,2,4,5,6,7,9,T,E} | `111011110101` |
| 1946 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G A A♯ B | 3-1-1-1-1-2-1-1-1 | {0,3,4,5,6,7,9,T,E} | `111011111001` |
| 1947 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G♯ A A♯ B | 1-1-1-1-4-1-1-1-1 | {0,1,2,3,4,8,9,T,E} | `111100011111` |
| 1948 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G♯ A A♯ B | 1-1-1-2-3-1-1-1-1 | {0,1,2,3,5,8,9,T,E} | `111100101111` |
| 1949 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F G♯ A A♯ B | 1-1-2-1-3-1-1-1-1 | {0,1,2,4,5,8,9,T,E} | `111100110111` |
| 1950 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G♯ A A♯ B | 1-2-1-1-3-1-1-1-1 | {0,1,3,4,5,8,9,T,E} | `111100111011` |
| 1951 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F G♯ A A♯ B | 2-1-1-1-3-1-1-1-1 | {0,2,3,4,5,8,9,T,E} | `111100111101` |
| 1952 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G♯ A A♯ B | 1-1-1-3-2-1-1-1-1 | {0,1,2,3,6,8,9,T,E} | `111101001111` |
| 1953 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G♯ A A♯ B | 1-1-2-2-2-1-1-1-1 | {0,1,2,4,6,8,9,T,E} | `111101010111` |
| 1954 | 9 | Messiaen Mode 7 (one common transposition) | C C♯ D♯ E F♯ G♯ A A♯ B | 1-2-1-2-2-1-1-1-1 | {0,1,3,4,6,8,9,T,E} | `111101011011` |
| 1955 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G♯ A A♯ B | 2-1-1-2-2-1-1-1-1 | {0,2,3,4,6,8,9,T,E} | `111101011101` |
| 1956 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G♯ A A♯ B | 1-1-3-1-2-1-1-1-1 | {0,1,2,5,6,8,9,T,E} | `111101100111` |
| 1957 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G♯ A A♯ B | 1-2-2-1-2-1-1-1-1 | {0,1,3,5,6,8,9,T,E} | `111101101011` |
| 1958 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G♯ A A♯ B | 2-1-2-1-2-1-1-1-1 | {0,2,3,5,6,8,9,T,E} | `111101101101` |
| 1959 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G♯ A A♯ B | 1-3-1-1-2-1-1-1-1 | {0,1,4,5,6,8,9,T,E} | `111101110011` |
| 1960 | 9 | Unnamed / mathematical 12-TET collection | C D E F F♯ G♯ A A♯ B | 2-2-1-1-2-1-1-1-1 | {0,2,4,5,6,8,9,T,E} | `111101110101` |
| 1961 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G♯ A A♯ B | 3-1-1-1-2-1-1-1-1 | {0,3,4,5,6,8,9,T,E} | `111101111001` |
| 1962 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ G G♯ A A♯ B | 1-1-1-4-1-1-1-1-1 | {0,1,2,3,7,8,9,T,E} | `111110001111` |
| 1963 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D E G G♯ A A♯ B | 1-1-2-3-1-1-1-1-1 | {0,1,2,4,7,8,9,T,E} | `111110010111` |
| 1964 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E G G♯ A A♯ B | 1-2-1-3-1-1-1-1-1 | {0,1,3,4,7,8,9,T,E} | `111110011011` |
| 1965 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ E G G♯ A A♯ B | 2-1-1-3-1-1-1-1-1 | {0,2,3,4,7,8,9,T,E} | `111110011101` |
| 1966 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F G G♯ A A♯ B | 1-1-3-2-1-1-1-1-1 | {0,1,2,5,7,8,9,T,E} | `111110100111` |
| 1967 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F G G♯ A A♯ B | 1-2-2-2-1-1-1-1-1 | {0,1,3,5,7,8,9,T,E} | `111110101011` |
| 1968 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F G G♯ A A♯ B | 2-1-2-2-1-1-1-1-1 | {0,2,3,5,7,8,9,T,E} | `111110101101` |
| 1969 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F G G♯ A A♯ B | 1-3-1-2-1-1-1-1-1 | {0,1,4,5,7,8,9,T,E} | `111110110011` |
| 1970 | 9 | Unnamed / mathematical 12-TET collection | C D E F G G♯ A A♯ B | 2-2-1-2-1-1-1-1-1 | {0,2,4,5,7,8,9,T,E} | `111110110101` |
| 1971 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F G G♯ A A♯ B | 3-1-1-2-1-1-1-1-1 | {0,3,4,5,7,8,9,T,E} | `111110111001` |
| 1972 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D F♯ G G♯ A A♯ B | 1-1-4-1-1-1-1-1-1 | {0,1,2,6,7,8,9,T,E} | `111111000111` |
| 1973 | 9 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F♯ G G♯ A A♯ B | 1-2-3-1-1-1-1-1-1 | {0,1,3,6,7,8,9,T,E} | `111111001011` |
| 1974 | 9 | Unnamed / mathematical 12-TET collection | C D D♯ F♯ G G♯ A A♯ B | 2-1-3-1-1-1-1-1-1 | {0,2,3,6,7,8,9,T,E} | `111111001101` |
| 1975 | 9 | Unnamed / mathematical 12-TET collection | C C♯ E F♯ G G♯ A A♯ B | 1-3-2-1-1-1-1-1-1 | {0,1,4,6,7,8,9,T,E} | `111111010011` |
| 1976 | 9 | Unnamed / mathematical 12-TET collection | C D E F♯ G G♯ A A♯ B | 2-2-2-1-1-1-1-1-1 | {0,2,4,6,7,8,9,T,E} | `111111010101` |
| 1977 | 9 | Unnamed / mathematical 12-TET collection | C D♯ E F♯ G G♯ A A♯ B | 3-1-2-1-1-1-1-1-1 | {0,3,4,6,7,8,9,T,E} | `111111011001` |
| 1978 | 9 | Unnamed / mathematical 12-TET collection | C C♯ F F♯ G G♯ A A♯ B | 1-4-1-1-1-1-1-1-1 | {0,1,5,6,7,8,9,T,E} | `111111100011` |
| 1979 | 9 | Unnamed / mathematical 12-TET collection | C D F F♯ G G♯ A A♯ B | 2-3-1-1-1-1-1-1-1 | {0,2,5,6,7,8,9,T,E} | `111111100101` |
| 1980 | 9 | Unnamed / mathematical 12-TET collection | C D♯ F F♯ G G♯ A A♯ B | 3-2-1-1-1-1-1-1-1 | {0,3,5,6,7,8,9,T,E} | `111111101001` |
| 1981 | 9 | Unnamed / mathematical 12-TET collection | C E F F♯ G G♯ A A♯ B | 4-1-1-1-1-1-1-1-1 | {0,4,5,6,7,8,9,T,E} | `111111110001` |
| 1982 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A | 1-1-1-1-1-1-1-1-1-3 | {0,1,2,3,4,5,6,7,8,9} | `001111111111` |
| 1983 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A♯ | 1-1-1-1-1-1-1-1-2-2 | {0,1,2,3,4,5,6,7,8,T} | `010111111111` |
| 1984 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A A♯ | 1-1-1-1-1-1-1-2-1-2 | {0,1,2,3,4,5,6,7,9,T} | `011011111111` |
| 1985 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A A♯ | 1-1-1-1-1-1-2-1-1-2 | {0,1,2,3,4,5,6,8,9,T} | `011101111111` |
| 1986 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A A♯ | 1-1-1-1-1-2-1-1-1-2 | {0,1,2,3,4,5,7,8,9,T} | `011110111111` |
| 1987 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A A♯ | 1-1-1-1-2-1-1-1-1-2 | {0,1,2,3,4,6,7,8,9,T} | `011111011111` |
| 1988 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A A♯ | 1-1-1-2-1-1-1-1-1-2 | {0,1,2,3,5,6,7,8,9,T} | `011111101111` |
| 1989 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A A♯ | 1-1-2-1-1-1-1-1-1-2 | {0,1,2,4,5,6,7,8,9,T} | `011111110111` |
| 1990 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A A♯ | 1-2-1-1-1-1-1-1-1-2 | {0,1,3,4,5,6,7,8,9,T} | `011111111011` |
| 1991 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A A♯ | 2-1-1-1-1-1-1-1-1-2 | {0,2,3,4,5,6,7,8,9,T} | `011111111101` |
| 1992 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ B | 1-1-1-1-1-1-1-1-3-1 | {0,1,2,3,4,5,6,7,8,E} | `100111111111` |
| 1993 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A B | 1-1-1-1-1-1-1-2-2-1 | {0,1,2,3,4,5,6,7,9,E} | `101011111111` |
| 1994 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A B | 1-1-1-1-1-1-2-1-2-1 | {0,1,2,3,4,5,6,8,9,E} | `101101111111` |
| 1995 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A B | 1-1-1-1-1-2-1-1-2-1 | {0,1,2,3,4,5,7,8,9,E} | `101110111111` |
| 1996 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A B | 1-1-1-1-2-1-1-1-2-1 | {0,1,2,3,4,6,7,8,9,E} | `101111011111` |
| 1997 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A B | 1-1-1-2-1-1-1-1-2-1 | {0,1,2,3,5,6,7,8,9,E} | `101111101111` |
| 1998 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A B | 1-1-2-1-1-1-1-1-2-1 | {0,1,2,4,5,6,7,8,9,E} | `101111110111` |
| 1999 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A B | 1-2-1-1-1-1-1-1-2-1 | {0,1,3,4,5,6,7,8,9,E} | `101111111011` |
| 2000 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A B | 2-1-1-1-1-1-1-1-2-1 | {0,2,3,4,5,6,7,8,9,E} | `101111111101` |
| 2001 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A♯ B | 1-1-1-1-1-1-1-3-1-1 | {0,1,2,3,4,5,6,7,T,E} | `110011111111` |
| 2002 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A♯ B | 1-1-1-1-1-1-2-2-1-1 | {0,1,2,3,4,5,6,8,T,E} | `110101111111` |
| 2003 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A♯ B | 1-1-1-1-1-2-1-2-1-1 | {0,1,2,3,4,5,7,8,T,E} | `110110111111` |
| 2004 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A♯ B | 1-1-1-1-2-1-1-2-1-1 | {0,1,2,3,4,6,7,8,T,E} | `110111011111` |
| 2005 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A♯ B | 1-1-1-2-1-1-1-2-1-1 | {0,1,2,3,5,6,7,8,T,E} | `110111101111` |
| 2006 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A♯ B | 1-1-2-1-1-1-1-2-1-1 | {0,1,2,4,5,6,7,8,T,E} | `110111110111` |
| 2007 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A♯ B | 1-2-1-1-1-1-1-2-1-1 | {0,1,3,4,5,6,7,8,T,E} | `110111111011` |
| 2008 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A♯ B | 2-1-1-1-1-1-1-2-1-1 | {0,2,3,4,5,6,7,8,T,E} | `110111111101` |
| 2009 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ A A♯ B | 1-1-1-1-1-1-3-1-1-1 | {0,1,2,3,4,5,6,9,T,E} | `111001111111` |
| 2010 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G A A♯ B | 1-1-1-1-1-2-2-1-1-1 | {0,1,2,3,4,5,7,9,T,E} | `111010111111` |
| 2011 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G A A♯ B | 1-1-1-1-2-1-2-1-1-1 | {0,1,2,3,4,6,7,9,T,E} | `111011011111` |
| 2012 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G A A♯ B | 1-1-1-2-1-1-2-1-1-1 | {0,1,2,3,5,6,7,9,T,E} | `111011101111` |
| 2013 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G A A♯ B | 1-1-2-1-1-1-2-1-1-1 | {0,1,2,4,5,6,7,9,T,E} | `111011110111` |
| 2014 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G A A♯ B | 1-2-1-1-1-1-2-1-1-1 | {0,1,3,4,5,6,7,9,T,E} | `111011111011` |
| 2015 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G A A♯ B | 2-1-1-1-1-1-2-1-1-1 | {0,2,3,4,5,6,7,9,T,E} | `111011111101` |
| 2016 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G♯ A A♯ B | 1-1-1-1-1-3-1-1-1-1 | {0,1,2,3,4,5,8,9,T,E} | `111100111111` |
| 2017 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G♯ A A♯ B | 1-1-1-1-2-2-1-1-1-1 | {0,1,2,3,4,6,8,9,T,E} | `111101011111` |
| 2018 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G♯ A A♯ B | 1-1-1-2-1-2-1-1-1-1 | {0,1,2,3,5,6,8,9,T,E} | `111101101111` |
| 2019 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G♯ A A♯ B | 1-1-2-1-1-2-1-1-1-1 | {0,1,2,4,5,6,8,9,T,E} | `111101110111` |
| 2020 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G♯ A A♯ B | 1-2-1-1-1-2-1-1-1-1 | {0,1,3,4,5,6,8,9,T,E} | `111101111011` |
| 2021 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G♯ A A♯ B | 2-1-1-1-1-2-1-1-1-1 | {0,2,3,4,5,6,8,9,T,E} | `111101111101` |
| 2022 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E G G♯ A A♯ B | 1-1-1-1-3-1-1-1-1-1 | {0,1,2,3,4,7,8,9,T,E} | `111110011111` |
| 2023 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F G G♯ A A♯ B | 1-1-1-2-2-1-1-1-1-1 | {0,1,2,3,5,7,8,9,T,E} | `111110101111` |
| 2024 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F G G♯ A A♯ B | 1-1-2-1-2-1-1-1-1-1 | {0,1,2,4,5,7,8,9,T,E} | `111110110111` |
| 2025 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F G G♯ A A♯ B | 1-2-1-1-2-1-1-1-1-1 | {0,1,3,4,5,7,8,9,T,E} | `111110111011` |
| 2026 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F G G♯ A A♯ B | 2-1-1-1-2-1-1-1-1-1 | {0,2,3,4,5,7,8,9,T,E} | `111110111101` |
| 2027 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F♯ G G♯ A A♯ B | 1-1-1-3-1-1-1-1-1-1 | {0,1,2,3,6,7,8,9,T,E} | `111111001111` |
| 2028 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D E F♯ G G♯ A A♯ B | 1-1-2-2-1-1-1-1-1-1 | {0,1,2,4,6,7,8,9,T,E} | `111111010111` |
| 2029 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F♯ G G♯ A A♯ B | 1-2-1-2-1-1-1-1-1-1 | {0,1,3,4,6,7,8,9,T,E} | `111111011011` |
| 2030 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ E F♯ G G♯ A A♯ B | 2-1-1-2-1-1-1-1-1-1 | {0,2,3,4,6,7,8,9,T,E} | `111111011101` |
| 2031 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D F F♯ G G♯ A A♯ B | 1-1-3-1-1-1-1-1-1-1 | {0,1,2,5,6,7,8,9,T,E} | `111111100111` |
| 2032 | 10 | Unnamed / mathematical 12-TET collection | C C♯ D♯ F F♯ G G♯ A A♯ B | 1-2-2-1-1-1-1-1-1-1 | {0,1,3,5,6,7,8,9,T,E} | `111111101011` |
| 2033 | 10 | Unnamed / mathematical 12-TET collection | C D D♯ F F♯ G G♯ A A♯ B | 2-1-2-1-1-1-1-1-1-1 | {0,2,3,5,6,7,8,9,T,E} | `111111101101` |
| 2034 | 10 | Unnamed / mathematical 12-TET collection | C C♯ E F F♯ G G♯ A A♯ B | 1-3-1-1-1-1-1-1-1-1 | {0,1,4,5,6,7,8,9,T,E} | `111111110011` |
| 2035 | 10 | Unnamed / mathematical 12-TET collection | C D E F F♯ G G♯ A A♯ B | 2-2-1-1-1-1-1-1-1-1 | {0,2,4,5,6,7,8,9,T,E} | `111111110101` |
| 2036 | 10 | Unnamed / mathematical 12-TET collection | C D♯ E F F♯ G G♯ A A♯ B | 3-1-1-1-1-1-1-1-1-1 | {0,3,4,5,6,7,8,9,T,E} | `111111111001` |
| 2037 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A A♯ | 1-1-1-1-1-1-1-1-1-1-2 | {0,1,2,3,4,5,6,7,8,9,T} | `011111111111` |
| 2038 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A B | 1-1-1-1-1-1-1-1-1-2-1 | {0,1,2,3,4,5,6,7,8,9,E} | `101111111111` |
| 2039 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A♯ B | 1-1-1-1-1-1-1-1-2-1-1 | {0,1,2,3,4,5,6,7,8,T,E} | `110111111111` |
| 2040 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G A A♯ B | 1-1-1-1-1-1-1-2-1-1-1 | {0,1,2,3,4,5,6,7,9,T,E} | `111011111111` |
| 2041 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G♯ A A♯ B | 1-1-1-1-1-1-2-1-1-1-1 | {0,1,2,3,4,5,6,8,9,T,E} | `111101111111` |
| 2042 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F G G♯ A A♯ B | 1-1-1-1-1-2-1-1-1-1-1 | {0,1,2,3,4,5,7,8,9,T,E} | `111110111111` |
| 2043 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F♯ G G♯ A A♯ B | 1-1-1-1-2-1-1-1-1-1-1 | {0,1,2,3,4,6,7,8,9,T,E} | `111111011111` |
| 2044 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ F F♯ G G♯ A A♯ B | 1-1-1-2-1-1-1-1-1-1-1 | {0,1,2,3,5,6,7,8,9,T,E} | `111111101111` |
| 2045 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D E F F♯ G G♯ A A♯ B | 1-1-2-1-1-1-1-1-1-1-1 | {0,1,2,4,5,6,7,8,9,T,E} | `111111110111` |
| 2046 | 11 | Unnamed / mathematical 12-TET collection | C C♯ D♯ E F F♯ G G♯ A A♯ B | 1-2-1-1-1-1-1-1-1-1-1 | {0,1,3,4,5,6,7,8,9,T,E} | `111111111011` |
| 2047 | 11 | Unnamed / mathematical 12-TET collection | C D D♯ E F F♯ G G♯ A A♯ B | 2-1-1-1-1-1-1-1-1-1-1 | {0,2,3,4,5,6,7,8,9,T,E} | `111111111101` |
| 2048 | 12 | Unnamed / mathematical 12-TET collection | C C♯ D D♯ E F F♯ G G♯ A A♯ B | 1-1-1-1-1-1-1-1-1-1-1-1 | {0,1,2,3,4,5,6,7,8,9,T,E} | `111111111111` |

## Important: transpositions and modes
The 2,048 entries above are **C-rooted**. A real piano has 12 possible tonic transpositions. Therefore, if you count every transposition of every non-empty pitch collection separately, the raw universe contains **4,095 non-empty subsets** of the 12 pitch classes. Many of those are transpositions of one another, and many are modes/rotations of one another.

For scale-class research, one can instead group collections under transposition and inversion. A commonly used 12-TET classification has **351 set classes**; one reference presents these as all 2,048 modes of those 351 classes. This is a different equivalence convention from the rooted catalogue above.

## Literature boundary
This file intentionally separates the mathematically exhaustive 12-TET universe from claims about historical usage. Nicolas Slonimsky's *Thesaurus of Scales and Melodic Patterns* is broader than a simple list of scales: it includes ditone, sesquitone, whole-tone, semitone, quadritone, quinquetone, septitone, heptatonic and pentatonic material, plus melodic patterns, arpeggios, dodecaphonic progressions, complementary scales, permutations, and other structures. Those patterns are not all distinct pitch collections, so they should not be misleadingly counted as additional scales.

### Principal references
- Ian Ring, *A Study of Scales*: 12-tone equal temperament, exhaustive power-set approach, and a 1,490-scale subset under a maximum-gap criterion.
- Aaron Freed, *All Scales in Twelve-Tone Equal Temperament*: 351 scale classes / 2,048 modes presentation.
- Nicolas Slonimsky, *Thesaurus of Scales and Melodic Patterns* (1947): extensive historical/compositional catalogue of scales and melodic patterns.

### Counting note
Ian Ring's 1,490 figure is **not** the number of all piano-playable pitch collections. It results after requiring C/root inclusion and additionally excluding collections with gaps larger than a major third. The present file deliberately does **not** apply that extra restriction, because the request is for every collection that can be played on a piano.
