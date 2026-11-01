import React, { useState, useEffect, useRef } from 'react';
import { LilyPondEditor } from '../editor/LilyPondEditor';
import { ScorePreview } from '../score/ScorePreview';
import { VirtualPiano } from '../audio/VirtualPiano';
import { RhythmMetronome } from '../audio/RhythmMetronome';
import { lilypondCompiler, CompileResult } from '../../lib/lilypond/LilyPondWasmCompiler';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { Code2 } from 'lucide-react';

const DEFAULT_PLAYGROUND_CODE = `\\version "2.24.0"

\\header {
  title = "LilyPond Creative Playground"
  composer = "Your Name"
}

\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\key c \\major
    \\time 4/4
    \\relative c' {
      c4 d e f |
      g4 a b c' |
      <c e g>1 |
    }
  }
  \\new Staff {
    \\clef bass
    \\key c \\major
    \\time 4/4
    \\relative c {
      c1 |
      g1 |
      <c, e g>1 |
    }
  }
>>`;

export const FreePlayground: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_PLAYGROUND_CODE);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stopPlaybackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    runCompile(code);
    return () => {
      stopPlaybackRef.current?.();
    };
  }, []);

  const runCompile = async (codeToCompile: string) => {
    setIsCompiling(true);
    const result = await lilypondCompiler.compile(codeToCompile);
    setCompileResult(result);
    setIsCompiling(false);
  };

  const handlePlayAudio = () => {
    if (!compileResult || compileResult.midiNotes.length === 0) return;
    stopPlaybackRef.current?.();
    setIsPlaying(true);

    stopPlaybackRef.current = audioEngine.playScore(compileResult.midiNotes, {
      bpm: 80,
      onComplete: () => setIsPlaying(false),
    });
  };

  const handleStopAudio = () => {
    stopPlaybackRef.current?.();
    stopPlaybackRef.current = null;
    setIsPlaying(false);
  };

  const handleInsertPianoNote = (noteName: string, lilySyntax: string) => {
    setCode((prev) => `${prev.trimEnd()}\n% ${noteName}\n${lilySyntax}4 `);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Code2 className="w-3.5 h-3.5" />
          Interactive Sandbox
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          LilyPond Code Playground
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Experiment freely with scores, polyphony, figured bass, and custom musical engravings.
        </p>
      </div>

      {/* Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[480px]">
        <LilyPondEditor
          code={code}
          onChange={(newCode) => {
            setCode(newCode);
            runCompile(newCode);
          }}
          onCompile={() => runCompile(code)}
          isCompiling={isCompiling}
        />

        <ScorePreview
          svgPages={compileResult ? compileResult.pages : []}
          logs={compileResult ? compileResult.logs : []}
          isPlaying={isPlaying}
          onPlayAudio={handlePlayAudio}
          onStopAudio={handleStopAudio}
        />
      </div>

      {/* Piano & Metronome Assistants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VirtualPiano onNotePlay={handleInsertPianoNote} />
        <RhythmMetronome />
      </div>
    </div>
  );
};
