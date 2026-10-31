---
id: "lilypond.time-signatures-and-meters"
title: "Time Signatures, Meters, and Bar Checks"
category: "meter"
summary: "Setting time signatures, simple and compound meters, pickup measures (anacrusis), and bar line checks."
theory_concepts:
  - "meter"
  - "simple_meter"
  - "compound_meter"
  - "time_signature"
  - "bar_line"
  - "pickup_measure"
constructs:
  - "time_command"
  - "bar_check_pipe"
  - "partial_command"
---
# Time Signatures, Meters, and Bar Checks

## Setting Time Signatures

Use the `\time` command followed by `beats/unit`:
- Common Time (4/4): `\time 4/4`
- Cut Time (2/2): `\time 2/2`
- Waltz Time (3/4): `\time 3/4`
- Compound Duple (6/8): `\time 6/8`
- Compound Triple (9/8): `\time 9/8`
- Compound Quadruple (12/8): `\time 12/8`

```lilypond
\version "2.24.0"
\relative c' {
  \time 3/4
  c4 e g | c2. |
}
```

## Bar Line Checks (`|`)

Always use the pipe character `|` at every bar line. LilyPond checks that the accumulated note durations match the measure length. If a bar check fails, LilyPond emits a helpful warning showing the exact bar where time was miscounted!

## Pickup Measures / Anacrusis (`\partial`)

For music that begins on an upbeat:
```lilypond
\relative c' {
  \time 4/4
  \partial 4 g4 |
  c4 d e f |
  g1 |
}
```
