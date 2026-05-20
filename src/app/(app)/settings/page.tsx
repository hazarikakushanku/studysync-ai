"use client";

import { useAppStore } from "@/stores/app-store";

export default function SettingsPage() {
  let { anonymousId, isOnLeaderboard, toggleLeaderboard, focusDuration, breakDuration, setFocusDuration, setBreakDuration } = useAppStore();

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Settings</h1>

      {/* profile */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Profile</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>Anonymous ID</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Your public identifier on the platform</div>
          </div>
          <span className="badge badge-blue">{anonymousId || "Not set"}</span>
        </div>
      </div>

      {/* pomodoro settings */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Pomodoro Timer</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="form-label">Focus (minutes)</label>
            <input type="number" min={1} max={120} value={focusDuration} onChange={(e) => setFocusDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="form-label">Break (minutes)</label>
            <input type="number" min={1} max={30} value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* leaderboard */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Leaderboard</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>Participate in leaderboard</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Your identity remains anonymous</div>
          </div>
          <button className={"toggle " + (isOnLeaderboard ? "on" : "")} onClick={toggleLeaderboard}></button>
        </div>
      </div>

      {/* notifications */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Notifications</h3>
        {["Pomodoro break reminders", "Revision day reminders", "Mock test reminders", "Challenge accountability", "Daily goal reminders"].map((label) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: "14px" }}>{label}</span>
            <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
