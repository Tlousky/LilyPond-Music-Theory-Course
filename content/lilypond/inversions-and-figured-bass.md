---
id: "lilypond.inversions-and-figured-bass"
title: "Inversions and Figured Bass (Basso Continuo)"
category: "figured_bass"
summary: "Engraving historical figured bass numerals and chord inversions below a bass staff."
theory_concepts:
  - "inversion"
  - "figured_bass"
  - "basso_continuo"
  - "thoroughbass"
  - "cadential_6_4"
constructs:
  - "figured_bass_context"
  - "figures_command"
  - "figure_modifiers"
---
# Inversions and Figured Bass

In Baroque and Classical music theory, figured bass (basso continuo) notates chord inversions and embellishments using numbers below the bass line.

## The `\figuredBass` Context and `\figures`

```lilypond
\version "2.24.0"
<<
  \new Staff {
    \clef bass
    \relative c {
      c2 e | f g | c1 |
    }
  }
  \figures {
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

- Sharp figure: `< 6+ >` or `< 6\+ >`
- Naturalizing a figure: `< _! >`
