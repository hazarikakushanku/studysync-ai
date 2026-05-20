"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Settings2, Clock, Flame } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDuration } from "@/lib/utils";

export default function PomodoroPage() {
  const { focusDuration, breakDuration, setFocusDuration, setBreakDuration, addPomodoroSession, pomodoroSessions } = useAppStore();
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [running, setRunning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempFocus, setTempFocus] = useState(focusDuration);
  const [tempBreak, setTempBreak] = useState(breakDuration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = mode === "focus" ? focusDuration * 60 : breakDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const today = new Date().toISOString().split("T")[0];
  const todayFocus = pomodoroSessions.filter((s) => s.completedAt.startsWith(today) && s.type === "focus");
  const todayMinutes = todayFocus.reduce((s, p) => s + p.duration, 0);
  const sessionsToday = todayFocus.length;

  const completeSession = useCallback(() => {
    addPomodoroSession({
      id: crypto.randomUUID(),
      duration: mode === "focus" ? focusDuration : breakDuration,
      type: mode,
      completedAt: new Date().toISOString(),
    });
    if (mode === "focus") {
      setMode("break");
      setTimeLeft(breakDuration * 60);
    } else {
      setMode("focus");
      setTimeLeft(focusDuration * 60);
    }
    setRunning(false);
  }, [mode, focusDuration, breakDuration, addPomodoroSession]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { completeSession(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, completeSession]);

  const reset = () => { setRunning(false); setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60); };
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const saveSettings = () => {
    setFocusDuration(tempFocus);
    setBreakDuration(tempBreak);
    setTimeLeft(mode === "focus" ? tempFocus * 60 : tempBreak * 60);
    setRunning(false);
    setSettingsOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
          <p className="text-sm text-muted-foreground mt-1">Stay focused, take regular breaks.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setTempFocus(focusDuration); setTempBreak(breakDuration); setSettingsOpen(true); }}>
          <Settings2 className="h-4 w-4 mr-2" /> Settings
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => { setMode("focus"); setTimeLeft(focusDuration * 60); setRunning(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "focus" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          Focus
        </button>
        <button onClick={() => { setMode("break"); setTimeLeft(breakDuration * 60); setRunning(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "break" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          Break
        </button>
      </div>

      {/* Timer Display */}
      <Card>
        <CardContent className="py-16 flex flex-col items-center">
          <div className="relative w-56 h-56 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" className="stroke-muted" strokeWidth="6" />
              <circle cx="60" cy="60" r="54" fill="none" className="stroke-primary" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tabular-nums">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
              <span className="text-sm text-muted-foreground mt-1 capitalize">{mode} mode</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="lg" onClick={() => setRunning(!running)} className="gap-2 px-8">
              {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {timeLeft === totalSeconds ? "Start" : "Resume"}</>}
            </Button>
            <Button variant="outline" size="icon" onClick={reset} className="h-11 w-11">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total Focus</p>
              <p className="font-semibold">{formatDuration(todayMinutes)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="font-semibold">{sessionsToday} today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Timer Settings</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Focus Duration (minutes)</Label>
              <Input type="number" min={1} max={120} value={tempFocus} onChange={(e) => setTempFocus(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Break Duration (minutes)</Label>
              <Input type="number" min={1} max={30} value={tempBreak} onChange={(e) => setTempBreak(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={saveSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
