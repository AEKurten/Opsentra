"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ToastContainer } from "@/components/ui/Toast";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects":  "Projects",
  "/tasks":     "Tasks",
  "/clients":   "Clients",
  "/team":      "Team",
  "/activity":  "Activity Log",
  "/settings":  "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? "Opsentra";

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />

        <main
          className="flex-1 overflow-y-auto p-5 lg:p-6"
          id="main-content"
          tabIndex={-1}
        >
          {/* Skip link target */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white"
          >
            Skip to content
          </a>
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
