"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app-store";

// all the sidebar menu items
let sidebarLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/todo", label: "To-Do List" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/planner", label: "Study Planner" },
  { href: "/calendar", label: "Weekly Planner" },
  { href: "/challenges", label: "Challenges" },
  { href: "/sticky-notes", label: "Sticky Notes" },
  { href: "/whiteboard", label: "Whiteboard" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/posts", label: "Posts" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();
  let { anonymousId } = useAppStore();

  return (
    <div>
      {/* sidebar */}
      <div className="sidebar">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #ddd", marginBottom: "8px" }}>
          <h2 style={{ fontSize: "18px", margin: 0, color: "#1a73e8" }}>StudySync</h2>
        </div>
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        {anonymousId && (
          <div style={{ padding: "12px 16px", fontSize: "11px", color: "#999", borderTop: "1px solid #ddd", marginTop: "8px" }}>
            ID: {anonymousId}
          </div>
        )}
      </div>

      {/* main content */}
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
