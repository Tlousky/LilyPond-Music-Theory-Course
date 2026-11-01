import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import {
  LILYPOND_LANGUAGE_ID,
  LILYPOND_CONFIGURATION,
  LILYPOND_MONARCH_TOKENS,
} from '../../lib/monaco/lilypondMonarch';
import { Play, Sparkles } from 'lucide-react';

// Register language once globally
let isLanguageRegistered = false;
function ensureLilyPondLanguage() {
  if (!isLanguageRegistered) {
    monaco.languages.register({ id: LILYPOND_LANGUAGE_ID, extensions: ['.ly', '.ily'] });
    monaco.languages.setLanguageConfiguration(LILYPOND_LANGUAGE_ID, LILYPOND_CONFIGURATION);
    monaco.languages.setMonarchTokensProvider(LILYPOND_LANGUAGE_ID, LILYPOND_MONARCH_TOKENS);

    // Custom dark theme for LilyPond
    monaco.editor.defineTheme('lilypond-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'variable.note', foreground: '38bdf8' },
        { token: 'operator.octave', foreground: 'f472b6', fontStyle: 'bold' },
        { token: 'number.duration', foreground: 'facc15' },
        { token: 'operator.dot', foreground: 'facc15', fontStyle: 'bold' },
        { token: 'keyword.rest', foreground: 'fb923c' },
        { token: 'delimiter.bar', foreground: '94a3b8', fontStyle: 'bold' },
        { token: 'delimiter.angle', foreground: 'c084fc' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#090d16',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#334155',
        'editorCursor.foreground': '#818cf8',
        'editor.selectionBackground': '#312e81',
        'editorOverviewRuler.background': '#090d16',
        'editorOverviewRuler.border': '#090d16',
        'scrollbarSlider.background': '#1e293b80',
        'scrollbarSlider.hoverBackground': '#334155a0',
        'scrollbarSlider.activeBackground': '#475569c0',
      },
    });

    isLanguageRegistered = true;
  }
}

interface LilyPondEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export const LilyPondEditor: React.FC<LilyPondEditorProps> = ({
  code,
  onChange,
  onCompile,
  isCompiling,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    ensureLilyPondLanguage();

    if (containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: LILYPOND_LANGUAGE_ID,
        theme: 'lilypond-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        wordWrap: 'on',
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          verticalHasArrows: false,
          horizontalHasArrows: false,
        },
      });

      editorRef.current.onDidChangeModelContent(() => {
        const val = editorRef.current?.getValue() || '';
        onChange(val);
      });
    }

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  const insertSnippet = (snippet: string) => {
    if (!editorRef.current) return;
    const selection = editorRef.current.getSelection();
    if (selection) {
      editorRef.current.executeEdits('quick-palette', [
        {
          range: selection,
          text: snippet,
          forceMoveMarkers: true,
        },
      ]);
      editorRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Quick-Palette Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1 text-[11px]">Quick Insert:</span>
          <button
            onClick={() => insertSnippet('\\clef treble ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded font-mono text-[11px] transition-colors"
          >
            \clef treble
          </button>
          <button
            onClick={() => insertSnippet('\\clef bass ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded font-mono text-[11px] transition-colors"
          >
            \clef bass
          </button>
          <button
            onClick={() => insertSnippet('\\time 4/4 ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px] transition-colors"
          >
            \time 4/4
          </button>
          <button
            onClick={() => insertSnippet('< > ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded font-mono text-[11px] transition-colors"
          >
            &lt; chord &gt;
          </button>
          <button
            onClick={() => insertSnippet('\\figures { < 6 > } ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-mono text-[11px] transition-colors"
          >
            \figures
          </button>
          <button
            onClick={() => insertSnippet('| ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded font-mono text-[11px] transition-colors"
          >
            | (bar)
          </button>
        </div>

        {/* Compile button */}
        <button
          onClick={onCompile}
          disabled={isCompiling}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          {isCompiling ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" />
          )}
          {isCompiling ? 'Compiling...' : 'Run Score'}
        </button>
      </div>

      {/* Editor Body */}
      <div ref={containerRef} className="flex-1 w-full min-h-[300px]" />
    </div>
  );
};
