"use client";

import { useState } from "react";
import { useAppStore, type StickyNote } from "@/stores/app-store";

let noteColors: Record<string, { bg: string; border: string }> = {
  yellow: { bg: "#fff9c4", border: "#fdd835" },
  blue: { bg: "#bbdefb", border: "#42a5f5" },
  green: { bg: "#c8e6c9", border: "#66bb6a" },
  pink: { bg: "#f8bbd0", border: "#ec407a" },
  purple: { bg: "#e1bee7", border: "#ab47bc" },
};

let colorOptions: StickyNote["color"][] = ["yellow", "blue", "green", "pink", "purple"];

export default function StickyNotesPage() {
  let { stickyNotes, addStickyNote, deleteStickyNote, subjects } = useAppStore();
  let [showForm, setShowForm] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [color, setColor] = useState<StickyNote["color"]>("yellow");
  let [selectedSubject, setSelectedSubject] = useState("");
  let [selectedChapter, setSelectedChapter] = useState("");

  function handleCreate() {
    if (!title.trim() || !content.trim()) return;
    addStickyNote({
      id: crypto.randomUUID(), title: title.trim(), content: content.trim(), color,
      subject: selectedSubject || undefined, chapter: selectedChapter || undefined,
      pinned: false, createdAt: new Date().toISOString(),
    });
    setTitle(""); setContent(""); setSelectedSubject(""); setSelectedChapter(""); setColor("yellow"); setShowForm(false);
  }

  let activeSubjectData = subjects.find((s) => s.name === selectedSubject);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Sticky Notes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Note</button>
      </div>

      {stickyNotes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          <p style={{ fontSize: "36px" }}>[Notes]</p>
          <p>No sticky notes yet. Create your first note!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
          {stickyNotes.map((note) => (
            <div key={note.id} style={{
              background: noteColors[note.color].bg,
              border: "2px solid " + noteColors[note.color].border,
              borderRadius: "6px",
              padding: "14px",
              position: "relative",
              minHeight: "120px"
            }}>
              <button onClick={() => deleteStickyNote(note.id)} style={{
                position: "absolute", top: "6px", right: "6px",
                background: "none", border: "none", cursor: "pointer", fontSize: "14px"
              }}>X</button>
              {note.subject && (
                <div style={{ fontSize: "10px", color: "#888", marginBottom: "4px" }}>
                  {note.subject} {note.chapter && "/ " + note.chapter}
                </div>
              )}
              <h4 style={{ margin: "0 0 6px", fontSize: "14px" }}>{note.title}</h4>
              <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-wrap", color: "#555" }}>{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create Sticky Note</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label className="form-label">Subject</label>
                {subjects.length > 0 ? (
                  <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); }}>
                    <option value="">-- Select --</option>
                    {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="e.g., DBMS" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                )}
              </div>
              <div>
                <label className="form-label">Chapter</label>
                {activeSubjectData ? (
                  <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
                    <option value="">-- Select --</option>
                    {activeSubjectData.chapters.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="e.g., Normalization" value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} />
                )}
              </div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Title</label>
              <input type="text" placeholder="e.g., Boyce-Codd Normal Form" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Content</label>
              <textarea placeholder="Write your key points..." rows={4} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Color</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                {colorOptions.map((c) => (
                  <button key={c} onClick={() => setColor(c)} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: noteColors[c].bg, border: color === c ? "3px solid #333" : "2px solid " + noteColors[c].border,
                    cursor: "pointer"
                  }}></button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
