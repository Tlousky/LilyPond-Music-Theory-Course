---
id: "lilypond.durations-and-rhythms"
title: "Durations, Rests, Ties, and Beams"
category: "rhythm"
summary: "How to specify rhythmic note durations, dotted notes, rests, ties, and manual beams."
theory_concepts:
  - "rhythm"
  - "duration"
  - "quarter_note"
  - "half_note"
  - "whole_note"
  - "eighth_note"
  - "rest"
  - "tie"
  - "beam"
constructs:
  - "duration_numbers"
  - "dot_modifier"
  - "rest_r"
  - "tie_tilde"
  - "beam_brackets"
---
# Durations, Rests, Ties, and Beams

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
