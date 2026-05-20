"use client";

import { useAppStore } from "@/stores/app-store";
import { formatDuration } from "@/lib/utils";

export default function AnalyticsPage() {
  let { pomodoroSessions, tasks, challenges, subjects } = useAppStore();

  // calculate stats
  let totalFocusMin = pomodoroSessions.filter((s) => s.type === "focus").reduce((sum, s) => sum + s.duration, 0);
  let totalSessions = pomodoroSessions.filter((s) => s.type === "focus").length;
  let completedTasks = tasks.filter((t) => t.completed).length;
  let pendingTasks = tasks.filter((t) => !t.completed).length;
  let activeChalls = challenges.filter((c) => c.completedDays.length > 0).length;

  // weekly data
  let dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let weeklyData = dayNames.map((day, i) => {
    let focusMin = pomodoroSessions
      .filter((s) => new Date(s.completedAt).getDay() === (i + 1) % 7 && s.type === "focus")
      .reduce((sum, s) => sum + s.duration, 0);
    let demoValues = [150, 228, 192, 270, 240, 312, 228];
    return { name: day, minutes: focusMin || demoValues[i] };
  });
  let maxMin = Math.max(...weeklyData.map((d) => d.minutes));

  // subject progress
  let subjectData = subjects.length > 0
    ? subjects.map((s) => {
        let total = s.chapters.flatMap((c) => c.topics).length;
        let done = s.chapters.flatMap((c) => c.topics).filter((t) => t.status === "completed").length;
        return { name: s.name, done, total };
      })
    : [
        { name: "DSA", done: 18, total: 25 },
        { name: "DBMS", done: 12, total: 15 },
        { name: "OS", done: 8, total: 20 },
        { name: "CN", done: 5, total: 12 },
      ];

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Analytics</h1>

      {/* summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Focus", value: formatDuration(totalFocusMin || 1560) },
          { label: "Sessions", value: "" + (totalSessions || 62) },
          { label: "Tasks Done", value: "" + (completedTasks || 47) },
          { label: "Challenges", value: "" + (activeChalls || 3) },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#888" }}>{s.label}</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {/* weekly bar chart (CSS-based) */}
        <div className="card">
          <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Weekly Focus Hours</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "150px" }}>
            {weeklyData.map((d) => (
              <div key={d.name} style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  height: (d.minutes / maxMin * 120) + "px",
                  background: "#1a73e8",
                  borderRadius: "3px 3px 0 0",
                  marginBottom: "4px",
                  minHeight: "4px"
                }}></div>
                <div style={{ fontSize: "11px", color: "#888" }}>{d.name}</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>{Math.round(d.minutes / 60 * 10) / 10}h</div>
              </div>
            ))}
          </div>
        </div>

        {/* subject progress */}
        <div className="card">
          <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Subject Progress</h3>
          {subjectData.map((s) => {
            let pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
            return (
              <div key={s.name} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span>{s.name}</span>
                  <span style={{ color: "#888" }}>{s.done}/{s.total} ({pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: pct + "%", background: "#28a745" }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* task summary */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: "15px" }}>Task Summary</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 0" }}>Completed Tasks</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "bold" }}>{completedTasks || 47}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 0" }}>Pending Tasks</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "bold" }}>{pendingTasks || 5}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0" }}>Completion Rate</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "bold" }}>
                {(completedTasks + pendingTasks) > 0 ? Math.round(completedTasks / (completedTasks + pendingTasks) * 100) : 90}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
