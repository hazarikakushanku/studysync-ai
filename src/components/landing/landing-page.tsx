"use client";

import Link from "next/link";

export function LandingPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* simple navbar */}
      <nav style={{ 
        background: "#1a73e8", 
        padding: "12px 24px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "20px" }}>StudySync</h1>
        <div>
          <Link href="/login" style={{ color: "white", marginRight: "16px", textDecoration: "none" }}>Login</Link>
          <Link href="/signup" style={{ 
            color: "#1a73e8", 
            background: "white", 
            padding: "8px 16px", 
            borderRadius: "4px", 
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px"
          }}>Sign Up Free</Link>
        </div>
      </nav>

      {/* hero section */}
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px 40px", 
        background: "linear-gradient(to bottom, #e8f0fe, #f5f5f5)" 
      }}>
        <h1 style={{ fontSize: "36px", color: "#222", marginBottom: "12px" }}>
          Study Smarter with StudySync
        </h1>
        <p style={{ fontSize: "16px", color: "#666", maxWidth: "600px", margin: "0 auto 24px" }}>
          The all-in-one productivity app for students. Manage tasks, track study hours, 
          take notes, and compete with friends!
        </p>
        <Link href="/signup" style={{ 
          display: "inline-block",
          background: "#1a73e8", 
          color: "white", 
          padding: "12px 32px", 
          borderRadius: "4px", 
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px"
        }}>
          Get Started - It&apos;s Free!
        </Link>
      </div>

      {/* features section */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "32px", fontSize: "24px" }}>
          Features
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {[
            { title: "To-Do Lists", desc: "Create and manage your tasks with priorities and categories." },
            { title: "Pomodoro Timer", desc: "Focus for 25 minutes, take a break, repeat. Track your sessions." },
            { title: "Study Planner", desc: "Organize subjects, chapters and topics. Mark them as done or weak." },
            { title: "Challenges", desc: "Set daily challenges like solving 5 DSA problems and track consistency." },
            { title: "Sticky Notes", desc: "Quick notes for formulas and key points. Like flashcards!" },
            { title: "Leaderboard", desc: "Compete anonymously with other students. Your identity is private." },
            { title: "Roadmaps", desc: "Share and discover study strategies for GATE, UPSC, placements etc." },
            { title: "Analytics", desc: "Charts and graphs to see your study patterns and progress." },
          ].map((f) => (
            <div key={f.title} style={{ 
              background: "white", 
              border: "1px solid #ddd", 
              borderRadius: "6px", 
              padding: "20px",
            }}>
              <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "#666", margin: 0, lineHeight: "1.5" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* stats section */}
      <div style={{ background: "#1a73e8", padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ color: "white", marginBottom: "24px" }}>Platform Stats</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { num: "500+", label: "Active Students" },
            { num: "10,000+", label: "Tasks Completed" },
            { num: "2,500+", label: "Focus Sessions" },
            { num: "95%", label: "User Satisfaction" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{s.num}</div>
              <div style={{ fontSize: "14px", color: "#b3d4ff" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* testimonials */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>What Students Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { text: "StudySync helped me crack GATE! The pomodoro timer is amazing.", id: "STU-49281" },
            { text: "The leaderboard gives me motivation without pressure. Love it!", id: "STU-85712" },
            { text: "Challenge system changed my routine. I wake up at 5 AM now!", id: "STU-12847" },
          ].map((t) => (
            <div key={t.id} style={{ 
              background: "#fffbe6", 
              border: "1px solid #ffe58f", 
              borderRadius: "6px", 
              padding: "16px",
            }}>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: "0 0 8px" }}>
                &quot;{t.text}&quot;
              </p>
              <p style={{ fontSize: "12px", color: "#999", margin: 0, fontWeight: "bold" }}>- {t.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* call to action */}
      <div style={{ textAlign: "center", padding: "40px 20px", background: "#f0f0f0" }}>
        <h2 style={{ marginBottom: "12px" }}>Ready to start?</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Join now and start studying smarter!</p>
        <Link href="/signup" style={{ 
          display: "inline-block",
          background: "#28a745", 
          color: "white", 
          padding: "12px 32px", 
          borderRadius: "4px", 
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Create Free Account
        </Link>
      </div>

      {/* basic footer */}
      <footer style={{ 
        textAlign: "center", 
        padding: "20px", 
        borderTop: "1px solid #ddd", 
        fontSize: "13px", 
        color: "#999" 
      }}>
        © 2025 StudySync. Made for students. All rights reserved.
      </footer>
    </div>
  );
}
