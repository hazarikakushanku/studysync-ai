"use client";

import { useState } from "react";
import { useAppStore, type Chapter, type Topic } from "@/stores/app-store";

export default function PlannerPage() {
  let { subjects, addSubject, deleteSubject, updateTopicStatus } = useAppStore();
  let [showForm, setShowForm] = useState(false);
  let [subjectName, setSubjectName] = useState("");
  let [chaptersInput, setChaptersInput] = useState("");
  let [expanded, setExpanded] = useState<Record<string, boolean>>({});
  let [addTopicFor, setAddTopicFor] = useState<{ subjectId: string; chapterId: string } | null>(null);
  let [topicName, setTopicName] = useState("");

  function handleCreate() {
    if (!subjectName.trim()) return;
    let chapters: Chapter[] = chaptersInput.split(",").map((c) => c.trim()).filter(Boolean)
      .map((name) => ({ id: crypto.randomUUID(), name, topics: [] }));
    addSubject({ id: crypto.randomUUID(), name: subjectName.trim(), chapters });
    setSubjectName(""); setChaptersInput(""); setShowForm(false);
  }

  function handleAddTopic() {
    if (!addTopicFor || !topicName.trim()) return;
    let sub = subjects.find((s) => s.id === addTopicFor.subjectId);
    if (!sub) return;
    let newTopic: Topic = { id: crypto.randomUUID(), name: topicName.trim(), status: "pending" };
    let updatedChapters = sub.chapters.map((c) =>
      c.id === addTopicFor.chapterId ? { ...c, topics: [...c.topics, newTopic] } : c
    );
    useAppStore.getState().updateSubject(addTopicFor.subjectId, { chapters: updatedChapters });
    setTopicName(""); setAddTopicFor(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Study Planner</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Subject</button>
      </div>

      {subjects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          <p style={{ fontSize: "16px" }}>No subjects yet.</p>
          <p>Click &quot;Add Subject&quot; to start planning your studies.</p>
        </div>
      ) : (
        subjects.map((sub) => {
          let allTopics = sub.chapters.flatMap((c) => c.topics);
          let done = allTopics.filter((t) => t.status === "completed").length;
          let weak = allTopics.filter((t) => t.status === "weak").length;
          let pct = allTopics.length > 0 ? Math.round((done / allTopics.length) * 100) : 0;

          return (
            <div key={sub.id} className="card" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>{sub.name}</h3>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {allTopics.length} topics - {done} done
                    {weak > 0 && <span style={{ color: "red" }}> - {weak} weak</span>}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong>{pct}%</strong>
                  <button onClick={() => deleteSubject(sub.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>Delete</button>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: "12px" }}>
                <div className="progress-fill" style={{ width: pct + "%", background: "#28a745" }}></div>
              </div>

              {sub.chapters.map((ch) => (
                <div key={ch.id} style={{ marginLeft: "12px" }}>
                  <div onClick={() => setExpanded((p) => ({ ...p, [ch.id]: !p[ch.id] }))}
                    style={{ cursor: "pointer", padding: "6px 0", fontSize: "14px", fontWeight: "600", color: "#555", borderBottom: "1px solid #f0f0f0" }}>
                    {expanded[ch.id] ? "v" : ">"} {ch.name} ({ch.topics.length} topics)
                  </div>

                  {expanded[ch.id] && (
                    <div style={{ marginLeft: "20px", paddingTop: "4px" }}>
                      {ch.topics.map((topic) => (
                        <div key={topic.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", fontSize: "13px" }}>
                          <span style={{
                            display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
                            background: topic.status === "completed" ? "#28a745" : topic.status === "weak" ? "#dc3545" : "#ffc107"
                          }}></span>
                          <span style={{ flex: 1 }}>{topic.name}</span>
                          <select value={topic.status}
                            onChange={(e) => updateTopicStatus(sub.id, ch.id, topic.id, e.target.value as Topic["status"])}
                            style={{ fontSize: "11px", padding: "2px 4px", width: "auto" }}>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="weak">Weak</option>
                          </select>
                        </div>
                      ))}
                      <button onClick={() => setAddTopicFor({ subjectId: sub.id, chapterId: ch.id })}
                        style={{ fontSize: "12px", color: "#1a73e8", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                        + Add topic
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })
      )}

      {/* add subject modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Subject</h2>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Subject Name</label>
              <input type="text" placeholder="e.g., DBMS" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Chapters (comma separated)</label>
              <input type="text" placeholder="e.g., Normalization, SQL, Transactions" value={chaptersInput} onChange={(e) => setChaptersInput(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* add topic modal */}
      {addTopicFor && (
        <div className="modal-overlay" onClick={() => setAddTopicFor(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Topic</h2>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Topic Name</label>
              <input type="text" placeholder="e.g., B+ Trees" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setAddTopicFor(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddTopic}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
