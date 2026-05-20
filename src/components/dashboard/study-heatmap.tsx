"use client";

import { useAppStore } from "@/stores/app-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, startOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

// this component shows a github-style heatmap of study activity
export function StudyHeatmap() {
  let { pomodoroSessions, tasks } = useAppStore();

  // get dates for last 365 days
  let today = new Date();
  let startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 });
  let days = eachDayOfInterval({ start: startDate, end: today });

  // build a map of date -> activity data
  let activityMap = new Map<string, { hours: number; tasks: number }>();

  // add pomodoro sessions to the map
  pomodoroSessions.forEach((s) => {
    if (s.type !== "focus") return;
    let dateStr = s.completedAt.split("T")[0];
    let existing = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
    existing.hours += s.duration / 60;
    activityMap.set(dateStr, existing);
  });

  // add completed tasks to the map
  tasks.forEach((t) => {
    if (!t.completed) return;
    let dateStr = t.createdAt.split("T")[0];
    let existing = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
    existing.tasks += 1;
    activityMap.set(dateStr, existing);
  });

  // split days into weeks (arrays of 7)
  let weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // pick color based on hours studied
  function getColor(hours: number) {
    if (hours === 0) return "bg-muted/40 dark:bg-muted/20";
    if (hours < 1) return "bg-emerald-200 dark:bg-emerald-900/40";
    if (hours < 3) return "bg-emerald-300 dark:bg-emerald-700/60";
    if (hours < 5) return "bg-emerald-400 dark:bg-emerald-500/80";
    return "bg-emerald-500 dark:bg-emerald-400";
  }

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[700px] flex gap-1">
        {/* day labels on left side */}
        <div className="flex flex-col justify-between text-[9px] text-muted-foreground mr-1 pt-4 pb-1">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* the heatmap grid */}
        <div className="flex-1">
          {/* month labels at top */}
          <div className="flex text-[10px] text-muted-foreground mb-1">
            {weeks.filter((_, i) => i % 4 === 0).map((week, i) => (
              <div key={i} className="flex-1">{monthNames[week[0].getMonth()]}</div>
            ))}
          </div>

          {/* grid of colored squares */}
          <div className="flex gap-1">
            <TooltipProvider delayDuration={100}>
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {week.map((day, j) => {
                    let dateStr = format(day, "yyyy-MM-dd");
                    let data = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
                    let isFuture = day > today;

                    return (
                      <Tooltip key={j}>
                        <TooltipTrigger asChild>
                          <div
                            className={
                              "h-3 w-3 rounded-sm " +
                              (isFuture ? "bg-transparent" : getColor(data.hours)) +
                              (isSameDay(day, today) ? " ring-1 ring-ring ring-offset-1 ring-offset-background" : "")
                            }
                          />
                        </TooltipTrigger>
                        {!isFuture && (
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-semibold mb-1">{format(day, "MMM d, yyyy")}</p>
                            <p className="text-muted-foreground">{data.hours.toFixed(1)}h focused</p>
                            <p className="text-muted-foreground">{data.tasks} tasks done</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* color legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted/40 dark:bg-muted/20" />
          <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
          <div className="h-3 w-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/60" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-500/80" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
