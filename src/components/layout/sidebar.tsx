"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, CheckSquare, Timer, BookOpen, Calendar,
  Target, StickyNote, PenTool, Trophy, Map, MessageSquare,
  BarChart3, Settings, Zap, X,
} from "lucide-react";

// all the sidebar menu items
let navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/todo", label: "To-Do List", icon: CheckSquare },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/planner", label: "Study Planner", icon: BookOpen },
  { href: "/calendar", label: "Weekly Planner", icon: Calendar },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/sticky-notes", label: "Sticky Notes", icon: StickyNote },
  { href: "/whiteboard", label: "Whiteboard", icon: PenTool },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/posts", label: "Learning Posts", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  let pathname = usePathname();
  let { sidebarOpen, setSidebarOpen, anonymousId } = useAppStore();

  return (
    <>
      {/* dark overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* logo section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold">StudySync</span>
          </Link>
          {/* close button for mobile */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* navigation links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            let isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* anonymous id at bottom */}
        {anonymousId && (
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              <div className="h-6 w-6 rounded-full bg-sidebar-accent flex items-center justify-center text-[10px] font-medium">
                {anonymousId.slice(-2)}
              </div>
              <span>{anonymousId}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
