"use client";

import { useAppStore } from "@/stores/app-store";
import { useTheme } from "@/components/providers/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Monitor, Shield, Clock, Bell, User } from "lucide-react";

export default function SettingsPage() {
  const { anonymousId, isOnLeaderboard, toggleLeaderboard, focusDuration, breakDuration, setFocusDuration, setBreakDuration } = useAppStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Anonymous ID</p>
              <p className="text-xs text-muted-foreground">Your public identifier on the platform</p>
            </div>
            <Badge variant="outline">{anonymousId || "Not set"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sun className="h-4 w-4" /> Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {([
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border text-sm transition-colors ${
                  theme === opt.value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pomodoro Settings */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Pomodoro Timer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Focus (minutes)</Label>
              <Input type="number" min={1} max={120} value={focusDuration} onChange={(e) => setFocusDuration(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Break (minutes)</Label>
              <Input type="number" min={1} max={30} value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Leaderboard</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Participate in leaderboard</p>
              <p className="text-xs text-muted-foreground">Your identity remains anonymous</p>
            </div>
            <Switch checked={isOnLeaderboard} onCheckedChange={toggleLeaderboard} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["Pomodoro break reminders", "Revision day reminders", "Mock test reminders", "Challenge accountability", "Daily goal reminders"].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
