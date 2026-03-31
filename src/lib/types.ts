export type ProjectStatus = "active" | "on_hold" | "completed";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "admin" | "manager" | "worker";

export interface Client {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar_url?: string | null;
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  status: ProjectStatus;
  start_date: string;
  due_date: string;
  created_at: string;
  description?: string | null;
  // Joined
  client?: Client;
  tasks?: Task[];
  _task_count?: number;
  _overdue_count?: number;
  _done_count?: number;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  due_date: string | null;
  priority: TaskPriority;
  created_at: string;
  // Joined
  project?: Project;
  assignee?: User;
}

export interface Comment {
  id: string;
  task_id: string | null;
  project_id: string | null;
  user_id: string;
  content: string;
  created_at: string;
  // Joined
  user?: User;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: "project" | "task" | "comment" | "client" | "user";
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  // Joined
  user?: User;
}

export interface JobStatus {
  id: string;
  name: string;
  color: string;
  bg_color: string;
  sort_order: number;
  is_default: boolean;
}

export interface Workshop {
  id: string;
  name: string;
  location: string | null;
}

export interface Job {
  id: string;
  job_number: string;
  description: string;
  client_id: string;
  assigned_technician_id: string | null;
  workshop_id: string | null;
  expected_completion_date: string | null;
  status_id: string;
  created_at: string;
  // Joined
  client?: Client;
  assigned_technician?: User;
  workshop?: Workshop;
  status?: JobStatus;
}

// Dashboard stats
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  overdue_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  team_size: number;
  total_clients: number;
}

// Project health
export type ProjectHealth = "on_track" | "at_risk" | "delayed";

export function getProjectHealth(project: Project): ProjectHealth {
  const overdueCount = project._overdue_count ?? 0;
  if (overdueCount === 0) return "on_track";
  if (overdueCount >= 3) return "delayed";
  return "at_risk";
}

export const PROJECT_HEALTH_CONFIG: Record<ProjectHealth, { label: string; color: string; bg: string; dot: string }> = {
  on_track: { label: "On Track", color: "#059669", bg: "#D1FAE5", dot: "#10B981" },
  at_risk: { label: "At Risk", color: "#D97706", bg: "#FEF3C7", dot: "#F59E0B" },
  delayed: { label: "Delayed", color: "#DC2626", bg: "#FEE2E2", dot: "#EF4444" },
};
