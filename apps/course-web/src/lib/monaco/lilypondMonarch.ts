import type * as monaco from 'monaco-editor';

export const LILYPOND_LANGUAGE_ID = 'lilypond';

export const LILYPOND_CONFIGURATION: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '%',
    blockComment: ['%{', '%}'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    ['<<', '>>'],
    ['<', '>'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<<', close: '>>' },
    { open: '<', close: '>' },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
    { open: '"', close: '"' },
  ],
};

export const LILYPOND_MONARCH_TOKENS: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.ly',

  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.square' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
    { open: '<<', close: '>>', token: 'delimiter.angle.double' },
    { open: '<', close: '>', token: 'delimiter.angle' },
  ],

  keywords: [
    'version', 'header', 'score', 'layout', 'midi', 'paper',
    'relative', 'clef', 'time', 'key', 'major', 'minor',
    'new', 'Staff', 'PianoStaff', 'Voice', 'GrandStaff', 'ChoirStaff', 'FiguredBass', 'figures',
    'repeat', 'volta', 'alternative', 'unfold', 'partial', 'tuplet',
    'tempo', 'markup', 'bold', 'italic', 'addlyrics', 'lyricmode', 'chords', 'chordmode',
    'voiceOne', 'voiceTwo', 'voiceThree', 'voiceFour', 'oneVoice',
    'fermata', 'p', 'pp', 'ppp', 'mp', 'mf', 'f', 'ff', 'fff', 'cresc', 'decresc',
  ],

  tokenizer: {
    root: [
      // Line comments
      [/%\{/, 'comment', '@blockComment'],
      [/%.*$/, 'comment'],

      // Scheme expressions
      [/#".*?"/, 'string.scheme'],
      [/#'.*?\b/, 'variable.scheme'],
      [/#\([^)]*\)/, 'variable.scheme'],
      [/#\S+/, 'variable.scheme'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],

      // LilyPond keywords / commands (\keyword)
      [/\\([a-zA-Z_\-]+)/, {
        cases: {
          '$1@keywords': 'keyword',
          '@default': 'type.identifier',
        },
      }],

      // Notes: pitch + octave + duration
      // e.g. c'4 cis''8 ees,2 fis4.
      [/\b([a-g](?:is(?:is)?|es(?:es)?)?)(['|,]*)(128|64|32|16|8|4|2|1)?(\.*)/, [
        'variable.note',
        'operator.octave',
        'number.duration',
        'operator.dot',
      ]],

      // Rests: r4, R1, s2
      [/\b([rRs])(128|64|32|16|8|4|2|1)?(\.*)/, [
        'keyword.rest',
        'number.duration',
        'operator.dot',
      ]],

      // Measure bar check
      [/\|/, 'delimiter.bar'],

      // Ties & Slurs
      [/~/, 'operator.tie'],
      [/\(|\)/, 'delimiter.slur'],
      [/\[|\]/, 'delimiter.beam'],

      // Brackets
      [/<<|>>/, 'delimiter.angle.double'],
      [/<|>/, 'delimiter.angle'],
      [/\{|\}/, 'delimiter.curly'],

      // Numbers
      [/\d+\/\d+/, 'number.time'],
      [/\d+/, 'number'],
    ],

    blockComment: [
      [/[^%]+/, 'comment'],
      [/%\}/, 'comment', '@pop'],
      [/%/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop'],
    ],
  },
};
