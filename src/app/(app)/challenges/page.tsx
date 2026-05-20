"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { getCompletionMessage, getMissedMessage } from "@/lib/utils";

export default function ChallengesPage() {
  let { challenges, addChallenge, deleteChallenge, logChallengeDay } = useAppStore();
  let [showForm, setShowForm] = useState(false);
  let [title, setTitle] = useState("");
  let [dailyTarget, setDailyTarget] = useState("");
  let [startDate, setStartDate] = useState("");
  let [endDate, setEndDate] = useState("");
  let [feedback, setFeedback] = useState("");

  let today = new Date().toISOString().split("T")[0];

  function handleCreate() {
    if (!title.trim() || !startDate || !endDate) return;
    addChallenge({
      id: crypto.randomUUID(), title: title.trim(), dailyTarget: dailyTarget.trim(),
      startDate, endDate, completedDays: [], missedDays: [], createdAt: new Date().toISOString(),
    });
    setTitle(""); setDailyTarget(""); setStartDate(""); setEndDate(""); setShowForm(false);
  }

  function handleLog(id: string, completed: boolean) {
    logChallengeDay(id, today, completed);
    setFeedback(completed ? getCompletionMessage() : getMissedMessage());
    setTimeout(() => setFeedback(""), 4000);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Challenges</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Challenge</button>
      </div>

      {feedback && (
        <div style={{ padding: "10px", background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: "4px", fontSize: "14px", marginBottom: "12px" }}>
          {feedback}
        </div>
      )}

      {challenges.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          <p>No challenges yet. Create one to build daily discipline!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
          {challenges.map((ch) => {
            let total = ch.completedDays.length + ch.missedDays.length;
            let pct = total > 0 ? Math.round((ch.completedDays.length / total) * 100) : 0;
            let loggedToday = ch.completedDays.includes(today) || ch.missedDays.includes(today);

            return (
              <div key={ch.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px" }}>{ch.title}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>{ch.dailyTarget}</p>
                  </div>
                  <button onClick={() => deleteChallenge(ch.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                </div>

                <div className="progress-bar" style={{ marginBottom: "8px" }}>
                  <div className="progress-fill" style={{ width: pct + "%", background: "#28a745" }}></div>
                </div>

                <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>
                  {ch.completedDays.length} days - {pct}% consistency
                </div>

                {!loggedToday ? (
                  <div style={{ padding: "10px", background: "#f8f9fa", border: "1px solid #eee", borderRadius: "4px" }}>
                    <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#666" }}>Did you complete today&apos;s challenge?</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: "13px" }} onClick={() => handleLog(ch.id, true)}>Yes</button>
                      <button className="btn btn-danger" style={{ flex: 1, fontSize: "13px" }} onClick={() => handleLog(ch.id, false)}>No</button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: "6px 10px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold",
                    background: ch.completedDays.includes(today) ? "#d4edda" : "#f8d7da",
                    color: ch.completedDays.includes(today) ? "#28a745" : "#dc3545"
                  }}>
                    {ch.completedDays.includes(today) ? "Completed today!" : "Missed today"}
                  </div>
                )}

                {/* day grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginTop: "12px" }}>
                  {Array.from({ length: 21 }).map((_, i) => {
                    let d = new Date(ch.startDate);
                    d.setDate(d.getDate() + i);
                    let ds = d.toISOString().split("T")[0];
                    let done = ch.completedDays.includes(ds);
                    let missed = ch.missedDays.includes(ds);
                    return (
                      <div key={i} title={ds} style={{
                        height: "16px", borderRadius: "2px",
                        background: done ? "#28a745" : missed ? "#dc3545" : "#e0e0e0"
                      }}></div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create Challenge</h2>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Challenge Title</label>
              <input type="text" placeholder="e.g., Solve 5 DSA problems daily" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Daily Target</label>
              <input type="text" placeholder="e.g., 5 problems per day" value={dailyTarget} onChange={(e) => setDailyTarget(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div><label className="form-label">Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div><label className="form-label">End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
