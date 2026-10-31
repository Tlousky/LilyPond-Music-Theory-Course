\version "2.24.0"

\header {
  title = "O Haupt voll Blut und Wunden"
  composer = "J.S. Bach (1685–1750)"
  opus = "BWV 244"
}

\new PianoStaff <<
  \new Staff <<
    \clef treble
    \key d \minor
    \time 4/4
    \relative c'' {
      <<
        { \partial 4 f4 | e d cis d8 e | f4 e d\fermata }
        \\
        { \partial 4 d4 | cis d a a | d cis a\fermata }
      >>
    }
  >>
  \new Staff <<
    \clef bass
    \key d \minor
    \time 4/4
    \relative c' {
      <<
        { \partial 4 a4 | a f e f8 g | a4 a f\fermata }
        \\
        { \partial 4 d4 | a' b a d, | d a d,\fermata }
      >>
    }
  >>
>>
