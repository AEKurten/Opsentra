"use client";

import { useState } from "react";
import { use } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_COMMENTS, MOCK_ACTIVITY_LOG, MOCK_USERS } from "@/lib/mock-data";
import {
  PROJECT_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
  TASK_PRIORITY_CONFIG,
  formatDate,
  formatRelativeTime,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/utils";
import { PROJECT_HEALTH_CONFIG, getProjectHealth } from "@/lib/types";
import {
  Clock,
  CheckSquare,
  MessageSquare,
  Activity,
  Plus,
  Calendar,
  Building2,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = MOCK_PROJECTS.find((p) => p.id === id);
  const projectTasks = MOCK_TASKS.filter((t) => t.project_id === id);
  const projectComments = MOCK_COMMENTS.filter((c) => c.project_id === id || projectTasks.some((t) => t.id === c.task_id));
  const projectActivity = MOCK_ACTIVITY_LOG.filter((a) =>
    a.entity_id === id || projectTasks.some((t) => t.id === a.entity_id)
  );

  const [activeTab, setActiveTab] = useState<"tasks" | "comments" | "activity">("tasks");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={<CheckSquare size={24} />}
          title="Project not found"
          description="This project doesn't exist or has been deleted."
          action={{ label: "Back to Projects", onClick: () => window.history.back() }}
        />
      </div>
    );
  }

  const health = getProjectHealth(project);
  const healthCfg = PROJECT_HEALTH_CONFIG[health];
  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const totalTasks = project._task_count || projectTasks.length;
  const doneTasks = project._done_count || projectTasks.filter((t) => t.status === "done").length;
  const overdueTasks = project._overdue_count || 0;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const tasksByStatus = {
    todo: projectTasks.filter((t) => t.status === "todo"),
    in_progress: projectTasks.filter((t) => t.status === "in_progress"),
    done: projectTasks.filter((t) => t.status === "done"),
  };

  const TABS = [
    { key: "tasks" as const, label: "Tasks", count: projectTasks.length, icon: CheckSquare },
    { key: "comments" as const, label: "Discussion", count: projectComments.length, icon: MessageSquare },
    { key: "activity" as const, label: "Activity", count: projectActivity.length, icon: Activity },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        title={project.name}
        breadcrumb={[{ label: "Projects", href: "/projects" }, { label: project.name }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Edit size={13} />}>Edit</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setAddTaskOpen(true)}>
              Add Task
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: main content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 rounded-[12px] p-1 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={13} aria-hidden="true" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                      activeTab === tab.key ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tasks tab */}
          {activeTab === "tasks" && (
            <div className="space-y-3">
              {projectTasks.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={<CheckSquare size={20} />}
                    title="No tasks yet"
                    description="Add tasks to track work for this project."
                    action={{ label: "Add Task", onClick: () => setAddTaskOpen(true), icon: <Plus size={13} /> }}
                  />
                </Card>
              ) : (
                (["in_progress", "todo", "done"] as TaskStatus[]).map((status) => {
                  const tasks = tasksByStatus[status];
                  if (tasks.length === 0) return null;
                  const statusCfg = TASK_STATUS_CONFIG[status];
                  return (
                    <div key={status}>
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <Badge color={statusCfg.color} bg={statusCfg.bg} size="sm">{statusCfg.label}</Badge>
                        <span className="text-[11px] text-slate-400 tabular-nums">{tasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {tasks.map((task) => {
                          const priorityCfg = TASK_PRIORITY_CONFIG[task.priority];
                          return (
                            <Card key={task.id} padding="sm" className="animate-fade-in-up">
                              <div className="flex items-start gap-3">
                                <button
                                  className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 transition-colors cursor-pointer ${
                                    task.status === "done"
                                      ? "bg-green-500 border-green-500"
                                      : "border-slate-300 hover:border-blue-400"
                                  }`}
                                  aria-label={task.status === "done" ? "Mark as incomplete" : "Mark as complete"}
                                >
                                  {task.status === "done" && (
                                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[13.5px] font-medium ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2">
                                    <Badge color={priorityCfg.color} bg={priorityCfg.bg} size="sm">
                                      {priorityCfg.label}
                                    </Badge>
                                    {task.due_date && (
                                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                        <Clock size={10} aria-hidden="true" />
                                        {formatDate(task.due_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {task.assignee && (
                                  <Avatar name={task.assignee.name} size="sm" className="shrink-0" />
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Comments tab */}
          {activeTab === "comments" && (
            <div className="space-y-3">
              {/* Comment input */}
              <Card padding="sm">
                <div className="flex gap-3">
                  <Avatar name="Aubrey Ndlovu" size="sm" className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment or update for the team..."
                      className="w-full text-[13px] text-slate-700 placeholder:text-slate-400 resize-none outline-none min-h-[72px] leading-relaxed"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      aria-label="Write a comment"
                    />
                    <div className="flex justify-end mt-2">
                      <Button variant="primary" size="sm" disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              {projectComments.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={<MessageSquare size={20} />}
                    title="No comments yet"
                    description="Start the conversation with your team."
                  />
                </Card>
              ) : (
                projectComments.map((comment) => (
                  <Card key={comment.id} padding="sm" className="animate-fade-in-up">
                    <div className="flex gap-3">
                      {comment.user && <Avatar name={comment.user.name} size="sm" className="shrink-0" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-slate-800">{comment.user?.name}</span>
                          <span className="text-[11px] text-slate-400">{formatRelativeTime(comment.created_at)}</span>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Activity tab */}
          {activeTab === "activity" && (
            <Card padding="none">
              {projectActivity.length === 0 ? (
                <EmptyState
                  icon={<Activity size={20} />}
                  title="No activity yet"
                  description="Activity is logged automatically as the team works."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {projectActivity.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 px-5 py-4 animate-fade-in-up">
                      {log.user && <Avatar name={log.user.name} size="sm" className="shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-[13px] text-slate-700">
                          <span className="font-semibold">{log.user?.name}</span>{" "}
                          {log.action.replace(/_/g, " ")}
                          {log.metadata?.task_title != null && (
                            <span className="font-medium text-blue-600"> &ldquo;{String(log.metadata.task_title)}&rdquo;</span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{formatRelativeTime(log.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right: project info sidebar */}
        <div className="space-y-4">
          {/* Project summary */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wide">Project Info</h3>
              <Badge color={statusCfg.color} bg={statusCfg.bg} dot dotColor={statusCfg.dot} size="sm">
                {statusCfg.label}
              </Badge>
            </div>
            <div className="space-y-3">
              <InfoRow icon={<Building2 size={13} />} label="Client" value={project.client?.name || "—"} />
              <InfoRow icon={<User size={13} />} label="Contact" value={project.client?.contact_person || "—"} />
              <InfoRow icon={<Calendar size={13} />} label="Start" value={formatDate(project.start_date)} />
              <InfoRow icon={<Calendar size={13} />} label="Due" value={formatDate(project.due_date)} />
            </div>

            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-[12px] mb-2">
                <span className="text-slate-500">Progress</span>
                <span className="font-semibold text-slate-700 tabular-nums">{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} color="#2563EB" size="md" />
              <p className="text-[11px] text-slate-400 mt-1.5 tabular-nums">
                {doneTasks} of {totalTasks} tasks completed
                {overdueTasks > 0 && <span className="text-red-500 ml-1">· {overdueTasks} overdue</span>}
              </p>
            </div>

            {/* Health */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Project Health</span>
                <Badge color={healthCfg.color} bg={healthCfg.bg} dot dotColor={healthCfg.dot} size="sm">
                  {healthCfg.label}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Description */}
          {project.description && (
            <Card>
              <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">{project.description}</p>
            </Card>
          )}

          {/* Task breakdown */}
          <Card>
            <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wide mb-3">Task Breakdown</h3>
            <div className="space-y-2">
              {(["in_progress", "todo", "done"] as TaskStatus[]).map((status) => {
                const count = tasksByStatus[status].length;
                const cfg = TASK_STATUS_CONFIG[status];
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
                      <span className="text-[12px] text-slate-600">{cfg.label}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-700 tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        projectId={id}
      />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-slate-400 block">{label}</span>
        <span className="text-[13px] font-medium text-slate-700">{value}</span>
      </div>
    </div>
  );
}

function AddTaskModal({ isOpen, onClose, projectId }: { isOpen: boolean; onClose: () => void; projectId: string }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assigned_to: "",
    due_date: "",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Task"
      description="Create a new task for this project."
      size="md"
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
          placeholder="e.g. Install pressure vessel"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-700">Description</label>
          <textarea
            placeholder="What needs to be done?"
            className="w-full rounded-[10px] border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 px-3 py-2.5 resize-none min-h-[72px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-700">Priority <span className="text-red-500">*</span></label>
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
        <Input
          label="Due Date"
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
        />
      </div>
    </Modal>
  );
}
