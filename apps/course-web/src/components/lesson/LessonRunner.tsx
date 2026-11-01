import React, { useState, useEffect, useRef } from 'react';
import { Lesson, REPERTOIRE_PIECES } from '../../data/curriculumData';
import { TheoryDiagram } from '../curriculum/TheoryDiagram';
import { TraditionalSightReading } from '../sightreading/TraditionalSightReading';
import { LilyPondReconstruction } from '../sightreading/LilyPondReconstruction';
import { LilyPondEditor } from '../editor/LilyPondEditor';
import { ScorePreview } from '../score/ScorePreview';
import { VirtualPiano } from '../audio/VirtualPiano';
import { RhythmMetronome } from '../audio/RhythmMetronome';
import { MarkdownView } from '../common/MarkdownView';
import { lilypondCompiler, CompileResult } from '../../lib/lilypond/LilyPondWasmCompiler';
import { exerciseGrader, GradeResult } from '../../lib/grader/ExerciseGrader';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { SightReadingExercise } from '../../data/sightReadingData';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Piano,
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
  Volume2,
  HelpCircle,
  Eye,
  Layers,
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
  // Current 5-phase stage:
  // 1 = In-Depth Theory & Diagrams
  // 2 = Traditional Score vs Keyboard Practice
  // 3 = LilyPond Notation Rules & Syntax
  // 4 = LilyPond Reconstruction Challenge
  // 5 = Mixed Capstone (Code + Piano Performance)
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Stage 1 state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Stage 2 state
  const [stage2Complete, setStage2Complete] = useState<boolean>(false);

  // Stage 3 state (Syntax quiz)
  const [syntaxQuizSelected, setSyntaxQuizSelected] = useState<number | null>(null);
  const [syntaxQuizSubmitted, setSyntaxQuizSubmitted] = useState<boolean>(false);

  // Stage 4 state
  const [stage4Complete, setStage4Complete] = useState<boolean>(false);

  // Stage 5 state (Mixed Capstone)
  const [capstonePhase, setCapstonePhase] = useState<'code' | 'perform'>('code');
  const [capstoneCode, setCapstoneCode] = useState<string>(
    lesson.capstone?.initialCode || lesson.coding_challenge.initial_code
  );
  const [isCompilingCapstone, setIsCompilingCapstone] = useState<boolean>(false);
  const [capstoneCompileResult, setCapstoneCompileResult] = useState<CompileResult | null>(null);
  const [capstoneTargetCompileResult, setCapstoneTargetCompileResult] = useState<CompileResult | null>(null);
  const [capstoneGradeResult, setCapstoneGradeResult] = useState<GradeResult | null>(null);
  const [isCapstonePlaying, setIsCapstonePlaying] = useState<boolean>(false);
  const [isTargetAudioPlaying, setIsTargetAudioPlaying] = useState<boolean>(false);
  const [capstoneReflectionSelected, setCapstoneReflectionSelected] = useState<number | null>(null);
  const [capstoneReflectionSubmitted, setCapstoneReflectionSubmitted] = useState<boolean>(false);
  const [capstoneUnlocked, setCapstoneUnlocked] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showCapstoneHint, setShowCapstoneHint] = useState<boolean>(false);

  const activeTimersRef = useRef<number[]>([]);

  const clearAudioTimers = () => {
    activeTimersRef.current.forEach((t) => clearTimeout(t));
    activeTimersRef.current = [];
  };

  // Reset states when lesson changes
  useEffect(() => {
    clearAudioTimers();
    setCurrentStage(1);
    setStage2Complete(false);
    setSyntaxQuizSelected(null);
    setSyntaxQuizSubmitted(false);
    setStage4Complete(false);
    setCapstonePhase('code');
    setCapstoneCode(lesson.capstone?.initialCode || lesson.coding_challenge.initial_code);
    setCapstoneGradeResult(null);
    setCapstoneReflectionSelected(null);
    setCapstoneReflectionSubmitted(false);
    setCapstoneUnlocked(false);
    setShowCapstoneHint(false);

    const initialCode = lesson.capstone?.initialCode || lesson.coding_challenge.initial_code;
    lilypondCompiler.compile(initialCode).then(setCapstoneCompileResult);

    const targetCode = lesson.capstone?.solutionCode || lesson.coding_challenge.solution_code;
    lilypondCompiler.compile(targetCode).then(setCapstoneTargetCompileResult);
  }, [lesson.id]);

  // Clean audio timers on stage changes
  useEffect(() => {
    clearAudioTimers();
    setIsCapstonePlaying(false);
    setIsTargetAudioPlaying(false);
    return () => clearAudioTimers();
  }, [currentStage]);

  const handleStageChange = (newStage: number) => {
    audioEngine.playUiSelect();
    setCurrentStage(newStage);
  };

  const handlePlayPreviewAudio = (id: string, midiNotes: number[], dur: number = 0.6) => {
    setPlayingAudioId(id);
    midiNotes.forEach((midi, idx) => {
      const timer = window.setTimeout(() => {
        audioEngine.playNote(midi, dur, 'piano');
      }, idx * 400);
      activeTimersRef.current.push(timer);
    });

    const endTimer = window.setTimeout(() => {
      setPlayingAudioId(null);
    }, midiNotes.length * 400 + 300);
    activeTimersRef.current.push(endTimer);
  };

  const handleCompileCapstone = async (code: string) => {
    setIsCompilingCapstone(true);
    const res = await lilypondCompiler.compile(code);
    setCapstoneCompileResult(res);
    setIsCompilingCapstone(false);
  };

  const handleGradeCapstoneCode = async () => {
    const expected = lesson.capstone?.expectedPitches || lesson.coding_challenge.expected_pitches;
    const result = await exerciseGrader.gradeLilyPondChallenge(capstoneCode, expected);
    setCapstoneGradeResult(result);

    if (result.passed) {
      audioEngine.playSuccessChime();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      setCapstoneUnlocked(true);
    } else {
      audioEngine.playErrorBuzz();
    }
  };

  const handlePlayCapstoneScore = () => {
    if (!capstoneCompileResult || capstoneCompileResult.midiNotes.length === 0) return;
    clearAudioTimers();
    setIsCapstonePlaying(true);

    let offsetMs = 0;
    capstoneCompileResult.midiNotes.forEach((note) => {
      const durFactor = 4 / (note.duration || 4);
      const noteDurationMs = Math.max(180, Math.min(2000, durFactor * 520));
      const timer = window.setTimeout(() => {
        audioEngine.playNote(note.midi, (noteDurationMs / 1000) * 0.95, 'piano');
      }, offsetMs);
      activeTimersRef.current.push(timer);
      offsetMs += noteDurationMs;
    });

    const endTimer = window.setTimeout(() => {
      setIsCapstonePlaying(false);
    }, offsetMs + 250);
    activeTimersRef.current.push(endTimer);
  };

  const handleStopCapstoneScore = () => {
    clearAudioTimers();
    setIsCapstonePlaying(false);
  };

  const handlePlayTargetScore = () => {
    if (!capstoneTargetCompileResult || capstoneTargetCompileResult.midiNotes.length === 0) return;
    clearAudioTimers();
    setIsTargetAudioPlaying(true);
    setIsCapstonePlaying(false);
    const notes = capstoneTargetCompileResult.midiNotes;
    const bpm = lesson.capstone?.tempoBpm || 80;
    let currTime = 0;
    notes.forEach((n, idx) => {
      const durSec = (60 / bpm) * (4 / (n.duration || 4));
      const t = window.setTimeout(() => {
        audioEngine.playNote(n.midi, 0.7);
        if (idx === notes.length - 1) {
          const endT = window.setTimeout(() => setIsTargetAudioPlaying(false), durSec * 1000);
          activeTimersRef.current.push(endT);
        }
      }, currTime * 1000);
      activeTimersRef.current.push(t);
      currTime += durSec;
    });
  };

  const handleStopTargetScore = () => {
    clearAudioTimers();
    setIsTargetAudioPlaying(false);
  };

  const handleFinishLesson = () => {
    audioEngine.playCompletionFanfare();
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.6 },
    });
    onComplete(lesson.id);
  };

  // Adapt lesson data to SightReadingExercise for Stage 2 & Stage 4
  const stage2Exercise: SightReadingExercise = {
    id: `sr_stage2_${lesson.id}`,
    level: lesson.chapter_order,
    title: lesson.traditionalPractice?.title || `${lesson.title} - Score vs Keyboard`,
    description: lesson.traditionalPractice?.instructions || 'Read the score and play the notes on the keyboard.',
    clef: lesson.traditionalPractice?.clef || 'treble',
    key: lesson.traditionalPractice?.key || 'C major',
    meter: lesson.traditionalPractice?.meter || '4/4',
    tempoBpm: lesson.traditionalPractice?.tempoBpm || 80,
    slowBpm: lesson.traditionalPractice?.slowBpm || 50,
    targetCode: lesson.traditionalPractice?.targetCode || lesson.coding_challenge.solution_code,
    scaffoldCode: lesson.traditionalPractice?.targetCode || lesson.coding_challenge.solution_code,
    theoryTips: lesson.traditionalPractice?.hints || [lesson.theory_summary],
  };

  const stage4Exercise: SightReadingExercise = {
    id: `sr_stage4_${lesson.id}`,
    level: lesson.chapter_order,
    title: lesson.reconstruction?.prompt || lesson.coding_challenge.prompt,
    description: lesson.reconstruction?.hints.join(' ') || lesson.coding_challenge.hint,
    clef: lesson.traditionalPractice?.clef || 'treble',
    key: lesson.traditionalPractice?.key || 'C major',
    meter: lesson.traditionalPractice?.meter || '4/4',
    tempoBpm: lesson.traditionalPractice?.tempoBpm || 80,
    slowBpm: lesson.traditionalPractice?.slowBpm || 50,
    targetCode: lesson.reconstruction?.solutionCode || lesson.coding_challenge.solution_code,
    scaffoldCode: lesson.reconstruction?.scaffoldCode || lesson.coding_challenge.initial_code,
    theoryTips: lesson.reconstruction?.hints || [lesson.coding_challenge.hint],
  };

  const capstonePerformanceExercise: SightReadingExercise = {
    id: `sr_capstone_${lesson.id}`,
    level: lesson.chapter_order,
    title: `${lesson.capstone?.title || 'Classical Masterpiece'} - Piano Performance`,
    description: `${lesson.capstone?.composer || 'Composer'} · ${lesson.capstone?.meter || '4/4'} · Key: ${
      lesson.capstone?.key || 'C major'
    }`,
    clef: lesson.traditionalPractice?.clef || 'treble',
    key: lesson.capstone?.key || 'C major',
    meter: lesson.capstone?.meter || '4/4',
    tempoBpm: lesson.capstone?.tempoBpm || 90,
    slowBpm: lesson.capstone?.slowBpm || 55,
    targetCode: lesson.capstone?.solutionCode || lesson.coding_challenge.solution_code,
    scaffoldCode: lesson.capstone?.initialCode || lesson.coding_challenge.initial_code,
    theoryTips: [lesson.capstone?.hint || 'Perform the phrase cleanly on the keyboard.'],
  };

  const stages = [
    { num: 1, label: '1. Theory Concept', short: 'Theory', icon: BookOpen },
    { num: 2, label: '2. Traditional Practice', short: 'Score vs Piano', icon: Piano },
    { num: 3, label: '3. LilyPond Rules', short: 'Syntax', icon: Code2 },
    { num: 4, label: '4. Reconstruction', short: 'Reconstruct', icon: Sparkles },
    { num: 5, label: '5. Mixed Capstone', short: 'Capstone', icon: Music },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Navigation & 5-Phase Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Curriculum
        </button>

        {/* 5-Phase Step Indicators */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
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
                <span className="hidden md:inline">{st.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Header Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Open Music Theory · Chapter {lesson.chapter_order}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {lesson.title}
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Phase {currentStage} of 5
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* PHASE 1: In-Depth Music Theory Concept & Diagrams                                         */}
      {/* ========================================================================================= */}
      {currentStage === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Phase 1 · In-Depth Music Theory Concept</span>
          </div>

          {/* Concept Summary Callout */}
          <div className="border-l-4 border-indigo-500 bg-indigo-950/20 p-4 rounded-r-xl">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Core Principle</h3>
            <div className="text-base text-slate-200 mt-1 font-medium leading-relaxed">
              <MarkdownView content={lesson.theory?.summary || lesson.theory_summary} inline />
            </div>
          </div>

          {/* Detailed Textbook Markdown Content */}
          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80 text-slate-300 text-sm leading-relaxed">
            <MarkdownView content={lesson.theory?.markdown || lesson.theory_summary} />
          </div>

          {/* Interactive Visual Staff / Keyboard Diagram */}
          {lesson.theory?.diagramType && (
            <div>
              <TheoryDiagram type={lesson.theory.diagramType} />
            </div>
          )}

          {/* Audio Examples & Listening Previews */}
          {lesson.theory?.audioPreviews && lesson.theory.audioPreviews.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                Listen & Audiate Musical Concepts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lesson.theory.audioPreviews.map((preview, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayPreviewAudio(`preview-${i}`, preview.midi)}
                    className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all ${
                      playingAudioId === `preview-${i}`
                        ? 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Play className="w-3.5 h-3.5 fill-indigo-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{preview.label}</span>
                      <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                        {preview.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways Card */}
          {lesson.theory?.keyTakeaways && lesson.theory.keyTakeaways.length > 0 && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Key Takeaways
              </h4>
              <ul className="text-xs text-emerald-200/90 list-disc list-inside space-y-1.5">
                {lesson.theory.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Virtual Piano Free Reference */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Virtual Piano Keyboard Reference
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Engage kinesthetically! Tap keys to audiate pitches and observe their musical staff notation.
            </p>
            <VirtualPiano />
          </div>

          {/* Bottom Stage Transition */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Phase 2 · Traditional Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* PHASE 2: Traditional Practice (Score vs. Virtual Piano Keyboard)                          */}
      {/* ========================================================================================= */}
      {currentStage === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Piano className="w-4 h-4" />
              <span>Phase 2 · Traditional Score vs. Keyboard Practice</span>
            </div>
            {stage2Complete && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Exercise Mastered
              </span>
            )}
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p>
                <strong>Traditional Music Theory Training:</strong> Look at the engraved sheet music score below and press the matching notes on the virtual piano keyboard in order.
              </p>
              <p className="text-slate-400">
                You can switch between <em>Note Sequence</em>, <em>Slow Metronome Pulse</em>, or <em>Original Tempo</em> using the mode buttons.
              </p>
            </div>
          </div>

          {/* Traditional Sight Reading Component */}
          <TraditionalSightReading
            exercise={stage2Exercise}
            onComplete={(score) => {
              setStage2Complete(true);
              audioEngine.playSuccessChime();
            }}
          />

          {/* Stage Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Theory
            </button>

            <button
              onClick={() => handleStageChange(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Phase 3 · LilyPond Rules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* PHASE 3: LilyPond Notation Rules & Syntax                                                */}
      {/* ========================================================================================= */}
      {currentStage === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Phase 3 · LilyPond Notation Rules & Syntax Bridge</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            Writing with LilyPond: <code className="text-indigo-400 font-mono">{lesson.syntax?.command || lesson.syntax_id}</code>
          </h3>

          <div className="text-sm text-slate-300 leading-relaxed">
            <MarkdownView content={lesson.syntax?.explanation || lesson.theory_summary} />
          </div>

          {/* Core Rules List */}
          {lesson.syntax?.rules && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syntax Rules:</h4>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-1.5">
                {lesson.syntax.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Example Preview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annotated LilyPond Code:</h4>
            <pre className="font-mono text-sm text-indigo-300 bg-slate-900 p-3 rounded-lg overflow-x-auto">
              {lesson.syntax?.exampleCode || lesson.coding_challenge.solution_code}
            </pre>
          </div>

          {/* Cheat Sheet Table */}
          {lesson.syntax?.cheatSheet && (
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Command Reference:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {lesson.syntax.cheatSheet.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <code className="text-indigo-400 font-mono font-semibold">{item.command}</code>
                    <span className="text-slate-400">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Comprehension Check Quiz */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Quick Check: Verify Before Writing Code</span>
            </div>

            <p className="text-sm font-semibold text-white">
              {lesson.syntax?.quiz?.question || lesson.theory_quiz.question}
            </p>

            <div className="space-y-2.5">
              {(lesson.syntax?.quiz?.options || lesson.theory_quiz.options).map((opt, idx) => {
                const isSelected = syntaxQuizSelected === idx;
                const isCorrect = idx === (lesson.syntax?.quiz?.answer ?? lesson.theory_quiz.answer);

                let style = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                if (syntaxQuizSubmitted) {
                  if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                  else if (isSelected) style = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                } else if (isSelected) {
                  style = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={syntaxQuizSubmitted}
                    onClick={() => {
                      setSyntaxQuizSelected(idx);
                      audioEngine.playUiSelect();
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${style}`}
                  >
                    <span className="font-mono text-xs text-slate-500 mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {syntaxQuizSubmitted && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                  syntaxQuizSelected === (lesson.syntax?.quiz?.answer ?? lesson.theory_quiz.answer)
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <MarkdownView content={lesson.syntax?.quiz?.explanation || lesson.theory_quiz.explanation} inline />
                  </div>
                </div>
              </div>
            )}

            {!syntaxQuizSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  disabled={syntaxQuizSelected === null}
                  onClick={() => {
                    setSyntaxQuizSubmitted(true);
                    if (syntaxQuizSelected === (lesson.syntax?.quiz?.answer ?? lesson.theory_quiz.answer)) {
                      audioEngine.playSuccessChime();
                      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                    } else {
                      audioEngine.playErrorBuzz();
                    }
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Verify Answer
                </button>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(2)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Practice
            </button>

            <button
              onClick={() => handleStageChange(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Phase 4 · LilyPond Reconstruction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* PHASE 4: LilyPond Reconstruction Challenge                                               */}
      {/* ========================================================================================= */}
      {currentStage === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Phase 4 · LilyPond Score Reconstruction</span>
            </div>
            {stage4Complete && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Reconstruction Passed
              </span>
            )}
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p>
                <strong>Reconstruction Challenge:</strong> Match the target engraved sheet music. Choose between <em>Scaffolded</em> (partial code with hints) or <em>From Scratch</em> mode, use the clickable <strong>\ Bank</strong> to insert commands, and hit <strong>Check & Grade</strong>!
              </p>
            </div>
          </div>

          {/* Dedicated LilyPond Reconstruction Component */}
          <LilyPondReconstruction
            exercise={stage4Exercise}
            onComplete={(score) => {
              setStage4Complete(true);
              audioEngine.playSuccessChime();
            }}
          />

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(3)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Syntax
            </button>

            <button
              onClick={() => handleStageChange(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next: Phase 5 · Mixed Capstone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* PHASE 5: Mixed Capstone (Write Code, Then Play on Piano!)                                */}
      {/* ========================================================================================= */}
      {currentStage === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Music className="w-4 h-4" />
                <span>Phase 5 · Mixed Capstone Challenge</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {lesson.capstone?.title || 'Classical Masterpiece Capstone'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {lesson.capstone?.composer || 'Composer'} · Meter: <strong className="text-slate-200">{lesson.capstone?.meter || '4/4'}</strong> · Key: <strong className="text-slate-200">{lesson.capstone?.key || 'C major'}</strong>
              </p>
            </div>

            {/* Mode Switcher: Step 5A (Code Engraving) vs Step 5B (Piano Performance) */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setCapstonePhase('code');
                  audioEngine.playUiSelect();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  capstonePhase === 'code'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Step 5A: Engrave Score</span>
              </button>

              <button
                onClick={() => {
                  setCapstonePhase('perform');
                  audioEngine.playUiSelect();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  capstonePhase === 'perform'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Piano className="w-3.5 h-3.5" />
                <span>Step 5B: Play on Piano</span>
              </button>
            </div>
          </div>

          {/* STEP 5A: Engrave Classical Score */}
          {capstonePhase === 'code' ? (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed space-y-1 flex-1">
                  <p>
                    <strong>Step 5A: Write the Master Score:</strong> {lesson.capstone?.codePrompt || 'Engrave the classical piece in LilyPond.'}
                  </p>
                  <p className="text-slate-400">
                    Once compiled and verified, switch to <strong>Step 5B</strong> to perform your masterpiece on the virtual keyboard!
                  </p>
                </div>
                {(lesson.capstone?.hint || lesson.coding_challenge.hint) && (
                  <button
                    onClick={() => setShowCapstoneHint(!showCapstoneHint)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                      showCapstoneHint
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                    }`}
                  >
                    {showCapstoneHint ? 'Hide Hint' : 'Need a Hint?'}
                  </button>
                )}
              </div>

              {showCapstoneHint && (lesson.capstone?.hint || lesson.coding_challenge.hint) && (
                <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[11px] text-amber-300 block mb-0.5">
                      Hint:
                    </span>
                    <p>{lesson.capstone?.hint || lesson.coding_challenge.hint}</p>
                  </div>
                </div>
              )}

              {/* Grader Diagnostics Alert */}
              {capstoneGradeResult && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    capstoneGradeResult.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  {capstoneGradeResult.passed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm">{capstoneGradeResult.feedback}</p>
                    {capstoneGradeResult.diagnostics.length > 0 && (
                      <ul className="text-xs mt-2 list-disc list-inside space-y-1 text-slate-300">
                        {capstoneGradeResult.diagnostics.map((diag, i) => (
                          <li key={i}>{diag}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* TARGET SOURCE MASTER SCORE BOX (Master Reference) */}
              <div className="bg-slate-900 border-2 border-purple-500/40 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Target Master Score to Reconstruct (Goal)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTargetAudioPlaying ? (
                      <button
                        onClick={handleStopTargetScore}
                        className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>Stop Audio</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePlayTargetScore}
                        disabled={!capstoneTargetCompileResult || capstoneTargetCompileResult.midiNotes.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to Target</span>
                      </button>
                    )}
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      Master Reference
                    </span>
                  </div>
                </div>

                <div className="w-full max-h-[240px] overflow-y-auto overflow-x-auto rounded-xl bg-slate-950 p-4 border border-slate-800 flex justify-center items-center">
                  {capstoneTargetCompileResult && capstoneTargetCompileResult.pages.length > 0 ? (
                    <div
                      className="w-full min-w-[500px] flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[220px]"
                      dangerouslySetInnerHTML={{ __html: capstoneTargetCompileResult.pages[0] }}
                    />
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      Engraving master reference score...
                    </div>
                  )}
                </div>
              </div>

              {/* Dual-Pane Editor & Live SVG Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[420px]">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      LilyPond Code Editor
                    </span>
                    <button
                      onClick={handleGradeCapstoneCode}
                      className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition-all"
                    >
                      Check & Grade Code
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col min-h-[360px]">
                    <LilyPondEditor
                      code={capstoneCode}
                      onChange={(newCode) => {
                        setCapstoneCode(newCode);
                        handleCompileCapstone(newCode);
                      }}
                      onCompile={() => handleCompileCapstone(capstoneCode)}
                      isCompiling={isCompilingCapstone}
                    />
                  </div>
                </div>

                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Engraved Preview
                    </span>
                    <div className="flex items-center gap-2">
                      {isCapstonePlaying ? (
                        <button
                          onClick={handleStopCapstoneScore}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Square className="w-3 h-3 fill-white" /> Stop Audio
                        </button>
                      ) : (
                        <button
                          onClick={handlePlayCapstoneScore}
                          disabled={!capstoneCompileResult || capstoneCompileResult.midiNotes.length === 0}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-white" /> Play Score Audio
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-[360px]">
                    <ScorePreview
                      svgPages={capstoneCompileResult ? capstoneCompileResult.pages : []}
                      logs={capstoneCompileResult ? capstoneCompileResult.logs : []}
                      isPlaying={isCapstonePlaying}
                      onPlayAudio={handlePlayCapstoneScore}
                      onStopAudio={handleStopCapstoneScore}
                    />
                  </div>
                </div>
              </div>

              {/* Quick switch to Step 5B */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setCapstonePhase('perform');
                    audioEngine.playUiSelect();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <span>Ready to play? Switch to Step 5B (Piano Performance)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 5B: Play on Virtual Piano Keyboard (3 Gradual Tiers) */
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                  <p>
                    <strong>Step 5B: Kinesthetic Performance:</strong> Now perform the masterpiece on the virtual keyboard!
                  </p>
                  <p className="text-slate-400">
                    Begin with <strong>Note Sequence</strong> to master the fingerings, then try <strong>Slow Metronome</strong>, and finally master the <strong>Original Tempo</strong>!
                  </p>
                </div>
              </div>

              <TraditionalSightReading
                exercise={capstonePerformanceExercise}
                onComplete={(score) => {
                  setCapstoneUnlocked(true);
                  audioEngine.playSuccessChime();
                }}
              />
            </div>
          )}

          {/* Theoretical Reflection & Analysis Challenge Card */}
          {lesson.capstone && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Score Analysis & Reflection Challenge
                  </h4>
                </div>
                {capstoneUnlocked ? (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Mastered (+50 XP)
                  </span>
                ) : (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Unlocks Lesson Bonus XP
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white">
                {lesson.capstone.reflectionQuestion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.capstone.reflectionOptions.map((opt, idx) => {
                  const isSelected = capstoneReflectionSelected === idx;
                  const isCorrect = idx === lesson.capstone.reflectionAnswer;
                  let cardStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                  if (capstoneReflectionSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      cardStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-200';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-purple-500 bg-purple-500/10 text-purple-200 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCapstoneReflectionSelected(idx);
                        setCapstoneReflectionSubmitted(false);
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

              {/* Reflection Verification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  {capstoneReflectionSubmitted && (
                    <p
                      className={`text-xs font-medium ${
                        capstoneReflectionSelected === lesson.capstone.reflectionAnswer
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {capstoneReflectionSelected === lesson.capstone.reflectionAnswer ? (
                        <span>✨ Correct! <MarkdownView content={lesson.capstone.reflectionExplanation} inline /></span>
                      ) : (
                        `❌ Review the score and theory principles above, or click Reveal Answer.`
                      )}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {!capstoneUnlocked && (
                    <button
                      onClick={() => {
                        setCapstoneReflectionSelected(lesson.capstone.reflectionAnswer);
                        setCapstoneReflectionSubmitted(true);
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
                      setCapstoneReflectionSubmitted(true);
                      if (capstoneReflectionSelected === lesson.capstone.reflectionAnswer) {
                        setCapstoneUnlocked(true);
                        audioEngine.playSuccessChime();
                        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
                      } else {
                        audioEngine.playErrorBuzz();
                      }
                    }}
                    disabled={capstoneReflectionSelected === null}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-purple-600/20"
                  >
                    Verify Analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Final Lesson Completion Button */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => handleStageChange(4)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to Reconstruction
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
