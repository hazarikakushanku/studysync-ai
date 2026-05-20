"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";

let demoEntries = [
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
  let { isOnLeaderboard, toggleLeaderboard, anonymousId } = useAppStore();
  let [tab, setTab] = useState("weekly");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Leaderboard</h1>
        <button className={"btn " + (isOnLeaderboard ? "btn-outline" : "btn-primary")} onClick={toggleLeaderboard}>
          {isOnLeaderboard ? "Leave Leaderboard" : "Join Leaderboard"}
        </button>
      </div>

      {isOnLeaderboard && (
        <div style={{ padding: "10px", background: "#d4edda", border: "1px solid #28a745", borderRadius: "4px", fontSize: "14px", marginBottom: "12px" }}>
          You are participating as <strong>{anonymousId || "STU-XXXXX"}</strong>. Your identity is private.
        </div>
      )}

      {/* tab buttons */}
      <div className="tab-list">
        {["daily", "weekly", "monthly"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"tab-btn " + (tab === t ? "active" : "")} style={{ textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {/* leaderboard table */}
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", background: "#f8f9fa" }}>
              <th style={{ padding: "10px", textAlign: "center", width: "50px" }}>#</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Student</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Exam</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Hours</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Streak</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {demoEntries.map((entry, idx) => (
              <tr key={entry.anonymousId} style={{
                borderBottom: "1px solid #f0f0f0",
                background: entry.anonymousId === anonymousId ? "#e8f0fe" : "white"
              }}>
                <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold",
                  color: idx === 0 ? "#ffd700" : idx === 1 ? "#aaa" : idx === 2 ? "#cd7f32" : "#888"
                }}>{idx + 1}</td>
                <td style={{ padding: "10px" }}>
                  <strong>{entry.anonymousId}</strong>
                  <div style={{ fontSize: "11px", color: "#888" }}>{entry.skills.join(", ")}</div>
                </td>
                <td style={{ padding: "10px" }}><span className="badge badge-blue">{entry.examType}</span></td>
                <td style={{ padding: "10px", textAlign: "center" }}>{entry.studyHours}h</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{entry.streak}d</td>
                <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold" }}>{entry.consistencyScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
