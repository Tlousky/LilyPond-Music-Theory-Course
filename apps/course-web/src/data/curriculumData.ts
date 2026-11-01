/**
 * curriculumData.ts - Course Curriculum & Classical Repertoire Data
 * Grounded in Open Music Theory (OMT) textbook and enriched with classical repertoire.
 * Implements the 5-phase learning loop: Theory -> Traditional Practice -> LilyPond Syntax -> Reconstruction -> Mixed Capstone.
 */

import { TheoryDiagramType } from '../components/curriculum/TheoryDiagram';

export interface TheoryQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface CodingChallenge {
  prompt: string;
  initial_code: string;
  solution_code: string;
  expected_pitches?: string[];
  expectedPitches?: string[];
  hint: string;
}

export interface TheorySection {
  summary: string;
  markdown: string;
  diagramType?: TheoryDiagramType;
  keyTakeaways: string[];
  audioPreviews?: Array<{
    label: string;
    midi: number[];
    description: string;
  }>;
}

export interface TraditionalPracticeSection {
  title: string;
  instructions: string;
  targetCode: string;
  clef: 'treble' | 'bass' | 'grand';
  key: string;
  meter: string;
  tempoBpm: number;
  slowBpm: number;
  hints: string[];
}

export interface SyntaxSection {
  title: string;
  command: string;
  explanation: string;
  rules: string[];
  exampleCode: string;
  cheatSheet: Array<{ command: string; description: string }>;
  quiz: TheoryQuiz;
}

export interface ReconstructionSection {
  prompt: string;
  scaffoldCode: string;
  solutionCode: string;
  expectedPitches: string[];
  hints: string[];
  commandBank: string[];
}

export interface MixedCapstoneSection {
  title: string;
  composer: string;
  opus?: string;
  era?: string;
  year?: number;
  meter: string;
  key: string;
  tempoBpm: number;
  slowBpm: number;
  codePrompt: string;
  initialCode: string;
  solutionCode: string;
  expectedPitches: string[];
  hint: string;
  reflectionQuestion: string;
  reflectionOptions: string[];
  reflectionAnswer: number;
  reflectionExplanation: string;
}

export interface Lesson {
  id: string;
  chapter_order: number;
  title: string;
  concept_id: string;
  syntax_id: string;
  repertoire_id?: string;

  // Rich 5-Phase Pedagogical Loop
  theory: TheorySection;
  traditionalPractice: TraditionalPracticeSection;
  syntax: SyntaxSection;
  reconstruction: ReconstructionSection;
  capstone: MixedCapstoneSection;

  // Backward compatibility fields
  theory_summary: string;
  theory_quiz: TheoryQuiz;
  coding_challenge: CodingChallenge;
}

