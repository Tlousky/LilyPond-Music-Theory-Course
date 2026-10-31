\version "2.24.0"

\header {
  title = "Minuet in G major"
  composer = "Christian Petzold (1677–1733)"
  opus = "BWV Anh. 114"
}

\new PianoStaff <<
  \new Staff {
    \clef treble
    \key g \major
    \time 3/4
    \relative c'' {
      \repeat volta 2 {
        d4 g,8 a b c |
        d4 g, g |
        e'4 c8 d e fis |
        g4 g, g |
        c4 d8 c b a |
        b4 c8 b a g |
        fis4 g8 a b g |
        a2. |
      }
    }
  }
  \new Staff {
    \clef bass
    \key g \major
    \time 3/4
    \relative c' {
      \repeat volta 2 {
        <g b d>2. |
        b2. |
        c2. |
        b2. |
        a2. |
        g2. |
        d'4 b g |
        d'2. |
      }
    }
  }
>>
