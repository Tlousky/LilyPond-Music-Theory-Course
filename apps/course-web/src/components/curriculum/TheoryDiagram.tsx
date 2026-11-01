import React, { useState } from 'react';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { Volume2, Sparkles, Music, HelpCircle } from 'lucide-react';

export type TheoryDiagramType =
  | 'treble_lines_spaces'
  | 'bass_lines_spaces'
  | 'grand_staff_middle_c'
  | 'keyboard_landmarks'
  | 'half_whole_steps'
  | 'rhythm_subdivision'
  | 'major_scale_steps';

interface TheoryDiagramProps {
  type: TheoryDiagramType;
}

export const TheoryDiagram: React.FC<TheoryDiagramProps> = ({ type }) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playNote = (midi: number, name: string) => {
    setActiveNote(name);
    audioEngine.playNote(midi, 0.8, 'piano');
    setTimeout(() => setActiveNote(null), 800);
  };

  const playScale = (midiNotes: number[]) => {
    midiNotes.forEach((midi, idx) => {
      setTimeout(() => {
        audioEngine.playNote(midi, 0.5, 'piano');
      }, idx * 350);
    });
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 my-4 shadow-inner">
      {/* 1. TREBLE CLEF LINES AND SPACES */}
      {type === 'treble_lines_spaces' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-400" />
                Treble Clef (G-Clef) Lines & Spaces Breakdown
              </h4>
              <p className="text-xs text-slate-400">
                Staff lines and spaces are <strong>always counted from bottom to top (1 to 5)</strong>. Click any note to listen!
              </p>
            </div>
            <div className="text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              Loops around <strong>Line 2 = G4</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5 Lines: E G B D F */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  The 5 Staff Lines (Bottom to Top)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Lines 1 - 5</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-3">
                Mnemonic: <strong className="text-amber-300 font-bold">E</strong>very <strong className="text-amber-300 font-bold">G</strong>ood <strong className="text-amber-300 font-bold">B</strong>ird <strong className="text-amber-300 font-bold">D</strong>oes <strong className="text-amber-300 font-bold">F</strong>ly
              </p>

              {/* Interactive Visual Staff for Lines */}
              <div className="relative h-32 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-around px-4">
                {/* 5 horizontal staff lines */}
                {[20, 38, 56, 74, 92].map((topPercent, i) => (
                  <div
                    key={i}
                    style={{ top: `${topPercent}%` }}
                    className="absolute left-0 right-0 h-[1.5px] bg-slate-600 pointer-events-none"
                  >
                    <span className="absolute -left-1 -top-2.5 text-[9px] text-slate-500 font-mono">
                      L{5 - i}
                    </span>
                  </div>
                ))}

                {/* Line notes: E4 (L1: 92%), G4 (L2: 74%), B4 (L3: 56%), D5 (L4: 38%), F5 (L5: 20%) */}
                {[
                  { name: 'E4', line: 'Line 1', midi: 64, top: '92%', word: 'Every' },
                  { name: 'G4', line: 'Line 2', midi: 67, top: '74%', word: 'Good' },
                  { name: 'B4', line: 'Line 3', midi: 71, top: '56%', word: 'Bird' },
                  { name: 'D5', line: 'Line 4', midi: 74, top: '38%', word: 'Does' },
                  { name: 'F5', line: 'Line 5', midi: 77, top: '20%', word: 'Fly' },
                ].map((note) => (
                  <button
                    key={note.name}
                    onClick={() => playNote(note.midi, note.name)}
                    style={{ top: note.top }}
                    className={`absolute -translate-y-1/2 flex flex-col items-center group transition-transform ${
                      activeNote === note.name ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-7 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                        activeNote === note.name
                          ? 'bg-amber-400 text-slate-950 border-white'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-500/40'
                      }`}
                    >
                      {note.name[0]}
                    </div>
                    <span className="text-[10px] text-amber-200/80 font-medium mt-1">
                      {note.word}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Spaces: F A C E */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  The 4 Staff Spaces (Bottom to Top)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Spaces 1 - 4</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-3">
                Mnemonic: Spells the word <strong className="text-teal-300 font-bold uppercase tracking-widest text-sm">F A C E</strong>
              </p>

              {/* Interactive Visual Staff for Spaces */}
              <div className="relative h-32 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-around px-4">
                {/* 5 horizontal staff lines */}
                {[20, 38, 56, 74, 92].map((topPercent, i) => (
                  <div
                    key={i}
                    style={{ top: `${topPercent}%` }}
                    className="absolute left-0 right-0 h-[1.5px] bg-slate-600 pointer-events-none"
                  />
                ))}

                {/* Space notes: F4 (S1: 83%), A4 (S2: 65%), C5 (S3: 47%), E5 (S4: 29%) */}
                {[
                  { name: 'F4', space: 'Space 1', midi: 65, top: '83%', letter: 'F' },
                  { name: 'A4', space: 'Space 2', midi: 69, top: '65%', letter: 'A' },
                  { name: 'C5', space: 'Space 3', midi: 72, top: '47%', letter: 'C' },
                  { name: 'E5', space: 'Space 4', midi: 76, top: '29%', letter: 'E' },
                ].map((note) => (
                  <button
                    key={note.name}
                    onClick={() => playNote(note.midi, note.name)}
                    style={{ top: note.top }}
                    className={`absolute -translate-y-1/2 flex flex-col items-center group transition-transform ${
                      activeNote === note.name ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-7 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                        activeNote === note.name
                          ? 'bg-teal-400 text-slate-950 border-white'
                          : 'bg-teal-500/20 text-teal-300 border-teal-400/60 hover:bg-teal-500/40'
                      }`}
                    >
                      {note.letter}
                    </div>
                    <span className="text-[10px] text-teal-200/80 font-medium mt-1">
                      {note.space}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BASS CLEF LINES AND SPACES */}
      {type === 'bass_lines_spaces' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-400" />
                Bass Clef (F-Clef) Lines & Spaces Breakdown
              </h4>
              <p className="text-xs text-slate-400">
                The Bass Clef's two dots surround <strong>Line 4 = F3</strong>. Note pitches are lower than Treble Clef.
              </p>
            </div>
            <div className="text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              Dots surround <strong>Line 4 = F3</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5 Lines: G B D F A */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  The 5 Bass Lines (Bottom to Top)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Lines 1 - 5</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-3">
                Mnemonic: <strong className="text-emerald-300 font-bold">G</strong>ood <strong className="text-emerald-300 font-bold">B</strong>ikes <strong className="text-emerald-300 font-bold">D</strong>on't <strong className="text-emerald-300 font-bold">F</strong>all <strong className="text-emerald-300 font-bold">A</strong>part
              </p>

              <div className="relative h-32 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-around px-4">
                {[20, 38, 56, 74, 92].map((topPercent, i) => (
                  <div
                    key={i}
                    style={{ top: `${topPercent}%` }}
                    className="absolute left-0 right-0 h-[1.5px] bg-slate-600 pointer-events-none"
                  >
                    <span className="absolute -left-1 -top-2.5 text-[9px] text-slate-500 font-mono">
                      L{5 - i}
                    </span>
                  </div>
                ))}

                {[
                  { name: 'G2', line: 'Line 1', midi: 43, top: '92%', word: 'Good' },
                  { name: 'B2', line: 'Line 2', midi: 47, top: '74%', word: 'Bikes' },
                  { name: 'D3', line: 'Line 3', midi: 50, top: '56%', word: "Don't" },
                  { name: 'F3', line: 'Line 4', midi: 53, top: '38%', word: 'Fall' },
                  { name: 'A3', line: 'Line 5', midi: 57, top: '20%', word: 'Apart' },
                ].map((note) => (
                  <button
                    key={note.name}
                    onClick={() => playNote(note.midi, note.name)}
                    style={{ top: note.top }}
                    className={`absolute -translate-y-1/2 flex flex-col items-center group transition-transform ${
                      activeNote === note.name ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-7 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                        activeNote === note.name
                          ? 'bg-emerald-400 text-slate-950 border-white'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 hover:bg-emerald-500/40'
                      }`}
                    >
                      {note.name[0]}
                    </div>
                    <span className="text-[10px] text-emerald-200/80 font-medium mt-1">
                      {note.word}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Spaces: A C E G */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  The 4 Bass Spaces (Bottom to Top)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Spaces 1 - 4</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-3">
                Mnemonic: <strong className="text-cyan-300 font-bold">A</strong>ll <strong className="text-cyan-300 font-bold">C</strong>ows <strong className="text-cyan-300 font-bold">E</strong>at <strong className="text-cyan-300 font-bold">G</strong>rass
              </p>

              <div className="relative h-32 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-around px-4">
                {[20, 38, 56, 74, 92].map((topPercent, i) => (
                  <div
                    key={i}
                    style={{ top: `${topPercent}%` }}
                    className="absolute left-0 right-0 h-[1.5px] bg-slate-600 pointer-events-none"
                  />
                ))}

                {[
                  { name: 'A2', space: 'Space 1', midi: 45, top: '83%', word: 'All' },
                  { name: 'C3', space: 'Space 2', midi: 48, top: '65%', word: 'Cows' },
                  { name: 'E3', space: 'Space 3', midi: 52, top: '47%', word: 'Eat' },
                  { name: 'G3', space: 'Space 4', midi: 55, top: '29%', word: 'Grass' },
                ].map((note) => (
                  <button
                    key={note.name}
                    onClick={() => playNote(note.midi, note.name)}
                    style={{ top: note.top }}
                    className={`absolute -translate-y-1/2 flex flex-col items-center group transition-transform ${
                      activeNote === note.name ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-7 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                        activeNote === note.name
                          ? 'bg-cyan-400 text-slate-950 border-white'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 hover:bg-cyan-500/40'
                      }`}
                    >
                      {note.name[0]}
                    </div>
                    <span className="text-[10px] text-cyan-200/80 font-medium mt-1">
                      {note.word}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRAND STAFF & MIDDLE C */}
      {type === 'grand_staff_middle_c' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                The Grand Staff: Uniting Treble and Bass Staves
              </h4>
              <p className="text-xs text-slate-400">
                Pianists read the Grand Staff. <strong>Middle C (C4)</strong> sits on the ledger line in the exact gap between them.
              </p>
            </div>
            <button
              onClick={() => playScale([48, 52, 55, 60, 64, 67, 72])}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Arpeggiate Staves</span>
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <div className="relative w-full max-w-lg h-52 bg-slate-950 rounded-lg border border-slate-800/80 p-3">
              {/* Brace indicator on left */}
              <div className="absolute left-2 top-3 bottom-3 w-2 border-l-2 border-t-2 border-b-2 border-slate-500 rounded-l-md pointer-events-none" />

              {/* Treble staff 5 lines */}
              <span className="absolute left-6 top-4 text-[10px] font-bold text-indigo-400">Treble Clef</span>
              {[15, 22, 29, 36, 43].map((topPercent, i) => (
                <div
                  key={'t-' + i}
                  style={{ top: `${topPercent}%` }}
                  className="absolute left-10 right-4 h-[1px] bg-slate-600 pointer-events-none"
                />
              ))}

              {/* Middle C Ledger line at 51% */}
              <div
                style={{ top: '51%' }}
                className="absolute left-1/2 -translate-x-1/2 w-14 h-[1.5px] bg-amber-400"
              />
              <button
                onClick={() => playNote(60, 'Middle C (C4)')}
                style={{ top: '51%' }}
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full font-extrabold text-xs shadow-lg transition-transform ${
                  activeNote === 'Middle C (C4)'
                    ? 'bg-amber-400 text-slate-950 scale-125'
                    : 'bg-amber-500/30 border border-amber-400 text-amber-200 hover:scale-110'
                }`}
              >
                Middle C (C4)
              </button>

              {/* Bass staff 5 lines */}
              <span className="absolute left-6 bottom-4 text-[10px] font-bold text-indigo-400">Bass Clef</span>
              {[59, 66, 73, 80, 87].map((topPercent, i) => (
                <div
                  key={'b-' + i}
                  style={{ top: `${topPercent}%` }}
                  className="absolute left-10 right-4 h-[1px] bg-slate-600 pointer-events-none"
                />
              ))}
            </div>

            <p className="text-xs text-slate-400 text-center mt-3 max-w-md">
              💡 Middle C is one ledger line <em>below</em> the Treble staff, and one ledger line <em>above</em> the Bass staff. It is the identical physical key on the piano!
            </p>
          </div>
        </div>
      )}

      {/* 4. KEYBOARD LANDMARKS: C & F LANDMARKS */}
      {type === 'keyboard_landmarks' && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Keyboard Landmark Keys: Finding C and F Instantly
            </h4>
            <p className="text-xs text-slate-400">
              Black keys are grouped into sets of <strong>TWOS</strong> and <strong>THREES</strong>. Use them as visual landmarks!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">The Two-Black-Key Landmark = C</h5>
                <p className="text-xs text-slate-300 mt-1">
                  Look for the pair of <strong>two black keys</strong>. The white key directly to their <strong>immediate left</strong> is always <strong className="text-indigo-400 font-bold">C</strong>.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">The Three-Black-Key Landmark = F</h5>
                <p className="text-xs text-slate-300 mt-1">
                  Look for the group of <strong>three black keys</strong>. The white key directly to their <strong>immediate left</strong> is always <strong className="text-purple-400 font-bold">F</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HALF AND WHOLE STEPS */}
      {type === 'half_whole_steps' && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-400" />
              Half Steps (Semitones) vs Whole Steps (Whole Tones)
            </h4>
            <p className="text-xs text-slate-400">
              The atomic distance units of Western music harmony and scales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Half Step (Semitone)
              </span>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                The shortest distance between two notes on the piano: <strong>two adjacent keys</strong> with no other key in between.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => playScale([60, 61])}
                  className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> C to C♯ (Half Step)
                </button>
                <button
                  onClick={() => playScale([64, 65])}
                  className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> E to F (Natural Half Step)
                </button>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Whole Step (Whole Tone)
              </span>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Equal to <strong>two half steps</strong>. There is exactly one key skipped in between.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => playScale([60, 62])}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> C to D (Whole Step)
                </button>
                <button
                  onClick={() => playScale([65, 67])}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> F to G (Whole Step)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. RHYTHM SUBDIVISION TREE */}
      {type === 'rhythm_subdivision' && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Rhythmic Hierarchy: The Binary Subdivision Tree
            </h4>
            <p className="text-xs text-slate-400">
              In simple meter, each rhythmic value divides cleanly in half into two smaller values.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {/* Whole */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">1</span>
                <span className="font-semibold text-white">Whole Note</span>
                <span className="text-slate-400">(\dur 1)</span>
              </div>
              <span className="text-amber-300 font-bold">4 Beats</span>
            </div>

            {/* Halves */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between ml-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">2</span>
                <span className="font-semibold text-white">Half Note</span>
                <span className="text-slate-400">(\dur 2)</span>
              </div>
              <span className="text-indigo-300 font-bold">2 Beats (1/2 of Whole)</span>
            </div>

            {/* Quarters */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between ml-8">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">4</span>
                <span className="font-semibold text-white">Quarter Note</span>
                <span className="text-slate-400">(\dur 4)</span>
              </div>
              <span className="text-emerald-300 font-bold">1 Beat (Standard pulse in 4/4)</span>
            </div>

            {/* Eighths */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between ml-12">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">8</span>
                <span className="font-semibold text-white">Eighth Note</span>
                <span className="text-slate-400">(\dur 8)</span>
              </div>
              <span className="text-cyan-300 font-bold">1/2 Beat</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. MAJOR SCALE STEPS */}
      {type === 'major_scale_steps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-400" />
                The Major Scale Formula: W - W - H - W - W - W - H
              </h4>
              <p className="text-xs text-slate-400">
                Every major scale follows this exact sequence of whole (W) and half (H) steps.
              </p>
            </div>
            <button
              onClick={() => playScale([60, 62, 64, 65, 67, 69, 71, 72])}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Play C Major Scale</span>
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="grid grid-cols-8 gap-2 text-center">
              {[
                { deg: '1', note: 'C', step: 'W' },
                { deg: '2', note: 'D', step: 'W' },
                { deg: '3', note: 'E', step: 'H' },
                { deg: '4', note: 'F', step: 'W' },
                { deg: '5', note: 'G', step: 'W' },
                { deg: '6', note: 'A', step: 'W' },
                { deg: '7', note: 'B', step: 'H' },
                { deg: '8', note: 'C', step: '' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-mono">^{item.deg}</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 font-bold flex items-center justify-center my-1 text-sm shadow">
                    {item.note}
                  </div>
                  {item.step && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.step === 'H'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.step}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              Notice: The half steps (H) are always between scale degrees <strong>3-4</strong> and <strong>7-8</strong>!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
