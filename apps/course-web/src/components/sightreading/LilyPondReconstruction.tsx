import React, { useState, useEffect, useRef } from 'react';
import { SightReadingExercise } from '../../data/sightReadingData';
import { lilypondCompiler, CompileResult } from '../../lib/lilypond/LilyPondWasmCompiler';
import { exerciseGrader, GradeResult } from '../../lib/grader/ExerciseGrader';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { LilyPondEditor } from '../editor/LilyPondEditor';
import { ScorePreview } from '../score/ScorePreview';
import confetti from 'canvas-confetti';
import {
  Code2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Layers,
  FileCode,
  RotateCcw,
  ArrowRight,
  Eye,
  Info,
  Wand2,
} from 'lucide-react';

export type ReconstructionDifficulty = 'scaffolded' | 'scratch';

interface LilyPondReconstructionProps {
  exercise: SightReadingExercise;
  onComplete?: (score: number) => void;
  onNextExercise?: () => void;
}

export const LilyPondReconstruction: React.FC<LilyPondReconstructionProps> = ({
  exercise,
  onComplete,
  onNextExercise,
}) => {
  const [difficulty, setDifficulty] = useState<ReconstructionDifficulty>('scaffolded');
  const [userCode, setUserCode] = useState<string>(exercise.scaffoldCode);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [userCompileResult, setUserCompileResult] = useState<CompileResult | null>(null);
  const [targetCompileResult, setTargetCompileResult] = useState<CompileResult | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showDocs, setShowDocs] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [revealedHintCount, setRevealedHintCount] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Compile target score and initial user code
  const stopPlaybackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stopPlaybackRef.current?.();
    lilypondCompiler.compile(exercise.targetCode).then(setTargetCompileResult);

    const initialCode =
      difficulty === 'scaffolded'
        ? exercise.scaffoldCode
        : `\\version "2.24.0"\n\n% Write your LilyPond score from scratch below:\n`;

    setUserCode(initialCode);
    runCompile(initialCode);
    setGradeResult(null);
    setShowHints(false);
    setRevealedHintCount(1);

    return () => {
      stopPlaybackRef.current?.();
    };
  }, [exercise.id, difficulty]);

  const runCompile = async (codeToCompile: string) => {
    setIsCompiling(true);
    const res = await lilypondCompiler.compile(codeToCompile);
    setUserCompileResult(res);
    setIsCompiling(false);
  };

  const handlePlayAudio = () => {
    if (!userCompileResult || userCompileResult.midiNotes.length === 0) return;
    stopPlaybackRef.current?.();
    setIsPlayingAudio(true);
    stopPlaybackRef.current = audioEngine.playScore(userCompileResult.midiNotes, {
      bpm: exercise.tempoBpm || 80,
      onComplete: () => setIsPlayingAudio(false),
    });
  };

  const handleStopAudio = () => {
    stopPlaybackRef.current?.();
    stopPlaybackRef.current = null;
    setIsPlayingAudio(false);
  };

  const handleDifficultyChange = (diff: ReconstructionDifficulty) => {
    audioEngine.playUiSelect();
    setDifficulty(diff);
  };

  // Quick insertion from the command bank
  const handleInsertCommand = (cmd: string) => {
    audioEngine.playUiClick();
    const newCode = userCode + (userCode.endsWith('\n') ? '' : ' ') + cmd + ' ';
    setUserCode(newCode);
    runCompile(newCode);
  };

  // Grade user's reconstruction against the target score
  const handleCheckCode = async () => {
    const result = await exerciseGrader.gradeReconstruction(userCode, exercise.targetCode);
    setGradeResult(result);

    if (result.passed) {
      audioEngine.playCompletionFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (onComplete) {
        onComplete(result.score);
      }
    } else {
      audioEngine.playErrorBuzz();
    }
  };

  const handleResetCode = () => {
    audioEngine.playUiClick();
    const initialCode =
      difficulty === 'scaffolded'
        ? exercise.scaffoldCode
        : `\\version "2.24.0"\n\n% Write your LilyPond score from scratch below:\n`;
    setUserCode(initialCode);
    runCompile(initialCode);
    setGradeResult(null);
  };

  // Quick Command Bank Groups
  const commandBank = [
    {
      category: "Clefs",
      commands: ["\\clef treble", "\\clef bass", "\\clef alto"]
    },
    {
      category: "Meters & Keys",
      commands: [
        "\\time 4/4", "\\time 3/4", "\\time 2/4",
        "\\key c \\major", "\\key g \\major", "\\key d \\major", "\\key f \\major"
      ]
    },
    {
      category: "Pitch Mode",
      commands: ["\\relative c' {", "\\relative c {", "\\relative c'' {", "}"]
    },
    {
      category: "Accidentals",
      commands: ["cis", "dis", "fis", "gis", "ais", "ees", "aes", "bes"]
    },
    {
      category: "Durations & Rests",
      commands: ["1", "2", "4", "8", "4.", "2.", "r4", "r2", "|"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Code2 className="w-4 h-4" />
              <span>Score Reconstruction · Visual Score to LilyPond Code</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {exercise.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Study the target score engraving above and reconstruct its exact LilyPond code syntax below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                showHints
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHints ? 'Hide Hints' : 'Hints'}</span>
            </button>

            <button
              onClick={() => setShowDocs(!showDocs)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                showDocs
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reference Docs</span>
            </button>

            <button
              onClick={handleResetCode}
              title="Reset Code"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gradual Difficulty Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleDifficultyChange('scaffolded')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                difficulty === 'scaffolded'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Scaffolded (Partial Code Provided)</span>
            </button>

            <button
              onClick={() => handleDifficultyChange('scratch')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                difficulty === 'scratch'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>2. From Scratch (Blank IDE Challenge)</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Target Key: <strong className="text-slate-200">{exercise.key}</strong> · Meter: <strong className="text-slate-200">{exercise.meter}</strong>
          </div>
        </div>

        {/* Reference Cheat Sheet Drawer */}
        {showDocs && (
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span>LilyPond Syntax Quick Cheat Sheet</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-white">Relative Mode:</span>
                <p className="font-mono text-indigo-300">\relative c' &#123; ... &#125;</p>
                <p className="text-[11px] text-slate-400">c' starts on Middle C (C4). In relative mode, each note stays within a 4th of the previous note.</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-white">Accidentals:</span>
                <p className="font-mono text-indigo-300">fis (F#), cis (C#), bes (Bb)</p>
                <p className="text-[11px] text-slate-400">Append 'is' for sharps, 'es' for flats in Dutch note naming.</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-white">Durations & Bars:</span>
                <p className="font-mono text-indigo-300">4 (quarter), 2 (half), 1 (whole), |</p>
                <p className="text-[11px] text-slate-400">Durations are remembered until changed. Use pipe '|' for bar lines.</p>
              </div>
            </div>
          </div>
        )}

        {/* Progressive Hint Drawer */}
        {showHints && exercise.theoryTips && exercise.theoryTips.length > 0 && (
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Exercise Hints & Guidance</span>
              </div>
              <span className="text-[11px] text-amber-300/80 font-mono">
                Showing {Math.min(revealedHintCount, exercise.theoryTips.length)} of {exercise.theoryTips.length}
              </span>
            </div>

            <div className="space-y-2">
              {exercise.theoryTips.slice(0, revealedHintCount).map((tip, idx) => (
                <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-amber-500/20 text-slate-200 flex items-start gap-2.5">
                  <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                    Hint {idx + 1}
                  </span>
                  <p className="text-xs leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            {revealedHintCount < exercise.theoryTips.length && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    audioEngine.playUiClick();
                    setRevealedHintCount((c) => c + 1);
                  }}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                >
                  Reveal Next Hint ({exercise.theoryTips.length - revealedHintCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Target Score vs Editable Workspace */}
      <div className="space-y-6">
        {/* TARGET SCORE BOX (Goal) */}
        <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Target Score to Reconstruct (Goal)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
              Reference Sheet Music
            </span>
          </div>

          <div className="w-full max-h-[220px] overflow-y-auto overflow-x-auto rounded-xl bg-slate-950 p-4 border border-slate-800 flex justify-center">
            {targetCompileResult && targetCompileResult.pages.length > 0 ? (
              <div
                className="w-full min-w-[500px] flex justify-center"
                dangerouslySetInnerHTML={{ __html: targetCompileResult.pages[0] }}
              />
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                Rendering target score...
              </div>
            )}
          </div>
        </div>

        {/* BANK OF \ COMMANDS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Click-to-Insert Command Bank</span>
            <span className="text-[11px] font-normal text-slate-500 lowercase">(click any chip to append to code)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {commandBank.map((group) => (
              <div key={group.category} className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase px-1">
                  {group.category}:
                </span>
                {group.commands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleInsertCommand(cmd)}
                    className="font-mono text-xs px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-slate-800 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Live Grader Alert */}
        {gradeResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              gradeResult.passed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}
          >
            {gradeResult.passed ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold text-sm">{gradeResult.feedback}</p>
              {gradeResult.diagnostics.length > 0 && (
                <ul className="text-xs mt-2 list-disc list-inside space-y-1 text-slate-300">
                  {gradeResult.diagnostics.map((diag, i) => (
                    <li key={i}>{diag}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Dual-Pane Editor & Your Live Engraving */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[420px]">
          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold">Your Reconstructed LilyPond Code:</span>
              <button
                onClick={handleCheckCode}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-md transition-all"
              >
                Check Reconstruction
              </button>
            </div>
            <div className="flex-1 flex flex-col min-h-[360px]">
              <LilyPondEditor
                code={userCode}
                onChange={(newCode) => {
                  setUserCode(newCode);
                  runCompile(newCode);
                }}
                onCompile={() => runCompile(userCode)}
                isCompiling={isCompiling}
              />
            </div>
          </div>

          <div className="flex flex-col h-full space-y-2">
            <span className="text-xs text-slate-400 px-1 font-semibold">Your Live Compiled Score Preview:</span>
            <div className="flex-1 flex flex-col min-h-[360px]">
              <ScorePreview
                svgPages={userCompileResult ? userCompileResult.pages : []}
                logs={userCompileResult ? userCompileResult.logs : []}
                isPlaying={isPlayingAudio}
                onPlayAudio={handlePlayAudio}
                onStopAudio={handleStopAudio}
              />
            </div>
          </div>
        </div>

        {/* Completion Congratulations & Next Exercise */}
        {gradeResult && gradeResult.passed && (
          <div className="bg-gradient-to-r from-emerald-950 via-purple-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Score Reconstruction Mastered!
                </h4>
                <p className="text-xs text-emerald-300">
                  Flawless LilyPond syntax · Earned +50 XP!
                </p>
              </div>
            </div>

            {onNextExercise && (
              <button
                onClick={onNextExercise}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all scale-105"
              >
                <span>Next Reconstruction Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
