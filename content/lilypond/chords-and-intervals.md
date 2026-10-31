---
id: "lilypond.chords-and-intervals"
title: "Chords and Harmonic Intervals"
category: "harmony"
summary: "Writing harmonic intervals, triads, and seventh chords using angle brackets <c e g>."
theory_concepts:
  - "interval"
  - "triad"
  - "seventh_chord"
  - "root"
  - "third"
  - "fifth"
  - "seventh"
constructs:
  - "chord_angle_brackets"
  - "chord_duration"
---
# Chords and Harmonic Intervals

## Writing Chords with Angle Brackets `< >`

Enclose simultaneous pitches inside angle brackets `<` and `>`. The duration is placed outside after the closing bracket:

```lilypond
\version "2.24.0"
\relative c' {
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
