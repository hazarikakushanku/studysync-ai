import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---- Types for our app data ----

// a single task item
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

// a pomodoro timer session
export interface PomodoroSession {
  id: string;
  duration: number;
  type: "focus" | "break";
  completedAt: string;
  subject?: string;
}

// a challenge the user creates
export interface Challenge {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  dailyTarget: string;
  reminderTime?: string;
  completedDays: string[];
  missedDays: string[];
  createdAt: string;
}

// a sticky note
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

// a subject in study planner
export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

// a chapter inside a subject
export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

// a topic inside a chapter
export interface Topic {
  id: string;
  name: string;
  status: "completed" | "pending" | "weak";
}

// a roadmap post shared by user
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

// a learning post
export interface LearningPost {
  id: string;
  content: string;
  authorAnonymousId: string;
  createdAt: string;
}

// leaderboard entry type
export interface LeaderboardEntry {
  anonymousId: string;
  studyHours: number;
  skills: string[];
  examType: string;
  consistencyScore: number;
  streak: number;
}

// ---- the main store that holds all our app data ----

// this is the shape of our entire app state
interface AppState {
  // user info
  anonymousId: string;
  isOnLeaderboard: boolean;
  setAnonymousId: (id: string) => void;
  toggleLeaderboard: () => void;

  // tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // pomodoro timer
  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: PomodoroSession) => void;
  focusDuration: number;
  breakDuration: number;
  setFocusDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;

  // challenges
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  logChallengeDay: (id: string, date: string, completed: boolean) => void;

  // sticky notes
  stickyNotes: StickyNote[];
  addStickyNote: (note: StickyNote) => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;

  // study planner
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  updateTopicStatus: (subjectId: string, chapterId: string, topicId: string, status: Topic["status"]) => void;

  // roadmap posts
  roadmapPosts: RoadmapPost[];
  addRoadmapPost: (post: RoadmapPost) => void;

  // learning posts
  learningPosts: LearningPost[];
  addLearningPost: (post: LearningPost) => void;

  // sidebar open/close
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // focus mode and today's mission
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  setFocusMode: (active: boolean) => void;
  missionDismissedDate: string | null;
  dismissMission: (date: string) => void;
}

// creating the zustand store with local storage saving
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // user default values
      anonymousId: "",
      isOnLeaderboard: false,
      setAnonymousId: (id) => set({ anonymousId: id }),
      toggleLeaderboard: () => set((s) => ({ isOnLeaderboard: !s.isOnLeaderboard })),

      // tasks functions
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

      // pomodoro timer functions
      pomodoroSessions: [],
      addPomodoroSession: (session) =>
        set((s) => ({ pomodoroSessions: [...s.pomodoroSessions, session] })),
      focusDuration: 25,
      breakDuration: 5,
      setFocusDuration: (min) => set({ focusDuration: min }),
      setBreakDuration: (min) => set({ breakDuration: min }),

      // challenges functions
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
              // add to completed days, remove from missed
              return {
                ...c,
                completedDays: [...c.completedDays, date],
                missedDays: c.missedDays.filter((d) => d !== date),
              };
            } else {
              // add to missed days, remove from completed
              return {
                ...c,
                missedDays: [...c.missedDays, date],
                completedDays: c.completedDays.filter((d) => d !== date),
              };
            }
          }),
        })),

      // sticky notes functions
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

      // study planner functions
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

      // roadmap posts
      roadmapPosts: [],
      addRoadmapPost: (post) =>
        set((s) => ({ roadmapPosts: [post, ...s.roadmapPosts] })),

      // learning posts
      learningPosts: [],
      addLearningPost: (post) =>
        set((s) => ({ learningPosts: [post, ...s.learningPosts] })),

      // sidebar state
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // focus mode and mission
      isFocusMode: false,
      toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),
      setFocusMode: (active) => set({ isFocusMode: active }),
      missionDismissedDate: null,
      dismissMission: (date) => set({ missionDismissedDate: date }),
    }),
    {
      name: "studysync-storage",
      // only save these specific fields to local storage
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
