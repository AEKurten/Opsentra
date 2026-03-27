"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ProgressBar from "@/components/ui/ProgressBar";
import { MOCK_PROJECTS, MOCK_CLIENTS } from "@/lib/mock-data";
import {
  PROJECT_STATUS_CONFIG,
  formatDate,
  type ProjectStatus,
} from "@/lib/utils";
import { PROJECT_HEALTH_CONFIG, getProjectHealth, type Project } from "@/lib/types";
import { Plus, Search, FolderKanban, Clock, CheckSquare, Filter } from "lucide-react";
import Link from "next/link";

const STATUS_FILTERS = ["all", "active", "on_hold", "completed"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Projects"
        description={`${MOCK_PROJECTS.filter((p) => p.status === "active").length} active projects across ${MOCK_CLIENTS.length} clients`}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setNewProjectOpen(true)}
          >
            New Project
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search projects or clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="sm:max-w-xs"
          aria-label="Search projects"
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const cfg = f !== "all" ? PROJECT_STATUS_CONFIG[f as ProjectStatus] : null;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  statusFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {f === "all" ? "All" : cfg?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {(["all", "active", "on_hold", "completed"] as const).map((f) => {
          const count = f === "all" ? MOCK_PROJECTS.length : MOCK_PROJECTS.filter((p) => p.status === f).length;
          const cfg = f !== "all" ? PROJECT_STATUS_CONFIG[f as ProjectStatus] : null;
          return (
            <div key={f} className="bg-white rounded-[12px] border border-slate-100 px-4 py-3"
              style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
              <p className="text-[22px] font-bold text-slate-900 tabular-nums font-display">
                {count}
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">{f === "all" ? "Total" : cfg?.label}</p>
            </div>
          );
        })}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={24} />}
          title="No projects found"
          description={search ? `No results for "${search}"` : "Create your first project to get started."}
          action={!search ? { label: "New Project", onClick: () => setNewProjectOpen(true), icon: <Plus size={14} /> } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
      />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const health = getProjectHealth(project);
  const healthCfg = PROJECT_HEALTH_CONFIG[health];
  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const totalTasks = project._task_count || 0;
  const doneTasks = project._done_count || 0;
  const overdueTasks = project._overdue_count || 0;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`block animate-fade-in-up stagger-item`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card interactive className="h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors truncate">
              {project.name}
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5 truncate">{project.client?.name}</p>
          </div>
          <Badge color={statusCfg.color} bg={statusCfg.bg} dot dotColor={statusCfg.dot} size="sm" className="ml-2 shrink-0">
            {statusCfg.label}
          </Badge>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-[12px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Progress</span>
            <span className="tabular-nums">{doneTasks}/{totalTasks} tasks</span>
          </div>
          <ProgressBar value={progress} color="#2563EB" size="md" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock size={10} aria-hidden="true" />
              {formatDate(project.due_date)}
            </span>
            {overdueTasks > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                <CheckSquare size={10} aria-hidden="true" />
                {overdueTasks} overdue
              </span>
            )}
          </div>
          <Badge color={healthCfg.color} bg={healthCfg.bg} dot dotColor={healthCfg.dot} size="sm">
            {healthCfg.label}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}

function NewProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    client_id: "",
    status: "active" as ProjectStatus,
    start_date: new Date().toISOString().split("T")[0],
    due_date: "",
    description: "",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Fill in the project details below."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Create Project</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g. Boiler Replacement — Unit 4"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-700">Client <span className="text-red-500">*</span></label>
            <select
              className="w-full h-10 rounded-md border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            >
              <option value="">Select client…</option>
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-700">Status</label>
            <select
              className="w-full h-10 rounded-md border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
            >
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            required
          />
          <Input
            label="Due Date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Describe the project scope and objectives..."
            className="w-full rounded-md border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 px-3 py-2.5 resize-none min-h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
