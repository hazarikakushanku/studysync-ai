"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAppStore } from "@/stores/app-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isFocusMode } = useAppStore();

  if (isFocusMode) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <main className="flex-1 overflow-y-auto w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-all duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
