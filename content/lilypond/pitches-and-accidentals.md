---
id: "lilypond.pitches-and-accidentals"
title: "Pitches, Accidentals, and Octaves"
category: "pitch"
summary: "How to write pitches, accidentals (sharps, flats), and octaves in LilyPond using Dutch note naming conventions and \relative pitch mode."
theory_concepts:
  - "pitch"
  - "accidental"
  - "half_step"
  - "whole_step"
  - "octave"
  - "aspn"
constructs:
  - "note_names"
  - "is_accidental"
  - "es_accidental"
  - "relative_mode"
  - "absolute_mode"
---
# Pitches, Accidentals, and Octaves in LilyPond

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

## Octaves and Relative Pitch Mode (`\relative`)

The most intuitive and concise way to write melodies is using `\relative` mode. In `\relative c'`, each subsequent pitch is placed within a fourth of the preceding pitch (the closest octave):

- To force a note an octave higher than the closest interval, add an apostrophe: `'` (e.g. `c''`)
- To force a note an octave lower than the closest interval, add a comma: `,` (e.g. `c,`)

```lilypond
\version "2.24.0"
\relative c' {
  c4 d e f
  g a b c'
  b a g f
  e d c2
}
```

## Absolute Pitch Mode

Without `\relative`, note octaves are specified from Central C (middle C is `c'`):
- `c` = C3 (one octave below middle C)
- `c'` = C4 (Middle C)
- `c''` = C5 (treble high C)
- `c,` = C2 (low cello/bass C)
