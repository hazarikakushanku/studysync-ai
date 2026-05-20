# StudySync AI

An AI-Powered Student Productivity and Competitive Learning Platform.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Auth:** Supabase Auth (Email/Password + Google)
- **Database:** Supabase PostgreSQL
- **Charts:** Recharts
- **Whiteboard:** Excalidraw
- **State:** Zustand (persisted to localStorage)
- **Icons:** Lucide React

## Quick Start

### 1. Install dependencies

```bash
cd StudySync
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Enable **Google OAuth** in Authentication > Providers
4. Copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Demo Mode

You can use the app without Supabase by clicking **"Try demo mode"** on the login page. All data is persisted locally via Zustand/localStorage.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard under **Settings > Environment Variables**.

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Dashboard layout group
│   │   ├── analytics/      # Study analytics with Recharts
│   │   ├── calendar/       # Weekly planner
│   │   ├── challenges/     # Challenge system + accountability
│   │   ├── dashboard/      # Main dashboard
│   │   ├── leaderboard/    # Anonymous competitive rankings
│   │   ├── planner/        # Subject/chapter/topic planner
│   │   ├── pomodoro/       # Pomodoro timer
│   │   ├── posts/          # Daily learning posts
│   │   ├── roadmaps/       # Community roadmaps
│   │   ├── settings/       # User preferences
│   │   ├── sticky-notes/   # Revision cards
│   │   ├── todo/           # Task management
│   │   ├── whiteboard/     # Excalidraw whiteboard
│   │   └── layout.tsx      # Sidebar + topbar layout
│   ├── auth/callback/      # OAuth callback handler
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── globals.css         # Design system tokens
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── landing/            # Landing page sections
│   ├── layout/             # Sidebar, Topbar
│   ├── providers/          # Theme provider
│   ├── shared/             # Loading skeletons
│   └── ui/                 # ShadCN components
├── lib/
│   ├── supabase/           # Supabase client/server/middleware
│   └── utils.ts            # Utility functions
├── stores/
│   └── app-store.ts        # Zustand state management
└── middleware.ts            # Auth middleware
supabase/
└── schema.sql              # Database schema (15 tables)
```

## Features

- Landing page with 10 sections
- Email/password + Google authentication
- Anonymous student IDs (STU-XXXXX)
- Dashboard with stats, tasks, challenges
- To-Do list with priorities, categories, filters
- Pomodoro timer with circular progress
- Topic-wise study planner (subject > chapter > topic)
- Weekly planner with revision/mock test days
- Challenge system with daily accountability
- Sticky notes with grid and swipe views
- Excalidraw whiteboard
- Anonymous leaderboard (daily/weekly/monthly)
- Community roadmap sharing
- Daily learning posts feed
- Analytics with Recharts
- Dark mode support
- Fully responsive (mobile, tablet, desktop)
- Settings page

## License

MIT
