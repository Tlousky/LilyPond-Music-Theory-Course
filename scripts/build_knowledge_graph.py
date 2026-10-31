#!/usr/bin/env python3
"""
build_knowledge_graph.py - Constructs the Music Theory & LilyPond Knowledge Graph
Outputs:
1. content/knowledge-graph/graph.json (for web application frontend)
2. content/knowledge-graph/knowledge.sqlite (for CLI and agent relational queries)
"""

from __future__ import annotations
import sys
import json
import sqlite3
from pathlib import Path
from collections import defaultdict, deque

# Ensure stdout handles unicode
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_KG_DIR = ROOT_DIR / "content" / "knowledge-graph"
GRAPH_JSON_PATH = OUTPUT_KG_DIR / "graph.json"
SQLITE_DB_PATH = OUTPUT_KG_DIR / "knowledge.sqlite"
REPERTOIRE_JSON_PATH = ROOT_DIR / "content" / "repertoire" / "repertoire.json"
GLOSSARY_JSON_PATH = ROOT_DIR / "content" / "glossary.json"

# Core Theory Concepts & Prerequisites
THEORY_CONCEPTS = [
    {
        "id": "concept.pitch",
        "title": "Pitch and Sound Frequency",
        "category": "pitch",
        "chapter_id": "fundamentals.introduction-to-western-musical-notation",
        "description": "The highness or lowness of a sound determined by frequency; notated vertically on the staff."
    },
    {
        "id": "concept.staff",
        "title": "The Musical Staff & Ledger Lines",
        "category": "pitch",
        "chapter_id": "fundamentals.notation-of-notes-clefs-and-ledger-lines",
        "description": "Five lines and four spaces that provide reference for pitch height, extended by ledger lines."
    },
    {
        "id": "concept.clef_treble",
        "title": "Treble Clef (G Clef)",
        "category": "clef",
        "chapter_id": "fundamentals.clefs",
        "description": "Designates the second line from bottom as G4; used for soprano, violin, flute, piano right hand."
    },
    {
        "id": "concept.clef_bass",
        "title": "Bass Clef (F Clef)",
        "category": "clef",
        "chapter_id": "fundamentals.clefs",
        "description": "Designates the fourth line from bottom as F3; used for bass, cello, trombone, piano left hand."
    },
    {
        "id": "concept.grand_staff",
        "title": "The Grand Staff and Middle C",
        "category": "pitch",
        "chapter_id": "fundamentals.the-keyboard-and-grand-staff",
        "description": "Combining treble and bass staves joined by a brace, centered around Middle C (C4)."
    },
    {
        "id": "concept.half_and_whole_steps",
        "title": "Half Steps, Whole Steps, and Accidentals",
        "category": "pitch",
        "chapter_id": "fundamentals.half-and-whole-steps",
        "description": "The smallest intervals in Western music; sharps, flats, and naturals."
    },
    {
        "id": "concept.aspn",
        "title": "American Standard Pitch Notation (ASPN)",
        "category": "pitch",
        "chapter_id": "fundamentals.aspn",
        "description": "Scientific pitch designation combining letter name and octave number (e.g. C4 = Middle C)."
    },
    {
        "id": "concept.rhythm_durations",
        "title": "Rhythmic and Rest Values",
        "category": "rhythm",
        "chapter_id": "fundamentals.rhythmic-rest-values",
        "description": "Whole, half, quarter, eighth, and sixteenth notes and rests; ties and beams."
    },
    {
        "id": "concept.simple_meter",
        "title": "Simple Meter and Time Signatures",
        "category": "meter",
        "chapter_id": "fundamentals.simple-meter-and-time-signatures",
        "description": "Time signatures where each beat divides into two equal parts (2/4, 3/4, 4/4)."
    },
    {
        "id": "concept.compound_meter",
        "title": "Compound Meter and Time Signatures",
        "category": "meter",
        "chapter_id": "fundamentals.compound-meters-and-time-signatures",
        "description": "Time signatures where each beat divides into three equal parts (6/8, 9/8, 12/8)."
    },
    {
        "id": "concept.major_scales",
        "title": "Major Scales and Key Signatures",
        "category": "scales",
        "chapter_id": "fundamentals.major-scales",
        "description": "Diatonic scale with step pattern W-W-H-W-W-W-H; key signatures and Circle of Fifths."
    },
    {
        "id": "concept.minor_scales",
        "title": "Minor Scales (Natural, Harmonic, Melodic)",
        "category": "scales",
        "chapter_id": "fundamentals.minor-scales",
        "description": "Natural minor step pattern W-H-W-W-H-W-W, plus harmonic (raised 7) and melodic forms."
    },
    {
        "id": "concept.intervals",
        "title": "Diatonic and Chromatic Intervals",
        "category": "intervals",
        "chapter_id": "fundamentals.intervals",
        "description": "Distance between two pitches; generic size (2nd, 3rd...) and quality (Major, Minor, Perfect...)."
    },
    {
        "id": "concept.triads",
        "title": "Triads (Major, Minor, Diminished, Augmented)",
        "category": "harmony",
        "chapter_id": "fundamentals.triads",
        "description": "Three-note chords stacked in thirds: root, third, and fifth."
    },
    {
        "id": "concept.seventh_chords",
        "title": "Seventh Chords",
        "category": "harmony",
        "chapter_id": "fundamentals.seventh-chords",
        "description": "Four-note chords: Major 7th, Dominant 7th, Minor 7th, Half-Diminished, and Fully Diminished."
    },
    {
        "id": "concept.inversions_figured_bass",
        "title": "Inversion and Figured Bass",
        "category": "harmony",
        "chapter_id": "fundamentals.inversion-and-figured-bass",
        "description": "Root position, 1st inversion (6), 2nd inversion (6/4); Baroque basso continuo figures."
    },
    {
        "id": "concept.roman_numerals_satb",
        "title": "Roman Numerals and SATB Voice Leading",
        "category": "harmony",
        "chapter_id": "fundamentals.roman-numerals",
        "description": "Harmonic analysis using Roman numerals (I, IV, V, vi) and four-voice choral texture."
    }
]

