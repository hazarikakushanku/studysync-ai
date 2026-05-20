"use client";

import { useState } from "react";
import { useAppStore, type Task } from "@/stores/app-store";

let categories: Task["category"][] = ["study", "revision", "mock-test", "project", "assignment"];
let priorities: Task["priority"][] = ["low", "medium", "high"];

export default function TodoPage() {
  let { tasks, addTask, toggleTask, deleteTask } = useAppStore();

  let [showForm, setShowForm] = useState(false);
  let [title, setTitle] = useState("");
  let [desc, setDesc] = useState("");
  let [priority, setPriority] = useState<Task["priority"]>("medium");
  let [category, setCategory] = useState<Task["category"]>("study");
  let [subject, setSubject] = useState("");
  let [dueDate, setDueDate] = useState("");
  let [filter, setFilter] = useState("all");

  function handleAdd() {
    if (!title.trim()) return;
    addTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: desc.trim() || undefined,
      completed: false,
      priority,
      category,
      subject: subject.trim() || undefined,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    });
    setTitle(""); setDesc(""); setSubject(""); setDueDate("");
    setPriority("medium"); setCategory("study"); setShowForm(false);
  }

  // filter tasks
  let filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    if (categories.includes(filter as Task["category"])) return t.category === filter;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", margin: 0 }}>To-Do List</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>
            {tasks.filter((t) => !t.completed).length} pending, {tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Task</button>
      </div>

      {/* filter buttons */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "16px" }}>
        {["all", "pending", "completed", ...categories].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={"btn " + (filter === f ? "btn-primary" : "btn-outline")}
            style={{ fontSize: "12px", padding: "4px 10px", textTransform: "capitalize" }}>
            {f.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* task list */}
      <div className="card">
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "30px 0" }}>
            {filter === "all" ? "No tasks yet. Click 'Add Task' to create one." : "No tasks in this filter."}
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "8px 4px", width: "30px" }}></th>
                <th style={{ padding: "8px 4px" }}>Task</th>
                <th style={{ padding: "8px 4px" }}>Priority</th>
                <th style={{ padding: "8px 4px" }}>Category</th>
                <th style={{ padding: "8px 4px" }}>Due</th>
                <th style={{ padding: "8px 4px", width: "60px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px 4px" }}>
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                  </td>
                  <td style={{ padding: "8px 4px", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#aaa" : "#333" }}>
                    {task.title}
                    {task.subject && <span style={{ color: "#888", fontSize: "12px" }}> ({task.subject})</span>}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    <span className={"badge " + (task.priority === "high" ? "badge-red" : task.priority === "medium" ? "badge-yellow" : "badge-blue")}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    <span className="badge">{task.category.replace("-", " ")}</span>
                  </td>
                  <td style={{ padding: "8px 4px", fontSize: "12px", color: "#888" }}>
                    {task.dueDate || "-"}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    <button onClick={() => deleteTask(task.id)} style={{
                      background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "16px"
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* add task modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Task</h2>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Title *</label>
              <input type="text" placeholder="What do you need to do?" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Description</label>
              <input type="text" placeholder="Optional details" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label className="form-label">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as Task["category"])}>
                  {categories.map((c) => <option key={c} value={c}>{c.replace("-", " ")}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label className="form-label">Subject</label>
                <input type="text" placeholder="e.g., DSA" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={!title.trim()}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
