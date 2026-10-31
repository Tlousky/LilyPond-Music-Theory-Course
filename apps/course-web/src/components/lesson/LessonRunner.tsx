import React, { useState, useEffect, useRef } from 'react';
import { Lesson, REPERTOIRE_PIECES } from '../../data/curriculumData';
import { LilyPondEditor } from '../editor/LilyPondEditor';
import { ScorePreview } from '../score/ScorePreview';
import { VirtualPiano } from '../audio/VirtualPiano';
import { RhythmMetronome } from '../audio/RhythmMetronome';
import { lilypondCompiler, CompileResult } from '../../lib/lilypond/LilyPondWasmCompiler';
import { exerciseGrader, GradeResult } from '../../lib/grader/ExerciseGrader';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle,
  Music,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Play,
  Square,
  FileCode,
  Check,
  Copy,
  Lock,
} from 'lucide-react';

interface LessonRunnerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({
  lesson,
  onBack,
  onComplete,
}) => {
  // Current stage: 1 = Theory, 2 = Theory Practice, 3 = LilyPond Syntax, 4 = Code Challenge, 5 = Repertoire Capstone
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Stage 2: Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Stage 4: Code Challenge state
  const [userCode, setUserCode] = useState<string>(lesson.coding_challenge.initial_code);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Stage 5: Repertoire state
  const repPiece = lesson.repertoire_id ? REPERTOIRE_PIECES[lesson.repertoire_id] : null;
  const [repCompileResult, setRepCompileResult] = useState<CompileResult | null>(null);
  const [isRepPlaying, setIsRepPlaying] = useState<boolean>(false);
  const [repActiveTab, setRepActiveTab] = useState<'sheet' | 'code'>('sheet');
  const [capstoneSelectedOption, setCapstoneSelectedOption] = useState<number | null>(null);
  const [capstoneUnlocked, setCapstoneUnlocked] = useState<boolean>(false);
  const [capstoneSubmitted, setCapstoneSubmitted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active audio timers for clean cancellation
  const activeTimersRef = useRef<number[]>([]);

  const clearAudioTimers = () => {
    activeTimersRef.current.forEach((t) => clearTimeout(t));
    activeTimersRef.current = [];
  };

  // Initial compile for coding challenge and repertoire
  useEffect(() => {
    clearAudioTimers();
    setIsPlayingAudio(false);
    setIsRepPlaying(false);
    setCapstoneSelectedOption(null);
    setCapstoneUnlocked(false);
    setCapstoneSubmitted(false);
    setRepActiveTab('sheet');

    runCompile(userCode);
    if (repPiece) {
      lilypondCompiler.compile(repPiece.code).then(setRepCompileResult);
    }
  }, [lesson.id]);

  // Clean audio on stage transition or unmount
  useEffect(() => {
    clearAudioTimers();
    setIsPlayingAudio(false);
    setIsRepPlaying(false);
    return () => {
      clearAudioTimers();
    };
  }, [currentStage]);

  const runCompile = async (codeToCompile: string) => {
    setIsCompiling(true);
    const result = await lilypondCompiler.compile(codeToCompile);
    setCompileResult(result);
    setIsCompiling(false);
  };

  const handleStageChange = (newStage: number) => {
    audioEngine.playUiSelect();
    setCurrentStage(newStage);
  };

  const handleGradeCode = async () => {
    const result = await exerciseGrader.gradeLilyPondChallenge(
      userCode,
      lesson.coding_challenge.expected_pitches
    );
    setGradeResult(result);

    if (result.passed) {
      audioEngine.playSuccessChime();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      audioEngine.playErrorBuzz();
    }
  };

  const handlePlayScore = () => {
    if (!compileResult || compileResult.midiNotes.length === 0) return;
    clearAudioTimers();
    setIsPlayingAudio(true);

    let offsetMs = 0;
    compileResult.midiNotes.forEach((note) => {
      const durFactor = 4 / (note.duration || 4);
      const noteDurationMs = Math.max(180, Math.min(2000, durFactor * 500));
      const timer = window.setTimeout(() => {
        audioEngine.playNote(note.midi, (noteDurationMs / 1000) * 0.9, 'piano');
      }, offsetMs);
      activeTimersRef.current.push(timer);
      offsetMs += noteDurationMs;
    });

    const endTimer = window.setTimeout(() => {
      setIsPlayingAudio(false);
    }, offsetMs + 200);
    activeTimersRef.current.push(endTimer);
  };

  const handleStopScore = () => {
    clearAudioTimers();
    setIsPlayingAudio(false);
  };

  const handlePlayRepScore = () => {
    if (!repCompileResult || repCompileResult.midiNotes.length === 0) return;
    clearAudioTimers();
    setIsRepPlaying(true);

    let offsetMs = 0;
    repCompileResult.midiNotes.forEach((note) => {
      const durFactor = 4 / (note.duration || 4);
      const noteDurationMs = Math.max(180, Math.min(2200, durFactor * 550));
      const timer = window.setTimeout(() => {
        audioEngine.playNote(note.midi, (noteDurationMs / 1000) * 0.95, 'piano');
      }, offsetMs);
      activeTimersRef.current.push(timer);
      offsetMs += noteDurationMs;
    });

    const endTimer = window.setTimeout(() => {
      setIsRepPlaying(false);
    }, offsetMs + 300);
    activeTimersRef.current.push(endTimer);
  };

  const handleStopRepScore = () => {
    clearAudioTimers();
    setIsRepPlaying(false);
  };

  const capstoneChallenge = repPiece?.capstone_challenge || {
    question: `Examine the engraved score: What time signature (meter) is specified for this excerpt?`,
    options: [
      `${repPiece?.meter || '4/4'} time signature`,
      '3/8 dance meter',
      '5/4 irregular meter',
      'Free unmetered cadenza',
    ],
    answer: 0,
    explanation: `The score specifies \\time ${repPiece?.meter || '4/4'}.`,
  };

  const handleFinishLesson = () => {
    audioEngine.playCompletionFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    onComplete(lesson.id);
  };

  const stages = [
    { num: 1, label: 'Theory', icon: BookOpen },
    { num: 2, label: 'Quiz', icon: HelpCircle },
    { num: 3, label: 'Syntax', icon: Code2 },
    { num: 4, label: 'Challenge', icon: Sparkles },
    { num: 5, label: 'Capstone', icon: Music },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Breadcrumb & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Curriculum
        </button>

        {/* 5-Stage Step Indicators */}
        <div className="flex items-center gap-1 sm:gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          {stages.map((st) => {
            const Icon = st.icon;
            const isActive = currentStage === st.num;
            const isDone = currentStage > st.num;

            return (
              <button
                key={st.num}
                onClick={() => handleStageChange(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDone
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h2>
      </div>

      {/* STAGE 1: Theory Concept Card */}
      {currentStage === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h3 className="text-lg font-bold text-white">Music Theory Foundations</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {lesson.theory_summary}
            </p>
          </div>

          {/* Interactive Virtual Piano Reference */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Keyboard Reference & Ear Training
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Click or press computer keys to listen and observe corresponding LilyPond note notation.
            </p>
            <VirtualPiano />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleStageChange(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Theory Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: Theory Quiz & Verification */}
      {currentStage === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Stage 2 · Check Your Understanding</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            {lesson.theory_quiz.question}
          </h3>

          <div className="space-y-3">
            {lesson.theory_quiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === lesson.theory_quiz.answer;

              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (quizSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200';
                } else if (isSelected) {
                  style = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                }
              } else if (isSelected) {
                style = 'bg-indigo-600/20 border-indigo-500 text-indigo-200';
              }

              return (
                <button
                  key={idx}
                  disabled={quizSubmitted}
                  onClick={() => {
                    setSelectedOption(idx);
                    audioEngine.playUiSelect();
                  }}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${style}`}
                >
                  <span className="font-mono text-xs text-slate-500 mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div
              className={`p-4 rounded-xl border text-sm ${
                selectedOption === lesson.theory_quiz.answer
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{lesson.theory_quiz.explanation}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Theory
            </button>

            {!quizSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={() => {
                  setQuizSubmitted(true);
                  if (selectedOption === lesson.theory_quiz.answer) {
                    audioEngine.playSuccessChime();
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      origin: { y: 0.6 },
                    });
                  } else {
                    audioEngine.playErrorBuzz();
                  }
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => handleStageChange(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all"
              >
                <span>Next: LilyPond Syntax</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: LilyPond Syntax Reference Card */}
      {currentStage === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Stage 3 · LilyPond Notation Rules</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Writing with LilyPond: <code className="text-indigo-400">{lesson.syntax_id.replace('syntax.', '')}</code>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Syntax:</h4>
            <pre className="font-mono text-sm text-indigo-300 bg-slate-900 p-3 rounded-lg overflow-x-auto">
              {lesson.coding_challenge.solution_code}
            </pre>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lesson.coding_challenge.hint}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(2)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Quiz
            </button>
            <button
              onClick={() => handleStageChange(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Coding Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: Interactive Coding Challenge with Monaco & Grader */}
      {currentStage === 4 && (
        <div className="space-y-6">
          {/* Prompt card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                Stage 4 · Hands-on Coding Challenge
              </span>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {lesson.coding_challenge.prompt}
              </p>
            </div>

            <button
              onClick={handleGradeCode}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all shrink-0"
            >
              Check & Grade Code
            </button>
          </div>

          {/* Grader Diagnostics Alert */}
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

          {/* Dual-Pane Editor & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[420px]">
            <LilyPondEditor
              code={userCode}
              onChange={(newCode) => {
                setUserCode(newCode);
                runCompile(newCode);
              }}
              onCompile={() => runCompile(userCode)}
              isCompiling={isCompiling}
            />

            <ScorePreview
              svgPages={compileResult ? compileResult.pages : []}
              logs={compileResult ? compileResult.logs : []}
              isPlaying={isPlayingAudio}
              onPlayAudio={handlePlayScore}
              onStopAudio={handleStopScore}
            />
          </div>

          {/* Metronome / Rhythm Assistant */}
          <RhythmMetronome />

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => handleStageChange(3)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Syntax
            </button>

            <button
              onClick={() => handleStageChange(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all"
            >
              <span>Next: Classical Capstone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: Capstone Repertoire Excerpt */}
      {currentStage === 5 && repPiece && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Music className="w-4 h-4" />
                <span>Stage 5 · Classical Repertoire Capstone</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {repPiece.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {repPiece.composer} · {repPiece.opus} ({repPiece.era}, {repPiece.year}) · Measures {repPiece.excerpt_measures}
              </p>
            </div>

            {/* Playback Button in Header */}
            <div className="flex items-center gap-2">
              {isRepPlaying ? (
                <button
                  onClick={handleStopRepScore}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Score Audio</span>
                </button>
              ) : (
                <button
                  onClick={handlePlayRepScore}
                  disabled={!repCompileResult || repCompileResult.midiNotes.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    capstoneUnlocked
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40 animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Classical Score</span>
                </button>
              )}
            </div>
          </div>

          {/* Guidance banner */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Examine how LilyPond structures real classical engraving. Listen to the score, inspect the underlying LilyPond code syntax, and solve the score inspection challenge below to claim your master XP!
            </p>
          </div>

          {/* View Mode Tabs (Score View vs LilyPond Code) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setRepActiveTab('sheet');
                    audioEngine.playUiSelect();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    repActiveTab === 'sheet'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Sheet Music Engraving</span>
                </button>

                <button
                  onClick={() => {
                    setRepActiveTab('code');
                    audioEngine.playUiSelect();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    repActiveTab === 'code'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>LilyPond Source Code (.ly)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Key: <strong className="text-slate-300">{repPiece.key}</strong> · Meter: <strong className="text-slate-300">{repPiece.meter}</strong>
              </span>
            </div>

            {/* Container for Score Sheet or LilyPond Code */}
            {repActiveTab === 'sheet' ? (
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>Interactive Engraved SVG Score</span>
                  <span className="text-slate-500 italic">Scrollable view · Measures {repPiece.excerpt_measures}</span>
                </div>

                <div className="w-full max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg bg-slate-900 p-4 border border-slate-800/80">
                  {repCompileResult && repCompileResult.pages.length > 0 ? (
                    <div
                      className="w-full min-w-[550px] flex justify-center"
                      dangerouslySetInnerHTML={{ __html: repCompileResult.pages[0] }}
                    />
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Engraving classical score...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-mono text-indigo-300 font-semibold">{repPiece.score_file}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(repPiece.code);
                      setCopiedCode(true);
                      audioEngine.playUiClick();
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="w-full max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg bg-slate-900 p-4 border border-slate-800/80 font-mono text-xs leading-relaxed text-indigo-200">
                  <pre className="whitespace-pre">{repPiece.code}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Active Learning Capstone Challenge Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Score Inspection & Analysis Challenge
                </h4>
              </div>
              {capstoneUnlocked ? (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Score Mastered
                </span>
              ) : (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Unlocks Playback & Bonus XP
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-white">
              {capstoneChallenge.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {capstoneChallenge.options.map((opt, idx) => {
                const isSelected = capstoneSelectedOption === idx;
                const isCorrect = idx === capstoneChallenge.answer;
                let cardStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                if (capstoneSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    cardStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-200';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCapstoneSelectedOption(idx);
                      setCapstoneSubmitted(false);
                      audioEngine.playUiSelect();
                    }}
                    className={`flex items-start text-left gap-2.5 p-3 rounded-lg border text-xs transition-all ${cardStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Verification and Feedback */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                {capstoneSubmitted && (
                  <p className={`text-xs font-medium ${capstoneUnlocked ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {capstoneUnlocked
                      ? `✨ Correct! ${capstoneChallenge.explanation}`
                      : `❌ Not quite. Examine the score or source code above, or click Reveal Answer.`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {!capstoneUnlocked && (
                  <button
                    onClick={() => {
                      setCapstoneSelectedOption(capstoneChallenge.answer);
                      setCapstoneSubmitted(true);
                      setCapstoneUnlocked(true);
                      audioEngine.playUiClick();
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Reveal Answer
                  </button>
                )}
                <button
                  onClick={() => {
                    setCapstoneSubmitted(true);
                    if (capstoneSelectedOption === capstoneChallenge.answer) {
                      setCapstoneUnlocked(true);
                      audioEngine.playSuccessChime();
                      confetti({
                        particleCount: 60,
                        spread: 50,
                        origin: { y: 0.7 },
                      });
                    } else {
                      audioEngine.playErrorBuzz();
                    }
                  }}
                  disabled={capstoneSelectedOption === null}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-indigo-600/20"
                >
                  Verify Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(4)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Challenge
            </button>

            <button
              onClick={handleFinishLesson}
              className={`inline-flex items-center gap-2 px-8 py-3 text-white font-extrabold text-base rounded-xl shadow-lg transition-all ${
                capstoneUnlocked
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 shadow-purple-500/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Complete Lesson & Claim +50 XP!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
