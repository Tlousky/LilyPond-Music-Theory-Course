/**
 * curriculumData.ts - Course Curriculum & Classical Repertoire Data
 * Derived from content/knowledge-graph/graph.json and content/repertoire/repertoire.json
 */

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
  expected_pitches: string[];
  hint: string;
}

export interface Lesson {
  id: string;
  chapter_order: number;
  title: string;
  concept_id: string;
  syntax_id: string;
  repertoire_id?: string;
  theory_summary: string;
  theory_quiz: TheoryQuiz;
  coding_challenge: CodingChallenge;
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
>>`
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
}`
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
>>`
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
>>`
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
>>`
  }
};

export const FUNDAMENTALS_LESSONS: Lesson[] = [
  {
    id: "lesson.fundamentals.01_intro",
    chapter_order: 1,
    title: "1. Musical Notation & Writing Code",
    concept_id: "concept.pitch",
    syntax_id: "syntax.relative_mode",
    repertoire_id: "mozart_twinkle_variations",
    theory_summary: "Music notation maps pitch vertically and rhythm horizontally. In LilyPond, we write code to engrave sheet music. Note names in LilyPond use standard lowercase letters: c, d, e, f, g, a, b.",
    theory_quiz: {
      question: "In Western music notation, how is pitch represented on the staff?",
      options: ["Vertically (higher notes placed higher on staff)", "Horizontally (from left to right)", "By note colors", "By font size"],
      answer: 0,
      explanation: "Pitches are positioned vertically on lines and spaces: higher frequencies sit higher on the staff."
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
      hint: "Inside \\relative c' { }, type: c4 d e f. Quarter notes after c4 inherit duration 4."
    }
  },
  {
    id: "lesson.fundamentals.02_notes_and_clefs",
    chapter_order: 2,
    title: "2. Notes, Clefs, and Ledger Lines",
    concept_id: "concept.staff",
    syntax_id: "syntax.clef_command",
    repertoire_id: "beethoven_ode_to_joy",
    theory_summary: "Notes consist of noteheads, stems, and flags/beams. Stems point down above the middle line, and up below it. Clefs assign pitch letters to lines. Ledger lines extend the staff higher or lower.",
    theory_quiz: {
      question: "For a note placed on or above the middle line of a staff, which direction should the stem typically point?",
      options: ["Downward (on the left side of notehead)", "Upward (on the right side of notehead)", "Always horizontally", "Any direction randomly"],
      answer: 0,
      explanation: "Standard engraving practice points stems downward for notes above the middle line to keep stems within the staff boundaries."
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
    }
  },
  {
    id: "lesson.fundamentals.03_reading_clefs",
    chapter_order: 3,
    title: "3. Reading Treble and Bass Clefs",
    concept_id: "concept.clef_treble",
    syntax_id: "syntax.clef_command",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "The Treble Clef (G Clef) circles G4 on the 2nd line. The Bass Clef (F Clef) centers two dots around F3 on the 4th line.",
    theory_quiz: {
      question: "Which pitch does the Bass Clef specify on its fourth line (from the bottom)?",
      options: ["F3 (below middle C)", "G4 (above middle C)", "Middle C (C4)", "A2"],
      answer: 0,
      explanation: "The bass clef is also known as the F clef because its two dots surround the line for F3."
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
    }
  },
  {
    id: "lesson.fundamentals.04_grand_staff",
    chapter_order: 4,
    title: "4. The Keyboard and the Grand Staff",
    concept_id: "concept.grand_staff",
    syntax_id: "syntax.piano_staff",
    repertoire_id: "petzold_minuet_g_anh114",
    theory_summary: "The Grand Staff unites Treble and Bass staves with a brace. Middle C (C4) sits on the ledger line directly between them.",
    theory_quiz: {
      question: "Where does Middle C (C4) sit on the Grand Staff?",
      options: ["On a ledger line between the treble and bass staves", "On the top line of the treble staff", "On the bottom line of the bass staff", "On space 3 of the bass staff"],
      answer: 0,
      explanation: "Middle C is one ledger line below the treble staff and one ledger line above the bass staff."
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
    }
  },
  {
    id: "lesson.fundamentals.05_accidentals",
    chapter_order: 5,
    title: "5. Half Steps, Whole Steps, and Accidentals",
    concept_id: "concept.half_and_whole_steps",
    syntax_id: "syntax.is_es_accidentals",
    repertoire_id: "bach_chorale_bwv244",
    theory_summary: "A half step is the distance between two adjacent keys on a piano. Sharps raise pitch by a half step; flats lower pitch by a half step. In LilyPond, append 'is' for sharp and 'es' for flat.",
    theory_quiz: {
      question: "How do you write an F-sharp in LilyPond?",
      options: ["fis", "f#", "f-sharp", "sharp-f"],
      answer: 0,
      explanation: "In LilyPond's Dutch naming, sharps are indicated by the suffix 'is', so F-sharp is 'fis'."
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
    }
  },
  {
    id: "lesson.fundamentals.08_rhythms",
    chapter_order: 8,
    title: "8. Rhythmic Durations, Rests, and Ties",
    concept_id: "concept.rhythm_durations",
    syntax_id: "syntax.durations",
    repertoire_id: "beethoven_ode_to_joy",
    theory_summary: "Each note duration is twice as long as the next smaller value (whole = 2 halves = 4 quarters = 8 eighths). A dot adds 50% more duration. Rests use the letter 'r'. Ties use '~'.",
    theory_quiz: {
      question: "How many eighth notes are equal in duration to a dotted quarter note?",
      options: ["3 eighth notes", "2 eighth notes", "4 eighth notes", "1.5 eighth notes"],
      answer: 0,
      explanation: "A quarter note = 2 eighths. The dot adds half its value (1 eighth), totaling 3 eighth notes."
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
      expected_pitches: ["c4", "d4"],
      hint: "Type: c'4. d'8 r2 |"
    }
  },
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
      options: ["3 beats", "4 beats", "6 beats", "2 beats"],
      answer: 0,
      explanation: "The top number 3 designates 3 beats per measure; the bottom number 4 designates the quarter note as the beat unit."
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
      expected_pitches: ["c4", "d4", "e4", "f4"],
      hint: "Write \\time 3/4, then c4 d e | f2. |"
    }
  },
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
      options: ["F-sharp (F♯)", "B-flat (B♭)", "C-sharp (C♯)", "No accidentals"],
      answer: 0,
      explanation: "G major has one sharp: F-sharp (fis in LilyPond)."
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
      expected_pitches: ["g3", "a3", "b3", "c4", "d4", "e4", "fs4", "g4"],
      hint: "Use \\key g \\major and remember F-sharp is written as fis."
    }
  },
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
      options: ["Perfect Fifth (P5)", "Major Third (M3)", "Perfect Fourth (P4)", "Minor Sixth (m6)"],
      answer: 0,
      explanation: "C to G spans five letter names (C-D-E-F-G) and contains 7 half steps, forming a Perfect Fifth."
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
      expected_pitches: ["c4", "e4", "c4", "g4"],
      hint: "Write <c e>2 <c g>2 |"
    }
  },
  {
    id: "lesson.fundamentals.17_triads",
    chapter_order: 17,
    title: "17. Triads (Major and Minor)",
    concept_id: "concept.triads",
    syntax_id: "syntax.chords_angle_brackets",
    repertoire_id: "bach_chorale_bwv244",
    theory_summary: "A triad consists of a Root, Third, and Fifth. Major triad = M3 + m3 (e.g. C-E-G). Minor triad = m3 + M3 (e.g. C-E♭-G).",
    theory_quiz: {
      question: "What pitches make up a C minor triad in root position?",
      options: ["C – E♭ – G", "C – E – G", "C – E♭ – G♭", "C – E – G♯"],
      answer: 0,
      explanation: "A minor triad has a minor third (C to E♭ = 3 half steps) and a perfect fifth (C to G = 7 half steps)."
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
      expected_pitches: ["c4", "e4", "g4", "c4", "ds4", "g4"],
      hint: "Write <c e g>2 <c ees g>2 |"
    }
  },
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
      options: ["First inversion triad (third is in the bass)", "Second inversion triad (fifth is in the bass)", "Root position sixth chord", "Six beats rest"],
      answer: 0,
      explanation: "The figure 6 is shorthand for 6/3, indicating a triad in first inversion."
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
      expected_pitches: ["e3"],
      hint: "In \\figures write < 6 >2"
    }
  },
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
      options: ["G major (G - B - D)", "F major (F - A - C)", "A minor (A - C - E)", "D minor (D - F - A)"],
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
      expected_pitches: ["d5", "c5", "b4", "c5"],
      hint: "In the second voice, write: { b4 c2 }"
    }
  }
];
