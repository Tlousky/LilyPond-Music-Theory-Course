import React, { useState, useEffect } from 'react';
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

  // Initial compile for coding challenge and repertoire
  useEffect(() => {
    runCompile(userCode);
    if (repPiece) {
      lilypondCompiler.compile(repPiece.code).then(setRepCompileResult);
    }
  }, [lesson.id]);

  const runCompile = async (codeToCompile: string) => {
    setIsCompiling(true);
    const result = await lilypondCompiler.compile(codeToCompile);
    setCompileResult(result);
    setIsCompiling(false);
  };

  const handleGradeCode = async () => {
    const result = await exerciseGrader.gradeLilyPondChallenge(
      userCode,
      lesson.coding_challenge.expected_pitches
    );
    setGradeResult(result);

    if (result.passed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handlePlayScore = () => {
    if (!compileResult || compileResult.midiNotes.length === 0) return;
    setIsPlayingAudio(true);

    let offset = 0;
    compileResult.midiNotes.forEach((note) => {
      setTimeout(() => {
        audioEngine.playNote(note.midi, 0.7);
      }, offset * 500);
      offset += 1;
    });

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, (offset + 1) * 500);
  };

  const handleFinishLesson = () => {
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
                onClick={() => setCurrentStage(st.num)}
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
              onClick={() => setCurrentStage(2)}
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
                  onClick={() => setSelectedOption(idx)}
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
              onClick={() => setCurrentStage(1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Theory
            </button>

            {!quizSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={() => setQuizSubmitted(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => setCurrentStage(3)}
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
              onClick={() => setCurrentStage(2)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Quiz
            </button>
            <button
              onClick={() => setCurrentStage(4)}
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
              onStopAudio={() => setIsPlayingAudio(false)}
            />
          </div>

          {/* Metronome / Rhythm Assistant */}
          <RhythmMetronome />

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStage(3)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Syntax
            </button>

            <button
              onClick={() => setCurrentStage(5)}
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
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Music className="w-4 h-4" />
            <span>Stage 5 · Classical Repertoire Capstone</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">
              {repPiece.title}
            </h3>
            <p className="text-sm text-slate-400">
              {repPiece.composer} · {repPiece.opus} ({repPiece.era}, {repPiece.year})
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-300 mb-3">
              This authentic score excerpt exemplifies the concepts you just learned. Listen to the score and examine how LilyPond structures real classical engraving:
            </p>
            {repCompileResult && repCompileResult.pages.length > 0 && (
              <div
                className="w-full bg-slate-900 rounded-lg p-2 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: repCompileResult.pages[0] }}
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStage(4)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Challenge
            </button>

            <button
              onClick={handleFinishLesson}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-base rounded-xl shadow-lg shadow-purple-500/30 transition-all scale-105"
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