export interface CapstoneChallenge {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface RepertoirePiece {
  id: string;
  title: string;
  composer: string;
  opus: string;
  era: string;
  year: number;
  source: string;
  meter: string;
  key: string;
  clefs: string[];
  difficulty: number;
  theory_concepts: string[];
  lilypond_syntax: string[];
  excerpt_measures: string;
  score_file: string;
  code: string;
  capstone_challenge?: CapstoneChallenge;
}

export const REPERTOIRE_PIECES: Record<string, RepertoirePiece> = {
  "petzold_minuet_g_anh114": {
    id: "petzold_minuet_g_anh114",
    title: "Minuet in G major",
    composer: "Christian Petzold / J.S. Bach",
    opus: "BWV Anh. 114",
    era: "Baroque",
    year: 1725,
    source: "Notebook for Anna Magdalena Bach",
    meter: "3/4",
    key: "G major",
    clefs: ["treble", "bass"],
    difficulty: 1,
    theory_concepts: ["pitch", "clef", "grand_staff", "major_scale", "key_signature", "triple_meter"],
    lilypond_syntax: ["relative_mode", "clef_command", "key_command", "time_command", "piano_staff_context"],
    excerpt_measures: "1-8",
    score_file: "petzold_minuet_g_anh114.ly",
    code: `\\version "2.24.0"
\\header {
  title = "Minuet in G major"
  composer = "Christian Petzold / J.S. Bach"
  opus = "BWV Anh. 114"
}
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\key g \\major
    \\time 3/4
    \\relative c'' {
      \\repeat volta 2 {
        d4 g,8 a b c |
        d4 g, g |
        e'4 c8 d e fis |
        g4 g, g |
        c4 d8 c b a |
        b4 c8 b a g |
        fis4 g8 a b g |
        a2. |
      }
    }
  }
  \\new Staff {
    \\clef bass
    \\key g \\major
    \\time 3/4
    \\relative c' {
      \\repeat volta 2 {
        <g b d>2. |
        b2. |
        c2. |
        b2. |
        a2. |
        g2. |
        d'4 b g |
        d'2. |
      }
    }
  }
>>`,
    capstone_challenge: {
      question: "Inspect the score structure: What meter and upper-staff clef does Petzold's Minuet use?",
      options: [
        "3/4 triple meter in Treble clef",
        "4/4 common time in Bass clef",
        "2/4 duple meter in Alto clef",
        "6/8 compound meter in Treble clef"
      ],
      answer: 0,
      explanation: "Petzold's Minuet is in 3/4 triple dance meter, with the top melody staff written in Treble clef."
    }
  },
  "beethoven_ode_to_joy": {
    id: "beethoven_ode_to_joy",
    title: "Ode to Joy",
    composer: "Ludwig van Beethoven",
    opus: "Op. 125",
    era: "Classical",
    year: 1824,
    source: "Symphony No. 9",
    meter: "4/4",
    key: "D major",
    clefs: ["treble"],
    difficulty: 1,
    theory_concepts: ["pitch", "stepwise_motion", "quarter_note", "dotted_note", "simple_meter"],
    lilypond_syntax: ["relative_mode", "key_command", "time_command", "dot_modifier"],
    excerpt_measures: "1-8",
    score_file: "beethoven_ode_to_joy.ly",
    code: `\\version "2.24.0"
\\header {
  title = "Ode to Joy"
  composer = "Ludwig van Beethoven"
  opus = "Op. 125"
}
\\new Staff {
  \\clef treble
  \\key d \\major
  \\time 4/4
  \\relative c' {
    fis4 fis g a |
    a4 g fis e |
    d4 d e fis |
    fis4. e8 e2 |
    fis4 fis g a |
    a4 g fis e |
    d4 d e fis |
    e4. d8 d2 |
  }
}`,
    capstone_challenge: {
      question: "Examine the score header and key signature: What key and meter does Beethoven's theme use?",
      options: [
        "D major in 4/4 common time",
        "C major in 3/4 waltz time",
        "G major in 2/4 march time",
        "F major in 6/8 compound time"
      ],
      answer: 0,
      explanation: "The score specifies \\key d \\major (with two sharps: F# and C#) and \\time 4/4."
    }
  },
  "mozart_twinkle_variations": {
    id: "mozart_twinkle_variations",
    title: "Ah! vous dirai-je, Maman",
    composer: "W. A. Mozart",
    opus: "KV 265",
    era: "Classical",
    year: 1781,
    source: "Theme & Variations",
    meter: "2/4",
    key: "C major",
    clefs: ["treble", "bass"],
    difficulty: 1,
    theory_concepts: ["pitch", "repeated_notes", "intervals", "tonic_dominant"],
    lilypond_syntax: ["relative_mode", "piano_staff_context", "time_command"],
    excerpt_measures: "1-8",
    score_file: "mozart_twinkle_variations.ly",
    code: `\\version "2.24.0"
\\header {
  title = "Ah! vous dirai-je, Maman"
  composer = "W. A. Mozart"
  opus = "KV 265"
}
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\key c \\major
    \\time 2/4
    \\relative c' {
      c4 c | g' g | a a | g2 |
      f4 f | e e | d d | c2 |
    }
  }
  \\new Staff {
    \\clef bass
    \\key c \\major
    \\time 2/4
    \\relative c {
      <c e g>2 | <c e g> | <c f a> | <c e g> |
      <c f a>2 | <c e g> | <g b d f> | <c e g>2 |
    }
  }
>>`,
    capstone_challenge: {
      question: "Examine the engraved score: What time signature (meter) is specified right after the clef in measure 1?",
      options: [
        "2/4 (Duple meter: 2 quarter-note beats per measure)",
        "3/4 (Triple meter: 3 quarter-note beats per measure)",
        "4/4 (Common time: 4 quarter-note beats per measure)",
        "6/8 (Compound meter: 2 dotted-beat pulses)"
      ],
      answer: 0,
      explanation: "The score specifies \\time 2/4, dividing each measure into two quarter notes."
    }
  },
  "bach_chorale_bwv244": {
    id: "bach_chorale_bwv244",
    title: "O Haupt voll Blut und Wunden",
    composer: "J.S. Bach",
    opus: "BWV 244",
    era: "Baroque",
    year: 1727,
    source: "St. Matthew Passion",
    meter: "4/4",
    key: "D minor",
    clefs: ["treble", "bass"],
    difficulty: 2,
    theory_concepts: ["satb", "voice_leading", "triad", "inversion", "cadence"],
    lilypond_syntax: ["voice_separator", "voice_one", "voice_two", "piano_staff_context"],
    excerpt_measures: "1-4",
    score_file: "bach_chorale_bwv244.ly",
    code: `\\version "2.24.0"
\\header {
  title = "O Haupt voll Blut und Wunden"
  composer = "J.S. Bach"
  opus = "BWV 244"
}
\\new PianoStaff <<
  \\new Staff <<
    \\clef treble
    \\key d \\minor
    \\time 4/4
    \\relative c'' {
      <<
        { \\partial 4 f4 | e d cis d8 e | f4 e d\\fermata }
        \\\\
        { \\partial 4 d4 | cis d a a | d cis a\\fermata }
      >>
    }
  >>
  \\new Staff <<
    \\clef bass
    \\key d \\minor
    \\time 4/4
    \\relative c' {
      <<
        { \\partial 4 a4 | a f e f8 g | a4 a f\\fermata }
        \\\\
        { \\partial 4 d4 | a' b a d, | d a d,\\fermata }
      >>
    }
  >>
>>`,
    capstone_challenge: {
      question: "Observe the vocal harmony layout: What context is used to combine both soprano and bass staves?",
      options: [
        "\\new PianoStaff with two polyphonic staves",
        "\\new DrumStaff with single line",
        "\\new ChordNames only",
        "\\new TabStaff for guitar"
      ],
      answer: 0,
      explanation: "Bach's four-part chorale is engraved using a \\new PianoStaff holding both Treble and Bass staves."
    }
  },
  "pachelbel_canon_d_bass": {
    id: "pachelbel_canon_d_bass",
    title: "Canon in D (Ground Bass)",
    composer: "Johann Pachelbel",
    opus: "PWC 37",
    era: "Baroque",
    year: 1694,
    source: "Baroque Continuo",
    meter: "4/4",
    key: "D major",
    clefs: ["bass"],
    difficulty: 1,
    theory_concepts: ["ground_bass", "harmonic_progression", "roman_numerals", "basso_continuo"],
    lilypond_syntax: ["clef_command", "relative_mode", "figured_bass_context"],
    excerpt_measures: "1-2",
    score_file: "pachelbel_canon_d_bass.ly",
    code: `\\version "2.24.0"
\\header {
  title = "Canon in D (Ground Bass)"
  composer = "Johann Pachelbel"
}
<<
  \\new Staff {
    \\clef bass
    \\key d \\major
    \\time 4/4
    \\relative c {
      d4 a b fis |
      g4 d g a |
    }
  }
  \\figures {
    < _ >4 < _ > < _ > < _ > |
    < _ >4 < _ > < _ > < _ > |
  }
>>`,
    capstone_challenge: {
      question: "Examine the bass accompaniment: Which clef is assigned to Pachelbel's repeating ground bass?",
      options: [
        "Bass clef (\\clef bass)",
        "Treble clef (\\clef treble)",
        "Alto clef (\\clef alto)",
        "Percussion clef"
      ],
      answer: 0,
      explanation: "The ground bass continuo line is written in Bass clef (\\clef bass) to support the harmonic foundation."
    }
  }
};

export const FUNDAMENTALS_LESSONS: Lesson[] = [
  // -------------------------------------------------------------------------------------------------
  // LESSON 1: Musical Notation & Writing Code
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.01_intro",
    chapter_order: 1,
    title: "1. Musical Notation & Writing Code",
    concept_id: "concept.pitch",
    syntax_id: "syntax.relative_mode",
    repertoire_id: "mozart_twinkle_variations",
    theory_summary: "Western music notation maps pitch vertically (higher notes placed higher) and rhythm horizontally (left to right). Notes are named with letters A, B, C, D, E, F, G repeating in octaves.",
    theory_quiz: {
      question: "In Western music notation, how is pitch represented on the staff?",
      options: [
        "Vertically (higher notes placed higher on the staff)",
        "Horizontally (from left to right)",
        "By notehead color",
        "By font size"
      ],
      answer: 0,
      explanation: "Pitches are positioned vertically: notes producing higher frequencies sit higher on the lines and spaces."
    },
    coding_challenge: {
      prompt: "Write your first LilyPond score! Engrave four quarter notes: C, D, E, F in treble clef using \\relative c'.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  % Type: c4 d e f
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  c4 d e f
}`,
      expected_pitches: ["c4", "d4", "e4", "f4"],
      hint: "Inside \\relative c' { }, write: c4 d e f"
    },
    theory: {
      summary: "Western music notation maps pitch vertically and rhythm horizontally. The musical alphabet uses seven letter names (A, B, C, D, E, F, G) that loop continuously across octaves.",
      markdown: `Western musical notation privileges two core dimensions: **pitch** (vertical *y*-axis) and **rhythm** (horizontal *x*-axis). Music is read left-to-right and top-to-bottom.

### The Musical Alphabet & Octave Equivalence
Pitches are named using the first seven letters of the Latin alphabet:
$$\\mathbf{A \\rightarrow B \\rightarrow C \\rightarrow D \\rightarrow E \\rightarrow F \\rightarrow G \\rightarrow A \\rightarrow \\dots}$$

Because of **octave equivalence**, pitches that vibrate at twice the frequency (an octave higher) share the identical letter name.

### Piano Keyboard Landmarks: Finding C and F Instantly
The piano keyboard consists of alternating groups of **two** and **three** black keys:
- **Landmark C:** The white key immediately to the *left of any pair of two black keys* is always **C**.
- **Landmark F:** The white key immediately to the *left of any group of three black keys* is always **F**.
- **Middle C (C4):** The C located near the center of the piano keyboard, acting as the bridge between treble and bass registers.`,
      diagramType: 'keyboard_landmarks',
      keyTakeaways: [
        "Pitch is vertical (y-axis); rhythm is horizontal (x-axis).",
        "The musical alphabet has only 7 letters: A, B, C, D, E, F, G, repeating endlessly in loops.",
        "The white key to the immediate left of TWO black keys is always C.",
        "The white key to the immediate left of THREE black keys is always F.",
        "Middle C (C4) is the central anchor of the keyboard and grand staff."
      ],
      audioPreviews: [
        { label: "Middle C (C4)", midi: [60], description: "The central anchor pitch of the keyboard (261.6 Hz)." },
        { label: "C Major Triad", midi: [60, 64, 67], description: "C - E - G sounding together." },
        { label: "Octave Jump (C4 -> C5)", midi: [60, 72], description: "Two notes an octave apart sharing the pitch class C." }
      ]
    },
    traditionalPractice: {
      title: "Landmark Notes on Keyboard",
      instructions: "Observe the score showing C4, D4, E4, F4. Play each note in sequence on the virtual piano keyboard.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4 d e f |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "Find C4 to the immediate left of the two black keys.",
        "Step up key by key: C4 -> D4 -> E4 -> F4."
      ]
    },
    syntax: {
      title: "Writing Note Names in LilyPond",
      command: "\\relative c'",
      explanation: "In LilyPond, musical pitches are written in standard lowercase letters: c, d, e, f, g, a, b. To specify pitch octave, we wrap music inside \\relative c' { ... } where the note closest to middle C is chosen automatically.",
      rules: [
        "Always use lowercase letters: c, d, e, f, g, a, b (never uppercase).",
        "Durations are numbers attached to the note: 4 = quarter note, 2 = half note, 1 = whole note.",
        "Notes without an explicit duration inherit the duration of the preceding note.",
        "Enclose musical passages inside curly braces { }."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  c4 d e f
}`,
      cheatSheet: [
        { command: "c4", description: "Quarter note C" },
        { command: "\\relative c' { ... }", description: "Relative octave mode starting near middle C" },
        { command: "% comment", description: "Comment ignored by compiler" }
      ],
      quiz: {
        question: "In LilyPond, how must pitch letter names be typed?",
        options: [
          "Lowercase letters only (e.g., c, d, e, f)",
          "Uppercase letters only (e.g., C, D, E, F)",
          "Numbers 1 through 7",
          "Roman numerals (e.g., I, II, III)"
        ],
        answer: 0,
        explanation: "LilyPond strictly requires lowercase pitch names: c, d, e, f, g, a, b."
      }
    },
    reconstruction: {
      prompt: "Reconstruct your first LilyPond score! Add notes c4, d, e, f inside the \\relative block.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  % Add four quarter notes: c4 d e f
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  c4 d e f
}`,
      expectedPitches: ["c4", "d4", "e4", "f4"],
      hints: [
        "Type 'c4 d e f' inside the curly brackets.",
        "Remember notes after c4 inherit the quarter note duration automatically."
      ],
      commandBank: ["\\relative c'", "c4", "d", "e", "f", "{", "}"]
    },
    capstone: {
      title: "Ah! vous dirai-je, Maman (Opening Phrase)",
      composer: "W. A. Mozart",
      opus: "KV 265",
      era: "Classical",
      year: 1781,
      meter: "2/4",
      key: "C major",
      tempoBpm: 80,
      slowBpm: 50,
      codePrompt: "Write Mozart's opening melody: two C quarter notes, two G quarter notes, two A quarter notes, and a G half note.",
      initialCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 2/4
  % Write: c4 c | g' g | a a | g2 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 2/4
  c4 c | g' g | a a | g2 |
}`,
      expectedPitches: ["c4", "c4", "g4", "g4", "a4", "a4", "g4"],
      hint: "Use \\time 2/4 and write: c4 c | g' g | a a | g2 |",
      reflectionQuestion: "Why does Mozart repeat the notes (C-C, G-G, A-A) in the opening motif?",
      reflectionOptions: [
        "To establish a memorable, balanced rhythmic motif for listeners",
        "Because classical instruments could not play different pitches quickly",
        "It was required by French copyright laws in 1781",
        "To fill extra paper on the manuscript"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Repeated-note pairs create strong rhythmic clarity and symmetry, making classical themes instantly recognizable."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 2: Notes, Staff, and Ledger Lines
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.02_notes_and_clefs",
    chapter_order: 2,
    title: "2. Notes, the Staff, and Ledger Lines",
    concept_id: "concept.staff",
    syntax_id: "syntax.clef_command",
    repertoire_id: "beethoven_ode_to_joy",
    theory_summary: "The staff consists of 5 horizontal lines and 4 spaces, numbered from bottom (1) to top (5). Stems point down for notes on or above the 3rd line, and up for notes below it. Ledger lines extend the staff.",
    theory_quiz: {
      question: "How are the lines and spaces of a musical staff numbered?",
      options: [
        "From bottom to top (Line 1 at the bottom, Line 5 at the top)",
        "From top to bottom (Line 1 at the top, Line 5 at the bottom)",
        "From left to right chronologically",
        "From middle outwards"
      ],
      answer: 0,
      explanation: "Musicians and engravers always number staff lines and spaces from bottom to top (Line 1 is the lowest line, Line 5 is the highest)."
    },
    coding_challenge: {
      prompt: "Engrave an ascending scale fragment from middle C (C4) to G4 in treble clef: c4 d e f g1.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Write: c4 d e f g1
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f | g1 |
}`,
      expected_pitches: ["c4", "d4", "e4", "f4", "g4"],
      hint: "Set \\clef treble and write: c4 d e f | g1 |"
    },
    theory: {
      summary: "A staff consists of five lines and four spaces, counted from bottom to top. Note anatomy includes noteheads, stems, and flags. Ledger lines extend the staff higher or lower.",
      markdown: `A **staff** (plural *staves*) is essential for conveying musical pitch. It consists of five horizontal lines and four spaces.

### Numbering Staff Lines and Spaces
Crucially, lines and spaces are **always numbered from bottom to top**:
- **Line 5:** Top line
- **Line 4:** Fourth line
- **Line 3:** Middle line
- **Line 2:** Second line
- **Line 1:** Bottom line

The spaces between them are similarly numbered **Space 1** (between Lines 1 & 2) up to **Space 4** (between Lines 4 & 5).

### Note Anatomy & Stem Rules
Every written note has an oval **notehead** tilted slightly upward to the right. Most notes also have a vertical **stem**:
1. **Notes below the middle line (Line 3):** The stem points **UPWARD** on the *right* side of the notehead.
2. **Notes on or above the middle line (Line 3):** The stem points **DOWNWARD** on the *left* side of the notehead.
3. **Notes on Line 3:** Can point up or down depending on neighboring notes.

### Ledger Lines
When pitches are too high or too low to fit on the 5-line staff, small horizontal lines called **ledger lines** are drawn to extend the staff without adding clutter.`,
      diagramType: 'grand_staff_middle_c',
      keyTakeaways: [
        "The staff has 5 lines and 4 spaces, numbered strictly from BOTTOM to TOP.",
        "Noteheads are oval and tilted upward to the right.",
        "Below the middle line: stem points UP on the right side.",
        "On or above the middle line: stem points DOWN on the left side.",
        "Ledger lines extend the staff higher or lower for notes beyond the 5 staff lines."
      ],
      audioPreviews: [
        { label: "Ascending Scale Fragment", midi: [60, 62, 64, 65, 67], description: "C4, D4, E4, F4, G4 ascending on lines and spaces." },
        { label: "Ledger Line Middle C", midi: [60], description: "Middle C sitting on its ledger line below treble staff." }
      ]
    },
    traditionalPractice: {
      title: "Stepping on Lines and Spaces",
      instructions: "Read the ascending scale fragment stepping from line to space: C4 (ledger line), D4 (below staff), E4 (Line 1), F4 (Space 1), G4 (Line 2). Play them on the virtual keyboard.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4 d e f | g1 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 80,
      slowBpm: 50,
      hints: [
        "C4 sits on one ledger line below the staff.",
        "E4 is Line 1 (bottom line).",
        "G4 is Line 2."
      ]
    },
    syntax: {
      title: "Setting the Clef in LilyPond",
      command: "\\clef treble",
      explanation: "To tell LilyPond which clef to engrave, use the \\clef command followed by the clef name (treble, bass, alto, tenor). Durations can be combined across barlines with '|' bar checks.",
      rules: [
        "Declare the clef at the start of your staff: \\clef treble or \\clef bass.",
        "Use whole notes with duration '1' (e.g., g1).",
        "Use the pipe '|' symbol as a bar check to verify your measures have the correct number of beats."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f |
  g1 |
}`,
      cheatSheet: [
        { command: "\\clef treble", description: "Engraves the Treble (G) Clef" },
        { command: "\\clef bass", description: "Engraves the Bass (F) Clef" },
        { command: "|", description: "Barline check to confirm measure metric validity" }
      ],
      quiz: {
        question: "For a note placed on Line 4 of the staff, which way should its stem point?",
        options: [
          "Downward on the left side of the notehead",
          "Upward on the right side of the notehead",
          "Horizontally to the right",
          "Stems are never used on Line 4"
        ],
        answer: 0,
        explanation: "Line 4 is above the middle line (Line 3), so standard notation rules dictate the stem points downward on the left side."
      }
    },
    reconstruction: {
      prompt: "Reconstruct the ascending scale fragment in treble clef: c4 d e f | g1 |.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Complete the scale: c4 d e f | g1 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f | g1 |
}`,
      expectedPitches: ["c4", "d4", "e4", "f4", "g4"],
      hints: [
        "Include \\clef treble.",
        "Type c4 d e f | g1 |"
      ],
      commandBank: ["\\clef treble", "c4", "d", "e", "f", "|", "g1", "{", "}"]
    },
    capstone: {
      title: "Ode to Joy (Stepwise Motion Theme)",
      composer: "Ludwig van Beethoven",
      opus: "Op. 125",
      era: "Classical",
      year: 1824,
      meter: "4/4",
      key: "D major",
      tempoBpm: 90,
      slowBpm: 55,
      codePrompt: "Engrave Beethoven's famous stepwise theme: F# F# G A | A G F# E | in D major.",
      initialCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  % Write: fis4 fis g a | a g fis e |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  fis4 fis g a |
  a4 g fis e |
}`,
      expectedPitches: ["fs4", "fs4", "g4", "a4", "a4", "g4", "fs4", "e4"],
      hint: "Remember F-sharp is written as 'fis' in LilyPond.",
      reflectionQuestion: "What makes Beethoven's Ode to Joy theme so singable and easy to sight read?",
      reflectionOptions: [
        "It moves almost entirely in stepwise motion (intervals of seconds) with equal quarter-note rhythms",
        "It uses wide leaps of sevenths and complex polyrhythms",
        "It was written exclusively for synthesizers",
        "It contains no repeated notes"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Stepwise motion (conjunct motion) along adjacent lines and spaces is the most natural melodic contour for human voices."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 3: Reading Treble and Bass Clefs
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.03_reading_clefs",
    chapter_order: 3,
    title: "3. Reading Treble and Bass Clefs",
    concept_id: "concept.clef_treble",
    syntax_id: "syntax.clef_command",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "The Treble Clef (G-Clef) anchors on Line 2 (G4): lines are E-G-B-D-F ('Every Good Bird Does Fly') and spaces are F-A-C-E. The Bass Clef (F-Clef) anchors on Line 4 (F3): lines are G-B-D-F-A ('Good Bikes Don't Fall Apart') and spaces are A-C-E-G ('All Cows Eat Grass').",
    theory_quiz: {
      question: "Which pitch sits on the second line from the bottom of the Treble staff?",
      options: [
        "G4 (the pitch around which the treble clef loops)",
        "E4 (the bottom line)",
        "B4 (the middle line)",
        "Middle C (C4)"
      ],
      answer: 0,
      explanation: "The treble clef is also called the G-clef because its inner spiral loops directly around Line 2, fixing that line as G4."
    },
    coding_challenge: {
      prompt: "Switch from treble clef to bass clef! Engrave C4 in treble clef, then switch to bass clef and engrave C3.",
      initial_code: `\\version "2.24.0"
{
  \\clef treble
  c'1
  % Switch clef and write c3 (c1 in bass):
  
}`,
      solution_code: `\\version "2.24.0"
{
  \\clef treble
  c'1
  \\clef bass
  c1
}`,
      expected_pitches: ["c4", "c3"],
      hint: "Type \\clef bass followed by c1"
    },
    theory: {
      summary: "A clef assigns specific pitch letters to the lines and spaces of a staff. The Treble Clef is the G-Clef (Line 2 = G4). The Bass Clef is the F-Clef (Line 4 = F3).",
      markdown: `A staff without a clef has no absolute pitch meaning—it only shows whether notes are higher or lower. A **clef** anchors the staff to specific pitch frequencies.

### 1. The Treble Clef (G-Clef)
The treble clef curls around **Line 2**, designating it as **G4** (the G above middle C). Higher voices and instruments (soprano, violin, flute, trumpet, piano right hand) read treble clef.

#### Treble Clef Lines (Bottom to Top, Lines 1 to 5):
$$\\mathbf{E4 \\rightarrow G4 \\rightarrow B4 \\rightarrow D5 \\rightarrow F5}$$
> [!TIP] Mnemonic for Treble Lines:
> **E**very **G**ood **B**ird **D**oes **F**ly *(or "Every Good Boy Does Fine")*

#### Treble Clef Spaces (Bottom to Top, Spaces 1 to 4):
$$\\mathbf{F4 \\rightarrow A4 \\rightarrow C5 \\rightarrow E5}$$
> [!TIP] Mnemonic for Treble Spaces:
> Spells the word **F A C E**!

---

### 2. The Bass Clef (F-Clef)
The bass clef features two dots that surround **Line 4**, designating it as **F3** (the F below middle C). Lower voices and instruments (bass, cello, trombone, bassoon, piano left hand) read bass clef.

#### Bass Clef Lines (Bottom to Top, Lines 1 to 5):
$$\\mathbf{G2 \\rightarrow B2 \\rightarrow D3 \\rightarrow F3 \\rightarrow A3}$$
> [!TIP] Mnemonic for Bass Lines:
> **G**ood **B**ikes **D**on't **F**all **A**part *(or "Good Boys Do Fine Always")*

#### Bass Clef Spaces (Bottom to Top, Spaces 1 to 4):
$$\\mathbf{A2 \\rightarrow C3 \\rightarrow E3 \\rightarrow G3}$$
> [!TIP] Mnemonic for Bass Spaces:
> **A**ll **C**ows **E**at **G**rass!`,
      diagramType: 'treble_lines_spaces',
      keyTakeaways: [
        "Treble Clef = G-Clef: The spiral loops around Line 2 = G4.",
        "Treble Lines (1-5): E - G - B - D - F ('Every Good Bird Does Fly').",
        "Treble Spaces (1-4): F - A - C - E (spells 'FACE').",
        "Bass Clef = F-Clef: The two dots surround Line 4 = F3.",
        "Bass Lines (1-5): G - B - D - F - A ('Good Bikes Don't Fall Apart').",
        "Bass Spaces (1-4): A - C - E - G ('All Cows Eat Grass')."
      ],
      audioPreviews: [
        { label: "Treble Lines (E-G-B-D-F)", midi: [64, 67, 71, 74, 77], description: "Arpeggio of the 5 treble lines from bottom to top." },
        { label: "Treble Spaces (F-A-C-E)", midi: [65, 69, 72, 76], description: "Arpeggio of the 4 treble spaces spelling FACE." },
        { label: "Bass Lines (G-B-D-F-A)", midi: [43, 47, 50, 53, 57], description: "Arpeggio of the 5 bass lines from bottom to top." },
        { label: "Bass Spaces (A-C-E-G)", midi: [45, 48, 52, 55], description: "Arpeggio of the 4 bass spaces (All Cows Eat Grass)." }
      ]
    },
    traditionalPractice: {
      title: "Reading Lines and Spaces on the Keyboard",
      instructions: "Identify each note on the staff and press the matching piano key: E4 (Line 1), G4 (Line 2), B4 (Line 3), D5 (Line 4), F5 (Line 5).",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  e4 g b d | f1 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "Line 1 is E4 (first white key right of D).",
        "Line 2 is G4.",
        "Line 3 is B4.",
        "Line 4 is D5.",
        "Line 5 is F5."
      ]
    },
    syntax: {
      title: "Absolute vs. Relative Pitch & Clefs",
      command: "\\clef bass",
      explanation: "In LilyPond, octaves can be set explicitly using apostrophes (') to raise by an octave and commas (,) to lower by an octave. Switching clefs mid-piece is as easy as writing \\clef bass or \\clef treble.",
      rules: [
        "c' represents Middle C (C4).",
        "c'' represents C5 (one octave above middle C).",
        "c represents C3 (the octave below middle C, often in bass clef).",
        "c, represents C2 (low cello/bass register).",
        "\\clef bass instructs the engraver to switch to the F-clef."
      ],
      exampleCode: `\\version "2.24.0"
{
  \\clef treble
  c'1   % Middle C in treble clef
  \\clef bass
  c1    % C3 in bass clef
}`,
      cheatSheet: [
        { command: "\\clef treble", description: "Treble Clef (G4 on Line 2)" },
        { command: "\\clef bass", description: "Bass Clef (F3 on Line 4)" },
        { command: "c'", description: "Middle C (C4)" },
        { command: "c", description: "C3 in bass register" }
      ],
      quiz: {
        question: "In Bass Clef, which mnemonic device helps remember the 4 SPACES (bottom to top)?",
        options: [
          "All Cows Eat Grass (A - C - E - G)",
          "FACE",
          "Every Good Bird Does Fly",
          "Good Bikes Don't Fall Apart"
        ],
        answer: 0,
        explanation: "The 4 spaces in bass clef from bottom to top are A2, C3, E3, G3: 'All Cows Eat Grass'."
      }
    },
    reconstruction: {
      prompt: "Engrave a clef change: write middle C (c'1) in treble clef, then switch to bass clef and write low C (c1).",
      scaffoldCode: `\\version "2.24.0"
{
  \\clef treble
  c'1
  % Switch to bass clef and write c1:
  
}`,
      solutionCode: `\\version "2.24.0"
{
  \\clef treble
  c'1
  \\clef bass
  c1
}`,
      expectedPitches: ["c4", "c3"],
      hints: [
        "Type \\clef bass on a new line.",
        "Then type c1 to engrave a whole note C3 in the bass staff."
      ],
      commandBank: ["\\clef treble", "c'1", "\\clef bass", "c1", "{", "}"]
    },
    capstone: {
      title: "Minuet in G (Treble Melody & Clef Practice)",
      composer: "Christian Petzold / J.S. Bach",
      opus: "BWV Anh. 114",
      era: "Baroque",
      year: 1725,
      meter: "3/4",
      key: "G major",
      tempoBpm: 100,
      slowBpm: 60,
      codePrompt: "Engrave the opening measures of Petzold's Minuet: d4 g,8 a b c | d4 g, g | in treble clef.",
      initialCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  % Write: d4 g,8 a b c | d4 g, g |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  d4 g,8 a b c |
  d4 g, g |
}`,
      expectedPitches: ["d5", "g4", "a4", "b4", "c5", "d5", "g4", "g4"],
      hint: "Use \\relative c'' and write: d4 g,8 a b c | d4 g, g |",
      reflectionQuestion: "Why is the top staff of a keyboard piece almost always notated in Treble Clef?",
      reflectionOptions: [
        "The right hand typically plays the higher soprano/alto melodic range which fits comfortably on the treble staff without excessive ledger lines",
        "Johann Sebastian Bach signed an edict banning bass clef for the right hand",
        "Treble clef notes sound louder on acoustic pianos",
        "Pianists cannot read bass clef with their right eye"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Clefs are selected to fit the natural tessitura (range) of the music, avoiding confusing thick clusters of ledger lines."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 4: The Keyboard and the Grand Staff
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.04_grand_staff",
    chapter_order: 4,
    title: "4. The Keyboard and the Grand Staff",
    concept_id: "concept.grand_staff",
    syntax_id: "syntax.piano_staff",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "The Grand Staff unites Treble and Bass staves with a brace. Middle C (C4) sits on the ledger line directly between them, serving as the bridge between hands.",
    theory_quiz: {
      question: "Where does Middle C (C4) sit on the Grand Staff?",
      options: [
        "On a ledger line in the space between the treble and bass staves",
        "On the top line of the treble staff",
        "On the bottom line of the bass staff",
        "In the second space of the bass staff"
      ],
      answer: 0,
      explanation: "Middle C sits on the ledger line directly between the two staves: one ledger line below the treble staff and one ledger line above the bass staff."
    },
    coding_challenge: {
      prompt: "Create a Piano Grand Staff! The upper staff plays G4 whole note in treble, and the lower staff plays C3 whole note in bass.",
      initial_code: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    g'1
  }
  \\new Staff {
    % Add bass clef and c1:
    
  }
>>`,
      solution_code: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    g'1
  }
  \\new Staff {
    \\clef bass
    c1
  }
