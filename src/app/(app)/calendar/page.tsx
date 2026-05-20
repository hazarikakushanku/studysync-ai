"use client";

import { useState } from "react";

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let defaultPlan: Record<string, { tasks: string[]; type: string }> = {
  Monday: { tasks: ["Core subject study", "Practice problems"], type: "Study" },
  Tuesday: { tasks: ["New topics", "Note-making"], type: "Study" },
  Wednesday: { tasks: ["Problem solving", "Concept revision"], type: "Study" },
  Thursday: { tasks: ["Mock test prep", "Weak areas"], type: "Study" },
  Friday: { tasks: ["Project work", "Skill practice"], type: "Study" },
  Saturday: { tasks: ["Full revision", "Formula review", "Sticky notes review"], type: "Revision" },
  Sunday: { tasks: ["Mock test", "Performance analysis", "Plan next week"], type: "Mock Test" },
};

export default function CalendarPage() {
  let todayIndex = new Date().getDay();
  let [selectedDay, setSelectedDay] = useState(days[todayIndex === 0 ? 6 : todayIndex - 1]);

  let typeColor: Record<string, string> = {
    Study: "#1a73e8",
    Revision: "#ff9800",
    "Mock Test": "#9c27b0",
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "4px" }}>Weekly Planner</h1>
      <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>
        Plan your week with built-in revision and mock test days.
      </p>

      {/* day buttons */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {days.map((day) => (
          <button key={day} onClick={() => setSelectedDay(day)}
            style={{
              padding: "10px 14px",
              border: selectedDay === day ? "2px solid #1a73e8" : "1px solid #ddd",
              borderRadius: "6px",
              background: selectedDay === day ? "#e8f0fe" : "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: selectedDay === day ? "bold" : "normal",
              color: selectedDay === day ? "#1a73e8" : "#555",
              flex: "1",
              textAlign: "center",
              minWidth: "80px"
            }}>
            {day.slice(0, 3)}
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: typeColor[defaultPlan[day].type],
              margin: "4px auto 0"
            }}></div>
          </button>
        ))}
      </div>

      {/* day details */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>{selectedDay}</h2>
            <span className="badge" style={{
              background: typeColor[defaultPlan[selectedDay].type] + "20",
              color: typeColor[defaultPlan[selectedDay].type],
              marginTop: "4px"
            }}>
              {defaultPlan[selectedDay].type}
            </span>
          </div>
          <span style={{ fontSize: "28px" }}>
            {defaultPlan[selectedDay].type === "Revision" ? "[R]" :
             defaultPlan[selectedDay].type === "Mock Test" ? "[T]" : "[S]"}
          </span>
        </div>

        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {defaultPlan[selectedDay].tasks.map((task, i) => (
            <li key={i} style={{ padding: "6px 0", fontSize: "14px" }}>{task}</li>
          ))}
        </ul>

        {defaultPlan[selectedDay].type === "Revision" && (
          <div style={{ marginTop: "12px", padding: "10px", background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", fontSize: "13px" }}>
            Saturday is revision day. Review all topics studied during the week.
          </div>
        )}
        {defaultPlan[selectedDay].type === "Mock Test" && (
          <div style={{ marginTop: "12px", padding: "10px", background: "#e8daef", border: "1px solid #9c27b0", borderRadius: "4px", fontSize: "13px" }}>
            Sunday is mock test day. Take a full-length test and analyze your performance.
          </div>
        )}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#888", marginTop: "12px" }}>
        <span>Study Day</span>
        <span>Revision Day</span>
        <span>Mock Test Day</span>
      </div>
    </div>
  );
}
