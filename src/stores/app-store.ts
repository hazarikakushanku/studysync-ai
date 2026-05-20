import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ============================
   Types
   ============================ */

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: "study" | "revision" | "mock-test" | "project" | "assignment";
  subject?: string;
  dueDate?: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  duration: number; // minutes
  type: "focus" | "break";
  completedAt: string;
  subject?: string;
}

export interface Challenge {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  dailyTarget: string;
  reminderTime?: string;
  completedDays: string[]; // ISO date strings
  missedDays: string[];
  createdAt: string;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: "yellow" | "blue" | "green" | "pink" | "purple";
  subject?: string;
  chapter?: string;
  pinned?: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  status: "completed" | "pending" | "weak";
}

export interface RoadmapPost {
  id: string;
  title: string;
  category: string;
  strategy: string;
  timeline: string;
  skills: string[];
  resources: string[];
  authorId: string;
  authorAnonymousId: string;
  createdAt: string;
  bookmarks: number;
}

export interface LearningPost {
  id: string;
  content: string;
  authorAnonymousId: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  anonymousId: string;
  studyHours: number;
  skills: string[];
  examType: string;
  consistencyScore: number;
  streak: number;
}

/* ============================
   App Store
   ============================ */

interface AppState {
  // User
  anonymousId: string;
  isOnLeaderboard: boolean;
  setAnonymousId: (id: string) => void;
  toggleLeaderboard: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Pomodoro
  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: PomodoroSession) => void;
  focusDuration: number;
  breakDuration: number;
  setFocusDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;

  // Challenges
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  logChallengeDay: (id: string, date: string, completed: boolean) => void;

  // Sticky Notes
  stickyNotes: StickyNote[];
  addStickyNote: (note: StickyNote) => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;

  // Study Planner
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  updateTopicStatus: (subjectId: string, chapterId: string, topicId: string, status: Topic["status"]) => void;

  // Roadmap Posts
  roadmapPosts: RoadmapPost[];
  addRoadmapPost: (post: RoadmapPost) => void;

  // Learning Posts
  learningPosts: LearningPost[];
  addLearningPost: (post: LearningPost) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Focus Mode & Mission
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  setFocusMode: (active: boolean) => void;
  missionDismissedDate: string | null;
  dismissMission: (date: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      anonymousId: "",
      isOnLeaderboard: false,
      setAnonymousId: (id) => set({ anonymousId: id }),
      toggleLeaderboard: () => set((s) => ({ isOnLeaderboard: !s.isOnLeaderboard })),

      // Tasks
      tasks: [],
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      // Pomodoro
      pomodoroSessions: [],
      addPomodoroSession: (session) =>
        set((s) => ({ pomodoroSessions: [...s.pomodoroSessions, session] })),
      focusDuration: 25,
      breakDuration: 5,
      setFocusDuration: (min) => set({ focusDuration: min }),
      setBreakDuration: (min) => set({ breakDuration: min }),

      // Challenges
      challenges: [],
      addChallenge: (challenge) =>
        set((s) => ({ challenges: [challenge, ...s.challenges] })),
      updateChallenge: (id, updates) =>
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteChallenge: (id) =>
        set((s) => ({ challenges: s.challenges.filter((c) => c.id !== id) })),
      logChallengeDay: (id, date, completed) =>
        set((s) => ({
          challenges: s.challenges.map((c) => {
            if (c.id !== id) return c;
            if (completed) {
              return {
                ...c,
                completedDays: [...c.completedDays, date],
                missedDays: c.missedDays.filter((d) => d !== date),
              };
            } else {
              return {
                ...c,
                missedDays: [...c.missedDays, date],
                completedDays: c.completedDays.filter((d) => d !== date),
              };
            }
          }),
        })),

      // Sticky Notes
      stickyNotes: [],
      addStickyNote: (note) =>
        set((s) => ({ stickyNotes: [note, ...s.stickyNotes] })),
      updateStickyNote: (id, updates) =>
        set((s) => ({
          stickyNotes: s.stickyNotes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),
      deleteStickyNote: (id) =>
        set((s) => ({ stickyNotes: s.stickyNotes.filter((n) => n.id !== id) })),

      // Study Planner
      subjects: [],
      addSubject: (subject) =>
        set((s) => ({ subjects: [...s.subjects, subject] })),
      updateSubject: (id, updates) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        })),
      deleteSubject: (id) =>
        set((s) => ({ subjects: s.subjects.filter((sub) => sub.id !== id) })),
      updateTopicStatus: (subjectId, chapterId, topicId, status) =>
        set((s) => ({
          subjects: s.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              chapters: sub.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                return {
                  ...ch,
                  topics: ch.topics.map((t) =>
                    t.id === topicId ? { ...t, status } : t
                  ),
                };
              }),
            };
          }),
        })),

      // Roadmap Posts
      roadmapPosts: [],
      addRoadmapPost: (post) =>
        set((s) => ({ roadmapPosts: [post, ...s.roadmapPosts] })),

      // Learning Posts
      learningPosts: [],
      addLearningPost: (post) =>
        set((s) => ({ learningPosts: [post, ...s.learningPosts] })),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Focus Mode & Mission
      isFocusMode: false,
      toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),
      setFocusMode: (active) => set({ isFocusMode: active }),
      missionDismissedDate: null,
      dismissMission: (date) => set({ missionDismissedDate: date }),
    }),
    {
      name: "studysync-storage",
      partialize: (state) => ({
        anonymousId: state.anonymousId,
        isOnLeaderboard: state.isOnLeaderboard,
        tasks: state.tasks,
        pomodoroSessions: state.pomodoroSessions,
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        challenges: state.challenges,
        stickyNotes: state.stickyNotes,
        subjects: state.subjects,
        roadmapPosts: state.roadmapPosts,
        learningPosts: state.learningPosts,
        missionDismissedDate: state.missionDismissedDate,
      }),
    }
  )
);
