/**
 * UserProgressStore.ts - Client-Side Gamification & Mastery State Manager
 * Tracks XP, streaks, completed lessons, mastery tiers, and achievement badges with LocalStorage persistence.
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserState {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null;
  completedLessons: string[];
  lessonMastery: Record<string, 'bronze' | 'silver' | 'gold'>;
  unlockedBadges: string[];
}

export const ALL_BADGES: Badge[] = [
  {
    id: "first_note",
    title: "First Note",
    description: "Successfully compile your first LilyPond score.",
    icon: "🎵"
  },
  {
    id: "clef_master",
    title: "Clef Master",
    description: "Read notes across treble and bass clefs without mistakes.",
    icon: "🎼"
  },
  {
    id: "rhythm_champ",
    title: "In the Groove",
    description: "Score 90%+ accuracy on an interactive rhythm tapping challenge.",
    icon: "🥁"
  },
  {
    id: "bach_apprentice",
    title: "Bach's Apprentice",
    description: "Engrave an authentic classical excerpt from Petzold or J.S. Bach.",
    icon: "🎹"
  },
  {
    id: "polyphonic_pro",
    title: "Polyphonic Pioneer",
    description: "Successfully engrave multi-voice polyphony on a staff.",
    icon: "👑"
  }
];

const STORAGE_KEY = 'lilypond_course_user_state_v1';

export class UserProgressStore {
  private state: UserState;
  private listeners: Set<(state: UserState) => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.checkAndUpdateStreak();
  }

  private loadState(): UserState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load user state from localStorage", e);
    }

    return {
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      lessonMastery: {},
      unlockedBadges: []
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Failed to persist user state", e);
    }
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public getState(): UserState {
    return { ...this.state };
  }

  public subscribe(listener: (state: UserState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  public awardXP(amount: number) {
    this.state.xp += amount;
    // Calculate level: Level = 1 + floor(XP / 100)
    this.state.level = Math.floor(this.state.xp / 100) + 1;
    this.saveState();
  }

  public completeLesson(lessonId: string, tier: 'bronze' | 'silver' | 'gold' = 'gold') {
    if (!this.state.completedLessons.includes(lessonId)) {
      this.state.completedLessons.push(lessonId);
      this.awardXP(50); // Completion bonus
    }

    this.state.lessonMastery[lessonId] = tier;

    // Check badges
    if (!this.state.unlockedBadges.includes("first_note")) {
      this.unlockBadge("first_note");
    }
    if (this.state.completedLessons.length >= 3 && !this.state.unlockedBadges.includes("clef_master")) {
      this.unlockBadge("clef_master");
    }

    this.saveState();
  }

  public unlockBadge(badgeId: string) {
    if (!this.state.unlockedBadges.includes(badgeId)) {
      this.state.unlockedBadges.push(badgeId);
      this.awardXP(30); // Badge bonus
      this.saveState();
    }
  }

  public resetProgress() {
    this.state = {
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      lessonMastery: {},
      unlockedBadges: []
    };
    this.saveState();
  }

  private checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.lastActiveDate) {
      this.state.lastActiveDate = today;
      this.state.streakDays = 1;
      this.saveState();
      return;
    }

    if (this.state.lastActiveDate === today) {
      return; // Already logged in today
    }

    const last = new Date(this.state.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      this.state.streakDays += 1;
    } else if (diffDays > 1) {
      this.state.streakDays = 1; // Streak broken
    }
    this.state.lastActiveDate = today;
    this.saveState();
  }
}

export const userProgressStore = new UserProgressStore();
