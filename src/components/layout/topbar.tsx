"use client";

import { useAppStore } from "@/stores/app-store";
import { useTheme } from "@/components/providers/theme-provider";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// top bar with menu button, notification, and theme toggle
export function Topbar() {
  let { toggleSidebar } = useAppStore();
  let { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* hamburger menu for mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* spacer */}
      <div className="flex-1" />

      {/* right side buttons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