>>`,
      expected_pitches: ["g4", "c3"],
      hint: "In the lower Staff, write: \\clef bass c1"
    },
    theory: {
      summary: "Keyboard music uses the Grand Staff: a treble staff on top connected to a bass staff on the bottom by a line and brace. Middle C is the shared bridge.",
      markdown: `Music for keyboard instruments (piano, organ, harpsichord, celesta) is written on a **Grand Staff**.

### Anatomy of the Grand Staff
A Grand Staff consists of:
1. **Upper Staff:** Treble clef, usually played by the **right hand**.
2. **Lower Staff:** Bass clef, usually played by the **left hand**.
3. **Line and Brace:** A vertical bar line and curly bracket (brace) joining both staves at the left margin, indicating they sound simultaneously.

### The True Location of Middle C
Middle C (C4) is not exclusive to either clef!
- From the Treble staff: It is **one ledger line BELOW** the staff.
- From the Bass staff: It is **one ledger line ABOVE** the staff.
It is the exact same pitch (261.6 Hz) and the exact same physical white key on the piano!`,
      diagramType: 'grand_staff_middle_c',
      keyTakeaways: [
        "The Grand Staff combines Treble and Bass staves connected with a brace.",
        "The right hand normally plays the upper (treble) staff.",
        "The left hand normally plays the lower (bass) staff.",
        "Middle C (C4) is on the ledger line directly between both staves.",
        "Double angle brackets << >> in LilyPond run multiple staves concurrently."
      ],
      audioPreviews: [
        { label: "Grand Staff Arpeggio", midi: [48, 52, 55, 60, 64, 67, 72], description: "From C3 in the bass through Middle C up to C5 in the treble." }
      ]
    },
    traditionalPractice: {
      title: "Playing Both Registers on the Keyboard",
      instructions: "Play the low bass note C3 (Bass staff), then Middle C4, then treble note G4.",
      targetCode: `\\version "2.24.0"
{
  \\clef bass
  c2
  \\clef treble
  c'4 g' |
}`,
      clef: "grand",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "C3 is Space 2 in bass clef.",
        "C4 is Middle C.",
        "G4 is Line 2 in treble clef."
      ]
    },
    syntax: {
      title: "Building a PianoStaff in LilyPond",
      command: "\\new PianoStaff << ... >>",
      explanation: "In LilyPond, simultaneous staves are grouped with << and >>. To engrave a piano brace connecting treble and bass staves, use \\new PianoStaff << \\new Staff { ... } \\new Staff { ... } >>.",
      rules: [
        "Use << >> to enclose parallel/concurrent music lines.",
        "Wrap each individual stave in \\new Staff { ... }.",
        "Wrap both staves inside \\new PianoStaff << ... >> to generate the piano bracket brace."
      ],
      exampleCode: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    g'1
  }
  \\new Staff {
    \\clef bass
    c1
  }
>>`,
      cheatSheet: [
        { command: "\\new PianoStaff << >>", description: "Connects two staves with a grand piano brace" },
        { command: "\\new Staff { }", description: "Creates an individual musical staff" },
        { command: "<< >>", description: "Runs musical blocks in parallel at the same time" }
      ],
      quiz: {
        question: "Which LilyPond delimiter is used to run staves or voices in parallel?",
        options: [
          "<< and >> (double angle brackets)",
          "{ and } (curly braces)",
          "[ and ] (square brackets)",
          "( and ) (parentheses)"
        ],
        answer: 0,
        explanation: "Double angle brackets << >> instruct LilyPond to engrave enclosed blocks simultaneously (in parallel)."
      }
    },
    reconstruction: {
      prompt: "Complete the Grand Staff by adding the lower Bass staff: \\clef bass c1.",
      scaffoldCode: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    g'1
  }
  \\new Staff {
    % Add bass clef and whole note C:
    
  }
