---
id: "lilypond.polyphony-and-satb"
title: "Polyphony and Four-Voice SATB Layout"
category: "polyphony"
summary: "Engraving multiple independent voices on one staff and standard four-voice choral SATB scores."
theory_concepts:
  - "voice_leading"
  - "satb"
  - "soprano"
  - "alto"
  - "tenor"
  - "bass"
  - "counterpoint"
constructs:
  - "voice_separator"
  - "new_voice"
  - "voice_one"
  - "voice_two"
---
# Polyphony and Four-Voice SATB Layout

In four-voice choral composition (SATB), Soprano and Alto share the upper staff (treble), while Tenor and Bass share the lower staff (bass). Stems of the higher voice point UP, while stems of the lower voice point DOWN.

## Two Voices on One Staff (`<< ... \\ ... >>`)

The double-backslash `\\` separates voices, automatically setting stem directions:

```lilypond
\version "2.24.0"
\new Staff <<
  \clef treble
  \relative c'' {
    \time 4/4
    <<
      { c4 d e f | g1 }        % Voice 1 (Soprano): stems UP
      \\
      { c,4 b c d | e1 }        % Voice 2 (Alto): stems DOWN
    >>
  }
>>
```

## Full 4-Voice SATB Score

```lilypond
\version "2.24.0"
\new PianoStaff <<
  \new Staff <<
    \clef treble
    \relative c'' {
      << { c4 d e2 } \\ { g,4 b c2 } >>
    }
  >>
  \new Staff <<
    \clef bass
    \relative c' {
      << { e4 f g2 } \\ { c,4 d c2 } >>
    }
  >>
>>
```
