"use client";

import { useState } from "react";
import { useAppStore, type RoadmapPost } from "@/stores/app-store";

let categories = ["GATE", "UPSC", "Placements", "AI/ML", "Web Dev", "Startup", "Freelancing", "Other"];

let demoRoadmaps: RoadmapPost[] = [
  { id: "1", title: "How to Crack GATE CS in 6 Months", category: "GATE", strategy: "Focus on core subjects first — DSA, DBMS, OS, TOC. Use previous year papers extensively. Last 2 months for mock tests only.", timeline: "6 months", skills: ["DSA", "DBMS", "OS", "CN"], resources: ["GATE PYQs", "GFG", "NPTEL"], authorId: "", authorAnonymousId: "STU-49281", createdAt: "2025-01-15", bookmarks: 42 },
  { id: "2", title: "Complete AI/ML Roadmap for Beginners", category: "AI/ML", strategy: "Start with Python and math fundamentals. Move to ML with scikit-learn, then deep learning with PyTorch. Build 3-4 projects.", timeline: "8 months", skills: ["Python", "Linear Algebra", "ML", "Deep Learning"], resources: ["Andrew Ng Course", "Fast.ai", "Kaggle"], authorId: "", authorAnonymousId: "STU-73921", createdAt: "2025-02-10", bookmarks: 38 },
  { id: "3", title: "Placement Preparation Strategy", category: "Placements", strategy: "Solve 300+ DSA problems. Prepare CS fundamentals. Practice system design. Mock interviews weekly.", timeline: "4 months", skills: ["DSA", "OS", "DBMS", "System Design"], resources: ["LeetCode", "InterviewBit", "Striver SDE Sheet"], authorId: "", authorAnonymousId: "STU-55102", createdAt: "2025-03-05", bookmarks: 56 },
];

export default function RoadmapsPage() {
  let { roadmapPosts, addRoadmapPost, anonymousId } = useAppStore();
  let [showForm, setShowForm] = useState(false);
  let [title, setTitle] = useState("");
  let [category, setCategory] = useState(categories[0]);
  let [strategy, setStrategy] = useState("");
  let [timeline, setTimeline] = useState("");
  let [skills, setSkills] = useState("");
  let [resources, setResources] = useState("");

  let allPosts = [...demoRoadmaps, ...roadmapPosts];

  function handleCreate() {
    if (!title.trim() || !strategy.trim()) return;
    addRoadmapPost({
      id: crypto.randomUUID(), title: title.trim(), category, strategy: strategy.trim(),
      timeline: timeline.trim(), skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      resources: resources.split(",").map((s) => s.trim()).filter(Boolean),
      authorId: "", authorAnonymousId: anonymousId || "STU-00000",
      createdAt: new Date().toISOString(), bookmarks: 0,
    });
    setTitle(""); setStrategy(""); setTimeline(""); setSkills(""); setResources(""); setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Roadmaps</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Share Roadmap</button>
      </div>

      {allPosts.map((post) => (
        <div key={post.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>{post.title}</h3>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#888", alignItems: "center" }}>
                <span className="badge badge-blue">{post.category}</span>
                <span>{post.authorAnonymousId}</span>
                <span>{post.timeline}</span>
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888" }}>{post.bookmarks} bookmarks</span>
          </div>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", margin: "8px 0" }}>{post.strategy}</p>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {post.skills.map((s) => <span key={s} className="badge" style={{ fontSize: "10px" }}>{s}</span>)}
          </div>
          {post.resources.length > 0 && (
            <p style={{ fontSize: "11px", color: "#999", marginTop: "6px" }}>Resources: {post.resources.join(", ")}</p>
          )}
        </div>
      ))}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Share a Roadmap</h2>
            <div style={{ marginBottom: "12px" }}><label className="form-label">Title</label><input type="text" placeholder="e.g., How to crack GATE" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div style={{ marginBottom: "12px" }}><label className="form-label">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div style={{ marginBottom: "12px" }}><label className="form-label">Strategy</label><textarea rows={3} placeholder="Describe your approach..." value={strategy} onChange={(e) => setStrategy(e.target.value)}></textarea></div>
            <div style={{ marginBottom: "12px" }}><label className="form-label">Timeline</label><input type="text" placeholder="e.g., 6 months" value={timeline} onChange={(e) => setTimeline(e.target.value)} /></div>
            <div style={{ marginBottom: "12px" }}><label className="form-label">Skills (comma separated)</label><input type="text" placeholder="DSA, OS" value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
            <div style={{ marginBottom: "16px" }}><label className="form-label">Resources (comma separated)</label><input type="text" placeholder="LeetCode, GFG" value={resources} onChange={(e) => setResources(e.target.value)} /></div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