>>`,
      solutionCode: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    g'1
  }
  \\new Staff {
    \\clef bass
    c1
  }
>>`,
      expectedPitches: ["g4", "c3"],
      hints: [
        "Inside the second \\new Staff, write: \\clef bass c1"
      ],
      commandBank: ["\\new PianoStaff <<", "\\new Staff {", "\\clef bass", "c1", "}", ">>"]
    },
    capstone: {
      title: "Minuet in G (Grand Staff Accompaniment)",
      composer: "Christian Petzold / J.S. Bach",
      opus: "BWV Anh. 114",
      era: "Baroque",
      year: 1725,
      meter: "3/4",
      key: "G major",
      tempoBpm: 100,
      slowBpm: 60,
      codePrompt: "Engrave Petzold's two-hand opening: upper treble melody (d4 g,8 a b c) and lower bass chord (<g, b, d>2.).",
      initialCode: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\key g \\major
    \\time 3/4
    \\relative c'' {
      d4 g,8 a b c |
    }
  }
  \\new Staff {
    \\clef bass
    \\key g \\major
    \\time 3/4
    % Add dotted half chord <g b d>2. in relative c:
    \\relative c {
      
    }
  }
>>`,
      solutionCode: `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\key g \\major
    \\time 3/4
    \\relative c'' {
      d4 g,8 a b c |
    }
  }
  \\new Staff {
    \\clef bass
    \\key g \\major
    \\time 3/4
    \\relative c {
      <g b d>2. |
    }
  }
>>`,
      expectedPitches: ["d5", "g4", "a4", "b4", "c5", "g3", "b3", "d4"],
      hint: "In the bass staff, write: <g b d>2. |",
      reflectionQuestion: "What is the primary function of the lower staff in classical keyboard texture?",
      reflectionOptions: [
        "To provide harmonic foundation, bass line movement, and metric pulse",
        "To repeat the melody exactly one octave lower at all times",
        "It is merely decorative and optional for performers",
        "To indicate which foot pedals to press"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "The bass staff establishes the harmonic roots and rhythmic pulse upon which the upper melody unfolds."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 5: Half Steps, Whole Steps, and Accidentals
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.05_accidentals",
    chapter_order: 5,
    title: "5. Half Steps, Whole Steps, and Accidentals",
    concept_id: "concept.half_and_whole_steps",
    syntax_id: "syntax.is_es_accidentals",
    repertoire_id: "bach_chorale_bwv244",
    theory_summary: "A half step is the distance between two adjacent piano keys. Sharps (#) raise pitch by a half step; flats (b) lower pitch by a half step. In LilyPond, append 'is' for sharp and 'es' for flat.",
    theory_quiz: {
      question: "How do you write an F-sharp in LilyPond?",
      options: [
        "fis",
        "f#",
        "f-sharp",
        "sharp-f"
      ],
      answer: 0,
      explanation: "LilyPond uses Dutch note naming: sharps append the suffix 'is' (so F-sharp is fis) and flats append 'es' (so B-flat is bes)."
    },
    coding_challenge: {
      prompt: "Engrave C, C-sharp, D, E-flat, and E natural: c4 cis d ees e1 in \\relative c'.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % c, c-sharp, d, e-flat, e:
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 cis d ees | e1 |
}`,
      expected_pitches: ["c4", "cs4", "d4", "ds4", "e4"],
      hint: "Write: c4 cis d ees | e1 |"
    },
    theory: {
      summary: "Half steps and whole steps are the building blocks of musical scales. Accidentals (sharps, flats, naturals) modify pitch height.",
      markdown: `### Half Steps (Semitones)
A **half step** (or semitone) is the smallest distance between two pitches in Western music. On the piano keyboard, a half step is the distance between **any key and the very next adjacent key** (white or black).
- Notice that between **E and F**, and between **B and C**, there is *no black key*. Therefore, E to F and B to C are natural half steps!

### Whole Steps (Whole Tones)
A **whole step** is equal to **two half steps**. There is always exactly one key skipped in between.
- C to D is a whole step (C# skipped in between).
- E to F# is a whole step (F natural skipped in between).

### The Accidentals
- **Sharp ($\\sharp$):** Raises pitch by one half step.
- **Flat ($\\flat$):** Lowers pitch by one half step.
- **Natural ($\\natural$):** Cancels any preceding sharp or flat, restoring the natural pitch.
- **Enharmonic Equivalence:** Two different names for the identical pitch (e.g., C$\\sharp$ and D$\\flat$ sound identical).`,
      diagramType: 'half_whole_steps',
      keyTakeaways: [
        "A half step is the shortest distance between adjacent piano keys.",
        "E-F and B-C are natural half steps (no black key between them).",
        "A whole step equals two half steps.",
        "Sharp (#) raises by 1/2 step; Flat (b) lowers by 1/2 step.",
        "LilyPond uses Dutch suffixes: +is for sharp (fis), +es for flat (bes)."
      ],
      audioPreviews: [
        { label: "Half Step (C to C#)", midi: [60, 61], description: "Smallest melodic interval." },
        { label: "Natural Half Step (E to F)", midi: [64, 65], description: "Adjacent white keys without a black key between." },
        { label: "Whole Step (C to D)", midi: [60, 62], description: "Two half steps skipping C#." }
      ]
    },
    traditionalPractice: {
      title: "Playing Accidentals on the Keyboard",
      instructions: "Play C4, C#4 (black key), D4, Eb4 (black key), and E4 on the keyboard.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4 cis d ees | e1 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "C# is the first black key in the two-black-key group.",
        "Eb is the second black key in the two-black-key group."
      ]
    },
    syntax: {
      title: "LilyPond Dutch Accidental Suffixes",
      command: "is / es",
      explanation: "LilyPond was developed in the Netherlands and uses Dutch pitch nomenclature. Sharps append 'is' to the letter name, and flats append 'es'.",
      rules: [
        "Sharps: cis (C#), dis (D#), fis (F#), gis (G#), ais (A#).",
        "Flats: des (Db), ees (Eb), ges (Gb), aes (Ab), bes (Bb).",
        "Double sharps append 'isis' (e.g., fisis); double flats append 'eses' (e.g., eeses).",
        "Do not write '#' or 'b' in note names—always use 'is' or 'es'."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 cis d ees |
  e1 |
}`,
      cheatSheet: [
        { command: "cis", description: "C-sharp (C#)" },
        { command: "fis", description: "F-sharp (F#)" },
        { command: "ees", description: "E-flat (Eb)" },
        { command: "bes", description: "B-flat (Bb)" }
      ],
      quiz: {
        question: "How do you write B-flat in LilyPond?",
        options: [
          "bes",
          "bb",
          "b-flat",
          "flat-b"
        ],
        answer: 0,
        explanation: "B-flat is written as 'bes' in LilyPond Dutch nomenclature."
      }
    },
    reconstruction: {
      prompt: "Engrave C, C-sharp, D, E-flat, and E natural: c4 cis d ees | e1 |.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Write c4 cis d ees | e1 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 cis d ees | e1 |
}`,
      expectedPitches: ["c4", "cs4", "d4", "ds4", "e4"],
      hints: [
        "C-sharp is 'cis', E-flat is 'ees'.",
        "Write: c4 cis d ees | e1 |"
      ],
      commandBank: ["c4", "cis", "d", "ees", "|", "e1"]
    },
    capstone: {
      title: "O Haupt voll Blut und Wunden (Cadential Accidental)",
      composer: "J.S. Bach",
      opus: "BWV 244",
      era: "Baroque",
      year: 1727,
      meter: "4/4",
      key: "D minor",
      tempoBpm: 70,
      slowBpm: 45,
      codePrompt: "Engrave Bach's expressive phrase ending with a C-sharp leading tone: f4 e d cis | d2 | in D minor.",
      initialCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key d \\minor
  \\time 4/4
  % Write: f4 e d cis | d2 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key d \\minor
  \\time 4/4
  f4 e d cis | d2 |
}`,
      expectedPitches: ["f5", "e5", "d5", "cs5", "d5"],
      hint: "Use 'cis' for the C-sharp leading tone.",
      reflectionQuestion: "Why did Bach use a C-sharp (cis) in the key of D minor here?",
      reflectionOptions: [
        "As a raised leading tone that creates strong harmonic tension pulling upward to D tonic",
        "Because German printing presses lacked a natural C letter",
        "It was an accidental error that Bach forgot to correct",
        "To make the choir sing softer"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Raising scale degree 7 (C to C# in D minor) creates the leading tone that pulls with intense gravitational attraction to the tonic."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 8: Rhythmic Durations, Rests, and Ties
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.08_rhythms",
    chapter_order: 8,
    title: "8. Rhythmic Durations, Rests, and Ties",
    concept_id: "concept.rhythm_durations",
    syntax_id: "syntax.durations",
    repertoire_id: "beethoven_ode_to_joy",
    theory_summary: "Each note duration is twice as long as the next smaller value (whole = 2 halves = 4 quarters = 8 eighths). A dot adds 50% more duration. Rests use 'r' and ties use '~'.",
    theory_quiz: {
      question: "How many eighth notes are equal in duration to a dotted quarter note?",
      options: [
        "3 eighth notes",
        "2 eighth notes",
        "4 eighth notes",
        "1.5 eighth notes"
      ],
      answer: 0,
      explanation: "A quarter note equals 2 eighth notes. The dot adds 50% of the quarter note's value (1 eighth note), totaling 3 eighth notes."
    },
    coding_challenge: {
      prompt: "Engrave a dotted rhythm: dotted quarter note c, eighth note d, followed by a half rest: c'4. d'8 r2.",
      initial_code: `\\version "2.24.0"
{
  \\clef treble
  \\time 4/4
  % dotted quarter c, eighth d, half rest:
  
}`,
      solution_code: `\\version "2.24.0"
{
  \\clef treble
  \\time 4/4
  c'4. d'8 r2 |
}`,
      expectedPitches: ["c4", "d4"],
      hint: "Type: c'4. d'8 r2 |"
    },
    theory: {
      summary: "Musical rhythm organizes sound over time. In simple meter, durations follow a binary subdivision tree. Dots and ties modify note lengths.",
      markdown: `### The Binary Rhythm Tree
