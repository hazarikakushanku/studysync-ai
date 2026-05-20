"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalIcon, BookOpen, FileText } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultPlan: Record<string, { tasks: string[]; type: string }> = {
  Monday: { tasks: ["Core subject study", "Practice problems"], type: "Study" },
  Tuesday: { tasks: ["New topics", "Note-making"], type: "Study" },
  Wednesday: { tasks: ["Problem solving", "Concept revision"], type: "Study" },
  Thursday: { tasks: ["Mock test prep", "Weak areas"], type: "Study" },
  Friday: { tasks: ["Project work", "Skill practice"], type: "Study" },
  Saturday: { tasks: ["Full revision", "Formula review", "Sticky notes review"], type: "Revision" },
  Sunday: { tasks: ["Mock test", "Performance analysis", "Plan next week"], type: "Mock Test" },
};

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  const typeColors: Record<string, string> = {
    Study: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Revision: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    "Mock Test": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Weekly Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">Plan your week with built-in revision and mock test days.</p>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg border p-3 text-center transition-all duration-150 ${
              selectedDay === day
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <p className="text-xs font-medium">{day.slice(0, 3)}</p>
            <div className={`h-1.5 w-1.5 rounded-full mx-auto mt-1.5 ${
              defaultPlan[day].type === "Revision" ? "bg-amber-400" :
              defaultPlan[day].type === "Mock Test" ? "bg-violet-400" : "bg-blue-400"
            }`} />
          </button>
        ))}
      </div>

      {/* Day Detail */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{selectedDay}</CardTitle>
            <Badge className={`mt-1.5 text-[10px] ${typeColors[defaultPlan[selectedDay].type]}`}>
              {defaultPlan[selectedDay].type}
            </Badge>
          </div>
          {defaultPlan[selectedDay].type === "Revision" && <BookOpen className="h-5 w-5 text-amber-500" />}
          {defaultPlan[selectedDay].type === "Mock Test" && <FileText className="h-5 w-5 text-violet-500" />}
          {defaultPlan[selectedDay].type === "Study" && <CalIcon className="h-5 w-5 text-blue-500" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {defaultPlan[selectedDay].tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
          {defaultPlan[selectedDay].type === "Revision" && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-300">
              Saturday is revision day. Review all topics studied during the week.
            </div>
          )}
          {defaultPlan[selectedDay].type === "Mock Test" && (
            <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30 p-3 text-sm text-violet-700 dark:text-violet-300">
              Sunday is mock test day. Take a full-length test and analyze your performance.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-blue-400" /> Study Day</span>
        <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Revision Day</span>
        <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Mock Test Day</span>
      </div>
    </div>
  );
}
