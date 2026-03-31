"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, Building2, Activity, Settings, Zap, X, ClipboardList,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard",    icon: LayoutDashboard },
      { href: "/projects",  label: "Projects",     icon: FolderKanban    },
      { href: "/tasks",     label: "Tasks",        icon: CheckSquare     },
      { href: "/jobs",      label: "Jobs",         icon: ClipboardList   },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/clients",   label: "Clients",      icon: Building2       },
      { href: "/team",      label: "Team",         icon: Users           },
      { href: "/activity",  label: "Activity Log", icon: Activity        },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/settings",  label: "Settings",     icon: Settings        },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 h-full flex flex-col bg-navy shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 btn-primary">
          <Zap size={15} className="text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-white leading-none font-display">
            Opsentra
          </p>
          <p className="text-[9.5px] text-white/40 uppercase tracking-widest mt-0.5">EOS Platform</p>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold text-white/25 uppercase tracking-widest">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary/20 text-white"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {/* Active accent */}
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full btn-primary"
                          aria-hidden="true"
                        />
                      )}
                      <Icon
                        size={15}
                        className={cn("shrink-0 transition-colors", active ? "text-primary-light" : "text-white/30")}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-status shrink-0" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white btn-primary">
            AN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-tight">Aubrey Ndlovu</p>
            <p className="text-[10px] text-white/40 truncate leading-tight">Administrator</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-success animate-status shrink-0" aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onMobileClose} aria-hidden="true" />
          <div className="relative animate-slide-left">
            <SidebarContent onMobileClose={onMobileClose} />
          </div>
        </div>
      )}
    </>
  );
}