In Western music notation, note values relate by factors of two:
- **Whole Note (1):** 4 beats in 4/4 time.
- **Half Note (2):** 2 beats (half of a whole note).
- **Quarter Note (4):** 1 beat (half of a half note).
- **Eighth Note (8):** 1/2 beat (half of a quarter note).
- **Sixteenth Note (16):** 1/4 beat.

### The Augmentation Dot
A dot placed to the right of a notehead increases its duration by **50% (half of its original value)**:
$$\\text{Dotted Half (2.)} = 2 + 1 = 3 \\text{ beats}$$
$$\\text{Dotted Quarter (4.)} = 1 + 0.5 = 1.5 \\text{ beats (equal to 3 eighth notes)}$$

### Rests and Ties
- **Rests:** Indicate silence of a specific duration (whole rest, half rest, quarter rest, etc.).
- **Ties ($\\sim$):** A curved line connecting two notes of the *identical pitch*, merging them into one sustained sound without re-articulating.`,
      diagramType: 'rhythm_subdivision',
      keyTakeaways: [
        "Each rhythmic value is half as long as the one before it.",
        "A dot adds 50% to the duration of the note it follows.",
        "Rests denote measured silences and use the letter 'r' in LilyPond.",
        "Ties (~) combine two note values into one continuous pitch."
      ],
      audioPreviews: [
        { label: "Whole Note (4 Beats)", midi: [60], description: "Sustained for four full metric pulses." },
        { label: "Dotted Quarter to Eighth", midi: [64, 62], description: "Classic 3:1 dotted lilt rhythm." }
      ]
    },
    traditionalPractice: {
      title: "Tapping and Playing Dotted Rhythms",
      instructions: "Play the dotted rhythm on keyboard: C4 (dotted quarter), D4 (eighth note), followed by E4 (half note).",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  c4. d8 e2 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "Hold C4 for one and a half beats, play D4 quickly on the upbeat, then sustain E4 for 2 beats."
      ]
    },
    syntax: {
      title: "Duration Numbers, Dots, and Rests in LilyPond",
      command: "4. / r2 / ~",
      explanation: "LilyPond attaches duration numbers directly to notes. Append a period '.' for a dotted note. Use the letter 'r' with a duration number for rests.",
      rules: [
        "Numbers indicate duration: 1 (whole), 2 (half), 4 (quarter), 8 (eighth).",
        "Add a dot: c4. (dotted quarter note).",
        "Rests use 'r': r1 (whole rest), r2 (half rest), r4 (quarter rest), r8 (eighth rest).",
        "Ties use tilde: c1 ~ c1."
      ],
      exampleCode: `\\version "2.24.0"
{
  \\clef treble
  \\time 4/4
  c'4. d'8 r2 |
}`,
      cheatSheet: [
        { command: "c4.", description: "Dotted quarter note" },
        { command: "r2", description: "Half rest (2 beats of silence)" },
        { command: "c2 ~ c2", description: "Tie connecting two half notes" }
      ],
      quiz: {
        question: "In LilyPond, how do you engrave a half rest (2 beats of silence)?",
        options: [
          "r2",
          "rest2",
          "silence2",
          "h2"
        ],
        answer: 0,
        explanation: "In LilyPond, rests are written using the letter 'r' followed by the duration: r2."
      }
    },
    reconstruction: {
      prompt: "Engrave a dotted rhythm: c'4. d'8 r2 |.",
      scaffoldCode: `\\version "2.24.0"
{
  \\clef treble
  \\time 4/4
  % Write: c'4. d'8 r2 |
  
}`,
      solutionCode: `\\version "2.24.0"
{
  \\clef treble
  \\time 4/4
  c'4. d'8 r2 |
}`,
      expectedPitches: ["c4", "d4"],
      hints: [
        "Type c'4. followed by d'8, then r2 |"
      ],
      commandBank: ["c'4.", "d'8", "r2", "|"]
    },
    capstone: {
      title: "Ode to Joy (Dotted Cadence)",
      composer: "Ludwig van Beethoven",
      opus: "Op. 125",
      era: "Classical",
      year: 1824,
      meter: "4/4",
      key: "D major",
      tempoBpm: 90,
      slowBpm: 55,
      codePrompt: "Engrave Beethoven's famous dotted cadence: fis4. e8 e2 | in D major.",
      initialCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  % Write: fis4. e8 e2 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key d \\major
  \\time 4/4
  fis4. e8 e2 |
}`,
      expectedPitches: ["fs4", "e4", "e4"],
      hint: "Write: fis4. e8 e2 |",
      reflectionQuestion: "What metric effect does the dotted quarter note create at the phrase ending?",
      reflectionOptions: [
        "It prolongs the downbeat and delays the resolution to create an expressive musical breath",
        "It makes the orchestra play at double speed",
        "It cancels the key signature",
        "It was required because Beethoven ran out of quarter notes"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Dotted notes lean expressively across metric beats, giving classical cadences a natural vocal ebb and flow."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 9: Simple Meter and Time Signatures
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.09_simple_meter",
    chapter_order: 9,
    title: "9. Simple Meter and Time Signatures",
    concept_id: "concept.simple_meter",
    syntax_id: "syntax.time_command",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "In simple meters (2/4, 3/4, 4/4), the top number indicates beats per measure, and the bottom number indicates the note value of each beat. Use the pipe '|' for bar line checks.",
    theory_quiz: {
      question: "In 3/4 time, how many quarter-note beats are in each measure?",
      options: [
        "3 beats",
        "4 beats",
        "6 beats",
        "2 beats"
      ],
      answer: 0,
      explanation: "The top number (3) indicates 3 beats per measure; the bottom number (4) specifies that the quarter note gets one beat."
    },
    coding_challenge: {
      prompt: "Set \\time 3/4 and engrave two measures of a waltz: measure 1 = c4 d e, measure 2 = f2.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Add \\time 3/4 and two measures:
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 d e |
  f2. |
}`,
      expectedPitches: ["c4", "d4", "e4", "f4"],
      hint: "Write \\time 3/4, then c4 d e | f2. |"
    },
    theory: {
      summary: "Meter organizes pulses into repeating patterns of strong and weak beats called measures. Time signatures define the beat unit and measure length.",
      markdown: `### What is Meter?
**Meter** provides the underlying rhythmic framework of music. It organizes pulses into repeating metric units called **measures** (or bars), separated visually by vertical **barlines**.

### Anatomy of a Time Signature
A time signature consists of two vertically stacked numbers:
1. **Top Number:** The number of beats in each measure.
   - **2:** Duple meter (e.g., 2/4 march)
   - **3:** Triple meter (e.g., 3/4 waltz or minuet)
   - **4:** Quadruple meter (e.g., 4/4 common time)
2. **Bottom Number:** Which note duration receives one beat.
   - **4:** Quarter note
   - **2:** Half note
   - **8:** Eighth note

### Simple vs. Compound Meter
In a **simple meter**, each individual beat divides naturally into **two equal parts** (e.g., a quarter note divides into two eighth notes: "1-and 2-and").`,
      keyTakeaways: [
        "Top number = beats per measure; Bottom number = note value receiving one beat.",
        "Simple meter beats divide into 2 equal parts.",
        "3/4 is triple meter (3 quarter-note beats per bar) used in minuets and waltzes.",
        "In LilyPond, set time signatures with \\time 3/4 or \\time 4/4.",
        "Bar checks '|' catch metric typing errors immediately."
      ],
      audioPreviews: [
        { label: "3/4 Triple Waltz Meter", midi: [60, 64, 67], description: "STRONG - weak - weak dance lilt." }
      ]
    },
    traditionalPractice: {
      title: "Playing 3/4 Triple Meter on Keyboard",
      instructions: "Play 3 beats per measure: C4, D4, E4 in measure 1, then hold F4 for 3 beats (dotted half) in measure 2.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 d e | f2. |
}`,
      clef: "treble",
      key: "C major",
      meter: "3/4",
      tempoBpm: 90,
      slowBpm: 60,
      hints: [
        "Count: 1, 2, 3 | 1-2-3."
      ]
    },
    syntax: {
      title: "Setting Time Signatures in LilyPond",
      command: "\\time 3/4",
      explanation: "Use the \\time command followed by the fraction. Use '|' to verify that every measure has exactly the required number of beats.",
      rules: [
        "Declare meter near the beginning: \\time 3/4 or \\time 4/4.",
        "Bar check lines '|' produce compiler warnings if a measure has too few or too many beats.",
        "A dotted half note f2. fills an entire 3/4 measure."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 d e |
  f2. |
}`,
      cheatSheet: [
        { command: "\\time 3/4", description: "3 quarter notes per measure (triple meter)" },
        { command: "\\time 4/4", description: "4 quarter notes per measure (common time)" },
        { command: "\\time 2/4", description: "2 quarter notes per measure (duple meter)" }
      ],
      quiz: {
        question: "What note value fills an entire measure in 3/4 time?",
        options: [
          "Dotted half note (2.)",
          "Whole note (1)",
          "Quarter note (4)",
          "Dotted whole note (1.)"
        ],
        answer: 0,
        explanation: "A dotted half note equals 3 quarter beats (2 + 1 = 3), filling exactly one full measure of 3/4 time."
      }
    },
    reconstruction: {
      prompt: "Engrave two measures in 3/4 time: c4 d e | f2. |.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Add \\time 3/4 and write c4 d e | f2. |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 3/4
  c4 d e |
  f2. |
}`,
      expectedPitches: ["c4", "d4", "e4", "f4"],
      hints: [
        "Write \\time 3/4",
        "Then type c4 d e | f2. |"
      ],
      commandBank: ["\\time 3/4", "c4", "d", "e", "|", "f2."]
    },
    capstone: {
      title: "Minuet in G (3/4 Triple Dance Pulse)",
      composer: "Christian Petzold / J.S. Bach",
      opus: "BWV Anh. 114",
      era: "Baroque",
      year: 1725,
      meter: "3/4",
      key: "G major",
      tempoBpm: 105,
      slowBpm: 65,
      codePrompt: "Engrave Petzold's 3/4 minuet phrase: d4 g,8 a b c | d4 g, g |.",
      initialCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  % Write two 3/4 measures:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  d4 g,8 a b c |
  d4 g, g |
}`,
      expectedPitches: ["d5", "g4", "a4", "b4", "c5", "d5", "g4", "g4"],
      hint: "Use \\time 3/4 and write: d4 g,8 a b c | d4 g, g |",
      reflectionQuestion: "Why did 18th-century European court society favor 3/4 meter for minuets?",
      reflectionOptions: [
        "Its three-step cycle matched the elegant walking and bowing choreographies of court dances",
        "Prussian kings banned marching duple meters",
        "Baroque violins could only play in groups of three",
        "It made clocks tick faster"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "The minuet was the quintessential aristocratic court dance, with the 3/4 metric cycle matching formal courtly dance steps."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 12: Major Scales and Key Signatures
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.12_major_scales",
    chapter_order: 12,
    title: "12. Major Scales and Key Signatures",
    concept_id: "concept.major_scales",
    syntax_id: "syntax.key_command",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "The Major Scale follows the step pattern: Whole, Whole, Half, Whole, Whole, Whole, Half (W-W-H-W-W-W-H). Use \\key pitch \\major to set key signatures.",
    theory_quiz: {
      question: "Which accidental is found in the key signature of G major?",
      options: [
        "F-sharp (F#)",
        "B-flat (Bb)",
        "C-sharp (C#)",
        "No accidentals"
      ],
      answer: 0,
      explanation: "G major has one sharp (F-sharp), which raises scale degree 7 to create the required half-step leading tone below tonic G."
    },
    coding_challenge: {
      prompt: "Set \\key g \\major and engrave the G major scale: g4 a b c | d e fis g |.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % Add \\key g \\major and notes:
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key g \\major
  \\time 4/4
  g4 a b c |
  d4 e fis g |
}`,
      expectedPitches: ["g3", "a3", "b3", "c4", "d4", "e4", "fs4", "g4"],
      hint: "Use \\key g \\major and remember F-sharp is written as fis."
    },
    theory: {
      summary: "A major scale is a diatonic sequence of seven distinct pitches defined by the interval pattern W-W-H-W-W-W-H. Key signatures avoid writing accidentals repeatedly.",
      markdown: `### The Major Scale Formula
Every major scale in music is defined by the exact same sequence of whole steps (W) and half steps (H):
$$\\mathbf{W - W - H - W - W - W - H}$$

Notice that the half steps occur strictly between **Scale Degrees 3-4** and **Scale Degrees 7-8**:
- **C Major:** C $\\xrightarrow{W}$ D $\\xrightarrow{W}$ E $\\xrightarrow{H}$ F $\\xrightarrow{W}$ G $\\xrightarrow{W}$ A $\\xrightarrow{W}$ B $\\xrightarrow{H}$ C (no sharps or flats).
- **G Major:** G $\\xrightarrow{W}$ A $\\xrightarrow{W}$ B $\\xrightarrow{H}$ C $\\xrightarrow{W}$ D $\\xrightarrow{W}$ E $\\xrightarrow{W}$ **F#** $\\xrightarrow{H}$ G (requires one sharp: F#).

### Scale Degree Names
- $\\hat{1}$ **Tonic:** The home base pitch and foundation of the key.
- $\\hat{2}$ **Supertonic:** One step above tonic.
- $\\hat{3}$ **Mediant:** Halfway between tonic and dominant.
- $\\hat{4}$ **Subdominant:** Four steps up (or five steps down) from tonic.
- $\\hat{5}$ **Dominant:** The powerful tension center 5 steps above tonic.
- $\\hat{6}$ **Submediant:** Halfway between tonic and subdominant.
- $\\hat{7}$ **Leading Tone:** A half step below tonic with intense pull to resolve upward.`,
      diagramType: 'major_scale_steps',
      keyTakeaways: [
        "Major scale pattern: Whole - Whole - Half - Whole - Whole - Whole - Half.",
        "Half steps are strictly between degrees 3-4 and 7-8.",
        "Scale degree 1 is Tonic; scale degree 5 is Dominant; scale degree 7 is Leading Tone.",
        "In LilyPond, set key signatures with \\key g \\major or \\key c \\major."
      ],
      audioPreviews: [
        { label: "C Major Scale Ascending", midi: [60, 62, 64, 65, 67, 69, 71, 72], description: "Diatonic scale with no sharps or flats." },
        { label: "G Major Scale with F#", midi: [55, 57, 59, 60, 62, 64, 66, 67], description: "Scale starting on G with F-sharp leading tone." }
      ]
    },
    traditionalPractice: {
      title: "Playing the G Major Scale on Keyboard",
      instructions: "Play the G major scale from G3 to G4. Remember to press the black key for F#4!",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key g \\major
  \\time 4/4
  g4 a b c | d e fis g |
}`,
      clef: "treble",
      key: "G major",
      meter: "4/4",
      tempoBpm: 80,
      slowBpm: 50,
      hints: [
        "G is the starting key.",
        "When you reach scale degree 7, play F-sharp (black key right of F), then resolve to G."
      ]
    },
    syntax: {
      title: "Key Signatures in LilyPond",
      command: "\\key g \\major",
      explanation: "Set the key signature using \\key followed by the pitch name and \\major or \\minor. LilyPond automatically engraves the correct sharps or flats on the staff.",
      rules: [
        "Write \\key pitch \\major (e.g., \\key g \\major, \\key d \\major, \\key f \\major).",
        "LilyPond automatically places accidentals in the key signature block after the clef.",
        "Notes in code must still be written with their accidental suffix (e.g. fis), even if the key signature is active."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key g \\major
  \\time 4/4
  g4 a b c |
  d4 e fis g |
}`,
      cheatSheet: [
        { command: "\\key c \\major", description: "C major (no sharps or flats)" },
        { command: "\\key g \\major", description: "G major (1 sharp: F#)" },
        { command: "\\key d \\major", description: "D major (2 sharps: F#, C#)" }
      ],
      quiz: {
        question: "In LilyPond, when \\key g \\major is active, how must you write the note F-sharp in the music?",
        options: [
          "fis (LilyPond code always specifies pitch accurately)",
          "f (accidentals in key signatures are omitted in code)",
          "f#",
          "g-flat"
        ],
        answer: 0,
        explanation: "In LilyPond, you always write 'fis' for F-sharp even when a key signature is active. This avoids ambiguity."
      }
    },
    reconstruction: {
      prompt: "Set \\key g \\major and engrave the G major scale: g4 a b c | d e fis g |.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  % Add \\key g \\major and the scale notes:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\key g \\major
  \\time 4/4
  g4 a b c |
  d4 e fis g |
}`,
      expectedPitches: ["g3", "a3", "b3", "c4", "d4", "e4", "fs4", "g4"],
      hints: [
        "Write \\key g \\major \\time 4/4",
        "Then type g4 a b c | d e fis g |"
      ],
      commandBank: ["\\key g \\major", "\\time 4/4", "g4", "a", "b", "c", "d", "e", "fis", "g", "|"]
    },
    capstone: {
      title: "Minuet in G (Complete Theme in G Major)",
      composer: "Christian Petzold / J.S. Bach",
      opus: "BWV Anh. 114",
      era: "Baroque",
      year: 1725,
      meter: "3/4",
      key: "G major",
      tempoBpm: 100,
      slowBpm: 60,
      codePrompt: "Engrave Petzold's full four-measure phrase in G major: d4 g,8 a b c | d4 g, g | e'4 c8 d e fis | g4 g, g |.",
      initialCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  % Write the 4-measure phrase:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c'' {
  \\clef treble
  \\key g \\major
  \\time 3/4
  d4 g,8 a b c |
  d4 g, g |
  e'4 c8 d e fis |
  g4 g, g |
}`,
      expectedPitches: ["d5", "g4", "a4", "b4", "c5", "d5", "g4", "g4", "e5", "c5", "d5", "e5", "fs5", "g5", "g4", "g4"],
      hint: "Use \\relative c'' and write all 4 measures in G major.",
      reflectionQuestion: "Notice the ascent in measure 3: 'e'4 c8 d e fis | g4'. How does Petzold use the G major scale here?",
      reflectionOptions: [
        "As an ascending scalar run that uses the F# leading tone to dramatically launch into the high tonic climax G5",
        "To switch into Hungarian minor tuning",
        "To hide a secret cryptographic message to Bach",
        "To test if the pianist's fingers are long enough"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Petzold uses the stepwise momentum of the G major scale culminating in the F# leading tone to create an exhilarating melodic climax on high G5."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 16: Intervals (Harmonic & Melodic)
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.16_intervals",
    chapter_order: 16,
    title: "16. Intervals (Harmonic & Melodic)",
    concept_id: "concept.intervals",
    syntax_id: "syntax.chords_angle_brackets",
    repertoire_id: "mozart_twinkle_variations",
    theory_summary: "An interval is the distance between two notes. Melodic intervals sound in sequence; harmonic intervals sound simultaneously. In LilyPond, simultaneous notes are enclosed in angle brackets < >.",
    theory_quiz: {
      question: "What is the interval between C4 and G4?",
      options: [
        "Perfect Fifth (P5)",
        "Major Third (M3)",
        "Perfect Fourth (P4)",
        "Minor Sixth (m6)"
      ],
      answer: 0,
      explanation: "C to G spans five letter names (C-D-E-F-G) and encompasses 7 half steps, defining a Perfect Fifth."
    },
    coding_challenge: {
      prompt: "Engrave three harmonic intervals in \\relative c': a Major Third <c e>2, followed by a Perfect Fifth <c g>2.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % Angle bracket intervals:
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e>2 <c g>2 |
}`,
      expectedPitches: ["c4", "e4", "c4", "g4"],
      hint: "Write <c e>2 <c g>2 |"
    },
    theory: {
      summary: "An interval is the musical distance between two pitches. Intervals can sound sequentially (melodic) or simultaneously (harmonic).",
      markdown: `### Generic Interval Size
To determine an interval's generic size, count the letter names inclusive from the lower note to the higher note:
- C to D = **Second (2nd)** (C, D)
- C to E = **Third (3rd)** (C, D, E)
- C to F = **Fourth (4th)** (C, D, E, F)
- C to G = **Fifth (5th)** (C, D, E, F, G)
- C to C = **Octave (8ve)** (8 letter names)

### Specific Interval Qualities
- **Perfect Intervals:** Unisons, 4ths, 5ths, and Octaves are called *Perfect* because of their acoustically pure harmonic ratios.
- **Major and Minor Intervals:** 2nds, 3rds, 6ths, and 7ths exist in *Major* (larger) and *Minor* (one half-step smaller) varieties.
  - C to E = Major 3rd (4 half steps).
  - C to Eb = Minor 3rd (3 half steps).

### Harmonic vs. Melodic Intervals
- **Melodic Interval:** Sounded one after another in a melody.
- **Harmonic Interval:** Sounded simultaneously as a chord or harmony.`,
      keyTakeaways: [
        "Intervals measure pitch distance: Unison, 2nd, 3rd, 4th, 5th, 6th, 7th, Octave.",
        "Unisons, 4ths, 5ths, and Octaves are Perfect.",
        "2nds, 3rds, 6ths, and 7ths can be Major or Minor.",
        "Simultaneous notes in LilyPond use angle brackets: <c e>2."
      ],
      audioPreviews: [
        { label: "Major 3rd (C to E)", midi: [60, 64], description: "Warm, consonant harmonic third." },
        { label: "Perfect 5th (C to G)", midi: [60, 67], description: "Open, resonant acoustic fifth." },
        { label: "Octave (C4 to C5)", midi: [60, 72], description: "Pure octave equivalence." }
      ]
    },
    traditionalPractice: {
      title: "Playing Harmonic Intervals on Keyboard",
      instructions: "Play the harmonic third C4 and E4 together, then the harmonic fifth C4 and G4 together on the keyboard.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e>2 <c g>2 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "Play C4 and E4, then C4 and G4."
      ]
    },
    syntax: {
      title: "Chords and Harmonic Intervals in LilyPond",
      command: "<c e>2",
      explanation: "To write notes sounding together at the same time in LilyPond, enclose them inside angle brackets < >. Attach the duration after the closing bracket.",
      rules: [
        "Wrap simultaneous notes inside < >.",
        "Put the duration outside: <c e>2 creates a half-note interval of C and E.",
        "Three or more notes inside < > form a chord: <c e g>1."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e>2 <c g>2 |
}`,
      cheatSheet: [
        { command: "<c e>2", description: "Harmonic third (half note)" },
        { command: "<c g>2", description: "Harmonic fifth (half note)" },
        { command: "<c e g>1", description: "C major triad (whole note)" }
      ],
      quiz: {
        question: "How do you engrave a simultaneous harmonic interval of C and E in LilyPond?",
        options: [
          "<c e>2",
          "(c e)2",
          "[c e]2",
          "{c e}2"
        ],
        answer: 0,
        explanation: "Angle brackets < > are strictly used in LilyPond to engrave simultaneous notes (chords and harmonic intervals)."
      }
    },
    reconstruction: {
      prompt: "Engrave a Major Third and a Perfect Fifth: <c e>2 <c g>2 | in \\relative c'.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % Write <c e>2 <c g>2 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e>2 <c g>2 |
}`,
      expectedPitches: ["c4", "e4", "c4", "g4"],
      hints: [
        "Use angle brackets: <c e>2 <c g>2 |"
      ],
      commandBank: ["<c e>2", "<c g>2", "|"]
    },
    capstone: {
      title: "Ah! vous dirai-je, Maman (Harmonic Accompaniment)",
      composer: "W. A. Mozart",
      opus: "KV 265",
      era: "Classical",
      year: 1781,
      meter: "2/4",
      key: "C major",
      tempoBpm: 80,
      slowBpm: 50,
      codePrompt: "Engrave Mozart's harmonic accompaniment: <c e g>2 | <c e g> | <c f a> | <c e g> | in bass clef.",
      initialCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\time 2/4
  % Write the harmonic accompaniment:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\time 2/4
  <c e g>2 | <c e g> | <c f a> | <c e g> |
}`,
      expectedPitches: ["c3", "e3", "g3", "c3", "e3", "g3", "c3", "f3", "a3", "c3", "e3", "g3"],
      hint: "Use angle brackets for each triad: <c e g>2 | <c e g> | <c f a> | <c e g> |",
      reflectionQuestion: "Why did Mozart alternate between <c e g> (Tonic) and <c f a> (Subdominant)?",
      reflectionOptions: [
        "To establish classic harmonic motion between home (I) and departure (IV) that supports the melody",
        "Because Mozart's keyboard was missing the B key",
        "It was the only harmony permitted by the Viennese censors",
        "To play chords as loud as possible"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Harmonic intervals and triads create gravitational cycles of stability (Tonic I) and departure (Subdominant IV)."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 17: Triads (Major and Minor)
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.17_triads",
    chapter_order: 17,
    title: "17. Triads (Major and Minor)",
    concept_id: "concept.triads",
    syntax_id: "syntax.chords_angle_brackets",
    repertoire_id: "bach_chorale_bwv244",
    theory_summary: "A triad consists of a Root, Third, and Fifth. Major triad = M3 + m3 (e.g. C-E-G). Minor triad = m3 + M3 (e.g. C-Eb-G).",
    theory_quiz: {
      question: "What pitches make up a C minor triad in root position?",
      options: [
        "C – E♭ – G",
        "C – E – G",
        "C – E♭ – G♭",
        "C – E – G♯"
      ],
      answer: 0,
      explanation: "A minor triad consists of a root (C), a minor third (Eb, 3 half steps above root), and a perfect fifth (G, 7 half steps above root)."
    },
    coding_challenge: {
      prompt: "Engrave a C major triad <c e g>2 followed by a C minor triad <c ees g>2.",
      initial_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % C major then C minor triad:
  
}`,
      solution_code: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e g>2 <c ees g>2 |
}`,
      expectedPitches: ["c4", "e4", "g4", "c4", "ds4", "g4"],
      hint: "Write <c e g>2 <c ees g>2 |"
    },
    theory: {
      summary: "Triads are three-note chords built by stacking thirds above a root: Root, Third, and Fifth. Major and minor triads form the bedrock of Western harmony.",
      markdown: `### Triad Anatomy
A **triad** contains three chord members:
1. **Root:** The foundational note after which the chord is named.
2. **Third:** The middle note, an interval of a third above the root.
3. **Fifth:** The top note, an interval of a fifth above the root.

### Major vs. Minor Triads
The quality of a triad is determined by the specific intervals stacked:
- **Major Triad:** Major 3rd (4 semitones) + Minor 3rd (3 semitones).
  - Formula: $\\text{Root} \\xrightarrow{\\text{M3}} \\text{Third} \\xrightarrow{\\text{m3}} \\text{Fifth}$
  - Example: **C - E - G** (bright, open, stable).
- **Minor Triad:** Minor 3rd (3 semitones) + Major 3rd (4 semitones).
  - Formula: $\\text{Root} \\xrightarrow{\\text{m3}} \\text{Third} \\xrightarrow{\\text{M3}} \\text{Fifth}$
  - Example: **C - Eb - G** (somber, reflective).`,
      keyTakeaways: [
        "Triad members: Root, Third, and Fifth.",
        "Major Triad = Major 3rd + Minor 3rd (e.g., C-E-G).",
        "Minor Triad = Minor 3rd + Major 3rd (e.g., C-Eb-G).",
        "Both major and minor triads have a Perfect 5th between Root and Fifth."
      ],
      audioPreviews: [
        { label: "C Major Triad (C-E-G)", midi: [60, 64, 67], description: "Major triad with bright, consonant character." },
        { label: "C Minor Triad (C-Eb-G)", midi: [60, 63, 67], description: "Minor triad with reflective, melancholy character." }
      ]
    },
    traditionalPractice: {
      title: "Playing Major and Minor Triads on Keyboard",
      instructions: "Play the C major triad (C4-E4-G4), then the C minor triad (C4-Eb4-G4) on the keyboard.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e g>2 <c ees g>2 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "For C minor, lower the middle note E to E-flat (black key)."
      ]
    },
    syntax: {
      title: "Engraving Triads in LilyPond",
      command: "<c e g>2",
      explanation: "Write the three pitch names inside angle brackets < >. For minor triads, remember to use 'ees' for E-flat.",
      rules: [
        "Enclose the root, third, and fifth inside < >.",
        "C major: <c e g>2.",
        "C minor: <c ees g>2."
      ],
      exampleCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e g>2 <c ees g>2 |
}`,
      cheatSheet: [
        { command: "<c e g>2", description: "C Major Triad" },
        { command: "<c ees g>2", description: "C Minor Triad" }
      ],
      quiz: {
        question: "How do you write a C minor triad in LilyPond?",
        options: [
          "<c ees g>2",
          "<c eb g>2",
          "<c e g>minor",
          "<c min g>2"
        ],
        answer: 0,
        explanation: "In LilyPond, E-flat is 'ees', so a C minor triad is written as <c ees g>."
      }
    },
    reconstruction: {
      prompt: "Engrave a C major triad followed by a C minor triad: <c e g>2 <c ees g>2 |.",
      scaffoldCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % Write C major triad then C minor triad:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <c e g>2 <c ees g>2 |
}`,
      expectedPitches: ["c4", "e4", "g4", "c4", "ds4", "g4"],
      hints: [
        "Write <c e g>2 <c ees g>2 |"
      ],
      commandBank: ["<c e g>2", "<c ees g>2", "|"]
    },
    capstone: {
      title: "O Haupt voll Blut und Wunden (Minor Triad Harmony)",
      composer: "J.S. Bach",
      opus: "BWV 244",
      era: "Baroque",
      year: 1727,
      meter: "4/4",
      key: "D minor",
      tempoBpm: 65,
      slowBpm: 45,
      codePrompt: "Engrave Bach's opening D minor and A major cadence: <d f a>2 <cis e a>2 |.",
      initialCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  % Write: <d f a>2 <cis e a>2 |
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <d f a>2 <cis e a>2 |
}`,
      expectedPitches: ["d4", "f4", "a4", "cs4", "e4", "a4"],
      hint: "Write <d f a>2 <cis e a>2 |",
      reflectionQuestion: "What emotional color does the transition from D minor <d f a> to A major <cis e a> evoke?",
      reflectionOptions: [
        "A sense of solemn passion resolving with dramatic urgency toward the dominant",
        "Comic circus march music",
        "It cancels all sound",
        "It causes the singer to lose their pitch"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "The alternation between minor tonic and major dominant with the raised leading tone C# gives Bach's Passion chorales their profound emotional gravity."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 19: Inversions and Figured Bass
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.19_inversions_figured_bass",
    chapter_order: 19,
    title: "19. Inversions and Figured Bass",
    concept_id: "concept.inversions_figured_bass",
    syntax_id: "syntax.figured_bass",
    repertoire_id: "pachelbel_canon_d_bass",
    theory_summary: "When the third is in the bass, the chord is in First Inversion (6). When the fifth is in the bass, it is in Second Inversion (6/4). LilyPond's \\figures context engraves figured bass below a staff.",
    theory_quiz: {
      question: "In figured bass, what does the figure '6' indicate below a bass note?",
      options: [
        "First inversion triad (the chord third is in the bass)",
        "Second inversion triad (the chord fifth is in the bass)",
        "A chord with six beats duration",
        "Root position with an added sixth"
      ],
      answer: 0,
      explanation: "The figure 6 is standard shorthand for 6/3, designating a triad in First Inversion with intervals of a third and a sixth above the bass note."
    },
    coding_challenge: {
      prompt: "Engrave a bass staff with a first inversion figure: bass note e2 with figure <6>.",
      initial_code: `\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    e2
  }
  \\figures {
    % Add figure 6:
    
  }
