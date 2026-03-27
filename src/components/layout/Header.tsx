"use client";

import { Bell, Search, Menu, Plus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header
      className="h-14 flex items-center px-4 lg:px-6 gap-4 shrink-0 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border"
      role="banner"
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-muted transition-colors cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile title */}
      {title && (
        <h1 className="lg:hidden text-[14px] font-semibold text-ink truncate">
          {title}
        </h1>
      )}

      {/* Search */}
      <div className="hidden sm:flex flex-1 max-w-80 items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-150">
        <Search size={13} className="shrink-0 text-ink-4" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search projects, tasks, clients…"
          className="flex-1 text-[12.5px] outline-none bg-transparent text-ink placeholder:text-ink-4"
          aria-label="Global search"
        />
        <kbd
          className="hidden md:flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-mono bg-border text-ink-4"
          aria-label="Keyboard shortcut: Ctrl K"
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 hidden sm:block" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Quick add */}
        <Link
          href="/projects"
          className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-white btn-primary cursor-pointer"
          aria-label="New project"
        >
          <Plus size={13} aria-hidden="true" />
          <span>New</span>
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-muted transition-colors cursor-pointer"
          aria-label="Notifications — 3 unread"
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange animate-status"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
