import React from 'react';
import { Lesson, FUNDAMENTALS_LESSONS, REPERTOIRE_PIECES } from '../../data/curriculumData';
import { UserState } from '../../lib/gamification/UserProgressStore';
import { CheckCircle2, Lock, Play, Star, BookOpen, Music, Code2 } from 'lucide-react';

interface SkillTreeProps {
  userState: UserState;
  onSelectLesson: (lesson: Lesson) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ userState, onSelectLesson }) => {
  const completedCount = userState.completedLessons.length;
  const totalCount = FUNDAMENTALS_LESSONS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Curriculum Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-indigo-500/10 blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Part I: Fundamentals
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Music Theory & LilyPond Engraving
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Master notation, clefs, accidentals, scales, intervals, and chords through code.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[200px]">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">Curriculum Mastery</span>
              <span className="text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-right">
              {completedCount} of {totalCount} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Nodes Tree */}
      <div className="relative space-y-6">
        {FUNDAMENTALS_LESSONS.map((lesson, idx) => {
          const isCompleted = userState.completedLessons.includes(lesson.id);
          // First lesson is always unlocked; subsequent lessons unlocked if previous lesson is completed
          const isUnlocked = idx === 0 || userState.completedLessons.includes(FUNDAMENTALS_LESSONS[idx - 1].id);
          const repPiece = lesson.repertoire_id ? REPERTOIRE_PIECES[lesson.repertoire_id] : null;

          return (
            <div
              key={lesson.id}
              className={`relative rounded-xl border p-5 transition-all ${
                isCompleted
                  ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-500/5'
                  : isUnlocked
                  ? 'bg-slate-900 border-indigo-500/40 hover:border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/50 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Status Circle */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isUnlocked
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isUnlocked ? (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Title & Concept info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                        {lesson.title}
                      </h3>
                      {isCompleted && (
                        <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Mastered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {lesson.theory_summary}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-mono">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        {lesson.syntax_id.replace('syntax.', '')}
                      </span>

                      {repPiece && (
                        <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs px-2.5 py-1 rounded-md">
                          <Music className="w-3.5 h-3.5" />
                          Capstone: {repPiece.title}
                        </span>
                      )}

                      <span className="text-xs text-indigo-400 font-semibold ml-auto">
                        +50 XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectLesson(lesson)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap self-end sm:self-center ${
                    isCompleted
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : isUnlocked
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? 'Review Lesson' : isUnlocked ? 'Start Lesson' : 'Locked'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