>>`,
      solution_code: `\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    e2
  }
  \\figures {
    < 6 >2
  }
>>`,
      expectedPitches: ["e3"],
      hint: "In \\figures write < 6 >2"
    },
    theory: {
      summary: "Chord inversion is determined solely by which note is in the bass (the lowest sounding pitch). Figured bass is the Baroque shorthand system used by keyboardists.",
      markdown: `### Chord Inversion
The inversion of a chord depends strictly on the **lowest-sounding pitch (the bass note)**, regardless of how the upper voices are arranged:
1. **Root Position:** The **Root** is in the bass. (Figured as $^5_3$ or blank).
2. **First Inversion:** The **Third** is in the bass. (Figured as $^6$ or $^6_3$).
3. **Second Inversion:** The **Fifth** is in the bass. (Figured as $^6_4$).

### Baroque Figured Bass (Basso Continuo)
In the Baroque era (Bach, Handel, Vivaldi), composers wrote only the bass line and added numeric **figures** beneath it to tell the keyboardist or lutenist which chord intervals to improvise above the bass:
- A figure **6** instructs the player: play a third and a sixth above this bass note (First Inversion triad).
- A figure **6 4** instructs: play a fourth and a sixth above this bass note (Second Inversion triad).`,
      keyTakeaways: [
        "Inversion is determined entirely by the bass (lowest sounding) note.",
        "Root in bass = Root position; Third in bass = First inversion (6); Fifth in bass = Second inversion (6/4).",
        "Figured bass was the universal harmonic shorthand of the Baroque era.",
        "In LilyPond, figured bass is engraved using the \\figures { < 6 > } context."
      ],
      audioPreviews: [
        { label: "Root Position C Major", midi: [48, 64, 67], description: "C in bass (Root position)." },
        { label: "First Inversion C Major (C/E)", midi: [52, 60, 67], description: "E in bass (First inversion with figure 6)." }
      ]
    },
    traditionalPractice: {
      title: "Playing Inverted Chords on Keyboard",
      instructions: "Play bass note E3 (First inversion bass), then C4 and G4 in the right hand.",
      targetCode: `\\version "2.24.0"
{
  \\clef bass
  e4
  \\clef treble
  <c' g'>2 |
}`,
      clef: "grand",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "E3 is Space 3 in bass clef.",
        "C4 and G4 are played together in treble."
      ]
    },
    syntax: {
      title: "Figured Bass in LilyPond",
      command: "\\figures { < 6 >2 }",
      explanation: "LilyPond features a dedicated \\figures context that engraves historical figured bass numbers underneath the staff.",
      rules: [
        "Combine \\new Staff and \\figures inside << >>.",
        "Enclose figures in angle brackets: < 6 > or < 6 4 >.",
        "Attach durations to the figure block: < 6 >2."
      ],
      exampleCode: `\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    e2
  }
  \\figures {
    < 6 >2
  }
