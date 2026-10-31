#!/usr/bin/env python3
"""
fetch_lilypond_docs.py - Generates structured LilyPond reference documentation
Organized by topic, with syntax rules, code snippets, and metadata linking to music theory concepts.
"""

from __future__ import annotations
import sys
import json
from pathlib import Path

# Ensure stdout handles unicode
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_LILY_DIR = ROOT_DIR / "content" / "lilypond"

LILY_TOPICS = [
    {
        "id": "lilypond.pitches-and-accidentals",
        "title": "Pitches, Accidentals, and Octaves",
        "category": "pitch",
        "theory_concepts": ["pitch", "accidental", "half_step", "whole_step", "octave", "aspn"],
        "constructs": ["note_names", "is_accidental", "es_accidental", "relative_mode", "absolute_mode"],
        "summary": "How to write pitches, accidentals (sharps, flats), and octaves in LilyPond using Dutch note naming conventions and \\relative pitch mode.",
        "content": """# Pitches, Accidentals, and Octaves in LilyPond

In LilyPond, note names are written in lowercase using standard European/Dutch naming conventions:

- `c`, `d`, `e`, `f`, `g`, `a`, `b`

## Accidentals

Sharps and flats are notated by appending suffixes to the note name:
- **Sharp (♯)**: append `is` (e.g. `cis` = C♯, `fis` = F♯, `gis` = G♯)
- **Flat (♭)**: append `es` (e.g. `des` = D♭, `ees` or `es` = E♭, `bes` or `b` = B♭, `aes` or `as` = A♭)
- **Double Sharp (𝄪)**: append `isis` (e.g. `cisis` = C𝄪)
- **Double Flat (𝄫)**: append `eses` (e.g. `deses` = D𝄫)

> [!NOTE]
> Even if a key signature has sharps or flats, you must explicitly write `is` or `es` in your LilyPond code. LilyPond automatically prints or suppresses accidental signs on the staff based on the active key signature and measure rules!

## Octaves and Relative Pitch Mode (`\\relative`)

The most intuitive and concise way to write melodies is using `\\relative` mode. In `\\relative c'`, each subsequent pitch is placed within a fourth of the preceding pitch (the closest octave):

- To force a note an octave higher than the closest interval, add an apostrophe: `'` (e.g. `c''`)
- To force a note an octave lower than the closest interval, add a comma: `,` (e.g. `c,`)

```lilypond
\\version "2.24.0"
\\relative c' {
  c4 d e f
  g a b c'
  b a g f
  e d c2
}
```

## Absolute Pitch Mode

Without `\\relative`, note octaves are specified from Central C (middle C is `c'`):
- `c` = C3 (one octave below middle C)
- `c'` = C4 (Middle C)
- `c''` = C5 (treble high C)
- `c,` = C2 (low cello/bass C)
"""
    },
    {
        "id": "lilypond.clefs-and-staff",
        "title": "Clefs, Staffs, and the Grand Staff",
        "category": "staff",
        "theory_concepts": ["clef", "treble_clef", "bass_clef", "alto_clef", "tenor_clef", "grand_staff", "ledger_lines"],
        "constructs": ["clef_command", "staff_context", "piano_staff_context"],
        "summary": "How to set treble, bass, alto, and tenor clefs, and how to construct a Grand Staff for piano.",
        "content": """# Clefs, Staffs, and the Grand Staff

## Setting Clefs

Set the active clef using the `\\clef` command followed by the clef name:

- Treble Clef (G clef): `\\clef treble`
- Bass Clef (F clef): `\\clef bass`
- Alto Clef (C clef on line 3, for Viola): `\\clef alto`
- Tenor Clef (C clef on line 4, for Cello/Trombone): `\\clef tenor`
- Octave Treble Clef (Tenor voice): `\\clef "treble_8"`

```lilypond
\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 e g c
  \\clef bass
  c,, e g c
}
```

## The Grand Staff (`PianoStaff`)

For keyboard music (piano, organ, harpsichord), combine two staffs into a `PianoStaff`:

```lilypond
\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\relative c' { c4 e g c }
  }
  \\new Staff {
    \\clef bass
    \\relative c { c4 e g c }
  }
>>
```
"""
    },
    {
        "id": "lilypond.durations-and-rhythms",
        "title": "Durations, Rests, Ties, and Beams",
        "category": "rhythm",
        "theory_concepts": ["rhythm", "duration", "quarter_note", "half_note", "whole_note", "eighth_note", "rest", "tie", "beam"],
        "constructs": ["duration_numbers", "dot_modifier", "rest_r", "tie_tilde", "beam_brackets"],
        "summary": "How to specify rhythmic note durations, dotted notes, rests, ties, and manual beams.",
        "content": """# Durations, Rests, Ties, and Beams

## Note Durations

Durations are indicated by appending a reciprocal number to the pitch:
- Whole note: `1`
- Half note: `2`
- Quarter note: `4`
- Eighth note: `8`
- 16th note: `16`
- 32nd note: `32`

If a note duration is omitted, it inherits the duration of the preceding note:
```lilypond
c4 d e f  % four quarter notes
```

## Dotted Notes

Add a period `.` to lengthen the note duration by half (or two periods `..` for double dots):
```lilypond
c4. d8 e2  % dotted quarter, eighth, half note
```

## Rests

Write `r` followed by the duration:
- Whole rest: `r1`
- Half rest: `r2`
- Quarter rest: `r4`
- Eighth rest: `r8`

## Ties

Connect two identical pitches across beats or bar lines using a tilde `~`:
```lilypond
c1 ~ c4 d e f
```

## Beams

LilyPond automatically beams eighth and 16th notes according to the time signature. You can manually specify beaming using square brackets `[` and `]`:
```lilypond
c8[ d e f] g[ a b c]
```
"""
    },
    {
        "id": "lilypond.time-signatures-and-meters",
        "title": "Time Signatures, Meters, and Bar Checks",
        "category": "meter",
        "theory_concepts": ["meter", "simple_meter", "compound_meter", "time_signature", "bar_line", "pickup_measure"],
        "constructs": ["time_command", "bar_check_pipe", "partial_command"],
        "summary": "Setting time signatures, simple and compound meters, pickup measures (anacrusis), and bar line checks.",
        "content": """# Time Signatures, Meters, and Bar Checks

## Setting Time Signatures

Use the `\\time` command followed by `beats/unit`:
- Common Time (4/4): `\\time 4/4`
- Cut Time (2/2): `\\time 2/2`
- Waltz Time (3/4): `\\time 3/4`
- Compound Duple (6/8): `\\time 6/8`
- Compound Triple (9/8): `\\time 9/8`
- Compound Quadruple (12/8): `\\time 12/8`

```lilypond
\\version "2.24.0"
\\relative c' {
  \\time 3/4
  c4 e g | c2. |
}
```

## Bar Line Checks (`|`)

Always use the pipe character `|` at every bar line. LilyPond checks that the accumulated note durations match the measure length. If a bar check fails, LilyPond emits a helpful warning showing the exact bar where time was miscounted!

## Pickup Measures / Anacrusis (`\\partial`)

For music that begins on an upbeat:
```lilypond
\\relative c' {
  \\time 4/4
  \\partial 4 g4 |
  c4 d e f |
  g1 |
}
```
"""
    },
    {
        "id": "lilypond.key-signatures-and-scales",
        "title": "Key Signatures and Scales",
        "category": "scales",
        "theory_concepts": ["scale", "major_scale", "minor_scale", "key_signature", "circle_of_fifths"],
        "constructs": ["key_command", "major_keyword", "minor_keyword"],
        "summary": "How to define major and minor key signatures and write complete diatonic scales in LilyPond.",
        "content": """# Key Signatures and Scales

## The `\\key` Command

Specify key signatures using `\\key pitch \\mode`:
- G major (1 sharp): `\\key g \\major`
- D major (2 sharps): `\\key d \\major`
- F major (1 flat): `\\key f \\major`
- B-flat major (2 flats): `\\key bes \\major`
- A minor (0 accidentals): `\\key a \\minor`
- E minor (1 sharp): `\\key e \\minor`
- D minor (1 flat): `\\key d \\minor`

```lilypond
\\version "2.24.0"
\\relative c' {
  \\key g \\major
  \\time 4/4
  g4 a b c | d e fis g |
}
```

## Naturalizing Notes

LilyPond remembers accidentals through the measure. To cancel an accidental within the measure back to natural, just write the plain note name (e.g. `f` cancels `fis`).
"""
    },
    {
        "id": "lilypond.chords-and-intervals",
        "title": "Chords and Harmonic Intervals",
        "category": "harmony",
        "theory_concepts": ["interval", "triad", "seventh_chord", "root", "third", "fifth", "seventh"],
        "constructs": ["chord_angle_brackets", "chord_duration"],
        "summary": "Writing harmonic intervals, triads, and seventh chords using angle brackets <c e g>.",
        "content": """# Chords and Harmonic Intervals

## Writing Chords with Angle Brackets `< >`

Enclose simultaneous pitches inside angle brackets `<` and `>`. The duration is placed outside after the closing bracket:

```lilypond
\\version "2.24.0"
\\relative c' {
  <c e g>1        % C major triad, whole note
  <c f a>2 <c e g>2 % F/C to C
  <c e g bes>1    % C dominant 7th chord
}
```

## Harmonic Intervals

Harmonic intervals (two simultaneous notes) use the same syntax:
```lilypond
<c e>4  % Major third
<c g>4  % Perfect fifth
<c a>4  % Major sixth
```
"""
    },
    {
        "id": "lilypond.inversions-and-figured-bass",
        "title": "Inversions and Figured Bass (Basso Continuo)",
        "category": "figured_bass",
        "theory_concepts": ["inversion", "figured_bass", "basso_continuo", "thoroughbass", "cadential_6_4"],
        "constructs": ["figured_bass_context", "figures_command", "figure_modifiers"],
        "summary": "Engraving historical figured bass numerals and chord inversions below a bass staff.",
        "content": """# Inversions and Figured Bass

In Baroque and Classical music theory, figured bass (basso continuo) notates chord inversions and embellishments using numbers below the bass line.

## The `\\figuredBass` Context and `\\figures`

```lilypond
\\version "2.24.0"
<<
  \\new Staff {
    \\clef bass
    \\relative c {
      c2 e | f g | c1 |
    }
  }
  \\figures {
    < _ >2 < 6 > | < _ > < 6 4 > | < _ >1 |
  }
>>
```

## Standard Inversion Figures

- Root position triad: `< _ >` (or `< 5 3 >`)
- First inversion triad (6th chord): `< 6 >` (abbreviation for `< 6 3 >`)
- Second inversion triad (6/4 chord): `< 6 4 >`
- Root position seventh chord: `< 7 >`
- First inversion seventh chord: `< 6 5 >`
- Second inversion seventh chord: `< 4 3 >`
- Third inversion seventh chord: `< 4 2 >` (or `< 2 >`)

## Accidentals in Figured Bass

- Sharp figure: `< 6+ >` or `< 6\\+ >`
- Naturalizing a figure: `< _! >`
"""
    },
    {
        "id": "lilypond.polyphony-and-satb",
        "title": "Polyphony and Four-Voice SATB Layout",
        "category": "polyphony",
        "theory_concepts": ["voice_leading", "satb", "soprano", "alto", "tenor", "bass", "counterpoint"],
        "constructs": ["voice_separator", "new_voice", "voice_one", "voice_two"],
        "summary": "Engraving multiple independent voices on one staff and standard four-voice choral SATB scores.",
        "content": """# Polyphony and Four-Voice SATB Layout

In four-voice choral composition (SATB), Soprano and Alto share the upper staff (treble), while Tenor and Bass share the lower staff (bass). Stems of the higher voice point UP, while stems of the lower voice point DOWN.

## Two Voices on One Staff (`<< ... \\\\ ... >>`)

The double-backslash `\\\\` separates voices, automatically setting stem directions:

```lilypond
\\version "2.24.0"
\\new Staff <<
  \\clef treble
  \\relative c'' {
    \\time 4/4
    <<
      { c4 d e f | g1 }        % Voice 1 (Soprano): stems UP
      \\\\
      { c,4 b c d | e1 }        % Voice 2 (Alto): stems DOWN
    >>
  }
>>
```

## Full 4-Voice SATB Score

```lilypond
\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff <<
    \\clef treble
    \\relative c'' {
      << { c4 d e2 } \\\\ { g,4 b c2 } >>
    }
  >>
  \\new Staff <<
    \\clef bass
    \\relative c' {
      << { e4 f g2 } \\\\ { c,4 d c2 } >>
    }
  >>
>>
```
"""
    },
    {
        "id": "lilypond.score-structure-and-midi",
        "title": "Score Structure, Headers, and MIDI Output",
        "category": "score",
        "theory_concepts": ["composition", "performance", "midi"],
        "constructs": ["score_block", "header_block", "layout_block", "midi_block"],
        "summary": "Structuring full LilyPond documents with title, composer headers, engraving layout, and MIDI playback generation.",
        "content": """# Score Structure, Headers, and MIDI Output

A complete LilyPond document organizes musical data into `\\header` and `\\score` blocks:

```lilypond
\\version "2.24.0"

\\header {
  title = "Minuet in G major"
  composer = "Christian Petzold / J.S. Bach"
  opus = "BWV Anh. 114"
}

\\score {
  \\new Staff {
    \\clef treble
    \\key g \\major
    \\time 3/4
    \\relative c'' {
      \\repeat volta 2 {
        d4 g,8 a b c | d4 g, g |
        e'4 c8 d e fis | g4 g, g |
      }
    }
  }
  \\layout { }   % Engraves the visual sheet music (SVG / PDF)
  \\midi { }     % Generates the playable MIDI audio file
}
```
"""
    }
]

def generate_lilypond_docs():
    """Outputs all structured LilyPond guides into content/lilypond/."""
    OUTPUT_LILY_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Generating LilyPond reference guides in {OUTPUT_LILY_DIR}")

    for topic in LILY_TOPICS:
        yaml_lines = [
            "---",
            f'id: "{topic["id"]}"',
            f'title: "{topic["title"]}"',
            f'category: "{topic["category"]}"',
            f'summary: "{topic["summary"]}"',
            "theory_concepts:",
        ]
        for c in topic["theory_concepts"]:
            yaml_lines.append(f'  - "{c}"')
        yaml_lines.append("constructs:")
        for c in topic["constructs"]:
            yaml_lines.append(f'  - "{c}"')
        yaml_lines.append("---\n")

        full_doc = "\n".join(yaml_lines) + topic["content"].strip() + "\n"
        filename = f"{topic['id'].replace('lilypond.', '')}.md"
        file_path = OUTPUT_LILY_DIR / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(full_doc)
        print(f"  Created {filename}")

    print(f"Successfully created {len(LILY_TOPICS)} LilyPond reference documents.")

if __name__ == "__main__":
    generate_lilypond_docs()
