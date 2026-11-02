import React, { useRef } from 'react';
import { Volume2, Square, Sparkles, Terminal } from 'lucide-react';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';

interface ScorePreviewProps {
  svgPages: string[];
  logs: string[];
  isPlaying: boolean;
  onPlayAudio: () => void;
  onStopAudio: () => void;
  onNoteClick?: (line: number, col: number) => void;
}

export const ScorePreview: React.FC<ScorePreviewProps> = ({
  svgPages,
  logs,
  isPlaying,
  onPlayAudio,
  onStopAudio,
  onNoteClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as Element).closest('a[href^="textedit:"], a[*|href^="textedit:"], .interactive-note');
    if (target) {
      e.preventDefault();

      const href = target.getAttribute('href') || target.getAttribute('xlink:href') || '';
      const lineColMatch = href.match(/:(\d+):(\d+)/);
      if (lineColMatch && onNoteClick) {
        onNoteClick(parseInt(lineColMatch[1], 10), parseInt(lineColMatch[2], 10));
      } else if (onNoteClick) {
        const line = parseInt(target.getAttribute('data-line') || '1', 10);
        const col = parseInt(target.getAttribute('data-col') || '1', 10);
        onNoteClick(line, col);
      }

      // Play note pitch immediately via Web Audio engine
      const midiAttr = target.getAttribute('data-midi');
      const pitchAttr = target.getAttribute('data-pitch');
      if (midiAttr) {
        const midi = parseInt(midiAttr, 10);
        if (!isNaN(midi)) {
          audioEngine.playNote(midi, 0.7);
        }
      } else if (pitchAttr) {
        audioEngine.playNote(pitchAttr, 0.7);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-[360px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Engraved Sheet Music Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              Stop Playback
            </button>
          ) : (
            <button
              onClick={onPlayAudio}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Listen (MIDI)
            </button>
          )}
        </div>
      </div>

      {/* SVG Score Display */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center score-container min-h-[280px] bg-slate-900/40"
      >
        {svgPages.length > 0 ? (
          svgPages.map((pageSvg, idx) => (
            <div
              key={idx}
              className="w-full max-w-2xl bg-slate-900 rounded-lg p-3 shadow-inner border border-slate-800/80 flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[300px]"
              dangerouslySetInnerHTML={{ __html: pageSvg }}
            />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            <p className="font-semibold text-slate-400">Score preview ready</p>
            <p className="text-xs text-slate-500 mt-1">Click "Run Score" or edit code to compile.</p>
          </div>
        )}
      </div>

      {/* Compiler Console Logs */}
      {logs.length > 0 && (
        <div className="bg-slate-950 border-t border-slate-800/80 px-3 py-2 text-xs font-mono text-slate-400 max-h-24 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1 font-semibold uppercase">
            <Terminal className="w-3 h-3" />
            <span>Engraver Output</span>
          </div>
          {logs.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed text-[11px] ${
                log.includes('error')
                  ? 'text-rose-400 font-bold'
                  : log.includes('warning')
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
