import React, { useState, useEffect } from 'react';
import { audioEngine, midiToPitchName } from '../../lib/audio/SoundFontAudioEngine';
import { Piano, Usb, Info } from 'lucide-react';

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

  // Generate 2 octaves: C3 (48) to C5 (72)
  const keys: PianoKeyDef[] = [];
  const keyChars = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';'];

  const lilyMap: Record<number, string> = {
    48: 'c,', 49: 'cis,', 50: 'd,', 51: 'ees,', 52: 'e,', 53: 'f,',
    54: 'fis,', 55: 'g,', 56: 'aes,', 57: 'a,', 58: 'bes,', 59: 'b,',
    60: "c'", 61: "cis'", 62: "d'", 63: "ees'", 64: "e'", 65: "f'",
    66: "fis'", 67: "g'", 68: "aes'", 69: "a'", 70: "bes'", 71: "b'",
    72: "c''"
  };

  let charIdx = 0;
  for (let midi = 48; midi <= 72; midi++) {
    const semitone = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(semitone);
    keys.push({
      midi,
      noteName: midiToPitchName(midi),
      isBlack,
      lilySyntax: lilyMap[midi] || "c'",
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
      if (k && onNotePlay) {
        onNotePlay(k.noteName, k.lilySyntax, k.midi);
      }
    };

    audioEngine.addMidiListener(midiHandler);
    return () => {
      mounted = false;
      audioEngine.removeMidiListener(midiHandler);
    };
  }, []);

  // Computer keyboard bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in Monaco editor or input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if ((e.target as HTMLElement).closest('.monaco-editor')) return;

      const matchedKey = keys.find((k) => k.keyChar?.toLowerCase() === e.key.toLowerCase());
      if (matchedKey && !e.repeat) {
        playKey(matchedKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        <div className="flex items-center gap-3">
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
            <span>LilyPond Syntax Hints</span>
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
            <span>{usbMidiConnected ? 'USB MIDI Connected' : 'Web MIDI Ready'}</span>
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
                      ? 'bg-indigo-600 shadow-lg shadow-indigo-500/50 scale-[0.98]'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-900 shadow-md'
                  }`}
                  style={{
                    left: `${getBlackKeyLeftOffset(k.midi)}px`,
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
                    ? 'bg-indigo-100 border-indigo-400 shadow-inner'
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
        <span>C3 (Bass Clef)</span>
        <span className="text-amber-400 font-semibold">● C4 (Middle C)</span>
        <span>C5 (Treble Clef)</span>
      </div>
    </div>
  );
};

// Computes pixel left coordinate for black keys
function getBlackKeyLeftOffset(midi: number): number {
  const whiteKeyWidth = 40;
  const padding = 6;
  const whiteKeyIndices: Record<number, number> = {
    49: 1,  // C#3 after C3
    51: 2,  // D#3 after D3
    54: 4,  // F#3 after F3
    56: 5,  // G#3 after G3
    58: 6,  // A#3 after A3
    61: 8,  // C#4 after C4
    63: 9,  // D#4 after D4
    66: 11, // F#4 after F4
    68: 12, // G#4 after G4
    70: 13, // A#4 after A4
  };
  const index = whiteKeyIndices[midi] || 1;
  return padding + index * whiteKeyWidth - 14;
}
