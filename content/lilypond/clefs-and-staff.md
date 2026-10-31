---
id: "lilypond.clefs-and-staff"
title: "Clefs, Staffs, and the Grand Staff"
category: "staff"
summary: "How to set treble, bass, alto, and tenor clefs, and how to construct a Grand Staff for piano."
theory_concepts:
  - "clef"
  - "treble_clef"
  - "bass_clef"
  - "alto_clef"
  - "tenor_clef"
  - "grand_staff"
  - "ledger_lines"
constructs:
  - "clef_command"
  - "staff_context"
  - "piano_staff_context"
---
# Clefs, Staffs, and the Grand Staff

## Setting Clefs

Set the active clef using the `\clef` command followed by the clef name:

- Treble Clef (G clef): `\clef treble`
- Bass Clef (F clef): `\clef bass`
- Alto Clef (C clef on line 3, for Viola): `\clef alto`
- Tenor Clef (C clef on line 4, for Cello/Trombone): `\clef tenor`
- Octave Treble Clef (Tenor voice): `\clef "treble_8"`

```lilypond
\version "2.24.0"
\relative c' {
  \clef treble
  c4 e g c
  \clef bass
  c,, e g c
}
```

## The Grand Staff (`PianoStaff`)

For keyboard music (piano, organ, harpsichord), combine two staffs into a `PianoStaff`:

```lilypond
\version "2.24.0"
\new PianoStaff <<
  \new Staff {
    \clef treble
    \relative c' { c4 e g c }
  }
  \new Staff {
    \clef bass
    \relative c { c4 e g c }
  }
>>
```
