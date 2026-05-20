"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckSquare, Timer, BookOpen, Trophy, StickyNote, Map,
  Target, BarChart3, ArrowRight, Zap, Shield, Users,
  Clock, Brain, Flame, Star, ChevronRight,
} from "lucide-react";

/* ─── Navbar ─── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">StudySync</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
          <a href="#leaderboard" className="hover:text-foreground transition-colors">Leaderboard</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
          <Flame className="h-3.5 w-3.5" />
          Built for focused students
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Study smarter.<br />
          <span className="text-muted-foreground">Stay consistent.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          The productivity platform that helps you manage studies, build discipline,
          track consistency, and compete anonymously with peers preparing for
          GATE, UPSC, placements, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="xl" className="gap-2 w-full sm:w-auto">
              Start for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              See features
            </Button>
          </a>
        </div>
      </div>
      {/* Dashboard Preview */}
      <div className="max-w-5xl mx-auto mt-16">
        <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <div className="h-3 w-3 rounded-full bg-red-400/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
            <div className="h-3 w-3 rounded-full bg-green-400/60" />
            <span className="ml-2 text-xs text-muted-foreground">StudySync Dashboard</span>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Focus Today", value: "4h 32m", icon: Clock },
              { label: "Current Streak", value: "12 days", icon: Flame },
              { label: "Tasks Done", value: "8 / 10", icon: CheckSquare },
              { label: "Consistency", value: "94%", icon: BarChart3 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-4 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { icon: CheckSquare, title: "Smart To-Do Lists", desc: "Prioritize tasks by subject, due date, and category with built-in study workflows." },
  { icon: Timer, title: "Pomodoro Timer", desc: "Stay focused with customizable sessions, break reminders, and daily tracking." },
  { icon: BookOpen, title: "Study Planner", desc: "Organize subjects, chapters, and topics. Track completed, pending, and weak areas." },
  { icon: Target, title: "Challenge System", desc: "Build discipline with personal challenges and daily accountability tracking." },
  { icon: StickyNote, title: "Sticky Notes", desc: "Quick-access flashcards for formulas, revision points, and interview prep notes." },
  { icon: Trophy, title: "Anonymous Leaderboard", desc: "Compete with peers using anonymous IDs. Join or exit anytime you want." },
  { icon: Map, title: "Roadmap Sharing", desc: "Share and discover learning strategies for GATE, UPSC, placements, and more." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track study hours, focus trends, consistency graphs, and subject-wise progress." },
];

function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground mb-2">FEATURES</p>
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to stay on track</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all duration-200">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Analytics Preview ─── */
function AnalyticsPreview() {
  const bars = [40, 65, 55, 80, 70, 90, 75];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <section id="analytics" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">ANALYTICS</p>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Understand your study patterns</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Visualize focus hours, weekly productivity, and subject-wise progress.
            Identify your peak performance windows and optimize your schedule.
          </p>
          <Link href="/signup">
            <Button variant="outline" className="gap-2">
              Try it free <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium mb-4">Weekly Focus Hours</p>
          <div className="flex items-end gap-3 h-40">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-md bg-primary/80 transition-all duration-500" style={{ height: `${h}%` }} />
                <span className="text-xs text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Leaderboard Preview ─── */
function LeaderboardPreview() {
  const entries = [
    { id: "STU-49281", hours: "42h", streak: 28, score: 96 },
    { id: "STU-18273", hours: "38h", streak: 21, score: 91 },
    { id: "STU-73921", hours: "35h", streak: 19, score: 88 },
  ];
  return (
    <section id="leaderboard" className="py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-xl border border-border bg-card overflow-hidden order-2 lg:order-1">
          <div className="px-6 py-4 border-b border-border">
            <p className="font-medium">Weekly Leaderboard</p>
          </div>
          <div className="divide-y divide-border">
            {entries.map((e, i) => (
              <div key={e.id} className="px-6 py-4 flex items-center gap-4">
                <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                  {e.id.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{e.id}</p>
                  <p className="text-xs text-muted-foreground">{e.hours} this week</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{e.score}%</p>
                  <p className="text-xs text-muted-foreground">{e.streak} day streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">LEADERBOARD</p>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Compete anonymously</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Your identity stays private. Only your anonymous ID, study hours,
            and consistency score are visible. Join or leave anytime.
          </p>
          <Link href="/signup">
            <Button variant="outline" className="gap-2">
              Join leaderboard <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Other Previews ─── */
function StickyNotesPreview() {
  const colors = ["bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
    "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
    "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"];
  const notes = [
    { title: "Binary Search", body: "Time: O(log n) — Always check mid element first" },
    { title: "SQL Joins", body: "INNER returns matched rows, LEFT returns all from left" },
    { title: "OS Scheduling", body: "FCFS, SJF, Round Robin, Priority — compare tradeoffs" },
  ];
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">STICKY NOTES</p>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Quick-access revision cards</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">
          Pin formulas, key concepts, and interview notes. Swipe through them like flashcards.
        </p>
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {notes.map((n, i) => (
            <div key={i} className={`rounded-xl border p-5 text-left ${colors[i]}`}>
              <p className="font-medium text-sm mb-2">{n.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChallengePreview() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">CHALLENGES</p>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Build discipline with daily challenges</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Create personal challenges — solve 5 DSA problems daily, limit social media,
            wake up at 5 AM. Track streaks and get daily accountability check-ins.
          </p>
          <Link href="/signup">
            <Button variant="outline" className="gap-2">
              Start a challenge <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Solve 5 DSA daily</p>
            <span className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Day 12</span>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className={`h-8 rounded-md ${i < 12 ? "bg-primary/80" : "bg-secondary"}`} />
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> 12 day streak</span>
            <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> 86% consistency</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const items = [
    { name: "STU-39201", text: "StudySync helped me stay consistent during my GATE preparation. The Pomodoro timer and revision system are game changers.", role: "GATE 2025 Aspirant" },
    { name: "STU-85712", text: "The anonymous leaderboard gives me motivation without pressure. I can see my rank without exposing my identity.", role: "Placement Prep" },
    { name: "STU-12847", text: "Challenge system changed my daily routine. I wake up at 5 AM for 30 days now. The accountability tracker keeps me honest.", role: "UPSC Aspirant" },
  ];
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground mb-2">TESTIMONIALS</p>
          <h2 className="text-3xl font-bold tracking-tight">Students love StudySync</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.text}</p>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to study smarter?</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Join thousands of students building consistency and discipline with StudySync AI.
          It is free to get started.
        </p>
        <Link href="/signup">
          <Button size="xl" className="gap-2">
            Create free account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold">StudySync AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
          <a href="#leaderboard" className="hover:text-foreground transition-colors">Leaderboard</a>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} StudySync AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─── Landing Page ─── */
export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <AnalyticsPreview />
      <LeaderboardPreview />
      <StickyNotesPreview />
      <ChallengePreview />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
