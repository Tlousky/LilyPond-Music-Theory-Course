---
id: "lilypond.score-structure-and-midi"
title: "Score Structure, Headers, and MIDI Output"
category: "score"
summary: "Structuring full LilyPond documents with title, composer headers, engraving layout, and MIDI playback generation."
theory_concepts:
  - "composition"
  - "performance"
  - "midi"
constructs:
  - "score_block"
  - "header_block"
  - "layout_block"
  - "midi_block"
---
# Score Structure, Headers, and MIDI Output

A complete LilyPond document organizes musical data into `\header` and `\score` blocks:

```lilypond
\version "2.24.0"

\header {
  title = "Minuet in G major"
  composer = "Christian Petzold / J.S. Bach"
  opus = "BWV Anh. 114"
}

\score {
  \new Staff {
    \clef treble
    \key g \major
    \time 3/4
    \relative c'' {
      \repeat volta 2 {
        d4 g,8 a b c | d4 g, g |
        e'4 c8 d e fis | g4 g, g |
      }
    }
  }
  \layout { }   % Engraves the visual sheet music (SVG / PDF)
  \midi { }     % Generates the playable MIDI audio file
}
```
