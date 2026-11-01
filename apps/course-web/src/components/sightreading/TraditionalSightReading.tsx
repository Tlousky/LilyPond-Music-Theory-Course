import React, { useState, useEffect, useRef } from 'react';
import { SightReadingExercise } from '../../data/sightReadingData';
import { lilypondCompiler, CompileResult, MidiNote } from '../../lib/lilypond/LilyPondWasmCompiler';
import { audioEngine, midiToPitchName } from '../../lib/audio/SoundFontAudioEngine';
import { VirtualPiano } from '../audio/VirtualPiano';
import confetti from 'canvas-confetti';
import {
  Piano,
  Play,
  Square,
  Volume2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Activity,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export type PracticeMode = 'sequence' | 'slow_metronome' | 'original_tempo';

interface TraditionalSightReadingProps {
  exercise: SightReadingExercise;
  onComplete?: (score: number) => void;
  onBack?: () => void;
  onNextExercise?: () => void;
}

export const TraditionalSightReading: React.FC<TraditionalSightReadingProps> = ({
  exercise,
  onComplete,
  onBack,
  onNextExercise,
}) => {
  const [mode, setMode] = useState<PracticeMode>('sequence');
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [targetNotes, setTargetNotes] = useState<MidiNote[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [notesStatus, setNotesStatus] = useState<('pending' | 'correct' | 'wrong')[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [highlightKey, setHighlightKey] = useState<boolean>(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [isMetronomeRunning, setIsMetronomeRunning] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [showTips, setShowTips] = useState<boolean>(false);

  const metronomeTimerRef = useRef<number | null>(null);
  const previewTimersRef = useRef<number[]>([]);
  const stopScorePlaybackRef = useRef<(() => void) | null>(null);
  const beatTimeRef = useRef<number>(0);
  const metronomeBeatRef = useRef<number>(1);

  // Compile target LilyPond code
  useEffect(() => {
    resetExercise();
    lilypondCompiler.compile(exercise.targetCode).then((res) => {
      setCompileResult(res);
      setTargetNotes(res.midiNotes);
      setNotesStatus(new Array(res.midiNotes.length).fill('pending'));
    });

    return () => {
      stopAllAudio();
    };
  }, [exercise.id]);

  const stopAllAudio = () => {
    stopScorePlaybackRef.current?.();
    stopScorePlaybackRef.current = null;
    previewTimersRef.current.forEach((t) => clearTimeout(t));
    previewTimersRef.current = [];
    if (metronomeTimerRef.current) {
      clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
    }
    setIsPreviewPlaying(false);
    setIsMetronomeRunning(false);
  };

  const resetExercise = () => {
    stopAllAudio();
    setCurrentIndex(0);
    setMistakes(0);
    setIsCompleted(false);
    setFeedback(null);
    setCurrentBeat(1);
    metronomeBeatRef.current = 1;
    if (targetNotes.length > 0) {
      setNotesStatus(new Array(targetNotes.length).fill('pending'));
    }
  };

  // Switch practice mode
  const handleSelectMode = (newMode: PracticeMode) => {
    audioEngine.playUiSelect();
    setMode(newMode);
    resetExercise();
  };

  // Preview melody audio
  const handlePreviewMelody = () => {
    if (isPreviewPlaying) {
      stopAllAudio();
      return;
    }
    if (targetNotes.length === 0) return;

    stopAllAudio();
    setIsPreviewPlaying(true);

    const currentBpm = mode === 'slow_metronome' ? exercise.slowBpm : exercise.tempoBpm;
    stopScorePlaybackRef.current = audioEngine.playScore(targetNotes, {
      bpm: currentBpm || 80,
      onComplete: () => setIsPreviewPlaying(false),
    });
  };

  // Metronome modes timing logic
  const currentBpm = mode === 'slow_metronome' ? exercise.slowBpm : exercise.tempoBpm;
  const intervalMs = (60 / currentBpm) * 1000;

  const handleToggleMetronomePractice = () => {
    if (isMetronomeRunning) {
      stopAllAudio();
      return;
    }

    resetExercise();
    setIsMetronomeRunning(true);
    metronomeBeatRef.current = 1;
    beatTimeRef.current = performance.now();

    // Play initial beat
    audioEngine.playMetronomeBeat(true, 1.0);

    metronomeTimerRef.current = window.setInterval(() => {
      metronomeBeatRef.current = (metronomeBeatRef.current % 4) + 1;
      setCurrentBeat(metronomeBeatRef.current);
      beatTimeRef.current = performance.now();

      const isDownbeat = metronomeBeatRef.current === 1;
      audioEngine.playMetronomeBeat(isDownbeat, isDownbeat ? 1.0 : 0.75);
    }, intervalMs);
  };

  // Called when user plays note on VirtualPiano, Keyboard or USB MIDI
  const handleNotePlay = (noteName: string, lilySyntax: string, playedMidi: number) => {
    if (isCompleted || targetNotes.length === 0) return;

    const target = targetNotes[currentIndex];
    if (!target) return;

    if (mode === 'sequence') {
      if (playedMidi === target.midi) {
        // Correct note
        audioEngine.playUiSelect();
        const nextStatus = [...notesStatus];
        nextStatus[currentIndex] = 'correct';
        setNotesStatus(nextStatus);
        setFeedback(`✨ Great! ${target.pitch} is correct.`);

        if (currentIndex + 1 >= targetNotes.length) {
          handleSuccess();
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        // Wrong note
        audioEngine.playErrorBuzz();
        const nextStatus = [...notesStatus];
        nextStatus[currentIndex] = 'wrong';
        setNotesStatus(nextStatus);
        setMistakes((m) => m + 1);

        const expName = target.pitch;
        const playedNoteName = midiToPitchName(playedMidi);
        setFeedback(`❌ Played ${playedNoteName}, expected ${expName}. Try again!`);
      }
    } else {
      // Timed Metronome modes
      const now = performance.now();
      const delta = Math.abs(now - beatTimeRef.current);
      const isPitchMatch = playedMidi === target.midi;

      if (isPitchMatch) {
        audioEngine.playUiSelect();
        const nextStatus = [...notesStatus];
        nextStatus[currentIndex] = 'correct';
        setNotesStatus(nextStatus);

        if (delta <= 130) {
          setFeedback(`🎯 Perfect in-time! ${target.pitch}`);
        } else {
          setFeedback(`👍 Good note! ${target.pitch} (Slightly off-beat)`);
        }

        if (currentIndex + 1 >= targetNotes.length) {
          handleSuccess();
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        audioEngine.playErrorBuzz();
        setMistakes((m) => m + 1);
        setFeedback(`❌ Wrong pitch! Expected ${target.pitch}, played ${midiToPitchName(playedMidi)}.`);
      }
    }
  };

  const handleSuccess = () => {
    setIsCompleted(true);
    stopAllAudio();
    audioEngine.playCompletionFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const finalScore = Math.max(50, 100 - mistakes * 10);
    if (onComplete) {
      onComplete(finalScore);
    }
  };

  const activeTargetNote = targetNotes[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Mode Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Piano className="w-4 h-4" />
              <span>Sight Reading · Traditional Score to Keyboard</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {exercise.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {exercise.description} · Key: <strong className="text-slate-300">{exercise.key}</strong> · Meter: <strong className="text-slate-300">{exercise.meter}</strong>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewMelody}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                isPreviewPlaying
                  ? 'bg-rose-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPreviewPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPreviewPlaying ? 'Stop' : 'Listen First'}</span>
            </button>

            <button
              onClick={resetExercise}
              title="Reset Practice"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Gradual Practice Modes */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleSelectMode('sequence')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'sequence'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Sequence Only (Untimed)
            </button>

            <button
              onClick={() => handleSelectMode('slow_metronome')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'slow_metronome'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Slow Metronome ({exercise.slowBpm} BPM)
            </button>

            <button
              onClick={() => handleSelectMode('original_tempo')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'original_tempo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Original Tempo ({exercise.tempoBpm} BPM)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightKey(!highlightKey)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                highlightKey
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {highlightKey ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Piano Guide</span>
            </button>

            <button
              onClick={() => setShowTips(!showTips)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Theory Tips</span>
            </button>
          </div>
        </div>

        {/* Theory Tips Accordion */}
        {showTips && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
              Sight Reading Memory Aids:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {exercise.theoryTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Engraved Target Score View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sheet Music Score
            </span>
            {mode !== 'sequence' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono">
                <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
                Beat {currentBeat}/4 ({currentBpm} BPM)
              </span>
            )}
          </div>

          {/* Progress Notes Chips */}
          <div className="flex items-center gap-1.5">
            {targetNotes.map((note, idx) => {
              const status = notesStatus[idx];
              const isCurrent = idx === currentIndex && !isCompleted;
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                    status === 'correct'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : status === 'wrong'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50 scale-110 animate-bounce'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG Notation Container */}
        <div className="w-full max-h-[300px] overflow-y-auto overflow-x-auto rounded-xl bg-slate-950 p-4 border border-slate-800">
          {compileResult && compileResult.pages.length > 0 ? (
            <div
              className="w-full flex justify-center min-w-[500px]"
              dangerouslySetInnerHTML={{ __html: compileResult.pages[0] }}
            />
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              Rendering notation score...
            </div>
          )}
        </div>

        {/* Active Note Target Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Target Note:</span>
            {activeTargetNote && !isCompleted ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-sm font-bold rounded-lg">
                <span>{activeTargetNote.pitch}</span>
                <span className="text-xs text-slate-400 font-sans">
                  (Note {currentIndex + 1} of {targetNotes.length})
                </span>
              </span>
            ) : isCompleted ? (
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Exercise Complete!
              </span>
            ) : (
              <span className="text-slate-500 text-xs">Loading notes...</span>
            )}
          </div>

          {/* Feedback banner */}
          {feedback && (
            <p className="text-xs font-semibold text-slate-200">
              {feedback}
            </p>
          )}

          {/* Metronome Play/Stop Toggle in timed modes */}
          {mode !== 'sequence' && (
            <button
              onClick={handleToggleMetronomePractice}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all self-end sm:self-auto ${
                isMetronomeRunning
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isMetronomeRunning ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isMetronomeRunning ? 'Stop Metronome' : 'Start Pulse'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">
                Sight Reading Mastered!
              </h4>
              <p className="text-xs text-emerald-300">
                Score: {Math.max(50, 100 - mistakes * 10)}% · Mistakes: {mistakes} · Awarded +30 XP!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetExercise}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              Practice Again
            </button>

            {onNextExercise && (
              <button
                onClick={onNextExercise}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Next Exercise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Virtual Piano Keyboard */}
      <div>
        <VirtualPiano
          onNotePlay={handleNotePlay}
          highlightedMidi={highlightKey && activeTargetNote && !isCompleted ? activeTargetNote.midi : null}
        />
      </div>
    </div>
  );
};