# Concept Prerequisites (DAG edges)
PREREQUISITES = [
    ("concept.pitch", "concept.staff"),
    ("concept.staff", "concept.clef_treble"),
    ("concept.staff", "concept.clef_bass"),
    ("concept.clef_treble", "concept.grand_staff"),
    ("concept.clef_bass", "concept.grand_staff"),
    ("concept.pitch", "concept.half_and_whole_steps"),
    ("concept.grand_staff", "concept.aspn"),
    ("concept.half_and_whole_steps", "concept.aspn"),
    ("concept.pitch", "concept.rhythm_durations"),
    ("concept.rhythm_durations", "concept.simple_meter"),
    ("concept.simple_meter", "concept.compound_meter"),
    ("concept.half_and_whole_steps", "concept.major_scales"),
    ("concept.clef_treble", "concept.major_scales"),
    ("concept.major_scales", "concept.minor_scales"),
    ("concept.half_and_whole_steps", "concept.intervals"),
    ("concept.major_scales", "concept.intervals"),
    ("concept.intervals", "concept.triads"),
    ("concept.triads", "concept.seventh_chords"),
    ("concept.triads", "concept.inversions_figured_bass"),
    ("concept.inversions_figured_bass", "concept.roman_numerals_satb")
]

# LilyPond Syntax Constructs
LILYPOND_SYNTAX = [
    {
        "id": "syntax.relative_mode",
        "title": "\\relative c' Mode",
        "pattern": "\\relative c' { ... }",
        "doc_id": "lilypond.pitches-and-accidentals",
        "description": "Concise pitch entry where each note finds the nearest octave to the previous note."
    },
    {
        "id": "syntax.is_es_accidentals",
        "title": "is / es Accidental Suffixes",
        "pattern": "cis, fis, des, ees, bes",
        "doc_id": "lilypond.pitches-and-accidentals",
        "description": "Appending 'is' for sharps and 'es' for flats."
    },
    {
        "id": "syntax.clef_command",
        "title": "\\clef Command",
        "pattern": "\\clef treble / \\clef bass",
        "doc_id": "lilypond.clefs-and-staff",
        "description": "Sets the staff clef to treble, bass, alto, or tenor."
    },
    {
        "id": "syntax.piano_staff",
        "title": "PianoStaff Context",
        "pattern": "\\new PianoStaff << \\new Staff { ... } \\new Staff { ... } >>",
        "doc_id": "lilypond.clefs-and-staff",
        "description": "Grand Staff layout with brace combining treble and bass staves."
    },
    {
        "id": "syntax.durations",
        "title": "Duration Numbers & Dots",
        "pattern": "c1 c2 c4 c8 c4. r4",
        "doc_id": "lilypond.durations-and-rhythms",
        "description": "Reciprocal numbers 1, 2, 4, 8, 16 for rhythms, dot for dotted notes, r for rests."
    },
    {
        "id": "syntax.time_command",
        "title": "\\time Command",
        "pattern": "\\time 4/4, \\time 3/4, \\time 6/8",
        "doc_id": "lilypond.time-signatures-and-meters",
        "description": "Defines time signature and automatic beaming."
    },
    {
        "id": "syntax.key_command",
        "title": "\\key Command",
        "pattern": "\\key g \\major, \\key d \\minor",
        "doc_id": "lilypond.key-signatures-and-scales",
        "description": "Sets key signature accidentals on the staff."
    },
    {
        "id": "syntax.chords_angle_brackets",
        "title": "Chord Angle Brackets < >",
        "pattern": "<c e g>4, <c f a>2",
        "doc_id": "lilypond.chords-and-intervals",
        "description": "Simultaneous notes enclosed in angle brackets with duration after."
    },
    {
        "id": "syntax.figured_bass",
        "title": "\\figures Context",
        "pattern": "\\figures { < 6 > < 6 4 > }",
        "doc_id": "lilypond.inversions-and-figured-bass",
        "description": "Engraving figured bass numerals below bass staff."
    },
    {
        "id": "syntax.polyphony_voices",
        "title": "Voice Separation << \\\\ >>",
        "pattern": "<< { voice1 } \\\\ { voice2 } >>",
        "doc_id": "lilypond.polyphony-and-satb",
        "description": "Multiple independent voices with automatic stem directions on one staff."
    }
]

