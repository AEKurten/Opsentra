import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function isOverdue(dueDate: string | Date | null | undefined): boolean {
  if (!dueDate) return false;
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return d < new Date();
}

export function getDaysUntilDue(dueDate: string | Date | null | undefined): number | null {
  if (!dueDate) return null;
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export type ProjectStatus = "active" | "on_hold" | "completed";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "admin" | "manager" | "worker";

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5", dot: "#10B981" },
  on_hold: { label: "On Hold", color: "#D97706", bg: "#FEF3C7", dot: "#F59E0B" },
  completed: { label: "Completed", color: "#2563EB", bg: "#DBEAFE", dot: "#3B82F6" },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: "To Do", color: "#64748B", bg: "#F1F5F9" },
  in_progress: { label: "In Progress", color: "#D97706", bg: "#FEF3C7" },
  done: { label: "Done", color: "#059669", bg: "#D1FAE5" },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "#DC2626", bg: "#FEE2E2" },
  medium: { label: "Medium", color: "#D97706", bg: "#FEF3C7" },
  low: { label: "Low", color: "#059669", bg: "#D1FAE5" },
};

export const USER_ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "#7C3AED", bg: "#EDE9FE" },
  manager: { label: "Manager", color: "#2563EB", bg: "#DBEAFE" },
  worker: { label: "Worker", color: "#64748B", bg: "#F1F5F9" },
};
