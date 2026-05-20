"use client";

import { useAppStore } from "@/stores/app-store";
import { getGreeting, formatDuration } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  let { tasks, pomodoroSessions, challenges, anonymousId, subjects } = useAppStore();

  let today = new Date().toISOString().split("T")[0];
  let todaysSessions = pomodoroSessions.filter((s) => s.completedAt.startsWith(today) && s.type === "focus");
  let focusMinutes = todaysSessions.reduce((sum, s) => sum + s.duration, 0);
  let completedTasks = tasks.filter((t) => t.completed).length;
  let pendingTasks = tasks.filter((t) => !t.completed).length;
  let activeChallenge = challenges[0];
  let streak = activeChallenge ? activeChallenge.completedDays.length : 0;
  let totalDays = tasks.length > 0 ? Math.max(tasks.length, 1) : 1;
  let consistency = Math.min(Math.round((completedTasks / totalDays) * 100), 100);
  let highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === "high").slice(0, 3);
  let pendingTasksList = tasks.filter((t) => !t.completed).slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "4px" }}>{getGreeting()}</h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
        {anonymousId ? anonymousId + " - " : ""}Here is your study overview for today.
      </p>

      {/* stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Focus Today</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{formatDuration(focusMinutes)}</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Streak</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{streak} days</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Tasks Done</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{completedTasks}</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Consistency</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{consistency}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        {/* pending tasks */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Upcoming Tasks</h3>
            <Link href="/todo" style={{ fontSize: "13px" }}>View all</Link>
          </div>
          {pendingTasksList.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
              No pending tasks. Add some from the To-Do page.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                  <th style={{ padding: "6px 0", color: "#888", fontWeight: "normal", fontSize: "12px" }}>Task</th>
                  <th style={{ padding: "6px 0", color: "#888", fontWeight: "normal", fontSize: "12px" }}>Priority</th>
                  <th style={{ padding: "6px 0", color: "#888", fontWeight: "normal", fontSize: "12px" }}>Category</th>
                </tr>
              </thead>
              <tbody>
                {pendingTasksList.map((task) => (
                  <tr key={task.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 0" }}>{task.title}</td>
                    <td style={{ padding: "8px 0" }}>
                      <span className={"badge " + (task.priority === "high" ? "badge-red" : task.priority === "medium" ? "badge-yellow" : "badge-blue")}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: "8px 0" }}><span className="badge">{task.category}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* quick links */}
        <div className="card">
          <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { href: "/pomodoro", label: "Start Focus Session" },
              { href: "/todo", label: "Add New Task" },
              { href: "/challenges", label: "View Challenges" },
              { href: "/planner", label: "Study Planner" },
              { href: "/calendar", label: "Weekly Plan" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                display: "block", padding: "8px 12px", background: "#f8f9fa", border: "1px solid #eee",
                borderRadius: "4px", textDecoration: "none", color: "#333", fontSize: "13px"
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* high priority warning */}
      {highPriorityTasks.length > 0 && (
        <div className="card" style={{ marginTop: "16px", background: "#fff3cd", borderColor: "#ffc107" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "15px" }}>High Priority Tasks</h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {highPriorityTasks.map((t) => (
              <li key={t.id} style={{ fontSize: "14px", marginBottom: "4px" }}>{t.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* challenges */}
      {challenges.length > 0 && (
        <div className="card" style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Active Challenges</h3>
            <Link href="/challenges" style={{ fontSize: "13px" }}>View all</Link>
          </div>
          {challenges.slice(0, 2).map((ch) => {
            let total = ch.completedDays.length + ch.missedDays.length;
            let progress = total > 0 ? Math.round((ch.completedDays.length / total) * 100) : 0;
            return (
              <div key={ch.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>{ch.title}</div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{ch.dailyTarget}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: progress + "%" }}></div>
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                  {ch.completedDays.length} days completed - {progress}% done
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* study progress */}
      {subjects.length > 0 && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Study Progress</h3>
          {subjects.slice(0, 3).map((sub) => {
            let allTopics = sub.chapters.flatMap((c) => c.topics);
            let done = allTopics.filter((t) => t.status === "completed").length;
            let pct = allTopics.length > 0 ? Math.round((done / allTopics.length) * 100) : 0;
            return (
              <div key={sub.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "4px" }}>
                  <span>{sub.name}</span>
                  <span style={{ color: "#888" }}>{done}/{allTopics.length} topics</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: pct + "%", background: "#28a745" }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
