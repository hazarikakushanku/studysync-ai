"use client";

import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, Flame, CheckSquare, BarChart3, Target, BookOpen,
  ArrowRight, Calendar,
} from "lucide-react";
import { getGreeting, formatDuration } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { tasks, pomodoroSessions, challenges, anonymousId, subjects } = useAppStore();

  const today = new Date().toISOString().split("T")[0];
  const todaysSessions = pomodoroSessions.filter(
    (s) => s.completedAt.startsWith(today) && s.type === "focus"
  );
  const focusMinutes = todaysSessions.reduce((sum, s) => sum + s.duration, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  // Calculate streak from challenges
  const activeChallenge = challenges[0];
  const streak = activeChallenge?.completedDays.length || 0;

  // Consistency
  const totalDays = tasks.length > 0 ? Math.max(tasks.length, 1) : 1;
  const consistency = Math.min(Math.round((completedTasks / totalDays) * 100), 100);

  const stats = [
    { label: "Focus Today", value: formatDuration(focusMinutes), icon: Clock, color: "text-blue-600 dark:text-blue-400" },
    { label: "Current Streak", value: `${streak} days`, icon: Flame, color: "text-orange-600 dark:text-orange-400" },
    { label: "Tasks Done", value: `${completedTasks}`, icon: CheckSquare, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Consistency", value: `${consistency}%`, icon: BarChart3, color: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{getGreeting()}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {anonymousId ? `${anonymousId} — ` : ""}Here is your study overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Upcoming Tasks</CardTitle>
            <Link href="/todo">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingTasks === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No pending tasks. Add some from the To-Do page.
              </div>
            ) : (
              <div className="space-y-2">
                {tasks
                  .filter((t) => !t.completed)
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`h-2 w-2 rounded-full ${
                        task.priority === "high" ? "bg-red-500" :
                        task.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <span className="text-sm flex-1 truncate">{task.title}</span>
                      <Badge variant="secondary" className="text-[10px]">{task.category}</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/pomodoro", label: "Start Focus Session", icon: Clock },
              { href: "/todo", label: "Add New Task", icon: CheckSquare },
              { href: "/challenges", label: "View Challenges", icon: Target },
              { href: "/planner", label: "Study Planner", icon: BookOpen },
              { href: "/calendar", label: "Weekly Plan", icon: Calendar },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm">
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Active Challenges</CardTitle>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {challenges.slice(0, 2).map((ch) => {
                const total = ch.completedDays.length + ch.missedDays.length;
                const progress = total > 0 ? Math.round((ch.completedDays.length / total) * 100) : 0;
                return (
                  <div key={ch.id} className="rounded-lg border border-border p-4">
                    <p className="font-medium text-sm mb-1">{ch.title}</p>
                    <p className="text-xs text-muted-foreground mb-3">{ch.dailyTarget}</p>
                    <Progress value={progress} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {ch.completedDays.length} days</span>
                      <span>{progress}% done</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Planner Summary */}
      {subjects.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Study Progress</CardTitle>
            <Link href="/planner">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.slice(0, 3).map((sub) => {
                const allTopics = sub.chapters.flatMap((c) => c.topics);
                const done = allTopics.filter((t) => t.status === "completed").length;
                const pct = allTopics.length > 0 ? Math.round((done / allTopics.length) * 100) : 0;
                return (
                  <div key={sub.id} className="rounded-lg border border-border p-4">
                    <p className="font-medium text-sm mb-2">{sub.name}</p>
                    <Progress value={pct} className="h-1.5 mb-1" />
                    <p className="text-xs text-muted-foreground">{done}/{allTopics.length} topics</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
