\version "2.24.0"

\header {
  title = "Ah! vous dirai-je, Maman"
  composer = "W. A. Mozart (1756–1791)"
  opus = "KV 265"
}

\new PianoStaff <<
  \new Staff {
    \clef treble
    \key c \major
    \time 2/4
    \relative c' {
      c4 c | g' g | a a | g2 |
      f4 f | e e | d d | c2 |
    }
  }
  \new Staff {
    \clef bass
    \key c \major
    \time 2/4
    \relative c {
      <c e g>2 | <c e g> | <c f a> | <c e g> |
      <c f a>2 | <c e g> | <g b d f> | <c e g>2 |
    }
  }
>>
