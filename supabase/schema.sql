-- ============================================
-- StudySync AI — Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users (extends Supabase auth.users) ───
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  exam_type TEXT,
  is_on_leaderboard BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Tasks ───
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  category TEXT CHECK (category IN ('study', 'revision', 'mock-test', 'project', 'assignment')) DEFAULT 'study',
  subject TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Pomodoro Sessions ───
CREATE TABLE public.pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  type TEXT CHECK (type IN ('focus', 'break')) DEFAULT 'focus',
  subject TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Subjects ───
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Topics (nested under subjects via chapters) ───
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  chapter_name TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending', 'weak')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Sticky Notes ───
CREATE TABLE public.sticky_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'yellow',
  subject TEXT,
  chapter TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Challenges ───
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  daily_target TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reminder_time TIME,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Challenge Logs ───
CREATE TABLE public.challenge_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(challenge_id, log_date)
);

-- ─── Roadmap Posts ───
CREATE TABLE public.roadmap_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  strategy TEXT NOT NULL,
  timeline TEXT,
  skills TEXT[],
  resources TEXT[],
  bookmarks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Learning Posts ───
CREATE TABLE public.learning_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Leaderboard Stats ───
CREATE TABLE public.leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  study_hours NUMERIC DEFAULT 0,
  consistency_score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  skills TEXT[],
  exam_type TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Revision Logs ───
CREATE TABLE public.revision_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  revision_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Notifications ───
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Accountability Tracker ───
CREATE TABLE public.accountability_tracker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- ─── Row Level Security ───
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_tracker ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.pomodoro_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subjects" ON public.subjects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own topics" ON public.topics FOR ALL USING (
  subject_id IN (SELECT id FROM public.subjects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own notes" ON public.sticky_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenges" ON public.challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenge logs" ON public.challenge_logs FOR ALL USING (
  challenge_id IN (SELECT id FROM public.challenges WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone can read roadmaps" ON public.roadmap_posts FOR SELECT USING (true);
CREATE POLICY "Users can create own roadmaps" ON public.roadmap_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read learning posts" ON public.learning_posts FOR SELECT USING (true);
CREATE POLICY "Users can create own posts" ON public.learning_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leaderboard visible to all" ON public.leaderboard_stats FOR SELECT USING (true);
CREATE POLICY "Users can manage own leaderboard" ON public.leaderboard_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revisions" ON public.revision_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own accountability" ON public.accountability_tracker FOR ALL USING (auth.uid() = user_id);

-- ─── Auto-create profile on signup ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, anonymous_id)
  VALUES (NEW.id, 'STU-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Indexes for performance ───
CREATE INDEX idx_tasks_user ON public.tasks(user_id);
CREATE INDEX idx_tasks_due ON public.tasks(due_date);
CREATE INDEX idx_sessions_user ON public.pomodoro_sessions(user_id);
CREATE INDEX idx_sessions_date ON public.pomodoro_sessions(completed_at);
CREATE INDEX idx_challenges_user ON public.challenges(user_id);
CREATE INDEX idx_sticky_user ON public.sticky_notes(user_id);
CREATE INDEX idx_roadmaps_category ON public.roadmap_posts(category);
CREATE INDEX idx_learning_created ON public.learning_posts(created_at DESC);
