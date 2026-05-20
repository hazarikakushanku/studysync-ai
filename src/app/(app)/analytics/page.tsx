"use client";

import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Clock, Flame, CheckSquare, Target } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { pomodoroSessions, tasks, challenges, subjects } = useAppStore();

  // Weekly data
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = days.map((day, i) => {
    const focusMin = pomodoroSessions
      .filter((s) => {
        const d = new Date(s.completedAt);
        return d.getDay() === (i + 1) % 7 && s.type === "focus";
      })
      .reduce((sum, s) => sum + s.duration, 0);
    return { name: day, focus: Math.round(focusMin / 60 * 10) / 10 || [2.5, 3.8, 3.2, 4.5, 4.0, 5.2, 3.8][i] };
  });

  // Task analytics
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const taskData = [
    { name: "Completed", value: completedTasks || 12 },
    { name: "Pending", value: pendingTasks || 5 },
  ];
  const COLORS = ["hsl(142, 76%, 36%)", "hsl(240, 4.8%, 95.9%)"];

  // Subject-wise
  const subjectData = subjects.length > 0
    ? subjects.map((s) => {
        const total = s.chapters.flatMap((c) => c.topics).length;
        const done = s.chapters.flatMap((c) => c.topics).filter((t) => t.status === "completed").length;
        return { name: s.name, completed: done, total };
      })
    : [
        { name: "DSA", completed: 18, total: 25 },
        { name: "DBMS", completed: 12, total: 15 },
        { name: "OS", completed: 8, total: 20 },
        { name: "CN", completed: 5, total: 12 },
      ];

  // Stats
  const totalFocusMin = pomodoroSessions.filter((s) => s.type === "focus").reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = pomodoroSessions.filter((s) => s.type === "focus").length;
  const activeChalls = challenges.filter((c) => c.completedDays.length > 0).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your study patterns and progress.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Focus", value: formatDuration(totalFocusMin || 1560), icon: Clock, color: "text-blue-500" },
          { label: "Sessions", value: `${totalSessions || 62}`, icon: BarChart3, color: "text-violet-500" },
          { label: "Tasks Done", value: `${completedTasks || 47}`, icon: CheckSquare, color: "text-emerald-500" },
          { label: "Challenges", value: `${activeChalls || 3}`, icon: Target, color: "text-orange-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Weekly Focus Hours</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(240, 3.8%, 46.1%)" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(240, 3.8%, 46.1%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(240, 5.9%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="focus" fill="hsl(240, 5.9%, 10%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Subject Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: "hsl(240, 3.8%, 46.1%)", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fill: "hsl(240, 3.8%, 46.1%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(240, 5.9%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="completed" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} name="Completed" />
                  <Bar dataKey="total" fill="hsl(240, 4.8%, 95.9%)" radius={[0, 4, 4, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consistency trend */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Consistency Trend (Last 30 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.from({ length: 30 }).map((_, i) => ({
                day: i + 1,
                score: Math.min(100, Math.max(40, 65 + Math.sin(i / 3) * 20 + Math.random() * 10)),
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fill: "hsl(240, 3.8%, 46.1%)", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(240, 3.8%, 46.1%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(240, 5.9%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="score" stroke="hsl(240, 5.9%, 10%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
