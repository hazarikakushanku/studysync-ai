"use client";

// whiteboard page - just embeds excalidraw
export default function WhiteboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Whiteboard</h1>
      <p style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>Draw diagrams, flowcharts, and rough notes.</p>
      <div style={{ border: "1px solid #ddd", borderRadius: "6px", overflow: "hidden" }}>
        <iframe
          src="https://excalidraw.com"
          style={{ width: "100%", height: "calc(100vh - 140px)", border: "none" }}
          title="Whiteboard"
        />
      </div>
    </div>
  );
}
