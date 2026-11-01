import React, { useState, useEffect } from 'react';
import { audioEngine, midiToPitchName } from '../../lib/audio/SoundFontAudioEngine';
import { Piano, Usb, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface VirtualPianoProps {
  onNotePlay?: (noteName: string, lilySyntax: string, midi: number) => void;
  highlightedMidi?: number | null;
}

interface PianoKeyDef {
  midi: number;
  noteName: string;
  isBlack: boolean;
  lilySyntax: string;
  keyChar?: string;
}

export const VirtualPiano: React.FC<VirtualPianoProps> = ({
  onNotePlay,
  highlightedMidi,
}) => {
  const [activeMidi, setActiveMidi] = useState<number | null>(null);
  const [usbMidiConnected, setUsbMidiConnected] = useState<boolean>(false);
  const [showLilyHints, setShowLilyHints] = useState<boolean>(true);
  const [octaveShift, setOctaveShift] = useState<number>(0); // -1: C2-C4, 0: C3-C5, 1: C4-C6

  // Auto-shift octave if highlightedMidi is outside current view
  useEffect(() => {
    if (highlightedMidi !== null && highlightedMidi !== undefined) {
      if (highlightedMidi < 48 && octaveShift !== -1) {
        setOctaveShift(-1);
      } else if (highlightedMidi > 72 && octaveShift !== 1) {
        setOctaveShift(1);
      } else if (highlightedMidi >= 48 && highlightedMidi <= 72 && octaveShift !== 0) {
        setOctaveShift(0);
      }
    }
  }, [highlightedMidi]);

  const baseMidi = 48 + octaveShift * 12; // 36 (C2), 48 (C3), 60 (C4)
  const endMidi = baseMidi + 24;          // 2 octaves range

  const keyChars = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';'];

  const getLilySyntax = (midi: number): string => {
    const pitchMap: Record<number, string> = {
      0: 'c', 1: 'cis', 2: 'd', 3: 'ees', 4: 'e', 5: 'f',
      6: 'fis', 7: 'g', 8: 'aes', 9: 'a', 10: 'bes', 11: 'b'
    };
    const semitone = midi % 12;
    const baseName = pitchMap[semitone] || 'c';
    const octave = Math.floor(midi / 12) - 1; // 60 is C4 -> octave 4
    if (octave === 3) return baseName; // c (small octave)
    if (octave === 2) return `${baseName},`;
    if (octave === 1) return `${baseName},,`;
    if (octave === 4) return `${baseName}'`;
    if (octave === 5) return `${baseName}''`;
    if (octave === 6) return `${baseName}'''`;
    return baseName;
  };

  const keys: PianoKeyDef[] = [];
  let charIdx = 0;
  for (let midi = baseMidi; midi <= endMidi; midi++) {
    const semitone = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(semitone);
    keys.push({
      midi,
      noteName: midiToPitchName(midi),
      isBlack,
      lilySyntax: getLilySyntax(midi),
      keyChar: charIdx < keyChars.length ? keyChars[charIdx++] : undefined,
    });
  }

  // Handle USB MIDI connection
  useEffect(() => {
    let mounted = true;
    audioEngine.initWebMidi().then((connected) => {
      if (mounted) setUsbMidiConnected(connected);
    });

    const midiHandler = (midi: number) => {
      setActiveMidi(midi);
      setTimeout(() => setActiveMidi(null), 250);
      const k = keys.find((key) => key.midi === midi);
      if (onNotePlay) {
        onNotePlay(k ? k.noteName : midiToPitchName(midi), k ? k.lilySyntax : getLilySyntax(midi), midi);
      }
    };

    audioEngine.addMidiListener(midiHandler);
    return () => {
      mounted = false;
      audioEngine.removeMidiListener(midiHandler);
    };
  }, [baseMidi]);

  // Computer keyboard bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if ((e.target as HTMLElement).closest('.monaco-editor')) return;

      const matchedKey = keys.find((k) => k.keyChar?.toLowerCase() === e.key.toLowerCase());
      if (matchedKey && !e.repeat) {
        playKey(matchedKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys]);

  const playKey = (k: PianoKeyDef) => {
    audioEngine.playNote(k.midi, 0.8);
    setActiveMidi(k.midi);
    setTimeout(() => setActiveMidi(null), 300);
    if (onNotePlay) {
      onNotePlay(k.noteName, k.lilySyntax, k.midi);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Piano className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Interactive Piano & LilyPond Pitch Mapper
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Octave Shifter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setOctaveShift(Math.max(-1, octaveShift - 1))}
              disabled={octaveShift <= -1}
              title="Shift Octave Down (8vb)"
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-indigo-300">
              {octaveShift === -1 ? 'C2–C4' : octaveShift === 1 ? 'C4–C6' : 'C3–C5'}
            </span>
            <button
              onClick={() => setOctaveShift(Math.min(1, octaveShift + 1))}
              disabled={octaveShift >= 1}
              title="Shift Octave Up (8va)"
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* LilyPond Hints Toggle */}
          <button
            onClick={() => setShowLilyHints(!showLilyHints)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              showLilyHints
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Syntax Hints</span>
          </button>

          {/* USB MIDI Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              usbMidiConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>{usbMidiConnected ? 'USB MIDI Connected' : 'Web MIDI'}</span>
          </div>
        </div>
      </div>

      {/* Piano Keys Container */}
      <div className="relative flex justify-center overflow-x-auto py-2 select-none">
        <div className="relative flex h-36 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-2xl">
          {keys.map((k) => {
            const isPressed = activeMidi === k.midi || highlightedMidi === k.midi;
            const isMiddleC = k.midi === 60;

            if (k.isBlack) {
              return (
                <button
                  key={k.midi}
                  onClick={() => playKey(k)}
                  className={`absolute z-10 w-7 h-22 rounded-b-md transition-all flex flex-col justify-between items-center pb-1.5 pt-1 ${
                    isPressed
                      ? 'bg-indigo-600 shadow-lg shadow-indigo-500/50 scale-[0.98] ring-2 ring-indigo-300'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-900 shadow-md'
                  }`}
                  style={{
                    left: `${getBlackKeyLeftOffset(k.midi, baseMidi)}px`,
                  }}
                  title={`${k.noteName} (LilyPond: ${k.lilySyntax})`}
                >
                  <span className="text-[9px] font-mono font-bold text-slate-300 uppercase">
                    {k.keyChar}
                  </span>
                  {showLilyHints && (
                    <span className="text-[9px] font-mono text-indigo-300 font-bold bg-slate-950/80 px-1 rounded">
                      {k.lilySyntax}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={k.midi}
                onClick={() => playKey(k)}
                className={`relative w-10 h-32 rounded-b-lg border-x border-b transition-all flex flex-col justify-between items-center pb-2 pt-1 ${
                  isPressed
                    ? 'bg-indigo-200 border-indigo-500 shadow-inner ring-2 ring-indigo-400'
                    : isMiddleC
                    ? 'bg-amber-50/95 hover:bg-white border-amber-300/80 text-slate-900'
                    : 'bg-slate-100 hover:bg-white border-slate-300 text-slate-900'
                }`}
                title={`${k.noteName} ${isMiddleC ? '(Middle C)' : ''} (LilyPond: ${k.lilySyntax})`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {k.keyChar?.toUpperCase()}
                </span>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-extrabold text-slate-800 tracking-tight">
                    {k.noteName}
                  </span>
                  {showLilyHints && (
                    <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100/80 px-1 rounded mt-0.5">
                      {k.lilySyntax}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 px-1">
        <span>{midiToPitchName(baseMidi)} (Low)</span>
        <span className="text-amber-400 font-semibold">● C4 (Middle C)</span>
        <span>{midiToPitchName(endMidi)} (High)</span>
      </div>
    </div>
  );
};

// Computes pixel left coordinate for black keys relative to baseMidi
function getBlackKeyLeftOffset(midi: number, baseMidi: number = 48): number {
  const whiteKeyWidth = 40;
  const padding = 6;
  let whiteKeysBefore = 0;
  for (let m = baseMidi; m < midi; m++) {
    const s = m % 12;
    if (![1, 3, 6, 8, 10].includes(s)) {
      whiteKeysBefore++;
    }
  }
  return padding + whiteKeysBefore * whiteKeyWidth - 14;
}