>>`,
      cheatSheet: [
        { command: "\\figures { < 6 >2 }", description: "Engraves figure 6 under a half note" },
        { command: "\\figures { < 6 4 >2 }", description: "Engraves second inversion figure 6/4" }
      ],
      quiz: {
        question: "In LilyPond, which context is used to engrave Baroque numeric figures below a staff?",
        options: [
          "\\figures { ... }",
          "\\numbers { ... }",
          "\\basso { ... }",
          "\\roman { ... }"
        ],
        answer: 0,
        explanation: "LilyPond uses the \\figures { ... } context to engrave figured bass."
      }
    },
    reconstruction: {
      prompt: "Engrave a bass note e2 with figure 6: in \\figures write < 6 >2.",
      scaffoldCode: `\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    e2
  }
  \\figures {
    % Add figure 6:
    
  }
>>`,
      solutionCode: `\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    e2
  }
  \\figures {
    < 6 >2
  }
>>`,
      expectedPitches: ["e3"],
      hints: [
        "Inside \\figures, write < 6 >2"
      ],
      commandBank: ["\\figures {", "< 6 >2", "}", "<<", ">>"]
    },
    capstone: {
      title: "Canon in D (Pachelbel's Ground Bass)",
      composer: "Johann Pachelbel",
      opus: "PWC 37",
      era: "Baroque",
      year: 1694,
      meter: "4/4",
      key: "D major",
      tempoBpm: 80,
      slowBpm: 50,
      codePrompt: "Engrave Pachelbel's immortal ground bass in D major: d4 a b fis | g d g a |.",
      initialCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\key d \\major
  \\time 4/4
  % Write the 8-note ground bass:
  
}`,
      solutionCode: `\\version "2.24.0"
\\relative c {
  \\clef bass
  \\key d \\major
  \\time 4/4
  d4 a b fis |
  g4 d g a |
}`,
      expectedPitches: ["d3", "a2", "b2", "fs2", "g2", "d3", "g2", "a2"],
      hint: "In bass clef in \\relative c, write: d4 a b fis | g d g a |",
      reflectionQuestion: "Why is Pachelbel's 8-note sequence called a 'ground bass' (basso ostinato)?",
      reflectionOptions: [
        "Because it repeats obstinately throughout the entire composition while 3 violins weave variations above it",
        "Because it must be played while sitting on the ground",
        "Because it was discovered underground in Nuremberg",
        "Because it only uses whole notes"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "A ground bass (basso ostinato) is a repeating baseline progression that anchors an entire contrapuntal work from start to finish."
    }
  },

  // -------------------------------------------------------------------------------------------------
  // LESSON 20: Roman Numerals and SATB Voice Leading
  // -------------------------------------------------------------------------------------------------
  {
    id: "lesson.fundamentals.20_roman_numerals",
    chapter_order: 20,
    title: "20. Roman Numerals and SATB Voice Leading",
    concept_id: "concept.roman_numerals_satb",
    syntax_id: "syntax.polyphony_voices",
    repertoire_id: "bach_chorale_bwv244",
    theory_summary: "Roman numerals analyze harmonic function (I = Tonic, IV = Subdominant, V = Dominant). SATB distributes harmony across Soprano, Alto, Tenor, and Bass. In LilyPond, double backslash '\\\\' separates voices.",
    theory_quiz: {
      question: "In the key of C major, which chord is the Dominant (V)?",
      options: [
        "G major (G - B - D)",
        "F major (F - A - C)",
        "A minor (A - C - E)",
        "D minor (D - F - A)"
      ],
      answer: 0,
      explanation: "Scale degree 5 in C major is G, making G major the Dominant (V) chord."
    },
    coding_challenge: {
      prompt: "Engrave a two-voice cadence on one staff using << \\\\ >>: Soprano sings d4 c2, Alto sings b4 c2 in treble.",
      initial_code: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\relative c'' {
    <<
      { d4 c2 }  % Voice 1 (Soprano)
      \\\\
      % Voice 2 (Alto) b4 c2:
      
    >>
  }
}`,
      solution_code: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\relative c'' {
    <<
      { d4 c2 }
      \\\\
      { b4 c2 }
    >>
  }
}`,
      expectedPitches: ["d5", "c5", "b4", "c5"],
      hint: "In the second voice, write: { b4 c2 }"
    },
    theory: {
      summary: "Roman numerals identify chord relationships regardless of key. Four-part SATB writing divides harmony into Soprano, Alto, Tenor, and Bass voices.",
      markdown: `### Roman Numeral Analysis
Music theorists use Roman numerals to designate the harmonic function of chords built on each scale degree:
- **Major Chords:** Uppercase Roman numerals (I, IV, V).
- **Minor Chords:** Lowercase Roman numerals (ii, iii, vi).
- **Diminished Chords:** Lowercase with a degree sign (vii$^\\circ$).

In major keys:
$$\\mathbf{I \\text{ (Tonic)} \\quad \\mathbf{ii} \\text{ (Supertonic)} \\quad \\mathbf{iii} \\text{ (Mediant)} \\quad \\mathbf{IV} \\text{ (Subdominant)} \\quad \\mathbf{V} \\text{ (Dominant)} \\quad \\mathbf{vi} \\text{ (Submediant)} \\quad \\mathbf{vii}^\\circ \\text{ (Leading Tone)}$$

### SATB Four-Part Polyphony
Classical harmony is traditionally voiced for a four-part choir:
1. **Soprano (S):** Highest voice, usually carries the principal melody.
2. **Alto (A):** Inner harmony voice below soprano.
3. **Tenor (T):** Upper male voice providing counter-melody.
4. **Bass (B):** Lowest voice, determines harmonic roots and inversions.`,
      keyTakeaways: [
        "Roman numerals analyze harmonic function across any key.",
        "Uppercase = Major (I, IV, V); Lowercase = Minor (ii, iii, vi).",
        "SATB divides harmony into Soprano, Alto, Tenor, and Bass.",
        "In LilyPond, << { voice 1 } \\\\ { voice 2 } >> separates simultaneous polyphonic lines on a single staff."
      ],
      audioPreviews: [
        { label: "Authentic Cadence (V to I)", midi: [67, 71, 74, 60, 64, 72], description: "G major dominant resolving to C major tonic." }
      ]
    },
    traditionalPractice: {
      title: "Playing a V - I Cadence on Keyboard",
      instructions: "Play the dominant tension chord G-B-D, then resolve to the tonic C-E-G.",
      targetCode: `\\version "2.24.0"
\\relative c' {
  \\clef treble
  \\time 4/4
  <g b d>2 <c e g>2 |
}`,
      clef: "treble",
      key: "C major",
      meter: "4/4",
      tempoBpm: 75,
      slowBpm: 50,
      hints: [
        "Feel how G-B-D creates tension that pulls satisfyingly into C-E-G."
      ]
    },
    syntax: {
      title: "Polyphonic Voice Separation in LilyPond",
      command: "<< { voice1 } \\\\ { voice2 } >>",
      explanation: "When two polyphonic parts share a single staff (such as Soprano & Alto on the treble staff), use << { voice1 } \\\\ { voice2 } >>. LilyPond automatically points Voice 1 stems UP and Voice 2 stems DOWN.",
      rules: [
        "Enclose the voices in << and >>.",
        "Separate each voice block with a double backslash \\\\.",
        "Voice 1 (before \\\\) automatically receives upward stems.",
        "Voice 2 (after \\\\) automatically receives downward stems."
      ],
      exampleCode: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\relative c'' {
    <<
      { d4 c2 }  % Voice 1 (stems up)
      \\\\
      { b4 c2 }  % Voice 2 (stems down)
    >>
  }
}`,
      cheatSheet: [
        { command: "<< { } \\\\ { } >>", description: "Separates polyphonic voices with automatic stem directions" }
      ],
      quiz: {
        question: "In LilyPond's << { voice1 } \\\\ { voice2 } >> construct, which direction do Voice 1 stems point?",
        options: [
          "Upward (representing the higher voice)",
          "Downward (representing the lower voice)",
          "Leftward",
          "Stems are removed"
        ],
        answer: 0,
        explanation: "Voice 1 automatically has upward-pointing stems, while Voice 2 has downward-pointing stems."
      }
    },
    reconstruction: {
      prompt: "Engrave a two-voice cadence using << \\\\ >>: Soprano { d4 c2 } and Alto { b4 c2 }.",
      scaffoldCode: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\relative c'' {
    <<
      { d4 c2 }
      \\\\
      % Add Voice 2: { b4 c2 }
      
    >>
  }
}`,
      solutionCode: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\relative c'' {
    <<
      { d4 c2 }
      \\\\
      { b4 c2 }
    >>
  }
}`,
      expectedPitches: ["d5", "c5", "b4", "c5"],
      hints: [
        "Write { b4 c2 } after \\\\"
      ],
      commandBank: ["<<", "{ d4 c2 }", "\\\\", "{ b4 c2 }", ">>"]
    },
    capstone: {
      title: "O Haupt voll Blut und Wunden (SATB Polyphony Cadence)",
      composer: "J.S. Bach",
      opus: "BWV 244",
      era: "Baroque",
      year: 1727,
      meter: "4/4",
      key: "D minor",
      tempoBpm: 65,
      slowBpm: 45,
      codePrompt: "Engrave Bach's two-part cadence: Soprano sings f4 e d2, Alto sings d4 cis a2 in D minor.",
      initialCode: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\key d \\minor
  \\time 4/4
  \\relative c'' {
    <<
      { f4 e d2 }
      \\\\
      % Write Alto voice: { d4 cis a2 }
      
    >>
  }
}`,
      solutionCode: `\\version "2.24.0"
\\new Staff {
  \\clef treble
  \\key d \\minor
  \\time 4/4
  \\relative c'' {
    <<
      { f4 e d2 }
      \\\\
      { d4 cis a2 }
    >>
  }
}`,
      expectedPitches: ["f5", "e5", "d5", "d5", "cs5", "a4"],
      hint: "In Voice 2, write: { d4 cis a2 }",
      reflectionQuestion: "Why does Bach keep the interval movements between voices mostly stepwise (conjunct)?",
      reflectionOptions: [
        "Stepwise voice leading creates smooth, singable lines and prevents jarring parallel fifths and octaves",
        "Because German choirs could only sing notes right next to each other",
        "Leaping was forbidden by church council rules",
        "To save space on the engraving plate"
      ],
      reflectionAnswer: 0,
      reflectionExplanation: "Classical contrapuntal voice leading privileges smooth stepwise motion, allowing each voice to maintain an independent, expressive melody."
    }
  }
];
