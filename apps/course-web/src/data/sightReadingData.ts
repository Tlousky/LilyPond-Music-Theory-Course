/**
 * sightReadingData.ts - Curated exercises for Sight Reading & Score Reconstruction
 */

export type SightReadingClef = 'treble' | 'bass' | 'grand';

export interface SightReadingExercise {
  id: string;
  level: number;
  title: string;
  description: string;
  clef: SightReadingClef;
  key: string;
  meter: string;
  tempoBpm: number;
  slowBpm: number;
  targetCode: string;
  scaffoldCode: string;
  theoryTips: string[];
}

export const SIGHT_READING_EXERCISES: SightReadingExercise[] = [
  {
    id: "sr.01_c_major_stepwise",
    level: 1,
    title: "1. Treble Clef Stepwise (Middle C to G)",
    description: "Read notes stepping up and down on lines and spaces: C4, D4, E4, F4, G4.",
    clef: "treble",
    key: "C major",
    meter: "4/4",
    tempoBpm: 80,
    slowBpm: 50,
    targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4 d e f | g4 f e c |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4 d e f | % Add measure 2: g4 f e c
  
}`,
    theoryTips: [
      "Treble Clef lines from bottom to top: E - G - B - D - F ('Every Good Boy Does Fine').",
      "Treble Clef spaces from bottom to top: F - A - C - E ('FACE').",
      "Middle C (C4) sits on the ledger line directly below the treble staff."
    ]
  },
  {
    id: "sr.02_treble_octave_high",
    level: 2,
    title: "2. Upper Treble Register (F4 to C5)",
    description: "Navigate the upper spaces and lines of the treble staff: F4, G4, A4, B4, C5.",
    clef: "treble",
    key: "C major",
    meter: "4/4",
    tempoBpm: 85,
    slowBpm: 55,
    targetCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\time 4/4
  f4 e d c | a'4 g f2 |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\time 4/4
  f4 e d c | % Complete measure 2: a'4 g f2
  
}`,
    theoryTips: [
      "In LilyPond \\relative c'', high notes start in the 5th octave.",
      "The third space is C5, fourth line is D5, and fourth space is E5.",
      "Note the half note duration: 'f2' receives two full beats."
    ]
  },
  {
    id: "sr.03_bass_clef_foundation",
    level: 3,
    title: "3. Bass Clef Foundation (C3 to G3)",
    description: "Read the bass register anchored on the 4th line F3 (between the two dots).",
    clef: "bass",
    key: "C major",
    meter: "4/4",
    tempoBpm: 75,
    slowBpm: 50,
    targetCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\time 4/4
  c4 d e f | g4 e d c |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\time 4/4
  c4 d e f | % Add measure 2: g4 e d c
  
}`,
    theoryTips: [
      "Bass Clef lines from bottom to top: G - B - D - F - A ('Good Boys Do Fine Always').",
      "Bass Clef spaces from bottom to top: A - C - E - G ('All Cows Eat Grass').",
      "F3 is centered between the two dots on the 4th line of the bass staff."
    ]
  },
  {
    id: "sr.04_intervals_thirds",
    level: 4,
    title: "4. Skipping in Thirds (Melodic Intervals)",
    description: "Practice sight-reading skips from line-to-line and space-to-space in 3/4 waltz time.",
    clef: "treble",
    key: "C major",
    meter: "3/4",
    tempoBpm: 90,
    slowBpm: 60,
    targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 e g | f4 d b | c2. |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 e g | % Write measures 2-3: f4 d b | c2. |
  
}`,
    theoryTips: [
      "Steps move from a line to an adjacent space (seconds: C to D).",
      "Skips move from line to the next line, or space to the next space (thirds: C to E, E to G).",
      "A dotted half note 'c2.' in 3/4 time sustains for all 3 beats of the measure."
    ]
  },
  {
    id: "sr.05_beethoven_theme",
    level: 5,
    title: "5. Beethoven: Ode to Joy Theme",
    description: "Stepwise melodic motion, key signature of D major (F# and C#), and dotted rhythms.",
    clef: "treble",
    key: "D major",
    meter: "4/4",
    tempoBpm: 100,
    slowBpm: 60,
    targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  fis4 fis g a | a4 g fis e | d4 d e fis | fis4. e8 e2 |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  fis4 fis g a | a4 g fis e |
  % Add measures 3 and 4:
  
}`,
    theoryTips: [
      "The key signature of D major has two sharps: F# (fis) and C# (cis).",
      "A dotted quarter note 'fis4.' lasts 1.5 beats, followed by an eighth note 'e8' on the off-beat.",
      "Stems point down when notes are on or above the middle line B4."
    ]
  },
  {
    id: "sr.06_pachelbel_ground_bass",
    level: 6,
    title: "6. Pachelbel: Ground Bass Progression",
    description: "Classic descending harmonic foundation in Bass clef supporting Roman numerals I - V - vi - iii - IV - I - IV - V.",
    clef: "bass",
    key: "D major",
    meter: "4/4",
    tempoBpm: 80,
    slowBpm: 50,
    targetCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\key d \\major
  \\time 4/4
  d4 a b fis | g4 d g a |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\key d \\major
  \\time 4/4
  d4 a b fis | % Complete measure 2: g4 d g a
  
}`,
    theoryTips: [
      "The ground bass is a repeating harmonic pattern common in Baroque music.",
      "Low bass notes use relative mode \\relative c starting in octave 3.",
      "Notice how the bass steps down: D $\\rightarrow$ A $\\rightarrow$ B $\\rightarrow$ F# $\\rightarrow$ G."
    ]
  },
  {
    id: "sr.07_mozart_twinkle",
    level: 7,
    title: "7. Mozart: Theme & Variations Motif",
    description: "Repeated notes, dominant fifth leap, and descending stepwise resolution in 2/4 duple meter.",
    clef: "treble",
    key: "C major",
    meter: "2/4",
    tempoBpm: 100,
    slowBpm: 60,
    targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 2/4
  c4 c | g' g | a a | g2 |
  f4 f | e e | d d | c2 |
}`,
    scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 2/4
  c4 c | g' g | a a | g2 |
  % Reconstruct the answering phrase: f4 f | e e | d d | c2 |
  
}`,
    theoryTips: [
      "In 2/4 time, there are 2 quarter-note beats per measure.",
      "C to G is a Perfect Fifth interval (7 semitones leap from Tonic to Dominant).",
      "Repeated note pairs train quick finger reflexes on the keyboard."
    ]
  }
];
