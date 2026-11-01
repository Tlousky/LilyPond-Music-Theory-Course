import React, { useState } from 'react';
import { SIGHT_READING_EXERCISES, SightReadingExercise } from '../../data/sightReadingData';
import { TraditionalSightReading } from './TraditionalSightReading';
import { LilyPondReconstruction } from './LilyPondReconstruction';
import { audioEngine } from '../../lib/audio/SoundFontAudioEngine';
import { userProgressStore } from '../../lib/gamification/UserProgressStore';
import {
  Piano,
  Code2,
  Sparkles,
  ChevronRight,
  Music,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export type SightReadingTab = 'traditional' | 'reconstruction';

export const SightReadingGym: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SightReadingTab>('traditional');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(SIGHT_READING_EXERCISES[0].id);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const currentExercise =
    SIGHT_READING_EXERCISES.find((ex) => ex.id === selectedExerciseId) || SIGHT_READING_EXERCISES[0];

  const handleTabChange = (tab: SightReadingTab) => {
    audioEngine.playUiSelect();
    setActiveTab(tab);
  };

  const handleExerciseSelect = (ex: SightReadingExercise) => {
    audioEngine.playUiSelect();
    setSelectedExerciseId(ex.id);
  };

  const handleCompleteExercise = (score: number) => {
    setCompletedExercises((prev) => new Set(prev).add(`${activeTab}:${selectedExerciseId}`));
    // Award XP
    userProgressStore.completeLesson(`sight_reading.${selectedExerciseId}.${activeTab}`, score >= 90 ? 'gold' : 'silver');
  };

  const handleNextExercise = () => {
    const currentIndex = SIGHT_READING_EXERCISES.findIndex((ex) => ex.id === selectedExerciseId);
    if (currentIndex < SIGHT_READING_EXERCISES.length - 1) {
      const nextEx = SIGHT_READING_EXERCISES[currentIndex + 1];
      setSelectedExerciseId(nextEx.id);
      audioEngine.playUiSelect();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Sight Reading Practice Gym
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Master Sheet Music & LilyPond Code
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Train your reflexes with two complementary sight reading disciplines: play the notes directly on the keyboard, or reconstruct authentic scores in LilyPond code.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-sm font-semibold shrink-0">
            <button
              onClick={() => handleTabChange('traditional')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'traditional'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Piano className="w-4 h-4" />
              <span>1. Score to Piano</span>
            </button>

            <button
              onClick={() => handleTabChange('reconstruction')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'reconstruction'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>2. Score to LilyPond</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Level Selector Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Curated Exercise Levels
          </h3>
          <span className="text-xs text-slate-500">
            {SIGHT_READING_EXERCISES.length} graded levels available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SIGHT_READING_EXERCISES.map((ex) => {
            const isSelected = ex.id === selectedExerciseId;
            const isDone = completedExercises.has(`${activeTab}:${ex.id}`);

            return (
              <button
                key={ex.id}
                onClick={() => handleExerciseSelect(ex)}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? activeTab === 'traditional'
                      ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-purple-600/10 border-purple-500 ring-2 ring-purple-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase font-mono">
                      Level {ex.level}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {ex.clef}
                      </span>
                      {isDone && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-white line-clamp-1">
                    {ex.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {ex.key} · {ex.meter}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Exercise Workspace */}
      <div className="pt-2">
        {activeTab === 'traditional' ? (
          <TraditionalSightReading
            key={`trad-${currentExercise.id}`}
            exercise={currentExercise}
            onComplete={handleCompleteExercise}
            onNextExercise={handleNextExercise}
          />
        ) : (
          <LilyPondReconstruction
            key={`recon-${currentExercise.id}`}
            exercise={currentExercise}
            onComplete={handleCompleteExercise}
            onNextExercise={handleNextExercise}
          />
        )}
      </div>
    </div>
  );
};
