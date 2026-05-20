"use client";

import { useState } from "react";
import { useAppStore, type Challenge } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Flame, Target, Trash2, Check, X } from "lucide-react";
import { getCompletionMessage, getMissedMessage } from "@/lib/utils";

export default function ChallengesPage() {
  const { challenges, addChallenge, deleteChallenge, logChallengeDay } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dailyTarget, setDailyTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "missed" } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleCreate = () => {
    if (!title.trim() || !startDate || !endDate) return;
    addChallenge({
      id: crypto.randomUUID(),
      title: title.trim(),
      dailyTarget: dailyTarget.trim(),
      startDate,
      endDate,
      completedDays: [],
      missedDays: [],
      createdAt: new Date().toISOString(),
    });
    setTitle(""); setDailyTarget(""); setStartDate(""); setEndDate("");
    setOpen(false);
  };

  const handleLog = (id: string, completed: boolean) => {
    logChallengeDay(id, today, completed);
    setFeedback({
      message: completed ? getCompletionMessage() : getMissedMessage(),
      type: completed ? "success" : "missed",
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Challenges</h1>
          <p className="text-sm text-muted-foreground mt-1">Build discipline with daily accountability.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Challenge</Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`rounded-lg p-4 text-sm animate-fade-in ${
          feedback.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
            : "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground text-sm">
            <Target className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium mb-1">No challenges yet</p>
            <p>Create a challenge to start building daily discipline.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const total = ch.completedDays.length + ch.missedDays.length;
            const pct = total > 0 ? Math.round((ch.completedDays.length / total) * 100) : 0;
            const loggedToday = ch.completedDays.includes(today) || ch.missedDays.includes(today);

            return (
              <Card key={ch.id}>
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{ch.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{ch.dailyTarget}</p>
                  </div>
                  <button onClick={() => deleteChallenge(ch.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={pct} className="h-1.5" />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" /> {ch.completedDays.length} days</span>
                    <span>{pct}% consistency</span>
                  </div>

                  {/* Daily Check-in */}
                  {!loggedToday ? (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-2">Did you complete today&#39;s challenge?</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => handleLog(ch.id, true)}>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Yes
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => handleLog(ch.id, false)}>
                          <X className="h-3.5 w-3.5 text-red-500" /> No
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Badge variant={ch.completedDays.includes(today) ? "success" : "warning"} className="text-xs">
                      {ch.completedDays.includes(today) ? "Completed today" : "Missed today"}
                    </Badge>
                  )}

                  {/* Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 21 }).map((_, i) => {
                      const d = new Date(ch.startDate);
                      d.setDate(d.getDate() + i);
                      const ds = d.toISOString().split("T")[0];
                      const done = ch.completedDays.includes(ds);
                      const missed = ch.missedDays.includes(ds);
                      return (
                        <div key={i} className={`h-5 rounded-sm ${done ? "bg-emerald-500" : missed ? "bg-red-400" : "bg-muted"}`}
                          title={ds} />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Challenge</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Challenge Title</Label><Input placeholder="e.g., Solve 5 DSA problems daily" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Daily Target</Label><Input placeholder="e.g., 5 problems per day" value={dailyTarget} onChange={(e) => setDailyTarget(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
