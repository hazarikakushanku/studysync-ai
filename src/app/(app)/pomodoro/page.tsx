"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { formatDuration } from "@/lib/utils";

export default function PomodoroPage() {
  let {
    focusDuration, breakDuration, setFocusDuration, setBreakDuration,
    addPomodoroSession, pomodoroSessions,
  } = useAppStore();

  let [mode, setMode] = useState<"focus" | "break">("focus");
  let [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  let [running, setRunning] = useState(false);
  let [showSettings, setShowSettings] = useState(false);
  let [tempFocus, setTempFocus] = useState(focusDuration);
  let [tempBreak, setTempBreak] = useState(breakDuration);
  let intervalRef = useRef<NodeJS.Timeout | null>(null);

  let totalSeconds = mode === "focus" ? focusDuration * 60 : breakDuration * 60;

  // today's stats
  let today = new Date().toISOString().split("T")[0];
  let todayFocus = pomodoroSessions.filter((s) => s.completedAt.startsWith(today) && s.type === "focus");
  let todayMinutes = todayFocus.reduce((s, p) => s + p.duration, 0);

  let completeSession = useCallback(() => {
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
    alert(mode === "focus" ? "Focus session done! Take a break." : "Break over! Time to focus.");
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

  function reset() {
    setRunning(false);
    setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
  }

  let mins = Math.floor(timeLeft / 60);
  let secs = timeLeft % 60;

  function saveSettings() {
    setFocusDuration(tempFocus);
    setBreakDuration(tempBreak);
    setTimeLeft(mode === "focus" ? tempFocus * 60 : tempBreak * 60);
    setRunning(false);
    setShowSettings(false);
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Pomodoro Timer</h1>

      {/* mode toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button className={"btn " + (mode === "focus" ? "btn-primary" : "btn-outline")}
          onClick={() => { setMode("focus"); setTimeLeft(focusDuration * 60); setRunning(false); }}>
          Focus
        </button>
        <button className={"btn " + (mode === "break" ? "btn-primary" : "btn-outline")}
          onClick={() => { setMode("break"); setTimeLeft(breakDuration * 60); setRunning(false); }}>
          Break
        </button>
        <button className="btn btn-outline" onClick={() => { setTempFocus(focusDuration); setTempBreak(breakDuration); setShowSettings(true); }}
          style={{ marginLeft: "auto" }}>
          Settings
        </button>
      </div>

      {/* timer display */}
      <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "64px", fontWeight: "bold", fontFamily: "monospace", marginBottom: "8px", color: mode === "focus" ? "#1a73e8" : "#28a745" }}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px", textTransform: "capitalize" }}>
          {mode} mode — {mode === "focus" ? focusDuration : breakDuration} min
        </p>

        {/* progress bar */}
        <div className="progress-bar" style={{ marginBottom: "24px" }}>
          <div className="progress-fill" style={{
            width: ((totalSeconds - timeLeft) / totalSeconds * 100) + "%",
            background: mode === "focus" ? "#1a73e8" : "#28a745"
          }}></div>
        </div>

        {/* controls */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button className={"btn " + (running ? "btn-secondary" : "btn-primary")}
            style={{ padding: "10px 32px", fontSize: "16px" }}
            onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button className="btn btn-outline" onClick={reset} style={{ padding: "10px 16px", fontSize: "16px" }}>
            Reset
          </button>
        </div>
      </div>

      {/* today stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Total Focus Today</div>
          <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: "4px" }}>{formatDuration(todayMinutes)}</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Sessions Today</div>
          <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: "4px" }}>{todayFocus.length}</div>
        </div>
      </div>

      {/* settings modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Timer Settings</h2>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Focus Duration (minutes)</label>
              <input type="number" min={1} max={120} value={tempFocus} onChange={(e) => setTempFocus(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Break Duration (minutes)</label>
              <input type="number" min={1} max={30} value={tempBreak} onChange={(e) => setTempBreak(Number(e.target.value))} />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveSettings}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
