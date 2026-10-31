import React from 'react';
import { UserState } from '../../lib/gamification/UserProgressStore';
import { InstrumentType } from '../../lib/audio/SoundFontAudioEngine';
import { Flame, Award, BookOpen, Music, Code2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  userState: UserState;
  activeTab: 'curriculum' | 'repertoire' | 'playground';
  onSelectTab: (tab: 'curriculum' | 'repertoire' | 'playground') => void;
  instrument: InstrumentType;
  onChangeInstrument: (inst: InstrumentType) => void;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  activeTab,
  onSelectTab,
  instrument,
  onChangeInstrument,
  onResetProgress,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              LilyPond <span className="text-indigo-400 font-medium">Theory Course</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Code-First Music Notation & Theory</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-sm font-medium">
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum
          </button>
          <button
            onClick={() => onSelectTab('repertoire')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'repertoire'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-4 h-4" />
            Repertoire
          </button>
          <button
            onClick={() => onSelectTab('playground')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Playground
          </button>
        </nav>

        {/* Gamification Stats & Controls */}
        <div className="flex items-center gap-3">
          {/* Instrument Selector */}
          <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
            <span className="text-slate-400 mr-2">Instrument:</span>
            <select
              value={instrument}
              onChange={(e) => onChangeInstrument(e.target.value as InstrumentType)}
              className="bg-transparent text-indigo-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="piano" className="bg-slate-900 text-slate-200">Piano</option>
              <option value="harpsichord" className="bg-slate-900 text-slate-200">Harpsichord</option>
              <option value="strings" className="bg-slate-900 text-slate-200">Strings</option>
              <option value="metronome" className="bg-slate-900 text-slate-200">Metronome</option>
            </select>
          </div>

          {/* Day Streak */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{userState.streakDays} Day Streak</span>
          </div>

          {/* XP & Level */}
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-lg text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Level {userState.level}</span>
            <span className="text-slate-500">|</span>
            <span className="text-indigo-400 font-bold">{userState.xp} XP</span>
          </div>

          {/* Reset progress */}
          <button
            onClick={onResetProgress}
            title="Reset progress"
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
