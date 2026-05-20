"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";

export default function PostsPage() {
  let { learningPosts, addLearningPost, anonymousId } = useAppStore();
  let [content, setContent] = useState("");

  function handlePost() {
    if (!content.trim()) return;
    addLearningPost({
      id: crypto.randomUUID(), content: content.trim(),
      authorAnonymousId: anonymousId || "STU-00000", createdAt: new Date().toISOString(),
    });
    setContent("");
  }

  let demoPosts = [
    { id: "d1", content: "Learned Binary Search Trees and AVL rotations today. Implementing self-balancing trees was challenging but rewarding.", authorAnonymousId: "STU-49281", createdAt: "2025-05-19T18:00:00Z" },
    { id: "d2", content: "Completed CNN basics — convolution layers, pooling, and built a simple image classifier with 92% accuracy.", authorAnonymousId: "STU-73921", createdAt: "2025-05-19T15:30:00Z" },
    { id: "d3", content: "Solved 5 DSA problems on LeetCode — 2 medium, 3 easy. Getting faster with sliding window pattern.", authorAnonymousId: "STU-55102", createdAt: "2025-05-18T20:00:00Z" },
  ];

  let allPosts = [...learningPosts, ...demoPosts];

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Learning Posts</h1>

      {/* compose box */}
      <div className="card">
        <textarea placeholder="What did you learn today?" rows={3} value={content} onChange={(e) => setContent(e.target.value)} style={{ marginBottom: "8px" }}></textarea>
        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" onClick={handlePost} disabled={!content.trim()}>Post</button>
        </div>
      </div>

      {/* feed */}
      {allPosts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
          No posts yet. Share what you learned today!
        </div>
      ) : (
        allPosts.map((post) => (
          <div key={post.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%", background: "#e8e8e8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold"
              }}>{post.authorAnonymousId.slice(-2)}</div>
              <strong style={{ fontSize: "13px" }}>{post.authorAnonymousId}</strong>
              <span style={{ fontSize: "11px", color: "#999" }}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