# Map Theory Concept -> LilyPond Syntax
CONCEPT_TO_SYNTAX = [
    ("concept.pitch", "syntax.relative_mode"),
    ("concept.half_and_whole_steps", "syntax.is_es_accidentals"),
    ("concept.clef_treble", "syntax.clef_command"),
    ("concept.clef_bass", "syntax.clef_command"),
    ("concept.grand_staff", "syntax.piano_staff"),
    ("concept.rhythm_durations", "syntax.durations"),
    ("concept.simple_meter", "syntax.time_command"),
    ("concept.compound_meter", "syntax.time_command"),
    ("concept.major_scales", "syntax.key_command"),
    ("concept.minor_scales", "syntax.key_command"),
    ("concept.intervals", "syntax.chords_angle_brackets"),
    ("concept.triads", "syntax.chords_angle_brackets"),
    ("concept.seventh_chords", "syntax.chords_angle_brackets"),
    ("concept.inversions_figured_bass", "syntax.figured_bass"),
    ("concept.roman_numerals_satb", "syntax.polyphony_voices")
]

# 21 Structured Lessons for Part I: Fundamentals
FUNDAMENTALS_LESSONS = [
    {
        "id": "lesson.fundamentals.01_intro",
        "chapter_order": 1,
        "title": "1. Introduction to Musical Notation & LilyPond",
        "concept_id": "concept.pitch",
        "syntax_id": "syntax.relative_mode",
        "repertoire_id": "mozart_twinkle_variations",
        "theory_summary": "Music notation maps pitch vertically and rhythm horizontally. In LilyPond, we write code to engrave sheet music.",
        "theory_quiz": {
            "question": "In Western music notation, how is pitch represented on the staff?",
            "options": ["Vertically (higher notes placed higher on staff)", "Horizontally (from left to right)", "By note colors", "By font size"],
            "answer": 0,
            "explanation": "Pitches are positioned vertically on lines and spaces: higher frequencies sit higher on the staff."
        },
        "coding_challenge": {
            "prompt": "Write your first LilyPond score! Engrave four quarter notes: C, D, E, F in treble clef using \\relative c'.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  % Write notes c4 d e f here:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  c4 d e f\n}',
            "expected_pitches": ["c4", "d4", "e4", "f4"],
            "hint": "In \\relative c', type: c4 d e f. Quarter notes after c4 inherit the duration 4."
        }
    },
    {
        "id": "lesson.fundamentals.02_notes_and_clefs",
        "chapter_order": 2,
        "title": "2. Notes, Clefs, and Ledger Lines",
        "concept_id": "concept.staff",
        "syntax_id": "syntax.clef_command",
        "repertoire_id": "beethoven_ode_to_joy",
        "theory_summary": "Notes consist of noteheads, stems, and flags/beams. Stems point down above the middle line, up below it. Clefs assign pitch letters to lines.",
        "theory_quiz": {
            "question": "For a note placed on or above the middle line of a staff, which direction should the stem typically point?",
            "options": ["Downward (on the left side of notehead)", "Upward (on the right side of notehead)", "Always horizontally", "Any direction randomly"],
            "answer": 0,
            "explanation": "Standard engraving practice points stems downward for notes above the middle line to keep stems within the staff boundaries."
        },
        "coding_challenge": {
            "prompt": "Engrave an ascending scale fragment from middle C (C4) to G4 in treble clef: c4 d e f g1.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  c4 d e f | g1 |\n}',
            "expected_pitches": ["c4", "d4", "e4", "f4", "g4"],
            "hint": "Set \\clef treble and write: c4 d e f | g1 |"
        }
    },
    {
        "id": "lesson.fundamentals.03_reading_clefs",
        "chapter_order": 3,
        "title": "3. Reading Treble and Bass Clefs",
        "concept_id": "concept.clef_treble",
        "syntax_id": "syntax.clef_command",
        "repertoire_id": "petzold_minuet_g_anh114",
        "theory_summary": "The Treble Clef circles G4 on the 2nd line. The Bass Clef centers two dots around F3 on the 4th line.",
        "theory_quiz": {
            "question": "Which pitch does the Bass Clef specify on its fourth line (from the bottom)?",
            "options": ["F3 (below middle C)", "G4 (above middle C)", "Middle C (C4)", "A2"],
            "answer": 0,
            "explanation": "The bass clef is also known as the F clef because its two dots surround the line for F3."
        },
        "coding_challenge": {
            "prompt": "Switch from treble clef to bass clef! Engrave C4 in treble, then switch to bass clef and engrave C3.",
            "initial_code": '\\version "2.24.0"\n{\n  \\clef treble\n  c\'1\n  % switch clef and write c3:\n  \n}',
            "solution_code": '\\version "2.24.0"\n{\n  \\clef treble\n  c\'1\n  \\clef bass\n  c1\n}',
            "expected_pitches": ["c4", "c3"],
            "hint": "Type \\clef bass followed by c1"
        }
    },
    {
        "id": "lesson.fundamentals.04_grand_staff",
        "chapter_order": 4,
        "title": "4. The Keyboard and the Grand Staff",
        "concept_id": "concept.grand_staff",
        "syntax_id": "syntax.piano_staff",
        "repertoire_id": "petzold_minuet_g_anh114",
        "theory_summary": "The Grand Staff unites Treble and Bass staves. Middle C (C4) sits on the ledger line directly between them.",
        "theory_quiz": {
            "question": "Where does Middle C (C4) sit on the Grand Staff?",
            "options": ["On a ledger line between the treble and bass staves", "On the top line of the treble staff", "On the bottom line of the bass staff", "On space 3 of the bass staff"],
            "answer": 0,
            "explanation": "Middle C is one ledger line below the treble staff and one ledger line above the bass staff."
        },
        "coding_challenge": {
            "prompt": "Create a Piano Grand Staff! The upper staff plays G4 whole note in treble, and the lower staff plays C3 whole note in bass.",
            "initial_code": '\\version "2.24.0"\n\\new PianoStaff <<\n  \\new Staff {\n    \\clef treble\n    g\'1\n  }\n  \\new Staff {\n    % Add bass clef and c1:\n    \n  }\n>>',
            "solution_code": '\\version "2.24.0"\n\\new PianoStaff <<\n  \\new Staff {\n    \\clef treble\n    g\'1\n  }\n  \\new Staff {\n    \\clef bass\n    c1\n  }\n>>',
            "expected_pitches": ["g4", "c3"],
            "hint": "In the lower Staff, write: \\clef bass c1"
        }
    },
    {
        "id": "lesson.fundamentals.05_accidentals",
        "chapter_order": 5,
        "title": "5. Half Steps, Whole Steps, and Accidentals",
        "concept_id": "concept.half_and_whole_steps",
        "syntax_id": "syntax.is_es_accidentals",
        "repertoire_id": "bach_chorale_bwv244",
        "theory_summary": "A half step is the distance between two adjacent keys on a piano. Sharps raise pitch by a half step; flats lower pitch by a half step.",
        "theory_quiz": {
            "question": "How do you write an F-sharp in LilyPond?",
            "options": ["fis", "f#", "f-sharp", "sharp-f"],
            "answer": 0,
            "explanation": "In LilyPond's Dutch naming, sharps are indicated by the suffix 'is', so F-sharp is 'fis'."
        },
        "coding_challenge": {
            "prompt": "Engrave C, C-sharp, D, E-flat, and E natural: c4 cis d ees e1 in \\relative c'.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  % c, c-sharp, d, e-flat, e:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  c4 cis d ees | e1 |\n}',
            "expected_pitches": ["c4", "cs4", "d4", "ds4", "e4"],
            "hint": "Write: c4 cis d ees | e1 |"
        }
    },
    {
        "id": "lesson.fundamentals.08_rhythms",
        "chapter_order": 8,
        "title": "8. Rhythmic Durations, Rests, and Ties",
        "concept_id": "concept.rhythm_durations",
        "syntax_id": "syntax.durations",
        "repertoire_id": "beethoven_ode_to_joy",
        "theory_summary": "Each note duration is twice as long as the next smaller value (whole = 2 halves = 4 quarters = 8 eighths). A dot adds 50% more duration.",
        "theory_quiz": {
            "question": "How many eighth notes are equal in duration to a dotted quarter note?",
            "options": ["3 eighth notes", "2 eighth notes", "4 eighth notes", "1.5 eighth notes"],
            "answer": 0,
            "explanation": "A quarter note = 2 eighths. The dot adds half its value (1 eighth), totaling 3 eighth notes."
        },
        "coding_challenge": {
            "prompt": "Engrave a dotted rhythm: dotted quarter note, eighth note, followed by a half rest: c'4. d'8 r2.",
            "initial_code": '\\version "2.24.0"\n{\n  \\clef treble\n  \\time 4/4\n  % dotted quarter c, eighth d, half rest:\n  \n}',
            "solution_code": '\\version "2.24.0"\n{\n  \\clef treble\n  \\time 4/4\n  c\'4. d\'8 r2 |\n}',
            "expected_pitches": ["c4", "d4"],
            "hint": "Type: c'4. d'8 r2 |"
        }
    },
    {
        "id": "lesson.fundamentals.09_simple_meter",
        "chapter_order": 9,
        "title": "9. Simple Meter and Time Signatures",
        "concept_id": "concept.simple_meter",
        "syntax_id": "syntax.time_command",
        "repertoire_id": "petzold_minuet_g_anh114",
        "theory_summary": "In simple meters (2/4, 3/4, 4/4), the top number indicates beats per measure, and the bottom number indicates the note value of each beat.",
        "theory_quiz": {
            "question": "In 3/4 time, how many quarter-note beats are in each measure?",
            "options": ["3 beats", "4 beats", "6 beats", "2 beats"],
            "answer": 0,
            "explanation": "The top number 3 designates 3 beats per measure; the bottom number 4 designates the quarter note as the beat unit."
        },
        "coding_challenge": {
            "prompt": "Set \\time 3/4 and engrave two measures of a waltz: measure 1 = c4 d e, measure 2 = f2.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  % Add \\time 3/4 and two measures:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 3/4\n  c4 d e |\n  f2. |\n}',
            "expected_pitches": ["c4", "d4", "e4", "f4"],
            "hint": "Write \\time 3/4, then c4 d e | f2. |"
        }
    },
    {
        "id": "lesson.fundamentals.12_major_scales",
        "chapter_order": 12,
        "title": "12. Major Scales and Key Signatures",
        "concept_id": "concept.major_scales",
        "syntax_id": "syntax.key_command",
        "repertoire_id": "petzold_minuet_g_anh114",
        "theory_summary": "The Major Scale follows the step pattern: Whole, Whole, Half, Whole, Whole, Whole, Half (W-W-H-W-W-W-H).",
        "theory_quiz": {
            "question": "Which accidental is found in the key signature of G major?",
            "options": ["F-sharp (F♯)", "B-flat (B♭)", "C-sharp (C♯)", "No accidentals"],
            "answer": 0,
            "explanation": "G major has one sharp: F-sharp (fis in LilyPond)."
        },
        "coding_challenge": {
            "prompt": "Set \\key g \\major and engrave the G major scale: g4 a b c | d e fis g |.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 4/4\n  % Add \\key g \\major and notes:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\key g \\major\n  \\time 4/4\n  g4 a b c |\n  d4 e fis g |\n}',
            "expected_pitches": ["g3", "a3", "b3", "c4", "d4", "e4", "fs4", "g4"],
            "hint": "Use \\key g \\major and remember F-sharp is written as fis."
        }
    },
    {
        "id": "lesson.fundamentals.16_intervals",
        "chapter_order": 16,
        "title": "16. Intervals (Harmonic & Melodic)",
        "concept_id": "concept.intervals",
        "syntax_id": "syntax.chords_angle_brackets",
        "repertoire_id": "mozart_twinkle_variations",
        "theory_summary": "An interval is the distance between two notes. Melodic intervals sound in sequence; harmonic intervals sound simultaneously.",
        "theory_quiz": {
            "question": "What is the interval between C4 and G4?",
            "options": ["Perfect Fifth (P5)", "Major Third (M3)", "Perfect Fourth (P4)", "Minor Sixth (m6)"],
            "answer": 0,
            "explanation": "C to G spans five letter names (C-D-E-F-G) and contains 7 half steps, forming a Perfect Fifth."
        },
        "coding_challenge": {
            "prompt": "Engrave three harmonic intervals in \\relative c': a Major Third <c e>2, followed by a Perfect Fifth <c g>2.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 4/4\n  % Angle bracket intervals:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 4/4\n  <c e>2 <c g>2 |\n}',
            "expected_pitches": ["c4", "e4", "c4", "g4"],
            "hint": "Write <c e>2 <c g>2 |"
        }
    },
    {
        "id": "lesson.fundamentals.17_triads",
        "chapter_order": 17,
        "title": "17. Triads (Major and Minor)",
        "chapter_id": "fundamentals.triads",
        "concept_id": "concept.triads",
        "syntax_id": "syntax.chords_angle_brackets",
        "repertoire_id": "bach_chorale_bwv244",
        "theory_summary": "A triad consists of a Root, Third, and Fifth. Major triad = M3 + m3 (e.g. C-E-G). Minor triad = m3 + M3 (e.g. C-E♭-G).",
        "theory_quiz": {
            "question": "What pitches make up a C minor triad in root position?",
            "options": ["C – E♭ – G", "C – E – G", "C – E♭ – G♭", "C – E – G♯"],
            "answer": 0,
            "explanation": "A minor triad has a minor third (C to E♭ = 3 half steps) and a perfect fifth (C to G = 7 half steps)."
        },
        "coding_challenge": {
            "prompt": "Engrave a C major triad <c e g>2 followed by a C minor triad <c ees g>2.",
            "initial_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 4/4\n  % C major then C minor triad:\n  \n}',
            "solution_code": '\\version "2.24.0"\n\\relative c\' {\n  \\clef treble\n  \\time 4/4\n  <c e g>2 <c ees g>2 |\n}',
            "expected_pitches": ["c4", "e4", "g4", "c4", "ds4", "g4"],
            "hint": "Write <c e g>2 <c ees g>2 |"
        }
    },
    {
        "id": "lesson.fundamentals.19_inversions_figured_bass",
        "chapter_order": 19,
        "title": "19. Inversions and Figured Bass",
        "concept_id": "concept.inversions_figured_bass",
        "syntax_id": "syntax.figured_bass",
        "repertoire_id": "pachelbel_canon_d_bass",
        "theory_summary": "When the third is in the bass, the chord is in First Inversion (6). When the fifth is in the bass, it is in Second Inversion (6/4).",
        "theory_quiz": {
            "question": "In figured bass, what does the figure '6' indicate below a bass note?",
            "options": ["First inversion triad (third is in the bass)", "Second inversion triad (fifth is in the bass)", "Root position sixth chord", "Six beats rest"],
            "answer": 0,
            "explanation": "The figure 6 is shorthand for 6/3, indicating a triad in first inversion."
        },
        "coding_challenge": {
            "prompt": "Engrave a bass staff with a first inversion figure: bass note e2 with figure <6>.",
            "initial_code": '\\version "2.24.0"\n<<\n  \\new Staff {\n    \\clef bass\n    e2\n  }\n  \\figures {\n    % Add figure 6:\n    \n  }\n>>',
            "solution_code": '\\version "2.24.0"\n<<\n  \\new Staff {\n    \\clef bass\n    e2\n  }\n  \\figures {\n    < 6 >2\n  }\n>>',
            "expected_pitches": ["e3"],
            "hint": "In \\figures write < 6 >2"
        }
    },
    {
        "id": "lesson.fundamentals.20_roman_numerals",
        "chapter_order": 20,
        "title": "20. Roman Numerals and SATB Voice Leading",
        "concept_id": "concept.roman_numerals_satb",
        "syntax_id": "syntax.polyphony_voices",
        "repertoire_id": "bach_chorale_bwv244",
        "theory_summary": "Roman numerals analyze harmonic function (I = Tonic, IV = Subdominant, V = Dominant). SATB distributes harmony across Soprano, Alto, Tenor, and Bass.",
        "theory_quiz": {
            "question": "In the key of C major, which chord is the Dominant (V)?",
            "options": ["G major (G - B - D)", "F major (F - A - C)", "A minor (A - C - E)", "D minor (D - F - A)"],
            "answer": 0,
            "explanation": "Scale degree 5 in C major is G, making G major the Dominant (V) chord."
        },
        "coding_challenge": {
            "prompt": "Engrave a two-voice cadence on one staff using << \\\\ >>: Soprano sings d4 c2, Alto sings b4 c2 in treble.",
            "initial_code": '\\version "2.24.0"\n\\new Staff {\n  \\clef treble\n  \\relative c\'\' {\n    <<\n      { d4 c2 }  % Voice 1 (Soprano)\n      \\\\\n      % Voice 2 (Alto) b4 c2:\n      \n    >>\n  }\n}',
            "solution_code": '\\version "2.24.0"\n\\new Staff {\n  \\clef treble\n  \\relative c\'\' {\n    <<\n      { d4 c2 }\n      \\\\\n      { b4 c2 }\n    >>\n  }\n}',
            "expected_pitches": ["d5", "c5", "b4", "c5"],
            "hint": "In the second voice, write: { b4 c2 }"
        }
    }
]

