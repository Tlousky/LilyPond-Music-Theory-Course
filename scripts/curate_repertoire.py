#!/usr/bin/env python3
"""
curate_repertoire.py - Curates pedagogical classical repertoire excerpts
From Mutopia and historical Baroque/Classical archives, with LilyPond scores and exercise metadata.
"""

from __future__ import annotations
import json
import sys
from pathlib import Path

# Ensure stdout handles unicode
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_REP_DIR = ROOT_DIR / "content" / "repertoire"

PIECES = [
    {
        "id": "petzold_minuet_g_anh114",
        "title": "Minuet in G major",
        "composer": "Christian Petzold / J.S. Bach",
        "opus": "BWV Anh. 114",
        "era": "Baroque",
        "year": 1725,
        "source": "Notebook for Anna Magdalena Bach (Mutopia / BaroqueMusic.it)",
        "meter": "3/4",
        "key": "G major",
        "clefs": ["treble", "bass"],
        "difficulty": 1,
        "theory_concepts": ["pitch", "clef", "grand_staff", "major_scale", "key_signature", "triple_meter"],
        "lilypond_syntax": ["relative_mode", "clef_command", "key_command", "time_command", "piano_staff_context"],
        "excerpt_measures": "1-8",
        "code": """\\version "2.24.0"

\\header {
  title = "Minuet in G major"
  composer = "Christian Petzold (1677–1733)"
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
>>
"""
    },
    {
        "id": "beethoven_ode_to_joy",
        "title": "Ode to Joy (Theme)",
        "composer": "Ludwig van Beethoven",
        "opus": "Symphony No. 9, Op. 125 (4th Mvt)",
        "era": "Classical / Romantic",
        "year": 1824,
        "source": "Mutopia Project",
        "meter": "4/4",
        "key": "D major",
        "clefs": ["treble"],
        "difficulty": 1,
        "theory_concepts": ["pitch", "stepwise_motion", "quarter_note", "dotted_note", "simple_meter"],
        "lilypond_syntax": ["relative_mode", "key_command", "time_command", "dot_modifier"],
        "excerpt_measures": "1-8",
        "code": """\\version "2.24.0"

\\header {
  title = "Ode to Joy"
  composer = "Ludwig van Beethoven (1770–1827)"
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
}
"""
    },
    {
        "id": "mozart_twinkle_variations",
        "title": "Ah! vous dirai-je, Maman (Theme)",
        "composer": "Wolfgang Amadeus Mozart",
        "opus": "KV 265 (300e)",
        "era": "Classical",
        "year": 1781,
        "source": "Mutopia Project",
        "meter": "2/4",
        "key": "C major",
        "clefs": ["treble", "bass"],
        "difficulty": 1,
        "theory_concepts": ["pitch", "repeated_notes", "intervals", "tonic_dominant"],
        "lilypond_syntax": ["relative_mode", "piano_staff_context", "time_command"],
        "excerpt_measures": "1-8",
        "code": """\\version "2.24.0"

\\header {
  title = "Ah! vous dirai-je, Maman"
  composer = "W. A. Mozart (1756–1791)"
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
>>
"""
    },
    {
        "id": "bach_chorale_bwv244",
        "title": "O Haupt voll Blut und Wunden",
        "composer": "Johann Sebastian Bach",
        "opus": "BWV 244 (No. 54)",
        "era": "Baroque",
        "year": 1727,
        "source": "St. Matthew Passion (BaroqueMusic.it / Mutopia)",
        "meter": "4/4",
        "key": "D minor",
        "clefs": ["treble", "bass"],
        "difficulty": 2,
        "theory_concepts": ["satb", "voice_leading", "triad", "inversion", "cadence"],
        "lilypond_syntax": ["voice_separator", "voice_one", "voice_two", "piano_staff_context"],
        "excerpt_measures": "1-4",
        "code": """\\version "2.24.0"

\\header {
  title = "O Haupt voll Blut und Wunden"
  composer = "J.S. Bach (1685–1750)"
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
>>
"""
    },
    {
        "id": "pachelbel_canon_d_bass",
        "title": "Canon in D major (Ground Bass)",
        "composer": "Johann Pachelbel",
        "opus": "PWC 37",
        "era": "Baroque",
        "year": 1694,
        "source": "BaroqueMusic.it",
        "meter": "4/4",
        "key": "D major",
        "clefs": ["bass"],
        "difficulty": 1,
        "theory_concepts": ["ground_bass", "harmonic_progression", "roman_numerals", "basso_continuo"],
        "lilypond_syntax": ["clef_command", "relative_mode", "figured_bass_context"],
        "excerpt_measures": "1-2",
        "code": """\\version "2.24.0"

\\header {
  title = "Canon in D (Ground Bass)"
  composer = "Johann Pachelbel (1653–1706)"
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
>>
"""
    }
]

def curate_repertoire():
    """Generates the repertoire metadata JSON and .ly score files."""
    OUTPUT_REP_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Curating classical repertoire into {OUTPUT_REP_DIR}")

    index = []
    for piece in PIECES:
        ly_filename = f"{piece['id']}.ly"
        ly_path = OUTPUT_REP_DIR / ly_filename
        with open(ly_path, 'w', encoding='utf-8') as f:
            f.write(piece['code'].strip() + "\n")

        metadata_entry = {
            "id": piece["id"],
            "title": piece["title"],
            "composer": piece["composer"],
            "opus": piece["opus"],
            "era": piece["era"],
            "year": piece["year"],
            "source": piece["source"],
            "meter": piece["meter"],
            "key": piece["key"],
            "clefs": piece["clefs"],
            "difficulty": piece["difficulty"],
            "theory_concepts": piece["theory_concepts"],
            "lilypond_syntax": piece["lilypond_syntax"],
            "excerpt_measures": piece["excerpt_measures"],
            "score_file": ly_filename
        }
        index.append(metadata_entry)
        print(f"  Created {ly_filename}")

    index_path = OUTPUT_REP_DIR / "repertoire.json"
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    print(f"Saved repertoire index to {index_path}")

if __name__ == "__main__":
    curate_repertoire()
