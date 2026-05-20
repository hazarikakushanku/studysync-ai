"use client";

import { useAppStore } from "@/stores/app-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, startOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

export function StudyHeatmap() {
  const { pomodoroSessions, tasks } = useAppStore();

  // Generate last 365 days (52 weeks)
  const today = new Date();
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 }); // Sunday start
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Map data to days
  const activityMap = new Map<string, { hours: number; tasks: number }>();
  
  pomodoroSessions.forEach(s => {
    if (s.type !== "focus") return;
    const dateStr = s.completedAt.split("T")[0];
    const existing = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
    existing.hours += s.duration / 60;
    activityMap.set(dateStr, existing);
  });

  tasks.forEach(t => {
    if (!t.completed) return;
    // Assuming createdAt is roughly when it was done for demo purposes if no completedAt exists. 
    // In a real app we'd track completedAt. We'll just map it to today if it's done for simplicity in demo, or use createdAt.
    const dateStr = t.createdAt.split("T")[0];
    const existing = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
    existing.tasks += 1;
    activityMap.set(dateStr, existing);
  });

  // Split into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (hours: number) => {
    if (hours === 0) return "bg-muted/40 dark:bg-muted/20";
    if (hours < 1) return "bg-emerald-200 dark:bg-emerald-900/40";
    if (hours < 3) return "bg-emerald-300 dark:bg-emerald-700/60";
    if (hours < 5) return "bg-emerald-400 dark:bg-emerald-500/80";
    return "bg-emerald-500 dark:bg-emerald-400";
  };

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[700px] flex gap-1">
        {/* Days of week labels */}
        <div className="flex flex-col justify-between text-[9px] text-muted-foreground mr-1 pt-4 pb-1">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Heatmap Grid */}
        <div className="flex-1">
          {/* Months labels (approximate spacing) */}
          <div className="flex text-[10px] text-muted-foreground mb-1">
            {weeks.filter((_, i) => i % 4 === 0).map((week, i) => (
              <div key={i} className="flex-1">{monthLabels[week[0].getMonth()]}</div>
            ))}
          </div>
          
          <div className="flex gap-1">
            <TooltipProvider delayDuration={100}>
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {week.map((day, j) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const data = activityMap.get(dateStr) || { hours: 0, tasks: 0 };
                    const isFuture = day > today;
                    
                    return (
                      <Tooltip key={j}>
                        <TooltipTrigger asChild>
                          <div 
                            className={`h-3 w-3 rounded-sm transition-colors duration-200 ${
                              isFuture ? 'bg-transparent' : getColor(data.hours)
                            } ${isSameDay(day, today) ? 'ring-1 ring-ring ring-offset-1 ring-offset-background' : ''}`} 
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
      
      {/* Legend */}
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
