\version "2.24.0"

\header {
  title = "Canon in D (Ground Bass)"
  composer = "Johann Pachelbel (1653–1706)"
}

<<
  \new Staff {
    \clef bass
    \key d \major
    \time 4/4
    \relative c {
      d4 a b fis |
      g4 d g a |
    }
  }
  \figures {
    < _ >4 < _ > < _ > < _ > |
    < _ >4 < _ > < _ > < _ > |
  }
>>
