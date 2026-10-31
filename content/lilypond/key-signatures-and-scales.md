---
id: "lilypond.key-signatures-and-scales"
title: "Key Signatures and Scales"
category: "scales"
summary: "How to define major and minor key signatures and write complete diatonic scales in LilyPond."
theory_concepts:
  - "scale"
  - "major_scale"
  - "minor_scale"
  - "key_signature"
  - "circle_of_fifths"
constructs:
  - "key_command"
  - "major_keyword"
  - "minor_keyword"
---
# Key Signatures and Scales

## The `\key` Command

Specify key signatures using `\key pitch \mode`:
- G major (1 sharp): `\key g \major`
- D major (2 sharps): `\key d \major`
- F major (1 flat): `\key f \major`
- B-flat major (2 flats): `\key bes \major`
- A minor (0 accidentals): `\key a \minor`
- E minor (1 sharp): `\key e \minor`
- D minor (1 flat): `\key d \minor`

```lilypond
\version "2.24.0"
\relative c' {
  \key g \major
  \time 4/4
  g4 a b c | d e fis g |
}
```

## Naturalizing Notes

LilyPond remembers accidentals through the measure. To cancel an accidental within the measure back to natural, just write the plain note name (e.g. `f` cancels `fis`).
