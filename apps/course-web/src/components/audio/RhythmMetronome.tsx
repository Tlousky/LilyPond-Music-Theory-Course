import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { Play, Square, Activity, Target } from 'lucide-react';

interface RhythmMetronomeProps {
  onTapAccuracy?: (score: number) => void;
}

export const RhythmMetronome: React.FC<RhythmMetronomeProps> = ({ onTapAccuracy }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(100);
  const [beat, setBeat] = useState<number>(0);
  const [lastTapFeedback, setLastTapFeedback] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const beatRef = useRef<number>(0);
  const lastBeatTimeRef = useRef<number>(0);

  const intervalMs = (60 / bpm) * 1000;

  useEffect(() => {
    if (isPlaying) {
      beatRef.current = 0;
      lastBeatTimeRef.current = performance.now();

      timerRef.current = window.setInterval(() => {
        beatRef.current = (beatRef.current % 4) + 1;
        setBeat(beatRef.current);
        lastBeatTimeRef.current = performance.now();

        // Accent on beat 1 (velocity 1.0 vs 0.6)
        const vel = beatRef.current === 1 ? 1.0 : 0.6;
        audioEngine.playNote(beatRef.current === 1 ? 84 : 76, 0.05, 'metronome', vel);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBeat(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  // Rhythm Spacebar / Button Tapper
  const handleTap = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    const now = performance.now();
    const timeSinceLastBeat = now - lastBeatTimeRef.current;
    const timeToNextBeat = intervalMs - timeSinceLastBeat;

    const delta = timeSinceLastBeat < timeToNextBeat ? timeSinceLastBeat : -timeToNextBeat;
    const absDelta = Math.abs(delta);

    if (absDelta <= 65) {
      setLastTapFeedback('🎯 Perfect! In time');
      if (onTapAccuracy) onTapAccuracy(100);
    } else if (absDelta <= 130) {
      setLastTapFeedback(delta > 0 ? '⏩ Slightly Late' : '⏪ Slightly Early');
      if (onTapAccuracy) onTapAccuracy(80);
    } else {
      setLastTapFeedback('❌ Off-beat. Lock into the pulse!');
      if (onTapAccuracy) onTapAccuracy(40);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Interactive Metronome & Rhythm Tapper
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            {isPlaying ? 'Stop' : 'Start Pulse'}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        {/* Tempo Slider */}
        <div className="w-full sm:w-1/2 flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 min-w-[60px]">
            {bpm} BPM
          </span>
          <input
            type="range"
            min={50}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* 4-Beat Visual Pulser */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((b) => (
            <div
              key={b}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-100 ${
                beat === b
                  ? b === 1
                    ? 'bg-amber-400 text-slate-950 scale-125 shadow-lg shadow-amber-400/50'
                    : 'bg-indigo-500 text-white scale-110 shadow-md shadow-indigo-500/40'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Tap Pad */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
        <button
          onClick={handleTap}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 active:scale-[0.99] border border-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all shadow-inner flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4 text-amber-400" />
          <span>Tap Rhythm (Click or Spacebar)</span>
        </button>

        {lastTapFeedback && (
          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-bold text-indigo-300">
            {lastTapFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
