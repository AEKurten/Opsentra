"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_USERS } from "@/lib/mock-data";
import {
  TASK_STATUS_CONFIG,
  TASK_PRIORITY_CONFIG,
  formatDate,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/utils";
import { type Task } from "@/lib/types";
import {
  Plus,
  CheckSquare,
  LayoutGrid,
  List,
  Search,
  Clock,
  Filter,
} from "lucide-react";

type ViewMode = "kanban" | "list";

const COLUMNS: { status: TaskStatus; label: string; color: string; bg: string }[] = [
  { status: "todo", label: "To Do", color: "#64748B", bg: "#F1F5F9" },
  { status: "in_progress", label: "In Progress", color: "#D97706", bg: "#FEF3C7" },
  { status: "done", label: "Done", color: "#059669", bg: "#D1FAE5" },
];

export default function TasksPage() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const allTasks = MOCK_TASKS.map((t) => ({
    ...t,
    project: MOCK_PROJECTS.find((p) => p.id === t.project_id),
  }));

  const filtered = allTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.project?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const tasksByStatus = {
    todo: filtered.filter((t) => t.status === "todo"),
    in_progress: filtered.filter((t) => t.status === "in_progress"),
    done: filtered.filter((t) => t.status === "done"),
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Tasks"
        description={`${allTasks.filter((t) => t.status !== "done").length} active tasks across all projects`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddTaskOpen(true)}>
            Add Task
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={14} />}
            className="w-52"
            aria-label="Search tasks"
          />
          <div className="flex gap-1">
            {(["all", "high", "medium", "low"] as const).map((p) => {
              const cfg = p !== "all" ? TASK_PRIORITY_CONFIG[p] : null;
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                    priorityFilter === p
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {p === "all" ? "All Priority" : cfg?.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-[10px] p-1 shrink-0">
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer ${
              view === "kanban" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            aria-label="Kanban view"
            aria-pressed={view === "kanban"}
          >
            <LayoutGrid size={13} aria-hidden="true" />
            Board
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer ${
              view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List size={13} aria-hidden="true" />
            List
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const tasks = tasksByStatus[col.status];
            return (
              <div key={col.status} className="flex flex-col gap-3 min-h-[200px]">
                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} aria-hidden="true" />
                    <span className="text-[13px] font-semibold text-slate-700">{col.label}</span>
                    <span
                      className="text-[11px] font-medium px-1.5 py-0.5 rounded-full tabular-nums"
                      style={{ color: col.color, backgroundColor: col.bg }}
                    >
                      {tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddTaskOpen(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                    aria-label={`Add task to ${col.label}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Task cards */}
                {tasks.length === 0 ? (
                  <div className="flex-1 rounded-[12px] border-2 border-dashed border-slate-200 flex items-center justify-center py-8 min-h-[120px]">
                    <p className="text-[12px] text-slate-400 text-center">No {col.label.toLowerCase()} tasks</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task, i) => (
                      <KanbanTaskCard key={task.id} task={task} index={i} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card padding="none">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<CheckSquare size={24} />}
              title="No tasks found"
              description={search ? `No results for "${search}"` : "All tasks are done!"}
            />
          ) : (
            <>
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_160px_100px_90px_80px] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-[14px]">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Task</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Project</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Priority</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Assignee</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filtered.map((task, i) => {
                  const statusCfg = TASK_STATUS_CONFIG[task.status];
                  const priorityCfg = TASK_PRIORITY_CONFIG[task.priority];
                  return (
                    <div
                      key={task.id}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_160px_100px_90px_80px] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="min-w-0">
                        <p className={`text-[13px] font-medium truncate ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {task.title}
                        </p>
                        {task.due_date && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} aria-hidden="true" />
                            {formatDate(task.due_date)}
                          </p>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 truncate">{task.project?.name || "—"}</p>
                      <Badge color={statusCfg.color} bg={statusCfg.bg} size="sm" className="w-fit">{statusCfg.label}</Badge>
                      <Badge color={priorityCfg.color} bg={priorityCfg.bg} size="sm" className="w-fit">{priorityCfg.label}</Badge>
                      {task.assignee ? (
                        <Avatar name={task.assignee.name} size="xs" />
                      ) : (
                        <span className="text-[12px] text-slate-300">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      )}

      <AddTaskModal isOpen={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </div>
  );
}

function KanbanTaskCard({ task, index }: { task: Task & { project?: typeof MOCK_PROJECTS[0] }; index: number }) {
  const priorityCfg = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <Card
      padding="sm"
      className="animate-fade-in-up card-interactive"
      style={{ animationDelay: `${index * 40}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-[13px] font-medium leading-snug ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.title}
        </p>
        <Badge color={priorityCfg.color} bg={priorityCfg.bg} size="sm" className="shrink-0">
          {priorityCfg.label}
        </Badge>
      </div>
      {task.project && (
        <p className="text-[11px] text-slate-400 mb-3 truncate">{task.project.name}</p>
      )}
      <div className="flex items-center justify-between">
        {task.due_date ? (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock size={9} aria-hidden="true" />
            {formatDate(task.due_date)}
          </span>
        ) : <span />}
        {task.assignee && <Avatar name={task.assignee.name} size="xs" />}
      </div>
    </Card>
  );
}

function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    project_id: "",
    description: "",
    priority: "medium" as TaskPriority,
    assigned_to: "",
    due_date: "",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Task"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Create Task</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-700">Project <span className="text-red-500">*</span></label>
          <select
            className="w-full h-10 rounded-[10px] border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
            value={form.project_id}
            onChange={(e) => setForm({ ...form, project_id: e.target.value })}
          >
            <option value="">Select project…</option>
            {MOCK_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-700">Priority</label>
            <select
              className="w-full h-10 rounded-[10px] border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-700">Assign To</label>
            <select
              className="w-full h-10 rounded-[10px] border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            >
              <option value="">Unassigned</option>
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Optional details..."
            rows={3}
            className="w-full rounded-[10px] border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}
