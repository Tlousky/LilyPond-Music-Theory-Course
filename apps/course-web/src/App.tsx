import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SkillTree } from './components/curriculum/SkillTree';
import { LessonRunner } from './components/lesson/LessonRunner';
import { SightReadingGym } from './components/sightreading/SightReadingGym';
import { RepertoireBrowser } from './components/repertoire/RepertoireBrowser';
import { FreePlayground } from './components/playground/FreePlayground';
import { userProgressStore, UserState } from './lib/gamification/UserProgressStore';
import { audioEngine, InstrumentType } from './lib/audio/SoundFontAudioEngine';
import { Lesson } from './data/curriculumData';

export const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(userProgressStore.getState());
  const [activeTab, setActiveTab] = useState<'curriculum' | 'sightreading' | 'repertoire' | 'playground'>('curriculum');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [instrument, setInstrument] = useState<InstrumentType>('piano');

  useEffect(() => {
    return userProgressStore.subscribe((newState) => {
      setUserState(newState);
    });
  }, []);

  const handleChangeInstrument = (inst: InstrumentType) => {
    setInstrument(inst);
    audioEngine.setInstrument(inst);
  };

  const handleLessonComplete = (lessonId: string) => {
    userProgressStore.completeLesson(lessonId, 'gold');
    setSelectedLesson(null);
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset all course XP and progress? This cannot be undone.")) {
      userProgressStore.resetProgress();
      setSelectedLesson(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header
        userState={userState}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedLesson(null);
        }}
        instrument={instrument}
        onChangeInstrument={handleChangeInstrument}
        onResetProgress={handleResetProgress}
      />

      <main className="flex-1 pb-16">
        {selectedLesson ? (
          <LessonRunner
            lesson={selectedLesson}
            onBack={() => setSelectedLesson(null)}
            onComplete={handleLessonComplete}
          />
        ) : activeTab === 'curriculum' ? (
          <SkillTree
            userState={userState}
            onSelectLesson={(lesson) => setSelectedLesson(lesson)}
          />
        ) : activeTab === 'sightreading' ? (
          <SightReadingGym />
        ) : activeTab === 'repertoire' ? (
          <RepertoireBrowser />
        ) : (
          <FreePlayground />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>LilyPond Music Theory Course · Built on Open Music Theory & GNU LilyPond</p>
      </footer>
    </div>
  );
};

export default App;
