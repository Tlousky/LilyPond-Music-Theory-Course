import React, { useState, useEffect } from 'react';
import { REPERTOIRE_PIECES, RepertoirePiece } from '../../data/curriculumData';
import { LilyPondEditor } from '../editor/LilyPondEditor';
import { ScorePreview } from '../score/ScorePreview';
import { lilypondCompiler, CompileResult } from '../../lib/lilypond/LilyPondWasmCompiler';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { Music, Calendar, Award } from 'lucide-react';

export const RepertoireBrowser: React.FC = () => {
  const pieces = Object.values(REPERTOIRE_PIECES);
  const [selectedPiece, setSelectedPiece] = useState<RepertoirePiece>(pieces[0]);
  const [pieceCode, setPieceCode] = useState<string>(pieces[0].code);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setPieceCode(selectedPiece.code);
    runCompile(selectedPiece.code);
  }, [selectedPiece.id]);

  const runCompile = async (code: string) => {
    setIsCompiling(true);
    const result = await lilypondCompiler.compile(code);
    setCompileResult(result);
    setIsCompiling(false);
  };

  const handlePlayAudio = () => {
    if (!compileResult || compileResult.midiNotes.length === 0) return;
    setIsPlaying(true);

    let offset = 0;
    compileResult.midiNotes.forEach((note) => {
      setTimeout(() => {
        audioEngine.playNote(note.midi, 0.7);
      }, offset * 400);
      offset += 1;
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, (offset + 1) * 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Music className="w-3.5 h-3.5" />
          Authentic Classical Scores
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Classical Repertoire Library
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore, edit, and engrave authentic Baroque and Classical compositions from Mutopia and BaroqueMusic archives.
        </p>
      </div>

      {/* Piece Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {pieces.map((piece) => {
          const isSelected = selectedPiece.id === piece.id;
          return (
            <button
              key={piece.id}
              onClick={() => setSelectedPiece(piece)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400">
                  {piece.era}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Calendar className="w-3 h-3" />
                  {piece.year}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{piece.title}</h3>
              <p className="text-xs text-slate-400">{piece.composer}</p>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                <span>Key: {piece.key}</span>
                <span>•</span>
                <span>Meter: {piece.meter}</span>
                <span className="ml-auto flex items-center gap-1 text-amber-400">
                  <Award className="w-3 h-3" /> Level {piece.difficulty}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dual-Pane Editor & Score Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <LilyPondEditor
          code={pieceCode}
          onChange={(newCode) => {
            setPieceCode(newCode);
            runCompile(newCode);
          }}
          onCompile={() => runCompile(pieceCode)}
          isCompiling={isCompiling}
        />

        <ScorePreview
          svgPages={compileResult ? compileResult.pages : []}
          logs={compileResult ? compileResult.logs : []}
          isPlaying={isPlaying}
          onPlayAudio={handlePlayAudio}
          onStopAudio={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};
