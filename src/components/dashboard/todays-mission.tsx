"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { X, Target, Flame, Brain, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// shows daily mission card with tasks, challenges, and pomodoro goal
export function TodaysMission() {
  let {
    tasks, challenges, subjects, pomodoroSessions,
    missionDismissedDate, dismissMission,
  } = useAppStore();
  let [visible, setVisible] = useState(false);

  // check if mission was already dismissed today
  useEffect(() => {
    let todayStr = format(new Date(), "yyyy-MM-dd");
    if (missionDismissedDate !== todayStr) {
      setVisible(true);
    }
  }, [missionDismissedDate]);

  // if not visible, dont render anything
  if (!visible) return null;

  let todayStr = format(new Date(), "yyyy-MM-dd");

  // get high priority tasks that arent done yet
  let highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === "high").slice(0, 2);

  // get weak topics that need revision
  let weakTopics = subjects
    .flatMap((s) => s.chapters.flatMap((c) => c.topics))
    .filter((t) => t.status === "weak")
    .slice(0, 2);

  // get challenges that havent been logged today
  let activeChallenges = challenges
    .filter((c) => !c.completedDays.includes(todayStr))
    .slice(0, 1);

  // calculate pomodoro goal for today
  let todaysFocus = pomodoroSessions
    .filter((s) => s.completedAt.startsWith(todayStr) && s.type === "focus").length;
  let pomodoroGoal = Math.max(4, todaysFocus + 2);

  // dismiss the mission for today
  function dismiss() {
    dismissMission(todayStr);
    setVisible(false);
  }

  return (
    <div className="mb-6 animate-fade-in">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background overflow-hidden shadow-lg shadow-primary/5">
        {/* left accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

        {/* close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-5">
          {/* title */}
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Today's Mission</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* priority tasks section */}
            {highPriorityTasks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Brain className="h-3 w-3" /> Priority Tasks
                </p>
                <ul className="space-y-1.5">
                  {highPriorityTasks.map((t) => (
                    <li key={t.id} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span className="font-medium">{t.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* revision and challenges section */}
            {(weakTopics.length > 0 || activeChallenges.length > 0) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Revision & Challenges
                </p>
                <ul className="space-y-1.5">
                  {weakTopics.map((t) => (
                    <li key={t.id} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className="font-medium text-amber-700 dark:text-amber-400">Revise: {t.name}</span>
                    </li>
                  ))}
                  {activeChallenges.map((c) => (
                    <li key={c.id} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <span className="font-medium">Challenge: {c.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* pomodoro goal footer */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Pomodoro Goal: <strong className="text-foreground">{todaysFocus} / {pomodoroGoal}</strong> sessions</span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => window.location.href = "/pomodoro"}>
              Start Focus Session &rarr;
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
