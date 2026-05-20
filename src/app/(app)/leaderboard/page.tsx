"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/app-store";
import { Trophy, Flame, Clock, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo leaderboard data
const demoEntries = [
  { anonymousId: "STU-49281", studyHours: 42, skills: ["DSA", "DBMS"], examType: "GATE", consistencyScore: 96, streak: 28 },
  { anonymousId: "STU-18273", studyHours: 38, skills: ["OS", "Networks"], examType: "GATE", consistencyScore: 91, streak: 21 },
  { anonymousId: "STU-73921", studyHours: 35, skills: ["AI/ML"], examType: "Placements", consistencyScore: 88, streak: 19 },
  { anonymousId: "STU-55102", studyHours: 32, skills: ["DSA", "System Design"], examType: "Placements", consistencyScore: 85, streak: 15 },
  { anonymousId: "STU-91034", studyHours: 30, skills: ["Polity", "History"], examType: "UPSC", consistencyScore: 82, streak: 14 },
  { anonymousId: "STU-62847", studyHours: 28, skills: ["Python", "ML"], examType: "AI/ML", consistencyScore: 79, streak: 12 },
  { anonymousId: "STU-40293", studyHours: 25, skills: ["React", "Node"], examType: "Placements", consistencyScore: 76, streak: 10 },
  { anonymousId: "STU-83716", studyHours: 22, skills: ["DSA"], examType: "Coding Interview", consistencyScore: 72, streak: 8 },
];

export default function LeaderboardPage() {
  const { isOnLeaderboard, toggleLeaderboard, anonymousId } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Anonymous competitive rankings.</p>
        </div>
        <Button variant={isOnLeaderboard ? "outline" : "default"} onClick={toggleLeaderboard} className="gap-2">
          <Shield className="h-4 w-4" />
          {isOnLeaderboard ? "Leave Leaderboard" : "Join Leaderboard"}
        </Button>
      </div>

      {isOnLeaderboard && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          You are participating as <span className="font-medium">{anonymousId || "STU-XXXXX"}</span>. Your identity is private.
        </div>
      )}

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {["daily", "weekly", "monthly"].map((period) => (
          <TabsContent key={period} value={period}>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {demoEntries.map((entry, idx) => (
                  <div key={entry.anonymousId} className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors ${
                    entry.anonymousId === anonymousId ? "bg-primary/5" : ""
                  }`}>
                    <span className={`text-lg font-bold w-8 text-center ${
                      idx === 0 ? "text-amber-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-700" : "text-muted-foreground"
                    }`}>{idx + 1}</span>
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium shrink-0">
                      {entry.anonymousId.slice(-2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{entry.anonymousId}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">{entry.examType}</Badge>
                        {entry.skills.slice(0, 2).map((s) => (
                          <span key={s} className="text-[10px] text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {entry.studyHours}h</span>
                      <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {entry.streak}d</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{entry.consistencyScore}%</p>
                      <p className="text-[10px] text-muted-foreground">consistency</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