def build_knowledge_graph():
    """Generates the graph JSON and SQLite relational database."""
    OUTPUT_KG_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Building Knowledge Graph in {OUTPUT_KG_DIR}...")

    # Load repertoire
    repertoire_pieces = []
    if REPERTOIRE_JSON_PATH.exists():
        with open(REPERTOIRE_JSON_PATH, 'r', encoding='utf-8') as f:
            repertoire_pieces = json.load(f)

    # 1. Assemble Graph Nodes & Edges
    nodes = []
    edges = []

    # Add Concept Nodes
    for c in THEORY_CONCEPTS:
        nodes.append({
            "id": c["id"],
            "type": "theory_concept",
            "title": c["title"],
            "category": c["category"],
            "description": c["description"],
            "chapter_id": c["chapter_id"]
        })

    # Add Syntax Nodes
    for s in LILYPOND_SYNTAX:
        nodes.append({
            "id": s["id"],
            "type": "lilypond_syntax",
            "title": s["title"],
            "pattern": s["pattern"],
            "doc_id": s["doc_id"],
            "description": s["description"]
        })

    # Add Repertoire Nodes
    for r in repertoire_pieces:
        nodes.append({
            "id": f"repertoire.{r['id']}",
            "type": "repertoire",
            "title": f"{r['title']} ({r['composer']})",
            "opus": r["opus"],
            "difficulty": r["difficulty"],
            "key": r["key"],
            "meter": r["meter"]
        })

    # Add Lesson Nodes
    for les in FUNDAMENTALS_LESSONS:
        nodes.append({
            "id": les["id"],
            "type": "lesson",
            "title": les["title"],
            "chapter_order": les["chapter_order"],
            "concept_id": les["concept_id"],
            "syntax_id": les["syntax_id"]
        })

    # Add Edges: Prerequisite
    for source, target in PREREQUISITES:
        edges.append({
            "source": source,
            "target": target,
            "relation": "PREREQUISITE_OF"
        })

    # Add Edges: Theory Concept -> LilyPond Syntax
    for concept_id, syntax_id in CONCEPT_TO_SYNTAX:
        edges.append({
            "source": concept_id,
            "target": syntax_id,
            "relation": "EXPRESSED_BY"
        })

    # Add Edges: Lesson associations
    for les in FUNDAMENTALS_LESSONS:
        edges.append({
            "source": les["concept_id"],
            "target": les["id"],
            "relation": "INTRODUCED_IN"
        })
        edges.append({
            "source": les["syntax_id"],
            "target": les["id"],
            "relation": "PRACTICED_IN"
        })
        if les.get("repertoire_id"):
            edges.append({
                "source": les["id"],
                "target": f"repertoire.{les['repertoire_id']}",
                "relation": "CAPSTONE_PIECE"
            })

    # 2. Export graph.json
    graph_bundle = {
        "version": "1.0.0",
        "nodes": nodes,
        "edges": edges,
        "curriculum": {
            "part": "fundamentals",
            "title": "Part I: Fundamentals of Music Theory & LilyPond Notation",
            "total_lessons": len(FUNDAMENTALS_LESSONS),
            "lessons": FUNDAMENTALS_LESSONS
        }
    }

    with open(GRAPH_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(graph_bundle, f, indent=2, ensure_ascii=False)
    print(f"Generated {GRAPH_JSON_PATH} ({len(nodes)} nodes, {len(edges)} edges)")

    # 3. Export knowledge.sqlite
    if SQLITE_DB_PATH.exists():
        SQLITE_DB_PATH.unlink()

    conn = sqlite3.connect(SQLITE_DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE nodes (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT,
            data_json TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE edges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            target TEXT NOT NULL,
            relation TEXT NOT NULL
        );
    """)

    cur.execute("CREATE INDEX idx_edges_source ON edges(source);")
    cur.execute("CREATE INDEX idx_edges_target ON edges(target);")
    cur.execute("CREATE INDEX idx_edges_relation ON edges(relation);")

    for n in nodes:
        cur.execute(
            "INSERT INTO nodes (id, type, title, category, data_json) VALUES (?, ?, ?, ?, ?)",
            (n["id"], n["type"], n["title"], n.get("category", ""), json.dumps(n, ensure_ascii=False))
        )

    for e in edges:
        cur.execute(
            "INSERT INTO edges (source, target, relation) VALUES (?, ?, ?)",
            (e["source"], e["target"], e["relation"])
        )

    conn.commit()
    conn.close()
    print(f"Generated {SQLITE_DB_PATH} with SQLite indices.")

if __name__ == "__main__":
    build_knowledge_graph()
